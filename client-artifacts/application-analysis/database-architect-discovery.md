# SafeTrekr Database Architecture Discovery Analysis

**Date:** 2026-03-17
**Platform:** Supabase-hosted PostgreSQL 17.6
**Schema:** public -- 138 base tables, 10 views, 211 applied migrations

## Executive Summary

SafeTrekr's database has grown rapidly into a 138-table schema across 211 migrations in roughly five months. The platform runs PostgreSQL 17.6 on Supabase with PostGIS 3.3.7, pgVector 0.8.0, pgcrypto, pg_trgm, and pg_cron.

Three structural problems demand immediate attention:

1. **45 tables have Row Level Security disabled**, including trip_alerts, intel_bundles, guardians, billing_transactions, audit_logs, and user_roles.
2. **47 trip-child tables lack an org_id column**, forcing RLS policies to JOIN through trips for tenant isolation.
3. **Significant table duplication** exists: flights/trip_flights, invites/pending_invites, acknowledgements/acks, alert_deliveries/deliveries.

Current data volume is tiny (largest real table ~1.3MB / 412 rows). This is the ideal time to address structural debt.

## Key Findings

1. **45 of 138 tables have RLS disabled.** Including trip_alerts, intel_bundles, intel_normalized, guardians, billing_transactions, audit_logs, notifications, user_roles, trip_drafts, triage_decisions, and 33 others.

2. **1 table (stripe_webhook_events) has RLS enabled but zero policies.** Effectively a black hole -- no role can access data.

3. **47 tables reference trip_id without denormalized org_id.** Requires JOIN to trips for org-scoped filtering. Makes RLS policies expensive and fragile.

4. **Type mismatch on trip_alerts:** trip_id and org_id are TEXT columns referencing UUID primary keys. Prevents FK enforcement.

5. **Duplicate table pairs:** flights vs trip_flights, invites vs pending_invites, acknowledgements vs acks, alert_deliveries vs deliveries.

6. **4 tables have duplicate updated_at triggers.**

7. **44 tables lack updated_at column** including intel_normalized, checkins, audit_logs, flight_passengers, guardians.

8. **Over-indexing on small tables:** trip_alerts has 21 indexes for ~25 rows. intel_normalized has 16 indexes for 0 rows.

9. **211 migrations in ~5 months** -- extremely high velocity with many "fix" migrations.

10. **No partitioning strategy.** Tables like intel_normalized, trip_alerts, comms_log, audit_logs will need time-based partitioning.

## Top 5 Recommendations

1. **Enable RLS on All 45 Unprotected Tables (CRITICAL)** - Tier 1 (Day 1): guardians, billing_transactions, onboarding_tokens, intel_sources. Tier 2 (Day 2): trip_alerts, intel_bundles, intel_normalized, triage_decisions. Tier 3 (Day 3): remaining 33 tables. (2-3 days)

2. **Add org_id to All Trip-Child Tables (HIGH)** - Add org_id column, backfill from trips, add BEFORE INSERT trigger, rewrite RLS policies. Eliminates JOIN-through-trips from every RLS check. (3-5 days)

3. **Fix trip_alerts Type Mismatch + Consolidate Duplicate Tables (HIGH)** - Alter trip_id/org_id from TEXT to UUID. Deprecate flights in favor of trip_flights. Consolidate acknowledgements/acks and alert_deliveries/deliveries. (5-8 days)

4. **Add updated_at to All 44 Missing Tables (MEDIUM)** - Standard trigger-based timestamp. Establish schema convention. (2-3 days)

5. **Conduct Index Audit (MEDIUM)** - Drop unused indexes on trip_alerts (21 indexes, 25 rows). Add indexes to under-indexed tables. Evaluate spatial indexes. (1-2 days)

## Schema Statistics

| Metric | Value |
|--------|-------|
| Total base tables | 138 |
| Tables with RLS enabled | 93 |
| Tables with RLS disabled | 45 |
| Tables with trip_id but no org_id | 47 |
| Tables missing updated_at | 44 |
| Largest table by index count | trip_alerts (21 indexes) |
| PostgreSQL version | 17.6 |
| Extensions | 11 (postgis, vector, pgcrypto, pg_trgm, pg_cron, pg_net, pg_stat_statements, pg_graphql, supabase_vault, uuid-ossp, plpgsql) |
