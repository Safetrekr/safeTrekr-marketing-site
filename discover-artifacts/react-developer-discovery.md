# SafeTrekr Marketing Site -- React/Next.js Technical Discovery Analysis

**Date**: 2026-03-24
**Analyst**: React Developer
**Framework**: Next.js 15+ (App Router) with React 19, Tailwind CSS 4, Framer Motion, MapLibre GL JS

---

## Executive Summary

SafeTrekr requires a world-class marketing website that communicates "calm authority" and "institutional trust." The site should be 95%+ server-rendered with client interactivity isolated to three domains: the hero map composition (MapLibre GL JS, lazy-loaded), scroll-triggered animations (Framer Motion, tree-shaken), and form interactions (React Hook Form + Zod with Server Actions).

Critical architectural decisions:
1. **Static-first rendering** -- Every marketing page statically generated at build time. ISR only for blog/resources.
2. **Progressive enhancement** -- MapLibre (~300KB) and Framer Motion load only when needed, with static fallbacks.
3. **Token-driven design system** -- CSS custom properties via Tailwind CSS 4's `@theme` directive.
4. **Segment-first content architecture** -- Route groups organized around buyer personas.
5. **Performance-as-feature** -- Target 95+ Lighthouse across all categories.

Estimated build timeline: 6-8 weeks for v1 launch.

---

## Key Findings

### 1. Visual system is production-ready (60+ tokens, directly translatable to Tailwind CSS 4)
### 2. Map composition is highest-risk, highest-reward (MapLibre GL JS, lazy-loaded with static fallback)
### 3. "Operational motion" requires curated Framer Motion subset (~15KB tree-shaken)
### 4. Content demands segment-specific pages as first-class routes
### 5. Existing product has rich visual assets for marketing compositions
### 6. Server Actions for form handling (RHF + Zod + Resend)
### 7. SEO is mission-critical (generateMetadata, sitemap.ts, JSON-LD)
### 8. Logo assets are comprehensive (16 variants ready for all contexts)
### 9. Privacy-first analytics (Plausible over GA4 for K-12/church audience)
### 10. Performance budget tight but achievable (<150KB initial JS, LCP <1.5s)

---

## Project Architecture

```
safetrekr-marketing/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root: fonts, analytics, metadata
│   │   ├── page.tsx                # Homepage
│   │   ├── not-found.tsx, error.tsx, sitemap.ts, robots.ts
│   │   ├── (marketing)/           # Standard marketing pages
│   │   │   ├── layout.tsx         # Navbar + Footer
│   │   │   ├── how-it-works/pricing/about/contact/demo/
│   │   │   ├── solutions/         # Overview + K-12, Higher Ed, Churches, Corporate
│   │   │   ├── features/          # Overview + analyst-review, risk-intelligence, evidence-binder
│   │   │   └── legal/             # Privacy, terms
│   │   ├── (blog)/                # Blog layout with sidebar
│   │   │   ├── blog/[slug]/
│   │   │   └── resources/[slug]/
│   │   └── api/og/route.tsx       # Dynamic OG images
│   ├── components/
│   │   ├── ui/                    # shadcn/ui primitives
│   │   ├── layout/                # Navbar, Footer, Section, Container
│   │   ├── marketing/             # hero/, features/, social-proof/, pricing/, cta/, forms/
│   │   └── motion/                # ScrollReveal, StaggerChildren
│   ├── lib/                       # motion.ts, fonts.ts, metadata.ts, structured-data.ts, utils.ts
│   ├── content/                   # Typed content objects (v1), MDX blog
│   ├── actions/                   # Server Actions: contact, demo-request, newsletter, quote
│   ├── hooks/                     # use-scroll-spy, use-media-query, use-reduced-motion
│   └── styles/globals.css         # CSS custom properties + Tailwind
├── next.config.ts, tailwind.config.ts, components.json
```

---

## Component Architecture

```
Layer 0: Primitives (shadcn/ui) -- Button, Card, Input, Dialog, Tabs, etc.
Layer 1: Design System -- SafeTrekr tokens applied, variant system
Layer 2: Marketing Composites -- FeatureCard, TestimonialCard, PricingCard
Layer 3: Page Sections -- HeroHome, FeatureGrid, TrustStrip, CTABanner
Layer 4: Pages -- composed entirely from Layer 3 sections
```

shadcn/ui provides the right foundation: ~15 primitives needed (button, card, input, textarea, label, badge, separator, accordion, tabs, dialog, sheet, dropdown-menu, tooltip, navigation-menu, scroll-area).

---

## Styling Strategy

All 60+ tokens as CSS custom properties consumed by Tailwind CSS 4's `@theme inline`. Dark sections use CSS variable overrides on parent element -- child components adapt automatically.

Typography: Plus Jakarta Sans or Inter via `next/font/google`. Display: 64px/600, H1: 48px/600, Body: 16px/400.

---

## Animation System

Centralized motion preset library (`lib/motion.ts`):
- **Easing**: `default` (calm), `enter` (decelerating), `spring` (system activating)
- **Durations**: `fast` (0.2s), `normal` (0.4s), `slow` (0.6s), `reveal` (0.8s), `draw` (1.2s)
- **Variants**: fadeUp, fadeIn, staggerContainer, cardReveal, routeDraw, markerPop

Two wrapper components: **ScrollReveal** (scroll-triggered) and **StaggerChildren** (orchestrated reveals). All respect `prefers-reduced-motion`.

---

## Map Integration

MapLibre GL JS (BSD, no usage fees). Lazy-loaded with static fallback:
1. Server renders static map image (priority, no layout shift)
2. `next/dynamic` with `ssr: false` loads MapLibre after interactive
3. Interactive map crossfades over static fallback

Tile source: MapTiler free tier or Protomaps (self-hosted).

---

## Performance Strategy

| Page | Rendering | Rationale |
|------|-----------|-----------|
| All marketing | SSG | No user-specific content |
| Blog index | ISR (60s) | New posts via CMS/MDX |
| Blog posts | ISR (3600s) | Rarely change |

Budget: <150KB initial JS, LCP <1.5s, CLS <0.05, Lighthouse 95+.

---

## Content Management

- **Phase 1**: Static TypeScript content files. Zero CMS dependency.
- **Phase 2**: Sanity for blog + resources.
- **Phase 3**: Sanity for all page content (if needed).

---

## Feature Inventory

| Feature | Priority |
|---------|----------|
| Homepage (hero, features, trust, CTA) | P0 |
| How It Works (17-section visualization) | P0 |
| Pricing (interactive cards, ROI calc) | P0 |
| Solutions - K-12 (beachhead) | P0 |
| Contact / Demo (lead capture) | P0 |
| Navigation + Footer | P0 |
| SEO Infrastructure | P0 |
| Analytics (Plausible + Vercel) | P0 |
| Solutions - Higher Ed, Churches, Corporate | P1 |
| About (team credibility) | P1 |
| Feature pages (analyst review, risk intel) | P1 |
| Blog shell (MDX, ISR) | P2 |
| Resources hub (lead magnets) | P2 |

---

## Top 5 Recommendations

1. **Design system foundation first** (Weeks 1-2): Tailwind tokens, shadcn/ui, layout, motion presets
2. **Homepage as vertical slice** (Weeks 3-4): Validates entire architecture
3. **MapLibre with pre-rendered fallback**: Static image hero → interactive Phase 2
4. **Plausible + Vercel Analytics from day 1**: Baselines before first visitor
5. **K-12 Solutions page as first segment page**: Template for all segment pages

---

## Implementation Timeline

| Week | Focus |
|------|-------|
| 1 | Scaffolding + tokens + Tailwind config |
| 2 | Layout + motion + typography |
| 3 | Homepage (top half) |
| 4 | Homepage (bottom) + forms + Server Actions |
| 5 | K-12 Solutions + segment template |
| 6 | How It Works + Pricing |
| 7 | Remaining pages + blog |
| 8 | Polish + Lighthouse CI + a11y audit + launch |

---

*Full transcript: /private/tmp/claude-501/-Users-justintabb-projects-safetrekr-marketing/10a0e079-fe63-4746-bffd-7e946d508819/tasks/aa0c6826d4b65841b.output*
