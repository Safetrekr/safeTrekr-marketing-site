# SafeTrekr Information Architecture Deep Analysis

**Date**: 2026-03-17
**Analyst**: Information Architecture Principal
**Version**: 1.0
**Scope**: Full platform IA -- 3 web portals, 1 mobile app, 138 DB tables, 10 user roles, 292K LOC
**Branch**: wireUp5

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Inventory](#2-system-inventory)
3. [Feature Documentation](#3-feature-documentation)
4. [Enhancement Proposals](#4-enhancement-proposals)
5. [Risk Assessment](#5-risk-assessment)
6. [Architecture Recommendations](#6-architecture-recommendations)
7. [Priority Recommendations](#7-priority-recommendations)

---

## 1. Executive Summary

SafeTrekr is a multi-tenant travel safety platform with 63 identified features distributed across 3 web portals (Client, Analyst, HQ Console), a React Native mobile app, and a FastAPI backend. The platform serves 10 user roles with role-aware navigation across 5 independent sidebar implementations, each with its own type system.

### Critical Findings

| Finding | Severity | Impact |
|---------|----------|--------|
| 6 independent NavItem type definitions with no shared contract | High | Maintenance burden, inconsistency risk, prevents unified navigation service |
| Role type fracture: core-logic defines 3 roles, web app defines 10 as strings | High | Type safety gaps, runtime errors possible, no single source of truth |
| HQ Console: 26 nav items, 14 disabled (54%) | Medium | Perceived incompleteness, visual clutter, undermines user confidence |
| No global search across any portal | High | Users have no alternative to browse navigation; findability bottleneck |
| No breadcrumb system anywhere in platform | Medium | Users lose orientation in deep hierarchies (trip detail has 3+ levels) |
| No cross-portal deep linking | Medium | HQ admin viewing a trip cannot jump to analyst review context |
| Terminology inconsistencies across 5+ label pairs | Medium | Predictability failure; users cannot build stable mental model |
| Trip Detail sidebar: 21 items in 7 groups | Medium | Cognitive overload; exceeds Miller's 7+/-2 for group scanning |
| Analyst 18-section review overlaps but does not align with client 21-item trip detail | Low-Medium | Increases onboarding cost for users who work across portals |
| Mobile navigation is well-designed with progressive disclosure | Positive | Good pattern to replicate on web |

### Quantified IA Health

| Metric | Current State | Target | Gap |
|--------|--------------|--------|-----|
| Navigation models (independent) | 6 | 1 shared + portal configs | -5 |
| NavItem type definitions | 6 | 1 shared type | -5 |
| Role type definitions | 3+ separate | 1 source of truth | -2+ |
| Disabled nav items (HQ) | 14 / 26 (54%) | <20% | -34pp |
| Terminology conflicts | 8 identified pairs | 0 | -8 |
| Global search | 0 | 1 (command palette) | -1 |
| Breadcrumb implementations | 0 | 1 shared system | -1 |
| Cross-portal links | 0 | Contextual deep links | -1 |
| Max navigation depth (clicks) | 5+ (trip > section > subsection) | 3 | -2+ |

---

## 2. System Inventory

### 2.1 Navigation Surfaces

| # | Surface | Location | Items | Type System | Role-Aware |
|---|---------|----------|-------|-------------|------------|
| 1 | Shared Sidebar | `src/shared/components/layout/sidebar.tsx` | Configurable | `NavItem { href, label, icon, disabled?, badge? }` | No (consumer configures) |
| 2 | Client Portal Nav | `src/app/(client)/layout.tsx` | 9 items / 2 groups | Uses shared `NavItem` | Partially (formatRole display) |
| 3 | HQ Console Nav | `src/app/hq/layout.tsx` | 26 items / 6 groups | Uses shared `NavGroup` | No (hardcoded HQ_USER) |
| 4 | Analyst Portal Nav | `src/app/analyst/layout.tsx` | 7 items / 3 groups | Uses shared `NavGroup` | No (hardcoded ANALYST_USER) |
| 5 | Trip Detail Sidebar | `src/modules/client/components/trip-detail/trip-detail-sidebar.tsx` | 21 items / 7 groups | **Own** `NavItem { href, label, icon, comingSoon?, badge? }` | Yes (back-nav by role) |
| 6 | Analyst Review Nav | `src/modules/analyst/constants/review-sections.ts` | 18 sections | **Own** `ReviewSection { id, slug, label, number, icon }` | No |
| 7 | Org Settings Nav | `src/modules/client/components/settings/org-settings-nav.tsx` | 7 items | **Own** `NavItem { id, label, icon, disabled?, badge? }` | No |
| 8 | Mobile BottomNav | `safetrekr-traveler-native/components/layout/BottomNav.tsx` | 3-8 items | **Own** `NavItem { path, icon, label, roles }` | Yes (role filtering) |
| 9 | Mobile PacketHub | `safetrekr-traveler-native/components/pages/packet/PacketHub.tsx` | 8 sections | **Own** `PacketSection { id, title, icon, description, roles, priority }` | Yes (role filtering) |
| 10 | Mobile Settings | `safetrekr-traveler-native/app/(app)/trip/[tripId]/settings/index.tsx` | 6 categories | **Own** `SettingsCategory { id, title, description, icon, roles }` | Yes (role filtering) |
| 11 | Packet Sections (config) | `src/modules/analyst/config/packet-sections.ts` | 10 sections | **Own** `PacketSectionConfig { id, title, icon, description, roleVisibility }` | Yes (role filtering) |

**Key observation**: The mobile app consistently implements role-aware navigation with `roles: UserRole[]` filtering. The web app does not -- it relies on separate portal layouts per role category.

### 2.2 Role System Inventory

| Source | File | Roles Defined | Type |
|--------|------|---------------|------|
| Core Logic (shared package) | `packages/core-logic/src/types/index.ts` | 3: `traveler`, `chaperone`, `guardian` | TypeScript union type |
| Web Auth Provider | `src/shared/auth/auth-provider.tsx` | 10: traveler, chaperone, guardian, org_admin, billing_admin, security_officer, analyst, hq_admin, hq_supervisor, hq_ops | TypeScript union type (local) |
| Client Layout | `src/app/(client)/layout.tsx` | 6 in formatRole() map | Hardcoded Record |
| Trip Detail Sidebar | `trip-detail-sidebar.tsx` | 4 HQ roles in array | Hardcoded string array |
| Auth Routing | `auth-provider.tsx` | 3 categories: HQ_ROLES, ANALYST_ROLE, "others" | Routing logic |
| Mobile BottomNav | `BottomNav.tsx` | 3: traveler, chaperone, guardian | Uses `UserRole` from core-logic |
| Packet Sections | `packet-sections.ts` | 4: traveler, chaperone, guardian, admin | `PacketRole` type |

**Critical gap**: The shared `core-logic` package only defines 3 mobile roles. The web app independently defines all 10 roles with no shared source of truth. This means the mobile and web apps have fundamentally different role type systems.

### 2.3 Route Inventory

#### Client Portal Routes (22 pages)

```
(client)/
  dashboard/                    # Dashboard
  trips/                        # Trip list
  trips/new/                    # Create wizard root
  trips/new/type/               # Step: Trip type selection
  trips/new/info/               # Step: Trip information
  trips/new/participants/       # Step: Participants
  trips/new/flights/            # Step: Flights
  trips/new/lodging/            # Step: Lodging
  trips/new/venues/             # Step: Venues
  trips/new/itinerary/          # Step: Day-by-day (note: route says "itinerary")
  trips/new/transportation/     # Step: Transportation
  trips/new/addons/             # Step: Add-ons
  trips/new/day-by-day/         # Step: Day-by-day (DUPLICATE route name?)
  trips/new/review/             # Step: Review & submit
  intel/                        # Intel Alerts (disabled in nav)
  teams/                        # Teams & Travelers
  background-checks/            # Background Checks
  packets/                      # Packets
  billing/                      # Billing
  help/                         # Help
  settings/                     # Settings root
  settings/organization/        # Org settings
  settings/profile/             # User profile
```

#### Trip Detail Routes (21 pages)

```
(trip-detail)/trips/[tripId]/
  page.tsx                      # Root redirect
  overview/                     # Trip Overview
  participants/                 # Participants
  background-checks/            # Background Checks
  air-travel/                   # Air Travel
  lodging/                      # Lodging
  venues/                       # Venues
  itinerary/                    # Itinerary
  transportation/               # Transportation
  safety-review/                # Safety Review
  emergency-preparedness/       # Emergency Preparedness
  guidance/                     # Guidance
  briefings/                    # Briefings
  digests/                      # Digests
  documents/                    # Documents (hidden from nav)
  packets/                      # Packets
  issues/                       # Issues
  analyst-notes/                # Analyst Notes (coming soon)
  transactions/                 # Transactions
  settings/                     # Trip Settings
  edit/                         # Edit (not in nav)
  payment/                      # Payment (not in nav)
```

#### Analyst Portal Routes (28 pages)

```
analyst/
  dashboard/                    # Dashboard
  queue/                        # Trip Review Queue
  intel-queue/                  # Intel Queue
  digests/                      # Digests list
  digests/[digestId]/           # Digest detail
  roster/                       # All Participants
  calibration/                  # Calibration
  settings/profile/             # Profile settings
  trip-review/[tripId]/         # Review root redirect
  trip-review/[tripId]/overview/
  trip-review/[tripId]/participants/
  trip-review/[tripId]/air-travel/
  trip-review/[tripId]/lodging/
  trip-review/[tripId]/venues/
  trip-review/[tripId]/itinerary/
  trip-review/[tripId]/transportation/
  trip-review/[tripId]/safety/
  trip-review/[tripId]/emergency-preparedness/
  trip-review/[tripId]/documents/
  trip-review/[tripId]/background-checks/
  trip-review/[tripId]/intel-alerts/
  trip-review/[tripId]/issues/
  trip-review/[tripId]/evidence/
  trip-review/[tripId]/checklists/
  trip-review/[tripId]/packet/
  trip-review/[tripId]/briefings/
  trip-review/[tripId]/comms/
  trip-review/[tripId]/approval/
```

#### HQ Console Routes (26 pages)

```
hq/
  page.tsx                      # Root redirect
  overview/                     # Overview
  organizations/                # Organizations
  trips/                        # Trips
  users/                        # Users
  checklists/                   # Checklists
  finance/                      # Finance
  payments/                     # Payments (NOT in nav)
  queues/                       # Queue Management
  guardian-overrides/            # Guardian Governance
  policies/                     # Policies
  flags/                        # Feature Flags
  integrations/                 # Integrations (disabled)
  security/                     # Security (disabled)
  intel-sources/                # Intel Sources (disabled)
  intel-triage/                 # Intel Triage (disabled)
  intel-policies/               # Intel Policies (disabled)
  intel-metrics/                # Intel Metrics (disabled)
  intel-config/                 # System Config (disabled)
  audit/                        # Audit Logs (disabled)
  communications/               # Communications (disabled)
  incidents/                    # Incidents (disabled)
  testing/                      # Testing (disabled)
  status/                       # System Status (disabled)
  settings/                     # Settings (disabled)
  settings/profile/             # Profile
```

#### Mobile Routes

```
(app)/trip/[tripId]/
  index.tsx                     # Today (role-specific view)
  schedule.tsx                  # Schedule
  packet.tsx                    # Packet (traveler, guardian only)
  map.tsx                       # Map (chaperone only)
  checkins/                     # Check-ins (chaperone only)
  settings/                     # Settings hub
  settings/profile              # Profile
  settings/notifications        # Notifications
  settings/location             # Location (not guardian)
  settings/privacy              # Privacy
  settings/appearance           # Appearance
  settings/about                # About
  onboarding/                   # Onboarding wizard (hidden)
  documents/                    # Document vault (hidden)
  packet/emergency              # Emergency contacts
  packet/briefings              # Trip briefings
  packet/safety                 # Safety info
  packet/participants           # Participants
  packet/air-travel             # Air travel
  packet/lodging                # Lodging
  packet/venues                 # Venues & activities
  packet/transportation         # Transportation
```

### 2.4 Terminology Conflict Map

| Concept | Client Sidebar | Trip Detail | Analyst Review | Mobile | Packet Config | Recommendation |
|---------|---------------|-------------|----------------|--------|---------------|----------------|
| Flight management | -- | "Air Travel" | "Air Travel" | "Air Travel" | "Air Travel" | **Air Travel** (consistent) |
| People roster | "Teams & Travelers" | "Participants" | "Participants" / "All Participants" | "Participants" | "Participants" | **Participants** |
| Safety compliance | -- | "Safety Review" | "Safety" | "Safety Information" | "Safety & Emergency" | **Safety Review** |
| Trip packet | "Packets" | "Packets" | "Packet Builder" | "Trip Packet" | -- | **Trip Packet** |
| Threat intelligence | "Intel Alerts" (disabled) | -- | "Intel Queue" / "Intel Alerts" (review) | "Alerts" | -- | **Intel Alerts** |
| Emergency info | -- | "Emergency Preparedness" | "Emergency Prep" | "Emergency Contacts" | -- | **Emergency Preparedness** |
| Cultural guidance | -- | "Guidance" | -- | -- | "Do's & Don'ts" | **Guidance** |
| Daily summaries | -- | "Digests" | "Digests" | -- | -- | **Digests** (consistent) |

---

## 3. Feature Documentation

### Domain A: Navigation & Wayfinding

---

#### F01: Shared Sidebar Component

**Description**: A reusable sidebar component providing desktop (collapsible) and mobile (sheet overlay) navigation. Accepts configurable NavItem arrays, supports grouped navigation with section labels, badges, and disabled states.

**User Stories**:
- As a user on any portal, I can navigate between sections using the sidebar
- As a user, I can collapse the sidebar to gain more screen real estate
- As a mobile user, I can access navigation via a slide-out sheet
- As a user, I can see which section I'm currently in via active state highlighting

**Current State**:
- Located at `/src/shared/components/layout/sidebar.tsx`
- Supports `NavItem | NavGroup` union with type guard `isNavGroup()`
- Active state detection uses pathname prefix matching
- Disabled items render with `cursor-not-allowed` and "(Coming Soon)" label
- Badge support for numeric counts (capped at 99+)
- Collapse state managed via `useUIStore` (Zustand)
- Mobile uses `Sheet` component from shadcn/ui
- Footer includes user info, theme toggle, collapse button, and sign out

**Technical Requirements**:
- React client component with Next.js `usePathname` for active state
- Zustand store for collapse/mobile state persistence
- CSS transition for width animation (300ms)
- `280px` expanded, `16` (w-16 = 64px) collapsed

**UX/UI Observations**:
- No keyboard shortcut to toggle sidebar
- No scroll indicator when nav overflows
- Collapsed state loses group labels entirely -- users lose wayfinding context
- No `<nav>` landmark aria-label to distinguish from other nav elements
- No skip link to bypass sidebar navigation

**Data Requirements**: None (stateless -- receives config via props)

**Integration Points**: Used by `AppShell` which wraps all three portal layouts

---

#### F02: Client Portal Navigation

**Description**: Top-level navigation for organization administrators, billing admins, and security officers. Provides access to dashboard, trips, teams, background checks, packets, billing, help, and settings.

**User Stories**:
- As an org admin, I can navigate to my dashboard, manage trips, view teams, and configure settings
- As a billing admin, I can access billing and trip management
- As a security officer, I can access background checks and safety features

**Current State**:
- Defined in `src/app/(client)/layout.tsx` as `CLIENT_NAV` constant
- 9 items in 2 groups (7 main + 2 support)
- 1 disabled item: "Intel Alerts"
- Role display via `formatRole()` -- maps 6 roles to display labels (misses 4 roles)
- Org name fetched via TanStack Query with 30min stale time

**Technical Requirements**:
- TanStack Query for org name fetch
- `useAuth()` hook for user/role data
- `getSupabaseOrganizationsApi()` for org data

**UX/UI Observations**:
- **"Teams & Travelers" label is confusing** -- elsewhere it's "Participants". This label conflates org-level team management with trip participant management.
- **No visual distinction between role capabilities** -- an org_admin and billing_admin see the same nav, but billing_admin may not have permissions for all items.
- **Help routes to `/help`** which is inside the `(help)` route group with its own layout -- user leaves the client portal shell.
- **"Packets" at org level is ambiguous** -- is this all packets across all trips? The trip-level packets page exists separately.

**Data Requirements**:
- Organization record (name display)
- User record (name, email, role)

**Integration Points**: `AppShell` wrapper, auth provider, Supabase organizations API

---

#### F03: HQ Console Navigation

**Description**: Internal operations console navigation for SafeTrekr platform staff. Provides access to organization management, trip oversight, user management, queue management, policy configuration, intelligence system, monitoring, and system administration.

**User Stories**:
- As an HQ admin, I can manage all organizations, users, and trips on the platform
- As an HQ supervisor, I can oversee analyst queues and review quality
- As an HQ ops user, I can monitor system status and manage communications

**Current State**:
- Defined in `src/app/hq/layout.tsx` as `HQ_NAV` constant
- **26 items** in 6 labeled groups:
  - (unlabeled): Overview (1 active)
  - Management: 7 items (all active)
  - Configuration: 4 items (2 active, 2 disabled)
  - Intelligence: 5 items (**all disabled**)
  - Monitoring: 3 items (**all disabled**)
  - System: 3 items (**all disabled**)
- **14 of 26 items disabled (54%)**
- Hardcoded `HQ_USER = { name: 'HQ Admin', role: 'Platform Administrator' }` -- does not use actual authenticated user data
- `/hq/payments` page exists but has NO nav entry

**Technical Requirements**:
- Static nav configuration (no dynamic items)
- All HQ roles see identical navigation

**UX/UI Observations**:
- **54% disabled items creates a "ghost town" effect** -- undermines platform credibility for internal users
- **All Intelligence, Monitoring, and System groups are entirely disabled** -- these three groups should be hidden entirely until at least one item is active
- **Hardcoded user display is a bug** -- should show actual authenticated user name and role
- **No differentiation between HQ roles** -- hq_admin, hq_supervisor, hq_security, and hq_ops all see the same 26 items, but their permissions likely differ
- **"Guardian Governance" label** -- may confuse HQ staff. Consider "Guardian Overrides" (matches the route `guardian-overrides`)
- **Payments page is unreachable via navigation** -- either needs a nav entry or should be a sub-route of Finance

**Data Requirements**:
- Should fetch actual authenticated user data (currently hardcoded)

**Integration Points**: Auth provider (should use, currently bypasses)

---

#### F04: Analyst Portal Navigation

**Description**: Navigation for safety analysts who review and approve trips. Provides access to dashboard, review queue, intel queue, digests, participant roster, and calibration analytics.

**User Stories**:
- As an analyst, I can see my pending review queue and active assignments
- As an analyst, I can access intelligence triage queue
- As an analyst, I can view pending digests with unread badge count
- As an analyst, I can access calibration tools to assess review quality

**Current State**:
- Defined in `src/app/analyst/layout.tsx` as `analystNav` (dynamic, not const)
- 7 items in 3 groups (1 + 4 + 1)
- No disabled items
- Dynamic badge count for digests via `useDigestPendingCount()` hook
- **Trip review pages bypass AppShell** -- `isTripReview` check returns children without wrapper
- Hardcoded `ANALYST_USER = { name: 'Safety Analyst', role: 'Trip Reviewer' }` -- same hardcoded user bug as HQ

**Technical Requirements**:
- Dynamic badge count via TanStack Query hook
- Conditional layout bypass for trip review workspace (3-column layout)

**UX/UI Observations**:
- **"All Participants" label in roster** -- inconsistent with "Participants" everywhere else. This is a cross-trip participant view, so "Participant Roster" or "All Participants" works but should be standardized.
- **Hardcoded user display should show actual analyst name**
- **Layout bypass is architecturally clean** -- good pattern for the 3-column review workspace
- **No "My Assignments" vs "Unassigned" distinction** in queue nav -- analyst has to determine assignment status after clicking

**Data Requirements**:
- Digest pending count (real-time)
- User data (should be real, currently hardcoded)

**Integration Points**: Digest hook, auth provider (should use)

---

#### F05: Trip Detail Navigation

**Description**: Contextual sidebar for managing a specific trip. Shows trip name, dates, section progress, and provides navigation across 21 sections grouped into 7 categories: overview, people, logistics, safety, deliverables, review, and admin.

**User Stories**:
- As an org admin, I can navigate all aspects of a specific trip
- As a user, I can see trip completion progress in the sidebar
- As an HQ admin viewing a client's trip, I get contextual back-navigation to HQ Trips
- As an analyst viewing a trip, I get back-navigation to the review queue

**Current State**:
- Located at `src/modules/client/components/trip-detail/trip-detail-sidebar.tsx`
- **21 items in 7 groups** (1 standalone + 6 labeled groups)
- **Defines its own NavItem and NavGroup types** (duplicates shared sidebar types)
- **Duplicates NavLink and NavGroupSection components** from shared sidebar
- Role-aware back navigation: HQ roles -> `/hq/trips`, analyst -> `/analyst/queue`, others -> `/trips`
- `TripSectionProgress` component shows completion bar
- 1 "coming soon" item: "Analyst Notes"
- Badge support on Issues and Digests
- Pages exist but hidden from nav: documents, edit, payment

**Technical Requirements**:
- `useAuth()` for role-based back navigation
- `useUIStore()` for collapse/mobile state
- Dynamic nav generation via `getTripDetailNavItems(tripId, issueCount, digestCount)`

**UX/UI Observations**:
- **21 items exceeds cognitive load threshold** -- even with 7 groups, users must scan 7 group labels + understand which items are in each. This is the platform's most complex navigation surface.
- **Code duplication is severe** -- `NavLink`, `NavGroupSection`, `NavItem` type, `NavGroup` type, and `isNavGroup` guard are ALL duplicated from the shared sidebar. The trip detail sidebar reimplements ~200 lines of shared sidebar logic with minor differences (`comingSoon` vs `disabled`).
- **"Analyst Notes" as coming soon** -- this suggests analyst-client communication happens in issues; the coming soon item should be either built or removed
- **7 groups is 2-3 too many** -- "Deliverables" has only 1 item (Packets). "Review" has 2 items (1 coming soon). These could be merged.
- **No trip status indicator** in sidebar -- user doesn't know if trip is draft, active, or completed
- **Safety group has 5 items** -- Safety Review, Emergency Preparedness, Guidance, Briefings, Digests. "Digests" arguably belongs in a communication group, not safety.

**Data Requirements**:
- Trip detail (name, dates) via parent layout
- Issue unread count
- Digest unread count
- User role for back-navigation

**Integration Points**: Auth store, UI store, parent layout data

---

#### F06: Analyst Trip Review Navigation

**Description**: 18-section sequential review workflow sidebar for analysts reviewing a trip. Includes progress tracking with completion checkmarks and a 3-column layout (nav, content, reviewer panel).

**User Stories**:
- As an analyst, I can work through 18 review sections sequentially
- As an analyst, I can see which sections I've completed
- As an analyst, I can jump to any section non-linearly
- As an analyst, I can see the reviewer checklist panel alongside my work

**Current State**:
- Sections defined in `src/modules/analyst/constants/review-sections.ts`
- Navigation component at `src/modules/analyst/components/trip-review/section-navigation.tsx`
- Shell at `src/modules/analyst/components/trip-review/trip-review-shell.tsx`
- **18 sections**: Overview, Participants, Air Travel, Lodging, Venues, Itinerary, Transportation, Safety, Emergency Prep, Documents, Background Checks, Intel Alerts, Issues, Evidence & Activity, Checklists, Packet Builder, Comms Log, Approval
- URL-based routing (not Zustand state -- good pattern)
- Completion tracking via `useSectionCompletion` hook
- 3-column layout: left nav (sections), center (content), right (reviewer panel + checklist)

**Technical Requirements**:
- `ReviewSection` type with id, slug, label, number, icon
- URL-derived active section (pathname parsing)
- Section completion set tracking
- `ScrollArea` for section list overflow

**UX/UI Observations**:
- **18 sections is a significant workflow** -- progress indicator ("X of 18") is essential and present
- **No section grouping** -- unlike trip detail's 7 groups, the 18 sections are a flat list. This makes it harder to quickly find a section by scanning group labels.
- **"Emergency Prep" truncates "Emergency Preparedness"** -- the client portal uses the full name; this inconsistency may confuse analysts who also view client trips
- **No estimated time per section** -- analysts have no sense of which sections require more effort
- **"Evidence & Activity" is unique to analyst** -- no client-side equivalent, which is correct (analyst-only workflow)
- **Right panel (reviewer checklist) is hidden on mobile** -- this is pragmatic but means mobile review is limited

**Data Requirements**:
- Section completion state per trip
- Trip metadata (name, dates)
- Issue count (for badge)

**Integration Points**: Section completion hooks, trip data queries

---

#### F07: Mobile Bottom Navigation

**Description**: Role-aware bottom navigation bar for the React Native mobile app. Features a collapsed state (2-3 primary items + More) that expands into a full grid of 8 items. Includes a floating Help/SOS button.

**User Stories**:
- As a traveler, I can quickly access Today and Schedule
- As a chaperone, I can quickly access Today, Schedule, and Safety tools
- As any mobile user, I can expand to see all available sections
- As any mobile user, I can access Help/SOS with one tap

**Current State**:
- Located at `safetrekr-traveler-native/components/layout/BottomNav.tsx`
- **Collapsed**: 2-3 items + More button (role-filtered)
  - Traveler/Guardian: Today, Schedule, More
  - Chaperone: Today, Schedule, Safety, More
- **Expanded drawer**: 8 items in 4-per-row grid (Today, Schedule, Safety, Packet, Alerts, Check-ins, Help, Settings)
- Animated expansion with spring physics
- Backdrop overlay when expanded
- Floating Help/SOS button (red, always visible)
- Unread alert badge on Alerts item
- **NavItem type**: `{ path, icon, label, roles: UserRole[] }` -- role-aware by design

**Technical Requirements**:
- `Animated.spring` for expansion animation
- `useSafeAreaInsets` for bottom positioning
- `useAlertStats` hook for unread badge
- Role filtering via `UserRole[]` on each item

**UX/UI Observations**:
- **Excellent progressive disclosure pattern** -- collapsed shows 2-3 most important items, expanded reveals all
- **Help/SOS as persistent floating button is safety-appropriate** -- always accessible, visually distinct (red)
- **Role-aware filtering is clean** -- single `roles` array per item, filtered at render
- **"More" metaphor is well-understood** on mobile
- **Grid layout in expanded state is scannable** -- 4 columns is appropriate for mobile width

**Data Requirements**:
- Current user role
- Alert unread count
- Current trip ID (for routing)

**Integration Points**: Auth provider (role), alert stats hook, Expo Router

---

### Domain B: Trip Lifecycle

---

#### F12-F16: Trip Creation & Management

**Description**: Multi-step trip creation wizard (7+ steps), trip type selection (T1 day / T2 domestic overnight / T3 international), overview management, status workflow, and summary dashboard.

**User Stories**:
- As an org admin, I can create a new trip by selecting type and stepping through a wizard
- As an org admin, I can edit trip details after creation
- As an org admin, I can view a summary dashboard for any trip
- As an org admin, I can see trip status (draft, active, in_progress, completed)

**Current State**:
- Trip creation wizard at `(client)/trips/new/` with steps: type, info, participants, flights, lodging, venues, itinerary/day-by-day, transportation, addons, review
- `TripCreateNavigation` component provides Previous/Continue buttons
- Trip detail overview at `(trip-detail)/trips/[tripId]/overview/`
- Trip summary content with sub-cards: itinerary, lodging, participants, safety status, flights, transportation
- Trip edit via dedicated `/edit` route (not in sidebar nav)
- Trip status workflow: draft -> active -> in_progress -> completed

**Technical Requirements**:
- Multi-step wizard state management (likely Zustand or URL-based)
- Trip finalization via Core API `/v1/trips/finalize`
- Supabase persistence with org-scoped RLS

**UX/UI Observations**:
- **Wizard step names have inconsistencies**: route says "itinerary" but sidebar says "Day-by-Day". Two routes exist: `/trips/new/itinerary/` AND `/trips/new/day-by-day/` -- one may be stale
- **No wizard progress indicator visible** in navigation component (only prev/next buttons)
- **Edit route is hidden from sidebar nav** -- how do users access it? Likely via a button on the overview page, but this is a findability concern
- **Payment route exists but is not in sidebar nav** -- similar hidden-route concern

**Data Requirements**:
- Trip record with all logistics data
- Participant records
- Location records (lodging, venues)
- Flight records
- Transportation records

**Integration Points**: Core API finalize endpoint, Supabase trip tables, Stripe (payment)

---

### Domain C: Safety & Intelligence

---

#### F27-F35: Safety & Intelligence Features

**Description**: The platform's primary differentiator -- an intelligence pipeline (TarvaRI) that ingests data from authoritative sources, scores risks using Monte Carlo simulation, generates alerts, and provides comprehensive safety management including rally points, safe houses, emergency preparedness, and cultural guidance.

**Feature Inventory**:

| Feature | Client View | Analyst View | Mobile View | HQ View |
|---------|-------------|--------------|-------------|---------|
| TarvaRI Pipeline | -- | Intel Queue | -- | Intel Sources/Triage/Policies/Metrics/Config (all disabled) |
| Risk Scoring | -- (no frontend) | -- (no frontend) | -- | -- |
| Intel Alerts | "Intel Alerts" (disabled) | "Intel Alerts" (review section) | "Alerts" tab | -- |
| Safety Review | Trip > Safety Review | Section 8: Safety | -- | -- |
| Emergency Prep | Trip > Emergency Preparedness | Section 9: Emergency Prep | Packet > Emergency Contacts | -- |
| Rally Points | Trip > Emergency Prep (sub) | Section 8: Safety | Map tab (chaperone) | -- |
| Safe Houses | Trip > Emergency Prep (sub) | Section 8: Safety | Map tab (chaperone) | -- |
| Guidance | Trip > Guidance | -- | Packet > Safety Info | -- |
| Geofencing | -- | -- | Background provider | -- |

**Current State Issues**:
1. **Risk scoring has NO frontend** -- backend Monte Carlo engine is production-ready but invisible to all users
2. **Intel Alerts is disabled in client portal** -- the feature exists but is not surfaced
3. **All 5 HQ Intelligence items are disabled** -- the TarvaRI pipeline is managed but HQ cannot configure it via UI
4. **"Safety Review" (client) vs "Safety" (analyst)** -- terminology mismatch
5. **Emergency Preparedness is split differently per surface** -- client has full section, analyst has abbreviated "Emergency Prep", mobile has "Emergency Contacts" (subset)

**User Stories**:
- As an org admin, I want to see safety alerts relevant to my trip destinations
- As an analyst, I want to review intel alerts and determine their relevance
- As a traveler, I want to see emergency contacts and rally point locations
- As a chaperone, I want to manage rally points and track participants on a map
- As an HQ admin, I want to configure the intelligence pipeline and monitor its health

**Data Requirements**:
- `trip_alerts` table with risk percentiles (P5/P50/P95)
- `traveler_alert_acknowledgments` for tracking
- Protection locations (rally points, safe houses)
- Emergency contact records
- TarvaRI pipeline status and source health

**Integration Points**: TarvaRI microservice, Core API, Supabase RLS, push notifications

---

### Domain D: People & Roster

---

#### F22-F26: People Management Features

**Description**: Participant management across the trip lifecycle -- from org-level team rosters to trip-specific participant lists, background check integration, guardian oversight, and the invite/onboarding funnel.

**Terminology Problem Summary**:

| Surface | Label Used | Actual Content |
|---------|-----------|----------------|
| Client sidebar | "Teams & Travelers" | Org-level roster of all people |
| Trip detail sidebar | "Participants" | Trip-specific participant list |
| Analyst sidebar | "All Participants" | Cross-trip participant roster |
| Analyst review | "Participants" | Trip-specific participants (review context) |
| Mobile packet | "Participants" | Trip-specific roster for travelers |
| Packet config | "Participants" | Trip roster for packet generation |

**Recommendation**: Standardize to "Participants" for trip-scoped views, "People" or "Roster" for org-level/cross-trip views. "Teams & Travelers" is the most problematic label because it implies two separate concepts.

**Current State**:
- Client org-level: `/teams` page with AG-Grid data table
- Trip detail: `/trips/[tripId]/participants` with stats grid, add/edit drawers, guardian assignment
- Analyst review: Section 2 in review workflow
- Background checks: Separate page at client level AND trip detail level, plus analyst review section 11
- Guardian governance: HQ-level at `/hq/guardian-overrides`
- Invite system: Core API generation + consumption, email delivery, onboarding wizard (9 steps)

**Data Requirements**:
- `trip_participants` table with role, emergency contacts, medical info
- `users` table with profile data
- `background_checks` table with provider integration
- `guardians` table with consent tracking
- `pending_invites` table with send status

---

### Domain E: Review & Approval

---

#### F36-F42: Analyst Review Workflow

**Description**: The professional safety review system where trained analysts evaluate trips across 18 sections, create issues, track evidence, complete checklists, build packets, and issue final approval.

**User Stories**:
- As an analyst, I can pick up trips from the review queue based on priority scoring
- As an analyst, I can work through 18 review sections, marking each as complete
- As an analyst, I can create issues that the org admin must resolve
- As an analyst, I can track evidence and activity for compliance documentation
- As an analyst, I can build and customize the trip packet
- As an analyst, I can issue final approval or request changes

**Current State**:
- Review queue at `/analyst/queue` with priority scoring (0-100)
- 18-section review workspace with 3-column layout
- Section completion tracking with visual progress bar
- Issue creation and management (shared with client via `/trips/[tripId]/issues`)
- Checklist engine with per-section items
- Packet builder (section 16)
- Approval workflow (section 18)
- Calibration analytics at `/analyst/calibration`
- Comms log (section 17) for communication audit trail
- Reviewer panel (right sidebar) with per-section checklist

**Section-to-Client Mapping**:

| Analyst Section | Client Trip Detail Page | Overlap Type |
|----------------|------------------------|--------------|
| 1. Overview | Trip Overview | Same data, different perspective |
| 2. Participants | Participants | Same data, analyst validates |
| 3. Air Travel | Air Travel | Same data, analyst validates |
| 4. Lodging | Lodging | Same data, analyst validates |
| 5. Venues | Venues | Same data, analyst validates |
| 6. Itinerary | Itinerary | Same data, analyst validates |
| 7. Transportation | Transportation | Same data, analyst validates |
| 8. Safety | Safety Review | Same concept, different label |
| 9. Emergency Prep | Emergency Preparedness | Same concept, truncated label |
| 10. Documents | Documents (hidden in nav) | Analyst-managed, client hidden |
| 11. Background Checks | Background Checks | Same data, analyst validates |
| 12. Intel Alerts | -- (disabled) | Analyst-only |
| 13. Issues | Issues | Shared entity, two-way |
| 14. Evidence & Activity | -- | Analyst-only |
| 15. Checklists | -- | Analyst-only |
| 16. Packet Builder | Packets | Analyst builds, client views |
| 17. Comms Log | -- (Analyst Notes coming soon) | Analyst-initiated |
| 18. Approval | -- | Analyst-only |

**Technical Requirements**:
- `review_queue` table with priority scoring
- `review_issues` table for bi-directional issue tracking
- Checklist progress tracking per section per trip
- Section completion state per analyst per trip
- Comment/note threading
- Evidence file storage

**UX/UI Observations**:
- **18 flat sections without grouping** is harder to scan than the client's 7 groups
- **Analyst should see the same grouping as client** to reduce cognitive switching when discussing trips with org admins
- **"Packet Builder" is section 16 of 18** -- but packet generation is a deliverable that depends on all previous sections being complete. Position is correct (near end), but the label could better indicate this dependency.
- **Approval as final section is correct** -- creates a natural workflow conclusion

---

### Domain F: Communication & Delivery

---

#### F43-F49: Communication Features

| Feature | Description | Current Surface | Status |
|---------|-------------|-----------------|--------|
| Trip Packets | Comprehensive trip info packets with role-based section visibility | Client trip detail, analyst review (builder), mobile (PacketHub) | Active |
| Briefings | Pre-trip and daily briefing content | Client trip detail, analyst review, mobile packet | Active |
| Digests | Intelligence digests with read tracking | Client trip detail, analyst main nav, analyst review | Active (with badges) |
| SMS Broadcast | Emergency messaging to all participants | Mobile (chaperone) | Active |
| Comms Log | Audit trail of all communications | Analyst review section 17 | Active |
| Analyst Notes | Analyst-to-client communication | Client trip detail (coming soon) | Not built |
| Push Notifications | Real-time alerts via device push | Mobile (NotificationProvider) | Active |

**Key Observation**: The communication features are scattered across surfaces without a unified "Communications" concept. The HQ "Communications" page is disabled. There is no place where an HQ admin can see ALL communications across all trips.

---

### Domain G: Platform Administration (HQ Console)

---

#### F50-F58: HQ Console Features

**Active Features** (12):

| Feature | Route | Nav Label | Description |
|---------|-------|-----------|-------------|
| Overview | `/hq/overview` | Overview | Platform dashboard with KPIs |
| Organizations | `/hq/organizations` | Organizations | CRUD for client organizations |
| Trips | `/hq/trips` | Trips | Cross-org trip oversight |
| Users | `/hq/users` | Users | Platform user management |
| Checklists | `/hq/checklists` | Checklists | Checklist template management |
| Finance | `/hq/finance` | Finance | Financial overview |
| Payments | `/hq/payments` | -- (NOT IN NAV) | Payment records |
| Queue Mgmt | `/hq/queues` | Queue Management | Analyst queue configuration |
| Guardian Gov | `/hq/guardian-overrides` | Guardian Governance | Guardian override management |
| Policies | `/hq/policies` | Policies | Platform policy configuration |
| Feature Flags | `/hq/flags` | Feature Flags | Feature flag management |
| Profile | `/hq/settings/profile` | -- (via user click) | HQ user profile |

**Disabled Features** (14):

| Feature | Route | Nav Label | Group | Notes |
|---------|-------|-----------|-------|-------|
| Integrations | `/hq/integrations` | Integrations | Configuration | Page exists as stub |
| Security | `/hq/security` | Security | Configuration | Page exists as stub |
| Intel Sources | `/hq/intel-sources` | Intel Sources | Intelligence | Page exists as stub |
| Intel Triage | `/hq/intel-triage` | Intel Triage | Intelligence | Page exists as stub |
| Intel Policies | `/hq/intel-policies` | Intel Policies | Intelligence | Page exists as stub |
| Intel Metrics | `/hq/intel-metrics` | Intel Metrics | Intelligence | Page exists as stub |
| System Config | `/hq/intel-config` | System Config | Intelligence | Page exists as stub |
| Audit Logs | `/hq/audit` | Audit Logs | Monitoring | Page exists as stub |
| Communications | `/hq/communications` | Communications | Monitoring | Page exists as stub |
| Incidents | `/hq/incidents` | Incidents | Monitoring | Page exists as stub |
| Testing | `/hq/testing` | Testing | System | Page exists as stub |
| System Status | `/hq/status` | System Status | System | Page exists as stub |
| Settings | `/hq/settings` | Settings | System | Page exists as stub |

**Critical Issue**: `/hq/payments` page exists and is built but has NO navigation entry. Users can only reach it if they know the URL.

---

### Domain H: Settings & Configuration

---

#### F59-F63: Settings Features

| Feature | Surface | Items | Role-Aware |
|---------|---------|-------|------------|
| Org Settings | Client `/settings/organization` | 7 sections (4 active, 3 disabled) | No |
| User Profile (Client) | Client `/settings/profile` | Profile editor | No |
| User Profile (Analyst) | Analyst `/analyst/settings/profile` | Profile editor | No |
| User Profile (HQ) | HQ `/hq/settings/profile` | Profile editor | No |
| Trip Settings | Trip Detail `/trips/[tripId]/settings` | Trip-specific config | No |
| Mobile Settings | Mobile hub with 6 categories | Profile, Notifications, Location, Privacy, Appearance, About | Yes (Location hidden for guardian) |

**Observation**: Three separate profile pages exist for three portals (`/settings/profile`, `/analyst/settings/profile`, `/hq/settings/profile`). These likely share significant UI but are implemented as separate routes. A single profile page with portal-aware back navigation would reduce duplication.

---

## 4. Enhancement Proposals

### EP-01: Unified Navigation Type System

**Problem**: 6 independent NavItem type definitions exist across the codebase, each with slightly different shapes (`href` vs `path` vs `id`, `disabled` vs `comingSoon`, `badge` vs none). This creates maintenance burden, prevents building a shared navigation service, and ensures inconsistency as the product evolves.

**Solution**: Create a single canonical `NavigationItem` type in the shared layer that all surfaces consume.

```typescript
// src/shared/types/navigation.ts

export interface NavigationItem {
  /** Unique identifier (used for key and matching) */
  id: string;
  /** Route path for navigation */
  href: string;
  /** Display label */
  label: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Whether this item is currently disabled */
  disabled?: boolean;
  /** Reason for being disabled (shown in tooltip) */
  disabledReason?: string;
  /** Badge count (null/undefined/0 = hidden) */
  badge?: number | null;
  /** Roles that can see this item (empty = all roles) */
  visibleToRoles?: UserRole[];
  /** Sort order within group */
  order?: number;
}

export interface NavigationGroup {
  /** Group identifier */
  id: string;
  /** Group label (displayed as section header) */
  label?: string;
  /** Items within this group */
  items: NavigationItem[];
  /** Sort order among groups */
  order?: number;
}

export type NavigationConfig = NavigationGroup[];
```

**Impact**: High -- enables unified navigation service, role-aware filtering, and consistent rendering across all surfaces.

**Effort**: Medium (3-5 days) -- requires updating 6 type definitions and 5 sidebar consumers.

**Dependencies**: Must align with EP-02 (unified role type system) for `visibleToRoles`.

---

### EP-02: Unified Role Type System

**Problem**: The `core-logic` shared package defines only 3 mobile roles (`traveler | chaperone | guardian`). The web app independently defines 10 roles as a local TypeScript union type. This means the mobile and web apps have fundamentally incompatible role type systems, and role-aware features like `visibleToRoles` cannot be shared.

**Solution**: Extend the `core-logic` package to be the single source of truth for ALL roles.

```typescript
// packages/core-logic/src/types/roles.ts

/** Roles for trip participants (mobile + web) */
export type TripRole = 'traveler' | 'chaperone' | 'guardian';

/** Roles for organization staff (web only) */
export type OrgRole = 'org_admin' | 'billing_admin' | 'security_officer';

/** Roles for platform staff (web only) */
export type PlatformRole = 'analyst' | 'hq_admin' | 'hq_supervisor' | 'hq_security' | 'hq_ops';

/** All possible user roles */
export type UserRole = TripRole | OrgRole | PlatformRole;

/** Role category for portal routing */
export type RoleCategory = 'trip' | 'org' | 'platform';

/** Get the category for a role */
export function getRoleCategory(role: UserRole): RoleCategory { ... }

/** Get the default portal path for a role */
export function getDefaultPortalPath(role: UserRole): string { ... }

/** Human-readable role label */
export function getRoleLabel(role: UserRole): string { ... }
```

**Impact**: High -- eliminates role type drift, enables type-safe role-aware navigation, provides shared role utilities.

**Effort**: Medium (2-3 days) -- update core-logic, update web auth-provider import, update mobile imports, verify no breaking changes.

**Dependencies**: None. This is a foundational change that EP-01, EP-03, and EP-09 depend on.

---

### EP-03: Global Search (Command Palette)

**Problem**: No search functionality exists anywhere in the platform. Users have NO alternative to browsing navigation to find features, trips, organizations, participants, or settings. With 63+ features across 97 routes, this is a critical findability gap. Power users (HQ admins managing hundreds of orgs, analysts reviewing dozens of trips) have no way to quickly navigate.

**Solution**: Implement a Command Palette (Cmd+K / Ctrl+K) accessible from every portal.

**Scope**:
- **Phase 1**: Navigation search -- search across all nav items, routes, and feature names
- **Phase 2**: Entity search -- search trips by name, orgs by name, participants by name
- **Phase 3**: Action search -- "Create trip", "Assign analyst", "View queue"

**Technical Approach**:
- Use `cmdk` library (React command menu) or build on shadcn `CommandDialog`
- Index all NavigationItem labels and aliases
- Keyboard shortcut: `Cmd+K` (Mac) / `Ctrl+K` (Windows)
- Results grouped by category: Navigation, Trips, People, Settings, Actions
- Recency-weighted ranking
- Portal-aware results (HQ users see HQ items, analysts see analyst items)

**Impact**: High -- fundamentally improves findability for all users, especially power users.

**Effort**: Medium-High (5-8 days) -- Phase 1 is 2-3 days, Phase 2 adds 2-3 days, Phase 3 adds 2 days.

**Dependencies**: EP-01 (navigation config provides searchable index), EP-02 (role filtering).

---

### EP-04: Breadcrumb System

**Problem**: No breadcrumb navigation exists. Users in deep hierarchies (e.g., HQ > Trips > Trip Detail > Lodging) have no way to see their location in the hierarchy or navigate up levels. The trip detail sidebar's back button partially addresses this, but only for one level.

**Solution**: Implement a breadcrumb system that auto-generates from route structure.

**Design**:
```
Client Portal:  Dashboard / Trips / Spring Break 2026 / Lodging
HQ Console:     Overview / Trips / Spring Break 2026 / Overview
Analyst:        Dashboard / Queue / Trip Review: Spring Break 2026 / Air Travel
```

**Technical Approach**:
- Create `Breadcrumb` component that reads `usePathname()` and maps segments to labels
- Route segment label registry: `{ 'trips': 'Trips', '[tripId]': trip.name, 'lodging': 'Lodging' }`
- Dynamic segments (`[tripId]`) resolved via context or data fetch
- Placed in `AppShell` above main content area
- Truncation for mobile: show first and last 2 segments with `...`

**Impact**: Medium -- improves orientation and provides upward navigation paths.

**Effort**: Low-Medium (2-3 days) -- relatively straightforward with pathname parsing.

**Dependencies**: Route label registry needs maintenance as routes are added.

---

### EP-05: Cross-Portal Deep Linking

**Problem**: When an HQ admin views an organization's trip, they cannot jump to the analyst review for that trip or vice versa. When an analyst reviews a trip, they cannot jump to the client's view of the same trip. Users who work across portals (HQ admins who are also reviewing analyst work) must manually navigate between portals.

**Solution**: Add contextual cross-portal links where the same entity (trip, org, user) exists across portals.

**Design**:
- Trip detail header: "View Analyst Review" link (if user has analyst/HQ access)
- Analyst review header: "View Client Trip" link
- HQ trip list: row action "View in Client Portal" / "View Analyst Review"
- HQ org detail: "View as Admin" link to client portal

**Technical Approach**:
- Role-aware link generation: only show cross-portal links if user has the destination role
- Use `getRoleCategory()` from EP-02 to determine available portals
- Generate links with return-path parameter for "Back to [source portal]" navigation

**Impact**: Medium -- significant time savings for multi-portal users.

**Effort**: Low (1-2 days) -- primarily conditional link rendering.

**Dependencies**: EP-02 (role category detection).

---

### EP-06: HQ Console Progressive Disclosure

**Problem**: 54% of HQ nav items are disabled with "(Coming Soon)" labels. The Intelligence (5 items), Monitoring (3 items), and System (3 items) groups are entirely disabled. This creates a "ghost town" that undermines platform credibility and adds visual noise.

**Solution**: Hide disabled groups entirely. Show individual disabled items within active groups only when they are "almost ready" (sprint-level proximity).

**Design Rules**:
1. If ALL items in a group are disabled, HIDE the entire group
2. If SOME items in a group are disabled, show them with subtle "(Soon)" badge
3. Add a "Coming Soon" section in Settings or a roadmap page for visibility into future features
4. Use feature flags to dynamically enable groups as features ship

**Before (current)**:
```
Overview
Management (7 items)        [all active]
Configuration (4 items)     [2 active, 2 disabled]
Intelligence (5 items)      [ALL disabled]
Monitoring (3 items)        [ALL disabled]
System (3 items)            [ALL disabled]
= 26 items, 14 disabled
```

**After (proposed)**:
```
Overview
Management (7 items)        [all active]
Configuration (4 items)     [2 active, 2 with "Soon" badge]
= 13 items, 2 with "Soon" badge
```

**Impact**: High -- dramatically improves HQ console perceived quality. Reduces nav items from 26 to 13.

**Effort**: Low (1 day) -- filter logic on existing nav config.

**Dependencies**: None. Can ship immediately.

---

### EP-07: Trip Detail Navigation Consolidation

**Problem**: Trip detail sidebar has 21 items in 7 groups, exceeding cognitive load thresholds. Some groups have only 1-2 items. "Digests" is in the Safety group but is more of a communication feature. "Deliverables" has only "Packets".

**Solution**: Consolidate from 7 groups to 5 by merging small groups and re-categorizing.

**Proposed Structure** (16 items in 5 groups):

```
Trip Overview (standalone)

PEOPLE
  Participants
  Background Checks

LOGISTICS
  Air Travel
  Lodging
  Venues
  Itinerary
  Transportation

SAFETY
  Safety Review
  Emergency Preparedness
  Guidance

COMMUNICATION
  Briefings
  Digests
  Trip Packet
  Issues

ADMIN
  Transactions
  Trip Settings
```

**Changes**:
- Merged "Deliverables" (1 item) into "Communication" -- Packets/Trip Packet is a communication deliverable
- Merged "Review" into "Communication" -- Issues are a communication mechanism
- Moved "Digests" from Safety to Communication -- digests are information delivery, not safety management
- Moved "Briefings" from Safety to Communication -- briefings are authored content
- Removed "Analyst Notes (coming soon)" -- either build it or remove the placeholder
- Renamed "Packets" to "Trip Packet" for consistency with mobile
- Net reduction: 21 -> 16 items, 7 -> 5 groups (+ 1 standalone)

**Impact**: Medium -- reduces cognitive load, improves group coherence.

**Effort**: Low (1-2 days) -- reorganize the `getTripDetailNavItems` function.

**Dependencies**: None.

---

### EP-08: Terminology Standardization

**Problem**: 8 identified terminology conflicts across surfaces (see Section 2.4). Users who interact with multiple surfaces (org admin who also views analyst feedback, HQ admin who views trips across portals) encounter inconsistent labels.

**Solution**: Establish and enforce a controlled vocabulary.

**Controlled Vocabulary**:

| Canonical Term | Synonyms to Retire | Applied Where |
|----------------|---------------------|---------------|
| **Participants** | "Teams & Travelers", "All Participants", "Roster" | All trip-scoped people views |
| **People** | "Teams & Travelers" | Org-level people management |
| **Air Travel** | "Flights" | All flight-related sections |
| **Trip Packet** | "Packets", "Packet Builder" | All packet-related references |
| **Safety Review** | "Safety" | All safety compliance sections |
| **Emergency Preparedness** | "Emergency Prep", "Emergency Contacts" | All emergency info sections |
| **Guidance** | "Do's & Don'ts", "Rules" | Cultural guidance sections |
| **Intel Alerts** | "Alerts", "Intel Queue" | Intelligence alert features |

**Implementation**:
- Create `src/shared/constants/terminology.ts` with canonical labels
- Update all navigation configs to import from this file
- Add to code review checklist: "Are new labels consistent with controlled vocabulary?"

**Impact**: Medium -- improves predictability and reduces user confusion.

**Effort**: Low (1-2 days) -- update string constants across configs.

**Dependencies**: None. Can ship immediately.

---

### EP-09: Role-Aware Navigation Service

**Problem**: Role-aware navigation is implemented inconsistently: mobile does it well (per-item `roles[]` array), web relies on separate portal layouts (no per-item filtering). Within a portal, all roles see the same items. There is no way for a `billing_admin` to see a different nav than an `org_admin` in the client portal, even though their permissions differ.

**Solution**: Create a centralized navigation service that generates portal-specific navigation based on user role and permissions.

```typescript
// src/shared/services/navigation-service.ts

export function getNavigationForRole(
  role: UserRole,
  context?: { tripId?: string; orgId?: string }
): NavigationConfig {
  // Returns role-filtered, context-aware navigation
}

export function getPortalForRole(role: UserRole): 'client' | 'analyst' | 'hq' {
  // Determines which portal a role belongs to
}

export function canAccessRoute(role: UserRole, route: string): boolean {
  // Route-level access check
}
```

**Impact**: High -- enables fine-grained role-aware navigation, reduces per-portal duplication, provides single place to manage access control.

**Effort**: Medium-High (5-7 days) -- requires mapping all routes to role permissions.

**Dependencies**: EP-01 (unified nav types), EP-02 (unified role types).

---

### EP-10: Analyst Review Section Grouping

**Problem**: The analyst review workflow presents 18 sections as a flat list. The client trip detail groups similar sections into categories (People, Logistics, Safety, etc.). Analysts who discuss trips with org admins must mentally map between two different organizational schemes.

**Solution**: Add section grouping to the analyst review navigation that mirrors the client structure, while retaining the numbered sequence.

**Proposed Grouped Structure**:

```
TRIP OVERVIEW (1 section)
  1. Overview

PEOPLE (2 sections)
  2. Participants
  11. Background Checks

LOGISTICS (5 sections)
  3. Air Travel
  4. Lodging
  5. Venues
  6. Itinerary
  7. Transportation

SAFETY (2 sections)
  8. Safety
  9. Emergency Prep

COMPLIANCE (3 sections)
  10. Documents
  12. Intel Alerts
  15. Checklists

COMMUNICATION (2 sections)
  13. Issues
  17. Comms Log

DELIVERABLES (2 sections)
  14. Evidence & Activity
  16. Packet Builder

DECISION (1 section)
  18. Approval
```

**Note**: Section numbers are preserved for backward compatibility and because analysts use them as shorthand ("check section 8"). The grouping adds visual structure without changing the workflow sequence.

**Impact**: Medium -- reduces cognitive load, aligns analyst and client mental models.

**Effort**: Low-Medium (2-3 days) -- update `review-sections.ts` and `section-navigation.tsx`.

**Dependencies**: None.

---

### EP-11: Eliminate Trip Detail Sidebar Code Duplication

**Problem**: `trip-detail-sidebar.tsx` (478 lines) duplicates approximately 200 lines of logic from `sidebar.tsx` (408 lines). Both files independently define `NavItem`, `NavGroup`, `NavLink`, `NavGroupSection`, type guard `isNavGroup`, collapse behavior, mobile Sheet, and theme toggle. The trip detail version uses `comingSoon` instead of `disabled`, creating a semantic difference for the same visual behavior.

**Solution**: Refactor the trip detail sidebar to consume the shared sidebar component, passing trip-specific configuration.

**Approach**:
1. Extend shared `NavItem.disabled` to support both boolean and a `reason` string (`"comingSoon"`)
2. Add `headerSlot` prop to shared `Sidebar` for trip name/dates/progress bar
3. Add `backNavigation` prop for role-aware back button
4. Remove trip-detail-specific NavLink, NavGroupSection, NavItem, NavGroup implementations
5. Keep `getTripDetailNavItems()` as the config generator

**Impact**: Medium -- reduces maintenance surface from 886 lines to ~500, eliminates divergence risk.

**Effort**: Medium (3-4 days) -- refactoring with care to preserve visual behavior.

**Dependencies**: EP-01 (shared types enable this naturally).

---

### EP-12: Fix HQ Hardcoded User Display

**Problem**: Both HQ and Analyst layouts display hardcoded user information instead of the actual authenticated user's name and role.

```typescript
// hq/layout.tsx
const HQ_USER = { name: 'HQ Admin', role: 'Platform Administrator' };

// analyst/layout.tsx
const ANALYST_USER = { name: 'Safety Analyst', role: 'Trip Reviewer' };
```

**Solution**: Use `useAuth()` to display actual user data.

```typescript
const { user } = useAuth();
const userDisplay = {
  name: user?.name || user?.email || 'User',
  role: user?.role ? getRoleLabel(user.role) : '',
};
```

**Impact**: Low but important for credibility -- users see "HQ Admin" instead of their actual name.

**Effort**: Trivial (30 minutes) -- two file changes.

**Dependencies**: None.

---

### EP-13: Add Missing /hq/payments Navigation Entry

**Problem**: The `/hq/payments` page exists and is built, but has no navigation entry in the HQ sidebar. Users can only reach it by knowing the URL.

**Solution**: Add "Payments" to the Management group in HQ nav, positioned after "Finance".

```typescript
{ href: '/hq/payments', label: 'Payments', icon: <Receipt strokeWidth={1.5} /> },
```

Alternatively, make Payments a sub-section of Finance (accessible via tab or sub-nav on the Finance page).

**Impact**: Low -- but currently a findability hole.

**Effort**: Trivial (15 minutes).

**Dependencies**: None.

---

### EP-14: Risk Dashboard Frontend

**Problem**: The Monte Carlo risk scoring engine (12-feature model, 500-sample simulation, ~150ms execution) is production-ready on the backend but has ZERO frontend visualization. This is the platform's most impressive technical capability and its primary differentiator, yet it is invisible to all users.

**Solution**: Build a risk dashboard component for the client trip detail view.

**Design**:
- New trip detail section: "Risk Assessment" (added to Safety group)
- Visualization: P5/P50/P95 probability distribution or tornado chart
- Risk drivers with relative contribution weights (5 domains: hazard, exposure, vulnerability, exfil, confidence)
- Active courses of action (COAs) with recommended actions
- Historical risk trend for the trip duration
- Update frequency indicator (last refreshed timestamp)

**User Stories**:
- As an org admin, I can see the current risk level for my trip's destination
- As an org admin, I can understand which factors drive the risk score
- As an org admin, I can see recommended actions based on the risk assessment
- As an analyst, I can reference the risk score during trip review

**Impact**: Very High -- unlocks primary product differentiator for customers and sales.

**Effort**: High (8-12 days) -- new page, chart components, API integration, data transformation.

**Dependencies**: Backend API endpoint for risk data retrieval, chart library (could use existing or add Recharts/Victory).

---

### EP-15: Mobile Navigation Web Pattern Port

**Problem**: The mobile app has excellent navigation patterns (role-aware filtering, progressive disclosure, floating Help/SOS) that the web app does not implement.

**Solution**: Port key mobile patterns to web.

**Specific Patterns to Port**:
1. **Role-aware item filtering**: Add `visibleToRoles` to all web nav items (from EP-01)
2. **Progressive disclosure on HQ Console**: Apply mobile's "show primary, expand for more" pattern to the HQ sidebar (show Management group expanded, collapse Configuration/Intelligence on first visit)
3. **Floating Help/SOS**: Add a persistent help button to web layout (likely bottom-right FAB)
4. **Priority ordering**: Mobile packet sections use explicit `priority` field for ordering -- apply to web nav items

**Impact**: Medium -- brings web navigation quality closer to mobile's proven patterns.

**Effort**: Medium (3-5 days) -- multiple small changes across web navigation surfaces.

**Dependencies**: EP-01, EP-02.

---

## 5. Risk Assessment

### 5.1 Architecture Risks

| ID | Risk | Probability | Impact | Severity | Mitigation |
|----|------|-------------|--------|----------|------------|
| R01 | **Type system divergence** -- 6 NavItem types and 3+ role type sources will continue to diverge as features ship, making unified navigation impossible | High | High | **Critical** | EP-01 + EP-02: Unify types now before more features compound the problem |
| R02 | **HQ credibility erosion** -- 54% disabled items signals "unfinished product" to internal staff who are the platform's operators and advocates | Medium | Medium | **Medium** | EP-06: Hide fully-disabled groups immediately |
| R03 | **No search fallback** -- if navigation is hard to use, users have NO alternative. Search is the safety net that doesn't exist | High | High | **Critical** | EP-03: Command palette provides escape hatch for all navigation problems |
| R04 | **Trip detail cognitive overload** -- 21 items will grow as features ship (risk dashboard, more safety features, consent tracking). Without consolidation, this becomes 25+ items | Medium | Medium | **Medium** | EP-07: Consolidate now, establish max-items policy |
| R05 | **Terminology confusion** -- users who work across surfaces (admin + parent, HQ + analyst) encounter different labels for the same concepts | Medium | Low-Medium | **Low-Medium** | EP-08: Controlled vocabulary with automated enforcement |
| R06 | **Code duplication** -- trip detail sidebar's 200+ lines of duplicated logic will diverge from the shared sidebar as either is updated | High | Medium | **Medium** | EP-11: Refactor to shared component |
| R07 | **Missing risk dashboard** -- the primary differentiator has no UI. Competitors or prospects cannot evaluate the capability, and customers cannot benefit from it | High | Very High | **Critical** | EP-14: Prioritize risk dashboard build |
| R08 | **No breadcrumbs in deep navigation** -- users reaching trip detail via HQ trips have no way back except the back button (which is browser-dependent) | Medium | Low | **Low** | EP-04: Add breadcrumbs |
| R09 | **Hardcoded user display** -- HQ and analyst portals show fake names, potentially masking auth issues in production | Low | Low | **Low** | EP-12: Trivial fix, ship immediately |
| R10 | **Payments page unreachable** -- built feature with no nav entry is dead code and potential customer support burden | Low | Low | **Low** | EP-13: Trivial fix |

### 5.2 Scalability Risks

| ID | Risk | Current | Projected (12mo) | Mitigation |
|----|------|---------|-------------------|------------|
| S01 | HQ nav item count | 26 (14 disabled) | 30-35 (if all enabled) | EP-06 + EP-09: Progressive disclosure + role-based filtering |
| S02 | Trip detail nav items | 21 | 25+ (risk dashboard, consent, more safety) | EP-07: Consolidate groups, establish cap |
| S03 | Analyst review sections | 18 | 20+ (new compliance requirements) | EP-10: Group sections, add sub-section pattern |
| S04 | Route count (total) | ~97 | 120+ | EP-03: Search becomes essential at scale |
| S05 | Feature count | 63 | 80+ | EP-03 + EP-09: Search + role-aware filtering prevent overload |

### 5.3 Accessibility Risks

| ID | Risk | Severity | Standard | Current State |
|----|------|----------|----------|---------------|
| A01 | No skip link to bypass sidebar navigation | Medium | WCAG 2.4.1 | Not implemented |
| A02 | Sidebar `<nav>` has no aria-label to distinguish from other navs | Medium | WCAG 1.3.6 | Missing |
| A03 | Collapsed sidebar loses group labels (no ARIA equivalent) | Low | WCAG 1.3.1 | Not addressed |
| A04 | Disabled items use `cursor-not-allowed` but may be tab-focusable | Low | WCAG 2.1.1 | Needs audit |
| A05 | No focus management on sidebar open/close | Low | WCAG 2.4.3 | Not implemented |
| A06 | Badge counts not announced to screen readers | Medium | WCAG 1.3.1 | No aria-label on badges |
| A07 | Active state relies on color alone (no secondary indicator) | Medium | WCAG 1.4.1 | Background color change only |

---

## 6. Architecture Recommendations

### 6.1 Shared Navigation Architecture

**Recommendation**: Implement a 3-layer navigation architecture.

```
Layer 1: Navigation Registry (shared/config/navigation-registry.ts)
  - All routes, labels, icons, role visibility, badges
  - Single source of truth for what exists and who can see it
  - Used by: search, sidebar rendering, breadcrumbs, access control

Layer 2: Navigation Service (shared/services/navigation-service.ts)
  - Consumes registry + user context (role, permissions, current route)
  - Produces: filtered nav items, breadcrumb trail, search index
  - Used by: all sidebar implementations, command palette, breadcrumb component

Layer 3: Navigation Components (shared/components/layout/)
  - Sidebar (existing, refactored to consume service output)
  - Breadcrumb (new)
  - CommandPalette (new)
  - All consume Layer 2 output, not raw config
```

**Benefits**:
- Single place to add a new feature/route (registry)
- Automatic propagation to sidebar, search, breadcrumbs
- Role-aware filtering applied once (service), not per-component
- Testable: service can be unit tested with mock contexts

### 6.2 Navigation Config-as-Data Pattern

**Recommendation**: Move all navigation configuration out of layout files and into dedicated config files.

**Current**: Navigation is defined as JSX inside layout components (icon elements inline).

**Proposed**: Navigation defined as data, icons resolved at render time.

```typescript
// src/shared/config/portals/client-nav.ts
export const CLIENT_NAVIGATION: NavigationConfig = [
  {
    id: 'main',
    items: [
      {
        id: 'dashboard',
        href: '/dashboard',
        label: 'Dashboard',
        icon: 'LayoutDashboard', // String reference, not JSX
        visibleToRoles: ['org_admin', 'billing_admin', 'security_officer'],
      },
      // ...
    ],
  },
];
```

**Benefits**:
- Config is serializable (can be stored in DB for customization)
- Config is testable (no JSX rendering required)
- Icons resolved at component level via lookup map
- Enables future: org-level nav customization, A/B testing navigation

### 6.3 Terminology Governance

**Recommendation**: Establish a controlled vocabulary file that serves as the authoritative label source.

```typescript
// src/shared/constants/terminology.ts
export const TERM = {
  // Sections
  AIR_TRAVEL: 'Air Travel',
  LODGING: 'Lodging',
  VENUES: 'Venues',
  ITINERARY: 'Itinerary',
  TRANSPORTATION: 'Transportation',
  PARTICIPANTS: 'Participants',
  PEOPLE: 'People',
  SAFETY_REVIEW: 'Safety Review',
  EMERGENCY_PREPAREDNESS: 'Emergency Preparedness',
  GUIDANCE: 'Guidance',
  TRIP_PACKET: 'Trip Packet',
  INTEL_ALERTS: 'Intel Alerts',
  DIGESTS: 'Digests',
  BRIEFINGS: 'Briefings',
  BACKGROUND_CHECKS: 'Background Checks',
  // ...
} as const;
```

All navigation configs, page headers, and UI labels import from this file. Linting rule: no hardcoded section name strings outside this file.

### 6.4 Mobile-Web Navigation Parity Strategy

**Recommendation**: Treat the mobile app's navigation as the "north star" for progressive disclosure and role-awareness, while treating the web app as the "north star" for depth and feature access.

| Principle | Mobile Approach | Web Approach | Converge On |
|-----------|----------------|--------------|-------------|
| Primary nav items | 2-3 most important | Full list | Web should highlight primary items |
| Progressive disclosure | Collapsed -> expanded drawer | All items always visible | Web should support collapsed groups |
| Role filtering | Per-item `roles[]` array | Per-portal layout | Per-item filtering (mobile wins) |
| Help/SOS access | Floating FAB, always visible | Hidden in sidebar footer | Add web FAB for help (mobile wins) |
| Badge counts | Alert badge on BottomNav | Badge on sidebar items | Both good, maintain consistency |

---

## 7. Priority Recommendations

### 7.1 Implementation Priority Matrix

Priorities consider: impact on findability, effort required, dependency chains, and risk mitigation.

#### Tier 1: Ship This Week (Trivial Fixes)

| # | Enhancement | Effort | Impact | Risk Mitigated |
|---|-------------|--------|--------|----------------|
| 1 | EP-12: Fix hardcoded user display (HQ + Analyst) | 30 min | Low | R09 |
| 2 | EP-13: Add /hq/payments nav entry | 15 min | Low | R10 |
| 3 | EP-06: Hide fully-disabled HQ nav groups | 1 day | High | R02 |

**Total effort**: ~1.5 days. **Total items fixed**: 3 bugs + 14 disabled items cleaned up.

#### Tier 2: Ship This Sprint (High Impact, Low-Medium Effort)

| # | Enhancement | Effort | Impact | Risk Mitigated |
|---|-------------|--------|--------|----------------|
| 4 | EP-08: Terminology standardization | 1-2 days | Medium | R05 |
| 5 | EP-07: Trip detail nav consolidation (21 -> 16 items) | 1-2 days | Medium | R04, S02 |
| 6 | EP-10: Analyst review section grouping | 2-3 days | Medium | -- |
| 7 | EP-02: Unified role type system | 2-3 days | High | R01 |

**Total effort**: ~8-10 days. **Foundation laid for**: EP-01, EP-03, EP-09.

#### Tier 3: Ship Next Sprint (Foundation + High Impact Features)

| # | Enhancement | Effort | Impact | Risk Mitigated |
|---|-------------|--------|--------|----------------|
| 8 | EP-01: Unified navigation type system | 3-5 days | High | R01, R06 |
| 9 | EP-11: Eliminate trip detail sidebar duplication | 3-4 days | Medium | R06 |
| 10 | EP-04: Breadcrumb system | 2-3 days | Medium | R08 |
| 11 | EP-03 Phase 1: Command palette (nav search) | 2-3 days | High | R03, S04, S05 |

**Total effort**: ~12-15 days. **Unlocks**: Searchable navigation, orientation breadcrumbs, maintainable nav code.

#### Tier 4: Ship Within 6 Weeks (Strategic Features)

| # | Enhancement | Effort | Impact | Risk Mitigated |
|---|-------------|--------|--------|----------------|
| 12 | EP-14: Risk dashboard frontend | 8-12 days | Very High | R07 |
| 13 | EP-09: Role-aware navigation service | 5-7 days | High | S01, S05 |
| 14 | EP-05: Cross-portal deep linking | 1-2 days | Medium | -- |
| 15 | EP-03 Phase 2: Entity search | 2-3 days | High | S04 |
| 16 | EP-15: Mobile pattern port to web | 3-5 days | Medium | -- |

**Total effort**: ~20-29 days. **Delivers**: Primary differentiator (risk dashboard), production-grade navigation, cross-portal workflows.

### 7.2 Critical Path

```
EP-02 (Role Types) -----> EP-01 (Nav Types) -----> EP-09 (Nav Service) -----> EP-03 Phase 3 (Actions)
                    \                          \
                     \-> EP-08 (Terminology)    \-> EP-11 (Dedup Sidebar)
                                                 \-> EP-03 Phase 1 (Nav Search)
                                                 \-> EP-15 (Mobile Patterns)

EP-06 (HQ Cleanup) -----> Standalone (no dependencies)
EP-07 (Trip Consolidation) -> Standalone
EP-12 (Hardcoded Fix) -----> Standalone
EP-13 (Payments Nav) ------> Standalone
EP-14 (Risk Dashboard) ----> Standalone (backend exists)
```

### 7.3 Recommended Sprint Plan

**Sprint 1** (Current):
- [x] EP-12: Fix hardcoded user display
- [x] EP-13: Add payments nav entry
- [x] EP-06: Hide disabled HQ groups
- [ ] EP-08: Terminology standardization
- [ ] EP-07: Trip detail consolidation

**Sprint 2**:
- [ ] EP-02: Unified role types
- [ ] EP-10: Analyst section grouping
- [ ] EP-01: Unified nav types
- [ ] EP-11: Deduplicate trip detail sidebar

**Sprint 3**:
- [ ] EP-03 Phase 1: Command palette
- [ ] EP-04: Breadcrumbs
- [ ] EP-05: Cross-portal linking

**Sprint 4-5**:
- [ ] EP-14: Risk dashboard frontend
- [ ] EP-09: Role-aware nav service
- [ ] EP-03 Phase 2: Entity search

---

## Appendices

### Appendix A: Complete File Reference

| File | Purpose | Lines | Issues |
|------|---------|-------|--------|
| `src/shared/components/layout/sidebar.tsx` | Shared sidebar component | 408 | Baseline -- good |
| `src/app/(client)/layout.tsx` | Client portal layout + nav | 112 | Hardcoded roles in formatRole() |
| `src/app/hq/layout.tsx` | HQ console layout + nav | 180 | Hardcoded user, 54% disabled items |
| `src/app/analyst/layout.tsx` | Analyst portal layout + nav | 103 | Hardcoded user |
| `src/modules/client/components/trip-detail/trip-detail-sidebar.tsx` | Trip detail sidebar | 478 | Duplicates shared sidebar, own types |
| `src/modules/analyst/constants/review-sections.ts` | 18 review sections | 105 | Flat list, no grouping |
| `src/modules/analyst/components/trip-review/section-navigation.tsx` | Review section nav component | 78 | Functional, could add groups |
| `src/modules/analyst/components/trip-review/trip-review-shell.tsx` | 3-column review layout | 63 | Clean architecture |
| `src/modules/analyst/config/packet-sections.ts` | Packet section config | 145 | Own type (PacketSectionConfig) |
| `src/modules/client/components/settings/org-settings-nav.tsx` | Org settings nav | 79 | Own NavItem type |
| `safetrekr-traveler-native/components/layout/BottomNav.tsx` | Mobile bottom nav | 484 | Own NavItem type, good role-awareness |
| `safetrekr-traveler-native/components/pages/packet/PacketHub.tsx` | Mobile packet hub | 199 | Own PacketSection type, good role-awareness |
| `safetrekr-traveler-native/app/(app)/trip/[tripId]/settings/index.tsx` | Mobile settings hub | 282 | Own SettingsCategory type, good role-awareness |
| `safetrekr-traveler-native/app/(app)/trip/[tripId]/_layout.tsx` | Mobile trip layout | 165 | Clean role-aware tab setup |
| `safetrekr-traveler-native/lib/types/navigation.ts` | Mobile nav types | 90 | Route constants, clean |
| `packages/core-logic/src/types/index.ts` | Shared types | 274 | Only 3 roles (mobile-only) |
| `src/shared/auth/auth-provider.tsx` | Web auth with 10 roles | ~150+ | Local role type, not shared |

### Appendix B: Navigation Item Counts Summary

| Surface | Total Items | Active | Disabled/Coming Soon | Groups |
|---------|-------------|--------|---------------------|--------|
| Client Portal | 9 | 8 | 1 | 2 |
| HQ Console | 26 | 12 | 14 | 6 |
| Analyst Portal | 7 | 7 | 0 | 3 |
| Trip Detail | 21 | 20 | 1 | 7 |
| Analyst Review | 18 | 18 | 0 | 0 (flat) |
| Org Settings | 7 | 4 | 3 | 0 (flat) |
| Mobile BottomNav (expanded) | 8 | 8 | 0 | 0 (grid) |
| Mobile PacketHub | 8 | 8 | 0 | 0 (list) |
| Mobile Settings | 6 | 6 | 0 | 0 (list) |
| **TOTAL** | **110** | **91** | **19** | **18** |

### Appendix C: Route-to-Role Access Matrix

| Route Pattern | org_admin | billing_admin | security_officer | analyst | hq_admin | hq_supervisor | hq_security | hq_ops | traveler | chaperone | guardian |
|---------------|-----------|---------------|-------------------|---------|----------|---------------|-------------|--------|----------|-----------|---------|
| `/dashboard` | Y | Y | Y | -- | -- | -- | -- | -- | Y* | Y* | Y* |
| `/trips` | Y | Y | Y | -- | -- | -- | -- | -- | -- | -- | -- |
| `/trips/[id]/*` | Y | Y | Y | Y** | Y** | Y** | Y** | Y** | -- | -- | -- |
| `/analyst/*` | -- | -- | -- | Y | -- | -- | -- | -- | -- | -- | -- |
| `/hq/*` | -- | -- | -- | -- | Y | Y | Y | Y | -- | -- | -- |

*Redirected to appropriate portal via auth routing.
**Via cross-portal access (trip detail is shared).

---

## Summary of Deliverables

| Deliverable Type | Count | Critical | High | Medium | Low |
|------------------|-------|----------|------|--------|-----|
| Feature Documentations | 63 features documented across 9 domains | -- | -- | -- | -- |
| Enhancement Proposals | 15 proposals (EP-01 through EP-15) | 3 | 5 | 5 | 2 |
| Risk Assessments | 10 architecture + 5 scalability + 7 accessibility = 22 risks | 3 | 3 | 8 | 8 |
| Architecture Recommendations | 4 structural recommendations | -- | -- | -- | -- |
| Priority Tiers | 4 tiers spanning ~4-5 sprints | -- | -- | -- | -- |

**Estimated total implementation effort**: ~45-60 days across all enhancements.
**Quick wins available immediately**: 3 items, ~1.5 days, addressing 3 bugs and cleaning up 14 disabled nav items.

---

*This analysis was produced from direct codebase inspection of 17 source files across 4 applications (safetrekr-app-v2, safetrekr-traveler-native, safetrekr-core, packages/core-logic). All findings are evidence-based with file paths and line references.*
