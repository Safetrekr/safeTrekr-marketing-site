# SafeTrekr Security Discovery Analysis

**Prepared by**: World-Class AppSec Security Architect
**Date**: 2026-03-17
**Classification**: CONFIDENTIAL -- Internal Use Only
**Scope**: Full monorepo codebase review (safetrekr-core, safetrekr-app-v2, safetrekr-traveler-native, packages/core-logic)
**Branch**: wireUp5

---

## Executive Summary

SafeTrekr is a multi-tenant travel safety management platform handling highly sensitive data categories: minors' personally identifiable information, medical records, real-time GPS coordinates, emergency contacts, guardian consent artifacts, and financial payment data. The platform serves organizations (K-12 schools, churches, youth sports teams) whose participants include children, making COPPA, FERPA, and potentially HIPAA compliance legally mandatory -- not aspirational.

The codebase demonstrates several mature security patterns: HMAC-SHA256 invite tokens with constant-time comparison, structured role-based access control across 10 roles, Redis-backed token-bucket rate limiting, Doppler-managed secrets injection at runtime (not baked into images), non-root container execution with dropped Linux capabilities, and security headers aligned with OWASP recommendations.

However, the discovery reveals **19 material security findings**, including one **critical credential exposure**, several **high-severity architectural gaps** in authentication and authorization, and a systemic **over-reliance on application-layer RBAC** while the database-layer Row Level Security policies remain in development mode. The combination of sensitive data types, minor participants, and these gaps creates substantial regulatory and breach risk that must be addressed before any production deployment handling real user data.

---

## Key Findings

1. **CRITICAL: Plaintext Stripe credentials committed to repository** -- `stripe_creds.md` at project root contains the Stripe dashboard URL, admin email, and password in cleartext. This file is untracked but present in the working directory and not in `.gitignore`.

2. **HIGH: JWT audience verification intentionally disabled** -- `security.py` line 66 sets `verify_aud: False`, meaning any valid Supabase JWT is accepted regardless of intended audience. Mobile-issued tokens with `aud: safetrekr-traveler` can authenticate to the Core API without audience validation.

3. **HIGH: Development RLS policies grant anonymous access to production tables** -- The Supabase schema documentation explicitly identifies `USING (true)` RLS policies on `trip_participants`, `trip_alerts`, and other tables labeled "Remove for Production" that remain active.

4. **HIGH: Service client (RLS bypass) used pervasively** -- Nearly every endpoint in `trips.py` (the 185KB, 2800+ line route file) uses `get_service_supabase()`, which bypasses all Row Level Security. Authorization is enforced only at the FastAPI Python layer with no database-level defense-in-depth.

5. **HIGH: Refresh tokens cannot be revoked** -- The `/auth/refresh` endpoint generates new tokens but old refresh tokens remain valid for their full 30-day lifetime. There is no server-side token revocation list or token family tracking.

6. **HIGH: Rate limiting fails open on Redis failure** -- `rate_limit.py` lines 85-90 explicitly allow all requests through if the Redis connection fails, creating a denial-of-service bypass vector.

7. **HIGH: Dual authentication system with inconsistent identity mapping** -- The web app authenticates via Supabase Auth (JWT `sub` = `auth.users.id`), while the mobile app uses custom JWT issuance from Core API (JWT `sub` = `public.users.id`). The `get_current_user` function attempts both lookups, creating a confused-deputy attack surface.

8. **MEDIUM: Sensitive medical and minor data stored without column-level encryption** -- `medical_notes`, `allergies`, `medications`, `date_of_birth`, `emergency_contact_*` fields are stored as plaintext in PostgreSQL. Under HIPAA and COPPA, these require encryption at rest beyond volume-level encryption.

9. **MEDIUM: Console logging of credentials and tokens in mobile app** -- `apiClient.ts` logs full request bodies, headers (including Authorization), and URLs at the `console.log` level. These logs persist on device and may be captured by crash reporting tools.

10. **MEDIUM: No brute-force protection on login endpoint** -- The `/auth/login` endpoint relies only on the anonymous rate limit (30 req/min per IP) with no account lockout, progressive delay, or CAPTCHA integration.

11. **MEDIUM: Webhook signature verification optional** -- `_verify_sendgrid_signature()` returns `True` when `SENDGRID_WEBHOOK_SECRET` is not configured, allowing unsigned webhook payloads in any environment lacking the secret.

12. **MEDIUM: CORS configuration overly permissive** -- Six localhost origins hardcoded alongside production origins, and `allow_headers=["*"]` permits any custom header. The wildcard should be replaced with an explicit allowlist.

13. **MEDIUM: Passwords transit through Core API in plaintext** -- Registration and onboarding flows receive user passwords in request bodies, then forward them to Supabase Auth Admin API. The Core API temporarily holds plaintext passwords in memory.

14. **MEDIUM: Exception details exposed in debug mode** -- The global exception handler returns `str(exc)` when `settings.DEBUG` is true, potentially leaking stack traces, SQL queries, and internal paths.

15. **LOW: JWT token prefix logged in debug mode** -- `security.py` line 61 logs the first 50 characters of JWT tokens, which includes the header and partial payload.

16. **LOW: CSP allows `unsafe-inline` and `unsafe-eval`** -- The Content Security Policy permits inline scripts and eval, weakening XSS protections. The comment notes this is "For docs" (Swagger/ReDoc), but these should be served under a separate CSP.

17. **LOW: No input sanitization layer visible** -- No evidence of HTML entity encoding, XSS filtering, or content sanitization on user-supplied fields (names, medical notes, addresses) before database storage.

18. **LOW: Stale Supabase project URL visible in schema docs** -- `SUPABASE_SCHEMA_DOCUMENTATION.txt` line 893 contains the actual project URL `olgjdqguafidgrutubih.supabase.co`, revealing the Supabase project identifier.

19. **INFO: Multiple `.env` files present across subprojects** -- `.env` files exist in `safetrekr-core/`, `safetrekr-app-v2/`, and `safetrekr-traveler-native/` with varying levels of gitignore coverage.

---

## Feature Inventory

### F-001: Multi-Tenant Organization Management

- **Description**: CRUD operations for organizations (K-12, churches, sports teams, businesses) with Stripe billing, credit systems, and hierarchical settings via JSONB.
- **User Value**: Enables platform-wide multi-tenancy with per-org billing and configuration.
- **Technical Implications**: Requires bulletproof tenant isolation at every layer (API, database, cache). The `org_id` field is the trust boundary. Settings stored in JSONB (suspension, configuration) need schema validation to prevent injection of arbitrary keys.
- **Priority Assessment**: **Critical** -- A tenant isolation failure exposes all organizations' trip and participant data.

### F-002: 10-Role RBAC System

- **Description**: Role-based access control across traveler, chaperone, org_admin, billing_admin, security_officer, analyst, hq_admin, hq_supervisor, hq_security, hq_ops. Enforced via `require_role()` dependency in FastAPI.
- **User Value**: Fine-grained access control ensuring users only access resources appropriate to their role.
- **Technical Implications**: Role is stored as a single text column in `users` table (no join table, no hierarchy table). Role escalation must be prevented at every endpoint. The `require_admin` shortcut combines `org_admin` + `hq_admin` + `hq_supervisor` which may be too broad for some operations. No role hierarchy enforcement -- an `hq_admin` and an `org_admin` are checked as equals despite very different trust levels.
- **Priority Assessment**: **Critical** -- Every endpoint's authorization depends on this system being correct.

### F-003: Dual Authentication System (Supabase Auth + Custom JWT)

- **Description**: Web app authenticates via Supabase Auth, receiving Supabase-issued JWTs. Mobile app receives custom JWTs issued by Core API's `/auth/consume-invite`, `/auth/register`, and `/auth/login` endpoints. Both token types are accepted by the Core API.
- **User Value**: Web users get standard SSO-ready auth; mobile users get invite-based onboarding without requiring Supabase client SDK.
- **Technical Implications**: Two independent token formats with different `sub` claim semantics create confusion. The `get_current_user()` function tries `auth_user_id` lookup first, then `id` lookup as fallback. An attacker who knows a `public.users.id` UUID could craft a Supabase-format JWT with that ID in the `sub` claim and it would match on the fallback path -- if they can obtain the JWT signing secret.
- **Priority Assessment**: **Critical** -- Authentication is the foundation; confusion here propagates everywhere.

### F-004: HMAC-SHA256 Invite Token System

- **Description**: Invite tokens use cryptographically secure random generation (32 bytes via `secrets.token_urlsafe`), HMAC-SHA256 hashing with server-side pepper, constant-time comparison, and status tracking (pending/sent/accepted/expired/revoked).
- **User Value**: Secure onboarding for travelers, chaperones, and guardians via email magic links and mobile deep links.
- **Technical Implications**: Well-implemented token security. However, the `consume-invite` endpoint in `auth.py` line 334 queries by raw token value (`eq("token", invite_token)`) rather than by HMAC hash, contradicting the HMAC design in `invite_token.py`. The `register_with_invite` endpoint (line 638) correctly uses `hash_token()`. This inconsistency means the `invites` table may store both raw tokens and hashed tokens depending on the creation path.
- **Priority Assessment**: **High** -- Inconsistent token handling could allow token reuse or bypass.

### F-005: Trip Safety Management (Core Domain)

- **Description**: Full trip lifecycle: creation, participant management, itinerary, flights, lodging, ground transportation, venues, emergency procedures, packet generation. The 185KB `trips.py` file contains 30+ endpoints.
- **User Value**: Core platform value -- organizations create and manage group travel with complete logistical tracking.
- **Technical Implications**: The massive trips.py route file is a maintenance and security review risk. Broad `except Exception` blocks with `try/except` swallow errors silently (documented in MEMORY.md as a known issue). All endpoints use service client (RLS bypass). Trip data includes PII for every participant.
- **Priority Assessment**: **High** -- Core domain with the largest attack surface.

### F-006: Real-Time Location Tracking and Geofencing

- **Description**: Foreground/background GPS tracking via expo-location, geofence region monitoring, violation detection, check-in status, participant location sharing for chaperone live maps.
- **User Value**: Safety monitoring during active trips -- chaperones can see where all travelers are in real-time.
- **Technical Implications**: Location data is among the most sensitive PII categories, especially for minors. Background location access requires explicit user consent and proper permission handling. Location data transmitted to server creates a persistent surveillance record. Geofence violations generate alerts that must be properly authorized. PostGIS geometry storage requires careful access control.
- **Priority Assessment**: **Critical** -- Real-time minor location tracking demands the highest security standard.

### F-007: Medical and Emergency Data Management

- **Description**: Medical notes, allergies, medications, dietary restrictions, emergency contacts stored per participant. Emergency procedures per trip. Emergency preparedness auditing.
- **User Value**: Critical safety information available during emergencies; compliance with duty-of-care obligations.
- **Technical Implications**: Medical data constitutes Protected Health Information (PHI) under HIPAA when associated with identifiable individuals. Currently stored as plaintext text columns. No field-level encryption, no access logging specifically for medical data reads, no data minimization controls.
- **Priority Assessment**: **Critical** -- PHI exposure creates regulatory liability and participant harm risk.

### F-008: Guardian Consent and Minor Protection

- **Description**: Guardian records linked to minor travelers, digital signature capture, consent tracking with IP logging, guardian override system, guardian governance workflows.
- **User Value**: Legal compliance for organizations transporting minors; verifiable parental consent chain.
- **Technical Implications**: COPPA requires verifiable parental consent for collection of children's PII. The current digital signature capture (base64 image in `signature_data` column) may not meet the "verifiable" standard. Consent IP logging is present but consent verification method needs legal review. The `guardian_overrides` system allows modifying guardian consent decisions, which must be tightly controlled.
- **Priority Assessment**: **Critical** -- COPPA violations carry penalties of $50,120 per violation as of 2024.

### F-009: Background Check Integration (Checkr/Sterling)

- **Description**: Background check ordering, status tracking, consent recording for adult participants (chaperones). Providers: Checkr, Sterling.
- **User Value**: Regulatory compliance for organizations that require background checks for adults supervising minors.
- **Technical Implications**: Background check data includes SSN, criminal history, and provider reference IDs. The `provider_ref` field links to external PII. Consent IP and timestamp are recorded. Data retention must comply with FCRA (Fair Credit Reporting Act) requirements. Background check results should be access-restricted beyond general trip access.
- **Priority Assessment**: **High** -- FCRA-regulated data with strict handling requirements.

### F-010: Intelligence Alert System (TarvaRI Integration)

- **Description**: Safety alerts from 5 intelligence sources (NOAA, USGS, CDC, ReliefWeb, GDACS) routed to trips. Role-based messaging variants, risk percentiles (P5/P50/P95), acknowledgment tracking, supersede chains, PostGIS geometry for spatial threat modeling.
- **User Value**: Proactive safety intelligence enabling trip leaders to respond to emerging threats.
- **Technical Implications**: TarvaRI service-to-service communication uses `TARVARI_INTERNAL_KEY` for authentication. Alert data influences safety decisions for minors -- integrity is paramount. Role-based copy variants must never leak adult-only threat details to traveler-facing messages. Acknowledgment tracking creates an audit trail with legal implications.
- **Priority Assessment**: **High** -- Safety-critical decision support system.

### F-011: Stripe Payment and Billing Integration

- **Description**: Organization billing, credit system, payment processing, order management, wallet/balance adjustments, pricing tiers.
- **User Value**: Platform monetization and organization billing management.
- **Technical Implications**: PCI-DSS scope depends on implementation. If Stripe handles all card data via Stripe.js/Elements, the platform is SAQ-A eligible. The `stripe_customer_id` on organizations links to Stripe customer records. Payment endpoints need strict role enforcement (billing_admin + hq roles). The exposed `stripe_creds.md` file is a PCI-DSS violation regardless of scope.
- **Priority Assessment**: **High** -- PCI-DSS compliance required for any payment handling.

### F-012: Push Notification System

- **Description**: Expo Push API integration for mobile alerts, batched sending (100/request), automatic token deactivation on `DeviceNotRegistered`, notification channels (alerts, safety, trip-updates).
- **User Value**: Real-time safety communication with travelers and chaperones.
- **Technical Implications**: Push notification tokens are PII that link to specific devices. Token registration/deregistration must be authenticated. Notification content must be role-appropriate (no medical details in push payloads). Notification channels must respect user preferences.
- **Priority Assessment**: **Medium** -- Notification integrity important for safety communications.

### F-013: File Upload and Storage

- **Description**: Profile photos, passport documents, trip packets (PDFs), consent forms. Storage via Supabase Storage.
- **User Value**: Document management for trip preparation and compliance.
- **Technical Implications**: Passport photos and documents are highly sensitive PII. File upload endpoints must validate file types, enforce size limits, scan for malware, and ensure Supabase Storage bucket policies restrict access. The `passport` upload flow in the mobile app handles government-issued document images.
- **Priority Assessment**: **High** -- Government document storage requires elevated protection.

### F-014: SendGrid Email and Webhook Integration

- **Description**: Invite emails via SendGrid dynamic templates, webhook event tracking (delivery, opens, clicks, bounces), suppression list management, email analytics.
- **User Value**: Email delivery for onboarding invitations and safety communications.
- **Technical Implications**: Webhook endpoint is public (no JWT auth). Signature verification is optional (fails open if secret not configured). Webhook payloads may contain email addresses and behavioral data. Suppression list contains bounced/spam-reported addresses which are PII. The comms_log table creates a complete communication audit trail.
- **Priority Assessment**: **Medium** -- Email system integrity affects onboarding and safety communication delivery.

### F-015: Analyst Trip Review Workflow

- **Description**: Queue management, trip assignment, 17-section safety review, issue tracking, checklist completion, evidence logging, analyst activity tracking.
- **User Value**: Professional safety review ensuring trips meet safety standards before departure.
- **Technical Implications**: Analyst access crosses organizational boundaries -- analysts review trips from multiple organizations. The review queue assignment system must prevent unauthorized trip access. Analyst comments and issues contain safety assessments that could have legal weight. Evidence logs use immutable-append patterns.
- **Priority Assessment**: **High** -- Cross-tenant access patterns require careful authorization.

### F-016: SMS Broadcast System

- **Description**: SMS messaging to trip participants via the mobile app, with participant phone number access.
- **User Value**: Emergency communications when internet/push notifications are unavailable.
- **Technical Implications**: Phone numbers are PII. The broadcast feature must verify the sender is an authorized trip leader. SMS costs must be controlled. Phone number exposure in the broadcast interface must be limited to authorized roles.
- **Priority Assessment**: **Medium** -- Communication integrity for emergency scenarios.

### F-017: Offline-First Mobile Architecture

- **Description**: TanStack Query with offline configuration, expo-sqlite for offline queue, network detection, queue sync on reconnect.
- **User Value**: Mobile app functionality in areas with poor connectivity (common in travel).
- **Technical Implications**: Offline-stored data on device includes trip details, participant info, and location data. The SQLite database on device is not encrypted by default. Data synced from offline queue must be validated server-side to prevent replay attacks or data injection.
- **Priority Assessment**: **Medium** -- Device-local data protection for sensitive trip information.

### F-018: Deep Link Onboarding (Mobile)

- **Description**: `safetrekr://invite?token=xxx` deep links for mobile app onboarding, token validation, registration, and trip joining.
- **User Value**: Frictionless mobile onboarding from email invitations.
- **Technical Implications**: Deep links can be intercepted by malicious apps on Android (intent hijacking). The token in the deep link URL could be logged by intermediate systems. The `/join` page must validate tokens server-side, not client-side. The registration flow creates both a Supabase Auth user and a public users record -- failure between these steps requires compensation (rollback).
- **Priority Assessment**: **Medium** -- Onboarding security affects all mobile users.

### F-019: Safety Digest Distribution

- **Description**: Multi-channel safety digest delivery (email, push) with per-recipient audit trail, distribution status tracking.
- **User Value**: Regular safety updates to all trip stakeholders with delivery verification.
- **Technical Implications**: Digest content may contain sensitive safety information. Distribution to the correct audience (role-based) is critical. The comms_log audit trail must be tamper-resistant.
- **Priority Assessment**: **Medium** -- Safety communication integrity.

---

## Opportunities and Gaps

### Critical Gaps

**GAP-001: Credential Exposure**
The `stripe_creds.md` file at the project root contains production Stripe dashboard credentials in plaintext. Even though it is currently untracked, it is present in the working directory and could be accidentally committed. The Stripe password must be rotated immediately, and the file must be deleted and added to `.gitignore`.

**GAP-002: Row Level Security Not Production-Ready**
The Supabase schema documentation explicitly flags development RLS policies (`USING (true)`) on multiple tables. The production RLS policies for `trip_alerts` are commented out (lines 875-884 in schema docs). This means the PostgREST API (Supabase's auto-generated REST layer) grants anonymous read access to sensitive tables. Until production RLS policies are deployed and the development policies removed, the database layer provides zero access control.

**GAP-003: No Token Revocation Mechanism**
Neither the Supabase Auth session tokens nor the custom mobile JWT tokens can be revoked before expiry. If a user's device is lost or compromised, their 30-day refresh token remains valid. There is no token blacklist, no token family rotation, and no revocation endpoint.

**GAP-004: Service Client Over-Use Eliminates Defense-in-Depth**
The `get_service_supabase()` client bypasses all RLS and is used as the default across nearly every endpoint. This means a single vulnerability in any FastAPI route handler (SQL injection via Supabase client, IDOR, role bypass) grants unrestricted database access. The anon client (`get_supabase()`) should be the default, with service client reserved for specific admin operations.

### High-Severity Gaps

**GAP-005: COPPA Compliance Incomplete**
The platform collects children's PII (name, date of birth, location, medical information, photos) but lacks:
- Verifiable parental consent mechanism (digital signature alone may be insufficient)
- Data deletion workflow (guardian-initiated data removal)
- Data minimization controls (minimum necessary collection)
- Children's privacy policy
- COPPA-compliant data retention limits

**GAP-006: PHI Not Encrypted at Rest (Field-Level)**
Medical notes, allergies, medications, and emergency contacts are stored as plaintext text columns. While Supabase encrypts the database volume at rest (AWS EBS encryption), this does not satisfy HIPAA's requirement for data-level encryption accessible only to authorized roles. A database administrator or a broad `SELECT *` would expose all PHI.

**GAP-007: No Audit Logging for Sensitive Data Access**
There is no mechanism to log who accessed medical data, minor PII, guardian consent records, or background check results. For COPPA, HIPAA, and FERPA compliance, read-access audit trails are required.

**GAP-008: Inconsistent Token Handling Between Invite Endpoints**
The `consume-invite` endpoint queries by raw token value, while `register_with_invite` correctly uses HMAC hash. This inconsistency suggests the `invites` table may contain both raw and hashed tokens depending on which creation path was used, undermining the HMAC security model.

### Medium-Severity Gaps

**GAP-009: No Web Application Firewall (WAF)**
No WAF or API gateway with request inspection is configured in front of the Core API. The Kubernetes ingress provides TLS termination but no request filtering, SQL injection detection, or anomalous request blocking.

**GAP-010: No Dependency Vulnerability Scanning**
No evidence of Snyk, Dependabot, or `pip-audit` in the CI/CD pipeline. The `requirements.txt` pins versions but does not appear to be scanned for known CVEs.

**GAP-011: No SAST/DAST in CI Pipeline**
No static analysis (bandit for Python, ESLint security plugin for TypeScript) or dynamic analysis tools are configured in the GitHub Actions workflow.

**GAP-012: Mobile Device Data at Rest**
The mobile app uses `expo-secure-store` for JWT tokens (good), but trip data, participant information, and location history cached by TanStack Query or expo-sqlite are not encrypted at rest on the device.

**GAP-013: No Content Security Policy for Web App**
The Next.js web application does not appear to configure Content Security Policy headers. The CSP in `security.py` only applies to the API responses. The web app frontend needs its own CSP in `next.config.ts`.

### Attack Surface Analysis

| Surface | Exposure | Sensitivity | Risk |
|---------|----------|-------------|------|
| Core API (port 8001) | Internet-facing | All data | Critical |
| Supabase PostgREST | Internet-facing | All data (dev RLS) | Critical |
| Next.js web app | Internet-facing | Session tokens, UI | High |
| Mobile app (on-device) | Physical access | Cached data, tokens | High |
| SendGrid webhook | Internet-facing (public) | Email metadata | Medium |
| Redis cache | Internal network | Cached tokens, data | Medium |
| Supabase Realtime | Internet-facing | Subscribed data | Medium |
| Deep links (safetrekr://) | Device-local | Invite tokens | Low |

---

## Recommendations

### Recommendation 1: Immediate Credential Rotation and Secret Remediation (CRITICAL -- Do Today)

**Action**:
- Delete `stripe_creds.md` from the repository and working directory immediately.
- Add `stripe_creds.md` and `*_creds*` patterns to `.gitignore` at the root level.
- Rotate the Stripe dashboard password immediately via Stripe's dashboard.
- Run `git log --all --full-history -- stripe_creds.md` to verify the file was never committed to git history. If it was, treat the password as compromised and rotate all Stripe API keys.
- Audit all `.env` files across the monorepo for consistency with `.gitignore` coverage.
- Scan the full git history with a tool like `trufflehog` or `gitleaks` for any other credential exposures.

**Why**: A single exposed credential can lead to full account compromise. Stripe credentials provide access to payment data, customer billing, and financial operations.

### Recommendation 2: Deploy Production RLS Policies and Reduce Service Client Usage (HIGH -- This Sprint)

**Action**:
- Audit every table with RLS enabled and replace `USING (true)` development policies with proper tenant-isolated policies.
- Implement the commented-out production policies for `trip_alerts` and other tables.
- Refactor the Core API to use `get_supabase()` (anon client, RLS-enforced) as the default. Reserve `get_service_supabase()` for the 3-4 operations that genuinely require RLS bypass (user lookup during auth, admin user creation, cross-org analytics).
- For each endpoint currently using service client, document why RLS bypass is needed or migrate to the anon client with proper JWT-based RLS policies.

**Why**: Defense-in-depth is not optional when handling minor PII and medical data. The database layer must independently enforce access control, so a single application vulnerability does not cascade to unrestricted data access.

### Recommendation 3: Implement Token Revocation and Unify Authentication (HIGH -- Next Sprint)

**Action**:
- Add a Redis-backed token blacklist for refresh token revocation. On logout, device-loss report, or account suspension, add the token's `jti` claim to the blacklist.
- Implement refresh token rotation with token family tracking (if a revoked refresh token is reused, revoke the entire family -- this detects stolen tokens).
- Enable JWT audience verification in `security.py` (`verify_aud: True`) and configure accepted audiences.
- Standardize the mobile JWT flow to use the same `sub` claim semantics as Supabase Auth (use `auth_user_id` consistently), or implement a clear token-type discriminator in the validation logic.
- Add a `/auth/revoke` endpoint that marks a user's tokens as invalid.

**Why**: Without revocation, a compromised token grants 30 days of access with no recourse. The dual auth system confusion creates bypass opportunities that grow more dangerous as the platform scales.

### Recommendation 4: Establish COPPA/FERPA Compliance Program (HIGH -- This Quarter)

**Action**:
- Engage legal counsel specializing in children's online privacy to conduct a COPPA readiness assessment.
- Implement verifiable parental consent using an FTC-approved method (signed consent form with identity verification, credit card transaction, government ID check, or video conference verification).
- Build a guardian-initiated data deletion workflow per COPPA's "right to delete."
- Implement data minimization: collect only the minimum PII necessary for trip safety.
- Draft and publish a children's privacy policy.
- Implement field-level encryption for medical data, minor PII, and guardian information using Supabase's `pgsodium` extension or application-level envelope encryption with a KMS.
- Add audit logging for all access to minor PII and medical data.

**Why**: SafeTrekr's primary market (K-12 schools, youth sports, churches) means the majority of participants are minors. COPPA enforcement has intensified, with the FTC issuing record fines in 2024-2025. FERPA applies when schools are the contracting organization.

### Recommendation 5: Harden the CI/CD Pipeline with Security Scanning (MEDIUM -- Next Sprint)

**Action**:
- Add `bandit` (Python SAST) and `trivy` (container scanning) to the GitHub Actions CI pipeline. Block merges on high-severity findings.
- Add `gitleaks` or `trufflehog` as a pre-commit hook and CI step to prevent credential commits.
- Add `pip-audit` for Python dependency CVE scanning and configure Dependabot or Renovate for JavaScript dependencies.
- Implement the CSP header for the Next.js web application via `next.config.ts` headers configuration.
- Remove all `console.log` statements from the mobile API client's production code path, or gate them behind a `__DEV__` flag.
- Add account lockout (5 failed attempts = 30-minute cooldown) to the `/auth/login` endpoint.
- Configure the SendGrid webhook endpoint to require signature verification in all environments (remove the fail-open behavior).

**Why**: Shift-left security catches 70-80% of common vulnerabilities before they reach production. The current pipeline has no security gates, meaning any developer can merge code containing credentials, known-vulnerable dependencies, or injection flaws.

---

## Dependencies and Constraints

### Regulatory Requirements

| Regulation | Applicability | Key Requirements | Current Status |
|------------|--------------|------------------|----------------|
| **COPPA** (Children's Online Privacy Protection Act) | **Mandatory** -- Platform collects PII of children under 13 via K-12 school customers | Verifiable parental consent, data minimization, right to delete, privacy policy, reasonable security | **Gap**: Digital signature may not satisfy "verifiable" standard; no deletion workflow; no children's privacy policy |
| **FERPA** (Family Educational Rights and Privacy Act) | **Mandatory** -- When schools are customers, student records are FERPA-protected | Written consent for disclosure, parent access rights, security safeguards, audit trail | **Gap**: No FERPA-specific access controls; no parent data access portal; medical/behavioral data mixed with general trip data |
| **HIPAA** (Health Insurance Portability and Accountability Act) | **Likely applicable** -- Medical notes, allergies, medications collected for trip safety may constitute PHI | Encryption, access controls, audit trail, BAA with Supabase, minimum necessary standard | **Gap**: No field-level encryption for PHI; no BAA with Supabase documented; no PHI-specific access logging |
| **GDPR** (General Data Protection Regulation) | **Applicable for international trips** -- EU/UK travelers, organizations with EU operations | Lawful basis, DPO, DPIA, data subject rights, breach notification, cross-border transfer safeguards | **Gap**: No DPIA conducted; no consent management beyond guardian consent; no data subject rights endpoints |
| **PCI-DSS** | **SAQ-A eligible** -- Assuming Stripe handles all card data (no card numbers touch SafeTrekr servers) | Maintain PCI compliance questionnaire, protect Stripe API keys, network segmentation | **Gap**: Stripe credentials exposed in `stripe_creds.md`; need to verify no card data touches Core API |
| **FCRA** (Fair Credit Reporting Act) | **Applicable** -- Background check integration with Checkr/Sterling | Permissible purpose, adverse action procedures, data retention limits, secure disposal | **Partial**: Consent tracking present; need to verify adverse action workflow and retention policy |
| **State Privacy Laws** (CCPA/CPRA, state COPPA analogs) | **Applicable** -- California and 15+ other states with children's data protection laws | Varies by state; generally stricter than federal COPPA for minors 13-17 | **Gap**: No state-specific compliance mapping |

### Technical Dependencies

- **Supabase**: Database, auth, storage, realtime. Single vendor dependency for all data layer services. Any Supabase outage is a total platform outage.
- **Doppler**: Secrets management. If Doppler is unavailable during container startup, the application cannot start (secrets are injected at runtime).
- **Redis**: Cache and rate limiting. Currently configured as fail-open -- Redis unavailability disables rate limiting.
- **SendGrid**: Email delivery for invitations and safety communications. Webhook integrity depends on correct secret configuration.
- **Stripe**: Payment processing. API key security is critical.
- **Expo Push**: Mobile notification delivery. Token lifecycle management required.
- **Checkr/Sterling**: Background check providers. PII flows to external services.
- **TarvaRI**: Intelligence service. Service-to-service authentication via shared internal key.

### Security Tooling Needs

| Tool Category | Recommended Tool | Priority | Purpose |
|---------------|-----------------|----------|---------|
| Secret scanning | gitleaks + pre-commit | Immediate | Prevent credential commits |
| SAST (Python) | bandit | High | Static analysis for injection, crypto issues |
| SAST (TypeScript) | eslint-plugin-security | High | Static analysis for XSS, prototype pollution |
| Container scanning | trivy | High | CVE detection in Docker images |
| Dependency scanning | pip-audit + Dependabot | High | Known vulnerability detection |
| WAF | Cloudflare WAF or AWS WAF | Medium | Request filtering, DDoS protection |
| DAST | OWASP ZAP | Medium | Dynamic testing of running application |
| Encryption | pgsodium or AWS KMS | High | Field-level encryption for PHI |
| Audit logging | Custom + immutable store | High | COPPA/HIPAA-required access trails |

---

## Files Referenced in This Analysis

| File | Security Relevance |
|------|-------------------|
| `/Users/justintabb/projects/safetrekr/stripe_creds.md` | CRITICAL: Contains plaintext Stripe credentials |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/core/security.py` | JWT validation, RBAC enforcement, audience verification disabled |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/core/config.py` | All secrets configuration, CORS origins |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/middleware/rate_limit.py` | Rate limiting with fail-open on Redis failure |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/middleware/security.py` | Security headers, CSP, HSTS |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/services/invite_token.py` | HMAC token security (well-implemented) |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/auth.py` | Custom JWT issuance, login, registration, refresh |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/webhooks.py` | SendGrid webhook with optional signature verification |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/trips.py` | Largest route file (185KB), extensive service client usage |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/src/db/supabase.py` | Service client (RLS bypass) implementation |
| `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/shared/auth/auth-provider.tsx` | Web auth state management, dual session store |
| `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/shared/auth/auth-store.ts` | Zustand persist store with tokens in localStorage |
| `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/lib/env.ts` | Runtime environment variable injection |
| `/Users/justintabb/projects/safetrekr/safetrekr-traveler-native/providers/AuthProvider.tsx` | Mobile auth with SecureStore, multi-trip support |
| `/Users/justintabb/projects/safetrekr/safetrekr-traveler-native/lib/api/apiClient.ts` | Mobile API client with verbose logging |
| `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/SUPABASE_SCHEMA_DOCUMENTATION.txt` | Database schema, RLS policies, development warnings |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/Dockerfile` | Non-root user, Doppler injection, container hardening |
| `/Users/justintabb/projects/safetrekr/safetrekr-core/k8s/prod/deployment.yaml` | K8s security context, resource limits |

---

*End of Security Discovery Analysis*
