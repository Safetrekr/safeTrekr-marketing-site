/**
 * ST-849: REQ-106 -- Component Tests for Eyebrow
 *
 * Tests color variants, icon rendering, and base class application
 * for the small uppercase label component.
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Eyebrow } from "@/components/marketing/eyebrow";

describe("Eyebrow", () => {
  // ── Color variants ────────────────────────────────────────────────

  describe("color variants", () => {
    it("renders primary color variant (default)", () => {
      render(<Eyebrow>Safety</Eyebrow>);
      const el = screen.getByText("Safety");
      expect(el.className).toContain("text-primary-600");
    });

    it("renders primary color variant explicitly", () => {
      render(<Eyebrow color="primary">Features</Eyebrow>);
      const el = screen.getByText("Features");
      expect(el.className).toContain("text-primary-600");
    });

    it("renders muted color variant", () => {
      render(<Eyebrow color="muted">Subtitle</Eyebrow>);
      const el = screen.getByText("Subtitle");
      expect(el.className).toContain("text-muted-foreground");
    });

    it("renders dark color variant", () => {
      render(<Eyebrow color="dark">Dark Section</Eyebrow>);
      const el = screen.getByText("Dark Section");
      expect(el.className).toContain("text-primary-400");
    });
  });

  // ── Icon rendering ────────────────────────────────────────────────

  describe("icon rendering", () => {
    it("renders without an icon by default", () => {
      render(<Eyebrow>No Icon</Eyebrow>);
      const el = screen.getByText("No Icon");
      // No icon wrapper should be present
      const iconWrapper = el.querySelector("[aria-hidden]");
      expect(iconWrapper).toBeNull();
    });

    it("renders an icon when provided", () => {
      render(
        <Eyebrow icon={<svg data-testid="test-icon" />}>With Icon</Eyebrow>,
      );
      expect(screen.getByTestId("test-icon")).toBeDefined();
    });

    it("wraps the icon in an aria-hidden span", () => {
      render(
        <Eyebrow icon={<svg data-testid="icon-svg" />}>Label</Eyebrow>,
      );
      const el = screen.getByText("Label");
      const iconWrapper = el.querySelector("[aria-hidden='true']");
      expect(iconWrapper).not.toBeNull();
    });

    it("applies size class to icon wrapper", () => {
      render(
        <Eyebrow icon={<svg data-testid="sized-icon" />}>Sized</Eyebrow>,
      );
      const el = screen.getByText("Sized");
      const iconWrapper = el.querySelector("[aria-hidden='true']");
      expect(iconWrapper?.className).toContain("inline-flex");
      expect(iconWrapper?.className).toContain("shrink-0");
    });
  });

  // ── Base classes ──────────────────────────────────────────────────

  describe("base classes", () => {
    it("always includes text-eyebrow utility class", () => {
      render(<Eyebrow>Base</Eyebrow>);
      const el = screen.getByText("Base");
      expect(el.className).toContain("text-eyebrow");
    });

    it("always includes inline-flex and items-center", () => {
      render(<Eyebrow>Flex</Eyebrow>);
      const el = screen.getByText("Flex");
      expect(el.className).toContain("inline-flex");
      expect(el.className).toContain("items-center");
    });

    it("includes gap for icon spacing", () => {
      render(<Eyebrow>Gap</Eyebrow>);
      const el = screen.getByText("Gap");
      expect(el.className).toContain("gap-1.5");
    });
  });

  // ── DOM element ───────────────────────────────────────────────────

  describe("DOM element", () => {
    it("renders as a span element", () => {
      render(<Eyebrow>Span</Eyebrow>);
      const el = screen.getByText("Span");
      expect(el.tagName).toBe("SPAN");
    });
  });

  // ── Custom className ──────────────────────────────────────────────

  describe("custom className", () => {
    it("merges additional className prop", () => {
      render(<Eyebrow className="mt-4">Custom</Eyebrow>);
      const el = screen.getByText("Custom");
      expect(el.className).toContain("mt-4");
    });
  });

  // ── Children rendering ────────────────────────────────────────────

  describe("children", () => {
    it("renders text children", () => {
      render(<Eyebrow>Hello World</Eyebrow>);
      expect(screen.getByText("Hello World")).toBeDefined();
    });
  });
});
