# Mockup Specification: Demo Request Page (`/demo`)

**Version**: 1.0
**Date**: 2026-03-24
**Status**: DESIGN SPEC -- Ready for Implementation
**Page Type**: Form Page (SSG with Server Actions)
**Hierarchy Level**: L1
**Canonical URL**: `https://www.safetrekr.com/demo`
**Redirects From**: `/request-demo`, `/get-a-demo`, `/book-demo` (all 301 Permanent)
**JSON-LD**: None (conversion page)
**Breadcrumb**: None (L1 page)

---

## 1. Page Purpose and Context

**Primary goal**: Convert qualified prospects into demo requests. This is the single most important conversion endpoint on the site.

**Framing**: "See Your Safety Binder" -- not "Talk to Sales." The page promises a personalized walkthrough of what a real safety binder looks like for the visitor's organization. This outcome-framed positioning reduces sales resistance and aligns with the product's documentation-first value proposition.

**Progressive profiling strategy**: Step 1 captures minimum viable lead data (2 fields: email + organization name). Step 2 enriches the lead with qualification data. If the visitor abandons after Step 1, the sales team still has an actionable contact. This design reduces initial friction by 60% compared to a single-step form with all fields.

**Target audience**: Qualified prospects ready to engage -- trip coordinators, risk managers, administrators who have evaluated enough to take action. They arrive from:
- Persistent "Get a Demo" CTA in utility nav (1 click from any page)
- CTA bands on feature, solutions, and pricing pages
- Email nurture sequences
- Direct URL entry or bookmark

---

## 2. Page Layout (Desktop >= 1024px)

### 2.1 Overall Structure

```
+============================================================================+
|  [SiteHeader -- sticky, standard]                                          |
+============================================================================+
|                                                                            |
|  [bg-background]                                                           |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  |  HERO HEADLINE AREA (centered, full-width container)                 |  |
|  |  [Eyebrow] + [Headline] + [Sub-headline]                            |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  |  MAIN CONTENT AREA (2-column layout)                                 |  |
|  |                                                                      |  |
|  |  +---------------------------+  +----------------------------------+ |  |
|  |  |  FORM CARD (7 cols)       |  |  TRUST SIDEBAR (5 cols)          | |  |
|  |  |                           |  |                                  | |  |
|  |  |  [Step Indicator]         |  |  [What to Expect]               | |  |
|  |  |  [Form Fields]            |  |  [Trust Proof Points]           | |  |
|  |  |  [Submit Button]          |  |  [Security Assurance]           | |  |
|  |  |  [Turnstile]              |  |                                  | |  |
|  |  +---------------------------+  +----------------------------------+ |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  |  ALTERNATIVE PATHS (centered, below form)                            |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
|  [SiteFooter -- standard]                                                  |
+============================================================================+
```

### 2.2 Grid Specification

| Property | Value |
|----------|-------|
| Container | `max-w-[var(--container-xl)] mx-auto px-6 sm:px-8 lg:px-12` (1280px max) |
| Main content grid | `grid lg:grid-cols-12 gap-8 lg:gap-12` |
| Form card column span | `lg:col-span-7` |
| Trust sidebar column span | `lg:col-span-5` |
| Vertical alignment | `items-start` (sidebar anchored to top of form) |

### 2.3 Page Background

- Base: `bg-background` (`#e7ecee`)
- Pattern overlay: `bg-dot-grid` at 3-4% opacity across entire page
- No dark sections on this page (forms are prohibited in dark sections per design system section 12.1)

---

## 3. Section 1: Hero Headline Area

### 3.1 Layout

Centered text block above the form area. Full container width. Creates the conversion promise before the visitor encounters form fields.

### 3.2 Spacing

| Breakpoint | Top padding | Bottom padding |
|------------|-------------|----------------|
| base (< 640px) | `pt-12` (48px) | `pb-8` (32px) |
| sm (640px) | `pt-16` (64px) | `pb-10` (40px) |
| md (768px) | `pt-20` (80px) | `pb-12` (48px) |
| lg (1024px) | `pt-24` (96px) | `pb-12` (48px) |

### 3.3 Content

| Element | Content | Style |
|---------|---------|-------|
| Eyebrow | "PERSONALIZED DEMO" | `.text-eyebrow text-primary-700`, with `Play` icon (14px) leading |
| Headline | "See How SafeTrekr Protects Every Trip." | `.text-display-md text-foreground text-center max-w-[28ch] mx-auto` |
| Sub-headline | "Schedule a personalized walkthrough of the SafeTrekr platform. We'll show you exactly what a safety binder looks like for your organization." | `.text-body-lg text-muted-foreground text-center max-w-[55ch] mx-auto mt-4` |

### 3.4 Animation

| Time | Element | Animation | Duration | Easing |
|------|---------|-----------|----------|--------|
| 0ms | Eyebrow | `fadeIn` | 300ms | default |
| 100ms | Headline | `fadeUp` (y: 20px) | 400ms | spring |
| 250ms | Sub-headline | `fadeUp` (y: 16px) | 300ms | enter |
| 400ms | Form card + Sidebar | `fadeUp` (y: 24px) | 500ms | spring |

Under `prefers-reduced-motion: reduce`: all elements render at final state immediately.

---

## 4. Section 2: Form Card (Primary Conversion)

### 4.1 Card Container

```
bg-card rounded-2xl border border-border shadow-lg p-8 sm:p-10
```

| Property | Value |
|----------|-------|
| Background | `card` (`#f7f8f8`) |
| Border | `border` (`#b8c3c7`) |
| Border radius | `radius-2xl` (20px) |
| Shadow | `shadow-lg` |
| Padding | `p-8` (32px) mobile, `sm:p-10` (40px) tablet+ |
| Min height | None (grows with content) |

### 4.2 Step Indicator

Visual progress indicator above the form fields showing current position in the 2-step flow.

```
+---------------------------------------------------------------+
|  Step 1 of 2: Basic Info          [==========----------]      |
+---------------------------------------------------------------+
```

**Structure**:

```html
<div class="flex items-center justify-between mb-8">
  <p class="text-body-sm font-medium text-foreground">
    Step <span class="text-primary-700">1</span> of 2
  </p>
  <div class="flex gap-2">
    <div class="h-1.5 w-20 rounded-full bg-primary-500" />   <!-- Active -->
    <div class="h-1.5 w-20 rounded-full bg-border" />         <!-- Inactive -->
  </div>
</div>
```

**Step 2 state**: Both bars filled (`bg-primary-500`), label reads "Step 2 of 2: Tell Us More".

### 4.3 Step 1: Minimum Viable Lead (2 Fields)

**Purpose**: Capture the two pieces of information needed to begin a sales conversation. Minimal friction. Maximum conversion.

#### Field Layout (Step 1)

Single column stack. Each field gets full width.

```
+---------------------------------------------------------------+
|  Step 1 of 2: Basic Info          [====-------]               |
|                                                                |
|  Work Email *                                                  |
|  +-----------------------------------------------------------+|
|  | you@organization.com                                       ||
|  +-----------------------------------------------------------+|
|                                                                |
|  Organization Name *                                           |
|  +-----------------------------------------------------------+|
|  | e.g. Springfield Unified School District                   ||
|  +-----------------------------------------------------------+|
|                                                                |
|  [ Continue  ->                                        ]       |
|                                                                |
|  [invisible Turnstile widget]                                  |
|  [hidden honeypot field]                                       |
+---------------------------------------------------------------+
```

#### Field Specifications (Step 1)

| Field | HTML Type | Name Attr | Required | Placeholder | Validation (Zod) | Icon |
|-------|-----------|-----------|----------|-------------|-------------------|------|
| Work Email | `<input type="email">` | `email` | Yes | "you@organization.com" | `z.string().email("Please enter a valid work email.")` | `Mail` (16px, left) |
| Organization Name | `<input type="text">` | `organizationName` | Yes | "e.g. Springfield Unified School District" | `z.string().min(2, "Organization name is required.")` | `Building2` (16px, left) |

#### Continue Button (Step 1)

| Property | Value |
|----------|-------|
| Label | "Continue" |
| Variant | `primary` |
| Size | `lg` (52px height) |
| Width | Full width (`w-full`) |
| Icon | `ArrowRight` (16px, right side) |
| Behavior | Client-side validates Step 1 fields. If valid, transitions to Step 2 with `fadeUp` animation. Does NOT submit to server yet. |

### 4.4 Step 2: Lead Enrichment (Full Details)

**Purpose**: Qualify the lead with organization type, trip volume, and preferred engagement format. This data routes the lead to the correct sales workflow and enables demo personalization.

**Transition animation**: Step 1 fields slide out with `fadeIn` (reverse, 200ms). Step 2 fields enter with `fadeUp` (y: 16px, 300ms, staggered at 60ms per field).

#### Field Layout (Step 2)

Two-column grid for paired fields on desktop (>= md). Single column on mobile.

```
+---------------------------------------------------------------+
|  Step 2 of 2: Tell Us More       [==============]             |
|                                                                |
|  [<- Back to Step 1]                                           |
|                                                                |
|  Full Name *                                                   |
|  +-----------------------------------------------------------+|
|  | Your full name                                             ||
|  +-----------------------------------------------------------+|
|                                                                |
|  +---------------------------+  +----------------------------+ |
|  | Organization Type *       |  | Estimated Annual Trips *   | |
|  | [Select one...        v]  |  | [Select range...       v]  | |
|  +---------------------------+  +----------------------------+ |
|                                                                |
|  Preferred Demo Format *                                       |
|  +-----------------------------------------------------------+|
|  | [Select one...                                          v] ||
|  +-----------------------------------------------------------+|
|                                                                |
|  Message (optional)                                            |
|  +-----------------------------------------------------------+|
|  | Anything specific you'd like to see in the demo?           ||
|  |                                                            ||
|  |                                                            ||
|  +-----------------------------------------------------------+|
|                                                   0 / 500     |
|                                                                |
|  [ Request Your Demo                                   ]       |
|                                                                |
|  By submitting, you agree to our Privacy Policy and            |
|  Terms of Service.                                             |
+---------------------------------------------------------------+
```

#### Field Specifications (Step 2)

| Field | HTML Type | Name Attr | Required | Placeholder / Options | Validation (Zod) | Icon |
|-------|-----------|-----------|----------|----------------------|-------------------|------|
| Full Name | `<input type="text">` | `fullName` | Yes | "Your full name" | `z.string().min(2, "Please enter your full name.")` | `User` (16px, left) |
| Organization Type | `<select>` | `organizationType` | Yes | "Select one..." / K-12 School or District, Higher Education, Church or Mission Organization, Corporate or Business, Sports League or Team, Other | `z.enum([...])` | None (native select arrow) |
| Estimated Annual Trips | `<select>` | `estimatedTrips` | Yes | "Select range..." / 1-10, 11-25, 26-50, 50+ | `z.enum([...])` | None |
| Preferred Demo Format | `<select>` | `demoFormat` | Yes | "Select one..." / Video call (30 min), In-person (if available), Self-guided tour | `z.enum([...])` | None |
| Message | `<textarea>` | `message` | No | "Anything specific you'd like to see in the demo?" | `z.string().max(500, "Message must be under 500 characters.").optional()` | None |

#### Back Link (Step 2)

```html
<button type="button" class="text-body-sm font-medium text-primary-700 hover:text-primary-800
  inline-flex items-center gap-1.5 mb-6 transition-colors duration-fast">
  <ArrowLeft class="h-4 w-4" />
  Back to Step 1
</button>
```

Clicking "Back" returns to Step 1 with previously entered values preserved. Reverse animation: Step 2 fades out, Step 1 fades in.

#### Submit Button (Step 2)

| Property | Value |
|----------|-------|
| Label | "Request Your Demo" |
| Variant | `primary` |
| Size | `lg` (52px height) |
| Width | Full width (`w-full`) |
| Icon | `Send` (16px, right side) |
| Loading state | `aria-busy="true"`, label changes to "Submitting...", spinner replaces icon, pointer events disabled |
| Disabled state | Active only when all required Step 2 fields pass validation |

#### Legal Disclaimer (Step 2)

Below the submit button:

```html
<p class="text-body-xs text-muted-foreground text-center mt-4">
  By submitting, you agree to our
  <a href="/legal/privacy" class="text-primary-700 hover:underline">Privacy Policy</a>
  and <a href="/legal/terms" class="text-primary-700 hover:underline">Terms of Service</a>.
</p>
```

#### Character Counter (Message Field)

Positioned below the textarea, right-aligned:

```html
<span class="text-body-xs text-muted-foreground">
  {currentLength} / 500
</span>
```

When `currentLength > 450`: text color transitions to `warning-600`.
When `currentLength >= 500`: text color transitions to `destructive`.

### 4.5 Field Styling (All Fields, Both Steps)

#### Input Base State

```css
bg-card
border border-border
rounded-md           /* radius-md: 8px */
h-11                 /* 44px -- meets touch target */
px-4
text-body-md text-foreground
placeholder:text-muted-foreground
transition-all duration-fast
```

#### Input Focus State

```css
border-ring          /* #365462 */
ring-2 ring-ring/20
shadow-inner
outline-none
```

Transition: 150ms, `ease-default`.

#### Input Error State

```css
border-destructive   /* #c1253e */
ring-2 ring-destructive/20
```

Error message below field:

```html
<p id="{fieldName}-error" class="text-body-xs text-destructive mt-1.5 flex items-center gap-1">
  <AlertCircle class="h-3.5 w-3.5 shrink-0" />
  {error message}
</p>
```

Each field uses `aria-describedby="{fieldName}-error"` when error is present. Error container uses `aria-live="polite"` so screen readers announce errors as they appear.

#### Input with Leading Icon

```html
<div class="relative">
  <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground
    pointer-events-none" />
  <input class="pl-10 ..." />
</div>
```

Icon color: `muted-foreground` (`#4d5153`). Icon does not interfere with focus or click targets.

#### Select Styling

Uses shadcn/ui Select component for consistent cross-browser styling:

```css
bg-card
border border-border
rounded-md
h-11
px-4
text-body-md text-foreground
```

Chevron indicator: `ChevronDown` (16px) in `muted-foreground`, right-aligned. Rotates 180deg on open.

Dropdown panel: `bg-popover border border-border rounded-lg shadow-md`, items `px-3 py-2 hover:bg-accent rounded-md cursor-pointer`.

#### Textarea Styling

```css
bg-card
border border-border
rounded-md
px-4 py-3
text-body-md text-foreground
placeholder:text-muted-foreground
min-h-[120px]
resize-y
max-h-[240px]
```

#### Label Styling

```html
<label for="{fieldId}" class="text-body-sm font-medium text-foreground mb-1.5 block">
  {Label Text}
  <span class="text-destructive ml-0.5">*</span>  <!-- if required -->
</label>
```

### 4.6 Hidden Fields

#### Honeypot Field

```html
<div class="absolute -left-[9999px]" aria-hidden="true" tabindex="-1">
  <label for="website">Website</label>
  <input type="text" id="website" name="website" autocomplete="off" tabindex="-1" />
</div>
```

If this field contains any value on submission, the form silently "succeeds" (shows success state) but does NOT save the data or send notifications. This traps bots without revealing the protection mechanism.

#### Cloudflare Turnstile

Invisible mode. No visible widget. The Turnstile script generates a token on page load that is validated server-side during the form submission Server Action.

```html
<div class="cf-turnstile" data-sitekey="{TURNSTILE_SITE_KEY}" data-theme="light"
  data-size="invisible" />
```

### 4.7 Form Validation Strategy

| Phase | Trigger | Scope | Feedback |
|-------|---------|-------|----------|
| Field-level | `onBlur` (first touch) then `onChange` (subsequent) | Single field | Inline error below field |
| Step-level | "Continue" button click (Step 1) | All Step 1 fields | All errors shown simultaneously |
| Submission | "Request Your Demo" click (Step 2) | All fields (both steps) | All errors, focus moved to first error field |
| Server-side | Server Action execution | Full Zod schema + Turnstile token | If server validation fails, show error banner at top of form with `AlertCircle` icon |

**Validation library**: Zod on both client and server. Shared schema in `lib/schemas/demo-request.ts`.

**Focus management on error**: When validation fails on submit, focus is programmatically moved to the first field with an error. The error message is announced via `aria-live="polite"`.

---

## 5. Section 3: Trust Sidebar

### 5.1 Container

```
lg:sticky lg:top-24
```

The sidebar is sticky on desktop, remaining visible as the form scrolls. It anchors to the top of the form card and follows the viewport.

| Property | Value |
|----------|-------|
| Position | `lg:sticky lg:top-24` (sticks 96px from top -- below sticky header) |
| Background | Transparent (no card wrapper -- content floats alongside form) |
| Column span | `lg:col-span-5` |

### 5.2 What to Expect Panel

```
+----------------------------------+
|  WHAT TO EXPECT                  |
|                                  |
|  (1)  We'll confirm your demo   |
|       within 1 business day.     |
|                                  |
|  (2)  Your demo will be          |
|       personalized for your      |
|       organization type.         |
|                                  |
|  (3)  We'll walk through a real  |
|       safety binder for your     |
|       kind of trip.              |
|                                  |
|  (4)  No pressure. No            |
|       obligation. Just clarity.  |
+----------------------------------+
```

#### Structure

```html
<div class="space-y-6">
  <h2 class="text-heading-sm text-foreground">What to Expect</h2>
  <ol class="space-y-5" role="list">
    <!-- Repeat for each item -->
    <li class="flex gap-4 items-start">
      <span class="flex-shrink-0 h-8 w-8 rounded-full bg-primary-50 text-primary-700
        text-body-sm font-semibold flex items-center justify-center">
        1
      </span>
      <p class="text-body-md text-muted-foreground pt-1">
        We'll confirm your demo within <strong class="text-foreground font-medium">1 business day</strong>.
      </p>
    </li>
  </ol>
</div>
```

#### Items

| # | Text | Bold emphasis |
|---|------|---------------|
| 1 | "We'll confirm your demo within 1 business day." | "1 business day" |
| 2 | "Your demo will be personalized for your organization type." | "personalized" |
| 3 | "We'll walk through a real safety binder for your kind of trip." | "real safety binder" |
| 4 | "No pressure. No obligation. Just clarity." | "Just clarity" |

### 5.3 Trust Proof Points

Below the "What to Expect" panel, separated by a `Divider variant="section"` with `my-8`.

```
+----------------------------------+
|  TRUSTED PLATFORM                |
|                                  |
|  [Shield]  5 Government Intel    |
|            Sources               |
|                                  |
|  [Clipboard] 17 Safety Review    |
|              Sections            |
|                                  |
|  [Clock]   3-5 Day Turnaround   |
|                                  |
|  [Lock]    AES-256 Encryption    |
|                                  |
|  [FileText] SHA-256 Evidence     |
|             Chain                |
+----------------------------------+
```

#### Structure

```html
<div class="space-y-4">
  <h3 class="text-eyebrow text-primary-700">Trusted Platform</h3>
  <ul class="space-y-4" role="list">
    <!-- Repeat for each point -->
    <li class="flex items-center gap-3">
      <div class="flex-shrink-0 h-10 w-10 rounded-lg bg-primary-50
        flex items-center justify-center">
        <Shield class="h-5 w-5 text-primary-700" />
      </div>
      <div>
        <p class="text-body-sm font-semibold text-foreground">5</p>
        <p class="text-body-xs text-muted-foreground">Government Intel Sources</p>
      </div>
    </li>
  </ul>
</div>
```

#### Items

| Icon (Lucide) | Value | Label |
|----------------|-------|-------|
| `Shield` | 5 | Government Intel Sources |
| `ClipboardCheck` | 17 | Safety Review Sections |
| `Clock` | 3-5 Day | Turnaround |
| `Lock` | AES-256 | Encryption Standard |
| `FileText` | SHA-256 | Evidence Chain |

### 5.4 Security Assurance

Below the proof points, separated by `Divider variant="section"` with `my-8`.

```html
<div class="flex items-start gap-3 p-4 rounded-lg bg-primary-50 border border-primary-100">
  <Lock class="h-5 w-5 text-primary-700 flex-shrink-0 mt-0.5" />
  <div>
    <p class="text-body-sm font-medium text-foreground">Your data is secure</p>
    <p class="text-body-xs text-muted-foreground mt-1">
      SOC 2 compliant infrastructure. FERPA and GDPR ready.
      Your information is encrypted in transit and at rest.
    </p>
  </div>
</div>
```

### 5.5 Sidebar Animation

The sidebar content staggers in after the form card, using `staggerContainer` with each subsection (What to Expect, Proof Points, Security Assurance) entering at 100ms intervals via `fadeUp` (y: 16px, 300ms, enter easing).

---

## 6. Section 4: Alternative Paths

### 6.1 Position and Purpose

Centered below the form and sidebar area. Catches visitors who are not ready to commit to a demo and redirects them to lower-commitment engagement options. Reduces bounce by providing value-aligned exits.

### 6.2 Spacing

```css
mt-16 lg:mt-20
pb-24 lg:pb-32
```

### 6.3 Layout

```
+----------------------------------------------------------------------+
|                                                                      |
|               Not ready for a demo?                                  |
|                                                                      |
|  +-----------------+  +-----------------+  +-------------------+     |
|  | [FileText]      |  | [DollarSign]    |  | [MessageSquare]   |     |
|  | Download a      |  | View            |  | Contact Us        |     |
|  | Sample Binder   |  | Pricing         |  |                   |     |
|  | See what a real |  | Transparent     |  | Have a question   |     |
|  | binder looks    |  | per-student     |  | before booking?   |     |
|  | like.           |  | pricing.        |  | We're here.       |     |
|  +-----------------+  +-----------------+  +-------------------+     |
|                                                                      |
+----------------------------------------------------------------------+
```

#### Structure

```html
<section class="text-center" aria-labelledby="alt-paths-heading">
  <h2 id="alt-paths-heading" class="text-heading-sm text-foreground mb-8">
    Not ready for a demo?
  </h2>
  <div class="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
    <!-- Cards -->
  </div>
</section>
```

#### Cards

Each card is a link card using the standard FeatureCard interaction pattern (entire card clickable, hover shadow elevation).

| Icon (Lucide) | Title | Description | Destination |
|----------------|-------|-------------|-------------|
| `FileText` | Download a Sample Binder | "See what a real safety binder looks like for your trip type." | `/resources/sample-binders` |
| `DollarSign` | View Pricing | "Transparent per-student pricing. No hidden fees." | `/pricing` |
| `MessageSquare` | Contact Us | "Have a question before booking? We're here." | `/contact` |

#### Card Styling

```css
bg-card rounded-xl border border-border p-6
shadow-card
hover:shadow-card-hover hover:-translate-y-0.5
transition-all duration-normal
text-left
group
```

Icon container: `h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center mb-4`. Icon: `h-5 w-5 text-primary-700`.

Title: `.text-heading-sm text-foreground group-hover:text-primary-700 transition-colors duration-fast`.

Description: `.text-body-sm text-muted-foreground mt-2`.

---

## 7. Success State

### 7.1 Trigger

The success state replaces the entire form card content (not the sidebar) after a successful Server Action response. The success state is rendered in-page; there is no redirect to a `/demo/thank-you` URL.

### 7.2 Transition

Form card content fades out (`fadeIn` reverse, 200ms). Success content fades in (`fadeUp`, y: 20px, 400ms, spring easing). Card container dimensions animate smoothly (`transition-all duration-moderate`).

### 7.3 Success Card Content

```
+---------------------------------------------------------------+
|                                                                |
|                        [Check Circle]                          |
|                         (primary-500)                          |
|                                                                |
|                "We've Received Your Request"                   |
|                                                                |
|       Expect to hear from us within 1 business day.            |
|       We'll personalize your demo for {organizationType}.      |
|                                                                |
|  +-----------------------------------------------------------+|
|  |  WHAT HAPPENS NEXT                                        ||
|  |                                                            ||
|  |  [1]  A SafeTrekr team member will email you at           ||
|  |       {email} to confirm your demo time.                  ||
|  |                                                            ||
|  |  [2]  We'll prepare a personalized safety binder          ||
|  |       example for your organization type.                  ||
|  |                                                            ||
|  |  [3]  Your {demoFormat} demo will take about 30 minutes.  ||
|  +-----------------------------------------------------------+|
|                                                                |
|  [ Download a Sample Binder  ]     [ Return to Homepage  ]    |
|  (primary, lg)                     (secondary, lg)             |
|                                                                |
+---------------------------------------------------------------+
```

### 7.4 Content Specification

| Element | Content | Style |
|---------|---------|-------|
| Icon | `CircleCheck` | `h-16 w-16 text-primary-500 mx-auto` with `statusPulse` animation (scale 0 to 1.4 to 1, 600ms, spring) |
| Headline | "We've Received Your Request" | `.text-heading-lg text-foreground text-center mt-6` |
| Body | "Expect to hear from us within 1 business day. We'll personalize your demo for {organizationType}." | `.text-body-lg text-muted-foreground text-center mt-3 max-w-[45ch] mx-auto` |
| Next steps card | "What Happens Next" panel | `bg-primary-50 rounded-xl p-6 mt-8` |
| Next steps heading | "What Happens Next" | `.text-heading-sm text-foreground mb-4` |
| Step items | Numbered list (see below) | Same pattern as "What to Expect" sidebar |
| Primary CTA | "Download a Sample Binder" | `Button variant="primary" size="lg"`, links to `/resources/sample-binders` |
| Secondary CTA | "Return to Homepage" | `Button variant="secondary" size="lg"`, links to `/` |

**Next Steps Items** (personalized with submitted data):

| # | Text |
|---|------|
| 1 | "A SafeTrekr team member will email you at **{email}** to confirm your demo time." |
| 2 | "We'll prepare a personalized safety binder example for your organization type." |
| 3 | "Your **{demoFormat}** demo will take about 30 minutes." |

Where `{email}`, `{organizationType}`, and `{demoFormat}` are interpolated from the submitted form data.

### 7.5 CTA Button Layout

```html
<div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
  <Button variant="primary" size="lg" asChild>
    <Link href="/resources/sample-binders">Download a Sample Binder</Link>
  </Button>
  <Button variant="secondary" size="lg" asChild>
    <Link href="/">Return to Homepage</Link>
  </Button>
</div>
```

### 7.6 Sidebar Behavior on Success

The trust sidebar remains visible but the "What to Expect" heading changes to "Thank You" and the numbered list is replaced with a brief message:

```html
<div class="space-y-4">
  <h2 class="text-heading-sm text-foreground">Thank You</h2>
  <p class="text-body-md text-muted-foreground">
    You're one step closer to protecting every trip with professional safety review.
  </p>
</div>
```

The Trust Proof Points and Security Assurance panels remain unchanged.

---

## 8. Form Submission Flow

### 8.1 Complete Sequence

```
1. User clicks "Request Your Demo"
2. Client-side: Validate all fields (Step 1 + Step 2) via Zod
3. Client-side: If validation fails -> show inline errors, focus first error, STOP
4. Client-side: Set button to loading state (aria-busy, spinner, "Submitting...")
5. Client-side: Check honeypot -> if filled, show success state silently, DO NOT submit
6. Server Action: Validate all fields again via Zod (same schema)
7. Server Action: Verify Cloudflare Turnstile token via API
8. Server Action: If Turnstile fails -> return error, show error banner on form
9. Server Action: Save to Supabase `form_submissions` table:
   - form_type: 'demo_request'
   - data: { fullName, email, organizationName, organizationType, estimatedTrips, demoFormat, message }
   - metadata: { utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer, page_url }
   - created_at: NOW()
10. Server Action: Send notification email via Resend to sales team
11. Server Action: Return success response
12. Client-side: Fire Plausible event `demo_request` with props:
    - organization_type: {organizationType}
    - estimated_trips: {estimatedTrips}
    - demo_format: {demoFormat}
13. Client-side: Transition to success state
```

### 8.2 Error Handling

| Error Type | Display | Recovery |
|------------|---------|----------|
| Client validation failure | Inline errors below each failed field. Focus moves to first error. | User corrects and resubmits. |
| Turnstile verification failure | Error banner at top of form: "We couldn't verify you're human. Please refresh and try again." with `AlertCircle` icon. | User refreshes page. |
| Server validation failure | Error banner at top of form with specific message. | User corrects and resubmits. |
| Network error | Toast notification: "Something went wrong. Please try again." with retry button. | User clicks retry or refreshes. |
| Supabase write failure | Form shows success to user (never block conversion). Error logged server-side. Sales email still attempted. | Ops team resolves from server logs. |

### 8.3 Error Banner Specification

Appears at the top of the form card, above the step indicator:

```html
<div role="alert" class="flex items-start gap-3 p-4 mb-6 rounded-lg
  bg-destructive/5 border border-destructive/20">
  <AlertCircle class="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
  <div>
    <p class="text-body-sm font-medium text-destructive">{Error headline}</p>
    <p class="text-body-xs text-muted-foreground mt-1">{Error detail}</p>
  </div>
</div>
```

---

## 9. Responsive Behavior

### 9.1 Breakpoint Adaptations

| Breakpoint | Layout Changes |
|------------|----------------|
| base (< 640px) | Single column. Form card full width. Sidebar stacks below form card. All form fields single column. CTAs stack vertically. Alternative path cards stack vertically. |
| sm (640px) | Minor padding adjustments. Alternative path cards in 3-column grid. Success CTAs go horizontal. |
| md (768px) | Step 2 paired fields (Organization Type + Estimated Trips) go side-by-side in 2-column grid. Sidebar still stacks below form. |
| lg (1024px) | 12-column grid activates. Form card 7 cols, sidebar 5 cols side-by-side. Sidebar becomes sticky. Full desktop spacing. |
| xl (1280px) | Max container width reached (1280px). Content centered with growing side margins. |
| 2xl (1536px) | Generous white space. No layout changes beyond xl. |

### 9.2 Mobile Layout (< 1024px)

```
+============================================+
|  [SiteHeader]                              |
+============================================+
|                                            |
|  [Eyebrow]                                 |
|  [Headline -- centered]                    |
|  [Sub-headline -- centered]                |
|                                            |
|  +--------------------------------------+  |
|  |  FORM CARD (full width)              |  |
|  |  [Step Indicator]                    |  |
|  |  [Fields -- single column]           |  |
|  |  [Submit Button -- full width]       |  |
|  +--------------------------------------+  |
|                                            |
|  +--------------------------------------+  |
|  |  TRUST SIDEBAR (stacked below)       |  |
|  |  [What to Expect]                    |  |
|  |  [Trust Proof Points]               |  |
|  |  [Security Assurance]               |  |
|  +--------------------------------------+  |
|                                            |
|  [Alternative Paths -- stacked cards]      |
|                                            |
+============================================+
|  [SiteFooter]                              |
+============================================+
```

### 9.3 Tablet Layout (768px - 1023px)

Same as mobile but with side-by-side paired fields in Step 2 (Organization Type + Estimated Trips row). Alternative path cards in 3-column grid. Larger section padding.

---

## 10. Accessibility Specification

### 10.1 Page-Level Requirements

| Requirement | Implementation |
|-------------|----------------|
| Page title | `<title>Request a Demo - SafeTrekr</title>` |
| Meta description | `<meta name="description" content="Schedule a personalized demo of SafeTrekr. See exactly what a trip safety binder looks like for your organization. No obligation.">` |
| Skip navigation | Standard skip-nav link targets `#main-content` wrapping the form area |
| Landmark structure | `<header>` (SiteHeader), `<main id="main-content">` (page content), `<footer>` (SiteFooter) |
| Heading hierarchy | `<h1>` (hero headline), `<h2>` (What to Expect, Alternative Paths), `<h3>` (Trust proof heading, individual alt-path cards) |
| Language | `lang="en"` on `<html>` |
| Viewport | `<meta name="viewport" content="width=device-width, initial-scale=1">` |

### 10.2 Form Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Labels | Every `<input>`, `<select>`, and `<textarea>` has an associated `<label>` with `for` matching `id`. No placeholder-only labels. |
| Required indicators | Visual asterisk (`*`) in `text-destructive`. `aria-required="true"` on required fields. |
| Error association | `aria-describedby="{fieldName}-error"` on fields with errors. Error container includes `role="alert"` or `aria-live="polite"`. |
| Error announcement | Inline errors use `aria-live="polite"` so screen readers announce them without interrupting the current task. |
| Submit state | Button uses `aria-busy="true"` during submission. `aria-disabled="true"` when form is invalid. |
| Step transitions | When transitioning between steps, focus is moved to the first field of the new step. `aria-live="polite"` region announces "Step 2 of 2: Tell Us More." |
| Focus order | Logical tab order: Step indicator (not focusable) -> fields top-to-bottom, left-to-right -> submit button -> legal links. |
| Focus visible | 2px `ring` color (`#365462`), 2px offset on all interactive elements. |
| Touch targets | All inputs, selects, and buttons >= 44px height. |
| Autocomplete | `email`: `autocomplete="email"`. `fullName`: `autocomplete="name"`. `organizationName`: `autocomplete="organization"`. |
| Honeypot | `aria-hidden="true"` and `tabindex="-1"` -- completely invisible to assistive technology. |
| Success state | `role="status"` on success container. `aria-live="polite"` announces "We've received your request." Focus moves to success heading. |

### 10.3 Keyboard Navigation

| Key | Behavior |
|-----|----------|
| Tab | Moves focus forward through form fields, buttons, and links in logical order. |
| Shift+Tab | Moves focus backward. |
| Enter | Submits the current step (triggers "Continue" on Step 1, "Request Your Demo" on Step 2). |
| Space | Activates buttons. Opens select dropdowns. |
| Escape | Closes open select dropdowns. |
| Arrow Up/Down | Navigates options within an open select dropdown. |

### 10.4 Screen Reader Announcements

| Event | Announcement |
|-------|--------------|
| Page load | "Request a Demo - SafeTrekr. Main content: See How SafeTrekr Protects Every Trip." |
| Step 1 complete | "Step 2 of 2: Tell Us More. Please provide additional details." |
| Validation error | "{Field label}: {error message}" (via `aria-live="polite"`) |
| Form submitting | "Submitting your demo request." (via `aria-busy="true"` on button) |
| Submission success | "We've received your request. Expect to hear from us within 1 business day." (via `role="status"`) |
| Submission error | "Error: {error message}. Please try again." (via `role="alert"`) |

### 10.5 Reduced Motion

Under `prefers-reduced-motion: reduce`:
- All page entrance animations disabled (content renders at final state immediately)
- Step transitions are instant (no fade/slide)
- Success state check icon renders at final scale (no pulse)
- Hover state color changes retained; transforms removed
- Focus ring transitions retained (100ms max)

---

## 11. SEO and Meta

### 11.1 Head Tags

```html
<title>Request a Demo - SafeTrekr</title>
<meta name="description" content="Schedule a personalized demo of SafeTrekr. See exactly what a trip safety binder looks like for your organization. No obligation." />
<link rel="canonical" href="https://www.safetrekr.com/demo" />
<meta name="robots" content="index, follow" />

<!-- Open Graph -->
<meta property="og:title" content="See Your Safety Binder - Request a Demo | SafeTrekr" />
<meta property="og:description" content="Schedule a personalized walkthrough. We'll show you exactly what a safety binder looks like for your organization." />
<meta property="og:url" content="https://www.safetrekr.com/demo" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://www.safetrekr.com/og/demo.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="See Your Safety Binder - Request a Demo | SafeTrekr" />
<meta name="twitter:description" content="Schedule a personalized walkthrough. We'll show you exactly what a safety binder looks like for your organization." />
```

### 11.2 Structured Data

No JSON-LD on this page (conversion page -- no applicable schema type that adds search value).

---

## 12. Analytics Events

### 12.1 Plausible Events

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `demo_form_step1_complete` | User clicks "Continue" and Step 1 validates | `{ }` |
| `demo_form_step1_abandon` | User leaves page after interacting with Step 1 without completing | `{ fields_filled: number }` |
| `demo_form_step2_back` | User clicks "Back to Step 1" | `{ }` |
| `demo_request` | Successful form submission | `{ organization_type: string, estimated_trips: string, demo_format: string }` |
| `demo_form_error` | Validation or server error | `{ error_type: 'validation' \| 'turnstile' \| 'server' \| 'network' }` |
| `demo_alt_path_click` | User clicks an alternative path card | `{ destination: 'sample-binders' \| 'pricing' \| 'contact' }` |
| `demo_success_cta_click` | User clicks a CTA on the success state | `{ destination: 'sample-binders' \| 'homepage' }` |

### 12.2 UTM Parameter Capture

On page load, extract UTM parameters from the URL query string and store in hidden form state:

```typescript
interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}
```

These are submitted alongside form data and stored in the `metadata` column of `form_submissions`.

---

## 13. Performance Requirements

| Metric | Budget | Notes |
|--------|--------|-------|
| LCP | < 1.5s | Hero headline is the LCP element. No images above the fold. |
| CLS | < 0.05 | Form card dimensions are stable. No layout shift from Turnstile. |
| INP | < 100ms | Form interactions must respond within 100ms. |
| Total page weight | < 200KB | No images on this page. Fonts + JS + CSS only. |
| JS bundle contribution | < 20KB | Form component + Zod schema + Turnstile script (lazy). |
| Turnstile script | Lazy-loaded | Load Turnstile script after initial paint to avoid blocking. |
| Lighthouse Performance | >= 95 | CI gate. |
| Lighthouse Accessibility | >= 95 (target 100) | CI gate. |

---

## 14. Component File Structure

```
components/
  marketing/
    demo-request-form.tsx          # DemoRequestForm organism (Steps 1+2 + Success)
    demo-request-trust-sidebar.tsx # Trust sidebar (What to Expect + Proof Points + Security)
    demo-request-success.tsx       # Success state content (extracted for testing)
    demo-request-alt-paths.tsx     # Alternative paths section

app/
  demo/
    page.tsx                       # Page component (assembles hero + form + sidebar + alt paths)
    actions.ts                     # Server Action: validateAndSubmitDemo()

lib/
  schemas/
    demo-request.ts                # Shared Zod schema (client + server)
```

---

## 15. Implementation Checklist

### P0 (Must have for launch)

- [ ] Hero headline area with eyebrow, headline, sub-headline
- [ ] Form card with Step 1 (2 fields: email, organization name)
- [ ] Form card with Step 2 (5 fields: full name, org type, trips, demo format, message)
- [ ] Step indicator with progress bars
- [ ] Back navigation between steps
- [ ] Client-side Zod validation (blur + submit)
- [ ] Server-side Zod validation in Server Action
- [ ] Cloudflare Turnstile integration (invisible mode)
- [ ] Honeypot hidden field
- [ ] Supabase form_submissions write
- [ ] Resend notification email to sales
- [ ] Success state with personalized next steps
- [ ] Trust sidebar: What to Expect panel
- [ ] Trust sidebar: Trust Proof Points
- [ ] Trust sidebar: Security Assurance
- [ ] Alternative paths section (3 cards)
- [ ] Full responsive layout (base through 2xl)
- [ ] WCAG 2.2 AA compliance (all items in Section 10)
- [ ] Plausible `demo_request` event
- [ ] UTM parameter capture
- [ ] `<title>`, `<meta description>`, canonical URL, OG tags

### P1 (Should have for launch)

- [ ] Entrance animations (Section 3.4)
- [ ] Step transition animations
- [ ] Success state check icon pulse animation
- [ ] `prefers-reduced-motion` fallbacks
- [ ] Plausible step-level events (step1_complete, step1_abandon, step2_back)
- [ ] Character counter on message textarea
- [ ] Sidebar sticky behavior on desktop
- [ ] Error banner for server/Turnstile failures
- [ ] Toast notification for network errors

### P2 (Nice to have post-launch)

- [ ] A/B test: 2-field Step 1 vs 3-field Step 1 (adding Full Name)
- [ ] Auto-detect organization type from email domain
- [ ] Pre-fill email from query parameter (`?email=...` from nurture emails)
- [ ] Confetti or micro-celebration animation on success (with reduced-motion respect)
- [ ] Social proof: "X organizations requested a demo this month" (only if real data available)

---

## 16. ASCII Wireframe: Desktop (1280px)

```
+==========================================================================+
| [Logo]  Platform v  Solutions v  How It Works  Pricing  Resources v      |
|                                  For Procurement  Log In  [Get a Demo]   |
+==========================================================================+
|                                                                          |
|                                                                          |
|                       PERSONALIZED DEMO                                  |
|                                                                          |
|              See How SafeTrekr Protects                                   |
|                   Every Trip.                                            |
|                                                                          |
|           Schedule a personalized walkthrough of the                     |
|            SafeTrekr platform. We'll show you exactly                    |
|          what a safety binder looks like for your org.                   |
|                                                                          |
|  +------------------------------------+   +----------------------------+ |
|  |                                    |   |                            | |
|  |  Step 1 of 2: Basic Info  [===--]  |   |  What to Expect            | |
|  |                                    |   |                            | |
|  |  Work Email *                      |   |  (1) We'll confirm your    | |
|  |  +------------------------------+ |   |      demo within 1          | |
|  |  | [M] you@organization.com     | |   |      business day.          | |
|  |  +------------------------------+ |   |                            | |
|  |                                    |   |  (2) Your demo will be     | |
|  |  Organization Name *              |   |      personalized for your  | |
|  |  +------------------------------+ |   |      organization type.     | |
|  |  | [B] e.g. Springfield USD     | |   |                            | |
|  |  +------------------------------+ |   |  (3) We'll walk through a  | |
|  |                                    |   |      real safety binder     | |
|  |  [ Continue                  -> ] |   |      for your kind of trip. | |
|  |                                    |   |                            | |
|  +------------------------------------+   |  (4) No pressure. No       | |
|                                           |      obligation. Just       | |
|                                           |      clarity.               | |
|                                           |                            | |
|                                           |  --------------------------| |
|                                           |                            | |
|                                           |  TRUSTED PLATFORM          | |
|                                           |  [S] 5 Govt Intel Sources  | |
|                                           |  [C] 17 Review Sections    | |
|                                           |  [K] 3-5 Day Turnaround   | |
|                                           |  [L] AES-256 Encryption   | |
|                                           |  [F] SHA-256 Evidence      | |
|                                           |                            | |
|                                           |  --------------------------| |
|                                           |  [L] Your data is secure   | |
|                                           |      SOC 2, FERPA, GDPR    | |
|                                           +----------------------------+ |
|                                                                          |
|                         Not ready for a demo?                            |
|                                                                          |
|  +------------------+  +------------------+  +---------------------+     |
|  | [F] Download a   |  | [$] View         |  | [M] Contact Us      |     |
|  |   Sample Binder  |  |   Pricing        |  |                     |     |
|  | See what a real  |  | Transparent      |  | Have a question     |     |
|  | binder looks     |  | per-student      |  | before booking?     |     |
|  | like.            |  | pricing.         |  | We're here.         |     |
|  +------------------+  +------------------+  +---------------------+     |
|                                                                          |
+==========================================================================+
| [Footer]                                                                 |
+==========================================================================+
```

## 17. ASCII Wireframe: Step 2 State

```
+------------------------------------+
|                                    |
|  Step 2 of 2: Tell Us More  [===] |
|                                    |
|  [<- Back to Step 1]               |
|                                    |
|  Full Name *                       |
|  +------------------------------+  |
|  | [U] Your full name           |  |
|  +------------------------------+  |
|                                    |
|  +-------------+  +--------------+ |
|  | Org Type *  |  | Annual Trips*| |
|  | [Select  v] |  | [Select   v] | |
|  +-------------+  +--------------+ |
|                                    |
|  Preferred Demo Format *           |
|  +------------------------------+  |
|  | [Select one...            v] |  |
|  +------------------------------+  |
|                                    |
|  Message (optional)                |
|  +------------------------------+  |
|  | Anything specific you'd     |  |
|  | like to see?                |  |
|  |                              |  |
|  +------------------------------+  |
|                          0 / 500   |
|                                    |
|  [ Request Your Demo           ]   |
|                                    |
|  By submitting, you agree to our   |
|  Privacy Policy and Terms.         |
+------------------------------------+
```

## 18. ASCII Wireframe: Success State

```
+------------------------------------+   +----------------------------+
|                                    |   |                            |
|            [Check Icon]            |   |  Thank You                 |
|           (green, large)           |   |                            |
|                                    |   |  You're one step closer    |
|   "We've Received Your Request"    |   |  to protecting every trip  |
|                                    |   |  with professional safety  |
|   Expect to hear from us within    |   |  review.                   |
|   1 business day. We'll            |   |                            |
|   personalize your demo for        |   |  --------------------------| |
|   {orgType}.                       |   |                            |
|                                    |   |  TRUSTED PLATFORM          |
|   +------------------------------+ |   |  [S] 5 Govt Intel Sources  |
|   | WHAT HAPPENS NEXT            | |   |  [C] 17 Review Sections    |
|   |                              | |   |  [K] 3-5 Day Turnaround   |
|   | (1) A SafeTrekr team member  | |   |  [L] AES-256 Encryption   |
|   |     will email you at        | |   |  [F] SHA-256 Evidence      |
|   |     {email} to confirm.      | |   |                            |
|   |                              | |   |  --------------------------| |
|   | (2) We'll prepare a          | |   |  [L] Your data is secure   |
|   |     personalized binder.     | |   |      SOC 2, FERPA, GDPR    |
|   |                              | |   +----------------------------+
|   | (3) Your {format} demo       | |
|   |     will take ~30 minutes.   | |
|   +------------------------------+ |
|                                    |
|  [Download Sample Binder]          |
|  [Return to Homepage]              |
|                                    |
+------------------------------------+
```

## 19. ASCII Wireframe: Mobile (375px)

```
+==============================+
| [Logo]              [Menu]   |
+==============================+
|                              |
|     PERSONALIZED DEMO        |
|                              |
|  See How SafeTrekr           |
|  Protects Every Trip.        |
|                              |
|  Schedule a personalized     |
|  walkthrough of the          |
|  SafeTrekr platform.         |
|                              |
| +---------------------------+|
| | Step 1 of 2     [===--]  ||
| |                           ||
| | Work Email *              ||
| | +------------------------+||
| | | you@org.com            |||
| | +------------------------+||
| |                           ||
| | Organization Name *      ||
| | +------------------------+||
| | | e.g. Springfield USD   |||
| | +------------------------+||
| |                           ||
| | [ Continue          -> ] ||
| +---------------------------+|
|                              |
| +---------------------------+|
| | What to Expect            ||
| |                           ||
| | (1) Confirm within 1 day ||
| | (2) Personalized demo    ||
| | (3) Real safety binder   ||
| | (4) No obligation        ||
| |                           ||
| | ------------------------ ||
| |                           ||
| | TRUSTED PLATFORM         ||
| | 5 Govt Intel Sources     ||
| | 17 Review Sections       ||
| | 3-5 Day Turnaround       ||
| | AES-256 Encryption       ||
| | SHA-256 Evidence Chain   ||
| |                           ||
| | [Your data is secure]    ||
| +---------------------------+|
|                              |
| Not ready for a demo?       |
|                              |
| +---------------------------+|
| | Download a Sample Binder  ||
| +---------------------------+|
| +---------------------------+|
| | View Pricing              ||
| +---------------------------+|
| +---------------------------+|
| | Contact Us                ||
| +---------------------------+|
|                              |
+==============================+
| [Footer]                     |
+==============================+
```

---

## 20. Design Tokens Reference (Page-Specific)

All tokens referenced in this specification are defined in the canonical Design System (DESIGN-SYSTEM.md). This section provides a quick reference for the tokens most relevant to this page.

### Colors Used on This Page

| Token | Hex | Usage on this page |
|-------|-----|-------------------|
| `background` | `#e7ecee` | Page canvas |
| `foreground` | `#061a23` | Headlines, labels, strong text |
| `card` | `#f7f8f8` | Form card surface, input backgrounds |
| `card-foreground` | `#061a23` | Text on card |
| `border` | `#b8c3c7` | Card borders, input borders, dividers |
| `muted-foreground` | `#4d5153` | Sub-headlines, descriptions, placeholders |
| `ring` | `#365462` | Focus rings |
| `primary-50` | `#f1f9f4` | Number circles bg, icon containers bg, success next-steps bg |
| `primary-100` | `#e0f1e6` | Security assurance card border |
| `primary-500` | `#4ca46e` | Step progress bars (active), success check icon |
| `primary-600` | `#3f885b` | Submit button background |
| `primary-700` | `#33704b` | Eyebrow text, link text, icon colors, label accents |
| `destructive` | `#c1253e` | Error borders, error text, required asterisks |

### Typography Used on This Page

| Class | Where used |
|-------|------------|
| `.text-display-md` | Hero headline |
| `.text-heading-lg` | Success state headline |
| `.text-heading-sm` | Section headings (What to Expect, Alt Paths, Next Steps) |
| `.text-body-lg` | Hero sub-headline, success body |
| `.text-body-md` | Form field text, sidebar descriptions |
| `.text-body-sm` | Labels, step indicator, trust point values, back link |
| `.text-body-xs` | Error messages, legal disclaimer, character counter, trust point labels |
| `.text-eyebrow` | "PERSONALIZED DEMO", "TRUSTED PLATFORM" |

### Spacing Constants

| Location | Value |
|----------|-------|
| Hero top padding (desktop) | `pt-24` (96px) |
| Hero to form gap | `pb-12` (48px) |
| Form card internal padding | `p-10` (40px) desktop, `p-8` (32px) mobile |
| Form field vertical gap | `space-y-5` (20px) |
| Label to input gap | `mb-1.5` (6px) |
| Error message top gap | `mt-1.5` (6px) |
| Sidebar section gaps | `space-y-6` (24px) inside panels, `my-8` (32px) between panels |
| Alt paths top margin | `mt-16` (64px) mobile, `mt-20` (80px) desktop |
| Page bottom padding | `pb-24` (96px) mobile, `pb-32` (128px) desktop |

---

*This mockup specification is implementation-ready and references the canonical Design System (DESIGN-SYSTEM.md) and Information Architecture (INFORMATION-ARCHITECTURE.md). All tokens, components, and patterns conform to the SafeTrekr design system. No implementation decision should be made outside these three documents.*
