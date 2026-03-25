I'll present the full discovery analysis directly here rather than writing it to a file.

---

# SafeTrekr UX Discovery Analysis

**Date**: 2026-03-23  
**Analyst**: World-Class UX Designer (Claude Opus 4.6)  
**Scope**: safetrekr-app-v2 (Next.js 15 web application) -- Client Portal, Analyst Portal, HQ Console  
**Codebase size**: 673 TSX components, 119 page routes, 55+ shared components  
**Real user feedback incorporated**: 20 Usersnap issues (US-114 through US-135, filed 2026-03-11 to 2026-03-13)

---

## Executive Summary

SafeTrekr is a functionally ambitious travel safety management platform serving three distinct user populations through a unified codebase. The 10-step trip creation wizard, 17-section analyst review workspace, and multi-portal architecture demonstrate strong information architecture decisions. The design system foundation (CSS custom properties, shadcn/ui, light/dark theming) is solid and consistent.

However, the platform has five systemic UX weaknesses that must be addressed before scaling to production users:

**1. Data loss during trip creation** -- The most critical user-reported issue (US-131). Navigating away from the 10-step wizard destroys all entered data. While a server draft sync mechanism exists (`TripDraftSyncProvider` with 2-second debounce), there is no visible save indicator shown to users, no "unsaved changes" guard on navigation, and no resume-draft prompt when returning.

**2. Accessibility is structurally deficient** -- For a platform that manages the safety of minors, K-12 students, and youth groups, the accessibility posture is far below WCAG 2.2 AA. There are zero skip-navigation links, only 3 `aria-live` regions across 673 components, no page-level error boundaries, and no keyboard navigation testing infrastructure. This is both a usability failure and a legal liability.

**3. The analyst portal operates on mock data** -- 7,898 lines of mock data power the analyst review experience. The trip review layout hardcodes `mockReviewQueue` for trip details. This means no analyst can perform a real safety review, which is the core value proposition of the platform.

**4. Mobile responsiveness is minimal** -- Only 15 responsive breakpoint rules exist across the entire frontend. The sidebar collapses to a Sheet on mobile, but page content, forms, data grids, and maps have no mobile-specific adaptations.

**5. Feature completeness is uneven** -- Of 23 HQ navigation items, 11 are disabled as "Coming Soon." The client portal has 12 trip detail sections hardcoded to zero status. Background check integration is entirely stubbed. Intel alerts are disabled in navigation.

---

## Key UX Findings

### 1. User Flow Analysis

#### 1.1 Trip Creation Wizard (10 Steps) -- The Primary Revenue Flow

**Route**: `/trips/new/type` through `/trips/new/review`  
**Store**: Zustand `useTripDraftStore` with `TripDraftSyncProvider` (2s debounce to `trip_drafts` table)  
**Steps**: Type, Info, Participants, Flights, Lodging, Venues, Itinerary, Transportation, Add-ons, Review

**Strengths**:
- Step-by-step information architecture is logical and reduces cognitive load
- Each step has contextual help via info drawers with markdown content
- Progress indicator shows step count, percentage complete, and clickable step navigation
- Server draft sync saves automatically in background
- Review page has section-level validation with clickable links back to offending steps
- CSV upload supported for participants, lodging, and venues (batch entry)

**Critical Problems**:
- **US-131 (Critical)**: User navigated to "Teams and Travelers" from the review page and lost the entire trip. No autosave indicator was visible, no "unsaved changes" dialog appeared, and the data was unrecoverable. The `TripDraftSyncProvider` exists but the `SyncStatusIndicator` component is only shown in the header -- it is easy to miss, and there is no `beforeunload` event handler preventing navigation.
- **No resume-draft prompt**: If a user has an in-progress draft and navigates to `/trips/new`, they start fresh with no option to resume their previous work.
- **US-133 (Critical)**: Transportation modes assigned during creation do not persist to the database. The entire Transportation step (step 8) is functionally broken.
- **US-128/US-129 (High)**: Overnight flight date calculation is inverted -- departure date shifts backward instead of arrival date shifting forward.
- **US-130 (Medium)**: Background check charges are auto-applied with no opt-out toggle.

**Validation Architecture**: All validation is ad-hoc via `useState` + `useMemo` per step. React Hook Form and Zod are imported but unused (only in `components/ui/form.tsx`). No steps use schema-based validation. This creates inconsistency risk.

#### 1.2 Analyst Trip Review (17 Sections) -- The Core Safety Workflow

**Route**: `/analyst/trip-review/[tripId]/*`  
**Shell**: `TripReviewShell` -- 3-column layout (sidebar, content, reviewer panel)

**Strengths**:
- 3-column layout provides efficient workspace
- Section completion tracking with visual progress
- Comments system per section
- Reviewer panel with Required/Optional/Comments tabs

**Critical Problems**:
- **Mock data dependency**: `trip-review/[tripId]/layout.tsx` line 49 calls `mockReviewQueue.find()` for trip name and dates. The entire experience runs on static mock data.
- **US-134 (High)**: Comments do not load on venues review page
- **US-117 (High)**: Background checks show zero for trips with minors and chaperones
- **US-118 (High)**: Checklist initialization from templates does not work
- **US-122 (High)**: Guidance page shows mock participant names, not actual travelers
- **Reviewer panel hidden on mobile**: Uses `hidden lg:block` -- below 1024px the checklist disappears with no alternative access path

#### 1.3 Client Trip Detail View (18 Tabs)

**12 of 18 section statuses hardcoded to 0** in `use-trip-section-status.ts` (lines 96-108). Background checks, itinerary, safety review, guidance, documents, packets, issues, analyst notes, and transactions all show zero regardless of actual data. No breadcrumb navigation exists.

#### 1.4 Auth and Onboarding

Generally well-implemented. Key issue: the password visibility toggle has `tabIndex={-1}` (login/page.tsx line 199), making it inaccessible to keyboard users. The known dual-session-store problem means production users can be permanently locked out when JWTs expire.

#### 1.5 HQ Console

**11 of 23 nav items are disabled** with "Coming Soon" labels. The HQ layout hardcodes user display (`const HQ_USER = { name: 'HQ Admin' }` at line 157) instead of showing the actual logged-in user. Cross-portal trip navigation loses HQ context (US-120).

---

### 2. Accessibility Audit

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Skip-nav link | **FAIL** | Zero instances in codebase |
| ARIA landmarks | PARTIAL | `<main>` exists; `<nav>` in sidebar; no `<header role="banner">` |
| ARIA labels on controls | PARTIAL | 142 attributes across 673 files (0.21 per file) |
| Screen reader text | PARTIAL | 57 `sr-only` instances, primarily on icon buttons |
| Live regions | **FAIL** | Only 3 `aria-live` regions. None on form errors, loading states, or grid updates |
| Focus management | **FAIL** | 34 focus-visible styles; password toggle has `tabIndex={-1}` |
| Keyboard navigation | PARTIAL | shadcn/Radix provides keyboard support; custom components do not |
| Color contrast | GOOD | `--muted-foreground` (#616567 on #e7ecee = 4.25:1) is borderline |
| Error identification | PARTIAL | Icons + color but no `aria-invalid` or `aria-describedby` |
| Reduced motion | PARTIAL | Hook exists but not enforced on CSS animations |
| Error boundaries | **FAIL** | Only 1 exists (TransportationErrorBoundary); none at page or portal level |

**High-risk gaps**: No skip-nav, form errors not announced to screen readers, data grids lack semantic ARIA labels, maps are keyboard-inaccessible, drag-and-drop has no keyboard alternative.

---

### 3. Feature Inventory with UX Assessment

| Feature | Portal | Maturity | Key Issues |
|---------|--------|----------|------------|
| Login | Auth | Production | Password toggle keyboard-inaccessible |
| Activation + Onboarding | Auth | Production | Clean implementation |
| Dashboard (Client) | Client | Functional | No trend deltas, no skeleton loading |
| Trip Creation Wizard | Client | Functional | 5 Critical bugs (data loss, transport, flights) |
| Trip Detail View | Client | Partial | 12/18 sections hardcoded to zero |
| Trips List | Client | Production | Search, filter, sort, dual view modes |
| Teams & Travelers | Client | Functional | No bulk invite, no role-change |
| Background Checks | Client | **Stub** | ALL API calls are TODO |
| Intel Alerts | Client | **Disabled** | Nav item disabled; page built but inactive |
| Packets | Client | Partial | Download disabled |
| Billing | Client | Functional | Credits system working |
| Help Center | Client | Production | Search, categories, articles |
| Dashboard (Analyst) | Analyst | Functional | Alert acknowledgment is TODO |
| Queue Management | Analyst | Functional | Working priority sorting and claims |
| Trip Review (17 sections) | Analyst | **Mock-dependent** | 6 High severity bugs |
| Digests | Analyst | Functional | Editor with save indicator |
| HQ Overview | HQ | Functional | Real data KPI cards |
| Organizations | HQ | Production | Impersonation is TODO |
| HQ Trips | HQ | Functional | Navigation loses HQ context |
| 11 Disabled HQ Pages | HQ | **Not Started** | Coming Soon placeholders |

---

### 4. Opportunities and Gaps

**G-001: Wizard Data Protection** -- Add `beforeunload` handler, in-app navigation confirmation, prominent save indicator, and resume-draft prompt. Files: `trip-draft-sync-provider.tsx`, `trips/new/page.tsx`, `trip-create-header.tsx`.

**G-002: Analyst Mock-to-Real Migration** -- Replace all 10 mock data files (7,898 lines) with Supabase queries. The `mockReviewQueue` reference in the review layout must be replaced first.

**G-003: Accessibility Foundation** -- Skip-nav link, ARIA live regions for form errors, keyboard drag-and-drop alternatives, page-level error boundaries.

**G-004: Mobile Content Adaptation** -- Only 15 responsive rules across 673 components. AG-Grid tables, multi-column layouts, map views, and the wizard header all need mobile treatments.

**G-005: Form Validation Standardization** -- Migrate from `useState`/`useMemo` validation to React Hook Form + Zod. Infrastructure imported but unused.

**G-006: Loading State Architecture** -- Only 39% of pages (46/119) handle loading states. Skeleton loading is used in only 3 pages.

**G-007: Error Boundary Hierarchy** -- Only 1 error boundary in the entire application. Need root, portal, and section-level boundaries.

**G-008: Navigation Context Preservation** -- Cross-portal navigation loses context (HQ -> trip detail -> back button goes to client trips list).

---

## Top 5 UX Recommendations

### Recommendation 1: Implement Wizard Data Protection
**Severity: Critical | Effort: Low**

Add `beforeunload` handler when draft has unsaved changes, intercept in-app route changes with a confirmation dialog, make the `SyncStatusIndicator` more prominent, and add a resume-draft prompt on `/trips/new`. This is the highest-ROI fix in the application.

Files: `src/modules/client/providers/trip-draft-sync-provider.tsx`, `src/app/(client)/trips/new/page.tsx`, `src/modules/client/components/trip-create/trip-create-header.tsx`

### Recommendation 2: Establish Accessibility Foundation
**Severity: High | Effort: Medium**

Phase 1 (1 week): Skip-nav link in root layout, `aria-live="assertive"` on FormField errors, `aria-invalid`/`aria-describedby` on inputs, fix password toggle `tabIndex`.

Phase 2 (2 weeks): Page-level error boundaries, keyboard drag-and-drop alternatives, `aria-label` on AG-Grid cell renderers.

Phase 3 (4 weeks): Focus management on route changes, `prefers-reduced-motion` enforcement, keyboard-navigable map alternatives, axe-core CI.

### Recommendation 3: Standardize Form Validation with Zod
**Severity: High | Effort: Medium**

Define Zod schemas for each wizard step, migrate to React Hook Form with `zodResolver`. Provides consistent error messaging, `aria-invalid` integration via existing shadcn form component, and schema reuse with Core API. The `none_if_empty()` hack in the Core API is a symptom of missing frontend validation.

### Recommendation 4: Build Mobile-Responsive Content Layouts
**Severity: High | Effort: High**

Priority: (1) Wizard header -- compact mobile version, (2) AG-Grid -- card-list alternative below 768px, (3) Trip detail tabs -- horizontal scrollable bar, (4) Analyst reviewer panel -- bottom sheet access on mobile, (5) Form layouts -- single-column stacking.

### Recommendation 5: Wire Analyst Portal to Real Data
**Severity: Critical | Effort: High**

Phase 1 (2 weeks): Replace `mockReviewQueue`, wire Overview/Participants/Air Travel/Lodging/Background Checks to Supabase tables.

Phase 2 (2 weeks): Wire Safety (fix double-slash URL bug), Emergency Preparedness, Checklists (fix initialization), Briefings.

Phase 3 (2 weeks): Wire Issues, Communications, Intel Alerts (TarvaRI), Evidence.

---

## Dependencies and Constraints

### Technical Dependencies

| Dependency | Status | Impact |
|------------|--------|--------|
| Supabase Auth session management | Fragile workaround | Permanent logout risk in production |
| Core API finalize endpoint | Working with edge cases | `none_if_empty()` hack, category mapping |
| AviationStack API | Rate-limited, gaps | No results for some valid flights (US-126) |
| TarvaRI Intelligence API | Not integrated | Analyst suggestions use mock data |
| Checkr/Sterling APIs | Entirely stubbed | Zero integration code |
| Stripe | Credits working | Invoice system all TODOs |
| MapLibre GL | Working | Keyboard-inaccessible |

### Risk Register

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Trip data loss in production | HIGH | CRITICAL | Recommendation 1 |
| Accessibility compliance failure | MEDIUM | CRITICAL | Recommendation 2 |
| Analyst cannot review real trips | CERTAIN | CRITICAL | Recommendation 5 |
| User abandons wizard due to length | HIGH | HIGH | Save indicators, step-skipping, templates |
| Mobile users cannot use platform | HIGH | HIGH | Recommendation 4 |
| Session expiry locks out users | MEDIUM | HIGH | Fix SIGNED_OUT handler |
| Background check regulatory gap | HIGH | HIGH | Implement Checkr/Sterling |

### Metrics Snapshot

| Metric | Value |
|--------|-------|
| Total TSX components | 673 |
| Total page routes | 119 |
| ARIA attributes total | 142 (0.21 per file) |
| `aria-live` regions | 3 |
| Skip-nav links | 0 |
| Error boundaries | 1 |
| Responsive breakpoint rules | 15 |
| Pages handling loading states | 46/119 (39%) |
| HQ nav items disabled | 11/23 (48%) |
| Trip detail sections at zero | 12/18 (67%) |
| Analyst mock data lines | 7,898 |
| TODO/FIXME markers | 39 |
| Usersnap issues (Critical+High) | 15 |

---

The discovery report is saved at: `/Users/justintabb/projects/safetrekr/discover-artifacts/ux-discovery-2026-03-23.md` (write was denied -- the full content is above).

The key files that informed this analysis:

- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/client/providers/trip-draft-sync-provider.tsx` -- the draft sync mechanism that exists but lacks user-facing guards
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/analyst/trip-review/[tripId]/layout.tsx` -- line 49 `mockReviewQueue.find()` that prevents real analyst reviews
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/client/hooks/use-trip-section-status.ts` -- lines 96-108 where 12 sections are hardcoded to zero
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/components/shared/form-field.tsx` -- the form error component that lacks ARIA attributes
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/shared/components/layout/app-shell.tsx` -- the shell missing `id="main-content"` and skip-nav
- `/Users/justintabb/projects/safetrekr/user-snap-issues/usersnap_analysis_batch_1.md` -- the 20 real user issues that validate every finding above