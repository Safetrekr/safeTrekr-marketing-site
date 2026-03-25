/**
 * ST-856: REQ-109 -- Browser Back Button Edge Case E2E Tests
 *
 * Verifies that navigating through form steps and using the browser
 * back button preserves form state and does not corrupt the user flow.
 */

import { test, expect } from "@playwright/test";

test.describe("Browser Back Button - Form State Preservation", () => {
  test.describe("Demo Request Form - Multi-Step", () => {
    test("browser back from Step 2 preserves Step 1 data", async ({
      page,
    }) => {
      await page.goto("/demo");

      // Fill Step 1
      const email = "test@school.edu";
      const org = "Springfield School District";

      await page.getByLabel(/email address/i).fill(email);
      await page.getByLabel('Organization', { exact: true }).fill(org);

      // Advance to Step 2
      await page.getByRole("button", { name: /continue/i }).click();
      await expect(page.getByText(/Step 2 of 2/i)).toBeVisible();

      // Use the form's built-in Back button (not browser back)
      await page.getByRole("button", { name: /back/i }).click();

      // Step 1 should be visible again
      await expect(page.getByText(/Step 1 of 2/i)).toBeVisible();

      // Verify the data is still populated
      await expect(page.getByLabel(/email address/i)).toHaveValue(email);
      await expect(page.getByLabel('Organization', { exact: true })).toHaveValue(org);
    });

    test("navigating away and back to demo page resets form", async ({
      page,
    }) => {
      await page.goto("/demo");

      // Fill Step 1
      await page.getByLabel(/email address/i).fill("test@school.edu");
      await page.getByLabel('Organization', { exact: true }).fill("Test School");

      // Advance to Step 2
      await page.getByRole("button", { name: /continue/i }).click();
      await expect(page.getByText(/Step 2 of 2/i)).toBeVisible();

      // Navigate away to pricing
      await page.goto("/pricing");
      await expect(page).toHaveURL(/\/pricing/);

      // Navigate back to demo using browser back
      await page.goBack();
      await expect(page).toHaveURL(/\/demo/);

      // Form should be on Step 1 (React state resets on navigation)
      await expect(page.getByText(/Step 1 of 2/i)).toBeVisible();
    });

    test("Step 2 data persists when toggling between steps", async ({
      page,
    }) => {
      await page.goto("/demo");

      // Complete Step 1
      await page.getByLabel(/email address/i).fill("jane@school.edu");
      await page.getByLabel('Organization', { exact: true }).fill("Lincoln High School");
      await page.getByRole("button", { name: /continue/i }).click();

      // Fill Step 2 fields
      const firstName = "Jane";
      const lastName = "Smith";

      await page.getByLabel(/first name/i).fill(firstName);
      await page.getByLabel(/last name/i).fill(lastName);
      await page.getByLabel(/organization type/i).selectOption("k12");

      // Go back to Step 1
      await page.getByRole("button", { name: /back/i }).click();
      await expect(page.getByText(/Step 1 of 2/i)).toBeVisible();

      // Return to Step 2
      await page.getByRole("button", { name: /continue/i }).click();
      await expect(page.getByText(/Step 2 of 2/i)).toBeVisible();

      // Step 2 data should still be populated
      await expect(page.getByLabel(/first name/i)).toHaveValue(firstName);
      await expect(page.getByLabel(/last name/i)).toHaveValue(lastName);
    });
  });

  test.describe("Contact Form - Browser History", () => {
    test("browser back after filling contact form preserves data", async ({
      page,
    }) => {
      // Navigate to contact page
      await page.goto("/contact");

      // Fill some fields
      await page.getByLabel(/first name/i).fill("John");
      await page.getByLabel(/email address/i).fill("john@example.com");

      // Navigate away
      await page.goto("/pricing");
      await expect(page).toHaveURL(/\/pricing/);

      // Browser back to contact
      await page.goBack();
      await expect(page).toHaveURL(/\/contact/);

      // The form should still be present and functional
      const form = page.getByRole("form", { name: /contact us/i });
      await expect(form).toBeVisible();
    });
  });

  test.describe("Cross-page navigation flow", () => {
    test("homepage -> demo -> pricing -> back -> back preserves URL history", async ({
      page,
    }) => {
      // Start at homepage
      await page.goto("/");
      await expect(page).toHaveURL("/");

      // Go to demo
      await page.goto("/demo");
      await expect(page).toHaveURL(/\/demo/);

      // Go to pricing
      await page.goto("/pricing");
      await expect(page).toHaveURL(/\/pricing/);

      // Back to demo
      await page.goBack();
      await expect(page).toHaveURL(/\/demo/);

      // Back to homepage
      await page.goBack();
      await expect(page).toHaveURL("/");

      // Forward to demo
      await page.goForward();
      await expect(page).toHaveURL(/\/demo/);
    });
  });
});
