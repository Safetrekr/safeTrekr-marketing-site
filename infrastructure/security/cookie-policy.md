# Cookie Inventory and Security Policy

**Ticket:** ST-872 (REQ-117)
**Last Reviewed:** 2026-03-24
**Owner:** Security / Engineering

---

## Overview

The SafeTrekr marketing site minimizes cookie usage by design. There are no
custom application cookies -- server-side session state is managed entirely
by Supabase. This document inventories all cookies that may be set by
first-party code or third-party integrations and specifies the required
security attributes for each.

---

## Cookie Inventory

### 1. Cloudflare Turnstile (Session Cookies)

| Attribute       | Value                              |
|-----------------|------------------------------------|
| **Source**      | Cloudflare Turnstile challenge     |
| **Domain**      | `.challenges.cloudflare.com`       |
| **Classification** | Strictly Necessary              |
| **Purpose**     | Anti-bot verification. Required for form submissions to pass the Turnstile CAPTCHA challenge. No user tracking or profiling. |
| **SameSite**    | `Lax`                              |
| **Secure**      | `true` (HTTPS only)                |
| **HttpOnly**    | Set by Cloudflare (varies by cookie) |
| **Lifetime**    | Session (cleared when browser closes) |
| **Consent Required** | No -- strictly necessary for security functionality. Exempt under GDPR Art. 5(3) and ePrivacy Directive Art. 5(3). |

**Cookies set by Turnstile:**

- `cf_clearance` -- Cloudflare challenge clearance token. Proves the visitor passed the Turnstile challenge. Session-scoped, `SameSite=Lax`, `Secure`.
- `__cf_bm` -- Cloudflare bot management cookie. Used to distinguish humans from automated traffic. Short-lived (30 minutes), `SameSite=None`, `Secure`.

**Notes:**
- These cookies are set by Cloudflare's infrastructure, not by SafeTrekr application code.
- They are required for form functionality (demo request, contact, quote) and cannot be deferred behind a consent banner.
- If a visitor's browser blocks these cookies, Turnstile may fall back to an interactive challenge or fail (handled by the `onLoadError` callback in `TurnstileWidget`).

---

### 2. Plausible Analytics

| Attribute       | Value                              |
|-----------------|------------------------------------|
| **Source**      | Plausible Analytics script         |
| **Classification** | Not applicable                  |
| **Purpose**     | Privacy-friendly web analytics     |
| **Cookies Set** | **None**                           |
| **Consent Required** | No -- Plausible is cookieless by design. |

**Notes:**
- Plausible Analytics does not use cookies, localStorage, or any form of persistent client-side storage.
- All analytics data is derived from the page request itself (URL, referrer, screen size, country via IP geolocation).
- IP addresses are discarded after the request is processed; they are never stored.
- Plausible is compliant with GDPR, CCPA, and PECR without a consent banner.
- Script source: `https://plausible.io/js/script.js`

---

### 3. Google Analytics 4 (GA4) -- Consent-Gated

| Attribute       | Value                              |
|-----------------|------------------------------------|
| **Source**      | Google Analytics 4 (`gtag.js`)     |
| **Domain**      | `.safetrekr.com` (first-party via gtag) |
| **Classification** | Analytics / Performance          |
| **Purpose**     | Behavioral analytics and conversion tracking. Only active after explicit user consent. |
| **SameSite**    | `Lax`                              |
| **Secure**      | `true` (HTTPS only)                |
| **Consent Required** | **Yes** -- loaded ONLY after user grants consent. |

**Cookies set by GA4 (only after consent):**

| Cookie Name | Purpose | Lifetime | SameSite | Secure |
|-------------|---------|----------|----------|--------|
| `_ga`       | Distinguishes unique visitors | 2 years | `Lax` | `true` |
| `_ga_<ID>`  | Maintains session state | 2 years | `Lax` | `true` |
| `_gid`      | Distinguishes visitors (24h) | 24 hours | `Lax` | `true` |
| `_gat`      | Throttles request rate | 1 minute | `Lax` | `true` |

**Consent implementation:**
- The `GA4Script` component (`src/components/analytics/ga4-script.tsx`) checks `localStorage` for key `analytics-consent` with value `"granted"` before loading any GA4 scripts.
- If consent has NOT been granted, zero GA4 scripts are loaded and zero cookies are set.
- GA4 is configured with `anonymize_ip: true` to truncate IP addresses before storage.
- The consent mechanism satisfies GDPR Art. 6(1)(a) (explicit consent) and COPPA requirements for K-12 environments.

---

### 4. Application Cookies

| Attribute       | Value                              |
|-----------------|------------------------------------|
| **Cookies Set** | **None**                           |

**Notes:**
- The SafeTrekr marketing site does not set any custom application cookies.
- There is no client-side session management -- the site is a stateless marketing site.
- Server-side operations (form submissions, rate limiting) use Supabase directly from Server Actions and API routes without cookies.
- Authentication (for the main SafeTrekr application, not the marketing site) is handled by Supabase Auth on a separate domain and is outside the scope of this policy.

---

## Security Requirements Summary

All cookies that are set on the SafeTrekr marketing domain MUST comply with
the following baseline requirements:

| Requirement | Standard | Enforcement |
|-------------|----------|-------------|
| `Secure` flag | All cookies MUST be set with `Secure` | Enforced by HSTS preload (`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`) |
| `SameSite` attribute | MUST be `Lax` or `Strict` (never `None` except for Cloudflare bot management) | Third-party cookies from Cloudflare use `SameSite=None` with `Secure` as required by the spec |
| `HttpOnly` flag | Recommended for all server-set cookies | Cloudflare sets this on its own cookies; not applicable to GA4 (client-side) |
| No PII in cookie values | Cookie values MUST NOT contain personally identifiable information | GA4 uses opaque identifiers; Cloudflare uses challenge tokens |
| Consent before analytics | Analytics cookies MUST NOT be set before explicit user consent | Enforced by the `GA4Script` consent gate |

---

## Compliance Matrix

| Regulation | Requirement | SafeTrekr Compliance |
|------------|-------------|---------------------|
| **GDPR Art. 5(3)** | Strictly necessary cookies exempt from consent | Turnstile cookies are strictly necessary; Plausible is cookieless; GA4 requires consent |
| **GDPR Art. 6(1)(a)** | Analytics require explicit consent | GA4 only loads after localStorage consent check |
| **ePrivacy Directive** | Consent for non-essential cookies | Only GA4 sets non-essential cookies; gated by consent |
| **COPPA** | No tracking of children without verifiable parental consent | GA4 disabled by default; Plausible is cookieless; suitable for K-12 audiences |
| **FERPA** | Student data protection | No student data is collected or stored in cookies |
| **CCPA** | Right to opt out of sale of personal information | No personal information is sold; GA4 consent can be revoked |

---

## Review Schedule

This cookie inventory MUST be reviewed:
- When any new third-party script is added to the site
- When analytics providers change their cookie behavior
- Quarterly, as part of the security compliance review cycle
- After any change to the consent management implementation

---

## Change Log

| Date | Change | Ticket |
|------|--------|--------|
| 2026-03-24 | Initial cookie inventory and security policy | ST-872 |
