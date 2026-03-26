/**
 * ST-867: REQ-062 -- Structured Data (JSON-LD) Generators
 *
 * ST-902 VERIFIED: JsonLd injection component exists and is fully functional.
 * ST-903 VERIFIED: generateOrganizationSchema exists and is rendered in root
 * layout (src/app/layout.tsx). Both requirements satisfied by this module.
 *
 * Schema.org JSON-LD generators for the SafeTrekr marketing site. Each
 * function returns a plain object that conforms to a specific schema.org
 * type. The companion {@link JsonLd} React component serialises any of
 * these objects into a `<script type="application/ld+json">` tag for
 * search-engine consumption.
 *
 * All schema shapes follow the latest schema.org specifications:
 * https://schema.org/
 *
 * @example
 * ```tsx
 * // app/layout.tsx (or any page)
 * import { JsonLd, generateOrganizationSchema } from "@/lib/structured-data";
 *
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <JsonLd data={generateOrganizationSchema()} />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */

import type { ReactElement } from "react";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SITE_URL = "https://safetrekr.com" as const;
const SITE_NAME = "SafeTrekr" as const;

// ---------------------------------------------------------------------------
// Shared Types
// ---------------------------------------------------------------------------

/**
 * A generic JSON-LD thing. Intentionally broad -- each generator function
 * returns a narrower shape, but the {@link JsonLd} component accepts any
 * valid JSON-LD structure.
 */
export type JsonLdData = Record<string, unknown>;

// ---------------------------------------------------------------------------
// Organization Schema
// ---------------------------------------------------------------------------

/**
 * Generates a schema.org `Organization` object for SafeTrekr.
 *
 * Includes the company name, URL, logo, description, and a customer
 * service contact point. Rendered once (typically in the root layout)
 * so Google can populate the Knowledge Panel.
 *
 * @see https://schema.org/Organization
 */
export function generateOrganizationSchema(): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/safetrekr-logo.png`,
    description:
      "Professional travel safety planning platform delivering trip safety documentation for organizations that take duty of care seriously.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: `${SITE_URL}/contact`,
    },
  };
}

// ---------------------------------------------------------------------------
// FAQ Schema
// ---------------------------------------------------------------------------

/** A single question/answer pair for the FAQ schema. */
export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Generates a schema.org `FAQPage` from an array of Q&A pairs.
 *
 * Useful on pricing, product, and support pages where frequently asked
 * questions are displayed. Google may render these directly in SERPs
 * as rich results.
 *
 * @param items - Array of question/answer objects.
 * @see https://schema.org/FAQPage
 */
export function generateFAQSchema(items: FAQItem[]): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// HowTo Schema
// ---------------------------------------------------------------------------

/** A single step in a HowTo schema. */
export interface HowToStep {
  name: string;
  text: string;
}

/**
 * Generates a schema.org `HowTo` object from a series of steps.
 *
 * Applies to onboarding guides, "how it works" sections, or any
 * sequential instruction content.
 *
 * @param steps - Ordered array of step objects.
 * @see https://schema.org/HowTo
 */
export function generateHowToSchema(steps: HowToStep[]): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${SITE_NAME}`,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

// ---------------------------------------------------------------------------
// Breadcrumb Schema
// ---------------------------------------------------------------------------

/** A single breadcrumb item with display name and URL. */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generates a schema.org `BreadcrumbList` for navigation trail markup.
 *
 * Each item in the list becomes a `ListItem` with an incrementing
 * `position`. Pass the items in visual display order (Home first).
 *
 * @param items - Ordered array of breadcrumb items.
 * @see https://schema.org/BreadcrumbList
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ---------------------------------------------------------------------------
// Article Schema
// ---------------------------------------------------------------------------

/** Input for the Article schema generator. */
export interface ArticleSchemaInput {
  /** Article headline / title. */
  headline: string;
  /** Short description / excerpt. */
  description: string;
  /** ISO 8601 date string for publication date (e.g., "2026-03-20"). */
  datePublished: string;
  /** ISO 8601 date string for last modification. Defaults to datePublished. */
  dateModified?: string;
  /** Author full name. */
  authorName: string;
  /** Author job title / role. */
  authorTitle?: string;
  /** URL path segment for the article (e.g., "/blog/my-post"). */
  path: string;
  /** Article section / category name (e.g., "K-12 Compliance"). */
  section?: string;
  /** Approximate word count of the article body. */
  wordCount?: number;
}

/**
 * ST-913: Generates a schema.org `Article` JSON-LD object for blog posts.
 *
 * Includes author (Person), publisher (Organization), headline,
 * dates, description, word count, and article section. Designed to
 * produce rich results in Google SERPs.
 *
 * @param input - Article metadata from the blog post frontmatter.
 * @see https://schema.org/Article
 *
 * @example
 * ```tsx
 * <JsonLd data={generateArticleSchema({
 *   headline: "Do Liability Waivers Actually Protect Schools?",
 *   description: "A look at what courts have ruled...",
 *   datePublished: "2026-03-20",
 *   authorName: "Sarah Chen",
 *   authorTitle: "Safety Analyst",
 *   path: "/blog/school-field-trip-liability-waivers",
 *   section: "K-12 Compliance",
 *   wordCount: 2400,
 * })} />
 * ```
 */
export function generateArticleSchema(input: ArticleSchemaInput): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      "@type": "Person",
      name: input.authorName,
      ...(input.authorTitle ? { jobTitle: input.authorTitle } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/safetrekr-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${input.path}`,
    },
    ...(input.wordCount ? { wordCount: input.wordCount } : {}),
    ...(input.section ? { articleSection: input.section } : {}),
  };
}

// ---------------------------------------------------------------------------
// SoftwareApplication Schema
// ---------------------------------------------------------------------------

/**
 * Generates a schema.org `SoftwareApplication` object for SafeTrekr.
 *
 * Includes an `AggregateOffer` with the current pricing range
 * ($450 -- $1,250). Update the price values here when pricing changes.
 *
 * @see https://schema.org/SoftwareApplication
 * @see https://schema.org/AggregateOffer
 */
export function generateSoftwareApplicationSchema(): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Professional travel safety planning platform delivering trip safety documentation for organizations that take duty of care seriously.",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "450",
      highPrice: "1250",
      offerCount: "3",
    },
  };
}

// ---------------------------------------------------------------------------
// VideoObject Schema
// ---------------------------------------------------------------------------

/** Input for the VideoObject schema generator. */
export interface VideoObjectOptions {
  /** Video title / name. */
  name: string;
  /** Short description of the video content. */
  description: string;
  /** URL of the video thumbnail image. */
  thumbnailUrl: string;
  /** ISO 8601 date string for when the video was uploaded (e.g., "2026-03-20"). */
  uploadDate: string;
  /** ISO 8601 duration of the video (e.g., "PT5M30S" for 5 minutes 30 seconds). */
  duration: string;
  /** Direct URL to the video media file. */
  contentUrl: string;
  /** URL of an embeddable player for the video. */
  embedUrl?: string;
}

/**
 * ST-884: Generates a schema.org `VideoObject` JSON-LD object.
 *
 * Produces structured data that enables Google rich results for video
 * content (video carousel, video snippets in SERPs). Only render this
 * schema when the page contains real, user-visible video content --
 * do **not** generate it for placeholder or decorative media.
 *
 * @param options - Video metadata describing the content.
 * @see https://schema.org/VideoObject
 * @see https://developers.google.com/search/docs/appearance/structured-data/video
 *
 * @example
 * ```tsx
 * <JsonLd data={generateVideoObjectSchema({
 *   name: "SafeTrekr Platform Overview",
 *   description: "See how SafeTrekr delivers professional trip safety planning.",
 *   thumbnailUrl: "https://safetrekr.com/images/video-thumb-overview.jpg",
 *   uploadDate: "2026-03-15",
 *   duration: "PT2M45S",
 *   contentUrl: "https://safetrekr.com/videos/platform-overview.mp4",
 *   embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
 * })} />
 * ```
 */
export function generateVideoObjectSchema(
  options: VideoObjectOptions,
): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: options.name,
    description: options.description,
    thumbnailUrl: options.thumbnailUrl,
    uploadDate: options.uploadDate,
    duration: options.duration,
    contentUrl: options.contentUrl,
    ...(options.embedUrl ? { embedUrl: options.embedUrl } : {}),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/safetrekr-logo.png`,
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Review Schema
// ---------------------------------------------------------------------------

/** Input for a single review in the Review schema generator. */
export interface ReviewSchemaInput {
  /** Full name of the reviewer (must be a real person). */
  authorName: string;
  /** Organization the reviewer belongs to. */
  authorOrganization: string;
  /** The review text/testimonial. */
  reviewBody: string;
  /** Rating value (1-5). */
  ratingValue: number;
  /** Maximum rating value. @default 5 */
  bestRating?: number;
}

/**
 * ST-885: Generates a schema.org `Review` JSON-LD array for SafeTrekr
 * customer testimonials.
 *
 * Returns an `@graph` containing one `Review` node per input entry.
 * Each review references SafeTrekr as the `itemReviewed`
 * (`SoftwareApplication`) and includes an author (`Person`),
 * `reviewBody`, and `reviewRating` (`Rating`).
 *
 * **WARNING: Only render with verified, real testimonials. Never use
 * placeholder names.** The CI pipeline (`scripts/check-placeholder-names.mjs`)
 * blocks common placeholder names automatically. All testimonials must
 * come from real, consenting customers.
 *
 * @param reviews - Array of verified review/testimonial objects.
 * @see https://schema.org/Review
 * @see https://schema.org/Rating
 *
 * @example
 * ```tsx
 * <JsonLd data={generateReviewSchema([
 *   {
 *     authorName: "Maria Gonzalez",
 *     authorOrganization: "Westlake Academy",
 *     reviewBody: "SafeTrekr transformed how we manage travel risk for student trips.",
 *     ratingValue: 5,
 *   },
 * ])} />
 * ```
 */
export function generateReviewSchema(reviews: ReviewSchemaInput[]): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@graph": reviews.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.authorName,
        ...(review.authorOrganization
          ? {
              affiliation: {
                "@type": "Organization",
                name: review.authorOrganization,
              },
            }
          : {}),
      },
      reviewBody: review.reviewBody,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.ratingValue,
        bestRating: review.bestRating ?? 5,
      },
      itemReviewed: {
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        url: SITE_URL,
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// JsonLd Component
// ---------------------------------------------------------------------------

/** Props for the {@link JsonLd} component. */
interface JsonLdProps {
  /** A structured data object returned by any of the generator functions. */
  data: JsonLdData;
}

/**
 * Renders a `<script type="application/ld+json">` tag containing the
 * serialised JSON-LD structured data.
 *
 * This is a Server Component-compatible function component -- it produces
 * a static `<script>` tag with no client-side interactivity.
 *
 * @example
 * ```tsx
 * <JsonLd data={generateOrganizationSchema()} />
 * <JsonLd data={generateFAQSchema(faqItems)} />
 * ```
 */
export function JsonLd({ data }: JsonLdProps): ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
