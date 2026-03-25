# Adversarial Testing Scenarios: SafeTrekr Marketing Site

**Generated**: 2026-03-24
**Agent**: Crash-to-Fix Oracle (CFO) v1.1
**Target**: SafeTrekr Marketing Site (Next.js 15 / React 19 / Vercel)
**Total Scenarios**: 57

---

## Critical Path Scenarios

### SCENARIO-001: Homepage renders complete above-the-fold content
- **Category**: Critical Path
- **Priority**: P0
- **Preconditions**: Application deployed to Vercel; DNS resolving to production domain
- **Steps**:
  1. Navigate to `https://safetrekr.com` in Chrome 124+
  2. Wait for DOMContentLoaded event
  3. Verify the hero section renders with headline, subheadline, and primary CTA
  4. Verify the trust metrics strip renders with all 5 metric badges (5 Government Intel Sources, 17 Safety Review Sections, 3-5 Day Turnaround, AES-256 Encryption, SHA-256 Evidence Chain)
  5. Verify the sticky navigation header is present with logo and 5 primary nav items
  6. Verify the page title and meta description are populated via `generateMetadata`
  7. Verify JSON-LD structured data (Organization schema) is present in the document head
- **Expected Result**: Full above-the-fold content renders within 1.5s LCP budget; no layout shifts (CLS < 0.1); all visual elements present; no console errors
- **Failure Impact**: Zero first impressions for prospects; 100% bounce rate; complete revenue loss on the primary conversion page
- **Automation**: Playwright

### SCENARIO-002: Primary navigation routes to all top-level pages
- **Category**: Critical Path
- **Priority**: P0
- **Preconditions**: All marketing pages are built and deployed; SSG build completes without errors
- **Steps**:
  1. Load homepage
  2. Click each primary navigation link in sequence: Platform, Solutions, How It Works, Pricing, About
  3. For each page, verify the URL updates correctly
  4. Verify the page heading and content render (not a 404 or error boundary)
  5. Verify the active nav item is visually indicated
  6. Click the logo to return to homepage between each navigation
  7. Verify browser back button returns to the previous page
- **Expected Result**: All navigation links produce correct client-side transitions; each page renders its expected content; no full-page reloads for internal links; back/forward browser navigation works
- **Failure Impact**: Users cannot discover product information; all conversion paths broken beyond the homepage
- **Automation**: Playwright

### SCENARIO-003: Demo request form submits successfully end-to-end
- **Category**: Critical Path
- **Priority**: P0
- **Preconditions**: Supabase marketing DB running; SendGrid API key configured; Turnstile site key and secret key configured; `/demo` page deployed
- **Steps**:
  1. Navigate to `/demo`
  2. Fill in required fields: email (`test@example.com`), first name, last name, organization, segment (K-12)
  3. Fill in optional fields: phone, job title, trips per year (10), group size (25), timeline (1_month)
  4. Wait for Turnstile widget to generate a token (invisible mode)
  5. Leave honeypot field empty (verify it is hidden via CSS/aria-hidden)
  6. Click Submit
  7. Verify loading/submitting state appears on the button
  8. Verify success message displays: "Demo request received. We will contact you within 1 business day."
  9. Query Supabase `form_submissions` table for the new record
  10. Verify SendGrid notification email was dispatched (check SendGrid activity feed or use webhook)
  11. Verify a `crm_sync_queue` entry was created by the database trigger
- **Expected Result**: Form submission creates a database record with all fields populated; notification email sent; success state shown to user; no console errors; Plausible conversion event fires
- **Failure Impact**: Primary lead generation mechanism is broken; zero demo requests captured; direct revenue impact ($315K-$660K Year 1 at risk)
- **Automation**: Playwright + API Test

### SCENARIO-004: Contact form submits successfully end-to-end
- **Category**: Critical Path
- **Priority**: P0
- **Preconditions**: Same as SCENARIO-003; `/contact` page deployed
- **Steps**:
  1. Navigate to `/contact`
  2. Fill in required fields: email, first name, last name, subject (min 1 char), message (min 10 chars)
  3. Wait for Turnstile token
  4. Submit the form
  5. Verify success message appears
  6. Verify Supabase `form_submissions` record with `form_type = 'contact'`
  7. Verify SendGrid notification email sent
- **Expected Result**: Contact form creates database record; sends email notification; shows success state
- **Failure Impact**: Secondary conversion path broken; prospects with questions cannot reach the team
- **Automation**: Playwright + API Test

### SCENARIO-005: Sample binder download flow completes with lead capture
- **Category**: Critical Path
- **Priority**: P0
- **Preconditions**: Sample binder PDFs uploaded to `/public/documents/`; gated download form deployed at `/resources/sample-binders`
- **Steps**:
  1. Navigate to `/resources/sample-binders`
  2. Select a segment-specific binder (e.g., K-12)
  3. Fill in the lead capture form: email, first name, segment
  4. Wait for Turnstile token
  5. Submit form
  6. Verify success state and download link/trigger appears
  7. Click download link and verify the PDF downloads successfully
  8. Verify Supabase record with `form_type = 'sample_binder_download'`
  9. Verify the binder_type is recorded in the JSONB `details` column
- **Expected Result**: Lead captured before download; PDF downloads without corruption; all 3 segment-specific binders work; Plausible event fires
- **Failure Impact**: Highest-converting lead magnet (8-15% conversion rate) broken; major impact on pipeline generation
- **Automation**: Playwright

### SCENARIO-006: Pricing page renders with correct per-student values
- **Category**: Critical Path
- **Priority**: P0
- **Preconditions**: Pricing data defined in `src/content/pages/pricing.ts`; `/pricing` page deployed
- **Steps**:
  1. Navigate to `/pricing`
  2. Verify pricing cards render with the "$15/student" per-traveler framing (not "$450/trip")
  3. Verify all pricing tiers display with correct values, features, and CTAs
  4. Verify the FAQ section renders with FAQ schema markup
  5. Verify the ROI calculator component loads (client component)
  6. Verify CTA buttons on pricing cards link to `/demo` or `/contact`
  7. Check for JSON-LD Product schema in document head
- **Expected Result**: Per-student pricing is prominently displayed; all tiers render correctly; FAQ schema present; CTAs functional
- **Failure Impact**: Pricing miscommunication leads to lost deals; incorrect values create legal liability
- **Automation**: Playwright

### SCENARIO-007: Solution pages route correctly per segment
- **Category**: Critical Path
- **Priority**: P0
- **Preconditions**: All solution pages deployed: `/solutions/k12`, `/solutions/churches`, `/solutions/higher-education`, `/solutions/corporate`
- **Steps**:
  1. Navigate to `/solutions` overview page
  2. Verify segment selector/cards are visible
  3. Click through to each segment page: K-12, Churches, Higher Ed, Corporate
  4. For each page verify:
     a. Segment-specific headline and content renders
     b. Segment-specific pain points and benefits are shown
     c. Unique meta title and description per segment (view source or Playwright `page.title()`)
     d. JSON-LD structured data includes segment information
     e. CTA buttons link to `/demo` with segment pre-selected (query param or state)
  5. Verify `/solutions/churches` is the most prominently featured (beachhead segment)
- **Expected Result**: Each segment page has unique content, metadata, and structured data; CTAs pass segment context to the demo form
- **Failure Impact**: Segment-specific messaging lost; prospects see generic content instead of tailored value propositions; reduced conversion rates per vertical
- **Automation**: Playwright

### SCENARIO-008: Blog posts render with ISR and correct metadata
- **Category**: Critical Path
- **Priority**: P0
- **Preconditions**: At least 1 MDX blog post exists in `src/content/blog/`; ISR configured with 86400s revalidation for `[slug]` and 3600s for index
- **Steps**:
  1. Navigate to `/blog`
  2. Verify blog index page renders with post cards
  3. Click the first blog post
  4. Verify blog post renders with title, date, author, body content, and table of contents
  5. Verify MDX components render correctly (code blocks, callouts, images)
  6. Verify `Cache-Control` header includes `s-maxage=86400` for the post
  7. Verify blog index has `s-maxage=3600`
  8. Verify Article schema JSON-LD in document head
  9. Verify breadcrumb navigation (visual + BreadcrumbList schema)
  10. Verify social sharing meta tags (og:title, og:description, og:image)
- **Expected Result**: Blog posts render from MDX with correct styling; ISR headers present; structured data complete; OG image generated
- **Failure Impact**: Content marketing foundation broken; SEO investment wasted; AI citation opportunity missed
- **Automation**: Playwright + API Test (cache headers)

### SCENARIO-009: Mobile responsive layout works across breakpoints
- **Category**: Critical Path
- **Priority**: P0
- **Preconditions**: Application deployed; responsive design implemented per UI design system
- **Steps**:
  1. Test at 5 viewport widths: 375px (iPhone SE), 390px (iPhone 14), 768px (iPad), 1024px (iPad Pro landscape), 1280px (desktop)
  2. For each viewport on the homepage:
     a. Verify no horizontal scrollbar appears
     b. Verify all text is readable (no truncation or overflow)
     c. Verify images scale correctly (no distortion)
     d. Verify touch targets are minimum 44x44px
     e. Verify hamburger menu appears at mobile breakpoints (< 1024px)
  3. Open and close the mobile navigation drawer
  4. Submit the demo form at 375px viewport width
  5. Verify the sticky header does not obscure content
  6. Verify MapLibre map component either lazy-loads or shows static fallback at mobile
- **Expected Result**: All pages are fully functional and readable at every breakpoint; mobile nav works; forms are usable on small screens
- **Failure Impact**: 50%+ of traffic is mobile; broken mobile experience means losing half of potential leads
- **Automation**: Playwright (multi-viewport)

### SCENARIO-010: Search engines can crawl and index all pages
- **Category**: Critical Path
- **Priority**: P0
- **Preconditions**: Application deployed to production domain; `robots.ts` and `sitemap.ts` implemented
- **Steps**:
  1. Fetch `https://safetrekr.com/robots.txt` and verify:
     a. `User-agent: *` allows all paths except `/api/` and `/_next/`
     b. AI crawler user-agents (GPTBot, PerplexityBot, ClaudeBot) are explicitly allowed
     c. Sitemap URL is declared
  2. Fetch `https://safetrekr.com/sitemap.xml` and verify:
     a. All core pages are listed (homepage, solutions, pricing, how-it-works, about, contact, demo)
     b. Blog posts are listed with correct `lastmod` dates
     c. Landing pages (`/lp/*`) are NOT listed (noindex, nofollow)
     d. Legal pages are listed
  3. For each page in the sitemap, verify:
     a. HTTP 200 response
     b. `<title>` tag is unique and non-empty
     c. `<meta name="description">` is unique and non-empty
     d. Canonical URL is set correctly
     e. No `noindex` meta tag (except landing pages)
  4. Verify `X-Robots-Tag` header is not set to `noindex` on any marketing page
- **Expected Result**: All public marketing pages are crawlable; sitemap is complete; metadata is unique per page; AI crawlers have explicit access
- **Failure Impact**: Zero organic search visibility; no AI citations; complete failure of SEO investment; estimated $180K-$420K Year 1 organic revenue at risk
- **Automation**: API Test + Playwright

### SCENARIO-011: Newsletter signup form works from footer
- **Category**: Critical Path
- **Priority**: P0
- **Preconditions**: Newsletter form deployed in footer; Supabase `newsletter_subscribers` table exists; double opt-in configured
- **Steps**:
  1. Navigate to any page (newsletter form is in the global footer)
  2. Scroll to footer
  3. Enter a valid email address in the newsletter input
  4. Submit the form
  5. Verify success message: "Please check your email to confirm your subscription."
  6. Verify Supabase `newsletter_subscribers` record created with `confirmed = false`
  7. Verify a `confirmation_token` was generated
  8. Verify SendGrid dispatched a confirmation email
  9. Simulate clicking the confirmation link
  10. Verify `confirmed = true` and `confirmed_at` timestamp set
- **Expected Result**: Double opt-in flow works end-to-end; subscriber captured with pending confirmation; email sent
- **Failure Impact**: Email marketing list cannot grow; nurture sequences cannot run; long-term pipeline generation damaged
- **Automation**: Playwright + API Test

### SCENARIO-012: Quote request form submits with trip-specific details
- **Category**: Critical Path
- **Priority**: P1
- **Preconditions**: Quote request form deployed; Supabase and SendGrid configured
- **Steps**:
  1. Navigate to the quote request form (accessible from pricing page CTA)
  2. Fill in all required fields: email, first name, last name, organization, segment, trip type (international), group size (50)
  3. Fill in optional fields: destination ("Costa Rica"), departure date, number of trips (3), special requirements
  4. Submit the form
  5. Verify success message
  6. Verify Supabase record with correct `form_type = 'quote_request'` and JSONB details containing trip-specific information
- **Expected Result**: Quote request captured with all trip details stored in JSONB; notification sent
- **Failure Impact**: Unable to generate qualified quotes; sales team lacks trip context for follow-up
- **Automation**: Playwright + API Test

---

## Edge Case Scenarios

### SCENARIO-013: Form submission with maximum field lengths
- **Category**: Edge Case
- **Priority**: P1
- **Preconditions**: Demo request form deployed with Zod validation
- **Steps**:
  1. Navigate to `/demo`
  2. Fill email with 254 characters (max valid email per RFC 5321)
  3. Fill firstName with exactly 100 characters
  4. Fill lastName with exactly 100 characters
  5. Fill organization with exactly 200 characters
  6. Fill jobTitle with exactly 100 characters
  7. Fill message with exactly 2000 characters
  8. Set tripsPerYear to 500 (max)
  9. Set groupSize to 1000 (max)
  10. Submit the form
  11. Verify the form submits successfully without truncation
  12. Query Supabase and verify all fields are stored at full length
- **Expected Result**: Maximum-length inputs are accepted and stored completely; no truncation in database; no server error
- **Failure Impact**: Data loss for organizations with long names; truncated messages lose important context
- **Automation**: Playwright + API Test

### SCENARIO-014: Rapid form resubmission (double-click prevention)
- **Category**: Edge Case
- **Priority**: P1
- **Preconditions**: Demo request form deployed with submit button state management
- **Steps**:
  1. Navigate to `/demo` and fill in all required fields
  2. Double-click the submit button rapidly (< 100ms between clicks)
  3. Verify the submit button becomes disabled after the first click
  4. Verify a loading/spinner state appears
  5. Wait for the submission to complete
  6. Query Supabase and verify only ONE record was created (not two)
  7. Repeat with the contact form and newsletter form
- **Expected Result**: Only one submission is recorded per user action; button disables immediately on first click; loading state prevents re-clicks
- **Failure Impact**: Duplicate database records; duplicate notification emails; degraded user experience; inflated lead counts
- **Automation**: Playwright

### SCENARIO-015: Browser back/forward through form submission flow
- **Category**: Edge Case
- **Priority**: P1
- **Preconditions**: Demo request form deployed
- **Steps**:
  1. Navigate to `/pricing`
  2. Click the "Request Demo" CTA to navigate to `/demo`
  3. Fill in the form partially (email, first name)
  4. Click browser Back button to return to `/pricing`
  5. Click browser Forward button to return to `/demo`
  6. Verify whether form data is preserved or the form is blank
  7. Complete and submit the form
  8. Verify success state is shown
  9. Click browser Back button
  10. Verify behavior: user should NOT see a "Confirm Form Resubmission" dialog (since Server Actions use POST via fetch, not traditional form POST)
  11. Click Forward button
  12. Verify the success state or the form (not an error)
- **Expected Result**: Navigation does not trigger re-submission dialogs; form state is handled gracefully; no duplicate submissions
- **Failure Impact**: Confusing UX for users who use browser navigation; potential duplicate submissions
- **Automation**: Playwright

### SCENARIO-016: MapLibre component behavior on slow connections
- **Category**: Edge Case
- **Priority**: P2
- **Preconditions**: Hero map component deployed with lazy loading and static fallback
- **Steps**:
  1. Open Chrome DevTools and throttle network to "Slow 3G" (500ms latency, 500kbps download)
  2. Navigate to homepage
  3. Verify the static map fallback image (`map-fallback.tsx`) renders immediately
  4. Verify the hero headline and CTA are visible without waiting for the map
  5. Observe MapLibre GL JS chunk loading in the Network tab
  6. Verify the map eventually loads and replaces the static fallback without layout shift
  7. Verify no JavaScript errors in console during the transition
  8. Verify the page remains interactive (CTA buttons clickable) while the map loads
  9. Test at "Offline" -- verify the static fallback remains visible and the page is usable
- **Expected Result**: Static fallback renders instantly; map loads progressively; no layout shift during transition; page is fully functional without the map
- **Failure Impact**: 300KB MapLibre bundle blocks rendering on slow connections; mobile users in low-bandwidth areas (school networks, rural churches) see a broken page
- **Automation**: Playwright (network throttling)

### SCENARIO-017: JavaScript disabled fallback behavior
- **Category**: Edge Case
- **Priority**: P2
- **Preconditions**: SSG pages deployed; progressive enhancement implemented
- **Steps**:
  1. Disable JavaScript in Chrome DevTools (or use `javaScriptEnabled: false` in Playwright)
  2. Navigate to homepage
  3. Verify the page renders with full text content (server-rendered HTML)
  4. Verify images render correctly
  5. Verify navigation links work (standard `<a>` tags)
  6. Navigate to `/pricing` -- verify content renders
  7. Navigate to `/demo` -- verify the form is visible (even if non-functional)
  8. Verify a `<noscript>` message appears on form pages explaining JavaScript is required
  9. Verify Framer Motion animations are absent (no broken animation states)
  10. Verify the skip navigation link is still present and functional
- **Expected Result**: All SSG content is readable without JavaScript; navigation works via standard links; forms show a clear noscript fallback; no broken visual states
- **Failure Impact**: Users with restrictive corporate security policies (common in K-12 school districts) see broken pages
- **Automation**: Playwright

### SCENARIO-018: Form submission with emoji and Unicode characters
- **Category**: Edge Case
- **Priority**: P2
- **Preconditions**: Form deployed with Zod validation and input sanitization
- **Steps**:
  1. Navigate to `/contact`
  2. Enter first name: "Jose" (with accented e)
  3. Enter last name: "Garcia-Lopez" (with hyphen)
  4. Enter organization: "Eglise de la Sainte-Trinite" (accented characters)
  5. Enter message with CJK characters, Arabic text, and emoji
  6. Submit the form
  7. Verify the form accepts the input without error
  8. Query Supabase and verify UTF-8 characters are stored correctly without mojibake
  9. Verify the SendGrid notification email renders the characters correctly
- **Expected Result**: Full Unicode support throughout the pipeline; no sanitization removes valid international characters; database stores UTF-8 correctly
- **Failure Impact**: International organizations and non-English speakers cannot submit forms; discriminatory UX
- **Automation**: Playwright + API Test

### SCENARIO-019: Stale ISR content revalidation
- **Category**: Edge Case
- **Priority**: P2
- **Preconditions**: Blog post published with ISR (86400s revalidation); post has been cached by Vercel CDN
- **Steps**:
  1. Access a blog post and note the current content
  2. Modify the MDX source file for that post
  3. Trigger a revalidation (either wait for TTL or call `revalidatePath()` / `revalidateTag()`)
  4. Access the blog post again
  5. On the first request after revalidation window: verify stale content is served (stale-while-revalidate behavior)
  6. On a subsequent request: verify updated content appears
  7. Verify `X-Vercel-Cache` header transitions from `HIT` to `STALE` to `HIT` (with new content)
- **Expected Result**: ISR serves stale content instantly while revalidating in the background; updated content appears on the next request after revalidation
- **Failure Impact**: Blog content never updates after initial deployment; outdated information persists
- **Automation**: API Test

---

## Security Scenarios

### SCENARIO-020: XSS via form input fields (reflected and stored)
- **Category**: Security
- **Priority**: P0
- **Preconditions**: All forms deployed with sanitization via `sanitize.ts`
- **Steps**:
  1. Navigate to `/contact`
  2. Enter the following XSS payloads in each text field:
     a. firstName: `<script>alert('XSS')</script>`
     b. lastName: `<img src=x onerror=alert('XSS')>`
     c. organization: `"><svg onload=alert(document.cookie)>`
     d. subject: `javascript:alert('XSS')`
     e. message: `<iframe src="https://evil.com"></iframe>`
  3. Submit the form
  4. Verify the success page does NOT execute any scripts
  5. Query Supabase and verify stored values are sanitized (HTML entities escaped)
  6. Check if any admin dashboard that renders these values also escapes them
  7. Test the same payloads on demo request, newsletter, and quote forms
  8. Verify CSP header blocks inline script execution (`script-src` does not include `'unsafe-inline'` -- note: current config DOES include `'unsafe-inline'`, this should be flagged)
- **Expected Result**: All XSS payloads are either rejected by validation or stored as escaped text; no script execution occurs on any page; CSP provides defense-in-depth
- **Failure Impact**: CRITICAL -- attacker could steal session tokens, redirect users, deface the site, or inject malware; destroys trust for a security-focused product
- **Automation**: Playwright + API Test

### SCENARIO-021: CSRF protection on Server Actions
- **Category**: Security
- **Priority**: P0
- **Preconditions**: Server Actions deployed for all forms
- **Steps**:
  1. Create a malicious HTML page on a different domain that contains:
     ```html
     <form method="POST" action="https://safetrekr.com/api/demo-request">
       <input name="email" value="attacker@evil.com">
       <input name="firstName" value="CSRF">
       <button type="submit">Click me</button>
     </form>
     ```
  2. Open this page in a browser where the user has visited safetrekr.com
  3. Submit the form
  4. Verify the request is rejected (Next.js Server Actions include built-in CSRF protection via the `__next_action_id` mechanism)
  5. Attempt the same via a `fetch()` call from a different origin
  6. Verify CORS headers prevent the cross-origin request
  7. Verify the API routes also validate the `Origin` header
- **Expected Result**: Cross-origin form submissions are rejected; Server Actions' built-in CSRF protection works; CORS headers block unauthorized origins
- **Failure Impact**: Attackers could submit forms on behalf of users; spam the database; trigger unwanted email notifications
- **Automation**: API Test

### SCENARIO-022: Rate limiting on form submissions
- **Category**: Security
- **Priority**: P0
- **Preconditions**: Rate limiting configured in middleware or API routes
- **Steps**:
  1. Submit the demo request form successfully once
  2. Immediately submit 10 more requests in rapid succession (< 1 second total)
  3. Verify that after N submissions (expected: 3-5 per minute per IP), the server returns HTTP 429
  4. Verify the response includes: `{ success: false, message: "Too many requests. Please try again later.", retryAfter: <seconds> }`
  5. Verify the `Retry-After` header is present
  6. Wait for the rate limit window to expire
  7. Verify the next submission succeeds
  8. Test rate limiting per-IP across different form types (should share a rate limit)
  9. Verify rate limiting also applies to the `/api/analytics/event` endpoint
- **Expected Result**: Rate limiting prevents abuse; clear error message returned; rate limit resets after the window expires; per-IP enforcement
- **Failure Impact**: Form spam overwhelms Supabase and SendGrid; costs increase; legitimate leads buried in spam; SendGrid account suspended
- **Automation**: API Test

### SCENARIO-023: Bot detection via Cloudflare Turnstile bypass attempts
- **Category**: Security
- **Priority**: P0
- **Preconditions**: Turnstile widget deployed on all forms; server-side verification via `verifyTurnstile()`
- **Steps**:
  1. Submit the demo request form via direct API call WITHOUT a Turnstile token
  2. Verify HTTP 403 response: `{ success: false, message: "Verification failed." }`
  3. Submit with an expired Turnstile token (captured from a previous session)
  4. Verify rejection
  5. Submit with a fabricated/random Turnstile token string
  6. Verify rejection
  7. Submit with the token from a different site key
  8. Verify rejection
  9. Submit with the correct token but after it has already been used (replay attack)
  10. Verify rejection
  11. Verify all rejections are logged for security audit
- **Expected Result**: All invalid, expired, fabricated, and replayed Turnstile tokens are rejected; only fresh, valid tokens from the correct site key are accepted
- **Failure Impact**: Bots bypass protection and flood forms with spam; database polluted; SendGrid quota exhausted
- **Automation**: API Test

### SCENARIO-024: Content Security Policy header enforcement
- **Category**: Security
- **Priority**: P0
- **Preconditions**: CSP headers configured in `next.config.ts` and/or middleware
- **Steps**:
  1. Fetch any page and extract the `Content-Security-Policy` header
  2. Verify the following directives are present:
     a. `default-src 'self'`
     b. `script-src` includes `'self'`, `https://challenges.cloudflare.com`, `https://plausible.io`
     c. `img-src` includes `'self'`, `data:`, `blob:`, `https://api.maptiler.com`
     d. `font-src 'self'`
     e. `connect-src` includes `'self'`, `https://plausible.io`, `https://api.maptiler.com`, `https://*.supabase.co`
     f. `frame-src` allows only `https://challenges.cloudflare.com` (for Turnstile)
  3. Attempt to inject an inline script via browser console and verify CSP blocks it
  4. **FLAG**: Current config includes `'unsafe-inline'` and `'unsafe-eval'` in `script-src` -- these SHOULD be removed and replaced with nonces or hashes for production
  5. Verify no external resources are loaded that are not whitelisted in CSP
  6. Verify the CSP does not include `report-uri` or `report-to` (privacy consideration) unless intentional
- **Expected Result**: CSP headers are present on all pages; unauthorized scripts/frames/connections are blocked; Turnstile and Plausible whitelisted correctly
- **Failure Impact**: XSS attacks succeed; malicious resources loaded; user data exfiltrated; complete trust destruction for a security product
- **Automation**: API Test + Playwright

### SCENARIO-025: SQL injection via form fields targeting Supabase
- **Category**: Security
- **Priority**: P0
- **Preconditions**: Forms deployed; Supabase client uses parameterized queries
- **Steps**:
  1. Submit the contact form with the following payloads:
     a. email: `test@example.com'; DROP TABLE form_submissions;--`
     b. firstName: `' OR '1'='1`
     c. message: `Robert'); DELETE FROM newsletter_subscribers WHERE ('1'='1`
     d. organization: `1; SELECT * FROM pg_shadow;--`
  2. Verify the form either:
     a. Rejects the input via Zod validation (email format fails), OR
     b. Accepts it but stores it as literal text (parameterized query)
  3. Query Supabase and verify the `form_submissions` table is intact
  4. Verify the `newsletter_subscribers` table is intact
  5. Verify no database errors are exposed in the HTTP response
  6. Verify the Server Action uses the Supabase client's `.insert()` method (which uses parameterized queries) and NOT raw SQL string concatenation
- **Expected Result**: All SQL injection attempts are neutralized by parameterized queries and/or input validation; no data loss; no error leakage
- **Failure Impact**: CRITICAL -- database destruction; data exfiltration; complete system compromise; legal liability
- **Automation**: API Test

### SCENARIO-026: Honeypot field detection
- **Category**: Security
- **Priority**: P1
- **Preconditions**: Honeypot field implemented on all forms (hidden field that must be empty)
- **Steps**:
  1. Inspect the demo request form HTML and identify the honeypot field
  2. Verify the honeypot field is:
     a. Hidden via CSS (`display: none` or `position: absolute; left: -9999px`)
     b. Has `aria-hidden="true"` and `tabindex="-1"` (so screen readers and keyboard users skip it)
     c. Has an enticing name for bots (e.g., `website`, `url`, `company_website`)
  3. Submit the form with the honeypot field filled in (value: "https://spam.com")
  4. Verify the submission is silently rejected (HTTP 200 with success-like response, not HTTP 403 -- to avoid tipping off bots)
  5. Verify NO record is created in Supabase
  6. Verify `honeypot_triggered = TRUE` is logged somewhere for monitoring
  7. Submit the form with the honeypot field empty
  8. Verify the submission succeeds normally
- **Expected Result**: Filled honeypot silently rejects submission; empty honeypot allows normal processing; field is invisible to humans and assistive technology
- **Failure Impact**: Bot spam bypasses primary filter; increased noise in lead database
- **Automation**: API Test + Playwright

### SCENARIO-027: Email header injection attempts
- **Category**: Security
- **Priority**: P1
- **Preconditions**: SendGrid email integration deployed; form submissions trigger notification emails
- **Steps**:
  1. Submit the contact form with the following email injection payloads:
     a. email: `test@example.com\nBcc: spam-list@evil.com`
     b. firstName: `Attacker\nContent-Type: text/html\n\n<h1>Injected</h1>`
     c. subject: `Hello\r\nBcc: victim@example.com\r\n`
     d. message: `Test\nFrom: admin@safetrekr.com`
  2. Verify SendGrid email is sent to ONLY the intended recipient (SafeTrekr team)
  3. Verify no additional Bcc or Cc headers were injected
  4. Verify the email body contains the literal newline characters as text, not as SMTP headers
  5. Verify the `From` address is always the configured SafeTrekr sender, not attacker-supplied
- **Expected Result**: All header injection attempts are neutralized; SendGrid API (JSON-based) inherently prevents SMTP header injection; input sanitization strips newlines from single-line fields
- **Failure Impact**: Attacker uses SafeTrekr's SendGrid account to send spam; account suspended; domain reputation destroyed; email deliverability compromised
- **Automation**: API Test

### SCENARIO-028: Security headers validation (full suite)
- **Category**: Security
- **Priority**: P1
- **Preconditions**: Security headers configured in `next.config.ts` headers function
- **Steps**:
  1. Fetch any page and verify the following response headers:
     a. `X-Frame-Options: DENY` -- prevents clickjacking
     b. `X-Content-Type-Options: nosniff` -- prevents MIME sniffing
     c. `Referrer-Policy: strict-origin-when-cross-origin`
     d. `Permissions-Policy: camera=(), microphone=(), geolocation()`
     e. `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
     f. `Content-Security-Policy` (see SCENARIO-024 for details)
  2. Verify headers are present on ALL route types: SSG pages, ISR pages, API routes, OG image endpoint
  3. Run the site through securityheaders.com and verify an A+ rating
  4. Verify no `Server` header leaks (Vercel may add this; verify it is generic)
  5. Verify no `X-Powered-By` header is present (Next.js removes it by default with `poweredByHeader: false`)
- **Expected Result**: All security headers present and correctly configured; A+ rating on securityheaders.com
- **Failure Impact**: Clickjacking, MIME confusion, and other header-based attacks become possible
- **Automation**: API Test

---

## Performance Scenarios

### SCENARIO-029: Lighthouse score >= 95 on all core pages
- **Category**: Performance
- **Priority**: P0
- **Preconditions**: Application deployed to production; no A/B tests or third-party scripts injected
- **Steps**:
  1. Run Lighthouse CI against each core page with these settings:
     - Performance budget: 95
     - Accessibility budget: 95
     - Best Practices budget: 95
     - SEO budget: 95
     - Emulated device: Moto G Power (mobile)
     - Network: Simulated throttling
  2. Test pages:
     a. Homepage (`/`)
     b. Solutions K-12 (`/solutions/k12`)
     c. Solutions Churches (`/solutions/churches`)
     d. Pricing (`/pricing`)
     e. How It Works (`/how-it-works`)
     f. Demo (`/demo`)
     g. Contact (`/contact`)
     h. Blog index (`/blog`)
     i. About (`/about`)
  3. For any page scoring below 95 in any category, capture the specific audit failures
  4. Verify Total Blocking Time (TBT) < 200ms
  5. Verify Cumulative Layout Shift (CLS) < 0.1
- **Expected Result**: All core pages score 95+ in all 4 Lighthouse categories; no individual audit in the red zone
- **Failure Impact**: Google Core Web Vitals ranking signal degraded; poor mobile experience; user trust diminished for a platform that claims technical excellence
- **Automation**: Lighthouse CI (`@lhci/cli`)

### SCENARIO-030: LCP < 1.5s on homepage (mobile and desktop)
- **Category**: Performance
- **Priority**: P0
- **Preconditions**: Homepage deployed with optimized images, font loading, and no render-blocking resources
- **Steps**:
  1. Run WebPageTest from 3 geographic locations (US East, US West, Europe) on mobile emulation
  2. For each run, measure:
     a. LCP element identification (should be the hero headline or hero image)
     b. LCP timing (must be < 1.5s)
     c. TTFB (should be < 200ms for SSG on Vercel CDN)
     d. FCP (should be < 1.0s)
  3. Verify `next/font` preloads fonts correctly (no FOIT/FOUT causing LCP delays)
  4. Verify hero image uses `priority` attribute and appropriate `sizes` attribute
  5. Verify MapLibre GL JS does NOT appear in the critical rendering path
  6. Verify no third-party scripts block rendering before LCP
  7. Check the Network waterfall for any resource that delays LCP
- **Expected Result**: LCP consistently < 1.5s across all test locations; TTFB < 200ms; no layout shifts during LCP paint
- **Failure Impact**: Failed Core Web Vitals; reduced search rankings; poor perceived performance; user bounce
- **Automation**: Lighthouse CI + Playwright (Performance API)

### SCENARIO-031: MapLibre lazy loading does not block initial render
- **Category**: Performance
- **Priority**: P1
- **Preconditions**: MapLibre GL JS configured as a dynamic import with `next/dynamic` and `{ ssr: false }`
- **Steps**:
  1. Navigate to homepage with Performance DevTools recording
  2. Identify the main thread activity during initial page load
  3. Verify `maplibre-gl` JavaScript chunk is NOT in the initial bundle (check `_next/static/chunks/`)
  4. Verify the MapLibre chunk loads only after:
     a. The hero section is visible, OR
     b. The map container enters the viewport (Intersection Observer)
  5. Measure the total initial JavaScript bundle size (must be < 150KB gzipped)
  6. Verify no Web Worker for MapLibre spawns until the map is needed
  7. Verify the static map fallback image is served from Vercel Image Optimization (next/image) with AVIF/WebP format
- **Expected Result**: MapLibre (~300KB) loads asynchronously after initial paint; initial JS bundle stays under 150KB; static fallback visible immediately
- **Failure Impact**: 300KB MapLibre bundle doubles the initial JS payload; LCP budget blown; mobile users on 3G see a blank screen for 5+ seconds
- **Automation**: Playwright + bundlewatch

### SCENARIO-032: Image optimization working correctly across all pages
- **Category**: Performance
- **Priority**: P1
- **Preconditions**: All images use `next/image` component; sharp dependency installed
- **Steps**:
  1. Load homepage and inspect all `<img>` elements in DevTools
  2. Verify each image:
     a. Uses `srcset` with multiple resolutions
     b. Uses `sizes` attribute matching the layout intent
     c. Is served in AVIF or WebP format (check response headers)
     d. Has `width` and `height` attributes (prevents CLS)
     e. Below-the-fold images have `loading="lazy"` (default)
     f. Above-the-fold hero image has `priority` / `loading="eager"`
  3. Verify no images are served at unnecessarily large dimensions (e.g., 4000px wide for a 400px display slot)
  4. Navigate to a solution page and verify segment-specific images are optimized
  5. Check the Vercel `/_next/image` endpoint is serving optimized images (not the raw originals)
  6. Verify OG images generated via `/api/og` are cached by Vercel CDN (check `X-Vercel-Cache: HIT`)
- **Expected Result**: All images served in modern formats at appropriate sizes; no oversized images; OG images cached
- **Failure Impact**: Unoptimized images bloat page weight; LCP delayed by large hero images; mobile data consumption excessive
- **Automation**: Lighthouse CI + Playwright

### SCENARIO-033: JavaScript bundle size within budget
- **Category**: Performance
- **Priority**: P1
- **Preconditions**: Application built; bundlewatch configured with thresholds
- **Steps**:
  1. Run `next build` and inspect the build output
  2. Verify the following bundle size budgets (gzipped):
     a. First Load JS (shared): < 90KB
     b. Homepage page JS: < 30KB (excluding shared)
     c. Total initial JS for any page: < 150KB
     d. MapLibre GL JS chunk: confirm it is a separate async chunk, NOT in the initial bundle
     e. Framer Motion chunk: < 20KB (tree-shaken via `optimizePackageImports`)
  3. Run `bundlewatch` to enforce thresholds in CI
  4. Check for common bundle bloat causes:
     a. Entire `lucide-react` icon library (should be tree-shaken)
     b. Full Radix UI packages (should be individually imported)
     c. Unused Framer Motion features
  5. Verify no duplicate React bundles (React 19 deduplication)
- **Expected Result**: All bundle size budgets met; no unexpected large chunks in the initial load; MapLibre properly code-split
- **Failure Impact**: Exceeding 150KB initial JS budget directly degrades Lighthouse performance score; violates project requirements
- **Automation**: bundlewatch + Lighthouse CI

### SCENARIO-034: Framer Motion animations respect prefers-reduced-motion
- **Category**: Performance
- **Priority**: P2
- **Preconditions**: Framer Motion scroll-reveal animations deployed; `use-reduced-motion.ts` hook implemented; CSS `prefers-reduced-motion` media query in `globals.css`
- **Steps**:
  1. In OS settings or browser emulation, enable "Reduce Motion" preference
  2. Navigate to homepage
  3. Scroll through the page
  4. Verify NO scroll-triggered animations play (no fade-ins, slide-ins, or path drawing)
  5. Verify all content is immediately visible (not hidden in animation initial state)
  6. Verify CSS transitions are reduced to < 0.01ms per the `globals.css` rule
  7. Verify no JavaScript errors from Framer Motion when motion is disabled
  8. Disable the preference and verify animations resume on next page load
- **Expected Result**: All animations are suppressed when reduced motion is preferred; content remains fully visible and functional
- **Failure Impact**: Users with vestibular disorders or motion sensitivity have a poor experience; WCAG 2.2 AA non-compliance (SC 2.3.3)
- **Automation**: Playwright (emulateMediaFeatures)

---

## Accessibility Scenarios

### SCENARIO-035: Full keyboard navigation through all interactive elements
- **Category**: Accessibility
- **Priority**: P0
- **Preconditions**: All pages deployed; focus styles implemented per design system (`focus-visible` ring)
- **Steps**:
  1. Start on homepage with focus on the document body
  2. Press Tab key and verify focus moves to:
     a. Skip navigation link (first Tab stop)
     b. Logo (second Tab stop)
     c. Navigation items in order (Platform, Solutions, How It Works, Pricing, About)
     d. Hero CTA button
     e. Through all interactive elements in DOM order
  3. Verify every focused element has a visible focus indicator (2px solid ring, `--color-ring`)
  4. Verify dropdown/disclosure navigation items can be opened with Enter/Space and navigated with Arrow keys
  5. Navigate to `/demo` via keyboard (Tab to CTA, press Enter)
  6. Tab through all form fields in logical order
  7. Verify select/dropdown components are keyboard accessible (Arrow keys for options)
  8. Submit the form using Enter key
  9. Verify the success message receives focus after submission
  10. On mobile viewport: verify the hamburger menu can be opened with Enter/Space, navigated with Arrow keys, and closed with Escape
- **Expected Result**: Every interactive element is reachable and operable via keyboard alone; visible focus indicators on all focused elements; no keyboard traps
- **Failure Impact**: WCAG 2.2 AA non-compliance (SC 2.1.1, 2.4.7); excludes keyboard-only users; legal risk (ADA/Section 508 for K-12 school district clients)
- **Automation**: Playwright + axe-core

### SCENARIO-036: Screen reader compatibility on all forms
- **Category**: Accessibility
- **Priority**: P0
- **Preconditions**: Forms deployed with proper ARIA labels and roles
- **Steps**:
  1. Enable VoiceOver (macOS) or NVDA (Windows)
  2. Navigate to `/demo`
  3. Verify the form has an accessible name (`aria-label` or associated heading)
  4. Tab to each form field and verify the screen reader announces:
     a. Label text (e.g., "Email address, required, edit text")
     b. Required state (via `aria-required="true"`)
     c. Any help text or description (via `aria-describedby`)
  5. Intentionally submit the form with empty required fields
  6. Verify validation errors are:
     a. Announced by the screen reader (via `aria-live="polite"` or `role="alert"`)
     b. Associated with the correct field (via `aria-describedby` or `aria-errormessage`)
  7. Fix the errors and submit successfully
  8. Verify the success message is announced via `aria-live="assertive"` or `role="status"`
  9. Verify the Turnstile widget is not confusing to screen readers (properly labeled or hidden)
  10. Run axe-core automated accessibility scan on the page
- **Expected Result**: All form fields properly labeled; errors announced dynamically; success state communicated; zero axe-core violations
- **Failure Impact**: Screen reader users cannot complete forms; WCAG 2.2 AA non-compliance (SC 1.3.1, 3.3.2, 4.1.2); excludes users with visual disabilities
- **Automation**: axe-core + Manual (screen reader)

### SCENARIO-037: Color contrast ratios meet WCAG AA requirements
- **Category**: Accessibility
- **Priority**: P0
- **Preconditions**: Design tokens implemented per UI design system; muted-foreground darkened to #555a5d
- **Steps**:
  1. Run axe-core contrast checker on every page
  2. Manually verify critical color combinations:
     a. `foreground (#061a23)` on `background (#e7ecee)` -- expected: 14.2:1 (PASS)
     b. `muted-foreground (#555a5d)` on `background (#e7ecee)` -- expected: ~4.6:1 (PASS for AA normal text)
     c. `muted-foreground (#555a5d)` on `card (#f7f8f8)` -- verify >= 4.5:1
     d. `primary-foreground (#ffffff)` on `primary (#4ca46e)` -- verify >= 4.5:1 for button text
     e. `secondary-foreground (#e7ecee)` on `secondary (#123646)` -- verify >= 4.5:1
     f. `destructive-foreground (#ffffff)` on `destructive (#c1253e)` -- verify >= 4.5:1
  3. Check all text over images (hero section) has sufficient contrast
  4. Check focus indicator visibility against all background colors
  5. Verify link text is distinguishable from surrounding text (underline or 3:1 contrast difference)
  6. Test in "high contrast mode" (Windows) and "increase contrast" (macOS)
- **Expected Result**: All text meets 4.5:1 contrast ratio for normal text and 3:1 for large text; no contrast failures in axe-core scan
- **Failure Impact**: WCAG 2.2 AA non-compliance (SC 1.4.3); text unreadable for users with low vision; legal risk with K-12 school districts (Section 508 compliance required)
- **Automation**: axe-core + Playwright

### SCENARIO-038: Focus management on form submission and route transitions
- **Category**: Accessibility
- **Priority**: P1
- **Preconditions**: Forms deployed with success/error states
- **Steps**:
  1. Navigate to `/demo` and fill in all required fields
  2. Submit the form
  3. After success state appears, verify:
     a. Focus moves to the success message element
     b. The success message has `role="status"` or is in an `aria-live` region
     c. Screen readers announce the success message
  4. Submit the form with validation errors
  5. Verify:
     a. Focus moves to the first error field or an error summary
     b. The error is announced by screen readers
  6. Navigate between pages using client-side routing (Next.js Link)
  7. After each route transition, verify:
     a. Focus resets to the top of the page or the main content area
     b. The page title is updated and announced
     c. No focus is "lost" in a removed DOM element
- **Expected Result**: Focus is managed correctly on all state transitions; screen reader users are informed of changes
- **Failure Impact**: Keyboard and screen reader users are "lost" after interactions; forms appear non-functional; WCAG non-compliance (SC 3.2.1, 3.2.2)
- **Automation**: Playwright + axe-core

### SCENARIO-039: Skip navigation link works correctly
- **Category**: Accessibility
- **Priority**: P1
- **Preconditions**: Skip navigation component deployed at `/src/components/layout/skip-nav.tsx`
- **Steps**:
  1. Load any page
  2. Press Tab once
  3. Verify the skip navigation link becomes visible (positioned at top of viewport)
  4. Verify the link text reads "Skip to main content" or equivalent
  5. Press Enter on the skip link
  6. Verify focus moves to the `<main>` element or the first heading in main content
  7. Verify the skip link has proper styling when focused (visible against header background)
  8. Press Tab again and verify focus is now within the main content area (NOT the navigation)
  9. Test on every distinct layout: marketing, blog, legal, landing page
- **Expected Result**: Skip link appears on first Tab; activating it bypasses navigation and moves focus to main content
- **Failure Impact**: Keyboard users must Tab through entire navigation on every page; WCAG non-compliance (SC 2.4.1)
- **Automation**: Playwright

### SCENARIO-040: ARIA landmarks and heading hierarchy
- **Category**: Accessibility
- **Priority**: P1
- **Preconditions**: All page layouts deployed
- **Steps**:
  1. For each page, verify the following ARIA landmarks exist:
     a. `<header>` or `role="banner"` (one per page)
     b. `<nav>` or `role="navigation"` (primary nav, with `aria-label`)
     c. `<main>` or `role="main"` (one per page)
     d. `<footer>` or `role="contentinfo"` (one per page)
  2. Verify heading hierarchy:
     a. Exactly one `<h1>` per page
     b. No skipped heading levels (no h1 -> h3 without h2)
     c. Headings form a logical document outline
  3. Verify form groups use `<fieldset>` and `<legend>` where appropriate
  4. Run axe-core landmark and heading audits
  5. Check with the WAVE browser extension for any warnings
- **Expected Result**: All pages have complete landmark structure; heading hierarchy is logical and unbroken; single h1 per page
- **Failure Impact**: Screen reader users cannot navigate by landmarks or headings; document structure is unclear; WCAG non-compliance (SC 1.3.1, 2.4.6)
- **Automation**: axe-core + Playwright

---

## Integration Scenarios

### SCENARIO-041: Supabase form storage works end-to-end
- **Category**: Integration
- **Priority**: P0
- **Preconditions**: Supabase marketing project configured; RLS policies active; `SUPABASE_SERVICE_ROLE_KEY` set in environment
- **Steps**:
  1. Submit a demo request form with all fields populated
  2. Query `form_submissions` table directly via Supabase dashboard or SQL
  3. Verify the record contains:
     a. Correct `form_type` enum value
     b. All contact fields populated
     c. JSONB `details` with form-specific data (trips_per_year, group_size, etc.)
     d. UTM parameters captured from URL query string (if present)
     e. `ip_hash` populated (SHA-256 hash, not raw IP)
     f. `country_code` from Vercel geo headers
     g. `created_at` timestamp
     h. `status = 'new'`
     i. `crm_sync_status = 'pending'`
  4. Verify the `crm_sync_queue` table has a corresponding entry (created by trigger)
  5. Verify RLS: attempt to query the table using the `anon` key -- verify it returns zero rows
  6. Submit forms of each type and verify the unified `form_submissions` table handles all types correctly
- **Expected Result**: All form types stored correctly in Supabase; RLS prevents unauthorized reads; triggers fire; JSONB details schema matches per form type
- **Failure Impact**: Lead data lost; no record of prospect inquiries; sales pipeline empty; $360K-$750K Year 1 revenue at risk
- **Automation**: API Test + Playwright

### SCENARIO-042: SendGrid email delivery succeeds for all form types
- **Category**: Integration
- **Priority**: P0
- **Preconditions**: SendGrid API key configured; sender identity verified; email templates defined
- **Steps**:
  1. Submit a demo request form
  2. Check SendGrid Activity Feed (or use Event Webhook) for the notification email
  3. Verify the email:
     a. Was delivered (not bounced, deferred, or dropped)
     b. Sent to the correct internal recipient (SafeTrekr team email)
     c. Contains all submitted form data in the body
     d. Has a proper subject line identifying the form type and submitter
     e. Reply-to header is set to the submitter's email
  4. Submit a contact form and verify email delivery
  5. Submit a newsletter signup and verify the confirmation email:
     a. Sent to the subscriber's email
     b. Contains a valid confirmation link
     c. Link includes the `confirmation_token`
  6. Submit a quote request and verify email delivery
  7. Verify SPF, DKIM, and DMARC pass (check email headers)
  8. Test with a non-existent email domain and verify graceful handling
- **Expected Result**: All form types trigger correct email notifications; emails are delivered to inbox (not spam); authentication headers pass
- **Failure Impact**: Team never receives lead notifications; response time degrades from 1 business day to never; newsletter subscribers cannot confirm
- **Automation**: API Test

### SCENARIO-043: Plausible Analytics event tracking fires correctly
- **Category**: Integration
- **Priority**: P1
- **Preconditions**: Plausible script loaded; `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` configured
- **Steps**:
  1. Navigate to homepage and verify the Plausible script tag is present in the document
  2. Open the Network tab and filter for requests to `plausible.io`
  3. Navigate to various pages and verify pageview events are fired
  4. Click a CTA button (e.g., "Request Demo") and verify a custom event fires
  5. Submit a form and verify a conversion event fires with appropriate goal name
  6. Verify events include the correct page path and referrer
  7. Visit the Plausible dashboard and confirm events appear in real-time
  8. Test with an ad-blocker enabled:
     a. Verify the site functions normally (no JavaScript errors)
     b. Verify analytics gracefully degrade (events not sent, no errors)
  9. Verify no cookie is set by Plausible (privacy-first requirement for K-12/church audiences)
- **Expected Result**: Pageviews and custom events tracked in Plausible; no cookies set; graceful degradation with ad-blockers
- **Failure Impact**: No analytics data; cannot measure conversion rates; cannot optimize marketing spend; flying blind on $50K+ investment
- **Automation**: Playwright

### SCENARIO-044: MapLibre tile loading works across map interactions
- **Category**: Integration
- **Priority**: P1
- **Preconditions**: MapTiler API key configured; MapLibre GL JS lazy-loaded on homepage
- **Steps**:
  1. Navigate to homepage and scroll to trigger MapLibre lazy-load
  2. Verify map tiles load from `api.maptiler.com`
  3. Verify the map renders with the correct style (matching SafeTrekr brand)
  4. If interactive: zoom in/out and verify additional tiles load at higher zoom levels
  5. Pan the map and verify edge tiles load smoothly
  6. Verify no CORS errors in the console
  7. Verify the CSP `img-src` and `connect-src` directives allow MapTiler connections
  8. Test with MapTiler API quota exhausted (or invalid API key):
     a. Verify the map fails gracefully to the static fallback
     b. Verify no JavaScript errors crash the page
     c. Verify the rest of the page remains functional
- **Expected Result**: Map tiles load correctly; interactions are smooth; graceful fallback on API failure
- **Failure Impact**: Hero visual element is broken; first impression damaged; the interactive map is a key differentiator in the visual design
- **Automation**: Playwright

### SCENARIO-045: OG image generation works for all page types
- **Category**: Integration
- **Priority**: P2
- **Preconditions**: `/api/og` endpoint deployed on Edge runtime; Satori/next-og configured
- **Steps**:
  1. Fetch `/api/og?title=SafeTrekr+-+Trip+Safety+Intelligence` and verify:
     a. HTTP 200 response
     b. Content-Type is `image/png`
     c. Image dimensions are 1200x630 (standard OG image size)
     d. Image contains the supplied title text
     e. SafeTrekr branding (logo, colors) is present
  2. Fetch with different parameters:
     a. `/api/og?title=K-12+School+Trip+Safety&segment=k12`
     b. `/api/og?title=Pricing&subtitle=Starting+at+$15/student`
  3. Verify caching: `Cache-Control: public, max-age=0, s-maxage=604800`
  4. Verify `X-Vercel-Cache: HIT` on subsequent requests
  5. Test with missing title parameter -- verify graceful fallback (default image)
  6. Test with extremely long title -- verify it truncates or wraps without breaking layout
  7. Validate each page's `<meta property="og:image">` tag points to the OG endpoint with correct parameters
  8. Share a page URL on Slack/Twitter and verify the preview card renders correctly
- **Expected Result**: Dynamic OG images generated for all pages; cached by Vercel CDN; correct branding; social sharing previews work
- **Failure Impact**: Social sharing shows no preview image; reduced click-through rates on shared links; unprofessional appearance
- **Automation**: API Test + Playwright

### SCENARIO-046: Supabase RLS prevents unauthorized data access
- **Category**: Integration
- **Priority**: P0
- **Preconditions**: RLS enabled on all tables; policies restrict to `service_role` only
- **Steps**:
  1. Using the Supabase `anon` key (publicly visible in client-side code if exposed):
     a. Attempt to SELECT from `form_submissions` -- verify 0 rows returned
     b. Attempt to INSERT into `form_submissions` -- verify rejected
     c. Attempt to SELECT from `newsletter_subscribers` -- verify 0 rows returned
     d. Attempt to SELECT from `analytics_events` -- verify 0 rows returned
     e. Attempt to SELECT from `crm_sync_queue` -- verify 0 rows returned
  2. Verify the `SUPABASE_SERVICE_ROLE_KEY` is NEVER exposed in:
     a. Client-side JavaScript bundles (search build output)
     b. HTML source
     c. Network requests from the browser
  3. Verify all Supabase client usage is in Server Actions or API Route Handlers (server-side only)
  4. Attempt to call Supabase REST API directly with the `anon` key against the marketing project
- **Expected Result**: Zero data access via `anon` key; service_role key never exposed client-side; all database operations are server-only
- **Failure Impact**: CRITICAL -- all lead data (emails, names, organizations, phone numbers) exposed to the public internet; GDPR/CCPA violation; trust destruction for a security product
- **Automation**: API Test

---

## Error Handling Scenarios

### SCENARIO-047: Form submission during network failure
- **Category**: Error Handling
- **Priority**: P0
- **Preconditions**: Demo request form deployed with error handling
- **Steps**:
  1. Navigate to `/demo` and fill in all required fields
  2. Open DevTools and set network to "Offline"
  3. Click Submit
  4. Verify:
     a. The submit button shows a loading state briefly then reverts
     b. A user-friendly error message appears (NOT a raw network error)
     c. The message suggests checking the connection and trying again
     d. Form data is preserved (fields are NOT cleared)
     e. No console errors crash the page
  5. Re-enable the network connection
  6. Click Submit again
  7. Verify the form submits successfully with the preserved data
  8. Test the same scenario on contact form and newsletter form
- **Expected Result**: Graceful error message on network failure; form data preserved; successful retry after connection restored
- **Failure Impact**: Users who hit Submit during a brief network blip lose all their form data and must start over; leads lost
- **Automation**: Playwright (network offline emulation)

### SCENARIO-048: Supabase connection timeout during form submission
- **Category**: Error Handling
- **Priority**: P1
- **Preconditions**: Form submission pipeline deployed; Supabase client configured with timeout
- **Steps**:
  1. Simulate Supabase unavailability (e.g., block `*.supabase.co` at the network level, or use a test configuration pointing to a non-responsive host)
  2. Submit the demo request form
  3. Verify:
     a. The request times out within a reasonable period (< 10 seconds)
     b. A user-friendly error is shown: "We're experiencing a temporary issue. Please try again in a few minutes."
     c. The error does NOT expose internal details (no Supabase URL, no connection string, no stack trace)
     d. The form data is preserved
  4. Verify the Server Action catches the timeout error and returns a structured error response
  5. Verify the error is logged server-side (Vercel logs or Sentry)
  6. Consider: should SendGrid notification still be attempted even if Supabase fails? (Answer: probably yes, as a fallback to not lose the lead)
- **Expected Result**: Timeout handled gracefully; user sees friendly error; no sensitive information leaked; form data preserved; error logged
- **Failure Impact**: Users see a cryptic error or spinning loader indefinitely; leads lost during Supabase outages
- **Automation**: Playwright + API Test (mocked Supabase)

### SCENARIO-049: SendGrid delivery failure during form submission
- **Category**: Error Handling
- **Priority**: P1
- **Preconditions**: SendGrid integration deployed; form pipeline handles email errors
- **Steps**:
  1. Submit a form with an invalid SendGrid API key (or mock a 500 response from SendGrid)
  2. Verify:
     a. The Supabase record is STILL created (email failure should not block data storage)
     b. The user STILL sees a success message (the form submission was captured)
     c. The email failure is logged server-side for investigation
     d. No error message is shown to the user (email is an internal notification, not user-facing)
  3. Submit with a valid API key but SendGrid rate limit exceeded (HTTP 429)
  4. Verify the same behavior: data stored, user sees success, failure logged
  5. Verify there is a mechanism to retry failed emails (either queue or manual alert)
- **Expected Result**: Email failures do not prevent form submission success; data is always stored; failures are logged for ops team
- **Failure Impact**: If email failure blocks submission: leads lost. If email failure shown to user: confusing UX since their data was actually captured.
- **Automation**: API Test (mocked SendGrid)

### SCENARIO-050: Invalid route returns proper 404 page
- **Category**: Error Handling
- **Priority**: P1
- **Preconditions**: Custom 404 page deployed at `src/app/not-found.tsx`
- **Steps**:
  1. Navigate to a non-existent route: `/this-page-does-not-exist`
  2. Verify:
     a. HTTP 404 status code returned
     b. Custom 404 page renders (NOT the default Next.js 404)
     c. The 404 page includes SafeTrekr branding, navigation, and footer
     d. A helpful message suggests alternative pages or a search
     e. Links to homepage, solutions, and contact are provided
     f. The 404 page has a `<meta name="robots" content="noindex">` tag
  3. Test with various invalid paths:
     a. `/solutions/invalid-segment`
     b. `/blog/non-existent-post`
     c. `/api/non-existent-endpoint`
     d. Path with special characters: `/page%20with%20spaces`
     e. Extremely long path: `/ + 500 characters`
  4. Verify the 404 page renders correctly on all of them
  5. Verify no sensitive server information is leaked in the 404 response
- **Expected Result**: Custom branded 404 page with helpful navigation; correct HTTP status; no information leakage
- **Failure Impact**: Lost visitors who mistype URLs; poor SEO signals from unhandled 404s; unprofessional appearance
- **Automation**: Playwright + API Test

### SCENARIO-051: Server error returns proper 500 page
- **Category**: Error Handling
- **Priority**: P1
- **Preconditions**: Error boundary deployed at `src/app/error.tsx` and `src/app/global-error.tsx`
- **Steps**:
  1. Introduce a deliberate server error in a test environment (e.g., throw an Error in a Server Component)
  2. Navigate to the affected page
  3. Verify:
     a. The error boundary catches the error
     b. A user-friendly error page renders with SafeTrekr branding
     c. The page includes a "Try Again" or "Go Home" button
     d. No stack traces, file paths, or internal details are shown to the user
     e. The error is logged to server logs (and Sentry when configured)
  4. Verify the `global-error.tsx` handles root-level errors (outside of any layout)
  5. Click "Try Again" and verify the page attempts to re-render
  6. Navigate away and back to verify the error does not persist if the cause is transient
- **Expected Result**: Error boundary catches all unhandled errors; friendly error page shown; no information leakage; errors logged
- **Failure Impact**: Users see a blank white page or raw error stack; unprofessional and frightening for a security product; no error visibility for ops
- **Automation**: Playwright (test environment)

### SCENARIO-052: Graceful degradation when Turnstile widget fails to load
- **Category**: Error Handling
- **Priority**: P1
- **Preconditions**: Turnstile widget deployed; forms have fallback behavior
- **Steps**:
  1. Block `challenges.cloudflare.com` in the network settings (simulating corporate firewall blocking)
  2. Navigate to `/demo`
  3. Verify:
     a. The form still renders
     b. The Turnstile widget area shows a fallback message or is gracefully hidden
     c. Ideally: the form can still be submitted with a server-side fallback verification
     d. At minimum: a clear message explains why submission may not work
  4. Fill in the form and attempt to submit
  5. If submission is blocked: verify the error message is clear and suggests contacting support directly
  6. If submission is allowed (with fallback): verify rate limiting and honeypot provide secondary protection
  7. Verify this scenario is logged as a potential issue for monitoring
- **Expected Result**: Form remains usable or clearly communicates the limitation; no JavaScript crash; fallback protection mechanism in place
- **Failure Impact**: Users behind restrictive corporate firewalls (common in K-12 school districts) cannot submit any forms; all lead generation blocked for a key target segment
- **Automation**: Playwright (network block)

---

## Data Integrity Scenarios

### SCENARIO-053: UTM parameter tracking through form submissions
- **Category**: Data Integrity
- **Priority**: P1
- **Preconditions**: UTM parameter capture implemented; forms store attribution data
- **Steps**:
  1. Navigate to `/demo?utm_source=google&utm_medium=cpc&utm_campaign=k12-safety&utm_content=hero-cta&utm_term=school+trip+safety`
  2. Fill in and submit the demo request form
  3. Query Supabase and verify the `form_submissions` record contains:
     a. `utm_source = 'google'`
     b. `utm_medium = 'cpc'`
     c. `utm_campaign = 'k12-safety'`
     d. `utm_content = 'hero-cta'`
     e. `utm_term = 'school trip safety'`
     f. `landing_page = '/demo'`
  4. Navigate through multiple pages (e.g., `/pricing` -> `/solutions/k12` -> `/demo`) with UTM params in the initial URL
  5. Submit the form and verify UTM params are still captured (persisted across navigation)
  6. Navigate to `/demo` WITHOUT any UTM params
  7. Submit the form and verify `source = 'direct'` and UTM fields are NULL
  8. Test with referrer: navigate from an external link (simulated) and verify `referrer` field is captured
- **Expected Result**: UTM parameters are captured on initial page load and persisted through navigation; correctly stored with every form submission; attribution data enables marketing ROI analysis
- **Failure Impact**: Cannot attribute leads to marketing campaigns; paid acquisition ROI unmeasurable; wasted ad spend
- **Automation**: Playwright + API Test

### SCENARIO-054: IP address is hashed, never stored in plaintext
- **Category**: Data Integrity
- **Priority**: P0
- **Preconditions**: IP hashing implemented in Server Actions using SHA-256
- **Steps**:
  1. Submit a form from a known IP address
  2. Query Supabase `form_submissions` table
  3. Verify the `ip_hash` field:
     a. Contains a 64-character hexadecimal string (SHA-256 output)
     b. Does NOT contain the raw IP address
     c. Matches the expected SHA-256 hash of the submitter's IP
  4. Search all Supabase tables for any column containing the raw IP address
  5. Verify no raw IP appears in:
     a. `form_submissions`
     b. `newsletter_subscribers`
     c. `analytics_events`
     d. Server logs (Vercel function logs)
  6. Verify the IP hash is consistent: submit two forms from the same IP and verify the hashes match (deterministic hashing)
- **Expected Result**: IP addresses are always SHA-256 hashed before storage; no raw IPs anywhere in the system; consistent hashing
- **Failure Impact**: GDPR/CCPA violation (IP addresses are PII); legal liability; trust destruction for a security product; contradicts privacy-first design philosophy
- **Automation**: API Test

### SCENARIO-055: Form submission with XSS payloads in JSONB details field
- **Category**: Data Integrity
- **Priority**: P1
- **Preconditions**: Forms store type-specific data in JSONB `details` column
- **Steps**:
  1. Submit a demo request with the following in optional fields that map to JSONB:
     a. tripTypes: `["<script>alert('xss')</script>", "normal_type"]`
     b. message: `{"__proto__":{"polluted":"yes"}}`
     c. timeline: `immediate" OR 1=1;--`
  2. Verify the Zod schema validation:
     a. Rejects the malformed tripTypes entries (they should be enum values)
     b. Rejects prototype pollution attempts (message is a string, not an object)
     c. Rejects the SQL injection in timeline (must be one of the enum values)
  3. If any payload passes validation, verify it is stored as literal text in JSONB (not executed)
  4. Verify no prototype pollution occurs in the Node.js runtime
  5. Verify the JSONB field cannot be used to escape the column boundary in SQL
- **Expected Result**: Zod enum validation blocks most payloads; any that pass are stored as literal text; no code execution or prototype pollution
- **Failure Impact**: Stored XSS in JSONB field; prototype pollution could crash the server; SQL escape from JSONB could access other data
- **Automation**: API Test

---

## Additional Adversarial Scenarios

### SCENARIO-056: Concurrent form submissions from multiple users
- **Category**: Data Integrity
- **Priority**: P1
- **Preconditions**: All form endpoints deployed; Supabase handling concurrent writes
- **Steps**:
  1. Using Playwright or a load testing tool, simultaneously submit 50 demo request forms with unique email addresses
  2. Verify all 50 records are created in Supabase (no lost writes)
  3. Verify each record has a unique UUID
  4. Verify no race conditions in the `crm_sync_queue` trigger (50 queue entries created)
  5. Verify SendGrid handles 50 concurrent notification requests (or queue gracefully)
  6. Verify server response times remain under 3 seconds per request
  7. Verify no HTTP 500 errors
  8. Verify no duplicate records (each email appears exactly once)
- **Expected Result**: All concurrent submissions succeed; no data loss; no duplicates; acceptable response times
- **Failure Impact**: Lost leads during high-traffic periods (e.g., after a conference presentation or product launch)
- **Automation**: Playwright + API Test

### SCENARIO-057: Structured data (JSON-LD) validation across all pages
- **Category**: Critical Path
- **Priority**: P1
- **Preconditions**: JSON-LD schemas implemented via `src/components/seo/json-ld.tsx`
- **Steps**:
  1. For each page, extract all `<script type="application/ld+json">` elements
  2. Validate against schema.org specifications:
     a. Homepage: Organization + WebSite + SearchAction schemas
     b. Solutions pages: Service or Product schema per segment
     c. Pricing: Product schema with pricing offers
     d. Blog posts: Article + BreadcrumbList schemas
     e. FAQ section: FAQPage schema
     f. About: Organization + Person schemas (team)
     g. Contact: ContactPage schema with contact points
  3. Run Google Rich Results Test against each page URL
  4. Verify no duplicate schemas on any page
  5. Verify all required fields are populated (no empty strings or null values)
  6. Verify dates are in ISO 8601 format
  7. Verify image URLs in schemas are absolute (not relative)
- **Expected Result**: Valid JSON-LD on all pages; passes Google Rich Results Test; enables rich snippets and AI citations
- **Failure Impact**: No rich snippets in search results; missed AI citation opportunities; reduced click-through rates from search
- **Automation**: Playwright + API Test (Google Rich Results API)

---

## Summary

| Category | Count | P0 | P1 | P2 |
|---|---|---|---|---|
| Critical Path | 12 | 11 | 1 | 0 |
| Edge Case | 7 | 0 | 3 | 4 |
| Security | 9 | 5 | 4 | 0 |
| Performance | 6 | 2 | 3 | 1 |
| Accessibility | 6 | 3 | 3 | 0 |
| Integration | 6 | 3 | 2 | 1 |
| Error Handling | 6 | 1 | 5 | 0 |
| Data Integrity | 5 | 1 | 4 | 0 |
| **Total** | **57** | **26** | **25** | **6** |

### Automation Coverage

| Tool | Scenario Count |
|---|---|
| Playwright | 42 |
| API Test | 30 |
| axe-core | 6 |
| Lighthouse CI | 4 |
| bundlewatch | 2 |
| Manual | 1 |

Note: Many scenarios use multiple automation tools. The "Manual" count represents scenarios requiring physical screen reader testing that cannot be fully automated.

### Critical Flags Identified During Scenario Generation

1. **CSP `unsafe-inline` and `unsafe-eval`**: The current `next.config.ts` CSP includes `'unsafe-inline'` and `'unsafe-eval'` in `script-src`. These significantly weaken XSS protection and should be replaced with nonce-based CSP for production. See SCENARIO-024.

2. **Turnstile Firewall Blocking**: K-12 school districts commonly use restrictive firewalls that may block `challenges.cloudflare.com`. A fallback mechanism is critical for the primary target segment. See SCENARIO-052.

3. **Muted Foreground Contrast**: The original `#616567` muted-foreground color failed WCAG AA (4.0:1). It was darkened to `#555a5d` (~4.6:1) which barely passes. Recommend further darkening to `#4a4f52` (~5.0:1) for comfortable margin. See SCENARIO-037.

4. **Double Opt-In Email Flow**: The newsletter double opt-in flow involves a confirmation token and email -- this must be tested end-to-end to ensure the confirmation link works correctly. There is no automated test for this in the current architecture. See SCENARIO-011.

---

*Generated by Crash-to-Fix Oracle (CFO) v1.1 on 2026-03-24*
*Project: SafeTrekr Marketing Site*
*Input: 8-agent discovery suite + CTA architecture specification*
