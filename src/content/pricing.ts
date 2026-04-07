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
 * Used by PricingTierCard, PricingGrid, and any page that renders
 * plan comparisons. The `id` field is a stable machine-readable key
 * for analytics events and URL anchors.
 */
export interface TripTier {
  /** Stable machine-readable identifier (e.g. "field-trip"). */
  id: string;
  /** Display name shown as the card heading. */
  name: string;
  /** Flat per-trip price in dollars. */
  price: number;
  /** Human-readable per-participant breakdown string. */
  perParticipant: string;
  /** Typical group size used for the per-participant calculation. */
  typicalGroupSize: number;
  /** Ordered list of features included in this tier. */
  features: string[];
  /** Whether this tier should be visually featured / recommended. */
  featured: boolean;
  /** Optional badge text (e.g. "Most Popular"). */
  badge?: string;
}

/**
 * A segment-specific pricing scenario showing annual cost modeling.
 */
export interface SegmentScenario {
  /** Market segment name (e.g. "K-12 School District"). */
  segment: string;
  /** Typical number of trips per year for this segment. */
  trips: number;
  /** Typical group size per trip. */
  groupSize: number;
  /** Modeled annual cost in dollars. */
  annual: number;
  /** Effective per-participant cost. */
  perParticipant: string;
  /** Brief description of the scenario and why it fits. */
  description: string;
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

/**
 * Trip assessment tiers -- the core pricing offering.
 *
 * Order: ascending by price. The middle tier (Extended Trip) is the
 * featured / recommended plan by default.
 */
export const TRIP_TIERS: readonly TripTier[] = [
  {
    id: "day-trip",
    name: "Day Trip",
    price: 450,
    perParticipant: "~$15/student for a 30-person group",
    typicalGroupSize: 30,
    features: [
      "Experienced analyst review",
      "Active intelligence monitoring",
      "Complete safety binder",
      "Chaperone mobile app",
      "Delivery in as soon as 3 days",
    ],
    featured: false,
  },
  {
    id: "extended-trip",
    name: "Extended Trip",
    price: 750,
    perParticipant: "~$19/student for a 40-person group",
    typicalGroupSize: 40,
    features: [
      "Everything in Day Trip",
      "Multi-day trip support",
      "Extended trip coverage",
      "Sports travel coverage",
      "Priority review assignment",
    ],
    featured: true,
    badge: "Most Popular",
  },
  {
    id: "international",
    name: "International",
    price: 1250,
    perParticipant: "~$42/participant for a 30-person group",
    typicalGroupSize: 30,
    features: [
      "Everything in Extended Trip",
      "International intelligence coverage",
      "Embassy and consulate contacts",
      "Cross-border risk assessment",
      "Evacuation planning documentation",
    ],
    featured: false,
  },
] as const;

/**
 * Segment-specific pricing scenarios for ROI modeling.
 *
 * Each scenario models a realistic annual usage pattern for the given
 * market segment.
 */
export const SEGMENT_SCENARIOS: readonly SegmentScenario[] = [
  {
    segment: "K-12 School District",
    trips: 12,
    groupSize: 30,
    annual: 5400,
    perParticipant: "~$15",
    description:
      "A mid-size district running monthly field trips. FERPA-ready documentation for every outing.",
  },
  {
    segment: "Church / Mission Organization",
    trips: 6,
    groupSize: 25,
    annual: 4500,
    perParticipant: "~$30",
    description:
      "Mix of domestic youth retreats and international mission trips. Insurance-ready documentation for volunteer travel.",
  },
  {
    segment: "Higher Education",
    trips: 20,
    groupSize: 35,
    annual: 15000,
    perParticipant: "~$21.43",
    description:
      "Study abroad programs, athletic travel, and research expeditions. Clery Act and institutional risk management compliance.",
  },
  {
    segment: "Corporate / Sports",
    trips: 30,
    groupSize: 20,
    annual: 13500,
    perParticipant: "~$22.50",
    description:
      "Business travel, team transportation, and off-site events. Duty of care documentation for mid-market organizations.",
  },
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
    value: "From $15/participant",
    description:
      "Professional review, current safety information, and board-ready documentation -- delivered in 3-5 business days with minimal staff time.",
  },
] as const;

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

/**
 * Formats a TripTier price as a display string (e.g. "$450").
 * Centralizes formatting so every page renders prices identically.
 */
export function formatTierPrice(tier: TripTier): string {
  return `$${tier.price.toLocaleString("en-US")}`;
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
