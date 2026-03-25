---SECURE_ARCHITECTURE---

# SafeTrekr Application Security Assessment

**Date**: 2026-03-23
**Scope**: Full codebase security review (safetrekr-core, safetrekr-app-v2, Supabase migrations)
**Assessor**: World-Class AppSec Security Architect
**Data Sensitivity**: PII of minors (K-12), medical records, passport data, location tracking, background checks

---

## Executive Summary

SafeTrekr demonstrates security-conscious design in several areas: HMAC-hashed invite tokens with constant-time comparison, OWASP-aligned security headers, role-based access control, RLS policies on all tables, and evidence logging. However, the assessment identified **3 CRITICAL, 8 HIGH, 10 MEDIUM, and 7 LOW** findings that require urgent remediation, especially given the system handles data of minors protected under COPPA.

---

## 1. AUTHENTICATION ARCHITECTURE

### 1.1 Dual Auth-ID System

The dual-ID design (`auth.users.id` versus `public.users.id`) is correctly handled in the core auth flow. The `get_current_user` function in `/Users/justintabb/projects/safetrekr/safetrekr-core/src/core/security.py` properly queries by `auth_user_id` first, then falls back to `id`.

### 1.2 JWT Handling

**FINDING CRIT-001: JWT Audience Verification Disabled**
- **File**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/core/security.py`, line 66
- **Code**: `options={"verify_aud": False}`
- **Risk**: Supabase issues JWTs with an audience claim. By disabling verification, any JWT signed by Supabase for *any* audience (anon, service_role, or another project sharing the same signing key) will be accepted. A Supabase anon-key JWT could potentially authenticate API calls if the signing secret matches.
- **Severity**: HIGH
- **Fix**: Set `options={"verify_aud": True}` and configure the expected audience claim. The traveler auth flow (auth.py) already validates audience (`audience="safetrekr-traveler"`) on refresh tokens -- apply the same discipline globally.

**FINDING CRIT-002: Weak SECRET_KEY for HMAC Token Hashing**
- **File**: `/Users/justintabb/projects/safetrekr/safetrekr-core/.env`, line 16
- **Value**: `SECRET_KEY=test-secret-key-replace-with-real-value-openssl-rand-hex-32`
- **Risk**: This key is the HMAC pepper for all invite token hashes stored in the database. If this test value is deployed to production, an attacker who obtains the database can recompute all invite token hashes and forge valid invites. The key name literally says "replace with real value."
- **Severity**: CRITICAL
- **Fix**: Generate a cryptographically random key (`openssl rand -hex 32`) and deploy it via Doppler. Verify that the production environment has a distinct, high-entropy value.

**FINDING CRIT-003: Plaintext Stripe Dashboard Credentials in Repository**
- **File**: `/Users/justintabb/projects/safetrekr/stripe_creds.md`
- **Content**: Contains Stripe dashboard URL, login email, and plaintext password
- **Risk**: This file is NOT gitignored (the `.gitignore` does not cover `*.md` or `stripe_creds*`). It is currently untracked (`??` in git status), meaning it has not been committed yet, but any `git add .` or `git add -A` command would stage it. If committed and pushed, the Stripe dashboard password is permanently in git history.
- **Severity**: CRITICAL
- **Immediate Actions**:
  1. Delete the file immediately
  2. Rotate the Stripe dashboard password
  3. Add `stripe_creds*` to `.gitignore`
  4. Run `git secrets --scan` or similar to prevent future credential commits

### 1.3 Session Management

**FINDING HIGH-001: No Refresh Token Rotation/Revocation**
- **File**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/auth.py`, line 503 (comment says "no rotation for simplicity")
- **Risk**: When a refresh token is used, a new refresh+access pair is issued, but the old refresh token remains valid until its natural expiry (30 days). If a refresh token is stolen, the attacker has a 30-day window. There is no server-side token revocation mechanism (no token blacklist or family tracking).
- **Severity**: HIGH
- **Fix**: Implement refresh token rotation with family tracking: each refresh token gets a `family_id`. When a token is used, the old one is invalidated. If a previously-used token is presented (replay), invalidate the entire family.

### 1.4 Inconsistent Invite Token Handling

**FINDING HIGH-002: Dual Token Verification Paths**
- **File (HMAC path)**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/auth.py`, line 634-639 -- `register_with_invite` uses `hash_token(data.invite_token)` and queries `eq("token", token_hash)`
- **File (Plaintext path)**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/auth.py`, line 334-340 -- `consume_invite` queries `eq("token", invite_token)` with the **raw** token
- **Risk**: The `consume_invite` endpoint searches for the raw token in the database, while the `register_with_invite` endpoint correctly hashes first. This means either: (a) some invites store plaintext tokens and others store hashes, creating confusion and potential bypass, or (b) `consume_invite` will never match hashed tokens, breaking the flow.
- **Severity**: HIGH
- **Fix**: Standardize on HMAC hashing for ALL invite token storage and lookup. Remove the plaintext path entirely.

---

## 2. AUTHORIZATION MODEL

### 2.1 RLS Policies

The RLS architecture is well-structured. Key positive observations:
- `SECURITY DEFINER` functions (`is_org_member`, `is_hq_staff`, `can_access_trip`) prevent user manipulation of query context
- INSERT, UPDATE, DELETE policies exist for trip-related tables
- Org membership is checked via `auth.uid()` -> `users.auth_user_id` join

**FINDING HIGH-003: Trip Listing Shows All Org Trips to Travelers/Chaperones**
- **File**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/trips.py`, lines 165-173
- **Code**: For travelers and chaperones, the query filters only by `org_id` -- not by trip participation
- **Risk**: A traveler in Org X can see ALL trips belonging to Org X, not just trips they are assigned to. For organizations managing multiple concurrent trips, this leaks trip details (destinations, dates, participant counts) across trip boundaries.
- **Severity**: HIGH
- **Fix**: For traveler/chaperone roles, join through `trip_participants` to return only trips where the user is an active participant.

### 2.2 RBAC

**FINDING MED-001: Role Enumeration in Error Messages**
- **File**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/core/security.py`, line 128
- **Code**: `detail=f"Role {user.role} not authorized. Required: {', '.join(allowed_roles)}"`
- **Risk**: The error message reveals the user's current role AND the complete list of allowed roles. This helps attackers understand the authorization model.
- **Severity**: MEDIUM
- **Fix**: Return a generic 403 message: `"You do not have permission to access this resource."`

**FINDING MED-002: Missing Org-Boundary Check on Guardian Endpoints**
- **File**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/guardians.py`, lines 163-201
- **Risk**: `get_traveler_guardians` and `get_trip_guardians` require `get_current_user` but do not verify that the requesting user's org matches the trip's org. Any authenticated user with a valid JWT can query guardian data for any trip by guessing/knowing the trip_id.
- **Severity**: HIGH
- **Fix**: Add org-boundary verification: for non-HQ roles, check `trip.org_id == current_user.org_id`.

**FINDING MED-003: Analyst Role Has Over-Broad Access**
- **File**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/core/security.py`, line 136, and trips.py line 103
- **Risk**: The `analyst` role is granted HQ-equivalent access to ALL trips across ALL organizations. While analysts need broad access for review, they should not have the same data scope as `hq_admin`. There is no concept of "assigned analyst" scoping.
- **Severity**: MEDIUM
- **Fix**: Consider scoping analyst access to trips in `review_queue` assigned to them, rather than blanket access to all trips.

---

## 3. MULTI-TENANCY ISOLATION

### 3.1 Org-Level Isolation

The RLS helper functions (`is_org_member`, `can_access_trip`) provide a solid foundation for multi-tenant isolation at the database layer. However, the Core API often bypasses RLS using `get_service_supabase()`.

**FINDING HIGH-004: Pervasive Service Client Usage Bypasses RLS**
- **Observation**: Nearly every route handler uses `Depends(get_service_supabase)` instead of `Depends(get_supabase)`. The service client bypasses ALL Row Level Security policies.
- **Risk**: When the API code itself is responsible for authorization (rather than RLS), any bug in application-level access checks results in cross-org data leakage. The RLS policies become decorative rather than a defense-in-depth layer.
- **Severity**: HIGH
- **Fix**: Use `get_supabase()` (anon client, RLS-enforced) as the default for read operations. Reserve `get_service_supabase()` only for administrative operations that genuinely need to bypass RLS (user lookup in auth, cross-org reporting for HQ).

### 3.2 File Access Control

**FINDING HIGH-005: Incomplete File Authorization Logic**
- **File**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/files.py`, lines 73-91
- **Code**: The `can_access_file()` function has multiple `pass` statements where authorization checks should be:
  ```python
  if trip_id:
      pass  # <- Should check org membership
  if user_id:
      if user.role in ["org_admin", ...]:
          pass  # <- Should check same org
  ```
- **Risk**: Any authenticated user can access any file by its UUID because the function falls through to `return False` only after skipping meaningful checks. The trip/org boundary checks are stubbed out.
- **Severity**: HIGH
- **Fix**: Implement the stubbed checks: verify trip.org_id matches user.org_id for trip-associated files; verify target user's org_id matches for user-associated files.

---

## 4. API SECURITY

### 4.1 Rate Limiting

The rate limiting implementation in `/Users/justintabb/projects/safetrekr/safetrekr-core/src/middleware/rate_limit.py` is well-designed with role-based limits and token-bucket algorithm. However:

**FINDING MED-004: Rate Limit Fail-Open on Redis Failure**
- **File**: rate_limit.py, lines 85-91
- **Code**: `except Exception as e: ... # If Redis fails, log error but allow request through`
- **Risk**: If Redis is down, ALL rate limiting is disabled. An attacker could DoS Redis to remove rate limits.
- **Severity**: MEDIUM
- **Fix**: Implement a local in-memory fallback limiter that activates when Redis is unavailable. Use a stricter limit for the fallback.

**FINDING MED-005: Rate Limiter Does Not Read Auth State**
- **File**: rate_limit.py, lines 51-52
- **Code**: `user_id = getattr(request.state, "user_id", None)` / `user_role = getattr(request.state, "user_role", "anonymous")`
- **Risk**: The rate limiter reads `user_id` and `user_role` from `request.state`, but no middleware sets these values before the rate limiter runs. The auth middleware (JWT validation) is in the route dependencies, not in the middleware stack. Every request is rate-limited as "anonymous" (30/min) regardless of authentication.
- **Severity**: MEDIUM
- **Fix**: Either move lightweight JWT introspection into the middleware pipeline to populate `request.state`, or accept that all users share the authenticated per-IP limit.

### 4.2 Input Validation

Password validation is minimal: `min_length=8` with no complexity requirements (see models.py lines 1706 and 2449). For a system protecting minors' PII, NIST SP 800-63B recommends a minimum of 8 characters but also checking against a list of compromised passwords.

**FINDING MED-006: Weak Password Policy**
- **Files**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/db/models.py`, lines 1706, 2449
- **Severity**: MEDIUM
- **Fix**: Add password complexity requirements (at minimum: 12 chars, or 8+ with complexity checks). Check against HaveIBeenPwned API or a local breached-password list.

### 4.3 CORS Configuration

**FINDING MED-007: Localhost Origins in Default CORS Configuration**
- **File**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/core/config.py`, lines 25-34
- **Risk**: Six localhost origins are hardcoded as defaults. If `CORS_ORIGINS` is not overridden in production via environment variable, localhost origins will be active in production.
- **Severity**: MEDIUM
- **Fix**: Set `CORS_ORIGINS` to empty list by default, require explicit configuration. Deployment guide already mentions this but it should be enforced.

### 4.4 API Documentation Exposure

**FINDING MED-008: OpenAPI/Swagger Docs Exposed in Production**
- **File**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/main.py`, lines 148-150
- **Code**: `docs_url="/docs"`, `redoc_url="/redoc"` -- unconditional, no DEBUG check
- **Risk**: In production, `/docs` and `/redoc` expose the complete API schema, all endpoint paths, all parameter names, all role names, and all response schemas. This is a significant reconnaissance aid for attackers.
- **Severity**: MEDIUM
- **Fix**: Conditionally disable in production: `docs_url="/docs" if settings.DEBUG else None`

---

## 5. DATA PROTECTION

### 5.1 Data Minimization

**FINDING MED-009: Over-Fetching with `select("*")` Pattern**
- **Observation**: Over 30 instances of `.select("*")` across route handlers
- **Risk**: Returns all columns including potentially sensitive fields (medical_info, date_of_birth, emergency contacts, passport data, background check results) when only a subset is needed. Data transmitted to the client increases the blast radius of any XSS or client-side compromise.
- **Severity**: MEDIUM
- **Fix**: Replace `select("*")` with explicit column lists. Especially critical for endpoints serving traveler/public-facing responses.

**FINDING HIGH-006: Login Response Exposes Full User Record**
- **File**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/auth.py`, line 288
- **Code**: `user=user` (passes the entire database row as the response)
- **Risk**: The login response includes every column from the `users` table, which may include `auth_user_id`, internal metadata, org settings, etc.
- **Severity**: HIGH
- **Fix**: Create a `UserPublicProfile` response model with only the fields the client needs (id, email, name, role, org_id).

### 5.2 Encryption

- **At Rest**: Supabase (managed PostgreSQL) provides encryption at rest via the hosting provider. Adequate for this tier.
- **In Transit**: TLS is enforced via HSTS header (when not in DEBUG mode). The Core API itself runs behind a reverse proxy in production.
- **Application-Layer Encryption**: Sensitive documents (passports, medical forms) are stored in Supabase Storage. No application-level encryption envelope is applied before storage.

**FINDING LOW-001: No Application-Level Encryption for Sensitive Documents**
- **Risk**: If the Supabase storage bucket is misconfigured or compromised, passport images and medical records are in cleartext.
- **Severity**: LOW (mitigated by Supabase's managed encryption)
- **Fix**: For highest-sensitivity documents (passports, medical), apply AES-256-GCM envelope encryption before upload. Store the DEK encrypted by a KMS.

---

## 6. THIRD-PARTY INTEGRATION SECURITY

### 6.1 SendGrid Webhooks

**FINDING HIGH-007: Webhook Signature Verification Disabled**
- **File**: `/Users/justintabb/projects/safetrekr/safetrekr-core/.env`, line 46 -- `#SENDGRID_WEBHOOK_SECRET=your-webhook-signing-secret`
- **File**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/webhooks.py`, lines 67-69 -- `if not settings.SENDGRID_WEBHOOK_SECRET: return True`
- **Risk**: With the secret commented out, the webhook endpoint accepts ANY POST request as a valid SendGrid event. An attacker can forge bounce events to add emails to the suppression list, forge delivery events to mark invites as sent, or inject arbitrary data into `invite_events`.
- **Severity**: HIGH
- **Fix**: Configure `SENDGRID_WEBHOOK_SECRET` in all environments. Remove the `return True` fallback entirely or gate it behind `settings.DEBUG`.

### 6.2 Stripe Webhooks

The Stripe webhook handler (`payments.py` line 356-369) has the same pattern: if `STRIPE_WEBHOOK_SECRET` is not set, it parses the body directly without signature verification. However, it does correctly use `stripe.Webhook.construct_event()` when the secret is available.

**FINDING MED-010: Stripe Webhook Signature Bypass in Development Mode**
- **Severity**: MEDIUM (same as SendGrid but with financial impact)
- **Fix**: Require webhook secrets in all environments. Use Stripe CLI for local testing rather than disabling verification.

### 6.3 Stripe Client Secret Persistence

**FINDING LOW-002: Stripe PaymentIntent client_secret Stored in Database**
- **File**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/payments.py`
- **Risk**: The `stripe_client_secret` is stored in `trip_payments` table and returned via the status API. This secret is meant to be ephemeral. If the database is compromised, these secrets could be used to confirm pending payments.
- **Severity**: LOW (Stripe secrets are single-use per intent)
- **Fix**: Do not persist `stripe_client_secret`. Re-retrieve from Stripe when needed, or store only the PaymentIntent ID.

---

## 7. MOBILE APP SECURITY

### 7.1 Location Data

The system includes background location tracking, geofences, and geofence violation logging. The location data is stored in Supabase with PostGIS geometry columns.

**FINDING LOW-003: No Location Data Retention Policy**
- **Risk**: Location tracking data for minors appears to be stored indefinitely. Under COPPA and GDPR Article 5(1)(e), personal data should not be kept longer than necessary.
- **Severity**: LOW
- **Fix**: Implement an automated location data purge policy (e.g., 30 days after trip completion).

### 7.2 Biometric Gates

The mobile app includes a `BiometricGate` component for document access (visible in the deleted `safetrekr-traveler-native` directory). This is a good pattern. Since that directory has been deleted from the branch, verification of the current mobile implementation is not possible from this codebase.

---

## 8. KNOWN VULNERABILITIES AND ANTI-PATTERNS

**FINDING LOW-004: Debug Error Details Exposed via Exception Handler**
- **File**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/main.py`, lines 258-266
- **Code**: `"details": str(exc) if settings.DEBUG else None`
- **Risk**: If DEBUG is True in production, full exception messages (potentially including SQL queries, file paths, or stack traces) are returned to the client.
- **Severity**: LOW (gated by DEBUG flag)
- **Fix**: Verify DEBUG is False in all production deployments.

**FINDING LOW-005: In-Memory Rate Limiting for Onboarding Resend**
- **File**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/onboarding.py`, line 34
- **Risk**: The `_resend_rate_limit` dictionary lives in process memory. It resets on restart and is not shared across multiple API instances in production (Kubernetes pods).
- **Severity**: LOW
- **Fix**: Move to Redis-backed rate limiting.

**FINDING LOW-006: `datetime.utcnow()` Usage (Deprecated)**
- **Files**: auth.py lines 76, 88, 99, 109
- **Risk**: `datetime.utcnow()` is deprecated in Python 3.12+ in favor of `datetime.now(timezone.utc)`. It returns a naive datetime without timezone info, which can cause comparison issues.
- **Severity**: LOW
- **Fix**: Replace all `datetime.utcnow()` with `datetime.now(timezone.utc)`.

**FINDING LOW-007: X-XSS-Protection Header**
- **File**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/middleware/security.py`, line 33
- **Risk**: `X-XSS-Protection: 1; mode=block` is deprecated and can introduce additional vulnerabilities in older browsers. Modern browsers have removed XSS Auditor support.
- **Severity**: LOW
- **Fix**: Set `X-XSS-Protection: 0` or remove entirely. Rely on CSP instead.

---

## 9. COMPLIANCE CONSIDERATIONS

### 9.1 COPPA (Children's Online Privacy Protection Act)

SafeTrekr handles PII of K-12 students, many of whom are under 13.

**FINDING HIGH-008: No Explicit COPPA Compliance Mechanisms**
- **Observations**:
  - No age verification or date-of-birth gating in registration flows
  - No verifiable parental consent mechanism distinct from guardian trip consent
  - No data minimization enforcement for minors' records
  - No "right to delete" self-service for parents/guardians
  - Location tracking of minors without documented COPPA-compliant notice
- **Severity**: HIGH (regulatory/legal)
- **Fix**: Engage legal counsel to establish COPPA compliance framework. At minimum:
  1. Document the "school official" exception under COPPA (34 CFR 99.31) if relying on FERPA
  2. Implement data minimization for under-13 records
  3. Provide guardian-accessible data deletion mechanism
  4. Add retention policies with automated purging

### 9.2 GDPR

If SafeTrekr processes data of EU residents (international trips), GDPR applies.
- No Data Protection Impact Assessment (DPIA) is evidenced
- No data subject access request (DSAR) endpoint exists
- Consent collection exists (tos_accepted, pp_accepted) but no granular consent for specific processing activities

---

## Remediation Priority Matrix

| Priority | ID | Finding | Severity | Effort |
|---|---|---|---|---|
| P0 | CRIT-003 | Delete stripe_creds.md, rotate password | CRITICAL | 15min |
| P0 | CRIT-002 | Replace test SECRET_KEY in production | CRITICAL | 30min |
| P0 | HIGH-007 | Enable SendGrid webhook signature verification | HIGH | 1h |
| P1 | CRIT-001 | Enable JWT audience verification | HIGH | 2h |
| P1 | HIGH-002 | Standardize invite token hashing | HIGH | 4h |
| P1 | HIGH-004 | Reduce service client usage, enforce RLS | HIGH | 8h |
| P1 | HIGH-005 | Complete file access authorization checks | HIGH | 3h |
| P1 | HIGH-006 | Sanitize login response (UserPublicProfile) | HIGH | 2h |
| P1 | HIGH-003 | Scope trip listing to participant membership | HIGH | 3h |
| P2 | HIGH-001 | Implement refresh token rotation | HIGH | 8h |
| P2 | HIGH-008 | COPPA compliance framework | HIGH | 40h+ |
| P2 | MED-002 | Add org-boundary check to guardian endpoints | MEDIUM | 2h |
| P2 | MED-003 | Scope analyst access to assigned reviews | MEDIUM | 4h |
| P2 | MED-006 | Strengthen password policy | MEDIUM | 2h |
| P2 | MED-008 | Disable OpenAPI docs in production | MEDIUM | 30min |
| P2 | MED-009 | Replace select("*") with explicit columns | MEDIUM | 8h |
| P3 | MED-001 | Remove role names from error messages | MEDIUM | 1h |
| P3 | MED-004 | Add fallback rate limiter for Redis failure | MEDIUM | 3h |
| P3 | MED-005 | Fix rate limiter auth state reading | MEDIUM | 4h |
| P3 | MED-007 | Enforce production CORS origins | MEDIUM | 1h |
| P3 | MED-010 | Require Stripe webhook secret in all envs | MEDIUM | 1h |
| P4 | LOW-001 | Application-level encryption for documents | LOW | 16h |
| P4 | LOW-002 | Stop persisting Stripe client_secret | LOW | 2h |
| P4 | LOW-003 | Location data retention policy | LOW | 8h |
| P4 | LOW-004 | Verify DEBUG=False in production | LOW | 15min |
| P4 | LOW-005 | Move onboarding rate limit to Redis | LOW | 2h |
| P4 | LOW-006 | Replace datetime.utcnow() | LOW | 1h |
| P4 | LOW-007 | Update X-XSS-Protection header | LOW | 15min |

---

## What Is Done Well

1. **Invite Token Security**: HMAC-SHA256 with server-side pepper and constant-time comparison (in the register path) is textbook correct.
2. **Security Headers**: Comprehensive OWASP-aligned headers including HSTS, CSP, frame-ancestors, Permissions-Policy.
3. **RLS Foundation**: All tables have RLS enabled with well-structured helper functions using `SECURITY DEFINER`.
4. **Evidence Logging**: Payment and protection events are logged to an immutable evidence trail.
5. **Email Enumeration Prevention**: The onboarding resend endpoint returns a generic response regardless of whether the email exists.
6. **Webhook Anti-Replay**: The SendGrid webhook handler includes timestamp tolerance checking (5 minutes) and event deduplication.
7. **Cache-Control Headers**: API responses include `no-store, no-cache` headers preventing browser caching of sensitive data.
8. **Request ID Tracing**: Every request gets a UUID for correlation across logs.
9. **Compensation Logic**: The registration endpoint deletes the auth user if the users table insert fails -- good transactional integrity.

---

## Recommended Immediate Actions (Next 48 Hours)

1. **Delete** `/Users/justintabb/projects/safetrekr/stripe_creds.md` and rotate the Stripe dashboard password
2. **Add** `stripe_creds*` and `*_creds*` to `.gitignore`
3. **Verify** that production `SECRET_KEY` is not the test placeholder value
4. **Enable** `SENDGRID_WEBHOOK_SECRET` in all deployed environments
5. **Set** `docs_url=None, redoc_url=None` in production FastAPI configuration