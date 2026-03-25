/**
 * ST-881: A/B Test Infrastructure -- Core Utilities
 *
 * Provides server-side A/B testing primitives: sticky session management,
 * deterministic variant assignment via hashing, and conversion tracking.
 *
 * All functions run exclusively on the server. There is no client-side SDK.
 * Session stickiness is achieved through a long-lived `ab_session` cookie
 * (90-day expiry). Variant assignment is deterministic: the same session +
 * test name always produces the same variant, even before Supabase is
 * consulted (the hash is the source of truth; the DB is the audit trail).
 *
 * @see src/actions/ab-test.ts for server actions that persist assignments
 */

import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Result of a variant assignment lookup or computation. */
export interface VariantAssignment {
  /** The test this assignment belongs to (e.g., "hero_cta_color"). */
  testName: string;
  /** The assigned variant (e.g., "control", "variant_a"). */
  variant: string;
  /** The session ID used for assignment. */
  sessionId: string;
}

/** Result of a conversion tracking operation. */
export interface ConversionResult {
  /** Whether the conversion was recorded successfully. */
  success: boolean;
  /** Diagnostic message (for server-side logging only). */
  message: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SESSION_COOKIE_NAME = "ab_session";

/** 90 days in seconds. */
const SESSION_MAX_AGE_SECONDS = 90 * 24 * 60 * 60;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Reads or creates a persistent A/B test session ID.
 *
 * If the `ab_session` cookie exists, its value is returned. Otherwise a new
 * UUIDv4-like identifier is generated, set as a cookie with a 90-day expiry,
 * and returned.
 *
 * The cookie uses `SameSite=Lax`, `HttpOnly`, and `Secure` (in production)
 * to prevent client-side tampering and cross-site leakage.
 *
 * @returns The session ID string.
 *
 * @example
 * ```ts
 * import { getOrCreateSessionId } from "@/lib/ab-test";
 *
 * const sessionId = await getOrCreateSessionId();
 * // => "a3f1b2c4-..."
 * ```
 */
export async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(SESSION_COOKIE_NAME);

  if (existing?.value) {
    return existing.value;
  }

  const sessionId = generateSessionId();

  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return sessionId;
}

/**
 * Deterministically assigns a variant for the given test and session.
 *
 * Uses a hash of `sessionId + testName` to select a variant from the
 * provided array. The assignment is stable: the same inputs always produce
 * the same output, regardless of when or how many times the function is
 * called.
 *
 * This function is pure (no side effects, no DB calls). Persistence is
 * handled by the `assignVariant` server action in `src/actions/ab-test.ts`.
 *
 * @param testName - Unique test identifier (e.g., "hero_cta_color").
 * @param variants - Array of variant names. Must contain at least one element.
 * @param sessionId - The session ID from `getOrCreateSessionId()`.
 * @returns The assigned variant assignment.
 * @throws {Error} If `variants` is empty.
 *
 * @example
 * ```ts
 * import { getVariant, getOrCreateSessionId } from "@/lib/ab-test";
 *
 * const sessionId = await getOrCreateSessionId();
 * const assignment = getVariant("hero_cta_color", ["control", "variant_a"], sessionId);
 * // => { testName: "hero_cta_color", variant: "control", sessionId: "a3f1b2c4-..." }
 * ```
 */
export function getVariant(
  testName: string,
  variants: string[],
  sessionId: string,
): VariantAssignment {
  if (variants.length === 0) {
    throw new Error(
      "[ab-test] `variants` array must contain at least one element.",
    );
  }

  const hash = fnv1aHash(`${sessionId}:${testName}`);
  const index = hash % variants.length;

  // Safe: index is always in bounds because `hash % variants.length` produces
  // a value in [0, variants.length - 1] and we checked variants.length > 0 above.
  const variant = variants[index] as string;

  return {
    testName,
    variant,
    sessionId,
  };
}

/**
 * Records a conversion event for a given test and session.
 *
 * Updates the `converted_at` timestamp on the `ab_test_assignments` row
 * matching the test name and session ID. If no assignment exists (e.g.,
 * the user was never enrolled in the test), the conversion is silently
 * ignored and a diagnostic message is returned.
 *
 * Conversions are idempotent: calling this multiple times for the same
 * test and session only records the first conversion timestamp.
 *
 * @param testName - The test identifier to record a conversion for.
 * @returns A result indicating success or failure.
 *
 * @example
 * ```ts
 * import { trackConversion } from "@/lib/ab-test";
 *
 * const result = await trackConversion("hero_cta_color");
 * // => { success: true, message: "Conversion recorded." }
 * ```
 */
export async function trackConversion(
  testName: string,
): Promise<ConversionResult> {
  try {
    const sessionId = await getOrCreateSessionId();
    const supabase = createServerSupabaseClient();

    // Only update rows where converted_at is NULL to preserve the first
    // conversion timestamp (idempotent).
    const { data, error } = await supabase
      .from("ab_test_assignments")
      .update({ converted_at: new Date().toISOString() })
      .eq("test_name", testName)
      .eq("session_id", sessionId)
      .is("converted_at", null)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("[ab-test] Failed to record conversion:", error);
      return {
        success: false,
        message: "Database error while recording conversion.",
      };
    }

    if (!data) {
      // Either no assignment exists or the conversion was already recorded.
      return {
        success: true,
        message: "No unconverted assignment found. Possibly already converted or not enrolled.",
      };
    }

    return {
      success: true,
      message: "Conversion recorded.",
    };
  } catch (error) {
    console.error("[ab-test] Unexpected error in trackConversion:", error);
    return {
      success: false,
      message: "Unexpected error while recording conversion.",
    };
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Generates a random session ID using crypto.randomUUID().
 *
 * Falls back to a timestamp-based ID if the crypto API is unavailable
 * (should not happen in Node.js 18+ / edge runtimes).
 */
function generateSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // Fallback: timestamp + random suffix. Not cryptographically strong but
  // sufficient for session bucketing.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * FNV-1a hash implementation (32-bit).
 *
 * A fast, non-cryptographic hash function with excellent distribution
 * properties for short strings. Chosen over MurmurHash to avoid an
 * external dependency; chosen over SHA-256 because cryptographic strength
 * is unnecessary for variant bucketing.
 *
 * @see https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function
 *
 * @param input - The string to hash.
 * @returns A non-negative 32-bit integer.
 */
function fnv1aHash(input: string): number {
  const FNV_OFFSET_BASIS = 0x811c9dc5;
  const FNV_PRIME = 0x01000193;

  let hash = FNV_OFFSET_BASIS;

  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    // Multiply by FNV prime. Use Math.imul for correct 32-bit overflow.
    hash = Math.imul(hash, FNV_PRIME);
  }

  // Ensure non-negative by zero-filling right shift then taking absolute.
  return (hash >>> 0);
}
