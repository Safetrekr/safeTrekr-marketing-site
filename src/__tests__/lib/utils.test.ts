/**
 * ST-844: REQ-104 -- Unit Tests for cn() utility
 *
 * Tests the Tailwind CSS class merging utility that combines clsx
 * (conditional class composition) with tailwind-merge (conflict resolution).
 */

import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn()", () => {
  it("returns an empty string when called with no arguments", () => {
    expect(cn()).toBe("");
  });

  it("passes through a single class string unchanged", () => {
    expect(cn("px-4")).toBe("px-4");
  });

  it("merges multiple class strings", () => {
    const result = cn("px-4", "py-2");
    expect(result).toContain("px-4");
    expect(result).toContain("py-2");
  });

  it("resolves Tailwind conflicts by keeping the last value", () => {
    // tailwind-merge should resolve px-4 vs px-8 in favor of px-8
    expect(cn("px-4", "px-8")).toBe("px-8");
  });

  it("handles conditional classes via boolean expressions", () => {
    const isActive = true;
    const result = cn("base", isActive && "bg-primary-500");
    expect(result).toContain("base");
    expect(result).toContain("bg-primary-500");
  });

  it("filters out false/null/undefined from conditional expressions", () => {
    const isActive = false;
    const result = cn("base", isActive && "bg-primary-500", null, undefined);
    expect(result).toBe("base");
    expect(result).not.toContain("bg-primary-500");
  });

  it("handles array inputs", () => {
    const result = cn(["px-4", "py-2"]);
    expect(result).toContain("px-4");
    expect(result).toContain("py-2");
  });

  it("handles object inputs (clsx style)", () => {
    const result = cn({ "px-4": true, "py-2": false, "mt-4": true });
    expect(result).toContain("px-4");
    expect(result).not.toContain("py-2");
    expect(result).toContain("mt-4");
  });

  it("resolves conflicting Tailwind variants correctly", () => {
    // bg-red-500 and bg-blue-500 conflict -- last wins
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("preserves non-conflicting classes from different utilities", () => {
    const result = cn("px-4 py-2", "text-lg font-bold");
    expect(result).toContain("px-4");
    expect(result).toContain("py-2");
    expect(result).toContain("text-lg");
    expect(result).toContain("font-bold");
  });

  it("handles empty strings gracefully", () => {
    expect(cn("", "px-4", "")).toBe("px-4");
  });
});
