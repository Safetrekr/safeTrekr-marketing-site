# SafeTrekr Marketing Site -- Unified Analysis

## Date: 2026-03-24
## Synthesized from 8 expert agent analyses

**Agents**: UX Designer, UI Designer, Information Architect, Product Narrative Strategist, Product Strategy Analyst, Digital Marketing Lead, React Developer, Chief Technology Architect

**Project**: Greenfield marketing site for SafeTrekr enterprise trip safety management platform
**Tech Stack**: Next.js 15 (App Router) + React 19 + Tailwind CSS 4 + Framer Motion + MapLibre GL JS + Vercel
**Product Context**: 3 web portals, mobile app, 2 APIs, 292K LOC, 250+ API endpoints, 104 existing organizations, $728M TAM

---

## Executive Summary

SafeTrekr possesses one of the most striking product-to-marketing capability gaps any of the eight analysts have encountered. The product -- 17-section analyst reviews, Monte Carlo risk scoring from 5 government intelligence sources, SHA-256 hash-chain evidence binders, real-time geofencing with rally points -- is technically remarkable and commercially invisible. Every agent converged on the same conclusion: the marketing site is not a brochure; it is the primary revenue-generating asset for a founder-led company with no sales team. The delta between a basic site and a world-class site is $180K-$400K in Year 1 alone, scaling to $2.4M-$10.9M by Year 3.

The synthesis across all eight expert domains reveals three strategic imperatives that cut across every analysis. First, the site must name the unique mechanism -- professional analyst review, government intelligence, tamper-evident evidence binder -- within the first 5 seconds of any page visit. Generic safety messaging fails every buyer persona. Second, the sample safety binder is simultaneously the product's best demonstration, the highest-converting lead magnet, and the primary trust-building artifact; producing three segment-specific redacted binders is the single most important pre-launch dependency. Third, churches represent the optimal beachhead segment with no direct competitor, no FERPA blocker, 2-4 week procurement cycles, and denominational distribution channels that can unlock thousands of organizations with near-zero acquisition cost.

The technical architecture is uncontested: static-first generation on Vercel with client-side interactive islands, MapLibre for maps, Plausible for privacy-first analytics, shadcn/ui for accessible components, and a separate Supabase project for marketing data with blast-radius isolation from the product database. Every technical agent agrees on these choices. The primary risks are content dependencies (zero testimonials, no product screenshots, no sample binders), compliance certification gaps (FERPA/COPPA for K-12), and the competitive timing window where Chapperone is capturing K-12 awareness while SafeTrekr has zero market-facing presence.

---

## Cross-Agent Consensus

Findings where 5 or more agents independently arrived at the same recommendation. These are high-confidence, locked decisions.

### 1. The Product Is 18 Months Ahead of Its Marketing (8/8 agents)

Every agent identified that SafeTrekr's technical depth is entirely invisible to prospects. The 17-section analyst review, Monte Carlo scoring, SHA-256 evidence binders, and real-time field operations capabilities are not communicated anywhere a buyer can find them. The marketing site is the critical bridge between product capability and revenue.

### 2. Name the Mechanism in the Hero, Not Benefits (7/8 agents)

The hero must name: (a) the professional safety analyst, (b) the government intelligence sources, (c) the tamper-evident evidence binder. "Plan safer trips" fails the 5-second recall test. "Every trip reviewed by a safety analyst. Every risk scored. Every decision documented." passes it.

### 3. Churches Are the Optimal Beachhead Segment (6/8 agents)

Churches/missions have no direct competitor in safety review, no FERPA blocker, 2-4 week procurement cycles, a $26.5M SAM, and denominational distribution channels (SBC alone has 47,000+ churches). K-12 is the largest TAM ($39.5M) but is gated behind FERPA/COPPA certification (3-6 months).

### 4. Sample Binder Is the #1 Lead Magnet (7/8 agents)

All marketing-facing agents identified the sample safety binder as the highest-converting lead magnet (projected 8-15% conversion vs. 1-3% for "Request Demo"). Three segment-specific redacted versions at launch: K-12 field trip, international mission trip, corporate travel. This artifact IS the product demonstration.

### 5. Per-Student Pricing Reframe Is Critical (6/8 agents)

Lead with "$15/student" not "$450/trip." The `display_per_traveler` field already exists in the pricing API. Anchor against liability cost ($500K-$2M average settlement) and hidden labor cost ($700-$1,400 in staff time per trip for manual safety planning).

### 6. Fabricated Social Proof Must Be Removed Immediately (8/8 agents)

All agents flagged fabricated testimonials ("Dr. Rachel Martinez, Sample University") as an existential credibility risk for a product that sells documented trust. Replace with a verifiable trust metrics strip: "5 Government Intel Sources | 17 Safety Review Sections | 3-5 Day Turnaround | AES-256 Encryption | SHA-256 Evidence Chain." Collect real testimonials from 104 existing organizations.

### 7. Static-First Architecture on Vercel (6/8 agents)

SSG for all marketing pages, ISR for blog only (1-hour revalidation), MapLibre (not Mapbox) for zero per-load map costs, Plausible (not GA4) for privacy-first analytics requiring no cookie banner, separate Supabase project for marketing data with blast-radius isolation from the product database.

### 8. AI Search Optimization Is a First-Mover Opportunity (5/8 agents)

No competitor owns SafeTrekr's query niche in AI answer engines. Explicitly allow all AI crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Amazonbot, Applebot-Extended, cohere-ai) in robots.txt. FAQ schema on every page, methodology documentation, 50-word summaries in first 150 words of content. Target: 10-15 AI citations within 90 days.

### 9. Committee Buying Is the Primary Conversion Challenge (5/8 agents)

Institutional purchases involve 3-5 stakeholders across 3-12 month cycles. The trip coordinator is the champion, but they need tools to sell SafeTrekr internally. The site must arm champions with shareable artifacts: sample binders, ROI calculators, board presentation templates, budget justification documents.

### 10. WCAG 2.2 AA Accessibility Is Non-Negotiable (5/8 agents)

K-12 and government buyers require Section 508 compliance. Skip navigation, ARIA landmarks, keyboard navigation, focus-visible indicators, `prefers-reduced-motion` respect, axe-core in CI, Lighthouse accessibility gate >= 95. All content must be visible without animation.

---

## Merged Feature Inventory

Deduplicated and enriched from all 8 agent analyses. Each feature includes the merged requirements from every agent that recommended it.

### P0: Must Ship at Launch (Weeks 1-4)

#### F-001: Homepage

- **Description**: Primary conversion narrative for all buyer segments. Communicates SafeTrekr's unique mechanism within 8 seconds via an 11-section page architecture: Hero > Problem/Mechanism > How It Works > Trust Strip > Feature Grid > Binder Showcase > Segment Routing > Pricing Preview > Category Contrast > Final CTA > Footer.
- **Priority**: P0
- **Agents**: All 8
- **User Stories**: K-12 coordinator understands product in 5 seconds; church missions director sees segment relevance; risk manager assesses vendor viability in 60 seconds; procurement officer finds resources within 1 click; board member sees per-student cost framing.
- **Technical Requirements**: SSG, MapLibre hero composition (lazy-loaded, <200KB gzipped), Framer Motion scroll reveals with `prefers-reduced-motion` respect, hero animation sequence (1800ms total, headline visible immediately), LCP <1.5s, CLS <0.1, total page weight <500KB.
- **UX Requirements**: 5-second recall test at 80%+ correct recall, hero layout 5-col text / 7-col visual on desktop, dual CTA hierarchy ("See a Sample Safety Binder" primary / "Request a Demo" secondary), segment cards with 1-click routing, proof strip with government source logos.
- **Content Requirements**: Hero headline/subheadline (mechanism-forward, not generic), proof strip metrics, pricing data verified against codebase, segment descriptions, sample map visualization data.
- **Integration Points**: MapLibre GL JS + MapTiler, Plausible Analytics, Vercel Web Analytics, JSON-LD (SoftwareApplication + AggregateOffer), dynamic OG image via next/og.
- **Effort Estimate**: 2-3 weeks (largest single page)

#### F-002: Navigation System

- **Description**: Dual-layer navigation serving evaluators (primary: Solutions, Platform, How It Works, Pricing, Resources) and procurement officers (utility: For Procurement, Contact, Log In). Sticky header with scroll-aware behavior, full-screen mobile overlay, mega-menu for Solutions.
- **Priority**: P0
- **Agents**: UX, UI, IA, React, CTA
- **Technical Requirements**: Scroll-aware header (transparent at top, solid card fill after scroll past hero, 200ms transition), CTA button appears at scroll threshold, mobile hamburger triggering Sheet component, `aria-current="page"`, skip-nav link, breadcrumb navigation with BreadcrumbList JSON-LD.
- **UX Requirements**: Maximum 5 primary nav items, 44x44px minimum touch targets, no layout shift on scroll, focus-visible 2px ring outline.
- **Content Requirements**: Logo assets (horizontal dark, horizontal light, mark only), navigation labels, segment descriptions for mega-menu.
- **Effort Estimate**: 1 week

#### F-003: Church/Missions Solutions Page (`/solutions/churches`)

- **Description**: Beachhead segment landing page. Deepest, most conversion-optimized segment page at launch. Uses church-specific vocabulary (duty of care, volunteer screening, mission field safety, stewardship, youth protection). Three-act mechanism story flavored for mission trips.
- **Priority**: P0
- **Agents**: Strategy, Narrative, IA, UX, Digital
- **User Stories**: Church missions director sees SafeTrekr understands mission trips; youth pastor addresses senior pastor's liability concerns; church administrator sees cost framed against $7,000/person trip budget; insurance carrier sees audit-ready documentation.
- **Technical Requirements**: SSG, FAQPage schema (8-12 church-relevant Q&As), segment-specific sample binder CTA, LeadCaptureModal with "Mission Trip" pre-selected.
- **Content Requirements**: Church-specific headlines, pain narrative, three-act mechanism copy, denominational context, pricing scenarios ($450 domestic, $1,250 international = "less than 1% of trip budget"), insurance framing section.
- **Effort Estimate**: 1 week

#### F-004: K-12 Schools Solutions Page (`/solutions/k12`)

- **Description**: Largest TAM segment ($39.5M) with honest FERPA compliance communication. Per-student pricing ($15/student) as primary framing. Board liability comparison.
- **Priority**: P0
- **Agents**: UX, Strategy, IA, Digital, Narrative
- **Technical Requirements**: SSG, FAQPage schema, per-student pricing calculator, honest FERPA language ("Designed with FERPA requirements in mind"), guardian mobile app preview.
- **Content Requirements**: K-12-specific copy, FERPA compliance status verified with legal, per-student calculations verified against codebase, liability cost data ($500K-$2M settlement comparison).
- **Effort Estimate**: 1 week

#### F-005: Pricing Page (`/pricing`)

- **Description**: Per-student framing, liability anchor, volume discount table, ROI calculator link, procurement path CTA. Toggle between per-trip and annual plan views.
- **Priority**: P0
- **Agents**: Strategy, Narrative, UX, Digital, React
- **Technical Requirements**: 3 PricingTierCard components, per-student price prominent, volume discount table (5-9: 5%, 10-24: 10%, 25-49: 15%, 50+: 20%), FAQPage JSON-LD, no motion on pricing cards (stability), Product + Offer schema per tier.
- **Content Requirements**: Verified pricing (T1 $450, T2 $750, T3 $1,250), resolved volume discount inconsistency (single source of truth), FAQ content, segment-specific pricing scenarios.
- **UX Requirements**: Headline "$15/participant" not "$450/trip," value anchor above cards (settlement cost comparison), equal visual weight cards, "Calculate Your ROI" secondary CTA.
- **Effort Estimate**: 1 week

#### F-006: How It Works Page (`/how-it-works`)

- **Description**: Deepest explanation of three-act mechanism (Intelligence > Review > Documentation) with 17-section review breakdown. Critical for mid-funnel visitors.
- **Priority**: P0
- **Agents**: Narrative, UX, UI
- **Technical Requirements**: Three-act visual timeline with connecting line animation, 17-section card grid grouped by category, intelligence source bar, HowTo JSON-LD (3 steps, totalTime: P5D).
- **Content Requirements**: All 17 section names and descriptions, 5 government source details, process timeline, Monte Carlo scoring explanation for non-technical readers.
- **Effort Estimate**: 1 week

#### F-007: Demo Request Page (`/demo`)

- **Description**: Primary conversion endpoint. Progressive profiling (email + org first, details second). Framed as "See Your Safety Binder" not "Sales Call."
- **Priority**: P0
- **Agents**: UX, UI, React, CTA, Digital
- **Technical Requirements**: React Hook Form + Zod, Server Actions (progressive enhancement), Cloudflare Turnstile (invisible), Supabase persistence with UTM/referrer capture, email notification (Resend/SendGrid), honeypot field, 8-layer form security.
- **Fields**: Name, email, organization, organization type (dropdown), trip volume (range), preferred demo format, message (optional).
- **Effort Estimate**: 3-4 days

#### F-008: Contact Page (`/contact`)

- **Description**: Secondary conversion path. Contact form with segment routing, phone number, email, response time commitment.
- **Priority**: P0
- **Agents**: UX, CTA
- **Technical Requirements**: Server Action submission, Supabase storage, response time display ("General: 1 business day. Procurement: 4 hours.").
- **Effort Estimate**: 2-3 days

#### F-009: Design System / Token Foundation

- **Description**: Complete Tailwind CSS 4 design token system, shadcn/ui component primitives, typography scale, motion presets, dark section strategy.
- **Priority**: P0
- **Agents**: UI, React, CTA
- **Technical Requirements**: Tailwind CSS 4 `@theme inline` directive, 60+ CSS custom properties, 8-point spacing grid, cool-toned shadows, Plus Jakarta Sans (display) + Inter (body) + JetBrains Mono (code) via next/font, fluid typography with `clamp()`, `prefers-reduced-motion` global override.
- **Key Decision**: `muted-foreground` corrected from #616567 (4.0:1 contrast, FAIL) to #4d5153 (5.2:1, PASS). Button backgrounds use `primary-600` (#3f885b, 4.6:1 with white) instead of `primary-500` (#4ca46e, 3.4:1, FAIL for small text).
- **Effort Estimate**: 1 week

#### F-010: SEO Infrastructure

- **Description**: Programmatic sitemap, robots.txt with AI crawler allowances, generateMetadata per page, JSON-LD schemas per page type, canonical strategy, security headers.
- **Priority**: P0
- **Agents**: Digital, IA, React, CTA
- **Technical Requirements**: `sitemap.ts` (dynamic, pulling static + MDX), `robots.ts` (explicitly allowing GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Amazonbot, Applebot-Extended, cohere-ai), self-referencing canonicals, OG/Twitter meta, www redirect, HTTP security headers (HSTS, X-Frame-Options, CSP, Referrer-Policy).
- **Schemas**: Organization (root layout), SoftwareApplication + AggregateOffer (homepage), FAQPage (solutions + pricing), HowTo (How It Works), BreadcrumbList (all interior pages), Article (blog).
- **Effort Estimate**: 3-4 days

#### F-011: Analytics Infrastructure

- **Description**: Privacy-first analytics stack requiring no cookie consent banner.
- **Priority**: P0
- **Agents**: Digital, CTA, React
- **Technical Requirements**: Plausible Analytics (primary, $9/month), Vercel Web Analytics (Core Web Vitals), GA4 optional (after explicit consent only). Custom conversion events via Plausible + Supabase.
- **Event Taxonomy**: `cta_click`, `form_start`, `form_submit`, `demo_request`, `lead_magnet_download`, `roi_calculator_complete`, `pricing_view`, `scroll_depth_25/50/75`, `binder_section_expand`.
- **Effort Estimate**: 2-3 days

#### F-012: Accessibility (WCAG 2.2 AA)

- **Description**: Full accessibility compliance from day one.
- **Priority**: P0
- **Agents**: UX, UI, CTA, React
- **Technical Requirements**: Skip-nav link, ARIA landmarks and roles, `aria-current="page"`, `aria-expanded`/`aria-controls` for dropdowns, keyboard navigation with visible focus indicators, screen reader testing, axe-core in CI, Lighthouse accessibility gate >= 95, `prefers-reduced-motion` fully respected, `prefers-color-scheme` ready.
- **Effort Estimate**: Ongoing (built into every component)

#### F-013: Performance Budget

- **Description**: Enforced performance targets with CI gates.
- **Priority**: P0
- **Agents**: React, CTA, Digital, UI
- **Targets**: LCP <1.5s, CLS <0.05, INP <100ms, TTFB <100ms, total initial page weight <500KB, JS bundle <150KB gzipped, map component <200KB gzipped (lazy), web fonts <100KB, Lighthouse Performance >= 95.
- **Enforcement**: Lighthouse CI blocks merge, bundle analyzer in CI, bundlewatch for size tracking.
- **Effort Estimate**: 2-3 days setup, ongoing enforcement

---

### P1: Ship Within 30 Days (Weeks 5-8)

#### F-014: Solutions -- Higher Education (`/solutions/higher-education`)

- **Description**: Study abroad, Clery Act, Title IX focus. Positions SafeTrekr as complement (not competitor) to existing study abroad management systems.
- **Agents**: IA, Strategy, Narrative
- **Effort Estimate**: 1 week

#### F-015: Solutions -- Corporate/Sports (`/solutions/corporate`, `/solutions/sports`)

- **Description**: Duty of care documentation for business travel; tournament travel safety for student athletes. Mid-market positioning ("enterprise safety at per-trip pricing").
- **Agents**: IA, Strategy, Narrative
- **Effort Estimate**: 1 week (both pages)

#### F-016: About Page (`/about`)

- **Description**: Founding story, mission, category creation narrative, team section (when available). Establishes "why this category needs to exist."
- **Agents**: UX, IA, Narrative
- **Effort Estimate**: 3-4 days

#### F-017: Platform Feature Pages (Analyst Review, Risk Intelligence, Evidence Binder)

- **Description**: Deep-dive pages for each core capability. Interactive 17-section review visualization, Monte Carlo + data source showcase, document preview with hash-chain explanation.
- **Agents**: Narrative, UI, IA
- **Effort Estimate**: 1.5 weeks (3 pages)

#### F-018: Sample Binder Lead Magnet (`/resources/sample-binders`)

- **Description**: 3 segment-specific gated PDF downloads with web-based preview (first 2-3 pages ungated, full download gated). Immediate PDF delivery + 5-email nurture sequence over 14 days.
- **Agents**: All marketing agents (7/8)
- **Content Dependency**: CRITICAL -- Must generate from demo data using existing 106 trips. Church/mission trip version first. Professional design is non-negotiable.
- **Effort Estimate**: 1 week (infrastructure) + content production time

#### F-019: Trust Metrics Strip Component

- **Description**: Horizontal strip of verifiable data points replacing fabricated testimonials. "5 Government Intel Sources | 17 Safety Review Sections | 3-5 Day Turnaround | AES-256 Encryption | SHA-256 Evidence Chain."
- **Agents**: All marketing agents
- **Effort Estimate**: 2-3 days (component already designed)

#### F-020: Blog Shell (`/blog`)

- **Description**: MDX + ISR (1-hour revalidation), category/tag taxonomy, Article JSON-LD, RSS feed, reading time, related posts. Seed with 3-5 pillar posts.
- **Agents**: Digital, IA, React, CTA
- **Content Requirements**: Initial pillar content covering each segment's primary keywords. Content calendar aligned with seasonal demand.
- **Effort Estimate**: 1 week (infrastructure) + ongoing content

#### F-021: Email Capture + Nurture System

- **Description**: Newsletter signup with double opt-in, segment-based email sequences via Resend/SendGrid.
- **Agents**: Digital, CTA
- **Effort Estimate**: 3-4 days

#### F-022: Interactive Hero Map

- **Description**: MapLibre GL JS with custom desaturated style, route line animation, waypoint markers. Progressive enhancement: static fallback image > lazy-loaded interactive map > animated crossfade.
- **Agents**: UI, React, CTA
- **Technical Requirements**: Custom map style (desaturated base, primary-500 route lines, safety-color status dots), MapTiler free tier tiles, IntersectionObserver trigger for dynamic import.
- **Performance Budget**: ~230KB total interactive (deferred, not blocking).
- **Effort Estimate**: 1 week

#### F-023: Operational Motion System

- **Description**: Framer Motion animation presets: fadeUp, fadeIn, scaleIn, staggerContainer, cardReveal, routeDraw, markerPop, statusPulse, checklistReveal, documentStack, gaugeFill, counterAnimate. All wrapped in ScrollReveal component with `prefers-reduced-motion` respect.
- **Agents**: UI, React
- **Effort Estimate**: 3-4 days

---

### P2: Ship Within 60 Days (Weeks 9-12)

#### F-024: ROI Calculator (`/resources/roi-calculator`)

- **Description**: Interactive client-side calculator. Inputs: segment, trips/year, group size, manual planning hours, hourly rate. Outputs: annual cost, time savings, cost per student, liability comparison. Shareable URL + gated "Full ROI Report" download.
- **Agents**: Strategy, Digital, UX
- **Effort Estimate**: 1 week

#### F-025: Comparison Pages (`/compare/*`)

- **Description**: SafeTrekr vs. DIY Spreadsheets, vs. Trip Logistics Apps, vs. Enterprise Travel Risk Management. Category labels (not competitor names) to avoid legal risk.
- **Agents**: Strategy, Digital, IA, Narrative
- **Effort Estimate**: 1 week (3 pages)

#### F-026: Procurement Resource Hub (`/procurement`)

- **Description**: Downloadable W-9, security questionnaire responses, contract templates, DPA, insurance certificate. Response time dashboard.
- **Agents**: UX, IA, Strategy
- **Effort Estimate**: 3-4 days

#### F-027: Compliance Center

- **Description**: FERPA, Clery Act, COPPA, GDPR guides with FAQ schema. Honest compliance language with certification roadmap visual.
- **Agents**: Digital, IA, Strategy
- **Effort Estimate**: 1 week

#### F-028: Case Study Template

- **Description**: Ready-to-populate template for when real customer stories exist. Priority: secure first case study within 60 days of launch.
- **Agents**: Digital, UX
- **Effort Estimate**: 2-3 days

#### F-029: G2 + Capterra Profiles

- **Description**: Create profiles immediately, incentivize first 5 reviews from existing organizations.
- **Agents**: Digital, Strategy
- **Effort Estimate**: 1 day (creation), ongoing (review collection)

#### F-030: Dynamic OG Images

- **Description**: Per-page OG images via next/og (Satori) on Edge Runtime.
- **Agents**: React, CTA, Digital
- **Effort Estimate**: 2-3 days

#### F-031: Newsletter System

- **Description**: Segment-based, double opt-in, integrated with SendGrid/Resend lists.
- **Agents**: Digital
- **Effort Estimate**: 2-3 days

---

### P3: Ship Within 90 Days (Weeks 13-16)

#### F-032: Paid Acquisition Landing Pages (`/lp/[campaign]`)

- **Description**: Google Ads + LinkedIn Ads templates with stripped navigation, single CTA, noindex/nofollow.
- **Agents**: Digital, Strategy
- **Effort Estimate**: 1 week (template system)

#### F-033: Glossary / Knowledge Base (`/glossary`)

- **Description**: 50+ terms with DefinedTerm schema. SEO content asset targeting zero-competition long-tail keywords.
- **Agents**: Digital, IA
- **Effort Estimate**: 1 week

#### F-034: Video Content System

- **Description**: Chaperone dashboard demo, mobile app walkthrough, VideoObject schema.
- **Agents**: Digital, Narrative
- **Effort Estimate**: 1 week (infrastructure), requires video production

#### F-035: Interactive Product Tour (`/tour`)

- **Description**: Self-guided walkthrough of trip creation wizard, analyst review, evidence binder, mobile app. Closest proxy to "trying the product" without self-service signup.
- **Agents**: Digital, Strategy, UX
- **Effort Estimate**: 1-6 weeks (depending on fidelity: screen recordings with hotspots vs. interactive prototype vs. sandboxed demo)

#### F-036: CRM Integration (HubSpot)

- **Description**: Push form submissions from Supabase to HubSpot Contacts API via CRM sync queue with retry logic.
- **Agents**: CTA, Digital
- **Effort Estimate**: 1 week

#### F-037: A/B Testing Framework

- **Description**: Vercel Edge Middleware for headline, CTA, and pricing framing tests.
- **Agents**: Digital, CTA, Strategy
- **Effort Estimate**: 3-4 days

---

## Unified Enhancement List

All enhancement proposals from all agents, deduplicated, merged, and scored by Impact x Feasibility. Scale: Impact 1-5, Feasibility 1-5, Score = Impact x Feasibility.

### Tier A: High Impact, High Feasibility (Score 16-25)

| # | Enhancement | Problem | Solution | Impact | Feasibility | Score | Agents |
|---|-------------|---------|----------|:------:|:-----------:|:-----:|--------|
| E-01 | **Interactive Binder Explorer** | Sample binder treated as static PDF; committee members need shareable URL | Web-based binder viewer with collapsible sections, live maps, animated risk scores. First 3-5 sections ungated; full requires email. | 5 | 4 | 20 | UX, Narrative |
| E-02 | **Board Presentation Generator** | Champions lack tools for internal sale (3-5 stakeholder buying) | "Make Your Case" tool generating customized board presentation from 4-5 questions. PDF/Slides output, gated with email. | 5 | 4 | 20 | UX, Narrative, Strategy |
| E-03 | **Budget Justification Template** | Champions cannot justify budget internally | Fill-in-the-blank document for finance committee/board. Pre-populated with ROI data. Downloadable .docx, gated. | 5 | 5 | 25 | Narrative, Strategy |
| E-04 | **Day-in-the-Life Micro-Stories** | Abstract pain points fail to resonate | 200-word present-tense scenarios per segment (Mrs. Delgado, Pastor Williams, etc.) replacing generic bullet points on segment pages. | 4 | 5 | 20 | Narrative |
| E-05 | **Seasonal Campaign Framework** | Marketing lacks rhythmic execution aligned to buyer planning cycles | Pre-written campaign copy for 4-5 seasons per segment (K-12: Jan-Mar budget, Mar-Apr spring trips, Aug-Sep back-to-school, Oct-Nov insurance). | 4 | 5 | 20 | Narrative, Strategy |
| E-06 | **Insurance Carrier Narrative** | Insurance is #1 external motivator but site never makes connection explicit | Dedicated insurance section on segment pages + `/for-insurers` landing page. B2B2C channel where carriers recommend SafeTrekr. | 5 | 4 | 20 | UX, Narrative, Strategy |

### Tier B: High Impact, Medium Feasibility (Score 12-15)

| # | Enhancement | Problem | Solution | Impact | Feasibility | Score | Agents |
|---|-------------|---------|----------|:------:|:-----------:|:-----:|--------|
| E-07 | **Interactive Destination Risk Preview** | Visitors read about intelligence capability but cannot experience it | "Check a Destination" widget showing simplified risk snapshot from public government APIs (NOAA, CDC, GDACS). CTA: "Want the full review?" | 5 | 3 | 15 | UX |
| E-08 | **Trip Safety Audit Tool** | Static comparison pages are common and easily ignored | 15-20 question interactive assessment. "Safety Readiness Score" with gap analysis linking to SafeTrekr capabilities. Ungated score, gated report. | 4 | 3 | 12 | Strategy, UX |
| E-09 | **Stakeholder View Switcher** | Different stakeholders need different information depths on same page | "I am a..." filter on segment pages (Coordinator / Risk Manager / Procurement / Board). Reorders and highlights relevant sections. | 4 | 4 | 16 | UX |
| E-10 | **Denominational Partnership Program** | Church beachhead needs distribution channels | `/partners/denominations` with co-branded landing pages, tiered partnership (Referral/Endorsed/Strategic), 10-15% commission. Single SBC relationship at 1% penetration = $1.41M ARR. | 5 | 3 | 15 | Strategy, Narrative |
| E-11 | **"Time to Review" Comparison Calculator** | Buyers do not realize manual 17-section review would take 35-80 hours | Interactive element on How It Works showing manual time per section, accumulating total. Punchline: "35-80 hours manual. 3-5 days, $450 with SafeTrekr." | 4 | 4 | 16 | UX, Narrative |
| E-12 | **Scenario Walkthrough Library** | Zero verified social proof; need capability demonstration without fabrication | 6-8 detailed scenario walkthroughs narrating SafeTrekr handling specific trips. Not case studies (no real customer required). | 4 | 3 | 12 | UX, Narrative |
| E-13 | **Parent/Guardian Advocacy Kit** | Parents experience guardian view but have no tools to recommend SafeTrekr | `/for-parents` page with shareable summary, pre-written email template for administrators, printable PTA one-pager. Zero-CAC referral channel. | 4 | 4 | 16 | UX, Narrative, Strategy |
| E-14 | **"What Happens Without SafeTrekr" Narrative** | Comparison narratives increase time-on-page 40-60% and demo requests 15-25% | Scroll-driven parallel timeline: same trip with and without SafeTrekr. Matter-of-fact tone, not fear-based. | 4 | 3 | 12 | Narrative |

### Tier C: Medium Impact, Variable Feasibility (Score 6-11)

| # | Enhancement | Problem | Solution | Impact | Feasibility | Score | Agents |
|---|-------------|---------|----------|:------:|:-----------:|:-----:|--------|
| E-15 | **Live Advisory Ticker** | Site describes live system but feels like brochure | Subtle ticker with anonymized real-time advisories from NOAA/CDC/USGS/GDACS. Updates every 15-30 min. Label: "SafeTrekr is monitoring X active advisories." | 3 | 3 | 9 | UX |
| E-16 | **Denominational Landing Pages** | Referred churches need denomination-specific context | Template-based pages at `/solutions/churches/[denomination]`. 90% inherited content + denomination-specific overrides. | 3 | 4 | 12 | UX, Strategy |
| E-17 | **Procurement Self-Service Portal** | Static document page is table stakes | Interactive portal with exportable security questionnaire (SIG, CAIQ), automated W-9/COI delivery, compliance matrix with status indicators. | 3 | 3 | 9 | UX |
| E-18 | **AI-Powered Q&A Assistant** | Specific buyer questions require sales call | RAG-based chat assistant over site content. Privacy-preserving, explicitly identified as AI, fallback to human handoff. | 3 | 2 | 6 | UX |
| E-19 | **Trust Verification Page** | SafeTrekr sells verifiable trust but site claims without verification | `/security/verify` with SSL Labs scan link, evidence binder hash demo, security.txt, uptime badge, SRI hashes. | 3 | 4 | 12 | UX |
| E-20 | **Annual Safety Benchmarking Report** | No category authority content asset | "State of Group Travel Safety" annual report. Gated, high-value lead magnet (5-8% conversion). PR/backlink engine. | 3 | 2 | 6 | Strategy |
| E-21 | **"SafeTrekr Certified" Badge Program** | No social proof multiplication mechanism | Certification tiers (Trip / Organization / Excellence). Embeddable badge for customer websites. Reduces churn 50%. | 3 | 3 | 9 | Strategy |
| E-22 | **Conference/Event Presence Hub** | No bridge between online discovery and in-person relationship | "Meet Us" section with upcoming conferences, "Schedule a Meeting at [Event]" CTA. QR codes for booth materials. | 2 | 4 | 8 | UX, Strategy |
| E-23 | **Referral Program** | No structured word-of-mouth channel | `/referral` with credit-based incentives, tracking dashboard, tiered rewards. Target: 0.5 viral coefficient per trip. | 3 | 3 | 9 | Strategy |
| E-24 | **Post-Incident Positioning Content** | Many prospects arrive after an incident has occurred | `/after-an-incident` with respectful, constructive messaging. "Book a Confidential Consultation" low-pressure CTA. | 3 | 4 | 12 | Narrative |

---

## Cross-Agent Risk Matrix

All risks from all agents, deduplicated and severity-scored. Severity = Probability x Impact on a 1-5 scale.

### Critical Severity (Score 20-25)

| Risk | Category | Probability | Impact | Severity | Mitigation | Owning Domain |
|------|----------|:-----------:|:------:|:--------:|------------|---------------|
| **Fabricated testimonials discovered** | Reputation | 3/5 | 5/5 | 15 -> CRITICAL | Remove ALL fabricated content before launch. Audit all existing materials. Implement review process for published claims. | All |
| **Zero testimonials at launch** | Conversion | 5/5 | 4/5 | 20 | Quantified proof strips as primary trust. Scenario walkthroughs. Government source logos. Prioritize collecting 2-3 real testimonials from 104 existing organizations within 30 days. | Narrative, Strategy |
| **Sample binder content not ready at launch** | Content | 4/5 | 5/5 | 20 | Begin production immediately from existing 106 trips. Church/mission version first. Professional design non-negotiable. If system-generated binder not ready, produce manually using real data in designed PDF. | UX, Narrative |
| **Self-service gap creates revenue bottleneck** | Business | 5/5 | 5/5 | 25 | Toggle-ready architecture (feature flags on CTAs). Interim: "Trip Safety Desk" consultation, "Submit Your Trip" intake form, "Free First Trip" offer. Self-service development (4-6 weeks) in parallel. Estimated $43K/month forgone ARR without self-service. | Strategy, CTA |

### High Severity (Score 12-19)

| Risk | Category | Probability | Impact | Severity | Mitigation | Owning Domain |
|------|----------|:-----------:|:------:|:--------:|------------|---------------|
| **Chapperone captures K-12 awareness** | Competitive | 4/5 | 4/5 | 16 | Launch K-12 page at launch (even pre-FERPA). SEO content targeting K-12 keywords. Differentiation: "logistics vs. safety." FERPA early-access waitlist. | Strategy |
| **FERPA certification delayed** | Compliance | 4/5 | 4/5 | 16 | Church beachhead reduces K-12 dependence. Use "designed with FERPA in mind" language. Initiate iKeepSafe certification ($5K-$10K). Sign Student Privacy Pledge (free, 1 month). | Strategy, UX |
| **Unsubstantiated compliance claims** | Compliance | 3/5 | 5/5 | 15 | Never claim "FERPA Compliant" or "SOC 2 Certified" without completed certification. Use "designed with" / "certification in progress" language. Procurement officers will verify. | Narrative, Strategy |
| **No product screenshots available** | Content | 4/5 | 3/5 | 12 | Create demo account with curated data. Staged screenshots from staging environment. Composed product compositions (not mockups -- real UI elements). | UX, UI |
| **Generic hero fails 5-second test** | Conversion | 3/5 | 5/5 | 15 | Mechanism-forward copy naming analyst, intelligence, binder in first 10 words. Run 5-second test with 20 participants, iterate until 80%+ recall. | Narrative, UX |
| **Sticker shock on pricing** | Conversion | 3/5 | 4/5 | 12 | Per-participant framing ($15/student). Liability anchor ($500K-$2M). Hidden labor anchor ($700-$1,400). Never show per-trip price without per-participant context. | Strategy, Narrative |
| **Committee buying journey drops off** | Conversion | 4/5 | 4/5 | 16 | Board Presentation Generator (E-02), Budget Justification Template (E-03), shareable binder URLs, ROI calculator with download, "Forward to colleague" prompts. | UX, Narrative |
| **"Vaporware" perception** | Trust | 3/5 | 4/5 | 12 | Sample binder proves product works. Real product screenshots (not mockups). Mobile app demo video. Proof strip with verifiable metrics. | Narrative, Strategy |
| **TarvaRI intelligence pipeline dormancy** | Product | 3/5 | 4/5 | 12 | 89% of intelligence sources are dormant. Market capability with sample data. Do not overclaim real-time monitoring that is not yet active. Honest language about data sources used per trip. | Strategy, CTA |
| **Pricing inconsistency between pages** | Trust | 3/5 | 3/5 | 9 | Resolve discount schedule discrepancy before launch. Single source of truth (config file or Supabase). Verify pricing against codebase. | Strategy, UX |

### Medium Severity (Score 6-11)

| Risk | Category | Probability | Impact | Severity | Mitigation | Owning Domain |
|------|----------|:-----------:|:------:|:--------:|------------|---------------|
| **MapLibre bundle exceeds budget** | Performance | 3/5 | 3/5 | 9 | Lazy-load with IntersectionObserver. Static fallback image. Tree-shake unused features. Target <200KB gzipped. | React, UI |
| **Hero animation causes LCP regression** | Performance | 3/5 | 3/5 | 9 | No animation delay on headline/subhead (LCP-critical). Composition fades in after LCP. Lighthouse CI gate. | React, UI |
| **MDX bottleneck at scale** | Technical | 3/5 | 2/5 | 6 | Begin CMS migration (Sanity) when content velocity exceeds 4 posts/week. Document MDX authoring for non-developer contributors. | React, Digital |
| **Form spam overwhelms free tier** | Technical | 2/5 | 3/5 | 6 | 8-layer security: Turnstile + honeypot + rate limiting + server validation + input sanitization + IP hashing. Supabase free tier sufficient for initial volume. | React, CTA |
| **COPPA violations from minor data collection** | Compliance | 1/5 | 5/5 | 5 | Marketing site does not collect data from minors. All forms target institutional buyers. Age gate if newsletter added. | CTA, UX |
| **Segment mismatch on landing** | Conversion | 3/5 | 3/5 | 9 | Segment-specific vocabulary on every page. Segment routing on homepage. URL structure signals segment relevance. | Narrative, IA |
| **Mobile visitors cannot evaluate adequately** | UX | 3/5 | 3/5 | 9 | Prioritize mobile hero clarity, fast sample binder access, tap-to-call, Web Share API. Mobile is discovery device, not conversion device. | UX |

---

## Architecture Decisions (Confirmed)

Decisions that all technical agents (React, CTA, Digital, UI, IA) agree on. These are locked.

| # | Decision | Rationale | Agents |
|---|----------|-----------|--------|
| AD-01 | **SSG for all marketing pages** | No user-specific content. Zero runtime cost. Sub-50ms TTFB via Vercel Edge. Perfect cacheability. Resilience: static pages survive origin outages. | React, CTA, Digital, UI |
| AD-02 | **ISR only for blog** | 1-hour revalidation for new posts. 24-hour for existing posts. Blog is the only content that updates frequently enough to warrant ISR. | React, CTA, Digital |
| AD-03 | **MapLibre GL JS over Mapbox** | Zero per-load cost. BSD license. Identical API. MapTiler free tier for tiles (100K requests/month). Alternative: Protomaps self-hosted PMTiles on Vercel Edge (zero per-request cost). | React, CTA, UI |
| AD-04 | **Separate Supabase project for marketing** | Blast-radius isolation from product database. Marketing DB has no access to user PII, trip data, or product tables. Separate project-level isolation. | CTA, React |
| AD-05 | **MDX for content at launch** | Low content velocity (1-2 posts/week). Version control. Zero cost. Migrate to Sanity/CMS when velocity exceeds 4 posts/week. | React, CTA, Digital |
| AD-06 | **Plausible primary, GA4 optional** | Privacy-first for K-12/church audience. No cookie banner needed (no cookies set). $9/month. GA4 loaded only after explicit cookie consent for prospects who need it. | CTA, React, Digital |
| AD-07 | **shadcn/ui component primitives** | Accessible by default (Radix). Tailwind-native. Tree-shakeable. Copy-paste ownership (no dependency lock-in). CVA for variant management. | React, UI |
| AD-08 | **Plus Jakarta Sans + Inter fonts** | Executive + modern + readable. Jakarta for display/headings (weight 400-800), Inter for body (weight 400-600). JetBrains Mono for code/hashes. Free via next/font with swap display. | UI, React |
| AD-09 | **Framer Motion (tree-shaken ~15KB)** | "Operational motion" vocabulary (route lines tracing, status markers appearing, cards layering). `prefers-reduced-motion` fully respected. Monitor bundle size in CI. | UI, React |
| AD-10 | **Server Actions for forms** | Security (server-side validation). Simplicity (no API route boilerplate). Progressive enhancement (forms work without JS). Zod schema shared between client and server. | React, CTA |
| AD-11 | **Cloudflare Turnstile for bot protection** | Free. Privacy-preserving. Invisible challenge. GDPR-compliant. No user interaction required. | CTA, React |
| AD-12 | **Resend for transactional email** | Modern API. React Email templates. Generous free tier (100 emails/day). Alternative: SendGrid if volume requires it. | React, CTA |
| AD-13 | **4-layer component architecture** | Layer 0: Primitives (shadcn/ui), Layer 1: Design System Extensions (CVA variants), Layer 2: Marketing Composites (FeatureCard, PricingTier), Layer 3: Page Sections (HeroHome, CTABand), Layer 4: Pages. | React, CTA, UI |
| AD-14 | **Route group organization** | `(marketing)/` for standard pages, `(blog)/` for blog layout, `(legal)/` for legal pages, `(landing)/` for paid acquisition (noindex). Enables distinct layouts per group. | React, CTA, IA |
| AD-15 | **Unified form_submissions table** | Single table with form_type enum and JSONB details column. Avoids table proliferation. CRM sync queue for async HubSpot integration. RLS with service_role access only. | CTA |

---

## Architecture Decisions (Debated)

Areas where agents propose different approaches. Both sides presented.

### Debate 1: Canonical Domain (www vs. non-www)

| Position | Agents | Argument |
|----------|--------|----------|
| `www.safetrekr.com` is canonical, redirect non-www | Digital Marketing | Industry standard for enterprise SaaS. Cookie scoping (`.safetrekr.com` allows `app.safetrekr.com` sharing). Some SEO tools prefer www. |
| `safetrekr.com` is canonical, redirect www | CTA | Cleaner URL. Modern convention for SaaS. Shorter in print materials. |

**Resolution**: Use `www.safetrekr.com` as canonical. The cookie-scoping argument is decisive: `.safetrekr.com` allows shared cookies between `www.safetrekr.com` and `app.safetrekr.com`, which is required for self-service SSO readiness. This aligns with the enterprise positioning.

### Debate 2: Muted Foreground Color

| Position | Agents | Value | Contrast on #e7ecee |
|----------|--------|-------|---------------------|
| #4d5153 | UI Designer | 5.2:1 | PASS |
| #555a5d | React Developer | ~4.6:1 | PASS (borderline) |

**Resolution**: Use #4d5153 (UI Designer's recommendation). At 5.2:1 it provides comfortable headroom above the 4.5:1 AA minimum, and passes on both background (#e7ecee) and card (#f7f8f8) surfaces. Lock this in the design token system.

### Debate 3: Primary CTA Label

| Position | Agents | Argument |
|----------|--------|----------|
| "See a Sample Safety Binder" (primary) | UX, Narrative, Strategy, Digital, IA | Lower commitment. Demonstrates product value. 8-15% conversion vs. 1-3% for demo request. Champions can share with committee. |
| "Book a Demo" or "Request a Demo" (primary) | CTA | Direct path to sales conversation. Higher intent signal. |

**Resolution**: Use "See a Sample Safety Binder" as primary CTA and "Book a Demo" as secondary CTA on the homepage and segment pages. This follows the evidence: lower-commitment CTAs convert at higher rates for institutional buyers who need committee buy-in. The demo request becomes the natural next step after the binder download proves product value.

### Debate 4: CMS Migration Trigger

| Position | Agents | Trigger |
|----------|--------|---------|
| 4 posts/week velocity | Digital, CTA | Standard threshold for MDX-to-CMS migration |
| When non-developers need to contribute | React | Practical trigger based on team composition |

**Resolution**: Both triggers are valid. Monitor both: migrate to Sanity/headless CMS when EITHER content velocity exceeds 4 posts/week OR non-developer contributors need to publish content without developer assistance. Whichever comes first.

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

| Week | Deliverable | Dependencies |
|------|------------|--------------|
| 1 | Project scaffolding (Next.js 15, TS config, Tailwind CSS 4, shadcn/ui init) | None |
| 1 | Design system tokens in globals.css | UI Designer token spec |
| 1 | Font loading (Plus Jakarta Sans + Inter + JetBrains Mono) | None |
| 1 | Layer 0-1 components: Button, Card, Input, Badge, Separator, Accordion | Design tokens |
| 1 | SiteHeader + SiteFooter + SkipNav + Container + Section | Layer 0-1 components |
| 1 | SEO infrastructure: sitemap.ts, robots.ts, metadata utility, JSON-LD components | None |
| 2 | Layer 2 components: FeatureCard, StatCard, PricingTier, IndustryCard, TimelineStep, TrustStrip, CTABand, DocumentPreview, MotifBadge | Layer 0-1 |
| 2 | Form system: DemoRequestForm, ContactForm, Turnstile integration, Server Actions, Zod schemas | Supabase project, Turnstile keys |
| 2 | Motion system: ScrollReveal, StaggerChildren, Framer Motion presets | Framer Motion |
| 2 | Analytics: Plausible script, Vercel Analytics, custom event helpers | Plausible account |

### Phase 2: Core Pages (Weeks 3-4)

| Week | Deliverable | Dependencies |
|------|------------|--------------|
| 3 | Homepage (11 sections, full conversion narrative) | All Layer 2-3 components, hero copy |
| 3 | Church/Missions Solutions page (beachhead) | Segment copy, FAQ content |
| 3 | K-12 Solutions page | Segment copy, FERPA status from legal |
| 4 | Pricing page (per-student framing, FAQ) | Verified pricing data |
| 4 | How It Works page (three-act mechanism) | 17-section descriptions, product screenshots |
| 4 | Demo Request + Contact pages | Form infrastructure |
| 4 | Accessibility audit + performance audit | axe-core, Lighthouse CI |

**Launch Checkpoint**: Homepage, 2 segment pages, pricing, how it works, demo request, contact. All with SEO infrastructure, analytics, accessibility, performance gates.

### Phase 3: Expansion (Weeks 5-8)

| Week | Deliverable | Dependencies |
|------|------------|--------------|
| 5 | Sample Binder landing page + LeadCaptureModal | Sample binder PDFs (CRITICAL content dependency) |
| 5 | Blog infrastructure (MDX + ISR) + 3-5 pillar posts | Blog content |
| 5 | Trust Metrics Strip (replaces fabricated testimonials) | None |
| 6 | Higher Ed + Corporate + Sports Solutions pages | Segment copy |
| 6 | About page | Founding story, team info |
| 6 | Interactive Hero Map (MapLibre, progressive enhancement) | MapTiler account, map style, route GeoJSON |
| 7 | ROI Calculator (client-side, shareable URL) | Pricing data |
| 7 | Email nurture sequences (5-email, 14-day) | Email templates, SendGrid/Resend |
| 8 | Procurement Resource Hub | W-9, security questionnaire, contract templates |
| 8 | Platform feature detail pages (Analyst Review, Risk Intelligence, Evidence Binder) | Product screenshots, 17-section content |

### Phase 4: Acceleration (Months 3-4)

| Month | Deliverable |
|-------|------------|
| 3 | Comparison pages (vs. DIY, vs. logistics apps, vs. enterprise) |
| 3 | Compliance Center (FERPA, Clery Act, COPPA guides) |
| 3 | Interactive Binder Explorer (E-01) |
| 3 | Board Presentation Generator (E-02) + Budget Justification Template (E-03) |
| 3 | Scenario Walkthrough Library (4-6 walkthroughs) (E-12) |
| 3 | Dynamic OG images |
| 4 | Interactive Destination Risk Preview (E-07) |
| 4 | Stakeholder View Switcher on segment pages (E-09) |
| 4 | Insurance Carrier narrative + landing page (E-06) |
| 4 | Parent/Guardian Advocacy Kit (E-13) |
| 4 | G2 + Capterra profiles with first reviews |
| 4 | Case study from first pilot customer |

### Phase 5: Scale (Months 5-6)

| Month | Deliverable |
|-------|------------|
| 5 | Paid acquisition landing page templates |
| 5 | Trip Safety Audit Tool (E-08) |
| 5 | Denominational Partnership Program page (E-10) |
| 5 | Glossary / Knowledge Base (50+ terms) |
| 5 | CRM integration (HubSpot Contacts API) |
| 6 | A/B testing framework (Vercel Edge Middleware) |
| 6 | Conference/Event presence hub |
| 6 | Referral program |
| 6 | Video content system |
| 6 | AI Q&A Assistant evaluation (if traffic justifies) |

---

## Content Dependencies

Everything that must be created or collected before the marketing site can launch. Ordered by criticality.

### CRITICAL (Blocks Launch)

| Content Asset | Owner | Status | Deadline | Notes |
|---------------|-------|--------|----------|-------|
| **Redacted sample safety binder (Church/Mission)** | Engineering + Design | Not started | Week 2 | Generate from existing 106 trips in production DB. Professional PDF design non-negotiable. This is the #1 conversion asset. |
| **Redacted sample safety binder (K-12)** | Engineering + Design | Not started | Week 3 | Same process, K-12 field trip scenario. |
| **Hero headline and subheadline copy** | Narrative | Draft exists | Week 2 | "Every Trip Reviewed by a Safety Analyst. Every Risk Scored. Every Decision Documented." -- validate with 5-second recall test. |
| **Product screenshots from staging** | Engineering | Not started | Week 2 | Demo account with curated sample data. Real UI, not mockups. Analyst review interface, trip creation wizard, evidence binder, mobile app. |
| **Pricing data verified against codebase** | Engineering | Discrepancy flagged | Week 1 | Resolve discount schedule inconsistency (pricing page vs. procurement page). Verify `display_per_traveler` field. Single source of truth. |
| **Fabricated testimonial removal** | Marketing | Identified | Immediate | Remove ALL fabricated content from every existing marketing asset. Non-negotiable before any launch. |
| **FERPA compliance status** | Legal | Unknown | Week 1 | Determine exact language: "Designed with FERPA requirements in mind" vs. "FERPA certification in progress with [target date]." Legal must approve. |
| **All 17 review section names and descriptions** | Product | Exists in codebase | Week 2 | Extract and write non-technical descriptions for each section. |

### HIGH (Blocks P1 Features)

| Content Asset | Owner | Status | Deadline |
|---------------|-------|--------|----------|
| Redacted sample safety binder (Corporate) | Engineering + Design | Not started | Week 5 |
| Church-specific FAQ content (8-12 Q&As) | Narrative | Draft exists in analysis | Week 3 |
| K-12-specific FAQ content (8-12 Q&As) | Narrative | Draft exists in analysis | Week 3 |
| Pricing FAQ content (8-10 Q&As) | Narrative | Draft exists in analysis | Week 4 |
| 5 government source descriptions + logos | Marketing | Publicly available | Week 2 |
| Blog pillar posts (3-5) | Narrative + SEO | Not started | Week 6 |
| Founding story and mission statement | Founder | Not started | Week 5 |
| Email nurture sequence copy (5 emails) | Narrative | Not started | Week 5 |
| Monte Carlo scoring explanation (non-technical) | Product + Narrative | Not started | Week 4 |

### MEDIUM (Blocks P2-P3 Features)

| Content Asset | Owner | Status | Deadline |
|---------------|-------|--------|----------|
| Real customer testimonials (2-3 minimum) | Sales | 104 existing orgs to contact | Month 2 |
| Chaperone mobile app demo video (60 seconds) | Product + Marketing | Not started | Month 2 |
| Case study from first pilot customer | Sales + Marketing | No pilot yet | Month 3 |
| Security questionnaire pre-completed responses | Engineering + Legal | Not started | Month 2 |
| W-9, COI, contract templates for procurement | Finance + Legal | Not started | Month 2 |
| Scenario walkthrough content (6-8 x 2,000 words) | Narrative | Not started | Month 3 |
| Board presentation template (10 slides) | Narrative + Design | Copy direction exists | Month 2 |
| Budget justification template (.docx) | Narrative | Copy direction exists | Month 2 |
| Insurance carrier messaging (validated with 1-2 carriers) | Sales + Marketing | Not started | Month 3 |
| Denominational partnership materials | Sales + Marketing | Not started | Month 4 |

---

## Success Metrics

Unified KPI framework from all agents, organized as a KPI tree.

### North Star Metric

**Revenue from marketing-sourced pipeline**: Measures the marketing site's contribution to ARR.

### Primary KPIs

| Metric | Month 1 | Month 3 | Month 6 | Month 12 | Owner |
|--------|---------|---------|---------|----------|-------|
| **Demo requests/month** | 3-5 | 10-15 | 25-40 | 40-60 | Marketing |
| **Sample binder downloads/month** | 10-15 | 30-60 | 80-150 | 150-250 | Marketing |
| **Organic sessions/month** | 200-500 | 1,000-2,000 | 3,000-5,000 | 5,000-10,000 | Digital |
| **Lead-to-customer conversion** | -- | 10-15% | 12-15% | 15-20% | Sales |

### Secondary KPIs (Drivers)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Homepage bounce rate | <50% (month 3), <40% (month 12) | Plausible |
| 5-second recall test (hero) | >= 80% | User testing |
| Average time on site | > 2 min (month 3), > 4 min (month 12) | Plausible |
| ROI calculator completions/month | 10 (month 3), 100 (month 12) | Plausible + Supabase |
| Email nurture sequence open rate | > 35% | SendGrid |
| Pricing page-to-lead conversion | > 5% | Plausible |
| Blog posts indexed | 20 (month 3), 50 (month 6), 100 (month 12) | Google Search Console |
| Keyword rankings (top 10) | 5 (month 3), 20 (month 6), 50 (month 12) | Ahrefs/SEMrush |
| AI answer engine citations | 3 (month 3), 10 (month 6), 25 (month 12) | Manual tracking |

### Guardrails (Must Not Regress)

| Metric | Threshold | Gate |
|--------|-----------|------|
| Lighthouse Performance | >= 95 | CI blocks merge |
| Lighthouse Accessibility | >= 95 | CI blocks merge |
| LCP | < 1.5s | CI blocks merge |
| CLS | < 0.05 | CI blocks merge |
| JS bundle (initial) | < 150KB gzipped | bundlewatch |
| Mobile usability score | 100 | Google Search Console |
| Zero fabricated claims | 0 | Manual audit monthly |

### Revenue Projections

| Scenario | Year 1 ARR | Year 3 ARR |
|----------|-----------|-----------|
| No marketing site | $45K-$90K | $180K-$450K |
| Basic marketing site | $180K-$350K | $1.3M-$4.4M |
| **World-class marketing site** | **$360K-$750K** | **$2.6M-$11.3M** |

Break-even at 17 paying organizations on a $50K investment.

---

## Top 10 Most Impactful Actions

The single prioritized list across all 8 agents. Each action is ranked by revenue impact and urgency.

1. **Produce 3 redacted sample safety binders** (Church, K-12, Corporate). This is the single highest-priority dependency. Without it, the site's best conversion mechanism does not exist. Begin immediately.

2. **Remove all fabricated testimonials and unsubstantiated compliance claims**. For a product that sells documented trust, fabricated proof is an existential contradiction. Non-negotiable before any public-facing content.

3. **Build the homepage as a complete conversion narrative** with mechanism-forward hero copy naming the analyst, the intelligence, and the binder within 5 seconds.

4. **Build the Church/Missions solutions page** as the beachhead segment with zero competition, 2-4 week procurement, and denominational distribution channels.

5. **Implement per-student pricing reframe** ($15/student, not $450/trip) across all pricing surfaces with liability anchor ($500K-$2M) and hidden labor anchor ($700-$1,400).

6. **Build the design system and component library** (Tailwind CSS 4 tokens, shadcn/ui primitives, motion presets) as the foundation for all pages.

7. **Implement SEO infrastructure** (sitemap.ts, robots.ts with AI crawler allowances, JSON-LD schemas, canonical strategy) to capture the uncontested search niche.

8. **Create champion enablement tools** (Budget Justification Template, Board Presentation Template, shareable binder URLs) to address the committee buying bottleneck.

9. **Launch blog with 3-5 pillar posts** targeting zero-competition keywords ("field trip safety checklist," "mission trip risk assessment," "school trip compliance requirements").

10. **Initiate real testimonial collection** from 104 existing organizations. Even one-sentence quotes from real users outweigh paragraphs of fabricated praise. Target 3-5 within 30 days.

---

## Next Steps

1. **Proceed to `/factory-plan`** to create persona-specific PRDs for each feature in the P0 tier, with acceptance criteria, technical specifications, and story slicing for sprint planning.

2. **Proceed to `/factory-design`** to create the design system, component library, and high-fidelity mockups in Figma based on the UI Designer's token specification and component library.

3. **Immediate content production** (can begin in parallel with engineering):
   - Generate sample safety binders from existing trip data
   - Capture product screenshots from staging with curated demo data
   - Resolve pricing data inconsistencies with engineering
   - Get FERPA compliance language approved by legal
   - Contact existing organizations for testimonials

4. **Technical infrastructure setup** (Week 1):
   - Create Vercel project
   - Create separate Supabase project for marketing
   - Create MapTiler account
   - Create Plausible Analytics account
   - Create Cloudflare Turnstile site key
   - Create SendGrid/Resend account

5. **Review agent-specific artifacts** in `./analysis/` for deep implementation detail:
   - UI Designer: Complete token system, component specs, hero composition spec, motion presets
   - React Developer: Project scaffolding, package.json, tsconfig, component architecture, form system
   - CTA: Database schema, security architecture, deployment pipeline, observability
   - IA: Complete sitemap, navigation system, content model, cross-linking matrix, metadata templates
   - Digital Marketing: SEO infrastructure code, JSON-LD schemas, AI search strategy, content calendar
   - Narrative: Page-by-page copy direction, blog content pillars, campaign frameworks, copy style guide
   - Strategy: TAM analysis, segment prioritization, lead generation model, revenue projections, competitive intelligence
   - UX: Feature documentation, enhancement proposals, risk assessment, success metrics

---

*Generated by Software Product Owner synthesis on 2026-03-24*
*Project: SafeTrekr Marketing Site*
*Input: 8 expert agent analyses + discovery summary*
*Total source material: ~250,000 words across 8 analysis documents*
