# High-Fidelity Mockup Specifications: Higher Education & Corporate/Sports Solutions Pages

**URLs**: `/solutions/higher-education` and `/solutions/corporate`
**Version**: 1.0
**Date**: 2026-03-24
**Status**: Implementation-ready mockup specification
**Page Type**: Segment Landing Pages (SSG) -- L2 hierarchy
**Canonical Source**: DESIGN-SYSTEM.md v1.0, INFORMATION-ARCHITECTURE.md v1.0.0, mockup-church-solutions.md v1.0 (structural template)

> Both pages follow the 10-section scroll rhythm established by the Church/Missions Solutions page. Each section uses the same component structure, animation patterns, and accessibility contracts. Only the content, vocabulary, and segment-specific framing change. This document specifies both pages in full -- Higher Education first, then Corporate/Sports.

---

# PART ONE: Higher Education Solutions

**URL**: `/solutions/higher-education`

> This page converts study abroad directors, international education office staff, risk managers, provosts, Clery Act compliance officers, and Title IX coordinators. Higher-education-specific vocabulary is mandatory throughout: study abroad, Clery Act, Title IX, institutional reputation, international programs, program provider, faculty-led programs. The core positioning is explicit: SafeTrekr is a complement to existing study abroad systems, not a replacement.

---

## Page Metadata

| Property | Value |
|----------|-------|
| `<title>` | `Study Abroad Safety for Higher Education -- SafeTrekr` |
| `meta description` | `SafeTrekr assigns a professional safety analyst to review every study abroad program your institution sends -- across 17 dimensions of risk. Government intelligence. Clery Act documentation. Starting at $1,250 per international program.` |
| `og:title` | `Study Abroad Safety Built for Higher Education` |
| `og:description` | `Professional analyst review, government intelligence, and audit-ready documentation for every study abroad program. Complements your existing systems.` |
| `og:image` | `/og/solutions-higher-education.png` (1200x630, higher-ed-specific composition) |
| `og:type` | `website` |
| JSON-LD | `FAQPage` schema with 12 higher-ed-specific Q&As (see Section 9) |
| Breadcrumb JSON-LD | `Home > Solutions > Higher Education` |
| Canonical | `https://safetrekr.com/solutions/higher-education` |
| Redirects | `/solutions/higher-ed`, `/solutions/universities`, `/higher-education` all 301 to canonical |

---

## Section Rhythm (Scroll Order)

```
 1. Hero                         (light, bg-background)
 2. Trust Metrics Strip           (light, bg-card, border-y)
 3. The Challenge                 (light, bg-background)
 4. How SafeTrekr Solves It       (light, bg-background, bg-dot-grid)
 5. Sample Binder Preview         (light, bg-primary-50)
 6. DARK: Proof Points            (bg-secondary) -- 1st dark section
 7. Pricing Context               (light, bg-background)
 8. Compliance & Trust            (light, bg-card)
 9. Common Questions              (light, bg-background)
10. DARK: CTA Band                (bg-secondary) -- 2nd dark section
11. Footer                        (bg-secondary -- always dark, not counted)
```

**Dark section validation**: 2 dark sections (positions 6 and 10), never adjacent, separated by 3 full light sections with `py-24`+ padding each. Compliant with design system 12.2 rhythm rules.

---

## Section 1: Hero

### Layout

**Component**: Custom segment hero (variant of `HeroSection`)
**Background**: `bg-background` (#e7ecee)
**Padding**: `pt-16 pb-20` (mobile) scaling to `pt-28 pb-36` (2xl) per section padding scale

**Desktop (>= lg)**: 12-column grid.
- Text column: 6 columns, left-aligned
- Visual column: 6 columns, right-aligned

```
+--------------------------------------------------------------+
| Breadcrumb: Home > Solutions > Higher Education              |
+--------------------------------------------------------------+
|                                                              |
|  [Eyebrow]                    +---------------------------+  |
|                               |                           |  |
|  [Headline -- 2 lines max]   |   STUDY ABROAD BINDER     |  |
|                               |   COMPOSITION             |  |
|  [Subheadline -- 3 lines]    |                           |  |
|                               |   (Stacked document with  |  |
|  [CTA Primary] [CTA Sec.]    |    map + review overlay)  |  |
|                               |                           |  |
|                               +---------------------------+  |
|                                                              |
+--------------------------------------------------------------+
```

**Tablet (md-lg)**: Stacked. Text above, composition below (scaled to 80% width, centered).
**Mobile (< md)**: Stacked. Text above. Simplified visual: single document preview card with study abroad binder cover.

### Content

| Element | Content | Style |
|---------|---------|-------|
| Breadcrumb | `Home / Solutions / Higher Education` | `.text-body-sm text-muted-foreground mb-6`, links in `text-primary-700` |
| Eyebrow | `STUDY ABROAD SAFETY` | `.text-eyebrow text-primary-700`, leading `GraduationCap` icon (16px, `primary-700`) |
| Headline | `Your Study Abroad Programs Deserve a Safety Analyst` | `.text-display-xl text-foreground max-w-[20ch]` |
| Subheadline | `SafeTrekr brings professional safety review to every study abroad program, faculty-led trip, and international research expedition your institution sends. Government intelligence. 17-section analyst review. Clery Act-ready documentation that complements your existing study abroad systems -- not replaces them.` | `.text-body-lg text-muted-foreground max-w-[50ch] mt-6` |
| CTA Primary | `Download Study Abroad Sample Binder` | `Button variant="primary" size="lg"`, `Download` icon left |
| CTA Secondary | `Get a Demo` | `Button variant="secondary" size="lg"`, `ArrowRight` icon right |
| CTA Spacing | `flex flex-wrap gap-4 mt-8` | Stacked full-width on < sm, horizontal on >= sm |

### Visual Composition (Right Column)

A study-abroad-specific variant of the `DocumentPreview` component overlaid on a subtle map fragment.

**Layer 1 -- Map Fragment (Base)**:
- Dimensions: 480x360px desktop, aspect-ratio preserved smaller
- Desaturated map tile showing a Western European region (15% saturation)
- Single curved route path in `primary-500` (3px stroke) connecting two cities
- 3 waypoint circles: departure university, primary program city, secondary excursion city
- `rounded-xl shadow-lg border border-border overflow-hidden`
- Entry animation: `scaleIn` (800ms, spring)

**Layer 2 -- Study Abroad Binder Preview (Overlaid upper-right)**:
- `DocumentPreview` component customized:
  - Eyebrow: "Study Abroad Program"
  - Title: "Safety Binder"
  - Badge: "17 Sections Reviewed" in `Badge variant="default"`
  - 2 sample line items: "Host Institution Verification -- Completed", "Emergency Medical Facilities -- Verified"
  - SHA-256 hash snippet in `mono-sm`
- `rounded-xl bg-white shadow-xl border border-border p-5`
- Offset: overlaps map by 40px bottom-right
- Entry animation: `documentStack` (staggered 200ms after map)

**Layer 3 -- Status Badge (Lower-left of map)**:
- `MotifBadge motif="readiness"` showing "Program Ready"
- Entry animation: `markerPop` (400ms delay)

### Accessibility Notes

- Breadcrumb: `<nav aria-label="Breadcrumb">` with `<ol>` and `aria-current="page"` on last item
- Hero visual composition: `aria-hidden="true"` (decorative) with a visually hidden `<p>` describing the visual: "Composed interface showing a study abroad safety binder with map intelligence, analyst review status, and evidence documentation."
- Headline: `<h1>` (only h1 on page)
- CTAs: Both meet 44x44px minimum touch target
- Focus order: Breadcrumb links, then headline (skip -- non-interactive), primary CTA, secondary CTA
- `prefers-reduced-motion`: All composition animations disabled; elements render in final state immediately

---

## Section 2: Trust Metrics Strip

### Layout

**Component**: `TrustMetricsStrip`
**Background**: `bg-card border-y border-border py-12`
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

### Content

| Value | Label |
|-------|-------|
| `5` | Government Intel Sources |
| `17` | Safety Review Sections |
| `3-5` | Day Turnaround |
| `AES-256` | Encryption Standard |
| `SHA-256` | Evidence Chain |

### Grid Behavior

| Breakpoint | Columns |
|------------|---------|
| < md | 2 columns, third wraps |
| md-lg | 3 columns |
| >= lg | 5 columns (single row) |

### Animation

- Entire strip: `fadeIn` on scroll (20% viewport intersection)
- Numeric values: `counterAnimate` (count from 0 over 1.5s)
- `AES-256` and `SHA-256`: fade in (string values)

### Accessibility Notes

- `StatCard` values: Screen readers receive final value immediately via `aria-label` (no animation dependency)
- "3-5" announced as "3 to 5 day turnaround"
- Section: `<section aria-label="Platform capabilities">`

---

## Section 3: The Challenge

### Layout

**Background**: `bg-background`
**Padding**: Standard section padding (`py-12` mobile to `py-32` 2xl)
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

**Desktop (>= lg)**: 2-column layout.
- Left column (5 cols): Section header + narrative copy
- Right column (7 cols): Status quo contrast cards (2x2 grid)

**Tablet/Mobile (< lg)**: Stacked. Header + copy above, cards below in single column (mobile) or 2-col grid (tablet).

### Content

**Eyebrow**: `THE REALITY TODAY`
**Eyebrow style**: `.text-eyebrow text-primary-700`, `AlertTriangle` icon (16px)

**Headline**: `Study Abroad Safety Cannot Live in a Spreadsheet`
**Headline style**: `.text-display-md text-foreground max-w-[28ch]`

**Body copy**:

> Every year, universities send thousands of students to unfamiliar countries through study abroad programs, faculty-led trips, and international research placements. Most institutions rely on third-party program providers to handle safety -- but when the State Department issues a travel advisory, when a natural disaster strikes, when a student is hospitalized overseas, the institution's name is on the Clery Act report. Not the provider's.

**Body style**: `.text-body-lg text-muted-foreground max-w-prose mt-6`

**Closing line**:

> Your institution's reputation is not something a third-party provider can protect for you.

**Closing style**: `.text-body-lg text-foreground font-medium max-w-prose mt-4`

### Status Quo Contrast Cards (Right Column)

Four cards showing what higher education currently relies on. Each card: `bg-card rounded-xl border border-border p-6 shadow-card`.

**Card 1: Provider-Dependent Safety**
- Icon: `FileText` in `muted-foreground`
- Title: `Third-Party Provider Safety Assessments You Cannot Verify`
- Description: `Program providers conduct their own safety reviews of their own programs. Your international education office receives summaries, not source data. When a parent asks what independent verification your institution performed, the honest answer is usually: we relied on the provider's word.`

**Card 2: Spreadsheet Risk Assessment**
- Icon: `Shield` in `muted-foreground`
- Title: `Risk Matrices Built from Travel Advisories and Google Searches`
- Description: `Study abroad offices compile safety information from State Department advisories, news articles, and colleague networks. No standardized methodology. No government intelligence beyond what is publicly searchable. No audit trail documenting the assessment process.`

**Card 3: Clery Act Exposure**
- Icon: `Users` in `muted-foreground`
- Title: `Clery Act Reporting Gaps for Off-Campus International Programs`
- Description: `The Clery Act requires timely reporting of crimes and safety incidents at institution-controlled locations -- including study abroad sites. Many institutions lack the documentation infrastructure to demonstrate they monitored conditions at international program locations before incidents occurred.`

**Card 4: Title IX Across Borders**
- Icon: `AlertCircle` in `muted-foreground`
- Title: `Title IX Obligations That Do Not Stop at the Border`
- Description: `Title IX protections follow students abroad. If an incident occurs during a faculty-led program in Florence, your institution's response is evaluated by the same standards as an on-campus incident. Without documented safety planning and emergency protocols, the institutional exposure is significant.`

### Card Layout

| Breakpoint | Layout |
|------------|--------|
| < sm | 1 column, stacked |
| sm-md | 2 columns |
| md-lg | 2 columns |
| >= lg | 2x2 grid within the right 7 columns |

### Animation

- Section heading group: `fadeUp` staggered at 80ms (eyebrow, headline, body, closing line)
- Cards: `staggerContainer + cardReveal` at 80ms intervals
- Entry trigger: 20% viewport intersection

### Accessibility Notes

- Section: `<section aria-labelledby="challenge-heading">`
- Headline: `<h2 id="challenge-heading">`
- Card icons: `aria-hidden="true"` (decorative, meaning conveyed by text)
- Cards are not interactive (no link, no hover state beyond shadow) -- purely informational
- Status quo cards use `muted-foreground` icons, NOT `safety-red` or `destructive` -- this is respectful framing, not fear-based

---

## Section 4: How SafeTrekr Solves It

### Layout

**Background**: `bg-background` with `bg-dot-grid` subtle pattern overlay
**Padding**: Standard section padding
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

**Structure**: Section header (centered) + ProcessTimeline (3-act) + FeatureCard grid (2x2)

### Section Header

**Eyebrow**: `HOW SAFETREKR WORKS`
**Eyebrow style**: `.text-eyebrow text-primary-700`, centered, `Shield` icon

**Headline**: `Professional Safety Review for Every International Program`
**Headline style**: `.text-display-md text-foreground text-center max-w-[28ch] mx-auto`

**Subheadline**: `SafeTrekr complements your existing study abroad management systems. We handle the independent safety verification your institution cannot get from a program provider.`
**Subheadline style**: `.text-body-lg text-muted-foreground text-center max-w-prose mx-auto mt-4`

### Three-Act ProcessTimeline (Higher Ed Flavor)

**Component**: `ProcessTimeline`

**Desktop (>= lg)**: Horizontal 3-column grid with numbered step connectors.
**Mobile (< lg)**: Vertical `TimelineStep` stack.

| Step | Number | Title | Description |
|------|--------|-------|-------------|
| Act 1 | 1 | Intelligence Gathering | Before your students arrive in-country, we pull real-time safety data from NOAA, USGS, CDC, ReliefWeb, and GDACS -- the same sources humanitarian agencies use to assess field conditions. Weather patterns at every program location. Seismic risk. Disease advisories. Political stability indicators. Every data point scored, not just collected. |
| Act 2 | 2 | Analyst Safety Review | A trained safety analyst reviews every detail of your study abroad program across 17 sections -- host institution vetting, housing safety, in-country transportation, emergency medical facilities, evacuation routes, communication infrastructure, mental health resources, and more. Independent of the program provider. Independent of marketing materials. |
| Act 3 | 3 | Documented Evidence Binder | Your institution receives a complete safety binder -- every review finding, every government data source, every decision documented with tamper-evident audit trails. When a parent asks what safety review was conducted, when the provost needs documentation for a Clery Act filing, when risk management requires evidence of due diligence for an insurance claim -- you hand them the binder. |

**Step card style**: Numbered circles (`h-10 w-10 rounded-full bg-primary-100 text-primary-700 font-semibold`), connectors (`1px border-border` horizontal line), heading (`.text-heading-md`), description (`.text-body-md text-muted-foreground max-w-[45ch]`).

### Feature Cards (Higher Ed-Specific Benefits)

**Component**: `FeatureGrid` with 4 `FeatureCard` items
**Layout**: `grid sm:grid-cols-2 gap-6`, below the ProcessTimeline with `mt-16`

**Card 1: Analyst Safety Review**
- `motifType`: `review`
- Icon: `ClipboardCheck` in `primary-700`
- Title: `Every Program Location Reviewed by an Independent Analyst`
- Description: `Your study abroad office focuses on student success. Our analyst focuses on safety. 17 sections covering host institutions, housing, transportation, emergency contacts, evacuation routes, local hospitals, mental health resources, and more -- independent of what the program provider tells you.`
- Link: `Learn about analyst review` -> `/platform/analyst-review`

**Card 2: Risk Intelligence**
- `motifType`: `route`
- Icon: `MapPin` in `primary-700`
- Title: `Government Data on Every Destination Your Students Visit`
- Description: `Real-time intelligence from 5 government sources -- not a travel advisory summary. NOAA weather data, CDC health advisories, USGS seismic activity, and two international humanitarian agencies. Risk scored with Monte Carlo simulation so you understand probability, not just State Department color codes.`
- Link: `Learn about risk intelligence` -> `/platform/risk-intelligence`

**Card 3: Trip Safety Binder**
- `motifType`: `record`
- Icon: `FileText` in `foreground`
- Title: `Clery Act-Ready Documentation for Your Institution`
- Description: `Every finding documented. Every data source cited. Every decision recorded with SHA-256 tamper-evident audit trails. The documentation your risk management office needs for Clery Act compliance, the evidence your general counsel needs for liability defense, and the proof parents need to trust your institution with their student.`
- Link: `Learn about the safety binder` -> `/platform/safety-binder`

**Card 4: Mobile Field Operations**
- `motifType`: `readiness`
- Icon: `Activity` in `safety-green`
- Title: `Emergency Protocols and Check-Ins for Every Faculty Leader and Resident Director`
- Description: `During your program, every faculty leader and resident director gets the SafeTrekr mobile app -- live geofencing, muster check-ins, rally point navigation, SMS broadcast, and morning/evening safety briefings. When a student does not check in, your international education office knows immediately -- not 12 hours later.`
- Link: `Learn about mobile operations` -> `/platform/mobile-app`

### Card Behavior

- Entire card is clickable (`group` pattern, `<a>` wrapper)
- Hover: `shadow-card` to `shadow-card-hover`, `translateY(-2px)`, 200ms `ease-default`
- "Learn about..." link text: `.text-body-sm font-medium text-primary-700` with `ArrowRight` icon that translates 4px on parent hover

### Animation

- Section header: `fadeUp` stagger at 80ms
- ProcessTimeline: `staggerContainer` at 120ms per step
- FeatureCards: `staggerContainer + cardReveal` at 80ms

### Accessibility Notes

- Section: `<section aria-labelledby="solution-heading">`
- Headline: `<h2 id="solution-heading">`
- ProcessTimeline steps: Ordered `<ol>` with step numbers as `aria-label` context
- FeatureCards: Each card title is `<h3>`. Card link wraps entire card as single interactive target. Links have descriptive text (not "Learn more" alone)
- MotifBadge icons: `aria-hidden="true"`

---

## Section 5: Sample Binder Preview

### Layout

**Background**: `bg-primary-50` (#f1f9f4) -- lightest brand wash
**Padding**: Standard section padding
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

**Desktop (>= lg)**: 2-column layout via `FeatureShowcase` (text left, visual right).
**Mobile (< lg)**: Stacked -- visual above text.

### Content (Text Column)

**Eyebrow**: `SAMPLE BINDER`
**Eyebrow style**: `.text-eyebrow text-primary-700`, `FileText` icon

**Headline**: `See Exactly What Your Provost and Risk Management Office Will Receive`
**Headline style**: `.text-display-md text-foreground max-w-[28ch]`

**Body**:

> Every SafeTrekr review produces a comprehensive safety binder customized to your study abroad program. This is not a generic country profile or a program provider's marketing summary. It is the documented output of an independent analyst reviewing your specific program -- your destinations, your dates, your housing, your host institutions.

**Body style**: `.text-body-lg text-muted-foreground max-w-prose mt-6`

**Binder contents list** (with `Check` icons in `primary-500`):

1. `Destination risk assessment with government intelligence data`
2. `Host institution and housing safety verification`
3. `Emergency medical facility locations including mental health resources`
4. `Evacuation routes and contingency plans per program location`
5. `In-country transportation safety evaluation`
6. `Communication infrastructure and emergency contact protocols`
7. `Tamper-evident audit trail with SHA-256 hash chain`

**List style**: `space-y-3 mt-6`, each item: `flex items-start gap-3`, check icon `h-5 w-5 text-primary-500 mt-0.5 shrink-0`, text `.text-body-md text-muted-foreground`

**CTA**: `Download the Study Abroad Sample Binder`
**CTA style**: `Button variant="primary" size="lg" className="mt-8"`, `Download` icon left

**CTA subtext**: `See a real safety binder output. Gated with email -- we will not spam you.`
**Subtext style**: `.text-body-sm text-muted-foreground mt-2`

### Visual Column (Binder Preview)

A composed visual showing 3-5 stacked page thumbnails from the Study Abroad sample binder.

**Structure**:
- 3 offset page cards (fanning effect) creating depth
- Front page: `bg-white rounded-lg shadow-xl border border-border p-6 w-[340px]`
  - Header: "SafeTrekr" logo mark (24px) + "Study Abroad Program" eyebrow
  - Title: "Safety Binder" in `.text-heading-md`
  - Subtitle: "Barcelona -- Madrid -- Seville"
  - Date: "September 1 -- December 15, 2026"
  - Status badge: `Badge variant="default"` "17 Sections Reviewed"
  - Decorative map thumbnail (60px height, `rounded-md overflow-hidden opacity-80`)
  - 3 section preview lines (abbreviated): "1. Destination Overview... 2. Host Institution... 3. Emergency Contacts..."
- Middle page: offset -8px Y, -6px X, `opacity-90`, slight rotation (-1deg)
- Back page: offset -16px Y, -12px X, `opacity-70`, slight rotation (-2deg)

**Entry animation**: `documentStack` with 200ms stagger between layers

### Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| < lg | Stacked: binder preview above (centered, max-w-[380px]), text below |
| >= lg | Side-by-side: text left (5 cols), visual right (7 cols) |

### Animation

- Text column: `fadeUp` stagger
- Binder preview: `documentStack` with page stagger
- Entry trigger: 20% viewport intersection

### Accessibility Notes

- Section: `<section aria-labelledby="binder-preview-heading">`
- Headline: `<h2 id="binder-preview-heading">`
- Binder visual: `aria-hidden="true"` with visually hidden description: "Preview of a Study Abroad Program safety binder showing cover page with destinations, review sections, and analyst verification status."
- CTA download: Announces as "Download the Study Abroad Sample Binder, opens email-gated form"
- Checklist: `<ul>` with descriptive list items

---

## Section 6: Proof Points (DARK)

### Layout

**Component**: `DarkAuthoritySection` wrapper
**Background**: `secondary` (#123646) with `[data-theme="dark"]` token overrides
**Padding**: Standard section padding
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

**Structure**: Section header (centered) + 3-column stat cards + proof narrative

### Content

**Eyebrow**: `BY THE NUMBERS`
**Eyebrow style**: `.text-eyebrow` (inherits `dark-accent` #6cbc8b via dark override)

**Headline**: `Independent Verification, Not Provider Self-Assessment`
**Headline style**: `.text-display-md` (renders `dark-text-primary` #f7f8f8, 11.6:1 contrast)

### Stat Cards

3 stat cards in a row on dark surface. Card style: `bg-[var(--color-dark-surface)] rounded-xl border border-[var(--color-dark-border)] p-8 text-center`.

| Value | Label | Annotation |
|-------|-------|------------|
| `17` | Analyst Review Sections | Every program reviewed across host institutions, housing, transportation, emergency contacts, evacuation routes, health advisories, mental health resources, and more |
| `5` | Government Intelligence Sources | NOAA, USGS, CDC, ReliefWeb, GDACS -- the same sources humanitarian agencies rely on to assess field conditions |
| `3-5 Days` | Submission to Binder Delivery | Professional review and documentation delivered before your students depart for their program |

**Value style**: `.text-display-md font-mono` in `dark-text-primary`
**Label style**: `.text-eyebrow` in `dark-text-secondary` (7.0:1 contrast)
**Annotation style**: `.text-body-sm` in `dark-text-secondary`, `mt-3`

### Stat Card Grid

| Breakpoint | Columns |
|------------|---------|
| < md | 1 column, stacked |
| md-lg | 3 columns |
| >= lg | 3 columns |

### Proof Narrative (Below Stats)

**Centered block, max-width `prose`**:

> The difference between an institution that documented its safety diligence and one that assumed a program provider handled it is not measured in intention. It is measured in the filing cabinet. SafeTrekr produces the independent, third-party documentation that transforms your institution's commitment to student safety from an unverifiable assertion into defensible evidence.

**Style**: `.text-body-lg` in `dark-text-secondary` (7.0:1 contrast), `text-center max-w-prose mx-auto mt-12`

### Note on Testimonials

**No testimonial block at launch.** Per design system non-negotiable: no fabricated quotes. When real higher-education testimonials are obtained, a testimonial card slot exists here with the following structure:
- Quote text in `dark-text-primary`, 20px italic
- Attribution: name, title, institution in `dark-text-secondary`
- Placeholder: `{/* Testimonial slot -- populate when verified customer quotes are available */}`

### Animation

- Entire dark section: `fadeIn` (background fades, then content staggers)
- Stat cards: `staggerContainer` at 120ms
- Stat values: `counterAnimate` (1.5s count from 0)
- Proof narrative: `fadeUp` (200ms delay after stats)

### Accessibility Notes

- Section: `<section aria-labelledby="proof-heading" data-theme="dark">`
- Headline: `<h2 id="proof-heading">`
- Stat cards: Each `StatCard` uses `aria-label` with full context (e.g., "17 analyst review sections per program")
- All text meets WCAG AA: `dark-text-primary` 11.6:1, `dark-text-secondary` 7.0:1, `dark-accent` 4.8:1
- `counterAnimate` shows final value immediately for screen readers

---

## Section 7: Pricing Context

### Layout

**Background**: `bg-background`
**Padding**: Standard section padding
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

**Desktop (>= lg)**: Section header left-aligned + 3-column pricing scenario cards + cost comparison block.
**Mobile (< lg)**: Stacked.

### Section Header

**Eyebrow**: `PRICING`
**Eyebrow style**: `.text-eyebrow text-primary-700`

**Headline**: `Professional Safety Review at a Fraction of Your Program Cost`
**Headline style**: `.text-display-md text-foreground max-w-[28ch]`

**Body**:

> A professional safety review for a semester-long study abroad program costs less than one percent of a typical participant's program fee. That is the cost of independent, documented safety verification for every student your institution sends abroad.

**Body style**: `.text-body-lg text-muted-foreground max-w-prose mt-4`

### Pricing Scenario Cards

3 cards showing real pricing math. Each card: `bg-card rounded-2xl border border-border p-8 shadow-card`.

**Card 1: Faculty-Led Short Program**
- Badge: `Badge variant="default"` "Most Common"
- Price: `$1,250`
- Price style: `.text-display-lg text-foreground`
- Unit: `per international program`
- Unit style: `.text-body-md text-muted-foreground`
- Context line 1: `$50 per student for a group of 25`
- Context line 2: `Less than 1% of a $12,000 program fee`
- Context style: `.text-body-sm text-muted-foreground mt-4 space-y-1`
- Includes list (check icons in `primary-500`):
  - `17-section independent analyst review`
  - `Government intelligence risk scoring`
  - `Complete safety binder with audit trail`
  - `Mobile app access for faculty leaders`
  - `AM/PM safety briefings during program`

**Card 2: Semester-Long Study Abroad**
- Badge: none
- Price: `$1,250`
- Unit: `per semester program`
- Context line 1: `$42 per student for a group of 30`
- Context line 2: `Less than 0.3% of a $15,000 semester program fee`
- Context line 3: `Includes mid-semester condition updates`
- Includes: same list as short program + `Mid-semester intelligence refresh`

**Card 3: Multi-Program Institution**
- Badge: none
- Price: `Custom`
- Unit: `volume pricing for 15+ programs per year`
- Context line 1: `A university sending 15 international programs per year:`
- Context line 2 (calculated): `$18,750/year for complete safety coverage`
- Context line 3: `Volume discounts available for 15+ programs annually`
- CTA inside card: `Get a Custom Quote` (Button variant="secondary" size="default")

### Pricing Card Grid

| Breakpoint | Layout |
|------------|--------|
| < md | 1 column, stacked, faculty-led card first |
| md-lg | 3 columns, equal width |
| >= lg | 3 columns, equal width |

### Cost-of-Inaction Comparison Block

Below the pricing cards, `mt-12`. `bg-card rounded-xl border border-border p-8`.

**Headline**: `The Cost of Not Having an Independent Safety Review`
**Headline style**: `.text-heading-md text-foreground`

**Comparison table** (2 columns):

| Without SafeTrekr | With SafeTrekr |
|-------------------|----------------|
| Study abroad office compiles risk assessments from provider marketing materials and State Department advisories. No independent verification. No standardized methodology. | Independent analyst completes 17-section review using 5 government intelligence sources. Methodology documented and auditable. |
| Clery Act documentation assembled retroactively after an incident. No pre-departure evidence of safety monitoring at program sites. | Clery Act-ready documentation delivered before students depart. Every program site independently assessed and documented. |
| If something goes wrong: "We relied on the program provider's assessment" is your institutional defense. | If something goes wrong: a complete evidence binder with every decision documented, every data source cited, and tamper-proof integrity. |
| Average cost of a single student medical evacuation from Europe: $50,000-$100,000. Average litigation settlement for study abroad incidents: $500K-$2M. | $1,250 per program for documented proof your institution conducted independent, professional safety verification. |

**Table style**: On desktop, a 2-column grid. Left column items have `AlertTriangle` icon in `muted-foreground`. Right column items have `Check` icon in `primary-500`. On mobile, each pair stacks vertically with a visual divider.

**Footer link**: `View full pricing details` -> `/pricing`
**Footer link style**: `.text-body-sm font-medium text-primary-700` with `ArrowRight` icon

### Animation

- Section header: `fadeUp` stagger
- Pricing cards: `staggerContainer + cardReveal` at 80ms
- Comparison block: `fadeUp` (200ms delay)

### Accessibility Notes

- Section: `<section aria-labelledby="pricing-heading">`
- Headline: `<h2 id="pricing-heading">`
- Pricing cards: Price values use `aria-label` with full context (e.g., "$1,250 per international study abroad program")
- Comparison: Use `<dl>` (definition list) or `<table>` with proper `<th>` headers for the comparison. `<caption>` for table: "Comparison of study abroad safety approaches"
- No animation on pricing cards (per design system rule: "Stability and readability are paramount")
- All monetary values are presented as text, not images

---

## Section 8: Compliance & Trust

### Layout

**Background**: `bg-card`
**Padding**: Standard section padding
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

**Structure**: Section header (centered) + badge grid + institutional narrative + procurement link

### Section Header

**Eyebrow**: `SECURITY & COMPLIANCE`
**Eyebrow style**: `.text-eyebrow text-primary-700`, `Shield` icon

**Headline**: `Built to Satisfy Your Risk Management Office and General Counsel`
**Headline style**: `.text-display-md text-foreground text-center max-w-[28ch] mx-auto`

### Trust Badge Grid

4 badges in a horizontal row (desktop) or 2x2 grid (mobile). Each badge: `bg-background rounded-xl border border-border p-6 text-center`.

| Badge | Icon | Title | Description |
|-------|------|-------|-------------|
| 1 | `Shield` (32px, `primary-700`) | `AES-256 Encryption` | All data encrypted at rest and in transit. Student information is protected with the same standard used by financial institutions. FERPA-aligned data handling. |
| 2 | `FileText` (32px, `primary-700`) | `SHA-256 Evidence Chain` | Every review finding, every analyst decision, every data source documented with cryptographic integrity. Tamper-evident by design. Audit-ready by default. |
| 3 | `Activity` (32px, `primary-700`) | `SOC 2 Type II` | Audit in progress. We are pursuing SOC 2 Type II certification to validate our security controls. (Status: In Progress) |
| 4 | `ClipboardCheck` (32px, `primary-700`) | `Clery Act Documentation Support` | Every binder is structured to provide the safety documentation your institution needs for Clery Act reporting and Title IX compliance when incidents occur at international program locations. |

**Badge grid layout**:

| Breakpoint | Columns |
|------------|---------|
| < sm | 1 column |
| sm-md | 2 columns |
| >= md | 4 columns |

### Institutional Narrative Block

Below the badges, `mt-12`. Centered text block.

**Headline**: `Your Risk Management Office Will Thank You`
**Headline style**: `.text-heading-md text-foreground text-center`

**Body**:

> Most universities accept program provider assurances as their primary safety verification for international programs. The problem is that a provider's self-assessment is not independent evidence. When a parent's attorney asks what independent safety review your institution conducted before sending their student abroad, a provider's marketing materials are not a defensible answer. SafeTrekr produces the independent documentation: a professional 17-section safety review backed by government intelligence data, documented with tamper-evident audit trails. That is the evidence your general counsel and risk management office need.

**Body style**: `.text-body-lg text-muted-foreground text-center max-w-prose mx-auto mt-4`

### Complement-Not-Replace Statement

Below the narrative, `mt-8`. Centered text block with a subtle `bg-primary-50 rounded-xl border border-primary-200 p-6 max-w-prose mx-auto`.

**Text**: `SafeTrekr integrates alongside your existing study abroad management systems -- Terra Dotta, Via TRM, StudioAbroad, or your institution's custom solution. We do not replace your program management workflow. We add the independent safety verification layer that no program management system provides.`

**Text style**: `.text-body-md text-foreground text-center`

### Procurement Link

**Text**: `Institutional buyer? Download our W-9, security questionnaire responses, and insurance documentation.`
**Link**: `Visit our procurement page` -> `/procurement`
**Style**: `.text-body-md text-center mt-8`, link in `text-primary-700 font-medium` with `ArrowRight` icon

### Animation

- Section header: `fadeUp` stagger
- Badge grid: `staggerContainer + cardReveal` at 80ms
- Institutional narrative: `fadeUp` (200ms delay)

### Accessibility Notes

- Section: `<section aria-labelledby="compliance-heading">`
- Headline: `<h2 id="compliance-heading">`
- SOC 2 badge: Clearly states "In Progress" -- honest language per design system non-negotiable
- Badge icons: `aria-hidden="true"` (meaning conveyed by text)
- Trust badges are informational cards, not interactive

---

## Section 9: Common Questions

### Layout

**Component**: `FAQSection`
**Background**: `bg-background`
**Padding**: Standard section padding
**Container**: `max-w-3xl mx-auto px-6 sm:px-8 lg:px-12`

### Section Header

**Eyebrow**: `COMMON QUESTIONS`
**Eyebrow style**: `.text-eyebrow text-primary-700`, centered

**Headline**: `Everything Your International Education Office Will Ask`
**Headline style**: `.text-display-md text-foreground text-center max-w-[28ch] mx-auto`

### FAQ Items (12 Questions)

Uses shadcn/ui `Accordion` primitive, `type="single" collapsible`. Each trigger: `.text-heading-sm text-foreground`. Each content panel: `.text-body-md text-muted-foreground`.

**Q1: Does SafeTrekr replace our existing study abroad management system?**

> No. SafeTrekr is designed to complement systems like Terra Dotta, Via TRM, StudioAbroad, and custom institutional platforms. Your existing system manages program logistics -- applications, enrollment, housing assignments, academic credit. SafeTrekr adds the independent safety verification layer: professional analyst review, government intelligence scoring, and tamper-evident documentation. The safety binder integrates into your existing workflow as an additional document attached to each program's file.

**Q2: How does SafeTrekr handle semester-long programs where conditions may change?**

> Our analyst reviews specifically account for program duration. For semester-long programs, the initial safety binder covers pre-departure conditions. During the program, your faculty leaders and resident directors receive morning and evening safety briefings covering weather changes, political developments, health advisories, and local events. If conditions change significantly -- a political crisis, natural disaster, or public health emergency -- we issue an updated intelligence brief with current data and revised risk scoring.

**Q3: Can we use SafeTrekr for faculty-led short-term programs?**

> Yes. Faculty-led programs of any duration benefit from independent safety review. A two-week faculty-led program in Peru carries the same institutional liability as a semester program in London. Our review covers every program location -- primary sites, field trip destinations, and excursion stops. Many institutions start with SafeTrekr for faculty-led programs because faculty members rarely have formal risk assessment training.

**Q4: How does this help with Clery Act compliance?**

> The Clery Act requires institutions to report crimes and safety incidents at locations controlled by the institution -- including study abroad program sites. SafeTrekr's safety binder documents that your institution conducted a formal safety assessment of program locations before students arrived. If an incident occurs, the binder provides evidence that your institution proactively monitored conditions and identified risks. This is the documentation most institutions are missing from their Clery Act compliance infrastructure for international programs.

**Q5: What about Title IX obligations for programs abroad?**

> Title IX protections follow students to study abroad program locations. If an incident occurs during a program in Florence or Buenos Aires, your institution's response obligations are the same as for an on-campus incident. SafeTrekr's safety binder includes emergency protocol documentation, local law enforcement contacts, medical facility locations, and communication infrastructure assessment -- all the information your Title IX coordinator needs to mount an effective response from thousands of miles away.

**Q6: How quickly do we get the safety binder back?**

> 3-5 business days from program submission to binder delivery. For programs planned months in advance, this timeline integrates naturally into your pre-departure preparation. For faculty-led programs with shorter planning windows, we prioritize submissions to meet departure schedules. If program conditions change after the initial review, our analyst can update the binder with current intelligence data.

**Q7: Can multiple offices access the safety binder?**

> Yes. You control access to each program's safety binder. It can be shared with your international education office, risk management, general counsel, the provost's office, program faculty, and any other stakeholder who needs to review safety preparation. The binder includes a verification hash that confirms the document has not been altered since the analyst completed the review -- providing every stakeholder with confidence in the document's integrity.

**Q8: How does pricing work for institutions with many programs?**

> Each program is priced at $1,250 for international programs. Institutions running 15 or more international programs per year qualify for volume pricing. A university sending 15 study abroad programs annually would pay approximately $18,750 before any volume discount -- less than the cost of a single student medical evacuation. Contact us for a custom quote that reflects your annual program calendar.

**Q9: Does SafeTrekr cover domestic programs and field trips?**

> Yes. While most higher education institutions start with international programs, SafeTrekr reviews domestic programs at $450 per program (day trips) and $750 per program (overnight/multi-day). Geology field courses in remote areas, marine biology programs at coastal stations, and education practicums in urban settings all benefit from professional safety review. The same 17-section analysis applies regardless of destination.

**Q10: What government data sources does SafeTrekr use?**

> Our Risk Intelligence Engine pulls data from five government and international agency sources: NOAA (weather and climate patterns), USGS (seismic and geological hazards), CDC (health advisories and disease outbreaks), GDACS (Global Disaster Alert and Coordination System), and ReliefWeb (UN humanitarian situation reports). Each data source is scored using Monte Carlo simulation to produce probability-weighted risk assessments -- not just binary safe/unsafe classifications.

**Q11: How does SafeTrekr handle programs with multiple sites?**

> Many study abroad programs involve multiple cities, field trip locations, and excursion destinations. Our analyst reviews each site independently -- the safety conditions in Barcelona's city center are different from those at a rural archaeological dig. Each location gets its own risk intelligence assessment. The final binder consolidates all sites into a single, comprehensive document with per-location findings and a unified emergency response plan.

**Q12: Can SafeTrekr handle programs in high-risk regions?**

> Yes. Some of the most academically valuable study abroad destinations are in regions with elevated risk profiles -- Sub-Saharan Africa, Southeast Asia, Central America, the Middle East. Our analyst reviews specifically account for infrastructure gaps, political instability, health system limitations, and communication challenges. The intelligence data from ReliefWeb and GDACS is designed for exactly these regions. The safety binder does not tell you whether to send students -- it documents the risks, mitigations, and emergency protocols so your institution can make an informed decision with defensible documentation.

### JSON-LD Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does SafeTrekr replace our existing study abroad management system?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. SafeTrekr is designed to complement systems like Terra Dotta, Via TRM, StudioAbroad, and custom institutional platforms..."
      }
    }
  ]
}
```

(Full JSON-LD includes all 12 Q&A pairs. Answers truncated to 300 characters for schema with full text in `acceptedAnswer`.)

### Accordion Behavior

- `type="single"`: Only one item open at a time
- `collapsible`: All items can be closed
- Chevron rotates 180deg on open (200ms, `ease-default`)
- Content panel: slide-down animation (300ms, `ease-enter`)

### Animation

- Section header: `fadeUp` stagger
- FAQ items: `staggerContainer` at 60ms intervals
- Entry trigger: 20% viewport intersection

### Accessibility Notes

- Section: `<section aria-labelledby="faq-heading">`
- Headline: `<h2 id="faq-heading">`
- Accordion: `aria-expanded` on each trigger. Content announced on expansion via `aria-controls`.
- Each question is an `<h3>` inside the accordion trigger
- Focus-visible ring (2px, `ring` color) on all triggers
- Keyboard: Enter/Space toggles, ArrowUp/ArrowDown navigates between triggers

---

## Section 10: Conversion CTA Band (DARK)

### Layout

**Component**: `CTABand variant="dark"`
**Background**: `secondary` (#123646) with `[data-theme="dark"]`
**Padding**: `py-20 lg:py-28`
**Container**: Centered content

### Content

| Element | Content | Style |
|---------|---------|-------|
| Eyebrow | `READY?` | `.text-eyebrow` in `dark-accent` (#6cbc8b) |
| Headline | `Protect Your Next Study Abroad Program` | `.text-display-md` in `dark-text-primary` (#f7f8f8) |
| Body | `See exactly what an independently reviewed study abroad program looks like. Download a sample binder or schedule a 30-minute demo with our team.` | `.text-body-lg` in `dark-text-secondary` (#b8c3c7), `max-w-prose mx-auto text-center` |
| CTA Primary | `Get a Demo` | `Button variant="primary-on-dark" size="lg"` (white bg, secondary text) |
| CTA Secondary | `Download Sample Binder` | `Button variant="secondary"` with dark overrides (transparent, white border/text), size="lg" |

**CTA layout**: `flex flex-col sm:flex-row gap-4 justify-center mt-8`

### Animation

- Section: `fadeIn` (background fades)
- Content: `fadeUp` stagger at 100ms (eyebrow, headline, body, CTAs)

### Accessibility Notes

- Section: `<section aria-labelledby="cta-heading" data-theme="dark">`
- Headline: `<h2 id="cta-heading">`
- Both CTAs meet 44x44px minimum touch target
- Contrast: `dark-text-primary` 11.6:1, `dark-text-secondary` 7.0:1, `dark-accent` 4.8:1 -- all PASS WCAG AA
- Focus-visible ring uses `dark-accent` (#6cbc8b) on dark background
- CTA buttons: `aria-label` includes destination context ("Get a Demo -- opens scheduling page", "Download Sample Binder -- opens email-gated download")

---

## Global Page Elements (Higher Education)

### Breadcrumb (Top of Hero)

```
Home  /  Solutions  /  Higher Education
```

- Schema.org BreadcrumbList JSON-LD
- Visual: `.text-body-sm text-muted-foreground`
- Links: `text-primary-700 hover:underline`
- Current page: `text-foreground font-medium` (not linked)
- `<nav aria-label="Breadcrumb">`

### In-Page Navigation (Sticky, appears on scroll)

**Trigger**: Appears after hero scrolls out of viewport.
**Position**: Below sticky site header.
**Style**: `bg-card/90 backdrop-blur-sm border-b border-border py-2`, horizontal scrollable on mobile.

**Anchors**:

| Label | Target |
|-------|--------|
| The Challenge | `#challenge` |
| How It Works | `#how-it-works` |
| Sample Binder | `#sample-binder` |
| Pricing | `#pricing` |
| Security | `#compliance` |
| FAQ | `#faq` |

**Behavior**:
- Active state: `text-primary-700 font-semibold` with 2px bottom border in `primary-500`
- Default: `text-muted-foreground hover:text-foreground`
- Scroll-spy: active state updates based on viewport intersection of target sections
- Smooth scroll on click (respects `prefers-reduced-motion`)

**Responsive**:
- Desktop: Centered horizontal list, all items visible
- Mobile: Horizontal scroll with overflow, `scroll-snap-type: x mandatory`

**Accessibility**:
- `<nav aria-label="Page sections">`
- Links use `aria-current="true"` on active section
- Keyboard: Tab navigates between anchors

---

## SEO Strategy (Higher Education)

### Target Keywords

| Priority | Keyword | Monthly Volume (Est.) | Intent |
|----------|---------|-----------------------|--------|
| Primary | `study abroad safety plan` | 300-500 | Decision |
| Primary | `university travel risk management` | 100-300 | Decision |
| Primary | `study abroad risk assessment` | 200-400 | Decision |
| Secondary | `Clery Act study abroad` | 100-200 | Consideration |
| Secondary | `Title IX international programs` | 50-150 | Consideration |
| Secondary | `study abroad safety documentation` | 50-150 | Decision |
| Long-tail | `how to assess safety for study abroad programs` | 50-100 | Consideration |
| Long-tail | `independent safety review study abroad` | 20-50 | Decision |

### On-Page SEO

- `<h1>`: Contains primary keyword variant ("Your Study Abroad Programs Deserve a Safety Analyst")
- `<h2>`s: Each section heading targets a keyword cluster
- Body copy: Natural keyword density across "study abroad," "safety review," "higher education," "Clery Act," "Title IX," "documentation"
- Internal links: Feature cards link to `/platform/*` pages. Pricing links to `/pricing`. Procurement links to `/procurement`.
- Schema markup: FAQPage JSON-LD (12 Q&As), BreadcrumbList, Organization
- Meta description: 155 characters, includes primary keyword + value proposition + price anchor

---

## Performance Considerations (Higher Education)

| Metric | Budget | Strategy |
|--------|--------|----------|
| LCP | < 1.5s | Hero headline is static HTML. No data fetches. Composition images lazy-loaded below fold. |
| CLS | < 0.05 | All images/compositions have explicit dimensions. Font display: swap with fallback stack. |
| INP | < 100ms | Accordion interactions use CSS transitions (no JS layout recalculation). |
| Total page weight | < 500KB | SSG (no server-side rendering). Minimal JS for accordion + scroll-spy. |
| Map tiles | Lazy-loaded | Hero map uses a static image placeholder, MapLibre loads only if interaction occurs. |
| Web fonts | < 100KB | Plus Jakarta Sans (subset 400, 600, 700, 800), Inter (subset 400, 500), JetBrains Mono (subset 400) |

**SSG Strategy**: This page is statically generated at build time. No runtime data fetches. All content is hardcoded. JSON-LD schema is embedded in `<head>`. The only client-side JavaScript is:
1. Accordion open/close (shadcn/ui Accordion)
2. Scroll-spy for in-page navigation
3. Framer Motion scroll-triggered animations (respects `prefers-reduced-motion`)
4. Form interaction on CTA clicks (navigates to `/demo` or `/resources/sample-binders/study-abroad`)

---

## User Actions Available (Higher Education)

| Action | Mechanism | Destination |
|--------|-----------|-------------|
| Download study abroad sample binder | Gated CTA | `/resources/sample-binders/study-abroad` |
| Request a demo | Button | `/demo` |
| View pricing | Link | `/pricing` |
| Explore platform features | Feature cards | `/platform/[feature]` |
| Read higher-ed blog posts | Related content | `/blog/category/higher-ed-safety` |
| Access procurement resources | Link | `/procurement` |
| Expand FAQ items | Accordion | In-page |

### Primary CTAs (Priority Order)

1. "Download Study Abroad Sample Binder" (hero primary, binder preview)
2. "Get a Demo" (hero secondary, final CTA)
3. "View Pricing" (pricing context link)

---
---
---

# PART TWO: Corporate/Sports Solutions

**URL**: `/solutions/corporate`

> This page converts HR directors, corporate risk managers, travel managers, sports organization administrators, tournament directors, and youth sports league operators. Corporate/Sports-specific vocabulary is mandatory throughout: duty of care, SafeSport compliance, tournament travel, minor athletes, business travel risk, corporate liability, workers' compensation. The core positioning is explicit: enterprise-grade safety at per-trip pricing -- mid-market organizations get Fortune 500 safety documentation without Fortune 500 contracts.

---

## Page Metadata

| Property | Value |
|----------|-------|
| `<title>` | `Business & Sports Travel Safety for Corporate Teams -- SafeTrekr` |
| `meta description` | `SafeTrekr assigns a professional safety analyst to review every business trip, team retreat, and tournament your organization sends -- across 17 dimensions of risk. Government intelligence. Duty of care documentation. Enterprise safety at per-trip pricing.` |
| `og:title` | `Travel Safety Built for Corporate & Sports Organizations` |
| `og:description` | `Professional analyst review, government intelligence, and duty of care documentation for every business trip and tournament. Enterprise safety at per-trip pricing.` |
| `og:image` | `/og/solutions-corporate.png` (1200x630, corporate/sports-specific composition) |
| `og:type` | `website` |
| JSON-LD | `FAQPage` schema with 12 corporate/sports-specific Q&As (see Section 9) |
| Breadcrumb JSON-LD | `Home > Solutions > Corporate & Sports Teams` |
| Canonical | `https://safetrekr.com/solutions/corporate` |
| Redirects | `/solutions/business`, `/solutions/sports`, `/corporate` all 301 to canonical |

---

## Section Rhythm (Scroll Order)

```
 1. Hero                         (light, bg-background)
 2. Trust Metrics Strip           (light, bg-card, border-y)
 3. The Challenge                 (light, bg-background)
 4. How SafeTrekr Solves It       (light, bg-background, bg-dot-grid)
 5. Sample Binder Preview         (light, bg-primary-50)
 6. DARK: Proof Points            (bg-secondary) -- 1st dark section
 7. Pricing Context               (light, bg-background)
 8. Compliance & Trust            (light, bg-card)
 9. Common Questions              (light, bg-background)
10. DARK: CTA Band                (bg-secondary) -- 2nd dark section
11. Footer                        (bg-secondary -- always dark, not counted)
```

**Dark section validation**: 2 dark sections (positions 6 and 10), never adjacent, separated by 3 full light sections with `py-24`+ padding each. Compliant with design system 12.2 rhythm rules.

---

## Section 1: Hero

### Layout

**Component**: Custom segment hero (variant of `HeroSection`)
**Background**: `bg-background` (#e7ecee)
**Padding**: `pt-16 pb-20` (mobile) scaling to `pt-28 pb-36` (2xl) per section padding scale

**Desktop (>= lg)**: 12-column grid.
- Text column: 6 columns, left-aligned
- Visual column: 6 columns, right-aligned

```
+--------------------------------------------------------------+
| Breadcrumb: Home > Solutions > Corporate & Sports Teams      |
+--------------------------------------------------------------+
|                                                              |
|  [Eyebrow]                    +---------------------------+  |
|                               |                           |  |
|  [Headline -- 2 lines max]   |   CORPORATE TRAVEL        |  |
|                               |   BINDER COMPOSITION      |  |
|  [Subheadline -- 3 lines]    |                           |  |
|                               |   (Stacked document with  |  |
|  [CTA Primary] [CTA Sec.]    |    map + review overlay)  |  |
|                               |                           |  |
|                               +---------------------------+  |
|                                                              |
+--------------------------------------------------------------+
```

**Tablet (md-lg)**: Stacked. Text above, composition below (scaled to 80% width, centered).
**Mobile (< md)**: Stacked. Text above. Simplified visual: single document preview card with corporate travel binder cover.

### Content

| Element | Content | Style |
|---------|---------|-------|
| Breadcrumb | `Home / Solutions / Corporate & Sports Teams` | `.text-body-sm text-muted-foreground mb-6`, links in `text-primary-700` |
| Eyebrow | `BUSINESS & SPORTS TRAVEL SAFETY` | `.text-eyebrow text-primary-700`, leading `Building` icon (16px, `primary-700`) |
| Headline | `Enterprise Safety at Per-Trip Pricing` | `.text-display-xl text-foreground max-w-[20ch]` |
| Subheadline | `SafeTrekr brings the same professional safety review that Fortune 500 companies use for executive travel to every business trip, team retreat, and tournament your organization sends. Government intelligence. 17-section analyst review. Duty of care documentation that protects your people and your organization.` | `.text-body-lg text-muted-foreground max-w-[50ch] mt-6` |
| CTA Primary | `Download Corporate Travel Sample Binder` | `Button variant="primary" size="lg"`, `Download` icon left |
| CTA Secondary | `Get a Demo` | `Button variant="secondary" size="lg"`, `ArrowRight` icon right |
| CTA Spacing | `flex flex-wrap gap-4 mt-8` | Stacked full-width on < sm, horizontal on >= sm |

### Visual Composition (Right Column)

A corporate-travel-specific variant of the `DocumentPreview` component overlaid on a subtle map fragment.

**Layer 1 -- Map Fragment (Base)**:
- Dimensions: 480x360px desktop, aspect-ratio preserved smaller
- Desaturated map tile showing a Southeast Asian region (15% saturation)
- Single curved route path in `primary-500` (3px stroke)
- 3 waypoint circles: departure city, primary business destination, secondary site
- `rounded-xl shadow-lg border border-border overflow-hidden`
- Entry animation: `scaleIn` (800ms, spring)

**Layer 2 -- Corporate Travel Binder Preview (Overlaid upper-right)**:
- `DocumentPreview` component customized:
  - Eyebrow: "Corporate Travel"
  - Title: "Safety Binder"
  - Badge: "17 Sections Reviewed" in `Badge variant="default"`
  - 2 sample line items: "Venue Safety Assessment -- Completed", "Emergency Medical Facilities -- Verified"
  - SHA-256 hash snippet in `mono-sm`
- `rounded-xl bg-white shadow-xl border border-border p-5`
- Offset: overlaps map by 40px bottom-right
- Entry animation: `documentStack` (staggered 200ms after map)

**Layer 3 -- Status Badge (Lower-left of map)**:
- `MotifBadge motif="readiness"` showing "Trip Ready"
- Entry animation: `markerPop` (400ms delay)

### Accessibility Notes

- Breadcrumb: `<nav aria-label="Breadcrumb">` with `<ol>` and `aria-current="page"` on last item
- Hero visual composition: `aria-hidden="true"` (decorative) with a visually hidden `<p>` describing the visual: "Composed interface showing a corporate travel safety binder with map intelligence, analyst review status, and evidence documentation."
- Headline: `<h1>` (only h1 on page)
- CTAs: Both meet 44x44px minimum touch target
- Focus order: Breadcrumb links, then headline (skip -- non-interactive), primary CTA, secondary CTA
- `prefers-reduced-motion`: All composition animations disabled; elements render in final state immediately

---

## Section 2: Trust Metrics Strip

### Layout

**Component**: `TrustMetricsStrip`
**Background**: `bg-card border-y border-border py-12`
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

### Content

| Value | Label |
|-------|-------|
| `5` | Government Intel Sources |
| `17` | Safety Review Sections |
| `3-5` | Day Turnaround |
| `AES-256` | Encryption Standard |
| `SHA-256` | Evidence Chain |

### Grid Behavior

| Breakpoint | Columns |
|------------|---------|
| < md | 2 columns, third wraps |
| md-lg | 3 columns |
| >= lg | 5 columns (single row) |

### Animation

- Entire strip: `fadeIn` on scroll (20% viewport intersection)
- Numeric values: `counterAnimate` (count from 0 over 1.5s)
- `AES-256` and `SHA-256`: fade in (string values)

### Accessibility Notes

- `StatCard` values: Screen readers receive final value immediately via `aria-label` (no animation dependency)
- "3-5" announced as "3 to 5 day turnaround"
- Section: `<section aria-label="Platform capabilities">`

---

## Section 3: The Challenge

### Layout

**Background**: `bg-background`
**Padding**: Standard section padding (`py-12` mobile to `py-32` 2xl)
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

**Desktop (>= lg)**: 2-column layout.
- Left column (5 cols): Section header + narrative copy
- Right column (7 cols): Status quo contrast cards (2x2 grid)

**Tablet/Mobile (< lg)**: Stacked. Header + copy above, cards below in single column (mobile) or 2-col grid (tablet).

### Content

**Eyebrow**: `THE REALITY TODAY`
**Eyebrow style**: `.text-eyebrow text-primary-700`, `AlertTriangle` icon (16px)

**Headline**: `Duty of Care Is Not Optional. Documentation Is.`
**Headline style**: `.text-display-md text-foreground max-w-[28ch]`

**Body copy**:

> Every organization that sends employees, contractors, or athletes on trips has a legal duty of care. For corporate teams, that means business travel to client sites, conferences, and international offices. For sports organizations, that means tournament travel, training camps, and away games -- often transporting minor athletes across state lines. Most mid-market organizations know the obligation exists. Few can document how they met it.

**Body style**: `.text-body-lg text-muted-foreground max-w-prose mt-6`

**Closing line**:

> Enterprise safety programs should not require enterprise budgets to document.

**Closing style**: `.text-body-lg text-foreground font-medium max-w-prose mt-4`

### Status Quo Contrast Cards (Right Column)

Four cards showing what corporate and sports organizations currently rely on. Each card: `bg-card rounded-xl border border-border p-6 shadow-card`.

**Card 1: Travel Policy Without Verification**
- Icon: `FileText` in `muted-foreground`
- Title: `Travel Policies That Exist on Paper but Not in Practice`
- Description: `Most mid-market organizations have a travel policy. Few have a process that verifies safety conditions at every destination before employees or athletes depart. The policy says "assess risks." The reality is a Google search and an assumption that the hotel is fine.`

**Card 2: Tournament Travel for Minors**
- Icon: `Users` in `muted-foreground`
- Title: `Minor Athletes Traveling Without Formal Safety Documentation`
- Description: `Youth sports organizations transport minors to tournaments across state lines -- sometimes internationally. SafeSport requires documented safety protocols. Most organizations rely on a volunteer coach's judgment and a parent permission slip as their entire safety infrastructure.`

**Card 3: Duty of Care Documentation Gap**
- Icon: `Shield` in `muted-foreground`
- Title: `Duty of Care Obligations Without Duty of Care Evidence`
- Description: `When an employee is injured during business travel or an athlete is harmed during a tournament, the first question from legal counsel is: "What did you do to assess the risk?" A travel booking confirmation and a hotel receipt are not evidence of due diligence. They are evidence of logistics.`

**Card 4: Insurance Without Defensible Records**
- Icon: `AlertCircle` in `muted-foreground`
- Title: `Workers' Comp and Liability Claims Without Supporting Documentation`
- Description: `Workers' compensation claims for travel injuries require evidence that the employer assessed and mitigated foreseeable risks. Sports liability claims require evidence of reasonable safety precautions. Without documented risk assessment, your organization's defense is: "We did not think it would happen."`

### Card Layout

| Breakpoint | Layout |
|------------|--------|
| < sm | 1 column, stacked |
| sm-md | 2 columns |
| md-lg | 2 columns |
| >= lg | 2x2 grid within the right 7 columns |

### Animation

- Section heading group: `fadeUp` staggered at 80ms (eyebrow, headline, body, closing line)
- Cards: `staggerContainer + cardReveal` at 80ms intervals
- Entry trigger: 20% viewport intersection

### Accessibility Notes

- Section: `<section aria-labelledby="challenge-heading">`
- Headline: `<h2 id="challenge-heading">`
- Card icons: `aria-hidden="true"` (decorative, meaning conveyed by text)
- Cards are not interactive (no link, no hover state beyond shadow) -- purely informational
- Status quo cards use `muted-foreground` icons, NOT `safety-red` or `destructive` -- this is respectful framing, not fear-based

---

## Section 4: How SafeTrekr Solves It

### Layout

**Background**: `bg-background` with `bg-dot-grid` subtle pattern overlay
**Padding**: Standard section padding
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

**Structure**: Section header (centered) + ProcessTimeline (3-act) + FeatureCard grid (2x2)

### Section Header

**Eyebrow**: `HOW SAFETREKR WORKS`
**Eyebrow style**: `.text-eyebrow text-primary-700`, centered, `Shield` icon

**Headline**: `Professional Safety Review for Every Business Trip and Tournament`
**Headline style**: `.text-display-md text-foreground text-center max-w-[28ch] mx-auto`

**Subheadline**: `From trip submission to safety binder delivery in 3-5 days. No enterprise contract required. No minimum commitment. Here is exactly what happens.`
**Subheadline style**: `.text-body-lg text-muted-foreground text-center max-w-prose mx-auto mt-4`

### Three-Act ProcessTimeline (Corporate/Sports Flavor)

**Component**: `ProcessTimeline`

**Desktop (>= lg)**: Horizontal 3-column grid with numbered step connectors.
**Mobile (< lg)**: Vertical `TimelineStep` stack.

| Step | Number | Title | Description |
|------|--------|-------|-------------|
| Act 1 | 1 | Intelligence Gathering | Before your team departs, we pull real-time safety data from NOAA, USGS, CDC, ReliefWeb, and GDACS -- the same sources Fortune 500 corporate security teams use to assess destination conditions. Weather patterns, seismic risk, disease advisories, political stability, and local security conditions. Every data point scored with Monte Carlo simulation, not just flagged. |
| Act 2 | 2 | Analyst Safety Review | A trained safety analyst reviews every detail of your trip across 17 sections -- venue safety, lodging assessment, ground transportation, emergency medical facilities, evacuation routes, communication infrastructure, local law enforcement contacts, and more. For sports organizations, the review includes tournament venue assessment and SafeSport protocol documentation. |
| Act 3 | 3 | Documented Evidence Binder | Your organization receives a complete safety binder -- every review finding, every government data source, every decision documented with tamper-evident audit trails. When HR needs duty of care evidence for a workers' comp claim, when legal counsel needs to demonstrate reasonable precautions, when a parent asks what safety review was conducted before their child traveled to a tournament -- you hand them the binder. |

**Step card style**: Numbered circles (`h-10 w-10 rounded-full bg-primary-100 text-primary-700 font-semibold`), connectors (`1px border-border` horizontal line), heading (`.text-heading-md`), description (`.text-body-md text-muted-foreground max-w-[45ch]`).

### Feature Cards (Corporate/Sports-Specific Benefits)

**Component**: `FeatureGrid` with 4 `FeatureCard` items
**Layout**: `grid sm:grid-cols-2 gap-6`, below the ProcessTimeline with `mt-16`

**Card 1: Analyst Safety Review**
- `motifType`: `review`
- Icon: `ClipboardCheck` in `primary-700`
- Title: `Every Destination Reviewed by a Professional Analyst`
- Description: `Your travel coordinator books the trip. Our analyst reviews the safety. 17 sections covering venues, lodging, ground transportation, emergency contacts, evacuation routes, local hospitals, weather windows, and more. For sports organizations: tournament venue assessment and SafeSport compliance documentation included.`
- Link: `Learn about analyst review` -> `/platform/analyst-review`

**Card 2: Risk Intelligence**
- `motifType`: `route`
- Icon: `MapPin` in `primary-700`
- Title: `Government Data on Every Destination Your Team Visits`
- Description: `Real-time intelligence from 5 government sources -- not a travel advisory website. NOAA weather data, CDC health advisories, USGS seismic activity, and two international humanitarian agencies. Risk scored with Monte Carlo simulation so your risk manager understands probability, not just possibility.`
- Link: `Learn about risk intelligence` -> `/platform/risk-intelligence`

**Card 3: Trip Safety Binder**
- `motifType`: `record`
- Icon: `FileText` in `foreground`
- Title: `Duty of Care Documentation Your Legal Team Can Defend`
- Description: `Every finding documented. Every data source cited. Every decision recorded with SHA-256 tamper-evident audit trails. The documentation your HR department needs for workers' comp claims, the evidence your legal counsel needs for liability defense, and the proof your organization met its duty of care obligation.`
- Link: `Learn about the safety binder` -> `/platform/safety-binder`

**Card 4: Mobile Field Operations**
- `motifType`: `readiness`
- Icon: `Activity` in `safety-green`
- Title: `Emergency Contacts, Rally Points, and Check-Ins for Every Trip Leader`
- Description: `During your trip, every team leader gets the SafeTrekr mobile app -- live geofencing, muster check-ins, rally point navigation, SMS broadcast, and morning/evening safety briefings. For tournament travel: coach and chaperone check-in protocols that document SafeSport compliance in real time.`
- Link: `Learn about mobile operations` -> `/platform/mobile-app`

### Card Behavior

- Entire card is clickable (`group` pattern, `<a>` wrapper)
- Hover: `shadow-card` to `shadow-card-hover`, `translateY(-2px)`, 200ms `ease-default`
- "Learn about..." link text: `.text-body-sm font-medium text-primary-700` with `ArrowRight` icon that translates 4px on parent hover

### Animation

- Section header: `fadeUp` stagger at 80ms
- ProcessTimeline: `staggerContainer` at 120ms per step
- FeatureCards: `staggerContainer + cardReveal` at 80ms

### Accessibility Notes

- Section: `<section aria-labelledby="solution-heading">`
- Headline: `<h2 id="solution-heading">`
- ProcessTimeline steps: Ordered `<ol>` with step numbers as `aria-label` context
- FeatureCards: Each card title is `<h3>`. Card link wraps entire card as single interactive target. Links have descriptive text (not "Learn more" alone)
- MotifBadge icons: `aria-hidden="true"`

---

## Section 5: Sample Binder Preview

### Layout

**Background**: `bg-primary-50` (#f1f9f4) -- lightest brand wash
**Padding**: Standard section padding
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

**Desktop (>= lg)**: 2-column layout via `FeatureShowcase` (text left, visual right).
**Mobile (< lg)**: Stacked -- visual above text.

### Content (Text Column)

**Eyebrow**: `SAMPLE BINDER`
**Eyebrow style**: `.text-eyebrow text-primary-700`, `FileText` icon

**Headline**: `See Exactly What Your Risk Manager and Legal Counsel Will Receive`
**Headline style**: `.text-display-md text-foreground max-w-[28ch]`

**Body**:

> Every SafeTrekr review produces a comprehensive safety binder customized to your specific trip. This is not a generic travel advisory or a destination fact sheet. It is the documented output of a professional analyst reviewing your specific trip -- your destinations, your dates, your venues, your team size, your activities.

**Body style**: `.text-body-lg text-muted-foreground max-w-prose mt-6`

**Binder contents list** (with `Check` icons in `primary-500`):

1. `Destination risk assessment with government intelligence data`
2. `Venue and lodging safety verification`
3. `Emergency medical facility locations and contact information`
4. `Evacuation routes and contingency plans`
5. `Ground transportation safety evaluation`
6. `Communication infrastructure and emergency contact protocols`
7. `Tamper-evident audit trail with SHA-256 hash chain`

**List style**: `space-y-3 mt-6`, each item: `flex items-start gap-3`, check icon `h-5 w-5 text-primary-500 mt-0.5 shrink-0`, text `.text-body-md text-muted-foreground`

**CTA**: `Download the Corporate Travel Sample Binder`
**CTA style**: `Button variant="primary" size="lg" className="mt-8"`, `Download` icon left

**CTA subtext**: `See a real safety binder output. Gated with email -- we will not spam you.`
**Subtext style**: `.text-body-sm text-muted-foreground mt-2`

### Visual Column (Binder Preview)

A composed visual showing 3-5 stacked page thumbnails from the Corporate Travel sample binder.

**Structure**:
- 3 offset page cards (fanning effect) creating depth
- Front page: `bg-white rounded-lg shadow-xl border border-border p-6 w-[340px]`
  - Header: "SafeTrekr" logo mark (24px) + "Corporate Travel" eyebrow
  - Title: "Safety Binder" in `.text-heading-md`
  - Subtitle: "Singapore -- Kuala Lumpur -- Bangkok"
  - Date: "April 7-14, 2026"
  - Status badge: `Badge variant="default"` "17 Sections Reviewed"
  - Decorative map thumbnail (60px height, `rounded-md overflow-hidden opacity-80`)
  - 3 section preview lines (abbreviated): "1. Destination Overview... 2. Venue Safety... 3. Emergency Contacts..."
- Middle page: offset -8px Y, -6px X, `opacity-90`, slight rotation (-1deg)
- Back page: offset -16px Y, -12px X, `opacity-70`, slight rotation (-2deg)

**Entry animation**: `documentStack` with 200ms stagger between layers

### Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| < lg | Stacked: binder preview above (centered, max-w-[380px]), text below |
| >= lg | Side-by-side: text left (5 cols), visual right (7 cols) |

### Animation

- Text column: `fadeUp` stagger
- Binder preview: `documentStack` with page stagger
- Entry trigger: 20% viewport intersection

### Accessibility Notes

- Section: `<section aria-labelledby="binder-preview-heading">`
- Headline: `<h2 id="binder-preview-heading">`
- Binder visual: `aria-hidden="true"` with visually hidden description: "Preview of a Corporate Travel safety binder showing cover page with destinations, review sections, and analyst verification status."
- CTA download: Announces as "Download the Corporate Travel Sample Binder, opens email-gated form"
- Checklist: `<ul>` with descriptive list items

---

## Section 6: Proof Points (DARK)

### Layout

**Component**: `DarkAuthoritySection` wrapper
**Background**: `secondary` (#123646) with `[data-theme="dark"]` token overrides
**Padding**: Standard section padding
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

**Structure**: Section header (centered) + 3-column stat cards + proof narrative

### Content

**Eyebrow**: `BY THE NUMBERS`
**Eyebrow style**: `.text-eyebrow` (inherits `dark-accent` #6cbc8b via dark override)

**Headline**: `Fortune 500 Documentation Without the Fortune 500 Contract`
**Headline style**: `.text-display-md` (renders `dark-text-primary` #f7f8f8, 11.6:1 contrast)

### Stat Cards

3 stat cards in a row on dark surface. Card style: `bg-[var(--color-dark-surface)] rounded-xl border border-[var(--color-dark-border)] p-8 text-center`.

| Value | Label | Annotation |
|-------|-------|------------|
| `17` | Analyst Review Sections | Every trip reviewed across venues, lodging, transportation, emergency contacts, evacuation routes, weather, health advisories, and more |
| `5` | Government Intelligence Sources | NOAA, USGS, CDC, ReliefWeb, GDACS -- the same sources Fortune 500 corporate security teams use |
| `3-5 Days` | Submission to Binder Delivery | Professional review and documentation delivered before your team departs -- no multi-month enterprise onboarding |

**Value style**: `.text-display-md font-mono` in `dark-text-primary`
**Label style**: `.text-eyebrow` in `dark-text-secondary` (7.0:1 contrast)
**Annotation style**: `.text-body-sm` in `dark-text-secondary`, `mt-3`

### Stat Card Grid

| Breakpoint | Columns |
|------------|---------|
| < md | 1 column, stacked |
| md-lg | 3 columns |
| >= lg | 3 columns |

### Proof Narrative (Below Stats)

**Centered block, max-width `prose`**:

> Large enterprises have dedicated corporate security teams, travel risk management platforms, and six-figure annual budgets for employee safety programs. Mid-market organizations have the same duty of care obligations -- but not the same resources. SafeTrekr gives every organization the documented safety evidence that Fortune 500 companies take for granted, at a price point that works trip by trip.

**Style**: `.text-body-lg` in `dark-text-secondary` (7.0:1 contrast), `text-center max-w-prose mx-auto mt-12`

### Note on Testimonials

**No testimonial block at launch.** Per design system non-negotiable: no fabricated quotes. When real corporate/sports testimonials are obtained, a testimonial card slot exists here with the following structure:
- Quote text in `dark-text-primary`, 20px italic
- Attribution: name, title, organization in `dark-text-secondary`
- Placeholder: `{/* Testimonial slot -- populate when verified customer quotes are available */}`

### Animation

- Entire dark section: `fadeIn` (background fades, then content staggers)
- Stat cards: `staggerContainer` at 120ms
- Stat values: `counterAnimate` (1.5s count from 0)
- Proof narrative: `fadeUp` (200ms delay after stats)

### Accessibility Notes

- Section: `<section aria-labelledby="proof-heading" data-theme="dark">`
- Headline: `<h2 id="proof-heading">`
- Stat cards: Each `StatCard` uses `aria-label` with full context (e.g., "17 analyst review sections per trip")
- All text meets WCAG AA: `dark-text-primary` 11.6:1, `dark-text-secondary` 7.0:1, `dark-accent` 4.8:1
- `counterAnimate` shows final value immediately for screen readers

---

## Section 7: Pricing Context

### Layout

**Background**: `bg-background`
**Padding**: Standard section padding
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

**Desktop (>= lg)**: Section header left-aligned + 3-column pricing scenario cards + cost comparison block.
**Mobile (< lg)**: Stacked.

### Section Header

**Eyebrow**: `PRICING`
**Eyebrow style**: `.text-eyebrow text-primary-700`

**Headline**: `Per-Trip Pricing. No Enterprise Contract Required.`
**Headline style**: `.text-display-md text-foreground max-w-[28ch]`

**Body**:

> Every trip your organization sends -- from a regional sales meeting to an international tournament -- gets the same professional safety review. No annual minimums. No enterprise onboarding. Pay per trip, scale as you grow.

**Body style**: `.text-body-lg text-muted-foreground max-w-prose mt-4`

### Pricing Scenario Cards

3 cards showing real pricing math. Each card: `bg-card rounded-2xl border border-border p-8 shadow-card`.

**Card 1: Domestic Business Trip**
- Badge: `Badge variant="default"` "Most Common"
- Price: `$450`
- Price style: `.text-display-lg text-foreground`
- Unit: `per domestic trip`
- Unit style: `.text-body-md text-muted-foreground`
- Context line 1: `$45 per person for a team of 10`
- Context line 2: `Less than the cost of one night's hotel`
- Context style: `.text-body-sm text-muted-foreground mt-4 space-y-1`
- Includes list (check icons in `primary-500`):
  - `17-section professional analyst review`
  - `Government intelligence risk scoring`
  - `Complete safety binder with audit trail`
  - `Mobile app access for trip leaders`
  - `AM/PM safety briefings during trip`

**Card 2: International Business/Tournament Trip**
- Badge: none
- Price: `$1,250`
- Unit: `per international trip`
- Context line 1: `$50 per person for a team of 25`
- Context line 2: `Less than 2% of a typical international team travel budget`
- Context line 3: `Includes SafeSport compliance documentation for youth sports`
- Includes: same list as domestic + `SafeSport protocol documentation (sports organizations)`

**Card 3: Multi-Trip Organization**
- Badge: none
- Price: `Custom`
- Unit: `volume pricing for 15+ trips per year`
- Context line 1: `A company sending 15 domestic + 5 international trips per year:`
- Context line 2 (calculated): `$13,000/year for complete duty of care coverage`
- Context line 3: `Volume discounts available for 15+ trips annually`
- CTA inside card: `Get a Custom Quote` (Button variant="secondary" size="default")

### Pricing Card Grid

| Breakpoint | Layout |
|------------|--------|
| < md | 1 column, stacked, domestic card first |
| md-lg | 3 columns, equal width |
| >= lg | 3 columns, equal width |

### Cost-of-Inaction Comparison Block

Below the pricing cards, `mt-12`. `bg-card rounded-xl border border-border p-8`.

**Headline**: `The Cost of Not Having Duty of Care Documentation`
**Headline style**: `.text-heading-md text-foreground`

**Comparison table** (2 columns):

| Without SafeTrekr | With SafeTrekr |
|-------------------|----------------|
| Travel coordinator books flights and hotels. No formal safety assessment of destination conditions. HR checks a box on the travel policy. | Professional analyst completes 17-section review of every destination. Government intelligence data scored and documented. |
| Workers' comp claim for a travel injury: "Did the employer assess foreseeable risks at the destination?" No documentation to support the answer. | Workers' comp claim supported by a complete evidence binder documenting every risk assessment, every data source, every mitigation decision. |
| Youth tournament travel: coach drives the team, books the hotel, and trusts the tournament venue. SafeSport compliance is verbal, not documented. | Tournament safety binder documents venue assessment, emergency protocols, SafeSport compliance, and supervision plans -- before the team departs. |
| Average cost of a single business travel liability claim: $250K-$1M. Average workers' comp cost for international travel injury: $50K-$200K. | $450-$1,250 per trip for documented proof your organization met its duty of care obligation. |

**Table style**: On desktop, a 2-column grid. Left column items have `AlertTriangle` icon in `muted-foreground`. Right column items have `Check` icon in `primary-500`. On mobile, each pair stacks vertically with a visual divider.

**Footer link**: `View full pricing details` -> `/pricing`
**Footer link style**: `.text-body-sm font-medium text-primary-700` with `ArrowRight` icon

### Animation

- Section header: `fadeUp` stagger
- Pricing cards: `staggerContainer + cardReveal` at 80ms
- Comparison block: `fadeUp` (200ms delay)

### Accessibility Notes

- Section: `<section aria-labelledby="pricing-heading">`
- Headline: `<h2 id="pricing-heading">`
- Pricing cards: Price values use `aria-label` with full context (e.g., "$450 per domestic business trip")
- Comparison: Use `<dl>` (definition list) or `<table>` with proper `<th>` headers for the comparison. `<caption>` for table: "Comparison of business travel safety approaches"
- No animation on pricing cards (per design system rule: "Stability and readability are paramount")
- All monetary values are presented as text, not images

---

## Section 8: Compliance & Trust

### Layout

**Background**: `bg-card`
**Padding**: Standard section padding
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

**Structure**: Section header (centered) + badge grid + corporate narrative + procurement link

### Section Header

**Eyebrow**: `SECURITY & COMPLIANCE`
**Eyebrow style**: `.text-eyebrow text-primary-700`, `Shield` icon

**Headline**: `Built to Satisfy Your Legal, HR, and Insurance Requirements`
**Headline style**: `.text-display-md text-foreground text-center max-w-[28ch] mx-auto`

### Trust Badge Grid

4 badges in a horizontal row (desktop) or 2x2 grid (mobile). Each badge: `bg-background rounded-xl border border-border p-6 text-center`.

| Badge | Icon | Title | Description |
|-------|------|-------|-------------|
| 1 | `Shield` (32px, `primary-700`) | `AES-256 Encryption` | All data encrypted at rest and in transit. Employee and athlete information is protected with the same standard used by financial institutions. |
| 2 | `FileText` (32px, `primary-700`) | `SHA-256 Evidence Chain` | Every review finding, every analyst decision, every data source documented with cryptographic integrity. Tamper-evident by design. Litigation-ready by default. |
| 3 | `Activity` (32px, `primary-700`) | `SOC 2 Type II` | Audit in progress. We are pursuing SOC 2 Type II certification to validate our security controls. (Status: In Progress) |
| 4 | `ClipboardCheck` (32px, `primary-700`) | `Duty of Care & SafeSport Documentation` | Every binder is structured to provide the duty of care evidence your legal team needs and the SafeSport compliance documentation your sports organization requires. |

**Badge grid layout**:

| Breakpoint | Columns |
|------------|---------|
| < sm | 1 column |
| sm-md | 2 columns |
| >= md | 4 columns |

### Corporate Narrative Block

Below the badges, `mt-12`. Centered text block.

**Headline**: `Your Legal Team and Insurance Carrier Will Thank You`
**Headline style**: `.text-heading-md text-foreground text-center`

**Body**:

> Duty of care is a legal obligation, not a best practice. When an employee is injured during business travel or an athlete is harmed during a tournament, the question is not whether your organization had a duty of care -- it always did. The question is whether your organization can document that it met that obligation. SafeTrekr produces the documentation: a professional 17-section safety review backed by government intelligence data, documented with tamper-evident audit trails. That is the difference between defensible evidence and organizational exposure.

**Body style**: `.text-body-lg text-muted-foreground text-center max-w-prose mx-auto mt-4`

### Mid-Market Positioning Statement

Below the narrative, `mt-8`. Centered text block with a subtle `bg-primary-50 rounded-xl border border-primary-200 p-6 max-w-prose mx-auto`.

**Text**: `SafeTrekr is built for mid-market organizations that need enterprise-grade safety documentation without enterprise-grade budgets, procurement cycles, or implementation timelines. No annual contract. No minimum trip count. No multi-month onboarding. Start with one trip. Scale from there.`

**Text style**: `.text-body-md text-foreground text-center`

### Procurement Link

**Text**: `Institutional buyer? Download our W-9, security questionnaire responses, and insurance documentation.`
**Link**: `Visit our procurement page` -> `/procurement`
**Style**: `.text-body-md text-center mt-8`, link in `text-primary-700 font-medium` with `ArrowRight` icon

### Animation

- Section header: `fadeUp` stagger
- Badge grid: `staggerContainer + cardReveal` at 80ms
- Corporate narrative: `fadeUp` (200ms delay)

### Accessibility Notes

- Section: `<section aria-labelledby="compliance-heading">`
- Headline: `<h2 id="compliance-heading">`
- SOC 2 badge: Clearly states "In Progress" -- honest language per design system non-negotiable
- Badge icons: `aria-hidden="true"` (meaning conveyed by text)
- Trust badges are informational cards, not interactive

---

## Section 9: Common Questions

### Layout

**Component**: `FAQSection`
**Background**: `bg-background`
**Padding**: Standard section padding
**Container**: `max-w-3xl mx-auto px-6 sm:px-8 lg:px-12`

### Section Header

**Eyebrow**: `COMMON QUESTIONS`
**Eyebrow style**: `.text-eyebrow text-primary-700`, centered

**Headline**: `Everything Your Risk Manager and HR Director Will Ask`
**Headline style**: `.text-display-md text-foreground text-center max-w-[28ch] mx-auto`

### FAQ Items (12 Questions)

Uses shadcn/ui `Accordion` primitive, `type="single" collapsible`. Each trigger: `.text-heading-sm text-foreground`. Each content panel: `.text-body-md text-muted-foreground`.

**Q1: Is SafeTrekr just for international trips?**

> No. Any trip that takes your employees or athletes away from their normal work or training environment benefits from professional safety review. Domestic business travel to unfamiliar cities, regional conferences, client site visits, and domestic tournaments all carry risks that your organization has a duty to assess. Our domestic trip review costs $450. International review costs $1,250. The same 17-section analysis applies regardless of destination.

**Q2: How does SafeTrekr help with duty of care compliance?**

> Duty of care requires organizations to take reasonable steps to protect the health and safety of employees during work-related activities -- including travel. SafeTrekr produces the documented evidence that your organization conducted a professional safety assessment before each trip. The safety binder includes government intelligence data, venue assessments, emergency protocols, and evacuation plans -- all documented with tamper-evident audit trails. This is the evidence your legal team needs to demonstrate that "reasonable steps" were taken.

**Q3: Can sports organizations use SafeTrekr for tournament travel?**

> Yes. SafeTrekr is specifically designed to handle tournament travel for youth and adult sports organizations. Our analyst reviews tournament venues, hotel safety, ground transportation, emergency medical facilities, and local conditions. For organizations transporting minor athletes, the safety binder includes SafeSport compliance documentation, supervision protocols, and emergency contact procedures. Every tournament gets the same 17-section review as a corporate business trip.

**Q4: What about SafeSport compliance for youth sports?**

> The SafeSport Act requires youth-serving sports organizations to implement safety policies and report abuse. SafeTrekr's safety binder documents the safety protocols your organization established for each tournament or travel event -- venue assessments, supervision plans, emergency procedures, and communication protocols. This documentation supports your SafeSport compliance obligations and provides evidence of proactive safety planning when reporting is required.

**Q5: How quickly do we get the safety binder back?**

> 3-5 business days from trip submission to binder delivery. For organizations that plan travel well in advance, this timeline fits naturally into your booking process. For last-minute travel, we prioritize submissions to meet departure schedules. If destination conditions change after the initial review, our analyst can update the binder with current intelligence data.

**Q6: Do we need to sign an annual contract?**

> No. SafeTrekr operates on a per-trip basis. No annual contract. No minimum trip count. No multi-month enterprise onboarding. Submit a trip, receive a safety binder, pay per trip. Organizations sending 15 or more trips per year qualify for volume pricing, but there is no obligation to commit to a volume upfront. Start with one trip. Scale from there.

**Q7: Can our travel coordinator submit trips on behalf of team leaders?**

> Yes. Trip submission is a guided 10-step wizard that takes 15-20 minutes. Your travel coordinator, HR team, or any designated administrator can submit trips on behalf of team leaders. The mobile app for field operations is then shared with the actual trip leaders -- team managers, coaches, or department heads -- who need the safety information during the trip.

**Q8: How does pricing work for organizations with many trips?**

> Each trip is priced independently -- $450 for domestic, $750 for extended domestic (multi-day), $1,250 for international. Organizations booking 15 or more trips per year qualify for volume pricing. A company sending 15 domestic trips and 5 international trips per year would pay approximately $13,000 before any volume discount. Contact us for a custom quote that reflects your annual travel schedule.

**Q9: What does the mobile app provide during the trip?**

> Every trip leader gets the SafeTrekr mobile app with live geofencing, muster check-ins, rally point navigation, SMS broadcast capability, and morning/evening safety briefings. For sports organizations, the app includes coach check-in protocols and participant welfare documentation. The app works in offline mode when cell service is unavailable -- critical information like emergency contacts, rally points, and evacuation routes are accessible without connectivity.

**Q10: Can SafeTrekr handle international business travel to high-risk regions?**

> Yes. Many business trips involve destinations with elevated risk profiles -- emerging markets, regions with political instability, or locations with limited medical infrastructure. Our analyst reviews specifically account for these conditions, and our intelligence data from ReliefWeb and GDACS is designed for exactly these regions. The safety binder documents the risks, mitigations, and emergency protocols so your organization can make informed travel decisions with defensible documentation.

**Q11: How does SafeTrekr compare to travel risk management platforms?**

> Enterprise travel risk management (TRM) platforms like International SOS, WorldAware, or Crisis24 serve large corporations with dedicated security teams and six-figure annual budgets. SafeTrekr provides the core safety documentation these platforms generate -- professional risk assessment, government intelligence, and audit-ready evidence -- at a per-trip price point accessible to mid-market organizations. No annual contract, no minimum commitment, no implementation project. If your organization outgrows per-trip pricing, we offer volume plans that scale with your travel program.

**Q12: Can legal counsel and risk management access the safety binder directly?**

> Yes. You control access to each trip's safety binder. It can be shared with legal counsel, risk management, HR, insurance carriers, or any other stakeholder who needs to review safety preparation. The binder includes a verification hash that confirms the document has not been altered since the analyst completed the review -- providing every stakeholder with confidence in the document's integrity. For litigation purposes, the tamper-evident audit trail provides cryptographic proof of when each review was conducted and what data was available at the time of assessment.

### JSON-LD Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is SafeTrekr just for international trips?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Any trip that takes your employees or athletes away from their normal work or training environment benefits from professional safety review..."
      }
    }
  ]
}
```

(Full JSON-LD includes all 12 Q&A pairs. Answers truncated to 300 characters for schema with full text in `acceptedAnswer`.)

### Accordion Behavior

- `type="single"`: Only one item open at a time
- `collapsible`: All items can be closed
- Chevron rotates 180deg on open (200ms, `ease-default`)
- Content panel: slide-down animation (300ms, `ease-enter`)

### Animation

- Section header: `fadeUp` stagger
- FAQ items: `staggerContainer` at 60ms intervals
- Entry trigger: 20% viewport intersection

### Accessibility Notes

- Section: `<section aria-labelledby="faq-heading">`
- Headline: `<h2 id="faq-heading">`
- Accordion: `aria-expanded` on each trigger. Content announced on expansion via `aria-controls`.
- Each question is an `<h3>` inside the accordion trigger
- Focus-visible ring (2px, `ring` color) on all triggers
- Keyboard: Enter/Space toggles, ArrowUp/ArrowDown navigates between triggers

---

## Section 10: Conversion CTA Band (DARK)

### Layout

**Component**: `CTABand variant="dark"`
**Background**: `secondary` (#123646) with `[data-theme="dark"]`
**Padding**: `py-20 lg:py-28`
**Container**: Centered content

### Content

| Element | Content | Style |
|---------|---------|-------|
| Eyebrow | `READY?` | `.text-eyebrow` in `dark-accent` (#6cbc8b) |
| Headline | `Protect Your Next Business Trip or Tournament` | `.text-display-md` in `dark-text-primary` (#f7f8f8) |
| Body | `See exactly what a professionally reviewed business trip looks like. Download a sample binder or schedule a 30-minute demo with our team.` | `.text-body-lg` in `dark-text-secondary` (#b8c3c7), `max-w-prose mx-auto text-center` |
| CTA Primary | `Get a Demo` | `Button variant="primary-on-dark" size="lg"` (white bg, secondary text) |
| CTA Secondary | `Download Sample Binder` | `Button variant="secondary"` with dark overrides (transparent, white border/text), size="lg" |

**CTA layout**: `flex flex-col sm:flex-row gap-4 justify-center mt-8`

### Animation

- Section: `fadeIn` (background fades)
- Content: `fadeUp` stagger at 100ms (eyebrow, headline, body, CTAs)

### Accessibility Notes

- Section: `<section aria-labelledby="cta-heading" data-theme="dark">`
- Headline: `<h2 id="cta-heading">`
- Both CTAs meet 44x44px minimum touch target
- Contrast: `dark-text-primary` 11.6:1, `dark-text-secondary` 7.0:1, `dark-accent` 4.8:1 -- all PASS WCAG AA
- Focus-visible ring uses `dark-accent` (#6cbc8b) on dark background
- CTA buttons: `aria-label` includes destination context ("Get a Demo -- opens scheduling page", "Download Sample Binder -- opens email-gated download")

---

## Global Page Elements (Corporate/Sports)

### Breadcrumb (Top of Hero)

```
Home  /  Solutions  /  Corporate & Sports Teams
```

- Schema.org BreadcrumbList JSON-LD
- Visual: `.text-body-sm text-muted-foreground`
- Links: `text-primary-700 hover:underline`
- Current page: `text-foreground font-medium` (not linked)
- `<nav aria-label="Breadcrumb">`

### In-Page Navigation (Sticky, appears on scroll)

**Trigger**: Appears after hero scrolls out of viewport.
**Position**: Below sticky site header.
**Style**: `bg-card/90 backdrop-blur-sm border-b border-border py-2`, horizontal scrollable on mobile.

**Anchors**:

| Label | Target |
|-------|--------|
| The Challenge | `#challenge` |
| How It Works | `#how-it-works` |
| Sample Binder | `#sample-binder` |
| Pricing | `#pricing` |
| Security | `#compliance` |
| FAQ | `#faq` |

**Behavior**:
- Active state: `text-primary-700 font-semibold` with 2px bottom border in `primary-500`
- Default: `text-muted-foreground hover:text-foreground`
- Scroll-spy: active state updates based on viewport intersection of target sections
- Smooth scroll on click (respects `prefers-reduced-motion`)

**Responsive**:
- Desktop: Centered horizontal list, all items visible
- Mobile: Horizontal scroll with overflow, `scroll-snap-type: x mandatory`

**Accessibility**:
- `<nav aria-label="Page sections">`
- Links use `aria-current="true"` on active section
- Keyboard: Tab navigates between anchors

---

## SEO Strategy (Corporate/Sports)

### Target Keywords

| Priority | Keyword | Monthly Volume (Est.) | Intent |
|----------|---------|-----------------------|--------|
| Primary | `business travel risk management` | 200-400 | Decision |
| Primary | `duty of care business travel` | 100-300 | Decision |
| Primary | `corporate travel safety plan` | 100-200 | Decision |
| Secondary | `youth sports tournament travel safety` | 50-150 | Decision |
| Secondary | `SafeSport compliance documentation` | 50-100 | Consideration |
| Secondary | `corporate travel duty of care documentation` | 50-100 | Decision |
| Long-tail | `how to document duty of care for business travel` | 20-50 | Consideration |
| Long-tail | `travel safety plan for sports teams` | 50-100 | Consideration |

### On-Page SEO

- `<h1>`: Contains primary keyword variant ("Enterprise Safety at Per-Trip Pricing")
- `<h2>`s: Each section heading targets a keyword cluster
- Body copy: Natural keyword density across "business travel," "duty of care," "safety review," "tournament," "SafeSport," "documentation"
- Internal links: Feature cards link to `/platform/*` pages. Pricing links to `/pricing`. Procurement links to `/procurement`.
- Schema markup: FAQPage JSON-LD (12 Q&As), BreadcrumbList, Organization
- Meta description: 155 characters, includes primary keyword + value proposition + pricing positioning

---

## Performance Considerations (Corporate/Sports)

| Metric | Budget | Strategy |
|--------|--------|----------|
| LCP | < 1.5s | Hero headline is static HTML. No data fetches. Composition images lazy-loaded below fold. |
| CLS | < 0.05 | All images/compositions have explicit dimensions. Font display: swap with fallback stack. |
| INP | < 100ms | Accordion interactions use CSS transitions (no JS layout recalculation). |
| Total page weight | < 500KB | SSG (no server-side rendering). Minimal JS for accordion + scroll-spy. |
| Map tiles | Lazy-loaded | Hero map uses a static image placeholder, MapLibre loads only if interaction occurs. |
| Web fonts | < 100KB | Plus Jakarta Sans (subset 400, 600, 700, 800), Inter (subset 400, 500), JetBrains Mono (subset 400) |

**SSG Strategy**: This page is statically generated at build time. No runtime data fetches. All content is hardcoded. JSON-LD schema is embedded in `<head>`. The only client-side JavaScript is:
1. Accordion open/close (shadcn/ui Accordion)
2. Scroll-spy for in-page navigation
3. Framer Motion scroll-triggered animations (respects `prefers-reduced-motion`)
4. Form interaction on CTA clicks (navigates to `/demo` or `/resources/sample-binders/corporate-travel`)

---

## User Actions Available (Corporate/Sports)

| Action | Mechanism | Destination |
|--------|-----------|-------------|
| Download corporate travel sample binder | Gated CTA | `/resources/sample-binders/corporate-travel` |
| Request a demo | Button | `/demo` |
| View pricing | Link | `/pricing` |
| Explore platform features | Feature cards | `/platform/[feature]` |
| Read corporate travel blog posts | Related content | `/blog/category/corporate-travel` |
| Access procurement resources | Link | `/procurement` |
| Expand FAQ items | Accordion | In-page |

### Primary CTAs (Priority Order)

1. "Download Corporate Travel Sample Binder" (hero primary, binder preview)
2. "Get a Demo" (hero secondary, final CTA)
3. "View Pricing" (pricing context link)

---

## Responsive Behavior Summary (Both Pages)

### Desktop (>= 1280px)

- Maximum content width: 1280px, centered with generous side margins
- Hero: 6+6 column grid
- ProcessTimeline: Horizontal 3-column
- FeatureCards: 2x2 grid
- Pricing cards: 3 columns
- Trust badges: 4 columns
- Stats: 3 columns
- FAQ: centered, max-w-3xl

### Laptop (1024-1279px)

- Same as desktop with tighter margins
- Hero visual slightly smaller

### Tablet (768-1023px)

- Hero: Stacked (text above, composition below at 80% width)
- ProcessTimeline: Vertical stack
- FeatureCards: 2x2 grid
- Pricing cards: 3 columns (tighter)
- Trust badges: 2x2 grid
- Stats: 3 columns
- FAQ: full width with padding

### Mobile (< 768px)

- All layouts: single column
- Hero visual: Simplified (single document preview card)
- ProcessTimeline: Vertical stack with left-aligned timeline indicators
- FeatureCards: stacked, full width
- Pricing cards: stacked, most common first
- Trust badges: stacked
- Stats: 2 columns
- FAQ: full width
- CTAs: Full width, stacked vertically
- In-page nav: Horizontal scroll

### Small Mobile (< 375px)

- Side padding: 16px (reduced from 24px)
- Display text scales down via `clamp()` (minimum values apply)
- CTA buttons remain full-width, stacked
- Cards: reduced padding (p-4 instead of p-6)

---

## Accessibility Compliance Summary (Both Pages)

### WCAG 2.2 AA Checklist

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| Text contrast >= 4.5:1 (normal) | All text/background combinations validated per design system contrast matrix. `muted-foreground` (#4d5153) on `background` = 5.2:1. Dark section text = 7.0:1+ | PASS |
| Text contrast >= 3:1 (large) | Display/heading text exceeds 4.5:1 on all backgrounds | PASS |
| Focus indicators >= 2px | `ring` token (#365462), 2px width, 2px offset on all interactive elements | PASS |
| Touch targets >= 44x44px | All buttons, links, accordion triggers meet minimum | PASS |
| Keyboard navigation | Full tab order: skip-nav, breadcrumb, hero CTAs, in-page nav, feature card links, binder CTA, pricing links, compliance links, FAQ triggers, CTA band buttons | PASS |
| Skip navigation | First focusable element jumps to `#main-content` | PASS |
| ARIA landmarks | `<header>`, `<nav>` (main + breadcrumb + in-page), `<main>`, `<section>` (10 labeled), `<footer>` | PASS |
| `aria-current="page"` | Breadcrumb last item, in-page nav active section | PASS |
| `prefers-reduced-motion` | All animations disabled. Elements render in final state. CSS transitions reduced to opacity only. | PASS |
| Heading hierarchy | h1 (hero) > h2 (9 section headings) > h3 (feature cards, FAQ questions, stat labels) | PASS |
| Image alternatives | All decorative visuals: `aria-hidden="true"` with visually hidden descriptions. No content images without alt text. | PASS |
| Form labels | CTA downloads link to gated forms on separate pages -- all forms follow `DemoRequestForm` accessibility spec | PASS |

---

## Shared Component Reuse Summary

Both pages share identical implementations of:

| Component | Reuse Status |
|-----------|-------------|
| `TrustMetricsStrip` | Identical across all segment pages (shared component, no segment-specific overrides) |
| `ProcessTimeline` | Shared structure, segment-specific content via props |
| `FeatureCard` / `FeatureGrid` | Shared component, segment-specific titles, descriptions, and links via props |
| `DocumentPreview` | Shared component, segment-specific binder content via props |
| `DarkAuthoritySection` | Shared wrapper, segment-specific stat annotations and narrative via children |
| `CTABand` | Shared component, segment-specific headline and body via props |
| `FAQSection` / `Accordion` | Shared component, segment-specific questions via data array |
| `SiteHeader` | Shared across all pages |
| `SiteFooter` | Shared across all pages |
| In-page nav | Same anchor structure, same scroll-spy behavior |
| Breadcrumb | Segment-specific path, shared component |

**Segment-specific content is always passed as props or content arrays -- never as component forks.** The 10-section rhythm, animation patterns, responsive behavior, and accessibility contracts are identical across all segment pages. Only the words, pricing scenarios, compliance framing, and visual composition details change.
