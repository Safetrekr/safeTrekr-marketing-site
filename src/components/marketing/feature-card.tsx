import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

/* ================================================================
   FeatureCard -- Marketing Feature Highlight Card
   Ticket: ST-819
   Usage: Feature grids, capability showcases, product benefit sections
   ================================================================ */

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface FeatureCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Icon rendered at the top of the card (typically a Lucide icon or custom SVG). */
  icon: React.ReactNode;
  /** Feature title displayed as a heading. */
  title: string;
  /** Short description of the feature or benefit. */
  description: string;
  /**
   * When provided, the entire card becomes a clickable link navigating
   * to this URL. Renders a Next.js `Link` with an arrow indicator.
   */
  href?: string;
  /**
   * Text displayed next to the arrow indicator when `href` is provided.
   * @default "Learn more"
   */
  linkText?: string;
}

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const cardBaseStyles = cn(
  "group rounded-lg border border-border bg-card p-6",
  "shadow-[var(--shadow-sm)]",
  "transition-all duration-[200ms] ease-[var(--ease-default)]",
);

const cardHoverStyles =
  "hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Marketing card highlighting a single product feature or benefit.
 *
 * Renders a static `div` by default. When an `href` prop is provided,
 * the card wraps its content in a Next.js `Link`, making the entire
 * surface clickable with an arrow indicator at the bottom.
 *
 * Designed as a server component -- no `'use client'` directive.
 *
 * @example
 * ```tsx
 * // Static card (no link)
 * <FeatureCard
 *   icon={<ShieldCheck className="size-6" />}
 *   title="Evidence-Grade Records"
 *   description="Every assessment produces tamper-evident documentation."
 * />
 *
 * // Linked card
 * <FeatureCard
 *   icon={<Globe className="size-6" />}
 *   title="Global Coverage"
 *   description="Real-time data from 5 government intelligence sources."
 *   href="/features/coverage"
 *   linkText="Explore coverage"
 * />
 * ```
 */
function FeatureCard({
  icon,
  title,
  description,
  href,
  linkText = "Learn more",
  className,
  ...props
}: FeatureCardProps) {
  const content = (
    <>
      {/* Icon container */}
      <div
        className="mb-4 inline-flex items-center justify-center rounded-md border border-primary-200 bg-primary-50 p-2.5 text-primary-700"
        aria-hidden="true"
      >
        <span className="[&_svg]:size-5">{icon}</span>
      </div>

      {/* Title */}
      <h3 className="text-heading-sm text-card-foreground">{title}</h3>

      {/* Description */}
      <p className="mt-2 text-body-sm text-muted-foreground">{description}</p>

      {/* Link indicator (only when href is provided) */}
      {href && (
        <span
          className={cn(
            "mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700",
            "transition-colors duration-[var(--duration-fast)]",
            "group-hover:text-primary-600",
          )}
          aria-hidden="true"
        >
          {linkText}
          <ArrowRight className="size-4 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5" />
        </span>
      )}
    </>
  );

  // -----------------------------------------------------------------------
  // Linked card: entire surface is clickable
  // -----------------------------------------------------------------------
  if (href) {
    return (
      <div
        className={cn(cardBaseStyles, cardHoverStyles, className)}
        {...props}
      >
        <Link
          href={href}
          className="flex flex-col focus-visible:outline-none"
          aria-label={`${title} - ${linkText}`}
        >
          {content}
        </Link>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Static card: no interaction, purely informational
  // -----------------------------------------------------------------------
  return (
    <div className={cn(cardBaseStyles, className)} {...props}>
      {content}
    </div>
  );
}
FeatureCard.displayName = "FeatureCard";

export { FeatureCard };
