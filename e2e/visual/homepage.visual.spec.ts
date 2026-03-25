/**
 * ST-864: REQ-113 -- Visual Regression Testing
 *
 * Screenshots the homepage at 3 viewport sizes and compares against
 * baseline images. First run creates the baselines; subsequent runs
 * compare with a 0.2% pixel diff threshold.
 *
 * Viewports:
 * - Desktop: 1440x900
 * - Tablet:  768x1024
 * - Mobile:  375x812
 *
 * Baselines stored in: e2e/visual/baselines/
 */

import { test, expect } from "@playwright/test";

// Shared config for visual tests
const VISUAL_CONFIG = {
  /**
   * Maximum allowed pixel difference as a ratio (0-1).
   * 0.002 = 0.2% pixel diff threshold.
   */
  maxDiffPixelRatio: 0.002,

  /**
   * Directory for baseline screenshots.
   * Playwright uses this as the snapshot path when comparing.
   */
  snapshotPathTemplate:
    "{testDir}/baselines/{testName}/{projectName}/{arg}{ext}",
};

test.describe("Homepage Visual Regression", () => {
  // -----------------------------------------------------------------------
  // Desktop: 1440x900
  // -----------------------------------------------------------------------
  test.describe("Desktop (1440x900)", () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test("homepage above-the-fold matches baseline", async ({ page }) => {
      await page.goto("/");

      // Wait for animations to settle and images to load
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot("homepage-desktop-above-fold.png", {
        maxDiffPixelRatio: VISUAL_CONFIG.maxDiffPixelRatio,
        fullPage: false,
      });
    });

    test("homepage full page matches baseline", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot("homepage-desktop-full.png", {
        maxDiffPixelRatio: VISUAL_CONFIG.maxDiffPixelRatio,
        fullPage: true,
      });
    });
  });

  // -----------------------------------------------------------------------
  // Tablet: 768x1024
  // -----------------------------------------------------------------------
  test.describe("Tablet (768x1024)", () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test("homepage above-the-fold matches baseline", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot("homepage-tablet-above-fold.png", {
        maxDiffPixelRatio: VISUAL_CONFIG.maxDiffPixelRatio,
        fullPage: false,
      });
    });

    test("homepage full page matches baseline", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot("homepage-tablet-full.png", {
        maxDiffPixelRatio: VISUAL_CONFIG.maxDiffPixelRatio,
        fullPage: true,
      });
    });
  });

  // -----------------------------------------------------------------------
  // Mobile: 375x812
  // -----------------------------------------------------------------------
  test.describe("Mobile (375x812)", () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test("homepage above-the-fold matches baseline", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot("homepage-mobile-above-fold.png", {
        maxDiffPixelRatio: VISUAL_CONFIG.maxDiffPixelRatio,
        fullPage: false,
      });
    });

    test("homepage full page matches baseline", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot("homepage-mobile-full.png", {
        maxDiffPixelRatio: VISUAL_CONFIG.maxDiffPixelRatio,
        fullPage: true,
      });
    });
  });
});
