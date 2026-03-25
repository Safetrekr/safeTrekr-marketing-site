/**
 * ST-917: Content Freshness Signals
 *
 * Centralised registry of "last updated" dates for key pages. Provides
 * a formatting helper that produces human-readable date strings and
 * machine-readable ISO date attributes for SEO `<time>` elements.
 *
 * Dates are hardcoded for now. In the future these can be derived from
 * git commit timestamps, CMS metadata, or a build-time script.
 *
 * @example
 * ```tsx
 * import { getLastUpdated, formatLastUpdated } from "@/lib/content-freshness";
 *
 * const date = getLastUpdated("/legal/privacy");
 * // => { iso: "2026-03-15", display: "Last updated: March 15, 2026" }
 *
 * <time dateTime={date.iso}>{date.display}</time>
 * ```
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FreshnessDate {
  /** ISO 8601 date string for the `dateTime` attribute (e.g., "2026-03-15"). */
  iso: string;
  /** Human-readable display string (e.g., "Last updated: March 15, 2026"). */
  display: string;
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

/**
 * Last-updated dates keyed by URL path.
 *
 * Add new entries here as pages are created or updated.
 * Dates use ISO 8601 format (YYYY-MM-DD).
 */
const PAGE_DATES: Record<string, string> = {
  "/legal/privacy": "2026-03-15",
  "/legal/terms": "2026-03-15",
  "/legal/dpa": "2026-03-15",
  "/about": "2026-03-24",
  "/how-it-works": "2026-03-20",
  "/pricing": "2026-03-18",
  "/solutions/k12": "2026-03-20",
  "/solutions/higher-education": "2026-03-20",
  "/solutions/churches": "2026-03-20",
  "/solutions/corporate": "2026-03-20",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Formats an ISO date string into a human-readable format.
 *
 * @param isoDate - ISO 8601 date string (e.g., "2026-03-15").
 * @returns Formatted string (e.g., "March 15, 2026").
 */
function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns the last-updated date for a given page path.
 *
 * @param path - The URL path of the page (e.g., "/legal/privacy").
 * @returns A `FreshnessDate` object with ISO and display strings,
 *          or `null` if no date is registered for the path.
 */
export function getLastUpdated(path: string): FreshnessDate | null {
  const isoDate = PAGE_DATES[path];

  if (!isoDate) {
    return null;
  }

  return {
    iso: isoDate,
    display: `Last updated: ${formatDate(isoDate)}`,
  };
}

/**
 * Convenience function that returns only the display string.
 *
 * @param path - The URL path of the page.
 * @returns The formatted "Last updated: ..." string, or `null`.
 */
export function formatLastUpdated(path: string): string | null {
  return getLastUpdated(path)?.display ?? null;
}

/**
 * Returns all registered page paths and their freshness dates.
 * Useful for sitemap generation or build-time validation.
 */
export function getAllPageDates(): Record<string, FreshnessDate> {
  const result: Record<string, FreshnessDate> = {};

  for (const [path, isoDate] of Object.entries(PAGE_DATES)) {
    result[path] = {
      iso: isoDate,
      display: `Last updated: ${formatDate(isoDate)}`,
    };
  }

  return result;
}
