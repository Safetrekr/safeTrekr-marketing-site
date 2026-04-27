-- =============================================================================
-- 001: Create SafeTrekr Marketing Tables (idempotent baseline)
-- =============================================================================
-- Creates the marketing-site tables that the Server Actions and
-- rate_limits / analytics pipelines depend on:
--
--   public.form_submissions
--   public.newsletter_subscribers
--   public.analytics_events
--   public.rate_limits
--   public.crm_sync_queue
--
-- ab_test_assignments is owned by migration 004.
-- Policies (service-role-only) are owned by migration 003.
-- Index verification is in migration 002.
--
-- -----------------------------------------------------------------------------
-- PRODUCTION-SAFETY GUARANTEE
-- -----------------------------------------------------------------------------
-- This Supabase project is shared with the safetrekr-app-v2 application and
-- the Python core API. This migration MUST NOT impact production state.
--
--   * Every CREATE uses IF NOT EXISTS -- a pre-existing table is left untouched.
--   * ENABLE ROW LEVEL SECURITY is idempotent in Postgres (no-op if already on).
--   * No DROP, no ALTER COLUMN, no TRUNCATE, no INSERT/UPDATE/DELETE.
--   * No app-v2 table names are touched (trips, users, organizations, etc. —
--     verified disjoint from the five marketing tables above).
--   * Wrapped in a single transaction for atomicity.
--
-- If production already has these tables with a different schema, this
-- migration is a silent no-op -- the existing schema remains authoritative.
-- Use `\d public.form_submissions` (etc.) before and after to confirm no
-- schema drift.
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- form_submissions
-- ---------------------------------------------------------------------------
-- Receives demo requests, contact forms, quote requests, and sample-binder
-- download requests. Columns match what the Server Action inserts
-- (see src/actions/submit-form.ts) and what migration 002's indexes assume.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.form_submissions (
  id                 uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  form_type          text        NOT NULL,
  email              text        NOT NULL,
  first_name         text,
  last_name          text,
  organization       text,
  details            jsonb,
  ip_hash            text,
  honeypot_triggered boolean     NOT NULL DEFAULT false,
  user_agent         text,
  referer            text,
  crm_synced         boolean     NOT NULL DEFAULT false,
  created_at         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------------
-- newsletter_subscribers
-- ---------------------------------------------------------------------------
-- One row per subscriber email. Status tracks the double-opt-in lifecycle:
-- 'pending_confirmation' -> 'confirmed' -> (optional) 'unsubscribed'.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  email               text        NOT NULL UNIQUE,
  first_name          text,
  status              text        NOT NULL DEFAULT 'pending_confirmation',
  ip_hash             text,
  source              text,
  confirmation_token  text,
  confirmed_at        timestamptz,
  subscribed_at       timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at     timestamptz
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------------
-- analytics_events
-- ---------------------------------------------------------------------------
-- Server-side analytics sink for custom events (CTA clicks, form views,
-- conversions). Client-side analytics go through Plausible/GA4.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name  text        NOT NULL,
  properties  jsonb,
  session_id  text,
  ip_hash     text,
  user_agent  text,
  referer     text,
  page_path   text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------------
-- rate_limits
-- ---------------------------------------------------------------------------
-- Sliding-window rate limiter backing checkRateLimit() in
-- src/lib/security/rate-limit.ts. One row per action attempt.
--
-- NOTE: column is `action_type` to match the Server Action's
-- .eq("action_type", action) query. Migration 002's index references
-- `action` (pre-existing typo, not fixed here -- flagged as follow-up).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_hash      text        NOT NULL,
  action_type  text        NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------------
-- crm_sync_queue
-- ---------------------------------------------------------------------------
-- Retry queue for CRM synchronization of form submissions. Rows start
-- status='pending'; a worker moves them to 'synced' or 'failed' after
-- hitting the CRM API. Indexed on (status, next_retry_at) by migration 002.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_sync_queue (
  id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  form_submission_id  uuid        REFERENCES public.form_submissions(id) ON DELETE CASCADE,
  status              text        NOT NULL DEFAULT 'pending',
  attempts            integer     NOT NULL DEFAULT 0,
  max_attempts        integer     NOT NULL DEFAULT 5,
  last_error          text,
  next_retry_at       timestamptz NOT NULL DEFAULT now(),
  last_attempt_at     timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_sync_queue ENABLE ROW LEVEL SECURITY;

COMMIT;
