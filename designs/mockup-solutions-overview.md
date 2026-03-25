# Solutions Overview Mockup Specification: SafeTrekr Marketing Site

**Version**: 1.0
**Date**: 2026-03-24
**Page**: Solutions Overview (`/solutions`)
**Status**: Implementation-Ready High-Fidelity Specification
**Dependencies**: DESIGN-SYSTEM.md (canonical), INFORMATION-ARCHITECTURE.md (Section 1.1, 2.2.2, 4.1)
**Viewport Targets**: 1440px (desktop), 768px (tablet), 375px (mobile)

> This document specifies every pixel, token, component, content string, and interaction for the SafeTrekr Solutions Overview page. Developers implement from this document. Designers validate against it. No interpretation is required.

---

## Table of Contents

1. [Page-Level Architecture](#1-page-level-architecture)
2. [Section 1: Site Header](#2-section-1-site-header)
3. [Section 2: Hero](#3-section-2-hero)
4. [Section 3: Segment Cards](#4-section-3-segment-cards)
5. [Section 4: Universal Value Proposition](#5-section-4-universal-value-proposition)
6. [Section 5: Trust Metrics Strip](#6-section-5-trust-metrics-strip)
7. [Section 6: Final CTA Banner (Dark Section 1)](#7-section-6-final-cta-banner-dark-section-1)
8. [Section 7: Site Footer](#8-section-7-site-footer)
9. [Page-Level Accessibility](#9-page-level-accessibility)
10. [Performance Budget](#10-performance-budget)

---

## 1. Page-Level Architecture

### 1.1 Page Purpose

This is the segment routing hub. Its sole conversion job is to move visitors into the correct segment page (`/solutions/k12`, `/solutions/higher-education`, `/solutions/churches`, `/solutions/corporate`) as fast as possible. Every element on this page either identifies the visitor's organization type or builds confidence that SafeTrekr serves that type professionally. No feature deep-dives. No pricing. No sample binder CTAs. The segment cards are the dominant visual element.

**Page Type**: Section Landing Page (SSG)
**Hierarchy Level**: L1
**JSON-LD**: WebPage, BreadcrumbList (none rendered visually -- L1 page)
**Breadcrumb**: None (L1 page per IA spec)

### 1.2 Section Rhythm and Surface Allocation

```
 Section                          Surface              Background Token          Dark?
 -----------------------------------------------------------------------------------------
 1.  Site Header                  Transparent/Glass     transparent -> bg/80      No
 2.  Hero                         Light                 background (#e7ecee)      No
 3.  Segment Cards                Card                  card (#f7f8f8)            No
 4.  Universal Value Prop         Accent wash           primary-50 (#f1f9f4)      No
 5.  Trust Metrics Strip          Card                  card (#f7f8f8)            No
 6.  Final CTA Banner             DARK SECTION 1        secondary (#123646)       YES
 7.  Footer                       Dark (uncounted)      secondary (#123646)       Always
```

**Dark section count**: 1 (Final CTA). Footer excluded per design system rule. This is a lean, routing-focused page. One dark section at the bottom creates a strong close. Dark section at approximately 85% page depth -- appropriate for terminal CTA placement.

**Surface rhythm**: transparent -> light -> card -> accent -> card -> dark. No two identical surfaces are adjacent. The card surface on section 3 lifts the segment cards into prominence. The accent wash on section 4 creates a gentle visual break before the trust strip.

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
      "@type": "WebPage",
      "name": "Solutions - SafeTrekr",
      "description": "SafeTrekr provides professional trip safety review and evidence documentation for K-12 schools, higher education, churches, and corporate organizations.",
      "url": "https://safetrekr.com/solutions",
      "isPartOf": {
        "@type": "WebSite",
        "name": "SafeTrekr",
        "url": "https://safetrekr.com"
      }
    },
    {
      "@type": "ItemList",
      "name": "SafeTrekr Solutions by Organization Type",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "K-12 Schools and Districts",
          "url": "https://safetrekr.com/solutions/k12"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Higher Education",
          "url": "https://safetrekr.com/solutions/higher-education"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Churches and Mission Organizations",
          "url": "https://safetrekr.com/solutions/churches"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Corporate and Sports Teams",
          "url": "https://safetrekr.com/solutions/corporate"
        }
      ]
    }
  ]
}
```

---

## 2. Section 1: Site Header

**Component**: `SiteHeader`
**File**: `components/layout/site-header.tsx`
**Position**: `sticky top-0 z-[var(--z-sticky)]` (z-index: 30)

Shared component. Identical to homepage specification. "Solutions" link in primary nav carries `aria-current="page"` and active state (`text-foreground font-semibold` with 2px bottom border `primary-500`).

### 2.1 Layout (1440px Desktop)

```
+--[Container: max-w-[1280px] mx-auto px-12]------------------------------------+
|                                                                                 |
|  [Logo 32px]    Platform v  Solutions v  How It Works  Pricing  Resources v     |
|                                               ^^^^                              |
|                                              ACTIVE     [Sign In]  [ Get a Demo ]|
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### 2.2 Scroll Behavior

| State | Background | Border | Blur | Shadow | Height |
|-------|-----------|--------|------|--------|--------|
| At top (scrollY <= 100) | `transparent` | none | none | none | 80px (`h-20`) |
| Scrolled (scrollY > 100) | `background/80` (#e7ecee at 80% opacity) | `border-b border-border/50` | `backdrop-blur-xl` | `shadow-sm` | 64px (`h-16`) |

### 2.3 Layout (375px Mobile)

```
+--[px-6]--------------------------------------------+
|  [Logo 28px]                         [Hamburger]    |
+-----------------------------------------------------+
```

Height: 64px. Logo horizontal-dark at 28px. Hamburger icon (`Menu`, 24px) in right zone. Triggers `Sheet` component sliding from right with accordion navigation.

### 2.4 Skip Navigation

First focusable element on page (hidden until focused):

```html
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-card focus:text-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-ring">
  Skip to main content
</a>
```

---

## 3. Section 2: Hero

**Surface**: `background` (#e7ecee)
**Spacing**: `pt-24 pb-16 lg:pt-28 lg:pb-20`
**Background treatment**: Faint dot-grid pattern at 3-4% opacity using `primary-300`, CSS `radial-gradient(circle, var(--color-primary-300) 1px, transparent 1px)` with `background-size: 24px 24px`.

### 3.1 Layout (1440px Desktop)

```
+--[Container: 1280px]-----------------------------------------------------------+
|  pt-28 (112px)                                                                  |
|                                                                                 |
|                          [center-aligned]                                       |
|                                                                                 |
|              SOLUTIONS BY ORGANIZATION TYPE                                     |
|                                                                                 |
|              One platform. Every type of trip.                                  |
|              Every organization protected.                                      |
|                                                                                 |
|              Schools, universities, churches, and businesses                    |
|              trust SafeTrekr to professionally review every trip,               |
|              score every risk, and document every safety decision.              |
|                                                                                 |
|              [Find Your Solution]                                               |
|                                                                                 |
|  pb-20 (80px)                                                                   |
+---------------------------------------------------------------------------------+
```

**Layout**: Single centered column. `text-center max-w-3xl mx-auto`.
**Spacing**: `pt-28 pb-20` at xl breakpoint per hero spacing spec.

### 3.2 Content

| Element | Content | Styles |
|---------|---------|--------|
| Eyebrow | "SOLUTIONS BY ORGANIZATION TYPE" | `.text-eyebrow text-primary-700 text-center` (13px, weight 600, tracking 0.08em, uppercase). Leading icon: `Building2` Lucide icon, 16px, `text-primary-700`, `mr-2`. `inline-flex items-center justify-center`. |
| Headline | "One platform. Every type of trip. Every organization protected." | `.text-display-lg text-foreground text-center` = `clamp(2.125rem, 1.15rem + 2.72vw, 3.5rem)`, weight 700, line-height 1.1, tracking -0.02em, Plus Jakarta Sans. `max-w-[28ch] mx-auto mt-4`. Renders as `<h1>`. |
| Subtext | "Schools, universities, churches, and businesses trust SafeTrekr to professionally review every trip, score every risk, and document every safety decision." | `.text-body-lg text-muted-foreground text-center` = `clamp(1.125rem, 1.04rem + 0.25vw, 1.25rem)`, weight 400, line-height 1.6, Inter. `max-w-[55ch] mx-auto mt-6`. Color: `muted-foreground` (#4d5153). |
| CTA | "Find Your Solution" | `Button variant="ghost" size="default"` with `ChevronDown` icon (16px) right of text. Scroll-to anchor linking to `#segment-cards`. Not a primary CTA -- this page's job is to route, not convert directly. `mt-8`. |

**Design rationale**: The hero is deliberately lean. No product composition, no dual CTAs, no sample binder gate. The hero's only job is to establish that this is the routing page and move the eye downward to the segment cards. The ghost button with down-chevron signals "keep scrolling" without competing with segment card CTAs.

### 3.3 Animation

| Time | Element | Animation Preset | Duration | Easing |
|------|---------|-----------------|----------|--------|
| 0ms | Eyebrow | `fadeIn` | 300ms | `ease-default` |
| 100ms | Headline | `fadeUp` (y: 20px to 0) | 400ms | `ease-spring` |
| 250ms | Subtext | `fadeUp` (y: 20px to 0) | 300ms | `ease-enter` |
| 400ms | CTA button | `fadeUp` (y: 16px to 0) | 250ms | `ease-enter` |

**Reduced motion**: All elements render at final state immediately.

### 3.4 Responsive Behavior

**768px (Tablet)**: Same centered layout. Headline resolves to approximately 32px via `clamp()`. Padding: `pt-20 pb-16`.

**375px (Mobile)**:
```
+--[px-6]-------------------------------+
|  pt-16 (64px)                          |
|                                        |
|  SOLUTIONS BY ORGANIZATION TYPE        |
|                                        |
|  One platform.                         |
|  Every type of trip.                   |
|  Every organization                    |
|  protected.                            |
|                                        |
|  Schools, universities,               |
|  churches, and businesses              |
|  trust SafeTrekr to...                 |
|                                        |
|  [Find Your Solution v]               |
|                                        |
|  pb-12 (48px)                          |
+----------------------------------------+
```

Headline resolves to approximately 34px. Padding: `pt-16 pb-12`.

---

## 4. Section 3: Segment Cards

**ID**: `segment-cards` (scroll target from hero CTA)
**Surface**: `card` (#f7f8f8)
**Border**: `border-y border-border` (top and bottom)
**Spacing**: `py-24 lg:py-32`

This is the primary visual section of the page. The 4 segment cards dominate the viewport and are intentionally oversized compared to the `IndustryCard` component used on the homepage. Each card is a self-contained routing module with enough information to help the visitor self-select.

### 4.1 Layout (1440px Desktop)

```
+--[Full width: bg-card border-y border-border]----------------------------------+
|  py-32 (128px)                                                                  |
|                                                                                 |
|  +--[Container: 1280px]-----------------------------------------------------+  |
|  |                                                                           |  |
|  |  +--[grid grid-cols-2 gap-8]------------------------------------------+  |  |
|  |  |                                                                     |  |  |
|  |  |  +--[SegmentCard]-----------------+  +--[SegmentCard]-------------+|  |  |
|  |  |  |                                |  |                            ||  |  |
|  |  |  |  +--[icon 48px]--+             |  |  +--[icon 48px]--+        ||  |  |
|  |  |  |  | [GraduationCap]|             |  |  | [University]  |        ||  |  |
|  |  |  |  +----------------+             |  |  +--------------+         ||  |  |
|  |  |  |                                |  |                            ||  |  |
|  |  |  |  K-12 Schools                  |  |  Higher Education          ||  |  |
|  |  |  |  and Districts                 |  |                            ||  |  |
|  |  |  |                                |  |  [CLERY ACT] [FERPA]       ||  |  |
|  |  |  |  [FERPA] [COPPA]              |  |                            ||  |  |
|  |  |  |                                |  |  Study abroad and          ||  |  |
|  |  |  |  Every field trip deserves     |  |  international program     ||  |  |
|  |  |  |  the same safety rigor as a    |  |  safety backed by          ||  |  |
|  |  |  |  commercial flight. SafeTrekr  |  |  institutional-grade       ||  |  |
|  |  |  |  gives your district a         |  |  risk assessment...        ||  |  |
|  |  |  |  professional analyst review   |  |                            ||  |  |
|  |  |  |  of every trip...              |  |  [ Learn More -> ]         ||  |  |
|  |  |  |                                |  |                            ||  |  |
|  |  |  |  [ Learn More -> ]             |  +----------------------------+|  |  |
|  |  |  |                                |                                |  |  |
|  |  |  +--------------------------------+                                |  |  |
|  |  |                                                                     |  |  |
|  |  |  +--[SegmentCard]-----------------+  +--[SegmentCard]-------------+|  |  |
|  |  |  |                                |  |                            ||  |  |
|  |  |  |  +--[icon 48px]--+             |  |  +--[icon 48px]--+        ||  |  |
|  |  |  |  | [Heart]       |             |  |  | [Building]    |        ||  |  |
|  |  |  |  +----------------+             |  |  +--------------+         ||  |  |
|  |  |  |                                |  |                            ||  |  |
|  |  |  |  Churches and Mission          |  |  Corporate and             ||  |  |
|  |  |  |  Organizations                 |  |  Sports Teams              ||  |  |
|  |  |  |                                |  |                            ||  |  |
|  |  |  |  [DUTY OF CARE]               |  |  [DUTY OF CARE] [OSHA]    ||  |  |
|  |  |  |                                |  |                            ||  |  |
|  |  |  |  Mission trip safety that      |  |  Professional duty of     ||  |  |
|  |  |  |  goes beyond good intentions.  |  |  care documentation for   ||  |  |
|  |  |  |  SafeTrekr gives your church   |  |  business travel and      ||  |  |
|  |  |  |  professional safety...        |  |  team transportation...   ||  |  |
|  |  |  |                                |  |                            ||  |  |
|  |  |  |  [ Learn More -> ]             |  |  [ Learn More -> ]        ||  |  |
|  |  |  |                                |  |                            ||  |  |
|  |  |  +--------------------------------+  +----------------------------+|  |  |
|  |  |                                                                     |  |  |
|  |  +---------------------------------------------------------------------+  |  |
|  |                                                                           |  |
|  +--------------------------------------------------------------- -----------+  |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

**Grid**: `grid md:grid-cols-2 gap-8`

### 4.2 Segment Card Component

**Component**: `SegmentCardLarge` (page-specific organism, not reused from homepage)
**File**: `components/marketing/segment-card-large.tsx`

This is a purpose-built card for the Solutions Overview page. It is significantly larger and more information-dense than the `IndustryCard` used for homepage segment routing. The entire card is a clickable link.

**Structure**: `<a>` wrapping the card with `group` class. `bg-white rounded-2xl border border-border p-8 lg:p-10 shadow-card hover:shadow-card-hover transition-all duration-normal`. Min-height: `min-h-[320px]`.

**Content slots** (top to bottom):

1. **Icon container**: `h-14 w-14 rounded-xl bg-primary-50 flex items-center justify-center`. Icon: 28px, `text-primary-700`.
2. **Title**: `.text-heading-lg text-foreground mt-5` (36px desktop / 24px mobile, weight 700). Renders as `<h2>`.
3. **Regulatory badges**: `flex flex-wrap gap-2 mt-3`. Each badge: `Badge variant="secondary"` -- `bg-card text-foreground border border-border text-body-xs font-medium px-2.5 py-0.5 rounded-full`.
4. **Description**: `.text-body-md text-muted-foreground mt-4 max-w-[45ch]` (16px, weight 400, line-height 1.6, Inter). 2-3 sentences.
5. **CTA link**: `.text-body-md font-semibold text-primary-700 mt-6 inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-fast`. Text: "Learn More". Icon: `ArrowRight` (16px), translates 4px right on card hover.

**Hover behavior**:
- Card: `shadow-card` to `shadow-card-hover`, `translateY(-2px)`, transition `duration-normal`.
- Title: transitions to `text-primary-700`.
- Arrow icon: `translateX(4px)`.

**Props**:
```typescript
interface SegmentCardLargeProps {
  icon: LucideIcon;
  title: string;
  badges: string[];
  description: string;
  href: string;
  className?: string;
}
```

### 4.3 Card Content (All 4 Cards)

**Card 1: K-12 Schools and Districts**

| Slot | Content |
|------|---------|
| Icon | `GraduationCap` (Lucide), 28px, `text-primary-700` |
| Title | "K-12 Schools and Districts" |
| Badges | "FERPA", "COPPA" |
| Description | "Every field trip deserves the same safety rigor as a commercial flight. SafeTrekr gives your district a professional analyst review of every destination, government-sourced risk intelligence, and board-ready documentation that proves due diligence -- starting at $15 per student." |
| CTA | "Learn More" -> `/solutions/k12` |
| Aria Label | "Learn more about SafeTrekr solutions for K-12 schools and districts" |

**Card 2: Higher Education**

| Slot | Content |
|------|---------|
| Icon | `Building2` (Lucide), 28px, `text-primary-700` |
| Title | "Higher Education" |
| Badges | "CLERY ACT", "FERPA" |
| Description | "Study abroad and international program safety backed by institutional-grade risk assessment. SafeTrekr provides your risk management office and general counsel with professionally reviewed, tamper-evident documentation for every program trip -- from spring break service trips to semester-long study abroad." |
| CTA | "Learn More" -> `/solutions/higher-education` |
| Aria Label | "Learn more about SafeTrekr solutions for higher education institutions" |

**Card 3: Churches and Mission Organizations**

| Slot | Content |
|------|---------|
| Icon | `Heart` (Lucide), 28px, `text-primary-700` |
| Title | "Churches and Mission Organizations" |
| Badges | "DUTY OF CARE" |
| Description | "Mission trip safety that goes beyond good intentions. SafeTrekr gives your church professional safety analysis for every mission field, government risk intelligence for every destination, and insurance-ready documentation that satisfies your carrier and your board -- because stewardship includes preparation." |
| CTA | "Learn More" -> `/solutions/churches` |
| Aria Label | "Learn more about SafeTrekr solutions for churches and mission organizations" |

**Card 4: Corporate and Sports Teams**

| Slot | Content |
|------|---------|
| Icon | `Building` (Lucide), 28px, `text-primary-700` |
| Title | "Corporate and Sports Teams" |
| Badges | "DUTY OF CARE", "OSHA" |
| Description | "Professional duty of care documentation for business travel and team transportation. SafeTrekr delivers the same analyst-reviewed, evidence-documented trip safety that enterprise organizations expect -- built for mid-market companies and athletic programs without enterprise budgets." |
| CTA | "Learn More" -> `/solutions/corporate` |
| Aria Label | "Learn more about SafeTrekr solutions for corporate and sports teams" |

### 4.4 Responsive Behavior

**768px (Tablet)**: `grid-cols-2 gap-6`. Cards maintain 2x2 grid. Padding inside cards: `p-6`. Title: `.text-heading-md` (28px). Icon container: `h-12 w-12`, icon 24px. Min-height: `min-h-[280px]`.

**375px (Mobile)**:
```
+--[px-6]-------------------------------+
|                                        |
|  +--[SegmentCard full-width]--------+  |
|  |  [icon]                          |  |
|  |  K-12 Schools and Districts      |  |
|  |  [FERPA] [COPPA]                 |  |
|  |  Every field trip deserves       |  |
|  |  the same safety rigor...        |  |
|  |  Learn More ->                   |  |
|  +----------------------------------+  |
|                                        |
|  gap-4 (16px)                          |
|                                        |
|  +--[SegmentCard full-width]--------+  |
|  |  [icon]                          |  |
|  |  Higher Education                |  |
|  |  [CLERY ACT] [FERPA]            |  |
|  |  Study abroad and               |  |
|  |  international program...        |  |
|  |  Learn More ->                   |  |
|  +----------------------------------+  |
|                                        |
|  [... 2 more cards stacked]           |
|                                        |
+----------------------------------------+
```

`grid-cols-1 gap-4`. Cards full-width. Padding: `p-6`. Title: `.text-heading-md` (20px mobile). Icon container: `h-12 w-12`, icon 24px. Min-height: none (auto).

### 4.5 Animation

Cards: `staggerContainer + cardReveal` at 100ms stagger. Trigger: 20% viewport intersection.

| Time | Element | Animation Preset | Duration | Easing |
|------|---------|-----------------|----------|--------|
| 0ms | Card 1 | `cardReveal` (opacity 0, y: 24, scale 0.98 -> final) | 500ms | `ease-spring` |
| 100ms | Card 2 | `cardReveal` | 500ms | `ease-spring` |
| 200ms | Card 3 | `cardReveal` | 500ms | `ease-spring` |
| 300ms | Card 4 | `cardReveal` | 500ms | `ease-spring` |

**Reduced motion**: All cards render at final state immediately. No transforms or scale.

### 4.6 Accessibility

- `<section id="segment-cards" aria-labelledby="segment-cards-heading">`
- Hidden heading for assistive technology: `<h2 id="segment-cards-heading" class="sr-only">Solutions by organization type</h2>` -- visually hidden but provides landmark heading for screen readers. The visual heading is provided by the hero `<h1>`.
- Each card: Entire card is an `<a>` element. Title rendered as `<h2>` (visible). `aria-label` on each card link includes full segment name and action.
- Badge text is readable by screen readers (no `aria-hidden`).
- Focus ring: 2px `ring` color, 2px offset, `rounded-2xl` matching card radius.
- Tab order: Card 1 (K-12) -> Card 2 (Higher Ed) -> Card 3 (Churches) -> Card 4 (Corporate). Matches visual reading order (left-to-right, top-to-bottom).

**Note on heading hierarchy**: Because segment cards use `<h2>` for their titles and the hero uses `<h1>`, the hidden section heading also uses `<h2>` class `sr-only`. The visible card titles are `<h3>` to nest properly under the section `<h2>`. Corrected structure:

- `<h2 id="segment-cards-heading" class="sr-only">` "Solutions by organization type"
- Card titles: `<h3>` -- "K-12 Schools and Districts", "Higher Education", "Churches and Mission Organizations", "Corporate and Sports Teams"

---

## 5. Section 4: Universal Value Proposition

**Surface**: `primary-50` (#f1f9f4) -- accent wash
**Spacing**: `py-24 lg:py-32`

This section answers: "What does every organization get, regardless of type?" It reinforces the three mechanism pillars (Analyst Review, Risk Intelligence, Safety Binder) without duplicating the feature grid from the homepage. The framing is benefit-oriented and organization-agnostic.

### 5.1 Layout (1440px Desktop)

```
+--[Full width: bg-primary-50]----------------------------------------------------+
|  py-32 (128px)                                                                   |
|                                                                                  |
|  +--[Container: 1280px]------------------------------------------------------+  |
|  |                                                                            |  |
|  |  INCLUDED WITH EVERY TRIP                                                  |  |
|  |                                                                            |  |
|  |  Regardless of your organization type,                                     |  |
|  |  every trip receives the same standard                                     |  |
|  |  of professional safety review.                                            |  |
|  |                                                                            |  |
|  |  gap-12 (48px)                                                             |  |
|  |                                                                            |  |
|  |  +--[grid grid-cols-3 gap-8]-----------------------------------------+    |  |
|  |  |                                                                    |    |  |
|  |  |  +--[ValueCard]-------+  +--[ValueCard]------+  +--[ValueCard]-+ |    |  |
|  |  |  |                    |  |                    |  |              | |    |  |
|  |  |  | [ClipboardCheck]   |  | [Route]            |  | [FileText]  | |    |  |
|  |  |  |                    |  |                    |  |              | |    |  |
|  |  |  | Professional       |  | Government Risk    |  | Trip Safety | |    |  |
|  |  |  | Analyst Review     |  | Intelligence       |  | Binder      | |    |  |
|  |  |  |                    |  |                    |  |              | |    |  |
|  |  |  | A trained safety   |  | Monte Carlo risk   |  | Audit-ready | |    |  |
|  |  |  | analyst reviews    |  | scoring from 5     |  | documentation| |    |  |
|  |  |  | every trip across  |  | government sources:|  | with SHA-256| |    |  |
|  |  |  | 17 dimensions --   |  | NOAA, USGS, CDC,   |  | hash-chain  | |    |  |
|  |  |  | from venue safety  |  | GDACS, and         |  | integrity.  | |    |  |
|  |  |  | to emergency       |  | ReliefWeb.         |  | Every finding| |    |  |
|  |  |  | evacuation.        |  |                    |  | documented. | |    |  |
|  |  |  |                    |  |                    |  | Every decision| |    |  |
|  |  |  | [Explore ->]       |  | [Explore ->]       |  | verifiable. | |    |  |
|  |  |  |                    |  |                    |  |              | |    |  |
|  |  |  +--------------------+  +--------------------+  | [Explore ->]| |    |  |
|  |  |                                                   +--------------+ |    |  |
|  |  +--------------------------------------------------------------------+    |  |
|  |                                                                            |  |
|  +----------------------------------------------------------------------------+  |
|                                                                                  |
+--[End bg-primary-50]------------------------------------------------------------+
```

**Grid**: `grid sm:grid-cols-2 lg:grid-cols-3 gap-8`

### 5.2 Section Header

| Element | Content | Style |
|---------|---------|-------|
| Eyebrow | "INCLUDED WITH EVERY TRIP" | `.text-eyebrow text-primary-700 text-center`, icon: `Shield` Lucide, 16px, `text-primary-700`, `mr-2` |
| Headline | "Regardless of your organization type, every trip receives the same standard of professional safety review." | `.text-display-md text-foreground text-center max-w-[28ch] mx-auto` = `<h2>`. `clamp(1.75rem, 1.04rem + 1.98vw, 2.75rem)`, weight 700, line-height 1.15, tracking -0.015em. |

### 5.3 Value Cards (3 Total)

**Component**: `FeatureCard` (shared component from design system)
**File**: `components/marketing/feature-card.tsx`

Standard FeatureCard with platform page links. `bg-white rounded-xl border border-border p-6 sm:p-8 shadow-card`. Hover: `shadow-card-hover`, `translateY(-2px)`.

**Card 1: Professional Analyst Review**

| Slot | Content |
|------|---------|
| Icon | `ClipboardCheck` (Lucide), 24px in `h-12 w-12 rounded-lg bg-primary-50` container, `text-primary-700` |
| Title | "Professional Analyst Review" |
| Description | "A trained safety analyst reviews every trip your organization takes -- across 17 dimensions, from venue safety to emergency evacuation planning. No algorithms. No automation. A real analyst who flags what needs attention and documents what is ready." |
| Link | "Explore the review process" -> `/platform/analyst-review` |

**Card 2: Government Risk Intelligence**

| Slot | Content |
|------|---------|
| Icon | `Route` (Lucide), 24px in `h-12 w-12 rounded-lg bg-primary-50` container, `text-primary-700` |
| Title | "Government Risk Intelligence" |
| Description | "Monte Carlo risk scoring sourced from 5 government databases: NOAA weather data, USGS seismic monitoring, CDC health advisories, GDACS disaster alerts, and ReliefWeb humanitarian reports. Probability-weighted, not opinion-based." |
| Link | "See how scoring works" -> `/platform/risk-intelligence` |

**Card 3: Trip Safety Binder**

| Slot | Content |
|------|---------|
| Icon | `FileText` (Lucide), 24px in `h-12 w-12 rounded-lg bg-primary-50` container, `text-primary-700` |
| Title | "Trip Safety Binder" |
| Description | "Audit-ready documentation with SHA-256 hash-chain integrity. Every finding, every recommendation, every emergency contact, every risk score -- compiled into a tamper-evident binder that satisfies your board, your insurance carrier, and your legal team." |
| Link | "See a sample binder" -> `/platform/safety-binder` |

### 5.4 Responsive Behavior

**768px (Tablet)**: `grid-cols-2 gap-6`. Card 3 spans full width below cards 1 and 2. Alternative: `sm:grid-cols-2 lg:grid-cols-3` -- at 768px, cards 1 and 2 side-by-side, card 3 centered below.

To center card 3 below when using 2-column grid:
```html
<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
  <FeatureCard ... /> <!-- Card 1 -->
  <FeatureCard ... /> <!-- Card 2 -->
  <FeatureCard class="sm:col-span-2 sm:max-w-md sm:mx-auto lg:col-span-1 lg:max-w-none" ... /> <!-- Card 3 -->
</div>
```

**375px (Mobile)**: `grid-cols-1 gap-4`. Stacked cards, full-width. Padding: `p-6`.

### 5.5 Animation

Section heading: `fadeUp` with eyebrow + heading staggered at 80ms.
Cards: `staggerContainer + cardReveal` at 80ms stagger. Trigger: 20% viewport.

### 5.6 Accessibility

- `<section aria-labelledby="universal-value-heading">`
- Heading: `<h2 id="universal-value-heading">` "Regardless of your organization type, every trip receives the same standard of professional safety review."
- Card titles: `<h3>`.
- Feature card links are descriptive (not "Learn more" but "Explore the review process").
- Cards on `primary-50` background: `foreground` (#061a23) on `primary-50` (#f1f9f4) = 14.2:1 contrast. PASS. `muted-foreground` (#4d5153) on `primary-50` (#f1f9f4) = 5.6:1. PASS.

---

## 6. Section 5: Trust Metrics Strip

**Component**: `TrustMetricsStrip`
**File**: `components/marketing/trust-metrics-strip.tsx`
**Surface**: `card` (#f7f8f8)
**Border**: `border-y border-border`
**Spacing**: `py-16 lg:py-20`

Shared component. Identical to homepage implementation.

### 6.1 Layout (1440px Desktop)

```
+--[Full width: bg-card border-y border-border]----------------------------------+
|  py-20 (80px)                                                                   |
|                                                                                 |
|  +--[Container: 1280px]-----------------------------------------------------+  |
|  |                                                                           |  |
|  |  +--[grid grid-cols-5 gap-8]------------------------------------------+  |  |
|  |  |                                                                     |  |  |
|  |  |  +--[Stat]--+  +--[Stat]--+  +--[Stat]--+  +--[Stat]--+  +--[Stat]+|  |  |
|  |  |  |    5     |  |   17     |  |   3-5    |  | AES-256  |  | SHA-256||  |  |
|  |  |  | GOVT     |  | SAFETY   |  |   DAY    |  | ENCRYP-  |  | EVIDENCE|  |  |
|  |  |  | INTEL    |  | REVIEW   |  | TURN-    |  | TION     |  | CHAIN  ||  |  |
|  |  |  | SOURCES  |  | SECTIONS |  | AROUND   |  | STANDARD |  |        ||  |  |
|  |  |  +----------+  +----------+  +----------+  +----------+  +--------+|  |  |
|  |  |                                                                     |  |  |
|  |  +---------------------------------------------------------------------+  |  |
|  |                                                                           |  |
|  |  [center]                                                                 |  |
|  |  Data sourced from: NOAA | USGS | CDC | GDACS | ReliefWeb                |  |
|  |                                                                           |  |
|  +--------------------------------------------------------------- -----------+  |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### 6.2 Stat Values

| Value | Label | Animation |
|-------|-------|-----------|
| 5 | GOVERNMENT INTEL SOURCES | Counter from 0 (1.5s) |
| 17 | SAFETY REVIEW SECTIONS | Counter from 0 (1.5s) |
| 3-5 | DAY TURNAROUND | Fade in (string value) |
| AES-256 | ENCRYPTION STANDARD | Fade in (string value) |
| SHA-256 | EVIDENCE CHAIN | Fade in (string value) |

**Source attribution**: "Data sourced from: NOAA | USGS | CDC | GDACS | ReliefWeb" in `.text-body-xs text-muted-foreground text-center mt-6`. Pipe-separated, no logos (text-only for simplicity on this page).

### 6.3 Responsive Behavior

**768px (Tablet)**: `grid-cols-3` for first 3 stats, `grid-cols-2` for remaining 2 centered below.

Implementation: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8`. Stats wrap naturally.

**375px (Mobile)**: `grid-cols-2 gap-4`. Last stat centered below.

### 6.4 Accessibility

- `<section aria-label="Platform credentials">`
- Each stat: `StatCard` with `aria-label` providing full context (e.g., "5 government intelligence sources").
- Counter animation respects `prefers-reduced-motion` (shows final value immediately).

---

## 7. Section 6: Final CTA Banner (Dark Section 1)

**Component**: `CTABand`
**File**: `components/marketing/cta-band.tsx`
**Variant**: `dark`
**Surface**: `secondary` (#123646), `[data-theme="dark"]`
**Spacing**: `py-20 lg:py-28`

### 7.1 Layout (1440px Desktop)

```
+--[Full width: bg-secondary data-theme="dark"]----------------------------------+
|  py-28 (112px)                                                                  |
|                                                                                 |
|  +--[Container: 1280px]-----------------------------------------------------+  |
|  |                                                                           |  |
|  |                          [center-aligned]                                 |  |
|  |                                                                           |  |
|  |                  Ready to protect your next trip?                          |  |
|  |                                                                           |  |
|  |          See how SafeTrekr delivers professional safety review,           |  |
|  |          government intelligence, and audit-ready documentation            |  |
|  |          for your organization.                                            |  |
|  |                                                                           |  |
|  |              [ Get a Demo ]       See How It Works ->                      |  |
|  |                                                                           |  |
|  +--------------------------------------------------------------- -----------+  |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### 7.2 Content

| Element | Content | Style |
|---------|---------|-------|
| Headline | "Ready to protect your next trip?" | `.text-display-md` = `clamp(1.75rem, 1.04rem + 1.98vw, 2.75rem)`, weight 700, `text-[var(--color-dark-text-primary)]` (#f7f8f8), text-center. 11.6:1 contrast on `secondary`. PASS. |
| Body | "See how SafeTrekr delivers professional safety review, government intelligence, and audit-ready documentation for your organization." | `.text-body-lg text-[var(--color-dark-text-secondary)]` (#b8c3c7), text-center, `max-w-prose mx-auto mt-4`. 7.0:1 contrast on `secondary`. PASS. |
| CTA Primary | "Get a Demo" | `Button variant="primary-on-dark" size="lg"` = `h-13 px-8 text-lg font-semibold`, `bg-white text-secondary`, `rounded-md`. Hover: `bg-card`. Link: `/demo`. |
| CTA Secondary | "See How It Works" | `Button variant="link"` styled for dark surface = `text-[var(--color-dark-accent)]` (#6cbc8b, primary-400), `font-semibold`. Icon: `ArrowRight` (16px). Hover: underline. Link: `/how-it-works`. 4.8:1 contrast on `secondary`. PASS. |

**CTA row**: `flex flex-wrap items-center justify-center gap-4 mt-8`

### 7.3 Responsive Behavior

**768px (Tablet)**: Same layout. Headline: `clamp()` resolves to approximately 28px. Padding: `py-20`.

**375px (Mobile)**: CTAs stack vertically. `flex-col gap-3`. Primary CTA: full-width (`w-full`). Secondary CTA: centered text below. Padding: `py-16`.

### 7.4 Animation

`fadeUp` -- heading + body + CTAs staggered at 100ms. Trigger: 20% viewport.

### 7.5 Accessibility

- `<section aria-labelledby="final-cta-heading" data-theme="dark">`
- Heading: `<h2 id="final-cta-heading">` "Ready to protect your next trip?"
- Both CTAs are proper `<a>` elements rendered as buttons (via `asChild` prop wrapping `Link`).
- All text meets WCAG AA contrast requirements on `secondary` background (verified in content table above).

---

## 8. Section 7: Site Footer

**Component**: `SiteFooter`
**File**: `components/layout/site-footer.tsx`
**Surface**: `secondary` (#123646)

Shared component. Identical to homepage specification. Adjacent to the dark CTA band, creating a continuous dark zone at the bottom of the page. This is acceptable because the footer is excluded from the dark section count per design system rule.

### 8.1 Layout Summary

Three zones:
- **Zone 1 (Brand)**: Logo horizontal-light 32px, brand description in `dark-text-secondary`, `max-w-[35ch]`.
- **Zone 2 (Links)**: 6 columns at desktop (Platform, Solutions, Resources, How It Works, Company, Legal). Links: `text-body-sm text-[var(--color-dark-text-secondary)] hover:text-white transition-colors duration-fast`.
- **Zone 3 (Bottom bar)**: Copyright, legal links, trust badges (SOC 2, FERPA, GDPR, AES-256, SHA-256), data source attribution.

**Responsive**: < md: stacked. md-lg: logo left + 3-col right. >= lg: 5-col grid.

### 8.2 Accessibility

- `<footer>` with `<nav aria-label="Footer navigation">`.
- Each link column: `<section>` with `<h3>` heading.
- Social links: `aria-label` describing destination.

---

## 9. Page-Level Accessibility

### 9.1 Landmark Structure

```html
<body>
  <a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>
  <header> <!-- SiteHeader --> </header>
  <main id="main-content">
    <section aria-labelledby="hero-heading"> <!-- Hero --> </section>
    <section id="segment-cards" aria-labelledby="segment-cards-heading"> <!-- Segment Cards --> </section>
    <section aria-labelledby="universal-value-heading"> <!-- Universal Value Prop --> </section>
    <section aria-label="Platform credentials"> <!-- Trust Metrics Strip --> </section>
    <section aria-labelledby="final-cta-heading" data-theme="dark"> <!-- Final CTA --> </section>
  </main>
  <footer> <!-- SiteFooter --> </footer>
</body>
```

### 9.2 Heading Hierarchy

| Level | Content | Section |
|-------|---------|---------|
| `<h1>` | "One platform. Every type of trip. Every organization protected." | Hero |
| `<h2>` | "Solutions by organization type" (sr-only) | Segment Cards |
| `<h3>` | "K-12 Schools and Districts" | Segment Card |
| `<h3>` | "Higher Education" | Segment Card |
| `<h3>` | "Churches and Mission Organizations" | Segment Card |
| `<h3>` | "Corporate and Sports Teams" | Segment Card |
| `<h2>` | "Regardless of your organization type, every trip receives the same standard of professional safety review." | Universal Value Prop |
| `<h3>` | "Professional Analyst Review" | Value Card |
| `<h3>` | "Government Risk Intelligence" | Value Card |
| `<h3>` | "Trip Safety Binder" | Value Card |
| `<h2>` | "Ready to protect your next trip?" | Final CTA |

Single `<h1>`. Three `<h2>` headings. Logical nesting of `<h3>` within sections. No skipped levels.

### 9.3 Focus Order

Linear top-to-bottom, matching visual order:
1. Skip-nav link
2. Header logo
3. Header nav links (Platform, Solutions, How It Works, Pricing, Resources)
4. Header CTAs (Sign In, Get a Demo)
5. Hero ghost CTA (Find Your Solution)
6. Segment Card 1 (K-12)
7. Segment Card 2 (Higher Ed)
8. Segment Card 3 (Churches)
9. Segment Card 4 (Corporate)
10. Value Card 1 link (Explore the review process)
11. Value Card 2 link (See how scoring works)
12. Value Card 3 link (See a sample binder)
13. Final CTA Primary (Get a Demo)
14. Final CTA Secondary (See How It Works)
15. Footer links

### 9.4 Color Contrast Compliance

All text/background combinations used on this page:

| Text | Background | Ratio | WCAG AA |
|------|-----------|-------|---------|
| `foreground` (#061a23) | `background` (#e7ecee) | 13.2:1 | PASS |
| `foreground` (#061a23) | `card` (#f7f8f8) | 14.8:1 | PASS |
| `foreground` (#061a23) | `white` (#ffffff) | 16.1:1 | PASS |
| `foreground` (#061a23) | `primary-50` (#f1f9f4) | 14.2:1 | PASS |
| `muted-foreground` (#4d5153) | `background` (#e7ecee) | 5.2:1 | PASS |
| `muted-foreground` (#4d5153) | `card` (#f7f8f8) | 5.8:1 | PASS |
| `muted-foreground` (#4d5153) | `white` (#ffffff) | 6.3:1 | PASS |
| `muted-foreground` (#4d5153) | `primary-50` (#f1f9f4) | 5.6:1 | PASS |
| `primary-700` (#33704b) | `background` (#e7ecee) | 6.1:1 | PASS |
| `primary-700` (#33704b) | `card` (#f7f8f8) | 6.9:1 | PASS |
| `primary-700` (#33704b) | `white` (#ffffff) | 7.5:1 | PASS |
| `primary-700` (#33704b) | `primary-50` (#f1f9f4) | 6.6:1 | PASS |
| `white` (#ffffff) | `primary-600` (#3f885b) | 4.6:1 | PASS |
| `dark-text-primary` (#f7f8f8) | `secondary` (#123646) | 11.6:1 | PASS |
| `dark-text-secondary` (#b8c3c7) | `secondary` (#123646) | 7.0:1 | PASS |
| `dark-accent` (#6cbc8b) | `secondary` (#123646) | 4.8:1 | PASS |

### 9.5 Reduced Motion

Under `prefers-reduced-motion: reduce`:
- All Framer Motion animations render at final state immediately.
- No transforms (translateY, scale).
- CSS transitions reduced to opacity only.
- Hover states retain color changes but remove transforms (no `translateY(-2px)` on cards).
- Counter animations show final value immediately.

### 9.6 Screen Reader Flow

Screen reader users experience:
1. Skip-nav announcement
2. Header navigation with "Solutions" marked as current page
3. `<h1>` -- "One platform. Every type of trip. Every organization protected." establishes page topic
4. Subtext provides context about all four organization types
5. SR-only `<h2>` -- "Solutions by organization type" announces the card section
6. Four `<h3>` headings for each segment, each within a descriptively labeled link
7. `<h2>` -- "Regardless of your organization type..." introduces universal value
8. Three `<h3>` value cards with descriptive link text
9. Trust metrics announced with full `aria-label` context
10. `<h2>` -- "Ready to protect your next trip?" final CTA
11. Footer navigation

---

## 10. Performance Budget

### 10.1 LCP Strategy

**LCP candidate**: Hero `<h1>` text ("One platform. Every type of trip. Every organization protected.")

**Optimization**:
- Headline is SSG-rendered in HTML (no client-side rendering dependency).
- Plus Jakarta Sans weight 700 loaded via `next/font/google` with `display: 'swap'`.
- No animation delay on headline (fadeUp at 100ms is enhancement only -- text visible in SSG HTML at 0ms).
- No heavy visual composition in hero (no map, no panels).

**Target**: LCP < 1.2s on simulated 3G.

### 10.2 CLS Strategy

- No images on this page (all SVG icons and CSS).
- Header height transition handled with `transform`, not layout shift.
- No dynamic content injection above the fold.
- Font loading uses `display: swap` with matched fallback metrics.

**Target**: CLS < 0.02.

### 10.3 Bundle Strategy

- No MapLibre GL JS on this page.
- Framer Motion: Tree-shaken, only `fadeUp`, `fadeIn`, `cardReveal`, `staggerContainer` presets.
- No interactive calculators, forms, or accordions on this page.
- Minimal JS footprint -- this is primarily a static routing page.

**Target**: Initial JS bundle < 80KB gzipped. Total page weight < 200KB.

### 10.4 Image Strategy

- No raster images anywhere on this page.
- All icons via Lucide React (SVG, tree-shaken).
- No stock photography.
- No background images (CSS gradients only).

---

## Appendix A: Complete Content Inventory

Every real content string used on this page, section by section, for copy review.

### Hero
- Eyebrow: "SOLUTIONS BY ORGANIZATION TYPE"
- Headline: "One platform. Every type of trip. Every organization protected."
- Subtext: "Schools, universities, churches, and businesses trust SafeTrekr to professionally review every trip, score every risk, and document every safety decision."
- CTA: "Find Your Solution"

### Segment Cards

**K-12 Schools and Districts**
- Title: "K-12 Schools and Districts"
- Badges: "FERPA", "COPPA"
- Description: "Every field trip deserves the same safety rigor as a commercial flight. SafeTrekr gives your district a professional analyst review of every destination, government-sourced risk intelligence, and board-ready documentation that proves due diligence -- starting at $15 per student."
- CTA: "Learn More"

**Higher Education**
- Title: "Higher Education"
- Badges: "CLERY ACT", "FERPA"
- Description: "Study abroad and international program safety backed by institutional-grade risk assessment. SafeTrekr provides your risk management office and general counsel with professionally reviewed, tamper-evident documentation for every program trip -- from spring break service trips to semester-long study abroad."
- CTA: "Learn More"

**Churches and Mission Organizations**
- Title: "Churches and Mission Organizations"
- Badges: "DUTY OF CARE"
- Description: "Mission trip safety that goes beyond good intentions. SafeTrekr gives your church professional safety analysis for every mission field, government risk intelligence for every destination, and insurance-ready documentation that satisfies your carrier and your board -- because stewardship includes preparation."
- CTA: "Learn More"

**Corporate and Sports Teams**
- Title: "Corporate and Sports Teams"
- Badges: "DUTY OF CARE", "OSHA"
- Description: "Professional duty of care documentation for business travel and team transportation. SafeTrekr delivers the same analyst-reviewed, evidence-documented trip safety that enterprise organizations expect -- built for mid-market companies and athletic programs without enterprise budgets."
- CTA: "Learn More"

### Universal Value Proposition
- Eyebrow: "INCLUDED WITH EVERY TRIP"
- Headline: "Regardless of your organization type, every trip receives the same standard of professional safety review."
- Card 1 Title: "Professional Analyst Review"
- Card 1 Description: "A trained safety analyst reviews every trip your organization takes -- across 17 dimensions, from venue safety to emergency evacuation planning. No algorithms. No automation. A real analyst who flags what needs attention and documents what is ready."
- Card 1 Link: "Explore the review process"
- Card 2 Title: "Government Risk Intelligence"
- Card 2 Description: "Monte Carlo risk scoring sourced from 5 government databases: NOAA weather data, USGS seismic monitoring, CDC health advisories, GDACS disaster alerts, and ReliefWeb humanitarian reports. Probability-weighted, not opinion-based."
- Card 2 Link: "See how scoring works"
- Card 3 Title: "Trip Safety Binder"
- Card 3 Description: "Audit-ready documentation with SHA-256 hash-chain integrity. Every finding, every recommendation, every emergency contact, every risk score -- compiled into a tamper-evident binder that satisfies your board, your insurance carrier, and your legal team."
- Card 3 Link: "See a sample binder"

### Trust Metrics Strip
- Stat 1: "5" / "GOVERNMENT INTEL SOURCES"
- Stat 2: "17" / "SAFETY REVIEW SECTIONS"
- Stat 3: "3-5" / "DAY TURNAROUND"
- Stat 4: "AES-256" / "ENCRYPTION STANDARD"
- Stat 5: "SHA-256" / "EVIDENCE CHAIN"
- Source attribution: "Data sourced from: NOAA | USGS | CDC | GDACS | ReliefWeb"

### Final CTA Banner
- Headline: "Ready to protect your next trip?"
- Body: "See how SafeTrekr delivers professional safety review, government intelligence, and audit-ready documentation for your organization."
- CTA Primary: "Get a Demo"
- CTA Secondary: "See How It Works"

---

## Appendix B: Component Inventory

| Component | Count | Section |
|-----------|:-----:|---------|
| `SiteHeader` | 1 | Header |
| `Eyebrow` | 3 | Hero, Value Prop, Trust Strip (implicit) |
| `Button` (ghost) | 1 | Hero CTA |
| `SegmentCardLarge` | 4 | Segment Cards |
| `Badge` (secondary) | 7 | Segment Cards (regulatory badges) |
| `FeatureCard` | 3 | Universal Value Prop |
| `StatCard` | 5 | Trust Metrics Strip |
| `TrustMetricsStrip` | 1 | Trust Metrics Strip |
| `CTABand` (dark variant) | 1 | Final CTA |
| `Button` (primary-on-dark) | 1 | Final CTA |
| `Button` (link, dark) | 1 | Final CTA |
| `SiteFooter` | 1 | Footer |

**New component**: `SegmentCardLarge` -- purpose-built for this page. Not a shared design system component. Lives in `components/marketing/segment-card-large.tsx`.

---

## Appendix C: Link Inventory

| Link Text | Destination | Section | Type |
|-----------|-------------|---------|------|
| SafeTrekr (logo) | `/` | Header | Internal |
| Platform (nav) | `/platform` | Header | Internal |
| Solutions (nav) | `/solutions` | Header | Internal (current) |
| How It Works (nav) | `/how-it-works` | Header | Internal |
| Pricing (nav) | `/pricing` | Header | Internal |
| Resources (nav) | `/resources` | Header | Internal |
| Sign In | `https://app.safetrekr.com` | Header | External |
| Get a Demo (nav) | `/demo` | Header | Internal |
| Find Your Solution | `#segment-cards` | Hero | Anchor |
| K-12 Schools and Districts | `/solutions/k12` | Segment Cards | Internal |
| Higher Education | `/solutions/higher-education` | Segment Cards | Internal |
| Churches and Mission Organizations | `/solutions/churches` | Segment Cards | Internal |
| Corporate and Sports Teams | `/solutions/corporate` | Segment Cards | Internal |
| Explore the review process | `/platform/analyst-review` | Value Prop | Internal |
| See how scoring works | `/platform/risk-intelligence` | Value Prop | Internal |
| See a sample binder | `/platform/safety-binder` | Value Prop | Internal |
| Get a Demo (CTA) | `/demo` | Final CTA | Internal |
| See How It Works (CTA) | `/how-it-works` | Final CTA | Internal |
| [Footer links] | [Various] | Footer | Internal/External |

---

## Appendix D: SEO Metadata

```html
<title>Solutions by Organization Type | SafeTrekr</title>
<meta name="description" content="SafeTrekr provides professional trip safety review and evidence documentation for K-12 schools, higher education, churches, and corporate organizations. Find the right solution for your organization." />
<meta property="og:title" content="Solutions by Organization Type | SafeTrekr" />
<meta property="og:description" content="Professional trip safety review for schools, universities, churches, and businesses. Every trip reviewed. Every risk scored. Every document audit-ready." />
<meta property="og:url" content="https://safetrekr.com/solutions" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://safetrekr.com/og/solutions.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="canonical" href="https://safetrekr.com/solutions" />
```

**OG Image specification**: 1200x630px. SafeTrekr logo (horizontal-dark, 48px) top-left. Headline: "Solutions by Organization Type" in Plus Jakarta Sans 700, 48px. Four organization type icons in a row. Background: `background` (#e7ecee). Brand accent: `primary-500` rule line.
