# SafeTrekr Protective Operations Discovery Analysis

**Date**: 2026-03-17
**Analyst**: Protective Operations Expert
**Branch**: wireUp5
**Scope**: Full-stack analysis across Core API, TarvaRI Intelligence Engine, Next.js Admin Portal, and React Native Mobile App

---

## Executive Summary

SafeTrekr is a multi-layered travel safety management platform designed to protect vulnerable populations -- primarily K-12 students, youth sports teams, church groups, and college students -- during organized group travel. The platform exhibits strong architectural intent across its four subsystems: a FastAPI Core API (46 protection endpoints, emergency preparedness, alert CRUD), a Python TarvaRI intelligence engine (12-feature Monte Carlo risk model, 5 authoritative data sources, multi-channel delivery), a Next.js HQ admin/analyst portal, and an Expo React Native mobile app for travelers and chaperones.

The system's intelligence pipeline -- ingesting from NOAA, USGS, CDC, ReliefWeb, and GDACS -- through normalization, bundling, risk scoring, and delivery represents a serious and well-considered approach to proactive threat detection. The protection subsystem (rally points, safe houses, musters, check-ins with PostGIS geofencing) provides layered physical security infrastructure.

However, this analysis identifies **13 critical protective gaps** that, if not addressed, could result in communication failures during emergencies, delayed response to life-threatening situations, or loss of situational awareness when it matters most. The most severe: push notifications are not implemented (the delivery function returns `False`), the DLQ replay mechanism is a placeholder, trip risk context uses hardcoded values instead of real trip data, and there is no panic button or SOS mechanism in the mobile app. For a platform whose primary mission is the safety of minors, these gaps require immediate attention.

---

## Key Findings

1. **Push notifications are non-functional.** `deliver_via_push()` in `TarvaRI/app/services/delivery_service.py` line 748 returns `False` with a TODO comment. This means the fastest communication channel to travelers and chaperones in the field does not work. For a safety-critical platform protecting minors, this is a Priority Zero deficiency.

2. **DLQ replay is a placeholder.** The Dead Letter Queue replay mechanism in `delivery_service.py` lines 323-331 sets `replay_success = True` without actually re-executing the delivery for any channel. Failed critical alerts cannot be recovered.

3. **Trip risk assessment uses hardcoded context.** `TripImpactEngine._compute_trip_risk()` lines 143-154 hardcodes `population: 50000`, `hospital_distance_km: 5.0`, `group_size: 25`, `has_minors: True` instead of querying actual trip data. Risk scores are not calibrated to real conditions.

4. **No real-time alert delivery mechanism exists.** The mobile app polls for alerts every 60 seconds (`useAlertsQuery` staleTime: 30s, refetchInterval: 60s). During an active emergency (earthquake, severe weather, active threat), 60 seconds is an eternity. There is no WebSocket or Supabase Realtime subscription for immediate alert push.

5. **Spatial overlap detection fetches all segments into Python.** `TripImpactEngine.find_impacted_trips()` queries ALL trip segments and filters in Python rather than using PostGIS `ST_Intersects`. This will not scale and introduces latency in time-critical hazard matching.

6. **No SOS / panic button in the mobile app.** There is no mechanism for a traveler or chaperone to trigger an immediate distress signal. The `TripLeaderCard` provides phone/text/email contact for the trip leader, but there is no one-tap emergency activation that simultaneously alerts HQ, the organization admin, and local emergency services.

7. **Escalation ceiling is too low.** The `EscalationWorker` escalates only from chaperone to org_admin. There is no further escalation to SafeTrekr HQ, designated safety analysts, or external emergency services. If the org_admin is also unreachable, the escalation chain terminates.

8. **Guardian notification channel is absent.** Despite the platform tracking guardians (parents of minors), there is no dedicated guardian alert delivery path. Guardians are not included in `delivery_audience` options and cannot receive real-time safety updates about their children.

9. **No offline alert caching.** The mobile app has an `OfflineProvider` and SQLite offline queue for requests, but alerts themselves are not cached. If a traveler loses connectivity during an emergency, they see no alerts until reconnection.

10. **Muster verification lacks automated head-count.** The protection system supports musters (assembly points) and check-ins, but there is no automated roll-call mechanism that cross-references check-ins against the full participant roster to identify missing persons.

11. **SMS broadcast from mobile does not actually send SMS.** The `SmsBroadcastSection` component creates a `trip_alert` record in the database, but there is no trigger or worker that picks up this alert and dispatches it via SMS to participant phone numbers. It creates an in-app alert only.

12. **Risk model falls back to earthquake adapter for unknown categories.** When `RiskScoringService._compute_features()` encounters an unknown hazard category, it silently falls back to the earthquake adapter (line 211). This means health, conflict, fire, and infrastructure hazards are scored using seismic-specific feature computation.

13. **Geofence sync failures are silently swallowed.** All three geofence sync functions (`sync_rally_point_geofence`, `sync_safe_house_geofence`, `sync_lodging_geofence`) catch all exceptions and return `None` without re-raising. A systemic database issue could leave all geofences unsynced with no alarm raised.

---

## Feature Inventory

### Intelligence Pipeline (TarvaRI)

- **Feature Name**: Multi-Source Intel Ingestion
- **Description**: Ingests from 5 authoritative sources (NOAA NWS, USGS Earthquakes, CDC Travel Notices, ReliefWeb, GDACS) via REST, RSS, and CAP connectors with source-specific parsers.
- **User Value**: Provides proactive awareness of weather, seismic, health, humanitarian, and multi-hazard threats affecting trip destinations. Organizations do not need to monitor these sources manually.
- **Technical Implications**: Requires background workers (IngestWorker, BundlerWorker) running on polling intervals. Parser registry supports extensibility. Deduplication via lineage hashes prevents duplicate intel. Redis + RQ for job queue management.
- **Priority Assessment**: **Critical** -- this is the core intelligence capability that differentiates SafeTrekr.

---

- **Feature Name**: 12-Feature Monte Carlo Risk Scoring
- **Description**: Computes risk assessments using a 12-feature model across 5 domains (Hazard 40%, Exposure 20%, Vulnerability 20%, Exfil 15%, Confidence 5%) with 500-sample Monte Carlo simulation producing P5/P50/P95 uncertainty bands.
- **User Value**: Provides quantified, auditable risk scores with uncertainty ranges rather than subjective assessments. Supports data-driven decision-making for trip safety.
- **Technical Implications**: Model weights loaded from `model_versions` table with fallback to hardcoded defaults. Hazard-specific adapters (earthquake, weather, unrest) compute features differently. Lineage hashing provides audit trail. Trigger matrix maps risk scores to COA levels.
- **Priority Assessment**: **Critical** -- underpins all risk-based decisions and alert routing.

---

- **Feature Name**: Trip Impact Engine
- **Description**: Identifies trips impacted by hazards through spatio-temporal overlap detection. Converts itineraries to segments, matches against hazard footprints, and computes trip-level risk aggregation.
- **User Value**: Automatically determines which active trips are affected by a new hazard, preventing manual cross-referencing of trips against threat data.
- **Technical Implications**: Currently fetches all segments and filters in Python (no PostGIS spatial query). Haversine distance calculation for point-radius overlap. Trip-level risk uses max-severity aggregation across segments.
- **Priority Assessment**: **High** -- functional but needs PostGIS optimization for scale.

---

- **Feature Name**: Multi-Channel Alert Delivery
- **Description**: Delivers alerts via email (SendGrid), SMS (Twilio), and push (Expo). Supports exponential backoff retries (6 attempts), Dead Letter Queue for failed deliveries, delivery policy enforcement, and quiet hours.
- **User Value**: Ensures safety-critical information reaches the right people through their preferred channels, with fallback mechanisms for delivery failures.
- **Technical Implications**: Email and SMS providers are implemented. Push notification delivery is NOT implemented (returns False). DLQ replay is placeholder. Delivery worker processes alert_outbox queue.
- **Priority Assessment**: **Critical** -- email works, SMS works, push does NOT work. Push is the most important channel for mobile-first travelers.

---

- **Feature Name**: Escalation Worker (SLA Enforcement)
- **Description**: Monitors alert acknowledgments against SLA thresholds (5 min for Extreme/Severe, 15 min for High, 60 min for Moderate). Re-pings chaperone at 1x SLA, escalates to org_admin at 2x SLA.
- **User Value**: Ensures critical safety alerts are not ignored. Provides accountability chain for alert response.
- **Technical Implications**: Polls every 60 seconds. Queries trip_alerts + acks + deliveries tables. Records SLA violations in telemetry. Escalation currently terminates at org_admin level.
- **Priority Assessment**: **High** -- functional but escalation chain needs extension to HQ and emergency services.

---

- **Feature Name**: Delivery Policy Service
- **Description**: Per-org, per-role delivery policies controlling channel preferences, opt-outs, quiet hours (with timezone support), severity-based overrides, and fallback channel ordering.
- **User Value**: Organizations can customize notification behavior. Quiet hours prevent non-critical SMS/push at night. Critical/Severe alerts override quiet hours.
- **Technical Implications**: Policy stored in `delivery_policy` table with JSONB configuration. Default policy enables all channels. Quiet hours support midnight-spanning windows. Exempt severities configurable per org.
- **Priority Assessment**: **High** -- well-designed policy framework that respects both urgency and user preferences.

---

### Protection System (Core API)

- **Feature Name**: Rally Points & Safe Houses (46 endpoints)
- **Description**: Full CRUD for rally points (pre-trip meeting locations, emergency assembly points) and safe houses (secure shelter locations) with approval workflows, geofence auto-sync, visibility controls, AI-powered suggestions via TarvaRI, and muster/check-in management.
- **User Value**: Provides physical safety infrastructure for trips. Rally points give travelers known locations to gather during emergencies. Safe houses provide secure shelter. Musters enable accountability counts.
- **Technical Implications**: PostGIS geometry storage. Approval required from analyst+ roles. Geofence auto-creation on approval. AI suggestions call TarvaRI for location-aware recommendations. Protection events logged to audit trail.
- **Priority Assessment**: **Critical** -- core physical security infrastructure.

---

- **Feature Name**: Emergency Preparedness Management
- **Description**: Per-trip emergency preparedness records with contacts (trip leader, local liaisons), local emergency services (police, fire, medical), and medical facilities (with GPS coordinates, capability levels, travel times).
- **User Value**: Centralizes all emergency response information for a trip in one queryable record. Analysts can pre-configure local emergency resources before the trip begins.
- **Technical Implications**: Auto-creates EP record on first access. Supports reordering of contacts. Medical facilities track primary designation and travel time estimates. Data sourced from analyst research, not automated.
- **Priority Assessment**: **Critical** -- foundational emergency response data.

---

- **Feature Name**: Consolidated Emergency Info Endpoint
- **Description**: Single API endpoint aggregating country emergency numbers, US embassy details, local emergency services, trip-specific contacts, and platform support contacts into one response.
- **User Value**: Mobile app can display all emergency information with a single API call. Travelers have immediate access to local police/fire/ambulance numbers and embassy contact.
- **Technical Implications**: Queries 4 database tables (country_profiles, country_emergency_services, emergency_contacts, platform_settings). Graceful degradation if country data unavailable.
- **Priority Assessment**: **Critical** -- essential for international trips (T3).

---

- **Feature Name**: Geofence Synchronization
- **Description**: Automatically creates/updates/deletes geofences when rally points, safe houses, or lodging locations are created/updated. Rally points trigger on entry, safe houses/lodging trigger on exit.
- **User Value**: Chaperones are automatically notified when travelers arrive at rally points or leave safe zones, without manual geofence configuration.
- **Technical Implications**: Three sync functions handle different entity types. Rally point geofences activate only when status is "approved". Lodging geofences default to 400m radius. Errors are silently swallowed (non-critical path).
- **Priority Assessment**: **High** -- automated geofencing is a force multiplier for situational awareness.

---

- **Feature Name**: Checklist & Guidance Engine
- **Description**: Time-relative and geo-arrival triggered checklists that activate automatically. Time triggers fire X days before trip start. Geo triggers fire when a user enters a geofenced location. Includes acknowledgment tracking and reminder system.
- **User Value**: Travelers receive context-appropriate safety guidance at the right time (before departure) and right place (arriving at hotel). Organizations have proof of safety briefing delivery and acknowledgment.
- **Technical Implications**: Requires periodic cron job for time triggers. Geo triggers integrate with geofence transition handler. Checklist prompts create notifications. Audience filtering by role.
- **Priority Assessment**: **High** -- proactive safety guidance delivery.

---

### Mobile App (React Native)

- **Feature Name**: Alert Display & Acknowledgment
- **Description**: SectionList-based alert feed grouped by date with pull-to-refresh. Priority-colored cards (P1-P5) with category icons. Alert acknowledgment tracking. 60-second polling refresh.
- **User Value**: Travelers and chaperones see safety alerts organized by recency with visual priority indicators. Required acknowledgments ensure alerts are not ignored.
- **Technical Implications**: TanStack Query with 30s stale time, 60s refetch. Demo mode support. Transform layer converts API format to component format. No real-time subscription.
- **Priority Assessment**: **High** -- primary alert consumption interface.

---

- **Feature Name**: Push Notification Infrastructure
- **Description**: Expo Notifications integration with permission management, token registration, foreground/background handling, Android channel setup, and deep-link routing based on notification category.
- **User Value**: Travelers receive push notifications for emergencies, musters, schedule changes, intel alerts, and geofence events even when the app is backgrounded.
- **Technical Implications**: Token registered with backend on auth. Category-based routing (emergency -> trip home, intel_alert -> alerts tab, geofence -> map). Emergency category plays sound. Badge management.
- **Priority Assessment**: **Critical** -- infrastructure exists but backend push delivery is not implemented.

---

- **Feature Name**: Chaperone Broadcast
- **Description**: Chaperones can compose and send broadcast messages to all participants, travelers only, or chaperones only. Character-limited messages with confirmation dialog and broadcast history.
- **User Value**: Chaperones can quickly communicate schedule changes, safety instructions, or emergency information to their group.
- **Technical Implications**: Creates a `trip_alert` record in the database. Uses Core API broadcast endpoint. Does NOT trigger actual SMS delivery -- only creates in-app alert. Recipient count displayed from participant phone query.
- **Priority Assessment**: **High** -- UI is complete but actual SMS delivery pipeline is not connected.

---

- **Feature Name**: Trip Leader Emergency Contact Card
- **Description**: Displays trip leader contact information with one-tap call, text, and email buttons. Resolves leader from EP contacts (trip_leader role) with fallback to contacts endpoint.
- **User Value**: Travelers can immediately reach their trip leader in an emergency with a single tap.
- **Technical Implications**: Three-level priority chain for leader resolution. Uses native `Linking.openURL` for phone/SMS/email. No fallback if leader has no phone number.
- **Priority Assessment**: **High** -- critical UX for emergency communication.

---

## Opportunities & Gaps

### Critical Gaps (Life-Safety Impact)

**GAP-001: No Push Notification Delivery (Severity: CRITICAL)**
The `deliver_via_push()` function returns `False`. This means the fastest, most reliable channel for reaching travelers in the field is non-functional. During an earthquake, severe weather event, or security incident, push notifications are the only channel likely to reach a traveler who may not be checking email. This must be implemented using the existing Expo Push Token infrastructure that is already registering tokens with the backend.

**GAP-002: No SOS / Panic Button (Severity: CRITICAL)**
There is no mechanism for a traveler or chaperone to signal distress. A one-tap SOS button should: (a) capture GPS coordinates, (b) notify all chaperones on the trip, (c) escalate to org_admin and SafeTrekr HQ, (d) optionally dial local emergency number, (e) activate continuous location sharing. For a platform protecting minors, this is a duty-of-care requirement.

**GAP-003: Escalation Chain Terminates at Org Admin (Severity: HIGH)**
If the org_admin does not acknowledge a critical alert, there is no further escalation to SafeTrekr HQ operations staff, designated safety analysts, or external emergency services. The escalation worker needs additional tiers: org_admin -> SafeTrekr analyst -> SafeTrekr HQ ops -> external notification.

**GAP-004: Guardian Notification Channel Missing (Severity: HIGH)**
Parents/guardians of minors cannot receive real-time alerts about their children's trips. The `delivery_audience` enum does not include `guardians`. For organizations transporting minors (K-12, youth sports, church groups), guardian notification is likely a legal/regulatory requirement.

### Communication Failure Scenarios

**SCENARIO-001: Network Blackout**
If travelers lose cellular connectivity (remote area, infrastructure damage), they receive no alerts. The app has an offline queue for outbound requests but does not cache received alerts. Mitigation: implement local alert storage that persists through app restarts and syncs on reconnection.

**SCENARIO-002: Quiet Hours During Overnight Emergency**
A severe earthquake at 2 AM would have SMS and push suppressed by quiet hours if severity is "Moderate" or below. While "Extreme" and "Severe" override quiet hours, the initial classification might be "Moderate" before reclassification. Mitigation: consider eliminating quiet hours entirely for seismic, severe weather, and security categories regardless of severity level.

**SCENARIO-003: DLQ Failure Cascade**
If email delivery fails for a critical alert, it enters the DLQ. An admin replays it, but the replay function is a placeholder that returns `True` without actually resending. The admin believes the alert was resent when it was not. Mitigation: implement actual replay delivery logic for all three channels.

**SCENARIO-004: Stale Alert Polling**
A 60-second polling interval means a P1 critical alert could take up to 60 seconds to appear in a traveler's alert feed. Combined with non-functional push notifications, this creates a dangerous gap. Mitigation: implement Supabase Realtime subscription for the `trip_alerts` table, providing sub-second alert delivery.

### Unaddressed Emergency Scenarios

- **Medical emergency tracking**: No mechanism to log and track medical incidents (injury, illness, allergic reaction) with timestamped status updates visible to all stakeholders.
- **Missing person protocol**: Muster check-ins exist but there is no automated cross-reference against the participant roster to identify who has NOT checked in. No automated escalation for missing persons.
- **Evacuation route guidance**: Rally points and safe houses exist as static locations but there is no dynamic routing from a traveler's current location to the nearest safe point.
- **Multi-hazard compound scenarios**: The risk model scores hazards independently. There is no mechanism to aggregate risk when multiple concurrent hazards affect the same trip (e.g., earthquake + tsunami + infrastructure damage).

---

## Recommendations

### Recommendation 1: Implement Push Notification Delivery (Priority: IMMEDIATE)

Complete the `deliver_via_push()` implementation using the Expo Push API. The mobile app already registers tokens and the backend has a `push_tokens` storage mechanism. The delivery worker infrastructure and retry logic are in place. This is estimated as a 2-3 day implementation task that eliminates the single most dangerous communication gap. Additionally, implement Supabase Realtime subscription in the mobile app's `useAlertsQuery` hook to provide sub-second alert delivery alongside push notifications.

### Recommendation 2: Build SOS / Panic Button (Priority: IMMEDIATE)

Add a persistent, always-accessible SOS button to the mobile app's trip layout. On activation: capture current GPS, create a `trip_alert` with category "emergency" and severity "Extreme" and delivery_bucket "urgent", trigger push + SMS + email to all chaperones and org_admin simultaneously (bypassing normal delivery policy), and surface a "call local emergency number" prompt using the `country_profiles` data. Log the SOS event in `protection_events` for audit trail.

### Recommendation 3: Extend Escalation Chain to SafeTrekr HQ (Priority: HIGH)

Add two additional escalation tiers to the `EscalationWorker`:
- **Tier 3 (3x SLA)**: Escalate to SafeTrekr analyst pool (role: `analyst`)
- **Tier 4 (4x SLA)**: Escalate to SafeTrekr HQ operations (roles: `hq_ops`, `hq_security`)
- **Tier 5 (5x SLA)**: External notification (email to pre-configured emergency distribution list)

This ensures that even if the organization's admin is unreachable, SafeTrekr's operations team becomes aware and can intervene.

### Recommendation 4: Implement Guardian Real-Time Alerts (Priority: HIGH)

Add `guardian` to the `delivery_audience` enum and participant roles. When a trip alert targets `all_participants` or `guardians`, query the `guardians` table for the trip's minor participants, extract guardian contact info, and deliver via the existing email/SMS channels. This is especially important for T3 (international) trips where parents may be in a different timezone and unable to reach their children directly.

### Recommendation 5: Replace Risk Context Hardcoding with Real Trip Data (Priority: HIGH)

Modify `TripImpactEngine._compute_trip_risk()` to query actual trip data instead of using hardcoded context values. Specifically:
- `group_size` from `trip.participant_count`
- `has_minors` from `trip_participants.is_minor` aggregation
- `hospital_distance_km` from `ep_medical_facilities` travel time data
- `infrastructure_quality` and `building_codes` from `country_profiles` if available
- `population` from destination city data

Without this, risk scores are not calibrated to the actual conditions of each trip, undermining the entire risk assessment pipeline.

---

## Dependencies & Constraints

### Duty of Care Requirements

- **Minor Protection**: When transporting minors (K-12, youth sports), the platform assumes a heightened duty of care. Guardian notification, real-time location sharing, and immediate SOS capability are not optional features but legal necessities.
- **In Loco Parentis**: Chaperones and organizations act in place of parents. The platform must provide tools that meet or exceed the standard of care a reasonable parent would exercise.
- **Incident Documentation**: Every safety-relevant event (alert delivery, acknowledgment, escalation, SOS activation, muster results) must be timestamped and preserved for potential legal review. The existing `protection_events` audit trail and `deliveries` table provide a foundation, but gaps exist in medical incident logging and missing person tracking.

### Emergency Response Integration

- **Local Emergency Services**: The `country_profiles` and `country_emergency_services` tables provide contact information but there is no automated integration with local emergency services (e.g., automated 911/112 dispatch). This is intentional -- automated dispatch carries legal liability -- but the platform should provide one-tap access to local emergency numbers.
- **US Embassy Coordination**: For T3 (international) trips, embassy contact information is stored but there is no mechanism for the platform to proactively notify the embassy when a group of US citizens is traveling in-country. This could be a future enhancement for high-risk destinations.

### Communication Redundancy

- **Current State**: Email (functional), SMS (functional), Push (NOT functional), In-App (polling only)
- **Required State**: All four channels operational with Supabase Realtime for sub-second in-app delivery
- **Satellite Communication**: For extremely remote trips (wilderness, developing regions), there is no integration with satellite messaging services (e.g., Garmin inReach, SPOT). This is a potential enhancement for T3 trips to high-risk destinations.
- **Offline Resilience**: The app must be able to display the most recent alerts, emergency contacts, rally point locations, and emergency numbers even without network connectivity. This requires local caching of safety-critical data on each app startup.

### Scalability Constraints

- **Trip Impact Engine**: The current Python-side spatial filtering will degrade significantly as the number of active trips increases. Migration to PostGIS `ST_Intersects` queries is necessary before scaling beyond approximately 500 concurrent active trips.
- **Escalation Worker Polling**: The 60-second polling interval for SLA checking introduces up to 60 seconds of additional latency on escalation detection. For Extreme severity alerts with a 5-minute SLA, this represents a 20% overhead. Consider reducing to 15-second intervals for critical alerts.
- **Supabase Free Tier**: The database is on Supabase, and the memory notes reference free-tier considerations. Safety-critical infrastructure should not be constrained by free-tier limits on connection pooling, bandwidth, or storage.

---

## Appendix: Files Reviewed

| File | Subsystem | Safety Relevance |
|------|-----------|-----------------|
| `TarvaRI/app/services/risk_scoring_service.py` | Intelligence | Risk model, Monte Carlo, trigger matrix |
| `TarvaRI/app/services/trip_impact_engine.py` | Intelligence | Spatio-temporal hazard matching |
| `TarvaRI/app/services/delivery_service.py` | Intelligence | Multi-channel delivery, DLQ, retry |
| `TarvaRI/app/services/delivery_policy_service.py` | Intelligence | Quiet hours, channel policies |
| `TarvaRI/app/services/trip_alerts_service.py` | Intelligence | Alert routing, acknowledgments |
| `TarvaRI/app/workers/escalation_worker.py` | Intelligence | SLA enforcement, escalation chain |
| `safetrekr-core/src/api/v1/routes/protection.py` | Core API | Rally points, safe houses, musters, check-ins |
| `safetrekr-core/src/api/v1/routes/emergency_preparedness.py` | Core API | EP contacts, services, medical facilities |
| `safetrekr-core/src/api/v1/routes/emergency_info.py` | Core API | Consolidated emergency data endpoint |
| `safetrekr-core/src/api/v1/routes/alerts.py` | Core API | Alert CRUD, broadcast, acknowledgment |
| `safetrekr-core/src/services/geofence_sync.py` | Core API | Auto geofence creation |
| `safetrekr-core/src/services/checklist_service.py` | Core API | Time/geo triggered safety checklists |
| `safetrekr-traveler-native/providers/NotificationProvider.tsx` | Mobile | Push notification handling |
| `safetrekr-traveler-native/lib/hooks/useAlerts.ts` | Mobile | Alert fetching, 60s polling |
| `safetrekr-traveler-native/components/alerts/AlertsList.tsx` | Mobile | Alert display UI |
| `safetrekr-traveler-native/components/broadcast/SmsBroadcastSection.tsx` | Mobile | Chaperone broadcast UI |
| `safetrekr-traveler-native/components/emergency/TripLeaderCard.tsx` | Mobile | Emergency contact card |
