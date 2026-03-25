/**
 * ST-823: REQ-040 -- Server-Side Turnstile Verification
 *
 * Verifies Cloudflare Turnstile tokens against the `/siteverify` API.
 * This module runs server-side only (Server Actions, API routes) and
 * requires the `TURNSTILE_SECRET_KEY` environment variable.
 *
 * The verification step is Layer 3 of the 8-layer form security model
 * defined in REQ-039. Every form submission MUST pass through this
 * verification before any data processing occurs.
 *
 * @see https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 * @see src/components/forms/turnstile-widget.tsx for the client-side widget
 *
 * ---------------------------------------------------------------------------
 * K-12 SCHOOL FIREWALL CONSIDERATIONS
 * ---------------------------------------------------------------------------
 * Many K-12 school districts use content filtering systems (Lightspeed,
 * GoGuardian, Securly, iBoss) that block `challenges.cloudflare.com` as
 * an uncategorized or CDN domain. When this happens:
 *
 * 1. The client-side Turnstile widget will fail to load (handled by
 *    `onLoadError` in TurnstileWidget).
 * 2. No token will be generated, so server verification will receive
 *    an empty/missing token.
 *
 * FUTURE FALLBACK IMPLEMENTATION (FR-SEC-031):
 * When the Turnstile script fails to load within 10 seconds, the form
 * should activate compensating controls:
 *   - Honeypot field validation (already in form schema)
 *   - Time-based challenge: minimum 3 seconds from form render to submit
 *   - JavaScript proof-of-work: find a value whose SHA-256 starts with "00"
 *   - Stricter rate limiting: 2 submissions per IP per hour (vs normal 5)
 *   - Flag submission as `turnstile_bypassed: true` for manual review
 *
 * Submissions using the fallback path skip this `verifyTurnstile` call
 * entirely and instead pass through the compensating control pipeline.
 * This fallback should be implemented as a separate function in this
 * module (e.g., `verifyFallbackChallenge`) once the fallback UI is built.
 * ---------------------------------------------------------------------------
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Maximum time (ms) to wait for the Cloudflare siteverify API response.
 * Set to 5 seconds to avoid blocking form submission flows if the
 * Cloudflare API is slow or experiencing issues.
 */
const VERIFY_TIMEOUT_MS = 5_000;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Response shape from Cloudflare's `/siteverify` endpoint. */
interface TurnstileSiteverifyResponse {
  /** Whether the token was valid and the challenge passed. */
  success: boolean;

  /** ISO 8601 timestamp of the challenge. */
  challenge_ts?: string;

  /** Hostname the challenge was issued for. */
  hostname?: string;

  /** List of error codes if verification failed. */
  "error-codes"?: string[];

  /** Action associated with the token (if configured). */
  action?: string;

  /** Custom data associated with the token (if configured). */
  cdata?: string;
}

/** Result returned by `verifyTurnstile`. */
export interface TurnstileVerifyResult {
  /** Whether the token was verified successfully. */
  success: boolean;

  /**
   * Human-readable error description when `success` is false.
   * Safe to log server-side. Do NOT expose raw error codes to the client
   * -- use a generic message in user-facing responses.
   */
  error?: string;
}

// ---------------------------------------------------------------------------
// Error code mapping
// ---------------------------------------------------------------------------

/**
 * Maps Cloudflare error codes to human-readable descriptions for logging.
 * @see https://developers.cloudflare.com/turnstile/get-started/server-side-validation/#error-codes
 */
const ERROR_CODE_DESCRIPTIONS: Record<string, string> = {
  "missing-input-secret": "The secret key was not provided",
  "invalid-input-secret": "The secret key is invalid or malformed",
  "missing-input-response": "The token was not provided",
  "invalid-input-response": "The token is invalid or has already been consumed",
  "invalid-widget-id": "The widget ID that generated the token is invalid",
  "invalid-parsed-secret": "The secret key could not be parsed",
  "bad-request": "The request was malformed",
  "timeout-or-duplicate":
    "The token has expired or has already been verified",
  "internal-error": "Cloudflare internal error -- retry may succeed",
};

/**
 * Converts an array of Cloudflare error codes into a single descriptive
 * string for server-side logging.
 */
function describeErrors(codes: string[]): string {
  if (codes.length === 0) return "Unknown verification failure";

  return codes
    .map((code) => ERROR_CODE_DESCRIPTIONS[code] ?? `Unknown error: ${code}`)
    .join("; ");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Verifies a Cloudflare Turnstile token server-side.
 *
 * Sends the token and secret key to Cloudflare's `/siteverify` endpoint
 * and returns a structured result. This function:
 *
 * - Validates that the `TURNSTILE_SECRET_KEY` environment variable exists
 * - Enforces a 5-second timeout to prevent blocking form flows
 * - Maps Cloudflare error codes to descriptive messages for logging
 * - Handles network failures gracefully
 *
 * @param token - The `cf-turnstile-response` token from the client widget.
 *
 * @returns A result object with `success: true` on valid verification,
 *          or `success: false` with an `error` description on failure.
 *
 * @example
 * ```ts
 * import { verifyTurnstile } from "@/lib/security/turnstile";
 *
 * const result = await verifyTurnstile(turnstileToken);
 * if (!result.success) {
 *   return { success: false, error: "Verification failed" };
 * }
 * ```
 */
export async function verifyTurnstile(
  token: string,
): Promise<TurnstileVerifyResult> {
  // -------------------------------------------------------------------------
  // Validate inputs
  // -------------------------------------------------------------------------

  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    // This is a deployment configuration error, not a user error.
    // Log loudly but return a generic failure to avoid leaking internals.
    console.error(
      "[turnstile] TURNSTILE_SECRET_KEY environment variable is not set. " +
        "Turnstile verification cannot proceed.",
    );
    return {
      success: false,
      error: "Server configuration error: missing Turnstile secret key",
    };
  }

  if (!token || token.trim().length === 0) {
    return {
      success: false,
      error: "Missing Turnstile token -- the client challenge may not have completed",
    };
  }

  // -------------------------------------------------------------------------
  // Call Cloudflare siteverify API
  // -------------------------------------------------------------------------

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: `Turnstile API returned HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data: TurnstileSiteverifyResponse = await response.json();

    if (data.success) {
      return { success: true };
    }

    // Verification failed -- extract error details for server-side logging
    const errorCodes = data["error-codes"] ?? [];
    const errorDescription = describeErrors(errorCodes);

    return {
      success: false,
      error: `Turnstile verification failed: ${errorDescription}`,
    };
  } catch (error: unknown) {
    // -----------------------------------------------------------------------
    // Handle network and timeout errors
    // -----------------------------------------------------------------------

    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        success: false,
        error: `Turnstile verification timed out after ${VERIFY_TIMEOUT_MS}ms`,
      };
    }

    const message =
      error instanceof Error ? error.message : "Unknown network error";

    return {
      success: false,
      error: `Turnstile verification network error: ${message}`,
    };
  }
}
