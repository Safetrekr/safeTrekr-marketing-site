# Information Architect Analysis: SafeTrekr Marketing Site

**Date**: 2026-03-24
**Analyst**: Principal Information Architect
**Mode**: Deep Analysis (Post-Discovery Enhancement)
**Platform**: Next.js 15 App Router + React 19 + Tailwind CSS 4 + Vercel
**Version**: 2.0.0
**Discovery Input**: `discover-artifacts/information-architect-discovery.md` (v1.0.0)

---

## Table of Contents

1. [Analysis Summary](#1-analysis-summary)
2. [Complete Sitemap with All URLs](#2-complete-sitemap-with-all-urls)
3. [Navigation System](#3-navigation-system)
4. [Content Model](#4-content-model)
5. [Segment Routing Logic](#5-segment-routing-logic)
6. [Cross-Linking Matrix](#6-cross-linking-matrix)
7. [URL Architecture with Redirect Strategy](#7-url-architecture-with-redirect-strategy)
8. [Metadata Templates per Page Type](#8-metadata-templates-per-page-type)
9. [JSON-LD Schema per Page Type](#9-json-ld-schema-per-page-type)
10. [Internal Search Strategy](#10-internal-search-strategy)
11. [Content Governance Model](#11-content-governance-model)
12. [Enhancement Proposals](#12-enhancement-proposals)
13. [Risk Assessment](#13-risk-assessment)
14. [Priority Recommendations](#14-priority-recommendations)

---

## 1. Analysis Summary

The discovery analysis (v1.0.0) established a sound foundation: 38-46 pages at launch scaling to 110-190, five primary navigation items, four segment entry points, progressive disclosure of technical depth, and a content-first architecture designed for institutional buyers.

This deep analysis goes beyond discovery in three ways:

1. **Implementation-ready specification** -- Every IA feature documented with field-level detail, component mappings, and Next.js App Router conventions that an engineer can build from directly.
2. **12 enhancement proposals** -- Architectural improvements not present in the discovery: smart content recommendations, dynamic breadcrumbs, segment persistence, content scoring, automated cross-linking, comparison page framework, glossary architecture, AI-citation optimization, multi-stakeholder journey paths, contextual help system, intelligent footer, and progressive disclosure engine.
3. **Risk-weighted prioritization** -- Every recommendation scored against implementation effort, findability impact, and conversion impact with a clear build sequence.

### Architecture Design Principles (Confirmed from Discovery)

| # | Principle | Validation Status |
|---|-----------|-------------------|
| 1 | Segment-first routing | Confirmed. 1-click from homepage to any segment page. |
| 2 | Proof over promise | Confirmed. Sample binders, analyst review detail, intelligence methodology surface before generic claims. |
| 3 | Institutional buyer mental model | Confirmed. Buying journey stages (Understand, Evaluate, Validate, Procure) map to navigation sections. |
| 4 | Progressive disclosure of complexity | Enhanced in this analysis. Three-layer depth model specified with component-level triggers. |
| 5 | Dual-audience navigation | Confirmed. Primary nav for evaluators/decision-makers; utility nav for procurement/returning visitors. |
| 6 | SEO-driven content hubs | Enhanced in this analysis. Cluster architecture with automated cross-linking rules specified. |

---

## 2. Complete Sitemap with All URLs

### 2.1 Full URL Inventory (Launch)

```
safetrekr.com/
|
+-- HOMEPAGE
|   /                                                    [Core Page]
|
+-- PLATFORM (Product Capabilities)
|   /platform                                            [Core Page - Section Landing]
|   /platform/analyst-review                             [Feature Page]
|   /platform/risk-intelligence                          [Feature Page]
|   /platform/safety-binder                              [Feature Page]
|   /platform/mobile-app                                 [Feature Page]
|   /platform/monitoring                                 [Feature Page]
|   /platform/compliance                                 [Feature Page]
|
+-- SOLUTIONS (Segment Landing Pages)
|   /solutions                                           [Core Page - Section Landing]
|   /solutions/k12                                       [Segment Landing Page]
|   /solutions/higher-education                          [Segment Landing Page]
|   /solutions/churches                                  [Segment Landing Page]
|   /solutions/corporate                                 [Segment Landing Page]
|
+-- HOW IT WORKS
|   /how-it-works                                        [Core Page]
|
+-- PRICING
|   /pricing                                             [Core Page]
|
+-- RESOURCES (Content Hub)
|   /resources                                           [Core Page - Section Landing]
|   /resources/case-studies                               [Index Page]
|   /resources/case-studies/[slug]                        [Case Study Detail]
|   /resources/guides                                    [Index Page]
|   /resources/guides/[slug]                             [Guide Detail]
|   /resources/sample-binders                            [Index Page]
|   /resources/sample-binders/k12-field-trip             [Sample Binder Detail]
|   /resources/sample-binders/mission-trip               [Sample Binder Detail]
|   /resources/sample-binders/corporate-travel           [Sample Binder Detail]
|   /resources/sample-binders/study-abroad               [Sample Binder Detail]
|   /resources/webinars                                  [Index Page]
|   /resources/webinars/[slug]                           [Webinar Detail]
|   /resources/roi-calculator                            [Interactive Tool]
|   /resources/faq                                       [FAQ Page]
|
+-- BLOG (SEO Content Hub)
|   /blog                                                [Blog Index]
|   /blog/[slug]                                         [Blog Post]
|   /blog/category/[category]                            [Blog Category Index]
|   /blog/tag/[tag]                                      [Blog Tag Index]
|
+-- COMPARE (Comparison Pages -- NEW)
|   /compare                                             [Comparison Hub]
|   /compare/diy-spreadsheets                            [Comparison Page]
|   /compare/logistics-apps                              [Comparison Page]
|   /compare/travel-management                           [Comparison Page]
|
+-- COMPLIANCE (Regulatory Guides -- NEW)
|   /compliance/ferpa                                    [Compliance Guide]
|   /compliance/clery-act                                [Compliance Guide]
|   /compliance/coppa                                    [Compliance Guide]
|   /compliance/gdpr                                     [Compliance Guide]
|
+-- GLOSSARY (Knowledge Base -- NEW)
|   /glossary                                            [Glossary Index]
|   /glossary/[term]                                     [Glossary Term]
|
+-- COMPANY
|   /about                                               [Core Page]
|   /about/analysts                                      [Core Page]
|   /security                                            [Core Page]
|   /procurement                                         [Core Page]
|   /contact                                             [Core Page]
|
+-- LEGAL
|   /legal/terms                                         [Legal Page]
|   /legal/privacy                                       [Legal Page]
|   /legal/dpa                                           [Legal Page]
|   /legal/acceptable-use                                [Legal Page]
|   /legal/cookies                                       [Legal Page]
|
+-- UTILITY PAGES
|   /demo                                                [Form Page]
|   /get-started                                         [Form Page]
|   /partners                                            [Core Page]
|   /status                                              [External Redirect]
|
+-- CAMPAIGN LANDING PAGES (noindex)
|   /lp/[campaign-slug]                                  [Landing Page - noindex]
|
+-- SYSTEM PAGES
    /404                                                 [Error Page]
    /500                                                 [Error Page]
    /sitemap.xml                                         [XML Sitemap]
    /robots.txt                                          [Robots]
```

### 2.2 Page Count Summary (Updated)

| Section | Pages at Launch | Pages at 6 Months | Pages at 12 Months |
|---------|:-:|:-:|:-:|
| Homepage | 1 | 1 | 1 |
| Platform | 7 | 7-9 | 7-9 |
| Solutions | 5 | 5-8 | 5-8 |
| How It Works | 1 | 1 | 1 |
| Pricing | 1 | 1-2 | 1-2 |
| Resources | 10-14 | 25-40 | 40-60 |
| Blog | 0-4 (seed) | 25-40 | 50-100 |
| Compare | 0 | 3-4 | 4-6 |
| Compliance | 0 | 2-4 | 4-6 |
| Glossary | 0 | 0-10 | 30-50 |
| Company | 5 | 5-6 | 5-6 |
| Legal | 5 | 5-6 | 5-6 |
| Utility | 3-4 | 4-6 | 5-8 |
| Campaign LPs | 0 | 2-4 | 5-10 |
| System | 3 | 3 | 3 |
| **Total** | **41-49** | **88-142** | **162-273** |

### 2.3 Next.js App Router File Structure

```
app/
  layout.tsx                         # Root layout (nav, footer, analytics, JSON-LD Organization)
  page.tsx                           # Homepage
  not-found.tsx                      # 404
  error.tsx                          # 500
  sitemap.ts                         # Dynamic XML sitemap generation
  robots.ts                          # Robots.txt generation

  platform/
    page.tsx                         # /platform
    analyst-review/page.tsx          # /platform/analyst-review
    risk-intelligence/page.tsx       # /platform/risk-intelligence
    safety-binder/page.tsx           # /platform/safety-binder
    mobile-app/page.tsx              # /platform/mobile-app
    monitoring/page.tsx              # /platform/monitoring
    compliance/page.tsx              # /platform/compliance

  solutions/
    page.tsx                         # /solutions
    k12/page.tsx                     # /solutions/k12
    higher-education/page.tsx        # /solutions/higher-education
    churches/page.tsx                # /solutions/churches
    corporate/page.tsx               # /solutions/corporate

  how-it-works/
    page.tsx                         # /how-it-works

  pricing/
    page.tsx                         # /pricing

  resources/
    page.tsx                         # /resources
    case-studies/
      page.tsx                       # /resources/case-studies
      [slug]/page.tsx                # /resources/case-studies/[slug]
    guides/
      page.tsx                       # /resources/guides
      [slug]/page.tsx                # /resources/guides/[slug]
    sample-binders/
      page.tsx                       # /resources/sample-binders
      [slug]/page.tsx                # /resources/sample-binders/[slug]
    webinars/
      page.tsx                       # /resources/webinars
      [slug]/page.tsx                # /resources/webinars/[slug]
    roi-calculator/page.tsx          # /resources/roi-calculator
    faq/page.tsx                     # /resources/faq

  blog/
    page.tsx                         # /blog
    [slug]/page.tsx                  # /blog/[slug]
    category/[category]/page.tsx     # /blog/category/[category]
    tag/[tag]/page.tsx               # /blog/tag/[tag]

  compare/
    page.tsx                         # /compare
    [slug]/page.tsx                  # /compare/[slug]

  compliance/
    [regulation]/page.tsx            # /compliance/[regulation]

  glossary/
    page.tsx                         # /glossary
    [term]/page.tsx                  # /glossary/[term]

  about/
    page.tsx                         # /about
    analysts/page.tsx                # /about/analysts

  security/page.tsx                  # /security
  procurement/page.tsx               # /procurement
  contact/page.tsx                   # /contact
  demo/page.tsx                      # /demo
  get-started/page.tsx               # /get-started
  partners/page.tsx                  # /partners

  lp/
    [campaign]/page.tsx              # /lp/[campaign] (noindex layout)

  legal/
    terms/page.tsx                   # /legal/terms
    privacy/page.tsx                 # /legal/privacy
    dpa/page.tsx                     # /legal/dpa
    acceptable-use/page.tsx          # /legal/acceptable-use
    cookies/page.tsx                 # /legal/cookies
```

### 2.4 Hierarchy Depth Analysis

| Level | Content Type | Example URL | Click Distance from Home |
|:---:|---|---|:---:|
| L0 | Homepage | `/` | 0 |
| L1 | Section landing | `/platform`, `/solutions`, `/pricing` | 1 |
| L2 | Detail page | `/platform/analyst-review`, `/solutions/k12` | 1-2 |
| L3 | Content item | `/resources/case-studies/springfield-unified` | 2-3 |
| L4 | Filtered view | `/blog/category/k12-compliance` | 2-3 |

**Maximum depth**: 4 levels. **Maximum clicks to any content**: 3. **Average clicks to conversion-critical content**: 2.

---

## 3. Navigation System

### 3.1 Navigation Systems Overview

| System | Purpose | Visibility | Estimated Items | Priority |
|--------|---------|------------|:---:|:---:|
| **Primary Nav** | Main site sections | All pages, sticky header | 5 items + dropdowns | P0 |
| **Utility Nav** | Quick-access for returning visitors and procurement | All pages, top-right | 3 items | P0 |
| **Footer Nav** | Comprehensive site links, legal, trust signals | All pages, bottom | 30-35 links | P0 |
| **Mobile Nav** | Drawer-based primary + utility | Mobile/tablet (<1024px) | Same as primary, vertical | P0 |
| **In-Page Nav** | Section anchors on long-form pages | Long pages (>3 screens) | 4-8 anchors | P1 |
| **Breadcrumbs** | Location indicator and hierarchy wayfinding | L2+ pages | Dynamic | P0 |
| **Contextual Nav** | Related content and next-step prompts | Content pages | 3-6 links | P1 |
| **Campaign Nav** | Stripped nav for landing pages (logo + CTA only) | `/lp/*` pages | 2 items | P2 |

### 3.2 Primary Navigation (Desktop) -- Implementation Spec

```
+-------+                                                               +---+
| Logo  |  Platform v   Solutions v   How It Works   Pricing   Resources v   | For Procurement |  Log In  [ Get a Demo ]
+-------+                                                               +---+
```

**Behavior specification**:

| Attribute | Value |
|-----------|-------|
| Position | `sticky top-0`, visible on scroll |
| Height | 64px desktop, 56px mobile |
| Z-index | `z-50` |
| Background | `bg-white/95 backdrop-blur-sm` (light), `border-b border-neutral-200` |
| Logo | SVG, links to `/`, `aria-label="SafeTrekr home"` |
| Active state | `font-semibold text-primary-600`, underline indicator |
| Hover state | `text-primary-500`, dropdown triggers on hover (desktop), on click (touch) |
| Dropdown trigger | `aria-expanded="true|false"`, `aria-haspopup="true"` |
| Dropdown delay | 150ms open, 300ms close (desktop hover) |
| CTA button | `bg-primary-600 text-white` pill, persistent on all viewports |
| Scroll behavior | Header collapses from 80px to 64px on scroll; shadow appears (`shadow-sm`) |

#### 3.2.1 Platform Mega-Menu

```
+---------------------------------------------------------------------------+
| PLATFORM                                                                  |
|---------------------------------------------------------------------------|
|                                                                           |
|  THE SAFETREKR PLATFORM           CAPABILITIES                            |
|  +-------------------------+                                              |
|  | [Platform Overview img] |      Analyst Safety Review                   |
|  | See how SafeTrekr       |      17-section professional review          |
|  | protects every trip     |      of every trip plan                      |
|  |                         |                                              |
|  | -> Explore Platform     |      Risk Intelligence Engine                |
|  +-------------------------+      Monte Carlo scoring from 5 govt sources |
|                                                                           |
|                                   Trip Safety Binder                      |
|                                   Audit-ready documentation               |
|                                   with hash-chain integrity               |
|                                                                           |
|                                   Mobile Field Operations                 |
|                                   Live tracking, geofencing,              |
|                                   rally points, SMS broadcast             |
|                                                                           |
|                                   Real-Time Monitoring                    |
|                                   Geofence alerts, muster check-ins,     |
|                                   participant location visibility         |
|                                                                           |
|                                   Compliance & Evidence                   |
|                                   FERPA, SOC 2, GDPR, tamper-evident     |
|                                   audit trail with purge proofs           |
+---------------------------------------------------------------------------+
```

**Component**: `MegaMenuPlatform`
**Layout**: 2-column grid. Left: featured card (280px). Right: 6-item list with icon + title + description.
**Each capability item**: Icon (24x24), title (link to feature page), 1-line description (text-muted).
**Keyboard**: Arrow keys navigate items. Escape closes. Tab moves through items sequentially.
**Focus trap**: Focus contained within panel when open. Return focus to trigger on close.

#### 3.2.2 Solutions Mega-Menu

```
+---------------------------------------------------------------------------+
| SOLUTIONS                                                                 |
|---------------------------------------------------------------------------|
|                                                                           |
|  BY ORGANIZATION TYPE                                                     |
|                                                                           |
|  [school icon]                    [university icon]                       |
|  K-12 Schools & Districts         Higher Education                        |
|  FERPA-compliant trip safety      Study abroad, Clery Act,               |
|  for field trips and travel       international program safety            |
|                                                                           |
|  [church icon]                    [building icon]                         |
|  Churches & Mission Orgs          Corporate & Sports Teams                |
|  Mission trip safety with         Duty of care compliance                 |
|  volunteer and youth protections  for business and team travel            |
|                                                                           |
|  -----------------------------------------------------------------        |
|  "Every trip reviewed. Every risk scored. Every document audit-ready."    |
|  [ See How It Works -> ]                                                  |
+---------------------------------------------------------------------------+
```

**Component**: `MegaMenuSolutions`
**Layout**: 2x2 grid of segment cards. Bottom: tagline + CTA link.
**Each segment card**: Icon (32x32), segment name (link), 2-line description.
**Behavior**: Cards link directly to segment landing pages. Bottom CTA links to `/how-it-works`.

#### 3.2.3 Resources Dropdown

```
+-------------------------------+
| RESOURCES                     |
|-------------------------------|
|  Case Studies                 |
|  Guides & Whitepapers         |
|  Sample Binders               |
|  Webinars                     |
|  FAQ                          |
|  ROI Calculator               |
|  -------------------------    |
|  Blog ->                      |
+-------------------------------+
```

**Component**: `DropdownResources`
**Layout**: Single-column link list. Blog separated by divider (appears as external to Resources section).
**Each item**: Text link, no icons, 14px type. Active item shows check or arrow.

### 3.3 Utility Navigation

| Item | URL | Aria-Label | Visual Treatment |
|------|-----|------------|------------------|
| For Procurement | `/procurement` | "Procurement resources and vendor documents" | Text link, `text-sm text-neutral-600` |
| Log In | `https://app.safetrekr.com` | "Log in to SafeTrekr" | Text link, `text-sm text-neutral-600`, `target="_blank"` |
| Get a Demo | `/demo` | "Request a SafeTrekr demo" | `bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium` |

### 3.4 Footer Navigation -- Implementation Spec

```
+===========================================================================+
|                                                                           |
| PLATFORM              SOLUTIONS             RESOURCES                     |
| Platform Overview     K-12 Schools          Case Studies                  |
| Analyst Review        Higher Education      Guides                        |
| Risk Intelligence     Churches & Mission    Sample Binders                |
| Safety Binder         Corporate & Sports    Webinars                      |
| Mobile App                                  FAQ                           |
| Monitoring            HOW IT WORKS          ROI Calculator                |
| Compliance            How It Works          Blog                          |
|                                                                           |
| COMPANY               LEGAL                 SUPPORT                       |
| About SafeTrekr       Terms of Service      Contact Us                    |
| Our Analysts          Privacy Policy        For Procurement               |
| Security & Trust      DPA                   Status Page                   |
| Partners              Acceptable Use        Glossary                      |
|                       Cookie Policy                                       |
|                                                                           |
| COMPARE (when available)                                                  |
| vs. DIY Spreadsheets                                                      |
| vs. Logistics Apps                                                        |
| vs. Travel Management                                                     |
|                                                                           |
+---------------------------------------------------------------------------+
| [Logo]  [LinkedIn] [Twitter/X]                                            |
|                                                                           |
| (c) 2026 SafeTrekr. All rights reserved.                                  |
| SOC 2 | FERPA | GDPR | AES-256 | SHA-256 Evidence Chain                   |
|                                                                           |
| Data sourced from: NOAA | USGS | CDC | GDACS | ReliefWeb                 |
+---------------------------------------------------------------------------+
```

**Component**: `FooterNav`
**Layout**: 6-column grid at desktop (`grid-cols-6`), 2-column at tablet (`md:grid-cols-2`), single column at mobile.
**Trust signals row**: Compliance badges as icons with tooltips. Data source logos with "Powered by data from" label.
**Semantic markup**: `<footer>` with `<nav aria-label="Footer navigation">`. Each column is a `<section>` with `<h3>` heading.

### 3.5 Mobile Navigation (Drawer) -- Implementation Spec

```
+-------------------------------+
| [X Close]            [Logo]   |
|-------------------------------|
|                               |
| Platform                  [v] |
|   Platform Overview           |
|   Analyst Safety Review       |
|   Risk Intelligence Engine    |
|   Trip Safety Binder          |
|   Mobile Field Operations     |
|   Real-Time Monitoring        |
|   Compliance & Evidence       |
|                               |
| Solutions                 [v] |
|   K-12 Schools & Districts    |
|   Higher Education            |
|   Churches & Mission Orgs     |
|   Corporate & Sports Teams    |
|                               |
| How It Works                  |
| Pricing                       |
|                               |
| Resources                 [v] |
|   Case Studies                |
|   Guides & Whitepapers        |
|   Sample Binders              |
|   FAQ                         |
|   Blog                        |
|                               |
| ----------------------------  |
| For Procurement               |
| Log In                        |
|                               |
| [ Get a Demo ]  (full width)  |
+-------------------------------+
```

**Component**: `MobileNavDrawer`
**Trigger**: Hamburger icon (`Menu` icon, 24x24), top-right of mobile header.
**Behavior**:
- Slides in from right (`translate-x-full -> translate-x-0`)
- `300ms ease-out` transition
- Body scroll locked when open (`overflow: hidden` on `<body>`)
- Backdrop overlay (`bg-black/50`)
- Sections expand/collapse as accordions (single-expand mode)
- Close on: X button, Escape key, backdrop click, navigation to new page
- Focus trapped within drawer

**Accessibility**:
- `role="dialog"`, `aria-modal="true"`, `aria-label="Main navigation"`
- First focusable element: Close button
- Escape key closes drawer
- Return focus to hamburger trigger on close
- Respects `prefers-reduced-motion` (disables slide animation)

### 3.6 In-Page Navigation -- Implementation Spec

**Applied to**: Segment landing pages, feature pages, How It Works, Security & Trust, FAQ, any page >3 viewport heights.

```
+------------------------------------------+
| ON THIS PAGE                             |
| ---------------------------------------- |
| * The Challenge                          |
| * How SafeTrekr Solves It          [active] |
| * Proof Points                           |
| * Sample Binder Preview                  |
| * Pricing                                |
| * Compliance & Trust                     |
| * Common Questions                       |
+------------------------------------------+
```

**Component**: `InPageNav` (also known as "Table of Contents" or "sticky sidebar nav")
**Position**: Sticky sidebar on desktop (left or right, depending on layout), collapsible bar below header on mobile.
**Behavior**:
- Auto-generated from H2 headings on the page
- Active section highlighted based on scroll position (`IntersectionObserver`)
- Smooth scroll to section on click
- Mobile: collapsed by default, expands on tap, auto-collapses after selection
- Uses `scroll-margin-top: 80px` to account for sticky header

### 3.7 Breadcrumb Strategy -- Implementation Spec

| Page Type | Breadcrumb Pattern | Schema |
|-----------|-------------------|:---:|
| L1 Section landing | `Home` (no breadcrumb shown) | No |
| L2 Feature page | `Home > Platform > [Feature Name]` | Yes |
| L2 Segment page | `Home > Solutions > [Segment Name]` | Yes |
| L3 Case study | `Home > Resources > Case Studies > [Title]` | Yes |
| L3 Guide detail | `Home > Resources > Guides > [Title]` | Yes |
| L3 Blog post | `Home > Blog > [Post Title]` | Yes |
| L3 Blog category | `Home > Blog > [Category Name]` | Yes |
| L3 Comparison page | `Home > Compare > [Title]` | Yes |
| L3 Compliance guide | `Home > Compliance > [Regulation Name]` | Yes |
| L3 Glossary term | `Home > Glossary > [Term]` | Yes |
| L2 Legal page | `Home > Legal > [Policy Name]` | Yes |

**Component**: `Breadcrumbs`

**Implementation rules**:
1. Breadcrumbs render on all L2+ pages
2. Homepage and L1 section landings do not show breadcrumbs
3. Mobile (<640px): Collapse to `< Back to [Parent]` link
4. Every breadcrumb page emits `BreadcrumbList` JSON-LD
5. Current page is the last item, rendered as text (not a link), with `aria-current="page"`
6. Semantic markup: `<nav aria-label="Breadcrumb">` wrapping an `<ol>`

**Dynamic breadcrumb enhancement** (see Enhancement Proposal #2): When a user arrives at a blog post from a segment page, the breadcrumb contextually shows `Home > K-12 Schools > Blog > [Title]` instead of the default `Home > Blog > [Title]`. Implementation via `referer` header or URL query parameter (`?from=k12`).

---

## 4. Content Model

### 4.1 Content Types -- Complete Field Specification

#### Core Page

| Field | Type | Required | Description |
|-------|------|:---:|-------------|
| `title` | `string` | Yes | Page title (H1) |
| `slug` | `string` | Yes | URL path segment |
| `meta_title` | `string` | Yes | SEO title tag (max 60 chars) |
| `meta_description` | `string` | Yes | SEO meta description (max 160 chars) |
| `og_image` | `string (URL)` | Yes | Open Graph image (1200x630) |
| `og_title` | `string` | No | Override for OG title (defaults to `meta_title`) |
| `og_description` | `string` | No | Override for OG description (defaults to `meta_description`) |
| `sections` | `Section[]` | Yes | Ordered array of page sections |
| `cta_config` | `CTAConfig` | Yes | Page-level CTA configuration |
| `segment_tags` | `SegmentTag[]` | No | Segments this page is relevant to |
| `noindex` | `boolean` | No | If `true`, page gets `noindex` robots tag |
| `canonical_url` | `string` | No | Override canonical URL |
| `json_ld` | `JsonLdConfig` | No | Page-specific structured data |
| `last_updated` | `date` | Yes | Content last-modified date |
| `ai_summary` | `string` | Yes | 40-60 word factual summary for AI citation (placed in first 150 words) |

#### Segment Landing Page

| Field | Type | Required | Description |
|-------|------|:---:|-------------|
| `title` | `string` | Yes | H1, pattern: "Trip Safety for [Segment]" |
| `slug` | `string` | Yes | e.g., `k12`, `higher-education`, `churches`, `corporate` |
| `segment_id` | `enum` | Yes | `k12 | higher-ed | churches | corporate` |
| `hero_config` | `HeroConfig` | Yes | Headline, sub-headline, primary CTA, secondary CTA, background treatment |
| `pain_points` | `PainPoint[]` | Yes | 3-4 segment-specific pain points with icon, title, description |
| `status_quo_contrast` | `StatusQuoBlock` | Yes | "What [segment] currently does" vs. SafeTrekr framing |
| `features_highlighted` | `FeatureRef[]` | Yes | 3-4 features with segment-specific benefit copy |
| `case_study_ref` | `string | null` | No | Slug reference to a case study |
| `testimonial_ref` | `string | null` | No | Reference to a verified testimonial |
| `sample_binder_ref` | `string` | Yes | Slug reference to the segment-specific sample binder |
| `pricing_context` | `PricingContext` | Yes | Per-student/per-participant price, comparison anchor, CTA to pricing |
| `compliance_badges` | `ComplianceBadge[]` | Yes | Segment-relevant compliance badges |
| `faq_items` | `FAQItem[]` | Yes | 5-8 segment-specific FAQ items |
| `cta_config` | `CTAConfig` | Yes | End-of-page conversion CTA |
| `meta_title` | `string` | Yes | SEO title |
| `meta_description` | `string` | Yes | SEO meta description |
| `og_image` | `string` | Yes | Segment-specific OG image |
| `json_ld` | `FAQPage` | Yes | FAQ schema for segment questions |
| `ai_summary` | `string` | Yes | AI-citeable summary paragraph |
| `related_blog_posts` | `string[]` | No | Blog post slugs tagged with this segment |
| `decision_makers` | `DecisionMaker[]` | No | Stakeholder roles for this segment |

#### Feature Page

| Field | Type | Required | Description |
|-------|------|:---:|-------------|
| `title` | `string` | Yes | Feature marketing name |
| `slug` | `string` | Yes | URL segment under `/platform/` |
| `feature_id` | `string` | Yes | Internal feature identifier |
| `hero_config` | `HeroConfig` | Yes | Feature headline, sub-headline, visual |
| `capability_details` | `Capability[]` | Yes | 4-6 capabilities with title, description, visual |
| `proof_points` | `ProofPoint[]` | Yes | Quantified evidence (e.g., "17 sections", "5 sources") |
| `screenshots` | `Screenshot[]` | No | Product visuals (when available) |
| `video_url` | `string` | No | Demo video URL |
| `related_features` | `string[]` | Yes | Slugs of 2-3 related feature pages |
| `segment_relevance` | `SegmentRelevance[]` | Yes | Which segments this feature serves, with segment-specific benefit copy |
| `technical_depth` | `TechnicalDetail[]` | No | Deep-dive content for evaluators (progressive disclosure) |
| `cta_config` | `CTAConfig` | Yes | End-of-page CTA |
| `meta_title` | `string` | Yes | SEO title |
| `meta_description` | `string` | Yes | SEO description |
| `ai_summary` | `string` | Yes | AI-citeable summary |

#### Blog Post

| Field | Type | Required | Description |
|-------|------|:---:|-------------|
| `title` | `string` | Yes | Post title |
| `slug` | `string` | Yes | URL segment under `/blog/` |
| `author_ref` | `string` | Yes | Reference to author profile |
| `publish_date` | `date` | Yes | ISO 8601 date |
| `updated_date` | `date` | No | Last substantive update |
| `categories` | `string[]` | Yes | 1-2 category slugs |
| `tags` | `string[]` | No | Tag slugs |
| `segment_tags` | `SegmentTag[]` | No | Segment relevance |
| `excerpt` | `string` | Yes | 150-200 char summary |
| `body` | `MDX` | Yes | Full post content |
| `featured_image` | `ImageConfig` | Yes | Hero image with alt text |
| `cta_config` | `CTAConfig` | Yes | End-of-post CTA |
| `related_posts` | `string[]` | No | 2-3 related post slugs |
| `pillar_page_ref` | `string` | No | Slug of parent pillar page (for cluster linking) |
| `seo_config` | `SEOConfig` | Yes | Title, description, canonical, noindex |
| `ai_summary` | `string` | Yes | AI-citeable paragraph |
| `reading_time` | `number` | Yes | Estimated minutes |
| `content_score` | `number` | No | Editorial quality score (see Enhancement #7) |

#### Case Study

| Field | Type | Required | Description |
|-------|------|:---:|-------------|
| `title` | `string` | Yes | Organization name + result headline |
| `slug` | `string` | Yes | URL segment |
| `organization_type` | `string` | Yes | Type of org |
| `segment_tags` | `SegmentTag[]` | Yes | Relevant segments |
| `challenge` | `string (rich)` | Yes | Problem description |
| `solution` | `string (rich)` | Yes | How SafeTrekr solved it |
| `results_metrics` | `Metric[]` | Yes | 2-4 quantified results |
| `quote` | `QuoteBlock` | No | Customer quote with attribution |
| `logo` | `string (URL)` | No | Organization logo |
| `features_used` | `string[]` | Yes | Feature slugs used |
| `cta_config` | `CTAConfig` | Yes | End CTA |
| `meta_title` | `string` | Yes | SEO title |
| `meta_description` | `string` | Yes | SEO description |

#### Guide / Whitepaper

| Field | Type | Required | Description |
|-------|------|:---:|-------------|
| `title` | `string` | Yes | Resource title |
| `slug` | `string` | Yes | URL segment |
| `format` | `enum` | Yes | `guide | whitepaper | checklist | toolkit` |
| `segment_tags` | `SegmentTag[]` | Yes | Relevant segments |
| `topic_tags` | `string[]` | No | Topic classification |
| `excerpt` | `string` | Yes | 150-200 char summary |
| `body` | `MDX | null` | Conditional | Web-readable version |
| `pdf_url` | `string | null` | Conditional | Downloadable PDF |
| `gated` | `boolean` | Yes | Whether download requires email |
| `gate_form_config` | `GateFormConfig` | Conditional | Form fields for gated content |
| `cta_config` | `CTAConfig` | Yes | End CTA |

#### Sample Binder

| Field | Type | Required | Description |
|-------|------|:---:|-------------|
| `title` | `string` | Yes | Descriptive title |
| `slug` | `string` | Yes | URL segment |
| `segment_id` | `enum` | Yes | Target segment |
| `trip_type` | `string` | Yes | e.g., "Elementary School Field Trip" |
| `description` | `string (rich)` | Yes | What the binder contains, why it matters |
| `preview_images` | `ImageConfig[]` | Yes | 3-5 preview thumbnails of binder pages |
| `download_url` | `string` | Yes | PDF download URL |
| `gated` | `boolean` | Yes | Always `true` at launch |
| `gate_form_config` | `GateFormConfig` | Yes | Email + organization type |
| `page_count` | `number` | Yes | Total pages in binder |
| `sections_included` | `string[]` | Yes | Which of the 17 sections are shown |

#### Comparison Page (NEW)

| Field | Type | Required | Description |
|-------|------|:---:|-------------|
| `title` | `string` | Yes | "SafeTrekr vs. [Alternative]" |
| `slug` | `string` | Yes | URL segment under `/compare/` |
| `alternative_name` | `string` | Yes | Name of alternative approach |
| `alternative_type` | `enum` | Yes | `diy | logistics-app | travel-management | competitor` |
| `comparison_matrix` | `ComparisonRow[]` | Yes | Feature-by-feature comparison table |
| `safetrekr_advantages` | `Advantage[]` | Yes | 4-6 key differentiators |
| `switching_cost` | `SwitchingCost` | No | Time/effort to switch |
| `segment_relevance` | `SegmentTag[]` | Yes | Which segments this comparison targets |
| `faq_items` | `FAQItem[]` | Yes | 5-8 comparison-specific questions |
| `cta_config` | `CTAConfig` | Yes | Decision-stage CTA |
| `meta_title` | `string` | Yes | SEO title |
| `meta_description` | `string` | Yes | SEO description |
| `ai_summary` | `string` | Yes | AI-citeable comparison summary |

#### Compliance Guide Page (NEW)

| Field | Type | Required | Description |
|-------|------|:---:|-------------|
| `title` | `string` | Yes | Regulation name and context |
| `slug` | `string` | Yes | URL segment under `/compliance/` |
| `regulation_id` | `string` | Yes | e.g., `ferpa`, `clery-act`, `coppa`, `gdpr` |
| `summary` | `string` | Yes | Plain-language regulation summary |
| `how_safetrekr_helps` | `ComplianceMapping[]` | Yes | Regulation requirement -> SafeTrekr capability mapping |
| `relevant_segments` | `SegmentTag[]` | Yes | Which segments this regulation affects |
| `faq_items` | `FAQItem[]` | Yes | 8-12 regulation-specific questions |
| `resources` | `ResourceRef[]` | No | Links to official regulation text, guides |
| `cta_config` | `CTAConfig` | Yes | Evaluation-stage CTA |
| `json_ld` | `FAQPage` | Yes | FAQ schema |
| `ai_summary` | `string` | Yes | AI-citeable regulation context |

#### Glossary Term (NEW)

| Field | Type | Required | Description |
|-------|------|:---:|-------------|
| `term` | `string` | Yes | Canonical term |
| `slug` | `string` | Yes | URL segment under `/glossary/` |
| `definition` | `string (rich)` | Yes | Plain-language definition |
| `synonyms` | `string[]` | No | Alternative terms that redirect |
| `related_terms` | `string[]` | No | Other glossary term slugs |
| `related_features` | `string[]` | No | Feature page slugs |
| `segment_relevance` | `SegmentTag[]` | No | Segments where this term is prominent |
| `json_ld` | `DefinedTerm` | Yes | Schema.org `DefinedTerm` |
| `ai_summary` | `string` | Yes | AI-citeable definition |

#### FAQ Item

| Field | Type | Required | Description |
|-------|------|:---:|-------------|
| `id` | `string` | Yes | Unique identifier |
| `question` | `string` | Yes | The question (conversational, search-friendly) |
| `answer` | `string (rich)` | Yes | The answer (40-80 words, factual, direct) |
| `category` | `string` | Yes | e.g., `pricing`, `process`, `compliance`, `security`, `general` |
| `segment_tags` | `SegmentTag[]` | No | Segments this FAQ is relevant to |
| `sort_order` | `number` | Yes | Display order within category |
| `related_page` | `string` | No | URL of page that answers in depth |

#### Pricing Tier

| Field | Type | Required | Description |
|-------|------|:---:|-------------|
| `tier_name` | `string` | Yes | e.g., "Field Trip", "Extended Trip", "International" |
| `trip_type` | `string` | Yes | What type of trip this covers |
| `price` | `number` | Yes | Base price per trip |
| `per_student_price` | `number` | Yes | Computed: `price / typical_group_size` |
| `typical_group_size` | `number` | Yes | Assumed group size for per-student calc |
| `features_included` | `string[]` | Yes | Included capabilities |
| `features_excluded` | `string[]` | No | What is NOT included |
| `cta_label` | `string` | Yes | Button text |
| `cta_url` | `string` | Yes | Button destination |
| `popular` | `boolean` | No | Highlight badge |
| `volume_discount` | `VolumeDiscount` | No | Discount tiers for bulk purchases |

### 4.2 Content Type Relationships (ERD)

```
Homepage
  |-- references --> SegmentLandingPage (x4, via segment cards)
  |-- references --> FeaturePage (x3, via feature highlights)
  |-- embeds ----> ProofStrip (quantified trust metrics)
  |-- links to --> HowItWorks
  |-- links to --> Pricing

SegmentLandingPage
  |-- references --> CaseStudy (filtered by segment_id)
  |-- references --> SampleBinder (filtered by segment_id)
  |-- references --> FeaturePage (3-4 highlighted features)
  |-- references --> PricingTier (segment-specific framing)
  |-- references --> FAQItem (filtered by segment_tags)
  |-- references --> BlogPost (filtered by segment_tags)
  |-- references --> Testimonial (filtered by segment_id, when available)
  |-- links to --> ComplianceGuide (segment-relevant regulations)
  |-- links to --> Procurement

FeaturePage
  |-- references --> SegmentLandingPage (via segment_relevance)
  |-- references --> CaseStudy (proof points)
  |-- references --> FeaturePage (related_features)
  |-- embeds ----> Screenshot, Video
  |-- links to --> GlossaryTerm (technical terms)

BlogPost
  |-- references --> FeaturePage (inline when discussing capabilities)
  |-- references --> SegmentLandingPage (when addressing a segment)
  |-- references --> Guide (deeper reading)
  |-- references --> BlogPost (related_posts)
  |-- belongs to -> BlogCategory
  |-- tagged with > BlogTag
  |-- links up to > SegmentLandingPage (pillar_page_ref for cluster)

ComparisonPage
  |-- references --> FeaturePage (feature-by-feature comparison)
  |-- references --> CaseStudy (proof of switch)
  |-- references --> PricingTier (cost comparison)
  |-- links to --> SegmentLandingPage (segment-specific comparison)

ComplianceGuide
  |-- references --> FeaturePage (capability mapping)
  |-- references --> SegmentLandingPage (affected segments)
  |-- references --> GlossaryTerm (regulation terms)
  |-- links to --> Procurement (compliance docs)

GlossaryTerm
  |-- references --> FeaturePage (related_features)
  |-- references --> GlossaryTerm (related_terms)
  |-- references --> BlogPost (posts that discuss this term)
```

### 4.3 Content Component Library

| Component | Used On | Purpose | Fields |
|-----------|---------|---------|--------|
| `HeroSection` | Homepage, segment, feature, How It Works | Primary above-fold messaging | headline, sub_headline, primary_cta, secondary_cta, bg_treatment, media |
| `ProofStrip` | Homepage, segment, pricing, How It Works | Quantified credibility | metrics: {label, value}[] |
| `FeatureCard` | Platform overview, segment pages, homepage | Capability summary | icon, title, description, url |
| `SegmentCard` | Homepage, solutions overview | Segment routing | icon, segment_name, regulatory_hook, url |
| `TestimonialBlock` | Segment pages, homepage (when real) | Social proof | quote, author_name, author_title, org_name, photo_url, segment_id |
| `CaseStudyPreview` | Segment pages, resources | Case study card | title, org_type, result_metric, excerpt, url |
| `SampleBinderCTA` | Segment pages, How It Works, pricing, blog | Lead magnet | title, description, preview_image, download_cta, gate_config |
| `PricingCard` | Pricing page | Tier comparison | tier_name, price, per_student_price, features, cta, popular |
| `ROICalculator` | Pricing page, resources | Interactive cost comparison | trips_per_year, avg_group_size, current_process, output_savings |
| `ComplianceBadgeRow` | Footer, security page, segment pages | Trust signals | badges: {name, icon, description}[] |
| `CTABanner` | End of every content page (except legal) | Conversion prompt | headline, primary_cta, secondary_cta, variant: discovery/evaluation/decision |
| `FAQAccordion` | FAQ page, segment pages, pricing, comparison | Expandable Q&A | items: FAQItem[], json_ld: boolean |
| `ProcessTimeline` | How It Works | Step-by-step visual | steps: {number, title, description, visual}[] |
| `ComparisonTable` | Compare pages, pricing, segment pages | Feature comparison | columns: {name, features: {name, value}[]}[] |
| `BlogPostCard` | Blog index, segment pages, resources | Post preview | title, excerpt, featured_image, author, date, reading_time, url |
| `InPageNav` | Long-form pages | Section anchors | auto-generated from H2 headings |
| `DataSourceLogos` | Footer, security, platform | Trust building | logos: {name, icon, url}[] |
| `RelatedContent` | Blog, feature pages, case studies | Cross-linking | items: {title, type_label, excerpt, url}[], heading |
| `GlossaryTooltip` | All content pages (NEW) | Inline term definitions | term, definition, glossary_url |

### 4.4 Shared Type Definitions

```typescript
// Segment taxonomy
type SegmentTag = 'k12' | 'higher-ed' | 'churches' | 'corporate';

// CTA configuration
interface CTAConfig {
  primary_label: string;
  primary_url: string;
  secondary_label?: string;
  secondary_url?: string;
  variant: 'discovery' | 'evaluation' | 'decision';
}

// CTA variant mapping
// discovery:  Blog posts, guides, early-funnel   -> "Download Sample Binder" + "See How It Works"
// evaluation: Feature pages, segment pages, case  -> "Get a Demo" + "View Pricing"
// decision:   Pricing, procurement, ROI calc       -> "Get Started" + "Contact Sales"

// Hero configuration
interface HeroConfig {
  headline: string;
  sub_headline: string;
  primary_cta: { label: string; url: string };
  secondary_cta?: { label: string; url: string };
  bg_treatment: 'map' | 'gradient' | 'image' | 'none';
  media?: { type: 'image' | 'video' | 'animation'; src: string; alt: string };
}

// Image configuration
interface ImageConfig {
  src: string;
  alt: string;        // Descriptive, keyword-natural
  width: number;
  height: number;
  caption?: string;
}

// SEO configuration
interface SEOConfig {
  title: string;        // Max 60 chars
  description: string;  // Max 160 chars
  canonical?: string;
  noindex?: boolean;
  og_image?: string;
}
```

---

## 5. Segment Routing Logic

### 5.1 Entry Vector Matrix

| Entry Vector | Detection Method | Routing Behavior |
|--------------|-----------------|------------------|
| **Homepage segment cards** | User clicks segment card | Direct navigation to `/solutions/[segment]` |
| **Solutions mega-menu** | User hovers/clicks segment in nav dropdown | Direct navigation to `/solutions/[segment]` |
| **Organic search** | User lands on segment page from SERP | Already on segment page; segment context persisted |
| **UTM campaign** | URL contains `?segment=k12` (or similar UTM) | Segment context set from URL parameter |
| **Paid ad landing page** | User lands on `/lp/[campaign]` with segment context | Segment-specific LP; navigation suppressed |
| **Blog post with segment tag** | User reads blog post tagged with segment | Segment-contextual CTA appears at post end |
| **Referral link** | Partner or email link with segment param | Segment context set, CTA personalized |
| **Return visit** | `localStorage` stores last-viewed segment | Personalized CTAs on homepage and feature pages |

### 5.2 Segment Context Persistence (NEW)

**Purpose**: Once a visitor demonstrates segment affinity (by visiting a segment page, clicking a segment card, or arriving via a segment-targeted campaign), persist that context to personalize subsequent interactions.

**Implementation**:

```typescript
// Segment context stored in localStorage
interface SegmentContext {
  segment_id: SegmentTag | null;
  detected_at: string;            // ISO timestamp
  detection_method: 'explicit_click' | 'url_param' | 'campaign' | 'inferred';
  confidence: 'high' | 'medium' | 'low';
}

// Detection priority (highest to lowest confidence)
// 1. explicit_click: User clicked a segment card or segment nav item
// 2. url_param: ?segment=k12 in URL
// 3. campaign: UTM parameter mapped to segment
// 4. inferred: User visited blog post tagged with single segment
```

**Personalization rules** (when segment context exists):

| Element | Personalization |
|---------|----------------|
| Homepage hero CTA | Changes from generic "Get a Demo" to "See K-12 Demo" (or relevant segment) |
| Feature page segment relevance | Highlighted segment card moves to first position |
| Blog post end-CTA | Shows segment-specific sample binder |
| Pricing page | Per-student calculation pre-populated for segment's typical group size |
| "See How It Works" | Links to How It Works page with segment-specific example pre-selected |

**Privacy**: No cookies used. `localStorage` only. No PII stored. Cleared on browser data clear. Compliant with GDPR/CCPA (no tracking, no cross-site, no server transmission).

### 5.3 Segment Landing Page Template Architecture

Each of the four segment pages follows an identical section structure with segment-specific content:

```
+============================================================================+
| 1. HERO                                                                    |
|    - Segment-specific headline (addresses primary pain)                    |
|    - Sub-headline with regulatory/compliance context                       |
|    - Primary CTA: "Download [Segment] Sample Binder"                      |
|    - Secondary CTA: "Get a Demo"                                           |
+============================================================================+
| 2. PROOF STRIP                                                             |
|    5 Government Intel Sources | 17 Review Sections | 3-5 Day Turnaround   |
+============================================================================+
| 3. THE CHALLENGE (Problem Statement)                                       |
|    - "What [segment type] currently rely on" (status quo)                  |
|    - Cost/risk of the alternative                                          |
|    - Category contrast (spreadsheets/PDFs vs. professional review)         |
+============================================================================+
| 4. HOW SAFETREKR SOLVES IT (3-4 Features, segment-framed)                  |
|    - Feature card 1 with segment-specific benefit                          |
|    - Feature card 2 with segment-specific benefit                          |
|    - Feature card 3 with segment-specific benefit                          |
|    - (Feature card 4, if relevant)                                         |
+============================================================================+
| 5. SAMPLE BINDER PREVIEW                                                   |
|    - Visual preview (3-5 thumbnails from binder)                           |
|    - "See exactly what you get for $X per [student/participant]"           |
|    - Gated download CTA                                                    |
+============================================================================+
| 6. PROOF POINTS                                                            |
|    - Case study preview (when available) OR                                |
|    - Quantified metrics (review sections, data sources, turnaround)        |
|    - Testimonial block (when verified quote available)                     |
+============================================================================+
| 7. PRICING CONTEXT                                                         |
|    - Per-student/per-participant framing                                   |
|    - Comparison to current spend / litigation cost                         |
|    - Link to full pricing page                                             |
+============================================================================+
| 8. COMPLIANCE & TRUST                                                      |
|    - Segment-relevant compliance badges                                    |
|    - Security posture summary                                              |
|    - Link to /procurement                                                  |
+============================================================================+
| 9. COMMON QUESTIONS (5-8 segment-specific FAQs)                            |
|    - FAQAccordion with FAQPage JSON-LD                                     |
+============================================================================+
| 10. CONVERSION CTA BANNER                                                  |
|     - "Ready to protect your next [trip type]?"                            |
|     - Primary: "Get a Demo"  |  Secondary: "Download Sample Binder"       |
+============================================================================+
```

### 5.4 Segment-Specific Content Parameters

| Parameter | K-12 | Higher Ed | Churches | Corporate |
|-----------|------|-----------|----------|-----------|
| **Headline** | "Every Field Trip Deserves a Safety Analyst" | "Study Abroad Safety You Can Prove to the Board" | "Mission Trip Safety That Goes Beyond Prayer" | "Duty of Care Documentation That Survives Audit" |
| **Regulatory hook** | FERPA, COPPA, board policy | Clery Act, Title IX, study abroad regs | Insurance requirements, SafeSport | OSHA, duty of care, corporate policy |
| **Price framing** | "$15/student" | "$1,250/trip -- less than 1hr of legal counsel" | "$450/trip -- 3% of a $15K mission budget" | "$750/trip -- fraction of a risk consultant day rate" |
| **Status quo contrast** | "Spreadsheets and PDF checklists" | "Scattered across departments" | "Informal planning without documentation" | "Travel management companies at $100K+/yr" |
| **Sample binder trip type** | Elementary school field trip | University study abroad program | 2-week international mission trip | Multi-city corporate offsite |
| **Key features** | Parent portal, FERPA compliance, background checks | Risk intelligence, evidence binder, international coverage | Budget pricing, group management, rally points | Enterprise compliance, evidence docs, mobile app |
| **Decision makers** | Superintendent, risk manager, school board | Provost, risk mgmt, study abroad director | Senior pastor, mission director, insurance committee | Chief risk officer, travel manager, legal |
| **Budget cycle** | Jan-Mar (fall trips), Aug-Oct (spring) | Varies by semester, often annual | Calendar year, Q1 planning | Fiscal year, quarterly budgets |

---

## 6. Cross-Linking Matrix

### 6.1 Directional Cross-Link Specification

This matrix defines every required cross-link relationship. "Required" means the link must exist on every instance of the source page type. "Contextual" means the link appears when content relevance exists.

| Source Page | Target Page(s) | Link Type | Link Context | Priority |
|-------------|----------------|-----------|-------------|:---:|
| **Homepage** | 4 Segment pages | Required | Segment cards section | P0 |
| **Homepage** | Platform overview | Required | Feature highlights section | P0 |
| **Homepage** | How It Works | Required | Hero secondary CTA or mid-page | P0 |
| **Homepage** | Pricing | Required | Footer CTA or pricing mention | P0 |
| **Homepage** | Demo | Required | Hero primary CTA, sticky CTA | P0 |
| **Segment page** | 3-4 Feature pages | Required | "How SafeTrekr Solves It" section | P0 |
| **Segment page** | Matching Case Study | Contextual | Proof points section (when available) | P1 |
| **Segment page** | Matching Sample Binder | Required | Sample binder preview section | P0 |
| **Segment page** | Pricing | Required | Pricing context section | P0 |
| **Segment page** | Procurement | Required | Compliance & trust section | P0 |
| **Segment page** | Matching Compliance Guides | Required | Compliance section | P1 |
| **Segment page** | Segment-tagged Blog Posts | Contextual | Related content sidebar or section | P1 |
| **Segment page** | Demo | Required | End CTA | P0 |
| **Feature page** | 4 Segment pages | Required | "How [Feature] works for your organization" section | P0 |
| **Feature page** | 2-3 Related Features | Required | "Related capabilities" section | P1 |
| **Feature page** | How It Works | Required | Process context link | P1 |
| **Feature page** | Sample Binder (generic) | Required | "See it in action" CTA | P1 |
| **Feature page** | Demo | Required | End CTA | P0 |
| **Feature page** | Glossary Terms | Contextual | Inline tooltips for technical terms | P2 |
| **How It Works** | Platform overview | Required | "Explore the full platform" link | P0 |
| **How It Works** | 4 Segment pages | Required | "See how it works for [segment]" | P0 |
| **How It Works** | Pricing | Required | End-of-process CTA | P0 |
| **How It Works** | Sample Binder | Required | "See a sample binder" CTA | P0 |
| **How It Works** | Demo | Required | End CTA | P0 |
| **Pricing** | ROI Calculator | Required | "Calculate your ROI" link | P0 |
| **Pricing** | Procurement | Required | "Ready to purchase?" link | P0 |
| **Pricing** | Case Studies | Contextual | "See the results" proof section | P1 |
| **Pricing** | How It Works | Required | "How does it work?" FAQ link | P1 |
| **Pricing** | Sample Binder | Required | "See what you get" link | P0 |
| **Pricing** | Demo | Required | CTA per pricing tier | P0 |
| **Blog post** | Matching Segment page | Contextual | Inline link or end CTA (when segment-tagged) | P1 |
| **Blog post** | Relevant Feature page | Contextual | Inline link (when discussing capability) | P1 |
| **Blog post** | Matching Guide | Contextual | "Go deeper" link | P1 |
| **Blog post** | 2-3 Related Posts | Required | Related content section | P1 |
| **Blog post** | Pillar page | Required | Cluster uplink (when `pillar_page_ref` set) | P1 |
| **Blog post** | Sample Binder | Required | End CTA (discovery variant) | P1 |
| **Case study** | Matching Segment page | Required | "More about SafeTrekr for [segment]" | P1 |
| **Case study** | Features used | Required | Inline links to feature pages | P1 |
| **Case study** | Pricing | Required | End CTA | P1 |
| **Comparison page** | Pricing | Required | Cost comparison section | P1 |
| **Comparison page** | Relevant Segment pages | Required | "See how [segment] uses SafeTrekr" | P1 |
| **Comparison page** | Demo | Required | Decision CTA | P1 |
| **Compliance guide** | Matching Segment page | Required | "SafeTrekr for [segment]" | P1 |
| **Compliance guide** | Relevant Feature pages | Required | Compliance capability mapping | P1 |
| **Compliance guide** | Security & Trust | Required | "Learn more about our security posture" | P1 |
| **Procurement** | Pricing | Required | "View pricing" link | P1 |
| **Procurement** | Security & Trust | Required | "Security details" link | P1 |
| **Procurement** | Contact | Required | "Questions?" link | P1 |

### 6.2 Automated Cross-Linking Rules (NEW)

Beyond the explicit matrix above, implement automated cross-linking based on taxonomy:

| Rule | Trigger | Link Generated | Placement |
|------|---------|---------------|-----------|
| **Segment affinity** | Blog post or guide has `segment_tags` | Link to matching segment landing page(s) | End of content, before CTA |
| **Feature mention** | Content body contains feature marketing name | Tooltip or inline link to feature page | First mention only, inline |
| **Glossary term** | Content body contains a term from the glossary | Tooltip with definition + link to glossary page | First mention per page, inline |
| **Pillar cluster** | Blog post has `pillar_page_ref` set | "Part of our [Pillar] guide" badge + link | Below title or in sidebar |
| **Recency** | Blog index, resource pages | Most recent content surfaces first | Index pages, default sort |
| **Segment match** | Visitor has segment context (localStorage) | Segment-relevant content highlighted | Homepage, resources, blog sidebar |

### 6.3 Persistent CTA Variants

| Variant | Used On | Primary CTA | Secondary CTA |
|---------|---------|-------------|---------------|
| **Discovery** | Blog posts, guides, glossary, compliance guides, early-funnel | "Download a Sample Binder" | "See How It Works" |
| **Evaluation** | Feature pages, segment pages, case studies, comparison pages | "Get a Demo" | "View Pricing" |
| **Decision** | Pricing, procurement, ROI calculator | "Get Started" | "Contact Sales" |

**Implementation**: `CTABanner` component receives `variant` prop. Each variant maps to predefined copy and link targets. Segment context (if available) further personalizes the sample binder CTA (e.g., "Download the K-12 Sample Binder" instead of generic).

---

## 7. URL Architecture with Redirect Strategy

### 7.1 URL Design Rules

| Rule | Specification | Example |
|------|---------------|---------|
| Case | All lowercase | `/platform/analyst-review` |
| Separator | Hyphens between words | `/risk-intelligence` not `/risk_intelligence` |
| Trailing slash | No trailing slash (canonical) | `/pricing` not `/pricing/` |
| File extensions | None | `/about` not `/about.html` |
| Query params | Reserved for filters, UTM, and segment context | `?segment=k12&utm_source=google` |
| Max segments | 3 path segments for core pages | `/resources/case-studies/springfield` |
| Slug format | 3-8 words, descriptive, keyword-front-loaded | `/blog/ferpa-compliance-school-travel` |
| Date in URLs | Never (evergreen content) | `/blog/title` not `/blog/2026/03/title` |
| IDs in URLs | Never (human-readable slugs only) | `/solutions/k12` not `/solutions?id=1` |

### 7.2 Complete Redirect Map

All redirects are 301 (Permanent). Implemented in `next.config.ts` `redirects` array.

```typescript
// next.config.ts
const redirects = async () => [
  // Platform section aliases
  { source: '/features', destination: '/platform', permanent: true },
  { source: '/product', destination: '/platform', permanent: true },
  { source: '/features/:slug', destination: '/platform/:slug', permanent: true },
  { source: '/features/trip-binder', destination: '/platform/safety-binder', permanent: true },
  { source: '/features/mobile', destination: '/platform/mobile-app', permanent: true },
  { source: '/mobile', destination: '/platform/mobile-app', permanent: true },
  { source: '/features/geofencing', destination: '/platform/monitoring', permanent: true },
  { source: '/compliance', destination: '/platform/compliance', permanent: true },

  // Solutions aliases
  { source: '/solutions/k-12', destination: '/solutions/k12', permanent: true },
  { source: '/solutions/schools', destination: '/solutions/k12', permanent: true },
  { source: '/k12', destination: '/solutions/k12', permanent: true },
  { source: '/solutions/higher-ed', destination: '/solutions/higher-education', permanent: true },
  { source: '/solutions/universities', destination: '/solutions/higher-education', permanent: true },
  { source: '/higher-education', destination: '/solutions/higher-education', permanent: true },
  { source: '/solutions/church', destination: '/solutions/churches', permanent: true },
  { source: '/solutions/mission', destination: '/solutions/churches', permanent: true },
  { source: '/churches', destination: '/solutions/churches', permanent: true },
  { source: '/solutions/business', destination: '/solutions/corporate', permanent: true },
  { source: '/solutions/sports', destination: '/solutions/corporate', permanent: true },
  { source: '/corporate', destination: '/solutions/corporate', permanent: true },

  // Process page aliases
  { source: '/process', destination: '/how-it-works', permanent: true },
  { source: '/how-safetrekr-works', destination: '/how-it-works', permanent: true },

  // Pricing aliases
  { source: '/plans', destination: '/pricing', permanent: true },
  { source: '/pricing-plans', destination: '/pricing', permanent: true },

  // Resource section aliases
  { source: '/case-studies', destination: '/resources/case-studies', permanent: true },
  { source: '/case-studies/:slug', destination: '/resources/case-studies/:slug', permanent: true },
  { source: '/guides', destination: '/resources/guides', permanent: true },
  { source: '/whitepapers', destination: '/resources/guides', permanent: true },
  { source: '/sample-binders', destination: '/resources/sample-binders', permanent: true },
  { source: '/webinars', destination: '/resources/webinars', permanent: true },
  { source: '/faq', destination: '/resources/faq', permanent: true },
  { source: '/roi-calculator', destination: '/resources/roi-calculator', permanent: true },
  { source: '/roi', destination: '/resources/roi-calculator', permanent: true },

  // Company section aliases
  { source: '/about-us', destination: '/about', permanent: true },
  { source: '/company', destination: '/about', permanent: true },
  { source: '/team', destination: '/about/analysts', permanent: true },
  { source: '/our-team', destination: '/about/analysts', permanent: true },
  { source: '/analysts', destination: '/about/analysts', permanent: true },
  { source: '/trust', destination: '/security', permanent: true },
  { source: '/trust-center', destination: '/security', permanent: true },
  { source: '/security-and-trust', destination: '/security', permanent: true },
  { source: '/for-procurement', destination: '/procurement', permanent: true },
  { source: '/vendor-info', destination: '/procurement', permanent: true },
  { source: '/contact-us', destination: '/contact', permanent: true },

  // Conversion page aliases
  { source: '/request-demo', destination: '/demo', permanent: true },
  { source: '/get-a-demo', destination: '/demo', permanent: true },
  { source: '/book-demo', destination: '/demo', permanent: true },
  { source: '/signup', destination: '/get-started', permanent: true },
  { source: '/start', destination: '/get-started', permanent: true },
  { source: '/partner-program', destination: '/partners', permanent: true },

  // Legal aliases
  { source: '/terms', destination: '/legal/terms', permanent: true },
  { source: '/terms-of-service', destination: '/legal/terms', permanent: true },
  { source: '/privacy', destination: '/legal/privacy', permanent: true },
  { source: '/privacy-policy', destination: '/legal/privacy', permanent: true },
  { source: '/dpa', destination: '/legal/dpa', permanent: true },
  { source: '/acceptable-use-policy', destination: '/legal/acceptable-use', permanent: true },
  { source: '/cookies', destination: '/legal/cookies', permanent: true },
  { source: '/cookie-policy', destination: '/legal/cookies', permanent: true },

  // Trailing slash normalization (handled by Next.js config trailingSlash: false)
];
```

### 7.3 Canonical URL Strategy

Every page emits a self-referencing canonical tag:

```html
<link rel="canonical" href="https://safetrekr.com/[path]" />
```

**Special cases**:
- Blog category/tag pages: canonical is self (not the blog index)
- Campaign landing pages (`/lp/*`): canonical points to the matching public page if one exists, otherwise self with `noindex`
- Paginated pages: each page is its own canonical; rel="prev"/rel="next" for crawlers
- Parameter variants: `?segment=k12&utm_source=google` canonicalizes to the base URL without query params

### 7.4 Next.js Config

```typescript
// next.config.ts (partial)
const nextConfig = {
  trailingSlash: false,
  async redirects() {
    return redirects;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
};
```

---

## 8. Metadata Templates per Page Type

### 8.1 Title Tag Templates

| Page Type | Template | Max Length | Example |
|-----------|----------|:-:|---------|
| Homepage | `SafeTrekr -- [Tagline]` | 60 | `SafeTrekr -- Analyst-Reviewed Trip Safety for Every Organization` |
| Platform overview | `[Page Title] -- SafeTrekr` | 60 | `Trip Safety Platform -- SafeTrekr` |
| Feature page | `[Feature Name] -- SafeTrekr Platform` | 60 | `Analyst Safety Review -- SafeTrekr Platform` |
| Segment page | `Trip Safety for [Segment] -- SafeTrekr` | 60 | `Trip Safety for K-12 Schools & Districts -- SafeTrekr` |
| How It Works | `How SafeTrekr Works -- [Process Summary]` | 60 | `How SafeTrekr Works -- From Trip Submission to Safety Binder` |
| Pricing | `Pricing -- SafeTrekr Trip Safety Management` | 60 | (as shown) |
| Blog post | `[Post Title] -- SafeTrekr Blog` | 60 | `FERPA Compliance for School Travel -- SafeTrekr Blog` |
| Blog category | `[Category] Articles -- SafeTrekr Blog` | 60 | `K-12 Compliance Articles -- SafeTrekr Blog` |
| Case study | `[Org]: [Result] -- SafeTrekr Case Study` | 60 | `Springfield USD: 40% Less Planning Time -- SafeTrekr Case Study` |
| Guide | `[Title] -- SafeTrekr Resources` | 60 | `K-12 Field Trip Safety Planning Guide -- SafeTrekr Resources` |
| Comparison | `SafeTrekr vs. [Alternative] -- Comparison` | 60 | `SafeTrekr vs. DIY Spreadsheets -- Comparison` |
| Compliance | `[Regulation] Compliance for [Context] -- SafeTrekr` | 60 | `FERPA Compliance for School Travel -- SafeTrekr` |
| Glossary term | `[Term]: Definition -- SafeTrekr Glossary` | 60 | `Monte Carlo Risk Scoring: Definition -- SafeTrekr Glossary` |
| Legal page | `[Policy Name] -- SafeTrekr` | 60 | `Privacy Policy -- SafeTrekr` |
| Demo page | `Request a Demo -- SafeTrekr` | 60 | (as shown) |
| FAQ | `Frequently Asked Questions -- SafeTrekr` | 60 | (as shown) |

**Rules**: Primary keyword front-loaded. Brand always present (typically at end). No keyword stuffing. Pipe or em-dash separator.

### 8.2 Meta Description Templates

| Page Type | Template Pattern | Length |
|-----------|-----------------|:---:|
| Homepage | [Value prop] + [unique mechanism] + [CTA signal] | 150-160 |
| Feature page | [Feature benefit] + [differentiator] + [CTA signal] | 150-160 |
| Segment page | [Segment problem] + [solution] + [proof point] | 150-160 |
| Blog post | [Article premise] + [key takeaway] | 150-160 |
| Comparison | [Alternative name] + [SafeTrekr advantage] + [CTA signal] | 150-160 |
| Compliance | [Regulation name] + [what SafeTrekr provides] + [segment context] | 150-160 |

**Example descriptions**:

| Page | Meta Description |
|------|-----------------|
| Homepage | "Every trip reviewed by a safety analyst. Risk scored from 5 government sources. Audit-ready documentation in 3-5 days. Trusted by schools, universities, churches, and businesses." |
| K-12 Segment | "FERPA-compliant trip safety for K-12 schools and districts. Professional analyst review, risk intelligence, and audit-ready safety binders. Starting at $15/student." |
| Analyst Review Feature | "Every SafeTrekr trip is reviewed across 17 sections by a trained safety analyst. Locations verified. Risks documented. Emergency plans validated. Binder delivered in 3-5 days." |
| How It Works | "Submit your trip. Our analysts review 17 safety dimensions using intelligence from 5 government sources. Receive your audit-ready safety binder in 3-5 business days." |
| Pricing | "Transparent trip safety pricing starting at $15/student. Professional analyst review, risk intelligence, and audit-ready binders for every trip type. Volume discounts available." |
| vs. DIY Spreadsheets | "Compare SafeTrekr's analyst-reviewed safety binders to DIY spreadsheet checklists. See the difference in liability protection, compliance documentation, and time savings." |
| FERPA Compliance | "How SafeTrekr helps K-12 schools maintain FERPA compliance during field trips and student travel. Data handling, consent workflows, and audit-ready documentation." |

### 8.3 Open Graph / Social Metadata Template

```typescript
// generateMetadata helper pattern for Next.js App Router
export function generateMetadata({ params }): Metadata {
  return {
    title: pageTitle,
    description: metaDescription,
    openGraph: {
      title: ogTitle || pageTitle,
      description: ogDescription || metaDescription,
      url: `https://safetrekr.com${canonicalPath}`,
      siteName: 'SafeTrekr',
      type: isArticle ? 'article' : 'website',
      images: [{
        url: ogImageUrl || 'https://safetrekr.com/og/default.png',
        width: 1200,
        height: 630,
        alt: ogImageAlt || pageTitle,
      }],
      ...(isArticle && {
        article: {
          publishedTime: publishDate,
          modifiedTime: updatedDate,
          authors: [authorUrl],
          section: category,
          tags: tags,
        },
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle || pageTitle,
      description: ogDescription || metaDescription,
      images: [ogImageUrl || 'https://safetrekr.com/og/default.png'],
    },
    alternates: {
      canonical: `https://safetrekr.com${canonicalPath}`,
    },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}
```

**OG Image Strategy**:

| Page Type | OG Image Approach | Dimensions |
|-----------|-------------------|:---:|
| Homepage | Custom designed, brand + tagline | 1200x630 |
| Segment pages | Segment-specific, brand + segment icon + headline | 1200x630 |
| Feature pages | Feature name + illustration + brand | 1200x630 |
| Blog posts | Featured image or auto-generated via `next/og` (Satori) | 1200x630 |
| Comparison pages | "SafeTrekr vs. [X]" split layout | 1200x630 |
| Default fallback | Brand logo + tagline on brand gradient | 1200x630 |

---

## 9. JSON-LD Schema per Page Type

### 9.1 Schema Type Mapping

| Page Type | Primary Schema | Secondary Schema | Trigger |
|-----------|---------------|-----------------|---------|
| Homepage | `Organization` + `WebSite` | `SoftwareApplication` | Always |
| Platform overview | `SoftwareApplication` | `BreadcrumbList` | Always |
| Feature page | `SoftwareApplication` (feature) | `BreadcrumbList` | Always |
| Segment page | `FAQPage` | `BreadcrumbList` | Always (FAQ section present) |
| How It Works | `HowTo` | `BreadcrumbList` | Always |
| Pricing | `Product` + `Offer` (per tier) | `BreadcrumbList`, `FAQPage` | Always |
| Blog post | `Article` | `BreadcrumbList` | Always |
| Blog index | `CollectionPage` | -- | Always |
| Case study | `Article` (subtype) | `BreadcrumbList` | Always |
| FAQ page | `FAQPage` | `BreadcrumbList` | Always |
| Comparison page | `FAQPage` | `BreadcrumbList` | When FAQ section present |
| Compliance guide | `FAQPage` | `BreadcrumbList` | When FAQ section present |
| Glossary term | `DefinedTerm` | `BreadcrumbList` | Always |
| Glossary index | `CollectionPage` | -- | Always |
| About | `Organization` | `BreadcrumbList` | Always |
| Analysts | `Person` (per analyst) | `BreadcrumbList` | Always |
| Security & Trust | `Organization` (security focus) | `BreadcrumbList` | Always |
| Legal pages | `WebPage` | `BreadcrumbList` | Always |

### 9.2 Schema Templates

#### Organization (Homepage, About)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SafeTrekr",
  "url": "https://safetrekr.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://safetrekr.com/logo.svg",
    "width": 200,
    "height": 50
  },
  "description": "Enterprise trip safety management platform with analyst-reviewed safety binders, Monte Carlo risk intelligence from 5 government data sources, and tamper-evident evidence documentation.",
  "foundingDate": "2024",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "url": "https://safetrekr.com/contact"
  },
  "sameAs": [
    "https://linkedin.com/company/safetrekr",
    "https://twitter.com/safetrekr"
  ]
}
```

#### WebSite (Homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SafeTrekr",
  "url": "https://safetrekr.com",
  "description": "Analyst-reviewed trip safety management platform for schools, universities, churches, and businesses.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://safetrekr.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

Note: The `SearchAction` should only be added when on-site search is implemented (month 6-8). Include the schema but leave inactive until search is live.

#### SoftwareApplication (Platform Overview, Homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SafeTrekr",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web, iOS, Android",
  "description": "Trip safety management platform with professional analyst review, Monte Carlo risk scoring from 5 government data sources, and tamper-evident safety binders.",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "450",
    "highPrice": "1250",
    "priceCurrency": "USD",
    "offerCount": "3"
  },
  "featureList": [
    "17-section professional safety analyst review",
    "Monte Carlo risk scoring from 5 government data sources",
    "SHA-256 hash-chain tamper-evident evidence binders",
    "Real-time geofencing and rally points",
    "Mobile field operations for chaperones",
    "FERPA, SOC 2, and GDPR compliance design"
  ]
}
```

#### FAQPage (Segment Pages, FAQ, Comparison, Compliance)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is included in a SafeTrekr trip safety review?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Every trip undergoes a 17-section review by a trained safety analyst covering location safety, transportation, accommodation, emergency planning, medical considerations, weather risk, political stability, communication plans, and more. Results are compiled into an audit-ready safety binder with SHA-256 hash-chain evidence integrity."
      }
    }
  ]
}
```

#### HowTo (How It Works)

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How SafeTrekr Protects Your Trip",
  "description": "Submit your trip details, receive a professional safety analyst review, and get your audit-ready safety binder in 3-5 business days.",
  "totalTime": "P5D",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Submit Your Trip",
      "text": "Enter your trip details -- destination, dates, group size, itinerary, and special requirements -- into the SafeTrekr portal."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Analyst Review & Intelligence",
      "text": "A trained safety analyst reviews your trip across 17 dimensions. The Risk Intelligence Engine scores hazards using Monte Carlo simulation against 5 government data sources (NOAA, USGS, CDC, GDACS, ReliefWeb)."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Receive Your Safety Binder",
      "text": "Your audit-ready Trip Safety Binder is delivered with complete documentation, emergency plans, maps, and tamper-evident SHA-256 hash-chain evidence integrity."
    }
  ]
}
```

#### Article (Blog Posts)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Post Title]",
  "description": "[Excerpt]",
  "image": "[Featured Image URL]",
  "datePublished": "[ISO 8601]",
  "dateModified": "[ISO 8601]",
  "author": {
    "@type": "Person",
    "name": "[Author Name]",
    "url": "https://safetrekr.com/about/analysts"
  },
  "publisher": {
    "@type": "Organization",
    "name": "SafeTrekr",
    "logo": {
      "@type": "ImageObject",
      "url": "https://safetrekr.com/logo.svg"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://safetrekr.com/blog/[slug]"
  }
}
```

#### Product + Offer (Pricing)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "SafeTrekr Field Trip Review",
  "description": "Professional 17-section safety analyst review for K-12 field trips including risk intelligence and audit-ready binder.",
  "offers": {
    "@type": "Offer",
    "price": "450",
    "priceCurrency": "USD",
    "priceValidUntil": "2027-12-31",
    "availability": "https://schema.org/InStock",
    "url": "https://safetrekr.com/pricing"
  }
}
```

#### BreadcrumbList (All L2+ Pages)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://safetrekr.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Platform",
      "item": "https://safetrekr.com/platform"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Analyst Safety Review",
      "item": "https://safetrekr.com/platform/analyst-review"
    }
  ]
}
```

#### DefinedTerm (Glossary Terms)

```json
{
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  "name": "Monte Carlo Risk Scoring",
  "description": "A probabilistic risk assessment method that runs thousands of simulations against government data sources to quantify travel risk. SafeTrekr's Risk Intelligence Engine uses Monte Carlo simulation against data from NOAA, USGS, CDC, GDACS, and ReliefWeb.",
  "inDefinedTermSet": {
    "@type": "DefinedTermSet",
    "name": "SafeTrekr Glossary",
    "url": "https://safetrekr.com/glossary"
  }
}
```

### 9.3 Implementation Pattern

```typescript
// lib/schema.ts -- Utility functions for JSON-LD generation
export function generateOrganizationSchema(): WithContext<Organization> { /* ... */ }
export function generateWebSiteSchema(): WithContext<WebSite> { /* ... */ }
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): WithContext<BreadcrumbList> { /* ... */ }
export function generateFAQSchema(items: FAQItem[]): WithContext<FAQPage> { /* ... */ }
export function generateArticleSchema(post: BlogPost): WithContext<Article> { /* ... */ }
export function generateHowToSchema(steps: HowToStep[]): WithContext<HowTo> { /* ... */ }
export function generateProductSchema(tier: PricingTier): WithContext<Product> { /* ... */ }
export function generateDefinedTermSchema(term: GlossaryTerm): WithContext<DefinedTerm> { /* ... */ }

// Usage in page.tsx
export default function Page() {
  const schema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Platform', url: '/platform' },
    { name: 'Analyst Safety Review', url: '/platform/analyst-review' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Page content */}
    </>
  );
}
```

---

## 10. Internal Search Strategy

### 10.1 Phased Search Implementation

| Phase | Trigger | Search Capability | Implementation |
|-------|---------|-------------------|----------------|
| **Phase 0 (Launch)** | <50 pages | No on-site search | Navigation + cross-linking sufficient. Adding search to thin content creates poor zero-result experiences. |
| **Phase 1 (Month 4-6)** | 50-75 pages | Basic keyword search | Algolia DocSearch or Pagefind (static search). Index all public pages, blog posts, FAQ items. |
| **Phase 2 (Month 6-8)** | 75-100 pages | Faceted search with filters | Full Algolia integration. Segment and content type facets. Autocomplete. |
| **Phase 3 (Month 10-12)** | 100+ pages | AI-enhanced search | Natural language query understanding. "Find me K-12 compliance resources" resolves intelligently. |

### 10.2 Search Placement

| Viewport | Search Location | Behavior |
|----------|----------------|----------|
| Desktop | Magnifying glass icon in utility nav area (right side) | Click expands to full-width search overlay with backdrop |
| Mobile | Magnifying glass icon in mobile header (next to hamburger) | Tap opens full-screen search overlay |
| Blog index | Dedicated search field above post list | Inline, filters blog content |
| Resources | Dedicated search field above resource grid | Inline, filters resources |
| Glossary | Alphabetical filter + search field | Inline, filters terms |

### 10.3 Search Architecture Specification (Phase 2+)

| Component | Specification |
|-----------|---------------|
| **Search scope** | All public pages, blog posts, resources (guides, case studies, sample binders), FAQ items, glossary terms, comparison pages, compliance guides |
| **Indexed fields** | `title` (weight 10), `headings` (weight 7), `ai_summary` (weight 5), `body` (weight 3), `tags` (weight 4), `segment_tags` (weight 4) |
| **Facets** | Content type: `Blog`, `Guide`, `Case Study`, `FAQ`, `Feature`, `Glossary` / Segment: `K-12`, `Higher Ed`, `Churches`, `Corporate` / Topic: `Compliance`, `Safety`, `Operations`, `Pricing` |
| **Autocomplete** | Suggest matching page titles, FAQ questions, blog titles. Max 5 suggestions. Debounce 200ms. |
| **Zero results** | Display: (1) segment landing pages, (2) top 3 popular resources, (3) contact CTA, (4) "Try searching for..." with reformulated query suggestions |
| **Search analytics** | Track: query text, results count, click-through position, zero-result queries, search-to-conversion rate |
| **Keyboard** | Escape closes overlay. Arrow keys navigate suggestions. Enter selects. `Cmd+K` / `Ctrl+K` opens search from any page. |
| **ARIA** | `role="search"`, `aria-label="Search SafeTrekr"`, `aria-expanded` on results, `aria-live="polite"` for result count |

### 10.4 Zero Results Strategy

When a search query returns no results, display in this priority order:

1. **Reformulated suggestions**: "Did you mean [corrected query]?" or "Try: [broader term]"
2. **Segment landing pages**: 4 cards linking to segment pages (the highest-value destinations)
3. **Popular resources**: Top 3 most-viewed resources
4. **FAQ matches**: If any FAQ question contains words from the query, surface those
5. **Contact CTA**: "Can't find what you're looking for? Contact us."

### 10.5 SEO Content Cluster Strategy (Search-Browse Integration)

The site's primary findability mechanism at launch is organic search, not on-site search. Content clusters serve as the browse-equivalent for SEO:

| Cluster | Pillar Page | Supporting Content (Blog + Resources) | Internal Links |
|---------|-------------|--------------------------------------|----------------|
| **K-12 Field Trip Safety** | `/solutions/k12` | 8 blog posts + 2 guides + 1 checklist | All supporting content links to pillar. Pillar links to top 3 supporting articles. |
| **Study Abroad Safety** | `/solutions/higher-education` | 6 blog posts + 1 guide | Same hub-and-spoke pattern. |
| **Mission Trip Safety** | `/solutions/churches` | 6 blog posts + 1 guide + 1 toolkit | Same pattern. |
| **Corporate Travel Safety** | `/solutions/corporate` | 5 blog posts + 1 guide | Same pattern. |
| **Trip Safety Technology** | `/platform` | 5 blog posts (Monte Carlo, hash-chain, geofencing, analyst review) | Technical content links up to platform pillar. |

**Cluster linking rules**:
1. Every blog post in a cluster must link to its pillar page (via `pillar_page_ref` field)
2. The pillar page must link to its top 3 most recent or most relevant supporting articles
3. Supporting articles should interlink where topically relevant (max 2 cross-links per post)
4. Cluster content should link to at least 1 feature page where SafeTrekr capability is discussed

---

## 11. Content Governance Model

### 11.1 Content Ownership Matrix

| Content Type | Author/Creator | Reviewer | Approver | Update Cadence |
|--------------|---------------|----------|----------|----------------|
| Core pages (homepage, platform, solutions) | Marketing Lead | IA + Product | Founder | Quarterly review; update on product changes |
| Feature pages | Product + Marketing | IA | Product Lead | On feature release or capability change |
| Segment landing pages | Marketing Lead | IA + Segment SME | Marketing Lead | Quarterly; update with new case studies/testimonials |
| Blog posts | Content Writer | Marketing Lead | Marketing Lead | Publish cadence: 4-8/month. No mandatory update. |
| Case studies | Marketing + Customer Success | Customer (approval) | Marketing Lead | Evergreen; update metrics annually |
| Guides/whitepapers | Content Writer | SME + Marketing | Marketing Lead | Annual review for accuracy |
| FAQ items | Marketing + Support | IA | Marketing Lead | Monthly: add new, retire stale |
| Sample binders | Product | Security Review | Founder | Quarterly; must reflect current product |
| Comparison pages | Marketing + Strategy | IA + Product | Marketing Lead | Quarterly; update competitive landscape |
| Compliance guides | Legal + Product | Legal Counsel | Founder | On regulation change; minimum annual review |
| Glossary terms | Content Writer | IA | Marketing Lead | Add as needed; review annually |
| Legal pages | Legal Counsel | External Legal | Founder | On policy change; minimum annual review |
| Pricing | Product + Finance | Founder | Founder | On pricing change; minimum annual review |
| Procurement resources | Legal + Finance | Security | Founder | On certification change |

### 11.2 Content Lifecycle

```
DRAFT --> REVIEW --> APPROVED --> PUBLISHED --> MONITORED --> UPDATED or ARCHIVED
                                      |                          |
                                      +--- ANALYTICS TRIGGER ----+
                                           (low engagement, stale data,
                                            broken links, outdated claims)
```

| Stage | Definition | Action Required |
|-------|-----------|-----------------|
| **Draft** | Content created, not yet reviewed | Author completes all required fields |
| **Review** | Under editorial and IA review | Reviewer checks: accuracy, tone, SEO, cross-links, metadata, schema |
| **Approved** | Passes review, ready to publish | Approver grants publish permission |
| **Published** | Live on site | Analytics tracking begins |
| **Monitored** | Active content under periodic review | Flag if: bounce >70%, time-on-page <30s, 0 conversions in 90 days |
| **Updated** | Content refreshed based on triggers | Retain URL, update `last_updated`, re-submit to search console |
| **Archived** | Content removed from nav/indexes, URL preserved with redirect or "This content is archived" notice | 301 redirect to replacement content or archive notice |

### 11.3 Content Quality Checklist

Every piece of content must pass this checklist before publication:

**SEO & Metadata**
- [ ] `meta_title` populated, max 60 chars, primary keyword front-loaded
- [ ] `meta_description` populated, max 160 chars, includes CTA signal
- [ ] `og_image` set (custom or auto-generated)
- [ ] `ai_summary` written (40-60 words, factual, placed in first 150 words of body)
- [ ] JSON-LD schema correct for page type
- [ ] Canonical URL set and correct
- [ ] `alt` text on all images (descriptive, keyword-natural)

**Cross-Linking**
- [ ] Links to relevant segment page(s) present
- [ ] Links to relevant feature page(s) present (where applicable)
- [ ] Pillar page uplink present (for cluster blog posts)
- [ ] End-of-page CTA present with correct variant (discovery/evaluation/decision)
- [ ] No broken internal links

**Content Quality**
- [ ] AI-citeable summary in first 150 words
- [ ] H2/H3 hierarchy clean and parseable
- [ ] No fabricated testimonials, metrics, or unverifiable claims
- [ ] Compliance claims use "designed with [standard] in mind" unless certified
- [ ] Reading level: Grade 8-10

**Accessibility**
- [ ] All images have `alt` text
- [ ] Heading hierarchy sequential (no skipping levels)
- [ ] Link text is descriptive (no "click here")
- [ ] Color contrast meets WCAG 2.2 AA

### 11.4 Taxonomy Governance

**Controlled vocabularies to maintain**:

| Vocabulary | Owner | Items at Launch | Growth Rate | Review Cadence |
|-----------|-------|:-:|---|---|
| Segment tags | IA | 4 | Add only with new segment launch | Annual |
| Blog categories | Marketing + IA | 5-8 | Max 1 new per quarter | Quarterly |
| Blog tags | Marketing | 10-20 | Organic growth, deduplicate quarterly | Quarterly |
| FAQ categories | IA | 5 | Stable | Annual |
| Feature identifiers | Product | 6 | On feature release | On release |
| Compliance regulations | Legal + IA | 4 | On new regulation applicability | Annual |
| Glossary terms | IA | 0 (launch) -> 50+ | 5-10 per month during build-out | Monthly |

**Rules for adding taxonomy terms**:
1. New blog categories require IA approval (prevents fragmentation)
2. New segment tags require founder approval (business decision)
3. Blog tags must be checked against existing tags before creation (prevent duplicates: "FERPA" vs. "ferpa-compliance" vs. "ferpa")
4. Glossary terms are added based on: search query analysis, support ticket analysis, or content creation need

### 11.5 Content Freshness Signals

Institutional buyers value current information. The following freshness signals must be maintained:

| Signal | Implementation | Visibility |
|--------|---------------|------------|
| `last_updated` date | Displayed on all core pages, guides, compliance guides | Below page title: "Last updated: March 2026" |
| Blog post dates | `datePublished` and `dateModified` in schema + visible on page | Published date visible; "Updated:" shown if modified |
| Pricing effective date | Displayed on pricing page | "Pricing effective as of [date]" |
| Legal effective dates | Displayed on all legal pages | "Effective date: [date]" |
| Compliance guide review date | Displayed on compliance pages | "Last reviewed for accuracy: [date]" |
| Security cert dates | Displayed on security page | Certification dates and renewal status |

---

## 12. Enhancement Proposals

### Enhancement 1: Smart Content Recommendation Engine

**Problem**: The discovery defines static cross-linking rules, but as content scales to 100+ pages, manually maintaining cross-links becomes unsustainable and prone to staleness.

**Proposal**: Implement an algorithmic content recommendation system that surfaces related content based on three signals:

1. **Taxonomy match**: Shared `segment_tags`, `categories`, `tags`, and `feature_refs`
2. **Funnel stage alignment**: Match CTA variants (discovery/evaluation/decision) to suggest appropriate next content
3. **Recency weighting**: Prefer newer content over older (decay factor: 0.95 per month)

**Implementation**:
- Build at content layer (MDX frontmatter + build-time computation), not runtime
- During `next build`, compute a similarity score between every pair of content items based on shared taxonomy terms
- Store results in a static JSON manifest (`content-recommendations.json`)
- `RelatedContent` component reads from manifest and renders top 3 recommendations
- Rebuild recommendations on every deploy (content changes trigger Vercel rebuild)

**Effort**: Medium (1-2 weeks engineering)
**Impact**: Reduces manual cross-link maintenance by ~80%. Improves pages-per-session as content scales.
**Priority**: P2 (implement when content exceeds 50 pages)

---

### Enhancement 2: Dynamic Breadcrumbs with Entry-Path Context

**Problem**: Standard hierarchical breadcrumbs show the taxonomy path (`Home > Blog > [Title]`), but when a K-12 administrator arrives at a blog post from the K-12 segment page, the breadcrumb loses the segment context.

**Proposal**: Augment breadcrumbs with entry-path awareness:

- When a user navigates from a segment page to content, append a `?from=[segment]` parameter
- The breadcrumb component reads this parameter and constructs a contextual path:
  - Default: `Home > Blog > FERPA Compliance for School Travel`
  - Contextual: `Home > K-12 Schools > FERPA Compliance for School Travel`
- JSON-LD `BreadcrumbList` always uses the canonical hierarchy (not the contextual path)
- The contextual breadcrumb uses the `from` param for display only; canonical URL remains unchanged

**Implementation**:
- Modify `SegmentLandingPage` links to blog posts: append `?from=k12` (etc.)
- `Breadcrumbs` component: check `searchParams.from`, if valid segment, render contextual path
- Canonical tag remains the base URL (no query param)

**Effort**: Low (2-3 days)
**Impact**: Stronger wayfinding for users who enter through segment pages. Reduces "where am I?" disorientation.
**Priority**: P1

---

### Enhancement 3: Segment-Aware CTAs

**Problem**: The CTA strategy defines three variants (discovery/evaluation/decision) but doesn't personalize based on the visitor's detected segment.

**Proposal**: When segment context exists (via `localStorage`, URL param, or page context), personalize CTAs:

| Generic CTA | Segment-Aware CTA (K-12 example) |
|-------------|----------------------------------|
| "Download a Sample Binder" | "Download the K-12 Field Trip Sample Binder" |
| "Get a Demo" | "See SafeTrekr for K-12 Schools" |
| "View Pricing" | "See K-12 Pricing (from $15/student)" |
| "See How It Works" | "See How It Works for School Trips" |

**Implementation**:
- `CTABanner` and `SampleBinderCTA` components accept optional `segment` prop
- If `segment` is provided (from page context or localStorage), render segment-specific copy
- If no segment context, render generic copy
- A/B test: segment-aware vs. generic CTAs to measure conversion lift

**Effort**: Low (3-4 days)
**Impact**: Estimated 15-30% improvement in CTA click-through based on personalization research (Hubspot 2024: personalized CTAs convert 202% better than default).
**Priority**: P1

---

### Enhancement 4: Intelligent Footer with Contextual Highlights

**Problem**: The footer is static -- same 30+ links on every page. For a 5-section, 30+ link footer, findability of specific links degrades.

**Proposal**: Add a "contextual highlights" row at the top of the footer that surfaces 3-4 links most relevant to the current page context:

```
+---------------------------------------------------------------------------+
| YOU MIGHT ALSO NEED                                                       |
| [Pricing & ROI]  [K-12 Sample Binder]  [Procurement Docs]  [FERPA Guide] |
+---------------------------------------------------------------------------+
| PLATFORM              SOLUTIONS             RESOURCES                     |
| ...                   ...                   ...                           |
```

**Rules**:
- On segment pages: show that segment's sample binder, related compliance guide, pricing, procurement
- On feature pages: show related segments, How It Works, demo
- On blog posts: show pillar page, sample binder for tagged segment, related guide
- On pricing: show ROI calculator, procurement, sample binder, How It Works
- Default: show demo, sample binders, pricing, How It Works

**Effort**: Low (2-3 days)
**Impact**: Improves footer utility without changing its comprehensive structure. Provides contextual wayfinding at the end of every page.
**Priority**: P2

---

### Enhancement 5: Progressive Disclosure Engine for Technical Content

**Problem**: The 17-section analyst review, Monte Carlo risk scoring, and hash-chain evidence are deeply technical. The discovery calls for "three layers of depth" but doesn't specify the interaction pattern.

**Proposal**: Implement a three-tier progressive disclosure system:

| Tier | Content Depth | Interaction | Used On |
|------|--------------|-------------|---------|
| **Tier 1: Headline** | 1 sentence summary | Always visible | Homepage, segment pages, feature cards |
| **Tier 2: Explanation** | 2-3 paragraphs with visuals | Full page content | Feature pages |
| **Tier 3: Deep Dive** | Technical specification, methodology detail | Expandable section ("For Technical Evaluators") | Feature pages, security page |

**Tier 3 implementation**: An expandable `<details>` element (or custom accordion) at the bottom of feature pages with the heading "Technical Details for Evaluators":

```
+--------------------------------------------------+
| TECHNICAL DETAILS FOR EVALUATORS            [v]  |
|--------------------------------------------------|
| Monte Carlo Simulation Methodology               |
| - Number of simulations: 10,000 per hazard type  |
| - Data sources: NOAA (weather), USGS (seismic),  |
|   CDC (health), GDACS (disasters), ReliefWeb     |
|   (humanitarian)                                  |
| - Confidence interval: 95th percentile            |
| - Update frequency: Real-time API polling         |
| - Risk score range: 0-100 per hazard category     |
|                                                   |
| Evidence Chain Integrity                          |
| - Hash algorithm: SHA-256                         |
| - Chain structure: Sequential block hashing       |
| - Verification: Public hash published per binder  |
| - Tamper detection: Any modification breaks chain |
+--------------------------------------------------+
```

**Effort**: Low (1-2 days for component; content creation is the real investment)
**Impact**: Addresses the dual audience problem -- trip coordinators get the "what" and "why"; IT/security evaluators get the "how" without cluttering the main page flow.
**Priority**: P1

---

### Enhancement 6: Contextual Help Overlays (Glossary Tooltips)

**Problem**: Institutional buyers encounter domain-specific terms (FERPA, Clery Act, Monte Carlo, SHA-256, hash-chain, geofencing, muster) that some stakeholders understand and others don't. Trip coordinators may not know "SHA-256." Board members may not know "geofencing."

**Proposal**: Implement inline glossary tooltips that appear on hover/tap for technical and regulatory terms:

```
SafeTrekr uses [Monte Carlo risk scoring](*tooltip*) to quantify travel risk from
[5 government data sources](*tooltip*) including NOAA, USGS, and CDC.

*tooltip content*: Monte Carlo risk scoring runs thousands of probabilistic
simulations to assess the likelihood and severity of hazards at your destination.
[Learn more ->] (/glossary/monte-carlo-risk-scoring)
```

**Implementation**:
- Create a glossary terms JSON file with term -> definition mappings
- Build a `GlossaryTooltip` component: renders as dotted underline, shows popover on hover/focus
- Content authors mark terms with a custom MDX component: `<Term id="monte-carlo">Monte Carlo risk scoring</Term>`
- Tooltip shows: definition (40-60 words) + link to full glossary page
- Mobile: tap to show, tap elsewhere to dismiss
- Accessibility: `role="tooltip"`, `aria-describedby`, keyboard accessible via focus

**Effort**: Medium (1 week for component + glossary content)
**Impact**: Reduces comprehension barriers for non-technical stakeholders. Supports the multi-stakeholder buying journey where different readers need different vocabulary support.
**Priority**: P2

---

### Enhancement 7: Content Scoring System for Editorial Governance

**Problem**: As blog content scales to 50-100+ posts, quality and findability consistency will degrade without a quality governance system.

**Proposal**: Implement an automated content scoring system that evaluates every content item against IA quality criteria:

| Scoring Dimension | Weight | Criteria | Score Range |
|-------------------|:---:|---------|:---:|
| **SEO completeness** | 25% | Title tag, meta description, ai_summary, JSON-LD schema, canonical, alt text | 0-100 |
| **Cross-link density** | 20% | Links to segment page, feature page, pillar uplink, end CTA | 0-100 |
| **Content depth** | 20% | Word count >800, H2/H3 structure, FAQ section, images/visuals | 0-100 |
| **Freshness** | 15% | Last updated within 6 months (guides), 12 months (evergreen), N/A (blog posts) | 0-100 |
| **Taxonomy compliance** | 10% | Correct segment_tags, categories, tags from controlled vocabulary | 0-100 |
| **Accessibility** | 10% | Alt text, heading hierarchy, link text quality | 0-100 |

**Implementation**:
- Build as a Node.js script that runs during CI/CD (`npm run content:score`)
- Reads all MDX files and content configs
- Outputs a score per content item
- Flags items scoring below 70/100
- Generates a dashboard report (markdown or HTML)
- Blocks deployment if any P0 page scores below 80/100

**Effort**: Medium (1 week engineering)
**Impact**: Prevents quality drift as content scales. Provides actionable editorial feedback. Surfaces stale or under-linked content before it becomes a findability problem.
**Priority**: P2

---

### Enhancement 8: Automated Cross-Linking Engine

**Problem**: Manual cross-linking between 100+ pages is error-prone and creates maintenance burden. Links go stale, new content doesn't get linked from old content.

**Proposal**: Build a build-time cross-linking engine that:

1. **Scans all content** during `next build`
2. **Identifies cross-link opportunities** based on shared taxonomy (segment_tags, feature refs, topic overlap)
3. **Generates a cross-link manifest** that components consume
4. **Validates existing cross-links** and flags broken internal links

**Cross-link rules engine**:

```
IF content.segment_tags includes 'k12'
  AND content.type is 'blog_post'
  THEN ensure link to /solutions/k12 exists in body or RelatedContent

IF content.type is 'feature_page'
  THEN ensure links to all 4 segment pages exist in segment_relevance section

IF content.pillar_page_ref is set
  THEN ensure link to pillar page exists in body

IF content.type is 'blog_post'
  AND content references a feature by name in body
  THEN suggest inline link to that feature page
```

**Output**: A `cross-link-report.json` that lists:
- Missing required cross-links (with suggested additions)
- Broken internal links (404 targets)
- Orphaned content (pages with <2 inbound links)
- Over-linked content (pages with >20 outbound links)

**Effort**: Medium (1-2 weeks)
**Impact**: Eliminates manual cross-link maintenance. Ensures SEO link equity flows correctly. Prevents orphaned content as the site scales.
**Priority**: P2

---

### Enhancement 9: Comparison Page Framework

**Problem**: The discovery mentions comparison pages at P2/Tier 5 priority but doesn't specify the IA architecture. Comparison pages are high-intent, high-conversion content that serves decision-stage buyers.

**Proposal**: Build a structured comparison page framework with three comparison types:

| Comparison Type | Example URL | Target Audience | Purpose |
|----------------|-------------|-----------------|---------|
| **vs. Status Quo** | `/compare/diy-spreadsheets` | All segments | "Why switch from what you do now?" |
| **vs. Category** | `/compare/logistics-apps` | K-12, Corporate | "SafeTrekr is not a logistics app" |
| **vs. Enterprise** | `/compare/travel-management` | Corporate | "SafeTrekr vs. $100K/yr TMCs" |

**Page template**:

```
1. HERO: "[Alternative] vs. SafeTrekr: Which Protects Your Organization?"
2. TLDR COMPARISON: 3-column table (Criteria | [Alternative] | SafeTrekr)
3. DETAILED COMPARISON: Feature-by-feature expansion
4. WHO [ALTERNATIVE] IS FOR: Honest framing (no strawmanning)
5. WHO SAFETREKR IS FOR: Clear positioning
6. TOTAL COST COMPARISON: Including hidden costs of alternative
7. FAQ: 5-8 comparison-specific questions (with FAQPage schema)
8. CTA: Decision-stage ("Get Started" + "Contact Sales")
```

**SEO value**: Comparison queries ("school trip safety vs spreadsheet", "trip safety software comparison") are high-intent, low-competition.

**Effort**: Low per page (template exists; content is the work)
**Impact**: Captures decision-stage search traffic. Addresses the "why not just keep doing what we're doing?" objection.
**Priority**: P2

---

### Enhancement 10: Glossary / Knowledge Base Architecture

**Problem**: The discovery mentions a glossary at P3 priority but doesn't specify the IA structure. A well-built glossary serves three functions: (1) SEO for long-tail definitional queries, (2) AI citation source for term definitions, (3) user comprehension support via tooltips.

**Proposal**: Build a glossary system with 50+ terms spanning:

| Category | Example Terms | Count |
|----------|--------------|:---:|
| Safety & Risk | duty of care, risk assessment, Monte Carlo simulation, geofencing, muster point, rally point | 12-15 |
| Compliance & Legal | FERPA, Clery Act, COPPA, GDPR, SOC 2, Title IX, SafeSport, duty of care | 10-12 |
| Documentation & Evidence | hash-chain, SHA-256, tamper-evident, evidence binder, audit trail, purge proof | 8-10 |
| Operations | trip coordinator, chaperone, participant tracking, emergency action plan, communication plan | 8-10 |
| Technology | Monte Carlo simulation, API, real-time monitoring, geofence, SMS broadcast | 8-10 |

**Page structure**:
- **Index page** (`/glossary`): Alphabetical listing with search/filter. Letter navigation (A-Z).
- **Term page** (`/glossary/[term]`): Definition, related terms, related features, related content. `DefinedTerm` JSON-LD.
- **Integration**: Terms link bidirectionally with feature pages, compliance guides, and blog posts.

**Effort**: Medium (1 week architecture + ongoing content)
**Impact**: Captures 50+ long-tail search queries. Powers the tooltip system (Enhancement 6). Provides AI citation surface for term definitions.
**Priority**: P2

---

### Enhancement 11: AI-Citeable Content Architecture

**Problem**: The digital marketing discovery identifies AI search optimization as a first-mover opportunity, but the IA discovery doesn't specify structural patterns to maximize AI citation.

**Proposal**: Implement the following structural patterns across all content:

| Pattern | Implementation | Purpose |
|---------|---------------|---------|
| **AI Summary Block** | 40-60 word factual paragraph in first 150 words of every page (`ai_summary` field) | Direct-answer extraction by AI engines |
| **Declarative First Sentences** | Every H2 section starts with a declarative fact, not a question or marketing claim | AI engines extract leading sentences |
| **Statistical Anchors** | Specific numbers in content: "5 government sources", "17 review sections", "$15 per student" | AI engines cite specific quantified claims |
| **Entity References** | Reference authoritative entities: NOAA, USGS, CDC, FERPA, Clery Act by full name | AI engines validate claims against known entities |
| **Comparison Tables** | HTML `<table>` with clear `<thead>` for all comparison content | AI engines parse tables as structured data |
| **FAQ Schema** | `FAQPage` JSON-LD on every page with 5+ Q&A pairs | Google AI Overviews, Perplexity, ChatGPT extract FAQ pairs |
| **Methodology Documentation** | Dedicated section on how things work (not just what) | AI engines cite methodology as authoritative |

**AI crawler access** (`robots.txt`):
```
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Amazonbot
Allow: /
```

**Effort**: Low (structural pattern; content authors follow guidelines)
**Impact**: Estimated 10-15 AI citations within 90 days (per digital marketing discovery). First-mover advantage in an uncontested niche.
**Priority**: P0 (must be built into content from day one)

---

### Enhancement 12: Multi-Stakeholder Journey Paths

**Problem**: The discovery identifies 4-6 stakeholders per institutional purchase but doesn't map explicit navigation paths for each stakeholder type. A trip coordinator and a procurement officer have fundamentally different navigation needs.

**Proposal**: Define explicit journey paths per stakeholder role:

| Stakeholder | Entry Point | Key Pages | Exit (Conversion) |
|-------------|------------|-----------|-------------------|
| **Trip Coordinator** | Homepage, segment page, blog post (organic) | Segment page -> How It Works -> Sample Binder -> Demo | Demo request |
| **Risk/Safety Manager** | Segment page, Security & Trust (direct) | Security -> Platform -> Compliance -> Sample Binder | Demo request |
| **IT/Security Evaluator** | Security & Trust, Compliance guides | Security -> Platform/Compliance -> DPA -> Procurement | Procurement package download |
| **Procurement Officer** | Procurement page (utility nav, direct link) | Procurement -> Pricing -> Contact | Procurement docs download, Contact |
| **Board/Executive** | Pricing, Case studies (forwarded by coordinator) | Pricing -> ROI Calculator -> Case Study -> About | No direct conversion (approves internally) |
| **Parent/Guardian** | Blog post (organic), referral from school | Blog -> How It Works -> Solutions/K12 | "Recommend to your school" referral |

**Implementation**:
- No new pages required
- Ensure cross-links support each journey (the cross-link matrix in Section 6 already covers most)
- Add "For IT/Security Evaluators" callout on Security & Trust page linking to: DPA, SOC 2 details, encryption methodology, data flow diagram
- Add "For Board Members" section on pricing page: ROI summary, case study highlights, compliance overview
- Consider adding a "Who Are You?" quick-nav on the Solutions overview page: "I'm a trip coordinator", "I'm evaluating vendors", "I'm in procurement"

**Effort**: Low (cross-linking adjustments + 2-3 callout sections)
**Impact**: Reduces friction for non-coordinator stakeholders who arrive mid-buying-journey.
**Priority**: P1

---

## 13. Risk Assessment

### 13.1 IA-Specific Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|:---:|:---:|------------|
| R1 | **Content volume insufficient for search** -- Launching search before 50+ pages creates poor zero-result experiences | Medium | Medium | Delay on-site search until content threshold met. Use navigation and cross-linking as primary findability mechanism. |
| R2 | **Taxonomy fragmentation** -- Without governance, blog tags and categories will proliferate incoherently | High | High | Controlled vocabulary with IA approval for new categories. Quarterly tag deduplication audit. |
| R3 | **Stale cross-links** -- As content grows, manual cross-links break or become irrelevant | High | Medium | Automated cross-link engine (Enhancement 8). CI/CD broken link check. |
| R4 | **Segment detection false positives** -- Visitor reads one K-12 blog post, gets permanently segment-tagged | Medium | Low | Use confidence scoring (high/medium/low). Only persist on explicit segment page visit or segment card click. Provide "Not your segment?" link to reset. |
| R5 | **Mega-menu complexity on mobile** -- Rich desktop navigation degrades on mobile | Low | High | Accordion drawer pattern already specified. Test on iOS Safari and Chrome Android. Maximum 2 taps to any page. |
| R6 | **Fabricated content in social proof slots** -- Template slots for testimonials/case studies get filled with fake content | Medium | Critical | Architectural enforcement: testimonial slots require `verified: true` flag. Content governance checklist item. No publish without customer approval. |
| R7 | **Compliance claim over-statement** -- Marketing content claims compliance that isn't yet certified | High | Critical | Content governance rule: use "designed with [standard] requirements in mind" until certification obtained. Legal review on all compliance claims. |
| R8 | **URL structure changes post-launch** -- Navigation restructuring forces URL changes and redirect maintenance | Low | High | URL architecture designed for scale from day one. No restructuring needed until 200+ pages. Redirect map covers common aliases. |
| R9 | **Progressive disclosure hides critical content from evaluators** -- Technical details buried too deep | Medium | Medium | Tier 3 sections labeled "Technical Details for Evaluators" with clear visual treatment. Not hidden -- expandable. Search (when available) indexes Tier 3 content. |
| R10 | **AI crawler changes** -- AI search engines change crawling behavior or deprecate cited content | Medium | Medium | Monitor AI citation reports. Maintain structured data compliance. Diversify across multiple AI engines (Google, Perplexity, ChatGPT, Claude). |

### 13.2 Content Dependency Risks

| Dependency | Risk Level | Status | Mitigation |
|-----------|:---:|--------|------------|
| Real customer testimonials | HIGH | Not available | Use ProofStrip (quantified metrics) until real testimonials obtained. Template slots designed but empty. |
| Sample binder PDFs (4 segment-specific) | MEDIUM | Not created | Generate from demo data. Priority content asset -- blocks lead magnet system. |
| Product screenshots and videos | HIGH | Not available | Requires demo account with curated data. Blocks feature page visual content. |
| Blog seed content (4-6 posts) | MEDIUM | Not written | SEO clock doesn't start until published. Prioritize 1 post per cluster for 4 clusters. |
| Case studies | LOW at launch | Not available | Requires real customers. Slots designed but empty. Proof strip fills the gap. |
| Compliance certification documents | HIGH | Status unclear | Must verify: SOC 2 status, FERPA assessment status, GDPR compliance. Over-claiming is a disqualifier. |

---

## 14. Priority Recommendations

### 14.1 Implementation Priority Matrix

Each recommendation scored on three dimensions (1-5 scale):

| # | Recommendation | Effort | Findability Impact | Conversion Impact | Priority Score | Phase |
|---|---------------|:---:|:---:|:---:|:---:|:---:|
| 1 | AI-citeable content architecture (Enhancement 11) | 2 | 5 | 4 | **22** | P0 |
| 2 | Core navigation system (Primary + Utility + Footer + Mobile + Breadcrumbs) | 4 | 5 | 5 | **21** | P0 |
| 3 | Segment landing pages with template architecture | 4 | 5 | 5 | **21** | P0 |
| 4 | Complete metadata + JSON-LD schema implementation | 3 | 5 | 3 | **19** | P0 |
| 5 | Segment-aware CTAs (Enhancement 3) | 2 | 3 | 5 | **18** | P1 |
| 6 | Dynamic breadcrumbs with entry-path context (Enhancement 2) | 1 | 4 | 3 | **18** | P1 |
| 7 | Progressive disclosure engine (Enhancement 5) | 2 | 4 | 4 | **18** | P1 |
| 8 | Multi-stakeholder journey path cross-links (Enhancement 12) | 2 | 4 | 4 | **18** | P1 |
| 9 | URL redirect map implementation | 2 | 5 | 2 | **17** | P0 |
| 10 | Content governance model + quality checklist | 2 | 4 | 3 | **17** | P1 |
| 11 | Comparison page framework (Enhancement 9) | 3 | 4 | 4 | **17** | P2 |
| 12 | Glossary/knowledge base architecture (Enhancement 10) | 3 | 4 | 3 | **16** | P2 |
| 13 | Contextual help overlays / glossary tooltips (Enhancement 6) | 3 | 3 | 3 | **15** | P2 |
| 14 | Content scoring system (Enhancement 7) | 3 | 3 | 3 | **15** | P2 |
| 15 | Smart content recommendation engine (Enhancement 1) | 3 | 4 | 3 | **16** | P2 |
| 16 | Automated cross-linking engine (Enhancement 8) | 4 | 4 | 3 | **15** | P2 |
| 17 | Intelligent footer (Enhancement 4) | 1 | 3 | 2 | **14** | P2 |
| 18 | Internal search (Phase 1) | 3 | 4 | 2 | **15** | P2 |

*Priority Score = (Findability Impact x 2) + (Conversion Impact x 2) + (5 - Effort)*

### 14.2 Implementation Phases

#### Phase 1: Foundation (Weeks 1-4) -- P0 Items

Build the structural foundation that all content depends on.

| Deliverable | Dependency | Owner |
|-------------|-----------|-------|
| Root layout with nav, footer, analytics, Organization JSON-LD | Design system tokens | Engineering |
| Primary navigation with mega-menus (Platform, Solutions, Resources) | Nav design spec (this document) | Engineering |
| Utility navigation (For Procurement, Log In, Get a Demo) | Nav design spec | Engineering |
| Footer navigation with trust signals | Nav design spec | Engineering |
| Mobile drawer navigation | Nav design spec | Engineering |
| Breadcrumb component with JSON-LD | Breadcrumb spec | Engineering |
| `generateMetadata` utility for all page types | Metadata templates | Engineering |
| JSON-LD schema utilities (Organization, WebSite, BreadcrumbList, FAQPage) | Schema templates | Engineering |
| URL redirect map in `next.config.ts` | URL map (Section 7.2) | Engineering |
| `robots.ts` with AI crawler access | Robots spec | Engineering |
| `sitemap.ts` dynamic generation | All page routes | Engineering |
| AI-citeable content structure guidelines | Enhancement 11 spec | Marketing + IA |
| Homepage (with segment routing cards, ProofStrip, CTA) | Design + content | Engineering + Marketing |
| 4 Segment landing pages (K-12, Higher Ed, Churches, Corporate) | Segment template + content | Engineering + Marketing |
| How It Works page with HowTo schema | Design + content | Engineering + Marketing |
| Pricing page with Product/Offer schema | Pricing data + design | Engineering + Marketing |
| Platform overview page | Design + content | Engineering + Marketing |
| Demo request page | Form implementation | Engineering |

#### Phase 2: Depth + Personalization (Weeks 5-8) -- P1 Items

Add depth pages, personalization, and governance.

| Deliverable | Dependency | Owner |
|-------------|-----------|-------|
| 3 core feature pages (Analyst Review, Risk Intelligence, Safety Binder) | Design + content | Engineering + Marketing |
| Dynamic breadcrumbs with entry-path context (Enhancement 2) | Breadcrumb component | Engineering |
| Segment-aware CTAs (Enhancement 3) | Segment context persistence | Engineering |
| Progressive disclosure sections on feature pages (Enhancement 5) | Feature page content | Engineering + Marketing |
| Multi-stakeholder journey cross-links (Enhancement 12) | Cross-link matrix | Marketing + IA |
| Security & Trust page | Compliance content (verified claims only) | Marketing + Legal |
| Procurement page with document downloads | Legal documents | Marketing + Legal |
| FAQ page with FAQPage schema | FAQ content | Marketing |
| About page + Analysts page | Company content | Marketing |
| Contact page | Form implementation | Engineering |
| Content governance model + quality checklist | Governance spec | IA + Marketing |
| 4 Sample binder downloads (gated) | Binder PDFs | Product + Marketing |
| Blog infrastructure (MDX + ISR) | Engineering setup | Engineering |
| 4-6 seed blog posts (1 per cluster) | Content creation | Marketing |

#### Phase 3: Scale + Intelligence (Weeks 9-16) -- P2 Items

Add content scale infrastructure and intelligence features.

| Deliverable | Dependency | Owner |
|-------------|-----------|-------|
| 3 remaining feature pages (Mobile, Monitoring, Compliance) | Design + content | Engineering + Marketing |
| Comparison page framework + 3 comparison pages (Enhancement 9) | Template + content | Marketing + IA |
| Glossary architecture + initial 20 terms (Enhancement 10) | Glossary content | IA + Marketing |
| Contextual help overlays / glossary tooltips (Enhancement 6) | Glossary terms | Engineering |
| Intelligent footer with contextual highlights (Enhancement 4) | Page context logic | Engineering |
| Content scoring system (Enhancement 7) | Scoring rules | Engineering + IA |
| Compliance guide pages (FERPA, Clery Act) | Legal-reviewed content | Marketing + Legal |
| ROI Calculator | Interactive component | Engineering |
| Smart content recommendation engine (Enhancement 1) | Content volume (50+ pages) | Engineering |
| Automated cross-linking engine (Enhancement 8) | Content volume | Engineering |
| Internal search (Phase 1: basic keyword) | Algolia/Pagefind setup | Engineering |
| Partners page | Business development | Marketing |
| Blog cadence established (4-8 posts/month) | Content pipeline | Marketing |

### 14.3 Success Metrics

| KPI | Target (Month 3) | Target (Month 6) | Target (Month 12) | Measurement |
|-----|:-:|:-:|:-:|---|
| Tree test success rate | >70% | >80% | >85% | Pre-launch and post-launch tree testing |
| Average clicks to conversion content | <=2 | <=2 | <=2 | Analytics: path length to demo/pricing |
| Pages per session | >2.5 | >3.0 | >3.5 | Analytics |
| Segment page bounce rate | <50% | <40% | <35% | Analytics |
| Demo request conversion rate | >2% | >3% | >4% | Form analytics |
| Sample binder download rate | >5% (of segment visitors) | >8% | >10% | Form analytics |
| Organic search impressions | >5K/mo | >15K/mo | >50K/mo | Search Console |
| AI answer citations | 0 | 5 | 15 | Manual monitoring + citation tracking |
| Zero-results rate (when search exists) | N/A | <10% | <5% | Search analytics |
| Content score average | N/A | >75/100 | >80/100 | Content scoring system |
| Broken internal links | 0 | 0 | 0 | CI/CD link checker |

### 14.4 Validation Plan

| Method | Purpose | Participants | When |
|--------|---------|:---:|------|
| **Tree Test** | Validate navigation hierarchy: can users find segment pages, features, pricing, procurement? | 15-20 across segments | Before build (Weeks 1-2) |
| **Card Sort (Closed)** | Validate content groupings: do users expect Sample Binders under Resources? Does "Platform" make sense? | 12-15 | Before build (Weeks 1-2) |
| **First-Click Test** | Validate CTAs and entry points: where do K-12 admins click first? Where do procurement officers go? | 10-15 per segment | After wireframes (Week 3-4) |
| **5-Second Test** | Does the homepage communicate what SafeTrekr does and route to segments? | 20 | After homepage design |
| **Navigation Analytics** | Track actual nav patterns, drop-off points, segment page engagement | All visitors | Post-launch, ongoing |
| **Search Log Analysis** | Identify content gaps from what users search for but cannot find | All search users | After search implementation (Month 6+) |
| **Content Score Audit** | Verify all published content meets quality bar | All content | Monthly, automated |
| **AI Citation Monitoring** | Track SafeTrekr mentions in AI answer engines | N/A | Monthly, manual + automated |

---

## Appendix A: Accessibility Specification for Navigation

| Requirement | Implementation |
|-------------|----------------|
| **Skip navigation** | `<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:p-2">Skip to main content</a>` as first focusable element |
| **Semantic landmarks** | `<nav aria-label="Main navigation">`, `<nav aria-label="Utility">`, `<nav aria-label="Footer">`, `<nav aria-label="Breadcrumb">`, `<main id="main-content">`, `<footer>` |
| **Keyboard: primary nav** | Tab through all primary items. Arrow keys within mega-menu. Escape closes dropdown. Enter activates link. |
| **Keyboard: mobile drawer** | Tab through drawer items. Escape closes drawer. Focus trapped within open drawer. |
| **Keyboard: search** | `Cmd+K` / `Ctrl+K` opens search. Escape closes. Arrow keys navigate suggestions. Enter selects. |
| **Focus management** | Visible focus ring (`ring-2 ring-primary-500 ring-offset-2`). Focus trapped in open mega-menus and modals. Focus returns to trigger on close. |
| **ARIA expanded** | `aria-expanded="true|false"` on all dropdown and accordion triggers |
| **ARIA current** | `aria-current="page"` on the navigation item matching the current page |
| **ARIA haspopup** | `aria-haspopup="true"` on navigation items with dropdowns |
| **Breadcrumbs** | `<nav aria-label="Breadcrumb">` containing `<ol>` with `<li>` items. Current page: `aria-current="page"`. |
| **Reduced motion** | `@media (prefers-reduced-motion: reduce)` disables all nav transitions and animations |
| **Color contrast** | All nav text: minimum 4.5:1 against background (WCAG 2.2 AA). Large text (>18px): 3:1 minimum. |
| **Touch targets** | All interactive elements: minimum 44x44px tap target on mobile |

---

## Appendix B: Robots.txt Specification

```
# SafeTrekr Marketing Site - robots.txt
# Explicitly allow AI crawlers for citation optimization

User-agent: *
Allow: /
Disallow: /api/
Disallow: /lp/
Disallow: /get-started
Sitemap: https://safetrekr.com/sitemap.xml

# AI Search Engine Crawlers - Explicitly Allowed
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Allow: /
```

---

## Appendix C: Analytics Event Taxonomy

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `page_view` | Every page load | `page_path`, `page_title`, `segment_context`, `referrer` |
| `cta_click` | Any CTA button click | `cta_label`, `cta_url`, `cta_variant`, `page_path`, `segment_context` |
| `nav_click` | Any navigation item click | `nav_item`, `nav_section` (primary/utility/footer/mobile), `page_path` |
| `mega_menu_open` | Mega-menu opens | `menu_section` (platform/solutions/resources) |
| `segment_select` | User clicks a segment card or segment nav item | `segment_id`, `source` (homepage/nav/solutions) |
| `form_start` | User focuses first form field | `form_type` (demo/contact/gate), `page_path` |
| `form_submit` | Form successfully submitted | `form_type`, `segment_context`, `page_path` |
| `demo_request` | Demo form submitted | `org_type`, `segment`, `source_page` |
| `lead_magnet_download` | Gated content downloaded | `asset_type`, `asset_slug`, `segment` |
| `roi_calculator_complete` | ROI calculator produces results | `trips_per_year`, `avg_group_size`, `estimated_savings` |
| `pricing_view` | Pricing page viewed | `referrer_page`, `segment_context` |
| `procurement_download` | Procurement document downloaded | `document_type` (w9/security-questionnaire/contract) |
| `search_query` | Search executed (when available) | `query`, `results_count`, `page_path` |
| `search_click` | Search result clicked | `query`, `result_position`, `result_url` |
| `search_zero_results` | Search returns 0 results | `query`, `page_path` |
| `scroll_depth` | User scrolls 25/50/75/100% of page | `depth_percentage`, `page_path` |
| `faq_expand` | FAQ accordion item expanded | `question_id`, `page_path` |
| `external_link_click` | Click to external URL | `destination_url`, `link_text`, `page_path` |
| `glossary_tooltip_view` | Glossary tooltip shown (when available) | `term`, `page_path` |

---

*Analysis produced for the best prompter in existence.*
*Architecture version 2.0.0. Builds on discovery v1.0.0.*
*Total pages specified: 41-49 at launch, scaling to 162-273 at 12 months.*
*Enhancement proposals: 12.*
*Next action: Tree test validation of navigation hierarchy before build.*
