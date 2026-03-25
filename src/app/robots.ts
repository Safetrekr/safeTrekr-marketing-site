/**
 * ST-899: Robots.txt with AI Crawler Allowances
 *
 * Next.js App Router robots.txt generation. Exports a default function
 * that returns a MetadataRoute.Robots object. Next.js compiles this into
 * /robots.txt at build time (or on-demand in dev).
 *
 * Strategy:
 * 1. Allow all standard crawlers on / by default.
 * 2. Disallow sensitive paths: /api/, /admin/, /_next/, /preview/, /lp/.
 * 3. EXPLICITLY allow AI/LLM crawlers so they can index SafeTrekr content
 *    for generative search results (AEO/GEO/LLMO strategy).
 * 4. Reference the programmatic sitemap for discovery.
 *
 * AI crawlers granted explicit access:
 * - GPTBot (OpenAI)
 * - Google-Extended (Gemini / Bard)
 * - PerplexityBot (Perplexity AI)
 * - ClaudeBot (Anthropic)
 * - Amazonbot (Alexa / Amazon)
 * - Applebot-Extended (Apple Intelligence / Siri)
 * - cohere-ai (Cohere)
 * - anthropic-ai (Anthropic secondary)
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import type { MetadataRoute } from "next";

const DISALLOWED_PATHS = ["/api/", "/admin/", "/_next/", "/preview/", "/lp/"];

/**
 * AI crawler user-agents that should receive explicit Allow directives.
 * Each gets its own rules block so they are unambiguously permitted to
 * crawl all public content.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "Google-Extended",
  "PerplexityBot",
  "ClaudeBot",
  "Amazonbot",
  "Applebot-Extended",
  "cohere-ai",
  "anthropic-ai",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // -----------------------------------------------------------------
      // Default rule: allow everything except sensitive paths
      // -----------------------------------------------------------------
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },

      // -----------------------------------------------------------------
      // Explicit AI crawler allowances
      // Each AI bot gets a dedicated rule with full Allow: / to ensure
      // no inherited Disallow from wildcard rules can block them.
      // -----------------------------------------------------------------
      ...AI_CRAWLERS.map((bot) => ({
        userAgent: bot,
        allow: "/",
      })),
    ],
    sitemap: "https://safetrekr.com/sitemap.xml",
  };
}
