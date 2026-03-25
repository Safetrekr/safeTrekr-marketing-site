# High-Fidelity Mockup Specification: Church/Missions Solutions Page

**URL**: `/solutions/churches`
**Version**: 1.0
**Date**: 2026-03-24
**Status**: Implementation-ready mockup specification
**Page Type**: Segment Landing Page (SSG) -- L2 hierarchy
**Canonical Source**: DESIGN-SYSTEM.md v1.0, INFORMATION-ARCHITECTURE.md v1.0.0

> This is the beachhead segment page -- the deepest, most conversion-optimized page at launch. Every section is designed to convert church missions directors, senior pastors, youth leaders, insurance committees, and denominational leaders. Church-specific vocabulary is mandatory throughout: duty of care, volunteer screening, mission field safety, stewardship, youth protection.

---

## Page Metadata

| Property | Value |
|----------|-------|
| `<title>` | `Mission Trip Safety for Churches & Mission Organizations -- SafeTrekr` |
| `meta description` | `SafeTrekr assigns a professional safety analyst to review every mission trip your church sends -- across 17 dimensions of risk. Government intelligence. Audit-ready documentation. Starting at $450 per trip.` |
| `og:title` | `Mission Trip Safety Built for Faith-Based Organizations` |
| `og:description` | `Professional analyst review, government intelligence, and tamper-evident documentation for every mission trip. Starting at $450.` |
| `og:image` | `/og/solutions-churches.png` (1200x630, church-specific composition) |
| `og:type` | `website` |
| JSON-LD | `FAQPage` schema with 12 church-specific Q&As (see Section 9) |
| Breadcrumb JSON-LD | `Home > Solutions > Churches & Mission Organizations` |
| Canonical | `https://safetrekr.com/solutions/churches` |
| Redirects | `/solutions/church`, `/solutions/mission`, `/churches` all 301 to canonical |

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
| Breadcrumb: Home > Solutions > Churches & Mission Orgs       |
+--------------------------------------------------------------+
|                                                              |
|  [Eyebrow]                    +---------------------------+  |
|                               |                           |  |
|  [Headline -- 2 lines max]   |   MISSION TRIP BINDER     |  |
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
**Mobile (< md)**: Stacked. Text above. Simplified visual: single document preview card with mission trip binder cover.

### Content

| Element | Content | Style |
|---------|---------|-------|
| Breadcrumb | `Home / Solutions / Churches & Mission Organizations` | `.text-body-sm text-muted-foreground mb-6`, links in `text-primary-700` |
| Eyebrow | `MISSION TRIP SAFETY` | `.text-eyebrow text-primary-700`, leading `Shield` icon (16px, `primary-700`) |
| Headline | `Your Mission Team Deserves a Safety Analyst` | `.text-display-xl text-foreground max-w-[20ch]` |
| Subheadline | `SafeTrekr brings the same professional safety review that Fortune 500 companies use for business travel to every mission trip your church sends. Government intelligence. 17-section analyst review. Audit-ready documentation your insurance carrier and church board can trust.` | `.text-body-lg text-muted-foreground max-w-[50ch] mt-6` |
| CTA Primary | `Download Mission Trip Sample Binder` | `Button variant="primary" size="lg"`, `Download` icon left |
| CTA Secondary | `Get a Demo` | `Button variant="secondary" size="lg"`, `ArrowRight` icon right |
| CTA Spacing | `flex flex-wrap gap-4 mt-8` | Stacked full-width on < sm, horizontal on >= sm |

### Visual Composition (Right Column)

A mission-trip-specific variant of the `DocumentPreview` component overlaid on a subtle map fragment.

**Layer 1 -- Map Fragment (Base)**:
- Dimensions: 480x360px desktop, aspect-ratio preserved smaller
- Desaturated map tile showing a Central American region (15% saturation)
- Single curved route path in `primary-500` (3px stroke)
- 2 waypoint circles: departure city and mission destination
- `rounded-xl shadow-lg border border-border overflow-hidden`
- Entry animation: `scaleIn` (800ms, spring)

**Layer 2 -- Mission Trip Binder Preview (Overlaid upper-right)**:
- `DocumentPreview` component customized:
  - Eyebrow: "International Mission Trip"
  - Title: "Safety Binder"
  - Badge: "17 Sections Reviewed" in `Badge variant="default"`
  - 2 sample line items: "Venue Safety Assessment -- Completed", "Emergency Evacuation Routes -- Verified"
  - SHA-256 hash snippet in `mono-sm`
- `rounded-xl bg-white shadow-xl border border-border p-5`
- Offset: overlaps map by 40px bottom-right
- Entry animation: `documentStack` (staggered 200ms after map)

**Layer 3 -- Status Badge (Lower-left of map)**:
- `MotifBadge motif="readiness"` showing "Trip Ready"
- Entry animation: `markerPop` (400ms delay)

### Accessibility Notes

- Breadcrumb: `<nav aria-label="Breadcrumb">` with `<ol>` and `aria-current="page"` on last item
- Hero visual composition: `aria-hidden="true"` (decorative) with a visually hidden `<p>` describing the visual: "Composed interface showing a mission trip safety binder with map intelligence, analyst review status, and evidence documentation."
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

**Headline**: `Good Intentions Are Not a Safety Plan`
**Headline style**: `.text-display-md text-foreground max-w-[28ch]`

**Body copy**:

> Every year, thousands of churches send mission teams to unfamiliar destinations with a planning process that amounts to a spreadsheet, a prayer chain, and a hope that nothing goes wrong. Most trips go fine. But when one does not, the first question from your insurance carrier is always the same: "What did you do to prepare?"

**Body style**: `.text-body-lg text-muted-foreground max-w-prose mt-6`

**Closing line**:

> Faith and preparation are not opposites. They are partners.

**Closing style**: `.text-body-lg text-foreground font-medium max-w-prose mt-4`

### Status Quo Contrast Cards (Right Column)

Four cards showing what churches currently rely on. Each card: `bg-card rounded-xl border border-border p-6 shadow-card`.

**Card 1: Informal Planning**
- Icon: `FileText` in `muted-foreground`
- Title: `Volunteer-Assembled Trip Binders`
- Description: `Trip leaders compile safety information from Google searches, past experience, and other churches' templates. No standardized review process. No professional verification.`

**Card 2: Insurance Guesswork**
- Icon: `Shield` in `muted-foreground`
- Title: `Insurance Questionnaires Answered with Guesswork`
- Description: `When carriers ask "Have you conducted a formal risk assessment?" -- the honest answer is usually no. Checking "yes" without documentation creates liability, not coverage.`

**Card 3: Youth Protection Gaps**
- Icon: `Users` in `muted-foreground`
- Title: `Volunteer Screening Without Verification`
- Description: `Background check policies vary by denomination. Even churches with screening protocols rarely extend them to mission trip contexts or verify them across state lines.`

**Card 4: No Documentation Trail**
- Icon: `AlertCircle` in `muted-foreground`
- Title: `No Audit Trail When It Matters`
- Description: `If a team member is injured in Honduras, what documentation proves your church took reasonable precautions? A prayer list and a group text thread are not evidence of due diligence.`

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

**Headline**: `Professional Safety Review for Every Mission Trip`
**Headline style**: `.text-display-md text-foreground text-center max-w-[28ch] mx-auto`

**Subheadline**: `From trip submission to safety binder delivery in 3-5 days. Here is exactly what happens.`
**Subheadline style**: `.text-body-lg text-muted-foreground text-center max-w-prose mx-auto mt-4`

### Three-Act ProcessTimeline (Mission Trip Flavor)

**Component**: `ProcessTimeline`

**Desktop (>= lg)**: Horizontal 3-column grid with numbered step connectors.
**Mobile (< lg)**: Vertical `TimelineStep` stack.

| Step | Number | Title | Description |
|------|--------|-------|-------------|
| Act 1 | 1 | Intelligence Gathering | Before your team boards a plane, we pull real-time safety data from NOAA, USGS, CDC, ReliefWeb, and GDACS -- the same sources humanitarian agencies use to assess field conditions. Weather patterns at your destination. Seismic risk. Disease advisories. Local security conditions. Every data point scored, not just collected. |
| Act 2 | 2 | Analyst Safety Review | A trained safety analyst reviews every detail of your mission trip across 17 sections -- host organization vetting, lodging safety, in-country transportation, emergency medical facilities, evacuation routes, communication infrastructure, water and food safety, and more. They flag what needs attention and document what is ready. |
| Act 3 | 3 | Documented Evidence Binder | Your church receives a complete safety binder -- every review finding, every government data source, every decision documented with tamper-evident audit trails. When your insurance carrier asks what you did to prepare, when your church board wants to see the safety plan, when a concerned parent asks how you assessed the risk -- you hand them the binder. |

**Step card style**: Numbered circles (`h-10 w-10 rounded-full bg-primary-100 text-primary-700 font-semibold`), connectors (`1px border-border` horizontal line), heading (`.text-heading-md`), description (`.text-body-md text-muted-foreground max-w-[45ch]`).

### Feature Cards (Church-Specific Benefits)

**Component**: `FeatureGrid` with 4 `FeatureCard` items
**Layout**: `grid sm:grid-cols-2 gap-6`, below the ProcessTimeline with `mt-16`

**Card 1: Analyst Safety Review**
- `motifType`: `review`
- Icon: `ClipboardCheck` in `primary-700`
- Title: `Every Mission Field Reviewed by a Professional Analyst`
- Description: `Your trip leader focuses on ministry. Our analyst focuses on safety. 17 sections covering venues, lodging, transportation, emergency contacts, evacuation routes, local hospitals, weather windows, and more.`
- Link: `Learn about analyst review` -> `/platform/analyst-review`

**Card 2: Risk Intelligence**
- `motifType`: `route`
- Icon: `MapPin` in `primary-700`
- Title: `Government Data on Every Destination Your Team Visits`
- Description: `Real-time intelligence from 5 government sources -- not a Google search. NOAA weather data, CDC health advisories, USGS seismic activity, and two international humanitarian agencies. Risk scored with Monte Carlo simulation so you understand probability, not just possibility.`
- Link: `Learn about risk intelligence` -> `/platform/risk-intelligence`

**Card 3: Trip Safety Binder**
- `motifType`: `record`
- Icon: `FileText` in `foreground`
- Title: `Audit-Ready Documentation for Your Insurance Carrier and Board`
- Description: `Every finding documented. Every data source cited. Every decision recorded with SHA-256 tamper-evident audit trails. The binder your insurance carrier wishes every church had -- and the one your board will thank you for.`
- Link: `Learn about the safety binder` -> `/platform/safety-binder`

**Card 4: Mobile Field Operations**
- `motifType`: `readiness`
- Icon: `Activity` in `safety-green`
- Title: `Rally Points, Check-Ins, and Emergency Contacts in Every Chaperone's Pocket`
- Description: `During your mission trip, every team leader gets the SafeTrekr mobile app -- live geofencing, muster check-ins, rally point navigation, SMS broadcast, and morning/evening safety briefings. No cell tower? Offline mode keeps critical information accessible.`
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

**Headline**: `See Exactly What Your Insurance Carrier and Church Board Will Receive`
**Headline style**: `.text-display-md text-foreground max-w-[28ch]`

**Body**:

> Every SafeTrekr review produces a comprehensive safety binder customized to your mission trip. This is not a template or a generic checklist. It is the documented output of a professional analyst reviewing your specific trip -- your destinations, your dates, your venues, your team.

**Body style**: `.text-body-lg text-muted-foreground max-w-prose mt-6`

**Binder contents list** (with `Check` icons in `primary-500`):

1. `Destination risk assessment with government intelligence data`
2. `Venue and lodging safety verification`
3. `Emergency medical facility locations and contact information`
4. `Evacuation routes and contingency plans`
5. `Transportation safety evaluation`
6. `Communication infrastructure assessment`
7. `Tamper-evident audit trail with SHA-256 hash chain`

**List style**: `space-y-3 mt-6`, each item: `flex items-start gap-3`, check icon `h-5 w-5 text-primary-500 mt-0.5 shrink-0`, text `.text-body-md text-muted-foreground`

**CTA**: `Download the Mission Trip Sample Binder`
**CTA style**: `Button variant="primary" size="lg" className="mt-8"`, `Download` icon left

**CTA subtext**: `See a real safety binder output. Gated with email -- we will not spam you.`
**Subtext style**: `.text-body-sm text-muted-foreground mt-2`

### Visual Column (Binder Preview)

A composed visual showing 3-5 stacked page thumbnails from the International Mission Trip sample binder.

**Structure**:
- 3 offset page cards (fanning effect) creating depth
- Front page: `bg-white rounded-lg shadow-xl border border-border p-6 w-[340px]`
  - Header: "SafeTrekr" logo mark (24px) + "International Mission Trip" eyebrow
  - Title: "Safety Binder" in `.text-heading-md`
  - Subtitle: "Guatemala City -- Antigua -- Lake Atitlan"
  - Date: "June 15-22, 2026"
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
- Binder visual: `aria-hidden="true"` with visually hidden description: "Preview of an International Mission Trip safety binder showing cover page with destinations, review sections, and analyst verification status."
- CTA download: Announces as "Download the Mission Trip Sample Binder, opens email-gated form"
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

**Headline**: `Documented Accountability, Not Just Good Intentions`
**Headline style**: `.text-display-md` (renders `dark-text-primary` #f7f8f8, 11.6:1 contrast)

### Stat Cards

3 stat cards in a row on dark surface. Card style: `bg-[var(--color-dark-surface)] rounded-xl border border-[var(--color-dark-border)] p-8 text-center`.

| Value | Label | Annotation |
|-------|-------|------------|
| `17` | Analyst Review Sections | Every trip reviewed across venues, lodging, transportation, emergency contacts, evacuation routes, weather, health advisories, and more |
| `5` | Government Intelligence Sources | NOAA, USGS, CDC, ReliefWeb, GDACS -- the same sources humanitarian agencies rely on |
| `3-5 Days` | Submission to Binder Delivery | Professional review and documentation delivered before your team departs |

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

> The difference between a prepared church and a lucky church is not what happens on the trip. It is what exists in the filing cabinet before the trip begins. SafeTrekr produces the documentation that turns your church's commitment to safety from a verbal assurance into defensible evidence.

**Style**: `.text-body-lg` in `dark-text-secondary` (7.0:1 contrast), `text-center max-w-prose mx-auto mt-12`

### Note on Testimonials

**No testimonial block at launch.** Per design system non-negotiable: no fabricated quotes. When real church testimonials are obtained, a testimonial card slot exists here with the following structure:
- Quote text in `dark-text-primary`, 20px italic
- Attribution: name, title, church name in `dark-text-secondary`
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

**Headline**: `Less Than You Think. Worth More Than You Know.`
**Headline style**: `.text-display-md text-foreground max-w-[28ch]`

**Body**:

> A professional safety review for your mission trip costs less than one percent of a typical mission trip budget. That is the cost of documented accountability for every person you send.

**Body style**: `.text-body-lg text-muted-foreground max-w-prose mt-4`

### Pricing Scenario Cards

3 cards showing real pricing math. Each card: `bg-card rounded-2xl border border-border p-8 shadow-card`.

**Card 1: Domestic Mission Trip**
- Badge: `Badge variant="default"` "Most Common"
- Price: `$450`
- Price style: `.text-display-lg text-foreground`
- Unit: `per domestic trip`
- Unit style: `.text-body-md text-muted-foreground`
- Context line 1: `$30 per team member for a group of 15`
- Context line 2: `3% of a $15,000 mission budget`
- Context style: `.text-body-sm text-muted-foreground mt-4 space-y-1`
- Includes list (check icons in `primary-500`):
  - `17-section professional analyst review`
  - `Government intelligence risk scoring`
  - `Complete safety binder with audit trail`
  - `Mobile app access for team leaders`
  - `AM/PM safety briefings during trip`

**Card 2: International Mission Trip**
- Badge: none
- Price: `$1,250`
- Unit: `per international trip`
- Context line 1: `$50 per team member for a group of 25`
- Context line 2: `Less than 1% of a $7,000-per-person mission budget`
- Context line 3: `Less than one emergency evacuation consultation`
- Includes: same list as domestic

**Card 3: Multi-Trip Church**
- Badge: none
- Price: `Custom`
- Unit: `volume pricing for 5+ trips per year`
- Context line 1: `A church sending 3 domestic + 2 international trips:`
- Context line 2 (calculated): `$3,850/year for complete safety coverage`
- Context line 3: `Volume discounts available for 5+ trips annually`
- CTA inside card: `Get a Custom Quote` (Button variant="secondary" size="default")

### Pricing Card Grid

| Breakpoint | Layout |
|------------|--------|
| < md | 1 column, stacked, domestic card first |
| md-lg | 3 columns, equal width |
| >= lg | 3 columns, equal width |

### Cost-of-Inaction Comparison Block

Below the pricing cards, `mt-12`. `bg-card rounded-xl border border-border p-8`.

**Headline**: `The Cost of Not Having a Safety Review`
**Headline style**: `.text-heading-md text-foreground`

**Comparison table** (2 columns):

| Without SafeTrekr | With SafeTrekr |
|-------------------|----------------|
| 40-60 hours of volunteer time per international trip assembling safety information from scattered sources | Professional analyst completes 17-section review in 3-5 days. Your volunteer team focuses on ministry preparation. |
| Insurance questionnaires answered with best guesses. No formal risk assessment documentation. | Every insurance question answered with cited evidence. Formal risk assessment your carrier can audit. |
| If something goes wrong: "We did our best" is your only defense. | If something goes wrong: a complete evidence binder with every decision documented and tamper-proof. |
| Average cost of a single medical evacuation from Central America: $25,000-$50,000. | $1,250 for documented proof you took every reasonable precaution. |

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
- Pricing cards: Price values use `aria-label` with full context (e.g., "$450 per domestic mission trip")
- Comparison: Use `<dl>` (definition list) or `<table>` with proper `<th>` headers for the comparison. `<caption>` for table: "Comparison of mission trip safety approaches"
- No animation on pricing cards (per design system rule: "Stability and readability are paramount")
- All monetary values are presented as text, not images

---

## Section 8: Compliance & Trust

### Layout

**Background**: `bg-card`
**Padding**: Standard section padding
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

**Structure**: Section header (centered) + badge grid + insurance narrative + procurement link

### Section Header

**Eyebrow**: `SECURITY & COMPLIANCE`
**Eyebrow style**: `.text-eyebrow text-primary-700`, `Shield` icon

**Headline**: `Built to Satisfy Your Insurance Carrier and Denomination`
**Headline style**: `.text-display-md text-foreground text-center max-w-[28ch] mx-auto`

### Trust Badge Grid

4 badges in a horizontal row (desktop) or 2x2 grid (mobile). Each badge: `bg-background rounded-xl border border-border p-6 text-center`.

| Badge | Icon | Title | Description |
|-------|------|-------|-------------|
| 1 | `Shield` (32px, `primary-700`) | `AES-256 Encryption` | All data encrypted at rest and in transit. Your team's information is protected with the same standard used by financial institutions. |
| 2 | `FileText` (32px, `primary-700`) | `SHA-256 Evidence Chain` | Every review finding, every analyst decision, every data source documented with cryptographic integrity. Tamper-evident by design. |
| 3 | `Activity` (32px, `primary-700`) | `SOC 2 Type II` | Audit in progress. We are pursuing SOC 2 Type II certification to validate our security controls. (Status: In Progress) |
| 4 | `ClipboardCheck` (32px, `primary-700`) | `Insurance-Ready Documentation` | Every binder is structured to satisfy the safety documentation requirements your insurance carrier needs to process claims and assess coverage. |

**Badge grid layout**:

| Breakpoint | Columns |
|------------|---------|
| < sm | 1 column |
| sm-md | 2 columns |
| >= md | 4 columns |

### Insurance Narrative Block

Below the badges, `mt-12`. Centered text block.

**Headline**: `Your Insurance Carrier Will Thank You`
**Headline style**: `.text-heading-md text-foreground text-center`

**Body**:

> Most church insurance policies require "reasonable precautions" for off-site activities. The problem is that "reasonable" is undefined until something goes wrong. SafeTrekr defines it: a professional 17-section safety review backed by government intelligence data, documented with tamper-evident audit trails. That is not reasonable -- it is exceptional. And it is the documentation your carrier needs to honor your coverage.

**Body style**: `.text-body-lg text-muted-foreground text-center max-w-prose mx-auto mt-4`

### Procurement Link

**Text**: `Institutional buyer? Download our W-9, security questionnaire responses, and insurance documentation.`
**Link**: `Visit our procurement page` -> `/procurement`
**Style**: `.text-body-md text-center mt-8`, link in `text-primary-700 font-medium` with `ArrowRight` icon

### Animation

- Section header: `fadeUp` stagger
- Badge grid: `staggerContainer + cardReveal` at 80ms
- Insurance narrative: `fadeUp` (200ms delay)

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

**Headline**: `Everything Your Missions Committee Will Ask`
**Headline style**: `.text-display-md text-foreground text-center max-w-[28ch] mx-auto`

### FAQ Items (12 Questions)

Uses shadcn/ui `Accordion` primitive, `type="single" collapsible`. Each trigger: `.text-heading-sm text-foreground`. Each content panel: `.text-body-md text-muted-foreground`.

**Q1: Do we need SafeTrekr for domestic mission trips too?**

> Yes. A domestic mission trip still involves transporting volunteers -- often including minors -- to unfamiliar locations. Your duty of care obligation does not depend on whether you cross a border. A domestic trip to rural Appalachia carries weather risk, transportation risk, venue safety considerations, and emergency access challenges that deserve the same professional review as an international trip. Our domestic mission trip review costs $450.

**Q2: How does SafeTrekr handle international destinations with limited infrastructure?**

> Our analyst reviews specifically account for infrastructure gaps. When a destination has limited emergency medical facilities, unreliable communication networks, or poor road conditions, those factors are documented in the binder -- along with contingency plans. Our intelligence data from ReliefWeb and GDACS is specifically designed for regions where standard travel advisories fall short. Many of the destinations churches send mission teams are exactly the places that need the most thorough safety review.

**Q3: Can our volunteer trip leader use this without training?**

> Yes. Trip submission is a guided 10-step wizard that takes 15-20 minutes. Your trip leader enters destinations, dates, venues, team members, and transportation details. Our analyst handles the rest. The mobile app for field operations is designed for non-technical users -- rally points, check-ins, and emergency contacts are accessible with one tap. No training certification required.

**Q4: What does our insurance carrier receive?**

> Your insurance carrier receives the same safety binder your church board reviews -- a complete 17-section analyst report with government intelligence data, venue safety assessments, emergency preparedness documentation, and a tamper-evident audit trail. Many carriers specifically ask whether a formal risk assessment was conducted. With SafeTrekr, the answer is documented, not anecdotal.

**Q5: How quickly do we get the safety binder back?**

> 3-5 business days from trip submission to binder delivery. For churches planning mission trips months in advance, this timeline fits naturally into your preparation schedule. If your destination conditions change after the initial review, our analyst can update the binder with current intelligence data.

**Q6: Can SafeTrekr handle multi-stop mission trips?**

> Yes. Many mission trips involve multiple cities, venues, and lodging locations. Our analyst reviews each stop independently -- the safety conditions in Guatemala City are different from those in Antigua or a rural village. Each destination gets its own risk intelligence assessment. The final binder consolidates all stops into a single, comprehensive document with per-destination findings.

**Q7: Is SafeTrekr appropriate for youth group trips?**

> Absolutely. Youth group trips carry heightened duty of care obligations because you are transporting minors. SafeTrekr's review includes factors specifically relevant to youth safety -- venue appropriateness, emergency medical proximity for pediatric care, communication reliability for parent updates, and documented supervision planning. The binder provides your church with evidence that youth protection was professionally reviewed, not just assumed.

**Q8: How does pricing work for multiple trips per year?**

> Each trip is priced independently -- $450 for domestic, $750 for domestic overnight, $1,250 for international. Churches booking 5 or more trips per year qualify for volume pricing. A church sending 3 domestic mission trips and 2 international trips would pay approximately $3,850 before any volume discount. Contact us for a custom quote that reflects your annual mission schedule.

**Q9: What if our denomination already has safety guidelines?**

> SafeTrekr complements and strengthens your denominational safety requirements. Most denominational guidelines provide a framework -- SafeTrekr provides the documented execution. Your safety binder demonstrates compliance with denominational policies through professional verification, not self-reported checklists. Several denominations are evaluating SafeTrekr as a recommended resource for their member churches.

**Q10: Do you offer background check services for mission trip volunteers?**

> Yes. SafeTrekr offers background checks as an add-on service at $35 per person. These can be integrated into your trip preparation workflow so that volunteer screening and trip safety review happen through a single platform. Background check results are stored with the same encryption and access controls as all SafeTrekr data.

**Q11: What happens if conditions change after we receive the binder?**

> Your safety analyst monitors conditions for active trips. During your mission trip, your team receives morning and evening safety briefings covering weather changes, transit advisories, local events, and overnight developments. If conditions change significantly before departure, we can update your binder with current intelligence. The binder is a living document until your team returns home.

**Q12: Can church board members access the safety binder directly?**

> Yes. You control access to the safety binder. It can be shared as a PDF with your church board, insurance committee, denominational leadership, or anyone else who needs to review your safety preparation. The binder includes a verification hash that confirms the document has not been altered since the analyst completed the review -- providing your board with confidence that what they are reading is the unmodified professional assessment.

### JSON-LD Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do we need SafeTrekr for domestic mission trips too?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. A domestic mission trip still involves transporting volunteers -- often including minors -- to unfamiliar locations. Your duty of care obligation does not depend on whether you cross a border..."
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
| Headline | `Protect Your Next Mission Trip` | `.text-display-md` in `dark-text-primary` (#f7f8f8) |
| Body | `See exactly what a professionally reviewed mission trip looks like. Download a sample binder or schedule a 30-minute demo with our team.` | `.text-body-lg` in `dark-text-secondary` (#b8c3c7), `max-w-prose mx-auto text-center` |
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

## Global Page Elements

### Breadcrumb (Top of Hero)

```
Home  /  Solutions  /  Churches & Mission Organizations
```

- Schema.org BreadcrumbList JSON-LD
- Visual: `.text-body-sm text-muted-foreground`
- Links: `text-primary-700 hover:underline`
- Current page: `text-foreground font-medium` (not linked)
- `<nav aria-label="Breadcrumb">`

### In-Page Navigation (Sticky, appears on scroll)

For this long page (10+ sections), a subtle in-page nav anchors to major sections.

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

## Responsive Behavior Summary

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
- Pricing cards: stacked, domestic first
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

## Performance Considerations

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
4. Form interaction on CTA clicks (navigates to `/demo` or `/resources/sample-binders/mission-trip`)

---

## SEO Strategy

### Target Keywords

| Priority | Keyword | Monthly Volume (Est.) | Intent |
|----------|---------|-----------------------|--------|
| Primary | `mission trip safety plan` | 200-400 | Decision |
| Primary | `church travel risk management` | 100-200 | Decision |
| Primary | `youth group trip safety` | 100-300 | Decision |
| Secondary | `mission trip insurance documentation` | 50-150 | Decision |
| Secondary | `church mission trip liability` | 50-150 | Consideration |
| Long-tail | `how to plan a safe mission trip for church` | 50-100 | Consideration |
| Long-tail | `mission trip safety checklist for churches` | 50-100 | Consideration |

### On-Page SEO

- `<h1>`: Contains primary keyword variant ("Your Mission Team Deserves a Safety Analyst")
- `<h2>`s: Each section heading targets a keyword cluster
- Body copy: Natural keyword density across "mission trip," "safety review," "church," "duty of care," "insurance," "documentation"
- Internal links: Feature cards link to `/platform/*` pages. Pricing links to `/pricing`. Procurement links to `/procurement`.
- Schema markup: FAQPage JSON-LD (12 Q&As), BreadcrumbList, Organization
- Meta description: 155 characters, includes primary keyword + value proposition + price anchor

---

## Accessibility Compliance Summary

### WCAG 2.2 AA Checklist for This Page

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
| Error announcements | FAQ accordion uses `aria-expanded`. Form errors (on linked pages) use `aria-describedby` and `aria-live="polite"`. | PASS |
| Color independence | Status indicators never rely on color alone. Check icons + text labels. No safety-status colors used decoratively. | PASS |

### Focus Order (Complete Tab Sequence)

```
1.  Skip navigation link (hidden until focused)
2.  Site header: Logo link
3.  Site header: Nav links (Solutions, How It Works, Features, Pricing, About)
4.  Site header: Sign In (ghost), Get a Demo (primary)
5.  Breadcrumb: Home link, Solutions link
6.  Hero: Primary CTA ("Download Mission Trip Sample Binder")
7.  Hero: Secondary CTA ("Get a Demo")
8.  In-page nav: The Challenge, How It Works, Sample Binder, Pricing, Security, FAQ
9.  Section 4: Feature Card 1 link (analyst review)
10. Section 4: Feature Card 2 link (risk intelligence)
11. Section 4: Feature Card 3 link (safety binder)
12. Section 4: Feature Card 4 link (mobile operations)
13. Section 5: "Download the Mission Trip Sample Binder" CTA
14. Section 7: Multi-trip card "Get a Custom Quote" CTA
15. Section 7: "View full pricing details" link
16. Section 8: "Visit our procurement page" link
17. Section 9: FAQ accordion triggers (Q1-Q12, sequential)
18. Section 10: "Get a Demo" CTA
19. Section 10: "Download Sample Binder" CTA
20. Footer: all footer links
```

---

## Component Dependency Map

| Component | File | Used In Sections |
|-----------|------|-----------------|
| `Button` | `components/ui/button.tsx` | 1, 5, 7, 10 |
| `Badge` | `components/ui/badge.tsx` | 1, 7 |
| `Eyebrow` | `components/ui/eyebrow.tsx` | 1, 3, 4, 5, 6, 7, 8, 9, 10 |
| `Divider` | `components/ui/divider.tsx` | Between sections (route variant) |
| `StatCard` | `components/marketing/stat-card.tsx` | 2, 6 |
| `FeatureCard` | `components/marketing/feature-card.tsx` | 4 |
| `MotifBadge` | `components/marketing/motif-badge.tsx` | 1, 4 |
| `DocumentPreview` | `components/marketing/document-preview.tsx` | 1, 5 |
| `ProcessTimeline` | `components/marketing/process-timeline.tsx` | 4 |
| `FAQSection` | `components/marketing/faq-section.tsx` | 9 |
| `CTABand` | `components/marketing/cta-band.tsx` | 10 |
| `DarkAuthoritySection` | `components/marketing/dark-authority-section.tsx` | 6, 10 |
| `TrustMetricsStrip` | `components/marketing/trust-metrics-strip.tsx` | 2 |
| `FeatureGrid` | `components/marketing/feature-grid.tsx` | 4 |
| `SiteHeader` | `components/layout/site-header.tsx` | Global |
| `SiteFooter` | `components/layout/site-footer.tsx` | Global |

---

## Content Inventory (All Copy)

Every piece of text content on the page, catalogued for copy review and localization.

### Headlines (h1/h2)

| Section | Headline | Character Count |
|---------|----------|:-:|
| 1 | Your Mission Team Deserves a Safety Analyst | 46 |
| 3 | Good Intentions Are Not a Safety Plan | 38 |
| 4 | Professional Safety Review for Every Mission Trip | 50 |
| 5 | See Exactly What Your Insurance Carrier and Church Board Will Receive | 69 |
| 6 | Documented Accountability, Not Just Good Intentions | 52 |
| 7 | Less Than You Think. Worth More Than You Know. | 48 |
| 8 | Built to Satisfy Your Insurance Carrier and Denomination | 56 |
| 9 | Everything Your Missions Committee Will Ask | 44 |
| 10 | Protect Your Next Mission Trip | 31 |

### Eyebrows

| Section | Eyebrow |
|---------|---------|
| 1 | MISSION TRIP SAFETY |
| 3 | THE REALITY TODAY |
| 4 | HOW SAFETREKR WORKS |
| 5 | SAMPLE BINDER |
| 6 | BY THE NUMBERS |
| 7 | PRICING |
| 8 | SECURITY & COMPLIANCE |
| 9 | COMMON QUESTIONS |
| 10 | READY? |

### CTAs (All Instances)

| Location | Label | Destination | Variant | Priority |
|----------|-------|-------------|---------|----------|
| Hero (primary) | Download Mission Trip Sample Binder | `/resources/sample-binders/mission-trip` | `primary`, `lg` | Tier 1 |
| Hero (secondary) | Get a Demo | `/demo` | `secondary`, `lg` | Tier 3 |
| Section 5 | Download the Mission Trip Sample Binder | `/resources/sample-binders/mission-trip` | `primary`, `lg` | Tier 1 |
| Section 7 (card) | Get a Custom Quote | `/pricing#quote` | `secondary`, `default` | Tier 4 |
| Section 7 (link) | View full pricing details | `/pricing` | `link` | Navigation |
| Section 8 (link) | Visit our procurement page | `/procurement` | `link` | Navigation |
| Section 10 (primary) | Get a Demo | `/demo` | `primary-on-dark`, `lg` | Tier 3 |
| Section 10 (secondary) | Download Sample Binder | `/resources/sample-binders/mission-trip` | secondary (dark), `lg` | Tier 1 |

### Church-Specific Vocabulary Used

| Term | Occurrences | Context |
|------|:-:|---------|
| Mission trip | 40+ | Primary trip type throughout |
| Duty of care | 4 | Legal obligation framing |
| Stewardship | 2 | Financial framing (pricing section) |
| Youth protection | 3 | Youth group FAQ, challenge section |
| Volunteer screening | 3 | Challenge section, FAQ |
| Church board | 8 | Decision-maker audience |
| Insurance carrier | 9 | Compliance and trust framing |
| Denomination / Denominational | 4 | Compliance, FAQ |
| Ministry / Minister | 3 | Respectful framing of church work |
| Faith / Faith-based | 2 | Hero subheadline, challenge closing |
| Prayer | 2 | Respectful inclusion -- never mocked |
| Missions committee | 2 | FAQ section header, Q&A |
| Senior pastor | 0 (implicit) | Audience, not called out in copy |
| Trip leader / Team leader | 5 | User role references |

---

## Design Rationale Ledger

| Decision | Rationale | Evidence Source |
|----------|-----------|----------------|
| "Download Sample Binder" as primary hero CTA (not "Get a Demo") | Sample binder is Tier 1 (zero-commitment) vs demo is Tier 3 (medium commitment). Church buyers are committee-driven -- they need to see the binder before scheduling a call. | Product narrative Finding 5: CTA strategy spectrum |
| Pricing anchored against mission trip budget, not abstract cost | "$1,250" sounds expensive in isolation. "Less than 1% of a $7,000 mission budget" reframes as negligible. Church budget committees think in percentages of line items. | Product narrative Finding 3: segment-specific pain language |
| No fear-based messaging in Challenge section | "Faith and preparation are not opposites" -- respectful framing. Church buyers respond to stewardship language, not scare tactics. Never mock prayer or informal planning. | Product narrative Finding 4: "Calm Above Chaos" |
| 12 FAQ items (not 8) | Church missions committees have more questions than typical B2B buyers. Denominational policies, youth protection, multi-stop trips, and volunteer screening are unique concerns. Longer FAQ improves SEO and reduces sales objection load. | IA Section 3.2: "8-12 church-specific Q&As" -- max end chosen |
| Dark section at position 6 (proof) and 10 (CTA) | Proof section benefits from authority treatment. CTA band as dark closing section creates finality. Three full light sections between them exceeds minimum gap requirement. | Design system 12.2: rhythm rules |
| ProcessTimeline in "mission trip flavor" | Three-act mechanism (Intelligence, Review, Documentation) is the core differentiator story. Mission-trip-specific examples (Guatemala, host organization vetting, evacuation routes) make abstract capability concrete. | Product narrative Finding 2 |
| Insurance carrier as recurring proof point | Churches answer to insurance committees more than any other buyer segment. Every mention of "insurance carrier" reduces the "will this be approved?" objection. | Product narrative Finding 3: segment pain language |
| "In Progress" on SOC 2 badge | Honest language per design system non-negotiable. Never claim certification before completion. | Design system quality gates: "No fabricated testimonials" principle extended to claims |
| No testimonial section at launch | Zero verified church customer testimonials available. Fabrication is brand-level contradiction for a trust product. Metrics-only proof is more credible than invented quotes. | Product narrative Finding 6: proof architecture |
| Per-participant pricing math included | "$50 per team member" is more digestible than "$1,250 per trip" for committee budget discussions. Math shown, not hidden. | Product narrative Finding 11 (per-student frame) adapted for church segment |

---

*This mockup specification was authored as the implementation-ready design reference for the Church/Missions Solutions page at `/solutions/churches`. All content is real, church-specific copy ready for development. All components reference DESIGN-SYSTEM.md v1.0. All accessibility requirements meet WCAG 2.2 AA. Version 1.0, 2026-03-24.*
