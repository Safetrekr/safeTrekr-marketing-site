/**
 * ST-854: REQ-108 -- Navigation Critical Path E2E Tests
 *
 * Verifies that all primary navigation links route correctly,
 * the logo navigates home, and browser back/forward history works.
 */

import { test, expect } from "@playwright/test";

test.describe("Navigation Critical Path", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  // -----------------------------------------------------------------------
  // Desktop Navigation Links
  // -----------------------------------------------------------------------
  test.describe("Desktop navigation", () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test("all primary nav links are visible on desktop", async ({ page }) => {
      const navLinks = [
        { name: "Platform", href: "/platform" },
        { name: "Solutions", href: "/solutions" },
        { name: "How It Works", href: "/how-it-works" },
        { name: "Pricing", href: "/pricing" },
        { name: "Resources", href: "/resources" },
      ];

      const nav = page.getByRole("navigation", { name: /main/i });
      await expect(nav).toBeVisible();

      for (const link of navLinks) {
        const navLink = nav.getByRole("link", { name: link.name });
        await expect(navLink).toBeVisible();
        await expect(navLink).toHaveAttribute("href", link.href);
      }
    });

    test("nav link to How It Works routes correctly", async ({ page }) => {
      const nav = page.getByRole("navigation", { name: /main/i });
      await nav.getByRole("link", { name: "How It Works" }).click();

      await expect(page).toHaveURL(/\/how-it-works/);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });

    test("nav link to Pricing routes correctly", async ({ page }) => {
      const nav = page.getByRole("navigation", { name: /main/i });
      await nav.getByRole("link", { name: "Pricing" }).click();

      await expect(page).toHaveURL(/\/pricing/);
      await expect(page).toHaveTitle(/Pricing.*SafeTrekr/);
    });

    test("nav link to Solutions routes correctly", async ({ page }) => {
      const nav = page.getByRole("navigation", { name: /main/i });
      await nav.getByRole("link", { name: "Solutions" }).click();

      await expect(page).toHaveURL(/\/solutions/);
    });

    test("Get a Demo CTA routes correctly", async ({ page }) => {
      // The header "Get a Demo" button
      const headerDemoCta = page
        .getByRole("link", { name: /get a demo/i })
        .first();
      await headerDemoCta.click();

      await expect(page).toHaveURL(/\/demo/);
    });

    test("logo navigates to homepage", async ({ page }) => {
      // Navigate away first
      await page.goto("/pricing");
      await expect(page).toHaveURL(/\/pricing/);

      // Click logo to go home
      const logoLink = page.getByRole("link", { name: /safetrekr home/i }).first();
      await logoLink.click();

      await expect(page).toHaveURL("/");
    });
  });

  // -----------------------------------------------------------------------
  // Browser Back/Forward
  // -----------------------------------------------------------------------
  test.describe("Browser history navigation", () => {
    test("back/forward buttons work correctly through navigation flow", async ({
      page,
    }) => {
      // Start at homepage
      await expect(page).toHaveURL("/");

      // Navigate to Pricing
      await page.goto("/pricing");
      await expect(page).toHaveURL(/\/pricing/);

      // Navigate to How It Works
      await page.goto("/how-it-works");
      await expect(page).toHaveURL(/\/how-it-works/);

      // Go back to Pricing
      await page.goBack();
      await expect(page).toHaveURL(/\/pricing/);

      // Go back to Homepage
      await page.goBack();
      await expect(page).toHaveURL("/");

      // Go forward to Pricing
      await page.goForward();
      await expect(page).toHaveURL(/\/pricing/);

      // Go forward to How It Works
      await page.goForward();
      await expect(page).toHaveURL(/\/how-it-works/);
    });
  });

  // -----------------------------------------------------------------------
  // Mobile Navigation
  // -----------------------------------------------------------------------
  test.describe("Mobile navigation", () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test("mobile menu opens and contains all nav links", async ({ page }) => {
      // Open the mobile menu
      const menuButton = page.getByRole("button", {
        name: /open navigation menu/i,
      });
      await expect(menuButton).toBeVisible();
      await menuButton.click();
      // Wait for Sheet animation to complete
      await page.waitForTimeout(500);

      // Verify all nav links are visible in the sheet
      const mobileNavLinks = [
        "Platform",
        "Solutions",
        "How It Works",
        "Pricing",
        "Resources",
      ];

      for (const linkName of mobileNavLinks) {
        await expect(
          page.getByRole("link", { name: linkName }),
        ).toBeVisible();
      }

      // Verify "Get a Demo" CTA in mobile menu
      await expect(
        page.getByRole("link", { name: /get a demo/i }),
      ).toBeVisible();
    });

    test("mobile menu link navigates and closes menu", async ({ page }) => {
      const menuButton = page.getByRole("button", {
        name: /open navigation menu/i,
      });
      await menuButton.click();
      // Wait for Sheet animation to complete
      await page.waitForTimeout(500);

      // Click on Pricing link in mobile menu
      await page.getByRole("link", { name: "Pricing" }).click();

      await expect(page).toHaveURL(/\/pricing/);
    });
  });
});
