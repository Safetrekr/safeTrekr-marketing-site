# Database Architect PRD: SafeTrekr Marketing Site

**Project**: SafeTrekr Marketing Site -- Supabase Data Platform
**Author**: Database Architect Agent
**Date**: 2026-03-24
**Status**: Draft
**Stack**: PostgreSQL 15 via Supabase (separate project from product database)
**Deployment Target**: DigitalOcean DOKS (Kubernetes) with Next.js 15 standalone containers

---

## 1. Scope and Guiding Principles

This PRD defines all data architecture requirements for the SafeTrekr marketing site. The marketing database is a **separate Supabase project** from the product database (`app.safetrekr.com`). There is zero shared state, zero shared credentials, and zero network path between the two. Blast-radius isolation is enforced at the Supabase project level.

**Guiding Principles**

1. **Data integrity first** -- every table has primary keys, constraints, NOT NULL where appropriate, and audit timestamps.
2. **Security by default** -- Row Level Security enabled on every table before any data is inserted. The `anon` key has zero access to any table.
3. **Schema as code** -- all DDL lives in Supabase CLI migration files, version-controlled in Git. Manual changes to the live database are prohibited.
4. **PII minimization** -- raw IP addresses are never stored. Emails are the only directly identifying field, and column-level encryption at rest is applied.
5. **Retention automation** -- data that outlives its purpose is purged automatically, not manually.
6. **Observable from day one** -- `pg_stat_statements` enabled, query latency tracked, connection pool health monitored.

---

## 2. Supabase Project Setup

### FR-DB-001: Dedicated Marketing Supabase Project

**Priority**: P0 -- prerequisite for all other FRs

**Requirements**:

| Setting | Value | Rationale |
|---|---|---|
| Project Name | `safetrekr-marketing` | Clear separation from product project |
| Region | US East (`us-east-1`) | Co-locate with DigitalOcean NYC datacenter for lowest latency to DOKS pods |
| Plan | Pro ($25/month) | Required for PITR, Supavisor, Edge Functions, 8 GB database space |
| Database Password | Generated, stored in DOKS Kubernetes Secret | Never in source control |
| Org | SafeTrekr org (same org as product project, separate project) | Unified billing, separate access |

**Acceptance Criteria**:
- [ ] Supabase project is provisioned on the Pro plan in US East.
- [ ] The project has no foreign data wrappers, linked databases, or network paths to the product Supabase project.
- [ ] `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_ANON_KEY` are stored as Kubernetes Secrets in DOKS, not in source control.
- [ ] The `anon` key is never used in any application code. All database access uses the `service_role` key from server-side Next.js Route Handlers only.
- [ ] Supabase Dashboard access is restricted to authorized team members via Supabase org roles.

### FR-DB-002: Required PostgreSQL Extensions

**Priority**: P0

**Requirements**:

```sql
-- Cryptographic functions for IP hashing and token generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- UUID generation (v4 for primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Query performance monitoring
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Trigram matching for fuzzy email/org search (future admin panel)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

**Acceptance Criteria**:
- [ ] All four extensions are enabled in the first migration.
- [ ] `pg_stat_statements` is confirmed active via `SELECT * FROM pg_stat_statements LIMIT 1`.

---

## 3. Complete SQL Schema

### FR-DB-010: Enum Types

**Priority**: P0

All enum types are defined before any table creation. Enums enforce data integrity at the database level and prevent invalid values from entering the system regardless of application-layer validation failures.

```sql
CREATE TYPE form_type AS ENUM (
  'demo_request',
  'contact',
  'quote_request',
  'newsletter_signup',
  'sample_binder_download',
  'roi_calculator_result'
);

CREATE TYPE lead_status AS ENUM (
  'new',
  'contacted',
  'qualified',
  'disqualified',
  'converted'
);

CREATE TYPE organization_segment AS ENUM (
  'k12',
  'higher_education',
  'churches_missions',
  'corporate',
  'sports',
  'other'
);

CREATE TYPE submission_source AS ENUM (
  'organic',
  'paid_search',
  'paid_social',
  'referral',
  'direct',
  'email',
  'partner'
);

CREATE TYPE crm_sync_status AS ENUM (
  'pending',
  'synced',
  'failed',
  'skipped'
);
```

**Acceptance Criteria**:
- [ ] All five enum types exist in the `public` schema.
- [ ] Attempting to insert a value not in the enum returns a constraint violation error.

---

### FR-DB-011: `form_submissions` Table (Unified JSONB)

**Priority**: P0

This is the primary table for all lead capture. A single unified table with a `form_type` discriminator and a `details` JSONB column avoids table proliferation while maintaining type safety at the application layer via Zod schemas.

```sql
CREATE TABLE form_submissions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_type           form_type NOT NULL,
  status              lead_status NOT NULL DEFAULT 'new',

  -- Contact information (common across all form types)
  email               TEXT NOT NULL,
  first_name          TEXT,
  last_name           TEXT,
  phone               TEXT,
  organization        TEXT,
  job_title           TEXT,
  segment             organization_segment,

  -- Form-specific details stored as JSONB
  -- Demo request:    { trips_per_year, group_size, trip_types[], timeline, preferred_format }
  -- Quote request:   { trip_type, destination, group_size, departure_date, special_requirements }
  -- Contact:         { subject, message }
  -- Sample binder:   { binder_type }
  -- ROI calculator:  { trips_per_year, avg_group_size, current_method, calculated_savings }
  -- Newsletter:      { interests[] }
  details             JSONB NOT NULL DEFAULT '{}',

  -- Tracking and attribution
  source              submission_source DEFAULT 'direct',
  utm_source          TEXT,
  utm_medium          TEXT,
  utm_campaign        TEXT,
  utm_content         TEXT,
  utm_term            TEXT,
  referrer            TEXT,
  landing_page        TEXT,
  ip_hash             TEXT,           -- SHA-256 of IP; raw IP is NEVER stored
  user_agent          TEXT,
  country_code        TEXT,           -- Derived from request geo headers

  -- Anti-spam audit trail
  turnstile_token     TEXT,           -- Stored temporarily for audit; purged after 7 days
  honeypot_triggered  BOOLEAN NOT NULL DEFAULT FALSE,

  -- CRM sync state (denormalized for fast dashboard queries)
  crm_sync_status     crm_sync_status NOT NULL DEFAULT 'pending',
  crm_contact_id      TEXT,           -- HubSpot contact ID after successful sync
  crm_synced_at       TIMESTAMPTZ,
  crm_sync_error      TEXT,

  -- Audit timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT chk_details_is_object CHECK (jsonb_typeof(details) = 'object')
);

COMMENT ON TABLE form_submissions IS 'Unified table for all marketing form submissions. The form_type column discriminates the schema of the details JSONB column. Application-layer Zod schemas enforce type safety per form_type.';
COMMENT ON COLUMN form_submissions.ip_hash IS 'SHA-256 hash of the submitter IP address. Raw IPs are never stored. Used for rate limiting and geographic analytics.';
COMMENT ON COLUMN form_submissions.details IS 'Form-specific payload. Schema varies by form_type. Validated at the application layer via Zod before insertion.';
```

**Acceptance Criteria**:
- [ ] Table exists with all columns, types, defaults, and constraints as specified.
- [ ] Inserting a row with an invalid email format is rejected by `chk_email_format`.
- [ ] Inserting a row with `details` set to a JSON array (not object) is rejected by `chk_details_is_object`.
- [ ] `created_at` and `updated_at` default to `NOW()` on insert.
- [ ] `status` defaults to `'new'` on insert.
- [ ] `honeypot_triggered` defaults to `FALSE`.

---

### FR-DB-012: `newsletter_subscribers` Table (Double Opt-In)

**Priority**: P0

Implements CAN-SPAM and GDPR compliant double opt-in. A subscriber is not considered active until `confirmed = TRUE`. The `confirmation_token` is a one-time-use token sent via email.

```sql
CREATE TABLE newsletter_subscribers (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email                 TEXT NOT NULL UNIQUE,
  first_name            TEXT,
  segment               organization_segment,
  source                submission_source DEFAULT 'direct',

  -- Double opt-in workflow
  confirmed             BOOLEAN NOT NULL DEFAULT FALSE,
  confirmation_token    TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  confirmation_sent_at  TIMESTAMPTZ,
  confirmed_at          TIMESTAMPTZ,

  -- SendGrid integration
  sendgrid_contact_id   TEXT,
  sendgrid_list_ids     TEXT[],        -- Array of SendGrid list IDs for segmented sends

  -- Unsubscribe
  unsubscribed          BOOLEAN NOT NULL DEFAULT FALSE,
  unsubscribed_at       TIMESTAMPTZ,
  unsubscribe_reason    TEXT,

  -- Tracking
  utm_source            TEXT,
  utm_campaign          TEXT,
  ip_hash               TEXT,

  -- Audit timestamps
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT chk_subscriber_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT chk_confirmed_has_timestamp CHECK (
    (confirmed = FALSE) OR (confirmed = TRUE AND confirmed_at IS NOT NULL)
  ),
  CONSTRAINT chk_unsubscribed_has_timestamp CHECK (
    (unsubscribed = FALSE) OR (unsubscribed = TRUE AND unsubscribed_at IS NOT NULL)
  )
);

COMMENT ON TABLE newsletter_subscribers IS 'Newsletter subscription management with double opt-in. Subscribers are inactive until confirmed = TRUE. GDPR: retained until unsubscribe + 30 days, then hard-deleted.';
```

**Acceptance Criteria**:
- [ ] `email` has a UNIQUE constraint; duplicate inserts are rejected.
- [ ] `confirmation_token` is auto-generated as a 32-byte hex string on insert.
- [ ] Setting `confirmed = TRUE` without `confirmed_at` is rejected by constraint.
- [ ] Setting `unsubscribed = TRUE` without `unsubscribed_at` is rejected by constraint.

---

### FR-DB-013: `analytics_events` Table

**Priority**: P0

Custom conversion events that supplement Plausible Analytics. Plausible handles page views and basic events; this table captures structured conversion data (CTA clicks, scroll depth, pricing interactions) that Plausible does not store in queryable form.

```sql
CREATE TABLE analytics_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name      TEXT NOT NULL,        -- 'cta_click', 'pricing_view', 'scroll_depth', 'form_start', etc.
  event_category  TEXT,                 -- 'conversion', 'engagement', 'navigation'
  event_data      JSONB DEFAULT '{}',   -- Flexible event payload

  -- Page context
  page_path       TEXT NOT NULL,
  page_title      TEXT,
  referrer        TEXT,

  -- Session context (anonymous -- no cookies, no fingerprinting)
  session_id      TEXT,                 -- Anonymous session identifier (generated client-side, not a cookie)
  ip_hash         TEXT,                 -- SHA-256 of IP
  country_code    TEXT,
  device_type     TEXT,                 -- 'desktop', 'mobile', 'tablet'
  browser         TEXT,

  -- Timestamp
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT chk_event_name_not_empty CHECK (length(trim(event_name)) > 0),
  CONSTRAINT chk_page_path_not_empty CHECK (length(trim(page_path)) > 0)
);

COMMENT ON TABLE analytics_events IS 'Custom conversion and engagement events. Supplementary to Plausible Analytics. Retention: 90 days, auto-purged by scheduled function.';
```

**Acceptance Criteria**:
- [ ] Table accepts high-volume inserts (target: 100 events/minute sustained without degradation).
- [ ] `event_name` and `page_path` cannot be empty strings.
- [ ] No `updated_at` column -- events are immutable (append-only).

---

### FR-DB-014: `rate_limits` Table

**Priority**: P0

Dedicated rate-limiting table that decouples rate limit tracking from `form_submissions`. This allows rate limit checks without scanning the submissions table, supports the global per-IP rate limit that spans all form types, and enables 24-hour automatic cleanup without affecting form data.

```sql
CREATE TABLE rate_limits (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_hash         TEXT NOT NULL,
  action_type     TEXT NOT NULL,        -- 'demo_request', 'contact', 'newsletter_signup', 'analytics_event', 'global'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE rate_limits IS 'Sliding-window rate limit tracking. Each row represents one counted action. Rows older than 24 hours are automatically purged by the cleanup function. This table is intentionally denormalized for write speed.';
```

**Rate Limit Thresholds** (enforced by the `check_rate_limit` function in FR-DB-031):

| Action Type | Max Requests | Window | Rationale |
|---|---|---|---|
| `demo_request` | 5 | 1 hour | High-value form; low legitimate volume |
| `quote_request` | 5 | 1 hour | Same as demo |
| `contact` | 10 | 1 hour | Slightly more permissive |
| `newsletter_signup` | 3 | 1 hour | Single email per person |
| `analytics_event` | 100 | 1 minute | Higher volume, still bounded |
| `global` | 50 | 5 minutes | Catch-all across all action types |

**Acceptance Criteria**:
- [ ] Table supports high-throughput inserts (one row per rate-limited action).
- [ ] Rows older than 24 hours are automatically deleted by the scheduled cleanup function (FR-DB-041).
- [ ] The table has no foreign key constraints (intentional -- speed over referential integrity for ephemeral rate limit data).

---

### FR-DB-015: `ab_test_assignments` Table

**Priority**: P1 (not required for launch; required before A/B testing begins)

Stores visitor-to-variant assignments for server-side A/B tests. Assignment is sticky per `session_id` and `test_name` to ensure consistent experience.

```sql
CREATE TABLE ab_test_assignments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_name         TEXT NOT NULL,
  variant           TEXT NOT NULL,          -- 'control', 'variant_a', 'variant_b'
  session_id        TEXT NOT NULL,
  converted         BOOLEAN NOT NULL DEFAULT FALSE,
  conversion_event  TEXT,                   -- The event_name from analytics_events that constitutes conversion
  converted_at      TIMESTAMPTZ,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate assignments
  CONSTRAINT uq_ab_test_session UNIQUE (test_name, session_id),
  CONSTRAINT chk_converted_has_timestamp CHECK (
    (converted = FALSE) OR (converted = TRUE AND converted_at IS NOT NULL)
  )
);

COMMENT ON TABLE ab_test_assignments IS 'A/B test variant assignments. Retention: 90 days after test completion. The UNIQUE constraint on (test_name, session_id) ensures sticky assignments.';
```

**Acceptance Criteria**:
- [ ] A visitor assigned to `variant_a` for `hero_headline_test` always gets `variant_a` on subsequent requests (sticky assignment via UNIQUE constraint and `ON CONFLICT DO NOTHING` insert pattern).
- [ ] Conversion is recorded by updating `converted = TRUE` and `converted_at = NOW()`.
- [ ] Rows are retained for 90 days post-test completion, then purged.

---

### FR-DB-016: `crm_sync_queue` Table

**Priority**: P0 (table created at launch; CRM integration activated when HubSpot is provisioned)

Queue table for asynchronous CRM synchronization. Every qualifying form submission triggers an automatic queue entry (via trigger in FR-DB-022). A Supabase Edge Function cron job processes the queue with exponential backoff retry.

```sql
CREATE TABLE crm_sync_queue (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id   UUID NOT NULL REFERENCES form_submissions(id) ON DELETE CASCADE,
  payload         JSONB NOT NULL,
  status          crm_sync_status NOT NULL DEFAULT 'pending',
  attempts        INT NOT NULL DEFAULT 0,
  max_attempts    INT NOT NULL DEFAULT 5,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_error      TEXT,
  completed_at    TIMESTAMPTZ,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT chk_attempts_not_negative CHECK (attempts >= 0),
  CONSTRAINT chk_max_attempts_positive CHECK (max_attempts > 0)
);

COMMENT ON TABLE crm_sync_queue IS 'Async CRM sync queue with exponential backoff retry. Entries are created automatically by the queue_crm_sync trigger on form_submissions. Processed by a Supabase Edge Function cron job every 5 minutes.';
COMMENT ON COLUMN crm_sync_queue.next_attempt_at IS 'Exponential backoff schedule: 0m, 5m, 30m, 2h, 12h after each failure.';
```

**Acceptance Criteria**:
- [ ] `submission_id` references `form_submissions(id)` with `ON DELETE CASCADE`.
- [ ] Inserting a form submission of type `demo_request`, `quote_request`, or `contact` automatically creates a corresponding `crm_sync_queue` entry (via trigger FR-DB-022).
- [ ] The Edge Function cron job picks up rows where `status = 'pending'` and `next_attempt_at <= NOW()` and `attempts < max_attempts`.

---

## 4. Indexes

### FR-DB-020: Index Strategy

**Priority**: P0

All indexes are justified by documented query patterns. No speculative indexes. Indexes are created in the same migration as their parent table.

#### `form_submissions` Indexes

```sql
-- Primary query: filter by form type for dashboard views
CREATE INDEX idx_form_submissions_type
  ON form_submissions (form_type);

-- Lead status filtering for pipeline management
CREATE INDEX idx_form_submissions_status
  ON form_submissions (status);

-- Email lookup for GDPR erasure, deduplication, and CRM matching
CREATE INDEX idx_form_submissions_email
  ON form_submissions (email);

-- Segment filtering for segment-specific reporting
CREATE INDEX idx_form_submissions_segment
  ON form_submissions (segment);

-- Chronological listing (most recent first)
CREATE INDEX idx_form_submissions_created
  ON form_submissions (created_at DESC);

-- CRM sync: find pending items efficiently (partial index)
CREATE INDEX idx_form_submissions_crm_pending
  ON form_submissions (crm_sync_status)
  WHERE crm_sync_status = 'pending';

-- Composite index for rate limiting queries (ip_hash + form_type + time window)
CREATE INDEX idx_form_submissions_rate_limit
  ON form_submissions (ip_hash, form_type, created_at DESC);
```

#### `newsletter_subscribers` Indexes

```sql
-- Email is already UNIQUE (implicit index), but add for explicit documentation
-- The UNIQUE constraint on email creates an implicit B-tree index.

-- Active subscriber lookup (confirmed, not unsubscribed)
CREATE INDEX idx_newsletter_active
  ON newsletter_subscribers (confirmed, unsubscribed)
  WHERE confirmed = TRUE AND unsubscribed = FALSE;

-- Confirmation token lookup for double opt-in verification
CREATE INDEX idx_newsletter_confirmation_token
  ON newsletter_subscribers (confirmation_token)
  WHERE confirmation_token IS NOT NULL AND confirmed = FALSE;
```

#### `analytics_events` Indexes

```sql
-- Event type filtering for conversion analysis
CREATE INDEX idx_events_name
  ON analytics_events (event_name);

-- Chronological queries and retention cleanup
CREATE INDEX idx_events_created
  ON analytics_events (created_at DESC);

-- Page-level event analysis
CREATE INDEX idx_events_page
  ON analytics_events (page_path);

-- Session reconstruction
CREATE INDEX idx_events_session
  ON analytics_events (session_id)
  WHERE session_id IS NOT NULL;
```

#### `rate_limits` Indexes

```sql
-- Primary query pattern: count actions for an IP within a time window
CREATE INDEX idx_rate_limits_lookup
  ON rate_limits (ip_hash, action_type, created_at DESC);

-- Cleanup: delete rows older than 24 hours
CREATE INDEX idx_rate_limits_cleanup
  ON rate_limits (created_at);
```

#### `ab_test_assignments` Indexes

```sql
-- Test analysis: group by test + variant for conversion rate calculation
CREATE INDEX idx_ab_test_analysis
  ON ab_test_assignments (test_name, variant);
-- Note: (test_name, session_id) already has a UNIQUE index from the constraint.
```

#### `crm_sync_queue` Indexes

```sql
-- Cron job picks up pending items ready for processing
CREATE INDEX idx_crm_queue_pending
  ON crm_sync_queue (next_attempt_at)
  WHERE status = 'pending' AND attempts < max_attempts;
```

**Acceptance Criteria**:
- [ ] All indexes listed above exist after the initial migration.
- [ ] No table has more than 7 indexes (guard against over-indexing).
- [ ] Partial indexes use WHERE clauses to minimize index size.
- [ ] After 30 days of production traffic, run `pg_stat_user_indexes` to verify all indexes have non-zero `idx_scan` counts. Drop any unused indexes.

---

## 5. Row Level Security

### FR-DB-021: RLS Policies (Service-Role Only, No Anon Access)

**Priority**: P0 -- must be applied before any data is inserted

The marketing site has no user authentication. All database access is server-side via the `service_role` key. RLS is enabled on every table with a single policy that grants full access to `service_role` only. The `anon` role has zero access to any table.

This is a defense-in-depth measure: even if the `anon` key leaks (e.g., accidentally included in a client-side bundle), no data is exposed.

```sql
-- Enable RLS on every table
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_sync_queue ENABLE ROW LEVEL SECURITY;

-- Grant full access to service_role only
-- Policy name must be unique per table
CREATE POLICY "service_role_all" ON form_submissions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all" ON newsletter_subscribers
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all" ON analytics_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all" ON rate_limits
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all" ON ab_test_assignments
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all" ON crm_sync_queue
  FOR ALL USING (auth.role() = 'service_role');
```

**Verification Query** (run after migration):

```sql
-- Confirm RLS is enabled on all tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'form_submissions', 'newsletter_subscribers', 'analytics_events',
    'rate_limits', 'ab_test_assignments', 'crm_sync_queue'
  );
-- All rows must show rowsecurity = true
```

**Acceptance Criteria**:
- [ ] RLS is enabled on all six tables.
- [ ] Querying any table with the `anon` key returns zero rows.
- [ ] Querying any table with the `service_role` key returns all rows.
- [ ] No policy exists that grants access to `authenticated`, `anon`, or any other role.

---

## 6. Triggers

### FR-DB-022: Auto-Queue CRM Sync on Form Submission Insert

**Priority**: P0

When a new form submission of type `demo_request`, `quote_request`, or `contact` is inserted, automatically create a corresponding entry in `crm_sync_queue`. Newsletter signups, sample binder downloads, and ROI calculator results do not trigger CRM sync (they sync via SendGrid list management instead).

```sql
CREATE OR REPLACE FUNCTION queue_crm_sync()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.form_type IN ('demo_request', 'quote_request', 'contact') THEN
    INSERT INTO crm_sync_queue (submission_id, payload)
    VALUES (
      NEW.id,
      jsonb_build_object(
        'email', NEW.email,
        'first_name', NEW.first_name,
        'last_name', NEW.last_name,
        'phone', NEW.phone,
        'organization', NEW.organization,
        'job_title', NEW.job_title,
        'segment', NEW.segment::TEXT,
        'form_type', NEW.form_type::TEXT,
        'details', NEW.details,
        'source', NEW.source::TEXT,
        'utm_source', NEW.utm_source,
        'utm_medium', NEW.utm_medium,
        'utm_campaign', NEW.utm_campaign,
        'landing_page', NEW.landing_page,
        'country_code', NEW.country_code,
        'submitted_at', NEW.created_at
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_crm_sync
  AFTER INSERT ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION queue_crm_sync();
```

**Acceptance Criteria**:
- [ ] Inserting a `demo_request` row into `form_submissions` creates exactly one row in `crm_sync_queue` within the same transaction.
- [ ] Inserting a `newsletter_signup` row does NOT create a `crm_sync_queue` entry.
- [ ] The `payload` JSONB in the queue entry contains all fields listed in the function.
- [ ] The trigger does not block or slow down the original INSERT (AFTER trigger, not BEFORE).

---

### FR-DB-023: Auto-Update `updated_at` Timestamp

**Priority**: P0

Every table with an `updated_at` column automatically sets it to `NOW()` on any UPDATE operation.

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER set_updated_at_form_submissions
  BEFORE UPDATE ON form_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_newsletter_subscribers
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_crm_sync_queue
  BEFORE UPDATE ON crm_sync_queue
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

**Acceptance Criteria**:
- [ ] Updating any column on `form_submissions` causes `updated_at` to change to the current timestamp.
- [ ] Same behavior on `newsletter_subscribers` and `crm_sync_queue`.
- [ ] `analytics_events`, `rate_limits`, and `ab_test_assignments` do NOT have this trigger (they are append-only / immutable).

---

## 7. Database Functions

### FR-DB-031: Rate Limit Check Function

**Priority**: P0

A server-side function that checks whether an IP has exceeded the rate limit for a given action type within the configured time window. This function is called from Next.js Route Handlers before processing any form submission or analytics event.

```sql
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_ip_hash TEXT,
  p_action_type TEXT,
  p_max_requests INT,
  p_window_seconds INT
)
RETURNS TABLE (
  is_limited BOOLEAN,
  current_count BIGINT,
  retry_after_seconds INT
) AS $$
DECLARE
  v_window_start TIMESTAMPTZ;
  v_count BIGINT;
  v_oldest_in_window TIMESTAMPTZ;
BEGIN
  v_window_start := NOW() - (p_window_seconds || ' seconds')::INTERVAL;

  -- Count requests in the current window
  SELECT COUNT(*), MIN(created_at)
  INTO v_count, v_oldest_in_window
  FROM rate_limits
  WHERE ip_hash = p_ip_hash
    AND action_type = p_action_type
    AND created_at >= v_window_start;

  IF v_count >= p_max_requests THEN
    -- Calculate seconds until the oldest request in the window expires
    RETURN QUERY SELECT
      TRUE,
      v_count,
      GREATEST(1, EXTRACT(EPOCH FROM (v_oldest_in_window + (p_window_seconds || ' seconds')::INTERVAL - NOW()))::INT);
  ELSE
    -- Not limited; record this action
    INSERT INTO rate_limits (ip_hash, action_type) VALUES (p_ip_hash, p_action_type);
    RETURN QUERY SELECT FALSE, v_count + 1, 0;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Usage from Next.js**:

```typescript
const { data, error } = await supabase.rpc('check_rate_limit', {
  p_ip_hash: ipHash,
  p_action_type: 'demo_request',
  p_max_requests: 5,
  p_window_seconds: 3600 // 1 hour
});

if (data?.[0]?.is_limited) {
  return new Response('Too many requests', {
    status: 429,
    headers: { 'Retry-After': String(data[0].retry_after_seconds) }
  });
}
```

**Acceptance Criteria**:
- [ ] Calling `check_rate_limit('abc123', 'demo_request', 5, 3600)` six times within one hour returns `is_limited = FALSE` for calls 1-5 and `is_limited = TRUE` for call 6.
- [ ] When rate-limited, `retry_after_seconds` returns a positive integer indicating when the oldest request expires from the window.
- [ ] When not rate-limited, the function atomically records the action in `rate_limits` (no separate INSERT needed).
- [ ] Function executes in under 5 ms under normal load.

---

### FR-DB-032: Form Submission Handler Function

**Priority**: P1

A server-side function that encapsulates the full form submission workflow: validate input, check rate limit, insert submission, and return the result. This reduces round-trips between the application and database from 3 (rate check + insert + queue check) to 1.

```sql
CREATE OR REPLACE FUNCTION handle_form_submission(
  p_form_type form_type,
  p_email TEXT,
  p_first_name TEXT DEFAULT NULL,
  p_last_name TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_organization TEXT DEFAULT NULL,
  p_job_title TEXT DEFAULT NULL,
  p_segment organization_segment DEFAULT NULL,
  p_details JSONB DEFAULT '{}',
  p_source submission_source DEFAULT 'direct',
  p_utm_source TEXT DEFAULT NULL,
  p_utm_medium TEXT DEFAULT NULL,
  p_utm_campaign TEXT DEFAULT NULL,
  p_utm_content TEXT DEFAULT NULL,
  p_utm_term TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL,
  p_landing_page TEXT DEFAULT NULL,
  p_ip_hash TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_country_code TEXT DEFAULT NULL,
  p_turnstile_token TEXT DEFAULT NULL,
  p_honeypot_triggered BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
  success BOOLEAN,
  submission_id UUID,
  error_code TEXT,
  error_message TEXT
) AS $$
DECLARE
  v_rate_limited BOOLEAN;
  v_rate_count BIGINT;
  v_retry_after INT;
  v_max_requests INT;
  v_window_seconds INT;
  v_new_id UUID;
BEGIN
  -- Determine rate limit thresholds based on form type
  CASE p_form_type
    WHEN 'demo_request' THEN v_max_requests := 5; v_window_seconds := 3600;
    WHEN 'quote_request' THEN v_max_requests := 5; v_window_seconds := 3600;
    WHEN 'contact' THEN v_max_requests := 10; v_window_seconds := 3600;
    WHEN 'newsletter_signup' THEN v_max_requests := 3; v_window_seconds := 3600;
    WHEN 'sample_binder_download' THEN v_max_requests := 10; v_window_seconds := 3600;
    WHEN 'roi_calculator_result' THEN v_max_requests := 10; v_window_seconds := 3600;
  END CASE;

  -- Check rate limit
  IF p_ip_hash IS NOT NULL THEN
    SELECT rl.is_limited, rl.current_count, rl.retry_after_seconds
    INTO v_rate_limited, v_rate_count, v_retry_after
    FROM check_rate_limit(p_ip_hash, p_form_type::TEXT, v_max_requests, v_window_seconds) rl;

    IF v_rate_limited THEN
      RETURN QUERY SELECT FALSE, NULL::UUID, 'RATE_LIMITED', format('Rate limit exceeded. Retry after %s seconds.', v_retry_after);
      RETURN;
    END IF;
  END IF;

  -- Reject honeypot triggers silently (return success to fool bots)
  IF p_honeypot_triggered THEN
    RETURN QUERY SELECT TRUE, uuid_generate_v4(), NULL::TEXT, NULL::TEXT;
    RETURN;
  END IF;

  -- Insert the form submission
  INSERT INTO form_submissions (
    form_type, email, first_name, last_name, phone, organization,
    job_title, segment, details, source, utm_source, utm_medium,
    utm_campaign, utm_content, utm_term, referrer, landing_page,
    ip_hash, user_agent, country_code, turnstile_token, honeypot_triggered
  ) VALUES (
    p_form_type, p_email, p_first_name, p_last_name, p_phone, p_organization,
    p_job_title, p_segment, p_details, p_source, p_utm_source, p_utm_medium,
    p_utm_campaign, p_utm_content, p_utm_term, p_referrer, p_landing_page,
    p_ip_hash, p_user_agent, p_country_code, p_turnstile_token, p_honeypot_triggered
  )
  RETURNING id INTO v_new_id;

  -- Note: CRM queue entry is created automatically by the trigger_crm_sync trigger.

  RETURN QUERY SELECT TRUE, v_new_id, NULL::TEXT, NULL::TEXT;

EXCEPTION
  WHEN check_violation THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 'VALIDATION_ERROR', SQLERRM;
  WHEN unique_violation THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 'DUPLICATE_ENTRY', SQLERRM;
  WHEN OTHERS THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 'INTERNAL_ERROR', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Acceptance Criteria**:
- [ ] A single RPC call `supabase.rpc('handle_form_submission', {...})` performs rate limiting, insertion, and CRM queue creation in one database round-trip.
- [ ] Honeypot-triggered submissions return `success = TRUE` with a fake UUID (bots receive no signal that they were detected).
- [ ] Rate-limited requests return `success = FALSE` with `error_code = 'RATE_LIMITED'`.
- [ ] Invalid email format returns `error_code = 'VALIDATION_ERROR'`.
- [ ] Function executes in under 20 ms under normal load.

---

## 8. Data Retention Policies

### FR-DB-040: Retention Schedule

**Priority**: P0

| Data Type | Retention Period | Purge Method | Rationale |
|---|---|---|---|
| `form_submissions` | 3 years | Manual archive (future) | Sales pipeline tracking; legal compliance |
| `newsletter_subscribers` | Until unsubscribe + 30 days | GDPR erasure function | CAN-SPAM / GDPR right to erasure |
| `analytics_events` | 90 days | Automated daily purge | Sufficient for conversion analysis; Plausible retains long-term trends |
| `rate_limits` | 24 hours | Automated hourly purge | Ephemeral data; only needed for active rate limiting |
| `ab_test_assignments` | 90 days after test end | Manual purge per test | No longer needed after statistical analysis |
| `crm_sync_queue` (completed) | 90 days after completion | Automated weekly purge | Audit trail for failed syncs |
| `turnstile_token` column | 7 days | Automated daily NULL-out | Short-term audit; not needed long-term |

---

### FR-DB-041: Automated Retention Cleanup Functions

**Priority**: P0

```sql
-- Purge rate_limits older than 24 hours
-- Schedule: every hour via pg_cron or Supabase Edge Function cron
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS BIGINT AS $$
DECLARE
  v_deleted BIGINT;
BEGIN
  DELETE FROM rate_limits
  WHERE created_at < NOW() - INTERVAL '24 hours';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Purge analytics_events older than 90 days
-- Schedule: daily at 03:00 UTC via Supabase Edge Function cron
CREATE OR REPLACE FUNCTION cleanup_analytics_events()
RETURNS BIGINT AS $$
DECLARE
  v_deleted BIGINT;
BEGIN
  DELETE FROM analytics_events
  WHERE created_at < NOW() - INTERVAL '90 days';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Purge completed CRM sync queue entries older than 90 days
-- Schedule: weekly on Sunday at 04:00 UTC
CREATE OR REPLACE FUNCTION cleanup_crm_sync_queue()
RETURNS BIGINT AS $$
DECLARE
  v_deleted BIGINT;
BEGIN
  DELETE FROM crm_sync_queue
  WHERE completed_at IS NOT NULL
    AND completed_at < NOW() - INTERVAL '90 days';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- NULL out turnstile tokens older than 7 days
-- Schedule: daily at 03:30 UTC
CREATE OR REPLACE FUNCTION cleanup_turnstile_tokens()
RETURNS BIGINT AS $$
DECLARE
  v_updated BIGINT;
BEGIN
  UPDATE form_submissions
  SET turnstile_token = NULL
  WHERE turnstile_token IS NOT NULL
    AND created_at < NOW() - INTERVAL '7 days';
  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Hard-delete unsubscribed newsletter entries older than 30 days
-- Schedule: daily at 03:15 UTC
CREATE OR REPLACE FUNCTION cleanup_unsubscribed_newsletters()
RETURNS BIGINT AS $$
DECLARE
  v_deleted BIGINT;
BEGIN
  DELETE FROM newsletter_subscribers
  WHERE unsubscribed = TRUE
    AND unsubscribed_at < NOW() - INTERVAL '30 days';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Cron Schedule** (implemented via Supabase Edge Function with `Deno.cron` or `pg_cron` if available):

| Function | Schedule | Expected Volume |
|---|---|---|
| `cleanup_rate_limits()` | Every hour, minute 0 | 100-5,000 rows deleted per run |
| `cleanup_analytics_events()` | Daily 03:00 UTC | 0-10,000 rows deleted per run |
| `cleanup_turnstile_tokens()` | Daily 03:30 UTC | 0-500 rows updated per run |
| `cleanup_unsubscribed_newsletters()` | Daily 03:15 UTC | 0-50 rows deleted per run |
| `cleanup_crm_sync_queue()` | Sunday 04:00 UTC | 0-200 rows deleted per run |

**Acceptance Criteria**:
- [ ] Each cleanup function returns the count of affected rows.
- [ ] `cleanup_rate_limits()` deletes all rows with `created_at` older than 24 hours.
- [ ] `cleanup_analytics_events()` deletes all rows with `created_at` older than 90 days.
- [ ] `cleanup_turnstile_tokens()` sets `turnstile_token = NULL` but does NOT delete the form submission row.
- [ ] `cleanup_unsubscribed_newsletters()` hard-deletes subscribers who unsubscribed more than 30 days ago.
- [ ] All cleanup functions are scheduled and confirmed running via Supabase Edge Function logs.

---

## 9. GDPR Right-to-Erasure Function

### FR-DB-050: GDPR Data Subject Erasure

**Priority**: P0

A single function that performs complete erasure of all data associated with an email address across all tables. This satisfies GDPR Article 17 (Right to Erasure) and CCPA Right to Delete.

```sql
CREATE OR REPLACE FUNCTION gdpr_erase_by_email(p_email TEXT)
RETURNS TABLE (
  table_name TEXT,
  rows_deleted BIGINT
) AS $$
DECLARE
  v_form_ids UUID[];
  v_deleted BIGINT;
BEGIN
  -- 1. Collect form_submission IDs for cascade reference
  SELECT ARRAY_AGG(id) INTO v_form_ids
  FROM form_submissions
  WHERE email = p_email;

  -- 2. Delete CRM sync queue entries (references form_submissions via FK CASCADE,
  --    but explicit delete for audit clarity)
  DELETE FROM crm_sync_queue
  WHERE submission_id = ANY(COALESCE(v_form_ids, ARRAY[]::UUID[]));
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN QUERY SELECT 'crm_sync_queue'::TEXT, v_deleted;

  -- 3. Delete form submissions
  DELETE FROM form_submissions WHERE email = p_email;
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN QUERY SELECT 'form_submissions'::TEXT, v_deleted;

  -- 4. Delete newsletter subscriptions
  DELETE FROM newsletter_subscribers WHERE email = p_email;
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN QUERY SELECT 'newsletter_subscribers'::TEXT, v_deleted;

  -- 5. Analytics events do not contain email, but may contain ip_hash.
  --    Since ip_hash is a one-way SHA-256, we cannot correlate events to an email
  --    without the original IP. Analytics events are retained (they are anonymous).
  --    If the data subject provides their IP for cross-reference, delete those too:
  --    (This branch is intentionally commented out; enable only if IP is provided)
  -- DELETE FROM analytics_events WHERE ip_hash = p_provided_ip_hash;

  -- 6. A/B test assignments do not contain email or PII.
  --    They use anonymous session_id only. No deletion needed.

  -- 7. Rate limits do not contain email. No deletion needed.

  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Companion function: Data export for Right to Access / Right to Portability**:

```sql
CREATE OR REPLACE FUNCTION gdpr_export_by_email(p_email TEXT)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'exported_at', NOW(),
    'email', p_email,
    'form_submissions', COALESCE((
      SELECT jsonb_agg(row_to_json(fs))
      FROM form_submissions fs
      WHERE fs.email = p_email
    ), '[]'::JSONB),
    'newsletter_subscriptions', COALESCE((
      SELECT jsonb_agg(row_to_json(ns))
      FROM newsletter_subscribers ns
      WHERE ns.email = p_email
    ), '[]'::JSONB)
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Acceptance Criteria**:
- [ ] Calling `gdpr_erase_by_email('test@example.com')` deletes all rows from `form_submissions`, `newsletter_subscribers`, and `crm_sync_queue` associated with that email.
- [ ] The function returns a table showing how many rows were deleted from each table.
- [ ] After erasure, `SELECT * FROM form_submissions WHERE email = 'test@example.com'` returns zero rows.
- [ ] After erasure, `SELECT * FROM newsletter_subscribers WHERE email = 'test@example.com'` returns zero rows.
- [ ] `gdpr_export_by_email` returns a complete JSON export before deletion is performed (the application layer calls export first, then erase).
- [ ] The erasure function completes within 5 seconds even with 1,000+ rows to delete.
- [ ] All erasure actions are logged externally (application layer logs to Sentry/observability stack) for GDPR accountability.

---

## 10. PII Handling

### FR-DB-060: IP Address Hashing (SHA-256)

**Priority**: P0

Raw IP addresses are **never stored** in any table. All IP addresses are hashed with SHA-256 before insertion. The hash is performed at the application layer (Next.js Route Handler) before the data reaches Supabase.

```typescript
// lib/security/ip-hash.ts
import { createHash } from 'crypto';

const IP_HASH_SALT = process.env.IP_HASH_SALT!; // Stored in Kubernetes Secret

export function hashIP(ip: string): string {
  return createHash('sha256')
    .update(ip + IP_HASH_SALT)
    .digest('hex');
}
```

**Requirements**:
- The `IP_HASH_SALT` is a 64-character random string stored as a Kubernetes Secret. It is never committed to source control.
- The salt ensures that the same IP produces a different hash than in other systems, preventing cross-system correlation.
- SHA-256 is a one-way function. There is no way to reverse the hash to recover the original IP.

**Acceptance Criteria**:
- [ ] No column in any table contains a raw IP address (verified by schema inspection).
- [ ] All `ip_hash` columns contain 64-character hex strings (SHA-256 output length).
- [ ] The `IP_HASH_SALT` environment variable is set in all environments (production, staging, local).
- [ ] Different salts are used in production vs. staging vs. local to prevent cross-environment correlation.

---

### FR-DB-061: Email Encryption at Rest

**Priority**: P1

While Supabase encrypts all data at rest at the volume level (AES-256), emails represent the highest-value PII in the marketing database. Column-level encryption adds defense-in-depth: even if a database backup is compromised, emails remain encrypted.

**Implementation approach**: Application-layer encryption using AES-256-GCM before insertion, with the encryption key stored in Kubernetes Secrets. This avoids dependency on `pgcrypto` for encryption (which would require the key to be sent to the database).

```typescript
// lib/security/encrypt.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ENCRYPTION_KEY = Buffer.from(process.env.EMAIL_ENCRYPTION_KEY!, 'hex'); // 32 bytes

export function encryptEmail(email: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(email, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // Format: iv:authTag:ciphertext (all base64)
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted.toString('base64')}`;
}

export function decryptEmail(encryptedEmail: string): string {
  const [ivB64, authTagB64, ciphertextB64] = encryptedEmail.split(':');
  const iv = Buffer.from(ivB64, 'base64');
  const authTag = Buffer.from(authTagB64, 'base64');
  const ciphertext = Buffer.from(ciphertextB64, 'base64');
  const decipher = createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  return decipher.update(ciphertext) + decipher.final('utf8');
}
```

**Trade-off**: Column-level encryption means email-based queries (`WHERE email = ?`) require either:
1. A separate `email_hash` column (SHA-256 of normalized lowercase email) for lookups, with the encrypted email for display/export. This is the recommended approach.
2. Decrypting all rows in application memory (unacceptable at scale).

**Recommended schema addition** (applied in a follow-up migration):

```sql
ALTER TABLE form_submissions ADD COLUMN email_hash TEXT;
ALTER TABLE newsletter_subscribers ADD COLUMN email_hash TEXT;

-- Index on email_hash for lookups
CREATE INDEX idx_form_submissions_email_hash ON form_submissions (email_hash);
CREATE INDEX idx_newsletter_email_hash ON newsletter_subscribers (email_hash);

-- Once email_hash is populated, the email column stores encrypted values.
-- The existing idx_form_submissions_email index is replaced by idx_form_submissions_email_hash.
```

**Acceptance Criteria**:
- [ ] The `email` column in `form_submissions` and `newsletter_subscribers` stores AES-256-GCM encrypted values (not plaintext) when column-level encryption is enabled.
- [ ] An `email_hash` column exists for deterministic lookups (SHA-256 of lowercase-trimmed email + salt).
- [ ] The `EMAIL_ENCRYPTION_KEY` is a 32-byte hex string stored as a Kubernetes Secret.
- [ ] Email encryption/decryption round-trips correctly for all valid email formats.
- [ ] GDPR erasure and export functions work correctly with encrypted emails (application layer decrypts before export; erasure uses `email_hash` for lookup).

**Note on phasing**: Email encryption at rest is P1. At launch (P0), emails are stored in plaintext with Supabase's volume-level AES-256 encryption providing the baseline protection. The column-level encryption migration ships within 30 days of launch.

---

## 11. Migration Strategy

### FR-DB-070: Supabase CLI Migration Workflow

**Priority**: P0

All schema changes are managed through the Supabase CLI migration system. The migration files are version-controlled in Git alongside the application code.

**Directory structure**:

```
supabase/
  config.toml                    # Supabase project configuration
  seed.sql                       # Development seed data (never runs in production)
  migrations/
    20260324000000_initial_schema.sql        # Extensions, enums, tables, indexes, RLS
    20260324000001_functions_and_triggers.sql # Functions, triggers
    20260324000002_retention_functions.sql    # Cleanup functions
    20260324000003_gdpr_functions.sql         # GDPR erasure and export
    20260401000000_email_encryption.sql       # P1: Column-level email encryption
```

**Migration workflow**:

```bash
# Create a new migration
supabase migration new add_column_to_form_submissions

# Apply migrations to local development database
supabase db reset  # Drops and recreates local DB, applies all migrations

# Apply migrations to remote (staging/production)
supabase db push   # Applies pending migrations

# Generate TypeScript types after migration
supabase gen types typescript --project-id olgjdqguafidgrutubih > src/lib/supabase/database.types.ts
```

**CI/CD integration** (GitHub Actions):

```yaml
# .github/workflows/db-migrate.yml
name: Database Migration
on:
  push:
    branches: [main]
    paths: ['supabase/migrations/**']

jobs:
  migrate-staging:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
      - run: supabase link --project-ref ${{ secrets.SUPABASE_STAGING_PROJECT_ID }}
      - run: supabase db push
      - run: supabase gen types typescript --project-id ${{ secrets.SUPABASE_STAGING_PROJECT_ID }} > /tmp/types.ts
      - name: Verify types compile
        run: npx tsc --noEmit /tmp/types.ts

  migrate-production:
    needs: migrate-staging
    runs-on: ubuntu-latest
    environment: production  # Requires manual approval
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
      - run: supabase link --project-ref ${{ secrets.SUPABASE_PROD_PROJECT_ID }}
      - run: supabase db push
```

**Acceptance Criteria**:
- [ ] All schema changes exist as numbered migration files in `supabase/migrations/`.
- [ ] `supabase db reset` on a local instance produces an identical schema to production.
- [ ] Migrations are applied to staging first, then production (with manual approval gate).
- [ ] No migration uses `DROP TABLE` or `DROP COLUMN` without a corresponding data migration plan.
- [ ] Every migration is idempotent where possible (using `IF NOT EXISTS`, `CREATE OR REPLACE`).
- [ ] The migration CI job blocks production deployment if staging migration fails.

---

## 12. TypeScript Type Generation

### FR-DB-071: Automated Type Generation

**Priority**: P0

TypeScript types are generated from the live database schema using `supabase gen types`. This ensures type safety between the database schema and Next.js application code. Types are regenerated on every migration and committed to the repository.

**Generated file**: `src/lib/supabase/database.types.ts`

**Usage**:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: 'public' },
  }
);

// Fully typed insert
const { data, error } = await supabase
  .from('form_submissions')
  .insert({
    form_type: 'demo_request',     // Type-checked against form_type enum
    email: 'test@example.com',
    details: { trips_per_year: 10 },
  })
  .select()
  .single();
// data is typed as Database['public']['Tables']['form_submissions']['Row']
```

**Acceptance Criteria**:
- [ ] `src/lib/supabase/database.types.ts` exists and is committed to the repository.
- [ ] The file is regenerated by CI on every migration merge and included in the same commit.
- [ ] All Supabase client operations in the codebase use the `Database` generic type parameter.
- [ ] TypeScript compilation fails if application code references a column that does not exist in the generated types.
- [ ] Enum types from the database (`form_type`, `lead_status`, etc.) are available as TypeScript string union types.

---

## 13. Connection Pooling

### FR-DB-080: Supavisor Connection Pooling for DOKS Pods

**Priority**: P0

Kubernetes pods running the Next.js application create database connections on every request (since Next.js Route Handlers are stateless). Without connection pooling, a traffic spike (back-to-school season, conference mention, viral social post) can exhaust the Supabase Pro plan's 60 direct connections.

**Configuration**:

| Setting | Value | Rationale |
|---|---|---|
| Pool Mode | Transaction | Best for stateless serverless/container workloads |
| Pooler URL | `postgres://[user].[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres` | Supavisor pooler endpoint (port 6543, not 5432) |
| Max Connections (Supavisor) | 200 (Supabase Pro default) | Handles concurrent pod connections |
| Max Connections (Postgres) | 60 (Supabase Pro) | Underlying database limit |

**Application-side configuration**:

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// IMPORTANT: Use the pooler URL (port 6543), not the direct URL (port 5432)
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,      // Server-side only; no session persistence
    autoRefreshToken: false,    // No auth refresh needed
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-connection-pool': 'transaction', // Hint for Supavisor
    },
  },
});
```

**DOKS-specific considerations**:

- Horizontal Pod Autoscaler (HPA) may scale pods from 2 to 10 during traffic spikes. Each pod may hold 5-10 concurrent connections. Supavisor's 200-connection pool handles this without exhaustion.
- Connection timeout set to 5 seconds at the application layer. If Supavisor cannot allocate a connection within 5 seconds, the request returns 503 (Service Unavailable) with a retry hint.
- No persistent connections. Each Route Handler invocation creates a new Supabase client, makes its queries, and the connection returns to the pool.

**Acceptance Criteria**:
- [ ] The application uses the Supavisor pooler URL (port 6543), not the direct connection URL (port 5432).
- [ ] Under a load test simulating 50 concurrent requests across 5 pods, no "too many connections" errors occur.
- [ ] Connection pool utilization is monitored via Supabase Dashboard (target: peak utilization under 80% of the 200-connection Supavisor limit).
- [ ] The Supabase client is configured with `persistSession: false` and `autoRefreshToken: false`.

---

## 14. Backup and Recovery

### FR-DB-090: Multi-Layer Backup Strategy

**Priority**: P0 (Layers 1-2 at launch), P1 (Layers 3-4 within 30 days)

Form submissions represent potential revenue (demo requests, quotes). Data loss is unacceptable.

**Layer 1: Supabase Point-in-Time Recovery (PITR)** -- P0

| Property | Value |
|---|---|
| Included in Plan | Pro ($25/month) |
| Mechanism | Continuous WAL archiving to S3 |
| Recovery Window | Last 7 days |
| RPO | Seconds (WAL-based) |
| RTO | < 5 minutes |
| Use Case | Accidental row deletion, table corruption |

**Layer 2: Supabase Daily Backups** -- P0

| Property | Value |
|---|---|
| Mechanism | Automatic daily snapshots |
| Retention | 7 days (Pro plan) |
| Recovery | Downloadable from Supabase Dashboard |
| Use Case | Full database restore |

**Layer 3: Weekly pg_dump Export** -- P1

A Supabase Edge Function runs weekly to export critical tables and upload the encrypted dump to external storage (DigitalOcean Spaces or S3-compatible bucket).

```bash
# Conceptual -- implemented as a Supabase Edge Function
pg_dump --format=custom \
  --table=form_submissions \
  --table=newsletter_subscribers \
  --table=crm_sync_queue \
  $DATABASE_URL \
  | gpg --encrypt --recipient backup@safetrekr.com \
  > safetrekr-marketing-$(date +%Y%m%d).dump.gpg
```

| Property | Value |
|---|---|
| Schedule | Sunday 02:00 UTC |
| Tables Exported | `form_submissions`, `newsletter_subscribers`, `crm_sync_queue` |
| Encryption | GPG with team key |
| Storage | DigitalOcean Spaces (S3-compatible) |
| Retention | 90 days |
| Use Case | Defense against Supabase region outage |

**Layer 4: Real-Time Email Copy** -- P0

Every form submission sends a notification email via SendGrid. The email serves as a secondary record of the submission. SendGrid retains message history for 30 days.

**Recovery Time Objectives**:

| Scenario | RTO | RPO | Method |
|---|---|---|---|
| Accidental row deletion | < 5 minutes | Seconds | PITR restore |
| Table corruption | < 30 minutes | Seconds | PITR restore |
| Full database loss | < 2 hours | < 24 hours | Daily backup restore |
| Supabase region outage | < 4 hours | < 7 days | pg_dump + schema migration to new project |

**Acceptance Criteria**:
- [ ] PITR is confirmed enabled on the Supabase project (visible in Dashboard > Settings > Database > Backups).
- [ ] A PITR restore test is performed within 30 days of launch: delete a test row, restore via PITR, confirm row is recovered.
- [ ] Weekly pg_dump Edge Function is deployed and confirmed running (verified in Edge Function logs).
- [ ] Encrypted backups are confirmed present in DigitalOcean Spaces.
- [ ] A full restore from pg_dump is tested on a separate Supabase project within 30 days of the weekly export going live.

---

## 15. Monitoring and Observability

### FR-DB-100: Database Monitoring Stack

**Priority**: P0

**Supabase Dashboard Monitoring** (built-in, no configuration):

| Metric | Location | Alert Threshold |
|---|---|---|
| Active connections | Dashboard > Database | > 48 (80% of 60 max) |
| Database size | Dashboard > Database | > 6.4 GB (80% of 8 GB Pro limit) |
| API request count | Dashboard > API | Baseline + 3 standard deviations |
| API error rate | Dashboard > API | > 1% of requests |
| Edge Function invocations | Dashboard > Edge Functions | Failure rate > 5% |
| Disk I/O utilization | Dashboard > Reports | > 80% sustained |

**pg_stat_statements Monitoring**:

```sql
-- Top 10 slowest queries (by mean execution time)
SELECT
  query,
  calls,
  mean_exec_time::NUMERIC(10,2) AS mean_ms,
  total_exec_time::NUMERIC(10,2) AS total_ms,
  rows
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Queries with highest total execution time (impact on system)
SELECT
  query,
  calls,
  total_exec_time::NUMERIC(10,2) AS total_ms,
  mean_exec_time::NUMERIC(10,2) AS mean_ms,
  (total_exec_time / SUM(total_exec_time) OVER () * 100)::NUMERIC(5,2) AS pct_total
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

**Application-Level Monitoring** (Next.js Route Handlers):

```typescript
// Instrument every Supabase call with timing
const start = performance.now();
const { data, error } = await supabase.from('form_submissions').insert({...});
const duration = performance.now() - start;

// Log to structured logging (picked up by DOKS logging stack)
console.log(JSON.stringify({
  event: 'db_query',
  table: 'form_submissions',
  operation: 'insert',
  duration_ms: duration.toFixed(2),
  success: !error,
  error: error?.message,
}));
```

**Health Check Endpoint** (`/api/health`):

```typescript
// Verify Supabase connectivity
const { error } = await supabase.from('rate_limits').select('id').limit(1);
if (error) {
  return Response.json({ status: 'unhealthy', db: 'unreachable' }, { status: 503 });
}
return Response.json({ status: 'healthy', db: 'connected' });
```

**Weekly Review Cadence**:

| Check | Frequency | Owner |
|---|---|---|
| `pg_stat_statements` slow query review | Weekly | Database Architect |
| Connection pool utilization review | Weekly | Database Architect |
| Table size and index bloat review | Monthly | Database Architect |
| Backup restore drill | Monthly | Database Architect |
| Rate limit effectiveness review | Monthly | Database Architect |
| GDPR data retention compliance check | Quarterly | Database Architect + Legal |

**Acceptance Criteria**:
- [ ] `pg_stat_statements` extension is enabled and returning data.
- [ ] The `/api/health` endpoint returns `200` when Supabase is reachable and `503` when it is not.
- [ ] Structured database query logs are emitted from all Route Handlers with timing information.
- [ ] A weekly review cadence is established and documented.
- [ ] Alert thresholds are configured in the Supabase Dashboard.

---

## 16. Environment Variable Reference

All database-related environment variables required across environments:

| Variable | Purpose | Production | Staging | Local |
|---|---|---|---|---|
| `SUPABASE_URL` | Supabase API URL | Prod project URL | Staging project URL | `http://localhost:54321` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side database access | Prod service_role key | Staging key | Local key |
| `SUPABASE_ANON_KEY` | **Not used** (listed for completeness) | Prod anon key | Staging key | Local key |
| `IP_HASH_SALT` | Salt for SHA-256 IP hashing | 64-char random hex | Different 64-char hex | Different 64-char hex |
| `EMAIL_ENCRYPTION_KEY` | AES-256-GCM key for email encryption (P1) | 32-byte hex | Different 32-byte hex | Different 32-byte hex |
| `DATABASE_URL` | Direct Postgres URL (pg_dump backups only) | Supabase direct URL | Staging URL | Local URL |

**Storage**: All variables are stored as Kubernetes Secrets in DOKS. They are never committed to source control.

---

## 17. Migration Sequence and Dependencies

The following migration sequence ensures that all dependencies are satisfied in order:

| Order | Migration File | Contents | Dependencies |
|---|---|---|---|
| 1 | `20260324000000_extensions.sql` | `pgcrypto`, `uuid-ossp`, `pg_stat_statements`, `pg_trgm` | None |
| 2 | `20260324000001_enum_types.sql` | All 5 enum types | Extensions |
| 3 | `20260324000002_tables.sql` | All 6 tables with constraints and comments | Enum types |
| 4 | `20260324000003_indexes.sql` | All indexes for all tables | Tables |
| 5 | `20260324000004_rls_policies.sql` | Enable RLS + service_role policies on all tables | Tables |
| 6 | `20260324000005_functions.sql` | `update_updated_at`, `queue_crm_sync`, `check_rate_limit`, `handle_form_submission` | Tables |
| 7 | `20260324000006_triggers.sql` | `set_updated_at_*` triggers, `trigger_crm_sync` | Functions, Tables |
| 8 | `20260324000007_retention_functions.sql` | All cleanup functions | Tables |
| 9 | `20260324000008_gdpr_functions.sql` | `gdpr_erase_by_email`, `gdpr_export_by_email` | Tables |
| 10 | `20260401000000_email_encryption.sql` | (P1) `email_hash` columns + indexes | Tables in production with data |

**Acceptance Criteria**:
- [ ] Running all migrations in sequence on an empty Supabase project produces a fully functional schema with all tables, indexes, RLS, functions, and triggers.
- [ ] `supabase db reset` on a local instance completes without errors.
- [ ] The migration sequence is documented in this table and matches the files in `supabase/migrations/`.

---

## 18. Non-Functional Requirements

### NFR-DB-001: Query Latency

| Operation | Target Latency (p99) | Measurement |
|---|---|---|
| Rate limit check (`check_rate_limit`) | < 10 ms | `pg_stat_statements` |
| Form submission insert | < 25 ms | Application-level timing |
| Newsletter subscribe | < 15 ms | Application-level timing |
| Analytics event insert | < 10 ms | Application-level timing |
| GDPR erasure (full) | < 5 seconds | Application-level timing |
| GDPR export | < 3 seconds | Application-level timing |

### NFR-DB-002: Capacity

| Metric | Year 1 Estimate | Year 2 Estimate |
|---|---|---|
| Form submissions | 2,000-10,000 | 10,000-50,000 |
| Newsletter subscribers | 500-3,000 | 3,000-15,000 |
| Analytics events | 100,000-500,000 | 500,000-2,000,000 |
| Rate limit entries (peak, before cleanup) | 5,000 | 20,000 |
| Database size | < 500 MB | < 2 GB |

The Supabase Pro plan provides 8 GB of database space. At the Year 2 estimates, the database will use approximately 25% of the available space (well within limits, especially with 90-day analytics retention).

### NFR-DB-003: Availability

| Target | Value |
|---|---|
| Database uptime | 99.9% (Supabase Pro SLA) |
| RPO (Recovery Point Objective) | < 1 minute (PITR) |
| RTO (Recovery Time Objective) | < 30 minutes |

---

## 19. Risks and Mitigations

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Supabase free tier rate limits during early development | Medium | High | Upgrade to Pro before any public traffic |
| R2 | Connection exhaustion during traffic spike | Low | High | Supavisor pooling (FR-DB-080); HPA pod limits |
| R3 | Email encryption key loss | Very Low | Critical | Key stored in multiple Kubernetes Secrets across DOKS node pools; documented recovery procedure |
| R4 | GDPR erasure request misses a table | Low | High | Single `gdpr_erase_by_email` function covers all tables; integration test verifies completeness |
| R5 | Analytics event volume exceeds expectations | Medium | Medium | 90-day retention with auto-cleanup; increase cleanup frequency if needed |
| R6 | Supabase region outage | Very Low | High | Weekly pg_dump to DigitalOcean Spaces; schema migration runbook to new project |
| R7 | Migration breaks production schema | Low | Critical | Staging-first deployment with manual approval gate; PITR as rollback |

---

## 20. Deliverables Checklist

| # | Deliverable | Priority | Status |
|---|---|---|---|
| 1 | Supabase Pro project provisioned in US East | P0 | Not started |
| 2 | All migration files in `supabase/migrations/` | P0 | Not started |
| 3 | RLS enabled and verified on all tables | P0 | Not started |
| 4 | TypeScript types generated and committed | P0 | Not started |
| 5 | Connection pooling configured (Supavisor URL) | P0 | Not started |
| 6 | Rate limit function tested with load simulation | P0 | Not started |
| 7 | GDPR erasure function tested with synthetic data | P0 | Not started |
| 8 | Health check endpoint returning Supabase connectivity | P0 | Not started |
| 9 | Retention cleanup functions scheduled | P0 | Not started |
| 10 | PITR confirmed enabled | P0 | Not started |
| 11 | Weekly pg_dump backup to DigitalOcean Spaces | P1 | Not started |
| 12 | Column-level email encryption migration | P1 | Not started |
| 13 | pg_stat_statements baseline captured | P1 | Not started |
| 14 | PITR restore drill completed | P1 | Not started |
| 15 | A/B test assignment table integrated with frontend | P1 | Not started |

---

*This PRD is the single source of truth for all database architecture decisions on the SafeTrekr marketing site. All schema changes must be proposed as amendments to this document before implementation.*
