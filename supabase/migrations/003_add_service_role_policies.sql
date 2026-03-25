-- =============================================================================
-- ST-811: Service-Role-Only RLS Policies for Marketing Tables
-- =============================================================================
-- All 6 marketing tables have RLS enabled (from create_marketing_tables).
-- This migration adds explicit service_role policies so that ONLY Server
-- Actions (which use the service_role key) can read/write data.
--
-- The anon and authenticated roles have ZERO access to any marketing table.
-- This is defense-in-depth: even if the anon key leaks, no data is exposed.
-- =============================================================================

-- form_submissions: demo requests, contact forms, quote requests
CREATE POLICY "service_role_all" ON public.form_submissions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- newsletter_subscribers: email list with double opt-in
CREATE POLICY "service_role_all" ON public.newsletter_subscribers
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- analytics_events: page views, conversions, custom events
CREATE POLICY "service_role_all" ON public.analytics_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- rate_limits: IP-based throttling for form submissions
CREATE POLICY "service_role_all" ON public.rate_limits
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ab_test_assignments: variant assignments for A/B tests
CREATE POLICY "service_role_all" ON public.ab_test_assignments
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- crm_sync_queue: retry queue for CRM integration
CREATE POLICY "service_role_all" ON public.crm_sync_queue
  FOR ALL TO service_role USING (true) WITH CHECK (true);
