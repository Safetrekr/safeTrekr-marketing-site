/**
 * ST-901: Newsletter Subscription Server Action
 *
 * Handles newsletter signup with double opt-in. Inserts a new row into
 * the `newsletter_subscribers` table with a unique `confirmation_token`.
 * The subscriber must click a confirmation link (handled by the
 * `confirmNewsletter` action) before they are considered opted in.
 *
 * Security layers:
 *   1. Server-side Zod validation (email format + length)
 *   2. Duplicate check (prevents re-insertion if already subscribed)
 *   3. Confirmation token generation (crypto.randomUUID)
 *   4. Supabase persistence
 *
 * This action intentionally does NOT use Turnstile or the full 8-layer
 * pipeline from `submitForm`. The newsletter form is a single-field
 * compact form typically embedded in the footer or blog sidebar. Rate
 * limiting can be added later if abuse is observed.
 *
 * @see src/actions/confirm-newsletter.ts -- Handles token confirmation
 */

"use server";

import { z } from "zod";

import { createServerSupabaseClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SubscribeResult {
  /** Whether the subscription was processed successfully. */
  success: boolean;
  /** User-facing error message when `success` is false. */
  error?: string;
  /** User-facing success message when `success` is true. */
  message?: string;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .max(254, "Email must be 254 characters or fewer.")
  .email("Please enter a valid email address.");

// ---------------------------------------------------------------------------
// Public Server Action
// ---------------------------------------------------------------------------

/**
 * Subscribes an email address to the SafeTrekr newsletter.
 *
 * Creates a new row in `newsletter_subscribers` with a unique
 * `confirmation_token`. The `confirmed_at` column remains `NULL` until
 * the subscriber confirms via the token link.
 *
 * If the email is already subscribed (confirmed or not), returns a
 * success-like message to avoid leaking subscription status.
 *
 * @param formData - FormData containing an `email` field.
 * @returns A structured result for client consumption.
 */
export async function subscribeNewsletter(
  formData: FormData,
): Promise<SubscribeResult> {
  try {
    // -----------------------------------------------------------------
    // 1. Extract and validate email
    // -----------------------------------------------------------------

    const rawEmail = formData.get("email") as string | null;
    const parseResult = emailSchema.safeParse(rawEmail);

    if (!parseResult.success) {
      const firstError =
        parseResult.error.issues[0]?.message ?? "Invalid email address.";
      return { success: false, error: firstError };
    }

    const email = parseResult.data.toLowerCase();

    // -----------------------------------------------------------------
    // 2. Check for existing subscriber
    // -----------------------------------------------------------------

    const supabase = createServerSupabaseClient();

    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, confirmed_at")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      // Return the same success message regardless of confirmation status
      // to avoid leaking whether an email is already subscribed.
      return {
        success: true,
        message: "Check your email to confirm your subscription.",
      };
    }

    // -----------------------------------------------------------------
    // 3. Generate confirmation token
    // -----------------------------------------------------------------

    const confirmationToken = crypto.randomUUID();

    // -----------------------------------------------------------------
    // 4. Insert into newsletter_subscribers
    // -----------------------------------------------------------------

    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email,
        confirmation_token: confirmationToken,
      });

    if (insertError) {
      console.error(
        "[subscribe-newsletter] Supabase insert failed:",
        insertError,
      );
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      };
    }

    // TODO: Send confirmation email with link containing confirmationToken.
    // For now, the token is stored in the DB and the confirmation action
    // (confirm-newsletter.ts) handles the verification step.

    return {
      success: true,
      message: "Check your email to confirm your subscription.",
    };
  } catch (error) {
    console.error("[subscribe-newsletter] Unexpected error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
