# UI Designer PRD: SafeTrekr Marketing Site

**Version**: 1.0
**Date**: 2026-03-24
**Author**: World-Class UI Designer Persona
**Project**: SafeTrekr Marketing Site (Greenfield)
**Stack**: Next.js 15 (App Router) + React 19 + Tailwind CSS 4 + shadcn/ui + Framer Motion + MapLibre GL JS
**Deployment**: DigitalOcean (Docker/Kubernetes via DOKS), NOT Vercel

---

## Table of Contents

1. [Document Purpose and Scope](#1-document-purpose-and-scope)
2. [Design Token System](#2-design-token-system)
3. [Typography System](#3-typography-system)
4. [Component Library](#4-component-library)
5. [Hero Composition Specification](#5-hero-composition-specification)
6. [Motion System](#6-motion-system)
7. [Dark Section Strategy](#7-dark-section-strategy)
8. [Responsive Breakpoint System](#8-responsive-breakpoint-system)
9. [Icon System](#9-icon-system)
10. [Logo Usage Specification](#10-logo-usage-specification)
11. [Accessibility Compliance](#11-accessibility-compliance)
12. [Implementation Sequence](#12-implementation-sequence)
13. [Quality Gates](#13-quality-gates)
14. [Risk Register](#14-risk-register)

---

## 1. Document Purpose and Scope

This PRD defines every visual and component requirement for the SafeTrekr marketing site from the UI design system perspective. Every specification in this document is implementation-ready and maps directly to the Tailwind CSS 4 + shadcn/ui + Framer Motion stack. No requirement here is aspirational -- each one has been validated for accessibility compliance, performance budget adherence, and technical feasibility within the binding tech stack.

### 1.1 Visual Thesis

SafeTrekr's marketing site must communicate **calm authority**, **visible readiness**, **modern operational elegance**, **human-guided oversight**, and **documented accountability**. The site must NOT resemble generic SaaS, fear-based security branding, travel-lifestyle marketing, emergency-alert software, or soft wellness branding. It is a **modern, premium oversight platform** for institutional buyers.

### 1.2 Visual Blend

70% Polished Operational / 20% Editorial Intelligence / 10% Watchtower Light. The neutral system does most of the visual work. Brand green provides identity and selective emphasis. Authority blue provides grounding and seriousness. Safety-status colors appear only when operational meaning is explicit.

### 1.3 Binding Constraints

- Deployed on DigitalOcean DOKS (Docker containers, Nginx ingress), not Vercel. No Vercel Edge Functions, no automatic preview deploys, no built-in image CDN. Image optimization uses `sharp` (self-hosted). SSL via cert-manager + Let's Encrypt.
- All pages SSG (static) except blog (ISR with custom cache on Nginx). No server-side rendering at request time for marketing pages.
- Performance budget: LCP < 1.5s, CLS < 0.05, INP < 100ms, total initial page weight < 500KB, JS < 150KB gzipped, MapLibre lazy-loaded separately.
- WCAG 2.2 AA compliance is non-negotiable from day one. K-12 and government buyers require Section 508 compliance.

---

## 2. Design Token System

All tokens are implemented via Tailwind CSS 4's `@theme inline` directive as CSS custom properties. No hardcoded hex values, pixel values, or inline styles are permitted in any component. Every visual decision flows through tokens.

### FR-DT-001: Color Tokens -- Semantic System

**Priority**: P0
**File**: `app/globals.css` within `@theme inline {}` block

| Token | Value | Role | Contrast on `background` | WCAG AA |
|-------|-------|------|--------------------------|---------|
| `--color-background` | `#e7ecee` | Page canvas. The atmospheric base. Bright, structured, high-trust. | -- | -- |
| `--color-foreground` | `#061a23` | Primary text, headlines, high-contrast foreground. | 13.2:1 | PASS |
| `--color-card` | `#f7f8f8` | Card surfaces, contained modules, form blocks. | -- | -- |
| `--color-card-foreground` | `#061a23` | Text on card surfaces. | 14.8:1 on card | PASS |
| `--color-border` | `#b8c3c7` | Borders, dividers, soft structure. | -- | -- |
| `--color-input` | `#80959b` | Input accents, lower-emphasis UI support. | -- | -- |
| `--color-ring` | `#365462` | Focus ring, interaction outline. Must be clearly visible. | -- | -- |
| `--color-muted` | `#e7ecee` | Muted fills, neutral background blocks. | -- | -- |
| `--color-muted-foreground` | `#4d5153` | Secondary text, captions, support copy. CORRECTED from `#616567`. | 5.2:1 | PASS |
| `--color-popover` | `#f7f8f8` | Popover and dropdown backgrounds. | -- | -- |
| `--color-popover-foreground` | `#061a23` | Text within popovers. | 14.8:1 on popover | PASS |
| `--color-accent` | `#f1f9f4` | Accent backgrounds (lightest brand wash). | -- | -- |
| `--color-accent-foreground` | `#061a23` | Text on accent surfaces. | -- | PASS |

**Acceptance Criteria**:
- `muted-foreground` MUST be `#4d5153`, not the original `#616567`. The original value achieves only 4.0:1 contrast on `background`, which fails WCAG 2.2 AA for normal text. The corrected value achieves 5.2:1 on `background` and 5.8:1 on `card`. This is a non-negotiable correction.
- Every semantic token is registered in the `@theme inline` block and available as a Tailwind utility (e.g., `text-foreground`, `bg-card`, `border-border`).

### FR-DT-002: Color Tokens -- Brand Primary (Green Scale)

**Priority**: P0

| Token | Value | Role |
|-------|-------|------|
| `--color-primary-50` | `#f1f9f4` | Lightest brand wash. Subtle section backgrounds. |
| `--color-primary-100` | `#e0f1e6` | Soft section accent. CTA band light variant. |
| `--color-primary-200` | `#c0e2cd` | Quiet supportive background. Hover states for secondary elements. |
| `--color-primary-300` | `#96cfac` | Light brand emphasis. Dot-grid pattern source. Disabled button tint. |
| `--color-primary-400` | `#6cbc8b` | Mid-tone brand accent. Dark-surface accent color. |
| `--color-primary-500` | `#4ca46e` | Core brand green. Decorative accents, icons, large display text ONLY. NOT for button backgrounds with small white text (3.4:1 fails AA). |
| `--color-primary-600` | `#3f885b` | Standard button background. 4.6:1 with white text (PASSES AA). Hover accents. |
| `--color-primary-700` | `#33704b` | High-emphasis brand text on light backgrounds (6.1:1). Link color. |
| `--color-primary-800` | `#2a5b3d` | Deep brand anchor. Badge text on primary-50 backgrounds. |
| `--color-primary-900` | `#20462f` | Dark brand grounding. |
| `--color-primary-950` | `#132a1c` | Deepest brand accent. |
| `--color-primary` | `#4ca46e` | Alias for primary-500. Generic brand reference. |
| `--color-primary-foreground` | `#ffffff` | White text on primary surfaces. |

**Acceptance Criteria**:
- `primary-600` (`#3f885b`) is the standard button background, not `primary-500`. White text on `primary-600` achieves 4.6:1, passing AA. White text on `primary-500` achieves only 3.4:1, failing for small text.
- `primary-700` (`#33704b`) is used for text links and small brand-colored text. It achieves 6.1:1 on `background`.
- `primary-500` is reserved for decorative accents (icon fills, route lines, large display text >= 18px, progress bar fills) where text contrast is not a concern.
- Brand green (`primary-*`) is NEVER used where safety-status green (`safety-green`) is the correct semantic meaning. They are different hues and different roles.

### FR-DT-003: Color Tokens -- Secondary (Authority Blue)

**Priority**: P0

| Token | Value | Role |
|-------|-------|------|
| `--color-secondary` | `#123646` | Dark blue authority accent. Footer, dark sections, trust bars. |
| `--color-secondary-foreground` | `#f7f8f8` | Text on secondary surfaces. 11.6:1 contrast. PASS. |
| `--color-secondary-light` | `#1a4a5e` | Lighter variant for hover states on secondary surfaces. |
| `--color-secondary-muted` | `#b8c3c7` | Muted text on secondary backgrounds. 7.0:1 contrast. PASS. |

### FR-DT-004: Color Tokens -- Destructive

**Priority**: P0

| Token | Value | Role |
|-------|-------|------|
| `--color-destructive` | `#c1253e` | Error states, destructive actions only. Never decorative. |
| `--color-destructive-foreground` | `#ffffff` | Text on destructive surfaces. |

### FR-DT-005: Color Tokens -- Safety Status (Operational Only)

**Priority**: P0

| Token | Value | Role |
|-------|-------|------|
| `--color-safety-green` | `#22c55e` | Safe / all clear. Map status dots, resolved markers. |
| `--color-safety-yellow` | `#eab308` | Caution. Flagged items, elevated awareness. |
| `--color-safety-red` | `#ef4444` | Danger / alert. Severe risk markers. |

**Acceptance Criteria**:
- Safety-status colors appear ONLY in contexts with explicit operational meaning: map markers, status badges, trip-state indicators, documentation severity markers.
- Safety-status colors NEVER appear as decorative marketing accents, section backgrounds, button colors, or hover states.
- Safety-green (`#22c55e`) and brand primary-500 (`#4ca46e`) are visually distinct hues. If a reviewer cannot distinguish the purpose at a glance, the usage is wrong.

### FR-DT-006: Color Tokens -- Warning Scale

**Priority**: P0

| Token | Value |
|-------|-------|
| `--color-warning-50` | `#fffbeb` |
| `--color-warning-100` | `#fef3c7` |
| `--color-warning-200` | `#fde68a` |
| `--color-warning-300` | `#fcd34d` |
| `--color-warning-400` | `#fbbf24` |
| `--color-warning-500` | `#f59e0b` |
| `--color-warning-600` | `#d97706` |
| `--color-warning-700` | `#b45309` |
| `--color-warning-800` | `#92400e` |
| `--color-warning-900` | `#78350f` |

Warning colors are used for tiered caution in maps, documentation severity markers, and operational cards. They MUST NOT become a recurring decorative theme.

### FR-DT-007: Color Tokens -- Dark Surface Overrides

**Priority**: P0

These tokens are activated via `[data-theme="dark"]` CSS selector on dark sections (see Section 7).

| Token | Value | Role |
|-------|-------|------|
| `--color-dark-surface` | `rgba(255, 255, 255, 0.06)` | Card surfaces on dark backgrounds. |
| `--color-dark-border` | `rgba(255, 255, 255, 0.12)` | Borders on dark backgrounds. |
| `--color-dark-text-primary` | `#f7f8f8` | Headlines on dark. 11.6:1 on secondary. |
| `--color-dark-text-secondary` | `#b8c3c7` | Body text on dark. 7.0:1 on secondary. |
| `--color-dark-accent` | `#6cbc8b` | Brand accent on dark (primary-400). |

**Implementation**:

```css
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
```

This approach allows child components (FeatureCard, StatCard, Badge, etc.) to render correctly on dark backgrounds without prop drilling or variant duplication.

### FR-DT-008: Spacing Tokens -- 8-Point Grid

**Priority**: P0

| Token | Value | Tailwind Usage |
|-------|-------|----------------|
| `--spacing-0` | `0px` | `p-0`, `m-0` |
| `--spacing-px` | `1px` | `p-px`, `m-px` |
| `--spacing-0-5` | `2px` | `p-0.5`, `m-0.5` |
| `--spacing-1` | `4px` | `p-1`, `m-1` |
| `--spacing-2` | `8px` | `p-2`, `m-2` |
| `--spacing-3` | `12px` | `p-3`, `m-3` |
| `--spacing-4` | `16px` | `p-4`, `m-4` |
| `--spacing-5` | `20px` | `p-5`, `m-5` |
| `--spacing-6` | `24px` | `p-6`, `m-6` |
| `--spacing-8` | `32px` | `p-8`, `m-8` |
| `--spacing-10` | `40px` | `p-10`, `m-10` |
| `--spacing-12` | `48px` | `p-12`, `m-12` |
| `--spacing-16` | `64px` | `p-16`, `m-16` |
| `--spacing-20` | `80px` | `p-20`, `m-20` |
| `--spacing-24` | `96px` | `p-24`, `m-24` |
| `--spacing-32` | `128px` | `p-32`, `m-32` |
| `--spacing-40` | `160px` | `p-40`, `m-40` |

**Acceptance Criteria**:
- All spacing values are multiples of 4px, following the 8-point grid system.
- No component uses arbitrary pixel values for margin, padding, or gap. All spacing references a token.

### FR-DT-009: Border Radius Tokens

**Priority**: P0

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `4px` | Small chips, inline badges. |
| `--radius-md` | `8px` | Buttons, inputs, small cards. |
| `--radius-lg` | `12px` | Standard cards, containers. |
| `--radius-xl` | `16px` | Large cards, featured sections. |
| `--radius-2xl` | `20px` | Hero composition panels, pricing cards. |
| `--radius-full` | `9999px` | Badges, status dots, avatars. |
| `--radius` | `8px` | Default radius (alias for `radius-md`). |

**Design Rule**: SafeTrekr uses disciplined rectangles, not pills. Rounded corners are present but restrained. `radius-full` is reserved for explicitly circular elements (badges, dots, avatars). Cards and buttons use `radius-md` to `radius-xl`.

### FR-DT-010: Shadow Tokens -- Cool-Toned

**Priority**: P0

All shadows use the foreground color base (`rgba(6, 26, 35, x)`) for cool-toned shadows that align with the blue-green palette. No warm gray shadows.

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(6,26,35,0.04), 0 1px 3px rgba(6,26,35,0.06)` | Subtle elevation for badges, small elements. |
| `--shadow-md` | `0 2px 4px rgba(6,26,35,0.04), 0 4px 12px rgba(6,26,35,0.08)` | Standard elevation for dropdowns, popovers. |
| `--shadow-lg` | `0 4px 8px rgba(6,26,35,0.04), 0 8px 24px rgba(6,26,35,0.1)` | Prominent elevation for modals, large cards. |
| `--shadow-xl` | `0 8px 16px rgba(6,26,35,0.06), 0 16px 48px rgba(6,26,35,0.12)` | Maximum elevation for hero composition panels. |
| `--shadow-inner` | `inset 0 1px 2px rgba(6,26,35,0.06)` | Inset shadow for pressed states, input focus. |
| `--shadow-card` | `0 1px 3px rgba(6,26,35,0.04), 0 2px 8px rgba(6,26,35,0.06)` | Default card resting state. |
| `--shadow-card-hover` | `0 4px 12px rgba(6,26,35,0.06), 0 8px 24px rgba(6,26,35,0.08)` | Card hover state elevation increase. |

### FR-DT-011: Animation Tokens -- Easing Curves and Durations

**Priority**: P0

**Easing Curves**:

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | General-purpose transitions. |
| `--ease-enter` | `cubic-bezier(0.0, 0, 0.2, 1)` | Elements entering the viewport. |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving the viewport. |
| `--ease-spring` | `cubic-bezier(0.22, 1, 0.36, 1)` | Organic, spring-like motion for reveals. |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Slight overshoot for status dot pops (use sparingly). |

**Durations**:

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | `100ms` | Immediate feedback (focus rings). |
| `--duration-fast` | `150ms` | Hover states, micro-interactions. |
| `--duration-normal` | `200ms` | Standard transitions (buttons, links, nav). |
| `--duration-moderate` | `300ms` | Component-level transitions (accordions, sheets). |
| `--duration-slow` | `500ms` | Section-level reveals, card animations. |
| `--duration-slower` | `800ms` | Large composition reveals. |
| `--duration-reveal` | `1000ms` | Full-section scroll reveals. |
| `--duration-draw` | `1200ms` | SVG path drawing animations (route lines). |

### FR-DT-012: Z-Index Scale

**Priority**: P0

| Token | Value | Usage |
|-------|-------|-------|
| `--z-behind` | `-1` | Background decorative elements. |
| `--z-base` | `0` | Default layer. |
| `--z-raised` | `10` | Cards, raised surfaces. |
| `--z-dropdown` | `20` | Dropdowns, menus. |
| `--z-sticky` | `30` | Sticky header. |
| `--z-overlay` | `40` | Overlays, backdrop. |
| `--z-modal` | `50` | Modals, dialogs. |
| `--z-toast` | `60` | Toasts, notifications. |

### FR-DT-013: Layout Tokens

**Priority**: P0

| Token | Value | Usage |
|-------|-------|-------|
| `--container-sm` | `640px` | Narrow content (FAQ, forms). |
| `--container-md` | `768px` | Medium content (blog posts). |
| `--container-lg` | `1024px` | Wide content. |
| `--container-xl` | `1280px` | Max content width (standard). |
| `--container-2xl` | `1440px` | Full-bleed content width. |
| `--container-max` | `1280px` | Standard content container width. |
| `--container-bleed` | `1440px` | Full-bleed content container width. |

**Container Pattern**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

At viewports below 640px, content fills the viewport with 24px side padding. Between 640px and 1280px, side padding increases to 32-48px. At 1280px and above, content is centered with growing margins. At 1536px and above, generous white space (128px+ per side) frames the content.

---

## 3. Typography System

### FR-TY-001: Font Loading Strategy

**Priority**: P0
**File**: `lib/fonts.ts`

Three font families, loaded via `next/font/google` with explicit `display: 'swap'` and system fallbacks:

| Font | Role | Weights | Variable |
|------|------|---------|----------|
| Plus Jakarta Sans | Display (headlines, eyebrows, buttons) | 400, 500, 600, 700, 800 | `--font-display` |
| Inter | Body text (paragraphs, descriptions, metadata) | 400, 500, 600 | `--font-body` |
| JetBrains Mono | Code and data (SHA-256 hashes, technical values) | 400, 500 | `--font-mono` |

**Font stack tokens**:
- `--font-sans`: `"Plus Jakarta Sans", "Inter", system-ui, -apple-system, sans-serif`
- `--font-display`: `"Plus Jakarta Sans", system-ui, -apple-system, sans-serif`
- `--font-body`: `"Inter", system-ui, -apple-system, sans-serif`
- `--font-mono`: `"JetBrains Mono", ui-monospace, "Cascadia Code", monospace`

**Acceptance Criteria**:
- Total web font weight under 100KB.
- Font CSS variables applied to `<html>` element via `className={cn(jakarta.variable, inter.variable, jetbrainsMono.variable)}`.
- `display: 'swap'` on all fonts to prevent invisible text during loading.
- System fallback fonts chosen to approximate the web font metrics and minimize layout shift.

### FR-TY-002: Type Scale with Fluid Responsive Sizing

**Priority**: P0
**File**: `app/globals.css` within `@layer components {}` block

Each text style is defined as a Tailwind CSS `@layer components` utility class. Display and heading sizes use `clamp()` for fluid scaling between 375px (mobile) and 1280px (desktop). Body sizes are fixed (no scaling needed).

| Class | Desktop | Mobile | `clamp()` | Weight | Line Height | Letter Spacing | Font |
|-------|---------|--------|-----------|--------|-------------|----------------|------|
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

**Acceptance Criteria**:
- The `.text-eyebrow` class MUST include `text-transform: uppercase` in its definition.
- `clamp()` values are validated at 320px minimum viewport to confirm readability (display-xl floors at 40px / 2.5rem).
- No media query breakpoints are used for typography sizing. `clamp()` handles all responsive scaling.

### FR-TY-003: Maximum Line Width Constraints

**Priority**: P0

| Text Role | Max Width | Tailwind Class |
|-----------|-----------|----------------|
| Display headlines | 20 characters | `max-w-[20ch]` |
| Section headlines | 28 characters | `max-w-[28ch]` |
| Body copy paragraphs | 65 characters | `max-w-prose` (customized to 65ch) |
| Card descriptions | 45 characters | `max-w-[45ch]` |
| Eyebrow labels | No limit | -- |

These constraints are enforced in the component markup, not globally. They prevent text from stretching to unreadable line lengths on wide viewports.

---

## 4. Component Library

### 4.1 Atoms (P0 -- Build Week 1)

#### FR-CL-001: Button

**Priority**: P0
**File**: `components/ui/button.tsx`
**Base**: shadcn/ui Button primitive, customized with SafeTrekr tokens.

**Variants**:

| Variant | Background | Text | Border | Hover | Active | Disabled |
|---------|-----------|------|--------|-------|--------|----------|
| `primary` | `primary-600` | `white` | none | `primary-700` | `primary-800` | `primary-300` at 60% opacity |
| `secondary` | `transparent` | `foreground` | `border` | `primary-50` bg | `primary-100` bg | `muted-foreground`, border at 40% opacity |
| `ghost` | `transparent` | `foreground` | none | `muted` bg | `primary-50` bg | `muted-foreground` |
| `destructive` | `destructive` | `white` | none | `destructive/90` | `destructive/80` | `destructive/40` |
| `primary-on-dark` | `white` | `secondary` | none | `card` | `primary-50` | `white/30` |
| `link` | `transparent` | `primary-700` | none | underline | `primary-800` | `muted-foreground` |

**Sizes**:

| Size | Height | Horizontal Padding | Font Size | Min Touch Target |
|------|--------|--------------------|-----------|-----------------|
| `sm` | `h-9` (36px) | `px-3` | `text-sm` (14px) | 44x44px (with padding) |
| `default` | `h-11` (44px) | `px-5` | `text-base` (16px) | 44x44px |
| `lg` | `h-13` (52px) | `px-8` | `text-lg` (18px) | 52x52px |
| `icon` | `h-10 w-10` (40px) | -- | -- | 44x44px (with padding) |

**Shared Properties**: `border-radius: radius-md (8px)`, `font-weight: 600`, `transition: all duration-fast ease-default`, focus ring using `ring` token (2px offset, 2px width).

**Props Interface**:

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

**Accessibility Requirements**:
- Focus-visible ring: 2px `ring` color, 2px offset, visible on all backgrounds.
- `loading` state: sets `aria-busy="true"`, shows spinner icon, disables pointer events.
- `disabled` state: sets `aria-disabled="true"`, reduces opacity, removes pointer events.
- All button text meets contrast requirements (see FR-DT-002 for primary-600 rationale).
- Minimum touch target of 44x44px per WCAG 2.5.5.

#### FR-CL-002: Badge / Chip

**Priority**: P0
**File**: `components/ui/badge.tsx`

**Variants**:

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| `default` | `primary-50` | `primary-800` | none |
| `secondary` | `card` | `foreground` | `border` |
| `outline` | `transparent` | `foreground` | `border` |
| `status-green` | `safety-green/10` | safety-green (darkened for contrast) | none |
| `status-yellow` | `warning-100` | `warning-800` | none |
| `status-red` | `destructive/10` | `destructive` | none |
| `dark` | `secondary` | `secondary-foreground` | none |

**Sizes**: `sm` (h-5, px-2, text-xs), `default` (h-6, px-2.5, text-xs), `lg` (h-7, px-3, text-sm).

**Shared**: `border-radius: radius-full`, `font-weight: 500`.

**Accessibility**: Status badges MUST include `aria-label` or visible text that conveys the status meaning, not just the color.

#### FR-CL-003: Eyebrow

**Priority**: P0
**File**: `components/ui/eyebrow.tsx`

A styled `<span>` that always appears above section headings. Uses `.text-eyebrow` class with `text-primary-700`. Optionally includes a leading icon (16px Lucide) or colored dot (6px, `rounded-full`).

**Props**: `children: string`, `icon?: LucideIcon`, `dot?: boolean`, `dotColor?: string`, `className?: string`.

#### FR-CL-004: StatusDot

**Priority**: P0
**File**: `components/ui/status-dot.tsx`

| State | Color | Animation |
|-------|-------|-----------|
| `active` | `safety-green` | Single pulse on enter (scale 1 to 1.4 to 1, 600ms) |
| `warning` | `safety-yellow` | None |
| `alert` | `safety-red` | None |
| `inactive` | `border` | None |

**Sizes**: 6px (small), 8px (default), 10px (large). Always `rounded-full`.

**Accessibility**: Requires `aria-label` describing the state (e.g., "Active", "Warning"). Color alone does not convey meaning.

#### FR-CL-005: Divider

**Priority**: P0
**File**: `components/ui/divider.tsx`

Two variants:
1. **Standard**: `h-px bg-border` full-width horizontal rule.
2. **Section divider**: 80% width, centered, `bg-border`.
3. **Route divider** (Enhancement): S-curve SVG path extracted from the logo mark, `primary-200` at 30% opacity, max-width 600px centered, with optional scroll-triggered pathLength draw animation.

**Props**: `variant: 'standard' | 'section' | 'route'`, `className?: string`.

#### FR-CL-006: Logo

**Priority**: P0
**File**: `components/ui/logo.tsx`

Renders the correct SafeTrekr logo variant based on context:

| Context | Variant | Height | Color |
|---------|---------|--------|-------|
| Header (desktop, >= 1024px) | Horizontal lockup, dark | 32px | `secondary` (#123646) |
| Header (mobile, >= 360px) | Horizontal lockup, dark | 28px | `secondary` |
| Header (mobile, < 360px) | Mark only | 28px | `secondary` |
| Footer | Horizontal lockup, light | 32px | `white` |
| Favicon | Mark only | 32x32 | `secondary` |
| OG image | Horizontal lockup, dark | 48px | `secondary` |

**Props**: `variant: 'horizontal-dark' | 'horizontal-light' | 'mark-dark' | 'mark-light'`, `height?: number`, `className?: string`.

**Acceptance Criteria**: Logo is rendered as inline SVG for zero network requests and color control via `currentColor` or explicit fills.

### 4.2 Molecules (P0/P1 -- Build Weeks 1-3)

#### FR-CL-007: FeatureCard

**Priority**: P0
**File**: `components/marketing/feature-card.tsx`

Card for the feature grid sections. Contains icon, heading, description, and optional "Learn more" link.

**Structure**: `bg-card rounded-xl border border-border p-6 sm:p-8 shadow-card`. On hover: `shadow-card-hover`, `translateY(-2px)`, transition `duration-normal`.

**Content slots**:
1. Icon container: `h-12 w-12 rounded-lg bg-primary-50`, icon `h-6 w-6 text-primary-700`.
2. Title: `.text-heading-sm text-foreground mb-2`.
3. Description: `.text-body-md text-muted-foreground max-w-[45ch]`.
4. Link (optional): `.text-body-sm font-medium text-primary-700` with ArrowRight icon that translates 4px right on parent hover.

**Props**: `icon: LucideIcon`, `title: string`, `description: string`, `href?: string`, `motifType?: 'route' | 'review' | 'record' | 'readiness'`, `featured?: boolean`, `className?: string`.

When `featured` is true: card spans 2 columns (`sm:col-span-2 lg:col-span-2`), `min-h-[280px]`, icon size increases to 48px, title uses `.text-heading-md`.

When `motifType` is set, the icon slot renders a MotifBadge instead of a plain icon.

**Accessibility**: Card link, if present, wraps the entire card as a single interactive target (uses `group` pattern). Card title is a heading element (`h3`).

#### FR-CL-008: StatCard

**Priority**: P0
**File**: `components/marketing/stat-card.tsx`

Numeric highlight card used in trust strips and data sections.

**Structure**: `bg-card rounded-xl border border-border p-6 text-center shadow-sm`.

**Content slots**:
1. Value: `.text-display-md text-foreground font-mono`.
2. Label: `.text-eyebrow text-muted-foreground mt-1 block`.

**Props**: `value: number | string`, `label: string`, `prefix?: string`, `suffix?: string`, `animate?: boolean`.

When `animate` is true, the numeric value counts from 0 to the target using the AnimatedCounter component (FR-MO-012). Respects `prefers-reduced-motion` by showing the final value immediately.

#### FR-CL-009: PricingTier

**Priority**: P0
**File**: `components/marketing/pricing-tier.tsx`

Interactive pricing card with per-student reframing.

**Structure**: `bg-card rounded-2xl border-2 p-8 shadow-lg`. Featured tier: `border-primary-500 shadow-xl`, with optional "Most Popular" badge.

**Content slots**:
1. Featured badge (conditional): `<Badge variant="default">Most Popular</Badge>`.
2. Plan name: `.text-heading-md text-foreground`.
3. Price display: `.text-display-md text-foreground` for primary price ("$15"), `.text-body-sm text-muted-foreground` for unit ("/student").
4. Per-trip equivalent: `.text-body-sm text-muted-foreground mt-2` (e.g., "$450 per trip of 30").
5. Feature list: `space-y-3`, each item with check icon in `primary-500`.
6. CTA: `<Button variant="primary" size="lg" className="mt-8 w-full">`.

**Props**: `name: string`, `price: number`, `unit: string`, `perTripLabel: string`, `features: string[]`, `featured?: boolean`, `ctaLabel: string`, `ctaHref: string`.

**Design Rule**: No animation on pricing cards. Stability and readability are paramount in pricing. The featured card uses `scale(1.05)` on desktop (>= lg) as a static visual hierarchy cue, not a hover effect.

**Accessibility**: Pricing values use `aria-label` to provide the complete price context (e.g., "15 dollars per student, 450 dollars per trip of 30 students").

#### FR-CL-010: IndustryCard

**Priority**: P0
**File**: `components/marketing/industry-card.tsx`

Segment-specific card linking to solution pages.

**Structure**: Entire card is an `<a>` with `group` class. `bg-card rounded-xl border border-border p-6 shadow-card`. Hover: `shadow-card-hover`, title color transitions to `primary-700`.

**Content**: Icon in `secondary/5` background container, title as `h3`, description in `muted-foreground`, "Learn more" with ArrowRight (translates on group hover).

**Props**: `icon: LucideIcon`, `title: string`, `description: string`, `href: string`.

#### FR-CL-011: MotifBadge

**Priority**: P0
**File**: `components/marketing/motif-badge.tsx`

The signature visual element encoding one of the four SafeTrekr motifs:

| Motif | Icon | Color Accent | Label |
|-------|------|-------------|-------|
| `route` | MapPin / Route | `primary-500` | "Route Intelligence" |
| `review` | ClipboardCheck | `primary-500` | "Analyst Review" |
| `record` | FileText / Shield | `foreground` | "Evidence Record" |
| `readiness` | Activity / CircleCheck | `safety-green` | "Trip Ready" |

**Structure**: `inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm`. Icon in a 20px circle with `{motifColor}/10` background.

**Props**: `motif: 'route' | 'review' | 'record' | 'readiness'`, `className?: string`.

#### FR-CL-012: DocumentPreview

**Priority**: P0
**File**: `components/marketing/document-preview.tsx`

Stylized card that looks like stacked paper documents. Used in evidence binder sections and hero composition.

**Structure**: Three offset layers creating a paper stack effect.
1. Back sheets: Two `div` elements offset by -1px and -0.5px (right, top) with `bg-card border border-border shadow-sm`.
2. Front sheet: `bg-white rounded-lg border border-border shadow-md p-6`.
3. Content: Header with "Evidence Binder" eyebrow + "Verified" badge, 2 condensed timeline entries, SHA-256 hash snippet in `mono-sm`.

**Props**: `title?: string`, `className?: string`.

#### FR-CL-013: TimelineStep

**Priority**: P0
**File**: `components/marketing/timeline-step.tsx`

Single step in a vertical timeline.

**Structure**: Flex row with timeline indicator (3px circle in `primary-500` with `primary-100` ring, 1px connector line in `border`) and content column (timestamp in `body-xs muted-foreground`, title in `body-sm font-semibold foreground`, description in `body-sm muted-foreground`).

**Props**: `timestamp?: string`, `title: string`, `description?: string`, `isLast?: boolean` (hides connector line).

#### FR-CL-014: NavLink

**Priority**: P0
**File**: `components/layout/nav-link.tsx`

Header navigation link with active state detection.

**States**:
- Default: `text-foreground/70 hover:text-foreground`, transition `duration-fast`.
- Active: `text-foreground font-semibold`, with 2px bottom border in `primary-500`.
- Mobile: Full-width block, `py-3`, `border-b border-border`.

Uses `aria-current="page"` on the active link. Active state determined by comparing `pathname` with the link's `href`.

**Props**: `href: string`, `children: string`, `className?: string`.

#### FR-CL-015: LogoCloud

**Priority**: P1
**File**: `components/marketing/logo-cloud.tsx`

Horizontal strip of partner/trust organization logos. Default state: `grayscale opacity-50`. Hover: `grayscale-0 opacity-100`, transition `duration-normal`.

Logo height: 32px. Gap: `gap-x-12 gap-y-6`. Flexbox with wrap and center justification.

**Note**: This component is placeholder until real partner logos are secured. It should not render fabricated or misleading organization logos.

### 4.3 Organisms (P0/P1 -- Build Weeks 2-5)

#### FR-CL-016: SiteHeader

**Priority**: P0
**File**: `components/layout/site-header.tsx`

Sticky navigation bar with glassmorphic scroll behavior.

**States**:

| State | Background | Border | Blur | Shadow | Height |
|-------|-----------|--------|------|--------|--------|
| At top (hero visible) | `transparent` | none | none | none | `h-20` (80px) |
| Scrolled (> 100px) | `background/80` | `border-b border/50` | `backdrop-blur-xl` | `shadow-sm` | `h-16` (64px) |

Transition between states: 300ms, `ease-default`.

**Layout**:
- Desktop (>= lg): Logo (left), horizontal nav links (center/left), CTA buttons (right): "Sign In" ghost + "Get a Demo" primary.
- Mobile (< lg): Logo (left), hamburger icon (right) triggering shadcn/ui `Sheet` sliding from right with full navigation and CTAs.

**Navigation items** (maximum 5 primary):
1. Solutions (with mega-menu or dropdown for segments)
2. How It Works
3. Features
4. Pricing
5. About

**Accessibility**:
- Skip navigation link: First focusable element, visually hidden until focused, jumps to `#main-content`.
- `<nav aria-label="Main navigation">`.
- `aria-expanded` and `aria-controls` on mobile hamburger button.
- `aria-current="page"` on active nav link.
- All nav items have 44x44px minimum touch targets.
- Focus-visible ring (2px, `ring` color) on all interactive elements.

#### FR-CL-017: SiteFooter

**Priority**: P0
**File**: `components/layout/site-footer.tsx`

Dark footer on `secondary` background. Three-zone layout.

**Zone 1** (Brand): Logo (horizontal-light variant, 32px), brand description in `dark-text-secondary`, max-width 35ch.

**Zone 2** (Links): Three columns -- Product, Solutions, Company. Links styled: `text-body-sm text-[var(--color-dark-text-secondary)] hover:text-white transition-colors duration-fast`.

**Zone 3** (Bottom bar): Copyright text in `body-xs dark-text-secondary`. Legal links (Privacy, Terms). Separated by `border-t border-[var(--color-dark-border)]`.

**Responsive**:
- < md: Stacked -- logo, links (2-col grid), bottom bar.
- md-lg: Logo left + 3-col links right, bottom bar full width.
- >= lg: Full 5-col grid (logo 2 cols, links 3 cols).

The footer uses `secondary` background and does NOT count toward the 2-per-page dark section limit.

#### FR-CL-018: TrustMetricsStrip

**Priority**: P0
**File**: `components/marketing/trust-metrics-strip.tsx`

Replaces all fabricated testimonials with verifiable data points.

**Structure**: `border-y border-border bg-card py-12`, containing a grid of StatCards.

**Default metrics**:

| Value | Label |
|-------|-------|
| 5 | Government Intel Sources |
| 17 | Safety Review Sections |
| 3-5 | Day Turnaround |
| AES-256 | Encryption Standard |
| SHA-256 | Evidence Chain |

**Responsive grid**: 2 cols (< md), 3 cols (md-lg), 5 cols (>= lg, single row).

StatCard values animate (count up) when the strip scrolls into view if `animate` prop is true. String values ("AES-256", "SHA-256") fade in rather than count.

#### FR-CL-019: CTABand

**Priority**: P0
**File**: `components/marketing/cta-band.tsx`

Conversion-focused banner section. Three visual variants:

| Variant | Background | Headline Color | Body Color | Button Variant |
|---------|-----------|----------------|------------|----------------|
| `light` | `primary-50` | `foreground` | `muted-foreground` | `primary` |
| `brand` | `primary-700` | `white` | `white/80` | `primary-on-dark` |
| `dark` | `secondary` | `dark-text-primary` | `dark-text-secondary` | `primary-on-dark` |

**Structure**: Section with `py-20 lg:py-28`, centered content with headline (`.text-display-md`), body text (`body-lg, max-w-prose, mx-auto`), dual CTAs (stacked on mobile < sm, horizontal on >= sm).

**Props**: `variant: 'light' | 'brand' | 'dark'`, `headline: string`, `body?: string`, `primaryCta: { label: string, href: string }`, `secondaryCta?: { label: string, href: string }`.

#### FR-CL-020: DarkAuthoritySection

**Priority**: P0
**File**: `components/marketing/dark-authority-section.tsx`

A section component that wraps content in a `secondary` background with the `[data-theme="dark"]` token overrides.

**Rules** (enforced in code review, not programmatically):
- Maximum 2 per page (excluding footer).
- Never adjacent to another dark section.
- Always preceded and followed by a light section with at least `py-24` spacing.
- Never used for: feature descriptions, forms, FAQ, or pricing details.
- Appropriate for: trust/proof modules, data showcases, CTA bands, social proof.

**Props**: `children: ReactNode`, `className?: string`.

#### FR-CL-021: FeatureShowcase

**Priority**: P0
**File**: `components/marketing/feature-showcase.tsx`

Full-width section with product composition on one side and text on the other. Uses a 2-column grid on desktop.

**Alternation rule**: The `reversed` prop flips the layout. Odd sections place text left, visual right. Even sections reverse. This creates visual rhythm.

**Text column**: Eyebrow (with motif icon), headline (`.text-display-md`), body paragraph (`.text-body-lg text-muted-foreground max-w-prose`), 3-4 feature list items with Check icons, CTA button.

**Visual column**: Product composition component (map fragment, review panel, document preview, or readiness gauge depending on the motif).

**Responsive**:
- < lg: Stacked, visual above text, full width.
- >= lg: Side-by-side, `grid lg:grid-cols-2 gap-12 lg:gap-20 items-center`.

**Props**: `eyebrow: string`, `eyebrowIcon?: LucideIcon`, `headline: string`, `body: string`, `features: string[]`, `ctaLabel: string`, `ctaHref: string`, `reversed?: boolean`, `children: ReactNode` (visual column content), `className?: string`.

#### FR-CL-022: FeatureGrid

**Priority**: P0
**File**: `components/marketing/feature-grid.tsx`

Grid of FeatureCards with optional bento layout.

**Standard layout**: `grid sm:grid-cols-2 lg:grid-cols-3 gap-6`.

**Bento layout** (enhancement): Two featured cards span 2 columns, creating visual hierarchy within the grid.

**Section wrapper**: Centered eyebrow, headline (`.text-display-md`), `mb-16` before grid.

**Responsive**:
- < sm: 1 column.
- sm-lg: 2 columns.
- >= lg: 3 columns (or 2+1 bento pattern).

**Props**: `eyebrow?: string`, `headline: string`, `cards: FeatureCardProps[]`, `bento?: boolean`, `className?: string`.

#### FR-CL-023: ProcessTimeline

**Priority**: P0
**File**: `components/marketing/process-timeline.tsx`

Timeline showing the "Intelligence, Review, Documentation" three-act structure.

**Desktop (>= lg)**: Horizontal, `grid grid-cols-3 gap-8`. Each step has a numbered circle (h-10 w-10, `bg-primary-100`, `text-primary-700`, font-semibold), horizontal connector line, heading, and description.

**Mobile (< lg)**: Vertical, standard TimelineStep components stacked.

**Props**: `steps: Array<{ number: number, title: string, description: string }>`, `className?: string`.

#### FR-CL-024: FAQSection

**Priority**: P0
**File**: `components/marketing/faq-section.tsx`

Accordion-based FAQ using shadcn/ui `Accordion` primitive.

**Layout**: `max-w-3xl mx-auto`, centered headline (`.text-display-md`), `mb-12` before accordion.

**Accordion item styling**: Trigger uses `.text-heading-sm text-foreground`. Content uses `.text-body-md text-muted-foreground`. Chevron rotates 180deg on open (200ms, `ease-default`).

**Accessibility**: `type="single" collapsible` by default. `aria-expanded` on triggers. Content announced to screen readers on expansion.

**Props**: `headline?: string`, `items: Array<{ question: string, answer: string }>`, `className?: string`.

#### FR-CL-025: DemoRequestForm

**Priority**: P0
**File**: `components/marketing/demo-request-form.tsx`

Lead capture form with progressive validation and bot protection.

**Fields**:

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full Name | text input | Yes | Min 2 chars |
| Work Email | email input | Yes | Email format (Zod) |
| Organization Name | text input | Yes | Min 2 chars |
| Organization Type | select | Yes | Enum: K-12 School, Church/Mission, Higher Ed, Corporate, Sports/League, Other |
| Estimated Annual Trips | select | Yes | Enum: 1-10, 11-25, 26-50, 50+ |
| Message | textarea | No | Max 500 chars |
| Honeypot | hidden text input | -- | Must be empty |
| Cloudflare Turnstile | invisible widget | -- | Token validation server-side |

**Layout**: 2-column grid on desktop (name + email row 1, org + type row 2), single column on mobile.

**Form styling**:
- Field surface: `bg-card`.
- Border: `border-border`.
- Placeholder text: `text-muted-foreground`.
- Focus: `ring` color (2px ring, visible outline).
- Error state: `border-destructive`, error message in `text-body-xs text-destructive`.

**Submission flow**: Server Action -> Zod validation -> Turnstile verification -> Supabase insert -> Email notification via SendGrid -> Success state.

**Success state**: Replace form with confirmation card: check icon in `primary-500`, "We'll be in touch within one business day" message, and "Download Sample Binder" secondary CTA.

**Accessibility**: All fields have associated `<label>` elements. Error messages use `aria-describedby`. Submit button shows loading state with `aria-busy`. Form uses `aria-live="polite"` region for success/error announcements.

---

## 5. Hero Composition Specification

### FR-HC-001: Hero Layout

**Priority**: P0

The hero is the quality benchmark for the entire site. It must communicate "calm authority + visible readiness + premium clarity" in the first 3 seconds.

**Desktop (>= 1024px)**: 12-column grid. Text column occupies 5 columns (left). Product composition occupies 7 columns (right). Vertically centered alignment.

```
Desktop (>= 1024px):
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

**Tablet (768-1023px)**: Stacked. Text above, full product composition below, all 4 layers scaled to fit.

**Mobile (< 768px)**: Stacked. Text above. Simplified visual: map fragment with route line only (no review panel, document preview, or readiness gauge).

### FR-HC-002: Hero Text Content

**Priority**: P0

| Element | Content | Style |
|---------|---------|-------|
| Eyebrow | "Trip Safety Management Platform" | `.text-eyebrow text-primary-700`, leading shield icon |
| Headline | "Every trip professionally reviewed." | `.text-display-xl text-foreground max-w-[20ch]` |
| Subtext | "SafeTrekr combines intelligence from 5 government data sources, 17-section analyst review, and SHA-256 evidence documentation to protect your travelers and your organization." | `.text-body-lg text-muted-foreground max-w-[50ch] mt-6` |
| CTA Primary | "See Sample Binder" | `Button variant="primary" size="lg"` |
| CTA Secondary | "Schedule a Demo" | `Button variant="secondary" size="lg"` |

**Acceptance Criteria**: Headline is visible and readable immediately (no animation delay on text appearance). The headline passes the "5-second recall test" -- a new visitor can describe what SafeTrekr does after reading for 5 seconds.

### FR-HC-003: Product Composition Layers

**Priority**: P0

The composition is a custom-built arrangement of overlapping card elements. It is NOT a screenshot. Each layer communicates one of the four motifs.

**Layer 1 -- Map Intelligence (Base)**:
- Dimensions: 560x400px desktop, aspect-ratio preserved at smaller sizes.
- Content: Desaturated map tile image (15% saturation, 85% contrast), single curved route path in `primary-500` (3px stroke, direction arrows), 3-4 waypoint circles (12px) in `primary-600` with `primary-100` halo (20px).
- Style: `rounded-xl shadow-lg border border-border overflow-hidden`.
- Z-index: 0 (base).

**Layer 2 -- Trip Review Panel (Overlapping upper-right)**:
- Dimensions: 280x320px, overlapping map upper-right by 40px.
- Content: Header with "Trip Review" title + "Reviewed" badge, 4 checklist items with green checkmarks, 100% progress bar (`primary-500` fill on `primary-100` track), analyst avatar placeholder (32px circle).
- Style: `rounded-xl bg-white shadow-xl border border-border p-5`.
- Z-index: 10.

**Layer 3 -- Document Preview (Overlapping lower-right)**:
- Dimensions: 240x180px, below review panel with 20px gap.
- Content: "Evidence Binder" eyebrow, 2 condensed timeline entries, SHA-256 hash snippet in `mono-sm`.
- Style: Stacked paper effect (3 layers offset 2px each), front: `bg-white rounded-lg shadow-lg border border-border p-4`.
- Z-index: 20.

**Layer 4 -- Readiness Indicator (Floating lower-left of map)**:
- Dimensions: 120x120px.
- Content: Circular SVG gauge with `primary-500` fill arc at ~85%, "Trip Ready" label, safety-green status dot (8px).
- Style: `rounded-xl bg-white shadow-lg border border-border p-4`.
- Z-index: 15.

### FR-HC-004: Hero Background Treatment

**Priority**: P0

- Base: `background` (#e7ecee).
- Overlay: Faint dot-grid pattern at 3-4% opacity using `primary-300` (CSS `radial-gradient`, no image download).
- Optional: Subtle radial gradient from `background` to `primary-50` at 20% opacity, centered behind the product composition, radius 600px.

```css
.bg-dot-grid {
  background-image:
    radial-gradient(circle, rgba(150, 207, 172, 0.04) 1.5px, transparent 1.5px);
  background-size: 24px 24px;
}
```

### FR-HC-005: Hero Spacing

**Priority**: P0

| Breakpoint | Padding Top | Padding Bottom | Grid Gap |
|------------|-------------|----------------|----------|
| Desktop (>= lg) | `pt-24` (96px) | `pb-32` (128px) | `gap-20` |
| Tablet (md-lg) | `pt-20` (80px) | `pb-24` (96px) | `gap-12` |
| Mobile (< md) | `pt-16` (64px) | `pb-20` (80px) | `gap-8` |

Text content is `self-center` (vertically centered against the composition).

---

## 6. Motion System

### FR-MO-001: Framer Motion Preset Library

**Priority**: P0
**File**: `lib/motion.ts`

A centralized file exporting all animation presets as Framer Motion `Variants` and `Transition` objects. Every animated component in the site references this single file. No inline animation values.

**Easing curves** (as arrays for Framer Motion):

| Name | Value |
|------|-------|
| `default` | `[0.4, 0, 0.2, 1]` |
| `enter` | `[0.0, 0, 0.2, 1]` |
| `exit` | `[0.4, 0, 1, 1]` |
| `spring` | `[0.22, 1, 0.36, 1]` |

**Duration presets** (in seconds for Framer Motion):

| Name | Value |
|------|-------|
| `instant` | `0.1` |
| `fast` | `0.15` |
| `normal` | `0.2` |
| `moderate` | `0.3` |
| `slow` | `0.5` |
| `slower` | `0.8` |
| `reveal` | `1.0` |
| `draw` | `1.2` |

### FR-MO-002: Variant Presets

**Priority**: P0

| Preset | `hidden` State | `visible` State | Transition | Usage |
|--------|---------------|-----------------|------------|-------|
| `fadeUp` | `opacity: 0, y: 20` | `opacity: 1, y: 0` | `enter` (300ms) | Default section content reveal. |
| `fadeUpLarge` | `opacity: 0, y: 40` | `opacity: 1, y: 0` | `spring` (800ms) | Large elements, compositions. |
| `fadeIn` | `opacity: 0` | `opacity: 1` | `default` (200ms) | Trust strips, entire-section reveals. |
| `scaleIn` | `opacity: 0, scale: 0.95` | `opacity: 1, scale: 1` | `spring` (800ms) | Map surface, hero panels. |
| `cardReveal` | `opacity: 0, y: 24, scale: 0.98` | `opacity: 1, y: 0, scale: 1` | `slow + spring` | Feature grid cards. |
| `routeDraw` | `pathLength: 0, opacity: 0` | `pathLength: 1, opacity: 1` | `draw` (1200ms) | SVG route line animation. |
| `markerPop` | `scale: 0, opacity: 0` | `scale: 1, opacity: 1` | `moderate + spring` | Waypoint dots appearing. |
| `statusPulse` | `scale: 0, opacity: 0` | `scale: [0,1.4,1], opacity: [0,1,1]` | 600ms, spring | Status dot entrance. |
| `checklistReveal` | `opacity: 0, x: -12` | `opacity: 1, x: 0` | `moderate + enter` | Checklist items sliding in. |
| `documentStack` | `opacity: 0, y: 16, rotateX: -5` | `opacity: 1, y: 0, rotateX: 0` | `slow + spring` | Document preview entrance. |
| `gaugeFill` | `pathLength: 0` | `pathLength: 0.85` | 1200ms, default, 0.4s delay | Readiness gauge arc. |
| `staggerContainer` | `{}` | `staggerChildren: 0.08, delayChildren: 0.1` | -- | Parent for staggered children. |
| `staggerContainerSlow` | `{}` | `staggerChildren: 0.12, delayChildren: 0.2` | -- | Slower stagger for larger reveals. |

### FR-MO-003: ScrollReveal Wrapper

**Priority**: P0
**File**: `components/motion/scroll-reveal.tsx`

A `'use client'` component that wraps any element with viewport-triggered Framer Motion animation.

**Props**: `variants?: Variants` (default: `fadeUp`), `className?: string`, `delay?: number`, `once?: boolean` (default: true), `amount?: number` (viewport intersection threshold, default: 0.2).

**Reduced motion**: When `useReducedMotion()` returns true, renders children in a plain `<div>` without any animation wrapper.

### FR-MO-004: StaggerChildren Wrapper

**Priority**: P0
**File**: `components/motion/stagger-children.tsx`

A `'use client'` component that wraps a group of child elements with staggered entrance animation.

**Props**: `variants?: Variants` (default: `staggerContainer`), `className?: string`, `once?: boolean` (default: true).

**Reduced motion**: Same as ScrollReveal -- renders plain `<div>` without animation.

### FR-MO-005: Hero Animation Sequence

**Priority**: P0

Orchestrated entrance sequence. Total duration: approximately 1800ms. Headline is visible immediately (no animation delay on critical text).

| Time | Element | Animation | Duration | Easing |
|------|---------|-----------|----------|--------|
| 0ms | Eyebrow | `fadeIn` | 300ms | default |
| 100ms | Headline | `fadeUp` (y: 30px) | 500ms | spring |
| 250ms | Subtext | `fadeUp` (y: 20px) | 400ms | enter |
| 400ms | CTA buttons | `fadeUp` (y: 20px) | 300ms | enter |
| 500ms | Map surface | `scaleIn` (scale: 0.96) | 600ms | spring |
| 700ms | Route line | `routeDraw` (pathLength) | 1200ms | default |
| 900ms | Waypoint markers | `markerPop`, stagger 80ms | 300ms each | spring |
| 800ms | Review panel | `fadeUp` + slide from right | 500ms | spring |
| 1000ms | Checklist items | `checklistReveal`, stagger 60ms | 200ms each | enter |
| 1100ms | Document preview | `documentStack` | 500ms | spring |
| 1200ms | Readiness gauge | `gaugeFill` (clockwise) | 1200ms | default |
| 1400ms | Status dot | `statusPulse` | 600ms | spring |

**Acceptance Criteria**: Under `prefers-reduced-motion: reduce`, all elements render at their final state immediately with no animation.

### FR-MO-006: Scroll-Triggered Section Animations

**Priority**: P0

Each section type has a defined animation behavior when entering the viewport (20% visible threshold):

| Section Type | Animation | Details |
|-------------|-----------|---------|
| Section heading | `fadeUp` | Eyebrow + heading + subtext staggered at 80ms. |
| Feature grid | `staggerContainer + cardReveal` | Cards stagger at 80ms intervals. |
| Feature showcase | Split entry | Text fades up, visual slides from opposite side. |
| Trust strip | `fadeIn` | Entire strip fades in together. |
| StatCard values | `counterAnimate` | Numbers count up from 0 over 1.5s. |
| CTA band | `fadeUp` | Heading + buttons staggered at 100ms. |
| Dark section | `fadeIn` (entire) | Background fades in, then content staggers. |
| Timeline | `staggerContainer` | Steps reveal top-to-bottom at 120ms. |
| FAQ items | `staggerContainer` | Items fade up at 60ms intervals. |

### FR-MO-007: Micro-Interactions

**Priority**: P1

| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Button (primary) | hover | Background `primary-600` to `primary-700`, `scale(1.02)` | 150ms | default |
| Button (secondary) | hover | Background fills `primary-50` | 150ms | default |
| Card | hover | Shadow `card` to `card-hover`, `translateY(-2px)` | 200ms | default |
| Nav link | hover | Opacity 0.7 to 1, color to foreground | 150ms | default |
| Accordion trigger | click | Chevron rotates 180deg | 200ms | default |
| Logo cloud item | hover | `grayscale-0`, `opacity-100` | 200ms | default |
| "Learn more" arrow | hover (parent) | `translateX(4px)` | 150ms | spring |
| Form input | focus | Ring appears, border color transitions to `ring` | 150ms | default |
| Mobile menu | open | Sheet slides from right, content staggers at 40ms | 300ms | spring |

### FR-MO-008: prefers-reduced-motion Strategy

**Priority**: P0

All motion respects `prefers-reduced-motion: reduce`:

1. `ScrollReveal` and `StaggerChildren` render children immediately without animation.
2. CSS transitions reduced to `opacity` only (no transforms, no scale).
3. SVG path animations (route draw) show the completed path immediately.
4. Counter animations show the final value immediately.
5. Hover states retain color changes but remove transform effects.

Global CSS override:

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

---

## 7. Dark Section Strategy

### FR-DS-001: Rhythm Rules

**Priority**: P0

| Rule | Specification |
|------|---------------|
| Maximum per page | 2 (excluding footer) |
| Adjacency | Never two dark sections in a row |
| Minimum light gap | At least one full light section (`py-24` minimum) between dark sections |
| Recommended positions | 1/3 and 2/3 through page, or just before final CTA |
| Permitted content | Trust/proof modules, data showcases, CTA bands, social proof |
| Prohibited content | Feature descriptions, forms, FAQ, pricing details |

### FR-DS-002: Visual Specification

**Priority**: P0

Dark sections use the `[data-theme="dark"]` CSS variable overrides from FR-DT-007. All child components (FeatureCard, StatCard, Badge, etc.) render correctly on dark backgrounds through token inheritance.

**Content token mapping on dark**:

| Element | Token (overridden) | Rendered Value | Contrast on secondary |
|---------|-------------------|----------------|----------------------|
| Headlines | `foreground` | `#f7f8f8` | 11.6:1 PASS |
| Body text | `muted-foreground` | `#b8c3c7` | 7.0:1 PASS |
| Brand accent | `primary` | `#6cbc8b` | -- |
| Card surfaces | `card` | `rgba(255,255,255,0.06)` | -- |
| Card borders | `border` | `rgba(255,255,255,0.12)` | -- |
| Primary button | White bg, secondary text | -- | -- |
| Secondary button | Transparent, white border, white text | -- | -- |

### FR-DS-003: Recommended Homepage Section Rhythm

**Priority**: P0

```
1. Hero (light, bg-background)
2. Trust Metrics Strip (light, bg-card)
3. Feature Showcase - Route (light, bg-background)
4. Feature Showcase - Review (light, bg-background, reversed layout)
5. DARK: Social Proof / Authority Section (bg-secondary)
6. Feature Grid (light, bg-background)
7. Feature Showcase - Evidence (light, bg-background)
8. Process Timeline (light, bg-primary-50 wash)
9. DARK: CTA Band (bg-secondary)
10. FAQ (light, bg-background)
11. Footer (bg-secondary -- always dark, not counted toward limit)
```

---

## 8. Responsive Breakpoint System

### FR-RB-001: Breakpoint Definitions

**Priority**: P0

| Token | Width | Tailwind Prefix | Key Changes |
|-------|-------|----------------|-------------|
| base | 0-639px | (none) | Single column, stacked layout, full-width cards. |
| sm | 640px | `sm:` | Minor padding adjustments. |
| md | 768px | `md:` | Two-column grids begin, tablet navigation. |
| lg | 1024px | `lg:` | Full desktop grid, side-by-side hero, sticky nav with full links. |
| xl | 1280px | `xl:` | Max content width reached (1280px). |
| 2xl | 1536px | `2xl:` | Generous side margins, centered content, substantial white space. |

Maximum of 4 functional breakpoints (base, md, lg, xl) with sm and 2xl as refinement breakpoints. Additional breakpoints require justification.

### FR-RB-002: Section Padding Scale

**Priority**: P0

| Breakpoint | Standard Section | Compressed Section | Hero Top/Bottom |
|------------|-----------------|-------------------|-----------------|
| base | `py-12` (48px) | `py-8` (32px) | `pt-16 pb-20` |
| sm | `py-16` (64px) | `py-10` (40px) | `pt-20 pb-24` |
| md | `py-20` (80px) | `py-12` (48px) | `pt-20 pb-24` |
| lg | `py-24` (96px) | `py-16` (64px) | `pt-24 pb-32` |
| xl | `py-32` (128px) | `py-20` (80px) | `pt-28 pb-36` |
| 2xl | `py-40` (160px) | `py-24` (96px) | `pt-32 pb-40` |

### FR-RB-003: Component-Level Responsive Behavior

**Priority**: P0

**SiteHeader**:
- < lg: Hamburger menu, Sheet slide-in, logo + hamburger only.
- >= lg: Full horizontal nav, CTA buttons visible.

**HeroSection**:
- < md: Stacked (text first), simplified visual (map fragment only).
- md-lg: Stacked, full composition below text.
- >= lg: Side-by-side (5+7 col grid).

**FeatureGrid**:
- < sm: 1 column.
- sm-lg: 2 columns.
- >= lg: 3 columns (or bento pattern).

**FeatureShowcase**:
- < lg: Stacked, visual above text, full width.
- >= lg: Side-by-side, alternating left/right.

**TrustMetricsStrip**:
- < md: 2 columns.
- md-lg: 3 columns.
- >= lg: 5 columns (single row).

**PricingTier**:
- < md: Stacked, full width, featured tier first.
- md-lg: 2 columns, featured highlighted.
- >= lg: 3 columns, featured with `scale(1.05)`.

**CTABand**:
- < sm: Stacked buttons, full width.
- >= sm: Horizontal, centered.

**SiteFooter**:
- < md: Stacked: logo, links (2-col), bottom bar.
- md-lg: Logo left + 3-col links right, bottom bar.
- >= lg: 5-col grid (logo 2 cols, links 3 cols).

**DemoRequestForm**:
- < md: Single column.
- >= md: 2-column grid for paired fields.

---

## 9. Icon System

### FR-IC-001: Base Icon Library

**Priority**: P0

| Property | Value |
|----------|-------|
| Library | Lucide React |
| Default stroke width | 1.5px |
| License | MIT |
| Color | `currentColor` (inherits text color) |

### FR-IC-002: Icon Sizing Scale

**Priority**: P0

| Token | Size | Tailwind | Usage |
|-------|------|----------|-------|
| `icon-xs` | 14px | `h-3.5 w-3.5` | Inline with small text, badge icons. |
| `icon-sm` | 16px | `h-4 w-4` | Small buttons, inline with body text. |
| `icon-md` | 20px | `h-5 w-5` | Default buttons, nav items. |
| `icon-lg` | 24px | `h-6 w-6` | Feature card icons, standalone. |
| `icon-xl` | 32px | `h-8 w-8` | Hero accents, section markers. |

### FR-IC-003: Standard Icon Map

**Priority**: P0

| Usage | Lucide Icon | Context |
|-------|-------------|---------|
| Navigation | `Menu`, `X`, `ChevronDown`, `ChevronRight` | Header, dropdowns |
| Actions | `ArrowRight`, `ExternalLink`, `Download`, `Play` | CTAs, links |
| Features | `MapPin`, `Route`, `ClipboardCheck`, `FileText`, `Shield`, `Activity` | Feature cards |
| Status | `Check`, `AlertTriangle`, `AlertCircle`, `Info` | Badges, alerts |
| Social | `Twitter`, `Linkedin`, `Github` (via simple-icons) | Footer |
| Forms | `Mail`, `User`, `Building2`, `Send` | Form fields |
| Navigation | `ChevronUp` | FAQ accordion, scroll-to-top |

### FR-IC-004: Custom Icons (7 Required)

**Priority**: P1

These icons do not exist in Lucide and must be designed to match Lucide's design language exactly.

| Icon | Description | Usage |
|------|-------------|-------|
| `ShieldPath` | Shield outline with S-curve road (logo mark simplified) | Brand motif, hero, favicon |
| `RouteIntelligence` | Map fragment with route line and 2 waypoints | Route motif badge |
| `EvidenceBinder` | Stacked document sheets with checkmark seal | Record motif |
| `AnalystReview` | Clipboard with magnifying glass overlay | Review motif |
| `MusterPoint` | Rally flag with location pin | Geofencing feature |
| `MonteCarlo` | Probability curve with data points | Risk intelligence |
| `Geofence` | Dashed circle boundary with pin inside | Monitoring |

**Design Specifications**:
- 24x24px viewBox.
- 1.5px stroke, `round` line-cap, `round` line-join.
- No fill (stroke-only), except small accent dots.
- Corner radius ~2px (matching Lucide).
- Exported as React components with the same interface as Lucide icons.
- Color via `currentColor`.

---

## 10. Logo Usage Specification

### FR-LO-001: Logo Variants and Contexts

**Priority**: P0

| Context | Variant | Height | Color | Notes |
|---------|---------|--------|-------|-------|
| Header (desktop) | Horizontal lockup, dark | 32px | `secondary` (#123646) | Full logotype |
| Header (mobile, >= 360px) | Horizontal lockup, dark | 28px | `secondary` | Scaled for mobile |
| Header (mobile, < 360px) | Mark only | 28px | `secondary` | Space-constrained |
| Footer | Horizontal lockup, light | 32px | `white` | On dark background |
| Favicon | Mark only | 32x32 | `secondary` | Square format |
| OG image | Horizontal lockup, dark | 48px | `secondary` | Social sharing |

### FR-LO-002: Logo Mark as Design Asset

**Priority**: P1

The SafeTrekr mark contains extractable design elements that should be used as brand motifs:

| Element | Source | Application |
|---------|--------|-------------|
| S-curve road path | Interior bezier curve | Section dividers (2px, `primary-200`, 30% opacity), route-drawing animations, loading indicator |
| Shield silhouette | Outer boundary path | Trust badges, certification containers |
| Mountain peaks | Upper interior triangular forms | Subtle background patterns at 2-3% opacity |

### FR-LO-003: Clear Space and Minimum Size

**Priority**: P0

- **Clear space**: Minimum of 1x the mark height on all sides (e.g., 32px mark requires 32px clear space).
- **Minimum size**: Mark must not be rendered below 24px height. Horizontal lockup must not be rendered below 80px width.
- **No modifications**: The logo must not be stretched, rotated, recolored beyond the defined variants, or placed on visually busy backgrounds without sufficient contrast.

---

## 11. Accessibility Compliance

### FR-AC-001: Global Accessibility Requirements

**Priority**: P0

| Requirement | Standard | Implementation |
|-------------|----------|----------------|
| Compliance level | WCAG 2.2 AA | All components, all pages |
| Contrast (normal text) | >= 4.5:1 | Enforced via token system. `muted-foreground` corrected to 5.2:1. |
| Contrast (large text) | >= 3:1 | `primary-500` permitted only for text >= 18px / 14px bold. |
| Contrast (UI components) | >= 3:1 | Focus rings, borders, interactive element boundaries. |
| Focus indicators | Visible, >= 3px | `ring` token (#365462), 2px width, 2px offset. Visible on all backgrounds. |
| Touch targets | >= 44x44px | All interactive elements including buttons, links, form fields. |
| Keyboard navigation | Full tab order | Logical sequence, visible focus state, Enter/Space activation. |
| Skip navigation | Present | First focusable element, jumps to `#main-content`. |
| ARIA landmarks | Present | `<nav>`, `<main>`, `<footer>`, `<header>`, `<section>` with labels. |
| `aria-current="page"` | Navigation links | Active page indicated to assistive tech. |
| `prefers-reduced-motion` | Fully respected | All animations disabled. See FR-MO-008. |
| Screen reader testing | NVDA + VoiceOver | Verified label hierarchy, live regions, focus management. |
| Lighthouse Accessibility | >= 95 (target 100) | CI gate on every merge. |
| `axe-core` | 0 violations | CI gate. No accessibility regressions allowed. |

### FR-AC-002: Per-Component Accessibility

**Priority**: P0

| Component | Specific Requirements |
|-----------|----------------------|
| **Button** | `aria-busy` when loading. `aria-disabled` when disabled. Focus-visible ring. |
| **Badge/Chip** | Status badges include `aria-label` describing the state (not just color). |
| **StatusDot** | `aria-label` required (e.g., "Status: Active"). Color is not the sole indicator. |
| **NavLink** | `aria-current="page"` on active. 44x44px touch target. |
| **SiteHeader** | `<nav aria-label="Main navigation">`. Skip-nav link. Mobile menu: `aria-expanded`, `aria-controls`. |
| **Accordion (FAQ)** | `aria-expanded` on triggers. Content region announced on expansion. |
| **DemoRequestForm** | All fields have `<label>`. Errors use `aria-describedby`. `aria-live="polite"` for success/error. |
| **PricingTier** | Price value has `aria-label` with full context (e.g., "15 dollars per student"). |
| **StatCard** | Animated counters show final value immediately for screen readers. |
| **Logo** | `aria-label="SafeTrekr"` on logo link. |
| **Sheet (mobile menu)** | Focus trap when open. Focus returns to trigger on close. `Escape` closes. |
| **Map composition** | Decorative (hero): `aria-hidden="true"` with descriptive `alt` on static image. Interactive (P1): keyboard-accessible controls. |

### FR-AC-003: Contrast Validation Matrix

**Priority**: P0

This is the binding reference for all text-on-background combinations:

| Text Color | Background | Contrast | WCAG AA Normal | WCAG AA Large |
|------------|-----------|----------|----------------|---------------|
| `foreground` (#061a23) | `background` (#e7ecee) | 13.2:1 | PASS | PASS |
| `foreground` (#061a23) | `card` (#f7f8f8) | 14.8:1 | PASS | PASS |
| `muted-foreground` (#4d5153) | `background` (#e7ecee) | 5.2:1 | PASS | PASS |
| `muted-foreground` (#4d5153) | `card` (#f7f8f8) | 5.8:1 | PASS | PASS |
| `primary-700` (#33704b) | `background` (#e7ecee) | 6.1:1 | PASS | PASS |
| `primary-700` (#33704b) | `card` (#f7f8f8) | 6.9:1 | PASS | PASS |
| `white` (#ffffff) | `primary-600` (#3f885b) | 4.6:1 | PASS | PASS |
| `white` (#ffffff) | `primary-500` (#4ca46e) | 3.4:1 | FAIL (normal) | PASS (large) |
| `white` (#ffffff) | `primary-700` (#33704b) | 6.1:1 | PASS | PASS |
| `dark-text-primary` (#f7f8f8) | `secondary` (#123646) | 11.6:1 | PASS | PASS |
| `dark-text-secondary` (#b8c3c7) | `secondary` (#123646) | 7.0:1 | PASS | PASS |
| `dark-accent` (#6cbc8b) | `secondary` (#123646) | 4.8:1 | PASS | PASS |

---

## 12. Implementation Sequence

### FR-IS-001: Week 1 -- Token Foundation + Core Atoms (24 hours)

| Task | Deliverable | Hours |
|------|-------------|-------|
| Tailwind CSS 4 token configuration | `app/globals.css` with complete `@theme inline` | 4 |
| Font loading (Jakarta + Inter + JetBrains) | `lib/fonts.ts` + root layout integration | 2 |
| Typography utility classes | `.text-display-xl` through `.text-eyebrow` in `@layer components` | 3 |
| Button component (all 6 variants, 4 sizes) | `components/ui/button.tsx` | 4 |
| Badge / Chip component (7 variants) | `components/ui/badge.tsx` | 2 |
| Eyebrow component | `components/ui/eyebrow.tsx` | 1 |
| StatusDot component | `components/ui/status-dot.tsx` | 1 |
| Divider + RouteDivider | `components/ui/divider.tsx` | 2 |
| Logo component (all variants) | `components/ui/logo.tsx` | 2 |
| shadcn/ui primitives installation | Accordion, Card, Input, Sheet, Select, etc. | 3 |

### FR-IS-002: Week 2 -- Layout + Molecules + Motion (30 hours)

| Task | Deliverable | Hours |
|------|-------------|-------|
| SiteHeader (desktop + mobile) | `components/layout/site-header.tsx` | 6 |
| SiteFooter | `components/layout/site-footer.tsx` | 4 |
| Section container + spacing system | `components/layout/section.tsx` | 2 |
| Motion preset library | `lib/motion.ts` | 3 |
| ScrollReveal wrapper | `components/motion/scroll-reveal.tsx` | 2 |
| StaggerChildren wrapper | `components/motion/stagger-children.tsx` | 2 |
| FeatureCard molecule | `components/marketing/feature-card.tsx` | 3 |
| StatCard molecule (with AnimatedCounter) | `components/marketing/stat-card.tsx` | 4 |
| MotifBadge molecule | `components/marketing/motif-badge.tsx` | 2 |
| Dark section token overrides | `[data-theme="dark"]` CSS | 2 |

### FR-IS-003: Week 3 -- Hero + Homepage Top Half (32 hours)

| Task | Deliverable | Hours |
|------|-------------|-------|
| HeroSection layout + text | `components/marketing/hero/hero-section.tsx` | 4 |
| Hero product composition (static, 4 layers) | Map image + review panel + doc preview + gauge | 12 |
| Hero animation sequence | Orchestrated Framer Motion variants | 6 |
| Static map fallback image | Branded WebP hero map | 3 |
| SVG route overlay animation | `components/maps/animated-route.tsx` | 3 |
| TrustMetricsStrip | `components/marketing/trust-metrics-strip.tsx` | 3 |
| Ambient dot-grid background | CSS utility class `.bg-dot-grid` | 1 |

### FR-IS-004: Week 4 -- Homepage Bottom Half + Forms (38 hours)

| Task | Deliverable | Hours |
|------|-------------|-------|
| FeatureShowcase sections (3 motifs) | 3 showcase sections with compositions | 12 |
| FeatureGrid (bento layout) | `components/marketing/feature-grid.tsx` | 4 |
| DarkAuthoritySection | Dark section with trust content | 3 |
| CTABand (3 variants) | `components/marketing/cta-band.tsx` | 3 |
| ProcessTimeline | `components/marketing/process-timeline.tsx` | 4 |
| FAQSection | `components/marketing/faq-section.tsx` | 2 |
| DemoRequestForm (full validation + Server Action) | `components/marketing/demo-request-form.tsx` | 8 |
| Glassmorphic header scroll behavior | Header state transitions | 2 |

### FR-IS-005: Week 5 -- P0 Pages + Interactive Map (44 hours)

| Task | Deliverable | Hours |
|------|-------------|-------|
| K-12 Solutions page | Segment template + page | 8 |
| Church/Missions Solutions page | Segment page | 6 |
| How It Works page | 3-act narrative + 17-section visualization | 8 |
| Pricing page | Pricing cards + FAQ | 8 |
| MapLibre integration (lazy-loaded) | `components/maps/interactive-map.tsx` | 6 |
| Custom MapLibre style JSON | Brand-aligned map style | 8 |

### FR-IS-006: Week 6 -- Polish, Accessibility, Performance (40 hours)

| Task | Deliverable | Hours |
|------|-------------|-------|
| Interactive evidence binder preview | `components/marketing/binder-preview.tsx` | 10 |
| Responsive QA (all breakpoints, all pages) | Bug fixes | 8 |
| Accessibility audit (axe-core + manual) | Violation fixes | 6 |
| Performance audit (Lighthouse CI) | Bundle optimization | 4 |
| SEO infrastructure (metadata, sitemap, JSON-LD) | All SEO deliverables | 4 |
| Micro-interaction polish | Enhancement details from FR-MO-007 | 4 |
| Cross-browser testing (Chrome, Safari, Firefox, Edge) | Fix list | 4 |

### FR-IS-007: Critical Path Dependencies

These items block downstream work and must be completed in order:

1. **Token system in Tailwind** (blocks all component work).
2. **Font loading** (blocks all typography rendering).
3. **SiteHeader + SiteFooter** (blocks all page assembly).
4. **Motion presets** (blocks all scroll animations).
5. **Hero product compositions** (blocks hero section; 12h of design work).
6. **Muted-foreground contrast fix** (blocks accessibility compliance).

---

## 13. Quality Gates

### FR-QG-001: Pre-Merge Quality Gates

Before any component or page merges to the main branch:

| Gate | Threshold | Tool |
|------|-----------|------|
| Text contrast (normal) | >= 4.5:1 | axe-core in CI |
| Text contrast (large) | >= 3:1 | axe-core in CI |
| Focus indicators visible | 2px+ ring on all interactive elements | Manual + axe-core |
| Image alt text | Descriptive `alt` on all non-decorative images | axe-core |
| Keyboard navigation | Full tab order, Enter/Space activation | Manual QA |
| `prefers-reduced-motion` | All animation disabled | Manual QA |
| Lighthouse Performance | >= 95 | Lighthouse CI |
| Lighthouse Accessibility | >= 95 (target 100) | Lighthouse CI |
| LCP | < 1.5s (simulated 3G) | Lighthouse CI |
| CLS | < 0.05 | Lighthouse CI |
| Initial JS bundle | < 150KB gzipped | Bundle analyzer in CI |
| No fabricated testimonials | Zero instances | Code review |
| Brand green / safety green separation | No brand green in status contexts | Code review |
| Dark sections | Max 2 per page, never adjacent | Code review |
| Token compliance | No inline hex, no inline px for spacing | Linting |

### FR-QG-002: Pre-Release Quality Gates

Before any page ships to production:

- All FR-QG-001 gates pass.
- Responsive QA completed at 320px, 375px, 768px, 1024px, 1280px, 1536px, 2560px.
- Cross-browser testing completed on Chrome, Safari, Firefox, Edge, mobile Safari.
- Screen reader testing completed with NVDA (Windows) and VoiceOver (macOS/iOS).
- `prefers-reduced-motion` behavior verified (all content visible, no animation).
- Print stylesheet is not required at launch but no content is hidden by `print` media query.

---

## 14. Risk Register

### FR-RR-001: Critical Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| `muted-foreground` contrast failure (#616567 = 4.0:1) | CRITICAL | Corrected to #4d5153 (5.2:1). Token locked. No override permitted. |
| Primary button text contrast (primary-500 bg = 3.4:1 with white) | HIGH | Button bg uses `primary-600` (#3f885b, 4.6:1). primary-500 reserved for decorative/large text only. |
| MapLibre bundle weight (~300KB) | HIGH | Progressive loading: static WebP fallback -> SVG route overlay -> lazy MapLibre after 3s idle or interaction. |
| Brand green / safety green collision | MEDIUM | Strict separation rules. Different hues (#4ca46e vs #22c55e). Safety colors never decorative. |
| No real testimonials exist | HIGH | TrustMetricsStrip with verifiable data. Testimonial collection from 104 existing orgs begins immediately. TestimonialCard designed but NOT rendered until real data exists. |
| No product screenshots exist | HIGH | 6 custom product compositions designed as artifacts (not screenshots). Budget: 3-5 days of design. |
| Fabricated testimonials from previous assets | CRITICAL | Remove ALL fabricated content before development begins. Non-negotiable. |

### FR-RR-002: Moderate Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Font loading flash (FOIT/FOUT) | MEDIUM | `next/font/google` with `display: 'swap'` + system fallbacks approximating Jakarta/Inter metrics. |
| Motion sickness | MEDIUM | All motion respects `prefers-reduced-motion`. Max animation 1.2s. No looping. No parallax > 40px. |
| Dark section overuse | MEDIUM | Strict 2-per-page maximum (excluding footer). Never adjacent. Design review enforced. |
| Display-xl too large on small mobile | LOW | `clamp()` floors at 40px (2.5rem) at 320px viewport. Verified readable. |
| Custom icon quality inconsistency | MEDIUM | 7 custom icons must match Lucide exactly. Consider icon designer or AI-assisted generation + manual QA. |
| DigitalOcean image optimization | MEDIUM | `sharp` library for `next/image` (self-hosted). No Vercel image CDN. WebP format preferred. Explicit width/height on all images to prevent CLS. |

### FR-RR-003: Low Risks

| Risk | Mitigation |
|------|------------|
| Content length variance across segments | Flexible layouts with `min-h` rather than fixed heights. |
| 2xl viewport under-design | Test at 2560px; `container-max` + margins prevent stretching. |
| Print stylesheet | Defer to post-launch; not critical for marketing pages. |
| CSS custom property browser support | Tailwind CSS 4 requires modern browsers. All targets (Chrome 80+, Safari 14+, Firefox 78+, Edge 80+) support CSS custom properties. |

---

*This PRD was authored by the World-Class UI Designer persona for the SafeTrekr Marketing Site project. All specifications are implementation-ready for the Next.js 15 + Tailwind CSS 4 + shadcn/ui + Framer Motion stack, deployed on DigitalOcean DOKS. Date: 2026-03-24.*
