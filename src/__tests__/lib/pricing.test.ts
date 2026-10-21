/**
 * Unit tests for trip pricing helpers.
 *
 * Each tier has a base price covering a set number of travelers, plus a
 * flat fee per additional traveler.
 */

import { describe, it, expect } from "vitest";
import {
  ADDITIONAL_TRAVELER_PRICE,
  DAY_TRIP,
  INTERNATIONAL_TRIP,
  MULTI_DAY_TRIP,
  calculateTripPrice,
  formatPrice,
} from "@/content/pricing";

describe("trip tiers", () => {
  it("have the current base prices and included travelers", () => {
    expect([DAY_TRIP.price, DAY_TRIP.includedTravelers]).toEqual([400, 10]);
    expect([MULTI_DAY_TRIP.price, MULTI_DAY_TRIP.includedTravelers]).toEqual([800, 20]);
    expect([INTERNATIONAL_TRIP.price, INTERNATIONAL_TRIP.includedTravelers]).toEqual([1200, 30]);
    expect(ADDITIONAL_TRAVELER_PRICE).toBe(40);
  });
});

describe("calculateTripPrice", () => {
  it("charges only the base price up to the included travelers", () => {
    expect(calculateTripPrice(DAY_TRIP, 1)).toBe(400);
    expect(calculateTripPrice(DAY_TRIP, 10)).toBe(400);
    expect(calculateTripPrice(MULTI_DAY_TRIP, 20)).toBe(800);
    expect(calculateTripPrice(INTERNATIONAL_TRIP, 30)).toBe(1200);
  });

  it("adds the per-traveler fee beyond the included travelers", () => {
    expect(calculateTripPrice(DAY_TRIP, 11)).toBe(440);
    expect(calculateTripPrice(DAY_TRIP, 30)).toBe(1200);
    expect(calculateTripPrice(MULTI_DAY_TRIP, 40)).toBe(1600);
    expect(calculateTripPrice(INTERNATIONAL_TRIP, 35)).toBe(1400);
  });
});

describe("formatPrice", () => {
  it("formats dollars with thousands separators", () => {
    expect(formatPrice(400)).toBe("$400");
    expect(formatPrice(1200)).toBe("$1,200");
  });
});
