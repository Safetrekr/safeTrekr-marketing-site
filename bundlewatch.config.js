/**
 * ST-868: REQ-115 -- Performance Budget CI Gates
 *
 * Bundlewatch configuration for enforcing bundle size limits in CI.
 * All thresholds are gzipped sizes.
 *
 * Limits:
 * - Max total JS:           150KB gzipped
 * - Max total CSS:           50KB gzipped
 * - Max individual chunk:   100KB gzipped
 *
 * Usage:
 *   npm run bundlewatch
 *
 * @see https://bundlewatch.io
 */

module.exports = {
  files: [
    // ---------------------------------------------------------------------------
    // JavaScript bundles (Next.js output)
    // ---------------------------------------------------------------------------
    {
      path: ".next/static/chunks/**/*.js",
      maxSize: "100KB",
      compression: "gzip",
    },
    {
      path: ".next/static/**/*.js",
      maxSize: "150KB",
      compression: "gzip",
    },

    // ---------------------------------------------------------------------------
    // CSS bundles
    // ---------------------------------------------------------------------------
    {
      path: ".next/static/css/**/*.css",
      maxSize: "50KB",
      compression: "gzip",
    },

    // ---------------------------------------------------------------------------
    // Individual chunk limit
    // ---------------------------------------------------------------------------
    {
      path: ".next/static/chunks/*.js",
      maxSize: "100KB",
      compression: "gzip",
    },
  ],

  // CI configuration
  ci: {
    trackBranches: ["main"],
    repoBranchBase: "main",
  },

  // Default compression for all entries
  defaultCompression: "gzip",
};
