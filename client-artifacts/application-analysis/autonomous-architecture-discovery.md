# SafeTrekr Discovery Analysis
## Autonomous Interface Architecture Assessment

**Date:** 2026-03-17
**Analyst:** World-Class Autonomous Interface Architect
**Branch:** wireUp5
**Scope:** Full-stack codebase review across TarvaRI, Core API, Web App, and React Native Mobile

---

## Executive Summary

SafeTrekr is a sophisticated multi-tenant travel safety platform with a genuinely autonomous intelligence pipeline at its core. The TarvaRI subsystem implements a five-stage autonomous workflow (Ingest > Bundle > Triage > Route > Deliver) backed by a 12-feature Monte Carlo risk scoring model with uncertainty quantification. The system spans three API services, a React Native mobile application with role-specific UIs for six user types, and a Next.js web frontend serving three portal contexts.

The architecture demonstrates strong autonomous design in its intelligence pipeline but has critical gaps in its trust mechanisms, explainability surfaces, and end-to-end delivery wiring. The triage layer is currently a hard human gate with no adaptive thresholds, the delivery pipeline has an unwired handoff between routing and notification, and the mobile client polls for alerts instead of receiving them via real-time channels. The risk scoring engine carries a potential runtime bug where the driver identification method references an uppercase constant that differs from the instance variable loaded from the database, meaning production scoring may silently fall back to hardcoded weights.

The platform has the bones of a world-class autonomous safety system. What follows are the specific findings, feature inventory, gaps, and recommendations to close the distance between current state and full autonomous operation.

---

## Key Findings

1. **The intelligence pipeline is genuinely autonomous but partially disconnected.** The IngestWorker, BundlerWorker, and AlertRouterWorker each operate as independent async workers with graceful shutdown and heartbeat monitoring. However, the AlertRouterWorker contains a `TODO: Trigger notification worker to send push/email/SMS` comment at line 570 of `alert_router_worker.py`, indicating the critical handoff between routing and delivery has not been wired. Approved bundles get routed to `trip_alerts` but may never reach the `alert_outbox` that the DeliveryWorker reads from.

2. **The risk scoring model is scientifically sound but carries a silent variable reference bug.** The `RiskScoringService` loads weights from the database into `self.feature_weights` (lowercase instance variable), but `_identify_drivers()` at line 308 references `self.FEATURE_WEIGHTS` (uppercase class constant). If the class constant `FEATURE_WEIGHTS` does not exist (it is named `FALLBACK_FEATURE_WEIGHTS`), this will raise an `AttributeError` on every call, caught silently by upstream try/except blocks. The Monte Carlo simulation at line 284 correctly uses `self.feature_weights`, so scoring itself works -- but driver identification is broken.

3. **The triage queue is a pure human gate with no adaptive bypass.** Every intel bundle, regardless of confidence score or source corroboration, must wait for a reviewer to approve it before routing. The trigger matrix in the risk scoring service includes an `auto_route` flag, and the decision engine can set `auto: True` for P50 >= 80 bundles, but this flag is never consumed by any downstream system. High-confidence critical alerts (earthquake detected by USGS with 5+ corroborating sources) wait in the same queue as low-confidence single-source weather advisories.

4. **The escalation worker is the most complete autonomous trust loop in the system.** It implements a two-tier SLA escalation (re-ping chaperone at 1x SLA, escalate to org_admin at 2x SLA) with severity-graded timeouts (5 minutes for critical, 4 hours for minor). It records telemetry via OpenTelemetry spans and metrics, tracks escalation history to prevent duplicate escalations, and fans out across all channels on escalation. This is the gold standard pattern the rest of the system should follow.

5. **Mobile alert delivery relies on polling, not real-time push.** The `useAlertsQuery` hook in the React Native app polls every 60 seconds (`refetchInterval: 60 * 1000`), and the `staleTime` is 30 seconds. For a safety-critical application, this means a critical alert could take up to 60 seconds to appear in the mobile UI after delivery. The DeliveryWorker does publish to Supabase Realtime channels (`org_{id}_alerts`, `trip_{id}_alerts`), but there is no corresponding Realtime subscription in the mobile app.

6. **The notification channel architecture is well-designed for severity-aware delivery.** Android notification channels are properly stratified: emergency (MAX importance, bypasses DND), geofence/schedule/check-in/intel (HIGH), trip updates (DEFAULT). The `NotificationProvider` correctly routes notification taps to appropriate screens based on category. The push token lifecycle (register, deregister, device type tracking) is solid.

7. **Geofencing is architecturally sophisticated but activation depends on an approval workflow.** Rally point and safe house geofences are auto-generated with `active: rally_point.status == "approved"`. This creates a dependency chain: analyst must approve rally point, which activates the geofence, which enables autonomous region monitoring. The lodging geofences skip this gate (`active: True` immediately), creating an inconsistent trust model.

8. **The dual alert system creates confusion.** There are two separate alert tables being used: `alerts` (created via Core API, manual creation by admins/analysts) and `trip_alerts` (created by AlertRouterWorker from intelligence pipeline). The mobile app's `useAlertsQuery` hits the Core API endpoint, while the DeliveryWorker writes to `trip_alerts` and publishes via Realtime to trip channels. These two systems appear disconnected -- manually created alerts do not go through the delivery pipeline, and routed intel alerts may not be visible through the Core API alerts endpoint.

9. **Multi-tenant isolation is enforced at multiple layers but has RLS bypass risks.** The Core API uses two Supabase clients: `get_supabase()` (anon key, RLS-enforced) and `get_service_supabase()` (service key, bypasses RLS). The TarvaRI workers use `get_supabase()` which initializes with what appears to be a service key based on the config pattern. Workers that process data across all organizations (IngestWorker, BundlerWorker) inherently bypass tenant isolation by design.

10. **Offline-first mobile architecture exists but lacks conflict resolution.** The provider hierarchy includes `OfflineProvider` with queue and sync capabilities, but the alert acknowledgment flow (`useAcknowledgeAlert`) makes direct API calls without offline queue integration. A traveler in a dead zone who acknowledges a critical alert would fail silently, potentially triggering an unnecessary escalation via the EscalationWorker.

---

## Feature Inventory

### Intelligence Pipeline

- **Feature Name:** Autonomous Multi-Source Intel Ingestion
  - **Description:** IngestWorker polls 5+ authoritative sources (NOAA NWS, USGS, CDC, ReliefWeb, GDACS) via 8 parsers (NWS CAP, USGS GeoJSON, CDC RSS, ReliefWeb REST, GDACS CAP, Generic CAP/RSS/GeoJSON) with configurable polling intervals and deduplication by lineage hash.
  - **User Value:** Continuous monitoring of global safety conditions without human intervention. Travelers are protected by intelligence from government and humanitarian agencies operating 24/7.
  - **Technical Implications:** HTTP client pooling, XML/JSON/RSS parsing, async worker lifecycle management, source health monitoring with error tracking, graceful shutdown via SIGTERM/SIGINT handlers.
  - **Priority Assessment:** **Critical** -- This is the foundational data input for the entire safety intelligence system.

- **Feature Name:** Geographic-Temporal Intel Bundling
  - **Description:** BundlerWorker clusters unbundled intel records using 50km geographic radius and 24-hour temporal window, creates bundles with metadata (representative coordinates, temporal scope, source breakdown), and triggers risk scoring when bundles reach 3+ intel records.
  - **User Value:** Prevents alert fatigue by grouping related events (e.g., multiple earthquake aftershock reports) into single actionable bundles.
  - **Technical Implications:** Haversine distance calculation, category-based clustering, bundle metadata aggregation, risk score integration via RiskScoringService. N-squared comparison for candidate bundle matching could become a bottleneck at scale.
  - **Priority Assessment:** **Critical** -- Without bundling, the system would generate overwhelming numbers of individual alerts.

- **Feature Name:** 12-Feature Monte Carlo Risk Scoring
  - **Description:** Risk assessment engine with five domains (Hazard 40%, Exposure 20%, Vulnerability 20%, Exfil 15%, Confidence 5%), 500-sample Monte Carlo simulation with 5% Gaussian noise, producing P5/P50/P95 uncertainty bands. Supports hazard-specific adapters (earthquake, weather, unrest) and database-driven model versioning.
  - **User Value:** Quantified risk with explicit uncertainty, enabling decision-makers to understand both the likely outcome and worst-case scenario.
  - **Technical Implications:** NumPy dependency for Monte Carlo, adapter pattern for hazard-specific feature computation, model version hot-reloading from `model_versions` table, trigger matrix with configurable threshold rules. The `_identify_drivers` method has a bug referencing `self.FEATURE_WEIGHTS` instead of `self.feature_weights`.
  - **Priority Assessment:** **Critical** -- The risk engine is the decision-making core. The variable reference bug needs immediate attention.

- **Feature Name:** Spatio-Temporal Alert Routing
  - **Description:** AlertRouterWorker matches approved intel bundles to active/upcoming trips using a 100-point relevance scoring system: geographic proximity (0-40 points), temporal overlap (0-30 points), severity (0-20 points), category relevance (0-10 points). Routes only if relevance >= 30 threshold. Deduplicates by trip_id + bundle_id.
  - **User Value:** Travelers only receive alerts relevant to their specific trip locations and dates, preventing irrelevant noise.
  - **Technical Implications:** Trip location lookup per bundle evaluation (N trips x M locations per trip), Haversine distance for every trip-bundle pair, 7-day buffer on temporal matching for trip planning awareness. Missing notification trigger after routing.
  - **Priority Assessment:** **Critical** -- The bridge between intelligence and travelers, but currently has the unwired delivery handoff.

- **Feature Name:** Multi-Channel Alert Delivery
  - **Description:** DeliveryWorker reads from `alert_outbox`, fans out to 4 channels concurrently (Supabase Realtime, email via SendGrid, SMS, push via Expo), tracks delivery attempts with retry logic, records latency metrics via OpenTelemetry.
  - **User Value:** Travelers receive safety information through their preferred/available channel, with redundancy ensuring critical alerts reach them.
  - **Technical Implications:** Concurrent channel delivery via `asyncio.gather`, delivery policy service for per-org/role channel preferences, 5-second polling interval (fast for near-real-time delivery), batch processing of 50 alerts per cycle. Missing graceful shutdown handler.
  - **Priority Assessment:** **Critical** -- The final link in the intelligence chain, but currently may not receive input from the routing stage.

- **Feature Name:** SLA-Enforced Alert Escalation
  - **Description:** EscalationWorker monitors unacknowledged alerts against severity-graded SLA windows (5min critical through 4hr minor), re-pings chaperones at 1x SLA, escalates to org_admin at 2x SLA using all delivery channels.
  - **User Value:** Ensures critical safety information is seen and acted upon. No alert falls through the cracks.
  - **Technical Implications:** Acknowledgment table lookup, escalation history deduplication, OpenTelemetry metrics for SLA violations and escalation events, delivery intent construction with escalation metadata.
  - **Priority Assessment:** **High** -- The accountability backbone of the alert system.

### Mobile Application

- **Feature Name:** Role-Specific Multi-Surface UI
  - **Description:** React Native (Expo) app with three role contexts: Traveler (Today/Schedule/Packet/Settings), Chaperone (Today/Schedule/Map/Settings), Guardian (Today/Schedule/Settings). Each role sees different tab navigation, different Today views (TravelerTodayView vs ChaperoneTodayView), and different available actions.
  - **User Value:** Each user sees exactly the interface relevant to their responsibility. Travelers see schedule and rally points. Chaperones see group locations on a map. Guardians see oversight information.
  - **Technical Implications:** Expo Router with dynamic route groups `(app)/trip/[tripId]/`, role detection via TripProvider, Gluestack UI + NativeWind for theming, deep link handling for invites (`safetrekr://invite?token=xxx`).
  - **Priority Assessment:** **Critical** -- The primary interface for travelers in the field.

- **Feature Name:** Push Notification Infrastructure
  - **Description:** 8 Android notification channels with severity-aware importance levels, emergency channel bypasses DND, push token lifecycle management with backend registration, notification tap routing to appropriate screens (alerts, map, schedule, trip home).
  - **User Value:** Critical safety information reaches travelers even when the app is backgrounded. Emergency alerts break through Do Not Disturb.
  - **Technical Implications:** Expo Notifications API, token registration with Core API (`/users/me/push-token`), foreground notification handler with category-based sound decisions, AppState listener for permission refresh and badge clearing.
  - **Priority Assessment:** **Critical** -- The primary delivery mechanism for time-sensitive safety information.

- **Feature Name:** Autonomous Geofence Monitoring
  - **Description:** Auto-generated geofences for rally points (alert on entry), safe houses (alert on exit), and lodging (alert on exit). Geofence sync service creates/updates/deletes geofences when source entities change. Batch sync available for initial trip setup.
  - **User Value:** Chaperones are automatically notified when travelers leave safe zones or arrive at rally points, without manual monitoring.
  - **Technical Implications:** PostGIS geometry storage, expo-task-manager for background location tasks, expo-location for geofence registration, category-based alert behavior (entry vs exit), approval-gated activation for rally points and safe houses.
  - **Priority Assessment:** **High** -- Passive safety monitoring that operates without user intervention.

- **Feature Name:** Context-Aware Rally Point Navigation
  - **Description:** TravelerTodayView displays the contextually relevant rally point (based on current location or next scheduled event) with one-tap directions to native maps. Rally point detail shows map, address, meeting point detail, instructions, and contact information.
  - **User Value:** In an emergency, a traveler can find the nearest safe gathering point in one tap without searching.
  - **Technical Implications:** `useContextualRallyPoint` hook with location-awareness, native maps deep linking (iOS Maps, Google Maps), bottom sheet for detail view with embedded map component.
  - **Priority Assessment:** **High** -- Critical for emergency response UX.

- **Feature Name:** Live Weather Integration
  - **Description:** TravelerTodayView fetches current weather from Open-Meteo API using the primary rally point coordinates. Displays temperature, weather code mapped to icon/label, and stale FX rate warning.
  - **User Value:** Situational awareness for travelers in unfamiliar environments.
  - **Technical Implications:** Direct fetch to Open-Meteo (no proxy), WMO weather code mapping, coordinate dependency on rally point loading.
  - **Priority Assessment:** **Medium** -- Useful context but not safety-critical.

### Web Application & Administration

- **Feature Name:** Analyst Triage Queue
  - **Description:** Web-based triage interface where analysts review intel bundles, make approve/reject/hold decisions with optional category/severity/headline overrides, full version history tracking, and audit logging. Role-gated to reviewer/reviewer_lead/sys_admin.
  - **User Value:** Human oversight on all intelligence before it reaches travelers, preventing false alarms and ensuring quality.
  - **Technical Implications:** TanStack Query for data fetching, Supabase RLS for multi-tenant isolation, audit log writes on every triage action, bundle status state machine (pending > under_review > triaged).
  - **Priority Assessment:** **Critical** -- The human-in-the-loop checkpoint for intelligence quality.

- **Feature Name:** Trip Lifecycle Management
  - **Description:** Full trip CRUD with finalization workflow that processes itinerary events, flight records, lodging, ground transportation, participants, and generates invite tokens with email delivery. 17-section analyst review with checklist progress tracking.
  - **User Value:** Organizations can create, configure, and activate trips with comprehensive safety planning.
  - **Technical Implications:** Complex finalization endpoint that touches 10+ tables, `none_if_empty()` helper for Postgres date validation, category mapping for itinerary event types, SendGrid email delivery for invites.
  - **Priority Assessment:** **Critical** -- The operational backbone of trip management.

- **Feature Name:** Protection System (Rally Points, Safe Houses, Musters)
  - **Description:** CRUD for safety infrastructure with PostGIS geometry, approval workflow (analyst/admin must approve before activation), AI-powered suggestions from TarvaRI, automatic geofence creation on approval.
  - **User Value:** Organizations can establish and manage physical safety infrastructure for trips with professional oversight.
  - **Technical Implications:** PostGIS `POINT()` WKT conversion, geofence sync on create/update/delete, TarvaRI integration for AI suggestions, multi-step approval state machine.
  - **Priority Assessment:** **High** -- Foundation for physical safety infrastructure.

- **Feature Name:** Feature Flag System
  - **Description:** System-level toggles for autonomous features visible in the HQ admin interface.
  - **User Value:** Controlled rollout of autonomous capabilities with kill-switch for any misbehaving feature.
  - **Technical Implications:** Database-driven flag storage, UI in web admin portal.
  - **Priority Assessment:** **High** -- Critical for safe deployment of autonomous features.

- **Feature Name:** Broadcast Messaging
  - **Description:** Chaperones, org admins, and analysts can send broadcast alerts to trip participants (all, travelers only, or chaperones only). Broadcasts insert into `trip_alerts` with severity and delivery audience configuration.
  - **User Value:** Trip leaders can instantly communicate safety information to their group.
  - **Technical Implications:** Role-based authorization, delivery audience enum mapping, alert row construction with copy variants per role.
  - **Priority Assessment:** **High** -- Direct human-to-group communication for immediate safety needs.

### Cross-Cutting Concerns

- **Feature Name:** Dual Authentication Architecture
  - **Description:** Supabase Auth for JWT issuance, public.users table for application identity, `auth_user_id` column bridges the two. Zustand persist store for client-side session management with known desync risks between Supabase session and Zustand store.
  - **User Value:** Secure authentication with session persistence.
  - **Technical Implications:** Dual UUID system (`auth.users.id` != `public.users.id`), hydration race conditions with Zustand persist, SIGNED_OUT handler must redirect instead of silently clearing.
  - **Priority Assessment:** **Critical** -- Authentication is the security foundation, and the known desync bug is a production risk.

- **Feature Name:** Multi-Tenant Data Isolation
  - **Description:** Supabase Row Level Security (RLS) enforced on most queries, service key bypass for admin operations, org_id-based filtering for non-HQ users.
  - **User Value:** Organizations can only see their own data. HQ staff have cross-org visibility.
  - **Technical Implications:** Two Supabase client instances, RLS policies on all tables, workers process cross-org data by design (using service key).
  - **Priority Assessment:** **Critical** -- Regulatory and trust requirement for multi-tenant SaaS.

- **Feature Name:** Structured Observability
  - **Description:** structlog for JSON logging in TarvaRI workers, structured logging in Core API, OpenTelemetry tracing in DeliveryWorker and EscalationWorker with span attributes for alert severity, org_id, latency, and channel results.
  - **User Value:** Operations team can trace alert delivery end-to-end, identify bottlenecks, and monitor SLA compliance.
  - **Technical Implications:** OpenTelemetry SDK integration, custom metrics (delivery latency, SLA violations, escalation events), tracer span nesting for multi-step operations.
  - **Priority Assessment:** **High** -- Essential for operating autonomous systems in production.

---

## Opportunities & Gaps

### Gap 1: Alert Router to Delivery Worker Handoff (CRITICAL)

**Current State:** `AlertRouterWorker.create_trip_alert()` inserts into `trip_alerts` table but contains `# TODO: Trigger notification worker to send push/email/SMS` at line 570. The `DeliveryWorker` reads from `alert_outbox` table, not `trip_alerts`.

**Impact:** Routed alerts may never be delivered to travelers. The entire intelligence pipeline produces results that stop at the database without reaching end users.

**Recommendation:** After inserting into `trip_alerts`, the AlertRouterWorker must also insert into `alert_outbox` with delivery intents based on alert severity and org delivery policies. This is the single most important gap in the system.

### Gap 2: No Auto-Approve for High-Confidence Bundles

**Current State:** Every bundle must pass through the manual triage queue regardless of confidence score. The trigger matrix's `auto_route` flag is computed but never consumed.

**Impact:** During off-hours or high-volume events (e.g., a major earthquake generating hundreds of bundles from 5 corroborating sources), critical alerts wait in queue until a human reviewer logs in.

**Recommendation:** Implement a confidence-gated auto-approve path. When a bundle's risk score P50 >= 80 AND source_count >= 3 AND the `auto_route` flag is true from the trigger matrix, bypass triage and route directly. Log all auto-approvals with full lineage for audit. Allow HQ admins to disable via feature flag.

### Gap 3: Mobile Real-Time Alert Subscription Missing

**Current State:** Mobile app polls alerts every 60 seconds via HTTP. DeliveryWorker publishes to Supabase Realtime channels. No Realtime subscription exists in the mobile app.

**Impact:** Up to 60 seconds latency for critical safety alerts. For a 5-minute critical SLA, this consumes 20% of the response window.

**Recommendation:** Add Supabase Realtime subscription in the mobile app that subscribes to `trip_{tripId}_alerts` channel. Invalidate TanStack Query cache on Realtime events to trigger immediate UI updates. Keep HTTP polling as fallback for reliability.

### Gap 4: Dual Alert Table Confusion

**Current State:** `alerts` table (Core API, manual alerts) and `trip_alerts` table (TarvaRI pipeline, routed intel alerts) coexist without a unified consumption path. Mobile app's `useAlertsQuery` fetches from Core API's `/trips/{tripId}/alerts` endpoint which reads from `alerts` table. DeliveryWorker writes to `trip_alerts`.

**Impact:** Travelers may see manual broadcasts but miss routed intel alerts, or vice versa. Two parallel alert systems fragment the safety information surface.

**Recommendation:** Unify the alert consumption path. Migrate all alert creation to write to `trip_alerts` and update the Core API to read from `trip_alerts`. The broadcast endpoint already writes to `trip_alerts` (correct pattern). Deprecate the `alerts` table after migration.

### Gap 5: Risk Scoring Driver Identification Bug

**Current State:** `_identify_drivers()` references `self.FEATURE_WEIGHTS` (line 308) but the class only has `FALLBACK_FEATURE_WEIGHTS` as a class constant and `self.feature_weights` as an instance variable.

**Impact:** If the method is called, it raises `AttributeError` which is caught by upstream try/except in `compute_risk_assessment`. Risk assessments proceed without driver identification, so consumers (including the triage UI) receive assessments without top-risk-driver context, reducing the explainability of scores.

**Recommendation:** Change line 308 from `self.FEATURE_WEIGHTS[feature]` to `self.feature_weights[feature]`. Add unit test for driver identification with non-fallback weights.

### Gap 6: Trip Impact Engine Uses Hardcoded Context

**Current State:** `_compute_trip_risk()` uses hardcoded context: `population: 50000`, `hospital_distance_km: 5.0`, `group_size: 25`, `has_minors: True`, etc., rather than fetching actual trip and location data.

**Impact:** Risk assessments are disconnected from reality. A trip with 5 elderly participants to a rural area gets the same vulnerability assessment as a trip with 200 students to an urban center.

**Recommendation:** Fetch actual trip context from the database: participant count, age demographics (presence of minors/elderly/disabled), lodging locations for infrastructure assessment, and trip type. The data exists in the trips, participants, and locations tables -- it just needs to be wired through.

### Gap 7: Offline Alert Acknowledgment Not Queued

**Current State:** `useAcknowledgeAlert` makes a direct API call. The OfflineProvider exists with queue capabilities but acknowledgment mutations do not use it.

**Impact:** A traveler with poor connectivity who acknowledges a critical alert gets a silent failure. The EscalationWorker sees no acknowledgment and escalates, creating unnecessary organizational alarm.

**Recommendation:** Route acknowledgment mutations through the offline queue. Mark the acknowledgment as pending locally (optimistic update in TanStack Query cache) and sync when connectivity returns. The EscalationWorker should also consider push delivery confirmation (device received the notification) as a softer signal, distinct from explicit acknowledgment.

### Gap 8: No Explainability Surface for Travelers

**Current State:** Travelers see alert cards with title, severity, and message. The rich scoring context (relevance breakdown, risk drivers, source count, confidence) is computed but never surfaced to the end user.

**Impact:** Travelers cannot assess whether an alert is relevant to their specific situation, reducing trust and increasing alert fatigue.

**Recommendation:** Add an alert detail view that shows: (a) Why this alert is relevant to your trip (geographic proximity, temporal overlap), (b) Confidence level based on source corroboration, (c) Recommended actions (from the COA engine). Make this expandable/collapsible so the primary alert card remains clean.

### Gap 9: Delivery Worker Missing Graceful Shutdown

**Current State:** IngestWorker, BundlerWorker, and AlertRouterWorker all implement `_shutdown` flag with SIGTERM/SIGINT signal handlers. DeliveryWorker and EscalationWorker use bare `while True` loops without shutdown handling.

**Impact:** Container orchestration (Kubernetes) sends SIGTERM on scale-down or deployment. Without graceful shutdown, in-flight deliveries are interrupted, potentially leaving alerts in a `processing` state permanently (never retried because they are no longer `queued`).

**Recommendation:** Add `_shutdown` flag and signal handlers to DeliveryWorker and EscalationWorker, matching the pattern in IngestWorker. Also add a startup recovery step that resets any `processing` alerts back to `queued` (stale processing state cleanup).

### Gap 10: No Circuit Breaker on External Source Fetching

**Current State:** IngestWorker fetches from external APIs with a 30-second timeout but no circuit breaker. A source that consistently returns 500 errors is retried every polling interval indefinitely, with health tracking only recording the last error.

**Impact:** Wasted HTTP connections and log noise from repeatedly hammering a down source. No exponential backoff on consecutive failures.

**Recommendation:** Implement a circuit breaker pattern. After N consecutive failures (configurable, default 5), mark the source as `degraded` and reduce polling frequency to 10x normal interval. After a successful poll in degraded state, restore normal polling. Surface source health in the TarvaRI console with clear circuit breaker state visibility.

---

## Recommendations

### 1. Wire the Alert Router to Delivery Pipeline (Immediate)

This is the single most impactful fix. Modify `AlertRouterWorker.create_trip_alert()` to also insert an `alert_outbox` record after creating the `trip_alerts` entry. The delivery intent should be computed from:
- Alert severity (Critical/High -> push + SMS + email; Medium -> push + email; Low -> push only)
- Org-level delivery preferences (from settings JSONB)
- Role-based audience (chaperones always, travelers for High+, guardians for Critical)

Without this, the entire intelligence pipeline produces data that never reaches its intended recipients.

**Files to modify:**
- `/TarvaRI/app/workers/alert_router_worker.py` -- Add `alert_outbox` insertion in `create_trip_alert()`
- `/TarvaRI/app/services/delivery_policy_service.py` -- Implement delivery intent computation

### 2. Implement Confidence-Gated Auto-Approve with Human Override

Build the auto-approve path for bundles meeting all three criteria:
- Risk score P50 >= 80 (high severity)
- Source count >= 3 (multi-source corroboration)
- Trigger matrix `auto_route` flag is true

Auto-approved bundles should:
- Be logged with `triage_decisions` entry (decision: 'auto_approved', reviewer_id: 'system')
- Emit an audit log and telemetry event
- Be surfaceable in the triage UI with a visual indicator for retrospective human review
- Respect a global feature flag (`auto_approve_enabled`) that HQ admins can toggle

This preserves human oversight as a review-after-the-fact for high-confidence decisions while ensuring critical alerts do not wait for business hours.

**Files to modify:**
- `/TarvaRI/app/workers/bundler_worker.py` -- Add auto-approve check after scoring
- `/TarvaRI/app/api/triage.py` -- Add `auto_approved` decision type support
- Feature flag configuration in admin UI

### 3. Add Supabase Realtime Alert Subscription in Mobile App

In the mobile app's provider hierarchy (after AuthProvider, inside the trip context), subscribe to Supabase Realtime channel `trip_{tripId}_alerts`. On message:
- Invalidate TanStack Query cache for `['alerts', tripId]`
- If app is foregrounded, show in-app toast with alert preview
- If severity is Critical/High, also trigger a local notification (as backup to push)

Keep the existing 60-second HTTP polling as degraded-mode fallback. Reduce polling interval to 5 minutes when Realtime connection is active to reduce server load.

**Files to modify:**
- `/safetrekr-traveler-native/providers/` -- New `AlertsRealtimeProvider.tsx` or extend `NotificationProvider`
- `/safetrekr-traveler-native/lib/hooks/useAlerts.ts` -- Add Realtime invalidation

### 4. Unify the Alert Consumption Path

Migrate all alert creation to the `trip_alerts` table and update the Core API to read from it. This means:
- The broadcast endpoint already writes to `trip_alerts` (correct)
- Manual alert creation should also write to `trip_alerts` (currently writes to `alerts`)
- Mobile app's `useAlertsQuery` should read from a unified endpoint that queries `trip_alerts`
- Deprecate the `alerts` table after migration

This eliminates the dual-table confusion and ensures all alerts flow through the delivery pipeline.

**Files to modify:**
- `/safetrekr-core/src/api/v1/routes/alerts.py` -- Redirect writes to `trip_alerts`
- `/safetrekr-traveler-native/lib/hooks/useAlerts.ts` -- Update endpoint
- `/safetrekr-traveler-native/lib/api/apiClient.ts` -- Update response transformation

### 5. Build an Explainability Layer for All Autonomous Decisions

For every autonomous decision the system makes, surface the reasoning to the appropriate audience:

| Decision | Audience | Explanation |
|----------|----------|-------------|
| Alert routed to trip | Traveler | "This alert was matched to your trip because you will be within 15km of the affected area during March 20-25" |
| Risk score computed | Analyst | Full feature breakdown, Monte Carlo distribution chart, top 5 drivers with contribution percentages |
| Auto-approved bundle | HQ Admin | Source list, confidence score, trigger rule matched, corroboration summary |
| Escalation triggered | Org Admin | "Alert [title] was not acknowledged by [chaperone] within 5 minutes (Critical SLA). Original delivery: push + email at [time]" |

This transforms the system from a black box that issues commands into a transparent advisor that builds trust through explanation.

**Files to modify:**
- `/TarvaRI/app/workers/alert_router_worker.py` -- Store scoring_details in trip_alerts
- `/safetrekr-traveler-native/components/alerts/AlertDetailSheet.tsx` -- Render explainability data
- `/safetrekr-core/src/api/v1/routes/alerts.py` -- Include scoring_details in response

---

## Dependencies & Constraints

### Trust Model Requirements

1. **Human-in-the-loop for non-critical alerts:** The current triage gate should remain for Medium and Low severity bundles. Only Critical + High with multi-source corroboration should qualify for auto-approve.

2. **Audit trail for all autonomous decisions:** Every auto-approved bundle, auto-routed alert, auto-escalated notification, and auto-generated geofence must have a traceable audit log entry with timestamp, input data, decision reasoning, and the ability to retroactively review and override.

3. **Kill switches per autonomous feature:** Feature flags must exist for: auto-approve, auto-routing, auto-escalation, geofence auto-generation, and AI risk scoring. Each must be independently disableable without affecting the rest of the pipeline.

4. **Graduated rollout capability:** New autonomous behaviors should be deployable to specific organizations first (org-level feature flags) before system-wide activation.

### Explainability Requirements

1. **Alert relevance explanation:** Every alert delivered to a traveler must include machine-readable scoring details (geographic distance, temporal overlap, relevance score) that can be rendered in a human-readable format.

2. **Risk model transparency:** The 12-feature model weights, Monte Carlo parameters, and trigger matrix rules must be viewable by HQ admins in the web interface. Model version changes must be logged with diff.

3. **Source attribution:** Every intel bundle must display which authoritative sources contributed, when they were last polled, and the historical reliability of each source.

### Regulatory Constraints

1. **COPPA implications:** If trip participants include minors (the system tracks `has_minors`), location tracking and data collection must comply with COPPA. Parental/guardian consent workflow should be enforced before enabling location features for minor travelers.

2. **International data considerations:** Trips span international borders. Location data, health information (CDC alerts), and personally identifiable information may be subject to GDPR, CCPA, or local data protection laws depending on trip destinations. The 30-day retention policy in TarvaRI is a good start but may need per-jurisdiction tuning.

3. **Emergency communication regulations:** SMS alerts to travelers in foreign countries may be subject to local telecommunications regulations. The delivery service should be aware of destination country and use appropriate SMS routing.

4. **Duty of care documentation:** Organizations using SafeTrekr for group travel may have legal duty-of-care obligations. The audit trail, escalation records, and alert acknowledgment timestamps serve as evidence of reasonable care. These records should be exportable for legal proceedings and retained beyond the standard 30-day intel retention window.

### Technical Constraints

1. **Supabase tier limits:** Worker polling intervals are configured for free-tier safety (5 minutes default). Auto-approve and real-time subscriptions will increase database load. Capacity planning needed before enabling high-frequency autonomous features.

2. **External API rate limits:** NOAA, USGS, CDC, ReliefWeb, and GDACS all have rate limits. The IngestWorker's per-source polling intervals must respect these. A circuit breaker is needed to avoid burning rate limit budgets on failing sources.

3. **Mobile battery impact:** Background location tracking (geofencing), push notification processing, and Realtime WebSocket connections all consume battery. The system should degrade gracefully: reduce location precision when battery is low, switch from Realtime to polling, and batch non-critical notifications.

4. **Dual UUID auth system:** The documented `auth.users.id` != `public.users.id` mismatch is a persistent source of bugs. Any new feature that references user identity must use the public users ID from the Zustand store (accessed reactively, never via `getState()`). This constraint must be enforced in code review.

---

## Appendix: Files Examined

### TarvaRI (Intelligence Pipeline)
- `app/workers/ingest_worker.py` -- Source polling and data ingestion
- `app/workers/bundler_worker.py` -- Geographic-temporal intel clustering
- `app/workers/alert_router_worker.py` -- Trip-alert matching and routing
- `app/workers/delivery_worker.py` -- Multi-channel alert delivery
- `app/workers/escalation_worker.py` -- SLA enforcement and escalation
- `app/services/risk_scoring_service.py` -- 12-feature Monte Carlo model
- `app/services/trip_impact_engine.py` -- Spatio-temporal trip impact detection
- `app/api/triage.py` -- Triage decision CRUD

### Core API (safetrekr-core)
- `src/api/v1/routes/alerts.py` -- Alert CRUD and broadcast
- `src/services/geofence_sync.py` -- Autonomous geofence creation

### React Native Mobile (safetrekr-traveler-native)
- `components/alerts/AlertsList.tsx` -- Alert display with date grouping
- `components/pages/today/TravelerTodayView.tsx` -- Traveler home screen
- `providers/NotificationProvider.tsx` -- Push notification lifecycle
- `lib/notifications/channels.ts` -- Android notification channels
- `lib/hooks/useAlerts.ts` -- Alert data fetching and mutations

### Configuration
- `CLAUDE.md` files across all three services
- `app.config.js`, `eas.json`, `package.json` for mobile app
