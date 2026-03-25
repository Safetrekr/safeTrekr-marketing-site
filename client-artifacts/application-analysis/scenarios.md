# SafeTrekr Adversarial Testing Scenarios

**Generated:** 2026-03-17
**Platform:** SafeTrekr v2 -- Multi-tenant travel safety for vulnerable populations
**Scope:** 292K LOC, 6 services, 138 DB tables, 10 user roles, 3 web portals + 1 mobile app
**Agent:** Crash-to-Fix Oracle (CFO) v1.1

---

## Table of Contents

1. [Critical Path Scenarios (SCENARIO-001 through SCENARIO-010)](#critical-path)
2. [Security Scenarios (SCENARIO-011 through SCENARIO-025)](#security)
3. [Safety-Critical Scenarios (SCENARIO-026 through SCENARIO-033)](#safety-critical)
4. [Integration Scenarios (SCENARIO-034 through SCENARIO-040)](#integration)
5. [Data Integrity Scenarios (SCENARIO-041 through SCENARIO-048)](#data-integrity)
6. [Edge Case Scenarios (SCENARIO-049 through SCENARIO-056)](#edge-cases)
7. [Accessibility Scenarios (SCENARIO-057 through SCENARIO-060)](#accessibility)
8. [Performance Scenarios (SCENARIO-061 through SCENARIO-066)](#performance)

---

<a id="critical-path"></a>
## 1. Critical Path Scenarios

### SCENARIO-001: Trip creation through finalize with payment
- **Category**: Critical Path
- **Priority**: P0
- **Preconditions**: Org admin logged into safetrekr-app-v2 with valid Stripe-connected organization. At least one trip plan template exists.
- **Steps**:
  1. Navigate to `/trips/new` and fill in trip info (destination, dates, traveler count).
  2. Add flights via `/trips/new/flights` with valid IATA codes and dates.
  3. Add lodging via `/trips/new/lodging` with valid check-in/check-out dates.
  4. Add at least 3 participants (1 chaperone, 1 guardian, 1 minor traveler) via `/trips/new/participants`.
  5. Add day-by-day itinerary with events spanning check-in through departure.
  6. Navigate to review page and click "Finalize and Pay."
  7. Complete Stripe payment with test card `4242 4242 4242 4242`.
  8. Verify trip status transitions: `draft` -> `pending_payment` -> `pending_review`.
  9. Verify all child tables populated: `trip_flights`, `trip_lodging`, `trip_venues`, `trip_participants`, `itinerary_events`, `trip_ground_travel`.
  10. Verify invite records created for each participant with `status: pending`.
- **Expected Result**: Trip fully materialized in database. Payment intent succeeded. All relational data inserted without FK violations. Invite emails queued.
- **Failure Impact**: Core revenue path broken. Organizations cannot submit trips for review. Entire platform value proposition collapses.
- **Automation**: Playwright

### SCENARIO-002: Trip finalize with empty string date fields
- **Category**: Critical Path
- **Priority**: P0
- **Preconditions**: Trip in draft state with some optional date fields left empty by the user.
- **Steps**:
  1. Create a trip with participants where `date_of_birth` is left blank for some travelers.
  2. Leave `flight_date`, `departure_time`, `arrival_time` empty for optional flight legs.
  3. Leave `checkin_date` empty for a venue visit.
  4. Submit finalize request via `POST /v1/trips/finalize`.
  5. Inspect the request body for empty strings (`""`) in date/time fields.
  6. Verify the `none_if_empty()` helper converts all `""` to `None` before Postgres insert.
  7. Confirm no `invalid input syntax for type date` errors from Postgres.
- **Expected Result**: All empty string date fields silently converted to NULL. Insert succeeds. No 500 errors.
- **Failure Impact**: Known regression. Postgres rejects `""` for date columns, causing silent trip creation failures and lost customer data.
- **Automation**: API Test

### SCENARIO-003: Itinerary event category mapping during finalize
- **Category**: Critical Path
- **Priority**: P0
- **Preconditions**: Trip with itinerary events that include frontend category names not matching the database CHECK constraint.
- **Steps**:
  1. Create a trip with itinerary events having categories: `checkin`, `departure`, `arrival`, `sightseeing`, `worship`.
  2. Call `POST /v1/trips/finalize`.
  3. Verify the `CATEGORY_MAP` in `trips.py` translates each frontend category to a valid DB enum: `meal`, `activity`, `meeting`, `transport`, `free_time`, `other`.
  4. Confirm `start_time` defaults to `"00:00:00"` for events without explicit times.
  5. Confirm `location_id` is set to `None` (not the frontend `sourceId`).
  6. Query `itinerary_events` table and verify all rows inserted successfully.
- **Expected Result**: All events inserted with valid categories. No CHECK constraint violations. No FK violations on `location_id`.
- **Failure Impact**: Events silently dropped. Travelers see empty schedules. Chaperones have no itinerary reference during the trip.
- **Automation**: API Test

### SCENARIO-004: Invite token generation, delivery, and consumption end-to-end
- **Category**: Critical Path
- **Priority**: P0
- **Preconditions**: Trip finalized with participants. SendGrid configured (sandbox mode acceptable).
- **Steps**:
  1. After trip finalize, verify invite records created in `invites` table with `status: pending`.
  2. Verify each invite has a hashed token (64-char hex string from HMAC-SHA-256).
  3. Verify the raw token was sent via email (check `send_attempt_count > 0`).
  4. Take the raw token from the email body (or test fixture).
  5. Call `POST /v1/auth/consume-invite` with the raw token.
  6. Verify user created in `users` table if new.
  7. Verify `trip_participants` record created with correct role.
  8. Verify invite status updated to `accepted` with `accepted_at` timestamp.
  9. Verify JWT returned with correct `sub`, `role`, `trip_id` claims.
  10. Attempt to reuse the same token. Verify 400 "already been used" response.
- **Expected Result**: Full invite lifecycle from generation through consumption works. Token single-use enforced. JWT issued with correct claims.
- **Failure Impact**: Travelers cannot join trips. Entire mobile onboarding flow broken. Platform unusable for end users.
- **Automation**: API Test

### SCENARIO-005: Mobile registration via invite with password creation
- **Category**: Critical Path
- **Priority**: P0
- **Preconditions**: Valid invite with `status: sent` exists. Email not yet registered in Supabase Auth or `users` table.
- **Steps**:
  1. Call `POST /v1/auth/register` with valid `invite_token`, `name`, `phone`, `password`.
  2. Verify HMAC hash lookup matches the invite in the database.
  3. Verify Supabase Auth Admin API creates the user with `email_confirm: true`.
  4. Verify `users` table record created with `access_level: 'mobile'` and `auth_user_id` linked.
  5. Verify invite status transitions to `accepted`.
  6. Verify `trip_participants` record created with `status: confirmed`.
  7. Verify access token and refresh token returned.
  8. Attempt registration with the same token again. Verify 400 "no longer valid."
  9. Attempt registration with a different email than what is on the invite. Verify the server ignores client-provided email and uses the invite email.
- **Expected Result**: New user fully provisioned across both auth systems. Email derived server-side (not from client input). Tokens valid for API access.
- **Failure Impact**: New travelers cannot create accounts. Complete mobile onboarding broken.
- **Automation**: API Test

### SCENARIO-006: Analyst trip review workflow through all 17 sections
- **Category**: Critical Path
- **Priority**: P0
- **Preconditions**: Trip in `pending_review` status. Analyst user logged into analyst portal.
- **Steps**:
  1. Navigate to analyst queue at `/analyst/queue`.
  2. Claim an unassigned trip from the queue.
  3. Navigate to trip review at `/analyst/trip-review/[tripId]`.
  4. Visit each of the 17+ review sections: overview, air-travel, lodging, transportation, venues, itinerary, participants, safety, intel-alerts, background-checks, documents, evidence, checklists, emergency-preparedness, briefings, comms, approval.
  5. For each section, verify data loads correctly from the API.
  6. Add an issue on at least one section.
  7. Add a comment on the trip.
  8. Mark checklists as complete.
  9. Navigate to approval page and approve the trip.
  10. Verify trip status transitions to `approved`.
- **Expected Result**: All 17 review sections render with correct data. Issues and comments persist. Trip status transitions correctly.
- **Failure Impact**: Trips stuck in review indefinitely. Organizations never receive trip approval. Revenue delayed.
- **Automation**: Playwright

### SCENARIO-007: Dual auth system login -- web (Supabase JWT) vs. mobile (custom JWT)
- **Category**: Critical Path
- **Priority**: P0
- **Preconditions**: User exists in both `auth.users` and `public.users` tables with `auth_user_id` correctly linked.
- **Steps**:
  1. **Web flow**: Log in via Supabase Auth in safetrekr-app-v2. Capture the JWT.
  2. Decode the JWT. Verify `sub` is the `auth.users.id` (NOT `public.users.id`).
  3. Call a Core API endpoint with this JWT. Verify `get_current_user()` resolves via `auth_user_id` lookup.
  4. **Mobile flow**: Log in via `POST /v1/auth/login`. Capture the JWT.
  5. Decode the JWT. Verify `sub` is the `public.users.id`.
  6. Call the same Core API endpoint with this JWT. Verify `get_current_user()` resolves via `id` fallback lookup.
  7. Verify both flows return the same user data and role.
  8. Attempt to use a mobile JWT on a web-only endpoint. Verify correct RBAC enforcement.
- **Expected Result**: Both auth flows resolve to the same user. The dual-lookup in `security.py` (first `auth_user_id`, then `id`) handles both token types transparently.
- **Failure Impact**: Auth desync causes 401s across one or both platforms. Users locked out. Known historical issue per project memory.
- **Automation**: API Test

### SCENARIO-008: Organization creation with admin invite and activation
- **Category**: Critical Path
- **Priority**: P1
- **Preconditions**: HQ admin logged into the HQ portal.
- **Steps**:
  1. HQ admin creates a new organization via Core API (`coreOrgMutationsApi.create()`).
  2. Verify organization record created with correct `settings` JSONB (no `slug`, `plan`, or `status` columns).
  3. Verify admin invite sent to the specified org admin email.
  4. Org admin receives activation email and clicks the link.
  5. Org admin completes onboarding (password creation, profile setup).
  6. Verify org admin can log in and access the client portal.
  7. Verify org admin sees only their organization's data (tenant isolation).
- **Expected Result**: Org created. Admin invited and activated. Tenant boundary enforced from first login.
- **Failure Impact**: New customers cannot be onboarded. Known historical bug where `slug`/`plan`/`status` inserts caused 400 errors.
- **Automation**: Playwright + API Test

### SCENARIO-009: Trip packet delivery to traveler mobile app
- **Category**: Critical Path
- **Priority**: P1
- **Preconditions**: Trip approved. Traveler registered and logged into native app with valid trip context.
- **Steps**:
  1. Open the traveler native app and navigate to trip home at `/(app)/trip/[tripId]/`.
  2. Verify the "Today" view loads with role-specific content (TravelerTodayView).
  3. Navigate to packet hub at `/(app)/trip/[tripId]/packet/`.
  4. Verify all packet sections load: air travel, emergency, lodging, participants, safety, transportation, venues.
  5. Tap into each section and verify data matches what was entered during trip creation.
  6. Navigate to schedule at `/(app)/trip/[tripId]/schedule`.
  7. Verify itinerary events render in chronological order with correct times.
  8. Navigate to documents at `/(app)/trip/[tripId]/documents`.
  9. Verify passport upload flow is available for applicable travelers.
- **Expected Result**: Complete trip packet accessible on mobile. All data consistent with web portal entry.
- **Failure Impact**: Travelers arrive at destinations without critical safety information, lodging details, or emergency contacts.
- **Automation**: Detox

### SCENARIO-010: SMS broadcast from chaperone to group
- **Category**: Critical Path
- **Priority**: P1
- **Preconditions**: Active trip with multiple participants who have phone numbers. Chaperone logged into mobile app.
- **Steps**:
  1. Chaperone navigates to the broadcast interface (SmsBroadcastSection component).
  2. Chaperone composes a message and selects recipients (full group or subgroup).
  3. Chaperone sends the broadcast.
  4. Verify the API creates `sms_broadcast` records.
  5. Verify delivery status tracking updates for each recipient.
  6. Verify participants with no phone numbers are gracefully excluded (no crash).
  7. Send a broadcast with special characters, emoji, and max-length text.
  8. Verify message arrives at recipients (or is queued for delivery).
- **Expected Result**: Broadcast sent to all eligible recipients. Delivery tracked. No data loss on special characters.
- **Failure Impact**: Chaperones cannot communicate urgent information to group. Safety degradation during active trips.
- **Automation**: Detox + API Test

---

<a id="security"></a>
## 2. Security Scenarios

### SCENARIO-011: Cross-tenant data access via direct API manipulation
- **Category**: Security
- **Priority**: P0
- **Preconditions**: Two organizations (Org A, Org B) each with at least one trip. User is `org_admin` of Org A.
- **Steps**:
  1. Authenticate as Org A admin. Capture JWT.
  2. Call `GET /v1/trips/{org_b_trip_id}` using Org B's trip ID.
  3. Call `GET /v1/trips/{org_b_trip_id}/participants` to attempt accessing Org B participant PII.
  4. Call `POST /v1/trips/{org_b_trip_id}/invites` to attempt creating an invite on Org B's trip.
  5. Call `GET /v1/trips/{org_b_trip_id}/evidence` to attempt reading Org B's evidence chain.
  6. Call `PUT /v1/trips/{org_b_trip_id}/alerts/{alert_id}` to attempt modifying Org B's alerts.
  7. Verify ALL requests return 403 Forbidden or 404 Not Found (not 200 with data).
- **Expected Result**: Complete tenant isolation enforced at the API layer. No data leakage across organization boundaries.
- **Failure Impact**: CRITICAL. Minor PII (COPPA/FERPA protected), medical data (HIPAA), payment data (PCI-DSS) exposed across tenants. Regulatory liability. Lawsuit risk given vulnerable population (minors).
- **Automation**: API Test

### SCENARIO-012: Service client RLS bypass audit (272 instances)
- **Category**: Security
- **Priority**: P0
- **Preconditions**: Access to source code and Supabase dashboard. 272 instances of `get_service_supabase` identified in codebase.
- **Steps**:
  1. Grep all files using `get_service_supabase` across the codebase.
  2. For each usage, classify as: (a) justified (auth flow user lookup, admin operations), or (b) unjustified (should use anon client with RLS).
  3. For each unjustified usage, verify whether the route handler implements application-level authorization (role check + org_id check).
  4. Identify any endpoints where service client is used WITHOUT authorization checks.
  5. For those endpoints, craft requests as a low-privilege user (traveler) and verify access is denied.
  6. Document each instance and its risk level.
- **Expected Result**: All 272 service client usages either justified or protected by application-level authorization. No unguarded data access paths.
- **Failure Impact**: Service client bypasses ALL Row Level Security. A single unguarded endpoint exposes the entire database to any authenticated user regardless of role.
- **Automation**: Manual + API Test

### SCENARIO-013: Role escalation via JWT claim manipulation
- **Category**: Security
- **Priority**: P0
- **Preconditions**: Valid traveler-role JWT.
- **Steps**:
  1. Authenticate as a traveler. Capture the JWT.
  2. Decode the JWT and modify the `role` claim from `traveler` to `hq_admin`.
  3. Re-encode the JWT WITHOUT the valid signature (tampered token).
  4. Send a request to an admin-only endpoint (`require_admin` dependency). Verify 401.
  5. Attempt to sign the tampered JWT with a guessed/empty secret. Verify 401.
  6. Attempt to use algorithm confusion attack (set `alg: none`). Verify 401.
  7. Attempt to use `alg: HS256` with the Supabase anon key as the secret. Verify 401.
  8. If the `SUPABASE_JWT_SECRET` is the same as the Supabase project JWT secret, verify it is not exposed in client-side code or public configuration.
- **Expected Result**: JWT validation rejects all tampered tokens. Algorithm must match `settings.ALGORITHM`. Secret must match `settings.SUPABASE_JWT_SECRET`.
- **Failure Impact**: Complete authorization bypass. Any authenticated user becomes HQ admin. Total system compromise.
- **Automation**: API Test

### SCENARIO-014: Mobile auth token type confusion (access vs. refresh)
- **Category**: Security
- **Priority**: P0
- **Preconditions**: Valid mobile refresh token.
- **Steps**:
  1. Authenticate via `POST /v1/auth/login`. Capture both access and refresh tokens.
  2. Wait for the access token to expire (1 hour, or manually set `exp` in test).
  3. Attempt to use the refresh token as a Bearer token on a normal API endpoint.
  4. Verify the request succeeds or fails depending on whether `get_current_user()` checks the `type` claim.
  5. Inspect `security.py` `get_current_user()` -- it does NOT check the `type` claim. Verify if refresh tokens are accepted as access tokens.
  6. Call `POST /v1/auth/refresh` with an access token (not a refresh token). Verify it fails with "Invalid token type."
  7. Verify that old refresh tokens are NOT invalidated after rotation (the code comments confirm "no rotation for simplicity").
- **Expected Result**: The refresh endpoint correctly validates `type: refresh`. However, the `get_current_user()` function likely accepts refresh tokens as access tokens (this is a finding if confirmed).
- **Failure Impact**: Refresh tokens (30-day lifetime) usable as access tokens bypasses the 1-hour expiry. Stolen refresh tokens grant persistent access.
- **Automation**: API Test

### SCENARIO-015: 45 tables without Row Level Security policies
- **Category**: Security
- **Priority**: P0
- **Preconditions**: Access to Supabase dashboard or migration files.
- **Steps**:
  1. Query Supabase for all tables without RLS enabled: `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT IN (SELECT tablename FROM pg_tables JOIN pg_policies...)`.
  2. List all 45 tables without RLS.
  3. For each table, determine if it contains sensitive data (PII, medical, financial, location).
  4. For each sensitive table without RLS, attempt to query it using the Supabase anon key directly (bypassing the Core API entirely).
  5. Verify whether PostgREST exposes these tables to anonymous or authenticated users via the REST API.
  6. Attempt `SELECT * FROM table_name` via PostgREST for each unprotected table.
- **Expected Result**: Tables without RLS should either (a) not be exposed via PostgREST, or (b) contain no sensitive data, or (c) have RLS added immediately.
- **Failure Impact**: Direct database access bypassing ALL application authorization. PII of minors (COPPA), medical records (HIPAA), payment data (PCI) exposed to anyone with the anon key (which is embedded in client-side code).
- **Automation**: API Test

### SCENARIO-016: Anonymous RLS policies allowing unauthenticated data access
- **Category**: Security
- **Priority**: P0
- **Preconditions**: 27 anonymous policies identified as active in Supabase.
- **Steps**:
  1. List all RLS policies with `role = 'anon'` or `USING (true)`.
  2. For each anonymous policy, determine which table and operation (SELECT/INSERT/UPDATE/DELETE) it applies to.
  3. Using only the Supabase anon key (no auth token), attempt the allowed operation on each table.
  4. Verify what data is returned. Look for PII, trip details, participant information, location data.
  5. Attempt to join anonymous-accessible tables with other tables to escalate data access.
  6. Document each anonymous policy with its risk assessment.
- **Expected Result**: Anonymous policies should be limited to truly public data (e.g., country lists). No PII, trip data, or user data accessible without authentication.
- **Failure Impact**: Unauthenticated attackers can harvest data about trips, participants (minors), locations, and emergency contacts. COPPA/FERPA violations.
- **Automation**: API Test

### SCENARIO-017: Plaintext credentials in repository (stripe_creds.md)
- **Category**: Security
- **Priority**: P0
- **Preconditions**: File `stripe_creds.md` exists in repository root containing Stripe dashboard URL, email, and password in plaintext.
- **Steps**:
  1. Verify file exists at `/Users/justintabb/projects/safetrekr/stripe_creds.md`.
  2. Confirm it contains production Stripe credentials (dashboard URL, email, password).
  3. Check git history to determine if this file was ever committed to a remote branch.
  4. Check `.gitignore` to verify whether `stripe_creds.md` is excluded.
  5. Search for other credential files: `*.env`, `*secret*`, `*password*`, `*credential*`.
  6. Verify `SUPABASE_SERVICE_KEY` is not hardcoded in any committed file.
  7. Verify the Stripe credentials are still valid (or have been rotated).
- **Expected Result**: Credentials must NOT be in version control. Must be rotated immediately if ever committed. `.gitignore` must exclude credential files.
- **Failure Impact**: Stripe account compromise. Financial fraud. PCI-DSS violation. Customer payment data at risk.
- **Automation**: Manual + Grep-based scan

### SCENARIO-018: Invite token brute-force attack
- **Category**: Security
- **Priority**: P1
- **Preconditions**: Knowledge that invite tokens exist. No authentication required for `consume-invite`.
- **Steps**:
  1. Note that `POST /v1/auth/consume-invite` does NOT require authentication (by design).
  2. Generate 10,000 random tokens and attempt to consume each via the API.
  3. Measure the rate at which requests are processed.
  4. Verify rate limiting applies to unauthenticated requests (should be 30/min per IP).
  5. Verify the token space is large enough to prevent brute force (32 bytes = 256 bits of entropy via `secrets.token_urlsafe(32)`).
  6. Calculate: at 30 requests/min, how long to brute-force a 256-bit token space? (Answer: heat death of universe -- acceptable).
  7. However, verify that `consume-invite` checks the HMAC hash, not the raw token (the code at line 338-340 of auth.py checks `"token"` field directly -- this may be the raw token stored, NOT the HMAC hash).
- **Expected Result**: Token entropy sufficient. Rate limiting enforced. But: investigate whether raw tokens are stored in the `invites` table (the `consume-invite` endpoint queries by raw token, while `register` queries by HMAC hash -- inconsistency found).
- **Failure Impact**: If raw tokens stored in DB, a database breach exposes all active invite tokens. Attackers could impersonate invitees and gain trip access.
- **Automation**: API Test

### SCENARIO-019: Rate limiting fails open on Redis failure
- **Category**: Security
- **Priority**: P1
- **Preconditions**: Core API running with Redis configured. Ability to simulate Redis failure.
- **Steps**:
  1. Verify rate limiting works normally (send 31 requests as anonymous in 1 minute, verify 429 on 31st).
  2. Simulate Redis failure (stop Redis container or block port 6380).
  3. Observe the `except Exception` block at line 85-91 of `rate_limit.py` which catches ALL errors and logs but allows the request through.
  4. Send 1,000 requests in rapid succession with Redis down.
  5. Verify ALL 1,000 requests are processed (rate limiting completely disabled).
  6. Verify this applies to authentication endpoints (`/v1/auth/login`, `/v1/auth/consume-invite`, `/v1/auth/register`).
  7. Attempt credential stuffing attack on `/v1/auth/login` during Redis outage.
- **Expected Result**: When Redis fails, rate limiting is completely bypassed. All requests go through unlimited.
- **Failure Impact**: DDoS amplification. Credential stuffing attacks succeed against login endpoint. Brute force against invite tokens.
- **Automation**: API Test + Load Test

### SCENARIO-020: IDOR on trip participant data
- **Category**: Security
- **Priority**: P1
- **Preconditions**: Traveler A and Traveler B both on the same trip. Traveler A authenticated.
- **Steps**:
  1. As Traveler A, call `GET /v1/trips/{tripId}/participants` and capture the participant list.
  2. Extract Traveler B's `user_id` from the response.
  3. Attempt to call `GET /v1/users/{travelerB_userId}` to access B's full profile.
  4. Attempt to call `GET /v1/users/{travelerB_userId}/settings` to access B's settings.
  5. Attempt to modify Traveler B's profile via `PUT /v1/users/{travelerB_userId}`.
  6. For a trip Traveler A is NOT on, attempt to access that trip's participant list.
  7. As a traveler, attempt to access guardian-specific data (medical info, emergency contacts of other travelers' guardians).
- **Expected Result**: Traveler can see names/roles of co-participants (needed for trip). Cannot access full profiles, settings, or data from other trips.
- **Failure Impact**: PII leakage between participants. Especially dangerous for minor travelers (COPPA). Guardian personal data exposed.
- **Automation**: API Test

### SCENARIO-021: SendGrid webhook signature bypass
- **Category**: Security
- **Priority**: P1
- **Preconditions**: SendGrid webhook endpoint accessible.
- **Steps**:
  1. Verify `SENDGRID_WEBHOOK_SECRET` configuration status.
  2. If NOT configured, the `_verify_sendgrid_signature()` function at line 68 returns `True` (bypasses verification).
  3. Send a forged webhook payload to `POST /v1/webhooks/sendgrid` with fake bounce events.
  4. Verify whether the fake bounce events create suppression records via `add_suppression()`.
  5. If successful, an attacker can suppress any email address, preventing invite delivery.
  6. Send a forged webhook claiming all invites were delivered (manipulate analytics).
  7. Verify timestamp tolerance (5 minutes). Send a replay of a legitimate webhook older than 5 minutes.
- **Expected Result**: With secret configured, forged webhooks rejected. Without secret, ALL webhooks accepted (vulnerability).
- **Failure Impact**: Attacker suppresses legitimate email addresses. Invite delivery blocked. Analytics poisoned.
- **Automation**: API Test

### SCENARIO-022: COPPA compliance -- minor data access controls
- **Category**: Security
- **Priority**: P0
- **Preconditions**: Trip with minor participants (age < 13) and their guardians.
- **Steps**:
  1. Create a trip with a participant whose `date_of_birth` indicates age < 13.
  2. Verify parental/guardian consent is required before the minor's data is processed.
  3. Attempt to access the minor's profile data without guardian consent on record.
  4. Verify that the minor's PII (name, DOB, photo, location) is not exposed to non-guardian, non-chaperone users.
  5. Verify that passport upload (containing DOB, nationality, photo) for minors requires guardian authorization.
  6. Check whether the `users` table stores age/DOB and whether RLS policies restrict access based on age.
  7. Verify data retention policies for minors' data after trip completion.
  8. Attempt to export minor participant data as an org admin. Verify appropriate access controls.
- **Expected Result**: Minor data access restricted to authorized roles (chaperone, guardian, analyst, HQ). Parental consent tracked. Export controls in place.
- **Failure Impact**: COPPA violation. FTC enforcement action. Fines up to $50,120 per violation per child. Reputational destruction for a child safety platform.
- **Automation**: API Test + Manual

### SCENARIO-023: Login endpoint credential enumeration
- **Category**: Security
- **Priority**: P1
- **Preconditions**: `POST /v1/auth/login` endpoint accessible.
- **Steps**:
  1. Attempt login with a valid email and wrong password. Capture the error message and response time.
  2. Attempt login with a nonexistent email and any password. Capture the error message and response time.
  3. Compare error messages: if "Invalid email or password" for both, enumeration is mitigated.
  4. Compare response times: if the valid-email case takes significantly longer (due to Supabase Auth call), timing-based enumeration is possible.
  5. Attempt login 100 times with wrong passwords for a known email. Verify no account lockout mechanism exists.
  6. Verify the endpoint at `POST /v1/auth/login` returns consistent 401 for both cases.
  7. Check whether Supabase Auth has its own rate limiting on the `token?grant_type=password` endpoint.
- **Expected Result**: Error messages identical for both cases. Timing differences minimal. Rate limiting prevents bulk enumeration.
- **Failure Impact**: Attacker identifies valid email addresses. Combined with password spraying, accounts compromised.
- **Automation**: API Test

### SCENARIO-024: Evidence hash chain tampering detection
- **Category**: Security
- **Priority**: P1
- **Preconditions**: Trip with existing evidence log entries (hash chain established).
- **Steps**:
  1. Create 5 evidence entries for a trip via `POST /v1/trips/{tripId}/evidence`.
  2. Verify each entry's `event_hash` chains from the previous entry.
  3. Query the evidence chain and verify integrity: recompute each hash from `"{prev_hash}:{trip_id}:{event_type}:{description}:{created_at}"`.
  4. Directly modify an entry in the database (simulate tampering) -- change `description` of entry 3.
  5. Recompute the hash chain. Verify entry 3's hash no longer matches, AND all subsequent entries' hashes are invalid.
  6. Verify there is NO API endpoint or background job that validates the chain integrity.
  7. Verify whether the evidence chain can be verified externally (e.g., by auditors).
- **Expected Result**: Hash chain detects tampering. However, there is no automated verification -- tampering detection relies on manual audit.
- **Failure Impact**: Evidence binders used in legal proceedings. Undetected tampering undermines legal defensibility. Attackers could modify evidence without detection if no verification job exists.
- **Automation**: API Test

### SCENARIO-025: Org admin accessing HQ-only endpoints
- **Category**: Security
- **Priority**: P1
- **Preconditions**: Org admin JWT. HQ admin endpoints identified.
- **Steps**:
  1. Authenticate as an org admin.
  2. Attempt to access HQ overview: `GET /hq/overview` (frontend route -- verify middleware).
  3. Attempt to access HQ finance: `GET /v1/payments/pending` (API endpoint with HQ-only access).
  4. Attempt to access queue management: `GET /v1/trips/queue` or similar analyst endpoints.
  5. Attempt to access feature flags: `GET /hq/flags`.
  6. Attempt to access policy editor: `GET /hq/policies`.
  7. Attempt to call `require_admin` endpoints that allow `hq_admin` but not `org_admin`.
  8. Verify that `require_admin = require_role("org_admin", "hq_admin", "hq_supervisor")` includes `org_admin` -- this means org admins have the SAME access as HQ admins for these endpoints.
- **Expected Result**: Org admins should NOT have the same access as HQ admins. The `require_admin` shortcut at line 135 of `security.py` groups them together -- this is likely a bug.
- **Failure Impact**: Org admins can access other organizations' data through admin endpoints. Cross-tenant data leakage via privilege confusion.
- **Automation**: API Test

---

<a id="safety-critical"></a>
## 3. Safety-Critical Scenarios

### SCENARIO-026: Emergency push notification delivery during active trip
- **Category**: Safety-Critical
- **Priority**: P0
- **Preconditions**: Active trip with 50 participants. All have registered push tokens. Expo Push API reachable.
- **Steps**:
  1. Trigger an emergency notification via `send_emergency_notification(trip_id, ...)`.
  2. Verify the NotificationService queries `push_tokens` table for all trip participants.
  3. Verify messages batched correctly (50 < BATCH_SIZE of 100, so 1 batch).
  4. Verify priority set to `"high"` and channel set to `"emergency"`.
  5. Verify Expo Push API receives the batch and returns tickets.
  6. Measure end-to-end latency from API call to Expo API response.
  7. Simulate 5 tokens returning `DeviceNotRegistered`. Verify they are deactivated.
  8. Verify the 45 successful notifications are delivered (check Expo receipts).
  9. Now simulate Expo Push API returning 500. Verify the failure is logged but does NOT crash the caller.
  10. Verify there is NO retry mechanism for failed push notifications.
- **Expected Result**: Emergency notifications delivered within 5 seconds. Failed tokens deactivated. However, NO retry on failure is a safety gap.
- **Failure Impact**: LIFE SAFETY. During an emergency (natural disaster, security incident, medical emergency), travelers do not receive critical safety instructions. With push notifications currently reported as non-functional, this is a showstopper.
- **Automation**: API Test

### SCENARIO-027: SOS button activation and escalation chain
- **Category**: Safety-Critical
- **Priority**: P0
- **Preconditions**: Traveler mobile app with SOS feature. Active trip context.
- **Steps**:
  1. Search the codebase for an SOS button implementation.
  2. Search for endpoint: `POST /v1/trips/{tripId}/sos` or similar emergency trigger.
  3. Search for any emergency escalation chain (traveler -> chaperone -> org admin -> HQ).
  4. If SOS button exists, activate it and verify: (a) notification sent to chaperone, (b) location shared, (c) escalation timer starts, (d) HQ alerted if no response within threshold.
  5. If SOS button does NOT exist, document this as a critical safety gap.
  6. Verify whether the local emergency number is accessible from the app (useEmergencyNumber hook).
  7. Verify the TripLeaderCard component shows emergency contact information.
- **Expected Result**: Given context notes "no SOS button," this will confirm the gap. Emergency number and trip leader contact should be accessible as a fallback.
- **Failure Impact**: LIFE SAFETY. A minor in distress has no panic-button mechanism to alert chaperones or emergency services. For a platform protecting K-12 travelers, this is an unacceptable gap.
- **Automation**: Manual + Detox

### SCENARIO-028: Muster (headcount) command with geofence verification
- **Category**: Safety-Critical
- **Priority**: P0
- **Preconditions**: Active trip with rally point approved and activated. Geofences configured. Participants have location tracking enabled.
- **Steps**:
  1. Initiate a muster via `POST /v1/protection/trips/{tripId}/musters` with a rally point.
  2. Verify `send_muster_notification()` sends high-priority push to ALL trip participants.
  3. Verify muster record created in database with `status: open`.
  4. Simulate travelers checking in via `POST /v1/protection/trips/{tripId}/checkins`.
  5. Verify check-in location validated against rally point geofence (PostGIS geometry).
  6. Verify headcount increments correctly.
  7. Simulate a traveler checking in from OUTSIDE the geofence radius. Verify it is flagged.
  8. Verify muster notes can be added (e.g., "2 travelers en route").
  9. Close the muster. Verify final headcount and any missing participants flagged.
  10. Verify the entire muster flow works when push notifications fail (fallback to SMS?).
- **Expected Result**: Muster command reaches all participants. Check-ins tracked with location validation. Missing participants identified.
- **Failure Impact**: During evacuation or security incident, headcount cannot be completed. Missing travelers not identified. Search and rescue delayed.
- **Automation**: API Test

### SCENARIO-029: Geofence boundary violation alert for minor traveler
- **Category**: Safety-Critical
- **Priority**: P0
- **Preconditions**: Active trip with geofences configured around approved venues. Minor traveler has location tracking enabled.
- **Steps**:
  1. Verify geofences synced from rally points and lodging via `sync_rally_point_geofence()`.
  2. Simulate a minor traveler's location update INSIDE the geofence. Verify no alert.
  3. Simulate the same traveler's location update OUTSIDE the geofence (boundary violation).
  4. Verify `send_geofence_alert()` triggers with `is_violation: True`.
  5. Verify notification sent to chaperones and guardians ONLY (not the traveler themselves).
  6. Verify notification includes: traveler name, geofence name, direction ("exited").
  7. Verify `protection_events` audit log captures the violation event.
  8. Simulate rapid location bouncing near the geofence boundary. Verify no notification storm (debouncing).
  9. Verify geofence alerts work when the traveler's phone is in background mode (expo-task-manager).
- **Expected Result**: Violation detected and alerted to responsible adults within 30 seconds. Audit trail maintained.
- **Failure Impact**: Minor leaves designated safe zone undetected. If abduction or wandering occurs, response delayed. Legal liability for SafeTrekr and the organization.
- **Automation**: API Test + Detox

### SCENARIO-030: Rally point and safe house approval workflow
- **Category**: Safety-Critical
- **Priority**: P1
- **Preconditions**: Trip with proposed rally points and safe houses. Analyst assigned.
- **Steps**:
  1. Org admin creates rally points via `POST /v1/protection/trips/{tripId}/rally-points`.
  2. Verify rally point created with `status: pending` (requires approval).
  3. Analyst reviews the rally point (location, accessibility, safety assessment).
  4. Analyst approves via `POST /v1/protection/trips/{tripId}/rally-points/{id}/approve`.
  5. Verify `status` transitions to `approved`. Verify geofence auto-created via `sync_rally_point_geofence()`.
  6. Repeat for safe houses. Verify `SafeHouseType` (embassy, hospital, hotel, etc.) is correctly set.
  7. Attempt to activate an unapproved rally point. Verify it is rejected.
  8. Attempt to approve a rally point as an org_admin (not analyst). Verify RBAC enforcement.
  9. Verify TarvaRI AI suggestions endpoint is available for safety recommendations.
- **Expected Result**: Rally points require analyst approval before activation. Geofences auto-created on approval. RBAC enforced.
- **Failure Impact**: Unsafe rally points activated without expert review. In an emergency, travelers directed to unsuitable or dangerous locations.
- **Automation**: API Test

### SCENARIO-031: Alert creation, acknowledgment, and resolution lifecycle
- **Category**: Safety-Critical
- **Priority**: P1
- **Preconditions**: Active trip. Alert-capable user (analyst or admin).
- **Steps**:
  1. Create an alert via `POST /v1/alerts` with severity `critical` and category `security`.
  2. Verify alert persisted with correct severity and trip association.
  3. Verify notification sent to relevant stakeholders.
  4. As a different user, acknowledge the alert.
  5. Verify alert status transitions to `acknowledged`.
  6. Add resolution notes and resolve the alert.
  7. Verify alert status transitions to `resolved` with resolution timestamp.
  8. Verify `can_access_alert()` enforces org-level access (Org A admin cannot see Org B alerts).
  9. Create alerts of all severity levels (critical, high, medium, low) and all categories (weather, security, health, transport, other).
  10. Verify mobile app AlertsList and AlertDetailSheet components render all alert types.
- **Expected Result**: Full alert lifecycle functional. Access controls enforced. Mobile rendering correct for all types.
- **Failure Impact**: Safety alerts not delivered or tracked. Critical safety information lost. No audit trail of alert handling.
- **Automation**: API Test + Detox

### SCENARIO-032: Direct group wizard for safety team formation
- **Category**: Safety-Critical
- **Priority**: P1
- **Preconditions**: Trip with 20+ participants. Chaperone logged into mobile app.
- **Steps**:
  1. Navigate to the DirectGroupWizard component from the safety page.
  2. Create safety groups (buddy system / direct groups).
  3. Assign participants to groups, ensuring each group has at least one adult chaperone.
  4. Verify group assignments persist to the database.
  5. Attempt to create a group with only minor travelers (no chaperone). Verify validation prevents this.
  6. Verify group changes trigger notifications to affected participants.
  7. Verify groups are visible on the TravelerTodayView and ChaperoneTodayView.
  8. Edit a group (move a participant). Verify real-time update.
- **Expected Result**: Safety groups created with mandatory chaperone requirement. Changes persisted and visible to all affected users.
- **Failure Impact**: Minors grouped without adult supervision. Buddy system not enforced. Safety degradation.
- **Automation**: Detox

### SCENARIO-033: Emergency preparedness readiness check
- **Category**: Safety-Critical
- **Priority**: P1
- **Preconditions**: Trip in review phase. Emergency preparedness data entered.
- **Steps**:
  1. Navigate to emergency preparedness section (both analyst review and client trip detail).
  2. Verify all required fields populated: local emergency numbers, hospital locations, embassy contacts, emergency protocols.
  3. Verify `useEmergencyInfo` and `useEmergencyPreparedness` hooks return valid data.
  4. Trigger the emergency preparedness audit endpoint at `/v1/trips/{tripId}/emergency-prep-audit`.
  5. Verify audit identifies gaps (missing hospital address, no evacuation plan, etc.).
  6. Verify mobile `useEmergencyNumber` hook returns the correct local emergency number for the trip destination.
  7. Test with a trip to a country where emergency numbers differ (e.g., Japan: 110/119 vs US: 911).
- **Expected Result**: Emergency preparedness audit catches all gaps. Correct emergency numbers displayed for trip destination.
- **Failure Impact**: Trip approved without complete emergency preparedness. In crisis, responders don't know local emergency numbers or hospital locations.
- **Automation**: API Test + Detox

---

<a id="integration"></a>
## 4. Integration Scenarios

### SCENARIO-034: TarvaRI intelligence pipeline end-to-end (currently dormant)
- **Category**: Integration
- **Priority**: P1
- **Preconditions**: TarvaRI backend running on port 8000. Core API configured with `TARVARI_BASE_URL`.
- **Steps**:
  1. Verify TarvaRI backend is reachable from Core API via `settings.TARVARI_BASE_URL`.
  2. Create a trip to a destination with known intelligence alerts (e.g., US State Department travel advisories).
  3. Trigger intelligence fetch for the trip destination and date range.
  4. Query the `intel_alerts` or equivalent table. Verify 0 rows (currently dormant pipeline).
  5. Verify the analyst intel-alerts review page at `/analyst/trip-review/[tripId]/intel-alerts` handles empty state gracefully.
  6. Verify the HQ intel pages (intel-config, intel-metrics, intel-policies, intel-sources, intel-triage) load without errors.
  7. If TarvaRI is unreachable, verify Core API does NOT crash (graceful degradation).
  8. Verify no blocking calls to TarvaRI in the trip creation or review critical path.
- **Expected Result**: TarvaRI pipeline dormant (0 rows flowing as documented). UI handles empty state. Core API degrades gracefully when TarvaRI unreachable.
- **Failure Impact**: No intelligence data for trip safety assessment. Analysts review trips without threat context. However, since pipeline is dormant, this is a known limitation.
- **Automation**: API Test + Playwright

### SCENARIO-035: Stripe payment initiation, webhook processing, and reconciliation
- **Category**: Integration
- **Priority**: P0
- **Preconditions**: Stripe test mode configured. Trip with computed pricing.
- **Steps**:
  1. Initiate payment via `POST /v1/trips/{tripId}/payments/initiate` with `payment_method: card`.
  2. Verify Stripe PaymentIntent created and `stripe_client_secret` returned.
  3. Complete payment on frontend using Stripe Elements with test card.
  4. Verify Stripe webhook fires to `POST /v1/webhooks/stripe` (or equivalent).
  5. Verify webhook signature validation using Stripe signing secret.
  6. Verify payment status updates in database: `pending` -> `succeeded`.
  7. Verify trip status transitions: `pending_payment` -> `pending_review`.
  8. Test with declining card (4000 0000 0000 0002). Verify `payment_failed` status.
  9. Test with manual payment methods (check, wire, ach). Verify HQ manual confirmation flow.
  10. Test webhook replay protection (send same webhook twice). Verify idempotent handling.
  11. Test with a forged webhook (invalid signature). Verify rejection.
- **Expected Result**: Full payment lifecycle functional. Webhook signatures validated. Idempotent processing. Manual payment path works.
- **Failure Impact**: Revenue not collected. Trips stuck in `pending_payment`. Manual payments not reconciled.
- **Automation**: API Test

### SCENARIO-036: SendGrid email delivery with bounce/spam handling
- **Category**: Integration
- **Priority**: P1
- **Preconditions**: SendGrid configured (sandbox mode or test environment).
- **Steps**:
  1. Send a test invite email via the invite flow.
  2. Verify email constructed with correct template and dynamic data.
  3. Verify `send_html_email()` uses async thread pool offloading.
  4. Verify retry logic (3 attempts with exponential backoff).
  5. Simulate a bounce event via SendGrid webhook. Verify suppression record created.
  6. Attempt to send another invite to the bounced email. Verify `check_suppression()` blocks it.
  7. Simulate a spam complaint event. Verify suppression with reason `spam_complaint`.
  8. Verify invite analytics endpoint reflects delivery metrics.
  9. Test with `SENDGRID_SANDBOX_MODE=true`. Verify no actual emails sent but flow completes.
  10. Verify comms_log records created for each send attempt.
- **Expected Result**: Email delivery tracked end-to-end. Bounces/spam create suppressions. Analytics accurate.
- **Failure Impact**: Invite emails never delivered. Travelers cannot join trips. Known historical issue where `send_attempt_count: 0` due to exception handling bug.
- **Automation**: API Test

### SCENARIO-037: Expo Push token registration and lifecycle
- **Category**: Integration
- **Priority**: P1
- **Preconditions**: Mobile app running on device with push notification permissions granted.
- **Steps**:
  1. On app launch, verify `NotificationProvider` requests notification permissions.
  2. Verify Expo push token obtained and stored in `push_tokens` table with `is_active: true`.
  3. Verify token associated with correct `user_id`.
  4. Force a token rotation (reinstall app or clear data). Verify old token deactivated.
  5. Send a push notification to the user. Verify delivery.
  6. Revoke notification permissions on the device. Send another notification.
  7. Verify `DeviceNotRegistered` error triggers `_deactivate_tokens()`.
  8. Verify `last_used_at` updated after successful send.
  9. Test with no tokens registered for user. Verify `send_to_user()` returns gracefully with 0 tokens.
  10. Verify notification channels configured correctly: `emergency`, `geofence`, `schedule`.
- **Expected Result**: Push token lifecycle managed correctly. Invalid tokens deactivated. Channels properly configured.
- **Failure Impact**: Push notifications fail silently. Emergency alerts never reach devices.
- **Automation**: Detox + API Test

### SCENARIO-038: Background check integration status tracking
- **Category**: Integration
- **Priority**: P1
- **Preconditions**: Trip with adult participants (chaperones) requiring background checks.
- **Steps**:
  1. Navigate to background checks page for a trip.
  2. Verify background check requirements identified for adult participants.
  3. Initiate background check request.
  4. Verify status tracking (pending, in_progress, completed, failed).
  5. Verify analyst review section for background checks loads status correctly.
  6. Verify trip cannot be approved if required background checks are incomplete.
  7. Verify background check results are NOT visible to travelers (only to admins/analysts).
  8. Test with expired background check (e.g., older than 2 years). Verify flagged for renewal.
- **Expected Result**: Background check status tracked. Trip approval gated on completion. Results access-controlled.
- **Failure Impact**: Unapproved adults supervising minors without background verification. Legal and safety liability.
- **Automation**: Playwright + API Test

### SCENARIO-039: Guardian consent and override workflow
- **Category**: Integration
- **Priority**: P1
- **Preconditions**: Trip with minor travelers and assigned guardians.
- **Steps**:
  1. Verify guardians assigned to travelers via `POST /v1/trips/{tripId}/guardian-assignments`.
  2. Verify guardian receives notification of trip and required consent actions.
  3. Guardian reviews trip details and provides consent.
  4. Verify consent recorded in database.
  5. Test guardian override endpoint at `/v1/guardian-overrides` -- guardian requests exception to a policy.
  6. Verify override requires analyst/admin approval.
  7. Test governance page at `/hq/guardian-governance` for HQ oversight.
  8. Verify a traveler CANNOT be fully confirmed without guardian consent for minors.
  9. Test with a guardian who declines consent. Verify the minor is flagged and cannot participate.
- **Expected Result**: Guardian consent workflow enforced for minors. Overrides require approval. Governance visible to HQ.
- **Failure Impact**: Minors traveling without parental consent. Legal liability. COPPA/FERPA violation.
- **Automation**: API Test + Playwright

### SCENARIO-040: Supabase PostgREST vs. Core API data consistency
- **Category**: Integration
- **Priority**: P1
- **Preconditions**: Both data access paths active (frontend uses Supabase PostgREST directly for some operations and Core API for others).
- **Steps**:
  1. Identify operations that go through Supabase PostgREST directly (organization mutations, some reads).
  2. Identify operations that go through Core API (trips, invites, protection, payments).
  3. Create an organization via Core API. Read it via PostgREST. Verify data consistency.
  4. Update organization `settings` JSONB via PostgREST (suspend operation). Read via Core API. Verify consistency.
  5. Create a trip via Core API. Read trip participants via PostgREST. Verify FK integrity.
  6. Verify cache invalidation: after a PostgREST update, does the Core API cache (Redis) still serve stale data?
  7. Simulate a race condition: update via PostgREST and Core API simultaneously.
- **Expected Result**: Data consistent across both access paths. Cache eventually consistent (within TTL). Race conditions handled gracefully.
- **Failure Impact**: Frontend shows stale or inconsistent data. User confusion. Data integrity issues.
- **Automation**: API Test

---

<a id="data-integrity"></a>
## 5. Data Integrity Scenarios

### SCENARIO-041: Concurrent trip finalize requests (double-submit)
- **Category**: Data Integrity
- **Priority**: P0
- **Preconditions**: Trip in draft state. Two browser tabs open on review page.
- **Steps**:
  1. Open the trip review page in two browser tabs simultaneously.
  2. Click "Finalize and Pay" in both tabs within 1 second of each other.
  3. Both requests hit `POST /v1/trips/finalize` nearly simultaneously.
  4. Verify only ONE finalize succeeds. The second should fail with a conflict or idempotency check.
  5. Check the database for duplicate `trip_participants`, `trip_flights`, `trip_lodging` records.
  6. Check for duplicate invite records and double-sent emails.
  7. Check for duplicate payment intents in Stripe.
  8. Verify trip status does not get stuck in an inconsistent state.
- **Expected Result**: Idempotent finalization. No duplicate records. No duplicate payments. Second request fails gracefully.
- **Failure Impact**: Duplicate participants. Duplicate charges. Duplicate invite emails. Data corruption cascading through review process.
- **Automation**: API Test (concurrent requests)

### SCENARIO-042: Cascade delete behavior when organization is removed
- **Category**: Data Integrity
- **Priority**: P1
- **Preconditions**: Organization with multiple trips, users, participants, payments, evidence logs.
- **Steps**:
  1. Verify the organization has trips with full data (participants, flights, lodging, venues, events, invites, payments).
  2. Suspend the organization via settings JSONB update.
  3. Verify all related data still accessible (soft delete, not hard delete).
  4. Attempt hard deletion of the organization.
  5. Verify cascade behavior: do FK constraints prevent deletion if child records exist?
  6. Verify whether evidence logs are preserved (legal requirement) even after org deletion.
  7. Verify whether payment records are preserved (PCI compliance).
  8. Verify user records are handled correctly (users may belong to multiple orgs or future orgs).
  9. Check for orphaned records in join tables.
- **Expected Result**: Soft delete preferred. Hard delete blocked by FK constraints or cascades correctly. Evidence and payment records preserved.
- **Failure Impact**: Orphaned records. Lost evidence. PCI compliance violation if payment records deleted. COPPA violation if minor data not properly handled.
- **Automation**: API Test

### SCENARIO-043: Evidence hash chain integrity under concurrent writes
- **Category**: Data Integrity
- **Priority**: P1
- **Preconditions**: Trip with existing evidence chain. Two analysts reviewing simultaneously.
- **Steps**:
  1. Analyst A and Analyst B both create evidence entries for the same trip at the same time.
  2. Both query the latest `event_hash` (the previous hash in the chain).
  3. Both compute their new hash using the same `prev_hash`.
  4. Both insert -- creating a FORK in the hash chain (two entries with the same `prev_hash`).
  5. Verify the chain now has a fork: entry N has hash H1, entry N+1a has hash based on H1, entry N+1b ALSO has hash based on H1.
  6. The next entry (N+2) will chain from whichever was inserted last, orphaning the other.
  7. Verify there is no database-level lock or serialization for evidence entries.
  8. Run the chain verification algorithm. Verify it detects the fork.
- **Expected Result**: Concurrent writes create a chain fork. There is likely NO protection against this race condition in the current implementation.
- **Failure Impact**: Evidence chain integrity compromised. Fork makes the chain unverifiable. Legal evidence inadmissible if chain integrity cannot be proven.
- **Automation**: API Test (concurrent requests)

### SCENARIO-044: Invite acceptance race condition
- **Category**: Data Integrity
- **Priority**: P1
- **Preconditions**: Valid invite token shared between two people (e.g., forwarded email).
- **Steps**:
  1. Person A and Person B both click the invite link simultaneously.
  2. Both call `POST /v1/auth/consume-invite` or `POST /v1/auth/register` with the same token.
  3. In `auth.py:register_with_invite()`, both pass the status check (`status in [pending, sent]`).
  4. Both create Supabase Auth users (different emails -- wait, the email comes from the invite, so same email).
  5. First request succeeds. Second request should fail at: (a) Supabase Auth 422 (email exists), or (b) `users` table unique constraint, or (c) invite status update `in_("status", [pending, sent])` returns empty (already accepted).
  6. Verify no partial state: user created but invite not marked as accepted.
  7. Verify the compensation logic (delete auth user on failure) fires correctly.
- **Expected Result**: Only one registration succeeds. The second fails cleanly at one of the guard points. No orphaned auth users.
- **Failure Impact**: Duplicate users. Invite marked as accepted but second user left in limbo. Orphaned Supabase Auth users.
- **Automation**: API Test (concurrent requests)

### SCENARIO-045: Trip data migration rollback after partial failure
- **Category**: Data Integrity
- **Priority**: P1
- **Preconditions**: Trip finalize endpoint that inserts into multiple tables without a database transaction.
- **Steps**:
  1. Start a trip finalize request.
  2. Verify `trips.py` inserts into tables sequentially: trips update, trip_flights, trip_lodging, trip_venues, itinerary_events, trip_participants, invites.
  3. Simulate a failure AFTER trip_flights and trip_lodging succeed but BEFORE trip_participants.
  4. Verify the trip is left in a partial state (some child data exists, participants missing).
  5. Verify there is NO rollback mechanism for the already-inserted flight and lodging records.
  6. Attempt to re-run finalize for the same trip. Verify it either: (a) fails with duplicate data, or (b) handles idempotently.
  7. Verify the `trips.py` god file (5,182 lines) uses individual try/except blocks that swallow errors rather than transaction-level rollback.
- **Expected Result**: Partial failure leaves data in inconsistent state. No transaction wrapping. Re-run likely creates duplicates.
- **Failure Impact**: Trips with partial data that cannot be fixed without manual database intervention. Customer-visible data corruption.
- **Automation**: API Test

### SCENARIO-046: User ID duality (auth.users.id vs public.users.id) data integrity
- **Category**: Data Integrity
- **Priority**: P0
- **Preconditions**: Users with both `auth_user_id` and `id` in the `users` table.
- **Steps**:
  1. Query `users` table for records where `auth_user_id IS NULL`.
  2. These users were likely created via the mobile invite flow without going through Supabase Auth.
  3. Verify these users can still authenticate (via `id` fallback in `get_current_user()`).
  4. Check for records where `auth_user_id` points to a deleted Supabase Auth user.
  5. Attempt Supabase Auth session refresh for a user whose auth record was deleted. Verify graceful failure.
  6. Verify that `analyst_id` in checklist progress and comments uses `public.users.id` (not `auth.users.id`).
  7. Verify that any `created_by` columns consistently use the same ID type.
  8. Query for FK violations where a user_id column references the wrong ID type.
- **Expected Result**: All `user_id` references consistently use `public.users.id`. `auth_user_id` is only used for auth token resolution.
- **Failure Impact**: Queries return wrong user data. Audit trails point to wrong people. RBAC decisions made on wrong user identity.
- **Automation**: API Test + SQL verification

### SCENARIO-047: Cache poisoning via stale data after mutation
- **Category**: Data Integrity
- **Priority**: P1
- **Preconditions**: Redis cache active. Trip data cached.
- **Steps**:
  1. Load a trip via `GET /v1/trips/{tripId}`. Verify data cached with TTL 300s.
  2. Update the trip title directly via Supabase PostgREST (bypassing Core API).
  3. Immediately re-read via `GET /v1/trips/{tripId}`. Verify STALE data returned from cache.
  4. Wait for cache TTL to expire. Verify fresh data returned.
  5. Now update via Core API `PUT /v1/trips/{tripId}`. Verify cache invalidated.
  6. Verify pattern invalidation: after trip update, does `cache.invalidate_pattern("trips:*")` clear all related caches?
  7. Verify participant list cache is invalidated when a new participant is added.
  8. Verify location cache is invalidated when a venue is updated.
  9. Test with Redis down: verify mutations still succeed (cache write failures logged but not fatal).
- **Expected Result**: Core API mutations invalidate cache. PostgREST mutations create stale cache windows (up to TTL). Redis failure doesn't block mutations.
- **Failure Impact**: Users see stale data for up to 5 minutes after PostgREST mutations. Trip review decisions based on outdated information.
- **Automation**: API Test

### SCENARIO-048: Passport document upload data handling (HIPAA/PII)
- **Category**: Data Integrity
- **Priority**: P1
- **Preconditions**: Traveler with passport upload enabled. Supabase Storage bucket configured.
- **Steps**:
  1. Navigate to passport upload flow (PassportUploadFlow component).
  2. Upload a passport image (JPEG/PNG).
  3. Verify image stored in Supabase Storage with appropriate bucket policies.
  4. Verify metadata stored (user_id, trip_id, upload timestamp) without exposing passport details in plaintext.
  5. Verify access control: only the traveler, their guardian, chaperone, and analyst can view the passport.
  6. Attempt to access another traveler's passport document via direct URL manipulation.
  7. Verify signed URLs used (not public URLs) with appropriate expiry.
  8. Verify passport data not cached in Redis or browser cache.
  9. For minor travelers, verify guardian authorization required before upload.
  10. Test with oversize image (50MB). Verify upload rejected with size limit error.
- **Expected Result**: Passport stored securely. Access controlled. Signed URLs with expiry. Size limits enforced.
- **Failure Impact**: Passport PII (photo, DOB, nationality, passport number) exposed. HIPAA/PII violation. Identity theft risk.
- **Automation**: Detox + API Test

---

<a id="edge-cases"></a>
## 6. Edge Case Scenarios

### SCENARIO-049: Mobile app offline mode with request queuing
- **Category**: Edge Case
- **Priority**: P1
- **Preconditions**: Traveler on active trip with mobile app. Network connectivity available initially.
- **Steps**:
  1. Open the app and verify trip data loads successfully.
  2. Enable airplane mode (simulate complete network loss).
  3. Verify the `OfflineProvider` detects network loss via `@react-native-community/netinfo`.
  4. Navigate through the app. Verify cached data still displays (TanStack Query offline).
  5. Attempt to check in at a rally point. Verify request queued in `expo-sqlite` offline queue.
  6. Attempt to submit a form (e.g., onboarding step). Verify queued.
  7. Re-enable network connectivity.
  8. Verify `syncQueue()` replays queued requests in order.
  9. Verify no duplicate requests sent on reconnect.
  10. Verify conflict resolution: if server data changed while offline, which wins?
  11. Test with intermittent connectivity (airplane mode toggled rapidly).
- **Expected Result**: App remains usable offline with cached data. Mutations queued. Queue synced on reconnect without duplicates.
- **Failure Impact**: App unusable without connectivity (common in international travel). Safety-critical check-ins lost.
- **Automation**: Detox

### SCENARIO-050: JWT session expiry during active mobile use
- **Category**: Edge Case
- **Priority**: P1
- **Preconditions**: Traveler logged into mobile app. Access token has 1-hour expiry.
- **Steps**:
  1. Log in and capture token expiry time.
  2. Use the app for 50 minutes without refreshing.
  3. At 59 minutes, make an API request. Verify it succeeds.
  4. At 61 minutes, make an API request. Verify 401 returned.
  5. Verify `apiClient.ts` intercepts the 401 and calls `onTokenExpired()` callback.
  6. Verify refresh token flow: `POST /v1/auth/refresh` with the refresh token.
  7. Verify new access token transparently replaces the old one in `expo-secure-store`.
  8. Verify the original request is retried with the new token.
  9. Test with expired refresh token (after 30 days). Verify `onAuthFailure()` redirects to login.
  10. Test rapid-fire requests during token refresh (race condition). Verify only ONE refresh request sent.
- **Expected Result**: Transparent token refresh. User never sees auth errors during normal use. Expired refresh forces re-login.
- **Failure Impact**: Users constantly logged out during trips. Known historical issue with Zustand/Supabase session desync on web.
- **Automation**: Detox + API Test

### SCENARIO-051: Trip with 500 participants (scale limit)
- **Category**: Edge Case
- **Priority**: P2
- **Preconditions**: Large organization (mega church, school district).
- **Steps**:
  1. Create a trip and add 500 participants via batch invite.
  2. Verify `POST /v1/trips/{tripId}/invites/batch` handles the batch.
  3. Verify invite emails sent in batches (not 500 individual API calls).
  4. Verify trip participant list loads without timeout (`GET /v1/trips/{tripId}/participants`).
  5. Trigger a muster notification for all 500 participants. Verify Expo batching (5 batches of 100).
  6. Verify participant list rendering in both web (Playwright) and mobile (Detox) doesn't OOM.
  7. Verify schedule view with 500 participants shows correctly.
  8. Verify SMS broadcast to 500 recipients.
  9. Measure API response times for list endpoints with 500 records.
- **Expected Result**: System handles 500 participants without degradation. Batching prevents timeouts. Lists paginated.
- **Failure Impact**: Large organizations cannot use the platform. Revenue loss from enterprise customers.
- **Automation**: Load Test + API Test

### SCENARIO-052: Timezone handling across international trip dates
- **Category**: Edge Case
- **Priority**: P1
- **Preconditions**: Trip crossing multiple timezones (e.g., NYC to Tokyo).
- **Steps**:
  1. Create a trip departing NYC (UTC-5) arriving Tokyo (UTC+9).
  2. Enter departure time in local NYC time and arrival in local Tokyo time.
  3. Verify `datetime.utcnow()` vs timezone-aware timestamps throughout the codebase.
  4. Note: `auth.py` uses `datetime.utcnow()` (line 76, 88, 99, 109) which is timezone-naive. Verify this doesn't cause issues with `exp` claim validation.
  5. Verify schedule view displays events in the correct local timezone.
  6. Verify flight times display in departure and arrival local times.
  7. Verify muster notification timestamp matches the trip destination timezone.
  8. Test with a trip crossing the International Date Line.
  9. Test with DST transition during the trip.
- **Expected Result**: All times displayed in appropriate local timezone. UTC used for storage. No timezone-naive datetime comparison bugs.
- **Failure Impact**: Travelers miss flights due to wrong times. Musters scheduled at wrong times. Schedule confusion.
- **Automation**: API Test + Detox

### SCENARIO-053: Deep link handling when app is not installed
- **Category**: Edge Case
- **Priority**: P2
- **Preconditions**: Invite email sent to a user who has NOT installed the mobile app.
- **Steps**:
  1. Click the mobile deep link (`safetrekr://invite?token=xxx`) on a device without the app.
  2. Verify the link either: (a) redirects to app store, or (b) falls back to web URL.
  3. Click the web URL (`{INVITE_BASE_URL}/invite?token=xxx`) on the same device.
  4. Verify the web flow works as a fallback.
  5. Install the app. Click the invite link again. Verify deep link opens the app.
  6. Verify the token from the URL is correctly passed to the `/join` page.
  7. Test with expired token in the deep link. Verify appropriate error message.
  8. Test with malformed token in the deep link. Verify no crash.
- **Expected Result**: Graceful fallback to web when app not installed. Deep link works correctly when app is installed.
- **Failure Impact**: Users unable to accept invites if they don't have the app installed. Onboarding drop-off.
- **Automation**: Manual + Detox

### SCENARIO-054: API client demo mode bypass
- **Category**: Edge Case
- **Priority**: P2
- **Preconditions**: `EXPO_PUBLIC_DEMO_MODE=true` configured in mobile app.
- **Steps**:
  1. Enable demo mode in the mobile app.
  2. Verify all API calls return mock data instead of hitting the real API.
  3. Verify demo mode cannot be enabled in production builds.
  4. Verify demo mode mock data does not contain real PII.
  5. Attempt to bypass demo mode by directly calling the API (e.g., via curl from the device).
  6. Verify demo mode flag is checked at the `ApiClient` level, not just UI level.
  7. Toggle demo mode off. Verify real API calls resume.
- **Expected Result**: Demo mode fully isolated. No real data exposed. Cannot be enabled in production.
- **Failure Impact**: Demo mode accidentally enabled in production exposes mock data instead of real trip information. Alternatively, demo mode inadvertently hitting real API.
- **Automation**: Detox

### SCENARIO-055: Malformed request body fuzzing on Core API
- **Category**: Edge Case
- **Priority**: P1
- **Preconditions**: Authenticated user with valid JWT.
- **Steps**:
  1. Send `POST /v1/trips/finalize` with missing required fields. Verify 422.
  2. Send the same endpoint with extra unexpected fields. Verify they are ignored (Pydantic strict mode check).
  3. Send with string values where integers expected (`"amount": "not_a_number"`). Verify 422.
  4. Send with extremely long strings (100KB in a `name` field). Verify truncation or rejection.
  5. Send with unicode injection (`name: "\u0000\uFFFF"`). Verify no database errors.
  6. Send with SQL injection in string fields (`name: "'; DROP TABLE trips; --"`). Verify parameterized queries prevent injection.
  7. Send with nested JSON depth > 50 levels. Verify rejection.
  8. Send with `Content-Type: application/xml` instead of JSON. Verify rejection.
  9. Send empty body `{}`. Verify appropriate validation error.
  10. Send `null` for required fields. Verify 422 with field-specific error messages.
- **Expected Result**: Pydantic validation catches all malformed inputs with clear 422 error messages. No 500 errors. No SQL injection.
- **Failure Impact**: Unhandled input crashes the API. SQL injection compromises the database. XSS via stored malicious strings.
- **Automation**: API Test

### SCENARIO-056: Rapid role switching (user with multiple roles across trips)
- **Category**: Edge Case
- **Priority**: P2
- **Preconditions**: User who is a traveler on Trip A and a chaperone on Trip B.
- **Steps**:
  1. Log in via mobile app. Verify active trip is detected (most recent active).
  2. JWT issued with role from the active trip.
  3. Switch to Trip B context. Verify role changes from traveler to chaperone.
  4. Verify new JWT issued with chaperone role and Trip B context.
  5. Verify tab navigation updates (chaperone gets Map tab instead of Packet tab).
  6. Switch rapidly between trips 10 times. Verify no stale role in JWT.
  7. Verify cached API responses invalidated when switching trip context.
  8. Verify location tracking settings change with role (chaperone tracks differently).
- **Expected Result**: Role correctly reflects current trip context. JWT claims updated on switch. UI adapts instantly.
- **Failure Impact**: User sees traveler UI while in chaperone role. Safety features unavailable. RBAC bypassed.
- **Automation**: Detox

---

<a id="accessibility"></a>
## 7. Accessibility Scenarios

### SCENARIO-057: Screen reader navigation through trip packet (mobile)
- **Category**: Accessibility
- **Priority**: P1
- **Preconditions**: iOS VoiceOver or Android TalkBack enabled. Traveler logged into mobile app on active trip.
- **Steps**:
  1. Enable VoiceOver/TalkBack.
  2. Navigate to trip home page. Verify all elements have accessible labels.
  3. Navigate to packet hub. Verify section titles announced.
  4. Enter each packet section (air travel, emergency, lodging, etc.).
  5. Verify data tables are navigable (row/column context announced).
  6. Verify interactive elements (buttons, links) have descriptive labels.
  7. Navigate to schedule. Verify date and time announced in accessible format.
  8. Navigate to settings. Verify all toggles and form fields labeled.
  9. Test the emergency preparedness section -- critical for travelers with visual disabilities.
  10. Verify no content hidden from screen readers (e.g., icons without text alternatives).
- **Expected Result**: All content navigable via screen reader. No unlabeled interactive elements. Time/date in accessible format.
- **Failure Impact**: Visually impaired travelers cannot access critical trip and safety information. ADA/Section 508 compliance failure.
- **Automation**: Manual (with accessibility audit tools)

### SCENARIO-058: Keyboard navigation through analyst review portal (web)
- **Category**: Accessibility
- **Priority**: P1
- **Preconditions**: Analyst logged into web portal. Keyboard only (no mouse).
- **Steps**:
  1. Navigate to analyst dashboard using Tab key.
  2. Verify focus order is logical (top-to-bottom, left-to-right).
  3. Navigate to trip queue. Select a trip using Enter key.
  4. Navigate through all 17 review sections using Tab/Shift-Tab.
  5. Verify sidebar navigation accessible via keyboard.
  6. Open a modal (e.g., issue creation). Verify focus trapped inside modal.
  7. Close modal with Escape key. Verify focus returns to trigger element.
  8. Fill out the issue form using keyboard. Submit with Enter.
  9. Navigate to approval page. Approve trip using keyboard only.
  10. Verify skip-navigation link present for bypassing repetitive navigation.
- **Expected Result**: Complete analyst workflow achievable via keyboard. Focus management correct. Skip links present.
- **Failure Impact**: Analysts with motor disabilities cannot perform trip reviews. Workflow bottleneck.
- **Automation**: Playwright (keyboard-only mode)

### SCENARIO-059: Color contrast for safety-critical alerts
- **Category**: Accessibility
- **Priority**: P1
- **Preconditions**: Alert components rendered in both web and mobile.
- **Steps**:
  1. Render AlertCard component with all severity levels (critical, high, medium, low).
  2. Measure text-to-background contrast ratio for each severity level.
  3. Verify minimum 4.5:1 contrast ratio for normal text (WCAG AA).
  4. Verify minimum 3:1 contrast ratio for large text (WCAG AA).
  5. Verify alert icons have sufficient contrast or text alternatives.
  6. Test with iOS/Android high contrast mode enabled.
  7. Test with iOS/Android reduced motion enabled (verify no animation-only indicators).
  8. Verify color is NOT the only means of conveying severity (icons/text also used).
  9. Test emergency notification banner contrast.
  10. Test rally point status indicators (approved/pending/rejected) for color-blind users.
- **Expected Result**: All safety-critical UI meets WCAG AA contrast. Severity conveyed through multiple channels (color + icon + text).
- **Failure Impact**: Safety alerts not perceivable by users with visual impairments or color blindness. Critical information missed.
- **Automation**: Manual + automated contrast checker

### SCENARIO-060: Dynamic text scaling on mobile (large font support)
- **Category**: Accessibility
- **Priority**: P2
- **Preconditions**: Mobile app on device with accessibility text scaling enabled (200%).
- **Steps**:
  1. Set iOS Dynamic Type or Android font scale to maximum (200%).
  2. Open the mobile app and navigate through all screens.
  3. Verify no text truncation without ellipsis indicator.
  4. Verify no overlapping text elements.
  5. Verify buttons remain tappable (minimum 44x44pt touch target).
  6. Verify schedule view remains usable with large text.
  7. Verify emergency information remains fully readable.
  8. Verify packet sections do not break layout.
  9. Test with horizontal scroll if needed (verify no loss of context).
  10. Verify the AlertDetailSheet bottom sheet remains usable.
- **Expected Result**: App remains fully functional at 200% text scale. No content hidden or overlapping.
- **Failure Impact**: Users with visual impairments unable to read trip or safety information on mobile.
- **Automation**: Detox + Manual

---

<a id="performance"></a>
## 8. Performance Scenarios

### SCENARIO-061: trips.py god file response time under load
- **Category**: Performance
- **Priority**: P1
- **Preconditions**: Core API deployed. 50 concurrent users simulated.
- **Steps**:
  1. Identify the most expensive endpoints in `trips.py` (5,182 lines): finalize, list with joins, participant list.
  2. Run `GET /v1/trips` for a user with 20 trips and full participant data. Measure p50/p95/p99 latency.
  3. Run `GET /v1/trips/{id}` with all joined data (flights, lodging, venues, events). Measure latency.
  4. Run `POST /v1/trips/finalize` with a full trip (10 flights, 5 lodging, 8 venues, 30 events, 50 participants). Measure latency.
  5. Increase to 50 concurrent users all hitting `/v1/trips` simultaneously. Measure degradation.
  6. Verify the `TimingMiddleware` logs slow requests (> 1 second).
  7. Check for N+1 queries: does the trip list endpoint make separate DB calls per trip for participants?
  8. Verify `query_optimizer.py` utilities are actually used in hot paths.
  9. Verify Redis cache hit rate under load. Measure cache vs. database response times.
  10. Identify if the 5,182-line file causes import/parse overhead.
- **Expected Result**: p95 < 500ms for reads, p95 < 2s for finalize. Cache hit rate > 80%. N+1 queries eliminated.
- **Failure Impact**: Slow API responses cause frontend timeouts. Finalize timeout causes partial data insertion (see SCENARIO-045).
- **Automation**: Load Test

### SCENARIO-062: Supabase connection pool exhaustion
- **Category**: Performance
- **Priority**: P1
- **Preconditions**: Core API with default Supabase client configuration. High concurrent load.
- **Steps**:
  1. Note the `SupabaseClient` wrapper in `supabase.py` uses singleton pattern (one client instance).
  2. Verify the underlying httpx client connection pool settings.
  3. Simulate 200 concurrent API requests. Measure connection pool utilization.
  4. Verify whether requests queue when pool is exhausted or fail immediately.
  5. Monitor Supabase dashboard for connection count (free tier limit: 60 connections).
  6. Verify the `close()` method is called during application shutdown.
  7. Check if the singleton pattern causes issues with async context (FastAPI lifespan events).
  8. Verify connection reuse vs. new connection per request.
  9. Test with a burst of 500 requests in 10 seconds. Measure how many fail with connection errors.
  10. Verify the service client (RLS bypass) shares the connection pool or has its own.
- **Expected Result**: Connection pool sized appropriately for expected load. Graceful queuing on exhaustion. No connection leaks.
- **Failure Impact**: Database connection exhaustion under load. All API requests fail. Platform-wide outage.
- **Automation**: Load Test

### SCENARIO-063: Push notification batch performance for large trips
- **Category**: Performance
- **Priority**: P1
- **Preconditions**: Trip with 500 participants, each with 1-2 push tokens (500-1000 tokens total).
- **Steps**:
  1. Register 500+ push tokens across 500 users.
  2. Trigger `send_to_trip_participants()` for an emergency notification.
  3. Measure time to query all participant tokens from database.
  4. Verify batching: 500 tokens / 100 per batch = 5 sequential HTTP requests to Expo.
  5. Measure total end-to-end latency for all 5 batches.
  6. Verify Expo API doesn't rate-limit the batches.
  7. Verify the function handles partial batch failures (batch 3 fails, batches 4-5 still sent).
  8. Measure memory usage during batch processing.
  9. Verify `_deactivate_tokens()` handles bulk deactivation efficiently (currently loops one-by-one).
  10. Benchmark: compare sequential batching vs. parallel batching (current implementation is sequential via `for` loop).
- **Expected Result**: Emergency notification to 500 users completes within 15 seconds. Parallel batching would reduce to 3-5 seconds.
- **Failure Impact**: Emergency notifications delayed. In a real emergency, 15+ second delay could be dangerous.
- **Automation**: Load Test + API Test

### SCENARIO-064: Redis cache cold start and thundering herd
- **Category**: Performance
- **Priority**: P2
- **Preconditions**: Redis empty (cold start after deployment or Redis restart).
- **Steps**:
  1. Restart Redis (clear all cache).
  2. Simulate 100 users simultaneously requesting the same trip data.
  3. Verify all 100 requests hit the database (cache miss).
  4. Verify the database can handle 100 concurrent identical queries.
  5. After the first response caches, verify subsequent requests serve from cache.
  6. Check for cache stampede prevention (e.g., single-flight / request coalescing).
  7. Measure database load during thundering herd vs. steady-state with warm cache.
  8. Verify TTL values are appropriate (user=900s, org=3600s, trip=300s).
  9. Verify `cache.get()` handles Redis connection timeout gracefully (falls through to DB).
  10. Verify `cache.set()` failure doesn't crash the request.
- **Expected Result**: Thundering herd causes brief database spike but recovers quickly. No cache stampede protection in current implementation.
- **Failure Impact**: Redis restart or deployment causes database overload. Cascading failure.
- **Automation**: Load Test

### SCENARIO-065: Frontend bundle size and initial load time
- **Category**: Performance
- **Priority**: P2
- **Preconditions**: safetrekr-app-v2 (Next.js 15) production build.
- **Steps**:
  1. Build the Next.js app in production mode.
  2. Measure total JS bundle size (main + chunks).
  3. Measure initial page load time for the login page.
  4. Measure time-to-interactive for the analyst dashboard.
  5. Verify code splitting: trip detail pages loaded lazily.
  6. Verify image optimization (Next.js Image component).
  7. Measure Lighthouse performance score.
  8. Verify no large dependencies accidentally included in the client bundle.
  9. Test on simulated 3G connection. Measure time to first meaningful paint.
  10. Verify API calls don't waterfall (parallel fetching where possible).
- **Expected Result**: Lighthouse performance > 80. Bundle size < 500KB initial. TTI < 3s on broadband.
- **Failure Impact**: Slow loading frustrates admins and analysts. Abandoned workflows.
- **Automation**: Playwright + Lighthouse

### SCENARIO-066: Mobile app startup time with stale auth state
- **Category**: Performance
- **Priority**: P2
- **Preconditions**: Mobile app previously logged in. App killed and cold-started.
- **Steps**:
  1. Log in to the mobile app. Force-quit.
  2. Wait 2 hours (access token expired, refresh token still valid).
  3. Cold-start the app. Measure time from launch to usable trip screen.
  4. Verify the `AuthProvider` reads tokens from `expo-secure-store` on mount.
  5. Verify token refresh happens BEFORE any data fetch (not after a 401 on data fetch).
  6. Measure total cold-start time including: secure store read, token refresh, trip data fetch.
  7. Cold-start with NO network. Verify app shows cached data from TanStack Query.
  8. Cold-start with expired refresh token (30+ days). Verify redirect to login screen < 2 seconds.
  9. Measure memory usage at startup with 5 trips in cache.
  10. Verify no splash screen hang (should show content within 3 seconds).
- **Expected Result**: Cold start to usable screen < 3 seconds on warm network. Expired auth redirects < 2 seconds.
- **Failure Impact**: Slow startup while a traveler needs urgent information (emergency number, rally point). App appears broken.
- **Automation**: Detox

---

## Summary Statistics

| Category | Count | P0 | P1 | P2 |
|----------|-------|----|----|----|
| Critical Path | 10 | 7 | 3 | 0 |
| Security | 15 | 8 | 7 | 0 |
| Safety-Critical | 8 | 4 | 4 | 0 |
| Integration | 7 | 1 | 6 | 0 |
| Data Integrity | 8 | 2 | 6 | 0 |
| Edge Cases | 8 | 0 | 4 | 4 |
| Accessibility | 4 | 0 | 3 | 1 |
| Performance | 6 | 0 | 3 | 3 |
| **TOTAL** | **66** | **22** | **36** | **8** |

## Critical Findings Summary (From Scenario Analysis)

### FINDING-001: Token Type Confusion (SCENARIO-014)
`get_current_user()` in `security.py` does NOT check the JWT `type` claim. Refresh tokens (30-day lifetime) are likely accepted as access tokens, bypassing the 1-hour access token expiry. This needs immediate verification and fix.

### FINDING-002: Inconsistent Token Storage (SCENARIO-018)
`consume-invite` endpoint (auth.py line 335) queries invites by raw token, but `register` endpoint (auth.py line 639) queries by HMAC hash. This inconsistency suggests one of the flows may be storing or looking up tokens incorrectly. If raw tokens are stored for `consume-invite`, HMAC hashing provides no protection.

### FINDING-003: require_admin Includes org_admin (SCENARIO-025)
Line 135 of `security.py`: `require_admin = require_role("org_admin", "hq_admin", "hq_supervisor")`. This gives org admins the same API-level access as HQ admins for any endpoint using `require_admin`, potentially allowing cross-tenant access.

### FINDING-004: Rate Limiting Fails Completely Open (SCENARIO-019)
Lines 85-91 of `rate_limit.py`: `except Exception` catches all Redis errors and allows the request through. Redis failure disables ALL rate limiting, opening the door to credential stuffing, DDoS, and brute force attacks.

### FINDING-005: No Evidence Chain Verification (SCENARIO-024)
The evidence hash chain is write-only. There is no verification endpoint, background job, or audit tool to detect tampering. The integrity guarantee is theoretical without a verification mechanism.

### FINDING-006: No Transaction Wrapping on Finalize (SCENARIO-045)
The trip finalize endpoint inserts into 6+ tables sequentially with individual try/except blocks. Partial failure leaves data in an inconsistent state with no rollback mechanism.

### FINDING-007: Plaintext Stripe Credentials in Repo (SCENARIO-017)
`stripe_creds.md` contains Stripe dashboard email and password in plaintext at the repository root.

### FINDING-008: Concurrent Evidence Write Fork (SCENARIO-043)
No serialization on evidence chain writes. Concurrent entries create a fork in the hash chain, rendering the integrity guarantee invalid.

### FINDING-009: SOS Button Missing (SCENARIO-027)
No SOS/panic button exists in the mobile app for a platform explicitly designed to protect vulnerable populations (K-12, youth) during travel.
