---

# SafeTrekr Comprehensive UX Analysis

**Date:** 2026-03-23
**Analyst:** World-Class UX Designer Agent
**Scope:** 1,051 TS/TSX files across 3 web portals + deleted React Native mobile app
**Validated by:** GPT-5.4 + Gemini 3.1 Pro consensus review

---

## 1. FEATURE DOCUMENTATION -- Every User-Facing Feature with UX Assessment

### 1.1 Authentication & Onboarding

| Feature | Files | UX Score | Issues |
|---------|-------|----------|--------|
| **Login** | `src/app/(auth)/login/page.tsx` | 5/10 | Password toggle has `tabIndex={-1}` (line 198), making it keyboard-unreachable. Error div (line 156) lacks `role="alert"` and `aria-live`. No rate-limit feedback. |
| **Forgot Password** | `src/app/(auth)/forgot-password/` | 6/10 | Standard flow exists. Not deeply inspected. |
| **Activation (Invite Code)** | `src/app/(onboarding)/activate/` | 6/10 | Token-based flow tied to pending_invites table. |
| **Onboarding Wizard** | `src/app/(onboarding)/onboarding/account/page.tsx` | 4/10 | 8 raw `useState` calls (lines 59-67). Manual `validate()` with `Record<string, string>` errors (line 102). No `aria-describedby` linking errors to inputs. Hardcoded timezone list of only 10 entries (line 26). |
| **Role-Based Routing** | `src/app/(auth)/login/page.tsx:37-45` | 7/10 | Clean role-to-path mapping. HQ roles -> `/hq/overview`, analyst -> `/analyst/dashboard`, others -> `/dashboard`. |

### 1.2 Client Portal (Org Admin)

| Feature | Files | UX Score | Issues |
|---------|-------|----------|--------|
| **Dashboard** | `src/app/(client)/dashboard/page.tsx` | 6/10 | Good empty state with CTA. KPI grid + recent activity. No skeleton loading (uses `LoadingState` spinner). |
| **Trip List** | `src/app/(client)/trips/` | 6/10 | AG-Grid based. No search within trips visible. Toolbar has some responsive breakpoints. |
| **Trip Creation Wizard (10 steps)** | `src/app/(client)/trips/new/` | 5/10 | Fixed 10-step linear flow regardless of trip type. Step progress bar (`wizard-step-progress.tsx`) allows click-to-jump only for completed steps. Header has fixed `w-40` containers (line 199, 226 of `trip-create-header.tsx`) that risk overflow on mobile. Good auto-save via `trip-draft-sync-provider`. Draft resume prompt (`ResumeDraftPrompt`) is good UX. |
| **Step 1: Trip Type** | `trips/new/type/page.tsx` | 7/10 | Clean card selection. Resume-draft dialog is a strong pattern. |
| **Step 2: Information** | `trips/new/info/` | 5/10 | Location autocomplete, date pickers. Raw useState form management. |
| **Step 3: Participants** | `trips/new/participants/` | 5/10 | Add individual + CSV upload. No bulk edit. No duplicate detection. |
| **Step 4: Air Travel** | `trips/new/flights/` | 4/10 | `flight-form.tsx` has 8 `useState` calls (lines 51-65). Two separate form modes (search vs manual) with duplicated state. AviationStack API limited to today's flights per comment (line 47). |
| **Step 5: Lodging** | `trips/new/lodging/` | 5/10 | Form drawer pattern. CSV upload option. |
| **Step 6: Venues** | `trips/new/venues/` | 5/10 | Similar to lodging. Place search integration. |
| **Step 7: Itinerary** | `trips/new/itinerary/` | 6/10 | Day-by-day builder with `selectedDay` state. Auto-populated events from previous steps. Drag reordering. |
| **Step 8: Transportation** | `trips/new/transportation/` | 5/10 | Auto-generated legs between itinerary events. Assign-mode drawer for each leg. |
| **Step 9: Add-ons** | `trips/new/addons/` | 6/10 | Toggle-based (insurance, dietary, accessibility). |
| **Step 10: Review** | `trips/new/review/` | 6/10 | Section-by-section review with view modes. |
| **Trip Detail** | `src/app/(trip-detail)/trips/[tripId]/` | 5/10 | 17+ sub-pages (overview, participants, air-travel, lodging, venues, itinerary, transportation, documents, background-checks, emergency-preparedness, guidance, analyst-notes, digests, issues, payment, safety-review, settings, transactions, packets). No search across tabs. No breadcrumbs. |
| **Teams & Travelers** | `src/app/(client)/teams/` | 5/10 | AG-Grid with toolbar. |
| **Background Checks** | `src/app/(client)/background-checks/` | 5/10 | Grid view. One responsive breakpoint found. |
| **Packets** | `src/app/(client)/packets/` | 5/10 | PDF generation and versioning. |
| **Billing** | `src/app/(client)/billing/` | 5/10 | Payment modal exists (`first-trip-payment-modal.tsx`). |
| **Intel Alerts** | `src/app/(client)/intel/` | N/A | Marked `disabled: true` in sidebar nav (line 26 of client layout). "Coming Soon". |
| **Settings** | `src/app/(client)/settings/` | 5/10 | Profile + Organization sub-pages. Nav component exists (`user-settings-nav.tsx`, `org-settings-nav.tsx`). |
| **Help** | `src/app/(help)/help/` | 6/10 | Multi-page help center (getting-started, glossary, how-to, search, troubleshooting). Good IA. Sidebar navigation (`help-sidebar.tsx`). |

### 1.3 Analyst Portal

| Feature | Files | UX Score | Issues |
|---------|-------|----------|--------|
| **Analyst Dashboard** | `src/app/analyst/dashboard/page.tsx` | 7/10 | KPI grid + Priority Queue + Activity Feed + Risk Brief tabs. Real-time subscription (`useDashboardSubscription`). Tab badges show counts. Good. |
| **Queue** | `src/app/analyst/queue/page.tsx` | 6/10 | AG-Grid based queue management. |
| **Trip Review (18 sections)** | `src/app/analyst/trip-review/[tripId]/` | 5/10 | Three-column layout: sidebar (sections) + content + ReviewerPanel. **Critical: ReviewerPanel disappears below `lg` breakpoint** (`hidden lg:block` at line 56 of `trip-review-shell.tsx`). No mobile/tablet fallback. Analysts cannot complete reviews on tablets. |
| **Review Sections** | 18 sub-pages under trip-review | 6/10 | Overview, participants, air-travel, transportation, lodging, venues, itinerary, briefings, documents, background-checks, emergency-preparedness, safety, evidence, intel-alerts, checklists, comms, issues, packet, approval. Each has dedicated checklist items. |
| **Reviewer Panel** | `reviewer-panel.tsx` | 6/10 | Tabs (Required/Optional/Comments). Checklist items with visual state cards. Fillable numeric items. Reset button. Persisted to Supabase. Good checklist UX but inaccessible on smaller screens. |
| **Digests** | `src/app/analyst/digests/` | 6/10 | Digest editor with auto-save indicator (one of 3 `aria-live` regions). Distribution status panel. |
| **Calibration** | `src/app/analyst/calibration/` | 5/10 | Exists but not deeply inspected. |
| **Intel Queue** | `src/app/analyst/intel-queue/` | 5/10 | Separate from review queue. |
| **Roster** | `src/app/analyst/roster/` | 5/10 | AG-Grid with one responsive breakpoint. |

### 1.4 HQ Console

| Feature | Files | UX Score | Issues |
|---------|-------|----------|--------|
| **Overview** | `src/app/hq/overview/page.tsx` | 5/10 | Dashboard page. |
| **Organizations** | `src/app/hq/organizations/page.tsx` | 6/10 | CRUD with AG-Grid. Toolbar with search/filter patterns. |
| **Trips** | `src/app/hq/trips/page.tsx` | 5/10 | Cross-org trip view. |
| **Users** | `src/app/hq/users/page.tsx` | 5/10 | User management. |
| **Finance** | `src/app/hq/finance/page.tsx` | 5/10 | Financial overview. |
| **Queue Management** | `src/app/hq/queues/page.tsx` | 5/10 | Queue configuration. |
| **Feature Flags** | `src/app/hq/flags/page.tsx` | 6/10 | Enabled feature. |
| **Policies** | `src/app/hq/policies/page.tsx` | 5/10 | Policy management. |
| **Checklists** | `src/app/hq/checklists/page.tsx` | 5/10 | Checklist configuration. |
| **Guardian Governance** | `src/app/hq/guardian-overrides/page.tsx` | 5/10 | Override management. |
| **Disabled Features** | 11 nav items marked `disabled: true` | 2/10 | Intel Sources, Intel Triage, Intel Policies, Intel Metrics, System Config, Audit Logs, Communications, Incidents, Testing, System Status, Settings -- all show as "Coming Soon" in sidebar. **11 disabled items out of 25 total = 44% of HQ nav is non-functional.** This erodes trust in a safety platform. |

### 1.5 Shared Components & Layout

| Feature | Files | UX Score | Issues |
|---------|-------|----------|--------|
| **AppShell** | `src/shared/components/layout/app-shell.tsx` | 5/10 | No skip-nav link. No `<main>` landmark has accessible name. No breadcrumbs slot. |
| **Sidebar** | `sidebar.tsx` | 6/10 | Desktop: collapsible (280px -> 64px). Mobile: Sheet overlay. Badge counts. Disabled item styling. But: no `role="navigation"` or `aria-label`. |
| **Mobile Header** | `mobile-header.tsx` | 3/10 | Only a hamburger button. No page title, no context, no breadcrumbs. User has zero orientation on mobile. |
| **Design Tokens** | `globals.css` | 8/10 | Comprehensive light/dark token system. Semantic colors (danger, warning, success, info). Extended palette. Sidebar tokens. Well-structured. |
| **Loading State** | `loading-state.tsx` | 4/10 | Generic spinner only. No skeleton variants. No content-aware placeholders. |
| **Error State** | `error-state.tsx` | 5/10 | Icon + title + message + retry button. Good structure but no `role="alert"`. |
| **Empty State** | `empty-state.tsx` | 7/10 | Icon + title + description + action CTA. Good pattern used in dashboard. |
| **AG-Grid (SafetrekrGrid)** | `src/shared/components/datagrid/` | 5/10 | Custom cell renderers (Status, Badge, RiskScore, Code). AG-Grid accessibility requires significant configuration for WCAG compliance. |
| **Toast Notifications** | Sonner integration | 5/10 | Transient toasts only. No persistent notification center. No required acknowledgment flow. |
| **Theme Toggle** | `theme-toggle.tsx` | 7/10 | In sidebar footer. Works with next-themes. |

---

## 2. ENHANCEMENT PROPOSALS -- 15 UX Improvements

### EP-01: Global Search & Command Palette
**Impact: HIGH | Effort: MEDIUM**

The `command.tsx` component (shadcn/ui Command based on cmdk) exists but is only used in the playground/cheatsheet. Wire it up globally with `Cmd+K` / `Ctrl+K` shortcut.

**Evidence:** Zero search functionality exists across any portal. `command.tsx` at `src/components/ui/command.tsx` is imported nowhere except `src/app/(playground)/cheatsheet/page.tsx`.

**Specification:**
- Global keyboard shortcut (`Cmd+K`) triggers Command dialog
- Search across: trips, participants, organizations, alerts, documents
- Role-aware results (analysts see different results than org admins)
- Recent items section
- Deep links to specific trip sections/tabs
- Within-trip search across all 17+ detail tabs

---

### EP-02: Trip Readiness Dashboard / Blocker Summary
**Impact: HIGH | Effort: MEDIUM**

Replace the current tab-by-tab trip detail exploration with a readiness score at the top of every trip view.

**Evidence:** Trip overview at `src/app/(trip-detail)/trips/[tripId]/overview/page.tsx` loads a generic `TripOverviewContent` with no blocker/readiness aggregation. Users must manually inspect 17+ tabs to understand if a trip is safe to proceed.

**Specification:**
- Trip header shows: "3 blockers | 2 warnings | 12/17 sections complete"
- Clickable blockers jump directly to the relevant section/field
- Examples: "5 travelers missing medical forms", "1 passport expires before return date", "Background check pending for 2 chaperones"
- Color-coded severity (red blockers, yellow warnings, green complete)

---

### EP-03: Adaptive Trip Wizard with Conditional Steps
**Impact: HIGH | Effort: HIGH**

The current 10-step linear wizard forces all users through all steps regardless of trip type.

**Evidence:** `WIZARD_STEPS` in `src/types/trip-draft.ts` (line 780) defines a fixed 10-step array. Day trips (T1) still must pass through flights, lodging, venues, itinerary, and transportation steps even when they have no flights or lodging.

**Specification:**
- Group steps into phases: Basics (type + info), People (participants), Travel (flights + lodging + venues + itinerary + transportation), Compliance (addons), Review
- Conditionally hide flights step for trips without air travel
- Conditionally hide lodging step for day trips (T1)
- Add "Duplicate from previous trip" as a starting option
- Global validation summary before review: clickable list of all missing required fields across all steps

---

### EP-04: Responsive Analyst Review Workbench
**Impact: HIGH | Effort: MEDIUM**

The ReviewerPanel completely disappears on tablets and phones.

**Evidence:** `src/modules/analyst/components/trip-review/trip-review-shell.tsx` line 56: `<aside className="...hidden w-86...lg:block">`. Below the `lg` breakpoint (1024px), the entire checklist panel vanishes. There is no alternative UI.

**Specification:**
- Desktop (>=1280px): Current 3-column layout
- Tablet (768-1279px): Two-column layout with ReviewerPanel as a slide-out drawer, triggered by a floating action button
- Mobile (<768px): Single column with ReviewerPanel as a bottom sheet, accessible via a sticky footer tab bar
- Keyboard shortcut to toggle panel (e.g., `Ctrl+]`)

---

### EP-05: Standardized Form Architecture (React Hook Form + Zod)
**Impact: HIGH | Effort: HIGH**

All forms use raw `useState` despite React Hook Form and Zod being installed.

**Evidence:** 
- `src/components/ui/form.tsx` imports from `react-hook-form` but is unused anywhere in the application
- `flight-form.tsx` lines 51-65: 8 separate `useState` calls for a single form
- `onboarding/account/page.tsx` lines 59-67: 6 `useState` calls with manual `validate()` function
- No `aria-describedby` linking error messages to inputs anywhere

**Specification:**
- Create a `<FormField>` wrapper that enforces: Zod schema validation, `aria-invalid` on error, `aria-describedby` linking to error message, focus management to first error on submit
- Migrate forms incrementally (start with onboarding, then trip wizard)
- Each wizard step gets its own Zod schema
- Form-level dirty tracking to prevent data loss

---

### EP-06: Persistent Notification Center with Required Acknowledgment
**Impact: HIGH | Effort: MEDIUM**

Currently only transient Sonner toasts exist. For a safety-critical platform, this is insufficient.

**Evidence:** `toast` from `sonner` used in login page. No notification center component exists. No persistent alert/inbox UI. No acknowledgment tracking in the web portal.

**Specification:**
- Bell icon in topbar showing unread count
- Dropdown/panel showing: intel alerts, review requests, trip status changes, deadline reminders
- Read/unread/acknowledged states
- Critical alerts require explicit acknowledgment with audit trail
- Escalation rules: if unacknowledged after X hours, escalate to supervisor
- Deep links to relevant trip/section

---

### EP-07: Breadcrumb Navigation System
**Impact: MEDIUM | Effort: LOW**

No breadcrumbs exist anywhere in the application.

**Evidence:** Grep for "breadcrumb" returns zero results. Trip detail pages (`/trips/[tripId]/overview`) have no contextual navigation showing the user's position in the hierarchy.

**Specification:**
- Automatic breadcrumbs derived from route structure
- Example: `Dashboard > Trips > Spring DC Trip 2026 > Participants`
- Example: `HQ > Organizations > Lincoln High > Trips`
- Collapsible on mobile (show only parent + current)
- Clickable at each level

---

### EP-08: Skeleton Loading States & Next.js Convention Files
**Impact: MEDIUM | Effort: LOW**

No `loading.tsx`, `error.tsx`, or `not-found.tsx` files exist anywhere.

**Evidence:** `find` for these convention files returns zero results. All loading is handled by inline `LoadingState` spinner component. No `ErrorBoundary` wrapping (only 1 reference in the entire codebase at `transportation-content.tsx`).

**Specification:**
- Add `loading.tsx` with content-aware skeletons for: dashboard (KPI card skeletons + list skeletons), trip list (grid skeleton), trip detail (tab skeleton), analyst queue (queue item skeletons)
- Add `error.tsx` at route group level: `(client)`, `analyst`, `hq`, `(trip-detail)`
- Add `not-found.tsx` at app root and key route groups
- Add `global-error.tsx` as final fallback

---

### EP-09: Mobile-First Header with Contextual Information
**Impact: MEDIUM | Effort: LOW**

The mobile header is just a hamburger button with no context.

**Evidence:** `src/shared/components/layout/mobile-header.tsx` -- entire component is 27 lines, only renders a `Menu` icon button. No page title, no breadcrumb, no notification indicator, no user context.

**Specification:**
- Show truncated page title next to hamburger
- Add notification bell icon with unread count
- Show breadcrumb trail (collapsed)
- For trip detail: show trip name in header
- For analyst review: show trip name + current section

---

### EP-10: PII Masking & Trust UX
**Impact: HIGH | Effort: MEDIUM**

The platform handles minors' personal information, passports, medical data, and background checks with no visible masking or access controls in the UI.

**Evidence:** No "click to reveal" patterns found. No role-based field masking. Sensitive data (passport numbers, medical conditions, background check results) appears to render in plain text.

**Specification:**
- Default mask sensitive fields: passport numbers, SSN/DOB, medical conditions, background check details
- Click-to-reveal with audit logging
- Step-up authentication for bulk export of sensitive data
- Role-based field visibility (traveler sees less than analyst, analyst sees less than HQ)
- Visual indicator showing data freshness: "Last updated 3 hours ago"

---

### EP-11: Trip Template & Duplication System
**Impact: MEDIUM | Effort: MEDIUM**

Schools and organizations repeat similar trips annually. No template or duplication exists.

**Evidence:** The only entry point to trip creation is `resetDraft()` followed by the 10-step wizard from scratch (`dashboard/page.tsx` line 18-19).

**Specification:**
- "Duplicate Trip" button on trip detail/list pages
- Pre-fills wizard with previous trip data (locations, itinerary structure, venues)
- Clears date-specific data (actual dates, flights, participant statuses)
- Organization-level trip templates (e.g., "Annual DC Trip Template")
- Import participant roster from previous trip

---

### EP-12: Change History & Diff View for Analyst Review
**Impact: MEDIUM | Effort: HIGH**

Analysts cannot see what changed between reviews or who modified what.

**Evidence:** No audit trail UI exists. The analyst review layout at `trip-review/[tripId]/layout.tsx` reads from `mockReviewQueue` (line 49) with no change-tracking data. No "what changed since last review" indicator.

**Specification:**
- Timeline view showing all modifications to a trip
- "Changes since your last review" badge count
- Diff view: compare current state vs. last-approved state
- Per-field change attribution (who changed, when)
- Filter changes by section

---

### EP-13: Remove or Replace "Coming Soon" Navigation Items
**Impact: MEDIUM | Effort: LOW**

44% of HQ navigation items are disabled.

**Evidence:** `src/app/hq/layout.tsx` lines 66-153: 11 out of 25 nav items have `disabled: true`. These render as "Coming Soon" with `cursor-not-allowed` (sidebar.tsx line 82).

**Specification:**
- Remove disabled items from primary navigation entirely
- Add a dedicated "Roadmap" or "Upcoming Features" page accessible from settings
- If items must remain visible, move them to a collapsible "Planned" section at the bottom
- For the Intelligence group: either hide entirely or show with a "Beta" tag if partially functional

---

### EP-14: Optimistic Updates for High-Frequency Actions
**Impact: MEDIUM | Effort: MEDIUM**

Checklist toggling, comment posting, and status changes show loading spinners instead of instant feedback.

**Evidence:** `reviewer-panel.tsx` uses `toggleMutation.mutate()` (line 257) and `resetMutation.isPending` (line 396) with disabled states during mutation. No optimistic update patterns visible in TanStack Query mutations.

**Specification:**
- Implement optimistic updates for: checklist item toggles, comment posting, trip status changes, participant status updates
- Show "saving..." indicator rather than blocking interaction
- Automatic rollback on failure with error toast
- Conflict resolution for concurrent edits

---

### EP-15: Collaborative Annotation & Deep-Linking
**Impact: MEDIUM | Effort: HIGH**

Analysts need to flag specific fields for client attention. No field-level commenting exists.

**Evidence:** `SectionCommentsList` component exists in reviewer-panel but comments are section-level only. No per-field annotation. No shareable deep links to specific issues.

**Specification:**
- Field-level comment anchoring (e.g., "This hotel address needs verification")
- @mentions to notify specific users
- "Request changes" with due date
- Shareable URL that opens the exact section + field + comment thread
- Decision rationale capture for approval/rejection

---

## 3. MOBILE-SPECIFIC UX

### 3.1 Current State

The React Native mobile app (`safetrekr-traveler-native/`) has been deleted from the repository (all files show `D` deleted status in git). This means there is currently **no mobile experience** for travelers, chaperones, or guardians during active trips.

### 3.2 Critical Mobile Web Gaps

Given the native app is gone, the web application must serve mobile users. Current mobile web deficiencies:

1. **Mobile Header** (`mobile-header.tsx`): Only renders a hamburger. No title, context, or notifications.
2. **Trip Wizard**: Fixed `w-40` navigation containers will overflow on screens <375px.
3. **AG-Grid**: Not mobile-friendly. No responsive card-view alternative for data tables.
4. **Analyst ReviewerPanel**: Completely hidden below 1024px.
5. **Maps** (MapLibre GL): Touch interaction not optimized for mobile.

### 3.3 Recommended Mobile Strategy

**Phase 1: Mobile Web Parity (Effort: HIGH)**
- Responsive card views as AG-Grid alternative for mobile
- Bottom navigation bar for primary portals on mobile
- Swipe gestures for wizard step navigation
- Collapsible sections instead of multi-tab layouts
- Touch-optimized tap targets (minimum 44px)
- Pull-to-refresh on data lists

**Phase 2: Day-of-Travel Mobile View (Effort: MEDIUM)**
If the native app is not restored, create a dedicated mobile web route:
- `/travel/[tripId]` -- simplified single-page view showing:
  - Today's itinerary with local timezone
  - Emergency contacts (1-tap call)
  - Current location/venue info
  - Critical alerts
  - Check-in/headcount functionality
  - Offline-capable via Service Worker + cached trip data

**Phase 3: Push Notification Strategy (Effort: MEDIUM)**
- Web Push API for modern browsers
- SMS fallback for critical alerts (already in Core API)
- Required acknowledgment for emergency notifications
- Location-based alerts when near defined geofences

### 3.4 If Native App Returns

Recommendations for the React Native app architecture:
- Bottom tab navigation: Today | Safety | Alerts | Packet | Settings
- Offline-first with SQLite queue (was already in deleted architecture)
- Biometric auth for sensitive data access
- Haptic feedback for emergency alerts
- Shake-to-report-emergency gesture
- Local timezone awareness for all displayed times
- Low-bandwidth mode with text-only views
- Emergency card widget (iOS/Android home screen widget)

---

## 4. ACCESSIBILITY ROADMAP -- WCAG 2.2 AA Compliance Plan

### 4.1 Current State: CRITICAL

| Category | Status | Evidence |
|----------|--------|----------|
| Skip Navigation | ABSENT | 0 skip-nav links in entire codebase |
| ARIA Landmarks | MINIMAL | `<main>` exists in app-shell but has no `aria-label`. No `<nav aria-label>` on sidebar. |
| Live Regions | 3 TOTAL | Only in `sync-status-indicator.tsx`, `distribution-status-panel.tsx`, `digest-editor-page.tsx` |
| Form Accessibility | POOR | No `aria-describedby` linking errors to inputs. No `aria-invalid` on error state. |
| Focus Management | ABSENT | No focus restoration after route changes, form submissions, or modal closures |
| Keyboard Navigation | POOR | Password toggle has `tabIndex={-1}`. No keyboard shortcuts. AG-Grid keyboard nav unverified. |
| Color Contrast | PARTIAL | Design tokens exist but no automated contrast verification |
| Error Boundaries | ABSENT | No `error.tsx` or `ErrorBoundary` components |
| Reduced Motion | UNKNOWN | `anime.js` used for motion but no `prefers-reduced-motion` check found |

### 4.2 Implementation Roadmap

**Sprint 1 (Week 1-2): Foundation**
- [ ] Add skip-nav link to `app-shell.tsx` and `trip-review-shell.tsx`
- [ ] Add `aria-label` to all `<nav>` elements in sidebar
- [ ] Add `role="alert"` to ErrorState component
- [ ] Add `aria-live="polite"` to LoadingState component
- [ ] Fix password toggle `tabIndex` in login page (change -1 to 0, add `aria-label="Toggle password visibility"`)
- [ ] Add `global-error.tsx` and `error.tsx` at each route group level
- [ ] Add `not-found.tsx` at app root

**Sprint 2 (Week 3-4): Forms**
- [ ] Create accessible FormField wrapper with `aria-describedby` for error messages
- [ ] Add `aria-invalid={true}` to all inputs in error state
- [ ] Add `aria-required={true}` to required fields
- [ ] Implement focus-to-first-error on form submission
- [ ] Add form error summary component with links to fields
- [ ] Migrate login form and onboarding form to new pattern

**Sprint 3 (Week 5-6): Navigation & Focus**
- [ ] Implement focus management for route transitions (focus main content after navigation)
- [ ] Add `aria-current="page"` to active nav links in sidebar
- [ ] Add breadcrumb component with proper `<nav aria-label="Breadcrumb">` and `aria-current`
- [ ] Ensure all modals/drawers trap focus and restore on close
- [ ] Add `aria-expanded` to sidebar collapse toggle
- [ ] Verify all interactive elements have visible focus indicators (minimum 2px)

**Sprint 4 (Week 7-8): Data & Content**
- [ ] Audit AG-Grid configuration for ARIA grid role, row/cell navigation
- [ ] Add table/list fallback for maps (accessibility alternative)
- [ ] Implement `prefers-reduced-motion` check for all anime.js animations
- [ ] Add `aria-live="polite"` to toast/notification announcements
- [ ] Ensure all images have meaningful alt text (or `alt=""` for decorative)
- [ ] Run automated axe-core audit and fix all critical/serious violations

**Sprint 5 (Week 9-10): Verification & Documentation**
- [ ] Manual screen reader testing (NVDA on Windows, VoiceOver on Mac)
- [ ] Keyboard-only navigation walkthrough of all critical flows
- [ ] Color contrast verification for all token pairs (light and dark mode)
- [ ] Document accessible patterns in component playground (/cheatsheet)
- [ ] Set up axe-core in CI pipeline to prevent regressions

---

## 5. RISK ASSESSMENT

### 5.1 UX Risks

| Risk | Severity | Probability | Impact | Mitigation |
|------|----------|-------------|--------|------------|
| Analyst cannot review trips on tablets due to hidden ReviewerPanel | HIGH | CERTAIN | Blocked workflow for mobile analysts | EP-04: Responsive workbench |
| Data loss in trip wizard if browser crashes between auto-saves | MEDIUM | MODERATE | Partial trip data loss | Auto-save frequency increase + version history |
| Users cannot find trips/participants without search | HIGH | CERTAIN | Increased time-on-task, frustration | EP-01: Global search |
| 10-step wizard abandonment for day trips that don't need flights/lodging | MEDIUM | LIKELY | Conversion drop-off | EP-03: Adaptive wizard |
| "Coming Soon" nav items in HQ erode trust in safety platform | MEDIUM | CERTAIN | Reduced stakeholder confidence | EP-13: Remove/relocate disabled items |
| No offline capability after native app deletion | HIGH | CERTAIN | No mobile access during active travel | Phase 2 mobile web travel view |

### 5.2 Business Risks

| Risk | Severity | Probability | Impact | Mitigation |
|------|----------|-------------|--------|------------|
| Schools require ADA/Section 508 compliance for EdTech procurement | CRITICAL | LIKELY | Lost contracts | Accessibility roadmap Sprint 1-5 |
| Competitor with mobile day-of-travel experience wins deals | HIGH | LIKELY | Market share loss | Mobile web travel view or native app restoration |
| No audit trail means no proof of due diligence during incidents | HIGH | MODERATE | Legal liability | EP-12: Change history + audit UI |
| Sensitive minor data displayed without masking violates FERPA expectations | HIGH | MODERATE | Compliance violations | EP-10: PII masking |

### 5.3 Compliance Risks

| Risk | Severity | Probability | Impact | Mitigation |
|------|----------|-------------|--------|------------|
| WCAG 2.2 AA non-compliance | CRITICAL | CERTAIN | ADA lawsuits, contract loss | Accessibility roadmap |
| No error boundaries means unhandled exceptions crash the entire portal | HIGH | LIKELY | Data loss, user confusion | EP-08: Convention files |
| No rate limiting feedback on login | MEDIUM | MODERATE | Brute force vulnerability perception | Add rate limit UX |
| Background check results displayed without access controls | HIGH | MODERATE | FCRA compliance risk | EP-10: Role-based field masking |

---

## 6. PRIORITY RECOMMENDATIONS -- Ordered Implementation Plan

### Tier 1: Critical (Weeks 1-4) -- Safety & Compliance Foundations

| # | Enhancement | Rationale | Effort |
|---|-------------|-----------|--------|
| 1 | **Accessibility Foundation** (Roadmap Sprint 1-2) | Skip-nav, ARIA landmarks, form accessibility, error boundaries. Non-negotiable for EdTech procurement. | 2 sprints |
| 2 | **EP-08: Skeleton Loading & Error Boundaries** | `error.tsx`, `loading.tsx`, `not-found.tsx` across all route groups. Prevents white-screen crashes. | 3 days |
| 3 | **EP-04: Responsive Analyst ReviewerPanel** | Analysts literally cannot complete reviews on tablets. Blocking workflow. | 1 week |
| 4 | **EP-05: Form Architecture (Phase 1)** | Migrate login + onboarding to RHF+Zod with accessible error patterns. Foundation for all future forms. | 1 week |

### Tier 2: High Impact (Weeks 5-8) -- Workflow & Findability

| # | Enhancement | Rationale | Effort |
|---|-------------|-----------|--------|
| 5 | **EP-01: Global Search & Command Palette** | Most impactful single feature for all 3 portals. Component already exists. | 1-2 weeks |
| 6 | **EP-02: Trip Readiness Dashboard** | Reduces 17-tab inspection to a single glance. Safety-critical visibility. | 1 week |
| 7 | **EP-07: Breadcrumb Navigation** | Low effort, high orientation value. Critical for deep trip detail pages. | 2-3 days |
| 8 | **EP-09: Mobile Header Improvements** | Page title + notification indicator. Quick win for mobile orientation. | 2 days |
| 9 | **EP-13: Remove "Coming Soon" HQ Items** | Trust repair. Low effort. | 1 day |

### Tier 3: Growth (Weeks 9-16) -- Differentiation & Efficiency

| # | Enhancement | Rationale | Effort |
|---|-------------|-----------|--------|
| 10 | **EP-03: Adaptive Trip Wizard** | Reduces wizard friction. Conditional steps, templates, duplication. | 2-3 weeks |
| 11 | **EP-06: Notification Center** | Persistent alerts with acknowledgment. Essential for safety operations. | 2 weeks |
| 12 | **EP-10: PII Masking & Trust UX** | FERPA/compliance readiness. Role-based field visibility. | 1-2 weeks |
| 13 | **EP-11: Trip Template & Duplication** | Repeat-user efficiency. Schools do the same trips annually. | 1 week |
| 14 | **EP-14: Optimistic Updates** | Perceived performance. Especially for analyst checklist toggling. | 1 week |

### Tier 4: Excellence (Weeks 17+) -- World-Class Experience

| # | Enhancement | Rationale | Effort |
|---|-------------|-----------|--------|
| 15 | **EP-12: Change History & Diff View** | Analyst accountability. Audit trail. | 2-3 weeks |
| 16 | **EP-15: Collaborative Annotations** | Field-level comments, deep links, @mentions. | 3-4 weeks |
| 17 | **Mobile Day-of-Travel View** | Dedicated mobile web route for active travel. | 3-4 weeks |
| 18 | **AI-Assisted Intel Summarization** | Summarize country alerts, draft communications, extract data from uploads. Human-in-the-loop only. | 4+ weeks |

---

## Key Files Referenced in This Analysis

- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/shared/components/layout/app-shell.tsx` -- No skip-nav, no landmarks
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/shared/components/layout/sidebar.tsx` -- Nav structure, collapse, mobile sheet
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/shared/components/layout/mobile-header.tsx` -- Minimal mobile header (27 lines)
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/analyst/components/trip-review/trip-review-shell.tsx` -- `hidden lg:block` on ReviewerPanel (line 56)
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/analyst/components/trip-review/reviewer-panel.tsx` -- Checklist tabs, no mobile fallback
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/client/components/trip-create/flight-form.tsx` -- 8 useState calls (lines 51-65)
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/client/components/trip-create/trip-create-header.tsx` -- Fixed w-40 containers (lines 199, 226)
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/(onboarding)/onboarding/account/page.tsx` -- Manual validation, 6 useState calls
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/(auth)/login/page.tsx` -- Password toggle tabIndex={-1} (line 198)
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/layout.tsx` -- Root layout, no error boundary
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/globals.css` -- Design token system (lines 1-260)
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/types/trip-draft.ts` -- WIZARD_STEPS definition (line 780)
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/(client)/layout.tsx` -- Client nav config, 7+2 items
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/hq/layout.tsx` -- HQ nav config, 11 disabled items
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/analyst/trip-review/[tripId]/layout.tsx` -- Still using mockReviewQueue (line 49)
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/components/ui/command.tsx` -- Exists but unused in production
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/components/shared/error-state.tsx` -- No role="alert"
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/components/shared/loading-state.tsx` -- Generic spinner only