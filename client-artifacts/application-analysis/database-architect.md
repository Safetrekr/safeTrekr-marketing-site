The report is too large to write as a file. Let me present it directly here as the analysis output instead.

---

# SafeTrekr Database Deep Analysis

**Date:** 2026-03-23
**Analyst:** Database Architect Agent (Claude Opus 4.6) + OpenAI gpt-5.4 + Gemini 3.1 Pro consensus
**Database:** Supabase PostgreSQL with RLS, PostGIS 3.3.7, pgVector 0.8.0
**Tables:** 137 public tables | ~230 migrations | ~500 rows peak per table (early stage)

---

## EXECUTIVE SUMMARY

SafeTrekr's database has solid foundational design -- strong CHECK constraints (120+), a well-structured RLS helper function layer, and SHA-256 hash-chain evidence logging. However, the analysis reveals **critical security gaps**, **compliance risks involving minors' data**, and **architectural debt** that must be addressed before production scale.

**Severity breakdown:**
- **CRITICAL (P0):** 5 findings
- **HIGH (P1):** 6 findings
- **MEDIUM (P2):** 6 findings
- **LOW (P3):** 3 findings

---

## 1. CRITICAL FINDING: 44 Tables with RLS Disabled

Of 137 public tables, **44 have RLS disabled**. Many of these have RLS policies defined that are completely dead code because RLS is not enabled.

**HIGH-SENSITIVITY tables with RLS OFF but policies defined (useless policies):**

| Table | Why It Matters | Defined Policies (All Dead) |
|-------|---------------|---------------------------|
| `guardians` | Guardian PII: names, DOB, phone, address | 4 policies |
| `trip_alerts` | Alert data for all trips across all orgs | 8 policies |
| `billing_transactions` | Financial records | 3 policies |
| `payment_methods` | Payment instrument details | 4 policies |
| `onboarding_tokens` | Auth tokens for account activation | 4 policies |
| `pending_invites` | Pre-auth invitation data | 5 policies |
| `audit_logs` | Security audit trail | 2 policies |
| `traveler_profiles` | Traveler medical notes, emergency contacts | 3 policies |
| `notifications` | All user notifications | 3 policies |
| `intel_sources` | Intelligence source credentials and configs | 3 policies |
| `intel_bundles` | Aggregated intelligence data | 3 policies |
| `intel_normalized` | Normalized threat data | 2 policies |

Additionally, `stripe_webhook_events` has RLS **enabled** but **zero policies**, meaning all access is denied.

---

## 2. CRITICAL FINDING: Grant Over-Permissioning

Both `anon` and `authenticated` roles have **FULL PRIVILEGES** (INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER) on every sampled sensitive table, including:

- `medical_information` -- minors' allergies, blood type, medical conditions
- `guardians` -- guardian PII (RLS OFF)
- `emergency_contacts` -- emergency contact details
- `billing_transactions` -- financial records (RLS OFF)
- `payment_methods` -- payment instruments (RLS OFF)
- `onboarding_tokens` -- auth tokens (RLS OFF)
- `evidence_logs` -- tamper-evident audit trail
- `trip_alerts` -- threat intelligence (RLS OFF)
- `audit_logs` -- security audit trail (RLS OFF)

**This means: An unauthenticated user with the Supabase anon key can TRUNCATE the evidence_logs table, DELETE all medical_information, or INSERT fake audit_logs.** The anon key is typically embedded in frontend JavaScript and must be considered public.

---

## 3. RLS POLICY AUDIT

### 3.1 RLS Helper Functions

All 9 helper functions are correctly `SECURITY DEFINER`:

| Function | Purpose | Volatility |
|----------|---------|------------|
| `is_org_member(uuid)` | Check user belongs to target org | STABLE |
| `is_hq_staff()` | Check for HQ roles with org_id IS NULL | VOLATILE (should be STABLE) |
| `can_access_trip(uuid)` | Verify org membership for trip | STABLE |
| `get_user_org_id()` | Return current user's org_id | VOLATILE (should be STABLE) |
| `get_user_role()` | Return current user's role | STABLE |
| `is_org_admin()` | Check for org_admin role | VOLATILE (should be STABLE) |
| `is_trip_participant(uuid)` | Check trip participation | VOLATILE (should be STABLE) |
| `is_analyst_assigned_to_trip(uuid)` | Check analyst assignment | VOLATILE (should be STABLE) |
| `user_participates_in_trip(uuid,uuid)` | Validate trip participation by user | STABLE |

**Performance bottleneck:** Every RLS policy evaluation triggers a subquery to the `users` table via `auth.uid()`. At current scale this is invisible (<1ms), but at 10K+ rows it becomes measurable (50-200ms per query).

**Security gaps:**
- None of the SECURITY DEFINER functions have `SET search_path` -- this is a SQL injection vector
- Functions marked VOLATILE will not be cached within a transaction, causing redundant execution

### 3.2 Policy Completeness Gaps

| Table | Missing Operations |
|-------|--------------------|
| `emergency_procedures` | Only SELECT -- no INSERT, UPDATE, DELETE |
| `invite_events` | Only SELECT |
| `trip_impacts` | Only SELECT |
| `user_channel_preferences` | Only INSERT -- no SELECT or UPDATE |
| `packet_versions` | Only INSERT |

### 3.3 Policy Accumulation

`trip_participants` has **19 RLS policies** -- the most of any table. The `trips` table has 9 with overlapping DELETE and UPDATE policies that should be consolidated.

---

## 4. SCHEMA ASSESSMENT

### 4.1 Wide Tables

| Table | Columns | Concern |
|-------|---------|---------|
| `trips` | 43 | `poc_name` + `poc_first_name` + `poc_last_name` all coexist; payment fields mixed with travel data |
| `alert_deliveries` | 38 | Delivery lifecycle + acknowledgment + metadata in one row |
| `trip_alerts` | 38 | Alert metadata + delivery config + status combined |

### 4.2 Table Consolidation Opportunities

**Three nearly identical POI tables:**
- `location_pois` (21 cols), `lodging_pois` (19 cols), `venue_pois` (19 cols)
- Should unify into a single `pois` table with `parent_type` discriminator

**Three overlapping invite tables:**
- `invites` (28 cols), `pending_invites` (29 cols), `onboarding_tokens` (17 cols)
- Represent lifecycle stages of the same concept with significant column overlap

### 4.3 PII Sprawl

PII is spread across **80+ columns in 30+ tables**:
- `date_of_birth` in 5 tables
- `phone` in 15+ tables
- `medical_notes`/`allergies` in 3 tables
- `address` in 12+ tables

This makes GDPR right-to-delete extremely difficult to implement correctly.

### 4.4 Missing Constraints

- No `UNIQUE` constraint on `users.auth_user_id` (critical for dual-ID mapping integrity)
- No CHECK for `end_date > start_date` on trips
- No CHECK for `expires_at > created_at` on tokens
- No CHECK for `event_hash` format validation on evidence_logs

### 4.5 Data Types

**Good:** UUIDs everywhere, TIMESTAMPTZ for all timestamps, extensive CHECK constraints, inet for IPs.

**Issues:**
- `participant_locations.lat/lng` stored as `double precision` instead of PostGIS geography
- `rally_points.contact_phone` uses `character varying` while all others use `text`
- No `citext` for case-insensitive email matching

---

## 5. TRIGGER AUDIT

### 5.1 Missing updated_at Triggers

**25 tables** have `updated_at` columns but no auto-update trigger. Critical ones:

- `emergency_contacts` (PII table)
- `evidence_packs` (evidence integrity)
- `medical_information` (PII, compliance audit)
- `invites` (lifecycle tracking)
- `review_comments`, `review_issues`, `review_tasks` (workflow tracking)
- `review_section_status` (review progress)
- `trip_alerts` (alert lifecycle)
- `trip_documents`, `trip_payments` (financial/legal)

### 5.2 Duplicate Triggers

| Table | Issue |
|-------|-------|
| `data_override_requests` | TWO updated_at triggers |
| `trip_participants` | TWO updated_at triggers |
| `quotes` | TWO updated_at triggers |
| `guardian_data_conflicts` | TWO updated_at triggers |
| `guardians` | FOUR conflict detection triggers (two pairs) |

### 5.3 Evidence Hash Chain

The `evidence_logs` table has `prev_hash` (nullable) and `event_hash` (NOT NULL) but:
1. No trigger computes `event_hash` at DB level
2. `prev_hash` is nullable, allowing chain breaks
3. No immutability enforcement (UPDATE/DELETE not restricted)
4. No chain validation function exists

---

## 6. INDEX OPTIMIZATION

### 6.1 Critical Missing Indexes

**PostGIS spatial index for geofencing (mandatory):**
```sql
ALTER TABLE participant_locations
ADD COLUMN geom geography(Point, 4326)
GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) STORED;

CREATE INDEX idx_participant_locations_geom
ON participant_locations USING GIST (geom);
```

**Tenant-first composite indexes:**
```sql
CREATE INDEX idx_trips_org_status_start ON trips (org_id, status, start_date DESC);
CREATE INDEX idx_trip_participants_org_trip ON trip_participants (org_id, trip_id, status);
CREATE INDEX idx_trip_alerts_org_trip ON trip_alerts (org_id, trip_id, created_at DESC);
CREATE INDEX idx_review_queue_org_status ON review_queue (org_id, status, created_at DESC);
CREATE INDEX idx_evidence_logs_trip_time ON evidence_logs (trip_id, "timestamp" DESC);
```

**Partial indexes for hot working sets:**
```sql
CREATE INDEX idx_active_alerts ON trip_alerts (trip_id) WHERE status = 'active';
CREATE INDEX idx_pending_reviews ON review_queue (org_id) WHERE status IN ('pending','assigned','in_progress');
CREATE INDEX idx_unconsumed_tokens ON onboarding_tokens (token) WHERE state = 'pending';
CREATE INDEX idx_open_issues ON review_issues (trip_id, severity) WHERE status IN ('open','in_progress');
```

**BRIN for time-series tables:**
```sql
CREATE INDEX idx_participant_locations_time_brin ON participant_locations USING BRIN (recorded_at);
CREATE INDEX idx_audit_logs_time_brin ON audit_logs USING BRIN (created_at);
CREATE INDEX idx_evidence_logs_time_brin ON evidence_logs USING BRIN ("timestamp");
```

**Trigram for fuzzy search:**
```sql
CREATE INDEX idx_users_email_trgm ON users USING GIN (email gin_trgm_ops);
CREATE INDEX idx_users_name_trgm ON users USING GIN (name gin_trgm_ops);
```

---

## 7. DATA RETENTION AND COMPLIANCE

### 7.1 No Retention Policy Exists (CRITICAL)

SafeTrekr processes data of **minors** (K-12 students). This triggers COPPA (US), potentially GDPR Article 8 (EU), FERPA, and SOPIPA.

**No table has:** `deleted_at`, `retention_until`, `anonymized_at`, or `purged_at` columns. Data accumulates indefinitely.

**Required retention matrix:**

| Data Category | Tables | Retention | Legal Basis |
|--------------|--------|-----------|-------------|
| Minor PII (DOB, medical) | users, trip_participants, medical_information | 90 days post-trip | COPPA |
| Guardian contacts | guardians, emergency_contacts | 90 days post-trip | COPPA |
| Location tracking | participant_locations | 30 days post-trip | Data minimization |
| Background checks | background_checks | 2 years | FCRA |
| Consent records | consents | Duration + 3 years | GDPR Art. 7 |
| Billing/payment | billing_transactions | 7 years | Tax regulations |
| Evidence/audit | evidence_logs, audit_logs | 7 years minimum | Legal defensibility |

### 7.2 No GDPR Right-to-Delete Mechanism

No function or procedure exists to cascade-delete or anonymize a user's data across the 30+ tables containing their PII.

---

## 8. TOP 12 ENHANCEMENT RECOMMENDATIONS

| # | Enhancement | Impact | Effort | Priority |
|---|-----------|--------|--------|----------|
| 1 | Enable RLS on all 44 unprotected tables | CRITICAL | 1 day | P0 |
| 2 | Revoke anon/authenticated over-grants | CRITICAL | 1 day | P0 |
| 3 | Add UNIQUE on users.auth_user_id | CRITICAL | 30 min | P0 |
| 4 | Harden SECURITY DEFINER functions (search_path, STABLE) | HIGH | 1 day | P1 |
| 5 | Add composite tenant FKs (org_id, id) on parent/child tables | HIGH | 2 days | P1 |
| 6 | Migrate RLS to JWT-claim-based policies | HIGH | 3-5 days | P1 |
| 7 | Add PostGIS spatial index on participant_locations | HIGH | 1 day | P1 |
| 8 | Implement data retention pg_cron jobs for PII | HIGH | 2-3 days | P1 |
| 9 | Fix missing updated_at triggers (25 tables) + remove duplicates | MEDIUM | 1 day | P1 |
| 10 | Add tenant-first composite + partial indexes | MEDIUM | 1 day | P2 |
| 11 | Consolidate POI tables (3 into 1) | MEDIUM | 2-3 days | P2 |
| 12 | Create materialized views for dashboards + pg_cron refresh | MEDIUM | 2 days | P2 |

---

## 9. MIGRATION STRATEGY

### Phase 1 -- This Week (P0: Security)
1. `security_enable_rls_all_tables` -- Enable RLS on all 44 tables
2. `security_revoke_excessive_grants` -- Strip anon/authenticated of TRUNCATE, DELETE, etc.
3. `security_add_auth_user_id_unique` -- UNIQUE constraint on dual-ID mapping
4. `security_harden_definer_functions` -- search_path + STABLE markings

### Phase 2 -- Next 2 Weeks (P1: Foundation)
5. `perf_add_tenant_composite_indexes` -- org_id-first indexes
6. `perf_add_spatial_index` -- PostGIS on participant_locations
7. `fix_triggers` -- Add missing, remove duplicates
8. `compliance_retention_infrastructure` -- Columns + pg_cron jobs
9. `integrity_tenant_composite_fks` -- Cross-org corruption prevention

### Phase 3 -- Next Month (P2: Optimization)
10. `refactor_consolidate_pois` -- Unify 3 POI tables
11. `perf_materialized_views` -- Dashboard MVs
12. `perf_partial_indexes` -- Status-filtered indexes
13. `integrity_evidence_chain` -- Append-only + chain trigger

**All migrations must use:**
- `CREATE INDEX CONCURRENTLY` for zero-downtime
- Additive changes only in Phase 1
- Feature flags via `system_config` for policy toggles
- Rollback scripts for each migration

---

## 10. SCORECARD

| Dimension | Current | Target | Key Gap |
|-----------|:-------:|:------:|---------|
| Security (RLS) | 3/10 | 9/10 | 44 tables unprotected |
| Security (Grants) | 2/10 | 9/10 | anon can TRUNCATE evidence_logs |
| Data Integrity | 6/10 | 9/10 | Missing constraints, duplicate triggers |
| Compliance | 2/10 | 8/10 | No retention, no COPPA mechanism |
| Indexing | 5/10 | 8/10 | Missing spatial, tenant-first, partial |
| Performance | 7/10 | 9/10 | RLS subquery overhead |
| Schema Design | 6/10 | 8/10 | POI duplication, PII sprawl |
| Migration Hygiene | 6/10 | 8/10 | No rollback scripts |

**Overall: 4.6/10 --> Target: 8.5/10**

---

## 11. CONSENSUS NOTES (GPT-5.4 + Gemini 3.1 Pro)

Both external models independently agreed on the same top-3 priorities:

1. **Enable RLS on all 44 unprotected tables immediately** -- rated as the single highest-risk finding by both
2. **Migrate RLS from user-table subqueries to JWT claims** -- recommended as the architectural fix for the performance/security tension
3. **Implement data retention/anonymization for minors' PII** -- both emphasized the COPPA/GDPR legal exposure

Additional consensus points:
- **Composite tenant FKs** (org_id, id) to prevent cross-org data corruption at the schema level, not just RLS
- **PII segregation** into a restricted schema for defense-in-depth
- **PostGIS spatial indexes** are mandatory for the geofencing use case
- **Avoid blanket soft-delete** -- use hard delete/anonymize for PII, append-only for audit, soft-delete only for operational entities
- **External anchoring** for evidence hash chain -- DB-only chains are not tamper-proof against privileged actors

---

The database has good bones. The CHECK constraints, UUID primary keys, TIMESTAMPTZ consistency, and evidence logging concept are all solid foundations. The P0 security items (RLS enablement + grant revocation + auth_user_id uniqueness) should be addressed within the next 48 hours given the sensitivity of the data being handled.