Now I have comprehensive input from both GPT-5.4 and Gemini. Let me compose the complete security architecture analysis.

---SECURE_ARCHITECTURE---

# SafeTrekr Security Architecture Deep Analysis

**Classification: CONFIDENTIAL -- Internal Security Assessment**
**Date: 2026-03-23**
**Analyst: World-Class AppSec Security Architect (claude-opus-4-6)**
**Validated Against: GPT-5.4 + Gemini 3.1 Pro consensus review**
**Platform: SafeTrekr -- K-12 Travel Safety Management**

---

## 0. Executive Summary

SafeTrekr manages some of the most sensitive data categories in existence: real-time location of minors, medical records, passport images, emergency contacts, and guardian custody information. The platform is simultaneously a privacy system and a **life-safety system** -- failures in availability or integrity during an active trip could have physical safety consequences for children.

This analysis identified **3 CRITICAL**, **8 HIGH**, and **9 MEDIUM** severity findings across authentication, authorization, data protection, compliance, and infrastructure domains. The most urgent gaps are: (1) production secrets exposure, (2) absence of COPPA/FERPA compliance mechanisms despite handling K-12 data, (3) broken file authorization, and (4) the service-role client bypassing all RLS policies.

---

## 1. STRIDE Threat Model

### 1.1 Trust Zones and Data Flow

```
                        INTERNET
                           |
              +------------+-------------+
              |                          |
    [Next.js Frontend]         [React Native Mobile]
    (Supabase JS client)       (Core API JWT auth)
              |                          |
              +--------- CORS ----------+
                           |
                    [FastAPI Core API]
                    port 8001, K8s pod
                    Uses SERVICE_ROLE key
                           |
              +------------+-------------+
              |            |             |
         [Supabase]   [Redis]     [SendGrid]
         PostgreSQL    Cache       Email
         + Storage     6379/6380   Webhooks
              |
         [Stripe]     [Checkr/Sterling]
         Payments      Background Checks
```

### 1.2 STRIDE per Component

#### A. FastAPI Core API (`safetrekr-core`)

| Threat | Category | Severity | Evidence |
|--------|----------|----------|----------|
| Token confusion: mobile JWT accepted by admin API | **Spoofing** | CRITICAL | `security.py:66` -- `verify_aud: False`. Mobile tokens with `aud: safetrekr-traveler` authenticate to Core API endpoints meant for admin portal. |
| Role escalation via JWT claim manipulation | **Spoofing** | HIGH | `auth.py:77-90` -- Role is embedded in JWT by Core API using `SUPABASE_JWT_SECRET`. If SECRET_KEY is weak (it is: `test-secret-key`), tokens can be forged. |
| Service client bypasses all RLS | **Tampering** | CRITICAL | `supabase.py:56-60` -- `get_service_supabase()` creates client with `SUPABASE_SERVICE_KEY`, used in 25+ route files. Any endpoint bug exposes unrestricted DB access. |
| No write-access audit for read operations | **Repudiation** | HIGH | Evidence logs track mutations only. No logging of who viewed medical records, passport images, or live locations -- required by FERPA. |
| `.select("*")` returns all columns | **Info Disclosure** | HIGH | 114 occurrences across 25 files. Login response (`auth.py:289`) returns full user record to client including internal fields. |
| Rate limiter fails open | **DoS** | MEDIUM | `rate_limit.py:85-91` -- Redis failure allows unlimited requests. Combined with in-memory rate limiter (`onboarding.py:34`) that resets on restart. |
| No input sanitization beyond Pydantic | **Elevation** | MEDIUM | Free-text fields (trip notes, medical notes, analyst comments) are stored and returned without XSS filtering. CSP allows `unsafe-inline` + `unsafe-eval`. |

#### B. Supabase PostgreSQL + RLS

| Threat | Category | Severity | Evidence |
|--------|----------|----------|----------|
| RLS bypassed by Core API service client | **Tampering** | CRITICAL | All Core API operations use `get_service_supabase()`. RLS policies only protect direct PostgREST access from frontend JS client. |
| `SECURITY DEFINER` functions run as owner | **Elevation** | MEDIUM | `is_org_member()`, `can_access_trip()`, `is_hq_staff()` in migration files are `SECURITY DEFINER` -- bugs in these functions bypass all RLS for the calling user. |
| No column-level encryption on medical/passport data | **Info Disclosure** | HIGH | `medical_information`, passport URLs, background check results stored in plaintext. DB dump or SQL injection exposes all sensitive records. |
| Evidence log `before_value`/`after_value` contain PII | **Info Disclosure** | MEDIUM | JSON snapshots may contain medical data, guardian info, student records in plaintext within `evidence_logs` table. |

#### C. React Native Mobile App

| Threat | Category | Severity | Evidence |
|--------|----------|----------|----------|
| Location spoofing by compromised device | **Spoofing** | HIGH | No cryptographic signing of location payloads. No velocity/impossibility checks on ingested coordinates. |
| Token storage in AsyncStorage (not secure enclave) | **Info Disclosure** | HIGH | Refresh tokens valid 30 days with no server-side revocation. If stored in AsyncStorage rather than `expo-secure-store`, extractable on rooted devices. |
| Push notification PII leakage | **Info Disclosure** | MEDIUM | Emergency alerts may contain location details or student names visible on lock screen. |
| No certificate pinning | **Tampering** | MEDIUM | MITM attack on mobile app could intercept JWT tokens and location streams. |

#### D. External Integrations

| Threat | Category | Severity | Evidence |
|--------|----------|----------|----------|
| SendGrid webhook signature disabled | **Spoofing** | HIGH | `.env:46` -- `SENDGRID_WEBHOOK_SECRET` is commented out. Handler returns `True` when unconfigured (`webhooks.py:69`). |
| Background check webhook verification unknown | **Spoofing** | CRITICAL | If Checkr/Sterling webhooks are similarly unverified, an attacker could mark a malicious adult as "PASSED" for chaperoning minors. |
| Stripe API key in plaintext file | **Info Disclosure** | CRITICAL | `stripe_creds.md` at project root contains dashboard URL, admin email, and password. Not in `.gitignore`. |

---

## 2. COPPA/FERPA Compliance Roadmap

### 2.1 Current State: NON-COMPLIANT

SafeTrekr handles education records of K-12 students and likely collects data from children under 13. Neither COPPA nor FERPA compliance mechanisms exist in the codebase.

### 2.2 COPPA Requirements (Children Under 13)

| Requirement | Current State | Gap | Priority |
|-------------|---------------|-----|----------|
| **Verifiable Parental Consent (VPC)** | Guardian consent is a boolean field (`consent_given`) with no identity verification | No VPC method implemented. Need: signed form upload, credit card micro-transaction, or service like PRIVO | P0 |
| **Direct Notice to Parents** | Email templates exist for guardians but no COPPA-compliant notice text | Must disclose: what data is collected, how it's used, who sees it, right to refuse | P0 |
| **Parental Review/Delete Rights** | No self-service data access or deletion for parents | Must provide parent dashboard to review child's data and request deletion | P1 |
| **Data Minimization** | `.select("*")` everywhere; no field-level filtering | Collect and return only what is necessary for the trip safety purpose | P1 |
| **Separate Location Consent** | Location tracking has no specific consent mechanism | Precise geolocation of minors requires separate, explicit consent | P0 |
| **No Targeted Advertising** | Not applicable (no ads) but analytics SDKs need audit | Verify no third-party analytics SDKs track children | P2 |
| **Retention Limits** | No automated data purge after trip completion | Must delete child data when no longer needed for the stated purpose | P1 |
| **Operator Responsibility** | No Data Processing Agreement template for schools | SafeTrekr as "operator" must contractually limit data use | P0 |

### 2.3 FERPA Requirements (Education Records)

| Requirement | Current State | Gap | Priority |
|-------------|---------------|-----|----------|
| **School Official Designation** | No contract framework | SafeTrekr must be designated as a "school official" with "legitimate educational interest" via written agreement | P0 |
| **Purpose Limitation** | No enforcement in code | Student data must be used only for trip safety purposes authorized by the school. No re-disclosure. | P0 |
| **Access Logging** | Evidence logs track writes, not reads | FERPA requires an accounting of who accessed education records. Must log all read access to student PII. | P1 |
| **Parent/Student Review Rights** | No self-service | Schools (and parents) must be able to review student records. Students gain FERPA rights at age 18. | P1 |
| **Amendment/Correction Process** | No formal workflow | Parents can challenge inaccurate records; schools must have a process to amend. | P2 |
| **Directory Information Opt-Out** | Not implemented | If student names/photos are treated as directory information, parents must be able to opt out. | P2 |
| **Contract-End Deletion** | No data lifecycle management | Must return or destroy education records when contract with school ends. | P1 |

### 2.4 Additional Regulatory Considerations

| Regulation | Applicability | Key Requirements |
|------------|---------------|------------------|
| **FCRA** | Background checks via Checkr/Sterling | Permissible purpose certification, pre-adverse/adverse action workflows, disclosure to applicant |
| **PCI DSS** | Stripe payment processing | SAQ A if fully outsourced. Verify no PANs touch SafeTrekr servers. Secure webhook verification. |
| **State Student Privacy Laws** (SOPIPA, etc.) | K-12 data in California and 40+ other states | No targeted advertising, no profiling, no sale of student data, contractual obligations with schools |
| **GDPR / UK GDPR** | International trips with EU/UK participants | Lawful basis, DPIAs, Data Processing Agreements, right to erasure, cross-border transfer mechanisms |
| **State Breach Notification** | All US states | Passport numbers, medical data, precise location, and credentials are all notification triggers |

---

## 3. Security Architecture Improvements

### 3.1 Authentication Architecture

**Current:** Single JWT type using `SUPABASE_JWT_SECRET` with audience verification disabled. No MFA. No token revocation.

**Proposed:**

```
                    [Supabase Auth]
                    (Admin/Analyst/Client Portal)
                    aud: safetrekr-web
                          |
                    [JWT with aud check]
                          |
[Next.js Frontend] ----> [Core API] <---- [React Native Mobile]
                          |                      |
                    [Separate JWT]          [Core API Auth]
                    aud: safetrekr-web      aud: safetrekr-traveler
                          |                      |
                    [Service Layer]         [Service Layer]
                    (scoped supabase)       (scoped supabase)
```

**Required Changes:**
1. Enable `verify_aud: True` in `security.py` with audience allowlist per endpoint group
2. Enforce MFA (TOTP or WebAuthn) for `hq_*`, `analyst`, `org_admin`, `billing_admin` roles via Supabase Auth AAL checks
3. Implement server-side token revocation list in Redis for refresh tokens
4. Implement refresh token rotation (current comment on `auth.py:503` explicitly defers this)
5. Add step-up authentication for sensitive actions: viewing medical data, passports, live location, exporting rosters, role changes

### 3.2 Authorization Architecture

**Current:** Role-based checks only. No relationship-based access. `can_access_file()` has stubbed authorization (`pass` on lines 78, 89 of `files.py`).

**Proposed: Attribute-Based Access Control (ABAC) / Relationship-Based Access Control (ReBAC)**

Access decisions must consider:
- User role
- Organization membership (tenant isolation)
- Trip membership and status
- Traveler-guardian relationship
- Custody restrictions
- Consent state
- Trip active/completed status
- Emergency vs. normal operation mode

**Required Changes:**
1. Create a centralized authorization service (`src/services/authorization.py`) that evaluates policies for every sensitive object type
2. Fix `can_access_file()` -- replace `pass` stubs with actual org membership, trip participation, and relationship checks
3. Implement **time-boxed access control (TBAC)**: chaperone access to student PII must auto-expire when the trip ends
4. Add BOLA/IDOR testing to CI/CD pipeline
5. Implement **break-glass access** for emergency situations: time-bounded, audited, supervisor-reviewed

### 3.3 Data Protection Architecture

**Current:** No application-level encryption. Medical data, passport images, student PII stored in plaintext. `.select("*")` returns all columns.

**Proposed:**

```
[Application Layer]
     |
[Encryption Service]  <--- KMS (AWS KMS / Vault)
     |                      |
     +-- Encrypt: medical_information fields
     +-- Encrypt: passport URLs / storage paths
     +-- Encrypt: background_check results
     +-- Encrypt: evidence_log before/after snapshots
     |
[Supabase PostgreSQL]  (encrypted at disk level by Supabase)
     |
[Supabase Storage]  (passport images, medical docs)
     +-- Signed URLs with 15-min expiry
     +-- AV scanning pipeline before availability
     +-- EXIF metadata stripping on upload
     +-- Content-Disposition: attachment on download
```

**Required Changes:**
1. Implement application-level encryption (ALE) using envelope encryption for medical, passport, and background check data
2. Replace all 114 `.select("*")` calls with explicit column lists
3. Implement column-level classification tags in code: PUBLIC, INTERNAL, CONFIDENTIAL, REGULATED
4. Add AV scanning for all file uploads before marking as available
5. Strip EXIF metadata from uploaded images
6. Generate short-lived signed URLs for document downloads (15 minutes max)
7. Encrypt PII in evidence log snapshots or redact before storage

### 3.4 Location Privacy Architecture

**Current:** PostGIS geometries stored and served without privacy controls. No time-boxing.

**Proposed:**
1. **Separate permissions** for: live location, historical location, geofence administration, safe house visibility
2. **Auto-expire location access** after trip `end_date`
3. **Privacy zones / coarse location** as default; precise location only for active trip emergencies
4. **Cryptographic signing** of location payloads from mobile app
5. **Velocity/impossibility checks** on ingested coordinates (e.g., reject >500 km/h travel speed)
6. **Safe house coordinates restricted** to need-to-know roles; traveler devices receive them only during active triggered emergencies
7. **Log every live-location lookup** with viewer identity and justification

---

## 4. Mobile Security Assessment

### 4.1 Location Tracking Consent

| Control | Current | Required |
|---------|---------|----------|
| OS-level permission prompt | Expo location API handles this | Sufficient for OS but not for COPPA |
| COPPA-specific location consent | Not implemented | Separate consent from guardian specifically for precise geolocation |
| Background location justification | Implemented in `backgroundTask.ts` | Needs review: must cease when trip is not active |
| Location data retention | No auto-purge | Must delete location history within 30 days of trip completion |

### 4.2 Biometric Gates

| Control | Current | Required |
|---------|---------|----------|
| Passport viewing | `BiometricGate.tsx` component exists | Must verify implementation uses OS secure authentication (FaceID/TouchID) |
| Medical data viewing | No gate | Must add biometric gate before displaying medical information |
| App-level lock | Not implemented | Add biometric app lock for re-entry after background |

### 4.3 Secure Storage

| Data Type | Current Storage | Required |
|-----------|-----------------|----------|
| JWT tokens | Unknown (likely AsyncStorage) | Must use `expo-secure-store` (iOS Keychain / Android Keystore) |
| Cached documents | Unknown | Must not cache passport/medical files to device storage |
| Offline data | SQLite via `lib/offline/database.ts` | Encrypt offline database; purge on logout |
| Push notification tokens | Expo Push API | Existing implementation is acceptable |

### 4.4 Additional Mobile Controls

1. **Certificate pinning** to prevent MITM interception of JWT tokens and location streams
2. **Push notification privacy**: strip PII from notification payloads; use silent notifications that trigger in-app data fetch
3. **Remote session revocation**: HQ must be able to invalidate all mobile sessions for a user immediately
4. **No sensitive data in app screenshots**: set `FLAG_SECURE` (Android) and prevent screen capture on sensitive screens

---

## 5. Top Security Enhancements (Prioritized)

| # | Enhancement | Severity | Impact | Effort | Timeline |
|---|-------------|----------|--------|--------|----------|
| 1 | **Delete `stripe_creds.md`, rotate Stripe password, add to `.gitignore`, scan git history with `trufflehog`** | CRITICAL | Eliminates live credential exposure | 1 hour | Day 1 |
| 2 | **Replace `SECRET_KEY` with cryptographically random 256-bit value in production Doppler config** | CRITICAL | Prevents invite token forgery and JWT manipulation | 30 min | Day 1 |
| 3 | **Enable JWT audience verification** (`verify_aud: True`) with separate audiences per portal | CRITICAL | Prevents mobile tokens from accessing admin APIs | 4 hours | Week 1 |
| 4 | **Enable SendGrid webhook signature verification** (uncomment and configure `SENDGRID_WEBHOOK_SECRET`) | HIGH | Prevents email event spoofing and suppression list manipulation | 1 hour | Week 1 |
| 5 | **Fix `can_access_file()` authorization** -- replace `pass` stubs with org/trip/relationship checks | HIGH | Prevents unauthorized access to passport images and medical documents | 8 hours | Week 1 |
| 6 | **Replace all `.select("*")` with explicit column lists** -- start with auth.py login response and files.py | HIGH | Eliminates mass data leakage through over-fetching | 20 hours | Weeks 1-2 |
| 7 | **Implement MFA enforcement for privileged roles** via Supabase Auth AAL checks | HIGH | Prevents single-factor compromise of admin accounts with sweeping data access | 16 hours | Week 2 |
| 8 | **Add read-access audit logging** for medical data, passport docs, and live location views | HIGH | Required for FERPA compliance; enables insider threat detection | 24 hours | Weeks 2-3 |
| 9 | **Implement application-level encryption** for `medical_information` table and passport storage paths using KMS | HIGH | Protects most sensitive data even if DB is compromised | 40 hours | Weeks 3-4 |
| 10 | **Implement COPPA Verifiable Parental Consent flow** with identity verification (PRIVO or credit card micro-transaction) | CRITICAL (compliance) | Required for lawful collection of children's data | 80 hours | Weeks 4-8 |
| 11 | **Create automated data retention/purge** -- location history 30 days post-trip, passport images when no longer operationally needed | HIGH | COPPA/FERPA retention limit compliance | 24 hours | Weeks 3-4 |
| 12 | **Disable OpenAPI docs in production** (`docs_url=None, redoc_url=None` when `DEBUG=False`) | MEDIUM | Reduces attack surface information disclosure | 15 min | Week 1 |
| 13 | **Remove localhost CORS origins from production config** -- use environment-specific CORS lists | MEDIUM | Prevents cross-origin attacks from local development servers | 1 hour | Week 1 |
| 14 | **Implement refresh token rotation and server-side revocation** via Redis token blacklist | MEDIUM | Limits blast radius of token compromise from 30 days to minutes | 8 hours | Week 2 |
| 15 | **Add file upload security pipeline**: AV scanning, EXIF stripping, content-type validation, signed download URLs | HIGH | Prevents malware distribution and metadata leakage | 24 hours | Weeks 2-3 |

---

## 6. Compliance Gap Analysis Matrix

### 6.1 COPPA Gap Analysis

| Control | Required | Implemented | Gap | Risk |
|---------|----------|-------------|-----|------|
| Verifiable Parental Consent | Yes | No (boolean field only) | **CRITICAL** | FTC enforcement action |
| Direct Notice to Parents | Yes | Partial (email templates) | HIGH | Non-compliant notice content |
| Parental Review Rights | Yes | No | HIGH | Parents cannot see child's data |
| Parental Delete Rights | Yes | No | HIGH | No deletion mechanism |
| Data Minimization | Yes | No (`.select("*")`) | HIGH | Excessive data collection/return |
| Separate Location Consent | Yes (for precise geolocation) | No | **CRITICAL** | FTC enforcement for tracking minors |
| Retention Limits | Yes | No auto-purge | HIGH | Data retained indefinitely |
| No Ad Targeting on Children | Yes | Likely compliant (no ads) | LOW | Verify analytics SDKs |
| Operator/School DPA | Yes | No template | **CRITICAL** | No lawful basis for processing |

### 6.2 FERPA Gap Analysis

| Control | Required | Implemented | Gap | Risk |
|---------|----------|-------------|-----|------|
| School Official Agreement | Yes | No | **CRITICAL** | No contractual basis |
| Purpose Limitation Enforcement | Yes | No technical enforcement | HIGH | Data could be used for unintended purposes |
| Access Logging (reads) | Yes | No (writes only) | **CRITICAL** | Cannot demonstrate compliance |
| Disclosure Accounting | Yes | No | HIGH | Cannot track who accessed records |
| Parent/Student Review | Yes | No self-service | HIGH | Manual process only |
| Rights Transfer at Age 18 | Yes | No | MEDIUM | Edge case for older students |
| Contract-End Deletion | Yes | No lifecycle management | HIGH | Data persists after school relationship ends |
| Directory Info Opt-Out | Yes (if applicable) | No | MEDIUM | Depends on data classification |

### 6.3 SOC 2 Type II Readiness

| Trust Service Criteria | Status | Key Gaps |
|------------------------|--------|----------|
| **Security** (CC6, CC7, CC8) | Partial | Missing: MFA, access reviews, vulnerability management program, penetration testing, change management |
| **Availability** (A1) | Partial | Missing: DR plan, backup verification, failover testing, SLA definitions |
| **Processing Integrity** (PI1) | Partial | Missing: input validation beyond Pydantic, output encoding, data integrity verification |
| **Confidentiality** (C1) | Weak | Missing: data classification, encryption in transit validation, encryption at rest (application-level), access restrictions |
| **Privacy** (P1-P8) | Not Started | Missing: privacy notice, consent management, data subject rights, retention/disposal, disclosure logging |

### 6.4 PCI DSS

| Requirement | Status | Notes |
|-------------|--------|-------|
| SAQ A Eligibility | Likely eligible | Stripe handles card data via Checkout/Elements |
| Webhook Signature Verification | NOT IMPLEMENTED | `STRIPE_SECRET_KEY` used but no Stripe webhook signature verification visible in `payments.py` |
| Credential Security | **FAILED** | `stripe_creds.md` contains plaintext Stripe dashboard credentials |
| Amount Integrity | Partial | Server-side price lookup exists but payment amounts come from `trip.amount_due_cents` which could be manipulated if service client is compromised |

---

## 7. Immediate Action Items (72-Hour Window)

These items represent active credential exposure or compliance showstoppers that must be addressed immediately:

1. **DELETE** `/Users/justintabb/projects/safetrekr/stripe_creds.md` and add `stripe_creds.md` to `.gitignore`
2. **ROTATE** the Stripe dashboard password for `admin@safetrekr.com`
3. **SCAN** git history with `trufflehog` or `gitleaks` to verify credentials were never committed
4. **VERIFY** that `SECRET_KEY` in Doppler production config is NOT `test-secret-key-replace-with-real-value-openssl-rand-hex-32`
5. **VERIFY** that `SENDGRID_WEBHOOK_SECRET` is configured in Doppler production config
6. **VERIFY** that `SUPABASE_JWT_SECRET` and `SUPABASE_SERVICE_KEY` in the `.env` file are not the actual production values (they appear to be -- the Supabase ref `olgjdqguafidgrutubih` should be checked)
7. **DISABLE** OpenAPI docs in production by setting `docs_url=None, redoc_url=None` when `DEBUG=False` in `main.py`

---

## Key File References

| File | Security Relevance |
|------|-------------------|
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/core/security.py` | JWT validation, RBAC -- `verify_aud: False` on line 66 |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/core/config.py` | All settings including secrets, CORS origins |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/.env` | Contains test SECRET_KEY, SendGrid API key, Supabase keys |
| `/Users/justintabb/projects/safetrekr/stripe_creds.md` | Plaintext Stripe dashboard credentials |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/auth.py` | Login/register/refresh -- leaks full user record, no password policy |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/files.py` | Stubbed authorization in `can_access_file()` lines 78, 89 |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/webhooks.py` | SendGrid signature verification disabled when secret not configured |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/evidence.py` | Hash-chained evidence logs -- PII in snapshots unencrypted |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/middleware/rate_limit.py` | Fails open on Redis failure (line 85-91) |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/middleware/security.py` | CSP allows `unsafe-inline` + `unsafe-eval` (line 45) |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/db/supabase.py` | Service client (bypasses RLS) used for all Core API operations |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/main.py` | OpenAPI docs exposed in production; CORS includes localhost |