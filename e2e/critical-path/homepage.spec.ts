/**
 * ST-854: REQ-108 -- Homepage Critical Path E2E Tests
 *
 * Verifies that the homepage loads and all 11 scroll-ordered sections render
 * correctly: Hero, Trust Strip, Problem/Mechanism, How It Works, Feature Grid,
 * Binder Showcase, Segment Routing, Pricing Preview, Category Contrast,
 * Final CTA, and JSON-LD structured data.
 */

import { test, expect } from "@playwright/test";

test.describe("Homepage Critical Path", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads successfully with 200 status", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("has correct page title and meta description", async ({ page }) => {
    await expect(page).toHaveTitle(/Professional Travel Risk Management.*SafeTrekr/);

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute(
      "content",
      /Professional trip safety review/,
    );
  });

  // -----------------------------------------------------------------------
  // Section 1: Hero
  // -----------------------------------------------------------------------
  test("Section 1: Hero renders with primary CTA", async ({ page }) => {
    // The HeroHome component should be visible at the top of the page
    const hero = page.locator("section").first();
    await expect(hero).toBeVisible();

    // Primary CTA: "Get a Demo" link should be present
    const demoCta = page.getByRole("link", { name: /get a demo/i }).first();
    await expect(demoCta).toBeVisible();
  });

  // -----------------------------------------------------------------------
  // Section 2: Trust Strip
  // -----------------------------------------------------------------------
  test("Section 2: Trust Strip renders with metrics", async ({ page }) => {
    // Trust strip contains metrics like "5 Government Sources"
    const trustStrip = page.getByText(/Government.*Source/i).first();
    await expect(trustStrip).toBeVisible();
  });

  // -----------------------------------------------------------------------
  // Section 3: Problem / Mechanism
  // -----------------------------------------------------------------------
  test("Section 3: Problem/Mechanism section renders", async ({ page }) => {
    const heading = page.getByText(
      /Trip safety today runs on spreadsheets and hope/i,
    );
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 10000 });

    // 3 mechanism cards should be present
    const analystCard = page.getByText(/Professional Analyst Review/i);
    const intelCard = page.getByText(/Government Intelligence Scoring/i);
    const docCard = page.getByText(/Tamper-Evident Documentation/i);

    await analystCard.scrollIntoViewIfNeeded();
    await expect(analystCard).toBeVisible({ timeout: 10000 });
    await intelCard.scrollIntoViewIfNeeded();
    await expect(intelCard).toBeVisible({ timeout: 10000 });
    await docCard.scrollIntoViewIfNeeded();
    await expect(docCard).toBeVisible({ timeout: 10000 });
  });

  // -----------------------------------------------------------------------
  // Section 4: How It Works
  // -----------------------------------------------------------------------
  test("Section 4: How It Works renders with 3 steps", async ({ page }) => {
    const heading = page.getByText(
      /From submission to safety binder in 3-5 days/i,
    );
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 10000 });

    const step1 = page.getByText(/Submit Your Trip/i);
    const step2 = page.getByText(/Analyst Reviews Everything/i);
    const step3 = page.getByText(/Receive Your Safety Binder/i);

    await step1.scrollIntoViewIfNeeded();
    await expect(step1).toBeVisible({ timeout: 10000 });
    await step2.scrollIntoViewIfNeeded();
    await expect(step2).toBeVisible({ timeout: 10000 });
    await step3.scrollIntoViewIfNeeded();
    await expect(step3).toBeVisible({ timeout: 10000 });
  });

  // -----------------------------------------------------------------------
  // Section 5: Feature Grid
  // -----------------------------------------------------------------------
  test("Section 5: Feature Grid renders 6 feature cards", async ({ page }) => {
    const heading = page.getByText(
      /Everything you need to protect every trip/i,
    );
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 10000 });

    const features = [
      "Analyst Safety Review",
      "Risk Intelligence Engine",
      "Trip Safety Binder",
      "Mobile Field Operations",
      "Real-Time Monitoring",
      "Compliance and Evidence",
    ];

    for (const feature of features) {
      const el = page.getByText(feature, { exact: false });
      await el.scrollIntoViewIfNeeded();
      await expect(el).toBeVisible({ timeout: 10000 });
    }
  });

  // -----------------------------------------------------------------------
  // Section 6: Binder Showcase
  // -----------------------------------------------------------------------
  test("Section 6: Binder Showcase dark section renders", async ({ page }) => {
    const heading = page.getByText(
      /See exactly what a reviewed trip looks like/i,
    );
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 10000 });

    const downloadCta = page.getByRole("link", {
      name: /Download a Sample Binder/i,
    });
    await downloadCta.scrollIntoViewIfNeeded();
    await expect(downloadCta).toBeVisible({ timeout: 10000 });
  });

  // -----------------------------------------------------------------------
  // Section 7: Segment Routing
  // -----------------------------------------------------------------------
  test("Section 7: Segment Routing renders 4 segment cards", async ({
    page,
  }) => {
    const segments = [
      "K-12 Schools and Districts",
      "Higher Education",
      "Churches and Mission Organizations",
      "Corporate and Sports Teams",
    ];

    for (const segment of segments) {
      const el = page.getByText(segment, { exact: false });
      await el.scrollIntoViewIfNeeded();
      await expect(el).toBeVisible({ timeout: 10000 });
    }
  });

  // -----------------------------------------------------------------------
  // Section 8: Pricing Preview
  // -----------------------------------------------------------------------
  test("Section 8: Pricing Preview renders 3 tiers", async ({ page }) => {
    const tiers = ["Field Trip", "Extended Trip", "International"];

    for (const tier of tiers) {
      const el = page.getByRole("heading", { name: tier }).first();
      await el.scrollIntoViewIfNeeded();
      await expect(el).toBeVisible({ timeout: 10000 });
    }

    // Verify "$15 per student" anchor text
    const priceText = page.getByText(/\$15 per student/i).first();
    await priceText.scrollIntoViewIfNeeded();
    await expect(priceText).toBeVisible({ timeout: 10000 });
  });

  // -----------------------------------------------------------------------
  // Section 9: Category Contrast
  // -----------------------------------------------------------------------
  test("Section 9: Category Contrast comparison table renders", async ({
    page,
  }) => {
    const heading = page.getByText(/This is not travel insurance/i);
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  // -----------------------------------------------------------------------
  // Section 10: Final CTA
  // -----------------------------------------------------------------------
  test("Section 10: Final CTA band renders", async ({ page }) => {
    const ctaHeading = page.getByText(
      /Ready to protect your next trip/i,
    );
    await ctaHeading.scrollIntoViewIfNeeded();
    await expect(ctaHeading).toBeVisible({ timeout: 10000 });
  });

  // -----------------------------------------------------------------------
  // Section 11: JSON-LD Structured Data
  // -----------------------------------------------------------------------
  test("Section 11: JSON-LD structured data is present", async ({ page }) => {
    const jsonLdScripts = page.locator(
      'script[type="application/ld+json"]',
    );
    const count = await jsonLdScripts.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Verify SoftwareApplication schema is present
    const scripts = await jsonLdScripts.allTextContents();
    const hasSoftwareApp = scripts.some((script) =>
      script.includes("SoftwareApplication"),
    );
    expect(hasSoftwareApp).toBe(true);
  });

  // -----------------------------------------------------------------------
  // All 11 sections present (aggregate check)
  // -----------------------------------------------------------------------
  test("all 11 sections render on the homepage", async ({ page }) => {
    // Key identifiers from each section to verify presence
    const sectionMarkers = [
      /get a demo/i, // S1: Hero CTA
      /Government.*Source/i, // S2: Trust Strip
      /spreadsheets and hope/i, // S3: Problem
      /From submission to safety binder/i, // S4: How It Works
      /Everything you need to protect/i, // S5: Feature Grid
      /See exactly what a reviewed trip/i, // S6: Binder Showcase
      /Built for.*organization/i, // S7: Segment Routing
      /\$15 per participant/i, // S8: Pricing Preview
      /not travel insurance/i, // S9: Category Contrast
      /Ready to protect your next trip/i, // S10: Final CTA
    ];

    for (const marker of sectionMarkers) {
      const el = page.getByText(marker).first();
      await el.scrollIntoViewIfNeeded();
      await expect(el).toBeVisible({ timeout: 10000 });
    }

    // S11: JSON-LD
    const jsonLd = page.locator('script[type="application/ld+json"]');
    expect(await jsonLd.count()).toBeGreaterThanOrEqual(1);
  });
});
