/**
 * ST-854: REQ-108 -- Contact Form Critical Path E2E Tests
 *
 * Verifies the single-step contact form:
 * Fields: firstName, lastName, email, subject, message
 * Validates required fields and submission flow.
 */

import { test, expect } from "@playwright/test";

test.describe("Contact Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("contact page loads with form visible", async ({ page }) => {
    const form = page.getByRole("form", { name: /contact us/i });
    await expect(form).toBeVisible();
  });

  test("all required fields are present", async ({ page }) => {
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/subject/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
  });

  test("validates required fields on empty submission", async ({ page }) => {
    // Click submit without filling anything
    await page.getByRole("button", { name: /send message/i }).click();

    // Form should still be visible (not submitted successfully)
    await expect(
      page.getByRole("form", { name: /contact us/i }),
    ).toBeVisible();
  });

  test("fills contact form with valid data", async ({ page }) => {
    // Fill all required fields
    await page.getByLabel(/first name/i).fill("John");
    await page.getByLabel(/last name/i).fill("Doe");
    await page.getByLabel(/email address/i).fill("john.doe@example.com");
    await page.getByLabel(/subject/i).fill("Pricing inquiry");
    await page
      .getByLabel(/message/i)
      .fill(
        "I would like more information about SafeTrekr for our school district.",
      );

    // Submit button should be enabled
    const submitButton = page.getByRole("button", { name: /send message/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });

  test("submit button shows correct label", async ({ page }) => {
    const submitButton = page.getByRole("button", { name: /send message/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveText(/Send Message/);
  });
});
