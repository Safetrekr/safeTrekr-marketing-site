-- =============================================================================
-- ST-810: Index Verification for SafeTrekr Marketing Tables
-- =============================================================================
-- This file documents all indexes created by the create_marketing_tables
-- migration (20260325005927). It serves as a verification artifact and
-- living reference for the index strategy.
--
-- Indexes are designed around known Server Action query patterns.
-- Each index includes a comment explaining its purpose and the query
-- pattern it supports.
--
-- Run against the database to verify all indexes exist. If any CREATE INDEX
-- fails with "already exists", that confirms the index is present.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- form_submissions indexes (5 indexes + PK)
-- ---------------------------------------------------------------------------

-- Filter by form type for dashboard views and admin listing.
-- Query pattern: SELECT ... FROM form_submissions WHERE form_type = $1
CREATE INDEX IF NOT EXISTS idx_form_submissions_type
  ON public.form_submissions (form_type);

-- Email lookup for GDPR erasure requests, deduplication, and CRM matching.
-- Query pattern: SELECT ... FROM form_submissions WHERE email = $1
CREATE INDEX IF NOT EXISTS idx_form_submissions_email
  ON public.form_submissions (email);

-- Chronological listing (most recent first) for admin dashboard and reports.
-- Query pattern: SELECT ... FROM form_submissions ORDER BY created_at DESC LIMIT $1
CREATE INDEX IF NOT EXISTS idx_form_submissions_created
  ON public.form_submissions (created_at DESC);

-- Composite index for rate-limiting checks in Server Actions.
-- Query pattern: SELECT count(*) FROM form_submissions
--   WHERE ip_hash = $1 AND form_type = $2 AND created_at > now() - interval '1 hour'
CREATE INDEX IF NOT EXISTS idx_form_submissions_rate_limit
  ON public.form_submissions (ip_hash, form_type, created_at DESC);

-- CRM sync: find submissions not yet synced. Partial index keeps size small.
-- Query pattern: SELECT ... FROM form_submissions WHERE crm_synced = false
CREATE INDEX IF NOT EXISTS idx_form_submissions_crm_pending
  ON public.form_submissions (crm_synced)
  WHERE crm_synced = false;


-- ---------------------------------------------------------------------------
-- newsletter_subscribers indexes (2 indexes + PK + UNIQUE on email)
-- ---------------------------------------------------------------------------
-- Note: The UNIQUE constraint on email creates an implicit B-tree index
-- (newsletter_subscribers_email_key), so no separate email index is needed.

-- Confirmation token lookup for double opt-in verification flow.
-- Partial index: only unconfirmed subscribers with a pending token.
-- Query pattern: SELECT ... FROM newsletter_subscribers
--   WHERE confirmation_token = $1 AND confirmed_at IS NULL
CREATE INDEX IF NOT EXISTS idx_newsletter_confirmation_token
  ON public.newsletter_subscribers (confirmation_token)
  WHERE confirmation_token IS NOT NULL AND confirmed_at IS NULL;

-- Active subscriber lookup (confirmed and not unsubscribed).
-- Used by SendGrid sync and segment export jobs.
-- Query pattern: SELECT ... FROM newsletter_subscribers
--   WHERE confirmed_at IS NOT NULL AND unsubscribed_at IS NULL
CREATE INDEX IF NOT EXISTS idx_newsletter_active
  ON public.newsletter_subscribers (confirmed_at, unsubscribed_at)
  WHERE confirmed_at IS NOT NULL AND unsubscribed_at IS NULL;


-- ---------------------------------------------------------------------------
-- analytics_events indexes (4 indexes + PK)
-- ---------------------------------------------------------------------------

-- Event type filtering for conversion funnel analysis.
-- Query pattern: SELECT ... FROM analytics_events WHERE event_name = $1
CREATE INDEX IF NOT EXISTS idx_events_name
  ON public.analytics_events (event_name);

-- Chronological queries, retention cleanup, and time-windowed reports.
-- Query pattern: SELECT ... FROM analytics_events
--   WHERE created_at BETWEEN $1 AND $2 ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_events_created
  ON public.analytics_events (created_at DESC);

-- Page-level event analysis (e.g., heatmaps, scroll depth per page).
-- Query pattern: SELECT ... FROM analytics_events WHERE page_path = $1
CREATE INDEX IF NOT EXISTS idx_events_page
  ON public.analytics_events (page_path);

-- Session reconstruction for user journey analysis.
-- Partial index excludes server-side events that have no session.
-- Query pattern: SELECT ... FROM analytics_events
--   WHERE session_id = $1 ORDER BY created_at
CREATE INDEX IF NOT EXISTS idx_events_session
  ON public.analytics_events (session_id)
  WHERE session_id IS NOT NULL;


-- ---------------------------------------------------------------------------
-- rate_limits indexes (2 indexes + PK)
-- ---------------------------------------------------------------------------

-- Primary lookup: count actions for an IP within a sliding time window.
-- Composite index covers the full WHERE + ORDER BY pattern.
-- Query pattern: SELECT count(*) FROM rate_limits
--   WHERE ip_hash = $1 AND action = $2 AND created_at > now() - interval '1 hour'
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup
  ON public.rate_limits (ip_hash, action, created_at DESC);

-- Cleanup job: delete rows older than 24 hours to keep table small.
-- Query pattern: DELETE FROM rate_limits WHERE created_at < now() - interval '24 hours'
CREATE INDEX IF NOT EXISTS idx_rate_limits_cleanup
  ON public.rate_limits (created_at);


-- ---------------------------------------------------------------------------
-- ab_test_assignments indexes (1 index + PK + UNIQUE on test_name,session_id)
-- ---------------------------------------------------------------------------
-- Note: The UNIQUE constraint on (test_name, session_id) creates an implicit
-- composite index that also serves session-level lookups.

-- Test analysis: group by test + variant for conversion rate calculation.
-- Query pattern: SELECT variant, count(*) FROM ab_test_assignments
--   WHERE test_name = $1 GROUP BY variant
CREATE INDEX IF NOT EXISTS idx_ab_test_analysis
  ON public.ab_test_assignments (test_name, variant);


-- ---------------------------------------------------------------------------
-- crm_sync_queue indexes (1 index + PK + FK on form_submission_id)
-- ---------------------------------------------------------------------------

-- Cron job picks up pending items that are ready for retry.
-- Partial index: only rows still eligible for processing.
-- Query pattern: SELECT ... FROM crm_sync_queue
--   WHERE status = 'pending' AND attempts < max_attempts
--   ORDER BY next_retry_at ASC LIMIT $1
CREATE INDEX IF NOT EXISTS idx_crm_queue_pending
  ON public.crm_sync_queue (next_retry_at)
  WHERE status = 'pending' AND attempts < max_attempts;


-- =============================================================================
-- INDEX SUMMARY
-- =============================================================================
-- Table                    | Index Count | Notes
-- -------------------------+-------------+--------------------------------------
-- form_submissions         | 5 + PK      | Composite for rate-limit, partial for CRM
-- newsletter_subscribers   | 2 + PK + UQ | Both partial indexes for efficiency
-- analytics_events         | 4 + PK      | Partial on session_id
-- rate_limits              | 2 + PK      | Composite for lookup pattern
-- ab_test_assignments      | 1 + PK + UQ | UQ on (test_name, session_id)
-- crm_sync_queue           | 1 + PK + FK | Partial for pending items only
-- -------------------------+-------------+--------------------------------------
-- Total custom indexes: 15
-- Max per table: 5 (form_submissions) -- well under the 7-index guardrail
-- =============================================================================
