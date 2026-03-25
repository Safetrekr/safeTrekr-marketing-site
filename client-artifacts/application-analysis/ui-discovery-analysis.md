# SafeTrekr UI/Visual Design Discovery Analysis

**Date:** 2026-03-17
**Analyst:** World-Class UI Designer Persona
**Scope:** Full-stack visual design audit across web (Next.js 15) and mobile (Expo/React Native) platforms
**Branch:** wireUp5

---

## Executive Summary

SafeTrekr has built a substantial multi-portal web application and companion mobile app with a fundamentally sound design system foundation. The CSS variable token architecture, shadcn/ui primitive library (47 components), and 30+ domain-specific shared components demonstrate mature component-first thinking. The three-portal web architecture (Client, Analyst, HQ Console) maintains visual coherence through a shared `AppShell` layout pattern, consistent `KpiCard` dashboards, and a well-themed AG-Grid integration.

However, the analysis reveals five structural design concerns that will compound as the product scales:

1. **Token Divergence** -- The web and mobile platforms define color tokens independently with no shared source of truth or build pipeline, causing drift and maintenance burden.
2. **Accessibility Gaps** -- No skip-link infrastructure, no documented focus management patterns, and the 18-section analyst review workspace uses fixed-width columns that collapse on smaller viewports.
3. **Mobile Styling Inconsistency** -- The React Native codebase mixes three styling approaches (NativeWind `className`, Gluestack themed components, and raw inline `style` objects with hardcoded hex values), undermining the token system.
4. **Missing Typography and Spacing Scales** -- The design system defines color tokens comprehensively but has no formalized type scale, spacing scale, or z-index hierarchy beyond Tailwind defaults.
5. **Motion Token Fragmentation** -- CSS-based animations (`@keyframes` in globals.css) and JS-based motion (Anime.js `MOTION` tokens) coexist without a unified registry, making animation behavior hard to audit or override.

The product's visual design quality is strong for an early-growth B2B SaaS -- clean, professional, data-dense where needed. The foundation is solid enough that the gaps identified here represent refinement work, not rearchitecture.

---

## Key Findings

1. **Token Architecture is Solid but Web-Only.** The CSS variable system in `globals.css` covers 60+ tokens across 9 categories (core, brand, semantic, extended, form, chart, sidebar, typography, shadows) with complete light/dark mode support. The `@theme inline` Tailwind v4 mapping is clean. But the mobile `tailwind.config.js` duplicates these values as static hex strings with no sync mechanism.

2. **Component Library Coverage is Excellent.** 47 shadcn/ui primitives, 30+ SafeTrekr shared components, a wrapped AG-Grid with custom cell renderers, and a dedicated `/cheatsheet` playground. This is above-average maturity for a product at this stage.

3. **The Custom Drawer System is a Design System Highlight.** The Drawer component includes glow effects per state (`success`, `warning`, `danger`, `info`, `neutral`), enforced `DrawerBody`/`DrawerFooter` patterns for consistent form layouts, and is well-documented in `CLAUDE.md` with reference examples.

4. **The Analyst Review Workspace is the Most Complex UI Surface.** An 18-section, 3-column layout with section navigation, content area, and reviewer checklist panel. Each section has its own KPI summary, data views, and associated checklist. The numbered color-coded section indicators are visually effective but the layout is not responsive.

5. **The Trip Creation Wizard is Feature-Rich but Visually Complex.** 50+ component files covering a 10-step form with CSV imports, location autocomplete, map previews, day-by-day builders, and transportation assignment. The `WizardStepProgress` uses a blue-to-green gradient that deviates from the token system (hardcoded hex array).

6. **Empty States and Loading States are Implemented but Not Standardized.** `EmptyState`, `LoadingState`, and `ErrorState` components exist but usage is inconsistent -- some pages use them, others use ad-hoc implementations. The mobile app frequently uses bare `ActivityIndicator` with inline text.

7. **Dark Mode is Fully Supported on Web, Partially on Mobile.** Web has complete dark theme tokens and AG-Grid dark overrides. Mobile defines `dark.*` colors in the Tailwind config but many components use hardcoded light-mode colors (e.g., `#16a34a`, `#f0fdf4` in `TravelerTodayView`).

8. **AG-Grid Theming is Production-Quality.** The custom Quartz theme override eliminates default borders, adds branded row-hover (green outline), centers cell content, and handles dark mode. This is one of the more polished integrations.

9. **Toast System Uses Thoughtful Glow Effects.** Sonner toasts are enhanced with radial-gradient glows per type using brand-specific colors. This is a differentiating micro-interaction detail.

10. **The Sidebar Navigation Supports Groups, Badges, and Disabled States.** The sidebar handles collapsible state, mobile sheet variant, nav groups with labels, coming-soon disabled items, and badge counts. This is well-engineered for a multi-portal product.

11. **No Formal Breakpoint System Documented.** While Tailwind responsive prefixes are used (`sm:`, `lg:`, `xl:`), there is no `breakpoints.json` or documented breakpoint strategy. The analyst review layout uses hardcoded `w-56` and `w-80` fixed widths.

12. **Icon Usage is Split Between Platforms.** Web uses Lucide icons directly with `strokeWidth={1.5}`. Mobile uses a custom `Icon` component that maps Material Symbols names to Lucide equivalents. This creates a translation layer that adds cognitive overhead.

---

## Feature Inventory

### Web Application -- Client Portal

| Feature | Description | User Value | Technical Implications | Priority |
|---------|-------------|------------|----------------------|----------|
| **Client Dashboard** | KPI grid (6 cards) + recent activity list | Org admins see trip health at a glance | `KpiCard` reuse, TanStack Query | Critical |
| **Trip List** | AG-Grid table with status badges, filters | Find and manage active trips | `SafetrekrGrid`, `StatusCell` | Critical |
| **Trip Creation Wizard** | 10-step form with CSV import, maps, day-builder | Create complex multi-day international trips | 50+ components, React Hook Form, Zod | Critical |
| **Trip Detail** | Tabbed view (15+ sections) with dedicated sidebar | Manage all aspects of an active trip | `TripDetailShell`, section-specific components | Critical |
| **Participant Management** | Role-based list with guardian assignment | Track travelers, chaperones, guardians | Filter tabs, avatar badges, role selects | High |
| **Background Checks** | Status tracking for adult participants | Ensure compliance before departure | Status badges, integration state | High |
| **Billing/Payments** | Stripe integration, order management | Handle trip payments and credits | Payment status badges, transaction views | High |
| **Intel Alerts** | Severity-ranked alerts with routing | Monitor destination safety | KPI cards per severity, filter tabs, grid/list toggle | High |
| **Trip Packets** | PDF generation and distribution | Share trip details with participants | Version tracking, PDF preview | Medium |
| **Team Management** | Org staff directory | Manage organization members | Data grid, role badges | Medium |
| **Settings** | Org profile, notifications, preferences | Configure organization | Form layouts, Switch components | Low |

### Web Application -- Analyst Portal

| Feature | Description | User Value | Technical Implications | Priority |
|---------|-------------|------------|----------------------|----------|
| **Analyst Dashboard** | 6 KPI cards + priority queue + risk brief + activity feed | Prioritize review workload | Complex grid layout, real-time data | Critical |
| **Review Queue** | Prioritized trip list with assignment | Pick next trip to review | AG-Grid, assignment dialog | Critical |
| **Trip Review Workspace** | 18-section 3-column layout | Conduct comprehensive safety review | `TripReviewLayout`, section navigation, reviewer panel | Critical |
| **Reviewer Checklist** | Required/Optional/Comments tabs per section | Track completion of review items | Checkbox state management, progress bar | Critical |
| **Section: Overview** | Trip summary KPI cards + info display | Quick trip orientation | KPI cards, info grid | High |
| **Section: Participants** | Roster with role badges, contact info | Verify traveler compliance | Filter tabs, data table | High |
| **Section: Air Travel** | Flight details and scheduling | Verify travel logistics | Flight cards, timeline | High |
| **Section: Lodging** | Accommodation details with map | Verify lodging safety | Map integration, POI checklist | High |
| **Section: Venues** | Activity locations with safety check | Verify venue safety | Map markers, checklist cards | High |
| **Section: Safety** | Rally points, safe houses, map layers | Assess emergency preparedness | MapLibre GL, layer toggles, relocation markers | High |
| **Section: Intel Alerts** | Trip-specific intelligence | Route alerts to stakeholders | Severity badges, create/route workflow | High |
| **Section: Issues** | Review issues and blockers | Track and resolve problems | Issue cards, assignment | Medium |
| **Section: Checklists** | Topic-based compliance checklists | Verify organizational policies | Checklist progress, topic categories | Medium |
| **Section: Packet Builder** | Trip packet assembly | Prepare participant materials | PDF builder, version management | Medium |
| **Section: Comms Log** | Communication history | Audit trail | Timeline view | Medium |
| **Section: Approval** | Final review approval flow | Complete or flag trip review | Approval workflow, status transitions | High |
| **Calibration** | Review consistency tools | Maintain analyst quality | Coming soon | Low |

### Web Application -- HQ Console

| Feature | Description | User Value | Technical Implications | Priority |
|---------|-------------|------------|----------------------|----------|
| **HQ Overview** | Platform KPI cards + system health panel | Monitor platform status | 5 KPI cards, health check rows | Critical |
| **Organization Management** | CRUD for tenant orgs | Manage customers | AG-Grid, suspend/reactivate, settings JSONB | Critical |
| **Trip Management** | Cross-org trip monitoring | Oversee all platform trips | AG-Grid, bulk operations | High |
| **User Management** | Cross-org user admin | Manage all platform users | Data grid, role management | High |
| **Queue Management** | Analyst queue assignment | Balance review workload | Assignment dialog, priority management | High |
| **Finance** | Orders, wallets, balance adjustment | Revenue management | Transaction tables, adjustment drawers | High |
| **Checklists** | Topic/question CRUD | Define review standards | Category management, question builder | Medium |
| **Policies** | JSON policy editor | Configure safety rules | Monaco/JSON editor | Medium |
| **Feature Flags** | Feature toggle management | Control rollouts | Toggle switches, targeting rules | Medium |
| **Guardian Governance** | Minor protection oversight | Ensure guardian compliance | Status tracking, bypass modals | Medium |

### Mobile Application -- Traveler/Chaperone/Guardian

| Feature | Description | User Value | Technical Implications | Priority |
|---------|-------------|------------|----------------------|----------|
| **Today View** | Role-specific daily summary (weather, schedule, alerts, map) | Know what's happening now | Location-aware, real-time data | Critical |
| **Schedule** | Day-by-day event timeline | Plan daily activities | Timeline UI, time formatting | Critical |
| **Trip Packet** | Read-only trip information hub | Access travel details offline | Section-based navigation, offline cache | High |
| **Safety** | Rally points, emergency info, direct group messaging | Handle emergencies | Map view, one-tap actions, SMS broadcast | Critical |
| **Alerts** | Push notification display with acknowledgment | Stay informed of safety changes | Push infrastructure, badge counts | Critical |
| **Map** | Live group location tracking (chaperone) | Monitor traveler locations | react-native-maps, geofencing, background task | High |
| **Check-ins** | Muster/attendance verification | Confirm traveler safety | QR/location check-in | High |
| **Documents** | Passport upload, consent tracking | Complete pre-trip requirements | Camera, OCR, document upload | Medium |
| **Settings** | Profile, notifications, location, privacy | Manage personal preferences | Settings screens, permission management | Medium |
| **Onboarding** | Invite consumption, account setup | Join a trip | Deep link handling, secure store | High |

---

## Opportunities and Gaps

### 1. Design Token Synchronization (Critical Gap)

**Problem:** Web tokens live in `globals.css` as CSS variables. Mobile tokens live in `tailwind.config.js` as static hex values. There is no shared source of truth. The mobile app also uses hardcoded hex values directly in component code (at least 15+ instances of `#16a34a`, `#ef4444`, `#4ca46e` in `TravelerTodayView` alone).

**Impact:** Token drift between platforms, dark mode regression on mobile, doubled maintenance effort for any brand change.

**Opportunity:** Introduce a `design-tokens.json` (or Style Dictionary format) as the single source of truth. Generate `globals.css`, `tailwind.config.js`, and a React Native theme object from it. This would also enable future Android/iOS native token consumption.

### 2. Typography Scale Definition (High Gap)

**Problem:** The design system defines `--font-sans`, `--font-serif`, `--font-mono` but has no formalized type scale. Components use ad-hoc font sizes (`text-sm`, `text-lg`, `text-3xl`, `text-[10px]`) without a documented hierarchy. The wizard step progress uses `text-[10px]` which is below accessibility minimums.

**Impact:** Inconsistent text sizing across portals, accessibility risk with small text, harder to maintain typographic rhythm.

**Opportunity:** Define a type scale token set (e.g., `--text-xs` through `--text-4xl` with corresponding line-heights and letter-spacing) and audit all text usage against it. Minimum accessible body text should be 14px (already the AG-Grid default).

### 3. Responsive Analyst Review Layout (High Gap)

**Problem:** The `TripReviewLayout` uses fixed widths (`w-56` left nav, `w-80` right panel). On viewports below ~1200px, the content area is severely compressed. There is no tablet or mobile adaptation.

**Impact:** Analysts using smaller laptops or external monitors at lower resolutions get a degraded experience. Mobile analyst access is impossible.

**Opportunity:** Implement a responsive strategy: collapsible left nav (already exists in AppShell pattern), a bottom-drawer or overlay for the reviewer panel on medium screens, and a stacked layout on small screens. Alternatively, define a minimum supported viewport width and add a viewport-too-small warning.

### 4. Accessibility Infrastructure (High Gap)

**Problem:** No `SkipLink` component for keyboard users to bypass navigation. No `VisuallyHidden` utility for screen-reader-only text. The sidebar does include `sr-only` on the mobile Sheet title (good), but there is no systematic focus management for modals/drawers beyond Radix defaults. The `WizardStepProgress` buttons have `aria-current` and `aria-disabled` (good) but step circles use color alone to indicate state.

**Impact:** WCAG 2.2 AA compliance gaps, particularly for keyboard navigation and color-blind users.

**Opportunity:** Add a `SkipLink` to the root layout, create a `VisuallyHidden` utility component, audit all interactive surfaces for focus order, and ensure all color-coded indicators have a secondary signal (icon, pattern, or text).

### 5. Mobile Styling Consistency (High Gap)

**Problem:** The mobile app uses three different styling approaches within the same component files:
  - NativeWind `className` (Tailwind syntax): `<VStack className="p-4 pt-8 gap-8">`
  - Gluestack themed components: `<Text style={{ ... }}>`
  - Raw inline `style` objects: `<View style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', ... }}>`

In `TravelerTodayView` alone, there are 30+ inline style objects with hardcoded values.

**Impact:** Themes cannot propagate, dark mode breaks in hardcoded sections, maintenance requires updating values in three different formats.

**Opportunity:** Establish a mobile styling standard: NativeWind `className` for layout/spacing, theme-aware color tokens via a `useThemeColors()` hook (already exists but underused), and ban raw hex values in component code.

### 6. Empty/Loading/Error State Standardization (Medium Gap)

**Problem:** Three shared components exist (`EmptyState`, `LoadingState`, `ErrorState`) but adoption is inconsistent. Some pages render custom loading spinners or bare text. The mobile app uses raw `ActivityIndicator` with inline-styled text instead of a shared pattern.

**Opportunity:** Create a style guide entry for state components, add them to the cheatsheet playground with all variants, and audit every data-fetching page for consistent usage.

### 7. Form Validation Visual Pattern (Medium Gap)

**Problem:** While React Hook Form + Zod are used for validation logic, there is no standardized error display pattern. The phone input has explicit `.phone-input-error` CSS, but other form fields rely on default browser validation or ad-hoc error text.

**Opportunity:** Define a `FormField` wrapper that standardizes error message positioning, error border color, helper text, and required indicator across all form inputs.

### 8. Color Contrast Audit (Medium Gap)

**Problem:** Several token combinations may have contrast issues:
  - `--muted-foreground` (#616567) on `--background` (#e7ecee) = needs verification
  - `--warning` (#f59e0b) on white = likely below 4.5:1
  - `text-[10px]` in wizard steps is functionally unreadable at arm's length
  - Dark mode `--muted-foreground` (#929899) on `--background` (#061a23) = needs verification

**Opportunity:** Run an automated contrast audit on all token foreground/background pairs and fix any below 4.5:1 for normal text or 3:1 for large text.

### 9. Icon System Unification (Low-Medium Gap)

**Problem:** Web uses Lucide icons directly (50+ imported across components). Mobile uses a custom `Icon` component that maps Material Symbols names to Lucide equivalents. This creates a translation layer and naming inconsistency.

**Opportunity:** Standardize on Lucide icon names across both platforms. The mobile Icon component can keep its mapping layer but documentation should reference Lucide names as canonical.

### 10. Animation/Transition Audit (Low-Medium Gap)

**Problem:** Two separate motion systems exist:
  - CSS: 5 `@keyframes` animations in globals.css (pulse-dot, spin-slow, fade-in, breathe)
  - JS: Anime.js with `MOTION` token object (duration, easing, distance, scale, stagger)

The CSS animations don't reference the JS motion tokens, and vice versa. The toast glow uses CSS transitions while StatusBadge uses Anime.js.

**Opportunity:** Create a unified motion token registry. CSS animations should reference CSS custom properties for durations/easings. JS animations already have this via `MOTION` tokens. Document when to use CSS vs JS animation.

---

## Recommendations

### 1. Establish a Single-Source Token Pipeline

**Priority: Critical | Effort: Medium | Impact: High**

Create a `tokens/` directory at the monorepo root with a JSON or YAML definition file. Use Style Dictionary or a lightweight build script to generate:
- `globals.css` CSS variables for the web app
- `tailwind.config.js` color/spacing overrides for the mobile app
- A TypeScript `theme.ts` constants file for programmatic access

This eliminates the token drift between web and mobile, makes brand updates a single-file change, and creates the foundation for future platform extensions. Start with color tokens (highest drift risk), then extend to typography and spacing.

### 2. Formalize Typography and Spacing Scales

**Priority: High | Effort: Low | Impact: Medium**

Add to `globals.css`:
```css
:root {
  /* Type scale (1.125 ratio) */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */

  /* Spacing scale (8pt grid) */
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
}
```

Audit and replace all `text-[10px]` and similar arbitrary values. Enforce 14px minimum for body text per WCAG.

### 3. Make the Analyst Review Layout Responsive

**Priority: High | Effort: Medium | Impact: High**

The 3-column `TripReviewLayout` is the most business-critical UI surface (analysts spend hours here). Implement:
- **1200px+**: Current 3-column layout (section nav 224px | content flex | reviewer panel 320px)
- **768px-1199px**: Collapse section nav to icon-only rail (48px). Reviewer panel becomes a slide-over triggered by a floating button.
- **Below 768px**: Full-stack mobile layout. Section nav as horizontal scrollable tabs or bottom sheet. Reviewer panel as full-screen overlay.

This also applies to `TripDetailShell` in the client portal which uses a similar pattern.

### 4. Add Core Accessibility Components

**Priority: High | Effort: Low | Impact: High**

Implement three components immediately:
- **`SkipLink`**: Anchored before the sidebar in the root layout, targeting `#main-content`. Visible on focus only.
- **`VisuallyHidden`**: Utility for screen-reader-only text (e.g., "opens in new tab", "required field").
- **`FocusTrap`**: Verify Radix Dialog/Sheet components properly trap focus (they should by default), and add explicit focus-return logic for custom modals.

Add `role="main"` and `id="main-content"` to the `<main>` tag in `AppShell`.

### 5. Standardize Mobile Styling to Theme Tokens

**Priority: High | Effort: Medium | Impact: High**

Conduct a mobile codebase sweep to:
1. Replace all hardcoded hex values (`#16a34a`, `#ef4444`, `#f0fdf4`, etc.) with `colors.xxx` from `useThemeColors()`
2. Convert inline `style` objects for colors/backgrounds to NativeWind `className` or theme hook values
3. Create a `MobileCard`, `MobileSection`, `MobileEmptyState` shared component set that mirrors the web equivalents
4. Enforce a linting rule or code review check: no raw hex values in component files

---

## Dependencies and Constraints

### Design System Constraints

| Constraint | Description | Mitigation |
|------------|-------------|------------|
| Tailwind v4 CSS-first approach | Cannot use `tailwind.config.js` for token definition on web (v4 uses `@theme inline`) | Tokens must be CSS variables first, mapped in globals.css |
| NativeWind on Tailwind v3 | Mobile still uses Tailwind v3 config syntax | Build pipeline must output v3-compatible config for mobile |
| shadcn/ui dependency | Components are copy-pasted, not npm-installed | Token changes must be reflected in component files, not just config |
| AG-Grid commercial license | Grid theming is CSS-variable based | Token changes propagate automatically via CSS vars |
| Radix primitives | Accessibility behaviors come from Radix | Custom focus management should extend, not replace, Radix defaults |

### Cross-Platform Consistency Requirements

| Requirement | Web Status | Mobile Status | Gap Level |
|-------------|-----------|---------------|-----------|
| Brand colors | Tokenized | Hardcoded hex | Critical |
| Dark mode | Complete | Partial | High |
| Typography scale | Tailwind defaults | Tailwind defaults | Medium |
| Spacing system | 8pt via Tailwind | Inconsistent | Medium |
| Loading states | Shared component | Ad-hoc | Medium |
| Error states | Shared component | Ad-hoc | Medium |
| Empty states | Shared component | Inconsistent | Medium |
| Focus indicators | Radix defaults | Platform defaults | Low |
| Motion/animation | Anime.js + CSS | Platform defaults | Low |

### Accessibility Requirements (WCAG 2.2 AA Target)

| Criterion | Current Status | Action Needed |
|-----------|---------------|---------------|
| 1.1.1 Non-text Content | Partial -- icons use `aria-hidden` | Audit all decorative vs informative images |
| 1.3.1 Info and Relationships | Good -- semantic HTML in Panel, PageHeader | Verify heading hierarchy across all pages |
| 1.4.3 Contrast (Minimum) | Unknown | Run automated contrast audit on all token pairs |
| 1.4.11 Non-text Contrast | Unknown | Verify focus indicators, form borders meet 3:1 |
| 2.1.1 Keyboard | Partial -- no skip links | Add SkipLink, audit tab order |
| 2.4.3 Focus Order | Radix handles modals | Verify custom wizard step focus management |
| 2.4.7 Focus Visible | Browser defaults + Radix | Add explicit focus-visible styles to custom interactive elements |
| 4.1.2 Name, Role, Value | Good -- ARIA on wizard steps | Audit all custom components for ARIA completeness |

### Performance Budget

| Metric | Target | Current Status |
|--------|--------|---------------|
| CSS bundle | <=150 KB | Unknown -- needs audit |
| JS bundle (main) | <=200 KB | Unknown -- needs audit |
| First Contentful Paint (3G) | <=2s | Unknown -- needs Lighthouse CI |
| AG-Grid initial render | <=500ms | Likely met (lazy rendering) |
| Mobile app cold start | <=3s | Unknown -- needs profiling |

---

## Component Health Matrix

| Category | Count | Documented | Playground Coverage | Token-Driven | Notes |
|----------|-------|------------|-------------------|-------------|-------|
| shadcn/ui primitives | 47 | Via shadcn docs | Yes (cheatsheet) | Yes | Mature, well-maintained |
| Safetrekr shared | 31 | Partial (barrel export) | Partial | Yes | Need README per component |
| AG-Grid cell renderers | 4 | Barrel export only | Partial | Yes | Could use more variants |
| Layout components | 5 | Inline comments | No | Yes | AppShell, Sidebar, Topbar, MobileHeader |
| Client module | ~80 files | Minimal | No | Mostly | Trip wizard is largest surface |
| Analyst module | ~60 files | Minimal | No | Mostly | Review workspace is critical path |
| HQ module | ~30 files | Minimal | No | Mostly | Straightforward CRUD patterns |
| Mobile components | ~50 files | CLAUDE.md | No | Partially | Mixed styling approaches |

---

## Appendix: File Paths Referenced

- Design tokens: `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/globals.css`
- Motion tokens: `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/lib/motion/tokens.ts`
- Shared components index: `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/components/shared/index.ts`
- Datagrid components: `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/shared/components/datagrid/`
- Layout shell: `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/shared/components/layout/app-shell.tsx`
- Analyst review layout: `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/analyst/components/trip-review/trip-review-layout.tsx`
- Trip creation wizard: `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/client/components/trip-create/`
- Mobile tailwind config: `/Users/justintabb/projects/safetrekr/safetrekr-traveler-native/tailwind.config.js`
- Mobile today view: `/Users/justintabb/projects/safetrekr/safetrekr-traveler-native/components/pages/today/TravelerTodayView.tsx`
- Component playground: `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/(playground)/cheatsheet/page.tsx`
- Drawer component: `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/components/ui/drawer.tsx`
