"use server";

/**
 * subscribeNewsletter — Server Action for the newsletter signup form.
 *
 * Inserts the email into `newsletter_subscribers` with status
 * `pending_confirmation` (double opt-in is handled by a future worker).
 * Same security layering as submitForm: honeypot, Turnstile, Zod,
 * sanitize, rate limit, IP hash.
 *
 * Also fires a fire-and-forget notification to TEAM_NOTIFICATION_EMAIL
 * so the team sees new signups in real time before the CRM sync runs.
 */

import { headers } from "next/headers";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIP, hashIP } from "@/lib/security/ip-hash";
import { sanitizeFormData } from "@/lib/security/sanitize";
import { sendFormNotification } from "@/lib/email/sendgrid";
import { newsletterSchema } from "@/lib/validation/schemas";

export interface SubscribeNewsletterResult {
  success: boolean;
  message?: string;
  error?: string;
}

const NEWSLETTER_SUCCESS_MESSAGE =
  "Thanks — you're on the list. Watch your inbox for the next SafeTrekr update.";

const RATE_LIMIT = { max: 3, windowMinutes: 60 };

export async function subscribeNewsletter(
  formData: FormData,
): Promise<SubscribeNewsletterResult> {
  try {
    // Honeypot — silent fake success.
    const honeypot = formData.get("company_website");
    if (typeof honeypot === "string" && honeypot.length > 0) {
      return { success: true, message: NEWSLETTER_SUCCESS_MESSAGE };
    }

    // Turnstile.
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

    // Zod.
    const raw = Object.fromEntries(formData.entries());
    const parsed = newsletterSchema.safeParse(raw);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return {
        success: false,
        error:
          firstIssue?.message ?? "Please enter a valid email address.",
      };
    }

    const sanitized = sanitizeFormData(
      parsed.data as Record<string, unknown>,
    );

    // IP hash + rate limit.
    const headersList = await headers();
    const ipHash = await hashIP(getClientIP(headersList));

    const rl = await checkRateLimit(
      ipHash,
      "newsletter_signup",
      RATE_LIMIT.max,
      RATE_LIMIT.windowMinutes,
    );
    if (!rl.allowed) {
      return {
        success: false,
        error: "Too many requests. Please try again later.",
      };
    }

    // Insert. `onConflict: email` avoids duplicate-subscriber errors
    // when someone resubscribes.
    const supabase = createServerSupabaseClient();
    const { email, firstName } = sanitized as {
      email: string;
      firstName?: string;
    };

    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        {
          email,
          first_name: firstName ?? null,
          status: "pending_confirmation",
          ip_hash: ipHash,
          source: "marketing_site",
        },
        { onConflict: "email", ignoreDuplicates: false },
      );

    if (insertError) {
      console.error(
        "[subscribe-newsletter] Supabase upsert failed:",
        insertError,
      );
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      };
    }

    // Fire-and-forget notification so the team sees the signup.
    void sendFormNotification("newsletter_signup", sanitized).catch((err) => {
      console.error(
        "[subscribe-newsletter] SendGrid notification failed:",
        err,
      );
    });

    return { success: true, message: NEWSLETTER_SUCCESS_MESSAGE };
  } catch (err) {
    console.error("[subscribe-newsletter] Unexpected error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
