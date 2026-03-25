# Mockup Specification: Analyst Safety Review Feature Page

**URL**: `/platform/analyst-review`
**Version**: 1.0
**Date**: 2026-03-24
**Status**: HIGH-FIDELITY SPEC -- Ready for Implementation
**Page Type**: Feature Page (SSG)
**Hierarchy Level**: L2
**JSON-LD**: FAQPage (8 Q&As), Service (AnalystSafetyReview)
**Breadcrumb**: `Home > Platform > Analyst Safety Review`
**Dark Sections**: 2 (Who Are the Analysts, Conversion CTA)
**Estimated Scroll Depth**: ~10 viewports (desktop), ~18 viewports (mobile)
**Template Role**: FEATURE TEMPLATE -- This page defines the reusable structural pattern for all 6 feature pages (`/platform/*`). Sections marked `[TEMPLATE]` are structurally identical across feature pages with swapped content. Sections marked `[UNIQUE]` are specific to the analyst-review page.

---

## Design Intent

This is SafeTrekr's number-one differentiator page. Every competitor comparison, every sales conversation, every board presentation lands on this truth: no other platform assigns a trained safety analyst to review every trip across 17 structured sections. This page exists to make that claim undeniable through specificity.

The page follows a narrative arc: what is an analyst review (hero) --> who conducts it (credibility) --> what exactly do they evaluate (the 17-section grid, interactive) --> what does the process look like (walkthrough) --> what do you receive (sample output) --> how long does it take (timeline) --> how does this compare to doing it yourself (comparison) --> common questions (FAQ) --> call to action.

The visual strategy uses the interactive 17-section review grid as the gravitational center of the page. This is the section visitors screenshot, share with colleagues, and reference in board presentations. The expand/collapse interaction rewards curiosity without overwhelming the scanners.

---

## Feature Template Architecture

This page establishes the structural pattern for all `/platform/*` feature pages. Each feature page shares these invariant structural elements:

| Section | Type | Notes |
|---------|------|-------|
| Hero | `[TEMPLATE]` | Eyebrow + headline + subheadline + dual CTA. Content swapped per feature. |
| Feature Deep-Dive | `[UNIQUE]` | 1-3 sections specific to this feature. For analyst-review: Who Are the Analysts + 17-Section Grid. |
| Process / Walkthrough | `[TEMPLATE]` | Shows the user journey through this specific feature. Reusable layout, content swapped. |
| Output / Deliverable Preview | `[TEMPLATE]` | DocumentPreview or product screenshot. Same layout, swapped content. |
| Timeline | `[TEMPLATE]` | Horizontal/vertical process timeline. Same component, swapped step content. |
| Comparison | `[TEMPLATE]` | SafeTrekr vs. alternative approach. Same table layout, swapped rows. |
| FAQ | `[TEMPLATE]` | FAQSection component. 6-8 feature-specific questions. |
| CTA Band | `[TEMPLATE]` | CTABand `variant="dark"`. Same layout, feature-specific headline. |

Developers should extract the shared layout into a `FeaturePageLayout` component that accepts content props for each section slot.

---

## Page-Level Specifications

### Meta

| Property | Value |
|----------|-------|
| `<title>` | Analyst Safety Review -- SafeTrekr |
| `meta description` | Every trip professionally reviewed across 17 safety sections by a trained analyst. Destination safety, transportation, emergency preparedness, and compliance -- nothing missed. |
| `og:title` | Analyst Safety Review: 17 Sections, Nothing Missed |
| `og:description` | SafeTrekr assigns a trained safety analyst to every trip. 17 structured review sections. 5 government data sources. Professional findings and recommendations delivered in your Safety Binder. |
| `og:image` | `/og/analyst-review.png` (1200x630, 17-section grid visual with category badges) |
| `canonical` | `https://safetrekr.com/platform/analyst-review` |

### Performance Budget

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| CLS | < 0.1 |
| FID | < 100ms |
| Total JS | < 160KB (gzipped) -- accordion interaction adds ~8KB |
| Total images | < 350KB (optimized WebP/AVIF) |

### Scroll-Triggered Animation Strategy

All sections use `IntersectionObserver` at 20% threshold via Framer Motion `whileInView`. Every animation respects `prefers-reduced-motion` -- reduced motion users see final states immediately with opacity-only transitions. The interactive 17-section grid does NOT animate individual cards on scroll (too many elements); instead, each category group fades in as a unit.

---

## Section 1: Hero `[TEMPLATE]`

### Layout

```
+============================================================================+
|                          [SiteHeader - sticky]                             |
+============================================================================+
|                                                                            |
|  bg-background                                                             |
|  pt-24 pb-16 lg:pt-28 lg:pb-24                                            |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12          |  |
|  |                                                                      |  |
|  |  [Breadcrumb]                                                       |  |
|  |  <nav aria-label="Breadcrumb">                                      |  |
|  |  Home > Platform > Analyst Safety Review                            |  |
|  |  text-body-sm text-muted-foreground mb-8                            |  |
|  |  Current page: text (not link), aria-current="page"                 |  |
|  |  Mobile (< 640px): "< Back to Platform"                            |  |
|  |                                                                      |  |
|  |  [2-Column Hero Layout]                                             |  |
|  |  grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center     |  |
|  |                                                                      |  |
|  |  LEFT COLUMN (Text):                                                |  |
|  |  +-------------------------------+                                  |  |
|  |  |                               |                                  |  |
|  |  |  EYEBROW ---- "ANALYST REVIEW"|                                  |  |
|  |  |  with AnalystReview icon       |                                  |  |
|  |  |  (14px, primary-700)           |                                  |  |
|  |  |  text-eyebrow text-primary-700 |                                  |  |
|  |  |  uppercase tracking-[0.08em]   |                                  |  |
|  |  |  mb-4                          |                                  |  |
|  |  |                               |                                  |  |
|  |  |  HEADLINE ----                 |                                  |  |
|  |  |  "Every Trip Reviewed          |                                  |  |
|  |  |   by a Safety Analyst."        |                                  |  |
|  |  |  text-display-lg               |                                  |  |
|  |  |  text-foreground               |                                  |  |
|  |  |  font-display font-700         |                                  |  |
|  |  |  max-w-[20ch]                  |                                  |  |
|  |  |  mb-6                          |                                  |  |
|  |  |                               |                                  |  |
|  |  |  SUBHEADLINE ----              |                                  |  |
|  |  |  "No algorithm. No checklist.  |                                  |  |
|  |  |  A trained professional reviews|                                  |  |
|  |  |  your trip across 17 structured|                                  |  |
|  |  |  safety sections -- from       |                                  |  |
|  |  |  destination intelligence to   |                                  |  |
|  |  |  emergency preparedness to     |                                  |  |
|  |  |  compliance documentation."    |                                  |  |
|  |  |  text-body-lg                   |                                  |  |
|  |  |  text-muted-foreground          |                                  |  |
|  |  |  font-body max-w-prose          |                                  |  |
|  |  |  mb-10                          |                                  |  |
|  |  |                               |                                  |  |
|  |  |  [CTA Group]                    |                                  |  |
|  |  |  flex flex-col sm:flex-row gap-4|                                  |  |
|  |  |  +-------------------------+   |                                  |  |
|  |  |  | See a Sample Review     |   |                                  |  |
|  |  |  | Button variant="primary"|   |                                  |  |
|  |  |  | size="lg" (h-13, px-8)  |   |                                  |  |
|  |  |  | -> /resources/          |   |                                  |  |
|  |  |  |    sample-binders       |   |                                  |  |
|  |  |  +-------------------------+   |                                  |  |
|  |  |  +-------------------------+   |                                  |  |
|  |  |  | Request a Demo          |   |                                  |  |
|  |  |  | Button variant=         |   |                                  |  |
|  |  |  |  "secondary"            |   |                                  |  |
|  |  |  | size="lg" (h-13, px-8)  |   |                                  |  |
|  |  |  | -> /demo                |   |                                  |  |
|  |  |  +-------------------------+   |                                  |  |
|  |  |                               |                                  |  |
|  |  +-------------------------------+                                  |  |
|  |                                                                      |  |
|  |  RIGHT COLUMN (Visual Composition):                                 |  |
|  |  +-------------------------------+                                  |  |
|  |  |                               |                                  |  |
|  |  |  [Hero Composition Panel]      |                                  |  |
|  |  |  rounded-2xl shadow-xl         |                                  |  |
|  |  |  bg-card border border-border  |                                  |  |
|  |  |  p-6 lg:p-8                    |                                  |  |
|  |  |  max-w-[480px]                 |                                  |  |
|  |  |  lg:ml-auto                    |                                  |  |
|  |  |                               |                                  |  |
|  |  |  [Review Summary Card]         |                                  |  |
|  |  |  +--------------------------+  |                                  |  |
|  |  |  | EYEBROW: "ANALYST REVIEW"|  |                                  |  |
|  |  |  | text-eyebrow             |  |                                  |  |
|  |  |  | text-primary-700 mb-2    |  |                                  |  |
|  |  |  |                          |  |                                  |  |
|  |  |  | Badge: "In Progress"     |  |                                  |  |
|  |  |  | variant="default" mb-4   |  |                                  |  |
|  |  |  |                          |  |                                  |  |
|  |  |  | "Spring Field Trip"      |  |                                  |  |
|  |  |  | text-heading-sm          |  |                                  |  |
|  |  |  | text-foreground mb-1     |  |                                  |  |
|  |  |  |                          |  |                                  |  |
|  |  |  | "Springfield USD"        |  |                                  |  |
|  |  |  | text-body-sm             |  |                                  |  |
|  |  |  | text-muted-foreground    |  |                                  |  |
|  |  |  | mb-6                     |  |                                  |  |
|  |  |  |                          |  |                                  |  |
|  |  |  | [Progress Bar]           |  |                                  |  |
|  |  |  | h-2 rounded-full         |  |                                  |  |
|  |  |  | bg-primary-100           |  |                                  |  |
|  |  |  | Inner: w-[70%]           |  |                                  |  |
|  |  |  | bg-primary-500           |  |                                  |  |
|  |  |  | rounded-full             |  |                                  |  |
|  |  |  | mb-2                     |  |                                  |  |
|  |  |  |                          |  |                                  |  |
|  |  |  | "12 of 17 sections       |  |                                  |  |
|  |  |  |  reviewed"               |  |                                  |  |
|  |  |  | text-body-xs             |  |                                  |  |
|  |  |  | text-muted-foreground    |  |                                  |  |
|  |  |  | mb-6                     |  |                                  |  |
|  |  |  |                          |  |                                  |  |
|  |  |  | [Section Checklist       |  |                                  |  |
|  |  |  |  Preview -- 5 items]     |  |                                  |  |
|  |  |  | space-y-2                |  |                                  |  |
|  |  |  |                          |  |                                  |  |
|  |  |  | [x] Destination Safety   |  |                                  |  |
|  |  |  |     Check (primary-500)  |  |                                  |  |
|  |  |  | [x] Transportation       |  |                                  |  |
|  |  |  |     Check (primary-500)  |  |                                  |  |
|  |  |  | [x] Emergency Prep       |  |                                  |  |
|  |  |  |     Check (primary-500)  |  |                                  |  |
|  |  |  | [ ] Compliance Docs      |  |                                  |  |
|  |  |  |     Circle (border)      |  |                                  |  |
|  |  |  | [ ] Final Approval       |  |                                  |  |
|  |  |  |     Circle (border)      |  |                                  |  |
|  |  |  |                          |  |                                  |  |
|  |  |  | Each item:               |  |                                  |  |
|  |  |  | flex items-center gap-3  |  |                                  |  |
|  |  |  | Completed: text-foreground|  |                                  |  |
|  |  |  | Pending: text-muted-fg   |  |                                  |  |
|  |  |  | text-body-sm             |  |                                  |  |
|  |  |  +--------------------------+  |                                  |  |
|  |  |                               |                                  |  |
|  |  +-------------------------------+                                  |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### Animation

| Element | Preset | Delay |
|---------|--------|-------|
| Breadcrumb | `fadeIn` | 0ms |
| Eyebrow | `fadeUp` | 80ms |
| Headline | `fadeUp` | 160ms |
| Subheadline | `fadeUp` | 240ms |
| CTA group | `fadeUp` | 320ms |
| Hero composition panel | `scaleIn` | 400ms |
| Progress bar fill | Custom: `width 0% to 70%` | 800ms, `ease-spring`, triggers after panel visible |
| Checklist items | `checklistReveal` | Stagger 60ms each, after progress bar |

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 640px) | Single column, stacked. Visual below text. `pt-16 pb-12`. Headline clamps to 34px. CTAs stack full-width. Hero panel full-width, `max-w-none`. Breadcrumb collapses to "< Back to Platform". |
| sm (640px) | CTAs go horizontal. |
| md (768px) | Hero panel `max-w-[400px] mx-auto`. |
| lg (1024px) | 2-column grid activates. `pt-28 pb-24`. Headline at full 56px. Panel aligns right with `ml-auto`. |
| xl (1280px) | Container centered with growing side margins. |

### Accessibility

- `<section aria-labelledby="hero-heading">`
- Headline: `<h1 id="hero-heading">`
- Progress bar: `role="progressbar" aria-valuenow="12" aria-valuemin="0" aria-valuemax="17" aria-label="Review progress: 12 of 17 sections reviewed"`
- Checklist: `role="list"`, each item `role="listitem"`. Completed items include `aria-label` with "Completed:" prefix.
- Hero composition panel: decorative context, but all text within is accessible
- Skip-nav link targets `#main-content` placed at top of `<main>`

---

## Section 2: Who Are the Analysts `[UNIQUE]` (DARK SECTION 1 of 2)

### Component

`<DarkAuthoritySection>` wrapping analyst credibility content.

### Layout

```
+============================================================================+
|                                                                            |
|  bg-secondary [data-theme="dark"]                                          |
|  py-24 lg:py-32                                                            |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12          |  |
|  |                                                                      |  |
|  |  [Section Header -- center-aligned]                                 |  |
|  |  EYEBROW: "YOUR SAFETY TEAM"                                        |  |
|  |  text-eyebrow text-dark-accent uppercase tracking-[0.08em]          |  |
|  |  mb-4                                                               |  |
|  |                                                                      |  |
|  |  HEADLINE: "Trained Analysts.                                       |  |
|  |             Not Algorithms."                                         |  |
|  |  text-display-md text-dark-text-primary max-w-[28ch] mx-auto        |  |
|  |  text-center mb-6                                                   |  |
|  |                                                                      |  |
|  |  SUBTEXT: "Every SafeTrekr review is conducted by a trained          |  |
|  |  safety analyst -- not generated by software, not assembled          |  |
|  |  from templates, not outsourced to a call center. Your analyst       |  |
|  |  reads every detail of your trip plan and evaluates it against       |  |
|  |  real-world conditions."                                             |  |
|  |  text-body-lg text-dark-text-secondary max-w-prose mx-auto          |  |
|  |  text-center mb-16                                                  |  |
|  |                                                                      |  |
|  |  [Analyst Credential Cards -- 3-across]                             |  |
|  |  grid sm:grid-cols-2 lg:grid-cols-3 gap-6                           |  |
|  |  mb-16                                                              |  |
|  |                                                                      |  |
|  |  +-------------------+ +-------------------+ +-------------------+  |  |
|  |  | Credential Card 1 | | Credential Card 2 | | Credential Card 3 | |  |
|  |  +-------------------+ +-------------------+ +-------------------+  |  |
|  |                                                                      |  |
|  |  [Analyst Process Strip]                                            |  |
|  |  See detailed spec below                                            |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### Analyst Credential Card Anatomy

```
+------------------------------------------+
|  bg-dark-surface rounded-xl              |
|  border border-dark-border               |
|  p-6 lg:p-8                              |
|                                          |
|  [Icon Container]                        |
|  h-12 w-12 rounded-lg                    |
|  bg-dark-accent/10 mb-6                  |
|  flex items-center justify-center        |
|  Icon: h-6 w-6 text-dark-accent         |
|                                          |
|  [Title]                                 |
|  text-heading-sm text-dark-text-primary  |
|  font-600 mb-3                           |
|                                          |
|  [Description]                           |
|  text-body-md text-dark-text-secondary   |
|  max-w-[45ch]                            |
|                                          |
+------------------------------------------+
```

### Credential Card Content

| # | Icon (Lucide) | Title | Description |
|---|---------------|-------|-------------|
| 1 | `GraduationCap` | Professionally Trained | Every analyst completes a structured training program covering risk assessment methodology, government intelligence interpretation, and SafeTrekr's 17-section review framework before conducting a single review. |
| 2 | `BookOpen` | Standardized Methodology | Analysts follow a documented, repeatable methodology for every review. The same 17 sections. The same evaluation criteria. The same evidence standards. Consistency you can audit. |
| 3 | `UserCheck` | Dedicated Assignment | Your trip is assigned to a specific analyst who owns the review from start to finish. One person. Full accountability. Direct findings and recommendations -- not a committee output. |

### Analyst Process Strip

```
mt-12
bg-dark-surface rounded-xl border border-dark-border
p-6 lg:p-8

grid sm:grid-cols-2 lg:grid-cols-4 gap-6

Each Process Item:
+------------------------------------------+
|  text-center                             |
|                                          |
|  [Number]                                |
|  h-10 w-10 rounded-full mx-auto         |
|  bg-dark-accent/20                       |
|  text-dark-accent font-600              |
|  text-body-lg                            |
|  flex items-center justify-center        |
|  mb-4                                    |
|                                          |
|  [Step Title]                            |
|  text-heading-sm text-dark-text-primary  |
|  font-600 mb-2                           |
|                                          |
|  [Step Description]                      |
|  text-body-sm text-dark-text-secondary   |
|                                          |
+------------------------------------------+
```

### Analyst Process Strip Content

| # | Title | Description |
|---|-------|-------------|
| 1 | Trip Assigned | Your submission is routed to an available analyst with relevant expertise for your destination and trip type. |
| 2 | Full-Context Read | The analyst reads your complete trip plan -- destination, dates, participants, activities, logistics, and any concerns you flagged. |
| 3 | 17-Section Evaluation | Each section is evaluated against current conditions, government intelligence data, and SafeTrekr's evidence standards. |
| 4 | Findings Delivered | The analyst writes specific findings and actionable recommendations. No boilerplate. Every finding references your trip. |

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Entire dark section | `fadeIn` | Background fades in |
| Eyebrow | `fadeUp` | 100ms delay |
| Headline | `fadeUp` | 180ms delay |
| Subtext | `fadeUp` | 260ms delay |
| Credential cards | `staggerContainer` + `cardReveal` | Cards stagger at 100ms |
| Process strip | `fadeUp` | After cards complete |
| Process items | `staggerContainer` | Items stagger at 80ms |

### Responsive Behavior

| Breakpoint | Grid |
|------------|------|
| base (< 640px) | Credential cards: `grid-cols-1`. Process items: `grid-cols-1`. |
| sm (640px) | Credential cards: `grid-cols-2` (last card full-width). Process items: `grid-cols-2`. |
| lg (1024px) | Credential cards: `grid-cols-3`. Process items: `grid-cols-4`. |

### Accessibility

- `<section aria-labelledby="analysts-heading">`
- Heading: `<h2 id="analysts-heading">`
- Credential cards: Each `<article>` with `<h3>`
- Process items: `role="list"` on container, `role="listitem"` on each
- CTA link to analyst profiles page: `<a href="/about/analysts">` with descriptive text
- All text meets 7.0:1+ contrast on secondary background

### Cross-Link

Below the process strip, a text link:

```
mt-8 text-center
"Meet our full analyst team"
text-body-md text-dark-accent font-500
hover:underline
-> /about/analysts
ArrowRight icon (16px) inline, translates 4px on hover
```

---

## Section 3: Interactive 17-Section Review Grid `[UNIQUE]`

This is the centerpiece of the page. The 17 sections are organized into 5 categories with expand/collapse accordion behavior. Each section shows a summary view (always visible) and an expanded detail view (on click).

### Layout

```
+============================================================================+
|                                                                            |
|  bg-background                                                             |
|  py-24 lg:py-32                                                            |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12          |  |
|  |                                                                      |  |
|  |  [Section Header -- center-aligned]                                 |  |
|  |  EYEBROW: "THE 17 SECTIONS"                                         |  |
|  |  with ClipboardCheck icon (14px, primary-700)                       |  |
|  |  text-eyebrow text-primary-700 uppercase mb-4                       |  |
|  |                                                                      |  |
|  |  HEADLINE: "Every Detail Evaluated."                                |  |
|  |  text-display-md text-foreground max-w-[28ch] mx-auto text-center   |  |
|  |  mb-4                                                               |  |
|  |                                                                      |  |
|  |  SUBTEXT: "Your analyst reviews your trip across 17 structured      |  |
|  |  sections organized into 5 categories. Expand any section to        |  |
|  |  see exactly what is evaluated and why."                            |  |
|  |  text-body-lg text-muted-foreground max-w-prose mx-auto             |  |
|  |  text-center mb-16                                                  |  |
|  |                                                                      |  |
|  |  [Category Accordion Groups]                                        |  |
|  |  space-y-8                                                          |  |
|  |                                                                      |  |
|  |  +----------------------------------------------------------------+ |  |
|  |  | CATEGORY 1: TRIP PLANNING (4 sections)                         | |  |
|  |  |  See detailed spec below                                       | |  |
|  |  +----------------------------------------------------------------+ |  |
|  |                                                                      |  |
|  |  +----------------------------------------------------------------+ |  |
|  |  | CATEGORY 2: DESTINATIONS & VENUES (3 sections)                 | |  |
|  |  +----------------------------------------------------------------+ |  |
|  |                                                                      |  |
|  |  +----------------------------------------------------------------+ |  |
|  |  | CATEGORY 3: SAFETY & INTELLIGENCE (3 sections)                 | |  |
|  |  +----------------------------------------------------------------+ |  |
|  |                                                                      |  |
|  |  +----------------------------------------------------------------+ |  |
|  |  | CATEGORY 4: EMERGENCY PREPAREDNESS (2 sections)                | |  |
|  |  +----------------------------------------------------------------+ |  |
|  |                                                                      |  |
|  |  +----------------------------------------------------------------+ |  |
|  |  | CATEGORY 5: DOCUMENTATION & COMPLIANCE (5 sections)            | |  |
|  |  +----------------------------------------------------------------+ |  |
|  |                                                                      |  |
|  |  [Section Count Summary]                                            |  |
|  |  mt-12 text-center                                                  |  |
|  |  "17 sections. 5 categories. Every trip."                           |  |
|  |  text-body-lg text-muted-foreground font-500                        |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### Category Group Anatomy

Each category is a self-contained card that groups its sections.

```
+--------------------------------------------------------------------+
|  bg-card rounded-xl border border-border                           |
|  shadow-card                                                       |
|  overflow-hidden                                                   |
|                                                                    |
|  [Category Header -- always visible]                               |
|  px-6 lg:px-8 py-5                                                |
|  flex items-center justify-between                                 |
|  border-b border-border                                            |
|                                                                    |
|  LEFT:                                                             |
|  flex items-center gap-4                                           |
|                                                                    |
|    [Category Badge]                                                |
|    Badge variant="default" size="sm"                               |
|    Shows section count, e.g. "4 SECTIONS"                          |
|                                                                    |
|    [Category Name]                                                 |
|    text-heading-sm text-foreground font-600                        |
|    e.g. "Trip Planning"                                            |
|                                                                    |
|  RIGHT:                                                            |
|  text-body-sm text-muted-foreground                                |
|  "Sections 1-4" (range indicator)                                  |
|                                                                    |
|  [Section Items -- inside category]                                |
|  divide-y divide-border                                            |
|                                                                    |
|    [Section Item 1 -- collapsed]                                   |
|    [Section Item 2 -- collapsed]                                   |
|    [Section Item 3 -- expanded]                                    |
|    [Section Item 4 -- collapsed]                                   |
|                                                                    |
+--------------------------------------------------------------------+
```

### Section Item Anatomy (Collapsed State)

```
+--------------------------------------------------------------------+
|  px-6 lg:px-8 py-4                                                 |
|  cursor-pointer                                                    |
|  hover:bg-primary-50/50                                            |
|  transition-colors duration-fast                                   |
|                                                                    |
|  [Accordion Trigger]                                               |
|  flex items-center gap-4 w-full                                    |
|                                                                    |
|    [Number Badge]                                                  |
|    h-7 w-7 rounded-full flex-shrink-0                              |
|    bg-primary-50 text-primary-700                                  |
|    text-body-xs font-600                                           |
|    flex items-center justify-center                                |
|    "1" / "2" / ... / "17"                                          |
|                                                                    |
|    [Icon]                                                          |
|    h-5 w-5 text-primary-500 flex-shrink-0                          |
|    (Lucide icon per section)                                       |
|                                                                    |
|    [Section Title]                                                 |
|    text-body-lg text-foreground font-500                           |
|    flex-1                                                          |
|    e.g. "Overview"                                                 |
|                                                                    |
|    [Chevron]                                                       |
|    ChevronDown h-5 w-5 text-muted-foreground                      |
|    transition-transform duration-normal                            |
|    Expanded: rotate-180                                            |
|                                                                    |
+--------------------------------------------------------------------+
```

### Section Item Anatomy (Expanded State)

```
+--------------------------------------------------------------------+
|  [Trigger -- same as collapsed but active]                         |
|  bg-primary-50/30                                                  |
|  Chevron rotated 180deg                                            |
|                                                                    |
|  [Expanded Content]                                                |
|  px-6 lg:px-8 pb-6                                                |
|  pl-[calc(1.5rem+1.75rem+1rem+1.25rem+1rem)]                      |
|  (indented past number badge + icon to align with title)           |
|                                                                    |
|  [What the Analyst Evaluates]                                      |
|  text-body-md text-muted-foreground                                |
|  mb-4                                                              |
|  "Trip purpose, objectives, organizational context,                |
|   and overall scope of the travel plan."                           |
|                                                                    |
|  [Evaluation Detail List]                                          |
|  space-y-2 mb-4                                                    |
|  Each: flex items-start gap-2                                      |
|    Check icon (14px, primary-500)                                  |
|    text-body-sm text-foreground                                    |
|                                                                    |
|  [Why It Matters]                                                  |
|  mt-4 p-4 rounded-lg bg-primary-50/50                              |
|  border-l-2 border-primary-300                                     |
|                                                                    |
|  "WHY THIS MATTERS"                                                |
|  text-eyebrow text-primary-700 mb-2                                |
|                                                                    |
|  text-body-sm text-muted-foreground                                |
|  (Explanation of why this section is critical                      |
|   for the safety of the trip)                                      |
|                                                                    |
+--------------------------------------------------------------------+
```

### Interaction Behavior

- **Accordion type**: `type="multiple"` -- multiple sections can be open simultaneously within a category. Categories themselves are always expanded (no category-level collapse).
- **Default state on load**: All sections collapsed. First section of the first category auto-expands after 500ms delay (draws attention to the interaction pattern).
- **Keyboard**: `Enter` or `Space` toggles section. `Tab` moves between section triggers. Arrow keys navigate within a category group.
- **Animation**: Content expands with `duration-moderate` (300ms), `ease-default`. Chevron rotates with `duration-normal` (200ms).
- **URL hash**: Expanding a section updates the URL hash (e.g., `#section-8-safety`) without scroll. Direct navigation to a hash auto-expands that section and scrolls to it.

### Full 17-Section Content

**CATEGORY 1: TRIP PLANNING** (Sections 1-4)

**Section 1: Overview**
- Icon: `FileText`
- Evaluates: Trip purpose, objectives, organizational context, and overall scope of the travel plan.
- Detail items:
  - Stated trip objectives and educational or organizational goals
  - Group composition and organizational affiliation
  - Trip duration and seasonal timing considerations
  - Historical context if this is a recurring trip
- Why it matters: "A clear trip overview ensures the analyst understands the full context of your travel. Ambiguous objectives can mask risks that become apparent only when the purpose is well-defined."

**Section 2: Participants**
- Icon: `Users`
- Evaluates: Participant count, demographics, age ranges, special needs, medical considerations, and chaperone-to-participant ratios.
- Detail items:
  - Total participant count and age distribution
  - Chaperone-to-participant ratio against best-practice standards
  - Medical conditions, allergies, or mobility requirements
  - Experience level of participants for planned activities
  - Special accommodations or dietary needs
- Why it matters: "The participant profile directly determines risk thresholds. A group of 12-year-olds hiking requires fundamentally different safety planning than a corporate leadership retreat. Your analyst calibrates every finding to your specific group."

**Section 3: Itinerary**
- Icon: `Calendar`
- Evaluates: Day-by-day schedule, activity timing, transit windows, rest periods, and contingency buffers.
- Detail items:
  - Complete day-by-day activity schedule
  - Transit times between locations with realistic buffers
  - Rest periods and meal breaks
  - Free time windows and supervision plans
  - Schedule contingency for weather or disruption
- Why it matters: "Overpacked itineraries create fatigue-related risks. Tight transit windows leave no margin for delays. Your analyst evaluates whether the schedule is realistic and safe for your specific group."

**Section 4: Transportation**
- Icon: `Bus`
- Evaluates: Ground transportation providers, vehicle safety records, driver credentials, and route risk assessment.
- Detail items:
  - Ground transportation provider verification
  - Vehicle type, capacity, and safety equipment
  - Driver credential verification requirements
  - Route assessment including road conditions and construction
  - Backup transportation contingency
- Why it matters: "Transportation incidents are among the most common and preventable risks in group travel. Verifying provider safety records and assessing route conditions are foundational to any responsible trip plan."

**CATEGORY 2: DESTINATIONS & VENUES** (Sections 5-7)

**Section 5: Air Travel**
- Icon: `Plane`
- Evaluates: Airlines, airports, layover risks, baggage policies, and flight timing relative to destination conditions.
- Detail items:
  - Airline safety record and operational reliability
  - Airport security and accessibility at origin and destination
  - Layover duration, airport facilities, and connection risks
  - Arrival timing relative to local conditions and transportation availability
  - Group seating and baggage logistics for participant count
- Why it matters: "Missed connections, overnight layovers in unfamiliar airports, and arrival into destinations after dark create cascading risks. Your analyst evaluates the full air travel chain -- not just the ticket."

**Section 6: Lodging**
- Icon: `Building2`
- Evaluates: Accommodation safety ratings, fire egress, proximity to medical facilities, and neighborhood risk profile.
- Detail items:
  - Property safety certifications and inspection history
  - Fire egress routes and emergency assembly areas
  - Proximity to nearest hospital, urgent care, and pharmacy
  - Neighborhood safety profile including crime data
  - Room configuration for appropriate supervision and participant separation
- Why it matters: "Your group spends more hours at lodging than any other single location. Fire safety, neighborhood conditions, and proximity to medical care directly affect your duty-of-care posture."

**Section 7: Venues & Activities**
- Icon: `MapPin`
- Evaluates: Activity venues, crowd capacity, structural safety, historical incident records, and accessibility.
- Detail items:
  - Venue safety certifications and insurance documentation
  - Maximum occupancy and crowd management procedures
  - Activity-specific risk assessment (water sports, heights, equipment)
  - Historical incident records for the venue or activity type
  - Accessibility for participants with mobility or sensory needs
- Why it matters: "The venue's insurance paperwork does not tell you about the last three incidents at that zip-line course. Your analyst cross-references venue data with activity-specific risk profiles."

**CATEGORY 3: SAFETY & INTELLIGENCE** (Sections 8-10)

**Section 8: Destination Safety**
- Icon: `Shield`
- Evaluates: Destination-level safety assessment covering crime rates, political stability, natural hazard exposure, and health risks.
- Detail items:
  - Crime rate analysis for destination city and specific neighborhoods
  - Political stability assessment and civil unrest monitoring
  - Natural hazard exposure (seismic, weather, flood zones)
  - Health risk profile (disease prevalence, water safety, air quality)
  - Cultural safety considerations for your specific group demographics
- Why it matters: "This is where SafeTrekr's Risk Intelligence Engine is deployed. Your analyst combines government data from NOAA, USGS, CDC, GDACS, and ReliefWeb with Monte Carlo simulations to produce a probability-weighted risk score -- not a generic travel advisory."

**Section 9: Background Checks**
- Icon: `UserCheck`
- Evaluates: Verification requirements for chaperones, volunteers, and third-party providers in contact with participants.
- Detail items:
  - Background check requirements for chaperones and volunteers
  - Third-party provider credential verification
  - Compliance with organizational and regulatory screening policies
  - Documentation of completed screenings
  - Gap identification for any unverified personnel
- Why it matters: "For trips involving minors, background screening is not optional -- it is a legal and ethical baseline. Your analyst verifies that your screening practices meet the requirements of your organization type and destination."

**Section 10: Intelligence Alerts**
- Icon: `AlertTriangle`
- Evaluates: Active intelligence alerts from government sources covering weather, seismic, health, conflict, and humanitarian data.
- Detail items:
  - Active NOAA weather alerts for travel dates and region
  - USGS seismic and volcanic activity monitoring
  - CDC health advisories and outbreak notifications
  - GDACS disaster alerts and impact projections
  - ReliefWeb humanitarian situation reports
- Why it matters: "Conditions change between booking and departure. Your analyst reviews live intelligence data at the time of review and flags any active alerts that affect your trip timeline or destination."

**CATEGORY 4: EMERGENCY PREPAREDNESS** (Sections 11-12)

**Section 11: Emergency Preparedness**
- Icon: `Siren`
- Evaluates: Emergency action plans, evacuation routes, rally points, communication chains, and nearest medical facilities.
- Detail items:
  - Emergency action plan completeness and specificity
  - Evacuation routes from each venue and lodging
  - Rally point designations with GPS coordinates
  - Communication chain with backup contact methods
  - Nearest Level I and Level II trauma centers mapped
  - Emergency contact cards for every chaperone
- Why it matters: "The time to write an evacuation plan is not during an evacuation. Your analyst evaluates whether your emergency preparedness is specific, practiced, and realistic for every location on your itinerary."

**Section 12: Known Issues & Flags**
- Icon: `Flag`
- Evaluates: Known risks, flagged concerns, unresolved issues, and analyst-recommended mitigations requiring action.
- Detail items:
  - Open risk items requiring organizational action
  - Analyst-flagged concerns with severity rating
  - Recommended mitigations with implementation guidance
  - Items requiring resolution before departure
  - Historical issues from previous trips to same destination
- Why it matters: "This section is where your analyst tells you what needs to change. Every flag comes with a specific recommendation and a severity rating. These are not generic warnings -- they reference your trip."

**CATEGORY 5: DOCUMENTATION & COMPLIANCE** (Sections 13-17)

**Section 13: Required Documents**
- Icon: `FolderOpen`
- Evaluates: Required forms, waivers, permissions, insurance certificates, and regulatory compliance documentation.
- Detail items:
  - Permission and consent forms for all participants
  - Liability waivers appropriate to activities and jurisdiction
  - Insurance certificates from transportation and venue providers
  - Regulatory compliance documentation for destination
  - Organizational policy acknowledgment forms
- Why it matters: "Missing a single form can void your insurance coverage or create regulatory exposure. Your analyst verifies that your documentation package is complete for your specific trip type and destination."

**Section 14: Evidence Chain**
- Icon: `Lock`
- Evaluates: Tamper-evident evidence chain, SHA-256 hash verification, audit trail integrity, and record preservation.
- Detail items:
  - SHA-256 cryptographic hash generation for every binder page
  - Hash chain linking to ensure sequential integrity
  - Timestamp verification for every document modification
  - Audit trail completeness from submission through final approval
  - Long-term preservation strategy for compliance retention periods
- Why it matters: "If your safety documentation is ever questioned -- by an insurance carrier, by a board, by legal counsel -- you need proof it has not been modified after the fact. The evidence chain provides that proof, cryptographically."

**Section 15: Checklists**
- Icon: `CheckSquare`
- Evaluates: Pre-departure checklists, day-of checklists, post-trip checklists, and completion verification.
- Detail items:
  - Pre-departure preparation checklist with responsible party assignments
  - Day-of-departure verification checklist
  - Daily trip operation checklists
  - Post-trip documentation and debrief checklist
  - Completion tracking and sign-off requirements
- Why it matters: "Checklists prevent the most common oversight: assuming something was done because it was supposed to be done. Your analyst builds checklists specific to your trip with assigned owners for every item."

**Section 16: Packet Builder**
- Icon: `Package`
- Evaluates: Assembled trip packet including printed materials, digital distribution, chaperone copies, and administrative copies.
- Detail items:
  - Complete trip packet assembly and organization
  - Print-ready formatting for field use
  - Digital distribution to chaperone mobile devices
  - Administrative copies for organizational records
  - Insurance carrier documentation package
- Why it matters: "The best safety plan is worthless if chaperones cannot access it in the field. Your packet is assembled for real-world use -- printed copies, mobile access, and archival records."

**Section 17: Final Approval**
- Icon: `CircleCheck`
- Evaluates: Final review sign-off, organizational approval workflow, stakeholder acknowledgment, and release authorization.
- Detail items:
  - Analyst sign-off with professional attestation
  - Organizational approval workflow routing
  - Stakeholder acknowledgment and documentation
  - Outstanding item resolution verification
  - Release authorization for trip departure
- Why it matters: "Final approval closes the loop. Your analyst attests that the review is complete, flags are addressed, and documentation meets SafeTrekr's evidence standards. This is the professional sign-off that protects your organization."

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Section header | `fadeUp` stagger | Eyebrow/headline/subtext at 80ms intervals |
| Category groups | `fadeUp` | Each category card fades in independently at 20% intersection, staggered 120ms |
| Section items | None | No entrance animation -- they are within the card already. Accordion expand/collapse only. |
| Expanded content | Accordion expand | Height from 0 to auto, `duration-moderate`, `ease-default` |
| Detail items within expanded | `checklistReveal` | Stagger at 40ms after expand completes |

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 640px) | Category cards full-width. Section titles may wrap to 2 lines. Expanded content full-width with `px-4 pb-4`. Indent reduced. |
| sm (640px) | Minor padding adjustments. |
| lg (1024px) | Full padding `px-8`. Category header shows section range on right. |
| xl (1280px) | Container centered with growing side margins. |

### Accessibility

- `<section aria-labelledby="review-sections-heading">`
- Heading: `<h2 id="review-sections-heading">`
- Category names: `<h3>` elements
- Uses shadcn/ui `Accordion` primitive with `type="multiple" collapsible`
- Each section trigger: `aria-expanded="true|false"`, `aria-controls="section-{n}-content"`
- Each section content: `id="section-{n}-content"`, `role="region"`, `aria-labelledby="section-{n}-trigger"`
- Section numbers are visible text, not relying on visual position
- "Why This Matters" callout box: No special ARIA needed (it is standard text content within the region)
- Keyboard: `Tab` moves between triggers. `Enter`/`Space` toggles. Arrow keys navigate within category.

---

## Section 4: What a Review Covers -- Walkthrough `[TEMPLATE]`

### Layout

```
+============================================================================+
|                                                                            |
|  bg-card border-y border-border                                            |
|  py-24 lg:py-32                                                            |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12          |  |
|  |                                                                      |  |
|  |  [Section Header -- center-aligned]                                 |  |
|  |  EYEBROW: "THE REVIEW PROCESS"                                      |  |
|  |  with Route icon (14px, primary-700)                                |  |
|  |  text-eyebrow text-primary-700 uppercase mb-4                       |  |
|  |                                                                      |  |
|  |  HEADLINE: "What Happens After                                      |  |
|  |             You Submit Your Trip."                                   |  |
|  |  text-display-md text-foreground max-w-[28ch] mx-auto text-center   |  |
|  |  mb-4                                                               |  |
|  |                                                                      |  |
|  |  SUBTEXT: "Here is the step-by-step process your analyst follows    |  |
|  |  from the moment your trip is submitted."                           |  |
|  |  text-body-lg text-muted-foreground max-w-prose mx-auto             |  |
|  |  text-center mb-16                                                  |  |
|  |                                                                      |  |
|  |  [Walkthrough Steps -- Vertical Timeline]                           |  |
|  |  max-w-3xl mx-auto                                                  |  |
|  |                                                                      |  |
|  |  See detailed spec below                                            |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### Walkthrough Timeline

Uses `<TimelineStep>` components in a vertical sequence.

```
max-w-3xl mx-auto

[Timeline Structure]
Each step: flex gap-6

  [Timeline Indicator Column]
  flex-shrink-0 flex flex-col items-center

    [Circle]
    h-10 w-10 rounded-full
    bg-primary-100 border-2 border-primary-300
    text-primary-700 font-600 text-body-sm
    flex items-center justify-center

    [Connector Line]
    w-0.5 flex-1 bg-border
    (not rendered on last step)

  [Content Column]
  flex-1 pb-12 (last step: pb-0)

    [Step Title]
    text-heading-sm text-foreground font-600 mb-2

    [Step Description]
    text-body-md text-muted-foreground mb-4 max-w-prose

    [Time Badge] (optional)
    Badge variant="secondary" size="sm"
```

### Walkthrough Step Content

| # | Title | Description | Badge |
|---|-------|-------------|-------|
| 1 | You Submit Your Trip | You fill out the trip submission form with your destination, dates, participant details, planned activities, and logistics. No training required -- the form guides you through everything we need. | "~15 minutes" |
| 2 | Your Analyst Receives the Assignment | Your trip is assigned to a trained analyst based on destination expertise and trip type. They receive your complete submission and begin a full-context read of every detail. | "Within 24 hours" |
| 3 | Government Intelligence Is Pulled | The Risk Intelligence Engine queries NOAA, USGS, CDC, GDACS, and ReliefWeb for current conditions at your destination. Monte Carlo simulations produce probability-weighted risk scores. | "Automated" |
| 4 | 17-Section Review Begins | Your analyst works through every section of the review framework -- from destination safety to emergency preparedness to compliance documentation. Each section produces specific findings and recommendations. | "1-3 days" |
| 5 | Findings Are Written | Your analyst writes specific, actionable findings for your trip. Not templates. Not boilerplate. Every finding references your destination, your group, your itinerary. | "Included in review" |
| 6 | Your Safety Binder Is Assembled | All findings, recommendations, risk scores, emergency contacts, maps, and compliance documentation are compiled into your Trip Safety Binder with SHA-256 tamper-evident integrity. | "Delivered digitally" |
| 7 | You Receive Your Binder | Your complete, audit-ready Safety Binder is delivered. Share it with your board, your insurance carrier, your chaperones, and your participants' families. | "3-5 business days total" |

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Section header | `fadeUp` stagger | Eyebrow/headline/subtext at 80ms intervals |
| Timeline container | `staggerContainerSlow` | Parent orchestrator |
| Each step | `cardReveal` | Stagger at 120ms per step |
| Step badges | `fadeIn` | 100ms after parent step |

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 640px) | Timeline indicator column narrows. Circle `h-8 w-8`. Content `pb-10`. |
| lg (1024px) | Full padding. Max-width 3xl centered. |

### Accessibility

- `<section aria-labelledby="walkthrough-heading">`
- Heading: `<h2 id="walkthrough-heading">`
- Each step: `<article>` with `<h3>`
- Timeline indicator: `aria-hidden="true"` (decorative connectors)
- Time badges: `aria-label="Estimated time: 15 minutes"` etc.
- Step list uses `role="list"` with `role="listitem"` on each step

---

## Section 5: Sample Review Output Preview `[TEMPLATE]`

### Component

`<DocumentPreview>` with extended content specific to analyst review output.

### Layout

```
+============================================================================+
|                                                                            |
|  bg-background                                                             |
|  py-24 lg:py-32                                                            |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12          |  |
|  |                                                                      |  |
|  |  [2-Column Layout -- FeatureShowcase pattern, reversed]              |  |
|  |  grid lg:grid-cols-2 gap-12 lg:gap-20 items-center                  |  |
|  |                                                                      |  |
|  |  LEFT COLUMN (Visual -- on left because reversed):                  |  |
|  |  +-------------------------------+                                  |  |
|  |  |                               |                                  |  |
|  |  |  [DocumentPreview Component]   |                                  |  |
|  |  |                               |                                  |  |
|  |  |  Stacked-paper visual with:    |                                  |  |
|  |  |  - 2 offset back sheets        |                                  |  |
|  |  |  - Front sheet with content:   |                                  |  |
|  |  |                               |                                  |  |
|  |  |  +-------------------------+   |                                  |  |
|  |  |  | ANALYST REVIEW          |   |                                  |  |
|  |  |  | FINDINGS                |   |                                  |  |
|  |  |  | eyebrow text            |   |                                  |  |
|  |  |  |                         |   |                                  |  |
|  |  |  | Section 8:              |   |                                  |  |
|  |  |  | Destination Safety      |   |                                  |  |
|  |  |  | text-heading-sm         |   |                                  |  |
|  |  |  |                         |   |                                  |  |
|  |  |  | Risk Score: 23/100      |   |                                  |  |
|  |  |  | [===-----] (Low Risk)   |   |                                  |  |
|  |  |  |                         |   |                                  |  |
|  |  |  | Finding: "Destination   |   |                                  |  |
|  |  |  | crime rate is below     |   |                                  |  |
|  |  |  | national average.       |   |                                  |  |
|  |  |  | Nearest hospital is     |   |                                  |  |
|  |  |  | 4.2 miles from primary  |   |                                  |  |
|  |  |  | venue."                 |   |                                  |  |
|  |  |  | text-body-sm            |   |                                  |  |
|  |  |  |                         |   |                                  |  |
|  |  |  | Recommendation:         |   |                                  |  |
|  |  |  | "Confirm hospital route |   |                                  |  |
|  |  |  | with all chaperones     |   |                                  |  |
|  |  |  | before departure."      |   |                                  |  |
|  |  |  | text-body-sm italic     |   |                                  |  |
|  |  |  |                         |   |                                  |  |
|  |  |  | [Divider: route variant]|   |                                  |  |
|  |  |  |                         |   |                                  |  |
|  |  |  | SHA-256:                |   |                                  |  |
|  |  |  | a7f3c9...d4e2b1        |   |                                  |  |
|  |  |  | (font-mono, mono-sm)   |   |                                  |  |
|  |  |  +-------------------------+   |                                  |  |
|  |  |                               |                                  |  |
|  |  +-------------------------------+                                  |  |
|  |                                                                      |  |
|  |  RIGHT COLUMN (Text):                                               |  |
|  |  +-------------------------------+                                  |  |
|  |  |                               |                                  |  |
|  |  |  EYEBROW: "SAMPLE OUTPUT"     |                                  |  |
|  |  |  with EvidenceBinder icon      |                                  |  |
|  |  |  text-eyebrow text-primary-700 |                                  |  |
|  |  |  mb-4                          |                                  |  |
|  |  |                               |                                  |  |
|  |  |  HEADLINE:                     |                                  |  |
|  |  |  "See What Your                |                                  |  |
|  |  |   Analyst Delivers."           |                                  |  |
|  |  |  text-display-md               |                                  |  |
|  |  |  text-foreground mb-6          |                                  |  |
|  |  |                               |                                  |  |
|  |  |  BODY:                         |                                  |  |
|  |  |  "Every review produces        |                                  |  |
|  |  |  specific findings and         |                                  |  |
|  |  |  actionable recommendations    |                                  |  |
|  |  |  for your trip. Not templates. |                                  |  |
|  |  |  Not generic advice. Your      |                                  |  |
|  |  |  analyst writes about your     |                                  |  |
|  |  |  destination, your group,      |                                  |  |
|  |  |  and your itinerary."          |                                  |  |
|  |  |  text-body-lg                   |                                  |  |
|  |  |  text-muted-foreground          |                                  |  |
|  |  |  max-w-prose mb-8              |                                  |  |
|  |  |                               |                                  |  |
|  |  |  [Output Contents List]        |                                  |  |
|  |  |  space-y-3                     |                                  |  |
|  |  |  Each: flex gap-3             |                                  |  |
|  |  |    Check (16px, primary-500)   |                                  |  |
|  |  |    text-body-md text-foreground|                                  |  |
|  |  |                               |                                  |  |
|  |  |  - Destination-specific risk   |                                  |  |
|  |  |    scores with probability     |                                  |  |
|  |  |    analysis                    |                                  |  |
|  |  |  - Section-by-section findings |                                  |  |
|  |  |    referencing your trip       |                                  |  |
|  |  |  - Actionable recommendations  |                                  |  |
|  |  |    with implementation guidance|                                  |  |
|  |  |  - Emergency contacts and      |                                  |  |
|  |  |    evacuation procedures       |                                  |  |
|  |  |  - Maps and route              |                                  |  |
|  |  |    documentation               |                                  |  |
|  |  |  - SHA-256 tamper-evident      |                                  |  |
|  |  |    verification                |                                  |  |
|  |  |                               |                                  |  |
|  |  |  [CTA]                         |                                  |  |
|  |  |  mt-8                          |                                  |  |
|  |  |  Button variant="primary"      |                                  |  |
|  |  |  size="lg"                     |                                  |  |
|  |  |  icon: Download (16px)         |                                  |  |
|  |  |  "Download a Sample Binder"    |                                  |  |
|  |  |  -> /resources/sample-binders  |                                  |  |
|  |  |                               |                                  |  |
|  |  +-------------------------------+                                  |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| DocumentPreview | `documentStack` | opacity: 0, y: 16, rotateX: -5 to resting. 500ms + spring. |
| Text column | `fadeUp` stagger | Eyebrow through CTA at 80ms intervals |
| Output contents items | `checklistReveal` | Stagger at 60ms |

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 640px) | Single column, stacked. Visual above text. Document preview full-width. |
| md (768px) | Document preview `max-w-[400px] mx-auto`. |
| lg (1024px) | 2-column grid activates. Visual on left, text on right (reversed layout). |

### Accessibility

- `<section aria-labelledby="sample-output-heading">`
- Heading: `<h2 id="sample-output-heading">`
- DocumentPreview: Contains real text content, all accessible. Risk score bar: `role="img" aria-label="Risk score: 23 out of 100, Low Risk"`
- SHA-256 hash: `aria-label="SHA-256 verification hash"` on the mono text

---

## Section 6: Timeline `[TEMPLATE]`

### Layout

```
+============================================================================+
|                                                                            |
|  bg-card border-y border-border                                            |
|  py-24 lg:py-32                                                            |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12          |  |
|  |                                                                      |  |
|  |  [Section Header -- center-aligned]                                 |  |
|  |  EYEBROW: "TURNAROUND TIME"                                         |  |
|  |  text-eyebrow text-primary-700 uppercase mb-4                       |  |
|  |                                                                      |  |
|  |  HEADLINE: "Submit to Binder                                        |  |
|  |             in 3-5 Days."                                            |  |
|  |  text-display-md text-foreground max-w-[28ch] mx-auto text-center   |  |
|  |  mb-16 lg:mb-20                                                     |  |
|  |                                                                      |  |
|  |  [Horizontal Timeline -- Desktop >= lg]                             |  |
|  |  grid grid-cols-3 gap-0 relative                                    |  |
|  |                                                                      |  |
|  |  +------------------+------------------+------------------+          |  |
|  |  |                  |                  |                  |          |  |
|  |  |     SUBMIT       |     REVIEW       |     BINDER       |          |  |
|  |  |                  |                  |                  |          |  |
|  |  |   (1)====LINE===>(2)====LINE===>(3) |                  |          |  |
|  |  |                  |                  |                  |          |  |
|  |  +------------------+------------------+------------------+          |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### Timeline Step Anatomy

```
Each of 3 columns:
+------------------------------------------+
|  text-center px-6                        |
|                                          |
|  [Icon Container]                        |
|  h-16 w-16 rounded-2xl mx-auto          |
|  bg-primary-50 border-2 border-primary-200
|  flex items-center justify-center        |
|  mb-6                                    |
|  Icon: h-7 w-7 text-primary-600         |
|                                          |
|  [Title]                                 |
|  text-heading-md text-foreground font-600|
|  mb-2                                    |
|                                          |
|  [Description]                           |
|  text-body-md text-muted-foreground      |
|  max-w-[30ch] mx-auto mb-4              |
|                                          |
|  [Time Badge]                            |
|  Badge variant="default" size="default"  |
|                                          |
+------------------------------------------+
```

### Timeline Content

| # | Icon (Lucide) | Title | Description | Badge |
|---|---------------|-------|-------------|-------|
| 1 | `Send` | Submit Your Trip | Fill out the guided trip submission form with your destination, dates, and details. | "~15 minutes" |
| 2 | `ClipboardCheck` | Analyst Reviews | A trained analyst conducts the full 17-section review using government intelligence data. | "1-3 business days" |
| 3 | `FileCheck` | Receive Your Binder | Your complete, audit-ready Trip Safety Binder is delivered digitally. | "3-5 days total" |

### Connecting Line

Same spec as ProcessTimeline in how-it-works:
- SVG path, 2px stroke
- Color: `primary-200`
- Style: dashed (`stroke-dasharray: 6 4`)
- Animation: `routeDraw` preset (pathLength 0 to 1, 1200ms)
- Positioned absolutely between icon containers
- `z-index: z-behind`

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Section header | `fadeUp` stagger | Eyebrow/headline at 80ms intervals |
| Step 1 | `cardReveal` | 0ms |
| Line 1-2 | `routeDraw` | 200ms delay |
| Step 2 | `cardReveal` | 400ms delay |
| Line 2-3 | `routeDraw` | 600ms delay |
| Step 3 | `cardReveal` | 800ms delay |

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 640px) | Vertical timeline using `<TimelineStep>` stack. Icon containers `h-12 w-12`. |
| lg (1024px) | Horizontal 3-column grid with connecting lines. |

### Accessibility

- `<section aria-labelledby="timeline-heading">`
- Heading: `<h2 id="timeline-heading">`
- Timeline steps: `role="list"`, each step `role="listitem"`
- Connecting lines: `aria-hidden="true"` (decorative)
- Time badges: `aria-label` with full context

---

## Section 7: Comparison -- Analyst Review vs. DIY `[TEMPLATE]`

### Layout

```
+============================================================================+
|                                                                            |
|  bg-background                                                             |
|  py-24 lg:py-32                                                            |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12          |  |
|  |                                                                      |  |
|  |  [Section Header -- center-aligned]                                 |  |
|  |  EYEBROW: "WHY AN ANALYST"                                          |  |
|  |  text-eyebrow text-primary-700 uppercase mb-4                       |  |
|  |                                                                      |  |
|  |  HEADLINE: "Professional Review                                     |  |
|  |             vs. DIY Checklists."                                     |  |
|  |  text-display-md text-foreground max-w-[28ch] mx-auto text-center   |  |
|  |  mb-4                                                               |  |
|  |                                                                      |  |
|  |  SUBTEXT: "See what you gain when a trained analyst reviews          |  |
|  |  your trip instead of relying on a self-serve checklist."           |  |
|  |  text-body-lg text-muted-foreground max-w-prose mx-auto             |  |
|  |  text-center mb-16                                                  |  |
|  |                                                                      |  |
|  |  [Comparison Table]                                                 |  |
|  |  max-w-4xl mx-auto                                                  |  |
|  |  bg-card rounded-xl border border-border shadow-card                |  |
|  |  overflow-hidden                                                    |  |
|  |                                                                      |  |
|  |  See detailed spec below                                            |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### Comparison Table Structure

```
+--------------------------------------------------------------------+
|  [Table Header Row]                                                |
|  grid grid-cols-[1fr_1fr_1fr]                                      |
|  bg-primary-50 border-b border-border                              |
|  px-6 py-4                                                         |
|                                                                    |
|  | Capability                   | SafeTrekr         | DIY          |
|  |                              | Analyst Review    | Checklist    |
|  | text-body-sm text-muted-fg   | text-heading-sm   | text-heading-sm
|  |                              | text-primary-700  | text-muted-fg|
|  |                              | font-600          | font-600     |
|                                                                    |
|  [Table Body Rows]                                                 |
|  divide-y divide-border                                            |
|                                                                    |
|  Each row:                                                         |
|  grid grid-cols-[1fr_1fr_1fr]                                      |
|  px-6 py-4                                                         |
|  hover:bg-primary-50/30                                            |
|  transition-colors duration-fast                                   |
|                                                                    |
|  | [Capability Label]           | [SafeTrekr Value] | [DIY Value]  |
|  | text-body-md text-foreground | (see below)       | (see below)  |
|                                                                    |
+--------------------------------------------------------------------+
```

### Comparison Value Indicators

For SafeTrekr column:
- **Included**: Check icon (16px, `primary-500`) + descriptive text in `text-body-sm text-foreground`
- **Advanced**: Check icon (16px, `primary-500`) + descriptive text in `text-body-sm text-foreground` + Badge `variant="default"` "ADVANCED"

For DIY column:
- **Absent**: X icon (16px, `muted-foreground/50`) + text in `text-body-sm text-muted-foreground`
- **Partial**: Circle/dash icon (16px, `warning-500`) + text in `text-body-sm text-muted-foreground`

### Comparison Row Content

| Capability | SafeTrekr Analyst Review | DIY Checklist |
|------------|------------------------|---------------|
| Professional risk assessment | Check: "Trained analyst evaluates every section" | X: "Self-assessed by trip organizer" |
| Government intelligence data | Check + ADVANCED: "5 sources: NOAA, USGS, CDC, GDACS, ReliefWeb" | X: "Not available" |
| Monte Carlo risk scoring | Check + ADVANCED: "Probability-weighted scores per destination" | X: "No quantitative scoring" |
| 17-section structured review | Check: "Standardized methodology, every trip" | Partial: "Ad hoc checklist, inconsistent scope" |
| Specific findings and recommendations | Check: "Written for your trip, your group, your destination" | X: "Generic guidance at best" |
| Emergency preparedness evaluation | Check: "Rally points, evacuation routes, hospital mapping" | Partial: "Basic emergency contact list" |
| Tamper-evident documentation | Check + ADVANCED: "SHA-256 hash chain, audit-ready" | X: "Editable documents, no integrity proof" |
| Compliance documentation | Check: "Built for board, insurance, and regulatory review" | Partial: "Informal records, no standard format" |
| Turnaround time | Check: "3-5 business days, no staff time" | X: "$700-$1,400 in staff time per trip" |
| Ongoing intelligence updates | Check: "Data refreshed until departure date" | X: "Static at time of creation" |

### Mobile Comparison Layout (< lg)

On screens below `lg`, the table transforms into stacked comparison cards:

```
[For each capability row]
+------------------------------------------+
|  bg-card rounded-lg border border-border |
|  p-4 mb-3                                |
|                                          |
|  [Capability]                            |
|  text-body-md text-foreground font-500   |
|  mb-3                                    |
|                                          |
|  [SafeTrekr]                             |
|  flex items-start gap-2 mb-2            |
|  Badge "SAFETREKR" variant="default"     |
|  text-body-sm text-foreground            |
|                                          |
|  [DIY]                                   |
|  flex items-start gap-2                  |
|  text-body-sm text-muted-foreground      |
|                                          |
+------------------------------------------+
```

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Section header | `fadeUp` stagger | Eyebrow/headline/subtext at 80ms intervals |
| Comparison table | `fadeUp` | Single unit, 200ms after header |
| Table rows | None | No per-row animation (readability priority) |

### Accessibility

- `<section aria-labelledby="comparison-heading">`
- Heading: `<h2 id="comparison-heading">`
- Table uses `<table>` element with `<thead>`, `<tbody>`, `<th scope="col">`, `<th scope="row">`
- Check/X icons include `aria-hidden="true"` -- the descriptive text conveys meaning
- Mobile card layout: Each card uses `<article>` with the capability as implicit heading
- Table is wrapped in `role="region" aria-label="Feature comparison table"` with horizontal scroll on small screens if table layout is preserved

---

## Section 8: FAQ `[TEMPLATE]`

### Component

`<FAQSection>` -- shadcn/ui `Accordion` with SafeTrekr styling.

### Layout

```
+============================================================================+
|                                                                            |
|  bg-card border-y border-border                                            |
|  py-24 lg:py-32                                                            |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | max-w-3xl mx-auto px-6 sm:px-8 lg:px-12                             |  |
|  |                                                                      |  |
|  |  [Section Header -- center-aligned]                                 |  |
|  |  EYEBROW: "COMMON QUESTIONS"                                        |  |
|  |  text-eyebrow text-primary-700 uppercase mb-4                       |  |
|  |                                                                      |  |
|  |  HEADLINE: "Analyst Review FAQ"                                     |  |
|  |  text-display-md text-foreground max-w-[28ch] mx-auto text-center   |  |
|  |  mb-12                                                              |  |
|  |                                                                      |  |
|  |  [Accordion]                                                        |  |
|  |  type="single" collapsible                                          |  |
|  |  space-y-0                                                          |  |
|  |  divide-y divide-border                                             |  |
|  |                                                                      |  |
|  |  +--------------------------------------------------------------+   |  |
|  |  | Q1: Who are the safety analysts?                              |   |  |
|  |  |    [Chevron]                                                  |   |  |
|  |  +--------------------------------------------------------------+   |  |
|  |  | Q2: How long does a review take?                              |   |  |
|  |  +--------------------------------------------------------------+   |  |
|  |  | Q3: ...                                                       |   |  |
|  |  +--------------------------------------------------------------+   |  |
|  |  | Q4: ...                                                       |   |  |
|  |  +--------------------------------------------------------------+   |  |
|  |  | Q5: ...                                                       |   |  |
|  |  +--------------------------------------------------------------+   |  |
|  |  | Q6: ...                                                       |   |  |
|  |  +--------------------------------------------------------------+   |  |
|  |  | Q7: ...                                                       |   |  |
|  |  +--------------------------------------------------------------+   |  |
|  |  | Q8: ...                                                       |   |  |
|  |  +--------------------------------------------------------------+   |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### FAQ Accordion Item Anatomy

```
Trigger:
  py-5
  flex items-center justify-between w-full
  text-heading-sm text-foreground font-600 text-left

  [Chevron]
  ChevronDown h-5 w-5 text-muted-foreground
  transition-transform duration-normal
  Expanded: rotate-180

Content:
  pb-5
  text-body-md text-muted-foreground
  max-w-prose
```

### FAQ Content

**Q1: Who are the safety analysts?**
A: Every SafeTrekr analyst is a trained professional who has completed our structured training program covering risk assessment methodology, government intelligence interpretation, and the 17-section review framework. They are not volunteers, not contractors pulled from a gig platform, and not customer support agents following a script. Each analyst maintains ongoing certification in SafeTrekr's review methodology.

**Q2: How long does a review take?**
A: Most reviews are completed in 3-5 business days from the time you submit your trip. The timeline depends on trip complexity -- a domestic day trip is typically faster than a multi-country international itinerary. Your analyst works through all 17 sections with the same thoroughness regardless of trip type.

**Q3: What if my trip details change after submission?**
A: You can update your trip details after submission and before the review is finalized. If a change is significant -- such as a new destination or major itinerary revision -- your analyst will re-evaluate the affected sections. Minor changes (participant count adjustments, schedule tweaks) are incorporated without extending the timeline.

**Q4: Can I communicate directly with my analyst?**
A: Your analyst's findings and recommendations are delivered through the SafeTrekr platform as part of your Trip Safety Binder. The review process is structured to ensure consistency and thoroughness. If you have specific concerns about your trip, include them in the submission form and your analyst will address them in the relevant sections.

**Q5: Is the review the same for a domestic day trip and an international mission trip?**
A: Every trip receives the same 17-section framework, but the depth and focus of each section adapts to your trip type. A domestic field trip may have minimal air travel or lodging concerns but significant venue and transportation evaluation. An international mission trip will have extensive destination safety, health advisory, and emergency preparedness analysis. The framework is consistent; the content is specific to your trip.

**Q6: What happens if the analyst finds a serious risk?**
A: If your analyst identifies a significant risk, it is documented in Section 12 (Known Issues and Flags) with a severity rating and a specific recommendation. High-severity findings are highlighted in the binder summary. SafeTrekr does not make go/no-go decisions for your organization -- we provide the evidence and recommendations so your leadership can make informed decisions.

**Q7: How is this different from a travel advisory?**
A: Government travel advisories are country-level assessments updated periodically. A SafeTrekr analyst review is trip-specific, destination-specific, date-specific, and group-specific. We evaluate your exact itinerary against current conditions using 5 government data sources, then write findings that reference your group size, your venues, your transportation, and your timeline. A travel advisory tells you a country has risk. An analyst review tells you what that risk means for your specific trip.

**Q8: Can I share the review with my board or insurance carrier?**
A: Yes. Your Trip Safety Binder is designed to be shared with boards, insurance carriers, legal counsel, and any stakeholder who needs to see your safety documentation. The SHA-256 tamper-evident integrity means any recipient can verify the document has not been modified since it was created. Many organizations use the binder specifically for board presentations and insurance documentation.

### JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Who are the safety analysts?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Every SafeTrekr analyst is a trained professional who has completed our structured training program covering risk assessment methodology, government intelligence interpretation, and the 17-section review framework."
      }
    }
    // ... (all 8 Q&A pairs)
  ]
}
```

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Section header | `fadeUp` stagger | Eyebrow/headline at 80ms intervals |
| FAQ items | `staggerContainer` | Items fade up at 60ms intervals |
| Accordion expand | Native | Height 0 to auto, chevron rotation, `duration-moderate` |

### Accessibility

- `<section aria-labelledby="faq-heading">`
- Heading: `<h2 id="faq-heading">`
- Accordion uses shadcn/ui `Accordion` with `type="single" collapsible`
- `aria-expanded` on all triggers
- Content panels: `role="region"` with `aria-labelledby`

---

## Section 9: Dark CTA Band `[TEMPLATE]` (DARK SECTION 2 of 2)

### Component

`<CTABand variant="dark">`

### Layout

```
+============================================================================+
|                                                                            |
|  bg-secondary [data-theme="dark"]                                          |
|  py-20 lg:py-28                                                            |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12          |  |
|  | text-center                                                          |  |
|  |                                                                      |  |
|  |  HEADLINE: "Ready to See What a                                     |  |
|  |             Professional Review                                      |  |
|  |             Looks Like?"                                              |  |
|  |  text-display-md text-dark-text-primary max-w-[28ch] mx-auto        |  |
|  |  mb-6                                                               |  |
|  |                                                                      |  |
|  |  BODY: "Every trip deserves a safety analyst.                        |  |
|  |  See a sample binder or request a personalized demo."                |  |
|  |  text-body-lg text-dark-text-secondary max-w-prose mx-auto          |  |
|  |  mb-10                                                              |  |
|  |                                                                      |  |
|  |  [CTA Group -- flex gap-4 justify-center]                           |  |
|  |  +---------------------------+  +-------------------------------+   |  |
|  |  | Get a Demo                |  | See a Sample Binder           |   |  |
|  |  | Button variant=           |  | Button variant=               |   |  |
|  |  |  "primary-on-dark"        |  |  "secondary" (with dark       |   |  |
|  |  | size="lg" (h-13, px-8)    |  |  border override)              |   |  |
|  |  | -> /demo                  |  | -> /resources/sample-binders  |   |  |
|  |  +---------------------------+  +-------------------------------+   |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### Secondary Button Dark Override

The secondary button on dark backgrounds uses a custom style override:
- Border: `border-dark-border` (white at 12% opacity)
- Text: `text-dark-text-primary` (#f7f8f8)
- Hover: `bg-dark-surface` (white at 6% opacity)
- Active: `bg-dark-surface` with increased opacity

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Entire section | `fadeIn` | Background and content together |
| Headline | `fadeUp` | 100ms delay |
| Body | `fadeUp` | 180ms delay |
| CTA group | `fadeUp` | 260ms delay |

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 640px) | `py-16`. Headline clamps to 28px. CTAs stack vertically, full-width. `gap-3`. |
| sm (640px) | CTAs go horizontal. |
| lg (1024px) | `py-28`. Full headline size. |

### Accessibility

- `<section aria-labelledby="cta-heading">`
- Heading: `<h2 id="cta-heading">`
- CTA buttons: Self-explanatory labels
- All text meets 7.0:1+ contrast on secondary background

---

## Section 10: Footer `[SHARED]`

`<SiteFooter>` -- Standard shared component. See design system specification Section 6.3.

---

## Cross-Page Navigation and Contextual Links

### In-Page Navigation (Sticky Side Nav -- Desktop Only)

On screens >= `xl` (1280px), a sticky side navigation appears on the left margin:

```
position: sticky
top: 96px (below header)
left: 0
max-w-[200px]
pl-6

[Sections List]
space-y-1
text-body-xs text-muted-foreground

Active section: text-primary-700 font-500
Hover: text-foreground

- The Review
- Our Analysts
- 17 Sections
- The Process
- Sample Output
- Timeline
- Comparison
- FAQ

Scrollspy: Active state updates based on which section
is currently in the viewport (IntersectionObserver).
```

This nav is `aria-label="Page sections"` with `<nav>` element. Each link is an anchor (`href="#section-id"`).

On screens below `xl`, this nav is not rendered. The page relies on natural scroll.

### Contextual Cross-Links

| Location | Link | Destination |
|----------|------|-------------|
| Hero CTA | "See a Sample Review" | `/resources/sample-binders` |
| Hero CTA | "Request a Demo" | `/demo` |
| Who Are the Analysts | "Meet our full analyst team" | `/about/analysts` |
| Sample Output | "Download a Sample Binder" | `/resources/sample-binders` |
| CTA Band | "Get a Demo" | `/demo` |
| CTA Band | "See a Sample Binder" | `/resources/sample-binders` |
| FAQ (implicit) | Various inline links | `/how-it-works`, `/platform/safety-binder` |

### Related Feature Links

Below the FAQ and above the CTA band, include a "Related Features" strip:

```
+============================================================================+
|                                                                            |
|  bg-background                                                             |
|  py-12                                                                     |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12          |  |
|  |                                                                      |  |
|  |  EYEBROW: "EXPLORE THE PLATFORM"                                    |  |
|  |  text-eyebrow text-primary-700 uppercase mb-6                       |  |
|  |                                                                      |  |
|  |  [Feature Link Cards -- horizontal scroll or grid]                  |  |
|  |  grid sm:grid-cols-2 lg:grid-cols-5 gap-4                           |  |
|  |                                                                      |  |
|  |  Each card (excluding current page):                                |  |
|  |  +-------------------+                                              |  |
|  |  | bg-card rounded-lg|                                              |  |
|  |  | border border-border                                             |  |
|  |  | p-4 shadow-sm     |                                              |  |
|  |  | hover:shadow-card |                                              |  |
|  |  |                   |                                              |  |
|  |  | [Icon] h-5 w-5   |                                              |  |
|  |  | text-primary-500  |                                              |  |
|  |  | mb-2              |                                              |  |
|  |  |                   |                                              |  |
|  |  | [Title]           |                                              |  |
|  |  | text-body-sm      |                                              |  |
|  |  | text-foreground   |                                              |  |
|  |  | font-500          |                                              |  |
|  |  |                   |                                              |  |
|  |  | ArrowRight 14px   |                                              |  |
|  |  | text-muted-fg     |                                              |  |
|  |  +-------------------+                                              |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### Related Feature Cards Content

| Icon (Lucide) | Title | Link |
|---------------|-------|------|
| `Activity` | Risk Intelligence Engine | `/platform/risk-intelligence` |
| `FileText` | Trip Safety Binder | `/platform/safety-binder` |
| `Smartphone` | Mobile Field Operations | `/platform/mobile-app` |
| `Radio` | Real-Time Monitoring | `/platform/monitoring` |
| `Shield` | Compliance & Evidence | `/platform/compliance` |

Note: The current page (Analyst Safety Review) is excluded from this grid. All 5 other feature pages are shown.

### Accessibility for Related Features

- `<nav aria-label="Related platform features">`
- Each card: `<a>` wrapping the entire card (`group` pattern)
- Cards use `role="list"` wrapper with `role="listitem"`

---

## Complete Section Order Summary

| # | Section | Background | Dark? | Height Estimate (desktop) |
|---|---------|-----------|-------|--------------------------|
| 0 | SiteHeader (sticky) | transparent/blur | No | 64-80px |
| 1 | Hero | `background` | No | ~600px |
| 2 | Who Are the Analysts | `secondary` | Yes (1/2) | ~700px |
| 3 | Interactive 17-Section Review Grid | `background` | No | ~1200px (collapsed), expandable |
| 4 | What a Review Covers (Walkthrough) | `card` + border | No | ~800px |
| 5 | Sample Review Output Preview | `background` | No | ~600px |
| 6 | Timeline | `card` + border | No | ~500px |
| 7 | Comparison | `background` | No | ~700px |
| 8 | FAQ | `card` + border | No | ~600px |
| 9 | Related Features | `background` | No | ~200px |
| 10 | CTA Band | `secondary` | Yes (2/2) | ~350px |
| 11 | Footer | `secondary` | (exempt) | ~400px |

**Dark section count**: 2 (Sections 2 and 10). Compliant with the 2-per-page maximum.

**Background alternation pattern**: `background` -> `secondary` (dark) -> `background` -> `card` -> `background` -> `card` -> `background` -> `card` -> `background` -> `secondary` (dark). Every dark section is preceded and followed by a light section with at least `py-24`. Compliant.

---

## Implementation Notes

### New Components Required

| Component | File | Description |
|-----------|------|-------------|
| `ReviewSectionAccordion` | `components/marketing/review-section-accordion.tsx` | The interactive 17-section grid. Wraps shadcn/ui `Accordion` with category grouping, section numbering, expand/collapse with "Why This Matters" callout. Reusable on `/how-it-works` in a simplified (non-expandable) variant. |
| `ComparisonTable` | `components/marketing/comparison-table.tsx` | Feature comparison table with responsive stacked-card mobile layout. Accepts column definitions and row data as props. Reusable across all feature pages and future `/compare/*` pages. |
| `FeaturePageLayout` | `components/marketing/feature-page-layout.tsx` | Shared layout shell for all `/platform/*` pages. Accepts content slots for hero, deep-dive, walkthrough, output preview, timeline, comparison, FAQ, and CTA band. Handles breadcrumb, in-page nav, related features strip, and consistent spacing. |
| `InPageNav` | `components/marketing/in-page-nav.tsx` | Sticky side navigation with scrollspy for long-form pages. Accepts section labels and anchor IDs. Renders only at >= `xl` breakpoint. |

### Existing Components Used

- `SiteHeader`, `SiteFooter` (shared layout)
- `CTABand` variant="dark" (CTA band)
- `Badge` variants: default, secondary, dark (various)
- `Eyebrow` (section headers)
- `Button` variants: primary, secondary, primary-on-dark (CTAs)
- `DocumentPreview` (sample output)
- `DarkAuthoritySection` (analyst credibility, CTA band)
- `TimelineStep` (walkthrough, mobile timeline)
- `ProcessTimeline` (timeline section)
- `Divider` variant="route" (document preview)
- `FAQSection` / shadcn Accordion (FAQ, review grid)

### Data Architecture

The 17-section content should be stored as structured data, not hardcoded in the component:

```typescript
// lib/data/review-sections.ts

interface ReviewSection {
  number: number;
  title: string;
  icon: LucideIcon;
  category: string;
  categoryIndex: number;
  evaluates: string;
  details: string[];
  whyItMatters: string;
}

interface ReviewCategory {
  name: string;
  slug: string;
  sectionRange: string; // e.g., "Sections 1-4"
  sections: ReviewSection[];
}

export const reviewCategories: ReviewCategory[] = [
  // ... all 5 categories with 17 sections
];
```

This data is consumed by:
1. `/platform/analyst-review` -- full interactive grid with expand/collapse
2. `/how-it-works` -- simplified card grid (non-expandable)
3. Homepage feature grid -- summary count ("17 Safety Review Sections")
4. Future: individual section pages if SEO value warrants

### SEO Notes

- The 17-section content creates significant long-tail keyword opportunity ("trip safety transportation review", "emergency preparedness evaluation", etc.)
- Each section's "What the Analyst Evaluates" text should be visible in collapsed state for indexing
- FAQ schema markup provides rich result eligibility
- URL hash navigation (`#section-8-safety`) supports direct linking from other pages and external sources
- Internal linking from segment pages and how-it-works should deep-link to specific sections where relevant

### Performance Considerations

- The 17-section accordion uses `type="multiple"` which means all content is in the DOM but hidden. This is acceptable because the content is text-only (no images, no heavy components).
- If the expanded content for all 17 sections exceeds 50KB of DOM, consider lazy-rendering expanded content (only mount on first expand). However, for SEO indexing, all text should be in the initial HTML -- use CSS `display:none` / `height:0` with `overflow:hidden` rather than conditional rendering.
- Hero composition panel progress bar animation should use CSS transforms (GPU-accelerated), not width animation.
- In-page nav scrollspy should debounce IntersectionObserver callbacks to prevent layout thrashing.
