# TarvaRI Intelligence Pipeline -- Deep Analysis

**Date**: 2026-03-17
**Analyst**: Claude Opus 4.6 for The best prompter in existence
**Scope**: Full 5-stage pipeline (Ingest > Bundle > Triage > Route > Deliver), 12-feature Monte Carlo risk engine, 5 workers, 10 parsers, multi-channel delivery, escalation with SLA enforcement, mobile consumer integration.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Feature Documentation](#2-feature-documentation)
3. [Enhancement Proposals](#3-enhancement-proposals)
4. [Risk Assessment](#4-risk-assessment)
5. [Architecture Recommendations](#5-architecture-recommendations)
6. [Priority Recommendations](#6-priority-recommendations)

---

## 1. Executive Summary

TarvaRI is an ambitious intelligence pipeline designed to ingest real-time hazard data from 10+ authoritative sources, bundle it into deduplicated clusters, score risk using a 12-feature Monte Carlo model, route alerts to affected trips, and deliver them across multiple channels with SLA-enforced escalation.

**The pipeline is architecturally complete but operationally inert.** Zero intelligence rows flow end-to-end today because of three critical breaks in the chain: (1) the router-to-delivery handoff is unwired (a TODO at line 570 of alert_router_worker.py), (2) the triage stage is a pure human gate that ignores its own auto-route computation, and (3) the mobile app polls on a 60-second interval against the wrong table rather than subscribing to the Realtime channel the pipeline publishes to. Additionally, the risk scoring engine contains attribute reference errors that silently break driver identification and lineage hashing.

The escalation worker is the strongest autonomous pattern in the system -- a 2-tier SLA model with OpenTelemetry instrumentation and deduplication that can serve as a template for the rest of the pipeline. The delivery infrastructure (email/SMS/push with exponential backoff, DLQ, and replay) is production-grade but unreachable.

**Impact of current state**: Organizations using SafeTrekr today receive zero automated intelligence alerts. Any alert reaching a traveler's mobile device originates from manual creation through the Core API, bypassing the entire TarvaRI pipeline.

---

## 2. Feature Documentation

### 2.1 Ingest Worker

**Description**: Background worker that polls active intel sources, fetches data via HTTP, and parses it into normalized records using a registry of 10 format-specific parsers.

**User Stories**:
- As a system administrator, I want intel sources to be polled on configurable intervals so that hazard data flows into the system automatically.
- As a safety analyst, I want ingested data normalized into a common schema so I can triage across source types uniformly.

**Current State**: Fully implemented. Supports 8 parser classes (NWS CAP, USGS Earthquake, CDC RSS, ReliefWeb, GDACS, Generic CAP/RSS/GeoJSON). Has graceful shutdown with signal handlers, scheduler integration, and health tracking per source. 5 pilot sources configured (NOAA NWS, USGS, CDC, ReliefWeb, GDACS).

**Critical Issue**: Pipeline is dormant. Zero rows flow because either (a) all sources have `status != 'active'` or (b) the scheduler is disabled. No circuit breaker protects against external source failures -- a single unresponsive source blocks its poll cycle (30s httpx timeout per call, processed sequentially).

**Technical Requirements**:
- `intel_sources` table with source configs, polling intervals, parser mappings
- `intel_normalized` table for parsed records with GeoJSON geometry
- `PARSER_REGISTRY` mapping class names to implementations
- httpx AsyncClient with 30s timeout
- Lineage hash deduplication on insert

**UX/UI Requirements**: TarvaRI Console dashboard showing source health, last poll timestamps, error rates, and ingestion counts.

**Data Requirements**: Each intel record must have: `lineage_hash`, `category`, `severity`, `geo` (lat/lon), `short_summary`, `full_text`, `source_id`, `ingested_at`.

**Integration Points**: External APIs (NOAA, USGS, CDC, ReliefWeb, GDACS), Supabase PostgREST, SchedulerManager service.

---

### 2.2 Bundler Worker

**Description**: Clusters unbundled intel records into geographic (50km radius) and temporal (24-hour window) bundles, runs deduplication, and triggers risk scoring when bundles reach 3+ intel items.

**User Stories**:
- As an analyst, I want related intel records grouped so I can triage one bundle instead of dozens of individual records.
- As a system, I want deduplication so the same event from multiple sources becomes a single, higher-confidence bundle.

**Current State**: Fully implemented with geographic clustering via Haversine distance, temporal windowing, bundle metadata tracking (source breakdown, member IDs, dedup keys), and integration with `RiskScoringService.score_bundle()`.

**Technical Requirements**:
- Reads `intel_normalized` where `bundle_id IS NULL`
- Creates `intel_bundles` with: categories array, representative coordinates, temporal scope, source breakdown, risk score
- Processes in batches of 100

**Integration Points**: `RiskScoringService` for bundle-level scoring (simplified aggregate, not the full 12-feature model).

---

### 2.3 Risk Scoring Engine

**Description**: 12-feature model across 5 domains (Hazard 40%, Exposure 20%, Vulnerability 20%, Exfil 15%, Confidence 5%) with Monte Carlo simulation producing P5/P50/P95 uncertainty bands. Trigger matrix maps scores to COA levels.

**User Stories**:
- As a safety director, I want risk scored with uncertainty bands so I can make informed decisions under ambiguity.
- As an analyst, I want the top risk drivers surfaced so I can explain the score to stakeholders.
- As a system, I want auto-route flags computed so critical alerts bypass the triage queue.

**Current State**: Core computation works but contains 3 attribute reference bugs that break driver identification and lineage.

**BUG 1 -- `_identify_drivers()` references `self.FEATURE_WEIGHTS`**:
- File: `app/services/risk_scoring_service.py`, line 308
- Class defines `FALLBACK_FEATURE_WEIGHTS` (class constant)
- `_load_model_version()` sets `self.feature_weights` (instance, lowercase)
- `_identify_drivers()` references `self.FEATURE_WEIGHTS` (uppercase) -- does not exist
- Result: `AttributeError` at runtime, caught silently by caller's broad `except`
- Driver identification is **completely broken**

**BUG 2 -- `_compute_lineage()` references `self.MODEL_VERSION` and `self.MODEL_NAME`**:
- File: `app/services/risk_scoring_service.py`, lines 456, 457, 460
- Neither `MODEL_VERSION` nor `MODEL_NAME` exist as class attributes
- Instance has `self.model_version` (set by `_load_model_version()`)
- No `MODEL_NAME` or `model_name` exists anywhere in the class
- Result: `AttributeError`, lineage hashing fails silently, no audit trail

**BUG 3 -- `_compute_lineage()` also references `self.FEATURE_WEIGHTS`** (line 460):
- Same uppercase vs lowercase mismatch as Bug 1

**Technical Requirements**:
- 12 features normalized 0-1, weighted sum
- 500-sample Monte Carlo with 5% Gaussian noise
- Trigger matrix from `trigger_matrix` table (active rules)
- Model versioning from `model_versions` table with hot-reload
- 3 hazard-specific adapters: Earthquake, Weather, Unrest

**Data Requirements**: `model_versions` table with `status='live'` row containing `weights.feature_weights` and `thresholds`. `trigger_matrix` table with active rules.

---

### 2.4 Triage Queue

**Description**: Human review gate where analysts approve, modify, or reject bundled intelligence before it routes to trips.

**User Stories**:
- As an analyst, I want to review bundled intel and make approve/reject decisions with notes.
- As a reviewer lead, I want version history so I can audit triage decisions.

**Current State**: Fully implemented API with RBAC (reviewer, reviewer_lead, sys_admin), versioned decisions with audit logging. But acts as a **pure human gate** despite the risk engine computing `auto_route: true` for critical threats.

**Critical Issue**: The `auto_route` flag produced by `_apply_trigger_matrix()` is stored in the decision dict but never read. Even when P50 >= 80 and the trigger matrix says `autoRoute: true`, the bundle sits in `status='pending'` waiting for a human to POST to `/triage/`. There is no automated path from Bundle to Route for critical alerts.

**Integration Points**: `intel_bundles` table (reads), `triage_decisions` table (writes), `audit_logs` table (writes).

---

### 2.5 Alert Router Worker

**Description**: Routes approved bundles to affected trips using spatio-temporal relevance scoring (geographic proximity 0-40pts, temporal overlap 0-30pts, severity 0-20pts, category relevance 0-10pts). Creates `trip_alerts` records.

**User Stories**:
- As a traveler, I want to receive only alerts relevant to my trip's time and location.
- As a system, I want relevance scoring so low-relevance alerts are filtered out.

**Current State**: Relevance scoring fully implemented with 4-factor model, deduplication, Haversine distance calculation, 200km impact radius. Correctly creates `trip_alerts` records.

**CRITICAL BUG -- Router-to-Delivery handoff is UNWIRED**:
- File: `app/workers/alert_router_worker.py`, line 570
- After `create_trip_alert()` inserts into `trip_alerts`, there is:
  ```python
  # TODO: Trigger notification worker to send push/email/SMS
  ```
- The Delivery Worker reads from `alert_outbox` table
- The Router Worker **never writes to `alert_outbox`**
- Result: Alerts are created in `trip_alerts` but **never delivered** to any channel
- This is the single most critical defect in the entire pipeline

**Technical Requirements**:
- Reads `intel_bundles` where `status='approved'` and `routed_at IS NULL`
- Writes to `trip_alerts` with relevance scores and scoring breakdown
- Should write to `alert_outbox` with delivery intents (channels, roles, priority) -- currently does not

---

### 2.6 Delivery Worker

**Description**: Processes `alert_outbox` queue, fans out to in-app (Realtime), email, SMS, and push channels concurrently. Tracks delivery status with OpenTelemetry instrumentation.

**User Stories**:
- As a chaperone, I want critical alerts delivered via push and SMS, not just in-app.
- As an org admin, I want delivery tracked with latency metrics so I can verify SLA compliance.

**Current State**: Production-grade multi-channel delivery with:
- Concurrent channel fan-out via `asyncio.gather`
- OpenTelemetry tracing (spans for batch processing, individual delivery)
- Delivery latency histogram, attempt counter, channel success rate metrics
- Email and SMS providers wired (Resend/Twilio or mock)
- Push notifications: `# TODO: Implement push notification delivery via FCM/APNS`

**DEFECT -- Missing graceful shutdown**:
- File: `app/workers/delivery_worker.py`, line 63
- `while True:` with no `_shutdown` flag, no signal handler
- Compare to IngestWorker, BundlerWorker, AlertRouterWorker which all have `_shutdown` + signal handlers
- Process can only be killed with SIGKILL, risking in-flight delivery corruption

**Integration Points**: `alert_outbox` (reads), `trip_alerts` (reads for alert details), `deliveries` (writes delivery records), `delivery_dlq` (failed deliveries), RealtimeService, EmailProvider, SMSProvider.

---

### 2.7 Escalation Worker

**Description**: Monitors alert acknowledgments against SLA windows and escalates unacknowledged alerts in a 2-tier model: re-ping chaperone at 1x SLA, escalate to org_admin at 2x SLA.

**User Stories**:
- As a safety director, I want critical alerts acknowledged within 5 minutes or automatically escalated.
- As an org admin, I want to be notified when chaperones fail to acknowledge critical alerts.

**Current State**: **Best autonomous pattern in the system.** Fully implemented with:
- 6-tier SLA windows (Extreme 5min, Severe 5min, High 15min, Moderate 60min, Low 120min, Minor 240min)
- Deduplication (checks existing re-ping and escalation deliveries)
- OpenTelemetry tracing and SLA violation metrics
- Writes to `alert_outbox` for re-delivery (correctly uses the delivery pipeline)
- Tracks escalation events in `deliveries` table

**Design Pattern Value**: The escalation worker correctly writes to `alert_outbox` to trigger re-delivery. This is the pattern the Alert Router should follow.

---

### 2.8 Mobile Alert Consumption

**Description**: React Native (Expo) app fetches alerts via TanStack Query, displays them in date-grouped SectionList with priority-colored cards, supports acknowledge and mark-as-read mutations.

**User Stories**:
- As a traveler, I want real-time alert notifications on my phone.
- As a chaperone, I want to acknowledge critical alerts from the app.

**Current State**: UI components are well-built (AlertsList, AlertCard, AlertDetailSheet, AlertsHeader). Data fetching is functional but has two fundamental disconnects:

**ISSUE 1 -- Polls instead of subscribing to Realtime**:
- `useAlertsQuery` has `refetchInterval: 60 * 1000` (60-second polling)
- RealtimeService publishes via Supabase Realtime (DB change events)
- Mobile app **never subscribes** to Supabase Realtime channels
- For a 5-minute SLA on critical alerts, 60-second polling means up to 60 seconds of wasted response time (20% of the SLA window)

**ISSUE 2 -- Dual alert tables are disconnected**:
- Mobile calls `GET /trips/${tripId}/alerts` via Core API
- Core API likely reads from `alerts` table (manual alerts)
- TarvaRI pipeline writes to `trip_alerts` table
- These are **separate tables with different schemas**
- Intel pipeline alerts never reach the mobile app even if delivery works

**ISSUE 3 -- Offline acknowledge not queued**:
- `useAcknowledgeAlert` calls `apiClient.post(...)` directly
- No integration with the `OfflineProvider`'s queue mechanism
- In field conditions (poor connectivity), acknowledgments are silently lost
- This directly impacts SLA compliance and triggers false escalations

---

### 2.9 Realtime Service

**Description**: Publishes alert events to Supabase Realtime channels by updating the `trip_alerts` table, relying on Supabase's built-in change broadcast.

**Current State**: Correctly implements Realtime publishing via DB mutations (update triggers broadcast). Supports supersede and retraction patterns. Client-side subscription example is documented in comments but never implemented in the mobile app.

---

### 2.10 Delivery Service

**Description**: Multi-channel delivery with email (Resend), SMS (Twilio), push (unimplemented), exponential backoff retry (6 attempts, 1/2/4/8/16/32s), dead letter queue, and DLQ replay.

**Current State**: Production-grade implementation with:
- Policy-based delivery filtering per org/role/severity
- Quiet hours enforcement (SMS gated)
- Delivery deduplication per user/channel
- DLQ with manual replay endpoint
- Trip recipient resolution from `trip_participants` + `users` tables

---

## 3. Enhancement Proposals

### EP-001: Wire the Router-to-Delivery Handoff

**Problem**: Alert Router creates `trip_alerts` records but never writes to `alert_outbox`, so the Delivery Worker never picks them up. This is a complete break in the pipeline -- zero alerts are delivered.

**Solution**: After inserting into `trip_alerts` in `create_trip_alert()`, insert a corresponding record into `alert_outbox` with delivery intents computed from alert severity and org delivery policies.

```python
# In alert_router_worker.py, after line 562 (trip_alerts insert):
outbox_data = {
    'alert_uid': alert_id,
    'bundle_id': bundle['id'],
    'trip_id': trip['id'],
    'org_id': trip.get('org_id'),
    'status': 'queued',
    'delivery_intents': self._compute_delivery_intents(bundle, trip),
    'created_at': datetime.utcnow().isoformat()
}
self.supabase.table('alert_outbox').insert(outbox_data).execute()
```

**Impact**: HIGH -- Completes the pipeline end-to-end. Without this, nothing else matters.
**Effort**: Small (4-8 hours). The Delivery Worker already processes `alert_outbox` correctly. This is pure wiring.
**Dependencies**: None. All downstream infrastructure exists.

---

### EP-002: Fix Risk Scoring Attribute References

**Problem**: Three attribute reference bugs in `risk_scoring_service.py` silently break driver identification and lineage hashing.

**Solution**:
1. `_identify_drivers()` line 308: Change `self.FEATURE_WEIGHTS[feature]` to `self.feature_weights[feature]`
2. `_compute_lineage()` lines 456-460: Change `self.MODEL_VERSION` to `self.model_version`, `self.MODEL_NAME` to `"risk_scoring_v1"` (or add a `MODEL_NAME` constant), `self.FEATURE_WEIGHTS` to `self.feature_weights`

**Impact**: HIGH -- Restores risk driver identification (explainability) and audit lineage.
**Effort**: Tiny (30 minutes). Three line changes plus unit test verification.
**Dependencies**: None.

---

### EP-003: Implement Auto-Route for Critical Alerts

**Problem**: The trigger matrix computes `auto_route: true` for P50 >= 80 alerts, but the triage queue ignores this flag entirely. Critical earthquakes and severe weather sit waiting for human approval.

**Solution**: Add an auto-routing bypass that:
1. After bundle scoring, if `decision.auto == True`, automatically set bundle status to `'approved'` and skip the triage queue
2. Log the auto-route event with full risk assessment for audit
3. Add a `routing_method` field to `trip_alerts`: `'auto'` or `'manual'`
4. Allow reviewer_leads to configure auto-route thresholds per org

```python
# In bundler_worker.py, after score_bundle():
if score_result.get('decision', {}).get('auto', False):
    self.supabase.table('intel_bundles') \
        .update({
            'status': 'approved',
            'auto_routed': True,
            'auto_route_reason': score_result.get('decision', {}).get('matched_rule')
        }) \
        .eq('id', bundle_id) \
        .execute()
```

**Impact**: HIGH -- Enables autonomous critical alert routing. For P50 >= 80 events (earthquakes, severe weather), cuts delivery latency from hours (waiting for analyst) to minutes.
**Effort**: Medium (2-3 days). Requires careful gating, audit logging, and org-level override controls.
**Dependencies**: EP-002 (risk scoring must work correctly first).

---

### EP-004: Add Supabase Realtime Subscription to Mobile

**Problem**: Mobile app polls every 60 seconds instead of subscribing to Realtime, wasting up to 20% of a critical alert's 5-minute SLA window.

**Solution**: Create a `useRealtimeAlerts` hook that subscribes to Supabase Realtime on the `trip_alerts` table filtered by `trip_id`, and merges real-time inserts/updates into the TanStack Query cache.

```typescript
// lib/hooks/useRealtimeAlerts.ts
export function useRealtimeAlerts(tripId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`trip_${tripId}_alerts`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'trip_alerts',
        filter: `trip_id=eq.${tripId}`
      }, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['alerts', tripId] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [tripId]);
}
```

**Impact**: MEDIUM-HIGH -- Reduces alert delivery latency from 60s polling to near-instant. Critical for SLA compliance.
**Effort**: Medium (1-2 days). Requires Supabase client setup in mobile, Realtime subscription management, and cache invalidation.
**Dependencies**: EP-005 (unified alert table) for full value.

---

### EP-005: Unify the Dual Alert Tables

**Problem**: Two disconnected alert tables exist: `alerts` (manual, read by mobile via Core API) and `trip_alerts` (pipeline, written by TarvaRI). Intel pipeline alerts never reach travelers.

**Solution**: Three options, in order of preference:
1. **Core API reads both**: Modify `/trips/{id}/alerts` to UNION query `alerts` and `trip_alerts`, mapping both to the mobile's `Alert` interface
2. **Pipeline writes to alerts**: Have the Router Worker write to the `alerts` table instead of/in addition to `trip_alerts`
3. **Mobile reads trip_alerts directly**: Add a direct Supabase query for `trip_alerts` in the mobile hook

Recommended: Option 1 -- it preserves both tables for their distinct purposes while providing a unified view to consumers.

**Impact**: HIGH -- Without this, even a fully wired pipeline never reaches travelers' phones.
**Effort**: Medium (2-3 days). Requires Core API endpoint modification and schema mapping.
**Dependencies**: Understanding exact `alerts` table schema vs `trip_alerts` schema.

---

### EP-006: Add Circuit Breaker to Ingest Worker

**Problem**: IngestWorker processes sources sequentially with a 30-second httpx timeout. A single unresponsive source blocks the entire poll cycle. No backoff, no failure counting, no source deactivation.

**Solution**: Implement a circuit breaker pattern per source:
1. Track consecutive failures per source in `intel_sources.consecutive_failures`
2. After 3 consecutive failures, set source to `'circuit_open'` status (skip for 30 minutes)
3. After cooldown, attempt one probe (half-open state)
4. On probe success, reset to `'active'`
5. Process sources concurrently with `asyncio.gather` (bounded semaphore)

**Impact**: MEDIUM -- Prevents one bad source from degrading the entire pipeline. Enables resilient source expansion.
**Effort**: Medium (2-3 days).
**Dependencies**: None.

---

### EP-007: Add Graceful Shutdown to Delivery Worker

**Problem**: Delivery Worker has `while True:` with no shutdown mechanism. Must be SIGKILL'd, which can corrupt in-flight deliveries (alert marked 'processing' but never completed or failed).

**Solution**: Add `_shutdown` flag and signal handlers matching the pattern in IngestWorker/BundlerWorker/AlertRouterWorker.

```python
def __init__(self):
    # ... existing init ...
    self._shutdown = False

async def shutdown(self):
    logger.info("delivery_worker_shutting_down")
    self._shutdown = True
    # Wait for current batch to complete (don't abandon in-flight)
    logger.info("delivery_worker_shutdown_complete")

async def run(self):
    while not self._shutdown:
        # ... existing logic ...
```

**Impact**: MEDIUM -- Prevents delivery corruption during deploys. Important for production reliability.
**Effort**: Small (2-4 hours). Copy pattern from `ingest_worker.py`.
**Dependencies**: None.

---

### EP-008: Queue Offline Acknowledgments

**Problem**: `useAcknowledgeAlert` calls the API directly with no offline queueing. In poor connectivity (common in travel), acks fail silently, triggering false SLA escalations.

**Solution**: Integrate with the existing `OfflineProvider`'s queue mechanism:
1. On ack attempt, if offline, queue the request with `queueRequest()`
2. On reconnection, replay queued acks via `syncQueue()`
3. Optimistically update TanStack Query cache immediately (show as acknowledged)
4. If replay fails, revert optimistic update and show retry UI

**Impact**: MEDIUM -- Prevents false escalation cascades in field conditions. Directly affects trust in the system.
**Effort**: Small-Medium (1-2 days). OfflineProvider infrastructure already exists.
**Dependencies**: None.

---

### EP-009: Add Explainability Surface

**Problem**: Risk scores are opaque. No UI surfaces the 12-feature breakdown, P5/P50/P95 uncertainty bands, driver identification, or matched trigger rules to analysts or travelers.

**Solution**:
1. **Analyst view**: Add a "Risk Breakdown" panel to the TarvaRI Console's bundle detail view showing:
   - Spider/radar chart of 12 features by domain
   - P5/P50/P95 uncertainty band visualization
   - Top 5 risk drivers with impact classification
   - Matched trigger rule and COA level
   - Lineage hash for audit verification
2. **Traveler view**: Add simplified risk explanation to AlertDetailSheet:
   - Plain-language summary: "This alert is rated HIGH because of its proximity to your hotel (12km) and occurrence during your trip dates"
   - Key drivers in human-readable form

**Impact**: HIGH for trust. Organizations will not adopt automated alerting without being able to explain "why this score."
**Effort**: Large (1-2 weeks). Requires frontend work in both Console and mobile, plus API endpoint for risk breakdown retrieval.
**Dependencies**: EP-002 (driver identification must work).

---

### EP-010: Activate the Intel Pipeline

**Problem**: Zero intelligence rows flow today. The pipeline is dormant.

**Solution**: Execute the pipeline activation sequence:
1. Run `python scripts/seed_pilot_sources.py` to ensure 5 pilot sources exist
2. Set each source `status='active'` via console or API
3. Set scheduler manager to enabled
4. Set `WORKER_POLL_INTERVAL_SEC=300` (5 minutes, safe for free tier)
5. Start workers: `python -m app.workers.ingest_worker`, `python -m app.workers.bundler_worker`
6. Monitor with structured logs for `ingest_source_completed`, `bundler_bundle_created` events
7. Verify intel_normalized and intel_bundles tables are populating

**Impact**: HIGH -- Transforms TarvaRI from dormant code to a functioning system.
**Effort**: Small (2-4 hours) for activation. But requires EP-001 and EP-005 for alerts to actually reach users.
**Dependencies**: Working Supabase connection, network access to external APIs.

---

## 4. Risk Assessment

### 4.1 Critical Risks

| # | Risk | Likelihood | Impact | Current Mitigation | Status |
|---|------|-----------|--------|-------------------|--------|
| R1 | Pipeline produces zero alerts to users | Certain | Critical | None -- router-to-delivery unwired | **ACTIVE** |
| R2 | Risk scoring produces incorrect drivers/lineage | Certain | High | Broad except catches AttributeError silently | **ACTIVE** |
| R3 | Critical alerts delayed hours by triage queue | High | Critical | None -- auto_route flag ignored | **ACTIVE** |
| R4 | Mobile never receives pipeline alerts | Certain | Critical | None -- reads wrong table | **ACTIVE** |
| R5 | Delivery worker corrupts state on deploy | High | Medium | None -- no graceful shutdown | **ACTIVE** |

### 4.2 Operational Risks

| # | Risk | Likelihood | Impact | Current Mitigation |
|---|------|-----------|--------|-------------------|
| R6 | Unresponsive external source blocks entire ingest cycle | Medium | Medium | 30s httpx timeout (not sufficient) |
| R7 | False escalation from offline ack failure | High (in field) | Medium | None |
| R8 | Supabase free-tier rate limiting under load | Medium | High | 5-min poll interval |
| R9 | Push notifications unimplemented | Certain | Medium | Falls back to email/SMS |
| R10 | Intel sources not returning data in expected format | Medium | Low | Parser error handling, per-source health tracking |

### 4.3 Trust & Adoption Risks

| # | Risk | Likelihood | Impact |
|---|------|-----------|--------|
| R11 | Organizations reject opaque risk scores | High | Critical |
| R12 | Analysts distrust auto-routing without explainability | High | High |
| R13 | False positive alert fatigue from untuned relevance threshold | Medium | High |
| R14 | Travelers ignore alerts because of delayed delivery | Medium | High |

---

## 5. Architecture Recommendations

### 5.1 Complete the Pipeline Chain (Immediate)

The pipeline has a clean 5-stage design that is architecturally sound. The stages work independently -- the problem is purely at the handoff seams. Fix in this order:

1. **EP-001**: Wire router-to-delivery (1 day)
2. **EP-002**: Fix risk scoring attributes (30 min)
3. **EP-007**: Add delivery worker shutdown (2 hours)
4. **EP-005**: Unify alert tables (2-3 days)
5. **EP-010**: Activate the pipeline (2-4 hours)

After these 5 items, intelligence flows end-to-end for the first time.

### 5.2 Enable Autonomous Decision-Making (Short-term)

The system has the infrastructure for autonomous operation but gates everything behind human review. Introduce a graduated autonomy model:

1. **EP-003**: Auto-route P50 >= 80 alerts (skip triage for critical)
2. Auto-approve bundles with 3+ corroborating sources and high confidence aggregate
3. Auto-dismiss bundles below relevance threshold after 48 hours with no analyst action
4. Add org-level autonomy configuration: `{ auto_route_threshold: 80, auto_dismiss_hours: 48 }`

### 5.3 Build Explainability (Medium-term)

Trust requires transparency. Build these explainability surfaces:

1. **EP-009**: Risk breakdown panels for analysts
2. Plain-language alert explanations for travelers ("earthquake 12km from your hotel")
3. Scoring audit trail accessible to org admins
4. Pipeline lineage visualization (source -> intel -> bundle -> trip_alert -> delivery)
5. Model version history with A/B performance comparison

### 5.4 Harden for Production (Medium-term)

1. **EP-006**: Circuit breaker on ingest
2. **EP-008**: Offline ack queuing
3. **EP-004**: Realtime subscription on mobile
4. Implement push notifications via FCM/APNS (delivery_worker line 745)
5. Add rate limiting on Supabase calls per worker (token bucket)
6. Add health check endpoints for each worker (not just the API)
7. Implement concurrent source ingestion with bounded semaphore

### 5.5 Address Structural Debt

1. **Haversine distance duplicated** in 3 files (alert_router_worker.py, bundler_worker.py, trip_impact_engine.py). Extract to a shared `geo_utils` module.
2. **Supabase sync calls in async workers**: All workers use synchronous Supabase client methods inside async functions. This blocks the event loop. Either use true async Supabase client or run sync calls in thread pool executor.
3. **TripImpactEngine** computes risk with hardcoded context (population=50000, group_size=25). Should pull real trip data.
4. **HazardClassifier** defaults to `'earthquake'` when classification fails (line 154). Should default to `'unknown'` and flag for analyst review.

---

## 6. Priority Recommendations

### Tier 0: Fix Broken Pipeline (Do This Week)

| Item | Effort | Impact | File(s) |
|------|--------|--------|---------|
| EP-001: Wire router-to-delivery | 4-8h | Critical | `alert_router_worker.py:570` |
| EP-002: Fix risk scoring attributes | 30min | High | `risk_scoring_service.py:308,456-460` |
| EP-007: Delivery worker shutdown | 2-4h | Medium | `delivery_worker.py:57-63` |

### Tier 1: Make Pipeline Reachable (Next 2 Weeks)

| Item | Effort | Impact | Dependency |
|------|--------|--------|-----------|
| EP-005: Unify alert tables | 2-3d | Critical | None |
| EP-010: Activate pipeline | 2-4h | High | EP-001 |
| EP-003: Auto-route critical alerts | 2-3d | High | EP-002 |

### Tier 2: Build Trust (Next Month)

| Item | Effort | Impact | Dependency |
|------|--------|--------|-----------|
| EP-009: Explainability surface | 1-2w | High | EP-002 |
| EP-004: Realtime subscription | 1-2d | Medium-High | EP-005 |
| EP-008: Offline ack queuing | 1-2d | Medium | None |

### Tier 3: Production Hardening (Next Quarter)

| Item | Effort | Impact | Dependency |
|------|--------|--------|-----------|
| EP-006: Circuit breaker | 2-3d | Medium | None |
| Push notifications (FCM/APNS) | 3-5d | Medium | None |
| Async Supabase client migration | 3-5d | Medium | All workers |
| Shared geo_utils extraction | 4h | Low | None |
| Real trip context in TripImpactEngine | 2-3d | Medium | None |

---

## Appendix A: File Reference

| Component | Path | Key Lines |
|-----------|------|-----------|
| Ingest Worker | `TarvaRI/app/workers/ingest_worker.py` | Full file |
| Bundler Worker | `TarvaRI/app/workers/bundler_worker.py` | Full file |
| Alert Router Worker | `TarvaRI/app/workers/alert_router_worker.py` | **Line 570**: TODO handoff |
| Delivery Worker | `TarvaRI/app/workers/delivery_worker.py` | **Line 63**: missing shutdown |
| Escalation Worker | `TarvaRI/app/workers/escalation_worker.py` | Best pattern reference |
| Risk Scoring Service | `TarvaRI/app/services/risk_scoring_service.py` | **Line 308**: FEATURE_WEIGHTS bug, **Lines 456-460**: MODEL_VERSION/NAME bug |
| Trip Alerts Service | `TarvaRI/app/services/trip_alerts_service.py` | Full file |
| Realtime Service | `TarvaRI/app/services/realtime_service.py` | Full file |
| Delivery Service | `TarvaRI/app/services/delivery_service.py` | Line 745: push TODO |
| Triage API | `TarvaRI/app/api/triage.py` | Line 98-102: manual-only flow |
| Trip Impact Engine | `TarvaRI/app/services/trip_impact_engine.py` | Lines 142-154: hardcoded context |
| Hazard Classifier | `TarvaRI/app/services/hazard_classifier.py` | Line 154: bad default |
| Telemetry | `TarvaRI/app/core/telemetry.py` | Full file (reference pattern) |
| Mobile Alerts Hook | `safetrekr-traveler-native/lib/hooks/useAlerts.ts` | Line 77: 60s poll |
| Mobile Alerts List | `safetrekr-traveler-native/components/alerts/AlertsList.tsx` | Full file |

## Appendix B: Pipeline Data Flow (Current vs Target)

**Current (Broken)**:
```
Sources -> IngestWorker -> intel_normalized -> BundlerWorker -> intel_bundles
    -> [HUMAN GATE: Triage Queue] -> approved bundles
    -> AlertRouterWorker -> trip_alerts
    -> [BREAK: TODO at line 570] -- never reaches alert_outbox
    -> DeliveryWorker (starved, no input)
    -> [DISCONNECT: mobile reads 'alerts' not 'trip_alerts']
    -> Travelers see nothing from pipeline
```

**Target (Fixed with EP-001 through EP-005)**:
```
Sources -> IngestWorker -> intel_normalized -> BundlerWorker -> intel_bundles
    -> [AUTO-ROUTE: P50>=80 skips triage] OR [Triage Queue for P50<80]
    -> AlertRouterWorker -> trip_alerts + alert_outbox
    -> DeliveryWorker -> email/SMS/push + Realtime
    -> [Unified API: Core API reads trip_alerts + alerts]
    -> Mobile: Realtime subscription + fallback polling
    -> Travelers receive alerts within seconds (critical) or minutes (standard)
```
