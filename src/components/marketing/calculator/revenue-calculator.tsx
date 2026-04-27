"use client";

/* ================================================================
   RevenueCalculator -- Trip Investment & Surplus Calculator

   Lets organizations select a trip tier, configure volume, and model
   a per-traveler safety fee to see how easily SafeTrekr pays for
   itself (and generates surplus).

   Flow:
     1. Select trip tier ($450 / $750 / $1,250)
     2. Set trips per year
     3. Set travelers per trip (shows total travelers)
     4. Set per-traveler safety fee (the markup)
     5. See: annual cost, fee revenue, surplus
   ================================================================ */

import { useId } from "react";

import { cn } from "@/lib/utils";
import {
  useTripCalculator,
  formatUSD,
  TIER_PRICES,
  TIER_LABELS,
  type TripTier,
} from "./use-trip-calculator";

export interface RevenueCalculatorProps {
  className?: string;
}

const TIERS: TripTier[] = ["day", "extended", "international"];

export function RevenueCalculator({ className }: RevenueCalculatorProps) {
  const {
    tier,
    tripsPerYear,
    travelersPerTrip,
    feePerTraveler,
    setTier,
    setTripsPerYear,
    setTravelersPerTrip,
    setFeePerTraveler,
    totals: {
      tierPrice,
      annualCost,
      totalTravelers,
      annualRevenue,
      annualSurplus,
      costPerTraveler,
    },
  } = useTripCalculator();

  const instanceId = useId();
  const tripsId = `${instanceId}-trips`;
  const travelersId = `${instanceId}-travelers`;
  const feeId = `${instanceId}-fee`;

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-border bg-card p-8 shadow-[var(--shadow-lg)] lg:p-10",
        className,
      )}
    >
      <h3 className="text-heading-md text-card-foreground">
        Trip Investment Calculator
      </h3>
      <p className="mt-2 max-w-prose text-body-sm text-muted-foreground">
        Select your trip type, set your volume, and see how a small
        per-traveler safety fee covers SafeTrekr and generates surplus
        for your program.
      </p>

      {/* Trip tier selector */}
      <fieldset className="mt-8" aria-label="Trip type">
        <legend className="text-eyebrow text-muted-foreground mb-3">
          Trip Type
        </legend>
        <div className="grid grid-cols-3 gap-3">
          {TIERS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTier(t)}
              className={cn(
                "rounded-lg border-2 px-3 py-3 text-center transition-all duration-150",
                tier === t
                  ? "border-primary-500 bg-primary-50 ring-1 ring-primary-200"
                  : "border-border bg-background hover:border-primary-300",
              )}
              aria-pressed={tier === t}
            >
              <span className="block text-body-sm font-semibold text-card-foreground">
                {TIER_LABELS[t]}
              </span>
              <span
                className={cn(
                  "mt-1 block font-display text-heading-sm tabular-nums",
                  tier === t ? "text-primary-700" : "text-muted-foreground",
                )}
              >
                {formatUSD(TIER_PRICES[t])}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Trips per year slider */}
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
          onChange={(e) => setTripsPerYear(Number(e.target.value))}
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

      {/* Travelers per trip slider */}
      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <label
            htmlFor={travelersId}
            className="text-eyebrow text-muted-foreground"
          >
            Travelers Per Trip
          </label>
          <span
            className="font-display text-heading-md tabular-nums text-card-foreground"
            aria-hidden="true"
          >
            {travelersPerTrip}
          </span>
        </div>
        <input
          type="range"
          id={travelersId}
          min={5}
          max={200}
          step={5}
          value={travelersPerTrip}
          onChange={(e) => setTravelersPerTrip(Number(e.target.value))}
          aria-valuemin={5}
          aria-valuemax={200}
          aria-valuenow={travelersPerTrip}
          aria-valuetext={`${travelersPerTrip} travelers per trip`}
          className="slider-thumb w-full"
        />
        <div className="mt-1 flex justify-between">
          <span className="text-xs text-muted-foreground">5</span>
          <span className="text-xs text-muted-foreground">200</span>
        </div>
      </div>

      {/* Summary: total travelers + annual cost */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-background p-4 text-center">
          <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total Travelers/Year
          </span>
          <output className="mt-1 block font-display text-heading-md tabular-nums text-card-foreground">
            {totalTravelers.toLocaleString()}
          </output>
        </div>
        <div className="rounded-lg border border-border bg-background p-4 text-center">
          <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Annual SafeTrekr Cost
          </span>
          <output className="mt-1 block font-display text-heading-md tabular-nums text-card-foreground">
            {formatUSD(annualCost)}
          </output>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {formatUSD(tierPrice)} x {tripsPerYear} trips
          </span>
        </div>
      </div>

      <div className="my-7 h-px bg-border" />

      {/* Per-traveler fee slider */}
      <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <label
            htmlFor={feeId}
            className="text-eyebrow text-muted-foreground"
          >
            Safety Fee Per Traveler
          </label>
          <span
            className="font-display text-heading-md tabular-nums text-card-foreground"
            aria-hidden="true"
          >
            {formatUSD(feePerTraveler)}
          </span>
        </div>
        <input
          type="range"
          id={feeId}
          min={5}
          max={100}
          step={5}
          value={feePerTraveler}
          onChange={(e) => setFeePerTraveler(Number(e.target.value))}
          aria-valuemin={5}
          aria-valuemax={100}
          aria-valuenow={feePerTraveler}
          aria-valuetext={`${formatUSD(feePerTraveler)} per traveler`}
          className="slider-thumb w-full"
        />
        <div className="mt-1 flex justify-between">
          <span className="text-xs text-muted-foreground">$5</span>
          <span className="text-xs text-muted-foreground">$100</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Break-even is {formatUSD(Math.ceil(costPerTraveler))} per traveler
        </p>
      </div>

      {/* Hero: Estimated Annual Surplus */}
      <div
        className={cn(
          "mt-7 rounded-xl p-8 text-center",
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
          <dt className="text-body-sm text-muted-foreground">
            SafeTrekr cost
          </dt>
          <dd
            className="font-display text-heading-sm tabular-nums text-card-foreground"
            aria-live="polite"
          >
            {formatUSD(annualCost)}
          </dd>
        </div>
      </dl>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Surplus can fund insurance, training, equipment, or emergency reserves.
      </p>
    </div>
  );
}
RevenueCalculator.displayName = "RevenueCalculator";
