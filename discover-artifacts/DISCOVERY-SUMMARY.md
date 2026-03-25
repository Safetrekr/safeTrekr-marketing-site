# Discovery Summary: SafeTrekr Marketing Site

## Date: 2026-03-24
## Mode: Greenfield
## Agents Used: 8

1. world-class-ux-designer
2. world-class-ui-designer
3. information-architect
4. world-class-product-narrative-strategist
5. world-class-product-strategy-analyst-market
6. world-class-digital-marketing-lead
7. react-developer
8. chief-technology-architect

---

## Project Overview

SafeTrekr is building a world-class marketing website from scratch for its enterprise trip safety management platform. The product has 3 web portals, a mobile app, 2 APIs, and manages group travel safety for K-12 schools, churches, sports teams, higher ed, and businesses. Key differentiators: 17-section analyst review, Monte Carlo risk scoring from 5 government data sources, SHA-256 hash-chain evidence binders, real-time geofencing with rally points.

**Tech Stack**: Next.js 15 (App Router) + React 19 + Tailwind CSS 4 + Framer Motion + MapLibre GL JS + Vercel
**Touchpoints**: Desktop Web + Mobile Web (Responsive)
**Visual Direction**: Executive Trust, Light Theme (Stripe's polish + Linear's restraint + International SOS's seriousness)

---

## Cross-Agent Consensus (5+ agents agreed)

### 1. The Product Is Far Ahead of Its Marketing
**All 8 agents** identified that SafeTrekr's technical depth (292K LOC, 250+ API endpoints, 17-section review, Monte Carlo scoring) is completely invisible to prospects. The marketing site is the critical bridge between product capability and revenue.

### 2. "Stop Selling Software. Start Selling the Safety Review."
**Narrative + Strategy + UX + Digital Marketing** all converged on this: the hero must name the unique mechanism (analyst review + intelligence + evidence binder), not generic benefits. The product IS the analyst. The platform is the delivery mechanism. The binder is the receipt.

### 3. Churches Are the Optimal Beachhead Segment
**Strategy + Narrative + IA** agree: churches/missions have no competitor (Chapperone targets K-12, Terra Dotta targets higher ed), no FERPA blocker, 2-4 week procurement cycles, and a $26.5M SAM. K-12 is the largest TAM but gated behind compliance certifications.

### 4. Sample Binder Is the #1 Lead Magnet
**All marketing-facing agents** identified the sample safety binder as the highest-converting lead magnet (8-15% vs. 1-3% for "Request Demo"). It demonstrates product value better than any copy. Create 3 segment-specific redacted versions.

### 5. Per-Student Pricing Reframe Is Critical
**Strategy + Narrative + Digital Marketing** all recommended leading with "$15/student" not "$450/trip." The `display_per_traveler` field already exists in the API -- this is a frontend and messaging decision.

### 6. Fabricated Social Proof Must Be Removed Immediately
**All agents** flagged the fabricated testimonials. Replace with a "trust metrics strip": `5 Government Intel Sources | 17 Safety Review Sections | 3-5 Day Turnaround | AES-256 Encryption | SHA-256 Evidence Chain`. Build real proof from 104 existing organizations.

### 7. Static-First Architecture on Vercel
**React Dev + CTA + Digital Marketing** agree: SSG for all marketing pages, ISR for blog only, MapLibre (not Mapbox) for maps, Plausible (not GA4) for privacy-first analytics, separate Supabase project for marketing data.

### 8. AI Search Optimization Is a First-Mover Opportunity
**Digital Marketing + IA + Narrative** identified that no one owns SafeTrekr's query niche in AI answer engines. Structured content with FAQ schema, methodology docs, and explicit AI crawler access will yield 10-15 AI citations within 90 days.

---

## Divergent Perspectives

| Topic | UX Designer | UI Designer | Narrative | Strategy | Digital Marketing | React Dev | CTA |
|-------|-------------|-------------|-----------|----------|------------------|-----------|-----|
| **Biggest risk** | Committee buying (3-5 stakeholders) | Contrast ratio failure (#616567 on #e7ecee) | Generic hero copy | Chapperone capturing K-12 awareness | Zero content/SEO foundation | Map bundle weight (300KB) | Self-service readiness |
| **Font choice** | Not assessed | Plus Jakarta Sans + Inter | Not assessed | Not assessed | Not assessed | Plus Jakarta Sans or Inter | Not assessed |
| **CMS strategy** | Not assessed | Not assessed | Not assessed | Not assessed | MDX → CMS at 4 posts/week | MDX → Sanity | MDX → CMS when velocity demands |
| **Timeline** | Not assessed | 4-6 weeks | Not assessed | Not assessed | 4 phases over 24 weeks | 6-8 weeks | 3 phases over 10 weeks |
| **Primary CTA** | "See Sample Binder" | Not assessed | "See Sample Binder" | Sample binder | "See Sample Binder" | Not assessed | "Request Demo" → "Get Started" |

---

## Unified Feature Inventory (Deduplicated)

### P0 -- Must Ship at Launch

| Feature | Sources | Description |
|---------|---------|-------------|
| Homepage | All 8 | Hero with map composition, feature grid, trust strip, CTA bands |
| Navigation + Footer | UX, UI, IA, React | Sticky header, 5 primary nav items, dark footer on secondary |
| Solutions - Churches/Missions | Strategy, Narrative, IA | Beachhead segment landing page |
| Solutions - K-12 Schools | UX, Strategy, IA, Digital | Largest TAM segment page |
| Pricing Page | Strategy, Narrative, UX | Per-student reframing, ROI calculator, FAQ |
| How It Works | Narrative, UX, UI | 3-act story: Intelligence → Review → Documentation |
| Demo Request Form | All marketing | RHF + Zod + Server Actions + bot protection |
| Contact Form | UX, CTA | Secondary conversion path |
| Design System / Token Foundation | UI, React | Tailwind CSS 4 tokens, shadcn/ui primitives, motion presets |
| SEO Infrastructure | Digital, IA, React | sitemap.ts, robots.ts, generateMetadata, JSON-LD |
| Analytics | Digital, CTA | Plausible (primary) + GA4 (optional), conversion events |
| Accessibility (WCAG 2.2 AA) | UX, UI, CTA, React | Skip-nav, ARIA, keyboard nav, contrast compliance |
| Performance Budget | React, CTA, Digital | <150KB JS, LCP <1.5s, Lighthouse 95+ |

### P1 -- Ship Within 30 Days

| Feature | Sources | Description |
|---------|---------|-------------|
| Solutions - Higher Ed | IA, Strategy | Study abroad, Clery Act focus |
| Solutions - Corporate/Sports | IA, Strategy | Duty of care, tournament travel |
| About Page | UX, IA | Team, mission, credibility |
| Feature - Analyst Review | Narrative, UI | 17-section interactive visualization |
| Feature - Risk Intelligence | Narrative, UI | Monte Carlo + data source showcase |
| Feature - Evidence Binder | Narrative, UI | Document preview with hash-chain |
| Sample Binder Lead Magnet | All marketing | 3 segment-specific gated PDFs |
| Trust Metrics Strip | All marketing | Replace fabricated testimonials |
| Blog Shell | Digital, IA, React | MDX + ISR, 3-5 pillar posts |
| Email Capture + Nurture | Digital | Resend/SendGrid, segment sequences |
| Interactive Hero Map | UI, React, CTA | MapLibre GL JS, lazy-loaded |
| Operational Motion System | UI, React | Framer Motion scroll reveals |

### P2 -- Ship Within 60 Days

| Feature | Sources | Description |
|---------|---------|-------------|
| ROI Calculator | Strategy, Digital | Interactive per-student cost calculator |
| Comparison Pages | Strategy, Digital, IA | vs. DIY, vs. logistics apps, vs. enterprise |
| Procurement Resource Hub | UX, IA, Strategy | W-9, security questionnaire, contracts |
| Compliance Center | Digital, IA | FERPA, Clery Act, COPPA guides with FAQ schema |
| Case Studies (template) | Digital, UX | Ready when real customer stories exist |
| G2 + Capterra Profiles | Digital | Create immediately, incentivize first 5 reviews |
| Dynamic OG Images | React, CTA | next/og (Satori) per-page |
| Newsletter System | Digital | Segment-based, double opt-in |

### P3 -- Ship Within 90 Days

| Feature | Sources | Description |
|---------|---------|-------------|
| Paid Acquisition Landing Pages | Digital | Google Ads + LinkedIn Ads templates |
| Glossary / Knowledge Base | Digital, IA | 50+ terms, DefinedTerm schema |
| Video Content System | Digital, Narrative | Chaperone dashboard demo, VideoObject schema |
| Interactive Product Tour | Digital, UX | Self-serve walkthrough |
| CRM Integration (HubSpot) | CTA, Digital | Push forms to HubSpot Contacts API |
| A/B Testing Framework | Digital, CTA | Vercel Edge Middleware |

---

## Priority Matrix

| Feature | UX | UI | IA | Narrative | Strategy | Digital | React | CTA | Consensus |
|---------|:--:|:--:|:--:|:---------:|:--------:|:-------:|:-----:|:---:|:---------:|
| Homepage | P0 | P0 | P0 | P0 | P0 | P0 | P0 | P0 | **P0** |
| Church Solutions | — | — | P0 | P0 | P0 | P1 | — | — | **P0** |
| K-12 Solutions | P0 | — | P0 | P0 | P1 | P0 | P0 | — | **P0** |
| Pricing | — | — | P0 | P0 | P0 | P0 | P0 | — | **P0** |
| Sample Binder | P0 | — | P1 | P0 | P0 | P1 | — | — | **P0** |
| Hero Map | — | P0 | — | — | — | — | P1 | P0 | **P1** |
| Blog | — | — | P1 | P2 | P2 | P1 | P2 | — | **P1** |
| ROI Calculator | — | — | — | P1 | P1 | P1 | — | — | **P1** |
| Comparison Pages | — | — | P2 | — | P1 | P1 | — | — | **P2** |

---

## Key Risks & Constraints

### Content Dependencies (HIGH)
1. **Zero real testimonials** -- must collect from 104 existing organizations before launch
2. **No product screenshots** -- need demo account with curated data
3. **No sample binder content** -- must generate from demo data
4. **No blog content** -- infrastructure before content

### Technical Dependencies (LOW)
5. **Vercel account** -- free tier sufficient
6. **Supabase project (new)** -- separate from product DB
7. **MapTiler account** -- free tier for map tiles
8. **Plausible account** -- $9/month

### Business Constraints (MEDIUM)
9. **No self-service signup** -- all CTAs route to demo/quote forms; architecture must be toggle-ready
10. **TarvaRI pipeline dormant** -- cannot demo live intelligence; market capability with sample data
11. **No App Store presence** -- mobile app built but not submitted; video demos instead
12. **Fabricated testimonials** -- MUST be removed before launch; legal/reputation risk
13. **Compliance claims unsubstantiated** -- use "Designed with X in mind" until certified

### Competitive Threat (MEDIUM-HIGH)
14. **Chapperone** is capturing K-12 market awareness with self-service signup and App Store presence. SafeTrekr has zero safety analysis capability overlap, but awareness gap is growing.

---

## Architecture Decisions (Cross-Agent Consensus)

| Decision | Rationale | Agents |
|----------|-----------|--------|
| SSG for all marketing pages | No user-specific content; zero runtime cost; sub-50ms TTFB | React, CTA, Digital |
| MapLibre over Mapbox | Zero per-load cost; BSD license; identical API | React, CTA, UI |
| Separate Supabase project | Blast radius isolation from product DB | CTA, React |
| MDX for content (not CMS) | Low content velocity at launch; version control; zero cost | React, CTA, Digital |
| Plausible primary, GA4 optional | Privacy-first for K-12/church audience; no cookie banner needed | CTA, React, Digital |
| shadcn/ui component primitives | Accessible by default, Tailwind-native, tree-shakeable | React, UI |
| Plus Jakarta Sans + Inter | Executive + modern + readable; free via next/font | UI |
| Framer Motion (tree-shaken ~15KB) | "Operational motion" vocabulary; prefers-reduced-motion support | UI, React |
| Server Actions for forms | Security, simplicity, progressive enhancement | React |
| Cloudflare Turnstile for bot protection | Free, privacy-preserving, invisible | CTA |

---

## Revenue Impact Projections

| Scenario | Year 1 ARR | Year 3 ARR |
|----------|-----------|-----------|
| No marketing site | $45K-$90K | $180K-$450K |
| Basic marketing site | $180K-$350K | $1.3M-$4.4M |
| **World-class marketing site** | **$360K-$750K** | **$2.6M-$11.3M** |

Delta from world-class site: **$315K-$660K Year 1**, scaling to **$2.4M-$10.9M by Year 3**.

Break-even at 17 paying organizations on a $50K investment.

---

## Recommended Next Steps

1. **Run `/factory-analyze`** to deepen feature analysis and generate enhancement scenarios
2. **Run `/factory-plan`** to create persona-specific PRDs for the marketing site
3. **Run `/factory-design`** to create the design system, component library, and high-fidelity mockups
4. Review agent-specific artifacts in `./discover-artifacts/`
5. **Immediate content actions**:
   - Remove fabricated testimonials from any existing assets
   - Contact existing organizations for real testimonials
   - Generate sample safety binder from demo data
   - Create demo account with curated product screenshots

---

## Artifacts Generated

| File | Agent | Size |
|------|-------|------|
| `ux-discovery-marketing-site-2026-03-24.md` | UX Designer | 65K |
| `ui-design-discovery-analysis.md` | UI Designer | 9K (summary; full in transcript) |
| `information-architect-discovery.md` | Information Architect | 78K |
| `product-narrative-strategist-discovery.md` | Product Narrative | 65K |
| `product-strategy-analyst-discovery.md` | Product Strategy | 55K |
| `digital-marketing-discovery-2026-03-24.md` | Digital Marketing | 10K (summary; full in transcript) |
| `react-developer-discovery.md` | React Developer | 8K (summary; full in transcript) |
| `chief-technology-architect-discovery.md` | Chief Technology Architect | 11K |

---

*Generated by Tarva Dark Factory `/factory-discover` on 2026-03-24*
*Project: SafeTrekr Marketing Site*
*Orchestrator ID: 27e4cd03-2eec-4572-a591-e3776bff47e4*
