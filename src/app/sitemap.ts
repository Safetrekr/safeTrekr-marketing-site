/**
 * Dynamic XML sitemap (served at /sitemap.xml).
 *
 * Replaces the previously hand-maintained public/sitemap.xml. Static marketing
 * routes are listed explicitly; the two content types that grow over time
 * (glossary terms and blog posts) are derived from their canonical data
 * sources so new entries appear automatically without editing this file.
 *
 * `lastModified` is a real freshness signal:
 *   - Blog posts use their frontmatter `date`.
 *   - Static marketing pages use CONTENT_REVIEWED below. Per Google's sitemap
 *     guidance, lastmod should reflect genuine content changes -- so bump
 *     CONTENT_REVIEWED when you meaningfully revise the static pages, rather
 *     than letting every build stamp "now" on unchanged URLs.
 *
 * @see src/content/glossary.ts  -- getAllGlossarySlugs()
 * @see src/lib/blog.ts          -- getAllPosts()
 */

import type { MetadataRoute } from "next";

import { getAllGlossarySlugs } from "@/content/glossary";
import { getAllPosts } from "@/lib/blog";

const SITE_URL = "https://safetrekr.com" as const;

/**
 * Date the static marketing pages were last reviewed/updated. Bump this when
 * you ship a meaningful content change to those pages.
 */
const CONTENT_REVIEWED = new Date("2026-11-10");

type SitemapEntry = MetadataRoute.Sitemap[number];
type ChangeFrequency = NonNullable<SitemapEntry["changeFrequency"]>;

function entry(
  path: string,
  priority: number,
  changeFrequency: ChangeFrequency = "monthly",
  lastModified: Date = CONTENT_REVIEWED,
): SitemapEntry {
  return {
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Core pages
  const core: SitemapEntry[] = [
    entry("/", 1.0, "weekly"),
    entry("/pricing", 0.9),
    entry("/how-it-works", 0.9),
    entry("/about", 0.8),
    entry("/contact", 0.7),
    entry("/demo", 0.9),
    entry("/security", 0.6),
  ];

  // Platform
  const platform: SitemapEntry[] = [
    entry("/platform", 0.8),
    entry("/platform/analyst-review", 0.8),
    entry("/platform/risk-intelligence", 0.8),
    entry("/platform/safety-binder", 0.8),
  ];

  // Solutions by organization
  const solutions: SitemapEntry[] = [
    entry("/solutions", 0.8),
    entry("/solutions/k12", 0.8),
    entry("/solutions/higher-education", 0.8),
    entry("/solutions/churches", 0.8),
    entry("/solutions/corporate", 0.8),
  ];

  // Resources
  const resources: SitemapEntry[] = [
    entry("/resources", 0.6),
    entry("/resources/faq", 0.7),
    entry("/resources/glossary", 0.6),
    entry("/resources/sample-binders", 0.7),
    entry("/resources/roi-calculator", 0.7),
  ];

  // Glossary terms (derived from content)
  const glossary: SitemapEntry[] = getAllGlossarySlugs().map((slug) =>
    entry(`/resources/glossary/${slug}`, 0.5),
  );

  // Blog index + posts (derived from content, real publish dates)
  const blog: SitemapEntry[] = [
    entry("/blog", 0.7, "weekly"),
    ...getAllPosts().map((post) =>
      entry(`/blog/${post.slug}`, 0.6, "monthly", new Date(post.date)),
    ),
  ];

  // Compliance guides
  const compliance: SitemapEntry[] = [
    entry("/compliance/ferpa", 0.6),
    entry("/compliance/clery-act", 0.6),
    entry("/compliance/duty-of-care", 0.6),
  ];

  // Comparison pages
  const compare: SitemapEntry[] = [
    entry("/compare/spreadsheet-checklists", 0.6),
    entry("/compare/logistics-apps", 0.6),
    entry("/compare/enterprise-risk-platforms", 0.6),
  ];

  // Legal (lower priority, rarely changes)
  const legal: SitemapEntry[] = [
    entry("/legal/privacy", 0.3, "yearly"),
    entry("/legal/terms", 0.3, "yearly"),
    entry("/legal/eula", 0.3, "yearly"),
    entry("/legal/purchase-terms", 0.3, "yearly"),
  ];

  return [
    ...core,
    ...platform,
    ...solutions,
    ...resources,
    ...glossary,
    ...blog,
    ...compliance,
    ...compare,
    ...legal,
  ];
}
