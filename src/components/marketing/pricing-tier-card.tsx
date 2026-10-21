import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  ADDITIONAL_TRAVELER_PRICE,
  GUARDIAN_POLICY,
  formatPrice,
  type TripTier,
} from "@/content/pricing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* ================================================================
   PricingTierCard -- Pricing Plan Display Card
   Ticket: ST-821
   Usage: Pricing section, plan comparison grids
   ================================================================ */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PricingTierCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Pricing tier from `@/content/pricing` (name, price, included travelers). */
  tier: TripTier;
  /**
   * Ordered list of feature descriptions included in this tier.
   * Defaults to `tier.features`; pages may pass segment-specific copy.
   */
  features?: readonly string[];
  /** Call-to-action button label text. */
  ctaText: string;
  /** Call-to-action destination URL. */
  ctaHref: string;
  /**
   * Whether this is the visually emphasized "recommended" tier.
   * Applies border accent, elevated shadow, and slight scale on desktop.
   * @default tier.featured
   */
  featured?: boolean;
  /**
   * Optional badge text displayed above the card header (e.g. "Most Popular").
   * Defaults to `tier.badge`. Only rendered when present.
   */
  badge?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Self-contained pricing tier card for plan comparison grids.
 *
 * Renders a plan name, base price, traveler terms (included travelers,
 * additional-traveler fee, guardian policy), feature checklist, and a CTA
 * button. The `featured` prop elevates the card visually with a
 * primary border accent, deeper shadow, and a subtle 3% scale-up on desktop
 * viewports to draw attention to the recommended plan.
 *
 * An optional `badge` prop renders a small pill above the card header --
 * typically used for "Most Popular" or similar callouts on the featured tier.
 *
 * The CTA renders as a Next.js `Link` via the `Button` component's `asChild`
 * pattern, ensuring client-side navigation for internal hrefs.
 *
 * @example
 * ```tsx
 * <PricingTierCard
 *   tier={DAY_TRIP}
 *   ctaText="Schedule a Walkthrough"
 *   ctaHref="/demo"
 * />
 *
 * <PricingTierCard
 *   tier={MULTI_DAY_TRIP}
 *   features={["Everything in Day Trip", "Overnight travel support"]}
 *   ctaText="Schedule a Walkthrough"
 *   ctaHref="/demo"
 * />
 * ```
 */
function PricingTierCard({
  tier,
  features = tier.features,
  ctaText,
  ctaHref,
  featured = tier.featured,
  badge = tier.badge,
  className,
  ...props
}: PricingTierCardProps) {
  return (
    <div
      className={cn(
        // Base card styles
        "relative flex flex-col rounded-xl border bg-card p-8 transition-shadow duration-moderate",
        // Default state
        !featured && "border-border shadow-sm",
        // Featured state: primary accent border, elevated shadow, desktop scale
        featured && "border-primary-500 shadow-xl lg:scale-[1.03]",
        className,
      )}
      {...props}
    >
      {/* Optional badge positioned at top center, overlapping the border */}
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="default">{badge}</Badge>
        </div>
      )}

      {/* Tier name */}
      <h3 className="text-heading-sm text-foreground">{tier.name}</h3>

      {/* Price block */}
      <div className="mt-4">
        <span className="text-display-md text-foreground">
          {formatPrice(tier.price)}
        </span>
        <span className="text-body-sm text-muted-foreground"> / trip</span>
      </div>

      {/* Traveler terms */}
      <ul className="mt-3 space-y-1 text-body-sm text-muted-foreground">
        <li>
          <span className="font-medium text-foreground">
            First {tier.includedTravelers} travelers included
          </span>
        </li>
        <li>+{formatPrice(ADDITIONAL_TRAVELER_PRICE)} per additional traveler</li>
        <li>{GUARDIAN_POLICY}</li>
      </ul>

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
        <Button
          variant={featured ? "primary" : "secondary"}
          size="lg"
          className="w-full"
          asChild
        >
          <Link href={ctaHref}>{ctaText}</Link>
        </Button>
      </div>
    </div>
  );
}
PricingTierCard.displayName = "PricingTierCard";

export { PricingTierCard };
