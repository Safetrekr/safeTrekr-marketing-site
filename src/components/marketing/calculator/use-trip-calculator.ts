"use client";

import { useCallback, useState } from "react";

import {
  DAY_TRIP,
  INTERNATIONAL_TRIP,
  MULTI_DAY_TRIP,
  calculateTripPrice,
  type TripTier as PricingTier,
} from "@/content/pricing";

/* ================================================================
   useTripCalculator -- Shared state + math for trip calculators

   Pricing model (see @/content/pricing):
     - Each tier has a base price covering a set number of travelers,
       plus a flat fee per additional traveler.
     - Parents/guardians (1 per traveler) are free and not counted.

   The calculator lets organizations see their total SafeTrekr cost,
   then model a per-traveler fee to offset or create surplus.
   ================================================================ */

export type TripTier = "day" | "multiDay" | "international";

export const TIER_DATA: Record<TripTier, PricingTier> = {
  day: DAY_TRIP,
  multiDay: MULTI_DAY_TRIP,
  international: INTERNATIONAL_TRIP,
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
    /** Price of one trip at the selected traveler count. */
    tripPrice: number;
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
  const [feePerTraveler, setFeePerTravelerState] = useState(defaults.feePerTraveler ?? 50);

  const setTier = useCallback((v: TripTier) => setTierState(v), []);
  const setTripsPerYear = useCallback((v: number) => setTripsPerYearState(v), []);
  const setTravelersPerTrip = useCallback((v: number) => setTravelersPerTripState(v), []);
  const setFeePerTraveler = useCallback((v: number) => setFeePerTravelerState(v), []);

  const tripPrice = calculateTripPrice(TIER_DATA[tier], travelersPerTrip);
  const annualCost = tripPrice * tripsPerYear;
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
      tripPrice,
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
