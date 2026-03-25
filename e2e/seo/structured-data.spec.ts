/**
 * ST-866: REQ-114 -- Structured Data (JSON-LD) Validation E2E Tests
 *
 * Verifies that JSON-LD structured data is present on key pages:
 * - Homepage: Organization + SoftwareApplication schemas
 * - Pricing: Product + Offer schemas + FAQPage
 * - Solutions pages: BreadcrumbList schemas
 */

import { test, expect } from "@playwright/test";

/**
 * Helper: Extracts all JSON-LD objects from the page.
 */
async function getJsonLdObjects(
  page: import("@playwright/test").Page,
): Promise<Record<string, unknown>[]> {
  const scripts = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();

  return scripts.map((script) => JSON.parse(script) as Record<string, unknown>);
}

test.describe("Structured Data (JSON-LD) Validation", () => {
  // -----------------------------------------------------------------------
  // Homepage
  // -----------------------------------------------------------------------
  test.describe("Homepage", () => {
    test("contains Organization schema", async ({ page }) => {
      await page.goto("/");

      const schemas = await getJsonLdObjects(page);
      const orgSchema = schemas.find(
        (s) => s["@type"] === "Organization",
      );

      expect(orgSchema).toBeDefined();
      expect(orgSchema!["name"]).toBe("SafeTrekr");
      expect(orgSchema!["url"]).toContain("safetrekr.com");
    });

    test("contains SoftwareApplication schema", async ({ page }) => {
      await page.goto("/");

      const schemas = await getJsonLdObjects(page);
      const appSchema = schemas.find(
        (s) => s["@type"] === "SoftwareApplication",
      );

      expect(appSchema).toBeDefined();
      expect(appSchema!["name"]).toBe("SafeTrekr");
      expect(appSchema!["applicationCategory"]).toBe("BusinessApplication");

      // Verify AggregateOffer
      const offers = appSchema!["offers"] as Record<string, unknown>;
      expect(offers["@type"]).toBe("AggregateOffer");
      expect(offers["priceCurrency"]).toBe("USD");
      expect(offers["lowPrice"]).toBe("450");
      expect(offers["highPrice"]).toBe("1250");
    });
  });

  // -----------------------------------------------------------------------
  // Pricing Page
  // -----------------------------------------------------------------------
  test.describe("Pricing Page", () => {
    test("contains Product schema with Offers", async ({ page }) => {
      await page.goto("/pricing");

      const schemas = await getJsonLdObjects(page);
      const productSchema = schemas.find(
        (s) => s["@type"] === "Product",
      );

      expect(productSchema).toBeDefined();
      expect(productSchema!["name"]).toContain("SafeTrekr");

      // Verify offers array
      const offers = productSchema!["offers"] as Array<Record<string, unknown>>;
      expect(offers).toHaveLength(3);

      // Field Trip
      expect(offers[0]!["name"]).toBe("Field Trip");
      expect(offers[0]!["price"]).toBe("450");

      // Extended Trip
      expect(offers[1]!["name"]).toBe("Extended Trip");
      expect(offers[1]!["price"]).toBe("750");

      // International
      expect(offers[2]!["name"]).toBe("International");
      expect(offers[2]!["price"]).toBe("1250");
    });

    test("contains FAQPage schema", async ({ page }) => {
      await page.goto("/pricing");

      const schemas = await getJsonLdObjects(page);
      const faqSchema = schemas.find(
        (s) => s["@type"] === "FAQPage",
      );

      expect(faqSchema).toBeDefined();

      const mainEntity = faqSchema!["mainEntity"] as Array<
        Record<string, unknown>
      >;
      expect(mainEntity.length).toBeGreaterThanOrEqual(5);

      // Verify first FAQ item structure
      expect(mainEntity[0]!["@type"]).toBe("Question");
      expect(mainEntity[0]!["name"]).toBeTruthy();
      expect(mainEntity[0]!["acceptedAnswer"]).toBeDefined();
    });

    test("contains BreadcrumbList schema", async ({ page }) => {
      await page.goto("/pricing");

      const schemas = await getJsonLdObjects(page);
      const breadcrumbSchema = schemas.find(
        (s) => s["@type"] === "BreadcrumbList",
      );

      expect(breadcrumbSchema).toBeDefined();

      const items = breadcrumbSchema!["itemListElement"] as Array<
        Record<string, unknown>
      >;
      expect(items.length).toBeGreaterThanOrEqual(2);

      // First item should be Home
      expect(items[0]!["name"]).toBe("Home");
    });
  });

  // -----------------------------------------------------------------------
  // Solutions Pages
  // -----------------------------------------------------------------------
  test.describe("Solutions Pages", () => {
    test("Solutions overview has JSON-LD structured data", async ({
      page,
    }) => {
      await page.goto("/solutions");

      const jsonLdScripts = page.locator(
        'script[type="application/ld+json"]',
      );
      const count = await jsonLdScripts.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test("all JSON-LD blocks are valid JSON", async ({ page }) => {
      const pages = ["/", "/pricing", "/solutions"];

      for (const path of pages) {
        await page.goto(path);

        const scripts = await page
          .locator('script[type="application/ld+json"]')
          .allTextContents();

        for (const script of scripts) {
          // Should not throw when parsing
          expect(() => JSON.parse(script)).not.toThrow();

          const parsed = JSON.parse(script) as Record<string, unknown>;
          // Every JSON-LD object should have @context or @type
          const hasContext = "@context" in parsed;
          const hasType = "@type" in parsed;
          expect(hasContext || hasType).toBe(true);
        }
      }
    });
  });
});
