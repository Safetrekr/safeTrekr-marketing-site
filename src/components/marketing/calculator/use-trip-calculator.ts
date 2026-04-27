"use client";

import { useCallback, useState } from "react";

/* ================================================================
   useTripCalculator -- Shared state + math for trip calculators

   Pricing model:
     - Day Trip:      $450 per trip
     - Extended Trip: $750 per trip
     - International: $1,250 per trip

   The calculator lets organizations see their total SafeTrekr cost,
   then model a per-traveler fee to offset or create surplus.
   ================================================================ */

export type TripTier = "day" | "extended" | "international";

export const TIER_PRICES: Record<TripTier, number> = {
  day: 450,
  extended: 750,
  international: 1250,
};

export const TIER_LABELS: Record<TripTier, string> = {
  day: "Day Trip",
  extended: "Extended Trip",
  international: "International",
};

export interface TripCalculatorDefaults {
  tier?: TripTier;
  tripsPerYear?: number;
  travelersPerTrip?: number;
  feePerTraveler?: number;
}

export interface TripCalculatorState {
  tier: TripTier;
  tripsPerYear: number;
  travelersPerTrip: number;
  feePerTraveler: number;
  setTier: (value: TripTier) => void;
  setTripsPerYear: (value: number) => void;
  setTravelersPerTrip: (value: number) => void;
  setFeePerTraveler: (value: number) => void;
  totals: {
    tierPrice: number;
    annualCost: number;
    totalTravelers: number;
    annualRevenue: number;
    annualSurplus: number;
    costPerTraveler: number;
  };
}

export function useTripCalculator(
  defaults: TripCalculatorDefaults = {},
): TripCalculatorState {
  const [tier, setTierState] = useState<TripTier>(defaults.tier ?? "day");
  const [tripsPerYear, setTripsPerYearState] = useState(defaults.tripsPerYear ?? 10);
  const [travelersPerTrip, setTravelersPerTripState] = useState(defaults.travelersPerTrip ?? 30);
  const [feePerTraveler, setFeePerTravelerState] = useState(defaults.feePerTraveler ?? 25);

  const setTier = useCallback((v: TripTier) => setTierState(v), []);
  const setTripsPerYear = useCallback((v: number) => setTripsPerYearState(v), []);
  const setTravelersPerTrip = useCallback((v: number) => setTravelersPerTripState(v), []);
  const setFeePerTraveler = useCallback((v: number) => setFeePerTravelerState(v), []);

  const tierPrice = TIER_PRICES[tier];
  const annualCost = tierPrice * tripsPerYear;
  const totalTravelers = travelersPerTrip * tripsPerYear;
  const annualRevenue = totalTravelers * feePerTraveler;
  const annualSurplus = annualRevenue - annualCost;
  const costPerTraveler = totalTravelers > 0 ? annualCost / totalTravelers : 0;

  return {
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
  };
}

export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
