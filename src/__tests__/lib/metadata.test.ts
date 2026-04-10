/**
 * ST-844: REQ-104 -- Unit Tests for generatePageMetadata
 *
 * Tests the centralized metadata generation utility that produces
 * Next.js Metadata objects with consistent title templates, canonical
 * URLs, Open Graph tags, and Twitter card configuration.
 */

import { describe, it, expect } from "vitest";
import { generatePageMetadata } from "@/lib/metadata";

describe("generatePageMetadata()", () => {
  const baseOptions = {
    title: "Pricing",
    description: "Transparent pricing for teams of every size.",
    path: "/pricing",
  };

  // ── Title template ────────────────────────────────────────────────────

  describe("title template", () => {
    it("formats title as '{title} | SafeTrekr'", () => {
      const result = generatePageMetadata(baseOptions);
      expect(result.title).toBe("Pricing | SafeTrekr");
    });

    it("handles titles with special characters", () => {
      const result = generatePageMetadata({
        ...baseOptions,
        title: "K-12 Schools & Universities",
      });
      expect(result.title).toBe("K-12 Schools & Universities | SafeTrekr");
    });
  });

  // ── Description ───────────────────────────────────────────────────────

  describe("description", () => {
    it("passes the description through unchanged", () => {
      const result = generatePageMetadata(baseOptions);
      expect(result.description).toBe(
        "Transparent pricing for teams of every size.",
      );
    });
  });

  // ── Canonical URL ─────────────────────────────────────────────────────

  describe("canonical URL", () => {
    it("constructs canonical URL from site origin + path", () => {
      const result = generatePageMetadata(baseOptions);
      expect(result.alternates?.canonical).toBe(
        "https://safetrekr.com/pricing",
      );
    });

    it("handles root path", () => {
      const result = generatePageMetadata({
        ...baseOptions,
        path: "/",
      });
      expect(result.alternates?.canonical).toBe("https://safetrekr.com/");
    });

    it("handles nested paths", () => {
      const result = generatePageMetadata({
        ...baseOptions,
        path: "/solutions/k12",
      });
      expect(result.alternates?.canonical).toBe(
        "https://safetrekr.com/solutions/k12",
      );
    });
  });

  // ── Open Graph ────────────────────────────────────────────────────────

  describe("Open Graph", () => {
    it("includes OG title matching the page title", () => {
      const result = generatePageMetadata(baseOptions);
      expect(result.openGraph?.title).toBe("Pricing | SafeTrekr");
    });

    it("includes OG description", () => {
      const result = generatePageMetadata(baseOptions);
      expect(result.openGraph?.description).toBe(
        "Transparent pricing for teams of every size.",
      );
    });

    it("includes OG URL matching canonical", () => {
      const result = generatePageMetadata(baseOptions);
      expect(result.openGraph?.url).toBe("https://safetrekr.com/pricing");
    });

    it("includes OG siteName as 'SafeTrekr'", () => {
      const result = generatePageMetadata(baseOptions);
      expect(result.openGraph?.siteName).toBe("SafeTrekr");
    });

    it("sets OG type to 'website'", () => {
      const result = generatePageMetadata(baseOptions);
      expect(result.openGraph?.type).toBe("website");
    });

    it("uses default OG image when none provided", () => {
      const result = generatePageMetadata(baseOptions);
      const images = result.openGraph?.images;
      expect(images).toBeDefined();
      expect(Array.isArray(images)).toBe(true);
      const imageArray = images as Array<{ url: string }>;
      expect(imageArray[0]?.url).toBe("/images/og-default.svg");
    });

    it("uses custom OG image when provided", () => {
      const result = generatePageMetadata({
        ...baseOptions,
        ogImage: "/images/pricing-og.png",
      });
      const images = result.openGraph?.images as Array<{ url: string }>;
      expect(images[0]?.url).toBe("/images/pricing-og.png");
    });
  });

  // ── Twitter card ──────────────────────────────────────────────────────

  describe("Twitter card", () => {
    it("sets card type to 'summary_large_image'", () => {
      const result = generatePageMetadata(baseOptions);
      expect(result.twitter?.card).toBe("summary_large_image");
    });

    it("sets twitter:site to '@safetrekr'", () => {
      const result = generatePageMetadata(baseOptions);
      expect(result.twitter?.site).toBe("@safetrekr");
    });
  });

  // ── noIndex robots directive ──────────────────────────────────────────

  describe("noIndex", () => {
    it("does not include robots directive by default", () => {
      const result = generatePageMetadata(baseOptions);
      expect(result.robots).toBeUndefined();
    });

    it("does not include robots directive when noIndex is false", () => {
      const result = generatePageMetadata({
        ...baseOptions,
        noIndex: false,
      });
      expect(result.robots).toBeUndefined();
    });

    it("includes noindex/nofollow robots when noIndex is true", () => {
      const result = generatePageMetadata({
        ...baseOptions,
        noIndex: true,
      });
      expect(result.robots).toEqual({
        index: false,
        follow: false,
      });
    });
  });
});
