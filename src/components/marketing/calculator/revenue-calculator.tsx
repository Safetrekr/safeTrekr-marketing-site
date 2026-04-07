"use client";

/* ================================================================
   RevenueCalculator -- Higher Ed Surplus-First Calculator
   Three sliders (students, trips, fee) with one hero "Estimated
   Annual Surplus" output and two supporting rows. No comparison
   strip. Used on /solutions/higher-education.
   ================================================================ */

import { useId } from "react";

import { cn } from "@/lib/utils";
import { useTripCalculator, formatUSD } from "./use-trip-calculator";

export interface RevenueCalculatorProps {
  className?: string;
  /** Initial value for the per-student fee slider. @default 50 */
  defaultPricePerStudent?: number;
}

export function RevenueCalculator({
  className,
  defaultPricePerStudent = 50,
}: RevenueCalculatorProps) {
  const {
    students,
    trips,
    pricePerStudent,
    setStudents,
    setTrips,
    setPricePerStudent,
    totals: { annualCost, annualRevenue, annualSurplus },
  } = useTripCalculator({ pricePerStudent: defaultPricePerStudent });

  const instanceId = useId();
  const studentsId = `${instanceId}-students`;
  const tripsId = `${instanceId}-trips`;
  const priceId = `${instanceId}-fee`;

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-border bg-card p-8 shadow-[var(--shadow-lg)] lg:p-10",
        className,
      )}
    >
      <h3 className="text-heading-md text-card-foreground">
        Turn Safety Planning Into a Revenue Line
      </h3>
      <p className="mt-2 max-w-prose text-body-sm text-muted-foreground">
        Most schools pass a small travel safety fee through to students,
        well below the cost of a single textbook. Drag the sliders to see
        how that fee covers SafeTrekr and still leaves a surplus your
        program can put to work.
      </p>

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

      {/* Safety fee slider */}
      <div className="mt-7 rounded-lg border border-primary-200 bg-primary-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <label
            htmlFor={priceId}
            className="text-eyebrow text-muted-foreground"
          >
            Safety Fee Per Student
          </label>
          <span
            className="font-display text-heading-md tabular-nums text-card-foreground"
            aria-hidden="true"
          >
            {formatUSD(pricePerStudent)}
          </span>
        </div>
        <input
          type="range"
          id={priceId}
          min={15}
          max={150}
          step={5}
          value={pricePerStudent}
          onChange={(e) => setPricePerStudent(Number(e.target.value))}
          aria-valuemin={15}
          aria-valuemax={150}
          aria-valuenow={pricePerStudent}
          aria-valuetext={`${formatUSD(pricePerStudent)} per student`}
          className="slider-thumb w-full"
        />
        <div className="mt-1 flex justify-between">
          <span className="text-xs text-muted-foreground">$15</span>
          <span className="text-xs text-muted-foreground">$150</span>
        </div>
      </div>

      <div className="my-7 h-px bg-border" />

      {/* Hero: Estimated Annual Surplus */}
      <div
        className={cn(
          "rounded-xl p-8 text-center",
          annualSurplus >= 0
            ? "bg-primary-50 ring-1 ring-primary-200"
            : "bg-destructive/5 ring-1 ring-destructive/20",
        )}
      >
        <span className="block text-eyebrow text-muted-foreground">
          Estimated Annual Surplus
        </span>
        <output
          className={cn(
            "mt-2 block font-display text-display-lg font-bold tabular-nums",
            annualSurplus >= 0 ? "text-primary-700" : "text-destructive",
          )}
          aria-live="polite"
          aria-label={`Estimated annual surplus: ${formatUSD(annualSurplus)}`}
        >
          {annualSurplus >= 0 ? "+" : ""}
          {formatUSD(annualSurplus)}
        </output>
        <p className="mt-2 text-xs text-muted-foreground">
          After SafeTrekr at $15 per student, per trip
        </p>
      </div>

      {/* Supporting rows */}
      <dl className="mt-6 space-y-3">
        <div className="flex items-baseline justify-between">
          <dt className="text-body-sm text-muted-foreground">Fees collected</dt>
          <dd
            className="font-display text-heading-sm tabular-nums text-card-foreground"
            aria-live="polite"
          >
            {formatUSD(annualRevenue)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between">
          <dt className="text-body-sm text-muted-foreground">SafeTrekr cost</dt>
          <dd
            className="font-display text-heading-sm tabular-nums text-card-foreground"
            aria-live="polite"
          >
            {formatUSD(annualCost)}
          </dd>
        </div>
      </dl>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Surplus can fund insurance, training, or emergency reserves.
      </p>
    </div>
  );
}
RevenueCalculator.displayName = "RevenueCalculator";
