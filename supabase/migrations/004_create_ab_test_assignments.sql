-- =============================================================================
-- ST-881: A/B Test Assignments Table
-- =============================================================================
-- Stores sticky variant assignments for server-side A/B tests.
--
-- Each row represents one visitor's assignment to one test. The UNIQUE
-- constraint on (test_name, session_id) guarantees that a visitor is
-- assigned to exactly one variant per test.
--
-- Conversion tracking is achieved by stamping `converted_at` after the
-- visitor completes the desired action. Only the first conversion is
-- recorded (idempotent updates via WHERE converted_at IS NULL).
--
-- Access is restricted to the service_role via RLS (policy added in
-- migration 003). The anon and authenticated roles have zero access.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.ab_test_assignments (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  test_name     text        NOT NULL,
  session_id    text        NOT NULL,
  variant       text        NOT NULL,
  created_at    timestamptz DEFAULT now(),
  converted_at  timestamptz,
  UNIQUE(test_name, session_id)
);

-- Index for test analysis: GROUP BY variant for conversion rate calculation.
-- Query pattern: SELECT variant, count(*) FROM ab_test_assignments
--   WHERE test_name = $1 GROUP BY variant
CREATE INDEX IF NOT EXISTS idx_ab_test_name
  ON public.ab_test_assignments(test_name);

-- Enable Row Level Security. The policy granting service_role access is
-- defined in migration 003_add_service_role_policies.sql.
ALTER TABLE public.ab_test_assignments ENABLE ROW LEVEL SECURITY;

-- Ensure the service_role policy exists (idempotent; no-op if already present
-- from migration 003).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'ab_test_assignments'
      AND policyname = 'service_role_all'
  ) THEN
    CREATE POLICY "service_role_all"
      ON public.ab_test_assignments
      FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;
