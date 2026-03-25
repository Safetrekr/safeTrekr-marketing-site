# Homepage Mockup Specification: SafeTrekr Marketing Site

**Version**: 1.0
**Date**: 2026-03-24
**Page**: Homepage (`/`)
**Status**: Implementation-Ready High-Fidelity Specification
**Dependencies**: DESIGN-SYSTEM.md (canonical), INFORMATION-ARCHITECTURE.md (Section 3.1)
**Viewport Targets**: 1440px (desktop), 768px (tablet), 375px (mobile)

> This document specifies every pixel, token, component, content string, and interaction for the SafeTrekr homepage. Developers implement from this document. Designers validate against it. No interpretation is required.

---

## Table of Contents

1. [Page-Level Architecture](#1-page-level-architecture)
2. [Section 1: Site Header](#2-section-1-site-header)
3. [Section 2: Hero](#3-section-2-hero)
4. [Section 3: Trust Metrics Strip](#4-section-3-trust-metrics-strip)
5. [Section 4: Problem / Mechanism](#5-section-4-problem--mechanism)
6. [Section 5: How It Works Preview](#6-section-5-how-it-works-preview)
7. [Section 6: Feature Grid](#7-section-6-feature-grid)
8. [Section 7: Binder Showcase (Dark Section 1)](#8-section-7-binder-showcase-dark-section-1)
9. [Section 8: Segment Routing](#9-section-8-segment-routing)
10. [Section 9: Pricing Preview](#10-section-9-pricing-preview)
11. [Section 10: Category Contrast](#11-section-10-category-contrast)
12. [Section 11: Final CTA Banner (Dark Section 2)](#12-section-11-final-cta-banner-dark-section-2)
13. [Section 12: Site Footer](#13-section-12-site-footer)
14. [Page-Level Accessibility](#14-page-level-accessibility)
15. [Performance Budget](#15-performance-budget)

---

## 1. Page-Level Architecture

### 1.1 Section Rhythm and Surface Allocation

```
 Section                          Surface              Background Token          Dark?
 -----------------------------------------------------------------------------------------
 1.  Site Header                  Transparent/Glass     transparent -> bg/80      No
 2.  Hero                         Light                 background (#e7ecee)      No
 3.  Trust Metrics Strip          Card                  card (#f7f8f8)            No
 4.  Problem / Mechanism          Light                 background (#e7ecee)      No
 5.  How It Works Preview         Accent wash           primary-50 (#f1f9f4)      No
 6.  Feature Grid                 Light                 background (#e7ecee)      No
 7.  Binder Showcase              DARK SECTION 1        secondary (#123646)       YES
 8.  Segment Routing              Light                 background (#e7ecee)      No
 9.  Pricing Preview              Card                  card (#f7f8f8)            No
10.  Category Contrast            Light                 background (#e7ecee)      No
11.  Final CTA Banner             DARK SECTION 2        secondary (#123646)       YES
12.  Footer                       Dark (uncounted)      secondary (#123646)       Always
```

**Dark section count**: 2 (Binder Showcase + Final CTA). Footer excluded per design system rule. Sections 7 and 11 are separated by three light sections (8, 9, 10) -- adjacency rule satisfied. Dark section positions at approximately 55% and 90% of page depth -- within the 1/3 and 2/3 recommendation range.

### 1.2 Global Container

All content sections use the standard container pattern:

```
max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12
```

- `--container-max`: 1280px
- Side padding: 24px (mobile) / 32px (tablet) / 48px (desktop)
- At 1440px viewport: (1440 - 1280) / 2 = 80px side margins + 48px padding = 128px total per side
- At 1536px+: Growing white space frames content

### 1.3 Page-Level JSON-LD

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "SafeTrekr",
      "url": "https://safetrekr.com",
      "description": "Professional trip safety review and evidence documentation platform."
    },
    {
      "@type": "SoftwareApplication",
      "name": "SafeTrekr",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web"
    },
    {
      "@type": "AggregateOffer",
      "lowPrice": "450",
      "highPrice": "1250",
      "priceCurrency": "USD",
      "offerCount": "3"
    }
  ]
}
```

---

## 2. Section 1: Site Header

**Component**: `SiteHeader`
**File**: `components/layout/site-header.tsx`
**Position**: `sticky top-0 z-[var(--z-sticky)]` (z-index: 30)

### 2.1 Layout (1440px Desktop)

```
+--[Container: max-w-[1280px] mx-auto px-12]------------------------------------+
|                                                                                 |
|  [Logo 32px]    Platform v  Solutions v  How It Works  Pricing  Resources v     |
|                                                     [Sign In]  [ Get a Demo ]   |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

**Grid**: `flex items-center justify-between h-20` (80px height at top)

**Left zone**: Logo horizontal-dark, 32px height, `text-secondary` (#123646), link to `/` with `aria-label="SafeTrekr home"`.

**Center zone**: `nav` element with `aria-label="Main navigation"`. 5 links in `flex items-center gap-8`:
- "Platform" (with ChevronDown icon, triggers mega-menu)
- "Solutions" (with ChevronDown icon, triggers mega-menu)
- "How It Works" (link to `/how-it-works`)
- "Pricing" (link to `/pricing`)
- "Resources" (with ChevronDown icon, triggers dropdown)

Link style: `text-body-md font-medium text-foreground/70 hover:text-foreground transition-colors duration-fast`. Active: `text-foreground font-semibold` with 2px bottom border `primary-500`.

**Right zone**: `flex items-center gap-4`:
- "Sign In" -- `Button variant="ghost" size="sm"`, links to `https://app.safetrekr.com`, `target="_blank"`
- "Get a Demo" -- `Button variant="primary" size="default"`, links to `/demo`

### 2.2 Scroll Behavior

| State | Background | Border | Blur | Shadow | Height |
|-------|-----------|--------|------|--------|--------|
| At top (scrollY <= 100) | `transparent` | none | none | none | 80px (`h-20`) |
| Scrolled (scrollY > 100) | `background/80` (#e7ecee at 80% opacity) | `border-b border-border/50` | `backdrop-blur-xl` | `shadow-sm` | 64px (`h-16`) |

Transition: `transition-all duration-moderate ease-default` (300ms).

### 2.3 Layout (768px Tablet)

Same as desktop but with reduced `gap-6` between nav items. "Sign In" text link hidden; only "Get a Demo" button visible in right zone.

### 2.4 Layout (375px Mobile)

```
+--[px-6]--------------------------------------------+
|  [Logo 28px]                         [Hamburger]    |
+-----------------------------------------------------+
```

Height: 64px. Logo horizontal-dark at 28px. Hamburger icon (`Menu`, 24px) in right zone. Triggers `Sheet` component sliding from right. Sheet contains full navigation in accordion format with "Get a Demo" full-width button at bottom.

**Sheet accessibility**: `role="dialog"`, `aria-modal="true"`, `aria-label="Main navigation"`. Focus trapped. Escape closes. Backdrop `bg-foreground/50`.

### 2.5 Skip Navigation

First focusable element on page (hidden until focused):

```html
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-card focus:text-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-ring">
  Skip to main content
</a>
```

---

## 3. Section 2: Hero

**Component**: `HeroSection` (custom organism)
**Surface**: `background` (#e7ecee)
**Background treatment**: Faint dot-grid pattern at 3-4% opacity using `primary-300`, CSS `radial-gradient(circle, var(--color-primary-300) 1px, transparent 1px)` with `background-size: 24px 24px`. Subtle radial gradient from `background` to `primary-50` at 20% opacity centered behind composition, radius 600px.

### 3.1 Layout (1440px Desktop)

```
+--[Container: 1280px]-----------------------------------------------------------+
|  pt-24 (96px)                                                                   |
|                                                                                 |
|  +--[5 cols]------------------+--[gap-20]--+--[7 cols]--------------------+     |
|  |                            |            |                              |     |
|  |  TRIP SAFETY PLATFORM      |            |  +--[Map 560x400]--------+  |     |
|  |                            |            |  |                        |  |     |
|  |  Every trip               |            |  |  Desaturated map       |  |     |
|  |  professionally           |            |  |  Route line (primary)  |  |     |
|  |  reviewed.                |            |  |  3-4 waypoints         |  |     |
|  |                            |            |  |           +--[Review]--+  |     |
|  |  SafeTrekr combines        |            |  |           | Trip Review|  |     |
|  |  intelligence from 5       |            |  |           | Reviewed   |  |     |
|  |  government data sources,  |            |  +-----------+ 4 checks   |  |     |
|  |  17-section analyst review,|            |    +--[Gauge]+ progress   |  |     |
|  |  and SHA-256 evidence      |            |    | 85%     +--[Doc]-----+  |     |
|  |  documentation to protect  |            |    | Ready   | Evidence   |  |     |
|  |  your travelers and your   |            |    +---------+ Binder     |  |     |
|  |  organization.             |            |              | SHA hash   |  |     |
|  |                            |            |              +------------+  |     |
|  |  [See Sample Binder]       |            |                              |     |
|  |  [Schedule a Demo]         |            |                              |     |
|  |                            |            |                              |     |
|  +----------------------------+            +------------------------------+     |
|                                                                                 |
|  pb-32 (128px)                                                                  |
+---------------------------------------------------------------------------------+
```

**Grid**: `grid lg:grid-cols-12 gap-20 items-center`
**Text column**: `col-span-5`
**Visual column**: `col-span-7`
**Spacing**: `pt-24 pb-32` (96px top, 128px bottom) at desktop per hero spacing spec.

### 3.2 Text Column Content

| Element | Content | Styles |
|---------|---------|--------|
| Eyebrow | "TRIP SAFETY MANAGEMENT PLATFORM" | `.text-eyebrow text-primary-700` (13px, weight 600, tracking 0.08em, uppercase). Leading icon: ShieldPath custom icon, 16px, `text-primary-700`, `mr-2`. |
| Headline | "Every trip professionally reviewed." | `.text-display-xl text-foreground` = `clamp(2.5rem, 1.25rem + 3.47vw, 4.5rem)`, weight 800, line-height 1.05, tracking -0.025em, Plus Jakarta Sans. `max-w-[20ch]`. Renders as `<h1>`. |
| Subtext | "SafeTrekr combines intelligence from 5 government data sources, 17-section analyst review, and SHA-256 evidence documentation to protect your travelers and your organization." | `.text-body-lg text-muted-foreground` = `clamp(1.125rem, 1.04rem + 0.25vw, 1.25rem)`, weight 400, line-height 1.6, Inter. `max-w-[50ch] mt-6` (24px top margin). Color: `muted-foreground` (#4d5153). |
| CTA Primary | "See Sample Binder" | `Button variant="primary" size="lg"` = `h-13 px-8 text-lg font-semibold`, `bg-primary-600` (#3f885b), white text, `rounded-md` (8px). `mt-8` (32px top margin). Icon: `Download` (20px) right of text. |
| CTA Secondary | "Schedule a Demo" | `Button variant="secondary" size="lg"` = `h-13 px-8 text-lg font-semibold`, `transparent` bg, `text-foreground`, `border border-border`, `rounded-md`. `ml-4` (16px left of primary). Icon: `ArrowRight` (20px) right of text. |

**CTA row**: `flex flex-wrap gap-4 mt-8`

### 3.3 Product Composition (Visual Column)

**Container**: `relative` positioned within the 7-column span. All layers absolutely positioned relative to this container.

**Layer 1 -- Map Intelligence (Base)**:
- Size: 560x400px (desktop), `aspect-ratio: 14/10`
- Position: Left-aligned within visual column, `z-index: 0`
- Content: MapLibre GL JS tile layer, desaturated (15% saturation, 85% contrast via CSS `filter: saturate(0.15) contrast(0.85)`). Shows a sample geographic area (southeastern US or Central America) with terrain.
- Route line: Single curved SVG path, `stroke: primary-500` (#4ca46e), 3px stroke-width, round line-cap, direction arrows (small triangles at 25%, 50%, 75% along path)
- Waypoints: 3-4 circles, 12px diameter, `fill: primary-600` (#3f885b), each with 20px halo ring `fill: primary-100` (#e0f1e6) at 50% opacity
- Styling: `rounded-xl shadow-lg border border-border overflow-hidden`
- Loading: Lazy-loaded. Static fallback image renders first (SSG), then interactive map crossfades in on client hydration.
- Accessibility: `aria-hidden="true"` (decorative). Static fallback image has `alt="Map showing a trip route with safety waypoints"`.

**Layer 2 -- Trip Review Panel (Upper-right)**:
- Size: 280x320px
- Position: Overlaps map upper-right by 40px, `z-index: 10`, `top: -20px, right: -20px` relative to map
- Styling: `rounded-xl bg-white shadow-xl border border-border p-5`
- Content structure:
  ```
  +--[280x320 Review Panel]--+
  |  Trip Safety Review       |
  |  [Reviewed] badge         |
  |                           |
  |  [check] Venue Safety     |
  |  [check] Transportation   |
  |  [check] Emergency Plan   |
  |  [check] Health Advisory  |
  |                           |
  |  [====== 100% ======]     |
  |                           |
  |  [avatar] Analyst M.R.    |
  +---------------------------+
  ```
  - Title: "Trip Safety Review" in `.text-heading-sm text-foreground` (22px, weight 600)
  - Badge: `Badge variant="default"` -- `bg-primary-50 text-primary-800`, text "Reviewed"
  - Checklist: 4 items, each `flex items-center gap-2`. Check icon: `h-4 w-4 text-primary-500`. Text: `.text-body-sm text-foreground`
  - Progress bar: `h-2 rounded-full bg-primary-100`, fill `bg-primary-500 w-full`, transition from 0 to 100%
  - Analyst row: 32px circle avatar (generic, `bg-primary-200`), "Analyst M.R." in `.text-body-sm text-muted-foreground`

**Layer 3 -- Document Preview (Lower-right)**:
- Size: 240x180px
- Position: Below review panel with 20px gap, right-aligned, `z-index: 20`
- Component: `DocumentPreview`
- Styling: Three offset layers (stacked paper effect, offset 2px each). Front sheet: `bg-white rounded-lg shadow-lg border border-border p-4`
- Content:
  - Eyebrow: "EVIDENCE BINDER" in `.text-eyebrow text-muted-foreground` (12px)
  - Badge: `Badge variant="default"` text "Verified", small green dot
  - Timeline: 2 entries using `TimelineStep` (truncated)
    - Entry 1: "Risk assessment completed" -- `.text-body-xs text-foreground`
    - Entry 2: "Documentation finalized" -- `.text-body-xs text-foreground`
  - Hash: `a3f2...c891` in `.text-mono-sm text-muted-foreground` (JetBrains Mono, 12px)

**Layer 4 -- Readiness Indicator (Lower-left of map)**:
- Size: 120x120px
- Position: Overlaps map lower-left edge, `z-index: 15`, `bottom: -16px, left: 24px` relative to map
- Styling: `rounded-xl bg-white shadow-lg border border-border p-4`
- Content:
  - Circular SVG gauge: 72px diameter, `stroke: primary-500` (#4ca46e), 4px stroke-width, round line-cap, fill arc to ~85% (approximately 306 degrees). Background track: `stroke: primary-100` (#e0f1e6)
  - Center text: "85%" in `.text-heading-sm text-foreground font-semibold`
  - Label: "Trip Ready" in `.text-body-xs text-muted-foreground` below gauge
  - Status dot: `StatusDot state="active"` -- 8px `safety-green` (#22c55e) dot with single pulse animation on enter

### 3.4 Animation Sequence

| Time | Element | Animation Preset | Duration | Easing |
|------|---------|-----------------|----------|--------|
| 0ms | Eyebrow | `fadeIn` | 300ms | `ease-default` |
| 100ms | Headline | `fadeUp` (y: 30px to 0) | 500ms | `ease-spring` |
| 250ms | Subtext | `fadeUp` (y: 20px to 0) | 400ms | `ease-enter` |
| 400ms | CTA buttons | `fadeUp` (y: 20px to 0) | 300ms | `ease-enter` |
| 500ms | Map surface | `scaleIn` (scale 0.96 to 1) | 600ms | `ease-spring` |
| 700ms | Route line | `routeDraw` (pathLength 0 to 1) | 1200ms | `ease-default` |
| 900ms | Waypoint markers | `markerPop`, stagger 80ms | 300ms each | `ease-spring` |
| 800ms | Review panel | `fadeUp` + slide right | 500ms | `ease-spring` |
| 1000ms | Checklist items | `checklistReveal`, stagger 60ms | 200ms each | `ease-enter` |
| 1100ms | Document preview | `documentStack` (y: 16, rotateX: -5 to 0) | 500ms | `ease-spring` |
| 1200ms | Readiness gauge | `gaugeFill` (clockwise, 0 to 85%) | 1200ms | `ease-default` |
| 1400ms | Status dot | `statusPulse` (scale 0 to 1.4 to 1) | 600ms | `ease-spring` |

**Headline is visible immediately** -- no animation delay on the `<h1>`. The `fadeUp` at 100ms is acceptable because the text is rendered in the HTML (SSG) and visible before JS hydration. The animation is enhancement only.

**Reduced motion**: Under `prefers-reduced-motion: reduce`, all elements render at final state immediately. No transforms, no scale, no path drawing. Opacity transitions only if any.

### 3.5 Responsive Behavior

**768px (Tablet)**:
```
+--[Container: px-8]-------------------------------+
|  pt-20 (80px)                                     |
|                                                   |
|  TRIP SAFETY MANAGEMENT PLATFORM                  |
|                                                   |
|  Every trip                                       |
|  professionally reviewed.                         |
|                                                   |
|  SafeTrekr combines intelligence from             |
|  5 government data sources...                     |
|                                                   |
|  [See Sample Binder]  [Schedule a Demo]           |
|                                                   |
|  gap-12 (48px)                                    |
|                                                   |
|  +--[Full composition, scaled to fit width]----+  |
|  |  Map + Review + Doc + Gauge (all 4 layers)  |  |
|  +---------------------------------------------+  |
|                                                   |
|  pb-24 (96px)                                     |
+---------------------------------------------------+
```

- Layout: Stacked. `flex flex-col gap-12`. Text above, composition below.
- Headline: `clamp()` resolves to approximately 34px at 768px.
- Composition: All 4 layers present, proportionally scaled to fit container width (~720px usable). Layers maintain relative positioning.
- Spacing: `pt-20 pb-24`.

**375px (Mobile)**:
```
+--[px-6]-------------------------------+
|  pt-16 (64px)                          |
|                                        |
|  TRIP SAFETY PLATFORM                  |
|                                        |
|  Every trip                            |
|  professionally                        |
|  reviewed.                             |
|                                        |
|  SafeTrekr combines intelligence       |
|  from 5 government data sources...     |
|                                        |
|  [See Sample Binder] (full width)      |
|  [Schedule a Demo] (full width)        |
|                                        |
|  gap-8 (32px)                          |
|                                        |
|  +--[Map fragment + route only]-----+  |
|  |  Simplified: map tile with       |  |
|  |  route line and 2 waypoints.     |  |
|  |  No review panel, no document,   |  |
|  |  no gauge.                       |  |
|  +----------------------------------+  |
|                                        |
|  pb-20 (80px)                          |
+----------------------------------------+
```

- Layout: Stacked. `flex flex-col gap-8`.
- Headline: `clamp()` resolves to 40px at 375px. `max-w-[20ch]` wraps to 3 lines.
- CTAs: Stacked full-width. `flex flex-col gap-3`. Each button `w-full`.
- Composition: Simplified to Layer 1 only (map fragment + route line + 2 waypoints). Review panel, document preview, and readiness gauge hidden via `hidden md:block`.
- Map: `aspect-ratio: 16/10`, `rounded-xl`, full container width minus padding.
- Spacing: `pt-16 pb-20`.

### 3.6 Accessibility

- `<h1>` on headline (only h1 on page).
- Skip-nav target: `<main id="main-content">` wraps everything below header.
- Map composition: `aria-hidden="true"` (decorative). Static fallback has descriptive alt.
- CTA buttons: Descriptive text, no "Click here." "See Sample Binder" is self-explanatory.
- Focus order: Skip-nav -> Header nav -> Hero CTA Primary -> Hero CTA Secondary.
- All animation respects `prefers-reduced-motion`.

---

## 4. Section 3: Trust Metrics Strip

**Component**: `TrustMetricsStrip`
**File**: `components/marketing/trust-metrics-strip.tsx`
**Surface**: `card` (#f7f8f8)
**Border**: `border-y border-border` (top and bottom `#b8c3c7` 1px borders)

### 4.1 Layout (1440px Desktop)

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
|  +--------------------------------------------------------------- -----------+  |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### 4.2 Stat Cards Content

Each stat uses the `StatCard` component:

| Value | Label | Prefix/Suffix | Animate |
|-------|-------|---------------|---------|
| `5` | "GOVERNMENT INTEL SOURCES" | -- | Yes (count from 0) |
| `17` | "SAFETY REVIEW SECTIONS" | -- | Yes (count from 0) |
| `3-5` | "DAY TURNAROUND" | -- | No (string, fade in) |
| `AES-256` | "ENCRYPTION STANDARD" | -- | No (string, fade in) |
| `SHA-256` | "EVIDENCE CHAIN" | -- | No (string, fade in) |

**StatCard styles**:
- Value: `.text-display-md text-foreground` = `clamp(1.75rem, 1.04rem + 1.98vw, 2.75rem)`, weight 700, Plus Jakarta Sans. Numeric values use `font-mono` (JetBrains Mono) for `5` and `17`.
- Label: `.text-eyebrow text-muted-foreground mt-1 block` = 13px, weight 600, tracking 0.08em, uppercase, Plus Jakarta Sans, color `#4d5153`.
- Card: `bg-card rounded-xl border border-border p-6 text-center shadow-sm` -- but here rendered without individual card borders since the strip itself is the card surface. Minimal treatment: no individual card borders, just the value/label pairs centered in grid cells.

**Counter animation**: Numbers count from 0 to target over 1.5s when the strip enters viewport (20% intersection threshold). Respects `prefers-reduced-motion` (shows final value immediately). Screen readers receive final value via `aria-label`.

### 4.3 Government Source Row

Below the stat cards, separated by `mt-8` (32px):

```html
<div class="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 mt-8">
  <!-- Text labels for each source, styled as subdued references -->
  <span class="text-body-xs text-muted-foreground tracking-wide">NOAA</span>
  <span class="text-body-xs text-muted-foreground tracking-wide">USGS</span>
  <span class="text-body-xs text-muted-foreground tracking-wide">CDC</span>
  <span class="text-body-xs text-muted-foreground tracking-wide">GDACS</span>
  <span class="text-body-xs text-muted-foreground tracking-wide">ReliefWeb</span>
</div>
```

Style: `text-body-xs` (12px), `text-muted-foreground` (#4d5153), `tracking-wide` (0.05em), uppercase. Separated by vertical pipe dividers (`border-l border-border h-3 mx-2` between items) or generous horizontal gaps.

**Note**: No fabricated logos. Text names only until real partnership/attribution agreements secured.

### 4.4 Responsive Behavior

**768px (Tablet)**:
- Grid: `grid-cols-3`. First row: 3 metrics. Second row: 2 metrics centered. `gap-6`.
- Government source row: wraps to 2 lines if needed.
- Section padding: `py-10` (40px).

**375px (Mobile)**:
- Grid: `grid-cols-2`. Three rows of 2, last row has 1 centered item. `gap-4`.
- Government source row: stacks to 2-3 lines.
- Section padding: `py-8` (32px).

### 4.5 Animation

Entire strip fades in together: `fadeIn` preset (opacity 0 to 1, 200ms, `ease-default`). Triggered at 20% viewport intersection. Stat counter animations begin after fade completes.

### 4.6 Accessibility

- `StatCard` animated counters: `aria-label` on each card provides the full value immediately (e.g., `aria-label="5 government intelligence sources"`).
- Government sources: text content, screen-reader accessible.
- Section landmark: `<section aria-label="Platform credentials">`.

---

## 5. Section 4: Problem / Mechanism

**Surface**: `background` (#e7ecee)
**Spacing**: `py-24 lg:py-32` (standard section padding per breakpoint scale)

### 5.1 Layout (1440px Desktop)

```
+--[Container: 1280px]-----------------------------------------------------------+
|  py-32 (128px)                                                                  |
|                                                                                 |
|  +--[Section header: text-center max-w-3xl mx-auto]-------------------------+  |
|  |                                                                           |  |
|  |  THE PROBLEM                                                              |  |
|  |                                                                           |  |
|  |  Trip safety today runs on                                                |  |
|  |  spreadsheets and hope.                                                   |  |
|  |                                                                           |  |
|  |  Most organizations manage travel safety with shared documents,           |  |
|  |  PDF checklists, and the assumption that nothing will go wrong.           |  |
|  |  When something does, there is no evidence of preparation --              |  |
|  |  only good intentions.                                                    |  |
|  |                                                                           |  |
|  +--------------------------------------------------------------- -----------+  |
|                                                                                 |
|  gap-12 (48px)                                                                  |
|                                                                                 |
|  +--[Transition statement: text-center]--------------+                          |
|  |  SafeTrekr replaces guesswork with evidence.      |                          |
|  +---------------------------------------------------+                          |
|                                                                                 |
|  gap-12 (48px)                                                                  |
|                                                                                 |
|  +--[grid grid-cols-3 gap-8]---------------------------------------------+     |
|  |                                                                        |     |
|  |  +--[Mechanism Card 1]--+  +--[Mechanism Card 2]--+  +--[Card 3]---+  |     |
|  |  |  [Review motif icon] |  |  [Route motif icon]  |  |  [Record]   |  |     |
|  |  |                      |  |                       |  |             |  |     |
|  |  |  Professional        |  |  Government           |  |  Tamper-    |  |     |
|  |  |  Analyst Review      |  |  Intelligence         |  |  Evident    |  |     |
|  |  |                      |  |  Scoring              |  |  Evidence   |  |     |
|  |  |  A trained safety    |  |                       |  |             |  |     |
|  |  |  analyst reviews     |  |  Real-time data from  |  |  Every      |  |     |
|  |  |  every trip across   |  |  5 government sources |  |  review,    |  |     |
|  |  |  17 dimensions.      |  |  scored by Monte      |  |  every      |  |     |
|  |  |                      |  |  Carlo simulation.    |  |  decision   |  |     |
|  |  +----------------------+  +-----------------------+  |  documented.|  |     |
|  |                                                        +-------------+  |     |
|  +------------------------------------------------------------------------+     |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### 5.2 Section Header Content

| Element | Content | Style |
|---------|---------|-------|
| Eyebrow | "THE PROBLEM" | `.text-eyebrow text-primary-700` (13px, 600 weight, uppercase, tracking 0.08em). No icon. |
| Headline | "Trip safety today runs on spreadsheets and hope." | `.text-display-md text-foreground text-center` = `clamp(1.75rem, 1.04rem + 1.98vw, 2.75rem)`, weight 700, line-height 1.15. Renders as `<h2>`. `max-w-[28ch] mx-auto`. |
| Body | "Most organizations manage travel safety with shared documents, PDF checklists, and the assumption that nothing will go wrong. When something does, there is no evidence of preparation -- only good intentions." | `.text-body-lg text-muted-foreground text-center max-w-prose mx-auto mt-4` = 20px, weight 400, line-height 1.6, Inter, `#4d5153`. |

### 5.3 Transition Statement

| Element | Content | Style |
|---------|---------|-------|
| Text | "SafeTrekr replaces guesswork with evidence." | `.text-heading-lg text-foreground text-center font-semibold mt-12` = `clamp(1.5rem, 0.97rem + 1.49vw, 2.25rem)`, weight 700, Plus Jakarta Sans. Not a heading element -- rendered as `<p>` with strong visual weight. |

### 5.4 Mechanism Pillar Cards

Three cards in `grid grid-cols-1 md:grid-cols-3 gap-8 mt-12`:

**Card 1: Professional Analyst Review**
- Component: `FeatureCard` with `motifType="review"`
- Icon: `MotifBadge motif="review"` -- AnalystReview icon in `primary-500` circle
- Title: "Professional Analyst Review" (`.text-heading-sm text-foreground`, `<h3>`)
- Description: "A trained safety analyst reviews every trip your organization takes -- across 17 dimensions, from venue safety to emergency evacuation. They flag what needs attention and document what is ready." (`.text-body-md text-muted-foreground max-w-[45ch]`)
- Link: "Learn about the review" with `ArrowRight` icon -> `/platform/analyst-review`

**Card 2: Government Intelligence Scoring**
- Component: `FeatureCard` with `motifType="route"`
- Icon: `MotifBadge motif="route"` -- RouteIntelligence icon in `primary-500` circle
- Title: "Government Intelligence Scoring"
- Description: "Real-time safety data from NOAA, USGS, CDC, GDACS, and ReliefWeb -- the same sources emergency managers use. Risk scored by Monte Carlo simulation so you do not have to guess."
- Link: "See the intelligence engine" -> `/platform/risk-intelligence`

**Card 3: Tamper-Evident Documentation**
- Component: `FeatureCard` with `motifType="record"`
- Icon: `MotifBadge motif="record"` -- EvidenceBinder icon in `foreground`
- Title: "Tamper-Evident Documentation"
- Description: "Every review finding, every data source, every decision documented with SHA-256 hash-chain integrity. When someone asks what you did to prepare -- you hand them the binder."
- Link: "Explore the safety binder" -> `/platform/safety-binder`

**Card styling**: `bg-card rounded-xl border border-border p-6 sm:p-8 shadow-card`. Hover: `shadow-card-hover translateY(-2px) transition duration-normal`.

### 5.5 Responsive Behavior

**768px (Tablet)**: Cards grid becomes `grid-cols-1 md:grid-cols-3 gap-6`. At exactly 768px the 3-col grid begins -- each card ~220px wide. Alternatively, if too tight, `md:grid-cols-1 lg:grid-cols-3` with full-width stacked cards at tablet and 3-col at 1024px+.

**375px (Mobile)**: Single column. Cards full-width, stacked with `gap-4`. Section padding `py-12` (48px).

### 5.6 Animation

- Section header: `fadeUp` staggered at 80ms (eyebrow, headline, body).
- Transition statement: `fadeUp` after header.
- Cards: `staggerContainer + cardReveal` at 80ms stagger.
- Trigger: 20% viewport intersection.

### 5.7 Accessibility

- Section: `<section aria-labelledby="problem-mechanism-heading">`.
- `<h2 id="problem-mechanism-heading">` on the headline.
- Cards: Each title is `<h3>`. Card links wrap the entire card as a single interactive target using the `group` pattern.

---

## 6. Section 5: How It Works Preview

**Component**: `ProcessTimeline`
**File**: `components/marketing/process-timeline.tsx`
**Surface**: `primary-50` (#f1f9f4) -- light accent wash
**Spacing**: `py-24 lg:py-32`

### 6.1 Layout (1440px Desktop)

```
+--[Full width: bg-primary-50]----------------------------------------------------+
|  py-32 (128px)                                                                   |
|                                                                                  |
|  +--[Container: 1280px]------------------------------------------------------+  |
|  |                                                                            |  |
|  |  HOW IT WORKS                                                              |  |
|  |                                                                            |  |
|  |  From submission to safety binder                                          |  |
|  |  in 3-5 days.                                                              |  |
|  |                                                                            |  |
|  |  gap-16 (64px)                                                             |  |
|  |                                                                            |  |
|  |  +--[grid grid-cols-3 gap-8]-------------------------------------------+  |  |
|  |  |                                                                      |  |  |
|  |  |  +--[Step 1]------+  +--[Step 2]------+  +--[Step 3]------+         |  |  |
|  |  |  |                |  |                |  |                |         |  |  |
|  |  |  |  (1)           |  |  (2)           |  |  (3)           |         |  |  |
|  |  |  |  ------>       |  |  ------>       |  |                |         |  |  |
|  |  |  |                |  |                |  |                |         |  |  |
|  |  |  |  Submit Your   |  |  Analyst       |  |  Receive Your  |         |  |  |
|  |  |  |  Trip          |  |  Reviews       |  |  Safety Binder |         |  |  |
|  |  |  |                |  |  Everything    |  |                |         |  |  |
|  |  |  |  Enter your    |  |                |  |  Audit-ready   |         |  |  |
|  |  |  |  destination,  |  |  A professional|  |  documentation |         |  |  |
|  |  |  |  dates, and    |  |  analyst       |  |  with every    |         |  |  |
|  |  |  |  trip details. |  |  evaluates     |  |  finding and   |         |  |  |
|  |  |  |  Takes 15      |  |  17 safety     |  |  recommendation|         |  |  |
|  |  |  |  minutes.      |  |  dimensions    |  |  documented.   |         |  |  |
|  |  |  |                |  |  using govt    |  |                |         |  |  |
|  |  |  +----------------+  |  intelligence. |  +----------------+         |  |  |
|  |  |                      +----------------+                             |  |  |
|  |  +------------------------------------------------------------------+  |  |
|  |                                                                            |  |
|  |  [See the full process ->]                                                 |  |
|  |                                                                            |  |
|  +---------------------------------------------------------------- ----------+  |
|                                                                                  |
+-----------------------------------------------------------------------------------+
```

### 6.2 Section Header

| Element | Content | Style |
|---------|---------|-------|
| Eyebrow | "HOW IT WORKS" | `.text-eyebrow text-primary-700`, centered |
| Headline | "From submission to safety binder in 3-5 days." | `.text-display-md text-foreground text-center max-w-[28ch] mx-auto` = `<h2>` |

### 6.3 Timeline Steps

Three steps in `grid lg:grid-cols-3 gap-8`:

**Step 1: Submit Your Trip**
- Number circle: `h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-heading-sm font-semibold` -- displays "1"
- Connector: Horizontal line from circle right edge to next step, `h-0.5 bg-primary-200` (hidden on mobile)
- Title: "Submit Your Trip" -- `.text-heading-md text-foreground mt-4` (`<h3>`)
- Description: "Enter your destination, dates, participants, and trip details. Takes 15 minutes. No training required." -- `.text-body-md text-muted-foreground mt-2 max-w-[45ch]`

**Step 2: Analyst Reviews Everything**
- Number: "2", same circle style
- Title: "Analyst Reviews Everything"
- Description: "A professional safety analyst evaluates 17 safety dimensions using real-time intelligence from 5 government data sources. Risk scored by Monte Carlo simulation."

**Step 3: Receive Your Safety Binder**
- Number: "3", same circle style (no trailing connector)
- Title: "Receive Your Safety Binder"
- Description: "Audit-ready documentation with every finding, every recommendation, and every risk score. Tamper-evident integrity via SHA-256 hash chain."

### 6.4 Link to Full Page

Below the timeline grid, centered, `mt-8`:

"See the full process" -- `Button variant="link" size="default"` with `ArrowRight` icon. Links to `/how-it-works`. Style: `.text-body-md font-medium text-primary-700 hover:underline`.

### 6.5 Responsive Behavior

**768px (Tablet)**: `grid-cols-1 lg:grid-cols-3`. At tablet, steps stack vertically with `TimelineStep` component (vertical connectors). `gap-6`.

**375px (Mobile)**: Vertical timeline. Each step: flex row with timeline indicator column (circle + vertical connector line) and content column. `gap-4`. Full-width within container.

### 6.6 Animation

- Section header: `fadeUp` stagger 80ms.
- Timeline steps: `staggerContainer` with steps entering top-to-bottom at 120ms stagger.
- Horizontal connectors: Draw animation (200ms) after corresponding step enters.
- Trigger: 20% viewport intersection.

### 6.7 Accessibility

- `<section aria-labelledby="how-it-works-heading">`
- `<h2 id="how-it-works-heading">`
- Each step title: `<h3>`
- Timeline connectors: `aria-hidden="true"` (decorative)

---

## 7. Section 6: Feature Grid

**Component**: `FeatureGrid`
**File**: `components/marketing/feature-grid.tsx`
**Surface**: `background` (#e7ecee)
**Spacing**: `py-24 lg:py-32`

### 7.1 Layout (1440px Desktop)

```
+--[Container: 1280px]-----------------------------------------------------------+
|  py-32 (128px)                                                                  |
|                                                                                 |
|  PLATFORM CAPABILITIES                                                          |
|                                                                                 |
|  Everything you need to protect                                                 |
|  every trip.                                                                    |
|                                                                                 |
|  gap-12 (48px)                                                                  |
|                                                                                 |
|  +--[grid grid-cols-3 gap-6]-----------------------------------------------+   |
|  |                                                                          |   |
|  |  +--[FeatureCard]------+  +--[FeatureCard]------+  +--[FeatureCard]--+   |   |
|  |  |  [ClipboardCheck]   |  |  [Route]            |  |  [FileText]     |   |   |
|  |  |  Analyst Safety     |  |  Risk Intelligence  |  |  Trip Safety    |   |   |
|  |  |  Review             |  |  Engine             |  |  Binder         |   |   |
|  |  |                     |  |                     |  |                 |   |   |
|  |  |  17-section review  |  |  Monte Carlo risk   |  |  Audit-ready    |   |   |
|  |  |  of every trip by   |  |  scoring from 5     |  |  documentation  |   |   |
|  |  |  a professional     |  |  government data    |  |  with tamper-   |   |   |
|  |  |  analyst.           |  |  sources.           |  |  evident chain. |   |   |
|  |  |                     |  |                     |  |                 |   |   |
|  |  |  Learn more ->      |  |  Learn more ->      |  |  Learn more ->  |   |   |
|  |  +---------------------+  +---------------------+  +-----------------+   |   |
|  |                                                                          |   |
|  |  +--[FeatureCard]------+  +--[FeatureCard]------+  +--[FeatureCard]--+   |   |
|  |  |  [Smartphone]       |  |  [Activity]         |  |  [Shield]       |   |   |
|  |  |  Mobile Field       |  |  Real-Time          |  |  Compliance &   |   |   |
|  |  |  Operations         |  |  Monitoring         |  |  Evidence       |   |   |
|  |  |  ...                |  |  ...                |  |  ...            |   |   |
|  |  +---------------------+  +---------------------+  +-----------------+   |   |
|  |                                                                          |   |
|  +--------------------------------------------------------------------------+   |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### 7.2 Section Header

| Element | Content | Style |
|---------|---------|-------|
| Eyebrow | "PLATFORM CAPABILITIES" | `.text-eyebrow text-primary-700`, left-aligned on desktop, centered on mobile |
| Headline | "Everything you need to protect every trip." | `.text-display-md text-foreground max-w-[28ch]` = `<h2>` |

### 7.3 Feature Cards (6 Total)

Grid: `grid sm:grid-cols-2 lg:grid-cols-3 gap-6`

| # | Icon | Title | Description | Link |
|---|------|-------|-------------|------|
| 1 | `ClipboardCheck` (Lucide) | "Analyst Safety Review" | "17-section professional review of every trip plan by a trained safety analyst. Venues, transport, health, and emergency preparedness -- all evaluated." | `/platform/analyst-review` |
| 2 | `Route` (Lucide) | "Risk Intelligence Engine" | "Monte Carlo risk scoring from NOAA, USGS, CDC, GDACS, and ReliefWeb. Probability-weighted risk bands, not binary pass/fail." | `/platform/risk-intelligence` |
| 3 | `FileText` (Lucide) | "Trip Safety Binder" | "Audit-ready documentation delivered in 3-5 days. Every finding, recommendation, and risk score preserved with SHA-256 hash-chain integrity." | `/platform/safety-binder` |
| 4 | `Smartphone` (Lucide) | "Mobile Field Operations" | "Live trip tracking, geofenced rally points, muster check-ins, and SMS broadcast. Everything your chaperones need in their pocket." | `/platform/mobile-app` |
| 5 | `Activity` (Lucide) | "Real-Time Monitoring" | "Geofence alerts, participant location visibility, and muster check-in status. Know where your travelers are at all times." | `/platform/monitoring` |
| 6 | `Shield` (Lucide) | "Compliance and Evidence" | "AES-256 encryption, tamper-evident audit trails, and documentation designed for FERPA, SOC 2, and GDPR requirements." | `/platform/compliance` |

**Per-card structure** (FeatureCard component):
1. Icon container: `h-12 w-12 rounded-lg bg-primary-50` (#f1f9f4), icon `h-6 w-6 text-primary-700` (#33704b)
2. Title: `.text-heading-sm text-foreground mb-2` (22px, 600 weight) -- `<h3>`
3. Description: `.text-body-md text-muted-foreground max-w-[45ch]` (16px, 400 weight, `#4d5153`)
4. Link: `.text-body-sm font-medium text-primary-700` with `ArrowRight` icon (translates 4px right on parent hover)

Card: `bg-card rounded-xl border border-border p-6 sm:p-8 shadow-card`. Hover: `shadow-card-hover translateY(-2px) duration-normal`.

### 7.4 Responsive Behavior

**768px (Tablet)**: `grid-cols-2 gap-6`. 3 rows of 2 cards.

**375px (Mobile)**: `grid-cols-1 gap-4`. 6 stacked cards, full-width.

### 7.5 Animation

Cards: `staggerContainer + cardReveal` at 80ms stagger. Trigger: 20% viewport.

### 7.6 Accessibility

- `<section aria-labelledby="feature-grid-heading">`
- Each card: `<h3>` on title. Entire card is a single interactive link target (group pattern).
- Icons: `aria-hidden="true"` (decorative, title provides context).

---

## 8. Section 7: Binder Showcase (Dark Section 1)

**Component**: `DarkAuthoritySection` wrapping custom binder showcase content
**Surface**: `secondary` (#123646) with `[data-theme="dark"]`
**Position**: Dark Section 1 of 2 (approximately 55% through page)
**Spacing**: `py-24 lg:py-32`

### 8.1 Layout (1440px Desktop)

```
+--[Full width: bg-secondary data-theme="dark"]----------------------------------+
|  py-32 (128px)                                                                  |
|                                                                                 |
|  +--[Container: 1280px]-----------------------------------------------------+  |
|  |                                                                           |  |
|  |  +--[grid grid-cols-12 gap-16 items-center]---------------------------+  |  |
|  |  |                                                                     |  |  |
|  |  |  +--[col-span-5: Text]----------+  +--[col-span-7: Visual]------+  |  |  |
|  |  |  |                              |  |                             |  |  |  |
|  |  |  |  THE SAFETY BINDER           |  |  +--[Fanned binder pages]-+ |  |  |  |
|  |  |  |                              |  |  |                        | |  |  |  |
|  |  |  |  See exactly what a          |  |  |  [Page 1: Cover]       | |  |  |  |
|  |  |  |  reviewed trip               |  |  |    [Page 2: Risk]      | |  |  |  |
|  |  |  |  looks like.                 |  |  |      [Page 3: Review]  | |  |  |  |
|  |  |  |                              |  |  |        [Page 4: Emerg] | |  |  |  |
|  |  |  |  Every trip reviewed by      |  |  |          [Page 5: Doc] | |  |  |  |
|  |  |  |  SafeTrekr produces a        |  |  |                        | |  |  |  |
|  |  |  |  complete safety binder.     |  |  +------------------------+ |  |  |  |
|  |  |  |  The binder documents        |  |                             |  |  |  |
|  |  |  |  every analyst finding,      |  +-----------------------------+  |  |  |
|  |  |  |  every risk assessment,      |                                   |  |  |
|  |  |  |  every emergency contact     |                                   |  |  |
|  |  |  |  -- with tamper-evident      |                                   |  |  |
|  |  |  |  integrity.                  |                                   |  |  |
|  |  |  |                              |                                   |  |  |
|  |  |  |  [Download Sample Binder]    |                                   |  |  |
|  |  |  |  [See What's Inside]         |                                   |  |  |
|  |  |  |                              |                                   |  |  |
|  |  |  +------------------------------+                                   |  |  |
|  |  |                                                                     |  |  |
|  |  +---------------------------------------------------------------------+  |  |
|  |                                                                           |  |
|  +--------------------------------------------------------------- -----------+  |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### 8.2 Text Column Content (Dark Theme Tokens)

| Element | Content | Style |
|---------|---------|-------|
| Eyebrow | "THE SAFETY BINDER" | `.text-eyebrow` with `text-[var(--color-dark-accent)]` (#6cbc8b, primary-400), 13px, weight 600, uppercase, tracking 0.08em |
| Headline | "See exactly what a reviewed trip looks like." | `.text-display-md` with `text-[var(--color-dark-text-primary)]` (#f7f8f8), weight 700. `<h2>`. `max-w-[28ch]`. Contrast: 11.6:1 on `secondary`. |
| Body | "Every trip reviewed by SafeTrekr produces a complete safety binder. The binder documents every analyst finding, every risk assessment, every emergency contact -- with tamper-evident integrity. If a board member, insurer, or attorney asks what you did to prepare, you hand them this." | `.text-body-lg` with `text-[var(--color-dark-text-secondary)]` (#b8c3c7), weight 400, line-height 1.6. `max-w-prose mt-6`. Contrast: 7.0:1 on `secondary`. |
| CTA Primary | "Download a Sample Binder" | `Button variant="primary-on-dark" size="lg"` = white bg, `secondary` text, `h-13 px-8`. Icon: `Download` (20px). `mt-8`. |
| CTA Secondary | "See What's Inside" | `Button variant="ghost"` adapted for dark -- `text-[var(--color-dark-text-primary)] border border-[var(--color-dark-border)] hover:bg-[var(--color-dark-surface)]"`. Icon: `ArrowRight`. Links to `/how-it-works#safety-binder`. |

CTA row: `flex flex-wrap gap-4 mt-8`

### 8.3 Visual Column -- Binder Page Fan

The visual is a fanned arrangement of 5 binder page thumbnails, each rotated slightly to create a spread effect:

**Container**: `relative h-[400px]` in the 7-column span

**5 page cards**, each approximately 200x280px, `bg-white rounded-lg shadow-xl`:

| Page | Rotation | Offset (from center) | Content Preview |
|------|----------|---------------------|-----------------|
| Page 1 (back) | `-8deg` | `left: 0` | Cover page: "SafeTrekr Safety Binder" title, organization name, trip date |
| Page 2 | `-4deg` | `left: 40px` | Risk score summary: color-coded risk bands, P5/P50/P95 labels |
| Page 3 (center) | `0deg` | `left: 80px` | Review findings: 4 checklist items with green checks |
| Page 4 | `4deg` | `left: 120px` | Emergency contacts: hospital icon, phone numbers |
| Page 5 (front) | `8deg` | `left: 160px` | Evidence documentation: SHA-256 hash, timestamp |

Each page:
- `rounded-lg bg-white border border-border/20 shadow-xl p-4`
- Content is stylized/abbreviated (not full-size document text)
- Uses `.text-body-xs` and `.text-mono-sm` for mock document content
- Positioned with `absolute` within the relative container
- Stacking order: Page 5 on top (z-index: 5), Page 1 on bottom (z-index: 1)

### 8.4 Responsive Behavior

**768px (Tablet)**:
- Stacked layout: Text above, visual below. `flex flex-col gap-12`.
- Binder fan: Scaled to fit container width (~704px usable). 5 pages maintained but tighter offsets.

**375px (Mobile)**:
- Stacked. Text above, simplified visual below.
- Binder fan: 3 visible pages only (pages 1, 3, 5), smaller cards (~160x220px), tighter rotation (-5deg, 0, +5deg).
- Section padding: `py-16` (64px).

### 8.5 Animation

- Entire dark section: `fadeIn` (background fades first).
- Text column: `fadeUp` stagger 80ms after background.
- Binder pages: `documentStack` variant, staggered 100ms from back to front. Each page rotates from `rotateX(-5deg)` to final rotation and slides up from `y: 20px`.
- Trigger: 20% viewport intersection.

### 8.6 Accessibility

- `<section aria-labelledby="binder-showcase-heading">` with `data-theme="dark"`.
- `<h2 id="binder-showcase-heading">`
- Binder fan: `aria-hidden="true"` (decorative composition). Descriptive content is in the text column.
- "Download a Sample Binder" button: Screen reader sees full text. Links to `/resources/sample-binders` (gated download).

---

## 9. Section 8: Segment Routing

**Surface**: `background` (#e7ecee)
**Spacing**: `py-24 lg:py-32`

### 9.1 Layout (1440px Desktop)

```
+--[Container: 1280px]-----------------------------------------------------------+
|  py-32 (128px)                                                                  |
|                                                                                 |
|  BUILT FOR YOUR ORGANIZATION                                                    |
|                                                                                 |
|  Built for organizations that take                                              |
|  travel safety seriously.                                                       |
|                                                                                 |
|  gap-12 (48px)                                                                  |
|                                                                                 |
|  +--[grid grid-cols-4 gap-6]-----------------------------------------------+   |
|  |                                                                          |   |
|  |  +--[IndustryCard]--+  +--[IndustryCard]--+  +--[IndustryCard]--+       |   |
|  |  |  [School icon]   |  |  [University]    |  |  [Church icon]   |       |   |
|  |  |                  |  |                  |  |                  |       |   |
|  |  |  K-12 Schools    |  |  Higher          |  |  Churches &      |       |   |
|  |  |  & Districts     |  |  Education       |  |  Mission Orgs    |       |   |
|  |  |                  |  |                  |  |                  |       |   |
|  |  |  FERPA-ready     |  |  Study abroad,   |  |  Mission trip    |       |   |
|  |  |  field trip      |  |  Clery Act, and  |  |  safety with     |       |   |
|  |  |  safety reviews  |  |  international   |  |  youth and       |       |   |
|  |  |  from $15/       |  |  program safety. |  |  volunteer       |       |   |
|  |  |  student.        |  |                  |  |  protections.    |       |   |
|  |  |                  |  |                  |  |                  |       |   |
|  |  |  Learn more ->   |  |  Learn more ->   |  |  Learn more ->   |       |   |
|  |  +------------------+  +------------------+  +------------------+       |   |
|  |                                                                          |   |
|  |  +--[IndustryCard]--+                                                    |   |
|  |  |  [Building icon] |                                                    |   |
|  |  |  Corporate &     |                                                    |   |
|  |  |  Sports Teams    |                                                    |   |
|  |  |  ...             |                                                    |   |
|  |  +------------------+                                                    |   |
|  +--------------------------------------------------------------------------+   |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### 9.2 Section Header

| Element | Content | Style |
|---------|---------|-------|
| Eyebrow | "BUILT FOR YOUR ORGANIZATION" | `.text-eyebrow text-primary-700`, centered |
| Headline | "Built for organizations that take travel safety seriously." | `.text-display-md text-foreground text-center max-w-[28ch] mx-auto` = `<h2>` |

### 9.3 Segment Cards (4 Total)

Grid: `grid sm:grid-cols-2 lg:grid-cols-4 gap-6`

**Card 1: K-12 Schools and Districts**
- Component: `IndustryCard`
- Icon: `GraduationCap` (Lucide), 32px, `text-primary-700`
- Title: "K-12 Schools and Districts"
- Description: "FERPA-ready field trip safety reviews. Professional analyst evaluation of every destination, from $15 per student. Board-ready documentation that proves due diligence."
- Link: `/solutions/k12`

**Card 2: Higher Education**
- Icon: `University` / `Building2` (Lucide), 32px, `text-primary-700`
- Title: "Higher Education"
- Description: "Study abroad, Clery Act, and international program safety. Institutional-grade risk assessment with evidence documentation for general counsel and risk management."
- Link: `/solutions/higher-education`

**Card 3: Churches and Mission Organizations**
- Icon: `Church` / `Heart` (Lucide), 32px, `text-primary-700`
- Title: "Churches and Mission Organizations"
- Description: "Mission trip safety with volunteer screening documentation and youth protection. Stewardship-framed preparation that satisfies insurance requirements."
- Link: `/solutions/churches`

**Card 4: Corporate and Sports Teams**
- Icon: `Building` (Lucide), 32px, `text-primary-700`
- Title: "Corporate and Sports Teams"
- Description: "Duty of care compliance for business travel and team transportation. Professional safety analysis for mid-market organizations without enterprise budgets."
- Link: `/solutions/corporate`

**Card styling**: `IndustryCard` -- entire card is `<a>` with `group` class. `bg-card rounded-xl border border-border p-6 shadow-card`. Hover: `shadow-card-hover`, title transitions to `text-primary-700`.

### 9.4 Responsive Behavior

**768px (Tablet)**: `grid-cols-2 gap-6`. 2x2 grid.

**375px (Mobile)**: `grid-cols-1 gap-4`. 4 stacked cards.

### 9.5 Animation

Cards: `staggerContainer + cardReveal` at 80ms stagger. Trigger: 20% viewport.

### 9.6 Accessibility

- `<section aria-labelledby="segment-routing-heading">`
- Each card: Entire card is a link. Title rendered as `<h3>`. `aria-label` on each card link includes the full segment name and action (e.g., "Learn more about K-12 Schools and Districts solutions").

---

## 10. Section 9: Pricing Preview

**Surface**: `card` (#f7f8f8)
**Spacing**: `py-24 lg:py-32`
**Border**: `border-y border-border` (top and bottom)

### 10.1 Layout (1440px Desktop)

```
+--[Full width: bg-card border-y border-border]----------------------------------+
|  py-32 (128px)                                                                  |
|                                                                                 |
|  +--[Container: 1280px]-----------------------------------------------------+  |
|  |                                                                           |  |
|  |  PRICING                                                                  |  |
|  |                                                                           |  |
|  |  Professional trip safety                                                 |  |
|  |  starting at $15 per participant.                                         |  |
|  |                                                                           |  |
|  |  The average trip-related legal settlement: $500K-$2M.                    |  |
|  |  SafeTrekr: $15 per student.                                              |  |
|  |                                                                           |  |
|  |  gap-12 (48px)                                                            |  |
|  |                                                                           |  |
|  |  +--[grid grid-cols-3 gap-8]------------------------------------------+  |  |
|  |  |                                                                     |  |  |
|  |  |  +--[PricingTier]----+  +--[PricingTier]----+  +--[PricingTier]+   |  |  |
|  |  |  |                   |  |  MOST POPULAR      |  |               |   |  |  |
|  |  |  |  Field Trip       |  |                    |  |  International|   |  |  |
|  |  |  |                   |  |  Extended Trip     |  |               |   |  |  |
|  |  |  |  $450             |  |                    |  |  $1,250       |   |  |  |
|  |  |  |  per trip         |  |  $750              |  |  per trip     |   |  |  |
|  |  |  |                   |  |  per trip          |  |               |   |  |  |
|  |  |  |  ~$15/student     |  |                    |  |  ~$42/person  |   |  |  |
|  |  |  |  (30-person group)|  |  ~$19/student      |  |  (30-person)  |   |  |  |
|  |  |  |                   |  |  (40-person group) |  |               |   |  |  |
|  |  |  |  [features...]    |  |                    |  |  [features.] |   |  |  |
|  |  |  |                   |  |  [features...]     |  |               |   |  |  |
|  |  |  |  [Get a Demo]     |  |                    |  |  [Get a Demo]|   |  |  |
|  |  |  |                   |  |  [Get a Demo]      |  |               |   |  |  |
|  |  |  +-------------------+  +--------------------+  +---------------+   |  |  |
|  |  |                                                                     |  |  |
|  |  +---------------------------------------------------------------------+  |  |
|  |                                                                           |  |
|  |  [View full pricing and volume discounts ->]                              |  |
|  |                                                                           |  |
|  +--------------------------------------------------------------- -----------+  |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### 10.2 Section Header

| Element | Content | Style |
|---------|---------|-------|
| Eyebrow | "PRICING" | `.text-eyebrow text-primary-700`, centered |
| Headline | "Professional trip safety starting at $15 per participant." | `.text-display-md text-foreground text-center max-w-[28ch] mx-auto` = `<h2>` |
| Liability anchor | "The average trip-related legal settlement: $500K-$2M. SafeTrekr: $15 per student." | `.text-body-lg text-muted-foreground text-center max-w-prose mx-auto mt-4`. The "$500K-$2M" and "$15" are in `text-foreground font-semibold` for emphasis. |

### 10.3 Pricing Tier Cards

Grid: `grid md:grid-cols-3 gap-8 mt-12`

**Tier 1: Field Trip** (PricingTier component)
- Name: "Field Trip"
- Price: `$450`
- Unit: "per trip"
- Per-trip label: "~$15/student for a 30-person group"
- Features (abbreviated for preview, with Check icons in `primary-500`):
  - "17-section analyst review"
  - "5 government intelligence sources"
  - "Complete safety binder"
  - "Mobile field operations"
  - "3-5 day turnaround"
- CTA: "Get a Demo" -- `Button variant="primary" size="lg" className="mt-8 w-full"` -> `/demo`
- Featured: No
- Styling: `bg-card rounded-2xl border-2 border-border p-8 shadow-lg`

**Tier 2: Extended Trip** (Featured)
- Name: "Extended Trip"
- Badge: `Badge variant="default"` "Most Popular"
- Price: `$750`
- Unit: "per trip"
- Per-trip label: "~$19/student for a 40-person group"
- Features:
  - "Everything in Field Trip"
  - "Multi-day trip support"
  - "Extended monitoring period"
  - "Sports travel coverage"
  - "Priority analyst assignment"
- CTA: "Get a Demo" -> `/demo`
- Featured: Yes -- `border-primary-500 shadow-xl scale(1.05)` on desktop (static, not hover)
- Styling: Featured card with `border-2 border-primary-500`

**Tier 3: International**
- Name: "International"
- Price: `$1,250`
- Unit: "per trip"
- Per-trip label: "~$42/participant for a 30-person group"
- Features:
  - "Everything in Extended Trip"
  - "International intelligence coverage"
  - "Embassy and consulate contacts"
  - "Cross-border risk assessment"
  - "Evacuation planning documentation"
- CTA: "Get a Demo" -> `/demo`
- Featured: No

**Card styling** (PricingTier):
- Plan name: `.text-heading-md text-foreground` (28px, weight 600)
- Price: `.text-display-md text-foreground` (44px desktop) + unit `.text-body-sm text-muted-foreground`
- Per-trip: `.text-body-sm text-muted-foreground mt-2`
- Feature list: `space-y-3 mt-6`. Each: `flex items-start gap-2`. Check icon: `h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0`. Text: `.text-body-sm text-foreground`.

**Important**: No animation on pricing cards. Stability and readability are paramount.

### 10.4 Link to Full Pricing

Centered below the grid, `mt-8`:

"View full pricing and volume discounts" -- `Button variant="link"` with `ArrowRight`. Links to `/pricing`.

### 10.5 Responsive Behavior

**768px (Tablet)**: `grid-cols-1 md:grid-cols-3`. At 768px, 3-col grid begins but cards are narrower. Featured card: no `scale(1.05)` at tablet (static, normal size). Alternative: `md:grid-cols-2 lg:grid-cols-3` with featured card spanning full width on first row at tablet.

Recommended: `grid-cols-1 md:grid-cols-3 gap-6`. At 768px, cards are ~213px each -- tight but workable with `p-6` instead of `p-8`.

**375px (Mobile)**: `grid-cols-1 gap-6`. Stacked full-width. Featured card appears first (reordered via `order-first`). No scale effect.

### 10.6 Accessibility

- `<section aria-labelledby="pricing-preview-heading">`
- Price values: `aria-label="Four hundred fifty dollars per trip, approximately fifteen dollars per student for a thirty-person group"` (full context).
- Feature list: Standard list markup. Check icons: `aria-hidden="true"`.
- No animation.

---

## 11. Section 10: Category Contrast

**Surface**: `background` (#e7ecee)
**Spacing**: `py-24 lg:py-32`

### 11.1 Layout (1440px Desktop)

```
+--[Container: 1280px]-----------------------------------------------------------+
|  py-32 (128px)                                                                  |
|                                                                                 |
|  NOT ANOTHER TRAVEL APP                                                         |
|                                                                                 |
|  This is not travel insurance.                                                  |
|  This is not trip logistics.                                                    |
|  This is professional safety analysis.                                          |
|                                                                                 |
|  gap-12 (48px)                                                                  |
|                                                                                 |
|  +--[Comparison Table]------------------------------------------------------+  |
|  |                                                                           |  |
|  |  Feature                 DIY          Travel      Travel      SafeTrekr   |  |
|  |                       Spreadsheets    Apps      Insurance                  |  |
|  |  -----------------------------------------------------------------------  |  |
|  |  Professional safety                                                      |  |
|  |  analyst review            --           --          --         [check]     |  |
|  |                                                                           |  |
|  |  Government                                                               |  |
|  |  intelligence data         --           --          --         [check]     |  |
|  |                                                                           |  |
|  |  Monte Carlo risk                                                         |  |
|  |  scoring                   --           --          --         [check]     |  |
|  |                                                                           |  |
|  |  Tamper-evident                                                           |  |
|  |  documentation             --           --          --         [check]     |  |
|  |                                                                           |  |
|  |  Audit-ready                                                              |  |
|  |  evidence binder           --           --          --         [check]     |  |
|  |                                                                           |  |
|  |  Real-time trip                                                           |  |
|  |  monitoring                --         [check]       --         [check]     |  |
|  |                                                                           |  |
|  |  Legal/insurance                                                          |  |
|  |  documentation             --           --        partial      [check]     |  |
|  |                                                                           |  |
|  +--------------------------------------------------------------- -----------+  |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### 11.2 Section Header

| Element | Content | Style |
|---------|---------|-------|
| Eyebrow | "NOT ANOTHER TRAVEL APP" | `.text-eyebrow text-primary-700`, centered |
| Headline | "This is not travel insurance. This is not trip logistics. This is professional safety analysis." | `.text-display-md text-foreground text-center max-w-[28ch] mx-auto` = `<h2>`. Each sentence on its own visual line (use `<br class="hidden sm:block">` for desktop line breaks). |
| Body | "SafeTrekr creates a category that did not exist before: professional safety analysis with evidence documentation. Here is how it compares to what organizations typically use." | `.text-body-lg text-muted-foreground text-center max-w-prose mx-auto mt-4` |

### 11.3 Comparison Table

Custom table component, not a `<table>` element (for responsive flexibility). Uses a card-based layout.

**Desktop**: Styled grid resembling a table. `bg-card rounded-xl border border-border overflow-hidden shadow-card`.

**Columns**: 5 columns
1. Feature name (wider, ~30% width)
2. "DIY Spreadsheets" (column header)
3. "Travel Apps" (column header)
4. "Travel Insurance" (column header)
5. "SafeTrekr" (column header, highlighted with `bg-primary-50` column)

**Column headers row**: `bg-card border-b border-border py-4 px-6`
- Feature: empty
- Others: `.text-body-sm font-semibold text-foreground text-center`
- SafeTrekr column header: `.text-body-sm font-semibold text-primary-700 text-center` with subtle `bg-primary-50` column highlight

**Comparison rows**:

| Feature | DIY Spreadsheets | Travel Apps | Travel Insurance | SafeTrekr |
|---------|:---:|:---:|:---:|:---:|
| Professional safety analyst review | -- | -- | -- | check |
| Government intelligence data | -- | -- | -- | check |
| Monte Carlo risk scoring | -- | -- | -- | check |
| Tamper-evident documentation | -- | -- | -- | check |
| Audit-ready evidence binder | -- | -- | -- | check |
| Real-time trip monitoring | -- | check | -- | check |
| Legal and insurance documentation | -- | -- | partial | check |
| Mobile field operations | -- | partial | -- | check |

**Cell rendering**:
- Check: `Check` icon, `h-5 w-5 text-primary-500` in SafeTrekr column; `h-5 w-5 text-foreground/40` in other columns
- Dash (not available): `Minus` icon, `h-4 w-4 text-border` (very subtle, indicates absence)
- "partial": text "Partial" in `.text-body-xs text-muted-foreground`
- Row: `border-b border-border py-4 px-6`. Alternating: every other row `bg-background/50` for subtle striping.
- Feature name: `.text-body-sm font-medium text-foreground`

**SafeTrekr column**: Entire column has `bg-primary-50` (#f1f9f4) background to visually highlight that SafeTrekr checks every box.

### 11.4 Responsive Behavior

**768px (Tablet)**: Table scrolls horizontally with `overflow-x-auto`. Sticky first column (feature name). Or: collapse into a card-per-feature layout where each feature is a card showing 4 comparison items.

**375px (Mobile)**: Transform into a list of feature cards. Each card shows the feature name as the title and 4 horizontal badges showing availability per competitor:
```
+--[Feature Card]----------------------------------+
|  Professional safety analyst review              |
|                                                  |
|  [-- DIY]  [-- Apps]  [-- Insurance]  [v Safe]   |
+--------------------------------------------------+
```
Each badge: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-body-xs`. SafeTrekr badge: `bg-primary-50 text-primary-700`. Others with dash: `bg-muted text-muted-foreground`.

### 11.5 Animation

- Section header: `fadeUp` stagger 80ms.
- Table/cards: `fadeIn` (entire table fades in as one unit), 300ms, triggered at 20% viewport.
- No row-by-row animation (readability priority for comparison content).

### 11.6 Accessibility

- `<section aria-labelledby="category-contrast-heading">`
- If using `<table>`: proper `<thead>`, `<th scope="col">`, `<th scope="row">` on feature names, `<caption>` describing the table.
- Check icons: `aria-label="Available"`. Dash icons: `aria-label="Not available"`. "Partial": reads as text.
- Mobile card layout: Each card is a `<div>` with screen-reader-friendly structure.

---

## 12. Section 11: Final CTA Banner (Dark Section 2)

**Component**: `CTABand variant="dark"`
**File**: `components/marketing/cta-band.tsx`
**Surface**: `secondary` (#123646) with `[data-theme="dark"]`
**Position**: Dark Section 2 of 2 (approximately 90% through page, just before footer)
**Spacing**: `py-20 lg:py-28`

### 12.1 Layout (1440px Desktop)

```
+--[Full width: bg-secondary data-theme="dark"]----------------------------------+
|  py-28 (112px)                                                                  |
|                                                                                 |
|  +--[Container: 1280px, text-center]------------------------------------+       |
|  |                                                                       |       |
|  |  Ready to protect your next trip?                                     |       |
|  |                                                                       |       |
|  |  Every trip goes well until one does not.                             |       |
|  |  The binder is for that day.                                          |       |
|  |                                                                       |       |
|  |  [Get a Demo]  [See a Sample Binder]                                  |       |
|  |                                                                       |       |
|  +-----------------------------------------------------------------------+       |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### 12.2 Content

| Element | Content | Style |
|---------|---------|-------|
| Headline | "Ready to protect your next trip?" | `.text-display-md` with `text-[var(--color-dark-text-primary)]` (#f7f8f8), weight 700, centered. `<h2>`. `max-w-[28ch] mx-auto`. Contrast: 11.6:1 on `secondary`. |
| Body | "Every trip goes well until one does not. The binder is for that day." | `.text-body-lg` with `text-[var(--color-dark-text-secondary)]` (#b8c3c7), weight 400, centered. `max-w-prose mx-auto mt-4`. Contrast: 7.0:1 on `secondary`. |
| CTA Primary | "Get a Demo" | `Button variant="primary-on-dark" size="lg"` = white bg, `secondary` text (#123646), `h-13 px-8 font-semibold`. Links to `/demo`. |
| CTA Secondary | "See a Sample Binder" | `Button variant="ghost"` adapted for dark. `text-[var(--color-dark-text-primary)] border border-[var(--color-dark-border)]`. Links to `/resources/sample-binders`. |

CTA row: `flex flex-wrap justify-center gap-4 mt-8`. Buttons horizontal on desktop.

### 12.3 Responsive Behavior

**768px (Tablet)**: Same layout. CTAs may wrap if viewport is tight -- `flex-wrap` handles this.

**375px (Mobile)**: CTAs stack full-width. `flex flex-col gap-3`. Each button `w-full`. Section padding: `py-16` (64px).

### 12.4 Animation

- `fadeUp` stagger: Headline (0ms), body (80ms), CTA buttons (160ms).
- Trigger: 20% viewport intersection.

### 12.5 Accessibility

- `<section aria-labelledby="final-cta-heading">` with `data-theme="dark"`.
- `<h2 id="final-cta-heading">`
- CTA buttons: Descriptive text, clear destinations.

---

## 13. Section 12: Site Footer

**Component**: `SiteFooter`
**File**: `components/layout/site-footer.tsx`
**Surface**: `secondary` (#123646) -- always dark, not counted toward 2-dark-section limit
**Note**: Adjacent to Final CTA (also dark). This is acceptable per design system -- footer is always dark and never counted.

### 13.1 Layout (1440px Desktop)

```
+--[Full width: bg-secondary]----------------------------------------------------+
|  pt-16 pb-8                                                                     |
|                                                                                 |
|  +--[Container: 1280px]-----------------------------------------------------+  |
|  |                                                                           |  |
|  |  +--[grid grid-cols-5 gap-12]----+                                        |  |
|  |  |                                |                                        |  |
|  |  |  [Logo light 32px]            |  PLATFORM        SOLUTIONS             |  |
|  |  |                                |  Platform Oview  K-12 Schools          |  |
|  |  |  Professional trip safety     |  Analyst Review  Higher Education      |  |
|  |  |  review and evidence          |  Risk Intell.   Churches & Mission     |  |
|  |  |  documentation for            |  Safety Binder  Corporate & Sports     |  |
|  |  |  organizations that           |  Mobile App                            |  |
|  |  |  protect travelers.           |  Monitoring      HOW IT WORKS          |  |
|  |  |                                |  Compliance      How It Works          |  |
|  |  |  col-span-2                   |                                        |  |
|  |  |                                |  RESOURCES       COMPANY               |  |
|  |  +--------------------------------+  Case Studies   About SafeTrekr        |  |
|  |                                      Guides         Our Analysts           |  |
|  |                                      Sample Binders Security & Trust       |  |
|  |                                      FAQ            Partners               |  |
|  |                                      Blog           Contact                |  |
|  |                                                                           |  |
|  +--------------------------------------------------------------- -----------+  |
|                                                                                 |
|  +--[border-t border-dark-border]-----------------------------------------+     |
|  |  pt-8                                                                   |     |
|  |                                                                         |     |
|  |  [Logo mark]  [LinkedIn]  [Twitter/X]                                   |     |
|  |                                                                         |     |
|  |  (c) 2026 SafeTrekr, Inc. All rights reserved.                          |     |
|  |  Terms of Service  |  Privacy Policy  |  DPA                            |     |
|  |                                                                         |     |
|  |  Data sourced from: NOAA | USGS | CDC | GDACS | ReliefWeb               |     |
|  |                                                                         |     |
|  +-------------------------------------------------------------------------+     |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### 13.2 Zone 1: Brand Column

- Logo: `Logo variant="horizontal-light" height={32}` -- white horizontal lockup, 32px height
- Description: "Professional trip safety review and evidence documentation for organizations that protect travelers." -- `.text-body-sm` with `text-[var(--color-dark-text-secondary)]` (#b8c3c7), `max-w-[35ch] mt-4`
- Column span: `col-span-2` in the 5-column grid

### 13.3 Zone 2: Link Columns (3 Columns)

Each column uses a heading and link list.

**Column heading**: `.text-body-sm font-semibold text-[var(--color-dark-text-primary)]` (#f7f8f8), uppercase, `tracking-wide`, `mb-4`.

**Link style**: `.text-body-sm text-[var(--color-dark-text-secondary)] hover:text-white transition-colors duration-fast`. Each link is a block-level `<a>` with `py-1` for touch spacing.

**Column A: Platform**
- Platform Overview -> `/platform`
- Analyst Review -> `/platform/analyst-review`
- Risk Intelligence -> `/platform/risk-intelligence`
- Safety Binder -> `/platform/safety-binder`
- Mobile App -> `/platform/mobile-app`
- Monitoring -> `/platform/monitoring`
- Compliance -> `/platform/compliance`

**Column B: Solutions / How It Works**
- **SOLUTIONS** (sub-heading)
- K-12 Schools -> `/solutions/k12`
- Higher Education -> `/solutions/higher-education`
- Churches and Mission Orgs -> `/solutions/churches`
- Corporate and Sports -> `/solutions/corporate`
- (gap)
- **HOW IT WORKS** (sub-heading)
- How It Works -> `/how-it-works`
- Pricing -> `/pricing`

**Column C: Resources / Company**
- **RESOURCES** (sub-heading)
- Case Studies -> `/resources/case-studies`
- Guides -> `/resources/guides`
- Sample Binders -> `/resources/sample-binders`
- FAQ -> `/resources/faq`
- Blog -> `/blog`
- (gap)
- **COMPANY** (sub-heading)
- About SafeTrekr -> `/about`
- Our Analysts -> `/about/analysts`
- Security and Trust -> `/security`
- Contact -> `/contact`

### 13.4 Zone 3: Bottom Bar

Separated by `border-t border-[var(--color-dark-border)]` (rgba(255,255,255,0.12)). `pt-8`.

**Row 1**: Social icons. `flex items-center gap-4`.
- LinkedIn: `Linkedin` icon (simple-icons), 20px, `text-[var(--color-dark-text-secondary)] hover:text-white`
- Twitter/X: `Twitter` icon, same style

**Row 2**: Copyright and legal. `flex flex-wrap items-center gap-x-4 gap-y-2 mt-4`.
- Copyright: "(c) 2026 SafeTrekr, Inc. All rights reserved." -- `.text-body-xs text-[var(--color-dark-text-secondary)]`
- Pipe separator: `|` character
- Legal links: "Terms of Service" -> `/legal/terms`, "Privacy Policy" -> `/legal/privacy`, "DPA" -> `/legal/dpa` -- same `.text-body-xs` style with hover to white

**Row 3**: Data source attribution. `mt-4`.
- "Data sourced from: NOAA | USGS | CDC | GDACS | ReliefWeb" -- `.text-body-xs text-[var(--color-dark-text-secondary)]`

### 13.5 Responsive Behavior

**768px (Tablet)**: Logo column left (full width as row 1). Link columns: `grid-cols-3 gap-8` as row 2. Bottom bar: stacked.

**375px (Mobile)**: Everything stacks. Logo column full-width. Link columns: `grid-cols-2 gap-6` (Platform + Solutions in col 1, Resources + Company in col 2). Bottom bar: centered text, stacked lines. `px-6 py-12`.

### 13.6 Accessibility

- `<footer>` with `<nav aria-label="Footer navigation">`.
- Each link column: `<section>` with `<h3>` heading (visually styled as small caps, semantically a heading).
- Social links: `aria-label="SafeTrekr on LinkedIn"`, `aria-label="SafeTrekr on Twitter"`.
- Legal links: Standard `<a>` elements.

---

## 14. Page-Level Accessibility

### 14.1 Landmark Structure

```html
<body>
  <a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>
  <header> <!-- SiteHeader --> </header>
  <main id="main-content">
    <section aria-labelledby="hero-heading"> <!-- Hero --> </section>
    <section aria-label="Platform credentials"> <!-- Trust Strip --> </section>
    <section aria-labelledby="problem-mechanism-heading"> <!-- Problem/Mechanism --> </section>
    <section aria-labelledby="how-it-works-heading"> <!-- How It Works --> </section>
    <section aria-labelledby="feature-grid-heading"> <!-- Feature Grid --> </section>
    <section aria-labelledby="binder-showcase-heading"> <!-- Binder Showcase --> </section>
    <section aria-labelledby="segment-routing-heading"> <!-- Segment Routing --> </section>
    <section aria-labelledby="pricing-preview-heading"> <!-- Pricing Preview --> </section>
    <section aria-labelledby="category-contrast-heading"> <!-- Category Contrast --> </section>
    <section aria-labelledby="final-cta-heading"> <!-- Final CTA --> </section>
  </main>
  <footer> <!-- SiteFooter --> </footer>
</body>
```

### 14.2 Heading Hierarchy

| Level | Content | Section |
|-------|---------|---------|
| `<h1>` | "Every trip professionally reviewed." | Hero |
| `<h2>` | "Trip safety today runs on spreadsheets and hope." | Problem/Mechanism |
| `<h3>` | "Professional Analyst Review" | Problem/Mechanism card |
| `<h3>` | "Government Intelligence Scoring" | Problem/Mechanism card |
| `<h3>` | "Tamper-Evident Documentation" | Problem/Mechanism card |
| `<h2>` | "From submission to safety binder in 3-5 days." | How It Works |
| `<h3>` | "Submit Your Trip" | How It Works step |
| `<h3>` | "Analyst Reviews Everything" | How It Works step |
| `<h3>` | "Receive Your Safety Binder" | How It Works step |
| `<h2>` | "Everything you need to protect every trip." | Feature Grid |
| `<h3>` | "Analyst Safety Review" | Feature Grid card |
| `<h3>` | "Risk Intelligence Engine" | Feature Grid card |
| `<h3>` | "Trip Safety Binder" | Feature Grid card |
| `<h3>` | "Mobile Field Operations" | Feature Grid card |
| `<h3>` | "Real-Time Monitoring" | Feature Grid card |
| `<h3>` | "Compliance and Evidence" | Feature Grid card |
| `<h2>` | "See exactly what a reviewed trip looks like." | Binder Showcase |
| `<h2>` | "Built for organizations that take travel safety seriously." | Segment Routing |
| `<h3>` | "K-12 Schools and Districts" | Segment card |
| `<h3>` | "Higher Education" | Segment card |
| `<h3>` | "Churches and Mission Organizations" | Segment card |
| `<h3>` | "Corporate and Sports Teams" | Segment card |
| `<h2>` | "This is not travel insurance..." | Category Contrast |
| `<h2>` | "Ready to protect your next trip?" | Final CTA |

Single `<h1>`. Seven `<h2>` headings (one per major section). Logical nesting of `<h3>` within sections. No skipped levels.

### 14.3 Focus Order

Linear top-to-bottom, matching visual order:
1. Skip-nav link
2. Header logo
3. Header nav links (Platform, Solutions, How It Works, Pricing, Resources)
4. Header CTAs (Sign In, Get a Demo)
5. Hero CTA Primary (See Sample Binder)
6. Hero CTA Secondary (Schedule a Demo)
7. Mechanism cards (3 links)
8. How It Works link (See the full process)
9. Feature Grid cards (6 links)
10. Binder Showcase CTAs (Download, See What's Inside)
11. Segment cards (4 links)
12. Pricing tier CTAs (3 Get a Demo buttons)
13. Pricing link (View full pricing)
14. Final CTA (Get a Demo, See a Sample Binder)
15. Footer links

### 14.4 Color Contrast Compliance

All text/background combinations used on this page:

| Text | Background | Ratio | WCAG AA |
|------|-----------|-------|---------|
| `foreground` (#061a23) | `background` (#e7ecee) | 13.2:1 | PASS |
| `foreground` (#061a23) | `card` (#f7f8f8) | 14.8:1 | PASS |
| `muted-foreground` (#4d5153) | `background` (#e7ecee) | 5.2:1 | PASS |
| `muted-foreground` (#4d5153) | `card` (#f7f8f8) | 5.8:1 | PASS |
| `primary-700` (#33704b) | `background` (#e7ecee) | 6.1:1 | PASS |
| `white` (#ffffff) | `primary-600` (#3f885b) | 4.6:1 | PASS |
| `dark-text-primary` (#f7f8f8) | `secondary` (#123646) | 11.6:1 | PASS |
| `dark-text-secondary` (#b8c3c7) | `secondary` (#123646) | 7.0:1 | PASS |
| `dark-accent` (#6cbc8b) | `secondary` (#123646) | 4.8:1 | PASS |
| `foreground` (#061a23) | `primary-50` (#f1f9f4) | 14.2:1 | PASS |

### 14.5 Reduced Motion

Under `prefers-reduced-motion: reduce`:
- All Framer Motion animations render at final state immediately.
- No transforms (translateY, scale, rotateX).
- No SVG path drawing (route line, gauge fill shown completed).
- No counter animations (stat values show final number).
- CSS transitions reduced to opacity only.
- Hover states retain color changes but remove transforms (no `translateY(-2px)` on cards).

### 14.6 Screen Reader Flow

Screen reader users experience:
1. Skip-nav announcement
2. Header navigation with clear link text
3. `<h1>` -- "Every trip professionally reviewed." establishes page topic
4. Hero subtext provides full context
5. Trust strip values announced with full `aria-label` (e.g., "5 government intelligence sources")
6. Clear `<h2>` progression through each section
7. Card links have descriptive text (title serves as link text)
8. Pricing values have full spoken context via `aria-label`
9. Comparison table (if `<table>`) has proper headers and scope
10. Footer navigation is labeled and structured

---

## 15. Performance Budget

### 15.1 LCP Strategy

**LCP candidate**: Hero `<h1>` text ("Every trip professionally reviewed.")

**Optimization**:
- Headline is SSG-rendered in HTML (no client-side rendering dependency).
- Plus Jakarta Sans weight 800 loaded via `next/font/google` with `display: 'swap'` -- system font fallback renders immediately, web font swaps in.
- No animation delay on headline (visible at 0ms).
- Map composition is lazy-loaded and not the LCP element.

**Target**: LCP < 1.5s on simulated 3G.

### 15.2 CLS Strategy

- All images and composition panels have explicit `width` and `height` attributes or `aspect-ratio` CSS.
- Header height transition (80px to 64px on scroll) handled with `transform` not layout shift.
- No dynamic content injection above the fold.
- Font loading uses `display: swap` with matched fallback metrics to minimize layout shift.

**Target**: CLS < 0.05.

### 15.3 Bundle Strategy

- MapLibre GL JS: Lazy-loaded via dynamic import, only after hero text is rendered and visible.
- Framer Motion: Tree-shaken, only imported animation presets used on this page.
- Hero composition panels: CSS-based where possible (stacked paper, gauge arc). SVG for route line.
- Static fallback for map: Rendered as `<img>` in SSG HTML; MapLibre replaces it after hydration with crossfade.

**Target**: Initial JS bundle < 150KB gzipped. Total page weight < 500KB.

### 15.4 Image Strategy

- No raster images in the hero composition (all CSS/SVG).
- Map tiles: Vector tiles loaded on demand, cached aggressively.
- Binder showcase pages: CSS-rendered cards with text content, not image thumbnails.
- No stock photography anywhere on the page.

---

## Appendix A: Complete Content Inventory

Every real content string used on this page, section by section, for copy review.

### Hero
- Eyebrow: "TRIP SAFETY MANAGEMENT PLATFORM"
- Headline: "Every trip professionally reviewed."
- Subtext: "SafeTrekr combines intelligence from 5 government data sources, 17-section analyst review, and SHA-256 evidence documentation to protect your travelers and your organization."
- CTA 1: "See Sample Binder"
- CTA 2: "Schedule a Demo"

### Trust Strip
- Stat 1: "5" / "GOVERNMENT INTEL SOURCES"
- Stat 2: "17" / "SAFETY REVIEW SECTIONS"
- Stat 3: "3-5" / "DAY TURNAROUND"
- Stat 4: "AES-256" / "ENCRYPTION STANDARD"
- Stat 5: "SHA-256" / "EVIDENCE CHAIN"
- Source attribution: "NOAA | USGS | CDC | GDACS | ReliefWeb"

### Problem / Mechanism
- Eyebrow: "THE PROBLEM"
- Headline: "Trip safety today runs on spreadsheets and hope."
- Body: "Most organizations manage travel safety with shared documents, PDF checklists, and the assumption that nothing will go wrong. When something does, there is no evidence of preparation -- only good intentions."
- Transition: "SafeTrekr replaces guesswork with evidence."
- Card 1 Title: "Professional Analyst Review"
- Card 1 Body: "A trained safety analyst reviews every trip your organization takes -- across 17 dimensions, from venue safety to emergency evacuation. They flag what needs attention and document what is ready."
- Card 1 Link: "Learn about the review"
- Card 2 Title: "Government Intelligence Scoring"
- Card 2 Body: "Real-time safety data from NOAA, USGS, CDC, GDACS, and ReliefWeb -- the same sources emergency managers use. Risk scored by Monte Carlo simulation so you do not have to guess."
- Card 2 Link: "See the intelligence engine"
- Card 3 Title: "Tamper-Evident Documentation"
- Card 3 Body: "Every review finding, every data source, every decision documented with SHA-256 hash-chain integrity. When someone asks what you did to prepare -- you hand them the binder."
- Card 3 Link: "Explore the safety binder"

### How It Works
- Eyebrow: "HOW IT WORKS"
- Headline: "From submission to safety binder in 3-5 days."
- Step 1 Title: "Submit Your Trip"
- Step 1 Body: "Enter your destination, dates, participants, and trip details. Takes 15 minutes. No training required."
- Step 2 Title: "Analyst Reviews Everything"
- Step 2 Body: "A professional safety analyst evaluates 17 safety dimensions using real-time intelligence from 5 government data sources. Risk scored by Monte Carlo simulation."
- Step 3 Title: "Receive Your Safety Binder"
- Step 3 Body: "Audit-ready documentation with every finding, every recommendation, and every risk score. Tamper-evident integrity via SHA-256 hash chain."
- Link: "See the full process"

### Feature Grid
- Eyebrow: "PLATFORM CAPABILITIES"
- Headline: "Everything you need to protect every trip."
- Card 1: "Analyst Safety Review" / "17-section professional review of every trip plan by a trained safety analyst. Venues, transport, health, and emergency preparedness -- all evaluated."
- Card 2: "Risk Intelligence Engine" / "Monte Carlo risk scoring from NOAA, USGS, CDC, GDACS, and ReliefWeb. Probability-weighted risk bands, not binary pass/fail."
- Card 3: "Trip Safety Binder" / "Audit-ready documentation delivered in 3-5 days. Every finding, recommendation, and risk score preserved with SHA-256 hash-chain integrity."
- Card 4: "Mobile Field Operations" / "Live trip tracking, geofenced rally points, muster check-ins, and SMS broadcast. Everything your chaperones need in their pocket."
- Card 5: "Real-Time Monitoring" / "Geofence alerts, participant location visibility, and muster check-in status. Know where your travelers are at all times."
- Card 6: "Compliance and Evidence" / "AES-256 encryption, tamper-evident audit trails, and documentation designed for FERPA, SOC 2, and GDPR requirements."

### Binder Showcase
- Eyebrow: "THE SAFETY BINDER"
- Headline: "See exactly what a reviewed trip looks like."
- Body: "Every trip reviewed by SafeTrekr produces a complete safety binder. The binder documents every analyst finding, every risk assessment, every emergency contact -- with tamper-evident integrity. If a board member, insurer, or attorney asks what you did to prepare, you hand them this."
- CTA 1: "Download a Sample Binder"
- CTA 2: "See What's Inside"

### Segment Routing
- Eyebrow: "BUILT FOR YOUR ORGANIZATION"
- Headline: "Built for organizations that take travel safety seriously."
- Card 1: "K-12 Schools and Districts" / "FERPA-ready field trip safety reviews. Professional analyst evaluation of every destination, from $15 per student. Board-ready documentation that proves due diligence."
- Card 2: "Higher Education" / "Study abroad, Clery Act, and international program safety. Institutional-grade risk assessment with evidence documentation for general counsel and risk management."
- Card 3: "Churches and Mission Organizations" / "Mission trip safety with volunteer screening documentation and youth protection. Stewardship-framed preparation that satisfies insurance requirements."
- Card 4: "Corporate and Sports Teams" / "Duty of care compliance for business travel and team transportation. Professional safety analysis for mid-market organizations without enterprise budgets."

### Pricing Preview
- Eyebrow: "PRICING"
- Headline: "Professional trip safety starting at $15 per participant."
- Anchor: "The average trip-related legal settlement: $500K-$2M. SafeTrekr: $15 per student."
- Tier 1: "Field Trip" / "$450 per trip" / "~$15/student for a 30-person group"
- Tier 2: "Extended Trip" / "$750 per trip" / "~$19/student for a 40-person group" / Badge: "Most Popular"
- Tier 3: "International" / "$1,250 per trip" / "~$42/participant for a 30-person group"
- Link: "View full pricing and volume discounts"

### Category Contrast
- Eyebrow: "NOT ANOTHER TRAVEL APP"
- Headline: "This is not travel insurance. This is not trip logistics. This is professional safety analysis."
- Body: "SafeTrekr creates a category that did not exist before: professional safety analysis with evidence documentation. Here is how it compares to what organizations typically use."

### Final CTA
- Headline: "Ready to protect your next trip?"
- Body: "Every trip goes well until one does not. The binder is for that day."
- CTA 1: "Get a Demo"
- CTA 2: "See a Sample Binder"

---

## Appendix B: Component Usage Summary

| Component | Instances | Sections Used |
|-----------|:---------:|---------------|
| `SiteHeader` | 1 | Top of page (sticky) |
| `Button` (primary) | 6 | Hero, Binder Showcase, Pricing (x3), Final CTA |
| `Button` (secondary) | 2 | Hero, Final CTA |
| `Button` (primary-on-dark) | 2 | Binder Showcase, Final CTA |
| `Button` (ghost, dark) | 2 | Binder Showcase, Final CTA |
| `Button` (link) | 3 | How It Works, Pricing, Problem section cards |
| `Badge` (default) | 2 | Pricing "Most Popular", Hero Review Panel "Reviewed" |
| `Eyebrow` | 8 | Every section header |
| `StatusDot` (active) | 1 | Hero readiness gauge |
| `Divider` (route) | 0 | Not used on homepage (used between sections on other pages) |
| `FeatureCard` | 9 | Problem/Mechanism (3), Feature Grid (6) |
| `StatCard` | 5 | Trust Metrics Strip |
| `PricingTier` | 3 | Pricing Preview |
| `IndustryCard` | 4 | Segment Routing |
| `MotifBadge` | 3 | Problem/Mechanism cards (route, review, record) |
| `DocumentPreview` | 1 | Hero composition Layer 3 |
| `TimelineStep` | 3 | How It Works (mobile layout) |
| `ProcessTimeline` | 1 | How It Works section |
| `TrustMetricsStrip` | 1 | Trust Strip section |
| `CTABand` (dark) | 1 | Final CTA Banner |
| `DarkAuthoritySection` | 2 | Binder Showcase, Final CTA |
| `SiteFooter` | 1 | Bottom of page |

---

## Appendix C: Link Inventory

Every outbound link from the homepage:

| Link Text | Destination | Section | Type |
|-----------|------------|---------|------|
| Logo | `/` | Header | Internal |
| Platform | `/platform` | Header nav | Internal |
| Solutions | `/solutions` | Header nav | Internal |
| How It Works | `/how-it-works` | Header nav | Internal |
| Pricing | `/pricing` | Header nav | Internal |
| Resources | `/resources` | Header nav | Internal |
| Sign In | `https://app.safetrekr.com` | Header utility | External |
| Get a Demo | `/demo` | Header CTA | Internal |
| See Sample Binder | `/resources/sample-binders` | Hero CTA | Internal (gated) |
| Schedule a Demo | `/demo` | Hero CTA | Internal |
| Learn about the review | `/platform/analyst-review` | Problem card | Internal |
| See the intelligence engine | `/platform/risk-intelligence` | Problem card | Internal |
| Explore the safety binder | `/platform/safety-binder` | Problem card | Internal |
| See the full process | `/how-it-works` | How It Works | Internal |
| Analyst Safety Review | `/platform/analyst-review` | Feature Grid | Internal |
| Risk Intelligence Engine | `/platform/risk-intelligence` | Feature Grid | Internal |
| Trip Safety Binder | `/platform/safety-binder` | Feature Grid | Internal |
| Mobile Field Operations | `/platform/mobile-app` | Feature Grid | Internal |
| Real-Time Monitoring | `/platform/monitoring` | Feature Grid | Internal |
| Compliance and Evidence | `/platform/compliance` | Feature Grid | Internal |
| Download a Sample Binder | `/resources/sample-binders` | Binder Showcase | Internal (gated) |
| See What's Inside | `/how-it-works#safety-binder` | Binder Showcase | Internal |
| K-12 Schools and Districts | `/solutions/k12` | Segment Routing | Internal |
| Higher Education | `/solutions/higher-education` | Segment Routing | Internal |
| Churches and Mission Orgs | `/solutions/churches` | Segment Routing | Internal |
| Corporate and Sports Teams | `/solutions/corporate` | Segment Routing | Internal |
| Get a Demo (x3) | `/demo` | Pricing tiers | Internal |
| View full pricing... | `/pricing` | Pricing | Internal |
| Get a Demo | `/demo` | Final CTA | Internal |
| See a Sample Binder | `/resources/sample-binders` | Final CTA | Internal (gated) |
| Footer links | Various (30+ links) | Footer | Internal/External |

**Total unique internal destinations**: ~20
**Total CTA buttons pointing to /demo**: 6
**Total CTA buttons pointing to sample binders**: 4

---

*This specification was authored as the implementation-ready mockup reference for the SafeTrekr Homepage. All tokens, components, content, and interaction details reference DESIGN-SYSTEM.md v1.0 and INFORMATION-ARCHITECTURE.md v1.0.0. No interpretation is required -- developers implement from this document.*
