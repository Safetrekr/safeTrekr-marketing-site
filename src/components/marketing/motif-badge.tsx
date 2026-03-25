import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { MapPin, ClipboardCheck, FileText, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/* ================================================================
   MotifBadge -- Route / Review / Record / Readiness Pill
   Ticket: ST-855
   Usage: Feature callouts, section labels, capability indicators
   ================================================================ */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The four proprietary motif categories in SafeTrekr's safety methodology. */
type Motif = "route" | "review" | "record" | "readiness";

interface MotifConfig {
  /** Lucide icon component for this motif. */
  icon: LucideIcon;
  /** Human-readable label text displayed in the badge. */
  label: string;
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const MOTIF_CONFIG: Record<Motif, MotifConfig> = {
  route: {
    icon: MapPin,
    label: "Route",
  },
  review: {
    icon: ClipboardCheck,
    label: "Review",
  },
  record: {
    icon: FileText,
    label: "Record",
  },
  readiness: {
    icon: Shield,
    label: "Readiness",
  },
};

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const motifBadgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 font-semibold text-primary-700",
  {
    variants: {
      size: {
        sm: "px-2 py-0.5 text-xs [&_svg]:size-3",
        md: "px-2.5 py-1 text-sm [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface MotifBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof motifBadgeVariants> {
  /**
   * Which SafeTrekr motif this badge represents.
   * Determines the icon and label text.
   */
  motif: Motif;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Compact pill badge representing one of the four SafeTrekr proprietary
 * motifs: Route, Review, Record, or Readiness.
 *
 * Renders a Lucide icon alongside the motif label in a primary-accented
 * pill. The icon uses `primary-500` while text uses `primary-700` to
 * meet WCAG 2.2 AA contrast requirements against the `primary-50` background.
 *
 * @example
 * <MotifBadge motif="route" />
 * <MotifBadge motif="readiness" size="md" />
 *
 * // Row of all four motifs
 * <div className="flex gap-2">
 *   <MotifBadge motif="route" />
 *   <MotifBadge motif="review" />
 *   <MotifBadge motif="record" />
 *   <MotifBadge motif="readiness" />
 * </div>
 */
function MotifBadge({ motif, size, className, ...props }: MotifBadgeProps) {
  const config = MOTIF_CONFIG[motif];
  const Icon = config.icon;

  return (
    <span
      className={cn(motifBadgeVariants({ size }), className)}
      {...props}
    >
      <Icon className="shrink-0 text-primary-500" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}
MotifBadge.displayName = "MotifBadge";

export { MotifBadge, motifBadgeVariants };
export type { Motif };
