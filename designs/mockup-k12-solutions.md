# High-Fidelity Mockup Specification: K-12 Solutions Page

**Page**: `/solutions/k12`
**Version**: 1.0
**Date**: 2026-03-24
**Status**: Ready for Development
**Page Type**: Segment Landing Page (SSG)
**Hierarchy Level**: L2
**JSON-LD**: FAQPage (10 K-12-specific Q&As)
**Breadcrumb**: `Home > Solutions > K-12 Schools & Districts`
**Title Tag**: `Trip Safety for K-12 Schools & Districts -- SafeTrekr`
**Meta Description**: `Every field trip reviewed by a safety analyst. Per-student pricing starting at $15. Board-ready documentation that proves your district took every reasonable precaution.`

---

## Page-Level Architecture

### Target Audience

| Persona | Role | Primary Concern | Decision Weight |
|---------|------|-----------------|-----------------|
| Superintendent | Executive sponsor | District liability, board accountability | Final budget approval |
| Principal | Mid-level decision maker | Student safety, parent trust, policy compliance | Recommends to superintendent |
| Risk Manager | Evaluator | Documentation quality, audit readiness, FERPA | Technical approval |
| School Board Member | Oversight | Liability exposure, duty of care evidence | Policy approval |
| Trip Coordinator (Teacher) | End user | Ease of use, time savings, parent communication | Influences adoption |

### Conversion Strategy

The K-12 page converts through a **board liability narrative**: the cost of not having professional safety documentation ($500K-$2M settlement) versus the cost of SafeTrekr ($15/student). Every section reinforces this asymmetry. The primary CTA is the sample binder download (gated) because board members and superintendents need to see the deliverable before approving budget. The demo request is secondary because this audience evaluates documents before meetings.

### Dark Section Allocation (Max 2, Excluding Footer)

| Dark Section | Location | Purpose |
|---|---|---|
| Dark 1 | Section 3: The Challenge | Liability comparison -- emotional peak of the pain narrative |
| Dark 2 | Section 9: Conversion CTA Banner | Closing urgency with authority surface |

### Section Flow and Surface Rhythm

```
Section 1  Hero .......................... background (#e7ecee)
Section 2  Proof Strip ................... card (#f7f8f8) with border-y
Section 3  The Challenge ................. DARK -- secondary (#123646)
Section 4  How SafeTrekr Solves It ....... background (#e7ecee)
Section 5  Sample Binder Preview ......... primary-50 (#f1f9f4) accent wash
Section 6  Per-Student Pricing Calculator  background (#e7ecee)
Section 7  Compliance & Trust ............ card (#f7f8f8)
Section 8  Common Questions .............. background (#e7ecee)
Section 9  Conversion CTA Banner ......... DARK -- secondary (#123646)
           Footer ........................ secondary (#123646) [does not count]
```

---

## Section 1: Hero

### Layout

```
+===========================================================================+
|  Breadcrumb: Home > Solutions > K-12 Schools & Districts                  |
|                                                                           |
|  [container max-w-1280px, grid lg:grid-cols-12 gap-12 lg:gap-20]         |
|                                                                           |
|  +-- TEXT COLUMN (lg:col-span-6) -----+  +-- VISUAL COLUMN (lg:col-span-6)
|  |                                     |  |                               |
|  |  [Badge: default]                   |  |  +-------------------------+  |
|  |  $15 PER STUDENT                    |  |  |                         |  |
|  |                                     |  |  |  FIELD TRIP SAFETY      |  |
|  |  [Eyebrow: primary-700]             |  |  |  REVIEW UI MOCKUP       |  |
|  |  K-12 TRIP SAFETY                   |  |  |                         |  |
|  |                                     |  |  |  Stylized review card   |  |
|  |  [text-display-lg, foreground]      |  |  |  showing 17-section     |  |
|  |  Every Field Trip                   |  |  |  analyst checklist      |  |
|  |  Deserves a                         |  |  |  with school bus icon,  |  |
|  |  Safety Analyst.                    |  |  |  destination pin, and   |  |
|  |                                     |  |  |  "Board Ready" badge    |  |
|  |  [text-body-lg, muted-foreground]   |  |  |                         |  |
|  |  Professional safety analysis for   |  |  |  [DocumentPreview       |  |
|  |  every field trip your district     |  |  |   component with        |  |
|  |  runs. Board-ready documentation.   |  |  |   K-12 field trip       |  |
|  |  Designed with FERPA requirements   |  |  |   binder content]       |  |
|  |  in mind. Starting at $15 per       |  |  |                         |  |
|  |  student.                           |  |  +-------------------------+  |
|  |                                     |  |                               |
|  |  [Button: primary, size lg]         |  |                               |
|  |  Download K-12 Sample Binder        |  |                               |
|  |                                     |  |                               |
|  |  [Button: secondary, size lg]       |  |                               |
|  |  Get a Demo                         |  |                               |
|  |                                     |  |                               |
|  +-------------------------------------+  +-------------------------------+
|                                                                           |
+===========================================================================+
```

### Content

| Element | Content | Token / Class |
|---------|---------|---------------|
| Breadcrumb | `Home > Solutions > K-12 Schools & Districts` | `text-body-sm text-muted-foreground`, `aria-current="page"` on last item |
| Pricing Badge | `$15 PER STUDENT` | `Badge variant="default"` (primary-50 bg, primary-800 text) |
| Eyebrow | `K-12 TRIP SAFETY` | `text-eyebrow text-primary-700 uppercase tracking-[0.08em]` |
| Headline | `Every Field Trip Deserves a Safety Analyst.` | `text-display-lg text-foreground font-bold max-w-[20ch]` |
| Sub-headline | `Professional safety analysis for every field trip your district runs. Board-ready documentation. Designed with FERPA requirements in mind. Starting at $15 per student.` | `text-body-lg text-muted-foreground max-w-prose mt-6` |
| Primary CTA | `Download K-12 Sample Binder` | `Button variant="primary" size="lg"`, links to `/resources/sample-binders/k12-field-trip` |
| Secondary CTA | `Get a Demo` | `Button variant="secondary" size="lg"`, links to `/demo` |

### Visual Column

The visual column renders a `DocumentPreview` component customized for K-12 content. The front sheet displays:

1. **Header**: SafeTrekr logo mark (16px) + "Field Trip Safety Binder" in `text-heading-sm`
2. **Destination badge**: `Badge variant="default"` reading "Springfield Science Museum"
3. **Review summary strip**: 3 mini stat blocks -- "17 Sections Reviewed" / "Risk Score: Low" / "3 Hazard Flags"
4. **Checklist preview**: 4 visible checklist items with green check icons:
   - "Transportation route assessed"
   - "Weather conditions reviewed"
   - "Emergency facilities mapped"
   - "Parent notification ready"
5. **Board Ready stamp**: `Badge variant="default" size="lg"` reading "Board Ready" with Shield icon
6. **SHA-256 hash**: `text-mono-sm text-muted-foreground` showing truncated hash `sha256:a3f8c2...9d1e`

The back sheets create the stacked-paper depth effect per the `DocumentPreview` component specification.

### Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| base (< 768px) | Single column. Visual above text. Badge + Eyebrow + Headline + Body + CTAs stacked. CTAs full-width, stacked vertically with `gap-3`. Visual: max-height 320px, centered. |
| md (768px) | Single column, visual sized at 480px max-width centered. |
| lg (1024px+) | 2-column grid (`grid-cols-12`). Text: `col-span-6`. Visual: `col-span-6`. Items vertically centered (`items-center`). |
| xl (1280px+) | Max container width reached. Generous side margins. |

### Spacing

| Property | Value |
|----------|-------|
| Section padding | `pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24 xl:pt-24 xl:pb-32` |
| Breadcrumb to badge | `mb-6` (24px) |
| Badge to eyebrow | `mb-4` (16px) |
| Eyebrow to headline | `mb-3` (12px) |
| Headline to body | `mt-6` (24px) |
| Body to CTA group | `mt-8` (32px) |
| Between CTAs | `gap-4` (16px) horizontal on desktop, `gap-3` (12px) vertical on mobile |

### Animation

| Element | Preset | Trigger |
|---------|--------|---------|
| Text column | `fadeUp` | Page load (no delay -- LCP critical) |
| Badge | `fadeIn` with 100ms delay | Page load |
| Visual column | `scaleIn` with 200ms delay | Page load |
| Document sheets | `documentStack` | Page load (after scaleIn) |

### Accessibility

- Breadcrumb: `<nav aria-label="Breadcrumb">` wrapping `<ol>`, last item `aria-current="page"`
- Headline: `<h1>`
- Visual: Decorative. `aria-hidden="true"` on the DocumentPreview composition. Alt text on static image fallback: "Preview of a K-12 Field Trip Safety Binder showing 17 reviewed safety sections, risk scoring, and board-ready documentation."
- CTAs: Clearly labeled. Download CTA includes `aria-label="Download K-12 Field Trip Sample Binder (opens gated download)"`.
- Pricing badge: `aria-label="Per-student pricing: $15 per student"`

---

## Section 2: Proof Strip

### Layout

Uses the shared `TrustMetricsStrip` component.

```
+===========================================================================+
|  [border-y border-border bg-card py-12]                                   |
|                                                                           |
|  [grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8]                  |
|                                                                           |
|  +----------+  +----------+  +----------+  +----------+  +----------+    |
|  |     5    |  |    17    |  |   3-5    |  | AES-256  |  | SHA-256  |    |
|  | GOVT     |  | SAFETY   |  |   DAY    |  | ENCRYPT  |  | EVIDENCE |    |
|  | INTEL    |  | REVIEW   |  | TURN-    |  | STANDARD |  | CHAIN    |    |
|  | SOURCES  |  | SECTIONS |  | AROUND   |  |          |  |          |    |
|  +----------+  +----------+  +----------+  +----------+  +----------+    |
|                                                                           |
+===========================================================================+
```

### Content

| Value | Label | Notes |
|-------|-------|-------|
| `5` | `Government Intel Sources` | Numeric, animates with counter |
| `17` | `Safety Review Sections` | Numeric, animates with counter |
| `3-5` | `Day Turnaround` | String, fades in |
| `AES-256` | `Encryption Standard` | String, fades in |
| `SHA-256` | `Evidence Chain` | String, fades in |

### Responsive Behavior

- base: 2-column grid, last item centered spanning full width
- md: 3-column grid, last 2 items centered in a partial row
- lg: 5-column single row

### Animation

- Entire strip: `fadeIn` at 20% viewport intersection
- StatCard values: `counterAnimate` (numbers count from 0 over 1.5s). String values fade in.
- `prefers-reduced-motion`: Show final values immediately, no counter animation.

### Accessibility

- StatCards with animated counters: `aria-label` with final value set immediately (screen readers never see counting animation)
- Each StatCard value is semantically grouped with its label via `aria-labelledby`

---

## Section 3: The Challenge (Dark Authority Section)

### Layout

```
+===========================================================================+
|  [DarkAuthoritySection: bg-secondary, data-theme="dark"]                  |
|  [Standard section padding]                                               |
|                                                                           |
|  [container max-w-1280px]                                                 |
|                                                                           |
|  [Eyebrow: dark-accent (#6cbc8b)]                                        |
|  THE STATUS QUO                                                           |
|                                                                           |
|  [text-display-md, dark-text-primary (#f7f8f8)]                           |
|  What Schools Currently                                                   |
|  Rely On                                                                  |
|                                                                           |
|  [text-body-lg, dark-text-secondary (#b8c3c7), max-w-prose]              |
|  Teachers assemble spreadsheets. Permission slips serve as the only       |
|  documentation. Risk assessment means checking the weather forecast        |
|  the morning of departure.                                                |
|                                                                           |
|  [grid lg:grid-cols-3 gap-8, mt-12]                                      |
|                                                                           |
|  +-- PAIN CARD 1 --------+  +-- PAIN CARD 2 --------+  +-- PAIN CARD 3 -+
|  |  [dark-surface card]   |  |  [dark-surface card]   |  |  [dark-surface]|
|  |                        |  |                        |  |                |
|  |  [icon: Clock]         |  |  [icon: AlertTriangle] |  |  [icon: File]  |
|  |  $700 - $1,400         |  |  $500K - $2M           |  |  Zero          |
|  |  in staff hours        |  |  average settlement    |  |  formal risk   |
|  |  per trip              |  |  for trip-related      |  |  documentation |
|  |                        |  |  incidents              |  |                |
|  |  Every field trip      |  |  When a student is     |  |  Permission    |
|  |  requires 15-30 hours  |  |  injured on a trip,    |  |  slips are not |
|  |  of manual safety      |  |  "What precautions     |  |  safety plans. |
|  |  planning by teachers  |  |  did the district      |  |  A signed      |
|  |  who are not risk      |  |  take?" is the first   |  |  waiver is not |
|  |  professionals.        |  |  question asked.       |  |  evidence of   |
|  |                        |  |                        |  |  due diligence.|
|  +------------------------+  +------------------------+  +----------------+
|                                                                           |
|  +-- LIABILITY COMPARISON BAR (mt-12) -----------------------------------+
|  |  [dark-surface card, p-8, rounded-xl]                                 |
|  |                                                                       |
|  |  [text-heading-sm, dark-text-primary]                                 |
|  |  The Board Liability Question                                         |
|  |                                                                       |
|  |  [Two-column comparison, lg:grid-cols-2, gap-8]                       |
|  |                                                                       |
|  |  WITHOUT SAFETREKR              WITH SAFETREKR                        |
|  |  ----------------------------------------                             |
|  |  [destructive text]             [dark-accent text]                    |
|  |                                                                       |
|  |  "What documentation            "Here is the 17-section              |
|  |   did the district have         safety review conducted              |
|  |   before approving              by a professional analyst,           |
|  |   this trip?"                   the government intelligence          |
|  |                                 risk score, and the complete         |
|  |  Answer: Permission slips.      evidence binder with SHA-256        |
|  |  A teacher's spreadsheet.       verification."                       |
|  |  Verbal assurances.                                                   |
|  |                                 Answer: A documented, tamper-        |
|  |                                 evident record of every              |
|  |                                 precaution the district took.        |
|  |                                                                       |
|  +-----------------------------------------------------------------------+
|                                                                           |
+===========================================================================+
```

### Content

**Section Header**

| Element | Content | Token |
|---------|---------|-------|
| Eyebrow | `THE STATUS QUO` | `text-eyebrow text-[var(--color-dark-accent)] uppercase` |
| Headline | `What Schools Currently Rely On` | `text-display-md text-[var(--color-dark-text-primary)]` |
| Body | `Teachers assemble spreadsheets. Permission slips serve as the only documentation. Risk assessment means checking the weather forecast the morning of departure.` | `text-body-lg text-[var(--color-dark-text-secondary)] max-w-prose` |

**Pain Cards**

Each card uses `bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded-xl p-6`.

| Card | Icon | Stat | Stat Label | Body |
|------|------|------|------------|------|
| Staff Time | `Clock` (24px, `dark-accent`) | `$700 - $1,400` | `in staff hours per trip` | Every field trip requires 15-30 hours of manual safety planning by teachers who are not risk professionals. |
| Liability Exposure | `AlertTriangle` (24px, `safety-red` -- operational context) | `$500K - $2M` | `average settlement for trip-related incidents` | When a student is injured on a trip, "What precautions did the district take?" is the first question asked. |
| Documentation Gap | `FileX` (24px, `dark-accent`) | `Zero` | `formal risk documentation` | Permission slips are not safety plans. A signed waiver is not evidence of due diligence. |

**Stat styling within pain cards**: `text-display-md text-[var(--color-dark-text-primary)] font-display font-bold`. Label: `text-eyebrow text-[var(--color-dark-text-secondary)]`. Body: `text-body-md text-[var(--color-dark-text-secondary)] mt-4`.

Note on safety-red usage: The `safety-red` color on the AlertTriangle icon in the Liability Exposure card is acceptable because this is an operational/risk context (communicating severity of real liability), not decorative marketing use. The icon also has an `aria-label` so color is not the sole meaning indicator.

**Board Liability Comparison**

| Column | Heading | Content |
|--------|---------|---------|
| Without SafeTrekr | `WITHOUT SAFETREKR` | Heading in `text-[var(--color-destructive)]` (destructive red). Quote: "What documentation did the district have before approving this trip?" Answer: "Permission slips. A teacher's spreadsheet. Verbal assurances." |
| With SafeTrekr | `WITH SAFETREKR` | Heading in `text-[var(--color-dark-accent)]` (primary-400 green). Quote: "Here is the 17-section safety review conducted by a professional analyst, the government intelligence risk score, and the complete evidence binder with SHA-256 verification." Answer: "A documented, tamper-evident record of every precaution the district took." |

Column headings: `text-eyebrow uppercase tracking-[0.08em]`. Quote text: `text-body-lg italic`. Answer text: `text-body-md mt-4`.

### Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| base | Pain cards stacked vertically. Liability comparison stacked (Without first, With second). |
| md | Pain cards in a 3-column grid. Liability comparison side-by-side. |
| lg | Same as md with increased padding and spacing. |

### Spacing

| Property | Value |
|----------|-------|
| Section padding | Standard section padding per breakpoint scale |
| Header to cards | `mt-12` (48px) |
| Between pain cards | `gap-8` (32px) |
| Cards to liability comparison | `mt-12` (48px) |
| Liability columns internal | `gap-8` (32px) |

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Entire dark section | `fadeIn` | Background fades, then content staggers |
| Pain cards | `staggerContainer + cardReveal` | Cards stagger at 80ms |
| Liability comparison | `fadeUp` | Enters after cards (200ms additional delay) |

### Accessibility

- Section: `<section aria-labelledby="challenge-heading">`
- Headline: `<h2 id="challenge-heading">`
- Pain card stats: Each stat uses `aria-label` with context (e.g., "$700 to $1,400 in staff hours per field trip")
- Liability comparison: Structured as a `<div role="group" aria-label="Board liability comparison: without versus with SafeTrekr">`
- AlertTriangle icon: `aria-label="Warning"` alongside the stat value
- Color is never the sole indicator: red and green headings are also labeled "WITHOUT" and "WITH"

---

## Section 4: How SafeTrekr Solves It

### Layout

```
+===========================================================================+
|  [bg-background, standard section padding]                                |
|  [container max-w-1280px]                                                 |
|                                                                           |
|  [centered header, text-center, max-w-3xl mx-auto]                       |
|  [Eyebrow] BUILT FOR K-12 DISTRICTS                                      |
|  [Headline] Professional Trip Safety                                      |
|             for Every Field Trip                                          |
|  [Body] From the science museum to the state capital, every               |
|         destination your students visit gets the same level               |
|         of professional safety analysis.                                  |
|                                                                           |
|  [grid sm:grid-cols-2 gap-6 lg:gap-8, mt-12]                             |
|                                                                           |
|  +-- FEATURE CARD 1 --------+  +-- FEATURE CARD 2 --------+             |
|  |  [FeatureCard]            |  |  [FeatureCard]            |             |
|  |  [icon: ClipboardCheck]   |  |  [icon: MonteCarlo]       |             |
|  |  Analyst Safety Review    |  |  Risk Intelligence        |             |
|  |  Every field trip          |  |  Weather, health, crime,  |             |
|  |  destination reviewed      |  |  and natural hazard data  |             |
|  |  across 17 safety          |  |  scored for every         |             |
|  |  dimensions by a           |  |  destination your         |             |
|  |  professional analyst.     |  |  students visit.          |             |
|  |  -> Learn more             |  |  -> Learn more            |             |
|  +----------------------------+  +----------------------------+            |
|                                                                           |
|  +-- FEATURE CARD 3 --------+  +-- FEATURE CARD 4 --------+             |
|  |  [FeatureCard]            |  |  [FeatureCard]            |             |
|  |  [icon: EvidenceBinder]   |  |  [icon: Smartphone]       |             |
|  |  Trip Safety Binder       |  |  Parent/Guardian Portal   |             |
|  |  Board-ready               |  |  Parents see trip safety  |             |
|  |  documentation that        |  |  details on their phone.  |             |
|  |  proves your district      |  |  You control exactly      |             |
|  |  took every reasonable     |  |  what they see.           |             |
|  |  precaution.               |  |  -> Learn more            |             |
|  |  -> Learn more             |  |                           |             |
|  +----------------------------+  +----------------------------+            |
|                                                                           |
+===========================================================================+
```

### Content

**Section Header**

| Element | Content | Token |
|---------|---------|-------|
| Eyebrow | `BUILT FOR K-12 DISTRICTS` | `text-eyebrow text-primary-700 uppercase` |
| Headline | `Professional Trip Safety for Every Field Trip` | `text-display-md text-foreground text-center` |
| Body | `From the science museum to the state capital, every destination your students visit gets the same level of professional safety analysis.` | `text-body-lg text-muted-foreground text-center max-w-prose mx-auto mt-4` |

**Feature Cards**

Each card uses the `FeatureCard` component with K-12-specific benefit copy.

| # | Icon | Title | Description | Link |
|---|------|-------|-------------|------|
| 1 | `ClipboardCheck` (Lucide) or `AnalystReview` (custom) | `Analyst Safety Review` | `Every field trip destination reviewed across 17 safety dimensions by a professional analyst. Not a checklist. Not software. A human review.` | `/platform/analyst-review` |
| 2 | `MonteCarlo` (custom) | `Risk Intelligence Engine` | `Weather, health, crime, and natural hazard data from 5 government sources scored for every destination your students visit. Monte Carlo simulation, not guesswork.` | `/platform/risk-intelligence` |
| 3 | `EvidenceBinder` (custom) or `FileText` (Lucide) | `Trip Safety Binder` | `Board-ready documentation that proves your district took every reasonable precaution. Tamper-evident with SHA-256 hash chain. Audit-ready on day one.` | `/platform/safety-binder` |
| 4 | `Smartphone` (Lucide) | `Parent/Guardian Portal` | `Parents see trip safety details on their phone. Rally points, emergency contacts, and real-time check-in status. You control exactly what they see.` | `/platform/mobile-app` |

Each card: `bg-card rounded-xl border border-border p-6 sm:p-8 shadow-card`. Hover: `shadow-card-hover translateY(-2px)`. Link text: `text-body-sm font-medium text-primary-700` with ArrowRight icon.

### Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| base | Single column, cards stacked with `gap-6` |
| sm (640px) | 2-column grid (`grid-cols-2 gap-6`) |
| lg (1024px+) | 2-column grid with increased gap (`gap-8`) |

### Spacing

| Property | Value |
|----------|-------|
| Section padding | Standard section padding per breakpoint scale |
| Header to card grid | `mt-12` (48px) |
| Between cards | `gap-6` (24px), `lg:gap-8` (32px) |

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Section header | `fadeUp` | Eyebrow + heading + body staggered at 80ms |
| Feature cards | `staggerContainer + cardReveal` | Cards stagger at 80ms |

### Accessibility

- Section: `<section aria-labelledby="solutions-heading">`
- Headline: `<h2 id="solutions-heading">`
- Feature cards: Each title is `<h3>`. Entire card is a clickable `<a>` with `group` class.
- Icons: Decorative (`aria-hidden="true"`) -- the card title provides context.

---

## Section 5: Sample Binder Preview

### Layout

```
+===========================================================================+
|  [bg-primary-50, standard section padding]                                |
|  [container max-w-1280px]                                                 |
|                                                                           |
|  [grid lg:grid-cols-12 gap-12 lg:gap-20 items-center]                    |
|                                                                           |
|  +-- VISUAL (lg:col-span-7) --------+  +-- TEXT (lg:col-span-5) --------+
|  |                                    |  |                                |
|  |  [Fanned binder page thumbnails]   |  |  [Eyebrow]                    |
|  |                                    |  |  SEE THE DELIVERABLE          |
|  |  +------+                          |  |                                |
|  |  | pg 1 |                          |  |  [Headline]                    |
|  |  |      +------+                   |  |  See What Your                 |
|  |  |      | pg 2 |                   |  |  Superintendent                |
|  |  |      |      +------+            |  |  Will Review                   |
|  |  |      |      | pg 3 |            |  |                                |
|  |  |      |      |      +------+     |  |  [Body]                        |
|  |  |      |      |      | pg 4 |     |  |  Every field trip produces     |
|  |  +------+      |      |      |     |  |  a comprehensive safety        |
|  |         +------+      |      |     |  |  binder. This is what your     |
|  |                +------+      |     |  |  school board will see when    |
|  |                       +------+     |  |  they ask about trip safety    |
|  |                                    |  |  documentation.                |
|  |  Page labels below thumbnails:     |  |                                |
|  |  1. Destination Risk Score         |  |  [Checklist items]             |
|  |  2. 17-Section Safety Review       |  |  [check] Risk score summary    |
|  |  3. Emergency Response Plan        |  |  [check] 17-section review     |
|  |  4. Evidence Chain Verification    |  |  [check] Emergency protocols   |
|  |                                    |  |  [check] SHA-256 verification  |
|  +------------------------------------+  |  [check] Government data cited |
|                                          |                                |
|                                          |  [Button: primary, size lg]    |
|                                          |  Download K-12 Sample Binder   |
|                                          |                                |
|                                          |  [text-body-sm,                |
|                                          |   muted-foreground]            |
|                                          |  Free. No credit card.         |
|                                          |  Email required.               |
|                                          |                                |
|                                          +--------------------------------+
|                                                                           |
+===========================================================================+
```

### Content

**Section Header (in text column)**

| Element | Content | Token |
|---------|---------|-------|
| Eyebrow | `SEE THE DELIVERABLE` | `text-eyebrow text-primary-700 uppercase` |
| Headline | `See What Your Superintendent Will Review` | `text-display-md text-foreground` |
| Body | `Every field trip produces a comprehensive safety binder. This is what your school board will see when they ask about trip safety documentation.` | `text-body-lg text-muted-foreground max-w-prose mt-4` |

**Checklist Items**

Each item: `flex items-start gap-3`. Icon: `Check` in `h-5 w-5 text-primary-500 mt-0.5 shrink-0`. Text: `text-body-md text-foreground`.

| Item |
|------|
| Risk score summary for every destination |
| 17-section professional safety review |
| Emergency response protocols and contacts |
| SHA-256 tamper-evident verification |
| Government intelligence data cited |

**CTA Group**

| Element | Content | Token |
|---------|---------|-------|
| Button | `Download K-12 Sample Binder` | `Button variant="primary" size="lg"`, links to `/resources/sample-binders/k12-field-trip` |
| Reassurance | `Free. No credit card. Email required.` | `text-body-sm text-muted-foreground mt-3` |

**Visual Column: Binder Thumbnails**

4 stylized page thumbnails arranged in a fanned/offset layout. Each thumbnail:
- `bg-white rounded-lg border border-border shadow-md`
- Dimensions: approximately 200px wide x 260px tall (desktop), scaled proportionally on mobile
- Contains a simplified representation of binder content (abstract lines, chart shapes, badges)
- Slight rotation: page 1 at -3deg, page 2 at -1deg, page 3 at 1deg, page 4 at 3deg
- Labels below each page in `text-body-xs text-muted-foreground`

### Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| base | Single column. Visual above text. Thumbnails in horizontal scroll or 2x2 grid. |
| md | Single column. Thumbnails in a horizontal row (all 4 visible). |
| lg | 2-column grid. Visual left (`col-span-7`), text right (`col-span-5`). |

Note: This section uses reversed layout (visual left, text right) compared to the standard FeatureShowcase alternation pattern, because the visual is the hero of this section -- the deliverable is what converts board members.

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Text column | `fadeUp` | Standard staggered reveal |
| Thumbnails | `documentStack` | Pages fan out with slight stagger (100ms each) |
| Checklist items | `checklistReveal` | Items stagger at 60ms |

### Accessibility

- Section: `<section aria-labelledby="binder-preview-heading">`
- Headline: `<h2 id="binder-preview-heading">`
- Thumbnail images: Each has `alt` text describing the binder page content (e.g., "Sample binder page showing destination risk score with government data sources")
- Checklist: `<ul>` with `role="list"`, each item is `<li>`
- Download CTA: `aria-label="Download K-12 Field Trip Sample Binder (free, email required)"`

---

## Section 6: Per-Student Pricing Calculator

### Layout

```
+===========================================================================+
|  [bg-background, standard section padding]                                |
|  [container max-w-1280px]                                                 |
|                                                                           |
|  [centered header, max-w-3xl mx-auto]                                    |
|  [Eyebrow] PRICING                                                        |
|  [Headline] $15 Per Student.                                              |
|             Do the Math.                                                   |
|  [Body] Professional safety analysis costs less than a permission          |
|         slip printing budget. Compare to what your district                |
|         risks without it.                                                  |
|                                                                           |
|  [Calculator Card, max-w-2xl mx-auto, mt-12]                             |
|  +-----------------------------------------------------------------------+
|  |  [bg-card rounded-2xl border-2 border-border shadow-lg p-8 lg:p-10]  |
|  |                                                                       |
|  |  [text-heading-sm] Calculate Your District's Cost                     |
|  |                                                                       |
|  |  [Input group]                                                        |
|  |  STUDENTS PER TRIP                                                    |
|  |  [===================o=================] 30                           |
|  |  [Range slider: min=10, max=200, step=5, default=30]                  |
|  |                                                                       |
|  |  TRIPS PER YEAR                                                       |
|  |  [========o============================] 20                           |
|  |  [Range slider: min=1, max=100, step=1, default=20]                   |
|  |                                                                       |
|  |  [Divider: section variant]                                           |
|  |                                                                       |
|  |  [Results grid: grid-cols-3 gap-6]                                    |
|  |                                                                       |
|  |  +-- RESULT 1 ----------+  +-- RESULT 2 ----+  +-- RESULT 3 --------+|
|  |  |  [text-display-md]   |  |  [text-body-lg] |  |  [text-body-lg]    ||
|  |  |  $9,000              |  |  $15             |  |  $450              ||
|  |  |  [text-eyebrow]      |  |  [text-eyebrow]  |  |  [text-eyebrow]   ||
|  |  |  ANNUAL COST         |  |  PER STUDENT     |  |  PER TRIP          ||
|  |  +----------------------+  +------------------+  +--------------------+|
|  |                                                                       |
|  |  [Comparison strip, mt-8, bg-primary-50 rounded-lg p-4]              |
|  |                                                                       |
|  |  [grid lg:grid-cols-3 gap-4]                                          |
|  |                                                                       |
|  |  SafeTrekr        Staff Time           Lawsuit Risk                   |
|  |  $9,000/year      $14,000-$28,000/yr   $500K-$2M                     |
|  |  [primary-700]    [muted-foreground]    [destructive]                 |
|  |                   20 trips x $700-      Average settlement            |
|  |                   $1,400 per trip       for trip-related              |
|  |                                        incidents                      |
|  |                                                                       |
|  |  [text-body-sm, muted-foreground, mt-6, text-center]                 |
|  |  See full pricing details including volume discounts                  |
|  |  for large districts.                                                 |
|  |  [Link: "View Full Pricing ->"]                                       |
|  |                                                                       |
|  +-----------------------------------------------------------------------+
|                                                                           |
+===========================================================================+
```

### Content

**Section Header**

| Element | Content | Token |
|---------|---------|-------|
| Eyebrow | `PRICING` | `text-eyebrow text-primary-700 uppercase` |
| Headline | `$15 Per Student. Do the Math.` | `text-display-md text-foreground text-center` |
| Body | `Professional safety analysis costs less than a permission slip printing budget. Compare to what your district risks without it.` | `text-body-lg text-muted-foreground text-center max-w-prose mx-auto mt-4` |

**Calculator Card**

| Element | Content | Token |
|---------|---------|-------|
| Card heading | `Calculate Your District's Cost` | `text-heading-sm text-foreground` |
| Slider 1 label | `STUDENTS PER TRIP` | `text-eyebrow text-muted-foreground uppercase` |
| Slider 1 | Range: 10-200, step 5, default 30 | Custom styled range input |
| Slider 1 value display | Dynamic (e.g., `30`) | `text-heading-md text-foreground font-display tabular-nums` |
| Slider 2 label | `TRIPS PER YEAR` | `text-eyebrow text-muted-foreground uppercase` |
| Slider 2 | Range: 1-100, step 1, default 20 | Custom styled range input |
| Slider 2 value display | Dynamic (e.g., `20`) | `text-heading-md text-foreground font-display tabular-nums` |

**Calculation Formula**

```
annualCost = studentsPerTrip * 15 * tripsPerYear
perStudent = 15 (fixed)
perTrip = studentsPerTrip * 15
```

Note: This is a simplified calculator for marketing purposes. The $15/student pricing is the anchor. Actual pricing may vary by tier and volume. The calculator always uses $15 to maintain messaging consistency.

**Results Grid**

| Result | Value (default 30 students, 20 trips) | Label | Token |
|--------|--------------------------------------|-------|-------|
| Annual Cost | `$9,000` | `ANNUAL COST` | Value: `text-display-md text-foreground font-display tabular-nums`. Label: `text-eyebrow text-muted-foreground` |
| Per Student | `$15` | `PER STUDENT` | Value: `text-body-lg text-primary-700 font-semibold`. Label: `text-eyebrow text-muted-foreground` |
| Per Trip | `$450` | `PER TRIP` | Value: `text-body-lg text-foreground font-semibold`. Label: `text-eyebrow text-muted-foreground` |

Values update live as sliders change. Use `tabular-nums` font-variant for stable number widths during updates.

**Comparison Strip**

| Column | Heading | Value | Detail | Color |
|--------|---------|-------|--------|-------|
| SafeTrekr | `SafeTrekr` | Dynamic (e.g., `$9,000/year`) | `Professional analyst review` | `text-primary-700` (value), `text-muted-foreground` (detail) |
| Staff Time | `Staff Time Without SafeTrekr` | Dynamic (e.g., `$14,000 - $28,000/year`) | Calculated as `tripsPerYear * $700` to `tripsPerYear * $1,400` | `text-muted-foreground` |
| Lawsuit Risk | `Lawsuit Exposure` | `$500K - $2M` | `Average settlement for trip-related incidents` | `text-destructive` (value), `text-muted-foreground` (detail) |

Note on destructive color usage: The `destructive` token is used here for the lawsuit exposure value. This is appropriate because it communicates a genuine risk/warning to the decision maker, not decorative emphasis. It is paired with explanatory text so color is not the sole meaning indicator.

**Footer link**

| Element | Content | Token |
|---------|---------|-------|
| Text | `See full pricing details including volume discounts for large districts.` | `text-body-sm text-muted-foreground text-center mt-6` |
| Link | `View Full Pricing` | `text-body-sm font-medium text-primary-700` with ArrowRight, links to `/pricing` |

### Slider Component Specification

The range slider is a custom-styled `<input type="range">` with the following visual treatment:

| Property | Value |
|----------|-------|
| Track | `h-2 rounded-full bg-border` |
| Filled track (left of thumb) | `bg-primary-500` |
| Thumb | `h-5 w-5 rounded-full bg-primary-600 border-2 border-white shadow-md cursor-pointer` |
| Thumb hover | `bg-primary-700 scale-110` transition 150ms |
| Thumb focus | Focus ring per standard (`ring` token, 2px width, 2px offset) |
| Value tooltip | Optional: floating label above thumb showing current value, `bg-foreground text-white text-body-xs rounded-md px-2 py-1` |

### Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| base | Calculator card full-width. Results stacked vertically. Comparison strip stacked. |
| sm | Results in 3-column row. Comparison strip stacked. |
| md | Results in 3-column row. Comparison strip in 3-column row. |
| lg | Card at `max-w-2xl mx-auto`. Increased padding (`p-10`). |

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Section header | `fadeUp` | Standard stagger |
| Calculator card | `cardReveal` | Enters after header |
| Result values | No animation | Values update instantly on slider change for usability |

### Accessibility

- Section: `<section aria-labelledby="pricing-heading">`
- Headline: `<h2 id="pricing-heading">`
- Sliders: `<input type="range">` with `<label>` association. `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` (e.g., "30 students per trip")
- Result values: Wrapped in `<output>` elements with `aria-live="polite"` so screen readers announce changes
- Comparison strip: `<div role="group" aria-label="Cost comparison: SafeTrekr versus status quo">`
- Dollar values: `aria-label` with full context (e.g., "Annual SafeTrekr cost: $9,000")
- The destructive-colored lawsuit value is paired with the label "Lawsuit Exposure" so color is not the sole indicator

---

## Section 7: Compliance & Trust

### Layout

```
+===========================================================================+
|  [bg-card border-y border-border, standard section padding]               |
|  [container max-w-1280px]                                                 |
|                                                                           |
|  [grid lg:grid-cols-12 gap-12 lg:gap-20 items-start]                     |
|                                                                           |
|  +-- TEXT (lg:col-span-5) --------+  +-- BADGES (lg:col-span-7) --------+
|  |                                 |  |                                   |
|  |  [Eyebrow]                      |  |  [grid sm:grid-cols-2 gap-6]      |
|  |  COMPLIANCE & TRUST             |  |                                   |
|  |                                 |  |  +-- BADGE CARD 1 ------+         |
|  |  [Headline]                     |  |  |  [Shield icon]       |         |
|  |  Designed with                  |  |  |  FERPA               |         |
|  |  FERPA Requirements             |  |  |  Designed with FERPA |         |
|  |  in Mind                        |  |  |  requirements in     |         |
|  |                                 |  |  |  mind. Student data  |         |
|  |  [Body]                         |  |  |  handling follows    |         |
|  |  Student data is sensitive.     |  |  |  FERPA guidelines.   |         |
|  |  We built SafeTrekr knowing     |  |  |  Certification in    |         |
|  |  that. Our data handling        |  |  |  progress.           |         |
|  |  practices follow FERPA         |  |  +----------------------+         |
|  |  guidelines for student         |  |                                   |
|  |  education records.             |  |  +-- BADGE CARD 2 ------+         |
|  |  Certification is in            |  |  |  [Lock icon]         |         |
|  |  progress.                      |  |  |  AES-256             |         |
|  |                                 |  |  |  All student data    |         |
|  |  We do not overclaim.           |  |  |  encrypted at rest   |         |
|  |  We do not cut corners.         |  |  |  and in transit.     |         |
|  |  We document everything.        |  |  +----------------------+         |
|  |                                 |  |                                   |
|  |  [Link: primary-700]            |  |  +-- BADGE CARD 3 ------+         |
|  |  View our security practices -> |  |  |  [FileCheck icon]    |         |
|  |                                 |  |  |  SOC 2               |         |
|  |  [Link: primary-700]            |  |  |  Type II audit in    |         |
|  |  Procurement resources ->       |  |  |  progress. Security  |         |
|  |                                 |  |  |  controls documented |         |
|  +------ --------------------------+  |  |  and verified.       |         |
|                                       |  +----------------------+         |
|                                       |                                   |
|                                       |  +-- BADGE CARD 4 ------+         |
|                                       |  |  [Link2 icon]        |         |
|                                       |  |  SHA-256              |         |
|                                       |  |  Tamper-evident       |         |
|                                       |  |  evidence chain.     |         |
|                                       |  |  Every document       |         |
|                                       |  |  hash-verified.      |         |
|                                       |  +----------------------+         |
|                                       |                                   |
|                                       +-----------------------------------+
|                                                                           |
+===========================================================================+
```

### Content

**Text Column**

| Element | Content | Token |
|---------|---------|-------|
| Eyebrow | `COMPLIANCE & TRUST` | `text-eyebrow text-primary-700 uppercase` |
| Headline | `Designed with FERPA Requirements in Mind` | `text-display-md text-foreground` |
| Body paragraph 1 | `Student data is sensitive. We built SafeTrekr knowing that. Our data handling practices follow FERPA guidelines for student education records. Certification is in progress.` | `text-body-lg text-muted-foreground mt-4` |
| Body paragraph 2 | `We do not overclaim. We do not cut corners. We document everything.` | `text-body-lg text-foreground font-medium mt-4` (upgraded from muted to foreground for emphasis on this trust statement) |
| Link 1 | `View our security practices` | `text-body-sm font-medium text-primary-700 mt-6 inline-flex items-center gap-1` with ArrowRight, links to `/security` |
| Link 2 | `Procurement resources` | `text-body-sm font-medium text-primary-700 mt-3 inline-flex items-center gap-1` with ArrowRight, links to `/procurement` |

CRITICAL COPY NOTE: The FERPA language is deliberately measured. Never use "FERPA Compliant" or "FERPA Certified" unless and until certification is achieved. The approved language is "Designed with FERPA requirements in mind" and "Certification in progress." This wording has been reviewed for legal accuracy.

**Badge Cards**

Each badge card: `bg-background rounded-xl border border-border p-6 shadow-sm`. (Note: `bg-background` not `bg-card` because this section already uses `bg-card` as its surface -- cards need to stand out.)

| # | Icon | Title | Description |
|---|------|-------|-------------|
| 1 | `Shield` (24px, `primary-700`) | `FERPA` | `Designed with FERPA requirements in mind. Student data handling follows FERPA guidelines. Certification in progress.` |
| 2 | `Lock` (24px, `primary-700`) | `AES-256 Encryption` | `All student data encrypted at rest and in transit using AES-256 standard.` |
| 3 | `FileCheck` (24px, `primary-700`) | `SOC 2 Type II` | `Type II audit in progress. Security controls documented and verified by independent auditors.` |
| 4 | `Link2` (24px, `primary-700`) | `SHA-256 Evidence Chain` | `Tamper-evident evidence chain. Every document in every safety binder is hash-verified and immutable.` |

Card title: `text-heading-sm text-foreground mt-3`. Card description: `text-body-sm text-muted-foreground mt-2`.

### COPPA Note

An additional line beneath the badge cards grid, outside the grid:

| Element | Content | Token |
|---------|---------|-------|
| COPPA note | `SafeTrekr does not collect data directly from students under 13. All student information is provided by authorized school administrators in accordance with COPPA guidelines.` | `text-body-sm text-muted-foreground mt-8 max-w-prose` |

### Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| base | Single column. Text block first, then badge cards stacked vertically. |
| sm | Text block first, then badge cards in 2-column grid. |
| lg | 2-column layout. Text left (`col-span-5`), badge cards right (`col-span-7`). |

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Text column | `fadeUp` | Standard staggered reveal |
| Badge cards | `staggerContainer + cardReveal` | Cards stagger at 80ms |

### Accessibility

- Section: `<section aria-labelledby="compliance-heading">`
- Headline: `<h2 id="compliance-heading">`
- Badge cards: Each title is `<h3>`. Cards are informational (not interactive), so no `<a>` wrapper.
- Icons: Decorative (`aria-hidden="true"`)
- FERPA badge: The text "Certification in progress" must remain visible and not be hidden or de-emphasized -- it is a legal accuracy requirement

---

## Section 8: Common Questions (FAQ)

### Layout

```
+===========================================================================+
|  [bg-background, standard section padding]                                |
|  [container max-w-3xl mx-auto]                                            |
|                                                                           |
|  [centered header]                                                        |
|  [Eyebrow] COMMON QUESTIONS                                               |
|  [Headline] Everything Your Board                                          |
|             Will Ask                                                       |
|                                                                           |
|  [FAQSection / shadcn Accordion, mt-12]                                   |
|                                                                           |
|  +-----------------------------------------------------------------------+
|  |  [v] Is SafeTrekr FERPA compliant?                                    |
|  +-----------------------------------------------------------------------+
|  |  [v] What happens to student data after the trip?                     |
|  +-----------------------------------------------------------------------+
|  |  [v] Can our school district use SafeTrekr for all field trips?       |
|  +-----------------------------------------------------------------------+
|  |  [v] How does SafeTrekr handle parent consent?                        |
|  +-----------------------------------------------------------------------+
|  |  [v] What if a field trip destination changes at the last minute?     |
|  +-----------------------------------------------------------------------+
|  |  [v] How does per-student pricing work for large groups?              |
|  +-----------------------------------------------------------------------+
|  |  [v] Can board members access the safety binder directly?             |
|  +-----------------------------------------------------------------------+
|  |  [v] Does SafeTrekr replace our existing field trip approval process? |
|  +-----------------------------------------------------------------------+
|  |  [v] How quickly do we receive the safety binder?                     |
|  +-----------------------------------------------------------------------+
|  |  [v] What government data sources does SafeTrekr use?                 |
|  +-----------------------------------------------------------------------+
|                                                                           |
+===========================================================================+
```

### Content

**Section Header**

| Element | Content | Token |
|---------|---------|-------|
| Eyebrow | `COMMON QUESTIONS` | `text-eyebrow text-primary-700 uppercase text-center` |
| Headline | `Everything Your Board Will Ask` | `text-display-md text-foreground text-center` |

**FAQ Items**

Uses `FAQSection` component with `type="single" collapsible`. Trigger: `text-heading-sm text-foreground`. Content: `text-body-md text-muted-foreground`. Chevron: rotates 180deg on open (200ms, ease-default).

| # | Question | Answer |
|---|----------|--------|
| 1 | `Is SafeTrekr FERPA compliant?` | `SafeTrekr is designed with FERPA requirements in mind. Our data handling practices follow FERPA guidelines for student education records, including access controls, data minimization, and secure storage. We are currently pursuing formal FERPA certification. We believe in transparency -- we will never claim a certification we have not earned.` |
| 2 | `What happens to student data after the trip?` | `Student data is retained only for the documentation period required by your district's records retention policy. After that period, data is purged with a verifiable deletion record. You control the retention timeline. We provide cryptographic proof of deletion upon request.` |
| 3 | `Can our school district use SafeTrekr for all field trips?` | `Yes. SafeTrekr handles field trips of every type -- from a single-day museum visit to a multi-day out-of-state educational trip. Every trip gets the same 17-section professional safety review, regardless of distance or duration. Volume pricing is available for districts with 25 or more trips per year.` |
| 4 | `How does SafeTrekr handle parent consent?` | `SafeTrekr includes a Parent/Guardian Portal where parents can view trip safety details you choose to share. This is separate from your district's existing permission slip process. SafeTrekr provides the professional safety documentation; your district maintains its consent workflow. Parents see safety information -- not raw risk data.` |
| 5 | `What if a field trip destination changes at the last minute?` | `Submit the new destination and our team will expedite a review. For minor changes (same city, different venue), we can often turn around an updated review within 24-48 hours. The original binder is versioned, not replaced -- you maintain a complete audit trail of all destination changes.` |
| 6 | `How does per-student pricing work for large groups?` | `Pricing is $15 per student per trip. A field trip with 30 students costs $450. A field trip with 100 students costs $1,500. Volume discounts apply for districts committing to 25 or more trips per year. Contact us for district-wide pricing that covers all schools in your system.` |
| 7 | `Can board members access the safety binder directly?` | `Yes. You can generate a read-only link for board members to review any safety binder. The binder includes the full 17-section review, risk intelligence summary, emergency response plan, and SHA-256 evidence chain verification. Board members see exactly what you see.` |
| 8 | `Does SafeTrekr replace our existing field trip approval process?` | `No. SafeTrekr supplements your existing process with professional safety analysis and documentation. Your district keeps its approval workflow, permission slip procedures, and chain of command. SafeTrekr adds the evidence layer that proves your district took every reasonable precaution.` |
| 9 | `How quickly do we receive the safety binder?` | `Standard turnaround is 3-5 business days from trip submission. For field trips within the continental United States to well-documented destinations, turnaround is often faster. Rush processing is available for time-sensitive trips.` |
| 10 | `What government data sources does SafeTrekr use?` | `Our Risk Intelligence Engine aggregates data from 5 government sources: NOAA (weather and natural hazards), USGS (seismic and geological data), CDC (health advisories and disease surveillance), GDACS (global disaster alerts), and ReliefWeb (humanitarian situation reports). This data is scored using Monte Carlo simulation to produce a quantified risk profile for every destination.` |

### JSON-LD Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is SafeTrekr FERPA compliant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SafeTrekr is designed with FERPA requirements in mind..."
      }
    }
  ]
}
```

All 10 Q&A pairs are included in the FAQPage JSON-LD markup. This is embedded as a `<script type="application/ld+json">` in the page head.

### Responsive Behavior

The FAQ section is constrained to `max-w-3xl` (768px) and centered at all breakpoints. No layout changes are needed -- the accordion naturally adapts to available width.

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Section header | `fadeUp` | Standard stagger |
| FAQ items | `staggerContainer` | Items fade up at 60ms stagger |
| Accordion open/close | Chevron rotation | 200ms, ease-default |

### Accessibility

- Section: `<section aria-labelledby="faq-heading">`
- Headline: `<h2 id="faq-heading">`
- Accordion: shadcn/ui Accordion with `type="single" collapsible`
- Each trigger: `aria-expanded="true|false"`, `aria-controls="content-{id}"`
- Each content panel: `role="region"`, `aria-labelledby="trigger-{id}"`
- Keyboard: Enter/Space toggles, arrow keys navigate between triggers
- Focus visible: Standard ring treatment on triggers

---

## Section 9: Conversion CTA Banner

### Layout

```
+===========================================================================+
|  [CTABand variant="dark": bg-secondary, standard CTA padding]            |
|  [container max-w-1280px, text-center]                                    |
|                                                                           |
|  [text-display-md, dark-text-primary]                                     |
|  Ready to Protect Your                                                     |
|  Next Field Trip?                                                          |
|                                                                           |
|  [text-body-lg, dark-text-secondary, max-w-prose mx-auto]                |
|  Join districts that document every precaution. Download a sample          |
|  binder to see the deliverable, or schedule a demo to discuss             |
|  your district's needs.                                                    |
|                                                                           |
|  [CTA group: flex gap-4, justify-center]                                  |
|  [ Get a Demo ]  [ Download Sample Binder ]                               |
|  [primary-on-dark] [secondary variant on dark: ghost with white border]   |
|                                                                           |
+===========================================================================+
```

### Content

| Element | Content | Token |
|---------|---------|-------|
| Headline | `Ready to Protect Your Next Field Trip?` | `text-display-md text-[var(--color-dark-text-primary)] text-center` |
| Body | `Join districts that document every precaution. Download a sample binder to see the deliverable, or schedule a demo to discuss your district's needs.` | `text-body-lg text-[var(--color-dark-text-secondary)] text-center max-w-prose mx-auto mt-4` |
| Primary CTA | `Get a Demo` | `Button variant="primary-on-dark" size="lg"`, links to `/demo` |
| Secondary CTA | `Download Sample Binder` | `Button variant="secondary" size="lg"` on dark (white text, white/20 border, hover white/10 bg), links to `/resources/sample-binders/k12-field-trip` |

Note: In the CTA banner, the priority order flips -- "Get a Demo" becomes primary because by this point in the page, the visitor has seen the binder preview and the pricing calculator. The next logical step for a convinced evaluator is to request a conversation.

### Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| base | Stacked. Headline, body, then CTAs stacked vertically (full-width buttons). |
| sm (640px+) | CTAs horizontal (`flex-row gap-4 justify-center`). |

### Spacing

| Property | Value |
|----------|-------|
| Section padding | `py-20 lg:py-28` |
| Headline to body | `mt-4` |
| Body to CTAs | `mt-8` |

### Animation

| Element | Preset | Details |
|---------|--------|---------|
| Entire section | `fadeUp` | Heading + body + buttons staggered at 100ms |

### Accessibility

- Section: `<section aria-labelledby="cta-heading">`
- Headline: `<h2 id="cta-heading">`
- Both CTAs: Clear, descriptive button text. No additional `aria-label` needed -- text is self-descriptive.
- `data-theme="dark"` on section wrapper for token override activation

---

## Page-Level Specifications

### In-Page Navigation (Sticky Anchor Bar)

This page exceeds 3 viewports in length, so an in-page navigation bar is warranted per the IA specification.

```
+===========================================================================+
|  [Sticky below header when scrolled past hero, z-sticky]                  |
|  [bg-card/95 backdrop-blur-sm border-b border-border shadow-sm]           |
|                                                                           |
|  [container, flex gap-6 overflow-x-auto, hide-scrollbar]                 |
|                                                                           |
|  The Problem   How It Works   Sample Binder   Pricing   Compliance   FAQ |
|  [pill links, text-body-sm, active: primary-700 font-semibold]           |
|                                                                           |
+===========================================================================+
```

| Anchor | Target Section |
|--------|---------------|
| The Problem | Section 3 |
| How It Works | Section 4 |
| Sample Binder | Section 5 |
| Pricing | Section 6 |
| Compliance | Section 7 |
| FAQ | Section 8 |

Behavior:
- Appears after scrolling past the hero (Section 1)
- Active state tracks current visible section via Intersection Observer
- Smooth scroll on click (`scroll-behavior: smooth` with `scroll-margin-top` accounting for header + anchor bar heights)
- Mobile: Horizontally scrollable, no wrapping. Active item auto-scrolls into view.
- `<nav aria-label="Page sections">` with `<a>` elements

### SEO and Structured Data

**Title**: `Trip Safety for K-12 Schools & Districts -- SafeTrekr`
**Description**: `Every field trip reviewed by a safety analyst. Per-student pricing starting at $15. Board-ready documentation that proves your district took every reasonable precaution.`
**Canonical**: `https://safetrekr.com/solutions/k12`
**OG Type**: `website`
**OG Image**: Custom K-12 OG image showing the binder preview and "$15/student" pricing badge

**JSON-LD**: FAQPage schema (defined in Section 8)

**Breadcrumb JSON-LD**:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://safetrekr.com/" },
    { "@type": "ListItem", "position": 2, "name": "Solutions", "item": "https://safetrekr.com/solutions" },
    { "@type": "ListItem", "position": 3, "name": "K-12 Schools & Districts" }
  ]
}
```

### URL Redirects

Per the IA specification, these redirects must be configured:

| Source | Destination | Type |
|--------|------------|------|
| `/solutions/k-12` | `/solutions/k12` | 301 Permanent |
| `/solutions/schools` | `/solutions/k12` | 301 Permanent |
| `/k12` | `/solutions/k12` | 301 Permanent |

### Performance Budget

| Metric | Target | Notes |
|--------|--------|-------|
| LCP | < 2.5s | Hero headline is LCP element. No animation delay on headline. |
| CLS | < 0.1 | All images/visuals have explicit dimensions. Font display swap with matched fallback. |
| FID | < 100ms | Pricing calculator uses client-side state only. No network dependency for interactions. |
| Total page weight | < 500KB | Excluding fonts (shared across site). |
| Largest image | < 80KB | Binder preview thumbnails optimized as WebP. |

### Heading Hierarchy

```
<h1> Every Field Trip Deserves a Safety Analyst.
  <h2> [Proof Strip -- no heading, uses aria-label on section]
  <h2> What Schools Currently Rely On
    <h3> The Board Liability Question
  <h2> Professional Trip Safety for Every Field Trip
    <h3> Analyst Safety Review
    <h3> Risk Intelligence Engine
    <h3> Trip Safety Binder
    <h3> Parent/Guardian Portal
  <h2> See What Your Superintendent Will Review
  <h2> $15 Per Student. Do the Math.
    <h3> Calculate Your District's Cost
  <h2> Designed with FERPA Requirements in Mind
    <h3> FERPA
    <h3> AES-256 Encryption
    <h3> SOC 2 Type II
    <h3> SHA-256 Evidence Chain
  <h2> Everything Your Board Will Ask
  <h2> Ready to Protect Your Next Field Trip?
```

### Focus Order

Tab order follows the visual reading order top-to-bottom, left-to-right:

1. Skip-nav link (hidden until focused)
2. Site header navigation links
3. Breadcrumb links
4. Hero pricing badge (if interactive -- otherwise skip)
5. Hero primary CTA: Download K-12 Sample Binder
6. Hero secondary CTA: Get a Demo
7. In-page navigation anchors (when visible)
8. Feature card links (Section 4, left-to-right, top-to-bottom)
9. Sample Binder download CTA (Section 5)
10. Pricing calculator sliders and results (Section 6)
11. View Full Pricing link (Section 6)
12. Security practices link (Section 7)
13. Procurement resources link (Section 7)
14. FAQ accordion triggers (Section 8, top-to-bottom)
15. Get a Demo CTA (Section 9)
16. Download Sample Binder CTA (Section 9)
17. Footer navigation links

### Keyboard Navigation

| Key | Behavior |
|-----|----------|
| Tab | Moves forward through focusable elements in the order above |
| Shift+Tab | Moves backward |
| Enter/Space | Activates buttons and links. Opens/closes accordion items. |
| Arrow Left/Right | Adjusts slider value by step increment |
| Arrow Up/Down | Navigates between FAQ accordion triggers when focused |
| Escape | Closes any open mega-menu or mobile navigation |
| Home/End | On sliders, jumps to min/max value |

### Reduced Motion Behavior

When `prefers-reduced-motion: reduce` is active:

| Element | Default Behavior | Reduced Motion Behavior |
|---------|-----------------|------------------------|
| Section scroll reveals | `fadeUp`, `cardReveal` | Elements visible immediately, no animation |
| Document preview fan | `documentStack` stagger | All pages visible in final position |
| StatCard counters | Count from 0 to value | Final value shown immediately |
| Slider thumb | Scale on hover | No scale transform, color change only |
| Card hover | `translateY(-2px)` + shadow | Shadow change only, no transform |
| Accordion chevron | 180deg rotation | Instant rotation (opacity toggle) |
| Checklist items | `checklistReveal` stagger | All items visible immediately |

### Cross-Links from This Page

| Destination | Location on Page | Context |
|-------------|-----------------|---------|
| `/resources/sample-binders/k12-field-trip` | Hero CTA, Binder Preview CTA, Final CTA | Primary conversion action |
| `/demo` | Hero CTA, Final CTA | Secondary conversion action |
| `/platform/analyst-review` | Feature card 1 | Feature detail |
| `/platform/risk-intelligence` | Feature card 2 | Feature detail |
| `/platform/safety-binder` | Feature card 3 | Feature detail |
| `/platform/mobile-app` | Feature card 4 | Feature detail |
| `/pricing` | Calculator footer link | Full pricing details |
| `/security` | Compliance section link | Security practices |
| `/procurement` | Compliance section link | Procurement resources |

### Internal Links TO This Page

Per the IA, this page should be linked from:
- Homepage segment routing cards
- Solutions section landing page (`/solutions`)
- Primary navigation Solutions mega-menu
- Footer navigation
- Blog posts tagged `k12-compliance`
- Pricing page segment scenarios

---

## Component Inventory

Summary of all design system components used on this page:

| Component | Count | Section(s) |
|-----------|-------|------------|
| `SiteHeader` | 1 | Global |
| `SiteFooter` | 1 | Global |
| `Badge` | 3 | Hero (pricing badge, board ready), Binder Preview |
| `Eyebrow` | 7 | All sections except Proof Strip and CTA Banner |
| `Button` (primary) | 3 | Hero, Binder Preview, Final CTA |
| `Button` (secondary) | 2 | Hero, Final CTA |
| `Button` (primary-on-dark) | 1 | Final CTA |
| `StatCard` | 5 | Proof Strip |
| `TrustMetricsStrip` | 1 | Section 2 |
| `FeatureCard` | 4 | Section 4 |
| `DocumentPreview` | 1 | Hero |
| `DarkAuthoritySection` | 2 | Sections 3 and 9 |
| `CTABand` (dark variant) | 1 | Section 9 |
| `FAQSection` | 1 | Section 8 |
| `Divider` (section) | 1 | Calculator card internal |
| Custom: Pain Card | 3 | Section 3 |
| Custom: Liability Comparison | 1 | Section 3 |
| Custom: Pricing Calculator | 1 | Section 6 |
| Custom: Binder Thumbnails | 1 | Section 5 |
| Custom: Compliance Badge Card | 4 | Section 7 |
| Custom: In-Page Nav | 1 | Sticky anchor bar |

### New Components Required

| Component | Scope | Reusability |
|-----------|-------|-------------|
| `PricingCalculator` | Inline calculator with dual sliders, live results, comparison strip | Reusable on pricing page with different defaults |
| `PainCard` | Dark-surface stat card with icon, large number, label, and body | Reusable on other segment pages (church, higher-ed, corporate) |
| `LiabilityComparison` | Two-column before/after comparison on dark surface | Reusable on other segment pages with different content |
| `BinderThumbnailFan` | Fanned/offset page thumbnails with labels | Reusable on binder preview sections across segment pages |
| `ComplianceBadgeCard` | Icon + title + description card for compliance certifications | Reusable on security page, other segment pages, procurement page |
| `InPageNav` | Sticky anchor navigation with active state tracking | Reusable on any long page (How It Works, pricing, other segments) |

---

## Design Rationale Ledger

| Decision | User Need | Targeted KPI | Evidence Source | Confidence |
|----------|-----------|-------------|-----------------|------------|
| Per-student pricing in hero badge | Board members need cost framing immediately | Time to understand pricing (< 5s) | IA content inventory: "$15/student as primary framing" | High |
| Dark section for liability comparison | Board members converting on fear of liability exposure | Demo request conversion rate | IA: "Board liability comparison is the key conversion lever" | High |
| Sample binder as primary CTA over demo | Superintendents evaluate documents before meetings | Binder download rate as leading indicator | IA: CTA priority order lists binder first | High |
| Honest FERPA language | Risk managers need accurate compliance claims | Trust score, reduced legal risk | IA: "Never claim FERPA Compliant without certification" | Non-negotiable |
| Guardian portal as featured card | Parents as indirect buyers; trust signal for principals | Parent satisfaction, principal adoption | IA: "Guardian portal is a differentiator for this segment" | High |
| Interactive pricing calculator | Budget holders need self-service cost modeling | Time on page, pricing page click-through | TAM context: $39.5M segment, per-student model | Medium |
| Pricing CTA flip in final banner | By section 9, visitor has seen binder preview | Final CTA click-through rate | Conversion funnel logic: awareness -> interest -> action | Medium |

---

## Implementation Notes

### File Location

```
app/
  solutions/
    k12/
      page.tsx                    # Main page component (SSG)
      pricing-calculator.tsx      # Client component (interactive)
      metadata.ts                 # Exported metadata + JSON-LD
```

### Data Strategy

- Page: Statically generated (SSG). No dynamic data at build time.
- Pricing Calculator: Client-side state only (`useState` for slider values, computed results). No API calls.
- FAQ: Static content, no CMS dependency at launch.
- Sample binder download: Links to gated download flow at `/resources/sample-binders/k12-field-trip`.

### Client Components

Only the following require `'use client'`:

1. `PricingCalculator` -- slider interaction and live result updates
2. `InPageNav` -- Intersection Observer for active section tracking
3. `FAQSection` -- Accordion open/close state (via shadcn/ui)

All other sections are server components for optimal SSG performance.

### Analytics Events

| Event Name | Trigger | Payload |
|------------|---------|---------|
| `k12_hero_cta_click` | Hero primary CTA click | `{ cta: "download_binder" }` |
| `k12_hero_demo_click` | Hero secondary CTA click | `{ cta: "get_demo" }` |
| `k12_feature_card_click` | Feature card click | `{ feature: "analyst_review" | "risk_intelligence" | "safety_binder" | "guardian_portal" }` |
| `k12_binder_preview_download` | Binder preview CTA click | `{ cta: "download_binder", section: "binder_preview" }` |
| `k12_calculator_interact` | First slider interaction | `{ students: number, trips: number }` |
| `k12_calculator_result_view` | Calculator result viewed (5s dwell) | `{ annual_cost: number, per_student: 15, per_trip: number }` |
| `k12_pricing_link_click` | View Full Pricing link click | `{ section: "calculator" }` |
| `k12_security_link_click` | Security practices link click | `{ section: "compliance" }` |
| `k12_procurement_link_click` | Procurement link click | `{ section: "compliance" }` |
| `k12_faq_expand` | FAQ item opened | `{ question_index: number, question: string }` |
| `k12_final_cta_demo` | Final CTA demo click | `{ cta: "get_demo", section: "final_cta" }` |
| `k12_final_cta_binder` | Final CTA binder click | `{ cta: "download_binder", section: "final_cta" }` |
| `k12_inpage_nav_click` | In-page nav anchor click | `{ anchor: string }` |

All event names follow snake_case convention per the design system analytics specification.