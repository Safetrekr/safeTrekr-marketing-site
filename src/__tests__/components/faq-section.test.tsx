/**
 * ST-849: REQ-106 -- Component Tests for FAQSection
 *
 * Tests accordion rendering, items prop handling, JSON-LD schema generation,
 * and empty state behavior.
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FAQSection } from "@/components/marketing/faq-section";

const sampleItems = [
  { question: "What is SafeTrekr?", answer: "A travel risk management platform." },
  { question: "How does pricing work?", answer: "We offer three tiers." },
  { question: "Is there a free trial?", answer: "Yes, 14 days free." },
];

describe("FAQSection", () => {
  // ── Rendering items ───────────────────────────────────────────────

  describe("accordion rendering", () => {
    it("renders all question texts", () => {
      render(<FAQSection items={sampleItems} />);
      for (const item of sampleItems) {
        expect(screen.getByText(item.question)).toBeDefined();
      }
    });

    it("renders the correct number of accordion items", () => {
      render(<FAQSection items={sampleItems} />);
      // Each question is rendered as a button (AccordionTrigger)
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(sampleItems.length);
    });

    it("renders within a section element", () => {
      const { container } = render(<FAQSection items={sampleItems} />);
      const section = container.querySelector("section");
      expect(section).not.toBeNull();
    });

    it("includes aria-label on the section", () => {
      const { container } = render(<FAQSection items={sampleItems} />);
      const section = container.querySelector("section");
      expect(section?.getAttribute("aria-label")).toBe(
        "Frequently asked questions",
      );
    });

    it("renders a single item correctly", () => {
      const single = [{ question: "Solo question?", answer: "Solo answer." }];
      render(<FAQSection items={single} />);
      expect(screen.getByText("Solo question?")).toBeDefined();
    });
  });

  // ── Empty state ───────────────────────────────────────────────────

  describe("empty state", () => {
    it("returns null when items array is empty", () => {
      const { container } = render(<FAQSection items={[]} />);
      expect(container.innerHTML).toBe("");
    });
  });

  // ── JSON-LD schema ────────────────────────────────────────────────

  describe("JSON-LD schema generation", () => {
    it("renders a JSON-LD script tag by default", () => {
      const { container } = render(<FAQSection items={sampleItems} />);
      const script = container.querySelector(
        'script[type="application/ld+json"]',
      );
      expect(script).not.toBeNull();
    });

    it("includes @context and @type in JSON-LD", () => {
      const { container } = render(<FAQSection items={sampleItems} />);
      const script = container.querySelector(
        'script[type="application/ld+json"]',
      );
      const data = JSON.parse(script?.textContent ?? "{}");
      expect(data["@context"]).toBe("https://schema.org");
      expect(data["@type"]).toBe("FAQPage");
    });

    it("includes all FAQ items in JSON-LD mainEntity", () => {
      const { container } = render(<FAQSection items={sampleItems} />);
      const script = container.querySelector(
        'script[type="application/ld+json"]',
      );
      const data = JSON.parse(script?.textContent ?? "{}");
      expect(data.mainEntity).toHaveLength(sampleItems.length);
    });

    it("does not render JSON-LD when generateSchema is false", () => {
      const { container } = render(
        <FAQSection items={sampleItems} generateSchema={false} />,
      );
      const script = container.querySelector(
        'script[type="application/ld+json"]',
      );
      expect(script).toBeNull();
    });
  });

  // ── Custom className ──────────────────────────────────────────────

  describe("custom className", () => {
    it("applies additional className to section", () => {
      const { container } = render(
        <FAQSection items={sampleItems} className="my-custom-faq" />,
      );
      const section = container.querySelector("section");
      expect(section?.className).toContain("my-custom-faq");
    });

    it("preserves default max-w-3xl class", () => {
      const { container } = render(<FAQSection items={sampleItems} />);
      const section = container.querySelector("section");
      expect(section?.className).toContain("max-w-3xl");
    });
  });
});
