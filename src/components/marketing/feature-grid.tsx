import * as React from "react";

import { cn } from "@/lib/utils";
import { FeatureCard } from "./feature-card";

/* ================================================================
   FeatureGrid -- Responsive Marketing Feature Grid
   Ticket: ST-847
   Usage: Feature sections, capability overviews, benefit grids
   ================================================================ */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Props for a single feature item in the grid. */
export interface FeatureGridItem {
  /** Icon rendered at the top of the card (typically a Lucide icon or custom SVG). */
  icon: React.ReactNode;
  /** Feature title displayed as a heading. */
  title: string;
  /** Short description of the feature or benefit. */
  description: string;
  /** Optional link destination -- makes the card clickable. */
  href?: string;
  /** Text displayed next to the arrow indicator when `href` is provided. */
  linkText?: string;
}

export interface FeatureGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of feature items to render as cards. */
  features: FeatureGridItem[];
  /**
   * Number of columns at the `lg` breakpoint.
   * Always collapses to 2 columns at `md` and 1 column on mobile.
   * @default 3
   */
  columns?: 2 | 3 | 4;
}

// ---------------------------------------------------------------------------
// Column class mapping
// ---------------------------------------------------------------------------

/**
 * Static mapping from column count to the corresponding Tailwind class.
 * Tailwind cannot process dynamically constructed class names (e.g.
 * `grid-cols-${n}`), so every valid value is listed explicitly.
 */
const COLUMN_CLASSES: Record<NonNullable<FeatureGridProps["columns"]>, string> =
  {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  };

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Responsive grid layout for marketing FeatureCard components.
 *
 * Renders a CSS Grid that adapts across breakpoints:
 * - **Mobile** (< md): single column
 * - **Tablet** (md): 2 columns
 * - **Desktop** (lg+): configurable via the `columns` prop (2, 3, or 4)
 *
 * Each item in the `features` array is passed directly to a `FeatureCard`.
 * This is a server component -- no client interactivity required.
 *
 * @example
 * ```tsx
 * <FeatureGrid
 *   features={[
 *     { icon: <ShieldCheck className="size-6" />, title: "Secure", description: "End-to-end encryption." },
 *     { icon: <Globe className="size-6" />, title: "Global", description: "Coverage in 190+ countries." },
 *     { icon: <Clock className="size-6" />, title: "Real-time", description: "Updates every 15 minutes." },
 *   ]}
 *   columns={3}
 * />
 * ```
 */
function FeatureGrid({
  features,
  columns = 3,
  className,
  ...props
}: FeatureGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-6",
        COLUMN_CLASSES[columns],
        className,
      )}
      {...props}
    >
      {features.map((feature) => (
        <FeatureCard
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          href={feature.href}
          linkText={feature.linkText}
        />
      ))}
    </div>
  );
}
FeatureGrid.displayName = "FeatureGrid";

export { FeatureGrid };
