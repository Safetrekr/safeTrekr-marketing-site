/**
 * ST-843: Lighthouse CI Configuration (REQ-103)
 *
 * Automated performance, accessibility, best-practices, and SEO auditing
 * for all core marketing pages.
 *
 * Assertion thresholds:
 * - Performance:    >= 90
 * - Accessibility:  >= 95
 * - Best Practices: >= 90
 * - SEO:            >= 95
 *
 * Run with: npm run lighthouse  (or npx lhci autorun)
 */
module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/about",
        "http://localhost:3000/how-it-works",
        "http://localhost:3000/pricing",
        "http://localhost:3000/solutions",
        "http://localhost:3000/solutions/k12",
        "http://localhost:3000/solutions/churches",
        "http://localhost:3000/solutions/higher-education",
        "http://localhost:3000/solutions/corporate",
        "http://localhost:3000/blog",
        "http://localhost:3000/contact",
        "http://localhost:3000/demo",
        "http://localhost:3000/legal/privacy",
        "http://localhost:3000/legal/terms",
      ],
      startServerCommand: "npm run build && npm run start",
      startServerReadyPattern: "Ready in",
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.95 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
