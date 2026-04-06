"use client";

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ================================================================
   InternationalPricingCard -- Interactive International Tier Card
   Ticket: ST-887
   Usage: Pricing page, International tier with traveler count toggle
   ================================================================ */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InternationalPricingCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Ordered list of feature descriptions included in this tier. */
  features: string[];
  /** Call-to-action button label text. */
  ctaText: string;
  /** Call-to-action destination URL. */
  ctaHref: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Interactive International pricing card with traveler count toggle.
 *
 * Shows $750 for groups with less than 9 travelers, $1,250 for 10 or more.
 * The toggle allows users to see the price that applies to their group size.
 */
function InternationalPricingCard({
  features,
  ctaText,
  ctaHref,
  className,
  ...props
}: InternationalPricingCardProps) {
  const [isLargeGroup, setIsLargeGroup] = React.useState(false);

  const price = isLargeGroup ? "$1,250" : "$750";
  const perParticipant = isLargeGroup
    ? "~$42/person for a 30-person group"
    : "For groups of 9 or fewer travelers";

  return (
    <div
      className={cn(
        // Base card styles
        "relative flex flex-col rounded-xl border bg-card p-8 transition-shadow duration-moderate",
        // Default state (not featured)
        "border-border shadow-sm",
        className,
      )}
      {...props}
    >
      {/* Tier name */}
      <h3 className="text-heading-sm text-foreground">International</h3>

      {/* Price block */}
      <div className="mt-4">
        <span className="text-display-md text-foreground">{price}</span>
        <span className="text-body-sm text-muted-foreground"> / trip</span>
      </div>

      {/* Per-participant breakdown */}
      <p className="mt-1 text-body-md font-semibold text-primary-700">
        {perParticipant}
      </p>

      {/* Traveler count toggle */}
      <div className="mt-4">
        <div className="inline-flex rounded-lg bg-muted p-1">
          <button
            type="button"
            onClick={() => setIsLargeGroup(false)}
            className={cn(
              "rounded-md px-3 py-1.5 text-body-sm font-medium transition-all",
              !isLargeGroup
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Less than 10
          </button>
          <button
            type="button"
            onClick={() => setIsLargeGroup(true)}
            className={cn(
              "rounded-md px-3 py-1.5 text-body-sm font-medium transition-all",
              isLargeGroup
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            10 or more
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-6 border-border" />

      {/* Feature checklist */}
      <ul className="flex-1 space-y-3" role="list">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check
              className="mt-0.5 size-4 shrink-0 text-primary-600"
              aria-hidden="true"
            />
            <span className="text-body-sm text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA button */}
      <div className="mt-8">
        <Button variant="secondary" size="lg" className="w-full" asChild>
          <Link href={ctaHref}>{ctaText}</Link>
        </Button>
      </div>
    </div>
  );
}
InternationalPricingCard.displayName = "InternationalPricingCard";

export { InternationalPricingCard };
