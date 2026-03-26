"use client";

/**
 * ST-873: ROI Calculator -- Interactive Client Component
 *
 * Compares SafeTrekr cost against status-quo manual planning labor.
 * Users configure their organization profile (segment, trips/year,
 * group size, current method) and see calculated cost savings.
 *
 * Pricing data is imported from the single source of truth (src/content/pricing.ts).
 * Results are shareable via URL search params.
 *
 * Analytics events (Plausible):
 *   - roi_calculator_start  -- first interaction with any input
 *   - roi_calculator_complete -- results section rendered/updated
 *
 * @see src/content/pricing.ts
 * @see src/components/marketing/per-student-calculator.tsx (slider pattern)
 */

import { useState, useCallback, useEffect, useRef, useId, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  TrendingDown,
  DollarSign,
  Shield,
  Share2,
  Check,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { TRIP_TIERS, VOLUME_DISCOUNTS } from "@/content/pricing";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Segment = "k12" | "higher-ed" | "churches" | "corporate" | "sports";
type SafetyMethod = "none" | "spreadsheets" | "another-platform";

interface CalculatorInputs {
  segment: Segment;
  tripsPerYear: number;
  avgGroupSize: number;
  currentMethod: SafetyMethod;
}

interface CalculatorResults {
  /** Annual SafeTrekr cost after volume discount. */
  annualSafetrekrCost: number;
  /** Effective per-participant cost. */
  costPerStudent: number;
  /** Estimated annual cost of current manual planning approach. */
  annualStatusQuoCost: number;
  /** Net annual savings (status quo - SafeTrekr). */
  annualSavings: number;
  /** Estimated risk reduction as a percentage (0-100). */
  riskReductionPct: number;
  /** Volume discount percentage applied. */
  volumeDiscountPct: number;
  /** Per-trip price before volume discount. */
  baseTripPrice: number;
  /** Per-trip price after volume discount. */
  discountedTripPrice: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SEGMENTS: { value: Segment; label: string }[] = [
  { value: "k12", label: "K-12 Schools" },
  { value: "higher-ed", label: "Higher Education" },
  { value: "churches", label: "Churches & Missions" },
  { value: "corporate", label: "Corporate" },
  { value: "sports", label: "Sports Organizations" },
];

const SAFETY_METHODS: { value: SafetyMethod; label: string; description: string }[] = [
  {
    value: "none",
    label: "None",
    description: "No formal safety planning process",
  },
  {
    value: "spreadsheets",
    label: "Spreadsheets / Manual",
    description: "Staff-managed checklists and documents",
  },
  {
    value: "another-platform",
    label: "Another Platform",
    description: "Using a different safety or travel tool",
  },
];

/**
 * Maps segments to their primary trip tier from TRIP_TIERS.
 * K-12 uses Field Trip; all others default to Extended Trip.
 */
const SEGMENT_TIER_MAP: Record<Segment, string> = {
  "k12": "day-trip",
  "higher-ed": "extended-trip",
  "churches": "extended-trip",
  "corporate": "extended-trip",
  "sports": "extended-trip",
};

/**
 * Estimated staff-hours per trip for manual safety planning, by current method.
 * Source: VALUE_ANCHORS in pricing.ts ("8-12 hours" for DIY).
 */
const STAFF_HOURS_PER_TRIP: Record<SafetyMethod, { low: number; high: number }> = {
  "none": { low: 10, high: 14 },
  "spreadsheets": { low: 6, high: 10 },
  "another-platform": { low: 2, high: 4 },
};

/**
 * Blended hourly cost of staff time spent on safety planning.
 * Accounts for administrator/coordinator salary + benefits.
 */
const STAFF_HOURLY_RATE = 45;

/**
 * Risk reduction estimates by current method.
 * SafeTrekr's analyst review + documentation reduces liability exposure.
 */
const RISK_REDUCTION_PCT: Record<SafetyMethod, number> = {
  "none": 85,
  "spreadsheets": 65,
  "another-platform": 35,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format a number as USD with no decimals. */
function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format a number as USD with two decimals (for per-student cost). */
function formatUSDCents(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Looks up the volume discount percentage from VOLUME_DISCOUNTS based on
 * the number of trips per year. Uses the actual data from pricing.ts.
 */
function getVolumeDiscountPct(tripsPerYear: number): number {
  // Walk through brackets in reverse to find the matching one.
  // VOLUME_DISCOUNTS is ordered ascending: "1-4", "5-9", "10-24", "25-49", "50+"
  if (tripsPerYear >= 50) return VOLUME_DISCOUNTS[4]!.pct;
  if (tripsPerYear >= 25) return VOLUME_DISCOUNTS[3]!.pct;
  if (tripsPerYear >= 10) return VOLUME_DISCOUNTS[2]!.pct;
  if (tripsPerYear >= 5) return VOLUME_DISCOUNTS[1]!.pct;
  return VOLUME_DISCOUNTS[0]!.pct;
}

/**
 * Core calculation engine. Derives all outputs from the pricing data
 * and the user's inputs.
 */
function calculateROI(inputs: CalculatorInputs): CalculatorResults {
  const { segment, tripsPerYear, avgGroupSize, currentMethod } = inputs;

  // 1. Determine base trip price from tier
  const tierId = SEGMENT_TIER_MAP[segment];
  const tier = TRIP_TIERS.find((t) => t.id === tierId) ?? TRIP_TIERS[0]!;
  const baseTripPrice = tier.price;

  // 2. Apply volume discount
  const volumeDiscountPct = getVolumeDiscountPct(tripsPerYear);
  const discountedTripPrice = baseTripPrice * (1 - volumeDiscountPct / 100);

  // 3. Annual SafeTrekr cost
  const annualSafetrekrCost = discountedTripPrice * tripsPerYear;

  // 4. Cost per student (participant)
  const totalParticipants = tripsPerYear * avgGroupSize;
  const costPerStudent = totalParticipants > 0 ? annualSafetrekrCost / totalParticipants : 0;

  // 5. Status quo cost: midpoint of staff hours range * hourly rate * trips
  const hours = STAFF_HOURS_PER_TRIP[currentMethod];
  const avgHoursPerTrip = (hours.low + hours.high) / 2;
  const annualStatusQuoCost = avgHoursPerTrip * STAFF_HOURLY_RATE * tripsPerYear;

  // 6. Annual savings
  const annualSavings = annualStatusQuoCost - annualSafetrekrCost;

  // 7. Risk reduction estimate
  const riskReductionPct = RISK_REDUCTION_PCT[currentMethod];

  return {
    annualSafetrekrCost,
    costPerStudent,
    annualStatusQuoCost,
    annualSavings,
    riskReductionPct,
    volumeDiscountPct,
    baseTripPrice,
    discountedTripPrice,
  };
}

/** Check if a string is a valid Segment. */
function isValidSegment(val: string | null): val is Segment {
  return val !== null && SEGMENTS.some((s) => s.value === val);
}

/** Check if a string is a valid SafetyMethod. */
function isValidMethod(val: string | null): val is SafetyMethod {
  return val !== null && SAFETY_METHODS.some((m) => m.value === val);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface ROICalculatorProps {
  /** Additional CSS classes applied to the outer wrapper. */
  className?: string;
}

/**
 * Interactive ROI calculator comparing SafeTrekr cost against manual planning.
 *
 * Inputs: segment, trips/year, avg group size, current safety method.
 * Outputs: cost per student, annual savings, risk reduction estimate.
 *
 * State is synced to URL search params for shareability.
 */
export function ROICalculator({ className }: ROICalculatorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // ── Stable IDs for accessible label associations ───────────────────────
  const instanceId = useId();
  const segmentId = `${instanceId}-segment`;
  const tripsId = `${instanceId}-trips`;
  const groupSizeId = `${instanceId}-group-size`;
  const methodId = `${instanceId}-method`;
  const resultsId = `${instanceId}-results`;

  // ── Initialize from URL search params (or defaults) ────────────────────
  const initialSegment = isValidSegment(searchParams.get("segment"))
    ? (searchParams.get("segment") as Segment)
    : "k12";
  const initialTrips = Math.min(
    100,
    Math.max(1, Number(searchParams.get("trips")) || 12),
  );
  const initialGroupSize = Math.min(
    500,
    Math.max(5, Number(searchParams.get("groupSize")) || 30),
  );
  const initialMethod = isValidMethod(searchParams.get("method"))
    ? (searchParams.get("method") as SafetyMethod)
    : "none";

  const [segment, setSegment] = useState<Segment>(initialSegment);
  const [tripsPerYear, setTripsPerYear] = useState(initialTrips);
  const [avgGroupSize, setAvgGroupSize] = useState(initialGroupSize);
  const [currentMethod, setCurrentMethod] = useState<SafetyMethod>(initialMethod);

  // ── Analytics: track first interaction ──────────────────────────────────
  const hasTrackedStart = useRef(false);
  const trackStart = useCallback(() => {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true;
      trackEvent("roi_calculator_start", { segment });
    }
  }, [segment]);

  // ── Analytics: track result views ──────────────────────────────────────
  const hasTrackedComplete = useRef(false);

  // ── Calculate results ──────────────────────────────────────────────────
  const results = useMemo(
    () =>
      calculateROI({
        segment,
        tripsPerYear,
        avgGroupSize,
        currentMethod,
      }),
    [segment, tripsPerYear, avgGroupSize, currentMethod],
  );

  // Track "complete" once after first full calculation
  useEffect(() => {
    if (!hasTrackedComplete.current) {
      hasTrackedComplete.current = true;
      trackEvent("roi_calculator_complete", {
        segment,
        trips: String(tripsPerYear),
        groupSize: String(avgGroupSize),
        method: currentMethod,
      });
    }
  }, [segment, tripsPerYear, avgGroupSize, currentMethod]);

  // ── Sync state to URL search params ────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("segment", segment);
    params.set("trips", String(tripsPerYear));
    params.set("groupSize", String(avgGroupSize));
    params.set("method", currentMethod);
    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [segment, tripsPerYear, avgGroupSize, currentMethod, pathname, router]);

  // ── Share URL to clipboard ─────────────────────────────────────────────
  const [copied, setCopied] = useState(false);
  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing if clipboard API not available
    }
  }, []);

  // ── Event handlers ─────────────────────────────────────────────────────
  const handleSegmentChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      trackStart();
      setSegment(e.target.value as Segment);
    },
    [trackStart],
  );

  const handleTripsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      trackStart();
      setTripsPerYear(Number(e.target.value));
    },
    [trackStart],
  );

  const handleGroupSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      trackStart();
      setAvgGroupSize(Number(e.target.value));
    },
    [trackStart],
  );

  const handleMethodChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      trackStart();
      setCurrentMethod(e.target.value as SafetyMethod);
    },
    [trackStart],
  );

  // ── Derived display values ─────────────────────────────────────────────
  const savingsIsPositive = results.annualSavings > 0;

  return (
    <div className={cn("space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-10", className)}>
      {/* ================================================================
          LEFT COLUMN: INPUTS
          ================================================================ */}
      <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-[var(--shadow-lg)] sm:p-8">
        <h2 className="text-heading-lg text-foreground">
          Configure Your Organization
        </h2>
        <p className="mt-2 text-body-md text-muted-foreground">
          Adjust the inputs below to see your estimated SafeTrekr ROI.
        </p>

        {/* ── Segment Select ──────────────────────────────────────── */}
        <div className="mt-8">
          <label
            htmlFor={segmentId}
            className="block text-eyebrow text-muted-foreground"
          >
            Organization Type
          </label>
          <select
            id={segmentId}
            value={segment}
            onChange={handleSegmentChange}
            className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-body-md text-foreground transition-colors focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
          >
            {SEGMENTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* ── Trips Per Year Slider ───────────────────────────────── */}
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <label
              htmlFor={tripsId}
              className="text-eyebrow text-muted-foreground"
            >
              Trips Per Year
            </label>
            <span
              className="font-display text-heading-md tabular-nums text-foreground"
              aria-hidden="true"
            >
              {tripsPerYear}
            </span>
          </div>
          <input
            type="range"
            id={tripsId}
            min={1}
            max={100}
            step={1}
            value={tripsPerYear}
            onChange={handleTripsChange}
            aria-valuemin={1}
            aria-valuemax={100}
            aria-valuenow={tripsPerYear}
            aria-valuetext={`${tripsPerYear} trips per year`}
            className="slider-thumb w-full"
          />
          <div className="mt-1 flex justify-between">
            <span className="text-xs text-muted-foreground">1</span>
            <span className="text-xs text-muted-foreground">100</span>
          </div>
        </div>

        {/* ── Avg Group Size Slider ───────────────────────────────── */}
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <label
              htmlFor={groupSizeId}
              className="text-eyebrow text-muted-foreground"
            >
              Average Group Size
            </label>
            <span
              className="font-display text-heading-md tabular-nums text-foreground"
              aria-hidden="true"
            >
              {avgGroupSize}
            </span>
          </div>
          <input
            type="range"
            id={groupSizeId}
            min={5}
            max={500}
            step={5}
            value={avgGroupSize}
            onChange={handleGroupSizeChange}
            aria-valuemin={5}
            aria-valuemax={500}
            aria-valuenow={avgGroupSize}
            aria-valuetext={`${avgGroupSize} participants per trip`}
            className="slider-thumb w-full"
          />
          <div className="mt-1 flex justify-between">
            <span className="text-xs text-muted-foreground">5</span>
            <span className="text-xs text-muted-foreground">500</span>
          </div>
        </div>

        {/* ── Current Safety Method (Radio Group) ─────────────────── */}
        <fieldset className="mt-7">
          <legend className="text-eyebrow text-muted-foreground" id={methodId}>
            Current Safety Planning Method
          </legend>
          <div className="mt-3 space-y-3" role="radiogroup" aria-labelledby={methodId}>
            {SAFETY_METHODS.map((method) => (
              <label
                key={method.value}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                  currentMethod === method.value
                    ? "border-primary-600 bg-primary-50"
                    : "border-border bg-background hover:border-primary-200",
                )}
              >
                <input
                  type="radio"
                  name="safety-method"
                  value={method.value}
                  checked={currentMethod === method.value}
                  onChange={handleMethodChange}
                  className="mt-0.5 size-4 shrink-0 accent-[var(--color-primary-600)]"
                />
                <div>
                  <span className="text-body-md font-medium text-foreground">
                    {method.label}
                  </span>
                  <span className="mt-0.5 block text-body-sm text-muted-foreground">
                    {method.description}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* ================================================================
          RIGHT COLUMN: RESULTS
          ================================================================ */}
      <div
        className="space-y-6"
        id={resultsId}
        role="region"
        aria-label="ROI calculation results"
        aria-live="polite"
      >
        {/* ── Primary Metric: Cost Per Student ────────────────────── */}
        <div className="rounded-2xl border-2 border-primary-200 bg-white p-6 shadow-[var(--shadow-lg)] sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary-50">
              <DollarSign className="size-5 text-primary-700" aria-hidden="true" />
            </div>
            <span className="text-eyebrow text-muted-foreground">
              Cost Per Participant
            </span>
          </div>
          <output
            className="mt-4 block text-display-lg tabular-nums text-primary-700"
            aria-label={`Cost per participant with SafeTrekr: ${formatUSDCents(results.costPerStudent)}`}
          >
            {formatUSDCents(results.costPerStudent)}
          </output>
          <p className="mt-2 text-body-sm text-muted-foreground">
            per participant with SafeTrekr analyst review
          </p>

          {/* Pricing breakdown */}
          <div className="mt-4 space-y-2 border-t border-border pt-4">
            <div className="flex justify-between text-body-sm">
              <span className="text-muted-foreground">Base trip price</span>
              <span className="font-medium text-foreground">
                {formatUSD(results.baseTripPrice)}
              </span>
            </div>
            {results.volumeDiscountPct > 0 && (
              <div className="flex justify-between text-body-sm">
                <span className="text-muted-foreground">
                  Volume discount ({results.volumeDiscountPct}%)
                </span>
                <span className="font-medium text-primary-700">
                  -{formatUSD(results.baseTripPrice - results.discountedTripPrice)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-body-sm">
              <span className="text-muted-foreground">Discounted trip price</span>
              <span className="font-medium text-foreground">
                {formatUSD(results.discountedTripPrice)}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-body-md">
              <span className="font-medium text-foreground">Annual cost</span>
              <span className="font-semibold text-foreground">
                {formatUSD(results.annualSafetrekrCost)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Annual Savings ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-md)] sm:p-8">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex size-10 items-center justify-center rounded-lg",
              savingsIsPositive ? "bg-[#ecfdf5]" : "bg-[#fef3c7]",
            )}>
              <TrendingDown
                className={cn(
                  "size-5",
                  savingsIsPositive ? "text-[#059669]" : "text-[#b45309]",
                )}
                aria-hidden="true"
              />
            </div>
            <span className="text-eyebrow text-muted-foreground">
              Annual Savings vs. Status Quo
            </span>
          </div>
          <output
            className={cn(
              "mt-4 block text-display-md tabular-nums",
              savingsIsPositive ? "text-[#059669]" : "text-[#b45309]",
            )}
            aria-label={`Annual savings compared to current approach: ${savingsIsPositive ? formatUSD(results.annualSavings) : "no savings"}`}
          >
            {savingsIsPositive
              ? formatUSD(results.annualSavings)
              : formatUSD(Math.abs(results.annualSavings))}
          </output>
          <p className="mt-2 text-body-sm text-muted-foreground">
            {savingsIsPositive
              ? "estimated annual savings in staff time and planning costs"
              : "additional investment for professional safety coverage"}
          </p>

          {/* Comparison detail */}
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
            <div>
              <p className="text-body-sm text-muted-foreground">Current approach</p>
              <p className="mt-1 text-body-md font-semibold tabular-nums text-foreground">
                {formatUSD(results.annualStatusQuoCost)}/yr
              </p>
            </div>
            <div>
              <p className="text-body-sm text-muted-foreground">With SafeTrekr</p>
              <p className="mt-1 text-body-md font-semibold tabular-nums text-primary-700">
                {formatUSD(results.annualSafetrekrCost)}/yr
              </p>
            </div>
          </div>
        </div>

        {/* ── Risk Reduction ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-md)] sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary-50">
              <Shield className="size-5 text-primary-700" aria-hidden="true" />
            </div>
            <span className="text-eyebrow text-muted-foreground">
              Estimated Risk Reduction
            </span>
          </div>
          <output
            className="mt-4 block text-display-md tabular-nums text-foreground"
            aria-label={`Estimated risk reduction: ${results.riskReductionPct}%`}
          >
            {results.riskReductionPct}%
          </output>
          <p className="mt-2 text-body-sm text-muted-foreground">
            reduction in liability exposure through professional safety documentation
          </p>

          {/* Value context */}
          <div className="mt-4 rounded-lg bg-primary-50 p-4">
            <p className="text-body-sm font-medium text-primary-700">
              Professional documentation builds confidence
            </p>
            <p className="mt-1 text-body-sm text-primary-700/80">
              SafeTrekr&apos;s professional review and board-ready documentation
              demonstrate organizational accountability.
            </p>
          </div>
        </div>

        {/* ── Share + CTA ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-body-sm font-medium text-foreground transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
            aria-label={copied ? "Link copied to clipboard" : "Share these results"}
          >
            {copied ? (
              <>
                <Check className="size-4 text-primary-700" aria-hidden="true" />
                Link Copied
              </>
            ) : (
              <>
                <Share2 className="size-4" aria-hidden="true" />
                Share Results
              </>
            )}
          </button>

          <Button variant="primary" size="lg" asChild>
            <Link href="/demo" className="inline-flex items-center gap-2">
              Schedule a Walkthrough
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
ROICalculator.displayName = "ROICalculator";
