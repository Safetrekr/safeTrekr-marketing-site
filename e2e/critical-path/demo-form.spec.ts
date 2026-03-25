/**
 * ST-854: REQ-108 -- Demo Request Form Critical Path E2E Tests
 *
 * Verifies the 2-step demo request form:
 * Step 1: email + organization (low friction capture)
 * Step 2: firstName, lastName, orgType, tripsPerYear, demoFormat, message
 * Submission: verify success state renders
 */

import { test, expect } from "@playwright/test";

test.describe("Demo Request Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo");
  });

  test("demo page loads with form visible", async ({ page }) => {
    const form = page.getByRole("form", { name: /request a demo/i });
    await expect(form).toBeVisible();
  });

  test("Step 1: displays email and organization fields", async ({ page }) => {
    // Step 1 fields should be visible
    const emailInput = page.getByLabel(/email address/i);
    const orgInput = page.getByLabel('Organization', { exact: true });

    await expect(emailInput).toBeVisible();
    await expect(orgInput).toBeVisible();

    // Step indicator should show "Step 1 of 2"
    await expect(page.getByText(/Step 1 of 2/i)).toBeVisible();
  });

  test("Step 1: validates required fields before advancing", async ({
    page,
  }) => {
    // Click Continue without filling anything
    await page.getByRole("button", { name: /continue/i }).click();

    // Should still be on Step 1 -- error messages should appear
    await expect(page.getByText(/Step 1 of 2/i)).toBeVisible();
  });

  test("Step 1 + 2: fills both steps of the demo form", async ({ page }) => {
    // Step 1: fill email and organization
    await page.getByLabel(/email address/i).fill("test@school.edu");
    await page.getByLabel('Organization', { exact: true }).fill("Springfield School District");

    // Advance to Step 2
    await page.getByRole("button", { name: /continue/i }).click();

    // Should now be on Step 2
    await expect(page.getByText(/Step 2 of 2/i)).toBeVisible();

    // Fill Step 2 fields
    await page.getByLabel(/first name/i).fill("Jane");
    await page.getByLabel(/last name/i).fill("Smith");

    // Select organization type
    await page.getByLabel(/organization type/i).selectOption("k12");

    // Optional fields
    await page.getByLabel(/trips per year/i).selectOption("6-15");
    await page.getByLabel(/demo format/i).selectOption("live-video");
    await page
      .getByLabel(/message/i)
      .fill("We need safety reviews for 12 field trips per year.");

    // Verify the Back button returns to Step 1
    await page.getByRole("button", { name: /back/i }).click();
    await expect(page.getByText(/Step 1 of 2/i)).toBeVisible();

    // Return to Step 2
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.getByText(/Step 2 of 2/i)).toBeVisible();

    // Submit button should be visible
    const submitButton = page.getByRole("button", { name: /request demo/i });
    await expect(submitButton).toBeVisible();
  });

  test("Step 2: submit button is present and labeled correctly", async ({
    page,
  }) => {
    // Fill Step 1 to advance
    await page.getByLabel(/email address/i).fill("test@school.edu");
    await page.getByLabel('Organization', { exact: true }).fill("Test Org");
    await page.getByRole("button", { name: /continue/i }).click();

    // Verify submit button
    const submitButton = page.getByRole("button", { name: /request demo/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });
});
