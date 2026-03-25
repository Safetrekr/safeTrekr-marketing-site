/**
 * ST-901: Newsletter Confirmation Server Action (Double Opt-In)
 *
 * Completes the double opt-in flow by verifying a confirmation token
 * and setting `confirmed_at` on the corresponding `newsletter_subscribers`
 * row. Called when a subscriber clicks the confirmation link in their email.
 *
 * Security considerations:
 * - Tokens are UUIDs (128-bit entropy) -- not guessable
 * - Already-confirmed tokens return success (idempotent)
 * - Invalid tokens return a generic error (no information leakage)
 *
 * @see src/actions/subscribe-newsletter.ts -- Creates the subscription
 */

"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ConfirmResult {
  /** Whether the confirmation was processed successfully. */
  success: boolean;
  /** User-facing error message when `success` is false. */
  error?: string;
  /** User-facing success message when `success` is true. */
  message?: string;
}

// ---------------------------------------------------------------------------
// Public Server Action
// ---------------------------------------------------------------------------

/**
 * Confirms a newsletter subscription by verifying the confirmation token.
 *
 * Sets `confirmed_at = now()` on the `newsletter_subscribers` row that
 * matches the provided token. If the token has already been confirmed,
 * returns success (idempotent operation).
 *
 * @param token - The confirmation token from the subscriber's email link.
 * @returns A structured result indicating success or failure.
 */
export async function confirmNewsletter(
  token: string,
): Promise<ConfirmResult> {
  try {
    // -----------------------------------------------------------------
    // 1. Validate token format
    // -----------------------------------------------------------------

    if (!token || typeof token !== "string" || token.length < 1) {
      return {
        success: false,
        error: "Invalid confirmation link.",
      };
    }

    // -----------------------------------------------------------------
    // 2. Look up the subscriber by token
    // -----------------------------------------------------------------

    const supabase = createServerSupabaseClient();

    const { data: subscriber, error: lookupError } = await supabase
      .from("newsletter_subscribers")
      .select("id, confirmed_at")
      .eq("confirmation_token", token)
      .maybeSingle();

    if (lookupError) {
      console.error(
        "[confirm-newsletter] Supabase lookup failed:",
        lookupError,
      );
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      };
    }

    if (!subscriber) {
      return {
        success: false,
        error: "Invalid or expired confirmation link.",
      };
    }

    // -----------------------------------------------------------------
    // 3. Handle already-confirmed (idempotent)
    // -----------------------------------------------------------------

    if (subscriber.confirmed_at) {
      return {
        success: true,
        message: "Your subscription is already confirmed.",
      };
    }

    // -----------------------------------------------------------------
    // 4. Set confirmed_at
    // -----------------------------------------------------------------

    const { error: updateError } = await supabase
      .from("newsletter_subscribers")
      .update({ confirmed_at: new Date().toISOString() })
      .eq("confirmation_token", token);

    if (updateError) {
      console.error(
        "[confirm-newsletter] Supabase update failed:",
        updateError,
      );
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      };
    }

    return {
      success: true,
      message: "Your subscription has been confirmed. Welcome aboard!",
    };
  } catch (error) {
    console.error("[confirm-newsletter] Unexpected error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
