/**
 * ST-849: REQ-106 -- Component Tests for FeatureCard
 *
 * Tests rendering with and without href, hover classes, link indicator,
 * icon container, and custom className support.
 */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeatureCard } from "@/components/marketing/feature-card";

// Mock next/link to render a plain anchor for testing
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const defaultIcon = <svg data-testid="card-icon" />;

describe("FeatureCard", () => {
  // ── Static card (no href) ─────────────────────────────────────────

  describe("without href (static card)", () => {
    it("renders the title as an h3 heading", () => {
      render(
        <FeatureCard
          icon={defaultIcon}
          title="Evidence-Grade Records"
          description="Every assessment produces tamper-evident documentation."
        />,
      );
      const heading = screen.getByRole("heading", {
        name: "Evidence-Grade Records",
        level: 3,
      });
      expect(heading).toBeDefined();
    });

    it("renders the description text", () => {
      render(
        <FeatureCard
          icon={defaultIcon}
          title="Feature"
          description="Description text here."
        />,
      );
      expect(screen.getByText("Description text here.")).toBeDefined();
    });

    it("renders the icon", () => {
      render(
        <FeatureCard
          icon={defaultIcon}
          title="Feature"
          description="Desc"
        />,
      );
      expect(screen.getByTestId("card-icon")).toBeDefined();
    });

    it("does not render a link element", () => {
      render(
        <FeatureCard
          icon={defaultIcon}
          title="Feature"
          description="Desc"
        />,
      );
      expect(screen.queryByRole("link")).toBeNull();
    });

    it("does not render link text or arrow indicator", () => {
      render(
        <FeatureCard
          icon={defaultIcon}
          title="Feature"
          description="Desc"
        />,
      );
      expect(screen.queryByText("Learn more")).toBeNull();
    });

    it("does not apply hover transform classes on static card", () => {
      const { container } = render(
        <FeatureCard
          icon={defaultIcon}
          title="Feature"
          description="Desc"
        />,
      );
      const card = container.firstElementChild as HTMLElement;
      expect(card.className).not.toContain("hover:-translate-y-0.5");
    });

    it("applies base card styles", () => {
      const { container } = render(
        <FeatureCard
          icon={defaultIcon}
          title="Feature"
          description="Desc"
        />,
      );
      const card = container.firstElementChild as HTMLElement;
      expect(card.className).toContain("rounded-lg");
      expect(card.className).toContain("border");
      expect(card.className).toContain("p-6");
    });
  });

  // ── Linked card (with href) ───────────────────────────────────────

  describe("with href (linked card)", () => {
    it("renders a link element wrapping the content", () => {
      render(
        <FeatureCard
          icon={defaultIcon}
          title="Global Coverage"
          description="Real-time data."
          href="/features/coverage"
        />,
      );
      const link = screen.getByRole("link");
      expect(link).toBeDefined();
      expect(link.getAttribute("href")).toBe("/features/coverage");
    });

    it("renders default 'Learn more' link text", () => {
      render(
        <FeatureCard
          icon={defaultIcon}
          title="Feature"
          description="Desc"
          href="/features/test"
        />,
      );
      expect(screen.getByText("Learn more")).toBeDefined();
    });

    it("renders custom linkText when provided", () => {
      render(
        <FeatureCard
          icon={defaultIcon}
          title="Feature"
          description="Desc"
          href="/features/test"
          linkText="Explore coverage"
        />,
      );
      expect(screen.getByText("Explore coverage")).toBeDefined();
    });

    it("applies hover classes on linked card", () => {
      const { container } = render(
        <FeatureCard
          icon={defaultIcon}
          title="Feature"
          description="Desc"
          href="/test"
        />,
      );
      const card = container.firstElementChild as HTMLElement;
      expect(card.className).toContain("hover:-translate-y-0.5");
    });

    it("sets accessible aria-label on the link", () => {
      render(
        <FeatureCard
          icon={defaultIcon}
          title="Global Coverage"
          description="Desc"
          href="/test"
          linkText="Explore"
        />,
      );
      const link = screen.getByRole("link");
      expect(link.getAttribute("aria-label")).toBe(
        "Global Coverage - Explore",
      );
    });

    it("still renders the title and description", () => {
      render(
        <FeatureCard
          icon={defaultIcon}
          title="Security"
          description="Advanced security features."
          href="/security"
        />,
      );
      expect(
        screen.getByRole("heading", { name: "Security", level: 3 }),
      ).toBeDefined();
      expect(screen.getByText("Advanced security features.")).toBeDefined();
    });
  });

  // ── Icon container ────────────────────────────────────────────────

  describe("icon container", () => {
    it("wraps icon in aria-hidden container", () => {
      const { container } = render(
        <FeatureCard
          icon={defaultIcon}
          title="Feature"
          description="Desc"
        />,
      );
      const iconContainer = container.querySelector("[aria-hidden='true']");
      expect(iconContainer).not.toBeNull();
    });

    it("applies icon container styling", () => {
      const { container } = render(
        <FeatureCard
          icon={defaultIcon}
          title="Feature"
          description="Desc"
        />,
      );
      const iconContainer = container.querySelector(
        "[aria-hidden='true']",
      ) as HTMLElement;
      expect(iconContainer?.className).toContain("rounded-md");
      expect(iconContainer?.className).toContain("bg-primary-50");
    });
  });

  // ── Custom className ──────────────────────────────────────────────

  describe("custom className", () => {
    it("merges custom className on static card", () => {
      const { container } = render(
        <FeatureCard
          icon={defaultIcon}
          title="Feature"
          description="Desc"
          className="my-card"
        />,
      );
      const card = container.firstElementChild as HTMLElement;
      expect(card.className).toContain("my-card");
    });

    it("merges custom className on linked card", () => {
      const { container } = render(
        <FeatureCard
          icon={defaultIcon}
          title="Feature"
          description="Desc"
          href="/test"
          className="linked-card"
        />,
      );
      const card = container.firstElementChild as HTMLElement;
      expect(card.className).toContain("linked-card");
    });
  });
});
