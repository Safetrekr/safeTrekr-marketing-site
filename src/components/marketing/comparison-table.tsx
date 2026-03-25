import * as React from "react";
import { Check, X, Minus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  COMPARISON_COLUMNS,
  type ComparisonRow,
  type ComparisonValue,
} from "@/content/comparisons";

/* ================================================================
   ComparisonTable -- Reusable Category Contrast Table
   Ticket: ST-888
   Usage: Homepage section 9, /pricing page, segment landing pages
   ================================================================ */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ComparisonTableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of comparison rows, one per feature being evaluated. */
  rows: readonly ComparisonRow[];
}

// ---------------------------------------------------------------------------
// Cell renderer sub-components
// ---------------------------------------------------------------------------

/**
 * Resolves a ComparisonValue to the appropriate visual indicator.
 *
 * - "yes" renders a green check icon
 * - "no" renders a muted X icon
 * - "partial" renders an amber minus icon with "Partial" label
 * - Any other string renders as custom text
 */
function CellIcon({ value }: { value: ComparisonValue }) {
  if (value === "yes") {
    return (
      <Check
        className="size-5 text-primary-600"
        strokeWidth={2.5}
        aria-label="Included"
      />
    );
  }

  if (value === "no") {
    return (
      <X
        className="size-4 text-muted-foreground/50"
        strokeWidth={2}
        aria-label="Not included"
      />
    );
  }

  if (value === "partial") {
    return (
      <span className="inline-flex items-center gap-1">
        <Minus
          className="size-4 text-warning-500"
          strokeWidth={2}
          aria-hidden="true"
        />
        <span className="text-body-xs text-muted-foreground">Partial</span>
      </span>
    );
  }

  // Custom text label
  return (
    <span className="text-body-xs text-muted-foreground">{value}</span>
  );
}

// ---------------------------------------------------------------------------
// Mobile card sub-component
// ---------------------------------------------------------------------------

/**
 * Mobile comparison pill showing a single competitor's capability
 * for a given feature. SafeTrekr pills are highlighted with primary styling.
 */
function MobilePill({
  label,
  value,
  isSafeTrekr = false,
}: {
  label: string;
  value: ComparisonValue;
  isSafeTrekr?: boolean;
}) {
  // SafeTrekr column -- primary accent regardless of value
  if (isSafeTrekr) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
        {value === "yes" && (
          <Check className="size-3" strokeWidth={2.5} aria-hidden="true" />
        )}
        {label}
      </span>
    );
  }

  // Competitor: not available
  if (value === "no") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
        <span aria-hidden="true">--</span> {label}
      </span>
    );
  }

  // Competitor: partial capability
  if (value === "partial") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-warning-200 bg-warning-50 px-2.5 py-0.5 text-xs font-medium text-warning-700">
        <Minus className="size-3" strokeWidth={2} aria-hidden="true" />
        {label}
      </span>
    );
  }

  // Competitor: full capability
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-foreground">
      {value === "yes" && (
        <Check className="size-3" strokeWidth={2} aria-hidden="true" />
      )}
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Desktop table
// ---------------------------------------------------------------------------

function DesktopTable({ rows }: { rows: readonly ComparisonRow[] }) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm md:block">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border">
            {/* Feature column header */}
            <th
              scope="col"
              className="px-6 py-4 text-body-sm font-semibold text-foreground"
            >
              <span className="sr-only">Feature</span>
            </th>

            {/* Competitor column headers */}
            {COMPARISON_COLUMNS.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "px-6 py-4 text-center text-body-sm font-semibold",
                  col.key === "safetrekr"
                    ? "bg-primary-50 text-primary-700"
                    : "text-foreground",
                )}
              >
                <span className="inline-flex flex-col items-center gap-1">
                  {col.key === "safetrekr" && (
                    <Badge variant="brand" className="mb-0.5">
                      Recommended
                    </Badge>
                  )}
                  {col.label}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.feature}
              className={cn(
                index < rows.length - 1 && "border-b border-border",
                index % 2 === 1 && "bg-muted/35",
              )}
            >
              {/* Feature name */}
              <td className="px-6 py-4 text-body-sm font-medium text-foreground">
                {row.feature}
              </td>

              {/* Competitor cells */}
              {COMPARISON_COLUMNS.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-6 py-4 text-center",
                    col.key === "safetrekr" && "bg-primary-50",
                  )}
                >
                  <span className="inline-flex items-center justify-center">
                    <CellIcon value={row[col.key]} />
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile cards
// ---------------------------------------------------------------------------

function MobileCards({ rows }: { rows: readonly ComparisonRow[] }) {
  return (
    <div className="space-y-4 md:hidden" role="list">
      {rows.map((row) => (
        <div
          key={row.feature}
          className="rounded-lg border border-border bg-card p-4"
          role="listitem"
        >
          <span className="text-body-sm font-medium text-foreground">
            {row.feature}
          </span>
          <div className="mt-3 flex flex-wrap gap-2">
            {COMPARISON_COLUMNS.map((col) => (
              <MobilePill
                key={col.key}
                label={col.label}
                value={row[col.key]}
                isSafeTrekr={col.key === "safetrekr"}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * Responsive comparison table contrasting SafeTrekr against competitor
 * categories across a set of feature rows.
 *
 * **Desktop** (md+): Full HTML `<table>` with the SafeTrekr column
 * highlighted in `bg-primary-50` and a "Recommended" badge in the
 * column header.
 *
 * **Mobile** (< md): Card-per-feature layout where each feature renders
 * as a card showing all four competitor pills. SafeTrekr pills are
 * visually distinguished with primary accent styling.
 *
 * This is a server component -- no client-side interactivity required.
 *
 * @example
 * ```tsx
 * import { ComparisonTable } from "@/components/marketing/comparison-table";
 * import { DEFAULT_COMPARISON_ROWS } from "@/content/comparisons";
 *
 * <ComparisonTable rows={DEFAULT_COMPARISON_ROWS} />
 * ```
 *
 * @example
 * ```tsx
 * // Custom rows for a segment-specific page
 * const segmentRows: ComparisonRow[] = [
 *   { feature: "FERPA compliance", safetrekr: "yes", diy: "no", travelApps: "no", travelInsurance: "no" },
 *   // ...
 * ];
 * <ComparisonTable rows={segmentRows} />
 * ```
 */
function ComparisonTable({ rows, className, ...props }: ComparisonTableProps) {
  return (
    <div className={cn(className)} {...props}>
      <DesktopTable rows={rows} />
      <MobileCards rows={rows} />
    </div>
  );
}
ComparisonTable.displayName = "ComparisonTable";

export { ComparisonTable };
