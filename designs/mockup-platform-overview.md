# Platform Overview Mockup Specification: SafeTrekr Marketing Site

**Version**: 1.0
**Date**: 2026-03-24
**Page**: Platform Overview (`/platform`)
**Status**: Implementation-Ready High-Fidelity Specification
**Dependencies**: DESIGN-SYSTEM.md (canonical), INFORMATION-ARCHITECTURE.md (Section 1.1, 2.2.1, 5.2)
**Viewport Targets**: 1440px (desktop), 768px (tablet), 375px (mobile)

> This document specifies every pixel, token, component, content string, and interaction for the SafeTrekr Platform Overview page. Developers implement from this document. Designers validate against it. No interpretation is required.

---

## Table of Contents

1. [Page-Level Architecture](#1-page-level-architecture)
2. [Section 1: Site Header](#2-section-1-site-header)
3. [Section 2: Hero](#3-section-2-hero)
4. [Section 3: 3-Act Mechanism Preview](#4-section-3-3-act-mechanism-preview)
5. [Section 4: Feature Cards Grid](#5-section-4-feature-cards-grid)
6. [Section 5: Trust Metrics Strip](#6-section-5-trust-metrics-strip)
7. [Section 6: Dark CTA Band](#7-section-6-dark-cta-band)
8. [Section 7: Site Footer](#8-section-7-site-footer)
9. [Page-Level Accessibility](#9-page-level-accessibility)
10. [Performance Budget](#10-performance-budget)

---

## 1. Page-Level Architecture

### 1.1 Page Purpose

The Platform Overview page is the product capabilities hub for SafeTrekr. It serves as a section landing page (L1) that introduces the three-act mechanism (Intelligence, Review, Documentation) and routes visitors to the 6 individual feature deep-dive pages. Visitors arrive here from the primary nav "Platform" link, the mega-menu "Explore Platform" card, homepage feature grid links, and organic search.

**Page Type**: Section Landing Page (SSG)
**Hierarchy Level**: L1
**Breadcrumb**: None (L1 page per IA breadcrumb rules)
**Canonical URL**: `https://www.safetrekr.com/platform`
**Redirects**: `/features` -> `/platform` (301), `/product` -> `/platform` (301)

### 1.2 Section Rhythm and Surface Allocation

```
 Section                          Surface              Background Token          Dark?
 -----------------------------------------------------------------------------------------
 1.  Site Header                  Transparent/Glass     transparent -> bg/80      No
 2.  Hero                         Light                 background (#e7ecee)      No
 3.  3-Act Mechanism Preview      Accent wash           primary-50 (#f1f9f4)      No
 4.  Feature Cards Grid           Light                 background (#e7ecee)      No
 5.  Trust Metrics Strip          Card                  card (#f7f8f8)            No
 6.  Dark CTA Band                DARK SECTION 1        secondary (#123646)       YES
 7.  Footer                       Dark (uncounted)      secondary (#123646)       Always
```

**Dark section count**: 1 (CTA Band). Footer excluded per design system rule. Well within the 2-per-page maximum. The single dark section sits at approximately 85% of page depth, providing a strong closing anchor.

**Surface rhythm**: Light -> Accent wash -> Light -> Card -> Dark. Each transition is visually distinct. No two identical surfaces are adjacent. The accent wash (Section 3) provides a gentle lift between the hero and the feature grid, signaling a shift from platform-level storytelling to specific capability browsing.

### 1.3 Global Container

All content sections use the standard container pattern:

```
max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12
```

- `--container-max`: 1280px
- Side padding: 24px (mobile) / 32px (tablet) / 48px (desktop)
- At 1440px viewport: (1440 - 1280) / 2 = 80px side margins + 48px padding = 128px total per side
- At 1536px+: Growing white space frames content

### 1.4 Page-Level JSON-LD

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "SafeTrekr",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": "Professional trip safety review platform combining government intelligence data, analyst review, and tamper-evident documentation.",
      "url": "https://www.safetrekr.com/platform",
      "featureList": [
        "Analyst Safety Review",
        "Risk Intelligence Engine",
        "Trip Safety Binder",
        "Mobile Field Operations",
        "Real-Time Monitoring",
        "Compliance & Evidence"
      ],
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "450",
        "highPrice": "1250",
        "priceCurrency": "USD",
        "offerCount": "3"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.safetrekr.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Platform",
          "item": "https://www.safetrekr.com/platform"
        }
      ]
    }
  ]
}
```

### 1.5 SEO Metadata

```html
<title>Trip Safety Platform | SafeTrekr - Intelligence, Review, Documentation</title>
<meta name="description" content="SafeTrekr combines government intelligence from 5 data sources, 17-section analyst review, and SHA-256 evidence documentation into a complete trip safety platform. Explore all capabilities." />
<meta property="og:title" content="The SafeTrekr Platform | Intelligence. Review. Documentation." />
<meta property="og:description" content="Professional trip safety review powered by government intelligence, analyst expertise, and tamper-evident documentation." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://www.safetrekr.com/platform" />
<link rel="canonical" href="https://www.safetrekr.com/platform" />
```

### 1.6 Target Audience

- Trip coordinators evaluating SafeTrekr capabilities
- Risk managers assessing platform comprehensiveness
- IT evaluators reviewing technical depth (encryption, compliance)
- Procurement officers understanding what the platform includes
- Executives and board members needing a capability summary

### 1.7 User Actions Available

| Action | Mechanism | Destination |
|--------|-----------|-------------|
| Navigate to any feature page | Feature cards | `/platform/[feature]` |
| Request a demo | CTA buttons | `/demo` |
| See a sample binder | CTA buttons | `/resources/sample-binders` |
| View how it works | Mechanism card links | `/how-it-works` |
| View pricing | Contextual link | `/pricing` |

### 1.8 Primary CTAs (Priority Order)

1. "Get a Demo" (hero primary, CTA band primary)
2. "See a Sample Binder" (hero secondary, CTA band secondary)
3. Feature card navigation (implicit -- card clicks)

---

## 2. Section 1: Site Header

**Component**: `SiteHeader`
**File**: `components/layout/site-header.tsx`
**Position**: `sticky top-0 z-[var(--z-sticky)]` (z-index: 30)

Shared component. Identical to all other pages. See mockup-homepage.md Section 2 for full specification.

**Active state**: "Platform" nav item displays active styling: `text-foreground font-semibold` with 2px bottom border `primary-500`. This signals to the visitor they are within the Platform section.

### 2.1 Layout (1440px Desktop)

```
+--[Container: max-w-[1280px] mx-auto px-12]------------------------------------+
|                                                                                 |
|  [Logo 32px]    Platform v  Solutions v  How It Works  Pricing  Resources v     |
|                 ^^^^^^^^^                              [Sign In]  [ Get a Demo ] |
|                 ACTIVE                                                           |
+---------------------------------------------------------------------------------+
```

### 2.2 Layout (375px Mobile)

```
+--[px-6]--------------------------------------------+
|  [Logo 28px]                         [Hamburger]    |
+-----------------------------------------------------+
```

All other header behavior (scroll state, mobile drawer, skip-nav) is identical to the shared SiteHeader spec.

---

## 3. Section 2: Hero

**Component**: `PlatformHero` (custom organism)
**Surface**: `background` (#e7ecee)
**Background treatment**: Faint dot-grid pattern at 3-4% opacity using `primary-300`, CSS `radial-gradient(circle, var(--color-primary-300) 1px, transparent 1px)` with `background-size: 24px 24px`. Consistent with homepage hero treatment.

### 3.1 Layout (1440px Desktop)

```
+--[Full width: bg-background]------------------------------------------------------+
|                                                                                    |
|  +--[Container: 1280px]--------------------------------------------------------+  |
|  |  pt-24 (96px)                                                                |  |
|  |                                                                              |  |
|  |                  [center-aligned content block]                              |  |
|  |                     max-w-[800px] mx-auto                                    |  |
|  |                                                                              |  |
|  |                  THE SAFETREKR PLATFORM                                      |  |
|  |                                                                              |  |
|  |             Intelligence. Review.                                            |  |
|  |                Documentation.                                                |  |
|  |                                                                              |  |
|  |         Every trip goes through the same rigorous                            |  |
|  |         process: government intelligence analysis,                           |  |
|  |         professional safety review, and tamper-evident                       |  |
|  |         documentation. Here is every capability                              |  |
|  |         that protects your travelers and your                                |  |
|  |         organization.                                                        |  |
|  |                                                                              |  |
|  |              [ Get a Demo ]   [ See Sample Binder ]                          |  |
|  |                                                                              |  |
|  |  pb-20 (80px)                                                                |  |
|  +------------------------------------------------------------------------------+  |
|                                                                                    |
+------------------------------------------------------------------------------------+
```

**Layout**: Center-aligned text block. `text-center max-w-[800px] mx-auto`. Unlike the homepage split-layout hero, this section landing page uses a centered editorial approach -- no product composition visual. The visual weight comes from the 3-Act Mechanism Preview directly below.

**Grid**: No grid. Single centered column.
**Spacing**: `pt-24 pb-20` desktop per hero spacing spec.

### 3.2 Text Content

| Element | Content | Styles |
|---------|---------|--------|
| Eyebrow | "THE SAFETREKR PLATFORM" | `.text-eyebrow text-primary-700` (13px, weight 600, tracking 0.08em, uppercase, Plus Jakarta Sans). Leading icon: ShieldPath custom icon, 16px, `text-primary-700`, `mr-2`. `justify-center` for centered layout. |
| Headline | "Intelligence. Review. Documentation." | `.text-display-lg text-foreground` = `clamp(2.125rem, 1.15rem + 2.72vw, 3.5rem)`, weight 700, line-height 1.1, tracking -0.02em, Plus Jakarta Sans. `max-w-[28ch] mx-auto`. Renders as `<h1>`. |
| Subheadline | "Every trip goes through the same rigorous process: government intelligence analysis, professional safety review, and tamper-evident documentation. Here is every capability that protects your travelers and your organization." | `.text-body-lg text-muted-foreground` = `clamp(1.125rem, 1.04rem + 0.25vw, 1.25rem)`, weight 400, line-height 1.6, Inter. `max-w-[60ch] mx-auto mt-6` (24px top margin). Color: `muted-foreground` (#4d5153). |
| CTA Primary | "Get a Demo" | `Button variant="primary" size="lg"` = `h-13 px-8 text-lg font-semibold`, `bg-primary-600` (#3f885b), white text, `rounded-md` (8px). `mt-8`. Icon: `ArrowRight` (20px) right of text. Links to `/demo`. |
| CTA Secondary | "See Sample Binder" | `Button variant="secondary" size="lg"` = `h-13 px-8 text-lg font-semibold`, `transparent` bg, `text-foreground`, `border border-border`, `rounded-md`. `ml-4`. Icon: `Download` (20px) right of text. Links to `/resources/sample-binders`. |

**CTA row**: `flex flex-wrap justify-center gap-4 mt-8`

### 3.3 Animation Sequence

| Time | Element | Animation Preset | Duration | Easing |
|------|---------|-----------------|----------|--------|
| 0ms | Eyebrow | `fadeIn` | 300ms | `ease-default` |
| 100ms | Headline | `fadeUp` (y: 30px to 0) | 500ms | `ease-spring` |
| 250ms | Subheadline | `fadeUp` (y: 20px to 0) | 400ms | `ease-enter` |
| 400ms | CTA buttons | `fadeUp` (y: 20px to 0) | 300ms | `ease-enter` |

**Headline is visible immediately** -- rendered in HTML via SSG. Animation is enhancement only.

**Reduced motion**: All elements render at final state immediately. No transforms. Opacity transitions only.

### 3.4 Responsive Behavior

**768px (Tablet)**:
```
+--[Container: px-8]-------------------------------+
|  pt-20 (80px)                                     |
|                                                   |
|  [center-aligned]                                 |
|                                                   |
|  THE SAFETREKR PLATFORM                           |
|                                                   |
|  Intelligence. Review.                            |
|  Documentation.                                   |
|                                                   |
|  Every trip goes through the same                 |
|  rigorous process...                              |
|                                                   |
|  [ Get a Demo ]   [ See Sample Binder ]           |
|                                                   |
|  pb-16 (64px)                                     |
+---------------------------------------------------+
```

- Layout: Same centered approach. `text-center`.
- Headline: `clamp()` resolves to approximately 34px at 768px.
- Spacing: `pt-20 pb-16`.

**375px (Mobile)**:
```
+--[px-6]-------------------------------+
|  pt-16 (64px)                          |
|                                        |
|  [center-aligned]                      |
|                                        |
|  THE SAFETREKR PLATFORM                |
|                                        |
|  Intelligence.                         |
|  Review.                               |
|  Documentation.                        |
|                                        |
|  Every trip goes through               |
|  the same rigorous process...          |
|                                        |
|  [ Get a Demo ] (full width)           |
|  [ See Sample Binder ] (full width)    |
|                                        |
|  pb-12 (48px)                          |
+----------------------------------------+
```

- Layout: Centered. `text-center`.
- Headline: `clamp()` resolves to approximately 34px at 375px. `max-w-[28ch]` wraps to 3 lines.
- CTAs: Stacked full-width. `flex flex-col gap-3`. Each button `w-full`.
- Spacing: `pt-16 pb-12`.

### 3.5 Accessibility

- `<h1>` on headline (only `<h1>` on page).
- Skip-nav target: `<main id="main-content">` wraps everything below header.
- CTA buttons: Descriptive text, self-explanatory labels.
- Focus order: Skip-nav -> Header nav -> Hero CTA Primary -> Hero CTA Secondary.

---

## 4. Section 3: 3-Act Mechanism Preview

**Component**: `MechanismPreview` (custom organism)
**File**: `components/marketing/mechanism-preview.tsx`
**Surface**: `primary-50` (#f1f9f4) -- accent wash
**Purpose**: Introduces the three-act mechanism (Intelligence > Review > Documentation) as a visual progression. Each card provides a concise summary with a link to the relevant feature page for deeper exploration.

### 4.1 Layout (1440px Desktop)

```
+--[Full width: bg-primary-50]---------------------------------------------------+
|                                                                                 |
|  +--[Container: 1280px]-----------------------------------------------------+  |
|  |  py-24 (96px)                                                             |  |
|  |                                                                           |  |
|  |                  HOW SAFETREKR WORKS                                      |  |
|  |                                                                           |  |
|  |     Three acts. One rigorous process.                                     |  |
|  |                                                                           |  |
|  |  mt-12 (48px)                                                             |  |
|  |                                                                           |  |
|  |  +--[grid grid-cols-3 gap-8]-----------------------------------------+   |  |
|  |  |                                                                    |   |  |
|  |  |  +--[Card 1]----------+  +--[Card 2]----------+  +--[Card 3]---+  |   |  |
|  |  |  |                    |  |                    |  |              |  |   |  |
|  |  |  |  [1] circle        |  |  [2] circle        |  |  [3] circle |  |   |  |
|  |  |  |                    |  |                    |  |              |  |   |  |
|  |  |  |  [Route icon]      |  |  [Clipboard icon]  |  |  [File icon]|  |   |  |
|  |  |  |                    |  |                    |  |              |  |   |  |
|  |  |  |  Intelligence      |  |  Review             |  |  Document-  |  |   |  |
|  |  |  |                    |  |                    |  |  ation       |  |   |  |
|  |  |  |  Government data   |  |  Professional      |  |  Tamper-    |  |   |  |
|  |  |  |  from 5 sources    |  |  17-section safety |  |  evident    |  |   |  |
|  |  |  |  scored by Monte   |  |  analysis by a     |  |  binder     |  |   |  |
|  |  |  |  Carlo simulation  |  |  trained analyst   |  |  with SHA-  |  |   |  |
|  |  |  |  for every         |  |  covering every    |  |  256 hash   |  |   |  |
|  |  |  |  destination.      |  |  dimension of      |  |  chain      |  |   |  |
|  |  |  |                    |  |  your trip.        |  |  integrity. |  |   |  |
|  |  |  |                    |  |                    |  |              |  |   |  |
|  |  |  |  Learn more ->     |  |  Learn more ->     |  |  Learn ->   |  |   |  |
|  |  |  +--------------------+  +--------------------+  +--------------+  |   |  |
|  |  |                                                                    |   |  |
|  |  |      -------- connector --------  -------- connector --------      |   |  |
|  |  |                                                                    |   |  |
|  |  +--------------------------------------------------------------------+   |  |
|  |                                                                           |  |
|  |  py-24 (96px)                                                             |  |
|  +--------------------------------------------------------------- ----------+  |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

**Section heading**: Center-aligned above the card grid.

| Element | Content | Styles |
|---------|---------|--------|
| Eyebrow | "HOW SAFETREKR WORKS" | `.text-eyebrow text-primary-700` (13px, weight 600, tracking 0.08em, uppercase). `text-center`. |
| Headline | "Three acts. One rigorous process." | `.text-heading-lg text-foreground text-center` = `clamp(1.5rem, 0.97rem + 1.49vw, 2.25rem)`, weight 700, line-height 1.2, tracking -0.01em, Plus Jakarta Sans. `mt-3`. |

**Grid**: `grid lg:grid-cols-3 gap-8 mt-12`

### 4.2 Mechanism Cards Content

Each card is an enhanced `FeatureCard` with numbered step indicator and horizontal connector.

**Card container**: `bg-card rounded-xl border border-border p-8 shadow-card relative`. Hover: `shadow-card-hover`, `translateY(-2px)`, `transition-all duration-normal ease-default`. Entire card is an `<a>` link (`group` pattern).

**Connectors**: Between cards 1-2 and 2-3, a horizontal dashed line connector rendered as `border-t-2 border-dashed border-primary-200` positioned at the vertical center of the step number circle. Hidden on mobile (< lg). Implemented as `::after` pseudo-element on cards 1 and 2, `absolute right-[-20px] top-[52px] w-[calc(var(--spacing-8))] border-t-2 border-dashed border-primary-200`.

#### Card 1: Intelligence

| Element | Content | Styles |
|---------|---------|--------|
| Step number | "1" | `h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-heading-sm font-semibold` (40px circle). |
| Icon | `Route` (Lucide) | `h-8 w-8 text-primary-500 mt-4` (32px, decorative accent). Inside a `h-14 w-14 rounded-lg bg-primary-50 flex items-center justify-center` container. |
| Title | "Intelligence" | `.text-heading-md text-foreground mt-4` = `clamp(1.25rem, 0.9rem + 0.99vw, 1.75rem)`, weight 600, Plus Jakarta Sans. |
| Description | "Government data from 5 sources -- NOAA, USGS, CDC, GDACS, and ReliefWeb -- scored by Monte Carlo simulation for every destination on your itinerary." | `.text-body-md text-muted-foreground mt-2 max-w-[45ch]` = 16px, weight 400, Inter. Color: `muted-foreground` (#4d5153). |
| Link | "Explore Risk Intelligence" | `.text-body-sm font-medium text-primary-700 mt-4 inline-flex items-center gap-1` with `ArrowRight` icon (16px). Arrow translates 4px right on parent hover. Links to `/platform/risk-intelligence`. |

#### Card 2: Review

| Element | Content | Styles |
|---------|---------|--------|
| Step number | "2" | Same as Card 1. |
| Icon | `ClipboardCheck` (Lucide) | Same sizing/container as Card 1. |
| Title | "Review" | Same styles as Card 1. |
| Description | "A trained safety analyst conducts a 17-section professional review covering every dimension of your trip -- venue, transportation, health, emergency planning, and more." | Same styles as Card 1. |
| Link | "See the Analyst Review" | Same styles as Card 1. Links to `/platform/analyst-review`. |

#### Card 3: Documentation

| Element | Content | Styles |
|---------|---------|--------|
| Step number | "3" | Same as Card 1. |
| Icon | `FileText` (Lucide) | Same sizing/container as Card 1. |
| Title | "Documentation" | Same styles as Card 1. |
| Description | "Every finding, recommendation, and risk score compiled into a tamper-evident Trip Safety Binder with SHA-256 hash-chain integrity. Audit-ready from the moment it is delivered." | Same styles as Card 1. |
| Link | "See the Safety Binder" | Same styles as Card 1. Links to `/platform/safety-binder`. |

### 4.3 Animation Sequence

| Time | Element | Animation Preset | Duration | Easing |
|------|---------|-----------------|----------|--------|
| 0ms | Eyebrow | `fadeUp` (stagger child 1) | 300ms | `ease-enter` |
| 80ms | Headline | `fadeUp` (stagger child 2) | 300ms | `ease-enter` |
| 200ms | Card 1 | `cardReveal` (y: 24, scale: 0.98 to y: 0, scale: 1) | 500ms | `ease-spring` |
| 280ms | Card 2 | `cardReveal` | 500ms | `ease-spring` |
| 360ms | Card 3 | `cardReveal` | 500ms | `ease-spring` |
| 400ms | Connectors | `fadeIn` | 200ms | `ease-default` |

All triggered at 20% viewport intersection via `staggerContainer` parent.

**Reduced motion**: Cards appear at final position immediately. No transforms.

### 4.4 Responsive Behavior

**768px (Tablet)**:
```
+--[Container: px-8]-------------------------------+
|  py-16 (64px)                                     |
|                                                   |
|  HOW SAFETREKR WORKS                              |
|  Three acts. One rigorous process.                |
|                                                   |
|  +--[grid grid-cols-3 gap-6]------------------+  |
|  |  [1]           [2]           [3]            |  |
|  |  Intelligence   Review        Documentation |  |
|  |  Govt data...   17-section... Tamper-       |  |
|  |                               evident...    |  |
|  |  Learn more ->  Learn more -> Learn more -> |  |
|  +---------------------------------------------+  |
|                                                   |
+---------------------------------------------------+
```

- Grid remains `grid-cols-3` at tablet (768px). Cards compress with `p-6` instead of `p-8`.
- Connectors remain visible.
- Section padding: `py-16` (64px).
- Gap: `gap-6`.

**375px (Mobile)**:
```
+--[px-6]-------------------------------+
|  py-12 (48px)                          |
|                                        |
|  HOW SAFETREKR WORKS                   |
|  Three acts. One rigorous              |
|  process.                              |
|                                        |
|  +--[1]--------------------------+     |
|  |  [1] Intelligence             |     |
|  |  Government data from 5       |     |
|  |  sources...                   |     |
|  |  Explore Risk Intelligence -> |     |
|  +-------------------------------+     |
|                                        |
|  +--[2]--------------------------+     |
|  |  [2] Review                   |     |
|  |  A trained safety analyst...  |     |
|  |  See the Analyst Review ->    |     |
|  +-------------------------------+     |
|                                        |
|  +--[3]--------------------------+     |
|  |  [3] Documentation            |     |
|  |  Every finding...             |     |
|  |  See the Safety Binder ->     |     |
|  +-------------------------------+     |
|                                        |
+----------------------------------------+
```

- Grid: `grid-cols-1 gap-6`. Cards stack vertically.
- Connectors hidden (`hidden lg:block`).
- Card padding: `p-6`.
- Section padding: `py-12` (48px).
- Step number and icon row: `flex items-center gap-4` (horizontal, number left, icon container right).

### 4.5 Accessibility

- Section landmark: `<section aria-label="How SafeTrekr works">`.
- Each card is an `<a>` wrapping the full card, with `aria-label` providing context: e.g., `aria-label="Intelligence: Explore risk intelligence capabilities"`.
- Step numbers: Decorative (`aria-hidden="true"`) since the card title and link text provide sufficient context.
- Connectors: `aria-hidden="true"` (decorative).
- Focus order: Card 1 -> Card 2 -> Card 3 (logical left-to-right, top-to-bottom).
- Focus ring: 2px `ring` color, 2px offset, `rounded-xl` to match card shape.

---

## 5. Section 4: Feature Cards Grid

**Component**: `FeatureGrid` with `FeatureCard` children
**Files**: `components/marketing/feature-grid.tsx`, `components/marketing/feature-card.tsx`
**Surface**: `background` (#e7ecee)
**Purpose**: Displays all 6 platform capabilities as navigable cards. Each links to its dedicated feature page. This is the primary wayfinding mechanism for the Platform section.

### 5.1 Layout (1440px Desktop)

```
+--[Full width: bg-background]---------------------------------------------------+
|                                                                                 |
|  +--[Container: 1280px]-----------------------------------------------------+  |
|  |  py-24 (96px)                                                             |  |
|  |                                                                           |  |
|  |                  PLATFORM CAPABILITIES                                    |  |
|  |                                                                           |  |
|  |     Everything your organization needs                                    |  |
|  |     to protect every trip.                                                |  |
|  |                                                                           |  |
|  |  mt-12 (48px)                                                             |  |
|  |                                                                           |  |
|  |  +--[grid grid-cols-3 gap-6]-----------------------------------------+   |  |
|  |  |                                                                    |   |  |
|  |  |  +--[Analyst Review]---+ +--[Risk Intel]-------+ +--[Binder]-----+ |   |  |
|  |  |  |  [Clipboard icon]   | |  [Route icon]       | |  [File icon]  | |   |  |
|  |  |  |  Analyst Safety     | |  Risk Intelligence  | |  Trip Safety  | |   |  |
|  |  |  |  Review             | |  Engine              | |  Binder       | |   |  |
|  |  |  |  17-section...      | |  Monte Carlo...     | |  Audit-ready..| |   |  |
|  |  |  |  Learn more ->      | |  Learn more ->      | |  Learn more ->| |   |  |
|  |  |  +---------------------+ +---------------------+ +---------------+ |   |  |
|  |  |                                                                    |   |  |
|  |  |  +--[Mobile App]------+ +--[Monitoring]--------+ +--[Compliance]-+ |   |  |
|  |  |  |  [Smartphone icon]  | |  [Activity icon]    | |  [Shield icon]| |   |  |
|  |  |  |  Mobile Field       | |  Real-Time          | |  Compliance & | |   |  |
|  |  |  |  Operations         | |  Monitoring          | |  Evidence     | |   |  |
|  |  |  |  Live tracking...   | |  Geofence alerts... | |  FERPA, SOC 2.| |   |  |
|  |  |  |  Learn more ->      | |  Learn more ->      | |  Learn more ->| |   |  |
|  |  |  +---------------------+ +---------------------+ +---------------+ |   |  |
|  |  |                                                                    |   |  |
|  |  +--------------------------------------------------------------------+   |  |
|  |                                                                           |  |
|  +--------------------------------------------------------------- ----------+  |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

**Section heading**: Center-aligned above grid.

| Element | Content | Styles |
|---------|---------|--------|
| Eyebrow | "PLATFORM CAPABILITIES" | `.text-eyebrow text-primary-700 text-center` (13px, weight 600, tracking 0.08em, uppercase). |
| Headline | "Everything your organization needs to protect every trip." | `.text-heading-lg text-foreground text-center` = `clamp(1.5rem, 0.97rem + 1.49vw, 2.25rem)`, weight 700, line-height 1.2, Plus Jakarta Sans. `max-w-[28ch] mx-auto mt-3`. |

**Grid**: `grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12`

### 5.2 Feature Cards Content

Each card uses the standard `FeatureCard` component:

**Card container**: `bg-card rounded-xl border border-border p-6 sm:p-8 shadow-card`. Hover: `shadow-card-hover`, `translateY(-2px)`, `transition-all duration-normal ease-default`. Entire card is `<a>` with `group` class.

#### Card 1: Analyst Safety Review

| Element | Content | Styles |
|---------|---------|--------|
| Icon | `ClipboardCheck` (Lucide) | `h-6 w-6 text-primary-700` inside `h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center`. |
| Title | "Analyst Safety Review" | `.text-heading-sm text-foreground mb-2` = `clamp(1.125rem, 0.95rem + 0.5vw, 1.375rem)`, weight 600. Renders as `<h3>`. |
| Description | "Every trip plan is reviewed across 17 safety dimensions by a trained analyst. Venue, transportation, health, emergency contacts, and 13 more sections -- nothing is left to guesswork." | `.text-body-md text-muted-foreground max-w-[45ch]` = 16px, weight 400, Inter. |
| Link | "Learn more" | `.text-body-sm font-medium text-primary-700 mt-4 inline-flex items-center gap-1`. `ArrowRight` icon (16px), translates 4px on parent hover. |
| href | `/platform/analyst-review` | |

#### Card 2: Risk Intelligence Engine

| Element | Content | Styles |
|---------|---------|--------|
| Icon | `Route` (Lucide) | Same icon container styles. |
| Title | "Risk Intelligence Engine" | Same title styles. |
| Description | "Government data from NOAA, USGS, CDC, GDACS, and ReliefWeb scored through Monte Carlo simulation. Probability-weighted risk assessments for every destination on your itinerary." | Same description styles. |
| Link | "Learn more" | Same link styles. |
| href | `/platform/risk-intelligence` | |

#### Card 3: Trip Safety Binder

| Element | Content | Styles |
|---------|---------|--------|
| Icon | `FileText` (Lucide) | Same icon container styles. |
| Title | "Trip Safety Binder" | Same title styles. |
| Description | "Every finding, risk score, and recommendation compiled into an audit-ready document. SHA-256 hash-chain ensures tamper-evident integrity from delivery through long-term archival." | Same description styles. |
| Link | "Learn more" | Same link styles. |
| href | `/platform/safety-binder` | |

#### Card 4: Mobile Field Operations

| Element | Content | Styles |
|---------|---------|--------|
| Icon | `Smartphone` (Lucide) | Same icon container styles. |
| Title | "Mobile Field Operations" | Same title styles. |
| Description | "Live participant tracking, geofence alerts, rally point navigation, muster check-ins, and SMS broadcast. Everything your chaperones need in their pocket during the trip." | Same description styles. |
| Link | "Learn more" | Same link styles. |
| href | `/platform/mobile-app` | |

#### Card 5: Real-Time Monitoring

| Element | Content | Styles |
|---------|---------|--------|
| Icon | `Activity` (Lucide) | Same icon container styles. |
| Title | "Real-Time Monitoring" | Same title styles. |
| Description | "Geofence boundary alerts, muster check-in tracking, participant location visibility, and automated escalation paths. Know where your people are and when something changes." | Same description styles. |
| Link | "Learn more" | Same link styles. |
| href | `/platform/monitoring` | |

#### Card 6: Compliance and Evidence

| Element | Content | Styles |
|---------|---------|--------|
| Icon | `Shield` (Lucide) | Same icon container styles. |
| Title | "Compliance & Evidence" | Same title styles. |
| Description | "Designed with FERPA, SOC 2, and GDPR requirements in mind. Tamper-evident audit trail, automated purge proofs, and compliance documentation that satisfies your legal and insurance teams." | Same description styles. |
| Link | "Learn more" | Same link styles. |
| href | `/platform/compliance` | |

### 5.3 Animation Sequence

| Time | Element | Animation Preset | Duration | Easing |
|------|---------|-----------------|----------|--------|
| 0ms | Eyebrow | `fadeUp` (stagger child 1) | 300ms | `ease-enter` |
| 80ms | Headline | `fadeUp` (stagger child 2) | 300ms | `ease-enter` |
| 200ms | Card 1 | `cardReveal` | 500ms | `ease-spring` |
| 280ms | Card 2 | `cardReveal` | 500ms | `ease-spring` |
| 360ms | Card 3 | `cardReveal` | 500ms | `ease-spring` |
| 440ms | Card 4 | `cardReveal` | 500ms | `ease-spring` |
| 520ms | Card 5 | `cardReveal` | 500ms | `ease-spring` |
| 600ms | Card 6 | `cardReveal` | 500ms | `ease-spring` |

All triggered at 20% viewport intersection via `staggerContainer` parent. Cards stagger at 80ms intervals per design system spec.

**Reduced motion**: Cards appear at final position immediately.

### 5.4 Responsive Behavior

**768px (Tablet)**:
```
+--[Container: px-8]-------------------------------+
|  py-16 (64px)                                     |
|                                                   |
|  PLATFORM CAPABILITIES                            |
|  Everything your organization needs               |
|  to protect every trip.                           |
|                                                   |
|  +--[grid grid-cols-2 gap-6]------------------+  |
|  |  [Analyst Review]    [Risk Intelligence]    |  |
|  |  [Trip Safety Binder] [Mobile Field Ops]    |  |
|  |  [Real-Time Monitor]  [Compliance]          |  |
|  +---------------------------------------------+  |
|                                                   |
+---------------------------------------------------+
```

- Grid: `grid-cols-2 gap-6`. 3 rows of 2 cards.
- Card padding: `p-6`.
- Section padding: `py-16` (64px).

**375px (Mobile)**:
```
+--[px-6]-------------------------------+
|  py-12 (48px)                          |
|                                        |
|  PLATFORM CAPABILITIES                 |
|  Everything your organization          |
|  needs to protect every trip.          |
|                                        |
|  +--[Analyst Safety Review]------+     |
|  |  [icon] Analyst Safety Review |     |
|  |  Every trip plan reviewed...  |     |
|  |  Learn more ->                |     |
|  +-------------------------------+     |
|                                        |
|  +--[Risk Intelligence]----------+     |
|  |  ...                          |     |
|  +-------------------------------+     |
|                                        |
|  +--[Trip Safety Binder]---------+     |
|  |  ...                          |     |
|  +-------------------------------+     |
|                                        |
|  +--[Mobile Field Operations]----+     |
|  |  ...                          |     |
|  +-------------------------------+     |
|                                        |
|  +--[Real-Time Monitoring]-------+     |
|  |  ...                          |     |
|  +-------------------------------+     |
|                                        |
|  +--[Compliance & Evidence]------+     |
|  |  ...                          |     |
|  +-------------------------------+     |
|                                        |
+----------------------------------------+
```

- Grid: `grid-cols-1 gap-4`. All 6 cards stacked.
- Card padding: `p-6`.
- Section padding: `py-12` (48px).
- Gap: `gap-4`.

### 5.5 Accessibility

- Section landmark: `<section aria-label="Platform capabilities">`.
- Section heading structure: `<h2>` for "Everything your organization needs to protect every trip."
- Each card title renders as `<h3>`.
- Cards are `<a>` elements -- single interactive target per card.
- Focus ring: 2px `ring` color, 2px offset, `rounded-xl` to match card shape.
- Focus order: Cards flow left-to-right, top-to-bottom (1, 2, 3, 4, 5, 6).
- Screen reader: Link text "Learn more" is supplemented by card context. Each card `<a>` has `aria-label` combining title and link: e.g., `aria-label="Analyst Safety Review -- learn more about professional trip safety review"`.

---

## 6. Section 5: Trust Metrics Strip

**Component**: `TrustMetricsStrip`
**File**: `components/marketing/trust-metrics-strip.tsx`
**Surface**: `card` (#f7f8f8)
**Border**: `border-y border-border` (top and bottom `#b8c3c7` 1px borders)

Shared component. Identical to homepage Trust Metrics Strip. See mockup-homepage.md Section 4 for full specification.

### 6.1 Layout (1440px Desktop)

```
+--[Full width: bg-card border-y border-border]----------------------------------+
|  py-12 (48px)                                                                   |
|                                                                                 |
|  +--[Container: 1280px]-----------------------------------------------------+  |
|  |                                                                           |  |
|  |  +--[grid grid-cols-5 gap-8]------------------------------------------+  |  |
|  |  |                                                                     |  |  |
|  |  |  [ 5 ]           [ 17 ]          [ 3-5 ]       [ AES-256 ]        |  |  |
|  |  |  GOVERNMENT      SAFETY REVIEW   DAY            ENCRYPTION         |  |  |
|  |  |  INTEL SOURCES   SECTIONS        TURNAROUND     STANDARD           |  |  |
|  |  |                                                                     |  |  |
|  |  |  [ SHA-256 ]                                                        |  |  |
|  |  |  EVIDENCE CHAIN                                                     |  |  |
|  |  |                                                                     |  |  |
|  |  +---------------------------------------------------------------------+  |  |
|  |                                                                           |  |
|  |  +--[Government source row: flex justify-center gap-x-12]-------------+  |  |
|  |  |  NOAA  |  USGS  |  CDC  |  GDACS  |  ReliefWeb                     |  |  |
|  |  +---------------------------------------------------------------------+  |  |
|  |                                                                           |  |
|  +--------------------------------------------------------------- ----------+  |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### 6.2 Stat Cards Content

| Value | Label | Prefix/Suffix | Animate |
|-------|-------|---------------|---------|
| `5` | "GOVERNMENT INTEL SOURCES" | -- | Yes (count from 0) |
| `17` | "SAFETY REVIEW SECTIONS" | -- | Yes (count from 0) |
| `3-5` | "DAY TURNAROUND" | -- | No (string, fade in) |
| `AES-256` | "ENCRYPTION STANDARD" | -- | No (string, fade in) |
| `SHA-256` | "EVIDENCE CHAIN" | -- | No (string, fade in) |

### 6.3 Responsive Behavior

**768px (Tablet)**:
- Grid: `grid-cols-3`. First row: 3 metrics. Second row: 2 metrics centered. `gap-6`.
- Section padding: `py-10` (40px).

**375px (Mobile)**:
- Grid: `grid-cols-2`. Three rows: 2, 2, 1 centered. `gap-4`.
- Section padding: `py-8` (32px).

### 6.4 Animation

Entire strip fades in together: `fadeIn` preset (opacity 0 to 1, 200ms). Triggered at 20% viewport intersection. Counter animations begin after fade completes.

### 6.5 Accessibility

- Section landmark: `<section aria-label="Platform credentials">`.
- `StatCard` animated counters: `aria-label` on each provides full value immediately (e.g., `aria-label="5 government intelligence sources"`).
- Government source labels: Text content, screen-reader accessible.

---

## 7. Section 6: Dark CTA Band

**Component**: `CTABand`
**File**: `components/marketing/cta-band.tsx`
**Variant**: `dark`
**Surface**: `secondary` (#123646)
**Purpose**: Strong closing conversion band. Single dark section on this page.

### 7.1 Layout (1440px Desktop)

```
+--[Full width: bg-secondary]----------------------------------------------------+
|  [data-theme="dark"]                                                            |
|                                                                                 |
|  +--[Container: 1280px]-----------------------------------------------------+  |
|  |  py-28 (112px)                                                            |  |
|  |                                                                           |  |
|  |                 text-center max-w-prose mx-auto                           |  |
|  |                                                                           |  |
|  |          Ready to see the platform in action?                             |  |
|  |                                                                           |  |
|  |     Schedule a personalized walkthrough and we will                       |  |
|  |     show you exactly what a safety binder looks                           |  |
|  |     like for your organization.                                           |  |
|  |                                                                           |  |
|  |            [ Get a Demo ]   [ See Sample Binder ]                         |  |
|  |                                                                           |  |
|  |  py-28 (112px)                                                            |  |
|  +--------------------------------------------------------------- ----------+  |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### 7.2 Content

| Element | Content | Styles |
|---------|---------|--------|
| Headline | "Ready to see the platform in action?" | `.text-display-md` = `clamp(1.75rem, 1.04rem + 1.98vw, 2.75rem)`, weight 700, Plus Jakarta Sans. Color: `dark-text-primary` (#f7f8f8). `text-center`. Contrast: 11.6:1 on secondary. PASS. |
| Body | "Schedule a personalized walkthrough and we will show you exactly what a safety binder looks like for your organization." | `.text-body-lg text-center` = `clamp(1.125rem, 1.04rem + 0.25vw, 1.25rem)`, weight 400, Inter. Color: `dark-text-secondary` (#b8c3c7). `max-w-prose mx-auto mt-4`. Contrast: 7.0:1 on secondary. PASS. |
| CTA Primary | "Get a Demo" | `Button variant="primary-on-dark" size="lg"` = `h-13 px-8 text-lg font-semibold`, `bg-white text-secondary`, `rounded-md`. Hover: `bg-card`. Links to `/demo`. Icon: `ArrowRight` (20px) right of text. |
| CTA Secondary | "See Sample Binder" | `Button variant="ghost" size="lg"` with dark override: `text-dark-text-primary border border-dark-border hover:bg-dark-surface`. `rounded-md`. Links to `/resources/sample-binders`. Icon: `Download` (20px) right of text. |

**CTA row**: `flex flex-wrap justify-center gap-4 mt-8`. Stacked below sm.

### 7.3 Responsive Behavior

**768px (Tablet)**:
- Spacing: `py-20` (80px).
- Same centered layout.
- CTA buttons: side by side.

**375px (Mobile)**:
```
+--[px-6]-------------------------------+
|  py-16 (64px)                          |
|  bg-secondary                          |
|                                        |
|  Ready to see the platform             |
|  in action?                            |
|                                        |
|  Schedule a personalized               |
|  walkthrough and we will show          |
|  you exactly what a safety             |
|  binder looks like for your            |
|  organization.                         |
|                                        |
|  [ Get a Demo ] (full width)           |
|  [ See Sample Binder ] (full width)    |
|                                        |
+----------------------------------------+
```

- Spacing: `py-16` (64px).
- CTA buttons: Stacked, `flex flex-col gap-3`. Each `w-full`.

### 7.4 Animation

| Time | Element | Animation Preset | Duration | Easing |
|------|---------|-----------------|----------|--------|
| 0ms | Entire section | `fadeIn` (background) | 200ms | `ease-default` |
| 200ms | Headline | `fadeUp` | 300ms | `ease-enter` |
| 300ms | Body | `fadeUp` | 300ms | `ease-enter` |
| 400ms | CTA buttons | `fadeUp` | 300ms | `ease-enter` |

Triggered at 20% viewport intersection.

### 7.5 Accessibility

- Section landmark: `<section aria-label="Request a demo">`.
- `[data-theme="dark"]` attribute activates dark surface token overrides.
- All text colors verified against dark background:
  - Headline: `#f7f8f8` on `#123646` = 11.6:1 (PASS AA normal + large).
  - Body: `#b8c3c7` on `#123646` = 7.0:1 (PASS AA normal + large).
  - White button text `#123646` on `#ffffff` = 12.6:1 (PASS).
- Focus rings visible on dark background: `ring` (#365462) with 2px white offset for visibility.
- CTA buttons meet 44x44px minimum touch target.

---

## 8. Section 7: Site Footer

**Component**: `SiteFooter`
**File**: `components/layout/site-footer.tsx`
**Surface**: `secondary` (#123646)

Shared component. Identical to all other pages. See mockup-homepage.md Section 12 for full specification.

The footer uses `secondary` background and does NOT count toward the 2-per-page dark section limit.

---

## 9. Page-Level Accessibility

### 9.1 Heading Hierarchy

```
<h1> Intelligence. Review. Documentation.                          (Hero)
  <h2> Three acts. One rigorous process.                           (3-Act Mechanism)
    <h3> Intelligence                                              (Mechanism Card 1)
    <h3> Review                                                    (Mechanism Card 2)
    <h3> Documentation                                             (Mechanism Card 3)
  <h2> Everything your organization needs to protect every trip.   (Feature Grid)
    <h3> Analyst Safety Review                                     (Feature Card 1)
    <h3> Risk Intelligence Engine                                  (Feature Card 2)
    <h3> Trip Safety Binder                                        (Feature Card 3)
    <h3> Mobile Field Operations                                   (Feature Card 4)
    <h3> Real-Time Monitoring                                      (Feature Card 5)
    <h3> Compliance & Evidence                                     (Feature Card 6)
  <h2> Ready to see the platform in action?                        (CTA Band)
```

Single `<h1>`. Logical nesting. No skipped levels.

### 9.2 Landmark Structure

```html
<body>
  <a href="#main-content" class="sr-only focus:not-sr-only ...">Skip to main content</a>
  <header>  <!-- SiteHeader -->
    <nav aria-label="Main navigation">...</nav>
  </header>
  <main id="main-content">
    <section aria-label="Platform overview">...</section>           <!-- Hero -->
    <section aria-label="How SafeTrekr works">...</section>         <!-- 3-Act Mechanism -->
    <section aria-label="Platform capabilities">...</section>       <!-- Feature Grid -->
    <section aria-label="Platform credentials">...</section>        <!-- Trust Metrics -->
    <section aria-label="Request a demo">...</section>              <!-- CTA Band -->
  </main>
  <footer>
    <nav aria-label="Footer navigation">...</nav>
  </footer>
</body>
```

### 9.3 Focus Order

1. Skip-nav link (hidden until focused)
2. Header: Logo -> Platform (active, mega-menu) -> Solutions -> How It Works -> Pricing -> Resources -> Sign In -> Get a Demo
3. Hero: CTA Primary ("Get a Demo") -> CTA Secondary ("See Sample Binder")
4. 3-Act Mechanism: Card 1 -> Card 2 -> Card 3
5. Feature Grid: Card 1 -> Card 2 -> Card 3 -> Card 4 -> Card 5 -> Card 6
6. Trust Metrics Strip: No interactive elements (stat values are informational)
7. CTA Band: Primary ("Get a Demo") -> Secondary ("See Sample Binder")
8. Footer: Column links in reading order

### 9.4 ARIA Requirements

| Element | ARIA Attribute | Value |
|---------|---------------|-------|
| Active nav item | `aria-current` | `"page"` on "Platform" link |
| Mechanism step numbers | `aria-hidden` | `"true"` (decorative) |
| Mechanism connectors | `aria-hidden` | `"true"` (decorative) |
| Feature card links | `aria-label` | `"{Title} -- learn more about {description}"` |
| StatCard counters | `aria-label` | Full value (e.g., "5 government intelligence sources") |
| CTA Band section | `data-theme` | `"dark"` (activates token overrides) |
| Dot-grid background | -- | CSS-only (no DOM element, inherently accessible) |

### 9.5 Reduced Motion

All animations follow the global `prefers-reduced-motion` strategy:

- All `fadeUp`, `cardReveal`, and `scaleIn` animations resolve to final state immediately.
- CSS transitions reduced to opacity only (no transforms, no scale).
- Counter animations show final value immediately.
- Hover states retain color changes but remove `translateY(-2px)` on cards.

### 9.6 Keyboard Navigation

- All interactive elements (cards, buttons) are reachable via Tab.
- Cards activate on Enter or Space.
- Visible focus ring (2px `ring` (#365462), 2px offset) on all interactive elements.
- No focus traps on this page (no modals, no accordions).
- Tab order matches visual reading order.

---

## 10. Performance Budget

### 10.1 Core Web Vitals Targets

| Metric | Target | Notes |
|--------|--------|-------|
| LCP | < 2.5s | `<h1>` headline is the LCP element. SSG-rendered, no animation delay. |
| FID | < 100ms | Minimal JS on initial load. Framer Motion tree-shaken. |
| CLS | < 0.1 | No layout shifts. All section heights predictable. Font `display: swap` with matched fallbacks. |
| TTFB | < 200ms | SSG page served from CDN edge. |

### 10.2 Asset Budget

| Asset | Target | Notes |
|-------|--------|-------|
| HTML (gzipped) | < 15KB | Static page, no dynamic content. |
| CSS (gzipped) | < 20KB | Shared Tailwind bundle. |
| JS (gzipped) | < 45KB | Framer Motion (tree-shaken), header interactivity, counter animations. |
| Fonts | < 100KB total | Plus Jakarta Sans (700, 800), Inter (400, 500), JetBrains Mono (400). Preloaded via `next/font`. |
| Images | 0KB | No images on this page. All visuals are icons (inline SVG via Lucide). |
| Total page weight | < 180KB | |

### 10.3 Loading Strategy

| Element | Strategy |
|---------|----------|
| HTML + critical CSS | Inline, SSG, edge-cached |
| Fonts | `next/font/google` with `display: 'swap'` and system fallbacks |
| Framer Motion | Dynamic import, loads after first paint |
| Counter animations | Client-side only, triggered by intersection observer |
| Icons | Inline SVG via Lucide React (tree-shaken, no network requests) |

### 10.4 Lighthouse Targets

| Audit | Target |
|-------|--------|
| Performance | >= 95 |
| Accessibility | >= 100 |
| Best Practices | >= 95 |
| SEO | >= 100 |

---

## Appendix A: Complete Content Inventory

All content strings on this page, consolidated for copy review.

### Hero

- Eyebrow: "THE SAFETREKR PLATFORM"
- Headline: "Intelligence. Review. Documentation."
- Subheadline: "Every trip goes through the same rigorous process: government intelligence analysis, professional safety review, and tamper-evident documentation. Here is every capability that protects your travelers and your organization."
- CTA Primary: "Get a Demo"
- CTA Secondary: "See Sample Binder"

### 3-Act Mechanism Preview

- Section eyebrow: "HOW SAFETREKR WORKS"
- Section headline: "Three acts. One rigorous process."
- Card 1 title: "Intelligence"
- Card 1 description: "Government data from 5 sources -- NOAA, USGS, CDC, GDACS, and ReliefWeb -- scored by Monte Carlo simulation for every destination on your itinerary."
- Card 1 link: "Explore Risk Intelligence"
- Card 2 title: "Review"
- Card 2 description: "A trained safety analyst conducts a 17-section professional review covering every dimension of your trip -- venue, transportation, health, emergency planning, and more."
- Card 2 link: "See the Analyst Review"
- Card 3 title: "Documentation"
- Card 3 description: "Every finding, recommendation, and risk score compiled into a tamper-evident Trip Safety Binder with SHA-256 hash-chain integrity. Audit-ready from the moment it is delivered."
- Card 3 link: "See the Safety Binder"

### Feature Cards Grid

- Section eyebrow: "PLATFORM CAPABILITIES"
- Section headline: "Everything your organization needs to protect every trip."
- Card 1: "Analyst Safety Review" -- "Every trip plan is reviewed across 17 safety dimensions by a trained analyst. Venue, transportation, health, emergency contacts, and 13 more sections -- nothing is left to guesswork."
- Card 2: "Risk Intelligence Engine" -- "Government data from NOAA, USGS, CDC, GDACS, and ReliefWeb scored through Monte Carlo simulation. Probability-weighted risk assessments for every destination on your itinerary."
- Card 3: "Trip Safety Binder" -- "Every finding, risk score, and recommendation compiled into an audit-ready document. SHA-256 hash-chain ensures tamper-evident integrity from delivery through long-term archival."
- Card 4: "Mobile Field Operations" -- "Live participant tracking, geofence alerts, rally point navigation, muster check-ins, and SMS broadcast. Everything your chaperones need in their pocket during the trip."
- Card 5: "Real-Time Monitoring" -- "Geofence boundary alerts, muster check-in tracking, participant location visibility, and automated escalation paths. Know where your people are and when something changes."
- Card 6: "Compliance & Evidence" -- "Designed with FERPA, SOC 2, and GDPR requirements in mind. Tamper-evident audit trail, automated purge proofs, and compliance documentation that satisfies your legal and insurance teams."
- All card links: "Learn more"

### Trust Metrics Strip

- "5" / "GOVERNMENT INTEL SOURCES"
- "17" / "SAFETY REVIEW SECTIONS"
- "3-5" / "DAY TURNAROUND"
- "AES-256" / "ENCRYPTION STANDARD"
- "SHA-256" / "EVIDENCE CHAIN"
- Source labels: "NOAA", "USGS", "CDC", "GDACS", "ReliefWeb"

### CTA Band

- Headline: "Ready to see the platform in action?"
- Body: "Schedule a personalized walkthrough and we will show you exactly what a safety binder looks like for your organization."
- CTA Primary: "Get a Demo"
- CTA Secondary: "See Sample Binder"

---

## Appendix B: Component Dependency Map

```
PlatformOverviewPage
  |
  +-- SiteHeader (shared)
  |     +-- Logo
  |     +-- NavLink (Platform = active)
  |     +-- Button (Sign In, Get a Demo)
  |     +-- MobileSheet
  |
  +-- PlatformHero (custom)
  |     +-- Eyebrow
  |     +-- Button (primary, secondary)
  |
  +-- MechanismPreview (custom)
  |     +-- Eyebrow
  |     +-- MechanismCard (x3)
  |           +-- Lucide Icon (Route, ClipboardCheck, FileText)
  |
  +-- FeatureGrid
  |     +-- Eyebrow
  |     +-- FeatureCard (x6)
  |           +-- Lucide Icon (ClipboardCheck, Route, FileText, Smartphone, Activity, Shield)
  |
  +-- TrustMetricsStrip (shared)
  |     +-- StatCard (x5)
  |
  +-- CTABand (variant="dark")
  |     +-- Button (primary-on-dark, ghost/dark)
  |
  +-- SiteFooter (shared)
        +-- Logo (horizontal-light)
        +-- NavLink (footer columns)
```

---

## Appendix C: Cross-Link Map

All outbound links from this page and their destinations:

| Link Text | Destination | Location on Page |
|-----------|-------------|------------------|
| "Get a Demo" | `/demo` | Hero CTA, CTA Band |
| "See Sample Binder" | `/resources/sample-binders` | Hero CTA, CTA Band |
| "Explore Risk Intelligence" | `/platform/risk-intelligence` | Mechanism Card 1 |
| "See the Analyst Review" | `/platform/analyst-review` | Mechanism Card 2 |
| "See the Safety Binder" | `/platform/safety-binder` | Mechanism Card 3 |
| "Learn more" (Analyst Review) | `/platform/analyst-review` | Feature Card 1 |
| "Learn more" (Risk Intelligence) | `/platform/risk-intelligence` | Feature Card 2 |
| "Learn more" (Safety Binder) | `/platform/safety-binder` | Feature Card 3 |
| "Learn more" (Mobile) | `/platform/mobile-app` | Feature Card 4 |
| "Learn more" (Monitoring) | `/platform/monitoring` | Feature Card 5 |
| "Learn more" (Compliance) | `/platform/compliance` | Feature Card 6 |
| Header nav links | Various | Site Header |
| Footer nav links | Various | Site Footer |

**Inbound links to this page**:
- Primary nav "Platform" dropdown featured card ("Explore Platform")
- Homepage Feature Grid cards (implicit parent)
- Footer "Platform Overview" link
- Mobile nav "Platform Overview" link
- `/features` redirect (301)
- `/product` redirect (301)

---

## Appendix D: Implementation File Map

```
app/
  platform/
    page.tsx                         # /platform -- this page
    analyst-review/page.tsx          # /platform/analyst-review
    risk-intelligence/page.tsx       # /platform/risk-intelligence
    safety-binder/page.tsx           # /platform/safety-binder
    mobile-app/page.tsx              # /platform/mobile-app
    monitoring/page.tsx              # /platform/monitoring
    compliance/page.tsx              # /platform/compliance

components/
  layout/
    site-header.tsx                  # Shared
    site-footer.tsx                  # Shared
  marketing/
    mechanism-preview.tsx            # NEW -- 3-act card section
    feature-grid.tsx                 # Existing
    feature-card.tsx                 # Existing
    trust-metrics-strip.tsx          # Shared
    stat-card.tsx                    # Shared
    cta-band.tsx                     # Existing (variant="dark")
  ui/
    button.tsx                       # Existing
    badge.tsx                        # Existing
    eyebrow.tsx                      # Existing
```

**New component**: `MechanismPreview` (`components/marketing/mechanism-preview.tsx`). Encapsulates the 3-act numbered card layout with connectors. This is the only new component required for this page. All other components are reused from the existing library.
