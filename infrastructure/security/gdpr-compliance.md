# ST-835: REQ-099 -- GDPR/CCPA Compliance Documentation

> SafeTrekr Marketing Site -- Data handling practices, subject rights, and compliance procedures.

## 1. Data We Collect

| Data Category | Table | Fields | Lawful Basis (GDPR) | Retention |
|---|---|---|---|---|
| Form submissions | `form_submissions` | email, first_name, last_name, organization, ip_hash, UTM params, referrer | Consent (form submission) | 2 years, then deleted |
| Newsletter subscriptions | `newsletter_subscribers` | email, first_name, segment, confirmation status | Consent (double opt-in) | Until unsubscribed + 30 days |
| Analytics events | `analytics_events` | event_name, page_path, session_id, data (JSONB, may contain email) | Legitimate interest | 90 days |
| Rate limiting | `rate_limits` | ip_hash (anonymized), action | Legitimate interest | 24 hours |
| A/B test assignments | `ab_test_assignments` | session_id, test_name, variant | Legitimate interest | 90 days |

### Data We Do NOT Collect

- Raw IP addresses (hashed with `IP_HASH_SALT` before storage)
- Payment or financial information
- Government-issued identifiers
- Biometric data
- Location data beyond what the user voluntarily provides

## 2. Data Subject Rights Implementation

### Right to Erasure (Article 17 GDPR / CCPA Delete)

A PostgreSQL function `gdpr_erase_by_email(target_email text)` is deployed as a Supabase migration. It deletes all records matching the given email from:

- `form_submissions` (by `email` column)
- `newsletter_subscribers` (by `email` column)
- `analytics_events` (by `email` within `data` JSONB field)

**Execution procedure:**

```sql
SELECT gdpr_erase_by_email('user@example.com');
```

Returns a JSONB summary:
```json
{
  "form_submissions_deleted": 3,
  "newsletter_subscribers_deleted": 1,
  "analytics_events_deleted": 0
}
```

**Who can execute:** Only service-role connections (bypasses RLS). This is an admin-only operation.

### Right to Data Portability (Article 20 GDPR / CCPA Access)

A PostgreSQL function `gdpr_export_by_email(target_email text)` returns all data associated with an email address as JSONB:

```sql
SELECT gdpr_export_by_email('user@example.com');
```

Returns:
```json
{
  "form_submissions": [ ... ],
  "newsletter_subscribers": [ ... ],
  "analytics_events": [ ... ]
}
```

**Response time SLA:** Within 30 days of request (GDPR requirement). Target: within 48 hours.

### Right to Rectification (Article 16 GDPR)

Manual process. Contact `privacy@safetrekr.com` with corrections. An admin updates the relevant records via Supabase dashboard or direct SQL.

### Right to Restrict Processing (Article 18 GDPR)

Not currently automated. If requested, an admin manually anonymizes the record by replacing PII fields with `[REDACTED]` while retaining the row for audit purposes.

## 3. Consent Management

### Form Submissions

- Every form includes a consent checkbox: "I agree to SafeTrekr's Privacy Policy."
- The `turnstile_verified` flag confirms the submission came from a real user.
- No data is stored until the user submits the form (no pre-fill tracking).

### Newsletter

- Double opt-in: a confirmation email is sent with a unique token.
- The `confirmed_at` timestamp records when consent was given.
- The `unsubscribed_at` timestamp records revocation of consent.
- Unsubscribed users are soft-deleted (retained for 30 days to prevent re-subscription spam, then hard-deleted).

### Analytics

- Plausible Analytics is used as the primary analytics provider (privacy-focused, no cookies).
- Server-side `analytics_events` are minimal and do not track across sessions.
- IP addresses are hashed before storage; the original IP is never persisted.

## 4. Data Processing Agreements

| Sub-processor | Purpose | DPA Status | Data Transferred |
|---|---|---|---|
| Supabase | Database hosting | DPA in place | All table data |
| SendGrid (Twilio) | Email delivery | DPA in place | Email addresses, names |
| Cloudflare | CDN, Turnstile bot protection | DPA in place | IP addresses (transient) |
| DigitalOcean | Kubernetes cluster hosting | DPA in place | Application runtime data |
| Plausible Analytics | Privacy-focused web analytics | DPA in place | Page views (no PII) |
| MapTiler | Map tile rendering | DPA in place | No PII (client-side only) |

## 5. Data Breach Notification Procedure

1. **Detection:** Automated alerts via monitoring (Supabase audit logs, K8s security events).
2. **Assessment:** Within 24 hours, determine scope, affected data subjects, and severity.
3. **Notification to Authority:** Within 72 hours of becoming aware (GDPR Article 33).
4. **Notification to Data Subjects:** Without undue delay if high risk (GDPR Article 34).
5. **Documentation:** Record the breach, its effects, and remedial actions in an incident report.

## 6. CCPA-Specific Requirements

| CCPA Right | Implementation |
|---|---|
| Right to Know | `gdpr_export_by_email()` function |
| Right to Delete | `gdpr_erase_by_email()` function |
| Right to Opt-Out of Sale | SafeTrekr does not sell personal information. No "Do Not Sell" toggle required. |
| Right to Non-Discrimination | No service degradation for exercising rights. |

## 7. Technical Safeguards

- **Encryption at rest:** Supabase encrypts all data at rest (AES-256).
- **Encryption in transit:** All connections use TLS 1.2+ (enforced by network policy and ingress).
- **Access control:** Row-Level Security (RLS) enabled on all user-facing tables.
- **IP anonymization:** IPs are hashed with HMAC-SHA256 using `IP_HASH_SALT` before storage.
- **Minimal data collection:** Only fields necessary for the stated purpose are collected.
- **Automated cleanup:** Future enhancement -- scheduled job to purge expired data per retention policy.
