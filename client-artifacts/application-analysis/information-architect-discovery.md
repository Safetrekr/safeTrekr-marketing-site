# SafeTrekr Information Architecture Discovery Analysis

**Date:** 2026-03-17
**Analyst:** Information Architecture Agent

## Executive Summary

SafeTrekr is a structurally ambitious multi-tenant travel safety platform spanning three web portals (Client, Analyst, HQ Console), a role-aware mobile app (Expo Router), and a 10-step trip creation wizard. The codebase demonstrates several mature IA patterns -- role-based navigation filtering, grouped sidebar sections, progressive disclosure in the mobile bottom nav, and a well-structured 18-section analyst review workflow.

However, the architecture has accrued significant structural debt. Five independent sidebar implementations define their own NavItem types. Terminology is inconsistent across portals. The HQ Console sidebar carries 26 items, 14 of which are disabled placeholders. There is no global search capability anywhere. Breadcrumbs exist as a UI component but are not systematically deployed. The role type system is fractured: core-logic defines only 3 mobile roles while the web auth store uses string for 10 roles.

## Key Findings

1. **Five independent sidebar implementations with no shared navigation model.** Global Sidebar, TripDetailSidebar, TripReviewSidebar, HelpSidebar, and SettingsNav each define their own NavItem/NavGroup interfaces.

2. **Role type system is fractured across packages.** core-logic exports UserRole = 3 mobile roles. Web auth store uses role: string for 10 roles. No unified enum.

3. **HQ Console sidebar is 54% disabled placeholders.** 14 of 26 items are disabled: Intelligence (5/5), Monitoring (3/3), System (3/3), Configuration (2/4).

4. **No global search exists.** Only place autocomplete in trip wizard, POI search in analyst safety view, and help center search.

5. **Duplicate route structures for client trip detail.** Routes at both (client)/trips/[tripId]/briefings and (trip-detail)/trips/[tripId]/.

6. **Inconsistent terminology across portals.** "Air Travel" vs "Flights", "Teams & Travelers" vs "All Participants", "Queue Management" vs "Trip Review Queue".

7. **Trip detail sidebar has 21 items across 7 groups.** Requires scrolling on standard-height screens.

8. **Analyst review (18 sections) and client trip detail (~17 pages) overlap significantly but use different groupings.**

9. **Mobile navigation uses excellent progressive disclosure.** BottomNav shows 2-3 primary items, expanding to 8-item grid on tap.

10. **Breadcrumbs structurally absent despite component existence.** No systematic breadcrumb strategy across portals.

11. **Accessibility landmarks are minimal.** No ARIA landmarks for regions, no skip-link mechanism.

12. **No cross-linking between portals.** HQ admin viewing a trip has no link to analyst review for that trip.

## Feature Inventory

50+ features inventoried across Client Portal (F-001 to F-011), Analyst Portal (F-012 to F-018), HQ Console (F-019 to F-042), and Mobile App (F-043 to F-051). See full analysis for complete inventory with priority assessments.

## Top 5 Recommendations

1. **Establish a Shared Navigation Configuration Layer** - Create unified NavConfig type system eliminating 5 duplicate interfaces. (Medium effort, High impact)

2. **Implement Federated Search Across Portals** - Client searches trips/participants, Analyst searches queue, HQ searches orgs/users/trips. (High effort, Critical impact)

3. **Consolidate and Clean HQ Console Sidebar** - Remove disabled groups, add "Coming Soon" section. Sidebar goes from 26 to ~14 items. (Low effort, High impact)

4. **Establish a Controlled Vocabulary and Label Guide** - Create terminology reference mapping concept IDs to display labels. (Medium effort, Medium-High impact)

5. **Unify the Role Type System** - Extend core-logic UserRole to all 10 roles with metadata. Replace hardcoded HQ_ROLES arrays. (Medium effort, High impact)

## Dependencies & Constraints

- Trip type determines available sections (T1 may not have lodging/flights)
- Trip status gates functionality (draft = editable, in_review = read-only)
- JSONB settings for org status (suspension in settings.suspended)
- Dual user ID system requires auth_user_id lookup
- Next.js 15 route groups are layout boundaries
- Expo Router tab structure defined in _layout.tsx
- Five sidebar implementations must be consolidated incrementally
