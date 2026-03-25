/**
 * ST-867: REQ-062 -- Page Metadata Utility
 *
 * ST-907 VERIFIED: Every page.tsx in the site exports metadata via this
 * function. Audit confirmed coverage across all 13 page routes (homepage,
 * 4 solutions pages, solutions overview, pricing, how-it-works, about,
 * contact, demo, legal/privacy, legal/terms) plus the root layout.
 *
 * Centralised metadata generation for every page on the SafeTrekr marketing
 * site. Enforces a consistent title template, canonical URL structure, Open
 * Graph tags, and Twitter card configuration so each route only needs to
 * declare what is unique about it.
 *
 * This module exports a pure function that returns a Next.js `Metadata`
 * object -- no runtime cost, no side-effects, Server Component safe.
 *
 * @example
 * ```ts
 * // app/pricing/page.tsx
 * import { generatePageMetadata } from "@/lib/metadata";
 *
 * export const metadata = generatePageMetadata({
 *   title: "Pricing",
 *   description: "Transparent pricing for teams of every size.",
 *   path: "/pricing",
 * });
 * ```
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */

import type { Metadata } from "next";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Production origin used for canonical URLs and OG metadata. */
const SITE_URL = "https://safetrekr.com" as const;

/** Brand name appended to every page title via the template. */
const SITE_NAME = "SafeTrekr" as const;

/** Fallback Open Graph image when a page does not supply its own. */
const DEFAULT_OG_IMAGE = "/images/og-default.png" as const;

/** Twitter handle for the site-wide `twitter:site` tag. */
const TWITTER_HANDLE = "@safetrekr" as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Options accepted by {@link generatePageMetadata}.
 *
 * Only `title`, `description`, and `path` are required. Everything else
 * has sensible defaults that can be overridden per page.
 */
export interface PageMetadataOptions {
  /** Page-specific title. Rendered as "{title} | SafeTrekr". */
  title: string;

  /** Meta description for search engine result pages (SERPs). */
  description: string;

  /**
   * URL path segment (must start with `/`).
   * Combined with the site origin to produce the canonical URL.
   *
   * @example "/pricing"
   */
  path: string;

  /**
   * Custom Open Graph image path or absolute URL.
   * Falls back to {@link DEFAULT_OG_IMAGE} when omitted.
   *
   * @default "/images/og-default.png"
   */
  ogImage?: string;

  /**
   * When `true`, instructs search engines not to index this page.
   * Useful for staging pages, gated content, or temporary routes.
   *
   * @default false
   */
  noIndex?: boolean;
}

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

/**
 * Generates a fully-populated Next.js `Metadata` object from a slim set of
 * page-level options.
 *
 * Handles:
 * - Title template (`{title} | SafeTrekr`)
 * - Canonical URL derivation from `path`
 * - Open Graph tags (title, description, URL, site name, type, images)
 * - Twitter card configuration (summary_large_image)
 * - Optional `noindex` robots directive
 *
 * @param options - Page-specific metadata values.
 * @returns A Next.js `Metadata` object ready for export from a page or layout.
 */
export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const { title, description, path, ogImage, noIndex = false } = options;

  const canonicalUrl = `${SITE_URL}${path}`;
  const resolvedOgImage = ogImage ?? DEFAULT_OG_IMAGE;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: resolvedOgImage,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
    },

    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}
