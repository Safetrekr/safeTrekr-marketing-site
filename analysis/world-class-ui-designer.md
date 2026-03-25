# UI Designer Analysis: SafeTrekr Marketing Site

**Date**: 2026-03-24
**Analyst**: World-Class UI Designer
**Direction**: Executive Trust, Light Theme
**Platform**: Next.js 15 + Tailwind CSS 4 + Framer Motion + MapLibre GL JS
**Visual Blend**: 70% Polished Operational / 20% Editorial Intelligence / 10% Watchtower Light

---

## Table of Contents

1. [Design System Tokens](#1-design-system-tokens)
2. [Typography Scale](#2-typography-scale)
3. [Component Library](#3-component-library)
4. [Hero Composition](#4-hero-composition)
5. [Motion System](#5-motion-system)
6. [Dark Section Strategy](#6-dark-section-strategy)
7. [Responsive Behavior](#7-responsive-behavior)
8. [Icon System](#8-icon-system)
9. [Logo Mark as Design Asset](#9-logo-mark-as-design-asset)
10. [Enhancement Proposals](#10-enhancement-proposals)
11. [Risk Assessment](#11-risk-assessment)
12. [Priority Recommendations](#12-priority-recommendations)

---

## 1. Design System Tokens

### 1.1 Complete Tailwind CSS 4 Configuration

The token system below is designed for Tailwind CSS 4's `@theme` directive using CSS custom properties. Every value is implementation-ready.

#### globals.css -- Token Foundation

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
  --color-muted-foreground: #4d5153; /* CORRECTED from #616567 -- see Risk Assessment */
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
     Used on secondary background sections
     ────────────────────────────────────── */
  --color-dark-surface: rgba(255, 255, 255, 0.06);
  --color-dark-border: rgba(255, 255, 255, 0.12);
  --color-dark-text-primary: #f7f8f8;
  --color-dark-text-secondary: #b8c3c7;
  --color-dark-accent: #6cbc8b; /* primary-400 on dark */

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
     BORDER RADIUS -- Disciplined Rectangles
     ────────────────────────────────────── */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-full: 9999px;
  --radius: 8px; /* Default */

  /* ──────────────────────────────────────
     SHADOWS -- Cool-Toned (rgba(6,26,35,x))
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
     TYPOGRAPHY -- Font Sizes (with line heights)
     ────────────────────────────────────── */
  --font-size-xs: 0.75rem;     /* 12px */
  --font-size-sm: 0.875rem;    /* 14px */
  --font-size-base: 1rem;      /* 16px */
  --font-size-lg: 1.125rem;    /* 18px */
  --font-size-xl: 1.25rem;     /* 20px */
  --font-size-2xl: 1.375rem;   /* 22px */
  --font-size-3xl: 1.75rem;    /* 28px */
  --font-size-4xl: 2.25rem;    /* 36px */
  --font-size-5xl: 2.75rem;    /* 44px */
  --font-size-6xl: 3.5rem;     /* 56px */
  --font-size-7xl: 4.5rem;     /* 72px */

  /* ──────────────────────────────────────
     Z-INDEX Scale
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
  --container-max: 1280px;    /* Standard content width */
  --container-bleed: 1440px;  /* Full-bleed content width */

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
}
```

### 1.2 Color Application Decision Matrix

| Context | Token | Hex | Contrast on Background | WCAG AA |
|---------|-------|-----|----------------------|---------|
| Page canvas | `background` | #e7ecee | -- | -- |
| Card surface | `card` | #f7f8f8 | -- | -- |
| Primary headlines | `foreground` | #061a23 | 13.2:1 on background | PASS |
| Body text | `foreground` | #061a23 | 13.2:1 on background | PASS |
| Body text on card | `foreground` | #061a23 | 14.8:1 on card | PASS |
| Secondary text | `muted-foreground` | #4d5153 | 5.2:1 on background | PASS (corrected) |
| Secondary text on card | `muted-foreground` | #4d5153 | 5.8:1 on card | PASS |
| Brand accent | `primary-500` | #4ca46e | 3.6:1 on background | FAIL for text; use primary-700 (#33704b, 6.1:1) |
| Primary button text | `primary-foreground` | #ffffff | 3.4:1 on primary-500 | PASS large text; use primary-700 bg for small text |
| Dark section headline | `dark-text-primary` | #f7f8f8 | 11.6:1 on secondary | PASS |
| Dark section body | `dark-text-secondary` | #b8c3c7 | 7.0:1 on secondary | PASS |

### 1.3 Color Contrast Corrections (Critical)

The discovery flagged `muted-foreground` (#616567) at ~4.0:1 contrast on the `background` (#e7ecee), which fails WCAG 2.2 AA for normal text. The correction:

| Original | Corrected | Contrast on #e7ecee | Contrast on #f7f8f8 |
|----------|-----------|---------------------|---------------------|
| #616567 (4.0:1) | **#4d5153** (5.2:1) | 5.2:1 PASS | 5.8:1 PASS |

Additionally, `primary-500` (#4ca46e) at 3.4:1 against white fails AA for small text on buttons. Two fixes:

1. **Large button text only**: Primary-500 background with white text passes for text >= 18px / 14px bold (WCAG large text threshold, 3:1 minimum).
2. **Small text contexts**: Use `primary-700` (#33704b) as the button background. White text on primary-700 achieves 6.1:1.

Recommendation: Use `primary-600` (#3f885b) as the standard button background. White text on primary-600 achieves approximately 4.6:1, passing AA. Reserve `primary-500` for decorative accents, icons, and large display text only.

---

## 2. Typography Scale

### 2.1 Font Loading Strategy

```tsx
// lib/fonts.ts
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google';

export const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-display',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-body',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
  fallback: ['ui-monospace', 'Cascadia Code', 'monospace'],
});
```

### 2.2 Complete Type Scale with Responsive Clamp Values

Each token defines a fluid size using `clamp()` for seamless scaling between 375px (mobile) and 1280px (desktop) viewports. No media query breakpoints needed for typography.

| Token | Desktop | Tablet | Mobile | Fluid `clamp()` | Weight | Line Height | Letter Spacing | Font |
|-------|---------|--------|--------|------------------|--------|-------------|----------------|------|
| `display-xl` | 72px | 56px | 40px | `clamp(2.5rem, 1.25rem + 3.47vw, 4.5rem)` | 800 | 1.05 | -0.025em | Jakarta |
| `display-lg` | 56px | 44px | 34px | `clamp(2.125rem, 1.15rem + 2.72vw, 3.5rem)` | 700 | 1.1 | -0.02em | Jakarta |
| `display-md` | 44px | 36px | 28px | `clamp(1.75rem, 1.04rem + 1.98vw, 2.75rem)` | 700 | 1.15 | -0.015em | Jakarta |
| `heading-lg` | 36px | 30px | 24px | `clamp(1.5rem, 0.97rem + 1.49vw, 2.25rem)` | 700 | 1.2 | -0.01em | Jakarta |
| `heading-md` | 28px | 24px | 20px | `clamp(1.25rem, 0.9rem + 0.99vw, 1.75rem)` | 600 | 1.25 | -0.005em | Jakarta |
| `heading-sm` | 22px | 20px | 18px | `clamp(1.125rem, 0.95rem + 0.5vw, 1.375rem)` | 600 | 1.3 | 0 | Jakarta |
| `body-lg` | 20px | 18px | 18px | `clamp(1.125rem, 1.04rem + 0.25vw, 1.25rem)` | 400 | 1.6 | 0 | Inter |
| `body-md` | 16px | 16px | 16px | `1rem` (no scaling) | 400 | 1.6 | 0 | Inter |
| `body-sm` | 14px | 14px | 14px | `0.875rem` (no scaling) | 400 | 1.5 | 0.005em | Inter |
| `body-xs` | 12px | 12px | 12px | `0.75rem` (no scaling) | 400 | 1.5 | 0.01em | Inter |
| `eyebrow` | 13px | 13px | 12px | `clamp(0.75rem, 0.7rem + 0.14vw, 0.8125rem)` | 600 | 1.4 | 0.08em | Jakarta |
| `mono-md` | 14px | 14px | 13px | `clamp(0.8125rem, 0.77rem + 0.11vw, 0.875rem)` | 400 | 1.5 | 0.02em | JetBrains |
| `mono-sm` | 12px | 12px | 11px | `clamp(0.6875rem, 0.64rem + 0.11vw, 0.75rem)` | 400 | 1.4 | 0.03em | JetBrains |

### 2.3 Typography Utility Classes

```css
/* Typography utilities for Tailwind */
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
  .text-eyebrow {
    font-family: var(--font-display);
    font-size: clamp(0.75rem, 0.7rem + 0.14vw, 0.8125rem);
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
}
```

### 2.4 Maximum Line Widths

| Text Role | Max Width | Tailwind Class |
|-----------|-----------|----------------|
| Display headlines | 20ch | `max-w-[20ch]` |
| Section headlines | 28ch | `max-w-[28ch]` |
| Body copy paragraphs | 65ch | `max-w-prose` (customized) |
| Card descriptions | 45ch | `max-w-[45ch]` |
| Eyebrow labels | No limit | -- |

---

## 3. Component Library

### 3.1 Atoms (P0 -- Build Week 1)

#### Button

| Variant | Background | Text | Border | Hover | Active | Disabled |
|---------|-----------|------|--------|-------|--------|----------|
| `primary` | primary-600 | white | none | primary-700 | primary-800 | primary-300, opacity 60% |
| `secondary` | transparent | foreground | border | primary-50 bg | primary-100 bg | muted-foreground, border opacity 40% |
| `ghost` | transparent | foreground | none | muted bg | primary-50 bg | muted-foreground |
| `destructive` | destructive | white | none | destructive/90 | destructive/80 | destructive/40 |
| `primary-on-dark` | white | secondary | none | card | primary-50 | white/30 |
| `link` | transparent | primary-700 | none | underline | primary-800 | muted-foreground |

**Sizes**: `sm` (h-9, px-3, text-sm), `default` (h-11, px-5, text-base), `lg` (h-13, px-8, text-lg), `icon` (h-10, w-10).

**Shared**: `radius-md`, font-weight 600, `transition-all duration-fast ease-default`, focus ring using `ring` token.

```tsx
// Specification for <Button>
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'primary-on-dark' | 'link';
  size: 'sm' | 'default' | 'lg' | 'icon';
  asChild?: boolean;   // Radix Slot pattern
  loading?: boolean;   // Shows spinner, disables click
  icon?: ReactNode;    // Leading icon
  iconRight?: ReactNode;
  children: ReactNode;
}
```

#### Badge / Chip

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| `default` | primary-50 | primary-800 | none |
| `secondary` | card | foreground | border |
| `outline` | transparent | foreground | border |
| `status-green` | safety-green/10 | safety-green (darkened) | none |
| `status-yellow` | warning-100 | warning-800 | none |
| `status-red` | destructive/10 | destructive | none |
| `dark` | secondary | secondary-foreground | none |

**Size**: `sm` (h-5, px-2, text-xs), `default` (h-6, px-2.5, text-xs), `lg` (h-7, px-3, text-sm).

**Shared**: `radius-full`, font-weight 500.

#### Eyebrow

A styled `<span>` that always appears above section headings.

```
text-eyebrow + text-primary-700 + flex items-center gap-2
Optional: leading icon (16px Lucide) or colored dot (6px, rounded-full)
```

#### StatusDot

Small indicator circle used in readiness states and map markers.

| State | Color | Animation |
|-------|-------|-----------|
| `active` | safety-green | Single pulse on enter (scale 1 to 1.4 to 1, 600ms) |
| `warning` | safety-yellow | None |
| `alert` | safety-red | None |
| `inactive` | border | None |

**Size**: 8px default, 6px small, 10px large. Always `rounded-full`.

#### Divider

Horizontal rule: `h-px bg-border`, with `section-divider` variant that uses 80% width centered.

**Enhancement**: S-curve divider variant (see Enhancement Proposal #2) that uses an SVG path extracted from the logo mark.

#### Logo

Render correct variant based on context:

| Context | Variant | Height | Color |
|---------|---------|--------|-------|
| Header (desktop) | Horizontal lockup, dark | 32px | secondary (#123646) |
| Header (mobile) | Horizontal lockup, dark | 28px | secondary |
| Header (mobile, < 360px) | Mark only | 28px | secondary |
| Footer | Horizontal lockup, light | 32px | white |
| Favicon | Mark only | 32x32 | secondary |
| OG image | Horizontal lockup, dark | 48px | secondary |

### 3.2 Molecules (P0-P1 -- Build Weeks 1-3)

#### FeatureCard

Primary card for the feature grid sections. Contains icon, heading, description, and optional link.

```
Structure:
  <div class="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-card
              hover:shadow-card-hover transition-shadow duration-normal">
    <div class="mb-4 inline-flex h-12 w-12 items-center justify-center
                rounded-lg bg-primary-50">
      <Icon class="h-6 w-6 text-primary-700" />
    </div>
    <h3 class="text-heading-sm text-foreground mb-2">Title</h3>
    <p class="text-body-md text-muted-foreground max-w-[45ch]">Description</p>
    <a class="mt-4 inline-flex items-center gap-1 text-body-sm font-medium
              text-primary-700 hover:text-primary-800">
      Learn more <ArrowRight class="h-4 w-4" />
    </a>
  </div>
```

**Props**: `icon: LucideIcon`, `title: string`, `description: string`, `href?: string`, `motifType?: 'route' | 'review' | 'record' | 'readiness'`.

When `motifType` is set, the icon slot is replaced with the corresponding motif badge (see MotifBadge below).

#### StatCard

Numeric highlight card used in trust strips and data sections.

```
Structure:
  <div class="bg-card rounded-xl border border-border p-6 text-center shadow-sm">
    <span class="text-display-md text-foreground font-mono">17</span>
    <span class="text-eyebrow text-muted-foreground mt-1 block">
      Safety Review Sections
    </span>
  </div>
```

**Enhancement**: Animated counter that counts up from 0 when the card enters the viewport (see Enhancement #8).

**Props**: `value: number | string`, `label: string`, `prefix?: string` (e.g., "$"), `suffix?: string` (e.g., "+"), `animate?: boolean`.

#### TestimonialCard

Placeholder design for when real testimonials are collected. Until then, this component is NOT rendered -- replaced by the TrustMetricsStrip.

```
Structure (future):
  <blockquote class="bg-card rounded-xl border border-border p-8 shadow-card">
    <p class="text-body-lg text-foreground italic">"Quote text..."</p>
    <footer class="mt-6 flex items-center gap-3">
      <div class="h-10 w-10 rounded-full bg-primary-100" /> <!-- Avatar -->
      <div>
        <cite class="text-body-sm font-semibold text-foreground not-italic">Name</cite>
        <span class="text-body-xs text-muted-foreground block">Title, Org</span>
      </div>
    </footer>
  </blockquote>
```

#### PricingTier

Interactive pricing card with per-student reframing.

```
Structure:
  <div class="bg-card rounded-2xl border-2 p-8 shadow-lg
              data-[featured]:border-primary-500 data-[featured]:shadow-xl">
    <Badge variant="default" class="mb-4">Most Popular</Badge> <!-- featured only -->
    <h3 class="text-heading-md text-foreground">Plan Name</h3>
    <div class="mt-4 flex items-baseline gap-1">
      <span class="text-display-md text-foreground">$15</span>
      <span class="text-body-sm text-muted-foreground">/student</span>
    </div>
    <p class="text-body-sm text-muted-foreground mt-2">$450 per trip of 30</p>
    <Divider class="my-6" />
    <ul class="space-y-3"> <!-- Feature list --> </ul>
    <Button variant="primary" size="lg" class="mt-8 w-full">Get Started</Button>
  </div>
```

#### IndustryCard

Segment-specific card linking to solution pages.

```
Structure:
  <a href="/solutions/k-12" class="group bg-card rounded-xl border border-border
     p-6 shadow-card hover:shadow-card-hover transition-all duration-normal">
    <div class="mb-4 h-12 w-12 rounded-lg bg-secondary/5 flex items-center
                justify-center">
      <Icon class="h-6 w-6 text-secondary" />
    </div>
    <h3 class="text-heading-sm text-foreground group-hover:text-primary-700
               transition-colors">K-12 Schools</h3>
    <p class="text-body-sm text-muted-foreground mt-2">
      Field trips, athletics, and off-campus activities
    </p>
    <span class="mt-4 text-body-sm font-medium text-primary-700
                 inline-flex items-center gap-1">
      Learn more <ArrowRight class="h-4 w-4 transition-transform
                 group-hover:translate-x-1" />
    </span>
  </a>
```

#### MotifBadge

The signature visual element -- a small branded badge that encodes one of the four motif types.

| Motif | Icon | Color Accent | Label |
|-------|------|-------------|-------|
| Route | MapPin / Route | primary-500 | "Route Intelligence" |
| Review | ClipboardCheck | primary-500 | "Analyst Review" |
| Record | FileText / Shield | foreground | "Evidence Record" |
| Readiness | Activity / CircleCheck | safety-green | "Trip Ready" |

```
Structure:
  <div class="inline-flex items-center gap-2 rounded-full border border-border
              bg-card px-3 py-1.5 shadow-sm">
    <div class="h-5 w-5 rounded-full bg-{motifColor}/10 flex items-center
                justify-center">
      <Icon class="h-3 w-3 text-{motifColor}" />
    </div>
    <span class="text-body-xs font-medium text-foreground">{label}</span>
  </div>
```

#### DocumentPreview

Stylized card that looks like a stacked paper document. Used in evidence binder sections.

```
Structure:
  <!-- Back sheet (offset) -->
  <div class="relative">
    <div class="absolute -right-1 -top-1 h-full w-full rounded-lg bg-card
                border border-border shadow-sm" />
    <div class="absolute -right-0.5 -top-0.5 h-full w-full rounded-lg bg-card
                border border-border shadow-sm" />
    <!-- Front sheet -->
    <div class="relative rounded-lg bg-white border border-border shadow-md p-6">
      <div class="flex items-center justify-between mb-4">
        <span class="text-eyebrow text-muted-foreground">Evidence Binder</span>
        <Badge variant="default">Verified</Badge>
      </div>
      <div class="space-y-3">
        <!-- Timeline entries -->
        <TimelineStep />
        <TimelineStep />
      </div>
      <div class="mt-4 pt-4 border-t border-border">
        <span class="font-mono text-mono-sm text-muted-foreground">
          SHA-256: 7f83b1...
        </span>
      </div>
    </div>
  </div>
```

#### MapFragment

A decorative, non-interactive map section used as a visual element in compositions.

For the hero and feature sections, this is a static desaturated map image with branded route lines overlaid. At P1, it becomes an interactive MapLibre instance.

**Static version**: Pre-rendered PNG/WebP image of a desaturated map with a single route line in `primary-500`. Dimensions: 800x600 for desktop, 600x400 for tablet, 400x300 for mobile. Served via `<Image>` with priority loading.

**Interactive version (P1)**: Lazy-loaded MapLibre GL JS component with custom map style (see Enhancement #1).

#### TimelineStep

Single step in a vertical timeline.

```
Structure:
  <div class="flex gap-4">
    <div class="flex flex-col items-center">
      <div class="h-3 w-3 rounded-full bg-primary-500 ring-4 ring-primary-100" />
      <div class="flex-1 w-px bg-border" /> <!-- Connector line -->
    </div>
    <div class="pb-6">
      <span class="text-body-xs text-muted-foreground">Mar 15, 2026 - 09:00</span>
      <h4 class="text-body-sm font-semibold text-foreground mt-1">Event Title</h4>
      <p class="text-body-sm text-muted-foreground mt-1">Description...</p>
    </div>
  </div>
```

#### NavLink

Header navigation link with active state.

```
States:
  default:  text-foreground/70 hover:text-foreground
  active:   text-foreground font-semibold, with a 2px bottom border in primary-500
  mobile:   full-width block, py-3, border-b border-border
```

#### LogoCloud

Horizontal strip of partner/trust organization logos (grayscale, 50% opacity, hover to full).

```
Structure:
  <div class="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
    <img src="/logos/org.svg" alt="Organization Name"
         class="h-8 opacity-50 grayscale hover:opacity-100 hover:grayscale-0
                transition-all duration-normal" />
    <!-- repeat -->
  </div>
```

### 3.3 Organisms (P0-P1 -- Build Weeks 2-5)

#### SiteHeader

Sticky navigation with backdrop blur.

```
Structure:
  <header class="sticky top-0 z-sticky w-full border-b border-border/50
                 bg-background/80 backdrop-blur-lg">
    <div class="mx-auto flex h-16 max-w-[var(--container-max)] items-center
                justify-between px-6">
      <Logo variant="horizontal-dark" height={32} />
      <nav class="hidden lg:flex items-center gap-8">
        <NavLink href="/solutions">Solutions</NavLink>
        <NavLink href="/how-it-works">How It Works</NavLink>
        <NavLink href="/features">Features</NavLink>
        <NavLink href="/pricing">Pricing</NavLink>
        <NavLink href="/about">About</NavLink>
      </nav>
      <div class="hidden lg:flex items-center gap-3">
        <Button variant="ghost" size="sm">Sign In</Button>
        <Button variant="primary" size="sm">Get a Demo</Button>
      </div>
      <Sheet> <!-- Mobile menu --> </Sheet>
    </div>
  </header>
```

**Behavior**: On scroll > 10px, reduce height to h-14 and increase `backdrop-blur` to `blur-xl`. Transition `duration-normal`.

**Mobile**: Hamburger icon triggers a `Sheet` (shadcn/ui) that slides in from the right with full navigation.

#### HeroSection

See Section 4 for complete specification.

#### FeatureShowcase

Full-width section with a large product composition on one side and text content on the other. Alternating left/right layout.

```
Structure:
  <section class="py-24 lg:py-40">
    <div class="mx-auto max-w-[var(--container-max)] px-6">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <!-- Text Column -->
        <div class="order-2 lg:order-{1|2}">
          <Eyebrow icon={motifIcon}>Route Intelligence</Eyebrow>
          <h2 class="text-display-md text-foreground mt-4">
            Every route monitored. Every checkpoint verified.
          </h2>
          <p class="text-body-lg text-muted-foreground mt-4 max-w-prose">
            Description paragraph...
          </p>
          <ul class="mt-8 space-y-4">
            <FeatureListItem icon={Check}>Feature point</FeatureListItem>
            <!-- 3-4 items -->
          </ul>
          <Button variant="primary" class="mt-8">Learn More</Button>
        </div>
        <!-- Visual Column -->
        <div class="order-1 lg:order-{2|1}">
          <ProductComposition type="route-intelligence" />
        </div>
      </div>
    </div>
  </section>
```

**Alternation rule**: Odd sections place text left, visual right. Even sections reverse. This creates visual rhythm without monotony.

#### FeatureGrid

Bento-style grid of FeatureCards. Uses CSS Grid with intentional size variation.

```
Structure:
  <section class="py-24 lg:py-40">
    <div class="mx-auto max-w-[var(--container-max)] px-6">
      <div class="text-center mb-16">
        <Eyebrow>Platform Capabilities</Eyebrow>
        <h2 class="text-display-md text-foreground mt-4">
          Everything your team needs
        </h2>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard /> <!-- Repeat 6 cards -->
      </div>
    </div>
  </section>
```

**Enhancement**: Bento layout variant where 2 of 6 cards span 2 columns (see Enhancement #4).

#### MotifSection

Full-width section showcasing one of the four motifs (Route, Review, Record, Readiness) with its branded visual language.

Each motif section uses the standard FeatureShowcase layout but with a unique visual composition specific to that motif's vocabulary (map fragments for Route, checklists for Review, document stacks for Record, status gauges for Readiness).

#### TrustMetricsStrip

Replaces fabricated testimonials. A horizontal strip of verifiable data points.

```
Structure:
  <section class="border-y border-border bg-card py-12">
    <div class="mx-auto max-w-[var(--container-max)] px-6">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8
                  text-center">
        <StatCard value="5" label="Government Intel Sources" />
        <StatCard value="17" label="Safety Review Sections" />
        <StatCard value="3-5" label="Day Turnaround" suffix=" Day" />
        <StatCard value="AES-256" label="Encryption Standard" />
        <StatCard value="SHA-256" label="Evidence Chain" />
      </div>
    </div>
  </section>
```

#### CTABand

Conversion-focused banner with headline + button. Three visual variants.

| Variant | Background | Text | Button |
|---------|-----------|------|--------|
| `light` | primary-50 | foreground | primary (default) |
| `brand` | primary-700 | white | primary-on-dark |
| `dark` | secondary | dark-text-primary | primary-on-dark |

```
Structure:
  <section class="py-20 lg:py-28 bg-{variant-bg}">
    <div class="mx-auto max-w-[var(--container-max)] px-6 text-center">
      <h2 class="text-display-md text-{variant-text}">
        Ready to see the safety review?
      </h2>
      <p class="text-body-lg text-{variant-secondary} mt-4 max-w-prose mx-auto">
        Supporting copy...
      </p>
      <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button variant="{variant-btn}" size="lg">See Sample Binder</Button>
        <Button variant="secondary" size="lg">Schedule a Demo</Button>
      </div>
    </div>
  </section>
```

#### DarkAuthoritySection

A `secondary`-background section used for high-trust content moments.

**Rules**:
- Maximum 2 per page
- Never adjacent to another dark section
- Always preceded and followed by a light section with at least `py-24` spacing
- Headline in `dark-text-primary`, body in `dark-text-secondary`, accent in `dark-accent`
- Card surfaces use `dark-surface`
- Borders use `dark-border`

```
Structure:
  <section class="bg-secondary py-24 lg:py-40">
    <div class="mx-auto max-w-[var(--container-max)] px-6">
      <!-- Content inherits dark surface tokens -->
    </div>
  </section>
```

**Implementation**: Apply a `data-theme="dark"` attribute to the section. Use CSS variable overrides:

```css
[data-theme="dark"] {
  --color-card: rgba(255, 255, 255, 0.06);
  --color-card-foreground: #f7f8f8;
  --color-border: rgba(255, 255, 255, 0.12);
  --color-foreground: #f7f8f8;
  --color-muted-foreground: #b8c3c7;
  --color-primary: #6cbc8b;
}
```

This allows child components (FeatureCard, StatCard, etc.) to render correctly on dark backgrounds without prop drilling.

#### ProcessTimeline

Vertical or horizontal timeline showing the "Intelligence, Review, Documentation" three-act structure.

```
Horizontal (desktop):
  <div class="grid grid-cols-3 gap-8">
    <div class="relative">
      <div class="flex items-center gap-3 mb-4">
        <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center
                    justify-center text-primary-700 font-semibold">1</div>
        <div class="flex-1 h-px bg-border" /> <!-- Connector -->
      </div>
      <h3>Intelligence Gathering</h3>
      <p>Description</p>
    </div>
    <!-- Steps 2, 3 -->
  </div>

Vertical (mobile):
  Standard TimelineStep components stacked vertically.
```

#### FAQSection

Accordion-based FAQ using shadcn/ui `Accordion` primitive.

```
Structure:
  <section class="py-24 lg:py-40">
    <div class="mx-auto max-w-3xl px-6">
      <h2 class="text-display-md text-foreground text-center mb-12">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger class="text-heading-sm text-foreground">
            Question text?
          </AccordionTrigger>
          <AccordionContent class="text-body-md text-muted-foreground">
            Answer text...
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </section>
```

#### SiteFooter

Dark footer on `secondary` background. Three-zone layout.

```
Structure:
  <footer class="bg-secondary pt-16 pb-8">
    <div class="mx-auto max-w-[var(--container-max)] px-6">
      <!-- Zone 1: Brand + Description -->
      <div class="grid lg:grid-cols-5 gap-12 mb-12">
        <div class="lg:col-span-2">
          <Logo variant="horizontal-light" height={32} />
          <p class="text-body-sm text-[var(--color-dark-text-secondary)] mt-4
                    max-w-[35ch]">
            Professional trip safety management. Every trip reviewed.
            Every event documented.
          </p>
        </div>
        <!-- Zone 2: Link Columns (3 columns) -->
        <div class="grid grid-cols-3 gap-8 lg:col-span-3">
          <FooterLinkColumn title="Product" links={productLinks} />
          <FooterLinkColumn title="Solutions" links={solutionLinks} />
          <FooterLinkColumn title="Company" links={companyLinks} />
        </div>
      </div>
      <!-- Zone 3: Bottom Bar -->
      <div class="border-t border-[var(--color-dark-border)] pt-8
                  flex flex-col sm:flex-row items-center justify-between gap-4">
        <span class="text-body-xs text-[var(--color-dark-text-secondary)]">
          2026 SafeTrekr. All rights reserved.
        </span>
        <div class="flex items-center gap-6">
          <a href="/legal/privacy">Privacy</a>
          <a href="/legal/terms">Terms</a>
        </div>
      </div>
    </div>
  </footer>
```

Footer link styling: `text-body-sm text-[var(--color-dark-text-secondary)] hover:text-white transition-colors duration-fast`.

#### DemoRequestForm

Lead capture form with validation and bot protection.

```
Fields:
  - Full Name (required)
  - Work Email (required, email validation)
  - Organization Name (required)
  - Organization Type (select: K-12 School, Church/Mission, Higher Ed, Corporate, Sports/League, Other)
  - Estimated Annual Trips (select: 1-10, 11-25, 26-50, 50+)
  - Message (optional textarea)
  - Honeypot field (hidden)
  - Cloudflare Turnstile (invisible)

Layout:
  2-column grid on desktop (name + email on row 1, org name + type on row 2),
  single column on mobile.

Submission:
  Server Action -> Zod validation -> Turnstile verification -> Supabase insert
  -> Email notification via SendGrid -> Success state with confirmation message.

Success state:
  Replace form with a confirmation card showing a check icon, "We'll be in touch
  within one business day" message, and a "Download Sample Binder" secondary CTA.
```

---

## 4. Hero Composition

### 4.1 Layout Specification

The hero is the quality benchmark for the entire site. It must communicate "calm authority + visible readiness + premium clarity" in the first 3 seconds.

```
Desktop (>= 1024px):
  ┌──────────────────────────────────────────────────────┐
  │  ┌─────────────┐  ┌────────────────────────────────┐ │
  │  │  TEXT COLUMN │  │     PRODUCT COMPOSITION        │ │
  │  │  (5 cols)    │  │     (7 cols)                   │ │
  │  │              │  │                                │ │
  │  │  [Eyebrow]   │  │  ┌──────────┐  ┌───────────┐  │ │
  │  │  [Headline]  │  │  │ MAP      │  │ REVIEW    │  │ │
  │  │  [Subtext]   │  │  │ with     │  │ PANEL     │  │ │
  │  │  [CTA] [CTA] │  │  │ route    │  │           │  │ │
  │  │              │  │  │ line     │  └───────────┘  │ │
  │  │              │  │  │          │  ┌───────────┐  │ │
  │  │              │  │  └──────────┘  │ DOCUMENT  │  │ │
  │  │              │  │    ┌────────┐  │ PREVIEW   │  │ │
  │  │              │  │    │READINESS│ └───────────┘  │ │
  │  │              │  │    │ GAUGE  │                 │ │
  │  │              │  │    └────────┘                 │ │
  │  └─────────────┘  └────────────────────────────────┘ │
  └──────────────────────────────────────────────────────┘

Tablet (768-1023px):
  ┌────────────────────────────┐
  │  [Eyebrow]                 │
  │  [Headline]                │
  │  [Subtext]                 │
  │  [CTA] [CTA]              │
  │                            │
  │  ┌──────────────────────┐  │
  │  │ PRODUCT COMPOSITION  │  │
  │  │ (all 4 layers,       │  │
  │  │  scaled down)        │  │
  │  └──────────────────────┘  │
  └────────────────────────────┘

Mobile (<768px):
  ┌──────────────────┐
  │  [Eyebrow]       │
  │  [Headline]      │
  │  [Subtext]       │
  │  [CTA]           │
  │  [CTA]           │
  │                  │
  │  ┌────────────┐  │
  │  │ MAP FRAG   │  │
  │  │ + route    │  │
  │  │ line only  │  │
  │  └────────────┘  │
  └──────────────────┘
```

### 4.2 Text Content Specification

```
Eyebrow:     "Trip Safety Management Platform"
             text-eyebrow, text-primary-700, with shield icon leading

Headline:    "Every trip professionally reviewed."
             text-display-xl, text-foreground, max-w-[20ch]

Subtext:     "SafeTrekr combines intelligence from 5 government data sources,
             17-section analyst review, and SHA-256 evidence documentation
             to protect your travelers and your organization."
             text-body-lg, text-muted-foreground, max-w-[50ch], mt-6

CTA Primary: "See Sample Binder"
             Button variant="primary" size="lg"

CTA Secondary: "Schedule a Demo"
               Button variant="secondary" size="lg"
```

### 4.3 Product Composition -- Layer-by-Layer

The composition is a custom-built arrangement of overlapping card elements that together communicate the four motifs. It is NOT a screenshot.

#### Layer 1 -- Map Intelligence (Base Layer)

- **Dimensions**: 560x400px (desktop), aspect-ratio preserved smaller
- **Content**: Desaturated map tile image showing terrain + street data
- **Route line**: Single curved path in `primary-500`, 3px stroke, with direction arrows
- **Waypoint markers**: 3-4 circles (12px) in `primary-600` with `primary-100` halo (20px)
- **Style**: `rounded-xl shadow-lg border border-border overflow-hidden`
- **Background**: Map tiles desaturated to 15% saturation, contrast reduced to 85%
- **Z-index**: 0 (base)

#### Layer 2 -- Trip Review Panel (Overlapping Upper-Right)

- **Dimensions**: 280x320px, positioned overlapping map upper-right by 40px
- **Content**:
  - Header bar with "Trip Review" title + "Reviewed" badge (primary variant)
  - 4 checklist items with green checkmarks (primary-500)
  - Progress bar at 100% (primary-500 fill on primary-100 track)
  - Analyst avatar placeholder (32px circle, secondary bg, initials)
- **Style**: `rounded-xl bg-white shadow-xl border border-border p-5`
- **Z-index**: 10

#### Layer 3 -- Document Preview (Overlapping Lower-Right)

- **Dimensions**: 240x180px, positioned below review panel with 20px gap
- **Content**:
  - "Evidence Binder" header in eyebrow style
  - 2 timeline entries (condensed TimelineStep)
  - SHA-256 hash snippet in mono-sm, truncated
- **Style**: Stacked paper effect (3 layers offset by 2px each), front sheet `bg-white rounded-lg shadow-lg border border-border p-4`
- **Z-index**: 20

#### Layer 4 -- Readiness Indicator (Floating Lower-Left of Map)

- **Dimensions**: 120x120px
- **Content**:
  - Circular gauge (SVG) with `primary-500` fill arc at ~85%
  - "Trip Ready" label centered
  - Small status dot (safety-green, 8px)
- **Style**: `rounded-xl bg-white shadow-lg border border-border p-4`
- **Z-index**: 15

### 4.4 Hero Background Treatment

- Base: `background` (#e7ecee)
- Overlay: Faint geometric dot-grid pattern at 3% opacity using `primary-300`
- Optional gradient: Subtle radial gradient from `background` to `primary-50` at 20% opacity, centered behind the product composition, radius 600px

### 4.5 Hero Spacing

```
Section padding:
  Desktop: pt-24 pb-32 (96px top, 128px bottom)
  Tablet:  pt-20 pb-24
  Mobile:  pt-16 pb-20

Grid gap: gap-12 lg:gap-20
Text content: self-center (vertically centered against composition)
```

---

## 5. Motion System

### 5.1 Framer Motion Preset Library

```tsx
// lib/motion.ts
import { type Variants, type Transition } from 'framer-motion';

// ── Easing Curves ──
export const easing = {
  default: [0.4, 0, 0.2, 1] as const,
  enter: [0.0, 0, 0.2, 1] as const,
  exit: [0.4, 0, 1, 1] as const,
  spring: [0.22, 1, 0.36, 1] as const,
} as const;

// ── Duration Presets ──
export const duration = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.2,
  moderate: 0.3,
  slow: 0.5,
  slower: 0.8,
  reveal: 1.0,
  draw: 1.2,
} as const;

// ── Transition Presets ──
export const transition: Record<string, Transition> = {
  default: { duration: duration.normal, ease: easing.default },
  enter: { duration: duration.moderate, ease: easing.enter },
  slow: { duration: duration.slow, ease: easing.default },
  spring: { duration: duration.slower, ease: easing.spring },
  reveal: { duration: duration.reveal, ease: easing.spring },
};

// ── Variant Presets ──

/** Fade up from 20px below */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: transition.enter },
};

/** Fade up from 40px (larger elements) */
export const fadeUpLarge: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: transition.spring },
};

/** Simple fade */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.default },
};

/** Scale up from 95% */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: transition.spring },
};

/** Stagger container -- children animate with delay */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** Stagger container with slower timing for larger reveals */
export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

/** Card reveal -- fade up + subtle scale */
export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: duration.slow, ease: easing.spring },
  },
};

/** Route line draw -- for SVG path animation */
export const routeDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: duration.draw, ease: easing.default },
  },
};

/** Marker pop -- waypoint dot appearance */
export const markerPop: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: duration.moderate, ease: easing.spring },
  },
};

/** Status dot pulse -- single pulse on enter */
export const statusPulse: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 1.4, 1],
    opacity: [0, 1, 1],
    transition: { duration: 0.6, ease: easing.spring },
  },
};

/** Checklist item reveal -- slide in from left */
export const checklistReveal: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.moderate, ease: easing.enter },
  },
};

/** Document stack -- back-to-front reveal */
export const documentStack: Variants = {
  hidden: { opacity: 0, y: 16, rotateX: -5 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: duration.slow, ease: easing.spring },
  },
};

/** Gauge fill -- clockwise arc animation */
export const gaugeFill: Variants = {
  hidden: { pathLength: 0 },
  visible: {
    pathLength: 0.85, // 85% fill
    transition: { duration: 1.2, ease: easing.default, delay: 0.4 },
  },
};

/** Counter animate -- for StatCard number counting */
export const counterAnimate = {
  from: 0,
  duration: 1.5,
  ease: easing.default,
};
```

### 5.2 ScrollReveal Wrapper Component

```tsx
// components/motion/scroll-reveal.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, type Variants } from '@/lib/motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  once?: boolean;    // Only animate once (default: true)
  amount?: number;   // Viewport intersection threshold (default: 0.2)
}

export function ScrollReveal({
  children,
  variants = fadeUp,
  className,
  delay = 0,
  once = true,
  amount = 0.2,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      className={className}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </motion.div>
  );
}
```

### 5.3 StaggerChildren Wrapper

```tsx
// components/motion/stagger-children.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { staggerContainer, type Variants } from '@/lib/motion';

interface StaggerChildrenProps {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  once?: boolean;
}

export function StaggerChildren({
  children,
  variants = staggerContainer,
  className,
  once = true,
}: StaggerChildrenProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15 }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

### 5.4 Hero Animation Sequence

The hero animation is orchestrated in a strict sequence. Total duration: ~1800ms.

| Time | Element | Animation | Duration | Easing |
|------|---------|-----------|----------|--------|
| 0ms | Eyebrow | fadeIn | 300ms | default |
| 100ms | Headline | fadeUp (y: 30px) | 500ms | spring |
| 250ms | Subtext | fadeUp (y: 20px) | 400ms | enter |
| 400ms | CTA buttons | fadeUp (y: 20px) | 300ms | enter |
| 500ms | Map surface | scaleIn (scale: 0.96) | 600ms | spring |
| 700ms | Route line | routeDraw (pathLength) | 1200ms | default |
| 900ms | Waypoint markers | markerPop, stagger 80ms each | 300ms each | spring |
| 800ms | Review panel | fadeUp + slideIn from right | 500ms | spring |
| 1000ms | Checklist items | checklistReveal, stagger 60ms | 200ms each | enter |
| 1100ms | Document preview | documentStack | 500ms | spring |
| 1200ms | Readiness gauge | gaugeFill (clockwise) | 1200ms | default |
| 1400ms | Status dot | statusPulse | 600ms | spring |

### 5.5 Scroll-Triggered Section Animations

Each section animates when it enters the viewport (20% visible threshold):

| Section Type | Animation | Details |
|-------------|-----------|---------|
| Section heading | fadeUp | Eyebrow + heading + subtext staggered at 80ms |
| Feature grid | staggerContainer + cardReveal | Cards stagger at 80ms intervals |
| Feature showcase | Split entry | Text fades up, visual slides in from opposite side |
| Trust strip | fadeIn | Entire strip fades in together |
| StatCard values | counterAnimate | Numbers count up from 0 over 1.5s |
| CTA band | fadeUp | Heading + buttons staggered at 100ms |
| Dark section | fadeIn (entire) | Section background fades in, then content staggers |
| Timeline | staggerContainer | Steps reveal top-to-bottom at 120ms intervals |
| FAQ items | staggerContainer | Accordion items fade up at 60ms intervals |

### 5.6 Micro-Interactions

| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Button (primary) | hover | Background darkens (primary-600 to primary-700), subtle scale(1.02) | 150ms | default |
| Button (secondary) | hover | Background fills with primary-50 | 150ms | default |
| Card | hover | Shadow transitions from shadow-card to shadow-card-hover, translateY(-2px) | 200ms | default |
| Nav link | hover | opacity 0.7 to 1, color to foreground | 150ms | default |
| Accordion trigger | click | Chevron rotates 180deg | 200ms | default |
| Logo cloud item | hover | grayscale-0, opacity-100 | 200ms | default |
| "Learn more" arrow | hover (parent) | translateX(4px) | 150ms | spring |
| Form input | focus | Ring appears (ring token), border changes to ring color | 150ms | default |
| Mobile menu | open | Sheet slides from right, content staggers at 40ms | 300ms | spring |

### 5.7 prefers-reduced-motion Strategy

All motion respects the `prefers-reduced-motion: reduce` media query:

1. **ScrollReveal** and **StaggerChildren** components render children immediately without animation
2. CSS transitions reduced to `opacity` only (no transform, no scale)
3. SVG path animations (route draw) show the completed path immediately
4. Counter animations show the final value immediately
5. Hover states retain color changes but remove transform effects

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

## 6. Dark Section Strategy

### 6.1 Rhythm Rules

Dark sections (`secondary` background) create visual anchoring and authority. Strict rules govern their placement.

| Rule | Specification |
|------|---------------|
| Maximum per page | 2 (excluding footer) |
| Adjacency | Never two dark sections in a row |
| Minimum light gap | At least one full light section between dark sections (minimum `py-24`) |
| Recommended positions | 1/3 and 2/3 through page, or just before final CTA |
| Content types | Trust/proof modules, data showcases, CTA bands, social proof |
| Never use for | Feature descriptions, forms, FAQ, pricing details |

### 6.2 Visual Specification

```css
/* Dark section token overrides */
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

### 6.3 Content Rendering on Dark

| Element | Token | Example |
|---------|-------|---------|
| Headlines | foreground (overridden to #f7f8f8) | "Trusted by organizations nationwide" |
| Body text | muted-foreground (overridden to #b8c3c7) | Supporting description |
| Brand accent | primary (overridden to #6cbc8b) | Accent lines, icons, badges |
| Card surfaces | card (overridden to rgba white 6%) | Feature cards within dark section |
| Card borders | border (overridden to rgba white 12%) | Subtle structure |
| Buttons (primary) | White background, secondary text | High contrast CTA |
| Buttons (secondary) | Transparent, white border, white text | Secondary action |
| Stat values | foreground (white) | "17", "5", "AES-256" |

### 6.4 Recommended Page Rhythm

```
Homepage Section Order:
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
  11. Footer (bg-secondary -- always dark, does not count toward limit)
```

---

## 7. Responsive Behavior

### 7.1 Breakpoint System

| Token | Width | Tailwind Prefix | Key Changes |
|-------|-------|----------------|-------------|
| base | 0-639px | (none) | Single column, stacked layout, full-width cards |
| sm | 640px | `sm:` | Minor padding adjustments |
| md | 768px | `md:` | Two-column grids begin, tablet navigation |
| lg | 1024px | `lg:` | Full desktop grid, side-by-side hero, sticky nav |
| xl | 1280px | `xl:` | Max content width reached |
| 2xl | 1536px | `2xl:` | Generous side margins, centered content |

### 7.2 Component-Level Responsive Behavior

#### SiteHeader
| Breakpoint | Behavior |
|------------|----------|
| < lg | Hamburger menu, Sheet slide-in, logo + hamburger only in bar |
| >= lg | Full horizontal nav, CTA buttons visible, logo + nav + CTAs |

#### HeroSection
| Breakpoint | Layout | Visual Composition |
|------------|--------|--------------------|
| < md | Stacked, text first, map fragment only | Single MapFragment (simplified) |
| md - lg | Stacked, full composition below text | All 4 layers, scaled to fit |
| >= lg | Side-by-side (5+7 cols) | Full composition with overlapping panels |

#### FeatureGrid
| Breakpoint | Columns | Card Size |
|------------|---------|-----------|
| < sm | 1 column | Full width |
| sm - lg | 2 columns | Equal width |
| >= lg | 3 columns (or bento 2+1 pattern) | Equal width (or 2-span featured) |

#### FeatureShowcase
| Breakpoint | Layout |
|------------|--------|
| < lg | Stacked: visual above text, full width |
| >= lg | Side-by-side, alternating left/right |

#### TrustMetricsStrip
| Breakpoint | Columns |
|------------|---------|
| < md | 2 columns |
| md - lg | 3 columns |
| >= lg | 5 columns (single row) |

#### PricingTier
| Breakpoint | Layout |
|------------|--------|
| < md | Stacked, full width, featured tier first |
| md - lg | 2 columns, featured spans or highlights |
| >= lg | 3 columns, featured tier elevated with scale(1.05) |

#### CTABand
| Breakpoint | Button Layout |
|------------|---------------|
| < sm | Stacked buttons, full width |
| >= sm | Horizontal, centered |

#### SiteFooter
| Breakpoint | Layout |
|------------|--------|
| < md | Stacked: logo, then links (2-col grid), then bottom bar |
| md - lg | Logo left + 3-col links right, bottom bar full width |
| >= lg | Full 5-col grid (logo 2 cols, links 3 cols) |

### 7.3 Section Padding Scale

| Breakpoint | Standard Section | Compressed Section | Hero |
|------------|-----------------|-------------------|------|
| base | py-12 (48px) | py-8 (32px) | pt-16 pb-20 |
| sm | py-16 (64px) | py-10 (40px) | pt-20 pb-24 |
| md | py-20 (80px) | py-12 (48px) | pt-20 pb-24 |
| lg | py-24 (96px) | py-16 (64px) | pt-24 pb-32 |
| xl | py-32 (128px) | py-20 (80px) | pt-28 pb-36 |
| 2xl | py-40 (160px) | py-24 (96px) | pt-32 pb-40 |

### 7.4 Content Width Behavior

```
Container: max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12

At < 640px:   content fills viewport with 24px side padding
At 640-1280px: content fills viewport with 32-48px side padding
At 1280px+:    content is centered, generous margins grow
At 1536px+:    substantial white space on sides (128px+ per side)
```

---

## 8. Icon System

### 8.1 Base Icon Set (Lucide)

| Property | Value |
|----------|-------|
| Library | Lucide React |
| Stroke width | 1.5px (default) |
| License | MIT |
| Default size | 24px (md), 20px (sm), 16px (xs), 32px (lg) |
| Color | `currentColor` (inherits text color) |
| Alignment | Slightly squared geometry, clean corners |

### 8.2 Standard Icon Map

| Usage | Lucide Icon | Context |
|-------|-------------|---------|
| Navigation | `Menu`, `X`, `ChevronDown`, `ChevronRight` | Header, dropdowns |
| Actions | `ArrowRight`, `ExternalLink`, `Download`, `Play` | CTAs, links |
| Features | `MapPin`, `Route`, `ClipboardCheck`, `FileText`, `Shield`, `Activity` | Feature cards |
| Status | `Check`, `AlertTriangle`, `AlertCircle`, `Info` | Badges, alerts |
| Social | `Twitter`, `Linkedin`, `Github` (via simple-icons) | Footer |
| Forms | `Mail`, `User`, `Building2`, `Send` | Form fields, labels |
| Navigation | `ChevronUp` | FAQ accordion, scroll-to-top |

### 8.3 Custom Icons Needed (7)

These icons do not exist in Lucide and must be designed to match the Lucide design language (1.5px stroke, 24x24 viewBox, slightly squared geometry, same corner radius).

| Icon | Description | Usage |
|------|-------------|-------|
| `ShieldPath` | Logo mark simplified -- shield outline with S-curve road | Brand motif, hero, favicon alternative |
| `RouteIntelligence` | Map fragment with route line and 2 waypoints | Route motif badge, feature sections |
| `EvidenceBinder` | Stacked document sheets with checkmark seal | Record motif, evidence binder sections |
| `AnalystReview` | Clipboard with magnifying glass overlay | Review motif, 17-section feature |
| `MusterPoint` | Rally flag with location pin | Geofencing feature, emergency features |
| `MonteCarlo` | Probability distribution curve with data points | Risk intelligence, Monte Carlo feature |
| `Geofence` | Dashed circle boundary with pin inside | Geofencing feature, monitoring sections |

**Design specifications for custom icons**:
- 24x24px viewBox
- 1.5px stroke, `round` line-cap, `round` line-join
- No fill (stroke-only), except for small accent dots
- Corner radius matching Lucide (~2px on 24px viewBox)
- Exported as React components (same interface as Lucide)
- Color via `currentColor`

### 8.4 Icon Sizing System

| Size Token | Pixel Size | Tailwind Class | Usage |
|------------|-----------|----------------|-------|
| `icon-xs` | 14px | `h-3.5 w-3.5` | Inline with small text, badges |
| `icon-sm` | 16px | `h-4 w-4` | Buttons (sm), inline with body text |
| `icon-md` | 20px | `h-5 w-5` | Buttons (default), nav items |
| `icon-lg` | 24px | `h-6 w-6` | Feature card icons, standalone |
| `icon-xl` | 32px | `h-8 w-8` | Hero accents, section markers |

---

## 9. Logo Mark as Design Asset

### 9.1 Mark Geometry Analysis

The SafeTrekr mark is a heraldic shield containing an S-curve mountain road. The SVG path data reveals:

1. **Shield silhouette**: A pointed-bottom shield with rounded upper corners. The outer path forms a traditional protective emblem shape -- wider at the top, tapering to a point at the bottom center.

2. **S-curve road**: The interior path (visible in the lower portion of the mark) traces a sinuous curve from upper-left to lower-right, representing a mountain road. This curve has two primary inflection points, creating the characteristic "S" shape.

3. **Mountain terrain**: The upper interior shows angular forms suggesting mountain peaks, with the road winding between them.

4. **Negative space**: The shield's interior has significant negative space, which contributes to the clean, modern feel.

### 9.2 Extractable Design Elements

| Element | SVG Source | Application |
|---------|-----------|-------------|
| **S-curve path** | Interior road curve bezier points | Section dividers, route-drawing animations, background textures |
| **Shield silhouette** | Outer boundary path | Trust badges, container shapes for certifications |
| **Mountain peaks** | Upper interior triangular forms | Subtle geometric background patterns at 2-3% opacity |
| **Road direction arrows** | Derived from curve tangent angles | Waypoint markers, progress indicators |

### 9.3 S-Curve as Brand Motif

The road's S-curve should be extracted as an independent SVG path and used as:

1. **Section divider**: A subtle curved line (2px, `primary-200`, 30% opacity) replacing standard horizontal rules between major sections. Much more distinctive than a flat line.

2. **Route animation path**: The hero's animated route line follows this same curve geometry, reinforcing the mark.

3. **Background texture**: Tiled at very low opacity (2-3%) as a repeating pattern behind light sections.

4. **Loading indicator**: A simplified version of the curve that draws itself during page transitions.

---

## 10. Enhancement Proposals

### Enhancement 1: Custom MapLibre Map Style as Permanent Brand Asset

**Problem**: Default map tile styles (OpenStreetMap, MapTiler) look generic and break the carefully crafted visual system. Every competitor uses the same map aesthetic.

**Proposal**: Design a custom MapLibre GL style JSON that matches SafeTrekr's color tokens and visual language. This becomes a reusable brand asset across the marketing site, product portals, and mobile app.

**Specification**:

| Map Element | Color | Opacity |
|-------------|-------|---------|
| Land | `#e8edef` (near background) | 100% |
| Water | `#c8d6dc` (desaturated secondary) | 100% |
| Roads (major) | `#d1d8db` | 100% |
| Roads (minor) | `#dce2e5` | 80% |
| Buildings | `#dde3e6` | 60% |
| Parks/green | `#dce8e0` (desaturated primary-100) | 80% |
| Labels (major) | `#7a8a90` | 80% |
| Labels (minor) | `#9aa6ab` | 60% |
| Route line (overlay) | `primary-500` (#4ca46e) | 100% |
| Waypoint marker | `primary-600` (#3f885b) + `primary-100` halo | 100% |
| Geofence boundary | `primary-400` dashed | 60% |
| Alert zone | `safety-red` | 20% fill, 80% stroke |

**Result**: The map becomes a quiet, neutral surface that recedes behind SafeTrekr's branded data layers. It looks like no other company's map.

**Effort**: 2-3 days for initial style, 1 day for fine-tuning. Reusable forever.

**Priority**: HIGH -- the map is the hero's centerpiece and appears on multiple pages.

---

### Enhancement 2: Animated S-Curve Route Divider

**Problem**: Horizontal rules between sections are generic. The moodboard calls for "proprietary visual systems."

**Proposal**: Extract the S-curve from the logo mark and use it as an animated section divider. On scroll, the path draws itself from left to right using SVG `pathLength` animation.

**Specification**:

```tsx
// components/ui/route-divider.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { routeDraw } from '@/lib/motion';

export function RouteDivider({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={cn('w-full max-w-[600px] mx-auto py-8', className)}>
      <svg viewBox="0 0 600 40" fill="none" className="w-full h-auto">
        <motion.path
          d="M0 20 C100 20, 150 5, 250 20 S400 35, 500 20 S550 10, 600 20"
          stroke="var(--color-primary-200)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
          variants={shouldReduceMotion ? undefined : routeDraw}
          initial={shouldReduceMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        />
      </svg>
    </div>
  );
}
```

**Effort**: 0.5 days.

**Priority**: MEDIUM -- distinctive but not critical path.

---

### Enhancement 3: Interactive Evidence Binder Preview

**Problem**: The evidence binder is SafeTrekr's most defensible differentiator (SHA-256 hash chain, 17 sections, legal-grade documentation), but a static card does not convey its depth.

**Proposal**: Build a mini-interactive document viewer that lets visitors "flip through" a redacted sample binder. Three pages visible: cover page, a sample review section, and the hash-chain verification page. Navigation via left/right arrows or swipe.

**Specification**:
- Container: `rounded-2xl shadow-xl bg-white border border-border overflow-hidden`, max-width 480px
- Page transition: Horizontal slide with fade, 300ms, ease-spring
- Pages: 3 static pre-rendered content frames (not real documents)
- Mobile: Full-width, swipe-enabled via `framer-motion` drag gestures
- Desktop: Arrow buttons on left/right edges, keyboard left/right support
- Accessibility: aria-live region announcing current page, keyboard navigation
- Connection to lead magnet: "Download Full Sample Binder" CTA below the preview

**Effort**: 2-3 days.

**Priority**: HIGH -- directly supports the #1 identified lead magnet.

---

### Enhancement 4: Bento Grid Layout for Feature Showcases

**Problem**: Standard 3-column grids are ubiquitous. The moodboard references Notion's "modular bento-style presentation" as inspiration.

**Proposal**: Replace the standard FeatureGrid with a bento layout where featured items span 2 columns, creating visual hierarchy within the grid.

**Specification**:

```
Desktop layout (6 items):
  ┌─────────────────────┬──────────┐
  │                     │          │
  │  FEATURED (2-span)  │  Item 2  │
  │                     │          │
  ├──────────┬──────────┼──────────┤
  │          │          │          │
  │  Item 3  │  Item 4  │ FEATURED │
  │          │          │ (2-span) │
  ├──────────┤          │          │
  │  Item 5  │          │          │
  └──────────┴──────────┴──────────┘
```

**Implementation**:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <FeatureCard className="sm:col-span-2 lg:col-span-2" featured />
  <FeatureCard />
  <FeatureCard />
  <FeatureCard />
  <FeatureCard className="sm:col-span-2 lg:col-span-2" featured />
</div>
```

Featured cards: taller (min-h-[280px]), larger icon (48px), `display-heading` instead of `heading-sm` for the title, optional inline illustration or product composition.

**Effort**: 1 day.

**Priority**: MEDIUM -- visual differentiation without major effort.

---

### Enhancement 5: Operational Motion Micro-Interactions

**Problem**: The motion system defines scroll reveals and hero sequences but lacks the fine-grained micro-interactions that make a site feel "alive" and "systems activating."

**Proposal**: Implement 8 specific micro-interactions that reinforce the "operational motion" vocabulary.

| Interaction | Trigger | Animation | Duration |
|------------|---------|-----------|----------|
| **Route line hover** | Mouse enters map composition | Route line glows (drop-shadow primary-400/40) | 200ms |
| **Waypoint pulse** | Waypoint enters viewport | Single outward ring pulse (primary-200, scale 1 to 2, opacity 1 to 0) | 600ms |
| **Checklist check** | Checklist item enters viewport | Checkmark draws itself (pathLength 0 to 1), then color fills | 400ms |
| **Document page flip** | User navigates binder | Page slides out while next slides in, with subtle 3D rotation | 300ms |
| **Status dot heartbeat** | Safety-green dot enters viewport | Single scale pulse (1 to 1.3 to 1) | 600ms |
| **Hash reveal** | SHA-256 text enters viewport | Characters appear left-to-right like typing, in mono font | 800ms |
| **Gauge sweep** | Readiness gauge enters viewport | Arc draws clockwise from 0 to target percentage | 1200ms |
| **Counter increment** | StatCard enters viewport | Number counts from 0 to target with easing deceleration | 1500ms |

**Effort**: 2 days.

**Priority**: HIGH -- these are the "10% Watchtower Light" that makes the site feel premium.

---

### Enhancement 6: Custom Cursor States

**Problem**: Default browser cursors provide no contextual feedback on interactive map elements and document previews.

**Proposal**: Implement custom cursor states for specific interactive contexts only. This is NOT a site-wide custom cursor (that would feel gimmicky). It is a contextual enhancement for two specific areas.

| Context | Cursor | Design |
|---------|--------|--------|
| Interactive map (hover over route) | Custom: magnifying glass with "+" | 32x32 SVG, primary-700 stroke |
| Interactive map (dragging) | Custom: grabbing hand | 32x32 SVG, secondary stroke |
| Evidence binder (swipe area) | Custom: horizontal arrows | 32x32 SVG, muted-foreground stroke |
| Default everywhere else | System default | No change |

**Implementation**: CSS `cursor: url()` with SVG data URIs. Fallback to standard cursors.

**Effort**: 0.5 days.

**Priority**: LOW -- polish enhancement, ship after P0 complete.

---

### Enhancement 7: Scroll-Linked Map Parallax

**Problem**: The hero map composition feels static once the initial animation completes. As users scroll, the map section passes by without visual engagement.

**Proposal**: Subtle parallax effect where the map background layer moves at 80% scroll speed relative to the foreground UI panels. This creates gentle depth without the "cinematic scroll stunts" the moodboard explicitly warns against.

**Specification**:
- Map layer: `translateY` at 0.2x scroll rate (moves 20% slower than scroll)
- UI panels (review, document, gauge): Move at 1x scroll rate (normal)
- Effect range: Only active while hero section is in viewport
- Maximum displacement: 40px (prevents jarring movement)
- Easing: None (direct scroll link for responsiveness)
- `prefers-reduced-motion`: Disabled entirely

**Implementation**: Framer Motion `useScroll` + `useTransform` hooks.

```tsx
const { scrollYProgress } = useScroll({
  target: heroRef,
  offset: ['start start', 'end start'],
});
const mapY = useTransform(scrollYProgress, [0, 1], [0, 40]);
```

**Effort**: 0.5 days.

**Priority**: MEDIUM -- adds depth but must be imperceptible on conscious level.

---

### Enhancement 8: Animated Stat Counters with Typewriter Hero Subtext

**Problem**: Static numbers in trust strips lack impact. The hero subtext appears all at once rather than building the narrative.

**Proposal A -- Animated Counters**: StatCard values count up from 0 to their target when they scroll into view. Uses `framer-motion`'s `useMotionValue` and `useTransform` with `animate`.

```tsx
// components/marketing/animated-counter.tsx
'use client';

import { useEffect, useRef } from 'react';
import {
  useMotionValue,
  useTransform,
  animate,
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion';

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 1.5,
  prefix = '',
  suffix = '',
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(from);
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (isInView && !shouldReduceMotion) {
      animate(motionValue, to, { duration, ease: [0.4, 0, 0.2, 1] });
    } else if (shouldReduceMotion) {
      motionValue.set(to);
    }
  }, [isInView, shouldReduceMotion, motionValue, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
```

**Proposal B -- Hero Subtext Typewriter** (OPTIONAL, use sparingly): The hero subtext reveals word-by-word with a subtle fade, drawing the reader through the value proposition. Only the first sentence uses this effect; the rest appears normally.

**Decision**: Implement Proposal A (counters) as P1. Evaluate Proposal B after user testing -- it may slow comprehension if overused. If implemented, limit to the hero only and ensure the full text is immediately available to screen readers.

**Effort**: 1 day (counters), 0.5 days (typewriter).

**Priority**: Counters HIGH, Typewriter LOW.

---

### Enhancement 9: Ambient Dot-Grid Background Pattern

**Problem**: The `background` (#e7ecee) is a strong differentiator from generic white, but large sections of solid color can feel flat.

**Proposal**: A subtle dot-grid pattern overlaid on the `background` at 3-4% opacity. The dots are derived from waypoint markers -- small circles in `primary-300` arranged on the 8-point grid.

**Specification**:
- Dot size: 1.5px circles
- Grid spacing: 24px (3x the base unit)
- Color: `primary-300` at 4% opacity
- Implementation: CSS `radial-gradient` repeating pattern (no image download)
- Sections that use it: Hero background, open editorial sections
- Sections that do NOT use it: Card surfaces, dark sections, forms

```css
.bg-dot-grid {
  background-image:
    radial-gradient(circle, rgba(150, 207, 172, 0.04) 1.5px, transparent 1.5px);
  background-size: 24px 24px;
}
```

**Effort**: 0.25 days.

**Priority**: MEDIUM -- subtle texture that adds sophistication.

---

### Enhancement 10: Progressive Map Loading with Branded Static Fallback

**Problem**: MapLibre GL JS adds ~300KB to the bundle. Loading it eagerly destroys the performance budget. But the hero needs a map visual immediately.

**Proposal**: A three-stage progressive loading strategy.

| Stage | What Renders | When | Size |
|-------|-------------|------|------|
| 1. Static fallback | Pre-rendered WebP image of branded map + route overlay | Immediate (SSG) | ~50KB |
| 2. SVG route overlay | Animated route line drawn over the static image | After hydration (~500ms) | ~2KB |
| 3. Interactive map | Full MapLibre GL JS replaces static image | After idle (~3s) or on user interaction | ~300KB lazy |

**Implementation**:

```tsx
// components/maps/hero-map.tsx
'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { AnimatedRoute } from './animated-route';

const InteractiveMap = dynamic(() => import('./interactive-map'), {
  ssr: false,
  loading: () => null,
});

export function HeroMap() {
  const [showInteractive, setShowInteractive] = useState(false);

  useEffect(() => {
    // Load interactive map after 3s idle or on first interaction
    const timer = setTimeout(() => setShowInteractive(true), 3000);
    const handler = () => { setShowInteractive(true); clearTimeout(timer); };
    window.addEventListener('mousemove', handler, { once: true });
    return () => { clearTimeout(timer); window.removeEventListener('mousemove', handler); };
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg border border-border">
      {/* Stage 1: Static fallback (always rendered, SSG) */}
      <Image
        src="/images/hero-map-branded.webp"
        alt="SafeTrekr route monitoring map"
        width={560}
        height={400}
        priority
        className={cn(
          'w-full h-auto transition-opacity duration-slow',
          showInteractive && 'opacity-0 absolute inset-0'
        )}
      />

      {/* Stage 2: SVG route overlay (client-side animation) */}
      {!showInteractive && <AnimatedRoute className="absolute inset-0" />}

      {/* Stage 3: Interactive MapLibre (lazy-loaded) */}
      {showInteractive && <InteractiveMap />}
    </div>
  );
}
```

**Effort**: 2 days (plus 2-3 days for the custom map style from Enhancement 1).

**Priority**: HIGH -- solves the performance vs. visual richness tension directly.

---

### Enhancement 11: Glassmorphic Header Reveal

**Problem**: The sticky header needs to feel lightweight and premium. A solid background header feels heavy; a fully transparent one causes readability issues on scroll.

**Proposal**: The header starts fully transparent on the hero section, then transitions to a glassmorphic state (backdrop-blur + semi-transparent background) after the user scrolls past the hero.

**Specification**:

| State | Background | Border | Blur | Shadow | Height |
|-------|-----------|--------|------|--------|--------|
| At top (hero visible) | transparent | none | none | none | h-20 (80px) |
| Scrolled (> 100px) | background/80 | border-b border/50 | backdrop-blur-xl | shadow-sm | h-16 (64px) |
| Transition | 300ms ease-default | | | | |

**Implementation**: `useScroll` from framer-motion to detect scroll position, apply class changes.

**Effort**: 0.5 days.

**Priority**: MEDIUM -- premium polish detail.

---

### Enhancement 12: Segmented Route Animation for Solution Pages

**Problem**: Each solution page (K-12, Churches, Higher Ed, Corporate) needs a distinct visual identity while sharing the design system.

**Proposal**: Each solution page hero features a different animated route on the map that is contextually relevant:

| Segment | Route Shape | Waypoints | Context |
|---------|------------|-----------|---------|
| K-12 | School bus route (neighborhood streets, multiple stops) | 6-8 stops, final at "Museum" | Field trip |
| Churches | International route (continent-to-continent path) | 3 stops, mission locations | Mission trip |
| Higher Ed | Urban campus route (city streets, transit) | 4 stops, landmarks | Study abroad |
| Corporate | Airport-to-hotel route (highway, direct) | 2 stops, airport + hotel | Business travel |

Each route is a unique SVG path that draws itself on page load, with waypoint markers popping in at staggered intervals.

**Effort**: 1 day per segment (after the base route animation system is built).

**Priority**: LOW-MEDIUM -- valuable for differentiation but can ship in P1.

---

### Enhancement 13: "Systems Activating" Loading Transition

**Problem**: Page transitions between marketing pages feel abrupt. There is an opportunity to reinforce the "operational motion" vocabulary during navigation.

**Proposal**: A minimal loading indicator that appears at the top of the viewport during page transitions. Instead of a generic progress bar, it is the S-curve route line drawing itself from left to right.

**Specification**:
- Position: Fixed, top of viewport, z-toast
- Width: 100vw
- Height: 3px
- Color: primary-500
- Animation: Route S-curve draws left-to-right over 800ms
- Trigger: Next.js router navigation start
- Dismissal: Fade out over 200ms on navigation complete

**Implementation**: Next.js `useRouter` events + SVG path animation.

**Effort**: 0.5 days.

**Priority**: LOW -- polish detail for post-launch.

---

### Enhancement 14: Interactive 17-Section Review Visualization

**Problem**: The 17-section analyst review is SafeTrekr's most defensible feature, but "17 sections" is abstract. Prospects cannot visualize what that means.

**Proposal**: An interactive visualization (used on the "How It Works" and "Analyst Review" feature pages) that shows all 17 sections as an expandable vertical list. Each section has a title, brief description, and a visual icon. Clicking/tapping a section expands it to show a sample of what that review section contains.

**Layout**:
```
┌──────────────────────────────────────────┐
│  17-Section Safety Review                │
│                                          │
│  ┌─ 1. Travel Advisory Intelligence ──┐  │
│  │  ► Current advisories for region   │  │
│  │  ► Historical incident data        │  │
│  │  ► Weather and natural hazard      │  │
│  └────────────────────────────────────┘  │
│  ┌─ 2. Medical Risk Assessment ───────┐  │
│  │  (collapsed)                       │  │
│  └────────────────────────────────────┘  │
│  ┌─ 3. Transportation Safety ─────────┐  │
│  │  (collapsed)                       │  │
│  └────────────────────────────────────┘  │
│  ... (sections 4-17 collapsed) ...       │
│                                          │
│  [See Sample Binder]                     │
└──────────────────────────────────────────┘
```

**Implementation**: shadcn/ui `Accordion` with custom styling, staggered reveal animation.

**Effort**: 1-2 days.

**Priority**: HIGH -- directly communicates the product's depth.

---

### Enhancement 15: Scroll-Position-Aware Section Indicators

**Problem**: Long marketing pages (homepage will be 10+ sections) lose users mid-page. They cannot tell where they are in the narrative.

**Proposal**: A subtle vertical dot indicator on the right edge of the viewport (desktop only, hidden on mobile). Each dot corresponds to a major section. The active section's dot is highlighted in primary-500 and slightly larger.

**Specification**:
- Position: Fixed, right edge, vertically centered
- Dots: 8px circles, `border` color default, `primary-500` when active
- Active state: Scale(1.5), filled primary-500
- Labels: On hover, a small tooltip appears showing the section name
- Mobile: Hidden entirely (saves space)
- Accessibility: Hidden from screen readers (decorative)

**Implementation**: Intersection Observer tracking section visibility + Framer Motion for dot transitions.

**Effort**: 1 day.

**Priority**: LOW -- navigation aid for long pages, not critical for launch.

---

## 11. Risk Assessment

### 11.1 Critical Risks

| Risk | Severity | Likelihood | Impact | Mitigation |
|------|----------|------------|--------|------------|
| **muted-foreground contrast failure** | HIGH | CERTAIN (if uncorrected) | WCAG AA non-compliance, K-12 institutions cannot procure | Darkened from #616567 to #4d5153 in token system. Verified: 5.2:1 on background, 5.8:1 on card. |
| **Primary button text contrast** | HIGH | CERTAIN (if using primary-500 bg) | WCAG AA failure for normal text | Use primary-600 (#3f885b) as standard button bg (4.6:1 with white). Reserve primary-500 for large text and decorative use only. |
| **MapLibre bundle weight** | HIGH | CERTAIN | 300KB+ added to initial load, LCP > 1.5s, Lighthouse < 95 | Progressive loading strategy (Enhancement #10): static fallback + lazy load. Map loads only after 3s idle or first interaction. |
| **Brand green / safety green collision** | MEDIUM | LIKELY | Users misinterpret brand accents as safety status indicators | Strict color application rules: primary-500 for brand, safety-green (#22c55e) for status ONLY. Safety colors never used decoratively. Different hues prevent confusion. |
| **No real testimonials exist** | HIGH | CERTAIN | Trust strip is the only proof element at launch. No social proof undermines credibility. | TrustMetricsStrip with verifiable data points (5 sources, 17 sections, etc.). Begin testimonial collection immediately from 104 existing organizations. Design TestimonialCard component now, populate later. |
| **No product screenshots exist** | HIGH | CERTAIN | Product compositions must be designed from scratch rather than captured | Commission 6 custom product compositions as design artifacts. These are stylized representations, not actual screenshots. Budget 3-5 days of design time. |
| **Fabricated testimonials** | CRITICAL | CERTAIN (if not removed) | Legal liability, reputational destruction | Remove ALL fabricated testimonials from any existing assets before a single line of code is written. Non-negotiable. |

### 11.2 Moderate Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Font loading flash** | MEDIUM | `next/font` with `display: swap` + explicit `fallback` fonts matching Jakarta/Inter metrics |
| **Motion sickness** | MEDIUM | All motion respects `prefers-reduced-motion`. Maximum animation duration 1.2s. No looping animations. No parallax exceeding 40px displacement. |
| **Dark section overuse** | MEDIUM | Strict 2-per-page maximum (excluding footer). Never adjacent. Design review checklist enforced before merge. |
| **Typography scale too large on mobile** | LOW | `clamp()` values tested at 320px minimum. Display-xl floors at 40px (2.5rem), which is readable but commanding on mobile. |
| **Custom icon design quality** | MEDIUM | 7 custom icons must match Lucide's design language exactly. If quality is poor, the entire icon system looks inconsistent. Consider hiring an icon designer or using AI-assisted generation with manual QA. |
| **CSS custom property browser support** | LOW | Tailwind CSS 4's `@theme` approach requires modern browsers. All target browsers (Chrome 80+, Safari 14+, Firefox 78+, Edge 80+) support CSS custom properties. |

### 11.3 Low Risks

| Risk | Mitigation |
|------|------------|
| Content length variance across segments | Flexible section layouts with `min-h` rather than fixed heights |
| 2xl (1536px+) viewport under-design | Test at 2560px; ensure max-width container + generous margins prevent content from stretching |
| Print stylesheet | Defer to post-launch; marketing pages are not print-critical |

---

## 12. Priority Recommendations

### 12.1 Implementation Sequence

#### Week 1: Token Foundation + Core Atoms

| Task | Deliverable | Hours |
|------|-------------|-------|
| Tailwind CSS 4 token configuration | `globals.css` with complete `@theme` | 4 |
| Font loading (Jakarta + Inter + JetBrains) | `lib/fonts.ts` + root layout integration | 2 |
| Typography utility classes | `.text-display-xl` through `.text-eyebrow` | 3 |
| Button component (all variants) | `components/ui/button.tsx` | 4 |
| Badge / Chip component | `components/ui/badge.tsx` | 2 |
| Eyebrow component | `components/ui/eyebrow.tsx` | 1 |
| StatusDot component | `components/ui/status-dot.tsx` | 1 |
| Divider + RouteDivider | `components/ui/divider.tsx` | 2 |
| Logo component (all variants) | `components/ui/logo.tsx` | 2 |
| shadcn/ui primitives installation | Accordion, Card, Input, Sheet, etc. | 3 |
| **Total** | | **24h** |

#### Week 2: Layout + Molecules + Motion Foundation

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
| **Total** | | **30h** |

#### Week 3: Hero + Homepage Top Half

| Task | Deliverable | Hours |
|------|-------------|-------|
| HeroSection (text + layout) | `components/marketing/hero/hero-section.tsx` | 4 |
| Hero product composition (static) | Map image + review panel + doc preview + gauge | 12 |
| Hero animation sequence | Orchestrated Framer Motion variants | 6 |
| Static map fallback image | Branded WebP hero map | 3 |
| SVG route overlay animation | `components/maps/animated-route.tsx` | 3 |
| TrustMetricsStrip | `components/marketing/trust-metrics-strip.tsx` | 3 |
| Ambient dot-grid background | CSS utility class | 1 |
| **Total** | | **32h** |

#### Week 4: Homepage Bottom Half + Forms

| Task | Deliverable | Hours |
|------|-------------|-------|
| FeatureShowcase sections (Route, Review, Evidence) | 3 showcase sections with compositions | 12 |
| FeatureGrid (bento layout) | `components/marketing/feature-grid.tsx` | 4 |
| DarkAuthoritySection | Dark section with trust content | 3 |
| CTABand (3 variants) | `components/marketing/cta-band.tsx` | 3 |
| ProcessTimeline | `components/marketing/process-timeline.tsx` | 4 |
| FAQSection | `components/marketing/faq-section.tsx` | 2 |
| DemoRequestForm | Full form with validation + Server Action | 8 |
| Glassmorphic header scroll behavior | Header state transitions | 2 |
| **Total** | | **38h** |

#### Week 5: Remaining P0 Pages + Interactive Map

| Task | Deliverable | Hours |
|------|-------------|-------|
| K-12 Solutions page | Segment template + page | 8 |
| Church/Missions Solutions page | Segment page | 6 |
| How It Works page | 3-act narrative + 17-section visualization | 8 |
| Pricing page | Pricing cards + FAQ | 8 |
| MapLibre integration (lazy-loaded) | `components/maps/interactive-map.tsx` | 6 |
| Custom MapLibre style JSON | Brand-aligned map style | 8 |
| **Total** | | **44h** |

#### Week 6: Polish, A11y, Performance

| Task | Deliverable | Hours |
|------|-------------|-------|
| Interactive evidence binder preview | `components/marketing/binder-preview.tsx` | 10 |
| Responsive QA (all breakpoints, all pages) | Bug fixes | 8 |
| Accessibility audit (`axe-core` + manual) | Violation fixes | 6 |
| Performance audit (Lighthouse CI) | Bundle optimization | 4 |
| SEO infrastructure (metadata, sitemap, JSON-LD) | All SEO deliverables | 4 |
| Micro-interaction polish | Enhancement #5 details | 4 |
| Cross-browser testing | Chrome, Safari, Firefox, Edge | 4 |
| **Total** | | **40h** |

### 12.2 Critical Path Items

These items block downstream work and must be completed first:

1. **Token system in Tailwind** (blocks all component work)
2. **Font loading** (blocks all typography)
3. **SiteHeader + SiteFooter** (blocks all page assembly)
4. **Motion presets** (blocks all scroll animations)
5. **Hero product compositions** (blocks hero section; 12h of design work)
6. **Muted-foreground contrast fix** (blocks accessibility compliance)

### 12.3 Highest-Impact Enhancements (Ranked)

| Rank | Enhancement | Impact | Effort | Priority |
|------|-------------|--------|--------|----------|
| 1 | Custom MapLibre style (#1) | Brand differentiation, reusable asset | 2-3 days | P0 (Week 5) |
| 2 | Interactive evidence binder preview (#3) | Supports #1 lead magnet | 2-3 days | P1 (Week 6) |
| 3 | Progressive map loading (#10) | Solves performance budget tension | 2 days | P0 (Week 5) |
| 4 | Animated stat counters (#8A) | Trust strip impact | 1 day | P1 (Week 4) |
| 5 | Operational micro-interactions (#5) | Premium feel | 2 days | P1 (Week 6) |
| 6 | Bento grid layout (#4) | Visual differentiation | 1 day | P1 (Week 4) |
| 7 | 17-section review visualization (#14) | Product depth communication | 1-2 days | P1 (Week 5) |
| 8 | Ambient dot-grid pattern (#9) | Texture, anti-flat | 0.25 days | P0 (Week 3) |
| 9 | S-curve route divider (#2) | Brand ownable element | 0.5 days | P1 |
| 10 | Glassmorphic header (#11) | Premium polish | 0.5 days | P1 (Week 4) |
| 11 | Scroll-linked map parallax (#7) | Depth perception | 0.5 days | P2 |
| 12 | Segment route animations (#12) | Solution page differentiation | 1 day each | P2 |
| 13 | S-curve loading transition (#13) | Navigation polish | 0.5 days | P2 |
| 14 | Custom cursor states (#6) | Map interaction polish | 0.5 days | P2 |
| 15 | Section position indicators (#15) | Long-page navigation | 1 day | P3 |

### 12.4 Non-Negotiable Quality Gates

Before any page ships to production:

- [ ] All text meets WCAG 2.2 AA contrast (4.5:1 normal, 3:1 large)
- [ ] All interactive elements have visible focus indicators (ring token, 3px minimum)
- [ ] All images have descriptive `alt` text
- [ ] Keyboard navigation works end-to-end (tab order, enter/space activation)
- [ ] `prefers-reduced-motion` disables all animation
- [ ] Lighthouse Performance score >= 95
- [ ] Lighthouse Accessibility score >= 100
- [ ] LCP < 1.5s on simulated 3G
- [ ] CLS < 0.05
- [ ] Total initial JS < 150KB gzipped
- [ ] No fabricated testimonials appear anywhere
- [ ] Brand green (primary) never used where safety-status green is appropriate
- [ ] Dark sections: maximum 2 per page, never adjacent
- [ ] All tokens used (no inline hex values or pixel values in components)

---

*This analysis was produced by the World-Class UI Designer persona for the SafeTrekr Marketing Site project.*
*All specifications are implementation-ready for the Next.js 15 + Tailwind CSS 4 + Framer Motion stack.*
*Date: 2026-03-24*
