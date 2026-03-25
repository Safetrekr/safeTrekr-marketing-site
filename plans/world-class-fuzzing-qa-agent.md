# Testing, Quality Assurance & Adversarial Testing PRD

## SafeTrekr Marketing Site

**Agent**: Crash-to-Fix Oracle (CFO) v1.1
**Date**: 2026-03-24
**Status**: Draft
**Tech Stack**: Next.js 15 (App Router) / React 19 / Tailwind CSS 4 / DigitalOcean DOKS / Supabase / SendGrid
**Testing Stack**: Vitest / Playwright / axe-core / Lighthouse CI / bundlewatch

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Testing Infrastructure Setup](#2-testing-infrastructure-setup)
3. [Unit Testing Requirements](#3-unit-testing-requirements)
4. [Component Testing Requirements](#4-component-testing-requirements)
5. [Integration Testing Requirements](#5-integration-testing-requirements)
6. [End-to-End Testing Requirements](#6-end-to-end-testing-requirements)
7. [Accessibility Testing Requirements](#7-accessibility-testing-requirements)
8. [Performance Testing Requirements](#8-performance-testing-requirements)
9. [Security Testing Requirements](#9-security-testing-requirements)
10. [Visual Regression Testing Requirements](#10-visual-regression-testing-requirements)
11. [SEO Testing Requirements](#11-seo-testing-requirements)
12. [Cross-Browser Testing Requirements](#12-cross-browser-testing-requirements)
13. [CI Pipeline Integration](#13-ci-pipeline-integration)
14. [Test Data Management](#14-test-data-management)
15. [Quality Gates](#15-quality-gates)
16. [Monitoring and Alerting](#16-monitoring-and-alerting)
17. [Scenario-to-Test Mapping](#17-scenario-to-test-mapping)

---

## 1. Executive Summary

SafeTrekr is a security product selling documented trust. A single XSS vulnerability, an accessibility failure in a K-12 school district evaluation, or a broken demo request form does not just lose a lead -- it proves to the buyer that SafeTrekr cannot protect what it claims to protect. The testing strategy must reflect this existential constraint.

This PRD defines 15 functional requirement groups covering every layer of the testing pyramid, from isolated unit tests through production monitoring. It maps all 57 adversarial scenarios from `analysis/scenarios.md` to concrete test implementations and establishes quality gates that block merge and deploy when thresholds are violated.

**Key constraints from the tech stack**:

- **DigitalOcean DOKS** (not Vercel): No native preview deploys, no built-in Edge runtime, no automatic ISR cache. All CI/CD runs through GitHub Actions building Docker images pushed to DigitalOcean Container Registry. ISR caching is handled by Next.js standalone output with Nginx reverse proxy.
- **Next.js standalone output**: The `next build` produces a standalone Node.js server inside Docker. Image optimization uses `sharp` (self-hosted). Testing must validate the Docker build, not just `next dev`.
- **Nginx ingress controller**: SSL termination, caching, and security header injection happen at the Nginx layer, meaning header-based security tests must run against the full stack (not just Next.js).

**Testing budget breakdown**:

| Layer | Tool | Estimated Tests | Run Time Target |
|---|---|---|---|
| Unit | Vitest | 250-350 | < 30s |
| Component | Vitest + Testing Library | 80-120 | < 45s |
| Integration | Vitest + MSW | 40-60 | < 60s |
| E2E | Playwright | 80-100 | < 5 min (parallelized) |
| Accessibility | axe-core (in Playwright) | 20-30 | < 2 min |
| Performance | Lighthouse CI | 9 pages | < 3 min |
| Visual Regression | Playwright screenshots | 30-40 | < 3 min |
| Security | Playwright + API | 25-35 | < 2 min |
| SEO | Playwright + API | 15-20 | < 1 min |

---

## 2. Testing Infrastructure Setup

### FR-QA-001: Vitest Configuration

**Priority**: P0
**Acceptance Criteria**:

1. Vitest is configured in `vitest.config.ts` at the project root with the following settings:
   - `environment: 'jsdom'` for component tests, `environment: 'node'` for unit/integration tests
   - Path aliases matching `tsconfig.json` (e.g., `@/` maps to `src/`)
   - `globals: true` for implicit `describe`, `it`, `expect`
   - `setupFiles: ['./tests/setup.ts']` loading React Testing Library matchers, MSW server setup, and global mocks
   - CSS modules support via `css: { modules: { classNameStrategy: 'non-scoped' } }`
   - Coverage provider: `v8` with thresholds: `{ branches: 80, functions: 80, lines: 80, statements: 80 }`
   - `pool: 'forks'` for isolation between test files
   - `testTimeout: 10000` (10 seconds)
   - `include: ['src/**/*.test.ts', 'src/**/*.test.tsx']`
   - Workspace configuration splitting unit/component/integration into separate projects with appropriate environments

2. The `tests/setup.ts` file must:
   - Import `@testing-library/jest-dom/vitest` for DOM matchers
   - Initialize MSW server with `beforeAll`/`afterEach`/`afterAll` lifecycle hooks
   - Mock `next/navigation` (useRouter, usePathname, useSearchParams)
   - Mock `next/image` to render a standard `<img>` tag
   - Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to a test value
   - Suppress `console.error` for expected React warnings (configurable)

3. Scripts in `package.json`:
   - `"test"`: Runs all Vitest tests
   - `"test:unit"`: Runs tests matching `src/**/*.unit.test.ts`
   - `"test:component"`: Runs tests matching `src/**/*.component.test.tsx`
   - `"test:integration"`: Runs tests matching `src/**/*.integration.test.ts`
   - `"test:coverage"`: Runs with `--coverage` flag and outputs to `coverage/`
   - `"test:watch"`: Runs in watch mode for development

**Rationale**: Vitest provides native ESM support required by Next.js 15 / React 19, sub-second startup, and compatible API with the team's existing testing patterns.

### FR-QA-002: Playwright Configuration

**Priority**: P0
**Acceptance Criteria**:

1. Playwright is configured in `playwright.config.ts` with:
   - `baseURL` set from `PLAYWRIGHT_BASE_URL` environment variable (defaulting to `http://localhost:3000`)
   - Projects for 6 browser configurations:
     - `chromium` (desktop, 1280x720)
     - `firefox` (desktop, 1280x720)
     - `webkit` (desktop, 1280x720)
     - `mobile-chrome` (Pixel 5 device profile)
     - `mobile-safari` (iPhone 13 device profile)
     - `edge` (Microsoft Edge channel)
   - `retries: 2` in CI, `retries: 0` locally
   - `workers: '50%'` in CI (half of available cores)
   - `timeout: 30000` per test, `expect.timeout: 5000`
   - `use.trace: 'on-first-retry'` for debugging failures
   - `use.screenshot: 'only-on-failure'`
   - `use.video: 'on-first-retry'`
   - Output directory: `test-results/`
   - Reporter: `[['html', { open: 'never' }], ['json', { outputFile: 'test-results/results.json' }], ['github']]`

2. A `webServer` config starts the application before E2E runs:
   - For local: `command: 'npm run dev'`
   - For CI against staging: no webServer (tests hit the deployed staging namespace in DOKS)
   - For CI against Docker: `command: 'docker compose -f docker-compose.test.yml up --wait'`

3. Global setup in `tests/e2e/global-setup.ts`:
   - Validates required environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` for test project, `SENDGRID_API_KEY`)
   - Seeds the test Supabase project with baseline data if needed
   - Outputs a storage state file for authenticated scenarios (future)

4. Test files are organized as:
   - `tests/e2e/critical-path/` -- SCENARIO-001 through SCENARIO-012
   - `tests/e2e/edge-cases/` -- SCENARIO-013 through SCENARIO-019
   - `tests/e2e/security/` -- SCENARIO-020 through SCENARIO-028
   - `tests/e2e/performance/` -- SCENARIO-029 through SCENARIO-034
   - `tests/e2e/accessibility/` -- SCENARIO-035 through SCENARIO-040
   - `tests/e2e/integration/` -- SCENARIO-041 through SCENARIO-046
   - `tests/e2e/error-handling/` -- SCENARIO-047 through SCENARIO-052
   - `tests/e2e/data-integrity/` -- SCENARIO-053 through SCENARIO-057

**Rationale**: Playwright provides cross-browser coverage including WebKit (Safari), built-in network interception, and trace recording critical for debugging flaky tests in CI.

### FR-QA-003: axe-core Integration

**Priority**: P0
**Acceptance Criteria**:

1. `@axe-core/playwright` is installed and configured as a Playwright fixture:
   - A custom `test` fixture extends Playwright's base test with an `makeAxeBuilder()` helper
   - Default axe configuration disables rules that conflict with Next.js SSR patterns (documented with justification per rule)
   - WCAG 2.2 AA ruleset is explicitly enabled: `withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])`

2. Every E2E page test includes an axe scan as a final assertion:
   ```
   const results = await makeAxeBuilder().analyze();
   expect(results.violations).toEqual([]);
   ```

3. axe-core is also integrated into Vitest component tests via `@axe-core/react` for render-time checks on isolated components.

4. A dedicated accessibility test suite in `tests/e2e/accessibility/` runs axe-core against every page listed in the sitemap.

5. The axe configuration file `tests/axe.config.ts` exports shared settings used by both Playwright and Vitest integrations.

**Rationale**: axe-core detects approximately 57% of WCAG issues automatically. Combined with manual keyboard and screen reader tests, this covers the accessibility requirements for K-12 school district procurement (Section 508 compliance).

### FR-QA-004: Lighthouse CI Configuration

**Priority**: P0
**Acceptance Criteria**:

1. `@lhci/cli` is configured via `lighthouserc.js` at the project root with:
   - `collect.url`: All 9 core pages (/, /solutions/k12, /solutions/churches, /pricing, /how-it-works, /demo, /contact, /blog, /about)
   - `collect.numberOfRuns: 3` (median of 3 runs per page)
   - `collect.settings.chromeFlags: ['--no-sandbox', '--disable-gpu']` for CI Docker environments
   - `collect.settings.preset: 'desktop'` and a separate config for mobile
   - `assert.preset: 'lighthouse:recommended'` with overrides:
     - Performance: >= 95
     - Accessibility: >= 95
     - Best Practices: >= 95
     - SEO: >= 95
   - Specific audit assertions:
     - `largest-contentful-paint`: maxNumericValue: 1500 (1.5s)
     - `cumulative-layout-shift`: maxNumericValue: 0.05
     - `total-blocking-time`: maxNumericValue: 200
     - `interactive`: maxNumericValue: 3000
   - `upload.target: 'filesystem'` with `outputDir: '.lighthouseci/'` (uploaded as CI artifact)

2. Lighthouse CI runs against the Docker-built application (not `next dev`) to measure production-realistic performance.

3. For DOKS deployment: Lighthouse CI targets the staging namespace URL after the Docker image is deployed to the staging environment.

4. Results are stored as GitHub Actions artifacts and compared against the previous run to detect regressions.

**Rationale**: Lighthouse CI provides automated enforcement of Core Web Vitals budgets. Running against the Docker build ensures measurements reflect production conditions (standalone output + sharp image optimization), not development mode.

---

## 3. Unit Testing Requirements

### FR-QA-005: Utility Function Tests

**Priority**: P0
**Acceptance Criteria**:

1. **`src/lib/sanitize.ts`** -- Input sanitization (critical for SCENARIO-020, SCENARIO-025, SCENARIO-027):
   - Test that HTML tags are stripped or escaped: `<script>`, `<img onerror>`, `<svg onload>`, `<iframe>`
   - Test that SQL injection payloads are passed through as literal strings (not executed): `'; DROP TABLE`, `' OR '1'='1`
   - Test that email header injection characters are stripped from single-line fields: `\n`, `\r`, `\r\n`
   - Test that valid international characters are preserved: accented Latin (`Jose`), CJK, Arabic, Cyrillic
   - Test that emoji are preserved in message fields but stripped from name fields
   - Test that null bytes (`\0`) are stripped
   - Test boundary: empty string input returns empty string
   - Test boundary: input exceeding max length is truncated (not errored)
   - Minimum 20 test cases covering the OWASP XSS Filter Evasion Cheat Sheet patterns

2. **`src/lib/analytics.ts`** -- Analytics helpers (supports SCENARIO-043, SCENARIO-053):
   - Test `trackEvent()` calls Plausible API with correct parameters
   - Test `trackEvent()` no-ops when Plausible is not loaded (ad-blocker scenario)
   - Test `trackEvent()` no-ops during SSR (window is undefined)
   - Test UTM parameter extraction from URL search params
   - Test UTM parameter persistence across navigation (sessionStorage)
   - Test fallback to `source: 'direct'` when no UTM params exist
   - Test referrer capture from `document.referrer`
   - Minimum 12 test cases

3. **`src/lib/hash.ts`** -- IP hashing utility (critical for SCENARIO-054):
   - Test SHA-256 hash output is 64-character hex string
   - Test deterministic: same input always produces same hash
   - Test different inputs produce different hashes
   - Test with IPv4 and IPv6 addresses
   - Test that raw IP is never present in the output
   - Minimum 6 test cases

4. **`src/lib/rate-limit.ts`** -- Rate limiting logic (supports SCENARIO-022):
   - Test that requests within the limit succeed
   - Test that requests exceeding the limit return a 429 indicator
   - Test that the limit resets after the window expires
   - Test per-IP isolation (different IPs have independent limits)
   - Test sliding window vs. fixed window behavior (whichever is implemented)
   - Minimum 8 test cases

5. **`src/lib/turnstile.ts`** -- Turnstile verification (supports SCENARIO-023):
   - Test successful verification with valid token returns `{ success: true }`
   - Test expired token returns `{ success: false }`
   - Test missing token returns `{ success: false }`
   - Test invalid/fabricated token returns `{ success: false }`
   - Test network failure to Cloudflare returns a handled error (not an unhandled rejection)
   - Mock the Cloudflare siteverify API endpoint
   - Minimum 6 test cases

6. **`src/lib/format.ts`** -- Formatting utilities:
   - Test currency formatting (`$15/student`, `$450/trip`)
   - Test number formatting with locale awareness
   - Test date formatting for blog post dates
   - Test reading time calculation from MDX content length
   - Minimum 8 test cases

### FR-QA-006: Zod Schema Validation Tests

**Priority**: P0
**Acceptance Criteria**:

1. **Demo request schema** (`src/lib/schemas/demo-request.ts`):
   - Test valid submission with all required fields passes
   - Test valid submission with all optional fields passes
   - Test missing required fields each produce specific error messages
   - Test email validation: accepts valid emails, rejects malformed emails, rejects emails > 254 chars
   - Test firstName/lastName: min 1 char, max 100 chars, rejects empty strings
   - Test organization: min 1 char, max 200 chars
   - Test segment enum: accepts only defined values (k12, churches, higher_education, corporate, sports, other)
   - Test tripsPerYear: accepts 0-500, rejects negative numbers, rejects > 500
   - Test groupSize: accepts 1-1000, rejects 0, rejects > 1000
   - Test timeline enum: accepts only defined values
   - Test message: max 2000 chars, accepts empty
   - Test XSS payloads in string fields: schema should accept them (sanitization is a separate layer) OR reject HTML via regex refinement (document which approach is used)
   - Minimum 25 test cases

2. **Contact form schema** (`src/lib/schemas/contact.ts`):
   - Test valid submission passes
   - Test subject: min 1 char, max 200 chars
   - Test message: min 10 chars, max 5000 chars
   - Test email validation matches demo request schema
   - Minimum 12 test cases

3. **Newsletter schema** (`src/lib/schemas/newsletter.ts`):
   - Test valid email passes
   - Test invalid email formats rejected
   - Test empty email rejected
   - Minimum 6 test cases

4. **Quote request schema** (`src/lib/schemas/quote-request.ts`):
   - Test valid submission with all trip-specific fields
   - Test destination: max 200 chars
   - Test group_size: 1-1000
   - Test number_of_trips: 1-100
   - Test departure_date: must be future date
   - Minimum 15 test cases

5. All schema test files follow the naming convention `[schema-name].schema.unit.test.ts`.

6. Every Zod schema test includes a snapshot of the schema shape to detect unintentional schema changes.

**Rationale**: Zod schemas are the first line of defense against malformed and malicious input. Every field constraint must be tested because a missing `max()` on a string field creates an unbounded write to Supabase, and a missing enum constraint on segment allows injection of unexpected values into JSONB.

### FR-QA-007: Content Validation Tests

**Priority**: P1
**Acceptance Criteria**:

1. **Pricing data validation** (supports SCENARIO-006):
   - Test that pricing constants match the codebase source of truth:
     - Tier 1: $450/trip, $15/student (based on 30 students)
     - Tier 2: $750/trip
     - Tier 3: $1,250/trip
   - Test volume discount calculations: 5-9 trips (5%), 10-24 (10%), 25-49 (15%), 50+ (20%)
   - Test per-student price calculation function for varying group sizes
   - Test that no pricing value is hardcoded in component files (all imported from single source)

2. **Navigation structure validation** (supports SCENARIO-002):
   - Test that the navigation config exports exactly 5 primary items
   - Test that all navigation hrefs resolve to valid routes (cross-referenced with filesystem)
   - Test that mobile and desktop navigation configs are consistent

3. **SEO metadata validation** (supports SCENARIO-010):
   - Test that every page exports `generateMetadata` or has static metadata
   - Test that no two pages share the same title or description
   - Test that all titles are between 30-60 characters
   - Test that all descriptions are between 120-160 characters

4. **JSON-LD schema validation** (supports SCENARIO-057):
   - Test that JSON-LD output for each page type is valid JSON
   - Test that required schema.org properties are present per page type
   - Test that dates are ISO 8601 format
   - Test that image URLs are absolute
   - Test that no schema contains null or empty-string values for required fields

---

## 4. Component Testing Requirements

### FR-QA-008: shadcn/ui Customization Tests

**Priority**: P0
**Acceptance Criteria**:

1. **Button component** (`src/components/ui/button.tsx`):
   - Test all variants render: default, destructive, outline, secondary, ghost, link
   - Test all sizes render: default, sm, lg, icon
   - Test disabled state: `aria-disabled="true"`, no click handler fires, visual opacity
   - Test loading state: spinner visible, click disabled, `aria-busy="true"`
   - Test `asChild` prop renders as child element (e.g., `<a>`)
   - Test keyboard activation: Enter and Space trigger onClick
   - Test focus-visible ring appears on keyboard focus, not on mouse click
   - axe-core scan passes on each variant
   - Minimum 12 test cases

2. **Form components** (Input, Textarea, Select, Checkbox, RadioGroup):
   - Test each renders with a visible label (via `<Label>` or `aria-label`)
   - Test required state shows `aria-required="true"`
   - Test error state: `aria-invalid="true"`, `aria-describedby` points to error message
   - Test help text association via `aria-describedby`
   - Test `prefers-color-scheme: dark` renders without contrast failures (when dark mode is added)
   - Test custom select component is keyboard navigable (Arrow keys, Enter, Escape)
   - axe-core scan passes on each component in all states (default, error, disabled, focused)

3. **Sheet component** (mobile navigation drawer):
   - Test opens on trigger click
   - Test closes on overlay click
   - Test closes on Escape key press
   - Test focus is trapped inside the sheet when open
   - Test focus returns to trigger element when sheet closes
   - Test `aria-expanded` toggles on trigger
   - Test `role="dialog"` and `aria-modal="true"` on the sheet

4. **Dialog component** (lead capture modal, if used):
   - Same focus trap and ARIA tests as Sheet
   - Test content is removed from DOM when closed (not just hidden)
   - Test `aria-labelledby` points to the dialog title

### FR-QA-009: Form Component Tests

**Priority**: P0
**Acceptance Criteria**:

1. **DemoRequestForm component** (supports SCENARIO-003, SCENARIO-013, SCENARIO-014):
   - Test renders all required fields with correct labels
   - Test renders optional fields
   - Test Zod validation errors display inline on blur and on submit
   - Test successful submission shows success message
   - Test loading state during submission (button disabled, spinner)
   - Test double-click prevention: only one submission fires
   - Test honeypot field is in DOM but hidden (`display: none` or offscreen positioning)
   - Test honeypot field has `aria-hidden="true"` and `tabindex="-1"`
   - Test Turnstile widget container is present
   - Test segment pre-selection from URL query param (`/demo?segment=k12`)
   - Test all form data is passed to the Server Action
   - Test form preserves data on validation error (fields not cleared)

2. **ContactForm component** (supports SCENARIO-004):
   - Test required field validation (email, firstName, lastName, subject, message)
   - Test message minimum length enforcement (10 chars)
   - Test successful submission and success state

3. **NewsletterForm component** (supports SCENARIO-011):
   - Test email-only field with inline validation
   - Test success message: "Please check your email to confirm your subscription."
   - Test duplicate email submission handling

4. **QuoteRequestForm component** (supports SCENARIO-012):
   - Test trip-specific fields render (destination, departure date, group size, trip count)
   - Test date picker only allows future dates
   - Test all fields map to correct JSONB structure

### FR-QA-010: Navigation Component Tests

**Priority**: P0
**Acceptance Criteria**:

1. **Header/Navigation component** (supports SCENARIO-002):
   - Test renders 5 primary nav items with correct labels and hrefs
   - Test `aria-current="page"` is set on the active nav item
   - Test scroll behavior: transparent background at top, solid background after scroll
   - Test CTA button appears after scroll threshold
   - Test skip navigation link is the first focusable element
   - Test logo links to homepage
   - Test mobile breakpoint: hamburger menu visible below 1024px, nav items hidden
   - Test mega-menu for Solutions: opens on hover/focus, shows segment links

2. **MobileNav component**:
   - Test hamburger button has `aria-expanded`, `aria-controls`, `aria-label`
   - Test opens the Sheet component on click
   - Test all nav items are present and functional inside the Sheet
   - Test closing the menu returns focus to the hamburger button

3. **Footer component** (supports SCENARIO-011):
   - Test renders all footer links with correct hrefs
   - Test newsletter form is present
   - Test renders the current year in copyright
   - Test landmark: `role="contentinfo"` or `<footer>` element

4. **Breadcrumb component** (supports SCENARIO-008, SCENARIO-040):
   - Test renders correct breadcrumb trail per page
   - Test `aria-label="Breadcrumb"` on the nav element
   - Test current page item has `aria-current="page"`
   - Test breadcrumb JSON-LD output matches visual breadcrumb

---

## 5. Integration Testing Requirements

### FR-QA-011: Server Action Integration Tests

**Priority**: P0
**Acceptance Criteria**:

1. **Demo request Server Action** (`src/app/actions/demo-request.ts`):
   - Test with valid input: returns `{ success: true, message: '...' }`
   - Test with invalid Zod input: returns `{ success: false, errors: {...} }`
   - Test with filled honeypot: returns `{ success: true }` (silent rejection, no DB write)
   - Test with missing Turnstile token: returns `{ success: false, message: 'Verification failed.' }`
   - Test with expired Turnstile token: returns `{ success: false }`
   - Test Supabase write: mock Supabase client, verify `.insert()` called with correct payload
   - Test SendGrid call: mock SendGrid, verify email payload includes all form fields
   - Test SendGrid failure does not prevent Supabase write (SCENARIO-049)
   - Test UTM parameters are extracted from headers/cookies and included in Supabase record
   - Test IP is hashed before storage (SCENARIO-054)
   - Test rate limiting: mock rate limiter, verify 429 response after threshold
   - Use MSW (Mock Service Worker) to intercept Supabase and SendGrid HTTP calls
   - Minimum 15 test cases

2. **Contact form Server Action** (`src/app/actions/contact.ts`):
   - Same pattern as demo request with contact-specific fields
   - Minimum 10 test cases

3. **Newsletter Server Action** (`src/app/actions/newsletter.ts`):
   - Test creates `newsletter_subscribers` record with `confirmed = false`
   - Test generates a `confirmation_token`
   - Test SendGrid confirmation email is dispatched with correct link
   - Test duplicate email returns a non-error response (idempotent)
   - Minimum 8 test cases

4. **Quote request Server Action** (`src/app/actions/quote-request.ts`):
   - Test trip-specific JSONB details structure
   - Minimum 8 test cases

### FR-QA-012: Supabase Persistence Tests

**Priority**: P0
**Acceptance Criteria**:

1. Tests run against a dedicated Supabase test project (see FR-QA-050 for test data management).

2. **`form_submissions` table**:
   - Test INSERT with all form types: demo_request, contact, quote_request, sample_binder_download
   - Test JSONB `details` column stores form-type-specific data correctly
   - Test `created_at` is auto-populated
   - Test `status` defaults to `'new'`
   - Test `crm_sync_status` defaults to `'pending'`
   - Test the database trigger creates a `crm_sync_queue` entry on INSERT
   - Test RLS: `anon` key cannot SELECT, INSERT, UPDATE, or DELETE (SCENARIO-046)
   - Test RLS: `service_role` key can perform all operations
   - Test max field lengths match Zod schema constraints (no truncation)

3. **`newsletter_subscribers` table**:
   - Test INSERT with valid email and generated token
   - Test `confirmed` defaults to `false`
   - Test confirmation update: setting `confirmed = true` and `confirmed_at`
   - Test unique constraint on email (duplicate rejection)
   - Test RLS same as `form_submissions`

4. **`analytics_events` table** (if used for server-side event tracking):
   - Test INSERT with event name, properties, timestamp
   - Test RLS prevents anon access

### FR-QA-013: SendGrid Delivery Tests

**Priority**: P1
**Acceptance Criteria**:

1. Tests use the SendGrid sandbox mode or a dedicated test API key that does not send real emails.

2. **Notification email template tests**:
   - Test demo request notification email contains all submitted fields
   - Test contact form notification email contains subject and message
   - Test reply-to header is set to the submitter's email address
   - Test from address is always the configured SafeTrekr sender
   - Test subject line includes form type identifier

3. **Newsletter confirmation email tests**:
   - Test confirmation email is sent to the subscriber's email
   - Test the confirmation link includes a valid token
   - Test the confirmation link URL structure is correct

4. **Email header injection prevention** (SCENARIO-027):
   - Test that `\n` and `\r` in form fields do not inject additional email headers
   - Test that From, Bcc, Cc headers cannot be overridden by form input
   - Verify through mock inspection that SendGrid API payload uses structured JSON (not raw SMTP), which inherently prevents header injection

5. **Failure handling**:
   - Test SendGrid 500 response: verify error is logged, Supabase write still succeeds
   - Test SendGrid 429 response: verify graceful handling
   - Test SendGrid timeout: verify timeout is < 10 seconds

---

## 6. End-to-End Testing Requirements

### FR-QA-014: Critical Path E2E Tests

**Priority**: P0
**Maps to**: SCENARIO-001 through SCENARIO-012

Every critical path scenario must have a corresponding Playwright test that executes the full user flow from browser to database. These tests are the final gate before any deployment to production.

1. **Homepage rendering** (SCENARIO-001):
   - File: `tests/e2e/critical-path/homepage.spec.ts`
   - Navigate to `/`, assert hero headline text, subheadline, primary CTA ("See a Sample Safety Binder")
   - Assert trust metrics strip: 5 badges visible with correct text
   - Assert sticky header with logo and 5 nav items
   - Assert `document.title` is non-empty and unique
   - Assert JSON-LD `<script type="application/ld+json">` present with `@type: Organization`
   - Assert no console errors (`page.on('console', ...)` filtering for `error` level)
   - Assert LCP < 1.5s via Performance API: `page.evaluate(() => new PerformanceObserver(...))`
   - Run axe-core scan, assert zero violations

2. **Primary navigation** (SCENARIO-002):
   - File: `tests/e2e/critical-path/navigation.spec.ts`
   - Click each of 5 primary nav links, assert URL changes, page heading renders, no 404
   - Assert `aria-current="page"` on active link
   - Assert logo click returns to `/`
   - Assert `page.goBack()` and `page.goForward()` work without errors

3. **Demo request form E2E** (SCENARIO-003):
   - File: `tests/e2e/critical-path/demo-request.spec.ts`
   - Fill all required and optional fields
   - Wait for Turnstile (in test mode: configure Turnstile test keys that auto-pass)
   - Assert honeypot field exists, is hidden, is not filled
   - Click submit, assert loading state on button
   - Assert success message text
   - Query Supabase test project via API: assert record exists with all fields
   - Assert Plausible conversion event fired (intercept network request to plausible.io)

4. **Contact form E2E** (SCENARIO-004):
   - File: `tests/e2e/critical-path/contact-form.spec.ts`
   - Same pattern as demo request with contact-specific assertions

5. **Sample binder download** (SCENARIO-005):
   - File: `tests/e2e/critical-path/sample-binder.spec.ts`
   - Navigate to `/resources/sample-binders`
   - Select K-12 binder, fill lead capture form, submit
   - Assert download link appears and PDF downloads (check response Content-Type: application/pdf)
   - Assert Supabase record with `form_type = 'sample_binder_download'`

6. **Pricing page** (SCENARIO-006):
   - File: `tests/e2e/critical-path/pricing.spec.ts`
   - Assert "$15/student" text visible in primary pricing framing
   - Assert all 3 tier cards render with correct dollar amounts ($450, $750, $1,250)
   - Assert FAQ section renders
   - Assert JSON-LD Product schema present
   - Assert CTA buttons link to `/demo` or `/contact`

7. **Solution pages** (SCENARIO-007):
   - File: `tests/e2e/critical-path/solutions.spec.ts`
   - Navigate to each segment page: k12, churches, higher-education, corporate
   - Assert segment-specific headline, pain points, benefits
   - Assert unique `document.title` per page
   - Assert CTA passes segment context (check href includes segment param)

8. **Blog rendering** (SCENARIO-008):
   - File: `tests/e2e/critical-path/blog.spec.ts`
   - Navigate to `/blog`, assert post cards render
   - Click first post, assert title, date, author, body content
   - Assert Article JSON-LD schema
   - Assert breadcrumb visual + schema
   - Assert OG meta tags present
   - Check response headers for appropriate `Cache-Control` values (adapted for DOKS/Nginx caching vs. Vercel CDN)

9. **Mobile responsive layout** (SCENARIO-009):
   - File: `tests/e2e/critical-path/responsive.spec.ts`
   - Test at 5 viewports: 375px, 390px, 768px, 1024px, 1280px
   - Per viewport on homepage: no horizontal overflow, text readable, images not distorted, touch targets >= 44x44px
   - Assert hamburger menu at < 1024px: opens, closes, navigates
   - Submit demo form at 375px viewport
   - Assert sticky header does not obscure content

10. **Search engine crawlability** (SCENARIO-010):
    - File: `tests/e2e/critical-path/seo-crawl.spec.ts`
    - Fetch `/robots.txt`: assert `User-agent: *` allows marketing paths, blocks `/api/` and `/_next/`
    - Assert AI crawler user-agents explicitly allowed (GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Amazonbot, Applebot-Extended, cohere-ai)
    - Fetch `/sitemap.xml`: assert all core pages listed, blog posts listed, landing pages excluded
    - For each sitemap URL: assert HTTP 200, unique `<title>`, unique `<meta name="description">`, canonical URL set
    - Assert no `noindex` meta tag on marketing pages

11. **Newsletter signup** (SCENARIO-011):
    - File: `tests/e2e/critical-path/newsletter.spec.ts`
    - Scroll to footer on any page
    - Enter email, submit
    - Assert success message: "Please check your email to confirm your subscription."
    - Query Supabase: assert record with `confirmed = false` and `confirmation_token` populated

12. **Quote request form** (SCENARIO-012):
    - File: `tests/e2e/critical-path/quote-request.spec.ts`
    - Navigate from pricing page CTA
    - Fill all fields including trip-specific details
    - Submit, assert success
    - Query Supabase: assert record with `form_type = 'quote_request'` and JSONB details

### FR-QA-015: Edge Case E2E Tests

**Priority**: P1
**Maps to**: SCENARIO-013 through SCENARIO-019

1. **Maximum field lengths** (SCENARIO-013):
   - Fill demo form with maximum-length values for every field (254 char email, 100 char names, 200 char org, 2000 char message, tripsPerYear=500, groupSize=1000)
   - Submit and verify no truncation in Supabase

2. **Double-click prevention** (SCENARIO-014):
   - Fill form, double-click submit rapidly (< 100ms gap)
   - Assert button disables after first click
   - Query Supabase: assert exactly 1 record
   - Repeat for contact and newsletter forms

3. **Browser back/forward** (SCENARIO-015):
   - Navigate /pricing -> /demo, fill partially, goBack, goForward
   - Assert no "Confirm Form Resubmission" dialog
   - Complete and submit, assert success

4. **MapLibre slow connection** (SCENARIO-016):
   - Use Playwright `page.route()` to throttle requests to `api.maptiler.com`
   - Assert static fallback renders immediately
   - Assert hero headline and CTA are visible while map loads
   - Assert page remains interactive during map load
   - Test offline: assert static fallback persists, page is usable

5. **JavaScript disabled** (SCENARIO-017):
   - Configure `javaScriptEnabled: false` in Playwright context
   - Navigate to homepage: assert text content renders (SSG HTML)
   - Navigate via standard `<a>` links to pricing: assert content renders
   - Navigate to demo: assert `<noscript>` message appears
   - Assert no broken visual states from Framer Motion

6. **Unicode/emoji support** (SCENARIO-018):
   - Submit contact form with accented Latin, CJK, Arabic, and emoji characters
   - Query Supabase: assert UTF-8 characters stored correctly (no mojibake)

7. **ISR revalidation** (SCENARIO-019):
   - Note: ISR on DOKS uses Next.js standalone cache, not Vercel CDN. Test by checking cache behavior through Nginx `X-Cache` headers or by inspecting Next.js cache directory in Docker container.
   - Modify blog post content, trigger revalidation via `revalidatePath()`
   - Assert updated content appears on subsequent request

---

## 7. Accessibility Testing Requirements

### FR-QA-016: Automated Accessibility Scanning

**Priority**: P0
**Maps to**: SCENARIO-035, SCENARIO-036, SCENARIO-037, SCENARIO-040

**Acceptance Criteria**:

1. axe-core runs on every page after full render (including lazy-loaded content) in Playwright E2E tests.

2. A dedicated test suite `tests/e2e/accessibility/full-scan.spec.ts` iterates over every URL in the sitemap and runs axe-core. Zero violations allowed.

3. axe-core WCAG 2.2 AA rules are enforced with zero tolerance for:
   - `color-contrast` (SCENARIO-037)
   - `label` (SCENARIO-036)
   - `aria-required-attr`
   - `aria-valid-attr-value`
   - `heading-order` (SCENARIO-040)
   - `landmark-one-main` (SCENARIO-040)
   - `landmark-unique`
   - `page-has-heading-one` (SCENARIO-040)
   - `image-alt`
   - `link-name`
   - `button-name`

4. Any axe-core rule that is disabled must have a documented justification in `tests/axe.config.ts` with a linked manual test plan.

### FR-QA-017: Keyboard Navigation Tests

**Priority**: P0
**Maps to**: SCENARIO-035, SCENARIO-038, SCENARIO-039

**Acceptance Criteria**:

1. **Full Tab sequence test** (SCENARIO-035):
   - File: `tests/e2e/accessibility/keyboard-nav.spec.ts`
   - Starting from homepage body, Tab through: skip nav link -> logo -> 5 nav items -> hero CTA -> all interactive elements in DOM order
   - Assert every focused element has a visible focus ring (screenshot comparison or computed style check for `outline` or `box-shadow`)
   - Assert dropdown nav items openable with Enter/Space, navigable with Arrow keys
   - Tab through demo form fields in logical order
   - Submit form with Enter key
   - Assert success message receives focus

2. **Skip navigation** (SCENARIO-039):
   - Press Tab once from page load
   - Assert skip link is visible and focused
   - Press Enter, assert focus moves to `<main>` element
   - Press Tab again, assert focus is within main content (not navigation)
   - Test on every layout variant: marketing, blog, legal

3. **Focus management on state transitions** (SCENARIO-038):
   - Submit form, assert focus moves to success message
   - Submit form with errors, assert focus moves to first error or error summary
   - Navigate between pages, assert focus resets to top/main content area

4. **Mobile menu keyboard** (SCENARIO-035):
   - At mobile viewport, Tab to hamburger, open with Enter
   - Assert focus trapped in sheet
   - Navigate items with Arrow keys
   - Close with Escape, assert focus returns to hamburger

### FR-QA-018: Screen Reader Compatibility Tests

**Priority**: P0
**Maps to**: SCENARIO-036

**Acceptance Criteria**:

1. **Automated checks** (via Playwright + axe-core):
   - All form fields have visible labels announced by screen readers (`<label>` or `aria-label`)
   - Required fields have `aria-required="true"`
   - Help text associated via `aria-describedby`
   - Validation errors associated via `aria-describedby` or `aria-errormessage`
   - Error announcements use `aria-live="polite"` or `role="alert"`
   - Success messages use `aria-live="assertive"` or `role="status"`
   - Turnstile widget is hidden from screen readers or properly labeled

2. **Manual verification checklist** (runs quarterly, not in CI):
   - VoiceOver (macOS) walkthrough of demo request form: all fields announced correctly
   - VoiceOver navigation of homepage: landmarks, headings, links announced
   - NVDA (Windows) walkthrough of same flows (tested via BrowserStack or local VM)
   - Document findings in `tests/manual/screen-reader-audit.md`

### FR-QA-019: Color Contrast Validation

**Priority**: P0
**Maps to**: SCENARIO-037

**Acceptance Criteria**:

1. axe-core `color-contrast` rule runs on every page with zero violations.

2. Unit tests in `src/lib/design-tokens.unit.test.ts` validate critical contrast ratios:
   - `foreground (#061a23)` on `background (#e7ecee)`: >= 4.5:1 (expected ~14.2:1)
   - `muted-foreground` on `background`: >= 4.5:1
   - `muted-foreground` on `card (#f7f8f8)`: >= 4.5:1
   - `primary-foreground (#ffffff)` on `primary-600 (#3f885b)`: >= 4.5:1 (button text)
   - `secondary-foreground (#e7ecee)` on `secondary (#123646)`: >= 4.5:1
   - `destructive-foreground (#ffffff)` on `destructive (#c1253e)`: >= 4.5:1

3. The contrast calculation function is tested with known passing and failing color pairs.

4. Any color token change in the design system triggers these tests.

---

## 8. Performance Testing Requirements

### FR-QA-020: Lighthouse CI Thresholds

**Priority**: P0
**Maps to**: SCENARIO-029, SCENARIO-030

**Acceptance Criteria**:

1. Lighthouse CI runs against all 9 core pages with the following minimum thresholds:
   - Performance: 95
   - Accessibility: 95
   - Best Practices: 95
   - SEO: 95

2. Individual audit assertions:
   - `largest-contentful-paint` <= 1500ms (1.5s)
   - `cumulative-layout-shift` <= 0.05
   - `total-blocking-time` <= 200ms
   - `interactive` (TTI) <= 3000ms
   - `speed-index` <= 2000ms

3. Lighthouse CI runs in two modes:
   - **Desktop**: Default Lighthouse desktop settings
   - **Mobile**: Simulated Moto G Power throttling

4. Results are compared against a stored baseline. A regression of > 5 points in any category blocks the pipeline.

5. For DOKS deployment: Lighthouse runs against the Docker-built application served locally (via `docker compose`) in CI, and against the staging namespace URL after staging deploy.

### FR-QA-021: Bundle Size Gates

**Priority**: P0
**Maps to**: SCENARIO-031, SCENARIO-033

**Acceptance Criteria**:

1. `bundlewatch` is configured in `bundlewatch.config.js` with the following thresholds (gzipped):
   - First Load JS (shared/framework): < 90KB
   - Homepage page JS: < 30KB (excluding shared)
   - Any single page JS: < 50KB (excluding shared)
   - Total initial JS for any page: < 150KB
   - MapLibre GL JS chunk: confirm it is a separate async chunk, NOT in shared/initial
   - Framer Motion chunk: < 20KB

2. `bundlewatch` runs on every PR and blocks merge if any threshold is exceeded.

3. A `next build` analysis step in CI outputs the build summary and captures:
   - Per-route bundle sizes
   - Shared chunk sizes
   - Dynamic import chunks
   - Any chunk exceeding 50KB is flagged for review

4. Specific checks for common bundle bloat:
   - `lucide-react` is tree-shaken (not the full 1MB+ library)
   - Radix UI primitives are individually imported
   - No duplicate React runtime
   - `sharp` is NOT in the client bundle (server-only)

### FR-QA-022: Core Web Vitals Monitoring

**Priority**: P1
**Maps to**: SCENARIO-030, SCENARIO-032

**Acceptance Criteria**:

1. Playwright E2E tests collect CWV metrics via the Performance API on critical pages:
   ```
   const lcpEntry = await page.evaluate(() => {
     return new Promise(resolve => {
       new PerformanceObserver(list => {
         const entries = list.getEntries();
         resolve(entries[entries.length - 1].startTime);
       }).observe({ type: 'largest-contentful-paint', buffered: true });
     });
   });
   expect(lcpEntry).toBeLessThan(1500);
   ```

2. CLS is measured on all pages via the Performance API and asserted < 0.05.

3. Image optimization checks (SCENARIO-032):
   - Assert all `<img>` elements have `srcset` and `sizes` attributes
   - Assert above-the-fold images have `loading="eager"` or `fetchpriority="high"`
   - Assert below-the-fold images have `loading="lazy"`
   - Assert images are served in AVIF or WebP format (check network responses)
   - Assert no image is served at > 2x its display dimensions

### FR-QA-023: Animation Performance Tests

**Priority**: P2
**Maps to**: SCENARIO-034

**Acceptance Criteria**:

1. Test `prefers-reduced-motion: reduce`:
   - Use Playwright `page.emulateMedia({ reducedMotion: 'reduce' })`
   - Navigate to homepage, scroll through entire page
   - Assert no elements have `opacity: 0` or `transform: translate` as initial state (content must be visible)
   - Assert no Framer Motion animation classes are active
   - Assert no JavaScript errors from Framer Motion

2. Test animation frame performance (normal motion):
   - Record a Performance trace during scroll animation
   - Assert no long frames (> 50ms) during scroll-triggered animations
   - Assert no layout thrashing during animation

---

## 9. Security Testing Requirements

### FR-QA-024: XSS Prevention Tests

**Priority**: P0
**Maps to**: SCENARIO-020, SCENARIO-055

**Acceptance Criteria**:

1. **Reflected XSS** (Playwright):
   - Submit each form with XSS payloads in every text field:
     - `<script>alert('XSS')</script>`
     - `<img src=x onerror=alert('XSS')>`
     - `"><svg onload=alert(document.cookie)>`
     - `javascript:alert('XSS')`
     - `<iframe src="https://evil.com"></iframe>`
     - `<body onload=alert('XSS')>`
     - `<input onfocus=alert('XSS') autofocus>`
   - After form submission, navigate to any page that might render stored data
   - Assert no JavaScript `alert` dialog appears (Playwright dialog handler)
   - Assert no `<script>`, `<iframe>`, `<svg>`, or event handler attributes in the rendered HTML

2. **Stored XSS** (API test):
   - Insert XSS payloads into Supabase via Server Action
   - Query the stored values and assert they are escaped or stored as literal text
   - If any admin/dashboard renders this data, verify escaping there too

3. **JSONB XSS** (SCENARIO-055):
   - Submit demo request with XSS payloads in fields that map to JSONB `details`
   - Assert Zod enum validation rejects most payloads
   - Assert no prototype pollution (`{"__proto__":{"polluted":"yes"}}` stored as literal string)
   - Assert no SQL escape from JSONB column boundary

4. **CSP enforcement** (SCENARIO-024):
   - Fetch any page, extract `Content-Security-Policy` header
   - Assert `default-src 'self'`
   - Assert `script-src` includes `'self'`, `https://challenges.cloudflare.com`, `https://plausible.io`
   - Assert `frame-src` allows only `https://challenges.cloudflare.com`
   - **FLAG and assert**: `'unsafe-inline'` and `'unsafe-eval'` are NOT in `script-src` for production. If they are present, the test MUST fail with a clear message: "CSP contains unsafe-inline/unsafe-eval. Replace with nonce-based CSP before production launch."
   - Assert `img-src` includes `'self'`, `data:`, `blob:`, `https://api.maptiler.com`
   - Assert `connect-src` includes Plausible, MapTiler, and Supabase domains

### FR-QA-025: CSRF and Origin Validation Tests

**Priority**: P0
**Maps to**: SCENARIO-021

**Acceptance Criteria**:

1. **Cross-origin form POST** (API test):
   - Send a POST request to the demo request Server Action endpoint with `Origin: https://evil.com`
   - Assert the request is rejected (HTTP 403 or no action executed)
   - Verify Next.js Server Actions' built-in CSRF protection via `__next_action_id`

2. **Cross-origin fetch** (API test):
   - Send a `fetch()` request from a different origin
   - Assert CORS headers reject the request
   - Assert `Access-Control-Allow-Origin` does not include `*` or untrusted domains

3. **Direct API route access** (API test):
   - If any API routes exist (e.g., `/api/og`, `/api/analytics/event`), verify they validate the `Origin` header
   - Assert `X-Frame-Options: DENY` prevents clickjacking (SCENARIO-028)

### FR-QA-026: Rate Limiting Tests

**Priority**: P0
**Maps to**: SCENARIO-022

**Acceptance Criteria**:

1. **Form submission rate limiting** (API test):
   - Submit the demo form successfully once
   - Submit 10 more times in rapid succession from the same IP
   - Assert HTTP 429 after the threshold (expected: 3-5 per minute)
   - Assert response includes `Retry-After` header
   - Assert response body: `{ success: false, message: "Too many requests. Please try again later." }`
   - Wait for rate limit window to expire
   - Assert next submission succeeds

2. **Cross-form rate limiting**:
   - Submit to demo, contact, and newsletter forms in rapid succession
   - Assert shared per-IP rate limit applies across all forms

3. **Analytics endpoint rate limiting**:
   - If `/api/analytics/event` exists, apply same rate limit tests

### FR-QA-027: Bot Detection Tests

**Priority**: P0
**Maps to**: SCENARIO-023, SCENARIO-026

**Acceptance Criteria**:

1. **Turnstile bypass attempts** (API test):
   - Submit without Turnstile token: assert HTTP 403
   - Submit with expired token: assert rejection
   - Submit with fabricated token: assert rejection
   - Submit with token from different site key: assert rejection
   - Submit with already-used token (replay): assert rejection
   - Assert all rejections are logged

2. **Honeypot field** (SCENARIO-026):
   - Inspect form HTML: assert honeypot field has `display: none` or offscreen positioning
   - Assert `aria-hidden="true"` and `tabindex="-1"` on honeypot
   - Submit with honeypot filled: assert HTTP 200 (fake success), no Supabase record
   - Submit with honeypot empty: assert normal processing
   - Assert `honeypot_triggered` is logged for monitoring

### FR-QA-028: SQL Injection Tests

**Priority**: P0
**Maps to**: SCENARIO-025

**Acceptance Criteria**:

1. **Form-based SQL injection** (API test):
   - Submit contact form with payloads:
     - `test@example.com'; DROP TABLE form_submissions;--`
     - `' OR '1'='1`
     - `Robert'); DELETE FROM newsletter_subscribers WHERE ('1'='1`
     - `1; SELECT * FROM pg_shadow;--`
   - Assert form either rejects (Zod validation) or stores as literal text
   - Query Supabase: assert `form_submissions` and `newsletter_subscribers` tables intact
   - Assert no database error details in HTTP response
   - Assert Server Actions use Supabase client `.insert()` (parameterized), not raw SQL

### FR-QA-029: Security Headers Tests

**Priority**: P1
**Maps to**: SCENARIO-028

**Acceptance Criteria**:

1. **Full header suite** (API test):
   - Fetch any page and assert these response headers:
     - `X-Frame-Options: DENY`
     - `X-Content-Type-Options: nosniff`
     - `Referrer-Policy: strict-origin-when-cross-origin`
     - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
     - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
     - `Content-Security-Policy` (per FR-QA-024 assertions)
   - Assert headers present on SSG pages, ISR pages, and API routes
   - Assert no `X-Powered-By` header (Next.js `poweredByHeader: false`)
   - Assert no server information leakage in `Server` header

2. **Note for DOKS**: Security headers may be injected at the Nginx ingress layer rather than (or in addition to) `next.config.ts`. Tests must validate the final response headers as received by the client, regardless of which layer adds them. The test does not care about implementation -- it cares about the HTTP response.

---

## 10. Visual Regression Testing Requirements

### FR-QA-030: Playwright Screenshot Comparison

**Priority**: P1

**Acceptance Criteria**:

1. **Baseline screenshots** are captured for every core page at 3 viewport widths:
   - Mobile: 375px (iPhone SE)
   - Tablet: 768px (iPad)
   - Desktop: 1280px

2. **Pages with baseline screenshots**:
   - Homepage (above the fold + full page)
   - Solutions K-12
   - Solutions Churches
   - Pricing (all tier cards visible)
   - How It Works (timeline section)
   - Demo request form (empty + with validation errors + success state)
   - Contact form
   - Blog index
   - Blog post (first post)
   - About page
   - 404 page
   - Footer (newsletter form visible)

3. **Comparison settings**:
   - Threshold: 0.2% pixel difference allowed (accounts for anti-aliasing)
   - `maxDiffPixelRatio: 0.002`
   - Animations disabled during screenshot: `page.emulateMedia({ reducedMotion: 'reduce' })`
   - MapLibre map replaced with static fallback during screenshots (network request interception)
   - Font loading stabilized via `page.waitForLoadState('networkidle')` or explicit font ready check

4. **Baseline management**:
   - Baseline images stored in `tests/e2e/visual-baselines/` and committed to the repository
   - Updating baselines requires explicit `npx playwright test --update-snapshots` and a review of the diff
   - CI runs visual regression tests on every PR but does NOT auto-update baselines
   - Failed visual tests upload diff images as CI artifacts for review

5. **Dark section screenshots** (if dark sections are used on pages):
   - Capture screenshots of dark-background sections separately
   - Assert text contrast in dark sections via visual comparison

### FR-QA-031: Component Visual Snapshots

**Priority**: P2

**Acceptance Criteria**:

1. Key components are visually snapshot-tested in isolation using Playwright component testing or Storybook + Chromatic (if Storybook is adopted):
   - Button (all 6 variants x 3 sizes = 18 snapshots)
   - PricingTierCard (3 tiers)
   - TrustMetricsStrip
   - SegmentCard (4 segments)
   - NavigationHeader (desktop + mobile)
   - Form field states (default, focused, error, disabled)

2. Snapshots are at 1x resolution to reduce file size.

---

## 11. SEO Testing Requirements

### FR-QA-032: Structured Data Validation

**Priority**: P1
**Maps to**: SCENARIO-057

**Acceptance Criteria**:

1. **JSON-LD extraction and validation** (Playwright):
   - For each page, extract all `<script type="application/ld+json">` elements
   - Parse as JSON and assert valid structure
   - Validate per page type:
     - Homepage: Organization + WebSite schemas
     - Solutions pages: Service or Product schema with segment information
     - Pricing: Product schema with pricing offers (AggregateOffer)
     - Blog posts: Article + BreadcrumbList schemas
     - FAQ sections: FAQPage schema
     - About: Organization schema
     - Contact: ContactPage schema
   - Assert no duplicate schema types on a single page
   - Assert all required fields are populated (no empty strings, no null)
   - Assert dates in ISO 8601 format
   - Assert image URLs are absolute (start with `https://`)

2. **Google Rich Results API** (API test, optional):
   - If the Google Rich Results Testing API is available, submit each page URL
   - Assert all schemas are eligible for rich results
   - Flag any warnings

### FR-QA-033: Meta Tag Verification

**Priority**: P1
**Maps to**: SCENARIO-010

**Acceptance Criteria**:

1. **Per-page meta tag assertions** (Playwright):
   - For every page in the sitemap:
     - `<title>` is non-empty, unique across all pages, 30-60 characters
     - `<meta name="description">` is non-empty, unique, 120-160 characters
     - `<link rel="canonical">` is set to the page's own URL (self-referencing)
     - `<meta property="og:title">` matches or is derived from `<title>`
     - `<meta property="og:description">` matches or is derived from `<meta description>`
     - `<meta property="og:image">` points to a valid URL (fetch and assert 200)
     - `<meta property="og:type">` is set (website for pages, article for blog posts)
     - `<meta name="twitter:card">` is set to `summary_large_image`
   - Assert no page has `<meta name="robots" content="noindex">` unless it is a landing page (`/lp/*`)

2. **Sitemap validation** (API test):
   - Fetch `/sitemap.xml`, parse as XML
   - Assert all core pages present: /, /solutions/*, /pricing, /how-it-works, /demo, /contact, /about, /blog, /blog/*
   - Assert landing pages (`/lp/*`) are NOT in the sitemap
   - Assert legal pages are present
   - Assert `<lastmod>` dates are ISO 8601 and not in the future
   - Assert each URL in the sitemap returns HTTP 200

3. **robots.txt validation** (API test):
   - Fetch `/robots.txt`
   - Assert `User-agent: *` section allows all marketing paths
   - Assert `/api/` and `/_next/` are disallowed
   - Assert AI crawler user-agents are explicitly allowed: GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Amazonbot, Applebot-Extended, cohere-ai
   - Assert `Sitemap:` directive points to `/sitemap.xml`

---

## 12. Cross-Browser Testing Requirements

### FR-QA-034: Browser Matrix

**Priority**: P1

**Acceptance Criteria**:

1. **Primary browsers** (full E2E suite runs):
   - Chrome 124+ (desktop)
   - Firefox 125+ (desktop)
   - Safari 17+ (via Playwright WebKit)
   - Edge 124+ (via Playwright Chromium channel)

2. **Mobile browsers** (critical path E2E subset runs):
   - Mobile Chrome on Android (Pixel 5 emulation)
   - Mobile Safari on iOS (iPhone 13 emulation)

3. **Cross-browser specific assertions**:
   - CSS `@layer` support (Tailwind CSS 4 dependency) works in all browsers
   - CSS custom properties (`var(--color-*)`) render correctly
   - `next/font` loads without FOIT/FOUT across all browsers
   - Framer Motion animations play smoothly (no layout thrashing)
   - Cloudflare Turnstile widget renders and functions in all browsers
   - `dialog` element (if used for modals) has polyfill in Safari < 17.2 if needed
   - `IntersectionObserver` for lazy loading works (all target browsers support it)
   - CSS `clamp()` for fluid typography works in all browsers

4. **Browser-specific known issues** (documented, tested, mitigated):
   - Safari: `100vh` includes URL bar; use `100dvh` or JS fallback for full-height sections
   - Safari: `scroll-behavior: smooth` may need JS polyfill
   - Firefox: Form autofill styling differences
   - All: Cookie-less Plausible analytics works identically

5. **CI execution**:
   - Chrome and Firefox: run on every PR
   - Safari (WebKit) and Edge: run on merge to main
   - Mobile browsers: run nightly

---

## 13. CI Pipeline Integration

### FR-QA-035: PR Pipeline (Runs on Every Pull Request)

**Priority**: P0

**Acceptance Criteria**:

1. The following checks run on every PR and must all pass to allow merge:

| Check | Tool | Timeout | Blocking |
|---|---|---|---|
| TypeScript compilation | `tsc --noEmit` | 60s | Yes |
| ESLint | `next lint` | 60s | Yes |
| Unit tests | Vitest (unit + component) | 90s | Yes |
| Integration tests | Vitest (integration with MSW) | 90s | Yes |
| Bundle size check | bundlewatch | 60s | Yes |
| Docker build | `docker build` | 300s | Yes |
| E2E critical path (Chrome) | Playwright (SCENARIO-001-012) | 300s | Yes |
| Accessibility scan | axe-core via Playwright | 120s | Yes |
| Visual regression | Playwright screenshots | 180s | Warning only |

2. Total PR pipeline target: < 12 minutes.

3. Tests run in parallel where possible:
   - TypeScript + ESLint + Unit tests in parallel (Stage 1)
   - Docker build in parallel with Stage 1
   - E2E + Accessibility + Visual after Docker build completes (Stage 2)

4. Failed tests upload artifacts:
   - Playwright trace files (`.zip`)
   - Playwright screenshots and videos
   - Visual regression diff images
   - Lighthouse HTML reports

### FR-QA-036: Merge Pipeline (Runs on Merge to Main)

**Priority**: P0

**Acceptance Criteria**:

1. The following additional checks run on merge to `main`:

| Check | Tool | Timeout | Blocking Deploy |
|---|---|---|---|
| Full E2E suite (Chrome + Firefox + WebKit) | Playwright | 600s | Yes |
| Security tests | Playwright + API tests | 180s | Yes |
| Performance (Lighthouse CI) | @lhci/cli | 300s | Yes |
| SEO validation | Playwright + API tests | 120s | Yes |
| Cross-browser (Edge) | Playwright | 300s | Yes |
| Docker push to registry | DigitalOcean Container Registry | 120s | Yes |
| Deploy to staging namespace | kubectl apply | 120s | Yes |
| Staging smoke tests | Playwright against staging URL | 180s | Yes |

2. Total merge pipeline target: < 20 minutes.

3. After staging deploy succeeds and smoke tests pass, production deploy is triggered (manual approval gate or automatic based on team preference).

### FR-QA-037: Nightly Pipeline

**Priority**: P1

**Acceptance Criteria**:

1. The following checks run nightly at 02:00 UTC:

| Check | Tool | Purpose |
|---|---|---|
| Full E2E (all 6 browser configs) | Playwright | Cross-browser coverage |
| Mobile browser tests | Playwright (mobile-chrome, mobile-safari) | Mobile-specific regressions |
| Performance trend | Lighthouse CI (5 runs per page) | Detect gradual degradation |
| Security scan | OWASP ZAP baseline scan (optional) | Broader security coverage |
| Dependency audit | `npm audit` | Vulnerability detection |
| Link checker | Custom Playwright test | Detect broken internal/external links |
| Certificate expiry check | Custom script against production | SSL/TLS monitoring |
| Supabase health check | API test | Database availability |

2. Nightly results are reported to a Slack channel or email digest.

3. Any nightly failure creates a GitHub Issue automatically.

### FR-QA-038: Deploy Pipeline (Production Release)

**Priority**: P0

**Acceptance Criteria**:

1. Production deploy from the merge pipeline follows this sequence:
   - Docker image is pushed to DigitalOcean Container Registry (already done in merge pipeline)
   - `kubectl set image` updates the production deployment in DOKS
   - Kubernetes performs a rolling update (zero-downtime)
   - Post-deploy smoke tests run against production URL:
     - Homepage returns 200
     - All navigation links return 200
     - Demo form page loads
     - `/robots.txt` is accessible
     - `/sitemap.xml` is accessible
     - Security headers present
   - If smoke tests fail: automatic rollback via `kubectl rollout undo`

2. Canary deployment strategy (recommended for future):
   - Deploy to 10% of pods first
   - Run smoke tests against canary
   - If passing, promote to 100%
   - If failing, rollback canary

---

## 14. Test Data Management

### FR-QA-039: Test Fixtures

**Priority**: P0

**Acceptance Criteria**:

1. All test fixtures are in `tests/fixtures/` with the following structure:
   ```
   tests/fixtures/
     forms/
       demo-request.valid.json
       demo-request.max-lengths.json
       demo-request.xss-payloads.json
       demo-request.sql-injection.json
       demo-request.unicode.json
       contact.valid.json
       contact.xss-payloads.json
       newsletter.valid.json
       quote-request.valid.json
     seo/
       expected-meta-tags.json        # Per-page expected titles/descriptions
       expected-json-ld.json           # Per-page expected schema types
       sitemap-urls.json               # Expected URLs in sitemap
     security/
       xss-payloads.json               # OWASP XSS evasion patterns
       sql-injection-payloads.json     # Common SQL injection vectors
       header-injection-payloads.json  # Email header injection patterns
     pricing/
       expected-tiers.json             # Source-of-truth pricing data
       volume-discounts.json           # Discount schedule
   ```

2. Fixtures are typed with TypeScript interfaces matching the Zod schemas.

3. Factory functions in `tests/factories/` generate randomized valid test data:
   - `createDemoRequest(overrides?)` -- generates a valid demo request with realistic fake data
   - `createContactSubmission(overrides?)` -- generates a valid contact form submission
   - `createNewsletterSubscriber(overrides?)` -- generates a valid email
   - `createQuoteRequest(overrides?)` -- generates a valid quote request with trip details
   - Overrides allow specific fields to be set (e.g., `createDemoRequest({ email: 'xss@test.com', firstName: '<script>alert(1)</script>' })`)

4. Factory functions use `@faker-js/faker` for realistic data generation.

### FR-QA-040: Supabase Test Environment

**Priority**: P0

**Acceptance Criteria**:

1. A dedicated Supabase project is used for testing, completely isolated from production and development:
   - Project name: `safetrekr-marketing-test`
   - Same schema as production (migrations applied via CI)
   - Seeded with baseline data before test runs
   - Cleaned after each test run (truncate tables)

2. Environment variables for the test Supabase project:
   - `TEST_SUPABASE_URL`
   - `TEST_SUPABASE_ANON_KEY`
   - `TEST_SUPABASE_SERVICE_ROLE_KEY`
   - Stored in GitHub Actions secrets

3. Test lifecycle:
   - `beforeAll`: Apply latest migrations, seed baseline data
   - `afterEach`: No cleanup (tests should be independent via unique data)
   - `afterAll`: Truncate all tables
   - For E2E tests: each test uses unique identifiers (e.g., unique email addresses) to avoid conflicts in parallel execution

4. For local development:
   - Supabase CLI (`supabase start`) runs a local Supabase instance
   - Tests default to the local instance when `TEST_SUPABASE_URL` is not set
   - Local Supabase uses the same migration files as production

5. **Critical**: The test Supabase project must have the same RLS policies as production. RLS bypass tests use the `service_role` key intentionally and document why.

---

## 15. Quality Gates

### FR-QA-041: Merge Blocking Gates

**Priority**: P0

**Acceptance Criteria**:

The following conditions MUST pass before a PR can be merged to `main`:

| Gate | Threshold | Tool | Rationale |
|---|---|---|---|
| TypeScript compilation | Zero errors | `tsc` | Type safety prevents runtime crashes |
| ESLint | Zero errors (warnings allowed) | `next lint` | Code quality baseline |
| Unit test pass rate | 100% | Vitest | No broken logic ships |
| Component test pass rate | 100% | Vitest | No broken UI ships |
| Integration test pass rate | 100% | Vitest | No broken data flows ship |
| Code coverage (lines) | >= 80% | Vitest/v8 | Minimum coverage floor |
| Code coverage (branches) | >= 80% | Vitest/v8 | Decision logic coverage |
| E2E critical path (Chrome) | 100% pass | Playwright | All 12 critical user flows work |
| Accessibility violations | 0 | axe-core | WCAG 2.2 AA compliance |
| Bundle size (initial JS) | < 150KB gzipped | bundlewatch | Performance budget |
| Docker build | Succeeds | Docker | Deployable artifact |

### FR-QA-042: Deploy Blocking Gates

**Priority**: P0

**Acceptance Criteria**:

The following conditions MUST pass before a merge to `main` triggers production deploy:

| Gate | Threshold | Tool | Rationale |
|---|---|---|---|
| All merge blocking gates | Pass | See above | Baseline quality |
| Full E2E (Chrome + Firefox + WebKit) | 100% pass | Playwright | Cross-browser verification |
| Security tests | 100% pass | Playwright + API | No known vulnerabilities ship |
| Lighthouse Performance | >= 95 (all pages) | @lhci/cli | CWV compliance |
| Lighthouse Accessibility | >= 95 (all pages) | @lhci/cli | Accessibility compliance |
| Lighthouse Best Practices | >= 95 (all pages) | @lhci/cli | Web platform best practices |
| Lighthouse SEO | >= 95 (all pages) | @lhci/cli | Search visibility |
| LCP | < 1.5s (all pages) | Lighthouse CI | Core Web Vitals |
| CLS | < 0.05 (all pages) | Lighthouse CI | Core Web Vitals |
| TBT | < 200ms (all pages) | Lighthouse CI | Core Web Vitals |
| SEO validation | Pass | Playwright + API | Sitemap, robots, meta, JSON-LD |
| Staging smoke tests | Pass | Playwright | Deployed artifact verified |
| CSP unsafe-inline check | Not present | API test | XSS defense |
| Supabase RLS check | anon key returns 0 rows | API test | Data protection |

### FR-QA-043: Quality Exceptions Process

**Priority**: P1

**Acceptance Criteria**:

1. If a quality gate must be bypassed for an emergency deployment:
   - A GitHub Issue is created documenting the exception, the gate bypassed, and the remediation plan
   - The issue is labeled `quality-exception` and `security-debt` (if security-related)
   - A follow-up PR to fix the underlying issue is created within 48 hours
   - The exception is tracked in a `QUALITY_EXCEPTIONS.md` file in the repository root

2. No quality gate exception is allowed for:
   - Supabase RLS (data exposure)
   - CSP unsafe-inline in production (XSS vulnerability)
   - Accessibility violations that affect form submission (blocks K-12 procurement)

---

## 16. Monitoring and Alerting

### FR-QA-044: Production Error Tracking

**Priority**: P0

**Acceptance Criteria**:

1. A client-side error tracking service is integrated (Sentry recommended, or DigitalOcean monitoring):
   - Captures unhandled JavaScript exceptions
   - Captures unhandled promise rejections
   - Captures React Error Boundary activations
   - Captures Server Action failures
   - Includes source maps for readable stack traces
   - Respects privacy: no PII in error payloads (no form field values, no email addresses)

2. Server-side error tracking:
   - Next.js API route errors are captured
   - Supabase connection failures are captured
   - SendGrid delivery failures are captured
   - Rate limiting trigger events are captured (for abuse monitoring)

3. Alert thresholds:
   - Any P0 error (form submission failure, Supabase connection error): alert within 5 minutes
   - Error rate > 1% of page views: alert within 15 minutes
   - New error type not seen before: alert immediately

4. Error tracking dashboard is reviewed daily during the first 30 days post-launch, weekly thereafter.

### FR-QA-045: Core Web Vitals Regression Monitoring

**Priority**: P1

**Acceptance Criteria**:

1. Real User Monitoring (RUM) for CWV is implemented via one of:
   - Vercel Web Analytics (if Vercel is used for analytics only, even with DOKS hosting)
   - Google CrUX API monitoring
   - Custom `web-vitals` library reporting to Plausible or a custom endpoint

2. CWV regression alerts:
   - LCP > 2.0s (75th percentile over 24 hours): alert
   - CLS > 0.1 (75th percentile over 24 hours): alert
   - INP > 200ms (75th percentile over 24 hours): alert

3. Weekly CWV report generated and stored for trend analysis.

4. Any CWV regression triggers a Lighthouse CI run against production to confirm and diagnose.

### FR-QA-046: Uptime and Availability Monitoring

**Priority**: P0

**Acceptance Criteria**:

1. An uptime monitoring service checks the following endpoints every 60 seconds:
   - `https://safetrekr.com/` -- homepage (HTTP 200)
   - `https://safetrekr.com/api/health` -- health check endpoint (HTTP 200, JSON response with DB connectivity status)
   - `https://safetrekr.com/robots.txt` -- SEO critical (HTTP 200)

2. Alert channels:
   - Downtime > 1 minute: Slack notification
   - Downtime > 5 minutes: Email + SMS
   - Downtime > 15 minutes: PagerDuty (or equivalent) escalation

3. Target: 99.9% uptime (< 8.77 hours downtime per year).

4. SSL certificate expiry alert: 30 days, 14 days, and 7 days before expiry.

### FR-QA-047: Form Submission Monitoring

**Priority**: P0

**Acceptance Criteria**:

1. A daily automated check verifies form submission pipeline health:
   - Submit a synthetic demo request using a test email (`monitor@safetrekr.com`)
   - Verify Supabase record created
   - Verify SendGrid email dispatched
   - Clean up the synthetic record after verification

2. Alert if:
   - Zero form submissions in a 24-hour period on a weekday (possible pipeline failure)
   - Honeypot trigger rate exceeds 50% of total submissions (bot attack)
   - Turnstile rejection rate exceeds 20% (possible misconfiguration or Cloudflare issue)
   - SendGrid delivery rate drops below 95%

3. Dashboard metrics tracked:
   - Form submissions per day (by form type)
   - Conversion rate (form views to submissions)
   - Honeypot trigger count
   - Turnstile rejection count
   - SendGrid delivery/bounce/spam rates

---

## 17. Scenario-to-Test Mapping

This section maps every scenario from `analysis/scenarios.md` to its implementing test specification, test type, CI pipeline stage, and the functional requirement in this PRD that governs it.

### Critical Path Scenarios

| Scenario | Description | Test File | Type | Pipeline | FR |
|---|---|---|---|---|---|
| SCENARIO-001 | Homepage renders above-the-fold | `critical-path/homepage.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-002 | Primary navigation routes | `critical-path/navigation.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-003 | Demo request form E2E | `critical-path/demo-request.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-004 | Contact form E2E | `critical-path/contact-form.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-005 | Sample binder download | `critical-path/sample-binder.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-006 | Pricing page values | `critical-path/pricing.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-007 | Solution pages routing | `critical-path/solutions.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-008 | Blog ISR rendering | `critical-path/blog.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-009 | Mobile responsive layout | `critical-path/responsive.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-010 | SEO crawlability | `critical-path/seo-crawl.spec.ts` | E2E + API | PR | FR-QA-014 |
| SCENARIO-011 | Newsletter signup | `critical-path/newsletter.spec.ts` | E2E | PR | FR-QA-014 |
| SCENARIO-012 | Quote request form | `critical-path/quote-request.spec.ts` | E2E | PR | FR-QA-014 |

### Edge Case Scenarios

| Scenario | Description | Test File | Type | Pipeline | FR |
|---|---|---|---|---|---|
| SCENARIO-013 | Max field lengths | `edge-cases/max-lengths.spec.ts` | E2E + API | Merge | FR-QA-015 |
| SCENARIO-014 | Double-click prevention | `edge-cases/double-click.spec.ts` | E2E | Merge | FR-QA-015 |
| SCENARIO-015 | Browser back/forward | `edge-cases/browser-nav.spec.ts` | E2E | Merge | FR-QA-015 |
| SCENARIO-016 | MapLibre slow connection | `edge-cases/maplibre-slow.spec.ts` | E2E | Nightly | FR-QA-015 |
| SCENARIO-017 | JavaScript disabled | `edge-cases/no-javascript.spec.ts` | E2E | Nightly | FR-QA-015 |
| SCENARIO-018 | Unicode/emoji input | `edge-cases/unicode.spec.ts` | E2E + API | Merge | FR-QA-015 |
| SCENARIO-019 | ISR revalidation | `edge-cases/isr-revalidation.spec.ts` | API | Nightly | FR-QA-015 |

### Security Scenarios

| Scenario | Description | Test File | Type | Pipeline | FR |
|---|---|---|---|---|---|
| SCENARIO-020 | XSS via form fields | `security/xss-forms.spec.ts` | E2E + API | Merge | FR-QA-024 |
| SCENARIO-021 | CSRF protection | `security/csrf.spec.ts` | API | Merge | FR-QA-025 |
| SCENARIO-022 | Rate limiting | `security/rate-limiting.spec.ts` | API | Merge | FR-QA-026 |
| SCENARIO-023 | Turnstile bypass attempts | `security/turnstile-bypass.spec.ts` | API | Merge | FR-QA-027 |
| SCENARIO-024 | CSP enforcement | `security/csp.spec.ts` | API + E2E | Merge | FR-QA-024 |
| SCENARIO-025 | SQL injection | `security/sql-injection.spec.ts` | API | Merge | FR-QA-028 |
| SCENARIO-026 | Honeypot detection | `security/honeypot.spec.ts` | E2E + API | Merge | FR-QA-027 |
| SCENARIO-027 | Email header injection | `security/email-injection.spec.ts` | API | Merge | FR-QA-013 |
| SCENARIO-028 | Security headers | `security/headers.spec.ts` | API | Merge | FR-QA-029 |

### Performance Scenarios

| Scenario | Description | Test File | Type | Pipeline | FR |
|---|---|---|---|---|---|
| SCENARIO-029 | Lighthouse >= 95 | `lighthouserc.js` | Lighthouse CI | Merge | FR-QA-020 |
| SCENARIO-030 | LCP < 1.5s homepage | `performance/lcp.spec.ts` + Lighthouse | E2E + LHCI | Merge | FR-QA-020 |
| SCENARIO-031 | MapLibre lazy loading | `performance/maplibre-lazy.spec.ts` | E2E | Merge | FR-QA-021 |
| SCENARIO-032 | Image optimization | `performance/images.spec.ts` | E2E | Merge | FR-QA-022 |
| SCENARIO-033 | Bundle size budget | `bundlewatch.config.js` | bundlewatch | PR | FR-QA-021 |
| SCENARIO-034 | Reduced motion | `performance/reduced-motion.spec.ts` | E2E | Nightly | FR-QA-023 |

### Accessibility Scenarios

| Scenario | Description | Test File | Type | Pipeline | FR |
|---|---|---|---|---|---|
| SCENARIO-035 | Full keyboard navigation | `accessibility/keyboard-nav.spec.ts` | E2E | PR | FR-QA-017 |
| SCENARIO-036 | Screen reader compat | `accessibility/screen-reader.spec.ts` + manual | E2E + Manual | PR (auto) + Quarterly (manual) | FR-QA-018 |
| SCENARIO-037 | Color contrast | `accessibility/contrast.spec.ts` + unit | E2E + Unit | PR | FR-QA-019 |
| SCENARIO-038 | Focus management | `accessibility/focus-management.spec.ts` | E2E | PR | FR-QA-017 |
| SCENARIO-039 | Skip navigation | `accessibility/skip-nav.spec.ts` | E2E | PR | FR-QA-017 |
| SCENARIO-040 | ARIA landmarks/headings | `accessibility/landmarks.spec.ts` | E2E | PR | FR-QA-016 |

### Integration Scenarios

| Scenario | Description | Test File | Type | Pipeline | FR |
|---|---|---|---|---|---|
| SCENARIO-041 | Supabase form storage | `integration/supabase-forms.spec.ts` | E2E + API | Merge | FR-QA-012 |
| SCENARIO-042 | SendGrid delivery | `integration/sendgrid.spec.ts` | API | Merge | FR-QA-013 |
| SCENARIO-043 | Plausible event tracking | `integration/plausible.spec.ts` | E2E | Merge | FR-QA-014 |
| SCENARIO-044 | MapLibre tile loading | `integration/maplibre.spec.ts` | E2E | Merge | FR-QA-015 |
| SCENARIO-045 | OG image generation | `integration/og-image.spec.ts` | API | Nightly | FR-QA-032 |
| SCENARIO-046 | Supabase RLS | `integration/supabase-rls.spec.ts` | API | Merge | FR-QA-012 |

### Error Handling Scenarios

| Scenario | Description | Test File | Type | Pipeline | FR |
|---|---|---|---|---|---|
| SCENARIO-047 | Network failure form submit | `error-handling/network-failure.spec.ts` | E2E | Merge | FR-QA-015 |
| SCENARIO-048 | Supabase timeout | `error-handling/supabase-timeout.spec.ts` | E2E + API | Merge | FR-QA-011 |
| SCENARIO-049 | SendGrid failure | `error-handling/sendgrid-failure.spec.ts` | API | Merge | FR-QA-013 |
| SCENARIO-050 | 404 page | `error-handling/404.spec.ts` | E2E | Merge | FR-QA-014 |
| SCENARIO-051 | 500 error page | `error-handling/500.spec.ts` | E2E | Nightly | FR-QA-014 |
| SCENARIO-052 | Turnstile widget failure | `error-handling/turnstile-failure.spec.ts` | E2E | Merge | FR-QA-015 |

### Data Integrity Scenarios

| Scenario | Description | Test File | Type | Pipeline | FR |
|---|---|---|---|---|---|
| SCENARIO-053 | UTM parameter tracking | `data-integrity/utm-tracking.spec.ts` | E2E + API | Merge | FR-QA-014 |
| SCENARIO-054 | IP address hashing | `data-integrity/ip-hashing.spec.ts` | API + Unit | Merge | FR-QA-005 |
| SCENARIO-055 | JSONB XSS payloads | `data-integrity/jsonb-xss.spec.ts` | API | Merge | FR-QA-024 |
| SCENARIO-056 | Concurrent submissions | `data-integrity/concurrent.spec.ts` | API | Nightly | FR-QA-012 |
| SCENARIO-057 | JSON-LD validation | `data-integrity/json-ld.spec.ts` | E2E | Merge | FR-QA-032 |

---

## Appendix A: Critical Flags from Scenario Analysis

These issues were identified during scenario generation and require resolution before production launch:

1. **CSP `unsafe-inline` and `unsafe-eval`** (SCENARIO-024, FR-QA-024):
   The current `next.config.ts` CSP includes `'unsafe-inline'` and `'unsafe-eval'` in `script-src`. These significantly weaken XSS protection. Must be replaced with nonce-based CSP for production. The deploy gate in FR-QA-042 enforces this.

2. **Turnstile Firewall Blocking** (SCENARIO-052, FR-QA-015):
   K-12 school districts commonly use restrictive firewalls that may block `challenges.cloudflare.com`. A fallback mechanism is critical for the primary target segment. Recommend: honeypot + rate limiting as secondary protection when Turnstile is unavailable, with a clear message to the user.

3. **Muted Foreground Contrast** (SCENARIO-037, FR-QA-019):
   The original `#616567` muted-foreground color failed WCAG AA (4.0:1). It was darkened to `#555a5d` (~4.6:1) which barely passes. Recommend further darkening to `#4a4f52` (~5.0:1) for a comfortable margin. The contrast unit test in FR-QA-019 enforces the threshold.

4. **DOKS-Specific ISR Behavior** (SCENARIO-019):
   ISR on DigitalOcean DOKS does not use Vercel's CDN cache. The Next.js standalone output has its own filesystem-based ISR cache. Cache behavior must be validated against the Nginx reverse proxy configuration, not Vercel-specific headers like `X-Vercel-Cache`.

5. **Double Opt-In Email Flow** (SCENARIO-011):
   The newsletter double opt-in flow involves a confirmation token and email. This must be tested end-to-end including the confirmation link click. Consider using SendGrid's Inbound Parse or a test-specific confirmation endpoint for automated testing.

---

## Appendix B: Test Counts by Category

| Category | Unit | Component | Integration | E2E | API | Manual | Total |
|---|---|---|---|---|---|---|---|
| Utility functions | 70+ | - | - | - | - | - | 70+ |
| Zod schemas | 60+ | - | - | - | - | - | 60+ |
| Content validation | 30+ | - | - | - | - | - | 30+ |
| UI components | - | 50+ | - | - | - | - | 50+ |
| Form components | - | 30+ | - | - | - | - | 30+ |
| Navigation | - | 15+ | - | - | - | - | 15+ |
| Server Actions | - | - | 40+ | - | - | - | 40+ |
| Supabase | - | - | 20+ | - | 10+ | - | 30+ |
| SendGrid | - | - | 15+ | - | - | - | 15+ |
| Critical path E2E | - | - | - | 40+ | - | - | 40+ |
| Edge case E2E | - | - | - | 15+ | 5+ | - | 20+ |
| Security | - | - | - | 10+ | 20+ | - | 30+ |
| Accessibility | - | - | - | 20+ | - | 4 | 24+ |
| Performance | - | - | - | 8+ | - | - | 8+ |
| Visual regression | - | - | - | 36+ | - | - | 36+ |
| SEO | - | - | - | 15+ | 10+ | - | 25+ |
| **Total** | **160+** | **95+** | **75+** | **144+** | **45+** | **4** | **523+** |

---

## Appendix C: Dependencies and Versions

| Package | Purpose | Version Constraint |
|---|---|---|
| `vitest` | Unit + component + integration tests | ^3.x |
| `@testing-library/react` | Component rendering | ^16.x (React 19 compat) |
| `@testing-library/jest-dom` | DOM assertion matchers | ^6.x |
| `@testing-library/user-event` | User interaction simulation | ^14.x |
| `playwright` | E2E + visual regression + accessibility | ^1.49+ |
| `@axe-core/playwright` | Automated accessibility scanning | ^4.x |
| `@axe-core/react` | Component-level accessibility | ^4.x |
| `@lhci/cli` | Lighthouse CI performance gates | ^0.14+ |
| `bundlewatch` | Bundle size enforcement | ^0.4+ |
| `msw` | Mock Service Worker for API mocking | ^2.x |
| `@faker-js/faker` | Test data generation | ^9.x |

---

*Generated by Crash-to-Fix Oracle (CFO) v1.1 on 2026-03-24*
*Project: SafeTrekr Marketing Site*
*Input: ANALYSIS.md (8-agent synthesis) + scenarios.md (57 scenarios) + TECH-STACK.md*
