/**
 * ST-854: REQ-108 -- Pricing Page Critical Path E2E Tests
 *
 * Verifies pricing tiers render correctly with accurate per-student values,
 * volume discount table, and all pricing-related sections.
 */

import { test, expect } from "@playwright/test";

test.describe("Pricing Page Critical Path", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pricing");
  });

  test("pricing page loads with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/Pricing.*SafeTrekr/);
  });

  test("hero section displays $15 per participant anchor", async ({
    page,
  }) => {
    const hero = page.getByText(/\$15 Per Participant/i);
    await expect(hero).toBeVisible();
  });

  // -----------------------------------------------------------------------
  // Pricing Tiers
  // -----------------------------------------------------------------------
  test("renders all 3 pricing tier cards", async ({ page }) => {
    const tiers = [
      { name: "Field Trip", price: "$450" },
      { name: "Extended Trip", price: "$750" },
      { name: "International", price: "$1,250" },
    ];

    for (const tier of tiers) {
      // Verify tier name heading exists
      await expect(
        page.getByRole("heading", { name: tier.name }).first(),
      ).toBeVisible();

      // Verify price is displayed
      await expect(page.getByText(tier.price).first()).toBeVisible();
    }
  });

  test("per-student values are correct for each tier", async ({ page }) => {
    // Field Trip: ~$15/student
    await expect(page.getByText(/~\$15.*student/i).first()).toBeVisible();

    // Extended Trip: ~$30/participant
    await expect(page.getByText(/~\$30.*participant/i).first()).toBeVisible();

    // International: ~$62.50/participant
    await expect(page.getByText(/~\$62\.50.*participant/i).first()).toBeVisible();
  });

  test("Extended Trip tier is featured with badge", async ({ page }) => {
    // The Extended Trip tier should have a "Most Common" badge
    await expect(page.getByText(/Most Common/i)).toBeVisible();
  });

  // -----------------------------------------------------------------------
  // Volume Discounts
  // -----------------------------------------------------------------------
  test("volume discount table renders all tiers", async ({ page }) => {
    const discountRows = [
      { trips: /1.4 trips/i, discount: "Standard rate" },
      { trips: /5.9 trips/i, discount: "5% off" },
      { trips: /10.24 trips/i, discount: "10% off" },
      { trips: /25.49 trips/i, discount: "15% off" },
      { trips: /50\+ trips/i, discount: "20% off" },
    ];

    for (const row of discountRows) {
      await expect(page.getByText(row.trips).first()).toBeVisible();
    }
  });

  // -----------------------------------------------------------------------
  // Value Anchor Cards
  // -----------------------------------------------------------------------
  test("value anchor section shows liability vs SafeTrekr cost", async ({
    page,
  }) => {
    // Liability settlement
    await expect(page.getByText(/\$500K/i).first()).toBeVisible();

    // SafeTrekr per-student cost
    await expect(page.getByText(/\$15/i).first()).toBeVisible();
  });

  // -----------------------------------------------------------------------
  // Included Features
  // -----------------------------------------------------------------------
  test("renders included features section", async ({ page }) => {
    await expect(
      page.getByText(/No Tiers.*No Feature Gates.*No Surprises/i),
    ).toBeVisible();
  });

  // -----------------------------------------------------------------------
  // FAQ Section
  // -----------------------------------------------------------------------
  test("FAQ section renders with questions", async ({ page }) => {
    await expect(page.getByText(/Common Questions/i)).toBeVisible();

    // At least one FAQ question should be visible
    await expect(
      page.getByText(/What counts as a.*trip/i).first(),
    ).toBeVisible();
  });

  // -----------------------------------------------------------------------
  // CTA Band
  // -----------------------------------------------------------------------
  test("CTA band renders at bottom", async ({ page }) => {
    await expect(
      page.getByText(/Protect Your Next Trip/i),
    ).toBeVisible();
  });

  // -----------------------------------------------------------------------
  // Get a Demo links
  // -----------------------------------------------------------------------
  test("Get a Demo links in tier cards route to /demo", async ({ page }) => {
    const demoLinks = page.getByRole("link", { name: /get a demo/i });
    const count = await demoLinks.count();

    // Should have multiple "Get a Demo" links (hero + tier cards)
    expect(count).toBeGreaterThanOrEqual(3);

    // All should point to /demo
    for (let i = 0; i < count; i++) {
      const link = demoLinks.nth(i);
      await expect(link).toHaveAttribute("href", "/demo");
    }
  });
});
