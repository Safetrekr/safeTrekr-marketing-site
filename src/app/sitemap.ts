/**
 * ST-897: Programmatic Sitemap
 *
 * Next.js App Router sitemap generation. Exports a default async function
 * that returns a MetadataRoute.Sitemap array. Next.js compiles this into
 * /sitemap.xml at build time (or on-demand in dev).
 *
 * All 15 static routes are listed with:
 * - lastModified: date of most recent meaningful content change
 * - changeFrequency: 'weekly' for content pages, 'monthly' for legal
 * - priority: 1.0 homepage, 0.9 solutions/pricing/demo, 0.8 features,
 *             0.7 blog/contact/resources, 0.5 legal
 *
 * When dynamic routes (e.g., /blog/[slug]) are added, extend this function
 * to query the CMS and append entries programmatically.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import type { MetadataRoute } from "next";

const BASE_URL = "https://safetrekr.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  return [
    // -----------------------------------------------------------------------
    // Homepage -- priority 1.0
    // -----------------------------------------------------------------------
    {
      url: `${BASE_URL}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },

    // -----------------------------------------------------------------------
    // Solutions & conversion pages -- priority 0.9
    // -----------------------------------------------------------------------
    {
      url: `${BASE_URL}/solutions`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/solutions/k12`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/solutions/churches`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/solutions/corporate`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/solutions/higher-education`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/demo`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // -----------------------------------------------------------------------
    // Feature / info pages -- priority 0.8
    // -----------------------------------------------------------------------
    {
      url: `${BASE_URL}/how-it-works`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    // -----------------------------------------------------------------------
    // Blog, resources, contact -- priority 0.7
    // -----------------------------------------------------------------------
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/resources`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },

    // -----------------------------------------------------------------------
    // Legal pages -- priority 0.5
    // -----------------------------------------------------------------------
    {
      url: `${BASE_URL}/legal/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/legal/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
