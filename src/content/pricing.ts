/* ================================================================
   Pricing Data -- Single Source of Truth
   Ticket: ST-887
   Usage: Every page that references pricing, tiers, segment scenarios,
          or value anchors imports from here.
   ================================================================ */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * A single pricing tier representing a trip assessment level.
 *
 * Each tier is a base price that covers a set number of travelers, plus a
 * flat fee for every traveler beyond that. A "traveler" is anyone going on
 * the trip (students, staff, chaperones), except free parents/guardians.
 *
 * Used by PricingTierCard and any page that renders plan comparisons. The
 * `id` field is a stable machine-readable key for analytics events and URL
 * anchors.
 */
export interface TripTier {
  /** Stable machine-readable identifier (e.g. "day-trip"). */
  id: string;
  /** Display name shown as the card heading. */
  name: string;
  /** Base per-trip price in dollars, covering `includedTravelers`. */
  price: number;
  /** Number of travelers covered by the base price. */
  includedTravelers: number;
  /** Ordered list of features included in this tier. */
  features: string[];
  /** Whether this tier should be visually featured / recommended. */
  featured: boolean;
  /** Optional badge text (e.g. "Most Popular"). */
  badge?: string;
}

/**
 * A value anchor for positioning SafeTrekr cost against risk / alternatives.
 */
export interface ValueAnchor {
  /** Short label (e.g. "Average liability settlement"). */
  label: string;
  /** Formatted value string (e.g. "$500K-$2M"). */
  value: string;
  /** Explanatory description of what the value represents. */
  description: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

/** Price in dollars for each traveler beyond a tier's included travelers. */
export const ADDITIONAL_TRAVELER_PRICE = 40;

/** Guardian policy shown alongside every tier. */
export const GUARDIAN_POLICY =
  "1 parent/guardian per traveler free (not counted as a traveler)";

export const DAY_TRIP: TripTier = {
  id: "day-trip",
  name: "Day Trip",
  price: 400,
  includedTravelers: 10,
  features: [
    "Experienced analyst review",
    "Active intelligence monitoring",
    "Complete safety binder",
    "Chaperone mobile app",
    "Fast delivery turnaround",
  ],
  featured: false,
};

export const MULTI_DAY_TRIP: TripTier = {
  id: "multi-day-trip",
  name: "Multi-Day Trip",
  price: 800,
  includedTravelers: 20,
  features: [
    "Everything in Day Trip",
    "Multi-day trip support",
    "Extended trip coverage",
    "Sports travel coverage",
    "Priority review assignment",
  ],
  featured: true,
  badge: "Most Popular",
};

export const INTERNATIONAL_TRIP: TripTier = {
  id: "international",
  name: "International",
  price: 1200,
  includedTravelers: 30,
  features: [
    "Everything in Multi-Day Trip",
    "International intelligence coverage",
    "Embassy and consulate contacts",
    "Cross-border risk assessment",
    "Evacuation planning documentation",
  ],
  featured: false,
};

/**
 * Trip assessment tiers -- the core pricing offering.
 *
 * Order: ascending by price. The middle tier (Multi-Day Trip) is the
 * featured / recommended plan by default.
 */
export const TRIP_TIERS: readonly TripTier[] = [
  DAY_TRIP,
  MULTI_DAY_TRIP,
  INTERNATIONAL_TRIP,
] as const;

/**
 * Value anchors for cost-framing and ROI positioning.
 *
 * Used in pricing sections to contextualize SafeTrekr cost against the
 * time investment of manual preparation and the value of consistency.
 */
export const VALUE_ANCHORS: readonly ValueAnchor[] = [
  {
    label: "Staff time per trip (DIY)",
    value: "8-12 hours",
    description:
      "Hours spent by administrators assembling safety information from scattered sources, without professional review or consistent documentation.",
  },
  {
    label: "SafeTrekr cost",
    value: "From $400/trip",
    description:
      "Professional review, current safety information, and board-ready documentation -- delivered quickly with minimal staff time.",
  },
] as const;

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

/**
 * Formats a TripTier price as a display string (e.g. "$400").
 * Centralizes formatting so every page renders prices identically.
 */
export function formatTierPrice(tier: TripTier): string {
  return formatPrice(tier.price);
}

/**
 * Returns the featured (recommended) tier, or the middle tier as fallback.
 */
export function getFeaturedTier(): TripTier {
  const featured = TRIP_TIERS.find((t) => t.featured);
  const fallbackIndex = Math.floor(TRIP_TIERS.length / 2);
  // Non-null assertion is safe: TRIP_TIERS is a non-empty readonly array
  // defined above, and fallbackIndex is always a valid index.
  return featured ?? TRIP_TIERS[fallbackIndex]!;
}

/**
 * Formats a dollar amount for display (e.g. 1200 -> "$1,200").
 */
export function formatPrice(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

/**
 * Total price for one trip with the given number of travelers.
 * Free parents/guardians should not be included in `travelers`.
 */
export function calculateTripPrice(tier: TripTier, travelers: number): number {
  const additional = Math.max(0, travelers - tier.includedTravelers);
  return tier.price + additional * ADDITIONAL_TRAVELER_PRICE;
}
