# SafeTrekr Architecture Deep Analysis

**Date:** 2026-03-17
**Analyst:** Chief Technology Architect
**Branch:** wireUp5
**Scope:** Full monorepo -- 6 services, ~292K LOC, 120 database tables, 211 migrations

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Feature Documentation -- Current State](#2-feature-documentation)
3. [Enhancement Proposals](#3-enhancement-proposals)
   - EP-001: trips.py God File Decomposition
   - EP-002: Intel Pipeline Activation
   - EP-003: Auth Architecture Unification
   - EP-004: RLS Enforcement and Service Client Remediation
   - EP-005: Next.js Portal Decomposition
   - EP-006: Redis Topology Separation
   - EP-007: core-logic Package Consolidation
   - EP-008: Trip-Child Table Org Isolation
   - EP-009: EAS Build Pipeline Hardening
   - EP-010: Migration Governance
4. [Risk Assessment](#4-risk-assessment)
5. [Architecture Recommendations](#5-architecture-recommendations)
6. [Priority Recommendations](#6-priority-recommendations)

---

## 1. Executive Summary

SafeTrekr is a group travel safety platform spanning six services: a Next.js 15 admin/analyst portal (183K LOC), an Expo React Native traveler app (47K LOC), a FastAPI Core API (32K LOC), a TarvaRI intelligence pipeline (24K LOC), a vestigial shared TypeScript package (500 LOC), and a marketing site (5K LOC). The system uses Supabase PostgreSQL with 120 tables and Redis for caching and job queues.

**The system works.** Trips are created, finalized, reviewed, and delivered. The mobile app authenticates and renders role-specific experiences. The analyst portal processes 17-section trip reviews. Payments flow through Stripe. Email invites go out via SendGrid. This is not a broken system -- it is a system that has outgrown its scaffolding.

**The three systemic risks that will compound if unaddressed:**

1. **trips.py (5,182 lines, 44 endpoints)** is the single file through which every production bug traces. It handles trip CRUD, participant management, geofencing, alerts, musters, photos, guardian flows, emergency triggers, location tracking, scheduling, and the entire finalize-and-invite pipeline. One bad merge here stops every feature team.

2. **The entire RLS security model is bypassed.** All 272 route handlers use `get_service_supabase` (the service-key client that ignores Row Level Security). Zero handlers use `get_supabase` (the anon client that respects RLS). Combined with 46 tables that have RLS disabled entirely, the database has no access control below the application layer. A single endpoint bug exposes cross-organization data.

3. **The TarvaRI intelligence pipeline is fully built but completely dormant.** 412 intel sources are registered. Five workers (ingest, bundler, alert router, delivery, cleanup) are coded and containerized. The risk scoring engine with its 12-feature Monte Carlo model is complete. But zero rows exist in intel_normalized, intel_bundles, triage_decisions, org_routing, or delivery_cards. The alert router-to-delivery handoff is unwired. This represents months of engineering investment generating zero user value.

---

## 2. Feature Documentation

### 2.1 Service Inventory

| Service | Stack | LOC | Port | Purpose |
|---------|-------|-----|------|---------|
| safetrekr-app-v2 | Next.js 15, React, TanStack Query, Zustand, Supabase JS | 183,620 | 3000 | Admin portal (org admins), Analyst portal (trip review), HQ portal (platform ops), Client trip creation |
| safetrekr-traveler-native | Expo (React Native), NativeWind, Gluestack UI | 47,432 | 8081 | Traveler/Chaperone/Guardian mobile app |
| safetrekr-core | FastAPI, Pydantic v2, Redis, SendGrid, Expo Push | 31,870 (src/) | 8001 | REST API: auth, trips, invites, protection, checklists, payments, etc. |
| TarvaRI | FastAPI, structlog, HTTPX, lxml, Shapely | 45,919 | 8000 | Intel ingestion, parsing, bundling, triage, risk scoring, alert delivery |
| core-logic | TypeScript | ~500 | N/A | Shared types, API client base, hooks (vestigial) |
| marketing-site | (not analyzed) | ~5,000 | 5175 | Public marketing |

### 2.2 Database Schema (120 Tables)

**Core Domain (12 tables):**
- organizations (104 rows), users (243 rows), trips (106 rows), locations (3 rows)
- trip_participants (246 rows), trip_flights (109 rows), trip_lodging (72 rows)
- trip_venues (101 rows), trip_transportation (246 rows), itinerary_events (492 rows)
- trip_drafts (134 rows), trip_documents (0 rows)

**Review Domain (10 tables):**
- review_queue (75 rows), review_section_status (1,197 rows), review_checklist_progress (245 rows)
- review_comments (12 rows), review_approvals (1 row), review_issues (2 rows)
- review_issue_checklist_items (0), trip_briefs (0), trip_packets (33 rows)
- analyst_activity (4 rows)

**Protection Domain (8 tables):**
- rally_points (35 rows), safe_houses (32 rows), musters (0), checkins (0)
- protection_events (0), geofences (3 rows), geofence_violations (1 row)
- emergency_procedures (0)

**Intel Domain (14 tables, ALL EMPTY except intel_sources):**
- intel_sources (412 rows) -- only populated table
- intel_normalized (0), intel_bundles (0), triage_decisions (0)
- org_routing (0), delivery_cards (0), acknowledgements (0)
- trip_alerts (25 rows -- manually seeded, not pipeline-generated)
- hazard_bundles (0), risk_assessments (0), risk_predictions (0)
- calibration_logs (0), exposure_layers (0), vulnerability_layers (0)

**Invite and Onboarding (7 tables):**
- invites (112 rows), invite_events (0), invite_suppressions (0)
- onboarding_tokens (84 rows), pending_invites (0)
- participant_onboarding (0), consents (0)

**Communication (6 tables):**
- comms_log (60 rows), notifications (4 rows), push_tokens (0)
- briefings (0), briefing_signoffs (0), sent_alerts (0)

**Billing/Payments (7 tables):**
- billing_transactions (20 rows), payment_methods (0), trip_payments (0)
- stripe_webhook_events (0), quotes (0), pricing_rules (4 rows)
- platform_settings (1 row)

**Safety/Emergency (8 tables):**
- emergency_contacts (0), medical_information (0)
- emergency_preparedness (6 rows), ep_contacts (7 rows)
- ep_local_services (1), ep_medical_facilities (0)
- country_profiles (51 rows), country_emergency_services (0)

**Alert Delivery (10 tables, ALL EMPTY):**
- alert_outbox (0), alert_trip_map (0), alert_deliveries (0)
- alert_deliveries_archive (0), delivery_dlq (0), deliveries (0)
- delivery_policy (0), acks (0), model_versions (0)
- user_channel_preferences (0)

**Governance/Configuration (9 tables):**
- system_config (10 rows), system_config_audit (0)
- certification_types (12 rows), certifications (0)
- traveler_registry (0), import_audit_log (0)
- data_override_requests (0), guardian_data_conflicts (0)
- guardian_bypass_acknowledgments (0)

### 2.3 RLS Coverage Snapshot

| Category | RLS Enabled | RLS Disabled | Total |
|----------|-------------|--------------|-------|
| Core Domain | 9 | 3 | 12 |
| Review Domain | 9 | 1 | 10 |
| Protection Domain | 4 | 4 | 8 |
| Intel Domain | 4 | 10 | 14 |
| Invite/Onboarding | 3 | 4 | 7 |
| Billing/Payments | 3 | 4 | 7 |
| Alert Delivery | 2 | 8 | 10 |
| Other | 40 | 12 | 52 |
| **TOTAL** | **74** | **46** | **120** |

**Critical caveat:** Even the 74 tables with RLS "enabled" receive no protection because all 272 API route handlers exclusively use `get_service_supabase` (the service-role key that bypasses RLS). RLS policies only protect against direct Supabase JS client access from frontends.

### 2.4 Core API Route Map (safetrekr-core)

| Router File | Endpoints | Lines | Domain |
|-------------|-----------|-------|--------|
| trips.py | 44 | 5,182 | Trips, participants, locations, contacts, flights, ground travel, musters, geofences, alerts, photos, guardian flows, schedule, finalize |
| invites.py | ~12 | 1,759 | Invite CRUD, resend, revoke, batch operations |
| protection.py | ~15 | 1,699 | Rally points, safe houses, musters, check-ins, AI suggestions |
| users.py | ~8 | 1,218 | User CRUD, profile, avatar, search |
| invite_analytics.py | ~6 | 1,008 | Invite delivery stats, org metrics, email health |
| orgs.py | ~6 | 994 | Organization CRUD, activation |
| checklists.py | ~8 | 933 | Checklist templates, trip checklists, acknowledgments |
| auth.py | ~6 | 866 | Login, refresh, consume-invite, onboarding |
| advanced.py | ~5 | 781 | Batch operations, exports |
| alerts.py | ~5 | 775 | Alert CRUD, delivery queue |
| digests.py | ~5 | 767 | Safety digest creation, distribution |
| payments.py | ~5 | 706 | Stripe integration, pricing |
| search.py | ~4 | 682 | Full-text search, statistics |
| files.py | ~4 | 658 | File upload/download |
| users_settings.py | ~4 | 612 | User preferences, notifications |
| emergency_preparedness.py | ~4 | 588 | EP plans, contacts, facilities |
| Other (15 files) | ~30 | ~5,500 | Various smaller domains |
| **TOTAL** | **~175** | **31,870** | |

### 2.5 TarvaRI Pipeline Architecture

```
[412 intel_sources] -----> IngestWorker (polls APIs, parses)
                               |
                               v
                    [intel_normalized] -- 0 rows
                               |
                               v
                    BundlerWorker (50km radius, 24hr window clustering)
                               |
                               v
                    [intel_bundles] -- 0 rows
                               |
                               v
                    Triage Queue (analyst approval)
                               |
                               v
                    [triage_decisions] -- 0 rows
                               |
                               v
                    AlertRouterWorker (spatio-temporal matching to trips)
                               |
                               v           HANDOFF GAP
                    [trip_alerts] -------X-------> DeliveryWorker (email/SMS/push)
                               |                        |
                               v                        v
                    [alert_trip_map] -- 0 rows   [deliveries] -- 0 rows
```

The delivery worker is NOT included in docker-compose.yml profiles. The `DeliveryService` explicitly notes providers are "mocked for now." The alert_router_worker writes to trip_alerts but the handoff to delivery_worker via alert_outbox is unwired.

### 2.6 Authentication Architecture

**Web (safetrekr-app-v2):**
- Supabase Auth SDK handles login/session
- Two independent stores persist state:
  1. `sb-{ref}-auth-token` in localStorage (Supabase internal)
  2. `safetrekr-auth` in localStorage (Zustand persist)
- Known permanent desync: JWT expiry triggers SIGNED_OUT, which wipes Zustand permanently
- API calls use Supabase JS client directly (bypasses Core API for reads)
- Core API called for mutations that require server-side logic

**Mobile (safetrekr-traveler-native):**
- Custom JWT flow via Core API `/v1/auth/consume-invite` and `/v1/auth/refresh`
- `expo-secure-store` for token persistence
- Atomic `StoredTripContext` blob prevents split-brain on app kill
- Dedicated `apiClient.ts` with token refresh and retry logic
- Supabase client used only for Realtime subscriptions (not data fetching)

**Core API (safetrekr-core):**
- JWT validation via `SUPABASE_JWT_SECRET`
- Maps `auth_user_id` to `public.users.id` (dual UUID system)
- `User` class in `security.py` provides role-based access control
- Service client (bypasses RLS) used for all database operations

---

## 3. Enhancement Proposals

### EP-001: trips.py God File Decomposition

**Problem:**
`trips.py` is 5,182 lines containing 44 endpoints spanning 11 distinct functional domains. Every production bug in the project's history traces through this file. It is impossible for two developers to work on unrelated trip features without merge conflicts. The file contains emergency trigger logic adjacent to photo upload handlers, geofence violation tracking next to schedule rendering, and the entire 500-line finalize-and-invite pipeline mixed with simple CRUD.

Specific domains currently conflated in one file:
- Trip CRUD (create, read, update, delete, list)
- Participant management (list, add, remove, roster, me)
- Location tracking (post location, get locations, permissions)
- Geofencing (list fences, post violations, acknowledge violations, status)
- Alerts (list, acknowledge, read, push)
- Musters (list, roster, update, mark-all-present)
- Guardian flows (list travelers, consent, preferences)
- Photos (list, upload, delete)
- Emergency (trigger, procedures)
- Schedule (get schedule)
- Finalize (500-line mega-endpoint: create trip + 7 child tables + invites + review queue + watercraft flagging)

**Solution:**
Extract into domain-aligned router modules:

```
src/api/v1/routes/
  trips/
    __init__.py           # Re-export combined router
    crud.py               # Trip CRUD + list (5 endpoints, ~400 lines)
    participants.py       # Participant management (5 endpoints, ~500 lines)
    locations.py          # Location tracking + permissions (3 endpoints, ~200 lines)
    geofences.py          # Geofence CRUD + violations (5 endpoints, ~400 lines)
    alerts.py             # Alert list + acknowledge + read + push (4 endpoints, ~400 lines)
    musters.py            # Muster management (4 endpoints, ~350 lines)
    guardian.py            # Guardian-specific flows (3 endpoints, ~300 lines)
    photos.py             # Photo CRUD (3 endpoints, ~200 lines)
    emergency.py          # Emergency trigger + procedures (2 endpoints, ~250 lines)
    schedule.py           # Schedule rendering (1 endpoint, ~200 lines)
    finalize.py           # Finalize mega-endpoint (1 endpoint, ~600 lines)
    _shared.py            # can_access_trip(), _log_comms(), common dependencies
```

The `__init__.py` re-exports a combined router to maintain backward compatibility:
```python
from .crud import router as crud_router
from .participants import router as participants_router
# ... etc
router = APIRouter()
router.include_router(crud_router)
router.include_router(participants_router)
```

**Impact:**
- Eliminates merge conflicts between unrelated trip features
- Each module becomes independently testable
- Future extraction to separate services is pre-aligned with module boundaries
- finalize.py isolation allows focused hardening of the highest-risk endpoint

**Effort:** 2-3 days (mechanical refactor, no logic changes)

**Dependencies:** None. Pure structural refactor.

---

### EP-002: Intel Pipeline Activation

**Problem:**
TarvaRI represents an estimated 3-4 months of engineering investment: 5 workers, 10+ parsers (NWS CAP, USGS GeoJSON, CDC RSS, ReliefWeb REST, GDACS), a 12-feature risk scoring model with Monte Carlo uncertainty bands, a delivery service with exponential backoff, dead letter queue management, and a model configuration/versioning system. All of this code is tested (92 tests), containerized, and ready.

Despite this, zero rows exist in the processing pipeline (intel_normalized, intel_bundles, triage_decisions, org_routing, delivery_cards). The delivery_service.py explicitly states providers are "mocked for now." The delivery_worker is missing from docker-compose.yml. The alert_router_worker -> delivery_worker handoff via alert_outbox is structurally complete but has never processed a real record.

The 25 rows in trip_alerts were manually seeded, not pipeline-generated.

**Solution:**
Phase the activation in three stages:

**Stage 1 -- Ingest Only (Week 1-2):**
- Enable ingest_worker against the 5 pilot sources (NOAA NWS, USGS, CDC, GDACS, ReliefWeb)
- Configure 5-minute polling intervals (free-tier safe)
- Add the delivery_worker to docker-compose.yml under the `workers` profile
- Monitor intel_normalized row count, parser success rate, and DB growth
- Enable retention policy (30-day TTL) from day one

**Stage 2 -- Bundle + Route (Week 3-4):**
- Enable bundler_worker (clustering intel into actionable bundles)
- Enable alert_router_worker (matching bundles to active trips by geography/time)
- Wire alert_outbox: when alert_router inserts to trip_alerts, also insert to alert_outbox
- Verify trip_alerts populate from real intel data against the 106 existing trips
- Analyst triage is optional at this stage; auto-approve bundles above severity threshold

**Stage 3 -- Delivery (Week 5-6):**
- Replace mocked email/SMS providers with real SendGrid/Twilio integration
- Wire delivery_worker to consume from alert_outbox and fan out to deliveries table
- Enable push notifications via Expo Push API (infrastructure already exists in safetrekr-core)
- Implement delivery_policy table rules per org/role
- Monitor delivery success rate, DLQ entries, acknowledgment rates

**Impact:**
- Activates the platform's core differentiator: real-time safety intelligence
- 412 pre-registered sources begin generating actionable alerts for 106 active trips
- Provides the data foundation for the risk scoring model to produce calibrated predictions
- Transforms TarvaRI from sunk cost to revenue-generating capability

**Effort:** 6 weeks (2 engineers, staged rollout)

**Dependencies:**
- EP-001 (trips.py decomposition) recommended but not blocking -- alerts.py extraction simplifies the alert push endpoint
- Twilio account setup for SMS delivery (Stage 3)
- Delivery policy configuration per org (can be defaulted)

---

### EP-003: Auth Architecture Unification

**Problem:**
The web and mobile apps use fundamentally different authentication architectures:

| Aspect | Web (Next.js) | Mobile (Expo) |
|--------|---------------|---------------|
| Login | Supabase Auth SDK | Core API `/v1/auth/consume-invite` |
| Token storage | localStorage (2 independent stores) | expo-secure-store (atomic blob) |
| Session refresh | Supabase auto-refresh | Core API `/v1/auth/refresh` |
| Data fetching | Supabase JS client (direct DB) | Core API REST endpoints |
| Known bugs | Permanent desync on JWT expiry | None documented |

This creates three problems:
1. The web app's dual-store desync is a known production issue that permanently breaks sessions
2. Supabase JS direct-to-DB calls from the web app bypass all server-side authorization logic
3. The mobile app's auth flow is isolated from the web app's -- no shared session possible

**Solution:**
Converge on the mobile app's pattern, which is architecturally superior:

**Phase 1 -- Fix the Web Desync (Week 1):**
- Replace the Zustand persist store with a derived-state pattern
- Use Supabase's `onAuthStateChange` as the single source of truth
- Eliminate the second independent store (`safetrekr-auth` in localStorage)
- On SIGNED_OUT, redirect to /login instead of silently clearing (matching mobile pattern)

**Phase 2 -- Route Web Data Through Core API (Week 2-6):**
- Systematically replace the 61 Supabase JS API files (`shared/api/supabase/*.ts`) with Core API calls
- Priority order: security-critical operations first (billing, user data, org data), then review, then read-only
- This ensures all data access passes through server-side authorization
- TanStack Query caching layer remains unchanged; only the fetch function changes

**Phase 3 -- Shared Auth Token Format (Week 7-8):**
- Standardize on JWT tokens issued by Core API for both platforms
- Web login flow: Supabase Auth -> exchange for Core API JWT -> use Core API JWT for all subsequent calls
- Mobile login flow: unchanged (already uses Core API JWT)
- Enables future cross-platform features (e.g., "continue on mobile" links)

**Impact:**
- Eliminates the permanent session desync bug
- All data access goes through server-side authorization (prerequisite for EP-004)
- Enables shared session infrastructure for future features
- Reduces the web app's direct Supabase dependency from 61 files to 0

**Effort:** 8 weeks (1 senior engineer + 1 mid-level)

**Dependencies:**
- EP-004 (RLS enforcement) should follow immediately after Phase 2

---

### EP-004: RLS Enforcement and Service Client Remediation

**Problem:**
The CLAUDE.md states: "get_supabase() -- anon key, respects Row Level Security. **Use by default.**" But every single route handler (272 instances across all route files) uses `get_service_supabase()` instead, which bypasses RLS entirely.

Additionally, 46 tables have RLS disabled at the database level. These include security-critical tables: `billing_transactions`, `payment_methods`, `audit_logs`, `onboarding_tokens`, `trip_alerts`, `trip_drafts`, `checkins`, `delivery_cards`, `user_roles`.

The combined effect: the database has zero access control below the Python application layer. Any endpoint bug that leaks a query (e.g., missing `.eq("org_id", user.org_id)` filter) exposes cross-organization data. The authorization logic in `can_access_trip()` is the only defense, and it only covers trip-scoped endpoints.

**Solution:**

**Phase 1 -- Audit and Classify (Week 1):**
- Tag every `get_service_supabase` usage as REQUIRED (admin ops, user lookup in auth flow) or UNNECESSARY (standard CRUD that should respect RLS)
- Expected result: ~20 genuinely require service key; ~250 should use anon key

**Phase 2 -- Enable RLS on Remaining 46 Tables (Week 2-3):**
- Write RLS policies for all 46 tables currently missing them
- Pattern: `org_id` check for org-scoped tables, `user_id` check for user-scoped tables
- For intel tables (owned by TarvaRI workers): service-key only; add `service_role` policy
- Test each table's policies against all existing data

**Phase 3 -- Migrate Route Handlers (Week 4-8):**
- Replace `get_service_supabase` with `get_supabase` in each route handler
- Pass the user's JWT to the Supabase client so RLS policies can reference `auth.uid()`
- Requires Core API to forward the original JWT rather than decoding and re-querying
- Work in batches: trips (44 endpoints) -> invites (12) -> protection (15) -> users (8) -> rest

**Impact:**
- Establishes defense-in-depth: application-layer authorization + database-layer RLS
- Cross-organization data leaks become impossible at the database level
- Reduces blast radius of any single endpoint vulnerability
- Brings the system in line with Supabase's documented security model

**Effort:** 8 weeks (1 senior engineer, careful migration)

**Dependencies:**
- EP-003 Phase 2 must complete first (web app must route through Core API before RLS enforcement makes sense)
- EP-008 (org_id on child tables) recommended to simplify RLS policy authoring

---

### EP-005: Next.js Portal Decomposition

**Problem:**
`safetrekr-app-v2` serves five distinct portals to three different audiences:

| Portal | Route Group | Audience | Usage Pattern |
|--------|-------------|----------|---------------|
| Client Portal | `(client)`, `(trip-detail)` | Org admins | Trip creation, management |
| Analyst Portal | `analyst/` | SafeTrekr analysts | 17-section trip review |
| HQ Portal | `hq/` | SafeTrekr ops | Platform administration |
| Onboarding | `(onboarding)` | New users | Account setup |
| Help | `(help)` | All | Documentation |

All five share a single Next.js bundle, a single deployment, and a single Vercel/hosting instance. Changes to the analyst portal's heavy map components affect the client portal's bundle size. HQ admin deployments require the full test matrix. A bug in one portal's server components affects all portals' availability.

**Solution:**
Split into three independently deployable Next.js applications:

1. **safetrekr-client** -- Client Portal + Onboarding + Help (org admins create/manage trips)
2. **safetrekr-analyst** -- Analyst Portal (trip review, intel triage)
3. **safetrekr-hq** -- HQ Portal (platform ops, org management, user management)

Shared code extracted to internal packages:
- `@safetrekr/ui` -- Design system components, theme
- `@safetrekr/api-client` -- Core API client, TanStack Query hooks
- `@safetrekr/auth` -- Supabase Auth wrapper, session management

**Impact:**
- Independent deployment: analyst portal ships without touching client portal
- Bundle size reduction: each portal only includes its own dependencies
- Fault isolation: HQ admin outage does not affect travelers
- Team autonomy: product teams own their portal end-to-end

**Effort:** 4-6 weeks (2 engineers for extraction, 1 week for shared packages)

**Dependencies:**
- EP-003 (auth unification) simplifies shared auth package
- Monorepo tooling (turborepo already in use via pnpm-workspace.yaml)

---

### EP-006: Redis Topology Separation

**Problem:**
A single Redis instance (port 6379, db=0) serves both safetrekr-core (caching) and TarvaRI (job queues via RQ). There is no keyspace separation. A cache stampede from high-traffic Core API requests can starve TarvaRI's background workers. Conversely, a runaway worker producing large queue payloads can evict Core API cache entries.

Additionally, the rate limiting middleware fails open when Redis is unavailable (rate_limit.py lines 86-91):
```python
except Exception as e:
    # If Redis fails, log error but allow request through
    logger.error("Rate limiting check failed", ...)
```

This means any Redis failure disables all rate limiting.

**Solution:**

**Phase 1 -- Logical Separation (Week 1):**
- safetrekr-core uses `REDIS_DB=0` (cache)
- TarvaRI uses `REDIS_DB=1` (job queues)
- Rate limiting uses `REDIS_DB=2` (isolated)
- Configure via environment variables; no code changes beyond connection strings

**Phase 2 -- Physical Separation (Week 2-3):**
- Deploy a second Redis instance for TarvaRI (port 6380, already documented in ecosystem table)
- Core API retains port 6379 for cache + rate limiting
- TarvaRI workers connect to port 6380 for job queues

**Phase 3 -- Rate Limiting Resilience (Week 3):**
- Replace fail-open behavior with a local in-memory fallback (token bucket per process)
- When Redis is unavailable, apply a conservative default limit (e.g., 10 req/min)
- Add Redis health check to the `/v1/health` endpoint
- Alert on Redis connectivity failures

**Impact:**
- Eliminates cross-service resource contention
- Rate limiting remains effective during Redis partitions
- Job queue failures do not affect API cache performance
- Enables independent scaling of cache and queue infrastructure

**Effort:** 1 week

**Dependencies:** None.

---

### EP-007: core-logic Package Consolidation

**Problem:**
The `packages/core-logic` package was intended to share code between the web app and mobile app. It contains 7 files:
- `api/index.ts` -- ApiClientBase class (96 lines)
- `types/index.ts` -- Shared TypeScript types
- `hooks/` -- 5 hooks (useTripQuery, useLocations, useProtectionLocations, useTripRoster, roleUtils)
- `contexts/TripContext.ts`
- `schemas/index.ts`

Meanwhile, the mobile app (`safetrekr-traveler-native/lib/hooks/`) contains 30+ hooks that duplicate and significantly extend the core-logic hooks. The mobile app has its own `apiClient.ts` (648 lines) with retry logic, token refresh, and auth failure handling that the 96-line core-logic ApiClientBase lacks.

The core-logic package is effectively dead code that adds monorepo build complexity (TypeScript compilation, workspace resolution, EAS build failures) without delivering shared value.

**Solution:**

**Option A -- Grow It (if cross-platform code sharing is a priority):**
- Audit all 30+ mobile hooks and extract the platform-agnostic logic into core-logic
- Keep platform-specific adapters (SecureStore, expo-location) in the mobile app
- Extend ApiClientBase to match the mobile apiClient's capabilities
- Requires both web and mobile teams to depend on and contribute to the package

**Option B -- Retire It (pragmatic, recommended):**
- Copy the types and schemas into each consuming app
- Remove the workspace dependency
- Simplify EAS builds (eliminate the pnpm workspace resolution that caused 5 consecutive fix commits)
- If cross-platform sharing becomes needed later, extract bottom-up from proven code

**Impact:**
- Option B: eliminates EAS build fragility, reduces monorepo complexity
- Option A: enables true code sharing but requires ongoing governance

**Effort:** Option A: 3-4 weeks. Option B: 2-3 days.

**Dependencies:**
- EAS build pipeline (EP-009) benefits from Option B

---

### EP-008: Trip-Child Table Org Isolation

**Problem:**
47 trip-child tables (trip_participants, trip_flights, trip_lodging, trip_venues, trip_transportation, itinerary_events, flight_passengers, lodging_guests, venue_visitors, lodging_pois, venue_pois, rally_points, safe_houses, geofences, etc.) do not have an `org_id` column.

To determine which organization owns a record in `trip_participants`, you must join through `trips` to get `trips.org_id`. This creates two problems:

1. **Query Performance:** Every org-scoped query on child tables requires a join. With 246 trip_participants and 492 itinerary_events this is invisible, but at 10,000+ participants per org this becomes a performance wall.

2. **RLS Policy Complexity:** Writing RLS policies that enforce org isolation on child tables requires subqueries or materialized views, which are significantly slower than a direct column check.

**Solution:**
Add `org_id` column to all 47 trip-child tables with a backfill migration:

```sql
-- For each child table:
ALTER TABLE trip_participants ADD COLUMN org_id uuid REFERENCES organizations(id);
UPDATE trip_participants tp SET org_id = t.org_id FROM trips t WHERE tp.trip_id = t.id;
ALTER TABLE trip_participants ALTER COLUMN org_id SET NOT NULL;
CREATE INDEX idx_trip_participants_org_id ON trip_participants(org_id);
```

Then add a trigger that auto-populates `org_id` on insert by looking up the trip's org_id:
```sql
CREATE OR REPLACE FUNCTION set_org_id_from_trip()
RETURNS TRIGGER AS $$
BEGIN
  NEW.org_id := (SELECT org_id FROM trips WHERE id = NEW.trip_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Impact:**
- Enables simple, fast RLS policies: `org_id = get_user_org_id()`
- Eliminates cross-table joins for org-scoped queries
- Prerequisite for EP-004 (RLS enforcement) to be practically achievable
- No application code changes required (org_id is auto-populated by trigger)

**Effort:** 2 weeks (migration authoring + testing across all 47 tables)

**Dependencies:**
- Should complete before EP-004 Phase 2 (RLS policy authoring)

---

### EP-009: EAS Build Pipeline Hardening

**Problem:**
The last 5 git commits on the current branch are all EAS build fixes:
1. `a0fa002` -- Use custom install command for EAS builds
2. `de8ba55` -- Add pnpm overrides to native package.json
3. `a042ef8` -- Add valid pnpm-lock.yaml to native dir for EAS detection
4. `d71cf1b` -- Remove stale local pnpm-lock.yaml from native app
5. `447713a` -- Add .npmrc to fix EAS frozen-lockfile builds

This indicates the EAS build pipeline has no pre-push validation. Developers discover build failures only after pushing to EAS, which has a 10-20 minute feedback loop.

**Solution:**

1. **Local Build Validation Script:**
   ```bash
   # scripts/validate-eas-build.sh
   cd safetrekr-traveler-native
   npx expo-doctor
   pnpm install --frozen-lockfile
   pnpm typecheck
   pnpm lint
   # Optionally: eas build --local --platform ios --profile development
   ```

2. **CI Gate:** Add a GitHub Actions workflow that runs on every PR touching `safetrekr-traveler-native/`:
   - Validate lockfile integrity
   - Run TypeScript check
   - Run ESLint
   - Verify `app.config.js` resolves without errors
   - Optionally run `eas build --local` for the preview profile

3. **EP-007 Option B:** Removing the core-logic workspace dependency eliminates the primary source of EAS build failures (pnpm workspace resolution in EAS's isolated build environment).

**Impact:**
- Build failures caught in < 30 seconds locally instead of 20 minutes on EAS
- Eliminates the "5 commits to fix one build" pattern
- CI prevents broken builds from reaching EAS

**Effort:** 1-2 days

**Dependencies:**
- EP-007 (core-logic decision) affects the scope of workspace resolution fixes

---

### EP-010: Migration Governance

**Problem:**
211 migrations in 5 months (Oct 2025 -- Mar 2026) = 42 migrations/month = ~2/day. Many follow the pattern `create_X` followed by `fix_X_rls_policies` followed by `fix_X_correct_columns`. Examples:
- `create_checklist_tables` -> `create_checklist_rls_policies` -> `seed_checklist_data` -> `create_checklist_instantiate_function` -> `recreate_instantiate_trip_checklists_rpc` -> `fix_instantiate_trip_checklists_rpc` -> `fix_instantiate_trip_checklists_skip_existing` -> `fix_instantiate_trip_checklists_correct_columns` -> `fix_instantiate_trip_checklists_to_reset` (9 migrations for one feature)

One migration (`disable_rls_all_tables`) disabled RLS on every table in the database, presumably to unblock development. This single migration created the 46-table RLS gap documented in EP-004.

**Solution:**

1. **Migration Squashing:** Squash the 211 migrations into a single baseline migration representing the current schema. All existing environments are already at HEAD; no incremental replay is needed.

2. **Review Gate:** Require a second engineer to approve any migration PR. Use a CODEOWNERS rule:
   ```
   supabase/migrations/ @safetrekr/db-reviewers
   ```

3. **Staging Validation:** Apply migrations to a staging Supabase project before production. Use Supabase branching if available, or maintain a dedicated staging project.

4. **RLS Audit:** After every migration that touches table creation or policies, run an automated check:
   ```sql
   SELECT tablename FROM pg_tables
   WHERE schemaname = 'public' AND rowsecurity = false
   AND tablename NOT IN ('spatial_ref_sys'); -- whitelist
   ```
   Fail CI if any unexpected table lacks RLS.

**Impact:**
- Prevents the "fix the fix" migration pattern
- Catches RLS gaps at PR time, not after production deployment
- Squashed baseline simplifies onboarding and disaster recovery

**Effort:** 1 week (squashing + CI setup)

**Dependencies:** None.

---

## 4. Risk Assessment

### 4.1 Risk Matrix

| ID | Risk | Likelihood | Impact | Severity | Mitigation |
|----|------|-----------|--------|----------|------------|
| R-001 | Cross-org data leak via service client bypass | HIGH | CRITICAL | P0 | EP-004: Replace service client with RLS-respecting client |
| R-002 | trips.py merge conflict blocks release | HIGH | HIGH | P1 | EP-001: Decompose into 12 modules |
| R-003 | Auth desync permanently breaks web sessions | MEDIUM | HIGH | P1 | EP-003 Phase 1: Eliminate dual store |
| R-004 | Redis failure disables rate limiting | MEDIUM | HIGH | P1 | EP-006 Phase 3: In-memory fallback |
| R-005 | TarvaRI investment generates zero value | HIGH | MEDIUM | P1 | EP-002: Staged pipeline activation |
| R-006 | EAS build failure blocks mobile releases | HIGH | MEDIUM | P2 | EP-009: Local validation + CI gate |
| R-007 | Single Next.js bundle serves all portals | MEDIUM | MEDIUM | P2 | EP-005: Portal decomposition |
| R-008 | Child tables lack org_id (performance + RLS) | LOW | HIGH | P2 | EP-008: Add org_id + triggers |
| R-009 | 211 migrations with no review gate | MEDIUM | MEDIUM | P2 | EP-010: Squash + CODEOWNERS |
| R-010 | core-logic adds build complexity, no value | MEDIUM | LOW | P3 | EP-007: Retire or grow |

### 4.2 Detailed Risk Narratives

**R-001: Cross-Organization Data Leak (P0)**
Every API endpoint queries Supabase with the service-role key, which bypasses all RLS policies. Authorization logic exists only in Python code (`can_access_trip()` in trips.py, ad-hoc role checks elsewhere). If any endpoint omits an `org_id` filter -- or if a new endpoint is added without one -- records from other organizations are returned. This is not a theoretical risk; it is the default behavior of the current architecture. The only reason it has not manifested as a user-facing incident is that the system has low concurrent organizational usage.

**R-003: Permanent Auth Session Loss (P1)**
Documented in project memory: "On localhost: developer logs in fresh -- both always in sync -- works. In production: session ages -- JWT expires -- Supabase fires SIGNED_OUT -- AuthProvider calls clearAuth() -- Zustand wipes AND persists null -- everything breaks permanently." The current mitigation (redirect to /login on SIGNED_OUT) treats the symptom. The root cause -- two independent auth stores -- remains.

**R-005: Sunk Cost in TarvaRI (P1)**
TarvaRI represents an estimated 800-1200 engineering hours. Every month it remains dormant, the parsers drift further from their source APIs (format changes, endpoint deprecations, rate limit policy changes). The 92 test suite provides confidence the code works today; that confidence decays with time. The 412 registered sources will require re-validation the longer activation is deferred.

---

## 5. Architecture Recommendations

### 5.1 Target Architecture (6-Month Horizon)

```
                    +-------------------+
                    |   Load Balancer   |
                    +--------+----------+
                             |
              +--------------+---------------+
              |              |               |
    +---------v---+  +------v------+  +-----v-------+
    | Client App  |  | Analyst App |  |   HQ App    |
    | (Next.js)   |  | (Next.js)   |  | (Next.js)   |
    +------+------+  +------+------+  +------+------+
           |                |                |
           +--------+-------+--------+-------+
                    |                |
              +-----v-----+   +-----v------+
              |  Core API  |   | TarvaRI API|
              | (FastAPI)  |   | (FastAPI)  |
              +-----+------+   +-----+------+
                    |                |
              +-----v-----+   +-----v------+
              | Redis      |   | Redis      |
              | (cache+RL) |   | (jobs)     |
              +-----+------+   +-----+------+
                    |                |
              +-----v----------------v------+
              |      Supabase PostgreSQL     |
              |  (RLS enforced, org-scoped)  |
              +-----------------------------+
                             |
              +--------------+---------------+
              |              |               |
    +---------v---+  +------v------+  +-----v-------+
    | Ingest      |  | Bundler     |  | Delivery    |
    | Worker      |  | Worker      |  | Worker      |
    +-------------+  +-------------+  +-------------+
```

### 5.2 Key Architectural Principles

1. **Single Auth Path:** All data access goes through Core API. No direct Supabase JS client calls for mutations. Supabase Realtime remains for push subscriptions.

2. **Defense in Depth:** Application-layer authorization (Core API role checks) AND database-layer authorization (RLS policies). Neither layer alone is sufficient.

3. **Org Isolation by Default:** Every table has an `org_id` column. Every RLS policy checks `org_id`. Every API query includes `org_id` in the WHERE clause. Triple redundancy.

4. **Domain-Aligned Modules:** trips.py becomes 12 files. Each module maps to a bounded context. Module boundaries become future service boundaries.

5. **Pipeline as Product:** TarvaRI is not a "nice to have" -- it is the platform's moat. Treat pipeline activation as a product launch with SLOs, monitoring, and rollback plans.

### 5.3 Monitoring Requirements

| Metric | Target | Source |
|--------|--------|--------|
| API latency (p95) | < 200ms | Core API TimingMiddleware |
| Rate limit bypass rate | 0% | Redis health check + fallback |
| RLS violation attempts | 0 | Supabase audit logs |
| Intel pipeline throughput | > 100 records/hour | intel_normalized row count |
| Alert delivery success rate | > 99% | deliveries table status |
| EAS build success rate | > 95% | EAS build logs |
| Migration review coverage | 100% | GitHub CODEOWNERS |

---

## 6. Priority Recommendations

### Immediate (This Sprint, Week 1-2)

| Priority | Proposal | Effort | Why Now |
|----------|----------|--------|---------|
| 1 | EP-006: Redis fail-open fix (Phase 3 only) | 2 days | Security: rate limiting is currently decorative |
| 2 | EP-001: trips.py decomposition | 3 days | Unblocks all concurrent trip feature work |
| 3 | EP-009: EAS build validation | 1 day | Stops the "5 commits to fix a build" pattern |

### Short-Term (Sprint +1 to +3, Weeks 3-8)

| Priority | Proposal | Effort | Why Now |
|----------|----------|--------|---------|
| 4 | EP-003 Phase 1: Fix web auth desync | 1 week | Known production bug |
| 5 | EP-008: Add org_id to child tables | 2 weeks | Prerequisite for RLS enforcement |
| 6 | EP-002 Stage 1-2: Activate intel pipeline | 4 weeks | Stop value decay on TarvaRI investment |
| 7 | EP-007 Option B: Retire core-logic | 2 days | Simplify builds, remove dead code |
| 8 | EP-010: Migration governance | 1 week | Prevent future RLS gaps |

### Medium-Term (Quarter 2, Weeks 9-20)

| Priority | Proposal | Effort | Why Now |
|----------|----------|--------|---------|
| 9 | EP-004: RLS enforcement | 8 weeks | Defense in depth for data isolation |
| 10 | EP-003 Phase 2-3: Route web through Core API | 6 weeks | Prerequisite for complete RLS |
| 11 | EP-002 Stage 3: Delivery activation | 2 weeks | Complete the intel-to-user pipeline |
| 12 | EP-005: Portal decomposition | 4-6 weeks | Independent deployment for teams |

### Sequencing Rationale

The order is driven by three constraints:

1. **Security first:** EP-006 (rate limiting) and EP-001 (trips.py) reduce immediate risk with minimal effort. EP-008 (org_id) and EP-004 (RLS) follow as the heavier security investments.

2. **Unblock before optimize:** EP-001 (decompose trips.py) and EP-009 (EAS builds) remove daily developer friction. EP-005 (portal split) and EP-007 (core-logic) are optimization plays that can wait.

3. **Activate before extend:** EP-002 (intel pipeline) should activate before any new intel features are built. The existing 92-test coverage and 412 registered sources decay in value with every month of dormancy.

---

## Appendix A: Key File Paths

| File | Significance |
|------|-------------|
| `/safetrekr-core/src/api/v1/routes/trips.py` | 5,182-line god file, 44 endpoints |
| `/safetrekr-core/src/middleware/rate_limit.py` | Fail-open rate limiting |
| `/safetrekr-core/src/main.py` | 33 router registrations |
| `/safetrekr-core/src/db/models.py` | 2,671-line Pydantic model definitions |
| `/TarvaRI/app/workers/alert_router_worker.py` | Bundle-to-trip matching (dormant) |
| `/TarvaRI/app/services/delivery_service.py` | Mocked email/SMS providers |
| `/TarvaRI/app/main.py` | Intel API with disabled protection_internal router |
| `/safetrekr-traveler-native/providers/AuthProvider.tsx` | Mobile auth (620 lines, well-architected) |
| `/safetrekr-traveler-native/lib/api/apiClient.ts` | Mobile API client (648 lines) |
| `/packages/core-logic/src/api/index.ts` | Vestigial 96-line API base class |
| `/docker-compose.yml` | Missing delivery_worker, single Redis |

## Appendix B: Table RLS Status (46 Tables with RLS Disabled)

```
acknowledgements, acks, alert_deliveries_archive, alert_outbox,
alert_trip_map, audit_logs, billing_transactions, checkins,
checklist_categories, checklist_items, checklist_topics, coas,
contacts, deliveries, delivery_cards, delivery_dlq, delivery_policy,
exposure_layers, guardians, hazard_bundles, intel_bundles,
intel_normalized, intel_sources, model_versions, notifications,
onboarding_tokens, org_routing, packet_versions, payment_methods,
pending_invites, protection_events, purge_jobs, quotes,
risk_assessments, risk_predictions, safety_check_items, spatial_ref_sys,
traveler_alert_acknowledgments, traveler_profiles, triage_decisions,
trigger_matrix, trip_alerts, trip_drafts, trip_segments,
user_roles, vulnerability_layers
```

## Appendix C: Migration Velocity Chart

| Month | Migrations | Notable |
|-------|-----------|---------|
| Oct 2025 | 62 | Initial schema buildout |
| Nov 2025 | 56 | Protection, checklists, invites |
| Dec 2025 | 8 | RLS helper functions + tier enablement |
| Jan 2026 | 29 | RLS fixes, traveler features, disable_rls_all_tables |
| Feb 2026 | 36 | Security fix re-enable, billing, briefings, governance |
| Mar 2026 | 20 | Intel schema, digests, feature flags |
| **Total** | **211** | |
