/**
 * ST-849: REQ-106 -- Component Tests for Badge
 *
 * Tests all badge variant classes render correctly, including both the
 * shadcn/ui default variants and SafeTrekr marketing variants.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  // ── shadcn/ui default variants ────────────────────────────────────

  describe("shadcn/ui default variants", () => {
    it("renders default variant with primary background", () => {
      render(<Badge variant="default">Default</Badge>);
      const badge = screen.getByText("Default");
      expect(badge.className).toContain("bg-primary");
      expect(badge.className).toContain("text-primary-foreground");
    });

    it("renders secondary variant", () => {
      render(<Badge variant="secondary">Secondary</Badge>);
      const badge = screen.getByText("Secondary");
      expect(badge.className).toContain("bg-secondary");
      expect(badge.className).toContain("text-secondary-foreground");
    });

    it("renders destructive variant", () => {
      render(<Badge variant="destructive">Error</Badge>);
      const badge = screen.getByText("Error");
      expect(badge.className).toContain("bg-destructive");
      expect(badge.className).toContain("text-destructive-foreground");
    });

    it("renders outline variant", () => {
      render(<Badge variant="outline">Outline</Badge>);
      const badge = screen.getByText("Outline");
      expect(badge.className).toContain("text-foreground");
    });
  });

  // ── SafeTrekr marketing variants ──────────────────────────────────

  describe("SafeTrekr marketing variants", () => {
    it("renders brand variant with primary-50 background", () => {
      render(<Badge variant="brand">Brand</Badge>);
      const badge = screen.getByText("Brand");
      expect(badge.className).toContain("bg-primary-50");
      expect(badge.className).toContain("text-primary-700");
    });

    it("renders neutral variant with muted bg and border", () => {
      render(<Badge variant="neutral">Neutral</Badge>);
      const badge = screen.getByText("Neutral");
      expect(badge.className).toContain("bg-muted");
      expect(badge.className).toContain("text-muted-foreground");
    });

    it("renders success variant with safety-green color", () => {
      render(<Badge variant="success">Active</Badge>);
      const badge = screen.getByText("Active");
      expect(badge.className).toContain("text-safety-green");
    });

    it("renders warning variant with safety-yellow color", () => {
      render(<Badge variant="warning">Caution</Badge>);
      const badge = screen.getByText("Caution");
      expect(badge.className).toContain("text-safety-yellow");
    });

    it("renders error variant with safety-red color", () => {
      render(<Badge variant="error">Critical</Badge>);
      const badge = screen.getByText("Critical");
      expect(badge.className).toContain("text-safety-red");
    });

    it("renders dark variant with dark-surface background", () => {
      render(<Badge variant="dark">Dark Mode</Badge>);
      const badge = screen.getByText("Dark Mode");
      expect(badge.className).toContain("bg-dark-surface");
      expect(badge.className).toContain("text-dark-text-secondary");
    });
  });

  // ── Default behavior ──────────────────────────────────────────────

  describe("default behavior", () => {
    it("uses default variant when no variant is specified", () => {
      render(<Badge>No Variant</Badge>);
      const badge = screen.getByText("No Variant");
      expect(badge.className).toContain("bg-primary");
    });
  });

  // ── Base classes ──────────────────────────────────────────────────

  describe("base classes", () => {
    it("always includes inline-flex and items-center", () => {
      render(<Badge>Base</Badge>);
      const badge = screen.getByText("Base");
      expect(badge.className).toContain("inline-flex");
      expect(badge.className).toContain("items-center");
    });

    it("always includes rounded-md and text-xs", () => {
      render(<Badge>Style</Badge>);
      const badge = screen.getByText("Style");
      expect(badge.className).toContain("rounded-md");
      expect(badge.className).toContain("text-xs");
    });

    it("always includes font-semibold", () => {
      render(<Badge>Weight</Badge>);
      const badge = screen.getByText("Weight");
      expect(badge.className).toContain("font-semibold");
    });
  });

  // ── Custom className ──────────────────────────────────────────────

  describe("custom className", () => {
    it("merges additional className prop", () => {
      render(<Badge className="my-custom-class">Custom</Badge>);
      const badge = screen.getByText("Custom");
      expect(badge.className).toContain("my-custom-class");
    });
  });

  // ── Renders as div ────────────────────────────────────────────────

  describe("DOM element", () => {
    it("renders as a div element", () => {
      render(<Badge>Tag</Badge>);
      const badge = screen.getByText("Tag");
      expect(badge.tagName).toBe("DIV");
    });
  });
});
