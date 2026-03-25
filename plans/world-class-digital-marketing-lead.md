# Digital Marketing Lead PRD: SafeTrekr Marketing Site

**Date**: 2026-03-24
**Persona**: World-Class Digital Marketing Lead / AI Search Optimization Strategist
**Project**: SafeTrekr Marketing Site (Greenfield)
**Tech Stack**: Next.js 15 (App Router) + React 19 + Tailwind CSS 4 + DigitalOcean DOKS + SendGrid
**Deployment**: Docker containers on DigitalOcean Kubernetes (DOKS) with Nginx Ingress
**Status**: Persona-Specific PRD -- Implementation-Ready Functional Requirements

---

## Document Purpose

This PRD defines every functional requirement owned by the Digital Marketing Lead persona. It covers technical SEO infrastructure, structured data (JSON-LD), AI search optimization, content marketing systems, analytics, email capture and nurture, social proof, paid acquisition readiness, and performance monitoring. Every FR includes acceptance criteria, implementation guidance, and dependency mapping.

All requirements are written against the confirmed tech stack: Next.js 15 standalone output in Docker on DigitalOcean Kubernetes, Nginx Ingress for SSL termination and caching, Plausible Analytics (primary), SendGrid for transactional and nurture email, and Cloudflare for DNS/CDN.

---

## Table of Contents

1. [Technical SEO Infrastructure](#1-technical-seo-infrastructure)
2. [Schema Markup (JSON-LD)](#2-schema-markup-json-ld)
3. [AI Search Optimization](#3-ai-search-optimization)
4. [Content Marketing System](#4-content-marketing-system)
5. [Analytics Infrastructure](#5-analytics-infrastructure)
6. [Email Capture and Nurture](#6-email-capture-and-nurture)
7. [Social Proof System](#7-social-proof-system)
8. [Paid Acquisition Readiness](#8-paid-acquisition-readiness)
9. [Performance Monitoring](#9-performance-monitoring)
10. [Dependencies and Sequencing](#10-dependencies-and-sequencing)
11. [Metrics and Targets](#11-metrics-and-targets)
12. [Risks](#12-risks)

---

## 1. Technical SEO Infrastructure

### FR-SEO-001: Programmatic Sitemap Generation

**Priority**: P0 (Launch Blocker)
**Depends On**: Next.js 15 App Router setup, MDX content pipeline

**Description**: Dynamic XML sitemap generated at build time via `/app/sitemap.ts`. Must include all static marketing pages with manually assigned priorities, all MDX blog posts with `lastModified` from frontmatter, and all MDX guide pages. Sitemap is submitted to Google Search Console and referenced in `robots.txt`.

**Acceptance Criteria**:

- [ ] `/sitemap.xml` returns valid XML with all published URLs
- [ ] Static core pages include `changeFrequency` and `priority` values matching the defined hierarchy (homepage 1.0, solutions/pricing/how-it-works 0.9, platform features 0.7-0.8, blog 0.7, company 0.5-0.6)
- [ ] Blog posts are dynamically included with `lastModified` derived from `updatedAt` or `publishedAt` frontmatter
- [ ] Guide pages under `/resources/guides/` are dynamically included
- [ ] No draft or unpublished content appears in the sitemap
- [ ] Sitemap URL matches `https://www.safetrekr.com/sitemap.xml`
- [ ] Lighthouse SEO audit passes sitemap validation
- [ ] Sitemap regenerates on every Docker image build (build-time generation)

**Implementation Notes**:

```typescript
// /app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllBlogPosts, getAllGuides } from '@/lib/content';

const BASE_URL = 'https://www.safetrekr.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const corePages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    // Solutions (highest conversion value)
    { url: `${BASE_URL}/solutions/k12`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/solutions/churches`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/solutions/higher-education`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/solutions/corporate`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    // Core conversion pages
    { url: `${BASE_URL}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/demo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Platform features
    { url: `${BASE_URL}/platform`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/platform/analyst-review`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/platform/risk-intelligence`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/platform/safety-binder`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Resources
    { url: `${BASE_URL}/resources`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/resources/faq`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/resources/roi-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/resources/sample-binders`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    // Company
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/security`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/procurement`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    // Blog index
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  ];

  const blogPosts = await getAllBlogPosts();
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const guides = await getAllGuides();
  const guideEntries: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${BASE_URL}/resources/guides/${guide.slug}`,
    lastModified: new Date(guide.updatedAt || guide.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...corePages, ...blogEntries, ...guideEntries];
}
```

---

### FR-SEO-002: Robots.txt with AI Crawler Allowances

**Priority**: P0 (Launch Blocker)
**Depends On**: Next.js 15 App Router setup

**Description**: Programmatic `robots.txt` via `/app/robots.ts` that explicitly allows all major AI crawlers. This is the first-mover advantage: no competitor in SafeTrekr's niche has structured content for AI answer engines. Explicitly allowing GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Amazonbot, Applebot-Extended, ChatGPT-User, and cohere-ai gives SafeTrekr maximum discoverability across all AI platforms.

**Acceptance Criteria**:

- [ ] `/robots.txt` is accessible and returns valid directives
- [ ] Default user-agent allows `/` and disallows `/admin/`, `/api/`, `/lp/`, `/_next/`, `/private/`
- [ ] Each AI crawler (GPTBot, Google-Extended, PerplexityBot, ClaudeBot, Amazonbot, ChatGPT-User, Applebot-Extended, cohere-ai) has an explicit `Allow: /` rule
- [ ] Sitemap URL is referenced: `Sitemap: https://www.safetrekr.com/sitemap.xml`
- [ ] Paid landing pages (`/lp/`) are disallowed for all crawlers

**Implementation Notes**:

```typescript
// /app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/lp/', '/_next/', '/private/'],
      },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
    ],
    sitemap: 'https://www.safetrekr.com/sitemap.xml',
  };
}
```

---

### FR-SEO-003: Canonical URL Strategy

**Priority**: P0 (Launch Blocker)
**Depends On**: Domain configuration, Nginx Ingress setup

**Description**: Every page emits a self-referencing canonical tag via `generateMetadata`. The canonical domain is `www.safetrekr.com`. All non-www requests redirect to www via Nginx Ingress. Trailing slashes are stripped (Next.js default). Query parameters (UTM, etc.) are excluded from canonical URLs.

**Acceptance Criteria**:

- [ ] Every page renders a `<link rel="canonical" href="https://www.safetrekr.com/...">` tag
- [ ] `safetrekr.com` 301-redirects to `www.safetrekr.com` via Nginx Ingress rewrite rule
- [ ] Blog paginated views canonical to `/blog` (not `/blog?page=2`)
- [ ] Campaign landing pages (`/lp/*`) render `noindex, nofollow` robots meta
- [ ] No trailing slashes in canonical URLs
- [ ] No query parameters (`?utm_*`) in canonical URLs
- [ ] HTTP requests 301-redirect to HTTPS

**Implementation Notes**:

```typescript
// /lib/seo/metadata.ts
import { Metadata } from 'next';

const BASE_URL = 'https://www.safetrekr.com';

interface PageSEOConfig {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
}

export function generatePageMetadata(config: PageSEOConfig): Metadata {
  const canonicalUrl = `${BASE_URL}${config.path}`;
  const ogImageUrl = config.ogImage
    || `${BASE_URL}/api/og?title=${encodeURIComponent(config.title)}`;

  return {
    title: `${config.title} | SafeTrekr`,
    description: config.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: config.title,
      description: config.description,
      url: canonicalUrl,
      siteName: 'SafeTrekr',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: config.title }],
      type: config.type || 'website',
      ...(config.publishedTime && {
        publishedTime: config.publishedTime,
        modifiedTime: config.modifiedTime || config.publishedTime,
        authors: config.authors,
        section: config.section,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [ogImageUrl],
    },
    robots: config.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
```

Nginx Ingress annotations for www redirect and HTTPS enforcement:

```yaml
# Nginx Ingress ConfigMap or Ingress annotations
metadata:
  annotations:
    nginx.ingress.kubernetes.io/from-to-www-redirect: "true"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
```

---

### FR-SEO-004: HTTP Security Headers

**Priority**: P0 (Launch Blocker)
**Depends On**: Nginx Ingress configuration

**Description**: All responses must include HTTP security headers that satisfy both SEO requirements and enterprise buyer trust expectations. Headers are set at two levels: Next.js `next.config.ts` for application-level headers, and Nginx Ingress for infrastructure-level enforcement.

**Acceptance Criteria**:

- [ ] `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` on all responses
- [ ] `X-Content-Type-Options: nosniff` on all responses
- [ ] `X-Frame-Options: DENY` on all responses
- [ ] `X-XSS-Protection: 1; mode=block` on all responses
- [ ] `Referrer-Policy: strict-origin-when-cross-origin` on all responses
- [ ] `Content-Security-Policy` allows `script-src 'self' 'unsafe-inline' https://plausible.io` (Plausible script), `img-src 'self' data: https:`, and `connect-src 'self' https://plausible.io` at minimum
- [ ] `Permissions-Policy: camera=(), microphone=(), geolocation=()` disables unused browser APIs
- [ ] All headers pass Mozilla Observatory scan with grade A or higher
- [ ] Headers do not interfere with JSON-LD injection (`script-src` allows inline for `application/ld+json`)

**Implementation Notes**:

```typescript
// next.config.ts (partial)
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  output: 'standalone', // Required for Docker deployment
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};
```

HSTS preload registration should be submitted to https://hstspreload.org/ after DNS is stable.

---

### FR-SEO-005: Per-Route Metadata Generation

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-SEO-003 (canonical strategy), content for each page

**Description**: Every route in the application must export a `generateMetadata` function that produces a complete metadata object: title (under 60 characters, ending with `| SafeTrekr`), meta description (150-160 characters with target keyword and CTA), canonical URL, Open Graph tags, and Twitter Card tags.

**Acceptance Criteria**:

- [ ] Every static page (`/`, `/solutions/k12`, `/solutions/churches`, `/pricing`, `/how-it-works`, `/demo`, `/contact`, `/about`, `/security`, `/procurement`) exports `generateMetadata`
- [ ] Title tags are under 60 characters and end with `| SafeTrekr`
- [ ] Meta descriptions are 150-160 characters, include the target keyword, and end with a CTA
- [ ] Open Graph `og:title`, `og:description`, `og:image`, `og:url`, `og:site_name` are present
- [ ] Twitter Card meta (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`) is present
- [ ] Blog posts derive metadata from MDX frontmatter fields (`seoTitle`, `seoDescription`, `featuredImage`)
- [ ] No duplicate title tags or meta descriptions across the site (CI lint check)
- [ ] Dynamic OG images reference `/api/og?title=...&segment=...`

**Per-Page Metadata Specifications**:

| Route | Title | Description (abbreviated) | Priority Keyword |
|---|---|---|---|
| `/` | `Trip Safety Management Software \| SafeTrekr` | Professional safety analyst reviews... | trip safety management |
| `/solutions/k12` | `K-12 School Trip Safety Software \| SafeTrekr` | FERPA-compliant trip safety reviews for school field trips... | school trip safety |
| `/solutions/churches` | `Mission Trip Safety Reviews \| SafeTrekr` | Professional safety reviews for church mission trips... | mission trip safety |
| `/solutions/higher-education` | `Study Abroad Risk Management \| SafeTrekr` | Safety reviews for study abroad and university travel... | study abroad safety |
| `/solutions/corporate` | `Corporate Travel Safety Software \| SafeTrekr` | Duty of care documentation for business travel... | corporate travel safety |
| `/pricing` | `Pricing - Starting at $15/Student \| SafeTrekr` | Trip safety reviews starting at $450/trip. Per-student pricing... | trip safety pricing |
| `/how-it-works` | `How SafeTrekr Works: 3-Step Safety Review \| SafeTrekr` | Intelligence, analyst review, safety binder... | how trip safety review works |
| `/demo` | `See a Sample Safety Binder \| SafeTrekr` | Request a demo or download a sample safety binder... | safety binder demo |

---

### FR-SEO-006: Redirect Management System

**Priority**: P0 (Launch Blocker)
**Depends On**: Next.js config, Nginx Ingress

**Description**: Version-controlled redirect map consumed by `next.config.ts`. Includes www-redirect, common URL patterns, and future-proofing for content migrations.

**Acceptance Criteria**:

- [ ] Redirect map lives in `/config/redirects.ts` and is version-controlled
- [ ] `next.config.ts` imports and applies all redirects
- [ ] All redirects are 301 (permanent) unless explicitly marked 302
- [ ] No redirect chains longer than 2 hops (CI validation)
- [ ] No self-referential redirects (CI validation)
- [ ] No redirect targets that return 404 (CI validation)
- [ ] `safetrekr.com` -> `www.safetrekr.com` handled at Nginx Ingress level
- [ ] Common legacy paths are pre-mapped: `/features` -> `/platform`, `/solutions/schools` -> `/solutions/k12`

**Implementation Notes**:

```typescript
// /config/redirects.ts
export const redirects = [
  { source: '/features', destination: '/platform', permanent: true },
  { source: '/solutions/schools', destination: '/solutions/k12', permanent: true },
  { source: '/solutions/church', destination: '/solutions/churches', permanent: true },
  { source: '/solutions/university', destination: '/solutions/higher-education', permanent: true },
  { source: '/request-demo', destination: '/demo', permanent: true },
  { source: '/faq', destination: '/resources/faq', permanent: true },
];
```

---

## 2. Schema Markup (JSON-LD)

### FR-SCHEMA-001: JSON-LD Injection Component

**Priority**: P0 (Launch Blocker)
**Depends On**: React component library

**Description**: Reusable server-side component that injects JSON-LD structured data into the `<head>` of every page. Supports single or multiple schema objects per page. All schemas are validated against Google Rich Results Test before merge.

**Acceptance Criteria**:

- [ ] `<JsonLd>` component accepts a single schema object or array of schema objects
- [ ] Output renders as `<script type="application/ld+json">` in the page `<head>`
- [ ] JSON is minified (no pretty-printing in production)
- [ ] Component is server-rendered (no client-side hydration needed)
- [ ] All schema output passes Google Rich Results Test validation
- [ ] CI step `npm run validate:schema` blocks PRs with invalid schema

**Implementation Notes**:

```typescript
// /components/seo/JsonLd.tsx
interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data];
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
```

---

### FR-SCHEMA-002: Organization Schema (Global)

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-SCHEMA-001

**Description**: Organization schema injected in the root layout, appearing on every page. Establishes SafeTrekr as a named entity for search engines and AI systems.

**Acceptance Criteria**:

- [ ] Root layout (`/app/layout.tsx`) includes Organization JSON-LD
- [ ] Schema includes: `name`, `url`, `logo`, `description`, `foundingDate`, `contactPoint`, `sameAs` (LinkedIn, G2), `address` (US)
- [ ] `description` references the unique mechanism: professional safety analyst, 17 dimensions, government intelligence, tamper-evident binder
- [ ] Passes Google Rich Results Test for Organization type

**Schema Specification**:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SafeTrekr",
  "url": "https://www.safetrekr.com",
  "logo": "https://www.safetrekr.com/images/safetrekr-logo.png",
  "description": "SafeTrekr assigns a professional safety analyst to every trip your organization takes -- reviewing 17 dimensions of risk, scoring threats with government intelligence, and delivering an audit-ready safety binder.",
  "foundingDate": "2024",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "email": "hello@safetrekr.com",
    "url": "https://www.safetrekr.com/contact"
  },
  "sameAs": [
    "https://www.linkedin.com/company/safetrekr",
    "https://www.g2.com/products/safetrekr"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  }
}
```

---

### FR-SCHEMA-003: BreadcrumbList Schema (All Interior Pages)

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-SCHEMA-001, route hierarchy

**Description**: Every page below the homepage renders BreadcrumbList JSON-LD reflecting the URL hierarchy. Breadcrumbs must start at position 1 with "Home" and terminate with the current page name.

**Acceptance Criteria**:

- [ ] All interior pages include BreadcrumbList JSON-LD
- [ ] Position numbering starts at 1
- [ ] Each `ListItem` includes `name` and `item` (full URL)
- [ ] Breadcrumb path matches the visible breadcrumb UI component
- [ ] Nested routes have correct intermediate items (e.g., Solutions > K-12 Schools)
- [ ] Passes Google Rich Results Test for BreadcrumbList

**Implementation Notes**:

```typescript
// /lib/seo/schemas/breadcrumbs.ts
interface BreadcrumbItem { name: string; url: string; }

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

---

### FR-SCHEMA-004: Homepage Schema (SoftwareApplication + AggregateOffer)

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-SCHEMA-001, verified pricing data

**Description**: Homepage renders SoftwareApplication schema with AggregateOffer containing all three pricing tiers. Feature list enumerates the unique mechanism elements. Pricing values must match the single source of truth in the codebase.

**Acceptance Criteria**:

- [ ] Homepage includes SoftwareApplication JSON-LD
- [ ] `applicationCategory` is `BusinessApplication`
- [ ] `operatingSystem` is `Web, iOS, Android`
- [ ] `offers` contains AggregateOffer with `lowPrice: 450`, `highPrice: 1250`, `offerCount: 3`
- [ ] Each individual Offer includes `name`, `price`, `priceCurrency: USD`, `description`, and `availability: InStock`
- [ ] `featureList` includes: 17-section review, Monte Carlo risk scoring, SHA-256 hash-chain, real-time geofencing, FERPA-compliant data handling, AES-256 encryption
- [ ] Prices match `/config/pricing.ts` (single source of truth)
- [ ] Passes Google Rich Results Test

**Pricing Tiers (verified from codebase)**:

| Tier | Name | Price |
|---|---|---|
| T1 | Day Trip Review | $450 |
| T2 | Multi-Day Trip Review | $750 |
| T3 | International Trip Review | $1,250 |

---

### FR-SCHEMA-005: FAQPage Schema (Solutions + Pricing Pages)

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-SCHEMA-001, segment-specific FAQ content

**Description**: Every solutions page and the pricing page includes FAQPage JSON-LD with 8-12 segment-relevant questions. FAQ questions must use exact phrasing a user would type into a search engine or ask an AI assistant. Answers must be concise (under 50 words for the first sentence) with specific data points and named entities.

**Acceptance Criteria**:

- [ ] `/solutions/k12` includes FAQPage with 8-12 K-12-specific questions
- [ ] `/solutions/churches` includes FAQPage with 8-12 church/mission-specific questions
- [ ] `/solutions/higher-education` includes FAQPage with 8-12 higher-ed-specific questions
- [ ] `/solutions/corporate` includes FAQPage with 8-12 corporate-specific questions
- [ ] `/pricing` includes FAQPage with 6-8 pricing-specific questions
- [ ] `/resources/faq` includes a comprehensive FAQPage combining cross-segment questions
- [ ] Every answer includes at least one specific data point (number, entity name, or timeframe)
- [ ] All FAQ content passes Google Rich Results Test for FAQPage

**Required FAQ Topics Per Segment**:

K-12: FERPA compliance, cost per student, safety binder contents, review timeline, school board approval, government data sources, overnight trips, comparison to Chapperone/logistics apps

Churches: Mission trip coverage, international intelligence, insurance documentation, volunteer screening, cost relative to trip budget, denominational compliance, youth group travel, duty of care

Higher Ed: Clery Act compliance, study abroad coverage, Title IX implications, cost vs enterprise risk platforms, real-time monitoring, crisis response documentation

Pricing: Per-student cost calculation, volume discounts, what is included, turnaround time, annual plans, refund policy

---

### FR-SCHEMA-006: HowTo Schema (How It Works Page)

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-SCHEMA-001

**Description**: The How It Works page renders HowTo JSON-LD with three steps matching the three-act mechanism: Intelligence Gathering, Professional Analyst Review, Safety Binder Delivery. Total time is P5D (5 business days).

**Acceptance Criteria**:

- [ ] `/how-it-works` includes HowTo JSON-LD
- [ ] Three `HowToStep` items with `position`, `name`, `text`, and `image`
- [ ] `totalTime` is `P5D`
- [ ] Step descriptions reference specific capabilities (NOAA, USGS, CDC, 17 sections, SHA-256)
- [ ] Passes Google Rich Results Test for HowTo

---

### FR-SCHEMA-007: Article Schema (Blog Posts)

**Priority**: P1 (Ship within 30 days)
**Depends On**: FR-SCHEMA-001, MDX blog infrastructure

**Description**: Every blog post renders Article JSON-LD with `headline`, `description`, `datePublished`, `dateModified`, `wordCount`, `articleSection`, `author`, and `publisher`. Values are derived from MDX frontmatter.

**Acceptance Criteria**:

- [ ] Every published blog post includes Article JSON-LD
- [ ] `headline` matches the `seoTitle` frontmatter field (or `title` if `seoTitle` is absent)
- [ ] `datePublished` and `dateModified` are ISO 8601 formatted
- [ ] `wordCount` is calculated from MDX body content
- [ ] `author` includes `@type: Person`, `name`, and optional `url`
- [ ] `publisher` includes SafeTrekr Organization with logo
- [ ] `mainEntityOfPage` references the canonical URL
- [ ] Passes Google Rich Results Test for Article

---

### FR-SCHEMA-008: Product + Offer Schema (Pricing Page)

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-SCHEMA-001, verified pricing data

**Description**: The pricing page renders three separate Product schemas, one per pricing tier. Each Product includes an Offer with `price`, `priceCurrency`, `availability`, `priceValidUntil`, and `url`.

**Acceptance Criteria**:

- [ ] `/pricing` includes three Product JSON-LD objects
- [ ] Each Product has: `name`, `description`, `brand` (SafeTrekr), `offers` with Offer schema
- [ ] `priceValidUntil` is set to 12 months from build date
- [ ] Prices match the single source of truth in `/config/pricing.ts`
- [ ] Passes Google Rich Results Test for Product

---

### FR-SCHEMA-009: VideoObject Schema (When Video Content Exists)

**Priority**: P2 (Ship within 60 days)
**Depends On**: FR-SCHEMA-001, video production

**Description**: Any page with embedded video content renders VideoObject JSON-LD with `name`, `description`, `thumbnailUrl`, `uploadDate`, `duration`, `contentUrl`, and `publisher`.

**Acceptance Criteria**:

- [ ] Every page with a video embed includes VideoObject JSON-LD
- [ ] `thumbnailUrl` points to an actual image asset (not placeholder)
- [ ] `duration` is ISO 8601 formatted (e.g., `PT2M15S`)
- [ ] `uploadDate` is accurate
- [ ] Passes Google Rich Results Test for VideoObject

---

### FR-SCHEMA-010: Review Schema (When Real Testimonials Exist)

**Priority**: P2 (Ship within 60 days)
**Depends On**: FR-SCHEMA-001, real customer testimonials

**Description**: When verified customer testimonials are collected, inject Review JSON-LD. CRITICAL: No fabricated testimonials. Every Review schema entry must correspond to a real person at a real organization who has given written permission.

**Acceptance Criteria**:

- [ ] Review schema is ONLY injected when a verified testimonial exists
- [ ] Each Review includes: `reviewBody`, `author` (Person with name and jobTitle), `itemReviewed` (SoftwareApplication: SafeTrekr), `reviewRating` (1-5 scale), `publisher` (Organization)
- [ ] CI check flags any placeholder names (e.g., "Sample University", "Jane Doe", "Dr. Rachel Martinez") and blocks merge
- [ ] Passes Google Rich Results Test for Review

---

### FR-SCHEMA-011: Schema Validation CI Pipeline

**Priority**: P0 (Launch Blocker)
**Depends On**: GitHub Actions CI, schema components

**Description**: Automated schema validation in CI that renders page HTML snapshots, extracts JSON-LD blocks, and validates syntax and required properties. Failures block PR merge.

**Acceptance Criteria**:

- [ ] `npm run validate:schema` script exists and runs against rendered HTML
- [ ] Validates JSON syntax (parseable JSON)
- [ ] Validates required `@context` and `@type` properties
- [ ] Validates required properties per schema type (e.g., Article must have `headline`, `datePublished`)
- [ ] Runs in GitHub Actions on every PR targeting `main`
- [ ] Failures block the merge
- [ ] Reports validation errors in PR comment with affected page and missing properties

---

## 3. AI Search Optimization

### FR-AIO-001: AI Summary Blocks on All Core Pages

**Priority**: P0 (Launch Blocker)
**Depends On**: Page content

**Description**: Every core page includes a 40-60 word declarative paragraph within the first 150 words of visible content. This paragraph is the primary target for AI answer engine extraction. It must use factual language (no superlatives), include specific numbers, reference authoritative entities by name, and be self-contained.

**Acceptance Criteria**:

- [ ] Every core page (homepage, all solutions pages, pricing, how-it-works, about, security) includes an AI Summary Block within the first 150 words
- [ ] Each block is 40-60 words
- [ ] Each block includes at least 3 specific data points (e.g., "17 dimensions", "5 government sources", "$450 per trip")
- [ ] Each block references at least 2 named entities (e.g., NOAA, USGS, CDC, FERPA)
- [ ] No marketing superlatives ("best", "leading", "top-rated")
- [ ] Each block directly answers the search query implied by the page URL
- [ ] Blocks are rendered as regular paragraph content (not hidden, not meta-only)

**Segment-Specific AI Summary Templates**:

**Generic (Homepage)**:
> SafeTrekr is a trip safety management platform that assigns a professional safety analyst to review every trip an organization takes. Each review covers 17 dimensions of risk and is backed by real-time intelligence from NOAA, USGS, CDC, ReliefWeb, and GDACS. Organizations receive a tamper-evident safety binder with SHA-256 hash-chain audit trails. Pricing starts at $450 per trip.

**K-12**:
> SafeTrekr provides FERPA-compliant trip safety reviews for K-12 schools. A professional safety analyst reviews every field trip across 17 sections using real-time data from NOAA, USGS, and CDC. Schools receive an audit-ready safety binder suitable for school board approval, with AES-256 encryption and tamper-evident documentation. Pricing starts at approximately $15 per student.

**Churches**:
> SafeTrekr provides professional safety reviews for church mission trips and youth group travel. A trained analyst reviews every trip across 17 dimensions, scoring risk with intelligence from 5 government and humanitarian sources including NOAA, USGS, CDC, ReliefWeb, and GDACS. Churches receive a complete safety binder with tamper-evident documentation for insurance and denominational compliance. Reviews start at $450 per trip.

**Higher Education**:
> SafeTrekr provides safety reviews for study abroad programs and university-sponsored travel. Each trip is reviewed across 17 dimensions by a professional safety analyst using intelligence from NOAA, USGS, CDC, ReliefWeb, and GDACS. Universities receive tamper-evident safety binders that support Clery Act and Title IX documentation requirements. Reviews start at $450 per trip.

---

### FR-AIO-002: llms.txt for LLM Discovery

**Priority**: P0 (Launch Blocker)
**Depends On**: Core pages published

**Description**: Implement `/llms.txt` at the site root -- an emerging standard for LLM-readable site summaries. This file provides a structured, machine-readable overview of SafeTrekr for AI systems that crawl the site.

**Acceptance Criteria**:

- [ ] `/llms.txt` is accessible at `https://www.safetrekr.com/llms.txt`
- [ ] File follows the emerging llms.txt format: title, description, key pages with URLs, and factual data points
- [ ] All URLs in the file are valid and resolve to 200 status
- [ ] Facts section includes: 17 review sections, 5 government sources, Monte Carlo simulation, SHA-256 documentation, AES-256 encryption, 3-5 day turnaround, pricing tiers
- [ ] File is served as `text/plain` content type
- [ ] Updated whenever core pages or pricing change

**Implementation Notes**: Serve as a static file at `/public/llms.txt` or via a Next.js API route at `/app/llms.txt/route.ts`.

```text
# SafeTrekr

> Trip safety management platform with professional analyst review.

SafeTrekr assigns a professional safety analyst to review every trip an organization
takes. Reviews cover 17 dimensions of risk and are backed by real-time intelligence
from NOAA, USGS, CDC, ReliefWeb, and GDACS. Organizations receive a tamper-evident
safety binder with SHA-256 hash-chain audit trails.

## Key Pages

- [How It Works](https://www.safetrekr.com/how-it-works): 3-step process -- intelligence, review, documentation
- [K-12 Schools](https://www.safetrekr.com/solutions/k12): FERPA-compliant field trip safety
- [Churches & Missions](https://www.safetrekr.com/solutions/churches): Mission trip safety reviews
- [Higher Education](https://www.safetrekr.com/solutions/higher-education): Study abroad risk management
- [Pricing](https://www.safetrekr.com/pricing): Starting at $450/trip ($15/student)
- [FAQ](https://www.safetrekr.com/resources/faq): Common questions about trip safety reviews
- [Security](https://www.safetrekr.com/security): AES-256 encryption, FERPA, SOC 2 posture

## Facts

- 17 safety review sections per trip
- 5 government intelligence sources (NOAA, USGS, CDC, ReliefWeb, GDACS)
- Monte Carlo risk simulation with P5/P50/P95 confidence bands
- SHA-256 hash-chain tamper-evident documentation
- AES-256 encryption at rest and in transit
- 3-5 business day review turnaround
- Pricing: $450 (day trip), $750 (multi-day), $1,250 (international)
```

---

### FR-AIO-003: AI Plugin Manifest

**Priority**: P1 (Ship within 30 days)
**Depends On**: Core pages published

**Description**: Deploy `/.well-known/ai-plugin.json` for future AI agent discovery. This manifest describes SafeTrekr in both human-readable and model-readable formats.

**Acceptance Criteria**:

- [ ] `/.well-known/ai-plugin.json` is accessible and returns valid JSON
- [ ] `name_for_model` is `safetrekr`
- [ ] `description_for_model` is factual, includes specific capabilities and data sources
- [ ] `auth.type` is `none` (public information only)
- [ ] `logo_url` points to a valid image

---

### FR-AIO-004: Structured Comparison Tables on Segment Pages

**Priority**: P0 (Launch Blocker)
**Depends On**: Segment page content

**Description**: AI answer engines strongly prefer HTML `<table>` elements with clear headers. Every segment page and comparison page must include at least one comparison table using semantic HTML (`<table>`, `<thead>`, `<tbody>`, `<caption>`).

**Acceptance Criteria**:

- [ ] Every solutions page includes at least one `<table>` comparing SafeTrekr to status quo alternatives
- [ ] Tables use semantic HTML: `<caption>`, `<thead>`, `<th>`, `<tbody>`, `<td>`
- [ ] Comparison categories include: professional analyst review, government intelligence, tamper-evident documentation, price, segment suitability
- [ ] Comparison targets: Spreadsheet Checklists, Logistics Apps (Chapperone-class), Enterprise Risk Platforms (International SOS-class)
- [ ] No fabricated competitor names -- use category labels only

---

### FR-AIO-005: Content Freshness Signals

**Priority**: P1 (Ship within 30 days)
**Depends On**: Content pipeline, schema infrastructure

**Description**: Every page exposes a `dateModified` meta tag and schema property. Pages with content freshness scores below 85 (measured by age of data points, broken external links, and schema validation status) are queued for refresh on a 30-day cadence.

**Acceptance Criteria**:

- [ ] Every page includes `<meta property="article:modified_time" content="...">` with ISO 8601 date
- [ ] Schema `dateModified` matches the meta tag value
- [ ] Blog posts update `dateModified` when content is edited (not just for typo fixes)
- [ ] Content freshness scoring script exists and can be run manually or via cron
- [ ] Any page older than 180 days without an update is flagged for review

---

## 4. Content Marketing System

### FR-CONTENT-001: MDX Blog Infrastructure

**Priority**: P1 (Ship within 30 days)
**Depends On**: Next.js 15 App Router, content directory structure

**Description**: Blog system built on MDX files in a `/content/blog/` directory. Uses ISR with 1-hour revalidation for the blog index and individual posts. Supports frontmatter metadata, custom MDX components, reading time calculation, related posts, and category/tag taxonomy.

**Acceptance Criteria**:

- [ ] Blog posts are authored as `.mdx` files in `/content/blog/`
- [ ] Frontmatter schema enforced via Zod validation at build time
- [ ] Required frontmatter fields: `title`, `slug`, `publishedAt`, `author`, `category`, `tags`, `excerpt`, `featuredImage`, `featuredImageAlt`, `seoTitle`, `seoDescription`, `wordCount`, `segment`, `contentType`, `schema`
- [ ] Optional frontmatter fields: `updatedAt`, `readingTime`, `cta`, `relatedPosts`
- [ ] ISR revalidation period: 3600 seconds (1 hour) for blog routes
- [ ] Blog index page lists posts sorted by `publishedAt` descending
- [ ] Category and tag filtering works without full page reload
- [ ] RSS feed available at `/blog/feed.xml`
- [ ] Reading time auto-calculated if not provided in frontmatter
- [ ] Related posts rendered at bottom of each post based on `relatedPosts` frontmatter

**ISR Configuration for DigitalOcean**:

ISR on standalone Next.js (non-Vercel) requires a file-system or custom cache. Use Next.js built-in file-system cache with a persistent volume in Kubernetes:

```yaml
# K8s Deployment (partial) -- persistent volume for ISR cache
volumes:
  - name: nextjs-cache
    persistentVolumeClaim:
      claimName: nextjs-isr-cache
containers:
  - name: safetrekr-marketing
    volumeMounts:
      - name: nextjs-cache
        mountPath: /app/.next/cache
```

---

### FR-CONTENT-002: Content Type Definitions

**Priority**: P1 (Ship within 30 days)
**Depends On**: FR-CONTENT-001

**Description**: Defined content types with specifications for format, cadence, gate strategy, and target length.

**Content Type Matrix**:

| Content Type | Format | Target Cadence | Gate | Target Length | Schema Type |
|---|---|---|---|---|---|
| Pillar Guide | MDX blog post | 2-3/month | Ungated | 2,000-3,000 words | Article |
| Supporting Blog Post | MDX blog post | 2-3/week (at scale) | Ungated | 800-1,500 words | Article |
| Segment Checklist | PDF download | 1 per segment (4 total) | Email-gated | 5-10 pages | N/A |
| Sample Safety Binder | PDF download | 1 per segment (4 total) | Email + Org Type | 20-30 pages | N/A |
| Case Study | MDX + template | As available | Ungated | 800-1,200 words | Article |
| Comparison Page | MDX page | 1/month | Ungated | 1,000-1,500 words | Article + FAQPage |
| Compliance Guide | MDX page | 1 per regulation | Ungated | 1,500-2,500 words | Article + FAQPage |
| Glossary Term | MDX (batch) | 5-10/month | Ungated | 200-400 words | DefinedTerm |
| Webinar Recap | MDX blog post | As available | Ungated (replay gated) | 1,000-1,500 words | Article + VideoObject |

**Acceptance Criteria**:

- [ ] Each content type has a corresponding MDX template in `/content/templates/`
- [ ] Templates include required frontmatter fields and placeholder sections
- [ ] Content type is a required field in frontmatter (`contentType: 'pillar' | 'supporting' | 'case-study' | 'comparison' | 'compliance' | 'glossary'`)
- [ ] Pillar guides are at least 2,000 words and include a table of contents component
- [ ] No page published with fewer than 300 words (CI lint check)

---

### FR-CONTENT-003: Content Pillar and Cluster Architecture

**Priority**: P1 (Ship within 30 days)
**Depends On**: Keyword research, FR-CONTENT-001

**Description**: Content is organized into pillar-cluster hierarchies. Each pillar page is the authoritative hub for a topic cluster. Supporting posts link to their pillar. Clusters map to keyword groups and conversion funnel stages.

**Pillar Map**:

```
PILLAR: Trip Safety Management
  /platform (overview)
  /blog/what-is-trip-safety-management
  /blog/trip-safety-vs-travel-logistics
  /blog/why-organizations-need-safety-reviews
  /resources/guides/trip-safety-management-guide

PILLAR: K-12 Field Trip Compliance
  /solutions/k12 (segment page)
  /blog/field-trip-safety-checklist-for-schools
  /blog/ferpa-field-trip-compliance
  /blog/school-board-trip-approval-process
  /blog/field-trip-liability-what-administrators-need-to-know
  /compliance/ferpa
  /resources/guides/k12-field-trip-safety-planning-guide

PILLAR: Mission Trip Safety
  /solutions/churches (segment page)
  /blog/church-mission-trip-insurance-requirements
  /blog/youth-group-travel-safety-checklist
  /blog/volunteer-background-check-requirements-churches
  /blog/mission-trip-safety-planning-guide
  /resources/guides/church-mission-trip-safety-guide

PILLAR: Higher Ed Travel Risk
  /solutions/higher-education (segment page)
  /blog/study-abroad-risk-assessment-best-practices
  /blog/clery-act-implications-for-international-programs
  /blog/title-ix-obligations-in-study-abroad
  /resources/guides/higher-ed-international-travel-safety-handbook

PILLAR: Group Travel Operations
  /how-it-works
  /blog/group-travel-management-best-practices
  /blog/how-to-evaluate-trip-safety-software
  /blog/corporate-duty-of-care-travel-compliance
```

**Acceptance Criteria**:

- [ ] Cluster map maintained in `/config/content-clusters.ts` (version-controlled)
- [ ] Each cluster maps to a pillar page URL, supporting page URLs, target keywords, and funnel stage
- [ ] Internal link audit script validates cluster integrity (see FR-CONTENT-004)

---

### FR-CONTENT-004: Internal Linking Rules (Enforced)

**Priority**: P1 (Ship within 30 days)
**Depends On**: FR-CONTENT-001, FR-CONTENT-003

**Description**: Enforced internal linking rules that maintain topical authority and link equity distribution across content clusters.

**Rules**:

1. Every new blog post must link to its parent pillar page within the first two paragraphs
2. Every new blog post must link to at least 2 other supporting posts in the same cluster
3. Every pillar page must link to all supporting blog posts in that cluster
4. Every blog post must include a CTA linking to the relevant segment landing page
5. Cross-cluster linking: every blog post should include at least 1 link to a post in a different cluster where topically relevant
6. Internal link anchor text must include the target keyword or a close variant (no "click here" or "read more" as anchor text)

**Acceptance Criteria**:

- [ ] Internal link audit script (`/scripts/internal-link-audit.ts`) exists
- [ ] Script parses all MDX files and extracts internal links
- [ ] Script identifies: missing outbound links to pillar, missing cross-cluster links, orphaned pages (fewer than 3 inbound links)
- [ ] Script runs in CI on every PR that modifies `/content/`
- [ ] Violations generate warnings (not blockers) in the PR comment

---

### FR-CONTENT-005: Publishing Workflow

**Priority**: P1 (Ship within 30 days)
**Depends On**: GitHub Actions CI, FR-CONTENT-001

**Description**: Structured 10-step publishing workflow from topic selection to post-publish promotion.

**Workflow**:

1. Topic selection from keyword cluster backlog
2. Content brief generation (keyword, intent, word count, outline, internal links, schema type)
3. AI-assisted draft (LLM generates outline + first draft)
4. Human editorial review (factual accuracy, brand voice, intent alignment)
5. SEO review (meta tags, schema, internal links, keyword placement, AI summary block)
6. MDX commit to content repo via pull request
7. Automated CI checks: schema validation, link validation, readability score, word count minimum
8. Editorial approval (CODEOWNERS requires SEO specialist sign-off)
9. Merge to `main` -- Docker rebuild triggers deployment, ISR picks up content
10. Post-publish: submit URL to Google Search Console, share on social, add to email digest

**Acceptance Criteria**:

- [ ] CODEOWNERS file requires approval from `@safetrekr/seo-team` for any changes in `/content/`
- [ ] CI checks run on every PR: frontmatter validation, internal link check, word count check, schema validation
- [ ] Post-merge webhook or GitHub Action submits new URLs to Google Search Console Indexing API

---

## 5. Analytics Infrastructure

### FR-ANALYTICS-001: Plausible Analytics (Primary)

**Priority**: P0 (Launch Blocker)
**Depends On**: Plausible account (cloud at $9/month OR self-hosted on DigitalOcean)

**Description**: Plausible is the primary analytics platform. It operates without cookies, requires no consent banner, and is privacy-first -- critical for K-12 and church audiences who distrust tracking. Uses the extended script variant for tagged events, outbound link tracking, and file download tracking.

**Acceptance Criteria**:

- [ ] Plausible script loaded in root layout via `next/script` with `strategy="afterInteractive"`
- [ ] Script variant: `script.tagged-events.outbound-links.file-downloads.js`
- [ ] `data-domain` set to `safetrekr.com`
- [ ] No cookies set by Plausible (verify via browser DevTools)
- [ ] No cookie consent banner required for Plausible
- [ ] Plausible dashboard accessible with correct domain data

**Self-Hosted Option**: If using self-hosted Plausible on DigitalOcean, update `src` to point to the self-hosted instance URL (e.g., `https://analytics.safetrekr.com/js/script.tagged-events.outbound-links.file-downloads.js`).

**Implementation Notes**:

```typescript
// /app/layout.tsx (root layout)
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          defer
          data-domain="safetrekr.com"
          src="https://plausible.io/js/script.tagged-events.outbound-links.file-downloads.js"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

### FR-ANALYTICS-002: Plausible Custom Goals and Events

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-ANALYTICS-001

**Description**: Custom conversion goals configured in the Plausible dashboard, triggered via a typed event tracking utility.

**Custom Goals (Configure in Plausible Dashboard)**:

| Goal Name | Trigger | Custom Properties |
|---|---|---|
| `Demo Request` | Form submission on `/demo` | `organization_type`, `trips_per_year` |
| `Sample Binder Download` | Email gate submission + download | `binder_type`, `segment` |
| `ROI Calculator Complete` | Final step of calculator | `segment`, `trips_entered` |
| `Pricing View` | Pageview on `/pricing` | `referrer_page` |
| `CTA Click` | Any primary CTA interaction | `cta_text`, `page_section`, `segment` |
| `Lead Magnet Download` | Any gated content download | `asset_name`, `asset_type`, `segment` |
| `Video Play` | Video player interaction | `video_name` |
| `Newsletter Signup` | Email newsletter subscription | `signup_location`, `segment` |
| `Form Start` | First field focus on any form | `form_name` |

**Acceptance Criteria**:

- [ ] `trackEvent()` utility function exists in `/lib/analytics/plausible.ts`
- [ ] Function is typed: accepts `eventName: string` and optional `props: Record<string, string | number | boolean>`
- [ ] Function checks for `window.plausible` existence before calling (SSR safety)
- [ ] All listed goals are configured in the Plausible dashboard
- [ ] Every CTA component calls `trackEvent('CTA Click', { cta_text, page_section, segment })`
- [ ] Every form component calls `trackEvent('Form Start', ...)` on first field focus
- [ ] Every form submission calls the appropriate goal event

**Implementation Notes**:

```typescript
// /lib/analytics/plausible.ts
export function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(eventName, { props });
  }
}
```

---

### FR-ANALYTICS-003: GA4 Consent-Gated Loading

**Priority**: P1 (Ship within 30 days)
**Depends On**: Consent banner component

**Description**: GA4 provides deeper funnel analysis but requires explicit cookie consent. GA4 loads ONLY after a visitor explicitly opts in via the consent banner. No GA4 scripts, cookies, or data collection occur without consent.

**Acceptance Criteria**:

- [ ] GA4 script is NOT present in the initial HTML
- [ ] GA4 loads only when `localStorage.getItem('analytics_consent') === 'granted'`
- [ ] Consent state persists across sessions via `localStorage`
- [ ] Consent banner appears only when a feature requiring analytics consent is triggered (not on first page load)
- [ ] GA4 measurement ID stored in environment variable `NEXT_PUBLIC_GA4_ID`
- [ ] `gtag('config', ...)` sets `cookie_flags: 'SameSite=None;Secure'`
- [ ] GA4 page_view events include: `page_title`, `page_location`, `page_referrer`, `content_type`, `segment`

**GA4 Event Taxonomy (When Consent Granted)**:

| Event | Trigger | Parameters |
|---|---|---|
| `page_view` | Every page load | `page_title`, `page_location`, `content_type`, `segment` |
| `cta_click` | CTA button interaction | `cta_text`, `cta_url`, `page_section`, `cta_tier` |
| `form_start` | First field focus | `form_name`, `form_location` |
| `form_submit` | Form submission | `form_name`, `organization_type`, `lead_type` |
| `demo_request` | Demo form submission | `organization_type`, `trips_per_year`, `source_page` |
| `lead_magnet_download` | Gated content download | `asset_name`, `asset_type`, `segment` |
| `sample_binder_download` | Sample binder download | `binder_type`, `segment` |
| `roi_calculator_start` | Calculator first interaction | `segment` |
| `roi_calculator_complete` | Calculator results viewed | `segment`, `trips_entered`, `cost_per_student` |
| `pricing_view` | Pricing page load | `referrer_page`, `segment` |
| `pricing_tier_click` | Pricing tier CTA click | `tier_name`, `tier_price` |
| `scroll_depth` | 25%, 50%, 75%, 90% marks | `scroll_percent`, `page_type` |
| `video_play` | Video starts | `video_name`, `video_duration` |
| `video_progress` | 25%, 50%, 75%, 100% | `video_name`, `progress_percent` |
| `faq_expand` | FAQ accordion opened | `question_text`, `faq_section` |
| `newsletter_signup` | Newsletter subscription | `signup_location`, `segment` |
| `segment_select` | User self-identifies segment | `segment_selected`, `selection_location` |
| `procurement_download` | W-9 or security doc download | `document_type` |

---

### FR-ANALYTICS-004: Unified Analytics Wrapper

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-ANALYTICS-001, FR-ANALYTICS-003

**Description**: Single `track()` function that dispatches events to both Plausible (always) and GA4 (when consent is granted). All components call this unified function rather than individual analytics providers.

**Acceptance Criteria**:

- [ ] `/lib/analytics/index.ts` exports a `track(eventName, params)` function
- [ ] `track()` always calls Plausible `trackEvent()`
- [ ] `track()` conditionally calls GA4 `trackGA4Event()` only if GA4 is loaded
- [ ] All UI components import from `/lib/analytics` (not directly from provider-specific files)
- [ ] Adding a new analytics provider requires changes only in `/lib/analytics/index.ts`

---

### FR-ANALYTICS-005: Conversion Tracking and Attribution

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-ANALYTICS-004, form components

**Description**: Track conversion goals with assigned pipeline values. Implement first-touch and last-touch attribution capture using `localStorage`.

**Conversion Goals**:

| Goal | Type | Estimated Pipeline Value | Tracking Event |
|---|---|---|---|
| Demo Request | Primary conversion | $2,500 | `demo_request` |
| Sample Binder Download | High-intent lead | $500 | `sample_binder_download` |
| ROI Calculator Complete | Consideration lead | $300 | `roi_calculator_complete` |
| Lead Magnet Download | Top-of-funnel lead | $100 | `lead_magnet_download` |
| Newsletter Signup | Nurture entry | $25 | `newsletter_signup` |
| Pricing Page View | Intent signal | $50 (weighted) | `pricing_view` |
| Procurement Page View | High-intent signal | $200 (weighted) | Custom page goal |

**Attribution Capture**:

- [ ] `captureAttribution()` runs on every page load
- [ ] First touch stored on initial visit: `utm_source`, `utm_medium`, `utm_campaign`, landing page, timestamp
- [ ] Last touch updated on every visit with UTM parameters
- [ ] Attribution data persisted in `localStorage` under key `st_attribution`
- [ ] Attribution data attached to every form submission (stored in Supabase alongside form data)
- [ ] UTM parameter convention enforced: `source_medium_campaign_content`

**Funnel Definitions**:

| Funnel | Path | Tracked Stages |
|---|---|---|
| Demo Request | Entry -> Segment/Homepage -> How It Works/Pricing -> Demo Form -> Submit | `page_view` -> `cta_click` -> `pricing_view` -> `form_start` -> `demo_request` |
| Sample Binder | Entry -> Segment/How It Works -> Binder CTA -> Email Gate -> Download | `page_view` -> `cta_click` -> `form_start` -> `sample_binder_download` |
| ROI Calculator | Entry -> Pricing -> Calculator -> Complete -> Demo | `pricing_view` -> `roi_calculator_start` -> `roi_calculator_complete` -> `demo_request` |
| Content-to-Lead | Blog Entry -> Read -> Internal Link -> Conversion | `page_view` -> `scroll_depth` -> `cta_click` -> conversion event |

---

### FR-ANALYTICS-006: Privacy-First Consent Architecture

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-ANALYTICS-001, FR-ANALYTICS-003

**Description**: Three-tier consent model that respects the privacy expectations of K-12 and church audiences. The default experience requires no consent banner.

**Consent Tiers**:

| Tier | Tools Loaded | Consent Required | Banner Needed |
|---|---|---|---|
| Essential (default) | Plausible (cookieless), Cloudflare Turnstile | None | No |
| Functional | Feature flags (PostHog non-recording mode, if used) | Implicit | No |
| Analytics (opt-in) | GA4, session recordings, LinkedIn Insight Tag | Explicit consent | Yes (minimal, non-blocking) |

**Acceptance Criteria**:

- [ ] Default page load sets zero cookies (verify in DevTools)
- [ ] No consent banner appears unless a visitor interacts with a feature that requires Tier 3 consent
- [ ] Consent banner is a bottom-right slide-in (not full-screen overlay, not top banner)
- [ ] Banner includes: brief explanation, "Allow" button, "No thanks" button
- [ ] Consent state stored in `localStorage` (key: `analytics_consent`, values: `granted` | `denied`)
- [ ] Denied consent is respected for 30 days (timestamp stored)
- [ ] Consent decision can be changed via a link in the footer ("Privacy Settings")
- [ ] GDPR and CCPA compliant: no data collection before consent, deletion path documented

---

## 6. Email Capture and Nurture

### FR-EMAIL-001: Form Architecture (React Hook Form + Zod + Turnstile)

**Priority**: P0 (Launch Blocker)
**Depends On**: Cloudflare Turnstile account, Supabase marketing project

**Description**: All email capture forms use React Hook Form for state management, Zod for client and server validation (shared schemas), Server Actions for submission (progressive enhancement), and Cloudflare Turnstile for invisible bot protection.

**Form Types and Schemas**:

| Form | Fields (Required) | Fields (Optional/Progressive) | Gate Level |
|---|---|---|---|
| Demo Request | email, organizationType, turnstileToken | organizationName, tripsPerYear, message | High |
| Sample Binder | email, organizationType, turnstileToken | -- | Medium |
| Lead Magnet | email, turnstileToken | -- | Low |
| Newsletter | email, turnstileToken | segment | Low |
| Contact | name, email, message, turnstileToken | organizationName, phone | Medium |

**Acceptance Criteria**:

- [ ] All form schemas defined in `/lib/forms/schema.ts` using Zod
- [ ] Client-side validation provides real-time feedback
- [ ] Server Actions re-validate all fields (never trust client)
- [ ] Turnstile token validated server-side via Cloudflare API before processing
- [ ] Honeypot field included on all forms (hidden field that bots fill, humans do not)
- [ ] Rate limiting: maximum 5 submissions per IP per hour (enforced server-side)
- [ ] All submissions stored in Supabase `form_submissions` table with JSONB details
- [ ] UTM parameters and referrer captured and stored with every submission
- [ ] Forms work without JavaScript (progressive enhancement via Server Actions)
- [ ] Input sanitization: strip HTML tags and script injections from all text fields

---

### FR-EMAIL-002: Lead Magnets by Segment

**Priority**: P1 (Ship within 30 days)
**Depends On**: FR-EMAIL-001, PDF content production

**Description**: Segment-specific lead magnets with calibrated gate friction. Sample binders are the highest-value lead magnet (8-15% projected conversion). Checklists and guides have lower gate friction for higher conversion rates.

**Lead Magnet Matrix**:

| Lead Magnet | Gate Fields | Segment | Expected Conversion | Delivery Method |
|---|---|---|---|---|
| K-12 Field Trip Sample Binder | Email + Org Type | K-12 | 8-15% | Immediate PDF + SendGrid email |
| Mission Trip Sample Binder | Email + Org Type | Church | 8-15% | Immediate PDF + SendGrid email |
| Study Abroad Sample Binder | Email + Org Type | Higher Ed | 8-15% | Immediate PDF + SendGrid email |
| Corporate Travel Sample Binder | Email + Org Type | Corporate | 8-15% | Immediate PDF + SendGrid email |
| K-12 Safety Checklist | Email only | K-12 | 15-25% | Immediate PDF download |
| Mission Trip Safety Guide | Email only | Church | 15-25% | Immediate PDF download |
| ROI Calculator Full Report | Email + Org + Trips/year | All | 20-30% | Inline display + SendGrid email |

**Acceptance Criteria**:

- [ ] Each lead magnet has a dedicated download route
- [ ] PDF is delivered immediately after form submission (no waiting for email)
- [ ] Confirmation email sent via SendGrid within 30 seconds of submission
- [ ] Lead magnet downloads tracked as conversion events in Plausible
- [ ] Download URLs are signed/time-limited to prevent unauthorized sharing
- [ ] PDF files hosted on DigitalOcean Spaces CDN for fast delivery

---

### FR-EMAIL-003: SendGrid Integration for Transactional and Nurture Email

**Priority**: P1 (Ship within 30 days)
**Depends On**: SendGrid account (existing in product stack), FR-EMAIL-001

**Description**: SendGrid handles all email delivery: transactional (form confirmations, asset delivery), nurture sequences, and newsletter. Uses SendGrid's Marketing Campaigns API for list management and Dynamic Transactional Templates for branded emails.

**Acceptance Criteria**:

- [ ] SendGrid API key stored as Kubernetes secret, injected as environment variable `SENDGRID_API_KEY`
- [ ] Sender domain `safetrekr.com` authenticated in SendGrid (SPF, DKIM, DMARC)
- [ ] Transactional emails sent via SendGrid v3 Mail Send API
- [ ] From address: `SafeTrekr <safety@safetrekr.com>` (or `hello@safetrekr.com`)
- [ ] All emails include unsubscribe link (CAN-SPAM compliance)
- [ ] Email templates stored as React components in `/lib/email/templates/` and rendered to HTML via `@sendgrid/mail`
- [ ] SendGrid webhook for bounce/complaint handling configured to update Supabase contact status

**Implementation Notes**:

```typescript
// /lib/email/sendgrid.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendBinderEmail(email: string, binderType: string, downloadUrl: string) {
  await sgMail.send({
    to: email,
    from: { email: 'safety@safetrekr.com', name: 'SafeTrekr' },
    subject: 'Your SafeTrekr Safety Binder is Ready',
    templateId: process.env.SENDGRID_BINDER_TEMPLATE_ID!,
    dynamicTemplateData: {
      binder_type: binderType,
      download_url: downloadUrl,
    },
    trackingSettings: {
      clickTracking: { enable: true },
      openTracking: { enable: true },
    },
    categories: ['binder-delivery', binderType],
  });
}
```

---

### FR-EMAIL-004: Email Nurture Sequences

**Priority**: P1 (Ship within 30 days)
**Depends On**: FR-EMAIL-003, SendGrid Marketing Campaigns or Automation

**Description**: Automated email sequences triggered by lead magnet downloads. Each sequence is segment-aware and progresses from value delivery to demo request CTA over 14 days.

**Sequence 1: Sample Binder Download (5 emails, 14 days)**:

| Day | Subject Line | Content Focus | CTA |
|---|---|---|---|
| 0 | "Your SafeTrekr Safety Binder is Ready" | Binder delivery + quick navigation guide | Open binder |
| 2 | "What a 17-Section Safety Review Actually Covers" | Review methodology deep-dive | Explore How It Works |
| 5 | "How [Segment] Organizations Use SafeTrekr" | Segment-specific use cases and scenarios | See segment page |
| 9 | "The Real Cost of an Unreviewed Trip" | Risk/liability framing with dollar figures | Use ROI Calculator |
| 14 | "Ready to See SafeTrekr for Your Organization?" | Direct demo CTA with personalized scheduling link | Book a Demo |

**Sequence 2: Checklist/Guide Download (3 emails, 10 days)**:

| Day | Subject Line | Content Focus | CTA |
|---|---|---|---|
| 0 | "Your [Asset Name] is Ready" | Asset delivery + brief context | Download asset |
| 3 | "What Most Organizations Miss in Trip Safety" | Educational value-add content | See Sample Binder |
| 10 | "Professional Safety Reviews Start at $15/Student" | Pricing + value framing | Book a Demo |

**Sequence 3: Newsletter (Weekly)**:
- Segment-filtered content digest
- New blog posts + industry news
- Quarterly product updates
- Maximum 1 promotional CTA per issue

**Acceptance Criteria**:

- [ ] SendGrid Automation (or Marketing Campaigns) workflows configured for each sequence
- [ ] Sequences triggered automatically by form submission events
- [ ] `[Segment]` placeholders dynamically replaced with the subscriber's segment
- [ ] Subscribers can only be in one active nurture sequence at a time (no overlapping)
- [ ] Demo requesters are immediately removed from all nurture sequences (exclusion list)
- [ ] Unsubscribe from nurture does not unsubscribe from newsletter (separate lists)
- [ ] Email performance tracked: open rate, click rate, unsubscribe rate per sequence

---

### FR-EMAIL-005: Double Opt-In

**Priority**: P1 (Ship within 30 days)
**Depends On**: FR-EMAIL-003

**Description**: All email captures trigger a double opt-in workflow for GDPR/CCPA compliance and list hygiene.

**Flow**:

1. Form submit -> immediate asset delivery (binder/checklist)
2. Confirmation email sent: "Confirm your email to receive future safety updates"
3. 24-hour window for confirmation click
4. Only confirmed emails enter nurture sequences
5. Non-confirmed emails purged from marketing lists after 30 days

**Acceptance Criteria**:

- [ ] Lead magnet is delivered immediately (not gated behind confirmation)
- [ ] Confirmation email sent within 60 seconds of form submission
- [ ] Confirmation link is a signed, time-limited URL (24-hour expiry)
- [ ] Confirmed status stored in Supabase `contacts` table
- [ ] Only confirmed contacts are added to SendGrid marketing lists
- [ ] Nightly cleanup job purges unconfirmed contacts older than 30 days
- [ ] Confirmation rate tracked as a metric (target: >60%)

---

## 7. Social Proof System

### FR-PROOF-001: Trust Metrics Strip

**Priority**: P0 (Launch Blocker)
**Depends On**: UI component library

**Description**: Horizontal strip of verifiable data points that replaces ALL fabricated testimonials. This is the primary trust mechanism at launch until real customer testimonials are collected.

**Strip Content**:
```
5 Government Intel Sources | 17 Safety Review Sections | 3-5 Day Turnaround | AES-256 Encryption | SHA-256 Evidence Chain
```

**Acceptance Criteria**:

- [ ] Trust strip component renders on: homepage (below hero), all segment pages (below hero), pricing page (above pricing cards)
- [ ] Each metric is verifiable (corresponds to a real product capability)
- [ ] No fabricated statistics, testimonials, or customer counts
- [ ] Component is responsive: horizontal on desktop, 2-column or stacked on mobile
- [ ] Passes contrast ratio requirements (4.5:1 minimum)

---

### FR-PROOF-002: Government Data Source Logos

**Priority**: P0 (Launch Blocker)
**Depends On**: Logo assets (public domain or fair use)

**Description**: Display government and humanitarian agency logos with "Powered by data from" framing. These are real, verifiable data sources that SafeTrekr uses.

**Sources to Display**:
- NOAA (National Oceanic and Atmospheric Administration)
- USGS (United States Geological Survey)
- CDC (Centers for Disease Control and Prevention)
- GDACS (Global Disaster Alerting Coordination System)
- ReliefWeb (UN OCHA)

**Acceptance Criteria**:

- [ ] Logo row rendered with grayscale agency logos
- [ ] Label: "Data sourced from" (not "Partners" or "Trusted by")
- [ ] Each logo links to the agency's public data portal
- [ ] Logos are actual agency marks used under fair use for factual attribution
- [ ] Component renders on homepage and How It Works page

---

### FR-PROOF-003: Review Platform Profiles

**Priority**: P1 (Ship within 30 days)
**Depends On**: Product screenshots, pricing data

**Description**: Create product profiles on G2, Capterra, and TrustRadius. Collect real reviews from existing 104 organizations.

**Acceptance Criteria**:

- [ ] G2 product profile created and claimed (Week 1)
- [ ] Capterra product listing created and claimed (Week 1)
- [ ] TrustRadius profile created (Week 4)
- [ ] Google Business Profile created and verified (Week 4)
- [ ] Review acquisition campaign launched: contact existing organizations, offer early-adopter benefit in exchange for honest review
- [ ] Target: 5 reviews on G2 and 5 on Capterra within 60 days of launch
- [ ] Review platform badges added to footer when 5+ reviews achieved

---

### FR-PROOF-004: Compliance Posture Badges

**Priority**: P0 (Launch Blocker)
**Depends On**: Legal review of compliance claims

**Description**: Display verifiable compliance badges in the footer and on the security page. CRITICAL: Never claim a certification that has not been obtained.

**Badge Matrix**:

| Badge | Status | Display Language | Location |
|---|---|---|---|
| AES-256 Encryption | Verifiable NOW | "AES-256 Encryption" | Footer, Security page |
| SHA-256 Evidence Chain | Verifiable NOW | "SHA-256 Hash-Chain Evidence" | Footer, Security page |
| FERPA | In progress | "Designed for FERPA Compliance" | Footer, K-12 pages, Security page |
| SOC 2 Type II | Not started | "SOC 2 Audit In Progress" (only when initiated) | Security page only |
| GDPR | After DPA published | "GDPR Compliant" | Footer, Security page |

**Acceptance Criteria**:

- [ ] No badge claims certification that has not been completed
- [ ] "Designed for FERPA Compliance" used instead of "FERPA Certified" until iKeepSafe cert obtained
- [ ] SOC 2 badge only displayed after audit is formally initiated
- [ ] Schema markup does NOT include compliance badges that are not yet earned
- [ ] Quarterly compliance claim audit scheduled (calendar reminder)
- [ ] CI check flags any text containing "FERPA Certified", "SOC 2 Certified", or "SOC 2 Compliant" and blocks merge

---

### FR-PROOF-005: Fabricated Content Detection CI Guard

**Priority**: P0 (Launch Blocker)
**Depends On**: GitHub Actions CI

**Description**: Automated CI check that scans the entire codebase for fabricated testimonial patterns and blocks merge. This is a permanent safeguard against the existential risk of publishing fake social proof.

**Acceptance Criteria**:

- [ ] CI script scans all `.tsx`, `.ts`, `.mdx`, `.md`, and `.json` files
- [ ] Flags any occurrence of known fabricated names: "Dr. Rachel Martinez", "Sample University", "Jane Doe", "John Smith" (as testimonial attributions)
- [ ] Flags patterns: `"testimonial"` or `"review"` near `"sample"`, `"example"`, `"placeholder"`, `"lorem"`
- [ ] Merge blocked if any fabricated content patterns detected
- [ ] False positives can be allowlisted via a `/.fabrication-allowlist` file (documented exceptions only)

---

## 8. Paid Acquisition Readiness

### FR-PAID-001: Landing Page Architecture

**Priority**: P3 (Ship within 90 days)
**Depends On**: Design system, form components

**Description**: Campaign landing pages at `/lp/[campaign]/` that are isolated from SEO pages: `noindex/nofollow`, no site navigation, single CTA focus, custom hero matching ad creative.

**Acceptance Criteria**:

- [ ] Landing pages use route group `(landing)` with distinct layout (no header nav, minimal footer)
- [ ] All `/lp/*` pages render `<meta name="robots" content="noindex, nofollow">`
- [ ] `/lp/` disallowed in `robots.txt`
- [ ] Landing page template structure: Hero (ad-matched headline + CTA) -> Trust strip -> 3-bullet problem-solution -> Social proof or data source logos -> Single form -> Legal footer
- [ ] UTM parameters captured and stored with form submissions
- [ ] Each landing page has a unique URL per ad group for tracking

**Planned Landing Pages**:

| Campaign | Landing Page | Target Keywords |
|---|---|---|
| K-12 Safety | `/lp/k12-field-trip-safety` | school trip safety software, field trip management |
| Church Missions | `/lp/mission-trip-safety` | mission trip safety, church travel safety |
| Higher Ed | `/lp/study-abroad-safety` | study abroad risk management, university travel safety |
| Brand | Homepage (no landing page) | safetrekr, safe trekr |

---

### FR-PAID-002: Conversion Pixel Setup

**Priority**: P3 (Ship within 90 days)
**Depends On**: FR-ANALYTICS-003 (consent architecture), ad platform accounts

**Description**: Google Ads and LinkedIn Insight Tag tracking pixels, loaded only with explicit consent. Conversion events map to the same events tracked in Plausible and GA4.

**Acceptance Criteria**:

- [ ] Google Ads conversion tracking configured via GA4 linked to Google Ads account
- [ ] Conversion events: `demo_request`, `sample_binder_download`, `roi_calculator_complete`
- [ ] LinkedIn Insight Tag loaded consent-gated alongside GA4
- [ ] LinkedIn Insight Tag partner ID stored in environment variable
- [ ] Meta (Facebook) Pixel NOT implemented at launch (institutional B2B audience not reached via Meta)
- [ ] All pixels respect the three-tier consent model (Tier 3 only)

---

### FR-PAID-003: Retargeting Audience Definitions

**Priority**: P3 (Ship within 90 days)
**Depends On**: FR-PAID-002

**Description**: Pre-defined audience segments for retargeting campaigns based on website behavior.

**Audience Definitions**:

| Audience | Source Signal | Use Case |
|---|---|---|
| All Website Visitors (180 days) | Any page view | Broad retargeting |
| Solutions Page Visitors | `/solutions/*` pageview | High-intent retargeting |
| Pricing Page Visitors | `/pricing` pageview | High-intent retargeting |
| Lead Magnet Downloaders | Conversion event | Upsell to demo |
| Demo Requesters | Conversion event | Exclude from awareness campaigns |
| Segment-Specific Visitors | URL filter (e.g., `/solutions/k12`) | Segment-targeted retargeting |

**Acceptance Criteria**:

- [ ] Audiences defined in both Google Ads and LinkedIn Campaign Manager
- [ ] Demo requesters excluded from all awareness and consideration campaigns
- [ ] Audience membership refreshed daily

---

## 9. Performance Monitoring

### FR-PERF-001: Core Web Vitals Targets

**Priority**: P0 (Launch Blocker)
**Depends On**: Next.js performance optimization, Nginx caching

**Description**: Enforced performance targets for all pages. These are both SEO ranking signals and user experience requirements.

**Targets**:

| Metric | Target | Budget (Max) | Enforcement |
|---|---|---|---|
| LCP (Largest Contentful Paint) | < 2.0s | 2.5s | CI failure |
| INP (Interaction to Next Paint) | < 100ms | 200ms | CI failure |
| CLS (Cumulative Layout Shift) | < 0.05 | 0.1 | CI failure |
| TTFB (Time to First Byte) | < 200ms | 400ms | Monitoring alert |
| Total JS Bundle | < 150KB gzipped | 200KB | CI failure |
| Map Component (lazy) | < 200KB gzipped | 230KB | CI warning |
| Web Fonts | < 100KB | 120KB | CI warning |
| Lighthouse Performance | >= 95 | >= 90 minimum | CI failure |
| Lighthouse Accessibility | >= 100 | >= 95 minimum | CI failure |
| Lighthouse SEO | >= 100 | >= 95 minimum | CI failure |

**Acceptance Criteria**:

- [ ] All targets met on homepage, all solutions pages, pricing, and how-it-works
- [ ] Lighthouse CI configured and running on every PR
- [ ] PRs that exceed budget thresholds are blocked from merge
- [ ] TTFB measured at Nginx Ingress level (not just application)
- [ ] MapLibre lazy-loaded via `next/dynamic` with `ssr: false` to avoid LCP impact

---

### FR-PERF-002: Lighthouse CI Configuration

**Priority**: P0 (Launch Blocker)
**Depends On**: GitHub Actions, Docker build pipeline

**Description**: Lighthouse CI runs against a local build (not production) on every PR. Tests the 5 highest-traffic pages. Failures block merge.

**Acceptance Criteria**:

- [ ] `lighthouserc.yml` configuration file exists at repo root
- [ ] Tests run against: `/`, `/solutions/k12`, `/solutions/churches`, `/pricing`, `/how-it-works`
- [ ] Each URL tested 3 times (median used for assertions)
- [ ] Assertions configured for: Performance >= 0.90, Accessibility >= 0.95, SEO >= 0.95, LCP <= 2500ms, CLS <= 0.1, TBT <= 300ms
- [ ] GitHub Actions workflow runs Lighthouse CI on every PR to `main`
- [ ] Results uploaded as artifacts and PR comment includes score summary
- [ ] Failures block merge with clear error messages indicating which metric failed

**Implementation Notes**:

```yaml
# lighthouserc.yml
ci:
  collect:
    startServerCommand: 'npm run start'
    startServerReadyPattern: 'Ready on'
    url:
      - http://localhost:3000/
      - http://localhost:3000/solutions/k12
      - http://localhost:3000/solutions/churches
      - http://localhost:3000/pricing
      - http://localhost:3000/how-it-works
    numberOfRuns: 3
    settings:
      chromeFlags: '--no-sandbox'
      onlyCategories: [performance, accessibility, best-practices, seo]
  assert:
    assertions:
      categories:performance: ['error', { minScore: 0.90 }]
      categories:accessibility: ['error', { minScore: 0.95 }]
      categories:best-practices: ['error', { minScore: 0.90 }]
      categories:seo: ['error', { minScore: 0.95 }]
      largest-contentful-paint: ['error', { maxNumericValue: 2500 }]
      cumulative-layout-shift: ['error', { maxNumericValue: 0.1 }]
      total-blocking-time: ['error', { maxNumericValue: 300 }]
  upload:
    target: temporary-public-storage
```

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on:
  pull_request:
    branches: [main]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v12
        with:
          configPath: ./lighthouserc.yml
          uploadArtifacts: true
```

---

### FR-PERF-003: Real-Time Performance Monitoring

**Priority**: P1 (Ship within 30 days)
**Depends On**: GitHub Actions scheduled workflows, Slack webhook

**Description**: Weekly automated Lighthouse audits against production URLs. Alerts sent to Slack when any page falls below performance thresholds. Since there is no Vercel Speed Insights on DigitalOcean, this replaces RUM (Real User Monitoring) with synthetic monitoring via PageSpeed Insights API.

**Acceptance Criteria**:

- [ ] GitHub Actions scheduled workflow runs weekly (Sunday night)
- [ ] Tests top 10 production pages via PageSpeed Insights API (mobile strategy)
- [ ] Captures: LCP, CLS, INP, Performance score, SEO score per page
- [ ] Results stored in Supabase `performance_checks` table for trend analysis
- [ ] Slack alert sent to `#seo-alerts` if any page LCP > 2.5s or Performance < 0.90
- [ ] Monthly CWV trend report generated and posted to Slack
- [ ] Dashboard page (internal, auth-protected) displays performance trends

**Implementation Notes**: Use PageSpeed Insights API (free, no API key required for limited use; API key for higher quota) via a GitHub Actions scheduled workflow:

```yaml
# .github/workflows/performance-check.yml
name: Weekly Performance Check
on:
  schedule:
    - cron: '0 3 * * 0'  # Sunday 3am UTC
  workflow_dispatch: {}
```

---

### FR-PERF-004: Schema Validation Monitoring

**Priority**: P1 (Ship within 30 days)
**Depends On**: Schema infrastructure, GitHub Actions

**Description**: Automated weekly schema validation against production pages. Detects missing or invalid JSON-LD, tracks rich result eligibility, and alerts on regressions.

**Acceptance Criteria**:

- [ ] Weekly GitHub Actions workflow crawls all production pages
- [ ] Extracts all `<script type="application/ld+json">` blocks
- [ ] Validates JSON syntax
- [ ] Validates required properties per `@type`
- [ ] Checks for duplicate or conflicting schema on the same page
- [ ] Results stored in Supabase for trend tracking
- [ ] Alert sent to Slack if any page loses its JSON-LD or fails validation
- [ ] Schema coverage metric: percentage of pages with valid JSON-LD (target: 100%)

---

### FR-PERF-005: Broken Link Detection

**Priority**: P2 (Ship within 60 days)
**Depends On**: GitHub Actions, production deployment

**Description**: Nightly broken link scanner that crawls all published pages, checks every `<a href>` for HTTP status, and categorizes findings by severity.

**Acceptance Criteria**:

- [ ] Nightly GitHub Actions workflow crawls all sitemap URLs
- [ ] Checks internal links (P0 severity), outbound links (P1 severity), and redirect chains > 2 hops (P2 severity)
- [ ] P0 findings (internal broken links) trigger immediate Slack alert
- [ ] Weekly digest of all findings posted to Slack `#seo-alerts`
- [ ] Results stored in Supabase for trend tracking
- [ ] Link health metric: percentage of links returning 200 (target: 99%+)

---

### FR-PERF-006: Bundle Size Monitoring

**Priority**: P0 (Launch Blocker)
**Depends On**: CI pipeline

**Description**: Bundle analyzer runs in CI to enforce JavaScript bundle size budgets. Prevents performance regressions from new dependencies or code changes.

**Acceptance Criteria**:

- [ ] `@next/bundle-analyzer` or `bundlewatch` configured in CI
- [ ] Total JS bundle limit: 200KB gzipped (warning at 150KB)
- [ ] Individual chunk limit: 100KB gzipped
- [ ] Map component (dynamic import): 230KB gzipped max
- [ ] CI fails if any budget is exceeded
- [ ] Bundle size delta displayed in PR comment

---

## 10. Dependencies and Sequencing

### P0 Launch Blockers (Weeks 1-4)

| FR | Name | Depends On | Estimated Effort |
|---|---|---|---|
| FR-SEO-001 | Sitemap Generation | Next.js setup, MDX pipeline | 0.5 days |
| FR-SEO-002 | Robots.txt with AI Crawlers | Next.js setup | 0.5 days |
| FR-SEO-003 | Canonical Strategy | Nginx Ingress, domain config | 1 day |
| FR-SEO-004 | Security Headers | Nginx Ingress, next.config | 0.5 days |
| FR-SEO-005 | Per-Route Metadata | Content for each page | 2 days |
| FR-SEO-006 | Redirect Management | next.config | 0.5 days |
| FR-SCHEMA-001 | JSON-LD Component | React components | 0.5 days |
| FR-SCHEMA-002 | Organization Schema | FR-SCHEMA-001 | 0.5 days |
| FR-SCHEMA-003 | BreadcrumbList Schema | FR-SCHEMA-001 | 0.5 days |
| FR-SCHEMA-004 | Homepage Schema | FR-SCHEMA-001, pricing data | 0.5 days |
| FR-SCHEMA-005 | FAQPage Schema | FR-SCHEMA-001, FAQ content | 2 days |
| FR-SCHEMA-006 | HowTo Schema | FR-SCHEMA-001 | 0.5 days |
| FR-SCHEMA-008 | Product Schema (Pricing) | FR-SCHEMA-001, pricing data | 0.5 days |
| FR-SCHEMA-011 | Schema Validation CI | GitHub Actions | 1 day |
| FR-AIO-001 | AI Summary Blocks | Page content | 1 day |
| FR-AIO-002 | llms.txt | Core pages published | 0.5 days |
| FR-AIO-004 | Comparison Tables | Segment page content | 1 day |
| FR-ANALYTICS-001 | Plausible Setup | Plausible account | 0.5 days |
| FR-ANALYTICS-002 | Plausible Custom Goals | FR-ANALYTICS-001 | 1 day |
| FR-ANALYTICS-004 | Unified Analytics Wrapper | FR-ANALYTICS-001 | 0.5 days |
| FR-ANALYTICS-005 | Conversion Tracking | FR-ANALYTICS-004 | 1 day |
| FR-ANALYTICS-006 | Consent Architecture | FR-ANALYTICS-001 | 1 day |
| FR-EMAIL-001 | Form Architecture | Turnstile, Supabase | 2 days |
| FR-PROOF-001 | Trust Metrics Strip | UI components | 1 day |
| FR-PROOF-002 | Data Source Logos | Logo assets | 0.5 days |
| FR-PROOF-004 | Compliance Badges | Legal review | 0.5 days |
| FR-PROOF-005 | Fabricated Content CI Guard | GitHub Actions | 0.5 days |
| FR-PERF-001 | CWV Targets | Performance optimization | Ongoing |
| FR-PERF-002 | Lighthouse CI | GitHub Actions | 1 day |
| FR-PERF-006 | Bundle Size Monitoring | CI pipeline | 0.5 days |

**Total Estimated P0 Effort**: ~22 days (1 developer, some parallelizable)

### P1 Ship Within 30 Days (Weeks 5-8)

| FR | Name | Estimated Effort |
|---|---|---|
| FR-SCHEMA-007 | Article Schema (Blog) | 0.5 days |
| FR-AIO-003 | AI Plugin Manifest | 0.5 days |
| FR-AIO-005 | Content Freshness Signals | 1 day |
| FR-CONTENT-001 | MDX Blog Infrastructure | 3 days |
| FR-CONTENT-002 | Content Type Definitions | 1 day |
| FR-CONTENT-003 | Pillar/Cluster Architecture | 1 day |
| FR-CONTENT-004 | Internal Linking Rules | 2 days |
| FR-CONTENT-005 | Publishing Workflow | 1 day |
| FR-ANALYTICS-003 | GA4 Consent-Gated | 1 day |
| FR-EMAIL-002 | Lead Magnets | 2 days |
| FR-EMAIL-003 | SendGrid Integration | 2 days |
| FR-EMAIL-004 | Nurture Sequences | 3 days |
| FR-EMAIL-005 | Double Opt-In | 1 day |
| FR-PROOF-003 | Review Platform Profiles | 1 day |
| FR-PERF-003 | Performance Monitoring | 2 days |
| FR-PERF-004 | Schema Validation Monitoring | 1 day |

### P2 Ship Within 60 Days (Weeks 9-12)

| FR | Name | Estimated Effort |
|---|---|---|
| FR-SCHEMA-009 | VideoObject Schema | 0.5 days |
| FR-SCHEMA-010 | Review Schema | 1 day |
| FR-PERF-005 | Broken Link Detection | 2 days |

### P3 Ship Within 90 Days (Weeks 13-16)

| FR | Name | Estimated Effort |
|---|---|---|
| FR-PAID-001 | Landing Page Architecture | 3 days |
| FR-PAID-002 | Conversion Pixel Setup | 1 day |
| FR-PAID-003 | Retargeting Audiences | 1 day |

---

## 11. Metrics and Targets

### Monthly KPI Dashboard

| Metric | Month 1-3 | Month 4-6 | Month 7-12 | Tool |
|---|---|---|---|---|
| Organic Sessions | 500/mo | 2,000/mo | 5,000/mo | Plausible |
| Demo Requests (organic) | 5/mo | 15/mo | 40/mo | Plausible goals |
| Lead Magnet Downloads | 20/mo | 60/mo | 150/mo | Plausible goals |
| Keyword Rankings (Top 10) | 5 | 20 | 50 | Google Search Console |
| AI Answer Engine Citations | 0 | 3 | 10 | Manual + Perplexity tracking |
| Schema Coverage | 100% | 100% | 100% | Validation CI + monitoring |
| Core Web Vitals (Good) | 100% pages | 100% pages | 100% pages | Lighthouse CI |
| Organic Conversion Rate | 2% | 3% | 4% | Plausible |
| Content Freshness Score (avg) | 95 | 90 | 85+ | Custom scoring script |
| Email List Size | 50 | 250 | 1,000 | SendGrid |
| Broken Link Rate | <1% | <1% | <1% | Link checker |
| Lighthouse Performance (avg) | 95+ | 95+ | 95+ | Lighthouse CI |

### Revenue Attribution Targets

| Timeframe | Estimated Organic Pipeline Value | Basis |
|---|---|---|
| Year 1 | $180K - $420K | 40 demos/mo x $2,500 pipeline value x 12 months x 15-35% close rate |
| Year 2 | $800K - $2.4M | Compounding organic growth + content authority |
| Year 3 | $2.6M - $10.9M | Category ownership + multi-segment penetration |

---

## 12. Risks

### RISK-001: Zero Content at Launch (CRITICAL)

**Probability**: High | **Impact**: High | **Severity**: Critical

The site launches with infrastructure but no blog posts, no case studies, no sample binders, and no reviews. Search engines and AI answer engines have nothing to index beyond core pages.

**Mitigation**:
- Seed 3-5 pillar blog posts BEFORE launch (one per content pillar)
- Generate sample binders from demo data immediately (church/mission version first)
- Create FAQ content for all 4 segment pages (fastest path to AI citations)
- Launch with at least 1 compliance guide (FERPA is the highest-volume opportunity)

### RISK-002: Fabricated Social Proof Discovered (CRITICAL)

**Probability**: Medium | **Impact**: Existential | **Severity**: Critical

If any fabricated testimonial persists from the previous site, it would destroy credibility for a platform that sells documented trust.

**Mitigation**:
- FR-PROOF-005 (Fabricated Content CI Guard) blocks merge of any suspect content
- Pre-launch codebase audit for fabricated names and organizations
- Replace all fabricated proof with verifiable trust metrics strip
- Zero-tolerance policy: no testimonial without written verification

### RISK-003: FERPA/Compliance Overclaim (HIGH)

**Probability**: Medium | **Impact**: High | **Severity**: High

Claiming certifications before completion exposes SafeTrekr to legal liability and trust destruction.

**Mitigation**:
- FR-PROOF-004 enforces approved compliance language
- CI check flags prohibited terms ("FERPA Certified", "SOC 2 Certified")
- Quarterly compliance claim audit by legal

### RISK-004: ISR Cache on DigitalOcean (MEDIUM)

**Probability**: Medium | **Impact**: Medium | **Severity**: Medium

ISR on standalone Next.js (non-Vercel) requires custom cache handling. If the persistent volume fails or is misconfigured, ISR will not function correctly and blog content will not update.

**Mitigation**:
- Configure persistent volume claim for `.next/cache` in Kubernetes
- Fallback: full rebuild on content changes via GitHub Actions webhook
- Monitor ISR cache hit rates via custom logging
- Document ISR cache troubleshooting in runbook

### RISK-005: AI Crawler Policy Changes (MEDIUM)

**Probability**: Medium | **Impact**: Medium | **Severity**: Medium

AI providers may change crawling policies, opt-in requirements, or citation formats.

**Mitigation**:
- Content structure works for both traditional and AI search (FAQ schema, comparison tables, direct-answer blocks)
- `robots.txt` maintained as a living document; reviewed monthly
- `llms.txt` and `ai-plugin.json` updated as standards evolve
- Weekly monitoring of AI crawler policy announcements

### RISK-006: Seasonal Demand Mismatch (MEDIUM)

**Probability**: Medium | **Impact**: Medium | **Severity**: Medium

Content published after the planning season misses the buying window.

**Mitigation**:
- Implement seasonal content calendar aligned to segment planning cycles
- Publish segment content 8 weeks before peak planning season
- K-12 spring trips: content published November-February
- Church mission trips: content published July-October
- ISR keeps seasonal content fresh year-round

### RISK-007: SendGrid Deliverability (LOW)

**Probability**: Low | **Impact**: Medium | **Severity**: Low-Medium

Email deliverability issues could prevent lead magnet delivery and nurture sequences from reaching prospects.

**Mitigation**:
- Authenticate sender domain (SPF, DKIM, DMARC) before sending any email
- Start with low volume and warm up the sending reputation
- Monitor bounce rates and complaint rates in SendGrid dashboard
- Use dedicated IP address when volume exceeds 50K emails/month
- Configure bounce/complaint webhooks to auto-suppress problematic addresses

---

*PRD generated: 2026-03-24*
*Persona: World-Class Digital Marketing Lead*
*Project: SafeTrekr Marketing Site*
*Tech Stack: Next.js 15 + DigitalOcean DOKS + Docker + SendGrid + Plausible*
