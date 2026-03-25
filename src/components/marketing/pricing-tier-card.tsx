import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
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
  /** Plan tier name displayed as the card heading (e.g. "Starter", "Pro"). */
  tierName: string;
  /** Formatted price string displayed prominently (e.g. "$450"). */
  price: string;
  /** Per-participant price breakdown (e.g. "~$15/student"). */
  perParticipant: string;
  /** Ordered list of feature descriptions included in this tier. */
  features: string[];
  /** Call-to-action button label text. */
  ctaText: string;
  /** Call-to-action destination URL. */
  ctaHref: string;
  /**
   * Whether this is the visually emphasized "recommended" tier.
   * Applies border accent, elevated shadow, and slight scale on desktop.
   * @default false
   */
  featured?: boolean;
  /**
   * Optional badge text displayed above the card header (e.g. "Most Popular").
   * Only rendered when provided.
   */
  badge?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Self-contained pricing tier card for plan comparison grids.
 *
 * Renders a plan name, price, per-participant breakdown, feature checklist,
 * and a CTA button. The `featured` prop elevates the card visually with a
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
 *   tierName="Starter"
 *   price="$450"
 *   perParticipant="~$15/student"
 *   features={["Up to 30 participants", "Basic route planning", "Email support"]}
 *   ctaText="Get Started"
 *   ctaHref="/demo"
 * />
 *
 * <PricingTierCard
 *   tierName="Professional"
 *   price="$850"
 *   perParticipant="~$12/student"
 *   features={["Unlimited participants", "Advanced risk assessment", "Priority support"]}
 *   ctaText="Start Free Trial"
 *   ctaHref="/demo"
 *   featured
 *   badge="Most Popular"
 * />
 * ```
 */
function PricingTierCard({
  tierName,
  price,
  perParticipant,
  features,
  ctaText,
  ctaHref,
  featured = false,
  badge,
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
      {/* Optional badge positioned above the card header */}
      {badge && (
        <div className="mb-4">
          <Badge variant="brand">{badge}</Badge>
        </div>
      )}

      {/* Tier name */}
      <h3 className="text-heading-sm text-foreground">{tierName}</h3>

      {/* Price block */}
      <div className="mt-4">
        <span className="text-display-md text-foreground">{price}</span>
        <span className="text-body-sm text-muted-foreground"> / trip</span>
      </div>

      {/* Per-participant breakdown */}
      <p className="mt-1 text-body-md font-semibold text-primary-700">
        {perParticipant}
      </p>

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
