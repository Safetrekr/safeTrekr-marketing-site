# React Developer Analysis: SafeTrekr Marketing Site

**Date**: 2026-03-24
**Analyst**: React Developer (Deep Analysis Mode)
**Stack**: Next.js 15 (App Router) + React 19 + Tailwind CSS 4 + Framer Motion + MapLibre GL JS + shadcn/ui + Vercel
**Mode**: Greenfield -- zero existing code
**Input Sources**: 8-agent discovery suite, visual system guide, design briefs, CTA architecture discovery

---

## Table of Contents

1. [Feature Documentation](#feature-documentation)
2. [Enhancement Proposals](#enhancement-proposals)
3. [Risk Assessment](#risk-assessment)
4. [Priority Recommendations](#priority-recommendations)

---

## Feature Documentation

### F01: Project Scaffolding

#### Package Dependencies (Estimated)

```jsonc
// package.json -- core dependencies
{
  "dependencies": {
    "next": "^15.2.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^11.15.0",
    "maplibre-gl": "^4.7.0",
    "@radix-ui/react-accordion": "^1.x",
    "@radix-ui/react-dialog": "^1.x",
    "@radix-ui/react-dropdown-menu": "^1.x",
    "@radix-ui/react-navigation-menu": "^1.x",
    "@radix-ui/react-tabs": "^1.x",
    "@radix-ui/react-tooltip": "^1.x",
    "@radix-ui/react-scroll-area": "^1.x",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "zod": "^3.x",
    "class-variance-authority": "^0.7.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "lucide-react": "^0.450.x",
    "resend": "^4.x",
    "@vercel/analytics": "^1.x",
    "next-mdx-remote": "^5.x",
    "gray-matter": "^4.x",
    "sharp": "^0.33.x"
  },
  "devDependencies": {
    "typescript": "^5.7.x",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "tailwindcss": "^4.x",
    "@tailwindcss/postcss": "^4.x",
    "postcss": "^8.x",
    "eslint": "^9.x",
    "eslint-config-next": "^15.x",
    "@eslint/js": "^9.x",
    "typescript-eslint": "^8.x",
    "eslint-plugin-jsx-a11y": "^6.x",
    "prettier": "^3.x",
    "prettier-plugin-tailwindcss": "^0.6.x",
    "@playwright/test": "^1.49.x",
    "vitest": "^2.x",
    "@testing-library/react": "^16.x",
    "@testing-library/jest-dom": "^6.x",
    "@testing-library/user-event": "^14.x",
    "jsdom": "^25.x",
    "axe-core": "^4.x",
    "@axe-core/playwright": "^4.x",
    "jest-axe": "^9.x",
    "@lhci/cli": "^0.14.x",
    "bundlewatch": "^0.4.x",
    "msw": "^2.x"
  }
}
```

#### TypeScript Configuration

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/content/*": ["./src/content/*"],
      "@/actions/*": ["./src/actions/*"],
      "@/styles/*": ["./src/styles/*"]
    },
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": false,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Key decisions**:
- `noUncheckedIndexedAccess: true` -- Forces null-checking on array/object index access. Prevents entire class of runtime errors.
- `exactOptionalPropertyTypes: false` -- Keeps ergonomic. Can enable later when team is comfortable.
- Path aliases for every import domain. Prevents `../../../` chains.
- `ES2022` target for top-level await, `at()`, `structuredClone()` support.

#### Next.js Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // MapTiler static tiles (fallback map images)
      { protocol: 'https', hostname: 'api.maptiler.com' },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://plausible.io",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://api.maptiler.com https://*.tile.openstreetmap.org",
              "font-src 'self'",
              "connect-src 'self' https://plausible.io https://api.maptiler.com https://*.supabase.co",
              "frame-src https://challenges.cloudflare.com",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      // Future: redirect legacy URLs when migrating from old site
    ];
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    // PPR when stable: ppr: true,
  },
};

export default nextConfig;
```

#### Tailwind CSS 4 Configuration

Tailwind CSS 4 uses CSS-first configuration via `@theme` directive. The `tailwind.config.ts` file is replaced by `@import "tailwindcss"` and `@theme` blocks in `globals.css`. A minimal `tailwind.config.ts` may still be needed for content paths if auto-detection is insufficient:

```typescript
// tailwind.config.ts (minimal -- most config in globals.css @theme)
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

---

### F02: Design System Implementation

#### globals.css -- Token System

The visual system guide defines 60+ tokens. These translate directly to CSS custom properties consumed by Tailwind CSS 4's `@theme inline` directive.

```css
/* src/styles/globals.css */
@import "tailwindcss";

@theme inline {
  /* === Semantic Colors === */
  --color-background: #e7ecee;
  --color-foreground: #061a23;
  --color-card: #f7f8f8;
  --color-card-foreground: #061a23;
  --color-border: #b8c3c7;
  --color-input: #80959b;
  --color-ring: #365462;
  --color-muted: #e7ecee;
  --color-muted-foreground: #555a5d; /* Darkened from #616567 per a11y audit */

  /* === Brand Primary Scale === */
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
  --color-primary: #4ca46e;         /* Alias for primary-500 */
  --color-primary-foreground: #ffffff;

  /* === Secondary (Authority Blue) === */
  --color-secondary: #123646;
  --color-secondary-foreground: #e7ecee;

  /* === Destructive === */
  --color-destructive: #c1253e;
  --color-destructive-foreground: #ffffff;

  /* === Safety Status (Operational Only) === */
  --color-safety-green: #22c55e;
  --color-safety-yellow: #eab308;
  --color-safety-red: #ef4444;

  /* === Warning Scale === */
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

  /* === Typography === */
  --font-display: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* === Border Radius === */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;

  /* === Shadows (cool-toned from foreground) === */
  --shadow-sm: 0 1px 2px 0 rgba(6, 26, 35, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(6, 26, 35, 0.07), 0 2px 4px -2px rgba(6, 26, 35, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(6, 26, 35, 0.08), 0 4px 6px -4px rgba(6, 26, 35, 0.04);
  --shadow-xl: 0 20px 25px -5px rgba(6, 26, 35, 0.1), 0 8px 10px -6px rgba(6, 26, 35, 0.06);

  /* === Spacing (8-point grid) === */
  --spacing-section-desktop: 128px;   /* 96px-160px range */
  --spacing-section-tablet: 80px;     /* 64px-96px range */
  --spacing-section-mobile: 64px;     /* 48px-80px range */

  /* === Breakpoints === */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;

  /* === Content Widths === */
  --width-content: 1280px;
  --width-full-bleed: 1440px;

  /* === Animation Tokens === */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-enter: cubic-bezier(0.0, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 500ms;
  --duration-slower: 800ms;
  --duration-reveal: 800ms;
  --duration-draw: 1200ms;
}

/* === Base Styles === */
@layer base {
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-body);
  }

  /* Focus visible for keyboard navigation */
  *:focus-visible {
    outline: 2px solid var(--color-ring);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Skip link */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    padding: 8px 16px;
    background: var(--color-secondary);
    color: var(--color-secondary-foreground);
    z-index: 100;
    transition: top var(--duration-fast) var(--ease-default);
  }

  .skip-link:focus {
    top: 0;
  }
}
```

**Critical a11y note**: The UI design discovery flagged that `muted-foreground` (#616567) on `background` (#e7ecee) yields approximately 4.0:1 contrast, failing WCAG 2.2 AA (4.5:1 required for normal text). The token above is darkened to #555a5d (~4.6:1). This must be validated with a contrast checker before finalizing.

#### Typography Utility Classes

```css
@layer utilities {
  .text-display-xl {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 5vw, 4.5rem);  /* 40px -> 72px */
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.025em;
  }

  .text-display-lg {
    font-family: var(--font-display);
    font-size: clamp(2.125rem, 4vw, 3.5rem); /* 34px -> 56px */
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  .text-display-md {
    font-family: var(--font-display);
    font-size: clamp(1.75rem, 3vw, 2.75rem); /* 28px -> 44px */
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.015em;
  }

  .text-eyebrow {
    font-family: var(--font-body);
    font-size: 0.8125rem; /* 13px */
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
}
```

#### Tailwind Theme Extension

Tailwind CSS 4 consumes the CSS custom properties automatically via `@theme inline`. Custom utilities for the type scale, section spacing, and motion tokens ensure consistent application across components.

---

### F03: Component Library

#### Architecture Layers

```
Layer 0: Primitives (shadcn/ui + Radix)
  Button, Card, Input, Textarea, Label, Badge, Separator,
  Accordion, Tabs, Dialog, Sheet, DropdownMenu, Tooltip,
  NavigationMenu, ScrollArea

Layer 1: Design System Extensions
  Applies SafeTrekr tokens (variants, sizes, colors) on top
  of shadcn/ui primitives. CVA (class-variance-authority) for
  variant management.

Layer 2: Marketing Composites
  FeatureCard, StatCard, TestimonialCard, PricingTier,
  IndustryCard, MotifBadge, DocumentPreview, MapFragment,
  TimelineStep, LogoCloud, TrustMetric

Layer 3: Page Sections (Server Components by default)
  HeroHome, FeatureGrid, FeatureShowcase, TrustStrip,
  CTABand, DarkAuthoritySection, ProcessTimeline, FAQSection,
  PricingGrid, SocialProofStrip, MotifSection

Layer 4: Pages (composed entirely from Layer 3 sections)
  Homepage, HowItWorks, Pricing, Solutions/*, Features/*,
  About, Contact, Demo, Blog/*, Legal/*
```

#### Key Component Specifications

**Button** (Layer 1 -- shadcn/ui extended)

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'ghost' | 'link' | 'primary-on-dark';
  size: 'sm' | 'md' | 'lg';
  asChild?: boolean;  // Radix Slot for polymorphic rendering
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Variants via CVA:
// primary:   bg-primary-500, text-white, hover:bg-primary-600
// secondary: bg-transparent, border-border, text-foreground, hover:bg-primary-50
// primary-on-dark: bg-white, text-secondary, hover:bg-card
// ghost:     bg-transparent, text-foreground, hover:bg-muted
// link:      text-foreground, underline-offset-4, hover:underline
```

**SectionContainer** (Layer 2 -- layout primitive)

```typescript
interface SectionContainerProps {
  children: React.ReactNode;
  variant: 'default' | 'brand-wash' | 'dark-authority' | 'card-surface';
  padding: 'sm' | 'md' | 'lg';  // Maps to section spacing tokens
  maxWidth: 'content' | 'full-bleed';
  as?: 'section' | 'div' | 'article';
  id?: string;       // For scroll-spy anchor
  className?: string;
}

// variant effects:
// default:        bg-background
// brand-wash:     bg-primary-50
// dark-authority: bg-secondary, text-secondary-foreground
// card-surface:   bg-card
```

**FeatureCard** (Layer 2 -- marketing composite)

```typescript
interface FeatureCardProps {
  icon: React.ReactNode;          // Lucide icon or custom SVG
  title: string;
  description: string;
  href?: string;                  // Optional link to feature page
  badge?: string;                 // Optional label like "New" or "Coming Soon"
  motif?: 'route' | 'review' | 'record' | 'readiness';  // Visual motif accent
}

// Renders: Card surface, icon with motif-colored background,
// headline, description, optional badge, optional arrow link.
// Responsive: Full-width mobile, 2-col tablet, 3-col desktop.
```

**HeroHome** (Layer 3 -- page section)

```typescript
interface HeroHomeProps {
  headline: string;
  subheadline: string;
  primaryCTA: { label: string; href: string };
  secondaryCTA: { label: string; href: string };
}

// Server Component (static content).
// Client boundary only for:
//   1. Framer Motion entrance animations (ScrollReveal wrapper)
//   2. MapLibre interactive map (lazy-loaded via next/dynamic)
// Layout: 5-col text / 7-col visual composition on desktop.
// Mobile: Stacked, simplified to map fragment + route line.
// Animation sequence: ~1800ms total (see F04 Animation System).
```

**PricingTier** (Layer 2)

```typescript
interface PricingTierProps {
  name: string;                    // "Field Trip" | "Expedition" | "Enterprise"
  pricePerStudent: number;         // Display as "$15/student"
  pricePerTrip: number;            // Secondary display
  features: string[];
  highlighted?: boolean;           // "Most Popular" badge + ring
  ctaLabel: string;
  ctaHref: string;
  disclaimer?: string;
}
```

**TrustStrip** (Layer 3 -- replaces fabricated testimonials)

```typescript
interface TrustStripProps {
  metrics: Array<{
    value: string;   // "5", "17", "3-5 Day", "AES-256", "SHA-256"
    label: string;   // "Government Intel Sources", "Safety Review Sections", etc.
  }>;
  variant: 'light' | 'dark';
}

// Server Component. No client JS.
// Horizontal scroll on mobile, grid on desktop.
// Dark variant uses secondary background.
```

#### Responsive Behavior

All components follow the breakpoint system from the UI discovery:

| Breakpoint | Width | Layout Strategy |
|------------|-------|-----------------|
| base | 0-639px | Single column, stacked sections |
| sm | 640px | Minor adjustments (padding, font scaling) |
| md | 768px | Two-column begins for cards, side-by-side for hero |
| lg | 1024px | Full 12-column grid activated |
| xl | 1280px | Max content width (1280px) |
| 2xl | 1536px | Centered with generous margins |

Typography scales via `clamp()`:
- `display-xl`: 72px (desktop) to 40px (mobile)
- `display-lg`: 56px (desktop) to 34px (mobile)
- All display sizes use fluid scaling via viewport-relative `clamp()` functions

---

### F04: Animation System

#### Motion Preset Library (`lib/motion.ts`)

```typescript
// src/lib/motion.ts
import type { Variants, Transition } from 'framer-motion';

// === Easing Curves ===
export const easing = {
  default: [0.4, 0, 0.2, 1] as const,       // Calm, operational
  enter: [0.0, 0, 0.2, 1] as const,          // Decelerating entry
  spring: [0.22, 1, 0.36, 1] as const,       // System activating
} satisfies Record<string, readonly [number, number, number, number]>;

// === Durations (seconds) ===
export const duration = {
  fast: 0.15,
  normal: 0.2,
  slow: 0.5,
  slower: 0.8,
  reveal: 0.8,
  draw: 1.2,
} as const;

// === Reusable Transitions ===
export const transitions = {
  default: { duration: duration.normal, ease: easing.default } satisfies Transition,
  reveal: { duration: duration.reveal, ease: easing.enter } satisfies Transition,
  spring: { duration: duration.slow, ease: easing.spring } satisfies Transition,
} as const;

// === Animation Variants ===
export const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: transitions.reveal },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: transitions.reveal },
  },
  staggerContainer: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  },
  cardReveal: {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: duration.slow, ease: easing.spring },
    },
  },
  routeDraw: {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1, opacity: 1,
      transition: { duration: duration.draw, ease: easing.default },
    },
  },
  markerPop: {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1, opacity: 1,
      transition: { duration: duration.normal, ease: easing.spring },
    },
  },
} satisfies Record<string, Variants>;
```

#### ScrollReveal Component

```typescript
// src/components/motion/scroll-reveal.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { variants as motionVariants, type variants } from '@/lib/motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: keyof typeof motionVariants;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  once?: boolean;  // default true -- animate only on first intersection
}

// Uses IntersectionObserver via Framer Motion's whileInView.
// Respects prefers-reduced-motion: skips animation entirely.
// `once: true` (default) prevents re-triggering on scroll back.
// Viewport threshold: 0.2 (20% visible triggers animation).
```

#### StaggerChildren Component

```typescript
// src/components/motion/stagger-children.tsx
'use client';

interface StaggerChildrenProps {
  children: React.ReactNode;
  staggerDelay?: number;  // default 0.08s (80ms)
  className?: string;
}

// Wraps children in a motion.div with staggerContainer variant.
// Each direct child gets animated as a stagger item.
// Used for: feature grids, trust metric strips, checklist reveals.
```

#### Hero Animation Sequence

The hero section orchestrates a 1800ms multi-stage animation:

| Time | Element | Animation | Duration |
|------|---------|-----------|----------|
| 0ms | Headline | fadeUp | 500ms |
| 150ms | Subtext | fadeUp | 500ms |
| 300ms | CTA buttons | fadeUp | 400ms |
| 400ms | Map base | fadeIn | 600ms |
| 700ms | Route line | routeDraw | 1200ms |
| 900ms | Side panel | cardReveal | 500ms |
| 1100ms | Document stack | cardReveal (staggered) | 500ms |
| 1400ms | Status dots | markerPop (3x, 80ms stagger) | 200ms each |

All animations skip entirely when `prefers-reduced-motion: reduce` is active. Content renders immediately with no motion.

---

### F05: Map Integration (MapLibre GL JS)

#### Architecture: Progressive Enhancement

The map is the highest-risk, highest-reward visual element. Architecture follows a three-stage progressive enhancement pattern:

**Stage 1 -- Static Fallback (Server-Rendered)**
- A pre-rendered map image served via `next/image` with `priority` attribute
- Generated from MapTiler Static Maps API or a pre-captured screenshot
- Prevents layout shift (explicit width/height)
- Visible immediately (no JS required)

**Stage 2 -- Lazy-Loaded Interactive Map**
- `next/dynamic` with `ssr: false` loads MapLibre GL JS only when the hero enters viewport
- IntersectionObserver triggers the dynamic import
- Loading state: the static image remains visible (no spinner)
- MapLibre bundle (~200KB gzipped) loads in parallel with page interaction

**Stage 3 -- Interactive Crossfade**
- Once MapLibre initializes, the interactive map crossfades over the static fallback
- Route animation plays (path draws in, waypoints appear)
- User can pan/zoom if desired

```typescript
// src/components/maps/hero-map.tsx
'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState, useCallback } from 'react';

// Lazy-load MapLibre only when needed
const InteractiveMap = dynamic(
  () => import('./interactive-map'),
  { ssr: false, loading: () => null } // Static fallback is already visible
);

interface HeroMapProps {
  staticSrc: string;          // Path to pre-rendered map image
  staticAlt: string;
  routeGeoJSON: GeoJSON.FeatureCollection;
  center: [number, number];   // [lng, lat]
  zoom: number;
}
```

#### Custom Map Style

MapLibre uses a custom style JSON that matches SafeTrekr's visual system:
- Desaturated base map (neutral palette)
- Route lines in `primary-500` (#4ca46e)
- Waypoint markers in `primary-600` with `primary-100` halo
- Status dots using safety colors (green/yellow/red) -- operational meaning only
- Water in a muted blue-gray
- Labels in `muted-foreground` weight

Tile source: MapTiler free tier (100,000 requests/month) or Protomaps (self-hosted PMTiles on Vercel Edge, zero per-request cost).

#### Performance Budget

| Asset | Size (gzipped) | Load Strategy |
|-------|----------------|---------------|
| maplibre-gl.js | ~180KB | Dynamic import, deferred |
| maplibre-gl.css | ~15KB | Loaded with component |
| Custom style JSON | ~5KB | Inlined or fetched |
| Route GeoJSON | ~2KB | Inlined in page props |
| Static fallback image | ~30KB | `next/image`, priority |
| **Total (interactive)** | **~230KB** | **Deferred, not blocking** |

---

### F06: Form System

#### Architecture: Server Actions + React Hook Form + Zod

Forms use a hybrid architecture:
- **Client**: React Hook Form for UX (instant validation, focus management, field state)
- **Validation**: Zod schemas shared between client and server
- **Submission**: Next.js Server Actions (progressive enhancement -- forms work without JS)
- **Email delivery**: Resend API
- **Bot protection**: Cloudflare Turnstile (invisible challenge)
- **Persistence**: Supabase (separate marketing project)

#### Form Types

| Form | Fields (Step 1) | Fields (Step 2) | Server Action | Email Template |
|------|-----------------|-----------------|---------------|----------------|
| Demo Request | email, org_name | role, segment, trips_per_year | `requestDemo` | Welcome + internal notification |
| Contact | email, name, message | -- | `submitContact` | Acknowledgment + internal |
| Newsletter | email | -- | `subscribeNewsletter` | Double opt-in confirmation |
| Quote Request | email, org_name, segment | trips_per_year, travelers_per_trip, timeline | `requestQuote` | Quote details + internal |
| Sample Binder | email, org_type | -- | `requestSampleBinder` | Binder PDF delivery |

#### Zod Schema Pattern

```typescript
// src/lib/schemas/demo-request.ts
import { z } from 'zod';

export const demoRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  orgName: z.string().min(2, 'Organization name is required').max(200),
  role: z.enum(['coordinator', 'administrator', 'risk-manager', 'procurement', 'other']).optional(),
  segment: z.enum(['k12', 'higher-ed', 'churches', 'corporate', 'sports', 'other']).optional(),
  tripsPerYear: z.coerce.number().min(1).max(10000).optional(),
  honeypot: z.string().max(0),  // Bot trap -- must be empty
  turnstileToken: z.string().min(1, 'Please complete the verification'),
});

export type DemoRequestInput = z.infer<typeof demoRequestSchema>;
```

#### Server Action Pattern

```typescript
// src/actions/demo-request.ts
'use server';

import { demoRequestSchema } from '@/lib/schemas/demo-request';
import { verifyTurnstile } from '@/lib/turnstile';
import { sendEmail } from '@/lib/email';
import { supabase } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

export async function requestDemo(formData: FormData) {
  // 1. Rate limit check (10 per IP per hour)
  // 2. Parse and validate with Zod (server-side)
  // 3. Verify Turnstile token
  // 4. Check honeypot field
  // 5. Sanitize inputs
  // 6. Persist to Supabase
  // 7. Send notification email via Resend
  // 8. Send confirmation email to requester
  // 9. Return typed result
}
```

#### 8-Layer Form Security (per CTA discovery)

1. Client-side Zod validation (immediate UX feedback)
2. Cloudflare Turnstile challenge (invisible, privacy-preserving)
3. Server-side Turnstile verification (API call to Cloudflare)
4. Server-side Zod validation (never trust client)
5. Rate limiting (10 submissions per IP per hour per form type)
6. Honeypot field detection (hidden field, must be empty)
7. Input sanitization (strip HTML, normalize whitespace)
8. IP hashing (SHA-256, stored but not PII)

---

### F07: SEO System

#### Metadata Utility (`lib/metadata.ts`)

```typescript
// src/lib/metadata.ts
import type { Metadata } from 'next';

const SITE_URL = 'https://safetrekr.com';
const SITE_NAME = 'SafeTrekr';
const DEFAULT_DESCRIPTION = 'Professional safety management for group travel. ' +
  'Analyst-reviewed trip assessments, real-time monitoring, and legally defensible documentation.';

interface PageMetadata {
  title: string;
  description: string;
  path: string;
  ogImage?: string;     // Override default OG image
  noIndex?: boolean;     // For landing pages
  article?: {
    publishedTime: string;
    modifiedTime: string;
    authors: string[];
    tags: string[];
  };
}

export function generatePageMetadata(page: PageMetadata): Metadata {
  const url = `${SITE_URL}${page.path}`;
  const ogImage = page.ogImage ?? `${SITE_URL}/api/og?title=${encodeURIComponent(page.title)}`;

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: page.title }],
      locale: 'en_US',
      type: page.article ? 'article' : 'website',
      ...(page.article && {
        publishedTime: page.article.publishedTime,
        modifiedTime: page.article.modifiedTime,
        authors: page.article.authors,
        tags: page.article.tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [ogImage],
    },
    robots: page.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
```

#### JSON-LD Generators (`lib/structured-data.ts`)

```typescript
// src/lib/structured-data.ts

// Organization -- root layout (every page)
export function generateOrganizationLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SafeTrekr',
    url: 'https://safetrekr.com',
    logo: 'https://safetrekr.com/images/logo.svg',
    description: 'Professional safety management for group travel.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'hello@safetrekr.com',
    },
  };
}

// SoftwareApplication -- homepage
export function generateSoftwareApplicationLD() { /* ... */ }

// FAQPage -- solutions pages (8-12 Q&As per page for AI citation)
export function generateFAQPageLD(faqs: Array<{ question: string; answer: string }>) { /* ... */ }

// HowTo -- How It Works page
export function generateHowToLD() { /* ... */ }

// Article -- blog posts
export function generateArticleLD(article: BlogPost) { /* ... */ }

// BreadcrumbList -- dynamic per URL
export function generateBreadcrumbLD(items: Array<{ name: string; url: string }>) { /* ... */ }

// Product -- pricing page (per trip type with Offer)
export function generateProductLD(tier: PricingTier) { /* ... */ }
```

#### sitemap.ts

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://safetrekr.com';

  const staticPages = [
    '', '/how-it-works', '/pricing', '/about', '/contact', '/demo',
    '/solutions', '/solutions/k12-schools', '/solutions/churches-missions',
    '/solutions/higher-education', '/solutions/corporate',
    '/features', '/features/analyst-review', '/features/risk-intelligence',
    '/features/evidence-binder',
    '/legal/privacy', '/legal/terms',
  ];

  const staticEntries = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1.0 : path.startsWith('/solutions') ? 0.9 : 0.8,
  }));

  // Blog posts fetched from content directory
  // const blogEntries = getBlogPosts().map(...)

  return [...staticEntries];
}
```

#### robots.ts

```typescript
// src/app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/lp/'],  // Block API routes and noindex landing pages
      },
      // Explicitly ALLOW AI crawlers (per digital marketing discovery)
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
    ],
    sitemap: 'https://safetrekr.com/sitemap.xml',
  };
}
```

---

### F08: Content System

#### Phase 1: Static TypeScript Content Files

All page content lives in typed TypeScript objects under `src/content/`. Zero CMS dependency at launch.

```typescript
// src/content/types.ts
export interface SolutionPage {
  slug: string;
  segment: 'k12' | 'higher-ed' | 'churches' | 'corporate' | 'sports';
  title: string;
  metaDescription: string;
  heroHeadline: string;
  heroSubheadline: string;
  features: FeatureItem[];
  faqs: FAQItem[];
  testimonial?: Testimonial;    // Real only -- no fabricated content
  ctaHeadline: string;
  ctaDescription: string;
  regulatoryCallouts: RegulatoryCallout[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;              // MDX string
  author: Author;
  publishedAt: string;          // ISO 8601
  updatedAt?: string;
  tags: string[];
  category: BlogCategory;
  readingTimeMinutes: number;
  seoTitle?: string;
  seoDescription?: string;
}
```

#### Phase 2: MDX Blog Architecture

```
src/content/
  blog/
    field-trip-safety-checklist-2026.mdx
    mission-trip-planning-guide.mdx
    ferpa-compliance-field-trips.mdx
  resources/
    sample-binder-overview.mdx
    roi-calculator-methodology.mdx
```

MDX processing: `next-mdx-remote` for server-side rendering with custom components (callout boxes, comparison tables, code blocks). ISR with 3600s revalidation for blog index, 86400s for individual posts.

#### Phase 3: Headless CMS Migration

When content velocity exceeds 4 posts/week, migrate to Sanity or similar. Architecture is designed so the content type interfaces remain stable -- only the data source changes.

---

### F09: Analytics Integration

#### Plausible (Primary -- Privacy-First)

```typescript
// src/app/layout.tsx
import Script from 'next/script';

// Plausible: no cookies, GDPR-compliant, no consent banner needed
<Script
  defer
  data-domain="safetrekr.com"
  src="https://plausible.io/js/script.js"
  strategy="afterInteractive"
/>
```

#### Vercel Web Analytics (Core Web Vitals)

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

// In JSX:
<Analytics />
```

#### Custom Event Tracking

```typescript
// src/lib/analytics.ts

// Type-safe event names
type AnalyticsEvent =
  | { name: 'cta_click'; props: { cta_id: string; page: string; variant: string } }
  | { name: 'form_start'; props: { form_type: string; page: string } }
  | { name: 'form_submit'; props: { form_type: string; page: string } }
  | { name: 'demo_request'; props: { segment: string; org_type: string } }
  | { name: 'lead_magnet_download'; props: { magnet_type: string } }
  | { name: 'pricing_view'; props: { segment: string } }
  | { name: 'scroll_depth'; props: { depth: '25' | '50' | '75' | '100'; page: string } }
  | { name: 'video_play'; props: { video_id: string } }
  | { name: 'roi_calculator_complete'; props: { trips: number; travelers: number } };

export function trackEvent(event: AnalyticsEvent): void {
  // Plausible custom events
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(event.name, { props: event.props });
  }
}
```

**Event taxonomy** (per digital marketing discovery): `cta_click`, `form_start`, `form_submit`, `demo_request`, `lead_magnet_download`, `roi_calculator_complete`, `pricing_view`, `scroll_depth_25/50/75`, `exit_intent_shown`, `video_play`, `procurement_download`.

---

### F10: Performance Optimizations

#### Performance Budget

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP | < 1.5s (ideal < 1.2s) | Lighthouse CI in PR checks |
| INP | < 100ms (ideal < 50ms) | Vercel Web Analytics RUM |
| CLS | < 0.05 | Lighthouse CI + RUM |
| TTFB | < 100ms | Vercel Edge CDN (expected ~50ms) |
| Initial JS Bundle | < 150KB gzipped | Bundlewatch in CI |
| Total Page Weight | < 500KB (excluding lazy-loaded map) | Build analysis |
| Map Component | < 230KB gzipped | Loaded after interaction |

#### Image Pipeline

- **Format**: AVIF primary, WebP fallback (via `next/image` `formats` config)
- **Sizing**: `deviceSizes` and `imageSizes` configured for responsive breakpoints
- **Loading**: `priority` for above-fold hero, `loading="lazy"` for everything below
- **Static map fallback**: Pre-rendered at build, served as priority image
- **Logo variants**: SVG for all contexts (16 variants in `client-artifacts/design-briefs/safetrekr-logos/`)
- **Product compositions**: SVG + CSS for scalability, fallback PNGs with `sharp` optimization

#### Font Loading

```typescript
// src/lib/fonts.ts
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google';

export const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['600', '700', '800'],      // Only weights used
  preload: true,
});

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600'],
  preload: true,
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500'],
  preload: false,                      // Only used for data displays
});
```

`next/font/google` handles: automatic self-hosting (no external requests), font subsetting, `font-display: swap`, preload links for critical fonts, CSS variable injection.

#### Code Splitting Strategy

| Split Point | Strategy | Rationale |
|-------------|----------|-----------|
| MapLibre GL JS | `next/dynamic` with `ssr: false` | ~200KB, deferred until hero visible |
| Framer Motion | `optimizePackageImports` in next.config | Tree-shake to ~15KB used |
| Dialog/Sheet components | `next/dynamic` | Only loaded when user interacts |
| Blog MDX renderer | Route-level split | Only on blog pages |
| ROI Calculator | `next/dynamic` | Only on pricing page |
| Cloudflare Turnstile | Dynamic script load | Only on pages with forms |

#### Bundle Analysis

```bash
# next.config.ts -- enable bundle analyzer
# Use @next/bundle-analyzer in development
ANALYZE=true npm run build
```

---

### F11: Testing Setup

#### Test Pyramid

```
                    /\
                   /  \
                  / E2E \        Playwright: 5-10 critical paths
                 /--------\
                /Integration\    Testing Library: Component interactions
               /--------------\
              /   Unit Tests    \  Vitest: Utils, hooks, schemas
             /____________________\
```

#### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/', '**/*.d.ts', '**/*.config.*'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
```

#### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['json', { outputFile: 'e2e-results.json' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### Accessibility Testing

```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  '/', '/how-it-works', '/pricing', '/about', '/contact', '/demo',
  '/solutions/k12-schools', '/solutions/churches-missions',
];

for (const path of pages) {
  test(`${path} passes axe accessibility scan`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
```

#### Lighthouse CI

```yaml
# lighthouserc.yml
ci:
  collect:
    url:
      - http://localhost:3000/
      - http://localhost:3000/pricing
      - http://localhost:3000/solutions/k12-schools
    numberOfRuns: 3
  assert:
    assertions:
      categories:performance:
        - error
        - minScore: 0.95
      categories:accessibility:
        - error
        - minScore: 0.95
      categories:best-practices:
        - error
        - minScore: 0.95
      categories:seo:
        - error
        - minScore: 0.95
      largest-contentful-paint:
        - error
        - maxNumericValue: 1500
      cumulative-layout-shift:
        - error
        - maxNumericValue: 0.05
      interactive:
        - error
        - maxNumericValue: 3000
```

---

### F12: CI/CD Pipeline

#### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm run test:unit -- --coverage

  build:
    runs-on: ubuntu-latest
    needs: [lint-type-check]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm run build
      # Bundle size check
      - uses: bundlewatch/bundlewatch-action@v1
        with:
          bundlewatch-config: bundlewatch.config.json
          github-token: ${{ secrets.GITHUB_TOKEN }}

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e

  lighthouse:
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm run build
      - run: npx @lhci/cli autorun
```

#### Preview Deployments

Vercel automatically creates preview deployments for every PR. No additional configuration required. Each preview gets:
- Unique URL for stakeholder review
- Lighthouse CI runs against the preview URL
- Accessibility checks against live preview
- Visual regression screenshots (see Enhancement E05)

#### Production Deployment

- **Trigger**: Merge to `main`
- **Platform**: Vercel
- **Strategy**: Atomic deployments with instant rollback
- **Post-deploy**: Lighthouse CI against production, Plausible annotation

---

## Enhancement Proposals

### E01: View Transitions API for Page Navigation

**What**: Use the CSS View Transitions API to create smooth cross-page transitions when navigating between marketing pages.

**Why**: Next.js 15 supports the experimental `viewTransition` option in `<Link>`. For a site that communicates "operational motion" as a brand identity, seamless page transitions reinforce the perception of a polished, cohesive platform. Traditional full-page reloads feel jarring against the "calm authority" visual direction.

**Implementation**:
```typescript
// next.config.ts
experimental: {
  viewTransition: true,
}

// In components, use Next.js Link normally -- transitions are automatic.
// Custom transition definitions in CSS:
@view-transition {
  navigation: auto;
}

::view-transition-old(root) {
  animation: fade-out 200ms var(--ease-default);
}

::view-transition-new(root) {
  animation: fade-in 200ms var(--ease-default);
}

// Specific elements can have named transitions:
// The navbar remains static while page content transitions.
```

**Risk**: View Transitions API is supported in Chrome 111+ and Safari 18+. Firefox support is in development. For unsupported browsers, pages load normally with no transition -- this is progressive enhancement, not a hard dependency.

**Priority**: P2 (nice-to-have for launch, can add in Week 7-8 polish phase)

---

### E02: Partial Prerendering (PPR) for Dynamic Sections

**What**: Use Next.js Partial Prerendering to serve a static shell instantly while streaming dynamic content (e.g., live trust metrics, recent blog posts sidebar, form submission counts).

**Why**: PPR combines the instant TTFB of SSG with the freshness of server rendering. For a marketing site that is 95%+ static but may introduce dynamic elements (blog sidebar, real-time social proof counters, A/B test variants), PPR provides the architectural runway without rebuilding pages.

**Implementation**:
```typescript
// next.config.ts
experimental: {
  ppr: 'incremental',
}

// In a page component:
export default function PricingPage() {
  return (
    <div>
      {/* Static shell -- served from edge cache */}
      <PricingHero />
      <PricingGrid />

      {/* Dynamic section -- streamed via Suspense */}
      <Suspense fallback={<RecentBlogPostsSkeleton />}>
        <RecentBlogPosts />  {/* Server Component that fetches at request time */}
      </Suspense>

      <CTABand />
    </div>
  );
}
```

**Risk**: PPR is experimental in Next.js 15.x. It may change API surface before stabilization. The marketing site should be fully functional without PPR -- it is an optimization layer, not a dependency.

**Priority**: P2 (enable when Next.js stabilizes PPR, likely during or after initial launch)

---

### E03: React Server Components Streaming for Blog

**What**: Use RSC streaming with Suspense boundaries to progressively render blog content, showing the layout and metadata immediately while the MDX body streams in.

**Why**: Blog posts with embedded components (comparison tables, interactive demos, code blocks) can be heavy. Streaming the MDX content allows the page shell (header, sidebar, author info) to render instantly while the content body loads progressively.

**Implementation**:
```typescript
// src/app/(blog)/blog/[slug]/page.tsx
import { Suspense } from 'react';

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const metadata = await getBlogMetadata(params.slug);

  return (
    <article>
      <BlogHeader metadata={metadata} />
      <Suspense fallback={<ContentSkeleton />}>
        <BlogContent slug={params.slug} />
      </Suspense>
      <BlogFooter metadata={metadata} />
    </article>
  );
}

// BlogContent is a Server Component that reads and renders MDX
async function BlogContent({ slug }: { slug: string }) {
  const content = await getBlogContent(slug);  // MDX parsing
  return <MDXRenderer source={content} />;
}
```

**Priority**: P1 (implement when blog ships in Week 7)

---

### E04: Edge Middleware for A/B Testing

**What**: Use Vercel Edge Middleware to bucket users into A/B test variants before the page renders, enabling server-side A/B testing with zero client-side flicker.

**Why**: The digital marketing discovery identifies A/B testing as a P3 capability, but the architectural foundation should ship earlier. Edge middleware sets a cookie on first visit that determines which variant the user sees. No layout shift, no flash of wrong content.

**Implementation**:
```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // A/B test: hero CTA text
  if (!request.cookies.has('ab-hero-cta')) {
    const variant = Math.random() < 0.5 ? 'sample-binder' : 'request-demo';
    response.cookies.set('ab-hero-cta', variant, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,            // Readable by client for analytics
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

**Priority**: P2 (middleware skeleton in Week 1, actual A/B tests when traffic justifies it)

---

### E05: Automated Visual Regression Testing with Playwright

**What**: Capture screenshots of every page in every key viewport during CI and compare against baseline snapshots. Flag visual regressions before merge.

**Why**: The SafeTrekr visual system has extremely precise specifications (specific hex values, spacing tokens, shadow values). Manual visual QA is error-prone and slow. Automated visual regression catches unintended changes to spacing, color, typography, and layout across all breakpoints.

**Implementation**:
```typescript
// e2e/visual-regression.spec.ts
import { test, expect } from '@playwright/test';

const pages = [
  { path: '/', name: 'homepage' },
  { path: '/pricing', name: 'pricing' },
  { path: '/solutions/k12-schools', name: 'solutions-k12' },
  { path: '/how-it-works', name: 'how-it-works' },
  { path: '/contact', name: 'contact' },
];

const viewports = [
  { width: 375, height: 812, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1280, height: 800, name: 'desktop' },
  { width: 1536, height: 900, name: 'wide' },
];

for (const page of pages) {
  for (const viewport of viewports) {
    test(`visual: ${page.name} @ ${viewport.name}`, async ({ page: browserPage }) => {
      await browserPage.setViewportSize({ width: viewport.width, height: viewport.height });
      await browserPage.goto(page.path);
      await browserPage.waitForLoadState('networkidle');

      // Mask dynamic content (dates, random elements)
      await expect(browserPage).toHaveScreenshot(
        `${page.name}-${viewport.name}.png`,
        {
          fullPage: true,
          maxDiffPixelRatio: 0.01,  // 1% pixel tolerance
          animations: 'disabled',    // Consistent screenshots
        }
      );
    });
  }
}
```

Alternatively, integrate **Chromatic** (Storybook-based visual testing) for component-level regression.

**Priority**: P1 (set up in Week 2 alongside design system foundation)

---

### E06: Bundle Size Monitoring with Bundlewatch

**What**: Enforce bundle size budgets in CI. Every PR reports its impact on bundle size and fails if budgets are exceeded.

**Implementation**:
```jsonc
// bundlewatch.config.json
{
  "files": [
    {
      "path": ".next/static/chunks/main-*.js",
      "maxSize": "80KB"
    },
    {
      "path": ".next/static/chunks/framework-*.js",
      "maxSize": "50KB"
    },
    {
      "path": ".next/static/chunks/pages/**/*.js",
      "maxSize": "30KB"
    },
    {
      "path": ".next/static/css/**/*.css",
      "maxSize": "25KB"
    }
  ],
  "defaultCompression": "gzip",
  "ci": {
    "trackBranches": ["main"],
    "repoBranchBase": "main"
  }
}
```

**Priority**: P0 (configure in Week 1 with project scaffolding)

---

### E07: Automated Accessibility Testing in CI

**What**: Run axe-core accessibility scans against every page in CI. Block merges that introduce WCAG 2.2 AA violations.

**Why**: K-12 institutions require Section 508 compliance from vendors. A single accessibility regression could block a procurement cycle. Automated testing catches 30-50% of accessibility issues; combined with manual testing in the polish phase, this provides strong coverage.

**Implementation**: Already specified in F11 (Playwright + axe-core). The enhancement is to make this a **blocking CI gate**:

```yaml
# In .github/workflows/ci.yml
accessibility:
  runs-on: ubuntu-latest
  needs: [build]
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with: { node-version: '22', cache: 'npm' }
    - run: npm ci
    - run: npx playwright install --with-deps chromium
    - run: npm run test:a11y
    # This job MUST pass for PR to merge
```

Additionally, integrate `eslint-plugin-jsx-a11y` as an error-level (not warning-level) ESLint rule:

```typescript
// eslint.config.js
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  // ...
  {
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      ...jsxA11y.configs.strict.rules,  // Strict, not recommended
    },
  },
];
```

**Priority**: P0 (non-negotiable for enterprise K-12 buyers)

---

### E08: Dynamic OG Image Generation with Satori

**What**: Generate unique Open Graph images for every page using `@vercel/og` (Satori-based). Each OG image includes the page title, SafeTrekr branding, and a visual element matching the page's motif.

**Why**: When SafeTrekr links are shared on LinkedIn, Slack, email, or social media, a branded, contextual preview image dramatically increases click-through rates. Generic or missing OG images undermine the "premium, institutional trust" positioning.

**Implementation**:
```typescript
// src/app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'SafeTrekr';
  const subtitle = searchParams.get('subtitle') ?? 'Professional Safety Management for Group Travel';
  const motif = searchParams.get('motif') ?? 'default';

  // Load fonts
  const jakartaSansBold = await fetch(
    new URL('../../assets/fonts/PlusJakartaSans-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 80px',
        width: '1200px',
        height: '630px',
        backgroundColor: '#e7ecee',
        fontFamily: 'Plus Jakarta Sans',
      }}>
        {/* SafeTrekr logo */}
        {/* Title */}
        {/* Subtitle */}
        {/* Motif visual element */}
        {/* Brand accent bar */}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Plus Jakarta Sans', data: jakartaSansBold, weight: 700 },
      ],
    }
  );
}
```

**Priority**: P1 (implement in Week 5-6, before public sharing begins)

---

### E09: Progressive Web App (PWA) Manifest

**What**: Add a `manifest.json` and basic service worker for offline capability, installability, and improved mobile experience.

**Why**: Institutional buyers (especially trip coordinators) may bookmark the SafeTrekr site for repeated reference during vendor evaluation. A PWA manifest enables "Add to Home Screen" on mobile, custom splash screen with SafeTrekr branding, and basic offline fallback for previously visited pages.

**Implementation**:
```typescript
// src/app/manifest.ts
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SafeTrekr - Professional Safety Management',
    short_name: 'SafeTrekr',
    description: 'Professional safety management for group travel.',
    start_url: '/',
    display: 'standalone',
    background_color: '#e7ecee',
    theme_color: '#4ca46e',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
```

**Risk**: A full service worker with caching adds complexity. For a marketing site, the manifest alone (installability + theme color) provides most of the value. Defer service worker caching to P3.

**Priority**: P2 (manifest in Week 1, service worker deferred)

---

### E10: React 19 Feature Adoption

**What**: Incrementally adopt React 19 features that improve DX and UX for the marketing site.

**Features to adopt**:

| Feature | Use Case | Priority |
|---------|----------|----------|
| `useActionState` | Form submission state (pending, error, success) | P0 -- replaces manual loading/error state management |
| `useFormStatus` | Submit button loading state within form context | P0 -- progressive enhancement for forms |
| `useOptimistic` | Optimistic newsletter signup UI | P1 -- instant feedback before server confirms |
| `use` hook | Read context and promises in render | P1 -- cleaner async patterns |
| `<form action={serverAction}>` | Progressive form enhancement | P0 -- forms work without JS |
| `ref` as prop | Cleaner ref forwarding (no `forwardRef`) | P0 -- simpler component APIs |
| Metadata APIs | Document `<title>` and `<meta>` from components | Already used via Next.js |

**Implementation example** (useActionState + useFormStatus):

```typescript
// src/components/forms/demo-request-form.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { requestDemo } from '@/actions/demo-request';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} loading={pending}>
      {pending ? 'Sending...' : 'Request a Demo'}
    </Button>
  );
}

export function DemoRequestForm() {
  const [state, formAction] = useActionState(requestDemo, { success: false, errors: {} });

  return (
    <form action={formAction}>
      {/* Fields */}
      <SubmitButton />
      {state.success && <SuccessMessage />}
      {state.errors.email && <FieldError message={state.errors.email} />}
    </form>
  );
}
```

**Priority**: P0 for `useActionState`, `useFormStatus`, `ref` as prop, `<form action>`. P1 for `useOptimistic`, `use` hook.

---

### E11: Structured Data Validation in CI

**What**: Validate all JSON-LD structured data against Schema.org specifications during build. Catch invalid schema before deploy.

**Implementation**:
```typescript
// scripts/validate-structured-data.ts
// Run during CI: npx tsx scripts/validate-structured-data.ts

import { chromium } from 'playwright';

const pages = ['/', '/pricing', '/how-it-works', '/solutions/k12-schools'];

for (const path of pages) {
  // 1. Render page
  // 2. Extract all <script type="application/ld+json"> elements
  // 3. Parse JSON
  // 4. Validate against Schema.org types
  // 5. Report errors
}
```

Alternatively, use Google's Rich Results Test API in CI for production validation.

**Priority**: P1 (implement when SEO infrastructure ships)

---

### E12: Preconnect and Prefetch Strategy for Third-Party Origins

**What**: Add `<link rel="preconnect">` and `<link rel="dns-prefetch">` for all third-party origins to reduce connection latency.

**Implementation**:
```typescript
// src/app/layout.tsx
<head>
  {/* Plausible analytics */}
  <link rel="preconnect" href="https://plausible.io" />

  {/* MapTiler tiles (when map loads) */}
  <link rel="dns-prefetch" href="https://api.maptiler.com" />

  {/* Cloudflare Turnstile (when forms are visible) */}
  <link rel="dns-prefetch" href="https://challenges.cloudflare.com" />

  {/* Supabase (when forms submit) */}
  <link rel="dns-prefetch" href="https://olgjdqguafidgrutubih.supabase.co" />
</head>
```

**Priority**: P0 (add in Week 1 with root layout)

---

### E13: CSS Container Queries for Responsive Components

**What**: Use CSS Container Queries for components that need to adapt based on their container width rather than viewport width.

**Why**: Marketing composites like `FeatureCard`, `PricingTier`, and `TestimonialCard` appear in different layout contexts (2-col grid, 3-col grid, sidebar, full-width). Container queries allow these components to be truly responsive to their container, not the viewport.

**Implementation**:
```css
/* In component styles */
.feature-card-container {
  container-type: inline-size;
  container-name: feature-card;
}

@container feature-card (min-width: 400px) {
  .feature-card {
    flex-direction: row;
    gap: 1.5rem;
  }
}

@container feature-card (max-width: 399px) {
  .feature-card {
    flex-direction: column;
    gap: 1rem;
  }
}
```

**Browser support**: Container Queries are supported in Chrome 105+, Safari 16+, Firefox 110+. This covers the target audience (institutional buyers on current browsers). No polyfill needed.

**Priority**: P2 (adopt during component refinement phase)

---

### E14: Scroll-Driven Animations API as Progressive Enhancement

**What**: Use the CSS Scroll-Driven Animations API as a lightweight alternative to Framer Motion for simple scroll-triggered reveals.

**Why**: Framer Motion is the primary animation engine, but for simple opacity/transform animations triggered by scroll position, the native CSS Scroll-Driven Animations API runs entirely on the compositor thread with zero JavaScript. This reduces main thread work and improves INP scores.

**Implementation**:
```css
/* Progressive enhancement: CSS scroll animations where supported */
@supports (animation-timeline: scroll()) {
  .scroll-reveal-native {
    animation: reveal-up linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 100%;
  }

  @keyframes reveal-up {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

**Strategy**: Use CSS scroll animations for simple reveals (80% of cases). Reserve Framer Motion for complex orchestrated sequences (hero, motif sections, route drawing) that require JavaScript coordination.

**Browser support**: Chrome 115+, Edge 115+. Safari and Firefox are implementing. Graceful fallback: elements are visible without animation.

**Priority**: P3 (optimization pass after launch)

---

### E15: Automated Lighthouse CI with Performance Regression Alerts

**What**: Run Lighthouse CI on every PR and compare against baseline scores. Alert on any regression exceeding defined thresholds.

**Implementation**: Already specified in F11/F12. The enhancement is to add **regression detection**:

```yaml
# lighthouserc.yml (extended)
ci:
  assert:
    assertions:
      # Absolute thresholds (already defined)
      categories:performance:
        - error
        - minScore: 0.95

  upload:
    target: temporary-public-storage  # Or self-hosted LHCI server

  # GitHub status checks with comparison
  # Vercel integration: run against preview URLs
```

Additionally, configure **Vercel Speed Insights** for real-user monitoring (RUM) in production to catch performance regressions that lab tests miss.

**Priority**: P0 (configure in Week 1)

---

## Risk Assessment

### R01: MapLibre Bundle Weight (MEDIUM)

**Risk**: MapLibre GL JS is approximately 200KB gzipped. If the lazy-loading strategy fails (e.g., IntersectionObserver fires too eagerly, or the static fallback has a noticeable swap), this could push initial page load beyond the 150KB JS budget.

**Mitigation**:
1. Static image fallback is the default experience. Interactive map is an enhancement.
2. `next/dynamic` with `ssr: false` ensures MapLibre never enters the initial bundle.
3. Use `IntersectionObserver` with a generous threshold (e.g., element is 200px from viewport) to start loading before the user reaches the map.
4. If MapLibre proves too heavy, consider Protomaps (30KB client library) as an alternative.
5. Monitor bundle size with Bundlewatch (E06) to catch regressions.

**Probability**: Low (lazy loading is well-understood)
**Impact**: Medium (degrades LCP if loading is mishandled)

---

### R02: Framer Motion Tree-Shaking Effectiveness (LOW)

**Risk**: Framer Motion's full bundle is approximately 65KB gzipped. The discovery estimates ~15KB tree-shaken. If tree-shaking does not eliminate unused code effectively, the animation system could significantly inflate the initial bundle.

**Mitigation**:
1. Next.js 15's `optimizePackageImports` for `framer-motion` handles tree-shaking.
2. Import only from specific subpaths: `framer-motion/dom` where possible.
3. Use `motion/react` (the lightweight export) instead of `framer-motion` when available.
4. Bundlewatch (E06) will flag if the Framer Motion chunk exceeds its budget.
5. Fallback: Replace Framer Motion with CSS animations + `IntersectionObserver` for most effects. Reserve Framer Motion only for SVG path drawing (route animation) that CSS cannot handle.

**Probability**: Low
**Impact**: Medium

---

### R03: Contrast Ratio Compliance (HIGH)

**Risk**: The UI design discovery flagged that `muted-foreground` (#616567) on `background` (#e7ecee) yields approximately 4.0:1 contrast ratio, failing WCAG 2.2 AA (4.5:1 required for normal text). Additionally, `primary-300` and lighter greens used for text on light backgrounds will fail contrast requirements.

**Mitigation**:
1. Darken `muted-foreground` to #555a5d (approximately 4.6:1) -- already reflected in the token system above.
2. Establish a contrast validation step in the component review process.
3. Add axe-core automated testing in CI (E07) to catch contrast failures.
4. Create a "contrast-safe pairs" reference table for the design system documentation.
5. Never use `primary-300` or lighter for text. Reserve light tints for backgrounds only.

**Probability**: High (already identified in discovery)
**Impact**: High (blocks K-12 procurement, legal risk)

---

### R04: Content Dependencies -- Zero Real Social Proof (HIGH)

**Risk**: The site launches without real testimonials, case studies, or review platform presence (G2, Capterra). The fabricated testimonials must be removed (legal/reputation risk), leaving a social proof vacuum that undermines conversion.

**Mitigation**:
1. **Trust Metrics Strip** replaces testimonials: "5 Government Intel Sources | 17 Safety Review Sections | 3-5 Day Turnaround | AES-256 Encryption | SHA-256 Evidence Chain" -- all verifiable facts, no fabrication.
2. **Data Source Logos**: NOAA, USGS, CDC, GDACS, ReliefWeb with "Powered by data from" framing.
3. **Architecture ready**: `TestimonialCard` component and `SocialProofStrip` section exist in the component library, ready to populate when real testimonials arrive.
4. Collect testimonials from 104 existing organizations before or immediately after launch.
5. Create G2 and Capterra profiles in Week 1.

**Probability**: High (zero real testimonials exist today)
**Impact**: High (conversion rate significantly impacted)

---

### R05: Next.js 15 Stability with React 19 (LOW)

**Risk**: Next.js 15 with React 19 is production-ready as of early 2026, but some experimental features (PPR, View Transitions) may change API surface.

**Mitigation**:
1. Use only stable APIs for P0 features. Experimental features (PPR, View Transitions) are P2 enhancements.
2. Pin exact versions in `package-lock.json`.
3. Monitor Next.js release notes and React RFC discussions.
4. The SSG-first architecture means very little runtime dependency on experimental features.

**Probability**: Low
**Impact**: Low (core features use stable APIs only)

---

### R06: CSP Headers Blocking Third-Party Services (MEDIUM)

**Risk**: Strict Content Security Policy headers may inadvertently block Plausible analytics, Cloudflare Turnstile, or MapTiler tile requests if not configured correctly.

**Mitigation**:
1. Test CSP configuration against all third-party origins before launch.
2. Use CSP report-only mode during development to identify violations without blocking.
3. Maintain explicit allowlists for each third-party origin in the CSP configuration.
4. Monitor `Content-Security-Policy-Report-Only` reports in Sentry.

**Probability**: Medium (CSP misconfiguration is common)
**Impact**: Medium (blocks analytics or forms if misconfigured)

---

### R07: MDX Build Performance at Scale (LOW)

**Risk**: As blog content grows (40+ posts in Year 1), MDX compilation during `next build` may slow build times.

**Mitigation**:
1. ISR means blog posts are not rebuilt unless revalidation period expires.
2. MDX compilation is cached by Next.js between builds.
3. If build times exceed 60 seconds, migrate to `contentlayer` or `velite` for incremental MDX compilation.
4. When content velocity exceeds 4 posts/week, migrate to headless CMS (Sanity) -- content is fetched at request time via ISR, not compiled at build time.

**Probability**: Low (40 posts is well within MDX build capacity)
**Impact**: Low (slows CI, not user experience)

---

### R08: Seasonal Traffic Spikes (LOW)

**Risk**: The digital marketing discovery identifies seasonal demand patterns (August-September for back-to-school, January-March for mission trip planning). Traffic spikes could overwhelm server resources.

**Mitigation**:
1. SSG architecture means pages are served from Vercel's Edge CDN (200+ PoPs). No server computation at request time.
2. Vercel's platform handles CDN scaling automatically.
3. Supabase form submissions may need rate limiting during spikes -- already implemented (10/IP/hour).
4. MapTiler free tier (100K requests/month) could be exceeded during spikes. Fallback: Protomaps self-hosted PMTiles on Vercel Edge (zero per-request cost).

**Probability**: Low (SSG + CDN handles traffic spikes by design)
**Impact**: Low

---

## Priority Recommendations

### Immediate (Week 1)

| Action | Rationale | Deliverable |
|--------|-----------|-------------|
| Project scaffolding | Foundation for everything | `package.json`, `tsconfig.json`, `next.config.ts`, ESLint flat config, Prettier |
| Design token system | All components depend on tokens | `globals.css` with 60+ CSS custom properties, Tailwind CSS 4 `@theme` |
| Font loading | Affects every page render | `lib/fonts.ts` with Plus Jakarta Sans + Inter + JetBrains Mono |
| shadcn/ui initialization | Base component primitives | `components.json`, ~15 primitives installed |
| CI pipeline (basic) | Quality gate from day one | Lint + type-check + build in GitHub Actions |
| Bundle monitoring (E06) | Catch regressions early | Bundlewatch configuration |
| Accessibility lint rules (E07) | Prevent a11y regressions | `eslint-plugin-jsx-a11y` in strict mode |
| Preconnect hints (E12) | Reduce third-party latency | `<link>` elements in root layout |
| Analytics setup | Baselines before first visitor | Plausible script + Vercel Analytics |
| PWA manifest (E09) | Installability + theme color | `manifest.ts` |

### Foundation (Week 2)

| Action | Rationale | Deliverable |
|--------|-----------|-------------|
| Layout components | Every page uses these | `Navbar`, `Footer`, `SectionContainer`, `Container` |
| Motion preset library (F04) | Animation consistency | `lib/motion.ts` + `ScrollReveal` + `StaggerChildren` |
| Button + Card variants | Most-used composites | Extended shadcn/ui with SafeTrekr tokens |
| SEO infrastructure (F07) | Critical for discoverability | `metadata.ts`, `structured-data.ts`, `sitemap.ts`, `robots.ts` |
| Visual regression setup (E05) | Catch visual regressions from the start | Playwright screenshot tests |
| Lighthouse CI (E15) | Performance gate in every PR | `lighthouserc.yml` + CI job |
| React 19 form primitives (E10) | Foundation for all forms | `useActionState` + `useFormStatus` patterns |

### Homepage Vertical Slice (Weeks 3-4)

| Action | Rationale | Deliverable |
|--------|-----------|-------------|
| HeroHome section | Highest-impact section, validates entire architecture | Hero with map fallback, animation sequence |
| FeatureGrid section | Core value proposition display | 3-column grid with FeatureCards |
| TrustStrip section | Replaces fabricated testimonials | Verifiable trust metrics |
| CTABand section | Primary conversion path | "See a Sample Binder" + "Request a Demo" |
| Form system (F06) | Lead capture functional | Demo request form with full security stack |
| Server Actions | Backend for forms | `requestDemo`, `submitContact` actions |
| Static map fallback (F05) | Hero visual without MapLibre | Pre-rendered map image |
| Custom event tracking (F09) | Measure from day one | Plausible custom events for CTA clicks, form submissions |

### Segment Pages + Differentiation (Weeks 5-6)

| Action | Rationale | Deliverable |
|--------|-----------|-------------|
| K-12 Solutions page | Beachhead segment (consensus: P0) | Full segment page with FAQ schema |
| Churches/Missions page | Zero-competition segment | Segment page + specific content |
| Pricing page | Revenue critical | PricingTier cards with per-student display, ROI context |
| How It Works page | 3-act story visualization | ProcessTimeline with motion |
| Dynamic OG images (E08) | Social sharing readiness | `api/og/route.tsx` with Satori |
| Interactive MapLibre hero (F05) | Stage 2 -- progressive enhancement | Lazy-loaded interactive map with route animation |
| Structured data validation (E11) | SEO correctness | CI validation script |

### Content + Polish (Weeks 7-8)

| Action | Rationale | Deliverable |
|--------|-----------|-------------|
| Blog shell (F08) | Content marketing infrastructure | MDX setup, blog layout, ISR configuration |
| RSC streaming for blog (E03) | Performance for content pages | Suspense boundaries in blog template |
| About page | Team credibility | Team, mission, credibility |
| Contact page | Secondary conversion path | Contact form with full security |
| Remaining feature pages | Feature detail pages | Analyst Review, Risk Intelligence, Evidence Binder |
| A11y audit (manual) | Final compliance check | Manual keyboard + screen reader testing |
| Performance audit | Meet all budget targets | Lighthouse CI final pass |
| View Transitions (E01) | Polish enhancement | Smooth page navigation |
| Edge middleware skeleton (E04) | A/B testing readiness | Middleware file with cookie-based bucketing |

### Post-Launch Optimizations (Weeks 9+)

| Action | Rationale | Deliverable |
|--------|-----------|-------------|
| PPR adoption (E02) | Dynamic sections without SSG rebuild | Enable for blog sidebar, recent posts |
| Container Queries (E13) | Responsive component refinement | Cards adapt to container, not viewport |
| Scroll-Driven Animations (E14) | Performance optimization | CSS-only animations for simple reveals |
| Full A/B testing | Data-driven optimization | Edge middleware + Plausible goals |
| Higher Ed + Corporate pages | Expand TAM | Additional segment pages |
| ROI Calculator | Interactive conversion tool | Client-side calculator with Plausible tracking |
| Comparison pages | SEO + differentiation | vs. DIY, vs. logistics apps, vs. enterprise |
| CRM integration | Sales pipeline | HubSpot Contacts API integration |

---

## Architecture Decision Summary

| Decision | Choice | Rationale | Risk Level |
|----------|--------|-----------|------------|
| Rendering strategy | SSG default, ISR for blog | Zero runtime cost, sub-50ms TTFB | Low |
| Map library | MapLibre GL JS | Zero per-load cost, BSD license, identical API | Low |
| Animation library | Framer Motion (tree-shaken) | Operational motion vocabulary, reduced-motion support | Low |
| CSS framework | Tailwind CSS 4 with `@theme` | Token-driven, zero runtime, design system alignment | Low |
| Component primitives | shadcn/ui + Radix | Accessible by default, tree-shakeable, Tailwind-native | Low |
| Form handling | Server Actions + RHF + Zod | Security, progressive enhancement, type safety | Low |
| Bot protection | Cloudflare Turnstile | Free, privacy-preserving, invisible | Low |
| Analytics | Plausible primary, Vercel secondary | Privacy-first for K-12/church audience | Low |
| Email delivery | Resend API | Developer-friendly, React email templates | Low |
| Content management | MDX files (Phase 1) -> Sanity (Phase 2+) | Low velocity at launch, zero cost | Low |
| Deployment | Vercel Edge Network | Instant rollback, preview deploys, global CDN | Low |
| Database | Supabase (separate project) | Blast radius isolation, generous free tier | Low |
| Fonts | Plus Jakarta Sans + Inter via next/font | Self-hosted, subseted, preloaded | Low |
| Image format | AVIF primary, WebP fallback | Best compression, broad support | Low |
| Testing | Vitest + Testing Library + Playwright + axe-core | Full pyramid with a11y and visual regression | Low |
| CI/CD | GitHub Actions + Vercel | Integrated, fast, free for open source | Low |

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|-----------|-------|
| Design system token translation | **High** | Visual system guide is production-ready with 60+ tokens directly translatable |
| Component architecture | **High** | 4-layer model (primitives -> design system -> composites -> sections) is well-proven |
| SSG/ISR rendering strategy | **High** | Correct for 100% of marketing pages |
| MapLibre integration | **Medium-High** | Lazy-loading pattern is proven, but custom style requires design iteration |
| Animation system | **High** | Framer Motion + centralized presets is a mature pattern |
| Form security | **High** | 8-layer security model is comprehensive |
| Performance budget achievability | **Medium-High** | <150KB JS is tight with MapLibre deferred; achievable with discipline |
| Timeline (6-8 weeks for v1) | **Medium** | Depends on content readiness and product composition assets |
| SEO infrastructure | **High** | Next.js provides excellent SEO primitives; implementation is straightforward |
| Accessibility compliance | **Medium-High** | Automated testing catches 30-50%; manual audit needed for full WCAG 2.2 AA |

---

*Generated by React Developer (Deep Analysis Mode) on 2026-03-24*
*Input: 8-agent discovery suite (UX, UI, IA, Narrative, Strategy, Digital Marketing, React, CTA)*
*Project: SafeTrekr Marketing Site v3*
