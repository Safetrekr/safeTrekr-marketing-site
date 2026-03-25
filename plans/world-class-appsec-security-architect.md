---SECURE_ARCHITECTURE---

# SafeTrekr Marketing Site -- Security Architecture PRD

**Date**: 2026-03-24
**Author**: World-Class AppSec Security Architect
**Project**: SafeTrekr Marketing Website
**Stack**: Next.js 15 (App Router) / React 19 / Docker / Kubernetes (DigitalOcean DOKS) / Supabase / SendGrid / Cloudflare Turnstile / Plausible
**Deployment**: GitHub Actions -> Docker Build -> DigitalOcean Container Registry -> DOKS -> Nginx Ingress Controller -> Cloudflare DNS
**Classification**: Internal -- Architecture Specification

---

## Executive Summary

SafeTrekr sells documented trust. The marketing site is not a brochure; it is the primary revenue instrument for a founder-led company with no sales team. Every security decision in this document reflects that reality. If the marketing site is compromised, defaced, or caught leaking data, the product's core value proposition -- "we protect your people and prove it" -- collapses overnight. The buyer personas (K-12 risk managers, church administrators, corporate travel directors) evaluate vendor security posture before signing. The marketing site IS the first security audit.

This PRD defines 15 security domains with 78 functional requirements. It corrects the Chief Technology Architect's CSP specification (which used `unsafe-inline` and `unsafe-eval`) to a nonce-based policy compatible with Next.js 15. It adapts all infrastructure security controls from the Vercel-oriented architecture to the binding DigitalOcean DOKS deployment target. It adds Kubernetes-specific controls (NetworkPolicy, Pod Security Standards, cert-manager) that were absent from the original architecture.

**Critical Correction**: The CTA architect's CSP included `'unsafe-inline'` and `'unsafe-eval'` in `script-src`. This PRD replaces those directives with nonce-based script authorization. `unsafe-inline` and `unsafe-eval` are explicitly prohibited. This is non-negotiable for a company that sells security.

---

## Table of Contents

1. [HTTP Security Headers](#1-http-security-headers)
2. [Content Security Policy (Nonce-Based)](#2-content-security-policy-nonce-based)
3. [Form Security (8-Layer Defense)](#3-form-security-8-layer-defense)
4. [Rate Limiting](#4-rate-limiting)
5. [Bot Protection](#5-bot-protection)
6. [Supply Chain Security](#6-supply-chain-security)
7. [Secret Management](#7-secret-management)
8. [Network Security (Kubernetes)](#8-network-security-kubernetes)
9. [SSL/TLS Certificate Management](#9-ssltls-certificate-management)
10. [CORS Policy](#10-cors-policy)
11. [Cookie Security](#11-cookie-security)
12. [GDPR/CCPA Compliance](#12-gdprccpa-compliance)
13. [WCAG 2.2 AA (Accessibility as Security)](#13-wcag-22-aa-accessibility-as-security)
14. [Incident Response Plan](#14-incident-response-plan)
15. [Dependency Vulnerability Scanning](#15-dependency-vulnerability-scanning)

---

## 1. HTTP Security Headers

All HTTP security headers are applied in Next.js middleware (`middleware.ts`), enforced on every response. The Nginx Ingress Controller provides a secondary enforcement layer for any response that bypasses the application.

### FR-SEC-001: Strict-Transport-Security (HSTS)

**Requirement**: All responses MUST include the HSTS header with preload eligibility.

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Implementation Notes**:
- `max-age=31536000` (1 year) is the minimum for HSTS preload list submission.
- `includeSubDomains` covers `www.safetrekr.com`, future subdomains, and prevents downgrade attacks on any subdomain.
- Submit to the HSTS preload list at `hstspreload.org` after launch confirmation.
- The Nginx Ingress Controller MUST also set this header via annotation `nginx.ingress.kubernetes.io/configuration-snippet` as a defense-in-depth measure.
- **Enforcement**: Automated test in CI verifies header presence on every route.

### FR-SEC-002: X-Frame-Options

**Requirement**: Prevent clickjacking by denying all framing.

```
X-Frame-Options: DENY
```

**Implementation Notes**:
- `DENY` is preferred over `SAMEORIGIN` because the marketing site has no legitimate reason to be framed, including by itself.
- The CSP `frame-ancestors 'none'` directive (FR-SEC-013) provides the modern equivalent. Both headers are set for backward compatibility with older browsers.

### FR-SEC-003: X-Content-Type-Options

**Requirement**: Prevent MIME-type sniffing.

```
X-Content-Type-Options: nosniff
```

**Implementation Notes**:
- Prevents browsers from interpreting files as a different MIME type than declared in the `Content-Type` header.
- Critical for user-uploaded content paths (none at launch, but establishes the baseline for future blog image uploads).

### FR-SEC-004: Referrer-Policy

**Requirement**: Control referrer information leakage.

```
Referrer-Policy: strict-origin-when-cross-origin
```

**Implementation Notes**:
- Same-origin requests: full URL is sent as referrer (needed for Plausible Analytics attribution).
- Cross-origin requests: only the origin (scheme + host) is sent.
- HTTPS-to-HTTP requests: no referrer is sent.
- This preserves UTM tracking functionality while preventing full URL leakage to third parties.

### FR-SEC-005: Permissions-Policy

**Requirement**: Disable browser features not required by the marketing site.

```
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=(), browsing-topics=(), serial=(), hid=(), bluetooth=(), display-capture=()
```

**Implementation Notes**:
- `camera=()`, `microphone=()`: No media capture is needed.
- `geolocation=()`: The marketing site does not use client geolocation. MapLibre displays static/interactive maps without requiring device location.
- `payment=()`: No payment flow on the marketing site at launch. When Stripe integration ships, this will be updated to `payment=(self)`.
- `interest-cohort=()`: Blocks FLoC. `browsing-topics=()`: Blocks Topics API. Both are critical for the privacy-first positioning with K-12 and church audiences.
- All other features disabled as defense-in-depth.

### FR-SEC-006: Cross-Origin Headers

**Requirement**: Control cross-origin resource sharing at the browser level.

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-site
Cross-Origin-Embedder-Policy: unsafe-none
```

**Implementation Notes**:
- `Cross-Origin-Opener-Policy: same-origin` isolates the browsing context, preventing `window.opener` attacks.
- `Cross-Origin-Resource-Policy: same-site` restricts resource loading to same-site contexts.
- `Cross-Origin-Embedder-Policy: unsafe-none` is required because MapLibre GL JS uses Web Workers that load cross-origin tile data from MapTiler. Setting `require-corp` would break map rendering. This is an accepted tradeoff documented in the risk register.

### FR-SEC-007: X-DNS-Prefetch-Control

**Requirement**: Enable DNS prefetching for performance.

```
X-DNS-Prefetch-Control: on
```

### FR-SEC-008: Middleware Implementation Pattern

**Requirement**: All security headers MUST be applied in a single middleware function that executes on every request.

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const response = NextResponse.next()

  // All security headers applied here
  // CSP with nonce (see FR-SEC-013)
  // HSTS, X-Frame-Options, etc.

  // Pass nonce to Server Components via request header
  response.headers.set('x-nonce', nonce)

  return response
}

export const config = {
  matcher: [
    // Match all request paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

**Acceptance Criteria**:
- Every response from the application includes all headers defined in FR-SEC-001 through FR-SEC-007.
- CI includes a header validation test (`curl -sI` against preview deployment) that fails the build on any missing header.
- The Nginx Ingress Controller adds headers as a secondary layer via ConfigMap annotations for any response that bypasses the application middleware (e.g., static assets served directly by Nginx).

---

## 2. Content Security Policy (Nonce-Based)

This section corrects the CTA architect's CSP which used `'unsafe-inline'` and `'unsafe-eval'`. Those directives are prohibited.

### FR-SEC-009: CSP Architecture Decision

**Requirement**: The Content Security Policy MUST use nonce-based script authorization. `'unsafe-inline'` and `'unsafe-eval'` are prohibited in `script-src` and `style-src`.

**Rationale**: SafeTrekr sells trust. A CSP that permits arbitrary inline script execution undermines the product's credibility when enterprise buyers inspect the site's security headers. Next.js 15 natively supports nonce-based CSP via the `headers()` function and middleware integration.

### FR-SEC-010: Nonce Generation

**Requirement**: A cryptographically random nonce MUST be generated per request in middleware and propagated to all Server Components.

```typescript
// middleware.ts
const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

// Set nonce in a request header for Server Components to read
const requestHeaders = new Headers(request.headers)
requestHeaders.set('x-nonce', nonce)

const response = NextResponse.next({
  request: { headers: requestHeaders },
})
```

**Implementation Notes**:
- `crypto.randomUUID()` provides 122 bits of entropy, base64-encoded.
- The nonce is passed to Server Components via request headers, NOT via cookies or query parameters.
- The root layout reads the nonce from `headers()` and passes it to the `<Script>` components.
- Each request gets a unique nonce. Nonces are never reused.

### FR-SEC-011: Nonce Propagation to Script Tags

**Requirement**: All `<script>` tags MUST include the request-specific nonce.

```typescript
// app/layout.tsx
import { headers } from 'next/headers'

export default async function RootLayout({ children }) {
  const headersList = await headers()
  const nonce = headersList.get('x-nonce') ?? ''

  return (
    <html>
      <head>
        {/* Plausible Analytics with nonce */}
        <script
          defer
          data-domain="safetrekr.com"
          src="https://plausible.io/js/script.js"
          nonce={nonce}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### FR-SEC-012: Style Handling Without unsafe-inline

**Requirement**: Inline styles MUST be handled without `'unsafe-inline'` in `style-src`.

**Implementation Notes**:
- Tailwind CSS 4 compiles to a static CSS file at build time. No inline style injection at runtime.
- Framer Motion applies inline styles for animations. Use the nonce for Framer Motion's style injection by configuring the `nonce` prop on `LazyMotion`.
- shadcn/ui components use Tailwind classes, not inline styles.
- For any remaining inline styles (e.g., dynamic MapLibre canvas sizing), use `'nonce-{value}'` in `style-src`.
- `style-src 'self' 'nonce-{value}'` is the target policy.

### FR-SEC-013: Full CSP Directive

**Requirement**: The following CSP MUST be applied to every response.

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{PER_REQUEST_NONCE}' https://challenges.cloudflare.com https://plausible.io;
  style-src 'self' 'nonce-{PER_REQUEST_NONCE}';
  img-src 'self' data: blob: https://api.maptiler.com https://*.tile.openstreetmap.org;
  font-src 'self';
  connect-src 'self' https://*.supabase.co https://plausible.io https://challenges.cloudflare.com https://api.maptiler.com;
  frame-src https://challenges.cloudflare.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  object-src 'none';
  worker-src 'self' blob:;
  upgrade-insecure-requests;
  report-uri /api/csp-report;
  report-to csp-violations
```

**Directive Justification**:

| Directive | Value | Justification |
|---|---|---|
| `default-src` | `'self'` | Deny all resources except from the same origin by default |
| `script-src` | `'self' 'nonce-{N}'` + Turnstile + Plausible | Only nonce-tagged scripts and two trusted external origins |
| `style-src` | `'self' 'nonce-{N}'` | Static Tailwind CSS + nonce for dynamic styles (Framer Motion) |
| `img-src` | `'self' data: blob:` + MapTiler + OSM | Map tiles, inline SVGs (`data:`), MapLibre-generated blobs |
| `font-src` | `'self'` | Self-hosted fonts via `next/font` (no Google Fonts CDN calls) |
| `connect-src` | `'self'` + Supabase + Plausible + Turnstile + MapTiler | XHR/fetch destinations for data, analytics, verification, tiles |
| `frame-src` | Turnstile only | Turnstile renders in an iframe; no other frames permitted |
| `frame-ancestors` | `'none'` | The marketing site must never be framed (clickjacking prevention) |
| `base-uri` | `'self'` | Prevent `<base>` tag injection attacks |
| `form-action` | `'self'` | Forms can only submit to the same origin (Server Actions) |
| `object-src` | `'none'` | Block Flash, Java applets, and other plugin-based content |
| `worker-src` | `'self' blob:` | MapLibre uses Web Workers created via `blob:` URLs |
| `upgrade-insecure-requests` | (directive) | Automatically upgrade HTTP to HTTPS |
| `report-uri` / `report-to` | `/api/csp-report` | Collect violation reports for monitoring |

### FR-SEC-014: CSP Report-Only Deployment Strategy

**Requirement**: New CSP changes MUST be deployed in `Content-Security-Policy-Report-Only` mode for a minimum of 7 days before enforcement.

```typescript
// Phase 1: Report-Only (7 days minimum)
response.headers.set('Content-Security-Policy-Report-Only', newPolicy)
response.headers.set('Content-Security-Policy', currentPolicy)

// Phase 2: Enforcement (after 7 days of clean reports)
response.headers.set('Content-Security-Policy', newPolicy)
```

**Implementation Notes**:
- CSP violation reports are sent to `/api/csp-report`, a Route Handler that logs violations to Supabase.
- The `Report-To` header configures the Reporting API v1 endpoint.
- Violations are monitored via a Supabase dashboard query and a Slack alert for > 5 violations per hour.
- Initial launch: deploy CSP in report-only mode. After 7 days of clean reports, switch to enforcement.

### FR-SEC-015: CSP Violation Reporting Endpoint

**Requirement**: Implement a CSP violation report collector.

```typescript
// app/api/csp-report/route.ts
export async function POST(request: Request) {
  const body = await request.json()

  // Log to Supabase for analysis
  await supabase.from('csp_violations').insert({
    document_uri: body['csp-report']?.['document-uri'],
    violated_directive: body['csp-report']?.['violated-directive'],
    blocked_uri: body['csp-report']?.['blocked-uri'],
    source_file: body['csp-report']?.['source-file'],
    line_number: body['csp-report']?.['line-number'],
    created_at: new Date().toISOString(),
  })

  return new Response(null, { status: 204 })
}
```

**Acceptance Criteria**:
- CSP violation reports are persisted and queryable.
- Alert fires when violations exceed 5 per hour.
- Browser extension noise (common source of false CSP violations) is filtered by `source_file` patterns.

---

## 3. Form Security (8-Layer Defense)

The marketing site's forms (demo request, contact, newsletter, quote request) are the primary revenue instruments. Every form submission passes through all 8 layers sequentially. A failure at any layer rejects the submission.

### FR-SEC-016: Layer 1 -- Client-Side Zod Validation

**Requirement**: All form fields MUST be validated on the client using Zod schemas before submission.

```typescript
// lib/schemas/demo-request.ts
import { z } from 'zod'

export const demoRequestSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(254).trim().toLowerCase(),
  organization: z.string().min(2).max(200).trim(),
  organizationType: z.enum([
    'k12_school', 'university', 'church', 'nonprofit',
    'corporate', 'government', 'other'
  ]),
  tripVolume: z.enum(['1-5', '6-15', '16-50', '51+']),
  preferredFormat: z.enum(['video_call', 'in_person', 'self_guided']),
  message: z.string().max(2000).trim().optional(),
  // Honeypot field (Layer 6) - must be empty
  website: z.string().max(0).optional(),
})
```

**Implementation Notes**:
- React Hook Form integrates with Zod via `@hookform/resolvers/zod`.
- Validation runs on blur and on change (after first blur).
- Error messages are user-friendly, accessible (`aria-describedby` linked to error), and do not reveal schema internals.
- This layer is a UX optimization only. It is NOT a security boundary. All validation is repeated server-side (Layer 4).

### FR-SEC-017: Layer 2 -- Cloudflare Turnstile (Client)

**Requirement**: Every form MUST include a Cloudflare Turnstile widget that generates a verification token before submission.

**Implementation Notes**:
- Turnstile operates in `managed` mode (invisible when possible, interactive when needed).
- The Turnstile widget is lazy-loaded when the form enters the viewport via Intersection Observer.
- The widget is configured with `sitekey` from a public environment variable (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`).
- The generated token is included in the form data submitted to the Server Action.
- For Turnstile fallback behavior (K-12 firewalls), see FR-SEC-038.

### FR-SEC-018: Layer 3 -- Server-Side Turnstile Verification

**Requirement**: The server MUST verify the Turnstile token with Cloudflare's `/siteverify` API before processing the form.

```typescript
// lib/turnstile.ts
export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: token,
        remoteip: ip,
      }),
    }
  )

  const data = await response.json()
  return data.success === true
}
```

**Implementation Notes**:
- The `TURNSTILE_SECRET_KEY` is stored in K8s Secrets, never exposed to the client.
- Token verification includes the client IP for additional validation.
- Tokens are single-use; Cloudflare rejects replayed tokens.
- If Cloudflare's API is unreachable (timeout > 5s), the submission is queued for retry, NOT silently accepted. Log the failure and alert.

### FR-SEC-019: Layer 4 -- Server-Side Zod Validation

**Requirement**: All form fields MUST be re-validated server-side using the identical Zod schema. The server MUST NOT trust client-side validation.

**Implementation Notes**:
- The same Zod schema file (`lib/schemas/demo-request.ts`) is imported by both the client form and the Server Action.
- Server-side validation runs after Turnstile verification (Layer 3) but before rate limiting (Layer 5).
- Validation failures return a structured error response with field-level errors. The response does NOT include the raw Zod error path (which could reveal schema structure).
- Type coercion is applied: `z.string().trim()` normalizes whitespace; `z.string().toLowerCase()` normalizes email.

### FR-SEC-020: Layer 5 -- Rate Limiting

**Requirement**: Form submissions MUST be rate-limited per IP hash per form type. See Section 4 for full rate limiting specification.

### FR-SEC-021: Layer 6 -- Honeypot Detection

**Requirement**: Every form MUST include a hidden honeypot field that is invisible to human users but auto-filled by bots.

```typescript
// Component: hidden via CSS (not display:none, which bots detect)
<div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
  <label htmlFor="website">Website</label>
  <input
    type="text"
    id="website"
    name="website"
    tabIndex={-1}
    autoComplete="off"
  />
</div>
```

**Implementation Notes**:
- The field is named `website` (a field bots commonly fill).
- The field is positioned off-screen, not hidden via `display: none` (bots detect `display: none`).
- `tabIndex={-1}` removes it from keyboard navigation.
- `aria-hidden="true"` hides it from screen readers.
- If the field contains any value, the server silently rejects the submission (returns a fake success response to avoid tipping off the bot).
- The rejection is logged for analysis but does NOT count against the IP's rate limit.

### FR-SEC-022: Layer 7 -- Input Sanitization

**Requirement**: All text inputs MUST be sanitized server-side before storage.

```typescript
// lib/sanitize.ts
export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')           // Strip HTML tags
    .replace(/[<>'"]/g, '')            // Remove angle brackets and quotes
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control chars
    .normalize('NFC')                   // Normalize Unicode
    .trim()
    .slice(0, 2000)                    // Hard length limit
}
```

**Implementation Notes**:
- Sanitization runs AFTER Zod validation (Layer 4) and BEFORE database insertion.
- HTML tag stripping prevents stored XSS if form data is ever rendered in an admin interface.
- Unicode normalization (`NFC`) prevents homoglyph attacks and duplicate entries using visually identical but byte-different characters.
- The 2000-character hard limit is a defense against payload-size attacks, independent of the Zod schema's `max()` constraint.
- SQL injection is mitigated by Supabase's parameterized queries. Sanitization is defense-in-depth.

### FR-SEC-023: Layer 8 -- IP Hashing

**Requirement**: The submitter's IP address MUST be hashed with SHA-256 before storage. Raw IP addresses are NEVER persisted.

```typescript
// lib/ip-hash.ts
import { createHash } from 'crypto'

export function hashIP(ip: string): string {
  const salt = process.env.IP_HASH_SALT! // Stored in K8s Secret
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}
```

**Implementation Notes**:
- The IP address is read from the `x-forwarded-for` header (set by Nginx Ingress Controller) or `x-real-ip`.
- A secret salt (`IP_HASH_SALT`) is stored in K8s Secrets and prepended to the IP before hashing. This prevents rainbow table attacks against common IP ranges.
- The hashed IP is stored in the `ip_hash` column of `form_submissions` for rate limiting queries.
- Under GDPR, the hashed IP is not considered PII because it cannot be reversed. The salt ensures it cannot be correlated across services.
- The `x-forwarded-for` header chain is validated: only the rightmost non-private IP (the one set by the Nginx Ingress Controller) is used. This prevents IP spoofing via injected `X-Forwarded-For` headers from the client.

### FR-SEC-024: Server Action Orchestration

**Requirement**: The 8 layers MUST execute in the defined order. Each layer is a distinct, testable function.

```typescript
// Server Action execution order
export async function submitDemoRequest(formData: FormData) {
  // Layer 1: Client-side Zod (already ran in browser, not repeated here)

  // Layer 2: Extract Turnstile token
  const turnstileToken = formData.get('cf-turnstile-response') as string
  if (!turnstileToken) return { success: false, error: 'Verification required' }

  // Layer 3: Server-side Turnstile verification
  const ip = getClientIP(headers())
  const turnstileValid = await verifyTurnstile(turnstileToken, ip)
  if (!turnstileValid) return { success: false, error: 'Verification failed' }

  // Layer 4: Server-side Zod validation
  const parsed = demoRequestSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: formatZodErrors(parsed.error) }

  // Layer 5: Rate limiting
  const ipHash = hashIP(ip)
  const rateLimited = await checkRateLimit(ipHash, 'demo_request', 5, 3600)
  if (rateLimited) return { success: false, error: 'Too many requests. Please try again later.' }

  // Layer 6: Honeypot check
  const honeypot = formData.get('website') as string
  if (honeypot) {
    // Silent rejection: return fake success
    return { success: true, message: 'Demo request received.' }
  }

  // Layer 7: Input sanitization
  const sanitized = sanitizeFormData(parsed.data)

  // Layer 8: IP hashing (for storage)
  // ipHash already computed in Layer 5

  // Persist to Supabase
  await insertSubmission({ ...sanitized, ipHash, formType: 'demo_request' })

  // Send notification (non-blocking)
  sendNotificationEmail({ type: 'demo_request', data: sanitized }).catch(console.error)

  return { success: true, message: 'Demo request received. We will contact you within 1 business day.' }
}
```

**Acceptance Criteria**:
- All 8 layers execute sequentially for every form submission.
- Each layer has independent unit tests.
- Integration tests verify the full chain with mock Turnstile and Supabase responses.
- A submission that fails at any layer (except honeypot, which fakes success) receives a structured error response.

---

## 4. Rate Limiting

### FR-SEC-025: Supabase-Based Rate Limiting

**Requirement**: Rate limiting MUST be implemented via Supabase queries against the `form_submissions` table. No Redis dependency.

```typescript
// lib/rate-limit.ts
async function checkRateLimit(
  ipHash: string,
  formType: string,
  maxRequests: number,
  windowSeconds: number
): Promise<boolean> {
  const supabase = createServiceClient()
  const windowStart = new Date(Date.now() - windowSeconds * 1000).toISOString()

  const { count } = await supabase
    .from('form_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .eq('form_type', formType)
    .gte('created_at', windowStart)

  return (count ?? 0) >= maxRequests
}
```

### FR-SEC-026: Rate Limit Thresholds

**Requirement**: The following thresholds MUST be enforced. Thresholds are stored in environment variables for runtime configurability without redeployment.

| Form Type | Max Requests | Window | Env Var | Rationale |
|---|---|---|---|---|
| Demo request | 5 | 1 hour | `RATE_LIMIT_DEMO` | High-value form; low legitimate volume |
| Quote request | 5 | 1 hour | `RATE_LIMIT_QUOTE` | Same as demo |
| Contact form | 10 | 1 hour | `RATE_LIMIT_CONTACT` | Slightly more permissive for general inquiries |
| Newsletter signup | 3 | 1 hour | `RATE_LIMIT_NEWSLETTER` | One email per person |
| Analytics event | 100 | 1 minute | `RATE_LIMIT_ANALYTICS` | High volume, bounded |
| Global per IP | 50 | 5 minutes | `RATE_LIMIT_GLOBAL` | Catch-all across all form types |

### FR-SEC-027: Rate Limit Response Headers

**Requirement**: Rate-limited responses MUST return HTTP 429 with a `Retry-After` header.

```typescript
if (rateLimited) {
  return new Response(
    JSON.stringify({ error: 'Too many requests. Please try again later.' }),
    {
      status: 429,
      headers: {
        'Retry-After': String(windowSeconds),
        'Content-Type': 'application/json',
      },
    }
  )
}
```

### FR-SEC-028: Rate Limit Index

**Requirement**: The `form_submissions` table MUST have a composite index on `(ip_hash, form_type, created_at)` to ensure rate limit queries execute in < 10ms.

```sql
CREATE INDEX idx_form_submissions_rate_limit
ON form_submissions (ip_hash, form_type, created_at DESC);
```

---

## 5. Bot Protection

### FR-SEC-029: Cloudflare Turnstile Integration

**Requirement**: Cloudflare Turnstile MUST be integrated as the primary bot detection mechanism on all forms.

**Implementation Notes**:
- Mode: `managed` (invisible when possible, challenge when needed).
- Appearance: `interaction-only` (widget visible only when interaction is required).
- Theme: `auto` (matches system preference).
- Language: `auto` (detects browser language).
- The Turnstile widget is loaded via a `<script>` tag with the CSP nonce (FR-SEC-011).
- The widget container is placed within the form, before the submit button.

### FR-SEC-030: Turnstile Widget Lazy Loading

**Requirement**: The Turnstile script MUST be lazy-loaded when the form enters the viewport.

```typescript
// components/TurnstileWidget.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

export function TurnstileWidget({ onVerify, nonce }: Props) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0 })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (inView && !loaded) {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      script.defer = true
      script.nonce = nonce
      script.onload = () => setLoaded(true)
      document.head.appendChild(script)
    }
  }, [inView, loaded, nonce])

  return <div ref={ref} className="cf-turnstile" data-sitekey={siteKey} />
}
```

### FR-SEC-031: Turnstile K-12 Firewall Fallback

**Requirement**: The marketing site MUST implement a fallback mechanism for environments where `challenges.cloudflare.com` is blocked by school/institutional firewalls.

**Context**: Many K-12 school districts and some church networks use content filtering systems (e.g., Lightspeed, GoGuardian, Securly, iBoss) that block `challenges.cloudflare.com` as an uncategorized or CDN domain. Since K-12 is a primary buyer segment, this is a revenue-critical issue.

**Fallback Architecture**:

```
1. Attempt Turnstile verification (normal flow)
2. If Turnstile script fails to load within 10 seconds:
   a. Detect failure via script.onerror or timeout
   b. Show a visible notification: "Having trouble? Your network may block our verification service."
   c. Display fallback form with enhanced alternative protections:
      - Server-side honeypot (always active)
      - Time-based challenge (form must be open > 3 seconds before submission)
      - JavaScript proof-of-work (simple computation challenge)
      - Stricter rate limiting (3 submissions per IP per hour instead of 5)
   d. Flag the submission as `turnstile_bypassed: true` in Supabase
   e. Route these submissions to a manual review queue
3. Send a Slack alert when Turnstile fallback activates > 10 times per hour
   (indicates a systemic network issue, not individual bot attempts)
```

**Implementation Notes**:
- The fallback is NOT a full bypass. It replaces one verification layer with three compensating controls.
- Submissions flagged `turnstile_bypassed: true` are reviewed before entering the sales pipeline.
- A time-based challenge (minimum 3 seconds from form render to submission) stops automated submissions while being invisible to humans.
- The JavaScript proof-of-work is a simple computation (e.g., find a value whose SHA-256 hash starts with "00") that takes ~100ms on modern hardware but increases automated submission cost.
- Document the fallback in the security questionnaire response template ("SafeTrekr supports accessibility-first environments including school networks with restricted outbound connectivity").

### FR-SEC-032: Turnstile Error Monitoring

**Requirement**: Turnstile verification failures MUST be logged and monitored.

| Metric | Alert Threshold | Notification |
|---|---|---|
| Turnstile script load failures | > 10 per hour | Slack `#marketing-alerts` |
| Turnstile verification failures | > 20% of attempts | Slack `#marketing-alerts` |
| Turnstile API unreachable | Any occurrence | Slack `#marketing-alerts` + email |
| Fallback activations | > 10 per hour | Slack `#security-alerts` |

---

## 6. Supply Chain Security

### FR-SEC-033: Package Manager Lockfile Integrity

**Requirement**: `pnpm-lock.yaml` MUST be committed to the repository. CI MUST fail if the lockfile is out of sync with `package.json`.

```yaml
# .github/workflows/ci.yml
- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

**Implementation Notes**:
- `--frozen-lockfile` ensures CI uses the exact dependency tree from the lockfile.
- Any attempt to install a dependency not in the lockfile fails the build.
- The lockfile is reviewed as part of PR code review when dependency changes are made.

### FR-SEC-034: Automated Dependency Updates

**Requirement**: Dependabot MUST be configured for automated dependency update PRs.

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
      day: monday
    open-pull-requests-limit: 10
    reviewers:
      - safetrekr/security-review
    labels:
      - dependencies
      - security
    versioning-strategy: increase
    ignore:
      - dependency-name: '*'
        update-types: ['version-update:semver-major']
```

**Implementation Notes**:
- Dependabot opens PRs for patch and minor updates weekly.
- Major version updates are ignored by Dependabot and handled manually during quarterly dependency review.
- All Dependabot PRs run the full CI suite including security scans.
- Critical security updates (Dependabot security alerts) are merged within 24 hours.

### FR-SEC-035: Socket.dev Integration

**Requirement**: Socket.dev MUST be integrated into the CI pipeline to detect supply chain attacks.

**Implementation Notes**:
- Socket.dev analyzes npm packages for: typosquatting, install scripts, obfuscated code, network access, filesystem access, environment variable access, and known malware.
- The Socket.dev GitHub App comments on PRs that add or update dependencies.
- Any package flagged as "Critical" by Socket.dev blocks the PR merge.
- Socket.dev is preferred over `npm audit` alone because it detects supply chain attacks that vulnerability databases miss (e.g., event-stream incident pattern).

### FR-SEC-036: Subresource Integrity (SRI)

**Requirement**: All external scripts MUST use Subresource Integrity hashes where the CDN supports stable hashes.

```html
<script
  defer
  data-domain="safetrekr.com"
  src="https://plausible.io/js/script.js"
  integrity="sha384-{HASH}"
  crossorigin="anonymous"
  nonce="{NONCE}"
/>
```

**Implementation Notes**:
- Plausible's self-hosted script produces a stable hash that can be pinned.
- Turnstile's script is loaded from Cloudflare's CDN and its hash changes frequently. SRI is NOT applied to the Turnstile script. CSP's `script-src` allowlist provides the equivalent protection.
- SRI hashes are regenerated during dependency updates and stored in a constants file.

### FR-SEC-037: SBOM Generation

**Requirement**: A Software Bill of Materials (SBOM) MUST be generated in CI for every release.

```yaml
# .github/workflows/release.yml
- name: Generate SBOM
  run: npx @cyclonedx/cyclonedx-npm --output-file sbom.json --spec-version 1.5
- name: Upload SBOM
  uses: actions/upload-artifact@v4
  with:
    name: sbom
    path: sbom.json
```

**Implementation Notes**:
- CycloneDX format (JSON, spec version 1.5) is used for compatibility with enterprise security tools.
- The SBOM is stored as a CI artifact for every release.
- Enterprise buyers requesting an SBOM (common in K-12 procurement) receive the most recent artifact.
- The SBOM is NOT published publicly.

---

## 7. Secret Management

### FR-SEC-038: Kubernetes Secrets

**Requirement**: All secrets MUST be stored in Kubernetes Secrets objects, injected as environment variables into the application pods. Secrets are NEVER baked into Docker images.

```yaml
# k8s/secrets.yaml (template -- actual values via sealed-secrets or external-secrets)
apiVersion: v1
kind: Secret
metadata:
  name: safetrekr-marketing-secrets
  namespace: marketing
type: Opaque
stringData:
  SUPABASE_URL: ""
  SUPABASE_SERVICE_ROLE_KEY: ""
  SENDGRID_API_KEY: ""
  TURNSTILE_SECRET_KEY: ""
  IP_HASH_SALT: ""
  SENTRY_DSN: ""
  ENCRYPTION_KEY: ""  # For pgcrypto column-level encryption (future)
```

### FR-SEC-039: Secret Injection into Pods

**Requirement**: Secrets MUST be injected via `envFrom` or individual `env` references in the Deployment spec.

```yaml
# k8s/deployment.yaml
spec:
  containers:
    - name: safetrekr-marketing
      envFrom:
        - secretRef:
            name: safetrekr-marketing-secrets
        - configMapRef:
            name: safetrekr-marketing-config
```

**Implementation Notes**:
- `secretRef` injects all keys from the Secret as environment variables.
- `configMapRef` injects non-sensitive configuration (e.g., `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`).
- Public environment variables (prefixed `NEXT_PUBLIC_`) are stored in ConfigMaps, not Secrets.

### FR-SEC-040: No Secrets in Docker Images

**Requirement**: Docker images MUST NOT contain any secrets. The Dockerfile MUST NOT use `ARG` or `ENV` for secret values during build.

```dockerfile
# Dockerfile
FROM node:22-alpine AS base

# Build stage -- no secrets needed for static site build
FROM base AS builder
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
# NEXT_PUBLIC_ vars only -- no secrets
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_PLAUSIBLE_DOMAIN
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_PLAUSIBLE_DOMAIN=$NEXT_PUBLIC_PLAUSIBLE_DOMAIN
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN pnpm build

# Production stage -- minimal image
FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**Implementation Notes**:
- Multi-stage build: only the standalone output is copied to the production image.
- The application runs as a non-root user (`nextjs`, UID 1001).
- `NEXT_PUBLIC_` variables are baked in at build time (they are public by definition).
- All secret environment variables are injected at runtime by Kubernetes.

### FR-SEC-041: Secret Rotation Schedule

**Requirement**: Secrets MUST be rotatable without application downtime.

| Secret | Rotation Period | Rotation Method |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | On demand (compromise only) | Regenerate in Supabase dashboard, update K8s Secret, rolling restart |
| `SENDGRID_API_KEY` | 90 days | Generate new key in SendGrid, update K8s Secret, rolling restart, revoke old key |
| `TURNSTILE_SECRET_KEY` | On demand (compromise only) | Regenerate in Cloudflare dashboard, update K8s Secret, rolling restart |
| `IP_HASH_SALT` | Never (rotation invalidates rate-limiting history) | Accept risk; document in security decision log |
| `SENTRY_DSN` | On demand (compromise only) | Regenerate in Sentry, update K8s Secret, rolling restart |

### FR-SEC-042: Sealed Secrets or External Secrets Operator

**Requirement**: Secrets MUST NOT be stored in plaintext in the Git repository. Use one of the following approaches:

**Option A (Recommended): Sealed Secrets**
```bash
# Encrypt secret for cluster-specific public key
kubeseal --format yaml < k8s/secrets.yaml > k8s/sealed-secrets.yaml
# sealed-secrets.yaml is safe to commit to Git
```

**Option B: External Secrets Operator with DigitalOcean**
```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: safetrekr-marketing-secrets
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: digitalocean-secret-store
    kind: ClusterSecretStore
  target:
    name: safetrekr-marketing-secrets
  data:
    - secretKey: SUPABASE_SERVICE_ROLE_KEY
      remoteRef:
        key: safetrekr-marketing/supabase-service-role-key
```

**Implementation Notes**:
- Sealed Secrets is simpler and has no external dependency beyond the cluster controller.
- External Secrets Operator is preferred if DigitalOcean's managed secrets service is available.
- Either approach ensures secrets are encrypted at rest in Git and decrypted only within the cluster.

---

## 8. Network Security (Kubernetes)

### FR-SEC-043: Namespace Isolation

**Requirement**: The marketing site MUST run in a dedicated Kubernetes namespace (`marketing`) isolated from any other workloads.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: marketing
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

### FR-SEC-044: Kubernetes Network Policies

**Requirement**: Network policies MUST enforce least-privilege network access within the cluster.

```yaml
# k8s/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: marketing-default-deny
  namespace: marketing
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress

---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: marketing-allow-ingress
  namespace: marketing
spec:
  podSelector:
    matchLabels:
      app: safetrekr-marketing
  policyTypes:
    - Ingress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: ingress-nginx
      ports:
        - protocol: TCP
          port: 3000

---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: marketing-allow-egress
  namespace: marketing
spec:
  podSelector:
    matchLabels:
      app: safetrekr-marketing
  policyTypes:
    - Egress
  egress:
    # DNS resolution
    - to:
        - namespaceSelector: {}
          podSelector:
            matchLabels:
              k8s-app: kube-dns
      ports:
        - protocol: UDP
          port: 53
        - protocol: TCP
          port: 53
    # Supabase (external HTTPS)
    - to:
        - ipBlock:
            cidr: 0.0.0.0/0
            except:
              - 10.0.0.0/8
              - 172.16.0.0/12
              - 192.168.0.0/16
      ports:
        - protocol: TCP
          port: 443
```

**Implementation Notes**:
- The default-deny policy blocks all ingress and egress traffic to pods in the `marketing` namespace.
- Ingress is allowed only from the `ingress-nginx` namespace on port 3000 (the Next.js server port).
- Egress is allowed only for DNS resolution (kube-dns) and HTTPS (port 443) to external services (Supabase, SendGrid, Cloudflare Turnstile, Plausible).
- Private IP ranges are excluded from egress to prevent lateral movement to other cluster workloads.
- The DigitalOcean DOKS cluster must have a CNI that supports NetworkPolicy (Cilium is the default on DOKS).

### FR-SEC-045: Pod Security Standards (Restricted)

**Requirement**: The marketing namespace MUST enforce the `restricted` Pod Security Standard.

```yaml
# Deployment spec must comply with restricted PSS
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1001
    runAsGroup: 1001
    fsGroup: 1001
    seccompProfile:
      type: RuntimeDefault
  containers:
    - name: safetrekr-marketing
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop:
            - ALL
      volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: nextjs-cache
          mountPath: /app/.next/cache
  volumes:
    - name: tmp
      emptyDir: {}
    - name: nextjs-cache
      emptyDir: {}
```

**Implementation Notes**:
- `runAsNonRoot: true` prevents the container from running as root.
- `readOnlyRootFilesystem: true` prevents writes to the container filesystem. Writable directories (`/tmp`, `.next/cache`) are mounted as `emptyDir` volumes.
- `allowPrivilegeEscalation: false` prevents `setuid`/`setgid` binaries from elevating privileges.
- All Linux capabilities are dropped.
- `seccompProfile: RuntimeDefault` applies the container runtime's default seccomp profile.
- The namespace label `pod-security.kubernetes.io/enforce: restricted` rejects any pod that violates these constraints.

### FR-SEC-046: Resource Limits

**Requirement**: All pods MUST have resource requests and limits defined to prevent resource exhaustion attacks.

```yaml
resources:
  requests:
    cpu: 100m
    memory: 256Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

### FR-SEC-047: Horizontal Pod Autoscaler

**Requirement**: An HPA MUST be configured to handle traffic spikes while maintaining security controls.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: safetrekr-marketing-hpa
  namespace: marketing
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: safetrekr-marketing
  minReplicas: 2
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

**Implementation Notes**:
- `minReplicas: 2` ensures high availability (one pod can fail without downtime).
- `maxReplicas: 8` caps scaling to prevent cost runaway during DDoS.
- CPU target of 70% provides headroom for request spikes.

---

## 9. SSL/TLS Certificate Management

### FR-SEC-048: cert-manager with Let's Encrypt

**Requirement**: TLS certificates MUST be provisioned and renewed automatically via cert-manager with Let's Encrypt.

```yaml
# k8s/cert-manager/cluster-issuer.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: security@safetrekr.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx

---
# k8s/cert-manager/certificate.yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: safetrekr-marketing-tls
  namespace: marketing
spec:
  secretName: safetrekr-marketing-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
    - safetrekr.com
    - www.safetrekr.com
  renewBefore: 720h  # 30 days before expiry
```

### FR-SEC-049: TLS Configuration on Nginx Ingress

**Requirement**: The Nginx Ingress Controller MUST enforce TLS 1.2+ with secure cipher suites.

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: safetrekr-marketing
  namespace: marketing
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/ssl-protocols: "TLSv1.2 TLSv1.3"
    nginx.ingress.kubernetes.io/ssl-ciphers: "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384"
    nginx.ingress.kubernetes.io/ssl-prefer-server-ciphers: "true"
    nginx.ingress.kubernetes.io/hsts: "true"
    nginx.ingress.kubernetes.io/hsts-max-age: "31536000"
    nginx.ingress.kubernetes.io/hsts-include-subdomains: "true"
    nginx.ingress.kubernetes.io/hsts-preload: "true"
    nginx.ingress.kubernetes.io/configuration-snippet: |
      more_set_headers "X-Frame-Options: DENY";
      more_set_headers "X-Content-Type-Options: nosniff";
      more_set_headers "Referrer-Policy: strict-origin-when-cross-origin";
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - safetrekr.com
        - www.safetrekr.com
      secretName: safetrekr-marketing-tls
  rules:
    - host: safetrekr.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: safetrekr-marketing
                port:
                  number: 3000
```

**Implementation Notes**:
- TLS 1.0 and 1.1 are explicitly excluded. Only TLS 1.2 and 1.3 are permitted.
- Cipher suites prioritize ECDHE for forward secrecy and AES-GCM for authenticated encryption.
- `ssl-redirect: true` and `force-ssl-redirect: true` ensure all HTTP traffic is redirected to HTTPS.
- The `configuration-snippet` adds security headers at the Nginx level as defense-in-depth (the application middleware also sets them).
- cert-manager automatically renews certificates 30 days before expiry.
- Certificate expiry monitoring: alert if any certificate is < 14 days from expiry (indicates cert-manager failure).

### FR-SEC-050: Cloudflare SSL/TLS Mode

**Requirement**: If Cloudflare is used as a CDN/proxy layer, it MUST be configured in Full (Strict) mode.

| Setting | Value | Rationale |
|---|---|---|
| SSL/TLS encryption mode | Full (Strict) | Validates the origin certificate against a trusted CA |
| Minimum TLS version | 1.2 | Matches Nginx Ingress configuration |
| Always Use HTTPS | On | Redirect HTTP to HTTPS at the edge |
| HSTS | Enabled (31536000, includeSubDomains, preload) | Dual-layer HSTS enforcement |
| TLS 1.3 | On | Modern protocol with 0-RTT support |
| Automatic HTTPS Rewrites | On | Fix mixed content in responses |

---

## 10. CORS Policy

### FR-SEC-051: CORS Configuration

**Requirement**: API routes MUST implement a restrictive CORS policy that allows requests only from the marketing site's own origins.

```typescript
// lib/cors.ts
const ALLOWED_ORIGINS = [
  'https://safetrekr.com',
  'https://www.safetrekr.com',
  // Staging origin (if applicable)
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
].filter(Boolean) as string[]

export function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('origin')
  const isAllowed = origin && ALLOWED_ORIGINS.includes(origin)

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Turnstile-Token',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  }
}
```

**Implementation Notes**:
- `Access-Control-Allow-Origin` reflects the request origin only if it matches the allowlist. An empty value is returned for unrecognized origins (not `*`).
- Only `POST` and `OPTIONS` methods are permitted (forms submit via POST; OPTIONS handles preflight).
- `Vary: Origin` ensures CDN caches do not serve a CORS response for one origin to a different origin.
- The `health` endpoint and CSP report endpoint are exempt from CORS restrictions (they do not return sensitive data).
- `Access-Control-Allow-Credentials` is NOT set because the marketing site does not use cookies for API authentication.

### FR-SEC-052: OPTIONS Preflight Handler

**Requirement**: All API routes MUST handle OPTIONS requests for CORS preflight.

```typescript
// app/api/demo-request/route.ts
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request),
  })
}
```

---

## 11. Cookie Security

### FR-SEC-053: Cookie Defaults

**Requirement**: Any cookies set by the marketing site MUST use secure defaults.

| Attribute | Value | Rationale |
|---|---|---|
| `Secure` | `true` (always) | Cookies are only sent over HTTPS |
| `HttpOnly` | `true` (for server-readable cookies) | Prevents JavaScript access, mitigates XSS cookie theft |
| `SameSite` | `Strict` (default), `Lax` for cross-site navigation cookies | Prevents CSRF |
| `Path` | `/` or scoped to specific route | Limits cookie scope |
| `Domain` | Not set (defaults to exact host) | Do not set `.safetrekr.com` unless SSO requires it |
| `Max-Age` | Shortest viable duration | Minimize exposure window |

### FR-SEC-054: Cookie Inventory

**Requirement**: The marketing site MUST maintain a documented cookie inventory. At launch, the inventory is minimal.

| Cookie | Purpose | HttpOnly | Secure | SameSite | Max-Age | Set By |
|---|---|---|---|---|---|---|
| `_plausible_session` | N/A -- Plausible does not set cookies | -- | -- | -- | -- | -- |
| `__cf_turnstile` | Turnstile verification state | Yes | Yes | Lax | Session | Cloudflare |
| `consent_preferences` | GA4 consent state (if GA4 enabled) | No | Yes | Strict | 365 days | Application |
| `session_id` | Anonymous session for analytics | No | Yes | Lax | 30 minutes | Application |

**Implementation Notes**:
- Plausible Analytics is explicitly chosen because it does NOT use cookies, localStorage, or fingerprinting. This eliminates the need for a cookie consent banner for analytics.
- The `session_id` cookie is an opaque UUID for session-level analytics aggregation. It contains no PII and is not linked to any user identity.
- The `consent_preferences` cookie is only set if GA4 is enabled (it is disabled at launch).
- The `Domain` attribute is NOT set on any cookie. This prevents cookies from being shared with `app.safetrekr.com`. When SSO is implemented (future), the `Domain` attribute will be set to `.safetrekr.com` for the SSO token cookie only, with explicit documentation.
- New cookies require a security review before introduction. Adding a cookie updates this inventory and the privacy policy.

---

## 12. GDPR/CCPA Compliance

### FR-SEC-055: Data Minimization

**Requirement**: Forms MUST collect only the data required for the stated purpose. No optional fields are required.

| Form | Required Fields | Optional Fields | Justification |
|---|---|---|---|
| Demo request | name, email, organization, org type, trip volume | preferred format, message | Minimum needed to prepare a relevant demo |
| Contact | name, email, message | organization, phone | Minimum for a response |
| Newsletter | email | name | Minimum for newsletter delivery |
| Quote request | name, email, organization, org type, trip details | message | Minimum for an accurate quote |

**Implementation Notes**:
- No hidden data collection beyond what is disclosed in the privacy policy.
- UTM parameters and referrer are captured from the URL/headers (not form fields) and disclosed in the privacy policy.
- Country code is derived from the Nginx `X-Real-IP` header via GeoIP lookup (not client-side geolocation API).
- The IP hash is stored for rate limiting (disclosed in privacy policy). The raw IP is never stored.

### FR-SEC-056: Right to Access (GDPR Art. 15 / CCPA Right to Know)

**Requirement**: Users MUST be able to request all data associated with their email address.

**Implementation**:
- A dedicated email address (`privacy@safetrekr.com`) receives access requests.
- A Supabase function queries all tables for matching email: `form_submissions`, `newsletter_subscribers`, `analytics_events` (if email is associated).
- Response is a JSON export delivered within 30 days (GDPR) / 45 days (CCPA).
- Identity verification: the request must come from the same email address, or the requester must prove ownership.

### FR-SEC-057: Right to Erasure (GDPR Art. 17 / CCPA Right to Delete)

**Requirement**: Users MUST be able to request deletion of all their data.

```sql
-- Erasure procedure
BEGIN;
  DELETE FROM newsletter_subscribers WHERE email = $1;
  DELETE FROM form_submissions WHERE email = $1;
  DELETE FROM crm_sync_queue WHERE payload->>'email' = $1;
  -- analytics_events: anonymize (remove email, retain aggregate event data)
  UPDATE analytics_events SET metadata = metadata - 'email'
    WHERE metadata->>'email' = $1;
COMMIT;
```

**Implementation Notes**:
- Deletion is cascading: all related records are removed in a single transaction.
- Analytics events are anonymized (email removed from metadata) rather than deleted, preserving aggregate metrics.
- A confirmation email is sent to the requester after deletion.
- Deletion requests are logged in an audit table (containing only the request timestamp and a success/failure flag, NOT the deleted data).

### FR-SEC-058: Privacy Policy

**Requirement**: A comprehensive privacy policy MUST be published at `/legal/privacy`.

**Required Sections**:
1. What data we collect (enumerated by form type)
2. Why we collect it (lawful basis: consent for forms, legitimate interest for analytics)
3. How we store it (Supabase, US East region, encrypted at rest)
4. Who we share it with (SendGrid for email, no data sales)
5. How long we retain it (see retention schedule)
6. Your rights (access, erasure, portability, objection)
7. Contact for privacy requests (`privacy@safetrekr.com`)
8. Cookie policy (Plausible: no cookies; optional GA4: requires consent)
9. Children's privacy (SafeTrekr marketing site does not knowingly collect data from children under 13; the product's COPPA compliance is separate)
10. Changes to policy (notification method, effective date)

### FR-SEC-059: Data Retention Schedule

| Data Type | Retention Period | Rationale | Deletion Method |
|---|---|---|---|
| Form submissions | 3 years | Sales pipeline tracking; contractual reference | Automated purge job |
| Newsletter subscribers | Until unsubscribe + 30 days | GDPR right to erasure buffer | Manual + automated |
| Analytics events | 13 months | Aligned with analytics industry standard | Automated purge job |
| CSP violation reports | 90 days | Short-term security monitoring | Automated purge job |
| Rate limit data (IP hashes) | 13 months | Co-located with analytics events | Automated purge job |
| Turnstile tokens | 7 days | Short-term audit | Automated purge job |

### FR-SEC-060: "Do Not Sell My Personal Information"

**Requirement**: A "Do Not Sell My Personal Information" link MUST appear in the site footer, linking to the privacy policy's opt-out section.

**Implementation Notes**:
- SafeTrekr does not sell personal data. The link leads to a clear statement of this fact.
- The link is present for CCPA compliance even though it is a no-op.
- The privacy policy states: "SafeTrekr does not sell, rent, or trade your personal information to third parties for their marketing purposes."

### FR-SEC-061: Consent Management

**Requirement**: If GA4 is enabled (it is disabled at launch), a consent management banner MUST appear before any GA4 scripts load.

**Implementation Notes**:
- Plausible Analytics does not require consent (no cookies, no PII).
- GA4 scripts load ONLY after explicit opt-in consent.
- Consent state is stored in `localStorage` (not a cookie) with the key `consent_preferences`.
- Consent is granular: analytics and marketing tracking are separate consent categories.
- Consent can be revoked at any time via a link in the footer ("Manage Cookie Preferences").

---

## 13. WCAG 2.2 AA (Accessibility as Security)

Accessibility is a security and compliance requirement, not a design preference. K-12 procurement requires Section 508 compliance. Government contracts require WCAG 2.2 AA. A site that fails accessibility fails the procurement security questionnaire.

### FR-SEC-062: Accessibility CI Gates

**Requirement**: Accessibility compliance MUST be enforced in CI. Builds MUST fail on violations.

| Tool | CI Integration | Gate Threshold |
|---|---|---|
| `axe-core` | Playwright + `@axe-core/playwright` | 0 violations (critical, serious) |
| Lighthouse Accessibility | `@lhci/cli` | Score >= 95 |
| `eslint-plugin-jsx-a11y` | ESLint | 0 errors (warnings allowed for review) |

### FR-SEC-063: Keyboard Navigation

**Requirement**: All interactive elements MUST be fully operable via keyboard.

- Tab order follows visual layout (no `tabIndex` > 0).
- Skip navigation link as the first focusable element.
- Focus-visible indicators: 2px ring with 3:1 contrast ratio against adjacent colors.
- No keyboard traps: Escape closes modals/dropdowns, focus returns to trigger.
- Forms are fully submittable via keyboard (Enter submits, Tab navigates fields).
- Mobile navigation overlay: focus is trapped within the overlay while open; Escape closes it.

### FR-SEC-064: Screen Reader Compatibility

**Requirement**: All content MUST be accessible to screen readers.

- ARIA landmarks: `<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>` used semantically.
- `aria-current="page"` on active navigation links.
- `aria-expanded` and `aria-controls` on dropdown triggers.
- `aria-describedby` links form error messages to their fields.
- `aria-live="polite"` on form submission status messages.
- `aria-hidden="true"` on decorative elements (icons, background SVGs).
- All images have meaningful `alt` text (enforced by `eslint-plugin-jsx-a11y`).

### FR-SEC-065: Motion and Animation Safety

**Requirement**: All animations MUST respect `prefers-reduced-motion`.

```typescript
// lib/motion.ts
import { useReducedMotion } from 'framer-motion'

// Global: Framer Motion animations are disabled when user prefers reduced motion
// Content is visible immediately without animation
```

**Implementation Notes**:
- No animation faster than 3 flashes per second (WCAG 2.3.1).
- All content is visible without animation (animation is enhancement only).
- `prefers-reduced-motion: reduce` disables all scroll-triggered animations, hero transitions, and page transitions.
- Turnstile widget is static when reduced motion is preferred.

### FR-SEC-066: Color Contrast

**Requirement**: All text MUST meet WCAG 2.2 AA contrast ratios.

| Element | Minimum Ratio | Verified In |
|---|---|---|
| Normal text (< 18pt) | 4.5:1 | Design tokens CI check |
| Large text (>= 18pt or >= 14pt bold) | 3:1 | Design tokens CI check |
| UI components (buttons, inputs) | 3:1 | axe-core in CI |
| Focus indicators | 3:1 against adjacent colors | Manual + axe-core |

**Implementation Notes**:
- The CTA architect's finding is incorporated: `muted-foreground` corrected from `#616567` (4.0:1 FAIL) to `#4d5153` (5.2:1 PASS). Button `primary-600` uses `#3f885b` (4.6:1 with white) instead of `primary-500` `#4ca46e` (3.4:1 FAIL for small text).
- Contrast ratios are verified in CI via a custom script that checks all token combinations.

### FR-SEC-067: VPAT (Voluntary Product Accessibility Template)

**Requirement**: A VPAT MUST be published at `/legal/vpat` or `/procurement/vpat` documenting conformance with Section 508 and WCAG 2.2 AA.

**Implementation Notes**:
- Use the ITI VPAT 2.5 template (WCAG 2.2 edition).
- The VPAT is a downloadable PDF and an HTML page.
- Update the VPAT quarterly or after any significant UI change.
- The VPAT is a critical procurement artifact for K-12 and government buyers.

---

## 14. Incident Response Plan

### FR-SEC-068: Marketing Site Compromise Scenario

**Requirement**: A documented incident response plan MUST exist for the marketing site compromise scenario.

**Scenario Classification**:

| Severity | Definition | Response Time | Escalation |
|---|---|---|---|
| P0 (Critical) | Site defacement, malware injection, data breach, forms non-functional | < 15 minutes | Founder + security lead |
| P1 (High) | Partial functionality loss, one form broken, performance degradation | < 1 hour | Security lead |
| P2 (Medium) | CSP violations spike, minor visual regression, analytics failure | < 4 hours | Engineering lead |
| P3 (Low) | Non-critical bug, typo, minor styling issue | Next business day | On-call engineer |

### FR-SEC-069: Detection Layer

**Requirement**: Multiple independent detection mechanisms MUST monitor the marketing site.

| Detection Method | Target | Frequency | Alert Channel |
|---|---|---|---|
| UptimeRobot | `https://safetrekr.com/api/health` | Every 60 seconds | Slack + Email + PagerDuty (P0) |
| Sentry | Error rate spike | Continuous | Slack + PagerDuty (> 10 errors in 5 min) |
| CSP violation reports | `/api/csp-report` | Continuous | Slack (> 5/hour) |
| Lighthouse CI | Performance + accessibility | On deploy | GitHub PR check |
| Cloudflare Analytics | DDoS patterns, traffic anomalies | Continuous | Cloudflare dashboard |
| Certificate expiry | cert-manager Certificate resource | Daily | Slack (< 14 days to expiry) |

### FR-SEC-070: Response Runbooks

**Requirement**: Documented runbooks MUST exist for each incident type.

**Runbook 1: Site Defacement / Malware Injection**
```
1. CONTAIN: Immediately rollback to previous known-good deployment
   kubectl rollout undo deployment/safetrekr-marketing -n marketing
2. ASSESS: Compare current container image hash to last known-good
   kubectl describe pod -n marketing | grep Image
3. INVESTIGATE: Check recent deployments and CI logs
   - Review GitHub Actions runs for unauthorized changes
   - Check container registry for unauthorized image pushes
   - Review Supabase audit logs for unauthorized data access
4. ERADICATE: Identify the attack vector
   - Compromised dependency? Run Socket.dev scan on affected versions
   - Compromised CI/CD? Rotate all GitHub Actions secrets
   - Compromised K8s? Review RBAC audit logs
5. RECOVER: Deploy verified clean image
   - Rebuild from trusted commit
   - Rotate all secrets (Supabase, SendGrid, Turnstile)
   - Clear CDN cache
6. COMMUNICATE: Notify affected parties if data was accessed
7. POSTMORTEM: Document timeline, root cause, and preventive measures
```

**Runbook 2: Form Submission Failures**
```
1. CHECK: Supabase service status (https://status.supabase.com)
2. CHECK: Cloudflare Turnstile status
3. CHECK: SendGrid status (email notification failures)
4. VERIFY: K8s pod health
   kubectl get pods -n marketing
   kubectl logs -n marketing -l app=safetrekr-marketing --tail=100
5. TEST: Submit a test form manually
6. If Supabase is down: Enable form data queuing (localStorage fallback)
7. If Turnstile is down: Activate K-12 fallback (FR-SEC-031)
8. If application error: Rollback to previous deployment
```

**Runbook 3: DDoS / Traffic Spike**
```
1. IDENTIFY: Cloudflare analytics for attack pattern
2. RATE-LIMIT: Verify Supabase rate limiting is active
3. SCALE: Check HPA status
   kubectl get hpa -n marketing
4. BLOCK: If attack source identified, add Cloudflare WAF rule
5. CACHE: Ensure Nginx caching is active for static assets
6. MONITOR: Watch pod CPU/memory
   kubectl top pods -n marketing
```

### FR-SEC-071: Health Check Endpoint

**Requirement**: A health check endpoint MUST exist at `/api/health` that validates all critical dependencies.

```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    supabase: await checkSupabase(),
    timestamp: new Date().toISOString(),
    version: process.env.GIT_SHA ?? 'unknown',
  }

  const healthy = checks.supabase === 'connected'

  return Response.json(
    { status: healthy ? 'healthy' : 'degraded', checks },
    { status: healthy ? 200 : 503 }
  )
}
```

**Implementation Notes**:
- The health endpoint does NOT check SendGrid on every request (would consume API quota). SendGrid health is checked every 5 minutes via a separate cron.
- UptimeRobot polls this endpoint every 60 seconds.
- A 503 status triggers alerting.
- The endpoint returns the Git SHA for deployment verification.

### FR-SEC-072: Backup and Recovery

**Requirement**: Form submission data MUST be backed up with a recovery plan.

| Backup Method | Frequency | Retention | Recovery Time |
|---|---|---|---|
| Supabase PITR (Point-in-Time Recovery) | Continuous | 7 days (Pro plan) | < 1 hour |
| Weekly Supabase pg_dump export | Weekly (GitHub Actions cron) | 90 days (DigitalOcean Spaces) | < 4 hours |
| Email notification copies | Per submission | Indefinite (in email) | Manual extraction |

---

## 15. Dependency Vulnerability Scanning

### FR-SEC-073: CI Pipeline Security Scanning

**Requirement**: The CI pipeline MUST include automated vulnerability scanning on every PR and merge to main.

```yaml
# .github/workflows/security.yml
name: Security Scanning
on:
  pull_request:
  push:
    branches: [main]
  schedule:
    - cron: '0 6 * * 1'  # Weekly Monday 6am UTC

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm audit --audit-level=high
        continue-on-error: false

  socket:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: SocketDev/socket-security-action@v1
        with:
          repo_token: ${{ secrets.GITHUB_TOKEN }}

  docker-scan:
    runs-on: ubuntu-latest
    needs: [audit]
    steps:
      - uses: actions/checkout@v4
      - name: Build image
        run: docker build -t safetrekr-marketing:scan .
      - name: Trivy scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: safetrekr-marketing:scan
          format: sarif
          output: trivy-results.sarif
          severity: CRITICAL,HIGH
          exit-code: 1
      - name: Upload Trivy results
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: trivy-results.sarif
```

### FR-SEC-074: npm Audit

**Requirement**: `pnpm audit` MUST run on every PR and block merges on high or critical vulnerabilities.

**Implementation Notes**:
- `--audit-level=high` means any vulnerability rated High or Critical fails the build.
- Medium and Low vulnerabilities are logged but do not block merges.
- Exception process: if a high-severity vulnerability has no available fix, document in `security-exceptions.md` with a review date (max 30 days).

### FR-SEC-075: Socket.dev Deep Analysis

**Requirement**: Socket.dev MUST analyze every dependency change for supply chain attack indicators.

**Socket.dev detects**:
- Typosquatting (package names similar to popular packages)
- Install scripts that execute arbitrary code
- Obfuscated code
- Network access from packages that should not need it
- Filesystem access outside the project directory
- Environment variable access (credential harvesting)
- Known malware signatures

### FR-SEC-076: Container Image Scanning (Trivy)

**Requirement**: Every Docker image MUST be scanned with Trivy before being pushed to the container registry.

**Implementation Notes**:
- Trivy scans for OS-level and application-level vulnerabilities.
- `exit-code: 1` ensures the pipeline fails on Critical or High findings.
- Results are uploaded as SARIF to GitHub's Code Scanning for centralized visibility.
- Base image (`node:22-alpine`) is rebuilt weekly to pick up OS-level patches.

### FR-SEC-077: Weekly Scheduled Scan

**Requirement**: A full security scan MUST run weekly even if no code changes occurred.

**Rationale**: New CVEs are published daily. A dependency that was clean last week may have a Critical CVE today. The weekly cron job (`0 6 * * 1`) catches these without waiting for a code change.

### FR-SEC-078: Dependabot Security Alerts

**Requirement**: Dependabot security alerts MUST be enabled on the repository with the following SLAs.

| Severity | Response SLA | Action |
|---|---|---|
| Critical | 24 hours | Merge Dependabot PR or apply manual fix |
| High | 72 hours | Merge Dependabot PR or apply manual fix |
| Medium | 7 days | Review and merge or document exception |
| Low | 30 days | Review at next dependency maintenance window |

---

## Implementation Priority

| Priority | Requirements | Sprint | Effort |
|---|---|---|---|
| P0 -- Ship at Launch | FR-SEC-001 to FR-SEC-008 (Headers), FR-SEC-009 to FR-SEC-015 (CSP in report-only mode), FR-SEC-016 to FR-SEC-024 (Form Security), FR-SEC-025 to FR-SEC-028 (Rate Limiting), FR-SEC-029 to FR-SEC-030 (Turnstile), FR-SEC-038 to FR-SEC-040 (Secrets), FR-SEC-043 to FR-SEC-046 (K8s Security), FR-SEC-048 to FR-SEC-050 (TLS), FR-SEC-051 to FR-SEC-052 (CORS), FR-SEC-053 to FR-SEC-054 (Cookies), FR-SEC-062 to FR-SEC-066 (Accessibility CI), FR-SEC-071 (Health Check), FR-SEC-073 to FR-SEC-074 (npm audit in CI) | Weeks 1-4 | ~5 days total |
| P1 -- Within 30 Days | FR-SEC-031 (Turnstile Fallback), FR-SEC-033 to FR-SEC-037 (Supply Chain), FR-SEC-042 (Sealed Secrets), FR-SEC-047 (HPA), FR-SEC-055 to FR-SEC-061 (GDPR/CCPA), FR-SEC-067 (VPAT), FR-SEC-075 to FR-SEC-078 (Socket.dev, Trivy, Dependabot) | Weeks 5-8 | ~4 days total |
| P2 -- Within 60 Days | FR-SEC-014 (CSP enforcement after report-only), FR-SEC-015 (CSP violation dashboard), FR-SEC-032 (Turnstile monitoring dashboard), FR-SEC-041 (Secret rotation schedule), FR-SEC-068 to FR-SEC-072 (Incident Response + Backup), FR-SEC-044 hardening (egress IP allowlisting) | Weeks 9-12 | ~3 days total |

---

## Risk Register (Security-Specific)

| ID | Risk | Likelihood | Impact | Score | Mitigation |
|---|---|---|---|---|---|
| SEC-R01 | Nonce-based CSP breaks Turnstile or MapLibre in unexpected browsers | Medium | High | 8 | Deploy in report-only mode for 7 days (FR-SEC-014); monitor violations; have `unsafe-inline` fallback ONLY as emergency rollback |
| SEC-R02 | K-12 school firewalls block challenges.cloudflare.com | High | High | 9 | Fallback mechanism with compensating controls (FR-SEC-031) |
| SEC-R03 | Supabase service_role key leaked via logs or error messages | Low | Critical | 8 | Never log the key; Sentry scrubs env vars by default; K8s Secret injection at runtime only |
| SEC-R04 | Supply chain attack via compromised npm package | Low | Critical | 8 | Socket.dev (FR-SEC-075) + frozen lockfile (FR-SEC-033) + Dependabot (FR-SEC-034) |
| SEC-R05 | DDoS overwhelms rate limiting | Low | Medium | 4 | Cloudflare WAF as first layer; K8s HPA for scaling; rate limiting is per-IP, not global |
| SEC-R06 | cert-manager renewal failure causes certificate expiry | Low | High | 6 | 30-day pre-expiry renewal; certificate expiry alerting at 14 days |
| SEC-R07 | GDPR erasure request misses data in CRM sync queue | Medium | Medium | 6 | Cascading delete includes crm_sync_queue (FR-SEC-057) |
| SEC-R08 | CSP report endpoint used for reconnaissance | Low | Low | 2 | Rate limit the CSP report endpoint; log but do not expose report data publicly |

---

## Security Checklist for Enterprise Buyers

The following controls can be cited in security questionnaires and procurement evaluations:

1. Nonce-based Content Security Policy (no `unsafe-inline`, no `unsafe-eval`)
2. HSTS with preload, TLS 1.2+ only, forward-secrecy cipher suites
3. 8-layer form defense (validation, CAPTCHA, rate limiting, honeypot, sanitization, IP hashing)
4. Zero PII in analytics (Plausible: no cookies, no fingerprinting)
5. IP addresses hashed with SHA-256 before storage (never stored in plaintext)
6. Kubernetes Pod Security Standards (restricted profile)
7. Network Policies enforcing least-privilege pod communication
8. Automated dependency scanning (npm audit, Socket.dev, Trivy)
9. SBOM generation for every release (CycloneDX format)
10. GDPR/CCPA compliance (data minimization, right to erasure, right to access)
11. WCAG 2.2 AA compliance with CI enforcement (axe-core, Lighthouse >= 95)
12. Automated certificate management (cert-manager + Let's Encrypt)
13. No secrets in Docker images (runtime injection via K8s Secrets)
14. CSP violation monitoring and alerting
15. Documented incident response runbooks with defined SLAs

---

## Architecture Decision Records

| ADR | Decision | Alternatives Considered | Rationale |
|---|---|---|---|
| SEC-ADR-001 | Nonce-based CSP over hash-based | `unsafe-inline`, hash-based CSP | Nonces are per-request unique; hashes require pre-computing all inline scripts; `unsafe-inline` is prohibited |
| SEC-ADR-002 | Supabase rate limiting over Redis | Redis, Upstash, in-memory | No additional infrastructure dependency; Supabase is already in the stack; query performance is sufficient with proper indexing |
| SEC-ADR-003 | Sealed Secrets over plaintext K8s Secrets in Git | Plaintext Secrets (gitignored), External Secrets Operator, HashiCorp Vault | Sealed Secrets is simple, requires no external service, and encrypts secrets for Git storage |
| SEC-ADR-004 | Turnstile over reCAPTCHA | reCAPTCHA v3, hCaptcha | Free, privacy-preserving, no Google dependency. K-12 buyers are sensitive to Google tracking |
| SEC-ADR-005 | Socket.dev over npm audit alone | npm audit only, Snyk, GitHub Advisory Database | Socket.dev detects supply chain attacks that vulnerability databases miss (typosquatting, malicious scripts) |
| SEC-ADR-006 | Pod Security Standards over PodSecurityPolicy | PodSecurityPolicy (deprecated), OPA/Gatekeeper | PSS is built into K8s 1.25+, zero dependency, namespace-level enforcement |

---

*This document is the authoritative security specification for the SafeTrekr Marketing Site. All implementation MUST conform to these requirements. Deviations require a documented risk acceptance with an expiration date in `security-decision-log.md`.*
