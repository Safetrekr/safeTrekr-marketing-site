/* ================================================================
   Pricing Data -- Single Source of Truth
   Ticket: ST-887
   Usage: Every page that references pricing, tiers, volume discounts,
          segment scenarios, or value anchors imports from here.
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
 * Volume discount bracket for organizations purchasing multiple trips.
 */
export interface VolumeDiscount {
  /** Trip count range as a display string (e.g. "5-9", "50+"). */
  trips: string;
  /** Human-readable discount label. */
  discount: string;
  /** Discount percentage (0 = no discount). */
  pct: number;
  /** Optional note for the bracket (e.g. "+ dedicated analyst"). */
  note?: string;
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
  /** Effective per-participant cost after volume discounts. */
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
    id: "field-trip",
    name: "Field Trip",
    price: 450,
    perParticipant: "~$15/student for a 30-person group",
    typicalGroupSize: 30,
    features: [
      "17-section analyst review",
      "5 government intelligence sources",
      "Complete safety binder",
      "Mobile field operations",
      "3-5 day turnaround",
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
      "Everything in Field Trip",
      "Multi-day trip support",
      "Extended monitoring period",
      "Sports travel coverage",
      "Priority analyst assignment",
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
 * Volume discount brackets for multi-trip purchases.
 *
 * Applied as a percentage off the per-trip price. The 50+ bracket
 * includes a dedicated analyst as an additional benefit.
 */
export const VOLUME_DISCOUNTS: readonly VolumeDiscount[] = [
  { trips: "1-4", discount: "Standard", pct: 0 },
  { trips: "5-9", discount: "5% off", pct: 5 },
  { trips: "10-24", discount: "10% off", pct: 10 },
  { trips: "25-49", discount: "15% off", pct: 15 },
  { trips: "50+", discount: "20% off", pct: 20, note: "+ dedicated analyst" },
] as const;

/**
 * Segment-specific pricing scenarios for ROI modeling.
 *
 * Each scenario models a realistic annual usage pattern for the given
 * market segment, including volume discount where applicable.
 */
export const SEGMENT_SCENARIOS: readonly SegmentScenario[] = [
  {
    segment: "K-12 School District",
    trips: 12,
    groupSize: 30,
    annual: 4860,
    perParticipant: "~$13.50",
    description:
      "A mid-size district running monthly field trips. 10% volume discount applied at 12 trips/year. FERPA-ready documentation for every outing.",
  },
  {
    segment: "Church / Mission Organization",
    trips: 6,
    groupSize: 25,
    annual: 4275,
    perParticipant: "~$28.50",
    description:
      "Mix of domestic youth retreats and international mission trips. 5% volume discount at 6 trips/year. Insurance-ready documentation for volunteer travel.",
  },
  {
    segment: "Higher Education",
    trips: 20,
    groupSize: 35,
    annual: 13500,
    perParticipant: "~$19.29",
    description:
      "Study abroad programs, athletic travel, and research expeditions. 10% volume discount at 20 trips/year. Clery Act and institutional risk management compliance.",
  },
  {
    segment: "Corporate / Sports",
    trips: 30,
    groupSize: 20,
    annual: 11475,
    perParticipant: "~$19.13",
    description:
      "Business travel, team transportation, and off-site events. 15% volume discount at 30 trips/year. Duty of care documentation for mid-market organizations.",
  },
] as const;

/**
 * Value anchors for cost-framing and ROI positioning.
 *
 * Used in pricing sections to contextualize SafeTrekr cost against the
 * financial exposure of unreviewed trips and the time cost of DIY prep.
 */
export const VALUE_ANCHORS: readonly ValueAnchor[] = [
  {
    label: "Average liability settlement",
    value: "$500K-$2M",
    description:
      "The average trip-related legal settlement when an organization cannot demonstrate due diligence. One incident can exceed a decade of SafeTrekr investment.",
  },
  {
    label: "Staff time per trip (DIY)",
    value: "8-12 hours",
    description:
      "Hours spent by administrators assembling safety information from scattered sources, without professional analysis or evidence-grade documentation.",
  },
  {
    label: "SafeTrekr cost",
    value: "From $15/participant",
    description:
      "Professional analyst review, government intelligence scoring, and tamper-evident documentation -- delivered in 3-5 business days with no staff time required.",
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
