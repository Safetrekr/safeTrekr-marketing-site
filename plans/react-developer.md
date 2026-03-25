# React Developer PRD: SafeTrekr Marketing Site

**Date**: 2026-03-24
**Persona**: React / Next.js Frontend Engineer
**Project**: SafeTrekr Marketing Site (Greenfield)
**Tech Stack**: Next.js 15 (App Router) + React 19 + Tailwind CSS 4 + shadcn/ui + Framer Motion + MapLibre GL JS
**Deployment**: Docker (standalone output) on DigitalOcean Kubernetes (DOKS)
**Total Functional Requirements**: 72

---

## Table of Contents

1. [Deployment Constraints](#deployment-constraints)
2. [FR-001 -- FR-007: Project Scaffolding](#project-scaffolding)
3. [FR-008 -- FR-015: Design System](#design-system)
4. [FR-016 -- FR-036: Component Library](#component-library)
5. [FR-037 -- FR-049: Page Implementations](#page-implementations)
6. [FR-050 -- FR-053: Animation System](#animation-system)
7. [FR-054 -- FR-055: Map Integration](#map-integration)
8. [FR-056 -- FR-061: Form System](#form-system)
9. [FR-062 -- FR-066: SEO Infrastructure](#seo-infrastructure)
10. [FR-067 -- FR-068: Content System](#content-system)
11. [FR-069 -- FR-070: Performance](#performance)
12. [FR-071 -- FR-072: Testing Infrastructure](#testing-infrastructure)

---

## Deployment Constraints

This site deploys to **DigitalOcean Kubernetes (DOKS)**, NOT Vercel. Every requirement in this document is designed against that constraint. The following Vercel-specific features are **prohibited**:

| Prohibited | Replacement |
|------------|-------------|
| Vercel Edge Runtime | Node.js middleware on standalone server |
| `@vercel/analytics` | Plausible Analytics (self-hosted or cloud) |
| `@vercel/og` (Edge) | `next/og` with `runtime = 'nodejs'` + `sharp` |
| Vercel Speed Insights | Lighthouse CI + custom RUM via Plausible |
| Vercel Preview Deploys | GitHub Actions + staging K8s namespace |
| Vercel Image Optimization CDN | `next/image` with `sharp` (self-hosted) |
| Vercel Blob / KV / Postgres | Supabase (separate project) |
| Vercel Cron | K8s CronJob or GitHub Actions scheduled workflows |
| Automatic ISR | ISR with filesystem cache (default in standalone) |

**Email service**: SendGrid (existing in product stack). Not Resend.

---

## Project Scaffolding

### FR-001: Next.js Project Initialization

**Priority**: P0
**Complexity**: Medium
**Dependencies**: None (first task)
**Target Files**: `package.json`, `package-lock.json`, `.nvmrc`, `.npmrc`

**Description**: Initialize a Next.js 15 project with React 19, all production and development dependencies, and Node.js version pinning.

**Acceptance Criteria**:
- [ ] `package.json` contains all production dependencies: `next@^15.2`, `react@^19`, `react-dom@^19`, `framer-motion@^11.15`, `maplibre-gl@^4.7`, `react-hook-form@^7`, `@hookform/resolvers@^3`, `zod@^3`, `class-variance-authority@^0.7`, `clsx@^2`, `tailwind-merge@^2`, `lucide-react@^0.450`, `@sendgrid/mail@^8`, `next-mdx-remote@^5`, `gray-matter@^4`, `sharp@^0.33`, `@supabase/supabase-js@^2`
- [ ] `package.json` contains all devDependencies: `typescript@^5.7`, `@types/react@^19`, `@types/react-dom@^19`, `tailwindcss@^4`, `@tailwindcss/postcss@^4`, `postcss@^8`, `eslint@^9`, `eslint-config-next@^15`, `@eslint/js@^9`, `typescript-eslint@^8`, `eslint-plugin-jsx-a11y@^6`, `prettier@^3`, `prettier-plugin-tailwindcss@^0.6`, `@playwright/test@^1.49`, `vitest@^2`, `@testing-library/react@^16`, `@testing-library/jest-dom@^6`, `@testing-library/user-event@^14`, `jsdom@^25`, `axe-core@^4`, `@axe-core/playwright@^4`, `jest-axe@^9`, `@lhci/cli@^0.14`, `bundlewatch@^0.4`, `msw@^2`
- [ ] `package.json` does NOT contain `@vercel/analytics`, `@vercel/og`, `@vercel/speed-insights`, or any Vercel-specific packages
- [ ] `.nvmrc` pins Node.js to `22`
- [ ] `.npmrc` sets `engine-strict=true`
- [ ] `package.json` scripts include: `dev`, `build`, `start`, `lint`, `type-check`, `test:unit`, `test:e2e`, `test:a11y`
- [ ] `npm ci && npm run build` completes without errors on a clean checkout
- [ ] Radix UI primitives installed: `@radix-ui/react-accordion`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `@radix-ui/react-scroll-area`, `@radix-ui/react-slot`

---

### FR-002: TypeScript Configuration

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-001
**Target Files**: `tsconfig.json`

**Description**: Configure TypeScript in strict mode with path aliases, `noUncheckedIndexedAccess`, and `ES2022` target for modern JavaScript support.

**Acceptance Criteria**:
- [ ] `strict: true` enabled
- [ ] `noUncheckedIndexedAccess: true` enabled (forces null-checking on index access)
- [ ] `noUnusedLocals: true` and `noUnusedParameters: true` enabled
- [ ] `forceConsistentCasingInFileNames: true` enabled
- [ ] `target: "ES2022"` for top-level await, `at()`, `structuredClone()` support
- [ ] `module: "esnext"` with `moduleResolution: "bundler"`
- [ ] Path aliases configured: `@/*`, `@/components/*`, `@/lib/*`, `@/hooks/*`, `@/content/*`, `@/actions/*`, `@/styles/*`
- [ ] `allowJs: false` -- no JavaScript files permitted
- [ ] `jsx: "preserve"` (Next.js handles JSX transformation)
- [ ] `incremental: true` for faster rebuilds
- [ ] Next.js plugin configured: `plugins: [{ "name": "next" }]`
- [ ] Zero type errors on `npm run type-check`

---

### FR-003: Next.js Configuration

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-001
**Target Files**: `next.config.ts`

**Description**: Configure Next.js 15 for standalone Docker output, `sharp`-based image optimization, security headers, and package import optimization. No Vercel-specific features.

**Acceptance Criteria**:
- [ ] `output: 'standalone'` set for Docker deployment
- [ ] `reactStrictMode: true` enabled
- [ ] `images.formats` set to `['image/avif', 'image/webp']`
- [ ] `images.deviceSizes` set to `[640, 768, 1024, 1280, 1536]`
- [ ] `images.imageSizes` set to `[16, 32, 48, 64, 96, 128, 256, 384]`
- [ ] `images.remotePatterns` includes `images.unsplash.com` and `api.maptiler.com`
- [ ] Security headers applied to all routes via `async headers()`:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `Content-Security-Policy` with allowlists for: `self`, `plausible.io`, `challenges.cloudflare.com`, `api.maptiler.com`, `*.supabase.co`
- [ ] `experimental.optimizePackageImports` includes `lucide-react` and `framer-motion`
- [ ] No `runtime: 'edge'` in any route configuration
- [ ] `sharp` resolves correctly in the standalone output directory

---

### FR-004: Dockerfile and Docker Build

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-001, FR-003
**Target Files**: `Dockerfile`, `.dockerignore`

**Description**: Multi-stage Docker build that produces a minimal standalone Next.js container with `sharp` for image optimization.

**Acceptance Criteria**:
- [ ] Multi-stage Dockerfile: `deps` (install), `builder` (build), `runner` (production)
- [ ] Base image: `node:22-alpine` for all stages
- [ ] `sharp` platform binaries installed for `linux/amd64` via `npm ci --platform=linux --arch=x64`
- [ ] Standalone output copied to runner stage: `.next/standalone`, `.next/static`, `public`
- [ ] Runner stage uses non-root user (`nextjs:nodejs`)
- [ ] Final image size under 200MB
- [ ] `EXPOSE 3000` and `CMD ["node", "server.js"]`
- [ ] `.dockerignore` excludes: `node_modules`, `.next`, `.git`, `*.md`, `e2e`, `coverage`
- [ ] Health check endpoint: `HEALTHCHECK CMD wget -qO- http://localhost:3000/api/health || exit 1`
- [ ] Environment variables passed at runtime, not baked into image: `NEXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SENDGRID_API_KEY`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_MAPTILER_KEY`
- [ ] `docker build -t safetrekr-marketing . && docker run -p 3000:3000 safetrekr-marketing` starts successfully and serves the homepage

---

### FR-005: ESLint and Prettier Configuration

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-001
**Target Files**: `eslint.config.mjs`, `.prettierrc`, `.prettierignore`

**Description**: ESLint flat config (v9) with Next.js, TypeScript, and accessibility rules at error level. Prettier with Tailwind CSS plugin for consistent class ordering.

**Acceptance Criteria**:
- [ ] ESLint flat config format (`eslint.config.mjs`)
- [ ] Extends: `@eslint/js` recommended, `typescript-eslint` strict, `eslint-config-next`
- [ ] `eslint-plugin-jsx-a11y` configured in **strict** mode (not recommended) with all rules at `error` level
- [ ] No `any` types permitted (`@typescript-eslint/no-explicit-any: error`)
- [ ] Unused variables and imports flagged as errors
- [ ] Import order rules enforced (external, internal by alias, relative)
- [ ] Prettier config: `semi: true`, `singleQuote: true`, `trailingComma: 'all'`, `tabWidth: 2`, `printWidth: 100`
- [ ] `prettier-plugin-tailwindcss` installed and configured for automatic class sorting
- [ ] `npm run lint` passes with zero errors on initial scaffolding
- [ ] `.prettierignore` excludes `.next`, `node_modules`, `coverage`, `public`

---

### FR-006: Kubernetes Manifests

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-004
**Target Files**: `k8s/deployment.yaml`, `k8s/service.yaml`, `k8s/ingress.yaml`, `k8s/hpa.yaml`, `k8s/configmap.yaml`, `k8s/secrets.yaml` (template)

**Description**: Kubernetes manifests for deploying the Next.js standalone container to DigitalOcean DOKS with Nginx Ingress, TLS via cert-manager, and horizontal pod autoscaling.

**Acceptance Criteria**:
- [ ] Deployment manifest with: 2 replicas minimum, resource requests (128Mi memory, 100m CPU), resource limits (256Mi memory, 500m CPU), liveness probe on `/api/health`, readiness probe on `/api/health`, rolling update strategy (maxSurge: 1, maxUnavailable: 0)
- [ ] Service manifest: ClusterIP type, port 3000
- [ ] Ingress manifest: Nginx class, TLS via cert-manager (Let's Encrypt), host `safetrekr.com` and `www.safetrekr.com`, www-to-apex redirect annotation
- [ ] HorizontalPodAutoscaler: min 2, max 6 replicas, target CPU 70%
- [ ] ConfigMap for non-secret environment variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_MAPTILER_KEY`
- [ ] Secret template (not committed) for: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SENDGRID_API_KEY`, `TURNSTILE_SECRET_KEY`
- [ ] Staging namespace variant with reduced replicas (1) and separate ingress host (`staging.safetrekr.com`)

---

### FR-007: GitHub Actions CI/CD Pipeline

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-004, FR-005, FR-006
**Target Files**: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`

**Description**: CI pipeline that runs lint, type-check, unit tests, build, e2e tests, accessibility tests, Lighthouse CI, and bundle size checks on every PR. Deploy pipeline that builds Docker image and deploys to DOKS on merge to `main`.

**Acceptance Criteria**:
- [ ] `ci.yml` triggers on `push` to `main` and `pull_request` to `main`
- [ ] Jobs run in parallel where possible: `lint-type-check`, `unit-tests`, `build` (depends on lint), `e2e-tests` (depends on build), `lighthouse` (depends on build), `accessibility` (depends on build)
- [ ] Node.js 22 with `npm ci` caching via `actions/setup-node`
- [ ] `lint-type-check` job: `npm run lint` + `npm run type-check`
- [ ] `unit-tests` job: `npm run test:unit -- --coverage` with coverage threshold enforcement
- [ ] `build` job: `npm run build` + bundlewatch size check
- [ ] `e2e-tests` job: `npx playwright install --with-deps` + `npm run test:e2e`
- [ ] `lighthouse` job: `npm run build && npm start` + `npx @lhci/cli autorun`
- [ ] `accessibility` job: `npm run test:a11y` (Playwright + axe-core)
- [ ] `deploy.yml` triggers on merge to `main`: Docker build, push to DigitalOcean Container Registry (`doctl registry`), `kubectl apply` to DOKS production namespace
- [ ] Deploy job creates staging deployment for PRs (optional, triggered by label)
- [ ] All CI jobs must pass before PR can merge (branch protection)

---

## Design System

### FR-008: Tailwind CSS 4 Theme Configuration

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-001
**Target Files**: `src/styles/globals.css`, `tailwind.config.ts` (minimal), `postcss.config.mjs`

**Description**: Complete design token system using Tailwind CSS 4 `@theme inline` directive with 60+ CSS custom properties covering colors, typography, spacing, shadows, radii, and animation tokens.

**Acceptance Criteria**:
- [ ] `@import "tailwindcss"` at the top of `globals.css`
- [ ] `@theme inline` block defines all tokens as CSS custom properties
- [ ] Brand primary color scale: `--color-primary-50` through `--color-primary-950` with `--color-primary` alias for primary-500 (#4ca46e)
- [ ] Secondary color (Authority Blue): `--color-secondary: #123646`
- [ ] Semantic surface colors: `--color-background: #e7ecee`, `--color-foreground: #061a23`, `--color-card: #f7f8f8`, `--color-card-foreground: #061a23`
- [ ] `--color-muted-foreground` set to `#4d5153` (5.2:1 contrast ratio on background -- corrected from #616567 per accessibility audit)
- [ ] Destructive color: `--color-destructive: #c1253e`
- [ ] Safety status colors (operational use only): `--color-safety-green`, `--color-safety-yellow`, `--color-safety-red`
- [ ] Warning scale: `--color-warning-50` through `--color-warning-900`
- [ ] Typography tokens: `--font-display`, `--font-body`, `--font-mono`
- [ ] Border radius tokens: `--radius-sm: 4px` through `--radius-2xl: 20px`
- [ ] Shadow tokens (cool-toned from foreground): `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`
- [ ] Section spacing tokens: `--spacing-section-desktop: 128px`, `--spacing-section-tablet: 80px`, `--spacing-section-mobile: 64px`
- [ ] Animation tokens: `--ease-default`, `--ease-enter`, `--ease-spring`, `--duration-fast` through `--duration-draw`
- [ ] Content width tokens: `--width-content: 1280px`, `--width-full-bleed: 1440px`
- [ ] `postcss.config.mjs` configures `@tailwindcss/postcss`
- [ ] Minimal `tailwind.config.ts` with `content: ['./src/**/*.{ts,tsx,mdx}']` for content detection

---

### FR-009: Base Styles and Accessibility Foundations

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-008
**Target Files**: `src/styles/globals.css`

**Description**: Base layer styles for html, body, focus-visible indicators, reduced motion override, and skip navigation link.

**Acceptance Criteria**:
- [ ] `@layer base` block with:
  - `html`: `scroll-behavior: smooth`, `-webkit-font-smoothing: antialiased`
  - `body`: background, foreground color, body font family from tokens
- [ ] Universal `*:focus-visible` style: `outline: 2px solid var(--color-ring)`, `outline-offset: 2px`, `border-radius: var(--radius-sm)`
- [ ] `@media (prefers-reduced-motion: reduce)` rule that forces: `animation-duration: 0.01ms !important`, `transition-duration: 0.01ms !important`, `scroll-behavior: auto !important` on all elements
- [ ] `.skip-link` class: absolutely positioned off-screen, slides into view on `:focus`, background `--color-secondary`, foreground `--color-secondary-foreground`, `z-index: 100`
- [ ] Skip link is the first focusable element in the document (validated by Tab key test)

---

### FR-010: Typography Utility Classes

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-008
**Target Files**: `src/styles/globals.css`

**Description**: Typography scale utility classes using fluid `clamp()` values for responsive sizing without breakpoint media queries.

**Acceptance Criteria**:
- [ ] `@layer utilities` block with the following classes:
  - `.text-display-xl`: `clamp(2.5rem, 5vw, 4.5rem)`, weight 800, line-height 1.05, letter-spacing -0.025em, display font
  - `.text-display-lg`: `clamp(2.125rem, 4vw, 3.5rem)`, weight 700, line-height 1.1, display font
  - `.text-display-md`: `clamp(1.75rem, 3vw, 2.75rem)`, weight 700, line-height 1.15, display font
  - `.text-eyebrow`: 0.8125rem (13px), weight 600, letter-spacing 0.08em, uppercase, body font
- [ ] All display classes use `--font-display` (Plus Jakarta Sans)
- [ ] Eyebrow class uses `--font-body` (Inter)
- [ ] Each class renders correctly across all breakpoints (375px through 1536px)

---

### FR-011: Font Loading

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-001
**Target Files**: `src/lib/fonts.ts`, `src/app/layout.tsx`

**Description**: Self-hosted web fonts via `next/font/google` with CSS variable injection, subset optimization, and selective weight loading.

**Acceptance Criteria**:
- [ ] Plus Jakarta Sans loaded with weights 600, 700, 800 only; assigned to `--font-display`; `preload: true`
- [ ] Inter loaded with weights 400, 500, 600 only; assigned to `--font-body`; `preload: true`
- [ ] JetBrains Mono loaded with weights 400, 500 only; assigned to `--font-mono`; `preload: false` (low priority)
- [ ] All fonts use `display: 'swap'` for FOUT prevention
- [ ] All fonts use `subsets: ['latin']` for size reduction
- [ ] CSS variables applied to `<html>` element via `className` in root layout
- [ ] Total font file weight under 100KB (verified via network waterfall)
- [ ] No external font requests at runtime (fonts self-hosted by `next/font`)

---

### FR-012: shadcn/ui Initialization

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-008, FR-009
**Target Files**: `components.json`, `src/components/ui/*`, `src/lib/utils.ts`

**Description**: Initialize shadcn/ui with SafeTrekr's design tokens and install all required primitive components.

**Acceptance Criteria**:
- [ ] `components.json` configured with: `style: "default"`, `tailwindCss: "src/styles/globals.css"`, `aliases.components: "@/components"`, `aliases.utils: "@/lib/utils"`
- [ ] `cn()` utility function in `src/lib/utils.ts` combining `clsx` and `tailwind-merge`
- [ ] The following shadcn/ui primitives installed and customized with SafeTrekr tokens:
  - `Button` (extended with custom variants -- see FR-016)
  - `Card`, `CardHeader`, `CardContent`, `CardFooter`
  - `Input`, `Textarea`, `Label`
  - `Badge`
  - `Separator`
  - `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
  - `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
  - `Dialog`, `DialogTrigger`, `DialogContent`
  - `Sheet`, `SheetTrigger`, `SheetContent` (mobile navigation)
  - `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`
  - `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`
  - `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`
  - `ScrollArea`
- [ ] All primitives use SafeTrekr color tokens (not default shadcn/ui colors)
- [ ] All primitives pass axe-core accessibility scan

---

### FR-013: Dark Section Strategy

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-008
**Target Files**: `src/styles/globals.css`

**Description**: CSS strategy for dark-background sections (`bg-secondary`) where foreground colors invert. Implemented via data attribute, not full dark mode.

**Acceptance Criteria**:
- [ ] `[data-theme="dark"]` selector (or equivalent `.dark-section` class) overrides: foreground to `--color-secondary-foreground`, muted-foreground to a lighter value, border to a darker variant
- [ ] Within dark sections, `primary-on-dark` button variant renders white text on white background with correct contrast
- [ ] Dark sections do NOT trigger global dark mode -- they are scoped to the section element
- [ ] Heading text within dark sections meets WCAG 2.2 AA contrast (4.5:1 for normal text, 3:1 for large text)

---

### FR-014: Spacing System

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-008
**Target Files**: `src/styles/globals.css`

**Description**: 8-point grid spacing system with responsive section padding utilities.

**Acceptance Criteria**:
- [ ] All spacing values are multiples of 8px (using Tailwind's default spacing scale which aligns at `space-2 = 8px`)
- [ ] Custom section padding utility classes:
  - `.section-padding-sm`: `padding-block` responsive from `--spacing-section-mobile / 2` to `--spacing-section-desktop / 2`
  - `.section-padding-md`: `padding-block` responsive from `--spacing-section-mobile` to `--spacing-section-desktop`
  - `.section-padding-lg`: `padding-block` responsive with 1.25x multiplier
- [ ] Max content width utility: `.max-w-content` maps to `--width-content` (1280px)
- [ ] Full-bleed width utility: `.max-w-full-bleed` maps to `--width-full-bleed` (1440px)

---

### FR-015: Color Contrast Validation

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-008
**Target Files**: Documentation in `src/styles/contrast-pairs.md` or inline comments

**Description**: Document and validate all text-on-background color pairings used in the design system against WCAG 2.2 AA requirements.

**Acceptance Criteria**:
- [ ] `muted-foreground` (#4d5153) on `background` (#e7ecee) achieves at least 5.0:1 contrast ratio
- [ ] `foreground` (#061a23) on `background` (#e7ecee) achieves at least 12:1 contrast ratio
- [ ] `primary-foreground` (white) on `primary-600` (#3f885b) achieves at least 4.5:1 for button text
- [ ] `secondary-foreground` (#e7ecee) on `secondary` (#123646) achieves at least 7:1 for dark sections
- [ ] `destructive-foreground` (white) on `destructive` (#c1253e) achieves at least 4.5:1
- [ ] No use of `primary-300` or lighter for text on any background -- reserved for backgrounds only
- [ ] axe-core automated tests validate all color pairs at build time
- [ ] Contrast-safe pairs table documented for future component development

---

## Component Library

### FR-016: Button Component (Layer 1)

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-012
**Target Files**: `src/components/ui/button.tsx`

**Description**: Extended shadcn/ui Button with SafeTrekr variants, loading state, and icon slots. Used across every page and form.

**Acceptance Criteria**:
- [ ] Variants via CVA: `primary` (bg-primary-600, text-white, hover:bg-primary-700), `secondary` (bg-transparent, border-border, hover:bg-primary-50), `ghost` (bg-transparent, hover:bg-muted), `link` (underline-offset-4, hover:underline), `primary-on-dark` (bg-white, text-secondary, hover:bg-card), `destructive` (bg-destructive, text-white)
- [ ] Note: `primary` variant uses `primary-600` (#3f885b, 4.6:1 contrast with white) NOT `primary-500` (3.4:1, FAILS AA)
- [ ] Sizes: `sm` (h-9, px-3, text-sm), `md` (h-10, px-4, text-sm), `lg` (h-12, px-6, text-base)
- [ ] `loading` prop: renders spinner icon, disables pointer events, sets `aria-busy="true"`
- [ ] `leftIcon` and `rightIcon` props for icon placement
- [ ] `asChild` prop (Radix Slot) for polymorphic rendering (render as `<a>`, `<Link>`, etc.)
- [ ] Focus-visible ring: `ring-2 ring-ring ring-offset-2`
- [ ] Minimum touch target: 44x44px on all sizes
- [ ] `disabled` state: reduced opacity, `cursor-not-allowed`, `aria-disabled="true"`

---

### FR-017: SectionContainer Component (Layer 2)

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-008, FR-014
**Target Files**: `src/components/layout/section-container.tsx`

**Description**: Layout primitive that wraps page sections with consistent padding, max-width, background variants, and semantic HTML.

**Acceptance Criteria**:
- [ ] Props: `variant` (`'default' | 'brand-wash' | 'dark-authority' | 'card-surface'`), `padding` (`'sm' | 'md' | 'lg'`), `maxWidth` (`'content' | 'full-bleed'`), `as` (`'section' | 'div' | 'article'`), `id`, `className`, `children`
- [ ] Variant styles: `default` (bg-background), `brand-wash` (bg-primary-50), `dark-authority` (bg-secondary, text-secondary-foreground, sets `data-theme="dark"`), `card-surface` (bg-card)
- [ ] Padding maps to responsive section spacing tokens
- [ ] `maxWidth: 'content'` applies `max-w-content mx-auto px-4 sm:px-6 lg:px-8`
- [ ] Renders semantic `<section>` by default with optional `id` for scroll anchoring
- [ ] Server Component (no `'use client'` directive)

---

### FR-018: Container Component

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-008
**Target Files**: `src/components/layout/container.tsx`

**Description**: Simple max-width container with responsive horizontal padding.

**Acceptance Criteria**:
- [ ] Applies `max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8`
- [ ] `as` prop for semantic flexibility (`div`, `main`, `section`)
- [ ] Server Component

---

### FR-019: SiteHeader / Navbar Component

**Priority**: P0
**Complexity**: High
**Dependencies**: FR-012, FR-016
**Target Files**: `src/components/layout/site-header.tsx`, `src/components/layout/mobile-nav.tsx`, `src/components/layout/nav-link.tsx`

**Description**: Dual-layer sticky navigation with scroll-aware behavior, mega-menu for Solutions, mobile Sheet overlay, and full accessibility.

**Acceptance Criteria**:
- [ ] Sticky header with scroll-aware behavior: transparent background at page top, solid `bg-card/95 backdrop-blur-sm` after scrolling past hero (threshold ~100px), 200ms transition
- [ ] Primary navigation: max 5 items (Platform, Solutions, How It Works, Pricing, Resources)
- [ ] Utility navigation: "Contact", "Log In" (external link to app), primary CTA button
- [ ] Solutions mega-menu using Radix `NavigationMenu`: shows segment cards (K-12, Churches, Higher Ed, Corporate) with descriptions
- [ ] CTA button appears in header after scroll threshold (hidden at top to avoid visual competition with hero CTA)
- [ ] Mobile breakpoint (`< 1024px`): hamburger icon triggers `Sheet` component (full-screen overlay from right)
- [ ] Mobile nav: stacked links with 44x44px touch targets, accordion for Solutions sub-menu
- [ ] `aria-current="page"` on active nav link
- [ ] Skip navigation link is the first focusable element before the header
- [ ] `aria-expanded` and `aria-controls` on mobile hamburger and mega-menu triggers
- [ ] Keyboard navigation: Tab through all items, Enter/Space to activate, Escape to close menus
- [ ] No layout shift on scroll state change (header dimensions remain constant)
- [ ] Logo renders: horizontal variant on desktop, mark-only on mobile
- [ ] Logo links to homepage

---

### FR-020: SiteFooter Component

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-012, FR-016
**Target Files**: `src/components/layout/site-footer.tsx`

**Description**: Site footer with navigation columns, newsletter signup, legal links, and social proof.

**Acceptance Criteria**:
- [ ] 4-column layout on desktop (Solutions, Platform, Resources, Company), stacking to 2-column on tablet, 1-column on mobile
- [ ] Newsletter email signup form (inline, connects to FR-060)
- [ ] Legal links: Privacy Policy, Terms of Service
- [ ] Copyright line with current year
- [ ] Social media links (if available) with `aria-label` for each
- [ ] Trust metrics strip (compact version): "5 Intel Sources | 17 Review Sections | AES-256"
- [ ] `<footer>` semantic element with `role="contentinfo"`
- [ ] All links have visible focus indicators
- [ ] Server Component (newsletter form is a client island)

---

### FR-021: FeatureCard Component (Layer 2)

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-012
**Target Files**: `src/components/marketing/feature-card.tsx`

**Description**: Card displaying a feature with icon, title, description, optional badge, and optional link.

**Acceptance Criteria**:
- [ ] Props: `icon` (ReactNode), `title` (string), `description` (string), `href?` (string), `badge?` (string), `motif?` (`'route' | 'review' | 'record' | 'readiness'`)
- [ ] Card surface with `shadow-sm`, `hover:shadow-md` transition, `border-border`
- [ ] Icon rendered in a colored background circle using motif-specific tint
- [ ] Optional badge (e.g., "New", "Coming Soon") as `Badge` component positioned top-right
- [ ] Optional arrow link when `href` is provided
- [ ] Responsive: full-width mobile, 2-col tablet, 3-col desktop (controlled by parent grid)
- [ ] Server Component

---

### FR-022: StatCard / TrustMetric Component (Layer 2)

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-012
**Target Files**: `src/components/marketing/trust-metric.tsx`

**Description**: Individual metric badge displaying a value and label. Used in the TrustStrip.

**Acceptance Criteria**:
- [ ] Props: `value` (string), `label` (string), `icon?` (ReactNode)
- [ ] Value displayed in display font, large size
- [ ] Label displayed in body font, muted-foreground
- [ ] Optional icon (e.g., shield, check-circle) from Lucide
- [ ] `light` and `dark` variants for different section backgrounds
- [ ] Server Component

---

### FR-023: TrustStrip Component (Layer 3)

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-022
**Target Files**: `src/components/sections/trust-strip.tsx`

**Description**: Horizontal strip of verifiable trust metrics replacing all fabricated testimonials. Displays: "5 Government Intel Sources | 17 Safety Review Sections | 3-5 Day Turnaround | AES-256 Encryption | SHA-256 Evidence Chain."

**Acceptance Criteria**:
- [ ] Props: `metrics` (array of `{value, label}`), `variant` (`'light' | 'dark'`)
- [ ] Renders `TrustMetric` components in a horizontal row on desktop
- [ ] Horizontal scroll with snap points on mobile (no wrapping, scroll indicators)
- [ ] Dividers between metrics on desktop
- [ ] Dark variant uses `bg-secondary` with `text-secondary-foreground`
- [ ] NO fabricated testimonials, quotes, or unverifiable claims
- [ ] All displayed facts must be verifiable from the product codebase
- [ ] Server Component (zero client JS)

---

### FR-024: PricingTierCard Component (Layer 2)

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-012, FR-016
**Target Files**: `src/components/marketing/pricing-tier-card.tsx`

**Description**: Pricing card with per-student framing, feature list, CTA, and optional "Most Popular" highlight.

**Acceptance Criteria**:
- [ ] Props: `name` (string), `pricePerStudent` (number), `pricePerTrip` (number), `features` (string[]), `highlighted?` (boolean), `ctaLabel` (string), `ctaHref` (string), `disclaimer?` (string)
- [ ] Per-student price displayed prominently ("$15/student") -- NOT per-trip price as primary
- [ ] Per-trip price shown as secondary information
- [ ] Feature list with check-circle icons
- [ ] `highlighted` adds "Most Popular" badge, `ring-2 ring-primary` border, slightly elevated shadow
- [ ] CTA button: `primary` variant for highlighted, `secondary` for others
- [ ] No animation on pricing cards (stability communicates trust -- per analysis)
- [ ] Equal visual weight across all cards (no size differences)
- [ ] Server Component

---

### FR-025: FAQSection Component (Layer 3)

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-012
**Target Files**: `src/components/sections/faq-section.tsx`

**Description**: Accordion-based FAQ section with FAQPage JSON-LD generation. Used on solutions pages and pricing page.

**Acceptance Criteria**:
- [ ] Props: `faqs` (array of `{question, answer}`), `heading?` (string)
- [ ] Renders Radix `Accordion` (type `"single"` collapsible) with smooth expand/collapse
- [ ] Each item: question as trigger, answer as content
- [ ] `aria-expanded` on triggers, `aria-controls` linking trigger to content panel
- [ ] Generates `FAQPage` JSON-LD `<script type="application/ld+json">` from the faqs data
- [ ] Heading defaults to "Frequently Asked Questions" with semantic `<h2>`
- [ ] Server Component for the shell, Accordion is client component

---

### FR-026: CTABand Component (Layer 3)

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-017, FR-016
**Target Files**: `src/components/sections/cta-band.tsx`

**Description**: Full-width call-to-action section with headline, description, and dual CTAs. Used as the final section on most pages.

**Acceptance Criteria**:
- [ ] Props: `headline` (string), `description` (string), `primaryCTA` ({label, href}), `secondaryCTA?` ({label, href}), `variant` (`'default' | 'dark'`)
- [ ] Dark variant renders on `bg-secondary` with white text
- [ ] Primary CTA: `Button` with `primary` variant (or `primary-on-dark` on dark backgrounds)
- [ ] Secondary CTA: `Button` with `secondary` variant (or `ghost` on dark backgrounds)
- [ ] Centered text alignment, max-width for readability
- [ ] Server Component

---

### FR-027: ProcessTimeline Component (Layer 2)

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-012
**Target Files**: `src/components/marketing/process-timeline.tsx`

**Description**: Vertical/horizontal timeline showing the three-act mechanism: Intelligence, Review, Documentation. Used on How It Works page.

**Acceptance Criteria**:
- [ ] Three steps with connecting line: Intelligence (data gathering) > Review (analyst review) > Documentation (evidence binder)
- [ ] Each step: number badge, icon, title, description, detail list
- [ ] Connecting line between steps (vertical on mobile, horizontal on desktop)
- [ ] Animation: connecting line draws in on scroll, steps fade up with stagger (see FR-050)
- [ ] Fallback: all content visible without animation when `prefers-reduced-motion: reduce`
- [ ] Server Component shell with client boundary only for animation

---

### FR-028: SegmentCard Component (Layer 2)

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-012
**Target Files**: `src/components/marketing/segment-card.tsx`

**Description**: Card routing visitors to their segment-specific solutions page. Used on homepage and /solutions overview.

**Acceptance Criteria**:
- [ ] Props: `segment` (string), `title` (string), `description` (string), `icon` (ReactNode), `href` (string), `highlighted?` (boolean)
- [ ] Renders as a link (`<a>` via `next/link`) wrapping a card
- [ ] Hover state: card lifts (shadow increase), arrow icon animates right
- [ ] `highlighted` variant for beachhead segment (churches) with subtle primary border
- [ ] 1-click routing to segment page
- [ ] Server Component

---

### FR-029: FeatureGrid Component (Layer 3)

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-021
**Target Files**: `src/components/sections/feature-grid.tsx`

**Description**: Responsive grid of FeatureCards displaying core platform capabilities.

**Acceptance Criteria**:
- [ ] Props: `features` (array of FeatureCard props), `heading` (string), `subheading?` (string), `columns?` (2 | 3 | 4)
- [ ] Responsive grid: 1-col mobile, 2-col tablet, 3-col desktop (default)
- [ ] Section heading with eyebrow label option
- [ ] Staggered reveal animation on scroll (see FR-051)
- [ ] Server Component shell

---

### FR-030: HeroHome Component (Layer 3)

**Priority**: P0
**Complexity**: High
**Dependencies**: FR-016, FR-017, FR-054
**Target Files**: `src/components/sections/hero-home.tsx`

**Description**: Homepage hero section with mechanism-naming headline, dual CTAs, map visual composition, and orchestrated entrance animation.

**Acceptance Criteria**:
- [ ] Props: `headline` (string), `subheadline` (string), `primaryCTA` ({label, href}), `secondaryCTA` ({label, href})
- [ ] Layout: 5-column text / 7-column visual on desktop (`lg:grid-cols-12`), stacked on mobile
- [ ] Headline visible immediately (no animation delay on text -- content renders at 0ms even if animation decorates it)
- [ ] Primary CTA: "See a Sample Safety Binder" (`primary` variant, links to binder page or modal)
- [ ] Secondary CTA: "Request a Demo" (`secondary` variant, links to `/demo`)
- [ ] Visual composition: map fragment + document stack + route line (see FR-054, FR-055)
- [ ] Animation sequence (1800ms total) per analysis: headline fadeUp 0ms, subtext 150ms, CTAs 300ms, map 400ms, route 700ms, panel 900ms, doc stack 1100ms, status dots 1400ms
- [ ] All animation skipped entirely when `prefers-reduced-motion: reduce` -- content renders immediately
- [ ] LCP element (headline + hero image) renders within 1.5s
- [ ] CLS < 0.1 -- all elements have explicit dimensions, no layout shift from animation
- [ ] Server Component shell with client boundary for animations and map

---

### FR-031: PricingGrid Component (Layer 3)

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-024, FR-017
**Target Files**: `src/components/sections/pricing-grid.tsx`

**Description**: Pricing section with liability anchor, 3 tier cards, volume discount table, and FAQ.

**Acceptance Criteria**:
- [ ] Headline: "$15/participant" prominently displayed (not "$450/trip")
- [ ] Value anchor above cards: settlement cost comparison ("Average settlement: $500K-$2M")
- [ ] 3 PricingTierCard instances: Field Trip ($450/T1), Expedition ($750/T2), Enterprise ($1,250/T3)
- [ ] Per-student prices calculated and displayed: T1 at $15, T2 at $25, T3 varies
- [ ] Volume discount table: 5-9 trips (5%), 10-24 (10%), 25-49 (15%), 50+ (20%)
- [ ] "Calculate Your ROI" secondary CTA linking to ROI calculator
- [ ] JSON-LD `Product` + `Offer` schema per tier
- [ ] Server Component

---

### FR-032: FeatureShowcase Component (Layer 3)

**Priority**: P1
**Complexity**: Medium
**Dependencies**: FR-017, FR-021
**Target Files**: `src/components/sections/feature-showcase.tsx`

**Description**: Alternating layout section showing feature detail with image/illustration on one side and text on the other. Used for deep-dive feature pages.

**Acceptance Criteria**:
- [ ] Props: `features` (array of `{heading, description, image, imageAlt, reverse?, badge?}`)
- [ ] Alternating left-right layout on desktop (image left/text right, then reversed)
- [ ] Stacked layout on mobile (image always on top)
- [ ] Image placeholder for product screenshots (until real screenshots available)
- [ ] Server Component

---

### FR-033: DocumentPreview Component (Layer 2)

**Priority**: P1
**Complexity**: Medium
**Dependencies**: FR-012
**Target Files**: `src/components/marketing/document-preview.tsx`

**Description**: Simulated document preview showing a safety binder cover page. Used on homepage and binder pages.

**Acceptance Criteria**:
- [ ] Visual: document with slight tilt/shadow stack effect (2-3 overlapping pages)
- [ ] Shows binder cover page with SafeTrekr branding, section headings, redacted content
- [ ] "Preview Sample" overlay with CTA to download gated version
- [ ] Animation: cards reveal with `cardReveal` variant on scroll (see FR-050)
- [ ] Server Component shell with client boundary for animation

---

### FR-034: LeadCaptureModal Component

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-012, FR-056
**Target Files**: `src/components/forms/lead-capture-modal.tsx`

**Description**: Modal dialog for gated content downloads (sample binders, whitepapers). Collects minimal information before delivering content.

**Acceptance Criteria**:
- [ ] Uses Radix `Dialog` component
- [ ] Form fields: email (required), first name (optional), organization type (dropdown, optional)
- [ ] Pre-selectable segment via prop (e.g., from a Churches page, "Mission Trip" is pre-selected)
- [ ] Cloudflare Turnstile widget (invisible mode)
- [ ] Server Action submission
- [ ] Success state: shows download link for PDF
- [ ] Accessible: focus trapped within modal, Escape closes, return focus on close
- [ ] `aria-labelledby` references modal title
- [ ] Client Component (`'use client'`)

---

### FR-035: IntelSourceBar Component (Layer 2)

**Priority**: P1
**Complexity**: Low
**Dependencies**: FR-012
**Target Files**: `src/components/marketing/intel-source-bar.tsx`

**Description**: Horizontal bar showing the 5 government intelligence source logos with "Powered by data from" label.

**Acceptance Criteria**:
- [ ] Displays logos/names: NOAA, USGS, CDC, GDACS, ReliefWeb
- [ ] "Powered by data from" eyebrow label
- [ ] Logos rendered as SVGs or optimized images
- [ ] Horizontal scroll on mobile if needed
- [ ] Server Component

---

### FR-036: MotifBadge Component (Layer 2)

**Priority**: P1
**Complexity**: Low
**Dependencies**: FR-012
**Target Files**: `src/components/marketing/motif-badge.tsx`

**Description**: Small visual badge with motif-specific color coding. Used to categorize features into the four operational motifs: Route, Review, Record, Readiness.

**Acceptance Criteria**:
- [ ] Props: `motif` (`'route' | 'review' | 'record' | 'readiness'`), `label?` (string)
- [ ] Each motif has a distinct color accent from the brand palette
- [ ] Pill-shaped badge with icon and optional text label
- [ ] Server Component

---

## Page Implementations

### FR-037: Root Layout

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-011, FR-019, FR-020, FR-063
**Target Files**: `src/app/layout.tsx`

**Description**: Root layout with font loading, metadata defaults, Organization JSON-LD, analytics scripts, skip navigation, header, and footer.

**Acceptance Criteria**:
- [ ] `<html lang="en">` with font CSS variable classes
- [ ] Skip navigation link as first child of `<body>`
- [ ] `SiteHeader` rendered above `{children}`
- [ ] `SiteFooter` rendered below `{children}`
- [ ] `<main id="main-content">` wrapping `{children}` (skip-nav target)
- [ ] Organization JSON-LD `<script type="application/ld+json">` in `<head>`
- [ ] Plausible analytics `<Script>` with `strategy="afterInteractive"`
- [ ] NO `@vercel/analytics` -- Plausible only
- [ ] Preconnect hints: `<link rel="preconnect" href="https://plausible.io" />`
- [ ] DNS prefetch: `api.maptiler.com`, `challenges.cloudflare.com`, Supabase host
- [ ] Default metadata via `generateMetadata`: title template `"%s | SafeTrekr"`, default description, default OG image
- [ ] `viewport` metadata: `width=device-width, initial-scale=1`

---

### FR-038: Homepage (`/`)

**Priority**: P0
**Complexity**: High
**Dependencies**: FR-030, FR-023, FR-029, FR-026, FR-031, FR-028, FR-054
**Target Files**: `src/app/page.tsx`, `src/content/pages/homepage.ts`

**Description**: 11-section landing page: Hero > Problem/Mechanism > How It Works > Trust Strip > Feature Grid > Binder Showcase > Segment Routing > Pricing Preview > Category Contrast > Final CTA > Footer.

**Acceptance Criteria**:
- [ ] SSG (statically generated at build time)
- [ ] `generateMetadata` returns unique title, description, canonical URL
- [ ] JSON-LD: `SoftwareApplication` + `AggregateOffer` schema
- [ ] Dynamic OG image via `/api/og?title=...`
- [ ] HeroHome section with mechanism-naming headline (not generic "plan safer trips")
- [ ] Problem/mechanism section naming: professional safety analyst, government intelligence, tamper-evident evidence binder
- [ ] How It Works preview (3-step summary linking to full page)
- [ ] TrustStrip with 5 verifiable metrics
- [ ] FeatureGrid with 6-9 core capabilities
- [ ] Binder showcase section with DocumentPreview linking to sample binder download
- [ ] Segment routing cards (K-12, Churches, Higher Ed, Corporate)
- [ ] Pricing preview with per-student anchor, linking to full pricing page
- [ ] Category contrast section (SafeTrekr vs. status quo)
- [ ] Final CTABand section
- [ ] Total page weight < 500KB (excluding lazy-loaded map)
- [ ] LCP < 1.5s
- [ ] CLS < 0.05
- [ ] Lighthouse Performance >= 95

---

### FR-039: Church/Missions Solutions Page (`/solutions/churches`)

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-017, FR-025, FR-026, FR-034
**Target Files**: `src/app/solutions/churches/page.tsx`, `src/content/pages/solutions-churches.ts`

**Description**: Beachhead segment landing page with church-specific vocabulary, mission trip focus, and denomination context.

**Acceptance Criteria**:
- [ ] SSG
- [ ] `generateMetadata` with church/missions-specific title and description
- [ ] FAQPage JSON-LD with 8-12 church-relevant Q&As
- [ ] BreadcrumbList JSON-LD: Home > Solutions > Churches & Missions
- [ ] Hero with church-specific headline and subheadline using segment vocabulary (duty of care, volunteer screening, mission field safety, stewardship, youth protection)
- [ ] Pain narrative section addressing senior pastor liability concerns
- [ ] Three-act mechanism story flavored for mission trips
- [ ] Pricing scenarios: $450 domestic, $1,250 international = "less than 1% of trip budget" for $7K/person mission trip
- [ ] Insurance framing section (insurance carrier sees audit-ready documentation)
- [ ] CTA: segment-specific "See a Mission Trip Safety Binder" linking to LeadCaptureModal with "Mission Trip" pre-selected
- [ ] Denominational context (SBC 47,000+ churches) as social proof of market fit
- [ ] All content passes 5-second recall test for mission directors

---

### FR-040: K-12 Schools Solutions Page (`/solutions/k12`)

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-017, FR-025, FR-026
**Target Files**: `src/app/solutions/k12/page.tsx`, `src/content/pages/solutions-k12.ts`

**Description**: Largest TAM segment page with per-student pricing, honest FERPA messaging, and board liability framing.

**Acceptance Criteria**:
- [ ] SSG
- [ ] `generateMetadata` with K-12-specific title and description
- [ ] FAQPage JSON-LD with K-12 Q&As including FERPA question
- [ ] BreadcrumbList JSON-LD: Home > Solutions > K-12 Schools
- [ ] Per-student pricing ($15/student) as primary framing
- [ ] Honest FERPA language: "Designed with FERPA requirements in mind" -- NOT "FERPA certified" or "FERPA compliant" until certification is obtained
- [ ] Liability cost comparison: "$500K-$2M average settlement" vs. "$15/student"
- [ ] Guardian mobile app preview section (illustration/mockup)
- [ ] Board presentation framing: "What your school board needs to see"
- [ ] CTA linking to `/demo` with segment pre-selected via query param (`?segment=k12`)

---

### FR-041: Pricing Page (`/pricing`)

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-031, FR-025
**Target Files**: `src/app/pricing/page.tsx`, `src/content/pages/pricing.ts`

**Description**: Pricing page with per-student framing, 3 tier cards, volume discounts, FAQ, and procurement path.

**Acceptance Criteria**:
- [ ] SSG
- [ ] `generateMetadata` with pricing-specific title and description
- [ ] FAQPage JSON-LD for pricing FAQ section
- [ ] `Product` + `Offer` JSON-LD per tier
- [ ] PricingGrid section with all acceptance criteria from FR-031
- [ ] Volume discount table clearly displayed
- [ ] Verified pricing values from single source of truth: T1 $450, T2 $750, T3 $1,250
- [ ] Per-student calculation: T1 at 30 students = $15/student
- [ ] FAQ section with 8-10 pricing Q&As
- [ ] Dual CTA paths: "Request a Demo" (primary) and "For Procurement" (secondary, links to procurement resources)
- [ ] "Calculate Your ROI" CTA linking to ROI calculator (P2 implementation, placeholder link acceptable at launch)

---

### FR-042: How It Works Page (`/how-it-works`)

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-027, FR-017, FR-026
**Target Files**: `src/app/how-it-works/page.tsx`, `src/content/pages/how-it-works.ts`

**Description**: Deep explanation of the three-act mechanism with 17-section review breakdown and intelligence source showcase.

**Acceptance Criteria**:
- [ ] SSG
- [ ] `generateMetadata` with How It Works title and description
- [ ] `HowTo` JSON-LD with 3 steps, `totalTime: "P5D"` (3-5 days turnaround)
- [ ] BreadcrumbList JSON-LD
- [ ] ProcessTimeline component displaying 3 acts: Intelligence > Review > Documentation
- [ ] 17-section card grid grouped by category (visual breakdown of what the safety review covers)
- [ ] Intelligence source bar showing 5 government data sources
- [ ] Monte Carlo scoring explanation in non-technical language
- [ ] Connecting line animation on scroll between timeline steps
- [ ] Final CTA: "See a Sample Safety Binder"

---

### FR-043: Demo Request Page (`/demo`)

**Priority**: P0
**Complexity**: High
**Dependencies**: FR-056, FR-057, FR-058, FR-059
**Target Files**: `src/app/demo/page.tsx`, `src/components/forms/demo-request-form.tsx`

**Description**: Primary conversion page. Framed as "See Your Safety Binder" not "Sales Call." Progressive profiling form with full security stack.

**Acceptance Criteria**:
- [ ] SSG for page shell, Client Component for form
- [ ] `generateMetadata` with demo request title and description
- [ ] Page framing: "See Your Safety Binder" headline, trust strip, what to expect
- [ ] Form fields per FR-057
- [ ] Pre-selected segment if `?segment=` query param present
- [ ] Cloudflare Turnstile (invisible mode)
- [ ] Success state: "Demo request received. We will contact you within 1 business day."
- [ ] `noindex` meta tag (conversion page, not for search indexing)
- [ ] Social proof sidebar: trust metrics, turnaround time, what you get
- [ ] Client Component (`'use client'`) for form

---

### FR-044: Contact Page (`/contact`)

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-056, FR-058
**Target Files**: `src/app/contact/page.tsx`, `src/components/forms/contact-form.tsx`

**Description**: Secondary conversion path with contact form, phone, email, and response time commitment.

**Acceptance Criteria**:
- [ ] SSG for page shell, Client Component for form
- [ ] `generateMetadata` with contact-specific metadata
- [ ] BreadcrumbList JSON-LD
- [ ] Contact form: name, email, subject, message (all required), organization (optional), segment (optional)
- [ ] Response time display: "General inquiries: 1 business day. Procurement questions: 4 hours."
- [ ] Direct contact info: email address, phone number
- [ ] Turnstile bot protection
- [ ] Success state with confirmation message
- [ ] Server Action submission to Supabase + SendGrid notification

---

### FR-045: Solutions Overview Page (`/solutions`)

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-028, FR-017
**Target Files**: `src/app/solutions/page.tsx`

**Description**: Landing page routing visitors to their segment-specific page via segment cards.

**Acceptance Criteria**:
- [ ] SSG
- [ ] Segment cards for all available segments: K-12, Churches/Missions, Higher Education, Corporate, Sports
- [ ] Churches card visually highlighted as beachhead segment
- [ ] Each card links to its segment page
- [ ] BreadcrumbList JSON-LD

---

### FR-046: Higher Education Solutions Page (`/solutions/higher-education`)

**Priority**: P1
**Complexity**: Medium
**Dependencies**: FR-017, FR-025
**Target Files**: `src/app/solutions/higher-education/page.tsx`, `src/content/pages/solutions-higher-ed.ts`

**Description**: Study abroad, Clery Act, and Title IX focus. Positions SafeTrekr as complement to existing study abroad management systems.

**Acceptance Criteria**:
- [ ] SSG
- [ ] Segment-specific metadata and FAQPage JSON-LD
- [ ] Study abroad safety focus with Clery Act compliance messaging
- [ ] "Complement, not replace" positioning against existing study abroad platforms
- [ ] CTA with segment pre-selection

---

### FR-047: Corporate Solutions Page (`/solutions/corporate`)

**Priority**: P1
**Complexity**: Medium
**Dependencies**: FR-017, FR-025
**Target Files**: `src/app/solutions/corporate/page.tsx`, `src/content/pages/solutions-corporate.ts`

**Description**: Duty of care documentation for business travel with mid-market positioning.

**Acceptance Criteria**:
- [ ] SSG
- [ ] Segment-specific metadata and FAQPage JSON-LD
- [ ] Duty of care messaging for corporate travel
- [ ] "Enterprise safety at per-trip pricing" positioning
- [ ] CTA with segment pre-selection

---

### FR-048: About Page (`/about`)

**Priority**: P1
**Complexity**: Low
**Dependencies**: FR-017, FR-026
**Target Files**: `src/app/about/page.tsx`

**Description**: Founding story, mission, category creation narrative. Team section ready to populate.

**Acceptance Criteria**:
- [ ] SSG
- [ ] Unique metadata
- [ ] BreadcrumbList JSON-LD
- [ ] Mission statement and founding story
- [ ] "Why this category needs to exist" narrative
- [ ] Team section (placeholder or founder only until team grows)
- [ ] Category creation context (no existing category for trip safety review)

---

### FR-049: Legal Pages (`/legal/privacy`, `/legal/terms`)

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-017
**Target Files**: `src/app/legal/privacy/page.tsx`, `src/app/legal/terms/page.tsx`

**Description**: Privacy policy and terms of service pages with proper metadata and schema.

**Acceptance Criteria**:
- [ ] SSG
- [ ] Unique metadata per page
- [ ] BreadcrumbList JSON-LD
- [ ] Clean typography for long-form legal text
- [ ] Table of contents with anchor links for navigation
- [ ] "Last updated" date displayed prominently
- [ ] Content provided by legal counsel (placeholder text acceptable for initial scaffold)

---

## Animation System

### FR-050: Motion Preset Library

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-001
**Target Files**: `src/lib/motion.ts`

**Description**: Centralized Framer Motion animation presets with typed variants, easing curves, and duration constants.

**Acceptance Criteria**:
- [ ] Easing curves exported: `default` [0.4, 0, 0.2, 1], `enter` [0.0, 0, 0.2, 1], `spring` [0.22, 1, 0.36, 1]
- [ ] Duration constants exported: `fast` (0.15s), `normal` (0.2s), `slow` (0.5s), `slower` (0.8s), `reveal` (0.8s), `draw` (1.2s)
- [ ] Transition presets exported: `default`, `reveal`, `spring`
- [ ] Animation variants exported with `satisfies Record<string, Variants>`:
  - `fadeUp`: opacity 0 + y:24 to opacity 1 + y:0
  - `fadeIn`: opacity 0 to 1
  - `staggerContainer`: staggerChildren 0.08s, delayChildren 0.1s
  - `cardReveal`: opacity 0, y:16, scale:0.98 to full
  - `routeDraw`: pathLength 0 to 1 (for SVG path animation)
  - `markerPop`: scale 0 to 1 with spring easing
  - `statusPulse`: scale pulse animation
  - `checklistReveal`: staggered check marks
  - `counterAnimate`: number counting animation
- [ ] All variants fully typed with `Variants` from framer-motion
- [ ] Zero runtime cost for Server Components (variants are just data objects)

---

### FR-051: ScrollReveal Component

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-050
**Target Files**: `src/components/motion/scroll-reveal.tsx`

**Description**: Reusable scroll-triggered animation wrapper using Framer Motion `whileInView`.

**Acceptance Criteria**:
- [ ] `'use client'` directive
- [ ] Props: `variant` (key of motion variants, default `'fadeUp'`), `delay?` (number), `className?`, `as?` (HTML element tag), `once?` (boolean, default `true`), `children`
- [ ] Uses `useReducedMotion()` hook from Framer Motion -- returns `null` wrapper (children render immediately) when reduced motion is preferred
- [ ] `whileInView` triggers animation when 20% of element is visible
- [ ] `once: true` prevents re-triggering on scroll back (default)
- [ ] No animation wrapper rendered when `prefers-reduced-motion: reduce` -- children render as plain elements
- [ ] Viewport observer threshold: `{ amount: 0.2 }`

---

### FR-052: StaggerChildren Component

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-050
**Target Files**: `src/components/motion/stagger-children.tsx`

**Description**: Container component that staggers the entrance animation of its children.

**Acceptance Criteria**:
- [ ] `'use client'` directive
- [ ] Props: `staggerDelay?` (number, default 0.08), `className?`, `children`
- [ ] Wraps children in `motion.div` with `staggerContainer` variant
- [ ] Each direct child wrapped in `motion.div` with `fadeUp` variant (or configurable)
- [ ] Respects `prefers-reduced-motion` via `useReducedMotion()`
- [ ] Used for: feature grids, trust metrics, checklist items, card collections

---

### FR-053: Hero Animation Orchestrator

**Priority**: P1
**Complexity**: Medium
**Dependencies**: FR-050, FR-051
**Target Files**: `src/components/motion/hero-animation.tsx`

**Description**: Orchestrated multi-stage animation sequence for the homepage hero (1800ms total).

**Acceptance Criteria**:
- [ ] `'use client'` directive
- [ ] Orchestrates the following sequence:
  - 0ms: Headline fadeUp (500ms duration)
  - 150ms: Subtext fadeUp (500ms)
  - 300ms: CTA buttons fadeUp (400ms)
  - 400ms: Map base fadeIn (600ms)
  - 700ms: Route line routeDraw (1200ms)
  - 900ms: Side panel cardReveal (500ms)
  - 1100ms: Document stack cardReveal staggered (500ms)
  - 1400ms: Status dots markerPop (3x, 80ms stagger, 200ms each)
- [ ] Total sequence completes by ~1800ms
- [ ] When `prefers-reduced-motion: reduce`, ALL content renders immediately with no animation
- [ ] Content (headline, subtext, CTAs) is always in the DOM and visible to screen readers regardless of animation state
- [ ] `aria-hidden` on decorative animation elements that have no semantic meaning

---

## Map Integration

### FR-054: MapLibre Hero Map (Progressive Enhancement)

**Priority**: P1
**Complexity**: High
**Dependencies**: FR-050
**Target Files**: `src/components/maps/hero-map.tsx`, `src/components/maps/interactive-map.tsx`, `src/components/maps/map-style.json`

**Description**: Three-stage progressive enhancement map: static fallback image > lazy-loaded interactive MapLibre > animated crossfade.

**Acceptance Criteria**:
- [ ] **Stage 1 (Static Fallback)**: Pre-rendered map image via `next/image` with `priority` attribute. Explicit `width` and `height` to prevent CLS. Visible immediately.
- [ ] **Stage 2 (Lazy Load)**: `next/dynamic` with `ssr: false` loads MapLibre GL JS when hero enters viewport via IntersectionObserver. Loading: static image remains visible (no spinner).
- [ ] **Stage 3 (Interactive Crossfade)**: Once MapLibre initializes, interactive map crossfades (opacity transition) over static fallback. Route animation plays.
- [ ] Custom map style JSON: desaturated base, `primary-500` route lines, `primary-600` waypoints with `primary-100` halo, safety-color status dots, muted blue-gray water
- [ ] Tile source: MapTiler free tier (100K requests/month)
- [ ] Route GeoJSON data inlined in page props (~2KB)
- [ ] Interactive map budget: < 230KB gzipped (deferred, not blocking initial load)
- [ ] Map container has `aria-label="Interactive map showing trip route"` and `role="img"` (decorative)
- [ ] Works without JavaScript (static image fallback is the SSR experience)

---

### FR-055: Map Performance and Fallback

**Priority**: P1
**Complexity**: Medium
**Dependencies**: FR-054
**Target Files**: `src/components/maps/hero-map.tsx`

**Description**: Ensure map component stays within performance budget and degrades gracefully.

**Acceptance Criteria**:
- [ ] MapLibre GL JS chunk size monitored via bundlewatch (< 200KB gzipped threshold)
- [ ] IntersectionObserver trigger with 200px rootMargin (preloads before user scrolls to map)
- [ ] On slow connections (Network Information API `effectiveType === '2g'` or `saveData === true`), skip MapLibre entirely and keep static image
- [ ] If MapLibre fails to load (network error, CSP block), static image remains visible with no error UI
- [ ] MapLibre CSS loaded alongside component (not in global bundle)
- [ ] Map is non-interactive on mobile (performance optimization) -- static image with route overlay SVG

---

## Form System

### FR-056: Form Architecture (Server Actions + RHF + Zod)

**Priority**: P0
**Complexity**: High
**Dependencies**: FR-001, FR-004
**Target Files**: `src/lib/schemas/*.ts`, `src/actions/*.ts`, `src/lib/turnstile.ts`, `src/lib/email.ts`, `src/lib/supabase.ts`, `src/lib/rate-limit.ts`

**Description**: Form infrastructure: Zod schemas (shared client/server), Server Actions with 8-layer security, SendGrid email delivery, Supabase persistence, Cloudflare Turnstile verification.

**Acceptance Criteria**:
- [ ] Zod schemas in `src/lib/schemas/` for each form type: `demo-request.ts`, `contact.ts`, `newsletter.ts`, `quote-request.ts`, `sample-binder.ts`
- [ ] Each schema includes: email validation, field length limits, honeypot field (`z.string().max(0)`), turnstile token field
- [ ] Server Actions in `src/actions/` with `'use server'` directive for each form
- [ ] Each Server Action implements the 8-layer security model:
  1. Client-side Zod validation (via RHF resolver)
  2. Cloudflare Turnstile challenge (invisible, client-side)
  3. Server-side Turnstile verification (`src/lib/turnstile.ts` calls Cloudflare API)
  4. Server-side Zod validation (never trust client)
  5. Rate limiting: 10 submissions per IP per hour per form type (`src/lib/rate-limit.ts`)
  6. Honeypot field detection (hidden field must be empty)
  7. Input sanitization (strip HTML tags, normalize whitespace)
  8. IP hashing (SHA-256, stored for rate limiting but not as PII)
- [ ] `src/lib/email.ts`: SendGrid integration for transactional email (confirmation to user + notification to team)
- [ ] `src/lib/supabase.ts`: Supabase client for `form_submissions` table with UTM/referrer capture
- [ ] Server Action return type: `{ success: boolean; errors?: Record<string, string>; message?: string }`
- [ ] Forms work without JavaScript (progressive enhancement via `<form action={serverAction}>`)

---

### FR-057: Demo Request Form

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-056
**Target Files**: `src/components/forms/demo-request-form.tsx`, `src/lib/schemas/demo-request.ts`, `src/actions/demo-request.ts`

**Description**: Primary conversion form with progressive profiling.

**Acceptance Criteria**:
- [ ] `'use client'` component using React Hook Form + Zod resolver
- [ ] Required fields: email, first name, last name, organization name
- [ ] Optional fields: role (dropdown: coordinator, administrator, risk-manager, procurement, other), segment (dropdown: k12, higher-ed, churches, corporate, sports, other), trips per year (number), group size (number), preferred demo format (dropdown: video call, in-person, self-guided), message (textarea)
- [ ] Segment dropdown pre-selected from `?segment=` query param
- [ ] Honeypot field: hidden via CSS and `aria-hidden="true"`, `tabindex="-1"`
- [ ] Cloudflare Turnstile widget rendered (invisible mode)
- [ ] React 19 `useActionState` for form submission state management
- [ ] `useFormStatus` for submit button loading state
- [ ] Submit button disabled during submission with spinner icon and `aria-busy="true"`
- [ ] Success state: green confirmation message, form fields hidden
- [ ] Error state: field-level error messages with `aria-describedby` linking to error
- [ ] Double-click prevention: button disables on first click
- [ ] Plausible custom event: `demo_request` on successful submission
- [ ] Email validation: real-time on blur, server-side on submit

---

### FR-058: Contact Form

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-056
**Target Files**: `src/components/forms/contact-form.tsx`, `src/lib/schemas/contact.ts`, `src/actions/contact.ts`

**Description**: Secondary conversion form for general inquiries.

**Acceptance Criteria**:
- [ ] Required fields: email, first name, last name, subject, message (min 10 chars)
- [ ] Optional fields: organization, segment
- [ ] Same security stack as FR-057 (8-layer)
- [ ] Supabase persistence with `form_type = 'contact'`
- [ ] SendGrid notification to team email
- [ ] Success message with response time commitment

---

### FR-059: Cloudflare Turnstile Integration

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-001
**Target Files**: `src/components/forms/turnstile-widget.tsx`, `src/lib/turnstile.ts`

**Description**: Client-side Turnstile widget and server-side token verification.

**Acceptance Criteria**:
- [ ] `TurnstileWidget` Client Component that loads Turnstile script dynamically (not in global bundle)
- [ ] Invisible mode by default (no visible challenge unless risk detected)
- [ ] Callback provides token to parent form via `onVerify` prop
- [ ] Token included in form submission to Server Action
- [ ] `src/lib/turnstile.ts` server utility: `verifyTurnstile(token: string): Promise<boolean>` calls `https://challenges.cloudflare.com/turnstile/v0/siteverify`
- [ ] Graceful degradation: if Turnstile script fails to load, form still submits with a flag (manual review queue)
- [ ] Environment variables: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (client), `TURNSTILE_SECRET_KEY` (server)

---

### FR-060: Newsletter Signup Form

**Priority**: P1
**Complexity**: Medium
**Dependencies**: FR-056
**Target Files**: `src/components/forms/newsletter-form.tsx`, `src/lib/schemas/newsletter.ts`, `src/actions/newsletter.ts`

**Description**: Inline newsletter signup in footer with double opt-in flow.

**Acceptance Criteria**:
- [ ] Single field: email (required)
- [ ] Inline layout: email input + submit button on one row
- [ ] Server Action: validates, creates Supabase `newsletter_subscribers` record with `confirmed = false`, generates `confirmation_token`
- [ ] SendGrid sends double opt-in confirmation email with confirmation link
- [ ] Confirmation link hits an API route that sets `confirmed = true` and `confirmed_at` timestamp
- [ ] Success message: "Please check your email to confirm your subscription."
- [ ] Duplicate email handling: if already subscribed, show friendly message
- [ ] Turnstile protection (can use simpler managed mode for footer context)

---

### FR-061: Health Check API Route

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-003
**Target Files**: `src/app/api/health/route.ts`

**Description**: Lightweight health check endpoint for Kubernetes liveness and readiness probes.

**Acceptance Criteria**:
- [ ] GET `/api/health` returns `{ status: 'ok', timestamp: ISO8601 }` with HTTP 200
- [ ] Response time < 10ms (no external dependencies)
- [ ] Used by Kubernetes liveness and readiness probes
- [ ] No authentication required

---

## SEO Infrastructure

### FR-062: Metadata Utility

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-001
**Target Files**: `src/lib/metadata.ts`

**Description**: Centralized metadata generation utility for consistent SEO across all pages.

**Acceptance Criteria**:
- [ ] `generatePageMetadata(page: PageMetadata): Metadata` function
- [ ] `PageMetadata` interface: `title`, `description`, `path`, `ogImage?`, `noIndex?`, `article?` (publishedTime, modifiedTime, authors, tags)
- [ ] Generates: `title`, `description`, `alternates.canonical` (self-referencing), `openGraph` (title, description, url, siteName, images, locale, type), `twitter` (card, title, description, images), `robots`
- [ ] OG image defaults to `/api/og?title=...` when not overridden
- [ ] `SITE_URL` constant: `https://safetrekr.com`
- [ ] Title template: `"%s | SafeTrekr"` applied via root layout metadata
- [ ] Default description includes mechanism keywords for AI crawlers

---

### FR-063: JSON-LD Structured Data Generators

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-001
**Target Files**: `src/lib/structured-data.ts`

**Description**: Type-safe JSON-LD generator functions for all schema types used across the site.

**Acceptance Criteria**:
- [ ] `generateOrganizationLD()`: Organization schema (root layout, every page)
- [ ] `generateSoftwareApplicationLD()`: SoftwareApplication + AggregateOffer (homepage)
- [ ] `generateFAQPageLD(faqs)`: FAQPage schema (solutions pages, pricing)
- [ ] `generateHowToLD()`: HowTo schema with 3 steps, `totalTime: "P5D"` (How It Works page)
- [ ] `generateArticleLD(article)`: Article schema (blog posts)
- [ ] `generateBreadcrumbLD(items)`: BreadcrumbList (all interior pages)
- [ ] `generateProductLD(tier)`: Product + Offer (pricing page, per tier)
- [ ] All generators return `Record<string, unknown>` objects (not strings)
- [ ] Each rendered as `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />`
- [ ] Valid against Google Rich Results Test (validated in CI per FR-066)

---

### FR-064: Dynamic Sitemap

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-001
**Target Files**: `src/app/sitemap.ts`

**Description**: Programmatic sitemap including all static pages and dynamic blog posts.

**Acceptance Criteria**:
- [ ] Exports `MetadataRoute.Sitemap`
- [ ] Static pages listed: homepage (priority 1.0), solutions pages (0.9), pricing (0.9), how-it-works (0.8), about (0.7), contact (0.7), legal pages (0.5)
- [ ] Blog posts dynamically read from content directory with `lastModified` dates
- [ ] Demo page (`/demo`) NOT included (noindex page)
- [ ] Landing pages (`/lp/*`) NOT included
- [ ] `changeFrequency` set per page type: `monthly` for static, `weekly` for blog index
- [ ] Base URL: `https://safetrekr.com`

---

### FR-065: Robots Configuration

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-001
**Target Files**: `src/app/robots.ts`

**Description**: Robots.txt with explicit AI crawler allowances for AI search optimization.

**Acceptance Criteria**:
- [ ] Exports `MetadataRoute.Robots`
- [ ] `User-agent: *`: allow `/`, disallow `/api/`, `/lp/`
- [ ] Explicitly allow AI crawlers with their own rules: `GPTBot`, `Google-Extended`, `PerplexityBot`, `ClaudeBot`, `Amazonbot`, `Applebot-Extended`, `cohere-ai`
- [ ] Sitemap URL declared: `https://safetrekr.com/sitemap.xml`
- [ ] No overly restrictive disallows that would block marketing content

---

### FR-066: OG Image Generation

**Priority**: P1
**Complexity**: Medium
**Dependencies**: FR-011
**Target Files**: `src/app/api/og/route.tsx`

**Description**: Dynamic Open Graph image generation using `next/og` with Node.js runtime (NOT Edge Runtime) and `sharp`.

**Acceptance Criteria**:
- [ ] `runtime = 'nodejs'` (NOT `'edge'` -- DigitalOcean DOKS does not support Edge Runtime)
- [ ] GET `/api/og?title=...&subtitle=...&motif=...` returns 1200x630 PNG image
- [ ] SafeTrekr logo, title, subtitle, and motif-specific visual element
- [ ] Brand colors: `bg-background` (#e7ecee), `primary` accent bar
- [ ] Plus Jakarta Sans font loaded from local file
- [ ] Response headers: `Cache-Control: public, max-age=86400, s-maxage=86400` (24-hour cache)
- [ ] Fallback: if OG route errors, static default OG image is served
- [ ] No `@vercel/og` import -- use `next/og` directly

---

## Content System

### FR-067: Static Content Architecture

**Priority**: P0
**Complexity**: Low
**Dependencies**: FR-001
**Target Files**: `src/content/types.ts`, `src/content/pages/*.ts`

**Description**: Typed TypeScript content files for all page content. Zero CMS dependency at launch.

**Acceptance Criteria**:
- [ ] `src/content/types.ts` defines interfaces: `SolutionPage`, `PricingPage`, `HowItWorksPage`, `AboutPage`, `FAQItem`, `FeatureItem`, `PricingTier`, `BlogPost`, `Author`, `BlogCategory`, `RegulatoryCallout`
- [ ] `SolutionPage` includes: `slug`, `segment`, `title`, `metaDescription`, `heroHeadline`, `heroSubheadline`, `features`, `faqs`, `testimonial?` (real only), `ctaHeadline`, `ctaDescription`, `regulatoryCallouts`
- [ ] `BlogPost` includes: `slug`, `title`, `excerpt`, `content` (MDX string), `author`, `publishedAt` (ISO 8601), `updatedAt?`, `tags`, `category`, `readingTimeMinutes`, `seoTitle?`, `seoDescription?`
- [ ] Content files in `src/content/pages/`: `homepage.ts`, `pricing.ts`, `how-it-works.ts`, `solutions-k12.ts`, `solutions-churches.ts`, `solutions-higher-ed.ts`, `solutions-corporate.ts`
- [ ] All exported content is statically typed -- TypeScript catches missing fields at build time
- [ ] Pricing data comes from a single source of truth (`pricing.ts`) -- no duplicated values

---

### FR-068: MDX Blog Infrastructure

**Priority**: P1
**Complexity**: Medium
**Dependencies**: FR-001, FR-062, FR-063
**Target Files**: `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/content/blog/*.mdx`, `src/components/mdx/*.tsx`, `src/lib/blog.ts`

**Description**: MDX-powered blog with ISR, custom components, Article JSON-LD, RSS feed, and reading time calculation.

**Acceptance Criteria**:
- [ ] Blog index page at `/blog` with post cards (title, excerpt, date, author, reading time, category)
- [ ] Individual blog post pages at `/blog/[slug]`
- [ ] MDX processing via `next-mdx-remote` with custom components: `Callout`, `ComparisonTable`, `CodeBlock`, `ImageWithCaption`
- [ ] `generateStaticParams` generates paths from all MDX files in `src/content/blog/`
- [ ] ISR revalidation: blog index 3600s (1 hour), individual posts 86400s (24 hours)
- [ ] Article JSON-LD on each post
- [ ] BreadcrumbList JSON-LD: Home > Blog > Post Title
- [ ] OG meta tags with post-specific title, description, and image
- [ ] Reading time calculated from word count (~200 WPM)
- [ ] RSS feed at `/blog/rss.xml` via API route
- [ ] Related posts section (tag-based matching)
- [ ] Category and tag filtering on index page
- [ ] Blog layout with table of contents sidebar (generated from MDX headings)
- [ ] Suspense boundary for blog content (RSC streaming: shell renders immediately, MDX body streams)

---

## Performance

### FR-069: Performance Budget Enforcement

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-007
**Target Files**: `lighthouserc.yml`, `bundlewatch.config.json`

**Description**: Enforced performance targets with CI gates that block merges on regression.

**Acceptance Criteria**:
- [ ] Lighthouse CI configuration (`lighthouserc.yml`):
  - Performance: >= 0.95
  - Accessibility: >= 0.95
  - Best Practices: >= 0.95
  - SEO: >= 0.95
  - LCP: < 1500ms
  - CLS: < 0.05
  - TTI: < 3000ms
- [ ] Lighthouse CI runs against 3 URLs minimum: `/`, `/pricing`, `/solutions/churches`
- [ ] 3 runs per URL for stable scores
- [ ] Bundlewatch configuration (`bundlewatch.config.json`):
  - `.next/static/chunks/main-*.js`: < 80KB
  - `.next/static/chunks/framework-*.js`: < 50KB
  - `.next/static/chunks/pages/**/*.js`: < 30KB each
  - `.next/static/css/**/*.css`: < 25KB
- [ ] Both Lighthouse CI and Bundlewatch run as CI jobs that block PR merge on failure
- [ ] Compression: `defaultCompression: "gzip"` in bundlewatch

---

### FR-070: Image Optimization and Code Splitting

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-003
**Target Files**: `next.config.ts`, component-level dynamic imports

**Description**: Image pipeline via `next/image` with `sharp`, and code splitting strategy for heavy dependencies.

**Acceptance Criteria**:
- [ ] `sharp` installed and functional in Docker container (verified by `next/image` serving AVIF/WebP)
- [ ] All images use `next/image` component with explicit `width`, `height` (or `fill` with container sizing)
- [ ] Above-fold images use `priority` prop
- [ ] Below-fold images use default `loading="lazy"`
- [ ] Static map fallback: served as priority image with explicit dimensions
- [ ] Code splitting strategy:
  - MapLibre GL JS: `next/dynamic` with `ssr: false` (~200KB, deferred until visible)
  - Framer Motion: tree-shaken via `optimizePackageImports` (~15KB used)
  - Dialog/Sheet components: `next/dynamic` (loaded on user interaction)
  - Blog MDX renderer: route-level split (only on blog pages)
  - ROI Calculator: `next/dynamic` (only on pricing page)
  - Cloudflare Turnstile: dynamic script load (only on pages with forms)
- [ ] Total initial JS bundle < 150KB gzipped
- [ ] Total page weight < 500KB (excluding lazy-loaded map)
- [ ] Web fonts < 100KB total
- [ ] Bundle analysis available via `ANALYZE=true npm run build`

---

## Testing Infrastructure

### FR-071: Unit and Integration Testing (Vitest)

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-001
**Target Files**: `vitest.config.ts`, `src/test/setup.ts`, `src/**/*.test.{ts,tsx}`

**Description**: Vitest configuration with React Testing Library, jsdom environment, and coverage thresholds.

**Acceptance Criteria**:
- [ ] Vitest configured with `jsdom` environment, `@vitejs/plugin-react`, `vite-tsconfig-paths`
- [ ] Setup file (`src/test/setup.ts`): imports `@testing-library/jest-dom`, configures MSW handlers, sets up `jest-axe`
- [ ] Coverage thresholds: lines 80%, functions 80%, branches 75%, statements 80%
- [ ] Coverage reporter: `text`, `json`, `html`
- [ ] Test location: `src/**/*.{test,spec}.{ts,tsx}` (co-located with source)
- [ ] Required test coverage per component type:
  - Zod schemas: 100% branch coverage (all validation paths)
  - Server Actions: integration tests with MSW mocking Supabase and SendGrid
  - Form components: user interaction flows via React Testing Library + user-event
  - Utility functions (metadata, structured-data, analytics): unit tests
  - Custom hooks: `renderHook` tests
- [ ] `npm run test:unit` runs all unit/integration tests
- [ ] `npm run test:unit -- --coverage` reports coverage and fails below thresholds
- [ ] MSW configured for mocking: Supabase API, SendGrid API, Turnstile API, MapTiler API

---

### FR-072: E2E and Accessibility Testing (Playwright)

**Priority**: P0
**Complexity**: Medium
**Dependencies**: FR-001, FR-007
**Target Files**: `playwright.config.ts`, `e2e/*.spec.ts`

**Description**: Playwright E2E tests covering critical paths, accessibility scans, and visual regression.

**Acceptance Criteria**:
- [ ] Playwright configured with: 4 projects (Desktop Chrome, Desktop Firefox, Mobile Chrome/Pixel 5, Mobile Safari/iPhone 13), `fullyParallel: true`, retries 2 in CI, traces on first retry, screenshots on failure
- [ ] Web server command: `npm run build && npm run start` (tests against production build)
- [ ] Base URL: `http://localhost:3000`
- [ ] **Critical path E2E tests** (matching SCENARIO-001 through SCENARIO-012 from test scenarios):
  - Homepage renders with hero, trust strip, and navigation
  - Navigation routes to all top-level pages
  - Demo request form submits end-to-end
  - Contact form submits end-to-end
  - Pricing page renders with correct per-student values
  - Solution pages route correctly per segment
  - Mobile responsive layout at 375px, 768px, 1280px
  - Blog post renders with ISR and correct metadata
  - Search engines can crawl: robots.txt, sitemap.xml, meta tags validated
- [ ] **Accessibility E2E tests**:
  - axe-core scan on every public page (`['/', '/pricing', '/how-it-works', '/about', '/contact', '/demo', '/solutions/k12', '/solutions/churches']`)
  - Tags: `wcag2a`, `wcag2aa`, `wcag22aa`
  - Zero violations threshold
  - `npm run test:a11y` runs accessibility suite
- [ ] **Visual regression tests** (P1):
  - Screenshot comparison for 5 key pages at 4 viewports (375, 768, 1280, 1536)
  - `maxDiffPixelRatio: 0.01` (1% tolerance)
  - `animations: 'disabled'` for consistent screenshots
  - Full-page screenshots
- [ ] Edge case E2E tests:
  - Double-click form submission prevention (SCENARIO-014)
  - Maximum field length form submission (SCENARIO-013)
  - Browser back/forward through form flow (SCENARIO-015)
- [ ] `npm run test:e2e` runs full Playwright suite
- [ ] All E2E tests pass in CI as a merge-blocking gate

---

## Dependency Matrix

```
FR-001 (Project Init)
  |-- FR-002 (TypeScript)
  |-- FR-003 (Next.js Config)
  |     |-- FR-004 (Docker)
  |     |     |-- FR-006 (K8s Manifests)
  |     |     |-- FR-007 (CI/CD)
  |     |-- FR-061 (Health Check)
  |-- FR-005 (ESLint/Prettier)
  |-- FR-008 (Tailwind Theme)
  |     |-- FR-009 (Base Styles)
  |     |-- FR-010 (Typography)
  |     |-- FR-013 (Dark Sections)
  |     |-- FR-014 (Spacing)
  |     |-- FR-015 (Contrast Validation)
  |     |-- FR-012 (shadcn/ui)
  |           |-- FR-016 (Button)
  |           |-- FR-021-036 (Component Library)
  |           |-- FR-019 (SiteHeader)
  |           |-- FR-020 (SiteFooter)
  |-- FR-011 (Fonts)
  |-- FR-050 (Motion Presets)
  |     |-- FR-051 (ScrollReveal)
  |     |-- FR-052 (StaggerChildren)
  |     |-- FR-053 (Hero Animation)
  |     |-- FR-054 (MapLibre Map)
  |           |-- FR-055 (Map Performance)
  |-- FR-056 (Form Architecture)
  |     |-- FR-057 (Demo Form)
  |     |-- FR-058 (Contact Form)
  |     |-- FR-059 (Turnstile)
  |     |-- FR-060 (Newsletter)
  |-- FR-062 (Metadata Utility)
  |-- FR-063 (JSON-LD Generators)
  |-- FR-064 (Sitemap)
  |-- FR-065 (Robots)
  |-- FR-066 (OG Images)
  |-- FR-067 (Content Architecture)
  |     |-- FR-068 (MDX Blog)
  |-- FR-069 (Performance Budget)
  |-- FR-070 (Image Opt / Code Split)
  |-- FR-071 (Vitest)
  |-- FR-072 (Playwright)

Pages (depend on components + infrastructure):
  FR-037 (Root Layout) -- FR-011, FR-019, FR-020, FR-063
  FR-038 (Homepage) -- FR-030, FR-023, FR-029, FR-026, FR-031, FR-028, FR-054
  FR-039 (Churches) -- FR-017, FR-025, FR-026, FR-034
  FR-040 (K-12) -- FR-017, FR-025, FR-026
  FR-041 (Pricing) -- FR-031, FR-025
  FR-042 (How It Works) -- FR-027, FR-017, FR-026
  FR-043 (Demo) -- FR-056, FR-057, FR-058, FR-059
  FR-044 (Contact) -- FR-056, FR-058
  FR-045 (Solutions) -- FR-028, FR-017
  FR-046 (Higher Ed) -- FR-017, FR-025
  FR-047 (Corporate) -- FR-017, FR-025
  FR-048 (About) -- FR-017, FR-026
  FR-049 (Legal) -- FR-017
```

---

## Implementation Sequence

### Week 1: Scaffolding + Design System

| FR | Name | Priority |
|----|------|----------|
| FR-001 | Project Init | P0 |
| FR-002 | TypeScript Config | P0 |
| FR-003 | Next.js Config | P0 |
| FR-004 | Dockerfile | P0 |
| FR-005 | ESLint/Prettier | P0 |
| FR-008 | Tailwind Theme | P0 |
| FR-009 | Base Styles | P0 |
| FR-010 | Typography | P0 |
| FR-011 | Fonts | P0 |
| FR-012 | shadcn/ui Init | P0 |
| FR-013 | Dark Sections | P0 |
| FR-014 | Spacing | P0 |
| FR-015 | Contrast Validation | P0 |
| FR-061 | Health Check | P0 |
| FR-062 | Metadata Utility | P0 |
| FR-063 | JSON-LD Generators | P0 |
| FR-064 | Sitemap | P0 |
| FR-065 | Robots | P0 |
| FR-069 | Performance Budget | P0 |
| FR-071 | Vitest Setup | P0 |

### Week 2: Layout + Motion + Form Infrastructure

| FR | Name | Priority |
|----|------|----------|
| FR-016 | Button | P0 |
| FR-017 | SectionContainer | P0 |
| FR-018 | Container | P0 |
| FR-019 | SiteHeader | P0 |
| FR-020 | SiteFooter | P0 |
| FR-037 | Root Layout | P0 |
| FR-050 | Motion Presets | P0 |
| FR-051 | ScrollReveal | P0 |
| FR-052 | StaggerChildren | P0 |
| FR-056 | Form Architecture | P0 |
| FR-059 | Turnstile Integration | P0 |
| FR-006 | K8s Manifests | P0 |
| FR-007 | CI/CD Pipeline | P0 |
| FR-072 | Playwright Setup | P0 |

### Weeks 3-4: Homepage + Conversion Pages

| FR | Name | Priority |
|----|------|----------|
| FR-021 | FeatureCard | P0 |
| FR-022 | TrustMetric | P0 |
| FR-023 | TrustStrip | P0 |
| FR-024 | PricingTierCard | P0 |
| FR-025 | FAQSection | P0 |
| FR-026 | CTABand | P0 |
| FR-027 | ProcessTimeline | P0 |
| FR-028 | SegmentCard | P0 |
| FR-029 | FeatureGrid | P0 |
| FR-030 | HeroHome | P0 |
| FR-033 | DocumentPreview | P1 |
| FR-034 | LeadCaptureModal | P0 |
| FR-038 | Homepage | P0 |
| FR-057 | Demo Form | P0 |
| FR-043 | Demo Page | P0 |
| FR-058 | Contact Form | P0 |
| FR-044 | Contact Page | P0 |
| FR-067 | Content Architecture | P0 |
| FR-070 | Image Opt / Code Split | P0 |

### Weeks 5-6: Segment Pages + SEO

| FR | Name | Priority |
|----|------|----------|
| FR-039 | Churches Page | P0 |
| FR-040 | K-12 Page | P0 |
| FR-041 | Pricing Page | P0 |
| FR-042 | How It Works Page | P0 |
| FR-045 | Solutions Overview | P0 |
| FR-049 | Legal Pages | P0 |
| FR-031 | PricingGrid | P0 |
| FR-035 | IntelSourceBar | P1 |
| FR-036 | MotifBadge | P1 |
| FR-053 | Hero Animation | P1 |
| FR-054 | MapLibre Hero Map | P1 |
| FR-055 | Map Performance | P1 |
| FR-066 | OG Image Generation | P1 |

### Weeks 7-8: Content + Polish + P1 Pages

| FR | Name | Priority |
|----|------|----------|
| FR-032 | FeatureShowcase | P1 |
| FR-046 | Higher Ed Page | P1 |
| FR-047 | Corporate Page | P1 |
| FR-048 | About Page | P1 |
| FR-060 | Newsletter Form | P1 |
| FR-068 | MDX Blog | P1 |
| Visual regression tests | (part of FR-072) | P1 |
| Manual a11y audit | Keyboard + screen reader | P0 |
| Performance audit | Final Lighthouse pass | P0 |

---

## Risk Register

| ID | Risk | Probability | Impact | Mitigation |
|----|------|-------------|--------|------------|
| R01 | MapLibre bundle exceeds 200KB budget | Low | Medium | Lazy-load via `next/dynamic`; bundlewatch gate; Protomaps fallback (30KB) |
| R02 | Framer Motion tree-shaking ineffective | Low | Medium | `optimizePackageImports`; measure with bundle analyzer; CSS fallback for simple animations |
| R03 | Color contrast failures in production | High | High | Corrected tokens in FR-008; axe-core CI gate; contrast-safe pairs documented |
| R04 | Zero real testimonials at launch | High | High | TrustStrip with verifiable facts; architecture ready for real testimonials; collect from 104 existing orgs |
| R05 | CSP headers block third-party services | Medium | Medium | Test CSP in report-only mode during development; explicit allowlists |
| R06 | ISR cache behavior differs on DOKS vs Vercel | Medium | Medium | Test ISR with filesystem cache handler; configure Next.js cache handler if needed; fall back to SSG with manual rebuilds |
| R07 | `sharp` binary issues in Alpine Docker | Medium | Low | Pin platform/arch in npm install; test in CI Docker build; alternative: use `node:22-slim` instead of Alpine |
| R08 | Standalone output missing files | Medium | Medium | Verify `.next/standalone` includes all required files in CI; test Docker image locally before deploy |

---

## Quality Gates (Merge Blocking)

Every PR must pass ALL of the following before merge:

| Gate | Tool | Threshold |
|------|------|-----------|
| TypeScript | `tsc --noEmit` | Zero errors |
| ESLint | `eslint .` | Zero errors (warnings acceptable) |
| Unit Tests | Vitest | 80% coverage, zero failures |
| Build | `next build` | Zero errors, standalone output generated |
| Bundle Size | Bundlewatch | Within per-chunk budgets |
| Accessibility | axe-core via Playwright | Zero WCAG 2.2 AA violations |
| Lighthouse | LHCI | Performance >= 95, Accessibility >= 95, SEO >= 95 |
| E2E | Playwright | Zero failures on critical paths |

---

## Non-Functional Requirements Summary

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| LCP | < 1.5s | Lighthouse CI |
| CLS | < 0.05 | Lighthouse CI |
| INP | < 100ms | RUM via Plausible custom props |
| TTFB | < 200ms | Nginx access logs (DOKS, not Vercel Edge) |
| Initial JS Bundle | < 150KB gzipped | Bundlewatch |
| Total Page Weight | < 500KB | Build analysis |
| Map Component | < 230KB gzipped | Deferred, not blocking |
| Web Fonts | < 100KB | Network waterfall |
| Lighthouse Performance | >= 95 | CI gate |
| Lighthouse Accessibility | >= 95 | CI gate |
| WCAG Compliance | 2.2 AA | axe-core + manual audit |
| TypeScript | Strict mode, zero `any` | CI gate |
| Docker Image Size | < 200MB | CI build log |
| Build Time | < 120s | CI pipeline |
| Container Startup | < 10s | K8s readiness probe |
| Uptime | 99.9% | K8s HPA + health checks |

---

*Generated by React Developer Persona on 2026-03-24*
*Binding Tech Stack: TECH-STACK.md (DigitalOcean DOKS, SendGrid, Docker standalone)*
*Input Sources: ANALYSIS.md, react-developer.md, TECH-STACK.md, scenarios.md*
