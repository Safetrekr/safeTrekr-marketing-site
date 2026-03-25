import { defineConfig, devices } from "@playwright/test";

/**
 * ST-838: Playwright Configuration (REQ-101)
 *
 * End-to-end test runner for the SafeTrekr marketing site.
 *
 * Key decisions:
 * - 6 browser projects covering desktop (Chromium, Firefox, WebKit),
 *   mobile (Chrome, Safari), and Microsoft Edge
 * - Auto-starts the dev server via webServer config
 * - Retries on CI (2) to reduce flakiness; zero retries locally for fast feedback
 * - HTML reporter for rich, shareable test results
 * - Screenshots captured only on failure to keep artifacts lean
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 12"] },
    },
    {
      name: "microsoft-edge",
      use: { ...devices["Desktop Edge"], channel: "msedge" },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
