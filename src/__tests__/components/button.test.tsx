/**
 * ST-849: REQ-106 -- Component Tests for Button
 *
 * Tests all 6 button variants render correct classes and the asChild
 * prop correctly renders a Slot instead of a <button> element.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  // ── Variant rendering ─────────────────────────────────────────────

  describe("variant classes", () => {
    it("renders primary variant with correct background", () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole("button", { name: "Primary" });
      expect(button.className).toContain("bg-[var(--color-primary-600)]");
      expect(button.className).toContain("text-white");
    });

    it("renders secondary variant with border and transparent bg", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button", { name: "Secondary" });
      expect(button.className).toContain("bg-transparent");
      expect(button.className).toContain("border");
    });

    it("renders ghost variant with transparent background", () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole("button", { name: "Ghost" });
      expect(button.className).toContain("bg-transparent");
    });

    it("renders destructive variant with destructive color", () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole("button", { name: "Delete" });
      expect(button.className).toContain("bg-[var(--color-destructive)]");
      expect(button.className).toContain("text-white");
    });

    it("renders primaryOnDark variant with white background", () => {
      render(<Button variant="primaryOnDark">Light</Button>);
      const button = screen.getByRole("button", { name: "Light" });
      expect(button.className).toContain("bg-white");
    });

    it("renders ghostOnDark variant with transparent bg and white border", () => {
      render(<Button variant="ghostOnDark">Dark Ghost</Button>);
      const button = screen.getByRole("button", { name: "Dark Ghost" });
      expect(button.className).toContain("bg-transparent");
      expect(button.className).toContain("border");
    });
  });

  // ── Default variant ───────────────────────────────────────────────

  describe("default variant", () => {
    it("uses primary variant when no variant is specified", () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole("button", { name: "Default" });
      expect(button.className).toContain("bg-[var(--color-primary-600)]");
    });
  });

  // ── Size variants ─────────────────────────────────────────────────

  describe("size variants", () => {
    it("renders sm size", () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole("button", { name: "Small" });
      expect(button.className).toContain("py-2");
      expect(button.className).toContain("px-4");
    });

    it("renders md size (default)", () => {
      render(<Button size="md">Medium</Button>);
      const button = screen.getByRole("button", { name: "Medium" });
      expect(button.className).toContain("py-3");
      expect(button.className).toContain("px-6");
    });

    it("renders lg size", () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole("button", { name: "Large" });
      expect(button.className).toContain("py-4");
      expect(button.className).toContain("px-8");
    });

    it("renders icon size", () => {
      render(<Button size="icon">X</Button>);
      const button = screen.getByRole("button", { name: "X" });
      expect(button.className).toContain("h-10");
      expect(button.className).toContain("w-10");
    });
  });

  // ── asChild ───────────────────────────────────────────────────────

  describe("asChild prop", () => {
    it("renders a <button> element by default", () => {
      render(<Button>Click</Button>);
      const button = screen.getByRole("button", { name: "Click" });
      expect(button.tagName).toBe("BUTTON");
    });

    it("renders as a Slot (child element) when asChild is true", () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>,
      );
      const link = screen.getByRole("link", { name: "Link Button" });
      expect(link.tagName).toBe("A");
      expect(link.getAttribute("href")).toBe("/test");
      // Should still have button variant classes applied
      expect(link.className).toContain("inline-flex");
    });
  });

  // ── Additional props ──────────────────────────────────────────────

  describe("additional props", () => {
    it("forwards className prop", () => {
      render(<Button className="custom-class">Styled</Button>);
      const button = screen.getByRole("button", { name: "Styled" });
      expect(button.className).toContain("custom-class");
    });

    it("forwards disabled prop", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button", { name: "Disabled" });
      expect(button).toBeDisabled();
    });

    it("forwards onClick handler", () => {
      let clicked = false;
      render(<Button onClick={() => (clicked = true)}>Click</Button>);
      const button = screen.getByRole("button", { name: "Click" });
      button.click();
      expect(clicked).toBe(true);
    });

    it("renders children text", () => {
      render(<Button>My Button Text</Button>);
      expect(screen.getByText("My Button Text")).toBeDefined();
    });
  });

  // ── Shared base classes ───────────────────────────────────────────

  describe("base classes", () => {
    it("always includes inline-flex and items-center", () => {
      render(<Button>Base</Button>);
      const button = screen.getByRole("button", { name: "Base" });
      expect(button.className).toContain("inline-flex");
      expect(button.className).toContain("items-center");
    });

    it("always includes focus-visible ring styles", () => {
      render(<Button>Focus</Button>);
      const button = screen.getByRole("button", { name: "Focus" });
      expect(button.className).toContain("focus-visible:outline-none");
      expect(button.className).toContain("focus-visible:ring-2");
    });
  });
});
