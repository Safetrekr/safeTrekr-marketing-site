# Mockup Specification: Procurement Hub (`/procurement`) & Security and Trust (`/security`)

**Version**: 1.0
**Date**: 2026-03-24
**Status**: READY FOR IMPLEMENTATION
**Design System Reference**: `DESIGN-SYSTEM.md` v1.0
**IA Reference**: `INFORMATION-ARCHITECTURE.md` Sections 1.1, 2.3, 4.2, 4.5

---

# PAGE 1: PROCUREMENT HUB (`/procurement`)

**Page Type**: Core Page (SSG)
**Hierarchy Level**: L1
**Canonical URL**: `https://www.safetrekr.com/procurement`
**Redirects**: `/for-procurement` (301), `/vendor-info` (301)

---

## Page Metadata

### SEO

| Property | Value |
|----------|-------|
| `<title>` | `For Procurement -- Vendor Documentation and Resources \| SafeTrekr` |
| `meta description` | `Everything your procurement team needs to evaluate and purchase SafeTrekr. W-9, security questionnaire, contract templates, DPA, insurance certificate, and SOC 2 report. Response within 4 hours.` |
| `og:title` | `For Procurement -- SafeTrekr` |
| `og:description` | Same as meta description |
| `og:type` | `website` |
| `og:image` | `/og/procurement.png` (1200x630, brand composition with document download grid overlay) |
| `canonical` | `https://www.safetrekr.com/procurement` |

### JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "SafeTrekr Procurement Hub",
  "description": "Vendor documentation, security questionnaire, W-9, contract templates, and procurement resources for evaluating SafeTrekr.",
  "url": "https://www.safetrekr.com/procurement",
  "mainEntity": {
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Does SafeTrekr offer volume or bulk pricing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. We offer tiered volume discounts: 5-9 trips (5% off), 10-24 trips (10% off), 25-49 trips (15% off), 50+ trips (20% off). Annual plans are available for organizations with predictable trip volumes. Contact us for a custom quote."
        }
      },
      {
        "@type": "Question",
        "name": "What payment methods does SafeTrekr accept?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accept credit card (Visa, Mastercard, American Express), ACH bank transfer, wire transfer, and purchase orders for qualified organizations. NET 30 terms are available for annual plans."
        }
      },
      {
        "@type": "Question",
        "name": "Can we use a purchase order?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. We accept purchase orders from schools, universities, churches, government entities, and businesses with established credit. Submit your PO to procurement@safetrekr.com and we will confirm within 1 business day."
        }
      },
      {
        "@type": "Question",
        "name": "Is SafeTrekr a registered vendor in state procurement systems?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We are actively registering in state procurement systems. If your state or district requires a specific registration, contact us and we will prioritize it. Current W-9 and insurance documentation is available for immediate download."
        }
      }
    ]
  }
}
```

---

## Dark Section Budget

This page uses **1 dark section** (well under the maximum of 2 excluding footer):

1. **Section 6: Conversion CTA Banner** -- `CTABand variant="dark"`. Rationale: terminal conversion prompt for procurement officers.

---

## Page-Level Design Register

| Register | Weight | Application on This Page |
|----------|--------|--------------------------|
| Polished Operational (70%) | Dominant | Document download grid, response time metrics, structured FAQ -- clean, scannable, utility-focused |
| Editorial Intelligence (20%) | Secondary | Hero headline and sub-headline -- slightly more open, authoritative tone |
| Watchtower Light (10%) | Minimal | Route divider between hero and response time section only |

This page is entirely utility-focused. Procurement officers arrive with a task: find vendor documentation, download it, and leave. The page should feel like opening a well-organized filing cabinet. No marketing flourish. No persuasion narrative. Just clarity, speed, and trust signals.

---

## Section-by-Section Specification

---

### Section 1: Hero

**Component**: Custom `ProcurementHero` (page-specific)
**Background**: `background` (#e7ecee) -- standard page canvas
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+------------------------------------------------------------------+
|  [background canvas]                                              |
|                                                                   |
|  EYEBROW: "FOR PROCUREMENT"                                      |
|                                                                   |
|  HEADLINE (text-display-lg):                                      |
|  Everything Your                                                  |
|  Procurement Team Needs.                                          |
|  In One Place.                                                    |
|                                                                   |
|  SUB-HEADLINE (text-body-lg, max-w-prose):                        |
|  W-9, security questionnaire, contract templates, insurance       |
|  certificate, and compliance documentation -- ready to            |
|  download. Procurement inquiries answered within 4 hours.         |
|                                                                   |
|  [ Download All Documents ]  [ Contact Procurement ]              |
|  (primary, lg)               (secondary, lg)                     |
|                                                                   |
+------------------------------------------------------------------+

Mobile (< lg):
Same stacked layout, fluid typography scales down.
CTAs stack vertically, full-width at < sm.
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | `pt-24 pb-16 lg:pt-32 lg:pb-24 xl:pt-36 xl:pb-28` | Hero scale from design system |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em]` | "FOR PROCUREMENT" |
| Eyebrow icon | `Building2` (Lucide), `h-3.5 w-3.5`, inline-left, `text-primary-700` | Institutional framing |
| Eyebrow margin | `mb-4 lg:mb-6` | 16-24px below eyebrow |
| Headline | `.text-display-lg text-foreground` | See copy below |
| Headline max-width | `max-w-[20ch]` | Constrains to ~20 characters per line |
| Headline margin | `mb-6 lg:mb-8` | 24-32px below headline |
| Sub-headline | `.text-body-lg text-muted-foreground max-w-prose` | See copy below |
| Sub-headline margin | `mb-8 lg:mb-10` | 32-40px below sub-headline |
| CTA container | `flex flex-col sm:flex-row gap-4` | Stack on mobile, side-by-side on sm+ |
| Primary CTA | `<Button variant="primary" size="lg">` | "Download All Documents" |
| Secondary CTA | `<Button variant="secondary" size="lg">` | "Contact Procurement" |
| Text alignment | `text-left` | Left-aligned on all breakpoints |

#### Copy

**Eyebrow**: `FOR PROCUREMENT`

**Headline**: `Everything Your Procurement Team Needs. In One Place.`

**Sub-headline**: `W-9, security questionnaire, contract templates, insurance certificate, and compliance documentation -- ready to download. Procurement inquiries answered within 4 hours.`

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Eyebrow | `fadeUp` | Page load | 0ms delay |
| Headline | `fadeUp` | Page load | 80ms stagger |
| Sub-headline | `fadeUp` | Page load | 160ms stagger |
| CTA buttons | `fadeUp` | Page load | 240ms stagger |

#### Accessibility

- `<section aria-labelledby="procurement-hero-heading">`
- Headline is `<h1 id="procurement-hero-heading">` -- the only `<h1>` on the page
- Sub-headline is `<p>`, not a heading
- "Download All Documents" triggers a ZIP download containing all 6 documents; `aria-label="Download all procurement documents as a ZIP file"`
- "Contact Procurement" scrolls to Section 5 contact form; `aria-label="Jump to procurement contact form"`

---

### Section 2: Response Time Commitment

**Component**: Custom `ResponseTimeCommitment` (page-specific)
**Background**: `card` (#f7f8f8) -- elevated surface band
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+------------------------------------------------------------------+
|  [card surface, full-width band]                                  |
|                                                                   |
|  +--max-w-3xl mx-auto (centered)--------------------------------+ |
|  |                                                               | |
|  |  EYEBROW: "OUR COMMITMENT"                   (centered)      | |
|  |                                                               | |
|  |  HEADLINE (text-heading-lg, centered):                        | |
|  |  We Respond Fast. Every Time.                                 | |
|  |                                                               | |
|  |  +------------------------+  +------------------------+      | |
|  |  |  [Clock icon]          |  |  [Zap icon]            |      | |
|  |  |                        |  |                        |      | |
|  |  |  GENERAL INQUIRIES     |  |  PROCUREMENT           |      | |
|  |  |  1 Business Day        |  |  4 Hours               |      | |
|  |  |                        |  |                        |      | |
|  |  |  Questions about the   |  |  W-9 requests, security|      | |
|  |  |  platform, pricing,    |  |  questionnaires, PO    |      | |
|  |  |  or getting started.   |  |  processing, contract  |      | |
|  |  |                        |  |  reviews, and vendor   |      | |
|  |  |                        |  |  registration.         |      | |
|  |  +------------------------+  +------------------------+      | |
|  |                                                               | |
|  |  BODY (text-body-md, centered, muted-foreground):             | |
|  |  Business hours: Monday-Friday, 8 AM - 6 PM CT.              | |
|  |  Procurement emails sent outside business hours are           | |
|  |  answered by 10 AM the next business day.                     | |
|  |                                                               | |
|  +---------------------------------------------------------------+ |
|                                                                   |
+------------------------------------------------------------------+

Mobile (< lg):
Two cards stack vertically, full width.
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section background | `bg-card` | #f7f8f8 full-width band |
| Section padding | `py-16 sm:py-20 md:py-24 lg:py-28` | Standard section |
| Content wrapper | `max-w-3xl mx-auto text-center` | Centered, constrained |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em]` | "OUR COMMITMENT" |
| Eyebrow margin | `mb-4` | 16px |
| Headline | `.text-heading-lg text-foreground` | 36px desktop / 24px mobile |
| Headline margin | `mb-10 lg:mb-12` | 40-48px below headline |
| Card grid | `grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8` | 2 cards side by side |
| Card | `bg-background rounded-xl border border-border p-8 text-center shadow-card` | Standard card treatment |
| Card icon container | `mx-auto h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4` | Centered icon block |
| Card icon | `h-6 w-6 text-primary-700` | Lucide icon |
| Card label | `.text-eyebrow text-muted-foreground mb-2` | "GENERAL INQUIRIES" / "PROCUREMENT" |
| Card value | `.text-display-md text-foreground font-display` | "1 Business Day" / "4 Hours" |
| Card value margin | `mb-4` | 16px below value |
| Card description | `.text-body-sm text-muted-foreground` | Supporting copy |
| Business hours note | `.text-body-sm text-muted-foreground mt-8` | Below card grid |

#### Copy

**Eyebrow**: `OUR COMMITMENT`

**Headline**: `We Respond Fast. Every Time.`

**General Inquiries Card**:
- Label: `GENERAL INQUIRIES`
- Value: `1 Business Day`
- Description: `Questions about the platform, pricing, or getting started.`
- Icon: `Clock` (Lucide)

**Procurement Card**:
- Label: `PROCUREMENT`
- Value: `4 Hours`
- Description: `W-9 requests, security questionnaires, PO processing, contract reviews, and vendor registration.`
- Icon: `Zap` (Lucide)

**Business hours note**: `Business hours: Monday -- Friday, 8 AM - 6 PM CT. Procurement emails sent outside business hours are answered by 10 AM the next business day.`

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Section | `fadeIn` | 20% viewport intersection | Entire band fades |
| Eyebrow + Headline | `fadeUp` | After section fade | 0ms, 80ms stagger |
| Left card | `cardReveal` | Stagger | 160ms |
| Right card | `cardReveal` | Stagger | 240ms |
| Business hours note | `fadeUp` | Stagger | 320ms |

#### Accessibility

- `<section aria-labelledby="response-commitment-heading">`
- Headline is `<h2 id="response-commitment-heading">`
- Cards use `<div role="group" aria-label="Response time: General inquiries, 1 business day">` and `<div role="group" aria-label="Response time: Procurement, 4 hours">`
- Time values are not animated -- static display for clarity and screen reader fidelity

---

### Section 3: Document Downloads Grid

**Component**: Custom `DocumentDownloadsGrid` (page-specific)
**Background**: `background` (#e7ecee) -- standard canvas
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+------------------------------------------------------------------+
|                                                                   |
|  EYEBROW: "VENDOR DOCUMENTATION"                 (centered)      |
|                                                                   |
|  HEADLINE (text-display-md, centered):                            |
|  Download. Review. Purchase.                                      |
|                                                                   |
|  SUB-TEXT (text-body-lg, centered, max-w-prose):                  |
|  Every document your procurement team typically requests --       |
|  ready for immediate download. No login required.                 |
|                                                                   |
|  +------------------+ +------------------+ +------------------+   |
|  | [PDF badge]      | | [PDF badge]      | | [DOCX badge]     |   |
|  |                  | |                  | |                  |   |
|  | W-9              | | Security         | | Contract         |   |
|  |                  | | Questionnaire    | | Template         |   |
|  | Current W-9 tax  | |                  | |                  |   |
|  | identification   | | Completed SIG    | | Master services  |   |
|  | form for vendor  | | Lite / CAIQ      | | agreement ready  |   |
|  | onboarding.      | | security         | | for redline.     |   |
|  |                  | | assessment.      | |                  |   |
|  | [ Download ]     | | [ Download ]     | | [ Download ]     |   |
|  +------------------+ +------------------+ +------------------+   |
|  +------------------+ +------------------+ +------------------+   |
|  | [PDF badge]      | | [PDF badge]      | | [PDF badge]      |   |
|  |                  | |                  | |                  |   |
|  | Data Processing  | | Insurance        | | SOC 2            |   |
|  | Agreement        | | Certificate      | | Report           |   |
|  |                  | |                  | |                  |   |
|  | Standard DPA     | | Certificate of   | | SOC 2 Type I     |   |
|  | covering FERPA,  | | general liability| | report (or       |   |
|  | COPPA, and GDPR  | | and professional | | current audit    |   |
|  | obligations.     | | indemnity.       | | status).         |   |
|  |                  | |                  | |                  |   |
|  | [ Download ]     | | [ Download ]     | | [ Download ]     |   |
|  +------------------+ +------------------+ +------------------+   |
|                                                                   |
+------------------------------------------------------------------+

Tablet (md - lg):
3x2 grid maintained with tighter gap.

Mobile (< md):
2x3 grid. Cards at < sm: 1 column stacked.
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | `py-16 sm:py-20 md:py-24 lg:py-32` | Standard section |
| Section heading alignment | `text-center` | Centered eyebrow, headline, sub-text |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em]` | "VENDOR DOCUMENTATION" |
| Eyebrow icon | `FileText` (Lucide), `h-3.5 w-3.5`, inline-left | Document framing |
| Eyebrow margin | `mb-4` | 16px |
| Headline | `.text-display-md text-foreground` | 44px desktop / 28px mobile |
| Headline margin | `mb-4 lg:mb-6` | 16-24px |
| Sub-text | `.text-body-lg text-muted-foreground max-w-prose mx-auto` | Centered descriptor |
| Sub-text margin | `mb-10 lg:mb-14` | 40-56px before grid |
| Card grid | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` | 3 columns desktop |
| Card | `bg-card rounded-xl border border-border p-6 shadow-card flex flex-col` | Standard card with flex column for button pinning |
| Card hover | `shadow-card-hover`, `translateY(-2px)`, `duration-normal` | Lift on hover |
| File type badge | `<Badge variant="secondary" size="sm">` | "PDF" / "DOCX" / "PDF" |
| Badge position | `self-start mb-4` | Top-left of card |
| Document title | `.text-heading-sm text-foreground mb-2` | Card heading |
| Document description | `.text-body-sm text-muted-foreground mb-6 flex-1` | Description, flex-1 pushes button down |
| Download button | `<Button variant="secondary" size="sm" className="w-full mt-auto">` | Full-width within card |
| Download icon | `Download` (Lucide), `h-4 w-4`, left of label | Inline with "Download" label |

#### Document Card Data

| Document | File Badge | Title | Description | File Format | File Name |
|----------|-----------|-------|-------------|-------------|-----------|
| W-9 | `PDF` | W-9 | Current W-9 tax identification form for vendor onboarding and payment processing. | PDF | `safetrekr-w9-2026.pdf` |
| Security Questionnaire | `PDF` | Security Questionnaire | Completed SIG Lite / CAIQ security assessment covering encryption, access controls, incident response, and data handling. | PDF | `safetrekr-security-questionnaire.pdf` |
| Contract Template | `DOCX` | Contract Template | Master services agreement template ready for redline. Includes standard terms, SLA, and data handling provisions. | DOCX | `safetrekr-msa-template.docx` |
| Data Processing Agreement | `PDF` | Data Processing Agreement | Standard DPA covering FERPA, COPPA, and GDPR data processing obligations with subprocessor list. | PDF | `safetrekr-dpa.pdf` |
| Insurance Certificate | `PDF` | Insurance Certificate | Certificate of general liability and professional indemnity insurance. Updated annually. | PDF | `safetrekr-insurance-certificate.pdf` |
| SOC 2 Report | `PDF` | SOC 2 Report | SOC 2 Type I report covering security, availability, and confidentiality trust service criteria. | PDF | `safetrekr-soc2-report.pdf` |

#### Copy

**Eyebrow**: `VENDOR DOCUMENTATION`

**Headline**: `Download. Review. Purchase.`

**Sub-text**: `Every document your procurement team typically requests -- ready for immediate download. No login required.`

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Section heading block | `fadeUp` (stagger container) | 20% viewport intersection | Eyebrow 0ms, headline 80ms, sub-text 160ms |
| Card grid | `staggerContainer + cardReveal` | After heading | Cards stagger at 80ms each, left-to-right, top-to-bottom |

#### Accessibility

- `<section aria-labelledby="document-downloads-heading">`
- Headline is `<h2 id="document-downloads-heading">`
- Each card title is `<h3>`
- Download buttons: `aria-label="Download [Document Title] ([File Format])"` -- e.g., `aria-label="Download W-9 (PDF)"`
- File type badges use `aria-hidden="true"` (redundant with the aria-label on the download button)
- Cards are not interactive as a whole; only the download button is the interactive target

---

### Section 4: Procurement Contact

**Component**: Custom `ProcurementContact` (page-specific)
**Background**: `card` (#f7f8f8) -- elevated surface band
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+------------------------------------------------------------------+
|  [card surface, full-width band]                                  |
|                                                                   |
|  +--col-span-5 (left)----------+  +--col-span-7 (right)--------+ |
|  |                              |  |                             | |
|  |  EYEBROW: "GET IN TOUCH"    |  |  FORM:                      | |
|  |                              |  |  [ Full Name          ]    | |
|  |  HEADLINE (text-heading-lg): |  |  [ Work Email         ]    | |
|  |  Questions? We're Here.     |  |  [ Organization       ]    | |
|  |                              |  |  [ Subject (dropdown) ]    | |
|  |  BODY (text-body-lg):        |  |  [ Message            ]    | |
|  |  Have a procurement question |  |  [                    ]    | |
|  |  that isn't answered here?   |  |  [                    ]    | |
|  |  Reach out directly and we   |  |                             | |
|  |  will respond within 4 hours |  |  [ Send Message ]          | |
|  |  during business hours.      |  |  (primary, default)        | |
|  |                              |  |                             | |
|  |  --- DIRECT CONTACT ---      |  +-----------------------------+ |
|  |                              |                                 |
|  |  Email:                      |                                 |
|  |  procurement@safetrekr.com   |                                 |
|  |                              |                                 |
|  |  Hours:                      |                                 |
|  |  Mon-Fri, 8 AM - 6 PM CT    |                                 |
|  |                              |                                 |
|  +------------------------------+                                 |
|                                                                   |
+------------------------------------------------------------------+

Mobile (< lg):
Stacked: text content above form. Full-width form.
Direct contact info moves below form.
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section background | `bg-card` | #f7f8f8 full-width band |
| Section padding | `py-16 sm:py-20 md:py-24 lg:py-32` | Standard section |
| Grid | `grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12` | 5/7 split desktop |
| Left column | `lg:col-span-5` | Text and direct contact |
| Right column | `lg:col-span-7` | Contact form |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em]` | "GET IN TOUCH" |
| Headline | `.text-heading-lg text-foreground` | 36px desktop / 24px mobile |
| Headline margin | `mb-4 lg:mb-6` | 16-24px |
| Body | `.text-body-lg text-muted-foreground max-w-prose` | See copy below |
| Body margin | `mb-8 lg:mb-10` | 32-40px below body |
| Direct contact label | `.text-eyebrow text-muted-foreground mb-2` | "DIRECT CONTACT" |
| Email link | `.text-body-md text-primary-700 font-medium hover:underline` | `procurement@safetrekr.com` |
| Hours label | `.text-body-sm text-muted-foreground mt-4` | "Mon -- Fri, 8 AM - 6 PM CT" |
| Form wrapper | `bg-background rounded-xl border border-border p-6 lg:p-8 shadow-card` | Form container on card surface |

#### Form Fields

| Field | Type | Required | Validation | Placeholder |
|-------|------|----------|------------|-------------|
| Full Name | text | Yes | Min 2 chars | "Your full name" |
| Work Email | email | Yes | Email format (Zod) | "you@organization.com" |
| Organization | text | Yes | Min 2 chars | "Organization name" |
| Subject | select | Yes | Must select | "Select a topic" |
| Message | textarea | No | Max 1000 chars | "How can we help?" |
| Honeypot | hidden | -- | Must be empty | -- |
| Cloudflare Turnstile | invisible | -- | Server-side token | -- |

**Subject dropdown options**:
1. W-9 or Tax Documentation
2. Security Questionnaire
3. Contract or MSA Review
4. Purchase Order Processing
5. Insurance Documentation
6. Compliance Question
7. Volume Pricing or Annual Plan
8. Other

#### Form Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Field layout | `space-y-4` | 16px between fields |
| Name + Email row | `grid grid-cols-1 sm:grid-cols-2 gap-4` | Side by side on sm+ |
| Input | `bg-card border border-border rounded-md h-11 px-4 text-body-md` | Standard input |
| Input focus | `ring-2 ring-ring ring-offset-2 border-ring` | Focus ring |
| Input error | `border-destructive ring-destructive` | Error state |
| Error text | `.text-body-xs text-destructive mt-1` | Below field |
| Select | Same as input with `ChevronDown` icon right | Dropdown indicator |
| Textarea | Same as input, `min-h-[120px] resize-y` | Expandable |
| Submit button | `<Button variant="primary" size="default" className="w-full sm:w-auto">` | "Send Message" |
| Submit icon | `Send` (Lucide), `h-4 w-4`, left of label | Inline icon |

#### Form Submission Behavior

1. Client-side validation (Zod) on blur and submit
2. Server-side validation (Zod) on Server Action
3. Cloudflare Turnstile verification
4. Save to Supabase `form_submissions` table with `form_type: 'procurement_inquiry'`, UTM params, referrer
5. Send notification email (Resend) to procurement team
6. Show confirmation state: replace form with confirmation card (check icon `primary-500`, "Message received. We will respond within 4 hours during business hours.", "Download All Documents" secondary CTA)
7. Fire Plausible event: `procurement_contact`

#### Copy

**Eyebrow**: `GET IN TOUCH`

**Headline**: `Questions? We're Here.`

**Body**: `Have a procurement question that is not answered here? Reach out directly and we will respond within 4 hours during business hours.`

**Direct Contact**:
- Email: `procurement@safetrekr.com`
- Hours: `Monday -- Friday, 8 AM - 6 PM CT`

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Left column | `fadeUp` | 20% viewport intersection | Stagger: eyebrow 0ms, headline 80ms, body 160ms, contact 240ms |
| Right column (form) | `fadeUp` | 20% viewport intersection | 200ms delay from section entry |

#### Accessibility

- `<section aria-labelledby="procurement-contact-heading">`
- Headline is `<h2 id="procurement-contact-heading">`
- All fields have visible `<label>` elements
- Errors use `aria-describedby` linking error message to field
- Form uses `aria-busy="true"` during submission
- Success state uses `aria-live="polite"` for announcement
- Email link: `<a href="mailto:procurement@safetrekr.com">procurement@safetrekr.com</a>`

---

### Section 5: Procurement FAQ

**Component**: `FAQSection` (shared design system component)
**Background**: `background` (#e7ecee) -- standard canvas
**Dark section**: No
**Container**: `max-w-3xl mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+------------------------------------------------------------------+
|                                                                   |
|  EYEBROW: "COMMON QUESTIONS"                     (centered)      |
|                                                                   |
|  HEADLINE (text-heading-lg, centered):                            |
|  Procurement FAQ                                                  |
|                                                                   |
|  +--max-w-3xl mx-auto------------------------------------------+ |
|  |                                                               | |
|  |  [v] Does SafeTrekr offer volume or bulk pricing?             | |
|  |  ----------------------------------------------------------   | |
|  |  [v] What payment methods does SafeTrekr accept?              | |
|  |  ----------------------------------------------------------   | |
|  |  [v] Can we use a purchase order?                             | |
|  |  ----------------------------------------------------------   | |
|  |  [v] Is SafeTrekr a registered vendor in state procurement    | |
|  |      systems?                                                 | |
|  |  ----------------------------------------------------------   | |
|  |  [v] Do you offer nonprofit or church discounts?              | |
|  |  ----------------------------------------------------------   | |
|  |  [v] What is the contract term?                               | |
|  |  ----------------------------------------------------------   | |
|  |  [v] How quickly can we get started after purchase?            | |
|  |  ----------------------------------------------------------   | |
|  |  [v] Who signs the contract on SafeTrekr's side?              | |
|  |                                                               | |
|  +---------------------------------------------------------------+ |
|                                                                   |
+------------------------------------------------------------------+
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | `py-16 sm:py-20 md:py-24 lg:py-32` | Standard section |
| Content wrapper | `max-w-3xl mx-auto` | 768px centered |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em]` | "COMMON QUESTIONS" |
| Eyebrow margin | `mb-4` | 16px |
| Headline | `.text-heading-lg text-foreground text-center` | 36px desktop / 24px mobile |
| Headline margin | `mb-10 lg:mb-12` | 40-48px |
| Accordion | shadcn/ui `Accordion`, `type="single" collapsible` | Single-expand |
| Trigger | `.text-heading-sm text-foreground` | 22px desktop / 18px mobile |
| Content | `.text-body-md text-muted-foreground` | 16px, 1.6 line height |
| Chevron | Rotates 180deg, `duration-normal`, `ease-default` | Standard accordion behavior |
| Item divider | `border-b border-border` | Between items |

#### FAQ Content

**Q1**: `Does SafeTrekr offer volume or bulk pricing?`
**A1**: `Yes. We offer tiered volume discounts: 5-9 trips (5% off), 10-24 trips (10% off), 25-49 trips (15% off), 50+ trips (20% off). Annual plans are available for organizations with predictable trip volumes. Contact us for a custom quote.`

**Q2**: `What payment methods does SafeTrekr accept?`
**A2**: `We accept credit card (Visa, Mastercard, American Express), ACH bank transfer, wire transfer, and purchase orders for qualified organizations. NET 30 terms are available for annual plans.`

**Q3**: `Can we use a purchase order?`
**A3**: `Yes. We accept purchase orders from schools, universities, churches, government entities, and businesses with established credit. Submit your PO to procurement@safetrekr.com and we will confirm within 1 business day.`

**Q4**: `Is SafeTrekr a registered vendor in state procurement systems?`
**A4**: `We are actively registering in state procurement systems. If your state or district requires a specific registration, contact us and we will prioritize it. Current W-9 and insurance documentation is available for immediate download above.`

**Q5**: `Do you offer nonprofit or church discounts?`
**A5**: `Volume discounts apply to all organization types, including nonprofits and churches. Multi-trip annual plans offer the deepest savings. Contact us to discuss your specific needs and trip volume.`

**Q6**: `What is the contract term?`
**A6**: `Per-trip purchases require no contract. Annual plans are 12-month agreements with auto-renewal and 30-day cancellation notice. Enterprise agreements are customized to your procurement requirements.`

**Q7**: `How quickly can we get started after purchase?`
**A7**: `Immediately. Once payment is processed or a PO is confirmed, you can submit your first trip for review within minutes. There is no implementation period, no training requirement, and no software installation.`

**Q8**: `Who signs the contract on SafeTrekr's side?`
**A8**: `All contracts are signed by SafeTrekr's authorized representative. We can accommodate your organization's signature workflow, including DocuSign, Adobe Sign, or wet signature if required.`

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Heading block | `fadeUp` (stagger) | 20% viewport intersection | Eyebrow 0ms, headline 80ms |
| FAQ items | `staggerContainer` | After heading | Items fade up at 60ms stagger |

#### Accessibility

- `<section aria-labelledby="procurement-faq-heading">`
- Headline is `<h2 id="procurement-faq-heading">`
- Accordion uses `aria-expanded` on triggers
- Content regions use `role="region"` with `aria-labelledby` pointing to the trigger
- FAQ items emit `FAQPage` JSON-LD (defined in Page Metadata above)

---

### Section 6: Conversion CTA Banner

**Component**: `CTABand` (shared design system component)
**Variant**: `dark`
**Background**: `secondary` (#123646)
**Dark section**: Yes (1 of 1 on this page)
**Container**: Handled internally by CTABand

#### Layout

```
Desktop (>= lg):
+==================================================================+
|  [secondary background]                                           |
|                                                                   |
|  HEADLINE (text-display-md, white, centered):                     |
|  Ready to Move Forward?                                           |
|                                                                   |
|  BODY (text-body-lg, white/80, centered, max-w-prose):            |
|  Download the documents you need. Or reach out and we will        |
|  walk you through everything.                                     |
|                                                                   |
|  [ Get a Demo ]          [ Contact Us ]                           |
|  (primary-on-dark, lg)   (ghost, lg, white text/border)           |
|                                                                   |
+==================================================================+
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | `py-20 lg:py-28` | CTABand standard |
| Background | `bg-secondary` with `[data-theme="dark"]` | Dark authority surface |
| Headline | `.text-display-md text-[var(--color-dark-text-primary)]` | White on dark |
| Body | `.text-body-lg text-[var(--color-dark-text-secondary)] max-w-prose mx-auto` | Muted white |
| Primary CTA | `<Button variant="primary-on-dark" size="lg">` | "Get a Demo" -- links to `/demo` |
| Secondary CTA | `<Button variant="ghost" size="lg" className="text-white border-white/20 hover:bg-white/10">` | "Contact Us" -- links to `/contact` |
| CTA layout | `flex flex-col sm:flex-row gap-4 justify-center` | Centered, stacked on mobile |

#### Copy

**Headline**: `Ready to Move Forward?`

**Body**: `Download the documents you need. Or reach out and we will walk you through everything.`

**Primary CTA**: `Get a Demo` -- links to `/demo`
**Secondary CTA**: `Contact Us` -- links to `/contact`

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Section | `fadeIn` | 20% viewport intersection | Entire band fades |
| Headline | `fadeUp` | After section | 0ms |
| Body | `fadeUp` | Stagger | 80ms |
| CTAs | `fadeUp` | Stagger | 160ms |

#### Accessibility

- `<section aria-labelledby="procurement-cta-heading">`
- Headline is `<h2 id="procurement-cta-heading">`
- Dark section verified: `dark-text-primary` on `secondary` = 11.6:1 contrast (PASS)
- `dark-text-secondary` on `secondary` = 7.0:1 contrast (PASS)
- CTA buttons meet minimum 44x44px touch target

---

## Procurement Page: User Actions Summary

| Action | Mechanism | Destination |
|--------|-----------|-------------|
| Download all documents (ZIP) | Hero primary CTA | Browser download |
| Scroll to contact form | Hero secondary CTA | In-page anchor |
| Download individual document | Card download button | Browser download |
| Send procurement inquiry | Contact form submit | Server Action |
| Email procurement directly | Email link | `mailto:procurement@safetrekr.com` |
| Request a demo | CTA banner primary | `/demo` |
| Contact general | CTA banner secondary | `/contact` |
| Expand FAQ item | Accordion trigger | In-page |

## Procurement Page: Primary CTAs (Priority Order)

1. Download individual documents (document grid -- the core purpose of the page)
2. Send procurement inquiry (contact form)
3. "Get a Demo" (CTA banner)

---
---
---

# PAGE 2: SECURITY & TRUST (`/security`)

**Page Type**: Core Page (SSG)
**Hierarchy Level**: L1
**Canonical URL**: `https://www.safetrekr.com/security`
**Redirects**: `/trust` (301), `/trust-center` (301), `/security-and-trust` (301)

---

## Page Metadata

### SEO

| Property | Value |
|----------|-------|
| `<title>` | `Security & Trust -- How SafeTrekr Protects Your Data \| SafeTrekr` |
| `meta description` | `AES-256 encryption at rest. TLS 1.2+ in transit. SHA-256 hash-chain evidence integrity. SOC 2 audit in progress. See exactly how SafeTrekr protects student, participant, and organizational data.` |
| `og:title` | `Security & Trust -- SafeTrekr` |
| `og:description` | Same as meta description |
| `og:type` | `website` |
| `og:image` | `/og/security.png` (1200x630, brand composition with shield motif and encryption badge overlay) |
| `canonical` | `https://www.safetrekr.com/security` |

### JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "SafeTrekr Security & Trust",
  "description": "Security posture, encryption standards, compliance roadmap, data handling policies, and infrastructure details for SafeTrekr.",
  "url": "https://www.safetrekr.com/security",
  "about": {
    "@type": "Thing",
    "name": "Information Security",
    "description": "AES-256 encryption at rest, TLS 1.2+ in transit, SHA-256 evidence chain integrity, SOC 2 compliance."
  }
}
```

---

## Dark Section Budget

This page uses **2 dark sections** (the maximum allowed excluding footer):

1. **Section 4: Compliance Roadmap** -- `DarkAuthoritySection` wrapper. Rationale: the compliance timeline is a trust/proof module displaying institutional commitment.
2. **Section 9: Conversion CTA Banner** -- `CTABand variant="dark"`. Rationale: terminal conversion prompt.

Neither section is adjacent. They are separated by Section 5 (Data Handling), Section 6 (Infrastructure), Section 7 (Incident Response), and Section 8 (Trust Badges Grid) -- all light sections.

---

## Page-Level Design Register

| Register | Weight | Application on This Page |
|----------|--------|--------------------------|
| Polished Operational (70%) | Dominant | Encryption details, data handling tables, infrastructure cards, compliance timeline -- structured, technical, precise |
| Editorial Intelligence (20%) | Secondary | Hero headline, evidence integrity explanation -- slightly elevated editorial voice to make technical content accessible |
| Watchtower Light (10%) | Restrained | Shield motif background pattern at 2-3% opacity in the hero section; route divider between encryption and evidence integrity |

This page speaks to two audiences: risk managers and IT evaluators who need technical specifics, and procurement officers who need trust signals to check a box. The tone is transparent, specific, and honest. Where compliance is in progress, the page says so plainly. No overclaiming.

---

## Section-by-Section Specification

---

### Section 1: Hero

**Component**: Custom `SecurityHero` (page-specific)
**Background**: `background` (#e7ecee) -- standard page canvas, with shield motif pattern at 2-3% opacity
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+------------------------------------------------------------------+
|  [background canvas + shield motif pattern at 2-3% opacity]       |
|                                                                   |
|  EYEBROW: "SECURITY & TRUST"                                     |
|                                                                   |
|  HEADLINE (text-display-lg):                                      |
|  Your Data Is Protected.                                          |
|  Here's Exactly How.                                              |
|                                                                   |
|  SUB-HEADLINE (text-body-lg, max-w-prose):                        |
|  We do not ask you to trust us blindly. This page documents       |
|  every encryption standard, every compliance commitment,          |
|  and every infrastructure decision we have made to protect        |
|  your organization's data.                                        |
|                                                                   |
|  +----------+ +----------+ +----------+ +----------+             |
|  | AES-256  | | TLS 1.2+ | | SHA-256  | | SOC 2    |             |
|  | At Rest  | | Transit  | | Evidence | | Audit    |             |
|  +----------+ +----------+ +----------+ +----------+             |
|  (4 trust badges, inline, muted card surface)                    |
|                                                                   |
+------------------------------------------------------------------+

Mobile (< lg):
Same stacked layout. Trust badges wrap to 2x2 grid.
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | `pt-24 pb-16 lg:pt-32 lg:pb-24 xl:pt-36 xl:pb-28` | Hero scale |
| Background pattern | Mountain peaks SVG from logo mark, `primary-200` at 2-3% opacity, `absolute inset-0 overflow-hidden` | Decorative only |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em]` | "SECURITY & TRUST" |
| Eyebrow icon | `Shield` (Lucide), `h-3.5 w-3.5`, inline-left, `text-primary-700` | Trust framing |
| Eyebrow margin | `mb-4 lg:mb-6` | 16-24px |
| Headline | `.text-display-lg text-foreground` | See copy below |
| Headline max-width | `max-w-[20ch]` | Constrains line breaks |
| Headline margin | `mb-6 lg:mb-8` | 24-32px |
| Sub-headline | `.text-body-lg text-muted-foreground max-w-prose` | See copy below |
| Sub-headline margin | `mb-10 lg:mb-12` | 40-48px |
| Trust badges grid | `flex flex-wrap gap-3` | Inline badge row |
| Trust badge | `inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm` | Pill badges |
| Badge icon | `h-4 w-4 text-primary-700` | Lucide icons: `Lock`, `ShieldCheck`, `Hash`, `FileCheck` |
| Badge text | `.text-body-sm text-foreground font-medium` | "AES-256 At Rest", etc. |
| Text alignment | `text-left` | Left-aligned on all breakpoints |

#### Copy

**Eyebrow**: `SECURITY & TRUST`

**Headline**: `Your Data Is Protected. Here's Exactly How.`

**Sub-headline**: `We do not ask you to trust us blindly. This page documents every encryption standard, every compliance commitment, and every infrastructure decision we have made to protect your organization's data.`

**Trust Badges**:
1. `Lock` icon -- "AES-256 At Rest"
2. `ShieldCheck` icon -- "TLS 1.2+ In Transit"
3. `Hash` icon -- "SHA-256 Evidence Chain"
4. `FileCheck` icon -- "SOC 2 Audit"

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Eyebrow | `fadeUp` | Page load | 0ms delay |
| Headline | `fadeUp` | Page load | 80ms stagger |
| Sub-headline | `fadeUp` | Page load | 160ms stagger |
| Trust badges | `fadeUp` | Page load | 240ms stagger, badges stagger at 60ms each |

#### Accessibility

- `<section aria-labelledby="security-hero-heading">`
- Headline is `<h1 id="security-hero-heading">` -- the only `<h1>` on the page
- Sub-headline is `<p>`, not a heading
- Background pattern: `aria-hidden="true"` (decorative)
- Trust badges: each is a `<span>` (not interactive, informational only)

---

### Section 2: Encryption

**Component**: Custom `EncryptionSection` (page-specific)
**Background**: `card` (#f7f8f8) -- elevated surface band
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+------------------------------------------------------------------+
|  [card surface, full-width band]                                  |
|                                                                   |
|  EYEBROW: "ENCRYPTION"                          (centered)       |
|                                                                   |
|  HEADLINE (text-display-md, centered):                            |
|  Two Layers of Encryption.                                        |
|  No Exceptions.                                                   |
|                                                                   |
|  +---col-span-6 (left)--------+  +---col-span-6 (right)--------+ |
|  |                              |  |                             | |
|  |  [Lock icon, 48px]           |  |  [ShieldCheck icon, 48px]  | |
|  |                              |  |                             | |
|  |  AT REST                     |  |  IN TRANSIT                | |
|  |  AES-256                     |  |  TLS 1.2+                  | |
|  |                              |  |                             | |
|  |  Every piece of data stored  |  |  Every connection between  | |
|  |  in SafeTrekr -- trip plans, |  |  your browser and SafeTrekr| |
|  |  participant information,    |  |  is encrypted with TLS 1.2 | |
|  |  safety binders, evidence    |  |  or higher. We enforce     | |
|  |  records -- is encrypted     |  |  HTTPS on all endpoints.   | |
|  |  using AES-256, the same     |  |  HSTS headers are set with | |
|  |  standard used by financial  |  |  a 1-year max-age. No      | |
|  |  institutions and government |  |  data travels in plaintext.| |
|  |  agencies.                   |  |  Ever.                     | |
|  |                              |  |                             | |
|  |  DETAILS:                    |  |  DETAILS:                  | |
|  |  * Database: Encrypted at    |  |  * Protocol: TLS 1.2       | |
|  |    volume level (LUKS)       |  |    minimum, TLS 1.3 where  | |
|  |  * File storage: Encrypted   |  |    supported                | |
|  |    at object level           |  |  * Certificates: Auto-     | |
|  |  * Backups: Encrypted with   |  |    renewed via Cloudflare   | |
|  |    separate key              |  |  * HSTS: Strict-Transport- | |
|  |  * Key management: Provider  |  |    Security with 1-year    | |
|  |    managed, rotated          |  |    max-age                 | |
|  |    automatically             |  |  * Cipher suites: Modern   | |
|  |                              |  |    only (no legacy TLS     | |
|  |                              |  |    1.0/1.1)                | |
|  +------------------------------+  +-----------------------------+ |
|                                                                   |
+------------------------------------------------------------------+

Mobile (< lg):
Two columns stack vertically.
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section background | `bg-card` | #f7f8f8 full-width band |
| Section padding | `py-16 sm:py-20 md:py-24 lg:py-32` | Standard section |
| Heading alignment | `text-center` | Centered eyebrow, headline |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em]` | "ENCRYPTION" |
| Headline | `.text-display-md text-foreground` | 44px desktop / 28px mobile |
| Headline margin | `mb-10 lg:mb-14` | 40-56px |
| Card grid | `grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8` | 2 equal columns |
| Card | `bg-background rounded-xl border border-border p-8 shadow-card` | Standard card |
| Icon container | `h-14 w-14 rounded-lg bg-primary-50 flex items-center justify-center mb-6` | Large icon block |
| Icon | `h-7 w-7 text-primary-700` | `Lock` and `ShieldCheck` |
| Card eyebrow | `.text-eyebrow text-muted-foreground mb-2` | "AT REST" / "IN TRANSIT" |
| Card heading | `.text-heading-md text-foreground mb-4` | "AES-256" / "TLS 1.2+" |
| Card body | `.text-body-md text-muted-foreground mb-6` | Explanatory paragraph |
| Details list | `space-y-2` | Bulleted detail items |
| Detail item | `.text-body-sm text-muted-foreground` | Inline with `Check` icon (h-4 w-4, primary-500) |

#### Copy

**Eyebrow**: `ENCRYPTION`

**Headline**: `Two Layers of Encryption. No Exceptions.`

**At Rest Card**:
- Label: `AT REST`
- Heading: `AES-256`
- Body: `Every piece of data stored in SafeTrekr -- trip plans, participant information, safety binders, evidence records -- is encrypted using AES-256, the same standard used by financial institutions and government agencies.`
- Details:
  - `Database: Encrypted at volume level (LUKS)`
  - `File storage: Encrypted at object level`
  - `Backups: Encrypted with separate key`
  - `Key management: Provider-managed, rotated automatically`

**In Transit Card**:
- Label: `IN TRANSIT`
- Heading: `TLS 1.2+`
- Body: `Every connection between your browser and SafeTrekr is encrypted with TLS 1.2 or higher. We enforce HTTPS on all endpoints. HSTS headers are set with a 1-year max-age. No data travels in plaintext. Ever.`
- Details:
  - `Protocol: TLS 1.2 minimum, TLS 1.3 where supported`
  - `Certificates: Auto-renewed via Cloudflare`
  - `HSTS: Strict-Transport-Security with 1-year max-age`
  - `Cipher suites: Modern only (no legacy TLS 1.0/1.1)`

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Section heading | `fadeUp` (stagger) | 20% viewport intersection | Eyebrow 0ms, headline 80ms |
| Left card | `cardReveal` | After heading | 160ms |
| Right card | `cardReveal` | After heading | 240ms |

#### Accessibility

- `<section aria-labelledby="encryption-heading">`
- Headline is `<h2 id="encryption-heading">`
- Each card heading is `<h3>`
- Detail lists use `<ul>` with `<li>` elements
- Technical abbreviations: `<abbr title="Advanced Encryption Standard, 256-bit">AES-256</abbr>`, `<abbr title="Transport Layer Security">TLS</abbr>`

---

### Section Divider: Route Curve

Between Section 2 and Section 3, render the route divider:

| Property | Value |
|----------|-------|
| Component | `<Divider variant="route" />` |
| SVG | S-curve bezier path extracted from logo mark |
| Color | `primary-200` at 30% opacity |
| Max width | 600px, centered |
| Height | ~40px visible |
| Margin | `my-0` (absorbed by adjacent section padding) |
| Animation | `routeDraw` -- pathLength 0 to 1 over 1200ms on scroll intersection |

---

### Section 3: Evidence Integrity

**Component**: Custom `EvidenceIntegritySection` (page-specific)
**Background**: `background` (#e7ecee) -- standard canvas
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+------------------------------------------------------------------+
|                                                                   |
|  +---col-span-6 (left: text)---+  +---col-span-6 (right: vis)--+ |
|  |                              |  |                             | |
|  |  EYEBROW: "EVIDENCE          |  |  [Hash Chain Diagram]       | |
|  |  INTEGRITY"                  |  |                             | |
|  |                              |  |  +-----------+              | |
|  |  HEADLINE (text-display-md): |  |  | Doc v1    |              | |
|  |  Every Document.             |  |  | SHA-256:  |              | |
|  |  Tamper-Evident.             |  |  | a7f3c...  | ---+         | |
|  |                              |  |  +-----------+    |         | |
|  |  BODY (text-body-lg):        |  |                   v         | |
|  |  Every safety binder         |  |  +-----------+              | |
|  |  produced by SafeTrekr is    |  |  | Doc v2    |              | |
|  |  sealed with a SHA-256       |  |  | SHA-256:  |              | |
|  |  cryptographic hash. This    |  |  | prev+new  | ---+         | |
|  |  hash creates a tamper-      |  |  | = b9e2... |    |         | |
|  |  evident chain: if a single  |  |  +-----------+    |         | |
|  |  character in any document   |  |                   v         | |
|  |  changes, the hash changes,  |  |  +-----------+              | |
|  |  and the tampering is        |  |  | Doc v3    |              | |
|  |  detectable.                 |  |  | SHA-256:  |              | |
|  |                              |  |  | prev+new  |              | |
|  |  TECHNICAL DETAIL:           |  |  | = c4d1... |              | |
|  |  (text-body-md, code block): |  |  +-----------+              | |
|  |  SHA-256(previous_hash +     |  |                             | |
|  |  document_content +          |  |  [Check icon]               | |
|  |  timestamp) = new_hash       |  |  "Any modification          | |
|  |                              |  |  breaks the chain."         | |
|  |  WHY THIS MATTERS:           |  |                             | |
|  |  * Proves documents have     |  +-----------------------------+ |
|  |    not been altered           |                                 |
|  |  * Satisfies evidence chain  |                                 |
|  |    requirements for legal    |                                 |
|  |    proceedings               |                                 |
|  |  * Verifiable by any third   |                                 |
|  |    party without SafeTrekr   |                                 |
|  |    access                    |                                 |
|  +------------------------------+                                 |
|                                                                   |
+------------------------------------------------------------------+

Mobile (< lg):
Stacked. Visual (hash chain diagram) below text.
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | `py-16 sm:py-20 md:py-24 lg:py-32` | Standard section |
| Grid | `grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center` | 50/50 split |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em]` | "EVIDENCE INTEGRITY" |
| Headline | `.text-display-md text-foreground` | 44px desktop / 28px mobile |
| Headline margin | `mb-6 lg:mb-8` | 24-32px |
| Body | `.text-body-lg text-muted-foreground max-w-prose` | Explanatory paragraph |
| Body margin | `mb-6` | 24px |
| Code block | `bg-card rounded-lg border border-border p-4 font-mono text-mono-md text-foreground` | Hash formula display |
| Code block margin | `mb-6` | 24px |
| Benefits heading | `.text-heading-sm text-foreground mb-4` | "Why This Matters" |
| Benefits list | `space-y-3` | Bulleted benefits |
| Benefit item | `.text-body-md text-muted-foreground` with `Check` icon (h-5 w-5, primary-500) | Check + text |
| Hash chain diagram | Custom SVG component | See visual spec below |

#### Hash Chain Visual Specification

The hash chain diagram is a custom SVG/HTML component:

| Element | Style |
|---------|-------|
| Container | `bg-card rounded-xl border border-border p-6 lg:p-8 shadow-card` |
| Document blocks | `bg-background rounded-lg border border-border p-4`, stacked vertically with `space-y-4` |
| Block label | `.text-body-sm text-foreground font-medium` | e.g., "Document v1" |
| Hash value | `.text-mono-sm text-primary-700` | e.g., `a7f3c8...` (truncated) |
| Connector arrows | `stroke: primary-300`, `stroke-width: 2px`, dashed line between blocks |
| Arrow direction | Top block hash feeds into bottom block as "previous_hash" |
| Bottom badge | `inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 mt-4` |
| Badge icon | `ShieldCheck` (Lucide), `h-4 w-4 text-primary-700` |
| Badge text | `.text-body-sm text-primary-800 font-medium` -- "Any modification breaks the chain." |

#### Copy

**Eyebrow**: `EVIDENCE INTEGRITY`

**Headline**: `Every Document. Tamper-Evident.`

**Body**: `Every safety binder produced by SafeTrekr is sealed with a SHA-256 cryptographic hash. This hash creates a tamper-evident chain: if a single character in any document changes, the hash changes, and the tampering is detectable.`

**Technical Detail (code block)**:
```
SHA-256(previous_hash + document_content + timestamp) = new_hash
```

**Why This Matters**:
- `Proves documents have not been altered after creation`
- `Satisfies evidence chain requirements for legal proceedings and audits`
- `Verifiable by any third party without needing SafeTrekr access`

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Text column | `fadeUp` (stagger) | 20% viewport intersection | Eyebrow 0ms, headline 80ms, body 160ms, code 240ms, benefits 320ms |
| Visual column | `documentStack` | 20% viewport intersection | Hash blocks stagger top-to-bottom at 120ms |
| Connector arrows | `routeDraw` | After blocks | pathLength 0 to 1 over 600ms |

#### Accessibility

- `<section aria-labelledby="evidence-integrity-heading">`
- Headline is `<h2 id="evidence-integrity-heading">`
- Code block: `<code>` within `<pre>` with `aria-label="SHA-256 hash chain formula"`
- Hash chain diagram: `aria-label="Diagram showing how SHA-256 hashes chain documents together to prevent tampering"` on the container
- Individual hash values in the diagram: `aria-hidden="true"` (illustrative, not meaningful data)
- `<abbr title="Secure Hash Algorithm, 256-bit">SHA-256</abbr>` on first occurrence

---

### Section 4: Compliance Roadmap

**Component**: Custom `ComplianceRoadmap` (page-specific) wrapped in `DarkAuthoritySection`
**Background**: `secondary` (#123646) -- dark authority surface
**Dark section**: Yes (1 of 2)
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+==================================================================+
|  [secondary background]                                           |
|                                                                   |
|  EYEBROW: "COMPLIANCE ROADMAP"                  (centered)       |
|  (text: dark-accent)                                              |
|                                                                   |
|  HEADLINE (text-display-md, dark-text-primary, centered):         |
|  Honest About Where We Are.                                      |
|  Clear About Where We're Going.                                   |
|                                                                   |
|  SUB-TEXT (text-body-lg, dark-text-secondary, centered):          |
|  We believe transparency earns more trust than overclaiming.      |
|  Here is our compliance roadmap with honest status markers.       |
|                                                                   |
|  +------+--------+------+--------+------+--------+------+        |
|  |  [*] |--------|  [*] |--------|  [o] |--------|  [ ] |        |
|  | Done |        | Done |        | In   |        | Plan |        |
|  +------+        +------+        | Prog |        +------+        |
|                                  +------+                         |
|  Student         FERPA/COPPA     SOC 2          SOC 2            |
|  Privacy         Design          Type I          Type II          |
|  Pledge          Alignment                                        |
|                                                                   |
|  "Signed 2024"   "Designed with  "Audit began   "Target:         |
|                   FERPA/COPPA     Q1 2026"       Q4 2026"         |
|                   requirements                                    |
|                   in mind.                                        |
|                   Certification                                   |
|                   pending."                                       |
|                                                                   |
+==================================================================+

Mobile (< lg):
Timeline converts to vertical stacked format.
Each milestone is a card-row with status indicator left, content right.
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section wrapper | `DarkAuthoritySection` with `[data-theme="dark"]` | Token override context |
| Section padding | `py-16 sm:py-20 md:py-24 lg:py-32` | Standard section |
| Eyebrow | `.text-eyebrow text-[var(--color-dark-accent)] uppercase tracking-[0.08em]` | primary-400 on dark |
| Headline | `.text-display-md text-[var(--color-dark-text-primary)]` | White (#f7f8f8) |
| Headline margin | `mb-4 lg:mb-6` | 16-24px |
| Sub-text | `.text-body-lg text-[var(--color-dark-text-secondary)] max-w-prose mx-auto` | Muted white (#b8c3c7) |
| Sub-text margin | `mb-12 lg:mb-16` | 48-64px |
| Timeline container | `relative` | Houses connector line + milestones |
| Desktop connector line | `absolute top-[20px] left-0 right-0 h-[2px] bg-[var(--color-dark-border)]` | Horizontal connector |
| Milestone grid (desktop) | `grid grid-cols-4 gap-6` | 4 equal columns |
| Mobile layout | `space-y-6` | Vertical stack |

#### Milestone Card Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Card wrapper | `text-center relative` | Centered content |
| Status indicator | `mx-auto h-10 w-10 rounded-full flex items-center justify-center mb-4` | Circle at top |
| Completed indicator | `bg-[var(--color-dark-accent)] text-secondary` with `Check` icon (h-5 w-5) | Green check on dark |
| In Progress indicator | `border-2 border-[var(--color-dark-accent)] bg-transparent` with pulsing dot | Animated ring |
| Planned indicator | `border-2 border-[var(--color-dark-border)] bg-transparent` | Empty circle |
| Milestone title | `.text-heading-sm text-[var(--color-dark-text-primary)]` | White heading |
| Milestone title margin | `mb-2` | 8px |
| Status badge (completed) | `<Badge variant="dark">` with check icon, "Complete" | Green-accent text |
| Status badge (in progress) | `inline-flex items-center gap-1.5 rounded-full bg-[var(--color-dark-accent)]/10 px-3 py-1 text-body-xs text-[var(--color-dark-accent)] font-medium` | "In Progress" |
| Status badge (planned) | `inline-flex items-center gap-1.5 rounded-full bg-[var(--color-dark-border)] px-3 py-1 text-body-xs text-[var(--color-dark-text-secondary)] font-medium` | "Planned" |
| Status badge margin | `mb-3` | 12px |
| Description | `.text-body-sm text-[var(--color-dark-text-secondary)]` | Honest status description |

#### Milestone Data

| # | Title | Status | Badge | Description |
|---|-------|--------|-------|-------------|
| 1 | Student Privacy Pledge | Complete | "Signed 2024" | `Signed the Student Privacy Pledge, committing to responsible handling of student data in K-12 contexts.` |
| 2 | FERPA / COPPA Alignment | Complete | "Designed for compliance" | `Platform designed with FERPA and COPPA requirements in mind. Architecture review complete. Formal certification pending.` |
| 3 | SOC 2 Type I | In Progress | "Audit began Q1 2026" | `SOC 2 Type I audit covering Security, Availability, and Confidentiality trust service criteria. Report expected Q2 2026.` |
| 4 | SOC 2 Type II | Planned | "Target: Q4 2026" | `6-month observation period following Type I completion. Type II report demonstrates sustained compliance over time.` |

#### Copy

**Eyebrow**: `COMPLIANCE ROADMAP`

**Headline**: `Honest About Where We Are. Clear About Where We're Going.`

**Sub-text**: `We believe transparency earns more trust than overclaiming. Here is our compliance roadmap with honest status markers.`

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Section | `fadeIn` | 20% viewport intersection | Background fades |
| Heading block | `fadeUp` (stagger) | After section | Eyebrow 0ms, headline 80ms, sub-text 160ms |
| Connector line | Custom | After heading | Width animates from 0% to 100% over 800ms |
| Milestones | `staggerContainer` | After connector | 120ms stagger left to right |
| Status indicators | `markerPop` | Per-milestone | Pop in as milestone reveals |

#### Accessibility

- `<section aria-labelledby="compliance-roadmap-heading">`
- Headline is `<h2 id="compliance-roadmap-heading">`
- Timeline uses `<ol aria-label="Compliance milestones">` with `<li>` per milestone
- Status indicators: `aria-label="Status: Complete"`, `aria-label="Status: In Progress"`, `aria-label="Status: Planned"`
- "In Progress" pulsing animation respects `prefers-reduced-motion` (static ring when reduced)
- Dark text contrast verified: `dark-text-primary` on `secondary` = 11.6:1 (PASS), `dark-text-secondary` on `secondary` = 7.0:1 (PASS), `dark-accent` on `secondary` = 4.8:1 (PASS for UI elements and large text)

---

### Section 5: Data Handling

**Component**: Custom `DataHandlingSection` (page-specific)
**Background**: `card` (#f7f8f8) -- elevated surface band
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+------------------------------------------------------------------+
|  [card surface, full-width band]                                  |
|                                                                   |
|  EYEBROW: "DATA HANDLING"                        (centered)      |
|                                                                   |
|  HEADLINE (text-display-md, centered):                            |
|  What We Collect. Where It Lives.                                 |
|  How Long We Keep It.                                             |
|                                                                   |
|  +-- 3-column card grid ----------------------------------------+ |
|  |                                                               | |
|  |  +--WHAT WE COLLECT--+ +--WHERE IT'S--+ +--RETENTION--------+ | |
|  |  |  [Database icon]   | | STORED       | | POLICY            | | |
|  |  |                    | | [Server icon]| | [Calendar icon]   | | |
|  |  |  Trip plans:       | |              | |                   | | |
|  |  |  destinations,     | | Application: | | Active trips:     | | |
|  |  |  dates, activities | | DigitalOcean | | Available for     | | |
|  |  |                    | | (US-East)    | | the duration of   | | |
|  |  |  Participant info: | |              | | the trip + 90     | | |
|  |  |  names, emergency  | | Database:    | | days              | | |
|  |  |  contacts          | | Supabase     | |                   | | |
|  |  |                    | | (PostgreSQL, | | Completed trips:  | | |
|  |  |  Organization:     | | US-hosted)   | | Safety binders    | | |
|  |  |  name, contact,    | |              | | retained for 7    | | |
|  |  |  billing           | | Files:       | | years (evidence   | | |
|  |  |                    | | DigitalOcean | | preservation)     | | |
|  |  |  Safety binders:   | | Spaces (S3-  | |                   | | |
|  |  |  analyst findings, | | compatible,  | | Account closure:  | | |
|  |  |  risk scores,      | | US region)   | | Data purged       | | |
|  |  |  evidence chain    | |              | | within 30 days    | | |
|  |  |                    | | CDN:         | | upon written      | | |
|  |  |  We do NOT collect:| | Cloudflare   | | request. Purge    | | |
|  |  |  * Social security | | (global edge,| | proof provided.   | | |
|  |  |    numbers         | | no PII at    | |                   | | |
|  |  |  * Medical records | | edge)        | | Regulatory hold:  | | |
|  |  |  * Financial data  | |              | | Retention         | | |
|  |  |  * Biometric data  | | ALL data     | | extended if       | | |
|  |  |                    | | resides in   | | required by law   | | |
|  |  |                    | | US data      | | or active legal   | | |
|  |  |                    | | centers.     | | proceeding.       | | |
|  |  +--------------------+ +--------------+ +-------------------+ | |
|  |                                                               | |
|  +---------------------------------------------------------------+ |
|                                                                   |
|  FOOTER NOTE (text-body-sm, centered):                            |
|  Full details in our Privacy Policy and Data Processing           |
|  Agreement, both available for download on the Procurement page.  |
|                                                                   |
+------------------------------------------------------------------+

Mobile (< lg):
3 cards stack vertically.
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section background | `bg-card` | #f7f8f8 full-width band |
| Section padding | `py-16 sm:py-20 md:py-24 lg:py-32` | Standard section |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em]` | "DATA HANDLING" |
| Headline | `.text-display-md text-foreground text-center` | 44px desktop / 28px mobile |
| Headline margin | `mb-10 lg:mb-14` | 40-56px |
| Card grid | `grid grid-cols-1 lg:grid-cols-3 gap-6` | 3 equal columns |
| Card | `bg-background rounded-xl border border-border p-6 lg:p-8 shadow-card` | Standard card |
| Card icon container | `h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center mb-6` | Icon block |
| Card icon | `h-6 w-6 text-primary-700` | Lucide: `Database`, `Server`, `Calendar` |
| Card heading | `.text-heading-sm text-foreground mb-4` | Card title |
| Card body | `.text-body-sm text-muted-foreground` | Card content |
| List items | `space-y-2` with bullet or check marks | Data categories |
| "Do NOT collect" section | `mt-4 pt-4 border-t border-border` | Visually separated |
| "Do NOT" label | `.text-body-sm text-foreground font-semibold` | Emphasis on exclusions |
| "Do NOT" items | `.text-body-sm text-muted-foreground` with `X` icon (h-4 w-4, destructive) | Red X marks |
| Footer note | `.text-body-sm text-muted-foreground text-center max-w-prose mx-auto mt-8` | Below cards |
| Footer links | `.text-primary-700 font-medium hover:underline` | Links to `/legal/privacy`, `/procurement` |

#### Copy

**Eyebrow**: `DATA HANDLING`

**Headline**: `What We Collect. Where It Lives. How Long We Keep It.`

**Card 1 -- What We Collect**:
- Heading: `What We Collect`
- Items collected:
  - `Trip plans: destinations, dates, itineraries, and planned activities`
  - `Participant information: names, emergency contacts, and dietary/medical notes as provided`
  - `Organization data: organization name, administrator contacts, and billing information`
  - `Safety binders: analyst findings, risk scores, recommendations, and the SHA-256 evidence chain`
- Do NOT collect:
  - `Social security numbers`
  - `Medical records`
  - `Financial account data`
  - `Biometric data`

**Card 2 -- Where It Is Stored**:
- Heading: `Where It Is Stored`
- Items:
  - `Application hosting: DigitalOcean (US-East region)`
  - `Database: Supabase (PostgreSQL, US-hosted instances)`
  - `File storage: DigitalOcean Spaces (S3-compatible, US region)`
  - `CDN: Cloudflare (global edge, no PII cached at edge)`
  - `All data resides in US-based data centers.`

**Card 3 -- Retention Policy**:
- Heading: `Retention Policy`
- Items:
  - `Active trips: Data available for the duration of the trip plus 90 days`
  - `Completed trips: Safety binders retained for 7 years for evidence preservation and regulatory compliance`
  - `Account closure: Data purged within 30 days upon written request. Purge confirmation provided.`
  - `Regulatory hold: Retention extended if required by law or active legal proceeding`

**Footer note**: `Full details are documented in our [Privacy Policy](/legal/privacy) and [Data Processing Agreement](/procurement), both available for download on the Procurement page.`

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Heading block | `fadeUp` (stagger) | 20% viewport intersection | Eyebrow 0ms, headline 80ms |
| Card grid | `staggerContainer + cardReveal` | After heading | Cards stagger at 100ms each |
| Footer note | `fadeUp` | After cards | 400ms delay |

#### Accessibility

- `<section aria-labelledby="data-handling-heading">`
- Headline is `<h2 id="data-handling-heading">`
- Each card heading is `<h3>`
- "Do NOT collect" items: `X` icon has `aria-hidden="true"`, list item text includes "Not collected:" prefix for screen readers via `sr-only` span
- Data lists use `<ul>` with `<li>` elements

---

### Section 6: Infrastructure

**Component**: Custom `InfrastructureSection` (page-specific)
**Background**: `background` (#e7ecee) -- standard canvas
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+------------------------------------------------------------------+
|                                                                   |
|  EYEBROW: "INFRASTRUCTURE"                       (centered)      |
|                                                                   |
|  HEADLINE (text-heading-lg, centered):                            |
|  Built on Trusted Platforms                                       |
|                                                                   |
|  SUB-TEXT (text-body-lg, centered):                               |
|  We chose infrastructure partners with proven security            |
|  track records, not the cheapest option.                          |
|                                                                   |
|  +------------------+ +------------------+ +------------------+   |
|  | [DO logo/icon]   | | [Supabase icon]  | | [CF logo/icon]   |   |
|  |                  | |                  | |                  |   |
|  | DigitalOcean     | | Supabase         | | Cloudflare       |   |
|  |                  | |                  | |                  |   |
|  | Application      | | Database and     | | CDN, DDoS        |   |
|  | hosting.         | | authentication.  | | protection,      |   |
|  | Docker/K8s via   | | PostgreSQL with  | | SSL/TLS          |   |
|  | DOKS. US-East    | | row-level        | | termination,     |   |
|  | region. SOC 2    | | security. SOC 2  | | WAF. SOC 2       |   |
|  | Type II          | | Type II          | | Type II          |   |
|  | certified.       | | certified.       | | certified.       |   |
|  +------------------+ +------------------+ +------------------+   |
|                                                                   |
+------------------------------------------------------------------+

Mobile (< md):
Cards stack vertically.
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | `py-16 sm:py-20 md:py-24 lg:py-32` | Standard section |
| Heading alignment | `text-center` | Centered |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em]` | "INFRASTRUCTURE" |
| Headline | `.text-heading-lg text-foreground` | 36px desktop / 24px mobile |
| Headline margin | `mb-4 lg:mb-6` | 16-24px |
| Sub-text | `.text-body-lg text-muted-foreground max-w-prose mx-auto` | Centered |
| Sub-text margin | `mb-10 lg:mb-12` | 40-48px |
| Card grid | `grid grid-cols-1 md:grid-cols-3 gap-6` | 3 columns desktop |
| Card | `bg-card rounded-xl border border-border p-6 lg:p-8 text-center shadow-card` | Standard card, centered content |
| Card hover | `shadow-card-hover`, `translateY(-2px)`, `duration-normal` | Subtle lift |
| Logo/icon container | `mx-auto h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4` | Centered |
| Logo/icon | `h-6 w-6 text-primary-700` | Placeholder icons (Cloud, Database, Globe) until partner logos secured |
| Card heading | `.text-heading-sm text-foreground mb-3` | Provider name |
| Card body | `.text-body-sm text-muted-foreground` | Provider description |
| SOC 2 badge | `<Badge variant="default" size="sm" className="mt-4">SOC 2 Type II</Badge>` | Each provider |

#### Copy

**Eyebrow**: `INFRASTRUCTURE`

**Headline**: `Built on Trusted Platforms`

**Sub-text**: `We chose infrastructure partners with proven security track records, not the cheapest option.`

**DigitalOcean Card**:
- Heading: `DigitalOcean`
- Body: `Application hosting and file storage. Docker containers orchestrated via DOKS (managed Kubernetes). US-East region. SOC 2 Type II certified.`
- Badge: `SOC 2 Type II`

**Supabase Card**:
- Heading: `Supabase`
- Body: `Database and authentication. PostgreSQL with row-level security policies. Real-time subscriptions for monitoring. US-hosted instances. SOC 2 Type II certified.`
- Badge: `SOC 2 Type II`

**Cloudflare Card**:
- Heading: `Cloudflare`
- Body: `CDN, DDoS protection, SSL/TLS termination, and Web Application Firewall. Global edge network. No PII cached at edge nodes. SOC 2 Type II certified.`
- Badge: `SOC 2 Type II`

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Heading block | `fadeUp` (stagger) | 20% viewport intersection | Eyebrow 0ms, headline 80ms, sub-text 160ms |
| Cards | `staggerContainer + cardReveal` | After heading | 80ms stagger per card |

#### Accessibility

- `<section aria-labelledby="infrastructure-heading">`
- Headline is `<h2 id="infrastructure-heading">`
- Each card heading is `<h3>`
- SOC 2 badges: `aria-label="SOC 2 Type II certified"` for screen readers
- Provider icons/logos: `aria-hidden="true"` (name is in the heading)

---

### Section 7: Incident Response

**Component**: Custom `IncidentResponseSection` (page-specific)
**Background**: `card` (#f7f8f8) -- elevated surface band
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+------------------------------------------------------------------+
|  [card surface, full-width band]                                  |
|                                                                   |
|  +--max-w-3xl mx-auto (centered)--------------------------------+ |
|  |                                                               | |
|  |  EYEBROW: "INCIDENT RESPONSE"                (centered)      | |
|  |                                                               | |
|  |  HEADLINE (text-heading-lg, centered):                        | |
|  |  If Something Goes Wrong, We Act Fast.                        | |
|  |                                                               | |
|  |  BODY (text-body-lg, centered):                               | |
|  |  We maintain a documented incident response plan.             | |
|  |  Here is our commitment:                                      | |
|  |                                                               | |
|  |  +---TIMELINE----------------------------------------------+ | |
|  |  |                                                          | | |
|  |  |  [1] Detection & Assessment                              | | |
|  |  |      Within 1 hour of becoming aware of a potential      | | |
|  |  |      security incident, our response team assesses       | | |
|  |  |      scope and severity.                                 | | |
|  |  |      |                                                   | | |
|  |  |  [2] Notification                                        | | |
|  |  |      Affected organizations notified within 72 hours     | | |
|  |  |      of confirming a data breach, in compliance with     | | |
|  |  |      applicable regulations.                             | | |
|  |  |      |                                                   | | |
|  |  |  [3] Containment & Remediation                           | | |
|  |  |      Immediate steps to contain the incident, followed   | | |
|  |  |      by root cause analysis and system hardening.        | | |
|  |  |      |                                                   | | |
|  |  |  [4] Post-Incident Report                                | | |
|  |  |      Written report provided to affected organizations   | | |
|  |  |      detailing what happened, what data was involved,    | | |
|  |  |      what we did, and what we changed to prevent         | | |
|  |  |      recurrence.                                         | | |
|  |  |                                                          | | |
|  |  +----------------------------------------------------------+ | |
|  |                                                               | |
|  |  CONTACT (text-body-md):                                      | |
|  |  Report a security concern: security@safetrekr.com            | |
|  |                                                               | |
|  +---------------------------------------------------------------+ |
|                                                                   |
+------------------------------------------------------------------+

Mobile (< lg):
Same vertical timeline. Narrower padding.
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section background | `bg-card` | #f7f8f8 full-width band |
| Section padding | `py-16 sm:py-20 md:py-24 lg:py-32` | Standard section |
| Content wrapper | `max-w-3xl mx-auto text-center` | Centered, editorial width |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em]` | "INCIDENT RESPONSE" |
| Headline | `.text-heading-lg text-foreground` | 36px desktop / 24px mobile |
| Headline margin | `mb-4 lg:mb-6` | 16-24px |
| Intro body | `.text-body-lg text-muted-foreground max-w-prose mx-auto` | See copy |
| Intro margin | `mb-10 lg:mb-12` | 40-48px |
| Timeline container | `text-left max-w-2xl mx-auto` | Left-aligned timeline |
| Timeline | Uses `TimelineStep` component | Vertical timeline |
| Step number | `h-8 w-8 rounded-full bg-primary-100 text-primary-700 font-display font-bold text-body-sm flex items-center justify-center` | Numbered circle |
| Step connector | `w-[2px] bg-border ml-[15px]` | Vertical line between steps |
| Step title | `.text-heading-sm text-foreground` | Step name |
| Step body | `.text-body-md text-muted-foreground mt-1` | Step description |
| Step spacing | `pb-8` (except last) | 32px between steps |
| Contact line | `text-center mt-10 pt-8 border-t border-border` | Separated at bottom |
| Contact label | `.text-body-sm text-muted-foreground` | "Report a security concern:" |
| Contact email | `.text-body-md text-primary-700 font-medium hover:underline` | `security@safetrekr.com` |

#### Copy

**Eyebrow**: `INCIDENT RESPONSE`

**Headline**: `If Something Goes Wrong, We Act Fast.`

**Intro**: `We maintain a documented incident response plan that is reviewed quarterly. Here is our commitment to you if a security event occurs.`

**Step 1**: Title: `Detection and Assessment` -- Body: `Within 1 hour of becoming aware of a potential security incident, our response team assesses scope and severity.`

**Step 2**: Title: `Notification` -- Body: `Affected organizations notified within 72 hours of confirming a data breach, in compliance with applicable regulations including FERPA breach notification requirements.`

**Step 3**: Title: `Containment and Remediation` -- Body: `Immediate steps to contain the incident, followed by root cause analysis and system hardening to prevent recurrence.`

**Step 4**: Title: `Post-Incident Report` -- Body: `Written report provided to all affected organizations detailing what happened, what data was involved, what actions we took, and what changes we implemented.`

**Contact**: `Report a security concern: security@safetrekr.com`

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Heading block | `fadeUp` (stagger) | 20% viewport intersection | Eyebrow 0ms, headline 80ms, intro 160ms |
| Timeline | `staggerContainer` | After heading | Steps stagger top-to-bottom at 120ms |
| Contact line | `fadeUp` | After timeline | 400ms delay |

#### Accessibility

- `<section aria-labelledby="incident-response-heading">`
- Headline is `<h2 id="incident-response-heading">`
- Timeline uses `<ol aria-label="Incident response steps">` with `<li>` per step
- Step numbers: `aria-hidden="true"` (redundant with ordered list semantics)
- Email link: `<a href="mailto:security@safetrekr.com">security@safetrekr.com</a>`

---

### Section 8: Trust Badges Grid

**Component**: Custom `TrustBadgesGrid` (page-specific)
**Background**: `background` (#e7ecee) -- standard canvas
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+------------------------------------------------------------------+
|                                                                   |
|  EYEBROW: "TRUST SIGNALS"                        (centered)      |
|                                                                   |
|  HEADLINE (text-heading-lg, centered):                            |
|  The Standards We Meet                                            |
|                                                                   |
|  +--------+ +--------+ +--------+ +--------+ +--------+          |
|  | [Lock] | |[Shield]| | [Hash] | |[School]| | [File] |          |
|  |        | |        | |        | |        | |        |          |
|  | AES-256| | TLS    | | SHA-256| | Student| | SOC 2  |          |
|  | Encryp-| | 1.2+   | | Hash   | | Privacy| | Type I |          |
|  | tion   | | Transit| | Chain  | | Pledge | |        |          |
|  +--------+ +--------+ +--------+ +--------+ +--------+          |
|  +--------+ +--------+ +--------+                                 |
|  | [Globe]| |[Server]| |[Shield]|                                 |
|  |        | |        | |        |                                 |
|  | FERPA  | | US Data| | COPPA  |                                 |
|  | Design | | Centers| | Design |                                 |
|  | Align  | |        | | Align  |                                 |
|  +--------+ +--------+ +--------+                                 |
|                                                                   |
+------------------------------------------------------------------+

Tablet (md):
4x2 + remaining row.

Mobile (< md):
2-column grid wrapping naturally.
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | `py-16 sm:py-20 md:py-24 lg:py-28` | Slightly compressed section |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em]` | "TRUST SIGNALS" |
| Headline | `.text-heading-lg text-foreground text-center` | 36px desktop / 24px mobile |
| Headline margin | `mb-10 lg:mb-12` | 40-48px |
| Badge grid | `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6` | Responsive grid |
| Badge card | `bg-card rounded-xl border border-border p-5 text-center shadow-sm` | Compact card |
| Badge card hover | `shadow-card`, `translateY(-1px)`, `duration-fast` | Subtle lift |
| Icon container | `mx-auto h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center mb-3` | Circular icon |
| Icon | `h-5 w-5 text-primary-700` | Lucide icon |
| Badge title | `.text-body-sm text-foreground font-medium` | Badge name |
| Badge subtitle | `.text-body-xs text-muted-foreground mt-1` | Status/context |

#### Trust Badge Data

| # | Icon | Title | Subtitle |
|---|------|-------|----------|
| 1 | `Lock` | AES-256 Encryption | At rest |
| 2 | `ShieldCheck` | TLS 1.2+ | In transit |
| 3 | `Hash` | SHA-256 Hash Chain | Evidence integrity |
| 4 | `GraduationCap` | Student Privacy Pledge | Signed 2024 |
| 5 | `FileCheck` | SOC 2 Type I | In progress |
| 6 | `Scale` | FERPA Alignment | Designed for compliance |
| 7 | `Server` | US Data Centers | All data US-hosted |
| 8 | `Baby` | COPPA Alignment | Designed for compliance |

#### Copy

**Eyebrow**: `TRUST SIGNALS`

**Headline**: `The Standards We Meet`

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Heading block | `fadeUp` (stagger) | 20% viewport intersection | Eyebrow 0ms, headline 80ms |
| Badge grid | `staggerContainer + cardReveal` | After heading | Badges stagger at 60ms each |

#### Accessibility

- `<section aria-labelledby="trust-badges-heading">`
- Headline is `<h2 id="trust-badges-heading">`
- Badge cards are `<div>` (non-interactive, informational)
- "In progress" badges: screen reader text includes full context via `aria-label` on the card: e.g., `aria-label="SOC 2 Type I: Audit in progress"`
- Icon has `aria-hidden="true"`

---

### Section 9: Conversion CTA Banner

**Component**: `CTABand` (shared design system component)
**Variant**: `dark`
**Background**: `secondary` (#123646)
**Dark section**: Yes (2 of 2)
**Container**: Handled internally by CTABand

#### Layout

```
Desktop (>= lg):
+==================================================================+
|  [secondary background]                                           |
|                                                                   |
|  HEADLINE (text-display-md, white, centered):                     |
|  Questions About Our Security Posture?                            |
|                                                                   |
|  BODY (text-body-lg, white/80, centered, max-w-prose):            |
|  We are happy to answer any security, compliance, or data         |
|  handling question. Or schedule a demo and we will walk you       |
|  through everything.                                              |
|                                                                   |
|  [ Get a Demo ]          [ Contact Us ]                           |
|  (primary-on-dark, lg)   (ghost, lg, white text/border)           |
|                                                                   |
+==================================================================+
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | `py-20 lg:py-28` | CTABand standard |
| Background | `bg-secondary` with `[data-theme="dark"]` | Dark authority surface |
| Headline | `.text-display-md text-[var(--color-dark-text-primary)]` | White on dark |
| Body | `.text-body-lg text-[var(--color-dark-text-secondary)] max-w-prose mx-auto` | Muted white |
| Primary CTA | `<Button variant="primary-on-dark" size="lg">` | "Get a Demo" -- links to `/demo` |
| Secondary CTA | `<Button variant="ghost" size="lg" className="text-white border-white/20 hover:bg-white/10">` | "Contact Us" -- links to `/contact` |
| CTA layout | `flex flex-col sm:flex-row gap-4 justify-center` | Centered, stacked on mobile |

#### Copy

**Headline**: `Questions About Our Security Posture?`

**Body**: `We are happy to answer any security, compliance, or data handling question. Or schedule a demo and we will walk you through everything.`

**Primary CTA**: `Get a Demo` -- links to `/demo`
**Secondary CTA**: `Contact Us` -- links to `/contact`

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Section | `fadeIn` | 20% viewport intersection | Entire band fades |
| Headline | `fadeUp` | After section | 0ms |
| Body | `fadeUp` | Stagger | 80ms |
| CTAs | `fadeUp` | Stagger | 160ms |

#### Accessibility

- `<section aria-labelledby="security-cta-heading">`
- Headline is `<h2 id="security-cta-heading">`
- Dark section verified: `dark-text-primary` on `secondary` = 11.6:1 (PASS)
- CTA buttons meet minimum 44x44px touch target

---

## Security Page: User Actions Summary

| Action | Mechanism | Destination |
|--------|-----------|-------------|
| Navigate to procurement page | In-page link (Data Handling footer) | `/procurement` |
| Navigate to privacy policy | In-page link (Data Handling footer) | `/legal/privacy` |
| Email security team | Email link (Incident Response) | `mailto:security@safetrekr.com` |
| Request a demo | CTA banner primary | `/demo` |
| Contact general | CTA banner secondary | `/contact` |

## Security Page: Primary CTAs (Priority Order)

1. "Get a Demo" (CTA banner -- the page itself is informational, not conversion-focused)
2. "Contact Us" (CTA banner secondary)
3. Procurement page link (cross-navigation for evaluators)

---
---

## Cross-Page Design Notes

### Shared Components Across Both Pages

| Component | Procurement | Security |
|-----------|-------------|----------|
| `SiteHeader` | Standard sticky header with all nav items | Same |
| `SiteFooter` | Standard dark footer | Same |
| `Eyebrow` | 6 instances | 8 instances |
| `CTABand variant="dark"` | Section 6 | Section 9 |
| `Badge` | File type badges (PDF, DOCX) | Trust signal badges |
| `Divider variant="route"` | Not used | Between Section 2 and 3 |
| `TimelineStep` | Not used | Section 7 (Incident Response) |
| `FAQSection` | Section 5 | Not used |

### Dark Section Compliance

| Page | Dark Sections Used | Maximum Allowed | Compliant |
|------|-------------------|-----------------|-----------|
| Procurement | 1 (CTA Banner) | 2 | Yes |
| Security | 2 (Compliance Roadmap + CTA Banner) | 2 | Yes |

### Heading Hierarchy Audit

**Procurement Page**:
- `<h1>` -- "Everything Your Procurement Team Needs. In One Place." (Section 1)
- `<h2>` -- "We Respond Fast. Every Time." (Section 2)
- `<h2>` -- "Download. Review. Purchase." (Section 3)
  - `<h3>` -- W-9, Security Questionnaire, Contract Template, DPA, Insurance Certificate, SOC 2 Report (6 cards)
- `<h2>` -- "Questions? We're Here." (Section 4)
- `<h2>` -- "Procurement FAQ" (Section 5)
- `<h2>` -- "Ready to Move Forward?" (Section 6)

**Security Page**:
- `<h1>` -- "Your Data Is Protected. Here's Exactly How." (Section 1)
- `<h2>` -- "Two Layers of Encryption. No Exceptions." (Section 2)
  - `<h3>` -- "AES-256", "TLS 1.2+" (2 cards)
- `<h2>` -- "Every Document. Tamper-Evident." (Section 3)
- `<h2>` -- "Honest About Where We Are. Clear About Where We're Going." (Section 4)
- `<h2>` -- "What We Collect. Where It Lives. How Long We Keep It." (Section 5)
  - `<h3>` -- "What We Collect", "Where It Is Stored", "Retention Policy" (3 cards)
- `<h2>` -- "Built on Trusted Platforms" (Section 6)
  - `<h3>` -- "DigitalOcean", "Supabase", "Cloudflare" (3 cards)
- `<h2>` -- "If Something Goes Wrong, We Act Fast." (Section 7)
- `<h2>` -- "The Standards We Meet" (Section 8)
- `<h2>` -- "Questions About Our Security Posture?" (Section 9)

### Performance Budget

Both pages are SSG (static) with no dynamic data, map tiles, or heavy JavaScript. Expected performance:

| Metric | Budget | Expectation |
|--------|--------|-------------|
| LCP | < 2.5s | < 1.5s (text-heavy, no hero images) |
| CLS | < 0.1 | < 0.05 (no layout shifts -- SSG with font preloads) |
| FID | < 100ms | < 50ms (minimal JS -- accordion, form validation) |
| Total JS | < 100KB | ~60KB (shared bundle + accordion + optional form) |
| Total CSS | < 30KB | ~20KB (shared Tailwind output) |

### Cross-Link Strategy

These two pages are tightly connected in the evaluation journey (see IA Section 4.5):

| From | To | Link Text | Context |
|------|----|-----------|---------|
| Procurement -> Security | `/security` | "View our security posture" | Document downloads section, near SOC 2 report |
| Security -> Procurement | `/procurement` | "Download vendor documentation" | Data Handling footer note, Trust Badges area |
| Pricing -> Procurement | `/procurement` | "For Procurement" | Pricing page Section 8 |
| Segment pages -> Procurement | `/procurement` | "Access procurement resources" | Compliance sections |
| Segment pages -> Security | `/security` | "View Security & Trust" | Compliance sections |
