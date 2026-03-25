/**
 * ST-860: REQ-111 -- Color Contrast Validation Tests
 *
 * Unit tests that validate all text/background color combinations from the
 * SafeTrekr design system meet WCAG AA contrast ratio requirements (4.5:1
 * for normal text, 3:1 for large text).
 *
 * Color values sourced from: designs/DESIGN-SYSTEM.md Section 3.8
 * "Contrast Validation Matrix (Binding Reference)"
 *
 * Uses a pure contrast ratio calculator per WCAG 2.2 specification:
 * https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio
 */

import { describe, it, expect } from "vitest";

// ---------------------------------------------------------------------------
// Contrast Ratio Calculator
// ---------------------------------------------------------------------------

/**
 * Parses a hex color string into [R, G, B] values (0-255).
 */
function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace("#", "");
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return [r, g, b];
}

/**
 * Converts a single sRGB channel value (0-255) to its linear value.
 * Per WCAG 2.2 relative luminance definition.
 */
function linearize(channel: number): number {
  const sRGB = channel / 255;
  return sRGB <= 0.04045
    ? sRGB / 12.92
    : Math.pow((sRGB + 0.055) / 1.055, 2.4);
}

/**
 * Calculates relative luminance of a hex color per WCAG 2.2.
 * Returns a value between 0 (black) and 1 (white).
 *
 * @see https://www.w3.org/TR/WCAG22/#dfn-relative-luminance
 */
function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * Calculates the WCAG 2.2 contrast ratio between two colors.
 * Returns a value >= 1 (same color) up to 21 (black on white).
 *
 * @see https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio
 */
function contrastRatio(foreground: string, background: string): number {
  const lum1 = relativeLuminance(foreground);
  const lum2 = relativeLuminance(background);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ---------------------------------------------------------------------------
// Design System Color Tokens (from DESIGN-SYSTEM.md)
// ---------------------------------------------------------------------------

const COLORS = {
  // Semantic
  background: "#e7ecee",
  foreground: "#061a23",
  card: "#f7f8f8",
  cardForeground: "#061a23",
  mutedForeground: "#4d5153",
  popover: "#f7f8f8",
  popoverForeground: "#061a23",

  // Brand Primary
  primary50: "#f1f9f4",
  primary500: "#4ca46e",
  primary600: "#3f885b",
  primary700: "#33704b",
  primaryForeground: "#ffffff",

  // Secondary
  secondary: "#123646",
  secondaryForeground: "#f7f8f8",
  secondaryMuted: "#b8c3c7",

  // Dark Surface
  darkTextPrimary: "#f7f8f8",
  darkTextSecondary: "#b8c3c7",
  darkAccent: "#6cbc8b",

  // Destructive
  destructive: "#c1253e",
  destructiveForeground: "#ffffff",

  // Pure
  white: "#ffffff",
} as const;

// ---------------------------------------------------------------------------
// WCAG AA Threshold Constants
// ---------------------------------------------------------------------------

/** Minimum contrast for normal text (< 18px or < 14px bold) */
const WCAG_AA_NORMAL = 4.5;

/** Minimum contrast for large text (>= 18px or >= 14px bold) */
const WCAG_AA_LARGE = 3.0;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ST-860: Design System Color Contrast Validation", () => {
  describe("Contrast ratio calculator correctness", () => {
    it("returns 21:1 for black on white", () => {
      const ratio = contrastRatio("#000000", "#ffffff");
      expect(ratio).toBeCloseTo(21, 0);
    });

    it("returns 1:1 for same color", () => {
      const ratio = contrastRatio("#4d5153", "#4d5153");
      expect(ratio).toBeCloseTo(1, 1);
    });
  });

  // -----------------------------------------------------------------------
  // Semantic Text/Background Combinations (Section 3.8)
  // -----------------------------------------------------------------------

  describe("Semantic colors - WCAG AA (4.5:1 minimum)", () => {
    it("foreground (#061a23) on background (#e7ecee): >= 4.5", () => {
      const ratio = contrastRatio(COLORS.foreground, COLORS.background);
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
      // Design system specifies 13.2:1
      expect(ratio).toBeGreaterThanOrEqual(13);
    });

    it("foreground (#061a23) on card (#f7f8f8): >= 4.5", () => {
      const ratio = contrastRatio(COLORS.foreground, COLORS.card);
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
      // Design system specifies 14.8:1
      expect(ratio).toBeGreaterThanOrEqual(14);
    });

    it("muted-foreground (#4d5153) on background (#e7ecee): >= 4.5", () => {
      const ratio = contrastRatio(COLORS.mutedForeground, COLORS.background);
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
      // Design system specifies 5.2:1
      expect(ratio).toBeGreaterThanOrEqual(5);
    });

    it("muted-foreground (#4d5153) on card (#f7f8f8): >= 4.5", () => {
      const ratio = contrastRatio(COLORS.mutedForeground, COLORS.card);
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
      // Design system specifies 5.8:1
      expect(ratio).toBeGreaterThanOrEqual(5.5);
    });

    it("popover-foreground (#061a23) on popover (#f7f8f8): >= 4.5", () => {
      const ratio = contrastRatio(COLORS.popoverForeground, COLORS.popover);
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });
  });

  // -----------------------------------------------------------------------
  // Brand Primary Text Combinations
  // -----------------------------------------------------------------------

  describe("Brand primary colors - WCAG AA", () => {
    it("primary-700 (#33704b) on background (#e7ecee): >= 4.5", () => {
      const ratio = contrastRatio(COLORS.primary700, COLORS.background);
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
      // Design system specifies 6.1:1
      expect(ratio).toBeGreaterThanOrEqual(6);
    });

    it("primary-700 (#33704b) on card (#f7f8f8): >= 4.5", () => {
      const ratio = contrastRatio(COLORS.primary700, COLORS.card);
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
      // Design system specifies 6.9:1
      expect(ratio).toBeGreaterThanOrEqual(6.5);
    });

    it("white (#ffffff) on primary-600 (#3f885b): >= 4.5", () => {
      const ratio = contrastRatio(COLORS.white, COLORS.primary600);
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
      // Design system specifies 4.6:1
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it("white (#ffffff) on primary-700 (#33704b): >= 4.5", () => {
      const ratio = contrastRatio(COLORS.white, COLORS.primary700);
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });

    it("white on primary-500 (#4ca46e) FAILS AA for normal text (expected)", () => {
      const ratio = contrastRatio(COLORS.white, COLORS.primary500);
      // Design system explicitly documents this as FAIL (3.4:1)
      expect(ratio).toBeLessThan(WCAG_AA_NORMAL);
      // But it passes AA for large text (3:1)
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_LARGE);
    });
  });

  // -----------------------------------------------------------------------
  // Dark Surface Combinations
  // -----------------------------------------------------------------------

  describe("Dark surface colors - WCAG AA", () => {
    it("dark-text-primary (#f7f8f8) on secondary (#123646): >= 4.5", () => {
      const ratio = contrastRatio(
        COLORS.darkTextPrimary,
        COLORS.secondary,
      );
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
      // Design system specifies 11.6:1
      expect(ratio).toBeGreaterThanOrEqual(11);
    });

    it("dark-text-secondary (#b8c3c7) on secondary (#123646): >= 4.5", () => {
      const ratio = contrastRatio(
        COLORS.darkTextSecondary,
        COLORS.secondary,
      );
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
      // Design system specifies 7.0:1
      expect(ratio).toBeGreaterThanOrEqual(7);
    });

    it("dark-accent (#6cbc8b) on secondary (#123646): >= 4.5", () => {
      const ratio = contrastRatio(COLORS.darkAccent, COLORS.secondary);
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
      // Design system specifies 4.8:1
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  // -----------------------------------------------------------------------
  // Destructive Colors
  // -----------------------------------------------------------------------

  describe("Destructive colors - WCAG AA", () => {
    it("white on destructive (#c1253e): >= 4.5", () => {
      const ratio = contrastRatio(
        COLORS.destructiveForeground,
        COLORS.destructive,
      );
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });
  });

  // -----------------------------------------------------------------------
  // Exhaustive Validation of Full Contrast Matrix
  // -----------------------------------------------------------------------

  describe("Full contrast matrix from DESIGN-SYSTEM.md Section 3.8", () => {
    const matrix: Array<{
      label: string;
      fg: string;
      bg: string;
      expectedMin: number;
    }> = [
      {
        label: "foreground on background",
        fg: COLORS.foreground,
        bg: COLORS.background,
        expectedMin: 13,
      },
      {
        label: "foreground on card",
        fg: COLORS.foreground,
        bg: COLORS.card,
        expectedMin: 14,
      },
      {
        label: "muted-foreground on background",
        fg: COLORS.mutedForeground,
        bg: COLORS.background,
        expectedMin: 5,
      },
      {
        label: "muted-foreground on card",
        fg: COLORS.mutedForeground,
        bg: COLORS.card,
        expectedMin: 5.5,
      },
      {
        label: "primary-700 on background",
        fg: COLORS.primary700,
        bg: COLORS.background,
        expectedMin: 6,
      },
      {
        label: "primary-700 on card",
        fg: COLORS.primary700,
        bg: COLORS.card,
        expectedMin: 6.5,
      },
      {
        label: "white on primary-600",
        fg: COLORS.white,
        bg: COLORS.primary600,
        expectedMin: 4.5,
      },
      {
        label: "white on primary-700",
        fg: COLORS.white,
        bg: COLORS.primary700,
        expectedMin: 6,
      },
      {
        label: "dark-text-primary on secondary",
        fg: COLORS.darkTextPrimary,
        bg: COLORS.secondary,
        expectedMin: 11,
      },
      {
        label: "dark-text-secondary on secondary",
        fg: COLORS.darkTextSecondary,
        bg: COLORS.secondary,
        expectedMin: 7,
      },
      {
        label: "dark-accent on secondary",
        fg: COLORS.darkAccent,
        bg: COLORS.secondary,
        expectedMin: 4.5,
      },
    ];

    for (const { label, fg, bg, expectedMin } of matrix) {
      it(`${label}: ratio >= ${String(expectedMin)}:1`, () => {
        const ratio = contrastRatio(fg, bg);
        expect(ratio).toBeGreaterThanOrEqual(expectedMin);
      });
    }
  });
});
