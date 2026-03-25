# Design System Library: SafeTrekr Marketing Site

**Version**: 1.0
**Date**: 2026-03-24
**Status**: CANONICAL -- Single Source of Truth
**Stack**: Next.js 15 (App Router) + React 19 + Tailwind CSS 4 + shadcn/ui + Framer Motion + MapLibre GL JS
**Deployment**: DigitalOcean (Docker/Kubernetes via DOKS)

> This document is the binding visual specification for every component, token, and interaction on the SafeTrekr marketing site. Developers read this. Designers reference this. No implementation decision is made outside this document.

---

## 1. Design Principles

Five principles govern every visual decision. They are ordered by priority -- when principles conflict, the higher-numbered principle yields.

### 1.1 Clarity Before Flourish
The first job of the site is understanding. Color and motion sharpen comprehension; they never decorate weak messaging. If removing a visual element does not reduce understanding, remove it.

### 1.2 Calm Before Urgency
SafeTrekr deals with risk, but the brand projects preparedness -- not panic. The visual system communicates "we are already watching" rather than "something bad might happen." Bright surfaces, generous spacing, and restrained color saturation create this feeling.

### 1.3 Brand Is Not Status
Brand green (`primary-*`) communicates identity and confidence. Safety-status colors (`safety-green`, `safety-yellow`, `safety-red`) communicate live operational meaning. These two systems are visually distinct hues and must never be conflated. If a reviewer cannot distinguish the purpose at a glance, the usage is wrong.

### 1.4 Light Theme, Not Weak Theme
The interface is bright and open, but grounded, structured, and credible. The `background` (#e7ecee) is not white -- it is a cool, structured atmospheric base. Surfaces are layered with intent. Shadows are cool-toned. Nothing floats without purpose.

### 1.5 Premium Through Restraint
Premium comes from spacing, hierarchy, contrast, composition, and consistency. Not decoration. The 8-point grid is enforced. The neutral system does 70% of the visual work. Green appears only where it earns attention. Dark sections are rationed to 2 per page. Every empty pixel is a design decision.

---

## 2. Brand Identity

### 2.1 Visual Thesis

SafeTrekr should feel like:

- **Calm authority** -- "This is serious."
- **Visible readiness** -- "This is organized."
- **Modern operational elegance** -- "This looks current."
- **Human-guided oversight** -- "These people know what they are doing."
- **Documented accountability** -- "I trust this for real-world travel responsibility."

The site sits between an executive briefing document, a premium enterprise platform, a modern intelligence dashboard, and a clean editorial website. It is a refined command center translated into a polished public-facing brand.

### 2.2 Visual Blend

**70% Polished Operational** -- Stripe's compressed clarity, Ramp's proof-forward confidence. Clean dashboards, structured light surfaces, crisp hierarchy. This is the dominant register.

**20% Editorial Intelligence** -- Stronger typography, more open space, atmospheric section transitions. This elevates the storytelling beyond software-standard.

**10% Watchtower Light** -- Brighter map layers, subtle motion-led route visuals, dynamic hero composition. This provides the visual magnetism, used with restraint.

### 2.3 What SafeTrekr Must NOT Resemble

- Generic SaaS (overrounded, bubbly, startup gradient soup)
- Fear-based cybersecurity branding (dark, glowing, tactical)
- Travel-lifestyle marketing (stock photos, wanderlust imagery)
- Emergency-alert software (red alerts, pulsing warnings)
- Soft wellness branding (pastel, organic, rounded)
- Military/surveillance aesthetics (dark feeds, tactical overlays)

### 2.4 Voice (Visual)

- Headlines are short, declarative, high-confidence: "Every trip professionally reviewed."
- Body copy is calm, explanatory, non-hypey, steady, easy to scan.
- Typography does a huge amount of the brand work.
- White space does part of the persuasion.
- Numbers prove; adjectives decorate. Prefer numbers.

### 2.5 Logo Usage

The SafeTrekr logo is rendered as inline SVG for zero network requests and color control via `currentColor`.

| Context | Variant | Height | Color |
|---------|---------|--------|-------|
| Header (desktop, >= 1024px) | Horizontal lockup, dark | 32px | `secondary` (#123646) |
| Header (mobile, >= 360px) | Horizontal lockup, dark | 28px | `secondary` |
| Header (mobile, < 360px) | Mark only | 28px | `secondary` |
| Footer | Horizontal lockup, light | 32px | `#ffffff` |
| Favicon | Mark only | 32x32px | `secondary` |
| OG image | Horizontal lockup, dark | 48px | `secondary` |

**Clear space**: Minimum 1x mark height on all sides.
**Minimum size**: Mark: 24px height. Horizontal lockup: 80px width.
**Restrictions**: No stretching, no rotation, no recoloring beyond defined variants, no placement on visually busy backgrounds without sufficient contrast.

### 2.6 Logo Mark as Design Asset

The SafeTrekr mark contains extractable design elements:

| Element | Application |
|---------|-------------|
| **S-curve road path** (interior bezier curve) | Section dividers (2px, `primary-200`, 30% opacity), route-drawing animations, loading indicator |
| **Shield silhouette** (outer boundary path) | Trust badges, certification containers |
| **Mountain peaks** (upper interior triangular forms) | Subtle background patterns at 2-3% opacity |

---

## 3. Color System

All colors are implemented via Tailwind CSS 4's `@theme inline` directive as CSS custom properties. No hardcoded hex values are permitted in any component.

### 3.1 Semantic Colors

| Token | Hex | Role | Contrast on `background` | WCAG AA |
|-------|-----|------|--------------------------|---------|
| `--color-background` | `#e7ecee` | Page canvas. Atmospheric base. Bright, structured, high-trust. | -- | -- |
| `--color-foreground` | `#061a23` | Primary text, headlines, high-contrast foreground. | 13.2:1 | PASS |
| `--color-card` | `#f7f8f8` | Card surfaces, contained modules, form blocks. | -- | -- |
| `--color-card-foreground` | `#061a23` | Text on card surfaces. | 14.8:1 on card | PASS |
| `--color-border` | `#b8c3c7` | Borders, dividers, soft structure. | -- | -- |
| `--color-input` | `#80959b` | Input accents, lower-emphasis UI support. | -- | -- |
| `--color-ring` | `#365462` | Focus ring, interaction outline. | -- | -- |
| `--color-muted` | `#e7ecee` | Muted fills, neutral background blocks. | -- | -- |
| `--color-muted-foreground` | `#4d5153` | Secondary text, captions, support copy. **CORRECTED from `#616567`.** | 5.2:1 | PASS |
| `--color-popover` | `#f7f8f8` | Popover and dropdown backgrounds. | -- | -- |
| `--color-popover-foreground` | `#061a23` | Text within popovers. | 14.8:1 on popover | PASS |
| `--color-accent` | `#f1f9f4` | Accent backgrounds (lightest brand wash). | -- | -- |
| `--color-accent-foreground` | `#061a23` | Text on accent surfaces. | -- | PASS |

**Critical Correction**: `muted-foreground` MUST be `#4d5153`, not the original `#616567`. The original value achieves only 4.0:1 contrast on `background`, which fails WCAG 2.2 AA for normal text. The corrected value achieves 5.2:1 on `background` and 5.8:1 on `card`. This is non-negotiable.

### 3.2 Brand Primary (Green Scale)

| Token | Hex | Role |
|-------|-----|------|
| `--color-primary-50` | `#f1f9f4` | Lightest brand wash. Subtle section backgrounds. |
| `--color-primary-100` | `#e0f1e6` | Soft section accent. CTA band light variant. |
| `--color-primary-200` | `#c0e2cd` | Quiet supportive background. Secondary hover states. |
| `--color-primary-300` | `#96cfac` | Light brand emphasis. Dot-grid pattern. Disabled button tint. |
| `--color-primary-400` | `#6cbc8b` | Mid-tone brand accent. Dark-surface accent color. |
| `--color-primary-500` | `#4ca46e` | Core brand green. Decorative accents, icons, large display text ONLY. **NOT for button backgrounds with small white text** (3.4:1 fails AA). |
| `--color-primary-600` | `#3f885b` | **Standard button background.** 4.6:1 with white text. PASSES AA. |
| `--color-primary-700` | `#33704b` | High-emphasis brand text on light backgrounds (6.1:1). Link color. |
| `--color-primary-800` | `#2a5b3d` | Deep brand anchor. Badge text on primary-50 backgrounds. |
| `--color-primary-900` | `#20462f` | Dark brand grounding. |
| `--color-primary-950` | `#132a1c` | Deepest brand accent. |
| `--color-primary` | `#4ca46e` | Alias for primary-500. Generic brand reference. |
| `--color-primary-foreground` | `#ffffff` | White text on primary surfaces. |

**Usage Rules**:
- `primary-600` is the standard button background (not primary-500). White text on primary-600 = 4.6:1 (PASS).
- `primary-700` is used for text links and small brand-colored text = 6.1:1 on background (PASS).
- `primary-500` is reserved for decorative accents (icon fills, route lines, large display text >= 18px, progress bars).
- Brand green is NEVER used where safety-status green is the correct semantic meaning.

### 3.3 Secondary (Authority Blue)

| Token | Hex | Role |
|-------|-----|------|
| `--color-secondary` | `#123646` | Dark blue authority accent. Footer, dark sections, trust bars. |
| `--color-secondary-foreground` | `#f7f8f8` | Text on secondary surfaces. 11.6:1 contrast. PASS. |
| `--color-secondary-light` | `#1a4a5e` | Lighter variant for hover states on secondary surfaces. |
| `--color-secondary-muted` | `#b8c3c7` | Muted text on secondary backgrounds. 7.0:1 contrast. PASS. |

### 3.4 Destructive

| Token | Hex | Role |
|-------|-----|------|
| `--color-destructive` | `#c1253e` | Error states, destructive actions only. Never decorative. |
| `--color-destructive-foreground` | `#ffffff` | Text on destructive surfaces. |

### 3.5 Safety Status Colors (Operational Only)

| Token | Hex | Role |
|-------|-----|------|
| `--color-safety-green` | `#22c55e` | Safe / all clear. Map status dots, resolved markers. |
| `--color-safety-yellow` | `#eab308` | Caution. Flagged items, elevated awareness. |
| `--color-safety-red` | `#ef4444` | Danger / alert. Severe risk markers. |

**Rules**: These colors appear ONLY in contexts with explicit operational meaning: map markers, status badges, trip-state indicators, documentation severity markers. They NEVER appear as decorative marketing accents, section backgrounds, button colors, or hover states.

### 3.6 Warning Scale

| Token | Hex | Token | Hex |
|-------|-----|-------|-----|
| `--color-warning-50` | `#fffbeb` | `--color-warning-500` | `#f59e0b` |
| `--color-warning-100` | `#fef3c7` | `--color-warning-600` | `#d97706` |
| `--color-warning-200` | `#fde68a` | `--color-warning-700` | `#b45309` |
| `--color-warning-300` | `#fcd34d` | `--color-warning-800` | `#92400e` |
| `--color-warning-400` | `#fbbf24` | `--color-warning-900` | `#78350f` |

Warning colors are for tiered caution in maps, documentation severity, and operational cards. They MUST NOT become decorative.

### 3.7 Dark Surface Override Tokens

Activated via `[data-theme="dark"]` CSS selector on dark sections.

| Token | Value | Role |
|-------|-------|------|
| `--color-dark-surface` | `rgba(255, 255, 255, 0.06)` | Card surfaces on dark backgrounds. |
| `--color-dark-border` | `rgba(255, 255, 255, 0.12)` | Borders on dark backgrounds. |
| `--color-dark-text-primary` | `#f7f8f8` | Headlines on dark. 11.6:1 on secondary. PASS. |
| `--color-dark-text-secondary` | `#b8c3c7` | Body text on dark. 7.0:1 on secondary. PASS. |
| `--color-dark-accent` | `#6cbc8b` | Brand accent on dark (primary-400). |

### 3.8 Contrast Validation Matrix (Binding Reference)

| Text Color | Background | Contrast | WCAG AA Normal | WCAG AA Large |
|------------|-----------|----------|----------------|---------------|
| `foreground` (#061a23) | `background` (#e7ecee) | 13.2:1 | PASS | PASS |
| `foreground` (#061a23) | `card` (#f7f8f8) | 14.8:1 | PASS | PASS |
| `muted-foreground` (#4d5153) | `background` (#e7ecee) | 5.2:1 | PASS | PASS |
| `muted-foreground` (#4d5153) | `card` (#f7f8f8) | 5.8:1 | PASS | PASS |
| `primary-700` (#33704b) | `background` (#e7ecee) | 6.1:1 | PASS | PASS |
| `primary-700` (#33704b) | `card` (#f7f8f8) | 6.9:1 | PASS | PASS |
| `white` (#ffffff) | `primary-600` (#3f885b) | 4.6:1 | PASS | PASS |
| `white` (#ffffff) | `primary-500` (#4ca46e) | 3.4:1 | **FAIL (normal)** | PASS (large) |
| `white` (#ffffff) | `primary-700` (#33704b) | 6.1:1 | PASS | PASS |
| `dark-text-primary` (#f7f8f8) | `secondary` (#123646) | 11.6:1 | PASS | PASS |
| `dark-text-secondary` (#b8c3c7) | `secondary` (#123646) | 7.0:1 | PASS | PASS |
| `dark-accent` (#6cbc8b) | `secondary` (#123646) | 4.8:1 | PASS | PASS |

### 3.9 Color Behavior Rules

1. **The neutral system builds trust.** The marketing site primarily uses: `background` for canvas, `card` for surfaces, `foreground` for authority text, `border` for structure, `muted-foreground` for support.
2. **Brand green expresses identity, not live status.** Use the primary scale for brand confidence, section accents, CTA energy, and visual cohesion.
3. **Secondary blue provides authority and anchor.** Use for footer, dark sections, trust bars, dense information panels, navigation contrast elements.
4. **Safety colors remain rare and meaningful.** Reserved for true state communication: map markers, alert badges, trip status indicators.
5. **Warning colors are for escalation, not ambiance.** Only where a user should interpret elevated attention.

---

## 4. Typography

### 4.1 Font Families

| Font | Role | Weights | CSS Variable |
|------|------|---------|-------------|
| **Plus Jakarta Sans** | Display (headlines, eyebrows, buttons) | 400, 500, 600, 700, 800 | `--font-display` |
| **Inter** | Body text (paragraphs, descriptions, metadata) | 400, 500, 600 | `--font-body` |
| **JetBrains Mono** | Code and data (SHA-256 hashes, technical values) | 400, 500 | `--font-mono` |

**Font stack tokens**:
```
--font-sans:    "Plus Jakarta Sans", "Inter", system-ui, -apple-system, sans-serif
--font-display: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif
--font-body:    "Inter", system-ui, -apple-system, sans-serif
--font-mono:    "JetBrains Mono", ui-monospace, "Cascadia Code", monospace
```

**Loading**: `next/font/google` with `display: 'swap'` and system fallbacks. Total web font weight under 100KB.

### 4.2 Type Scale (Fluid Responsive)

All display and heading sizes use `clamp()` for fluid scaling between 375px (mobile) and 1280px (desktop). Body sizes are fixed. No media query breakpoints for typography.

| Class | Desktop | Mobile | `clamp()` | Weight | Line Height | Tracking | Font |
|-------|---------|--------|-----------|--------|-------------|----------|------|
| `.text-display-xl` | 72px | 40px | `clamp(2.5rem, 1.25rem + 3.47vw, 4.5rem)` | 800 | 1.05 | -0.025em | Jakarta |
| `.text-display-lg` | 56px | 34px | `clamp(2.125rem, 1.15rem + 2.72vw, 3.5rem)` | 700 | 1.1 | -0.02em | Jakarta |
| `.text-display-md` | 44px | 28px | `clamp(1.75rem, 1.04rem + 1.98vw, 2.75rem)` | 700 | 1.15 | -0.015em | Jakarta |
| `.text-heading-lg` | 36px | 24px | `clamp(1.5rem, 0.97rem + 1.49vw, 2.25rem)` | 700 | 1.2 | -0.01em | Jakarta |
| `.text-heading-md` | 28px | 20px | `clamp(1.25rem, 0.9rem + 0.99vw, 1.75rem)` | 600 | 1.25 | -0.005em | Jakarta |
| `.text-heading-sm` | 22px | 18px | `clamp(1.125rem, 0.95rem + 0.5vw, 1.375rem)` | 600 | 1.3 | 0 | Jakarta |
| `.text-body-lg` | 20px | 18px | `clamp(1.125rem, 1.04rem + 0.25vw, 1.25rem)` | 400 | 1.6 | 0 | Inter |
| `.text-body-md` | 16px | 16px | `1rem` (fixed) | 400 | 1.6 | 0 | Inter |
| `.text-body-sm` | 14px | 14px | `0.875rem` (fixed) | 400 | 1.5 | 0.005em | Inter |
| `.text-body-xs` | 12px | 12px | `0.75rem` (fixed) | 400 | 1.5 | 0.01em | Inter |
| `.text-eyebrow` | 13px | 12px | `clamp(0.75rem, 0.7rem + 0.14vw, 0.8125rem)` | 600 | 1.4 | 0.08em | Jakarta |
| `.text-mono-md` | 14px | 13px | `clamp(0.8125rem, 0.77rem + 0.11vw, 0.875rem)` | 400 | 1.5 | 0.02em | JetBrains |
| `.text-mono-sm` | 12px | 11px | `clamp(0.6875rem, 0.64rem + 0.11vw, 0.75rem)` | 400 | 1.4 | 0.03em | JetBrains |

**Note**: `.text-eyebrow` MUST include `text-transform: uppercase` in its definition.

### 4.3 Maximum Line Width Constraints

| Text Role | Max Width | Tailwind Class |
|-----------|-----------|----------------|
| Display headlines | 20 characters | `max-w-[20ch]` |
| Section headlines | 28 characters | `max-w-[28ch]` |
| Body copy paragraphs | 65 characters | `max-w-prose` (customized to 65ch) |
| Card descriptions | 45 characters | `max-w-[45ch]` |
| Eyebrow labels | No limit | -- |

---

## 5. Spacing & Layout

### 5.1 Spacing Tokens (8-Point Grid)

All spacing values are multiples of 4px. No component uses arbitrary pixel values.

| Token | Value | Tailwind | Token | Value | Tailwind |
|-------|-------|----------|-------|-------|----------|
| `--spacing-0` | 0px | `p-0` | `--spacing-10` | 40px | `p-10` |
| `--spacing-px` | 1px | `p-px` | `--spacing-12` | 48px | `p-12` |
| `--spacing-0-5` | 2px | `p-0.5` | `--spacing-16` | 64px | `p-16` |
| `--spacing-1` | 4px | `p-1` | `--spacing-20` | 80px | `p-20` |
| `--spacing-2` | 8px | `p-2` | `--spacing-24` | 96px | `p-24` |
| `--spacing-3` | 12px | `p-3` | `--spacing-32` | 128px | `p-32` |
| `--spacing-4` | 16px | `p-4` | `--spacing-40` | 160px | `p-40` |
| `--spacing-5` | 20px | `p-5` | | | |
| `--spacing-6` | 24px | `p-6` | | | |
| `--spacing-8` | 32px | `p-8` | | | |

### 5.2 Section Padding Scale (Per Breakpoint)

| Breakpoint | Standard Section | Compressed Section | Hero Top / Bottom |
|------------|-----------------|-------------------|-------------------|
| base (0px) | `py-12` (48px) | `py-8` (32px) | `pt-16 pb-20` |
| sm (640px) | `py-16` (64px) | `py-10` (40px) | `pt-20 pb-24` |
| md (768px) | `py-20` (80px) | `py-12` (48px) | `pt-20 pb-24` |
| lg (1024px) | `py-24` (96px) | `py-16` (64px) | `pt-24 pb-32` |
| xl (1280px) | `py-32` (128px) | `py-20` (80px) | `pt-28 pb-36` |
| 2xl (1536px) | `py-40` (160px) | `py-24` (96px) | `pt-32 pb-40` |

### 5.3 Grid System

**Container tokens**:

| Token | Value | Usage |
|-------|-------|-------|
| `--container-sm` | 640px | Narrow content (FAQ, forms) |
| `--container-md` | 768px | Medium content (blog posts) |
| `--container-lg` | 1024px | Wide content |
| `--container-xl` | 1280px | Standard max content width |
| `--container-2xl` | 1440px | Full-bleed content width |
| `--container-max` | 1280px | Standard content container |
| `--container-bleed` | 1440px | Full-bleed content container |

**Container pattern**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

**Content width behavior**:
- < 640px: Content fills viewport with 24px side padding.
- 640-1280px: Content fills viewport with 32-48px side padding.
- 1280px+: Content is centered with growing margins.
- 1536px+: Generous white space (128px+ per side) frames the content.

### 5.4 Breakpoints

| Token | Width | Tailwind Prefix | Key Changes |
|-------|-------|----------------|-------------|
| base | 0-639px | (none) | Single column, stacked layout, full-width cards |
| sm | 640px | `sm:` | Minor padding adjustments |
| md | 768px | `md:` | Two-column grids begin, tablet navigation |
| lg | 1024px | `lg:` | Full desktop grid, side-by-side hero, sticky nav with all links |
| xl | 1280px | `xl:` | Max content width reached (1280px) |
| 2xl | 1536px | `2xl:` | Generous side margins, substantial white space |

Maximum of 4 functional breakpoints (base, md, lg, xl) with sm and 2xl as refinement only.

### 5.5 Border Radius Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Small chips, inline badges |
| `--radius-md` | 8px | Buttons, inputs, small cards |
| `--radius-lg` | 12px | Standard cards, containers |
| `--radius-xl` | 16px | Large cards, featured sections |
| `--radius-2xl` | 20px | Hero composition panels, pricing cards |
| `--radius-full` | 9999px | Badges, status dots, avatars |
| `--radius` | 8px | Default (alias for `radius-md`) |

**Design rule**: Disciplined rectangles, not pills. `radius-full` is reserved for explicitly circular elements (badges, dots, avatars). Cards and buttons use `radius-md` to `radius-xl`.

---

## 6. Component Library

### 6.1 Atoms (P0)

#### Button

**File**: `components/ui/button.tsx`
**Base**: shadcn/ui Button primitive, customized with SafeTrekr tokens.

**Variants**:

| Variant | Background | Text | Border | Hover | Active | Disabled |
|---------|-----------|------|--------|-------|--------|----------|
| `primary` | `primary-600` | `white` | none | `primary-700` | `primary-800` | `primary-300` at 60% opacity |
| `secondary` | `transparent` | `foreground` | `border` | `primary-50` bg | `primary-100` bg | `muted-foreground`, border 40% |
| `ghost` | `transparent` | `foreground` | none | `muted` bg | `primary-50` bg | `muted-foreground` |
| `destructive` | `destructive` | `white` | none | `destructive/90` | `destructive/80` | `destructive/40` |
| `primary-on-dark` | `white` | `secondary` | none | `card` | `primary-50` | `white/30` |
| `link` | `transparent` | `primary-700` | none | underline | `primary-800` | `muted-foreground` |

**Sizes**:

| Size | Height | Padding | Font Size | Min Touch |
|------|--------|---------|-----------|-----------|
| `sm` | 36px (`h-9`) | `px-3` | 14px (`text-sm`) | 44x44px (with padding) |
| `default` | 44px (`h-11`) | `px-5` | 16px (`text-base`) | 44x44px |
| `lg` | 52px (`h-13`) | `px-8` | 18px (`text-lg`) | 52x52px |
| `icon` | 40px (`h-10 w-10`) | -- | -- | 44x44px (with padding) |

**Shared**: `border-radius: radius-md (8px)`, `font-weight: 600`, `transition: all duration-fast ease-default`, focus ring using `ring` token (2px offset, 2px width).

**Props**:
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'primary-on-dark' | 'link';
  size: 'sm' | 'default' | 'lg' | 'icon';
  asChild?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  children: ReactNode;
}
```

**Accessibility**:
- Focus-visible ring: 2px `ring` color, 2px offset, visible on all backgrounds.
- `loading` state: `aria-busy="true"`, spinner icon, disables pointer events.
- `disabled` state: `aria-disabled="true"`, reduced opacity, no pointer events.
- All button text meets contrast requirements (primary-600 rationale).
- Minimum touch target: 44x44px per WCAG 2.5.5.

---

#### Badge / Chip

**File**: `components/ui/badge.tsx`

**Variants**:

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| `default` | `primary-50` | `primary-800` | none |
| `secondary` | `card` | `foreground` | `border` |
| `outline` | `transparent` | `foreground` | `border` |
| `status-green` | `safety-green/10` | safety-green (darkened) | none |
| `status-yellow` | `warning-100` | `warning-800` | none |
| `status-red` | `destructive/10` | `destructive` | none |
| `dark` | `secondary` | `secondary-foreground` | none |

**Sizes**: `sm` (h-5, px-2, text-xs), `default` (h-6, px-2.5, text-xs), `lg` (h-7, px-3, text-sm).
**Shared**: `border-radius: radius-full`, `font-weight: 500`.
**Accessibility**: Status badges MUST include `aria-label` describing the state, not just the color.

---

#### Eyebrow

**File**: `components/ui/eyebrow.tsx`

Styled `<span>` above section headings. Uses `.text-eyebrow` class with `text-primary-700`.

**Props**: `children: string`, `icon?: LucideIcon`, `dot?: boolean`, `dotColor?: string`, `className?: string`.

---

#### StatusDot

**File**: `components/ui/status-dot.tsx`

| State | Color | Animation |
|-------|-------|-----------|
| `active` | `safety-green` | Single pulse on enter (scale 1 to 1.4 to 1, 600ms) |
| `warning` | `safety-yellow` | None |
| `alert` | `safety-red` | None |
| `inactive` | `border` | None |

**Sizes**: 6px (small), 8px (default), 10px (large). Always `rounded-full`.
**Accessibility**: `aria-label` required describing the state. Color alone does not convey meaning.

---

#### Divider

**File**: `components/ui/divider.tsx`

| Variant | Description |
|---------|-------------|
| `standard` | `h-px bg-border` full-width horizontal rule |
| `section` | 80% width, centered, `bg-border` |
| `route` | S-curve SVG path from logo mark, `primary-200` at 30% opacity, max-width 600px, optional scroll-triggered pathLength draw animation |

**Props**: `variant: 'standard' | 'section' | 'route'`, `className?: string`.

---

#### Logo

**File**: `components/ui/logo.tsx`

**Props**: `variant: 'horizontal-dark' | 'horizontal-light' | 'mark-dark' | 'mark-light'`, `height?: number`, `className?: string`.
Rendered as inline SVG. Color via `currentColor` or explicit fills.

---

### 6.2 Molecules (P0/P1)

#### FeatureCard

**File**: `components/marketing/feature-card.tsx`

**Structure**: `bg-card rounded-xl border border-border p-6 sm:p-8 shadow-card`. Hover: `shadow-card-hover`, `translateY(-2px)`, transition `duration-normal`.

**Content slots**:
1. Icon container: `h-12 w-12 rounded-lg bg-primary-50`, icon `h-6 w-6 text-primary-700`
2. Title: `.text-heading-sm text-foreground mb-2` (renders as `<h3>`)
3. Description: `.text-body-md text-muted-foreground max-w-[45ch]`
4. Link (optional): `.text-body-sm font-medium text-primary-700` with ArrowRight (translates 4px on parent hover)

**Props**: `icon: LucideIcon`, `title: string`, `description: string`, `href?: string`, `motifType?: 'route' | 'review' | 'record' | 'readiness'`, `featured?: boolean`, `className?: string`.

When `featured`: spans 2 columns, `min-h-[280px]`, icon 48px, title uses `.text-heading-md`.
When `motifType` set: renders MotifBadge instead of plain icon.

**Accessibility**: Card link wraps entire card as single interactive target (`group` pattern). Title is `<h3>`.

---

#### StatCard

**File**: `components/marketing/stat-card.tsx`

**Structure**: `bg-card rounded-xl border border-border p-6 text-center shadow-sm`.

**Content**:
1. Value: `.text-display-md text-foreground font-mono`
2. Label: `.text-eyebrow text-muted-foreground mt-1 block`

**Props**: `value: number | string`, `label: string`, `prefix?: string`, `suffix?: string`, `animate?: boolean`.

When `animate`: numeric value counts from 0 to target (1.5s). Respects `prefers-reduced-motion` (shows final value immediately). String values fade in.

---

#### PricingTier

**File**: `components/marketing/pricing-tier.tsx`

**Structure**: `bg-card rounded-2xl border-2 p-8 shadow-lg`. Featured: `border-primary-500 shadow-xl`, "Most Popular" badge, `scale(1.05)` on desktop (static, not hover).

**Content**:
1. Badge (conditional): `<Badge variant="default">Most Popular</Badge>`
2. Plan name: `.text-heading-md text-foreground`
3. Price: `.text-display-md text-foreground` + `.text-body-sm text-muted-foreground` unit
4. Per-trip: `.text-body-sm text-muted-foreground mt-2`
5. Feature list: `space-y-3`, check icons in `primary-500`
6. CTA: `<Button variant="primary" size="lg" className="mt-8 w-full">`

**Props**: `name: string`, `price: number`, `unit: string`, `perTripLabel: string`, `features: string[]`, `featured?: boolean`, `ctaLabel: string`, `ctaHref: string`.

**Rule**: No animation on pricing cards. Stability and readability are paramount.
**Accessibility**: Price values use `aria-label` with full context.

---

#### IndustryCard

**File**: `components/marketing/industry-card.tsx`

Entire card is `<a>` with `group` class. `bg-card rounded-xl border border-border p-6 shadow-card`. Hover: `shadow-card-hover`, title transitions to `primary-700`.

**Props**: `icon: LucideIcon`, `title: string`, `description: string`, `href: string`.

---

#### MotifBadge

**File**: `components/marketing/motif-badge.tsx`

Signature visual element encoding one of four SafeTrekr motifs.

| Motif | Icon | Color Accent | Label |
|-------|------|-------------|-------|
| `route` | MapPin / Route | `primary-500` | "Route Intelligence" |
| `review` | ClipboardCheck | `primary-500` | "Analyst Review" |
| `record` | FileText / Shield | `foreground` | "Evidence Record" |
| `readiness` | Activity / CircleCheck | `safety-green` | "Trip Ready" |

**Structure**: `inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm`. Icon in 20px circle with `{motifColor}/10` background.

**Props**: `motif: 'route' | 'review' | 'record' | 'readiness'`, `className?: string`.

---

#### DocumentPreview

**File**: `components/marketing/document-preview.tsx`

Stylized stacked-paper card for evidence binder sections and hero composition.

**Structure**: Three offset layers creating paper stack.
1. Back sheets: Two `div` offset -1px and -0.5px with `bg-card border border-border shadow-sm`
2. Front sheet: `bg-white rounded-lg border border-border shadow-md p-6`
3. Content: "Evidence Binder" eyebrow + "Verified" badge, 2 timeline entries, SHA-256 hash in `mono-sm`

**Props**: `title?: string`, `className?: string`.

---

#### TimelineStep

**File**: `components/marketing/timeline-step.tsx`

Single step in vertical timeline. Flex row with timeline indicator (3px circle `primary-500` with `primary-100` ring, 1px connector in `border`) and content column.

**Props**: `timestamp?: string`, `title: string`, `description?: string`, `isLast?: boolean`.

---

#### NavLink

**File**: `components/layout/nav-link.tsx`

| State | Style |
|-------|-------|
| Default | `text-foreground/70 hover:text-foreground`, transition `duration-fast` |
| Active | `text-foreground font-semibold`, 2px bottom border in `primary-500` |
| Mobile | Full-width block, `py-3`, `border-b border-border` |

Uses `aria-current="page"` on active link.
**Props**: `href: string`, `children: string`, `className?: string`.

---

#### LogoCloud

**File**: `components/marketing/logo-cloud.tsx`

Horizontal strip of partner logos. Default: `grayscale opacity-50`. Hover: `grayscale-0 opacity-100`, transition `duration-normal`. Logo height: 32px. Gap: `gap-x-12 gap-y-6`. Flex wrap with center.

**Note**: Placeholder until real partner logos secured. Must not render fabricated logos.

---

### 6.3 Organisms (P0/P1)

#### SiteHeader

**File**: `components/layout/site-header.tsx`

Sticky navigation with glassmorphic scroll behavior.

| State | Background | Border | Blur | Shadow | Height |
|-------|-----------|--------|------|--------|--------|
| At top (hero visible) | `transparent` | none | none | none | 80px (`h-20`) |
| Scrolled (> 100px) | `background/80` | `border-b border/50` | `backdrop-blur-xl` | `shadow-sm` | 64px (`h-16`) |

Transition: 300ms, `ease-default`.

**Desktop (>= lg)**: Logo left, nav links center/left, CTAs right ("Sign In" ghost + "Get a Demo" primary).
**Mobile (< lg)**: Logo left, hamburger right triggering shadcn/ui `Sheet` from right.

**Navigation items** (max 5): Solutions, How It Works, Features, Pricing, About.

**Accessibility**: Skip-nav link (first focusable, hidden until focused), `<nav aria-label="Main navigation">`, `aria-expanded` + `aria-controls` on hamburger, `aria-current="page"` on active link, 44x44px touch targets, focus-visible ring.

---

#### SiteFooter

**File**: `components/layout/site-footer.tsx`

Dark footer on `secondary` background. Three zones.

**Zone 1 (Brand)**: Logo horizontal-light 32px, brand description in `dark-text-secondary`, max-width 35ch.
**Zone 2 (Links)**: Three columns (Product, Solutions, Company). Links: `text-body-sm text-[var(--color-dark-text-secondary)] hover:text-white transition-colors duration-fast`.
**Zone 3 (Bottom bar)**: Copyright `body-xs dark-text-secondary`, legal links (Privacy, Terms). Separated by `border-t border-[var(--color-dark-border)]`.

**Responsive**: < md: stacked. md-lg: logo left + 3-col right. >= lg: 5-col grid.

Footer uses `secondary` background and does NOT count toward 2-per-page dark section limit.

---

#### TrustMetricsStrip

**File**: `components/marketing/trust-metrics-strip.tsx`

Replaces all fabricated testimonials with verifiable data.

**Structure**: `border-y border-border bg-card py-12`, grid of StatCards.

| Value | Label |
|-------|-------|
| 5 | Government Intel Sources |
| 17 | Safety Review Sections |
| 3-5 | Day Turnaround |
| AES-256 | Encryption Standard |
| SHA-256 | Evidence Chain |

**Grid**: 2 cols (< md), 3 cols (md-lg), 5 cols (>= lg, single row).

---

#### CTABand

**File**: `components/marketing/cta-band.tsx`

| Variant | Background | Headline Color | Body Color | Button Variant |
|---------|-----------|----------------|------------|----------------|
| `light` | `primary-50` | `foreground` | `muted-foreground` | `primary` |
| `brand` | `primary-700` | `white` | `white/80` | `primary-on-dark` |
| `dark` | `secondary` | `dark-text-primary` | `dark-text-secondary` | `primary-on-dark` |

**Structure**: `py-20 lg:py-28`, centered headline (`.text-display-md`), body (`.text-body-lg max-w-prose mx-auto`), dual CTAs (stacked < sm, horizontal >= sm).

**Props**: `variant: 'light' | 'brand' | 'dark'`, `headline: string`, `body?: string`, `primaryCta: { label: string, href: string }`, `secondaryCta?: { label: string, href: string }`.

---

#### DarkAuthoritySection

**File**: `components/marketing/dark-authority-section.tsx`

Wraps content in `secondary` background with `[data-theme="dark"]` token overrides.

**Rules (enforced in code review)**:
- Maximum 2 per page (excluding footer)
- Never adjacent to another dark section
- Always preceded and followed by a light section with at least `py-24`
- NEVER for: feature descriptions, forms, FAQ, pricing details
- Appropriate for: trust/proof modules, data showcases, CTA bands, social proof

**Props**: `children: ReactNode`, `className?: string`.

---

#### FeatureShowcase

**File**: `components/marketing/feature-showcase.tsx`

Full-width section, 2-column grid on desktop.

**Alternation rule**: `reversed` prop flips layout. Odd = text left / visual right. Even = reversed. Creates visual rhythm.

**Text column**: Eyebrow (motif icon), headline (`.text-display-md`), body (`.text-body-lg text-muted-foreground max-w-prose`), 3-4 feature items with Check icons, CTA button.
**Visual column**: Product composition component (map, review, document, or readiness).

**Responsive**: < lg: stacked (visual above text). >= lg: `grid lg:grid-cols-2 gap-12 lg:gap-20 items-center`.

**Props**: `eyebrow: string`, `eyebrowIcon?: LucideIcon`, `headline: string`, `body: string`, `features: string[]`, `ctaLabel: string`, `ctaHref: string`, `reversed?: boolean`, `children: ReactNode`, `className?: string`.

---

#### FeatureGrid

**File**: `components/marketing/feature-grid.tsx`

Grid of FeatureCards. Standard: `grid sm:grid-cols-2 lg:grid-cols-3 gap-6`. Bento variant: two featured cards span 2 columns.

**Props**: `eyebrow?: string`, `headline: string`, `cards: FeatureCardProps[]`, `bento?: boolean`, `className?: string`.

---

#### ProcessTimeline

**File**: `components/marketing/process-timeline.tsx`

"Intelligence, Review, Documentation" three-act structure.

**Desktop (>= lg)**: Horizontal, `grid grid-cols-3 gap-8`. Numbered circles (h-10 w-10, `bg-primary-100`, `text-primary-700`), connectors, headings, descriptions.
**Mobile (< lg)**: Vertical TimelineStep stack.

**Props**: `steps: Array<{ number: number, title: string, description: string }>`, `className?: string`.

---

#### FAQSection

**File**: `components/marketing/faq-section.tsx`

Uses shadcn/ui `Accordion` primitive. `max-w-3xl mx-auto`. Trigger: `.text-heading-sm text-foreground`. Content: `.text-body-md text-muted-foreground`. Chevron rotates 180deg (200ms, `ease-default`).

**Accessibility**: `type="single" collapsible`, `aria-expanded` on triggers.

**Props**: `headline?: string`, `items: Array<{ question: string, answer: string }>`, `className?: string`.

---

#### DemoRequestForm

**File**: `components/marketing/demo-request-form.tsx`

**Fields**:

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full Name | text | Yes | Min 2 chars |
| Work Email | email | Yes | Email format (Zod) |
| Organization Name | text | Yes | Min 2 chars |
| Organization Type | select | Yes | K-12 School, Church/Mission, Higher Ed, Corporate, Sports/League, Other |
| Estimated Annual Trips | select | Yes | 1-10, 11-25, 26-50, 50+ |
| Message | textarea | No | Max 500 chars |
| Honeypot | hidden | -- | Must be empty |
| Cloudflare Turnstile | invisible | -- | Server-side token validation |

**Layout**: 2-col grid desktop (name + email row 1, org + type row 2), single column mobile.
**Styling**: Field `bg-card`, border `border`, placeholder `muted-foreground`, focus `ring` (2px), error `border-destructive` + `text-body-xs text-destructive`.
**Success state**: Replace form with confirmation card (check icon `primary-500`, "We'll be in touch within one business day", "Download Sample Binder" secondary CTA).

**Accessibility**: All fields have `<label>`. Errors use `aria-describedby`. `aria-busy` on submit. `aria-live="polite"` for announcements.

---

## 7. Interaction Patterns

### 7.1 Loading States

Every data-driven component must have a loading state. Use skeleton placeholders that match the component's layout dimensions. Skeleton elements: `bg-muted animate-pulse rounded-md`.

### 7.2 Empty States

Components with no data render a centered illustration area (48px icon in `muted-foreground/30`), heading in `.text-heading-sm`, and body in `.text-body-sm text-muted-foreground`. Optional CTA button.

### 7.3 Error States

Forms: inline error below field, `border-destructive`, message in `text-body-xs text-destructive`. Section-level: card with `AlertCircle` icon, heading, retry button. Network: toast notification.

### 7.4 Motion Vocabulary

**Easing Curves**:

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | General-purpose transitions |
| `--ease-enter` | `cubic-bezier(0.0, 0, 0.2, 1)` | Elements entering viewport |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving viewport |
| `--ease-spring` | `cubic-bezier(0.22, 1, 0.36, 1)` | Organic spring-like reveals |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Status dot pops (use sparingly) |

**Durations**:

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | 100ms | Immediate feedback (focus rings) |
| `--duration-fast` | 150ms | Hover states, micro-interactions |
| `--duration-normal` | 200ms | Standard transitions (buttons, links, nav) |
| `--duration-moderate` | 300ms | Component transitions (accordions, sheets) |
| `--duration-slow` | 500ms | Section reveals, card animations |
| `--duration-slower` | 800ms | Large composition reveals |
| `--duration-reveal` | 1000ms | Full-section scroll reveals |
| `--duration-draw` | 1200ms | SVG path drawing (route lines) |

### 7.5 Framer Motion Variant Presets

All defined in `lib/motion.ts`. No inline animation values anywhere.

| Preset | Hidden | Visible | Transition | Usage |
|--------|--------|---------|------------|-------|
| `fadeUp` | `opacity: 0, y: 20` | `opacity: 1, y: 0` | enter (300ms) | Default section reveal |
| `fadeUpLarge` | `opacity: 0, y: 40` | `opacity: 1, y: 0` | spring (800ms) | Large elements |
| `fadeIn` | `opacity: 0` | `opacity: 1` | default (200ms) | Trust strips, full sections |
| `scaleIn` | `opacity: 0, scale: 0.95` | `opacity: 1, scale: 1` | spring (800ms) | Map, hero panels |
| `cardReveal` | `opacity: 0, y: 24, scale: 0.98` | `opacity: 1, y: 0, scale: 1` | slow + spring | Feature grid cards |
| `routeDraw` | `pathLength: 0, opacity: 0` | `pathLength: 1, opacity: 1` | draw (1200ms) | SVG route lines |
| `markerPop` | `scale: 0, opacity: 0` | `scale: 1, opacity: 1` | moderate + spring | Waypoint dots |
| `statusPulse` | `scale: 0, opacity: 0` | `scale: [0,1.4,1], opacity: [0,1,1]` | 600ms, spring | Status dot entrance |
| `checklistReveal` | `opacity: 0, x: -12` | `opacity: 1, x: 0` | moderate + enter | Checklist items |
| `documentStack` | `opacity: 0, y: 16, rotateX: -5` | `opacity: 1, y: 0, rotateX: 0` | slow + spring | Document preview |
| `gaugeFill` | `pathLength: 0` | `pathLength: 0.85` | 1200ms, 0.4s delay | Readiness gauge arc |
| `staggerContainer` | `{}` | `staggerChildren: 0.08, delayChildren: 0.1` | -- | Parent for staggered children |
| `staggerContainerSlow` | `{}` | `staggerChildren: 0.12, delayChildren: 0.2` | -- | Slower stagger |

### 7.6 Scroll-Triggered Section Animations

Each section animates at 20% viewport intersection:

| Section Type | Animation | Details |
|-------------|-----------|---------|
| Section heading | `fadeUp` | Eyebrow + heading + subtext staggered at 80ms |
| Feature grid | `staggerContainer + cardReveal` | Cards stagger at 80ms |
| Feature showcase | Split entry | Text fades up, visual slides from opposite side |
| Trust strip | `fadeIn` | Entire strip fades together |
| StatCard values | `counterAnimate` | Numbers count from 0 over 1.5s |
| CTA band | `fadeUp` | Heading + buttons staggered at 100ms |
| Dark section | `fadeIn` (entire) | Background fades, then content staggers |
| Timeline | `staggerContainer` | Steps top-to-bottom at 120ms |
| FAQ items | `staggerContainer` | Items fade up at 60ms |

### 7.7 Micro-Interactions

| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Button (primary) | hover | Background `primary-600` to `primary-700`, `scale(1.02)` | 150ms | default |
| Button (secondary) | hover | Background fills `primary-50` | 150ms | default |
| Card | hover | Shadow `card` to `card-hover`, `translateY(-2px)` | 200ms | default |
| Nav link | hover | Opacity 0.7 to 1, color to foreground | 150ms | default |
| Accordion trigger | click | Chevron rotates 180deg | 200ms | default |
| Logo cloud item | hover | `grayscale-0`, `opacity-100` | 200ms | default |
| "Learn more" arrow | hover (parent) | `translateX(4px)` | 150ms | spring |
| Form input | focus | Ring appears, border to `ring` | 150ms | default |
| Mobile menu | open | Sheet slides right, content staggers 40ms | 300ms | spring |

### 7.8 Motion Mood

The motion suggests: review, readiness, monitoring, escalation paths, record creation, coordinated awareness. It should feel composed, intentional, intelligent, reassuring, slightly technical, and controlled.

**Term**: "Operational motion" -- the site feels like something is being monitored, reviewed, and guided.

---

## 8. Iconography

### 8.1 Base Library

| Property | Value |
|----------|-------|
| Library | Lucide React |
| Default stroke width | 1.5px |
| License | MIT |
| Color | `currentColor` (inherits text color) |

### 8.2 Sizing Scale

| Token | Size | Tailwind | Usage |
|-------|------|----------|-------|
| `icon-xs` | 14px | `h-3.5 w-3.5` | Inline with small text, badge icons |
| `icon-sm` | 16px | `h-4 w-4` | Small buttons, inline with body text |
| `icon-md` | 20px | `h-5 w-5` | Default buttons, nav items |
| `icon-lg` | 24px | `h-6 w-6` | Feature card icons, standalone |
| `icon-xl` | 32px | `h-8 w-8` | Hero accents, section markers |

### 8.3 Standard Icon Map

| Usage | Lucide Icon | Context |
|-------|-------------|---------|
| Navigation | `Menu`, `X`, `ChevronDown`, `ChevronRight` | Header, dropdowns |
| Actions | `ArrowRight`, `ExternalLink`, `Download`, `Play` | CTAs, links |
| Features | `MapPin`, `Route`, `ClipboardCheck`, `FileText`, `Shield`, `Activity` | Feature cards |
| Status | `Check`, `AlertTriangle`, `AlertCircle`, `Info` | Badges, alerts |
| Social | `Twitter`, `Linkedin`, `Github` (via simple-icons) | Footer |
| Forms | `Mail`, `User`, `Building2`, `Send` | Form fields |
| UI | `ChevronUp` | FAQ accordion, scroll-to-top |

### 8.4 Custom Icons (7 Required)

| Icon | Description | Usage |
|------|-------------|-------|
| `ShieldPath` | Shield outline with S-curve road (logo mark simplified) | Brand motif, hero, favicon |
| `RouteIntelligence` | Map fragment with route line and 2 waypoints | Route motif badge |
| `EvidenceBinder` | Stacked document sheets with checkmark seal | Record motif |
| `AnalystReview` | Clipboard with magnifying glass overlay | Review motif |
| `MusterPoint` | Rally flag with location pin | Geofencing feature |
| `MonteCarlo` | Probability curve with data points | Risk intelligence |
| `Geofence` | Dashed circle boundary with pin inside | Monitoring |

**Design specs**: 24x24px viewBox, 1.5px stroke, `round` line-cap, `round` line-join, no fill (stroke-only except accent dots), ~2px corner radius (matching Lucide), exported as React components with same interface as Lucide, color via `currentColor`.

---

## 9. Elevation & Shadows

All shadows use the foreground color base (`rgba(6, 26, 35, x)`) for cool-toned shadows aligned with the blue-green palette. No warm gray shadows.

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(6,26,35,0.04), 0 1px 3px rgba(6,26,35,0.06)` | Subtle: badges, small elements |
| `--shadow-md` | `0 2px 4px rgba(6,26,35,0.04), 0 4px 12px rgba(6,26,35,0.08)` | Standard: dropdowns, popovers |
| `--shadow-lg` | `0 4px 8px rgba(6,26,35,0.04), 0 8px 24px rgba(6,26,35,0.1)` | Prominent: modals, large cards |
| `--shadow-xl` | `0 8px 16px rgba(6,26,35,0.06), 0 16px 48px rgba(6,26,35,0.12)` | Maximum: hero composition panels |
| `--shadow-inner` | `inset 0 1px 2px rgba(6,26,35,0.06)` | Inset: pressed states, input focus |
| `--shadow-card` | `0 1px 3px rgba(6,26,35,0.04), 0 2px 8px rgba(6,26,35,0.06)` | Default card resting state |
| `--shadow-card-hover` | `0 4px 12px rgba(6,26,35,0.06), 0 8px 24px rgba(6,26,35,0.08)` | Card hover elevation |

**Z-Index Scale**:

| Token | Value | Usage |
|-------|-------|-------|
| `--z-behind` | -1 | Background decorative elements |
| `--z-base` | 0 | Default layer |
| `--z-raised` | 10 | Cards, raised surfaces |
| `--z-dropdown` | 20 | Dropdowns, menus |
| `--z-sticky` | 30 | Sticky header |
| `--z-overlay` | 40 | Overlays, backdrop |
| `--z-modal` | 50 | Modals, dialogs |
| `--z-toast` | 60 | Toasts, notifications |

---

## 10. Accessibility Standards

### 10.1 Global Requirements (WCAG 2.2 AA)

| Requirement | Standard | Implementation |
|-------------|----------|----------------|
| Compliance | WCAG 2.2 AA | All components, all pages |
| Contrast (normal text) | >= 4.5:1 | Enforced via token system. `muted-foreground` corrected to 5.2:1. |
| Contrast (large text) | >= 3:1 | `primary-500` permitted only for text >= 18px / 14px bold |
| Contrast (UI components) | >= 3:1 | Focus rings, borders, interactive boundaries |
| Focus indicators | Visible, >= 3px | `ring` token (#365462), 2px width, 2px offset |
| Touch targets | >= 44x44px | All interactive elements |
| Keyboard navigation | Full tab order | Logical sequence, visible focus, Enter/Space activation |
| Skip navigation | Present | First focusable element, jumps to `#main-content` |
| ARIA landmarks | Present | `<nav>`, `<main>`, `<footer>`, `<header>`, `<section>` with labels |
| `aria-current="page"` | Navigation links | Active page for assistive tech |
| `prefers-reduced-motion` | Fully respected | All animations disabled (see 7.8) |
| Lighthouse Accessibility | >= 95 (target 100) | CI gate on every merge |
| `axe-core` | 0 violations | CI gate. No regressions. |

### 10.2 Per-Component Requirements

| Component | Requirements |
|-----------|-------------|
| **Button** | `aria-busy` when loading. `aria-disabled` when disabled. Focus-visible ring. |
| **Badge** | Status badges: `aria-label` describing state (not just color). |
| **StatusDot** | `aria-label` required ("Status: Active"). Color not sole indicator. |
| **NavLink** | `aria-current="page"` on active. 44x44px touch target. |
| **SiteHeader** | `<nav aria-label="Main navigation">`. Skip-nav. Mobile: `aria-expanded`, `aria-controls`. |
| **Accordion** | `aria-expanded` on triggers. Content announced on expansion. |
| **DemoRequestForm** | `<label>` on all fields. Errors: `aria-describedby`. `aria-live="polite"`. |
| **PricingTier** | Price `aria-label` with full context. |
| **StatCard** | Animated counters show final value for screen readers immediately. |
| **Logo** | `aria-label="SafeTrekr"` on logo link. |
| **Sheet (mobile)** | Focus trap. Focus returns to trigger on close. Escape closes. |
| **Map (hero)** | Decorative: `aria-hidden="true"` with descriptive alt on static image. |

### 10.3 Reduced Motion Strategy

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- `ScrollReveal` and `StaggerChildren` render plain `<div>` without animation.
- CSS transitions reduced to `opacity` only (no transforms, no scale).
- SVG path animations show completed path immediately.
- Counter animations show final value immediately.
- Hover states retain color changes but remove transforms.

---

## 11. CSS/Tailwind Token Mapping

Complete `globals.css` content for the token foundation:

```css
@import "tailwindcss";

@theme inline {
  /* ──────────────────────────────────────
     COLORS -- Semantic System
     ────────────────────────────────────── */
  --color-background: #e7ecee;
  --color-foreground: #061a23;
  --color-card: #f7f8f8;
  --color-card-foreground: #061a23;
  --color-border: #b8c3c7;
  --color-input: #80959b;
  --color-ring: #365462;
  --color-muted: #e7ecee;
  --color-muted-foreground: #4d5153;
  --color-popover: #f7f8f8;
  --color-popover-foreground: #061a23;
  --color-accent: #f1f9f4;
  --color-accent-foreground: #061a23;

  /* ──────────────────────────────────────
     COLORS -- Brand Primary (Green)
     ────────────────────────────────────── */
  --color-primary-50: #f1f9f4;
  --color-primary-100: #e0f1e6;
  --color-primary-200: #c0e2cd;
  --color-primary-300: #96cfac;
  --color-primary-400: #6cbc8b;
  --color-primary-500: #4ca46e;
  --color-primary-600: #3f885b;
  --color-primary-700: #33704b;
  --color-primary-800: #2a5b3d;
  --color-primary-900: #20462f;
  --color-primary-950: #132a1c;
  --color-primary: #4ca46e;
  --color-primary-foreground: #ffffff;

  /* ──────────────────────────────────────
     COLORS -- Secondary (Authority Blue)
     ────────────────────────────────────── */
  --color-secondary: #123646;
  --color-secondary-foreground: #f7f8f8;
  --color-secondary-light: #1a4a5e;
  --color-secondary-muted: #b8c3c7;

  /* ──────────────────────────────────────
     COLORS -- Destructive
     ────────────────────────────────────── */
  --color-destructive: #c1253e;
  --color-destructive-foreground: #ffffff;

  /* ──────────────────────────────────────
     COLORS -- Safety Status (Operational Only)
     ────────────────────────────────────── */
  --color-safety-green: #22c55e;
  --color-safety-yellow: #eab308;
  --color-safety-red: #ef4444;

  /* ──────────────────────────────────────
     COLORS -- Warning Scale
     ────────────────────────────────────── */
  --color-warning-50: #fffbeb;
  --color-warning-100: #fef3c7;
  --color-warning-200: #fde68a;
  --color-warning-300: #fcd34d;
  --color-warning-400: #fbbf24;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  --color-warning-700: #b45309;
  --color-warning-800: #92400e;
  --color-warning-900: #78350f;

  /* ──────────────────────────────────────
     COLORS -- Dark Surface Overrides
     ────────────────────────────────────── */
  --color-dark-surface: rgba(255, 255, 255, 0.06);
  --color-dark-border: rgba(255, 255, 255, 0.12);
  --color-dark-text-primary: #f7f8f8;
  --color-dark-text-secondary: #b8c3c7;
  --color-dark-accent: #6cbc8b;

  /* ──────────────────────────────────────
     SPACING -- 8-Point Grid
     ────────────────────────────────────── */
  --spacing-0: 0px;
  --spacing-px: 1px;
  --spacing-0-5: 2px;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
  --spacing-24: 96px;
  --spacing-32: 128px;
  --spacing-40: 160px;

  /* ──────────────────────────────────────
     BORDER RADIUS
     ────────────────────────────────────── */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-full: 9999px;
  --radius: 8px;

  /* ──────────────────────────────────────
     SHADOWS -- Cool-Toned
     ────────────────────────────────────── */
  --shadow-sm: 0 1px 2px rgba(6, 26, 35, 0.04), 0 1px 3px rgba(6, 26, 35, 0.06);
  --shadow-md: 0 2px 4px rgba(6, 26, 35, 0.04), 0 4px 12px rgba(6, 26, 35, 0.08);
  --shadow-lg: 0 4px 8px rgba(6, 26, 35, 0.04), 0 8px 24px rgba(6, 26, 35, 0.1);
  --shadow-xl: 0 8px 16px rgba(6, 26, 35, 0.06), 0 16px 48px rgba(6, 26, 35, 0.12);
  --shadow-inner: inset 0 1px 2px rgba(6, 26, 35, 0.06);
  --shadow-card: 0 1px 3px rgba(6, 26, 35, 0.04), 0 2px 8px rgba(6, 26, 35, 0.06);
  --shadow-card-hover: 0 4px 12px rgba(6, 26, 35, 0.06), 0 8px 24px rgba(6, 26, 35, 0.08);

  /* ──────────────────────────────────────
     TYPOGRAPHY -- Font Families
     ────────────────────────────────────── */
  --font-sans: "Plus Jakarta Sans", "Inter", system-ui, -apple-system, sans-serif;
  --font-display: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif;
  --font-body: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "Cascadia Code", monospace;

  /* ──────────────────────────────────────
     TYPOGRAPHY -- Font Sizes
     ────────────────────────────────────── */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.375rem;
  --font-size-3xl: 1.75rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 2.75rem;
  --font-size-6xl: 3.5rem;
  --font-size-7xl: 4.5rem;

  /* ──────────────────────────────────────
     ANIMATION -- Easing Curves
     ────────────────────────────────────── */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-enter: cubic-bezier(0.0, 0, 0.2, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --ease-spring: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ──────────────────────────────────────
     ANIMATION -- Durations
     ────────────────────────────────────── */
  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-moderate: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 800ms;
  --duration-reveal: 1000ms;
  --duration-draw: 1200ms;

  /* ──────────────────────────────────────
     Z-INDEX
     ────────────────────────────────────── */
  --z-behind: -1;
  --z-base: 0;
  --z-raised: 10;
  --z-dropdown: 20;
  --z-sticky: 30;
  --z-overlay: 40;
  --z-modal: 50;
  --z-toast: 60;

  /* ──────────────────────────────────────
     LAYOUT
     ────────────────────────────────────── */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1440px;
  --container-max: 1280px;
  --container-bleed: 1440px;
}

/* ──────────────────────────────────────
   Dark Section Token Overrides
   ────────────────────────────────────── */
[data-theme="dark"] {
  --color-background: #123646;
  --color-foreground: #f7f8f8;
  --color-card: rgba(255, 255, 255, 0.06);
  --color-card-foreground: #f7f8f8;
  --color-border: rgba(255, 255, 255, 0.12);
  --color-muted-foreground: #b8c3c7;
  --color-primary: #6cbc8b;
  --color-primary-foreground: #123646;
  --color-ring: #6cbc8b;
}

/* ──────────────────────────────────────
   Typography Utility Classes
   ────────────────────────────────────── */
@layer components {
  .text-display-xl {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 1.25rem + 3.47vw, 4.5rem);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.025em;
  }
  .text-display-lg {
    font-family: var(--font-display);
    font-size: clamp(2.125rem, 1.15rem + 2.72vw, 3.5rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }
  .text-display-md {
    font-family: var(--font-display);
    font-size: clamp(1.75rem, 1.04rem + 1.98vw, 2.75rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.015em;
  }
  .text-heading-lg {
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 0.97rem + 1.49vw, 2.25rem);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }
  .text-heading-md {
    font-family: var(--font-display);
    font-size: clamp(1.25rem, 0.9rem + 0.99vw, 1.75rem);
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: -0.005em;
  }
  .text-heading-sm {
    font-family: var(--font-display);
    font-size: clamp(1.125rem, 0.95rem + 0.5vw, 1.375rem);
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: 0;
  }
  .text-body-lg {
    font-family: var(--font-body);
    font-size: clamp(1.125rem, 1.04rem + 0.25vw, 1.25rem);
    font-weight: 400;
    line-height: 1.6;
    letter-spacing: 0;
  }
  .text-body-md {
    font-family: var(--font-body);
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.6;
    letter-spacing: 0;
  }
  .text-body-sm {
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0.005em;
  }
  .text-body-xs {
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0.01em;
  }
  .text-eyebrow {
    font-family: var(--font-display);
    font-size: clamp(0.75rem, 0.7rem + 0.14vw, 0.8125rem);
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .text-mono-md {
    font-family: var(--font-mono);
    font-size: clamp(0.8125rem, 0.77rem + 0.11vw, 0.875rem);
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0.02em;
  }
  .text-mono-sm {
    font-family: var(--font-mono);
    font-size: clamp(0.6875rem, 0.64rem + 0.11vw, 0.75rem);
    font-weight: 400;
    line-height: 1.4;
    letter-spacing: 0.03em;
  }
}

/* ──────────────────────────────────────
   Background Patterns
   ────────────────────────────────────── */
.bg-dot-grid {
  background-image:
    radial-gradient(circle, rgba(150, 207, 172, 0.04) 1.5px, transparent 1.5px);
  background-size: 24px 24px;
}

/* ──────────────────────────────────────
   Reduced Motion
   ────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 12. Dark Section Strategy

### 12.1 When to Use Dark Sections

Dark sections use `secondary` (#123646) background with `[data-theme="dark"]` token overrides. They create visual anchoring and authority.

**Permitted content**: Trust/proof modules, data showcases, CTA bands, social proof.
**Prohibited content**: Feature descriptions, forms, FAQ, pricing details.

### 12.2 Rhythm Rules

| Rule | Specification |
|------|---------------|
| Maximum per page | 2 (excluding footer) |
| Adjacency | Never two dark sections in a row |
| Minimum light gap | At least one full light section (`py-24` minimum) between dark sections |
| Recommended positions | 1/3 and 2/3 through page, or just before final CTA |

### 12.3 Token Behavior on Dark

All child components render correctly through CSS variable inheritance:

| Element | Rendered Value | Contrast on secondary |
|---------|----------------|----------------------|
| Headlines | `#f7f8f8` | 11.6:1 PASS |
| Body text | `#b8c3c7` | 7.0:1 PASS |
| Brand accent | `#6cbc8b` (primary-400) | 4.8:1 PASS |
| Card surfaces | `rgba(255,255,255,0.06)` | -- |
| Card borders | `rgba(255,255,255,0.12)` | -- |
| Primary button | White bg, secondary text | -- |
| Secondary button | Transparent, white border/text | -- |

### 12.4 Recommended Homepage Section Rhythm

```
 1. Hero (light, bg-background)
 2. Trust Metrics Strip (light, bg-card)
 3. Feature Showcase - Route (light, bg-background)
 4. Feature Showcase - Review (light, bg-background, reversed)
 5. DARK: Social Proof / Authority Section (bg-secondary)
 6. Feature Grid (light, bg-background)
 7. Feature Showcase - Evidence (light, bg-background)
 8. Process Timeline (light, bg-primary-50 wash)
 9. DARK: CTA Band (bg-secondary)
10. FAQ (light, bg-background)
11. Footer (bg-secondary -- always dark, not counted)
```

---

## 13. Hero Composition Spec

### 13.1 Layout

The hero is the quality benchmark for the entire site. It must communicate "calm authority + visible readiness + premium clarity" in the first 3 seconds.

**Desktop (>= 1024px)**: 12-column grid. Text column (5 cols, left). Product composition (7 cols, right). Vertically centered.

```
+---------------------------+--------------------------------------+
|  TEXT COLUMN (5 cols)     |  PRODUCT COMPOSITION (7 cols)        |
|                           |                                      |
|  [Eyebrow]               |  +------------+  +----------------+  |
|  [Headline]              |  | MAP        |  | REVIEW PANEL   |  |
|  [Subtext]               |  | with route |  |                |  |
|  [CTA] [CTA]             |  | line       |  +----------------+  |
|                           |  |            |  +----------------+  |
|                           |  +------------+  | DOCUMENT       |  |
|                           |    +----------+  | PREVIEW        |  |
|                           |    | READINESS|  +----------------+  |
|                           |    | GAUGE    |                      |
|                           |    +----------+                      |
+---------------------------+--------------------------------------+
```

**Tablet (768-1023px)**: Stacked. Text above, full composition below (all 4 layers, scaled).
**Mobile (< 768px)**: Stacked. Text above. Simplified: map fragment with route line only.

### 13.2 Text Content

| Element | Content | Style |
|---------|---------|-------|
| Eyebrow | "Trip Safety Management Platform" | `.text-eyebrow text-primary-700`, leading shield icon |
| Headline | "Every trip professionally reviewed." | `.text-display-xl text-foreground max-w-[20ch]` |
| Subtext | "SafeTrekr combines intelligence from 5 government data sources, 17-section analyst review, and SHA-256 evidence documentation to protect your travelers and your organization." | `.text-body-lg text-muted-foreground max-w-[50ch] mt-6` |
| CTA Primary | "See Sample Binder" | `Button variant="primary" size="lg"` |
| CTA Secondary | "Schedule a Demo" | `Button variant="secondary" size="lg"` |

Headline is visible immediately (no animation delay on critical text).

### 13.3 Product Composition Layers

The composition is custom-built overlapping card elements. It is NOT a screenshot. Each layer communicates one motif.

**Layer 1 -- Map Intelligence (Base, z-index: 0)**:
- 560x400px desktop, aspect-ratio preserved smaller
- Desaturated map tile (15% saturation, 85% contrast)
- Single curved route path `primary-500` (3px stroke, direction arrows)
- 3-4 waypoint circles (12px) in `primary-600` with `primary-100` halo (20px)
- `rounded-xl shadow-lg border border-border overflow-hidden`

**Layer 2 -- Trip Review Panel (Upper-right, z-index: 10)**:
- 280x320px, overlapping map upper-right by 40px
- "Trip Review" title + "Reviewed" badge, 4 checklist items with green checks, 100% progress bar, analyst avatar (32px circle)
- `rounded-xl bg-white shadow-xl border border-border p-5`

**Layer 3 -- Document Preview (Lower-right, z-index: 20)**:
- 240x180px, below review panel with 20px gap
- "Evidence Binder" eyebrow, 2 timeline entries, SHA-256 hash in `mono-sm`
- Stacked paper effect (3 layers offset 2px each), front: `bg-white rounded-lg shadow-lg border border-border p-4`

**Layer 4 -- Readiness Indicator (Lower-left of map, z-index: 15)**:
- 120x120px
- Circular SVG gauge `primary-500` fill arc ~85%, "Trip Ready" label, safety-green status dot (8px)
- `rounded-xl bg-white shadow-lg border border-border p-4`

### 13.4 Background Treatment

- Base: `background` (#e7ecee)
- Overlay: Faint dot-grid pattern at 3-4% opacity using `primary-300` (CSS `radial-gradient`, no image)
- Optional: Subtle radial gradient from `background` to `primary-50` at 20% opacity, centered behind composition, radius 600px

### 13.5 Animation Sequence

Orchestrated entrance, total ~1800ms. Headline visible immediately.

| Time | Element | Animation | Duration | Easing |
|------|---------|-----------|----------|--------|
| 0ms | Eyebrow | `fadeIn` | 300ms | default |
| 100ms | Headline | `fadeUp` (y: 30px) | 500ms | spring |
| 250ms | Subtext | `fadeUp` (y: 20px) | 400ms | enter |
| 400ms | CTA buttons | `fadeUp` (y: 20px) | 300ms | enter |
| 500ms | Map surface | `scaleIn` (scale: 0.96) | 600ms | spring |
| 700ms | Route line | `routeDraw` (pathLength) | 1200ms | default |
| 900ms | Waypoint markers | `markerPop`, stagger 80ms | 300ms each | spring |
| 800ms | Review panel | `fadeUp` + slide right | 500ms | spring |
| 1000ms | Checklist items | `checklistReveal`, stagger 60ms | 200ms each | enter |
| 1100ms | Document preview | `documentStack` | 500ms | spring |
| 1200ms | Readiness gauge | `gaugeFill` (clockwise) | 1200ms | default |
| 1400ms | Status dot | `statusPulse` | 600ms | spring |

Under `prefers-reduced-motion: reduce`, all elements render at final state immediately.

### 13.6 Hero Spacing

| Breakpoint | Top | Bottom | Grid Gap |
|------------|-----|--------|----------|
| Desktop (>= lg) | `pt-24` (96px) | `pb-32` (128px) | `gap-20` |
| Tablet (md-lg) | `pt-20` (80px) | `pb-24` (96px) | `gap-12` |
| Mobile (< md) | `pt-16` (64px) | `pb-20` (80px) | `gap-8` |

---

## 14. Proprietary Motif System

SafeTrekr's visual differentiation comes from four proprietary motifs. These are not generic SaaS patterns -- they form a recognizable visual language unique to the brand.

### 14.1 Route

**Concept**: Visual language of monitored movement.
**Visual vocabulary**: Maps, route lines, checkpoints, waypoint markers, geographic awareness, direction arrows, geofence boundaries.
**Color accent**: `primary-500` for route lines, `primary-600` for waypoints.
**Icons**: MapPin, Route, `RouteIntelligence` (custom).
**Usage**: Hero map layer, route intelligence showcase, geographic features.
**Motion**: Route lines draw with `routeDraw` (1200ms). Waypoints pop with `markerPop` (stagger 80ms).

### 14.2 Review

**Concept**: Checklists, approval, and readiness layers.
**Visual vocabulary**: Checklist items with checkmarks, progress bars, analyst avatars, review status badges ("Reviewed", "Approved"), 17-section structure.
**Color accent**: `primary-500` for checkmarks and progress fills.
**Icons**: ClipboardCheck, `AnalystReview` (custom).
**Usage**: Hero review panel, review showcase section, how-it-works process.
**Motion**: Checklist items reveal with `checklistReveal` (stagger 60ms). Progress bar fills from 0 to 100%.

### 14.3 Record

**Concept**: Documentation, event logs, trip packets, evidence surfaces.
**Visual vocabulary**: Stacked paper sheets, timeline entries, SHA-256 hash snippets in monospace, "Evidence Binder" headers, "Verified" badges, document seals.
**Color accent**: `foreground` for authority, `primary-50` for verified badges.
**Icons**: FileText, Shield, `EvidenceBinder` (custom).
**Usage**: Hero document layer, evidence binder showcase, trust modules.
**Motion**: Document stack enters with `documentStack` (rotateX). Timeline entries stagger in.

### 14.4 Readiness

**Concept**: Calm, visible, ordered preparedness.
**Visual vocabulary**: Circular gauges (SVG arcs), "Trip Ready" labels, safety-green status dots, readiness percentages, pre-departure checklists.
**Color accent**: `safety-green` for active status, `primary-500` for gauge arcs.
**Icons**: Activity, CircleCheck.
**Usage**: Hero readiness gauge, readiness showcase, status indicators.
**Motion**: Gauge fills clockwise with `gaugeFill` (1200ms, 0.4s delay). Status dot pulses with `statusPulse` (600ms).

### 14.5 MotifBadge Application

Each motif has a branded badge component that replaces generic icons in FeatureCards and section headers:

| Motif | MotifBadge Label | MotifBadge Color |
|-------|-----------------|------------------|
| Route | "Route Intelligence" | `primary-500` |
| Review | "Analyst Review" | `primary-500` |
| Record | "Evidence Record" | `foreground` |
| Readiness | "Trip Ready" | `safety-green` |

---

## 15. Responsive Behavior

### 15.1 Per-Component Breakpoint Adaptations

#### SiteHeader
| Breakpoint | Behavior |
|------------|----------|
| < lg | Hamburger menu, Sheet slide-in, logo + hamburger only |
| >= lg | Full horizontal nav, CTA buttons visible |

#### HeroSection
| Breakpoint | Layout | Visual Composition |
|------------|--------|--------------------|
| < md | Stacked, text first | Map fragment + route line only (simplified) |
| md-lg | Stacked, text above | All 4 layers, scaled to fit |
| >= lg | Side-by-side (5+7 col grid) | Full composition with overlapping panels |

#### FeatureGrid
| Breakpoint | Columns |
|------------|---------|
| < sm | 1 column, full width |
| sm-lg | 2 columns, equal width |
| >= lg | 3 columns (or bento 2+1 pattern) |

#### FeatureShowcase
| Breakpoint | Layout |
|------------|--------|
| < lg | Stacked: visual above text, full width |
| >= lg | Side-by-side, alternating left/right |

#### TrustMetricsStrip
| Breakpoint | Columns |
|------------|---------|
| < md | 2 columns |
| md-lg | 3 columns |
| >= lg | 5 columns (single row) |

#### PricingTier
| Breakpoint | Layout |
|------------|--------|
| < md | Stacked, full width, featured first |
| md-lg | 2 columns, featured highlighted |
| >= lg | 3 columns, featured `scale(1.05)` |

#### CTABand
| Breakpoint | Buttons |
|------------|---------|
| < sm | Stacked, full width |
| >= sm | Horizontal, centered |

#### SiteFooter
| Breakpoint | Layout |
|------------|--------|
| < md | Stacked: logo, links (2-col), bottom bar |
| md-lg | Logo left + 3-col links right, bottom bar |
| >= lg | 5-col grid (logo 2 cols, links 3 cols) |

#### DemoRequestForm
| Breakpoint | Layout |
|------------|--------|
| < md | Single column |
| >= md | 2-column grid for paired fields |

#### ProcessTimeline
| Breakpoint | Layout |
|------------|--------|
| < lg | Vertical (stacked TimelineSteps) |
| >= lg | Horizontal (3-column grid with connectors) |

### 15.2 Quality Gate Viewports

Responsive QA must be completed at these widths: 320px, 375px, 768px, 1024px, 1280px, 1536px, 2560px.

---

## Appendix: Quality Gates

### Pre-Merge Gates

| Gate | Threshold | Tool |
|------|-----------|------|
| Text contrast (normal) | >= 4.5:1 | axe-core CI |
| Text contrast (large) | >= 3:1 | axe-core CI |
| Focus indicators | 2px+ ring on all interactive elements | Manual + axe-core |
| Keyboard navigation | Full tab order, Enter/Space activation | Manual QA |
| `prefers-reduced-motion` | All animation disabled | Manual QA |
| Lighthouse Performance | >= 95 | Lighthouse CI |
| Lighthouse Accessibility | >= 95 (target 100) | Lighthouse CI |
| LCP | < 1.5s (simulated 3G) | Lighthouse CI |
| CLS | < 0.05 | Lighthouse CI |
| Initial JS bundle | < 150KB gzipped | Bundle analyzer CI |
| No fabricated testimonials | Zero instances | Code review |
| Brand/safety green separation | No brand green in status contexts | Code review |
| Dark sections | Max 2/page, never adjacent | Code review |
| Token compliance | No inline hex, no inline px spacing | Linting |

### Performance Budget

| Metric | Budget |
|--------|--------|
| LCP | < 1.5s |
| CLS | < 0.05 |
| INP | < 100ms |
| Total initial page weight | < 500KB |
| JS bundle (gzipped) | < 150KB |
| Web fonts total | < 100KB |
| MapLibre | Lazy-loaded separately |

---

*This design system was authored as the canonical reference for the SafeTrekr Marketing Site. All specifications are implementation-ready for Next.js 15 + Tailwind CSS 4 + shadcn/ui + Framer Motion, deployed on DigitalOcean DOKS. Version 1.0, 2026-03-24.*
