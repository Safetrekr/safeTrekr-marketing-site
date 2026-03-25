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
