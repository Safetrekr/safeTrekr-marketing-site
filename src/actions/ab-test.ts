/**
 * ST-881: A/B Test Infrastructure -- Server Actions
 *
 * Exposes two server actions for A/B test lifecycle management:
 *
 *   1. `assignVariant` -- Deterministically assigns a visitor to a test
 *      variant and persists the assignment to the `ab_test_assignments`
 *      Supabase table. Uses an upsert to guarantee idempotency: re-calling
 *      with the same session + test returns the existing assignment without
 *      overwriting it.
 *
 *   2. `recordConversion` -- Stamps the `converted_at` timestamp on an
 *      existing assignment. Idempotent: only the first conversion is
 *      recorded.
 *
 * Both actions read the session ID from the `ab_session` cookie. If no
 * session exists, one is created transparently.
 *
 * @see src/lib/ab-test.ts for the core hashing and session utilities
 */

"use server";

import {
  getOrCreateSessionId,
  getVariant,
  trackConversion,
  type VariantAssignment,
  type ConversionResult,
} from "@/lib/ab-test";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Result returned by the `assignVariant` server action. */
export interface AssignVariantResult {
  /** Whether the assignment was persisted successfully. */
  success: boolean;
  /** The variant assignment details (present when `success` is true). */
  assignment?: VariantAssignment;
  /** Diagnostic error message (for server-side logging; never expose to UI). */
  error?: string;
}

// Re-export types from the lib for consumer convenience.
export type { VariantAssignment, ConversionResult };

// ---------------------------------------------------------------------------
// Server Actions
// ---------------------------------------------------------------------------

/**
 * Assigns a visitor to an A/B test variant and persists the assignment.
 *
 * The variant is determined by a deterministic hash of the session ID and
 * test name, so repeated calls for the same session and test always return
 * the same variant. The assignment is upserted to Supabase: if a row
 * already exists for (test_name, session_id), it is returned unchanged.
 *
 * @param testName - Unique identifier for the test (e.g., "hero_cta_color").
 * @param variants - Array of variant names (e.g., ["control", "variant_a"]).
 *                   Must contain at least one element.
 * @returns The assignment result with the selected variant.
 *
 * @example
 * ```ts
 * // In a Server Component or another server action:
 * import { assignVariant } from "@/actions/ab-test";
 *
 * const result = await assignVariant("hero_cta_color", ["control", "variant_a"]);
 * if (result.success) {
 *   // result.assignment.variant === "control" | "variant_a"
 * }
 * ```
 */
export async function assignVariant(
  testName: string,
  variants: string[],
): Promise<AssignVariantResult> {
  try {
    // -----------------------------------------------------------------------
    // Step 1: Resolve session and compute deterministic variant
    // -----------------------------------------------------------------------

    const sessionId = await getOrCreateSessionId();
    const assignment = getVariant(testName, variants, sessionId);

    // -----------------------------------------------------------------------
    // Step 2: Upsert to Supabase (idempotent)
    // -----------------------------------------------------------------------
    // ON CONFLICT (test_name, session_id) DO NOTHING ensures we never
    // overwrite an existing assignment. The first call wins.

    const supabase = createServerSupabaseClient();

    const { error: upsertError } = await supabase
      .from("ab_test_assignments")
      .upsert(
        {
          test_name: assignment.testName,
          session_id: assignment.sessionId,
          variant: assignment.variant,
        },
        {
          onConflict: "test_name,session_id",
          ignoreDuplicates: true,
        },
      );

    if (upsertError) {
      console.error("[ab-test] Failed to upsert assignment:", upsertError);
      // Fail open: return the computed assignment even if persistence fails.
      // The hash-based assignment is deterministic, so the visitor will get
      // the same variant on the next request regardless.
      return {
        success: false,
        assignment,
        error: "Failed to persist assignment to database.",
      };
    }

    // -----------------------------------------------------------------------
    // Step 3: Fetch the persisted assignment to handle the case where a
    // prior session already has a different variant (e.g., if the variants
    // array was changed after the first assignment).
    // -----------------------------------------------------------------------

    const { data: persisted, error: fetchError } = await supabase
      .from("ab_test_assignments")
      .select("variant")
      .eq("test_name", testName)
      .eq("session_id", sessionId)
      .single();

    if (fetchError) {
      console.error("[ab-test] Failed to fetch persisted assignment:", fetchError);
      // Return the computed assignment as a fallback.
      return {
        success: true,
        assignment,
      };
    }

    // Return the DB-stored variant, which may differ from the computed one
    // if the test was previously assigned with a different variants array.
    return {
      success: true,
      assignment: {
        testName,
        variant: (persisted.variant as string | undefined) ?? assignment.variant,
        sessionId,
      },
    };
  } catch (error) {
    console.error("[ab-test] Unexpected error in assignVariant:", error);
    return {
      success: false,
      error: "Unexpected error during variant assignment.",
    };
  }
}

/**
 * Records a conversion event for a given A/B test.
 *
 * Stamps the `converted_at` timestamp on the visitor's test assignment.
 * Idempotent: only the first conversion for a given (test_name, session_id)
 * pair is recorded; subsequent calls are no-ops.
 *
 * The session ID is read from the `ab_session` cookie. If the visitor was
 * never enrolled in the specified test, the conversion is silently ignored.
 *
 * @param testName - The test identifier to record a conversion for.
 * @returns A result indicating success or failure.
 *
 * @example
 * ```ts
 * // In a Server Component or another server action:
 * import { recordConversion } from "@/actions/ab-test";
 *
 * const result = await recordConversion("hero_cta_color");
 * // => { success: true, message: "Conversion recorded." }
 * ```
 */
export async function recordConversion(
  testName: string,
): Promise<ConversionResult> {
  return trackConversion(testName);
}
