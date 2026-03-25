---

# SafeTrekr Frontend Deep Analysis

## Executive Summary

SafeTrekr's frontend is a **187,603-line, 1,051-file React application running inside Next.js App Router without using App Router's core capabilities**. It functions as a client-rendered SPA with Next.js serving only as a bundler and router. The three portals (Client, Analyst, HQ) share a well-designed module boundary and competent component library, but the application leaves nearly all of Next.js 16's performance and reliability features unused: zero server components for page rendering, zero streaming, zero route-level error boundaries, zero code splitting for heavy libraries, and zero server-authoritative auth.

The consensus from multi-model architecture review (GPT-5.4 and Gemini-3.1-Pro) is clear: **adopt a server-first shell with client interactive islands** -- not a full RSC rewrite, but a pragmatic hybrid that fixes the highest-impact architectural gaps while preserving the existing TanStack Query mutation infrastructure.

---

## 1. Component Architecture Assessment

### Current State: 7/10

**Strengths**

The module-based organization is sound. Code is segmented into `modules/client/`, `modules/analyst/`, and `modules/hq/` with clean separation of concerns. Each module contains its own `components/`, `hooks/`, `stores/`, and `data/` directories.

The shared component library is well-structured:
- 48 shadcn/ui primitives in `src/components/ui/`
- 31 SafeTrekr-specific shared components in `src/components/shared/` (StatusBadge, KpiCard, EmptyState, ErrorState, LoadingState, PageHeader, Panel, etc.)
- AG-Grid wrapper with typed cell renderers in `src/shared/components/datagrid/`
- AppShell layout system in `src/shared/components/layout/`

The API factory pattern with lazy singletons (`getSupabaseTripsApi()`, `resetSupabaseTripsApi()`) enables clean testing and avoids import-time side effects.

**Issues**

| Problem | Files | Impact |
|---------|-------|--------|
| Giant components (700-1200 lines) | `review-builder.tsx` (1178), `safety-locations-map.tsx` (1165), `itinerary-add-event-drawer.tsx` (766) | Hard to test, reason about, and maintain |
| Duplicated CSV upload drawers | `participant-csv-upload-drawer.tsx` (827), `itinerary-csv-upload-drawer.tsx` (1084), `lodging-csv-upload-drawer.tsx` (860), `venue-csv-upload-drawer.tsx` (808) | ~3,500 lines of near-identical code |
| No compound component patterns | All complex components use flat prop drilling | Limits composability and reuse |
| All 113 page.tsx files are `'use client'` | Every route in `src/app/` | Zero server-rendered pages; entire App Router benefit wasted |

**Recommendation: Extract a generic `<CsvImportDrawer>` that accepts a Zod schema, column mapping config, and onUpload callback. Break `review-builder.tsx` into compound components (`ReviewBuilder.Header`, `ReviewBuilder.Section`, `ReviewBuilder.DayByDay`).**

---

## 2. State Management Analysis

### Current State: 6/10

**TanStack Query Patterns**

The query key factory at `src/shared/query/query-keys.ts` covers client, HQ, and digest domains with proper hierarchical structure. However:

- **51 usages** of the centralized factory vs **65 inline query keys** that bypass it (analyst hooks, client hooks use local `const xxxQueryKey = ['xxx'] as const` patterns instead)
- **288 invalidateQueries calls** indicate heavy reliance on refetch-everything patterns
- Only **~10 setQueryData/optimistic update calls** (lodging POIs, issue read status, digest read status)
- **Zero prefetchQuery** calls anywhere -- no route-level prefetching, no hover-based prefetch
- **Zero `select`** option usage for preventing unnecessary re-renders from query data

**Zustand Stores**

| Store | Lines | Concern |
|-------|-------|---------|
| `trip-draft-store.ts` | 1,480 | **Massive** -- 40+ actions, participant/flight/lodging/venue/itinerary/transportation CRUD all in one store. Needs slice pattern decomposition. |
| `auth-store.ts` | 178 | Uses `persist` middleware which creates dual-session desync with Supabase's own session storage. Documented as a known bug in project memory. |
| `trip-review-store.ts` | 121 | Appropriate scope -- POI resolution state only |
| `ui-store.ts` | 25 | Clean -- sidebar state only |
| `onboarding-store.ts` | ~60 | Uses persist with `createJSONStorage` |

**Critical Issue: Auth Store**

The `useAuthStore` with `persist` middleware creates two independent session stores:
1. Supabase's own `sb-{ref}-auth-token` in localStorage
2. Zustand's `safetrekr-auth` in localStorage

These desync when tokens expire, causing the documented "SIGNED_OUT handler clears Zustand permanently" bug. The fix documented in MEMORY.md (redirect to /login on SIGNED_OUT) is a band-aid -- the actual fix is to **make auth server-authoritative via middleware.ts + Supabase SSR cookies**.

**Recommendations:**
1. Enforce query key factory usage via `@tanstack/eslint-plugin-query`
2. Decompose `trip-draft-store.ts` into slices: `createParticipantSlice`, `createFlightSlice`, `createItinerarySlice`, etc.
3. Replace auth store persist with server-side cookie session
4. Add `select` to queries that return large objects but consumers only need subsets
5. Implement prefetchQuery on route transitions for heavy data pages

---

## 3. Performance Optimization

### Current State: 3/10 -- This is the highest-impact improvement area

**Critical Performance Issues**

| Issue | Current State | Impact | Fix |
|-------|--------------|--------|-----|
| `force-dynamic` on root layout | `src/app/layout.tsx:7` | Disables ALL static optimization across 119 routes | Remove; scope per-route where needed |
| Zero code splitting | AG-Grid (500KB+), MapLibre GL (300KB+) eagerly loaded | Every page that imports these pays the full bundle cost | `next/dynamic` with `ssr: false` |
| Zero `loading.tsx` files | No route exists | No streaming, no instant navigation feedback | Add to every major route group |
| Zero `error.tsx` files | No route exists | Unhandled errors crash entire portal | Add to every layout segment |
| Zero `not-found.tsx` files | None | No graceful 404 handling | Add at portal level |
| No middleware.ts | Auth happens entirely client-side | Flash of unauthenticated content, no server-side route protection | Add Supabase SSR middleware |
| No `next/image` usage | Only sidebar logo uses Image | No automatic image optimization, lazy loading, or format conversion | Adopt for all images |
| All pages are client components | 113/119 pages use `'use client'` | Entire page JS must download, parse, and hydrate before content renders | Server component page shells |

**AG-Grid Specific:**
File: `src/shared/components/datagrid/safetrekr-grid.tsx`
- `ModuleRegistry.registerModules([AllCommunityModule])` is called at module scope, meaning AG-Grid's entire module system initializes on import
- `defaultColDef` and `handleRowClicked` are recreated on every render (no memoization)
- No mobile fallback -- AG-Grid is desktop-only

**MapLibre Specific:**
Files: `src/modules/analyst/components/safety/safety-locations-map.tsx` (1165 lines), `venue-map.tsx` (770 lines), `lodging-map.tsx` (703 lines)
- Three separate large map components with no shared map abstraction
- All eagerly imported with no dynamic loading

**Recommended Immediate Actions:**

```
Priority 1: next/dynamic for AG-Grid and MapLibre
Priority 2: middleware.ts for Supabase SSR auth
Priority 3: loading.tsx + error.tsx for all 6 layout groups
Priority 4: Remove root-level force-dynamic
Priority 5: Convert page shells to server components
```

---

## 4. Form Architecture Roadmap

### Current State: 3/10

**The Problem**: React Hook Form (`^7.68.0`), `@hookform/resolvers` (`^5.2.2`), and Zod (`^4.1.13`) are installed in `package.json`. The shadcn/ui `form.tsx` component (which integrates RHF with Radix form primitives) exists at `src/components/ui/form.tsx`. **None of these are used in any application component.** Zero files import from `form.tsx`. Zero files use `useForm`. Zero Zod schemas exist.

Every form in the application uses raw `useState` with manual `onChange` handlers.

**Evidence from the codebase:**

The `invite-user-drawer.tsx` (647 lines) manages 7 independent `useState` calls for form fields:
```
const [category, setCategory] = useState<UserCategory | null>(null);
const [role, setRole] = useState<UserRole | ''>('');
const [analystTier, setAnalystTier] = useState<AnalystTier | null>(null);
const [organizationId, setOrganizationId] = useState('');
const [email, setEmail] = useState('');
const [name, setName] = useState('');
const [message, setMessage] = useState('');
```

The trip creation wizard (10+ form screens across `modules/client/components/trip-create/`) stores all form state in the monolithic `trip-draft-store.ts` Zustand store with individual `updateField` callbacks.

**Migration Plan (3 Phases)**

**Phase 1 -- Foundation (Week 1-2)**
- Create `src/lib/validations/` directory for shared Zod schemas
- Build reusable form field wrappers: `FormInput`, `FormSelect`, `FormDatePicker`, `FormPhoneInput`, `FormTextarea` that integrate shadcn/ui form primitives with RHF
- Migrate 3 high-value forms: Login, Invite User Drawer, Activate Account

**Phase 2 -- Trip Creation Wizard (Week 3-5)**
- Create Zod schemas for each wizard step: `tripInfoSchema`, `participantSchema`, `flightSchema`, `lodgingSchema`, `venueSchema`, `itineraryEventSchema`, `transportationSchema`
- Replace trip-draft-store form state with RHF `useForm` per wizard step
- Keep Zustand only for cross-step orchestration state (current step, mode, completed steps)
- Implement `useFieldArray` for participants, flights, lodging arrays

**Phase 3 -- Remaining Forms (Week 6-8)**
- Migrate analyst review forms, HQ management forms, settings forms
- Add async validation for email uniqueness, org domain checks
- Implement unsaved changes guard via RHF `formState.isDirty`

---

## 5. Frontend Enhancements (Impact/Effort Matrix)

| # | Enhancement | Impact | Effort | Priority |
|---|------------|--------|--------|----------|
| 1 | **Add middleware.ts for Supabase SSR auth** -- eliminates flash of unauthenticated content, enables server-side route protection, fixes auth desync | Critical | Medium (2-3 days) | P0 |
| 2 | **Dynamic import AG-Grid + MapLibre** -- `next/dynamic` with `ssr: false` and skeleton fallbacks; estimated 800KB+ savings on non-grid routes | Critical | Low (1 day) | P0 |
| 3 | **Add loading.tsx/error.tsx/not-found.tsx** to all 6 route groups (`(client)`, `(trip-detail)`, `analyst`, `hq`, `(onboarding)`, `(auth)`) | High | Low (1 day) | P0 |
| 4 | **Remove root-level force-dynamic** -- scope `dynamic = 'force-dynamic'` only to pages that need runtime env access (currently kills all static optimization) | High | Low (hours) | P0 |
| 5 | **Add ESLint** -- `eslint-config-next`, `@typescript-eslint`, `eslint-plugin-react-hooks`, `@tanstack/eslint-plugin-query`, `eslint-plugin-jsx-a11y` | High | Medium (1-2 days) | P1 |
| 6 | **Migrate top 10 forms to RHF + Zod** -- login, activate, invite user, participant form, flight form, lodging form, venue form, org settings, profile settings, review submission | High | High (2 weeks) | P1 |
| 7 | **Extract generic CsvImportDrawer** -- replace 4 duplicated CSV drawers (~3,500 lines) with a single configurable component accepting schema + column mapping | High | Medium (3-4 days) | P1 |
| 8 | **Decompose trip-draft-store.ts** -- slice pattern into participant, flight, lodging, venue, itinerary, transportation slices with a combined root store | High | Medium (2-3 days) | P1 |
| 9 | **Convert page shells to server components** -- server-render layout/data-fetch shell, pass to client interactive islands; start with dashboard, trip list, queue pages | High | High (2-3 weeks, incremental) | P2 |
| 10 | **Add observability** -- Sentry error tracking, Web Vitals monitoring, bundle analyzer in CI, performance budgets per route group | High | Medium (3-4 days) | P2 |
| 11 | **Implement parallel/intercepting routes** for drawers and modals -- enables deep-linking, back-button support, and restore-on-refresh for invite drawers, CSV import flows, detail overlays | Medium | Medium (1 week) | P2 |
| 12 | **Add React 19 concurrent patterns** -- `startTransition` for filter/tab changes, `useDeferredValue` for search inputs, `useOptimistic` for inline status updates | Medium | Low (2-3 days) | P2 |
| 13 | **Mobile-responsive data tables** -- card-based mobile fallback for AG-Grid screens, responsive column hiding on tablet | Medium | Medium (1 week) | P3 |
| 14 | **Prefetch strategy** -- `queryClient.prefetchQuery` on route transitions, hover-based prefetch for trip detail from trip list | Medium | Low (2 days) | P3 |

---

## 6. Testing Strategy

### Current State: 1/10

**Inventory:**
- 1 unit test file: `src/__tests__/smoke.test.tsx` -- contains only `expect(true).toBe(true)`
- 4 E2E specs: `smoke.spec.ts`, `trip-wizard.spec.ts`, `create-organization.spec.ts`, `trip-lifecycle.spec.ts`
- Zero component tests, zero hook tests, zero integration tests
- Vitest configured but unused; Playwright configured and functional

**Proposed Testing Pyramid**

| Layer | Target Coverage | Tools | What to Test |
|-------|----------------|-------|-------------|
| **Unit** | Hooks, stores, utils, validators | Vitest + RTL `renderHook` | `trip-draft-store` actions, query key factory, auth-store state transitions, date/phone/timezone utils, Zod schemas (when added), ApiError class |
| **Integration** | Forms, data flows, component interactions | Vitest + RTL + MSW | Form submission flows, drawer open/close/save cycles, TanStack Query cache behavior with MSW-mocked Supabase, auth provider state transitions |
| **E2E** | Critical user journeys per portal | Playwright | Client: trip creation wizard end-to-end, trip detail navigation; Analyst: queue claim + review workflow; HQ: org creation + user invite; Auth: login/logout/password reset/activate |
| **Accessibility** | WCAG 2.2 AA | jest-axe + Playwright axe | Every shared component, all form states, all dialog/drawer focus trapping |
| **Visual** | Key states | Chromatic or Percy (via Storybook) | Shared component library, all UI states (loading/empty/error/success) |

**Phase 1 Priority Tests:**
1. `trip-draft-store.test.ts` -- the most complex piece of business logic in the app
2. `auth-store.test.ts` -- the most failure-prone state (documented bugs)
3. `query-keys.test.ts` -- ensure factory produces correct hierarchical keys
4. `ApiError.test.ts` -- error classification logic
5. MSW setup for Supabase PostgREST mocking
6. 3 integration tests for the trip creation wizard critical path

---

## 7. Mobile-Web Responsive Improvements

### Current State: 4/10

**What Works:**
- Sidebar collapses to a Sheet (slide-over drawer) on mobile via `md:hidden` / `md:flex` breakpoints in `src/shared/components/layout/sidebar.tsx`
- MobileHeader with hamburger menu appears on `< md` screens
- Basic responsive card layouts in some dashboard components

**What Does Not Work:**

| Gap | Impact | Files Affected |
|-----|--------|---------------|
| **AG-Grid has no mobile alternative** | Data tables are completely unusable below 768px -- horizontal scroll only | All grid usages across 3 portals |
| **Zero `sm:` or `xl:` breakpoints** in page content | Layout does not adapt between mobile, tablet, and large desktop | All `page.tsx` files |
| **Dashboard pages have no responsive grid** | KPI cards and lists do not reflow for smaller screens | `src/app/(client)/dashboard/page.tsx` |
| **Drawers assume desktop width** | `max-w-lg` on DrawerContent does not adjust for mobile | All drawer components |
| **Map components have no touch gesture support** | Pinch-to-zoom and pan not explicitly configured for mobile | Map components in analyst module |
| **Trip creation wizard is desktop-only** | Multi-step form layout does not adapt | `src/modules/client/components/trip-create/` |

**Recommended Responsive Strategy:**

1. **Define breakpoint contract**: `sm` (640px, phone), `md` (768px, tablet portrait), `lg` (1024px, tablet landscape/small desktop), `xl` (1280px, desktop), `2xl` (1536px, wide desktop)

2. **Mobile-first card fallback for grids**: Create a `<ResponsiveDataView>` that renders AG-Grid at `md+` and a card list at `< md`:
   ```
   <ResponsiveDataView
     data={data}
     columns={columnDefs}           // AG-Grid columns
     renderCard={(item) => <.../>}   // Mobile card renderer
   />
   ```

3. **Responsive page layouts**: Add `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4` to KPI grids, `flex flex-col lg:flex-row` to split-panel layouts

4. **Drawer adaptations**: Full-screen sheet on mobile (`className="w-full sm:max-w-lg"`), with `DrawerBody` scroll behavior tested on touch devices

5. **Trip wizard mobile mode**: Stepper-based vertical layout on mobile vs horizontal tabs on desktop

---

## Architectural Red Flags (Cross-Cutting Concerns)

### No Middleware (`middleware.ts`)
There is no Next.js middleware in the entire application. Auth protection happens entirely client-side in the `AuthProvider` useEffect. This means:
- Protected routes are momentarily accessible before the client-side redirect fires
- There is no server-side session validation
- The Supabase JWT is only used for Supabase API calls, not for Next.js route protection

### Environment Variable Injection via `dangerouslySetInnerHTML`
File: `src/app/layout.tsx` lines 60-74

The root layout injects environment variables via a raw script tag with `dangerouslySetInnerHTML`. This is a security concern (XSS vector if any env value contains untrusted content) and bypasses Next.js's built-in `NEXT_PUBLIC_*` mechanism. The comment says "for Doppler integration" but Next.js 16 supports runtime env natively.

### Hardcoded User Identities
- `src/app/hq/layout.tsx:156-159` -- `const HQ_USER = { name: 'HQ Admin', role: 'Platform Administrator' }`
- `src/app/analyst/layout.tsx:16-19` -- `const ANALYST_USER = { name: 'Safety Analyst', role: 'Trip Reviewer' }`

These should read from auth context (the Client layout does this correctly).

### No ESLint
The project uses Prettier only. There is no ESLint configuration at all. This means:
- No `react-hooks/rules-of-hooks` enforcement
- No `react-hooks/exhaustive-deps` warnings
- No Next.js-specific lint rules
- No accessibility lint rules
- No TanStack Query best practices enforcement

---

## Implementation Roadmap

### Phase 0: Critical Infrastructure (Week 1)
- Add `middleware.ts` with Supabase SSR auth
- Add `loading.tsx`, `error.tsx`, `not-found.tsx` to all 6 route groups
- Dynamic import AG-Grid and MapLibre with `next/dynamic`
- Remove root-level `force-dynamic`
- Add ESLint with `next/core-web-vitals`, TypeScript, React hooks, jsx-a11y, TanStack Query plugins
- Fix hardcoded user names in HQ and Analyst layouts

### Phase 1: Architecture Foundation (Weeks 2-4)
- Server component conversion for 10 highest-traffic page shells (dashboard, trips list, queue, overview pages)
- Establish server-fetch + `<HydrationBoundary>` pattern for those pages
- Decompose `trip-draft-store.ts` into Zustand slices
- Begin RHF + Zod migration (login, activate, invite forms)
- Add Sentry error tracking + Web Vitals

### Phase 2: Form & Data Quality (Weeks 5-8)
- Complete RHF + Zod migration for all critical forms
- Extract generic `CsvImportDrawer` component
- Enforce query key factory usage (ESLint rule + migrate remaining 65 inline keys)
- Add optimistic updates for high-frequency mutations
- Implement prefetch strategy for trip detail from list views
- Add mobile card fallback for AG-Grid tables

### Phase 3: Testing & Polish (Weeks 9-12)
- Unit tests for all stores, hooks, and utility functions
- Integration tests for 5 critical user flows per portal
- Expand E2E suite to cover auth, trip creation, analyst review, HQ management
- Accessibility audit with jest-axe + manual screen reader testing
- Performance budgets in CI with bundle analyzer
- Parallel/intercepting routes for drawer flows

---

## Key File Paths Reference

| Concern | Path |
|---------|------|
| Root layout (force-dynamic, env injection) | `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/layout.tsx` |
| Provider stack | `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/providers/index.tsx` |
| Auth provider (client-side only) | `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/shared/auth/auth-provider.tsx` |
| Auth store (persist desync) | `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/shared/auth/auth-store.ts` |
| Query key factory | `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/shared/query/query-keys.ts` |
| Trip draft store (1480 lines) | `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/client/stores/trip-draft-store.ts` |
| Largest component (review builder) | `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/client/components/trip-create/review-builder.tsx` |
| AG-Grid wrapper (no lazy loading) | `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/shared/components/datagrid/safetrekr-grid.tsx` |
| Unused shadcn form component | `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/components/ui/form.tsx` |
| Only error boundary | `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/client/components/trip-detail/transportation/transportation-content.tsx` |
| CSS design tokens | `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/globals.css` |
| Layout system | `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/shared/components/layout/app-shell.tsx` |
| Client layout | `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/(client)/layout.tsx` |
| Analyst layout (hardcoded user) | `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/analyst/layout.tsx` |
| HQ layout (hardcoded user) | `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/hq/layout.tsx` |
| Supabase API factory pattern | `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/shared/api/supabase/trips.ts` |
| API error class | `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/shared/api/errors.ts` |

---

## Scorecard Summary

| Dimension | Current | Target | Gap |
|-----------|---------|--------|-----|
| Component Architecture | 7/10 | 9/10 | Compound components, decompose giants, eliminate duplication |
| State Management | 6/10 | 9/10 | Enforce key factory, decompose stores, server-authoritative auth |
| Performance | 3/10 | 8/10 | Code splitting, middleware, server components, streaming |
| Form Architecture | 3/10 | 8/10 | RHF + Zod migration, schema-driven validation |
| Error Handling | 2/10 | 8/10 | Route-level boundaries, global error, error taxonomy |
| Testing | 1/10 | 7/10 | Full pyramid: unit, integration, E2E, a11y, visual |
| Mobile Responsive | 4/10 | 7/10 | Grid mobile fallback, responsive layouts, touch support |
| **Overall** | **3.7/10** | **8.0/10** | **Server-first architecture + testing + forms** |