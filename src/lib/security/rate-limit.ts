/**
 * ST-822: REQ-039 -- Rate Limiting (Layer 6 of 8-Layer Security)
 *
 * Sliding-window rate limiter backed by the `rate_limits` Supabase table.
 * Each form submission records one row; the check counts rows within the
 * configured time window for the given IP hash and action type.
 *
 * Default thresholds (from database architect plan FR-DB-014):
 *   demo_request:          5 / hour
 *   quote_request:         5 / hour
 *   contact:              10 / hour
 *   sample_binder_download: 10 / hour
 *   newsletter_signup:      3 / hour
 *   global:               50 / 5 minutes
 *
 * The Server Action calls `checkRateLimit` BEFORE persisting the form
 * submission. If the check passes, the action inserts a row into
 * `rate_limits` to record the attempt.
 *
 * Rows older than 24 hours are purged by a scheduled Supabase function
 * (FR-DB-041). This module does not handle cleanup.
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RateLimitResult {
  /** Whether the request is allowed (under the limit). */
  allowed: boolean;
  /** How many attempts remain in the current window. */
  remaining: number;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Checks whether the given IP hash is within the rate limit for a specific
 * action. If allowed, records the attempt in the `rate_limits` table.
 *
 * @param ipHash       - SHA-256 hash of the client IP (never raw IP).
 * @param action       - Action identifier matching `rate_limits.action_type`
 *                       (e.g., `"demo_request"`, `"contact"`, `"global"`).
 * @param maxAttempts  - Maximum allowed attempts within the window.
 *                       Defaults to 10.
 * @param windowMinutes - Sliding window duration in minutes.
 *                        Defaults to 60 (1 hour).
 * @returns `{ allowed, remaining }` indicating whether the request may proceed.
 *
 * @example
 * ```ts
 * const result = await checkRateLimit(ipHash, "demo_request", 5, 60);
 * if (!result.allowed) {
 *   return { success: false, error: "Too many requests. Please try again later." };
 * }
 * ```
 */
export async function checkRateLimit(
  ipHash: string,
  action: string,
  maxAttempts: number = 10,
  windowMinutes: number = 60,
): Promise<RateLimitResult> {
  const supabase = createServerSupabaseClient();

  // Calculate the start of the sliding window.
  const windowStart = new Date(
    Date.now() - windowMinutes * 60 * 1000,
  ).toISOString();

  // Count existing attempts within the window.
  // Uses the composite index: idx_rate_limits_lookup (ip_hash, action, created_at DESC)
  const { count, error: countError } = await supabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .eq("action_type", action)
    .gte("created_at", windowStart);

  if (countError) {
    // If the rate-limit check fails (DB error), we fail open to avoid
    // blocking legitimate users. Log the error for alerting.
    console.error("[rate-limit] Failed to query rate_limits table:", countError);
    return { allowed: true, remaining: maxAttempts };
  }

  const currentCount = count ?? 0;
  const remaining = Math.max(0, maxAttempts - currentCount);

  if (currentCount >= maxAttempts) {
    return { allowed: false, remaining: 0 };
  }

  // Record this attempt.
  const { error: insertError } = await supabase.from("rate_limits").insert({
    ip_hash: ipHash,
    action_type: action,
  });

  if (insertError) {
    // Insert failure should not block the submission. Log and continue.
    console.error("[rate-limit] Failed to record rate limit entry:", insertError);
  }

  return { allowed: true, remaining: remaining - 1 };
}
