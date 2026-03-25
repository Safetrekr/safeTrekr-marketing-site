# SafeTrekr Marketing Site -- Information Architecture Discovery Analysis

**Date**: 2026-03-24
**Analyst**: Principal Information Architect
**Mode**: Greenfield Discovery
**Platform**: Next.js / React (Web + Mobile-Responsive)
**Version**: 1.0.0

---

## Executive Summary

SafeTrekr's marketing site must serve a multi-stakeholder institutional buying journey across four distinct segments (K-12, Higher Education, Churches/Mission Organizations, Corporate/Sports Teams) while communicating a deeply technical product with a unique mechanism that no competitor matches: human analyst review augmented by Monte Carlo risk intelligence from five government data sources, producing tamper-evident evidence binders with SHA-256 hash-chain integrity.

The central IA challenge is this: **SafeTrekr must simultaneously communicate "calm authority" to risk managers and board members, "operational credibility" to trip coordinators, and "clear value" to budget holders -- all while routing four distinct segments to content that speaks to their specific regulatory, compliance, and operational realities.**

This discovery analysis establishes the complete information architecture for the marketing site: sitemap, navigation model, content types, segment routing, labeling system, URL architecture, metadata strategy, cross-linking patterns, and a content priority matrix. The architecture is designed for a site of approximately 40-60 pages at launch, scaling to 100+ as content (blog, case studies, resources) accumulates.

### Architecture Design Principles

| # | Principle | Application |
|---|-----------|-------------|
| 1 | **Segment-first routing** | Every visitor should reach segment-specific content within 1 click from homepage |
| 2 | **Proof over promise** | Lead with evidence (sample binders, analyst review detail, intelligence methodology) not generic claims |
| 3 | **Institutional buyer mental model** | Organize by buying journey stages: Understand -> Evaluate -> Validate -> Procure |
| 4 | **Progressive disclosure of complexity** | Surface the "what" and "why" before the "how" of technical capabilities |
| 5 | **Dual-audience navigation** | Primary nav serves evaluators and decision-makers; utility nav serves procurement officers and returning visitors |
| 6 | **SEO-driven content hubs** | Resource content organized as topical clusters for organic discovery |

---

## Key Findings

### Finding 1: Four Segments Require Fundamentally Different Entry Narratives

K-12 administrators care about FERPA, parent communication, and board approval. Higher ed directors care about Clery Act, Title IX, and international program liability. Church leaders care about volunteer liability, insurance requirements, and mission trip logistics on constrained budgets. Corporate travel managers care about duty of care, expense integration, and enterprise compliance.

**IA Implication**: A single "Solutions" page that lists all four segments with equal weight will fail. Each segment needs its own landing page with distinct regulatory framing, pricing context, use-case scenarios, and social proof. The segment landing page is the most important page type after the homepage.

### Finding 2: The Buying Journey Has 4-6 Stakeholders Per Organization

Institutional purchases involve: (1) the trip coordinator who discovers the need, (2) the risk manager or safety officer who evaluates, (3) the IT/security team who reviews compliance posture, (4) the procurement officer who processes the purchase, and (5) the board or executive who approves budget. Each stakeholder needs different content.

**IA Implication**: The navigation must serve lateral movement between stakeholder-appropriate content without forcing linear consumption. The "For Procurement" utility link, the security/compliance section, and the pricing page with ROI framing each serve different stakeholders in the same buying journey. Cross-linking between these must be explicit.

### Finding 3: The Unique Mechanism is the Primary Conversion Driver -- But It Needs Explanation

The 17-section analyst review, Monte Carlo risk scoring from 5 government sources, and hash-chain evidence binders are SafeTrekr's indefensible competitive moat. But these concepts are technically complex and require progressive disclosure: headline-level framing on the homepage, deeper explanation on feature pages, and full technical detail for evaluators who want to go deep.

**IA Implication**: The information hierarchy needs at least three layers of depth for the core product story: (1) Overview-level on homepage and segment pages, (2) Feature-detail pages for each major capability, and (3) Technical deep-dives for security/compliance evaluators. This argues for a "Platform" or "Product" section with sub-pages rather than a single "Features" page.

### Finding 4: The Sample Binder is the Highest-Value Lead Magnet

The discovery analysis identifies the sample binder download as the single highest-converting lead magnet opportunity. A prospect who sees exactly what a $450 trip review produces -- the safety analysis, emergency contacts, maps, evidence documentation -- will convert at dramatically higher rates than one who sees a "Request a Quote" button.

**IA Implication**: The sample binder must be surfaced in multiple locations: segment landing pages, the "How It Works" page, the pricing page, and as a persistent secondary CTA throughout the site. This is not a buried resource -- it is a conversion instrument that should appear wherever evaluation is happening.

### Finding 5: The Procurement Page is a Strategic Asset That Needs Elevation

W-9s, security questionnaires, contract templates, SOC 2 reports -- these are exactly what institutional procurement officers need. This page currently exists in the old site but is orphaned from the main navigation.

**IA Implication**: "For Procurement" should appear in the utility navigation (top-right area alongside "Log In" and "Contact") and in the footer. It should also be cross-linked from every pricing-adjacent page and every segment landing page.

### Finding 6: Content Volume at Launch is Modest But Must Scale

At launch, the site will have approximately 40-60 pages. But as blog content, case studies, guides, and resource materials accumulate, the architecture must support 100-200+ pages without restructuring. The blog alone could generate 4-8 posts per month targeting segment-specific SEO terms.

**IA Implication**: The URL architecture and content taxonomy must be designed for scale from day one. Flat URL structures for core pages, nested structures for content hubs (blog, resources, case studies), and consistent metadata patterns that support faceted browsing and search.

### Finding 7: Mobile-First is Essential for Field Discovery

Trip coordinators and teachers often discover SafeTrekr while researching on mobile devices. The visual brief specifies responsive design. The marketing site navigation must degrade gracefully from desktop mega-menu patterns to mobile drawer navigation without losing segment routing or deep-link capability.

**IA Implication**: Primary navigation items should be limited to 5-6 top-level items to ensure mobile usability. Mega-menu content on desktop must map to expandable sections in mobile navigation.

---

## 1. Site Map & Page Taxonomy

### 1.1 Complete Sitemap (v1.0)

```
safetrekr.com/
│
├── Homepage                                    /
│
├── PLATFORM (Product Capabilities)
│   ├── Platform Overview                       /platform
│   ├── Analyst Safety Review                   /platform/analyst-review
│   ├── Risk Intelligence Engine                /platform/risk-intelligence
│   ├── Trip Safety Binder                      /platform/safety-binder
│   ├── Mobile Field Operations                 /platform/mobile-app
│   ├── Real-Time Monitoring                    /platform/monitoring
│   │   (geofencing, rally points, muster, SMS broadcast, live map)
│   └── Compliance & Evidence                   /platform/compliance
│       (hash-chain evidence, FERPA, SOC 2, GDPR, purge proofs)
│
├── SOLUTIONS (Segment Landing Pages)
│   ├── Solutions Overview                      /solutions
│   ├── K-12 Schools & Districts                /solutions/k12
│   ├── Higher Education                        /solutions/higher-education
│   ├── Churches & Mission Organizations        /solutions/churches
│   └── Corporate & Sports Teams                /solutions/corporate
│
├── HOW IT WORKS
│   └── How It Works (Process Flow)             /how-it-works
│
├── PRICING
│   └── Pricing                                 /pricing
│
├── RESOURCES (Content Hub)
│   ├── Resources Overview                      /resources
│   ├── Case Studies                            /resources/case-studies
│   │   └── [slug]                              /resources/case-studies/[slug]
│   ├── Guides & Whitepapers                    /resources/guides
│   │   └── [slug]                              /resources/guides/[slug]
│   ├── Sample Binders                          /resources/sample-binders
│   │   ├── K-12 Field Trip Sample              /resources/sample-binders/k12-field-trip
│   │   ├── International Mission Trip Sample   /resources/sample-binders/mission-trip
│   │   ├── Corporate Travel Sample             /resources/sample-binders/corporate-travel
│   │   └── University Study Abroad Sample      /resources/sample-binders/study-abroad
│   ├── Webinars                                /resources/webinars
│   │   └── [slug]                              /resources/webinars/[slug]
│   ├── ROI Calculator                          /resources/roi-calculator
│   └── FAQ                                     /resources/faq
│
├── BLOG (SEO Content Hub)
│   ├── Blog Index                              /blog
│   ├── Blog Post                               /blog/[slug]
│   ├── Blog Category                           /blog/category/[category]
│   └── Blog Tag                                /blog/tag/[tag]
│
├── COMPANY
│   ├── About SafeTrekr                         /about
│   ├── Our Analysts                            /about/analysts
│   ├── Security & Trust                        /security
│   ├── For Procurement                         /procurement
│   └── Contact                                 /contact
│
├── LEGAL
│   ├── Terms of Service                        /legal/terms
│   ├── Privacy Policy                          /legal/privacy
│   ├── Data Processing Agreement               /legal/dpa
│   ├── Acceptable Use Policy                   /legal/acceptable-use
│   └── Cookie Policy                           /legal/cookies
│
├── UTILITY PAGES
│   ├── Demo Request (form)                     /demo
│   ├── Get Started / Sign Up                   /get-started
│   ├── Partner Program                         /partners
│   └── Status Page                             /status
│
└── SYSTEM PAGES
    ├── 404 Not Found                           /404
    ├── 500 Server Error                        /500
    └── Sitemap (XML)                           /sitemap.xml
```

### 1.2 Page Count Summary

| Section | Pages at Launch | Pages at Scale (12mo) |
|---------|----------------|-----------------------|
| Homepage | 1 | 1 |
| Platform | 6 | 6-8 |
| Solutions | 5 | 5-8 (add segments) |
| How It Works | 1 | 1 |
| Pricing | 1 | 1-2 |
| Resources | 8-12 | 30-50 |
| Blog | 0-4 (seed) | 50-100 |
| Company | 5 | 5-6 |
| Legal | 5 | 5-6 |
| Utility | 3-4 | 4-6 |
| System | 3 | 3 |
| **Total** | **38-46** | **110-190** |

### 1.3 Hierarchy Depth Analysis

| Level | Content | Example |
|-------|---------|---------|
| L0 | Homepage | `/` |
| L1 | Section landing | `/platform`, `/solutions`, `/pricing` |
| L2 | Detail page | `/platform/analyst-review`, `/solutions/k12` |
| L3 | Individual content item | `/resources/case-studies/springfield-unified` |
| L4 | Filtered view | `/blog/category/k12-compliance` |

**Maximum depth**: 4 levels. No user should need more than 3 clicks from homepage to reach any content item. Average path to conversion-critical content: 2 clicks.

---

## 2. Navigation Architecture

### 2.1 Navigation Systems Overview

| System | Purpose | Visibility | Items |
|--------|---------|------------|-------|
| **Primary Nav** | Main site navigation | All pages, persistent | 5-6 items |
| **Utility Nav** | Quick-access links for returning visitors and procurement | All pages, top-right | 3-4 items |
| **Footer Nav** | Comprehensive sitemap, legal, secondary links | All pages, bottom | 25-35 links |
| **Mobile Nav** | Drawer-based primary + utility nav | Mobile/tablet only | Same items, vertical |
| **In-Page Nav** | Section navigation on long pages | Long-form pages only | Variable |
| **Breadcrumbs** | Location indicator for deep pages | L2+ pages | Dynamic |

### 2.2 Primary Navigation (Desktop)

```
[Logo]  Platform v    Solutions v    How It Works    Pricing    Resources v    [For Procurement]  [Log In]  [Get a Demo]
```

**5 primary items + 2 utility items + 1 primary CTA**

#### Platform Dropdown (Mega-Menu Panel)

```
PLATFORM
─────────────────────────────────────────────────────────────────
  THE SAFETREKR PLATFORM               CAPABILITIES
  ┌─────────────────────┐
  │ [Platform Overview]  │              Analyst Safety Review
  │ See how SafeTrekr    │              17-section professional review
  │ protects every trip  │              of every trip location and plan
  │                      │
  │  → Explore Platform  │              Risk Intelligence Engine
  └─────────────────────┘              Monte Carlo scoring from 5
                                       government data sources

                                       Trip Safety Binder
                                       Audit-ready documentation with
                                       hash-chain evidence integrity

                                       Mobile Field Operations
                                       Live tracking, geofencing,
                                       rally points, SMS broadcast

                                       Real-Time Monitoring
                                       Geofence alerts, muster check-ins,
                                       participant location visibility

                                       Compliance & Evidence
                                       FERPA, SOC 2, GDPR, tamper-evident
                                       audit trail with purge proofs
─────────────────────────────────────────────────────────────────
```

#### Solutions Dropdown (Mega-Menu Panel)

```
SOLUTIONS
─────────────────────────────────────────────────────────────────
  BY ORGANIZATION TYPE

  K-12 Schools & Districts              Higher Education
  FERPA-compliant trip safety           Study abroad, Clery Act,
  for field trips and travel            international program safety

  Churches & Mission Organizations      Corporate & Sports Teams
  Mission trip safety with              Duty of care compliance
  volunteer and youth protections       for business and team travel

  ─────────────────────────────────
  "Every trip reviewed. Every risk scored. Every document audit-ready."
  [See How It Works →]
─────────────────────────────────────────────────────────────────
```

#### Resources Dropdown (Simple Panel)

```
RESOURCES
─────────────────────────
  Case Studies
  Guides & Whitepapers
  Sample Binders
  Webinars
  FAQ
  ROI Calculator
  ───────────────────────
  Blog →
─────────────────────────
```

### 2.3 Utility Navigation

Located top-right, smaller type, distinct from primary nav:

```
For Procurement    Log In    [Get a Demo]
```

| Item | Purpose | Target Audience |
|------|---------|-----------------|
| For Procurement | Direct path to W-9s, security questionnaires, compliance docs | Procurement officers |
| Log In | Existing customer access to SafeTrekr app | Current users |
| Get a Demo | Primary conversion CTA (persistent, high-contrast button) | All prospects |

### 2.4 Footer Navigation

```
─────────────────────────────────────────────────────────────────
PLATFORM              SOLUTIONS             RESOURCES
Platform Overview     K-12 Schools          Case Studies
Analyst Review        Higher Education      Guides
Risk Intelligence     Churches & Mission    Sample Binders
Safety Binder         Corporate & Sports    Webinars
Mobile App                                  FAQ
Monitoring            HOW IT WORKS          ROI Calculator
Compliance            How It Works          Blog

COMPANY               LEGAL                 SUPPORT
About SafeTrekr       Terms of Service      Contact Us
Our Analysts          Privacy Policy        For Procurement
Security & Trust      DPA                   Status Page
Partners              Acceptable Use
                      Cookie Policy
─────────────────────────────────────────────────────────────────
[Logo]  [Social Links]     (c) 2026 SafeTrekr. All rights reserved.
                           SOC 2 | FERPA | GDPR | AES-256
─────────────────────────────────────────────────────────────────
```

### 2.5 Mobile Navigation (Drawer)

```
[X Close]

Platform                                    [>]
  Platform Overview
  Analyst Safety Review
  Risk Intelligence Engine
  Trip Safety Binder
  Mobile Field Operations
  Real-Time Monitoring
  Compliance & Evidence

Solutions                                   [>]
  K-12 Schools & Districts
  Higher Education
  Churches & Mission Organizations
  Corporate & Sports Teams

How It Works
Pricing

Resources                                   [>]
  Case Studies
  Guides & Whitepapers
  Sample Binders
  FAQ
  Blog

────────────────────────
For Procurement
Log In
[Get a Demo]  (full-width button)
```

**Mobile nav rules**:
- Accordion-expand for sections with children (no separate dropdown pages)
- Primary CTA ("Get a Demo") always visible as fixed bottom button or prominent drawer element
- Maximum 2 taps to any page from the mobile drawer

### 2.6 Breadcrumb Strategy

| Page Type | Breadcrumb Pattern |
|-----------|-------------------|
| Section landing | `Home > Platform` |
| Detail page | `Home > Platform > Analyst Safety Review` |
| Segment page | `Home > Solutions > K-12 Schools & Districts` |
| Blog post | `Home > Blog > [Post Title]` |
| Blog category | `Home > Blog > [Category Name]` |
| Case study | `Home > Resources > Case Studies > [Title]` |
| Legal page | `Home > Legal > Privacy Policy` |

**Rules**:
- Breadcrumbs appear on all L2+ pages
- Homepage and L1 landing pages do not show breadcrumbs
- Breadcrumb schema markup (JSON-LD BreadcrumbList) on every page with breadcrumbs
- Mobile: breadcrumbs collapse to "< Back to [Parent]" pattern on screens <640px

---

## 3. Content Model

### 3.1 Content Types

| Content Type | Count at Launch | Fields | CMS Pattern |
|--------------|----------------|--------|-------------|
| **Core Page** | ~20 | title, slug, meta_title, meta_description, og_image, sections[], cta_config, segment_tags[] | Page builder with section components |
| **Segment Landing Page** | 4 | title, slug, segment_id, hero_config, pain_points[], features_highlighted[], case_study_ref, sample_binder_ref, pricing_context, compliance_badges[], cta_config | Structured template |
| **Feature Page** | 6 | title, slug, feature_id, hero_config, capability_details[], proof_points[], screenshots[], related_features[], segment_relevance[], cta_config | Structured template |
| **Blog Post** | 0-4 (seed) | title, slug, author_ref, publish_date, categories[], tags[], excerpt, body (MDX), featured_image, cta_config, related_posts[], seo_config | MDX with frontmatter |
| **Case Study** | 0-2 (seed) | title, slug, organization_type, segment_tags[], challenge, solution, results_metrics[], quote, logo, cta_config | Structured template |
| **Guide/Whitepaper** | 2-4 | title, slug, format (guide/whitepaper/checklist), segment_tags[], topic_tags[], excerpt, body or pdf_url, gated (boolean), gate_form_config, cta_config | Content + optional gate |
| **Sample Binder** | 4 | title, slug, segment_id, trip_type, description, preview_images[], download_url, gated (boolean), gate_form_config | Download asset |
| **Webinar** | 0-1 | title, slug, date, speakers[], description, registration_url or recording_url, status (upcoming/recorded), segment_tags[] | Event listing |
| **FAQ Item** | 15-25 | question, answer (rich text), category, segment_tags[], sort_order | Structured list |
| **Testimonial** | 0 (launch) | quote, author_name, author_title, organization_name, organization_type, segment_id, photo_url, verified (boolean) | Reference data |
| **Team/Analyst Profile** | 3-6 | name, title, bio, photo_url, credentials[], sort_order | Reference data |
| **Pricing Tier** | 3 | tier_name, trip_type, price, per_student_price (computed), features_included[], features_excluded[], cta_label, cta_url, popular (boolean) | Structured data |
| **Compliance Badge** | 6-8 | name, icon, description, detail_url, verification_status | Reference data |
| **Legal Page** | 5 | title, slug, effective_date, body (MDX), version | Legal content |
| **CTA Configuration** | reusable | primary_label, primary_url, secondary_label, secondary_url, context_variant (hero/inline/banner/sticky) | Shared component config |

### 3.2 Content Type Relationships

```
Segment Landing Page
├── references → Case Study (filtered by segment)
├── references → Sample Binder (filtered by segment)
├── references → Feature Page (highlighted features)
├── references → Pricing Tier (segment-specific framing)
├── references → FAQ Item (filtered by segment)
├── references → Blog Post (filtered by segment tag)
└── references → Testimonial (filtered by segment)

Feature Page
├── references → Segment Landing Page (relevance tags)
├── references → Case Study (proof points)
├── references → Related Feature Pages
└── embeds → Screenshot/Product Visual

Blog Post
├── references → Feature Page (when discussing capabilities)
├── references → Segment Landing Page (when addressing segment)
├── references → Guide/Whitepaper (deeper reading)
├── belongs to → Blog Category
└── tagged with → Blog Tag

Case Study
├── references → Segment Landing Page
├── references → Feature Page (capabilities used)
└── surfaces on → Homepage, Segment Page, Resources
```

### 3.3 Content Component Library

Reusable content components that appear across multiple page types:

| Component | Used On | Purpose |
|-----------|---------|---------|
| `HeroSection` | Homepage, segment pages, feature pages | Primary above-fold messaging |
| `ProofStrip` | Homepage, segment pages, pricing | Quantified credibility (5 sources, 17 sections, 3-5 day turnaround) |
| `FeatureCard` | Platform overview, segment pages | Capability summary with icon, title, description, link |
| `SegmentCard` | Homepage, solutions overview | Segment routing with icon, name, regulatory context |
| `TestimonialBlock` | Segment pages, homepage (when real) | Social proof with attribution |
| `CaseStudyPreview` | Segment pages, resources | Case study card with metrics |
| `SampleBinderCTA` | Segment pages, How It Works, pricing | Lead magnet with preview + download |
| `PricingCard` | Pricing page | Tier comparison |
| `ROICalculator` | Pricing page, resources | Interactive cost comparison |
| `ComplianceBadgeRow` | Footer, security page, segment pages | Trust signals (SOC 2, FERPA, GDPR, AES-256) |
| `CTABanner` | End of every content page | Conversion prompt with contextual copy |
| `FAQAccordion` | FAQ page, segment pages, pricing | Expandable Q&A |
| `ProcessTimeline` | How It Works | Step-by-step visual flow |
| `ComparisonTable` | Pricing, segment pages | SafeTrekr vs. status quo or competitors |
| `BlogPostCard` | Blog index, segment pages, resources | Post preview with image, title, excerpt |

---

## 4. Segment-Specific Entry Points

### 4.1 Entry Point Strategy

Each segment has three primary entry vectors:

| Vector | Path | Example |
|--------|------|---------|
| **Direct navigation** | Homepage -> Solutions -> Segment page | User clicks "K-12 Schools" from nav |
| **Organic search** | SERP -> Segment landing page or blog post | "school field trip safety compliance software" |
| **Referral/campaign** | UTM link -> Segment landing page | Email campaign, partner link, ad |

### 4.2 Segment Landing Page Architecture

Each segment landing page follows a consistent template with segment-specific content:

```
[SEGMENT LANDING PAGE TEMPLATE]

1. Hero
   - Segment-specific headline addressing primary pain
   - Segment-specific sub-headline with regulatory context
   - Primary CTA: "Download Sample [Segment] Binder"
   - Secondary CTA: "Get a Demo"

2. Problem Statement
   - "What [segment type] currently do" (status quo framing)
   - Cost of the alternative (time, risk, liability)
   - Category contrast (spreadsheets vs. SafeTrekr)

3. How SafeTrekr Solves It (3-4 capabilities, segment-framed)
   - Feature 1 with segment-specific benefit
   - Feature 2 with segment-specific benefit
   - Feature 3 with segment-specific benefit

4. Proof Points
   - Case study from this segment (when available)
   - Testimonial from this segment (when available)
   - Quantified metrics (review sections, data sources, turnaround)

5. Sample Binder Preview
   - Visual preview of what the binder contains
   - "See exactly what you get for $X per trip"
   - Gated download CTA

6. Pricing Context
   - Per-student/per-participant framing for this segment
   - Comparison to current spend
   - Link to full pricing page

7. Compliance & Trust
   - Segment-relevant compliance badges
   - Security posture summary
   - Link to procurement page

8. FAQ (5-7 segment-specific questions)

9. Conversion CTA Banner
   - "Ready to protect your next [trip type]?"
   - Demo request form or link
```

### 4.3 Segment-Specific Content Mapping

| Content Element | K-12 | Higher Ed | Churches | Corporate |
|----------------|------|-----------|----------|-----------|
| **Primary pain** | Board liability for field trips | International program risk | Volunteer/youth safety on missions | Duty of care compliance |
| **Regulatory hook** | FERPA, COPPA, board policy | Clery Act, Title IX, study abroad regs | Insurance requirements, SafeSport | OSHA, duty of care, corporate policy |
| **Price framing** | "$15/student for professional safety review" | "$1,250/trip for study abroad -- less than 1hr of legal counsel" | "$450/trip -- 3% of a $15K mission budget" | "$750/trip -- fraction of a risk consultant day rate" |
| **Status quo contrast** | "Spreadsheets and PDF checklists" | "Scattered across departments" | "Prayer and hope" (reframe: faith + preparation) | "Travel management companies at $100K+/yr" |
| **Sample binder type** | Elementary school field trip | University study abroad program | 2-week international mission trip | Multi-city corporate offsite |
| **Key features highlighted** | Parent/guardian portal, FERPA compliance, background checks | Risk intelligence, evidence binder, international coverage | Budget-friendly pricing, group management, rally points | Enterprise compliance, evidence documentation, mobile app |
| **Decision makers** | Superintendent, risk manager, school board | Provost, risk management, study abroad director | Senior pastor, mission director, insurance committee | Chief risk officer, travel manager, legal |
| **Budget cycle** | Jan-Mar (fall trips), Aug-Oct (spring trips) | Varies by semester, often annual | Calendar year, often Q1 planning | Fiscal year, quarterly budgets |

### 4.4 Homepage Segment Routing

The homepage should surface segment entry points within the first viewport scroll:

```
[HOMEPAGE SEGMENT SECTION]

"Built for organizations that take travel safety seriously."

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  [School]     │  │  [University] │  │  [Church]     │  │  [Building]   │
│               │  │               │  │               │  │               │
│  K-12 Schools │  │  Higher       │  │  Churches &   │  │  Corporate &  │
│  & Districts  │  │  Education    │  │  Mission Orgs │  │  Sports Teams │
│               │  │               │  │               │  │               │
│  FERPA-ready  │  │  Study abroad │  │  Mission trip │  │  Duty of care │
│  field trip   │  │  and          │  │  and youth    │  │  and team     │
│  safety       │  │  international│  │  travel       │  │  travel       │
│               │  │  program      │  │  safety       │  │  compliance   │
│  Learn more → │  │  Learn more → │  │  Learn more → │  │  Learn more → │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

---

## 5. Findability & Search

### 5.1 Search Recommendation

**At launch: No on-site search.** The site will have fewer than 50 pages. Navigation and cross-linking are sufficient for findability. Adding search to a site with insufficient content creates a poor experience (many zero-results queries).

**At 75+ pages (approximately month 6-8): Add site search.** When the blog and resource library grow to sufficient depth, implement Algolia or a similar service with:
- Blog post indexing
- Resource indexing (case studies, guides, sample binders)
- FAQ indexing
- Core page indexing (platform, solutions)
- Segment-scoped filtering ("Search within K-12 content")

### 5.2 SEO-Driven Content Hub Strategy

The primary findability mechanism at launch is organic search. The content architecture supports SEO through topical clusters:

#### Cluster 1: School Field Trip Safety (K-12 Target)
- **Pillar page**: `/solutions/k12`
- **Supporting content**:
  - `/blog/field-trip-safety-checklist-for-schools`
  - `/blog/ferpa-compliance-school-travel`
  - `/blog/school-board-trip-approval-process`
  - `/blog/field-trip-liability-what-administrators-need-to-know`
  - `/resources/guides/k12-field-trip-safety-planning-guide`
  - `/resources/case-studies/[k12-case-study]`

#### Cluster 2: Study Abroad Safety (Higher Ed Target)
- **Pillar page**: `/solutions/higher-education`
- **Supporting content**:
  - `/blog/study-abroad-risk-assessment-best-practices`
  - `/blog/clery-act-implications-for-international-programs`
  - `/blog/title-ix-obligations-in-study-abroad`
  - `/blog/university-duty-of-care-international-travel`
  - `/resources/guides/higher-ed-international-travel-safety-handbook`

#### Cluster 3: Mission Trip Safety (Church Target)
- **Pillar page**: `/solutions/churches`
- **Supporting content**:
  - `/blog/church-mission-trip-insurance-requirements`
  - `/blog/youth-group-travel-safety-checklist`
  - `/blog/volunteer-background-check-requirements-churches`
  - `/blog/mission-trip-emergency-planning-guide`
  - `/resources/guides/church-mission-trip-safety-toolkit`

#### Cluster 4: Corporate Travel Safety (Corporate Target)
- **Pillar page**: `/solutions/corporate`
- **Supporting content**:
  - `/blog/corporate-duty-of-care-travel-compliance`
  - `/blog/sports-team-travel-safety-requirements`
  - `/blog/corporate-travel-risk-management-vs-spreadsheets`
  - `/resources/guides/corporate-travel-risk-management-playbook`

#### Cluster 5: Trip Safety Technology (Product/Brand)
- **Pillar page**: `/platform`
- **Supporting content**:
  - `/blog/what-is-monte-carlo-risk-scoring-for-travel`
  - `/blog/hash-chain-evidence-why-tamper-proof-documentation-matters`
  - `/blog/geofencing-for-group-travel-safety`
  - `/blog/how-analyst-reviewed-safety-binders-reduce-liability`

### 5.3 Internal Search Architecture (Future State)

When search is implemented:

| Component | Specification |
|-----------|---------------|
| **Search scope** | All public pages, blog posts, resources, FAQ items |
| **Facets** | Content type (Blog, Guide, Case Study, FAQ), Segment (K-12, Higher Ed, Church, Corporate), Topic |
| **Autocomplete** | Suggest matching page titles, FAQ questions, blog post titles |
| **Zero results** | Show segment landing pages, popular resources, contact CTA |
| **Search placement** | Icon in utility nav, expands to full-width search bar on click |
| **Analytics** | Track all search queries, clicks, zero-result queries for content gap analysis |

---

## 6. Cross-Linking Strategy

### 6.1 Cross-Link Architecture

Cross-linking serves three purposes: (1) help users find related content, (2) support SEO through internal link equity, and (3) guide users toward conversion.

#### Pattern 1: Feature to Segment
Every feature page links to the segments where that feature is most relevant.

```
[Analyst Safety Review page]
────────────────────────────
"See how analyst review works for your organization"
  → K-12 Schools    → Higher Education    → Churches    → Corporate
```

#### Pattern 2: Segment to Proof
Every segment page links to relevant case studies, sample binders, and testimonials.

```
[K-12 Solutions page]
────────────────────
"See what a reviewed trip looks like"
  → Download K-12 Sample Binder
  → Read: Springfield USD Case Study
```

#### Pattern 3: Content to Conversion
Every content page (blog post, guide, case study) ends with a contextual CTA.

```
[Blog post about field trip liability]
──────────────────────────────────────
"Ready to document every safety decision?"
  → [Download a Sample Binder]    → [Get a Demo]
```

#### Pattern 4: Pricing to Justification
Pricing page links to ROI calculator, case studies, and liability framing content.

```
[Pricing page]
──────────────
"Why organizations choose SafeTrekr"
  → Calculate your ROI    → Read case studies    → See a sample binder
```

#### Pattern 5: Procurement Integration
Every pricing-adjacent and segment page links to the procurement page.

```
[Persistent across evaluation pages]
────────────────────────────────────
"Ready to purchase? We have everything your procurement team needs."
  → For Procurement (W-9, Security Questionnaire, Contract Templates)
```

### 6.2 Cross-Link Matrix

| From Page Type | Links To | Link Context |
|---------------|----------|--------------|
| Homepage | Segment pages, Platform overview, How It Works, Pricing | Primary navigation, hero CTA, segment cards |
| Segment page | Feature pages, case studies, sample binders, pricing, procurement, blog posts | Inline proof, sidebar links, CTA sections |
| Feature page | Segment pages, related features, How It Works, sample binder | "Relevant for" section, related features, CTA |
| How It Works | Platform overview, segment pages, pricing, sample binder | Process steps link to capabilities, end CTA |
| Pricing | ROI calculator, procurement, case studies, How It Works, sample binder | Value justification, trust building |
| Blog post | Segment pages (if segment-relevant), feature pages (if capability-relevant), related posts, resource downloads | Inline links, related content sidebar, end CTA |
| Case study | Segment page (matching segment), feature pages (used capabilities), pricing | "Similar organizations" link, capability links |
| Resource (guide) | Segment pages, blog posts on same topic, pricing, demo | Related reading, end CTA |
| Procurement | Pricing, security page, contact | Return to evaluation path |

### 6.3 Persistent CTA Pattern

Every page (except legal pages) should end with one of three CTA variants:

| Variant | Used On | Primary CTA | Secondary CTA |
|---------|---------|-------------|---------------|
| **Discovery** | Blog posts, guides, early-funnel content | "Download a Sample Binder" | "See How It Works" |
| **Evaluation** | Feature pages, segment pages, case studies | "Get a Demo" | "View Pricing" |
| **Decision** | Pricing page, procurement page, ROI calculator | "Get Started" | "Contact Sales" |

---

## 7. Labeling System

### 7.1 Navigation Labels

Labels are chosen to match institutional buyer language -- the vocabulary of school administrators, university directors, church leadership, and corporate risk managers.

| Label | Rationale | Rejected Alternatives | Why Rejected |
|-------|-----------|----------------------|--------------|
| **Platform** | Communicates comprehensive system, not a single feature. Institutional buyers evaluate "platforms," not "products" or "features." | Product, Features, The Product | "Product" is commodity-coded. "Features" implies a feature list, not a system. |
| **Solutions** | Standard institutional sales language. Implies problem-solving, not just capability listing. | Industries, Segments, Who We Serve | "Industries" is too formal. "Segments" is internal jargon. "Who We Serve" is passive. |
| **How It Works** | Direct, scannable, promise of clarity. Addresses the "what do I actually get?" question. | Process, Our Approach, Methodology | "Process" is vague. "Our Approach" is ego-centric. "Methodology" is too academic. |
| **Pricing** | Direct and unambiguous. Institutional buyers expect transparent pricing. | Plans, Plans & Pricing, Investment | "Plans" implies subscriptions. "Investment" is corporate euphemism that erodes trust. |
| **Resources** | Standard term for educational/support content in enterprise software. | Library, Learn, Knowledge Base, Help | "Library" implies large volume. "Learn" is patronizing. "Knowledge Base" is too technical. |
| **For Procurement** | Speaks directly to the audience in their own role language. Removes guesswork. | Vendor Information, Purchasing, Buy | "Vendor Information" is bureaucratic. "Purchasing" is transactional. |
| **Get a Demo** | Standard B2B SaaS CTA. Sets clear expectation of what the user will experience. | Request a Quote, Book a Call, Start Free Trial | "Request a Quote" is high-friction. "Book a Call" is presumptuous. No free trial exists. |
| **Security & Trust** | Combines technical security with institutional trust. Both concepts matter for this audience. | Security, Compliance, Trust Center | "Security" alone misses trust. "Compliance" is narrow. "Trust Center" is jargon-heavy. |

### 7.2 Segment Labels

| Segment | Navigation Label | Page Title (H1) | Rationale |
|---------|-----------------|------------------|-----------|
| K-12 | K-12 Schools & Districts | Trip Safety for K-12 Schools & Districts | "Schools & Districts" captures both individual schools and district-level buyers |
| Higher Ed | Higher Education | Trip Safety for Higher Education | "Higher Education" is the standard term; "Universities" excludes colleges and community colleges |
| Churches | Churches & Mission Organizations | Trip Safety for Churches & Mission Organizations | "Mission Organizations" captures parachurch orgs and standalone mission agencies |
| Corporate | Corporate & Sports Teams | Trip Safety for Corporate & Sports Teams | "Sports Teams" is explicitly included because it is a distinct sub-segment with different needs |

### 7.3 Feature Labels

| Feature | Marketing Label | Short Description | Internal Name |
|---------|----------------|-------------------|---------------|
| 17-section analyst review | Analyst Safety Review | Professional review of every trip location, plan, and logistics detail | analyst_review |
| TarvaRI + Monte Carlo | Risk Intelligence Engine | Automated risk scoring from 5 government data sources using Monte Carlo simulation | tarvari_risk_engine |
| Trip binder + evidence | Trip Safety Binder | Audit-ready documentation with tamper-evident hash-chain integrity | trip_packet |
| Mobile chaperone/traveler app | Mobile Field Operations | Real-time safety tools for chaperones and travelers in the field | mobile_app |
| Geofencing + rally + muster | Real-Time Monitoring | Live location tracking, geofence alerts, rally points, and muster check-ins | protection_system |
| Hash-chain + FERPA + SOC 2 | Compliance & Evidence | Tamper-evident audit trail meeting FERPA, SOC 2, and GDPR requirements | compliance_evidence |

### 7.4 CTA Labels

| Context | Primary CTA | Secondary CTA | Tertiary Link |
|---------|-------------|---------------|---------------|
| Homepage hero | Get a Demo | See How It Works | -- |
| Segment landing page | Download Sample Binder | Get a Demo | View Pricing |
| Feature page | Get a Demo | Explore Platform | -- |
| How It Works | Get a Demo | Download Sample Binder | -- |
| Pricing page | Get Started | Contact Sales | For Procurement |
| Blog post | Download Sample Binder | Get a Demo | -- |
| Case study | Get a Demo | Read More Case Studies | -- |
| Resources overview | Browse Resources | Get a Demo | -- |
| Procurement page | Contact Sales | Download Documents | -- |

### 7.5 Section Header Labels (On-Page)

| Section Purpose | Recommended Label | Avoid |
|----------------|-------------------|-------|
| Problem statement | "The challenge" or "[Segment]-specific challenge" | "The problem" (too negative) |
| Feature overview | "How SafeTrekr protects every trip" | "Our features" (ego-centric) |
| Social proof | "Trusted by [type]" or "Organizations using SafeTrekr" | "Testimonials" (performative) |
| Pricing | "Transparent pricing for every trip type" | "Our plans" (implies subscription) |
| Process steps | "How it works: from submission to safety binder" | "Our process" |
| FAQ | "Common questions" or "Questions from [segment]" | "FAQ" alone (acronym, less scannable) |
| CTA section | "Ready to protect your next trip?" | "Get started today!" (generic SaaS) |
| Compliance | "Security and compliance you can verify" | "We take security seriously" (empty claim) |
| Sample binder | "See exactly what you get" | "Download our brochure" (wrong frame) |

---

## 8. URL Architecture

### 8.1 URL Design Principles

| Principle | Rule | Example |
|-----------|------|---------|
| **Human-readable** | URLs should be understandable by reading them | `/solutions/k12` not `/solutions?id=1` |
| **Lowercase, hyphenated** | All lowercase, hyphens between words | `/platform/analyst-review` not `/Platform/Analyst_Review` |
| **No trailing slashes** | Canonical URLs have no trailing slash | `/pricing` not `/pricing/` |
| **Descriptive slugs** | Blog and resource slugs reflect content | `/blog/ferpa-compliance-school-travel` |
| **Shallow hierarchy** | Maximum 3 segments for core pages | `/resources/case-studies/springfield-usd` |
| **No file extensions** | Clean URLs without `.html` | `/about` not `/about.html` |
| **Canonical tags** | Every page declares its canonical URL | `<link rel="canonical" href="https://safetrekr.com/pricing">` |

### 8.2 Complete URL Map

| Page | URL | Redirect From |
|------|-----|---------------|
| Homepage | `/` | -- |
| Platform Overview | `/platform` | `/features`, `/product` |
| Analyst Safety Review | `/platform/analyst-review` | `/features/analyst-review` |
| Risk Intelligence Engine | `/platform/risk-intelligence` | `/features/risk-intelligence` |
| Trip Safety Binder | `/platform/safety-binder` | `/features/safety-binder`, `/features/trip-binder` |
| Mobile Field Operations | `/platform/mobile-app` | `/features/mobile`, `/mobile` |
| Real-Time Monitoring | `/platform/monitoring` | `/features/monitoring`, `/features/geofencing` |
| Compliance & Evidence | `/platform/compliance` | `/features/compliance`, `/compliance` |
| Solutions Overview | `/solutions` | -- |
| K-12 Schools | `/solutions/k12` | `/solutions/k-12`, `/solutions/schools`, `/k12` |
| Higher Education | `/solutions/higher-education` | `/solutions/higher-ed`, `/solutions/universities`, `/higher-education` |
| Churches & Mission | `/solutions/churches` | `/solutions/church`, `/solutions/mission`, `/churches` |
| Corporate & Sports | `/solutions/corporate` | `/solutions/business`, `/solutions/sports`, `/corporate` |
| How It Works | `/how-it-works` | `/process`, `/how-safetrekr-works` |
| Pricing | `/pricing` | `/plans`, `/pricing-plans` |
| Resources Overview | `/resources` | -- |
| Case Studies Index | `/resources/case-studies` | `/case-studies` |
| Case Study Detail | `/resources/case-studies/[slug]` | -- |
| Guides Index | `/resources/guides` | `/guides`, `/whitepapers` |
| Guide Detail | `/resources/guides/[slug]` | -- |
| Sample Binders | `/resources/sample-binders` | `/sample-binders` |
| Sample Binder Detail | `/resources/sample-binders/[slug]` | -- |
| Webinars | `/resources/webinars` | `/webinars` |
| FAQ | `/resources/faq` | `/faq` |
| ROI Calculator | `/resources/roi-calculator` | `/roi-calculator`, `/roi` |
| Blog Index | `/blog` | -- |
| Blog Post | `/blog/[slug]` | -- |
| Blog Category | `/blog/category/[category]` | -- |
| Blog Tag | `/blog/tag/[tag]` | -- |
| About | `/about` | `/about-us`, `/company` |
| Our Analysts | `/about/analysts` | `/team`, `/our-team`, `/analysts` |
| Security & Trust | `/security` | `/trust`, `/trust-center`, `/security-and-trust` |
| For Procurement | `/procurement` | `/for-procurement`, `/vendor-info` |
| Contact | `/contact` | `/contact-us` |
| Demo Request | `/demo` | `/request-demo`, `/get-a-demo`, `/book-demo` |
| Get Started | `/get-started` | `/signup`, `/start` |
| Partners | `/partners` | `/partner-program` |
| Terms of Service | `/legal/terms` | `/terms`, `/terms-of-service` |
| Privacy Policy | `/legal/privacy` | `/privacy`, `/privacy-policy` |
| DPA | `/legal/dpa` | `/dpa` |
| Acceptable Use | `/legal/acceptable-use` | `/acceptable-use-policy` |
| Cookie Policy | `/legal/cookies` | `/cookies`, `/cookie-policy` |
| Status | `/status` | -- |

### 8.3 Redirect Strategy

All redirect-from URLs should return **301 (Permanent Redirect)**. This serves two purposes:
1. **SEO**: Passes link equity from old URLs to canonical URLs
2. **User forgiveness**: Common URL guesses resolve correctly

Implement redirects as Next.js `next.config.js` redirects for static patterns, or middleware for dynamic patterns.

### 8.4 Blog URL Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Post slug | Lowercase, hyphenated, descriptive, 3-8 words | `ferpa-compliance-school-travel` |
| Category slug | Lowercase, hyphenated, 1-3 words | `k12-compliance`, `trip-safety`, `product-updates` |
| Tag slug | Lowercase, hyphenated, 1-2 words | `ferpa`, `monte-carlo`, `case-study` |
| Date in URL | **Not included** (evergreen content should not age in URLs) | `/blog/title` not `/blog/2026/03/title` |

---

## 9. Metadata Strategy

### 9.1 Title Tag Patterns

| Page Type | Pattern | Example |
|-----------|---------|---------|
| Homepage | `SafeTrekr -- [Tagline]` | `SafeTrekr -- Analyst-Reviewed Trip Safety for Every Organization` |
| Platform pages | `[Feature Name] -- SafeTrekr Platform` | `Analyst Safety Review -- SafeTrekr Platform` |
| Segment pages | `Trip Safety for [Segment] -- SafeTrekr` | `Trip Safety for K-12 Schools & Districts -- SafeTrekr` |
| How It Works | `How SafeTrekr Works -- From Trip Submission to Safety Binder` | -- |
| Pricing | `Pricing -- SafeTrekr Trip Safety Management` | -- |
| Blog posts | `[Post Title] -- SafeTrekr Blog` | `FERPA Compliance for School Travel -- SafeTrekr Blog` |
| Case studies | `[Org Name]: [Result] -- SafeTrekr Case Study` | `Springfield USD: 40% Reduction in Trip Planning Time -- SafeTrekr Case Study` |
| Resources | `[Resource Title] -- SafeTrekr Resources` | `K-12 Field Trip Safety Planning Guide -- SafeTrekr Resources` |
| Legal | `[Policy Name] -- SafeTrekr` | `Privacy Policy -- SafeTrekr` |

**Rules**:
- Maximum 60 characters (visible in SERP)
- Brand name ("SafeTrekr") always present, typically at end
- Primary keyword front-loaded
- No keyword stuffing

### 9.2 Meta Description Patterns

| Page Type | Pattern | Character Target |
|-----------|---------|-----------------|
| Homepage | Value proposition + unique mechanism + CTA | 150-160 chars |
| Platform pages | Feature benefit + differentiator + CTA | 150-160 chars |
| Segment pages | Segment-specific problem + solution + proof point | 150-160 chars |
| Blog posts | Article premise + key takeaway | 150-160 chars |
| Resources | Resource type + value + who it is for | 150-160 chars |

**Example descriptions**:

- **Homepage**: "Every trip reviewed by a safety analyst. Risk scored from 5 government sources. Audit-ready documentation in 3-5 days. Trusted by schools, universities, churches, and businesses."
- **K-12 page**: "FERPA-compliant trip safety for K-12 schools and districts. Professional analyst review, risk intelligence, and audit-ready safety binders. Starting at $15/student."
- **Analyst Review**: "Every SafeTrekr trip is reviewed across 17 sections by a trained safety analyst. Locations verified. Risks documented. Emergency plans validated. Binder delivered in 3-5 days."

### 9.3 Open Graph / Social Metadata

Every page must include:

```html
<meta property="og:title" content="[Title]">
<meta property="og:description" content="[Description]">
<meta property="og:image" content="https://safetrekr.com/og/[page-specific-image].png">
<meta property="og:url" content="https://safetrekr.com/[canonical-url]">
<meta property="og:type" content="website">  <!-- or "article" for blog posts -->
<meta property="og:site_name" content="SafeTrekr">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="[Title]">
<meta name="twitter:description" content="[Description]">
<meta name="twitter:image" content="https://safetrekr.com/og/[page-specific-image].png">
```

**OG Image strategy**:
- Generate unique OG images for each major page (segment pages, feature pages, homepage)
- Blog posts use featured image as OG image
- Default fallback OG image for pages without custom images
- OG images: 1200x630px, consistent brand treatment with page title overlaid

### 9.4 Structured Data (JSON-LD)

| Schema Type | Applied To | Purpose |
|-------------|-----------|---------|
| `Organization` | Homepage, About | Company information, logo, social links |
| `WebSite` | Homepage | Site-level search action (future) |
| `BreadcrumbList` | All L2+ pages | Breadcrumb display in SERP |
| `Product` | Pricing page | Pricing display in SERP |
| `FAQPage` | FAQ page, segment pages with FAQ | FAQ rich results in SERP |
| `Article` | Blog posts | Article rich results in SERP |
| `HowTo` | How It Works page | Process steps rich results |
| `SoftwareApplication` | Platform overview | Software rich results |
| `Review` / `AggregateRating` | Homepage (when real reviews exist) | Star ratings in SERP |

**Example: FAQPage Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is included in a SafeTrekr trip safety review?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Every trip undergoes a 17-section review by a trained safety analyst covering..."
      }
    }
  ]
}
```

**Example: Organization Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SafeTrekr",
  "url": "https://safetrekr.com",
  "logo": "https://safetrekr.com/logo.svg",
  "description": "Enterprise trip safety management platform with analyst-reviewed safety binders.",
  "sameAs": [
    "https://linkedin.com/company/safetrekr",
    "https://twitter.com/safetrekr"
  ]
}
```

### 9.5 Technical SEO Requirements

| Requirement | Implementation |
|-------------|----------------|
| `robots.txt` | Allow all public pages, disallow `/api/`, `/admin/`, `/get-started` (post-auth) |
| `sitemap.xml` | Dynamic generation via Next.js, include all public pages, blog posts, resources |
| Canonical tags | Every page, self-referencing or pointing to canonical for variant URLs |
| `hreflang` | Not needed at launch (English only); add when i18n is implemented |
| Page speed | Target <2.5s LCP, <100ms FID, <0.1 CLS (Core Web Vitals) |
| Mobile-friendly | Responsive design, no horizontal scroll, tap targets >48px |
| HTTPS | Enforced site-wide, HSTS headers |
| Image alt text | Descriptive alt text on all images, include relevant keywords naturally |

---

## 10. Content Priority Matrix

### 10.1 Priority Tiers

#### Tier 1: Critical for Conversion (Must-Have at Launch)

| Content | Conversion Role | Justification | Target Completion |
|---------|----------------|---------------|-------------------|
| **Homepage** | First impression, segment routing, credibility establishment | Every visitor sees this. Must communicate unique mechanism and route to segments within 5 seconds. | Week 1-2 |
| **4 Segment Landing Pages** | Segment-specific conversion | Each segment needs its own pain-solution-proof narrative. K-12 and Churches are beachhead segments. | Week 2-4 |
| **How It Works** | Process clarity, reduce friction | Institutional buyers need to understand the process before committing. 3-step or 5-step visual flow. | Week 2-3 |
| **Pricing Page** | Budget validation | Institutional buyers cannot advance without knowing cost. Per-student framing for K-12 is mandatory. | Week 2-3 |
| **Platform Overview** | Capability summary | Single page that communicates the full system. Links to feature detail pages. | Week 2-3 |
| **Demo Request Page/Flow** | Primary conversion endpoint | Every CTA leads here. Must be low-friction: name, email, org type, phone (optional). | Week 1-2 |
| **Security & Trust Page** | Evaluator validation | Risk managers and IT security will review this page. Must be factual and verifiable. | Week 3-4 |

#### Tier 2: High-Value Supporting Content (Launch or Within 30 Days)

| Content | Conversion Role | Justification |
|---------|----------------|---------------|
| **Analyst Safety Review (feature page)** | Unique mechanism explanation | This is the #1 differentiator. Needs its own page with depth. |
| **Risk Intelligence Engine (feature page)** | Technical credibility | Monte Carlo + 5 government sources is the technical moat. Evaluators want detail. |
| **Trip Safety Binder (feature page)** | Tangible deliverable explanation | "What do I actually get for $450?" This page answers that question. |
| **4 Sample Binder Downloads** | Lead generation | Highest-converting lead magnet. Gated with email capture. One per segment. |
| **Procurement Page** | Procurement officer enablement | W-9, security questionnaire, contract templates. Directly accelerates purchasing. |
| **FAQ Page** | Objection handling | 15-25 questions addressing common concerns: cost, process, compliance, timeline. |
| **About Page** | Credibility | Who built this? Why? What credentials? |
| **Contact Page** | Fallback conversion | For visitors who want human contact before demo. |

#### Tier 3: Growth Content (Months 1-3)

| Content | Growth Role | Justification |
|---------|------------|---------------|
| **Mobile Field Operations (feature page)** | Differentiation | The chaperone app is a demo-in-waiting. Needs video + screenshots. |
| **Real-Time Monitoring (feature page)** | Differentiation | Geofencing, rally points, muster -- unique capabilities. |
| **Compliance & Evidence (feature page)** | Enterprise readiness | Hash-chain evidence, purge proofs, GDPR. Critical for higher ed and corporate. |
| **ROI Calculator** | Value quantification | Interactive tool showing cost of DIY vs. SafeTrekr. |
| **Our Analysts Page** | Trust building | Who are the analysts? Credentials? Training? |
| **Blog (seed 4-6 posts)** | SEO foundation | Initial posts targeting high-value search terms per segment. |
| **Partners Page** | Channel development | For insurance partners, denominational partnerships. |

#### Tier 4: Scaling Content (Months 3-6)

| Content | Scaling Role | Justification |
|---------|-------------|---------------|
| **Case Studies (2-4)** | Social proof | Real customer stories with metrics. Cannot publish until real customers exist. |
| **Webinars** | Thought leadership | Educational content that captures leads at top of funnel. |
| **Guides/Whitepapers (4-6)** | SEO + lead generation | Downloadable, gated content for each segment. |
| **Blog (ongoing, 4-8/month)** | Organic traffic growth | Sustained content marketing targeting long-tail keywords. |

#### Tier 5: Nice-to-Have / Future

| Content | Future Role |
|---------|-------------|
| **Comparison pages** (SafeTrekr vs. spreadsheets, vs. Chapperone, vs. consulting firms) | Competitive positioning |
| **Integration directory** | Enterprise readiness |
| **Developer/API documentation** | Technical buyers |
| **Careers page** | Hiring |
| **Newsroom/Press** | PR |
| **Customer community** | Retention |

### 10.2 Content Production Roadmap

```
WEEK 1-2:   Homepage, Demo page, Pricing, Platform Overview, How It Works
WEEK 2-4:   4 Segment Landing Pages, Security & Trust
WEEK 3-5:   3 Core Feature Pages (Analyst Review, Risk Intelligence, Safety Binder)
WEEK 4-6:   Procurement, FAQ, About, Contact, 4 Sample Binder Downloads
WEEK 5-8:   3 More Feature Pages (Mobile, Monitoring, Compliance), Our Analysts
WEEK 6-10:  Blog seed (4-6 posts), ROI Calculator, Partners
MONTH 3-6:  Case Studies, Guides, Webinars, Blog cadence established
```

---

## Feature Inventory (Pages/Sections)

### Core Pages

| Page | User Value | Technical Implications | Priority |
|------|-----------|----------------------|----------|
| Homepage | First impression, segment routing, credibility | Hero animation (operational motion), segment cards, proof strip, CTA | P0 |
| Platform Overview | System-level understanding of SafeTrekr | Feature cards, product visuals, cross-links to detail pages | P0 |
| Analyst Safety Review | Explain core differentiator | 17-section breakdown, visual timeline, analyst credential content | P1 |
| Risk Intelligence Engine | Technical credibility | Monte Carlo explanation, 5-source visualization, risk score examples | P1 |
| Trip Safety Binder | Tangible deliverable | Binder preview images, hash-chain explanation, sample download CTA | P1 |
| Mobile Field Operations | Mobile differentiation | App screenshots or video, feature list, platform support | P2 |
| Real-Time Monitoring | Field ops capability | Geofence visualization, rally point maps, muster flow | P2 |
| Compliance & Evidence | Enterprise trust | Compliance badge grid, evidence chain diagram, cert links | P2 |

### Segment Pages

| Page | User Value | Technical Implications | Priority |
|------|-----------|----------------------|----------|
| K-12 Schools | Segment-specific conversion | FERPA framing, per-student pricing calc, parent portal mention | P0 |
| Higher Education | Segment-specific conversion | Clery Act, study abroad scenarios, international risk framing | P0 |
| Churches & Mission | Segment-specific conversion | Insurance requirements, volunteer liability, budget sensitivity | P0 |
| Corporate & Sports | Segment-specific conversion | Duty of care, team travel, enterprise compliance framing | P0 |
| Solutions Overview | Segment routing page | 4 segment cards, brief overview of each | P0 |

### Conversion & Trust Pages

| Page | User Value | Technical Implications | Priority |
|------|-----------|----------------------|----------|
| How It Works | Process clarity | 3-5 step visual timeline, animations, embedded video (optional) | P0 |
| Pricing | Budget validation | 3 tier cards, per-student toggle, volume discounts, payment methods | P0 |
| Demo Request | Conversion endpoint | Form (name, email, org type, segment, phone), Calendly or custom scheduling | P0 |
| Security & Trust | Evaluator validation | Compliance grid, encryption details, SOC 2 mention, data flow diagram | P0 |
| Procurement | Purchase enablement | Document downloads (W-9, security questionnaire), contract templates | P1 |
| Contact | Fallback conversion | Form + email + phone, business hours, response time expectation | P1 |
| FAQ | Objection handling | Accordion component, 15-25 items, segment-filterable | P1 |

### Content/Growth Pages

| Page | User Value | Technical Implications | Priority |
|------|-----------|----------------------|----------|
| Blog Index | Content discovery | Paginated list, category filter, search (future), featured post | P2 |
| Blog Post | SEO traffic, education | MDX rendering, related posts, CTA, social sharing, author byline | P2 |
| Resources Overview | Resource discovery | Grid of resource types, filterable by segment and type | P2 |
| Case Study | Social proof | Structured template (challenge, solution, results), metrics, quote | P2 |
| Guide | Lead generation | Content or PDF download, optional email gate | P2 |
| Sample Binders | Lead generation | Preview images, gated download, segment-specific variants | P1 |
| ROI Calculator | Value quantification | Interactive form, dynamic output, shareable results | P2 |
| Webinars | Lead generation | Event listing, registration (upcoming) or recording (past) | P3 |

### Company Pages

| Page | User Value | Technical Implications | Priority |
|------|-----------|----------------------|----------|
| About | Credibility, mission | Company story, founder story, values | P1 |
| Our Analysts | Trust building | Team/analyst profiles, credentials, training methodology | P2 |
| Partners | Channel development | Partner program description, benefits, application | P3 |

### Legal Pages

| Page | User Value | Technical Implications | Priority |
|------|-----------|----------------------|----------|
| Terms of Service | Legal compliance | MDX content, effective date, version | P1 |
| Privacy Policy | Legal compliance, trust | MDX content, effective date, data practices detail | P1 |
| DPA | Enterprise compliance | Downloadable PDF + web version | P2 |
| Acceptable Use | Legal compliance | MDX content | P2 |
| Cookie Policy | Regulatory compliance | MDX content, cookie consent integration | P2 |

---

## Opportunities & Gaps

### Opportunities

1. **Sample Binder as Lead Magnet Ecosystem**: Create segment-specific sample binders (K-12 field trip, study abroad, mission trip, corporate offsite) as the primary lead generation mechanism. Each sample binder acts as the "proof of value" that replaces the need for a free trial. This is the single highest-converting content asset the site can produce, and it requires zero engineering beyond PDF hosting and a form.

2. **Per-Student Pricing Framing for K-12**: Competitor Chapperone already uses per-student pricing. SafeTrekr's $450/trip for 30 students is $15/student -- dramatically more persuasive than "$450/trip." A simple toggle on the pricing page ("Show per-student pricing") addresses K-12 sticker shock without changing the actual pricing model.

3. **Liability-Cost Narrative as Conversion Driver**: The marketing site should frame pricing against the cost of NOT having SafeTrekr: the average settlement for a trip incident ($50K-$500K), hours of staff time for manual planning ($500-$3,000 per trip), insurance premium implications. The ROI calculator page serves this purpose and should be cross-linked from every pricing mention.

4. **SEO Content Clusters for Long-Tail Organic Traffic**: By publishing 4-6 blog posts per cluster per segment, SafeTrekr can capture organic search traffic for terms like "school field trip safety checklist," "study abroad risk assessment," "church mission trip insurance requirements," and "corporate travel duty of care." These are low-competition, high-intent keywords.

5. **Procurement Page as Trust Accelerator**: Making W-9s, security questionnaires, and contract templates publicly available (or easily downloadable after email capture) reduces the back-and-forth that extends institutional sales cycles. This page should be elevated to utility nav visibility.

6. **Parent/Guardian Referral CTA in Resources**: Create a "Recommend SafeTrekr to Your School" or "Tell Your Church About SafeTrekr" shareable page with pre-written email templates. Parents who experience the guardian mobile view during a trip are the most motivated bottom-up demand generation channel.

### Gaps

1. **No Real Social Proof**: The existing marketing site uses fabricated testimonials. Until real customer testimonials, case studies, and usage metrics exist, the social proof sections should use quantified platform proof ("5 government intel sources / 17 safety review sections / 3-5 day turnaround / AES-256 encryption") instead of fake quotes. This is a hard constraint on the architecture: social proof sections are designed into the templates but left empty until verified.

2. **No Self-Service Trial or Demo**: The architecture accommodates "Get a Demo" as the primary CTA, but the lack of any self-serve experience (interactive demo, product tour, video walkthrough) limits conversion. Recommendation: produce a 60-90 second narrated screen recording of the chaperone mobile view during an active trip. This single video asset could be embedded on every feature page and segment landing page.

3. **Compliance Certification Status Unclear**: The security page must accurately represent current certification status. If SOC 2 Type II and FERPA assessments have not been completed, the page should state "designed with [standard] requirements in mind" rather than claiming compliance. Misrepresenting compliance status to institutional buyers is a disqualifier.

4. **Blog and Content Marketing at Zero**: At launch, the site will have minimal content marketing assets. The SEO content cluster strategy requires sustained content production (4-8 posts per month) to generate meaningful organic traffic. Content production capacity is a dependency.

5. **No Video Assets**: The visual brief calls for "quietly cinematic" motion, but no product demo videos, analyst workflow recordings, or mobile app screen captures exist. Video is the highest-engagement medium for demonstrating the mobile app and analyst review capabilities.

---

## Recommendations (Top 5)

### Recommendation 1: Build Segment Landing Pages Before Feature Pages

**Priority**: P0
**Effort**: 2 weeks (content + design + build for 4 pages)
**Impact**: Directly enables segment-specific SEO, paid campaign landing, and partnership outreach

The segment landing pages (`/solutions/k12`, `/solutions/higher-education`, `/solutions/churches`, `/solutions/corporate`) are the most important pages after the homepage. Each segment has fundamentally different pain points, regulatory contexts, and buying motivations. A K-12 administrator and a corporate travel manager must see themselves on the page within 3 seconds. Build these with the structured template defined in Section 4.2, and prioritize K-12 and Churches as the beachhead segments.

### Recommendation 2: Implement the Sample Binder Lead Magnet System

**Priority**: P1
**Effort**: 1 week (4 PDF binders + gated download component)
**Impact**: Creates the highest-converting lead generation asset on the site

Produce four redacted sample binders (K-12 field trip, study abroad, mission trip, corporate offsite) and surface them on segment landing pages, the How It Works page, the pricing page, and as persistent secondary CTAs. Gate downloads with email capture (name, email, organization type). This creates a lead pipeline without requiring a free trial or product demo.

### Recommendation 3: Use Quantified Proof Strips Instead of Fabricated Testimonials

**Priority**: P0 (architectural decision)
**Effort**: 0 (design choice)
**Impact**: Eliminates the single largest credibility risk on the site

Replace all placeholder testimonials with a quantified proof strip: "5 Government Intel Sources / 17 Analyst Review Sections / 3-5 Day Turnaround / AES-256 Encryption / SHA-256 Evidence Chain." This communicates tangible capability without fabricating social proof. When real customer testimonials are available, they can be added alongside the proof strip. The IA templates for segment pages and the homepage include both a proof strip slot and a testimonial slot -- but the testimonial slot must remain empty until verified quotes exist.

### Recommendation 4: Elevate Procurement to Utility Navigation

**Priority**: P1
**Effort**: Minimal (navigation placement)
**Impact**: Accelerates institutional purchasing cycles by 2-4 weeks

The "For Procurement" link should appear in the utility navigation (alongside "Log In" and "Get a Demo") on every page. Procurement officers are a distinct stakeholder in the buying journey. They visit the site late in the evaluation process and need to find compliance documents, W-9s, and contract templates without navigating through marketing content. The current architecture orphans this content. Elevating it to utility nav makes it findable in one click from any page.

### Recommendation 5: Design the Navigation for 5 Primary Items Maximum

**Priority**: P0 (architectural constraint)
**Effort**: N/A (design principle)
**Impact**: Ensures mobile usability, reduces cognitive load, maintains scalability

The primary navigation should contain exactly 5 items: Platform, Solutions, How It Works, Pricing, Resources. This constraint ensures: (1) mobile drawer navigation remains usable, (2) each item gets sufficient visual weight on desktop, (3) additional content (blog, about, legal) routes through the footer and utility nav without cluttering the primary navigation, and (4) the architecture can scale by adding sub-items within existing categories rather than adding top-level items.

---

## Dependencies & Constraints

### Content Dependencies

| Dependency | Blocks | Owner | Risk |
|------------|--------|-------|------|
| Real customer testimonials | Social proof sections on all pages | Sales/Customer Success | HIGH -- cannot fabricate; use proof strips until available |
| Sample binder PDFs (4) | Lead magnet system, segment page CTAs | Product/Design | MEDIUM -- requires redacted real binder or manufactured sample |
| Product screenshots and videos | Feature pages, segment pages, homepage hero | Product/Design | HIGH -- requires production-like environment with real data |
| Compliance certification status | Security & Trust page, compliance badges | Legal/Engineering | HIGH -- claims must be verifiable; misrepresentation is a disqualifier |
| Blog content (seed 4-6 posts) | SEO foundation, resource hub | Content/Marketing | MEDIUM -- can launch without, but SEO clock doesn't start until published |
| Case studies (2-4) | Social proof, resources section | Sales/Customer Success | LOW at launch -- requires real customers; slot is designed but empty |

### Technical Dependencies

| Dependency | Blocks | Owner | Risk |
|------------|--------|-------|------|
| Next.js app scaffolding | All pages | Engineering | LOW -- standard Next.js setup |
| CMS or content management approach | Blog, resources, FAQ content updates | Engineering | MEDIUM -- decide headless CMS vs. MDX files early |
| Form handling (demo request, downloads) | Lead capture, sample binder gates | Engineering | LOW -- standard form + API route or third-party |
| Analytics implementation | All measurement, funnel tracking | Engineering | MEDIUM -- must be in place at launch for baseline data |
| OG image generation | Social sharing, link previews | Engineering/Design | LOW -- can use static images initially, automate later |
| Sitemap generation | SEO indexing | Engineering | LOW -- Next.js has built-in sitemap support |
| Redirect implementation | URL architecture, SEO | Engineering | LOW -- Next.js config redirects |

### Organizational Constraints

| Constraint | Impact | Mitigation |
|-----------|--------|------------|
| No real customers yet | Cannot produce testimonials, case studies, or verified usage metrics | Use quantified proof strips; design template slots for future social proof |
| Compliance certs not yet obtained | Security page must be carefully worded | Use "designed with [standard] requirements" language; begin FERPA certification process |
| Single-developer velocity | Content production and build compete for same resource | Prioritize Tier 1 pages; defer Tier 3+ content; use MDX for content that non-engineers can contribute |
| Seasonal buying cycles | K-12 budgets set Jan-Mar for fall trips | Marketing site must be live and indexed by January for fall trip season targeting |
| Mobile app not in App Store | Cannot demo mobile experience via app | Use video recordings and screenshots of mobile app as marketing assets |

### Measurement Plan

| KPI | Target | Tool | Baseline |
|-----|--------|------|----------|
| Pages per session | >2.5 | Analytics | 0 (new site) |
| Segment page engagement | >60% scroll depth | Analytics | 0 |
| Demo request conversion rate | >3% of unique visitors | Form analytics | 0 |
| Sample binder download rate | >5% of segment page visitors | Form analytics | 0 |
| Organic search impressions | >10K/month by month 6 | Search Console | 0 |
| Blog traffic | >2K/month by month 6 | Analytics | 0 |
| Bounce rate (homepage) | <50% | Analytics | 0 |
| Mobile usability score | 100/100 | Lighthouse | 0 |
| Core Web Vitals | All "Good" | Search Console | 0 |
| Procurement page visits | Track volume and referral source | Analytics | 0 |

---

## Appendix A: Accessibility Requirements for Navigation

| Requirement | Implementation |
|-------------|----------------|
| **Skip navigation** | `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>` as first focusable element |
| **Semantic landmarks** | `<nav aria-label="Main navigation">`, `<nav aria-label="Utility">`, `<nav aria-label="Footer">`, `<main id="main-content">` |
| **Keyboard navigation** | Full tab navigation through all primary and dropdown items. Arrow keys for mega-menu. Escape to close. |
| **Focus management** | Visible focus ring (use design system `ring` token). Focus trapped within open mega-menu. Return focus on close. |
| **ARIA expanded** | `aria-expanded="true/false"` on all dropdown triggers |
| **ARIA current** | `aria-current="page"` on active navigation item |
| **Mobile drawer** | Focus trapped in open drawer. Escape key closes. Return focus to menu trigger on close. |
| **Breadcrumbs** | `<nav aria-label="Breadcrumb">` with `<ol>` structure. Current page is `aria-current="page"`. |
| **Reduced motion** | Respect `prefers-reduced-motion` for all navigation animations |
| **Color contrast** | All navigation text meets WCAG 2.2 AA (4.5:1 for normal text, 3:1 for large text) |

---

## Appendix B: Validation Plan

| Method | Purpose | Participants | When |
|--------|---------|--------------|------|
| **Tree Test** | Validate navigation hierarchy. Can users find segment pages, feature pages, pricing, procurement? | 15-20 participants across segments | Before build (using Optimal Workshop or similar) |
| **Card Sort (Closed)** | Validate content groupings. Do users expect "Sample Binders" under "Resources"? Does "Platform" make sense? | 12-15 participants | Before build |
| **First-Click Test** | Validate CTAs and entry points. Where do K-12 admins click first? Where do procurement officers go? | 10-15 per segment | After wireframes, before development |
| **5-Second Test** | Does the homepage communicate what SafeTrekr does? Can users identify their segment entry point? | 20 participants | After homepage design |
| **Navigation Analytics** | Track actual navigation patterns, drop-off points, segment page engagement post-launch | All visitors (passive) | Post-launch, ongoing |
| **Search Log Analysis** | Identify content gaps from what users search for but cannot find | All search users (when search is implemented) | Post-search implementation |

---

*Analysis produced for the best prompter in existence. Architecture version 1.0.0. Next review: after tree test validation results.*
