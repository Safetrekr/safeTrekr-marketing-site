---

# SafeTrekr UI Design System Discovery Report

## Executive Assessment

The SafeTrekr frontend is a **well-architected mid-maturity design system** powering 673 TSX files across three portals. The foundation is strong: CSS variable tokens, comprehensive shadcn/ui coverage (48 primitives), thoughtful shared components, and a dedicated Anime.js motion system. It is significantly above average for a startup-stage product. However, there are measurable gaps in token discipline, form architecture, responsive coverage, and animation adoption that, if left unaddressed, will compound into design debt as the product scales.

**Overall Score: 7.2 / 10**

---

## 1. Design System Consistency and Completeness

**Score: 7 / 10**

### What is working well

The token architecture in `globals.css` is the strongest foundation here. It defines 60+ CSS variables across a proper semantic hierarchy: core colors, brand colors, utility colors, semantic accents, extended palette, form elements, chart palette, sidebar, typography, spacing, and shadows. The Tailwind v4 `@theme inline` bridge cleanly maps every token to a utility class. Both light and dark themes are fully specified, and the brand green (`#4ba467`) carries consistently across themes.

The barrel export at `/src/components/shared/index.ts` provides clean imports for 30+ shared components, and the `/cheatsheet` playground route ensures discoverability.

### What needs attention

**No typography scale tokens.** Font sizes, line heights, and letter spacing are applied ad hoc through Tailwind classes (`text-sm`, `text-2xl`, `text-3xl`) with no centralized scale. Heading levels are styled inline everywhere rather than through a reusable heading component or token set.

**No spacing scale tokens.** The `--radius` variable exists (0.625rem) but there is no spacing token set. The 8-point grid is not codified; spacing relies entirely on Tailwind's default scale.

**No z-index, transition, or breakpoint tokens in CSS.** Animation durations exist only in the JavaScript `MOTION` object, creating a split between CSS and JS timing systems.

**AG-Grid dark mode uses hardcoded hex values** at `globals.css:589-615` instead of `var(--*)` references. This means any future theme changes would require manual synchronization.

**Light mode: `--muted` equals `--background` (`#e7ecee`).** Muted surfaces do not visually separate from the page background in light theme, reducing depth perception.

**Key files:**
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/globals.css`
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/components/shared/index.ts`

---

## 2. Component Library Quality

**Score: 8 / 10**

### What is working well

This is the strongest area of the system. Highlights:

- **Drawer component** (`/src/components/ui/drawer.tsx`, 355 LOC) is a masterclass in composable UI: DrawerContent, DrawerHeader (with glow effects keyed to state), DrawerBody (custom scrollbar), DrawerFooter (sticky), DrawerStatus, DrawerSectionTitle, DrawerField. The glow system uses CSS `radial-gradient` with RGB values mapped to semantic states.

- **StatusBadge** uses Anime.js for three animation modes: a mechanical `steps(4)` pulse for indexing, a `outBack` easing success pop for completion, and a shake for errors. It respects `prefers-reduced-motion` through the custom `useReducedMotion` hook.

- **PersonaChip** maps all 10 SafeTrekr roles to icons, labels, and CVA color variants, with full override capability for custom use.

- **KpiCard** includes an inline SVG sparkline renderer that dynamically colors based on trend direction.

- **CapacityBar** implements a segmented visualization with color progression (success to warning to orange to danger) and a blur-based glow effect behind filled segments.

- **SafetrekrGrid** wraps AG-Grid with sensible defaults (autoHeight, 48px rows, green outline hover, button click passthrough).

### What needs attention

**Pattern inconsistency between Card and Button:** Card still uses `React.forwardRef` (legacy React pattern) while Button uses the modern function component pattern. This should be unified.

**Badge lacks semantic variants.** The base Badge has `default`, `secondary`, `destructive`, `outline` but is missing `warning`, `success`, `info`, `danger` variants that match the token system. As a result, components like IntelAlertCard and ThreatLevelBadge build custom badge-like elements with inline classes.

**No reusable Stepper/Wizard component** despite the existence of OnboardingProgress (a simple step indicator) and the 14,867 LOC trip-create wizard. This pattern should be extracted.

**Key files:**
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/components/ui/drawer.tsx`
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/components/shared/status-badge.tsx`
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/components/shared/persona-chip.tsx`
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/components/shared/kpi-card.tsx`
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/components/shared/capacity-bar.tsx`

---

## 3. Visual Hierarchy and Typography

**Score: 6 / 10**

### What is working well

A three-tier hierarchy is evident across pages: PageHeader (`text-2xl font-semibold tracking-tight`) sets the h1, Panel (`text-lg font-semibold`) frames sections, and body content uses `text-sm` with `text-muted-foreground` for secondary text. DrawerTitle has a distinctive `text-[1.75rem] leading-[1.2] font-medium` treatment that gives drawers their own visual identity.

The `truncate` utility is applied consistently on user names and titles to prevent overflow.

### What needs attention

**No heading component or scale.** Every heading is styled with inline Tailwind classes. There is no `<Heading level={2}>` component or defined typographic scale. This creates the following inconsistency: some places use `text-lg font-semibold`, others `text-base font-semibold`, others `text-sm font-semibold`.

**KPI values (text-3xl font-bold) visually dominate page titles (text-2xl font-semibold).** The number `42` in a KPI card commands more visual weight than the page title "Dashboard". This inversion undermines the page-level hierarchy.

**CardTitle sets no font-size**, only `font-semibold tracking-tight`. It inherits from its parent, which means the same Card component renders at different type sizes depending on context.

**OnboardingProgress uses string template concatenation** for className generation instead of the `cn()` utility, violating the pattern used everywhere else.

---

## 4. Color System and Dark Mode

**Score: 7.5 / 10**

### What is working well

The dual-theme system is thorough. Key design decisions are sound: primary green stays constant between themes for brand recognition; dark mode backgrounds use two elevation layers (`#061a23` base, `#0a2733` card/header) creating appropriate depth; semantic danger/warning colors shift from subdued light-mode hues to vivid dark-mode hues for readability against dark backgrounds; autofill styling prevents the browser's white flash in dark mode (a detail many production apps miss).

Toast glow effects are theme-aware and type-differentiated (success green, error red, warning orange, info blue, loading gray).

### What needs attention

**139 occurrences of raw Tailwind color classes across 30 files.** These bypass the design token system entirely. While the ThreatLevelBadge documents this intentionally (with WCAG contrast ratio justifications), most other uses are not documented. The IntelAlertCard severity system (`bg-red-500/5`, `bg-orange-500/10`, etc.) creates a parallel color language outside the token system.

**Light mode `--info` (#2a4a59) vs dark mode `--info` (#3b82f6):** These are visually different colors, not theme-adapted versions of the same hue. Light mode info is a dark teal; dark mode info is a bright blue. Users switching themes will see a jarring identity shift for info-styled elements.

**AG-Grid dark mode** at `globals.css:589-615` hardcodes hex values (`#061a23`, `#0a2733`, `#3d6a8a`, `#929899`, `#123646`) instead of referencing CSS variables. A theme update would require changing these independently.

**Key files:**
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/globals.css` (lines 589-628)
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/components/shared/threat-level-badge.tsx`
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/analyst/components/intel-alerts/intel-alert-card.tsx`

---

## 5. Responsive Design

**Score: 5.5 / 10**

### What is working well

The shell architecture handles the desktop-to-mobile transition correctly: the sidebar collapses behind a Sheet on screens below `md`, a MobileHeader with hamburger appears, and the main content fills the viewport. The sidebar collapse transition (280px to 64px) is smooth at 300ms. KPI grids use proper responsive breakpoints (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`), and the codebase has 166 responsive grid breakpoint declarations overall.

### What needs attention

**Only 3 files use responsive visibility utilities** (`md:hidden`, `hidden lg:block`, etc.), which strongly suggests most page content has not been designed for sub-desktop viewports.

**TripReviewShell right panel (ReviewerPanel) uses `hidden lg:block`** with no fallback. Below the `lg` breakpoint, the reviewer checklist simply disappears. No mobile alternative (bottom sheet, collapsible, or tab) is provided. This is the analyst's primary workflow tool.

**Main content uses `p-6` with no responsive reduction.** On a 375px mobile viewport, 24px padding on both sides leaves only 327px of usable width, which is tight for data tables, forms, and cards.

**No max-width constraint on the main content area.** On an ultrawide display, content stretches edge-to-edge, degrading readability.

**Drawer width is fixed at 512px** with `maxWidth: 100%`. On mobile, it fills the screen correctly, but there is no intermediate breakpoint adjustment for tablets.

**SafetyMap iframe is fixed at `h-[300px]`** regardless of available viewport height.

---

## 6. Map UI and Data Visualization

**Score: 6.5 / 10**

### What is working well

The `safety-locations-map.tsx` (1,165 LOC) is a sophisticated MapLibre GL implementation with layer toggles, multiple marker types (lodging, venues, rally points, safe houses, embassies, relocation points), city-based filtering, a tabbed list panel, and pick-mode for placing new safety locations. It uses `maplibre-gl` directly with proper CSS import.

The `venue-map.tsx` and `lodging-map.tsx` follow the same MapLibre GL pattern for consistency within the analyst module.

AG-Grid is well-themed with custom cell renderers and consistent styling.

### What needs attention

**Two competing map implementations in the same module.** `safety-map.tsx` uses an OpenStreetMap iframe embed (static, no interaction), while `safety-locations-map.tsx` uses full MapLibre GL. Both exist in the analyst/safety feature area. The iframe map is significantly lower quality and should be deprecated.

**No shared map configuration.** Each map instance manages its own tile source, style, and initialization. A shared `useMaplibre` hook exists in `shared/hooks/` but the map components don't appear to use it consistently.

**Chart tokens exist but no chart components.** The `--chart-1` through `--chart-5` palette is defined in CSS but there are no Recharts, Nivo, or other chart library components using them. The only data visualization is KpiCard sparklines and CapacityBar segments.

**Key files:**
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/analyst/components/safety/safety-locations-map.tsx`
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/analyst/components/safety/safety-map.tsx` (iframe version -- candidate for removal)

---

## 7. Form Design Patterns

**Score: 4.5 / 10**

This is the weakest area of the design system.

### What is working well

The primitives exist: `FormField` shared component handles label, error message with icon, description text, and required indicator. Input has an `error` variant with `aria-invalid`. PhoneInput has custom CSS for focus/error states. DatePicker, DateRangePicker, and TimePicker are all available. `form.tsx` (shadcn's React Hook Form wrapper) is installed.

### What needs attention

**React Hook Form + Zod is declared in the tech stack but essentially unused.** Only `form.tsx` references it. Of the actual form implementations examined:

- `create-alert-drawer.tsx` uses 10 individual `useState` declarations for form fields
- `login/page.tsx` uses raw `useState` for email, password, showPassword, isLoading, error
- The 26 files in `trip-create/` all manage form state with `useState`
- The `FormField` shared component is rarely used; most forms inline their own `Label + Input + error span` pattern

This means there is no centralized validation, no form-level error handling, no dirty tracking, no field-level touched state, and no type-safe schema validation across the majority of forms. Each form re-implements submission loading (`isSubmitting`), validation (`isValid` computed from manual checks), and error display independently.

**No form section/group component** for complex forms. The create-alert-drawer uses manual `mb-4` spacing between sections and a `<div className="mb-4 border-t" />` as a divider. This should be a reusable `FormSection` component.

**Key files:**
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/components/shared/form-field.tsx`
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/components/ui/form.tsx`
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/analyst/components/intel-alerts/create-alert-drawer.tsx`

---

## 8. Loading States, Error States, Empty States

**Score: 7 / 10**

### What is working well

The trifecta of `LoadingState`, `ErrorState`, and `EmptyState` exists as reusable shared components with thoughtful APIs:

- **LoadingState** offers three variants (spinner, dots, skeleton), three sizes, optional message, and configurable skeleton row count.
- **ErrorState** includes retry handler, custom icon, fullPage mode, and uses the `bg-danger/10` background with proper token color.
- **EmptyState** provides icon (defaults to Inbox), title, description, and action slot.
- **ClientKpiGrid** has a proper skeleton loading state with animated pulse rectangles matching the card dimensions.
- **PageLoading** convenience wrapper centers a large spinner in `min-h-[400px]`.

### What needs attention

**No Suspense or streaming patterns.** The codebase targets Next.js 15 with App Router but shows no use of `<Suspense>` boundaries, `loading.tsx` files, or React Server Components with streaming. This is a significant missed opportunity for perceived performance.

**No Error Boundary component.** React 19 error boundaries are not implemented. The `ErrorState` component is a manual render; there is no automatic catch-and-display wrapper.

**No stale-while-revalidate indicator.** TanStack Query is used for server state, but there is no visual treatment for data that is being refreshed in the background (e.g., a subtle refresh icon or progress bar).

**No optimistic update patterns visible.** Mutations appear to wait for server response before updating the UI.

---

## 9. Animation and Micro-interaction Quality

**Score: 7.5 / 10**

### What is working well

The motion system is the most thoughtfully designed subsystem in the codebase:

- **MOTION token object** (`/src/lib/motion/tokens.ts`) centralizes durations (micro 150ms, short 300ms, medium 500ms, long 800ms, breathe 4000ms), easings (snappy, soft, enter, exit, linear), distances (4/8/16/24px), scale transforms, and stagger delays.
- **useReducedMotion** hook respects `prefers-reduced-motion: reduce` media query.
- **useEntranceAnimation** provides a one-liner fade-in-slide-up on mount.
- **useBreathingAnimation** adds idle-state visual interest to focused elements.
- **useAnimationTrigger** returns imperative `animatePulse`, `animateShake`, `animatePress` functions.
- **StatusBadge animations** are differentiated by state with appropriate easing choices.
- **ClientKpiGrid** uses staggered entrance animations with 100ms delay between cards.
- **Toast glow effects** provide type-specific radial gradient accents.
- **Drawer** uses Radix animate-in/animate-out with 300ms ease-in-out.

### What needs attention

**Two parallel animation systems.** CSS animations in `globals.css` (pulse-dot at 1.5s, spin-slow at 1.5s, fade-in at 0.3s, breathe at 4s) use hardcoded durations. The Anime.js `MOTION` token system is separate. The CSS `fade-in` duration (0.3s) happens to match `MOTION.duration.short` (300ms), but the CSS `breathe` (4s) matches `MOTION.duration.breathe` (4000ms) only by coincidence, not by reference.

**Low adoption rate.** The Anime.js hooks are used in only a handful of components (ClientKpiGrid, StatusBadge, and the cheatsheet demo). The vast majority of interactive elements have no micro-interaction feedback. Button presses, form submissions, card selections, and tab switches all lack tactile animation.

**No page transition animations.** Navigation between routes is instant with no visual continuity.

**Key files:**
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/lib/motion/tokens.ts`
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/lib/motion/hooks.ts`

---

## Priority Remediation Roadmap

### P0 -- Immediate (impacts correctness)

| Issue | Impact |
|-------|--------|
| React Hook Form + Zod adoption for all form-bearing drawers and wizards | Validation gaps, no dirty tracking, accessibility issues with manual form state |
| TripReviewShell right panel needs mobile alternative | Analyst workflow broken below `lg` breakpoint |
| Light mode `--muted` == `--background` separation | Muted surfaces invisible against page background |

### P1 -- Near-term (impacts consistency)

| Issue | Impact |
|-------|--------|
| Add `warning`, `success`, `info`, `danger` variants to Badge component | Eliminates 50+ custom inline badge implementations |
| Replace AG-Grid dark mode hardcoded hex with `var(--*)` tokens | Theme changes require single-source updates |
| Extract reusable Stepper/Wizard component from OnboardingProgress + trip wizard patterns | Reduces duplication across 14,867 LOC trip-create module |
| Audit and replace 139 raw Tailwind color class usages with semantic tokens | Token compliance across 30 files |
| Add `max-w-7xl mx-auto` container to main content area | Prevents content stretching on wide displays |

### P2 -- Mid-term (impacts maturity)

| Issue | Impact |
|-------|--------|
| Create typography scale tokens and Heading component | Consistent type hierarchy across all portals |
| Unify CSS and Anime.js animation timing into a single reference | One source of truth for motion |
| Add Suspense boundaries with `loading.tsx` per route segment | Perceived performance improvement |
| Deprecate `safety-map.tsx` iframe implementation | Consistent map UX within analyst module |
| Migrate Card from forwardRef to modern function pattern | Pattern consistency with newer components |

### P3 -- Longer-term (impacts excellence)

| Issue | Impact |
|-------|--------|
| Build chart components using `--chart-*` palette tokens | Data visualization capability |
| Add page transition animations | Visual continuity between routes |
| Increase Anime.js hook adoption (button press, tab switch, form submit) | Tactile interaction quality |
| Add spacing scale, z-index, and breakpoint tokens to CSS | Complete token coverage |
| Create responsive padding utilities for main content (`p-4 md:p-6`) | Mobile comfort improvement |