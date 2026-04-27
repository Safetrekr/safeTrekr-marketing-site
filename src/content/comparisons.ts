/* ================================================================
   Comparison Data -- Category Contrast Content
   Ticket: ST-888
   Usage: ComparisonTable component, homepage section 9, /pricing page
   ================================================================ */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Status value for a comparison cell.
 *
 * - `"yes"` -- Full capability (renders check icon)
 * - `"no"` -- Not available (renders X/dash icon)
 * - `"partial"` -- Limited capability (renders partial indicator)
 * - Any other string renders as a custom text label
 */
export type ComparisonValue = "yes" | "no" | "partial" | (string & {});

/**
 * A single row in the comparison table, representing one feature
 * evaluated across all four category columns.
 */
export interface ComparisonRow {
  /** Feature name displayed in the first column. */
  feature: string;
  /** SafeTrekr capability for this feature. */
  safetrekr: ComparisonValue;
  /** DIY / spreadsheet capability for this feature. */
  diy: ComparisonValue;
  /** Travel app capability for this feature. */
  travelApps: ComparisonValue;
  /** Travel insurance capability for this feature. */
  travelInsurance: ComparisonValue;
}

// ---------------------------------------------------------------------------
// Column metadata
// ---------------------------------------------------------------------------

/**
 * Column definitions for the comparison table.
 *
 * Order matches the visual left-to-right rendering after the feature
 * column. SafeTrekr is intentionally last so it appears on the right
 * edge with the highlighted background.
 */
export const COMPARISON_COLUMNS = [
  { key: "diy" as const, label: "DIY Spreadsheets" },
  { key: "travelApps" as const, label: "Travel Apps" },
  { key: "travelInsurance" as const, label: "Travel Insurance" },
  { key: "safetrekr" as const, label: "SafeTrekr" },
] as const;

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

/**
 * Default comparison data contrasting SafeTrekr against the three
 * categories organizations typically use for trip safety.
 *
 * SafeTrekr has full capability across all features. Competitors have
 * gaps that correspond to SafeTrekr's core differentiation.
 */
export const DEFAULT_COMPARISON_ROWS: readonly ComparisonRow[] = [
  {
    feature: "Comprehensive professional review",
    safetrekr: "yes",
    diy: "no",
    travelApps: "no",
    travelInsurance: "no",
  },
  {
    feature: "Current safety information",
    safetrekr: "yes",
    diy: "no",
    travelApps: "no",
    travelInsurance: "no",
  },
  {
    feature: "Board-ready documentation",
    safetrekr: "yes",
    diy: "no",
    travelApps: "no",
    travelInsurance: "no",
  },
  {
    feature: "Consistent process across trips",
    safetrekr: "yes",
    diy: "no",
    travelApps: "no",
    travelInsurance: "no",
  },
  {
    feature: "Complete safety binder",
    safetrekr: "yes",
    diy: "no",
    travelApps: "no",
    travelInsurance: "no",
  },
  {
    feature: "Active trip awareness",
    safetrekr: "yes",
    diy: "no",
    travelApps: "partial",
    travelInsurance: "no",
  },
  {
    feature: "Legal and insurance documentation",
    safetrekr: "yes",
    diy: "no",
    travelApps: "no",
    travelInsurance: "partial",
  },
  {
    feature: "Mobile field operations",
    safetrekr: "yes",
    diy: "no",
    travelApps: "partial",
    travelInsurance: "no",
  },
] as const;
