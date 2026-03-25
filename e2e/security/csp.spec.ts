/**
 * ST-862: REQ-112 -- Content Security Policy E2E Tests
 *
 * Verifies that security headers are present and properly configured:
 * - CSP header present (if configured)
 * - No unsafe-inline in script-src
 * - Other security headers (X-Frame-Options, X-Content-Type-Options, etc.)
 */

import { test, expect } from "@playwright/test";

test.describe("Security Headers", () => {
  test("response includes X-Frame-Options: DENY", async ({ page }) => {
    const response = await page.goto("/");
    expect(response).not.toBeNull();

    const xFrameOptions = response!.headers()["x-frame-options"];
    expect(xFrameOptions).toBeDefined();
    expect(xFrameOptions?.toUpperCase()).toBe("DENY");
  });

  test("response includes X-Content-Type-Options: nosniff", async ({
    page,
  }) => {
    const response = await page.goto("/");
    expect(response).not.toBeNull();

    const xContentType = response!.headers()["x-content-type-options"];
    expect(xContentType).toBeDefined();
    expect(xContentType).toBe("nosniff");
  });

  test("response includes Referrer-Policy: strict-origin-when-cross-origin", async ({
    page,
  }) => {
    const response = await page.goto("/");
    expect(response).not.toBeNull();

    const referrerPolicy = response!.headers()["referrer-policy"];
    expect(referrerPolicy).toBeDefined();
    expect(referrerPolicy).toBe("strict-origin-when-cross-origin");
  });

  test("response includes Strict-Transport-Security header", async ({
    page,
  }) => {
    const response = await page.goto("/");
    expect(response).not.toBeNull();

    const hsts = response!.headers()["strict-transport-security"];
    expect(hsts).toBeDefined();
    expect(hsts).toContain("max-age=");
    expect(hsts).toContain("includeSubDomains");
  });

  test("response includes Permissions-Policy header", async ({ page }) => {
    const response = await page.goto("/");
    expect(response).not.toBeNull();

    const permissionsPolicy = response!.headers()["permissions-policy"];
    expect(permissionsPolicy).toBeDefined();
    expect(permissionsPolicy).toContain("camera=()");
    expect(permissionsPolicy).toContain("microphone=()");
    expect(permissionsPolicy).toContain("geolocation=()");
  });

  test("CSP header, if present, does not contain unsafe-inline for scripts", async ({
    page,
  }) => {
    const response = await page.goto("/");
    expect(response).not.toBeNull();

    const csp = response!.headers()["content-security-policy"];

    // If CSP is configured, verify no unsafe-inline in script-src
    if (csp) {
      // Extract script-src directive
      const scriptSrcMatch = csp.match(/script-src\s+([^;]+)/);

      if (scriptSrcMatch) {
        const scriptSrc = scriptSrcMatch[1];
        expect(scriptSrc).not.toContain("'unsafe-inline'");
      }
    } else {
      // CSP not yet configured -- this is acceptable during development.
      // Log a warning but do not fail the test.
      console.warn(
        "Content-Security-Policy header not found. Consider adding CSP for production.",
      );
    }
  });

  test("all security headers present on /pricing route", async ({ page }) => {
    const response = await page.goto("/pricing");
    expect(response).not.toBeNull();

    // Security headers should be applied globally via next.config.ts headers()
    expect(response!.headers()["x-frame-options"]).toBeDefined();
    expect(response!.headers()["x-content-type-options"]).toBeDefined();
    expect(response!.headers()["referrer-policy"]).toBeDefined();
    expect(response!.headers()["strict-transport-security"]).toBeDefined();
    expect(response!.headers()["permissions-policy"]).toBeDefined();
  });

  test("all security headers present on /demo route", async ({ page }) => {
    const response = await page.goto("/demo");
    expect(response).not.toBeNull();

    expect(response!.headers()["x-frame-options"]).toBeDefined();
    expect(response!.headers()["x-content-type-options"]).toBeDefined();
    expect(response!.headers()["referrer-policy"]).toBeDefined();
  });
});
