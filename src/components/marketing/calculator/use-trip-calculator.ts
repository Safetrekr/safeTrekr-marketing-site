"use client";

import { useCallback, useState } from "react";

/* ================================================================
   useTripCalculator -- Shared state + math for trip calculators
   Powers both CostCalculator (K-12) and RevenueCalculator (Higher Ed).
   ================================================================ */

export const PRICE_PER_STUDENT = 15;

export interface TripCalculatorDefaults {
  students?: number;
  trips?: number;
  pricePerStudent?: number;
}

export interface TripCalculatorState {
  students: number;
  trips: number;
  pricePerStudent: number;
  setStudents: (value: number) => void;
  setTrips: (value: number) => void;
  setPricePerStudent: (value: number) => void;
  totals: {
    annualCost: number;
    perTripCost: number;
    annualRevenue: number;
    annualSurplus: number;
  };
}

/**
 * Internal hook holding slider state and derived totals for the trip
 * calculator family. Marketing-page only, no context, no store.
 */
export function useTripCalculator(
  defaults: TripCalculatorDefaults = {},
): TripCalculatorState {
  const [students, setStudentsState] = useState(defaults.students ?? 30);
  const [trips, setTripsState] = useState(defaults.trips ?? 20);
  const [pricePerStudent, setPricePerStudentState] = useState(
    defaults.pricePerStudent ?? 50,
  );

  const setStudents = useCallback((v: number) => setStudentsState(v), []);
  const setTrips = useCallback((v: number) => setTripsState(v), []);
  const setPricePerStudent = useCallback(
    (v: number) => setPricePerStudentState(v),
    [],
  );

  const annualCost = students * PRICE_PER_STUDENT * trips;
  const perTripCost = students * PRICE_PER_STUDENT;
  const annualRevenue = students * pricePerStudent * trips;
  const annualSurplus = annualRevenue - annualCost;

  return {
    students,
    trips,
    pricePerStudent,
    setStudents,
    setTrips,
    setPricePerStudent,
    totals: {
      annualCost,
      perTripCost,
      annualRevenue,
      annualSurplus,
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
