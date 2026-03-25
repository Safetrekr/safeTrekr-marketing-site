import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

/* ================================================================
   SegmentCard -- Segment Landing Page Navigation Card
   Ticket: ST-839
   Usage: Homepage segment grid (K-12, Higher Ed, Churches, Corporate)
   ================================================================ */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SegmentCardProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** Lucide icon or custom ReactNode rendered at the top of the card. */
  icon: React.ReactNode;
  /** Segment name displayed as the card heading. */
  title: string;
  /** Brief value proposition for this segment. */
  description: string;
  /** Regulatory or compliance hook text (e.g. "FERPA-ready"). */
  regulatoryHook: string;
  /** Destination URL for the segment landing page. */
  href: string;
  /** Additional CSS class names applied to the outer Link element. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Navigation card that routes visitors to a segment-specific landing page.
 *
 * Each card represents a vertical market SafeTrekr serves (K-12, Higher Ed,
 * Churches, Corporate). The full card surface is an interactive link with
 * hover effects: slight lift, elevated shadow, title color shift to
 * primary-700, and an arrow that slides right.
 *
 * Renders as a server component -- no client-side JavaScript required.
 *
 * @example
 * ```tsx
 * import { GraduationCap } from "lucide-react";
 *
 * <SegmentCard
 *   icon={<GraduationCap />}
 *   title="K-12 Schools"
 *   description="Protect students on every field trip with automated safety binders."
 *   regulatoryHook="FERPA-ready"
 *   href="/segments/k-12"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Grid of segment cards
 * <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
 *   <SegmentCard icon={<GraduationCap />} title="K-12 Schools" ... />
 *   <SegmentCard icon={<School />} title="Higher Education" ... />
 *   <SegmentCard icon={<Church />} title="Churches" ... />
 *   <SegmentCard icon={<Building2 />} title="Corporate" ... />
 * </div>
 * ```
 */
function SegmentCard({
  icon,
  title,
  description,
  regulatoryHook,
  href,
  className,
  ...props
}: SegmentCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        // Base card styles
        "group relative flex flex-col rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]",
        // Transition for hover lift + shadow
        "transition-all duration-200 ease-[var(--ease-default)]",
        // Hover: lift and elevate shadow
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]",
        // Focus-visible is handled by the global :focus-visible rule in globals.css
        className,
      )}
      {...props}
    >
      {/* Icon */}
      <span
        className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 [&_svg]:size-5"
        aria-hidden="true"
      >
        {icon}
      </span>

      {/* Title */}
      <h3
        className={cn(
          "text-heading-sm text-card-foreground",
          "transition-colors duration-200 ease-[var(--ease-default)]",
          "group-hover:text-primary-700",
        )}
      >
        {title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-body-sm text-muted-foreground">{description}</p>

      {/* Regulatory hook + arrow */}
      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="text-body-xs font-semibold text-primary-600">
          {regulatoryHook}
        </span>
        <ArrowRight
          className={cn(
            "size-4 text-primary-600",
            "transition-transform duration-200 ease-[var(--ease-default)]",
            "group-hover:translate-x-1",
          )}
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
SegmentCard.displayName = "SegmentCard";

export { SegmentCard };
