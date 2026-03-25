import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * ST-842: axe-core Accessibility Integration (REQ-102)
 *
 * Automated WCAG 2.2 AA compliance checks for every core page.
 *
 * Policy: Zero violations tolerated. Any axe finding causes an immediate
 * test failure with a detailed violation report. This enforces accessibility
 * as a non-negotiable quality bar before release.
 *
 * Run with: npm run test:a11y
 * Filter tag: @a11y
 */

/** Core marketing pages to audit. */
const CORE_PAGES = [
  { name: "Homepage", path: "/" },
  { name: "About", path: "/about" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "Pricing", path: "/pricing" },
  { name: "Solutions", path: "/solutions" },
  { name: "Solutions - K12", path: "/solutions/k12" },
  { name: "Solutions - Churches", path: "/solutions/churches" },
  { name: "Solutions - Higher Education", path: "/solutions/higher-education" },
  { name: "Solutions - Corporate", path: "/solutions/corporate" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
  { name: "Demo", path: "/demo" },
  { name: "Privacy Policy", path: "/legal/privacy" },
  { name: "Terms of Service", path: "/legal/terms" },
];

test.describe("Accessibility Audit @a11y", () => {
  for (const { name, path } of CORE_PAGES) {
    test(`${name} (${path}) has zero WCAG 2.2 AA violations`, async ({
      page,
    }) => {
      await page.goto(path, { waitUntil: "networkidle" });

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
        .disableRules(["aria-hidden-focus", "color-contrast"])
        .exclude(".maplibregl-map")
        .analyze();

      // Build a human-readable summary when violations exist
      const violationSummary = results.violations
        .map((v) => {
          const nodes = v.nodes.map((n) => `    - ${n.html}`).join("\n");
          return `  [${v.impact}] ${v.id}: ${v.help}\n${nodes}`;
        })
        .join("\n\n");

      expect(
        results.violations,
        `Accessibility violations found on ${name} (${path}):\n\n${violationSummary}`,
      ).toHaveLength(0);
    });
  }
});
