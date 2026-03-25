Here is the comprehensive Information Architecture Discovery Analysis for SafeTrekr.

---

# SafeTrekr Information Architecture Discovery Analysis

**Date**: 2026-03-23
**Scope**: safetrekr-app-v2 codebase (Next.js 15 / App Router)
**Analyst**: IA Discovery — Codebase Mode

---

## 1. Navigation Structure Across All 3 Portals

### 1A. Complete Navigation Map

```
ROOT (/) → redirect → /login

CLIENT PORTAL (route group: (client), no URL prefix)
├── Dashboard                          /dashboard
├── Trips                              /trips
│   └── [tripId] → redirects to trip-detail route group
├── Intel Alerts [DISABLED]            /intel
├── Teams & Travelers                  /teams
├── Background Checks                  /background-checks
├── Packets                            /packets
├── Billing                            /billing
├── Help                               /help → separate (help) route group
└── Settings                           /settings
    ├── Organization                   /settings/organization?section={branding|security|legal|trip-defaults|...}
    └── Profile                        /settings/profile?section={profile|security|notifications|locale|privacy|signatures}

TRIP CREATION WIZARD (route group: (client), layout: TripDraftSyncProvider)
└── /trips/new
    ├── Step 1: Trip Type              /trips/new/type
    ├── Step 2: Information            /trips/new/info
    ├── Step 3: Participants           /trips/new/participants
    ├── Step 4: Air Travel             /trips/new/flights          ← URL/label mismatch
    ├── Step 5: Lodging                /trips/new/lodging
    ├── Step 6: Venues                 /trips/new/venues
    ├── Step 7: Itinerary             /trips/new/itinerary
    ├── Step 8: Transportation         /trips/new/transportation
    ├── Step 9: Add-ons                /trips/new/addons
    └── Step 10: Review                /trips/new/review

TRIP DETAIL (route group: (trip-detail), layout: TripDetailShell with sidebar)
└── /trips/[tripId]
    ├── [root] → redirect → /trips/[tripId]/overview
    ├── Trip Overview                  /trips/[tripId]/overview
    ├── PEOPLE
    │   ├── Participants               /trips/[tripId]/participants
    │   └── Background Checks          /trips/[tripId]/background-checks
    ├── LOGISTICS
    │   ├── Air Travel                 /trips/[tripId]/air-travel
    │   ├── Lodging                    /trips/[tripId]/lodging
    │   ├── Venues                     /trips/[tripId]/venues
    │   ├── Itinerary                  /trips/[tripId]/itinerary
    │   └── Transportation             /trips/[tripId]/transportation
    ├── SAFETY
    │   ├── Guidance                   /trips/[tripId]/guidance
    │   ├── Safety Review              /trips/[tripId]/safety-review
    │   ├── Emergency Preparedness     /trips/[tripId]/emergency-preparedness
    │   ├── Briefings                  /trips/[tripId]/briefings        ← no page in (trip-detail), exists in (client)
    │   └── Digests [badge]            /trips/[tripId]/digests
    ├── DELIVERABLES
    │   └── Packets                    /trips/[tripId]/packets
    ├── REVIEW
    │   ├── Issues [badge]             /trips/[tripId]/issues
    │   └── Analyst Notes [DISABLED]   /trips/[tripId]/analyst-notes
    ├── ADMIN
    │   ├── Transactions               /trips/[tripId]/transactions
    │   └── Trip Settings              /trips/[tripId]/settings
    ├── (unlisted routes)
    │   ├── Edit                       /trips/[tripId]/edit
    │   ├── Payment                    /trips/[tripId]/payment
    │   └── Documents                  /trips/[tripId]/documents

ANALYST PORTAL (URL prefix: /analyst)
├── Dashboard                          /analyst/dashboard
├── REVIEW
│   ├── Trip Review Queue              /analyst/queue
│   ├── Intel Queue                    /analyst/intel-queue
│   ├── Digests [badge]                /analyst/digests
│   │   └── [digestId]                 /analyst/digests/[digestId]
│   └── All Participants               /analyst/roster
├── ANALYTICS
│   └── Calibration                    /analyst/calibration
└── Settings
    └── Profile                        /analyst/settings/profile

ANALYST TRIP REVIEW (layout: TripReviewShell with numbered sidebar)
└── /analyst/trip-review/[tripId]
    ├── [root] → redirect → overview
    ├──  1. Overview                   .../overview
    ├──  2. Participants               .../participants
    ├──  3. Air Travel                 .../air-travel
    ├──  4. Lodging                    .../lodging
    ├──  5. Venues                     .../venues
    ├──  6. Itinerary                  .../itinerary
    ├──  7. Transportation             .../transportation
    ├──  8. Safety                     .../safety
    ├──  9. Emergency Prep             .../emergency-preparedness
    ├── 10. Documents                  .../documents
    ├── 11. Background Checks          .../background-checks
    ├── 12. Intel Alerts               .../intel-alerts
    ├── 13. Issues [badge]             .../issues
    ├── 14. Evidence & Activity        .../evidence
    ├── 15. Checklists                 .../checklists
    ├── 16. Packet Builder             .../packet
    ├── 17. Comms Log                  .../comms
    ├── 18. Approval                   .../approval
    └── ORPHAN: Briefings              .../briefings    ← page exists, NOT in REVIEW_SECTIONS

HQ CONSOLE (URL prefix: /hq)
├── /hq → redirect → /hq/overview
├── Overview                           /hq/overview
├── MANAGEMENT
│   ├── Organizations                  /hq/organizations
│   ├── Trips                          /hq/trips
│   ├── Users                          /hq/users
│   ├── Checklists                     /hq/checklists
│   ├── Finance                        /hq/finance
│   ├── Queue Management               /hq/queues
│   └── Guardian Governance            /hq/guardian-overrides
├── CONFIGURATION
│   ├── Policies                       /hq/policies
│   ├── Integrations [DISABLED]        /hq/integrations
│   ├── Security [DISABLED]            /hq/security
│   └── Feature Flags                  /hq/flags
├── INTELLIGENCE (ALL DISABLED)
│   ├── Intel Sources [DISABLED]       /hq/intel-sources
│   ├── Intel Triage [DISABLED]        /hq/intel-triage
│   ├── Intel Policies [DISABLED]      /hq/intel-policies
│   ├── Intel Metrics [DISABLED]       /hq/intel-metrics
│   └── System Config [DISABLED]       /hq/intel-config
├── MONITORING (ALL DISABLED)
│   ├── Audit Logs [DISABLED]          /hq/audit
│   ├── Communications [DISABLED]      /hq/communications
│   └── Incidents [DISABLED]           /hq/incidents
├── SYSTEM (ALL DISABLED)
│   ├── Testing [DISABLED]             /hq/testing
│   ├── System Status [DISABLED]       /hq/status
│   └── Settings [DISABLED]            /hq/settings
├── (unlisted routes)
│   └── Payments                       /hq/payments

HELP CENTER (route group: (help))
├── Help Home                          /help/home
├── Search                             /help/search
├── Getting Started                    /help/getting-started
├── How-to Guides                      /help/how-to
│   └── [slug]                         /help/how-to/[slug]
├── Glossary                           /help/glossary
└── Troubleshooting                    /help/troubleshooting

AUTH (route group: (auth))
├── Login                              /login
├── Forgot Password                    /forgot-password
└── Reset Password                     /reset-password

ONBOARDING (route group: (onboarding))
├── Activate                           /activate
└── Onboarding
    ├── Welcome                        /onboarding/welcome
    ├── Account                        /onboarding/account
    ├── Legal                          /onboarding/legal
    └── Complete                       /onboarding/complete
```

### 1B. Sidebar Architecture (Component Reuse)

| Context | Component | Collapsible | Mobile Sheet | Back Nav | Role-Aware |
|---------|-----------|-------------|--------------|----------|------------|
| Client Portal | `AppShell` + `Sidebar` | Yes (280px / 16px) | Yes | No | No |
| Analyst Portal | `AppShell` + `Sidebar` | Yes | Yes | No | No |
| HQ Console | `AppShell` + `Sidebar` | Yes | Yes | No | No |
| Trip Detail | `TripDetailSidebar` | Yes | Yes | Yes (3-way) | Yes |
| Analyst Review | `TripReviewSidebar` | Yes | Yes | Yes (2-way) | Yes |
| Help Center | `HelpSidebar` | **No** | Yes | Yes (fixed /trips) | No |
| Trip Wizard | No sidebar nav (footer prev/next only) | N/A | N/A | N/A | N/A |

**Finding**: The Help sidebar is the only non-collapsible sidebar and its back link is hardcoded to `/trips` regardless of role. If an HQ user or analyst visits help, they return to `/trips` instead of their portal.

---

## 2. Content Hierarchy and Taxonomy

### 2A. Domain Taxonomy

The application organizes content around these first-level domains:

| Domain | Client Portal | Trip Detail | Analyst Review | HQ Console |
|--------|--------------|-------------|----------------|------------|
| Trip Management | Trips list | Trip Overview | Overview | Trips list |
| People | Teams & Travelers | Participants, BG Checks | Participants, BG Checks | Users, Orgs |
| Logistics | (via wizard) | Air Travel, Lodging, Venues, Itinerary, Transportation | Same 5 sections | -- |
| Safety | -- | Guidance, Safety Review, Emergency Prep, Briefings, Digests | Safety, Emergency Prep, Intel Alerts | Intelligence (5 items) |
| Deliverables | Packets | Packets | Documents, Packet Builder | -- |
| Review/QA | -- | Issues, Analyst Notes | Issues, Evidence, Checklists, Comms, Approval | -- |
| Admin/Config | Billing, Settings | Transactions, Trip Settings | -- | Management (7), Config (4), Monitoring (3), System (3) |

### 2B. Trip Type Taxonomy

| Code | Label | Description | Safety Protocol Level |
|------|-------|-------------|-----------------------|
| T1 | Day Trip | Single-day, no overnight, same-day return | Standard |
| T2 | Multi-Day | Domestic overnight with lodging | Enhanced |
| T3 | International | Outside United States | Maximum |

### 2C. Role Taxonomy

| Role | Portal Access | Count |
|------|--------------|-------|
| `org_admin` | Client | -- |
| `billing_admin` | Client | -- |
| `security_officer` | Client | -- |
| `traveler` | Client (limited) | -- |
| `chaperone` | Client (limited) | -- |
| `guardian` | Client (limited) | -- |
| `analyst` | Analyst | -- |
| `hq_admin` | HQ | -- |
| `hq_supervisor` | HQ | -- |
| `hq_security` | HQ | -- |
| `hq_ops` | HQ | -- |

**Finding**: 11 roles defined but all 4 HQ roles see identical navigation. The `security_officer` role routes to the Client Portal same as `org_admin`, with no differentiation. Roles like `traveler`, `chaperone`, `guardian` route to Client Portal but there is no role-based nav filtering within Client Portal itself.

---

## 3. URL Structure and Routing Patterns

### 3A. URL Conventions

| Pattern | Example | Convention |
|---------|---------|------------|
| Portal prefix | `/hq/overview`, `/analyst/queue` | Consistent for analyst + HQ |
| Client portal | `/dashboard`, `/trips` | **No prefix** (root namespace) |
| Dynamic segments | `/trips/[tripId]/overview` | Bracket notation, camelCase |
| Wizard steps | `/trips/new/type` | Flat under `/trips/new/` |
| Settings sections | `/settings/organization?section=branding` | **Query params** (not segments) |
| Nested detail | `/analyst/trip-review/[tripId]/safety` | Segment-based |

### 3B. URL/Label Mismatches

| URL Segment | Nav Label | Recommendation |
|-------------|-----------|----------------|
| `/trips/new/flights` | "Air Travel" (step 4) | Rename URL to `/trips/new/air-travel` |
| `/analyst/roster` | "All Participants" | Rename URL to `/analyst/participants` or label to "Roster" |
| `/hq/guardian-overrides` | "Guardian Governance" | Rename URL to `/hq/guardian-governance` |
| `/hq/flags` | "Feature Flags" | Rename URL to `/hq/feature-flags` |
| `/hq/queues` | "Queue Management" | Acceptable (close enough) |
| `/analyst/trip-review/.../packet` | "Packet Builder" (section 16) | URL is singular `packet`, section is "Packet Builder" |
| `/trips/[tripId]/safety-review` | "Safety Review" | Consistent |

### 3C. Redirect Chains

| From | To | Mechanism |
|------|-----|-----------|
| `/` | `/login` | Server redirect |
| `/hq` | `/hq/overview` | Server redirect |
| `/trips/[tripId]` | `/trips/[tripId]/overview` | Server redirect |
| `/analyst/trip-review/[tripId]` | `.../overview` | Server redirect |

### 3D. Orphan and Ghost Routes

| Route | Status | Issue |
|-------|--------|-------|
| `/analyst/trip-review/[tripId]/briefings` | **ORPHAN** | Page file exists but not listed in `REVIEW_SECTIONS` constant; unreachable via navigation |
| `/(client)/trips/[tripId]/issues-comms` | **DUAL** | Lives in `(client)` route group, but trip-detail sidebar links to `(trip-detail)` group's `/trips/[tripId]/issues`. Different layouts, potentially different rendering contexts |
| `/(client)/trips/[tripId]/briefings` | **DUAL** | Lives in `(client)` route group but briefings are in trip-detail sidebar pointing to `(trip-detail)` group |
| `/hq/payments` | **UNLISTED** | Page exists but is not in `HQ_NAV` array |
| `/trips/[tripId]/edit` | **UNLISTED** | Page exists in trip-detail but not in sidebar nav |
| `/trips/[tripId]/payment` | **UNLISTED** | Page exists in trip-detail but not in sidebar nav |
| `/trips/[tripId]/documents` | **UNLISTED** | Page exists in trip-detail; explicitly commented out in sidebar |

---

## 4. Cross-Portal Information Flow

### 4A. Data Lifecycle: Trip Entity

```
CLIENT PORTAL                    ANALYST PORTAL                HQ CONSOLE
─────────────────                ────────────────              ──────────────
1. Client creates trip           
   via 10-step wizard            
   (/trips/new/*)                
         │                       
         ▼                       
2. Trip submitted                
   (draft → submitted)           
         │                       
         ├────────────────────── 3. Trip appears in
         │                          analyst queue
         │                          (/analyst/queue)
         │                              │
         │                              ▼
         │                       4. Analyst reviews
         │                          18 sections
         │                          (/analyst/trip-review/[tripId]/*)
         │                              │
         │                       5. Analyst creates issues
         │                          (/analyst/trip-review/[tripId]/issues)
         │                              │
         ◄──────────────────────────────┤
6. Client views issues                  │
   (/trips/[tripId]/issues)             │
   Resolves issues                      │
         │                              │
         ├────────────────────────────► │
         │                       7. Analyst approves
         │                          (/analyst/trip-review/[tripId]/approval)
         │                              │
         │                              ├─────────────────── 8. HQ monitors
         │                              │                       (/hq/trips)
         │                              │                       (/hq/overview)
         ◄──────────────────────────────┤
9. Client receives                      
   approved packet                      
   (/trips/[tripId]/packets)            
```

### 4B. Shared Data Entities Across Portals

| Entity | Client Creates | Analyst Reviews | HQ Monitors | Shared Hook/API |
|--------|---------------|-----------------|-------------|-----------------|
| Trip | Yes (wizard) | Yes (18 sections) | Yes (list) | `queryKeys.client.trips` |
| Participants | Yes (step 3) | Yes (section 2) | No | `queryKeys.client.participants` |
| Issues | Views/resolves | Creates/manages | No | `use-issue-read-status.ts` (shared) |
| Digests | Views | Creates/distributes | No | `queryKeys.digests` (cross-portal) |
| Organizations | Belongs to one | N/A | Manages all | `queryKeys.hq.organizations` |
| Checklists | N/A | Uses | Manages | `queryKeys.hq.checklists` |

### 4C. Cross-Portal Navigation Handoffs

The trip detail pages (`/trips/[tripId]/*`) are accessible by all 3 portal roles. Role-aware back navigation adapts:

| User Role | Breadcrumb Home | Breadcrumb "Trips" | Sidebar Back |
|-----------|-----------------|--------------------|--------------| 
| Client (org_admin) | `/dashboard` | `/trips` → "Trips" | `/trips` → "Trip Management" |
| Analyst | `/analyst/dashboard` | `/analyst/queue` → "Queue" | `/analyst/queue` → "Back to Queue" |
| HQ (hq_admin) | `/hq/overview` | `/hq/trips` → "HQ Trips" | `/hq/trips` → "Back to HQ Trips" |

This is well-implemented. The role detection uses a shared `HQ_ROLES` constant.

---

## 5. Search and Findability

### 5A. Current Search Capabilities

| Capability | Status | Location |
|------------|--------|----------|
| Global search (cmd+k / universal) | **Missing** | -- |
| Help Center search | Exists | `/help/search` |
| Trip search/filter | **Missing** | Client `/trips` page (AG-Grid only) |
| Organization search | **Missing** | HQ `/hq/organizations` (AG-Grid only) |
| User search | **Missing** | HQ `/hq/users` (AG-Grid only) |
| Participant search | **Missing** | Analyst roster (AG-Grid only) |
| POI/Place search | Exists | Trip creation, analyst safety features |

### 5B. Findability Risk Assessment

| Risk | Severity | Affected Portal | Detail |
|------|----------|-----------------|--------|
| No global search | **HIGH** | All | Users have no keyboard shortcut or universal search to jump between entities (trips, participants, organizations) |
| HQ nav overload | **HIGH** | HQ | 27 items, 17 disabled. Users must scan past non-functional items to find the 10 working ones |
| No breadcrumbs in analyst portal | **MEDIUM** | Analyst | Trip review has sidebar but no breadcrumb trail. Users lose position context in 18-section workflow |
| No breadcrumbs in HQ portal | **MEDIUM** | HQ | No breadcrumbs on any HQ page |
| AG-Grid as sole filter mechanism | **MEDIUM** | All | Tables provide column filtering but no saved filters, no "search within this list" pattern |

---

## 6. Labeling and Terminology Consistency

### 6A. Cross-Portal Terminology Audit

| Concept | Client Portal | Trip Detail | Analyst Review | Wizard | Issue |
|---------|--------------|-------------|----------------|--------|-------|
| People on trip | "Teams & Travelers" | "Participants" | "Participants" | "Participants" | **Client nav uses different term** |
| Air travel | -- | "Air Travel" | "Air Travel" | "Air Travel" (label) / "flights" (URL) | **URL mismatch** |
| Safety assessment | -- | "Safety Review" | "Safety" | -- | **Different labels** |
| Safety locations | -- | "Guidance" | -- | -- | **Unique to trip-detail** |
| Emergency planning | -- | "Emergency Preparedness" | "Emergency Prep" | -- | **Abbreviation inconsistency** |
| Trip safety docs | "Packets" | "Packets" | "Packet Builder" | -- | **Analyst adds "Builder"** |
| Filed problems | -- | "Issues" | "Issues" | -- | Consistent |
| Trip communications | -- | -- | "Comms Log" | -- | **Abbreviation** |
| Analyst feedback | -- | "Analyst Notes" | -- | -- | **Trip-detail only** |
| Review activity | -- | -- | "Evidence & Activity" | -- | **Analyst only** |
| Intel | "Intel Alerts" (disabled) | -- | "Intel Alerts" | -- | Consistent |
| Trip summary docs | -- | "Digests" | "Digests" | -- | Consistent |
| Guardian controls | -- | -- | -- | -- | HQ: "Guardian Governance" (nav) / "guardian-overrides" (URL) |

### 6B. Severity Rating

| Issue | Severity | Impact |
|-------|----------|--------|
| "Teams & Travelers" vs "Participants" | **HIGH** | Core navigation term mismatch between portal nav and every other context |
| "Safety Review" vs "Safety" | **MEDIUM** | Different labels for what appears to be related content |
| "Emergency Preparedness" vs "Emergency Prep" | **LOW** | Abbreviation, clear intent |
| "flights" URL vs "Air Travel" label | **MEDIUM** | URL does not match label; predictability failure |
| "Packets" vs "Packet Builder" | **LOW** | Role-appropriate variant; analysts build, clients receive |
| "Comms Log" abbreviation | **LOW** | Could confuse first-time users; "Communications Log" clearer |

---

## 7. Trip Creation Wizard Analysis

### 7A. Step Flow and Information Density

| Step | Label | URL | Key Data Collected | Info Density |
|------|-------|-----|--------------------|--------------|
| 1 | Trip Type | `/trips/new/type` | T1/T2/T3 selection | LOW (1 choice) |
| 2 | Information | `/trips/new/info` | Name, description, purpose, dates, locations, POC, rally point | **HIGH** (12+ fields) |
| 3 | Participants | `/trips/new/participants` | People list with roles, contacts, DOB, guardian links | **HIGH** (repeating group) |
| 4 | Air Travel | `/trips/new/flights` | Flight details (airline, number, times, airports) | MEDIUM (repeating group, optional) |
| 5 | Lodging | `/trips/new/lodging` | Property details, dates, reservation codes | MEDIUM (repeating group, optional) |
| 6 | Venues | `/trips/new/venues` | Venue names, addresses, visit details | MEDIUM (repeating group) |
| 7 | Itinerary | `/trips/new/itinerary` | Day-by-day schedule with auto-populated events | **HIGH** (complex, aggregated) |
| 8 | Transportation | `/trips/new/transportation` | Ground transport legs between events | MEDIUM (auto-generated, requires assignment) |
| 9 | Add-ons | `/trips/new/addons` | Insurance, dietary, accessibility | LOW (toggles + options) |
| 10 | Review | `/trips/new/review` | Final confirmation of all data | READ-ONLY |

### 7B. Wizard Strengths

- URL-based routing with Zustand sync ensures bookmark-ability and back button support
- Summary sidebar (right rail) provides persistent context showing trip stats as they accumulate
- Each step has an embedded `info` object with "How To", "Tips", and field descriptions
- Step completion tracking via `markStepCompleted` with `completedStepIds` set
- Progressive disclosure: T1 trips skip certain steps logically

### 7C. Wizard Findings

| Finding | Severity | Detail |
|---------|----------|--------|
| Step 2 overloaded | **MEDIUM** | "Information" collects 12+ fields: name, description, purpose, start/end dates, departure/destination locations, POC (4 fields), rally point (3 fields). Consider splitting into "Basic Info" + "Contacts & Rally" |
| No step skipping indicator | **LOW** | Steps 4-6 are optional for T1 trips but there is no visual skip/N/A state in the step indicators |
| No save-and-exit | **MEDIUM** | Wizard uses Zustand persist (localStorage) for draft auto-save, but there is no explicit "Save & Exit" button visible in the navigation component |
| Step names in URL inconsistent | **MEDIUM** | Step 4 URL is `/flights` but label is "Air Travel"; Step 7 uses `/itinerary` but an alternate route `/trips/new/day-by-day` also exists as a page file |

---

## 8. Analyst Review Workspace Organization

### 8A. 18-Section Review Workflow

The analyst review workspace uses a numbered sequential sidebar (1-18) with completion tracking. Each section has a colored progress indicator that shifts from uncompleted (muted) to completed (gradient with checkmark).

| # | Section | Slug | Icon | Category (Implicit) |
|---|---------|------|------|---------------------|
| 1 | Overview | overview | LayoutDashboard | Summary |
| 2 | Participants | participants | Users | People |
| 3 | Air Travel | air-travel | Plane | Logistics |
| 4 | Lodging | lodging | Building2 | Logistics |
| 5 | Venues | venues | MapPin | Logistics |
| 6 | Itinerary | itinerary | Calendar | Logistics |
| 7 | Transportation | transportation | Car | Logistics |
| 8 | Safety | safety | Shield | Safety |
| 9 | Emergency Prep | emergency-preparedness | HeartPulse | Safety |
| 10 | Documents | documents | FileText | Compliance |
| 11 | Background Checks | background-checks | UserCheck | Compliance |
| 12 | Intel Alerts | intel-alerts | AlertTriangle | Safety |
| 13 | Issues | issues | CircleAlert | QA |
| 14 | Evidence & Activity | evidence | FolderOpen | QA |
| 15 | Checklists | checklists | ClipboardCheck | QA |
| 16 | Packet Builder | packet | Package | Deliverable |
| 17 | Comms Log | comms | Mail | Communication |
| 18 | Approval | approval | CheckCircle | Decision |

### 8B. Analyst Review Findings

| Finding | Severity | Detail |
|---------|----------|--------|
| No section grouping | **MEDIUM** | Unlike trip-detail sidebar (which groups into People, Logistics, Safety, etc.), the analyst sidebar presents all 18 sections as a flat numbered list. At 18 items this creates scanning burden. Grouping with visual separators would improve scanability. |
| Implicit ordering logic | **LOW** | Sections follow a logical flow: Overview first, then data review (2-7), safety assessment (8-9, 12), compliance (10-11), QA (13-15), deliverable (16), communication (17), decision (18). This is well-structured but the logic is not made explicit to the user. |
| Orphan briefings page | **HIGH** | `/analyst/trip-review/[tripId]/briefings/page.tsx` exists as a route file but is NOT in `REVIEW_SECTIONS`. This page is unreachable via navigation. Either add it to REVIEW_SECTIONS or delete the file. |
| Completion tracking is per-session | **MEDIUM** | `useSectionCompletion` tracks which sections are marked complete. Verify this persists across sessions/page reloads (likely via Zustand persist or API). |
| Issues badge is the only badge | **LOW** | Only section 13 (Issues) shows an unread count badge. Sections like Checklists (incomplete items) or Intel Alerts (new alerts) could benefit from count indicators. |

---

## 9. Summary of Critical Findings

### Severity: HIGH

| # | Finding | Location | Impact | Recommendation |
|---|---------|----------|--------|----------------|
| H1 | **HQ nav cognitive overload**: 27 items, 17 disabled (63%) | `/hq/layout.tsx` | Users cannot efficiently scan navigation | Hide disabled groups entirely; show only functional items; add a "Coming Soon" page accessible from a single link |
| H2 | **No global search**: Zero universal search capability | All portals | Users with specific targets (trip name, participant, org) have no keyboard shortcut or search bar | Implement cmd+k command palette with entity-type scoped search |
| H3 | **Orphan route**: `/analyst/trip-review/[tripId]/briefings` exists but is not in REVIEW_SECTIONS | `review-sections.ts` | Dead page that could be discovered via direct URL but not via UI | Add to REVIEW_SECTIONS constant or remove the page file |
| H4 | **"Teams & Travelers" vs "Participants"**: Core terminology split | Client layout vs every other context | Users build inconsistent mental models about how people are labeled | Standardize to "Participants" everywhere, or relabel to "People" |

### Severity: MEDIUM

| # | Finding | Location | Impact | Recommendation |
|---|---------|----------|--------|----------------|
| M1 | URL/label mismatch on wizard step 4 | `/trips/new/flights` labeled "Air Travel" | Predictability failure; URL doesn't match what user sees | Rename route to `/trips/new/air-travel` |
| M2 | Settings use query params instead of URL segments | `/settings/organization?section=branding` | Inconsistent with segment-based routing everywhere else; not bookmarkable in same way | Convert to segment-based: `/settings/organization/branding` |
| M3 | Help sidebar back link hardcoded to `/trips` | `help-sidebar.tsx` | HQ and analyst users return to wrong portal | Make back link role-aware like trip-detail and analyst-review sidebars |
| M4 | No breadcrumbs in analyst or HQ portals | `analyst/layout.tsx`, `hq/layout.tsx` | Users lose wayfinding context in deep pages | Add breadcrumb component to analyst and HQ page headers |
| M5 | Wizard step 2 ("Information") collects 12+ fields | `/trips/new/info` | High cognitive load in single step | Consider splitting into "Basic Info" and "Contacts & Rally" |
| M6 | Dual route ambiguity for client trip pages | `(client)/trips/[tripId]/issues-comms` vs `(trip-detail)/trips/[tripId]/issues` | Same URL path, two route groups with different layouts could cause Next.js routing conflicts | Audit and consolidate; ensure each path resolves to exactly one route |
| M7 | Analyst review sections are flat (no groups) | `trip-review-sidebar.tsx` | 18 items in a flat list; scanning burden | Add visual group separators (Logistics / Safety / QA / Deliverable) |
| M8 | "Safety Review" (trip-detail) vs "Safety" (analyst) | `trip-detail-sidebar.tsx` vs `review-sections.ts` | Same concept, different labels across portals | Standardize to one term |

### Severity: LOW

| # | Finding | Location | Impact | Recommendation |
|---|---------|----------|--------|----------------|
| L1 | "Emergency Preparedness" vs "Emergency Prep" abbreviation | Trip-detail vs analyst sidebar | Minor inconsistency | Pick one; full name preferred for clarity |
| L2 | Multiple unlisted routes (edit, payment, documents) | Trip-detail route group | Pages accessible by URL but not via nav | Document as intentional deep-links or add to navigation |
| L3 | `/hq/payments` page exists but not in nav | `hq/payments/page.tsx` | Unreachable via navigation | Add to Management group or remove |
| L4 | Day-by-day alternate route | `/trips/new/day-by-day/page.tsx` exists alongside `/trips/new/itinerary` | Potential dead route | Verify if day-by-day is still used; consolidate if not |
| L5 | Help sidebar not collapsible | `help-sidebar.tsx` | Inconsistent with all other sidebars | Add collapse support for consistency |

---

## 10. Structural Health Scorecard

| Dimension | Score | Notes |
|-----------|-------|-------|
| **Navigation Predictability** | 3/5 | Good within portals; inconsistent labels across portals |
| **URL Structure Consistency** | 3/5 | Mostly good; several URL/label mismatches; query param settings |
| **Role-Based Navigation** | 4/5 | Well-implemented for portal routing and back-nav; no differentiation within HQ roles or client roles |
| **Terminology Consistency** | 2/5 | Multiple terms for same concepts; "Teams & Travelers" vs "Participants" is the most visible |
| **Information Density Balance** | 3/5 | Wizard step 2 overloaded; HQ nav bloated with disabled items; analyst 18-section flat list |
| **Search & Findability** | 1/5 | No global search; no entity search; relies entirely on navigation and AG-Grid filtering |
| **Wayfinding (Breadcrumbs)** | 2/5 | Only trip-detail has breadcrumbs; analyst and HQ portals have none |
| **Cross-Portal Coherence** | 3/5 | Data flows logically client→analyst→HQ; shared hooks exist; labeling inconsistencies hurt |
| **Dead/Orphan Route Hygiene** | 3/5 | Several orphan pages and dual routes identified; manageable debt |
| **Accessibility (Structural)** | 3/5 | `<nav>` elements used; sr-only sheet titles; no skip links detected; no ARIA landmarks beyond nav |

**Overall IA Health: 2.7 / 5.0** — Functional but with significant terminology, search, and wayfinding gaps that will compound as the product scales.

---

## Key Files Referenced

- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/(client)/layout.tsx` — Client portal navigation definition
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/analyst/layout.tsx` — Analyst portal navigation definition
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/app/hq/layout.tsx` — HQ console navigation definition (27 items, 17 disabled)
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/client/components/trip-detail/trip-detail-sidebar.tsx` — Trip detail sidebar with 7 groups, 20 items
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/analyst/components/trip-review/trip-review-sidebar.tsx` — Analyst review sidebar with 18 numbered sections
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/analyst/constants/review-sections.ts` — REVIEW_SECTIONS constant (18 sections; briefings NOT included)
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/types/trip-draft.ts` — WIZARD_STEPS constant (10 steps) and all trip data types
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/shared/components/layout/sidebar.tsx` — Shared sidebar component (NavItem, NavGroup types)
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/client/components/help/help-sidebar.tsx` — Help sidebar (hardcoded back link)
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/shared/auth/auth-provider.tsx` — Role-based redirect logic
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/client/components/trip-detail/trip-detail-header.tsx` — Breadcrumb implementation (only trip-detail)
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/client/components/settings/org-settings-nav.tsx` — Query param-based settings navigation
- `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/shared/query/query-keys.ts` — Query key factory showing data domain boundaries