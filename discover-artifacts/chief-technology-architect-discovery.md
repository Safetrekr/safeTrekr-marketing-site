# SafeTrekr Marketing Site -- Technical Architecture Discovery

**Date**: 2026-03-24
**Author**: Chief Technology Architect
**Mode**: Greenfield Discovery
**Project**: SafeTrekr Marketing Website v3
**Stack**: Next.js 15+ / Tailwind CSS 4 / Framer Motion / MapLibre / Vercel / Supabase

---

## Executive Summary

SafeTrekr requires a world-class marketing site that converts institutional buyers (K-12 administrators, church mission directors, sports league coordinators, university risk officers) into demo requests and, ultimately, paying customers. The platform discovery reveals a technically deep product (292K LOC, 250+ endpoints, 17-section analyst review, Monte Carlo risk scoring) with zero go-to-market presence -- the marketing site is the critical bridge between product capability and revenue.

This architecture discovery defines the technical foundation for a site that must accomplish four objectives simultaneously:

1. **Convert** -- drive demo requests and quote inquiries from institutional decision-makers through trust-building content and frictionless form flows.
2. **Differentiate** -- use interactive map compositions, documentation previews, and operational motion to communicate SafeTrekr's unique value proposition visually, not just textually.
3. **Scale** -- handle spiky traffic patterns (back-to-school August/September, mission trip planning January-March, spring field trip season April-May) without performance degradation.
4. **Prepare** -- architect for self-service signup, subscription billing (Stripe), and CRM integration that will ship within 60-90 days of the marketing site launch.

The recommended architecture is a statically-generated Next.js 15 application deployed on Vercel's Edge Network, with Supabase for form persistence and analytics events, MapLibre GL JS for interactive map compositions, Framer Motion for operational motion, and a content layer built on MDX files in the repository (migrating to a headless CMS when content velocity demands it). Total estimated infrastructure cost at launch: under $50/month. At 50,000 monthly visitors: under $200/month.

---

## Key Findings

### Finding 1: Static-First Architecture Eliminates Complexity Without Sacrificing Capability

Every page on the marketing site is a candidate for static generation at build time. There are no user-specific pages, no authentication flows, and no dynamic data requirements on the marketing site itself. This means:

- **Zero server runtime costs** on Vercel's free/pro tier for the vast majority of traffic.
- **Sub-50ms Time to First Byte** globally via Vercel's Edge Network (200+ PoPs).
- **Perfect Lighthouse scores** achievable with proper image optimization and font subsetting.
- **Incremental Static Regeneration (ISR)** for blog posts and case studies, enabling content updates without full rebuilds.

### Finding 2: The Marketing Site Must Be Architected as a Separate Domain from the Product

- **Marketing site**: `safetrekr.com` -- static marketing content, blog, pricing, forms.
- **Product portals**: `app.safetrekr.com` -- authenticated product experience.
- **API**: `api.safetrekr.com` -- Core API (Python/FastAPI).

This separation prevents marketing deploys from affecting product stability, enables independent scaling, and allows the marketing team to ship content changes without engineering gatekeeping.

### Finding 3: MapLibre GL JS Is the Correct Choice Over Mapbox GL JS

MapLibre GL JS (the open-source fork of Mapbox GL JS v1) is the correct choice because:

- **Zero per-map-load costs** -- Mapbox charges $5 per 1,000 map loads after 50,000 free.
- **Identical API surface** to Mapbox GL JS for the features needed.
- **Free tile sources available** -- MapTiler, Stadia Maps, and self-hosted PMTiles.
- **Custom map styles** can be designed to match SafeTrekr's visual system.

### Finding 4: Form Handling Requires a Hybrid Approach

| Form Type | Volume | Response SLA | CRM Integration | Storage |
|-----------|--------|-------------|-----------------|---------|
| Demo Request | 5-20/day at scale | Immediate email notification | Required | Supabase + CRM |
| Quote Request | 2-10/day | Within 1 hour | Required | Supabase + CRM |
| Newsletter Signup | 10-50/day | None (async) | Email platform | SendGrid list |
| Contact Form | 1-5/day | Within 4 hours | Optional | Supabase |

### Finding 5: The Content Strategy Must Support Three Content Velocities

| Content Type | Update Frequency | Authoring Model | Rendering Strategy |
|-------------|------------------|-----------------|-------------------|
| Core pages | Monthly | Developer (code) | SSG |
| Blog posts, case studies | Weekly | Writer (MDX initially, CMS later) | ISR with 1-hour revalidation |
| Dynamic elements | Quarterly | Developer (code) | Client-side with static shell |

### Finding 6: Analytics Must Be Privacy-First

- **Plausible Analytics** as the primary analytics platform. No cookies, GDPR-compliant by default.
- **Vercel Web Analytics** for Core Web Vitals. No cookies.
- **Google Analytics 4** optional, loaded only after explicit cookie consent.
- **Custom event tracking** via Supabase for conversion events.

### Finding 7: Accessibility from Day One

WCAG 2.2 AA compliance is non-negotiable: K-12 institutions require Section 508 compliance from vendors.

### Finding 8: Performance Budget

| Metric | Target |
|--------|--------|
| LCP | < 1.2s |
| FID | < 50ms |
| CLS | < 0.05 |
| TTFB | < 100ms |
| Total Page Weight (initial) | < 500 KB |
| JavaScript Bundle (initial) | < 150 KB gzipped |
| Map Component (lazy-loaded) | < 200 KB gzipped |

### Finding 9: Security for Enterprise Buyer Evaluation

- **Form spam**: Cloudflare Turnstile + rate limiting + honeypot fields
- **Reputational risk**: Strict CSP headers, SRI for third-party scripts
- **Supply chain**: Lock files committed, automated dependency scanning

### Finding 10: Self-Service Ready from Day One

Architecture designed so self-service signup requires no rewrite: shared cookie domain (`.safetrekr.com`), Stripe-ready pricing page, feature flags for CTA toggling.

---

## System Architecture

```
                                    USERS
                                      |
                                      v
                          +-------------------+
                          |   Cloudflare DNS   |
                          |   safetrekr.com    |
                          +-------------------+
                                      |
                    +-----------------+-----------------+
                    |                                   |
                    v                                   v
          +------------------+               +------------------+
          |  Vercel Edge CDN  |               |  app.safetrekr   |
          |  (Marketing Site) |               |  (Product App)   |
          +------------------+               +------------------+
          | Next.js 15 (SSG) |               | Existing portals |
          | + API Routes     |               |                  |
          +--------+---------+               +--------+---------+
                   |                                  |
      +------------+------------+                     |
      |            |            |                      |
      v            v            v                      v
+----------+ +----------+ +----------+        +---------------+
| Supabase | | SendGrid | | Stripe   |        | Supabase      |
| (Mktg DB)| | (Email)  | | (Future) |        | (Product DB)  |
+----------+ +----------+ +----------+        +---------------+
```

## Component Architecture

```
safetrekr-marketing/
+-- src/
|   +-- app/
|   |   +-- (marketing)/          # Homepage, features, pricing, about, contact, demo
|   |   +-- (solutions)/          # K-12, churches, sports, higher-ed
|   |   +-- (resources)/          # Blog, case studies, guides
|   |   +-- (legal)/              # Privacy, terms, cookies
|   |   +-- api/                  # Form handlers, analytics, OG images
|   |   +-- layout.tsx, sitemap.ts, robots.ts
|   +-- components/
|   |   +-- ui/                   # Design system primitives
|   |   +-- layout/               # Nav, footer, section, container
|   |   +-- marketing/            # Hero, feature grid, trust strip, CTA band
|   |   +-- maps/                 # MapLibre components (lazy-loaded)
|   |   +-- motion/               # Framer Motion compositions
|   |   +-- forms/                # Form components with Turnstile
|   |   +-- content/              # MDX rendering, blog cards
|   +-- lib/                      # Supabase, maplibre, email, validation, analytics
|   +-- content/                  # MDX content directory
|   +-- styles/globals.css
+-- public/                       # Images, fonts
```

## Rendering Strategy

| Page | Rendering | Revalidation |
|------|-----------|-------------|
| Homepage, Features, Pricing, Solutions | SSG | On deploy |
| Blog Index | ISR | 3600s (1 hour) |
| Blog Post | ISR | 86400s (24 hours) |
| Legal Pages | SSG | On deploy |
| Sitemap | Dynamic | On request |
| OG Images | Dynamic (Edge) | Cached indefinitely |

---

## Security Architecture

### Security Headers
- Strict CSP, X-Frame-Options: DENY, HSTS, Permissions-Policy

### Form Security (8 Layers)
1. Client-side Zod validation
2. Cloudflare Turnstile challenge
3. Server-side Turnstile verification
4. Server-side Zod validation
5. Rate limiting (10/IP/hour/form)
6. Honeypot field detection
7. Input sanitization
8. IP hashing (SHA-256)

---

## Feature Inventory

| # | Capability | Priority |
|---|-----------|----------|
| 1 | Static page generation (SSG) | P0 |
| 2 | Responsive design system | P0 |
| 3 | Demo request form | P0 |
| 4 | Interactive hero map (MapLibre) | P0 |
| 5 | Bot protection (Turnstile) | P0 |
| 6 | Privacy-first analytics (Plausible) | P0 |
| 7 | SEO foundation | P0 |
| 8 | Accessibility compliance (WCAG 2.2 AA) | P0 |
| 9 | Operational motion system (Framer Motion) | P1 |
| 10 | Solution-specific landing pages | P1 |
| 11 | Blog with ISR | P1 |
| 12 | Performance monitoring (Sentry + Vercel) | P1 |
| 13 | Dynamic OG images | P2 |
| 14 | Dynamic pricing (Stripe) | P2 |
| 15 | CRM integration (HubSpot) | P2 |

---

## Recommendations

1. **Ship in Three Phases**: Foundation (Weeks 1-3), Differentiation (Weeks 4-6), Growth Engine (Weeks 7-10)
2. **Use a Separate Supabase Project** for marketing (blast radius isolation)
3. **Invest in a Custom MapLibre Style** as a reusable brand asset
4. **Enforce Accessibility and Performance in CI** from day one (axe-core, Bundlewatch, Lighthouse CI)
5. **Collect Real Testimonials Before Launch** from 104 existing organizations

---

## Architecture Decision Records

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | SSG as default rendering | No user-specific content; zero runtime cost |
| ADR-002 | MapLibre over Mapbox | Zero per-load cost; identical API; no lock-in |
| ADR-003 | Separate Supabase project | Blast radius isolation; independent scaling |
| ADR-004 | MDX for content, not headless CMS | Low content velocity; version control; zero cost |
| ADR-005 | Plausible primary, GA4 optional | Privacy-first for K-12 buyers; no cookie banner needed |

---

*Generated by Chief Technology Architect on 2026-03-24*
