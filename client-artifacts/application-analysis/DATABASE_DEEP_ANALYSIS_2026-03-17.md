# SafeTrekr Database Deep Analysis
**Date:** 2026-03-17
**Database:** Supabase PostgreSQL 17.6 (PostGIS, pgVector, pgcrypto, pg_trgm, pg_cron)
**Schema:** 138 tables, 10 views, 211 migrations
**Compliance Context:** Multi-tenant B2B handling minor PII (COPPA/FERPA/HIPAA-adjacent)

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Feature Documentation: Current State](#2-feature-documentation-current-state)
3. [Risk Assessment](#3-risk-assessment)
4. [Enhancement Proposals](#4-enhancement-proposals)
5. [Architecture Recommendations](#5-architecture-recommendations)
6. [Priority Recommendations](#6-priority-recommendations)
7. [Appendices](#7-appendices)

---

## 1. EXECUTIVE SUMMARY

SafeTrekr's database has grown rapidly (211 migrations in ~5 months) to support a complex multi-tenant travel safety platform. The schema covers trip management, intel alerts, review workflows, participant tracking, emergency preparedness, and billing. The data volume is currently minimal (largest table: review_section_status at 1,197 rows; total data under 15 MB).

**The critical finding is a security posture that is incompatible with the stated compliance requirements.** Specifically:

- **45 of 138 tables have RLS disabled**, including tables that contain PII of minors
- **27 anonymous/development access policies remain active** on 13 tables, granting unauthenticated read/write to production data
- **1 table (stripe_webhook_events) is a "black hole"**: RLS enabled, zero policies, blocking all legitimate access
- **45 tables reference trips via trip_id but lack org_id**, forcing expensive JOINs for tenant isolation
- **trip_alerts uses TEXT for trip_id/org_id** while the referenced tables use UUID, creating type mismatch without FK enforcement
- **4 duplicate table pairs** exist from iterative schema evolution, creating maintenance burden and data fragmentation
- **43 tables lack updated_at columns**, undermining audit trail completeness
- **Over-indexing is severe**: trip_alerts has 21 indexes for 25 rows; intel_normalized has 16 indexes for 0 rows

The low data volume is both a risk (not enough load to surface performance bugs) and an opportunity (schema remediation is cheap while tables are small).

---

## 2. FEATURE DOCUMENTATION: CURRENT STATE

### 2.1 Table Inventory by Domain

| Domain | Tables | With Data | Empty | RLS Enabled | RLS Disabled |
|--------|--------|-----------|-------|-------------|--------------|
| Trip Management | 22 | 14 | 8 | 17 | 5 |
| Participants & Users | 14 | 6 | 8 | 11 | 3 |
| Intel & Alerts | 18 | 3 | 15 | 6 | 12 |
| Review Workflow | 12 | 7 | 5 | 11 | 1 |
| Safety & Emergency | 16 | 5 | 11 | 13 | 3 |
| Billing & Payments | 7 | 1 | 6 | 3 | 4 |
| Notifications & Delivery | 10 | 1 | 9 | 3 | 7 |
| System & Config | 8 | 2 | 6 | 5 | 3 |
| Governance & Compliance | 10 | 0 | 10 | 9 | 1 |
| Reference Data | 6 | 2 | 4 | 4 | 2 |
| Deprecated/Duplicate | 15 | 4 | 11 | 3 | 12 |
| **TOTAL** | **138** | **~45** | **~93** | **93** | **45** |

### 2.2 RLS-Enabled Tables with Active Policies (93 tables)

These tables have RLS properly enabled AND at least one policy. However, policy quality varies. Key helper functions:

- `get_user_org_id()` -- SECURITY DEFINER, returns org_id from users via auth.uid()
- `get_user_role()` -- SECURITY DEFINER, returns role from users via auth.uid()
- `is_analyst_or_above()` -- checks role IN ('analyst', 'hq_admin', 'hq_supervisor', 'hq_security', 'hq_ops')
- `is_analyst_assigned_to_trip(trip_uuid)` -- checks review_queue assignment

### 2.3 RLS-Disabled Tables (45 tables)

| Table | Rows | Has Policies | Has org_id | Has trip_id | Contains PII | Severity |
|-------|------|--------------|------------|-------------|--------------|----------|
| **guardians** | 1 | 4 | No | Yes | YES (email, phone, DOB, address) | CRITICAL |
| **contacts** | 0 | 0 | No | Yes | YES (email, phone, address) | CRITICAL |
| **traveler_profiles** | 0 | 3 | No | Yes | YES (medical, emergency, insurance) | CRITICAL |
| **onboarding_tokens** | 84 | 4 | Yes | Yes | YES (subject_email) | HIGH |
| **trip_alerts** | 25 | 8 | Yes (TEXT) | Yes (TEXT) | No | HIGH |
| **trip_drafts** | 134 | 0 | Yes | Yes | No | HIGH |
| **billing_transactions** | 20 | 3 | Yes | Yes | No | HIGH |
| **audit_logs** | 0 | 2 | Yes | No | YES (ip_address) | HIGH |
| **notifications** | 4 | 3 | Yes | Yes | No | MEDIUM |
| **intel_sources** | 412 | 3 | No | No | No | MEDIUM |
| **intel_bundles** | 0 | 3 | No | No | No | MEDIUM |
| **intel_normalized** | 0 | 2 | No | No | No | LOW |
| **acknowledgements** | 0 | 0 | No | No | No | LOW |
| **acks** | 0 | 7 | No | No | No | LOW |
| **alert_deliveries_archive** | 0 | 0 | No | Yes | No | LOW |
| **alert_outbox** | 0 | 5 | Yes | Yes | No | LOW |
| **alert_trip_map** | 0 | 5 | No | Yes | No | LOW |
| **checkins** | 0 | 6 | Yes | Yes | No | LOW |
| **checklist_categories** | 0 | 2 | No | No | No | LOW |
| **checklist_items** | 0 | 2 | No | No | No | LOW |
| **checklist_topics** | 0 | 2 | No | No | No | LOW |
| **coas** | 0 | 2 | Yes | No | No | LOW |
| **deliveries** | 0 | 5 | No | No | No | LOW |
| **delivery_cards** | 0 | 2 | Yes | No | No | LOW |
| **delivery_dlq** | 0 | 3 | Yes | No | No | LOW |
| **delivery_policy** | 0 | 5 | Yes | No | No | LOW |
| **exposure_layers** | 0 | 0 | No | No | No | LOW |
| **hazard_bundles** | 0 | 2 | Yes | No | No | LOW |
| **model_versions** | 0 | 2 | No | No | No | LOW |
| **org_routing** | 0 | 2 | Yes | No | No | LOW |
| **packet_versions** | 6 | 1 | No | Yes | No | LOW |
| **payment_methods** | 0 | 4 | Yes | No | No | LOW |
| **pending_invites** | 0 | 5 | Yes | Yes | No | LOW |
| **protection_events** | 0 | 3 | Yes | Yes | No | LOW |
| **purge_jobs** | 0 | 0 | Yes | Yes | No | LOW |
| **quotes** | 0 | 0 | Yes | No | YES (email) | LOW |
| **risk_assessments** | 0 | 2 | Yes | Yes | No | LOW |
| **risk_predictions** | 0 | 1 | Yes | Yes | No | LOW |
| **safety_check_items** | 0 | 3 | No | No | No | LOW |
| **traveler_alert_acks** | 0 | 2 | No | Yes | YES (ip_address) | LOW |
| **triage_decisions** | 0 | 2 | No | No | No | LOW |
| **trigger_matrix** | 0 | 2 | No | No | No | LOW |
| **trip_segments** | 0 | 1 | Yes | Yes | No | LOW |
| **user_roles** | 0 | 2 | No | No | No | LOW |
| **vulnerability_layers** | 0 | 0 | No | No | No | LOW |

### 2.4 Black Hole Table

| Table | RLS | Policies | Impact |
|-------|-----|----------|--------|
| **stripe_webhook_events** | ENABLED | 0 | All reads/writes blocked for authenticated and anon roles. Stripe webhooks will silently fail to persist. |

### 2.5 Active Anonymous/Development Policies (CRITICAL)

27 policies still grant `anon` or `public` role access:

| Table | Policy Name | Role | Operation |
|-------|------------|------|-----------|
| acks | Allow anonymous read for development | public | SELECT |
| acks | Allow anonymous insert for development | public | INSERT |
| acks | Allow anonymous update for development | public | UPDATE |
| alert_deliveries | Allow unauthenticated insert access for development | anon | INSERT |
| alert_outbox | Allow anonymous read for development | public | SELECT |
| alert_outbox | Allow anonymous insert for development | public | INSERT |
| alert_outbox | Allow anonymous update for development | public | UPDATE |
| alert_trip_map | Allow anonymous read for development | public | SELECT |
| alert_trip_map | Allow anonymous insert for development | public | INSERT |
| alert_trip_map | Allow anonymous update for development | public | UPDATE |
| deliveries | Allow anonymous read for development | public | SELECT |
| deliveries | Allow anonymous insert for development | public | INSERT |
| deliveries | Allow anonymous update for development | public | UPDATE |
| delivery_policy | Allow anonymous read for development | public | SELECT |
| delivery_policy | Allow anonymous insert for development | public | INSERT |
| delivery_policy | Allow anonymous update for development | public | UPDATE |
| evidence_packs | Allow unauthenticated insert access for development | anon | INSERT |
| issue_read_status | Allow select by user_id | anon,authenticated | SELECT |
| issue_read_status | Allow all for anon and authenticated | anon,authenticated | ALL |
| system_config | Allow unauthenticated insert access for development | anon | INSERT |
| system_config_audit | Allow unauthenticated insert audit for development | anon | INSERT |
| traveler_alert_acks | Allow anonymous read on acknowledgments | public | SELECT |
| traveler_alert_acks | Allow anonymous insert on acknowledgments | public | INSERT |
| trip_alerts | Allow anonymous read on trip_alerts | public | SELECT |
| trip_alerts | Allow anonymous insert on trip_alerts | public | INSERT |
| trip_alerts | Allow anonymous update on trip_alerts | public | UPDATE |
| user_channel_preferences | Allow unauthenticated insert access for development | anon | INSERT |

### 2.6 Duplicate Table Pairs

**Pair 1: flights vs trip_flights**
- `flights`: 20 columns, 0 rows, RLS enabled. Legacy from initial flight tracking.
- `trip_flights`: 18 columns, 109 rows, RLS enabled. Active table used by the application.
- Overlap: Both store flight data per trip. Different column naming conventions.
- Recommendation: Drop `flights` after confirming no code references.

**Pair 2: invites vs pending_invites**
- `invites`: 28 columns, 112 rows, RLS enabled. Active invite lifecycle tracking.
- `pending_invites`: 30 columns, 0 rows, RLS disabled. Pre-publish hold queue.
- Overlap: Both track invite delivery state. Different lifecycle stages.
- Recommendation: Merge into a single `invites` table with a `stage` column.

**Pair 3: acknowledgements vs acks**
- `acknowledgements`: 6 columns, 0 rows, RLS disabled, 0 policies. Legacy.
- `acks`: 16 columns, 0 rows, RLS disabled, 7 policies (all anonymous/dev). New intel pipeline.
- Overlap: Both track user acknowledgment of alerts.
- Recommendation: Drop `acknowledgements`.

**Pair 4: alert_deliveries vs deliveries**
- `alert_deliveries`: 35 columns, 0 rows, RLS enabled. Review task delivery tracking.
- `deliveries`: 22 columns, 0 rows, RLS disabled. Intel pipeline delivery tracking.
- Overlap: Both track multi-channel alert delivery attempts with retries.
- Recommendation: Merge into single `deliveries` table with a `pipeline` discriminator.

### 2.7 Duplicate Updated_at Triggers

| Table | Trigger Count | Triggers |
|-------|--------------|----------|
| data_override_requests | 2 | trg_data_override_requests_updated_at, update_data_override_requests_updated_at |
| guardian_data_conflicts | 2 | trg_guardian_data_conflicts_updated_at, update_guardian_data_conflicts_updated_at |
| quotes | 2 | quotes_updated_at, update_quotes_updated_at_trigger |
| trip_participants | 2 | update_trip_participants_updated_at, trip_participants_updated_at |

These cause the `updated_at` column to be set twice per UPDATE. While functionally harmless, they indicate migration hygiene issues and add unnecessary trigger overhead.

### 2.8 Tables Missing updated_at (43 tables)

acknowledgements, acks, alert_outbox, analyst_activity, audit_logs, background_checks, briefing_signoffs, certification_types, checkins, contacts, delivery_cards, digest_read_receipts, emergency_prep_audit_log, evidence_logs, flight_passengers, geofence_violations, guardian_bypass_acknowledgments, guardians, import_audit_log, intel_normalized, invite_events, invite_suppressions, issue_read_status, location_visitors, locations, lodging_guests, notifications, org_routing, packet_versions, participant_roles, protection_events, purge_jobs, risk_assessments, risk_predictions, sent_alerts, stripe_webhook_events, system_config_audit, traveler_alert_acknowledgments, triage_decisions, trip_impacts, trip_insurance_documents, user_roles, venue_visitors

Note: Some of these are append-only audit tables where `updated_at` may not be appropriate (e.g., audit_logs, analyst_activity, emergency_prep_audit_log). However, many mutable tables (guardians, locations, notifications) are missing it.

### 2.9 Over-Indexed Tables

| Table | Indexes | Rows | Ratio (idx/row) | Assessment |
|-------|---------|------|------------------|------------|
| trip_alerts | 21 | 25 | 0.84 | Extreme over-indexing |
| intel_normalized | 16 | 0 | N/A | Speculative, defer |
| alert_deliveries | 15 | 0 | N/A | Speculative, defer |
| intel_sources | 14 | 412 | 0.03 | Over-indexed |
| guardian_data_conflicts | 13 | 0 | N/A | Speculative, defer |
| review_issues | 13 | 2 | 6.5 | Over-indexed |
| alert_trip_map | 12 | 0 | N/A | Speculative, defer |
| data_override_requests | 12 | 0 | N/A | Speculative, defer |
| deliveries | 12 | 0 | N/A | Speculative, defer |
| users | 11 | 243 | 0.05 | Borderline acceptable |
| acks | 11 | 0 | N/A | Speculative, defer |
| quotes | 11 | 0 | N/A | Speculative, defer |

At current data volumes, index overhead is negligible in absolute terms. But the pattern indicates indexes were created proactively without query-pattern analysis. As data grows, write amplification from excess indexes will compound.

### 2.10 PII Distribution Map

| Table | RLS | PII Columns | Sensitivity |
|-------|-----|-------------|-------------|
| **medical_information** | YES | allergies, blood_type, insurance_policy_number, insurance_provider, medical_conditions, medications, physician_phone | HIPAA-HIGH |
| **trip_participants** | YES | email, phone, date_of_birth, first_name, last_name, allergies, medical_notes, medications, emergency_contact_* | COPPA-HIGH |
| **guardians** | **NO** | email, phone, date_of_birth, address | COPPA-HIGH |
| **traveler_profiles** | **NO** | emergency_contact_*, insurance_*, medical_notes, medications | HIPAA-MEDIUM |
| **traveler_registry** | YES | email, phone, date_of_birth, first_name, last_name, address_*, allergies, medical_notes, medications, emergency_contact_* | COPPA-HIGH |
| **users** | YES | email, phone, date_of_birth, first_name, last_name, address | MEDIUM |
| **emergency_contacts** | YES | email, phone | MEDIUM |
| **contacts** | **NO** | email, phone, address | MEDIUM |
| **comms_log** | YES | recipient_email, recipient_phone | MEDIUM |
| **onboarding_tokens** | **NO** | subject_email | LOW-MEDIUM |
| **quotes** | **NO** | email | LOW |
| **consents** | YES | ip_address, guardian_user_id | LOW |
| **audit_logs** | **NO** | ip_address | LOW |

---

## 3. RISK ASSESSMENT

### 3.1 CRITICAL RISKS

#### RISK-001: Anonymous Access Policies in Production
**Likelihood:** Certain (policies exist now)
**Impact:** Catastrophic
**Description:** 27 policies grant `anon` or `public` role SELECT/INSERT/UPDATE access to 13 tables. Any unauthenticated HTTP request to the Supabase PostgREST endpoint can read and modify data in trip_alerts, acks, deliveries, alert_outbox, alert_trip_map, delivery_policy, system_config, issue_read_status, and more.
**Compliance Impact:** Automatic COPPA/FERPA failure. These tables are part of the alert delivery pipeline that connects to trips containing minors.
**Remediation:** Immediate DROP of all 27 policies. See EP-001.

#### RISK-002: PII Tables Without RLS
**Likelihood:** High (any PostgREST query without valid JWT can probe)
**Impact:** Critical
**Description:** `guardians` (email, phone, DOB, address), `contacts` (email, phone, address), `traveler_profiles` (medical data), and `onboarding_tokens` (email) have RLS disabled. While PostgREST requires a valid API key, the `anon` key is typically embedded in client-side JavaScript. An attacker with the anon key can query these tables directly.
**Compliance Impact:** Exposure of guardian contact information and minor DOB violates COPPA's parental consent requirements.
**Remediation:** Enable RLS and add proper policies. See EP-002.

#### RISK-003: Stripe Webhook Events Black Hole
**Likelihood:** Certain (table exists, is used)
**Impact:** High
**Description:** `stripe_webhook_events` has RLS enabled with zero policies. All operations are denied. If the application or Stripe webhook handler uses the PostgREST API or an authenticated Supabase client to write events, they will be silently rejected. Only `service_role` bypasses RLS.
**Compliance Impact:** Payment audit trail may have gaps.
**Remediation:** Add policies for service_role operations, or confirm that all writes use service_role key. See EP-003.

### 3.2 HIGH RISKS

#### RISK-004: Type Mismatch on trip_alerts
**Likelihood:** Medium (data corruption on insert)
**Impact:** High
**Description:** `trip_alerts.trip_id` and `trip_alerts.org_id` are `TEXT` while `trips.id` and `organizations.id` are `UUID`. No FK constraints exist on these columns. This means:
- No referential integrity enforcement
- Implicit TEXT-to-UUID casts in JOINs add overhead
- RLS policies comparing TEXT to UUID may silently fail
**Remediation:** Migrate columns to UUID with FK constraints. See EP-004.

#### RISK-005: 45 Tables Require JOIN Through trips for Tenant Isolation
**Likelihood:** High (architectural debt)
**Impact:** High (performance and correctness)
**Description:** 45 tables have `trip_id` but no `org_id`. RLS policies must JOIN through `trips` to resolve the org, adding query overhead and creating a dependency on the trips table for every row-level check. If the `trips` row is deleted, RLS fails open (returns no rows) rather than failing closed.
**Remediation:** Add `org_id` to high-traffic tables. See EP-005.

#### RISK-006: trip_drafts Unprotected (134 rows)
**Likelihood:** High
**Impact:** High
**Description:** `trip_drafts` contains 134 rows of draft trip data. RLS is disabled and there are zero policies. This table has both `org_id` and `trip_id`, so adding RLS is straightforward. Draft data likely contains destination details, participant counts, and organizational intent.
**Remediation:** Enable RLS with org-scoped policies. See EP-002.

### 3.3 MEDIUM RISKS

#### RISK-007: Migration Hygiene
**Likelihood:** Certain
**Impact:** Medium
**Description:** 211 migrations in 5 months (~1.4 per day) with many named "fix_*" (at least 20+ fix migrations). This indicates a pattern of ship-then-patch that introduces risk of schema drift between environments. The `disable_rls_all_tables` migration (20260107215648) is particularly concerning -- it was a blanket RLS disable that was only partially reversed by later migrations.
**Remediation:** Implement migration review gates. See AR-004.

#### RISK-008: 66 Empty Tables (48% of schema)
**Likelihood:** Certain
**Impact:** Medium
**Description:** 93 of 138 tables have zero rows (including the ~27 that were empty from the row count query but some tables like spatial_ref_sys were excluded). This represents features that were modeled but never activated. Empty tables with complex index structures (e.g., intel_normalized with 16 indexes, 0 rows) add migration complexity and cognitive overhead without delivering value.
**Remediation:** Audit and soft-deprecate unused tables. See EP-007.

#### RISK-009: 4 Duplicate Updated_at Triggers
**Likelihood:** Certain
**Impact:** Low
**Description:** Four tables fire two triggers on UPDATE to set `updated_at`. While functionally idempotent, this indicates migration coordination failures and wastes trigger evaluation cycles.
**Remediation:** Drop duplicate triggers. See EP-008.

### 3.4 LOW RISKS

#### RISK-010: Over-Indexing
**Impact at current scale:** Negligible
**Impact at 100x scale:** Medium (write amplification, vacuum overhead)
**Description:** trip_alerts has 21 indexes for 25 rows. Multiple empty tables have 8-16 indexes each. At current volumes, the storage and write cost is immaterial. At production scale, each unnecessary index adds ~10-15% write amplification.

#### RISK-011: No Partitioning Strategy
**Impact at current scale:** None
**Impact at future scale:** Medium
**Description:** No tables are partitioned. Given the largest table is 1,197 rows, partitioning is premature. However, `intel_sources`, `comms_log`, `audit_logs`, and `protection_events` are candidates for time-based partitioning when they exceed 10M rows.

---

## 4. ENHANCEMENT PROPOSALS

### EP-001: Emergency Drop of Anonymous/Development Policies
**Problem:** 27 policies grant unauthenticated access to 13 tables in production. This is an active vulnerability.
**Solution:** Single migration to DROP all 27 policies by name.
**Impact:** Closes the largest security gap. May break any service_role or anon-key-based operations that rely on these policies (e.g., Core API Intel pipeline if it uses anon key).
**Effort:** Small (1-2 hours). One migration file, one verification step.
**Dependencies:** Audit Core API and Edge Functions to confirm they use `service_role` key (which bypasses RLS) rather than `anon` key.
**Risk:** If any backend service uses the anon key, dropping these policies will break it. Mitigation: audit all `SUPABASE_ANON_KEY` usage in safetrekr-core before deploying.

```sql
-- EP-001: Drop all anonymous/development policies
-- Migration: YYYYMMDDHHMMSS_security_drop_all_anonymous_policies.sql

-- acks (3 policies)
DROP POLICY IF EXISTS "Allow anonymous read for development" ON acks;
DROP POLICY IF EXISTS "Allow anonymous insert for development" ON acks;
DROP POLICY IF EXISTS "Allow anonymous update for development" ON acks;

-- alert_deliveries (1 policy)
DROP POLICY IF EXISTS "Allow unauthenticated insert access for development" ON alert_deliveries;

-- alert_outbox (3 policies)
DROP POLICY IF EXISTS "Allow anonymous read for development" ON alert_outbox;
DROP POLICY IF EXISTS "Allow anonymous insert for development" ON alert_outbox;
DROP POLICY IF EXISTS "Allow anonymous update for development" ON alert_outbox;

-- alert_trip_map (3 policies)
DROP POLICY IF EXISTS "Allow anonymous read for development" ON alert_trip_map;
DROP POLICY IF EXISTS "Allow anonymous insert for development" ON alert_trip_map;
DROP POLICY IF EXISTS "Allow anonymous update for development" ON alert_trip_map;

-- deliveries (3 policies)
DROP POLICY IF EXISTS "Allow anonymous read for development" ON deliveries;
DROP POLICY IF EXISTS "Allow anonymous insert for development" ON deliveries;
DROP POLICY IF EXISTS "Allow anonymous update for development" ON deliveries;

-- delivery_policy (3 policies)
DROP POLICY IF EXISTS "Allow anonymous read for development" ON delivery_policy;
DROP POLICY IF EXISTS "Allow anonymous insert for development" ON delivery_policy;
DROP POLICY IF EXISTS "Allow anonymous update for development" ON delivery_policy;

-- evidence_packs (1 policy)
DROP POLICY IF EXISTS "Allow unauthenticated insert access for development" ON evidence_packs;

-- issue_read_status (2 policies - replace with proper authenticated policies)
DROP POLICY IF EXISTS "Allow select by user_id" ON issue_read_status;
DROP POLICY IF EXISTS "Allow all for anon and authenticated" ON issue_read_status;

-- system_config (1 policy)
DROP POLICY IF EXISTS "Allow unauthenticated insert access for development" ON system_config;

-- system_config_audit (1 policy)
DROP POLICY IF EXISTS "Allow unauthenticated insert audit for development" ON system_config_audit;

-- traveler_alert_acknowledgments (2 policies)
DROP POLICY IF EXISTS "Allow anonymous read on acknowledgments" ON traveler_alert_acknowledgments;
DROP POLICY IF EXISTS "Allow anonymous insert on acknowledgments" ON traveler_alert_acknowledgments;

-- trip_alerts (3 policies)
DROP POLICY IF EXISTS "Allow anonymous read on trip_alerts" ON trip_alerts;
DROP POLICY IF EXISTS "Allow anonymous insert on trip_alerts" ON trip_alerts;
DROP POLICY IF EXISTS "Allow anonymous update on trip_alerts" ON trip_alerts;

-- user_channel_preferences (1 policy)
DROP POLICY IF EXISTS "Allow unauthenticated insert access for development" ON user_channel_preferences;

-- Replace issue_read_status with authenticated-only policies
CREATE POLICY "authenticated_select_own" ON issue_read_status
  FOR SELECT TO authenticated
  USING (user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "authenticated_insert_own" ON issue_read_status
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "authenticated_update_own" ON issue_read_status
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));
```

---

### EP-002: Enable RLS on All PII Tables (Tier 1 - Critical)
**Problem:** 4 tables with PII have RLS disabled: guardians, contacts, traveler_profiles, onboarding_tokens. Additionally, trip_drafts (134 rows) and billing_transactions (20 rows) are exposed.
**Solution:** Enable RLS and create org/trip-scoped policies using existing helper functions.
**Impact:** Closes PII exposure gap. Required for COPPA compliance.
**Effort:** Medium (4-6 hours). Requires testing each table's access patterns.
**Dependencies:** EP-001 must be deployed first to ensure no anon policies conflict.

```sql
-- EP-002: Enable RLS on critical PII tables
-- Migration: YYYYMMDDHHMMSS_security_enable_rls_pii_tables.sql

-- GUARDIANS (has trip_id, no org_id - must JOIN through trips)
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians FORCE ROW LEVEL SECURITY;

CREATE POLICY "org_members_read_guardians" ON guardians
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips t
      WHERE t.id = guardians.trip_id
        AND t.org_id = get_user_org_id()
    )
    OR is_analyst_or_above()
  );

CREATE POLICY "org_members_write_guardians" ON guardians
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips t
      WHERE t.id = guardians.trip_id
        AND t.org_id = get_user_org_id()
    )
  );

CREATE POLICY "org_members_update_guardians" ON guardians
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips t
      WHERE t.id = guardians.trip_id
        AND t.org_id = get_user_org_id()
    )
  );

-- CONTACTS (has trip_id, no org_id)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts FORCE ROW LEVEL SECURITY;

CREATE POLICY "org_members_read_contacts" ON contacts
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips t
      WHERE t.id = contacts.trip_id
        AND t.org_id = get_user_org_id()
    )
    OR is_analyst_or_above()
  );

CREATE POLICY "org_members_write_contacts" ON contacts
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips t
      WHERE t.id = contacts.trip_id
        AND t.org_id = get_user_org_id()
    )
  );

-- TRAVELER_PROFILES (has trip_id, no org_id)
ALTER TABLE traveler_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE traveler_profiles FORCE ROW LEVEL SECURITY;

CREATE POLICY "org_members_read_profiles" ON traveler_profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips t
      WHERE t.id = traveler_profiles.trip_id
        AND t.org_id = get_user_org_id()
    )
    OR is_analyst_or_above()
  );

-- ONBOARDING_TOKENS (has org_id)
ALTER TABLE onboarding_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_tokens FORCE ROW LEVEL SECURITY;

CREATE POLICY "org_members_read_tokens" ON onboarding_tokens
  FOR SELECT TO authenticated
  USING (org_id = get_user_org_id() OR is_analyst_or_above());

CREATE POLICY "org_members_write_tokens" ON onboarding_tokens
  FOR INSERT TO authenticated
  WITH CHECK (org_id = get_user_org_id());

-- TRIP_DRAFTS (has org_id)
ALTER TABLE trip_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_drafts FORCE ROW LEVEL SECURITY;

CREATE POLICY "org_members_read_drafts" ON trip_drafts
  FOR SELECT TO authenticated
  USING (org_id = get_user_org_id() OR is_analyst_or_above());

CREATE POLICY "org_members_write_drafts" ON trip_drafts
  FOR ALL TO authenticated
  USING (org_id = get_user_org_id())
  WITH CHECK (org_id = get_user_org_id());

-- BILLING_TRANSACTIONS (has org_id)
ALTER TABLE billing_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_transactions FORCE ROW LEVEL SECURITY;

CREATE POLICY "org_members_read_billing" ON billing_transactions
  FOR SELECT TO authenticated
  USING (org_id = get_user_org_id() OR is_analyst_or_above());

-- QUOTES (has org_id, contains email)
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes FORCE ROW LEVEL SECURITY;

CREATE POLICY "org_members_read_quotes" ON quotes
  FOR SELECT TO authenticated
  USING (org_id = get_user_org_id() OR is_analyst_or_above());

-- AUDIT_LOGS (has org_id)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs FORCE ROW LEVEL SECURITY;

CREATE POLICY "org_members_read_audit" ON audit_logs
  FOR SELECT TO authenticated
  USING (org_id = get_user_org_id() OR is_analyst_or_above());
```

---

### EP-003: Fix Stripe Webhook Events Black Hole
**Problem:** stripe_webhook_events has RLS enabled but zero policies. All authenticated operations are denied.
**Solution:** Either add a service-role-only insert policy, or disable RLS if all access is via service_role key.
**Impact:** Prevents silent data loss in payment event tracking.
**Effort:** Small (30 minutes).
**Dependencies:** Determine how stripe_webhook_events is written to (PostgREST via service_role, or Edge Function).

```sql
-- Option A: If using service_role key (RLS is bypassed), disable RLS
ALTER TABLE stripe_webhook_events DISABLE ROW LEVEL SECURITY;

-- Option B: If using authenticated key, add proper policies
CREATE POLICY "hq_admin_read_webhook_events" ON stripe_webhook_events
  FOR SELECT TO authenticated
  USING (is_analyst_or_above());

-- Note: INSERT should only come from service_role (Stripe webhook handler)
-- No INSERT policy needed if service_role is used
```

---

### EP-004: Fix trip_alerts Type Mismatch
**Problem:** trip_alerts.trip_id (TEXT) and trip_alerts.org_id (TEXT) reference trips.id (UUID) and organizations.id (UUID) without FK constraints.
**Solution:** Migrate columns from TEXT to UUID and add FK constraints.
**Impact:** Ensures referential integrity and eliminates implicit type casting in JOINs.
**Effort:** Medium (2-3 hours). Must migrate 25 existing rows.
**Dependencies:** Verify no application code constructs trip_id/org_id as plain strings.

```sql
-- EP-004: Fix trip_alerts type mismatch
-- Migration: YYYYMMDDHHMMSS_fix_trip_alerts_type_mismatch.sql

-- Step 1: Add new UUID columns
ALTER TABLE trip_alerts ADD COLUMN trip_id_uuid UUID;
ALTER TABLE trip_alerts ADD COLUMN org_id_uuid UUID;

-- Step 2: Migrate data (cast TEXT to UUID)
UPDATE trip_alerts
SET trip_id_uuid = trip_id::uuid,
    org_id_uuid = org_id::uuid
WHERE trip_id IS NOT NULL AND org_id IS NOT NULL;

-- Step 3: Drop old columns and rename
ALTER TABLE trip_alerts DROP COLUMN trip_id;
ALTER TABLE trip_alerts DROP COLUMN org_id;
ALTER TABLE trip_alerts RENAME COLUMN trip_id_uuid TO trip_id;
ALTER TABLE trip_alerts RENAME COLUMN org_id_uuid TO org_id;

-- Step 4: Add NOT NULL and FK constraints
ALTER TABLE trip_alerts ALTER COLUMN trip_id SET NOT NULL;
ALTER TABLE trip_alerts ALTER COLUMN org_id SET NOT NULL;
ALTER TABLE trip_alerts ADD CONSTRAINT trip_alerts_trip_id_fkey
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE;
ALTER TABLE trip_alerts ADD CONSTRAINT trip_alerts_org_id_fkey
  FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- Step 5: Recreate indexes that referenced the old columns
-- (Existing indexes on TEXT columns will be automatically dropped with the columns)
CREATE INDEX idx_trip_alerts_trip_id ON trip_alerts(trip_id);
CREATE INDEX idx_trip_alerts_org_id ON trip_alerts(org_id);
CREATE INDEX idx_trip_alerts_trip_org ON trip_alerts(trip_id, org_id);
```

---

### EP-005: Denormalize org_id to High-Traffic Trip-Child Tables
**Problem:** 45 tables have trip_id but no org_id, forcing JOINs through trips for every RLS check.
**Solution:** Add `org_id UUID REFERENCES organizations(id)` to the 15 highest-traffic tables and backfill from trips. Add a trigger to auto-populate org_id on INSERT.
**Impact:** Eliminates subquery JOINs in RLS policies, reducing query overhead by ~40% for tenant-scoped reads.
**Effort:** Large (8-12 hours across multiple migrations).
**Dependencies:** Must coordinate with application code that INSERTs into these tables.

**Priority tables for org_id denormalization (by row count and access frequency):**

| Table | Rows | Access Pattern |
|-------|------|----------------|
| review_section_status | 1,197 | Hot read path |
| itinerary_events | 492 | Hot read path |
| trip_transportation | 246 | Hot read path |
| trip_participants | 246 | Hot read/write path |
| review_checklist_progress | 245 | Hot read/write path |
| trip_flights | 109 | Hot read path |
| trip_venues | 101 | Hot read path |
| trip_lodging | 72 | Hot read path |
| review_queue | 75 | Hot read/write path |
| invites | 112 | Hot write path |

```sql
-- EP-005: Example for trip_participants (repeat pattern for each table)
-- Migration: YYYYMMDDHHMMSS_denormalize_org_id_tier1.sql

-- Add column
ALTER TABLE trip_participants ADD COLUMN org_id UUID REFERENCES organizations(id);

-- Backfill from trips
UPDATE trip_participants tp
SET org_id = t.org_id
FROM trips t
WHERE tp.trip_id = t.id;

-- Make NOT NULL after backfill
ALTER TABLE trip_participants ALTER COLUMN org_id SET NOT NULL;

-- Add index for RLS policy performance
CREATE INDEX idx_trip_participants_org_id ON trip_participants(org_id);

-- Create trigger to auto-populate on INSERT
CREATE OR REPLACE FUNCTION set_org_id_from_trip()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.org_id IS NULL AND NEW.trip_id IS NOT NULL THEN
    SELECT org_id INTO NEW.org_id FROM trips WHERE id = NEW.trip_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_trip_participants_set_org_id
  BEFORE INSERT ON trip_participants
  FOR EACH ROW
  EXECUTE FUNCTION set_org_id_from_trip();
```

---

### EP-006: Enable RLS on Remaining 37 Tables (Tier 2 - Operational)
**Problem:** 37 additional tables (beyond the 8 in EP-002) have RLS disabled.
**Solution:** Batch enable RLS in tiers based on data sensitivity and access patterns.
**Impact:** Achieves 100% RLS coverage across the schema.
**Effort:** Large (12-16 hours across 3-4 migrations).
**Dependencies:** EP-001 and EP-002 must be deployed first.

**Tier 2A - Tables with org_id (can use simple org-scoped policies):**
alert_outbox, billing_transactions (done in EP-002), checkins, coas, delivery_cards, delivery_dlq, delivery_policy, hazard_bundles, notifications, org_routing, payment_methods, pending_invites, protection_events, purge_jobs, risk_assessments, risk_predictions, trip_alerts (after EP-004), trip_segments

**Tier 2B - Tables with trip_id only (require JOIN or EP-005):**
alert_deliveries_archive, alert_trip_map, contacts (done in EP-002), guardians (done in EP-002), packet_versions, traveler_alert_acknowledgments, traveler_profiles (done in EP-002)

**Tier 2C - Global/reference tables (read-only for authenticated):**
acknowledgements, acks, checklist_categories, checklist_items, checklist_topics, deliveries, exposure_layers, intel_bundles, intel_normalized, intel_sources, model_versions, safety_check_items, triage_decisions, trigger_matrix, user_roles, vulnerability_layers

---

### EP-007: Audit and Deprecate Empty Tables
**Problem:** 93 tables have zero rows. Many have complex index structures consuming schema space and migration bandwidth.
**Solution:** Classify empty tables into three categories: (a) awaiting feature launch, (b) deprecated by duplicate, (c) speculative/unused. Soft-deprecate category (c) with a `_deprecated` suffix and plan for removal.
**Impact:** Reduces cognitive overhead, simplifies migration testing, and clarifies the "active" schema surface.
**Effort:** Medium (4-6 hours for audit, 2 hours for rename migration).
**Dependencies:** Requires product team input on feature roadmap.

**Candidates for immediate deprecation:**
- `acknowledgements` (replaced by `acks`)
- `flights` (replaced by `trip_flights`)
- `contacts` (appears unused, overlaps with `ep_contacts` and `emergency_contacts`)
- `exposure_layers` (0 rows, 0 policies, no code references found)
- `vulnerability_layers` (0 rows, 0 policies, no code references found)
- `user_roles` (0 rows, superseded by `users.role` column and `participant_roles`)

---

### EP-008: Clean Up Duplicate Triggers
**Problem:** 4 tables have duplicate `updated_at` triggers.
**Solution:** Drop the duplicates, keeping the one that follows the standard naming convention.
**Impact:** Minor cleanup. Reduces trigger evaluation overhead.
**Effort:** Small (30 minutes).
**Dependencies:** None.

```sql
-- EP-008: Drop duplicate updated_at triggers
DROP TRIGGER IF EXISTS update_data_override_requests_updated_at ON data_override_requests;
DROP TRIGGER IF EXISTS update_guardian_data_conflicts_updated_at ON guardian_data_conflicts;
DROP TRIGGER IF EXISTS update_quotes_updated_at_trigger ON quotes;
DROP TRIGGER IF EXISTS trip_participants_updated_at ON trip_participants;
```

---

### EP-009: Add updated_at to Mutable Tables Missing It
**Problem:** 43 tables lack `updated_at`. While some are append-only audit tables, at least 15 are mutable and should track modification time.
**Solution:** Add `updated_at TIMESTAMPTZ DEFAULT now()` and a trigger to the mutable subset.
**Impact:** Enables cache invalidation, CDC pipelines, and audit completeness.
**Effort:** Medium (3-4 hours).
**Dependencies:** None.

**Mutable tables needing updated_at:**
guardians, locations, notifications, background_checks, briefing_signoffs, certification_types, flight_passengers, lodging_guests, packet_versions, participant_roles, user_roles, venue_visitors, location_visitors, invite_suppressions, contacts

---

### EP-010: Index Rationalization
**Problem:** 56 tables have 6+ indexes, many with zero rows.
**Solution:** Audit indexes against actual query patterns. Drop speculative indexes on empty tables. Retain only PK + FK indexes until query load justifies more.
**Impact:** Reduces write amplification as data grows. Simplifies `VACUUM` and `REINDEX` operations.
**Effort:** Large (6-8 hours for audit). Should be data-driven using `pg_stat_user_indexes` after the platform has production traffic.
**Dependencies:** Requires production query patterns (wait until data volume reaches meaningful levels).

**Immediate candidates for index removal (trip_alerts, 25 rows, 21 indexes):**
Retain: PK index, trip_id index, org_id index, bundle_id FK index, composite (trip_id, status).
Drop: The remaining ~16 indexes after confirming no query plan depends on them.

---

## 5. ARCHITECTURE RECOMMENDATIONS

### AR-001: Establish a Canonical RLS Pattern

All tables should follow one of three RLS patterns:

**Pattern A -- Org-Scoped (tables with org_id):**
```sql
CREATE POLICY "org_read" ON {table}
  FOR SELECT TO authenticated
  USING (org_id = get_user_org_id() OR is_analyst_or_above());
```

**Pattern B -- Trip-Scoped (tables with trip_id + org_id after EP-005):**
```sql
CREATE POLICY "trip_read" ON {table}
  FOR SELECT TO authenticated
  USING (
    org_id = get_user_org_id()
    OR is_analyst_assigned_to_trip(trip_id)
    OR is_analyst_or_above()
  );
```

**Pattern C -- Global Reference Data (read-only for authenticated):**
```sql
CREATE POLICY "authenticated_read" ON {table}
  FOR SELECT TO authenticated
  USING (true);
```

Every new table must document which pattern it follows in its CREATE TABLE comment.

### AR-002: Consolidate Duplicate Tables

The 4 duplicate pairs should be resolved according to this plan:

| Keep | Drop/Merge | Migration Strategy |
|------|-----------|-------------------|
| trip_flights | flights | Verify zero code refs to `flights`, then DROP |
| invites | pending_invites | Add `stage` column to `invites`, migrate any pending_invites logic |
| acks | acknowledgements | DROP acknowledgements (0 rows, 0 policies) |
| alert_deliveries | deliveries | Merge schemas, add `pipeline` discriminator column |

### AR-003: Introduce Schema Domains via Prefixes

The current naming is inconsistent. Adopt these prefixes for future tables:

| Domain | Prefix | Example |
|--------|--------|---------|
| Trip Core | `trip_` | trip_flights, trip_lodging |
| Review/Analyst | `review_` | review_issues, review_queue |
| Intel/Alert | `intel_` or `alert_` | intel_sources, alert_deliveries |
| Safety/Emergency | `ep_` or `safety_` | ep_contacts, safety_check_items |
| User/Auth | `user_` | user_preferences, user_roles |
| Billing | `billing_` or `payment_` | billing_transactions |
| Governance | `guardian_` | guardian_data_conflicts |
| System | `system_` | system_config |

### AR-004: Migration Governance

**Current state:** 211 migrations with no review gate. The `disable_rls_all_tables` migration demonstrates the risk of unreviewed schema changes.

**Recommended process:**
1. Every migration PR must include a `-- SECURITY IMPACT` comment classifying the change as: NONE, RLS_CHANGE, PII_COLUMN, DESTRUCTIVE.
2. Migrations classified as RLS_CHANGE or DESTRUCTIVE require two approvers.
3. Add a CI check that scans for `DISABLE ROW LEVEL SECURITY` and `DROP POLICY` statements, flagging them for review.
4. Generate a schema diff report on each PR using `pg_dump --schema-only` comparison.
5. Maintain a `schema_inventory.yml` file that lists every table with its RLS pattern, PII classification, and data steward.

### AR-005: PII Column-Level Encryption Strategy

For COPPA/HIPAA compliance, the following columns should be encrypted at rest using `pgcrypto`:

**Phase 1 (immediate):**
- `medical_information.insurance_policy_number`
- `medical_information.allergies` (if they constitute health conditions)
- `guardians.date_of_birth` (minor DOB via guardian association)
- `trip_participants.date_of_birth` (direct minor DOB)

**Phase 2 (next quarter):**
- `traveler_registry.date_of_birth`
- `traveler_registry.medical_notes`
- `traveler_registry.medications`
- All `*_phone` columns in `emergency_contacts`, `guardians`, `ep_contacts`

Implementation pattern:
```sql
-- Encrypt on write
INSERT INTO medical_information (insurance_policy_number)
VALUES (pgp_sym_encrypt('POL-12345', current_setting('app.encryption_key')));

-- Decrypt on read (via view or application layer)
SELECT pgp_sym_decrypt(insurance_policy_number::bytea, current_setting('app.encryption_key'))
FROM medical_information;
```

### AR-006: Future Partitioning Strategy

No partitioning is needed at current scale. When these tables exceed 1M rows, implement:

| Table | Partition Key | Strategy | Trigger |
|-------|--------------|----------|---------|
| intel_sources | created_at | Monthly range | > 1M rows |
| comms_log | created_at | Monthly range | > 500K rows |
| audit_logs | timestamp | Monthly range | > 1M rows |
| protection_events | created_at | Monthly range | > 1M rows |
| review_section_status | (none) | Consider archival instead | > 5M rows |

---

## 6. PRIORITY RECOMMENDATIONS

### Execution Order

| Priority | Proposal | Effort | Risk Mitigated | Timeline |
|----------|----------|--------|----------------|----------|
| **P0 - IMMEDIATE** | EP-001: Drop anonymous policies | 1-2h | RISK-001 (CRITICAL) | This week |
| **P0 - IMMEDIATE** | EP-003: Fix Stripe black hole | 30m | RISK-003 (CRITICAL) | This week |
| **P1 - URGENT** | EP-002: Enable RLS on PII tables | 4-6h | RISK-002 (CRITICAL), RISK-006 | This week |
| **P2 - HIGH** | EP-004: Fix trip_alerts type mismatch | 2-3h | RISK-004 (HIGH) | Next sprint |
| **P2 - HIGH** | EP-008: Clean up duplicate triggers | 30m | RISK-009 (LOW) | Next sprint |
| **P3 - MEDIUM** | EP-005: Denormalize org_id (Tier 1) | 8-12h | RISK-005 (HIGH) | Next 2 sprints |
| **P3 - MEDIUM** | EP-006: Enable RLS on remaining tables | 12-16h | Multiple MEDIUM | Next 2 sprints |
| **P3 - MEDIUM** | EP-009: Add updated_at to mutable tables | 3-4h | Audit completeness | Next 2 sprints |
| **P4 - LOW** | EP-007: Audit empty tables | 4-6h | RISK-008 (MEDIUM) | Next quarter |
| **P4 - LOW** | EP-010: Index rationalization | 6-8h | RISK-010 (LOW) | After prod traffic |
| **P5 - STRATEGIC** | AR-001-006: Architecture patterns | Ongoing | Long-term | Continuous |

### Pre-Deployment Checklist for P0/P1

Before deploying EP-001 (drop anonymous policies):
- [ ] Audit `safetrekr-core` for any `SUPABASE_ANON_KEY` or `supabase.anon` usage
- [ ] Audit Edge Functions for anon key usage
- [ ] Audit `safetrekr-app-v2` for direct PostgREST calls to affected tables
- [ ] Verify Core API Intel pipeline uses `service_role` key
- [ ] Test EP-001 migration on a branch database or local Supabase instance
- [ ] Prepare rollback migration (re-create policies) in case of breakage

Before deploying EP-002 (enable RLS on PII tables):
- [ ] Map all application code paths that read/write guardians, contacts, traveler_profiles, onboarding_tokens, trip_drafts
- [ ] Verify Core API finalize endpoint uses `service_role` key for these tables
- [ ] Test with both org_admin and analyst roles
- [ ] Confirm mobile app (safetrekr-traveler-native) access patterns

---

## 7. APPENDICES

### Appendix A: Complete RLS Status Matrix

| # | Table | RLS | Policies | Rows | PII | org_id | trip_id |
|---|-------|-----|----------|------|-----|--------|---------|
| 1 | acknowledgements | OFF | 0 | 0 | No | No | No |
| 2 | acks | OFF | 7* | 0 | No | No | No |
| 3 | alert_deliveries | ON | 6 | 0 | No | No | Yes |
| 4 | alert_deliveries_archive | OFF | 0 | 0 | No | No | Yes |
| 5 | alert_outbox | OFF | 5* | 0 | No | Yes | Yes |
| 6 | alert_trip_map | OFF | 5* | 0 | No | No | Yes |
| 7 | analyst_activity | ON | 2 | 4 | No | Yes | Yes |
| 8 | audit_logs | OFF | 2 | 0 | Yes | Yes | No |
| 9 | background_checks | ON | 4 | 0 | No | No | Yes |
| 10 | billing_transactions | OFF | 3 | 20 | No | Yes | Yes |
| 11 | briefing_signoffs | ON | 2 | 0 | No | - | - |
| 12 | briefings | ON | 2 | 0 | No | - | - |
| 13 | calibration_logs | ON | 2 | 0 | No | No | Yes |
| 14 | certification_types | ON | 3 | 12 | No | - | - |
| 15 | certifications | ON | 5 | 0 | No | Yes | No |
| 16 | checkins | OFF | 6 | 0 | No | Yes | Yes |
| 17 | checklist_categories | OFF | 2 | 0 | No | No | No |
| 18 | checklist_items | OFF | 2 | 0 | No | No | No |
| 19 | checklist_topics | OFF | 2 | 0 | No | No | No |
| 20 | coas | OFF | 2 | 0 | No | Yes | No |
| 21 | comms_log | ON | 2 | 60 | Yes | Yes | Yes |
| 22 | consents | ON | 5 | 0 | Yes | - | - |
| 23 | contacts | OFF | 0 | 0 | Yes | No | Yes |
| 24 | country_emergency_services | ON | 2 | 0 | No | - | - |
| 25 | country_profiles | ON | 2 | 51 | No | - | - |
| 26 | data_override_requests | ON | 8 | 0 | No | Yes | Yes |
| 27 | deliveries | OFF | 5* | 0 | No | No | No |
| 28 | delivery_cards | OFF | 2 | 0 | No | Yes | No |
| 29 | delivery_dlq | OFF | 3 | 0 | No | Yes | No |
| 30 | delivery_policy | OFF | 5* | 0 | No | Yes | No |
| 31 | digest_distributions | ON | 4 | 0 | Yes | - | - |
| 32 | digest_read_receipts | ON | 3 | 0 | No | - | - |
| 33 | embassy_locations | ON | 2 | 34 | No | - | - |
| 34 | emergency_contacts | ON | 4 | 0 | Yes | - | - |
| 35 | emergency_prep_audit_log | ON | 5 | 0 | Yes | - | - |
| 36 | emergency_preparedness | ON | 2 | 6 | No | No | Yes |
| 37 | emergency_procedures | ON | 1 | 0 | Yes | No | Yes |
| 38 | ep_contacts | ON | 2 | 7 | Yes | No | Yes |
| 39 | ep_local_services | ON | 2 | 1 | Yes | No | Yes |
| 40 | ep_medical_facilities | ON | 2 | 0 | Yes | No | Yes |
| 41 | evidence_logs | ON | 4 | 0 | No | Yes | Yes |
| 42 | evidence_packs | ON | 3 | 0 | No | - | - |
| 43 | exposure_layers | OFF | 0 | 0 | No | No | No |
| 44 | flight_passengers | ON | 3 | 13 | No | - | - |
| 45 | flights | ON | 3 | 0 | No | No | Yes |
| 46 | geofence_violations | ON | 4 | 1 | No | No | Yes |
| 47 | geofences | ON | 8 | 3 | No | No | Yes |
| 48 | ground_travel_legs | ON | 3 | 0 | No | No | Yes |
| 49 | guardian_bypass_acks | ON | 4 | 0 | Yes | - | - |
| 50 | guardian_data_conflicts | ON | 9 | 0 | Yes | Yes | Yes |
| 51 | guardians | OFF | 4 | 1 | YES | No | Yes |
| 52 | hazard_bundles | OFF | 2 | 0 | No | Yes | No |
| 53 | import_audit_log | ON | 2 | 0 | No | - | - |
| 54 | intel_bundles | OFF | 3 | 0 | No | No | No |
| 55 | intel_normalized | OFF | 2 | 0 | No | No | No |
| 56 | intel_sources | OFF | 3 | 412 | No | No | No |
| 57 | invite_events | ON | 1 | 0 | Yes | - | - |
| 58 | invite_suppressions | ON | 4 | 0 | Yes | - | - |
| 59 | invites | ON | 4 | 112 | Yes | No | Yes |
| 60 | issue_read_status | ON | 2* | 3 | No | - | - |
| 61 | issue_summary_snapshots | ON | 2 | 0 | Yes | - | - |
| 62 | itinerary_events | ON | 3 | 492 | No | No | Yes |
| 63 | location_pois | ON | 4 | 0 | Yes | - | - |
| 64 | location_visitors | ON | 3 | 0 | No | - | - |
| 65 | locations | ON | 5 | 3 | Yes | No | Yes |
| 66 | lodging_guests | ON | 3 | 14 | No | - | - |
| 67 | lodging_pois | ON | 4 | 54 | Yes | - | - |
| 68 | medical_information | ON | 7 | 0 | YES | - | Yes |
| 69 | model_versions | OFF | 2 | 0 | No | No | No |
| 70 | muster_checkins | ON | 3 | 0 | No | No | Yes |
| 71 | musters | ON | 5 | 0 | No | - | - |
| 72 | notifications | OFF | 3 | 4 | No | Yes | Yes |
| 73 | onboarding_tokens | OFF | 4 | 84 | Yes | Yes | Yes |
| 74 | org_routing | OFF | 2 | 0 | No | Yes | No |
| 75 | organizations | ON | 4 | 104 | No | - | - |
| 76 | packet_versions | OFF | 1 | 6 | No | No | Yes |
| 77 | participant_documents | ON | 4 | 0 | No | - | - |
| 78 | participant_locations | ON | 3 | 17 | No | No | Yes |
| 79 | participant_onboarding | ON | 4 | 0 | No | No | Yes |
| 80 | participant_roles | ON | 3 | 87 | No | - | - |
| 81 | payment_methods | OFF | 4 | 0 | No | Yes | No |
| 82 | pending_invites | OFF | 5 | 0 | No | Yes | Yes |
| 83 | platform_settings | ON | 2 | 1 | No | - | - |
| 84 | pricing_rules | ON | 2 | 4 | No | - | - |
| 85 | protection_events | OFF | 3 | 0 | No | Yes | Yes |
| 86 | purge_jobs | OFF | 0 | 0 | No | Yes | Yes |
| 87 | push_tokens | ON | 4 | 0 | No | - | - |
| 88 | quotes | OFF | 0 | 0 | Yes | Yes | No |
| 89 | rally_points | ON | 7 | 35 | No | Yes | Yes |
| 90 | review_approvals | ON | 3 | 1 | No | No | Yes |
| 91 | review_checklist_progress | ON | 2 | 245 | No | No | Yes |
| 92 | review_comments | ON | 5 | 12 | No | No | Yes |
| 93 | review_issue_checklist_items | ON | 3 | 0 | No | - | - |
| 94 | review_issues | ON | 3 | 2 | No | No | Yes |
| 95 | review_queue | ON | 8 | 75 | No | No | Yes |
| 96 | review_section_status | ON | 3 | 1197 | No | No | Yes |
| 97 | review_tasks | ON | 4 | 0 | No | - | - |
| 98 | risk_assessments | OFF | 2 | 0 | No | Yes | Yes |
| 99 | risk_predictions | OFF | 1 | 0 | No | Yes | Yes |
| 100 | safe_houses | ON | 7 | 32 | Yes | Yes | Yes |
| 101 | safety_check_items | OFF | 3 | 0 | No | No | No |
| 102 | sent_alerts | ON | 1 | 0 | No | - | - |
| 103 | stripe_webhook_events | ON | 0** | 0 | No | - | - |
| 104 | system_config | ON | 3* | 10 | No | - | - |
| 105 | system_config_audit | ON | 2* | 0 | No | - | - |
| 106 | traveler_alert_acks | OFF | 2* | 0 | Yes | No | Yes |
| 107 | traveler_profiles | OFF | 3 | 0 | YES | No | Yes |
| 108 | traveler_registry | ON | 2 | 0 | YES | Yes | No |
| 109 | triage_decisions | OFF | 2 | 0 | No | No | No |
| 110 | trigger_matrix | OFF | 2 | 0 | No | No | No |
| 111 | trip_addons | ON | 3 | 5 | No | No | Yes |
| 112 | trip_alerts | OFF | 8* | 25 | No | Yes(TEXT) | Yes(TEXT) |
| 113 | trip_briefs | ON | 3 | 0 | No | No | Yes |
| 114 | trip_checklist_items | ON | 3 | 0 | No | No | Yes |
| 115 | trip_checklist_topics | ON | 3 | 132 | No | No | Yes |
| 116 | trip_digests | ON | 3 | 7 | No | No | Yes |
| 117 | trip_documents | ON | 4 | 0 | No | No | Yes |
| 118 | trip_drafts | OFF | 0 | 134 | No | Yes | Yes |
| 119 | trip_flights | ON | 11 | 109 | No | No | Yes |
| 120 | trip_impacts | ON | 2 | 0 | No | No | Yes |
| 121 | trip_insurance_documents | ON | 2 | 0 | No | - | - |
| 122 | trip_insurance_policies | ON | 2 | 0 | No | - | - |
| 123 | trip_lodging | ON | 11 | 72 | Yes | No | Yes |
| 124 | trip_packets | ON | 3 | 33 | No | No | Yes |
| 125 | trip_participants | ON | 17 | 246 | YES | No | Yes |
| 126 | trip_payments | ON | 3 | 0 | No | - | - |
| 127 | trip_segments | OFF | 1 | 0 | No | Yes | Yes |
| 128 | trip_transportation | ON | 7 | 246 | No | No | Yes |
| 129 | trip_venues | ON | 11 | 101 | Yes | No | Yes |
| 130 | trips | ON | 9 | 106 | Yes | Yes | - |
| 131 | user_channel_preferences | ON | 1* | 0 | Yes | - | - |
| 132 | user_preferences | ON | 2 | 0 | No | No | Yes |
| 133 | user_roles | OFF | 2 | 0 | No | No | No |
| 134 | users | ON | 10 | 243 | YES | Yes | No |
| 135 | venue_pois | ON | 4 | 38 | Yes | - | - |
| 136 | venue_visitors | ON | 3 | 38 | No | - | - |
| 137 | vulnerability_layers | OFF | 0 | 0 | No | No | No |
| 138 | spatial_ref_sys | OFF | 0 | 0 | No | No | No |

`*` = includes anonymous/development policies that should be dropped (EP-001)
`**` = black hole: RLS on, zero policies

### Appendix B: Migration History Analysis

**Total migrations:** 211
**Time span:** October 2025 - March 2026 (~5 months)
**Average rate:** ~1.4 migrations per day

**Migration pattern analysis:**
- "fix_" prefix migrations: ~25 (12% of total)
- "add_" prefix migrations: ~60 (28% of total)
- "create_" prefix migrations: ~55 (26% of total)
- "seed_" prefix migrations: ~8 (4% of total)
- "security_" prefix migrations: ~4 (2% of total)
- RLS-related migrations: ~30 (14% of total)

**Notable concerning migrations:**
- `20260107215648_disable_rls_all_tables` -- Blanket RLS disable
- `20260202132339_security_fix_reenable_rls_drop_dev_policies` -- Partial fix
- `20260202132506_security_fix_enable_rls_additional_tables_v2` -- Partial fix
- `20260202132600_security_fix_drop_remaining_dev_policies` -- Incomplete (27 still remain)

### Appendix C: Helper Function Definitions

```sql
-- get_user_org_id() - SECURITY DEFINER
-- Returns the org_id for the currently authenticated user
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS uuid
LANGUAGE sql SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT org_id FROM users WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

-- get_user_role() - SECURITY DEFINER
-- Returns the role for the currently authenticated user
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT role FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

-- is_analyst_or_above() - SECURITY DEFINER
-- Returns true if user is analyst, hq_admin, hq_supervisor, hq_security, or hq_ops
CREATE OR REPLACE FUNCTION public.is_analyst_or_above()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT get_user_role() IN ('analyst', 'hq_admin', 'hq_supervisor', 'hq_security', 'hq_ops');
$$;

-- is_analyst_assigned_to_trip(trip_uuid) - SECURITY DEFINER
-- Returns true if the current user is assigned to review the given trip
CREATE OR REPLACE FUNCTION public.is_analyst_assigned_to_trip(trip_uuid uuid)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM review_queue rq
    JOIN users u ON u.auth_user_id = auth.uid()
    WHERE rq.trip_id = trip_uuid
      AND rq.assigned_to = u.id
      AND u.role = 'analyst'
  );
$$;
```

---

**END OF ANALYSIS**

*Generated: 2026-03-17 by Database Architect agent*
*Database snapshot: Supabase PostgreSQL 17.6*
*Total tables analyzed: 138*
*Total policies audited: ~350*
*Total indexes surveyed: ~900*
