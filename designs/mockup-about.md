# Mockup Specification: About Page (`/about`)

**Version**: 1.0
**Date**: 2026-03-24
**Status**: READY FOR IMPLEMENTATION
**Page Type**: Core Page (SSG)
**Hierarchy Level**: L1
**Canonical URL**: `https://www.safetrekr.com/about`
**Redirects**: `/about-us` (301), `/company` (301)
**Design System Reference**: `DESIGN-SYSTEM.md` v1.0
**IA Reference**: `INFORMATION-ARCHITECTURE.md` Section 3.7

---

## Page Metadata

### SEO

| Property | Value |
|----------|-------|
| `<title>` | `About SafeTrekr -- Professional Trip Safety for Every Organization` |
| `meta description` | `SafeTrekr was built to close the gap between aviation-grade safety and what schools, churches, and businesses do for group travel. Professional analyst review. Government intelligence. Documented evidence.` |
| `og:title` | `About SafeTrekr` |
| `og:description` | Same as meta description |
| `og:type` | `website` |
| `og:image` | `/og/about.png` (1200x630, brand composition with mission statement overlay) |
| `canonical` | `https://www.safetrekr.com/about` |

### JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SafeTrekr",
  "url": "https://www.safetrekr.com",
  "logo": "https://www.safetrekr.com/logo.svg",
  "description": "Professional trip safety management. Analyst-reviewed safety binders for schools, churches, universities, and businesses.",
  "foundingDate": "2024",
  "sameAs": [],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  }
}
```

---

## Dark Section Budget

This page uses **2 dark sections** (the maximum allowed excluding footer):

1. **Section 5: By the Numbers** -- `DarkAuthoritySection` wrapper. Rationale: data showcase, proof module.
2. **Section 8: Conversion CTA Banner** -- `CTABand variant="dark"`. Rationale: terminal conversion prompt.

Neither section is adjacent. Both are separated by at least one full light section with `py-24`.

---

## Page-Level Design Register

| Register | Weight | Application on This Page |
|----------|--------|--------------------------|
| Polished Operational (70%) | Primary | Metrics strip, approach pillars, team credentials, structured layout |
| Editorial Intelligence (20%) | Elevated | Hero narrative, founding story section, mission statement -- more open spacing, stronger typography |
| Watchtower Light (10%) | Restrained | Subtle route divider SVG between founding story and approach sections |

This page leans more heavily into the 20% editorial register than most pages. The founding story and mission statement demand the open, typographically-driven treatment. The page should feel like reading an executive letter, not scrolling a product site.

---

## Section-by-Section Specification

---

### Section 1: Hero

**Component**: Custom `AboutHero` (page-specific)
**Background**: `background` (#e7ecee) -- standard page canvas
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+------------------------------------------------------------------+
|  [background canvas]                                              |
|                                                                   |
|  EYEBROW: "OUR STORY"                                            |
|                                                                   |
|  HEADLINE (text-display-lg):                                      |
|  We Believe Every Trip                                            |
|  Deserves the Same Safety                                         |
|  Rigor as a Flight.                                               |
|                                                                   |
|  SUB-HEADLINE (text-body-lg, max-w-prose):                        |
|  Schools send students on field trips with a permission slip      |
|  and a prayer. Churches send mission teams to foreign countries    |
|  with a spreadsheet. Every day, airlines subject flight plans     |
|  to rigorous safety review -- but group travel gets nothing.      |
|  We started SafeTrekr to change that.                             |
|                                                                   |
+------------------------------------------------------------------+

Mobile (< lg):
Same stacked layout, fluid typography scales down naturally.
No visual column -- text only.
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | `pt-24 pb-20 lg:pt-32 lg:pb-28 xl:pt-36 xl:pb-32` | Hero scale from design system |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em]` | "OUR STORY" |
| Eyebrow icon | `BookOpen` (Lucide), `h-3.5 w-3.5`, inline-left, `text-primary-700` | Optional dot variant accepted |
| Eyebrow margin | `mb-4 lg:mb-6` | 16-24px below eyebrow |
| Headline | `.text-display-lg text-foreground` | See copy below |
| Headline max-width | `max-w-[20ch]` | Constrains to ~20 characters per line for dramatic line breaks |
| Headline margin | `mb-6 lg:mb-8` | 24-32px below headline |
| Sub-headline | `.text-body-lg text-muted-foreground max-w-prose` | See copy below |
| Sub-headline line-height | 1.6 (inherited from `.text-body-lg`) | Generous reading rhythm |
| Text alignment | `text-left` on all breakpoints | Editorial alignment, never centered on this section |

#### Copy

**Eyebrow**: `OUR STORY`

**Headline**: `We Believe Every Trip Deserves the Same Safety Rigor as a Flight.`

**Sub-headline**: `Schools send students on field trips with a permission slip and a prayer. Churches send mission teams to foreign countries with a spreadsheet. Every day, airlines subject flight plans to rigorous safety review -- but group travel gets nothing. We started SafeTrekr to change that.`

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Eyebrow | `fadeUp` | Page load | 0ms delay (first element) |
| Headline | `fadeUp` | Page load | 80ms stagger from eyebrow |
| Sub-headline | `fadeUp` | Page load | 160ms stagger |

#### Accessibility

- `<section aria-labelledby="about-hero-heading">`
- Headline is `<h1 id="about-hero-heading">` -- the only `<h1>` on the page
- Sub-headline is `<p>`, not a heading

---

### Section 2: The Problem We Saw

**Component**: Custom `FoundingNarrative` (page-specific)
**Background**: `card` (#f7f8f8) -- elevated surface to distinguish from hero canvas
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+------------------------------------------------------------------+
|  [card surface, full-width band]                                  |
|                                                                   |
|  +---max-w-3xl mx-auto (768px centered)-------------------------+ |
|  |                                                               | |
|  |  EYEBROW: "THE PROBLEM WE SAW"                               | |
|  |                                                               | |
|  |  HEADLINE (text-heading-lg):                                  | |
|  |  A Spreadsheet and a Prayer                                   | |
|  |                                                               | |
|  |  BODY PARAGRAPH 1 (text-body-lg):                             | |
|  |  Every year, millions of people travel in organized           | |
|  |  groups -- school field trips, church mission teams,           | |
|  |  university study abroad cohorts, corporate retreats.          | |
|  |  These trips carry real risk: unfamiliar destinations,         | |
|  |  group logistics, medical emergencies, political               | |
|  |  instability, natural disasters.                               | |
|  |                                                               | |
|  |  BODY PARAGRAPH 2 (text-body-lg):                             | |
|  |  Yet the safety planning for most of these trips amounts       | |
|  |  to a spreadsheet, a Google search, and the hope that          | |
|  |  nothing goes wrong. No professional risk assessment. No       | |
|  |  government intelligence. No documented evidence of due         | |
|  |  diligence. Nothing that would survive a courtroom.            | |
|  |                                                               | |
|  |  PULL QUOTE (text-heading-md, primary-700, left-border):       | |
|  |  "Airlines wouldn't dream of flying a route without            | |
|  |  professional safety review. Why do we accept less             | |
|  |  for our students, congregations, and employees?"              | |
|  |                                                               | |
|  |  BODY PARAGRAPH 3 (text-body-lg):                             | |
|  |  We built SafeTrekr to close that gap -- to bring              | |
|  |  professional-grade safety analysis to every organization       | |
|  |  that sends people on trips.                                   | |
|  |                                                               | |
|  +---------------------------------------------------------------+ |
|                                                                   |
+------------------------------------------------------------------+
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section background | `bg-card` | #f7f8f8 full-width band |
| Section padding | Standard section: `py-16 sm:py-20 md:py-24 lg:py-32` | Per section padding scale |
| Content wrapper | `max-w-3xl mx-auto` | 768px centered -- editorial column width |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em]` | "THE PROBLEM WE SAW" |
| Eyebrow margin | `mb-4` | 16px |
| Headline | `.text-heading-lg text-foreground` | 36px desktop / 24px mobile |
| Headline margin | `mb-8 lg:mb-10` | 32-40px -- generous editorial spacing |
| Body paragraphs | `.text-body-lg text-muted-foreground max-w-prose` | 20px desktop, 1.6 line-height |
| Paragraph spacing | `space-y-6` | 24px between paragraphs |
| Pull quote container | `border-l-4 border-primary-500 pl-6 lg:pl-8 my-10 lg:my-12` | Left accent border |
| Pull quote text | `.text-heading-md text-primary-700 italic` | 28px desktop, weight 600 |
| Pull quote max-width | `max-w-[45ch]` | Constrains for readability |
| Closing paragraph | `.text-body-lg text-foreground font-medium` | Slightly elevated weight for the conclusion |

#### Copy

**Eyebrow**: `THE PROBLEM WE SAW`

**Headline**: `A Spreadsheet and a Prayer`

**Paragraph 1**: `Every year, millions of people travel in organized groups -- school field trips, church mission teams, university study abroad cohorts, corporate retreats. These trips carry real risk: unfamiliar destinations, group logistics, medical emergencies, political instability, natural disasters.`

**Paragraph 2**: `Yet the safety planning for most of these trips amounts to a spreadsheet, a Google search, and the hope that nothing goes wrong. No professional risk assessment. No government intelligence. No documented evidence of due diligence. Nothing that would survive a courtroom.`

**Pull Quote**: `"Airlines wouldn't dream of flying a route without professional safety review. Why do we accept less for our students, congregations, and employees?"`

**Paragraph 3**: `We built SafeTrekr to close that gap -- to bring professional-grade safety analysis to every organization that sends people on trips.`

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Section | `fadeIn` | 20% viewport intersection | Entire section fades in |
| Eyebrow | `fadeUp` | After section fade | 0ms |
| Headline | `fadeUp` | Stagger | 80ms |
| Paragraphs | `fadeUp` | Stagger | 160ms, 240ms |
| Pull quote | `fadeUp` | Stagger | 200ms, border animates width from 0 to 4px over 300ms |
| Closing paragraph | `fadeUp` | Stagger | 320ms |

#### Accessibility

- `<section aria-labelledby="founding-narrative-heading">`
- Headline is `<h2 id="founding-narrative-heading">`
- Pull quote uses `<blockquote>` with `<p>` inside
- No `<cite>` needed (attributed to the company, not an individual)

---

### Section Divider: Route Curve

Between Section 2 and Section 3, render the **route divider** variant:

| Property | Value |
|----------|-------|
| Component | `<Divider variant="route" />` |
| SVG | S-curve bezier path extracted from logo mark |
| Color | `primary-200` at 30% opacity |
| Max width | 600px, centered |
| Height | ~40px visible |
| Margin | `my-0` (absorbed by adjacent section padding) |
| Animation | `routeDraw` -- pathLength 0 to 1 over 1200ms on scroll intersection |

---

### Section 3: Our Approach

**Component**: Custom `ApproachPillars` (page-specific) using 3x `FeatureCard` internally
**Background**: `background` (#e7ecee) -- standard canvas
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+------------------------------------------------------------------+
|                                                                   |
|  EYEBROW: "OUR APPROACH"                          (centered)     |
|                                                                   |
|  HEADLINE (text-display-md, centered):                            |
|  Three Pillars. Zero Guesswork.                                   |
|                                                                   |
|  SUB-TEXT (text-body-lg, centered, max-w-prose):                  |
|  Every SafeTrekr binder is built on the same three               |
|  non-negotiable foundations.                                      |
|                                                                   |
|  +------------------+ +------------------+ +------------------+   |
|  | [ClipboardCheck] | | [Shield]         | | [FileText]       |   |
|  |                  | |                  | |                  |   |
|  | Professional     | | Government       | | Tamper-Evident   |   |
|  | Analyst Review   | | Intelligence     | | Documentation    |   |
|  |                  | |                  | |                  |   |
|  | Every trip is    | | We monitor 5     | | Every binder     |   |
|  | reviewed by a    | | government       | | is sealed with   |   |
|  | trained safety   | | intelligence     | | SHA-256 hash     |   |
|  | analyst across   | | sources and      | | chain integrity  |   |
|  | 17 standardized  | | 250+ API         | | -- tamper-proof  |   |
|  | sections. Not    | | endpoints to     | | evidence that    |   |
|  | AI. Not a        | | build real-time  | | proves due       |   |
|  | checklist. A     | | risk profiles    | | diligence was    |   |
|  | human expert.    | | for every        | | performed.       |   |
|  |                  | | destination.     | |                  |   |
|  +------------------+ +------------------+ +------------------+   |
|                                                                   |
+------------------------------------------------------------------+

Mobile (< md): Single column, cards stacked with gap-6.
Tablet (md-lg): Still 3 columns but tighter padding.
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | Standard: `py-16 sm:py-20 md:py-24 lg:py-32` | |
| Section header | `text-center mb-12 lg:mb-16` | Centered header block |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em]` | "OUR APPROACH" |
| Eyebrow margin | `mb-4` | |
| Headline | `.text-display-md text-foreground` | 44px desktop / 28px mobile |
| Headline max-width | `max-w-[28ch] mx-auto` | Section headline constraint |
| Headline margin | `mb-4 lg:mb-6` | |
| Sub-text | `.text-body-lg text-muted-foreground max-w-prose mx-auto` | |
| Sub-text margin | `mb-12 lg:mb-16` | |
| Card grid | `grid sm:grid-cols-3 gap-6 lg:gap-8` | 3-column on sm+ |
| Card | `bg-card rounded-xl border border-border p-6 sm:p-8 shadow-card` | Standard FeatureCard |
| Card icon container | `h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4` | |
| Card icon | `h-6 w-6 text-primary-700` | Lucide icon |
| Card title | `.text-heading-sm text-foreground mb-3` | `<h3>` |
| Card body | `.text-body-md text-muted-foreground` | |

#### Card Content

| # | Icon | Title | Body |
|---|------|-------|------|
| 1 | `ClipboardCheck` | Professional Analyst Review | Every trip is reviewed by a trained safety analyst across 17 standardized sections. Not AI. Not a checklist. A human expert with real accountability. |
| 2 | `Shield` | Government Intelligence Data | We monitor 5 government intelligence sources and 250+ API endpoints to build real-time risk profiles for every destination your team visits. |
| 3 | `FileText` | Tamper-Evident Documentation | Every binder is sealed with SHA-256 hash chain integrity -- tamper-proof evidence that proves due diligence was performed, timestamped and court-admissible. |

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Section header | `fadeUp` (staggered: eyebrow 0ms, headline 80ms, sub-text 160ms) | 20% viewport | |
| Card grid | `staggerContainer` + `cardReveal` | 20% viewport | Cards stagger at 80ms intervals |

#### Accessibility

- `<section aria-labelledby="approach-heading">`
- Section headline is `<h2 id="approach-heading">`
- Card titles are `<h3>` elements
- Cards are non-interactive containers (no link), so they do NOT use the `group` click pattern

---

### Section 4: The Team

**Component**: Custom `TeamSection` (page-specific)
**Background**: `card` (#f7f8f8) -- elevated surface
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+------------------------------------------------------------------+
|  [card surface, full-width band]                                  |
|                                                                   |
|  EYEBROW: "THE TEAM"                             (left-aligned)  |
|                                                                   |
|  HEADLINE (text-heading-lg):                                      |
|  Real People. Real Credentials.                                   |
|                                                                   |
|  +-------------------------------+ +----------------------------+ |
|  | FOUNDER CARD                  | | ANALYST TEAM CARD          | |
|  |                               | |                            | |
|  | [Placeholder Avatar]          | | [Shield icon composition]  | |
|  | 80x80 circle, bg-primary-50   | |                            | |
|  | initials in primary-700       | | Our Safety Analysts        | |
|  |                               | |                            | |
|  | [Founder Name]                | | Every trip binder is       | |
|  | Founder & CEO                 | | reviewed by a credentialed | |
|  |                               | | safety analyst with        | |
|  | [Brief founder bio -- 2-3     | | expertise in travel risk,  | |
|  | sentences about why they      | | regulatory compliance,     | |
|  | built SafeTrekr, their        | | and emergency planning.    | |
|  | background in safety/travel/  | |                            | |
|  | technology.]                  | | "Our analysts have         | |
|  |                               | | reviewed trips across      | |
|  |                               | | [X] countries."            | |
|  |                               | |                            | |
|  |                               | | -> Meet Our Analysts       | |
|  +-------------------------------+ +----------------------------+ |
|                                                                   |
+------------------------------------------------------------------+

Mobile (< lg): Cards stack vertically, full-width.
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | Standard: `py-16 sm:py-20 md:py-24 lg:py-32` | |
| Section background | `bg-card` | #f7f8f8 full-width |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em]` | "THE TEAM" |
| Headline | `.text-heading-lg text-foreground` | 36px desktop / 24px mobile |
| Headline margin | `mb-10 lg:mb-12` | |
| Card grid | `grid lg:grid-cols-2 gap-6 lg:gap-8` | 2-column on desktop |
| Cards | `bg-white rounded-xl border border-border p-8 shadow-card` | Note: `bg-white` not `bg-card` since section bg IS card |

**Founder Card Specifics**:

| Element | Token / Class | Value |
|---------|---------------|-------|
| Avatar placeholder | `h-20 w-20 rounded-full bg-primary-50 flex items-center justify-center mb-6` | |
| Avatar initials | `.text-heading-md text-primary-700 font-bold` | Renders founder initials (e.g., "JT") |
| Name | `.text-heading-sm text-foreground` | Founder full name |
| Title | `.text-body-sm text-muted-foreground mb-4` | "Founder & CEO" |
| Bio | `.text-body-md text-muted-foreground max-w-[45ch]` | 2-3 sentences |

**Analyst Team Card Specifics**:

| Element | Token / Class | Value |
|---------|---------------|-------|
| Icon composition | `h-16 w-16 rounded-xl bg-primary-50 flex items-center justify-center mb-6` | |
| Icon | `Shield` (Lucide), `h-8 w-8 text-primary-700` | |
| Title | `.text-heading-sm text-foreground mb-3` | "Our Safety Analysts" |
| Body | `.text-body-md text-muted-foreground mb-4 max-w-[45ch]` | |
| Credential quote | `.text-body-md text-foreground font-medium italic mb-6` | Analyst metric statement |
| Link | `<Button variant="link" size="sm">` with `ArrowRight` icon | Links to `/about/analysts` |

#### Copy

**Eyebrow**: `THE TEAM`

**Headline**: `Real People. Real Credentials.`

**Founder Bio** (placeholder -- replace with actual founder content):
`[Founder Name] founded SafeTrekr after seeing firsthand how organizations manage travel safety with improvised tools and informal processes. With a background in [relevant domain], [he/she/they] built SafeTrekr to bring the same rigor that governs aviation safety to every group trip.`

**Analyst Card Body**: `Every trip binder is reviewed by a credentialed safety analyst with expertise in travel risk assessment, regulatory compliance, and emergency planning.`

**Analyst Credential Statement**: `"Our analysts have reviewed trips across [X] countries for [Y] organization types."`

**Link**: `Meet Our Analysts` (right arrow icon)

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Section header | `fadeUp` staggered | 20% viewport | Eyebrow 0ms, headline 80ms |
| Founder card | `cardReveal` | 20% viewport | 160ms delay |
| Analyst card | `cardReveal` | 20% viewport | 240ms delay |

#### Accessibility

- `<section aria-labelledby="team-heading">`
- Headline is `<h2 id="team-heading">`
- Card titles are `<h3>`
- "Meet Our Analysts" link has `aria-label="Meet our safety analysts -- view full team profiles"`
- Avatar placeholder: `aria-hidden="true"` (decorative, name is provided in text)

#### Implementation Note

Founder content is a placeholder. The component should accept props for founder data so it can be populated without code changes. If no founder data is provided at launch, render only the Analyst Team Card at full width (`lg:col-span-2`).

---

### Section 5: By the Numbers

**Component**: `DarkAuthoritySection` wrapper + custom `MetricsShowcase` inner content
**Background**: `secondary` (#123646) via `DarkAuthoritySection`
**Dark section**: YES (1 of 2)
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+==================================================================+
||  [secondary background, full-bleed]              [data-theme="dark"]
||                                                                  |
||  EYEBROW: "BY THE NUMBERS"                      (centered)      |
||  (dark-accent / primary-400 color)                               |
||                                                                  |
||  HEADLINE (text-display-md, dark-text-primary, centered):        |
||  Verifiable. Not Vanity.                                         |
||                                                                  |
||  SUB-TEXT (text-body-lg, dark-text-secondary, centered):         |
||  Every number on this page comes from our production             |
||  database. We don't do inflated marketing metrics.               |
||                                                                  |
||  +----------+ +----------+ +----------+ +----------+ +--------+ |
||  | 104      | | 5        | | 17       | | 250+     | | 3-5    | |
||  | Orgs     | | Govt     | | Review   | | API      | | Day    | |
||  | Served   | | Intel    | | Sections | | Endpoints| | Turn-  | |
||  |          | | Sources  | | Per Trip | | Monitored| | around | |
||  +----------+ +----------+ +----------+ +----------+ +--------+ |
||                                                                  |
||  +------------------------------------------+                    |
||  | [secondary row, smaller metrics]         |                    |
||  | AES-256 Encryption  |  SHA-256 Evidence  |                    |
||  +------------------------------------------+                    |
||                                                                  |
+==================================================================+
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Wrapper | `<DarkAuthoritySection>` | Applies `secondary` bg + `[data-theme="dark"]` |
| Section padding | `py-20 sm:py-24 lg:py-32` | |
| Section header | `text-center mb-12 lg:mb-16` | |
| Eyebrow | `.text-eyebrow uppercase tracking-[0.08em]` | Color: `dark-accent` (#6cbc8b) |
| Headline | `.text-display-md` | Color: `dark-text-primary` (#f7f8f8) |
| Headline max-width | `max-w-[28ch] mx-auto` | |
| Sub-text | `.text-body-lg max-w-prose mx-auto` | Color: `dark-text-secondary` (#b8c3c7) |
| Primary metric grid | `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6` | 5-col on desktop |
| Secondary metric row | `flex justify-center gap-8 lg:gap-12 mt-8 lg:mt-10` | 2 items centered |

**Primary StatCard (on dark)**:

| Element | Token / Class | Value |
|---------|---------------|-------|
| Card | `bg-[var(--color-dark-surface)] rounded-xl border border-[var(--color-dark-border)] p-6 text-center` | |
| Value | `.text-display-md font-mono` | Color: `dark-text-primary` (#f7f8f8) |
| Label | `.text-eyebrow mt-2 block` | Color: `dark-text-secondary` (#b8c3c7) |
| Animate | `animate={true}` | Counter animation from 0, respects `prefers-reduced-motion` |

**Secondary Metrics (inline, no card)**:

| Element | Token / Class | Value |
|---------|---------------|-------|
| Value | `.text-heading-md font-mono` | Color: `dark-accent` (#6cbc8b) |
| Label | `.text-body-sm` | Color: `dark-text-secondary` (#b8c3c7) |
| Layout | `flex items-baseline gap-2` | Value and label on same baseline |

#### Metric Data

**Primary Row (5 StatCards)**:

| Value | Label | Animate Type |
|-------|-------|-------------|
| `104` | Organizations Served | Counter (0 to 104) |
| `5` | Government Intel Sources | Counter (0 to 5) |
| `17` | Review Sections Per Trip | Counter (0 to 17) |
| `250+` | API Endpoints Monitored | Counter (0 to 250) with "+" suffix |
| `3-5` | Day Turnaround | String (fade in, no counter) |

**Secondary Row (2 inline metrics)**:

| Value | Label |
|-------|-------|
| `AES-256` | Encryption Standard |
| `SHA-256` | Evidence Chain |

#### Copy

**Eyebrow**: `BY THE NUMBERS`

**Headline**: `Verifiable. Not Vanity.`

**Sub-text**: `Every number on this page comes from our production database. We don't do inflated marketing metrics.`

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Section | `fadeIn` | 20% viewport | Entire dark section fades in first |
| Header | `fadeUp` staggered | After section fade | Eyebrow, headline, sub-text at 80ms intervals |
| StatCards | `staggerContainer` + `cardReveal` | After header | 80ms stagger between cards |
| Counter values | `counterAnimate` | When card is visible | 1.5s count-up, `prefers-reduced-motion` shows final value |
| Secondary metrics | `fadeUp` | After cards | 200ms delay after last card |

#### Accessibility

- `<section aria-labelledby="metrics-heading">`
- Headline is `<h2 id="metrics-heading">`
- StatCard values: `aria-label` with full context (e.g., `aria-label="104 organizations served"`)
- Counter animations show final value immediately for screen readers (`aria-hidden` on animated element, real value in visually-hidden `<span>`)
- The "+" suffix on 250+ is part of the `aria-label`: "More than 250 API endpoints monitored"

---

### Section 6: Our Mission

**Component**: Custom `MissionStatement` (page-specific)
**Background**: `background` (#e7ecee) -- standard canvas
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+------------------------------------------------------------------+
|                                                                   |
|  +---max-w-3xl mx-auto (768px centered)-------------------------+ |
|  |                                                               | |
|  |  EYEBROW: "OUR MISSION"                       (centered)     | |
|  |                                                               | |
|  |  MISSION (text-display-md, centered):                         | |
|  |  Protect every traveler through professional                  | |
|  |  safety analysis, government intelligence,                    | |
|  |  and documented evidence.                                     | |
|  |                                                               | |
|  |  [thin horizontal divider, border color, 120px width]         | |
|  |                                                               | |
|  |  VISION LABEL (text-eyebrow):                                 | |
|  |  "OUR VISION"                                                 | |
|  |                                                               | |
|  |  VISION (text-body-lg, centered):                             | |
|  |  A world where every group trip has the safety                | |
|  |  rigor it deserves -- where preparation is the                | |
|  |  standard, not the exception.                                 | |
|  |                                                               | |
|  +---------------------------------------------------------------+ |
|                                                                   |
+------------------------------------------------------------------+
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | Standard: `py-16 sm:py-20 md:py-24 lg:py-32` | |
| Content wrapper | `max-w-3xl mx-auto text-center` | Centered editorial column |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em]` | "OUR MISSION" |
| Eyebrow margin | `mb-6 lg:mb-8` | |
| Mission text | `.text-display-md text-foreground` | 44px desktop / 28px mobile |
| Mission max-width | `max-w-[28ch] mx-auto` | Dramatic line breaks |
| Mission margin | `mb-10 lg:mb-12` | |
| Divider | `<Divider variant="section" />` with override: `w-[120px] mx-auto` | Small centered rule |
| Divider color | `bg-primary-300` | Soft brand accent divider |
| Divider margin | `my-10 lg:my-12` | |
| Vision label | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em] mb-4` | "OUR VISION" |
| Vision text | `.text-body-lg text-muted-foreground max-w-prose mx-auto` | |

#### Copy

**Eyebrow**: `OUR MISSION`

**Mission Statement**: `Protect every traveler through professional safety analysis, government intelligence, and documented evidence.`

**Vision Label**: `OUR VISION`

**Vision Statement**: `A world where every group trip has the safety rigor it deserves -- where preparation is the standard, not the exception.`

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Eyebrow | `fadeUp` | 20% viewport | 0ms |
| Mission text | `fadeUp` | Stagger | 100ms delay -- slightly slower stagger for gravitas |
| Divider | `fadeIn` + width from 0 to 120px | Stagger | 250ms |
| Vision label | `fadeUp` | Stagger | 350ms |
| Vision text | `fadeUp` | Stagger | 430ms |

#### Accessibility

- `<section aria-labelledby="mission-heading">`
- Mission text is `<h2 id="mission-heading">`
- Vision text is a `<p>` with a preceding `<span>` label (not a heading -- vision is subordinate to mission)
- Divider is `aria-hidden="true"` (decorative)

---

### Section 7: Trusted By

**Component**: Custom `TrustedBySection` (page-specific)
**Background**: `card` (#f7f8f8) -- elevated surface
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+------------------------------------------------------------------+
|  [card surface, full-width band]                                  |
|                                                                   |
|  HEADLINE (text-heading-lg, centered):                            |
|  Trusted by Schools, Universities,                                |
|  Churches, and Businesses                                         |
|                                                                   |
|  SUB-TEXT (text-body-lg, centered):                               |
|  SafeTrekr serves 104 organizations across                        |
|  education, faith-based, and corporate sectors.                   |
|                                                                   |
|  +-----------+ +-----------+ +-----------+ +-----------+          |
|  | [School]  | | [Grad Cap]| | [Church]  | | [Briefcse]|          |
|  | K-12      | | Higher    | | Churches  | | Corporate |          |
|  | Schools   | | Education | | & Mission | | & Sports  |          |
|  |           | |           | | Orgs      | | Teams     |          |
|  +-----------+ +-----------+ +-----------+ +-----------+          |
|                                                                   |
|  [text-body-sm, centered, muted]:                                 |
|  Specific logos and organization names available upon request.     |
|                                                                   |
+------------------------------------------------------------------+

Mobile (< md): 2x2 grid.
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | Compressed: `py-12 sm:py-16 md:py-20 lg:py-24` | Slightly tighter -- supporting section |
| Section background | `bg-card` | |
| Headline | `.text-heading-lg text-foreground text-center` | |
| Headline max-width | `max-w-[28ch] mx-auto` | |
| Headline margin | `mb-4` | |
| Sub-text | `.text-body-lg text-muted-foreground text-center max-w-prose mx-auto` | |
| Sub-text margin | `mb-10 lg:mb-12` | |
| Org type grid | `grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto` | 4-col desktop, 2x2 mobile |
| Org type cards | `bg-white rounded-xl border border-border p-6 text-center shadow-sm` | Minimal cards |
| Card icon container | `h-12 w-12 mx-auto rounded-lg bg-primary-50 flex items-center justify-center mb-3` | |
| Card icon | `h-6 w-6 text-primary-700` | Lucide icons |
| Card label | `.text-heading-sm text-foreground` | |
| Card sublabel | `.text-body-sm text-muted-foreground mt-1` | |
| Disclaimer | `.text-body-sm text-muted-foreground text-center mt-8` | |

#### Card Content

| Icon (Lucide) | Label | Sublabel |
|---------------|-------|----------|
| `GraduationCap` | K-12 Schools | Districts & independent schools |
| `BookOpen` | Higher Education | Universities & colleges |
| `Heart` | Churches & Missions | Congregations & mission organizations |
| `Building2` | Corporate & Sports | Businesses, leagues, & sports teams |

#### Copy

**Headline**: `Trusted by Schools, Universities, Churches, and Businesses`

**Sub-text**: `SafeTrekr serves 104 organizations across education, faith-based, and corporate sectors.`

**Disclaimer**: `Specific client logos and organization names available upon request.`

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Header | `fadeUp` staggered | 20% viewport | Headline 0ms, sub-text 80ms |
| Org cards | `staggerContainer` + `cardReveal` | 20% viewport | 80ms stagger |
| Disclaimer | `fadeIn` | After cards | 300ms delay |

#### Accessibility

- `<section aria-labelledby="trusted-by-heading">`
- Headline is `<h2 id="trusted-by-heading">`
- Org type cards are `<div>` containers (not interactive)
- Icons have `aria-hidden="true"` (label text provides meaning)

#### Design Integrity Note

Per the IA: "No fabricated logos or names." This section intentionally uses organization TYPE categories rather than specific client logos. When real partner logos are secured, this section can be upgraded to include a `LogoCloud` component above or below the type grid.

---

### Section 8: Conversion CTA Banner

**Component**: `<CTABand variant="dark" />`
**Background**: `secondary` (#123646) via CTABand dark variant
**Dark section**: YES (2 of 2)
**Container**: Handled internally by CTABand component

#### Props

```tsx
<CTABand
  variant="dark"
  headline="Ready to See SafeTrekr in Action?"
  body="See how professional trip safety management works for your organization. Our team will walk you through a real safety binder."
  primaryCta={{ label: "Get a Demo", href: "/demo" }}
  secondaryCta={{ label: "See How It Works", href: "/how-it-works" }}
/>
```

#### Specifications

All styling is handled by the `CTABand` component per `DESIGN-SYSTEM.md`:

| Element | Token / Class | Value |
|---------|---------------|-------|
| Background | `secondary` (#123646) | Dark variant |
| Section padding | `py-20 lg:py-28` | Per CTABand spec |
| Headline | `.text-display-md` | Color: `dark-text-primary` (#f7f8f8) |
| Headline alignment | `text-center` | |
| Body | `.text-body-lg max-w-prose mx-auto text-center` | Color: `dark-text-secondary` (#b8c3c7) |
| Primary CTA | `<Button variant="primary-on-dark" size="lg">` | White bg, secondary text |
| Secondary CTA | `<Button variant="ghost" size="lg">` with dark-appropriate overrides | `text-dark-text-secondary hover:text-white` |
| Button row | `flex flex-col sm:flex-row gap-4 justify-center mt-8` | Stacked < sm, horizontal >= sm |

#### Copy

**Headline**: `Ready to See SafeTrekr in Action?`

**Body**: `See how professional trip safety management works for your organization. Our team will walk you through a real safety binder.`

**Primary CTA**: `Get a Demo` (links to `/demo`)

**Secondary CTA**: `See How It Works` (links to `/how-it-works`)

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| CTA band | `fadeUp` | 20% viewport | Heading + buttons staggered at 100ms per design system |

#### Accessibility

- `<section aria-label="Request a demonstration">`
- Headline is `<h2>` (even though it's a CTA, it's a semantic section)
- Primary CTA: `aria-label="Get a demo of SafeTrekr"`
- Both buttons meet 44x44px minimum touch target

---

## Full Page Scroll Sequence

Summary of sections in scroll order, with background alternation pattern:

| # | Section | Background | Dark? | Approx Height (Desktop) |
|---|---------|-----------|-------|------------------------|
| 1 | Hero | `background` (#e7ecee) | No | ~400px |
| 2 | The Problem We Saw | `card` (#f7f8f8) | No | ~500px |
| -- | Route Divider | `background` (#e7ecee) | No | ~40px |
| 3 | Our Approach | `background` (#e7ecee) | No | ~520px |
| 4 | The Team | `card` (#f7f8f8) | No | ~400px |
| 5 | By the Numbers | `secondary` (#123646) | **YES** | ~480px |
| 6 | Our Mission | `background` (#e7ecee) | No | ~380px |
| 7 | Trusted By | `card` (#f7f8f8) | No | ~360px |
| 8 | CTA Banner | `secondary` (#123646) | **YES** | ~320px |
| -- | Footer | `secondary` (#123646) | N/A (excluded from count) | ~280px |

**Background rhythm**: canvas - card - canvas - card - DARK - canvas - card - DARK - footer

This creates a deliberate visual rhythm: alternating light surfaces build comfortable reading cadence, the dark metrics section provides dramatic emphasis at the page's evidentiary core, and the dark CTA provides finality before footer.

Note: Sections 5 and 8 are dark but separated by two light sections (6 and 7), satisfying the "never adjacent" rule.

---

## Responsive Behavior Summary

### Mobile (< 640px)

- All sections: single column
- Hero headline scales to `text-display-lg` mobile size (~34px via clamp)
- Approach cards: stacked, full-width
- Team cards: stacked, full-width
- Metric StatCards: 2-column grid
- Trusted By cards: 2x2 grid
- CTA buttons: stacked vertically
- All padding reduces per Section Padding Scale (base column)

### Tablet (640px - 1023px)

- Approach cards: 3-column grid (maintained)
- Team cards: stacked or 2-column depending on content availability
- Metric StatCards: 3-column grid (wraps to 2 rows)
- Trusted By cards: 2x2 grid
- CTA buttons: horizontal row

### Desktop (1024px+)

- Full layout as specified in section diagrams
- Content constrained to `container-max` (1280px)
- Generous white space on xl+ viewports

### Wide (1536px+)

- Large margins frame centered content
- Section padding reaches maximum values (py-40 for standard)
- Typography at maximum clamp values

---

## Component Dependency Map

### Existing Design System Components Used

| Component | File | Usage |
|-----------|------|-------|
| `Button` | `components/ui/button.tsx` | CTA in Team section, CTA Band |
| `Eyebrow` | `components/ui/eyebrow.tsx` | All section headers |
| `Badge` | `components/ui/badge.tsx` | None required on this page |
| `Divider` | `components/ui/divider.tsx` | Route divider between sections 2 and 3, mission section divider |
| `StatCard` | `components/marketing/stat-card.tsx` | By the Numbers section |
| `CTABand` | `components/marketing/cta-band.tsx` | Section 8 |
| `DarkAuthoritySection` | `components/marketing/dark-authority-section.tsx` | Section 5 wrapper |
| `SiteHeader` | `components/layout/site-header.tsx` | Page header |
| `SiteFooter` | `components/layout/site-footer.tsx` | Page footer |

### New Page-Specific Components Required

| Component | Proposed File | Description |
|-----------|--------------|-------------|
| `AboutHero` | `app/about/_components/about-hero.tsx` | Hero with story-driven layout (text-only, no visual column) |
| `FoundingNarrative` | `app/about/_components/founding-narrative.tsx` | Long-form editorial section with pull quote |
| `ApproachPillars` | `app/about/_components/approach-pillars.tsx` | 3-column pillar cards (could use `FeatureCard` internally) |
| `TeamSection` | `app/about/_components/team-section.tsx` | Founder + analyst team cards with placeholder support |
| `MetricsShowcase` | `app/about/_components/metrics-showcase.tsx` | Custom dark-surface metric grid with primary + secondary rows |
| `MissionStatement` | `app/about/_components/mission-statement.tsx` | Centered mission + vision layout with decorative divider |
| `TrustedBySection` | `app/about/_components/trusted-by-section.tsx` | Org type grid with disclaimer |

### Shared Utilities Required

| Utility | File | Purpose |
|---------|------|---------|
| `fadeUp`, `fadeIn`, `cardReveal`, `staggerContainer` | `lib/motion.ts` | Framer Motion presets (already defined in design system) |
| `counterAnimate` | `lib/motion.ts` | Number counter animation for StatCard |
| `routeDraw` | `lib/motion.ts` | SVG path animation for route divider |

---

## Performance Considerations

| Metric | Budget | Strategy |
|--------|--------|----------|
| LCP | < 2.5s | Hero text is the LCP candidate. No images in hero. Fonts loaded via `next/font` with `display: swap`. |
| CLS | < 0.1 | All sections have fixed/predictable heights. No dynamic content shifts. Clamp typography prevents layout shift on hydration. |
| FID | < 100ms | Minimal JavaScript on this page. Framer Motion animations are progressive enhancement. |
| Total JS | Minimal | No interactive components until the CTA buttons. No forms on this page. |
| Font loading | < 100KB total | Plus Jakarta Sans (display) + Inter (body) only. JetBrains Mono lazy-loaded for StatCard values. |

**SSG**: This page is statically generated at build time. No server-side data fetching. Metric values (104, 5, 17, etc.) are hardcoded constants updated during deployment when product data changes.

---

## Accessibility Checklist (Page-Specific)

- [ ] Single `<h1>` on the page (Hero headline)
- [ ] Heading hierarchy: h1 (Hero) > h2 (Problem, Approach, Team, Metrics, Mission, Trusted By, CTA) > h3 (card titles)
- [ ] All sections have `aria-labelledby` pointing to their heading
- [ ] Skip-nav link targets `#main-content` (provided by SiteHeader)
- [ ] `<main id="main-content">` wraps all page content
- [ ] Pull quote uses `<blockquote>` semantically
- [ ] Counter animations provide immediate final value for screen readers
- [ ] All color pairs meet WCAG 2.2 AA contrast ratios (verified via design system matrix)
- [ ] All interactive elements (buttons, links) have 44x44px minimum touch targets
- [ ] `prefers-reduced-motion`: all Framer Motion animations disabled, content renders immediately
- [ ] Dark section text: `dark-text-primary` on `secondary` = 11.6:1 (PASS), `dark-text-secondary` on `secondary` = 7.0:1 (PASS)
- [ ] Focus-visible rings visible on both light and dark sections
- [ ] Page has `<nav aria-label="Breadcrumb">` -- SKIP (L1 page, no breadcrumbs per IA)
- [ ] JSON-LD Organization schema present and valid

---

## Implementation Sequence

Recommended build order based on dependency graph:

1. **Page shell** -- `app/about/page.tsx` with metadata export, `<main>` wrapper, section ordering
2. **AboutHero** -- Text-only, no dependencies beyond Eyebrow and motion presets
3. **FoundingNarrative** -- Text-only, uses Divider for pull quote border
4. **ApproachPillars** -- Uses FeatureCard (or simplified version without link)
5. **MissionStatement** -- Text-only, uses Divider
6. **TrustedBySection** -- Simple cards, minimal logic
7. **TeamSection** -- Requires placeholder/conditional logic for founder data
8. **MetricsShowcase** -- Uses StatCard with counter animation, wrapped in DarkAuthoritySection
9. **CTABand** -- Drop-in component, just configure props
10. **Route Divider** -- SVG path animation, can be added last as enhancement

---

## Design Rationale Ledger

| Decision | User Need | Metric Targeted | Evidence Source | Confidence |
|----------|-----------|-----------------|-----------------|------------|
| Text-only hero (no image/visual) | Evaluators need to understand WHY this company exists, not what the product looks like | Time on page, scroll depth | IA directive: "Story-driven. Not feature-focused." | High |
| Pull quote with left border accent | Break long narrative, create visual anchor point | Scroll depth past Section 2 | Editorial design pattern for long-form persuasion | High |
| 3-pillar card layout (not feature list) | Board members scanning for "what makes this different" | Section completion rate | Approach framed as philosophy, not pitch per IA | High |
| Dark section for metrics (not mission) | Metrics section is the evidentiary core -- needs maximum visual weight | Trust score, evaluation progression | DarkAuthoritySection rules: "appropriate for trust/proof modules, data showcases" | High |
| "Verifiable. Not Vanity." headline | Counter skepticism about marketing metrics | Trust score with evaluators | IA directive: "Only use real numbers from the product database" | High |
| Org type cards instead of logos | Cannot fabricate logos; types demonstrate breadth without dishonesty | Trust -- no credibility damage from fake logos | IA: "No fabricated logos or names" | High |
| Founder card with placeholder support | Founder content may not be ready at launch | Launch timeline risk mitigation | Implementation flexibility requirement | Medium |
| Centered mission statement with display typography | Mission is the emotional peak -- needs typographic ceremony | Emotional resonance, brand recall | Editorial Intelligence register (20%) elevated here | High |
| Two CTAs (Demo + How It Works) | Evaluators at different stages -- some ready to demo, some still learning | CTA click-through rate | IA: Primary "Get a Demo", Secondary "See How It Works" | High |
