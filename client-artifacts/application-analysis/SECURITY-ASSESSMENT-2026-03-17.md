---SECURE_ARCHITECTURE---

# SafeTrekr Application Security Assessment

**Date**: 2026-03-17
**Assessor**: World-Class AppSec Security Architect
**Scope**: Full-stack assessment -- FastAPI Core API, Next.js 15 HQ/Analyst/Client portal, React Native traveler app, Supabase PostgreSQL
**Classification**: CONFIDENTIAL -- Contains credential exposure details
**Risk Context**: Multi-tenant platform handling minor PII, medical records, GPS telemetry, guardian consent, and payment processing for K-12 schools, churches, and youth sports organizations

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Critical Findings (Immediate Action Required)](#2-critical-findings)
3. [High-Severity Findings](#3-high-severity-findings)
4. [Medium-Severity Findings](#4-medium-severity-findings)
5. [Regulatory Compliance Gap Analysis](#5-regulatory-compliance-gap-analysis)
6. [Enhancement Proposals](#6-enhancement-proposals)
7. [Architecture Recommendations](#7-architecture-recommendations)
8. [Priority Roadmap](#8-priority-roadmap)

---

## 1. Executive Summary

SafeTrekr presents a **severe security risk profile** disproportionate to the sensitivity of the data it handles. The platform processes protected health information (PHI), personally identifiable information (PII) of minors, GPS tracking data, and payment credentials for a user base that includes children, parents, schools, and churches.

**Aggregate Risk Rating: CRITICAL**

The platform has 4 critical findings requiring immediate remediation (within 24 hours), 7 high-severity findings requiring remediation within 1 sprint, and 8 medium-severity findings for the next 2 sprints. The regulatory exposure under COPPA, FERPA, and HIPAA represents existential business risk -- a single data breach involving minor PII or medical records in this domain could result in regulatory action, class-action litigation, and irreversible reputational damage.

### Risk Summary Matrix

| Severity | Count | MTTR Target | Status |
|----------|-------|-------------|--------|
| CRITICAL | 4 | 24 hours | UNMITIGATED |
| HIGH | 7 | 1 sprint (2 weeks) | UNMITIGATED |
| MEDIUM | 8 | 2 sprints (4 weeks) | UNMITIGATED |
| REGULATORY | 5 compliance frameworks | 90 days | NO PROGRAM |

---

## 2. Critical Findings

### CRIT-001: Plaintext Stripe Dashboard Credentials Committed to Repository

**File**: `/Users/justintabb/projects/safetrekr/stripe_creds.md`
**Evidence**:
```
https://dashboard.stripe.com/
User: admin@safetrekr.com
StvTvGEhT0HfhS^P5UQP
```

**Impact**: Complete compromise of payment processing infrastructure. An attacker with repository access (any developer, CI system, or Git hosting breach) gains full Stripe dashboard access -- can view all customer payment data, issue refunds, modify webhook endpoints to intercept future payments, and exfiltrate cardholder data. This is a PCI-DSS Requirement 8 violation (unique credentials, no shared accounts).

**Root Cause**: File is in the monorepo root, not listed in `.gitignore`, and contains the Stripe dashboard login email and password in plaintext. Git status shows it as an untracked file (`??`), meaning it has not yet been committed to a remote branch but exists in the working directory and could be inadvertently staged.

**Immediate Actions (within 4 hours)**:
1. Delete `stripe_creds.md` from the filesystem immediately
2. Add `stripe_creds.md` and `*_creds*` patterns to `.gitignore`
3. Rotate the Stripe dashboard password for `admin@safetrekr.com`
4. Enable MFA on the Stripe account if not already enabled
5. Review Stripe audit logs for unauthorized access since file creation (March 11, 2026)
6. Create individual Stripe team accounts; eliminate shared credentials
7. If this file was ever committed to any branch (check `git log --all -- stripe_creds.md`), treat as a confirmed credential compromise and initiate full Stripe key rotation

---

### CRIT-002: 45+ Database Tables Without Row-Level Security

**Evidence**: The Supabase schema documentation explicitly lists only 5 tables with RLS enabled: `users`, `trips` (implied), `trip_alerts`, `traveler_alert_acknowledgments`, `user_preferences`, and `consents`. The schema documentation's own security TODO states: "Enable RLS on all tables" and "Remove all 'development' RLS policies allowing anonymous access."

**Affected Tables (partial list based on schema documentation)**:
- `organizations` -- multi-tenant root entity, NO RLS
- `trip_participants` -- contains emergency contacts, medical data, NO RLS
- `locations` -- lodging addresses, NO RLS
- `flights` -- travel itineraries, NO RLS
- `guardians` -- parent/guardian PII, NO RLS
- `background_checks` -- criminal history data, NO RLS
- `invites` -- contains tokens, NO RLS
- `comms_log` -- communication records, NO RLS
- `protection_events` -- safety audit trail, NO RLS

**Impact**: Any authenticated user with a valid Supabase anon key can read and potentially modify data across ALL organizations. A traveler from Organization A can query `trip_participants` for Organization B and access emergency contacts, medical notes, allergies, and medications of children at a different school. Multi-tenant isolation is effectively nonexistent at the database layer.

**Compounding Factor**: The Core API pervasively uses `get_service_supabase()` (bypasses RLS entirely) for many operations, meaning even tables WITH RLS policies are often accessed without those policies being enforced. See file `safetrekr-core/src/core/security.py` line 35: `supabase: Client = Depends(get_service_supabase)` in the `get_current_user` dependency.

**Immediate Actions (within 24 hours)**:
1. Audit every table in the Supabase project; produce a spreadsheet of table name, RLS status, and data sensitivity tier
2. Enable RLS on ALL tables immediately (this blocks all access by default)
3. Add `service_role` bypass policies where the Core API legitimately needs them
4. Add org-scoped policies on every table containing org_id: `USING (org_id = auth.jwt()->>'org_id')`
5. Add user-scoped policies on personal data tables
6. Audit every usage of `get_service_supabase()` in the Core API; replace with `get_supabase()` (anon/RLS-enforced) wherever the operation should be scoped to the authenticated user

---

### CRIT-003: Real API Keys and Secrets in `.env` File with Weak Application Secret

**File**: `/Users/justintabb/projects/safetrekr/safetrekr-core/.env`
**Evidence**:
- Line 12: Real Supabase service role key (bypasses ALL RLS): `eyJhbGciOiJIUzI1NiIs...`
- Line 13: Real Supabase JWT secret (can forge ANY JWT): `Y4UbtnT3Rzw4GccDGGHqlWbWBqos8Ul+...`
- Line 16: Application SECRET_KEY is a hardcoded test value: `test-secret-key-replace-with-real-value-openssl-rand-hex-32`
- Line 41: Real SendGrid API key: `SG.Upe_MdbpR6q1Oq_8MoUopA...`
- Line 46: `SENDGRID_WEBHOOK_SECRET` is commented out, disabling webhook signature verification

**Mitigating Factor**: The `safetrekr-core/.gitignore` does include `.env`, so this file should not be committed. However, the submodule's `.git` is separate from the monorepo root, so the protection depends on both gitignore files being correct.

**Impact**: If this file is ever exposed (developer machine compromise, backup leak, CI artifact), an attacker can forge JWTs for any user including HQ admins, bypass all RLS using the service role key, and send emails as SafeTrekr via SendGrid.

**Immediate Actions**:
1. Rotate the Supabase JWT secret (Project Settings > API > JWT Settings)
2. Regenerate the Supabase service role key
3. Replace `SECRET_KEY` with a cryptographically random 256-bit value
4. Rotate the SendGrid API key
5. Migrate all secrets to Doppler (already referenced in deployment docs) for ALL environments including local dev
6. Ensure `.env` is in the monorepo root `.gitignore` as well

---

### CRIT-004: No Brute-Force Protection on Authentication Endpoints

**Files**: `safetrekr-core/src/api/v1/routes/auth.py` (login, register, consume-invite, refresh)
**Evidence**: Grep for `brute.?force|account.?lock|login.?attempt|failed.?login|max.?attempt` across the entire codebase returned zero results in application code. The login endpoint at `/auth/login` has no rate limiting beyond the general middleware (which, per HIGH-003, fails open). There is no account lockout mechanism, no progressive delay, and no CAPTCHA integration.

**Impact**: An attacker can perform unlimited password guessing against any account. Given the platform stores credentials for school administrators, parents, and trip leaders, a successful brute-force attack grants access to children's PII, medical records, and real-time GPS locations.

**Immediate Actions**:
1. Implement IP-based rate limiting specifically on `/auth/login`, `/auth/register`, and `/auth/consume-invite` -- maximum 5 attempts per IP per 5 minutes
2. Implement account-level lockout: after 5 failed attempts for the same email, lock the account for 30 minutes and send a notification email
3. Log all failed login attempts with IP, email, user-agent, and timestamp to an audit table
4. Add CAPTCHA (e.g., Cloudflare Turnstile) after 3 failed attempts

---

## 3. High-Severity Findings

### HIGH-001: JWT Audience Verification Disabled

**File**: `safetrekr-core/src/core/security.py` line 66
**Evidence**: `options={"verify_aud": False}` -- also on `invites.py` line 167

The Core API accepts ANY valid JWT signed with the Supabase JWT secret, regardless of the audience claim. The mobile auth system issues tokens with `aud: "safetrekr-traveler"` (auth.py line 86), while web Supabase tokens have `aud: "authenticated"`. With audience verification disabled, a mobile traveler token can authenticate to Core API endpoints intended only for the web portal.

**Problem**: Cross-system token reuse. A compromised mobile token (which may have been stored in less-secure mobile storage) can be replayed against the full Core API surface, accessing admin endpoints if the user lookup succeeds.

**Solution**: Enable `verify_aud: True` in `security.py` and configure a list of accepted audiences: `["authenticated", "safetrekr-traveler"]`. Add audience claims to the verification logic so each endpoint category can restrict which audience it accepts.

**Impact**: Token confusion attacks; mobile tokens gaining unintended API access
**Effort**: Small (S) -- 2-4 hours
**Dependencies**: Must coordinate with mobile app token issuance (auth.py)

---

### HIGH-002: Service Client RLS Bypass Used Pervasively

**File**: `safetrekr-core/src/db/supabase.py`, `safetrekr-core/src/core/security.py`
**Evidence**: The `get_current_user` dependency (security.py line 35) uses `get_service_supabase` for EVERY authenticated request. This means the user lookup bypasses RLS. More critically, numerous route handlers inject `get_service_supabase` directly for data operations that should be org-scoped.

Files using service client for data operations:
- `trips.py` line 4428: "Uses service role to bypass RLS for multi-table atomic insert"
- `webhooks.py`: All event processing
- `auth.py`: All auth endpoints (register, login, consume-invite)
- `invite_suppression.py` line 364
- `safetrekr-app-v2/supabase/functions/finalize-trip/index.ts`
- `safetrekr-app-v2/supabase/functions/check-expirations/index.ts`

**Problem**: RLS exists on paper but is systematically circumvented. A bug in any route handler that uses the service client leaks data across tenant boundaries with no database-layer safety net.

**Solution**:
1. Audit every `Depends(get_service_supabase)` call -- categorize as "legitimate" (admin operations, cross-tenant ops) or "should be user-scoped"
2. For the `get_current_user` user lookup, this is a legitimate use (needs to find users across orgs), but subsequent data queries in route handlers should use the anon client with the user's JWT passed through
3. Implement a third client type: `get_user_supabase(token)` that creates a client authenticated as the current user, enforcing RLS

**Impact**: Multi-tenant data leakage if any endpoint has insufficient authorization checks
**Effort**: Large (L) -- requires systematic audit of all route handlers
**Dependencies**: CRIT-002 (RLS must be enabled first)

---

### HIGH-003: Rate Limiting Fails Open on Redis Failure

**File**: `safetrekr-core/src/middleware/rate_limit.py` lines 85-91
**Evidence**:
```python
except Exception as e:
    # If Redis fails, log error but allow request through
    logger.error(
        "Rate limiting check failed",
        extra={"error": str(e)},
        exc_info=True,
    )
```

When Redis is unavailable (crash, network partition, memory exhaustion), ALL rate limiting is silently disabled. Every request passes through without any throttling.

**Problem**: An attacker who can cause Redis to become unavailable (e.g., via a connection flood) can then launch unlimited brute-force, credential stuffing, or DDoS attacks against the API.

**Solution**:
1. Implement a local in-memory fallback rate limiter (e.g., token bucket using `collections.OrderedDict`) that activates when Redis is unreachable
2. Add a circuit breaker pattern: if Redis fails N consecutive times, switch to the fallback and alert
3. The fallback should be MORE restrictive than Redis (e.g., 50% of normal limits) to prevent abuse during degraded mode
4. Add a health check that alerts when Redis is down

**Impact**: Complete rate limiting bypass during Redis outage
**Effort**: Medium (M) -- 1-2 days
**Dependencies**: None

---

### HIGH-004: Refresh Tokens Cannot Be Revoked (30-Day Lifetime)

**File**: `safetrekr-core/src/api/v1/routes/auth.py` lines 24-25, 497-598
**Evidence**:
- Line 25: `REFRESH_TOKEN_EXPIRE_DAYS = 30`
- Line 503: Comment says "no rotation for simplicity" -- old refresh tokens remain valid after use
- No token blacklist table exists
- No revocation endpoint exists
- Token refresh at line 565-572 generates new tokens but the OLD refresh token remains valid until its 30-day expiry

**Problem**: If a refresh token is stolen (mobile device theft, malware, insecure storage), there is NO way to invalidate it. The attacker has 30 days of persistent access. Additionally, since old refresh tokens are not invalidated on use, token theft may go undetected -- both the legitimate user and attacker can use different refresh tokens simultaneously.

**Solution**:
1. Create a `revoked_tokens` table with columns: `jti` (token ID), `revoked_at`, `reason`, `user_id`
2. On every `/auth/refresh` call, check that the incoming refresh token's `jti` is not in `revoked_tokens`
3. Implement token rotation: when a refresh token is used, insert the OLD token's `jti` into `revoked_tokens`
4. Add a `/auth/logout` endpoint that revokes the current refresh token
5. Add an admin endpoint to revoke all tokens for a user (for account compromise scenarios)
6. Reduce refresh token lifetime to 7 days
7. Implement refresh token family detection: if a revoked refresh token is presented, revoke ALL tokens in that family (indicates token theft)

**Impact**: Persistent unauthorized access for up to 30 days after token compromise
**Effort**: Medium (M) -- 2-3 days
**Dependencies**: Requires new database table

---

### HIGH-005: Dual Authentication System Without Unified Token Validation

**Files**: `safetrekr-core/src/core/security.py`, `safetrekr-core/src/api/v1/routes/auth.py`
**Evidence**: Two completely independent JWT issuers coexist:
1. **Web Portal**: Supabase Auth issues JWTs with `iss: "supabase"`, `aud: "authenticated"`, `sub: auth_user_id`
2. **Mobile App**: Core API issues JWTs with `iss: "safetrekr-core"`, `aud: "safetrekr-traveler"`, `sub: public_user_id`

The `get_current_user` function (security.py lines 88-102) handles this by trying TWO different user lookups: first by `auth_user_id`, then by `id`. Both use the service client (bypasses RLS).

**Problem**: The dual-lookup creates an oracle for user enumeration. The different `sub` semantics (auth UUID vs public UUID) mean a mobile token's `sub` might accidentally match a different user's `id` field, granting impersonation. There is also no claim to distinguish which system issued the token, so the API cannot enforce system-specific access controls.

**Solution**:
1. Add an `iss` (issuer) check in `get_current_user` -- if `iss == "safetrekr-core"`, use `id` lookup; if `iss == "supabase"`, use `auth_user_id` lookup
2. Log the token issuer on every request for audit purposes
3. Long-term: migrate to a single token issuer (Supabase Auth for both web and mobile) with custom claims for mobile-specific data (trip_id, role)

**Impact**: Potential user impersonation via UUID collision; audit trail confusion
**Effort**: Small (S) for the issuer check; Large (L) for unified auth migration
**Dependencies**: HIGH-001 (audience verification)

---

### HIGH-006: Login Endpoint Returns Complete User Record Including PII

**File**: `safetrekr-core/src/api/v1/routes/auth.py` line 288
**Evidence**: `LoginResponse` includes `user: dict` which is the raw database row from `users` table. This includes `date_of_birth`, `address`, `dietary_restrictions`, `auth_user_id`, `org_id`, and any other columns on the user record.

**Problem**: The login response over-exposes data. The mobile app only needs the user's `id`, `name`, `email`, `role`, and `photo_url`. Returning the full record leaks internal IDs and personal data into potentially insecure mobile storage.

**Solution**: Define a strict `LoginUserResponse` Pydantic model that allowlists only the fields the client needs. Never return raw database rows in API responses.

**Impact**: Over-exposure of PII in auth responses
**Effort**: Small (S) -- 1-2 hours
**Dependencies**: None

---

### HIGH-007: Invite Token Stored as Plaintext Lookup Key

**File**: `safetrekr-core/src/api/v1/routes/auth.py` lines 334-340
**Evidence**: The `consume-invite` endpoint queries `invites` table with `.eq("token", invite_token)` using the raw token value. The `register_with_invite` endpoint correctly uses `hash_token()` (line 634), but `consume-invite` does not.

**Problem**: If the invites table stores raw tokens (not hashes), a database compromise exposes all valid invite tokens, allowing mass impersonation. The inconsistency between the two endpoints suggests the older `consume-invite` predates the HMAC implementation and was never updated.

**Solution**:
1. Ensure ALL invite tokens are stored as HMAC hashes in the database
2. Update `consume-invite` to hash the incoming token before lookup: `.eq("token", hash_token(invite_token))`
3. Migrate any existing plaintext tokens to hashed values

**Impact**: Database compromise exposes valid invite tokens
**Effort**: Small (S) -- 2-4 hours
**Dependencies**: None

---

## 4. Medium-Severity Findings

### MED-001: Console Logging of Authentication Headers in Mobile App

**File**: `safetrekr-traveler-native/lib/api/apiClient.ts` line 186
**Evidence**: `console.log('[API] POST headers:', JSON.stringify(headers));` -- This logs the full `Authorization: Bearer <token>` header to the device console on EVERY POST request. Additional verbose logging at lines 145-148, 170-177, and 184-187.

**Problem**: On iOS, console logs are accessible via Xcode device logs. On Android, via `adb logcat`. If a device is connected to a computer (school IT setup, parent debugging), the JWT tokens are visible in plaintext. In production builds, React Native's console.log still emits to the native logging system unless explicitly stripped.

**Solution**:
1. Remove ALL console.log statements from apiClient.ts that log headers, tokens, or request bodies
2. Configure the Metro bundler to strip console.log in production builds (babel plugin `transform-remove-console`)
3. Implement a proper logging library (e.g., `react-native-logs`) with severity levels and production filtering

**Impact**: JWT exposure via device logs
**Effort**: Small (S) -- 2-4 hours
**Dependencies**: None

---

### MED-002: No Column-Level Encryption for Medical Data

**Evidence**: The `trip_participants` table stores `medical_notes TEXT`, `allergies TEXT`, and `medications TEXT` in plaintext. The `users` table stores `date_of_birth DATE` and `dietary_restrictions TEXT` in plaintext. No application-layer encryption is applied before insertion.

**Problem**: Under HIPAA, protected health information (PHI) must be encrypted at rest. While Supabase provides transparent disk encryption (AES-256), this does not satisfy HIPAA's requirement for field-level access controls because any user or service with database read access can see PHI in plaintext. A SQL injection attack, RLS bypass, or compromised service key exposes all medical records.

**Solution**:
1. Implement application-layer encryption for PHI fields using AES-256-GCM
2. Use Supabase Vault (or a KMS) for key management
3. Encrypt before insert, decrypt after select -- only in the Core API service layer
4. Create a dedicated PHI access function that logs every read operation for HIPAA audit compliance
5. Store the encrypted data as `bytea` or base64-encoded `text`

**Impact**: PHI exposure on any data access control failure
**Effort**: Large (L) -- 3-5 days for encryption implementation + data migration
**Dependencies**: Requires KMS setup

---

### MED-003: Webhook Signature Verification Is Optional

**File**: `safetrekr-core/src/api/v1/routes/webhooks.py` lines 67-69
**Evidence**:
```python
if not settings.SENDGRID_WEBHOOK_SECRET:
    logger.warning("SENDGRID_WEBHOOK_SECRET not configured - skipping signature verification")
    return True  # Skip verification if not configured (development mode)
```
Additionally, in the `.env` file, line 46: `#SENDGRID_WEBHOOK_SECRET=your-webhook-signing-secret` is commented out.

**Problem**: Without signature verification, anyone who discovers the `/v1/webhooks/sendgrid` endpoint can inject fake email events -- mark invites as bounced, trigger suppression list additions, or manipulate delivery tracking. The endpoint is PUBLIC (no JWT required, per line 377 comment).

**Solution**:
1. Make `SENDGRID_WEBHOOK_SECRET` a required configuration in production
2. Fail closed: if the secret is not configured, reject all webhook requests with 503
3. Add a startup check that logs a CRITICAL warning if webhook secret is missing

**Impact**: Forged webhook events can disrupt invite system
**Effort**: Small (S) -- 1-2 hours
**Dependencies**: Requires SendGrid webhook signing key configuration

---

### MED-004: CORS Configuration Includes Localhost Origins

**File**: `safetrekr-core/src/core/config.py` lines 25-34
**Evidence**:
```python
CORS_ORIGINS: list[str] = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5178",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3003",
    "https://dev-safetrekr.tarva.network",
    "https://app.safetrekr.com",
]
```

**Problem**: The default CORS origins list includes 6 localhost entries. If this configuration is used in production (likely, since it is the default and `CORS_ORIGINS` is not overridden in the deployment docs), any malicious JavaScript running on localhost (e.g., from a compromised developer machine or a local attack tool) can make authenticated cross-origin requests to the production API.

**Solution**:
1. Set `CORS_ORIGINS` via environment variable in production with ONLY production domains
2. Remove all localhost entries from the default configuration
3. Use a separate `.env.development` for local development origins
4. Add `allow_methods` restriction (remove `"*"` -- specify only GET, POST, PUT, PATCH, DELETE)
5. Add `allow_headers` restriction (remove `"*"` -- specify only Authorization, Content-Type, X-Request-ID)

**Impact**: Cross-origin request forgery from localhost
**Effort**: Small (S) -- 1 hour
**Dependencies**: None

---

### MED-005: Content Security Policy Allows unsafe-inline and unsafe-eval

**File**: `safetrekr-core/src/middleware/security.py` line 45
**Evidence**: `"script-src 'self' 'unsafe-inline' 'unsafe-eval'"` -- Both `unsafe-inline` and `unsafe-eval` are enabled, which effectively negates CSP's XSS protection. The comment says "For docs" (referring to the Swagger UI), but this CSP is applied to ALL API responses.

**Solution**:
1. Apply a strict CSP for API endpoints: `default-src 'none'; frame-ancestors 'none'`
2. Apply a relaxed CSP ONLY for the `/docs` and `/redoc` paths (Swagger needs inline styles)
3. Use CSP nonces for any inline scripts if needed

**Impact**: Reduced XSS protection on API documentation pages
**Effort**: Small (S) -- 2-4 hours
**Dependencies**: None

---

### MED-006: Debug-Level JWT Logging

**File**: `safetrekr-core/src/core/security.py` lines 61, 68, 89-101
**Evidence**:
```python
logger.debug(f"Decoding JWT token (first 50 chars): {token[:50]}...")
logger.debug(f"JWT decoded successfully, payload sub: {payload.get('sub')}")
logger.debug(f"Looking up user by auth_user_id: {user_id}")
```

**Problem**: While debug-level logging is typically disabled in production, if LOG_LEVEL is ever set to DEBUG (which the `.env` does not set, but could be changed during troubleshooting), the first 50 characters of every JWT token are written to the log system. This is sufficient to reconstruct the JWT header and partial payload.

**Solution**:
1. Never log token contents, even at debug level
2. Replace with `logger.debug("JWT token received, length=%d", len(token))`
3. Log only non-sensitive identifiers (request_id, user_id after validation)

**Impact**: Token exposure in log aggregation systems
**Effort**: Trivial (XS) -- 30 minutes
**Dependencies**: None

---

### MED-007: No Web Application Firewall (WAF)

**Evidence**: The Kubernetes deployment uses TLS termination at the ingress but no request filtering, SQL injection detection, or anomalous request blocking. The `discover-artifacts/SECURITY_DISCOVERY_ANALYSIS.md` document already identifies this as GAP-009.

**Solution**: Deploy Cloudflare WAF or AWS WAF in front of the Core API and Next.js application. Configure OWASP CRS (Core Rule Set) for SQL injection, XSS, and command injection detection.

**Impact**: No protection against common web attacks at the network edge
**Effort**: Medium (M) -- 2-3 days for WAF setup and rule tuning
**Dependencies**: DNS/CDN configuration

---

### MED-008: No SAST/DAST in CI/CD Pipeline

**Evidence**: No security scanning tools are present in the GitHub Actions workflow, `package.json`, or `requirements.txt`. No evidence of Snyk, Semgrep, Bandit, OWASP ZAP, or similar tools.

**Solution**:
1. Add `bandit` (Python SAST) and `semgrep` to the Core API CI pipeline
2. Add `eslint-plugin-security` to the Next.js and React Native projects
3. Add `trivy` for container image scanning
4. Add OWASP ZAP as a DAST step against staging
5. Configure all tools to fail the build on HIGH severity findings

**Impact**: Known vulnerability patterns shipped to production unchecked
**Effort**: Medium (M) -- 2-3 days
**Dependencies**: CI/CD pipeline access

---

## 5. Regulatory Compliance Gap Analysis

### 5.1 COPPA (Children's Online Privacy Protection Act)

**Applicability**: SafeTrekr collects personal information from children under 13 (K-12 school trips). The platform has an `is_minor` boolean field on the users table, confirming it knowingly handles children's data.

| COPPA Requirement | Status | Gap |
|---|---|---|
| Verifiable Parental Consent (VPC) before collection | NOT IMPLEMENTED | The guardian consent flow exists in UI mockups but has no enforced server-side gate preventing data collection before consent |
| Direct notice to parents about data practices | NOT IMPLEMENTED | No children's privacy policy or parent-specific notice |
| Right for parents to review child's data | NOT IMPLEMENTED | No parent-accessible data export endpoint |
| Right for parents to delete child's data | NOT IMPLEMENTED | No data deletion mechanism exists anywhere in the platform |
| Right for parents to refuse further collection | NOT IMPLEMENTED | No opt-out mechanism |
| Reasonable data security for children's information | PARTIALLY | RLS gaps (CRIT-002), no PHI encryption (MED-002) |
| Data retention limits | PARTIALLY | `retention_days` column exists on `organizations` but no enforcement mechanism |

**Risk Assessment**: COPPA violations carry penalties of $50,120 per violation (2024 rate). With a K-12 customer base, a single school's trip could involve 30+ minors, each representing a separate violation. The FTC has actively pursued COPPA enforcement in the EdTech sector.

### 5.2 FERPA (Family Educational Rights and Privacy Act)

**Applicability**: When schools use SafeTrekr, the trip data (participation, medical records, emergency contacts, GPS tracking) becomes part of the student's education record under FERPA.

| FERPA Requirement | Status | Gap |
|---|---|---|
| Written consent before disclosing student records | NOT IMPLEMENTED | No consent gate for data sharing |
| Annual notification of rights to parents | NOT APPLICABLE | Platform responsibility, not SafeTrekr's |
| School must retain control of data | PARTIALLY | Multi-tenant isolation is broken (CRIT-002) |
| Data use limited to educational purpose | NOT ENFORCED | No technical controls limiting data use |
| Data security measures | FAILING | See CRIT-001 through CRIT-004 |

**Risk Assessment**: FERPA violations can result in loss of federal funding for school customers. If SafeTrekr is found to have caused a FERPA violation for a school district, the resulting contractual liability and reputational damage would be severe.

### 5.3 HIPAA (Health Insurance Portability and Accountability Act)

**Applicability**: SafeTrekr collects medical_notes, allergies, and medications. While SafeTrekr may not be a "covered entity," if it processes health data on behalf of schools that are, it may qualify as a Business Associate.

| HIPAA Requirement | Status | Gap |
|---|---|---|
| Business Associate Agreement (BAA) with Supabase | NOT IN PLACE | Supabase offers BAA on Enterprise plan; current plan status unknown |
| PHI encryption at rest (field-level) | NOT IMPLEMENTED | Medical data stored as plaintext TEXT columns |
| PHI access audit logging | NOT IMPLEMENTED | No logging of who accessed medical records |
| Minimum necessary standard | NOT IMPLEMENTED | Full user records returned in API responses (HIGH-006) |
| Breach notification (60 days) | NO PROCESS | No incident response plan documented |
| Risk assessment | THIS DOCUMENT | First formal assessment |

### 5.4 PCI-DSS (Payment Card Industry Data Security Standard)

**Applicability**: SafeTrekr processes payments via Stripe. While Stripe handles card data, SafeTrekr's Stripe credentials management falls under PCI-DSS scope.

| PCI-DSS Requirement | Status | Gap |
|---|---|---|
| Req 2: No vendor-supplied defaults | FAILING | SECRET_KEY is a test default value (CRIT-003) |
| Req 3: Protect stored cardholder data | N/A | Stripe handles this |
| Req 6: Secure systems and software | FAILING | No SAST/DAST (MED-008) |
| Req 8: Unique user identification | FAILING | Shared Stripe dashboard credentials (CRIT-001) |
| Req 10: Track access to resources | PARTIALLY | Structured logging exists but no security audit trail |
| Req 11: Test security regularly | NOT IMPLEMENTED | No penetration testing program |

### 5.5 State Privacy Laws (CCPA/CPRA, State Student Privacy Laws)

Many US states have enacted student privacy laws (e.g., California's SOPIPA, New York's Education Law 2-d) that impose additional requirements on companies processing student data. SafeTrekr should engage legal counsel to map state-specific requirements.

---

## 6. Enhancement Proposals

### EP-001: Implement Verifiable Parental Consent (VPC) System

**Problem**: SafeTrekr collects PII from minors without any mechanism for verifiable parental consent, creating direct COPPA liability for every K-12 customer.

**Solution**:
1. Create a `guardian_consents` table: `id`, `guardian_id`, `minor_user_id`, `trip_id`, `consent_type` (data_collection, photo_sharing, gps_tracking, medical_sharing), `consented_at`, `method` (email_confirmation, esignature), `ip_address`, `user_agent`, `revoked_at`
2. Implement a consent gate in the Core API: before any minor's data is stored or shared, verify that a valid consent record exists for that specific data type
3. Build a guardian portal consent flow: guardian receives email with consent form, reviews data practices, provides electronic signature
4. Implement consent revocation: guardian can withdraw consent, which triggers data minimization (retain only legally required data)
5. Add a "children's privacy policy" page to the marketing site and mobile app

**Impact**: Eliminates COPPA exposure; enables K-12 sales with regulatory confidence
**Effort**: Large (L) -- 2 sprints
**Dependencies**: Guardian management system (partially exists)

---

### EP-002: Implement Token Revocation and Rotation

**Problem**: 30-day refresh tokens cannot be revoked. A stolen token grants persistent access with no detection or mitigation path.

**Solution**:
1. Create `token_revocations` table: `jti` (PRIMARY KEY), `user_id`, `revoked_at`, `reason` (logout, password_change, admin_revoke, token_rotation, suspicious_activity)
2. On `/auth/refresh`: validate incoming token's `jti` against revocation table; if found, revoke ALL tokens for that user (token theft detection); insert old token's `jti` into revocations; issue new tokens
3. On `/auth/logout`: insert current refresh token's `jti` into revocations
4. On password change: revoke all tokens for the user
5. Add admin endpoint: `POST /admin/users/{id}/revoke-tokens` for incident response
6. Reduce refresh token lifetime from 30 days to 7 days
7. Add a nightly cleanup job to purge expired entries from `token_revocations`

**Impact**: Enables incident response for compromised mobile devices; satisfies security audit requirements
**Effort**: Medium (M) -- 3-4 days
**Dependencies**: New database table and migration

---

### EP-003: Implement PHI Field-Level Encryption

**Problem**: Medical data (allergies, medications, medical notes) is stored in plaintext, violating HIPAA encryption requirements and exposing PHI if any data access control fails.

**Solution**:
1. Generate a data encryption key (DEK) per organization, encrypted by a master key in Supabase Vault or AWS KMS
2. Create encryption utility functions: `encrypt_phi(plaintext, org_id) -> ciphertext` and `decrypt_phi(ciphertext, org_id) -> plaintext`
3. Apply to fields: `medical_notes`, `allergies`, `medications`, `date_of_birth` (for minors), `emergency_contact_phone`
4. Modify the Core API service layer to encrypt on write and decrypt on read
5. Create a PHI access audit log: every decryption operation logs `user_id`, `record_id`, `field_name`, `timestamp`, `purpose`
6. Migration plan: encrypt all existing data in a one-time migration script with progress tracking

**Impact**: HIPAA compliance for PHI; defense-in-depth for medical data
**Effort**: Large (L) -- 1 sprint
**Dependencies**: KMS setup, database migration

---

### EP-004: Implement Comprehensive RLS Policy Framework

**Problem**: 45+ tables lack RLS, and the Core API systematically bypasses RLS even where it exists.

**Solution**:
Phase 1 (Sprint 1): Enable RLS on ALL tables with deny-by-default policies
- `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;`
- `ALTER TABLE <table> FORCE ROW LEVEL SECURITY;` (prevents table owners from bypassing)
- Add `service_role` bypass policies only for legitimate admin operations

Phase 2 (Sprint 1-2): Implement org-scoped policies
```sql
-- Example for trip_participants
CREATE POLICY "Users see own org participants"
ON trip_participants FOR SELECT
USING (
  trip_id IN (
    SELECT id FROM trips WHERE org_id = (
      SELECT org_id FROM users WHERE auth_user_id = auth.uid()
    )
  )
);
```

Phase 3 (Sprint 2): Migrate Core API from service client to user-scoped client
- Create `get_user_supabase(token)` that passes the user's JWT to the Supabase client
- Replace `get_service_supabase` with `get_user_supabase` in all route handlers where the operation should be user-scoped
- Retain `get_service_supabase` ONLY for: webhook processing, cron jobs, admin bulk operations

Phase 4 (Sprint 3): Integration testing
- Test that Org A cannot see Org B's data
- Test that traveler cannot see other travelers' medical data
- Test that service role operations still work

**Impact**: True multi-tenant isolation at the database layer
**Effort**: Extra Large (XL) -- 3 sprints
**Dependencies**: Schema access, test data for each org

---

### EP-005: Implement Data Deletion and Right-to-Erasure

**Problem**: No mechanism exists for parents, guardians, or users to request deletion of their data, as required by COPPA, GDPR (if serving EU travelers), and various state laws.

**Solution**:
1. Create a `/users/me/data-export` endpoint that generates a JSON export of all data associated with the user
2. Create a `/users/me/data-deletion-request` endpoint that initiates a deletion workflow
3. Implement a deletion pipeline:
   - Immediate: anonymize PII in `users` table (replace name, email, phone with `[DELETED]`)
   - 24-hour grace period: allow cancellation
   - After grace period: cascade delete from `trip_participants`, `guardians`, `invites`
   - Retain: anonymized audit logs and financial records (legal requirement)
4. For minors: guardian can initiate deletion on behalf of the minor
5. Log all deletion requests in an immutable audit trail

**Impact**: COPPA/GDPR compliance; customer trust
**Effort**: Large (L) -- 1-2 sprints
**Dependencies**: EP-001 (guardian consent system)

---

### EP-006: Unified Authentication Architecture

**Problem**: Two independent JWT issuers (Supabase Auth + custom Core API auth) create token confusion, audit gaps, and duplicated security logic.

**Solution**:
1. Migrate mobile app authentication to Supabase Auth
   - Use Supabase Auth's `signUp`, `signInWithPassword` directly from the mobile app
   - Use Supabase custom claims (via `app_metadata`) to store `trip_id`, `role`, `access_level`
   - Remove the custom JWT issuance from `auth.py`
2. Implement a Supabase Auth hook or Edge Function to populate custom claims on login
3. Update `get_current_user` in the Core API to validate only Supabase-issued tokens
4. All JWT validation uses `verify_aud: True` with audience `"authenticated"`
5. Token refresh handled by Supabase Auth's built-in refresh mechanism (includes revocation)

**Impact**: Single source of truth for identity; eliminates dual-auth complexity
**Effort**: Extra Large (XL) -- 2-3 sprints
**Dependencies**: Mobile app refactor, Supabase custom claims configuration

---

## 7. Architecture Recommendations

### 7.1 Trust Zone Diagram (Current State)

```
+--------------------------------------------------------------------+
|                         INTERNET (UNTRUSTED)                       |
+--------------------------------------------------------------------+
        |                    |                        |
        v                    v                        v
+---------------+  +------------------+  +-------------------------+
| Mobile App    |  | Next.js Web App  |  | SendGrid Webhooks       |
| (RN/Expo)     |  | (Next.js 15)     |  | (PUBLIC, no auth)       |
| Custom JWT    |  | Supabase JWT     |  |                         |
+-------+-------+  +--------+---------+  +------------+------------+
        |                    |                         |
        +----------+---------+-------------------------+
                   |
                   v
         +---------+----------+
         |  Core API (FastAPI) |  <-- SINGLE TRUST BOUNDARY
         |  Port 8001          |      (no WAF, no API gateway)
         |  Rate limit: Redis  |
         |  Auth: JWT decode   |
         +---------+----------+
                   |
          +--------+--------+
          |                 |
          v                 v
   +------+------+  +------+------+
   | Supabase    |  | Redis       |
   | PostgreSQL  |  | (Cache)     |
   | RLS: WEAK   |  | No auth     |
   | 45+ tables  |  | No TLS      |
   | NO RLS      |  |             |
   +-------------+  +-------------+
```

### 7.2 Target Architecture

```
+--------------------------------------------------------------------+
|                         INTERNET (UNTRUSTED)                       |
+--------------------------------------------------------------------+
        |                    |                        |
        v                    v                        v
+--------------------------------------------------------------------+
|              CLOUDFLARE / AWS WAF + CDN (EDGE ZONE)                |
|  - DDoS protection                                                 |
|  - OWASP CRS rules                                                 |
|  - Bot detection                                                   |
|  - TLS termination                                                 |
+--------------------------------------------------------------------+
        |                    |                        |
        v                    v                        v
+---------------+  +------------------+  +-------------------------+
| Mobile App    |  | Next.js Web App  |  | Webhook Gateway         |
| Supabase Auth |  | Supabase Auth    |  | (Signature verification |
| (unified)     |  | (unified)        |  |  REQUIRED, not optional)|
+-------+-------+  +--------+---------+  +------------+------------+
        |                    |                         |
        +----------+---------+-------------------------+
                   |
                   v
         +---------+----------+
         |  API Gateway       |  <-- NEW: Rate limiting, auth,
         |  (Kong / Envoy)    |      request validation at edge
         +---------+----------+
                   |
                   v
         +---------+----------+
         |  Core API (FastAPI) |
         |  - Unified JWT      |
         |  - PHI encryption   |
         |  - Audit logging    |
         |  - Input validation |
         +---------+----------+
                   |
          +--------+--------+
          |                 |
          v                 v
   +------+------+  +------+------+
   | Supabase PG |  | Redis       |
   | ALL tables  |  | AUTH + TLS  |
   | RLS ENABLED |  | Persistence |
   | PHI: AES256 |  | enabled     |
   | Audit logs  |  |             |
   +------+------+  +-------------+
          |
          v
   +------+------+
   | KMS / Vault |
   | DEK per org |
   | Master key  |
   | Key rotation|
   +-------------+
```

### 7.3 Security Checklist for Immediate Hardening

1. [ ] Delete `stripe_creds.md` and rotate Stripe dashboard credentials
2. [ ] Enable RLS on ALL Supabase tables with deny-by-default policies
3. [ ] Rotate Supabase JWT secret, service key, and anon key
4. [ ] Replace hardcoded `SECRET_KEY` with a 256-bit random value
5. [ ] Implement brute-force protection on login endpoints
6. [ ] Enable JWT audience verification (`verify_aud: True`)
7. [ ] Remove console.log statements from mobile apiClient.ts
8. [ ] Make `SENDGRID_WEBHOOK_SECRET` required in production
9. [ ] Remove localhost origins from production CORS configuration
10. [ ] Reduce refresh token lifetime from 30 days to 7 days

---

## 8. Priority Roadmap

### Phase 0: Emergency Response (This Week)

| Item | Finding | Action | Owner | Hours |
|------|---------|--------|-------|-------|
| 0.1 | CRIT-001 | Delete stripe_creds.md, rotate Stripe creds, enable MFA | Security Lead | 2h |
| 0.2 | CRIT-003 | Rotate all secrets (JWT, service key, SendGrid, SECRET_KEY) | Backend Lead | 4h |
| 0.3 | CRIT-004 | Add IP-based rate limiting on auth endpoints | Backend Dev | 4h |
| 0.4 | MED-001 | Strip console.log from mobile apiClient.ts | Mobile Dev | 2h |
| 0.5 | MED-006 | Remove JWT logging from security.py | Backend Dev | 0.5h |
| 0.6 | MED-004 | Set production CORS_ORIGINS via env var | DevOps | 1h |

### Phase 1: Foundation Hardening (Sprint 1 -- Weeks 1-2)

| Item | Finding | Action | Story Points |
|------|---------|--------|-------------|
| 1.1 | CRIT-002 | Enable RLS on all tables, deny-by-default policies | 8 |
| 1.2 | HIGH-001 | Enable JWT audience verification | 2 |
| 1.3 | HIGH-003 | Implement in-memory fallback rate limiter | 3 |
| 1.4 | HIGH-004 | Token revocation table + /auth/logout endpoint | 5 |
| 1.5 | HIGH-006 | Sanitize login response to allowlisted fields | 1 |
| 1.6 | HIGH-007 | Fix consume-invite to use hash_token() | 2 |
| 1.7 | MED-003 | Make webhook secret required in production | 1 |
| 1.8 | MED-005 | Split CSP for API vs docs endpoints | 2 |

### Phase 2: Compliance Foundation (Sprint 2-3 -- Weeks 3-6)

| Item | Proposal | Action | Story Points |
|------|----------|--------|-------------|
| 2.1 | EP-001 | Verifiable parental consent system | 13 |
| 2.2 | EP-002 | Full token rotation with family detection | 8 |
| 2.3 | EP-003 | PHI field-level encryption | 13 |
| 2.4 | HIGH-002 | Audit and migrate service client usage | 8 |
| 2.5 | MED-007 | Deploy WAF (Cloudflare or AWS) | 5 |
| 2.6 | MED-008 | Add SAST/DAST to CI/CD pipeline | 5 |

### Phase 3: Architecture Modernization (Sprint 4-6 -- Weeks 7-12)

| Item | Proposal | Action | Story Points |
|------|----------|--------|-------------|
| 3.1 | EP-004 | Comprehensive RLS policy framework (Phases 2-4) | 21 |
| 3.2 | EP-005 | Data deletion and right-to-erasure | 13 |
| 3.3 | EP-006 | Unified authentication architecture | 21 |
| 3.4 | -- | HIPAA BAA with Supabase (Enterprise plan) | Business |
| 3.5 | -- | Penetration test (external firm) | Business |
| 3.6 | -- | Children's privacy policy (legal review) | Legal |

### Phase 4: Operational Security (Ongoing -- Quarter 2)

| Item | Action |
|------|--------|
| 4.1 | Monthly secret rotation schedule |
| 4.2 | Quarterly penetration testing |
| 4.3 | Security champion program (1 per team) |
| 4.4 | Incident response playbook and tabletop exercise |
| 4.5 | Regulatory compliance dashboard |
| 4.6 | Security KPI tracking (MTTR, % findings closed) |

---

## Appendix A: Files Referenced

| File | Finding |
|------|---------|
| `/Users/justintabb/projects/safetrekr/stripe_creds.md` | CRIT-001 |
| `/Users/justintabb/projects/safetrekr/.gitignore` | CRIT-001 |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/.env` | CRIT-003 |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/.gitignore` | CRIT-003 |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/core/security.py` | HIGH-001, HIGH-005, MED-006 |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/core/config.py` | MED-004 |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/db/supabase.py` | HIGH-002 |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/main.py` | MED-004, MED-005 |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/middleware/rate_limit.py` | HIGH-003 |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/middleware/security.py` | MED-005 |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/auth.py` | CRIT-004, HIGH-004, HIGH-005, HIGH-006, HIGH-007 |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/webhooks.py` | MED-003 |
| `/Users/justintabb/projects/safetrekr/safetrekr-traveler-native/lib/api/apiClient.ts` | MED-001 |
| `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/SUPABASE_SCHEMA_DOCUMENTATION.txt` | CRIT-002, MED-002 |

## Appendix B: CVSS v3.1 Scores

| Finding | Vector | Base Score | Severity |
|---------|--------|------------|----------|
| CRIT-001 | AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:N | 9.6 | Critical |
| CRIT-002 | AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:L/A:N | 8.5 | High |
| CRIT-003 | AV:L/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:N | 8.4 | High |
| CRIT-004 | AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N | 7.5 | High |
| HIGH-001 | AV:N/AC:H/PR:L/UI:N/S:U/C:H/I:L/A:N | 5.9 | Medium |
| HIGH-002 | AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:N/A:N | 7.7 | High |
| HIGH-003 | AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:N/A:H | 5.9 | Medium |
| HIGH-004 | AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N | 7.4 | High |

---

**Assessment completed**: 2026-03-17
**Next review**: 2026-04-17 (or immediately upon completion of Phase 0)
**Distribution**: Founder, CTO, Security Lead -- CONFIDENTIAL
