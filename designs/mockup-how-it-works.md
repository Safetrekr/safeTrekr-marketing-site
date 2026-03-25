# Mockup Specification: How It Works Page

**URL**: `/how-it-works`
**Version**: 1.0
**Date**: 2026-03-24
**Status**: HIGH-FIDELITY SPEC -- Ready for Implementation
**Page Type**: Core Page (SSG)
**Hierarchy Level**: L1
**JSON-LD**: HowTo (3 steps, totalTime: P5D)
**Breadcrumb**: None (L1 page)
**Dark Sections**: 2 (Intelligence Sources, Conversion CTA)
**Estimated Scroll Depth**: ~8 viewports (desktop), ~14 viewports (mobile)

---

## Design Intent

This page is the mechanism reveal. Every mid-funnel visitor who needs to understand "but how does it actually work?" lands here. The page tells a three-act story -- Intelligence, Review, Documentation -- using a vertical narrative structure that builds confidence through specificity. By the time the visitor reaches the bottom, they should feel that SafeTrekr's process is more thorough than anything they could build internally and more rigorous than any competitor they have evaluated.

The visual rhythm alternates light and dark surfaces, uses the ProcessTimeline as the spine, expands into the 17-section card grid as the proof of thoroughness, and closes with the evidence binder as the tangible deliverable. Every section answers a specific buyer objection.

---

## Page-Level Specifications

### Meta

| Property | Value |
|----------|-------|
| `<title>` | How It Works -- SafeTrekr |
| `meta description` | From trip submission to safety binder in 3-5 days. See how SafeTrekr's analyst review, government intelligence, and tamper-evident documentation protect every trip. |
| `og:title` | How SafeTrekr Works: Intelligence, Review, Documentation |
| `og:description` | Every trip goes through the same rigorous 3-step process. 5 government data sources. 17-section analyst review. SHA-256 tamper-evident safety binder. |
| `og:image` | `/og/how-it-works.png` (1200x630, process timeline visual) |
| `canonical` | `https://safetrekr.com/how-it-works` |

### Performance Budget

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| CLS | < 0.1 |
| FID | < 100ms |
| Total JS | < 150KB (gzipped) |
| Total images | < 400KB (optimized WebP/AVIF) |

### Scroll-Triggered Animation Strategy

All sections use `IntersectionObserver` at 20% threshold via Framer Motion `whileInView`. Every animation respects `prefers-reduced-motion` -- reduced motion users see final states immediately with opacity-only transitions. No animation plays until the section enters the viewport.

---

## Section 1: Hero

### Layout

```
+============================================================================+
|                          [SiteHeader - sticky]                             |
+============================================================================+
|                                                                            |
|  bg-background                                                             |
|  pt-24 pb-20 lg:pt-28 lg:pb-32                                            |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12          |  |
|  |                                                                      |  |
|  |  [center-aligned content block, max-w-3xl mx-auto text-center]      |  |
|  |                                                                      |  |
|  |  EYEBROW ---- "HOW IT WORKS"                                        |  |
|  |  with ShieldPath icon (14px, primary-700)                           |  |
|  |  text-eyebrow text-primary-700 uppercase tracking-[0.08em]          |  |
|  |  mb-4                                                               |  |
|  |                                                                      |  |
|  |  HEADLINE ---- "From Trip Submission                                |  |
|  |                 to Safety Binder                                    |  |
|  |                 in 3-5 Days."                                       |  |
|  |  text-display-lg text-foreground font-display font-700              |  |
|  |  max-w-[20ch] mx-auto                                              |  |
|  |  mb-6                                                               |  |
|  |                                                                      |  |
|  |  SUBHEADLINE ---- "Every trip goes through the same rigorous        |  |
|  |  process. Here's exactly how."                                      |  |
|  |  text-body-lg text-muted-foreground font-body                       |  |
|  |  max-w-prose mx-auto                                                |  |
|  |  mb-10                                                              |  |
|  |                                                                      |  |
|  |  [CTA Group -- flex gap-4 justify-center]                           |  |
|  |  +---------------------------+  +-------------------------------+   |  |
|  |  | Get a Demo                |  | Download a Sample Binder  v   |   |  |
|  |  | Button variant="primary"  |  | Button variant="secondary"    |   |  |
|  |  | size="lg" (h-13, px-8)    |  | size="lg" (h-13, px-8)        |   |  |
|  |  | -> /demo                  |  | -> /resources/sample-binders  |   |  |
|  |  +---------------------------+  +-------------------------------+   |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### Animation

| Element | Preset | Delay |
|---------|--------|-------|
| Eyebrow | `fadeUp` | 0ms |
| Headline | `fadeUp` | 80ms |
| Subheadline | `fadeUp` | 160ms |
| CTA group | `fadeUp` | 240ms |

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 640px) | `pt-16 pb-20`. Headline clamps to 34px. CTAs stack vertically, full-width. `gap-3`. |
| sm (640px) | CTAs go horizontal. |
| lg (1024px) | `pt-24 pb-32`. Headline at full 56px. |
| xl (1280px) | Container centered with growing side margins. |

### Accessibility

- `<section aria-labelledby="hero-heading">`
- Headline: `<h1 id="hero-heading">`
- CTA buttons: descriptive labels ("Get a Demo" and "Download a Sample Binder" are self-explanatory)
- Skip-nav link targets `#main-content` placed at top of `<main>`

---

## Section 2: Process Timeline (Three-Act Structure)

### Component

`<ProcessTimeline>` -- the central mechanism visualization.

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
|  |  EYEBROW: "THE PROCESS"                                             |  |
|  |  text-eyebrow text-primary-700 uppercase mb-4                       |  |
|  |                                                                      |  |
|  |  HEADLINE: "Three Steps. One Standard."                             |  |
|  |  text-display-md text-foreground max-w-[28ch] mx-auto text-center   |  |
|  |  mb-16 lg:mb-20                                                     |  |
|  |                                                                      |  |
|  |  [DESKTOP >= lg: Horizontal 3-Column Timeline]                      |  |
|  |  grid grid-cols-3 gap-8                                             |  |
|  |                                                                      |  |
|  |  +--------------------+  +--------------------+  +----------------+ |  |
|  |  |                    |  |                    |  |                | |  |
|  |  |  [Step 1]          |  |  [Step 2]          |  |  [Step 3]      | |  |
|  |  |                    |  |                    |  |                | |  |
|  |  |  (1)----LINE------>(2)----LINE------>(3)   |  |                | |  |
|  |  |                    |  |                    |  |                | |  |
|  |  |  ACT 1:            |  |  ACT 2:            |  |  ACT 3:        | |  |
|  |  |  INTELLIGENCE      |  |  REVIEW             |  |  DOCUMENTATION | |  |
|  |  |                    |  |                    |  |                | |  |
|  |  +--------------------+  +--------------------+  +----------------+ |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### Step Card Anatomy (Each of 3 columns)

```
+------------------------------------------+
|                                          |
|  [Number Circle]                         |
|  h-12 w-12 rounded-full                  |
|  bg-primary-100 border-2 border-primary-300
|  flex items-center justify-center        |
|  text-heading-sm text-primary-700 font-700
|  mb-6                                    |
|                                          |
|  [Act Badge]                             |
|  Badge variant="default" size="sm"       |
|  "ACT 1" / "ACT 2" / "ACT 3"            |
|  mb-3                                    |
|                                          |
|  [Title]                                 |
|  text-heading-md text-foreground font-600 |
|  mb-3                                    |
|                                          |
|  [Description]                           |
|  text-body-md text-muted-foreground      |
|  max-w-[45ch]                            |
|  mb-6                                    |
|                                          |
|  [Detail List]                           |
|  space-y-2                               |
|  Each: flex items-start gap-2            |
|    Check icon (16px, primary-500)        |
|    text-body-sm text-foreground          |
|                                          |
|  [Time Badge]                            |
|  mt-6                                    |
|  Badge variant="secondary" size="sm"     |
|  "~15 minutes" / "3-5 days" / "Delivered"|
|                                          |
+------------------------------------------+
```

### Step Content

**Step 1: Submit Your Trip**
- Act Badge: "ACT 1: INTELLIGENCE"
- Title: "Submit Your Trip"
- Description: "Your organization submits trip details through a guided form. Destination, dates, participants, activities, and logistics."
- Details:
  - Destination and travel dates
  - Participant count and demographics
  - Planned activities and venues
  - Transportation and lodging details
  - Special requirements or concerns
- Time Badge: "Takes ~15 minutes"

**Step 2: Analyst Reviews Everything**
- Act Badge: "ACT 2: REVIEW"
- Title: "Analyst Reviews Everything"
- Description: "A trained safety analyst conducts a comprehensive 17-section review. The Risk Intelligence Engine scores every destination using 5 government data sources."
- Details:
  - 17-section professional safety review
  - Monte Carlo risk scoring simulation
  - 5 government intelligence sources analyzed
  - Every venue, route, and provider evaluated
  - Recommendations written for each finding
- Time Badge: "3-5 business days"

**Step 3: Receive Your Safety Binder**
- Act Badge: "ACT 3: DOCUMENTATION"
- Title: "Receive Your Safety Binder"
- Description: "Audit-ready documentation delivered with SHA-256 hash-chain integrity. Every finding, every recommendation, every emergency contact, every risk score."
- Details:
  - Complete findings and recommendations
  - Emergency contacts and procedures
  - Risk scores with probability analysis
  - Maps, routes, and venue details
  - Tamper-evident cryptographic verification
- Time Badge: "Delivered digitally"

### Connecting Line (Desktop Only)

Between each numbered circle, an SVG connector line runs horizontally.

```
Line Spec:
  - SVG path, 2px stroke
  - Color: primary-200
  - Style: dashed (stroke-dasharray: 6 4)
  - Animation: routeDraw preset (pathLength 0 to 1, 1200ms)
  - Positioned absolutely between circles
  - z-index: behind circles (z-behind)
  - Triggers when ProcessTimeline enters viewport
```

### Mobile Layout (< lg)

Vertical stack using `<TimelineStep>` components:

```
+------------------------------------------+
|                                          |
|  [Vertical Timeline]                     |
|  space-y-0                               |
|                                          |
|  O---- [Step 1: Submit Your Trip]        |
|  |     Act badge, title, description,    |
|  |     details, time badge               |
|  |                                       |
|  O---- [Step 2: Analyst Reviews...]      |
|  |     Act badge, title, description,    |
|  |     details, time badge               |
|  |                                       |
|  O---- [Step 3: Receive Your Binder]     |
|        Act badge, title, description,    |
|        details, time badge               |
|                                          |
+------------------------------------------+

Timeline indicator:
  - Circle: 12px, bg-primary-500, ring-4 ring-primary-100
  - Connector: 2px wide, bg-border, full height between steps
  - Content: pl-8 from indicator
```

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Section heading | `fadeUp` stagger | Eyebrow 0ms, headline 80ms |
| Timeline container | `staggerContainerSlow` | Parent orchestrator |
| Step 1 | `cardReveal` | 0ms (first child) |
| Connecting line 1-2 | `routeDraw` | 200ms delay |
| Step 2 | `cardReveal` | 400ms delay |
| Connecting line 2-3 | `routeDraw` | 600ms delay |
| Step 3 | `cardReveal` | 800ms delay |

### Accessibility

- `<section aria-labelledby="process-heading">`
- Heading: `<h2 id="process-heading">`
- Each step card: `<article>` with `<h3>`
- Connecting lines: `aria-hidden="true"` (decorative)
- Time badges: `aria-label="Estimated time: 15 minutes"` etc.
- Step list uses `role="list"` on desktop (visual grid) for screen reader comprehension

---

## Section 3: Intelligence Sources Deep-Dive (DARK SECTION 1 of 2)

### Component

`<DarkAuthoritySection>` wrapping custom intelligence source content.

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
|  |  EYEBROW: "INTELLIGENCE ENGINE"                                     |  |
|  |  text-eyebrow text-dark-accent uppercase tracking-[0.08em]          |  |
|  |  mb-4                                                               |  |
|  |                                                                      |  |
|  |  HEADLINE: "We Analyze Data You Can't                               |  |
|  |             Get from a Google Search."                               |  |
|  |  text-display-md text-dark-text-primary max-w-[28ch] mx-auto        |  |
|  |  text-center mb-6                                                   |  |
|  |                                                                      |  |
|  |  SUBTEXT: "SafeTrekr's Risk Intelligence Engine pulls from           |  |
|  |  5 authoritative government data sources and runs Monte Carlo        |  |
|  |  simulations to produce probability-weighted risk scores."           |  |
|  |  text-body-lg text-dark-text-secondary max-w-prose mx-auto          |  |
|  |  text-center mb-16                                                  |  |
|  |                                                                      |  |
|  |  [Intelligence Source Bar -- 5-across]                              |  |
|  |  ================================================================   |  |
|  |  See detailed spec below                                            |  |
|  |  ================================================================   |  |
|  |                                                                      |  |
|  |  [Monte Carlo Explanation Card]                                     |  |
|  |  ================================================================   |  |
|  |  See detailed spec below                                            |  |
|  |  ================================================================   |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### Intelligence Source Bar

```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6
mb-16

Each Source Card:
+------------------------------------------+
|  bg-dark-surface rounded-xl              |
|  border border-dark-border               |
|  p-6                                     |
|  text-center lg:text-left                |
|                                          |
|  [Source Logo/Icon]                      |
|  h-10 w-10 mx-auto lg:mx-0 mb-4        |
|  opacity-80                              |
|  (Rendered as SVG mark of each agency)   |
|                                          |
|  [Source Name]                           |
|  text-heading-sm text-dark-text-primary  |
|  font-600 mb-2                           |
|                                          |
|  [Source Full Name]                      |
|  text-body-xs text-dark-text-secondary   |
|  mb-3                                    |
|                                          |
|  [What It Provides]                      |
|  text-body-sm text-dark-text-secondary   |
|                                          |
+------------------------------------------+
```

### Source Card Content

| Source | Full Name | Provides |
|--------|-----------|----------|
| **NOAA** | National Oceanic and Atmospheric Administration | Weather forecasts, severe storm alerts, historical climate patterns for travel dates and destination |
| **USGS** | United States Geological Survey | Seismic activity, earthquake risk, volcanic alerts, geological hazards for destination region |
| **CDC** | Centers for Disease Control and Prevention | Health advisories, disease outbreaks, vaccination requirements, travel health notices |
| **GDACS** | Global Disaster Alerting Coordination System | Real-time disaster alerts, earthquake/flood/cyclone monitoring, humanitarian impact assessments |
| **ReliefWeb** | UN Office for Coordination of Humanitarian Affairs | Humanitarian situation reports, conflict updates, country-level safety assessments |

### Monte Carlo Explanation Card

```
mt-12
bg-dark-surface rounded-xl border border-dark-border
p-8 lg:p-12
grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 items-center

LEFT COLUMN (Text):
+------------------------------------------+
|                                          |
|  [Badge]                                 |
|  Badge variant="dark" size="sm"          |
|  icon: MonteCarlo (14px)                 |
|  "RISK SCORING"                          |
|  mb-4                                    |
|                                          |
|  [Title]                                 |
|  "Probability-Weighted Risk Scores"      |
|  text-heading-lg text-dark-text-primary  |
|  mb-4                                    |
|                                          |
|  [Description]                           |
|  "Our Risk Intelligence Engine runs      |
|  Monte Carlo simulations across all      |
|  data sources to produce probability-    |
|  weighted risk scores -- not simple      |
|  averages, but statistically modeled     |
|  projections of what could affect your   |
|  trip."                                  |
|  text-body-md text-dark-text-secondary   |
|  max-w-prose mb-6                        |
|                                          |
|  [Detail Items]                          |
|  space-y-3                               |
|  Each: flex gap-3                        |
|    Check icon (16px, dark-accent)        |
|    text-body-sm text-dark-text-secondary |
|                                          |
|  - "Thousands of simulations per trip"   |
|  - "Weather, seismic, health, conflict   |
|    data cross-referenced"                |
|  - "Scores update until departure date"  |
|                                          |
+------------------------------------------+

RIGHT COLUMN (Visual):
+------------------------------------------+
|                                          |
|  [Risk Score Visualization]              |
|  Decorative illustration showing a       |
|  simplified probability distribution     |
|  curve with data points.                 |
|                                          |
|  SVG composition:                        |
|  - Bell curve outline (2px stroke,       |
|    dark-accent, animated with routeDraw) |
|  - 5 data point dots along curve         |
|    (6px, various colors from primary     |
|    scale, animated with markerPop)       |
|  - X-axis labels in mono-sm:            |
|    "Low" -- "Medium" -- "High"           |
|  - Y-axis label: "Probability"           |
|  - Shaded area under curve:              |
|    dark-accent at 10% opacity            |
|                                          |
|  Overall: max-w-[400px] mx-auto          |
|  aria-hidden="true" (decorative)         |
|                                          |
+------------------------------------------+
```

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Entire dark section | `fadeIn` | Background fades in |
| Eyebrow | `fadeUp` | 100ms delay |
| Headline | `fadeUp` | 180ms delay |
| Subtext | `fadeUp` | 260ms delay |
| Source cards | `staggerContainer` + `cardReveal` | Cards stagger at 80ms |
| Monte Carlo card | `fadeUp` | After source cards complete |
| Bell curve SVG | `routeDraw` | 1200ms, triggers when card is 20% visible |
| Data point dots | `markerPop` | Staggered 100ms each, after curve draws |

### Accessibility

- `<section aria-labelledby="intelligence-heading">`
- Heading: `<h2 id="intelligence-heading">`
- Source cards: Each wrapped in `<article>` with `<h3>`
- Monte Carlo visualization: `aria-hidden="true"` with adjacent text description
- All text meets 7.0:1+ contrast on secondary background (verified per design system)

---

## Section 4: The 17-Section Review

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
|  |  EYEBROW: "THE REVIEW"                                              |  |
|  |  with ClipboardCheck icon (14px, primary-700)                       |  |
|  |  text-eyebrow text-primary-700 uppercase mb-4                       |  |
|  |                                                                      |  |
|  |  HEADLINE: "17 Sections. Nothing Missed."                           |  |
|  |  text-display-md text-foreground max-w-[28ch] mx-auto text-center   |  |
|  |  mb-4                                                               |  |
|  |                                                                      |  |
|  |  SUBTEXT: "Every trip receives the same comprehensive analyst       |  |
|  |  review. Here is every section your safety analyst evaluates."      |  |
|  |  text-body-lg text-muted-foreground max-w-prose mx-auto             |  |
|  |  text-center mb-16                                                  |  |
|  |                                                                      |  |
|  |  [Category Groups -- stacked]                                       |  |
|  |  space-y-12                                                         |  |
|  |                                                                      |  |
|  |  Each Category:                                                     |  |
|  |  +----------------------------------------------------------------+ |  |
|  |  | [Category Label]                                                | |  |
|  |  | text-eyebrow text-muted-foreground uppercase mb-6              | |  |
|  |  |                                                                | |  |
|  |  | [Card Grid]                                                    | |  |
|  |  | grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4       | |  |
|  |  |                                                                | |  |
|  |  | +----------+ +----------+ +----------+ +----------+           | |  |
|  |  | | Section  | | Section  | | Section  | | Section  |           | |  |
|  |  | | Card     | | Card     | | Card     | | Card     |           | |  |
|  |  | +----------+ +----------+ +----------+ +----------+           | |  |
|  |  +----------------------------------------------------------------+ |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### Section Card Anatomy

```
+------------------------------------------+
|  bg-card rounded-xl border border-border |
|  p-5 shadow-card                         |
|  hover:shadow-card-hover                 |
|  hover:translateY(-2px)                  |
|  transition-all duration-normal          |
|                                          |
|  [Section Number + Icon Row]             |
|  flex items-center gap-3 mb-3            |
|                                          |
|    [Number]                              |
|    h-7 w-7 rounded-full                  |
|    bg-primary-50 text-primary-700        |
|    text-body-xs font-600                 |
|    flex items-center justify-center      |
|                                          |
|    [Icon]                                |
|    h-5 w-5 text-primary-500             |
|    (Lucide icon, specific per section)   |
|                                          |
|  [Section Title]                         |
|  text-heading-sm text-foreground         |
|  font-600 mb-2                           |
|                                          |
|  [What Analyst Evaluates]                |
|  text-body-sm text-muted-foreground      |
|  line-clamp-3                            |
|                                          |
+------------------------------------------+
```

### Category Groupings and Section Content

**CATEGORY 1: "TRIP PLANNING"**

| # | Section | Icon (Lucide) | What the Analyst Evaluates |
|---|---------|---------------|---------------------------|
| 1 | Overview | `FileText` | Trip purpose, objectives, organizational context, and overall scope of the travel plan |
| 2 | Participants | `Users` | Participant count, demographics, age ranges, special needs, medical considerations, and chaperone-to-participant ratios |
| 3 | Itinerary | `Calendar` | Day-by-day schedule, activity timing, transit windows, rest periods, and contingency buffers |
| 4 | Transportation | `Bus` | Ground transportation providers, vehicle safety records, driver credentials, and route risk assessment |

**CATEGORY 2: "DESTINATIONS & VENUES"**

| # | Section | Icon (Lucide) | What the Analyst Evaluates |
|---|---------|---------------|---------------------------|
| 5 | Air Travel | `Plane` | Airlines, airports, layover risks, baggage policies, and flight timing relative to destination conditions |
| 6 | Lodging | `Building2` | Accommodation safety ratings, fire egress, proximity to medical facilities, neighborhood risk profile |
| 7 | Venues | `MapPin` | Activity venues, crowd capacity, structural safety, historical incident records, and accessibility |

**CATEGORY 3: "SAFETY & INTELLIGENCE"**

| # | Section | Icon (Lucide) | What the Analyst Evaluates |
|---|---------|---------------|---------------------------|
| 8 | Safety | `Shield` | Destination-level safety assessment: crime rates, political stability, natural hazard exposure, health risks |
| 9 | Background Checks | `UserCheck` | Verification requirements for chaperones, volunteers, and third-party providers in contact with participants |
| 10 | Intel Alerts | `AlertTriangle` | Active intelligence alerts from government sources: weather, seismic, health, conflict, and humanitarian data |

**CATEGORY 4: "EMERGENCY PREPAREDNESS"**

| # | Section | Icon (Lucide) | What the Analyst Evaluates |
|---|---------|---------------|---------------------------|
| 11 | Emergency Prep | `Siren` | Emergency action plans, evacuation routes, rally points, communication chains, and nearest medical facilities |
| 12 | Issues | `Flag` | Known risks, flagged concerns, unresolved issues, and analyst-recommended mitigations requiring action |

**CATEGORY 5: "DOCUMENTATION & COMPLIANCE"**

| # | Section | Icon (Lucide) | What the Analyst Evaluates |
|---|---------|---------------|---------------------------|
| 13 | Documents | `FolderOpen` | Required forms, waivers, permissions, insurance certificates, and regulatory compliance documentation |
| 14 | Evidence | `Lock` | Tamper-evident evidence chain, SHA-256 hash verification, audit trail integrity, and record preservation |
| 15 | Checklists | `CheckSquare` | Pre-departure checklists, day-of checklists, post-trip checklists, and completion verification |
| 16 | Packet Builder | `Package` | Assembled trip packet: printed materials, digital distribution, chaperone copies, and administrative copies |
| 17 | Approval | `CircleCheck` | Final review sign-off, organizational approval workflow, stakeholder acknowledgment, and release authorization |

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Section header | `fadeUp` stagger | Eyebrow/headline/subtext at 80ms intervals |
| Category labels | `fadeUp` | Each triggers independently at 20% intersection |
| Section cards | `staggerContainer` + `cardReveal` | Per-category stagger at 80ms between cards |

### Responsive Behavior

| Breakpoint | Grid |
|------------|------|
| base (< 640px) | `grid-cols-1` -- single column, full-width cards |
| sm (640px) | `grid-cols-2` |
| lg (1024px) | `grid-cols-3` |
| xl (1280px) | `grid-cols-4` |

### Accessibility

- `<section aria-labelledby="review-heading">`
- Heading: `<h2 id="review-heading">`
- Category labels: `<h3>` elements
- Each section card: `<article>` -- no interactive state (these are informational, not navigational)
- Section numbers visible as text, not relying on visual position alone
- Card hover effects are visual enhancement only; no information is gated behind hover

---

## Section 5: The Safety Binder

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
|  |  [2-Column Layout]                                                  |  |
|  |  grid lg:grid-cols-2 gap-12 lg:gap-20 items-center                  |  |
|  |                                                                      |  |
|  |  LEFT COLUMN (Text):                                                |  |
|  |  +-------------------------------+                                  |  |
|  |  |                               |                                  |  |
|  |  |  EYEBROW: "THE DELIVERABLE"   |                                  |  |
|  |  |  with EvidenceBinder icon      |                                  |  |
|  |  |  text-eyebrow text-primary-700 |                                  |  |
|  |  |  mb-4                          |                                  |  |
|  |  |                               |                                  |  |
|  |  |  HEADLINE:                     |                                  |  |
|  |  |  "What You Receive."           |                                  |  |
|  |  |  text-display-md               |                                  |  |
|  |  |  text-foreground mb-6          |                                  |  |
|  |  |                               |                                  |  |
|  |  |  BODY:                         |                                  |  |
|  |  |  "Your Trip Safety Binder is   |                                  |  |
|  |  |  a complete, audit-ready        |                                  |  |
|  |  |  documentation package. Every   |                                  |  |
|  |  |  finding. Every recommendation. |                                  |  |
|  |  |  Every emergency contact.       |                                  |  |
|  |  |  Every risk score."             |                                  |  |
|  |  |  text-body-lg                   |                                  |  |
|  |  |  text-muted-foreground          |                                  |  |
|  |  |  max-w-prose mb-8              |                                  |  |
|  |  |                               |                                  |  |
|  |  |  [Binder Contents List]        |                                  |  |
|  |  |  space-y-3                     |                                  |  |
|  |  |  Each: flex gap-3             |                                  |  |
|  |  |    Check (16px, primary-500)   |                                  |  |
|  |  |    text-body-md text-foreground|                                  |  |
|  |  |                               |                                  |  |
|  |  |  - Risk score summary with     |                                  |  |
|  |  |    probability analysis        |                                  |  |
|  |  |  - Section-by-section findings |                                  |  |
|  |  |    and recommendations         |                                  |  |
|  |  |  - Emergency contacts and      |                                  |  |
|  |  |    procedures                  |                                  |  |
|  |  |  - Maps, routes, and venue     |                                  |  |
|  |  |    documentation               |                                  |  |
|  |  |  - Insurance and compliance    |                                  |  |
|  |  |    records                     |                                  |  |
|  |  |  - Cryptographic verification  |                                  |  |
|  |  |    chain                       |                                  |  |
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
|  |  RIGHT COLUMN (Visual):                                             |  |
|  |  +-------------------------------+                                  |  |
|  |  |                               |                                  |  |
|  |  |  [DocumentPreview Component]   |                                  |  |
|  |  |  (From Design System 6.2)      |                                  |  |
|  |  |                               |                                  |  |
|  |  |  Stacked-paper visual with:    |                                  |  |
|  |  |  - 2 offset back sheets        |                                  |  |
|  |  |  - Front sheet with content:   |                                  |  |
|  |  |                               |                                  |  |
|  |  |  +-------------------------+   |                                  |  |
|  |  |  | TRIP SAFETY BINDER      |   |                                  |  |
|  |  |  | eyebrow text            |   |                                  |  |
|  |  |  |                         |   |                                  |  |
|  |  |  | [Badge: "Verified"]     |   |                                  |  |
|  |  |  | status-green variant    |   |                                  |  |
|  |  |  |                         |   |                                  |  |
|  |  |  | Organization: Example   |   |                                  |  |
|  |  |  | Trip: Spring Field Trip |   |                                  |  |
|  |  |  | Date: March 2026        |   |                                  |  |
|  |  |  |                         |   |                                  |  |
|  |  |  | Risk Score: 23/100      |   |                                  |  |
|  |  |  | (Low Risk)              |   |                                  |  |
|  |  |  |                         |   |                                  |  |
|  |  |  | Sections Reviewed: 17   |   |                                  |  |
|  |  |  | Findings: 4             |   |                                  |  |
|  |  |  | Recommendations: 6     |   |                                  |  |
|  |  |  |                         |   |                                  |  |
|  |  |  | SHA-256:                |   |                                  |  |
|  |  |  | a7f3c9...d4e2b1        |   |                                  |  |
|  |  |  | (font-mono, mono-sm)   |   |                                  |  |
|  |  |  +-------------------------+   |                                  |  |
|  |  |                               |                                  |  |
|  |  +-------------------------------+                                  |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  [SHA-256 Explanation Strip]                                               |
|  max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12               |
|  mt-16                                                                     |
|  +----------------------------------------------------------------------+  |
|  | bg-card rounded-xl border border-border p-6 lg:p-8                   |  |
|  | flex lg:flex-row flex-col gap-6 items-start                          |  |
|  |                                                                      |  |
|  | [Lock Icon]                                                         |  |
|  | h-10 w-10 rounded-lg bg-primary-50                                  |  |
|  | Lock icon h-5 w-5 text-primary-700                                  |  |
|  | flex-shrink-0                                                       |  |
|  |                                                                      |  |
|  | [Text Block]                                                        |  |
|  | Title: "Tamper-Evident Integrity"                                   |  |
|  | text-heading-sm text-foreground mb-2                                 |  |
|  |                                                                      |  |
|  | Body: "Every page of your Safety Binder is cryptographically        |  |
|  | signed using SHA-256 hash chains. Any modification -- even a        |  |
|  | single character -- is detectable. Your documentation is as         |  |
|  | trustworthy the day it was created as it will be years later."      |  |
|  | text-body-md text-muted-foreground max-w-prose                      |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Text column | `fadeUp` stagger | Eyebrow through CTA at 80ms intervals |
| DocumentPreview | `documentStack` | opacity: 0, y: 16, rotateX: -5 to resting. 500ms + spring. |
| Binder content items | `checklistReveal` | Stagger at 60ms |
| SHA-256 explanation strip | `fadeUp` | 200ms delay after binder section |

### Responsive

| Breakpoint | Changes |
|------------|---------|
| base (< lg) | Single column. Visual stacks above text. DocumentPreview: `max-w-[320px] mx-auto mb-12`. |
| lg (1024px) | 2-column grid. Text left, visual right. |

### Accessibility

- `<section aria-labelledby="binder-heading">`
- Heading: `<h2 id="binder-heading">`
- DocumentPreview: decorative composition. Content within uses `aria-hidden="true"` on the visual; the adjacent text column provides all information.
- SHA-256 hash: displayed in `font-mono` for visual distinction. `aria-label="SHA-256 hash: a7f3c9...d4e2b1"` for screen readers.
- Download button: `aria-label="Download a sample safety binder"` (self-descriptive text is sufficient)

---

## Section 6: During the Trip

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
|  |  [FeatureShowcase -- reversed=true]                                 |  |
|  |  grid lg:grid-cols-2 gap-12 lg:gap-20 items-center                  |  |
|  |                                                                      |  |
|  |  LEFT COLUMN (Visual -- appears right on desktop):                  |  |
|  |  +-------------------------------+                                  |  |
|  |  |                               |                                  |  |
|  |  |  [Mobile Device Mockup]        |                                  |  |
|  |  |                               |                                  |  |
|  |  |  Stylized phone frame:         |                                  |  |
|  |  |  rounded-[2rem] border-[6px]   |                                  |  |
|  |  |  border-foreground/20           |                                  |  |
|  |  |  bg-card shadow-xl             |                                  |  |
|  |  |  max-w-[280px] mx-auto         |                                  |  |
|  |  |  overflow-hidden               |                                  |  |
|  |  |                               |                                  |  |
|  |  |  Inside frame:                 |                                  |  |
|  |  |  - Status bar (mocked, 12px)   |                                  |  |
|  |  |  - Map area (bg-primary-50,    |                                  |  |
|  |  |    placeholder with route line) |                                  |  |
|  |  |  - Bottom sheet showing:       |                                  |  |
|  |  |    "Rally Point A"             |                                  |  |
|  |  |    "12 of 15 checked in"       |                                  |  |
|  |  |    green status dot            |                                  |  |
|  |  |    "All participants safe"     |                                  |  |
|  |  |                               |                                  |  |
|  |  +-------------------------------+                                  |  |
|  |                                                                      |  |
|  |  RIGHT COLUMN (Text -- appears left on desktop via reversed):       |  |
|  |  +-------------------------------+                                  |  |
|  |  |                               |                                  |  |
|  |  |  EYEBROW: "FIELD OPERATIONS"  |                                  |  |
|  |  |  with Activity icon            |                                  |  |
|  |  |  text-eyebrow text-primary-700 |                                  |  |
|  |  |  mb-4                          |                                  |  |
|  |  |                               |                                  |  |
|  |  |  HEADLINE:                     |                                  |  |
|  |  |  "Everything Your Chaperones   |                                  |  |
|  |  |   Need in Their Pocket."       |                                  |  |
|  |  |  text-display-md text-foreground|                                  |  |
|  |  |  mb-6                          |                                  |  |
|  |  |                               |                                  |  |
|  |  |  BODY:                         |                                  |  |
|  |  |  "During the trip, SafeTrekr's |                                  |  |
|  |  |  mobile app gives chaperones   |                                  |  |
|  |  |  real-time tools for participant|                                  |  |
|  |  |  safety and communication."    |                                  |  |
|  |  |  text-body-lg                   |                                  |  |
|  |  |  text-muted-foreground          |                                  |  |
|  |  |  max-w-prose mb-8              |                                  |  |
|  |  |                               |                                  |  |
|  |  |  [Feature Items]               |                                  |  |
|  |  |  space-y-3                     |                                  |  |
|  |  |  Each: flex gap-3             |                                  |  |
|  |  |    Check (16px, primary-500)   |                                  |  |
|  |  |    text-body-md text-foreground|                                  |  |
|  |  |                               |                                  |  |
|  |  |  - Live map with participant   |                                  |  |
|  |  |    locations                   |                                  |  |
|  |  |  - Geofence boundary alerts    |                                  |  |
|  |  |  - Rally point muster check-ins|                                  |  |
|  |  |  - SMS broadcast to all        |                                  |  |
|  |  |    participants                |                                  |  |
|  |  |  - Emergency contacts one      |                                  |  |
|  |  |    tap away                    |                                  |  |
|  |  |                               |                                  |  |
|  |  |  [CTA]                         |                                  |  |
|  |  |  mt-8                          |                                  |  |
|  |  |  Button variant="secondary"    |                                  |  |
|  |  |  size="default"                |                                  |  |
|  |  |  iconRight: ArrowRight         |                                  |  |
|  |  |  "Explore Mobile App"          |                                  |  |
|  |  |  -> /platform/mobile-app       |                                  |  |
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
| Text column | `fadeUp` stagger | Standard 80ms stagger |
| Phone mockup | `scaleIn` | opacity: 0, scale: 0.95 to resting. spring 800ms. |
| Map route line inside phone | `routeDraw` | 1200ms after phone enters |
| Status dot in bottom sheet | `statusPulse` | After route line completes |

### Responsive

| Breakpoint | Changes |
|------------|---------|
| base (< lg) | Single column. Phone mockup above text content, centered, `max-w-[240px]`. |
| lg (1024px) | 2-column. `reversed` places text left, phone right. |

### Accessibility

- `<section aria-labelledby="during-trip-heading">`
- Heading: `<h2 id="during-trip-heading">`
- Phone mockup: `aria-hidden="true"` (decorative illustration; feature list conveys all information)
- Feature items use semantic list: `<ul>` with `<li>` elements

---

## Section 7: After the Trip

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
|  |  [Center-Aligned Content Block]                                     |  |
|  |  max-w-3xl mx-auto text-center                                      |  |
|  |                                                                      |  |
|  |  EYEBROW: "AFTER THE TRIP"                                          |  |
|  |  with Shield icon                                                   |  |
|  |  text-eyebrow text-primary-700 uppercase mb-4                       |  |
|  |                                                                      |  |
|  |  HEADLINE: "Every Decision Documented.                              |  |
|  |             Every Precaution Verifiable."                            |  |
|  |  text-display-md text-foreground max-w-[28ch] mx-auto mb-6         |  |
|  |                                                                      |  |
|  |  BODY: "Years after the trip, your SafeTrekr documentation          |  |
|  |  remains intact and verifiable. The evidence chain cannot be         |  |
|  |  altered, providing permanent proof of the safety measures your      |  |
|  |  organization took."                                                |  |
|  |  text-body-lg text-muted-foreground max-w-prose mx-auto mb-12      |  |
|  |                                                                      |  |
|  |  [3-Column Proof Grid]                                              |  |
|  |  grid sm:grid-cols-3 gap-6                                          |  |
|  |                                                                      |  |
|  |  +-------------------+ +-------------------+ +------------------+   |  |
|  |  | [Audit Trail]     | | [Compliance Docs] | | [Insurance]      |   |  |
|  |  |                   | |                   | |                  |   |  |
|  |  | Shield icon       | | FileCheck icon    | | FileText icon    |   |  |
|  |  | 32px, primary-500 | | 32px, primary-500 | | 32px, primary-500|   |  |
|  |  | bg-primary-50     | | bg-primary-50     | | bg-primary-50    |   |  |
|  |  | h-14 w-14 rounded | | h-14 w-14 rounded | | h-14 w-14 round  |   |  |
|  |  |                   | |                   | |                  |   |  |
|  |  | "Audit Trail"     | | "Compliance       | | "Insurance       |   |  |
|  |  | heading-sm        | |  Documentation"   | |  Records"        |   |  |
|  |  |                   | | heading-sm        | | heading-sm       |   |  |
|  |  | "Complete record  | |                   | |                  |   |  |
|  |  | of every decision | | "FERPA, SOC 2,    | | "Documented      |   |  |
|  |  | and action taken  | | GDPR-ready        | | proof of safety  |   |  |
|  |  | throughout the    | | documentation     | | measures for     |   |  |
|  |  | review process."  | | for regulatory    | | liability and    |   |  |
|  |  | body-sm muted-fg  | | review."          | | claims support." |   |  |
|  |  |                   | | body-sm muted-fg  | | body-sm muted-fg |   |  |
|  |  +-------------------+ +-------------------+ +------------------+   |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### Card Structure

Each proof card:

```
bg-card rounded-xl border border-border p-6 text-center shadow-card
hover:shadow-card-hover transition-shadow duration-normal

1. Icon container: h-14 w-14 rounded-xl bg-primary-50 mx-auto mb-4
   flex items-center justify-center
   Icon: h-7 w-7 text-primary-700
2. Title: text-heading-sm text-foreground mb-2
3. Description: text-body-sm text-muted-foreground
```

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Header group | `fadeUp` stagger | 80ms intervals |
| Proof cards | `staggerContainer` + `cardReveal` | 80ms stagger |

### Accessibility

- `<section aria-labelledby="after-trip-heading">`
- Heading: `<h2 id="after-trip-heading">`
- Proof cards: `<article>` elements with `<h3>` titles
- Icons: `aria-hidden="true"` (titles convey meaning)

---

## Section 8: Segment Examples

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
|  |  EYEBROW: "YOUR ORGANIZATION"                                       |  |
|  |  text-eyebrow text-primary-700 uppercase mb-4                       |  |
|  |                                                                      |  |
|  |  HEADLINE: "See How It Works for                                    |  |
|  |             Your Organization."                                     |  |
|  |  text-display-md text-foreground max-w-[28ch] mx-auto text-center   |  |
|  |  mb-16                                                              |  |
|  |                                                                      |  |
|  |  [4-Column Segment Card Grid]                                       |  |
|  |  grid sm:grid-cols-2 lg:grid-cols-4 gap-6                           |  |
|  |                                                                      |  |
|  |  +--------+ +--------+ +--------+ +--------+                       |  |
|  |  | K-12   | | Higher | | Church | | Corp   |                       |  |
|  |  |        | | Ed     | |        | |        |                       |  |
|  |  +--------+ +--------+ +--------+ +--------+                       |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### Segment Card Anatomy

Uses `<IndustryCard>` component from the design system:

```
+------------------------------------------+
|  <a> with group class                    |
|  bg-card rounded-xl border border-border |
|  p-6 shadow-card                         |
|  hover:shadow-card-hover                 |
|  transition-all duration-normal          |
|                                          |
|  [Icon Container]                        |
|  h-12 w-12 rounded-lg bg-primary-50     |
|  flex items-center justify-center        |
|  mb-4                                    |
|                                          |
|    Icon: h-6 w-6 text-primary-700       |
|                                          |
|  [Segment Title]                         |
|  text-heading-sm text-foreground         |
|  group-hover:text-primary-700            |
|  transition-colors duration-fast         |
|  mb-2                                    |
|                                          |
|  [Example Trip Type]                     |
|  text-body-sm text-muted-foreground      |
|  mb-4                                    |
|                                          |
|  [Link Text]                             |
|  text-body-sm font-medium text-primary-700
|  flex items-center gap-1                 |
|  "Learn more"                            |
|  ArrowRight (14px)                       |
|  group-hover:translateX(4px)             |
|  transition-transform duration-fast      |
|                                          |
+------------------------------------------+
```

### Segment Card Content

| Segment | Icon (Lucide) | Title | Example | Link |
|---------|---------------|-------|---------|------|
| K-12 | `School` | K-12 Schools & Districts | "Field trips, athletic travel, band competitions" | `/solutions/k12` |
| Higher Ed | `GraduationCap` | Higher Education | "Study abroad, research travel, athletic programs" | `/solutions/higher-education` |
| Churches | `Church` | Churches & Mission Orgs | "Mission trips, youth retreats, volunteer travel" | `/solutions/churches` |
| Corporate | `Building2` | Corporate & Sports Teams | "Team retreats, conferences, league travel" | `/solutions/corporate` |

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Header | `fadeUp` stagger | 80ms |
| Segment cards | `staggerContainer` + `cardReveal` | 100ms stagger |

### Responsive

| Breakpoint | Grid |
|------------|------|
| base (< 640px) | `grid-cols-1` -- full-width cards, stacked |
| sm (640px) | `grid-cols-2` |
| lg (1024px) | `grid-cols-4` |

### Accessibility

- `<section aria-labelledby="segments-heading">`
- Heading: `<h2 id="segments-heading">`
- Each card: full `<a>` wrap, `<h3>` title, icon `aria-hidden="true"`
- Arrow is decorative: `aria-hidden="true"`

---

## Section 9: Conversion CTA Banner (DARK SECTION 2 of 2)

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
|  |  HEADLINE: "Ready to See It in Action?"                             |  |
|  |  text-display-md text-dark-text-primary                              |  |
|  |  max-w-[28ch] mx-auto mb-6                                          |  |
|  |                                                                      |  |
|  |  BODY: "Schedule a personalized walkthrough. We'll show you         |  |
|  |  exactly what a safety binder looks like for your organization."    |  |
|  |  text-body-lg text-dark-text-secondary max-w-prose mx-auto          |  |
|  |  mb-10                                                              |  |
|  |                                                                      |  |
|  |  [CTA Group -- flex gap-4 justify-center]                           |  |
|  |  +---------------------------+  +-------------------------------+   |  |
|  |  | Get a Demo                |  | Download a Sample Binder      |   |  |
|  |  | Button variant=           |  | Button variant="ghost"        |   |  |
|  |  |   "primary-on-dark"       |  | text-dark-text-secondary      |   |  |
|  |  | size="lg"                 |  | hover:text-white              |   |  |
|  |  | bg-white text-secondary   |  | size="lg"                     |   |  |
|  |  | -> /demo                  |  | icon: Download (16px)         |   |  |
|  |  |                           |  | -> /resources/sample-binders  |   |  |
|  |  +---------------------------+  +-------------------------------+   |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Entire band | `fadeIn` | Background fades |
| Headline | `fadeUp` | 100ms delay |
| Body | `fadeUp` | 180ms delay |
| CTA group | `fadeUp` | 260ms delay |

### Accessibility

- `<section aria-labelledby="cta-heading">`
- Heading: `<h2 id="cta-heading">`
- Primary CTA: clearly labeled
- Secondary CTA: includes download icon for visual reinforcement but text is self-descriptive
- All text meets contrast requirements on `secondary` background (11.6:1 for primary text, 7.0:1 for secondary text)

---

## Section 10: Footer

`<SiteFooter>` -- standard site footer as defined in the Design System (Section 6.3). No page-specific modifications.

---

## Full Page Scroll Sequence Summary

| # | Section | Background | Surface | Dark Section? |
|---|---------|------------|---------|:---:|
| 1 | Hero | `background` | Light | No |
| 2 | Process Timeline | `background` | Light | No |
| 3 | Intelligence Sources | `secondary` | Dark | YES (1/2) |
| 4 | 17-Section Review | `background` | Light | No |
| 5 | Safety Binder | `card` + `border-y` | Light (elevated) | No |
| 6 | During the Trip | `background` | Light | No |
| 7 | After the Trip | `card` + `border-y` | Light (elevated) | No |
| 8 | Segment Examples | `background` | Light | No |
| 9 | Conversion CTA | `secondary` | Dark | YES (2/2) |
| 10 | Footer | `secondary` | Dark | N/A (excluded) |

Visual rhythm validation: Dark sections are separated by 5 light sections (sections 4-8), ensuring strong contrast rhythm and compliance with the "never adjacent" rule.

---

## In-Page Navigation Anchors

This page exceeds 3 viewports, so in-page anchor navigation is included per the IA specification.

### Sticky Anchor Bar

Appears below the SiteHeader after scrolling past the hero (IntersectionObserver on hero section). Sticks at `top-16` (below the 64px scrolled header).

```
+============================================================================+
| bg-card/95 backdrop-blur-sm border-b border-border                         |
| h-12 z-sticky                                                              |
|                                                                            |
| max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12                |
| flex items-center gap-6 overflow-x-auto scrollbar-hide                     |
|                                                                            |
| The Process   Intelligence   17 Sections   Binder   Field Ops   After Trip |
|    ^active                                                                 |
|                                                                            |
| Active: text-foreground font-600 border-b-2 border-primary-500            |
| Default: text-muted-foreground hover:text-foreground                       |
| Each: text-body-sm py-3 whitespace-nowrap                                  |
+============================================================================+
```

### Anchor Targets

| Label | Target ID | Corresponding Section |
|-------|-----------|-----------------------|
| The Process | `#process` | Section 2: Process Timeline |
| Intelligence | `#intelligence` | Section 3: Intelligence Sources |
| 17 Sections | `#review` | Section 4: 17-Section Review |
| Binder | `#binder` | Section 5: Safety Binder |
| Field Ops | `#field-ops` | Section 6: During the Trip |
| After Trip | `#after-trip` | Section 7: After the Trip |

### Behavior

- Smooth scroll on click (`scroll-behavior: smooth` with `scroll-margin-top: 8rem` on targets to account for sticky header + anchor bar)
- Active state updates as user scrolls (IntersectionObserver on each target section)
- Mobile: horizontally scrollable, no wrapping, `-webkit-overflow-scrolling: touch`
- Fades in with `fadeIn` (200ms) when hero exits viewport; fades out when hero re-enters

### Accessibility

- `<nav aria-label="Page sections">`
- Active item: `aria-current="true"`
- Scrollable container: keyboard-navigable with left/right arrow keys

---

## Component Dependency Map

| Component | File | New? | Notes |
|-----------|------|:---:|-------|
| `ProcessTimeline` | `components/marketing/process-timeline.tsx` | Existing | Extended with act badges and detail lists |
| `TimelineStep` | `components/marketing/timeline-step.tsx` | Existing | Used for mobile timeline |
| `FeatureShowcase` | `components/marketing/feature-showcase.tsx` | Existing | Used for During the Trip section |
| `IndustryCard` | `components/marketing/industry-card.tsx` | Existing | Used for segment examples |
| `CTABand` | `components/marketing/cta-band.tsx` | Existing | Dark variant for final CTA |
| `DarkAuthoritySection` | `components/marketing/dark-authority-section.tsx` | Existing | Wraps intelligence section |
| `DocumentPreview` | `components/marketing/document-preview.tsx` | Existing | Safety Binder visual |
| `Badge` | `components/ui/badge.tsx` | Existing | Act badges, time badges, verified badge |
| `Button` | `components/ui/button.tsx` | Existing | All CTAs |
| `Eyebrow` | `components/ui/eyebrow.tsx` | Existing | Section eyebrows |
| `StatusDot` | `components/ui/status-dot.tsx` | Existing | Mobile mockup |
| `Divider` | `components/ui/divider.tsx` | Existing | Route variant between sections (optional) |
| `IntelligenceSourceBar` | `components/marketing/intelligence-source-bar.tsx` | **NEW** | 5-source card grid on dark surface |
| `MonteCarloCard` | `components/marketing/monte-carlo-card.tsx` | **NEW** | Explanation card with SVG visualization |
| `ReviewSectionCard` | `components/marketing/review-section-card.tsx` | **NEW** | Individual section card for 17-section grid |
| `ReviewSectionGrid` | `components/marketing/review-section-grid.tsx` | **NEW** | Grouped card grid with category headers |
| `StickyAnchorNav` | `components/marketing/sticky-anchor-nav.tsx` | **NEW** | In-page section navigation bar |
| `PhoneMockup` | `components/marketing/phone-mockup.tsx` | **NEW** | Stylized mobile device frame for field ops |

---

## New Component Specifications

### IntelligenceSourceBar

```typescript
interface IntelligenceSourceBarProps {
  sources: Array<{
    id: string;
    abbreviation: string;       // "NOAA"
    fullName: string;            // "National Oceanic and Atmospheric Administration"
    description: string;         // What it provides
    iconSrc?: string;            // Optional SVG path for agency mark
  }>;
  className?: string;
}
```

- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6`
- Each card: `bg-[var(--color-dark-surface)] rounded-xl border border-[var(--color-dark-border)] p-6`
- Must be used inside a `[data-theme="dark"]` parent

### ReviewSectionCard

```typescript
interface ReviewSectionCardProps {
  number: number;                // 1-17
  title: string;                 // "Overview"
  icon: LucideIcon;              // Lucide icon component
  description: string;           // What the analyst evaluates
  className?: string;
}
```

- Card: `bg-card rounded-xl border border-border p-5 shadow-card`
- Hover: `shadow-card-hover translateY(-2px)` transition `duration-normal`
- Number circle: `h-7 w-7 rounded-full bg-primary-50 text-primary-700 text-body-xs font-600`

### ReviewSectionGrid

```typescript
interface ReviewSectionGridProps {
  categories: Array<{
    label: string;               // "TRIP PLANNING"
    sections: ReviewSectionCardProps[];
  }>;
  className?: string;
}
```

- Outer: `space-y-12`
- Category label: `text-eyebrow text-muted-foreground uppercase mb-6`
- Grid per category: `grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`

### StickyAnchorNav

```typescript
interface StickyAnchorNavProps {
  anchors: Array<{
    label: string;               // "The Process"
    targetId: string;            // "process"
  }>;
  className?: string;
}
```

- Sticks at `top-16` (below scrolled SiteHeader)
- Background: `bg-card/95 backdrop-blur-sm border-b border-border`
- Height: `h-12`
- Active tracking via IntersectionObserver
- Mobile: horizontal scroll, `overflow-x-auto`

### PhoneMockup

```typescript
interface PhoneMockupProps {
  children: ReactNode;           // Content rendered inside the phone frame
  className?: string;
}
```

- Frame: `rounded-[2rem] border-[6px] border-foreground/20 bg-card shadow-xl overflow-hidden`
- Max width: `max-w-[280px]`
- Includes mocked status bar (time, signal, battery icons at 12px)

---

## JSON-LD Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How SafeTrekr Works",
  "description": "From trip submission to safety binder in 3-5 days. Every trip goes through the same rigorous process.",
  "totalTime": "P5D",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Submit Your Trip",
      "text": "Your organization submits trip details through a guided form: destination, dates, participants, activities, and logistics. Takes approximately 15 minutes.",
      "url": "https://safetrekr.com/how-it-works#process"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Analyst Reviews Everything",
      "text": "A trained safety analyst conducts a comprehensive 17-section review. The Risk Intelligence Engine scores every destination using NOAA, USGS, CDC, GDACS, and ReliefWeb data with Monte Carlo simulations.",
      "url": "https://safetrekr.com/how-it-works#review"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Receive Your Safety Binder",
      "text": "Audit-ready documentation delivered with SHA-256 hash-chain integrity. Every finding, every recommendation, every emergency contact, every risk score.",
      "url": "https://safetrekr.com/how-it-works#binder"
    }
  ]
}
```

---

## Plausible Analytics Events

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `how_it_works_hero_cta` | Hero "Get a Demo" click | `{ cta: "demo" }` |
| `how_it_works_hero_sample` | Hero "Download a Sample Binder" click | `{ cta: "sample_binder" }` |
| `how_it_works_binder_download` | Binder section download CTA click | `{ cta: "sample_binder", section: "binder" }` |
| `how_it_works_segment_click` | Segment card click | `{ segment: "k12" \| "higher-ed" \| "churches" \| "corporate" }` |
| `how_it_works_final_cta` | Final CTA "Get a Demo" click | `{ cta: "demo", section: "final" }` |
| `how_it_works_mobile_app` | "Explore Mobile App" click | `{ cta: "mobile_app" }` |
| `how_it_works_anchor_nav` | In-page anchor click | `{ anchor: "process" \| "intelligence" \| ... }` |
| `how_it_works_scroll_depth` | Scroll milestones | `{ depth: "25" \| "50" \| "75" \| "100" }` |

---

## WCAG 2.2 AA Compliance Checklist

- [ ] All text meets minimum contrast ratios (verified per Section 3.8 of Design System)
- [ ] All interactive elements have 44x44px minimum touch targets
- [ ] All images and decorative elements have appropriate `alt` text or `aria-hidden="true"`
- [ ] All sections use proper heading hierarchy: single `<h1>`, sequential `<h2>` through `<h3>`
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Skip-nav link present and functional
- [ ] In-page anchor nav is keyboard-navigable
- [ ] Focus-visible indicators on all interactive elements (2px `ring` color)
- [ ] No information conveyed by color alone (numbers accompany status dots, text accompanies icons)
- [ ] Page is fully navigable and readable without JavaScript (SSG renders all content)
- [ ] All `<section>` elements have `aria-labelledby` pointing to their heading
- [ ] Decorative SVGs (connecting lines, bell curve, phone mockup internals) use `aria-hidden="true"`
- [ ] Form-like elements (anchor nav) have `aria-label` or `aria-labelledby`
- [ ] SHA-256 hash displayed in monospace has accessible label for screen readers
- [ ] Lighthouse Accessibility score target: 100

---

## Heading Hierarchy

```
<h1> From Trip Submission to Safety Binder in 3-5 Days.
  <h2> Three Steps. One Standard.                          (#process)
    <h3> Submit Your Trip
    <h3> Analyst Reviews Everything
    <h3> Receive Your Safety Binder
  <h2> We Analyze Data You Can't Get from a Google Search.  (#intelligence)
    <h3> NOAA
    <h3> USGS
    <h3> CDC
    <h3> GDACS
    <h3> ReliefWeb
    <h3> Probability-Weighted Risk Scores
  <h2> 17 Sections. Nothing Missed.                        (#review)
    <h3> Trip Planning (category)
    <h3> Destinations & Venues (category)
    <h3> Safety & Intelligence (category)
    <h3> Emergency Preparedness (category)
    <h3> Documentation & Compliance (category)
  <h2> What You Receive.                                    (#binder)
    <h3> Tamper-Evident Integrity
  <h2> Everything Your Chaperones Need in Their Pocket.     (#field-ops)
  <h2> Every Decision Documented. Every Precaution Verifiable. (#after-trip)
    <h3> Audit Trail
    <h3> Compliance Documentation
    <h3> Insurance Records
  <h2> See How It Works for Your Organization.
    <h3> K-12 Schools & Districts
    <h3> Higher Education
    <h3> Churches & Mission Orgs
    <h3> Corporate & Sports Teams
  <h2> Ready to See It in Action?
```

---

## Implementation Notes

### File Structure

```
app/
  how-it-works/
    page.tsx                    # Server component, SSG
    _components/
      hero.tsx                  # Hero section
      intelligence-section.tsx  # Dark section with source bar + Monte Carlo
      review-grid.tsx           # 17-section grouped grid
      binder-section.tsx        # Safety binder showcase
      field-ops-section.tsx     # During the trip (FeatureShowcase wrapper)
      after-trip-section.tsx    # After the trip proof grid
      segment-examples.tsx      # 4 segment routing cards
```

### Data

The 17-section review data and 5 intelligence sources should be defined as static arrays in a shared data file (`lib/data/how-it-works.ts`) rather than hardcoded in components. This enables:

1. Reuse across the homepage summary and the full How It Works page
2. Type-safe content management
3. Easy content updates without component changes

### Performance

- All sections are server-rendered (SSG). Framer Motion animations are client-side hydrated.
- Intelligence source SVG marks: inline SVG, no network requests.
- DocumentPreview: CSS-only stacked paper effect. No images.
- PhoneMockup: CSS frame with SSR content. Map placeholder is styled `div`, not an actual map instance.
- Bell curve SVG: inline, ~1KB. Animated client-side.
- Images: None required. This page is entirely component-based.

### Priority Order

| Priority | Component | Reason |
|----------|-----------|--------|
| P0 | Hero + Process Timeline | Core narrative spine |
| P0 | 17-Section Review Grid | Primary proof of thoroughness |
| P0 | CTA Bands (hero + final) | Conversion paths |
| P1 | Intelligence Sources Section | Unique mechanism differentiator |
| P1 | Safety Binder Section | Tangible deliverable visualization |
| P1 | Sticky Anchor Nav | Usability for long page |
| P2 | During the Trip (Field Ops) | Secondary feature showcase |
| P2 | After the Trip | Supporting proof section |
| P2 | Segment Examples | Routing/navigation section |
| P3 | Monte Carlo visualization | Visual polish |
| P3 | Phone mockup animation | Visual polish |
