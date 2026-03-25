/**
 * ST-822: REQ-039 -- Unified Form Submission Server Action
 *
 * Implements the 8-layer security pipeline for all marketing form
 * submissions (demo request, contact, quote, sample binder download).
 *
 * Security layers execute in order:
 *   1. Parse form data and identify form type
 *   2. Honeypot check (silent rejection with fake success)
 *   3. Turnstile token verification (Cloudflare `/siteverify` API)
 *   4. Server-side Zod validation (never trust client)
 *   5. Input sanitization (strip HTML, normalize Unicode, hard length limit)
 *   6. Rate limit check (per IP hash, per form type)
 *   7. IP hashing (SHA-256 with salt, raw IP NEVER stored)
 *   8. Supabase persistence + SendGrid notification
 *
 * Returns a structured result safe for client consumption. Internal
 * errors are logged server-side but never exposed to the client.
 */

"use server";

import { headers } from "next/headers";

import { sendFormNotification } from "@/lib/email/sendgrid";
import { getClientIP, hashIP } from "@/lib/security/ip-hash";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { sanitizeFormData } from "@/lib/security/sanitize";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  formSchemas,
  type FormType,
} from "@/lib/validation/schemas";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SubmitFormResult {
  /** Whether the submission was processed successfully. */
  success: boolean;
  /** User-facing error message when `success` is false. */
  error?: string;
  /** User-facing success message when `success` is true. */
  message?: string;
}

// ---------------------------------------------------------------------------
// Rate limit thresholds per form type (from FR-DB-014)
// ---------------------------------------------------------------------------

const RATE_LIMITS: Record<FormType, { maxAttempts: number; windowMinutes: number }> = {
  demo_request: { maxAttempts: 5, windowMinutes: 60 },
  contact: { maxAttempts: 10, windowMinutes: 60 },
  quote_request: { maxAttempts: 5, windowMinutes: 60 },
  sample_binder_download: { maxAttempts: 10, windowMinutes: 60 },
};

/**
 * User-facing success messages per form type.
 */
const SUCCESS_MESSAGES: Record<FormType, string> = {
  demo_request:
    "Demo request received. We will contact you within 1 business day.",
  contact:
    "Message received. We typically respond within 1 business day.",
  quote_request:
    "Quote request received. Our team will prepare a custom quote and reach out shortly.",
  sample_binder_download:
    "Your sample binder is on its way. Check your email for the download link.",
};

// ---------------------------------------------------------------------------
// Public Server Action
// ---------------------------------------------------------------------------

/**
 * Unified Server Action for all marketing form submissions.
 *
 * Accepts a `FormData` object containing a `formType` discriminator field
 * plus all fields defined in the corresponding Zod schema.
 *
 * The action applies the 8-layer security pipeline and persists the
 * submission to Supabase on success. SendGrid notification is sent
 * non-blocking (fire-and-forget).
 *
 * @param formData - The submitted `FormData` object.
 * @returns A structured result for client consumption.
 *
 * @example
 * ```tsx
 * // In a client component:
 * import { submitForm } from "@/actions/submit-form";
 *
 * const [state, action] = useActionState(submitForm, { success: false });
 * ```
 */
export async function submitForm(
  formData: FormData,
): Promise<SubmitFormResult> {
  try {
    // -----------------------------------------------------------------------
    // Layer 1: Parse form data and identify form type
    // -----------------------------------------------------------------------

    const formType = formData.get("formType") as string | null;

    if (!formType || !(formType in formSchemas)) {
      return {
        success: false,
        error: "Invalid form type.",
      };
    }

    const typedFormType = formType as FormType;

    // Convert FormData to a plain object for Zod parsing.
    // Handle multi-value fields (e.g., tripTypes[]) by collecting arrays.
    const rawData = formDataToObject(formData);

    // -----------------------------------------------------------------------
    // Layer 2: Honeypot check
    // -----------------------------------------------------------------------
    // The `company_website` field is hidden via CSS and aria-hidden.
    // Bots auto-fill it. If it has any value, silently reject with a fake
    // success response to avoid tipping off the bot.

    const honeypotValue = formData.get("company_website") as string | null;

    if (honeypotValue && honeypotValue.length > 0) {
      // Log for analysis but do NOT count against the IP's rate limit.
      console.warn("[submit-form] Honeypot triggered. Silent rejection.");
      return {
        success: true,
        message: SUCCESS_MESSAGES[typedFormType],
      };
    }

    // -----------------------------------------------------------------------
    // Layer 3: Turnstile token verification
    // -----------------------------------------------------------------------

    const turnstileToken = (rawData.turnstileToken as string) ?? "";

    if (!turnstileToken) {
      return {
        success: false,
        error: "Verification is required. Please complete the challenge.",
      };
    }

    const turnstileResult = await verifyTurnstile(turnstileToken);

    if (!turnstileResult.success) {
      console.warn(
        `[submit-form] Turnstile verification failed: ${turnstileResult.error}`,
      );
      return {
        success: false,
        error: "Verification failed. Please try again.",
      };
    }

    // -----------------------------------------------------------------------
    // Layer 4: Server-side Zod validation
    // -----------------------------------------------------------------------

    const schema = formSchemas[typedFormType];
    const parseResult = schema.safeParse(rawData);

    if (!parseResult.success) {
      // Extract field-level errors for the client, but do NOT expose raw
      // Zod error paths which could reveal schema structure.
      const fieldErrors = extractFieldErrors(parseResult.error);
      const firstError = Object.values(fieldErrors)[0] ?? "Validation failed.";

      return {
        success: false,
        error: firstError,
      };
    }

    const validatedData = parseResult.data as Record<string, unknown>;

    // -----------------------------------------------------------------------
    // Layer 5: Input sanitization
    // -----------------------------------------------------------------------

    const sanitizedData = sanitizeFormData(validatedData);

    // -----------------------------------------------------------------------
    // Layer 6: Rate limit check
    // -----------------------------------------------------------------------

    // Resolve client IP from trusted proxy headers.
    const headersList = await headers();
    const clientIP = getClientIP(headersList);

    // Hash the IP before any rate limit check or storage.
    const ipHash = await hashIP(clientIP);

    const rateLimitConfig = RATE_LIMITS[typedFormType];
    const rateLimitResult = await checkRateLimit(
      ipHash,
      typedFormType,
      rateLimitConfig.maxAttempts,
      rateLimitConfig.windowMinutes,
    );

    if (!rateLimitResult.allowed) {
      return {
        success: false,
        error: "Too many requests. Please try again later.",
      };
    }

    // -----------------------------------------------------------------------
    // Layer 7: IP hashing (already computed in Layer 6)
    // -----------------------------------------------------------------------
    // The `ipHash` was computed before the rate limit check since the
    // rate limiter needs it. The raw IP is discarded after this point.

    // -----------------------------------------------------------------------
    // Layer 8: Supabase persistence + SendGrid notification
    // -----------------------------------------------------------------------

    await persistSubmission(typedFormType, sanitizedData, ipHash, headersList);

    // Send team notification (non-blocking).
    sendFormNotification(typedFormType, sanitizedData).catch((err) => {
      console.error("[submit-form] SendGrid notification failed:", err);
    });

    return {
      success: true,
      message: SUCCESS_MESSAGES[typedFormType],
    };
  } catch (error) {
    // Catch-all for unexpected errors. Log the full error server-side
    // but return a generic message to the client.
    console.error("[submit-form] Unexpected error:", error);

    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Converts a FormData object to a plain Record for Zod parsing.
 *
 * Handles multi-value fields: if a key appears multiple times (e.g.,
 * `tripTypes` checkboxes), the values are collected into an array.
 * Single-value fields remain as strings.
 */
function formDataToObject(formData: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const key of formData.keys()) {
    const values = formData.getAll(key);

    if (values.length > 1) {
      result[key] = values.map(String);
    } else {
      result[key] = values[0] !== undefined ? String(values[0]) : undefined;
    }
  }

  return result;
}

/**
 * Extracts a flat map of field-level error messages from a Zod error.
 *
 * Returns `{ fieldName: "error message" }` for each invalid field.
 * Only the first error per field is included.
 */
function extractFieldErrors(
  error: { issues: Array<{ path: PropertyKey[]; message: string }> },
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (field !== undefined && !(String(field) in fieldErrors)) {
      fieldErrors[String(field)] = issue.message;
    }
  }

  return fieldErrors;
}

/**
 * Extracts common contact fields from the sanitized data and separates
 * form-specific fields into the `details` JSONB column.
 */
function splitCommonAndDetails(data: Record<string, unknown>): {
  common: Record<string, unknown>;
  details: Record<string, unknown>;
} {
  // Fields that map to top-level columns on `form_submissions`.
  const commonFieldNames = new Set([
    "email",
    "firstName",
    "lastName",
    "organization",
    "orgType",
    "company_website",
    "turnstileToken",
  ]);

  const common: Record<string, unknown> = {};
  const details: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (commonFieldNames.has(key)) {
      common[key] = value;
    } else {
      details[key] = value;
    }
  }

  return { common, details };
}

/**
 * Persists the form submission to the `form_submissions` Supabase table.
 *
 * Maps sanitized form data to the table schema:
 * - Common fields (email, name, org) -> top-level columns
 * - Form-specific fields -> `details` JSONB column
 * - Metadata (IP hash, user agent, UTM, referrer) -> tracking columns
 */
async function persistSubmission(
  formType: FormType,
  sanitizedData: Record<string, unknown>,
  ipHash: string,
  headersList: Headers,
): Promise<void> {
  const supabase = createServerSupabaseClient();

  const { common, details } = splitCommonAndDetails(sanitizedData);

  // Map orgType to the DB's `segment` column (organization_segment enum).
  const segment = common.orgType as string | undefined;

  // Extract UTM parameters and referrer from headers (if present).
  // These are typically set via query params captured in a cookie or
  // passed through hidden form fields.
  const userAgent = headersList.get("user-agent") ?? undefined;
  const referrer = headersList.get("referer") ?? undefined;

  const { error } = await supabase.from("form_submissions").insert({
    form_type: formType,
    email: common.email,
    first_name: common.firstName,
    last_name: common.lastName,
    organization: common.organization ?? null,
    segment: segment ?? null,
    details,
    ip_hash: ipHash,
    user_agent: userAgent,
    referrer: referrer,
    honeypot_triggered: false,
  });

  if (error) {
    console.error("[submit-form] Supabase insert failed:", error);
    throw new Error("Failed to save submission.");
  }
}
