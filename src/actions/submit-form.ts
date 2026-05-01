"use server";

/**
 * submitForm — unified Server Action for sales-driven marketing forms
 * (demo_request, contact, quote_request, sample_binder_download).
 *
 * Pipeline (order matters — honeypot runs first so bots never hit paid APIs):
 *   1. Form-type validation
 *   2. Honeypot check (silent fake-success)
 *   3. Turnstile verification
 *   4. Zod schema validation
 *   5. Sanitization
 *   6. Rate limit (per IP hash + form type)
 *   7. IP hashing (raw IP never persisted)
 *   8. Insert into `form_submissions` + fire-and-forget SendGrid notification
 *
 * For `sample_binder_download`: real binder assets do not yet exist. The
 * success message tells the user the team will email them a sample; the
 * SendGrid notification lands in SALES_EMAIL so the team can respond manually.
 * Future work: swap the success message for a signed S3 link when the
 * binder library is built.
 */

import { headers } from "next/headers";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIP, hashIP } from "@/lib/security/ip-hash";
import { sanitizeFormData } from "@/lib/security/sanitize";
import { sendFormNotification } from "@/lib/email/sendgrid";
import { formSchemas, type FormType } from "@/lib/validation/schemas";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SubmitFormResult {
  success: boolean;
  message?: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// Per-form rate limit + success message config
// ---------------------------------------------------------------------------

const RATE_LIMITS: Record<FormType, { max: number; windowMinutes: number }> = {
  demo_request: { max: 5, windowMinutes: 60 },
  quote_request: { max: 5, windowMinutes: 60 },
  contact: { max: 10, windowMinutes: 60 },
  sample_binder_download: { max: 10, windowMinutes: 60 },
};

const SUCCESS_MESSAGES: Record<FormType, string> = {
  demo_request:
    "Demo request received. Our team will reach out within one business day to schedule your walkthrough.",
  contact:
    "Message received. We'll respond within one business day.",
  quote_request:
    "Quote request received. Our team will follow up with a tailored proposal.",
  sample_binder_download:
    "Thanks! We'll email you a sample binder shortly.",
};

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export async function submitForm(
  formData: FormData,
): Promise<SubmitFormResult> {
  try {
    // ------------------------------------------------------------------
    // 1. Form-type validation
    // ------------------------------------------------------------------
    const formType = formData.get("formType");
    if (
      typeof formType !== "string" ||
      !(formType in formSchemas)
    ) {
      return { success: false, error: "Invalid form type." };
    }
    const type = formType as FormType;

    // ------------------------------------------------------------------
    // 2. Honeypot — silent fake success to avoid tipping off bots
    // ------------------------------------------------------------------
    const honeypot = formData.get("company_website");
    if (typeof honeypot === "string" && honeypot.length > 0) {
      return {
        success: true,
        message: SUCCESS_MESSAGES[type],
      };
    }

    // ------------------------------------------------------------------
    // 3. Turnstile verification — reject fast on missing/bad token
    // ------------------------------------------------------------------
    const turnstileToken = formData.get("turnstileToken");
    if (typeof turnstileToken !== "string" || turnstileToken.length === 0) {
      return {
        success: false,
        error: "Verification is required. Please retry.",
      };
    }

    const tsResult = await verifyTurnstile(turnstileToken);
    if (!tsResult.success) {
      return {
        success: false,
        error: "Verification failed. Please try again.",
      };
    }

    // ------------------------------------------------------------------
    // 4. Zod schema validation
    // ------------------------------------------------------------------
    const raw = formDataToObject(formData);
    const parsed = formSchemas[type].safeParse(raw);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return {
        success: false,
        error: firstIssue?.message ?? "Please check your input and try again.",
      };
    }

    // ------------------------------------------------------------------
    // 5. Sanitization
    // ------------------------------------------------------------------
    const sanitized = sanitizeFormData(
      parsed.data as Record<string, unknown>,
    );

    // ------------------------------------------------------------------
    // 6 + 7. IP hash then rate limit
    // ------------------------------------------------------------------
    const headersList = await headers();
    const clientIP = getClientIP(headersList);
    const ipHash = await hashIP(clientIP);

    const limits = RATE_LIMITS[type];
    const rl = await checkRateLimit(
      ipHash,
      type,
      limits.max,
      limits.windowMinutes,
    );
    if (!rl.allowed) {
      return {
        success: false,
        error: "Too many requests. Please try again later.",
      };
    }

    // ------------------------------------------------------------------
    // 8. Persist + notify
    // ------------------------------------------------------------------
    const supabase = createServerSupabaseClient();

    const { email, firstName, lastName, organization, ...rest } =
      sanitized as Record<string, unknown>;

    // Strip meta fields from the details blob.
    delete (rest as Record<string, unknown>).turnstileToken;
    delete (rest as Record<string, unknown>).company_website;

    const row = {
      form_type: type,
      email,
      first_name: firstName,
      last_name: lastName,
      organization: organization ?? null,
      details: rest,
      ip_hash: ipHash,
      honeypot_triggered: false,
      user_agent: headersList.get("user-agent") ?? null,
      referer: headersList.get("referer") ?? null,
    };

    const { error: insertError } = await supabase
      .from("form_submissions")
      .insert(row);

    if (insertError) {
      console.error("[submit-form] Supabase insert failed:", insertError);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      };
    }

    // Fire-and-forget: email failure must not block the user's success.
    void sendFormNotification(type, sanitized).catch((err) => {
      console.error("[submit-form] SendGrid notification failed:", err);
    });

    return {
      success: true,
      message: SUCCESS_MESSAGES[type],
    };
  } catch (err) {
    console.error("[submit-form] Unexpected error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Converts a FormData instance to a plain object, coalescing repeated keys
 * into arrays (so multi-select fields like `tripTypes[]` parse correctly).
 */
function formDataToObject(formData: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key in result) {
      const existing = result[key];
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        result[key] = [existing, value];
      }
    } else {
      result[key] = value;
    }
  }
  return result;
}
