# Discovery Summary: SafeTrekr

## Date: 2026-03-17
## Mode: codebase
## Agents Used (8 of 11 — 3 hit API errors)

| # | Agent | Status |
|---|-------|--------|
| 1 | world-class-ux-designer | Complete |
| 2 | world-class-ui-designer | Complete |
| 3 | information-architect | Complete |
| 4 | world-class-product-narrative-strategist | Complete |
| 5 | world-class-appsec-security-architect | Complete |
| 6 | world-class-secret-service-protective-agent | Complete |
| 7 | chief-technology-architect | Complete |
| 8 | database-architect | Complete |
| 9 | world-class-product-strategy-analyst-market | API 500 Error |
| 10 | world-class-autonomous-interface-architect | API 500 Error |
| 11 | quality-engineering-lead | API 500 Error |

---

## Codebase Statistics

| Metric | Value |
|--------|-------|
| Total Lines of Code | ~292,074 |
| Total Files | ~1,429 |
| Database Tables | 138 (66 empty) |
| Applied Migrations | 211 |
| API Endpoints | 250+ |
| User Roles | 10 |
| Analyst Review Sections | 17-18 |
| Intel Parsers | 5 active |
| Background Workers | 5 |
| Services | 6 (Next.js, Expo, Core API, TarvaRI, core-logic, marketing) |

---

## CRITICAL FINDINGS (Immediate Action Required)

### CF-1: Plaintext Stripe Credentials in Repository
**Source:** AppSec Architect
**File:** `stripe_creds.md` at project root
**Action:** Delete immediately, rotate Stripe password, scan git history with gitleaks

### CF-2: 45 Database Tables Without Row Level Security
**Source:** Database Architect, AppSec Architect
**Impact:** Any authenticated Supabase client can read/write guardians (minor PII), billing_transactions, audit_logs, trip_alerts, intel_bundles, intel_sources (API keys), and 39 others
**Action:** Enable RLS with proper policies in 3 tiers over 3 days

### CF-3: Push Notifications Never Actually Send
**Source:** Protective Agent
**File:** `TarvaRI/app/services/delivery_service.py` line 748
**Impact:** `deliver_via_push()` returns `False`. Mobile has full notification infrastructure but backend never triggers it. For a platform protecting minors in the field, this is the most dangerous gap.
**Action:** Implement push delivery via Expo Push API

### CF-4: Risk Scoring Uses Hardcoded Fake Data
**Source:** Protective Agent
**File:** `TarvaRI/app/services/trip_impact_engine.py` lines 143-154
**Impact:** Hardcodes `group_size: 25`, `hospital_distance_km: 5.0`, `has_minors: True` instead of querying actual trip records. Every risk score is based on fictional context.
**Action:** Wire to actual trip data from Supabase

### CF-5: TarvaRI Intel Pipeline is Completely Dormant
**Source:** CTO Architect
**Impact:** Zero rows in intel_normalized, intel_bundles, triage_decisions, delivery_cards, risk_assessments. The platform's primary differentiator has never processed a single record.
**Action:** Activate end-to-end pipeline with pilot sources

### CF-6: No SOS / Panic Button in Mobile App
**Source:** Protective Agent
**Impact:** No one-tap emergency activation exists. TripLeaderCard provides call/text/email to trip leader but no mechanism to simultaneously alert all chaperones, org, and HQ.
**Action:** Build SOS feature with multi-channel broadcast

---

## HIGH-PRIORITY FINDINGS

### HP-1: Analyst Review Workspace Uses Mock Data
**Source:** UX Designer
**File:** `safetrekr-app-v2/src/app/analyst/trip-review/[tripId]/layout.tsx` line 49
**Impact:** Reads trip metadata from mockReviewQueue, not live API. Console.log stub for sign-out.

### HP-2: Emergency Response Flows Have TODO Stubs
**Source:** UX Designer
**File:** `safetrekr-traveler-native/components/pages/today/TravelerTodayView.tsx` line 93
**Impact:** Rally command acknowledgment, emergency number resolution, muster completion all stubbed.

### HP-3: Escalation Chain Stops at org_admin
**Source:** Protective Agent
**File:** `TarvaRI/app/workers/escalation_worker.py`
**Impact:** If org_admin is unreachable, no further escalation. HQ never notified.

### HP-4: Guardians Receive No Alerts
**Source:** Protective Agent
**Impact:** delivery_audience options don't include guardians. Parents of minors have no real-time visibility.

### HP-5: trips.py is 5,182 Lines (God File)
**Source:** CTO Architect
**Impact:** Single Python file handles trip creation, finalization (8+ table inserts), participants, flights, lodging, venues, transportation, itinerary. Every documented production bug traces to this file.

### HP-6: Development RLS Policies Still Active
**Source:** AppSec Architect
**Impact:** Anonymous-access policies granting database access in development mode.

### HP-7: JWT Audience Verification Disabled
**Source:** AppSec Architect
**Impact:** JWT tokens accepted without audience verification.

### HP-8: 47 Trip-Child Tables Lack org_id Column
**Source:** Database Architect
**Impact:** Every RLS policy JOINs through trips for tenant isolation. Performance bottleneck at scale.

### HP-9: Trip Creation Wizard Has No Auto-Save
**Source:** UX Designer
**Impact:** 50+ components, 10 steps, 30+ minutes of configuration — no draft recovery. Browser close = total data loss.

### HP-10: Token Divergence Between Web and Mobile
**Source:** UI Designer
**Impact:** Web and mobile define colors independently. Mobile has 30+ hardcoded hex values.

---

## Cross-Agent Consensus (Findings Multiple Agents Agreed On)

### 1. Security is Not Production-Ready (5 agents)
- **AppSec**: Plaintext credentials, disabled JWT verification, dev RLS policies
- **Database**: 45 tables without RLS, type mismatches preventing FK enforcement
- **CTO**: Development anonymous-access policies still active
- **Protective**: Push delivery broken, escalation incomplete
- **UX**: Emergency TODO stubs in production code

### 2. The Intel Pipeline is the Primary Differentiator But Doesn't Work (4 agents)
- **CTO**: Zero rows in all pipeline tables — completely dormant
- **Protective**: Risk scoring uses fake data, push delivery returns False
- **Narrative**: The unique mechanism (analyst + AI intel) is invisible in marketing
- **Database**: intel_normalized has 16 indexes but 0 rows

### 3. Dual Auth System is a Structural Problem (3 agents)
- **CTO**: Only patched, not fixed. Two independent session stores can permanently desync
- **AppSec**: No refresh token revocation (30-day window), confused identity mapping
- **Database**: Dual user ID requires helper functions in every RLS policy

### 4. The Product is Narratively Undersold (2 agents)
- **Narrative**: "Technically deep but narratively undersold." Marketing site communicates almost none of the platform's moat.
- **UX**: 50+ features across 3 portals and mobile app — massive capability surface that's invisible externally

### 5. Information Architecture Needs Consolidation (3 agents)
- **IA**: 5 independent sidebar implementations, fractured role types, inconsistent terminology
- **UI**: 3 competing styling patterns in mobile, no shared token pipeline
- **CTO**: Shared core-logic package has 7 files and is copied rather than linked

---

## Divergent Perspectives

### On Complexity vs. Simplification
- **CTO Architect** emphasizes decomposing trips.py (5,182 lines) and activating TarvaRI as highest priorities
- **IA** emphasizes consolidating navigation and establishing shared vocabulary
- **UI Designer** focuses on token pipeline unification and responsive analyst layout
- Both approaches are valid but represent different timelines (CTO = backend/infrastructure, IA/UI = frontend/UX)

### On Security Urgency
- **AppSec** identifies 19 findings with 1 Critical + 6 High and recommends security sprint
- **Database** identifies 45 tables without RLS and recommends immediate enablement
- **CTO** acknowledges security gaps but prioritizes activating the intel pipeline first
- Resolution: Security (CF-1 stripe_creds.md) must be Day 1. RLS enablement can parallel pipeline activation.

### On Market Timing
- **Narrative** recommends immediate marketing rewrite before any feature work
- **CTO** recommends activating differentiating features first (intel pipeline) to have something to market
- Resolution: Both are right — activate pipeline (gives demo-able content) while simultaneously rewriting marketing narrative

---

## Priority Matrix

| Feature/Issue | UX | UI | IA | Narrative | AppSec | Protective | CTO | DB | Consensus |
|--------------|----|----|-----|-----------|--------|------------|-----|-----|-----------|
| RLS Security | - | - | - | - | CRITICAL | - | HIGH | CRITICAL | **CRITICAL** |
| Stripe Creds Leak | - | - | - | - | CRITICAL | - | HIGH | - | **CRITICAL** |
| Push Notifications | - | - | - | - | - | CRITICAL | - | - | **CRITICAL** |
| Intel Pipeline Activation | - | - | - | HIGH | - | HIGH | CRITICAL | - | **CRITICAL** |
| Risk Scoring Fake Data | - | - | - | - | - | CRITICAL | - | - | **CRITICAL** |
| SOS Panic Button | - | - | - | - | - | CRITICAL | - | - | **CRITICAL** |
| Analyst Mock Data | HIGH | - | - | - | - | - | - | - | **HIGH** |
| Emergency TODO Stubs | HIGH | - | - | - | - | HIGH | - | - | **HIGH** |
| trips.py Decomposition | - | - | - | - | - | - | CRITICAL | - | **HIGH** |
| Escalation Chain | - | - | - | - | - | HIGH | - | - | **HIGH** |
| Guardian Alerts | - | - | - | - | - | HIGH | - | - | **HIGH** |
| org_id Denormalization | - | - | - | - | - | - | - | HIGH | **HIGH** |
| Auto-Save Wizard | HIGH | - | - | - | - | - | - | - | **HIGH** |
| Auth System Fix | - | - | - | - | HIGH | - | HIGH | - | **HIGH** |
| Global Search | - | - | CRITICAL | - | - | - | - | - | **HIGH** |
| Token Pipeline | - | HIGH | - | - | - | - | - | - | **MEDIUM** |
| Nav Consolidation | - | - | HIGH | - | - | - | - | - | **MEDIUM** |
| Marketing Rewrite | - | - | - | CRITICAL | - | - | - | - | **MEDIUM** |
| HQ Sidebar Cleanup | - | - | HIGH | - | - | - | - | - | **MEDIUM** |
| Responsive Analyst | - | HIGH | - | - | - | - | - | - | **MEDIUM** |
| Accessibility | - | MEDIUM | MEDIUM | - | - | - | - | - | **MEDIUM** |

---

## Key Risks & Constraints

### Regulatory
- **COPPA**: Majority of participants are minors — verifiable parental consent required
- **FERPA**: K-12 student data protections apply
- **HIPAA**: Medical information stored in JSONB columns
- **SOC 2**: Enterprise customers will require certification

### Technical
- Supabase platform limits (connection pooling, RLS performance)
- 211 migrations in 5 months — migration hygiene needs improvement
- trips.py (5,182 lines) is the load-bearing wall — refactoring is risky
- Dual auth store desync only manifests in production — hard to test

### Operational
- TarvaRI pipeline has never been activated — unknown operational behavior at scale
- Database can grow to 6GB+ without retention policy
- 66 of 138 tables are completely empty — dead schema surface area
- Push notification infrastructure exists but delivery is broken

---

## Recommended Next Steps

1. **IMMEDIATE (Day 1)**: Delete stripe_creds.md, rotate credentials, scan git history
2. **SPRINT 1 (Week 1-2)**: Enable RLS on 45 tables, fix push delivery, wire risk scoring to real data
3. **SPRINT 2 (Week 3-4)**: Activate TarvaRI pipeline end-to-end, add org_id denormalization
4. **SPRINT 3 (Week 5-6)**: Decompose trips.py, fix dual auth architecture, build SOS feature
5. Run `/factory-analyze` to deepen this analysis with feature-level detail
6. Review agent-specific artifacts in `discover-artifacts/`

---

## Artifact Index

| File | Agent | Size |
|------|-------|------|
| `codebase-analysis.md` | Explore Agent | Comprehensive |
| `ux-discovery-analysis.md` | UX Designer | 30+ features assessed |
| `world-class-ui-designer-discovery.md` | UI Designer | Token/component analysis |
| `information-architect-discovery.md` | Information Architect | 51 features, 10 gaps |
| `DISCOVERY-ANALYSIS.md` | Narrative Strategist | 16 features, 12 findings |
| `SECURITY_DISCOVERY_ANALYSIS.md` | AppSec Architect | 19 security findings |
| `protective-operations-discovery.md` | Protective Agent | 13 safety findings |
| `CTA-ARCHITECTURE-DISCOVERY.md` | CTO Architect | 292K LOC analysis |
| `database-architect-discovery.md` | Database Architect | 138-table schema audit |
| `DISCOVERY-SUMMARY.md` | Synthesis | This document |
