# Information Architecture: SafeTrekr Marketing Site

**Version**: 1.0.0
**Date**: 2026-03-24
**Author**: Principal Information Architect
**Purpose**: Implementation-ready IA specification for mockup design and development
**Scope**: Complete sitemap, navigation, page-by-page content inventory (top 8 pages), user flows, URL structure, content types

---

## 1. Complete Sitemap

### 1.1 Full URL Inventory (Launch)

Every page, its hierarchy level, page type, and click distance from homepage.

```
safetrekr.com/
|
+-- HOMEPAGE
|   /                                          L0  Core Page          0 clicks
|
+-- PLATFORM (Product Capabilities)
|   /platform                                  L1  Section Landing    1 click
|   /platform/analyst-review                   L2  Feature Page       2 clicks
|   /platform/risk-intelligence                L2  Feature Page       2 clicks
|   /platform/safety-binder                    L2  Feature Page       2 clicks
|   /platform/mobile-app                       L2  Feature Page       2 clicks
|   /platform/monitoring                       L2  Feature Page       2 clicks
|   /platform/compliance                       L2  Feature Page       2 clicks
|
+-- SOLUTIONS (Segment Landing Pages)
|   /solutions                                 L1  Section Landing    1 click
|   /solutions/k12                             L2  Segment Landing    1-2 clicks
|   /solutions/higher-education                L2  Segment Landing    1-2 clicks
|   /solutions/churches                        L2  Segment Landing    1-2 clicks
|   /solutions/corporate                       L2  Segment Landing    1-2 clicks
|
+-- HOW IT WORKS
|   /how-it-works                              L1  Core Page          1 click
|
+-- PRICING
|   /pricing                                   L1  Core Page          1 click
|
+-- RESOURCES (Content Hub)
|   /resources                                 L1  Section Landing    1 click
|   /resources/case-studies                    L2  Index Page         2 clicks
|   /resources/case-studies/[slug]             L3  Case Study Detail  3 clicks
|   /resources/guides                          L2  Index Page         2 clicks
|   /resources/guides/[slug]                   L3  Guide Detail       3 clicks
|   /resources/sample-binders                  L2  Index Page         2 clicks
|   /resources/sample-binders/k12-field-trip   L3  Sample Binder      3 clicks
|   /resources/sample-binders/mission-trip     L3  Sample Binder      3 clicks
|   /resources/sample-binders/corporate-travel L3  Sample Binder      3 clicks
|   /resources/sample-binders/study-abroad     L3  Sample Binder      3 clicks
|   /resources/webinars                        L2  Index Page         2 clicks
|   /resources/webinars/[slug]                 L3  Webinar Detail     3 clicks
|   /resources/roi-calculator                  L2  Interactive Tool   2 clicks
|   /resources/faq                             L2  FAQ Page           2 clicks
|
+-- BLOG (SEO Content Hub)
|   /blog                                      L1  Blog Index         1 click
|   /blog/[slug]                               L2  Blog Post          2 clicks
|   /blog/category/[category]                  L2  Category Index     2 clicks
|   /blog/tag/[tag]                            L2  Tag Index          2 clicks
|
+-- COMPARE (Comparison Pages -- Phase 2)
|   /compare                                   L1  Comparison Hub     2 clicks
|   /compare/diy-spreadsheets                  L2  Comparison Page    2 clicks
|   /compare/logistics-apps                    L2  Comparison Page    2 clicks
|   /compare/travel-management                 L2  Comparison Page    2 clicks
|
+-- COMPLIANCE (Regulatory Guides -- Phase 2)
|   /compliance/ferpa                          L2  Compliance Guide   2 clicks
|   /compliance/clery-act                      L2  Compliance Guide   2 clicks
|   /compliance/coppa                          L2  Compliance Guide   2 clicks
|   /compliance/gdpr                           L2  Compliance Guide   2 clicks
|
+-- GLOSSARY (Knowledge Base -- Phase 3)
|   /glossary                                  L1  Glossary Index     2 clicks
|   /glossary/[term]                           L2  Glossary Term      3 clicks
|
+-- COMPANY
|   /about                                     L1  Core Page          1 click
|   /about/analysts                            L2  Core Page          2 clicks
|   /security                                  L1  Core Page          2 clicks
|   /procurement                               L1  Core Page          1 click (utility nav)
|   /contact                                   L1  Core Page          1 click (utility nav)
|
+-- LEGAL
|   /legal/terms                               L2  Legal Page         2 clicks
|   /legal/privacy                             L2  Legal Page         2 clicks
|   /legal/dpa                                 L2  Legal Page         2 clicks
|   /legal/acceptable-use                      L2  Legal Page         2 clicks
|   /legal/cookies                             L2  Legal Page         2 clicks
|
+-- UTILITY PAGES
|   /demo                                      L1  Form Page          1 click (CTA)
|   /get-started                               L1  Form Page          1 click
|   /partners                                  L1  Core Page          2 clicks
|   /status                                    --  External Redirect  2 clicks
|
+-- CAMPAIGN LANDING PAGES (noindex)
|   /lp/[campaign-slug]                        --  Landing Page        Direct
|
+-- SYSTEM PAGES
    /404                                       --  Error Page          --
    /500                                       --  Error Page          --
    /sitemap.xml                               --  XML Sitemap         --
    /robots.txt                                --  Robots              --
```

### 1.2 Page Count Summary

| Section | Pages at Launch | 6 Months | 12 Months |
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

### 1.3 Hierarchy Depth

| Level | Content Type | Example | Click Distance |
|:---:|---|---|:---:|
| L0 | Homepage | `/` | 0 |
| L1 | Section landing | `/platform`, `/solutions`, `/pricing` | 1 |
| L2 | Detail page | `/platform/analyst-review`, `/solutions/k12` | 1-2 |
| L3 | Content item | `/resources/case-studies/springfield-unified` | 2-3 |
| L4 | Filtered view | `/blog/category/k12-compliance` | 2-3 |

**Maximum depth**: 4 levels. **Maximum clicks to any content**: 3. **Average clicks to conversion-critical content**: 2.

---

## 2. Navigation Structure

### 2.1 Navigation Systems

| System | Purpose | Visibility | Items |
|--------|---------|------------|-------|
| **Primary Nav** | Main site navigation for evaluators and decision-makers | All pages, sticky header | 5 items + dropdowns |
| **Utility Nav** | Quick-access for procurement officers and returning visitors | All pages, top-right | 3 items |
| **Footer Nav** | Comprehensive site links, legal, trust signals | All pages, bottom | 30-35 links |
| **Mobile Nav** | Drawer-based primary + utility | Mobile/tablet (<1024px) | Same items, vertical accordion |
| **In-Page Nav** | Section anchors on long pages | Long pages (>3 viewports) | 4-8 anchors |
| **Breadcrumbs** | Location indicator and hierarchy wayfinding | L2+ pages | Dynamic |
| **Contextual Nav** | Related content and next-step prompts | Content pages | 3-6 links |
| **Campaign Nav** | Stripped nav for landing pages (logo + CTA only) | `/lp/*` pages | 2 items |

### 2.2 Primary Navigation (Desktop)

```
+-------+                                                                  +-----+
| Logo  |  Platform v   Solutions v   How It Works   Pricing   Resources v | For Procurement  Log In  [ Get a Demo ]
+-------+                                                                  +-----+
```

**5 primary items + 3 utility items (including CTA button)**

| Attribute | Value |
|-----------|-------|
| Position | `sticky top-0`, always visible on scroll |
| Height | 64px desktop, 56px mobile |
| Background | `bg-white/95 backdrop-blur-sm`, `border-b border-neutral-200` |
| Logo | SVG, links to `/`, `aria-label="SafeTrekr home"` |
| Active state | `font-semibold text-primary-600`, underline indicator |
| Hover state | `text-primary-500`, dropdown on hover (desktop) / tap (touch) |
| CTA button | `bg-primary-600 text-white` pill, persistent all viewports |
| Scroll behavior | Shadow appears on scroll (`shadow-sm`) |

#### 2.2.1 Platform Mega-Menu

```
+--------------------------------------------------------------------------+
| PLATFORM                                                                 |
|--------------------------------------------------------------------------|
|                                                                          |
|  THE SAFETREKR PLATFORM          CAPABILITIES                            |
|  +------------------------+                                              |
|  | [Platform Overview img]|     Analyst Safety Review                    |
|  | See how SafeTrekr      |     17-section professional review           |
|  | protects every trip    |     of every trip plan                       |
|  |                        |                                              |
|  | -> Explore Platform    |     Risk Intelligence Engine                 |
|  +------------------------+     Monte Carlo scoring from 5 govt sources  |
|                                                                          |
|                                 Trip Safety Binder                       |
|                                 Audit-ready documentation                |
|                                 with hash-chain integrity                |
|                                                                          |
|                                 Mobile Field Operations                  |
|                                 Live tracking, geofencing,               |
|                                 rally points, SMS broadcast              |
|                                                                          |
|                                 Real-Time Monitoring                     |
|                                 Geofence alerts, muster check-ins,      |
|                                 participant location visibility          |
|                                                                          |
|                                 Compliance & Evidence                    |
|                                 FERPA, SOC 2, GDPR, tamper-evident      |
|                                 audit trail with purge proofs            |
+--------------------------------------------------------------------------+
```

- **Layout**: 2-column. Left: featured card (280px) linking to `/platform`. Right: 6-item list with icon (24x24) + title (link) + 1-line description.
- **Keyboard**: Arrow keys navigate items. Escape closes. Tab moves through items sequentially. Focus trapped within panel.

#### 2.2.2 Solutions Mega-Menu

```
+--------------------------------------------------------------------------+
| SOLUTIONS                                                                |
|--------------------------------------------------------------------------|
|                                                                          |
|  BY ORGANIZATION TYPE                                                    |
|                                                                          |
|  [school icon]                   [university icon]                       |
|  K-12 Schools & Districts        Higher Education                        |
|  FERPA-compliant trip safety     Study abroad, Clery Act,                |
|  for field trips and travel      international program safety            |
|                                                                          |
|  [church icon]                   [building icon]                         |
|  Churches & Mission Orgs         Corporate & Sports Teams                |
|  Mission trip safety with        Duty of care compliance                 |
|  volunteer and youth protections for business and team travel            |
|                                                                          |
|  ----------------------------------------------------------------        |
|  "Every trip reviewed. Every risk scored. Every document audit-ready."   |
|  [ See How It Works -> ]                                                 |
+--------------------------------------------------------------------------+
```

- **Layout**: 2x2 grid of segment cards. Bottom: tagline + CTA link to `/how-it-works`.
- **Each card**: Icon (32x32), segment name (link to segment page), 2-line description.

#### 2.2.3 Resources Dropdown

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

- **Layout**: Single-column link list. Blog separated by divider.
- **Each item**: Text link, no icons, 14px type.

### 2.3 Utility Navigation

| Item | URL | Visual Treatment |
|------|-----|------------------|
| For Procurement | `/procurement` | Text link, `text-sm text-neutral-600` |
| Log In | `https://app.safetrekr.com` | Text link, `text-sm text-neutral-600`, `target="_blank"` |
| Get a Demo | `/demo` | `bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium` |

### 2.4 Footer Navigation

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
+---------------------------------------------------------------------------+
| [Logo]  [LinkedIn] [Twitter/X]                                            |
|                                                                           |
| (c) 2026 SafeTrekr. All rights reserved.                                 |
| SOC 2 | FERPA | GDPR | AES-256 | SHA-256 Evidence Chain                  |
|                                                                           |
| Data sourced from: NOAA | USGS | CDC | GDACS | ReliefWeb                 |
+---------------------------------------------------------------------------+
```

- **Layout**: 6-column grid at desktop (`grid-cols-6`), 2-column at tablet, single column at mobile.
- **Trust signals row**: Compliance badges as icons with tooltips. Data source logos.
- **Markup**: `<footer>` with `<nav aria-label="Footer navigation">`. Each column is a `<section>` with `<h3>` heading.

### 2.5 Mobile Navigation (Drawer)

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

- **Trigger**: Hamburger icon, top-right of mobile header.
- **Behavior**: Slides in from right, 300ms ease-out. Body scroll locked. Backdrop overlay `bg-black/50`. Sections expand/collapse as accordions (single-expand mode).
- **Close**: X button, Escape key, backdrop click, navigation to new page.
- **Accessibility**: `role="dialog"`, `aria-modal="true"`, `aria-label="Main navigation"`. Focus trapped. Return focus to hamburger on close.
- **Maximum taps to any page**: 2 from drawer open.

### 2.6 Breadcrumb Strategy

| Page Type | Breadcrumb Pattern |
|-----------|-------------------|
| L1 Section landing | No breadcrumb shown |
| L2 Feature page | `Home > Platform > [Feature Name]` |
| L2 Segment page | `Home > Solutions > [Segment Name]` |
| L3 Case study | `Home > Resources > Case Studies > [Title]` |
| L3 Guide detail | `Home > Resources > Guides > [Title]` |
| L3 Blog post | `Home > Blog > [Post Title]` |
| L2 Blog category | `Home > Blog > [Category Name]` |
| L3 Comparison page | `Home > Compare > [Title]` |
| L3 Compliance guide | `Home > Compliance > [Regulation Name]` |
| L3 Glossary term | `Home > Glossary > [Term]` |
| L2 Legal page | `Home > Legal > [Policy Name]` |

**Rules**:
- Breadcrumbs render on all L2+ pages
- Homepage and L1 section landings do not show breadcrumbs
- Mobile (<640px): Collapse to `< Back to [Parent]` link
- Every breadcrumb page emits `BreadcrumbList` JSON-LD
- Current page: last item, rendered as text (not link), with `aria-current="page"`
- Markup: `<nav aria-label="Breadcrumb">` wrapping `<ol>`

---

## 3. Page-by-Page Content Inventory (Top 8 Pages)

Each page specification includes: purpose, target audience, content sections (in order), user actions available, CTAs, and cross-links.

---

### 3.1 Homepage (`/`)

**Purpose**: Primary conversion narrative for all buyer segments. Communicates SafeTrekr's unique mechanism within 5 seconds. Routes visitors to the correct segment within 1 click.

**Target Audience**: All prospects -- trip coordinators, risk managers, IT evaluators, procurement officers, executives/board members.

**Page Type**: Core Page (SSG)
**Hierarchy Level**: L0
**JSON-LD**: Organization, SoftwareApplication, AggregateOffer

#### Content Sections (in scroll order)

| # | Section | Content | Design Notes |
|---|---------|---------|--------------|
| 1 | **Hero** | Headline naming the mechanism ("Every trip reviewed by a safety analyst. Every risk scored from government intelligence. Every decision documented."). Sub-headline with outcome framing. Primary CTA: "See a Sample Safety Binder". Secondary CTA: "Request a Demo". Background: MapLibre map composition with animated route line (lazy-loaded). | 5-col text / 7-col visual on desktop. Headline visible immediately (no animation delay -- LCP critical). Map loads progressively: static fallback > interactive > animated crossfade. |
| 2 | **Proof Strip** | 5 verifiable metrics in a horizontal strip: "5 Government Intel Sources" / "17 Safety Review Sections" / "3-5 Day Turnaround" / "AES-256 Encryption" / "SHA-256 Evidence Chain". Government source logos below (NOAA, USGS, CDC, GDACS, ReliefWeb). | Full-width bar. No fabricated testimonials. Every metric verifiable from the product. |
| 3 | **Problem / Mechanism** | "The problem with trip safety today" -- status quo framing (spreadsheets, PDF checklists, hope-based planning). Transition to: "SafeTrekr replaces guesswork with evidence" -- 3 mechanism pillars: (1) Professional analyst review, (2) Government intelligence scoring, (3) Tamper-evident documentation. | Category contrast layout. 3 pillars in a card row. |
| 4 | **How It Works (Summary)** | 3-step process: Submit Your Trip > Analyst Reviews Everything > Receive Your Safety Binder. Each step with icon, title, 1-sentence description. Link: "See the full process". | Horizontal timeline on desktop, vertical on mobile. Links to `/how-it-works`. |
| 5 | **Feature Grid** | 6 capability cards (Analyst Review, Risk Intelligence, Safety Binder, Mobile App, Monitoring, Compliance). Each: icon, title, 2-line description, link to feature page. | 3x2 grid on desktop, 2x3 on tablet, stacked on mobile. Links to `/platform/*` pages. |
| 6 | **Sample Binder Showcase** | "See exactly what a reviewed trip looks like." Visual preview of binder pages (3-5 thumbnails). "Every trip produces a binder like this." CTA: "Download a Sample Binder" (gated). | Visual-heavy section. Thumbnails in stacked/fanned layout. Links to `/resources/sample-binders`. |
| 7 | **Segment Routing** | "Built for organizations that take travel safety seriously." 4 segment cards in a row: K-12 Schools & Districts / Higher Education / Churches & Mission Orgs / Corporate & Sports Teams. Each card: icon, segment name, regulatory hook (1 line), "Learn more" link. | 4-column on desktop, 2x2 on tablet, stacked on mobile. Each links to `/solutions/[segment]`. |
| 8 | **Pricing Preview** | "Starting at $15 per participant." Per-student framing. Liability anchor ("The average trip-related settlement: $500K-$2M"). 3 tier labels visible (Field Trip $450, Extended Trip $750, International $1,250). CTA: "View Pricing". | Links to `/pricing`. No pricing calculator here -- just framing. |
| 9 | **Category Contrast** | "This is not travel insurance. This is not trip logistics. This is professional safety analysis and evidence documentation." Table or comparison showing SafeTrekr vs. DIY spreadsheets vs. travel apps vs. travel insurance. | Clarifies the category SafeTrekr creates. |
| 10 | **Final CTA Banner** | "Ready to protect your next trip?" Primary: "Get a Demo". Secondary: "See a Sample Binder". | Full-width. Evaluation variant CTA. |
| 11 | **Footer** | Standard footer navigation + trust signals + data source logos. | Shared component. |

#### User Actions Available

| Action | Mechanism | Destination |
|--------|-----------|-------------|
| Download sample binder | Gated CTA (email capture) | `/resources/sample-binders` |
| Request a demo | Button | `/demo` |
| Navigate to any segment | Segment cards | `/solutions/[segment]` |
| Explore platform features | Feature cards | `/platform/[feature]` |
| View pricing | Link/button | `/pricing` |
| See how it works | Link | `/how-it-works` |
| Access procurement | Utility nav | `/procurement` |
| Log in | Utility nav | `app.safetrekr.com` |

#### Primary CTAs (Priority Order)

1. "See a Sample Safety Binder" (hero primary, binder showcase)
2. "Request a Demo" (hero secondary, final CTA)
3. "View Pricing" (pricing preview section)

---

### 3.2 Church/Missions Solutions Page (`/solutions/churches`)

**Purpose**: Beachhead segment landing page. Deepest, most conversion-optimized segment page at launch. Converts church missions directors, senior pastors, youth leaders, and insurance committees.

**Target Audience**: Church missions directors, senior pastors, youth pastors, insurance committees, denominational leaders.

**Page Type**: Segment Landing Page (SSG)
**Hierarchy Level**: L2
**JSON-LD**: FAQPage (8-12 church-specific Q&As)
**Breadcrumb**: `Home > Solutions > Churches & Mission Organizations`

#### Content Sections (in scroll order)

| # | Section | Content | Design Notes |
|---|---------|---------|--------------|
| 1 | **Hero** | Headline: "Mission Trip Safety That Goes Beyond Prayer" (or equivalent -- faith + preparation framing). Sub-headline with stewardship/duty of care language. Primary CTA: "Download Mission Trip Sample Binder". Secondary CTA: "Get a Demo". | Church-specific vocabulary throughout. No fear-based messaging -- stewardship framing. |
| 2 | **Proof Strip** | Same 5 metrics as homepage. | Shared component, segment-agnostic. |
| 3 | **The Challenge** | "What churches currently rely on" -- informal planning, prayer lists as safety plans, volunteer-assembled trip binders, no formal risk assessment, insurance questionnaires answered with guesswork. Cost of the status quo: volunteer liability, insurance claim denials, duty of care gaps. | Status quo contrast. Respectful tone -- not mocking prayer, framing SafeTrekr as faith + preparation. |
| 4 | **How SafeTrekr Solves It** | 3-4 capabilities with church-specific benefit framing: (1) Analyst Safety Review -- "Every mission field reviewed by a professional analyst." (2) Risk Intelligence -- "Government data on every destination your team visits." (3) Trip Safety Binder -- "Audit-ready documentation for your insurance carrier and board." (4) Mobile Field Operations -- "Rally points, check-ins, and emergency contacts in every chaperone's pocket." | Feature cards linking to `/platform/[feature]`. Church-specific benefit copy, not generic descriptions. |
| 5 | **Sample Binder Preview** | Visual preview of the International Mission Trip sample binder. "See exactly what your insurance carrier and church board will receive." 3-5 thumbnail pages from the binder. CTA: "Download the Mission Trip Sample Binder" (gated). | High-converting section. Links to `/resources/sample-binders/mission-trip`. |
| 6 | **Proof Points** | Quantified metrics: 17 review sections, 5 government data sources, 3-5 day turnaround. Case study preview (when available). Testimonial block (when verified). | If no real testimonial exists at launch, show metrics strip only. No fabricated quotes. |
| 7 | **Pricing Context** | "$450 per domestic mission trip -- 3% of a $15,000 mission budget." International: "$1,250 per trip -- less than the cost of one emergency evacuation consultation." Per-participant framing. Volume discounts for multi-trip churches. Link: "View full pricing". | Links to `/pricing`. Anchor against mission trip budget, not abstract cost. |
| 8 | **Compliance & Trust** | Badges: AES-256 encryption, SHA-256 evidence chain, SOC 2 (in progress). Insurance documentation framing: "Every binder is designed to satisfy your insurance carrier's safety documentation requirements." Link to procurement page. | Links to `/procurement` and `/security`. |
| 9 | **Common Questions** | 8-12 church-specific FAQs. Examples: "Do we need SafeTrekr for domestic mission trips too?", "How does SafeTrekr handle international destinations with limited infrastructure?", "Can our volunteer trip leader use this without training?", "What does our insurance carrier receive?", "How quickly do we get the safety binder back?", "Can SafeTrekr handle multi-stop mission trips?", "Is SafeTrekr appropriate for youth group trips?", "How does pricing work for multiple trips per year?" | `FAQAccordion` with FAQPage JSON-LD. |
| 10 | **Conversion CTA Banner** | "Ready to protect your next mission trip?" Primary: "Get a Demo". Secondary: "Download Sample Binder". | Evaluation variant CTA. Church-specific copy. |

#### User Actions Available

| Action | Mechanism | Destination |
|--------|-----------|-------------|
| Download mission trip sample binder | Gated CTA | `/resources/sample-binders/mission-trip` |
| Request a demo | Button | `/demo` |
| View pricing | Link | `/pricing` |
| Explore platform features | Feature cards | `/platform/[feature]` |
| Read church-specific blog posts | Related content | `/blog/category/church-missions` |
| Access procurement resources | Link | `/procurement` |
| Expand FAQ items | Accordion | In-page |

#### Primary CTAs (Priority Order)

1. "Download Mission Trip Sample Binder" (hero primary, binder preview)
2. "Get a Demo" (hero secondary, final CTA)
3. "View Pricing" (pricing context link)

---

### 3.3 K-12 Solutions Page (`/solutions/k12`)

**Purpose**: Largest TAM segment ($39.5M). Converts school administrators, risk managers, and board members with honest FERPA communication and per-student pricing.

**Target Audience**: Superintendents, principals, risk managers, school board members, trip coordinators (teachers).

**Page Type**: Segment Landing Page (SSG)
**Hierarchy Level**: L2
**JSON-LD**: FAQPage (8-12 K-12-specific Q&As)
**Breadcrumb**: `Home > Solutions > K-12 Schools & Districts`

#### Content Sections (in scroll order)

| # | Section | Content | Design Notes |
|---|---------|---------|--------------|
| 1 | **Hero** | Headline: "Every Field Trip Deserves a Safety Analyst." Sub-headline: FERPA compliance framing, per-student pricing. Primary CTA: "Download K-12 Sample Binder". Secondary CTA: "Get a Demo". | Lead with per-student cost: "$15/student." |
| 2 | **Proof Strip** | Same 5 metrics. | Shared component. |
| 3 | **The Challenge** | "What schools currently rely on" -- teacher-assembled spreadsheets, PDF checklists, permission slips as the only documentation, no formal risk assessment. Cost: $700-$1,400 in staff time per trip for manual safety planning. Liability: $500K-$2M average settlement for trip-related incidents. | Board liability comparison is the key conversion lever for this segment. |
| 4 | **How SafeTrekr Solves It** | (1) Analyst Safety Review -- "Every field trip destination reviewed across 17 safety dimensions." (2) Risk Intelligence -- "Weather, health, crime, and natural hazard data scored for every destination." (3) Trip Safety Binder -- "Board-ready documentation that proves you took every reasonable precaution." (4) Parent/Guardian Portal -- "Parents see trip safety details. You control what they see." | Feature cards. K-12 vocabulary. Guardian portal is a differentiator for this segment. |
| 5 | **Sample Binder Preview** | Visual preview of K-12 Field Trip sample binder. "See what your superintendent and school board will review." 3-5 thumbnails. CTA: "Download the K-12 Field Trip Sample Binder" (gated). | Links to `/resources/sample-binders/k12-field-trip`. |
| 6 | **Per-Student Pricing Calculator** | Interactive: enter number of students, see per-student cost. "$15/student for a professionally reviewed field trip." Compare to liability cost ($500K-$2M), staff time ($700-$1,400). | Inline calculator, not a separate page. Links to `/pricing` for full details. |
| 7 | **Compliance & Trust** | FERPA: "Designed with FERPA requirements in mind. Certification in progress." (Honest language -- never claim "FERPA Compliant" without certification.) COPPA, SOC 2, AES-256. Link to procurement page. | Critical: do not overclaim FERPA. Use "designed with" language verified with legal. |
| 8 | **Common Questions** | 8-12 K-12-specific FAQs. Examples: "Is SafeTrekr FERPA compliant?", "What happens to student data after the trip?", "Can our school district use SafeTrekr for all trips?", "How does SafeTrekr handle parent consent?", "What if a field trip destination changes?", "How does per-student pricing work for large groups?", "Can board members access the safety binder?", "Does SafeTrekr replace our existing field trip approval process?" | `FAQAccordion` with FAQPage JSON-LD. |
| 9 | **Conversion CTA Banner** | "Ready to protect your next field trip?" Primary: "Get a Demo". Secondary: "Download Sample Binder". | Evaluation variant CTA. K-12-specific copy. |

#### User Actions Available

| Action | Mechanism | Destination |
|--------|-----------|-------------|
| Download K-12 sample binder | Gated CTA | `/resources/sample-binders/k12-field-trip` |
| Request a demo | Button | `/demo` |
| Calculate per-student cost | Inline calculator | In-page |
| View full pricing | Link | `/pricing` |
| Explore platform features | Feature cards | `/platform/[feature]` |
| Access procurement | Link | `/procurement` |

#### Primary CTAs (Priority Order)

1. "Download K-12 Field Trip Sample Binder" (hero primary, binder preview)
2. "Get a Demo" (hero secondary, final CTA)
3. "View Pricing" (pricing context link)

---

### 3.4 Pricing Page (`/pricing`)

**Purpose**: Convert evaluators into demo requests or procurement conversations. Per-student framing anchored against liability costs and staff time.

**Target Audience**: Budget holders (administrators, directors, pastors), procurement officers, risk managers evaluating cost/benefit.

**Page Type**: Core Page (SSG)
**Hierarchy Level**: L1
**JSON-LD**: Product + Offer (per tier), FAQPage
**Breadcrumb**: None (L1 page)

#### Content Sections (in scroll order)

| # | Section | Content | Design Notes |
|---|---------|---------|--------------|
| 1 | **Hero/Headline** | "Professional Trip Safety Starting at $15 Per Participant." Sub-headline: "Every trip reviewed by a safety analyst. Every document audit-ready." | Lead with per-participant, not per-trip. No animation on pricing cards (stability/trust). |
| 2 | **Value Anchor** | Comparison bar: "The average trip-related settlement: $500K-$2M. The average staff time for manual safety planning: $700-$1,400 per trip. SafeTrekr: $15/student." | Anchors value before showing price. |
| 3 | **Pricing Tier Cards** | 3 tiers, equal visual weight: **Field Trip** ($450/trip, ~$15/student, 30-person group) -- domestic day/overnight trips. **Extended Trip** ($750/trip, ~$19/student, 40-person group) -- multi-day domestic, sports travel. **International** ($1,250/trip, ~$42/participant, 30-person group) -- international travel, study abroad, mission trips. Each card: tier name, price, per-participant calculation, included features list, CTA button. | 3-column on desktop, stacked on mobile. No "most popular" badge unless data supports it. |
| 4 | **Volume Discounts** | Table: 5-9 trips: 5% off. 10-24 trips: 10% off. 25-49 trips: 15% off. 50+ trips: 20% off. "Contact us for annual plans." | Visible below tier cards. |
| 5 | **What's Included in Every Trip** | Checklist of everything: 17-section analyst review, risk intelligence from 5 government sources, complete safety binder, mobile field operations access, real-time monitoring, compliance documentation, dedicated analyst assignment. | Removes ambiguity. Every feature available at every tier. |
| 6 | **ROI Calculator Link** | "Calculate your organization's ROI." Preview of savings calculation. CTA: "Use the ROI Calculator". | Links to `/resources/roi-calculator`. |
| 7 | **Segment-Specific Pricing Scenarios** | 4 scenarios: "K-12: 20 field trips/year = $9,000/year ($15/student)". "Church: 3 mission trips/year = $3,150/year". "Higher Ed: 8 study abroad programs = $10,000/year". "Corporate: 15 team trips/year = $11,250/year". | Shows real-world cost in context. Removes abstraction. |
| 8 | **Procurement Path** | "Ready to purchase? We have everything your procurement team needs." W-9, security questionnaire, contract templates, DPA. CTA: "For Procurement". | Links to `/procurement`. |
| 9 | **Common Questions** | 8-10 pricing FAQs. Examples: "What counts as a 'trip'?", "Can we start with one trip?", "How does volume pricing work?", "Is there an annual plan?", "What payment methods do you accept?", "What happens after we purchase?", "Can we upgrade trip type after submission?", "Do you offer nonprofit/church discounts?" | `FAQAccordion` with FAQPage JSON-LD. |
| 10 | **Conversion CTA Banner** | "Protect your next trip." Primary: "Get a Demo". Secondary: "Contact Sales". | Decision variant CTA. |

#### User Actions Available

| Action | Mechanism | Destination |
|--------|-----------|-------------|
| Request a demo | CTA per tier or final banner | `/demo` |
| Contact sales | Secondary CTA | `/contact` |
| Use ROI calculator | Link | `/resources/roi-calculator` |
| Access procurement resources | Link | `/procurement` |
| Download sample binder | Link | `/resources/sample-binders` |
| See how it works | FAQ link | `/how-it-works` |

#### Primary CTAs (Priority Order)

1. "Get a Demo" (per-tier buttons, final CTA)
2. "Contact Sales" (secondary, final CTA)
3. "For Procurement" (procurement path link)

---

### 3.5 How It Works Page (`/how-it-works`)

**Purpose**: Deepest explanation of the three-act mechanism (Intelligence > Review > Documentation). Critical for mid-funnel visitors who need to understand the process before requesting a demo.

**Target Audience**: Trip coordinators evaluating the process, risk managers assessing thoroughness, IT evaluators reviewing methodology.

**Page Type**: Core Page (SSG)
**Hierarchy Level**: L1
**JSON-LD**: HowTo (3 steps, totalTime: P5D)
**Breadcrumb**: None (L1 page)

#### Content Sections (in scroll order)

| # | Section | Content | Design Notes |
|---|---------|---------|--------------|
| 1 | **Hero** | Headline: "From Trip Submission to Safety Binder in 3-5 Days." Sub-headline: "Every trip goes through the same rigorous process. Here's exactly how." Primary CTA: "Get a Demo". Secondary CTA: "Download a Sample Binder". | Sets clear expectation: what happens and how long it takes. |
| 2 | **3-Step Process Timeline** | **Step 1: Submit Your Trip** -- Organization submits trip details (destination, dates, participants, activities, logistics). "Takes 15 minutes. No training required." **Step 2: Analyst Reviews Everything** -- Trained safety analyst conducts 17-section review. Risk Intelligence Engine scores every destination using NOAA, USGS, CDC, GDACS, and ReliefWeb data. Monte Carlo simulation produces probability-weighted risk scores. **Step 3: Receive Your Safety Binder** -- Audit-ready documentation delivered. SHA-256 hash-chain ensures tamper-evident integrity. Binder includes every finding, every recommendation, every emergency contact, every risk score. | Animated timeline with connecting line. Each step expands on click/scroll. 3 distinct visual phases. |
| 3 | **Intelligence Sources Deep-Dive** | "We analyze data you can't get from a Google search." 5 government intelligence sources with logos, descriptions, and what each provides: NOAA (weather/climate), USGS (seismic/geological), CDC (health advisories), GDACS (disaster alerts), ReliefWeb (humanitarian situations). Monte Carlo scoring explanation for non-technical readers. | Source logo bar. Each source expandable for detail. |
| 4 | **The 17-Section Review** | All 17 sections of the analyst review, grouped by category. Each section: name, what the analyst evaluates, why it matters. Categories might include: Destination Safety, Transportation, Accommodations, Health & Medical, Emergency Planning, Participant Readiness, Legal & Compliance, Documentation. | Card grid grouped by category. Scrollable or expandable. |
| 5 | **The Safety Binder** | "What you receive." Visual walkthrough of binder contents: cover page, risk score summary, section-by-section findings, emergency contacts, maps, evidence documentation. SHA-256 hash-chain explanation: "Every page is cryptographically signed. Any modification is detectable." | Document preview visual. Links to sample binder download. |
| 6 | **During the Trip** | Mobile field operations overview: live map, geofencing, rally points, muster check-ins, SMS broadcast, emergency contacts. "Your chaperones have everything they need in their pocket." | Mobile device mockup or screenshot. |
| 7 | **After the Trip** | Evidence preserved: audit trail, compliance documentation, insurance records. "Every decision documented. Every precaution verifiable. Years after the trip." | Compliance/audit framing. |
| 8 | **Segment Examples** | "See how it works for your organization." 4 cards linking to segment pages: K-12 (field trip example), Higher Ed (study abroad example), Church (mission trip example), Corporate (team retreat example). | Segment routing. Links to `/solutions/[segment]`. |
| 9 | **Conversion CTA Banner** | "Ready to see it in action?" Primary: "Get a Demo". Secondary: "Download a Sample Binder". | Evaluation variant CTA. |

#### User Actions Available

| Action | Mechanism | Destination |
|--------|-----------|-------------|
| Request a demo | CTA buttons | `/demo` |
| Download sample binder | CTA buttons | `/resources/sample-binders` |
| Explore platform features | Inline links | `/platform/[feature]` |
| Navigate to segment page | Segment cards | `/solutions/[segment]` |
| View pricing | Contextual link | `/pricing` |

#### Primary CTAs (Priority Order)

1. "Get a Demo" (hero primary, final CTA)
2. "Download a Sample Binder" (hero secondary, binder section)
3. "View Pricing" (contextual link)

---

### 3.6 Demo Request Page (`/demo`)

**Purpose**: Primary conversion endpoint. Framed as "See Your Safety Binder" rather than a sales call. Progressive profiling (minimal fields first).

**Target Audience**: Qualified prospects ready to engage -- trip coordinators, risk managers, administrators who have evaluated enough to take action.

**Page Type**: Form Page (SSG with Server Actions)
**Hierarchy Level**: L1
**JSON-LD**: None (conversion page)
**Breadcrumb**: None (L1 page, top-of-funnel exit point)

#### Content Sections (in scroll order)

| # | Section | Content | Design Notes |
|---|---------|---------|--------------|
| 1 | **Hero/Form Header** | Headline: "See How SafeTrekr Protects Every Trip." Sub-headline: "Schedule a personalized walkthrough of the SafeTrekr platform. We'll show you exactly what a safety binder looks like for your organization." | Not "Talk to Sales." Outcome-framed. |
| 2 | **Demo Request Form** | Progressive form fields: **Step 1 (required)**: Full name, Work email, Organization name. **Step 2 (shown after Step 1)**: Organization type (dropdown: K-12 School/District, Higher Education, Church/Mission Organization, Corporate/Sports, Other), Approximate trips per year (range: 1-5, 6-15, 16-50, 50+), Preferred demo format (dropdown: Video call, In-person if available, Self-guided tour), Message (optional textarea). Submit button: "Request Your Demo". | 2-step progressive form. Step 1 captures minimum viable lead. Step 2 enriches. Cloudflare Turnstile (invisible). Honeypot field (hidden). |
| 3 | **What to Expect** | "After you submit: (1) We'll confirm your demo within 1 business day. (2) Your demo will be personalized for your organization type. (3) We'll walk through a real safety binder for your kind of trip. (4) No pressure. No obligation. Just clarity." | Sets expectation. Reduces form anxiety. |
| 4 | **Trust Signals** | Proof strip: "5 Government Intel Sources / 17 Safety Review Sections / 3-5 Day Turnaround / AES-256 Encryption." No testimonials unless real. | Below form, reinforces credibility. |
| 5 | **Alternative Paths** | "Not ready for a demo? Download a Sample Binder / View Pricing / Contact Us". | Catches visitors not ready to commit. Reduces bounce. |

#### User Actions Available

| Action | Mechanism | Destination |
|--------|-----------|-------------|
| Submit demo request | Form submission (Server Action) | Confirmation state (in-page) |
| Download sample binder instead | Link | `/resources/sample-binders` |
| View pricing instead | Link | `/pricing` |
| Contact us instead | Link | `/contact` |

#### Primary CTAs (Priority Order)

1. "Request Your Demo" (form submit button)
2. "Download a Sample Binder" (alternative path)

#### Form Submission Behavior

1. Client-side validation (Zod) on blur and submit
2. Server-side validation (Zod) on Server Action
3. Cloudflare Turnstile verification
4. Save to Supabase `form_submissions` table with form_type `demo_request`, UTM params, referrer
5. Send notification email (Resend) to sales
6. Show confirmation state: "We've received your request. Expect to hear from us within 1 business day."
7. Fire Plausible event: `demo_request`

---

### 3.7 About Page (`/about`)

**Purpose**: Founding story, mission, and category creation narrative. Establishes "why this category needs to exist" and builds trust through team credibility.

**Target Audience**: Evaluators conducting vendor due diligence, risk managers assessing company viability, board members reviewing who they are buying from.

**Page Type**: Core Page (SSG)
**Hierarchy Level**: L1
**JSON-LD**: Organization
**Breadcrumb**: None (L1 page)

#### Content Sections (in scroll order)

| # | Section | Content | Design Notes |
|---|---------|---------|--------------|
| 1 | **Hero** | Headline: "We Believe Every Trip Deserves the Same Safety Rigor as a Flight." Sub-headline with founding motivation: why this category needs to exist. | Story-driven. Not feature-focused. |
| 2 | **The Problem We Saw** | Founding narrative: organizations sending groups on trips with nothing more than a spreadsheet and a prayer. The gap between what airlines/aviation require and what schools, churches, and companies do for group travel. "We built SafeTrekr to close that gap." | Origin story. Category creation framing. |
| 3 | **Our Approach** | "Professional safety analyst review. Government intelligence data. Tamper-evident documentation." The 3 pillars of SafeTrekr's mechanism, framed as company philosophy rather than feature list. | Philosophy, not pitch. But names the mechanism. |
| 4 | **The Team** | Founder profile(s). Safety analyst team introduction (link to full profiles). Credentials, background, and relevant experience. "Our analysts have reviewed [X] trips across [Y] countries." | Real people with real credentials. Links to `/about/analysts`. |
| 5 | **By the Numbers** | Verifiable metrics: number of organizations served, number of trips reviewed, countries covered, safety review sections, data sources monitored. | Only use real numbers from the product database (104 organizations, etc.). |
| 6 | **Our Mission** | Mission statement: protecting every traveler through professional safety analysis, government intelligence, and documented evidence. Vision: a world where every group trip has the safety rigor it deserves. | Concise. Institutional language. |
| 7 | **Trusted By** | Organization type logos/descriptions (when available). If no real logos at launch, show organization type counts: "Trusted by schools, universities, churches, and businesses across [X] states." | No fabricated logos or names. |
| 8 | **Conversion CTA Banner** | "Ready to see SafeTrekr in action?" Primary: "Get a Demo". Secondary: "See How It Works". | Evaluation variant CTA. |

#### User Actions Available

| Action | Mechanism | Destination |
|--------|-----------|-------------|
| Meet the analysts | Link | `/about/analysts` |
| Request a demo | CTA | `/demo` |
| See how it works | Link | `/how-it-works` |
| View security posture | Link | `/security` |

#### Primary CTAs (Priority Order)

1. "Get a Demo" (final CTA)
2. "See How It Works" (secondary CTA)
3. "Meet Our Analysts" (in-page link)

---

### 3.8 Blog Index Page (`/blog`)

**Purpose**: SEO content hub driving organic traffic. Index page surfaces recent and featured content, provides category/tag navigation, and routes readers to segment-specific content clusters.

**Target Audience**: Organic search visitors discovering SafeTrekr through educational content, returning visitors checking for new content, evaluators seeking thought leadership.

**Page Type**: Blog Index (ISR, 1-hour revalidation)
**Hierarchy Level**: L1
**JSON-LD**: Blog (CollectionPage)
**Breadcrumb**: None (L1 page)

#### Content Sections (in scroll order)

| # | Section | Content | Design Notes |
|---|---------|---------|--------------|
| 1 | **Hero/Header** | Headline: "Trip Safety Insights." Sub-headline: "Research, guides, and analysis for organizations that take travel safety seriously." | Clean, no CTA in hero. Let content drive engagement. |
| 2 | **Featured Post** | Latest or editorially-selected featured post. Large card: featured image, title, excerpt, author, date, reading time, category badge. | Full-width card at top. |
| 3 | **Category Filters** | Horizontal pill bar: All / K-12 Compliance / Higher Ed Safety / Church & Mission / Corporate Travel / Product Updates / Safety Research. Each category links to `/blog/category/[slug]`. | Sticky below header on scroll. Active category highlighted. |
| 4 | **Post Grid** | Post cards in grid: featured image, title, excerpt (2 lines), author avatar + name, date, reading time, category badge. Sorted by date (newest first). | 3-column on desktop, 2 on tablet, 1 on mobile. |
| 5 | **Pagination** | Page numbers with prev/next. 12 posts per page. | Below grid. `rel="prev"` / `rel="next"` for crawlers. |
| 6 | **Newsletter Signup** | "Get trip safety insights in your inbox." Email input + segment selector (optional). "We send 1-2 emails per month. Unsubscribe anytime." | Inline form. Double opt-in. |
| 7 | **Sample Binder CTA** | "See what a professional safety review looks like." Small CTA card linking to sample binder download. | Discovery variant. Persistent sidebar or below-grid. |

#### Blog Post Categories (Launch)

| Category | Slug | Target Segment | Pillar Page |
|----------|------|---------------|-------------|
| K-12 Compliance | `k12-compliance` | K-12 | `/solutions/k12` |
| Higher Ed Safety | `higher-ed-safety` | Higher Ed | `/solutions/higher-education` |
| Church & Mission | `church-missions` | Churches | `/solutions/churches` |
| Corporate Travel | `corporate-travel` | Corporate | `/solutions/corporate` |
| Product Updates | `product-updates` | All | `/platform` |
| Safety Research | `safety-research` | All | `/how-it-works` |

#### User Actions Available

| Action | Mechanism | Destination |
|--------|-----------|-------------|
| Read a blog post | Post card click | `/blog/[slug]` |
| Filter by category | Category pill | `/blog/category/[slug]` |
| Subscribe to newsletter | Inline form | Email capture |
| Download sample binder | Sidebar CTA | `/resources/sample-binders` |
| Navigate pages | Pagination | `/blog?page=[n]` |

#### Primary CTAs (Priority Order)

1. Post engagement (click through to read)
2. Newsletter signup
3. "Download a Sample Binder" (discovery CTA)

---

## 4. User Flow Diagrams

### 4.1 Homepage to Segment to Demo Request

```
                    +------------------+
                    |    Homepage      |
                    |    (/)           |
                    +--------+---------+
                             |
              +--------------+---------------+
              |              |               |
     +--------v------+ +----v-------+ +-----v------+
     | Segment Cards  | | Hero CTA   | | Feature    |
     | "K-12 / Church | | "See a     | | Cards      |
     |  / Higher Ed / | | Sample     | |            |
     |  Corporate"    | | Binder"    | |            |
     +--------+------+ +----+-------+ +-----+------+
              |              |               |
     +--------v------+      |        +------v-------+
     | Segment Page  |      |        | Platform     |
     | /solutions/*  |      |        | /platform/*  |
     +--------+------+      |        +------+-------+
              |              |               |
    +---------+--------+     |        +------v-------+
    |         |        |     |        | Feature Page |
    |         |        |     |        +------+-------+
    v         v        v     v               |
 +------+ +------+ +---+----+--+      +-----v------+
 | Demo | | Binder | | Pricing  |      | Demo       |
 | /demo| | Gate  | | /pricing |      | /demo      |
 +------+ +------+ +----+-----+      +------------+
                         |
                    +----v-----+
                    | Demo     |
                    | /demo    |
                    +----------+
```

**Typical path (church missions director)**:
1. Lands on Homepage
2. Sees segment cards, clicks "Churches & Mission Orgs"
3. Reads `/solutions/churches` -- sees mission trip binder preview
4. Downloads sample binder (email captured)
5. Shares binder with senior pastor
6. Returns, clicks "Get a Demo"
7. Fills demo form on `/demo`

**Clicks to demo**: 2-3 from homepage.

### 4.2 Homepage to Pricing to Quote/Demo

```
+------------------+
|    Homepage      |
|    (/)           |
+--------+---------+
         |
         | Pricing Preview section or nav click
         v
+------------------+
|   Pricing Page   |
|   /pricing       |
+--------+---------+
         |
    +----+----+----+----+
    |         |         |
    v         v         v
+-------+ +-------+ +----------+
| Demo  | | ROI   | | Procure- |
| /demo | | Calc  | | ment     |
+-------+ | /resources | /procurement |
          | /roi-calc  |            |
          +-----+------+     +------+
                |             |
                v             v
          +-------+    +----------+
          | Demo  |    | Contact  |
          | /demo |    | /contact |
          +-------+    +----------+
```

**Typical path (procurement officer)**:
1. Receives forwarded pricing page URL from internal champion
2. Reviews pricing tiers and volume discounts on `/pricing`
3. Clicks "For Procurement"
4. Downloads W-9, security questionnaire on `/procurement`
5. Submits contact form or schedules call via `/contact`

**Clicks to procurement resources**: 1 from pricing.

### 4.3 Organic Search to Blog to Conversion

```
+-----------------+
| Google SERP     |
| "school field   |
|  trip safety"   |
+--------+--------+
         |
         v
+------------------+
| Blog Post        |
| /blog/[slug]     |
+--------+---------+
         |
    +----+----+----+
    |         |    |
    v         v    v
+-------+ +----+ +----------+
| Sample| | K-12 | | Related  |
| Binder| | Page | | Posts    |
| Gate  | | /solutions | /blog/* |
+---+---+ | /k12  |  +--------+
    |     +---+---+
    v         |
+-------+    v
| Email | +-------+
| Nurture| | Demo |
| 5-part | | /demo|
+---+---+ +-------+
    |
    v
+-------+
| Demo  |
| /demo |
+-------+
```

**Typical path (teacher searching for field trip safety)**:
1. Searches "school field trip safety checklist"
2. Lands on blog post `/blog/field-trip-safety-checklist-for-schools`
3. Sees end-of-post CTA: "Download a Sample K-12 Field Trip Binder"
4. Provides email, downloads binder
5. Receives 5-part email nurture sequence over 14 days
6. Forwards binder to superintendent
7. Superintendent visits `/pricing` or requests demo

### 4.4 Direct Navigation to Demo (Returning Visitor)

```
+------------------+
| Direct URL or    |
| Bookmark         |
+--------+---------+
         |
         v
+------------------+     +-----------+
| Any Page         | --> | Sticky    |
| (nav visible)    |     | "Get a    |
+------------------+     | Demo" btn |
                         +-----+-----+
                               |
                               v
                         +----------+
                         | Demo     |
                         | /demo    |
                         +----------+
```

**"Get a Demo" is reachable in 1 click from any page via the persistent utility nav CTA.**

### 4.5 Evaluation Journey (Multi-Stakeholder)

```
CHAMPION (Trip Coordinator)               EVALUATOR (Risk Manager)
+------------------+                      +------------------+
| Homepage         |                      | Forwarded Link   |
+--------+---------+                      +--------+---------+
         |                                         |
         v                                         v
+------------------+                      +------------------+
| Segment Page     | --- shares URL ----> | Security Page    |
| /solutions/*     |                      | /security        |
+--------+---------+                      +--------+---------+
         |                                         |
         v                                         v
+------------------+                      +------------------+
| Sample Binder    | --- shares PDF ----> | Procurement Page |
| (gated download) |                      | /procurement     |
+--------+---------+                      +--------+---------+
         |                                         |
         v                                         v
+------------------+                      +------------------+
| Demo Request     |                      | Contact / Demo   |
| /demo            |                      | /contact or /demo|
+------------------+                      +------------------+
```

**Key insight**: The champion and evaluator take parallel paths. The site must arm the champion with shareable artifacts (binder PDF, pricing URL, security page URL) that the evaluator can independently review.

---

## 5. URL Structure

### 5.1 URL Design Rules

| Rule | Specification | Example |
|------|---------------|---------|
| Case | All lowercase | `/platform/analyst-review` |
| Separator | Hyphens between words | `/risk-intelligence` |
| Trailing slash | No trailing slash (canonical) | `/pricing` |
| File extensions | None | `/about` |
| Max segments | 3 path segments for core pages | `/resources/case-studies/springfield` |
| Slug format | 3-8 words, descriptive, keyword-front | `/blog/ferpa-compliance-school-travel` |
| Date in URLs | Never (evergreen content) | `/blog/title` not `/blog/2026/03/title` |
| IDs in URLs | Never (human-readable slugs) | `/solutions/k12` not `/solutions?id=1` |
| Query params | Reserved for filters, UTM, segment context | `?segment=k12&utm_source=google` |
| Canonical tags | Every page self-referencing | `<link rel="canonical" href="https://www.safetrekr.com/pricing">` |

### 5.2 Complete URL Map with Redirect Aliases

| Page | Canonical URL | Redirects From (301) |
|------|---------------|---------------------|
| **Homepage** | `/` | -- |
| **Platform Overview** | `/platform` | `/features`, `/product` |
| Analyst Safety Review | `/platform/analyst-review` | `/features/analyst-review` |
| Risk Intelligence Engine | `/platform/risk-intelligence` | `/features/risk-intelligence` |
| Trip Safety Binder | `/platform/safety-binder` | `/features/safety-binder`, `/features/trip-binder` |
| Mobile Field Operations | `/platform/mobile-app` | `/features/mobile`, `/mobile` |
| Real-Time Monitoring | `/platform/monitoring` | `/features/monitoring`, `/features/geofencing` |
| Compliance & Evidence | `/platform/compliance` | `/features/compliance` |
| **Solutions Overview** | `/solutions` | -- |
| K-12 Schools & Districts | `/solutions/k12` | `/solutions/k-12`, `/solutions/schools`, `/k12` |
| Higher Education | `/solutions/higher-education` | `/solutions/higher-ed`, `/solutions/universities`, `/higher-education` |
| Churches & Mission Orgs | `/solutions/churches` | `/solutions/church`, `/solutions/mission`, `/churches` |
| Corporate & Sports Teams | `/solutions/corporate` | `/solutions/business`, `/solutions/sports`, `/corporate` |
| **How It Works** | `/how-it-works` | `/process`, `/how-safetrekr-works` |
| **Pricing** | `/pricing` | `/plans`, `/pricing-plans` |
| **Resources Overview** | `/resources` | -- |
| Case Studies Index | `/resources/case-studies` | `/case-studies` |
| Case Study Detail | `/resources/case-studies/[slug]` | `/case-studies/[slug]` |
| Guides Index | `/resources/guides` | `/guides`, `/whitepapers` |
| Guide Detail | `/resources/guides/[slug]` | -- |
| Sample Binders Index | `/resources/sample-binders` | `/sample-binders` |
| Sample Binder Detail | `/resources/sample-binders/[slug]` | -- |
| Webinars | `/resources/webinars` | `/webinars` |
| FAQ | `/resources/faq` | `/faq` |
| ROI Calculator | `/resources/roi-calculator` | `/roi-calculator`, `/roi` |
| **Blog Index** | `/blog` | -- |
| Blog Post | `/blog/[slug]` | -- |
| Blog Category | `/blog/category/[category]` | -- |
| Blog Tag | `/blog/tag/[tag]` | -- |
| Compare Hub | `/compare` | -- |
| Comparison Page | `/compare/[slug]` | -- |
| Compliance Guide | `/compliance/[regulation]` | -- |
| Glossary Index | `/glossary` | -- |
| Glossary Term | `/glossary/[term]` | -- |
| **About** | `/about` | `/about-us`, `/company` |
| Our Analysts | `/about/analysts` | `/team`, `/our-team`, `/analysts` |
| Security & Trust | `/security` | `/trust`, `/trust-center`, `/security-and-trust` |
| For Procurement | `/procurement` | `/for-procurement`, `/vendor-info` |
| Contact | `/contact` | `/contact-us` |
| **Demo Request** | `/demo` | `/request-demo`, `/get-a-demo`, `/book-demo` |
| Get Started | `/get-started` | `/signup`, `/start` |
| Partners | `/partners` | `/partner-program` |
| Terms of Service | `/legal/terms` | `/terms`, `/terms-of-service` |
| Privacy Policy | `/legal/privacy` | `/privacy`, `/privacy-policy` |
| DPA | `/legal/dpa` | `/dpa` |
| Acceptable Use | `/legal/acceptable-use` | `/acceptable-use-policy` |
| Cookie Policy | `/legal/cookies` | `/cookies`, `/cookie-policy` |
| Status | `/status` | -- |
| Campaign LPs | `/lp/[campaign-slug]` | -- (noindex) |

### 5.3 Redirect Implementation

All redirects implemented as 301 (Permanent) in `next.config.ts`:

```typescript
// next.config.ts (redirects array)
const redirects = async () => [
  // Platform aliases
  { source: '/features', destination: '/platform', permanent: true },
  { source: '/product', destination: '/platform', permanent: true },
  { source: '/features/:slug', destination: '/platform/:slug', permanent: true },
  { source: '/features/trip-binder', destination: '/platform/safety-binder', permanent: true },
  { source: '/features/mobile', destination: '/platform/mobile-app', permanent: true },
  { source: '/mobile', destination: '/platform/mobile-app', permanent: true },
  { source: '/features/geofencing', destination: '/platform/monitoring', permanent: true },

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

  // Process/Pricing aliases
  { source: '/process', destination: '/how-it-works', permanent: true },
  { source: '/how-safetrekr-works', destination: '/how-it-works', permanent: true },
  { source: '/plans', destination: '/pricing', permanent: true },
  { source: '/pricing-plans', destination: '/pricing', permanent: true },

  // Resource aliases
  { source: '/case-studies', destination: '/resources/case-studies', permanent: true },
  { source: '/case-studies/:slug', destination: '/resources/case-studies/:slug', permanent: true },
  { source: '/guides', destination: '/resources/guides', permanent: true },
  { source: '/whitepapers', destination: '/resources/guides', permanent: true },
  { source: '/sample-binders', destination: '/resources/sample-binders', permanent: true },
  { source: '/webinars', destination: '/resources/webinars', permanent: true },
  { source: '/faq', destination: '/resources/faq', permanent: true },
  { source: '/roi-calculator', destination: '/resources/roi-calculator', permanent: true },
  { source: '/roi', destination: '/resources/roi-calculator', permanent: true },

  // Company aliases
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

  // Conversion aliases
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
];
```

### 5.4 Canonical URL Strategy

- **Domain**: `www.safetrekr.com` (with www) is canonical. Non-www redirects to www.
- **Protocol**: HTTPS enforced. HTTP redirects to HTTPS.
- **Self-referencing**: Every page emits `<link rel="canonical" href="https://www.safetrekr.com/[path]" />`
- **Query parameters**: Canonical URL strips all query params (`?segment=`, `?utm_*`, etc.)
- **Campaign pages**: `/lp/*` pages get `noindex` + canonical pointing to matching public page (if one exists)
- **Pagination**: Each page is its own canonical; `rel="prev"` / `rel="next"` for crawlers
- **Trailing slash**: Enforced no trailing slash via `next.config.ts` (`trailingSlash: false`)

### 5.5 Next.js App Router File Structure

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

---

## 6. Content Types

### 6.1 Content Type Inventory

| Content Type | Count at Launch | Template | Key Fields |
|--------------|:-:|---|---|
| **Core Page** | ~8 | Page builder with section components | title, slug, meta_title, meta_description, og_image, sections[], cta_config, segment_tags[] |
| **Segment Landing Page** | 4 | Structured 10-section template | segment_id, hero_config, pain_points[], features_highlighted[], sample_binder_ref, pricing_context, compliance_badges[], faq_items[] |
| **Feature Page** | 6 | Structured feature template | feature_id, hero_config, capability_details[], proof_points[], screenshots[], related_features[], segment_relevance[] |
| **Blog Post** | 0-4 (seed) | MDX with frontmatter | author_ref, publish_date, categories[], tags[], excerpt, body (MDX), featured_image, reading_time |
| **Case Study** | 0-2 (seed) | Structured template | organization_type, segment_tags[], challenge, solution, results_metrics[], quote |
| **Guide / Whitepaper** | 2-4 | Content + optional gate | format (guide/whitepaper/checklist), segment_tags[], body or pdf_url, gated (boolean) |
| **Sample Binder** | 4 | Download asset with preview | segment_id, trip_type, preview_images[], download_url, gated (boolean), sections_included[] |
| **Webinar** | 0-1 | Event listing | date, speakers[], status (upcoming/recorded), registration_url or recording_url |
| **FAQ Item** | 15-25 | Structured list | question, answer (rich text), category, segment_tags[], sort_order |
| **Testimonial** | 0 (launch) | Reference data | quote, author_name, author_title, organization_name, segment_id, verified (boolean) |
| **Team / Analyst Profile** | 3-6 | Reference data | name, title, bio, photo_url, credentials[] |
| **Pricing Tier** | 3 | Structured data | tier_name, price, per_student_price, features_included[], cta_label, volume_discount |
| **Comparison Page** | 0 (Phase 2) | Structured comparison | alternative_name, comparison_matrix[], safetrekr_advantages[], faq_items[] |
| **Compliance Guide** | 0 (Phase 2) | Regulation template | regulation_id, summary, how_safetrekr_helps[], relevant_segments[], faq_items[] |
| **Glossary Term** | 0 (Phase 3) | Term definition | term, definition, synonyms[], related_terms[], related_features[] |
| **Legal Page** | 5 | Legal content | effective_date, body (MDX), version |
| **Campaign LP** | 0 | Stripped template (no nav) | Single CTA, noindex, segment-specific |

### 6.2 Content Type Relationships

```
Homepage
  |-- references --> SegmentLandingPage (x4, segment cards)
  |-- references --> FeaturePage (x3-6, feature highlights)
  |-- embeds ----> ProofStrip (quantified trust metrics)
  |-- links to --> HowItWorks, Pricing, Demo

SegmentLandingPage
  |-- references --> CaseStudy (filtered by segment_id)
  |-- references --> SampleBinder (filtered by segment_id)
  |-- references --> FeaturePage (3-4 highlighted features)
  |-- references --> PricingTier (segment-specific framing)
  |-- references --> FAQItem (filtered by segment_tags)
  |-- references --> BlogPost (filtered by segment_tags)
  |-- references --> Testimonial (filtered by segment_id)
  |-- links to --> ComplianceGuide, Procurement, Demo

FeaturePage
  |-- references --> SegmentLandingPage (via segment_relevance)
  |-- references --> CaseStudy (proof points)
  |-- references --> FeaturePage (related_features)
  |-- links to --> GlossaryTerm (technical terms), Demo

BlogPost
  |-- references --> FeaturePage (inline capability mentions)
  |-- references --> SegmentLandingPage (segment-relevant)
  |-- references --> Guide (deeper reading)
  |-- references --> BlogPost (related_posts)
  |-- belongs to -> BlogCategory
  |-- tagged with > BlogTag
  |-- links up to > SegmentLandingPage (pillar_page_ref for cluster)

CaseStudy
  |-- references --> SegmentLandingPage (matching segment)
  |-- references --> FeaturePage (capabilities used)
  |-- surfaces on -> Homepage, SegmentPage, Resources

ComparisonPage
  |-- references --> FeaturePage, CaseStudy, PricingTier, SegmentLandingPage
```

### 6.3 Content Component Library

Reusable components that appear across multiple page types.

| Component | Used On | Purpose |
|-----------|---------|---------|
| `HeroSection` | Homepage, segment pages, feature pages, How It Works | Primary above-fold messaging with headline, sub-headline, CTAs |
| `ProofStrip` | Homepage, segment pages, pricing, How It Works, demo | Quantified credibility (5 sources, 17 sections, 3-5 days) |
| `FeatureCard` | Platform overview, segment pages, homepage | Capability summary with icon, title, description, link |
| `SegmentCard` | Homepage, solutions overview | Segment routing with icon, name, regulatory hook |
| `TestimonialBlock` | Segment pages, homepage (when real) | Social proof with verified attribution |
| `CaseStudyPreview` | Segment pages, resources | Case study card with metrics |
| `SampleBinderCTA` | Segment pages, How It Works, pricing, blog | Lead magnet with visual preview + gated download |
| `PricingCard` | Pricing page | Tier comparison card |
| `ROICalculator` | Pricing page, resources | Interactive cost comparison tool |
| `ComplianceBadgeRow` | Footer, security page, segment pages | Trust signal badges (SOC 2, AES-256, etc.) |
| `CTABanner` | End of every content page (except legal) | Conversion prompt: discovery / evaluation / decision variants |
| `FAQAccordion` | FAQ page, segment pages, pricing, comparisons | Expandable Q&A with optional JSON-LD |
| `ProcessTimeline` | How It Works | 3-step visual flow with animation |
| `ComparisonTable` | Compare pages, pricing, segment pages | Feature-by-feature comparison |
| `BlogPostCard` | Blog index, segment pages, resources | Post preview card |
| `InPageNav` | Long-form pages (>3 viewports) | Section anchors from H2 headings |
| `DataSourceLogos` | Footer, security, platform, How It Works | Government source trust building |
| `RelatedContent` | Blog, features, case studies | Cross-link section |

### 6.4 CTA Variant System

Every content page ends with a `CTABanner`. The variant depends on where the page sits in the buying journey.

| Variant | Used On | Primary CTA | Secondary CTA |
|---------|---------|-------------|---------------|
| **Discovery** | Blog posts, guides, glossary, compliance guides | "Download a Sample Binder" | "See How It Works" |
| **Evaluation** | Feature pages, segment pages, case studies, comparisons | "Get a Demo" | "View Pricing" |
| **Decision** | Pricing, procurement, ROI calculator | "Get Started" | "Contact Sales" |

When segment context exists (via `localStorage`), the sample binder CTA personalizes:
- Generic: "Download a Sample Binder"
- With context: "Download the K-12 Field Trip Sample Binder"

---

## 7. Cross-Linking Strategy

### 7.1 Required Cross-Links

| Source | Target | Link Context |
|--------|--------|-------------|
| Homepage | 4 segment pages | Segment cards section |
| Homepage | Platform overview | Feature highlights |
| Homepage | How It Works | Hero secondary CTA, mid-page |
| Homepage | Pricing | Pricing preview, footer CTA |
| Homepage | Demo | Hero primary CTA, sticky CTA |
| Segment page | 3-4 feature pages | "How SafeTrekr Solves It" section |
| Segment page | Matching sample binder | Binder preview section |
| Segment page | Pricing | Pricing context section |
| Segment page | Procurement | Compliance & trust section |
| Segment page | Demo | End CTA |
| Feature page | 4 segment pages | "How [Feature] works for your org" |
| Feature page | 2-3 related features | "Related capabilities" |
| Feature page | Demo | End CTA |
| How It Works | Platform overview | "Explore the full platform" |
| How It Works | 4 segment pages | "See how it works for [segment]" |
| How It Works | Pricing, sample binder, demo | End CTAs |
| Pricing | ROI calculator | "Calculate your ROI" |
| Pricing | Procurement | "Ready to purchase?" |
| Pricing | Sample binder | "See what you get" |
| Pricing | Demo | Per-tier CTA buttons |
| Blog post | Matching segment page | End CTA (when segment-tagged) |
| Blog post | 2-3 related posts | Related content section |
| Blog post | Sample binder | End CTA (discovery variant) |

### 7.2 Persistent Navigation CTAs

"Get a Demo" is reachable from every page via the utility navigation CTA button. The sample binder download surfaces on: homepage, all segment pages, How It Works, pricing, and as the discovery CTA on all blog posts and guides.

---

## 8. Metadata & SEO

### 8.1 Title Tag Templates

| Page Type | Template | Example |
|-----------|----------|---------|
| Homepage | `SafeTrekr -- [Tagline]` | `SafeTrekr -- Analyst-Reviewed Trip Safety for Every Organization` |
| Platform | `[Feature] -- SafeTrekr Platform` | `Analyst Safety Review -- SafeTrekr Platform` |
| Segment | `Trip Safety for [Segment] -- SafeTrekr` | `Trip Safety for K-12 Schools & Districts -- SafeTrekr` |
| How It Works | `How SafeTrekr Works -- [Summary]` | `How SafeTrekr Works -- From Trip Submission to Safety Binder` |
| Pricing | `Pricing -- SafeTrekr Trip Safety Management` | (as shown) |
| Blog post | `[Post Title] -- SafeTrekr Blog` | `FERPA Compliance for School Travel -- SafeTrekr Blog` |
| About | `About SafeTrekr -- [Mission Summary]` | `About SafeTrekr -- Professional Trip Safety for Every Organization` |
| Demo | `Request a Demo -- SafeTrekr` | (as shown) |

**Rules**: Max 60 chars. Brand name always present. Primary keyword front-loaded. No keyword stuffing.

### 8.2 JSON-LD Schema Map

| Schema Type | Applied To |
|-------------|-----------|
| `Organization` | Root layout, About |
| `SoftwareApplication` + `AggregateOffer` | Homepage |
| `BreadcrumbList` | All L2+ pages |
| `FAQPage` | Segment pages, pricing, FAQ page |
| `HowTo` | How It Works (3 steps, totalTime: P5D) |
| `Article` | Blog posts |
| `Product` + `Offer` | Pricing (per tier) |
| `DefinedTerm` | Glossary terms |

---

## 9. Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| **Skip Navigation** | Skip-to-main link as first focusable element |
| **Landmarks** | `<nav>` (primary, footer, breadcrumb), `<main>`, `<aside>`, `<footer>` |
| **Keyboard Nav** | Full tab order. Arrow keys within menus. Escape closes dropdowns. |
| **Focus Indicators** | 2px `focus-visible` ring on all interactive elements |
| **ARIA States** | `aria-current="page"`, `aria-expanded`, `aria-haspopup`, `aria-controls` |
| **Mobile Drawer** | `role="dialog"`, `aria-modal="true"`, focus trap, escape to close |
| **Breadcrumbs** | `<nav aria-label="Breadcrumb">`, `<ol>`, `aria-current="page"` on last item |
| **Forms** | Labels on all inputs, error messages linked via `aria-describedby`, live regions |
| **Motion** | `prefers-reduced-motion` fully respected. All animation disabled. No auto-play. |
| **Color Contrast** | 4.5:1 minimum for text. `muted-foreground: #4d5153` (5.2:1 on #e7ecee). |
| **Touch Targets** | 44x44px minimum on all interactive elements |
| **Testing** | axe-core in CI. Lighthouse accessibility >= 95. |

---

## 10. Validation Plan

| Method | Purpose | When | Participants |
|--------|---------|------|:---:|
| Tree Test | Validate navigation hierarchy -- can users find segment pages, demo, pricing, procurement? | Pre-launch | 15-20 |
| Card Sort (Closed) | Validate resource categorization -- do users expect binders, guides, case studies under "Resources"? | Pre-launch | 12-15 |
| First-Click Test | Validate homepage entry points -- where do users click first for their segment? | Post-build, pre-launch | 15-20 |
| 5-Second Test | Validate hero recall -- do users remember the mechanism after 5 seconds? | Post-build | 20 |
| Findability Benchmark | Measure time-to-find for 10 key items (demo, pricing, sample binder, procurement, K-12 page, etc.) | Post-launch, quarterly | 10-15 |
| Search Log Analysis | Identify content gaps and navigation failures from search queries | When search launches (~month 6) | -- (data) |
| Navigation Analytics | Track click paths, drop-off points, segment routing effectiveness | Post-launch, ongoing | -- (data) |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-24 | Initial IA specification for mockup design. 8 priority pages detailed. |
