import * as React from "react";

import { cn } from "@/lib/utils";
import { PricingTierCard, type PricingTierCardProps } from "./pricing-tier-card";

/* ================================================================
   PricingGrid -- Pricing Tier Comparison Row
   Ticket: ST-865
   Usage: Pricing page, plan comparison sections
   ================================================================ */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PricingGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of pricing tier configurations. Expected to contain exactly 3 tiers
   * for the standard pricing layout. The middle tier (index 1) automatically
   * receives `featured=true` treatment with elevated visual prominence.
   */
  tiers: PricingTierCardProps[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Responsive grid that renders PricingTierCard components in a single row.
 *
 * Layout behaviour:
 * - **Mobile / Tablet** (< lg): single-column stack for comfortable reading
 * - **Desktop** (lg+): 3-column row with the middle card elevated
 *
 * The middle card (index 1 in a 3-tier array, or `Math.floor(length / 2)` for
 * other counts) automatically receives `featured=true`, which applies the
 * primary border accent, elevated shadow, and slight scale-up defined by
 * `PricingTierCard`. Any existing `featured` value on that tier is overridden
 * to ensure visual consistency.
 *
 * This is a server component -- no client-side interactivity required.
 *
 * @example
 * ```tsx
 * <PricingGrid
 *   tiers={[
 *     {
 *       tierName: "Starter",
 *       price: "$450",
 *       perParticipant: "~$15/student",
 *       features: ["Up to 30 participants", "Basic route planning"],
 *       ctaText: "Get Started",
 *       ctaHref: "/demo",
 *     },
 *     {
 *       tierName: "Professional",
 *       price: "$850",
 *       perParticipant: "~$12/student",
 *       features: ["Unlimited participants", "Advanced risk assessment"],
 *       ctaText: "Start Free Trial",
 *       ctaHref: "/demo",
 *       badge: "Most Popular",
 *     },
 *     {
 *       tierName: "Enterprise",
 *       price: "$1,250",
 *       perParticipant: "~$8/student",
 *       features: ["Custom integrations", "Dedicated support"],
 *       ctaText: "Contact Sales",
 *       ctaHref: "/contact",
 *     },
 *   ]}
 * />
 * ```
 */
function PricingGrid({ tiers, className, ...props }: PricingGridProps) {
  const featuredIndex = Math.floor(tiers.length / 2);

  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-3 gap-8 items-start",
        className,
      )}
      {...props}
    >
      {tiers.map((tier, index) => {
        const isFeatured = index === featuredIndex;

        return (
          <PricingTierCard
            key={tier.tierName}
            {...tier}
            featured={isFeatured}
          />
        );
      })}
    </div>
  );
}
PricingGrid.displayName = "PricingGrid";

export { PricingGrid };
