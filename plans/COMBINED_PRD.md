# SafeTrekr Marketing Site -- Master PRD

**Version**: 1.0.0
**Date**: 2026-03-24
**Author**: Product Owner (Synthesized from 7 Persona PRDs)
**Status**: APPROVED -- Single Source of Truth
**Project**: SafeTrekr Marketing Site (Greenfield)
**Total Requirements**: 242

---

## How to Read This Document

This is the **single source of truth** for the SafeTrekr marketing site. Every implementation agent reads this file and follows it. Requirements are organized into 6 Epics representing logical implementation waves. Each REQ includes:

- **ID**: Sequential `REQ-NNN`
- **Title**: What is being built
- **Priority**: P0 (launch blocker), P1 (ship within 30 days), P2 (growth phase)
- **Complexity**: Low / Medium / High
- **Dependencies**: Other REQ IDs this depends on
- **Target Files**: Where this code lives
- **Description**: What to build
- **Acceptance Criteria**: Testable conditions for "done"
- **Persona Sources**: Which persona PRD(s) this requirement came from, with FR IDs

When two or more persona PRDs specify the same component, they are merged into a single REQ with pointers to all sources. The UI Designer PRD provides visual specification; the React Developer PRD provides implementation detail; the Security PRD provides hardening requirements. All apply simultaneously.

---

## Binding Tech Stack

Every agent MUST build against this stack. No alternatives unless explicitly flagged as a risk.

| Category | Decision | Notes |
|----------|----------|-------|
| Architecture | Static-first (SSG/ISR) + Docker | Next.js standalone output in Docker |
| Backend | Next.js 15 API Routes / Server Actions | No separate backend service |
| Database | PostgreSQL via Supabase (separate project) | Isolated from product DB |
| Frontend | Next.js 15 (App Router) + React 19 | App Router with Server Components |
| Design Framework | Tailwind CSS 4 + shadcn/ui | Custom design tokens via `@theme` |
| State Management | React Context (minimal) | Mostly static pages, minimal client state |
| Caching | Nginx reverse proxy + Next.js ISR | ISR for blog, SSG for marketing pages |
| Transactional Email | SendGrid | Existing in product stack |
| Containerization | Docker | Next.js standalone output mode |
| Container Orchestration | Kubernetes (DigitalOcean DOKS) | Production K8s on DigitalOcean |
| CI/CD | GitHub Actions | Build -> Push -> Deploy to DOKS |
| Hosting | DigitalOcean | DOKS + Spaces CDN |
| Maps | MapLibre GL JS | BSD license, zero per-load cost |
| Analytics | Plausible (primary) + GA4 (optional) | Privacy-first for K-12/church audience |
| Animation | Framer Motion | Tree-shaken ~15KB |
| Bot Protection | Cloudflare Turnstile | Free, privacy-preserving |
| CDN | DigitalOcean Spaces CDN or Cloudflare | Static assets + image optimization |

**Deployment Flow**:
```
GitHub Push -> GitHub Actions CI/CD
  -> Docker Build (Next.js standalone)
  -> Push to DigitalOcean Container Registry
  -> Deploy to DOKS (DigitalOcean Kubernetes)
  -> Nginx Ingress Controller (SSL termination, caching)
  -> Cloudflare DNS (optional CDN layer)
```

**Prohibited** (Vercel-specific features):
| Prohibited | Replacement |
|------------|-------------|
| Vercel Edge Runtime | Node.js middleware on standalone server |
| `@vercel/analytics` | Plausible Analytics |
| `@vercel/og` (Edge) | `next/og` with `runtime = 'nodejs'` + `sharp` |
| Vercel Preview Deploys | GitHub Actions + staging K8s namespace |
| Vercel Image Optimization CDN | `next/image` with `sharp` (self-hosted) |
| Vercel Blob / KV / Postgres | Supabase (separate project) |

See `./plans/TECH-STACK.md` for the full binding tech stack document.

---

## Performance Budget (Non-Negotiable)

| Metric | Target | Enforcement |
|--------|--------|-------------|
| LCP | < 1.5s | Lighthouse CI gate |
| CLS | < 0.05 | Lighthouse CI gate |
| INP | < 100ms | Lighthouse CI gate |
| Total initial page weight | < 500KB | bundlewatch CI gate |
| JS bundle (gzipped) | < 150KB | bundlewatch CI gate |
| MapLibre (gzipped, lazy) | < 200KB | bundlewatch CI gate |
| Web fonts | < 100KB | bundlewatch CI gate |
| Docker image | < 200MB | CI check via `docker inspect` |
| Lighthouse Performance | >= 95 | CI gate |
| Lighthouse Accessibility | >= 95 | CI gate |
| Lighthouse SEO | >= 95 | CI gate |
| Lighthouse Best Practices | >= 95 | CI gate |

---

## Epic Overview

| Epic | Name | Timeline | REQ Count | Focus |
|------|------|----------|-----------|-------|
| 1 | Foundation & Infrastructure | Week 1-2 | 40 | Scaffolding, Docker, DOKS, design tokens, CI/CD |
| 2 | Core Pages & Components | Week 3-4 | 52 | Homepage, navigation, forms, design system components |
| 3 | Segment Pages & Content | Week 5-6 | 30 | Solutions pages, how it works, pricing, about |
| 4 | SEO, Analytics & Marketing | Week 7-8 | 42 | Schema markup, blog, analytics, email capture |
| 5 | Security, Testing & Polish | Week 9-10 | 48 | Security hardening, testing pyramid, a11y audit |
| 6 | Growth Features | Week 11-16 | 30 | ROI calculator, comparison pages, procurement hub |

---

# EPIC 1: Foundation & Infrastructure (Week 1-2)

Goal: A deployable, empty Next.js application running on DOKS with full CI/CD, design tokens, and typography -- the foundation every other Epic builds on.

---

### REQ-001: Next.js Project Initialization

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: None (first task)
- **Target Files**: `package.json`, `package-lock.json`, `.nvmrc`, `.npmrc`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-001

**Description**: Initialize a Next.js 15 project with React 19, all production and development dependencies, and Node.js version pinning.

**Acceptance Criteria**:
- [ ] `package.json` contains all production dependencies: `next@^15.2`, `react@^19`, `react-dom@^19`, `framer-motion@^11.15`, `maplibre-gl@^4.7`, `react-hook-form@^7`, `@hookform/resolvers@^3`, `zod@^3`, `class-variance-authority@^0.7`, `clsx@^2`, `tailwind-merge@^2`, `lucide-react@^0.450`, `@sendgrid/mail@^8`, `next-mdx-remote@^5`, `gray-matter@^4`, `sharp@^0.33`, `@supabase/supabase-js@^2`
- [ ] `package.json` contains all devDependencies: `typescript@^5.7`, `@types/react@^19`, `@types/react-dom@^19`, `tailwindcss@^4`, `@tailwindcss/postcss@^4`, `postcss@^8`, `eslint@^9`, `eslint-config-next@^15`, `@eslint/js@^9`, `typescript-eslint@^8`, `eslint-plugin-jsx-a11y@^6`, `prettier@^3`, `prettier-plugin-tailwindcss@^0.6`, `@playwright/test@^1.49`, `vitest@^2`, `@testing-library/react@^16`, `@testing-library/jest-dom@^6`, `@testing-library/user-event@^14`, `jsdom@^25`, `axe-core@^4`, `@axe-core/playwright@^4`, `jest-axe@^9`, `@lhci/cli@^0.14`, `bundlewatch@^0.4`, `msw@^2`
- [ ] No `@vercel/*` packages present
- [ ] `.nvmrc` pins Node.js to `22`
- [ ] `.npmrc` sets `engine-strict=true`
- [ ] `package.json` scripts include: `dev`, `build`, `start`, `lint`, `type-check`, `test:unit`, `test:e2e`, `test:a11y`
- [ ] Radix UI primitives installed: `@radix-ui/react-accordion`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `@radix-ui/react-scroll-area`, `@radix-ui/react-slot`
- [ ] `npm ci && npm run build` completes without errors

---

### REQ-002: TypeScript Configuration

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-001
- **Target Files**: `tsconfig.json`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-002

**Description**: Configure TypeScript in strict mode with path aliases, `noUncheckedIndexedAccess`, and `ES2022` target.

**Acceptance Criteria**:
- [ ] `strict: true`, `noUncheckedIndexedAccess: true`, `noUnusedLocals: true`, `noUnusedParameters: true`
- [ ] `forceConsistentCasingInFileNames: true`
- [ ] `target: "ES2022"`, `module: "esnext"`, `moduleResolution: "bundler"`
- [ ] Path aliases: `@/*`, `@/components/*`, `@/lib/*`, `@/hooks/*`, `@/content/*`, `@/actions/*`, `@/styles/*`
- [ ] `allowJs: false`, `jsx: "preserve"`, `incremental: true`
- [ ] Zero type errors on `npm run type-check`

---

### REQ-003: Next.js Configuration

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-001
- **Target Files**: `next.config.ts`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-003; `./plans/devops-platform-engineer.md` -- FR-INFRA-001 (Section 2.2); `./plans/world-class-appsec-security-architect.md` -- FR-SEC-008

**Description**: Configure Next.js 15 for standalone Docker output, `sharp`-based image optimization, security headers, and package import optimization.

**Acceptance Criteria**:
- [ ] `output: 'standalone'` set for Docker deployment
- [ ] `reactStrictMode: true`
- [ ] `images.formats` set to `['image/avif', 'image/webp']`
- [ ] `images.remotePatterns` includes `api.maptiler.com`
- [ ] Security headers applied to all routes via `async headers()`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Strict-Transport-Security`, `Content-Security-Policy` (nonce-based, see REQ-039)
- [ ] `experimental.optimizePackageImports` includes `lucide-react` and `framer-motion`
- [ ] No `runtime: 'edge'` in any route configuration
- [ ] `sharp` resolves correctly in standalone output

---

### REQ-004: ESLint and Prettier Configuration

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-001
- **Target Files**: `eslint.config.mjs`, `.prettierrc`, `.prettierignore`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-005

**Description**: ESLint flat config (v9) with Next.js, TypeScript, and accessibility rules. Prettier with Tailwind CSS plugin.

**Acceptance Criteria**:
- [ ] ESLint flat config extends: `@eslint/js`, `typescript-eslint` strict, `eslint-config-next`
- [ ] `eslint-plugin-jsx-a11y` in **strict** mode with all rules at `error` level
- [ ] `@typescript-eslint/no-explicit-any: error`
- [ ] `prettier-plugin-tailwindcss` installed
- [ ] `npm run lint` passes with zero errors on initial scaffolding

---

### REQ-005: Dockerfile and Docker Build

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-001, REQ-003
- **Target Files**: `Dockerfile`, `.dockerignore`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-004; `./plans/devops-platform-engineer.md` -- FR-INFRA-001; `./plans/world-class-appsec-security-architect.md` -- FR-SEC-040

**Description**: Multi-stage Docker build producing a minimal standalone Next.js container with `sharp` for image optimization. No secrets baked into image.

**Acceptance Criteria**:
- [ ] Multi-stage Dockerfile: `deps` (install), `builder` (build), `runner` (production)
- [ ] Base image: `node:22-alpine`
- [ ] Standalone output copied to runner stage: `.next/standalone`, `.next/static`, `public`
- [ ] Runner stage uses non-root user (`nextjs:nodejs`, UID 1001)
- [ ] Final image size under 200MB
- [ ] `EXPOSE 3000` and `CMD ["node", "server.js"]`
- [ ] Health check: `HEALTHCHECK CMD wget -qO- http://localhost:3000/api/health || exit 1`
- [ ] Only `NEXT_PUBLIC_*` vars as build ARGs; all secrets injected at runtime by K8s
- [ ] `.dockerignore` excludes: `node_modules`, `.next`, `.git`, `*.md`, `e2e`, `coverage`, `.env*`
- [ ] `docker build && docker run -p 3000:3000` starts successfully

---

### REQ-006: Docker Compose Local Development

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-005
- **Target Files**: `docker-compose.yml`, `docker-compose.dev.yml`, `Dockerfile.dev`
- **Persona Sources**: See `./plans/devops-platform-engineer.md` -- FR-INFRA-002

**Description**: Local development environment mirroring production topology without requiring K8s.

**Acceptance Criteria**:
- [ ] `docker compose up` starts the production image on port 3000
- [ ] `docker compose -f docker-compose.yml -f docker-compose.dev.yml up` starts dev mode with hot reload
- [ ] Health check passes within 15 seconds

---

### REQ-007: DigitalOcean DOKS Cluster Provisioning

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: None (infrastructure)
- **Target Files**: Documentation / runbook
- **Persona Sources**: See `./plans/devops-platform-engineer.md` -- FR-INFRA-003

**Description**: Provision managed Kubernetes cluster on DigitalOcean with HA control plane, 2-node general pool, autoscaling.

**Acceptance Criteria**:
- [ ] Cluster `safetrekr-marketing` in `nyc1`, K8s 1.31.x, HA control plane
- [ ] Node pool: `s-2vcpu-4gb`, 2 nodes min, 4 max, autoscale enabled
- [ ] Namespaces created: `production`, `staging`, `preview`, `ingress-nginx`, `cert-manager`, `monitoring`
- [ ] `kubectl get nodes` returns 2 ready nodes

---

### REQ-008: DigitalOcean Container Registry

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-007
- **Target Files**: Documentation / runbook
- **Persona Sources**: See `./plans/devops-platform-engineer.md` -- FR-INFRA-004

**Description**: Private container registry for Docker images used by DOKS.

**Acceptance Criteria**:
- [ ] Registry `safetrekr` on Starter plan
- [ ] Image tagging: `sha-<short_sha>` (immutable), `latest`, `staging`, `pr-<number>`
- [ ] DOKS cluster can pull images without explicit `imagePullSecrets`
- [ ] Weekly garbage collection configured

---

### REQ-009: Kubernetes Manifests

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-005, REQ-007
- **Target Files**: `infra/k8s/base/deployment.yaml`, `infra/k8s/base/service.yaml`, `infra/k8s/overlays/production/ingress.yaml`, `infra/k8s/base/hpa.yaml`, `infra/k8s/overlays/production/configmap.yaml`, `infra/k8s/base/secret.yaml` (template), `infra/k8s/base/pdb.yaml`, `infra/k8s/base/serviceaccount.yaml`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-006; `./plans/devops-platform-engineer.md` -- FR-INFRA-005; `./plans/world-class-appsec-security-architect.md` -- FR-SEC-038, FR-SEC-039, FR-SEC-043

**Description**: Complete Kubernetes manifests for deploying the marketing site to DOKS.

**Acceptance Criteria**:
- [ ] Deployment: 2 replicas min, resource requests (256Mi memory, 100m CPU), limits (512Mi, 500m CPU), liveness/readiness/startup probes on `/api/health`, rolling update (maxSurge: 1, maxUnavailable: 0), non-root user, `seccompProfile: RuntimeDefault`, `topologySpreadConstraints`
- [ ] Service: ClusterIP, port 80 -> 3000
- [ ] Ingress: Nginx class, TLS via cert-manager, hosts `safetrekr.com` + `www.safetrekr.com`, www-to-apex redirect, security headers, gzip/brotli compression, rate limiting
- [ ] HPA: min 2, max 6 replicas, target CPU 70%, memory 80%
- [ ] ConfigMap for `NEXT_PUBLIC_*` variables
- [ ] Secret template (never committed with real values)
- [ ] PodDisruptionBudget: minAvailable 1
- [ ] ServiceAccount with `automountServiceAccountToken: false`
- [ ] Staging namespace variant with reduced replicas (1)

---

### REQ-010: Nginx Ingress Controller and SSL

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-007
- **Target Files**: `infra/k8s/cluster/clusterissuer-production.yaml`, Helm values
- **Persona Sources**: See `./plans/devops-platform-engineer.md` -- FR-INFRA-006

**Description**: Nginx Ingress for HTTP routing, SSL termination via cert-manager + Let's Encrypt, Brotli/gzip compression.

**Acceptance Criteria**:
- [ ] Nginx Ingress Controller installed via Helm with 2 replicas
- [ ] cert-manager installed with Let's Encrypt ClusterIssuer (production + staging)
- [ ] HTTPS with valid Let's Encrypt certificate on `safetrekr.com`
- [ ] HTTP -> HTTPS redirect (301)
- [ ] `www.safetrekr.com` -> `safetrekr.com` redirect (301)
- [ ] Brotli and gzip compression active
- [ ] TLS 1.2 + 1.3 only, strong cipher suites
- [ ] HSTS with preload

---

### REQ-011: GitHub Actions CI/CD Pipeline

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-004, REQ-005, REQ-008
- **Target Files**: `.github/workflows/ci.yml`, `.github/workflows/deploy-production.yml`, `.github/workflows/deploy-staging.yml`, `.github/workflows/cleanup.yml`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-007; `./plans/devops-platform-engineer.md` -- FR-INFRA-007

**Description**: CI pipeline (lint, type-check, test, build, e2e, Lighthouse, a11y, bundle size) on every PR. Deploy pipeline on merge to `main`.

**Acceptance Criteria**:
- [ ] `ci.yml` triggers on PR to `main`/`staging` and push to `main`/`staging`
- [ ] Jobs: `lint-type-check`, `unit-tests` (with coverage), `build` + bundlewatch, `e2e-tests`, `lighthouse`, `accessibility`
- [ ] Deploy to staging on merge to `staging`; deploy to production on merge to `main`
- [ ] Docker build + push to DOCR + `kubectl apply` to DOKS
- [ ] All CI jobs must pass before PR merge (branch protection)
- [ ] Weekly cleanup cron: registry garbage collection + preview namespace cleanup
- [ ] Concurrency control: cancel in-progress runs on same ref

---

### REQ-012: Tailwind CSS 4 Design Token System

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-001
- **Target Files**: `src/styles/globals.css`, `postcss.config.mjs`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-008; `./plans/world-class-ui-designer.md` -- FR-DT-001 through FR-DT-013

**Description**: Complete design token system using Tailwind CSS 4 `@theme inline` directive with 60+ CSS custom properties covering colors, typography, spacing, shadows, radii, z-index, animation tokens, and layout tokens.

**Acceptance Criteria**:
- [ ] `@import "tailwindcss"` at top of `globals.css`
- [ ] `@theme inline` block defines ALL tokens as CSS custom properties
- [ ] **Semantic colors**: `--color-background: #e7ecee`, `--color-foreground: #061a23`, `--color-card: #f7f8f8`, `--color-card-foreground: #061a23`, `--color-muted-foreground: #4d5153` (CORRECTED from `#616567` -- 5.2:1 contrast ratio), `--color-border: #b8c3c7`, `--color-ring: #365462`
- [ ] **Brand primary (green)**: `--color-primary-50` through `--color-primary-950`, `--color-primary: #4ca46e`, `--color-primary-foreground: #ffffff`
- [ ] **Secondary (authority blue)**: `--color-secondary: #123646`, `--color-secondary-foreground: #f7f8f8`
- [ ] **Destructive**: `--color-destructive: #c1253e`
- [ ] **Safety status** (operational use ONLY): `--color-safety-green: #22c55e`, `--color-safety-yellow: #eab308`, `--color-safety-red: #ef4444`
- [ ] **Warning scale**: `--color-warning-50` through `--color-warning-900`
- [ ] **Dark surface overrides** via `[data-theme="dark"]` selector
- [ ] **Spacing**: 8-point grid, `--spacing-section-desktop: 128px`, `--spacing-section-tablet: 80px`, `--spacing-section-mobile: 64px`
- [ ] **Border radius**: `--radius-sm: 4px` through `--radius-2xl: 20px`, `--radius-full: 9999px`
- [ ] **Shadows** (cool-toned from foreground): `--shadow-sm` through `--shadow-xl`, `--shadow-card`, `--shadow-card-hover`
- [ ] **Animation**: `--ease-default`, `--ease-enter`, `--ease-spring`, `--duration-fast` through `--duration-draw`
- [ ] **Z-index**: `--z-behind` through `--z-toast`
- [ ] **Layout**: `--container-max: 1280px`, `--container-bleed: 1440px`
- [ ] Button backgrounds use `primary-600` (#3f885b, 4.6:1 with white), NOT `primary-500` (3.4:1, FAILS AA)
- [ ] `primary-700` (#33704b) for text links (6.1:1 on background)

---

### REQ-013: Base Styles and Accessibility Foundations

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-012
- **Target Files**: `src/styles/globals.css`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-009; `./plans/world-class-ui-designer.md` -- FR-DT-007

**Description**: Base layer styles for html/body, focus-visible indicators, reduced motion override, skip navigation link, and dark section strategy.

**Acceptance Criteria**:
- [ ] `@layer base` block with: `html { scroll-behavior: smooth }`, `body { background, foreground }`
- [ ] Universal `*:focus-visible`: `outline: 2px solid var(--color-ring)`, `outline-offset: 2px`
- [ ] `@media (prefers-reduced-motion: reduce)`: forces `animation-duration: 0.01ms !important`, `transition-duration: 0.01ms !important`, `scroll-behavior: auto !important`
- [ ] `.skip-link` class: off-screen, visible on `:focus`, `z-index: 100`
- [ ] `[data-theme="dark"]` selector overrides semantic tokens for dark sections (scoped, NOT global dark mode)

---

### REQ-014: Typography System

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-012
- **Target Files**: `src/styles/globals.css`, `src/lib/fonts.ts`, `src/app/layout.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-010, FR-011; `./plans/world-class-ui-designer.md` -- FR-TY-001, FR-TY-002, FR-TY-003

**Description**: Font loading (Plus Jakarta Sans, Inter, JetBrains Mono) and fluid typography scale using `clamp()`.

**Acceptance Criteria**:
- [ ] Plus Jakarta Sans: weights 600, 700, 800; `--font-display`; `preload: true`
- [ ] Inter: weights 400, 500, 600; `--font-body`; `preload: true`
- [ ] JetBrains Mono: weights 400, 500; `--font-mono`; `preload: false`
- [ ] All fonts: `display: 'swap'`, `subsets: ['latin']`, self-hosted via `next/font`
- [ ] Total font weight under 100KB
- [ ] Typography utility classes: `.text-display-xl` through `.text-mono-sm` using `clamp()` for fluid sizing
- [ ] `.text-eyebrow`: 13px, weight 600, `letter-spacing: 0.08em`, `text-transform: uppercase`
- [ ] Max line widths enforced in components: headlines 20ch, body 65ch, cards 45ch

---

### REQ-015: shadcn/ui Initialization

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-012, REQ-013
- **Target Files**: `components.json`, `src/components/ui/*`, `src/lib/utils.ts`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-012

**Description**: Initialize shadcn/ui with SafeTrekr design tokens and install all required primitive components.

**Acceptance Criteria**:
- [ ] `components.json` configured with SafeTrekr paths and aliases
- [ ] `cn()` utility combining `clsx` and `tailwind-merge`
- [ ] Primitives installed: Button, Card, Input, Textarea, Label, Badge, Separator, Accordion, Tabs, Dialog, Sheet, DropdownMenu, Tooltip, NavigationMenu, ScrollArea
- [ ] All primitives use SafeTrekr color tokens
- [ ] All primitives pass axe-core accessibility scan

---

### REQ-016: Spacing System

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-012
- **Target Files**: `src/styles/globals.css`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-014; `./plans/world-class-ui-designer.md` -- FR-DT-008

**Description**: 8-point grid spacing with responsive section padding utilities.

**Acceptance Criteria**:
- [ ] All spacing values multiples of 4px (8-point grid)
- [ ] Section padding utilities: `.section-padding-sm`, `.section-padding-md`, `.section-padding-lg`
- [ ] Content width utilities: `.max-w-content` (1280px), `.max-w-full-bleed` (1440px)

---

### REQ-017: Color Contrast Validation

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-012
- **Target Files**: `src/styles/contrast-pairs.md` or inline comments
- **Persona Sources**: See `./plans/react-developer.md` -- FR-015

**Description**: Document and validate all text-on-background color pairings against WCAG 2.2 AA.

**Acceptance Criteria**:
- [ ] `muted-foreground` (#4d5153) on `background` (#e7ecee): >= 5.0:1
- [ ] `foreground` on `background`: >= 12:1
- [ ] White on `primary-600`: >= 4.5:1
- [ ] `secondary-foreground` on `secondary`: >= 7:1
- [ ] White on `destructive`: >= 4.5:1
- [ ] axe-core validates all color pairs at build time

---

### REQ-018: Motion Preset Library

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-001
- **Target Files**: `src/lib/motion.ts`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-050; `./plans/world-class-ui-designer.md` -- FR-MO-001, FR-MO-002

**Description**: Centralized Framer Motion animation presets with typed variants, easing curves, and duration constants.

**Acceptance Criteria**:
- [ ] Easing curves exported: `default`, `enter`, `exit`, `spring`
- [ ] Duration constants: `instant` through `draw`
- [ ] Animation variants: `fadeUp`, `fadeUpLarge`, `fadeIn`, `scaleIn`, `cardReveal`, `routeDraw`, `markerPop`, `statusPulse`, `checklistReveal`, `documentStack`, `gaugeFill`, `staggerContainer`, `staggerContainerSlow`, `counterAnimate`
- [ ] All variants typed with `Variants` from framer-motion
- [ ] Zero runtime cost for Server Components (data objects only)

---

### REQ-019: ScrollReveal Component

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-018
- **Target Files**: `src/components/motion/scroll-reveal.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-051; `./plans/world-class-ui-designer.md` -- FR-MO-003

**Description**: Reusable scroll-triggered animation wrapper using Framer Motion `whileInView`.

**Acceptance Criteria**:
- [ ] `'use client'` directive
- [ ] Props: `variant`, `delay?`, `className?`, `as?`, `once?` (default true)
- [ ] `useReducedMotion()` hook: renders children as plain elements when reduced motion preferred
- [ ] Viewport threshold: 20% visible
- [ ] `once: true` prevents re-triggering

---

### REQ-020: StaggerChildren Component

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-018
- **Target Files**: `src/components/motion/stagger-children.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-052; `./plans/world-class-ui-designer.md` -- FR-MO-004

**Description**: Container that staggers entrance animation of children.

**Acceptance Criteria**:
- [ ] `'use client'` directive
- [ ] Props: `staggerDelay?` (default 0.08), `className?`, `children`
- [ ] Respects `prefers-reduced-motion`
- [ ] Used for: feature grids, trust metrics, card collections

---

### REQ-021: Health Check API Route

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-003
- **Target Files**: `src/app/api/health/route.ts`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-061

**Description**: Lightweight health check for K8s liveness and readiness probes.

**Acceptance Criteria**:
- [ ] GET `/api/health` returns `{ status: 'ok', timestamp: ISO8601 }` with HTTP 200
- [ ] Response time < 10ms
- [ ] No authentication required

---

### REQ-022: DNS and CDN Configuration

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-010
- **Target Files**: Documentation / runbook
- **Persona Sources**: See `./plans/devops-platform-engineer.md` -- FR-INFRA-010

**Description**: Cloudflare DNS configuration pointing to DOKS load balancer with Full (Strict) SSL mode.

**Acceptance Criteria**:
- [ ] Cloudflare DNS A record for `safetrekr.com` pointing to DO Load Balancer IP
- [ ] CNAME `www` -> `safetrekr.com`
- [ ] SSL mode: Full (Strict)
- [ ] Cloudflare proxy enabled for DDoS protection

---

### REQ-023: Monitoring and Alerting

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-007
- **Target Files**: `infra/k8s/monitoring/`
- **Persona Sources**: See `./plans/devops-platform-engineer.md` -- FR-INFRA-011

**Description**: Cluster and application monitoring with alerting for critical failures.

**Acceptance Criteria**:
- [ ] DigitalOcean Monitoring enabled for DOKS cluster
- [ ] Alerts configured: pod restart > 3 times, node not ready, certificate expiry < 14 days, disk > 85%
- [ ] Application health check dashboard

---

### REQ-024: Centralized Logging

- **Priority**: P1
- **Complexity**: Medium
- **Dependencies**: REQ-007
- **Target Files**: `infra/k8s/logging/`
- **Persona Sources**: See `./plans/devops-platform-engineer.md` -- FR-INFRA-012

**Description**: Centralized log collection from application pods.

**Acceptance Criteria**:
- [ ] Application logs collected and queryable
- [ ] Log retention: 30 days
- [ ] Structured JSON logging from Next.js

---

### REQ-025: Supabase Project Setup

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: None (infrastructure)
- **Target Files**: Supabase migrations
- **Persona Sources**: See `./plans/database-architect.md` -- FR-DB-001, FR-DB-002

**Description**: Dedicated marketing Supabase project isolated from product database.

**Acceptance Criteria**:
- [ ] Project `safetrekr-marketing` on Pro plan in US East
- [ ] Zero network paths to product Supabase project
- [ ] `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY` in K8s Secrets
- [ ] `anon` key never used in application code; all access via `service_role` server-side
- [ ] Extensions enabled: `pgcrypto`, `uuid-ossp`, `pg_stat_statements`, `pg_trgm`

---

### REQ-026: Database Schema -- Core Tables

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-025
- **Target Files**: `supabase/migrations/`
- **Persona Sources**: See `./plans/database-architect.md` -- FR-DB-010, FR-DB-011, FR-DB-012, FR-DB-013, FR-DB-014, FR-DB-016

**Description**: All database tables for the marketing site: enums, `form_submissions`, `newsletter_subscribers`, `analytics_events`, `rate_limits`, `crm_sync_queue`.

**Acceptance Criteria**:
- [ ] 5 enum types created: `form_type`, `lead_status`, `organization_segment`, `submission_source`, `crm_sync_status`
- [ ] `form_submissions` table with unified JSONB `details` column, all constraints, email format check
- [ ] `newsletter_subscribers` with UNIQUE email, double opt-in fields, confirmation token auto-generation
- [ ] `analytics_events` (append-only, no `updated_at`)
- [ ] `rate_limits` for sliding-window rate limit tracking
- [ ] `crm_sync_queue` with exponential backoff retry fields
- [ ] All tables have `created_at` / `updated_at` defaults

---

### REQ-027: Database Indexes

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-026
- **Target Files**: `supabase/migrations/`
- **Persona Sources**: See `./plans/database-architect.md` -- FR-DB-020

**Description**: All indexes justified by documented query patterns.

**Acceptance Criteria**:
- [ ] `form_submissions`: indexes on `form_type`, `status`, `email`, `segment`, `created_at DESC`, CRM pending (partial), rate limit composite (`ip_hash, form_type, created_at DESC`)
- [ ] `newsletter_subscribers`: active subscriber partial index, confirmation token partial index
- [ ] `analytics_events`: indexes on `event_name`, `created_at DESC`, `page_path`, `session_id` (partial)
- [ ] `rate_limits`: composite lookup index (`ip_hash, action_type, created_at DESC`), cleanup index
- [ ] No table has more than 7 indexes

---

### REQ-028: Row Level Security

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-026
- **Target Files**: `supabase/migrations/`
- **Persona Sources**: See `./plans/database-architect.md` -- FR-DB-021

**Description**: RLS enabled on every table. `anon` role has zero access. Only `service_role` can access data.

**Acceptance Criteria**:
- [ ] RLS enabled on all 6 tables
- [ ] `service_role_all` policy on each table: `FOR ALL USING (auth.role() = 'service_role')`
- [ ] Querying with `anon` key returns zero rows
- [ ] No policy for `authenticated`, `anon`, or any other role

---

### REQ-029: Environment Management

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-009
- **Target Files**: `infra/k8s/overlays/production/`, `infra/k8s/overlays/staging/`
- **Persona Sources**: See `./plans/devops-platform-engineer.md` -- FR-INFRA-008

**Description**: Environment-specific configuration via K8s overlays (Kustomize). Same Docker image across all environments.

**Acceptance Criteria**:
- [ ] Production, staging, and preview use the same Docker image
- [ ] Environment-specific config injected via ConfigMaps and Secrets
- [ ] Staging accessible at `staging.safetrekr.com`

---

### REQ-030: Dependabot and Supply Chain Security

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-001
- **Target Files**: `.github/dependabot.yml`
- **Persona Sources**: See `./plans/world-class-appsec-security-architect.md` -- FR-SEC-033, FR-SEC-034, FR-SEC-035

**Description**: Automated dependency updates, lockfile integrity, and supply chain attack detection.

**Acceptance Criteria**:
- [ ] `pnpm install --frozen-lockfile` in CI (lockfile integrity)
- [ ] Dependabot configured for weekly patch/minor updates
- [ ] Critical security updates merged within 24 hours
- [ ] Socket.dev or equivalent supply chain scanner integrated

---

# EPIC 2: Core Pages & Components (Week 3-4)

Goal: The homepage, navigation, footer, all shared components, form system, and core conversion pages are live and functional.

---

### REQ-031: Button Component

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-015
- **Target Files**: `src/components/ui/button.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-016; `./plans/world-class-ui-designer.md` -- FR-CL-001

**Description**: Extended shadcn/ui Button with SafeTrekr variants, loading state, and icon slots.

**Acceptance Criteria**:
- [ ] Variants via CVA: `primary` (bg-primary-600), `secondary`, `ghost`, `link`, `primary-on-dark`, `destructive`
- [ ] Sizes: `sm` (h-9), `default` (h-11, 44px touch target), `lg` (h-13), `icon` (h-10 w-10)
- [ ] `loading` prop: spinner, `aria-busy="true"`, pointer events disabled
- [ ] `leftIcon` / `rightIcon` / `icon` props
- [ ] `asChild` prop (Radix Slot) for polymorphic rendering
- [ ] Focus-visible ring: `ring-2 ring-ring ring-offset-2`
- [ ] Minimum touch target: 44x44px on all sizes
- [ ] `disabled` state: reduced opacity, `cursor-not-allowed`, `aria-disabled="true"`

---

### REQ-032: Badge, Eyebrow, StatusDot, Divider, Logo Components

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-015
- **Target Files**: `src/components/ui/badge.tsx`, `src/components/ui/eyebrow.tsx`, `src/components/ui/status-dot.tsx`, `src/components/ui/divider.tsx`, `src/components/ui/logo.tsx`
- **Persona Sources**: See `./plans/world-class-ui-designer.md` -- FR-CL-002, FR-CL-003, FR-CL-004, FR-CL-005, FR-CL-006

**Description**: Atomic UI components: Badge (7 variants), Eyebrow, StatusDot (4 states with a11y), Divider (3 variants), Logo (4 context variants as inline SVG).

**Acceptance Criteria**:
- [ ] Badge variants: `default`, `secondary`, `outline`, `status-green`, `status-yellow`, `status-red`, `dark`
- [ ] StatusDot requires `aria-label` (color alone does not convey meaning)
- [ ] Logo rendered as inline SVG for zero network requests
- [ ] All components pass axe-core scan

---

### REQ-033: SectionContainer and Container Components

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-012, REQ-016
- **Target Files**: `src/components/layout/section-container.tsx`, `src/components/layout/container.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-017, FR-018

**Description**: Layout primitives for consistent section padding, max-width, backgrounds, and semantic HTML.

**Acceptance Criteria**:
- [ ] SectionContainer: `variant` (`default`, `brand-wash`, `dark-authority`, `card-surface`), `padding`, `maxWidth`, `as`
- [ ] `dark-authority` variant sets `data-theme="dark"`
- [ ] Container: `max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8`
- [ ] Both are Server Components

---

### REQ-034: SiteHeader / Navigation

- **Priority**: P0
- **Complexity**: High
- **Dependencies**: REQ-015, REQ-031, REQ-032
- **Target Files**: `src/components/layout/site-header.tsx`, `src/components/layout/mobile-nav.tsx`, `src/components/layout/nav-link.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-019; `./plans/world-class-ui-designer.md` -- FR-CL-014, FR-CL-016

**Description**: Dual-layer sticky navigation with scroll-aware behavior, mega-menu for Solutions, mobile Sheet overlay, and full accessibility.

**Acceptance Criteria**:
- [ ] Sticky header: transparent at top, solid `bg-card/95 backdrop-blur-sm` after 100px scroll, 200-300ms transition
- [ ] Primary nav: max 5 items (Solutions, How It Works, Features, Pricing, About)
- [ ] Utility nav: "Sign In" ghost, "Get a Demo" primary CTA (appears after scroll)
- [ ] Solutions mega-menu with segment cards (K-12, Churches, Higher Ed, Corporate)
- [ ] Mobile (< 1024px): hamburger -> Sheet overlay from right
- [ ] Mobile: 44x44px touch targets, accordion for sub-menus
- [ ] `aria-current="page"` on active link
- [ ] Skip nav link is first focusable element
- [ ] `aria-expanded`, `aria-controls` on mobile hamburger and mega-menu triggers
- [ ] Keyboard navigation: Tab, Enter/Space, Escape
- [ ] No layout shift on scroll state change
- [ ] Logo: horizontal on desktop, mark on small mobile; links to homepage

---

### REQ-035: SiteFooter

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-015, REQ-031, REQ-032
- **Target Files**: `src/components/layout/site-footer.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-020; `./plans/world-class-ui-designer.md` -- FR-CL-017

**Description**: Dark footer with navigation columns, newsletter signup, legal links, and trust metrics.

**Acceptance Criteria**:
- [ ] 4-column layout on desktop (Solutions, Platform, Resources, Company), responsive stacking
- [ ] Newsletter email signup form (inline, connects to REQ-076)
- [ ] Legal links: Privacy Policy, Terms of Service
- [ ] Copyright with current year
- [ ] Trust metrics strip (compact)
- [ ] `<footer>` with `role="contentinfo"`
- [ ] Server Component (newsletter form is client island)
- [ ] Dark background using `secondary` tokens

---

### REQ-036: FeatureCard Component

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-015
- **Target Files**: `src/components/marketing/feature-card.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-021; `./plans/world-class-ui-designer.md` -- FR-CL-007

**Description**: Card displaying a feature with icon, title, description, optional badge and link. Hover elevates shadow.

**Acceptance Criteria**:
- [ ] Props: `icon`, `title`, `description`, `href?`, `badge?`, `motifType?`, `featured?`
- [ ] `shadow-card` -> `shadow-card-hover` on hover with `translateY(-2px)`
- [ ] `featured`: spans 2 cols, larger icon and heading
- [ ] Link wraps entire card (`group` pattern), title as `h3`
- [ ] Server Component

---

### REQ-037: TrustMetric and TrustStrip Components

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-015
- **Target Files**: `src/components/marketing/trust-metric.tsx`, `src/components/sections/trust-strip.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-022, FR-023; `./plans/world-class-ui-designer.md` -- FR-CL-008, FR-CL-018

**Description**: Verifiable trust metrics strip replacing all fabricated testimonials. Displays: "5 Government Intel Sources | 17 Safety Review Sections | 3-5 Day Turnaround | AES-256 Encryption | SHA-256 Evidence Chain."

**Acceptance Criteria**:
- [ ] TrustMetric: value (display font), label (body font), optional icon, light/dark variants
- [ ] TrustStrip: horizontal row on desktop, horizontal scroll with snap on mobile
- [ ] Values animate (count up) on scroll into view; strings fade in
- [ ] NO fabricated testimonials, quotes, or unverifiable claims
- [ ] Responsive grid: 2 cols (<md), 3 cols (md-lg), 5 cols (>=lg)
- [ ] Server Component (zero client JS for static version)

---

### REQ-038: PricingTierCard Component

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-015, REQ-031
- **Target Files**: `src/components/marketing/pricing-tier-card.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-024; `./plans/world-class-ui-designer.md` -- FR-CL-009

**Description**: Pricing card with per-student framing, feature list, CTA. Featured card has "Most Popular" badge.

**Acceptance Criteria**:
- [ ] Per-student price displayed prominently ("$15/student"), NOT per-trip as primary
- [ ] Per-trip shown as secondary information
- [ ] Feature list with check icons
- [ ] `highlighted`: "Most Popular" badge, `ring-2 ring-primary`, elevated shadow, static `scale(1.05)` on desktop
- [ ] No animation on pricing cards (stability communicates trust)
- [ ] Pricing `aria-label` provides full price context
- [ ] Server Component

---

### REQ-039: Form Architecture (Server Actions + RHF + Zod + 8-Layer Security)

- **Priority**: P0
- **Complexity**: High
- **Dependencies**: REQ-001, REQ-025
- **Target Files**: `src/lib/schemas/*.ts`, `src/actions/*.ts`, `src/lib/turnstile.ts`, `src/lib/email.ts`, `src/lib/supabase.ts`, `src/lib/rate-limit.ts`, `src/lib/sanitize.ts`, `src/lib/ip-hash.ts`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-056; `./plans/world-class-appsec-security-architect.md` -- FR-SEC-016 through FR-SEC-024

**Description**: Complete form infrastructure: Zod schemas (shared client/server), Server Actions with 8-layer security model, SendGrid email, Supabase persistence, Turnstile verification.

**Acceptance Criteria**:
- [ ] Zod schemas for: `demo-request`, `contact`, `newsletter`, `quote-request`, `sample-binder`
- [ ] Each schema includes: email validation, field length limits, honeypot field (`z.string().max(0)`), turnstile token
- [ ] Server Actions implement 8-layer security in order:
  1. Client-side Zod validation (RHF resolver)
  2. Cloudflare Turnstile challenge (invisible, client)
  3. Server-side Turnstile verification
  4. Server-side Zod validation (never trust client)
  5. Rate limiting per IP per form type
  6. Honeypot detection (silent rejection with fake success)
  7. Input sanitization (strip HTML, normalize Unicode, hard length limit)
  8. IP hashing (SHA-256 with salt, raw IP NEVER stored)
- [ ] `src/lib/email.ts`: SendGrid integration (confirmation + notification)
- [ ] `src/lib/supabase.ts`: Supabase client for `form_submissions` with UTM/referrer capture
- [ ] Return type: `{ success: boolean; errors?: Record<string, string>; message?: string }`
- [ ] Forms work without JavaScript (progressive enhancement)

---

### REQ-040: Cloudflare Turnstile Integration

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-001
- **Target Files**: `src/components/forms/turnstile-widget.tsx`, `src/lib/turnstile.ts`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-059; `./plans/world-class-appsec-security-architect.md` -- FR-SEC-029, FR-SEC-030, FR-SEC-031, FR-SEC-032

**Description**: Client-side Turnstile widget (lazy-loaded, invisible mode) and server-side token verification. Includes K-12 firewall fallback.

**Acceptance Criteria**:
- [ ] Widget lazy-loaded via IntersectionObserver when form enters viewport
- [ ] Invisible mode by default
- [ ] Token passed to Server Action via form data
- [ ] Server verification: `verifyTurnstile(token, ip)` calls Cloudflare `/siteverify`
- [ ] K-12 firewall fallback: if script fails to load in 10s, show fallback with honeypot + time-based challenge + stricter rate limiting + manual review queue
- [ ] Turnstile failures logged; alert on > 20% failure rate
- [ ] Environment variables: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`

---

### REQ-041: Demo Request Form

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-039, REQ-040
- **Target Files**: `src/components/forms/demo-request-form.tsx`, `src/lib/schemas/demo-request.ts`, `src/actions/demo-request.ts`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-057; `./plans/world-class-ui-designer.md` -- FR-CL-025

**Description**: Primary conversion form with progressive profiling. "See Your Safety Binder" framing.

**Acceptance Criteria**:
- [ ] Required: email, first name, last name, organization name
- [ ] Optional: role, segment, trips per year, group size, preferred demo format, message
- [ ] Segment pre-selected from `?segment=` query param
- [ ] Honeypot field: hidden via CSS, `aria-hidden="true"`, `tabindex="-1"`
- [ ] React 19 `useActionState` + `useFormStatus`
- [ ] Double-click prevention
- [ ] Success: green confirmation, form hidden
- [ ] Error: field-level messages with `aria-describedby`
- [ ] Plausible event: `demo_request` on success

---

### REQ-042: Contact Form

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-039, REQ-040
- **Target Files**: `src/components/forms/contact-form.tsx`, `src/lib/schemas/contact.ts`, `src/actions/contact.ts`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-058

**Description**: Secondary conversion form for general inquiries.

**Acceptance Criteria**:
- [ ] Required: email, first name, last name, subject, message (min 10 chars)
- [ ] Optional: organization, segment
- [ ] Same 8-layer security as REQ-039
- [ ] Success with response time commitment

---

### REQ-043: LeadCaptureModal

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-015, REQ-039
- **Target Files**: `src/components/forms/lead-capture-modal.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-034

**Description**: Modal dialog for gated content downloads (sample binders). Minimal info collection.

**Acceptance Criteria**:
- [ ] Radix Dialog
- [ ] Fields: email (required), first name (optional), organization type (optional)
- [ ] Pre-selectable segment via prop
- [ ] Turnstile (invisible), Server Action submission
- [ ] Success: download link for PDF
- [ ] Focus trapped, Escape closes, `aria-labelledby` on title

---

### REQ-044: Root Layout

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-014, REQ-034, REQ-035
- **Target Files**: `src/app/layout.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-037

**Description**: Root layout with fonts, metadata defaults, Organization JSON-LD, analytics, skip nav, header, footer.

**Acceptance Criteria**:
- [ ] `<html lang="en">` with font CSS variable classes
- [ ] Skip nav link as first child of `<body>`
- [ ] SiteHeader above `{children}`, SiteFooter below
- [ ] `<main id="main-content">` wrapping `{children}`
- [ ] Organization JSON-LD in `<head>`
- [ ] Plausible analytics `<Script>` with CSP nonce and `strategy="afterInteractive"`
- [ ] Preconnect hints for `plausible.io`
- [ ] Default metadata: title template `"%s | SafeTrekr"`, default description, OG image
- [ ] CSP nonce propagation from middleware via `headers()`

---

### REQ-045: Homepage (`/`)

- **Priority**: P0
- **Complexity**: High
- **Dependencies**: REQ-044, REQ-046, REQ-037, REQ-036, REQ-033, REQ-038, REQ-047
- **Target Files**: `src/app/page.tsx`, `src/content/pages/homepage.ts`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-038

**Description**: 11-section landing page: Hero > Problem/Mechanism > How It Works Preview > Trust Strip > Feature Grid > Binder Showcase > Segment Routing > Pricing Preview > Category Contrast > Final CTA > Footer.

**Acceptance Criteria**:
- [ ] SSG (statically generated at build time)
- [ ] `generateMetadata` with unique title, description, canonical
- [ ] JSON-LD: `SoftwareApplication` + `AggregateOffer`
- [ ] Hero with mechanism-naming headline (not generic)
- [ ] TrustStrip with 5 verifiable metrics
- [ ] FeatureGrid with 6-9 core capabilities
- [ ] Segment routing cards (K-12, Churches, Higher Ed, Corporate)
- [ ] Pricing preview with per-student anchor
- [ ] Total page weight < 500KB, LCP < 1.5s, CLS < 0.05, Lighthouse >= 95
- [ ] AI Summary Block within first 150 words (40-60 words, 3+ data points, 2+ named entities)

---

### REQ-046: HeroHome Component

- **Priority**: P0
- **Complexity**: High
- **Dependencies**: REQ-031, REQ-033, REQ-048
- **Target Files**: `src/components/sections/hero-home.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-030; `./plans/world-class-ui-designer.md` -- FR-HC-001 through FR-HC-005, FR-MO-005

**Description**: Homepage hero with mechanism-naming headline, dual CTAs, 4-layer product composition (map + review panel + document preview + readiness gauge), and orchestrated 1800ms entrance animation.

**Acceptance Criteria**:
- [ ] Desktop: 5-col text / 7-col visual (`lg:grid-cols-12`)
- [ ] Mobile: stacked, simplified visual (map + route only)
- [ ] Headline visible immediately (no animation delay on text)
- [ ] Primary CTA: "See Sample Binder" / Secondary: "Schedule a Demo"
- [ ] 4-layer product composition: map (z-0), review panel (z-10), document preview (z-20), readiness gauge (z-15)
- [ ] Animation: headline 0ms, subtext 150ms, CTAs 300ms, map 400-500ms, route 700ms, panels staggered 800-1200ms, status dot 1400ms
- [ ] All animation skipped when `prefers-reduced-motion: reduce`
- [ ] LCP < 1.5s, CLS < 0.05
- [ ] Server Component shell with client boundary for animations and map

---

### REQ-047: SegmentCard Component

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-015
- **Target Files**: `src/components/marketing/segment-card.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-028; `./plans/world-class-ui-designer.md` -- FR-CL-010

**Description**: Card routing visitors to segment-specific solutions pages.

**Acceptance Criteria**:
- [ ] Renders as `<a>` via `next/link` wrapping a card
- [ ] Hover: shadow increase, arrow animates right
- [ ] `highlighted` variant for beachhead (churches) with primary border
- [ ] Server Component

---

### REQ-048: MapLibre Hero Map (Progressive Enhancement)

- **Priority**: P1
- **Complexity**: High
- **Dependencies**: REQ-018
- **Target Files**: `src/components/maps/hero-map.tsx`, `src/components/maps/interactive-map.tsx`, `src/components/maps/map-style.json`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-054, FR-055

**Description**: Three-stage progressive map: static fallback -> lazy MapLibre -> animated crossfade.

**Acceptance Criteria**:
- [ ] Stage 1: Pre-rendered map image via `next/image` with `priority`, explicit dimensions
- [ ] Stage 2: `next/dynamic` with `ssr: false` loads MapLibre when hero enters viewport
- [ ] Stage 3: Interactive map crossfades over static
- [ ] Custom style: desaturated base, `primary-500` route, safety-color status dots
- [ ] Tile source: MapTiler free tier
- [ ] Map budget: < 230KB gzipped (deferred)
- [ ] `aria-label="Interactive map showing trip route"`, `role="img"`
- [ ] Slow connection (`saveData` / `2g`): skip MapLibre, keep static
- [ ] Non-interactive on mobile (static + SVG route overlay)

---

### REQ-049: ProcessTimeline Component

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-015
- **Target Files**: `src/components/marketing/process-timeline.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-027; `./plans/world-class-ui-designer.md` -- FR-CL-023

**Description**: Timeline showing three-act mechanism: Intelligence > Review > Documentation.

**Acceptance Criteria**:
- [ ] Desktop: horizontal 3-col grid with connecting lines
- [ ] Mobile: vertical stacked TimelineStep components
- [ ] Each step: number badge, icon, title, description
- [ ] Connecting line draws on scroll; steps fade up with stagger
- [ ] Fallback: all visible without animation on reduced motion

---

### REQ-050: FAQSection Component

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-015
- **Target Files**: `src/components/sections/faq-section.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-025; `./plans/world-class-ui-designer.md` -- FR-CL-024

**Description**: Accordion FAQ with FAQPage JSON-LD generation.

**Acceptance Criteria**:
- [ ] Radix Accordion (`type="single" collapsible`)
- [ ] `aria-expanded` on triggers, chevron rotates 180deg
- [ ] Generates `FAQPage` JSON-LD `<script type="application/ld+json">`
- [ ] Server Component shell, Accordion is client component

---

### REQ-051: CTABand Component

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-033, REQ-031
- **Target Files**: `src/components/sections/cta-band.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-026; `./plans/world-class-ui-designer.md` -- FR-CL-019

**Description**: Full-width CTA section with 3 variants: `light`, `brand`, `dark`.

**Acceptance Criteria**:
- [ ] Props: `variant`, `headline`, `body?`, `primaryCta`, `secondaryCta?`
- [ ] Correct button variants per surface (primary-on-dark on dark backgrounds)
- [ ] Centered text, max-width for readability
- [ ] Server Component

---

### REQ-052: FeatureGrid Component

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-036
- **Target Files**: `src/components/sections/feature-grid.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-029; `./plans/world-class-ui-designer.md` -- FR-CL-022

**Description**: Responsive grid of FeatureCards with optional bento layout.

**Acceptance Criteria**:
- [ ] Grid: 1-col mobile, 2-col tablet, 3-col desktop
- [ ] Section heading with optional eyebrow
- [ ] Stagger reveal on scroll
- [ ] Optional bento layout (2 featured cards span 2 cols)

---

### REQ-053: FeatureShowcase Component

- **Priority**: P1
- **Complexity**: Medium
- **Dependencies**: REQ-033, REQ-036
- **Target Files**: `src/components/sections/feature-showcase.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-032; `./plans/world-class-ui-designer.md` -- FR-CL-021

**Description**: Alternating layout: text + visual side-by-side, reversible for visual rhythm.

**Acceptance Criteria**:
- [ ] Desktop: 2-col grid, alternates text-left/visual-right with `reversed` prop
- [ ] Mobile: stacked, visual above text
- [ ] Eyebrow + headline + body + feature list + CTA + visual children
- [ ] Server Component

---

### REQ-054: DocumentPreview Component

- **Priority**: P1
- **Complexity**: Medium
- **Dependencies**: REQ-015
- **Target Files**: `src/components/marketing/document-preview.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-033; `./plans/world-class-ui-designer.md` -- FR-CL-012

**Description**: Simulated stacked-paper document preview showing safety binder cover.

**Acceptance Criteria**:
- [ ] 3-layer paper stack effect
- [ ] Shows "Evidence Binder" header, timeline entries, SHA-256 hash in `mono-sm`
- [ ] "Preview Sample" overlay with CTA
- [ ] Animation: `cardReveal` on scroll

---

### REQ-055: IntelSourceBar Component

- **Priority**: P1
- **Complexity**: Low
- **Dependencies**: REQ-015
- **Target Files**: `src/components/marketing/intel-source-bar.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-035

**Description**: Horizontal bar showing 5 government intelligence source logos (NOAA, USGS, CDC, GDACS, ReliefWeb).

**Acceptance Criteria**:
- [ ] "Powered by data from" eyebrow
- [ ] Logos as SVGs or optimized images
- [ ] Server Component

---

### REQ-056: MotifBadge Component

- **Priority**: P1
- **Complexity**: Low
- **Dependencies**: REQ-015
- **Target Files**: `src/components/marketing/motif-badge.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-036; `./plans/world-class-ui-designer.md` -- FR-CL-011

**Description**: Badge encoding one of four SafeTrekr motifs: Route, Review, Record, Readiness.

**Acceptance Criteria**:
- [ ] Each motif: distinct icon + color accent + label
- [ ] Pill-shaped, `rounded-full`, icon in tinted circle
- [ ] Server Component

---

### REQ-057: Hero Animation Orchestrator

- **Priority**: P1
- **Complexity**: Medium
- **Dependencies**: REQ-018, REQ-019
- **Target Files**: `src/components/motion/hero-animation.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-053

**Description**: Orchestrated multi-stage hero animation sequence (~1800ms total).

**Acceptance Criteria**:
- [ ] Sequence per REQ-046 timing
- [ ] Content always in DOM and visible to screen readers
- [ ] `aria-hidden` on decorative elements
- [ ] All content renders immediately on reduced motion

---

### REQ-058: Demo Request Page (`/demo`)

- **Priority**: P0
- **Complexity**: High
- **Dependencies**: REQ-041, REQ-044
- **Target Files**: `src/app/demo/page.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-043

**Description**: Primary conversion page framed as "See Your Safety Binder."

**Acceptance Criteria**:
- [ ] SSG shell, Client Component form
- [ ] "See Your Safety Binder" headline, trust strip, what to expect
- [ ] Pre-selected segment from `?segment=` query param
- [ ] `noindex` meta tag
- [ ] Social proof sidebar

---

### REQ-059: Contact Page (`/contact`)

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-042, REQ-044
- **Target Files**: `src/app/contact/page.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-044

**Description**: Secondary conversion with contact form, phone, email, response time commitment.

**Acceptance Criteria**:
- [ ] BreadcrumbList JSON-LD
- [ ] Response time: "General: 1 business day. Procurement: 4 hours."
- [ ] Direct contact info
- [ ] Server Action to Supabase + SendGrid

---

### REQ-060: Legal Pages (`/legal/privacy`, `/legal/terms`)

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-033, REQ-044
- **Target Files**: `src/app/legal/privacy/page.tsx`, `src/app/legal/terms/page.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-049

**Description**: Privacy policy and terms of service with proper metadata.

**Acceptance Criteria**:
- [ ] SSG, unique metadata, BreadcrumbList JSON-LD
- [ ] Table of contents with anchor links
- [ ] "Last updated" date
- [ ] Clean long-form typography

---

### REQ-061: PricingGrid Section Component

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-038, REQ-033
- **Target Files**: `src/components/sections/pricing-grid.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-031

**Description**: Pricing section with liability anchor, 3 tier cards, volume discounts, FAQ.

**Acceptance Criteria**:
- [ ] Headline: "$15/participant" prominently displayed
- [ ] Value anchor: settlement cost comparison
- [ ] 3 PricingTierCard: T1 $450, T2 $750, T3 $1,250
- [ ] Volume discount table: 5-9 (5%), 10-24 (10%), 25-49 (15%), 50+ (20%)
- [ ] "Calculate Your ROI" secondary CTA
- [ ] JSON-LD `Product` + `Offer` per tier

---

### REQ-062: Metadata Utility

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-001
- **Target Files**: `src/lib/metadata.ts`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-062; `./plans/world-class-digital-marketing-lead.md` -- FR-SEO-003

**Description**: Centralized metadata generation for consistent SEO. Canonical domain: `www.safetrekr.com`.

**Acceptance Criteria**:
- [ ] `generatePageMetadata(config)` returns complete `Metadata` object
- [ ] Self-referencing canonical on every page
- [ ] OG + Twitter Card meta
- [ ] `noIndex` option for conversion pages
- [ ] No trailing slashes, no query params in canonicals

---

# EPIC 3: Segment Pages & Content (Week 5-6)

Goal: All segment-specific solution pages, pricing, how it works, about, and solutions overview are live with segment-specific copy, FAQs, and JSON-LD.

---

### REQ-063: Church/Missions Solutions Page (`/solutions/churches`)

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-044, REQ-050, REQ-051, REQ-043
- **Target Files**: `src/app/solutions/churches/page.tsx`, `src/content/pages/solutions-churches.ts`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-039

**Description**: Beachhead segment landing page with church-specific vocabulary, mission trip focus, denominational context.

**Acceptance Criteria**:
- [ ] SSG, segment-specific metadata and FAQPage JSON-LD (8-12 Q&As)
- [ ] BreadcrumbList JSON-LD: Home > Solutions > Churches & Missions
- [ ] Church vocabulary: duty of care, volunteer screening, stewardship, youth protection
- [ ] Pricing: $450 domestic, $1,250 international = "less than 1% of trip budget"
- [ ] Insurance framing section
- [ ] CTA: "See a Mission Trip Safety Binder" -> LeadCaptureModal with "Mission Trip" pre-selected
- [ ] AI Summary Block within first 150 words

---

### REQ-064: K-12 Schools Solutions Page (`/solutions/k12`)

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-044, REQ-050, REQ-051
- **Target Files**: `src/app/solutions/k12/page.tsx`, `src/content/pages/solutions-k12.ts`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-040

**Description**: Largest TAM segment with per-student pricing, honest FERPA messaging.

**Acceptance Criteria**:
- [ ] SSG, segment-specific metadata, FAQPage JSON-LD with FERPA question
- [ ] Per-student pricing ($15/student) as primary framing
- [ ] Honest FERPA: "Designed with FERPA requirements in mind" -- NOT "FERPA certified"
- [ ] Liability comparison: "$500K-$2M average settlement" vs. "$15/student"
- [ ] CTA with `?segment=k12`
- [ ] AI Summary Block

---

### REQ-065: Higher Education Solutions Page (`/solutions/higher-education`)

- **Priority**: P1
- **Complexity**: Medium
- **Dependencies**: REQ-044, REQ-050
- **Target Files**: `src/app/solutions/higher-education/page.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-046

**Description**: Study abroad, Clery Act, Title IX focus.

**Acceptance Criteria**:
- [ ] SSG, segment metadata, FAQPage JSON-LD
- [ ] "Complement, not replace" positioning against existing study abroad platforms
- [ ] CTA with segment pre-selection

---

### REQ-066: Corporate Solutions Page (`/solutions/corporate`)

- **Priority**: P1
- **Complexity**: Medium
- **Dependencies**: REQ-044, REQ-050
- **Target Files**: `src/app/solutions/corporate/page.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-047

**Description**: Duty of care documentation for business travel.

**Acceptance Criteria**:
- [ ] SSG, segment metadata, FAQPage JSON-LD
- [ ] "Enterprise safety at per-trip pricing"
- [ ] CTA with segment pre-selection

---

### REQ-067: Solutions Overview Page (`/solutions`)

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-047, REQ-044
- **Target Files**: `src/app/solutions/page.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-045

**Description**: Landing page routing to segment-specific pages.

**Acceptance Criteria**:
- [ ] SSG, segment cards for all segments
- [ ] Churches card highlighted as beachhead
- [ ] BreadcrumbList JSON-LD

---

### REQ-068: Pricing Page (`/pricing`)

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-061, REQ-050, REQ-044
- **Target Files**: `src/app/pricing/page.tsx`, `src/content/pages/pricing.ts`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-041

**Description**: Full pricing page with per-student framing, tiers, volume discounts, FAQ, procurement path.

**Acceptance Criteria**:
- [ ] SSG, pricing metadata, FAQPage JSON-LD, Product + Offer JSON-LD per tier
- [ ] Verified pricing from single source of truth: T1 $450, T2 $750, T3 $1,250
- [ ] FAQ with 8-10 pricing Q&As
- [ ] Dual CTA: "Request a Demo" + "For Procurement"
- [ ] "Calculate Your ROI" link (placeholder acceptable for Epic 6)

---

### REQ-069: How It Works Page (`/how-it-works`)

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-049, REQ-055, REQ-044
- **Target Files**: `src/app/how-it-works/page.tsx`, `src/content/pages/how-it-works.ts`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-042

**Description**: Deep explanation of three-act mechanism with 17-section breakdown.

**Acceptance Criteria**:
- [ ] SSG, HowTo JSON-LD (3 steps, `totalTime: "P5D"`), BreadcrumbList
- [ ] ProcessTimeline: Intelligence > Review > Documentation
- [ ] 17-section card grid by category
- [ ] IntelSourceBar (5 government sources)
- [ ] Monte Carlo explanation in non-technical language
- [ ] CTA: "See a Sample Safety Binder"

---

### REQ-070: About Page (`/about`)

- **Priority**: P1
- **Complexity**: Low
- **Dependencies**: REQ-044
- **Target Files**: `src/app/about/page.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-048

**Description**: Founding story, mission, category creation narrative.

**Acceptance Criteria**:
- [ ] SSG, unique metadata, BreadcrumbList JSON-LD
- [ ] Mission statement, founding story
- [ ] "Why this category needs to exist" narrative
- [ ] Team section (placeholder until team grows)

---

### REQ-071: Pricing Data Single Source of Truth

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-001
- **Target Files**: `src/config/pricing.ts`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-SCHEMA-004, FR-SCHEMA-008

**Description**: Single config file for all pricing data used across the site.

**Acceptance Criteria**:
- [ ] T1: $450 (Day Trip), T2: $750 (Multi-Day), T3: $1,250 (International)
- [ ] Per-student calculations
- [ ] Volume discount tiers
- [ ] All pricing components and schemas import from this file
- [ ] No hardcoded prices in any component

---

### REQ-072: Structured Comparison Tables

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-063, REQ-064
- **Target Files**: Inline in segment pages
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-AIO-004

**Description**: Semantic HTML tables comparing SafeTrekr to status quo alternatives on every segment page.

**Acceptance Criteria**:
- [ ] `<table>`, `<caption>`, `<thead>`, `<th>`, `<tbody>`, `<td>` (semantic HTML)
- [ ] Compare: SafeTrekr vs. Spreadsheet Checklists vs. Logistics Apps vs. Enterprise Risk Platforms
- [ ] No fabricated competitor names -- category labels only
- [ ] Categories: analyst review, intelligence, documentation, price, segment fit

---

# EPIC 4: SEO, Analytics & Marketing (Week 7-8)

Goal: Full SEO infrastructure, structured data on every page, AI search optimization, blog system, analytics, and email capture are live.

---

### REQ-073: Programmatic Sitemap

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-001
- **Target Files**: `src/app/sitemap.ts`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-SEO-001

**Acceptance Criteria**:
- [ ] `/sitemap.xml` returns valid XML with all published URLs
- [ ] Priority hierarchy: homepage 1.0, solutions/pricing 0.9, blog 0.7, company 0.5-0.6
- [ ] Blog posts dynamically included with `lastModified`
- [ ] No drafts in sitemap
- [ ] Regenerates on every Docker build

---

### REQ-074: Robots.txt with AI Crawler Allowances

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-001
- **Target Files**: `src/app/robots.ts`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-SEO-002

**Acceptance Criteria**:
- [ ] Default: allow `/`, disallow `/admin/`, `/api/`, `/lp/`, `/_next/`, `/private/`
- [ ] Explicit `Allow: /` for: GPTBot, Google-Extended, PerplexityBot, ClaudeBot, Amazonbot, ChatGPT-User, Applebot-Extended, cohere-ai
- [ ] Sitemap URL referenced

---

### REQ-075: Redirect Management

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-003
- **Target Files**: `src/config/redirects.ts`, `next.config.ts`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-SEO-006

**Acceptance Criteria**:
- [ ] Version-controlled redirect map in `/config/redirects.ts`
- [ ] All redirects 301 unless explicitly 302
- [ ] No chains > 2 hops (CI validation)
- [ ] Legacy paths mapped: `/features` -> `/platform`, `/solutions/schools` -> `/solutions/k12`

---

### REQ-076: Newsletter Signup with Double Opt-In

- **Priority**: P1
- **Complexity**: Medium
- **Dependencies**: REQ-039
- **Target Files**: `src/components/forms/newsletter-form.tsx`, `src/lib/schemas/newsletter.ts`, `src/actions/newsletter.ts`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-060

**Acceptance Criteria**:
- [ ] Single field: email
- [ ] Inline layout: input + button on one row
- [ ] Server Action: Supabase `newsletter_subscribers` with `confirmed = false`, generates `confirmation_token`
- [ ] SendGrid double opt-in confirmation email
- [ ] Confirmation API route sets `confirmed = true`
- [ ] Duplicate handling: friendly message
- [ ] Turnstile protection

---

### REQ-077: JSON-LD Injection Component

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-001
- **Target Files**: `src/components/seo/json-ld.tsx`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-SCHEMA-001

**Acceptance Criteria**:
- [ ] `<JsonLd>` accepts single or array of schema objects
- [ ] Renders as `<script type="application/ld+json">`
- [ ] Minified JSON in production
- [ ] Server-rendered
- [ ] All output passes Google Rich Results Test

---

### REQ-078: Organization Schema (Global)

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-077
- **Target Files**: `src/app/layout.tsx`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-SCHEMA-002

**Acceptance Criteria**:
- [ ] Root layout includes Organization JSON-LD
- [ ] Schema includes: name, url, logo, description (with unique mechanism), foundingDate, contactPoint, sameAs

---

### REQ-079: BreadcrumbList Schema (All Interior Pages)

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-077
- **Target Files**: `src/lib/seo/schemas/breadcrumbs.ts`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-SCHEMA-003

**Acceptance Criteria**:
- [ ] All interior pages include BreadcrumbList JSON-LD
- [ ] Position numbering starts at 1
- [ ] Matches visible breadcrumb UI
- [ ] Passes Google Rich Results Test

---

### REQ-080: Per-Page Schema Markup

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-077, REQ-071
- **Target Files**: Per-page files
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-SCHEMA-004, FR-SCHEMA-005, FR-SCHEMA-006, FR-SCHEMA-008

**Description**: Page-specific JSON-LD: SoftwareApplication (homepage), FAQPage (solutions/pricing), HowTo (how-it-works), Product+Offer (pricing per tier).

**Acceptance Criteria**:
- [ ] Homepage: SoftwareApplication + AggregateOffer (prices from config)
- [ ] Solutions pages: FAQPage with 8-12 segment-specific Q&As
- [ ] How It Works: HowTo with 3 steps, `totalTime: "P5D"`
- [ ] Pricing: 3 Product + Offer schemas (prices from config)
- [ ] All pass Google Rich Results Test

---

### REQ-081: Schema Validation CI

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-011, REQ-077
- **Target Files**: `scripts/validate-schema.ts`, `.github/workflows/ci.yml`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-SCHEMA-011

**Acceptance Criteria**:
- [ ] `npm run validate:schema` runs against rendered HTML
- [ ] Validates JSON syntax, `@context`, `@type`, required properties
- [ ] Runs in CI on every PR
- [ ] Failures block merge

---

### REQ-082: Per-Route Metadata Generation

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-062
- **Target Files**: All page files
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-SEO-005

**Acceptance Criteria**:
- [ ] Every page exports `generateMetadata`
- [ ] Title under 60 chars, ending with `| SafeTrekr`
- [ ] Description 150-160 chars with keyword and CTA
- [ ] OG + Twitter Card meta
- [ ] No duplicate titles or descriptions across site (CI lint)

---

### REQ-083: AI Summary Blocks

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: Content
- **Target Files**: Page content files
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-AIO-001

**Description**: Every core page includes a 40-60 word declarative paragraph within the first 150 words for AI answer engine extraction.

**Acceptance Criteria**:
- [ ] 40-60 words, 3+ specific data points, 2+ named entities
- [ ] No marketing superlatives
- [ ] Rendered as regular paragraph content
- [ ] Directly answers the search query implied by page URL

---

### REQ-084: llms.txt for LLM Discovery

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: Core pages published
- **Target Files**: `public/llms.txt` or `src/app/llms.txt/route.ts`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-AIO-002

**Acceptance Criteria**:
- [ ] `/llms.txt` accessible, `text/plain` content type
- [ ] Title, description, key pages with URLs, facts section
- [ ] All URLs valid (200 status)
- [ ] Updated when core pages or pricing change

---

### REQ-085: Plausible Analytics

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-044
- **Target Files**: `src/app/layout.tsx`, `src/lib/analytics/plausible.ts`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-ANALYTICS-001, FR-ANALYTICS-002

**Description**: Privacy-first analytics. No cookies, no consent banner.

**Acceptance Criteria**:
- [ ] Script: `script.tagged-events.outbound-links.file-downloads.js` with CSP nonce
- [ ] `data-domain="safetrekr.com"`
- [ ] No cookies set
- [ ] `trackEvent()` utility: typed, SSR-safe, handles ad-blockers
- [ ] Custom goals: `Demo Request`, `Sample Binder Download`, `CTA Click`, `Newsletter Signup`, `Form Start`, `Pricing View`
- [ ] Every CTA calls `trackEvent('CTA Click', {...})`

---

### REQ-086: GA4 Consent-Gated Loading

- **Priority**: P1
- **Complexity**: Medium
- **Dependencies**: REQ-085
- **Target Files**: `src/lib/analytics/ga4.ts`, consent component
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-ANALYTICS-003

**Acceptance Criteria**:
- [ ] GA4 NOT present in initial HTML
- [ ] Loads ONLY after explicit consent via `localStorage`
- [ ] Consent persists across sessions
- [ ] GA4 event taxonomy matches Plausible goals

---

### REQ-087: MDX Blog Infrastructure

- **Priority**: P1
- **Complexity**: High
- **Dependencies**: REQ-044
- **Target Files**: `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `content/blog/`, `src/lib/content.ts`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-CONTENT-001, FR-CONTENT-002

**Description**: Blog system on MDX with ISR (1-hour revalidation), frontmatter validation, reading time, categories, RSS feed.

**Acceptance Criteria**:
- [ ] Blog posts as `.mdx` files in `/content/blog/`
- [ ] Frontmatter enforced via Zod: title, slug, publishedAt, author, category, tags, excerpt, seoTitle, seoDescription, segment, contentType
- [ ] ISR revalidation: 3600 seconds
- [ ] Blog index sorted by publishedAt DESC
- [ ] RSS feed at `/blog/feed.xml`
- [ ] Article JSON-LD per post
- [ ] ISR persistent volume in K8s for cache

---

### REQ-088: Article Schema (Blog Posts)

- **Priority**: P1
- **Complexity**: Low
- **Dependencies**: REQ-077, REQ-087
- **Target Files**: `src/app/blog/[slug]/page.tsx`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-SCHEMA-007

**Acceptance Criteria**:
- [ ] Every blog post includes Article JSON-LD
- [ ] Fields: headline, description, datePublished, dateModified, wordCount, author, publisher
- [ ] Passes Google Rich Results Test

---

### REQ-089: Content Pillar Architecture

- **Priority**: P1
- **Complexity**: Low
- **Dependencies**: REQ-087
- **Target Files**: `src/config/content-clusters.ts`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-CONTENT-003, FR-CONTENT-004

**Description**: Content organized into pillar-cluster hierarchies with enforced internal linking rules.

**Acceptance Criteria**:
- [ ] Cluster map in `config/content-clusters.ts`
- [ ] Internal link audit script (`scripts/internal-link-audit.ts`)
- [ ] Every blog post links to parent pillar within first 2 paragraphs
- [ ] Script runs in CI on content changes

---

### REQ-090: Dynamic OG Image Generation

- **Priority**: P1
- **Complexity**: Medium
- **Dependencies**: REQ-003
- **Target Files**: `src/app/api/og/route.tsx`
- **Persona Sources**: See `./plans/react-developer.md` -- FR-063 (implied); `./plans/world-class-digital-marketing-lead.md` -- FR-SEO-005

**Description**: Dynamic OG images via `next/og` with Node.js runtime (not Edge).

**Acceptance Criteria**:
- [ ] `/api/og?title=...&segment=...` generates 1200x630 image
- [ ] SafeTrekr branding, segment-specific accent color
- [ ] `runtime = 'nodejs'` with `sharp`
- [ ] Cached with appropriate headers

---

### REQ-091: AI Plugin Manifest

- **Priority**: P1
- **Complexity**: Low
- **Dependencies**: Core pages published
- **Target Files**: `public/.well-known/ai-plugin.json`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-AIO-003

**Acceptance Criteria**:
- [ ] `/.well-known/ai-plugin.json` accessible, valid JSON
- [ ] `name_for_model: "safetrekr"`, factual description, `auth.type: "none"`

---

### REQ-092: Content Freshness Signals

- **Priority**: P1
- **Complexity**: Low
- **Dependencies**: REQ-082
- **Target Files**: Page metadata
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-AIO-005

**Acceptance Criteria**:
- [ ] Every page includes `<meta property="article:modified_time">` with ISO 8601 date
- [ ] Schema `dateModified` matches meta tag
- [ ] Pages older than 180 days flagged for review

---

# EPIC 5: Security, Testing & Polish (Week 9-10)

Goal: Security hardening complete, full testing pyramid operational, accessibility audit passed, production readiness confirmed.

---

### REQ-093: Content Security Policy (Nonce-Based)

- **Priority**: P0
- **Complexity**: High
- **Dependencies**: REQ-003, REQ-044
- **Target Files**: `src/middleware.ts`
- **Persona Sources**: See `./plans/world-class-appsec-security-architect.md` -- FR-SEC-009 through FR-SEC-015

**Description**: Nonce-based CSP. `unsafe-inline` and `unsafe-eval` are PROHIBITED.

**Acceptance Criteria**:
- [ ] Per-request nonce generated in middleware via `crypto.randomUUID()`
- [ ] Nonce passed to Server Components via request header `x-nonce`
- [ ] All `<script>` tags include the nonce
- [ ] CSP: `script-src 'self' 'nonce-{N}' challenges.cloudflare.com plausible.io`
- [ ] CSP: `style-src 'self' 'nonce-{N}'`
- [ ] CSP: `frame-ancestors 'none'`, `form-action 'self'`, `object-src 'none'`
- [ ] CSP deployed in report-only for 7 days, then enforced
- [ ] CSP violation reporting endpoint at `/api/csp-report`
- [ ] Framer Motion styles use nonce via `LazyMotion` config

---

### REQ-094: Full HTTP Security Headers

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-093
- **Target Files**: `src/middleware.ts`
- **Persona Sources**: See `./plans/world-class-appsec-security-architect.md` -- FR-SEC-001 through FR-SEC-008

**Description**: All security headers applied in middleware on every response.

**Acceptance Criteria**:
- [ ] HSTS: `max-age=31536000; includeSubDomains; preload`
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=(), browsing-topics=()
- [ ] Cross-Origin-Opener-Policy: same-origin
- [ ] Cross-Origin-Resource-Policy: same-site
- [ ] X-DNS-Prefetch-Control: on
- [ ] CI header validation test on every route
- [ ] Mozilla Observatory grade A or higher

---

### REQ-095: CORS Policy

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-093
- **Target Files**: `src/middleware.ts`, API routes
- **Persona Sources**: See `./plans/world-class-appsec-security-architect.md` -- Section 10

**Acceptance Criteria**:
- [ ] API routes: `Access-Control-Allow-Origin: https://www.safetrekr.com` (no wildcard)
- [ ] Preflight: `Access-Control-Allow-Methods: GET, POST`
- [ ] `Access-Control-Allow-Headers: Content-Type`
- [ ] No CORS headers on non-API routes

---

### REQ-096: Kubernetes Network Policies

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-009
- **Target Files**: `infra/k8s/base/network-policy.yaml`
- **Persona Sources**: See `./plans/world-class-appsec-security-architect.md` -- FR-SEC-043, FR-SEC-044

**Description**: Namespace isolation with least-privilege network access.

**Acceptance Criteria**:
- [ ] Default deny all ingress/egress in marketing namespace
- [ ] Allow ingress from ingress-nginx namespace only
- [ ] Allow egress to: Supabase, SendGrid, Cloudflare, Plausible, MapTiler, DNS
- [ ] Marketing pods cannot communicate with other namespaces
- [ ] Pod Security Standards: `restricted` enforced on namespace

---

### REQ-097: Secret Management

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-009
- **Target Files**: `infra/k8s/base/sealed-secrets/`
- **Persona Sources**: See `./plans/world-class-appsec-security-architect.md` -- FR-SEC-038 through FR-SEC-042

**Description**: Secrets encrypted at rest in Git via Sealed Secrets, decrypted in-cluster only.

**Acceptance Criteria**:
- [ ] All secrets in K8s Secret objects, injected as env vars
- [ ] Secrets NEVER in Docker images
- [ ] Sealed Secrets or External Secrets Operator for Git encryption
- [ ] Secret rotation schedule documented
- [ ] `IP_HASH_SALT` in K8s Secrets

---

### REQ-098: SBOM Generation

- **Priority**: P1
- **Complexity**: Low
- **Dependencies**: REQ-011
- **Target Files**: `.github/workflows/release.yml`
- **Persona Sources**: See `./plans/world-class-appsec-security-architect.md` -- FR-SEC-037

**Acceptance Criteria**:
- [ ] CycloneDX SBOM generated in CI for every release
- [ ] Stored as CI artifact
- [ ] Available for K-12 procurement

---

### REQ-099: GDPR/CCPA Compliance

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-026, REQ-039
- **Target Files**: `src/app/api/data-request/route.ts`, database functions
- **Persona Sources**: See `./plans/world-class-appsec-security-architect.md` -- Section 12; `./plans/database-architect.md` -- retention/purge functions

**Description**: Data subject rights: export, deletion, retention automation.

**Acceptance Criteria**:
- [ ] Data export endpoint for data subject requests
- [ ] Data deletion function (hard delete from all tables)
- [ ] Retention automation: analytics_events purged after 90 days, rate_limits after 24 hours, turnstile_token after 7 days
- [ ] Privacy policy page references all data collection
- [ ] Raw IPs NEVER stored (only SHA-256 hashes)

---

### REQ-100: Vitest Configuration

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-001
- **Target Files**: `vitest.config.ts`, `tests/setup.ts`
- **Persona Sources**: See `./plans/world-class-fuzzing-qa-agent.md` -- FR-QA-001

**Acceptance Criteria**:
- [ ] Environment: `jsdom` for components, `node` for unit/integration
- [ ] Path aliases matching `tsconfig.json`
- [ ] Coverage: v8 provider, thresholds 80% (branches, functions, lines, statements)
- [ ] Setup file: Testing Library matchers, MSW server, Next.js mocks
- [ ] Scripts: `test`, `test:unit`, `test:component`, `test:integration`, `test:coverage`, `test:watch`

---

### REQ-101: Playwright Configuration

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-001
- **Target Files**: `playwright.config.ts`, `tests/e2e/`
- **Persona Sources**: See `./plans/world-class-fuzzing-qa-agent.md` -- FR-QA-002

**Acceptance Criteria**:
- [ ] 6 browser configs: chromium, firefox, webkit, mobile-chrome, mobile-safari, edge
- [ ] `retries: 2` in CI, `retries: 0` locally
- [ ] Trace on first retry, screenshot on failure
- [ ] Tests organized: `critical-path/`, `edge-cases/`, `security/`, `accessibility/`
- [ ] webServer config for local and Docker

---

### REQ-102: axe-core Accessibility Integration

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-101
- **Target Files**: `tests/axe.config.ts`
- **Persona Sources**: See `./plans/world-class-fuzzing-qa-agent.md` -- FR-QA-003

**Acceptance Criteria**:
- [ ] `@axe-core/playwright` as Playwright fixture
- [ ] WCAG 2.2 AA ruleset: `['wcag2a', 'wcag2aa', 'wcag22aa']`
- [ ] Every E2E page test includes axe scan
- [ ] Dedicated accessibility suite scans every sitemap URL
- [ ] Zero violations allowed

---

### REQ-103: Lighthouse CI Configuration

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-011
- **Target Files**: `lighthouserc.js`
- **Persona Sources**: See `./plans/world-class-fuzzing-qa-agent.md` -- FR-QA-004

**Acceptance Criteria**:
- [ ] 9 core pages tested, 3 runs each
- [ ] Thresholds: Performance >= 95, Accessibility >= 95, SEO >= 95, Best Practices >= 95
- [ ] Specific: LCP < 1500, CLS < 0.05, TBT < 200
- [ ] Runs against Docker build (production-realistic)
- [ ] Results stored as CI artifacts

---

### REQ-104: Unit Tests -- Utility Functions

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-100
- **Target Files**: `src/lib/*.test.ts`
- **Persona Sources**: See `./plans/world-class-fuzzing-qa-agent.md` -- FR-QA-005

**Description**: Unit tests for sanitize, analytics, hash, rate-limit, turnstile, format utilities.

**Acceptance Criteria**:
- [ ] `sanitize.ts`: 20+ tests covering OWASP XSS patterns, international chars, null bytes
- [ ] `analytics.ts`: 12+ tests including SSR safety, ad-blocker, UTM extraction
- [ ] `hash.ts`: 6+ tests for SHA-256 determinism, IPv4/IPv6
- [ ] `rate-limit.ts`: 8+ tests for limits, window reset, per-IP isolation
- [ ] `turnstile.ts`: 6+ tests for valid/expired/missing tokens, network failure
- [ ] `format.ts`: 8+ tests for currency, date, reading time

---

### REQ-105: Unit Tests -- Zod Schemas

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-100, REQ-039
- **Target Files**: `src/lib/schemas/*.test.ts`
- **Persona Sources**: See `./plans/world-class-fuzzing-qa-agent.md` -- FR-QA-006

**Acceptance Criteria**:
- [ ] Demo request schema: 25+ tests (all fields, boundaries, enum validation)
- [ ] Contact schema: 12+ tests
- [ ] Newsletter schema: 6+ tests
- [ ] Quote request schema: 15+ tests
- [ ] Schema shape snapshots to detect unintentional changes

---

### REQ-106: Component Tests

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-100
- **Target Files**: `src/components/**/*.test.tsx`
- **Persona Sources**: See `./plans/world-class-fuzzing-qa-agent.md` -- FR-QA-008, FR-QA-009, FR-QA-010

**Description**: Tests for Button, Form components, Navigation, Breadcrumb, Sheet, Dialog.

**Acceptance Criteria**:
- [ ] Button: 12+ tests (variants, sizes, disabled, loading, keyboard, a11y)
- [ ] Form components: all fields labeled, error states with aria, focus management
- [ ] Header: 5 nav items, scroll behavior, skip nav, mobile breakpoint
- [ ] Footer: all links, newsletter form, current year
- [ ] All component tests include axe-core scan

---

### REQ-107: Integration Tests -- Server Actions

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-100, REQ-039
- **Target Files**: `src/actions/*.integration.test.ts`
- **Persona Sources**: See `./plans/world-class-fuzzing-qa-agent.md` -- FR-QA-011, FR-QA-012, FR-QA-013

**Description**: Server Action tests with MSW mocking for Supabase, SendGrid, Turnstile.

**Acceptance Criteria**:
- [ ] Demo request: 15+ tests (valid, invalid Zod, honeypot, Turnstile, rate limit, Supabase write, SendGrid, UTM, IP hash)
- [ ] Contact: 10+ tests
- [ ] Newsletter: 8+ tests (double opt-in flow)
- [ ] SendGrid failure does not prevent Supabase write
- [ ] RLS verified: anon key returns zero rows

---

### REQ-108: E2E Critical Path Tests

- **Priority**: P0
- **Complexity**: High
- **Dependencies**: REQ-101
- **Target Files**: `tests/e2e/critical-path/`
- **Persona Sources**: See `./plans/world-class-fuzzing-qa-agent.md` -- FR-QA-014

**Description**: Full user flows for all critical paths.

**Acceptance Criteria**:
- [ ] Homepage: hero, trust strip, JSON-LD, LCP, axe scan
- [ ] Navigation: all 5 links, aria-current, logo, back/forward
- [ ] Demo form: fill, Turnstile, submit, success, Supabase record, Plausible event
- [ ] Contact form: fill, submit, success
- [ ] Pricing: per-student text, 3 tiers, FAQ, JSON-LD
- [ ] Solutions pages: segment-specific content per page
- [ ] Mobile: 5 viewports, no overflow, hamburger menu, form at 375px
- [ ] SEO: robots.txt, sitemap.xml, unique titles/descriptions, canonical URLs, AI crawlers allowed
- [ ] Newsletter: submit, Supabase record with confirmed=false

---

### REQ-109: E2E Edge Case Tests

- **Priority**: P1
- **Complexity**: Medium
- **Dependencies**: REQ-101
- **Target Files**: `tests/e2e/edge-cases/`
- **Persona Sources**: See `./plans/world-class-fuzzing-qa-agent.md` -- FR-QA-015

**Acceptance Criteria**:
- [ ] Maximum field lengths: no truncation in Supabase
- [ ] Double-click prevention: exactly 1 DB record
- [ ] Browser back/forward: no resubmission dialog
- [ ] MapLibre slow connection: static fallback, page interactive
- [ ] JavaScript disabled: SSG HTML renders
- [ ] Unicode/emoji: stored correctly in Supabase
- [ ] ISR revalidation: content updates propagate

---

### REQ-110: Keyboard Navigation Tests

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-101
- **Target Files**: `tests/e2e/accessibility/keyboard-nav.spec.ts`
- **Persona Sources**: See `./plans/world-class-fuzzing-qa-agent.md` -- FR-QA-017

**Acceptance Criteria**:
- [ ] Full Tab sequence from homepage body through all interactive elements
- [ ] Visible focus ring on every focused element
- [ ] Skip nav: Tab, visible, Enter -> focus on main
- [ ] Form: Tab through fields, submit with Enter, focus on success/error
- [ ] Mobile menu: open with Enter, focus trap, Escape closes, focus returns

---

### REQ-111: Color Contrast Validation Tests

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-100
- **Target Files**: `src/lib/design-tokens.unit.test.ts`
- **Persona Sources**: See `./plans/world-class-fuzzing-qa-agent.md` -- FR-QA-019

**Acceptance Criteria**:
- [ ] Unit tests validate all critical contrast ratios programmatically
- [ ] axe-core `color-contrast` rule on every page with zero violations
- [ ] Any token change triggers these tests

---

### REQ-112: Security E2E Tests

- **Priority**: P0
- **Complexity**: Medium
- **Dependencies**: REQ-101
- **Target Files**: `tests/e2e/security/`
- **Persona Sources**: See `./plans/world-class-fuzzing-qa-agent.md` -- FR-QA-014 (security scenarios)

**Acceptance Criteria**:
- [ ] XSS payloads in form fields: stripped or escaped, no script execution
- [ ] SQL injection payloads: passed as literal strings
- [ ] Rate limiting: 429 after threshold
- [ ] Honeypot: filled -> fake success, no DB write
- [ ] Security headers present on all responses
- [ ] Turnstile: expired/invalid tokens rejected
- [ ] CSP violations: no inline scripts execute

---

### REQ-113: Visual Regression Testing

- **Priority**: P1
- **Complexity**: Medium
- **Dependencies**: REQ-101
- **Target Files**: `tests/e2e/visual/`
- **Persona Sources**: See `./plans/world-class-fuzzing-qa-agent.md` -- Section 10

**Acceptance Criteria**:
- [ ] Playwright screenshot comparison for key pages at 3 viewports
- [ ] Baseline screenshots committed
- [ ] Pixel diff threshold: 0.1%

---

### REQ-114: SEO Validation Tests

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-101
- **Target Files**: `tests/e2e/seo/`
- **Persona Sources**: See `./plans/world-class-fuzzing-qa-agent.md` -- FR-QA-007 (content validation)

**Acceptance Criteria**:
- [ ] Every page has `generateMetadata`
- [ ] No duplicate titles/descriptions
- [ ] Titles 30-60 chars, descriptions 120-160 chars
- [ ] JSON-LD valid JSON with required properties
- [ ] Sitemap URLs all return 200
- [ ] Pricing values match source of truth

---

### REQ-115: Performance Budget CI Gates

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-011
- **Target Files**: `.bundlewatchrc.json` or `package.json`
- **Persona Sources**: See `./plans/world-class-fuzzing-qa-agent.md` -- FR-QA-004; `./plans/react-developer.md` -- FR-069, FR-070

**Acceptance Criteria**:
- [ ] bundlewatch enforces JS < 150KB gzipped, MapLibre < 200KB gzipped
- [ ] Lighthouse CI enforces all performance budget thresholds
- [ ] Failures block PR merge

---

### REQ-116: Incident Response Plan

- **Priority**: P1
- **Complexity**: Low
- **Dependencies**: None
- **Target Files**: Documentation
- **Persona Sources**: See `./plans/world-class-appsec-security-architect.md` -- Section 14

**Acceptance Criteria**:
- [ ] Severity classification: SEV1 (site down), SEV2 (security breach), SEV3 (functional bug), SEV4 (cosmetic)
- [ ] Contact escalation chain documented
- [ ] Rollback procedure: `kubectl rollout undo deployment/safetrekr-marketing`
- [ ] Post-incident review template

---

### REQ-117: Cookie Security

- **Priority**: P0
- **Complexity**: Low
- **Dependencies**: REQ-093
- **Target Files**: `src/middleware.ts`
- **Persona Sources**: See `./plans/world-class-appsec-security-architect.md` -- Section 11

**Acceptance Criteria**:
- [ ] No cookies set by the application at launch (Plausible is cookieless)
- [ ] Any future cookies: `Secure`, `HttpOnly`, `SameSite=Strict`, `__Host-` prefix
- [ ] CI test verifies zero cookies in Set-Cookie header

---

# EPIC 6: Growth Features (Week 11-16)

Goal: ROI calculator, comparison pages, procurement hub, A/B testing, video support, and growth optimizations.

---

### REQ-118: ROI Calculator

- **Priority**: P2
- **Complexity**: High
- **Dependencies**: REQ-071, REQ-044
- **Target Files**: `src/app/resources/roi-calculator/page.tsx`, `src/components/tools/roi-calculator.tsx`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- implied by pricing/ROI references

**Description**: Interactive ROI calculator comparing SafeTrekr cost vs. status quo (manual planning labor, settlement risk).

**Acceptance Criteria**:
- [ ] Inputs: segment, trips per year, avg group size, current safety method
- [ ] Outputs: cost per student, annual savings, risk reduction estimate
- [ ] Plausible events: `roi_calculator_start`, `roi_calculator_complete`
- [ ] Results shareable (URL params or download PDF)
- [ ] Pricing from single source of truth

---

### REQ-119: Comparison Pages

- **Priority**: P2
- **Complexity**: Medium
- **Dependencies**: REQ-044, REQ-050
- **Target Files**: `src/app/compare/[slug]/page.tsx`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-CONTENT-002 (Comparison Page content type)

**Description**: Category comparison pages (SafeTrekr vs. Spreadsheet Checklists, vs. Logistics Apps, vs. Enterprise Risk Platforms).

**Acceptance Criteria**:
- [ ] SSG with FAQPage + Article JSON-LD
- [ ] Semantic HTML tables
- [ ] No fabricated competitor names
- [ ] 1,000-1,500 words each

---

### REQ-120: Procurement Hub (`/procurement`)

- **Priority**: P2
- **Complexity**: Medium
- **Dependencies**: REQ-044
- **Target Files**: `src/app/procurement/page.tsx`
- **Persona Sources**: See analysis (committee buying challenge)

**Description**: Self-serve procurement resources: security questionnaire responses, compliance docs, SBOM, budget justification templates.

**Acceptance Criteria**:
- [ ] Downloadable security questionnaire pre-fill
- [ ] Compliance posture summary
- [ ] Budget justification template
- [ ] Board presentation template (PDF download)
- [ ] Response time commitment

---

### REQ-121: Security Page (`/security`)

- **Priority**: P1
- **Complexity**: Low
- **Dependencies**: REQ-044
- **Target Files**: `src/app/security/page.tsx`
- **Persona Sources**: See analysis; `./plans/world-class-appsec-security-architect.md`

**Description**: Public security posture page for enterprise buyer evaluation.

**Acceptance Criteria**:
- [ ] Encryption: AES-256 at rest, TLS 1.2+ in transit
- [ ] Authentication and access controls summary
- [ ] Data handling and privacy practices
- [ ] Compliance certifications (current and planned)
- [ ] Responsible disclosure contact

---

### REQ-122: A/B Test Infrastructure

- **Priority**: P2
- **Complexity**: Medium
- **Dependencies**: REQ-026
- **Target Files**: `src/lib/ab-test.ts`, database table (REQ-026 `ab_test_assignments`)
- **Persona Sources**: See `./plans/database-architect.md` -- FR-DB-015

**Acceptance Criteria**:
- [ ] Server-side variant assignment (sticky per session)
- [ ] `ab_test_assignments` table with UNIQUE constraint on (test_name, session_id)
- [ ] Conversion tracking
- [ ] 90-day retention after test completion

---

### REQ-123: VideoObject Schema

- **Priority**: P2
- **Complexity**: Low
- **Dependencies**: REQ-077, video content
- **Target Files**: Video page components
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-SCHEMA-009

**Acceptance Criteria**:
- [ ] VideoObject JSON-LD on any page with video
- [ ] Fields: name, description, thumbnailUrl, uploadDate, duration, contentUrl
- [ ] Only when real video content exists

---

### REQ-124: Review Schema (When Real Testimonials Exist)

- **Priority**: P2
- **Complexity**: Low
- **Dependencies**: REQ-077, real testimonials
- **Target Files**: Testimonial components
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-SCHEMA-010

**Acceptance Criteria**:
- [ ] Review JSON-LD ONLY with verified testimonials
- [ ] CI check blocks placeholder names ("Sample University", "Jane Doe")
- [ ] Each review: real person, real org, written permission

---

### REQ-125: LogoCloud Component

- **Priority**: P2
- **Complexity**: Low
- **Dependencies**: REQ-015
- **Target Files**: `src/components/marketing/logo-cloud.tsx`
- **Persona Sources**: See `./plans/world-class-ui-designer.md` -- FR-CL-015

**Description**: Trust organization logos (grayscale, hover reveals color).

**Acceptance Criteria**:
- [ ] Default: `grayscale opacity-50`, hover: full color
- [ ] Placeholder until real partner logos secured
- [ ] No fabricated or misleading logos

---

### REQ-126: Platform Feature Pages

- **Priority**: P2
- **Complexity**: Medium
- **Dependencies**: REQ-044
- **Target Files**: `src/app/platform/page.tsx`, `src/app/platform/[slug]/page.tsx`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-SEO-001 (sitemap references)

**Description**: Deep-dive pages for platform capabilities: analyst review, risk intelligence, safety binder.

**Acceptance Criteria**:
- [ ] SSG, unique metadata, BreadcrumbList JSON-LD
- [ ] Feature showcase layout
- [ ] Product screenshots/illustrations when available

---

### REQ-127: Sports Segment Page (`/solutions/sports`)

- **Priority**: P2
- **Complexity**: Medium
- **Dependencies**: REQ-044, REQ-050
- **Target Files**: `src/app/solutions/sports/page.tsx`
- **Persona Sources**: Analysis segment list

**Acceptance Criteria**:
- [ ] SSG, segment metadata, FAQPage JSON-LD
- [ ] Youth sports and league travel focus
- [ ] CTA with segment pre-selection

---

### REQ-128: FAQ Hub Page (`/resources/faq`)

- **Priority**: P1
- **Complexity**: Low
- **Dependencies**: REQ-050, REQ-044
- **Target Files**: `src/app/resources/faq/page.tsx`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-SCHEMA-005

**Acceptance Criteria**:
- [ ] Comprehensive FAQPage JSON-LD combining cross-segment questions
- [ ] Categorized accordion sections
- [ ] AI Summary Block

---

### REQ-129: Sample Binder Download Pages

- **Priority**: P1
- **Complexity**: Medium
- **Dependencies**: REQ-043, REQ-044
- **Target Files**: `src/app/resources/sample-binders/page.tsx`
- **Persona Sources**: Analysis (sample binder as #1 lead magnet)

**Description**: Segment-specific sample binder downloads behind email gate.

**Acceptance Criteria**:
- [ ] 3 segments at launch: K-12, Churches/Mission, Corporate
- [ ] LeadCaptureModal with segment pre-selected
- [ ] PDF download after form submission
- [ ] Plausible event: `Sample Binder Download`

---

### REQ-130: Compliance Guide Pages

- **Priority**: P2
- **Complexity**: Low
- **Dependencies**: REQ-087
- **Target Files**: `src/app/compliance/[slug]/page.tsx`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-CONTENT-002

**Description**: Regulation-specific compliance guides (FERPA, Clery Act, duty of care).

**Acceptance Criteria**:
- [ ] MDX content, Article + FAQPage JSON-LD
- [ ] 1,500-2,500 words
- [ ] Links to relevant segment page

---

### REQ-131: Glossary

- **Priority**: P2
- **Complexity**: Low
- **Dependencies**: REQ-087
- **Target Files**: `src/app/resources/glossary/[term]/page.tsx`
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-CONTENT-002

**Description**: Industry term definitions with DefinedTerm JSON-LD for AI discoverability.

**Acceptance Criteria**:
- [ ] MDX batch content, DefinedTerm JSON-LD
- [ ] 200-400 words per term
- [ ] Links to pillar content

---

### REQ-132: Publishing Workflow

- **Priority**: P1
- **Complexity**: Low
- **Dependencies**: REQ-087, REQ-011
- **Target Files**: `CODEOWNERS`, CI checks
- **Persona Sources**: See `./plans/world-class-digital-marketing-lead.md` -- FR-CONTENT-005

**Acceptance Criteria**:
- [ ] CODEOWNERS requires approval for `/content/` changes
- [ ] CI checks on content PRs: frontmatter validation, link check, word count, schema validation
- [ ] Post-merge: new URLs submitted to Google Search Console

---

### REQ-133: Backup and Disaster Recovery

- **Priority**: P1
- **Complexity**: Low
- **Dependencies**: REQ-025
- **Target Files**: Documentation
- **Persona Sources**: See `./plans/devops-platform-engineer.md` -- FR-INFRA-014

**Acceptance Criteria**:
- [ ] Supabase PITR enabled (Pro plan)
- [ ] K8s manifests version-controlled in Git
- [ ] Docker images retained for 30 days in registry
- [ ] Recovery procedure documented and tested

---

### REQ-134: Cost Estimation and Monitoring

- **Priority**: P1
- **Complexity**: Low
- **Dependencies**: REQ-007
- **Target Files**: Documentation
- **Persona Sources**: See `./plans/devops-platform-engineer.md` -- FR-INFRA-015

**Acceptance Criteria**:
- [ ] Monthly cost estimate documented: DOKS (~$48), LB (~$12), Registry (~$5), Supabase (~$25), Plausible (~$9), Total ~$100-120/mo
- [ ] DigitalOcean billing alerts at $100, $150, $200

---

---

# Cross-Cutting Concerns

These apply to ALL REQs across all Epics.

## Accessibility (WCAG 2.2 AA)

Every component, page, and interaction MUST meet WCAG 2.2 AA. This is not a separate phase -- it is built into every REQ. K-12 and government buyers require Section 508 compliance.

- Skip navigation link on every page
- ARIA landmarks and roles on every page
- `aria-current="page"` on active nav
- Keyboard navigation with visible focus indicators
- `prefers-reduced-motion` fully respected
- axe-core in CI on every page
- Minimum 44x44px touch targets

## Content Integrity

- NO fabricated testimonials, quotes, or unverifiable claims anywhere on the site
- All pricing values from single source of truth (`src/config/pricing.ts`)
- All trust metrics verifiable from the product codebase
- FERPA language: "Designed with FERPA requirements in mind" until certification obtained

## Performance

- All marketing pages are SSG (static generation at build time)
- Blog uses ISR (1-hour revalidation)
- MapLibre lazy-loaded, not in initial bundle
- Images optimized via `sharp` (self-hosted)
- Web fonts self-hosted via `next/font`

---

# Dependency Graph (Critical Path)

```
REQ-001 (Project Init)
  |-> REQ-002 (TypeScript)
  |-> REQ-003 (Next.js Config) -> REQ-005 (Docker) -> REQ-009 (K8s) -> REQ-011 (CI/CD)
  |-> REQ-004 (ESLint/Prettier)
  |-> REQ-012 (Design Tokens) -> REQ-013 (Base Styles) -> REQ-015 (shadcn/ui) -> All Components
  |-> REQ-014 (Typography)
  |-> REQ-018 (Motion Presets) -> REQ-019, REQ-020 (ScrollReveal, Stagger)

REQ-015 (shadcn/ui)
  |-> REQ-031 (Button) -> All Forms, Pages
  |-> REQ-032 (Atoms) -> REQ-034 (Header), REQ-035 (Footer)
  |-> REQ-036-038 (Cards)

REQ-025 (Supabase) -> REQ-026 (Schema) -> REQ-027 (Indexes) -> REQ-028 (RLS)

REQ-039 (Form Arch) -> REQ-041 (Demo), REQ-042 (Contact), REQ-076 (Newsletter)

REQ-044 (Root Layout) -> All Pages (REQ-045, 058-070, 087)

REQ-077 (JsonLd) -> REQ-078-080, REQ-088 (All Schemas)
```

---

# Risk Register

| Risk | Likelihood | Impact | Mitigation | Contingency |
|------|-----------|--------|------------|-------------|
| Zero testimonials at launch | High | Medium | Trust metrics strip with verifiable facts; collect from 104 existing orgs | Launch without testimonials; add Review schema when available |
| No product screenshots available | High | Medium | Custom-built product composition in hero (cards, not screenshots) | Use illustrations/mockups |
| Sample binders not ready at launch | Medium | High | Start binder production immediately; they are #1 lead magnet | Launch with "Coming Soon" gate; prioritize 1 segment (churches) |
| FERPA certification not obtained | High | Medium | Honest language: "Designed with FERPA in mind" | Accelerate certification; do not claim compliance |
| K-12 firewalls block Turnstile | Medium | High | Fallback mechanism (REQ-040): honeypot + time challenge + stricter rate limiting | Manual review queue for flagged submissions |
| MapLibre bundle too large | Low | Medium | Lazy loading, static fallback, bundlewatch CI gate | Remove interactive map; keep static image |
| ISR cache invalidation on DOKS | Medium | Low | Persistent volume for ISR cache in K8s | Manual revalidation endpoint; rebuild Docker image |
| Dependency supply chain attack | Low | High | Lockfile integrity, Dependabot, Socket.dev | Incident response plan; rollback to previous image |
| Cloudflare/Supabase outage | Low | High | Static-first architecture (SSG) means site serves from cache | Nginx serves cached pages; forms queue for retry |

---

# Decision Log

| Decision | Alternatives Considered | Rationale | Revisit If |
|----------|------------------------|-----------|------------|
| DOKS over Vercel | Vercel, Netlify, Fly.io | Cost predictability, no vendor lock-in, existing DO relationship | DO pricing changes or DOKS reliability issues |
| Plausible over GA4 | GA4, Fathom, Umami | Privacy-first (no cookies), K-12/church audience trust, no consent banner | Need deeper funnel analysis not possible with Plausible |
| Nonce-based CSP (no unsafe-inline) | Hash-based, unsafe-inline | Selling trust requires auditable security headers; enterprise buyers inspect | Never -- this is non-negotiable |
| Unified form_submissions table | Separate table per form type | Simpler schema, JSONB flexibility, single analytics query surface | > 100K rows with query performance degradation |
| SendGrid over Resend | Resend, Postmark | Existing in product stack, no new vendor relationship | SendGrid pricing or deliverability issues |
| MapLibre over Mapbox | Mapbox, Google Maps | BSD license, zero per-load cost, no API key metering | MapTiler free tier insufficient for traffic |
| Churches as beachhead | K-12, Corporate, Higher Ed | No FERPA blocker, 2-4 week procurement, denominational distribution | K-12 FERPA certification obtained |

---

# Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Demo requests / month | 30+ within 90 days | Plausible + Supabase |
| Sample binder downloads / month | 100+ within 90 days | Plausible + Supabase |
| Lighthouse Performance (all pages) | >= 95 | CI gate |
| Lighthouse Accessibility (all pages) | >= 95 | CI gate |
| Time to first demo request | < 14 days post-launch | Supabase timestamp |
| AI search citations | 10-15 within 90 days | Manual tracking |
| Organic traffic | 500+ sessions/month within 90 days | Plausible |
| Zero security incidents | 0 | Incident log |
| WCAG 2.2 AA compliance | 100% (zero axe violations) | CI gate |

---

# Glossary

| Term | Definition |
|------|-----------|
| SSG | Static Site Generation -- pages rendered at build time |
| ISR | Incremental Static Regeneration -- pages re-rendered on a schedule |
| DOKS | DigitalOcean Kubernetes Service |
| CSP | Content Security Policy |
| RLS | Row Level Security (Supabase/PostgreSQL) |
| JSON-LD | JSON for Linked Data -- structured data for search engines |
| Turnstile | Cloudflare's privacy-preserving bot protection |
| Beachhead | First target market segment (churches/missions) |
| Three-act mechanism | Intelligence > Review > Documentation |
| Trust metrics | Verifiable facts replacing fabricated testimonials |

---

**End of Master PRD**

*This document was synthesized from 7 persona-specific PRDs containing 368+ functional requirements, deduplicated into 134 unified requirements across 6 implementation Epics. Every REQ traces back to its source persona PRD(s) for detailed specification.*


---

# Persona-Specific Product Requirements Documents

The following sections contain detailed requirements from each specialist perspective.
Reference these for deeper implementation guidance.

---

# Database Architect PRD: SafeTrekr Marketing Site

**Project**: SafeTrekr Marketing Site -- Supabase Data Platform
**Author**: Database Architect Agent
**Date**: 2026-03-24
**Status**: Draft
**Stack**: PostgreSQL 15 via Supabase (separate project from product database)
**Deployment Target**: DigitalOcean DOKS (Kubernetes) with Next.js 15 standalone containers

---

## 1. Scope and Guiding Principles

This PRD defines all data architecture requirements for the SafeTrekr marketing site. The marketing database is a **separate Supabase project** from the product database (`app.safetrekr.com`). There is zero shared state, zero shared credentials, and zero network path between the two. Blast-radius isolation is enforced at the Supabase project level.

**Guiding Principles**

1. **Data integrity first** -- every table has primary keys, constraints, NOT NULL where appropriate, and audit timestamps.
2. **Security by default** -- Row Level Security enabled on every table before any data is inserted. The `anon` key has zero access to any table.
3. **Schema as code** -- all DDL lives in Supabase CLI migration files, version-controlled in Git. Manual changes to the live database are prohibited.
4. **PII minimization** -- raw IP addresses are never stored. Emails are the only directly identifying field, and column-level encryption at rest is applied.
5. **Retention automation** -- data that outlives its purpose is purged automatically, not manually.
6. **Observable from day one** -- `pg_stat_statements` enabled, query latency tracked, connection pool health monitored.

---

## 2. Supabase Project Setup

### FR-DB-001: Dedicated Marketing Supabase Project

**Priority**: P0 -- prerequisite for all other FRs

**Requirements**:

| Setting | Value | Rationale |
|---|---|---|
| Project Name | `safetrekr-marketing` | Clear separation from product project |
| Region | US East (`us-east-1`) | Co-locate with DigitalOcean NYC datacenter for lowest latency to DOKS pods |
| Plan | Pro ($25/month) | Required for PITR, Supavisor, Edge Functions, 8 GB database space |
| Database Password | Generated, stored in DOKS Kubernetes Secret | Never in source control |
| Org | SafeTrekr org (same org as product project, separate project) | Unified billing, separate access |

**Acceptance Criteria**:
- [ ] Supabase project is provisioned on the Pro plan in US East.
- [ ] The project has no foreign data wrappers, linked databases, or network paths to the product Supabase project.
- [ ] `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_ANON_KEY` are stored as Kubernetes Secrets in DOKS, not in source control.
- [ ] The `anon` key is never used in any application code. All database access uses the `service_role` key from server-side Next.js Route Handlers only.
- [ ] Supabase Dashboard access is restricted to authorized team members via Supabase org roles.

### FR-DB-002: Required PostgreSQL Extensions

**Priority**: P0

**Requirements**:

```sql
-- Cryptographic functions for IP hashing and token generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- UUID generation (v4 for primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Query performance monitoring
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Trigram matching for fuzzy email/org search (future admin panel)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

**Acceptance Criteria**:
- [ ] All four extensions are enabled in the first migration.
- [ ] `pg_stat_statements` is confirmed active via `SELECT * FROM pg_stat_statements LIMIT 1`.

---

## 3. Complete SQL Schema

### FR-DB-010: Enum Types

**Priority**: P0

All enum types are defined before any table creation. Enums enforce data integrity at the database level and prevent invalid values from entering the system regardless of application-layer validation failures.

```sql
CREATE TYPE form_type AS ENUM (
  'demo_request',
  'contact',
  'quote_request',
  'newsletter_signup',
  'sample_binder_download',
  'roi_calculator_result'
);

CREATE TYPE lead_status AS ENUM (
  'new',
  'contacted',
  'qualified',
  'disqualified',
  'converted'
);

CREATE TYPE organization_segment AS ENUM (
  'k12',
  'higher_education',
  'churches_missions',
  'corporate',
  'sports',
  'other'
);

CREATE TYPE submission_source AS ENUM (
  'organic',
  'paid_search',
  'paid_social',
  'referral',
  'direct',
  'email',
  'partner'
);

CREATE TYPE crm_sync_status AS ENUM (
  'pending',
  'synced',
  'failed',
  'skipped'
);
```

**Acceptance Criteria**:
- [ ] All five enum types exist in the `public` schema.
- [ ] Attempting to insert a value not in the enum returns a constraint violation error.

---

### FR-DB-011: `form_submissions` Table (Unified JSONB)

**Priority**: P0

This is the primary table for all lead capture. A single unified table with a `form_type` discriminator and a `details` JSONB column avoids table proliferation while maintaining type safety at the application layer via Zod schemas.

```sql
CREATE TABLE form_submissions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_type           form_type NOT NULL,
  status              lead_status NOT NULL DEFAULT 'new',

  -- Contact information (common across all form types)
  email               TEXT NOT NULL,
  first_name          TEXT,
  last_name           TEXT,
  phone               TEXT,
  organization        TEXT,
  job_title           TEXT,
  segment             organization_segment,

  -- Form-specific details stored as JSONB
  -- Demo request:    { trips_per_year, group_size, trip_types[], timeline, preferred_format }
  -- Quote request:   { trip_type, destination, group_size, departure_date, special_requirements }
  -- Contact:         { subject, message }
  -- Sample binder:   { binder_type }
  -- ROI calculator:  { trips_per_year, avg_group_size, current_method, calculated_savings }
  -- Newsletter:      { interests[] }
  details             JSONB NOT NULL DEFAULT '{}',

  -- Tracking and attribution
  source              submission_source DEFAULT 'direct',
  utm_source          TEXT,
  utm_medium          TEXT,
  utm_campaign        TEXT,
  utm_content         TEXT,
  utm_term            TEXT,
  referrer            TEXT,
  landing_page        TEXT,
  ip_hash             TEXT,           -- SHA-256 of IP; raw IP is NEVER stored
  user_agent          TEXT,
  country_code        TEXT,           -- Derived from request geo headers

  -- Anti-spam audit trail
  turnstile_token     TEXT,           -- Stored temporarily for audit; purged after 7 days
  honeypot_triggered  BOOLEAN NOT NULL DEFAULT FALSE,

  -- CRM sync state (denormalized for fast dashboard queries)
  crm_sync_status     crm_sync_status NOT NULL DEFAULT 'pending',
  crm_contact_id      TEXT,           -- HubSpot contact ID after successful sync
  crm_synced_at       TIMESTAMPTZ,
  crm_sync_error      TEXT,

  -- Audit timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT chk_details_is_object CHECK (jsonb_typeof(details) = 'object')
);

COMMENT ON TABLE form_submissions IS 'Unified table for all marketing form submissions. The form_type column discriminates the schema of the details JSONB column. Application-layer Zod schemas enforce type safety per form_type.';
COMMENT ON COLUMN form_submissions.ip_hash IS 'SHA-256 hash of the submitter IP address. Raw IPs are never stored. Used for rate limiting and geographic analytics.';
COMMENT ON COLUMN form_submissions.details IS 'Form-specific payload. Schema varies by form_type. Validated at the application layer via Zod before insertion.';
```

**Acceptance Criteria**:
- [ ] Table exists with all columns, types, defaults, and constraints as specified.
- [ ] Inserting a row with an invalid email format is rejected by `chk_email_format`.
- [ ] Inserting a row with `details` set to a JSON array (not object) is rejected by `chk_details_is_object`.
- [ ] `created_at` and `updated_at` default to `NOW()` on insert.
- [ ] `status` defaults to `'new'` on insert.
- [ ] `honeypot_triggered` defaults to `FALSE`.

---

### FR-DB-012: `newsletter_subscribers` Table (Double Opt-In)

**Priority**: P0

Implements CAN-SPAM and GDPR compliant double opt-in. A subscriber is not considered active until `confirmed = TRUE`. The `confirmation_token` is a one-time-use token sent via email.

```sql
CREATE TABLE newsletter_subscribers (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email                 TEXT NOT NULL UNIQUE,
  first_name            TEXT,
  segment               organization_segment,
  source                submission_source DEFAULT 'direct',

  -- Double opt-in workflow
  confirmed             BOOLEAN NOT NULL DEFAULT FALSE,
  confirmation_token    TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  confirmation_sent_at  TIMESTAMPTZ,
  confirmed_at          TIMESTAMPTZ,

  -- SendGrid integration
  sendgrid_contact_id   TEXT,
  sendgrid_list_ids     TEXT[],        -- Array of SendGrid list IDs for segmented sends

  -- Unsubscribe
  unsubscribed          BOOLEAN NOT NULL DEFAULT FALSE,
  unsubscribed_at       TIMESTAMPTZ,
  unsubscribe_reason    TEXT,

  -- Tracking
  utm_source            TEXT,
  utm_campaign          TEXT,
  ip_hash               TEXT,

  -- Audit timestamps
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT chk_subscriber_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT chk_confirmed_has_timestamp CHECK (
    (confirmed = FALSE) OR (confirmed = TRUE AND confirmed_at IS NOT NULL)
  ),
  CONSTRAINT chk_unsubscribed_has_timestamp CHECK (
    (unsubscribed = FALSE) OR (unsubscribed = TRUE AND unsubscribed_at IS NOT NULL)
  )
);

COMMENT ON TABLE newsletter_subscribers IS 'Newsletter subscription management with double opt-in. Subscribers are inactive until confirmed = TRUE. GDPR: retained until unsubscribe + 30 days, then hard-deleted.';
```

**Acceptance Criteria**:
- [ ] `email` has a UNIQUE constraint; duplicate inserts are rejected.
- [ ] `confirmation_token` is auto-generated as a 32-byte hex string on insert.
- [ ] Setting `confirmed = TRUE` without `confirmed_at` is rejected by constraint.
- [ ] Setting `unsubscribed = TRUE` without `unsubscribed_at` is rejected by constraint.

---

### FR-DB-013: `analytics_events` Table

**Priority**: P0

Custom conversion events that supplement Plausible Analytics. Plausible handles page views and basic events; this table captures structured conversion data (CTA clicks, scroll depth, pricing interactions) that Plausible does not store in queryable form.

```sql
CREATE TABLE analytics_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name      TEXT NOT NULL,        -- 'cta_click', 'pricing_view', 'scroll_depth', 'form_start', etc.
  event_category  TEXT,                 -- 'conversion', 'engagement', 'navigation'
  event_data      JSONB DEFAULT '{}',   -- Flexible event payload

  -- Page context
  page_path       TEXT NOT NULL,
  page_title      TEXT,
  referrer        TEXT,

  -- Session context (anonymous -- no cookies, no fingerprinting)
  session_id      TEXT,                 -- Anonymous session identifier (generated client-side, not a cookie)
  ip_hash         TEXT,                 -- SHA-256 of IP
  country_code    TEXT,
  device_type     TEXT,                 -- 'desktop', 'mobile', 'tablet'
  browser         TEXT,

  -- Timestamp
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT chk_event_name_not_empty CHECK (length(trim(event_name)) > 0),
  CONSTRAINT chk_page_path_not_empty CHECK (length(trim(page_path)) > 0)
);

COMMENT ON TABLE analytics_events IS 'Custom conversion and engagement events. Supplementary to Plausible Analytics. Retention: 90 days, auto-purged by scheduled function.';
```

**Acceptance Criteria**:
- [ ] Table accepts high-volume inserts (target: 100 events/minute sustained without degradation).
- [ ] `event_name` and `page_path` cannot be empty strings.
- [ ] No `updated_at` column -- events are immutable (append-only).

---

### FR-DB-014: `rate_limits` Table

**Priority**: P0

Dedicated rate-limiting table that decouples rate limit tracking from `form_submissions`. This allows rate limit checks without scanning the submissions table, supports the global per-IP rate limit that spans all form types, and enables 24-hour automatic cleanup without affecting form data.

```sql
CREATE TABLE rate_limits (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_hash         TEXT NOT NULL,
  action_type     TEXT NOT NULL,        -- 'demo_request', 'contact', 'newsletter_signup', 'analytics_event', 'global'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE rate_limits IS 'Sliding-window rate limit tracking. Each row represents one counted action. Rows older than 24 hours are automatically purged by the cleanup function. This table is intentionally denormalized for write speed.';
```

**Rate Limit Thresholds** (enforced by the `check_rate_limit` function in FR-DB-031):

| Action Type | Max Requests | Window | Rationale |
|---|---|---|---|
| `demo_request` | 5 | 1 hour | High-value form; low legitimate volume |
| `quote_request` | 5 | 1 hour | Same as demo |
| `contact` | 10 | 1 hour | Slightly more permissive |
| `newsletter_signup` | 3 | 1 hour | Single email per person |
| `analytics_event` | 100 | 1 minute | Higher volume, still bounded |
| `global` | 50 | 5 minutes | Catch-all across all action types |

**Acceptance Criteria**:
- [ ] Table supports high-throughput inserts (one row per rate-limited action).
- [ ] Rows older than 24 hours are automatically deleted by the scheduled cleanup function (FR-DB-041).
- [ ] The table has no foreign key constraints (intentional -- speed over referential integrity for ephemeral rate limit data).

---

### FR-DB-015: `ab_test_assignments` Table

**Priority**: P1 (not required for launch; required before A/B testing begins)

Stores visitor-to-variant assignments for server-side A/B tests. Assignment is sticky per `session_id` and `test_name` to ensure consistent experience.

```sql
CREATE TABLE ab_test_assignments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_name         TEXT NOT NULL,
  variant           TEXT NOT NULL,          -- 'control', 'variant_a', 'variant_b'
  session_id        TEXT NOT NULL,
  converted         BOOLEAN NOT NULL DEFAULT FALSE,
  conversion_event  TEXT,                   -- The event_name from analytics_events that constitutes conversion
  converted_at      TIMESTAMPTZ,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate assignments
  CONSTRAINT uq_ab_test_session UNIQUE (test_name, session_id),
  CONSTRAINT chk_converted_has_timestamp CHECK (
    (converted = FALSE) OR (converted = TRUE AND converted_at IS NOT NULL)
  )
);

COMMENT ON TABLE ab_test_assignments IS 'A/B test variant assignments. Retention: 90 days after test completion. The UNIQUE constraint on (test_name, session_id) ensures sticky assignments.';
```

**Acceptance Criteria**:
- [ ] A visitor assigned to `variant_a` for `hero_headline_test` always gets `variant_a` on subsequent requests (sticky assignment via UNIQUE constraint and `ON CONFLICT DO NOTHING` insert pattern).
- [ ] Conversion is recorded by updating `converted = TRUE` and `converted_at = NOW()`.
- [ ] Rows are retained for 90 days post-test completion, then purged.

---

### FR-DB-016: `crm_sync_queue` Table

**Priority**: P0 (table created at launch; CRM integration activated when HubSpot is provisioned)

Queue table for asynchronous CRM synchronization. Every qualifying form submission triggers an automatic queue entry (via trigger in FR-DB-022). A Supabase Edge Function cron job processes the queue with exponential backoff retry.

```sql
CREATE TABLE crm_sync_queue (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id   UUID NOT NULL REFERENCES form_submissions(id) ON DELETE CASCADE,
  payload         JSONB NOT NULL,
  status          crm_sync_status NOT NULL DEFAULT 'pending',
  attempts        INT NOT NULL DEFAULT 0,
  max_attempts    INT NOT NULL DEFAULT 5,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_error      TEXT,
  completed_at    TIMESTAMPTZ,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT chk_attempts_not_negative CHECK (attempts >= 0),
  CONSTRAINT chk_max_attempts_positive CHECK (max_attempts > 0)
);

COMMENT ON TABLE crm_sync_queue IS 'Async CRM sync queue with exponential backoff retry. Entries are created automatically by the queue_crm_sync trigger on form_submissions. Processed by a Supabase Edge Function cron job every 5 minutes.';
COMMENT ON COLUMN crm_sync_queue.next_attempt_at IS 'Exponential backoff schedule: 0m, 5m, 30m, 2h, 12h after each failure.';
```

**Acceptance Criteria**:
- [ ] `submission_id` references `form_submissions(id)` with `ON DELETE CASCADE`.
- [ ] Inserting a form submission of type `demo_request`, `quote_request`, or `contact` automatically creates a corresponding `crm_sync_queue` entry (via trigger FR-DB-022).
- [ ] The Edge Function cron job picks up rows where `status = 'pending'` and `next_attempt_at <= NOW()` and `attempts < max_attempts`.

---

## 4. Indexes

### FR-DB-020: Index Strategy

**Priority**: P0

All indexes are justified by documented query patterns. No speculative indexes. Indexes are created in the same migration as their parent table.

#### `form_submissions` Indexes

```sql
-- Primary query: filter by form type for dashboard views
CREATE INDEX idx_form_submissions_type
  ON form_submissions (form_type);

-- Lead status filtering for pipeline management
CREATE INDEX idx_form_submissions_status
  ON form_submissions (status);

-- Email lookup for GDPR erasure, deduplication, and CRM matching
CREATE INDEX idx_form_submissions_email
  ON form_submissions (email);

-- Segment filtering for segment-specific reporting
CREATE INDEX idx_form_submissions_segment
  ON form_submissions (segment);

-- Chronological listing (most recent first)
CREATE INDEX idx_form_submissions_created
  ON form_submissions (created_at DESC);

-- CRM sync: find pending items efficiently (partial index)
CREATE INDEX idx_form_submissions_crm_pending
  ON form_submissions (crm_sync_status)
  WHERE crm_sync_status = 'pending';

-- Composite index for rate limiting queries (ip_hash + form_type + time window)
CREATE INDEX idx_form_submissions_rate_limit
  ON form_submissions (ip_hash, form_type, created_at DESC);
```

#### `newsletter_subscribers` Indexes

```sql
-- Email is already UNIQUE (implicit index), but add for explicit documentation
-- The UNIQUE constraint on email creates an implicit B-tree index.

-- Active subscriber lookup (confirmed, not unsubscribed)
CREATE INDEX idx_newsletter_active
  ON newsletter_subscribers (confirmed, unsubscribed)
  WHERE confirmed = TRUE AND unsubscribed = FALSE;

-- Confirmation token lookup for double opt-in verification
CREATE INDEX idx_newsletter_confirmation_token
  ON newsletter_subscribers (confirmation_token)
  WHERE confirmation_token IS NOT NULL AND confirmed = FALSE;
```

#### `analytics_events` Indexes

```sql
-- Event type filtering for conversion analysis
CREATE INDEX idx_events_name
  ON analytics_events (event_name);

-- Chronological queries and retention cleanup
CREATE INDEX idx_events_created
  ON analytics_events (created_at DESC);

-- Page-level event analysis
CREATE INDEX idx_events_page
  ON analytics_events (page_path);

-- Session reconstruction
CREATE INDEX idx_events_session
  ON analytics_events (session_id)
  WHERE session_id IS NOT NULL;
```

#### `rate_limits` Indexes

```sql
-- Primary query pattern: count actions for an IP within a time window
CREATE INDEX idx_rate_limits_lookup
  ON rate_limits (ip_hash, action_type, created_at DESC);

-- Cleanup: delete rows older than 24 hours
CREATE INDEX idx_rate_limits_cleanup
  ON rate_limits (created_at);
```

#### `ab_test_assignments` Indexes

```sql
-- Test analysis: group by test + variant for conversion rate calculation
CREATE INDEX idx_ab_test_analysis
  ON ab_test_assignments (test_name, variant);
-- Note: (test_name, session_id) already has a UNIQUE index from the constraint.
```

#### `crm_sync_queue` Indexes

```sql
-- Cron job picks up pending items ready for processing
CREATE INDEX idx_crm_queue_pending
  ON crm_sync_queue (next_attempt_at)
  WHERE status = 'pending' AND attempts < max_attempts;
```

**Acceptance Criteria**:
- [ ] All indexes listed above exist after the initial migration.
- [ ] No table has more than 7 indexes (guard against over-indexing).
- [ ] Partial indexes use WHERE clauses to minimize index size.
- [ ] After 30 days of production traffic, run `pg_stat_user_indexes` to verify all indexes have non-zero `idx_scan` counts. Drop any unused indexes.

---

## 5. Row Level Security

### FR-DB-021: RLS Policies (Service-Role Only, No Anon Access)

**Priority**: P0 -- must be applied before any data is inserted

The marketing site has no user authentication. All database access is server-side via the `service_role` key. RLS is enabled on every table with a single policy that grants full access to `service_role` only. The `anon` role has zero access to any table.

This is a defense-in-depth measure: even if the `anon` key leaks (e.g., accidentally included in a client-side bundle), no data is exposed.

```sql
-- Enable RLS on every table
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_sync_queue ENABLE ROW LEVEL SECURITY;

-- Grant full access to service_role only
-- Policy name must be unique per table
CREATE POLICY "service_role_all" ON form_submissions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all" ON newsletter_subscribers
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all" ON analytics_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all" ON rate_limits
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all" ON ab_test_assignments
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all" ON crm_sync_queue
  FOR ALL USING (auth.role() = 'service_role');
```

**Verification Query** (run after migration):

```sql
-- Confirm RLS is enabled on all tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'form_submissions', 'newsletter_subscribers', 'analytics_events',
    'rate_limits', 'ab_test_assignments', 'crm_sync_queue'
  );
-- All rows must show rowsecurity = true
```

**Acceptance Criteria**:
- [ ] RLS is enabled on all six tables.
- [ ] Querying any table with the `anon` key returns zero rows.
- [ ] Querying any table with the `service_role` key returns all rows.
- [ ] No policy exists that grants access to `authenticated`, `anon`, or any other role.

---

## 6. Triggers

### FR-DB-022: Auto-Queue CRM Sync on Form Submission Insert

**Priority**: P0

When a new form submission of type `demo_request`, `quote_request`, or `contact` is inserted, automatically create a corresponding entry in `crm_sync_queue`. Newsletter signups, sample binder downloads, and ROI calculator results do not trigger CRM sync (they sync via SendGrid list management instead).

```sql
CREATE OR REPLACE FUNCTION queue_crm_sync()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.form_type IN ('demo_request', 'quote_request', 'contact') THEN
    INSERT INTO crm_sync_queue (submission_id, payload)
    VALUES (
      NEW.id,
      jsonb_build_object(
        'email', NEW.email,
        'first_name', NEW.first_name,
        'last_name', NEW.last_name,
        'phone', NEW.phone,
        'organization', NEW.organization,
        'job_title', NEW.job_title,
        'segment', NEW.segment::TEXT,
        'form_type', NEW.form_type::TEXT,
        'details', NEW.details,
        'source', NEW.source::TEXT,
        'utm_source', NEW.utm_source,
        'utm_medium', NEW.utm_medium,
        'utm_campaign', NEW.utm_campaign,
        'landing_page', NEW.landing_page,
        'country_code', NEW.country_code,
        'submitted_at', NEW.created_at
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_crm_sync
  AFTER INSERT ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION queue_crm_sync();
```

**Acceptance Criteria**:
- [ ] Inserting a `demo_request` row into `form_submissions` creates exactly one row in `crm_sync_queue` within the same transaction.
- [ ] Inserting a `newsletter_signup` row does NOT create a `crm_sync_queue` entry.
- [ ] The `payload` JSONB in the queue entry contains all fields listed in the function.
- [ ] The trigger does not block or slow down the original INSERT (AFTER trigger, not BEFORE).

---

### FR-DB-023: Auto-Update `updated_at` Timestamp

**Priority**: P0

Every table with an `updated_at` column automatically sets it to `NOW()` on any UPDATE operation.

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER set_updated_at_form_submissions
  BEFORE UPDATE ON form_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_newsletter_subscribers
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_crm_sync_queue
  BEFORE UPDATE ON crm_sync_queue
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

**Acceptance Criteria**:
- [ ] Updating any column on `form_submissions` causes `updated_at` to change to the current timestamp.
- [ ] Same behavior on `newsletter_subscribers` and `crm_sync_queue`.
- [ ] `analytics_events`, `rate_limits`, and `ab_test_assignments` do NOT have this trigger (they are append-only / immutable).

---

## 7. Database Functions

### FR-DB-031: Rate Limit Check Function

**Priority**: P0

A server-side function that checks whether an IP has exceeded the rate limit for a given action type within the configured time window. This function is called from Next.js Route Handlers before processing any form submission or analytics event.

```sql
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_ip_hash TEXT,
  p_action_type TEXT,
  p_max_requests INT,
  p_window_seconds INT
)
RETURNS TABLE (
  is_limited BOOLEAN,
  current_count BIGINT,
  retry_after_seconds INT
) AS $$
DECLARE
  v_window_start TIMESTAMPTZ;
  v_count BIGINT;
  v_oldest_in_window TIMESTAMPTZ;
BEGIN
  v_window_start := NOW() - (p_window_seconds || ' seconds')::INTERVAL;

  -- Count requests in the current window
  SELECT COUNT(*), MIN(created_at)
  INTO v_count, v_oldest_in_window
  FROM rate_limits
  WHERE ip_hash = p_ip_hash
    AND action_type = p_action_type
    AND created_at >= v_window_start;

  IF v_count >= p_max_requests THEN
    -- Calculate seconds until the oldest request in the window expires
    RETURN QUERY SELECT
      TRUE,
      v_count,
      GREATEST(1, EXTRACT(EPOCH FROM (v_oldest_in_window + (p_window_seconds || ' seconds')::INTERVAL - NOW()))::INT);
  ELSE
    -- Not limited; record this action
    INSERT INTO rate_limits (ip_hash, action_type) VALUES (p_ip_hash, p_action_type);
    RETURN QUERY SELECT FALSE, v_count + 1, 0;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Usage from Next.js**:

```typescript
const { data, error } = await supabase.rpc('check_rate_limit', {
  p_ip_hash: ipHash,
  p_action_type: 'demo_request',
  p_max_requests: 5,
  p_window_seconds: 3600 // 1 hour
});

if (data?.[0]?.is_limited) {
  return new Response('Too many requests', {
    status: 429,
    headers: { 'Retry-After': String(data[0].retry_after_seconds) }
  });
}
```

**Acceptance Criteria**:
- [ ] Calling `check_rate_limit('abc123', 'demo_request', 5, 3600)` six times within one hour returns `is_limited = FALSE` for calls 1-5 and `is_limited = TRUE` for call 6.
- [ ] When rate-limited, `retry_after_seconds` returns a positive integer indicating when the oldest request expires from the window.
- [ ] When not rate-limited, the function atomically records the action in `rate_limits` (no separate INSERT needed).
- [ ] Function executes in under 5 ms under normal load.

---

### FR-DB-032: Form Submission Handler Function

**Priority**: P1

A server-side function that encapsulates the full form submission workflow: validate input, check rate limit, insert submission, and return the result. This reduces round-trips between the application and database from 3 (rate check + insert + queue check) to 1.

```sql
CREATE OR REPLACE FUNCTION handle_form_submission(
  p_form_type form_type,
  p_email TEXT,
  p_first_name TEXT DEFAULT NULL,
  p_last_name TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_organization TEXT DEFAULT NULL,
  p_job_title TEXT DEFAULT NULL,
  p_segment organization_segment DEFAULT NULL,
  p_details JSONB DEFAULT '{}',
  p_source submission_source DEFAULT 'direct',
  p_utm_source TEXT DEFAULT NULL,
  p_utm_medium TEXT DEFAULT NULL,
  p_utm_campaign TEXT DEFAULT NULL,
  p_utm_content TEXT DEFAULT NULL,
  p_utm_term TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL,
  p_landing_page TEXT DEFAULT NULL,
  p_ip_hash TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_country_code TEXT DEFAULT NULL,
  p_turnstile_token TEXT DEFAULT NULL,
  p_honeypot_triggered BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
  success BOOLEAN,
  submission_id UUID,
  error_code TEXT,
  error_message TEXT
) AS $$
DECLARE
  v_rate_limited BOOLEAN;
  v_rate_count BIGINT;
  v_retry_after INT;
  v_max_requests INT;
  v_window_seconds INT;
  v_new_id UUID;
BEGIN
  -- Determine rate limit thresholds based on form type
  CASE p_form_type
    WHEN 'demo_request' THEN v_max_requests := 5; v_window_seconds := 3600;
    WHEN 'quote_request' THEN v_max_requests := 5; v_window_seconds := 3600;
    WHEN 'contact' THEN v_max_requests := 10; v_window_seconds := 3600;
    WHEN 'newsletter_signup' THEN v_max_requests := 3; v_window_seconds := 3600;
    WHEN 'sample_binder_download' THEN v_max_requests := 10; v_window_seconds := 3600;
    WHEN 'roi_calculator_result' THEN v_max_requests := 10; v_window_seconds := 3600;
  END CASE;

  -- Check rate limit
  IF p_ip_hash IS NOT NULL THEN
    SELECT rl.is_limited, rl.current_count, rl.retry_after_seconds
    INTO v_rate_limited, v_rate_count, v_retry_after
    FROM check_rate_limit(p_ip_hash, p_form_type::TEXT, v_max_requests, v_window_seconds) rl;

    IF v_rate_limited THEN
      RETURN QUERY SELECT FALSE, NULL::UUID, 'RATE_LIMITED', format('Rate limit exceeded. Retry after %s seconds.', v_retry_after);
      RETURN;
    END IF;
  END IF;

  -- Reject honeypot triggers silently (return success to fool bots)
  IF p_honeypot_triggered THEN
    RETURN QUERY SELECT TRUE, uuid_generate_v4(), NULL::TEXT, NULL::TEXT;
    RETURN;
  END IF;

  -- Insert the form submission
  INSERT INTO form_submissions (
    form_type, email, first_name, last_name, phone, organization,
    job_title, segment, details, source, utm_source, utm_medium,
    utm_campaign, utm_content, utm_term, referrer, landing_page,
    ip_hash, user_agent, country_code, turnstile_token, honeypot_triggered
  ) VALUES (
    p_form_type, p_email, p_first_name, p_last_name, p_phone, p_organization,
    p_job_title, p_segment, p_details, p_source, p_utm_source, p_utm_medium,
    p_utm_campaign, p_utm_content, p_utm_term, p_referrer, p_landing_page,
    p_ip_hash, p_user_agent, p_country_code, p_turnstile_token, p_honeypot_triggered
  )
  RETURNING id INTO v_new_id;

  -- Note: CRM queue entry is created automatically by the trigger_crm_sync trigger.

  RETURN QUERY SELECT TRUE, v_new_id, NULL::TEXT, NULL::TEXT;

EXCEPTION
  WHEN check_violation THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 'VALIDATION_ERROR', SQLERRM;
  WHEN unique_violation THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 'DUPLICATE_ENTRY', SQLERRM;
  WHEN OTHERS THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 'INTERNAL_ERROR', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Acceptance Criteria**:
- [ ] A single RPC call `supabase.rpc('handle_form_submission', {...})` performs rate limiting, insertion, and CRM queue creation in one database round-trip.
- [ ] Honeypot-triggered submissions return `success = TRUE` with a fake UUID (bots receive no signal that they were detected).
- [ ] Rate-limited requests return `success = FALSE` with `error_code = 'RATE_LIMITED'`.
- [ ] Invalid email format returns `error_code = 'VALIDATION_ERROR'`.
- [ ] Function executes in under 20 ms under normal load.

---

## 8. Data Retention Policies

### FR-DB-040: Retention Schedule

**Priority**: P0

| Data Type | Retention Period | Purge Method | Rationale |
|---|---|---|---|
| `form_submissions` | 3 years | Manual archive (future) | Sales pipeline tracking; legal compliance |
| `newsletter_subscribers` | Until unsubscribe + 30 days | GDPR erasure function | CAN-SPAM / GDPR right to erasure |
| `analytics_events` | 90 days | Automated daily purge | Sufficient for conversion analysis; Plausible retains long-term trends |
| `rate_limits` | 24 hours | Automated hourly purge | Ephemeral data; only needed for active rate limiting |
| `ab_test_assignments` | 90 days after test end | Manual purge per test | No longer needed after statistical analysis |
| `crm_sync_queue` (completed) | 90 days after completion | Automated weekly purge | Audit trail for failed syncs |
| `turnstile_token` column | 7 days | Automated daily NULL-out | Short-term audit; not needed long-term |

---

### FR-DB-041: Automated Retention Cleanup Functions

**Priority**: P0

```sql
-- Purge rate_limits older than 24 hours
-- Schedule: every hour via pg_cron or Supabase Edge Function cron
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS BIGINT AS $$
DECLARE
  v_deleted BIGINT;
BEGIN
  DELETE FROM rate_limits
  WHERE created_at < NOW() - INTERVAL '24 hours';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Purge analytics_events older than 90 days
-- Schedule: daily at 03:00 UTC via Supabase Edge Function cron
CREATE OR REPLACE FUNCTION cleanup_analytics_events()
RETURNS BIGINT AS $$
DECLARE
  v_deleted BIGINT;
BEGIN
  DELETE FROM analytics_events
  WHERE created_at < NOW() - INTERVAL '90 days';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Purge completed CRM sync queue entries older than 90 days
-- Schedule: weekly on Sunday at 04:00 UTC
CREATE OR REPLACE FUNCTION cleanup_crm_sync_queue()
RETURNS BIGINT AS $$
DECLARE
  v_deleted BIGINT;
BEGIN
  DELETE FROM crm_sync_queue
  WHERE completed_at IS NOT NULL
    AND completed_at < NOW() - INTERVAL '90 days';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- NULL out turnstile tokens older than 7 days
-- Schedule: daily at 03:30 UTC
CREATE OR REPLACE FUNCTION cleanup_turnstile_tokens()
RETURNS BIGINT AS $$
DECLARE
  v_updated BIGINT;
BEGIN
  UPDATE form_submissions
  SET turnstile_token = NULL
  WHERE turnstile_token IS NOT NULL
    AND created_at < NOW() - INTERVAL '7 days';
  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Hard-delete unsubscribed newsletter entries older than 30 days
-- Schedule: daily at 03:15 UTC
CREATE OR REPLACE FUNCTION cleanup_unsubscribed_newsletters()
RETURNS BIGINT AS $$
DECLARE
  v_deleted BIGINT;
BEGIN
  DELETE FROM newsletter_subscribers
  WHERE unsubscribed = TRUE
    AND unsubscribed_at < NOW() - INTERVAL '30 days';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Cron Schedule** (implemented via Supabase Edge Function with `Deno.cron` or `pg_cron` if available):

| Function | Schedule | Expected Volume |
|---|---|---|
| `cleanup_rate_limits()` | Every hour, minute 0 | 100-5,000 rows deleted per run |
| `cleanup_analytics_events()` | Daily 03:00 UTC | 0-10,000 rows deleted per run |
| `cleanup_turnstile_tokens()` | Daily 03:30 UTC | 0-500 rows updated per run |
| `cleanup_unsubscribed_newsletters()` | Daily 03:15 UTC | 0-50 rows deleted per run |
| `cleanup_crm_sync_queue()` | Sunday 04:00 UTC | 0-200 rows deleted per run |

**Acceptance Criteria**:
- [ ] Each cleanup function returns the count of affected rows.
- [ ] `cleanup_rate_limits()` deletes all rows with `created_at` older than 24 hours.
- [ ] `cleanup_analytics_events()` deletes all rows with `created_at` older than 90 days.
- [ ] `cleanup_turnstile_tokens()` sets `turnstile_token = NULL` but does NOT delete the form submission row.
- [ ] `cleanup_unsubscribed_newsletters()` hard-deletes subscribers who unsubscribed more than 30 days ago.
- [ ] All cleanup functions are scheduled and confirmed running via Supabase Edge Function logs.

---

## 9. GDPR Right-to-Erasure Function

### FR-DB-050: GDPR Data Subject Erasure

**Priority**: P0

A single function that performs complete erasure of all data associated with an email address across all tables. This satisfies GDPR Article 17 (Right to Erasure) and CCPA Right to Delete.

```sql
CREATE OR REPLACE FUNCTION gdpr_erase_by_email(p_email TEXT)
RETURNS TABLE (
  table_name TEXT,
  rows_deleted BIGINT
) AS $$
DECLARE
  v_form_ids UUID[];
  v_deleted BIGINT;
BEGIN
  -- 1. Collect form_submission IDs for cascade reference
  SELECT ARRAY_AGG(id) INTO v_form_ids
  FROM form_submissions
  WHERE email = p_email;

  -- 2. Delete CRM sync queue entries (references form_submissions via FK CASCADE,
  --    but explicit delete for audit clarity)
  DELETE FROM crm_sync_queue
  WHERE submission_id = ANY(COALESCE(v_form_ids, ARRAY[]::UUID[]));
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN QUERY SELECT 'crm_sync_queue'::TEXT, v_deleted;

  -- 3. Delete form submissions
  DELETE FROM form_submissions WHERE email = p_email;
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN QUERY SELECT 'form_submissions'::TEXT, v_deleted;

  -- 4. Delete newsletter subscriptions
  DELETE FROM newsletter_subscribers WHERE email = p_email;
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN QUERY SELECT 'newsletter_subscribers'::TEXT, v_deleted;

  -- 5. Analytics events do not contain email, but may contain ip_hash.
  --    Since ip_hash is a one-way SHA-256, we cannot correlate events to an email
  --    without the original IP. Analytics events are retained (they are anonymous).
  --    If the data subject provides their IP for cross-reference, delete those too:
  --    (This branch is intentionally commented out; enable only if IP is provided)
  -- DELETE FROM analytics_events WHERE ip_hash = p_provided_ip_hash;

  -- 6. A/B test assignments do not contain email or PII.
  --    They use anonymous session_id only. No deletion needed.

  -- 7. Rate limits do not contain email. No deletion needed.

  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Companion function: Data export for Right to Access / Right to Portability**:

```sql
CREATE OR REPLACE FUNCTION gdpr_export_by_email(p_email TEXT)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'exported_at', NOW(),
    'email', p_email,
    'form_submissions', COALESCE((
      SELECT jsonb_agg(row_to_json(fs))
      FROM form_submissions fs
      WHERE fs.email = p_email
    ), '[]'::JSONB),
    'newsletter_subscriptions', COALESCE((
      SELECT jsonb_agg(row_to_json(ns))
      FROM newsletter_subscribers ns
      WHERE ns.email = p_email
    ), '[]'::JSONB)
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Acceptance Criteria**:
- [ ] Calling `gdpr_erase_by_email('test@example.com')` deletes all rows from `form_submissions`, `newsletter_subscribers`, and `crm_sync_queue` associated with that email.
- [ ] The function returns a table showing how many rows were deleted from each table.
- [ ] After erasure, `SELECT * FROM form_submissions WHERE email = 'test@example.com'` returns zero rows.
- [ ] After erasure, `SELECT * FROM newsletter_subscribers WHERE email = 'test@example.com'` returns zero rows.
- [ ] `gdpr_export_by_email` returns a complete JSON export before deletion is performed (the application layer calls export first, then erase).
- [ ] The erasure function completes within 5 seconds even with 1,000+ rows to delete.
- [ ] All erasure actions are logged externally (application layer logs to Sentry/observability stack) for GDPR accountability.

---

## 10. PII Handling

### FR-DB-060: IP Address Hashing (SHA-256)

**Priority**: P0

Raw IP addresses are **never stored** in any table. All IP addresses are hashed with SHA-256 before insertion. The hash is performed at the application layer (Next.js Route Handler) before the data reaches Supabase.

```typescript
// lib/security/ip-hash.ts
import { createHash } from 'crypto';

const IP_HASH_SALT = process.env.IP_HASH_SALT!; // Stored in Kubernetes Secret

export function hashIP(ip: string): string {
  return createHash('sha256')
    .update(ip + IP_HASH_SALT)
    .digest('hex');
}
```

**Requirements**:
- The `IP_HASH_SALT` is a 64-character random string stored as a Kubernetes Secret. It is never committed to source control.
- The salt ensures that the same IP produces a different hash than in other systems, preventing cross-system correlation.
- SHA-256 is a one-way function. There is no way to reverse the hash to recover the original IP.

**Acceptance Criteria**:
- [ ] No column in any table contains a raw IP address (verified by schema inspection).
- [ ] All `ip_hash` columns contain 64-character hex strings (SHA-256 output length).
- [ ] The `IP_HASH_SALT` environment variable is set in all environments (production, staging, local).
- [ ] Different salts are used in production vs. staging vs. local to prevent cross-environment correlation.

---

### FR-DB-061: Email Encryption at Rest

**Priority**: P1

While Supabase encrypts all data at rest at the volume level (AES-256), emails represent the highest-value PII in the marketing database. Column-level encryption adds defense-in-depth: even if a database backup is compromised, emails remain encrypted.

**Implementation approach**: Application-layer encryption using AES-256-GCM before insertion, with the encryption key stored in Kubernetes Secrets. This avoids dependency on `pgcrypto` for encryption (which would require the key to be sent to the database).

```typescript
// lib/security/encrypt.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ENCRYPTION_KEY = Buffer.from(process.env.EMAIL_ENCRYPTION_KEY!, 'hex'); // 32 bytes

export function encryptEmail(email: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(email, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // Format: iv:authTag:ciphertext (all base64)
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted.toString('base64')}`;
}

export function decryptEmail(encryptedEmail: string): string {
  const [ivB64, authTagB64, ciphertextB64] = encryptedEmail.split(':');
  const iv = Buffer.from(ivB64, 'base64');
  const authTag = Buffer.from(authTagB64, 'base64');
  const ciphertext = Buffer.from(ciphertextB64, 'base64');
  const decipher = createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  return decipher.update(ciphertext) + decipher.final('utf8');
}
```

**Trade-off**: Column-level encryption means email-based queries (`WHERE email = ?`) require either:
1. A separate `email_hash` column (SHA-256 of normalized lowercase email) for lookups, with the encrypted email for display/export. This is the recommended approach.
2. Decrypting all rows in application memory (unacceptable at scale).

**Recommended schema addition** (applied in a follow-up migration):

```sql
ALTER TABLE form_submissions ADD COLUMN email_hash TEXT;
ALTER TABLE newsletter_subscribers ADD COLUMN email_hash TEXT;

-- Index on email_hash for lookups
CREATE INDEX idx_form_submissions_email_hash ON form_submissions (email_hash);
CREATE INDEX idx_newsletter_email_hash ON newsletter_subscribers (email_hash);

-- Once email_hash is populated, the email column stores encrypted values.
-- The existing idx_form_submissions_email index is replaced by idx_form_submissions_email_hash.
```

**Acceptance Criteria**:
- [ ] The `email` column in `form_submissions` and `newsletter_subscribers` stores AES-256-GCM encrypted values (not plaintext) when column-level encryption is enabled.
- [ ] An `email_hash` column exists for deterministic lookups (SHA-256 of lowercase-trimmed email + salt).
- [ ] The `EMAIL_ENCRYPTION_KEY` is a 32-byte hex string stored as a Kubernetes Secret.
- [ ] Email encryption/decryption round-trips correctly for all valid email formats.
- [ ] GDPR erasure and export functions work correctly with encrypted emails (application layer decrypts before export; erasure uses `email_hash` for lookup).

**Note on phasing**: Email encryption at rest is P1. At launch (P0), emails are stored in plaintext with Supabase's volume-level AES-256 encryption providing the baseline protection. The column-level encryption migration ships within 30 days of launch.

---

## 11. Migration Strategy

### FR-DB-070: Supabase CLI Migration Workflow

**Priority**: P0

All schema changes are managed through the Supabase CLI migration system. The migration files are version-controlled in Git alongside the application code.

**Directory structure**:

```
supabase/
  config.toml                    # Supabase project configuration
  seed.sql                       # Development seed data (never runs in production)
  migrations/
    20260324000000_initial_schema.sql        # Extensions, enums, tables, indexes, RLS
    20260324000001_functions_and_triggers.sql # Functions, triggers
    20260324000002_retention_functions.sql    # Cleanup functions
    20260324000003_gdpr_functions.sql         # GDPR erasure and export
    20260401000000_email_encryption.sql       # P1: Column-level email encryption
```

**Migration workflow**:

```bash
# Create a new migration
supabase migration new add_column_to_form_submissions

# Apply migrations to local development database
supabase db reset  # Drops and recreates local DB, applies all migrations

# Apply migrations to remote (staging/production)
supabase db push   # Applies pending migrations

# Generate TypeScript types after migration
supabase gen types typescript --project-id olgjdqguafidgrutubih > src/lib/supabase/database.types.ts
```

**CI/CD integration** (GitHub Actions):

```yaml
# .github/workflows/db-migrate.yml
name: Database Migration
on:
  push:
    branches: [main]
    paths: ['supabase/migrations/**']

jobs:
  migrate-staging:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
      - run: supabase link --project-ref ${{ secrets.SUPABASE_STAGING_PROJECT_ID }}
      - run: supabase db push
      - run: supabase gen types typescript --project-id ${{ secrets.SUPABASE_STAGING_PROJECT_ID }} > /tmp/types.ts
      - name: Verify types compile
        run: npx tsc --noEmit /tmp/types.ts

  migrate-production:
    needs: migrate-staging
    runs-on: ubuntu-latest
    environment: production  # Requires manual approval
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
      - run: supabase link --project-ref ${{ secrets.SUPABASE_PROD_PROJECT_ID }}
      - run: supabase db push
```

**Acceptance Criteria**:
- [ ] All schema changes exist as numbered migration files in `supabase/migrations/`.
- [ ] `supabase db reset` on a local instance produces an identical schema to production.
- [ ] Migrations are applied to staging first, then production (with manual approval gate).
- [ ] No migration uses `DROP TABLE` or `DROP COLUMN` without a corresponding data migration plan.
- [ ] Every migration is idempotent where possible (using `IF NOT EXISTS`, `CREATE OR REPLACE`).
- [ ] The migration CI job blocks production deployment if staging migration fails.

---

## 12. TypeScript Type Generation

### FR-DB-071: Automated Type Generation

**Priority**: P0

TypeScript types are generated from the live database schema using `supabase gen types`. This ensures type safety between the database schema and Next.js application code. Types are regenerated on every migration and committed to the repository.

**Generated file**: `src/lib/supabase/database.types.ts`

**Usage**:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: 'public' },
  }
);

// Fully typed insert
const { data, error } = await supabase
  .from('form_submissions')
  .insert({
    form_type: 'demo_request',     // Type-checked against form_type enum
    email: 'test@example.com',
    details: { trips_per_year: 10 },
  })
  .select()
  .single();
// data is typed as Database['public']['Tables']['form_submissions']['Row']
```

**Acceptance Criteria**:
- [ ] `src/lib/supabase/database.types.ts` exists and is committed to the repository.
- [ ] The file is regenerated by CI on every migration merge and included in the same commit.
- [ ] All Supabase client operations in the codebase use the `Database` generic type parameter.
- [ ] TypeScript compilation fails if application code references a column that does not exist in the generated types.
- [ ] Enum types from the database (`form_type`, `lead_status`, etc.) are available as TypeScript string union types.

---

## 13. Connection Pooling

### FR-DB-080: Supavisor Connection Pooling for DOKS Pods

**Priority**: P0

Kubernetes pods running the Next.js application create database connections on every request (since Next.js Route Handlers are stateless). Without connection pooling, a traffic spike (back-to-school season, conference mention, viral social post) can exhaust the Supabase Pro plan's 60 direct connections.

**Configuration**:

| Setting | Value | Rationale |
|---|---|---|
| Pool Mode | Transaction | Best for stateless serverless/container workloads |
| Pooler URL | `postgres://[user].[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres` | Supavisor pooler endpoint (port 6543, not 5432) |
| Max Connections (Supavisor) | 200 (Supabase Pro default) | Handles concurrent pod connections |
| Max Connections (Postgres) | 60 (Supabase Pro) | Underlying database limit |

**Application-side configuration**:

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// IMPORTANT: Use the pooler URL (port 6543), not the direct URL (port 5432)
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,      // Server-side only; no session persistence
    autoRefreshToken: false,    // No auth refresh needed
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-connection-pool': 'transaction', // Hint for Supavisor
    },
  },
});
```

**DOKS-specific considerations**:

- Horizontal Pod Autoscaler (HPA) may scale pods from 2 to 10 during traffic spikes. Each pod may hold 5-10 concurrent connections. Supavisor's 200-connection pool handles this without exhaustion.
- Connection timeout set to 5 seconds at the application layer. If Supavisor cannot allocate a connection within 5 seconds, the request returns 503 (Service Unavailable) with a retry hint.
- No persistent connections. Each Route Handler invocation creates a new Supabase client, makes its queries, and the connection returns to the pool.

**Acceptance Criteria**:
- [ ] The application uses the Supavisor pooler URL (port 6543), not the direct connection URL (port 5432).
- [ ] Under a load test simulating 50 concurrent requests across 5 pods, no "too many connections" errors occur.
- [ ] Connection pool utilization is monitored via Supabase Dashboard (target: peak utilization under 80% of the 200-connection Supavisor limit).
- [ ] The Supabase client is configured with `persistSession: false` and `autoRefreshToken: false`.

---

## 14. Backup and Recovery

### FR-DB-090: Multi-Layer Backup Strategy

**Priority**: P0 (Layers 1-2 at launch), P1 (Layers 3-4 within 30 days)

Form submissions represent potential revenue (demo requests, quotes). Data loss is unacceptable.

**Layer 1: Supabase Point-in-Time Recovery (PITR)** -- P0

| Property | Value |
|---|---|
| Included in Plan | Pro ($25/month) |
| Mechanism | Continuous WAL archiving to S3 |
| Recovery Window | Last 7 days |
| RPO | Seconds (WAL-based) |
| RTO | < 5 minutes |
| Use Case | Accidental row deletion, table corruption |

**Layer 2: Supabase Daily Backups** -- P0

| Property | Value |
|---|---|
| Mechanism | Automatic daily snapshots |
| Retention | 7 days (Pro plan) |
| Recovery | Downloadable from Supabase Dashboard |
| Use Case | Full database restore |

**Layer 3: Weekly pg_dump Export** -- P1

A Supabase Edge Function runs weekly to export critical tables and upload the encrypted dump to external storage (DigitalOcean Spaces or S3-compatible bucket).

```bash
# Conceptual -- implemented as a Supabase Edge Function
pg_dump --format=custom \
  --table=form_submissions \
  --table=newsletter_subscribers \
  --table=crm_sync_queue \
  $DATABASE_URL \
  | gpg --encrypt --recipient backup@safetrekr.com \
  > safetrekr-marketing-$(date +%Y%m%d).dump.gpg
```

| Property | Value |
|---|---|
| Schedule | Sunday 02:00 UTC |
| Tables Exported | `form_submissions`, `newsletter_subscribers`, `crm_sync_queue` |
| Encryption | GPG with team key |
| Storage | DigitalOcean Spaces (S3-compatible) |
| Retention | 90 days |
| Use Case | Defense against Supabase region outage |

**Layer 4: Real-Time Email Copy** -- P0

Every form submission sends a notification email via SendGrid. The email serves as a secondary record of the submission. SendGrid retains message history for 30 days.

**Recovery Time Objectives**:

| Scenario | RTO | RPO | Method |
|---|---|---|---|
| Accidental row deletion | < 5 minutes | Seconds | PITR restore |
| Table corruption | < 30 minutes | Seconds | PITR restore |
| Full database loss | < 2 hours | < 24 hours | Daily backup restore |
| Supabase region outage | < 4 hours | < 7 days | pg_dump + schema migration to new project |

**Acceptance Criteria**:
- [ ] PITR is confirmed enabled on the Supabase project (visible in Dashboard > Settings > Database > Backups).
- [ ] A PITR restore test is performed within 30 days of launch: delete a test row, restore via PITR, confirm row is recovered.
- [ ] Weekly pg_dump Edge Function is deployed and confirmed running (verified in Edge Function logs).
- [ ] Encrypted backups are confirmed present in DigitalOcean Spaces.
- [ ] A full restore from pg_dump is tested on a separate Supabase project within 30 days of the weekly export going live.

---

## 15. Monitoring and Observability

### FR-DB-100: Database Monitoring Stack

**Priority**: P0

**Supabase Dashboard Monitoring** (built-in, no configuration):

| Metric | Location | Alert Threshold |
|---|---|---|
| Active connections | Dashboard > Database | > 48 (80% of 60 max) |
| Database size | Dashboard > Database | > 6.4 GB (80% of 8 GB Pro limit) |
| API request count | Dashboard > API | Baseline + 3 standard deviations |
| API error rate | Dashboard > API | > 1% of requests |
| Edge Function invocations | Dashboard > Edge Functions | Failure rate > 5% |
| Disk I/O utilization | Dashboard > Reports | > 80% sustained |

**pg_stat_statements Monitoring**:

```sql
-- Top 10 slowest queries (by mean execution time)
SELECT
  query,
  calls,
  mean_exec_time::NUMERIC(10,2) AS mean_ms,
  total_exec_time::NUMERIC(10,2) AS total_ms,
  rows
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Queries with highest total execution time (impact on system)
SELECT
  query,
  calls,
  total_exec_time::NUMERIC(10,2) AS total_ms,
  mean_exec_time::NUMERIC(10,2) AS mean_ms,
  (total_exec_time / SUM(total_exec_time) OVER () * 100)::NUMERIC(5,2) AS pct_total
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

**Application-Level Monitoring** (Next.js Route Handlers):

```typescript
// Instrument every Supabase call with timing
const start = performance.now();
const { data, error } = await supabase.from('form_submissions').insert({...});
const duration = performance.now() - start;

// Log to structured logging (picked up by DOKS logging stack)
console.log(JSON.stringify({
  event: 'db_query',
  table: 'form_submissions',
  operation: 'insert',
  duration_ms: duration.toFixed(2),
  success: !error,
  error: error?.message,
}));
```

**Health Check Endpoint** (`/api/health`):

```typescript
// Verify Supabase connectivity
const { error } = await supabase.from('rate_limits').select('id').limit(1);
if (error) {
  return Response.json({ status: 'unhealthy', db: 'unreachable' }, { status: 503 });
}
return Response.json({ status: 'healthy', db: 'connected' });
```

**Weekly Review Cadence**:

| Check | Frequency | Owner |
|---|---|---|
| `pg_stat_statements` slow query review | Weekly | Database Architect |
| Connection pool utilization review | Weekly | Database Architect |
| Table size and index bloat review | Monthly | Database Architect |
| Backup restore drill | Monthly | Database Architect |
| Rate limit effectiveness review | Monthly | Database Architect |
| GDPR data retention compliance check | Quarterly | Database Architect + Legal |

**Acceptance Criteria**:
- [ ] `pg_stat_statements` extension is enabled and returning data.
- [ ] The `/api/health` endpoint returns `200` when Supabase is reachable and `503` when it is not.
- [ ] Structured database query logs are emitted from all Route Handlers with timing information.
- [ ] A weekly review cadence is established and documented.
- [ ] Alert thresholds are configured in the Supabase Dashboard.

---

## 16. Environment Variable Reference

All database-related environment variables required across environments:

| Variable | Purpose | Production | Staging | Local |
|---|---|---|---|---|
| `SUPABASE_URL` | Supabase API URL | Prod project URL | Staging project URL | `http://localhost:54321` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side database access | Prod service_role key | Staging key | Local key |
| `SUPABASE_ANON_KEY` | **Not used** (listed for completeness) | Prod anon key | Staging key | Local key |
| `IP_HASH_SALT` | Salt for SHA-256 IP hashing | 64-char random hex | Different 64-char hex | Different 64-char hex |
| `EMAIL_ENCRYPTION_KEY` | AES-256-GCM key for email encryption (P1) | 32-byte hex | Different 32-byte hex | Different 32-byte hex |
| `DATABASE_URL` | Direct Postgres URL (pg_dump backups only) | Supabase direct URL | Staging URL | Local URL |

**Storage**: All variables are stored as Kubernetes Secrets in DOKS. They are never committed to source control.

---

## 17. Migration Sequence and Dependencies

The following migration sequence ensures that all dependencies are satisfied in order:

| Order | Migration File | Contents | Dependencies |
|---|---|---|---|
| 1 | `20260324000000_extensions.sql` | `pgcrypto`, `uuid-ossp`, `pg_stat_statements`, `pg_trgm` | None |
| 2 | `20260324000001_enum_types.sql` | All 5 enum types | Extensions |
| 3 | `20260324000002_tables.sql` | All 6 tables with constraints and comments | Enum types |
| 4 | `20260324000003_indexes.sql` | All indexes for all tables | Tables |
| 5 | `20260324000004_rls_policies.sql` | Enable RLS + service_role policies on all tables | Tables |
| 6 | `20260324000005_functions.sql` | `update_updated_at`, `queue_crm_sync`, `check_rate_limit`, `handle_form_submission` | Tables |
| 7 | `20260324000006_triggers.sql` | `set_updated_at_*` triggers, `trigger_crm_sync` | Functions, Tables |
| 8 | `20260324000007_retention_functions.sql` | All cleanup functions | Tables |
| 9 | `20260324000008_gdpr_functions.sql` | `gdpr_erase_by_email`, `gdpr_export_by_email` | Tables |
| 10 | `20260401000000_email_encryption.sql` | (P1) `email_hash` columns + indexes | Tables in production with data |

**Acceptance Criteria**:
- [ ] Running all migrations in sequence on an empty Supabase project produces a fully functional schema with all tables, indexes, RLS, functions, and triggers.
- [ ] `supabase db reset` on a local instance completes without errors.
- [ ] The migration sequence is documented in this table and matches the files in `supabase/migrations/`.

---

## 18. Non-Functional Requirements

### NFR-DB-001: Query Latency

| Operation | Target Latency (p99) | Measurement |
|---|---|---|
| Rate limit check (`check_rate_limit`) | < 10 ms | `pg_stat_statements` |
| Form submission insert | < 25 ms | Application-level timing |
| Newsletter subscribe | < 15 ms | Application-level timing |
| Analytics event insert | < 10 ms | Application-level timing |
| GDPR erasure (full) | < 5 seconds | Application-level timing |
| GDPR export | < 3 seconds | Application-level timing |

### NFR-DB-002: Capacity

| Metric | Year 1 Estimate | Year 2 Estimate |
|---|---|---|
| Form submissions | 2,000-10,000 | 10,000-50,000 |
| Newsletter subscribers | 500-3,000 | 3,000-15,000 |
| Analytics events | 100,000-500,000 | 500,000-2,000,000 |
| Rate limit entries (peak, before cleanup) | 5,000 | 20,000 |
| Database size | < 500 MB | < 2 GB |

The Supabase Pro plan provides 8 GB of database space. At the Year 2 estimates, the database will use approximately 25% of the available space (well within limits, especially with 90-day analytics retention).

### NFR-DB-003: Availability

| Target | Value |
|---|---|
| Database uptime | 99.9% (Supabase Pro SLA) |
| RPO (Recovery Point Objective) | < 1 minute (PITR) |
| RTO (Recovery Time Objective) | < 30 minutes |

---

## 19. Risks and Mitigations

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Supabase free tier rate limits during early development | Medium | High | Upgrade to Pro before any public traffic |
| R2 | Connection exhaustion during traffic spike | Low | High | Supavisor pooling (FR-DB-080); HPA pod limits |
| R3 | Email encryption key loss | Very Low | Critical | Key stored in multiple Kubernetes Secrets across DOKS node pools; documented recovery procedure |
| R4 | GDPR erasure request misses a table | Low | High | Single `gdpr_erase_by_email` function covers all tables; integration test verifies completeness |
| R5 | Analytics event volume exceeds expectations | Medium | Medium | 90-day retention with auto-cleanup; increase cleanup frequency if needed |
| R6 | Supabase region outage | Very Low | High | Weekly pg_dump to DigitalOcean Spaces; schema migration runbook to new project |
| R7 | Migration breaks production schema | Low | Critical | Staging-first deployment with manual approval gate; PITR as rollback |

---

## 20. Deliverables Checklist

| # | Deliverable | Priority | Status |
|---|---|---|---|
| 1 | Supabase Pro project provisioned in US East | P0 | Not started |
| 2 | All migration files in `supabase/migrations/` | P0 | Not started |
| 3 | RLS enabled and verified on all tables | P0 | Not started |
| 4 | TypeScript types generated and committed | P0 | Not started |
| 5 | Connection pooling configured (Supavisor URL) | P0 | Not started |
| 6 | Rate limit function tested with load simulation | P0 | Not started |
| 7 | GDPR erasure function tested with synthetic data | P0 | Not started |
| 8 | Health check endpoint returning Supabase connectivity | P0 | Not started |
| 9 | Retention cleanup functions scheduled | P0 | Not started |
| 10 | PITR confirmed enabled | P0 | Not started |
| 11 | Weekly pg_dump backup to DigitalOcean Spaces | P1 | Not started |
| 12 | Column-level email encryption migration | P1 | Not started |
| 13 | pg_stat_statements baseline captured | P1 | Not started |
| 14 | PITR restore drill completed | P1 | Not started |
| 15 | A/B test assignment table integrated with frontend | P1 | Not started |

---

*This PRD is the single source of truth for all database architecture decisions on the SafeTrekr marketing site. All schema changes must be proposed as amendments to this document before implementation.*


---

# DevOps & Platform Engineer PRD: SafeTrekr Marketing Site

**Date**: 2026-03-24
**Author**: DevOps Platform Engineer (Persona PRD)
**Project**: SafeTrekr Marketing Website -- Infrastructure & Deployment
**Stack**: Docker (Next.js standalone) / DigitalOcean DOKS / GitHub Actions / Cloudflare DNS / Nginx Ingress / cert-manager / Supabase (external)
**Mode**: Greenfield -- Pre-Implementation Infrastructure Specification
**Binding Constraint**: All decisions align with `plans/TECH-STACK.md`. No Vercel. No serverless. Containers on Kubernetes.

---

## Table of Contents

1. [Infrastructure Overview](#1-infrastructure-overview)
2. [FR-INFRA-001: Dockerfile](#2-fr-infra-001-dockerfile)
3. [FR-INFRA-002: Docker Compose Local Development](#3-fr-infra-002-docker-compose-local-development)
4. [FR-INFRA-003: DigitalOcean DOKS Cluster](#4-fr-infra-003-digitalocean-doks-cluster)
5. [FR-INFRA-004: DigitalOcean Container Registry](#5-fr-infra-004-digitalocean-container-registry)
6. [FR-INFRA-005: Kubernetes Manifests](#6-fr-infra-005-kubernetes-manifests)
7. [FR-INFRA-006: Nginx Ingress Controller & SSL](#7-fr-infra-006-nginx-ingress-controller--ssl)
8. [FR-INFRA-007: GitHub Actions CI/CD Pipeline](#8-fr-infra-007-github-actions-cicd-pipeline)
9. [FR-INFRA-008: Environment Management](#9-fr-infra-008-environment-management)
10. [FR-INFRA-009: Preview Deployments](#10-fr-infra-009-preview-deployments)
11. [FR-INFRA-010: DNS & CDN Configuration](#11-fr-infra-010-dns--cdn-configuration)
12. [FR-INFRA-011: Monitoring & Alerting](#12-fr-infra-011-monitoring--alerting)
13. [FR-INFRA-012: Centralized Logging](#13-fr-infra-012-centralized-logging)
14. [FR-INFRA-013: Security Hardening](#14-fr-infra-013-security-hardening)
15. [FR-INFRA-014: Backup & Disaster Recovery](#15-fr-infra-014-backup--disaster-recovery)
16. [FR-INFRA-015: Cost Estimation](#16-fr-infra-015-cost-estimation)
17. [Infrastructure Directory Structure](#17-infrastructure-directory-structure)
18. [Rollback Strategy](#18-rollback-strategy)
19. [Operational Runbooks](#19-operational-runbooks)
20. [Risk Register](#20-risk-register)

---

## 1. Infrastructure Overview

### 1.1 Architecture Context

The CTA (Chief Technology Architect) analysis was written assuming Vercel deployment. This PRD replaces the entire infrastructure layer with a container-based Kubernetes deployment on DigitalOcean. The application layer (Next.js 15, React 19, Tailwind CSS 4, all components) remains identical. Only the deployment target, build pipeline, SSL termination, CDN strategy, scaling mechanism, and observability stack change.

### 1.2 High-Level Deployment Architecture

```
Developer Push --> GitHub Actions CI/CD
  --> Lint + Type Check + Test + Accessibility Check
  --> Docker Build (multi-stage, Next.js standalone output)
  --> Push to DigitalOcean Container Registry (DOCR)
  --> kubectl apply to DOKS cluster
  --> Nginx Ingress Controller (SSL via cert-manager + Let's Encrypt)
  --> Cloudflare DNS (proxy mode for DDoS + CDN)
  --> End Users
```

### 1.3 Key Differences from Vercel Deployment

| Concern | Vercel (CTA Analysis) | DigitalOcean DOKS (This PRD) |
|---------|----------------------|------------------------------|
| SSG/ISR | Native Vercel ISR | Next.js standalone server with file-system ISR cache |
| Edge Functions | Vercel Edge Runtime | Not available; all middleware runs in Node.js |
| Image Optimization | Vercel built-in loader | `sharp` package in Docker image (self-hosted next/image) |
| Preview Deploys | Automatic per-PR | Custom: namespace-per-PR via GitHub Actions |
| SSL Certificates | Automatic (Vercel) | cert-manager + Let's Encrypt ClusterIssuer |
| Scaling | Automatic (Vercel) | HPA based on CPU/memory + custom metrics |
| CDN | Vercel Edge Network (200+ PoPs) | Cloudflare proxy (300+ PoPs) + DO Spaces for static assets |
| Rollback | Instant (Vercel dashboard) | `kubectl rollout undo` or redeploy previous image tag |
| Cost Model | Usage-based | Fixed monthly (nodes + registry + bandwidth) |
| OG Image Generation | Vercel `@vercel/og` (Edge) | `@vercel/og` with Node.js adapter or Satori + sharp |
| Monitoring | Vercel Analytics | Prometheus + Grafana or DigitalOcean Monitoring |
| Logs | Vercel Log Drains | Loki + Fluent Bit or DO log forwarding |

### 1.4 Non-Negotiable Constraints

1. The Docker image MUST use Next.js `output: 'standalone'` for minimal container size.
2. The `sharp` package MUST be installed for self-hosted image optimization.
3. All secrets MUST be stored in Kubernetes Secrets (not ConfigMaps, not hardcoded).
4. SSL MUST be automated via cert-manager -- no manual certificate management.
5. The CI pipeline MUST block merge on lint, type-check, test, accessibility, and bundle size failures.
6. Production deployments MUST be zero-downtime (rolling update strategy).
7. Every environment (dev, staging, production) MUST use the same Docker image with environment-specific configuration injected at runtime.
8. The Supabase database is externally managed -- this PRD does not provision or manage the database, only configures network access to it.

---

## 2. FR-INFRA-001: Dockerfile

**Priority**: P0
**Effort**: 1 day
**Description**: Multi-stage Docker build optimized for Next.js standalone output with sharp for image optimization.

### 2.1 Dockerfile Specification

```dockerfile
# ============================================================
# Stage 1: Install dependencies
# ============================================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package manager files
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# ============================================================
# Stage 2: Build the application
# ============================================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects anonymous telemetry -- disable in CI
ENV NEXT_TELEMETRY_DISABLED=1

# Build arguments for build-time environment variables
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_PLAUSIBLE_DOMAIN
ARG NEXT_PUBLIC_SITE_URL

ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_PLAUSIBLE_DOMAIN=$NEXT_PUBLIC_PLAUSIBLE_DOMAIN
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN corepack enable pnpm && pnpm build

# ============================================================
# Stage 3: Production runner
# ============================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### 2.2 next.config.ts Required Settings

```typescript
const nextConfig: NextConfig = {
  output: 'standalone', // CRITICAL: enables standalone server output for Docker

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // sharp is required in the Docker image for self-hosted optimization
    // Next.js auto-detects sharp when installed
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.maptiler.com',
      },
    ],
  },

  // ... rest of config from CTA analysis
}
```

### 2.3 .dockerignore

```
node_modules
.next
.git
.github
*.md
docker-compose*.yml
.env*
.vscode
coverage
.turbo
```

### 2.4 Image Size Budget

| Metric | Target | Enforcement |
|--------|--------|-------------|
| Final image size | < 200 MB | CI check via `docker inspect` |
| Number of layers | < 15 | Dockerfile lint (`hadolint`) |
| Base image | `node:20-alpine` | Pinned in Dockerfile |
| Non-root user | Required | `USER nextjs` directive |

### 2.5 Acceptance Criteria

- [ ] `docker build` succeeds with zero warnings.
- [ ] Final image runs `node server.js` as non-root user (UID 1001).
- [ ] `next/image` optimization works (serve an optimized image via `/_next/image`).
- [ ] ISR pages regenerate correctly from the standalone server.
- [ ] Health check endpoint (`/api/health`) returns 200.
- [ ] Image size is under 200 MB.
- [ ] `hadolint` passes with zero errors.

---

## 3. FR-INFRA-002: Docker Compose Local Development

**Priority**: P0
**Effort**: 0.5 days
**Description**: Local development environment that mirrors production topology without requiring a Kubernetes cluster.

### 3.1 docker-compose.yml

```yaml
version: "3.9"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: runner
      args:
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: ${NEXT_PUBLIC_TURNSTILE_SITE_KEY:-1x00000000000000000000AA}
        NEXT_PUBLIC_PLAUSIBLE_DOMAIN: ""
        NEXT_PUBLIC_SITE_URL: http://localhost:3000
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SENDGRID_API_KEY=${SENDGRID_API_KEY:-SG.test}
      - TURNSTILE_SECRET_KEY=${TURNSTILE_SECRET_KEY:-1x0000000000000000000000000000000AA}
      - NEXT_PUBLIC_TURNSTILE_SITE_KEY=${NEXT_PUBLIC_TURNSTILE_SITE_KEY:-1x00000000000000000000AA}
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
    restart: unless-stopped

  # Optional: Nginx reverse proxy to test production-like routing
  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./infra/nginx/local.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      app:
        condition: service_healthy
    profiles:
      - with-nginx
```

### 3.2 docker-compose.dev.yml (Development Override)

```yaml
version: "3.9"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    command: pnpm dev
```

### 3.3 Dockerfile.dev (Hot Reload)

```dockerfile
FROM node:20-alpine
WORKDIR /app
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]
```

### 3.4 Acceptance Criteria

- [ ] `docker compose up` starts the production image and responds on port 3000.
- [ ] `docker compose -f docker-compose.yml -f docker-compose.dev.yml up` starts dev mode with hot reload.
- [ ] `docker compose --profile with-nginx up` starts Nginx reverse proxy on port 8080.
- [ ] Health check passes within 15 seconds of container start.
- [ ] Environment variables are injected correctly (verified via `/api/health`).

---

## 4. FR-INFRA-003: DigitalOcean DOKS Cluster

**Priority**: P0
**Effort**: 0.5 days
**Description**: Provision a managed Kubernetes cluster on DigitalOcean optimized for a marketing site workload (low CPU, moderate memory, high network throughput for static asset serving).

### 4.1 Cluster Specification

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Cluster name | `safetrekr-marketing` | Clear naming convention |
| Region | `nyc1` (New York) | Co-locate with Supabase US East |
| Kubernetes version | 1.31.x (latest stable) | LTS support from DO |
| VPC | Default VPC in nyc1 | Network isolation |
| HA Control Plane | Enabled ($0 additional) | Production reliability |

### 4.2 Node Pool Configuration

| Pool | Purpose | Node Size | Count | Autoscale | Min | Max |
|------|---------|-----------|-------|-----------|-----|-----|
| `general` | Application workloads | `s-2vcpu-4gb` ($24/mo each) | 2 | Yes | 2 | 4 |

**Why 2 nodes minimum**: Zero-downtime rolling updates require at least 2 nodes. During a deployment, pods on the old version continue serving while new pods start on the second node. A single-node cluster would experience downtime during rollout.

**Why `s-2vcpu-4gb`**: Next.js standalone server with sharp image optimization is memory-intensive during image processing. 4 GB RAM per node provides headroom for 2-3 pods per node plus system workloads (Ingress controller, cert-manager, monitoring agents).

### 4.3 Autoscaling Policy

```yaml
# Node pool autoscaling triggers
Scale Up:
  - Pending pods that cannot be scheduled for > 30 seconds
  - Node CPU utilization > 70% for 5 minutes across the pool
  - Node memory utilization > 80% for 5 minutes across the pool

Scale Down:
  - Node utilization < 35% for 10 minutes
  - No pods with local storage or PodDisruptionBudget violations
  - Minimum 2 nodes maintained at all times
```

### 4.4 Cluster Add-ons (Installed at Provisioning)

| Add-on | Purpose | Method |
|--------|---------|--------|
| Nginx Ingress Controller | HTTP routing + SSL termination | DO 1-Click or Helm |
| cert-manager | Automated Let's Encrypt certificates | Helm |
| metrics-server | HPA resource metrics | DO 1-Click |

### 4.5 Provisioning Commands

```bash
# Create the cluster
doctl kubernetes cluster create safetrekr-marketing \
  --region nyc1 \
  --version 1.31.1-do.0 \
  --node-pool "name=general;size=s-2vcpu-4gb;count=2;auto-scale=true;min-nodes=2;max-nodes=4" \
  --ha \
  --tag safetrekr,marketing,production

# Save kubeconfig
doctl kubernetes cluster kubeconfig save safetrekr-marketing

# Verify cluster
kubectl get nodes
```

### 4.6 Namespace Strategy

| Namespace | Purpose |
|-----------|---------|
| `production` | Live site serving `safetrekr.com` |
| `staging` | Pre-production validation at `staging.safetrekr.com` |
| `preview` | Ephemeral PR preview deployments |
| `ingress-nginx` | Nginx Ingress Controller (isolated) |
| `cert-manager` | Certificate management (isolated) |
| `monitoring` | Prometheus + Grafana (isolated) |

```bash
kubectl create namespace production
kubectl create namespace staging
kubectl create namespace preview
```

### 4.7 Acceptance Criteria

- [ ] `kubectl get nodes` returns 2 ready nodes.
- [ ] `kubectl cluster-info` shows a healthy control plane.
- [ ] All namespaces created and verified.
- [ ] Autoscaling triggers correctly (test with a resource-heavy pod).
- [ ] Cluster is tagged with `safetrekr`, `marketing`, `production`.
- [ ] `doctl kubernetes cluster kubeconfig save` works from CI runner.

---

## 5. FR-INFRA-004: DigitalOcean Container Registry

**Priority**: P0
**Effort**: 0.5 days
**Description**: Private container registry for storing Docker images used by the DOKS cluster.

### 5.1 Registry Configuration

| Parameter | Value |
|-----------|-------|
| Registry name | `safetrekr` |
| Plan | Starter ($5/mo, 5 GB storage) |
| Region | Auto (closest to cluster) |
| Image repository | `safetrekr/marketing` |

### 5.2 Image Tagging Strategy

| Tag Pattern | Purpose | Example |
|-------------|---------|---------|
| `sha-<short_sha>` | Immutable per-commit tag | `sha-a1b2c3d` |
| `latest` | Most recent production build | Rolling |
| `staging` | Current staging build | Rolling |
| `pr-<number>` | Preview deployment image | `pr-42` |

Every production deployment uses the immutable `sha-<short_sha>` tag, never `latest`. The `latest` tag exists only as a convenience for local testing.

### 5.3 Registry Cleanup Policy

```bash
# Retain last 30 images; delete older ones
# Run weekly via GitHub Actions scheduled workflow
doctl registry garbage-collection start safetrekr --force
```

Automated cleanup via GitHub Actions cron job (weekly, Sunday 3 AM UTC):
- Keep: All images tagged with `sha-*` from the last 30 days.
- Keep: `latest` and `staging` tags.
- Delete: `pr-*` tags older than 7 days.
- Delete: Untagged manifests.

### 5.4 DOKS Integration

```bash
# Grant the DOKS cluster access to the registry
doctl registry kubernetes-manifest | kubectl apply -f -

# Verify image pull works
kubectl run test --image=registry.digitalocean.com/safetrekr/marketing:latest --rm -it --restart=Never -- echo "pull works"
```

### 5.5 Acceptance Criteria

- [ ] `docker push registry.digitalocean.com/safetrekr/marketing:test` succeeds.
- [ ] DOKS cluster can pull images without explicit `imagePullSecrets`.
- [ ] Garbage collection runs without errors.
- [ ] Image tags follow the defined strategy.

---

## 6. FR-INFRA-005: Kubernetes Manifests

**Priority**: P0
**Effort**: 2 days
**Description**: Complete set of Kubernetes resource definitions for deploying the marketing site.

### 6.1 Deployment

```yaml
# infra/k8s/base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: safetrekr-marketing
  labels:
    app: safetrekr-marketing
    team: marketing
    tier: frontend
spec:
  replicas: 2
  revisionHistoryLimit: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: safetrekr-marketing
  template:
    metadata:
      labels:
        app: safetrekr-marketing
        team: marketing
        tier: frontend
    spec:
      serviceAccountName: safetrekr-marketing
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        runAsGroup: 1001
        fsGroup: 1001
        seccompProfile:
          type: RuntimeDefault
      containers:
        - name: nextjs
          image: registry.digitalocean.com/safetrekr/marketing:IMAGE_TAG
          ports:
            - containerPort: 3000
              protocol: TCP
              name: http
          envFrom:
            - configMapRef:
                name: safetrekr-marketing-config
            - secretRef:
                name: safetrekr-marketing-secrets
          resources:
            requests:
              cpu: 100m
              memory: 256Mi
            limits:
              cpu: 500m
              memory: 512Mi
          livenessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 15
            periodSeconds: 30
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
            timeoutSeconds: 3
            failureThreshold: 3
          startupProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
            failureThreshold: 12
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: false  # Next.js needs to write ISR cache
            capabilities:
              drop:
                - ALL
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              app: safetrekr-marketing
```

### 6.2 Service

```yaml
# infra/k8s/base/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: safetrekr-marketing
  labels:
    app: safetrekr-marketing
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: 3000
      protocol: TCP
      name: http
  selector:
    app: safetrekr-marketing
```

### 6.3 Ingress

```yaml
# infra/k8s/overlays/production/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: safetrekr-marketing
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-production
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
    nginx.ingress.kubernetes.io/configuration-snippet: |
      more_set_headers "X-Frame-Options: DENY";
      more_set_headers "X-Content-Type-Options: nosniff";
      more_set_headers "Referrer-Policy: strict-origin-when-cross-origin";
      more_set_headers "Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()";
    # Enable gzip compression at Ingress level
    nginx.ingress.kubernetes.io/enable-gzip: "true"
    nginx.ingress.kubernetes.io/gzip-types: "text/html text/css application/javascript application/json image/svg+xml"
    # Proxy timeouts
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "10"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "30"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "30"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - safetrekr.com
        - www.safetrekr.com
      secretName: safetrekr-marketing-tls
  rules:
    - host: safetrekr.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: safetrekr-marketing
                port:
                  number: 80
    - host: www.safetrekr.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: safetrekr-marketing
                port:
                  number: 80
```

### 6.4 Horizontal Pod Autoscaler

```yaml
# infra/k8s/base/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: safetrekr-marketing
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: safetrekr-marketing
  minReplicas: 2
  maxReplicas: 6
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Pods
          value: 2
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 25
          periodSeconds: 120
```

### 6.5 ConfigMap

```yaml
# infra/k8s/overlays/production/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: safetrekr-marketing-config
data:
  NODE_ENV: "production"
  NEXT_PUBLIC_SITE_URL: "https://safetrekr.com"
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: "safetrekr.com"
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "<production-site-key>"
  PORT: "3000"
  HOSTNAME: "0.0.0.0"
```

### 6.6 Secret (Template -- Values Injected by CI)

```yaml
# infra/k8s/base/secret.yaml (template -- never commit actual values)
apiVersion: v1
kind: Secret
metadata:
  name: safetrekr-marketing-secrets
type: Opaque
stringData:
  SUPABASE_URL: "<injected-by-ci>"
  SUPABASE_ANON_KEY: "<injected-by-ci>"
  SUPABASE_SERVICE_ROLE_KEY: "<injected-by-ci>"
  SENDGRID_API_KEY: "<injected-by-ci>"
  TURNSTILE_SECRET_KEY: "<injected-by-ci>"
  SENTRY_DSN: "<injected-by-ci>"
```

### 6.7 PodDisruptionBudget

```yaml
# infra/k8s/base/pdb.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: safetrekr-marketing
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: safetrekr-marketing
```

### 6.8 ServiceAccount

```yaml
# infra/k8s/base/serviceaccount.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: safetrekr-marketing
  labels:
    app: safetrekr-marketing
automountServiceAccountToken: false
```

### 6.9 Acceptance Criteria

- [ ] `kubectl apply -k infra/k8s/overlays/production` succeeds.
- [ ] Deployment creates 2 pods that pass readiness checks within 30 seconds.
- [ ] Rolling update replaces all pods with zero downtime (tested with `wrk` during rollout).
- [ ] HPA scales to 3 pods under load (tested with `k6` or `hey`).
- [ ] PodDisruptionBudget prevents voluntary eviction of all pods simultaneously.
- [ ] Pods spread across both nodes (topologySpreadConstraints).
- [ ] All containers run as non-root (verified with `kubectl exec -- id`).

---

## 7. FR-INFRA-006: Nginx Ingress Controller & SSL

**Priority**: P0
**Effort**: 1 day
**Description**: HTTP routing, SSL termination, and TLS certificate automation.

### 7.1 Nginx Ingress Installation

```bash
# Install via Helm (preferred over DO 1-Click for version control)
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.replicaCount=2 \
  --set controller.resources.requests.cpu=100m \
  --set controller.resources.requests.memory=128Mi \
  --set controller.resources.limits.cpu=200m \
  --set controller.resources.limits.memory=256Mi \
  --set controller.service.type=LoadBalancer \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/do-loadbalancer-name"="safetrekr-marketing-lb" \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/do-loadbalancer-size-slug"="lb-small" \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/do-loadbalancer-protocol"="http" \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/do-loadbalancer-tls-ports"="" \
  --set controller.config.use-forwarded-headers="true" \
  --set controller.config.compute-full-forwarded-for="true" \
  --set controller.config.use-proxy-protocol="false" \
  --set controller.config.enable-gzip="true" \
  --set controller.config.gzip-level="5" \
  --set controller.config.gzip-types="application/javascript application/json text/css text/html text/plain image/svg+xml"
```

**Why SSL termination at Ingress, not at Cloudflare**: Cloudflare is configured in "Full (Strict)" mode, meaning Cloudflare terminates the visitor's TLS connection and re-encrypts to the origin. The Ingress controller holds a valid Let's Encrypt certificate so Cloudflare can verify the origin. This is the recommended setup for maximum security.

### 7.2 cert-manager Installation

```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update

helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set crds.enabled=true \
  --set resources.requests.cpu=50m \
  --set resources.requests.memory=64Mi
```

### 7.3 ClusterIssuer (Let's Encrypt)

```yaml
# infra/k8s/cluster/clusterissuer-production.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-production
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: devops@safetrekr.com
    privateKeySecretRef:
      name: letsencrypt-production-key
    solvers:
      - http01:
          ingress:
            class: nginx

---
# Staging issuer for testing (higher rate limits)
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: devops@safetrekr.com
    privateKeySecretRef:
      name: letsencrypt-staging-key
    solvers:
      - http01:
          ingress:
            class: nginx
```

### 7.4 Load Balancer Configuration

The Nginx Ingress controller creates a DigitalOcean Load Balancer automatically. Configuration:

| Parameter | Value |
|-----------|-------|
| Type | `lb-small` ($12/mo) |
| Algorithm | Round Robin |
| Health check path | `/healthz` (Ingress controller) |
| Health check interval | 10 seconds |
| Sticky sessions | Disabled (stateless app) |
| Proxy protocol | Disabled (Cloudflare handles it) |

### 7.5 Nginx Custom Configuration

```yaml
# Additional Nginx ConfigMap settings
apiVersion: v1
kind: ConfigMap
metadata:
  name: ingress-nginx-controller
  namespace: ingress-nginx
data:
  # Performance
  worker-processes: "auto"
  max-worker-connections: "65536"
  keep-alive: "75"
  keep-alive-requests: "1000"

  # Security
  ssl-protocols: "TLSv1.2 TLSv1.3"
  ssl-ciphers: "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384"
  ssl-prefer-server-ciphers: "true"
  hsts: "true"
  hsts-max-age: "31536000"
  hsts-include-subdomains: "true"
  hsts-preload: "true"

  # Compression
  enable-brotli: "true"
  brotli-level: "6"
  brotli-types: "text/html text/css application/javascript application/json image/svg+xml"

  # Proxy
  proxy-buffer-size: "16k"
  proxy-buffers-number: "4"
  client-max-body-size: "10m"

  # Rate limiting (global default)
  limit-req-status-code: "429"

  # Logging
  log-format-upstream: '$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" $request_length $request_time [$proxy_upstream_name] [$proxy_alternative_upstream_name] $upstream_addr $upstream_response_length $upstream_response_time $upstream_status $req_id'
```

### 7.6 Acceptance Criteria

- [ ] `kubectl get svc -n ingress-nginx` shows an EXTERNAL-IP assigned by DO Load Balancer.
- [ ] HTTPS request to `safetrekr.com` returns a valid Let's Encrypt certificate.
- [ ] HTTP to HTTPS redirect works (301 status code).
- [ ] `www.safetrekr.com` redirects to `safetrekr.com` (301).
- [ ] Brotli/gzip compression is active (verified via `curl -H "Accept-Encoding: br"`).
- [ ] Rate limiting returns 429 when exceeded.
- [ ] cert-manager auto-renews certificates before expiry (test with staging issuer).

---

## 8. FR-INFRA-007: GitHub Actions CI/CD Pipeline

**Priority**: P0
**Effort**: 2 days
**Description**: Complete CI/CD pipeline from code push to production deployment.

### 8.1 Pipeline Overview

```
PR opened/updated:
  --> ci.yml: Lint, Type Check, Test, Accessibility, Bundle Size, Lighthouse
  --> preview.yml: Build Docker image, deploy to preview namespace

Merge to staging:
  --> deploy-staging.yml: Build, push, deploy to staging namespace

Merge to main:
  --> deploy-production.yml: Build, push, deploy to production namespace
  --> post-deploy.yml: Smoke tests, Sentry release, health verification

Scheduled:
  --> cleanup.yml: Weekly registry garbage collection + preview namespace cleanup
```

### 8.2 CI Workflow (ci.yml)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main, staging]
  push:
    branches: [main, staging]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint-and-typecheck:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run lint
      - run: pnpm run typecheck

  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run test -- --coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  accessibility:
    name: Accessibility Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run test:a11y

  bundle-analysis:
    name: Bundle Size Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA"
          NEXT_PUBLIC_PLAUSIBLE_DOMAIN: ""
          NEXT_PUBLIC_SITE_URL: "https://safetrekr.com"
      - uses: siddharthkp/bundlewatch-gh-action@v1
        with:
          bundlewatch-github-token: ${{ secrets.GITHUB_TOKEN }}

  docker-build-test:
    name: Docker Build Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: false
          load: true
          tags: safetrekr-marketing:test
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
            NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
            NEXT_PUBLIC_SITE_URL=https://safetrekr.com
      - name: Verify image size
        run: |
          SIZE=$(docker inspect safetrekr-marketing:test --format='{{.Size}}')
          MAX_SIZE=209715200  # 200 MB
          if [ "$SIZE" -gt "$MAX_SIZE" ]; then
            echo "Image size ${SIZE} exceeds maximum ${MAX_SIZE}"
            exit 1
          fi
      - name: Test container starts
        run: |
          docker run -d --name test-container -p 3000:3000 safetrekr-marketing:test
          sleep 10
          curl -f http://localhost:3000/api/health || exit 1
          docker stop test-container
```

### 8.3 Deploy Production Workflow (deploy-production.yml)

```yaml
# .github/workflows/deploy-production.yml
name: Deploy Production

on:
  push:
    branches: [main]

concurrency:
  group: deploy-production
  cancel-in-progress: false  # Never cancel a production deployment mid-flight

env:
  REGISTRY: registry.digitalocean.com/safetrekr
  IMAGE: marketing
  CLUSTER: safetrekr-marketing

jobs:
  build-and-push:
    name: Build & Push Image
    runs-on: ubuntu-latest
    outputs:
      image_tag: ${{ steps.meta.outputs.tags }}
      short_sha: ${{ steps.sha.outputs.short_sha }}
    steps:
      - uses: actions/checkout@v4

      - name: Get short SHA
        id: sha
        run: echo "short_sha=$(git rev-parse --short HEAD)" >> $GITHUB_OUTPUT

      - uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

      - name: Log in to DOCR
        run: doctl registry login --expiry-seconds 600

      - uses: docker/setup-buildx-action@v3

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE }}:sha-${{ steps.sha.outputs.short_sha }}
            ${{ env.REGISTRY }}/${{ env.IMAGE }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            NEXT_PUBLIC_TURNSTILE_SITE_KEY=${{ secrets.PROD_TURNSTILE_SITE_KEY }}
            NEXT_PUBLIC_PLAUSIBLE_DOMAIN=safetrekr.com
            NEXT_PUBLIC_SITE_URL=https://safetrekr.com

  deploy:
    name: Deploy to Production
    needs: build-and-push
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://safetrekr.com
    steps:
      - uses: actions/checkout@v4

      - uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

      - name: Save kubeconfig
        run: doctl kubernetes cluster kubeconfig save ${{ env.CLUSTER }}

      - name: Update secrets
        run: |
          kubectl create secret generic safetrekr-marketing-secrets \
            --namespace production \
            --from-literal=SUPABASE_URL=${{ secrets.PROD_SUPABASE_URL }} \
            --from-literal=SUPABASE_ANON_KEY=${{ secrets.PROD_SUPABASE_ANON_KEY }} \
            --from-literal=SUPABASE_SERVICE_ROLE_KEY=${{ secrets.PROD_SUPABASE_SERVICE_ROLE_KEY }} \
            --from-literal=SENDGRID_API_KEY=${{ secrets.PROD_SENDGRID_API_KEY }} \
            --from-literal=TURNSTILE_SECRET_KEY=${{ secrets.PROD_TURNSTILE_SECRET_KEY }} \
            --from-literal=SENTRY_DSN=${{ secrets.PROD_SENTRY_DSN }} \
            --dry-run=client -o yaml | kubectl apply -f -

      - name: Deploy to production
        run: |
          cd infra/k8s
          # Set the image tag
          kustomize edit set image \
            registry.digitalocean.com/safetrekr/marketing=registry.digitalocean.com/safetrekr/marketing:sha-${{ needs.build-and-push.outputs.short_sha }}
          kustomize build overlays/production | kubectl apply -f -

      - name: Wait for rollout
        run: |
          kubectl rollout status deployment/safetrekr-marketing \
            --namespace production \
            --timeout=300s

      - name: Verify health
        run: |
          # Wait for pods to be ready
          kubectl wait --for=condition=ready pod \
            -l app=safetrekr-marketing \
            --namespace production \
            --timeout=120s
          # Port-forward and test health endpoint
          kubectl port-forward svc/safetrekr-marketing 8080:80 -n production &
          sleep 5
          HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/health)
          if [ "$HTTP_CODE" != "200" ]; then
            echo "Health check failed with status $HTTP_CODE"
            kubectl rollout undo deployment/safetrekr-marketing -n production
            exit 1
          fi

      - name: Create Sentry release
        if: success()
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
        run: |
          npx @sentry/cli releases new sha-${{ needs.build-and-push.outputs.short_sha }}
          npx @sentry/cli releases set-commits sha-${{ needs.build-and-push.outputs.short_sha }} --auto
          npx @sentry/cli releases finalize sha-${{ needs.build-and-push.outputs.short_sha }}
          npx @sentry/cli releases deploys sha-${{ needs.build-and-push.outputs.short_sha }} new -e production

  notify:
    name: Notify
    needs: [build-and-push, deploy]
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Notify on failure
        if: needs.deploy.result == 'failure'
        run: |
          echo "Production deployment failed. Manual intervention required."
          # Add Slack/PagerDuty webhook notification here
```

### 8.4 Deploy Staging Workflow (deploy-staging.yml)

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy Staging

on:
  push:
    branches: [staging]

env:
  REGISTRY: registry.digitalocean.com/safetrekr
  IMAGE: marketing
  CLUSTER: safetrekr-marketing

jobs:
  build-and-deploy:
    name: Build & Deploy to Staging
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.safetrekr.com
    steps:
      - uses: actions/checkout@v4

      - name: Get short SHA
        id: sha
        run: echo "short_sha=$(git rev-parse --short HEAD)" >> $GITHUB_OUTPUT

      - uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

      - name: Log in to DOCR
        run: doctl registry login --expiry-seconds 600

      - uses: docker/setup-buildx-action@v3

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE }}:sha-${{ steps.sha.outputs.short_sha }}
            ${{ env.REGISTRY }}/${{ env.IMAGE }}:staging
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            NEXT_PUBLIC_TURNSTILE_SITE_KEY=${{ secrets.STAGING_TURNSTILE_SITE_KEY }}
            NEXT_PUBLIC_PLAUSIBLE_DOMAIN=staging.safetrekr.com
            NEXT_PUBLIC_SITE_URL=https://staging.safetrekr.com

      - name: Save kubeconfig
        run: doctl kubernetes cluster kubeconfig save ${{ env.CLUSTER }}

      - name: Update secrets
        run: |
          kubectl create secret generic safetrekr-marketing-secrets \
            --namespace staging \
            --from-literal=SUPABASE_URL=${{ secrets.STAGING_SUPABASE_URL }} \
            --from-literal=SUPABASE_ANON_KEY=${{ secrets.STAGING_SUPABASE_ANON_KEY }} \
            --from-literal=SUPABASE_SERVICE_ROLE_KEY=${{ secrets.STAGING_SUPABASE_SERVICE_ROLE_KEY }} \
            --from-literal=SENDGRID_API_KEY=${{ secrets.STAGING_SENDGRID_API_KEY }} \
            --from-literal=TURNSTILE_SECRET_KEY=${{ secrets.STAGING_TURNSTILE_SECRET_KEY }} \
            --from-literal=SENTRY_DSN=${{ secrets.STAGING_SENTRY_DSN }} \
            --dry-run=client -o yaml | kubectl apply -f -

      - name: Deploy to staging
        run: |
          cd infra/k8s
          kustomize edit set image \
            registry.digitalocean.com/safetrekr/marketing=registry.digitalocean.com/safetrekr/marketing:sha-${{ steps.sha.outputs.short_sha }}
          kustomize build overlays/staging | kubectl apply -f -

      - name: Wait for rollout
        run: |
          kubectl rollout status deployment/safetrekr-marketing \
            --namespace staging \
            --timeout=300s
```

### 8.5 Required GitHub Secrets

| Secret | Environment | Description |
|--------|-------------|-------------|
| `DIGITALOCEAN_ACCESS_TOKEN` | All | DO API token for doctl + DOCR |
| `PROD_SUPABASE_URL` | production | Production Supabase URL |
| `PROD_SUPABASE_ANON_KEY` | production | Production Supabase anon key |
| `PROD_SUPABASE_SERVICE_ROLE_KEY` | production | Production Supabase service role key |
| `PROD_SENDGRID_API_KEY` | production | Production SendGrid API key |
| `PROD_TURNSTILE_SITE_KEY` | production | Production Cloudflare Turnstile site key |
| `PROD_TURNSTILE_SECRET_KEY` | production | Production Cloudflare Turnstile secret key |
| `PROD_SENTRY_DSN` | production | Production Sentry DSN |
| `STAGING_SUPABASE_URL` | staging | Staging Supabase URL |
| `STAGING_SUPABASE_ANON_KEY` | staging | Staging Supabase anon key |
| `STAGING_SUPABASE_SERVICE_ROLE_KEY` | staging | Staging Supabase service role key |
| `STAGING_SENDGRID_API_KEY` | staging | Staging/sandbox SendGrid key |
| `STAGING_TURNSTILE_SITE_KEY` | staging | Staging Turnstile test key |
| `STAGING_TURNSTILE_SECRET_KEY` | staging | Staging Turnstile test secret |
| `STAGING_SENTRY_DSN` | staging | Staging Sentry DSN |
| `SENTRY_AUTH_TOKEN` | All | Sentry release API token |

### 8.6 Acceptance Criteria

- [ ] PR triggers CI checks; all must pass before merge is allowed.
- [ ] Push to `staging` branch triggers staging deployment within 5 minutes.
- [ ] Push to `main` branch triggers production deployment within 5 minutes.
- [ ] Failed health check during production deploy triggers automatic rollback.
- [ ] Sentry release is created on successful production deploy.
- [ ] Docker layer caching reduces build time to under 3 minutes on subsequent builds.
- [ ] Concurrent production deployments are prevented (concurrency group).

---

## 9. FR-INFRA-008: Environment Management

**Priority**: P0
**Effort**: 1 day
**Description**: Three-environment strategy with identical Docker images and environment-specific configuration.

### 9.1 Environment Matrix

| Environment | Namespace | Branch | URL | Replicas | Supabase Project |
|-------------|-----------|--------|-----|----------|------------------|
| Production | `production` | `main` | `safetrekr.com` | 2-6 (HPA) | Production |
| Staging | `staging` | `staging` | `staging.safetrekr.com` | 1 | Staging |
| Preview | `preview` | PR branches | `pr-<num>.preview.safetrekr.com` | 1 | Staging |
| Local | N/A | N/A | `localhost:3000` | 1 | Local or Staging |

### 9.2 Environment Variable Matrix

| Variable | Production | Staging | Preview | Local |
|----------|-----------|---------|---------|-------|
| `NODE_ENV` | `production` | `production` | `production` | `development` |
| `NEXT_PUBLIC_SITE_URL` | `https://safetrekr.com` | `https://staging.safetrekr.com` | `https://pr-<num>.preview.safetrekr.com` | `http://localhost:3000` |
| `SUPABASE_URL` | Prod URL | Staging URL | Staging URL | Staging URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Prod key | Staging key | Staging key | Staging key |
| `SENDGRID_API_KEY` | Prod key | Sandbox key | Sandbox key | Sandbox key |
| `TURNSTILE_SECRET_KEY` | Prod key | Test key `1x...AA` | Test key | Test key |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Prod key | Test key `1x...AA` | Test key | Test key |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `safetrekr.com` | `staging.safetrekr.com` | (empty) | (empty) |
| `SENTRY_DSN` | Prod DSN | Staging DSN | Staging DSN | (empty) |

### 9.3 Kustomize Overlay Strategy

```
infra/k8s/
  base/
    kustomization.yaml       # Shared resources
    deployment.yaml
    service.yaml
    hpa.yaml
    pdb.yaml
    serviceaccount.yaml
  overlays/
    production/
      kustomization.yaml     # Production-specific patches
      configmap.yaml
      ingress.yaml
      hpa-patch.yaml         # minReplicas: 2, maxReplicas: 6
    staging/
      kustomization.yaml
      configmap.yaml
      ingress.yaml
      hpa-patch.yaml         # minReplicas: 1, maxReplicas: 2
    preview/
      kustomization.yaml
      configmap.yaml
      ingress-template.yaml  # Templated hostname
```

### 9.4 Acceptance Criteria

- [ ] Production and staging use separate Supabase projects (verified via health endpoint).
- [ ] Environment variables are correctly injected in each environment.
- [ ] Staging is accessible only at `staging.safetrekr.com`.
- [ ] Preview environments are accessible at `pr-<num>.preview.safetrekr.com`.
- [ ] `NEXT_PUBLIC_*` variables are baked into the Docker image at build time.
- [ ] Runtime secrets are injected via Kubernetes Secrets, never in the image.

---

## 10. FR-INFRA-009: Preview Deployments

**Priority**: P1
**Effort**: 1.5 days
**Description**: Ephemeral per-PR preview environments deployed to the `preview` namespace with automatic cleanup.

### 10.1 Preview Deployment Workflow

```yaml
# .github/workflows/preview.yml
name: Preview Deploy

on:
  pull_request:
    types: [opened, synchronize, reopened]

concurrency:
  group: preview-${{ github.event.pull_request.number }}
  cancel-in-progress: true

env:
  REGISTRY: registry.digitalocean.com/safetrekr
  IMAGE: marketing
  CLUSTER: safetrekr-marketing
  PR_NUMBER: ${{ github.event.pull_request.number }}

jobs:
  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    environment:
      name: preview-${{ github.event.pull_request.number }}
      url: https://pr-${{ github.event.pull_request.number }}.preview.safetrekr.com
    steps:
      - uses: actions/checkout@v4

      - name: Get short SHA
        id: sha
        run: echo "short_sha=$(git rev-parse --short HEAD)" >> $GITHUB_OUTPUT

      - uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

      - name: Log in to DOCR
        run: doctl registry login --expiry-seconds 600

      - uses: docker/setup-buildx-action@v3

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE }}:pr-${{ env.PR_NUMBER }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
            NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
            NEXT_PUBLIC_SITE_URL=https://pr-${{ env.PR_NUMBER }}.preview.safetrekr.com

      - name: Save kubeconfig
        run: doctl kubernetes cluster kubeconfig save ${{ env.CLUSTER }}

      - name: Deploy preview
        run: |
          export PR_NUM=${{ env.PR_NUMBER }}
          export IMAGE_TAG=pr-${{ env.PR_NUMBER }}

          # Apply preview resources with envsubst
          envsubst < infra/k8s/preview/deployment-template.yaml | kubectl apply -n preview -f -
          envsubst < infra/k8s/preview/service-template.yaml | kubectl apply -n preview -f -
          envsubst < infra/k8s/preview/ingress-template.yaml | kubectl apply -n preview -f -

      - name: Wait for rollout
        run: |
          kubectl rollout status deployment/safetrekr-marketing-pr-${{ env.PR_NUMBER }} \
            --namespace preview \
            --timeout=180s

      - name: Comment on PR
        uses: actions/github-script@v7
        with:
          script: |
            const url = `https://pr-${{ env.PR_NUMBER }}.preview.safetrekr.com`;
            const body = `## Preview Deployment\n\nDeployed to: ${url}\n\nCommit: \`${{ steps.sha.outputs.short_sha }}\`\n\nThis preview will be automatically cleaned up when the PR is closed.`;
            // Find existing comment
            const comments = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: ${{ env.PR_NUMBER }},
            });
            const existing = comments.data.find(c => c.body.includes('Preview Deployment'));
            if (existing) {
              await github.rest.issues.updateComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: existing.id,
                body,
              });
            } else {
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: ${{ env.PR_NUMBER }},
                body,
              });
            }
```

### 10.2 Preview Cleanup Workflow

```yaml
# .github/workflows/preview-cleanup.yml
name: Preview Cleanup

on:
  pull_request:
    types: [closed]

env:
  CLUSTER: safetrekr-marketing

jobs:
  cleanup:
    name: Delete Preview Environment
    runs-on: ubuntu-latest
    steps:
      - uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

      - name: Save kubeconfig
        run: doctl kubernetes cluster kubeconfig save ${{ env.CLUSTER }}

      - name: Delete preview resources
        run: |
          PR_NUM=${{ github.event.pull_request.number }}
          kubectl delete deployment safetrekr-marketing-pr-${PR_NUM} -n preview --ignore-not-found
          kubectl delete service safetrekr-marketing-pr-${PR_NUM} -n preview --ignore-not-found
          kubectl delete ingress safetrekr-marketing-pr-${PR_NUM} -n preview --ignore-not-found
```

### 10.3 Preview Resource Templates

Preview deployments use a single replica, staging Supabase, and shared preview secrets.

```yaml
# infra/k8s/preview/deployment-template.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: safetrekr-marketing-pr-${PR_NUM}
  labels:
    app: safetrekr-marketing
    preview: "pr-${PR_NUM}"
spec:
  replicas: 1
  selector:
    matchLabels:
      app: safetrekr-marketing
      preview: "pr-${PR_NUM}"
  template:
    metadata:
      labels:
        app: safetrekr-marketing
        preview: "pr-${PR_NUM}"
    spec:
      containers:
        - name: nextjs
          image: registry.digitalocean.com/safetrekr/marketing:${IMAGE_TAG}
          ports:
            - containerPort: 3000
          envFrom:
            - secretRef:
                name: preview-shared-secrets
          env:
            - name: NODE_ENV
              value: "production"
          resources:
            requests:
              cpu: 50m
              memory: 128Mi
            limits:
              cpu: 250m
              memory: 256Mi
          readinessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
```

### 10.4 Acceptance Criteria

- [ ] Opening a PR triggers preview deployment within 5 minutes.
- [ ] Preview URL is commented on the PR automatically.
- [ ] Updating a PR triggers redeployment to the same URL.
- [ ] Closing/merging a PR deletes all preview resources.
- [ ] Preview environments use staging Supabase (not production).
- [ ] Maximum 5 concurrent preview deployments (enforced by resource quotas).

---

## 11. FR-INFRA-010: DNS & CDN Configuration

**Priority**: P0
**Effort**: 0.5 days
**Description**: Cloudflare DNS pointing to DOKS Ingress Load Balancer with CDN proxying.

### 11.1 DNS Records

| Record Type | Name | Value | Proxy | TTL |
|-------------|------|-------|-------|-----|
| A | `@` | `<DO LB IP>` | Proxied (orange cloud) | Auto |
| CNAME | `www` | `safetrekr.com` | Proxied | Auto |
| A | `staging` | `<DO LB IP>` | Proxied | Auto |
| CNAME | `*.preview` | `safetrekr.com` | Proxied | Auto |
| CNAME | `app` | `<product-hosting>` | Proxied | Auto |
| CNAME | `api` | `<api-hosting>` | Proxied | Auto |
| MX | `@` | SendGrid MX records | DNS only | 3600 |
| TXT | `@` | `v=spf1 include:sendgrid.net ~all` | DNS only | 3600 |
| CNAME | `s1._domainkey` | SendGrid DKIM record | DNS only | 3600 |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@safetrekr.com` | DNS only | 3600 |

**Note**: The A record value is the external IP of the DigitalOcean Load Balancer created by the Nginx Ingress controller. Retrieve it with:

```bash
kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

### 11.2 Cloudflare Settings

| Setting | Value | Rationale |
|---------|-------|-----------|
| SSL/TLS mode | Full (Strict) | Origin has valid Let's Encrypt cert |
| Minimum TLS version | 1.2 | Industry standard |
| Always Use HTTPS | On | Force HTTPS |
| HSTS | Enabled (max-age=31536000, includeSubDomains, preload) | Security best practice |
| Brotli | On | Compression |
| HTTP/2 | On | Performance |
| HTTP/3 (QUIC) | On | Performance |
| 0-RTT | On | Performance |
| Auto Minify | Off | Next.js handles this |
| Rocket Loader | Off | Conflicts with Next.js hydration |
| Email Address Obfuscation | On | Anti-scraping |
| Browser Integrity Check | On | Bot protection layer |
| Hotlink Protection | On | Prevent image hotlinking |

### 11.3 Cloudflare Page Rules

| Rule | URL Pattern | Setting |
|------|-------------|---------|
| 1 | `safetrekr.com/_next/static/*` | Cache Level: Cache Everything, Edge TTL: 1 year, Browser TTL: 1 year |
| 2 | `safetrekr.com/images/*` | Cache Level: Cache Everything, Edge TTL: 1 month, Browser TTL: 1 week |
| 3 | `safetrekr.com/api/*` | Cache Level: Bypass |
| 4 | `www.safetrekr.com/*` | Forwarding URL (301) to `https://safetrekr.com/$1` |

### 11.4 DigitalOcean Spaces CDN (Static Assets)

For heavy static assets (sample binder PDFs, high-resolution images), use DigitalOcean Spaces with CDN enabled:

| Parameter | Value |
|-----------|-------|
| Space name | `safetrekr-assets` |
| Region | `nyc3` |
| CDN enabled | Yes |
| CDN endpoint | `safetrekr-assets.nyc3.cdn.digitaloceanspaces.com` |
| Custom domain (optional) | `assets.safetrekr.com` |
| File access | Public read for assets, private for backups |
| CORS | Allow `safetrekr.com`, `staging.safetrekr.com` |

### 11.5 Acceptance Criteria

- [ ] `safetrekr.com` resolves and loads the marketing site via Cloudflare.
- [ ] `www.safetrekr.com` redirects (301) to `safetrekr.com`.
- [ ] `staging.safetrekr.com` loads the staging environment.
- [ ] `pr-*.preview.safetrekr.com` resolves for active previews.
- [ ] SSL certificate is valid end-to-end (Cloudflare -> Origin).
- [ ] Cloudflare is caching `_next/static/*` assets (verified via `cf-cache-status` header).
- [ ] API routes bypass the Cloudflare cache.
- [ ] Email deliverability passes SPF, DKIM, and DMARC checks.

---

## 12. FR-INFRA-011: Monitoring & Alerting

**Priority**: P1
**Effort**: 1.5 days
**Description**: Observability stack for cluster health, application performance, and uptime.

### 12.1 Monitoring Strategy

Use a tiered approach that avoids over-engineering for a marketing site:

| Tier | Tool | Purpose | Cost |
|------|------|---------|------|
| Tier 1 (Essential) | DigitalOcean Monitoring | Node CPU/Memory/Disk alerts | Free with DOKS |
| Tier 1 (Essential) | UptimeRobot or BetterStack | External uptime monitoring | Free tier (50 monitors) |
| Tier 1 (Essential) | Sentry | Application error tracking | Free tier (5K events/mo) |
| Tier 2 (Recommended) | Prometheus + Grafana | In-cluster metrics + dashboards | Self-hosted, free |
| Tier 3 (Future) | DigitalOcean App Insights | Full APM | $10-25/mo |

### 12.2 DigitalOcean Monitoring Alerts

| Alert | Condition | Notification |
|-------|-----------|--------------|
| High CPU | Node CPU > 85% for 5 minutes | Email + Slack |
| High Memory | Node memory > 90% for 5 minutes | Email + Slack |
| High Disk | Disk usage > 80% | Email |
| Droplet down | Node unreachable for 2 minutes | Email + Slack |
| Load Balancer unhealthy | All backends unhealthy | Email + Slack |

### 12.3 Prometheus + Grafana (Recommended)

```bash
# Install kube-prometheus-stack via Helm
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set prometheus.prometheusSpec.retention=15d \
  --set prometheus.prometheusSpec.resources.requests.cpu=100m \
  --set prometheus.prometheusSpec.resources.requests.memory=256Mi \
  --set prometheus.prometheusSpec.resources.limits.memory=512Mi \
  --set grafana.adminPassword="${GRAFANA_ADMIN_PASSWORD}" \
  --set grafana.ingress.enabled=true \
  --set grafana.ingress.ingressClassName=nginx \
  --set grafana.ingress.hosts[0]=grafana.internal.safetrekr.com \
  --set alertmanager.enabled=true
```

### 12.4 Application Health Endpoint

The `/api/health` endpoint (defined in CTA analysis) checks:

1. Supabase connectivity (`SELECT 1`).
2. SendGrid API key validity.
3. Turnstile secret key configured.
4. Build metadata (version, commit SHA).

Response format:

```json
{
  "status": "healthy",
  "version": "sha-a1b2c3d",
  "timestamp": "2026-03-24T12:00:00Z",
  "checks": {
    "supabase": "ok",
    "sendgrid": "ok",
    "turnstile": "ok"
  }
}
```

### 12.5 External Uptime Monitoring

| Monitor | URL | Check Interval | Alert After |
|---------|-----|----------------|-------------|
| Homepage | `https://safetrekr.com` | 60 seconds | 2 failures |
| Health endpoint | `https://safetrekr.com/api/health` | 60 seconds | 1 failure |
| Staging | `https://staging.safetrekr.com` | 300 seconds | 3 failures |
| Demo form | `https://safetrekr.com/demo` | 300 seconds | 3 failures |

### 12.6 Sentry Error Tracking Configuration

```typescript
// Adapted for DOKS (no Vercel environment variables)
const sentryConfig = {
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0.5,
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_COMMIT_SHA, // Injected at build time
}
```

### 12.7 Acceptance Criteria

- [ ] DigitalOcean monitoring alerts fire when node CPU exceeds 85%.
- [ ] UptimeRobot/BetterStack detects downtime within 2 minutes.
- [ ] Sentry captures unhandled exceptions with source maps.
- [ ] Grafana dashboards show pod CPU/memory, request rate, and error rate.
- [ ] Health endpoint returns 503 when Supabase is unreachable.

---

## 13. FR-INFRA-012: Centralized Logging

**Priority**: P1
**Effort**: 1 day
**Description**: Aggregate container logs from all pods for debugging and audit.

### 13.1 Logging Strategy

| Approach | Complexity | Cost | Recommendation |
|----------|------------|------|----------------|
| `kubectl logs` (manual) | Minimal | Free | Not sufficient for production |
| DigitalOcean log forwarding | Low | Free with DOKS | Recommended for launch |
| Loki + Fluent Bit | Medium | Self-hosted, free | Recommended for 60+ days |
| Datadog / New Relic | Low (SaaS) | $15-25/mo | Future consideration |

### 13.2 Phase 1: DigitalOcean Log Forwarding (Launch)

DigitalOcean DOKS supports forwarding logs to external endpoints. Configure via the DO control panel:

| Parameter | Value |
|-----------|-------|
| Destination | Papertrail, Datadog, or custom syslog |
| Format | JSON (structured) |
| Filter | All namespaces |

### 13.3 Phase 2: Loki + Fluent Bit (Post-Launch)

```bash
# Install Loki stack
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

helm install loki grafana/loki-stack \
  --namespace monitoring \
  --set fluent-bit.enabled=true \
  --set promtail.enabled=false \
  --set loki.persistence.enabled=true \
  --set loki.persistence.size=10Gi \
  --set loki.config.table_manager.retention_deletes_enabled=true \
  --set loki.config.table_manager.retention_period=336h  # 14 days
```

### 13.4 Application Logging Standards

All application logs MUST be structured JSON:

```typescript
// Example structured log output
console.log(JSON.stringify({
  level: 'info',
  message: 'Form submission received',
  service: 'safetrekr-marketing',
  form_type: 'demo_request',
  segment: 'k12',
  timestamp: new Date().toISOString(),
  request_id: crypto.randomUUID(),
}))
```

### 13.5 Acceptance Criteria

- [ ] `kubectl logs -l app=safetrekr-marketing -n production` returns structured JSON logs.
- [ ] Logs are queryable by form type, error level, and timestamp.
- [ ] Log retention is 14 days minimum.
- [ ] No PII (raw IP addresses, email addresses) appears in application logs.

---

## 14. FR-INFRA-013: Security Hardening

**Priority**: P0
**Effort**: 1 day
**Description**: Kubernetes-level security controls, network policies, and secret management.

### 14.1 Network Policies

```yaml
# infra/k8s/base/networkpolicy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: safetrekr-marketing
spec:
  podSelector:
    matchLabels:
      app: safetrekr-marketing
  policyTypes:
    - Ingress
    - Egress
  ingress:
    # Allow traffic from Nginx Ingress controller only
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: ingress-nginx
      ports:
        - protocol: TCP
          port: 3000
  egress:
    # Allow DNS resolution
    - to:
        - namespaceSelector: {}
      ports:
        - protocol: UDP
          port: 53
        - protocol: TCP
          port: 53
    # Allow HTTPS to external services (Supabase, SendGrid, Turnstile, Plausible, Sentry, MapTiler)
    - to:
        - ipBlock:
            cidr: 0.0.0.0/0
            except:
              - 10.0.0.0/8
              - 172.16.0.0/12
              - 192.168.0.0/16
      ports:
        - protocol: TCP
          port: 443
```

### 14.2 Pod Security Standards

The Deployment spec (FR-INFRA-005) enforces:

| Control | Value |
|---------|-------|
| `runAsNonRoot` | `true` |
| `runAsUser` | `1001` |
| `runAsGroup` | `1001` |
| `seccompProfile.type` | `RuntimeDefault` |
| `allowPrivilegeEscalation` | `false` |
| `capabilities.drop` | `ALL` |
| `readOnlyRootFilesystem` | `false` (Next.js ISR cache needs write) |
| `automountServiceAccountToken` | `false` |

### 14.3 Secret Management

| Practice | Implementation |
|----------|---------------|
| Secrets stored encrypted at rest | DOKS encrypts etcd by default |
| Secrets injected by CI | `kubectl create secret --dry-run=client -o yaml \| kubectl apply` |
| No secrets in Docker images | All `NEXT_PUBLIC_*` are non-sensitive; secrets are runtime-only |
| No secrets in Git | `.env*` in `.gitignore`; secret templates use `<injected-by-ci>` placeholders |
| Secret rotation | Supabase keys rotatable; SendGrid key scoped to `mail.send`; rotate quarterly |
| GitHub Secrets | Encrypted at rest; scoped to environments (production, staging) |

### 14.4 Resource Quotas (Preview Namespace)

```yaml
# infra/k8s/preview/resourcequota.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: preview-quota
  namespace: preview
spec:
  hard:
    requests.cpu: "2"
    requests.memory: 2Gi
    limits.cpu: "4"
    limits.memory: 4Gi
    pods: "10"
    services: "10"
    persistentvolumeclaims: "0"
```

### 14.5 RBAC (Future: Multi-Developer Access)

```yaml
# infra/k8s/cluster/rbac-developer.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: developer
  namespace: staging
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/log", "services"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list", "watch"]
  # Developers cannot modify production resources
```

### 14.6 Security Headers

Security headers are applied at two layers:

1. **Nginx Ingress annotations** (FR-INFRA-006): HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
2. **Next.js middleware** (CTA analysis Section 5.1): Full CSP header, Cross-Origin policies.

Both layers are necessary. Nginx provides the safety net; Next.js middleware provides granular per-route control.

### 14.7 Acceptance Criteria

- [ ] NetworkPolicy blocks direct pod-to-pod access from non-ingress namespaces.
- [ ] Pods cannot reach internal cluster IPs except DNS and their own service.
- [ ] All pods run as non-root (verified with `kubectl exec -- id`).
- [ ] No secrets are visible in `docker inspect` of the built image.
- [ ] Preview namespace cannot exceed resource quota.
- [ ] Security headers are present on all responses (verified with `curl -I`).

---

## 15. FR-INFRA-014: Backup & Disaster Recovery

**Priority**: P1
**Effort**: 1 day
**Description**: Backup strategy for data and infrastructure, plus disaster recovery procedures.

### 15.1 Backup Matrix

| Asset | Backup Method | Frequency | Retention | RTO | RPO |
|-------|--------------|-----------|-----------|-----|-----|
| Supabase database | Supabase Pro daily backups + PITR | Continuous (PITR) | 7 days (Pro) | < 15 min | < 5 min |
| Kubernetes manifests | Git repository | Every commit | Permanent | < 5 min (redeploy) | 0 (Git) |
| Docker images | DOCR (30-day retention) | Every build | 30 days | < 5 min (redeploy previous tag) | 0 |
| Cloudflare DNS config | Terraform state or manual export | On change | Permanent | < 10 min | 0 |
| Static assets (Spaces) | DO Spaces versioning | On upload | 30 days | < 5 min | 0 |
| GitHub Secrets | Manual documentation (encrypted) | On change | N/A | < 30 min (manual re-entry) | 0 |

### 15.2 Supabase Backup Strategy

Supabase Pro ($25/month) provides:

- **Daily automated backups**: Full database snapshot, retained for 7 days.
- **Point-in-time recovery (PITR)**: Continuous WAL archiving, restore to any second in the last 7 days.
- **Manual backup**: On-demand via Supabase dashboard before any destructive migration.

Additional safeguard:

```bash
# Weekly pg_dump to DO Spaces (via GitHub Actions scheduled workflow)
# .github/workflows/db-backup.yml
name: Database Backup
on:
  schedule:
    - cron: '0 4 * * 0'  # Sunday 4 AM UTC

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Dump database
        run: |
          pg_dump "${{ secrets.PROD_SUPABASE_DB_URL }}" \
            --format=custom \
            --no-owner \
            --no-privileges \
            -f backup-$(date +%Y%m%d).dump

      - name: Upload to DO Spaces
        uses: BetaHuhn/do-spaces-action@v2
        with:
          access_key: ${{ secrets.SPACES_ACCESS_KEY }}
          secret_key: ${{ secrets.SPACES_SECRET_KEY }}
          space_name: safetrekr-backups
          space_region: nyc3
          source: backup-*.dump
          out_dir: db-backups/
```

### 15.3 Disaster Recovery Procedures

#### Scenario 1: Application Pod Failure

```
Detection: Kubernetes restarts pod automatically (restartPolicy: Always)
Action: Automatic -- no manual intervention
RTO: < 30 seconds
```

#### Scenario 2: Node Failure

```
Detection: DOKS control plane detects node down
Action: Pods rescheduled to surviving nodes within 5 minutes
         Autoscaler adds replacement node within 5-10 minutes
RTO: < 5 minutes (pods rescheduled)
```

#### Scenario 3: Bad Deployment

```
Detection: Health check failure during rollout, or Sentry error spike
Action: kubectl rollout undo deployment/safetrekr-marketing -n production
        OR: redeploy previous image tag via GitHub Actions manual trigger
RTO: < 2 minutes
```

#### Scenario 4: Database Corruption

```
Detection: Health endpoint returns 503 for Supabase check
Action: Supabase PITR restore to last known good state
RTO: < 15 minutes
RPO: < 5 minutes
```

#### Scenario 5: Complete Cluster Loss

```
Detection: All monitoring alerts fire simultaneously
Action:
  1. Create new DOKS cluster (doctl command, ~5 minutes)
  2. Install ingress + cert-manager (Helm, ~3 minutes)
  3. Apply K8s manifests from Git (kubectl apply, ~2 minutes)
  4. Update Cloudflare DNS to new Load Balancer IP (~1 minute)
  5. Wait for cert-manager to issue new certificate (~2 minutes)
  6. Wait for DNS propagation (Cloudflare proxied, near-instant)
RTO: < 20 minutes
RPO: 0 (all state is external: Git, DOCR, Supabase, Cloudflare)
```

### 15.4 Acceptance Criteria

- [ ] Supabase PITR restore tested successfully at least once before launch.
- [ ] Weekly `pg_dump` to DO Spaces runs without errors for 4 consecutive weeks.
- [ ] `kubectl rollout undo` restores a working deployment within 2 minutes.
- [ ] Complete cluster recreation from scratch takes under 20 minutes (dry run documented).
- [ ] All infrastructure is reproducible from Git (no snowflake configuration).

---

## 16. FR-INFRA-015: Cost Estimation

**Priority**: P0 (planning)
**Effort**: N/A (reference document)
**Description**: Monthly cost projection for DigitalOcean infrastructure.

### 16.1 Monthly Cost Breakdown

| Resource | Specification | Monthly Cost |
|----------|---------------|-------------|
| DOKS Cluster (control plane) | HA enabled | $0 (free with DOKS) |
| Worker nodes (2x) | `s-2vcpu-4gb` | $48 ($24 x 2) |
| Worker nodes (autoscale, average) | +1 during peaks | ~$12 (estimated 50% utilization) |
| Load Balancer | `lb-small` | $12 |
| Container Registry | Starter (5 GB) | $5 |
| DO Spaces (assets) | 250 GB storage + CDN | $5 + bandwidth |
| DO Spaces (backups) | ~1 GB | $0.02 |
| **DigitalOcean Subtotal** | | **~$82/month** |

### 16.2 External Service Costs

| Service | Plan | Monthly Cost |
|---------|------|-------------|
| Cloudflare | Free plan | $0 |
| Supabase | Pro | $25 |
| SendGrid | Free (100 emails/day) | $0 |
| Plausible Analytics | Growth (10K pageviews) | $9 |
| Sentry | Free (5K events/month) | $0 |
| UptimeRobot | Free (50 monitors) | $0 |
| **External Subtotal** | | **$34/month** |

### 16.3 Total Monthly Cost

| Tier | Cost | When |
|------|------|------|
| **Launch (baseline)** | **~$116/month** | Day 1 |
| Growth (3-4 nodes, Sentry Pro) | ~$180/month | After 3 months |
| Scale (4+ nodes, full monitoring) | ~$250/month | After 6 months |

### 16.4 Cost Comparison: Vercel vs. DOKS

| Scenario | Vercel Pro | DOKS |
|----------|-----------|------|
| Low traffic (<50K pageviews) | $20/month | $116/month |
| Medium traffic (50K-500K pageviews) | $20-50/month | $116/month |
| High traffic (500K+ pageviews) | $50-200+/month (bandwidth overage) | $116-180/month |
| ISR + Image Optimization heavy | $20+ (execution usage) | Included in node cost |
| Preview deployments (10 PRs/week) | Included | Included (small resource overhead) |

**Decision Rationale**: DOKS costs more at low traffic but provides predictable costs at scale, full infrastructure control, no vendor lock-in, and the ability to run additional services (analytics, monitoring) on the same cluster.

---

## 17. Infrastructure Directory Structure

```
safetrekr-marketing/
├── infra/
│   ├── docker/
│   │   ├── Dockerfile              # Production multi-stage build
│   │   ├── Dockerfile.dev          # Development with hot reload
│   │   └── .dockerignore
│   │
│   ├── k8s/
│   │   ├── base/
│   │   │   ├── kustomization.yaml
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   ├── hpa.yaml
│   │   │   ├── pdb.yaml
│   │   │   ├── serviceaccount.yaml
│   │   │   ├── networkpolicy.yaml
│   │   │   └── secret.yaml          # Template only
│   │   │
│   │   ├── overlays/
│   │   │   ├── production/
│   │   │   │   ├── kustomization.yaml
│   │   │   │   ├── configmap.yaml
│   │   │   │   ├── ingress.yaml
│   │   │   │   └── hpa-patch.yaml
│   │   │   └── staging/
│   │   │       ├── kustomization.yaml
│   │   │       ├── configmap.yaml
│   │   │       ├── ingress.yaml
│   │   │       └── hpa-patch.yaml
│   │   │
│   │   ├── preview/
│   │   │   ├── deployment-template.yaml
│   │   │   ├── service-template.yaml
│   │   │   ├── ingress-template.yaml
│   │   │   └── resourcequota.yaml
│   │   │
│   │   └── cluster/
│   │       ├── clusterissuer-production.yaml
│   │       ├── clusterissuer-staging.yaml
│   │       └── rbac-developer.yaml
│   │
│   ├── nginx/
│   │   └── local.conf               # Local Nginx reverse proxy config
│   │
│   └── scripts/
│       ├── setup-cluster.sh          # One-time cluster provisioning
│       ├── install-addons.sh         # Helm installs for ingress, cert-manager, monitoring
│       ├── create-namespaces.sh      # Namespace creation
│       └── rotate-secrets.sh         # Secret rotation helper
│
├── .github/
│   └── workflows/
│       ├── ci.yml                    # PR checks: lint, test, build
│       ├── deploy-production.yml     # Main branch -> production
│       ├── deploy-staging.yml        # Staging branch -> staging
│       ├── preview.yml               # PR -> preview namespace
│       ├── preview-cleanup.yml       # PR close -> delete preview
│       ├── cleanup.yml               # Weekly: registry + preview cleanup
│       └── db-backup.yml             # Weekly: Supabase pg_dump to Spaces
│
├── docker-compose.yml                # Local production-like testing
├── docker-compose.dev.yml            # Local development with hot reload
├── Dockerfile                        # Symlink or copy of infra/docker/Dockerfile
└── .dockerignore                     # Symlink or copy of infra/docker/.dockerignore
```

---

## 18. Rollback Strategy

| Scenario | Action | Command | Recovery Time |
|----------|--------|---------|---------------|
| Bad deployment (health check fails) | Automatic rollback in CI | Pipeline handles it | < 2 min |
| Bad deployment (discovered post-deploy) | Manual rollback | `kubectl rollout undo deployment/safetrekr-marketing -n production` | < 1 min |
| Redeploy specific version | Re-run deploy workflow | Trigger GitHub Action with specific SHA | < 5 min |
| Database migration failure | Supabase PITR | Supabase dashboard | < 15 min |
| DNS misconfiguration | Cloudflare revert | Cloudflare dashboard | < 2 min |
| Complete cluster loss | Full rebuild from Git | `setup-cluster.sh` + `install-addons.sh` + deploy | < 20 min |

**Revision History**: Kubernetes retains the last 5 deployment revisions (`revisionHistoryLimit: 5`), enabling instant rollback to any of the 5 most recent versions.

---

## 19. Operational Runbooks

### 19.1 Deploy to Production (Manual)

```bash
# 1. Build and push image
docker build -t registry.digitalocean.com/safetrekr/marketing:sha-$(git rev-parse --short HEAD) .
docker push registry.digitalocean.com/safetrekr/marketing:sha-$(git rev-parse --short HEAD)

# 2. Update deployment
kubectl set image deployment/safetrekr-marketing \
  nextjs=registry.digitalocean.com/safetrekr/marketing:sha-$(git rev-parse --short HEAD) \
  -n production

# 3. Monitor rollout
kubectl rollout status deployment/safetrekr-marketing -n production

# 4. Verify health
curl -s https://safetrekr.com/api/health | jq .
```

### 19.2 Scale Up (Manual)

```bash
# Increase minimum replicas temporarily
kubectl scale deployment/safetrekr-marketing --replicas=4 -n production

# Or patch HPA
kubectl patch hpa safetrekr-marketing -n production \
  -p '{"spec":{"minReplicas":4}}'
```

### 19.3 Debug Failing Pod

```bash
# Check pod status
kubectl get pods -l app=safetrekr-marketing -n production

# View pod events
kubectl describe pod <pod-name> -n production

# View container logs
kubectl logs <pod-name> -n production --tail=100

# Exec into container (emergency debugging only)
kubectl exec -it <pod-name> -n production -- /bin/sh
```

### 19.4 Certificate Renewal Check

```bash
# Check certificate status
kubectl get certificate -n production

# Check cert-manager logs
kubectl logs -l app=cert-manager -n cert-manager --tail=50

# Force renewal
kubectl delete secret safetrekr-marketing-tls -n production
# cert-manager will automatically re-issue
```

### 19.5 Emergency: Redirect Traffic Away from DOKS

If the entire DOKS cluster is unrecoverable, redirect traffic to a static maintenance page:

1. Log into Cloudflare.
2. Add a Page Rule for `safetrekr.com/*` with "Forwarding URL (302)" to a maintenance page hosted on Cloudflare Pages or a static Spaces URL.
3. Investigate and rebuild the cluster.
4. Remove the Page Rule once restored.

---

## 20. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| DOKS node pool runs out of capacity | Low | High | Autoscaler configured (max 4 nodes); alerts at 70% CPU |
| Let's Encrypt rate limit hit | Low | Medium | Use staging issuer for testing; production issuer has generous limits |
| DigitalOcean region outage | Very Low | Critical | DNS failover to static page on Cloudflare; all state external to DO |
| Docker image vulnerability | Medium | Medium | Trivy scan in CI; Alpine base with minimal packages |
| ISR cache inconsistency | Medium | Low | ISR cache stored in-pod (ephemeral); redeployment resets cache |
| Cloudflare misconfiguration | Low | High | Terraform or version-controlled Cloudflare config; test in staging |
| GitHub Actions secrets leak | Very Low | Critical | Secrets scoped to environments; no secret printing in logs |
| Supabase outage | Low | Medium | Health endpoint degrades gracefully; static pages still serve |
| Registry storage exhausted | Low | Low | Weekly garbage collection; 5 GB generous for ~30 images |
| Cost overrun from autoscaling | Low | Low | Max 4 nodes ($96/mo); alerts on scaling events |
| Preview namespace resource exhaustion | Medium | Low | ResourceQuota limits; max 10 pods in preview namespace |
| Next.js standalone ISR cold start | Medium | Low | Startup probe with 60s grace period; at least 2 replicas always warm |

---

## Appendix A: ISR on DOKS vs. Vercel

Next.js standalone mode supports ISR natively using a file-system cache stored within the running container. Key differences from Vercel:

| Aspect | Vercel ISR | Standalone ISR (DOKS) |
|--------|-----------|----------------------|
| Cache storage | Vercel Edge Network (distributed) | Pod-local file system |
| Cache sharing | Shared across all edge nodes | NOT shared between pods |
| Revalidation | Background revalidation at edge | Background revalidation per pod |
| Stale-while-revalidate | Native | Native (built into Next.js server) |
| Cache persistence | Persisted across deploys | Lost on pod restart/redeploy |

**Implication**: Each pod independently caches and revalidates ISR pages. For a marketing site with mostly SSG pages and ISR only on blog content, this is acceptable. The first request after a deployment will be slightly slower (cache cold start) but subsequent requests are cached.

**If cache sharing becomes critical**: Use a shared volume (PersistentVolumeClaim) mounted at `.next/cache` across all pods, or implement Redis-based caching with `@neshca/cache-handler`.

---

## Appendix B: OG Image Generation Without Vercel

The CTA analysis specifies `@vercel/og` for OG image generation. On DOKS, two options exist:

| Option | Description | Recommendation |
|--------|-------------|----------------|
| `@vercel/og` with Node.js | Works outside Vercel since v0.6+ (uses Satori under the hood) | Recommended if `@vercel/og` supports Node runtime |
| `satori` + `sharp` directly | Generate SVG with Satori, convert to PNG with sharp | Fallback if `@vercel/og` requires Edge runtime |

Test `@vercel/og` in the Docker container during development. If it requires the Vercel Edge runtime, switch to the Satori + sharp approach in the `/api/og` route handler.

---

## Appendix C: Pre-Launch Checklist

- [ ] DOKS cluster provisioned and healthy (2 nodes).
- [ ] Nginx Ingress controller deployed with Load Balancer IP assigned.
- [ ] cert-manager installed; ClusterIssuer verified with staging Let's Encrypt.
- [ ] Container Registry created; DOKS cluster has pull access.
- [ ] Namespaces created: `production`, `staging`, `preview`, `monitoring`.
- [ ] Kubernetes manifests applied to staging; staging site accessible.
- [ ] Cloudflare DNS configured; `staging.safetrekr.com` resolves.
- [ ] GitHub Actions CI workflow passes on a test PR.
- [ ] GitHub Actions deploy workflow deploys to staging successfully.
- [ ] Production secrets populated in GitHub Environments.
- [ ] Production deployment completes successfully.
- [ ] Production `safetrekr.com` resolves with valid SSL.
- [ ] Health endpoint returns 200 with all checks passing.
- [ ] `www.safetrekr.com` redirects to `safetrekr.com`.
- [ ] `_next/static/*` assets are cached by Cloudflare (verify `cf-cache-status` header).
- [ ] Monitoring alerts configured and tested (fire a test alert).
- [ ] Uptime monitor active for `safetrekr.com` and `/api/health`.
- [ ] Sentry error tracking verified (throw a test error).
- [ ] Supabase backup tested (pg_dump + restore dry run).
- [ ] Rollback tested (`kubectl rollout undo` restores previous version).
- [ ] Preview deployment tested (open test PR, verify preview URL).
- [ ] Load test completed (100 concurrent users, all responses < 500ms).
- [ ] Security headers verified on all responses.
- [ ] Docker image scanned with Trivy (zero critical/high CVEs).


---

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


---

---SECURE_ARCHITECTURE---

# SafeTrekr Marketing Site -- Security Architecture PRD

**Date**: 2026-03-24
**Author**: World-Class AppSec Security Architect
**Project**: SafeTrekr Marketing Website
**Stack**: Next.js 15 (App Router) / React 19 / Docker / Kubernetes (DigitalOcean DOKS) / Supabase / SendGrid / Cloudflare Turnstile / Plausible
**Deployment**: GitHub Actions -> Docker Build -> DigitalOcean Container Registry -> DOKS -> Nginx Ingress Controller -> Cloudflare DNS
**Classification**: Internal -- Architecture Specification

---

## Executive Summary

SafeTrekr sells documented trust. The marketing site is not a brochure; it is the primary revenue instrument for a founder-led company with no sales team. Every security decision in this document reflects that reality. If the marketing site is compromised, defaced, or caught leaking data, the product's core value proposition -- "we protect your people and prove it" -- collapses overnight. The buyer personas (K-12 risk managers, church administrators, corporate travel directors) evaluate vendor security posture before signing. The marketing site IS the first security audit.

This PRD defines 15 security domains with 78 functional requirements. It corrects the Chief Technology Architect's CSP specification (which used `unsafe-inline` and `unsafe-eval`) to a nonce-based policy compatible with Next.js 15. It adapts all infrastructure security controls from the Vercel-oriented architecture to the binding DigitalOcean DOKS deployment target. It adds Kubernetes-specific controls (NetworkPolicy, Pod Security Standards, cert-manager) that were absent from the original architecture.

**Critical Correction**: The CTA architect's CSP included `'unsafe-inline'` and `'unsafe-eval'` in `script-src`. This PRD replaces those directives with nonce-based script authorization. `unsafe-inline` and `unsafe-eval` are explicitly prohibited. This is non-negotiable for a company that sells security.

---

## Table of Contents

1. [HTTP Security Headers](#1-http-security-headers)
2. [Content Security Policy (Nonce-Based)](#2-content-security-policy-nonce-based)
3. [Form Security (8-Layer Defense)](#3-form-security-8-layer-defense)
4. [Rate Limiting](#4-rate-limiting)
5. [Bot Protection](#5-bot-protection)
6. [Supply Chain Security](#6-supply-chain-security)
7. [Secret Management](#7-secret-management)
8. [Network Security (Kubernetes)](#8-network-security-kubernetes)
9. [SSL/TLS Certificate Management](#9-ssltls-certificate-management)
10. [CORS Policy](#10-cors-policy)
11. [Cookie Security](#11-cookie-security)
12. [GDPR/CCPA Compliance](#12-gdprccpa-compliance)
13. [WCAG 2.2 AA (Accessibility as Security)](#13-wcag-22-aa-accessibility-as-security)
14. [Incident Response Plan](#14-incident-response-plan)
15. [Dependency Vulnerability Scanning](#15-dependency-vulnerability-scanning)

---

## 1. HTTP Security Headers

All HTTP security headers are applied in Next.js middleware (`middleware.ts`), enforced on every response. The Nginx Ingress Controller provides a secondary enforcement layer for any response that bypasses the application.

### FR-SEC-001: Strict-Transport-Security (HSTS)

**Requirement**: All responses MUST include the HSTS header with preload eligibility.

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Implementation Notes**:
- `max-age=31536000` (1 year) is the minimum for HSTS preload list submission.
- `includeSubDomains` covers `www.safetrekr.com`, future subdomains, and prevents downgrade attacks on any subdomain.
- Submit to the HSTS preload list at `hstspreload.org` after launch confirmation.
- The Nginx Ingress Controller MUST also set this header via annotation `nginx.ingress.kubernetes.io/configuration-snippet` as a defense-in-depth measure.
- **Enforcement**: Automated test in CI verifies header presence on every route.

### FR-SEC-002: X-Frame-Options

**Requirement**: Prevent clickjacking by denying all framing.

```
X-Frame-Options: DENY
```

**Implementation Notes**:
- `DENY` is preferred over `SAMEORIGIN` because the marketing site has no legitimate reason to be framed, including by itself.
- The CSP `frame-ancestors 'none'` directive (FR-SEC-013) provides the modern equivalent. Both headers are set for backward compatibility with older browsers.

### FR-SEC-003: X-Content-Type-Options

**Requirement**: Prevent MIME-type sniffing.

```
X-Content-Type-Options: nosniff
```

**Implementation Notes**:
- Prevents browsers from interpreting files as a different MIME type than declared in the `Content-Type` header.
- Critical for user-uploaded content paths (none at launch, but establishes the baseline for future blog image uploads).

### FR-SEC-004: Referrer-Policy

**Requirement**: Control referrer information leakage.

```
Referrer-Policy: strict-origin-when-cross-origin
```

**Implementation Notes**:
- Same-origin requests: full URL is sent as referrer (needed for Plausible Analytics attribution).
- Cross-origin requests: only the origin (scheme + host) is sent.
- HTTPS-to-HTTP requests: no referrer is sent.
- This preserves UTM tracking functionality while preventing full URL leakage to third parties.

### FR-SEC-005: Permissions-Policy

**Requirement**: Disable browser features not required by the marketing site.

```
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=(), browsing-topics=(), serial=(), hid=(), bluetooth=(), display-capture=()
```

**Implementation Notes**:
- `camera=()`, `microphone=()`: No media capture is needed.
- `geolocation=()`: The marketing site does not use client geolocation. MapLibre displays static/interactive maps without requiring device location.
- `payment=()`: No payment flow on the marketing site at launch. When Stripe integration ships, this will be updated to `payment=(self)`.
- `interest-cohort=()`: Blocks FLoC. `browsing-topics=()`: Blocks Topics API. Both are critical for the privacy-first positioning with K-12 and church audiences.
- All other features disabled as defense-in-depth.

### FR-SEC-006: Cross-Origin Headers

**Requirement**: Control cross-origin resource sharing at the browser level.

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-site
Cross-Origin-Embedder-Policy: unsafe-none
```

**Implementation Notes**:
- `Cross-Origin-Opener-Policy: same-origin` isolates the browsing context, preventing `window.opener` attacks.
- `Cross-Origin-Resource-Policy: same-site` restricts resource loading to same-site contexts.
- `Cross-Origin-Embedder-Policy: unsafe-none` is required because MapLibre GL JS uses Web Workers that load cross-origin tile data from MapTiler. Setting `require-corp` would break map rendering. This is an accepted tradeoff documented in the risk register.

### FR-SEC-007: X-DNS-Prefetch-Control

**Requirement**: Enable DNS prefetching for performance.

```
X-DNS-Prefetch-Control: on
```

### FR-SEC-008: Middleware Implementation Pattern

**Requirement**: All security headers MUST be applied in a single middleware function that executes on every request.

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const response = NextResponse.next()

  // All security headers applied here
  // CSP with nonce (see FR-SEC-013)
  // HSTS, X-Frame-Options, etc.

  // Pass nonce to Server Components via request header
  response.headers.set('x-nonce', nonce)

  return response
}

export const config = {
  matcher: [
    // Match all request paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

**Acceptance Criteria**:
- Every response from the application includes all headers defined in FR-SEC-001 through FR-SEC-007.
- CI includes a header validation test (`curl -sI` against preview deployment) that fails the build on any missing header.
- The Nginx Ingress Controller adds headers as a secondary layer via ConfigMap annotations for any response that bypasses the application middleware (e.g., static assets served directly by Nginx).

---

## 2. Content Security Policy (Nonce-Based)

This section corrects the CTA architect's CSP which used `'unsafe-inline'` and `'unsafe-eval'`. Those directives are prohibited.

### FR-SEC-009: CSP Architecture Decision

**Requirement**: The Content Security Policy MUST use nonce-based script authorization. `'unsafe-inline'` and `'unsafe-eval'` are prohibited in `script-src` and `style-src`.

**Rationale**: SafeTrekr sells trust. A CSP that permits arbitrary inline script execution undermines the product's credibility when enterprise buyers inspect the site's security headers. Next.js 15 natively supports nonce-based CSP via the `headers()` function and middleware integration.

### FR-SEC-010: Nonce Generation

**Requirement**: A cryptographically random nonce MUST be generated per request in middleware and propagated to all Server Components.

```typescript
// middleware.ts
const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

// Set nonce in a request header for Server Components to read
const requestHeaders = new Headers(request.headers)
requestHeaders.set('x-nonce', nonce)

const response = NextResponse.next({
  request: { headers: requestHeaders },
})
```

**Implementation Notes**:
- `crypto.randomUUID()` provides 122 bits of entropy, base64-encoded.
- The nonce is passed to Server Components via request headers, NOT via cookies or query parameters.
- The root layout reads the nonce from `headers()` and passes it to the `<Script>` components.
- Each request gets a unique nonce. Nonces are never reused.

### FR-SEC-011: Nonce Propagation to Script Tags

**Requirement**: All `<script>` tags MUST include the request-specific nonce.

```typescript
// app/layout.tsx
import { headers } from 'next/headers'

export default async function RootLayout({ children }) {
  const headersList = await headers()
  const nonce = headersList.get('x-nonce') ?? ''

  return (
    <html>
      <head>
        {/* Plausible Analytics with nonce */}
        <script
          defer
          data-domain="safetrekr.com"
          src="https://plausible.io/js/script.js"
          nonce={nonce}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### FR-SEC-012: Style Handling Without unsafe-inline

**Requirement**: Inline styles MUST be handled without `'unsafe-inline'` in `style-src`.

**Implementation Notes**:
- Tailwind CSS 4 compiles to a static CSS file at build time. No inline style injection at runtime.
- Framer Motion applies inline styles for animations. Use the nonce for Framer Motion's style injection by configuring the `nonce` prop on `LazyMotion`.
- shadcn/ui components use Tailwind classes, not inline styles.
- For any remaining inline styles (e.g., dynamic MapLibre canvas sizing), use `'nonce-{value}'` in `style-src`.
- `style-src 'self' 'nonce-{value}'` is the target policy.

### FR-SEC-013: Full CSP Directive

**Requirement**: The following CSP MUST be applied to every response.

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{PER_REQUEST_NONCE}' https://challenges.cloudflare.com https://plausible.io;
  style-src 'self' 'nonce-{PER_REQUEST_NONCE}';
  img-src 'self' data: blob: https://api.maptiler.com https://*.tile.openstreetmap.org;
  font-src 'self';
  connect-src 'self' https://*.supabase.co https://plausible.io https://challenges.cloudflare.com https://api.maptiler.com;
  frame-src https://challenges.cloudflare.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  object-src 'none';
  worker-src 'self' blob:;
  upgrade-insecure-requests;
  report-uri /api/csp-report;
  report-to csp-violations
```

**Directive Justification**:

| Directive | Value | Justification |
|---|---|---|
| `default-src` | `'self'` | Deny all resources except from the same origin by default |
| `script-src` | `'self' 'nonce-{N}'` + Turnstile + Plausible | Only nonce-tagged scripts and two trusted external origins |
| `style-src` | `'self' 'nonce-{N}'` | Static Tailwind CSS + nonce for dynamic styles (Framer Motion) |
| `img-src` | `'self' data: blob:` + MapTiler + OSM | Map tiles, inline SVGs (`data:`), MapLibre-generated blobs |
| `font-src` | `'self'` | Self-hosted fonts via `next/font` (no Google Fonts CDN calls) |
| `connect-src` | `'self'` + Supabase + Plausible + Turnstile + MapTiler | XHR/fetch destinations for data, analytics, verification, tiles |
| `frame-src` | Turnstile only | Turnstile renders in an iframe; no other frames permitted |
| `frame-ancestors` | `'none'` | The marketing site must never be framed (clickjacking prevention) |
| `base-uri` | `'self'` | Prevent `<base>` tag injection attacks |
| `form-action` | `'self'` | Forms can only submit to the same origin (Server Actions) |
| `object-src` | `'none'` | Block Flash, Java applets, and other plugin-based content |
| `worker-src` | `'self' blob:` | MapLibre uses Web Workers created via `blob:` URLs |
| `upgrade-insecure-requests` | (directive) | Automatically upgrade HTTP to HTTPS |
| `report-uri` / `report-to` | `/api/csp-report` | Collect violation reports for monitoring |

### FR-SEC-014: CSP Report-Only Deployment Strategy

**Requirement**: New CSP changes MUST be deployed in `Content-Security-Policy-Report-Only` mode for a minimum of 7 days before enforcement.

```typescript
// Phase 1: Report-Only (7 days minimum)
response.headers.set('Content-Security-Policy-Report-Only', newPolicy)
response.headers.set('Content-Security-Policy', currentPolicy)

// Phase 2: Enforcement (after 7 days of clean reports)
response.headers.set('Content-Security-Policy', newPolicy)
```

**Implementation Notes**:
- CSP violation reports are sent to `/api/csp-report`, a Route Handler that logs violations to Supabase.
- The `Report-To` header configures the Reporting API v1 endpoint.
- Violations are monitored via a Supabase dashboard query and a Slack alert for > 5 violations per hour.
- Initial launch: deploy CSP in report-only mode. After 7 days of clean reports, switch to enforcement.

### FR-SEC-015: CSP Violation Reporting Endpoint

**Requirement**: Implement a CSP violation report collector.

```typescript
// app/api/csp-report/route.ts
export async function POST(request: Request) {
  const body = await request.json()

  // Log to Supabase for analysis
  await supabase.from('csp_violations').insert({
    document_uri: body['csp-report']?.['document-uri'],
    violated_directive: body['csp-report']?.['violated-directive'],
    blocked_uri: body['csp-report']?.['blocked-uri'],
    source_file: body['csp-report']?.['source-file'],
    line_number: body['csp-report']?.['line-number'],
    created_at: new Date().toISOString(),
  })

  return new Response(null, { status: 204 })
}
```

**Acceptance Criteria**:
- CSP violation reports are persisted and queryable.
- Alert fires when violations exceed 5 per hour.
- Browser extension noise (common source of false CSP violations) is filtered by `source_file` patterns.

---

## 3. Form Security (8-Layer Defense)

The marketing site's forms (demo request, contact, newsletter, quote request) are the primary revenue instruments. Every form submission passes through all 8 layers sequentially. A failure at any layer rejects the submission.

### FR-SEC-016: Layer 1 -- Client-Side Zod Validation

**Requirement**: All form fields MUST be validated on the client using Zod schemas before submission.

```typescript
// lib/schemas/demo-request.ts
import { z } from 'zod'

export const demoRequestSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(254).trim().toLowerCase(),
  organization: z.string().min(2).max(200).trim(),
  organizationType: z.enum([
    'k12_school', 'university', 'church', 'nonprofit',
    'corporate', 'government', 'other'
  ]),
  tripVolume: z.enum(['1-5', '6-15', '16-50', '51+']),
  preferredFormat: z.enum(['video_call', 'in_person', 'self_guided']),
  message: z.string().max(2000).trim().optional(),
  // Honeypot field (Layer 6) - must be empty
  website: z.string().max(0).optional(),
})
```

**Implementation Notes**:
- React Hook Form integrates with Zod via `@hookform/resolvers/zod`.
- Validation runs on blur and on change (after first blur).
- Error messages are user-friendly, accessible (`aria-describedby` linked to error), and do not reveal schema internals.
- This layer is a UX optimization only. It is NOT a security boundary. All validation is repeated server-side (Layer 4).

### FR-SEC-017: Layer 2 -- Cloudflare Turnstile (Client)

**Requirement**: Every form MUST include a Cloudflare Turnstile widget that generates a verification token before submission.

**Implementation Notes**:
- Turnstile operates in `managed` mode (invisible when possible, interactive when needed).
- The Turnstile widget is lazy-loaded when the form enters the viewport via Intersection Observer.
- The widget is configured with `sitekey` from a public environment variable (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`).
- The generated token is included in the form data submitted to the Server Action.
- For Turnstile fallback behavior (K-12 firewalls), see FR-SEC-038.

### FR-SEC-018: Layer 3 -- Server-Side Turnstile Verification

**Requirement**: The server MUST verify the Turnstile token with Cloudflare's `/siteverify` API before processing the form.

```typescript
// lib/turnstile.ts
export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: token,
        remoteip: ip,
      }),
    }
  )

  const data = await response.json()
  return data.success === true
}
```

**Implementation Notes**:
- The `TURNSTILE_SECRET_KEY` is stored in K8s Secrets, never exposed to the client.
- Token verification includes the client IP for additional validation.
- Tokens are single-use; Cloudflare rejects replayed tokens.
- If Cloudflare's API is unreachable (timeout > 5s), the submission is queued for retry, NOT silently accepted. Log the failure and alert.

### FR-SEC-019: Layer 4 -- Server-Side Zod Validation

**Requirement**: All form fields MUST be re-validated server-side using the identical Zod schema. The server MUST NOT trust client-side validation.

**Implementation Notes**:
- The same Zod schema file (`lib/schemas/demo-request.ts`) is imported by both the client form and the Server Action.
- Server-side validation runs after Turnstile verification (Layer 3) but before rate limiting (Layer 5).
- Validation failures return a structured error response with field-level errors. The response does NOT include the raw Zod error path (which could reveal schema structure).
- Type coercion is applied: `z.string().trim()` normalizes whitespace; `z.string().toLowerCase()` normalizes email.

### FR-SEC-020: Layer 5 -- Rate Limiting

**Requirement**: Form submissions MUST be rate-limited per IP hash per form type. See Section 4 for full rate limiting specification.

### FR-SEC-021: Layer 6 -- Honeypot Detection

**Requirement**: Every form MUST include a hidden honeypot field that is invisible to human users but auto-filled by bots.

```typescript
// Component: hidden via CSS (not display:none, which bots detect)
<div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
  <label htmlFor="website">Website</label>
  <input
    type="text"
    id="website"
    name="website"
    tabIndex={-1}
    autoComplete="off"
  />
</div>
```

**Implementation Notes**:
- The field is named `website` (a field bots commonly fill).
- The field is positioned off-screen, not hidden via `display: none` (bots detect `display: none`).
- `tabIndex={-1}` removes it from keyboard navigation.
- `aria-hidden="true"` hides it from screen readers.
- If the field contains any value, the server silently rejects the submission (returns a fake success response to avoid tipping off the bot).
- The rejection is logged for analysis but does NOT count against the IP's rate limit.

### FR-SEC-022: Layer 7 -- Input Sanitization

**Requirement**: All text inputs MUST be sanitized server-side before storage.

```typescript
// lib/sanitize.ts
export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')           // Strip HTML tags
    .replace(/[<>'"]/g, '')            // Remove angle brackets and quotes
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control chars
    .normalize('NFC')                   // Normalize Unicode
    .trim()
    .slice(0, 2000)                    // Hard length limit
}
```

**Implementation Notes**:
- Sanitization runs AFTER Zod validation (Layer 4) and BEFORE database insertion.
- HTML tag stripping prevents stored XSS if form data is ever rendered in an admin interface.
- Unicode normalization (`NFC`) prevents homoglyph attacks and duplicate entries using visually identical but byte-different characters.
- The 2000-character hard limit is a defense against payload-size attacks, independent of the Zod schema's `max()` constraint.
- SQL injection is mitigated by Supabase's parameterized queries. Sanitization is defense-in-depth.

### FR-SEC-023: Layer 8 -- IP Hashing

**Requirement**: The submitter's IP address MUST be hashed with SHA-256 before storage. Raw IP addresses are NEVER persisted.

```typescript
// lib/ip-hash.ts
import { createHash } from 'crypto'

export function hashIP(ip: string): string {
  const salt = process.env.IP_HASH_SALT! // Stored in K8s Secret
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}
```

**Implementation Notes**:
- The IP address is read from the `x-forwarded-for` header (set by Nginx Ingress Controller) or `x-real-ip`.
- A secret salt (`IP_HASH_SALT`) is stored in K8s Secrets and prepended to the IP before hashing. This prevents rainbow table attacks against common IP ranges.
- The hashed IP is stored in the `ip_hash` column of `form_submissions` for rate limiting queries.
- Under GDPR, the hashed IP is not considered PII because it cannot be reversed. The salt ensures it cannot be correlated across services.
- The `x-forwarded-for` header chain is validated: only the rightmost non-private IP (the one set by the Nginx Ingress Controller) is used. This prevents IP spoofing via injected `X-Forwarded-For` headers from the client.

### FR-SEC-024: Server Action Orchestration

**Requirement**: The 8 layers MUST execute in the defined order. Each layer is a distinct, testable function.

```typescript
// Server Action execution order
export async function submitDemoRequest(formData: FormData) {
  // Layer 1: Client-side Zod (already ran in browser, not repeated here)

  // Layer 2: Extract Turnstile token
  const turnstileToken = formData.get('cf-turnstile-response') as string
  if (!turnstileToken) return { success: false, error: 'Verification required' }

  // Layer 3: Server-side Turnstile verification
  const ip = getClientIP(headers())
  const turnstileValid = await verifyTurnstile(turnstileToken, ip)
  if (!turnstileValid) return { success: false, error: 'Verification failed' }

  // Layer 4: Server-side Zod validation
  const parsed = demoRequestSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: formatZodErrors(parsed.error) }

  // Layer 5: Rate limiting
  const ipHash = hashIP(ip)
  const rateLimited = await checkRateLimit(ipHash, 'demo_request', 5, 3600)
  if (rateLimited) return { success: false, error: 'Too many requests. Please try again later.' }

  // Layer 6: Honeypot check
  const honeypot = formData.get('website') as string
  if (honeypot) {
    // Silent rejection: return fake success
    return { success: true, message: 'Demo request received.' }
  }

  // Layer 7: Input sanitization
  const sanitized = sanitizeFormData(parsed.data)

  // Layer 8: IP hashing (for storage)
  // ipHash already computed in Layer 5

  // Persist to Supabase
  await insertSubmission({ ...sanitized, ipHash, formType: 'demo_request' })

  // Send notification (non-blocking)
  sendNotificationEmail({ type: 'demo_request', data: sanitized }).catch(console.error)

  return { success: true, message: 'Demo request received. We will contact you within 1 business day.' }
}
```

**Acceptance Criteria**:
- All 8 layers execute sequentially for every form submission.
- Each layer has independent unit tests.
- Integration tests verify the full chain with mock Turnstile and Supabase responses.
- A submission that fails at any layer (except honeypot, which fakes success) receives a structured error response.

---

## 4. Rate Limiting

### FR-SEC-025: Supabase-Based Rate Limiting

**Requirement**: Rate limiting MUST be implemented via Supabase queries against the `form_submissions` table. No Redis dependency.

```typescript
// lib/rate-limit.ts
async function checkRateLimit(
  ipHash: string,
  formType: string,
  maxRequests: number,
  windowSeconds: number
): Promise<boolean> {
  const supabase = createServiceClient()
  const windowStart = new Date(Date.now() - windowSeconds * 1000).toISOString()

  const { count } = await supabase
    .from('form_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .eq('form_type', formType)
    .gte('created_at', windowStart)

  return (count ?? 0) >= maxRequests
}
```

### FR-SEC-026: Rate Limit Thresholds

**Requirement**: The following thresholds MUST be enforced. Thresholds are stored in environment variables for runtime configurability without redeployment.

| Form Type | Max Requests | Window | Env Var | Rationale |
|---|---|---|---|---|
| Demo request | 5 | 1 hour | `RATE_LIMIT_DEMO` | High-value form; low legitimate volume |
| Quote request | 5 | 1 hour | `RATE_LIMIT_QUOTE` | Same as demo |
| Contact form | 10 | 1 hour | `RATE_LIMIT_CONTACT` | Slightly more permissive for general inquiries |
| Newsletter signup | 3 | 1 hour | `RATE_LIMIT_NEWSLETTER` | One email per person |
| Analytics event | 100 | 1 minute | `RATE_LIMIT_ANALYTICS` | High volume, bounded |
| Global per IP | 50 | 5 minutes | `RATE_LIMIT_GLOBAL` | Catch-all across all form types |

### FR-SEC-027: Rate Limit Response Headers

**Requirement**: Rate-limited responses MUST return HTTP 429 with a `Retry-After` header.

```typescript
if (rateLimited) {
  return new Response(
    JSON.stringify({ error: 'Too many requests. Please try again later.' }),
    {
      status: 429,
      headers: {
        'Retry-After': String(windowSeconds),
        'Content-Type': 'application/json',
      },
    }
  )
}
```

### FR-SEC-028: Rate Limit Index

**Requirement**: The `form_submissions` table MUST have a composite index on `(ip_hash, form_type, created_at)` to ensure rate limit queries execute in < 10ms.

```sql
CREATE INDEX idx_form_submissions_rate_limit
ON form_submissions (ip_hash, form_type, created_at DESC);
```

---

## 5. Bot Protection

### FR-SEC-029: Cloudflare Turnstile Integration

**Requirement**: Cloudflare Turnstile MUST be integrated as the primary bot detection mechanism on all forms.

**Implementation Notes**:
- Mode: `managed` (invisible when possible, challenge when needed).
- Appearance: `interaction-only` (widget visible only when interaction is required).
- Theme: `auto` (matches system preference).
- Language: `auto` (detects browser language).
- The Turnstile widget is loaded via a `<script>` tag with the CSP nonce (FR-SEC-011).
- The widget container is placed within the form, before the submit button.

### FR-SEC-030: Turnstile Widget Lazy Loading

**Requirement**: The Turnstile script MUST be lazy-loaded when the form enters the viewport.

```typescript
// components/TurnstileWidget.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

export function TurnstileWidget({ onVerify, nonce }: Props) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0 })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (inView && !loaded) {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      script.defer = true
      script.nonce = nonce
      script.onload = () => setLoaded(true)
      document.head.appendChild(script)
    }
  }, [inView, loaded, nonce])

  return <div ref={ref} className="cf-turnstile" data-sitekey={siteKey} />
}
```

### FR-SEC-031: Turnstile K-12 Firewall Fallback

**Requirement**: The marketing site MUST implement a fallback mechanism for environments where `challenges.cloudflare.com` is blocked by school/institutional firewalls.

**Context**: Many K-12 school districts and some church networks use content filtering systems (e.g., Lightspeed, GoGuardian, Securly, iBoss) that block `challenges.cloudflare.com` as an uncategorized or CDN domain. Since K-12 is a primary buyer segment, this is a revenue-critical issue.

**Fallback Architecture**:

```
1. Attempt Turnstile verification (normal flow)
2. If Turnstile script fails to load within 10 seconds:
   a. Detect failure via script.onerror or timeout
   b. Show a visible notification: "Having trouble? Your network may block our verification service."
   c. Display fallback form with enhanced alternative protections:
      - Server-side honeypot (always active)
      - Time-based challenge (form must be open > 3 seconds before submission)
      - JavaScript proof-of-work (simple computation challenge)
      - Stricter rate limiting (3 submissions per IP per hour instead of 5)
   d. Flag the submission as `turnstile_bypassed: true` in Supabase
   e. Route these submissions to a manual review queue
3. Send a Slack alert when Turnstile fallback activates > 10 times per hour
   (indicates a systemic network issue, not individual bot attempts)
```

**Implementation Notes**:
- The fallback is NOT a full bypass. It replaces one verification layer with three compensating controls.
- Submissions flagged `turnstile_bypassed: true` are reviewed before entering the sales pipeline.
- A time-based challenge (minimum 3 seconds from form render to submission) stops automated submissions while being invisible to humans.
- The JavaScript proof-of-work is a simple computation (e.g., find a value whose SHA-256 hash starts with "00") that takes ~100ms on modern hardware but increases automated submission cost.
- Document the fallback in the security questionnaire response template ("SafeTrekr supports accessibility-first environments including school networks with restricted outbound connectivity").

### FR-SEC-032: Turnstile Error Monitoring

**Requirement**: Turnstile verification failures MUST be logged and monitored.

| Metric | Alert Threshold | Notification |
|---|---|---|
| Turnstile script load failures | > 10 per hour | Slack `#marketing-alerts` |
| Turnstile verification failures | > 20% of attempts | Slack `#marketing-alerts` |
| Turnstile API unreachable | Any occurrence | Slack `#marketing-alerts` + email |
| Fallback activations | > 10 per hour | Slack `#security-alerts` |

---

## 6. Supply Chain Security

### FR-SEC-033: Package Manager Lockfile Integrity

**Requirement**: `pnpm-lock.yaml` MUST be committed to the repository. CI MUST fail if the lockfile is out of sync with `package.json`.

```yaml
# .github/workflows/ci.yml
- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

**Implementation Notes**:
- `--frozen-lockfile` ensures CI uses the exact dependency tree from the lockfile.
- Any attempt to install a dependency not in the lockfile fails the build.
- The lockfile is reviewed as part of PR code review when dependency changes are made.

### FR-SEC-034: Automated Dependency Updates

**Requirement**: Dependabot MUST be configured for automated dependency update PRs.

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
      day: monday
    open-pull-requests-limit: 10
    reviewers:
      - safetrekr/security-review
    labels:
      - dependencies
      - security
    versioning-strategy: increase
    ignore:
      - dependency-name: '*'
        update-types: ['version-update:semver-major']
```

**Implementation Notes**:
- Dependabot opens PRs for patch and minor updates weekly.
- Major version updates are ignored by Dependabot and handled manually during quarterly dependency review.
- All Dependabot PRs run the full CI suite including security scans.
- Critical security updates (Dependabot security alerts) are merged within 24 hours.

### FR-SEC-035: Socket.dev Integration

**Requirement**: Socket.dev MUST be integrated into the CI pipeline to detect supply chain attacks.

**Implementation Notes**:
- Socket.dev analyzes npm packages for: typosquatting, install scripts, obfuscated code, network access, filesystem access, environment variable access, and known malware.
- The Socket.dev GitHub App comments on PRs that add or update dependencies.
- Any package flagged as "Critical" by Socket.dev blocks the PR merge.
- Socket.dev is preferred over `npm audit` alone because it detects supply chain attacks that vulnerability databases miss (e.g., event-stream incident pattern).

### FR-SEC-036: Subresource Integrity (SRI)

**Requirement**: All external scripts MUST use Subresource Integrity hashes where the CDN supports stable hashes.

```html
<script
  defer
  data-domain="safetrekr.com"
  src="https://plausible.io/js/script.js"
  integrity="sha384-{HASH}"
  crossorigin="anonymous"
  nonce="{NONCE}"
/>
```

**Implementation Notes**:
- Plausible's self-hosted script produces a stable hash that can be pinned.
- Turnstile's script is loaded from Cloudflare's CDN and its hash changes frequently. SRI is NOT applied to the Turnstile script. CSP's `script-src` allowlist provides the equivalent protection.
- SRI hashes are regenerated during dependency updates and stored in a constants file.

### FR-SEC-037: SBOM Generation

**Requirement**: A Software Bill of Materials (SBOM) MUST be generated in CI for every release.

```yaml
# .github/workflows/release.yml
- name: Generate SBOM
  run: npx @cyclonedx/cyclonedx-npm --output-file sbom.json --spec-version 1.5
- name: Upload SBOM
  uses: actions/upload-artifact@v4
  with:
    name: sbom
    path: sbom.json
```

**Implementation Notes**:
- CycloneDX format (JSON, spec version 1.5) is used for compatibility with enterprise security tools.
- The SBOM is stored as a CI artifact for every release.
- Enterprise buyers requesting an SBOM (common in K-12 procurement) receive the most recent artifact.
- The SBOM is NOT published publicly.

---

## 7. Secret Management

### FR-SEC-038: Kubernetes Secrets

**Requirement**: All secrets MUST be stored in Kubernetes Secrets objects, injected as environment variables into the application pods. Secrets are NEVER baked into Docker images.

```yaml
# k8s/secrets.yaml (template -- actual values via sealed-secrets or external-secrets)
apiVersion: v1
kind: Secret
metadata:
  name: safetrekr-marketing-secrets
  namespace: marketing
type: Opaque
stringData:
  SUPABASE_URL: ""
  SUPABASE_SERVICE_ROLE_KEY: ""
  SENDGRID_API_KEY: ""
  TURNSTILE_SECRET_KEY: ""
  IP_HASH_SALT: ""
  SENTRY_DSN: ""
  ENCRYPTION_KEY: ""  # For pgcrypto column-level encryption (future)
```

### FR-SEC-039: Secret Injection into Pods

**Requirement**: Secrets MUST be injected via `envFrom` or individual `env` references in the Deployment spec.

```yaml
# k8s/deployment.yaml
spec:
  containers:
    - name: safetrekr-marketing
      envFrom:
        - secretRef:
            name: safetrekr-marketing-secrets
        - configMapRef:
            name: safetrekr-marketing-config
```

**Implementation Notes**:
- `secretRef` injects all keys from the Secret as environment variables.
- `configMapRef` injects non-sensitive configuration (e.g., `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`).
- Public environment variables (prefixed `NEXT_PUBLIC_`) are stored in ConfigMaps, not Secrets.

### FR-SEC-040: No Secrets in Docker Images

**Requirement**: Docker images MUST NOT contain any secrets. The Dockerfile MUST NOT use `ARG` or `ENV` for secret values during build.

```dockerfile
# Dockerfile
FROM node:22-alpine AS base

# Build stage -- no secrets needed for static site build
FROM base AS builder
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
# NEXT_PUBLIC_ vars only -- no secrets
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_PLAUSIBLE_DOMAIN
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_PLAUSIBLE_DOMAIN=$NEXT_PUBLIC_PLAUSIBLE_DOMAIN
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN pnpm build

# Production stage -- minimal image
FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**Implementation Notes**:
- Multi-stage build: only the standalone output is copied to the production image.
- The application runs as a non-root user (`nextjs`, UID 1001).
- `NEXT_PUBLIC_` variables are baked in at build time (they are public by definition).
- All secret environment variables are injected at runtime by Kubernetes.

### FR-SEC-041: Secret Rotation Schedule

**Requirement**: Secrets MUST be rotatable without application downtime.

| Secret | Rotation Period | Rotation Method |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | On demand (compromise only) | Regenerate in Supabase dashboard, update K8s Secret, rolling restart |
| `SENDGRID_API_KEY` | 90 days | Generate new key in SendGrid, update K8s Secret, rolling restart, revoke old key |
| `TURNSTILE_SECRET_KEY` | On demand (compromise only) | Regenerate in Cloudflare dashboard, update K8s Secret, rolling restart |
| `IP_HASH_SALT` | Never (rotation invalidates rate-limiting history) | Accept risk; document in security decision log |
| `SENTRY_DSN` | On demand (compromise only) | Regenerate in Sentry, update K8s Secret, rolling restart |

### FR-SEC-042: Sealed Secrets or External Secrets Operator

**Requirement**: Secrets MUST NOT be stored in plaintext in the Git repository. Use one of the following approaches:

**Option A (Recommended): Sealed Secrets**
```bash
# Encrypt secret for cluster-specific public key
kubeseal --format yaml < k8s/secrets.yaml > k8s/sealed-secrets.yaml
# sealed-secrets.yaml is safe to commit to Git
```

**Option B: External Secrets Operator with DigitalOcean**
```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: safetrekr-marketing-secrets
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: digitalocean-secret-store
    kind: ClusterSecretStore
  target:
    name: safetrekr-marketing-secrets
  data:
    - secretKey: SUPABASE_SERVICE_ROLE_KEY
      remoteRef:
        key: safetrekr-marketing/supabase-service-role-key
```

**Implementation Notes**:
- Sealed Secrets is simpler and has no external dependency beyond the cluster controller.
- External Secrets Operator is preferred if DigitalOcean's managed secrets service is available.
- Either approach ensures secrets are encrypted at rest in Git and decrypted only within the cluster.

---

## 8. Network Security (Kubernetes)

### FR-SEC-043: Namespace Isolation

**Requirement**: The marketing site MUST run in a dedicated Kubernetes namespace (`marketing`) isolated from any other workloads.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: marketing
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

### FR-SEC-044: Kubernetes Network Policies

**Requirement**: Network policies MUST enforce least-privilege network access within the cluster.

```yaml
# k8s/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: marketing-default-deny
  namespace: marketing
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress

---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: marketing-allow-ingress
  namespace: marketing
spec:
  podSelector:
    matchLabels:
      app: safetrekr-marketing
  policyTypes:
    - Ingress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: ingress-nginx
      ports:
        - protocol: TCP
          port: 3000

---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: marketing-allow-egress
  namespace: marketing
spec:
  podSelector:
    matchLabels:
      app: safetrekr-marketing
  policyTypes:
    - Egress
  egress:
    # DNS resolution
    - to:
        - namespaceSelector: {}
          podSelector:
            matchLabels:
              k8s-app: kube-dns
      ports:
        - protocol: UDP
          port: 53
        - protocol: TCP
          port: 53
    # Supabase (external HTTPS)
    - to:
        - ipBlock:
            cidr: 0.0.0.0/0
            except:
              - 10.0.0.0/8
              - 172.16.0.0/12
              - 192.168.0.0/16
      ports:
        - protocol: TCP
          port: 443
```

**Implementation Notes**:
- The default-deny policy blocks all ingress and egress traffic to pods in the `marketing` namespace.
- Ingress is allowed only from the `ingress-nginx` namespace on port 3000 (the Next.js server port).
- Egress is allowed only for DNS resolution (kube-dns) and HTTPS (port 443) to external services (Supabase, SendGrid, Cloudflare Turnstile, Plausible).
- Private IP ranges are excluded from egress to prevent lateral movement to other cluster workloads.
- The DigitalOcean DOKS cluster must have a CNI that supports NetworkPolicy (Cilium is the default on DOKS).

### FR-SEC-045: Pod Security Standards (Restricted)

**Requirement**: The marketing namespace MUST enforce the `restricted` Pod Security Standard.

```yaml
# Deployment spec must comply with restricted PSS
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1001
    runAsGroup: 1001
    fsGroup: 1001
    seccompProfile:
      type: RuntimeDefault
  containers:
    - name: safetrekr-marketing
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop:
            - ALL
      volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: nextjs-cache
          mountPath: /app/.next/cache
  volumes:
    - name: tmp
      emptyDir: {}
    - name: nextjs-cache
      emptyDir: {}
```

**Implementation Notes**:
- `runAsNonRoot: true` prevents the container from running as root.
- `readOnlyRootFilesystem: true` prevents writes to the container filesystem. Writable directories (`/tmp`, `.next/cache`) are mounted as `emptyDir` volumes.
- `allowPrivilegeEscalation: false` prevents `setuid`/`setgid` binaries from elevating privileges.
- All Linux capabilities are dropped.
- `seccompProfile: RuntimeDefault` applies the container runtime's default seccomp profile.
- The namespace label `pod-security.kubernetes.io/enforce: restricted` rejects any pod that violates these constraints.

### FR-SEC-046: Resource Limits

**Requirement**: All pods MUST have resource requests and limits defined to prevent resource exhaustion attacks.

```yaml
resources:
  requests:
    cpu: 100m
    memory: 256Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

### FR-SEC-047: Horizontal Pod Autoscaler

**Requirement**: An HPA MUST be configured to handle traffic spikes while maintaining security controls.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: safetrekr-marketing-hpa
  namespace: marketing
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: safetrekr-marketing
  minReplicas: 2
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

**Implementation Notes**:
- `minReplicas: 2` ensures high availability (one pod can fail without downtime).
- `maxReplicas: 8` caps scaling to prevent cost runaway during DDoS.
- CPU target of 70% provides headroom for request spikes.

---

## 9. SSL/TLS Certificate Management

### FR-SEC-048: cert-manager with Let's Encrypt

**Requirement**: TLS certificates MUST be provisioned and renewed automatically via cert-manager with Let's Encrypt.

```yaml
# k8s/cert-manager/cluster-issuer.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: security@safetrekr.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx

---
# k8s/cert-manager/certificate.yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: safetrekr-marketing-tls
  namespace: marketing
spec:
  secretName: safetrekr-marketing-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
    - safetrekr.com
    - www.safetrekr.com
  renewBefore: 720h  # 30 days before expiry
```

### FR-SEC-049: TLS Configuration on Nginx Ingress

**Requirement**: The Nginx Ingress Controller MUST enforce TLS 1.2+ with secure cipher suites.

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: safetrekr-marketing
  namespace: marketing
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/ssl-protocols: "TLSv1.2 TLSv1.3"
    nginx.ingress.kubernetes.io/ssl-ciphers: "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384"
    nginx.ingress.kubernetes.io/ssl-prefer-server-ciphers: "true"
    nginx.ingress.kubernetes.io/hsts: "true"
    nginx.ingress.kubernetes.io/hsts-max-age: "31536000"
    nginx.ingress.kubernetes.io/hsts-include-subdomains: "true"
    nginx.ingress.kubernetes.io/hsts-preload: "true"
    nginx.ingress.kubernetes.io/configuration-snippet: |
      more_set_headers "X-Frame-Options: DENY";
      more_set_headers "X-Content-Type-Options: nosniff";
      more_set_headers "Referrer-Policy: strict-origin-when-cross-origin";
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - safetrekr.com
        - www.safetrekr.com
      secretName: safetrekr-marketing-tls
  rules:
    - host: safetrekr.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: safetrekr-marketing
                port:
                  number: 3000
```

**Implementation Notes**:
- TLS 1.0 and 1.1 are explicitly excluded. Only TLS 1.2 and 1.3 are permitted.
- Cipher suites prioritize ECDHE for forward secrecy and AES-GCM for authenticated encryption.
- `ssl-redirect: true` and `force-ssl-redirect: true` ensure all HTTP traffic is redirected to HTTPS.
- The `configuration-snippet` adds security headers at the Nginx level as defense-in-depth (the application middleware also sets them).
- cert-manager automatically renews certificates 30 days before expiry.
- Certificate expiry monitoring: alert if any certificate is < 14 days from expiry (indicates cert-manager failure).

### FR-SEC-050: Cloudflare SSL/TLS Mode

**Requirement**: If Cloudflare is used as a CDN/proxy layer, it MUST be configured in Full (Strict) mode.

| Setting | Value | Rationale |
|---|---|---|
| SSL/TLS encryption mode | Full (Strict) | Validates the origin certificate against a trusted CA |
| Minimum TLS version | 1.2 | Matches Nginx Ingress configuration |
| Always Use HTTPS | On | Redirect HTTP to HTTPS at the edge |
| HSTS | Enabled (31536000, includeSubDomains, preload) | Dual-layer HSTS enforcement |
| TLS 1.3 | On | Modern protocol with 0-RTT support |
| Automatic HTTPS Rewrites | On | Fix mixed content in responses |

---

## 10. CORS Policy

### FR-SEC-051: CORS Configuration

**Requirement**: API routes MUST implement a restrictive CORS policy that allows requests only from the marketing site's own origins.

```typescript
// lib/cors.ts
const ALLOWED_ORIGINS = [
  'https://safetrekr.com',
  'https://www.safetrekr.com',
  // Staging origin (if applicable)
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
].filter(Boolean) as string[]

export function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('origin')
  const isAllowed = origin && ALLOWED_ORIGINS.includes(origin)

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Turnstile-Token',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  }
}
```

**Implementation Notes**:
- `Access-Control-Allow-Origin` reflects the request origin only if it matches the allowlist. An empty value is returned for unrecognized origins (not `*`).
- Only `POST` and `OPTIONS` methods are permitted (forms submit via POST; OPTIONS handles preflight).
- `Vary: Origin` ensures CDN caches do not serve a CORS response for one origin to a different origin.
- The `health` endpoint and CSP report endpoint are exempt from CORS restrictions (they do not return sensitive data).
- `Access-Control-Allow-Credentials` is NOT set because the marketing site does not use cookies for API authentication.

### FR-SEC-052: OPTIONS Preflight Handler

**Requirement**: All API routes MUST handle OPTIONS requests for CORS preflight.

```typescript
// app/api/demo-request/route.ts
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request),
  })
}
```

---

## 11. Cookie Security

### FR-SEC-053: Cookie Defaults

**Requirement**: Any cookies set by the marketing site MUST use secure defaults.

| Attribute | Value | Rationale |
|---|---|---|
| `Secure` | `true` (always) | Cookies are only sent over HTTPS |
| `HttpOnly` | `true` (for server-readable cookies) | Prevents JavaScript access, mitigates XSS cookie theft |
| `SameSite` | `Strict` (default), `Lax` for cross-site navigation cookies | Prevents CSRF |
| `Path` | `/` or scoped to specific route | Limits cookie scope |
| `Domain` | Not set (defaults to exact host) | Do not set `.safetrekr.com` unless SSO requires it |
| `Max-Age` | Shortest viable duration | Minimize exposure window |

### FR-SEC-054: Cookie Inventory

**Requirement**: The marketing site MUST maintain a documented cookie inventory. At launch, the inventory is minimal.

| Cookie | Purpose | HttpOnly | Secure | SameSite | Max-Age | Set By |
|---|---|---|---|---|---|---|
| `_plausible_session` | N/A -- Plausible does not set cookies | -- | -- | -- | -- | -- |
| `__cf_turnstile` | Turnstile verification state | Yes | Yes | Lax | Session | Cloudflare |
| `consent_preferences` | GA4 consent state (if GA4 enabled) | No | Yes | Strict | 365 days | Application |
| `session_id` | Anonymous session for analytics | No | Yes | Lax | 30 minutes | Application |

**Implementation Notes**:
- Plausible Analytics is explicitly chosen because it does NOT use cookies, localStorage, or fingerprinting. This eliminates the need for a cookie consent banner for analytics.
- The `session_id` cookie is an opaque UUID for session-level analytics aggregation. It contains no PII and is not linked to any user identity.
- The `consent_preferences` cookie is only set if GA4 is enabled (it is disabled at launch).
- The `Domain` attribute is NOT set on any cookie. This prevents cookies from being shared with `app.safetrekr.com`. When SSO is implemented (future), the `Domain` attribute will be set to `.safetrekr.com` for the SSO token cookie only, with explicit documentation.
- New cookies require a security review before introduction. Adding a cookie updates this inventory and the privacy policy.

---

## 12. GDPR/CCPA Compliance

### FR-SEC-055: Data Minimization

**Requirement**: Forms MUST collect only the data required for the stated purpose. No optional fields are required.

| Form | Required Fields | Optional Fields | Justification |
|---|---|---|---|
| Demo request | name, email, organization, org type, trip volume | preferred format, message | Minimum needed to prepare a relevant demo |
| Contact | name, email, message | organization, phone | Minimum for a response |
| Newsletter | email | name | Minimum for newsletter delivery |
| Quote request | name, email, organization, org type, trip details | message | Minimum for an accurate quote |

**Implementation Notes**:
- No hidden data collection beyond what is disclosed in the privacy policy.
- UTM parameters and referrer are captured from the URL/headers (not form fields) and disclosed in the privacy policy.
- Country code is derived from the Nginx `X-Real-IP` header via GeoIP lookup (not client-side geolocation API).
- The IP hash is stored for rate limiting (disclosed in privacy policy). The raw IP is never stored.

### FR-SEC-056: Right to Access (GDPR Art. 15 / CCPA Right to Know)

**Requirement**: Users MUST be able to request all data associated with their email address.

**Implementation**:
- A dedicated email address (`privacy@safetrekr.com`) receives access requests.
- A Supabase function queries all tables for matching email: `form_submissions`, `newsletter_subscribers`, `analytics_events` (if email is associated).
- Response is a JSON export delivered within 30 days (GDPR) / 45 days (CCPA).
- Identity verification: the request must come from the same email address, or the requester must prove ownership.

### FR-SEC-057: Right to Erasure (GDPR Art. 17 / CCPA Right to Delete)

**Requirement**: Users MUST be able to request deletion of all their data.

```sql
-- Erasure procedure
BEGIN;
  DELETE FROM newsletter_subscribers WHERE email = $1;
  DELETE FROM form_submissions WHERE email = $1;
  DELETE FROM crm_sync_queue WHERE payload->>'email' = $1;
  -- analytics_events: anonymize (remove email, retain aggregate event data)
  UPDATE analytics_events SET metadata = metadata - 'email'
    WHERE metadata->>'email' = $1;
COMMIT;
```

**Implementation Notes**:
- Deletion is cascading: all related records are removed in a single transaction.
- Analytics events are anonymized (email removed from metadata) rather than deleted, preserving aggregate metrics.
- A confirmation email is sent to the requester after deletion.
- Deletion requests are logged in an audit table (containing only the request timestamp and a success/failure flag, NOT the deleted data).

### FR-SEC-058: Privacy Policy

**Requirement**: A comprehensive privacy policy MUST be published at `/legal/privacy`.

**Required Sections**:
1. What data we collect (enumerated by form type)
2. Why we collect it (lawful basis: consent for forms, legitimate interest for analytics)
3. How we store it (Supabase, US East region, encrypted at rest)
4. Who we share it with (SendGrid for email, no data sales)
5. How long we retain it (see retention schedule)
6. Your rights (access, erasure, portability, objection)
7. Contact for privacy requests (`privacy@safetrekr.com`)
8. Cookie policy (Plausible: no cookies; optional GA4: requires consent)
9. Children's privacy (SafeTrekr marketing site does not knowingly collect data from children under 13; the product's COPPA compliance is separate)
10. Changes to policy (notification method, effective date)

### FR-SEC-059: Data Retention Schedule

| Data Type | Retention Period | Rationale | Deletion Method |
|---|---|---|---|
| Form submissions | 3 years | Sales pipeline tracking; contractual reference | Automated purge job |
| Newsletter subscribers | Until unsubscribe + 30 days | GDPR right to erasure buffer | Manual + automated |
| Analytics events | 13 months | Aligned with analytics industry standard | Automated purge job |
| CSP violation reports | 90 days | Short-term security monitoring | Automated purge job |
| Rate limit data (IP hashes) | 13 months | Co-located with analytics events | Automated purge job |
| Turnstile tokens | 7 days | Short-term audit | Automated purge job |

### FR-SEC-060: "Do Not Sell My Personal Information"

**Requirement**: A "Do Not Sell My Personal Information" link MUST appear in the site footer, linking to the privacy policy's opt-out section.

**Implementation Notes**:
- SafeTrekr does not sell personal data. The link leads to a clear statement of this fact.
- The link is present for CCPA compliance even though it is a no-op.
- The privacy policy states: "SafeTrekr does not sell, rent, or trade your personal information to third parties for their marketing purposes."

### FR-SEC-061: Consent Management

**Requirement**: If GA4 is enabled (it is disabled at launch), a consent management banner MUST appear before any GA4 scripts load.

**Implementation Notes**:
- Plausible Analytics does not require consent (no cookies, no PII).
- GA4 scripts load ONLY after explicit opt-in consent.
- Consent state is stored in `localStorage` (not a cookie) with the key `consent_preferences`.
- Consent is granular: analytics and marketing tracking are separate consent categories.
- Consent can be revoked at any time via a link in the footer ("Manage Cookie Preferences").

---

## 13. WCAG 2.2 AA (Accessibility as Security)

Accessibility is a security and compliance requirement, not a design preference. K-12 procurement requires Section 508 compliance. Government contracts require WCAG 2.2 AA. A site that fails accessibility fails the procurement security questionnaire.

### FR-SEC-062: Accessibility CI Gates

**Requirement**: Accessibility compliance MUST be enforced in CI. Builds MUST fail on violations.

| Tool | CI Integration | Gate Threshold |
|---|---|---|
| `axe-core` | Playwright + `@axe-core/playwright` | 0 violations (critical, serious) |
| Lighthouse Accessibility | `@lhci/cli` | Score >= 95 |
| `eslint-plugin-jsx-a11y` | ESLint | 0 errors (warnings allowed for review) |

### FR-SEC-063: Keyboard Navigation

**Requirement**: All interactive elements MUST be fully operable via keyboard.

- Tab order follows visual layout (no `tabIndex` > 0).
- Skip navigation link as the first focusable element.
- Focus-visible indicators: 2px ring with 3:1 contrast ratio against adjacent colors.
- No keyboard traps: Escape closes modals/dropdowns, focus returns to trigger.
- Forms are fully submittable via keyboard (Enter submits, Tab navigates fields).
- Mobile navigation overlay: focus is trapped within the overlay while open; Escape closes it.

### FR-SEC-064: Screen Reader Compatibility

**Requirement**: All content MUST be accessible to screen readers.

- ARIA landmarks: `<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>` used semantically.
- `aria-current="page"` on active navigation links.
- `aria-expanded` and `aria-controls` on dropdown triggers.
- `aria-describedby` links form error messages to their fields.
- `aria-live="polite"` on form submission status messages.
- `aria-hidden="true"` on decorative elements (icons, background SVGs).
- All images have meaningful `alt` text (enforced by `eslint-plugin-jsx-a11y`).

### FR-SEC-065: Motion and Animation Safety

**Requirement**: All animations MUST respect `prefers-reduced-motion`.

```typescript
// lib/motion.ts
import { useReducedMotion } from 'framer-motion'

// Global: Framer Motion animations are disabled when user prefers reduced motion
// Content is visible immediately without animation
```

**Implementation Notes**:
- No animation faster than 3 flashes per second (WCAG 2.3.1).
- All content is visible without animation (animation is enhancement only).
- `prefers-reduced-motion: reduce` disables all scroll-triggered animations, hero transitions, and page transitions.
- Turnstile widget is static when reduced motion is preferred.

### FR-SEC-066: Color Contrast

**Requirement**: All text MUST meet WCAG 2.2 AA contrast ratios.

| Element | Minimum Ratio | Verified In |
|---|---|---|
| Normal text (< 18pt) | 4.5:1 | Design tokens CI check |
| Large text (>= 18pt or >= 14pt bold) | 3:1 | Design tokens CI check |
| UI components (buttons, inputs) | 3:1 | axe-core in CI |
| Focus indicators | 3:1 against adjacent colors | Manual + axe-core |

**Implementation Notes**:
- The CTA architect's finding is incorporated: `muted-foreground` corrected from `#616567` (4.0:1 FAIL) to `#4d5153` (5.2:1 PASS). Button `primary-600` uses `#3f885b` (4.6:1 with white) instead of `primary-500` `#4ca46e` (3.4:1 FAIL for small text).
- Contrast ratios are verified in CI via a custom script that checks all token combinations.

### FR-SEC-067: VPAT (Voluntary Product Accessibility Template)

**Requirement**: A VPAT MUST be published at `/legal/vpat` or `/procurement/vpat` documenting conformance with Section 508 and WCAG 2.2 AA.

**Implementation Notes**:
- Use the ITI VPAT 2.5 template (WCAG 2.2 edition).
- The VPAT is a downloadable PDF and an HTML page.
- Update the VPAT quarterly or after any significant UI change.
- The VPAT is a critical procurement artifact for K-12 and government buyers.

---

## 14. Incident Response Plan

### FR-SEC-068: Marketing Site Compromise Scenario

**Requirement**: A documented incident response plan MUST exist for the marketing site compromise scenario.

**Scenario Classification**:

| Severity | Definition | Response Time | Escalation |
|---|---|---|---|
| P0 (Critical) | Site defacement, malware injection, data breach, forms non-functional | < 15 minutes | Founder + security lead |
| P1 (High) | Partial functionality loss, one form broken, performance degradation | < 1 hour | Security lead |
| P2 (Medium) | CSP violations spike, minor visual regression, analytics failure | < 4 hours | Engineering lead |
| P3 (Low) | Non-critical bug, typo, minor styling issue | Next business day | On-call engineer |

### FR-SEC-069: Detection Layer

**Requirement**: Multiple independent detection mechanisms MUST monitor the marketing site.

| Detection Method | Target | Frequency | Alert Channel |
|---|---|---|---|
| UptimeRobot | `https://safetrekr.com/api/health` | Every 60 seconds | Slack + Email + PagerDuty (P0) |
| Sentry | Error rate spike | Continuous | Slack + PagerDuty (> 10 errors in 5 min) |
| CSP violation reports | `/api/csp-report` | Continuous | Slack (> 5/hour) |
| Lighthouse CI | Performance + accessibility | On deploy | GitHub PR check |
| Cloudflare Analytics | DDoS patterns, traffic anomalies | Continuous | Cloudflare dashboard |
| Certificate expiry | cert-manager Certificate resource | Daily | Slack (< 14 days to expiry) |

### FR-SEC-070: Response Runbooks

**Requirement**: Documented runbooks MUST exist for each incident type.

**Runbook 1: Site Defacement / Malware Injection**
```
1. CONTAIN: Immediately rollback to previous known-good deployment
   kubectl rollout undo deployment/safetrekr-marketing -n marketing
2. ASSESS: Compare current container image hash to last known-good
   kubectl describe pod -n marketing | grep Image
3. INVESTIGATE: Check recent deployments and CI logs
   - Review GitHub Actions runs for unauthorized changes
   - Check container registry for unauthorized image pushes
   - Review Supabase audit logs for unauthorized data access
4. ERADICATE: Identify the attack vector
   - Compromised dependency? Run Socket.dev scan on affected versions
   - Compromised CI/CD? Rotate all GitHub Actions secrets
   - Compromised K8s? Review RBAC audit logs
5. RECOVER: Deploy verified clean image
   - Rebuild from trusted commit
   - Rotate all secrets (Supabase, SendGrid, Turnstile)
   - Clear CDN cache
6. COMMUNICATE: Notify affected parties if data was accessed
7. POSTMORTEM: Document timeline, root cause, and preventive measures
```

**Runbook 2: Form Submission Failures**
```
1. CHECK: Supabase service status (https://status.supabase.com)
2. CHECK: Cloudflare Turnstile status
3. CHECK: SendGrid status (email notification failures)
4. VERIFY: K8s pod health
   kubectl get pods -n marketing
   kubectl logs -n marketing -l app=safetrekr-marketing --tail=100
5. TEST: Submit a test form manually
6. If Supabase is down: Enable form data queuing (localStorage fallback)
7. If Turnstile is down: Activate K-12 fallback (FR-SEC-031)
8. If application error: Rollback to previous deployment
```

**Runbook 3: DDoS / Traffic Spike**
```
1. IDENTIFY: Cloudflare analytics for attack pattern
2. RATE-LIMIT: Verify Supabase rate limiting is active
3. SCALE: Check HPA status
   kubectl get hpa -n marketing
4. BLOCK: If attack source identified, add Cloudflare WAF rule
5. CACHE: Ensure Nginx caching is active for static assets
6. MONITOR: Watch pod CPU/memory
   kubectl top pods -n marketing
```

### FR-SEC-071: Health Check Endpoint

**Requirement**: A health check endpoint MUST exist at `/api/health` that validates all critical dependencies.

```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    supabase: await checkSupabase(),
    timestamp: new Date().toISOString(),
    version: process.env.GIT_SHA ?? 'unknown',
  }

  const healthy = checks.supabase === 'connected'

  return Response.json(
    { status: healthy ? 'healthy' : 'degraded', checks },
    { status: healthy ? 200 : 503 }
  )
}
```

**Implementation Notes**:
- The health endpoint does NOT check SendGrid on every request (would consume API quota). SendGrid health is checked every 5 minutes via a separate cron.
- UptimeRobot polls this endpoint every 60 seconds.
- A 503 status triggers alerting.
- The endpoint returns the Git SHA for deployment verification.

### FR-SEC-072: Backup and Recovery

**Requirement**: Form submission data MUST be backed up with a recovery plan.

| Backup Method | Frequency | Retention | Recovery Time |
|---|---|---|---|
| Supabase PITR (Point-in-Time Recovery) | Continuous | 7 days (Pro plan) | < 1 hour |
| Weekly Supabase pg_dump export | Weekly (GitHub Actions cron) | 90 days (DigitalOcean Spaces) | < 4 hours |
| Email notification copies | Per submission | Indefinite (in email) | Manual extraction |

---

## 15. Dependency Vulnerability Scanning

### FR-SEC-073: CI Pipeline Security Scanning

**Requirement**: The CI pipeline MUST include automated vulnerability scanning on every PR and merge to main.

```yaml
# .github/workflows/security.yml
name: Security Scanning
on:
  pull_request:
  push:
    branches: [main]
  schedule:
    - cron: '0 6 * * 1'  # Weekly Monday 6am UTC

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm audit --audit-level=high
        continue-on-error: false

  socket:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: SocketDev/socket-security-action@v1
        with:
          repo_token: ${{ secrets.GITHUB_TOKEN }}

  docker-scan:
    runs-on: ubuntu-latest
    needs: [audit]
    steps:
      - uses: actions/checkout@v4
      - name: Build image
        run: docker build -t safetrekr-marketing:scan .
      - name: Trivy scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: safetrekr-marketing:scan
          format: sarif
          output: trivy-results.sarif
          severity: CRITICAL,HIGH
          exit-code: 1
      - name: Upload Trivy results
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: trivy-results.sarif
```

### FR-SEC-074: npm Audit

**Requirement**: `pnpm audit` MUST run on every PR and block merges on high or critical vulnerabilities.

**Implementation Notes**:
- `--audit-level=high` means any vulnerability rated High or Critical fails the build.
- Medium and Low vulnerabilities are logged but do not block merges.
- Exception process: if a high-severity vulnerability has no available fix, document in `security-exceptions.md` with a review date (max 30 days).

### FR-SEC-075: Socket.dev Deep Analysis

**Requirement**: Socket.dev MUST analyze every dependency change for supply chain attack indicators.

**Socket.dev detects**:
- Typosquatting (package names similar to popular packages)
- Install scripts that execute arbitrary code
- Obfuscated code
- Network access from packages that should not need it
- Filesystem access outside the project directory
- Environment variable access (credential harvesting)
- Known malware signatures

### FR-SEC-076: Container Image Scanning (Trivy)

**Requirement**: Every Docker image MUST be scanned with Trivy before being pushed to the container registry.

**Implementation Notes**:
- Trivy scans for OS-level and application-level vulnerabilities.
- `exit-code: 1` ensures the pipeline fails on Critical or High findings.
- Results are uploaded as SARIF to GitHub's Code Scanning for centralized visibility.
- Base image (`node:22-alpine`) is rebuilt weekly to pick up OS-level patches.

### FR-SEC-077: Weekly Scheduled Scan

**Requirement**: A full security scan MUST run weekly even if no code changes occurred.

**Rationale**: New CVEs are published daily. A dependency that was clean last week may have a Critical CVE today. The weekly cron job (`0 6 * * 1`) catches these without waiting for a code change.

### FR-SEC-078: Dependabot Security Alerts

**Requirement**: Dependabot security alerts MUST be enabled on the repository with the following SLAs.

| Severity | Response SLA | Action |
|---|---|---|
| Critical | 24 hours | Merge Dependabot PR or apply manual fix |
| High | 72 hours | Merge Dependabot PR or apply manual fix |
| Medium | 7 days | Review and merge or document exception |
| Low | 30 days | Review at next dependency maintenance window |

---

## Implementation Priority

| Priority | Requirements | Sprint | Effort |
|---|---|---|---|
| P0 -- Ship at Launch | FR-SEC-001 to FR-SEC-008 (Headers), FR-SEC-009 to FR-SEC-015 (CSP in report-only mode), FR-SEC-016 to FR-SEC-024 (Form Security), FR-SEC-025 to FR-SEC-028 (Rate Limiting), FR-SEC-029 to FR-SEC-030 (Turnstile), FR-SEC-038 to FR-SEC-040 (Secrets), FR-SEC-043 to FR-SEC-046 (K8s Security), FR-SEC-048 to FR-SEC-050 (TLS), FR-SEC-051 to FR-SEC-052 (CORS), FR-SEC-053 to FR-SEC-054 (Cookies), FR-SEC-062 to FR-SEC-066 (Accessibility CI), FR-SEC-071 (Health Check), FR-SEC-073 to FR-SEC-074 (npm audit in CI) | Weeks 1-4 | ~5 days total |
| P1 -- Within 30 Days | FR-SEC-031 (Turnstile Fallback), FR-SEC-033 to FR-SEC-037 (Supply Chain), FR-SEC-042 (Sealed Secrets), FR-SEC-047 (HPA), FR-SEC-055 to FR-SEC-061 (GDPR/CCPA), FR-SEC-067 (VPAT), FR-SEC-075 to FR-SEC-078 (Socket.dev, Trivy, Dependabot) | Weeks 5-8 | ~4 days total |
| P2 -- Within 60 Days | FR-SEC-014 (CSP enforcement after report-only), FR-SEC-015 (CSP violation dashboard), FR-SEC-032 (Turnstile monitoring dashboard), FR-SEC-041 (Secret rotation schedule), FR-SEC-068 to FR-SEC-072 (Incident Response + Backup), FR-SEC-044 hardening (egress IP allowlisting) | Weeks 9-12 | ~3 days total |

---

## Risk Register (Security-Specific)

| ID | Risk | Likelihood | Impact | Score | Mitigation |
|---|---|---|---|---|---|
| SEC-R01 | Nonce-based CSP breaks Turnstile or MapLibre in unexpected browsers | Medium | High | 8 | Deploy in report-only mode for 7 days (FR-SEC-014); monitor violations; have `unsafe-inline` fallback ONLY as emergency rollback |
| SEC-R02 | K-12 school firewalls block challenges.cloudflare.com | High | High | 9 | Fallback mechanism with compensating controls (FR-SEC-031) |
| SEC-R03 | Supabase service_role key leaked via logs or error messages | Low | Critical | 8 | Never log the key; Sentry scrubs env vars by default; K8s Secret injection at runtime only |
| SEC-R04 | Supply chain attack via compromised npm package | Low | Critical | 8 | Socket.dev (FR-SEC-075) + frozen lockfile (FR-SEC-033) + Dependabot (FR-SEC-034) |
| SEC-R05 | DDoS overwhelms rate limiting | Low | Medium | 4 | Cloudflare WAF as first layer; K8s HPA for scaling; rate limiting is per-IP, not global |
| SEC-R06 | cert-manager renewal failure causes certificate expiry | Low | High | 6 | 30-day pre-expiry renewal; certificate expiry alerting at 14 days |
| SEC-R07 | GDPR erasure request misses data in CRM sync queue | Medium | Medium | 6 | Cascading delete includes crm_sync_queue (FR-SEC-057) |
| SEC-R08 | CSP report endpoint used for reconnaissance | Low | Low | 2 | Rate limit the CSP report endpoint; log but do not expose report data publicly |

---

## Security Checklist for Enterprise Buyers

The following controls can be cited in security questionnaires and procurement evaluations:

1. Nonce-based Content Security Policy (no `unsafe-inline`, no `unsafe-eval`)
2. HSTS with preload, TLS 1.2+ only, forward-secrecy cipher suites
3. 8-layer form defense (validation, CAPTCHA, rate limiting, honeypot, sanitization, IP hashing)
4. Zero PII in analytics (Plausible: no cookies, no fingerprinting)
5. IP addresses hashed with SHA-256 before storage (never stored in plaintext)
6. Kubernetes Pod Security Standards (restricted profile)
7. Network Policies enforcing least-privilege pod communication
8. Automated dependency scanning (npm audit, Socket.dev, Trivy)
9. SBOM generation for every release (CycloneDX format)
10. GDPR/CCPA compliance (data minimization, right to erasure, right to access)
11. WCAG 2.2 AA compliance with CI enforcement (axe-core, Lighthouse >= 95)
12. Automated certificate management (cert-manager + Let's Encrypt)
13. No secrets in Docker images (runtime injection via K8s Secrets)
14. CSP violation monitoring and alerting
15. Documented incident response runbooks with defined SLAs

---

## Architecture Decision Records

| ADR | Decision | Alternatives Considered | Rationale |
|---|---|---|---|
| SEC-ADR-001 | Nonce-based CSP over hash-based | `unsafe-inline`, hash-based CSP | Nonces are per-request unique; hashes require pre-computing all inline scripts; `unsafe-inline` is prohibited |
| SEC-ADR-002 | Supabase rate limiting over Redis | Redis, Upstash, in-memory | No additional infrastructure dependency; Supabase is already in the stack; query performance is sufficient with proper indexing |
| SEC-ADR-003 | Sealed Secrets over plaintext K8s Secrets in Git | Plaintext Secrets (gitignored), External Secrets Operator, HashiCorp Vault | Sealed Secrets is simple, requires no external service, and encrypts secrets for Git storage |
| SEC-ADR-004 | Turnstile over reCAPTCHA | reCAPTCHA v3, hCaptcha | Free, privacy-preserving, no Google dependency. K-12 buyers are sensitive to Google tracking |
| SEC-ADR-005 | Socket.dev over npm audit alone | npm audit only, Snyk, GitHub Advisory Database | Socket.dev detects supply chain attacks that vulnerability databases miss (typosquatting, malicious scripts) |
| SEC-ADR-006 | Pod Security Standards over PodSecurityPolicy | PodSecurityPolicy (deprecated), OPA/Gatekeeper | PSS is built into K8s 1.25+, zero dependency, namespace-level enforcement |

---

*This document is the authoritative security specification for the SafeTrekr Marketing Site. All implementation MUST conform to these requirements. Deviations require a documented risk acceptance with an expiration date in `security-decision-log.md`.*


---

# Digital Marketing Lead PRD: SafeTrekr Marketing Site

**Date**: 2026-03-24
**Persona**: World-Class Digital Marketing Lead / AI Search Optimization Strategist
**Project**: SafeTrekr Marketing Site (Greenfield)
**Tech Stack**: Next.js 15 (App Router) + React 19 + Tailwind CSS 4 + DigitalOcean DOKS + SendGrid
**Deployment**: Docker containers on DigitalOcean Kubernetes (DOKS) with Nginx Ingress
**Status**: Persona-Specific PRD -- Implementation-Ready Functional Requirements

---

## Document Purpose

This PRD defines every functional requirement owned by the Digital Marketing Lead persona. It covers technical SEO infrastructure, structured data (JSON-LD), AI search optimization, content marketing systems, analytics, email capture and nurture, social proof, paid acquisition readiness, and performance monitoring. Every FR includes acceptance criteria, implementation guidance, and dependency mapping.

All requirements are written against the confirmed tech stack: Next.js 15 standalone output in Docker on DigitalOcean Kubernetes, Nginx Ingress for SSL termination and caching, Plausible Analytics (primary), SendGrid for transactional and nurture email, and Cloudflare for DNS/CDN.

---

## Table of Contents

1. [Technical SEO Infrastructure](#1-technical-seo-infrastructure)
2. [Schema Markup (JSON-LD)](#2-schema-markup-json-ld)
3. [AI Search Optimization](#3-ai-search-optimization)
4. [Content Marketing System](#4-content-marketing-system)
5. [Analytics Infrastructure](#5-analytics-infrastructure)
6. [Email Capture and Nurture](#6-email-capture-and-nurture)
7. [Social Proof System](#7-social-proof-system)
8. [Paid Acquisition Readiness](#8-paid-acquisition-readiness)
9. [Performance Monitoring](#9-performance-monitoring)
10. [Dependencies and Sequencing](#10-dependencies-and-sequencing)
11. [Metrics and Targets](#11-metrics-and-targets)
12. [Risks](#12-risks)

---

## 1. Technical SEO Infrastructure

### FR-SEO-001: Programmatic Sitemap Generation

**Priority**: P0 (Launch Blocker)
**Depends On**: Next.js 15 App Router setup, MDX content pipeline

**Description**: Dynamic XML sitemap generated at build time via `/app/sitemap.ts`. Must include all static marketing pages with manually assigned priorities, all MDX blog posts with `lastModified` from frontmatter, and all MDX guide pages. Sitemap is submitted to Google Search Console and referenced in `robots.txt`.

**Acceptance Criteria**:

- [ ] `/sitemap.xml` returns valid XML with all published URLs
- [ ] Static core pages include `changeFrequency` and `priority` values matching the defined hierarchy (homepage 1.0, solutions/pricing/how-it-works 0.9, platform features 0.7-0.8, blog 0.7, company 0.5-0.6)
- [ ] Blog posts are dynamically included with `lastModified` derived from `updatedAt` or `publishedAt` frontmatter
- [ ] Guide pages under `/resources/guides/` are dynamically included
- [ ] No draft or unpublished content appears in the sitemap
- [ ] Sitemap URL matches `https://www.safetrekr.com/sitemap.xml`
- [ ] Lighthouse SEO audit passes sitemap validation
- [ ] Sitemap regenerates on every Docker image build (build-time generation)

**Implementation Notes**:

```typescript
// /app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllBlogPosts, getAllGuides } from '@/lib/content';

const BASE_URL = 'https://www.safetrekr.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const corePages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    // Solutions (highest conversion value)
    { url: `${BASE_URL}/solutions/k12`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/solutions/churches`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/solutions/higher-education`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/solutions/corporate`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    // Core conversion pages
    { url: `${BASE_URL}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/demo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Platform features
    { url: `${BASE_URL}/platform`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/platform/analyst-review`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/platform/risk-intelligence`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/platform/safety-binder`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Resources
    { url: `${BASE_URL}/resources`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/resources/faq`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/resources/roi-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/resources/sample-binders`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    // Company
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/security`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/procurement`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    // Blog index
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  ];

  const blogPosts = await getAllBlogPosts();
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const guides = await getAllGuides();
  const guideEntries: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${BASE_URL}/resources/guides/${guide.slug}`,
    lastModified: new Date(guide.updatedAt || guide.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...corePages, ...blogEntries, ...guideEntries];
}
```

---

### FR-SEO-002: Robots.txt with AI Crawler Allowances

**Priority**: P0 (Launch Blocker)
**Depends On**: Next.js 15 App Router setup

**Description**: Programmatic `robots.txt` via `/app/robots.ts` that explicitly allows all major AI crawlers. This is the first-mover advantage: no competitor in SafeTrekr's niche has structured content for AI answer engines. Explicitly allowing GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Amazonbot, Applebot-Extended, ChatGPT-User, and cohere-ai gives SafeTrekr maximum discoverability across all AI platforms.

**Acceptance Criteria**:

- [ ] `/robots.txt` is accessible and returns valid directives
- [ ] Default user-agent allows `/` and disallows `/admin/`, `/api/`, `/lp/`, `/_next/`, `/private/`
- [ ] Each AI crawler (GPTBot, Google-Extended, PerplexityBot, ClaudeBot, Amazonbot, ChatGPT-User, Applebot-Extended, cohere-ai) has an explicit `Allow: /` rule
- [ ] Sitemap URL is referenced: `Sitemap: https://www.safetrekr.com/sitemap.xml`
- [ ] Paid landing pages (`/lp/`) are disallowed for all crawlers

**Implementation Notes**:

```typescript
// /app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/lp/', '/_next/', '/private/'],
      },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
    ],
    sitemap: 'https://www.safetrekr.com/sitemap.xml',
  };
}
```

---

### FR-SEO-003: Canonical URL Strategy

**Priority**: P0 (Launch Blocker)
**Depends On**: Domain configuration, Nginx Ingress setup

**Description**: Every page emits a self-referencing canonical tag via `generateMetadata`. The canonical domain is `www.safetrekr.com`. All non-www requests redirect to www via Nginx Ingress. Trailing slashes are stripped (Next.js default). Query parameters (UTM, etc.) are excluded from canonical URLs.

**Acceptance Criteria**:

- [ ] Every page renders a `<link rel="canonical" href="https://www.safetrekr.com/...">` tag
- [ ] `safetrekr.com` 301-redirects to `www.safetrekr.com` via Nginx Ingress rewrite rule
- [ ] Blog paginated views canonical to `/blog` (not `/blog?page=2`)
- [ ] Campaign landing pages (`/lp/*`) render `noindex, nofollow` robots meta
- [ ] No trailing slashes in canonical URLs
- [ ] No query parameters (`?utm_*`) in canonical URLs
- [ ] HTTP requests 301-redirect to HTTPS

**Implementation Notes**:

```typescript
// /lib/seo/metadata.ts
import { Metadata } from 'next';

const BASE_URL = 'https://www.safetrekr.com';

interface PageSEOConfig {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
}

export function generatePageMetadata(config: PageSEOConfig): Metadata {
  const canonicalUrl = `${BASE_URL}${config.path}`;
  const ogImageUrl = config.ogImage
    || `${BASE_URL}/api/og?title=${encodeURIComponent(config.title)}`;

  return {
    title: `${config.title} | SafeTrekr`,
    description: config.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: config.title,
      description: config.description,
      url: canonicalUrl,
      siteName: 'SafeTrekr',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: config.title }],
      type: config.type || 'website',
      ...(config.publishedTime && {
        publishedTime: config.publishedTime,
        modifiedTime: config.modifiedTime || config.publishedTime,
        authors: config.authors,
        section: config.section,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [ogImageUrl],
    },
    robots: config.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
```

Nginx Ingress annotations for www redirect and HTTPS enforcement:

```yaml
# Nginx Ingress ConfigMap or Ingress annotations
metadata:
  annotations:
    nginx.ingress.kubernetes.io/from-to-www-redirect: "true"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
```

---

### FR-SEO-004: HTTP Security Headers

**Priority**: P0 (Launch Blocker)
**Depends On**: Nginx Ingress configuration

**Description**: All responses must include HTTP security headers that satisfy both SEO requirements and enterprise buyer trust expectations. Headers are set at two levels: Next.js `next.config.ts` for application-level headers, and Nginx Ingress for infrastructure-level enforcement.

**Acceptance Criteria**:

- [ ] `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` on all responses
- [ ] `X-Content-Type-Options: nosniff` on all responses
- [ ] `X-Frame-Options: DENY` on all responses
- [ ] `X-XSS-Protection: 1; mode=block` on all responses
- [ ] `Referrer-Policy: strict-origin-when-cross-origin` on all responses
- [ ] `Content-Security-Policy` allows `script-src 'self' 'unsafe-inline' https://plausible.io` (Plausible script), `img-src 'self' data: https:`, and `connect-src 'self' https://plausible.io` at minimum
- [ ] `Permissions-Policy: camera=(), microphone=(), geolocation=()` disables unused browser APIs
- [ ] All headers pass Mozilla Observatory scan with grade A or higher
- [ ] Headers do not interfere with JSON-LD injection (`script-src` allows inline for `application/ld+json`)

**Implementation Notes**:

```typescript
// next.config.ts (partial)
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  output: 'standalone', // Required for Docker deployment
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};
```

HSTS preload registration should be submitted to https://hstspreload.org/ after DNS is stable.

---

### FR-SEO-005: Per-Route Metadata Generation

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-SEO-003 (canonical strategy), content for each page

**Description**: Every route in the application must export a `generateMetadata` function that produces a complete metadata object: title (under 60 characters, ending with `| SafeTrekr`), meta description (150-160 characters with target keyword and CTA), canonical URL, Open Graph tags, and Twitter Card tags.

**Acceptance Criteria**:

- [ ] Every static page (`/`, `/solutions/k12`, `/solutions/churches`, `/pricing`, `/how-it-works`, `/demo`, `/contact`, `/about`, `/security`, `/procurement`) exports `generateMetadata`
- [ ] Title tags are under 60 characters and end with `| SafeTrekr`
- [ ] Meta descriptions are 150-160 characters, include the target keyword, and end with a CTA
- [ ] Open Graph `og:title`, `og:description`, `og:image`, `og:url`, `og:site_name` are present
- [ ] Twitter Card meta (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`) is present
- [ ] Blog posts derive metadata from MDX frontmatter fields (`seoTitle`, `seoDescription`, `featuredImage`)
- [ ] No duplicate title tags or meta descriptions across the site (CI lint check)
- [ ] Dynamic OG images reference `/api/og?title=...&segment=...`

**Per-Page Metadata Specifications**:

| Route | Title | Description (abbreviated) | Priority Keyword |
|---|---|---|---|
| `/` | `Trip Safety Management Software \| SafeTrekr` | Professional safety analyst reviews... | trip safety management |
| `/solutions/k12` | `K-12 School Trip Safety Software \| SafeTrekr` | FERPA-compliant trip safety reviews for school field trips... | school trip safety |
| `/solutions/churches` | `Mission Trip Safety Reviews \| SafeTrekr` | Professional safety reviews for church mission trips... | mission trip safety |
| `/solutions/higher-education` | `Study Abroad Risk Management \| SafeTrekr` | Safety reviews for study abroad and university travel... | study abroad safety |
| `/solutions/corporate` | `Corporate Travel Safety Software \| SafeTrekr` | Duty of care documentation for business travel... | corporate travel safety |
| `/pricing` | `Pricing - Starting at $15/Student \| SafeTrekr` | Trip safety reviews starting at $450/trip. Per-student pricing... | trip safety pricing |
| `/how-it-works` | `How SafeTrekr Works: 3-Step Safety Review \| SafeTrekr` | Intelligence, analyst review, safety binder... | how trip safety review works |
| `/demo` | `See a Sample Safety Binder \| SafeTrekr` | Request a demo or download a sample safety binder... | safety binder demo |

---

### FR-SEO-006: Redirect Management System

**Priority**: P0 (Launch Blocker)
**Depends On**: Next.js config, Nginx Ingress

**Description**: Version-controlled redirect map consumed by `next.config.ts`. Includes www-redirect, common URL patterns, and future-proofing for content migrations.

**Acceptance Criteria**:

- [ ] Redirect map lives in `/config/redirects.ts` and is version-controlled
- [ ] `next.config.ts` imports and applies all redirects
- [ ] All redirects are 301 (permanent) unless explicitly marked 302
- [ ] No redirect chains longer than 2 hops (CI validation)
- [ ] No self-referential redirects (CI validation)
- [ ] No redirect targets that return 404 (CI validation)
- [ ] `safetrekr.com` -> `www.safetrekr.com` handled at Nginx Ingress level
- [ ] Common legacy paths are pre-mapped: `/features` -> `/platform`, `/solutions/schools` -> `/solutions/k12`

**Implementation Notes**:

```typescript
// /config/redirects.ts
export const redirects = [
  { source: '/features', destination: '/platform', permanent: true },
  { source: '/solutions/schools', destination: '/solutions/k12', permanent: true },
  { source: '/solutions/church', destination: '/solutions/churches', permanent: true },
  { source: '/solutions/university', destination: '/solutions/higher-education', permanent: true },
  { source: '/request-demo', destination: '/demo', permanent: true },
  { source: '/faq', destination: '/resources/faq', permanent: true },
];
```

---

## 2. Schema Markup (JSON-LD)

### FR-SCHEMA-001: JSON-LD Injection Component

**Priority**: P0 (Launch Blocker)
**Depends On**: React component library

**Description**: Reusable server-side component that injects JSON-LD structured data into the `<head>` of every page. Supports single or multiple schema objects per page. All schemas are validated against Google Rich Results Test before merge.

**Acceptance Criteria**:

- [ ] `<JsonLd>` component accepts a single schema object or array of schema objects
- [ ] Output renders as `<script type="application/ld+json">` in the page `<head>`
- [ ] JSON is minified (no pretty-printing in production)
- [ ] Component is server-rendered (no client-side hydration needed)
- [ ] All schema output passes Google Rich Results Test validation
- [ ] CI step `npm run validate:schema` blocks PRs with invalid schema

**Implementation Notes**:

```typescript
// /components/seo/JsonLd.tsx
interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data];
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
```

---

### FR-SCHEMA-002: Organization Schema (Global)

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-SCHEMA-001

**Description**: Organization schema injected in the root layout, appearing on every page. Establishes SafeTrekr as a named entity for search engines and AI systems.

**Acceptance Criteria**:

- [ ] Root layout (`/app/layout.tsx`) includes Organization JSON-LD
- [ ] Schema includes: `name`, `url`, `logo`, `description`, `foundingDate`, `contactPoint`, `sameAs` (LinkedIn, G2), `address` (US)
- [ ] `description` references the unique mechanism: professional safety analyst, 17 dimensions, government intelligence, tamper-evident binder
- [ ] Passes Google Rich Results Test for Organization type

**Schema Specification**:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SafeTrekr",
  "url": "https://www.safetrekr.com",
  "logo": "https://www.safetrekr.com/images/safetrekr-logo.png",
  "description": "SafeTrekr assigns a professional safety analyst to every trip your organization takes -- reviewing 17 dimensions of risk, scoring threats with government intelligence, and delivering an audit-ready safety binder.",
  "foundingDate": "2024",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "email": "hello@safetrekr.com",
    "url": "https://www.safetrekr.com/contact"
  },
  "sameAs": [
    "https://www.linkedin.com/company/safetrekr",
    "https://www.g2.com/products/safetrekr"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  }
}
```

---

### FR-SCHEMA-003: BreadcrumbList Schema (All Interior Pages)

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-SCHEMA-001, route hierarchy

**Description**: Every page below the homepage renders BreadcrumbList JSON-LD reflecting the URL hierarchy. Breadcrumbs must start at position 1 with "Home" and terminate with the current page name.

**Acceptance Criteria**:

- [ ] All interior pages include BreadcrumbList JSON-LD
- [ ] Position numbering starts at 1
- [ ] Each `ListItem` includes `name` and `item` (full URL)
- [ ] Breadcrumb path matches the visible breadcrumb UI component
- [ ] Nested routes have correct intermediate items (e.g., Solutions > K-12 Schools)
- [ ] Passes Google Rich Results Test for BreadcrumbList

**Implementation Notes**:

```typescript
// /lib/seo/schemas/breadcrumbs.ts
interface BreadcrumbItem { name: string; url: string; }

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

---

### FR-SCHEMA-004: Homepage Schema (SoftwareApplication + AggregateOffer)

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-SCHEMA-001, verified pricing data

**Description**: Homepage renders SoftwareApplication schema with AggregateOffer containing all three pricing tiers. Feature list enumerates the unique mechanism elements. Pricing values must match the single source of truth in the codebase.

**Acceptance Criteria**:

- [ ] Homepage includes SoftwareApplication JSON-LD
- [ ] `applicationCategory` is `BusinessApplication`
- [ ] `operatingSystem` is `Web, iOS, Android`
- [ ] `offers` contains AggregateOffer with `lowPrice: 450`, `highPrice: 1250`, `offerCount: 3`
- [ ] Each individual Offer includes `name`, `price`, `priceCurrency: USD`, `description`, and `availability: InStock`
- [ ] `featureList` includes: 17-section review, Monte Carlo risk scoring, SHA-256 hash-chain, real-time geofencing, FERPA-compliant data handling, AES-256 encryption
- [ ] Prices match `/config/pricing.ts` (single source of truth)
- [ ] Passes Google Rich Results Test

**Pricing Tiers (verified from codebase)**:

| Tier | Name | Price |
|---|---|---|
| T1 | Day Trip Review | $450 |
| T2 | Multi-Day Trip Review | $750 |
| T3 | International Trip Review | $1,250 |

---

### FR-SCHEMA-005: FAQPage Schema (Solutions + Pricing Pages)

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-SCHEMA-001, segment-specific FAQ content

**Description**: Every solutions page and the pricing page includes FAQPage JSON-LD with 8-12 segment-relevant questions. FAQ questions must use exact phrasing a user would type into a search engine or ask an AI assistant. Answers must be concise (under 50 words for the first sentence) with specific data points and named entities.

**Acceptance Criteria**:

- [ ] `/solutions/k12` includes FAQPage with 8-12 K-12-specific questions
- [ ] `/solutions/churches` includes FAQPage with 8-12 church/mission-specific questions
- [ ] `/solutions/higher-education` includes FAQPage with 8-12 higher-ed-specific questions
- [ ] `/solutions/corporate` includes FAQPage with 8-12 corporate-specific questions
- [ ] `/pricing` includes FAQPage with 6-8 pricing-specific questions
- [ ] `/resources/faq` includes a comprehensive FAQPage combining cross-segment questions
- [ ] Every answer includes at least one specific data point (number, entity name, or timeframe)
- [ ] All FAQ content passes Google Rich Results Test for FAQPage

**Required FAQ Topics Per Segment**:

K-12: FERPA compliance, cost per student, safety binder contents, review timeline, school board approval, government data sources, overnight trips, comparison to Chapperone/logistics apps

Churches: Mission trip coverage, international intelligence, insurance documentation, volunteer screening, cost relative to trip budget, denominational compliance, youth group travel, duty of care

Higher Ed: Clery Act compliance, study abroad coverage, Title IX implications, cost vs enterprise risk platforms, real-time monitoring, crisis response documentation

Pricing: Per-student cost calculation, volume discounts, what is included, turnaround time, annual plans, refund policy

---

### FR-SCHEMA-006: HowTo Schema (How It Works Page)

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-SCHEMA-001

**Description**: The How It Works page renders HowTo JSON-LD with three steps matching the three-act mechanism: Intelligence Gathering, Professional Analyst Review, Safety Binder Delivery. Total time is P5D (5 business days).

**Acceptance Criteria**:

- [ ] `/how-it-works` includes HowTo JSON-LD
- [ ] Three `HowToStep` items with `position`, `name`, `text`, and `image`
- [ ] `totalTime` is `P5D`
- [ ] Step descriptions reference specific capabilities (NOAA, USGS, CDC, 17 sections, SHA-256)
- [ ] Passes Google Rich Results Test for HowTo

---

### FR-SCHEMA-007: Article Schema (Blog Posts)

**Priority**: P1 (Ship within 30 days)
**Depends On**: FR-SCHEMA-001, MDX blog infrastructure

**Description**: Every blog post renders Article JSON-LD with `headline`, `description`, `datePublished`, `dateModified`, `wordCount`, `articleSection`, `author`, and `publisher`. Values are derived from MDX frontmatter.

**Acceptance Criteria**:

- [ ] Every published blog post includes Article JSON-LD
- [ ] `headline` matches the `seoTitle` frontmatter field (or `title` if `seoTitle` is absent)
- [ ] `datePublished` and `dateModified` are ISO 8601 formatted
- [ ] `wordCount` is calculated from MDX body content
- [ ] `author` includes `@type: Person`, `name`, and optional `url`
- [ ] `publisher` includes SafeTrekr Organization with logo
- [ ] `mainEntityOfPage` references the canonical URL
- [ ] Passes Google Rich Results Test for Article

---

### FR-SCHEMA-008: Product + Offer Schema (Pricing Page)

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-SCHEMA-001, verified pricing data

**Description**: The pricing page renders three separate Product schemas, one per pricing tier. Each Product includes an Offer with `price`, `priceCurrency`, `availability`, `priceValidUntil`, and `url`.

**Acceptance Criteria**:

- [ ] `/pricing` includes three Product JSON-LD objects
- [ ] Each Product has: `name`, `description`, `brand` (SafeTrekr), `offers` with Offer schema
- [ ] `priceValidUntil` is set to 12 months from build date
- [ ] Prices match the single source of truth in `/config/pricing.ts`
- [ ] Passes Google Rich Results Test for Product

---

### FR-SCHEMA-009: VideoObject Schema (When Video Content Exists)

**Priority**: P2 (Ship within 60 days)
**Depends On**: FR-SCHEMA-001, video production

**Description**: Any page with embedded video content renders VideoObject JSON-LD with `name`, `description`, `thumbnailUrl`, `uploadDate`, `duration`, `contentUrl`, and `publisher`.

**Acceptance Criteria**:

- [ ] Every page with a video embed includes VideoObject JSON-LD
- [ ] `thumbnailUrl` points to an actual image asset (not placeholder)
- [ ] `duration` is ISO 8601 formatted (e.g., `PT2M15S`)
- [ ] `uploadDate` is accurate
- [ ] Passes Google Rich Results Test for VideoObject

---

### FR-SCHEMA-010: Review Schema (When Real Testimonials Exist)

**Priority**: P2 (Ship within 60 days)
**Depends On**: FR-SCHEMA-001, real customer testimonials

**Description**: When verified customer testimonials are collected, inject Review JSON-LD. CRITICAL: No fabricated testimonials. Every Review schema entry must correspond to a real person at a real organization who has given written permission.

**Acceptance Criteria**:

- [ ] Review schema is ONLY injected when a verified testimonial exists
- [ ] Each Review includes: `reviewBody`, `author` (Person with name and jobTitle), `itemReviewed` (SoftwareApplication: SafeTrekr), `reviewRating` (1-5 scale), `publisher` (Organization)
- [ ] CI check flags any placeholder names (e.g., "Sample University", "Jane Doe", "Dr. Rachel Martinez") and blocks merge
- [ ] Passes Google Rich Results Test for Review

---

### FR-SCHEMA-011: Schema Validation CI Pipeline

**Priority**: P0 (Launch Blocker)
**Depends On**: GitHub Actions CI, schema components

**Description**: Automated schema validation in CI that renders page HTML snapshots, extracts JSON-LD blocks, and validates syntax and required properties. Failures block PR merge.

**Acceptance Criteria**:

- [ ] `npm run validate:schema` script exists and runs against rendered HTML
- [ ] Validates JSON syntax (parseable JSON)
- [ ] Validates required `@context` and `@type` properties
- [ ] Validates required properties per schema type (e.g., Article must have `headline`, `datePublished`)
- [ ] Runs in GitHub Actions on every PR targeting `main`
- [ ] Failures block the merge
- [ ] Reports validation errors in PR comment with affected page and missing properties

---

## 3. AI Search Optimization

### FR-AIO-001: AI Summary Blocks on All Core Pages

**Priority**: P0 (Launch Blocker)
**Depends On**: Page content

**Description**: Every core page includes a 40-60 word declarative paragraph within the first 150 words of visible content. This paragraph is the primary target for AI answer engine extraction. It must use factual language (no superlatives), include specific numbers, reference authoritative entities by name, and be self-contained.

**Acceptance Criteria**:

- [ ] Every core page (homepage, all solutions pages, pricing, how-it-works, about, security) includes an AI Summary Block within the first 150 words
- [ ] Each block is 40-60 words
- [ ] Each block includes at least 3 specific data points (e.g., "17 dimensions", "5 government sources", "$450 per trip")
- [ ] Each block references at least 2 named entities (e.g., NOAA, USGS, CDC, FERPA)
- [ ] No marketing superlatives ("best", "leading", "top-rated")
- [ ] Each block directly answers the search query implied by the page URL
- [ ] Blocks are rendered as regular paragraph content (not hidden, not meta-only)

**Segment-Specific AI Summary Templates**:

**Generic (Homepage)**:
> SafeTrekr is a trip safety management platform that assigns a professional safety analyst to review every trip an organization takes. Each review covers 17 dimensions of risk and is backed by real-time intelligence from NOAA, USGS, CDC, ReliefWeb, and GDACS. Organizations receive a tamper-evident safety binder with SHA-256 hash-chain audit trails. Pricing starts at $450 per trip.

**K-12**:
> SafeTrekr provides FERPA-compliant trip safety reviews for K-12 schools. A professional safety analyst reviews every field trip across 17 sections using real-time data from NOAA, USGS, and CDC. Schools receive an audit-ready safety binder suitable for school board approval, with AES-256 encryption and tamper-evident documentation. Pricing starts at approximately $15 per student.

**Churches**:
> SafeTrekr provides professional safety reviews for church mission trips and youth group travel. A trained analyst reviews every trip across 17 dimensions, scoring risk with intelligence from 5 government and humanitarian sources including NOAA, USGS, CDC, ReliefWeb, and GDACS. Churches receive a complete safety binder with tamper-evident documentation for insurance and denominational compliance. Reviews start at $450 per trip.

**Higher Education**:
> SafeTrekr provides safety reviews for study abroad programs and university-sponsored travel. Each trip is reviewed across 17 dimensions by a professional safety analyst using intelligence from NOAA, USGS, CDC, ReliefWeb, and GDACS. Universities receive tamper-evident safety binders that support Clery Act and Title IX documentation requirements. Reviews start at $450 per trip.

---

### FR-AIO-002: llms.txt for LLM Discovery

**Priority**: P0 (Launch Blocker)
**Depends On**: Core pages published

**Description**: Implement `/llms.txt` at the site root -- an emerging standard for LLM-readable site summaries. This file provides a structured, machine-readable overview of SafeTrekr for AI systems that crawl the site.

**Acceptance Criteria**:

- [ ] `/llms.txt` is accessible at `https://www.safetrekr.com/llms.txt`
- [ ] File follows the emerging llms.txt format: title, description, key pages with URLs, and factual data points
- [ ] All URLs in the file are valid and resolve to 200 status
- [ ] Facts section includes: 17 review sections, 5 government sources, Monte Carlo simulation, SHA-256 documentation, AES-256 encryption, 3-5 day turnaround, pricing tiers
- [ ] File is served as `text/plain` content type
- [ ] Updated whenever core pages or pricing change

**Implementation Notes**: Serve as a static file at `/public/llms.txt` or via a Next.js API route at `/app/llms.txt/route.ts`.

```text
# SafeTrekr

> Trip safety management platform with professional analyst review.

SafeTrekr assigns a professional safety analyst to review every trip an organization
takes. Reviews cover 17 dimensions of risk and are backed by real-time intelligence
from NOAA, USGS, CDC, ReliefWeb, and GDACS. Organizations receive a tamper-evident
safety binder with SHA-256 hash-chain audit trails.

## Key Pages

- [How It Works](https://www.safetrekr.com/how-it-works): 3-step process -- intelligence, review, documentation
- [K-12 Schools](https://www.safetrekr.com/solutions/k12): FERPA-compliant field trip safety
- [Churches & Missions](https://www.safetrekr.com/solutions/churches): Mission trip safety reviews
- [Higher Education](https://www.safetrekr.com/solutions/higher-education): Study abroad risk management
- [Pricing](https://www.safetrekr.com/pricing): Starting at $450/trip ($15/student)
- [FAQ](https://www.safetrekr.com/resources/faq): Common questions about trip safety reviews
- [Security](https://www.safetrekr.com/security): AES-256 encryption, FERPA, SOC 2 posture

## Facts

- 17 safety review sections per trip
- 5 government intelligence sources (NOAA, USGS, CDC, ReliefWeb, GDACS)
- Monte Carlo risk simulation with P5/P50/P95 confidence bands
- SHA-256 hash-chain tamper-evident documentation
- AES-256 encryption at rest and in transit
- 3-5 business day review turnaround
- Pricing: $450 (day trip), $750 (multi-day), $1,250 (international)
```

---

### FR-AIO-003: AI Plugin Manifest

**Priority**: P1 (Ship within 30 days)
**Depends On**: Core pages published

**Description**: Deploy `/.well-known/ai-plugin.json` for future AI agent discovery. This manifest describes SafeTrekr in both human-readable and model-readable formats.

**Acceptance Criteria**:

- [ ] `/.well-known/ai-plugin.json` is accessible and returns valid JSON
- [ ] `name_for_model` is `safetrekr`
- [ ] `description_for_model` is factual, includes specific capabilities and data sources
- [ ] `auth.type` is `none` (public information only)
- [ ] `logo_url` points to a valid image

---

### FR-AIO-004: Structured Comparison Tables on Segment Pages

**Priority**: P0 (Launch Blocker)
**Depends On**: Segment page content

**Description**: AI answer engines strongly prefer HTML `<table>` elements with clear headers. Every segment page and comparison page must include at least one comparison table using semantic HTML (`<table>`, `<thead>`, `<tbody>`, `<caption>`).

**Acceptance Criteria**:

- [ ] Every solutions page includes at least one `<table>` comparing SafeTrekr to status quo alternatives
- [ ] Tables use semantic HTML: `<caption>`, `<thead>`, `<th>`, `<tbody>`, `<td>`
- [ ] Comparison categories include: professional analyst review, government intelligence, tamper-evident documentation, price, segment suitability
- [ ] Comparison targets: Spreadsheet Checklists, Logistics Apps (Chapperone-class), Enterprise Risk Platforms (International SOS-class)
- [ ] No fabricated competitor names -- use category labels only

---

### FR-AIO-005: Content Freshness Signals

**Priority**: P1 (Ship within 30 days)
**Depends On**: Content pipeline, schema infrastructure

**Description**: Every page exposes a `dateModified` meta tag and schema property. Pages with content freshness scores below 85 (measured by age of data points, broken external links, and schema validation status) are queued for refresh on a 30-day cadence.

**Acceptance Criteria**:

- [ ] Every page includes `<meta property="article:modified_time" content="...">` with ISO 8601 date
- [ ] Schema `dateModified` matches the meta tag value
- [ ] Blog posts update `dateModified` when content is edited (not just for typo fixes)
- [ ] Content freshness scoring script exists and can be run manually or via cron
- [ ] Any page older than 180 days without an update is flagged for review

---

## 4. Content Marketing System

### FR-CONTENT-001: MDX Blog Infrastructure

**Priority**: P1 (Ship within 30 days)
**Depends On**: Next.js 15 App Router, content directory structure

**Description**: Blog system built on MDX files in a `/content/blog/` directory. Uses ISR with 1-hour revalidation for the blog index and individual posts. Supports frontmatter metadata, custom MDX components, reading time calculation, related posts, and category/tag taxonomy.

**Acceptance Criteria**:

- [ ] Blog posts are authored as `.mdx` files in `/content/blog/`
- [ ] Frontmatter schema enforced via Zod validation at build time
- [ ] Required frontmatter fields: `title`, `slug`, `publishedAt`, `author`, `category`, `tags`, `excerpt`, `featuredImage`, `featuredImageAlt`, `seoTitle`, `seoDescription`, `wordCount`, `segment`, `contentType`, `schema`
- [ ] Optional frontmatter fields: `updatedAt`, `readingTime`, `cta`, `relatedPosts`
- [ ] ISR revalidation period: 3600 seconds (1 hour) for blog routes
- [ ] Blog index page lists posts sorted by `publishedAt` descending
- [ ] Category and tag filtering works without full page reload
- [ ] RSS feed available at `/blog/feed.xml`
- [ ] Reading time auto-calculated if not provided in frontmatter
- [ ] Related posts rendered at bottom of each post based on `relatedPosts` frontmatter

**ISR Configuration for DigitalOcean**:

ISR on standalone Next.js (non-Vercel) requires a file-system or custom cache. Use Next.js built-in file-system cache with a persistent volume in Kubernetes:

```yaml
# K8s Deployment (partial) -- persistent volume for ISR cache
volumes:
  - name: nextjs-cache
    persistentVolumeClaim:
      claimName: nextjs-isr-cache
containers:
  - name: safetrekr-marketing
    volumeMounts:
      - name: nextjs-cache
        mountPath: /app/.next/cache
```

---

### FR-CONTENT-002: Content Type Definitions

**Priority**: P1 (Ship within 30 days)
**Depends On**: FR-CONTENT-001

**Description**: Defined content types with specifications for format, cadence, gate strategy, and target length.

**Content Type Matrix**:

| Content Type | Format | Target Cadence | Gate | Target Length | Schema Type |
|---|---|---|---|---|---|
| Pillar Guide | MDX blog post | 2-3/month | Ungated | 2,000-3,000 words | Article |
| Supporting Blog Post | MDX blog post | 2-3/week (at scale) | Ungated | 800-1,500 words | Article |
| Segment Checklist | PDF download | 1 per segment (4 total) | Email-gated | 5-10 pages | N/A |
| Sample Safety Binder | PDF download | 1 per segment (4 total) | Email + Org Type | 20-30 pages | N/A |
| Case Study | MDX + template | As available | Ungated | 800-1,200 words | Article |
| Comparison Page | MDX page | 1/month | Ungated | 1,000-1,500 words | Article + FAQPage |
| Compliance Guide | MDX page | 1 per regulation | Ungated | 1,500-2,500 words | Article + FAQPage |
| Glossary Term | MDX (batch) | 5-10/month | Ungated | 200-400 words | DefinedTerm |
| Webinar Recap | MDX blog post | As available | Ungated (replay gated) | 1,000-1,500 words | Article + VideoObject |

**Acceptance Criteria**:

- [ ] Each content type has a corresponding MDX template in `/content/templates/`
- [ ] Templates include required frontmatter fields and placeholder sections
- [ ] Content type is a required field in frontmatter (`contentType: 'pillar' | 'supporting' | 'case-study' | 'comparison' | 'compliance' | 'glossary'`)
- [ ] Pillar guides are at least 2,000 words and include a table of contents component
- [ ] No page published with fewer than 300 words (CI lint check)

---

### FR-CONTENT-003: Content Pillar and Cluster Architecture

**Priority**: P1 (Ship within 30 days)
**Depends On**: Keyword research, FR-CONTENT-001

**Description**: Content is organized into pillar-cluster hierarchies. Each pillar page is the authoritative hub for a topic cluster. Supporting posts link to their pillar. Clusters map to keyword groups and conversion funnel stages.

**Pillar Map**:

```
PILLAR: Trip Safety Management
  /platform (overview)
  /blog/what-is-trip-safety-management
  /blog/trip-safety-vs-travel-logistics
  /blog/why-organizations-need-safety-reviews
  /resources/guides/trip-safety-management-guide

PILLAR: K-12 Field Trip Compliance
  /solutions/k12 (segment page)
  /blog/field-trip-safety-checklist-for-schools
  /blog/ferpa-field-trip-compliance
  /blog/school-board-trip-approval-process
  /blog/field-trip-liability-what-administrators-need-to-know
  /compliance/ferpa
  /resources/guides/k12-field-trip-safety-planning-guide

PILLAR: Mission Trip Safety
  /solutions/churches (segment page)
  /blog/church-mission-trip-insurance-requirements
  /blog/youth-group-travel-safety-checklist
  /blog/volunteer-background-check-requirements-churches
  /blog/mission-trip-safety-planning-guide
  /resources/guides/church-mission-trip-safety-guide

PILLAR: Higher Ed Travel Risk
  /solutions/higher-education (segment page)
  /blog/study-abroad-risk-assessment-best-practices
  /blog/clery-act-implications-for-international-programs
  /blog/title-ix-obligations-in-study-abroad
  /resources/guides/higher-ed-international-travel-safety-handbook

PILLAR: Group Travel Operations
  /how-it-works
  /blog/group-travel-management-best-practices
  /blog/how-to-evaluate-trip-safety-software
  /blog/corporate-duty-of-care-travel-compliance
```

**Acceptance Criteria**:

- [ ] Cluster map maintained in `/config/content-clusters.ts` (version-controlled)
- [ ] Each cluster maps to a pillar page URL, supporting page URLs, target keywords, and funnel stage
- [ ] Internal link audit script validates cluster integrity (see FR-CONTENT-004)

---

### FR-CONTENT-004: Internal Linking Rules (Enforced)

**Priority**: P1 (Ship within 30 days)
**Depends On**: FR-CONTENT-001, FR-CONTENT-003

**Description**: Enforced internal linking rules that maintain topical authority and link equity distribution across content clusters.

**Rules**:

1. Every new blog post must link to its parent pillar page within the first two paragraphs
2. Every new blog post must link to at least 2 other supporting posts in the same cluster
3. Every pillar page must link to all supporting blog posts in that cluster
4. Every blog post must include a CTA linking to the relevant segment landing page
5. Cross-cluster linking: every blog post should include at least 1 link to a post in a different cluster where topically relevant
6. Internal link anchor text must include the target keyword or a close variant (no "click here" or "read more" as anchor text)

**Acceptance Criteria**:

- [ ] Internal link audit script (`/scripts/internal-link-audit.ts`) exists
- [ ] Script parses all MDX files and extracts internal links
- [ ] Script identifies: missing outbound links to pillar, missing cross-cluster links, orphaned pages (fewer than 3 inbound links)
- [ ] Script runs in CI on every PR that modifies `/content/`
- [ ] Violations generate warnings (not blockers) in the PR comment

---

### FR-CONTENT-005: Publishing Workflow

**Priority**: P1 (Ship within 30 days)
**Depends On**: GitHub Actions CI, FR-CONTENT-001

**Description**: Structured 10-step publishing workflow from topic selection to post-publish promotion.

**Workflow**:

1. Topic selection from keyword cluster backlog
2. Content brief generation (keyword, intent, word count, outline, internal links, schema type)
3. AI-assisted draft (LLM generates outline + first draft)
4. Human editorial review (factual accuracy, brand voice, intent alignment)
5. SEO review (meta tags, schema, internal links, keyword placement, AI summary block)
6. MDX commit to content repo via pull request
7. Automated CI checks: schema validation, link validation, readability score, word count minimum
8. Editorial approval (CODEOWNERS requires SEO specialist sign-off)
9. Merge to `main` -- Docker rebuild triggers deployment, ISR picks up content
10. Post-publish: submit URL to Google Search Console, share on social, add to email digest

**Acceptance Criteria**:

- [ ] CODEOWNERS file requires approval from `@safetrekr/seo-team` for any changes in `/content/`
- [ ] CI checks run on every PR: frontmatter validation, internal link check, word count check, schema validation
- [ ] Post-merge webhook or GitHub Action submits new URLs to Google Search Console Indexing API

---

## 5. Analytics Infrastructure

### FR-ANALYTICS-001: Plausible Analytics (Primary)

**Priority**: P0 (Launch Blocker)
**Depends On**: Plausible account (cloud at $9/month OR self-hosted on DigitalOcean)

**Description**: Plausible is the primary analytics platform. It operates without cookies, requires no consent banner, and is privacy-first -- critical for K-12 and church audiences who distrust tracking. Uses the extended script variant for tagged events, outbound link tracking, and file download tracking.

**Acceptance Criteria**:

- [ ] Plausible script loaded in root layout via `next/script` with `strategy="afterInteractive"`
- [ ] Script variant: `script.tagged-events.outbound-links.file-downloads.js`
- [ ] `data-domain` set to `safetrekr.com`
- [ ] No cookies set by Plausible (verify via browser DevTools)
- [ ] No cookie consent banner required for Plausible
- [ ] Plausible dashboard accessible with correct domain data

**Self-Hosted Option**: If using self-hosted Plausible on DigitalOcean, update `src` to point to the self-hosted instance URL (e.g., `https://analytics.safetrekr.com/js/script.tagged-events.outbound-links.file-downloads.js`).

**Implementation Notes**:

```typescript
// /app/layout.tsx (root layout)
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          defer
          data-domain="safetrekr.com"
          src="https://plausible.io/js/script.tagged-events.outbound-links.file-downloads.js"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

### FR-ANALYTICS-002: Plausible Custom Goals and Events

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-ANALYTICS-001

**Description**: Custom conversion goals configured in the Plausible dashboard, triggered via a typed event tracking utility.

**Custom Goals (Configure in Plausible Dashboard)**:

| Goal Name | Trigger | Custom Properties |
|---|---|---|
| `Demo Request` | Form submission on `/demo` | `organization_type`, `trips_per_year` |
| `Sample Binder Download` | Email gate submission + download | `binder_type`, `segment` |
| `ROI Calculator Complete` | Final step of calculator | `segment`, `trips_entered` |
| `Pricing View` | Pageview on `/pricing` | `referrer_page` |
| `CTA Click` | Any primary CTA interaction | `cta_text`, `page_section`, `segment` |
| `Lead Magnet Download` | Any gated content download | `asset_name`, `asset_type`, `segment` |
| `Video Play` | Video player interaction | `video_name` |
| `Newsletter Signup` | Email newsletter subscription | `signup_location`, `segment` |
| `Form Start` | First field focus on any form | `form_name` |

**Acceptance Criteria**:

- [ ] `trackEvent()` utility function exists in `/lib/analytics/plausible.ts`
- [ ] Function is typed: accepts `eventName: string` and optional `props: Record<string, string | number | boolean>`
- [ ] Function checks for `window.plausible` existence before calling (SSR safety)
- [ ] All listed goals are configured in the Plausible dashboard
- [ ] Every CTA component calls `trackEvent('CTA Click', { cta_text, page_section, segment })`
- [ ] Every form component calls `trackEvent('Form Start', ...)` on first field focus
- [ ] Every form submission calls the appropriate goal event

**Implementation Notes**:

```typescript
// /lib/analytics/plausible.ts
export function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(eventName, { props });
  }
}
```

---

### FR-ANALYTICS-003: GA4 Consent-Gated Loading

**Priority**: P1 (Ship within 30 days)
**Depends On**: Consent banner component

**Description**: GA4 provides deeper funnel analysis but requires explicit cookie consent. GA4 loads ONLY after a visitor explicitly opts in via the consent banner. No GA4 scripts, cookies, or data collection occur without consent.

**Acceptance Criteria**:

- [ ] GA4 script is NOT present in the initial HTML
- [ ] GA4 loads only when `localStorage.getItem('analytics_consent') === 'granted'`
- [ ] Consent state persists across sessions via `localStorage`
- [ ] Consent banner appears only when a feature requiring analytics consent is triggered (not on first page load)
- [ ] GA4 measurement ID stored in environment variable `NEXT_PUBLIC_GA4_ID`
- [ ] `gtag('config', ...)` sets `cookie_flags: 'SameSite=None;Secure'`
- [ ] GA4 page_view events include: `page_title`, `page_location`, `page_referrer`, `content_type`, `segment`

**GA4 Event Taxonomy (When Consent Granted)**:

| Event | Trigger | Parameters |
|---|---|---|
| `page_view` | Every page load | `page_title`, `page_location`, `content_type`, `segment` |
| `cta_click` | CTA button interaction | `cta_text`, `cta_url`, `page_section`, `cta_tier` |
| `form_start` | First field focus | `form_name`, `form_location` |
| `form_submit` | Form submission | `form_name`, `organization_type`, `lead_type` |
| `demo_request` | Demo form submission | `organization_type`, `trips_per_year`, `source_page` |
| `lead_magnet_download` | Gated content download | `asset_name`, `asset_type`, `segment` |
| `sample_binder_download` | Sample binder download | `binder_type`, `segment` |
| `roi_calculator_start` | Calculator first interaction | `segment` |
| `roi_calculator_complete` | Calculator results viewed | `segment`, `trips_entered`, `cost_per_student` |
| `pricing_view` | Pricing page load | `referrer_page`, `segment` |
| `pricing_tier_click` | Pricing tier CTA click | `tier_name`, `tier_price` |
| `scroll_depth` | 25%, 50%, 75%, 90% marks | `scroll_percent`, `page_type` |
| `video_play` | Video starts | `video_name`, `video_duration` |
| `video_progress` | 25%, 50%, 75%, 100% | `video_name`, `progress_percent` |
| `faq_expand` | FAQ accordion opened | `question_text`, `faq_section` |
| `newsletter_signup` | Newsletter subscription | `signup_location`, `segment` |
| `segment_select` | User self-identifies segment | `segment_selected`, `selection_location` |
| `procurement_download` | W-9 or security doc download | `document_type` |

---

### FR-ANALYTICS-004: Unified Analytics Wrapper

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-ANALYTICS-001, FR-ANALYTICS-003

**Description**: Single `track()` function that dispatches events to both Plausible (always) and GA4 (when consent is granted). All components call this unified function rather than individual analytics providers.

**Acceptance Criteria**:

- [ ] `/lib/analytics/index.ts` exports a `track(eventName, params)` function
- [ ] `track()` always calls Plausible `trackEvent()`
- [ ] `track()` conditionally calls GA4 `trackGA4Event()` only if GA4 is loaded
- [ ] All UI components import from `/lib/analytics` (not directly from provider-specific files)
- [ ] Adding a new analytics provider requires changes only in `/lib/analytics/index.ts`

---

### FR-ANALYTICS-005: Conversion Tracking and Attribution

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-ANALYTICS-004, form components

**Description**: Track conversion goals with assigned pipeline values. Implement first-touch and last-touch attribution capture using `localStorage`.

**Conversion Goals**:

| Goal | Type | Estimated Pipeline Value | Tracking Event |
|---|---|---|---|
| Demo Request | Primary conversion | $2,500 | `demo_request` |
| Sample Binder Download | High-intent lead | $500 | `sample_binder_download` |
| ROI Calculator Complete | Consideration lead | $300 | `roi_calculator_complete` |
| Lead Magnet Download | Top-of-funnel lead | $100 | `lead_magnet_download` |
| Newsletter Signup | Nurture entry | $25 | `newsletter_signup` |
| Pricing Page View | Intent signal | $50 (weighted) | `pricing_view` |
| Procurement Page View | High-intent signal | $200 (weighted) | Custom page goal |

**Attribution Capture**:

- [ ] `captureAttribution()` runs on every page load
- [ ] First touch stored on initial visit: `utm_source`, `utm_medium`, `utm_campaign`, landing page, timestamp
- [ ] Last touch updated on every visit with UTM parameters
- [ ] Attribution data persisted in `localStorage` under key `st_attribution`
- [ ] Attribution data attached to every form submission (stored in Supabase alongside form data)
- [ ] UTM parameter convention enforced: `source_medium_campaign_content`

**Funnel Definitions**:

| Funnel | Path | Tracked Stages |
|---|---|---|
| Demo Request | Entry -> Segment/Homepage -> How It Works/Pricing -> Demo Form -> Submit | `page_view` -> `cta_click` -> `pricing_view` -> `form_start` -> `demo_request` |
| Sample Binder | Entry -> Segment/How It Works -> Binder CTA -> Email Gate -> Download | `page_view` -> `cta_click` -> `form_start` -> `sample_binder_download` |
| ROI Calculator | Entry -> Pricing -> Calculator -> Complete -> Demo | `pricing_view` -> `roi_calculator_start` -> `roi_calculator_complete` -> `demo_request` |
| Content-to-Lead | Blog Entry -> Read -> Internal Link -> Conversion | `page_view` -> `scroll_depth` -> `cta_click` -> conversion event |

---

### FR-ANALYTICS-006: Privacy-First Consent Architecture

**Priority**: P0 (Launch Blocker)
**Depends On**: FR-ANALYTICS-001, FR-ANALYTICS-003

**Description**: Three-tier consent model that respects the privacy expectations of K-12 and church audiences. The default experience requires no consent banner.

**Consent Tiers**:

| Tier | Tools Loaded | Consent Required | Banner Needed |
|---|---|---|---|
| Essential (default) | Plausible (cookieless), Cloudflare Turnstile | None | No |
| Functional | Feature flags (PostHog non-recording mode, if used) | Implicit | No |
| Analytics (opt-in) | GA4, session recordings, LinkedIn Insight Tag | Explicit consent | Yes (minimal, non-blocking) |

**Acceptance Criteria**:

- [ ] Default page load sets zero cookies (verify in DevTools)
- [ ] No consent banner appears unless a visitor interacts with a feature that requires Tier 3 consent
- [ ] Consent banner is a bottom-right slide-in (not full-screen overlay, not top banner)
- [ ] Banner includes: brief explanation, "Allow" button, "No thanks" button
- [ ] Consent state stored in `localStorage` (key: `analytics_consent`, values: `granted` | `denied`)
- [ ] Denied consent is respected for 30 days (timestamp stored)
- [ ] Consent decision can be changed via a link in the footer ("Privacy Settings")
- [ ] GDPR and CCPA compliant: no data collection before consent, deletion path documented

---

## 6. Email Capture and Nurture

### FR-EMAIL-001: Form Architecture (React Hook Form + Zod + Turnstile)

**Priority**: P0 (Launch Blocker)
**Depends On**: Cloudflare Turnstile account, Supabase marketing project

**Description**: All email capture forms use React Hook Form for state management, Zod for client and server validation (shared schemas), Server Actions for submission (progressive enhancement), and Cloudflare Turnstile for invisible bot protection.

**Form Types and Schemas**:

| Form | Fields (Required) | Fields (Optional/Progressive) | Gate Level |
|---|---|---|---|
| Demo Request | email, organizationType, turnstileToken | organizationName, tripsPerYear, message | High |
| Sample Binder | email, organizationType, turnstileToken | -- | Medium |
| Lead Magnet | email, turnstileToken | -- | Low |
| Newsletter | email, turnstileToken | segment | Low |
| Contact | name, email, message, turnstileToken | organizationName, phone | Medium |

**Acceptance Criteria**:

- [ ] All form schemas defined in `/lib/forms/schema.ts` using Zod
- [ ] Client-side validation provides real-time feedback
- [ ] Server Actions re-validate all fields (never trust client)
- [ ] Turnstile token validated server-side via Cloudflare API before processing
- [ ] Honeypot field included on all forms (hidden field that bots fill, humans do not)
- [ ] Rate limiting: maximum 5 submissions per IP per hour (enforced server-side)
- [ ] All submissions stored in Supabase `form_submissions` table with JSONB details
- [ ] UTM parameters and referrer captured and stored with every submission
- [ ] Forms work without JavaScript (progressive enhancement via Server Actions)
- [ ] Input sanitization: strip HTML tags and script injections from all text fields

---

### FR-EMAIL-002: Lead Magnets by Segment

**Priority**: P1 (Ship within 30 days)
**Depends On**: FR-EMAIL-001, PDF content production

**Description**: Segment-specific lead magnets with calibrated gate friction. Sample binders are the highest-value lead magnet (8-15% projected conversion). Checklists and guides have lower gate friction for higher conversion rates.

**Lead Magnet Matrix**:

| Lead Magnet | Gate Fields | Segment | Expected Conversion | Delivery Method |
|---|---|---|---|---|
| K-12 Field Trip Sample Binder | Email + Org Type | K-12 | 8-15% | Immediate PDF + SendGrid email |
| Mission Trip Sample Binder | Email + Org Type | Church | 8-15% | Immediate PDF + SendGrid email |
| Study Abroad Sample Binder | Email + Org Type | Higher Ed | 8-15% | Immediate PDF + SendGrid email |
| Corporate Travel Sample Binder | Email + Org Type | Corporate | 8-15% | Immediate PDF + SendGrid email |
| K-12 Safety Checklist | Email only | K-12 | 15-25% | Immediate PDF download |
| Mission Trip Safety Guide | Email only | Church | 15-25% | Immediate PDF download |
| ROI Calculator Full Report | Email + Org + Trips/year | All | 20-30% | Inline display + SendGrid email |

**Acceptance Criteria**:

- [ ] Each lead magnet has a dedicated download route
- [ ] PDF is delivered immediately after form submission (no waiting for email)
- [ ] Confirmation email sent via SendGrid within 30 seconds of submission
- [ ] Lead magnet downloads tracked as conversion events in Plausible
- [ ] Download URLs are signed/time-limited to prevent unauthorized sharing
- [ ] PDF files hosted on DigitalOcean Spaces CDN for fast delivery

---

### FR-EMAIL-003: SendGrid Integration for Transactional and Nurture Email

**Priority**: P1 (Ship within 30 days)
**Depends On**: SendGrid account (existing in product stack), FR-EMAIL-001

**Description**: SendGrid handles all email delivery: transactional (form confirmations, asset delivery), nurture sequences, and newsletter. Uses SendGrid's Marketing Campaigns API for list management and Dynamic Transactional Templates for branded emails.

**Acceptance Criteria**:

- [ ] SendGrid API key stored as Kubernetes secret, injected as environment variable `SENDGRID_API_KEY`
- [ ] Sender domain `safetrekr.com` authenticated in SendGrid (SPF, DKIM, DMARC)
- [ ] Transactional emails sent via SendGrid v3 Mail Send API
- [ ] From address: `SafeTrekr <safety@safetrekr.com>` (or `hello@safetrekr.com`)
- [ ] All emails include unsubscribe link (CAN-SPAM compliance)
- [ ] Email templates stored as React components in `/lib/email/templates/` and rendered to HTML via `@sendgrid/mail`
- [ ] SendGrid webhook for bounce/complaint handling configured to update Supabase contact status

**Implementation Notes**:

```typescript
// /lib/email/sendgrid.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendBinderEmail(email: string, binderType: string, downloadUrl: string) {
  await sgMail.send({
    to: email,
    from: { email: 'safety@safetrekr.com', name: 'SafeTrekr' },
    subject: 'Your SafeTrekr Safety Binder is Ready',
    templateId: process.env.SENDGRID_BINDER_TEMPLATE_ID!,
    dynamicTemplateData: {
      binder_type: binderType,
      download_url: downloadUrl,
    },
    trackingSettings: {
      clickTracking: { enable: true },
      openTracking: { enable: true },
    },
    categories: ['binder-delivery', binderType],
  });
}
```

---

### FR-EMAIL-004: Email Nurture Sequences

**Priority**: P1 (Ship within 30 days)
**Depends On**: FR-EMAIL-003, SendGrid Marketing Campaigns or Automation

**Description**: Automated email sequences triggered by lead magnet downloads. Each sequence is segment-aware and progresses from value delivery to demo request CTA over 14 days.

**Sequence 1: Sample Binder Download (5 emails, 14 days)**:

| Day | Subject Line | Content Focus | CTA |
|---|---|---|---|
| 0 | "Your SafeTrekr Safety Binder is Ready" | Binder delivery + quick navigation guide | Open binder |
| 2 | "What a 17-Section Safety Review Actually Covers" | Review methodology deep-dive | Explore How It Works |
| 5 | "How [Segment] Organizations Use SafeTrekr" | Segment-specific use cases and scenarios | See segment page |
| 9 | "The Real Cost of an Unreviewed Trip" | Risk/liability framing with dollar figures | Use ROI Calculator |
| 14 | "Ready to See SafeTrekr for Your Organization?" | Direct demo CTA with personalized scheduling link | Book a Demo |

**Sequence 2: Checklist/Guide Download (3 emails, 10 days)**:

| Day | Subject Line | Content Focus | CTA |
|---|---|---|---|
| 0 | "Your [Asset Name] is Ready" | Asset delivery + brief context | Download asset |
| 3 | "What Most Organizations Miss in Trip Safety" | Educational value-add content | See Sample Binder |
| 10 | "Professional Safety Reviews Start at $15/Student" | Pricing + value framing | Book a Demo |

**Sequence 3: Newsletter (Weekly)**:
- Segment-filtered content digest
- New blog posts + industry news
- Quarterly product updates
- Maximum 1 promotional CTA per issue

**Acceptance Criteria**:

- [ ] SendGrid Automation (or Marketing Campaigns) workflows configured for each sequence
- [ ] Sequences triggered automatically by form submission events
- [ ] `[Segment]` placeholders dynamically replaced with the subscriber's segment
- [ ] Subscribers can only be in one active nurture sequence at a time (no overlapping)
- [ ] Demo requesters are immediately removed from all nurture sequences (exclusion list)
- [ ] Unsubscribe from nurture does not unsubscribe from newsletter (separate lists)
- [ ] Email performance tracked: open rate, click rate, unsubscribe rate per sequence

---

### FR-EMAIL-005: Double Opt-In

**Priority**: P1 (Ship within 30 days)
**Depends On**: FR-EMAIL-003

**Description**: All email captures trigger a double opt-in workflow for GDPR/CCPA compliance and list hygiene.

**Flow**:

1. Form submit -> immediate asset delivery (binder/checklist)
2. Confirmation email sent: "Confirm your email to receive future safety updates"
3. 24-hour window for confirmation click
4. Only confirmed emails enter nurture sequences
5. Non-confirmed emails purged from marketing lists after 30 days

**Acceptance Criteria**:

- [ ] Lead magnet is delivered immediately (not gated behind confirmation)
- [ ] Confirmation email sent within 60 seconds of form submission
- [ ] Confirmation link is a signed, time-limited URL (24-hour expiry)
- [ ] Confirmed status stored in Supabase `contacts` table
- [ ] Only confirmed contacts are added to SendGrid marketing lists
- [ ] Nightly cleanup job purges unconfirmed contacts older than 30 days
- [ ] Confirmation rate tracked as a metric (target: >60%)

---

## 7. Social Proof System

### FR-PROOF-001: Trust Metrics Strip

**Priority**: P0 (Launch Blocker)
**Depends On**: UI component library

**Description**: Horizontal strip of verifiable data points that replaces ALL fabricated testimonials. This is the primary trust mechanism at launch until real customer testimonials are collected.

**Strip Content**:
```
5 Government Intel Sources | 17 Safety Review Sections | 3-5 Day Turnaround | AES-256 Encryption | SHA-256 Evidence Chain
```

**Acceptance Criteria**:

- [ ] Trust strip component renders on: homepage (below hero), all segment pages (below hero), pricing page (above pricing cards)
- [ ] Each metric is verifiable (corresponds to a real product capability)
- [ ] No fabricated statistics, testimonials, or customer counts
- [ ] Component is responsive: horizontal on desktop, 2-column or stacked on mobile
- [ ] Passes contrast ratio requirements (4.5:1 minimum)

---

### FR-PROOF-002: Government Data Source Logos

**Priority**: P0 (Launch Blocker)
**Depends On**: Logo assets (public domain or fair use)

**Description**: Display government and humanitarian agency logos with "Powered by data from" framing. These are real, verifiable data sources that SafeTrekr uses.

**Sources to Display**:
- NOAA (National Oceanic and Atmospheric Administration)
- USGS (United States Geological Survey)
- CDC (Centers for Disease Control and Prevention)
- GDACS (Global Disaster Alerting Coordination System)
- ReliefWeb (UN OCHA)

**Acceptance Criteria**:

- [ ] Logo row rendered with grayscale agency logos
- [ ] Label: "Data sourced from" (not "Partners" or "Trusted by")
- [ ] Each logo links to the agency's public data portal
- [ ] Logos are actual agency marks used under fair use for factual attribution
- [ ] Component renders on homepage and How It Works page

---

### FR-PROOF-003: Review Platform Profiles

**Priority**: P1 (Ship within 30 days)
**Depends On**: Product screenshots, pricing data

**Description**: Create product profiles on G2, Capterra, and TrustRadius. Collect real reviews from existing 104 organizations.

**Acceptance Criteria**:

- [ ] G2 product profile created and claimed (Week 1)
- [ ] Capterra product listing created and claimed (Week 1)
- [ ] TrustRadius profile created (Week 4)
- [ ] Google Business Profile created and verified (Week 4)
- [ ] Review acquisition campaign launched: contact existing organizations, offer early-adopter benefit in exchange for honest review
- [ ] Target: 5 reviews on G2 and 5 on Capterra within 60 days of launch
- [ ] Review platform badges added to footer when 5+ reviews achieved

---

### FR-PROOF-004: Compliance Posture Badges

**Priority**: P0 (Launch Blocker)
**Depends On**: Legal review of compliance claims

**Description**: Display verifiable compliance badges in the footer and on the security page. CRITICAL: Never claim a certification that has not been obtained.

**Badge Matrix**:

| Badge | Status | Display Language | Location |
|---|---|---|---|
| AES-256 Encryption | Verifiable NOW | "AES-256 Encryption" | Footer, Security page |
| SHA-256 Evidence Chain | Verifiable NOW | "SHA-256 Hash-Chain Evidence" | Footer, Security page |
| FERPA | In progress | "Designed for FERPA Compliance" | Footer, K-12 pages, Security page |
| SOC 2 Type II | Not started | "SOC 2 Audit In Progress" (only when initiated) | Security page only |
| GDPR | After DPA published | "GDPR Compliant" | Footer, Security page |

**Acceptance Criteria**:

- [ ] No badge claims certification that has not been completed
- [ ] "Designed for FERPA Compliance" used instead of "FERPA Certified" until iKeepSafe cert obtained
- [ ] SOC 2 badge only displayed after audit is formally initiated
- [ ] Schema markup does NOT include compliance badges that are not yet earned
- [ ] Quarterly compliance claim audit scheduled (calendar reminder)
- [ ] CI check flags any text containing "FERPA Certified", "SOC 2 Certified", or "SOC 2 Compliant" and blocks merge

---

### FR-PROOF-005: Fabricated Content Detection CI Guard

**Priority**: P0 (Launch Blocker)
**Depends On**: GitHub Actions CI

**Description**: Automated CI check that scans the entire codebase for fabricated testimonial patterns and blocks merge. This is a permanent safeguard against the existential risk of publishing fake social proof.

**Acceptance Criteria**:

- [ ] CI script scans all `.tsx`, `.ts`, `.mdx`, `.md`, and `.json` files
- [ ] Flags any occurrence of known fabricated names: "Dr. Rachel Martinez", "Sample University", "Jane Doe", "John Smith" (as testimonial attributions)
- [ ] Flags patterns: `"testimonial"` or `"review"` near `"sample"`, `"example"`, `"placeholder"`, `"lorem"`
- [ ] Merge blocked if any fabricated content patterns detected
- [ ] False positives can be allowlisted via a `/.fabrication-allowlist` file (documented exceptions only)

---

## 8. Paid Acquisition Readiness

### FR-PAID-001: Landing Page Architecture

**Priority**: P3 (Ship within 90 days)
**Depends On**: Design system, form components

**Description**: Campaign landing pages at `/lp/[campaign]/` that are isolated from SEO pages: `noindex/nofollow`, no site navigation, single CTA focus, custom hero matching ad creative.

**Acceptance Criteria**:

- [ ] Landing pages use route group `(landing)` with distinct layout (no header nav, minimal footer)
- [ ] All `/lp/*` pages render `<meta name="robots" content="noindex, nofollow">`
- [ ] `/lp/` disallowed in `robots.txt`
- [ ] Landing page template structure: Hero (ad-matched headline + CTA) -> Trust strip -> 3-bullet problem-solution -> Social proof or data source logos -> Single form -> Legal footer
- [ ] UTM parameters captured and stored with form submissions
- [ ] Each landing page has a unique URL per ad group for tracking

**Planned Landing Pages**:

| Campaign | Landing Page | Target Keywords |
|---|---|---|
| K-12 Safety | `/lp/k12-field-trip-safety` | school trip safety software, field trip management |
| Church Missions | `/lp/mission-trip-safety` | mission trip safety, church travel safety |
| Higher Ed | `/lp/study-abroad-safety` | study abroad risk management, university travel safety |
| Brand | Homepage (no landing page) | safetrekr, safe trekr |

---

### FR-PAID-002: Conversion Pixel Setup

**Priority**: P3 (Ship within 90 days)
**Depends On**: FR-ANALYTICS-003 (consent architecture), ad platform accounts

**Description**: Google Ads and LinkedIn Insight Tag tracking pixels, loaded only with explicit consent. Conversion events map to the same events tracked in Plausible and GA4.

**Acceptance Criteria**:

- [ ] Google Ads conversion tracking configured via GA4 linked to Google Ads account
- [ ] Conversion events: `demo_request`, `sample_binder_download`, `roi_calculator_complete`
- [ ] LinkedIn Insight Tag loaded consent-gated alongside GA4
- [ ] LinkedIn Insight Tag partner ID stored in environment variable
- [ ] Meta (Facebook) Pixel NOT implemented at launch (institutional B2B audience not reached via Meta)
- [ ] All pixels respect the three-tier consent model (Tier 3 only)

---

### FR-PAID-003: Retargeting Audience Definitions

**Priority**: P3 (Ship within 90 days)
**Depends On**: FR-PAID-002

**Description**: Pre-defined audience segments for retargeting campaigns based on website behavior.

**Audience Definitions**:

| Audience | Source Signal | Use Case |
|---|---|---|
| All Website Visitors (180 days) | Any page view | Broad retargeting |
| Solutions Page Visitors | `/solutions/*` pageview | High-intent retargeting |
| Pricing Page Visitors | `/pricing` pageview | High-intent retargeting |
| Lead Magnet Downloaders | Conversion event | Upsell to demo |
| Demo Requesters | Conversion event | Exclude from awareness campaigns |
| Segment-Specific Visitors | URL filter (e.g., `/solutions/k12`) | Segment-targeted retargeting |

**Acceptance Criteria**:

- [ ] Audiences defined in both Google Ads and LinkedIn Campaign Manager
- [ ] Demo requesters excluded from all awareness and consideration campaigns
- [ ] Audience membership refreshed daily

---

## 9. Performance Monitoring

### FR-PERF-001: Core Web Vitals Targets

**Priority**: P0 (Launch Blocker)
**Depends On**: Next.js performance optimization, Nginx caching

**Description**: Enforced performance targets for all pages. These are both SEO ranking signals and user experience requirements.

**Targets**:

| Metric | Target | Budget (Max) | Enforcement |
|---|---|---|---|
| LCP (Largest Contentful Paint) | < 2.0s | 2.5s | CI failure |
| INP (Interaction to Next Paint) | < 100ms | 200ms | CI failure |
| CLS (Cumulative Layout Shift) | < 0.05 | 0.1 | CI failure |
| TTFB (Time to First Byte) | < 200ms | 400ms | Monitoring alert |
| Total JS Bundle | < 150KB gzipped | 200KB | CI failure |
| Map Component (lazy) | < 200KB gzipped | 230KB | CI warning |
| Web Fonts | < 100KB | 120KB | CI warning |
| Lighthouse Performance | >= 95 | >= 90 minimum | CI failure |
| Lighthouse Accessibility | >= 100 | >= 95 minimum | CI failure |
| Lighthouse SEO | >= 100 | >= 95 minimum | CI failure |

**Acceptance Criteria**:

- [ ] All targets met on homepage, all solutions pages, pricing, and how-it-works
- [ ] Lighthouse CI configured and running on every PR
- [ ] PRs that exceed budget thresholds are blocked from merge
- [ ] TTFB measured at Nginx Ingress level (not just application)
- [ ] MapLibre lazy-loaded via `next/dynamic` with `ssr: false` to avoid LCP impact

---

### FR-PERF-002: Lighthouse CI Configuration

**Priority**: P0 (Launch Blocker)
**Depends On**: GitHub Actions, Docker build pipeline

**Description**: Lighthouse CI runs against a local build (not production) on every PR. Tests the 5 highest-traffic pages. Failures block merge.

**Acceptance Criteria**:

- [ ] `lighthouserc.yml` configuration file exists at repo root
- [ ] Tests run against: `/`, `/solutions/k12`, `/solutions/churches`, `/pricing`, `/how-it-works`
- [ ] Each URL tested 3 times (median used for assertions)
- [ ] Assertions configured for: Performance >= 0.90, Accessibility >= 0.95, SEO >= 0.95, LCP <= 2500ms, CLS <= 0.1, TBT <= 300ms
- [ ] GitHub Actions workflow runs Lighthouse CI on every PR to `main`
- [ ] Results uploaded as artifacts and PR comment includes score summary
- [ ] Failures block merge with clear error messages indicating which metric failed

**Implementation Notes**:

```yaml
# lighthouserc.yml
ci:
  collect:
    startServerCommand: 'npm run start'
    startServerReadyPattern: 'Ready on'
    url:
      - http://localhost:3000/
      - http://localhost:3000/solutions/k12
      - http://localhost:3000/solutions/churches
      - http://localhost:3000/pricing
      - http://localhost:3000/how-it-works
    numberOfRuns: 3
    settings:
      chromeFlags: '--no-sandbox'
      onlyCategories: [performance, accessibility, best-practices, seo]
  assert:
    assertions:
      categories:performance: ['error', { minScore: 0.90 }]
      categories:accessibility: ['error', { minScore: 0.95 }]
      categories:best-practices: ['error', { minScore: 0.90 }]
      categories:seo: ['error', { minScore: 0.95 }]
      largest-contentful-paint: ['error', { maxNumericValue: 2500 }]
      cumulative-layout-shift: ['error', { maxNumericValue: 0.1 }]
      total-blocking-time: ['error', { maxNumericValue: 300 }]
  upload:
    target: temporary-public-storage
```

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on:
  pull_request:
    branches: [main]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v12
        with:
          configPath: ./lighthouserc.yml
          uploadArtifacts: true
```

---

### FR-PERF-003: Real-Time Performance Monitoring

**Priority**: P1 (Ship within 30 days)
**Depends On**: GitHub Actions scheduled workflows, Slack webhook

**Description**: Weekly automated Lighthouse audits against production URLs. Alerts sent to Slack when any page falls below performance thresholds. Since there is no Vercel Speed Insights on DigitalOcean, this replaces RUM (Real User Monitoring) with synthetic monitoring via PageSpeed Insights API.

**Acceptance Criteria**:

- [ ] GitHub Actions scheduled workflow runs weekly (Sunday night)
- [ ] Tests top 10 production pages via PageSpeed Insights API (mobile strategy)
- [ ] Captures: LCP, CLS, INP, Performance score, SEO score per page
- [ ] Results stored in Supabase `performance_checks` table for trend analysis
- [ ] Slack alert sent to `#seo-alerts` if any page LCP > 2.5s or Performance < 0.90
- [ ] Monthly CWV trend report generated and posted to Slack
- [ ] Dashboard page (internal, auth-protected) displays performance trends

**Implementation Notes**: Use PageSpeed Insights API (free, no API key required for limited use; API key for higher quota) via a GitHub Actions scheduled workflow:

```yaml
# .github/workflows/performance-check.yml
name: Weekly Performance Check
on:
  schedule:
    - cron: '0 3 * * 0'  # Sunday 3am UTC
  workflow_dispatch: {}
```

---

### FR-PERF-004: Schema Validation Monitoring

**Priority**: P1 (Ship within 30 days)
**Depends On**: Schema infrastructure, GitHub Actions

**Description**: Automated weekly schema validation against production pages. Detects missing or invalid JSON-LD, tracks rich result eligibility, and alerts on regressions.

**Acceptance Criteria**:

- [ ] Weekly GitHub Actions workflow crawls all production pages
- [ ] Extracts all `<script type="application/ld+json">` blocks
- [ ] Validates JSON syntax
- [ ] Validates required properties per `@type`
- [ ] Checks for duplicate or conflicting schema on the same page
- [ ] Results stored in Supabase for trend tracking
- [ ] Alert sent to Slack if any page loses its JSON-LD or fails validation
- [ ] Schema coverage metric: percentage of pages with valid JSON-LD (target: 100%)

---

### FR-PERF-005: Broken Link Detection

**Priority**: P2 (Ship within 60 days)
**Depends On**: GitHub Actions, production deployment

**Description**: Nightly broken link scanner that crawls all published pages, checks every `<a href>` for HTTP status, and categorizes findings by severity.

**Acceptance Criteria**:

- [ ] Nightly GitHub Actions workflow crawls all sitemap URLs
- [ ] Checks internal links (P0 severity), outbound links (P1 severity), and redirect chains > 2 hops (P2 severity)
- [ ] P0 findings (internal broken links) trigger immediate Slack alert
- [ ] Weekly digest of all findings posted to Slack `#seo-alerts`
- [ ] Results stored in Supabase for trend tracking
- [ ] Link health metric: percentage of links returning 200 (target: 99%+)

---

### FR-PERF-006: Bundle Size Monitoring

**Priority**: P0 (Launch Blocker)
**Depends On**: CI pipeline

**Description**: Bundle analyzer runs in CI to enforce JavaScript bundle size budgets. Prevents performance regressions from new dependencies or code changes.

**Acceptance Criteria**:

- [ ] `@next/bundle-analyzer` or `bundlewatch` configured in CI
- [ ] Total JS bundle limit: 200KB gzipped (warning at 150KB)
- [ ] Individual chunk limit: 100KB gzipped
- [ ] Map component (dynamic import): 230KB gzipped max
- [ ] CI fails if any budget is exceeded
- [ ] Bundle size delta displayed in PR comment

---

## 10. Dependencies and Sequencing

### P0 Launch Blockers (Weeks 1-4)

| FR | Name | Depends On | Estimated Effort |
|---|---|---|---|
| FR-SEO-001 | Sitemap Generation | Next.js setup, MDX pipeline | 0.5 days |
| FR-SEO-002 | Robots.txt with AI Crawlers | Next.js setup | 0.5 days |
| FR-SEO-003 | Canonical Strategy | Nginx Ingress, domain config | 1 day |
| FR-SEO-004 | Security Headers | Nginx Ingress, next.config | 0.5 days |
| FR-SEO-005 | Per-Route Metadata | Content for each page | 2 days |
| FR-SEO-006 | Redirect Management | next.config | 0.5 days |
| FR-SCHEMA-001 | JSON-LD Component | React components | 0.5 days |
| FR-SCHEMA-002 | Organization Schema | FR-SCHEMA-001 | 0.5 days |
| FR-SCHEMA-003 | BreadcrumbList Schema | FR-SCHEMA-001 | 0.5 days |
| FR-SCHEMA-004 | Homepage Schema | FR-SCHEMA-001, pricing data | 0.5 days |
| FR-SCHEMA-005 | FAQPage Schema | FR-SCHEMA-001, FAQ content | 2 days |
| FR-SCHEMA-006 | HowTo Schema | FR-SCHEMA-001 | 0.5 days |
| FR-SCHEMA-008 | Product Schema (Pricing) | FR-SCHEMA-001, pricing data | 0.5 days |
| FR-SCHEMA-011 | Schema Validation CI | GitHub Actions | 1 day |
| FR-AIO-001 | AI Summary Blocks | Page content | 1 day |
| FR-AIO-002 | llms.txt | Core pages published | 0.5 days |
| FR-AIO-004 | Comparison Tables | Segment page content | 1 day |
| FR-ANALYTICS-001 | Plausible Setup | Plausible account | 0.5 days |
| FR-ANALYTICS-002 | Plausible Custom Goals | FR-ANALYTICS-001 | 1 day |
| FR-ANALYTICS-004 | Unified Analytics Wrapper | FR-ANALYTICS-001 | 0.5 days |
| FR-ANALYTICS-005 | Conversion Tracking | FR-ANALYTICS-004 | 1 day |
| FR-ANALYTICS-006 | Consent Architecture | FR-ANALYTICS-001 | 1 day |
| FR-EMAIL-001 | Form Architecture | Turnstile, Supabase | 2 days |
| FR-PROOF-001 | Trust Metrics Strip | UI components | 1 day |
| FR-PROOF-002 | Data Source Logos | Logo assets | 0.5 days |
| FR-PROOF-004 | Compliance Badges | Legal review | 0.5 days |
| FR-PROOF-005 | Fabricated Content CI Guard | GitHub Actions | 0.5 days |
| FR-PERF-001 | CWV Targets | Performance optimization | Ongoing |
| FR-PERF-002 | Lighthouse CI | GitHub Actions | 1 day |
| FR-PERF-006 | Bundle Size Monitoring | CI pipeline | 0.5 days |

**Total Estimated P0 Effort**: ~22 days (1 developer, some parallelizable)

### P1 Ship Within 30 Days (Weeks 5-8)

| FR | Name | Estimated Effort |
|---|---|---|
| FR-SCHEMA-007 | Article Schema (Blog) | 0.5 days |
| FR-AIO-003 | AI Plugin Manifest | 0.5 days |
| FR-AIO-005 | Content Freshness Signals | 1 day |
| FR-CONTENT-001 | MDX Blog Infrastructure | 3 days |
| FR-CONTENT-002 | Content Type Definitions | 1 day |
| FR-CONTENT-003 | Pillar/Cluster Architecture | 1 day |
| FR-CONTENT-004 | Internal Linking Rules | 2 days |
| FR-CONTENT-005 | Publishing Workflow | 1 day |
| FR-ANALYTICS-003 | GA4 Consent-Gated | 1 day |
| FR-EMAIL-002 | Lead Magnets | 2 days |
| FR-EMAIL-003 | SendGrid Integration | 2 days |
| FR-EMAIL-004 | Nurture Sequences | 3 days |
| FR-EMAIL-005 | Double Opt-In | 1 day |
| FR-PROOF-003 | Review Platform Profiles | 1 day |
| FR-PERF-003 | Performance Monitoring | 2 days |
| FR-PERF-004 | Schema Validation Monitoring | 1 day |

### P2 Ship Within 60 Days (Weeks 9-12)

| FR | Name | Estimated Effort |
|---|---|---|
| FR-SCHEMA-009 | VideoObject Schema | 0.5 days |
| FR-SCHEMA-010 | Review Schema | 1 day |
| FR-PERF-005 | Broken Link Detection | 2 days |

### P3 Ship Within 90 Days (Weeks 13-16)

| FR | Name | Estimated Effort |
|---|---|---|
| FR-PAID-001 | Landing Page Architecture | 3 days |
| FR-PAID-002 | Conversion Pixel Setup | 1 day |
| FR-PAID-003 | Retargeting Audiences | 1 day |

---

## 11. Metrics and Targets

### Monthly KPI Dashboard

| Metric | Month 1-3 | Month 4-6 | Month 7-12 | Tool |
|---|---|---|---|---|
| Organic Sessions | 500/mo | 2,000/mo | 5,000/mo | Plausible |
| Demo Requests (organic) | 5/mo | 15/mo | 40/mo | Plausible goals |
| Lead Magnet Downloads | 20/mo | 60/mo | 150/mo | Plausible goals |
| Keyword Rankings (Top 10) | 5 | 20 | 50 | Google Search Console |
| AI Answer Engine Citations | 0 | 3 | 10 | Manual + Perplexity tracking |
| Schema Coverage | 100% | 100% | 100% | Validation CI + monitoring |
| Core Web Vitals (Good) | 100% pages | 100% pages | 100% pages | Lighthouse CI |
| Organic Conversion Rate | 2% | 3% | 4% | Plausible |
| Content Freshness Score (avg) | 95 | 90 | 85+ | Custom scoring script |
| Email List Size | 50 | 250 | 1,000 | SendGrid |
| Broken Link Rate | <1% | <1% | <1% | Link checker |
| Lighthouse Performance (avg) | 95+ | 95+ | 95+ | Lighthouse CI |

### Revenue Attribution Targets

| Timeframe | Estimated Organic Pipeline Value | Basis |
|---|---|---|
| Year 1 | $180K - $420K | 40 demos/mo x $2,500 pipeline value x 12 months x 15-35% close rate |
| Year 2 | $800K - $2.4M | Compounding organic growth + content authority |
| Year 3 | $2.6M - $10.9M | Category ownership + multi-segment penetration |

---

## 12. Risks

### RISK-001: Zero Content at Launch (CRITICAL)

**Probability**: High | **Impact**: High | **Severity**: Critical

The site launches with infrastructure but no blog posts, no case studies, no sample binders, and no reviews. Search engines and AI answer engines have nothing to index beyond core pages.

**Mitigation**:
- Seed 3-5 pillar blog posts BEFORE launch (one per content pillar)
- Generate sample binders from demo data immediately (church/mission version first)
- Create FAQ content for all 4 segment pages (fastest path to AI citations)
- Launch with at least 1 compliance guide (FERPA is the highest-volume opportunity)

### RISK-002: Fabricated Social Proof Discovered (CRITICAL)

**Probability**: Medium | **Impact**: Existential | **Severity**: Critical

If any fabricated testimonial persists from the previous site, it would destroy credibility for a platform that sells documented trust.

**Mitigation**:
- FR-PROOF-005 (Fabricated Content CI Guard) blocks merge of any suspect content
- Pre-launch codebase audit for fabricated names and organizations
- Replace all fabricated proof with verifiable trust metrics strip
- Zero-tolerance policy: no testimonial without written verification

### RISK-003: FERPA/Compliance Overclaim (HIGH)

**Probability**: Medium | **Impact**: High | **Severity**: High

Claiming certifications before completion exposes SafeTrekr to legal liability and trust destruction.

**Mitigation**:
- FR-PROOF-004 enforces approved compliance language
- CI check flags prohibited terms ("FERPA Certified", "SOC 2 Certified")
- Quarterly compliance claim audit by legal

### RISK-004: ISR Cache on DigitalOcean (MEDIUM)

**Probability**: Medium | **Impact**: Medium | **Severity**: Medium

ISR on standalone Next.js (non-Vercel) requires custom cache handling. If the persistent volume fails or is misconfigured, ISR will not function correctly and blog content will not update.

**Mitigation**:
- Configure persistent volume claim for `.next/cache` in Kubernetes
- Fallback: full rebuild on content changes via GitHub Actions webhook
- Monitor ISR cache hit rates via custom logging
- Document ISR cache troubleshooting in runbook

### RISK-005: AI Crawler Policy Changes (MEDIUM)

**Probability**: Medium | **Impact**: Medium | **Severity**: Medium

AI providers may change crawling policies, opt-in requirements, or citation formats.

**Mitigation**:
- Content structure works for both traditional and AI search (FAQ schema, comparison tables, direct-answer blocks)
- `robots.txt` maintained as a living document; reviewed monthly
- `llms.txt` and `ai-plugin.json` updated as standards evolve
- Weekly monitoring of AI crawler policy announcements

### RISK-006: Seasonal Demand Mismatch (MEDIUM)

**Probability**: Medium | **Impact**: Medium | **Severity**: Medium

Content published after the planning season misses the buying window.

**Mitigation**:
- Implement seasonal content calendar aligned to segment planning cycles
- Publish segment content 8 weeks before peak planning season
- K-12 spring trips: content published November-February
- Church mission trips: content published July-October
- ISR keeps seasonal content fresh year-round

### RISK-007: SendGrid Deliverability (LOW)

**Probability**: Low | **Impact**: Medium | **Severity**: Low-Medium

Email deliverability issues could prevent lead magnet delivery and nurture sequences from reaching prospects.

**Mitigation**:
- Authenticate sender domain (SPF, DKIM, DMARC) before sending any email
- Start with low volume and warm up the sending reputation
- Monitor bounce rates and complaint rates in SendGrid dashboard
- Use dedicated IP address when volume exceeds 50K emails/month
- Configure bounce/complaint webhooks to auto-suppress problematic addresses

---

*PRD generated: 2026-03-24*
*Persona: World-Class Digital Marketing Lead*
*Project: SafeTrekr Marketing Site*
*Tech Stack: Next.js 15 + DigitalOcean DOKS + Docker + SendGrid + Plausible*


---

# Testing, Quality Assurance & Adversarial Testing PRD

## SafeTrekr Marketing Site

**Agent**: Crash-to-Fix Oracle (CFO) v1.1
**Date**: 2026-03-24
**Status**: Draft
**Tech Stack**: Next.js 15 (App Router) / React 19 / Tailwind CSS 4 / DigitalOcean DOKS / Supabase / SendGrid
**Testing Stack**: Vitest / Playwright / axe-core / Lighthouse CI / bundlewatch

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Testing Infrastructure Setup](#2-testing-infrastructure-setup)
3. [Unit Testing Requirements](#3-unit-testing-requirements)
4. [Component Testing Requirements](#4-component-testing-requirements)
5. [Integration Testing Requirements](#5-integration-testing-requirements)
6. [End-to-End Testing Requirements](#6-end-to-end-testing-requirements)
7. [Accessibility Testing Requirements](#7-accessibility-testing-requirements)
8. [Performance Testing Requirements](#8-performance-testing-requirements)
9. [Security Testing Requirements](#9-security-testing-requirements)
10. [Visual Regression Testing Requirements](#10-visual-regression-testing-requirements)
11. [SEO Testing Requirements](#11-seo-testing-requirements)
12. [Cross-Browser Testing Requirements](#12-cross-browser-testing-requirements)
13. [CI Pipeline Integration](#13-ci-pipeline-integration)
14. [Test Data Management](#14-test-data-management)
15. [Quality Gates](#15-quality-gates)
16. [Monitoring and Alerting](#16-monitoring-and-alerting)
17. [Scenario-to-Test Mapping](#17-scenario-to-test-mapping)

---

## 1. Executive Summary

SafeTrekr is a security product selling documented trust. A single XSS vulnerability, an accessibility failure in a K-12 school district evaluation, or a broken demo request form does not just lose a lead -- it proves to the buyer that SafeTrekr cannot protect what it claims to protect. The testing strategy must reflect this existential constraint.

This PRD defines 15 functional requirement groups covering every layer of the testing pyramid, from isolated unit tests through production monitoring. It maps all 57 adversarial scenarios from `analysis/scenarios.md` to concrete test implementations and establishes quality gates that block merge and deploy when thresholds are violated.

**Key constraints from the tech stack**:

- **DigitalOcean DOKS** (not Vercel): No native preview deploys, no built-in Edge runtime, no automatic ISR cache. All CI/CD runs through GitHub Actions building Docker images pushed to DigitalOcean Container Registry. ISR caching is handled by Next.js standalone output with Nginx reverse proxy.
- **Next.js standalone output**: The `next build` produces a standalone Node.js server inside Docker. Image optimization uses `sharp` (self-hosted). Testing must validate the Docker build, not just `next dev`.
- **Nginx ingress controller**: SSL termination, caching, and security header injection happen at the Nginx layer, meaning header-based security tests must run against the full stack (not just Next.js).

**Testing budget breakdown**:

| Layer | Tool | Estimated Tests | Run Time Target |
|---|---|---|---|
| Unit | Vitest | 250-350 | < 30s |
| Component | Vitest + Testing Library | 80-120 | < 45s |
| Integration | Vitest + MSW | 40-60 | < 60s |
| E2E | Playwright | 80-100 | < 5 min (parallelized) |
| Accessibility | axe-core (in Playwright) | 20-30 | < 2 min |
| Performance | Lighthouse CI | 9 pages | < 3 min |
| Visual Regression | Playwright screenshots | 30-40 | < 3 min |
| Security | Playwright + API | 25-35 | < 2 min |
| SEO | Playwright + API | 15-20 | < 1 min |

---

## 2. Testing Infrastructure Setup

### FR-QA-001: Vitest Configuration

**Priority**: P0
**Acceptance Criteria**:

1. Vitest is configured in `vitest.config.ts` at the project root with the following settings:
   - `environment: 'jsdom'` for component tests, `environment: 'node'` for unit/integration tests
   - Path aliases matching `tsconfig.json` (e.g., `@/` maps to `src/`)
   - `globals: true` for implicit `describe`, `it`, `expect`
   - `setupFiles: ['./tests/setup.ts']` loading React Testing Library matchers, MSW server setup, and global mocks
   - CSS modules support via `css: { modules: { classNameStrategy: 'non-scoped' } }`
   - Coverage provider: `v8` with thresholds: `{ branches: 80, functions: 80, lines: 80, statements: 80 }`
   - `pool: 'forks'` for isolation between test files
   - `testTimeout: 10000` (10 seconds)
   - `include: ['src/**/*.test.ts', 'src/**/*.test.tsx']`
   - Workspace configuration splitting unit/component/integration into separate projects with appropriate environments

2. The `tests/setup.ts` file must:
   - Import `@testing-library/jest-dom/vitest` for DOM matchers
   - Initialize MSW server with `beforeAll`/`afterEach`/`afterAll` lifecycle hooks
   - Mock `next/navigation` (useRouter, usePathname, useSearchParams)
   - Mock `next/image` to render a standard `<img>` tag
   - Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to a test value
   - Suppress `console.error` for expected React warnings (configurable)

3. Scripts in `package.json`:
   - `"test"`: Runs all Vitest tests
   - `"test:unit"`: Runs tests matching `src/**/*.unit.test.ts`
   - `"test:component"`: Runs tests matching `src/**/*.component.test.tsx`
   - `"test:integration"`: Runs tests matching `src/**/*.integration.test.ts`
   - `"test:coverage"`: Runs with `--coverage` flag and outputs to `coverage/`
   - `"test:watch"`: Runs in watch mode for development

**Rationale**: Vitest provides native ESM support required by Next.js 15 / React 19, sub-second startup, and compatible API with the team's existing testing patterns.

### FR-QA-002: Playwright Configuration

**Priority**: P0
**Acceptance Criteria**:

1. Playwright is configured in `playwright.config.ts` with:
   - `baseURL` set from `PLAYWRIGHT_BASE_URL` environment variable (defaulting to `http://localhost:3000`)
   - Projects for 6 browser configurations:
     - `chromium` (desktop, 1280x720)
     - `firefox` (desktop, 1280x720)
     - `webkit` (desktop, 1280x720)
     - `mobile-chrome` (Pixel 5 device profile)
     - `mobile-safari` (iPhone 13 device profile)
     - `edge` (Microsoft Edge channel)
   - `retries: 2` in CI, `retries: 0` locally
   - `workers: '50%'` in CI (half of available cores)
   - `timeout: 30000` per test, `expect.timeout: 5000`
   - `use.trace: 'on-first-retry'` for debugging failures
   - `use.screenshot: 'only-on-failure'`
   - `use.video: 'on-first-retry'`
   - Output directory: `test-results/`
   - Reporter: `[['html', { open: 'never' }], ['json', { outputFile: 'test-results/results.json' }], ['github']]`

2. A `webServer` config starts the application before E2E runs:
   - For local: `command: 'npm run dev'`
   - For CI against staging: no webServer (tests hit the deployed staging namespace in DOKS)
   - For CI against Docker: `command: 'docker compose -f docker-compose.test.yml up --wait'`

3. Global setup in `tests/e2e/global-setup.ts`:
   - Validates required environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` for test project, `SENDGRID_API_KEY`)
   - Seeds the test Supabase project with baseline data if needed
   - Outputs a storage state file for authenticated scenarios (future)

4. Test files are organized as:
   - `tests/e2e/critical-path/` -- SCENARIO-001 through SCENARIO-012
   - `tests/e2e/edge-cases/` -- SCENARIO-013 through SCENARIO-019
   - `tests/e2e/security/` -- SCENARIO-020 through SCENARIO-028
   - `tests/e2e/performance/` -- SCENARIO-029 through SCENARIO-034
   - `tests/e2e/accessibility/` -- SCENARIO-035 through SCENARIO-040
   - `tests/e2e/integration/` -- SCENARIO-041 through SCENARIO-046
   - `tests/e2e/error-handling/` -- SCENARIO-047 through SCENARIO-052
   - `tests/e2e/data-integrity/` -- SCENARIO-053 through SCENARIO-057

**Rationale**: Playwright provides cross-browser coverage including WebKit (Safari), built-in network interception, and trace recording critical for debugging flaky tests in CI.

### FR-QA-003: axe-core Integration

**Priority**: P0
**Acceptance Criteria**:

1. `@axe-core/playwright` is installed and configured as a Playwright fixture:
   - A custom `test` fixture extends Playwright's base test with an `makeAxeBuilder()` helper
   - Default axe configuration disables rules that conflict with Next.js SSR patterns (documented with justification per rule)
   - WCAG 2.2 AA ruleset is explicitly enabled: `withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])`

2. Every E2E page test includes an axe scan as a final assertion:
   ```
   const results = await makeAxeBuilder().analyze();
   expect(results.violations).toEqual([]);
   ```

3. axe-core is also integrated into Vitest component tests via `@axe-core/react` for render-time checks on isolated components.

4. A dedicated accessibility test suite in `tests/e2e/accessibility/` runs axe-core against every page listed in the sitemap.

5. The axe configuration file `tests/axe.config.ts` exports shared settings used by both Playwright and Vitest integrations.

**Rationale**: axe-core detects approximately 57% of WCAG issues automatically. Combined with manual keyboard and screen reader tests, this covers the accessibility requirements for K-12 school district procurement (Section 508 compliance).

### FR-QA-004: Lighthouse CI Configuration

**Priority**: P0
**Acceptance Criteria**:

1. `@lhci/cli` is configured via `lighthouserc.js` at the project root with:
   - `collect.url`: All 9 core pages (/, /solutions/k12, /solutions/churches, /pricing, /how-it-works, /demo, /contact, /blog, /about)
   - `collect.numberOfRuns: 3` (median of 3 runs per page)
   - `collect.settings.chromeFlags: ['--no-sandbox', '--disable-gpu']` for CI Docker environments
   - `collect.settings.preset: 'desktop'` and a separate config for mobile
   - `assert.preset: 'lighthouse:recommended'` with overrides:
     - Performance: >= 95
     - Accessibility: >= 95
     - Best Practices: >= 95
     - SEO: >= 95
   - Specific audit assertions:
     - `largest-contentful-paint`: maxNumericValue: 1500 (1.5s)
     - `cumulative-layout-shift`: maxNumericValue: 0.05
     - `total-blocking-time`: maxNumericValue: 200
     - `interactive`: maxNumericValue: 3000
   - `upload.target: 'filesystem'` with `outputDir: '.lighthouseci/'` (uploaded as CI artifact)

2. Lighthouse CI runs against the Docker-built application (not `next dev`) to measure production-realistic performance.

3. For DOKS deployment: Lighthouse CI targets the staging namespace URL after the Docker image is deployed to the staging environment.

4. Results are stored as GitHub Actions artifacts and compared against the previous run to detect regressions.

**Rationale**: Lighthouse CI provides automated enforcement of Core Web Vitals budgets. Running against the Docker build ensures measurements reflect production conditions (standalone output + sharp image optimization), not development mode.

---

## 3. Unit Testing Requirements

### FR-QA-005: Utility Function Tests

**Priority**: P0
**Acceptance Criteria**:

1. **`src/lib/sanitize.ts`** -- Input sanitization (critical for SCENARIO-020, SCENARIO-025, SCENARIO-027):
   - Test that HTML tags are stripped or escaped: `<script>`, `<img onerror>`, `<svg onload>`, `<iframe>`
   - Test that SQL injection payloads are passed through as literal strings (not executed): `'; DROP TABLE`, `' OR '1'='1`
   - Test that email header injection characters are stripped from single-line fields: `\n`, `\r`, `\r\n`
   - Test that valid international characters are preserved: accented Latin (`Jose`), CJK, Arabic, Cyrillic
   - Test that emoji are preserved in message fields but stripped from name fields
   - Test that null bytes (`\0`) are stripped
   - Test boundary: empty string input returns empty string
   - Test boundary: input exceeding max length is truncated (not errored)
   - Minimum 20 test cases covering the OWASP XSS Filter Evasion Cheat Sheet patterns

2. **`src/lib/analytics.ts`** -- Analytics helpers (supports SCENARIO-043, SCENARIO-053):
   - Test `trackEvent()` calls Plausible API with correct parameters
   - Test `trackEvent()` no-ops when Plausible is not loaded (ad-blocker scenario)
   - Test `trackEvent()` no-ops during SSR (window is undefined)
   - Test UTM parameter extraction from URL search params
   - Test UTM parameter persistence across navigation (sessionStorage)
   - Test fallback to `source: 'direct'` when no UTM params exist
   - Test referrer capture from `document.referrer`
   - Minimum 12 test cases

3. **`src/lib/hash.ts`** -- IP hashing utility (critical for SCENARIO-054):
   - Test SHA-256 hash output is 64-character hex string
   - Test deterministic: same input always produces same hash
   - Test different inputs produce different hashes
   - Test with IPv4 and IPv6 addresses
   - Test that raw IP is never present in the output
   - Minimum 6 test cases

4. **`src/lib/rate-limit.ts`** -- Rate limiting logic (supports SCENARIO-022):
   - Test that requests within the limit succeed
   - Test that requests exceeding the limit return a 429 indicator
   - Test that the limit resets after the window expires
   - Test per-IP isolation (different IPs have independent limits)
   - Test sliding window vs. fixed window behavior (whichever is implemented)
   - Minimum 8 test cases

5. **`src/lib/turnstile.ts`** -- Turnstile verification (supports SCENARIO-023):
   - Test successful verification with valid token returns `{ success: true }`
   - Test expired token returns `{ success: false }`
   - Test missing token returns `{ success: false }`
   - Test invalid/fabricated token returns `{ success: false }`
   - Test network failure to Cloudflare returns a handled error (not an unhandled rejection)
   - Mock the Cloudflare siteverify API endpoint
   - Minimum 6 test cases

6. **`src/lib/format.ts`** -- Formatting utilities:
   - Test currency formatting (`$15/student`, `$450/trip`)
   - Test number formatting with locale awareness
   - Test date formatting for blog post dates
   - Test reading time calculation from MDX content length
   - Minimum 8 test cases

### FR-QA-006: Zod Schema Validation Tests

**Priority**: P0
**Acceptance Criteria**:

1. **Demo request schema** (`src/lib/schemas/demo-request.ts`):
   - Test valid submission with all required fields passes
   - Test valid submission with all optional fields passes
   - Test missing required fields each produce specific error messages
   - Test email validation: accepts valid emails, rejects malformed emails, rejects emails > 254 chars
   - Test firstName/lastName: min 1 char, max 100 chars, rejects empty strings
   - Test organization: min 1 char, max 200 chars
   - Test segment enum: accepts only defined values (k12, churches, higher_education, corporate, sports, other)
   - Test tripsPerYear: accepts 0-500, rejects negative numbers, rejects > 500
   - Test groupSize: accepts 1-1000, rejects 0, rejects > 1000
   - Test timeline enum: accepts only defined values
   - Test message: max 2000 chars, accepts empty
   - Test XSS payloads in string fields: schema should accept them (sanitization is a separate layer) OR reject HTML via regex refinement (document which approach is used)
   - Minimum 25 test cases

2. **Contact form schema** (`src/lib/schemas/contact.ts`):
   - Test valid submission passes
   - Test subject: min 1 char, max 200 chars
   - Test message: min 10 chars, max 5000 chars
   - Test email validation matches demo request schema
   - Minimum 12 test cases

3. **Newsletter schema** (`src/lib/schemas/newsletter.ts`):
   - Test valid email passes
   - Test invalid email formats rejected
   - Test empty email rejected
   - Minimum 6 test cases

4. **Quote request schema** (`src/lib/schemas/quote-request.ts`):
   - Test valid submission with all trip-specific fields
   - Test destination: max 200 chars
   - Test group_size: 1-1000
   - Test number_of_trips: 1-100
   - Test departure_date: must be future date
   - Minimum 15 test cases

5. All schema test files follow the naming convention `[schema-name].schema.unit.test.ts`.

6. Every Zod schema test includes a snapshot of the schema shape to detect unintentional schema changes.

**Rationale**: Zod schemas are the first line of defense against malformed and malicious input. Every field constraint must be tested because a missing `max()` on a string field creates an unbounded write to Supabase, and a missing enum constraint on segment allows injection of unexpected values into JSONB.

### FR-QA-007: Content Validation Tests

**Priority**: P1
**Acceptance Criteria**:

1. **Pricing data validation** (supports SCENARIO-006):
   - Test that pricing constants match the codebase source of truth:
     - Tier 1: $450/trip, $15/student (based on 30 students)
     - Tier 2: $750/trip
     - Tier 3: $1,250/trip
   - Test volume discount calculations: 5-9 trips (5%), 10-24 (10%), 25-49 (15%), 50+ (20%)
   - Test per-student price calculation function for varying group sizes
   - Test that no pricing value is hardcoded in component files (all imported from single source)

2. **Navigation structure validation** (supports SCENARIO-002):
   - Test that the navigation config exports exactly 5 primary items
   - Test that all navigation hrefs resolve to valid routes (cross-referenced with filesystem)
   - Test that mobile and desktop navigation configs are consistent

3. **SEO metadata validation** (supports SCENARIO-010):
   - Test that every page exports `generateMetadata` or has static metadata
   - Test that no two pages share the same title or description
   - Test that all titles are between 30-60 characters
   - Test that all descriptions are between 120-160 characters

4. **JSON-LD schema validation** (supports SCENARIO-057):
   - Test that JSON-LD output for each page type is valid JSON
   - Test that required schema.org properties are present per page type
   - Test that dates are ISO 8601 format
   - Test that image URLs are absolute
   - Test that no schema contains null or empty-string values for required fields

---

## 4. Component Testing Requirements

### FR-QA-008: shadcn/ui Customization Tests

**Priority**: P0
**Acceptance Criteria**:

1. **Button component** (`src/components/ui/button.tsx`):
   - Test all variants render: default, destructive, outline, secondary, ghost, link
   - Test all sizes render: default, sm, lg, icon
   - Test disabled state: `aria-disabled="true"`, no click handler fires, visual opacity
   - Test loading state: spinner visible, click disabled, `aria-busy="true"`
   - Test `asChild` prop renders as child element (e.g., `<a>`)
   - Test keyboard activation: Enter and Space trigger onClick
   - Test focus-visible ring appears on keyboard focus, not on mouse click
   - axe-core scan passes on each variant
   - Minimum 12 test cases

2. **Form components** (Input, Textarea, Select, Checkbox, RadioGroup):
   - Test each renders with a visible label (via `<Label>` or `aria-label`)
   - Test required state shows `aria-required="true"`
   - Test error state: `aria-invalid="true"`, `aria-describedby` points to error message
   - Test help text association via `aria-describedby`
   - Test `prefers-color-scheme: dark` renders without contrast failures (when dark mode is added)
   - Test custom select component is keyboard navigable (Arrow keys, Enter, Escape)
   - axe-core scan passes on each component in all states (default, error, disabled, focused)

3. **Sheet component** (mobile navigation drawer):
   - Test opens on trigger click
   - Test closes on overlay click
   - Test closes on Escape key press
   - Test focus is trapped inside the sheet when open
   - Test focus returns to trigger element when sheet closes
   - Test `aria-expanded` toggles on trigger
   - Test `role="dialog"` and `aria-modal="true"` on the sheet

4. **Dialog component** (lead capture modal, if used):
   - Same focus trap and ARIA tests as Sheet
   - Test content is removed from DOM when closed (not just hidden)
   - Test `aria-labelledby` points to the dialog title

### FR-QA-009: Form Component Tests

**Priority**: P0
**Acceptance Criteria**:

1. **DemoRequestForm component** (supports SCENARIO-003, SCENARIO-013, SCENARIO-014):
   - Test renders all required fields with correct labels
   - Test renders optional fields
   - Test Zod validation errors display inline on blur and on submit
   - Test successful submission shows success message
   - Test loading state during submission (button disabled, spinner)
   - Test double-click prevention: only one submission fires
   - Test honeypot field is in DOM but hidden (`display: none` or offscreen positioning)
   - Test honeypot field has `aria-hidden="true"` and `tabindex="-1"`
   - Test Turnstile widget container is present
   - Test segment pre-selection from URL query param (`/demo?segment=k12`)
   - Test all form data is passed to the Server Action
   - Test form preserves data on validation error (fields not cleared)

2. **ContactForm component** (supports SCENARIO-004):
   - Test required field validation (email, firstName, lastName, subject, message)
   - Test message minimum length enforcement (10 chars)
   - Test successful submission and success state

3. **NewsletterForm component** (supports SCENARIO-011):
   - Test email-only field with inline validation
   - Test success message: "Please check your email to confirm your subscription."
   - Test duplicate email submission handling

4. **QuoteRequestForm component** (supports SCENARIO-012):
   - Test trip-specific fields render (destination, departure date, group size, trip count)
   - Test date picker only allows future dates
   - Test all fields map to correct JSONB structure

### FR-QA-010: Navigation Component Tests

**Priority**: P0
**Acceptance Criteria**:

1. **Header/Navigation component** (supports SCENARIO-002):
   - Test renders 5 primary nav items with correct labels and hrefs
   - Test `aria-current="page"` is set on the active nav item
   - Test scroll behavior: transparent background at top, solid background after scroll
   - Test CTA button appears after scroll threshold
   - Test skip navigation link is the first focusable element
   - Test logo links to homepage
   - Test mobile breakpoint: hamburger menu visible below 1024px, nav items hidden
   - Test mega-menu for Solutions: opens on hover/focus, shows segment links

2. **MobileNav component**:
   - Test hamburger button has `aria-expanded`, `aria-controls`, `aria-label`
   - Test opens the Sheet component on click
   - Test all nav items are present and functional inside the Sheet
   - Test closing the menu returns focus to the hamburger button

3. **Footer component** (supports SCENARIO-011):
   - Test renders all footer links with correct hrefs
   - Test newsletter form is present
   - Test renders the current year in copyright
   - Test landmark: `role="contentinfo"` or `<footer>` element

4. **Breadcrumb component** (supports SCENARIO-008, SCENARIO-040):
   - Test renders correct breadcrumb trail per page
   - Test `aria-label="Breadcrumb"` on the nav element
   - Test current page item has `aria-current="page"`
   - Test breadcrumb JSON-LD output matches visual breadcrumb

---

## 5. Integration Testing Requirements

### FR-QA-011: Server Action Integration Tests

**Priority**: P0
**Acceptance Criteria**:

1. **Demo request Server Action** (`src/app/actions/demo-request.ts`):
   - Test with valid input: returns `{ success: true, message: '...' }`
   - Test with invalid Zod input: returns `{ success: false, errors: {...} }`
   - Test with filled honeypot: returns `{ success: true }` (silent rejection, no DB write)
   - Test with missing Turnstile token: returns `{ success: false, message: 'Verification failed.' }`
   - Test with expired Turnstile token: returns `{ success: false }`
   - Test Supabase write: mock Supabase client, verify `.insert()` called with correct payload
   - Test SendGrid call: mock SendGrid, verify email payload includes all form fields
   - Test SendGrid failure does not prevent Supabase write (SCENARIO-049)
   - Test UTM parameters are extracted from headers/cookies and included in Supabase record
   - Test IP is hashed before storage (SCENARIO-054)
   - Test rate limiting: mock rate limiter, verify 429 response after threshold
   - Use MSW (Mock Service Worker) to intercept Supabase and SendGrid HTTP calls
   - Minimum 15 test cases

2. **Contact form Server Action** (`src/app/actions/contact.ts`):
   - Same pattern as demo request with contact-specific fields
   - Minimum 10 test cases

3. **Newsletter Server Action** (`src/app/actions/newsletter.ts`):
   - Test creates `newsletter_subscribers` record with `confirmed = false`
   - Test generates a `confirmation_token`
   - Test SendGrid confirmation email is dispatched with correct link
   - Test duplicate email returns a non-error response (idempotent)
   - Minimum 8 test cases

4. **Quote request Server Action** (`src/app/actions/quote-request.ts`):
   - Test trip-specific JSONB details structure
   - Minimum 8 test cases

### FR-QA-012: Supabase Persistence Tests

**Priority**: P0
**Acceptance Criteria**:

1. Tests run against a dedicated Supabase test project (see FR-QA-050 for test data management).

2. **`form_submissions` table**:
   - Test INSERT with all form types: demo_request, contact, quote_request, sample_binder_download
   - Test JSONB `details` column stores form-type-specific data correctly
   - Test `created_at` is auto-populated
   - Test `status` defaults to `'new'`
   - Test `crm_sync_status` defaults to `'pending'`
   - Test the database trigger creates a `crm_sync_queue` entry on INSERT
   - Test RLS: `anon` key cannot SELECT, INSERT, UPDATE, or DELETE (SCENARIO-046)
   - Test RLS: `service_role` key can perform all operations
   - Test max field lengths match Zod schema constraints (no truncation)

3. **`newsletter_subscribers` table**:
   - Test INSERT with valid email and generated token
   - Test `confirmed` defaults to `false`
   - Test confirmation update: setting `confirmed = true` and `confirmed_at`
   - Test unique constraint on email (duplicate rejection)
   - Test RLS same as `form_submissions`

4. **`analytics_events` table** (if used for server-side event tracking):
   - Test INSERT with event name, properties, timestamp
   - Test RLS prevents anon access

### FR-QA-013: SendGrid Delivery Tests

**Priority**: P1
**Acceptance Criteria**:

1. Tests use the SendGrid sandbox mode or a dedicated test API key that does not send real emails.

2. **Notification email template tests**:
   - Test demo request notification email contains all submitted fields
   - Test contact form notification email contains subject and message
   - Test reply-to header is set to the submitter's email address
   - Test from address is always the configured SafeTrekr sender
   - Test subject line includes form type identifier

3. **Newsletter confirmation email tests**:
   - Test confirmation email is sent to the subscriber's email
   - Test the confirmation link includes a valid token
   - Test the confirmation link URL structure is correct

4. **Email header injection prevention** (SCENARIO-027):
   - Test that `\n` and `\r` in form fields do not inject additional email headers
   - Test that From, Bcc, Cc headers cannot be overridden by form input
   - Verify through mock inspection that SendGrid API payload uses structured JSON (not raw SMTP), which inherently prevents header injection

5. **Failure handling**:
   - Test SendGrid 500 response: verify error is logged, Supabase write still succeeds
   - Test SendGrid 429 response: verify graceful handling
   - Test SendGrid timeout: verify timeout is < 10 seconds

---

## 6. End-to-End Testing Requirements

### FR-QA-014: Critical Path E2E Tests

**Priority**: P0
**Maps to**: SCENARIO-001 through SCENARIO-012

Every critical path scenario must have a corresponding Playwright test that executes the full user flow from browser to database. These tests are the final gate before any deployment to production.

1. **Homepage rendering** (SCENARIO-001):
   - File: `tests/e2e/critical-path/homepage.spec.ts`
   - Navigate to `/`, assert hero headline text, subheadline, primary CTA ("See a Sample Safety Binder")
   - Assert trust metrics strip: 5 badges visible with correct text
   - Assert sticky header with logo and 5 nav items
   - Assert `document.title` is non-empty and unique
   - Assert JSON-LD `<script type="application/ld+json">` present with `@type: Organization`
   - Assert no console errors (`page.on('console', ...)` filtering for `error` level)
   - Assert LCP < 1.5s via Performance API: `page.evaluate(() => new PerformanceObserver(...))`
   - Run axe-core scan, assert zero violations

2. **Primary navigation** (SCENARIO-002):
   - File: `tests/e2e/critical-path/navigation.spec.ts`
   - Click each of 5 primary nav links, assert URL changes, page heading renders, no 404
   - Assert `aria-current="page"` on active link
   - Assert logo click returns to `/`
   - Assert `page.goBack()` and `page.goForward()` work without errors

3. **Demo request form E2E** (SCENARIO-003):
   - File: `tests/e2e/critical-path/demo-request.spec.ts`
   - Fill all required and optional fields
   - Wait for Turnstile (in test mode: configure Turnstile test keys that auto-pass)
   - Assert honeypot field exists, is hidden, is not filled
   - Click submit, assert loading state on button
   - Assert success message text
   - Query Supabase test project via API: assert record exists with all fields
   - Assert Plausible conversion event fired (intercept network request to plausible.io)

4. **Contact form E2E** (SCENARIO-004):
   - File: `tests/e2e/critical-path/contact-form.spec.ts`
   - Same pattern as demo request with contact-specific assertions

5. **Sample binder download** (SCENARIO-005):
   - File: `tests/e2e/critical-path/sample-binder.spec.ts`
   - Navigate to `/resources/sample-binders`
   - Select K-12 binder, fill lead capture form, submit
   - Assert download link appears and PDF downloads (check response Content-Type: application/pdf)
   - Assert Supabase record with `form_type = 'sample_binder_download'`

6. **Pricing page** (SCENARIO-006):
   - File: `tests/e2e/critical-path/pricing.spec.ts`
   - Assert "$15/student" text visible in primary pricing framing
   - Assert all 3 tier cards render with correct dollar amounts ($450, $750, $1,250)
   - Assert FAQ section renders
   - Assert JSON-LD Product schema present
   - Assert CTA buttons link to `/demo` or `/contact`

7. **Solution pages** (SCENARIO-007):
   - File: `tests/e2e/critical-path/solutions.spec.ts`
   - Navigate to each segment page: k12, churches, higher-education, corporate
   - Assert segment-specific headline, pain points, benefits
   - Assert unique `document.title` per page
   - Assert CTA passes segment context (check href includes segment param)

8. **Blog rendering** (SCENARIO-008):
   - File: `tests/e2e/critical-path/blog.spec.ts`
   - Navigate to `/blog`, assert post cards render
   - Click first post, assert title, date, author, body content
   - Assert Article JSON-LD schema
   - Assert breadcrumb visual + schema
   - Assert OG meta tags present
   - Check response headers for appropriate `Cache-Control` values (adapted for DOKS/Nginx caching vs. Vercel CDN)

9. **Mobile responsive layout** (SCENARIO-009):
   - File: `tests/e2e/critical-path/responsive.spec.ts`
   - Test at 5 viewports: 375px, 390px, 768px, 1024px, 1280px
   - Per viewport on homepage: no horizontal overflow, text readable, images not distorted, touch targets >= 44x44px
   - Assert hamburger menu at < 1024px: opens, closes, navigates
   - Submit demo form at 375px viewport
   - Assert sticky header does not obscure content

10. **Search engine crawlability** (SCENARIO-010):
    - File: `tests/e2e/critical-path/seo-crawl.spec.ts`
    - Fetch `/robots.txt`: assert `User-agent: *` allows marketing paths, blocks `/api/` and `/_next/`
    - Assert AI crawler user-agents explicitly allowed (GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Amazonbot, Applebot-Extended, cohere-ai)
    - Fetch `/sitemap.xml`: assert all core pages listed, blog posts listed, landing pages excluded
    - For each sitemap URL: assert HTTP 200, unique `<title>`, unique `<meta name="description">`, canonical URL set
    - Assert no `noindex` meta tag on marketing pages

11. **Newsletter signup** (SCENARIO-011):
    - File: `tests/e2e/critical-path/newsletter.spec.ts`
    - Scroll to footer on any page
    - Enter email, submit
    - Assert success message: "Please check your email to confirm your subscription."
    - Query Supabase: assert record with `confirmed = false` and `confirmation_token` populated

12. **Quote request form** (SCENARIO-012):
    - File: `tests/e2e/critical-path/quote-request.spec.ts`
    - Navigate from pricing page CTA
    - Fill all fields including trip-specific details
    - Submit, assert success
    - Query Supabase: assert record with `form_type = 'quote_request'` and JSONB details

### FR-QA-015: Edge Case E2E Tests

**Priority**: P1
**Maps to**: SCENARIO-013 through SCENARIO-019

1. **Maximum field lengths** (SCENARIO-013):
   - Fill demo form with maximum-length values for every field (254 char email, 100 char names, 200 char org, 2000 char message, tripsPerYear=500, groupSize=1000)
   - Submit and verify no truncation in Supabase

2. **Double-click prevention** (SCENARIO-014):
   - Fill form, double-click submit rapidly (< 100ms gap)
   - Assert button disables after first click
   - Query Supabase: assert exactly 1 record
   - Repeat for contact and newsletter forms

3. **Browser back/forward** (SCENARIO-015):
   - Navigate /pricing -> /demo, fill partially, goBack, goForward
   - Assert no "Confirm Form Resubmission" dialog
   - Complete and submit, assert success

4. **MapLibre slow connection** (SCENARIO-016):
   - Use Playwright `page.route()` to throttle requests to `api.maptiler.com`
   - Assert static fallback renders immediately
   - Assert hero headline and CTA are visible while map loads
   - Assert page remains interactive during map load
   - Test offline: assert static fallback persists, page is usable

5. **JavaScript disabled** (SCENARIO-017):
   - Configure `javaScriptEnabled: false` in Playwright context
   - Navigate to homepage: assert text content renders (SSG HTML)
   - Navigate via standard `<a>` links to pricing: assert content renders
   - Navigate to demo: assert `<noscript>` message appears
   - Assert no broken visual states from Framer Motion

6. **Unicode/emoji support** (SCENARIO-018):
   - Submit contact form with accented Latin, CJK, Arabic, and emoji characters
   - Query Supabase: assert UTF-8 characters stored correctly (no mojibake)

7. **ISR revalidation** (SCENARIO-019):
   - Note: ISR on DOKS uses Next.js standalone cache, not Vercel CDN. Test by checking cache behavior through Nginx `X-Cache` headers or by inspecting Next.js cache directory in Docker container.
   - Modify blog post content, trigger revalidation via `revalidatePath()`
   - Assert updated content appears on subsequent request

---

## 7. Accessibility Testing Requirements

### FR-QA-016: Automated Accessibility Scanning

**Priority**: P0
**Maps to**: SCENARIO-035, SCENARIO-036, SCENARIO-037, SCENARIO-040

**Acceptance Criteria**:

1. axe-core runs on every page after full render (including lazy-loaded content) in Playwright E2E tests.

2. A dedicated test suite `tests/e2e/accessibility/full-scan.spec.ts` iterates over every URL in the sitemap and runs axe-core. Zero violations allowed.

3. axe-core WCAG 2.2 AA rules are enforced with zero tolerance for:
   - `color-contrast` (SCENARIO-037)
   - `label` (SCENARIO-036)
   - `aria-required-attr`
   - `aria-valid-attr-value`
   - `heading-order` (SCENARIO-040)
   - `landmark-one-main` (SCENARIO-040)
   - `landmark-unique`
   - `page-has-heading-one` (SCENARIO-040)
   - `image-alt`
   - `link-name`
   - `button-name`

4. Any axe-core rule that is disabled must have a documented justification in `tests/axe.config.ts` with a linked manual test plan.

### FR-QA-017: Keyboard Navigation Tests

**Priority**: P0
**Maps to**: SCENARIO-035, SCENARIO-038, SCENARIO-039

**Acceptance Criteria**:

1. **Full Tab sequence test** (SCENARIO-035):
   - File: `tests/e2e/accessibility/keyboard-nav.spec.ts`
   - Starting from homepage body, Tab through: skip nav link -> logo -> 5 nav items -> hero CTA -> all interactive elements in DOM order
   - Assert every focused element has a visible focus ring (screenshot comparison or computed style check for `outline` or `box-shadow`)
   - Assert dropdown nav items openable with Enter/Space, navigable with Arrow keys
   - Tab through demo form fields in logical order
   - Submit form with Enter key
   - Assert success message receives focus

2. **Skip navigation** (SCENARIO-039):
   - Press Tab once from page load
   - Assert skip link is visible and focused
   - Press Enter, assert focus moves to `<main>` element
   - Press Tab again, assert focus is within main content (not navigation)
   - Test on every layout variant: marketing, blog, legal

3. **Focus management on state transitions** (SCENARIO-038):
   - Submit form, assert focus moves to success message
   - Submit form with errors, assert focus moves to first error or error summary
   - Navigate between pages, assert focus resets to top/main content area

4. **Mobile menu keyboard** (SCENARIO-035):
   - At mobile viewport, Tab to hamburger, open with Enter
   - Assert focus trapped in sheet
   - Navigate items with Arrow keys
   - Close with Escape, assert focus returns to hamburger

### FR-QA-018: Screen Reader Compatibility Tests

**Priority**: P0
**Maps to**: SCENARIO-036

**Acceptance Criteria**:

1. **Automated checks** (via Playwright + axe-core):
   - All form fields have visible labels announced by screen readers (`<label>` or `aria-label`)
   - Required fields have `aria-required="true"`
   - Help text associated via `aria-describedby`
   - Validation errors associated via `aria-describedby` or `aria-errormessage`
   - Error announcements use `aria-live="polite"` or `role="alert"`
   - Success messages use `aria-live="assertive"` or `role="status"`
   - Turnstile widget is hidden from screen readers or properly labeled

2. **Manual verification checklist** (runs quarterly, not in CI):
   - VoiceOver (macOS) walkthrough of demo request form: all fields announced correctly
   - VoiceOver navigation of homepage: landmarks, headings, links announced
   - NVDA (Windows) walkthrough of same flows (tested via BrowserStack or local VM)
   - Document findings in `tests/manual/screen-reader-audit.md`

### FR-QA-019: Color Contrast Validation

**Priority**: P0
**Maps to**: SCENARIO-037

**Acceptance Criteria**:

1. axe-core `color-contrast` rule runs on every page with zero violations.

2. Unit tests in `src/lib/design-tokens.unit.test.ts` validate critical contrast ratios:
   - `foreground (#061a23)` on `background (#e7ecee)`: >= 4.5:1 (expected ~14.2:1)
   - `muted-foreground` on `background`: >= 4.5:1
   - `muted-foreground` on `card (#f7f8f8)`: >= 4.5:1
   - `primary-foreground (#ffffff)` on `primary-600 (#3f885b)`: >= 4.5:1 (button text)
   - `secondary-foreground (#e7ecee)` on `secondary (#123646)`: >= 4.5:1
   - `destructive-foreground (#ffffff)` on `destructive (#c1253e)`: >= 4.5:1

3. The contrast calculation function is tested with known passing and failing color pairs.

4. Any color token change in the design system triggers these tests.

---

## 8. Performance Testing Requirements

### FR-QA-020: Lighthouse CI Thresholds

**Priority**: P0
**Maps to**: SCENARIO-029, SCENARIO-030

**Acceptance Criteria**:

1. Lighthouse CI runs against all 9 core pages with the following minimum thresholds:
   - Performance: 95
   - Accessibility: 95
   - Best Practices: 95
   - SEO: 95

2. Individual audit assertions:
   - `largest-contentful-paint` <= 1500ms (1.5s)
   - `cumulative-layout-shift` <= 0.05
   - `total-blocking-time` <= 200ms
   - `interactive` (TTI) <= 3000ms
   - `speed-index` <= 2000ms

3. Lighthouse CI runs in two modes:
   - **Desktop**: Default Lighthouse desktop settings
   - **Mobile**: Simulated Moto G Power throttling

4. Results are compared against a stored baseline. A regression of > 5 points in any category blocks the pipeline.

5. For DOKS deployment: Lighthouse runs against the Docker-built application served locally (via `docker compose`) in CI, and against the staging namespace URL after staging deploy.

### FR-QA-021: Bundle Size Gates

**Priority**: P0
**Maps to**: SCENARIO-031, SCENARIO-033

**Acceptance Criteria**:

1. `bundlewatch` is configured in `bundlewatch.config.js` with the following thresholds (gzipped):
   - First Load JS (shared/framework): < 90KB
   - Homepage page JS: < 30KB (excluding shared)
   - Any single page JS: < 50KB (excluding shared)
   - Total initial JS for any page: < 150KB
   - MapLibre GL JS chunk: confirm it is a separate async chunk, NOT in shared/initial
   - Framer Motion chunk: < 20KB

2. `bundlewatch` runs on every PR and blocks merge if any threshold is exceeded.

3. A `next build` analysis step in CI outputs the build summary and captures:
   - Per-route bundle sizes
   - Shared chunk sizes
   - Dynamic import chunks
   - Any chunk exceeding 50KB is flagged for review

4. Specific checks for common bundle bloat:
   - `lucide-react` is tree-shaken (not the full 1MB+ library)
   - Radix UI primitives are individually imported
   - No duplicate React runtime
   - `sharp` is NOT in the client bundle (server-only)

### FR-QA-022: Core Web Vitals Monitoring

**Priority**: P1
**Maps to**: SCENARIO-030, SCENARIO-032

**Acceptance Criteria**:

1. Playwright E2E tests collect CWV metrics via the Performance API on critical pages:
   ```
   const lcpEntry = await page.evaluate(() => {
     return new Promise(resolve => {
       new PerformanceObserver(list => {
         const entries = list.getEntries();
         resolve(entries[entries.length - 1].startTime);
       }).observe({ type: 'largest-contentful-paint', buffered: true });
     });
   });
   expect(lcpEntry).toBeLessThan(1500);
   ```

2. CLS is measured on all pages via the Performance API and asserted < 0.05.

3. Image optimization checks (SCENARIO-032):
   - Assert all `<img>` elements have `srcset` and `sizes` attributes
   - Assert above-the-fold images have `loading="eager"` or `fetchpriority="high"`
   - Assert below-the-fold images have `loading="lazy"`
   - Assert images are served in AVIF or WebP format (check network responses)
   - Assert no image is served at > 2x its display dimensions

### FR-QA-023: Animation Performance Tests

**Priority**: P2
**Maps to**: SCENARIO-034

**Acceptance Criteria**:

1. Test `prefers-reduced-motion: reduce`:
   - Use Playwright `page.emulateMedia({ reducedMotion: 'reduce' })`
   - Navigate to homepage, scroll through entire page
   - Assert no elements have `opacity: 0` or `transform: translate` as initial state (content must be visible)
   - Assert no Framer Motion animation classes are active
   - Assert no JavaScript errors from Framer Motion

2. Test animation frame performance (normal motion):
   - Record a Performance trace during scroll animation
   - Assert no long frames (> 50ms) during scroll-triggered animations
   - Assert no layout thrashing during animation

---

## 9. Security Testing Requirements

### FR-QA-024: XSS Prevention Tests

**Priority**: P0
**Maps to**: SCENARIO-020, SCENARIO-055

**Acceptance Criteria**:

1. **Reflected XSS** (Playwright):
   - Submit each form with XSS payloads in every text field:
     - `<script>alert('XSS')</script>`
     - `<img src=x onerror=alert('XSS')>`
     - `"><svg onload=alert(document.cookie)>`
     - `javascript:alert('XSS')`
     - `<iframe src="https://evil.com"></iframe>`
     - `<body onload=alert('XSS')>`
     - `<input onfocus=alert('XSS') autofocus>`
   - After form submission, navigate to any page that might render stored data
   - Assert no JavaScript `alert` dialog appears (Playwright dialog handler)
   - Assert no `<script>`, `<iframe>`, `<svg>`, or event handler attributes in the rendered HTML

2. **Stored XSS** (API test):
   - Insert XSS payloads into Supabase via Server Action
   - Query the stored values and assert they are escaped or stored as literal text
   - If any admin/dashboard renders this data, verify escaping there too

3. **JSONB XSS** (SCENARIO-055):
   - Submit demo request with XSS payloads in fields that map to JSONB `details`
   - Assert Zod enum validation rejects most payloads
   - Assert no prototype pollution (`{"__proto__":{"polluted":"yes"}}` stored as literal string)
   - Assert no SQL escape from JSONB column boundary

4. **CSP enforcement** (SCENARIO-024):
   - Fetch any page, extract `Content-Security-Policy` header
   - Assert `default-src 'self'`
   - Assert `script-src` includes `'self'`, `https://challenges.cloudflare.com`, `https://plausible.io`
   - Assert `frame-src` allows only `https://challenges.cloudflare.com`
   - **FLAG and assert**: `'unsafe-inline'` and `'unsafe-eval'` are NOT in `script-src` for production. If they are present, the test MUST fail with a clear message: "CSP contains unsafe-inline/unsafe-eval. Replace with nonce-based CSP before production launch."
   - Assert `img-src` includes `'self'`, `data:`, `blob:`, `https://api.maptiler.com`
   - Assert `connect-src` includes Plausible, MapTiler, and Supabase domains

### FR-QA-025: CSRF and Origin Validation Tests

**Priority**: P0
**Maps to**: SCENARIO-021

**Acceptance Criteria**:

1. **Cross-origin form POST** (API test):
   - Send a POST request to the demo request Server Action endpoint with `Origin: https://evil.com`
   - Assert the request is rejected (HTTP 403 or no action executed)
   - Verify Next.js Server Actions' built-in CSRF protection via `__next_action_id`

2. **Cross-origin fetch** (API test):
   - Send a `fetch()` request from a different origin
   - Assert CORS headers reject the request
   - Assert `Access-Control-Allow-Origin` does not include `*` or untrusted domains

3. **Direct API route access** (API test):
   - If any API routes exist (e.g., `/api/og`, `/api/analytics/event`), verify they validate the `Origin` header
   - Assert `X-Frame-Options: DENY` prevents clickjacking (SCENARIO-028)

### FR-QA-026: Rate Limiting Tests

**Priority**: P0
**Maps to**: SCENARIO-022

**Acceptance Criteria**:

1. **Form submission rate limiting** (API test):
   - Submit the demo form successfully once
   - Submit 10 more times in rapid succession from the same IP
   - Assert HTTP 429 after the threshold (expected: 3-5 per minute)
   - Assert response includes `Retry-After` header
   - Assert response body: `{ success: false, message: "Too many requests. Please try again later." }`
   - Wait for rate limit window to expire
   - Assert next submission succeeds

2. **Cross-form rate limiting**:
   - Submit to demo, contact, and newsletter forms in rapid succession
   - Assert shared per-IP rate limit applies across all forms

3. **Analytics endpoint rate limiting**:
   - If `/api/analytics/event` exists, apply same rate limit tests

### FR-QA-027: Bot Detection Tests

**Priority**: P0
**Maps to**: SCENARIO-023, SCENARIO-026

**Acceptance Criteria**:

1. **Turnstile bypass attempts** (API test):
   - Submit without Turnstile token: assert HTTP 403
   - Submit with expired token: assert rejection
   - Submit with fabricated token: assert rejection
   - Submit with token from different site key: assert rejection
   - Submit with already-used token (replay): assert rejection
   - Assert all rejections are logged

2. **Honeypot field** (SCENARIO-026):
   - Inspect form HTML: assert honeypot field has `display: none` or offscreen positioning
   - Assert `aria-hidden="true"` and `tabindex="-1"` on honeypot
   - Submit with honeypot filled: assert HTTP 200 (fake success), no Supabase record
   - Submit with honeypot empty: assert normal processing
   - Assert `honeypot_triggered` is logged for monitoring

### FR-QA-028: SQL Injection Tests

**Priority**: P0
**Maps to**: SCENARIO-025

**Acceptance Criteria**:

1. **Form-based SQL injection** (API test):
   - Submit contact form with payloads:
     - `test@example.com'; DROP TABLE form_submissions;--`
     - `' OR '1'='1`
     - `Robert'); DELETE FROM newsletter_subscribers WHERE ('1'='1`
     - `1; SELECT * FROM pg_shadow;--`
   - Assert form either rejects (Zod validation) or stores as literal text
   - Query Supabase: assert `form_submissions` and `newsletter_subscribers` tables intact
   - Assert no database error details in HTTP response
   - Assert Server Actions use Supabase client `.insert()` (parameterized), not raw SQL

### FR-QA-029: Security Headers Tests

**Priority**: P1
**Maps to**: SCENARIO-028

**Acceptance Criteria**:

1. **Full header suite** (API test):
   - Fetch any page and assert these response headers:
     - `X-Frame-Options: DENY`
     - `X-Content-Type-Options: nosniff`
     - `Referrer-Policy: strict-origin-when-cross-origin`
     - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
     - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
     - `Content-Security-Policy` (per FR-QA-024 assertions)
   - Assert headers present on SSG pages, ISR pages, and API routes
   - Assert no `X-Powered-By` header (Next.js `poweredByHeader: false`)
   - Assert no server information leakage in `Server` header

2. **Note for DOKS**: Security headers may be injected at the Nginx ingress layer rather than (or in addition to) `next.config.ts`. Tests must validate the final response headers as received by the client, regardless of which layer adds them. The test does not care about implementation -- it cares about the HTTP response.

---

## 10. Visual Regression Testing Requirements

### FR-QA-030: Playwright Screenshot Comparison

**Priority**: P1

**Acceptance Criteria**:

1. **Baseline screenshots** are captured for every core page at 3 viewport widths:
   - Mobile: 375px (iPhone SE)
   - Tablet: 768px (iPad)
   - Desktop: 1280px

2. **Pages with baseline screenshots**:
   - Homepage (above the fold + full page)
   - Solutions K-12
   - Solutions Churches
   - Pricing (all tier cards visible)
   - How It Works (timeline section)
   - Demo request form (empty + with validation errors + success state)
   - Contact form
   - Blog index
   - Blog post (first post)
   - About page
   - 404 page
   - Footer (newsletter form visible)

3. **Comparison settings**:
   - Threshold: 0.2% pixel difference allowed (accounts for anti-aliasing)
   - `maxDiffPixelRatio: 0.002`
   - Animations disabled during screenshot: `page.emulateMedia({ reducedMotion: 'reduce' })`
   - MapLibre map replaced with static fallback during screenshots (network request interception)
   - Font loading stabilized via `page.waitForLoadState('networkidle')` or explicit font ready check

4. **Baseline management**:
   - Baseline images stored in `tests/e2e/visual-baselines/` and committed to the repository
   - Updating baselines requires explicit `npx playwright test --update-snapshots` and a review of the diff
   - CI runs visual regression tests on every PR but does NOT auto-update baselines
   - Failed visual tests upload diff images as CI artifacts for review

5. **Dark section screenshots** (if dark sections are used on pages):
   - Capture screenshots of dark-background sections separately
   - Assert text contrast in dark sections via visual comparison

### FR-QA-031: Component Visual Snapshots

**Priority**: P2

**Acceptance Criteria**:

1. Key components are visually snapshot-tested in isolation using Playwright component testing or Storybook + Chromatic (if Storybook is adopted):
   - Button (all 6 variants x 3 sizes = 18 snapshots)
   - PricingTierCard (3 tiers)
   - TrustMetricsStrip
   - SegmentCard (4 segments)
   - NavigationHeader (desktop + mobile)
   - Form field states (default, focused, error, disabled)

2. Snapshots are at 1x resolution to reduce file size.

---

## 11. SEO Testing Requirements

### FR-QA-032: Structured Data Validation

**Priority**: P1
**Maps to**: SCENARIO-057

**Acceptance Criteria**:

1. **JSON-LD extraction and validation** (Playwright):
   - For each page, extract all `<script type="application/ld+json">` elements
   - Parse as JSON and assert valid structure
   - Validate per page type:
     - Homepage: Organization + WebSite schemas
     - Solutions pages: Service or Product schema with segment information
     - Pricing: Product schema with pricing offers (AggregateOffer)
     - Blog posts: Article + BreadcrumbList schemas
     - FAQ sections: FAQPage schema
     - About: Organization schema
     - Contact: ContactPage schema
   - Assert no duplicate schema types on a single page
   - Assert all required fields are populated (no empty strings, no null)
   - Assert dates in ISO 8601 format
   - Assert image URLs are absolute (start with `https://`)

2. **Google Rich Results API** (API test, optional):
   - If the Google Rich Results Testing API is available, submit each page URL
   - Assert all schemas are eligible for rich results
   - Flag any warnings

### FR-QA-033: Meta Tag Verification

**Priority**: P1
**Maps to**: SCENARIO-010

**Acceptance Criteria**:

1. **Per-page meta tag assertions** (Playwright):
   - For every page in the sitemap:
     - `<title>` is non-empty, unique across all pages, 30-60 characters
     - `<meta name="description">` is non-empty, unique, 120-160 characters
     - `<link rel="canonical">` is set to the page's own URL (self-referencing)
     - `<meta property="og:title">` matches or is derived from `<title>`
     - `<meta property="og:description">` matches or is derived from `<meta description>`
     - `<meta property="og:image">` points to a valid URL (fetch and assert 200)
     - `<meta property="og:type">` is set (website for pages, article for blog posts)
     - `<meta name="twitter:card">` is set to `summary_large_image`
   - Assert no page has `<meta name="robots" content="noindex">` unless it is a landing page (`/lp/*`)

2. **Sitemap validation** (API test):
   - Fetch `/sitemap.xml`, parse as XML
   - Assert all core pages present: /, /solutions/*, /pricing, /how-it-works, /demo, /contact, /about, /blog, /blog/*
   - Assert landing pages (`/lp/*`) are NOT in the sitemap
   - Assert legal pages are present
   - Assert `<lastmod>` dates are ISO 8601 and not in the future
   - Assert each URL in the sitemap returns HTTP 200

3. **robots.txt validation** (API test):
   - Fetch `/robots.txt`
   - Assert `User-agent: *` section allows all marketing paths
   - Assert `/api/` and `/_next/` are disallowed
   - Assert AI crawler user-agents are explicitly allowed: GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Amazonbot, Applebot-Extended, cohere-ai
   - Assert `Sitemap:` directive points to `/sitemap.xml`

---

## 12. Cross-Browser Testing Requirements

### FR-QA-034: Browser Matrix

**Priority**: P1

**Acceptance Criteria**:

1. **Primary browsers** (full E2E suite runs):
   - Chrome 124+ (desktop)
   - Firefox 125+ (desktop)
   - Safari 17+ (via Playwright WebKit)
   - Edge 124+ (via Playwright Chromium channel)

2. **Mobile browsers** (critical path E2E subset runs):
   - Mobile Chrome on Android (Pixel 5 emulation)
   - Mobile Safari on iOS (iPhone 13 emulation)

3. **Cross-browser specific assertions**:
   - CSS `@layer` support (Tailwind CSS 4 dependency) works in all browsers
   - CSS custom properties (`var(--color-*)`) render correctly
   - `next/font` loads without FOIT/FOUT across all browsers
   - Framer Motion animations play smoothly (no layout thrashing)
   - Cloudflare Turnstile widget renders and functions in all browsers
   - `dialog` element (if used for modals) has polyfill in Safari < 17.2 if needed
   - `IntersectionObserver` for lazy loading works (all target browsers support it)
   - CSS `clamp()` for fluid typography works in all browsers

4. **Browser-specific known issues** (documented, tested, mitigated):
   - Safari: `100vh` includes URL bar; use `100dvh` or JS fallback for full-height sections
   - Safari: `scroll-behavior: smooth` may need JS polyfill
   - Firefox: Form autofill styling differences
   - All: Cookie-less Plausible analytics works identically

5. **CI execution**:
   - Chrome and Firefox: run on every PR
   - Safari (WebKit) and Edge: run on merge to main
   - Mobile browsers: run nightly

---

## 13. CI Pipeline Integration

### FR-QA-035: PR Pipeline (Runs on Every Pull Request)

**Priority**: P0

**Acceptance Criteria**:

1. The following checks run on every PR and must all pass to allow merge:

| Check | Tool | Timeout | Blocking |
|---|---|---|---|
| TypeScript compilation | `tsc --noEmit` | 60s | Yes |
| ESLint | `next lint` | 60s | Yes |
| Unit tests | Vitest (unit + component) | 90s | Yes |
| Integration tests | Vitest (integration with MSW) | 90s | Yes |
| Bundle size check | bundlewatch | 60s | Yes |
| Docker build | `docker build` | 300s | Yes |
| E2E critical path (Chrome) | Playwright (SCENARIO-001-012) | 300s | Yes |
| Accessibility scan | axe-core via Playwright | 120s | Yes |
| Visual regression | Playwright screenshots | 180s | Warning only |

2. Total PR pipeline target: < 12 minutes.

3. Tests run in parallel where possible:
   - TypeScript + ESLint + Unit tests in parallel (Stage 1)
   - Docker build in parallel with Stage 1
   - E2E + Accessibility + Visual after Docker build completes (Stage 2)

4. Failed tests upload artifacts:
   - Playwright trace files (`.zip`)
   - Playwright screenshots and videos
   - Visual regression diff images
   - Lighthouse HTML reports

### FR-QA-036: Merge Pipeline (Runs on Merge to Main)

**Priority**: P0

**Acceptance Criteria**:

1. The following additional checks run on merge to `main`:

| Check | Tool | Timeout | Blocking Deploy |
|---|---|---|---|
| Full E2E suite (Chrome + Firefox + WebKit) | Playwright | 600s | Yes |
| Security tests | Playwright + API tests | 180s | Yes |
| Performance (Lighthouse CI) | @lhci/cli | 300s | Yes |
| SEO validation | Playwright + API tests | 120s | Yes |
| Cross-browser (Edge) | Playwright | 300s | Yes |
| Docker push to registry | DigitalOcean Container Registry | 120s | Yes |
| Deploy to staging namespace | kubectl apply | 120s | Yes |
| Staging smoke tests | Playwright against staging URL | 180s | Yes |

2. Total merge pipeline target: < 20 minutes.

3. After staging deploy succeeds and smoke tests pass, production deploy is triggered (manual approval gate or automatic based on team preference).

### FR-QA-037: Nightly Pipeline

**Priority**: P1

**Acceptance Criteria**:

1. The following checks run nightly at 02:00 UTC:

| Check | Tool | Purpose |
|---|---|---|
| Full E2E (all 6 browser configs) | Playwright | Cross-browser coverage |
| Mobile browser tests | Playwright (mobile-chrome, mobile-safari) | Mobile-specific regressions |
| Performance trend | Lighthouse CI (5 runs per page) | Detect gradual degradation |
| Security scan | OWASP ZAP baseline scan (optional) | Broader security coverage |
| Dependency audit | `npm audit` | Vulnerability detection |
| Link checker | Custom Playwright test | Detect broken internal/external links |
| Certificate expiry check | Custom script against production | SSL/TLS monitoring |
| Supabase health check | API test | Database availability |

2. Nightly results are reported to a Slack channel or email digest.

3. Any nightly failure creates a GitHub Issue automatically.

### FR-QA-038: Deploy Pipeline (Production Release)

**Priority**: P0

**Acceptance Criteria**:

1. Production deploy from the merge pipeline follows this sequence:
   - Docker image is pushed to DigitalOcean Container Registry (already done in merge pipeline)
   - `kubectl set image` updates the production deployment in DOKS
   - Kubernetes performs a rolling update (zero-downtime)
   - Post-deploy smoke tests run against production URL:
     - Homepage returns 200
     - All navigation links return 200
     - Demo form page loads
     - `/robots.txt` is accessible
     - `/sitemap.xml` is accessible
     - Security headers present
   - If smoke tests fail: automatic rollback via `kubectl rollout undo`

2. Canary deployment strategy (recommended for future):
   - Deploy to 10% of pods first
   - Run smoke tests against canary
   - If passing, promote to 100%
   - If failing, rollback canary

---

## 14. Test Data Management

### FR-QA-039: Test Fixtures

**Priority**: P0

**Acceptance Criteria**:

1. All test fixtures are in `tests/fixtures/` with the following structure:
   ```
   tests/fixtures/
     forms/
       demo-request.valid.json
       demo-request.max-lengths.json
       demo-request.xss-payloads.json
       demo-request.sql-injection.json
       demo-request.unicode.json
       contact.valid.json
       contact.xss-payloads.json
       newsletter.valid.json
       quote-request.valid.json
     seo/
       expected-meta-tags.json        # Per-page expected titles/descriptions
       expected-json-ld.json           # Per-page expected schema types
       sitemap-urls.json               # Expected URLs in sitemap
     security/
       xss-payloads.json               # OWASP XSS evasion patterns
       sql-injection-payloads.json     # Common SQL injection vectors
       header-injection-payloads.json  # Email header injection patterns
     pricing/
       expected-tiers.json             # Source-of-truth pricing data
       volume-discounts.json           # Discount schedule
   ```

2. Fixtures are typed with TypeScript interfaces matching the Zod schemas.

3. Factory functions in `tests/factories/` generate randomized valid test data:
   - `createDemoRequest(overrides?)` -- generates a valid demo request with realistic fake data
   - `createContactSubmission(overrides?)` -- generates a valid contact form submission
   - `createNewsletterSubscriber(overrides?)` -- generates a valid email
   - `createQuoteRequest(overrides?)` -- generates a valid quote request with trip details
   - Overrides allow specific fields to be set (e.g., `createDemoRequest({ email: 'xss@test.com', firstName: '<script>alert(1)</script>' })`)

4. Factory functions use `@faker-js/faker` for realistic data generation.

### FR-QA-040: Supabase Test Environment

**Priority**: P0

**Acceptance Criteria**:

1. A dedicated Supabase project is used for testing, completely isolated from production and development:
   - Project name: `safetrekr-marketing-test`
   - Same schema as production (migrations applied via CI)
   - Seeded with baseline data before test runs
   - Cleaned after each test run (truncate tables)

2. Environment variables for the test Supabase project:
   - `TEST_SUPABASE_URL`
   - `TEST_SUPABASE_ANON_KEY`
   - `TEST_SUPABASE_SERVICE_ROLE_KEY`
   - Stored in GitHub Actions secrets

3. Test lifecycle:
   - `beforeAll`: Apply latest migrations, seed baseline data
   - `afterEach`: No cleanup (tests should be independent via unique data)
   - `afterAll`: Truncate all tables
   - For E2E tests: each test uses unique identifiers (e.g., unique email addresses) to avoid conflicts in parallel execution

4. For local development:
   - Supabase CLI (`supabase start`) runs a local Supabase instance
   - Tests default to the local instance when `TEST_SUPABASE_URL` is not set
   - Local Supabase uses the same migration files as production

5. **Critical**: The test Supabase project must have the same RLS policies as production. RLS bypass tests use the `service_role` key intentionally and document why.

---

## 15. Quality Gates

### FR-QA-041: Merge Blocking Gates

**Priority**: P0

**Acceptance Criteria**:

The following conditions MUST pass before a PR can be merged to `main`:

| Gate | Threshold | Tool | Rationale |
|---|---|---|---|
| TypeScript compilation | Zero errors | `tsc` | Type safety prevents runtime crashes |
| ESLint | Zero errors (warnings allowed) | `next lint` | Code quality baseline |
| Unit test pass rate | 100% | Vitest | No broken logic ships |
| Component test pass rate | 100% | Vitest | No broken UI ships |
| Integration test pass rate | 100% | Vitest | No broken data flows ship |
| Code coverage (lines) | >= 80% | Vitest/v8 | Minimum coverage floor |
| Code coverage (branches) | >= 80% | Vitest/v8 | Decision logic coverage |
| E2E critical path (Chrome) | 100% pass | Playwright | All 12 critical user flows work |
| Accessibility violations | 0 | axe-core | WCAG 2.2 AA compliance |
| Bundle size (initial JS) | < 150KB gzipped | bundlewatch | Performance budget |
| Docker build | Succeeds | Docker | Deployable artifact |

### FR-QA-042: Deploy Blocking Gates

**Priority**: P0

**Acceptance Criteria**:

The following conditions MUST pass before a merge to `main` triggers production deploy:

| Gate | Threshold | Tool | Rationale |
|---|---|---|---|
| All merge blocking gates | Pass | See above | Baseline quality |
| Full E2E (Chrome + Firefox + WebKit) | 100% pass | Playwright | Cross-browser verification |
| Security tests | 100% pass | Playwright + API | No known vulnerabilities ship |
| Lighthouse Performance | >= 95 (all pages) | @lhci/cli | CWV compliance |
| Lighthouse Accessibility | >= 95 (all pages) | @lhci/cli | Accessibility compliance |
| Lighthouse Best Practices | >= 95 (all pages) | @lhci/cli | Web platform best practices |
| Lighthouse SEO | >= 95 (all pages) | @lhci/cli | Search visibility |
| LCP | < 1.5s (all pages) | Lighthouse CI | Core Web Vitals |
| CLS | < 0.05 (all pages) | Lighthouse CI | Core Web Vitals |
| TBT | < 200ms (all pages) | Lighthouse CI | Core Web Vitals |
| SEO validation | Pass | Playwright + API | Sitemap, robots, meta, JSON-LD |
| Staging smoke tests | Pass | Playwright | Deployed artifact verified |
| CSP unsafe-inline check | Not present | API test | XSS defense |
| Supabase RLS check | anon key returns 0 rows | API test | Data protection |

### FR-QA-043: Quality Exceptions Process

**Priority**: P1

**Acceptance Criteria**:

1. If a quality gate must be bypassed for an emergency deployment:
   - A GitHub Issue is created documenting the exception, the gate bypassed, and the remediation plan
   - The issue is labeled `quality-exception` and `security-debt` (if security-related)
   - A follow-up PR to fix the underlying issue is created within 48 hours
   - The exception is tracked in a `QUALITY_EXCEPTIONS.md` file in the repository root

2. No quality gate exception is allowed for:
   - Supabase RLS (data exposure)
   - CSP unsafe-inline in production (XSS vulnerability)
   - Accessibility violations that affect form submission (blocks K-12 procurement)

---

## 16. Monitoring and Alerting

### FR-QA-044: Production Error Tracking

**Priority**: P0

**Acceptance Criteria**:

1. A client-side error tracking service is integrated (Sentry recommended, or DigitalOcean monitoring):
   - Captures unhandled JavaScript exceptions
   - Captures unhandled promise rejections
   - Captures React Error Boundary activations
   - Captures Server Action failures
   - Includes source maps for readable stack traces
   - Respects privacy: no PII in error payloads (no form field values, no email addresses)

2. Server-side error tracking:
   - Next.js API route errors are captured
   - Supabase connection failures are captured
   - SendGrid delivery failures are captured
   - Rate limiting trigger events are captured (for abuse monitoring)

3. Alert thresholds:
   - Any P0 error (form submission failure, Supabase connection error): alert within 5 minutes
   - Error rate > 1% of page views: alert within 15 minutes
   - New error type not seen before: alert immediately

4. Error tracking dashboard is reviewed daily during the first 30 days post-launch, weekly thereafter.

### FR-QA-045: Core Web Vitals Regression Monitoring

**Priority**: P1

**Acceptance Criteria**:

1. Real User Monitoring (RUM) for CWV is implemented via one of:
   - Vercel Web Analytics (if Vercel is used for analytics only, even with DOKS hosting)
   - Google CrUX API monitoring
   - Custom `web-vitals` library reporting to Plausible or a custom endpoint

2. CWV regression alerts:
   - LCP > 2.0s (75th percentile over 24 hours): alert
   - CLS > 0.1 (75th percentile over 24 hours): alert
   - INP > 200ms (75th percentile over 24 hours): alert

3. Weekly CWV report generated and stored for trend analysis.

4. Any CWV regression triggers a Lighthouse CI run against production to confirm and diagnose.

### FR-QA-046: Uptime and Availability Monitoring

**Priority**: P0

**Acceptance Criteria**:

1. An uptime monitoring service checks the following endpoints every 60 seconds:
   - `https://safetrekr.com/` -- homepage (HTTP 200)
   - `https://safetrekr.com/api/health` -- health check endpoint (HTTP 200, JSON response with DB connectivity status)
   - `https://safetrekr.com/robots.txt` -- SEO critical (HTTP 200)

2. Alert channels:
   - Downtime > 1 minute: Slack notification
   - Downtime > 5 minutes: Email + SMS
   - Downtime > 15 minutes: PagerDuty (or equivalent) escalation

3. Target: 99.9% uptime (< 8.77 hours downtime per year).

4. SSL certificate expiry alert: 30 days, 14 days, and 7 days before expiry.

### FR-QA-047: Form Submission Monitoring

**Priority**: P0

**Acceptance Criteria**:

1. A daily automated check verifies form submission pipeline health:
   - Submit a synthetic demo request using a test email (`monitor@safetrekr.com`)
   - Verify Supabase record created
   - Verify SendGrid email dispatched
   - Clean up the synthetic record after verification

2. Alert if:
   - Zero form submissions in a 24-hour period on a weekday (possible pipeline failure)
   - Honeypot trigger rate exceeds 50% of total submissions (bot attack)
   - Turnstile rejection rate exceeds 20% (possible misconfiguration or Cloudflare issue)
   - SendGrid delivery rate drops below 95%

3. Dashboard metrics tracked:
   - Form submissions per day (by form type)
   - Conversion rate (form views to submissions)
   - Honeypot trigger count
   - Turnstile rejection count
   - SendGrid delivery/bounce/spam rates

---

## 17. Scenario-to-Test Mapping

This section maps every scenario from `analysis/scenarios.md` to its implementing test specification, test type, CI pipeline stage, and the functional requirement in this PRD that governs it.

### Critical Path Scenarios

| Scenario | Description | Test File | Type | Pipeline | FR |
|---|---|---|---|---|---|
| SCENARIO-001 | Homepage renders above-the-fold | `critical-path/homepage.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-002 | Primary navigation routes | `critical-path/navigation.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-003 | Demo request form E2E | `critical-path/demo-request.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-004 | Contact form E2E | `critical-path/contact-form.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-005 | Sample binder download | `critical-path/sample-binder.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-006 | Pricing page values | `critical-path/pricing.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-007 | Solution pages routing | `critical-path/solutions.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-008 | Blog ISR rendering | `critical-path/blog.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-009 | Mobile responsive layout | `critical-path/responsive.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-010 | SEO crawlability | `critical-path/seo-crawl.spec.ts` | E2E + API | PR | FR-QA-014 |
| SCENARIO-011 | Newsletter signup | `critical-path/newsletter.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-012 | Quote request form | `critical-path/quote-request.spec.ts` | E2E | PR | FR-QA-014 |

### Edge Case Scenarios

| Scenario | Description | Test File | Type | Pipeline | FR |
|---|---|---|---|---|---|
| SCENARIO-013 | Max field lengths | `edge-cases/max-lengths.spec.ts` | E2E + API | Merge | FR-QA-015 |
| SCENARIO-014 | Double-click prevention | `edge-cases/double-click.spec.ts` | E2E | Merge | FR-QA-015 |
| SCENARIO-015 | Browser back/forward | `edge-cases/browser-nav.spec.ts` | E2E | Merge | FR-QA-015 |
| SCENARIO-016 | MapLibre slow connection | `edge-cases/maplibre-slow.spec.ts` | E2E | Nightly | FR-QA-015 |
| SCENARIO-017 | JavaScript disabled | `edge-cases/no-javascript.spec.ts` | E2E | Nightly | FR-QA-015 |
| SCENARIO-018 | Unicode/emoji input | `edge-cases/unicode.spec.ts` | E2E + API | Merge | FR-QA-015 |
| SCENARIO-019 | ISR revalidation | `edge-cases/isr-revalidation.spec.ts` | API | Nightly | FR-QA-015 |

### Security Scenarios

| Scenario | Description | Test File | Type | Pipeline | FR |
|---|---|---|---|---|---|
| SCENARIO-020 | XSS via form fields | `security/xss-forms.spec.ts` | E2E + API | Merge | FR-QA-024 |
| SCENARIO-021 | CSRF protection | `security/csrf.spec.ts` | API | Merge | FR-QA-025 |
| SCENARIO-022 | Rate limiting | `security/rate-limiting.spec.ts` | API | Merge | FR-QA-026 |
| SCENARIO-023 | Turnstile bypass attempts | `security/turnstile-bypass.spec.ts` | API | Merge | FR-QA-027 |
| SCENARIO-024 | CSP enforcement | `security/csp.spec.ts` | API + E2E | Merge | FR-QA-024 |
| SCENARIO-025 | SQL injection | `security/sql-injection.spec.ts` | API | Merge | FR-QA-028 |
| SCENARIO-026 | Honeypot detection | `security/honeypot.spec.ts` | E2E + API | Merge | FR-QA-027 |
| SCENARIO-027 | Email header injection | `security/email-injection.spec.ts` | API | Merge | FR-QA-013 |
| SCENARIO-028 | Security headers | `security/headers.spec.ts` | API | Merge | FR-QA-029 |

### Performance Scenarios

| Scenario | Description | Test File | Type | Pipeline | FR |
|---|---|---|---|---|---|
| SCENARIO-029 | Lighthouse >= 95 | `lighthouserc.js` | Lighthouse CI | Merge | FR-QA-020 |
| SCENARIO-030 | LCP < 1.5s homepage | `performance/lcp.spec.ts` + Lighthouse | E2E + LHCI | Merge | FR-QA-020 |
| SCENARIO-031 | MapLibre lazy loading | `performance/maplibre-lazy.spec.ts` | E2E | Merge | FR-QA-021 |
| SCENARIO-032 | Image optimization | `performance/images.spec.ts` | E2E | Merge | FR-QA-022 |
| SCENARIO-033 | Bundle size budget | `bundlewatch.config.js` | bundlewatch | PR | FR-QA-021 |
| SCENARIO-034 | Reduced motion | `performance/reduced-motion.spec.ts` | E2E | Nightly | FR-QA-023 |

### Accessibility Scenarios

| Scenario | Description | Test File | Type | Pipeline | FR |
|---|---|---|---|---|---|
| SCENARIO-035 | Full keyboard navigation | `accessibility/keyboard-nav.spec.ts` | E2E | PR | FR-QA-017 |
| SCENARIO-036 | Screen reader compat | `accessibility/screen-reader.spec.ts` + manual | E2E + Manual | PR (auto) + Quarterly (manual) | FR-QA-018 |
| SCENARIO-037 | Color contrast | `accessibility/contrast.spec.ts` + unit | E2E + Unit | PR | FR-QA-019 |
| SCENARIO-038 | Focus management | `accessibility/focus-management.spec.ts` | E2E | PR | FR-QA-017 |
| SCENARIO-039 | Skip navigation | `accessibility/skip-nav.spec.ts` | E2E | PR | FR-QA-017 |
| SCENARIO-040 | ARIA landmarks/headings | `accessibility/landmarks.spec.ts` | E2E | PR | FR-QA-016 |

### Integration Scenarios

| Scenario | Description | Test File | Type | Pipeline | FR |
|---|---|---|---|---|---|
| SCENARIO-041 | Supabase form storage | `integration/supabase-forms.spec.ts` | E2E + API | Merge | FR-QA-012 |
| SCENARIO-042 | SendGrid delivery | `integration/sendgrid.spec.ts` | API | Merge | FR-QA-013 |
| SCENARIO-043 | Plausible event tracking | `integration/plausible.spec.ts` | E2E | Merge | FR-QA-014 |
| SCENARIO-044 | MapLibre tile loading | `integration/maplibre.spec.ts` | E2E | Merge | FR-QA-015 |
| SCENARIO-045 | OG image generation | `integration/og-image.spec.ts` | API | Nightly | FR-QA-032 |
| SCENARIO-046 | Supabase RLS | `integration/supabase-rls.spec.ts` | API | Merge | FR-QA-012 |

### Error Handling Scenarios

| Scenario | Description | Test File | Type | Pipeline | FR |
|---|---|---|---|---|---|
| SCENARIO-047 | Network failure form submit | `error-handling/network-failure.spec.ts` | E2E | Merge | FR-QA-015 |
| SCENARIO-048 | Supabase timeout | `error-handling/supabase-timeout.spec.ts` | E2E + API | Merge | FR-QA-011 |
| SCENARIO-049 | SendGrid failure | `error-handling/sendgrid-failure.spec.ts` | API | Merge | FR-QA-013 |
| SCENARIO-050 | 404 page | `error-handling/404.spec.ts` | E2E | Merge | FR-QA-014 |
| SCENARIO-051 | 500 error page | `error-handling/500.spec.ts` | E2E | Nightly | FR-QA-014 |
| SCENARIO-052 | Turnstile widget failure | `error-handling/turnstile-failure.spec.ts` | E2E | Merge | FR-QA-015 |

### Data Integrity Scenarios

| Scenario | Description | Test File | Type | Pipeline | FR |
|---|---|---|---|---|---|
| SCENARIO-053 | UTM parameter tracking | `data-integrity/utm-tracking.spec.ts` | E2E + API | Merge | FR-QA-014 |
| SCENARIO-054 | IP address hashing | `data-integrity/ip-hashing.spec.ts` | API + Unit | Merge | FR-QA-005 |
| SCENARIO-055 | JSONB XSS payloads | `data-integrity/jsonb-xss.spec.ts` | API | Merge | FR-QA-024 |
| SCENARIO-056 | Concurrent submissions | `data-integrity/concurrent.spec.ts` | API | Nightly | FR-QA-012 |
| SCENARIO-057 | JSON-LD validation | `data-integrity/json-ld.spec.ts` | E2E | Merge | FR-QA-032 |

---

## Appendix A: Critical Flags from Scenario Analysis

These issues were identified during scenario generation and require resolution before production launch:

1. **CSP `unsafe-inline` and `unsafe-eval`** (SCENARIO-024, FR-QA-024):
   The current `next.config.ts` CSP includes `'unsafe-inline'` and `'unsafe-eval'` in `script-src`. These significantly weaken XSS protection. Must be replaced with nonce-based CSP for production. The deploy gate in FR-QA-042 enforces this.

2. **Turnstile Firewall Blocking** (SCENARIO-052, FR-QA-015):
   K-12 school districts commonly use restrictive firewalls that may block `challenges.cloudflare.com`. A fallback mechanism is critical for the primary target segment. Recommend: honeypot + rate limiting as secondary protection when Turnstile is unavailable, with a clear message to the user.

3. **Muted Foreground Contrast** (SCENARIO-037, FR-QA-019):
   The original `#616567` muted-foreground color failed WCAG AA (4.0:1). It was darkened to `#555a5d` (~4.6:1) which barely passes. Recommend further darkening to `#4a4f52` (~5.0:1) for a comfortable margin. The contrast unit test in FR-QA-019 enforces the threshold.

4. **DOKS-Specific ISR Behavior** (SCENARIO-019):
   ISR on DigitalOcean DOKS does not use Vercel's CDN cache. The Next.js standalone output has its own filesystem-based ISR cache. Cache behavior must be validated against the Nginx reverse proxy configuration, not Vercel-specific headers like `X-Vercel-Cache`.

5. **Double Opt-In Email Flow** (SCENARIO-011):
   The newsletter double opt-in flow involves a confirmation token and email. This must be tested end-to-end including the confirmation link click. Consider using SendGrid's Inbound Parse or a test-specific confirmation endpoint for automated testing.

---

## Appendix B: Test Counts by Category

| Category | Unit | Component | Integration | E2E | API | Manual | Total |
|---|---|---|---|---|---|---|---|
| Utility functions | 70+ | - | - | - | - | - | 70+ |
| Zod schemas | 60+ | - | - | - | - | - | 60+ |
| Content validation | 30+ | - | - | - | - | - | 30+ |
| UI components | - | 50+ | - | - | - | - | 50+ |
| Form components | - | 30+ | - | - | - | - | 30+ |
| Navigation | - | 15+ | - | - | - | - | 15+ |
| Server Actions | - | - | 40+ | - | - | - | 40+ |
| Supabase | - | - | 20+ | - | 10+ | - | 30+ |
| SendGrid | - | - | 15+ | - | - | - | 15+ |
| Critical path E2E | - | - | - | 40+ | - | - | 40+ |
| Edge case E2E | - | - | - | 15+ | 5+ | - | 20+ |
| Security | - | - | - | 10+ | 20+ | - | 30+ |
| Accessibility | - | - | - | 20+ | - | 4 | 24+ |
| Performance | - | - | - | 8+ | - | - | 8+ |
| Visual regression | - | - | - | 36+ | - | - | 36+ |
| SEO | - | - | - | 15+ | 10+ | - | 25+ |
| **Total** | **160+** | **95+** | **75+** | **144+** | **45+** | **4** | **523+** |

---

## Appendix C: Dependencies and Versions

| Package | Purpose | Version Constraint |
|---|---|---|
| `vitest` | Unit + component + integration tests | ^3.x |
| `@testing-library/react` | Component rendering | ^16.x (React 19 compat) |
| `@testing-library/jest-dom` | DOM assertion matchers | ^6.x |
| `@testing-library/user-event` | User interaction simulation | ^14.x |
| `playwright` | E2E + visual regression + accessibility | ^1.49+ |
| `@axe-core/playwright` | Automated accessibility scanning | ^4.x |
| `@axe-core/react` | Component-level accessibility | ^4.x |
| `@lhci/cli` | Lighthouse CI performance gates | ^0.14+ |
| `bundlewatch` | Bundle size enforcement | ^0.4+ |
| `msw` | Mock Service Worker for API mocking | ^2.x |
| `@faker-js/faker` | Test data generation | ^9.x |

---

*Generated by Crash-to-Fix Oracle (CFO) v1.1 on 2026-03-24*
*Project: SafeTrekr Marketing Site*
*Input: ANALYSIS.md (8-agent synthesis) + scenarios.md (57 scenarios) + TECH-STACK.md*


---

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
