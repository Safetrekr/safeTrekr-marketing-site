# UI Designer Analysis: SafeTrekr

## Platform Scope

| Dimension | Web (safetrekr-app-v2) | Mobile (safetrekr-traveler-native) |
|---|---|---|
| Framework | Next.js 15, App Router | Expo, Expo Router |
| Files | 669 .tsx | 146 .tsx |
| Component count | ~47 primitives + ~190 module | 104 |
| Styling | Tailwind v4, CSS vars | NativeWind + Gluestack + inline StyleSheet |
| Portals/Roles | Client, Analyst, HQ | Traveler, Chaperone, Guardian |
| Token approach | CSS custom properties (60+) | Static hex in tailwind.config.js + 737 inline hex |
| Animation | Anime.js MOTION tokens + 5 CSS keyframes | React Native Animated API (ad hoc) |
| Icons | Lucide React (direct import) | Custom Icon mapping Material Symbols to Lucide |

---

## 1. Feature Documentation

### 1.1 Trip Creation Wizard (Client Portal)

**Description.** A multi-step wizard that guides organization admins through creating a trip, covering 11 discrete steps: type selection, info, flights, lodging, transportation, venues, itinerary, day-by-day planning, participants, addons, and review. The wizard uses a persistent sidebar summary and auto-saves draft state.

**User Stories.**
- As an org admin, I want to create a new group trip by stepping through each data section so that I can submit it for safety review.
- As an org admin, I want to resume a draft trip so I can complete it across sessions.
- As an org admin, I want to bulk-import participants via CSV so I save time on large groups.

**Current State.** Route group at `(client)/trips/new/` with 11 page files. Uses `trip-create-navigation.tsx` for step management, `wizard-step-progress.tsx` for progress indicators, and `trip-summary-sidebar.tsx` for persistent context. CSV upload drawers exist for participants, lodging, venues, and itinerary. The `review-builder.tsx` compiles all sections into a finalize-ready payload.

**Technical Requirements.**
- Components: 41 trip-create components in `modules/client/components/trip-create/`
- State: Zustand store for wizard state, TanStack Query for server persistence
- Forms: React Hook Form + Zod validation per step
- API: Core API `/v1/trips/finalize` endpoint for submission

**UX/UI Considerations.**
- Step progress indicator uses `text-[10px]` for step labels -- below accessibility minimum.
- The itinerary event cards (`itinerary-event-card.tsx`) also use `text-[10px]` for timestamps.
- No keyboard shortcut support for step navigation.
- Long forms (participants, lodging) lack progressive disclosure; all fields visible at once.
- CSV import preview tables lack row-level error indicators for malformed data.

**Data Requirements.** Trip object with nested flights, locations (lodging/venues), itinerary events, participants, guardians, ground transportation legs, addons. Finalize endpoint converts all nested data into normalized Supabase inserts.

**Integration Points.** Core API finalize endpoint, Supabase direct for draft persistence, Stripe for payment on review step, flight lookup API route at `/api/flights/lookup`.

---

### 1.2 Analyst Trip Review Workspace

**Description.** An 18-section review workspace where safety analysts evaluate submitted trips for compliance. Uses a custom 3-column layout (TripReviewShell): left sidebar with numbered/progress-tracked sections, center content, and right panel with a reviewer checklist.

**User Stories.**
- As an analyst, I want to review each section of a trip systematically so I can identify safety gaps.
- As an analyst, I want to flag issues, leave comments, and track my checklist progress per section.
- As an analyst, I want to approve or reject a trip with documented rationale.

**Current State.** Route group at `analyst/trip-review/[tripId]/` with 18 section pages (overview, participants, air-travel, lodging, venues, transportation, itinerary, safety, background-checks, documents, intel-alerts, emergency-preparedness, checklists, evidence, briefings, comms, packet, approval). The `TripReviewShell` replaces the standard `AppShell`. The `TripReviewSidebar` shows section completion progress. The `ReviewerPanel` provides a persistent checklist on the right.

**Technical Requirements.**
- 130+ components in `modules/analyst/components/` organized by section domain
- Section completion tracking via `useSectionCompletion` hook
- Issue flagging via dedicated drawer components per section
- Comments system with `add-comment-form.tsx`, `comment-card.tsx`, `section-comments-list.tsx`
- Approval workflow with prerequisites checklist and history

**UX/UI Considerations.**
- **Critical Layout Issue.** The 3-column layout uses `hidden lg:block` on the right panel and a fixed `w-86` (344px). Combined with the sidebar (~224px), the minimum viewport for full layout is ~1200px. Below that, the right panel disappears entirely with no intermediate state. Analysts on standard 1366px laptops lose content area.
- Multiple components use `text-[10px]` for secondary information.
- The lodging section includes an interactive map that requires mouse interaction with no keyboard alternative.
- Trip details are partially loaded from mock data (`mockReviewQueue`) in the layout.

**Data Requirements.** Review queue entries, section completion state, analyst comments per section, issue records with severity/category, checklist items with checked state, approval records with timestamps and rationale.

**Integration Points.** Supabase `review_queue`, `review_issues`, TanStack Query for all review data.

---

### 1.3 Intel Alerts System

**Description.** Intelligence-driven safety alerts that surface country/region-level risks to analysts and, when routed, to travelers and chaperones on mobile.

**User Stories.**
- As an analyst, I want to triage incoming intel alerts and route them to affected trips.
- As a traveler, I want to receive and acknowledge safety alerts on my mobile device.
- As a chaperone, I want to see all active alerts for my group with severity indicators.

**Current State.**
- *Web*: `modules/analyst/components/intel-alerts/` contains 10 components.
- *Mobile*: `components/alerts/` contains AlertCard, AlertDetailSheet, AlertsHeader, AlertsList, RallyAlertModal.
- *HQ*: Intel triage, config, metrics, policies, and sources pages.

**UX/UI Considerations.**
- Mobile alert cards use hardcoded hex colors for severity, not derived from theme.
- The RallyAlertModal lacks haptic feedback and persistent notification channel integration.
- Analyst intel alerts table lacks keyboard row selection and bulk operations.

**Data Requirements.** `trip_alerts` table with risk percentiles (P5/P50/P95), role-based messaging, geographic scope.

**Integration Points.** TarvaRI AI suggestions, push notifications, SMS broadcast.

---

### 1.4 Safety Infrastructure (Rally Points, Safe Houses, Relocation Points)

**Description.** A comprehensive safety location system where analysts define rally points, safe houses, and relocation points for each trip, surfaced to travelers and chaperones on mobile with mapping, directions, and contextual awareness.

**User Stories.**
- As an analyst, I want to assign rally points near each lodging location.
- As a traveler, I want to see my nearest rally point and get directions.
- As a chaperone, I want to issue a rally command that pushes the designated rally point to all travelers.

**Current State.**
- *Web (Analyst)*: 25+ safety components including create/detail drawers for rally points, safe houses, relocation points.
- *Mobile*: Safety page with ChaperoneSafetyView, DirectGroupWizard (4-step).
- *Client*: Emergency preparedness content with contacts, medical facilities, evacuation plans.

**UX/UI Considerations.**
- Mobile safety map uses hardcoded colors for geofence zones.
- DirectGroupWizard is mission-critical during emergencies but has no offline capability.
- Rally point detail bottom sheet uses hardcoded green instead of theme token.

**Data Requirements.** Locations table, geofence polygons, context-aware rally point selection.

**Integration Points.** Maps (react-native-maps, MapLibre GL), location services, push notifications.

---

### 1.5 Mobile Today View (Role-Based)

**Description.** Primary landing screen with three different views based on role: TravelerTodayView (weather, countdown, rally, schedule), ChaperoneTodayView (group status, muster, broadcast, safety), GuardianTodayView (child status, schedule).

**User Stories.**
- As a traveler, I want to see what is happening today and where to go in an emergency.
- As a chaperone, I want a command center showing group status and safety tools.
- As a guardian, I want to see my child's schedule and safety status.

**Current State.** Three view components. TravelerTodayView (466 lines) with weather API, contextual rally points, live location map, schedule timeline.

**UX/UI Considerations.**
- **Severe token gap.** TravelerTodayView alone contains 30+ hardcoded hex values.
- Mixes three styling approaches: NativeWind, Gluestack, inline styles.
- Loading spinner uses hardcoded color. Weather backgrounds have no dark mode consideration.
- Emergency rally point Pressable lacks accessibility attributes.

**Data Requirements.** Schedule events, rally points, FX rates, weather, live locations, alert stats.

**Integration Points.** Open-meteo weather API, live location tracking, push notifications.

---

### 1.6 Participant Management

**Description.** Full lifecycle management across web (creation, editing, invitation, guardian assignment, compliance) and mobile (onboarding, profile, documents).

**Current State.**
- *Client*: 10+ components for participant management with CSV upload and batch invite.
- *Analyst*: Participants review grid with detail and flag-issue drawers.
- *Mobile*: Full onboarding wizard with 11 steps.

**UX/UI Considerations.**
- Mobile onboarding uses hardcoded colors. Web participants grid uses `text-[10px]` for status cells.
- Guardian assignment workflow lacks clear visual hierarchy.

---

### 1.7 HQ Console

**Description.** Internal admin console for SafeTrekr staff. 25+ pages, 58 components across 8 domains.

**UX/UI Considerations.**
- Organizations and users grids use `text-[10px]` for cell renderers.
- Feature flags page and policy JSON editor could benefit from syntax highlighting and diff views.

---

### 1.8 Packet Builder and Viewer

**Description.** Analysts build trip packets (PDF-ready) distributed to travelers. Mobile users view section-by-section.

**UX/UI Considerations.**
- Mobile packet sections use mixed styling and hardcoded colors.
- No offline caching strategy for packet content.

---

### 1.9 Background Checks (Client)

**Description.** Kanban-style workflow for background check management.

**UX/UI Considerations.**
- Check card uses `text-[10px]`. Kanban drag-and-drop keyboard accessibility not documented.

---

### 1.10 Digest Authoring (Analyst)

**Description.** Analysts author and distribute intelligence digests with markdown editor, preview, distribution tracking.

---

## 2. Enhancement Proposals

### EP-1: Unified Design Token Pipeline (Web + Mobile)

**Problem It Solves.** 737 hardcoded hex colors across 104 mobile components make dark mode maintenance impossible, branding changes expensive, and create visual inconsistency.

**Proposed Solution.**
1. Create `packages/design-tokens/` in the monorepo
2. Define tokens in single JSON source (Design Tokens Community Group format)
3. Build transforms outputting CSS vars, TypeScript theme object, Tailwind config
4. Enforce lint rule flagging raw hex values in .tsx files
5. Migrate mobile components in priority order: safety-critical first

**Impact.** HIGH
**Effort.** 3-4 sprints
**Dependencies.** Token naming convention agreement, styling consolidation decision.

---

### EP-2: Analyst Layout Responsive Breakpoints

**Problem It Solves.** 3-column layout requires 1200px minimum. Standard 1366px laptops get cramped.

**Proposed Solution.**
1. Intermediate breakpoint (xl: 1280px) collapses right panel to slide-over Sheet
2. On lg (1024-1279px), hide sidebar, show as Sheet
3. Floating "Checklist" button for collapsed state

**Impact.** MEDIUM-HIGH
**Effort.** 1 sprint
**Dependencies.** None.

---

### EP-3: Typography Scale Formalization

**Problem It Solves.** No formalized type scale. 32 files use sizes below WCAG AA minimum of 12px.

**Proposed Solution.** Define 1.125 major-second ratio scale. Audit and replace all text-[10px] usages. Add lint rule.

**Impact.** MEDIUM
**Effort.** 1 sprint
**Dependencies.** None.

---

### EP-4: Accessibility Hardening (Skip Links, Live Regions, ARIA)

**Problem It Solves.** Only 4 aria-live regions across 669 web files. No skip-link. 57 aria-labels is low density.

**Proposed Solution.**
1. SkipLink component targeting #main-content
2. aria-live on loading states, toasts, KPI updates, queue changes
3. Focus management for drawer close and wizard navigation
4. ARIA labels on all icon-only buttons

**Impact.** HIGH
**Effort.** 2 sprints
**Dependencies.** None.

---

### EP-5: Mobile Styling Consolidation

**Problem It Solves.** Three competing styling approaches create cognitive overhead.

**Proposed Solution.** Standardize on NativeWind. Use Gluestack for behavior only. Eliminate raw inline styles.

**Impact.** MEDIUM
**Effort.** 3 sprints
**Dependencies.** EP-1 token pipeline.

---

### EP-6: Animation Unification

**Problem It Solves.** CSS keyframes and JS Anime.js operate independently. Mobile has no motion tokens.

**Proposed Solution.** Consolidate into MOTION token system. Create mobile useMotion hook. Document in cheatsheet.

**Impact.** LOW-MEDIUM
**Effort.** 1 sprint
**Dependencies.** EP-1 (ideal).

---

### EP-7: AG-Grid Dark Mode Token Alignment

**Problem It Solves.** AG-Grid dark mode uses hardcoded hex instead of CSS var references.

**Proposed Solution.** Replace all hardcoded hex in `.dark .ag-theme-quartz` with var() references.

**Impact.** LOW
**Effort.** 0.5 sprint
**Dependencies.** None.

---

### EP-8: Component Playground Expansion

**Problem It Solves.** Cheatsheet only covers primitives. Module-specific patterns undocumented.

**Proposed Solution.** Expand with shared components, patterns, tokens visualization, layout sections.

**Impact.** MEDIUM
**Effort.** 1 sprint
**Dependencies.** None.

---

## 3. Risk Assessment

| Risk | Severity | Probability | Impact Area | Mitigation |
|---|---|---|---|---|
| 737 hardcoded hex colors on mobile | CRITICAL | Certain | Maintenance, dark mode | EP-1: Token pipeline |
| 32 files with text below 12px | HIGH | Certain | WCAG compliance | EP-3: Typography scale |
| 4 live regions across 669 files | HIGH | Certain | Screen reader users miss alerts | EP-4: Accessibility |
| Analyst layout breaks at 1200px | HIGH | High | Analyst productivity | EP-2: Responsive breakpoints |
| 3 mixed styling approaches (mobile) | MEDIUM | Certain | Developer velocity | EP-5: Consolidate NativeWind |
| No skip-link component | MEDIUM | Certain | Keyboard navigation | EP-4: Add SkipLink |
| Mock data in trip review layout | HIGH | Certain | Production data display | Wire to real API |
| Rally command UI has no offline mode | HIGH | Medium | Safety-critical unavailable | Add offline queue |

---

## 4. Architecture Recommendations

### 4.1 Token Architecture (Priority 1)
Create `packages/design-tokens/` as single source of truth with JSON definitions and transform scripts outputting CSS vars, NativeWind config, and TypeScript theme objects.

### 4.2 Component Hierarchy Formalization
- Layer 1: Primitives (components/ui/) — 47 shadcn/ui
- Layer 2: Shared Components (components/shared/) — 30+ SafeTrekr-specific
- Layer 3: Shared Layout (shared/components/) — AppShell, Sidebar, DataGrid
- Layer 4: Module Components (modules/{mod}/components/) — Portal-specific

### 4.3 Mobile Architecture Simplification
Consolidate to NativeWind as primary, Gluestack for behavior only, eliminate raw StyleSheet.

### 4.4 Accessibility Architecture
Add a11y layer: skip-link, visually-hidden, live-region, focus-trap, announce components.

---

## 5. Priority Recommendations

### Immediate (Sprint 0-1)
| Item | Type | Effort | Justification |
|---|---|---|---|
| EP-4: Skip link + VisuallyHidden | Accessibility | 2 days | Zero-effort WCAG win |
| EP-3: Replace text-[10px] with text-xs | Accessibility | 3 days | 32 files, mechanical fix |
| EP-7: AG-Grid dark mode var refs | Token hygiene | 2 days | Small scope |
| Wire trip review to real API | Bug fix | 1 day | Remove mock data |

### Short-term (Sprint 2-4)
| Item | Type | Effort | Justification |
|---|---|---|---|
| EP-2: Analyst responsive breakpoints | Layout | 1 sprint | Analyst productivity |
| EP-4: Live regions + focus management | Accessibility | 1 sprint | WCAG compliance |
| EP-1: Token pipeline infrastructure | Architecture | 1 sprint | Foundation for mobile |
| EP-8: Cheatsheet expansion | Developer velocity | 1 sprint | Prevent duplication |

### Medium-term (Sprint 5-8)
| Item | Type | Effort | Justification |
|---|---|---|---|
| EP-1: Mobile token migration | Architecture | 2-3 sprints | 104 components, 737 hex |
| EP-5: Mobile styling consolidation | Architecture | 2-3 sprints | Overlaps with EP-1 |
| EP-6: Animation unification | Polish | 1 sprint | Consistency |

### Key Metrics to Track
| Metric | Current | Target |
|---|---|---|
| Hardcoded hex in mobile | 737 | 0 |
| Files with text < 12px | 32 | 0 |
| aria-live/role regions | 4 | 40+ |
| aria-label density | 57/669 (8.5%) | 200+ (30%+) |
| Mobile styling approaches | 3 | 1 (NativeWind) |
