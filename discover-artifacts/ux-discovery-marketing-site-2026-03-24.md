# SafeTrekr Marketing Site -- UX Discovery Analysis

**Date**: 2026-03-24
**Analyst**: UX Designer (Discovery Mode: Greenfield)
**Scope**: Complete UX architecture for SafeTrekr marketing website
**Stack**: Next.js + React, responsive web (desktop + mobile)
**Visual Direction**: Executive Trust, Light Theme

---

## Executive Summary

SafeTrekr has a product problem disguised as a marketing problem. The platform is technically remarkable -- 292K lines of code, 17-section analyst review, Monte Carlo risk scoring from 5 government intelligence sources, SHA-256 hash-chain evidence binders -- and none of this is visible to a single prospective buyer. The marketing site is not just underselling the product; it is hiding the product entirely.

This discovery analysis architects the UX for a greenfield marketing site that must accomplish four things simultaneously:

1. **Communicate a complex, multi-layered product in under 8 seconds** to institutional buyers who are skeptical by training and overwhelmed by vendor noise.
2. **Convert without self-service signup**, meaning the conversion path must earn enough trust through content to justify a human-mediated sales process (Request a Demo / Download Sample Binder).
3. **Serve four distinct buyer segments** (K-12, higher ed, churches, corporate) whose regulatory contexts, budget structures, and emotional triggers differ fundamentally.
4. **Establish category authority** in a market where the closest competitor (Chapperone) is a lightweight logistics tool and the enterprise incumbents (International SOS, Crisis24) charge 100x the price.

The site must feel like a refined command center translated into a public-facing brand -- not a travel brochure, not a fear campaign, not a generic SaaS template. The visual system (neutral base #e7ecee, brand green #4ca46e, authority blue #123646) and the motion language ("operational motion" -- systems activating, routes resolving, layers revealing) are already well-defined. This analysis provides the structural UX architecture to build on that foundation.

The central UX thesis: **every page on this site should make the visitor feel that SafeTrekr already knows more about their next trip's risks than they do -- and that feeling should compel action.**

---

## Key Findings

### 1. The buyer is not one person -- it is a committee

Institutional purchasing for SafeTrekr involves 3-5 stakeholders across a 3-12 month cycle:

| Role | Motivation | Information Need | Trust Signal |
|------|-----------|-----------------|-------------|
| **Trip Coordinator** (champion) | Reduce personal workload and liability exposure | How it works, what they get, time savings | Product demo, sample binder |
| **Risk Manager / Administrator** | Compliance documentation, board-level defense | 17-section review detail, data sources, evidence binder | Government source logos, compliance badges |
| **Procurement Officer** | Vendor viability, pricing, contract terms | W-9, insurance certs, security posture, volume pricing | SOC 2 badge, procurement resource center |
| **Finance / Board** | Budget justification, ROI | Per-student cost, liability comparison, insurance premium impact | ROI calculator, competitor pricing comparison |
| **Parent / Guardian** (influencer) | Child safety, transparency | What information they receive, how tracking works | Mobile app preview, guardian view demo |

**UX implication**: The site cannot be designed for a single persona. It must provide clear navigation paths for each stakeholder role while maintaining a unified narrative. The homepage serves the champion; deeper pages serve the evaluators.

### 2. The conversion model is "trust before transaction"

Without self-service signup, every conversion requires the visitor to provide contact information and wait for human follow-up. This is inherently high-friction for time-constrained institutional buyers. The UX must compensate by:

- Offering a high-value, low-commitment first action (download a redacted sample binder, not "Request a Quote")
- Front-loading enough product evidence that the demo request feels like a natural next step rather than a leap of faith
- Providing procurement-ready resources (W-9, security questionnaire, contract templates) that reduce downstream friction
- Making the "Request a Demo" CTA feel like access to something exclusive, not a generic sales funnel

The optimal CTA hierarchy is:
1. **Primary (top-of-funnel)**: "See a Sample Safety Binder" (gated with email capture)
2. **Secondary (mid-funnel)**: "Request a Demo" (personalized walkthrough)
3. **Tertiary (bottom-funnel)**: "Talk to Sales" / "Get a Custom Quote"
4. **Persistent (all pages)**: "For Procurement Officers" link to resource center

### 3. The unique mechanism must be visible within the first scroll

The 17-section analyst review + Monte Carlo risk scoring from 5 government sources is the product's defensible moat. In the current marketing materials, this is invisible. On the new site, the hero section must communicate three things above the fold:

1. **What**: Every trip is reviewed by a human safety analyst (not just software)
2. **How**: Using intelligence from NOAA, USGS, CDC, ReliefWeb, and GDACS
3. **Result**: A legally defensible, audit-ready safety binder delivered in 3-5 days

This is the "5-second test" requirement. A visitor shown only the above-the-fold content for 5 seconds must be able to articulate what SafeTrekr does and why it is different.

### 4. Content density must vary by section purpose

The visual brief calls for "confidence through spacing, not confidence through shouting." This translates to a specific content density model:

| Section Type | Content Density | Spacing | Purpose |
|-------------|----------------|---------|---------|
| **Hero** | Low (headline + subhead + 2 CTAs + 1 composed visual) | Maximum whitespace | Immediate comprehension |
| **Value proposition** | Medium (3 cards or columns, each with icon + headline + 2-line description) | Generous | Quick scan of core benefits |
| **Product evidence** | High (detailed UI composition, feature breakdown, data source logos) | Tighter | Prove the claim |
| **Social proof** | Low-medium (metric strip or testimonial with attribution) | Generous | Build confidence |
| **Segment solutions** | Medium-high (regulatory callouts, workflow descriptions, pricing context) | Moderate | Speak to specific buyer |
| **Pricing** | Medium (cards with clear hierarchy, per-student breakdown, ROI context) | Structured | Enable comparison |
| **CTA band** | Low (single strong statement + 1-2 CTAs) | Maximum | Drive action |
| **Footer** | High (comprehensive links, compliance badges, contact) | Compact | Navigation + trust |

### 5. The "operational motion" visual language must serve comprehension, not decoration

The motion vocabulary defined in the visual brief -- route lines drawing in, status markers fading on, cards settling into layers, timelines progressing -- is not just aesthetic direction. It is a UX mechanism. Every animated element on the site should answer one of these questions for the visitor:

- "What does this platform monitor?" (map/route animations)
- "What does the review process look like?" (checklist/timeline animations)
- "What do I get when it is done?" (document/binder reveal animations)
- "How does it work during a live trip?" (status/alert animations)

Motion that does not answer one of these questions should not exist.

### 6. Mobile responsive strategy must prioritize the champion's context

Institutional buyers researching vendors on mobile are typically:
- Forwarded a link by a colleague ("check this out")
- Searching on their phone during a commute or meeting break
- Revisiting the site to show a decision-maker

The mobile experience must prioritize:
- Fast comprehension (hero clarity preserved at 375px)
- Easy sharing (native share integration, clean OG previews)
- Quick access to the sample binder download
- Readable pricing without horizontal scrolling
- One-tap call/email for direct contact

Mobile is not the primary conversion device for institutional B2B, but it is the primary discovery and sharing device.

### 7. Accessibility is both a legal requirement and a trust signal

For a platform that manages the safety of minors and serves public institutions (K-12 schools, state universities), WCAG 2.2 AA compliance is not optional -- it is a procurement requirement. But beyond compliance, accessibility signals the operational rigor that SafeTrekr claims to deliver. A site that fails basic accessibility while selling "documented accountability" undermines its own narrative.

### 8. The competitive positioning requires a "category of one" frame

SafeTrekr does not fit neatly into existing categories:
- It is not a travel management company (TMC) -- it does not book travel
- It is not travel insurance -- it does not pay claims
- It is not a school trip logistics tool (like Chapperone) -- it does not handle permission slips
- It is not an enterprise risk platform (like International SOS) -- it is 100x cheaper

The site must create a new category: **"Professional Trip Safety Review."** The information architecture should reinforce this framing through language, comparison, and evidence rather than positioning against any single competitor.

---

## User Journey Mapping

### Journey 1: K-12 School Administrator (Beachhead Segment)

**Entry point**: Google search "school field trip safety compliance" / colleague referral / conference mention
**Emotional state**: Anxious about liability, overwhelmed by administrative burden, skeptical of vendors
**Decision timeline**: 1-6 months (aligned with school budget cycles)

```
AWARENESS (Homepage)
  |  Sees: "Every trip reviewed by a safety analyst"
  |  Feels: "This is different from what we have been doing"
  |  Action: Scrolls to learn more
  v
INTEREST (How It Works / K-12 Solutions)
  |  Sees: 17-section review breakdown, FERPA mention, sample binder preview
  |  Feels: "This covers things I had not even thought of"
  |  Action: Downloads sample binder (email captured)
  v
EVALUATION (Pricing + Procurement)
  |  Sees: $15/student framing, ROI calculator, procurement resources
  |  Feels: "I can present this to my principal with a clear budget ask"
  |  Action: Requests a demo OR forwards pricing page to administrator
  v
JUSTIFICATION (Forwarded to Decision Makers)
  |  Risk manager sees: Government data sources, evidence binder, compliance docs
  |  Procurement sees: W-9, security questionnaire, volume pricing
  |  Board sees: Liability cost comparison, insurance premium context
  |  Action: Budget approval, contract execution
  v
ACTIVATION (Onboarding)
  |  First trip created, first binder delivered
  |  Guardian app shared with parents
  |  Renewal cycle begins
```

**Key pages needed**: Homepage, K-12 Solutions, How It Works, Pricing, Procurement Center, Sample Binder landing page

### Journey 2: Higher Education Director

**Entry point**: Google search "study abroad risk management" / conference / peer recommendation
**Emotional state**: Regulatory pressure (Clery Act), institutional reputation concern
**Decision timeline**: 3-12 months (tied to academic year planning)

```
AWARENESS --> INTEREST --> EVALUATION --> RFP PROCESS --> ACTIVATION
```

**Unique needs**: Clery Act compliance language, Title IX considerations, embassy/consulate integration story, international trip focus, departmental autonomy features, academic year pricing models

**Key pages needed**: Homepage, Higher Ed Solutions, How It Works, Security/Compliance, Procurement Center

### Journey 3: Church / Mission Trip Coordinator

**Entry point**: Google search "mission trip safety planning" / denominational recommendation / insurance requirement
**Emotional state**: Duty of care for volunteers and youth, budget-constrained, insurance-motivated
**Decision timeline**: 1-3 months (shorter cycle, smaller committee)

```
AWARENESS --> INTEREST --> BUDGET JUSTIFICATION --> ACTIVATION
```

**Unique needs**: Insurance requirement framing, volunteer screening (background checks), remote destination capabilities, cost framing against total trip budget (3-9% of budget), denominational partnership signals

**Key pages needed**: Homepage, Churches Solutions, How It Works, Pricing (with mission trip framing)

### Journey 4: Corporate Travel Manager

**Entry point**: Google search "duty of care travel compliance" / HR referral / incident response
**Emotional state**: Professional obligation, compliance-driven, integration-minded
**Decision timeline**: 3-6 months (procurement process)

```
AWARENESS --> FEATURE EVALUATION --> INTEGRATION ASSESSMENT --> PROCUREMENT --> ACTIVATION
```

**Unique needs**: Duty of care regulatory language, integration capabilities (even if limited today), enterprise pricing context, International SOS comparison (100x savings), multi-destination management, executive reporting

**Key pages needed**: Homepage, Corporate Solutions, How It Works, Security/Compliance, Pricing, Procurement Center

---

## Conversion UX Architecture

### The "Layered Trust" Model

Institutional buyers do not convert from a single page visit. They build trust over multiple sessions and share links with stakeholders. The conversion architecture must support this behavior:

**Layer 1 -- Immediate Credibility (0-8 seconds)**
- Clean, premium design signals institutional seriousness
- Hero communicates the unique mechanism (analyst + intelligence)
- Government data source logos visible without scrolling
- No placeholder testimonials, no fabricated social proof

**Layer 2 -- Evidence (8-60 seconds)**
- Product composition showing real UI (map panel, review checklist, binder preview)
- "How it works" in 3 clear steps
- Proof strip with quantified capabilities ("5 government sources / 17 review sections / 3-5 day delivery")

**Layer 3 -- Depth (1-5 minutes)**
- Segment-specific solutions pages with regulatory context
- Detailed analyst review breakdown
- Interactive sample binder preview
- Pricing with value anchoring

**Layer 4 -- Procurement (5+ minutes, return visits)**
- Security and compliance documentation
- Procurement resource center (W-9, contracts, questionnaires)
- ROI calculator with shareable output
- Case studies (when available; quantified proof strips until then)

### CTA Strategy

| Location | Primary CTA | Secondary CTA | Rationale |
|----------|------------|--------------|-----------|
| **Homepage hero** | "See a Sample Safety Binder" | "Watch a 2-Minute Demo" | Low commitment, high value |
| **After product evidence** | "Request a Demo" | "Download Sample Binder" | Trust has been built |
| **Solutions pages** | "Get a [Segment] Safety Review Quote" | "Download [Segment] Sample Binder" | Segment-specific language |
| **Pricing page** | "Start with a Free Consultation" | "Calculate Your ROI" | Pricing context established |
| **Procurement page** | "Download All Procurement Documents" | "Schedule a Security Review" | Procurement officer context |
| **Footer (every page)** | "Request a Demo" | "info@safetrekr.com" | Persistent access |
| **Sticky header (scroll)** | "Request a Demo" (compact) | -- | Reduces scroll-to-CTA friction |

### Lead Capture Strategy

The sample binder is the highest-converting potential lead magnet because it shows the prospect exactly what $450 buys. The lead capture flow:

1. Visitor clicks "See a Sample Safety Binder"
2. Modal or dedicated page: "Which type of trip are you planning?" (K-12 field trip / International mission trip / University study abroad / Corporate conference)
3. Email + Name + Organization fields (3 fields maximum)
4. Immediate delivery of segment-specific redacted sample binder PDF
5. Follow-up email sequence: Day 1 (welcome + binder guide), Day 3 (how it works video), Day 7 (ROI calculator link), Day 14 (demo offer)

---

## Content Hierarchy

### Above-the-Fold Requirements (Desktop: 1440px viewport, Mobile: 375px viewport)

**Desktop above-the-fold must contain:**
1. Navigation with logo, primary links, and "Request a Demo" CTA button
2. Hero headline: outcome-oriented, names the unique mechanism
3. Hero subheadline: quantified promise (e.g., "3-5 day delivery from 5 government intelligence sources")
4. Two CTAs: Primary (Sample Binder) + Secondary (Demo)
5. One composed product visual: map panel + review sidebar + binder preview (the "coordinated safety system in motion" scene described in the visual brief)
6. Trust strip below hero: "Powered by [NOAA] [USGS] [CDC] [ReliefWeb] [GDACS]" with logos

**Mobile above-the-fold must contain:**
1. Hamburger nav with logo and compact "Demo" CTA
2. Hero headline (shortened if needed for readability)
3. Hero subheadline (2 lines maximum)
4. Primary CTA button (full width)
5. Product visual (simplified, possibly static version of the desktop composition)

### Information Architecture per Section (Homepage)

**Section 1: Hero** (viewport height)
- Content: Headline, subhead, 2 CTAs, composed product visual, trust strip
- Density: Low
- Motion: Hero product visual with subtle route line animation, status markers appearing

**Section 2: Problem Statement** (half viewport)
- Content: "Most organizations manage trip safety with spreadsheets, PDF checklists, and hope" + 3 pain points (liability, time, compliance)
- Density: Low-medium
- Motion: Fade-in on scroll

**Section 3: How It Works** (full viewport)
- Content: 3-step visual process (Submit Trip Details -> Analyst Reviews with Intelligence -> Receive Safety Binder)
- Density: Medium
- Motion: Timeline progression, each step revealed in sequence

**Section 4: What Gets Reviewed** (full viewport)
- Content: Visual representation of 17-section review with category groupings
- Density: Medium-high
- Motion: Cards settling into grid, checklist items appearing

**Section 5: Intelligence Sources** (half viewport)
- Content: "Real-time intelligence from 5 government data sources" + source logos + brief descriptions
- Density: Medium
- Motion: Data flow visualization (sources -> analysis -> binder)

**Section 6: The Safety Binder** (full viewport)
- Content: Binder preview composition showing document pages, timeline, evidence chain
- Density: Medium
- Motion: Document reveal / page turn effect
- CTA: "See a Sample Safety Binder"

**Section 7: Who It Serves** (full viewport)
- Content: 4 segment cards (K-12, Higher Ed, Churches, Corporate) with segment-specific headline + 3 key features + "Learn More" link
- Density: Medium
- Motion: Cards layering in on scroll

**Section 8: Pricing Preview** (full viewport)
- Content: 3 trip tiers with per-student breakdown, "Starting at $15/student" anchor
- Density: Medium
- Motion: Minimal (pricing should feel stable and clear)
- CTA: "See Full Pricing" + "Calculate Your ROI"

**Section 9: Trust & Compliance** (half viewport)
- Content: Compliance badges (FERPA-ready, SOC 2 path, AES-256, SHA-256 hash chain), quantified proof strip
- Density: Medium
- Motion: Fade-in

**Section 10: Final CTA Band** (half viewport)
- Content: Strong closing statement + Primary CTA (Request a Demo) + Secondary CTA (Download Sample Binder)
- Density: Low
- Motion: Minimal

**Section 11: Footer** (compact)
- Content: Navigation links, compliance badges, contact info, social links, legal
- Surface: secondary (#123646) background for authority grounding

---

## Mobile Responsive Strategy

### Breakpoint Architecture

| Breakpoint | Width | Target Device | Layout Strategy |
|-----------|-------|---------------|----------------|
| `xs` | 0-639px | Phone portrait | Single column, stacked, full-width CTAs |
| `sm` | 640-767px | Phone landscape / small tablet | Single column with wider margins |
| `md` | 768-1023px | Tablet portrait | 2-column where appropriate |
| `lg` | 1024-1279px | Tablet landscape / small desktop | Full layout, condensed spacing |
| `xl` | 1280-1535px | Desktop | Full layout |
| `2xl` | 1536px+ | Large desktop | Full layout with max-width container (1440px content, centered) |

### Mobile-Specific Adaptations

**Navigation**
- Desktop: Horizontal nav with full link text + prominent "Request a Demo" button
- Mobile: Logo + hamburger + compact "Demo" pill button. Full-screen overlay menu on tap with segment quick-links and phone number.

**Hero Section**
- Desktop: Side-by-side layout (text left, product composition right)
- Mobile: Stacked (headline -> subhead -> CTAs -> product visual below fold). Product visual simplified to a single-panel cropped composition rather than the full multi-panel scene. Static image on mobile to preserve performance budget.

**Multi-Column Sections**
- Desktop: 3-4 column grids (feature cards, segment cards, pricing tiers)
- Mobile: Single column stack with horizontal scroll for pricing tiers only (common pattern for tier comparison on mobile). Feature cards stack vertically with progressive disclosure (show headline + expand for detail).

**Product Screenshots / UI Compositions**
- Desktop: Full-width composed scenes with overlapping panels
- Mobile: Single-panel crops, no overlapping layers. Each panel shown as a separate scrollable item or simplified to a single representative view.

**Tables and Comparison Grids**
- Desktop: Full table layout
- Mobile: Card-based layout where each row becomes a card, or horizontal scroll with fixed first column for comparison tables.

**CTAs**
- Desktop: Inline buttons, text links, persistent header CTA
- Mobile: Full-width buttons, sticky bottom CTA bar on pricing and solutions pages, tap-to-call for phone number.

**Footer**
- Desktop: Multi-column layout
- Mobile: Accordion sections for link groups, prominent contact info at top.

### Performance Budget (Mobile)

| Metric | Budget | Rationale |
|--------|--------|-----------|
| LCP | < 2.5s | Core Web Vital, affects SEO ranking |
| CLS | < 0.1 | Prevents layout shift during image/font loading |
| FID/INP | < 200ms | Responsive to user interaction |
| Total page weight (initial) | < 500KB | Includes above-fold images, critical CSS, JS |
| Hero image | < 150KB | WebP/AVIF with srcset for responsive sizing |
| Web fonts | < 100KB | Subset, preload critical weights only |
| JavaScript (initial) | < 150KB gzipped | Code-split below-fold sections |

### Mobile-Specific UX Considerations

- **Touch targets**: Minimum 44x44px for all interactive elements
- **Thumb zone**: Primary CTAs positioned in the natural thumb reach area (bottom center of screen)
- **Reduced motion**: Respect `prefers-reduced-motion` media query. All scroll-triggered animations should be disabled for users who request reduced motion. Content must be fully visible without animation.
- **Share integration**: Include Web Share API for easy forwarding to colleagues (critical for the committee buying process)
- **Offline**: Service worker for basic offline page with contact information (low priority, but useful for conference contexts)

---

## Accessibility Requirements (WCAG 2.2 AA)

### Structural Requirements

| Requirement | Implementation | Priority |
|------------|----------------|----------|
| **Skip navigation** | Hidden-until-focus link at top of every page: `<a href="#main-content" class="skip-nav">Skip to main content</a>` | P0 |
| **Landmark regions** | `<header>`, `<nav>`, `<main>`, `<footer>`, `<section aria-label="...">` for all major sections | P0 |
| **Heading hierarchy** | Single `<h1>` per page, sequential heading levels, no skipped levels | P0 |
| **Language attribute** | `<html lang="en">` on every page | P0 |
| **Page titles** | Unique, descriptive `<title>` per page (e.g., "K-12 School Trip Safety | SafeTrekr") | P0 |

### Color and Contrast

| Requirement | Specification | Notes |
|------------|--------------|-------|
| **Normal text contrast** | 4.5:1 minimum | foreground (#061a23) on background (#e7ecee) = 13.2:1 (passes) |
| **Large text contrast** | 3:1 minimum | foreground on card (#f7f8f8) = 16.8:1 (passes) |
| **UI component contrast** | 3:1 against adjacent colors | border (#b8c3c7) on background (#e7ecee) = 1.3:1 (FAILS -- borders must not be the sole indicator of component boundaries; use shadow or fill contrast as supplement) |
| **Focus indicators** | 2px minimum visible focus ring, 3:1 contrast against adjacent | ring (#365462) on background (#e7ecee) = 4.7:1 (passes) |
| **Link identification** | Links must be distinguishable from surrounding text by more than color alone | Underline or other visual treatment required |
| **Error states** | destructive (#c1253e) on card (#f7f8f8) = 5.3:1 (passes for normal text) | Error messages must not rely on color alone; include icon + text |

**Critical finding**: The border token (#b8c3c7) has insufficient contrast against the background (#e7ecee) at 1.3:1. Cards and form fields that rely solely on border for visual definition need supplementary contrast through box-shadow, fill color difference, or increased border weight. The card fill (#f7f8f8) against background (#e7ecee) is 1.1:1 -- also insufficient as a standalone differentiator. Cards MUST use shadow, border, or a combination to meet the 3:1 non-text contrast requirement.

### Interactive Elements

| Requirement | Implementation |
|------------|----------------|
| **Keyboard navigation** | All interactive elements reachable via Tab; logical tab order following visual layout |
| **Focus management** | Modal dialogs trap focus; closing returns focus to trigger element |
| **Button vs. link** | Buttons for actions (open modal, submit form); links for navigation (go to page) |
| **Form labels** | Every input has a visible `<label>` with `for` attribute matching input `id` |
| **Form errors** | Inline error messages associated with inputs via `aria-describedby`; error summary at form top announced with `aria-live="polite"` |
| **Required fields** | Indicated with both visual marker and `aria-required="true"` |
| **Hover states** | All hover effects must also apply on `:focus-visible` for keyboard users |
| **Touch targets** | Minimum 24x24px per WCAG 2.2 (target 44x44px per mobile best practice) |

### Dynamic Content

| Requirement | Implementation |
|------------|----------------|
| **Scroll animations** | All content visible without animation. Animation enhances but does not gate content. `prefers-reduced-motion` disables all scroll-triggered animation. |
| **Auto-playing content** | No auto-playing video or audio. Any looping animation must be pausable or complete within 5 seconds. |
| **Live regions** | Form submission status announced via `aria-live="polite"` region. No content changes without user initiation or announcement. |
| **Modals** | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to modal title. Focus trapped inside modal. Escape key closes. |

### Media and Images

| Requirement | Implementation |
|------------|----------------|
| **Alt text** | All informational images have descriptive alt text. Decorative images use `alt=""`. Product screenshots have alt text describing what the UI shows (e.g., "SafeTrekr analyst review dashboard showing 17-section checklist"). |
| **SVG accessibility** | Inline SVGs with `role="img"` and `aria-label` for meaningful graphics. Decorative SVGs use `aria-hidden="true"`. |
| **Video** | Any product demo video includes captions and transcript. |
| **Icons** | Icons used alongside text are `aria-hidden="true"`. Icons used alone have `aria-label`. |

### Testing Protocol

- **Automated**: axe-core integrated into CI via `@axe-core/playwright`, run on every page route
- **Manual**: Keyboard-only navigation test on every page before launch. Screen reader testing with VoiceOver (macOS) and NVDA (Windows) on homepage + solutions pages + pricing
- **Ongoing**: Lighthouse accessibility audit gated in CI at score >= 95

---

## Interaction Design

### Scroll Behavior

The visual brief defines "operational motion" -- motion that feels like systems activating, routes resolving, layers revealing. This translates to specific scroll interaction patterns:

**Scroll-Triggered Reveals**
- **Technique**: Intersection Observer-based fade-and-slide-up reveals
- **Timing**: 400-600ms duration, ease-out cubic-bezier(0.16, 1, 0.3, 1)
- **Stagger**: Multi-element groups reveal with 80-120ms stagger between items
- **Direction**: Content enters from below (upward slide, 24-40px translate)
- **Threshold**: Trigger at 15-20% element visibility
- **Constraint**: Elements are visible in DOM (opacity: 1, transform: none) if JavaScript fails or `prefers-reduced-motion` is active

**Hero Animation Sequence**
1. Page loads: headline and subhead visible immediately (no animation delay on above-fold content -- LCP critical)
2. 300ms after load: product composition fades in (200ms fade, 400ms total with subtle slide)
3. 600ms after load: within the product composition, route line begins tracing on the map panel (2000ms duration, eased)
4. 1200ms after load: status markers appear along the route (3 markers, 150ms stagger each)
5. 1800ms after load: review sidebar panel slides in from right (400ms)
6. Trust strip fades in below hero on first scroll intersection

**Section-Specific Motion**

| Section | Motion Pattern | Duration | Notes |
|---------|---------------|----------|-------|
| How It Works (3 steps) | Sequential timeline progression -- line draws between steps, each step card appears as line reaches it | 300ms per step, 150ms stagger | Line is the connective tissue |
| 17-Section Review | Cards appear in a staggered grid, grouped by category (Safety, Logistics, Documentation, Intelligence) | 100ms stagger per card | Grouped appearance reinforces organization |
| Intelligence Sources | Data flow line traces from source logos to central analysis point to binder output | 2000ms total | Simplified data pipeline visualization |
| Safety Binder | Document pages fan out or stack to reveal depth | 600ms | Document metaphor |
| Pricing Tiers | Cards slide up simultaneously | 400ms | No stagger -- pricing must feel equal and stable |
| Segment Cards | Cards layer in from bottom with slight z-depth stagger | 120ms stagger | Cards settling metaphor from visual brief |

### Hover States

Hover interactions should "reveal system intelligence" per the visual brief:

**Cards (Feature, Segment, Pricing)**
- Default: `card` fill (#f7f8f8), `border` outline (#b8c3c7), subtle shadow
- Hover: Slight elevation increase (shadow deepens), border shifts to `primary-400` (#6cbc8b), smooth 200ms transition
- Focus-visible: Same as hover + visible focus ring (`ring` #365462)

**Navigation Links**
- Default: `foreground` text (#061a23)
- Hover: `primary-600` text (#3f885b) with subtle underline reveal (200ms, left-to-right)
- Active page: `primary-500` (#4ca46e) with bottom border accent

**CTAs (Primary Button)**
- Default: `primary-500` fill (#4ca46e), white text
- Hover: `primary-600` fill (#3f885b), slight shadow increase, 150ms transition
- Active: `primary-700` fill (#33704b)
- Focus-visible: `primary-600` fill + 2px `ring` outline offset by 2px

**CTAs (Secondary Button / Ghost)**
- Default: transparent fill, `border` outline, `foreground` text
- Hover: `primary-50` fill (#f1f9f4), `primary-400` border, 200ms transition
- Focus-visible: Same as hover + ring

**Product UI Previews (Image/Composition)**
- Hover: Subtle parallax shift (2-4px translate in direction of cursor), slight scale (1.02), 300ms transition
- Purpose: Implies interactivity and depth without being gratuitous

### Micro-Interactions

**Form Field Focus**
- On focus: border transitions from `border` to `ring` color (200ms), subtle inner shadow appears
- Label floats above field or shifts color to `primary-600`

**Email Capture Success**
- Input field smoothly transitions to a checkmark icon with "Check your email" confirmation text
- Background briefly flashes `primary-50` (100ms)
- Announced via `aria-live="polite"` region

**Number Counter (Proof Strip)**
- "17 review sections" / "5 government sources" counters animate from 0 to target value when scrolled into view
- Duration: 1200ms, ease-out
- Only fires once per page load

**Navigation Scroll**
- Header background transitions from transparent (at top) to solid `card` fill with subtle bottom border as user scrolls past the hero
- Transition: 200ms ease
- CTA button in header appears at the same scroll threshold

---

## Trust Architecture

### Trust Signal Hierarchy

Trust must be layered throughout the site, not concentrated in a single "trust section." Each page zone contributes to cumulative credibility:

**Tier 1: Passive Credibility (Design Quality)**
- Premium typography, generous spacing, disciplined composition
- No stock photography cliches, no placeholder content, no broken links
- Mobile responsive, fast loading, accessible
- This tier is the most important. Institutional buyers will leave before reading a word if the design signals "startup template."

**Tier 2: Authority Anchors (Visible Everywhere)**
- Government data source logos (NOAA, USGS, CDC, ReliefWeb, GDACS) -- these are public institutions that lend authority by association
- Encryption standard badges (AES-256, SHA-256 hash chain)
- Compliance readiness indicators (FERPA-ready, SOC 2 pathway)
- Quantified proof strip ("17 review sections / 5 intel sources / 3-5 day delivery")

**Tier 3: Evidence (Product Sections)**
- Real UI screenshots (composed, not raw) showing the analyst review dashboard, risk scoring, evidence binder
- Sample binder preview (downloadable)
- Process transparency (the 3-step "How It Works" with detail expandable)
- Data source methodology (brief explanation of Monte Carlo scoring, accessible to non-technical readers)

**Tier 4: Social Proof (When Available)**

The current state has zero verified customers. The options, in order of preference:

1. **Best (available now)**: Remove ALL testimonials and replace with a product capability proof strip. "5 government data sources. 17 safety review sections. Hash-chain tamper-evident documentation. Delivered in 3-5 business days." This is honest and impressive.

2. **Better (near-term)**: Secure 2-3 beta customers or pilot programs and capture verifiable quotes with real names, titles, and organizations. Even a single quote from a real school administrator outweighs ten fabricated ones.

3. **Good (medium-term)**: Once customers exist, build a case study page with measurable outcomes ("SafeTrekr saved Westfield USD 40 hours per trip and produced documentation that satisfied their insurer's requirements").

4. **Unacceptable**: Any fabricated testimonial on a site that sells trust and safety documentation. This contradicts the core brand promise at a foundational level.

**Tier 5: Procurement Readiness (Dedicated Section)**
- W-9 download
- Certificate of Insurance
- Security questionnaire (pre-completed)
- Contract templates
- Volume pricing schedule
- Data processing agreement
- SOC 2 report (when available) or SOC 2 roadmap with timeline
- Compliance matrix (FERPA, COPPA, GDPR considerations)

### Trust Architecture by Page

| Page | Primary Trust Mechanism | Supporting Trust |
|------|------------------------|-----------------|
| **Homepage** | Design quality + government source logos + quantified proof strip | Product UI composition, "How It Works" transparency |
| **How It Works** | Process transparency (17-section detail) + intelligence methodology | Data source logos, sample binder preview |
| **Solutions (segment)** | Regulatory alignment (FERPA for K-12, Clery for higher ed) + segment-specific language | ROI context, pricing comparison |
| **Pricing** | Value anchoring (liability cost comparison, per-student framing) + no hidden fees | ROI calculator, procurement link |
| **Security/Compliance** | Technical security detail (encryption, hash chain, RLS) + compliance badges | Architecture diagram, data residency info |
| **Procurement** | Document completeness (W-9, certs, contracts ready) + professional presentation | Response time commitment, dedicated contact |
| **About** | Team credibility, company mission, domain expertise signals | Advisory board (if available), founding story |

---

## Page Inventory and Sitemap

### Recommended Sitemap

```
safetrekr.com/
|
|-- / (Homepage)
|   The primary landing page. Must accomplish full top-of-funnel conversion
|   for all segments within a single scroll journey.
|
|-- /how-it-works
|   Deep dive into the 3-step process: Submit -> Review -> Deliver.
|   Includes 17-section review breakdown, intelligence methodology,
|   sample binder preview.
|
|-- /solutions/
|   |-- /solutions/k12
|   |   K-12 schools: FERPA, field trip safety, parent communication,
|   |   board approval language, per-student pricing, school admin workflow.
|   |
|   |-- /solutions/higher-education
|   |   Universities: Clery Act, Title IX, study abroad, international
|   |   program safety, departmental autonomy, academic year pricing.
|   |
|   |-- /solutions/churches
|   |   Churches & missions: Mission trip safety, volunteer screening,
|   |   insurance requirements, denominational context, remote destinations,
|   |   budget framing against total trip cost.
|   |
|   |-- /solutions/corporate
|       Corporate & sports: Duty of care, corporate travel compliance,
|       multi-destination management, tournament travel, executive reporting.
|
|-- /pricing
|   Trip tier pricing with per-student breakdown, volume discounts,
|   annual plans, ROI calculator, value anchoring against liability costs.
|
|-- /security
|   Technical security posture: AES-256, SHA-256 hash chain, RLS,
|   encryption at rest/transit, SOC 2 roadmap, FERPA/COPPA considerations,
|   data residency, incident response.
|
|-- /procurement
|   Procurement resource center: W-9, COI, security questionnaire,
|   contract templates, volume pricing, data processing agreement.
|   Designed for procurement officers to self-serve all vendor evaluation docs.
|
|-- /about
|   Company story, mission, team, domain expertise, advisory board.
|   Category-creation narrative: why "professional trip safety review" exists.
|
|-- /contact
|   Contact form, phone, email, response time commitment.
|   Segment selector to route inquiries appropriately.
|
|-- /blog (Phase 2)
|   Content marketing: regulatory updates, safety best practices,
|   trip planning guides, compliance checklists. SEO value for
|   segment-specific long-tail keywords.
|
|-- /resources (Phase 2)
|   |-- /resources/sample-binder (gated)
|   |-- /resources/roi-calculator
|   |-- /resources/compliance-checklist
|   |-- /resources/webinars (future)
|
|-- /legal/
|   |-- /legal/privacy
|   |-- /legal/terms
|   |-- /legal/cookies
|
|-- /demo (landing page for "Request a Demo" CTA)
|   Dedicated demo request page with calendar embed or form.
|   Captures segment, organization size, trip volume for sales qualification.
```

### Page Priority Matrix

| Page | User Value | Business Value | Technical Complexity | Phase |
|------|-----------|---------------|---------------------|-------|
| **Homepage** | Entry point for all visitors | Primary conversion driver | High (hero composition, motion, responsive) | **1** |
| **How It Works** | Answers "what do I get?" | Builds trust, reduces demo friction | Medium (17-section visualization, binder preview) | **1** |
| **K-12 Solutions** | Beachhead segment landing | Highest near-term revenue potential | Medium (segment-specific content, FERPA framing) | **1** |
| **Pricing** | Enables budget decisions | Reduces quote-request friction | Medium (calculator, responsive tiers) | **1** |
| **Procurement** | Enables vendor evaluation | Shortens sales cycle | Low (document downloads, links) | **1** |
| **Security/Compliance** | Satisfies risk managers | Unblocks institutional approval | Low-medium (compliance matrix, architecture info) | **1** |
| **Demo Request** | Captures qualified leads | Primary conversion endpoint | Low (form + calendar embed) | **1** |
| **Contact** | Enables direct outreach | Supports all funnels | Low | **1** |
| **Higher Ed Solutions** | Second priority segment | Medium-term revenue | Medium | **1** |
| **Churches Solutions** | Third priority segment | Near-term beachhead potential | Medium | **1** |
| **Corporate Solutions** | Fourth priority segment | Longer sales cycle, higher ACV | Medium | **1** |
| **About** | Establishes company credibility | Supports trust building | Low | **1** |
| **Privacy/Terms/Cookies** | Legal compliance | Required | Low | **1** |
| **Blog** | SEO, thought leadership | Long-term traffic growth | Medium (CMS integration) | **2** |
| **Resources hub** | Lead generation, SEO | Lead capture, nurture | Medium | **2** |
| **Sample Binder landing** | Highest-converting lead magnet | Email capture | Low-medium | **1** (gated download, not full page) |

### Component Inventory

| Component | Used On | Description | Priority |
|-----------|---------|-------------|----------|
| **SiteHeader** | All pages | Logo, nav links, CTA button, mobile hamburger, scroll-aware transparency | P0 |
| **SiteFooter** | All pages | Link columns, compliance badges, contact info, legal links, newsletter signup | P0 |
| **HeroSection** | Homepage | Headline, subhead, 2 CTAs, product composition, trust strip | P0 |
| **HeroSectionSimple** | Interior pages | Page title, subtitle, optional breadcrumb | P0 |
| **ProductComposition** | Homepage hero | Composed UI visualization (map + review + binder panels) | P0 |
| **ProofStrip** | Homepage, footer | Quantified capability metrics in horizontal strip | P0 |
| **HowItWorksTimeline** | Homepage, How It Works | 3-step visual process with connecting line animation | P0 |
| **ReviewSectionGrid** | How It Works | 17-section review breakdown in categorized card grid | P1 |
| **IntelSourceBar** | Homepage, How It Works | Government data source logos with brief descriptions | P1 |
| **BinderPreview** | Homepage, How It Works, Solutions | Interactive sample binder preview with page fan/stack | P1 |
| **SegmentCard** | Homepage, Solutions index | Segment overview card with icon, headline, key features, link | P0 |
| **PricingTierCard** | Pricing | Trip tier card with price, features, per-student breakdown, CTA | P0 |
| **ROICalculator** | Pricing, Resources | Interactive calculator: inputs (trips/year, participants, segment) -> outputs (cost, savings vs. manual, cost per student) | P1 |
| **ProcurementDocGrid** | Procurement | Grid of downloadable documents with descriptions | P0 |
| **ComplianceBadgeRow** | Security, Footer, Procurement | Row of compliance/certification badges | P0 |
| **ContactForm** | Contact, Demo | Form with fields: name, email, org, segment, message. Validation + submission + confirmation | P0 |
| **DemoRequestForm** | Demo | Extended form: name, email, org, segment, org size, trips/year, preferred time | P0 |
| **LeadCaptureModal** | Triggered by "Sample Binder" CTA | Modal: segment selector + email + name + org -> delivers PDF | P1 |
| **TestimonialCard** | Homepage, Solutions (Phase 2) | Quote, attribution, org logo (real customers only) | P2 |
| **CTABand** | Homepage, interior pages | Full-width CTA section with headline + 1-2 buttons | P0 |
| **FeatureCard** | How It Works, Solutions | Icon + title + description card for feature communication | P0 |
| **StatsCounter** | Homepage | Animated number counter for proof metrics | P1 |
| **MobileNavOverlay** | All pages (mobile) | Full-screen mobile navigation with segment quick-links | P0 |
| **StickyHeaderCTA** | All pages (scroll) | Compact header CTA that appears on scroll past hero | P1 |
| **BreadcrumbNav** | Interior pages | Breadcrumb navigation for wayfinding | P1 |
| **SEOHead** | All pages | Dynamic meta tags, OG tags, JSON-LD structured data per page | P0 |
| **CookieConsent** | All pages | GDPR-compliant cookie consent banner | P0 |

---

## Opportunities and Gaps

### Opportunities

1. **Sample binder as the primary conversion mechanism.** No competitor offers a downloadable, audit-grade safety binder as a lead magnet. This artifact is the single most convincing sales tool SafeTrekr has because it shows exactly what the buyer receives. Building a beautiful, redacted sample binder and gating it with email capture creates a high-value, low-friction first interaction that also qualifies leads by segment.

2. **Government data source logos as trust anchors.** NOAA, USGS, CDC are universally recognized institutions. Their logos on the SafeTrekr site create an authority-by-association effect that no amount of marketing copy can match. This is free credibility that no competitor can claim (because no competitor uses these sources).

3. **Per-student pricing reframe destroys sticker shock.** "$450 per trip" sounds expensive to a school administrator. "$15 per student" sounds like a bargain. The same math, different framing. This is not a design problem -- it is a copy and calculation problem that the pricing page must solve prominently.

4. **Parent/guardian viral loop.** When parents experience the SafeTrekr guardian mobile view during their child's trip, they have a direct emotional motivation to recommend SafeTrekr to their school board or church leadership. The marketing site should include a "Recommend SafeTrekr to Your Organization" page or section that provides parents with a shareable brief to present to administrators.

5. **"Cost of Doing Nothing" narrative.** The most powerful conversion argument is not "look at our features" but "look at your risk." A school trip incident without documentation costs $50K-$2M in legal exposure. SafeTrekr costs $450. The pricing page needs a liability cost calculator alongside the ROI calculator.

6. **Procurement page as a competitive moat.** Most SaaS vendors make procurement painful. A procurement resource center with pre-completed security questionnaires, ready-to-download W-9s, and contract templates signals operational maturity and reduces the sales cycle by 2-4 weeks.

7. **Blog / content strategy for SEO dominance.** Long-tail keywords like "school field trip safety checklist," "church mission trip liability," "study abroad risk management" have low competition and high buyer intent. A content strategy producing 2-4 SEO-optimized articles per month would build organic traffic within 6 months.

### Gaps

1. **Zero verified social proof.** Until real customers exist, the site must rely entirely on product capability proof (quantified strips, government source logos, sample binder) and design credibility. Every testimonial section should be designed and coded now but populated only when real quotes are available. In the meantime, quantified proof strips must do the heavy lifting.

2. **No self-service signup path.** The marketing site drives all traffic to "Request a Demo" or "Request a Quote," both of which require human follow-up. This means conversion is capped by sales team capacity. The UX should be designed to accommodate a future self-service tier (a "Start Free Trial" or "Create Your First Trip" CTA position should be reserved in the header and hero for when self-service launches).

3. **Compliance claims need substantiation.** The site cannot claim "FERPA Compliant" or "SOC 2 Certified" without completed certifications. Language must be precise: "Designed with FERPA requirements in mind" or "SOC 2 Type II certification in progress" (with target date). Procurement officers will verify these claims.

4. **No video content.** A 60-second screen recording of the chaperone mobile app during an active trip (weather, rally points, live map, muster check-in) would communicate more value than any marketing page. The site architecture should include prominent video placement (hero area or How It Works) but this requires the mobile app recording asset to be produced.

5. **Integration story is thin.** Corporate buyers expect integrations (HR systems, expense tools, travel booking platforms). The current codebase has most integrations disabled. The marketing site should acknowledge the integration roadmap honestly rather than listing disabled features.

6. **No competitive comparison page.** Buyers comparing SafeTrekr against Chapperone, International SOS, or DIY spreadsheets need a clear comparison. A "Why SafeTrekr" or comparison page would directly address this. This is Phase 2 but should be designed into the IA now.

---

## Recommendations (Top 5)

### 1. Build the homepage as a complete conversion narrative, not a feature catalogue

The homepage must tell a story in 10 scrolls: Problem (your trips are unreviewed) -> Mechanism (analyst + intelligence) -> Evidence (17 sections, 5 sources) -> Outcome (audit-ready binder in 3-5 days) -> Proof (quantified strip) -> Segments (we serve your world) -> Pricing (it costs less than you think) -> CTA (see a sample binder).

Every section must earn the next scroll. The visual brief's "alternating between clean open sections and tighter information groupings" creates the rhythm. The operational motion vocabulary creates the continuity. The page should feel like a briefing that builds to a natural conclusion: "I need to see a sample of what they produce."

**Success metric**: 5-second recall test passes at >= 80% -- visitors shown only the above-fold content for 5 seconds can state what SafeTrekr does and why it is different.

### 2. Produce the redacted sample binder before the site launches

The sample binder is the marketing site's most important asset. It is the tangible proof of what $450 buys. It should be:
- Segment-specific (K-12 field trip version first, then higher ed, church, corporate)
- Professionally designed (this document IS the product, so it must be beautiful)
- Redacted appropriately (real structure, sample data, no real PII)
- Downloadable as PDF (gated with email capture)
- Previewed on the site in an interactive binder component

Without this artifact, the marketing site is asking institutional buyers to pay $450-$1,250 for something they have never seen. That is an unacceptable trust gap.

### 3. Design K-12 as the primary segment experience, then adapt for others

The product strategy identifies K-12 as the beachhead segment. The marketing site should reflect this priority:
- K-12 Solutions page gets the most content depth, the most regulatory specificity, and the most prominent navigation position
- Homepage language defaults to K-12 resonance ("field trips," "students," "parents") while remaining relevant to other segments
- Per-student pricing framing ($15/student) is featured prominently
- FERPA readiness is the first compliance badge
- The first sample binder is a K-12 field trip

Other segment pages should be complete and professional but do not need the same depth in Phase 1.

### 4. Replace all fabricated proof with quantified product capabilities

Remove every placeholder testimonial immediately. Replace with:
- "5 Government Intelligence Sources" with NOAA, USGS, CDC, ReliefWeb, GDACS logos
- "17 Safety Review Sections" with category breakdown
- "3-5 Business Day Delivery" with process transparency
- "SHA-256 Hash-Chain Evidence" with brief technical explanation
- "AES-256 Encryption at Rest and in Transit"

These are verifiable facts about the product. They build trust through specificity and transparency. A quantified proof strip with these five items, visible on every page, does more for credibility than ten fabricated testimonials.

### 5. Build the procurement center as a first-class page, not an afterthought

Institutional buyers evaluate vendors through procurement. A procurement officer who can self-serve all evaluation documents (W-9, COI, security questionnaire, contract templates, data processing agreement, compliance matrix) without waiting for a sales response will advance SafeTrekr through the approval pipeline faster.

The procurement page should:
- Be linked in the main navigation (not buried in footer)
- Be linked from every pricing-adjacent CTA ("Request a Quote" -> "For Procurement Officers, visit our Procurement Center")
- Include a "Procurement FAQ" addressing common questions (data residency, deletion policy, subprocessors, insurance coverage)
- Offer a direct contact for procurement inquiries with a response time commitment (e.g., "Procurement inquiries responded to within 1 business day")

---

## Dependencies and Constraints

### Content Dependencies

| Dependency | Blocking | Workaround |
|-----------|----------|------------|
| **Redacted sample binder** | Sample Binder CTA, lead capture, homepage binder preview | Build with realistic sample data from the existing 106 trips in the database |
| **Product UI screenshots** | Homepage hero composition, How It Works, Solutions pages | Capture from staging environment with sample data. Compose in design tool for marketing-quality framing. |
| **Mobile app recording** | Video demo placement | Defer video to Phase 1.5. Use static composed screenshots of mobile UI in the interim. |
| **Real customer testimonials** | Testimonial sections | Use quantified proof strips. Design testimonial components but leave unpopulated until real quotes exist. |
| **Compliance certifications** | Security page claims, procurement documents | Use precise language ("designed with FERPA in mind," "SOC 2 in progress"). Never claim uncertified compliance. |
| **Pricing confirmation** | Pricing page accuracy | Verify current pricing structure against codebase (T1 $450, T2 $750, T3 $1,250). Resolve discount inconsistency between pricing page and procurement page before launch. |

### Technical Dependencies

| Dependency | Impact | Notes |
|-----------|--------|-------|
| **Next.js 15+ with App Router** | Site architecture, routing, SSR/SSG | Recommended for SEO (static generation for marketing pages), image optimization, and React Server Components for performance |
| **CMS for blog (Phase 2)** | Blog and resources content management | Options: MDX files in repo (simplest), Contentlayer, or headless CMS (Sanity, Contentful). Defer decision to Phase 2. |
| **Form backend** | Contact form, demo request, lead capture | Options: Resend + React Email for email delivery, Supabase for lead storage, or a form service (Formspree, Basin). Must integrate with future CRM. |
| **Analytics** | Conversion tracking, user behavior | Plausible (privacy-first, no cookie consent needed for basic analytics) or PostHog (self-hosted option, session replay). Must track: page views, CTA clicks, form submissions, PDF downloads, scroll depth on homepage. |
| **Email automation** | Lead nurture after sample binder download | Resend, Loops, or Customer.io. Must support: welcome sequence, segment-specific content, demo booking nudge. |
| **PDF hosting** | Sample binder downloads | Vercel Blob, Cloudflare R2, or S3 with signed URLs for gated downloads. Track download counts. |

### Design Constraints

| Constraint | Impact | Guidance |
|-----------|--------|---------|
| **No real product data for screenshots** | Hero composition and product previews must use sample data | Generate realistic-looking screenshots from the existing app with seeded demo data. This is the single highest-priority design asset. |
| **No brand photography** | Cannot use proprietary location or team photos | Use composed UI screenshots as primary imagery. Supplement with subtle geographic abstractions (map surfaces, route lines). Avoid stock photography entirely for hero and feature sections. |
| **Logo assets exist** | Logo files available in SVG and PNG (horizontal, vertical, mark, wordmark) in both light and dark variants | Use horizontal logo in header, mark in favicon, wordmark where space is constrained |
| **Color system is defined** | Full token system documented in visual system guide | Implement as CSS custom properties. The neutral system (#e7ecee background, #f7f8f8 card, #061a23 foreground) does 80% of the work. Green is for identity; blue is for authority; status colors are rare. |
| **Typography not yet selected** | Visual brief calls for "modern sans with strong restraint and excellent spacing" | Recommend: Inter for body text (excellent readability, widely available, variable font). Evaluate: Instrument Sans, General Sans, or Satoshi for headlines (slightly more distinctive, still professional). Selection should happen during design phase with side-by-side comparison. |

### Timeline Constraints

| Constraint | Impact |
|-----------|--------|
| **Chapperone has App Store presence** | Time pressure on K-12 market entry. Marketing site should ship within 4-6 weeks. |
| **School budget cycles** | K-12 purchasing decisions for fall trips happen January-March. For spring trips, August-October. Current window (March 2026) aligns with fall trip planning -- every week of delay reduces the addressable buying window. |
| **No self-service signup** | Marketing site conversion is capped by sales capacity. Site should be designed to accommodate future self-service CTA (reserved header position, hero variant). |
| **Security remediation pending** | SOC 2 and FERPA claims on the security page must be carefully worded until certifications are obtained. Do not launch with unsubstantiated compliance claims. |

---

## Appendix A: Persona Sheets

### Persona 1: Sarah Chen -- K-12 District Safety Coordinator

| Dimension | Detail |
|-----------|--------|
| **Role** | Safety Coordinator, Westfield Unified School District |
| **Segment** | K-12 |
| **Age** | 42 |
| **Tech comfort** | Moderate -- uses Google Workspace daily, evaluates EdTech tools |
| **Goals** | Reduce personal liability exposure; standardize field trip safety across 23 schools in the district; satisfy board safety policy |
| **Frustrations** | Each school manages field trips differently; no standardized safety review process; teachers use Word docs and spreadsheets; insurance company is asking for better documentation |
| **Decision authority** | Recommends to superintendent, who approves budget with board |
| **Information needs** | FERPA compliance, per-student cost, what the binder contains, how it integrates with existing approval workflow |
| **Trust signals** | Government data sources, sample binder, FERPA readiness, peer district usage |
| **Conversion path** | Google search -> Homepage -> K-12 Solutions -> Downloads sample binder -> Shares with superintendent -> Requests demo -> Budget approval -> Pilot with 3 schools |

### Persona 2: James Washington -- University Risk Manager

| Dimension | Detail |
|-----------|--------|
| **Role** | Director of Risk Management, Regional State University |
| **Segment** | Higher Education |
| **Age** | 55 |
| **Tech comfort** | Low-moderate -- relies on staff for technical evaluation |
| **Goals** | Ensure Clery Act compliance for all university-sponsored travel; reduce insurance claims; protect institution from litigation |
| **Frustrations** | Study abroad programs operate independently; no centralized safety review; recent near-miss incident during a spring break service trip raised board concern |
| **Decision authority** | Budget authority up to $50K; above that, needs VP approval |
| **Information needs** | Clery Act compliance, evidence binder for legal defense, international trip coverage, integration with existing travel booking system |
| **Trust signals** | SOC 2 (or roadmap), peer university usage, hash-chain evidence explanation, security posture detail |
| **Conversion path** | Conference mention -> Homepage -> Higher Ed Solutions -> Security page -> Procurement center -> Requests demo -> Involves procurement officer -> RFP process -> Contract |

### Persona 3: Pastor Maria Rodriguez -- Church Mission Trip Coordinator

| Dimension | Detail |
|-----------|--------|
| **Role** | Associate Pastor / Mission Trip Lead, Grace Community Church |
| **Segment** | Churches |
| **Age** | 38 |
| **Tech comfort** | Moderate -- comfortable with apps, limited enterprise software experience |
| **Goals** | Ensure volunteer and youth safety on annual Guatemala mission trip; satisfy insurance company's new documentation requirement; protect church from liability |
| **Frustrations** | Insurance carrier now requires documented safety review for international trips; current process is a shared Google Doc with basic checklists; volunteers are anxious about remote location safety |
| **Decision authority** | Recommends to church board; board controls mission trip budget ($15K total) |
| **Information needs** | Cost relative to total trip budget (SafeTrekr at $1,250 is 8% of $15K budget), what volunteers and parents see, how it works in remote areas with limited connectivity, background check integration for volunteers |
| **Trust signals** | Denominational partnerships, offline capability, parent/guardian communication, insurance documentation |
| **Conversion path** | Insurance requirement -> Google search -> Homepage -> Churches Solutions -> Pricing (sees $1,250 is 8% of trip budget) -> Downloads sample binder -> Presents to board -> Requests demo -> Purchases for annual trip |

### Persona 4: David Park -- Corporate Travel Manager

| Dimension | Detail |
|-----------|--------|
| **Role** | Global Travel Manager, MidCap Manufacturing Inc. |
| **Segment** | Corporate |
| **Age** | 45 |
| **Tech comfort** | High -- manages SAP Concur, Certify, and BCD Travel integrations |
| **Goals** | Comply with ISO 31030 duty of care obligations; standardize safety review for all company travel; reduce company exposure in high-risk destinations |
| **Frustrations** | Current duty of care is a checkbox in the travel booking system; no actual safety analysis happens; after an employee incident in Brazil, legal is demanding better documentation |
| **Decision authority** | Can approve up to $25K; needs CFO approval for annual contracts |
| **Information needs** | Integration capabilities, comparison to International SOS pricing ($100K+/year), duty of care compliance documentation, enterprise reporting, SLA guarantees |
| **Trust signals** | Enterprise security posture, SOC 2, integration roadmap, multi-destination capability, dedicated account management |
| **Conversion path** | Legal mandate -> Google search -> Homepage -> Corporate Solutions -> Pricing (sees annual cost is fraction of International SOS) -> Security page -> Requests demo -> Involves procurement -> Contract negotiation |

---

## Appendix B: Content Strategy Notes

### SEO Keyword Targets by Segment

**K-12 (Primary)**
- "school field trip safety"
- "field trip risk assessment"
- "school trip compliance"
- "FERPA field trip"
- "school field trip liability"
- "field trip safety checklist"

**Higher Education**
- "study abroad risk management"
- "university travel safety"
- "Clery Act travel compliance"
- "higher ed duty of care"

**Churches**
- "mission trip safety planning"
- "church mission trip liability"
- "youth group travel safety"
- "mission trip insurance requirements"

**Corporate**
- "duty of care travel compliance"
- "corporate travel risk management"
- "ISO 31030 compliance"
- "business travel safety program"

### Headline Candidates (for A/B testing)

**Option A (Mechanism-forward)**
"Every Trip Reviewed by a Safety Analyst. Powered by Government Intelligence."

**Option B (Outcome-forward)**
"Your Audit-Ready Safety Binder. Delivered in 3-5 Days."

**Option C (Problem-forward)**
"Stop Managing Trip Safety with Spreadsheets."

**Option D (Emotional)**
"Because Every Student Deserves a Professionally Reviewed Trip."

**Recommendation**: Launch with Option A. It names the unique mechanism (human analyst) and the intelligence source (government data) in a single headline. Test Option D as a variant for K-12 traffic.

---

## Appendix C: Technical Architecture Recommendation

### Rendering Strategy

| Page Type | Strategy | Rationale |
|-----------|----------|-----------|
| Homepage | SSG (Static Site Generation) | Content changes infrequently; maximum performance; CDN-cacheable |
| Solutions pages | SSG | Segment content is relatively static |
| Pricing | SSG with client-side calculator | Pricing tiers are static; ROI calculator runs client-side |
| How It Works | SSG | Static content with client-side scroll animations |
| Blog (Phase 2) | ISR (Incremental Static Regeneration) | Content updates periodically; revalidate on publish |
| Contact/Demo | SSG with client-side form | Form submission is client-side to API route |

### Recommended Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Next.js 15 (App Router) | SSG, image optimization, route-based code splitting, React Server Components |
| **Styling** | Tailwind CSS 4 + CSS custom properties for design tokens | Utility-first for rapid development; custom properties for the defined color system |
| **Components** | Shadcn/ui as base + custom components | Accessible primitives (Dialog, Sheet, Accordion); customize to match visual system |
| **Animation** | Framer Motion | Declarative animation API; supports scroll-triggered reveals, stagger, layout animation; respects `prefers-reduced-motion` |
| **Icons** | Lucide React | Clean, consistent, MIT-licensed |
| **Forms** | React Hook Form + Zod | Validated, accessible forms with type safety |
| **Analytics** | Plausible or PostHog | Privacy-first analytics; no cookie consent banner needed for basic tracking |
| **Email** | Resend + React Email | Modern email delivery with JSX templates |
| **Hosting** | Vercel | Native Next.js support; edge CDN; analytics; preview deployments |
| **Images** | Next/Image with WebP/AVIF | Automatic optimization, responsive srcset, lazy loading |

---

*Generated by UX Discovery Analysis on 2026-03-24*
*Project: SafeTrekr Marketing Site (Greenfield)*
*Total pages recommended: 15 (Phase 1: 13, Phase 2: 2+)*
*Total components identified: 26*
*Estimated development timeline: 4-6 weeks (Phase 1)*
