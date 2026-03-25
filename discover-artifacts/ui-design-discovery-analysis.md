# SafeTrekr Marketing Site -- UI Design Discovery Analysis

**Date**: 2026-03-24
**Analyst**: UI Design Lead
**Direction**: Executive Trust, Light Theme
**Platform**: Next.js / React, Desktop-First Responsive

---

## Executive Summary

The visual direction is clearly articulated: **Stripe's polish + Linear's restraint + International SOS's seriousness**. Blend: 70% Polished Operational, 20% Editorial Intelligence, 10% Watchtower Light. A proprietary motif system ("Route, Review, Record, Readiness") makes the brand visually ownable.

Key tension: **operational seriousness** (safety platform) vs. **visual beauty** (compete with Stripe/Linear on craft).

---

## Key Findings

1. **Logo mark is a powerful design asset** -- shield with mountain peak and S-curve road encodes protection, journey, terrain awareness. Road curve should become a repeating design element.
2. **Color system well-structured** but needs strict application rules to avoid brand green/safety green collision.
3. **Typography must carry majority of brand authority** -- both briefs state type should do "a huge amount of the brand work."
4. **"Route, Review, Record, Readiness" motif system is the true differentiator** -- no competitor has a proprietary visual language.
5. **Motion is a first-class deliverable** -- "operational motion" requires specific specification.
6. **Page background #e7ecee is a critical differentiator** from typical SaaS white.
7. **Dark sections (#123646) need clear rhythm** -- never two in a row, reserved for high-trust moments.
8. **Product compositions are primary imagery** -- not photography.
9. **Responsive must preserve spatial generosity** at all viewports.
10. **Icon system must match restraint** -- minimal, consistent stroke weight, slightly squared geometry.

---

## 1. Typography System

| Role | Font | Rationale |
|------|------|-----------|
| **Display / Headlines** | **Plus Jakarta Sans** (700-800) | Geometric-humanist hybrid, executive and modern |
| **Body / UI Text** | **Inter** (400-500) | Benchmark web readability, pairs with Jakarta |
| **Mono / Data** | **JetBrains Mono** (400-500) | For risk scores, hash references, technical data |

### Type Scale

| Token | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| `display-xl` | 72px | 800 | 1.05 | -0.025em |
| `display-lg` | 56px | 700 | 1.1 | -0.02em |
| `display-md` | 44px | 700 | 1.15 | -0.015em |
| `heading-lg` | 36px | 700 | 1.2 | -0.01em |
| `heading-md` | 28px | 600 | 1.25 | -0.005em |
| `heading-sm` | 22px | 600 | 1.3 | 0 |
| `body-lg` | 20px | 400 | 1.6 | 0 |
| `body-md` | 16px | 400 | 1.6 | 0 |
| `body-sm` | 14px | 400 | 1.5 | 0.005em |
| `eyebrow` | 13px | 600 | 1.4 | 0.08em |

---

## 2. Spacing & Layout

- **4px base unit, 8-point grid**
- **Section vertical padding**: 96px-160px (desktop), 64px-96px (tablet), 48px-80px (mobile)
- **Card internal padding**: 24px-32px
- **12-column grid**, max-width 1280px for standard content, 1440px for full-bleed

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 4px | Chips, tags |
| `radius-md` | 8px | Buttons, inputs |
| `radius-lg` | 12px | Standard cards |
| `radius-xl` | 16px | Feature cards |
| `radius-2xl` | 20px | Large showcase |
| **No radius > 20px** except circles | | "Disciplined rectangles" per brief |

### Shadow System

Cool-toned shadows using rgba(6,26,35,x):
- `shadow-sm`: Cards (default)
- `shadow-md`: Elevated cards, dropdowns
- `shadow-lg`: Hero compositions
- `shadow-xl`: Showcase panels

---

## 3. Motif System -- "Route, Review, Record, Readiness"

### Route Intelligence
- Curved path lines from logo's S-curve, map fragments, waypoint markers, geofence outlines
- Color: `primary-500` paths, `primary-600` waypoints with `primary-100` halo
- Motion: Path lines draw in, waypoint dots appear with 80ms stagger

### Review Layer
- Checklists with completion indicators, approval badges, progress bars, analyst avatar
- Color: `primary-500` checkmarks on `primary-50` background
- Motion: Checklist items reveal top-to-bottom with 60ms stagger

### Record Layer
- Stacked document sheets, timeline strips, evidence row items, hash snippets
- Color: White documents on `card`, `muted-foreground` hash display
- Motion: Document sheets stack back-to-front with 120ms stagger

### Readiness
- Status indicator panels, readiness gauge, "all systems ready" bar
- Color: **Only component using safety colors** (green/yellow/red)
- Motion: Gauge fills clockwise over 1200ms, status dots pulse once

---

## 4. Color Application Rules

### Page Backgrounds
- Default: `background` #e7ecee
- Cards: `card` #f7f8f8
- Brand wash: `primary-50` #f1f9f4 (max 2 per page)
- Dark authority: `secondary` #123646
- Pure white: Document previews only

### Buttons
- **Primary**: `primary-500` bg, white text, hover `primary-600`
- **Secondary**: transparent, `border` outline, hover `primary-50`
- **Primary on dark**: white bg, `secondary` text

### Dark Surface Rules
- Headline: white or `card`
- Body: `#b8c3c7`
- Brand accent: `primary-400`
- Card surface: `rgba(255,255,255,0.06)`
- **Never two dark sections adjacent**

---

## 5. Animation & Motion -- "Operational Motion"

### Principles
1. Motion reveals information
2. Motion suggests systems activating
3. Motion is calm (no bounce, no wobble)
4. Motion is fast (200ms micro, 800ms max)
5. Motion enters once, does not loop

### Easing & Duration
- `ease-default`: cubic-bezier(0.4, 0, 0.2, 1)
- `ease-spring`: cubic-bezier(0.22, 1, 0.36, 1) for emphasis
- `duration-fast`: 150ms | `duration-normal`: 200ms | `duration-slow`: 500ms | `duration-slower`: 800ms

### Hero Animation Sequence (total ~1800ms)
1. 0ms: Headline fades up (500ms)
2. 150ms: Subtext fades up
3. 300ms: CTA buttons fade up
4. 400ms: Product composition assembles (map → side panel → document → route line → status dots)

---

## 6. Hero Visual Design

### Composition
- **Layer 1 - Map Intelligence**: Clean desaturated map, single route in `primary-500`, 3-4 waypoint markers
- **Layer 2 - Trip Review Panel**: Card with "Reviewed" badge, 3-4 checklist items, progress bar
- **Layer 3 - Document Preview**: Stacked paper effect, "Evidence Binder" header, timeline entries
- **Layer 4 - Readiness Indicator**: Circular gauge, "Trip Ready" label

### Background: Subtle gradient + faint geometric texture at 3-5% opacity

### Responsive
- **Desktop**: Side-by-side (text 5 cols, visual 7 cols)
- **Tablet**: Stacked, all four layers
- **Mobile**: Stacked, simplified to map fragment + route line only

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| base | 0-639px | Single column |
| sm | 640px | Minor adjustments |
| md | 768px | Two-column begins |
| lg | 1024px | Full grid |
| xl | 1280px | Max content width |
| 2xl | 1536px | Centered, generous margins |

### Typography Scaling
- `display-xl`: 72px → 52px → 40px
- `display-lg`: 56px → 44px → 34px
- Use `clamp()` for display sizes

---

## 8. Icons & Illustrations

- **Set**: Lucide (1.5px stroke, MIT licensed)
- **7 custom icons needed**: Shield/protection, Route/path, Evidence binder, Analyst review, Muster/rally, Monte Carlo/risk, Geofence
- **Product compositions** are primary imagery, not stock photography

---

## 9. Logo Usage

- **Header desktop**: Horizontal lockup (dark), 32-36px
- **Header mobile**: Horizontal lockup, min 28px; below that: mark only
- **Footer**: Horizontal lockup (light) on secondary bg
- **Favicon**: Mark only

---

## Component Inventory

### Atoms (P0)
Button, Badge/Chip, Eyebrow, Logo, StatusDot, Divider

### Molecules (P0-P1)
FeatureCard, StatCard, TestimonialCard, PricingTier, IndustryCard, MotifBadge, DocumentPreview, MapFragment, TimelineStep, InputField, NavLink, LogoCloud

### Organisms (P0-P1)
SiteHeader, HeroSection, FeatureShowcase, FeatureGrid, MotifSection, SocialProofStrip, CTABand, DarkAuthoritySection, ProcessTimeline, FAQSection, SiteFooter, DemoRequestForm

---

## Top 5 Recommendations

1. **Invest in 6 custom product compositions** before page layout (hero, route, review, binder, monitoring, risk)
2. **Build token system in Tailwind first** (colors, type, spacing, shadows, motion)
3. **Design SiteHeader + HeroSection first** as quality benchmarks
4. **Produce content brief before secondary pages** (copy length determines layout)
5. **Fix accessibility baseline**: `muted-foreground` (#616567) on `background` (#e7ecee) = ~4.0:1 contrast (fails AA 4.5:1); darken to ~#555a5d

---

## Timeline Estimate

| Phase | Duration |
|-------|----------|
| Token system + Tailwind config | 1-2 days |
| Core component library | 5-7 days |
| Product compositions (6) | 3-5 days (parallel) |
| Homepage build | 5-7 days |
| Secondary pages | 3-5 days each |
| Motion implementation | 3-4 days (parallel) |
| Responsive QA + a11y | 2-3 days |
| **Total** | **4-6 weeks** |

---

*Full transcript: /private/tmp/claude-501/-Users-justintabb-projects-safetrekr-marketing/10a0e079-fe63-4746-bffd-7e946d508819/tasks/ad5fa8494058d1691.output*
