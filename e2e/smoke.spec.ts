import { expect, test } from "@playwright/test";

/**
 * ST-838: Smoke Test (REQ-101)
 *
 * Minimal end-to-end check that the homepage loads and renders a meaningful
 * title. This runs across all 6 browser projects defined in playwright.config.ts
 * and acts as a canary -- if this fails, something fundamental is broken.
 */
test.describe("Smoke Test", () => {
  test("homepage loads and has the correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/SafeTrekr/i);
  });

  test("homepage renders without crashing", async ({ page }) => {
    await page.goto("/");

    // Verify the page has meaningful content -- not a blank or error page
    const body = page.locator("body");
    await expect(body).toBeVisible();

    // Ensure no uncaught errors rendered a Next.js error overlay.
    // In dev mode, Next.js may render a <nextjs-portal> for its dev tools,
    // so we specifically check for the error indicator instead.
    const errorOverlay = page.locator("nextjs-portal[data-nextjs-dialog-overlay]");
    await expect(errorOverlay).toHaveCount(0);
  });
});
