import * as React from "react";

import { cn } from "@/lib/utils";
import { IntelSourceBar } from "@/components/marketing/intel-source-bar";

/* ================================================================
   TrustMetric + TrustStrip -- Trust & Credibility Bar
   Ticket: ST-820
   Usage: Hero sections, above-the-fold credibility, landing pages
   ================================================================ */

// ---------------------------------------------------------------------------
// Trust metric data
// ---------------------------------------------------------------------------

interface TrustMetricData {
  /** Large display value (numeric or alphanumeric). */
  value: string;
  /** Small label describing what the value represents. */
  label: string;
  /**
   * Whether the value is numeric (eligible for future counter animation).
   * Used to apply `tabular-nums` for stable layout during animation.
   */
  isNumeric: boolean;
}

const TRUST_METRICS: TrustMetricData[] = [
  { value: "5", label: "Government Data Sources", isNumeric: true },
  { value: "17", label: "Safety Review Sections", isNumeric: true },
  { value: "3-5", label: "Day Turnaround", isNumeric: false },
];

// ---------------------------------------------------------------------------
// TrustMetric -- Single metric display
// ---------------------------------------------------------------------------

export interface TrustMetricProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Large display value (e.g., "5", "AES-256"). */
  value: string;
  /** Descriptive label beneath the value (e.g., "Government Intel Sources"). */
  label: string;
  /**
   * Whether the value is numeric. Applies `tabular-nums` for
   * consistent character width during counter animations.
   * @default false
   */
  isNumeric?: boolean;
}

/**
 * Single trust metric displaying a large value with a small
 * descriptive label beneath. Used within `TrustStrip` to compose
 * the credibility bar, but can also stand alone.
 *
 * The value uses the display font at 28px with `primary-700` color
 * for high-contrast emphasis. The label uses 12px uppercase for a
 * subdued, professional appearance.
 *
 * @example
 * ```tsx
 * <TrustMetric value="5" label="Government Intel Sources" isNumeric />
 * <TrustMetric value="AES-256" label="Encryption Standard" />
 * ```
 */
function TrustMetric({
  value,
  label,
  isNumeric = false,
  className,
  ...props
}: TrustMetricProps) {
  return (
    <div
      className={cn("flex flex-col items-center text-center", className)}
      {...props}
    >
      <span
        className={cn(
          "font-display text-[28px] font-bold leading-tight text-primary-700",
          isNumeric && "tabular-nums",
        )}
      >
        {value}
      </span>
      <span className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
TrustMetric.displayName = "TrustMetric";

// ---------------------------------------------------------------------------
// TrustStrip -- Full credibility bar
// ---------------------------------------------------------------------------

export interface TrustStripProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to display the IntelSourceBar beneath the metrics.
   * @default true
   */
  showSources?: boolean;
}

/**
 * Horizontal trust and credibility bar displaying 5 key SafeTrekr metrics
 * with an optional government intelligence source bar beneath.
 *
 * Renders on a card surface with `border-y` to visually separate it from
 * surrounding content -- ideal for placement between hero and feature sections.
 *
 * The metrics wrap responsively: on narrow viewports they stack in a 2x3 grid,
 * on wider screens they display as a single row with dividers.
 *
 * Designed as a server component -- no `'use client'` directive.
 *
 * @example
 * ```tsx
 * // Full strip with intel source bar
 * <TrustStrip />
 *
 * // Without source bar
 * <TrustStrip showSources={false} />
 *
 * // With scroll reveal animation (wrap with client component)
 * <ScrollReveal variant="fadeUp">
 *   <TrustStrip />
 * </ScrollReveal>
 * ```
 */
function TrustStrip({
  showSources = true,
  className,
  ...props
}: TrustStripProps) {
  return (
    <div
      className={cn(
        "border-y border-border bg-card py-8 sm:py-10",
        className,
      )}
      role="region"
      aria-label="SafeTrekr trust metrics"
      {...props}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Metrics row */}
        <div
          className={cn(
            "flex flex-wrap items-start justify-center gap-x-8 gap-y-6",
            "sm:gap-x-12",
            "lg:flex-nowrap lg:justify-between lg:gap-x-6",
          )}
        >
          {TRUST_METRICS.map((metric, index) => (
            <React.Fragment key={metric.label}>
              <TrustMetric
                value={metric.value}
                label={metric.label}
                isNumeric={metric.isNumeric}
                className="min-w-[120px] flex-1"
              />
              {/* Vertical divider between metrics (hidden on wrap) */}
              {index < TRUST_METRICS.length - 1 && (
                <div
                  className="hidden h-12 w-px self-center bg-border lg:block"
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Intel source bar */}
        {showSources && (
          <div className="mt-6 flex justify-center sm:mt-8">
            <IntelSourceBar className="justify-center" />
          </div>
        )}
      </div>
    </div>
  );
}
TrustStrip.displayName = "TrustStrip";

export { TrustMetric, TrustStrip };
