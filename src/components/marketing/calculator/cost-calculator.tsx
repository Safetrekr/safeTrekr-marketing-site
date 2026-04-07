"use client";

/* ================================================================
   CostCalculator -- K-12 Per-Student Pricing Calculator
   Two sliders (students, trips) + 3-output cost grid + comparison strip.
   Identical visual + behavioral output to the original
   PerStudentCalculator. Used on /solutions/k12.
   ================================================================ */

import { useId } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTripCalculator, formatUSD } from "./use-trip-calculator";

export interface CostCalculatorProps {
  className?: string;
}

export function CostCalculator({ className }: CostCalculatorProps) {
  const {
    students,
    trips,
    setStudents,
    setTrips,
    totals: { annualCost, perTripCost, staffCostLow, staffCostHigh },
  } = useTripCalculator();

  const instanceId = useId();
  const studentsId = `${instanceId}-students`;
  const tripsId = `${instanceId}-trips`;

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

      {/* Students slider */}
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
          onChange={(e) => setStudents(Number(e.target.value))}
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

      {/* Trips slider */}
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
          onChange={(e) => setTrips(Number(e.target.value))}
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

      <div className="my-7 h-px bg-border" />

      {/* Results grid */}
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

      {/* Comparison strip */}
      <div
        className="mt-8 rounded-lg bg-primary-50 p-5"
        role="group"
        aria-label="Cost comparison: SafeTrekr versus status quo"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
CostCalculator.displayName = "CostCalculator";
