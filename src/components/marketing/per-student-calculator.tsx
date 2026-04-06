"use client";

/**
 * ST-871: REQ-064 -- Per-Student Pricing Calculator
 *
 * Interactive pricing calculator for the K-12 solutions page. Uses dual
 * range sliders (students per trip, trips per year) to compute annual
 * SafeTrekr cost at $15/student/trip, with a comparison strip showing
 * the cost of staff time and lawsuit exposure without SafeTrekr.
 *
 * Client component because slider state drives live output recalculation.
 *
 * @see designs/html/mockup-k12-solutions.html -- Section 6
 */

import { useState, useCallback, useId } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PRICE_PER_STUDENT = 15;
const STAFF_COST_LOW_PER_TRIP = 700;
const STAFF_COST_HIGH_PER_TRIP = 1_400;

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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface PerStudentCalculatorProps {
  /** Additional CSS classes applied to the outer card wrapper. */
  className?: string;
}

/**
 * Interactive per-student pricing calculator with dual sliders and
 * live cost comparison. Designed for the K-12 solutions page.
 *
 * Slider ranges:
 * - Students per trip: 10 -- 200, step 5
 * - Trips per year: 1 -- 100, step 1
 *
 * Outputs:
 * - Annual cost (students x $15 x trips)
 * - Per-student cost (fixed $15)
 * - Per-trip cost (students x $15)
 * - Comparison strip: SafeTrekr vs staff time vs lawsuit exposure
 */
export function PerStudentCalculator({
  className,
}: PerStudentCalculatorProps) {
  const [students, setStudents] = useState(30);
  const [trips, setTrips] = useState(20);

  const instanceId = useId();
  const studentsId = `${instanceId}-students`;
  const tripsId = `${instanceId}-trips`;

  const annualCost = students * PRICE_PER_STUDENT * trips;
  const perTripCost = students * PRICE_PER_STUDENT;
  const staffCostLow = trips * STAFF_COST_LOW_PER_TRIP;
  const staffCostHigh = trips * STAFF_COST_HIGH_PER_TRIP;

  const handleStudentsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setStudents(Number(e.target.value));
    },
    [],
  );

  const handleTripsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTrips(Number(e.target.value));
    },
    [],
  );

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-border bg-card p-8 shadow-[var(--shadow-lg)] lg:p-10",
        className,
      )}
    >
      <h3 className="text-heading-sm text-card-foreground">
        Calculate Your District&rsquo;s Cost
      </h3>

      {/* ── Slider: Students Per Trip ─────────────────────────── */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <label
            htmlFor={studentsId}
            className="text-eyebrow text-muted-foreground"
          >
            Students Per Trip
          </label>
          <span
            className="font-display text-heading-md tabular-nums text-card-foreground"
            aria-hidden="true"
          >
            {students}
          </span>
        </div>
        <input
          type="range"
          id={studentsId}
          min={10}
          max={200}
          step={5}
          value={students}
          onChange={handleStudentsChange}
          aria-valuemin={10}
          aria-valuemax={200}
          aria-valuenow={students}
          aria-valuetext={`${students} students per trip`}
          className="slider-thumb w-full"
        />
        <div className="mt-1 flex justify-between">
          <span className="text-xs text-muted-foreground">10</span>
          <span className="text-xs text-muted-foreground">200</span>
        </div>
      </div>

      {/* ── Slider: Trips Per Year ────────────────────────────── */}
      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <label
            htmlFor={tripsId}
            className="text-eyebrow text-muted-foreground"
          >
            Trips Per Year
          </label>
          <span
            className="font-display text-heading-md tabular-nums text-card-foreground"
            aria-hidden="true"
          >
            {trips}
          </span>
        </div>
        <input
          type="range"
          id={tripsId}
          min={1}
          max={100}
          step={1}
          value={trips}
          onChange={handleTripsChange}
          aria-valuemin={1}
          aria-valuemax={100}
          aria-valuenow={trips}
          aria-valuetext={`${trips} trips per year`}
          className="slider-thumb w-full"
        />
        <div className="mt-1 flex justify-between">
          <span className="text-xs text-muted-foreground">1</span>
          <span className="text-xs text-muted-foreground">100</span>
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────────── */}
      <div className="my-7 h-px bg-border" />

      {/* ── Results Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-6 text-center">
        <div>
          <output
            className="block text-display-md tabular-nums text-card-foreground"
            aria-live="polite"
            aria-label={`Annual SafeTrekr cost: ${formatUSD(annualCost)}`}
          >
            {formatUSD(annualCost)}
          </output>
          <span className="mt-1 block text-eyebrow text-muted-foreground">
            Annual Cost
          </span>
        </div>
        <div>
          <output
            className="block text-body-lg font-semibold tabular-nums text-primary-700"
            aria-label="Per student cost: $15"
          >
            $15
          </output>
          <span className="mt-1 block text-eyebrow text-muted-foreground">
            Per Student
          </span>
        </div>
        <div>
          <output
            className="block text-body-lg font-semibold tabular-nums text-card-foreground"
            aria-live="polite"
            aria-label={`Cost per trip: ${formatUSD(perTripCost)}`}
          >
            {formatUSD(perTripCost)}
          </output>
          <span className="mt-1 block text-eyebrow text-muted-foreground">
            Per Trip
          </span>
        </div>
      </div>

      {/* ── Comparison Strip ──────────────────────────────────── */}
      <div
        className="mt-8 rounded-lg bg-primary-50 p-5"
        role="group"
        aria-label="Cost comparison: SafeTrekr versus status quo"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* SafeTrekr */}
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-card-foreground">
              SafeTrekr
            </p>
            <p
              className="mt-1 font-display text-xl font-bold tabular-nums text-primary-700"
              aria-live="polite"
            >
              {formatUSD(annualCost)}/year
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Professional analyst review
            </p>
          </div>

          {/* Staff Time */}
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-card-foreground">
              Staff Time Without SafeTrekr
            </p>
            <p className="mt-1 font-display text-xl font-bold tabular-nums text-muted-foreground">
              {formatUSD(staffCostLow)} - {formatUSD(staffCostHigh)}/year
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {trips} trips &times; $700-$1,400 per trip
            </p>
          </div>

          {/* Lawsuit Exposure */}
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-card-foreground">
              Lawsuit Exposure
            </p>
            <p className="mt-1 font-display text-xl font-bold tabular-nums text-destructive">
              $500K - $2M
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Average settlement for trip-related incidents
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer Link ───────────────────────────────────────── */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        See full pricing details for all trip types.
        <Link
          href="/pricing"
          className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-600"
        >
          View Full Pricing
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </p>
    </div>
  );
}
PerStudentCalculator.displayName = "PerStudentCalculator";
