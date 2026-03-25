/**
 * ST-866: REQ-114 -- SEO Meta Tags Validation E2E Tests
 *
 * Verifies every page has the required SEO meta tags:
 * - <title> element
 * - meta description
 * - canonical link
 * - Open Graph tags (og:title, og:description, og:url)
 *
 * Pages tested: all 14 routes from sitemap.ts
 */

import { test, expect } from "@playwright/test";

/**
 * All marketing site routes that should have complete SEO metadata.
 * Sourced from src/app/sitemap.ts.
 */
const PAGES = [
  { path: "/", name: "Homepage" },
  { path: "/solutions", name: "Solutions Overview" },
  { path: "/pricing", name: "Pricing" },
  { path: "/demo", name: "Demo" },
  { path: "/how-it-works", name: "How It Works" },
  { path: "/about", name: "About" },
  { path: "/blog", name: "Blog" },
  { path: "/contact", name: "Contact" },
] as const;

test.describe("SEO Meta Tags Validation", () => {
  for (const page_ of PAGES) {
    test.describe(`${page_.name} (${page_.path})`, () => {
      test(`has a non-empty <title> element`, async ({ page }) => {
        await page.goto(page_.path);

        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);

        // Title should contain "SafeTrekr"
        expect(title).toContain("SafeTrekr");
      });

      test(`has a meta description`, async ({ page }) => {
        await page.goto(page_.path);

        const description = page.locator('meta[name="description"]');
        await expect(description).toHaveAttribute("content", /.+/);

        const content = await description.getAttribute("content");
        expect(content).toBeTruthy();
        expect(content!.length).toBeGreaterThan(30);
        expect(content!.length).toBeLessThanOrEqual(260);
      });

      test(`has a canonical URL`, async ({ page }) => {
        await page.goto(page_.path);

        const canonical = page.locator('link[rel="canonical"]');
        await expect(canonical).toHaveAttribute("href", /safetrekr\.com/);
      });

      test(`has Open Graph title`, async ({ page }) => {
        await page.goto(page_.path);

        const ogTitle = page.locator('meta[property="og:title"]');
        await expect(ogTitle).toHaveAttribute("content", /.+/);
      });

      test(`has Open Graph description`, async ({ page }) => {
        await page.goto(page_.path);

        const ogDescription = page.locator(
          'meta[property="og:description"]',
        );
        await expect(ogDescription).toHaveAttribute("content", /.+/);
      });

      test(`has Open Graph URL`, async ({ page }) => {
        await page.goto(page_.path);

        const ogUrl = page.locator('meta[property="og:url"]');
        await expect(ogUrl).toHaveAttribute("content", /safetrekr\.com/);
      });

      test(`has Open Graph image`, async ({ page }) => {
        await page.goto(page_.path);

        const ogImage = page.locator('meta[property="og:image"]');
        await expect(ogImage).toHaveAttribute("content", /.+/);
      });

      test(`has Twitter card meta`, async ({ page }) => {
        await page.goto(page_.path);

        const twitterCard = page.locator('meta[name="twitter:card"]');
        await expect(twitterCard).toHaveAttribute(
          "content",
          "summary_large_image",
        );
      });
    });
  }

  // -----------------------------------------------------------------------
  // Cross-page consistency checks
  // -----------------------------------------------------------------------
  test.describe("Cross-page consistency", () => {
    test("each page has a unique title", async ({ page }) => {
      const titles: string[] = [];

      for (const pageDef of PAGES) {
        await page.goto(pageDef.path);
        const title = await page.title();
        titles.push(title);
      }

      const uniqueTitles = new Set(titles);
      expect(uniqueTitles.size).toBe(titles.length);
    });

    test("each page has a unique meta description", async ({ page }) => {
      const descriptions: string[] = [];

      for (const pageDef of PAGES) {
        await page.goto(pageDef.path);
        const desc = await page
          .locator('meta[name="description"]')
          .getAttribute("content");
        if (desc) descriptions.push(desc);
      }

      const uniqueDescriptions = new Set(descriptions);
      expect(uniqueDescriptions.size).toBe(descriptions.length);
    });

    test("each page has a unique canonical URL", async ({ page }) => {
      const canonicals: string[] = [];

      for (const pageDef of PAGES) {
        await page.goto(pageDef.path);
        const canonical = await page
          .locator('link[rel="canonical"]')
          .getAttribute("href");
        if (canonical) canonicals.push(canonical);
      }

      const uniqueCanonicals = new Set(canonicals);
      expect(uniqueCanonicals.size).toBe(canonicals.length);
    });
  });
});
