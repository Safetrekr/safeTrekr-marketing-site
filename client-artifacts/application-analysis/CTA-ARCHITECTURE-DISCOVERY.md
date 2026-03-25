# SafeTrekr Architecture Discovery Analysis

**Prepared by:** Chief Technology Architect
**Date:** 2026-03-17
**Branch:** wireUp5
**Methodology:** Full codebase traversal, database schema inspection, service inventory, feature completeness audit

---

## Executive Summary

SafeTrekr is a substantial multi-tenant travel safety management platform comprising approximately **286,000 lines of production code** across six services, backed by **116 PostgreSQL tables** with Row Level Security. The platform demonstrates a remarkably ambitious scope: three distinct web portals (Client, Analyst, HQ), a native mobile app with offline-first capabilities, a real-time intelligence ingestion pipeline, and a 12-feature Monte Carlo risk scoring engine.

The architecture is fundamentally sound -- bounded service responsibilities, shared data layer with RLS, factory-pattern API abstractions, and a well-considered RBAC model with 10 roles. However, the project exhibits a classic "wide-then-deep" build pattern: many features exist at the schema and UI shell level but lack end-to-end data flow. The intel pipeline (TarvaRI) has full worker infrastructure but zero records flowing through it. The risk engine tables are empty. Guardian consent, background checks, and insurance features have schemas but no production usage.

The system's greatest immediate risk is not technical debt in the traditional sense, but rather the **breadth-depth gap** -- the distance between what the database schema promises and what actually functions end-to-end.

---

## Key Findings

1. **Massive codebase, single-developer velocity pattern.** 286K LOC across 4 primary services (183K web, 47K mobile, 32K Core API, 24K TarvaRI) with a dense MEMORY.md that documents bug-fix-by-bug-fix history typical of a solo or very small team shipping fast.

2. **116 database tables, but many are hollow.** Of 116 tables, at least 40 contain zero rows. Critical subsystems (risk_assessments, calibration_logs, delivery_cards, coas, trigger_matrix, vulnerability_layers, exposure_layers) exist only as schema. The intel pipeline tables (intel_normalized, intel_bundles, triage_decisions, org_routing, delivery_cards) are all empty despite having full worker code.

3. **The trips.py god file is the system's single largest risk.** At 5,182 lines, this single route file handles trip creation, finalization, participant management, itinerary, flights, transportation, lodging, venues, and more. A failure in this file affects every trip workflow. It is untestable at its current size.

4. **Security posture has known gaps.** The schema documentation explicitly notes that development RLS policies (anonymous access) are still present and must be removed before production. Multiple intel-pipeline tables have `rls_enabled: false`. The dual user ID system (auth.users.id != public.users.id) has caused recurring production bugs.

5. **The mobile app is architecturally mature but operationally fragile.** Seven providers (Auth, Location, Geofence, Notification, Offline, Trip, Theme) totaling 2,835 lines coordinate complex device capabilities. The EAS build system fights with pnpm workspace linking, evidenced by repeated commits fixing build issues.

6. **The Analyst portal is the most feature-complete vertical.** 17 review sections, a queue management system, checklist progress tracking, comment threading, issue management, and approval workflows -- all with real data (1,197 review section statuses, 245 checklist items, 12 comments).

7. **The shared core-logic package is underdeveloped.** Despite being the architectural bridge between web and mobile, `packages/core-logic` contains only 7 source files. The mobile app has its own copy at `safetrekr-traveler-native/packages/core-logic/`, creating a parallel maintenance burden.

8. **The TarvaRI intel pipeline is fully architected but dormant.** Five workers (Ingest, Bundle, Route, Deliver, Cleanup), 10 parsers (NWS, USGS, CDC, GDACS, ReliefWeb, State Dept, FAA, FEMA, generic RSS/GeoJSON), a risk scoring service with Monte Carlo uncertainty bands -- all built, none actively processing data in production.

9. **Payment and billing infrastructure is partially wired.** Stripe integration exists in both the Core API (webhooks, payments routes) and marketing site (checkout). 20 billing transactions exist. But the pricing engine (4 pricing rules) and wallet/credits system appear early-stage.

10. **The dual auth store desync is the most dangerous known bug.** Documented in MEMORY.md: Supabase's internal session store and Zustand's persisted store can desync, causing permanent auth failure in production until the user clears localStorage. The fix (redirect on SIGNED_OUT instead of silent clear) is a patch, not a cure.

---

## Feature Inventory

### Trip Management (Client Portal)

- **Trip Creation Wizard** (12-step flow: type, info, participants, flights, lodging, venues, transportation, itinerary, day-by-day, addons, review, finalize)
  - **User Value:** Organizations create fully specified group travel plans with all logistics in one flow
  - **Technical Implications:** The finalize endpoint (trips.py) orchestrates inserts into 8+ tables in a single transaction. The wizard state is managed as trip_drafts (134 in DB). Empty-string-to-date conversion bugs were a critical fix.
  - **Priority Assessment:** Critical -- this is the core product workflow

- **Trip Detail Management** (20+ sub-pages: overview, participants, air-travel, lodging, venues, transportation, itinerary, documents, background-checks, emergency-preparedness, safety-review, issues, analyst-notes, digests, packets, payment, transactions, guidance, settings, edit)
  - **User Value:** Full lifecycle management of active trips
  - **Technical Implications:** Heavy use of Supabase PostgREST with factory-pattern APIs. Real data exists: 106 trips, 246 participants, 109 flights, 72 lodgings, 101 venues, 246 transportation legs, 492 itinerary events.
  - **Priority Assessment:** Critical

- **Trip Drafts** (134 drafts in DB)
  - **User Value:** Save-and-resume trip creation
  - **Technical Implications:** JSONB storage in trip_drafts table, separate from finalized trips table
  - **Priority Assessment:** High

### Safety Analyst Portal

- **Review Queue Management** (75 items in review_queue)
  - **User Value:** Analysts triage and process trip safety reviews
  - **Technical Implications:** Queue with assignment, SLA tracking. Analyst dashboard, queue page, roster page all built.
  - **Priority Assessment:** Critical

- **17-Section Trip Review Workspace** (1,197 section statuses tracked)
  - **User Value:** Systematic safety evaluation of every trip dimension
  - **Technical Implications:** Sections: overview, participants, air-travel, lodging, venues, transportation, itinerary, safety, emergency-preparedness, background-checks, documents, intel-alerts, briefings, checklists, comms, evidence, packet, approval. Each section has its own Supabase API module.
  - **Priority Assessment:** Critical

- **Analyst Checklist Progress** (245 items tracked)
  - **User Value:** Standardized review process ensuring nothing is missed
  - **Technical Implications:** review_checklist_progress table with per-trip, per-analyst state
  - **Priority Assessment:** High

- **Issue Management & Comments** (2 issues, 12 comments in DB)
  - **User Value:** Flagging and discussing problems found during review
  - **Technical Implications:** Threaded comments with visibility control (note/question/concern/recommendation types)
  - **Priority Assessment:** High

- **Calibration System** (calibration page exists, calibration_logs table empty)
  - **User Value:** Prediction vs outcome tracking for model improvement
  - **Technical Implications:** Schema ready, UI page exists, no data flowing yet
  - **Priority Assessment:** Low (future)

### HQ Console (Internal Operations)

- **Organization Management** (104 organizations)
  - **User Value:** Platform admin creates/manages customer organizations
  - **Technical Implications:** Stripe billing integration, suspension via settings JSONB, invite-based admin provisioning
  - **Priority Assessment:** Critical

- **User Management** (243 users across 10 roles)
  - **User Value:** Manage all platform users, role assignment, suspension
  - **Technical Implications:** Complex role hierarchy, dual user ID mapping
  - **Priority Assessment:** Critical

- **Intel Source Configuration** (412 sources configured)
  - **User Value:** Configure which intelligence feeds are active
  - **Technical Implications:** Source definitions for all TarvaRI parsers. 412 records suggests bulk seeding. Most sources likely disabled.
  - **Priority Assessment:** Medium

- **Feature Flags** (flags page built)
  - **User Value:** Runtime feature toggling
  - **Technical Implications:** UI exists, underlying storage mechanism unclear
  - **Priority Assessment:** Medium

- **Policy Management** (policies page, JSON editor)
  - **User Value:** Configurable safety policies per organization
  - **Technical Implications:** JSON policy documents, editor UI built
  - **Priority Assessment:** Medium

- **Finance & Payments** (finance page, wallet detail, order management)
  - **User Value:** Track financial transactions and credits
  - **Technical Implications:** billing_transactions (20 rows), credits system on organizations table, Stripe webhook handling
  - **Priority Assessment:** High

- **Guardian Governance** (guardian overrides page)
  - **User Value:** Override guardian requirements for special cases
  - **Technical Implications:** guardian_bypass_acknowledgments, data_override_requests, guardian_data_conflicts tables (all 0 rows)
  - **Priority Assessment:** Low (future)

- **Audit Trail** (audit page built)
  - **User Value:** Compliance visibility into all system actions
  - **Technical Implications:** audit_logs table (0 rows), analyst_activity (4 rows). Infrastructure exists but not comprehensively populated.
  - **Priority Assessment:** Medium

### Intelligence Pipeline (TarvaRI)

- **Multi-Source Intel Ingestion** (10 parsers built)
  - **User Value:** Automated monitoring of weather, seismic, health, humanitarian, and security threats
  - **Technical Implications:** NWS CAP, USGS Earthquake, CDC RSS, ReliefWeb REST, GDACS RSS/CAP, State Dept CSV, FAA NOTAM, FEMA Disaster, generic RSS, generic GeoJSON. Connector framework supports REST, RSS, WebSocket, WMS.
  - **Priority Assessment:** High -- core differentiator, but currently dormant

- **Intel Bundling & Deduplication** (bundler worker built)
  - **User Value:** Reduces noise by clustering related intel items
  - **Technical Implications:** 50km radius, 24-hour window clustering. Uses lineage_hash for dedup. intel_bundles table: 0 rows.
  - **Priority Assessment:** High (blocked by ingestion activation)

- **AI-Powered Trip Matching** (alert router worker built)
  - **User Value:** Automatically routes relevant alerts to affected trips
  - **Technical Implications:** Spatial overlap analysis, temporal window matching. Integrates with TarvaCORE for semantic reasoning (mock mode available).
  - **Priority Assessment:** High (blocked by bundling activation)

- **12-Feature Risk Scoring Engine** (risk_scoring_service.py)
  - **User Value:** Quantified risk assessment with uncertainty bands
  - **Technical Implications:** Monte Carlo simulation producing P5/P50/P95 percentiles. 12 features across Hazard (40%), Exposure (20%), Vulnerability (20%), Exfil (15%), Confidence (5%). Model versioning table exists.
  - **Priority Assessment:** High (differentiator, but 0 rows in risk_assessments)

- **Multi-Channel Alert Delivery** (delivery worker built)
  - **User Value:** Travelers receive safety alerts via push, email, SMS
  - **Technical Implications:** Delivery policy per org/role, quiet hours, escalation. Expo push + SendGrid email + SMS. delivery_cards, deliveries, delivery_dlq tables all empty.
  - **Priority Assessment:** High (blocked by routing activation)

### Mobile App (Expo/React Native)

- **Trip-Centric Navigation** (tab-based: Today, Schedule, Packet, Safety, Alerts, Checkins, Documents, Map, Help, Settings)
  - **User Value:** Travelers access all trip information from a single app
  - **Technical Implications:** Expo Router file-based routing, trip context provider, trip switcher for multi-trip users
  - **Priority Assessment:** Critical

- **Real-Time Location Tracking** (LocationProvider: 587 lines)
  - **User Value:** Trip leaders see where all participants are
  - **Technical Implications:** Background location tasks, permission management, participant_locations table (17 rows). expo-location with foreground/background modes.
  - **Priority Assessment:** High

- **Geofencing** (GeofenceProvider: 635 lines)
  - **User Value:** Automatic alerts when travelers enter/leave designated zones
  - **Technical Implications:** geofences table (3 rows), geofence_violations (1 row). Auto-sync from rally points and lodging.
  - **Priority Assessment:** High

- **Offline-First Architecture** (OfflineProvider + expo-sqlite)
  - **User Value:** App works without connectivity (critical for international travel)
  - **Technical Implications:** SQLite local DB, operation queue for sync, network connectivity monitoring
  - **Priority Assessment:** High

- **Push Notifications** (NotificationProvider: 356 lines)
  - **User Value:** Real-time safety alerts on device
  - **Technical Implications:** Expo push tokens, categorized notification channels (safety, trip, checkin, broadcast)
  - **Priority Assessment:** High

- **Onboarding Wizard** (10-step flow)
  - **User Value:** Guided setup for new trip participants
  - **Technical Implications:** Welcome, CreatePassword, ConfirmInfo, VerifyContact, LegalConsent, ConsentMedical, BackgroundCheck, ProfilePhoto, NotificationPrefs, TripSafetyOverview, AllSet
  - **Priority Assessment:** Critical (first-time user experience)

- **Safety Map with Rally Points/Safe Houses**
  - **User Value:** Visual safety information overlay on maps
  - **Technical Implications:** MapLibre GL, real data: 35 rally points, 32 safe houses
  - **Priority Assessment:** High

- **Passport/Document Management** (BiometricGate, PassportUploadFlow)
  - **User Value:** Secure document storage on device
  - **Technical Implications:** Biometric authentication, secure document store
  - **Priority Assessment:** High

- **Role-Based Views** (TravelerTodayView, ChaperoneTodayView, GuardianTodayView)
  - **User Value:** Tailored experience based on participant role
  - **Technical Implications:** Role switcher, conditional rendering
  - **Priority Assessment:** High

### Cross-Cutting Capabilities

- **Invite & Onboarding Pipeline** (112 invites, 84 onboarding tokens)
  - **User Value:** Seamless user provisioning from trip creation to app usage
  - **Technical Implications:** HMAC token generation, SendGrid delivery with webhook tracking, analytics, suppression list
  - **Priority Assessment:** Critical

- **Protection System** (rally points, safe houses, musters, check-ins)
  - **User Value:** Physical safety infrastructure for active trips
  - **Technical Implications:** PostGIS geometry, analyst approval, AI suggestions, geofence auto-sync. Data: 35 rally points, 32 safe houses.
  - **Priority Assessment:** High

- **Emergency Preparedness** (6 records + contacts/services)
  - **User Value:** Pre-planned emergency response for each trip
  - **Technical Implications:** ep_contacts (7), ep_local_services (1), country profiles (51 countries)
  - **Priority Assessment:** High

- **Packet Generation** (33 packets, 6 versions)
  - **User Value:** Publishable trip information packets for travelers
  - **Technical Implications:** JSON content with PDF generation, version history
  - **Priority Assessment:** High

- **Background Checks** (schema ready, 0 records)
  - **User Value:** Compliance for adults supervising minors
  - **Technical Implications:** Checkr/Sterling integration defined, consent tracking, credit deduction
  - **Priority Assessment:** Medium (compliance-critical but unused)

- **Country Intelligence** (51 profiles, 34 embassy locations)
  - **User Value:** Destination-specific safety information
  - **Technical Implications:** Emergency numbers, risk levels, advisories, embassy/consulate locations
  - **Priority Assessment:** Medium

---

## Opportunities & Gaps

### Critical Gaps

1. **Intel Pipeline is Dormant** -- The most technically impressive subsystem (TarvaRI) has zero data flowing through it. All 5 workers are built, 10 parsers exist, the risk engine is coded, but intel_normalized, intel_bundles, triage_decisions, and delivery_cards all contain 0 rows. This is the platform's primary differentiator and it is non-operational.

2. **RLS Security Policies are Incomplete** -- The schema documentation itself warns that anonymous-access development policies must be removed. Multiple tables have `rls_enabled: false`. This is a compliance blocker for any organization handling minor traveler PII.

3. **The trips.py Monolith** -- At 5,182 lines, this single file is the load-bearing wall of the entire platform. It handles finalization logic for 8+ related tables. A refactoring into domain-specific sub-modules is urgently needed.

4. **Dual Auth Store has No Permanent Fix** -- The documented workaround (redirect on SIGNED_OUT) is fragile. The fundamental problem -- two independent session stores that can desync -- requires an architectural solution.

5. **No Automated Test Coverage on Critical Paths** -- Despite test infrastructure (pytest, Vitest, Playwright), the bug history in MEMORY.md shows critical failures (email sending, date casting, category mapping) were discovered manually, not by tests.

6. **Shared Core-Logic Package is Vestigial** -- The package at `packages/core-logic` contains 7 files. The mobile app duplicates it at `safetrekr-traveler-native/packages/core-logic/`. This defeats the monorepo's purpose of code sharing.

### Scalability Risks

1. **Supabase Free Tier Constraints** -- TarvaRI's worker documentation warns about connection limits and database size (6GB+ without cleanup). The 5-minute polling default is a free-tier safety measure.

2. **Single Redis Instance** -- One Redis serves both Core API caching and TarvaRI job queues. Under load, cache evictions could impact job processing.

3. **No Database Connection Pooling Strategy** -- Multiple services connect to the same Supabase PostgreSQL. Connection exhaustion is a real risk at scale.

4. **Monolithic Next.js Serving Three Portals** -- Client, Analyst, and HQ portals in one deployment. A traffic spike on Client affects Analyst and HQ.

### Technical Debt

1. **God Files:** trips.py (5,182 lines), AuthProvider.tsx (620 lines), GeofenceProvider.tsx (635 lines), LocationProvider.tsx (587 lines)
2. **Hollow Tables:** ~40 tables with 0 rows represent committed schema without delivering value
3. **Inconsistent RLS:** Mix of enabled/disabled across tables with no clear pattern
4. **Duplicate Core Logic:** Two copies of the core-logic package
5. **Documentation Sprawl:** TarvaRI has 25+ root-level markdown files, many likely outdated
6. **Binary Artifacts in Git:** 40+ PNG screenshots at monorepo root (~15MB)
7. **Credentials in Repo:** `stripe_creds.md` exists at the repo root

---

## Recommendations

### 1. Activate the TarvaRI Intel Pipeline End-to-End (Priority: CRITICAL)

The platform's most compelling differentiator -- automated safety intelligence -- sits fully built but dormant. Immediate actions:
- Enable 2-3 pilot sources (NOAA NWS, USGS Earthquakes, GDACS) with 5-minute polling
- Verify the Ingest -> Bundle -> Route -> Deliver pipeline with a real trip
- Stand up monitoring on worker health and table row counts
- Validate that trip_alerts reach the mobile app's alert views

This unblocks the core value proposition and generates production data for every downstream feature.

### 2. Decompose trips.py into Domain Modules (Priority: HIGH)

Split the 5,182-line god file into focused modules:
- `trip_core.py` -- CRUD, status transitions, basic queries
- `trip_finalize.py` -- The finalization orchestrator
- `trip_participants.py` -- Participant management
- `trip_flights.py` -- Flight operations
- `trip_lodging.py` -- Lodging operations
- `trip_venues.py` -- Venue operations
- `trip_transportation.py` -- Ground transport
- `trip_itinerary.py` -- Itinerary event management

Each module gets its own test file. The finalize endpoint becomes an orchestrator that calls domain services.

### 3. Harden Auth and RLS Before Any Production Deployment (Priority: CRITICAL)

Three parallel workstreams:
- **Audit and fix all RLS policies:** Remove every "development" anonymous-access policy. Enable RLS on all tables with `rls_enabled: false`. Implement proper policies for intel tables.
- **Resolve the dual auth store:** Migrate to a single source of truth for auth state. The Supabase session should be canonical; Zustand should derive from it.
- **Remove `stripe_creds.md`** from the repository and rotate any credentials it contains.

### 4. Consolidate the Shared Core-Logic Package (Priority: HIGH)

- Define canonical types, schemas, and API interfaces in `packages/core-logic`
- Wire both web and mobile to consume from the single package via pnpm workspace
- Migrate shared hooks from mobile duplication into the shared package
- Establish contract tests: any type change in core-logic must pass in both consumers

### 5. Establish Critical-Path E2E Tests (Priority: HIGH)

The minimum viable test suite must cover:
- Trip creation wizard through finalization (catches date casting, category mapping, FK violations)
- Invite sending end-to-end (catches the email attribute errors documented in MEMORY.md)
- Auth lifecycle including session expiry and re-authentication (catches dual-store desync)
- Mobile deep-link onboarding flow

These tests should run on every PR and gate merges.

---

## Dependencies & Constraints

### Infrastructure Constraints

| Constraint | Impact | Mitigation |
|---|---|---|
| Supabase hosted PostgreSQL | Connection limits, no custom extensions beyond PostGIS/pgVector | Connection pooling (PgBouncer built-in), upgrade to Pro plan before scaling |
| Single Redis 7 instance | Shared between caching and job queues | Separate Redis instances per concern as traffic grows |
| EAS Build for mobile | Complex pnpm workspace linking, repeated build failures | Consider simplifying to standalone mobile build with npm-packed shared deps |
| Doppler for secrets | Runtime injection, not baked at build time | Requires Doppler availability for every deploy |

### Scaling Considerations

| Dimension | Current State | 10x Growth Plan |
|---|---|---|
| Organizations | 104 | RLS audit, per-org rate limiting |
| Trips | 106 | trips.py decomposition, read replicas |
| Participants | 246 | Bulk operations, pagination |
| Intel Sources | 412 (configured) | Worker horizontal scaling, separate intel DB |
| Concurrent Users | Unknown | Load testing needed, CDN for static assets |
| Database Size | Unknown (cleanup dormant) | Activate cleanup worker, partition large tables |

### Migration Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| RLS policy changes break flows | High | Critical | Test against all 10 roles |
| trips.py refactoring regression | Medium | High | Write characterization tests before splitting |
| Auth store consolidation logout storm | Medium | High | Feature-flag migration, roll out per-org |
| TarvaRI activation floods database | Low | Medium | Start with 2-3 sources, monitor daily |
| Shared package breaks mobile build | Medium | Medium | Pin versions, mobile CI on core-logic changes |

### External Service Dependencies

| Service | Purpose | Risk Level |
|---|---|---|
| Supabase | Database, Auth, Storage, Realtime | High (single point of failure) |
| Redis | Caching, Job Queues | Medium (recoverable on restart) |
| SendGrid | Email delivery | Medium (degraded experience) |
| Stripe | Payments, billing | Medium (billing only) |
| Expo Push | Mobile notifications | Low (optional channel) |
| AviationStack | Flight lookup | Low (enhancement) |
| NOAA/USGS/CDC/GDACS/ReliefWeb | Intel sources | Low (graceful degradation) |

---

## Appendix: Codebase Metrics

| Service | Language | Files | Lines of Code | Tables Used |
|---|---|---|---|---|
| safetrekr-app-v2 (Web) | TypeScript | 1,043 | ~183,620 | ~70 |
| safetrekr-traveler-native (Mobile) | TypeScript | ~200 | ~47,432 | ~30 |
| safetrekr-core (API) | Python | ~67 | ~31,870 | ~80 |
| TarvaRI (Intel) | Python | ~82 | ~23,652 | ~20 |
| packages/core-logic (Shared) | TypeScript | 7 | ~500 | 0 |
| marketing-site | HTML/CSS/JS | ~30 | ~5,000 | 0 |
| **Total** | | **~1,429** | **~292,074** | **116** |

### Core API Route File Sizes (lines)

| Route File | Lines | Domain |
|---|---|---|
| trips.py | 5,182 | Trip management (GOD FILE) |
| invites.py | 1,759 | Invite pipeline |
| protection.py | 1,699 | Rally points, safe houses, musters |
| users.py | 1,218 | User management |
| invite_analytics.py | 1,008 | Invite metrics |
| orgs.py | 994 | Organization management |
| checklists.py | 933 | Checklist engine |
| auth.py | 866 | Authentication |
| advanced.py | 781 | Batch operations |
| alerts.py | 775 | Safety alerts |
| digests.py | 767 | Digest distribution |
| payments.py | 706 | Stripe integration |
| All others | < 700 each | Various domains |
| **Total** | **24,141** | 33 route files |

### Database Table Distribution

| Feature Area | Tables | With Data | Empty |
|---|---|---|---|
| Core Entities | 8 | 7 | 1 |
| Trip Details | 10 | 7 | 3 |
| Participants & Roles | 6 | 4 | 2 |
| Review & Analysis | 8 | 5 | 3 |
| Intel Pipeline | 12 | 2 | 10 |
| Protection | 7 | 5 | 2 |
| Risk Engine | 7 | 0 | 7 |
| Delivery & Notifications | 10 | 0 | 10 |
| Billing & Payments | 6 | 3 | 3 |
| Auth & Onboarding | 5 | 3 | 2 |
| Compliance | 8 | 1 | 7 |
| Emergency & Country Intel | 7 | 5 | 2 |
| Digests & Comms | 5 | 3 | 2 |
| System Config & Audit | 5 | 2 | 3 |
| Other | 12 | 3 | 9 |
| **Total** | **116** | **~50** | **~66** |
