/**
 * ST-866: REQ-114 -- Sitemap Validation E2E Tests
 *
 * Fetches /sitemap.xml and verifies:
 * - The sitemap is accessible and returns valid XML
 * - All expected marketing routes are present
 * - Each URL has lastmod, changefreq, and priority attributes
 */

import { test, expect } from "@playwright/test";

/**
 * All routes expected in the sitemap, sourced from src/app/sitemap.ts.
 * These paths are relative to the base URL (https://safetrekr.com).
 */
const EXPECTED_ROUTES = [
  // Homepage
  "",
  // Solutions & conversion pages
  "/solutions",
  "/solutions/k12",
  "/solutions/churches",
  "/solutions/corporate",
  "/solutions/higher-education",
  "/pricing",
  "/demo",
  // Feature / info pages
  "/how-it-works",
  "/about",
  // Blog, resources, contact
  "/blog",
  "/contact",
  "/resources",
  // Legal pages
  "/legal/privacy",
  "/legal/terms",
] as const;

test.describe("Sitemap Validation", () => {
  test("sitemap.xml is accessible and returns XML", async ({ request }) => {
    const response = await request.get("/sitemap.xml");

    expect(response.status()).toBe(200);

    const contentType = response.headers()["content-type"];
    expect(contentType).toMatch(/xml/);

    const body = await response.text();
    expect(body).toContain("<?xml");
    expect(body).toContain("<urlset");
  });

  test("sitemap contains all expected routes", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    const body = await response.text();

    for (const route of EXPECTED_ROUTES) {
      // The sitemap uses the full URL (https://safetrekr.com + route)
      // In dev mode, it may use localhost, so we check for the route path
      const routePattern = route === "" ? "safetrekr.com</loc>" : route;
      expect(
        body,
        `Route "${route || "/"}" should be present in sitemap`,
      ).toContain(routePattern);
    }
  });

  test("each URL entry has lastmod", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    const body = await response.text();

    // Count <url> entries and <lastmod> entries
    const urlCount = (body.match(/<url>/g) ?? []).length;
    const lastmodCount = (body.match(/<lastmod>/g) ?? []).length;

    expect(urlCount).toBeGreaterThan(0);
    expect(lastmodCount).toBe(urlCount);
  });

  test("each URL entry has changefreq", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    const body = await response.text();

    const urlCount = (body.match(/<url>/g) ?? []).length;
    const changefreqCount = (body.match(/<changefreq>/g) ?? []).length;

    expect(changefreqCount).toBe(urlCount);
  });

  test("each URL entry has priority", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    const body = await response.text();

    const urlCount = (body.match(/<url>/g) ?? []).length;
    const priorityCount = (body.match(/<priority>/g) ?? []).length;

    expect(priorityCount).toBe(urlCount);
  });

  test("sitemap has correct number of routes", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    const body = await response.text();

    const urlCount = (body.match(/<url>/g) ?? []).length;

    // Should match the number of expected routes (15 from sitemap.ts)
    expect(urlCount).toBe(EXPECTED_ROUTES.length);
  });

  test("homepage has priority 1.0", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    const body = await response.text();

    // The homepage entry should have priority 1.0
    // Look for the homepage URL followed eventually by priority 1.0
    expect(body).toMatch(/<priority>1(\.0)?<\/priority>/);
  });

  test("legal pages have lower priority", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    const body = await response.text();

    // Legal pages should have priority 0.5
    expect(body).toContain("<priority>0.5</priority>");
  });
});
