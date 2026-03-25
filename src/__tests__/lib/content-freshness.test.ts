/**
 * ST-844: REQ-104 -- Unit Tests for content freshness utilities
 *
 * Tests getLastUpdated returns correct dates for registered paths,
 * formatLastUpdated returns human-readable format, and getAllPageDates
 * returns the complete registry.
 */

import { describe, it, expect } from "vitest";
import {
  getLastUpdated,
  formatLastUpdated,
  getAllPageDates,
} from "@/lib/content-freshness";

// ---------------------------------------------------------------------------
// getLastUpdated
// ---------------------------------------------------------------------------

describe("getLastUpdated()", () => {
  it("returns a FreshnessDate for a registered path", () => {
    const result = getLastUpdated("/legal/privacy");
    expect(result).not.toBeNull();
    expect(result?.iso).toBe("2026-03-15");
  });

  it("returns the correct ISO date for /pricing", () => {
    const result = getLastUpdated("/pricing");
    expect(result?.iso).toBe("2026-03-18");
  });

  it("returns the correct ISO date for /about", () => {
    const result = getLastUpdated("/about");
    expect(result?.iso).toBe("2026-03-24");
  });

  it("returns the correct ISO date for /how-it-works", () => {
    const result = getLastUpdated("/how-it-works");
    expect(result?.iso).toBe("2026-03-20");
  });

  it("returns null for an unregistered path", () => {
    const result = getLastUpdated("/nonexistent");
    expect(result).toBeNull();
  });

  it("returns null for an empty string path", () => {
    const result = getLastUpdated("");
    expect(result).toBeNull();
  });

  it("includes a display string with 'Last updated:' prefix", () => {
    const result = getLastUpdated("/legal/privacy");
    expect(result?.display).toMatch(/^Last updated:/);
  });

  it("formats display string with long month, day, and year", () => {
    const result = getLastUpdated("/legal/privacy");
    // "2026-03-15" should become "Last updated: March 15, 2026"
    expect(result?.display).toBe("Last updated: March 15, 2026");
  });

  it("formats /pricing date correctly", () => {
    const result = getLastUpdated("/pricing");
    expect(result?.display).toBe("Last updated: March 18, 2026");
  });

  it("handles all solutions paths", () => {
    const solutionPaths = [
      "/solutions/k12",
      "/solutions/higher-education",
      "/solutions/churches",
      "/solutions/corporate",
    ];
    for (const path of solutionPaths) {
      const result = getLastUpdated(path);
      expect(result).not.toBeNull();
      expect(result?.iso).toBeTruthy();
      expect(result?.display).toMatch(/^Last updated:/);
    }
  });
});

// ---------------------------------------------------------------------------
// formatLastUpdated
// ---------------------------------------------------------------------------

describe("formatLastUpdated()", () => {
  it("returns only the display string for a registered path", () => {
    const result = formatLastUpdated("/legal/privacy");
    expect(result).toBe("Last updated: March 15, 2026");
  });

  it("returns null for an unregistered path", () => {
    const result = formatLastUpdated("/nonexistent");
    expect(result).toBeNull();
  });

  it("matches the display property from getLastUpdated", () => {
    const fullResult = getLastUpdated("/about");
    const formatted = formatLastUpdated("/about");
    expect(formatted).toBe(fullResult?.display);
  });
});

// ---------------------------------------------------------------------------
// getAllPageDates
// ---------------------------------------------------------------------------

describe("getAllPageDates()", () => {
  it("returns an object with all registered paths", () => {
    const all = getAllPageDates();
    expect(Object.keys(all).length).toBeGreaterThanOrEqual(10);
  });

  it("includes /legal/privacy with correct dates", () => {
    const all = getAllPageDates();
    expect(all["/legal/privacy"]).toBeDefined();
    expect(all["/legal/privacy"]?.iso).toBe("2026-03-15");
    expect(all["/legal/privacy"]?.display).toMatch(/^Last updated:/);
  });

  it("includes all solution paths", () => {
    const all = getAllPageDates();
    expect(all["/solutions/k12"]).toBeDefined();
    expect(all["/solutions/higher-education"]).toBeDefined();
    expect(all["/solutions/churches"]).toBeDefined();
    expect(all["/solutions/corporate"]).toBeDefined();
  });

  it("includes legal pages", () => {
    const all = getAllPageDates();
    expect(all["/legal/privacy"]).toBeDefined();
    expect(all["/legal/terms"]).toBeDefined();
    expect(all["/legal/dpa"]).toBeDefined();
  });

  it("every entry has both iso and display fields", () => {
    const all = getAllPageDates();
    for (const [, value] of Object.entries(all)) {
      expect(value.iso).toBeTruthy();
      expect(value.display).toBeTruthy();
    }
  });
});
