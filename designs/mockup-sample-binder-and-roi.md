# Mockup Specification: Sample Binder Download + ROI Calculator

**Version**: 1.0
**Date**: 2026-03-24
**Status**: HIGH-FIDELITY MOCKUP SPEC -- Ready for Implementation
**Design System Reference**: `designs/DESIGN-SYSTEM.md` v1.0
**IA Reference**: `designs/INFORMATION-ARCHITECTURE.md` Sections 1.1, 4.3, 4.5
**Contains**: Two page specifications

---
---

# PAGE 1: Sample Binder Download (`/resources/sample-binders`)

---

## Page Metadata

| Property | Value |
|----------|-------|
| **Title** | `Sample Safety Binders | SafeTrekr -- Professional Trip Safety` |
| **Meta description** | `Download a sample SafeTrekr safety binder for your organization type. See exactly what a professionally reviewed trip produces -- 17 safety sections, risk scores, emergency protocols, and audit-ready documentation.` |
| **Page type** | Index Page (SSG via `generateStaticParams`) |
| **Hierarchy** | L2 |
| **Breadcrumb** | `Home > Resources > Sample Binders` |
| **JSON-LD** | `CollectionPage`, `ItemList` (4 binders) |
| **Canonical** | `https://www.safetrekr.com/resources/sample-binders` |
| **OG image** | Custom OG showing fanned binder pages with "Download a Sample Safety Binder" text |
| **Redirects** | `/sample-binders` -> `/resources/sample-binders` (301) |
| **Performance budget** | LCP < 2.5s, CLS < 0.1, FID < 100ms |
| **Conversion target** | 8-15% email capture rate on gated download CTAs |

### JSON-LD Schema

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Sample Safety Binders",
  "description": "Download sample SafeTrekr safety binders for K-12 field trips, international mission trips, corporate travel, and university study abroad programs.",
  "url": "https://www.safetrekr.com/resources/sample-binders",
  "publisher": {
    "@type": "Organization",
    "name": "SafeTrekr"
  },
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "K-12 Field Trip Safety Binder",
        "url": "https://www.safetrekr.com/resources/sample-binders/k12-field-trip"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "International Mission Trip Safety Binder",
        "url": "https://www.safetrekr.com/resources/sample-binders/mission-trip"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Corporate Travel Safety Binder",
        "url": "https://www.safetrekr.com/resources/sample-binders/corporate-travel"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "University Study Abroad Safety Binder",
        "url": "https://www.safetrekr.com/resources/sample-binders/study-abroad"
      }
    ]
  }
}
```

---

## Page Layout Overview

```
+=========================================================================+
|  [SiteHeader -- sticky, shared component]                               |
+=========================================================================+
|  Breadcrumb: Home > Resources > Sample Binders                          |
|                                                                         |
|  SECTION 1: Hero                                           bg-background|
|  SECTION 2: Binder Cards (4 cards)                         bg-card      |
|  SECTION 3: What's Inside (17-section breakdown)           bg-background|
|  SECTION 4: Trust Reinforcement                            bg-secondary |
|  SECTION 5: Conversion CTA Banner                          bg-primary-700|
|                                                                         |
+=========================================================================+
|  [SiteFooter -- shared component]                                       |
+=========================================================================+

+-- [LeadCaptureModal -- overlay, triggered by gated CTA] ---------------+
```

**Dark section count**: 1 (Section 4: Trust Reinforcement on `secondary`). CTA Banner uses `brand` variant (`primary-700`). Footer does not count per design system rules. Total dark sections = 1, within the 2-per-page limit.

---

## Shared Component: LeadCaptureModal

### Purpose
Email capture gate for binder downloads. Appears when any "Download" CTA is clicked. Minimal friction -- single email field with org type for segmentation. The modal knows which binder triggered the open and pre-fills the segment context.

### Wireframe

```
+------------------------------------------------------------+
|                                                   [ X ]    |
|                                                            |
|  [EvidenceBinder icon, 32px, primary-700]                  |
|                                                            |
|  Download Your Sample Safety Binder                        |
|                                                            |
|  Enter your work email to receive the                      |
|  {Binder Name} instantly.                                  |
|                                                            |
|  +------------------------------------------------------+  |
|  | Work Email                                            |  |
|  +------------------------------------------------------+  |
|                                                            |
|  +------------------------------------------------------+  |
|  | Organization Type                              [v]    |  |
|  +------------------------------------------------------+  |
|                                                            |
|  +------------------------------------------------------+  |
|  |             [ Download Now ]              primary btn  |  |
|  +------------------------------------------------------+  |
|                                                            |
|  We'll also send a brief email series on trip safety       |
|  best practices. Unsubscribe anytime.                      |
|                                                            |
|  [lock icon] Your data is encrypted and never shared.      |
|                                                            |
+------------------------------------------------------------+
```

### Component Mapping

| Element | Component / Class | Token Reference |
|---------|-------------------|-----------------|
| Overlay | `bg-black/50 fixed inset-0` | `--z-overlay: 40` |
| Modal | shadcn/ui `Dialog` primitive | `--z-modal: 50` |
| Modal surface | `bg-card rounded-2xl shadow-xl max-w-md w-full mx-4 p-8` | `--color-card: #f7f8f8`, `--radius-2xl: 20px`, `--shadow-xl` |
| Close button | `<Button variant="ghost" size="icon">` with `X` icon | 40x40px, top-right |
| Icon | `EvidenceBinder` custom icon, 32px, `text-primary-700` | `--color-primary-700: #33704b` |
| Headline | `.text-heading-md text-foreground` | 28px desktop, `font-weight: 600` |
| Description | `.text-body-md text-muted-foreground mt-2` | `--color-muted-foreground: #4d5153` |
| Email field | `<Input type="email">`, `bg-card border-border` | Standard form input styling |
| Org type | `<Select>` (shadcn/ui), options: K-12, Church/Mission, Higher Ed, Corporate, Other | Standard select styling |
| Submit button | `<Button variant="primary" size="default" className="w-full mt-4">` | `bg-primary-600 text-white`, full-width |
| Consent text | `.text-body-xs text-muted-foreground mt-4` | 12px, `--color-muted-foreground: #4d5153` |
| Security line | `.text-body-xs text-muted-foreground flex items-center gap-1.5` | `Lock` icon 14px |
| Honeypot | Hidden input field, `display: none` | Must be empty on submit |
| Turnstile | Invisible Cloudflare Turnstile | Server-side token validation |

### Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Work Email | email | Yes | Email format (Zod), no free email domains (gmail, yahoo, hotmail) |
| Organization Type | select | Yes | K-12 School/District, Church/Mission Org, Higher Education, Corporate/Sports, Other |
| Binder Slug | hidden | Yes | Pre-filled from CTA context (`k12-field-trip`, `mission-trip`, `corporate-travel`, `study-abroad`) |
| Honeypot | hidden | -- | Must be empty |
| Cloudflare Turnstile | invisible | -- | Server-side token validation |

### Success State

```
+------------------------------------------------------------+
|                                                   [ X ]    |
|                                                            |
|        [Check icon, 48px, primary-500, statusPulse]        |
|                                                            |
|           Your Binder Is on Its Way                        |
|                                                            |
|  We've sent the {Binder Name} to {email}.                  |
|  Check your inbox -- it should arrive within 60 seconds.   |
|                                                            |
|  +------------------------------------------------------+  |
|  |          [ Download Directly ]           primary btn  |  |
|  +------------------------------------------------------+  |
|                                                            |
|  +------------------------------------------------------+  |
|  |          [ Request a Demo ]           secondary btn   |  |
|  +------------------------------------------------------+  |
|                                                            |
+------------------------------------------------------------+
```

The "Download Directly" button triggers an immediate browser download of the PDF (the link is only generated server-side after email capture succeeds). "Request a Demo" links to `/demo` with UTM params preserving the binder context.

### Form Submission Behavior

1. Client-side validation (Zod) on blur and submit
2. Server-side validation (Zod) on Server Action
3. Cloudflare Turnstile verification
4. Save to Supabase `form_submissions` table with `form_type: 'binder_download'`, `binder_slug`, UTM params, referrer
5. Add to email nurture sequence (Resend) -- 5-part series on trip safety
6. Generate signed download URL (expires in 24 hours)
7. Send binder PDF via email (Resend) with download link
8. Show success state with direct download button
9. Fire Plausible events: `binder_download_start` (modal open), `binder_download_complete` (form submit)

### Accessibility

- `Dialog` with `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to headline ID
- Focus trapped within modal while open
- First focusable element: email input (auto-focused)
- Escape key closes modal. Backdrop click closes modal.
- Focus returns to the triggering CTA on close
- All fields have `<label>` elements. Errors use `aria-describedby`
- `aria-busy="true"` on submit button during loading
- `aria-live="polite"` region for success/error announcements

### Animation

- Modal: `scaleIn` variant (opacity 0 + scale 0.95 to opacity 1 + scale 1, 300ms, spring easing)
- Backdrop: Fade in over 200ms
- Success state check icon: `statusPulse` animation (scale 0 to 1.4 to 1, 600ms)
- `prefers-reduced-motion`: Modal appears instantly, no scale transform. Check icon appears without pulse.

---

## Section 1: Hero

### Purpose
Immediately explain what a SafeTrekr safety binder is, why it matters, and give the visitor a reason to download one. This is the #1 lead magnet for the entire site -- the hero must communicate tangible value in under 5 seconds. No abstract promises. The binder is a real, physical (digital) artifact they can hold, share, and evaluate.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-background                                  |
|  max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12                         |
|  pt-24 pb-16 lg:pt-32 lg:pb-20                                         |
|                                                                         |
|  +---------------------------------------+  +------------------------+ |
|  |                                       |  |                        | |
|  |  [Eyebrow]                            |  |   [DocumentPreview]    | |
|  |  YOUR #1 RESOURCE                     |  |                        | |
|  |                                       |  |   +-----------------+  | |
|  |  See Exactly What a                   |  |   | SafeTrekr       |  | |
|  |  Professional Trip                    |  |   | Safety Binder   |  | |
|  |  Safety Review                        |  |   |                 |  | |
|  |  Produces                             |  |   | Section 1...    |  | |
|  |                                       |  |   | Section 2...    |  | |
|  |  Every trip reviewed by SafeTrekr     |  |   | [Verified]      |  | |
|  |  produces a comprehensive safety      |  |   | SHA-256: a4f... |  | |
|  |  binder -- 17 sections of risk        |  |   +-----------------+  | |
|  |  analysis, emergency protocols,       |  |  +-----------------+   | |
|  |  and audit-ready documentation.       |  |  |  (offset page)  |   | |
|  |                                       |  |  +-----------------+   | |
|  |  Download a sample binder and see     |  | +-----------------+    | |
|  |  exactly what your board, insurance   |  | |  (offset page)  |    | |
|  |  carrier, and stakeholders receive.   |  | +-----------------+    | |
|  |                                       |  |                        | |
|  |  [ Choose Your Binder ] [ Get Demo ]  |  +------------------------+ |
|  |                                       |                             |
|  +---------------------------------------+                             |
|                                                                         |
+=========================================================================+
```

### Component Mapping

| Element | Component / Class | Token Reference |
|---------|-------------------|-----------------|
| Section | `<section aria-label="Sample safety binders">` | |
| Background | `bg-background` | `--color-background: #e7ecee` |
| Container | `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12` | `--container-max: 1280px` |
| Padding | `pt-16 pb-12 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20 xl:pt-28 xl:pb-24` | Hero top/bottom scale |
| Grid | `grid lg:grid-cols-12 gap-8 lg:gap-12 items-center` | Text: `lg:col-span-5`, Visual: `lg:col-span-7` |
| Eyebrow | `<Eyebrow>` component | `.text-eyebrow text-primary-700`, uppercase |
| Headline | `<h1>`, `.text-display-lg text-foreground` | 56px desktop, 34px mobile, `font-weight: 700`, `line-height: 1.1` |
| Body | `<p>`, `.text-body-lg text-muted-foreground max-w-prose` | 20px desktop, `--color-muted-foreground: #4d5153` |
| Primary CTA | `<Button variant="primary" size="lg">` | `bg-primary-600 text-white`, 52px height |
| Secondary CTA | `<Button variant="secondary" size="lg">` | Transparent, `border-border`, 52px height |
| CTA row | `flex flex-col sm:flex-row gap-4 mt-8` | Stacked < 640px, horizontal >= 640px |
| Visual | `<DocumentPreview>` component (from design system) | Stacked paper composition with brand elements |

### Content (Exact Copy)

- **Eyebrow**: `YOUR #1 RESOURCE`
- **Headline**: `See Exactly What a Professional Trip Safety Review Produces`
- **Body**: `Every trip reviewed by SafeTrekr produces a comprehensive safety binder -- 17 sections of risk analysis, emergency protocols, and audit-ready documentation. Download a sample binder and see exactly what your board, insurance carrier, and stakeholders receive.`
- **Primary CTA**: `Choose Your Binder` -> scrolls to Section 2 (binder cards), `href="#binders"`
- **Secondary CTA**: `Get a Demo` -> `/demo`

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 640px) | Single column, visual hidden on mobile (LCP priority for text). `.text-display-lg` scales to 34px. CTAs stack vertically, full-width. `pt-16 pb-12`. |
| sm (640px) | CTAs go horizontal. Visual remains hidden. |
| md (768px) | Visual appears below text column (stacked). |
| lg (1024px) | Side-by-side grid (5-col text / 7-col visual). `pt-24 pb-20`. |
| xl (1280px) | `pt-28 pb-24`. Max container centered. Generous margins. |

**Design note**: The `DocumentPreview` is hidden on mobile (< 768px) because LCP performance matters more than visual flair for the top lead magnet page. The thumbnails in the binder cards (Section 2) compensate by providing visual proof lower on the page.

### Accessibility

- `<h1>` is the page heading. One per page.
- Primary CTA scrolls to the binder cards section using `href="#binders"` with `scroll-behavior: smooth`. The target section has `id="binders"` and `tabindex="-1"` for programmatic focus.
- CTAs meet 44x44px touch target at `size="lg"`.
- Focus-visible ring on both buttons.
- `DocumentPreview` is decorative: `aria-hidden="true"`.
- No animation on initial load -- this is LCP-critical content.

### Animation

- **Text column**: `fadeUp` staggered at 80ms (eyebrow, headline, body, CTAs).
- **Visual**: `documentStack` animation (opacity 0 + y 16 + rotateX -5 to final, slow + spring). Triggers at 20% intersection.
- `prefers-reduced-motion`: All elements render immediately, no transforms.

---

## Section 2: Binder Cards

### Purpose
Present the four sample binders as distinct, segment-specific artifacts. Each card is a self-contained conversion unit with a visual preview (ungated first 2-3 pages as thumbnails), a description of what is inside, and a gated download CTA. The visitor should be able to identify their segment in under 2 seconds and click.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-card                                        |
|  border-y border-border                                                 |
|  id="binders"                                                           |
|  max-w-[1280px] mx-auto  py-20 lg:py-24                                |
|                                                                         |
|            [Eyebrow]  CHOOSE YOUR BINDER                                |
|           Download the sample that matches your organization.           |
|                                                                         |
|  +------------------------------+  +------------------------------+    |
|  |                              |  |                              |    |
|  |  +----------+----------+    |  |  +----------+----------+    |    |
|  |  | pg 1     | pg 2     |    |  |  | pg 1     | pg 2     |    |    |
|  |  | [thumb]  | [thumb]  |    |  |  | [thumb]  | [thumb]  |    |    |
|  |  +----------+----------+    |  |  +----------+----------+    |    |
|  |  | pg 3 (partial)      |    |  |  | pg 3 (partial)      |    |    |
|  |  +---------------------+    |  |  +---------------------+    |    |
|  |                              |  |                              |    |
|  |  [School icon]               |  |  [Church icon]               |    |
|  |  K-12 Field Trip             |  |  International Mission Trip  |    |
|  |  Safety Binder               |  |  Safety Binder               |    |
|  |                              |  |                              |    |
|  |  17-section safety review    |  |  17-section safety review    |    |
|  |  for domestic school field   |  |  for international mission   |    |
|  |  trips. FERPA-aware. Board-  |  |  trips. Multi-destination.   |    |
|  |  ready documentation.        |  |  Insurance-ready docs.       |    |
|  |                              |  |                              |    |
|  |  [Badge: 17 Sections]        |  |  [Badge: 17 Sections]        |    |
|  |  [Badge: FERPA-Aware]        |  |  [Badge: Multi-Destination]  |    |
|  |                              |  |                              |    |
|  |  [ Download Sample ] primary |  |  [ Download Sample ] primary |    |
|  |  Preview first 3 pages ->    |  |  Preview first 3 pages ->    |    |
|  +------------------------------+  +------------------------------+    |
|                                                                         |
|  +------------------------------+  +------------------------------+    |
|  |                              |  |                              |    |
|  |  +----------+----------+    |  |  +----------+----------+    |    |
|  |  | pg 1     | pg 2     |    |  |  | pg 1     | pg 2     |    |    |
|  |  | [thumb]  | [thumb]  |    |  |  | [thumb]  | [thumb]  |    |    |
|  |  +----------+----------+    |  |  +----------+----------+    |    |
|  |  | pg 3 (partial)      |    |  |  | pg 3 (partial)      |    |    |
|  |  +---------------------+    |  |  +---------------------+    |    |
|  |                              |  |                              |    |
|  |  [Building icon]             |  |  [GraduationCap icon]        |    |
|  |  Corporate Travel            |  |  University Study Abroad     |    |
|  |  Safety Binder               |  |  Safety Binder               |    |
|  |                              |  |                              |    |
|  |  17-section safety review    |  |  17-section safety review    |    |
|  |  for corporate team travel   |  |  for university study abroad |    |
|  |  and sports trips. Duty-of-  |  |  programs. Clery Act aware.  |    |
|  |  care documentation.         |  |  Parent/guardian ready.       |    |
|  |                              |  |                              |    |
|  |  [Badge: 17 Sections]        |  |  [Badge: 17 Sections]        |    |
|  |  [Badge: Duty of Care]       |  |  [Badge: Clery Act]          |    |
|  |                              |  |                              |    |
|  |  [ Download Sample ] primary |  |  [ Download Sample ] primary |    |
|  |  Preview first 3 pages ->    |  |  Preview first 3 pages ->    |    |
|  +------------------------------+  +------------------------------+    |
|                                                                         |
+=========================================================================+
```

### Component Mapping

| Element | Component / Class | Token Reference |
|---------|-------------------|-----------------|
| Section | `<section id="binders" aria-label="Sample binder downloads">` | |
| Background | `bg-card border-y border-border` | `--color-card: #f7f8f8`, `--color-border: #b8c3c7` |
| Container | `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12` | |
| Padding | `py-16 sm:py-20 lg:py-24 xl:py-32` | Standard section scale |
| Section heading | `<Eyebrow>` + `<h2>`, centered | Eyebrow: `.text-eyebrow text-primary-700`. Heading: `.text-display-md text-foreground text-center`. Sub-text: `.text-body-lg text-muted-foreground text-center max-w-prose mx-auto` |
| Grid | `grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-12` | 2x2 at md+, stacked below |
| Binder card | New component: `<BinderCard>` | See spec below |

### BinderCard Component Specification

**File**: `components/marketing/binder-card.tsx`

| Element | Class | Token |
|---------|-------|-------|
| Card | `bg-white rounded-xl border border-border shadow-card hover:shadow-card-hover transition-shadow duration-normal overflow-hidden` | `--shadow-card`, `--shadow-card-hover`, `--radius-xl: 16px` |
| Thumbnail area | `bg-background p-6 pb-0` | Subtle canvas tint behind thumbnails |
| Thumbnail grid | `grid grid-cols-2 gap-3` for pages 1-2, single half-width row for page 3 | |
| Thumbnail image | `<Image>` with `rounded-md border border-border shadow-sm`, aspect `3:4` | Real page renders as optimized WebP, `loading="lazy"` |
| Page 3 treatment | Clipped at 50% height with `overflow-hidden`, soft gradient overlay `bg-gradient-to-b from-transparent to-background` | Creates a "peek" effect suggesting more content behind the gate |
| Content area | `p-6 pt-5` | 24px padding |
| Icon container | `h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center` | |
| Icon | Segment-specific Lucide icon, 20px, `text-primary-700` | |
| Title | `.text-heading-md text-foreground mt-3` | 28px desktop |
| Description | `.text-body-md text-muted-foreground mt-2 max-w-[45ch]` | |
| Badge row | `flex flex-wrap gap-2 mt-4` | |
| Badge | `<Badge variant="default" size="sm">` | `bg-primary-50 text-primary-800`, `--radius-full` |
| Download CTA | `<Button variant="primary" size="default" className="w-full mt-6">` | `bg-primary-600 text-white`, full-width |
| Preview link | `<button>` styled as `text-body-sm text-primary-700 font-medium mt-2 text-center w-full` with `ArrowRight` icon | Opens a lightbox with higher-res previews of first 3 pages |

**Props**:
```typescript
interface BinderCardProps {
  slug: 'k12-field-trip' | 'mission-trip' | 'corporate-travel' | 'study-abroad';
  icon: LucideIcon;
  title: string;
  description: string;
  badges: string[];
  thumbnails: {
    page1: StaticImageData;
    page2: StaticImageData;
    page3: StaticImageData; // Shown partially, clipped
  };
  onDownloadClick: (slug: string) => void; // Opens LeadCaptureModal
}
```

### Card Data

| Card | Icon | Title | Description | Badges | Segment |
|------|------|-------|-------------|--------|---------|
| **K-12** | `School` | `K-12 Field Trip Safety Binder` | `17-section safety review for domestic school field trips. FERPA-aware documentation ready for your superintendent, school board, and insurance carrier.` | `17 Sections`, `FERPA-Aware`, `Board-Ready` | `k12-field-trip` |
| **Mission Trip** | `Church` | `International Mission Trip Safety Binder` | `17-section safety review for international mission trips. Multi-destination risk scoring, emergency protocols, and insurance-ready documentation.` | `17 Sections`, `Multi-Destination`, `Insurance-Ready` | `mission-trip` |
| **Corporate** | `Building2` | `Corporate Travel Safety Binder` | `17-section safety review for corporate team travel and sports trips. Duty-of-care documentation that satisfies your legal and HR requirements.` | `17 Sections`, `Duty of Care`, `HR-Ready` | `corporate-travel` |
| **Study Abroad** | `GraduationCap` | `University Study Abroad Safety Binder` | `17-section safety review for university study abroad programs. Clery Act aware, parent/guardian accessible, and institutional compliance ready.` | `17 Sections`, `Clery Act`, `Parent-Ready` | `study-abroad` |

### Content (Exact Copy)

- **Eyebrow**: `CHOOSE YOUR BINDER`
- **Section heading**: `Download the Sample That Matches Your Organization`
- **Sub-text**: `Each binder contains the same 17-section professional review tailored to a specific trip type. Preview the first three pages free -- then download the complete binder.`

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 768px) | Single column stack. Cards full-width. Thumbnail grid remains 2-column (pages 1 and 2 side-by-side, page 3 below, clipped). |
| md (768px) | 2-column grid. Cards fill equal width. |
| lg (1024px) | Same 2-column, wider gaps (`gap-8`). Thumbnails render larger. |
| xl (1280px) | Max container. Generous card padding. |

### Accessibility

- Section has `id="binders"` for anchor navigation from hero CTA and `tabindex="-1"` for programmatic focus.
- Section uses `aria-label="Sample binder downloads"`.
- Each card is a landmark containing the title as `<h3>`.
- Thumbnail images have descriptive `alt` text: `"Page {n} preview of the {Binder Name} showing {section name}"`.
- Download CTA: `aria-label="Download {Binder Name} -- requires email"` to communicate the gate.
- Preview link: `aria-label="Preview first 3 pages of {Binder Name}"`.
- Badge text is descriptive and does not rely on color alone.
- All interactive elements meet 44x44px touch targets.
- Focus-visible ring on CTA and preview link.

### Animation

- Section heading: `fadeUp` staggered at 80ms.
- Cards: `staggerContainer` + `cardReveal` at 100ms intervals. Top-left card first, then top-right, bottom-left, bottom-right (reading order).
- `prefers-reduced-motion`: All cards appear immediately, no transforms.

---

## Section 3: What's Inside

### Purpose
Prove the depth of the safety review by listing all 17 sections. This converts skeptics who think "safety binder" might mean a generic checklist. Every section name is specific, professional, and implies rigor. Grouped by category for scanability.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-background                                  |
|  max-w-[1280px] mx-auto  py-20 lg:py-24                                |
|                                                                         |
|            [Eyebrow]  THE 17-SECTION REVIEW                             |
|       Every Binder Covers the Same Rigorous Analysis                    |
|                                                                         |
|  +----------------------------------+  +------------------------------+ |
|  |  DESTINATION SAFETY              |  |  HEALTH & MEDICAL            | |
|  |                                  |  |                              | |
|  |  [Check] Political Stability     |  |  [Check] Health Advisories   | |
|  |          & Travel Advisories     |  |          & Vaccinations      | |
|  |  [Check] Crime & Personal        |  |  [Check] Medical Facility    | |
|  |          Safety Assessment       |  |          Access & Quality    | |
|  |  [Check] Natural Hazard &        |  |  [Check] Food & Water        | |
|  |          Weather Risk            |  |          Safety Assessment   | |
|  |  [Check] Infrastructure &        |  |                              | |
|  |          Transportation Safety   |  |                              | |
|  +----------------------------------+  +------------------------------+ |
|                                                                         |
|  +----------------------------------+  +------------------------------+ |
|  |  EMERGENCY PLANNING              |  |  LEGAL & COMPLIANCE          | |
|  |                                  |  |                              | |
|  |  [Check] Emergency Contact       |  |  [Check] Regulatory          | |
|  |          Directory               |  |          Compliance Check    | |
|  |  [Check] Evacuation Routes       |  |  [Check] Insurance           | |
|  |          & Rally Points          |  |          Documentation       | |
|  |  [Check] Hospital & Embassy      |  |  [Check] Liability &         | |
|  |          Locations               |  |          Duty of Care Review | |
|  |  [Check] Communication           |  |                              | |
|  |          Protocols               |  |                              | |
|  +----------------------------------+  +------------------------------+ |
|                                                                         |
|  +----------------------------------+                                   |
|  |  DOCUMENTATION & EVIDENCE        |                                   |
|  |                                  |                                   |
|  |  [Check] Risk Score Summary      |                                   |
|  |          (Monte Carlo)           |                                   |
|  |  [Check] Participant Readiness   |                                   |
|  |          Checklist               |                                   |
|  |  [Check] SHA-256 Hash-Chain      |                                   |
|  |          Evidence Integrity      |                                   |
|  +----------------------------------+                                   |
|                                                                         |
|         Every section reviewed by a trained safety analyst.             |
|            Every finding documented and hash-verified.                  |
|                                                                         |
|              [ Download a Sample Binder ]  primary                      |
|                                                                         |
+=========================================================================+
```

### Component Mapping

| Element | Component / Class | Token Reference |
|---------|-------------------|-----------------|
| Section | `<section aria-label="What's inside the safety binder">` | |
| Background | `bg-background` | `--color-background: #e7ecee` |
| Container | `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12` | |
| Padding | `py-16 sm:py-20 lg:py-24 xl:py-32` | Standard section scale |
| Section heading | Eyebrow + `<h2>` centered | `.text-display-md text-foreground text-center` |
| Category grid | `grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-12` | 2-column at md+ |
| Category card | `bg-card rounded-xl border border-border p-6 sm:p-8` | `--color-card: #f7f8f8`, `--radius-xl: 16px` |
| Category title | `.text-heading-sm text-foreground font-semibold mb-4` | `Plus Jakarta Sans`, 22px desktop |
| Section item | `flex items-start gap-3 py-2` | |
| Check icon | `Check` icon, 16px, `text-primary-600` in `h-5 w-5 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5` | |
| Section name | `.text-body-md text-foreground` | |
| Summary text | `.text-body-lg text-muted-foreground text-center max-w-prose mx-auto mt-8` | |
| CTA | `<Button variant="primary" size="lg">` centered, `mt-6` | Triggers `LeadCaptureModal` (no pre-selected binder -- modal shows a binder selector) |

### The 17 Sections (Exact Copy)

**Destination Safety** (4 sections):
1. Political Stability & Travel Advisories
2. Crime & Personal Safety Assessment
3. Natural Hazard & Weather Risk
4. Infrastructure & Transportation Safety

**Health & Medical** (3 sections):
5. Health Advisories & Vaccinations
6. Medical Facility Access & Quality
7. Food & Water Safety Assessment

**Emergency Planning** (4 sections):
8. Emergency Contact Directory
9. Evacuation Routes & Rally Points
10. Hospital & Embassy Locations
11. Communication Protocols

**Legal & Compliance** (3 sections):
12. Regulatory Compliance Check
13. Insurance Documentation
14. Liability & Duty of Care Review

**Documentation & Evidence** (3 sections):
15. Risk Score Summary (Monte Carlo)
16. Participant Readiness Checklist
17. SHA-256 Hash-Chain Evidence Integrity

**Summary copy**: `Every section reviewed by a trained safety analyst. Every finding documented and hash-verified.`

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 768px) | Single column. Category cards stack. Check items remain full-width. |
| md (768px) | 2-column grid for category cards. Last card (Documentation & Evidence, 3 items) spans single column, left-aligned. |
| lg (1024px) | Same layout, wider gaps. |
| xl (1280px) | Max container. |

### Accessibility

- `<h2>` for section heading. Category titles are `<h3>`.
- Check icons: `aria-hidden="true"` (the text label carries meaning).
- Section items form an ordered list within each category: `<ol>` with list items.
- CTA: `aria-label="Download a sample safety binder -- requires email"`.

### Animation

- Section heading: `fadeUp` staggered at 80ms.
- Category cards: `staggerContainer` + `cardReveal` at 100ms intervals (top-left, top-right, bottom-left, bottom-right, then final card).
- Check items within each card: `checklistReveal` (opacity 0, x: -12 to opacity 1, x: 0) staggered at 60ms. Triggered when parent card enters viewport.
- `prefers-reduced-motion`: All items appear immediately.

---

## Section 4: Trust Reinforcement

### Purpose
Anchor credibility with the security, data sourcing, and encryption details that matter to evaluators, risk managers, and procurement officers. This is a dark section that provides visual contrast and authority.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-secondary  [data-theme="dark"]              |
|  max-w-[1280px] mx-auto  py-16 lg:py-24                                |
|                                                                         |
|  +-------------------+  +-------------------+  +-------------------+   |
|  |                   |  |                   |  |                   |   |
|  |  5                |  |  AES-256          |  |  SHA-256          |   |
|  |  Government       |  |  Encryption       |  |  Evidence         |   |
|  |  Intel Sources    |  |  Standard         |  |  Chain            |   |
|  |                   |  |                   |  |                   |   |
|  +-------------------+  +-------------------+  +-------------------+   |
|                                                                         |
|  Data sourced from: [NOAA] [USGS] [CDC] [GDACS] [ReliefWeb]           |
|                                                                         |
|  "Every page of every binder is cryptographically signed.               |
|   Any modification to any section is detectable."                       |
|                                                                         |
+=========================================================================+
```

### Component Mapping

| Element | Component / Class | Token Reference |
|---------|-------------------|-----------------|
| Section | `<DarkAuthoritySection>` wrapper, `<section aria-label="Trust and security">` | `bg-secondary`, `[data-theme="dark"]` |
| Container | `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12` | |
| Padding | `py-12 sm:py-16 lg:py-24` | Compressed section scale for dark sections |
| Stat row | `grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8` | |
| Stat value | `.text-display-md font-display text-dark-text-primary` | `--color-dark-text-primary: #f7f8f8` |
| Stat label | `.text-body-sm text-dark-text-secondary mt-1` | `--color-dark-text-secondary: #b8c3c7` |
| Source logos | `<LogoCloud>` variant with NOAA, USGS, CDC, GDACS, ReliefWeb logos | Grayscale 60% opacity, 28px height, `gap-x-10` |
| Quote | `.text-body-lg text-dark-text-secondary text-center max-w-prose mx-auto italic mt-8` | |

### Content (Exact Copy)

**Stat 1**: Value: `5`, Label: `Government Intelligence Sources`
**Stat 2**: Value: `AES-256`, Label: `Encryption Standard`
**Stat 3**: Value: `SHA-256`, Label: `Evidence Chain Integrity`

**Source line**: `Data sourced from: NOAA / USGS / CDC / GDACS / ReliefWeb`

**Quote**: `Every page of every binder is cryptographically signed. Any modification to any section is detectable.`

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 640px) | Single column stack for stat cards. Source logos wrap to 2 rows. Quote text tightens. |
| sm (640px) | 3-column grid for stats. Logos single row. |
| lg (1024px) | Same layout with wider gaps. |

### Accessibility

- Section wrapped in `<DarkAuthoritySection>` with `[data-theme="dark"]` for token overrides.
- `aria-label="Trust and security"` on section.
- Stat values use `aria-label` with full context: `aria-label="5 government intelligence sources"`.
- Government logos: Each logo has descriptive `alt` text. Logos are decorative reinforcement, not the sole information carrier (the "Data sourced from" text provides the same info).
- Dark-text-primary (#f7f8f8) on secondary (#123646) = 11.6:1 -- PASS.
- Dark-text-secondary (#b8c3c7) on secondary (#123646) = 7.0:1 -- PASS.

### Animation

- `fadeIn` on entire section (200ms) at 20% intersection.
- Stat values: `counterAnimate` for "5" (counts from 0, 1.5s). "AES-256" and "SHA-256" use `fadeIn`.
- Logo cloud: `fadeIn` with stagger at 80ms per logo.
- `prefers-reduced-motion`: All elements appear immediately.

---

## Section 5: Conversion CTA Banner

### Purpose
Final push for visitors who scrolled the entire page. Offers both the binder download and the demo request.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-primary-700  (brand variant)                |
|  py-20 lg:py-28                                                         |
|                                                                         |
|          Ready to See What Professional Trip Safety Looks Like?         |
|                                                                         |
|    Download a sample binder for your organization, or schedule          |
|    a personalized demo to see SafeTrekr in action.                      |
|                                                                         |
|          [ Download a Sample Binder ]   [ Get a Demo ]                  |
|          primary-on-dark                 secondary (outline light)       |
|                                                                         |
+=========================================================================+
```

### Component Mapping

| Element | Component / Class | Token Reference |
|---------|-------------------|-----------------|
| Section | `<CTABand variant="brand">` | `bg-primary-700`, white text |
| Headline | `.text-display-md text-white text-center` | |
| Body | `.text-body-lg text-white/80 text-center max-w-prose mx-auto` | |
| Primary CTA | `<Button variant="primary-on-dark" size="lg">` | `bg-white text-secondary` |
| Secondary CTA | `<Button variant="secondary" size="lg" className="border-white/30 text-white hover:bg-white/10">` | Light outline variant |
| CTA row | `flex flex-col sm:flex-row items-center justify-center gap-4 mt-8` | |

### Content (Exact Copy)

- **Headline**: `Ready to See What Professional Trip Safety Looks Like?`
- **Body**: `Download a sample binder for your organization, or schedule a personalized demo to see SafeTrekr in action.`
- **Primary CTA**: `Download a Sample Binder` -> scrolls to `#binders` section
- **Secondary CTA**: `Get a Demo` -> `/demo`

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 640px) | CTAs stack vertically, full-width. Tighter padding `py-12`. |
| sm (640px) | CTAs horizontal. |
| lg (1024px) | `py-20 lg:py-28`. |

### Accessibility

- White text on `primary-700` (#33704b): 6.1:1 -- PASS.
- White/80 on `primary-700`: approximately 5.0:1 -- PASS.
- CTAs meet touch targets. Focus-visible ring uses white ring on dark background.
- `aria-label` not needed on section (CTABand is a generic landmark).

### Animation

- `fadeUp` on headline + body + CTAs, staggered at 100ms.
- `prefers-reduced-motion`: Renders immediately.

---
---

# PAGE 2: ROI Calculator (`/resources/roi-calculator`)

---

## Page Metadata

| Property | Value |
|----------|-------|
| **Title** | `ROI Calculator | SafeTrekr -- Professional Trip Safety` |
| **Meta description** | `Calculate your organization's return on investment with SafeTrekr. Compare manual safety planning costs to SafeTrekr pricing and see annual savings, per-student costs, and liability reduction.` |
| **Page type** | Interactive Tool (SSG shell with client-side calculator logic) |
| **Hierarchy** | L2 |
| **Breadcrumb** | `Home > Resources > ROI Calculator` |
| **JSON-LD** | `WebApplication` (type: calculator) |
| **Canonical** | `https://www.safetrekr.com/resources/roi-calculator` |
| **OG image** | Custom OG showing calculator interface with "$X saved annually" result |
| **Redirects** | `/roi-calculator` -> `/resources/roi-calculator` (301), `/roi` -> `/resources/roi-calculator` (301) |
| **Performance budget** | LCP < 2.5s, CLS < 0.1, FID < 100ms |

### JSON-LD Schema

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "SafeTrekr ROI Calculator",
  "description": "Calculate your organization's return on investment with SafeTrekr professional trip safety. Compare manual safety planning costs to SafeTrekr and see net annual savings.",
  "url": "https://www.safetrekr.com/resources/roi-calculator",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "publisher": {
    "@type": "Organization",
    "name": "SafeTrekr"
  }
}
```

---

## Page Layout Overview

```
+=========================================================================+
|  [SiteHeader -- sticky, shared component]                               |
+=========================================================================+
|  Breadcrumb: Home > Resources > ROI Calculator                          |
|                                                                         |
|  SECTION 1: Hero                                           bg-background|
|  SECTION 2: Calculator                                     bg-card      |
|  SECTION 3: Results Panel (appears after calculation)      bg-background|
|  SECTION 4: Pre-Filled Scenarios                           bg-background|
|  SECTION 5: Trust Metrics Strip                            bg-secondary |
|  SECTION 6: Conversion CTA Banner                          bg-primary-700|
|                                                                         |
+=========================================================================+
|  [SiteFooter -- shared component]                                       |
+=========================================================================+

+-- [ROIReportModal -- overlay, triggered by gated CTA] ----------------+
```

**Dark section count**: 1 (Section 5: Trust Metrics Strip on `secondary`). CTA Banner uses `brand` variant (`primary-700`). Footer does not count per design system rules. Total dark sections = 1, within the 2-per-page limit.

**Client-side architecture**: The calculator is entirely client-side JavaScript. No server calls for calculation. The only server interaction is the gated PDF report download (Server Action). Calculator state is managed via React `useState` / `useReducer`. Results are shareable via URL query parameters (e.g., `?org=k12&trips=20&size=30&hours=8&rate=45`).

---

## Shared Component: ROIReportModal

### Purpose
Gated download for the "Full ROI Report" PDF. Same pattern as `LeadCaptureModal` on the binder page, but the report is dynamically generated from the calculator inputs/outputs.

### Wireframe

```
+------------------------------------------------------------+
|                                                   [ X ]    |
|                                                            |
|  [FileText icon, 32px, primary-700]                        |
|                                                            |
|  Download Your Full ROI Report                             |
|                                                            |
|  Get a shareable PDF with your personalized ROI            |
|  analysis, including liability comparisons and             |
|  cost breakdowns for your {Org Type}.                      |
|                                                            |
|  +------------------------------------------------------+  |
|  | Work Email                                            |  |
|  +------------------------------------------------------+  |
|                                                            |
|  +------------------------------------------------------+  |
|  | Full Name                                             |  |
|  +------------------------------------------------------+  |
|                                                            |
|  +------------------------------------------------------+  |
|  | Organization Name                                     |  |
|  +------------------------------------------------------+  |
|                                                            |
|  +------------------------------------------------------+  |
|  |             [ Download Report ]           primary btn  |  |
|  +------------------------------------------------------+  |
|                                                            |
|  We'll also send a brief email series on maximizing        |
|  your trip safety ROI. Unsubscribe anytime.                |
|                                                            |
+------------------------------------------------------------+
```

### Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Work Email | email | Yes | Email format (Zod), no free email domains |
| Full Name | text | Yes | Min 2 chars |
| Organization Name | text | Yes | Min 2 chars |
| Calculator State | hidden | Yes | JSON-encoded calculator inputs + outputs |
| Honeypot | hidden | -- | Must be empty |
| Cloudflare Turnstile | invisible | -- | Server-side |

### Form Submission Behavior

1. Client-side validation (Zod)
2. Server-side validation (Zod) on Server Action
3. Cloudflare Turnstile verification
4. Save to Supabase `form_submissions` with `form_type: 'roi_report'`, calculator inputs, UTM params
5. Generate PDF server-side using calculator data (Puppeteer/React-PDF)
6. Send PDF via email (Resend)
7. Show success state with direct download
8. Fire Plausible: `roi_report_download`

Uses the same modal structure, animation, and accessibility patterns as the `LeadCaptureModal` defined in Page 1.

---

## Section 1: Hero

### Purpose
Frame the ROI calculator as a decision-support tool, not a sales gimmick. The headline emphasizes quantifiable savings and positions the calculator as evidence for the internal business case.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-background                                  |
|  max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12                         |
|  pt-24 pb-12 lg:pt-32 lg:pb-16  text-center                           |
|                                                                         |
|                    [Eyebrow]                                            |
|              COST ANALYSIS TOOL                                         |
|                                                                         |
|           Calculate What Manual Trip                                    |
|           Safety Planning Costs You                                     |
|                                                                         |
|        Most organizations spend $700-$1,400 in staff time               |
|        per trip on manual safety planning. See what SafeTrekr           |
|        saves your organization annually.                                |
|                                                                         |
|              [ Start Calculating ]                                      |
|                                                                         |
+=========================================================================+
```

### Component Mapping

| Element | Component / Class | Token Reference |
|---------|-------------------|-----------------|
| Section | `<section aria-label="ROI calculator introduction">` | |
| Background | `bg-background` | `--color-background: #e7ecee` |
| Container | `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12` | |
| Padding | `pt-16 pb-8 sm:pt-20 sm:pb-12 lg:pt-24 lg:pb-16 xl:pt-28 xl:pb-16` | Shorter bottom padding because calculator section follows immediately |
| Eyebrow | `<Eyebrow>` | `.text-eyebrow text-primary-700`, uppercase |
| Headline | `<h1>`, `.text-display-lg text-foreground text-center` | 56px desktop, 34px mobile |
| Body | `<p>`, `.text-body-lg text-muted-foreground text-center max-w-prose mx-auto` | |
| "$700-$1,400" emphasis | `<span className="text-foreground font-semibold">` within body | Makes the cost figure stand out |
| CTA | `<Button variant="primary" size="lg">` | Scrolls to `#calculator` |

### Content (Exact Copy)

- **Eyebrow**: `COST ANALYSIS TOOL`
- **Headline**: `Calculate What Manual Trip Safety Planning Costs You`
- **Body**: `Most organizations spend **$700-$1,400** in staff time per trip on manual safety planning. See what SafeTrekr saves your organization annually.`
- **CTA**: `Start Calculating` -> scrolls to `#calculator`

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 640px) | `.text-display-lg` scales to 34px. CTA full-width. `pt-16 pb-8`. |
| sm (640px) | CTA auto-width. Minor padding bump. |
| lg (1024px) | Full desktop layout. `pt-24 pb-16`. |
| xl (1280px) | `pt-28 pb-16`. Max container centered. |

### Accessibility

- `<h1>` is the page heading. One per page.
- CTA scrolls to calculator section. Target has `id="calculator"` and `tabindex="-1"`.
- No animation delays on LCP-critical content.

### Animation

- `fadeUp` staggered at 80ms (eyebrow, headline, body, CTA).
- `prefers-reduced-motion`: Renders immediately.

---

## Section 2: Calculator

### Purpose
The core interactive tool. All inputs are client-side with immediate real-time output. Designed for progressive disclosure: inputs on the left, live results on the right (desktop) or below (mobile). Pre-filled with sensible defaults so the visitor sees results immediately without touching anything.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-card                                        |
|  border-y border-border                                                 |
|  id="calculator"                                                        |
|  max-w-[1280px] mx-auto  py-16 lg:py-20                                |
|                                                                         |
|  +------------------------------------+  +----------------------------+ |
|  |  INPUTS                            |  |  YOUR RESULTS              | |
|  |                                    |  |                            | |
|  |  Organization Type          [v]    |  |  Annual Manual Cost        | |
|  |  [K-12 School / District      ]    |  |  $28,000                   | |
|  |                                    |  |  .......................... | |
|  |  Trips Per Year                    |  |                            | |
|  |  [====|============] 20            |  |  Annual SafeTrekr Cost     | |
|  |  1                            100  |  |  $9,000                    | |
|  |                                    |  |  .......................... | |
|  |  Average Group Size                |  |                            | |
|  |  [=======|=========] 30            |  |  Net Annual Savings        | |
|  |  10                           200  |  |  $19,000                   | |
|  |                                    |  |  .......................... | |
|  |  Hours Per Trip                    |  |                            | |
|  |  (Manual Safety Planning)          |  |  Per-Student Cost          | |
|  |  [====|============] 8             |  |  $15.00                    | |
|  |  2                            40   |  |  .......................... | |
|  |                                    |  |                            | |
|  |  Staff Hourly Rate                 |  |  Liability Comparison      | |
|  |  $ [  45  ]                        |  |  Avg settlement: $500K-$2M | |
|  |                                    |  |  Your SafeTrekr cost:      | |
|  |                                    |  |  0.5% - 1.8% of one       | |
|  |                                    |  |  settlement                | |
|  +------------------------------------+  |                            | |
|                                          |  [ Download Full Report ]  | |
|                                          |  [ Share These Results ]   | |
|                                          +----------------------------+ |
|                                                                         |
+=========================================================================+
```

### Component Mapping

| Element | Component / Class | Token Reference |
|---------|-------------------|-----------------|
| Section | `<section id="calculator" aria-label="ROI calculator" tabindex="-1">` | |
| Background | `bg-card border-y border-border` | `--color-card: #f7f8f8` |
| Container | `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12` | |
| Padding | `py-12 sm:py-16 lg:py-20` | |
| Grid | `grid lg:grid-cols-12 gap-8 lg:gap-12` | Inputs: `lg:col-span-5`, Results: `lg:col-span-7` |
| Inputs panel | `bg-white rounded-xl border border-border p-6 sm:p-8 shadow-card` | `--radius-xl: 16px` |
| Results panel | `bg-white rounded-xl border-2 border-primary-200 p-6 sm:p-8 shadow-card` | Green-tinted border signals "the answer is here" |
| Panel title | `.text-heading-sm text-foreground font-semibold mb-6` | |

### Input Specifications

| Input | Type | Default | Range | Label | Implementation |
|-------|------|---------|-------|-------|---------------|
| **Organization Type** | `<Select>` (shadcn/ui) | `K-12 School / District` | K-12 School/District, Church/Mission Org, Higher Education, Corporate/Sports Team | `Organization Type` | Changes default values for other inputs when changed. See pre-fill table below. |
| **Trips Per Year** | Slider (shadcn/ui `Slider`) | 20 | 1-100, step 1 | `Trips Per Year` | Numeric display to right of slider, editable inline |
| **Average Group Size** | Slider | 30 | 10-200, step 5 | `Average Group Size` | Numeric display to right of slider |
| **Hours Per Trip** | Slider | 8 | 2-40, step 1 | `Hours Spent on Manual Safety Planning Per Trip` | |
| **Staff Hourly Rate** | `<Input type="number">` with `$` prefix | 45 | 15-200 | `Staff Hourly Rate` | Dollar sign is a visual prefix, not part of the input value |

### Input Component Styling

| Element | Class | Token |
|---------|-------|-------|
| Label | `.text-body-sm text-foreground font-medium mb-2 block` | |
| Helper text | `.text-body-xs text-muted-foreground mt-1` | |
| Slider track | `h-2 rounded-full bg-border` | `--color-border: #b8c3c7` |
| Slider filled | `h-2 rounded-full bg-primary-500` | `--color-primary-500: #4ca46e` |
| Slider thumb | `h-5 w-5 rounded-full bg-white border-2 border-primary-600 shadow-md cursor-pointer` | 20px, high contrast |
| Slider thumb focus | `ring-2 ring-ring ring-offset-2` | `--color-ring: #365462` |
| Slider value display | `.text-body-md text-foreground font-semibold tabular-nums` inline to right of slider | Monospace-aligned numerals |
| Slider range labels | `.text-body-xs text-muted-foreground flex justify-between mt-1` | Min and max values |
| Number input | `bg-card border border-border rounded-md h-11 px-3 text-body-md tabular-nums` | Standard input styling |
| Dollar prefix | `absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-body-md` | Positioned inside input |

### Segment Pre-Fill Defaults

When the user selects an organization type from the dropdown, the other inputs update to sensible defaults for that segment. The user can still adjust any value.

| Segment | Trips/Year | Group Size | Hours/Trip | Hourly Rate |
|---------|-----------|------------|------------|-------------|
| K-12 School/District | 20 | 30 | 8 | $45 |
| Church/Mission Org | 4 | 25 | 12 | $35 |
| Higher Education | 8 | 20 | 15 | $55 |
| Corporate/Sports Team | 15 | 25 | 10 | $65 |

**Behavior on segment change**: When the dropdown value changes, all sliders animate to new positions over 300ms (`ease-default`). The results panel recalculates immediately. If the user has already manually adjusted a slider, a subtle toast notification appears: "We've updated the defaults for {segment}. You can adjust any value." The user's manual overrides are replaced by the new defaults (this is intentional -- the pre-fill scenarios are meant to be starting points).

### Calculation Logic

All calculations are client-side, computed on every input change:

```
Annual Manual Cost   = trips_per_year * hours_per_trip * hourly_rate
SafeTrekr Trip Cost  = getTripCost(org_type, group_size)
Annual SafeTrekr Cost = trips_per_year * safetrekr_trip_cost
Net Annual Savings   = annual_manual_cost - annual_safetrekr_cost
Per Student Cost     = safetrekr_trip_cost / group_size
Liability Percentage = annual_safetrekr_cost / 500000 * 100  (low end)
                     = annual_safetrekr_cost / 2000000 * 100  (high end)
```

**`getTripCost` mapping**:

| Org Type | Group Size <= 30 | Group Size 31-50 | Group Size > 50 |
|----------|-----------------|-------------------|-----------------|
| K-12 | $450 (Field Trip) | $450 | $450 |
| Church/Mission (domestic) | $450 | $450 | $750 |
| Church/Mission (intl) | $1,250 | $1,250 | $1,250 |
| Higher Ed | $1,250 (International) | $1,250 | $1,250 |
| Corporate | $750 (Extended) | $750 | $750 |

**Note**: For simplicity, K-12 always uses Field Trip pricing ($450), Higher Ed always uses International ($1,250), Corporate uses Extended ($750), and Church/Mission defaults to International ($1,250) -- since the primary church use case is international mission trips. Domestic variants are noted in the results with a footnote: "Your actual cost may vary based on trip type. Contact us for a precise quote."

### Results Panel Specifications

| Result | Label | Format | Emphasis |
|--------|-------|--------|----------|
| **Annual Manual Cost** | `Annual Cost of Manual Safety Planning` | `$XX,XXX` | `.text-heading-lg text-foreground font-display tabular-nums` |
| **Annual SafeTrekr Cost** | `Annual SafeTrekr Investment` | `$XX,XXX` | `.text-heading-lg text-primary-700 font-display tabular-nums` |
| **Net Annual Savings** | `Your Net Annual Savings` | `$XX,XXX` | `.text-display-md text-primary-700 font-display tabular-nums font-bold` -- This is the hero number |
| **Per-Student Cost** | `Cost Per Student Per Trip` | `$XX.XX` | `.text-heading-md text-foreground tabular-nums` |
| **Liability Comparison** | `Liability Comparison` | Descriptive text | `.text-body-md text-muted-foreground` |

### Results Panel Wireframe (Detail)

```
+-----------------------------------------------------------+
|  YOUR RESULTS                    text-heading-sm           |
|                                                           |
|  Annual Cost of Manual Planning        text-body-sm label  |
|  $28,000                              text-heading-lg      |
|  - - - - - - - - - - - - - - - - - - - - - - - - - -      |
|                                                           |
|  Annual SafeTrekr Investment           text-body-sm label  |
|  $9,000                       text-heading-lg primary-700  |
|  - - - - - - - - - - - - - - - - - - - - - - - - - -      |
|                                                           |
|  +-------------------------------------------------------+|
|  |  YOUR NET ANNUAL SAVINGS                              ||
|  |  $19,000                    text-display-md primary-700||
|  |  bg-primary-50 rounded-lg p-4 border border-primary-200||
|  +-------------------------------------------------------+|
|                                                           |
|  Cost Per Student Per Trip             text-body-sm label  |
|  $15.00                               text-heading-md      |
|  - - - - - - - - - - - - - - - - - - - - - - - - - -      |
|                                                           |
|  Liability Comparison                  text-body-sm label  |
|  The average trip-related settlement   text-body-md        |
|  is $500K-$2M. Your annual SafeTrekr  muted-foreground     |
|  investment is X.X% - X.X% of a                           |
|  single settlement.                                       |
|  - - - - - - - - - - - - - - - - - - - - - - - - - -      |
|                                                           |
|  [ Download Full ROI Report ]         primary btn, w-full  |
|  [ Share These Results ]              secondary btn, w-full |
|                                                           |
|  * Pricing varies by trip type.       text-body-xs         |
|    Contact us for a precise quote.    muted-foreground     |
+-----------------------------------------------------------+
```

### Net Savings Highlight Box

The "Net Annual Savings" result is visually elevated in a highlighted card:

| Element | Class | Token |
|---------|-------|-------|
| Container | `bg-primary-50 rounded-lg p-4 sm:p-5 border border-primary-200 mt-4 mb-4` | |
| Label | `.text-eyebrow text-primary-700` | `YOUR NET ANNUAL SAVINGS` |
| Value | `.text-display-md text-primary-700 font-display tabular-nums` | 44px desktop |

If net savings is negative (SafeTrekr costs more than manual planning), the box changes:

| Element | Class | Token |
|---------|-------|-------|
| Container | `bg-warning-50 rounded-lg p-4 sm:p-5 border border-warning-200` | |
| Label | `.text-eyebrow text-warning-800` | `SAFETREKR INVESTMENT EXCEEDS MANUAL COST` |
| Value | `.text-display-md text-warning-800 font-display` | Shows the difference |
| Note | `.text-body-sm text-muted-foreground mt-2` | `This comparison measures staff time only. SafeTrekr also provides liability protection, audit-ready documentation, and professional analyst review that manual planning cannot replicate.` |

### CTA Buttons in Results Panel

| Button | Variant | Behavior |
|--------|---------|----------|
| `Download Full ROI Report` | `<Button variant="primary" size="default" className="w-full">` | Opens `ROIReportModal` (gated) |
| `Share These Results` | `<Button variant="secondary" size="default" className="w-full mt-3">` | Copies shareable URL to clipboard. URL includes all calculator parameters as query params. Shows toast: "Link copied to clipboard." |

### Shareable URL Structure

```
https://www.safetrekr.com/resources/roi-calculator?org=k12&trips=20&size=30&hours=8&rate=45
```

| Param | Input | Encoding |
|-------|-------|----------|
| `org` | Organization Type | `k12`, `church`, `highered`, `corporate` |
| `trips` | Trips Per Year | Integer |
| `size` | Average Group Size | Integer |
| `hours` | Hours Per Trip | Integer |
| `rate` | Hourly Rate | Integer |

**On page load with query params**: If URL contains valid `?org=...&trips=...` params, the calculator initializes with those values instead of defaults. The results panel renders immediately. A banner appears above the calculator: "These results were shared with you. Adjust the inputs to customize for your organization."

**Implementation note**: Use `useSearchParams()` from Next.js to read params. Use `window.history.replaceState()` to update the URL as inputs change (no page reload, no scroll reset). The URL is always in sync with the calculator state.

### Content (Exact Copy)

- **Inputs panel title**: `YOUR ORGANIZATION`
- **Results panel title**: `YOUR RESULTS`
- **Footnote**: `* Pricing varies by trip type. Contact us for a precise quote.`

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 1024px) | Single column. Inputs panel stacks above results panel. Results panel scrolls into view after inputs. A sticky "See Results" mini-bar appears at the bottom of the viewport once the user starts interacting with inputs (60px height, `bg-white border-t shadow-md`, contains the net savings value + "See Results" button that scrolls to results panel). |
| lg (1024px) | Side-by-side grid. Inputs left (5 cols), results right (7 cols). Results panel is `lg:sticky lg:top-24` (sticks below header). No mini-bar needed. |
| xl (1280px) | Max container, generous gaps. |

### Mobile Sticky Results Bar (< 1024px)

```
+==============================================================+
|  Savings: $19,000/year        [ See Results v ]    bg-white  |
|  border-t border-border shadow-md                             |
+==============================================================+
```

**Behavior**: Appears when user first interacts with any input (first slider drag or dropdown change). Disappears when results panel is in viewport. Uses `IntersectionObserver` on results panel to toggle visibility.

| Element | Class | Token |
|---------|-------|-------|
| Bar | `fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-md px-6 py-3 z-sticky flex items-center justify-between` | `--z-sticky: 30` |
| Savings value | `.text-heading-sm text-primary-700 tabular-nums` | |
| Button | `<Button variant="primary" size="sm">` | Scrolls to results panel |

### Accessibility

- Section has `id="calculator"`, `tabindex="-1"`, `role="application"` with `aria-label="ROI calculator"`.
- Each slider: `role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` (e.g., "20 trips per year"), `aria-label`.
- Each slider has an associated `<label>` element.
- The editable numeric display next to each slider is a `<input type="number">` with `aria-label="Trips per year value"`. When the user types a value, the slider updates to match. When the user drags the slider, the input updates.
- Results panel has `aria-live="polite"` so screen readers announce updated values.
- Results values use `aria-label` with full context: `aria-label="Your net annual savings: $19,000"`.
- All interactive elements meet 44x44px touch targets. Slider thumb is 20px but has 44px hit area via padding.
- Focus-visible ring on all interactive elements.
- Color is never the sole indicator of meaning. The "savings" / "costs more" state change uses text, label, and icon in addition to color.
- The dollar prefix in the hourly rate input is `aria-hidden="true"` (the label provides context).

### Animation

- Results panel values: Numbers animate on each recalculation using a brief counter animation (300ms, `ease-default`). The animation is subtle -- just a quick count from the old value to the new value, not from zero.
- Net savings highlight box: Gentle `scaleIn` (0.98 to 1.0, 200ms) on value change.
- Slider thumbs: No animation on drag (must feel direct and responsive).
- Pre-fill transition: Sliders animate to new positions over 300ms when organization type changes.
- `prefers-reduced-motion`: All values update instantly, no counter animation, no scale. Sliders jump to new positions.

---

## Section 3: Pre-Filled Scenarios

### Purpose
Provide instant "see yourself" moments for each segment. Clicking a scenario card pre-fills the calculator with that segment's typical values, scrolls back to the calculator, and shows immediate results. This reduces friction for visitors who are unsure what inputs to use.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-background                                  |
|  max-w-[1280px] mx-auto  py-16 lg:py-24                                |
|                                                                         |
|            [Eyebrow]  SEE YOUR SCENARIO                                 |
|       Click a scenario to pre-fill the calculator with typical values.  |
|                                                                         |
|  +------------------------+ +------------------------+                  |
|  |  [School icon]         | |  [Church icon]         |                  |
|  |  K-12 School District  | |  Church Mission Org    |                  |
|  |                        | |                        |                  |
|  |  20 trips/year         | |  4 trips/year          |                  |
|  |  30 students           | |  25 participants       |                  |
|  |  8 hrs manual/trip     | |  12 hrs manual/trip    |                  |
|  |  $45/hr staff cost     | |  $35/hr staff cost     |                  |
|  |                        | |                        |                  |
|  |  Est. savings:         | |  Est. savings:         |                  |
|  |  $19,000/year          | |  $1,570/year           |                  |
|  |                        | |                        |                  |
|  |  [ Try This Scenario ] | |  [ Try This Scenario ] |                  |
|  +------------------------+ +------------------------+                  |
|                                                                         |
|  +------------------------+ +------------------------+                  |
|  |  [GraduationCap icon]  | |  [Building icon]       |                  |
|  |  University             | |  Corporate / Sports    |                  |
|  |                        | |                        |                  |
|  |  8 trips/year          | |  15 trips/year         |                  |
|  |  20 students           | |  25 participants       |                  |
|  |  15 hrs manual/trip    | |  10 hrs manual/trip    |                  |
|  |  $55/hr staff cost     | |  $65/hr staff cost     |                  |
|  |                        | |                        |                  |
|  |  Est. savings:         | |  Est. savings:         |                  |
|  |  $3,600/year           | |  $8,500/year           |                  |
|  |                        | |                        |                  |
|  |  [ Try This Scenario ] | |  [ Try This Scenario ] |                  |
|  +------------------------+ +------------------------+                  |
|                                                                         |
+=========================================================================+
```

### Component Mapping

| Element | Component / Class | Token Reference |
|---------|-------------------|-----------------|
| Section | `<section aria-label="Pre-filled calculator scenarios">` | |
| Background | `bg-background` | `--color-background: #e7ecee` |
| Container | `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12` | |
| Padding | `py-12 sm:py-16 lg:py-24` | |
| Section heading | Eyebrow + `<h2>` centered | |
| Grid | `grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-10` | |
| Scenario card | `bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-card-hover transition-shadow duration-normal cursor-pointer` | Interactive -- entire card is clickable |

### Scenario Card Detail

| Element | Class | Token |
|---------|-------|-------|
| Icon container | `h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center` | |
| Icon | Segment-specific, 20px, `text-primary-700` | |
| Title | `.text-heading-sm text-foreground mt-3` | |
| Metric list | `space-y-1.5 mt-3` | |
| Metric item | `.text-body-sm text-muted-foreground flex items-center gap-2` | Subtle dot or dash prefix |
| Savings highlight | `.text-heading-md text-primary-700 mt-4 font-semibold tabular-nums` | Estimated savings pre-calculated |
| Savings label | `.text-body-xs text-muted-foreground` | `Est. annual savings` |
| CTA | `<Button variant="secondary" size="sm" className="w-full mt-4">` | |

### Scenario Data

| Scenario | Trips | Group Size | Hours | Rate | Est. Savings |
|----------|-------|-----------|-------|------|-------------|
| K-12 School District | 20 | 30 | 8 | $45 | $19,000 |
| Church Mission Org | 4 | 25 | 12 | $35 | $1,570 (see note) |
| University | 8 | 20 | 15 | $55 | $3,600 |
| Corporate / Sports | 15 | 25 | 10 | $65 | $8,500 (see note) |

**Note on church scenario**: `4 trips * 12 hours * $35 = $1,680 manual cost. 4 trips * $1,250 = $5,000 SafeTrekr cost.` This scenario shows SafeTrekr costing more than manual planning time alone. The savings figure should instead show the value proposition differently: the card uses the framing `SafeTrekr investment: $5,000/year ($50/participant)` with a note `Professional safety analysis and liability documentation your insurance carrier requires.` This avoids showing a negative savings number on the marketing page.

**Revised church card**: Instead of "Est. savings", show: `Investment: $5,000/year` with sub-line: `$50 per participant. Includes liability documentation your insurance carrier requires.`

### Content (Exact Copy)

- **Eyebrow**: `SEE YOUR SCENARIO`
- **Section heading**: `Start With Numbers That Look Like Yours`
- **Sub-text**: `Click a scenario to pre-fill the calculator with typical values for your organization type.`

### Scenario Card Behavior

1. User clicks card or "Try This Scenario" button.
2. Calculator inputs animate to the scenario's values (sliders slide, dropdown changes).
3. Page smooth-scrolls to the calculator section (`#calculator`).
4. Results update in real-time.
5. Fire Plausible: `roi_scenario_selected` with `segment` property.

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 768px) | Single column. Cards stack. |
| md (768px) | 2-column grid. |
| lg (1024px) | Same 2-column, wider gaps. |

### Accessibility

- Each card is a `<button>` (not `<a>`, since it triggers an in-page action, not navigation).
- `aria-label="Pre-fill calculator with K-12 School District scenario: 20 trips per year, 30 students, estimated savings of $19,000"`.
- Focus-visible ring on cards.
- Screen reader announces the action: "Pre-fill calculator with {scenario name} values."

### Animation

- Section heading: `fadeUp` staggered at 80ms.
- Cards: `staggerContainer` + `cardReveal` at 100ms intervals.
- `prefers-reduced-motion`: Cards appear immediately.

---

## Section 4: Trust Metrics Strip

### Purpose
Reinforce SafeTrekr's credibility with verifiable metrics. Mirrors the trust strip used on other pages for brand consistency. Dark section provides visual weight and authority.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-secondary  [data-theme="dark"]              |
|  max-w-[1280px] mx-auto  py-12 lg:py-16                                |
|                                                                         |
|   5 Government      17 Safety       3-5 Day        AES-256      SHA-256|
|   Intel Sources     Review Sections  Turnaround     Encryption   Chain  |
|                                                                         |
+=========================================================================+
```

### Component Mapping

Uses the shared `<TrustMetricsStrip>` component as defined in the design system (Section 6.3). Same implementation as homepage and other pages.

| Element | Component / Class | Token Reference |
|---------|-------------------|-----------------|
| Section | `<DarkAuthoritySection>` wrapping `<TrustMetricsStrip>` | `bg-secondary`, `[data-theme="dark"]` |

### Content

Same 5 metrics as defined in the `TrustMetricsStrip` organism specification:
- `5` / `Government Intel Sources`
- `17` / `Safety Review Sections`
- `3-5` / `Day Turnaround`
- `AES-256` / `Encryption Standard`
- `SHA-256` / `Evidence Chain`

### Responsive Behavior

Per shared component: 2 cols (< md), 3 cols (md-lg), 5 cols (>= lg, single row).

### Accessibility

Per shared component specification. All values have `aria-label` with full context. Dark-text-primary on secondary = 11.6:1 -- PASS.

### Animation

- `fadeIn` on entire section.
- Numeric values: `counterAnimate` for "5" and "17". Text values (`AES-256`, `SHA-256`, `3-5`) use `fadeIn`.
- `prefers-reduced-motion`: Immediate render.

---

## Section 5: Conversion CTA Banner

### Purpose
Final conversion opportunity. Offers both the demo request and the sample binder download for visitors who want to see the product rather than calculate ROI.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-primary-700  (brand variant)                |
|  py-20 lg:py-28                                                         |
|                                                                         |
|              Ready to Replace Spreadsheets With Evidence?               |
|                                                                         |
|       See SafeTrekr in action, or download a sample binder              |
|       to review with your team.                                         |
|                                                                         |
|              [ Get a Demo ]   [ Download a Sample Binder ]              |
|              primary-on-dark   secondary (outline light)                |
|                                                                         |
+=========================================================================+
```

### Component Mapping

| Element | Component / Class | Token Reference |
|---------|-------------------|-----------------|
| Section | `<CTABand variant="brand">` | `bg-primary-700` |
| Headline | `.text-display-md text-white text-center` | |
| Body | `.text-body-lg text-white/80 text-center max-w-prose mx-auto` | |
| Primary CTA | `<Button variant="primary-on-dark" size="lg">` | `bg-white text-secondary` |
| Secondary CTA | `<Button variant="secondary" size="lg" className="border-white/30 text-white hover:bg-white/10">` | |
| CTA row | `flex flex-col sm:flex-row items-center justify-center gap-4 mt-8` | |

### Content (Exact Copy)

- **Headline**: `Ready to Replace Spreadsheets With Evidence?`
- **Body**: `See SafeTrekr in action, or download a sample binder to review with your team.`
- **Primary CTA**: `Get a Demo` -> `/demo`
- **Secondary CTA**: `Download a Sample Binder` -> `/resources/sample-binders`

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 640px) | CTAs stack vertically, full-width. Tighter padding `py-12`. |
| sm (640px) | CTAs horizontal. |
| lg (1024px) | `py-20 lg:py-28`. |

### Accessibility

- White text on `primary-700` = 6.1:1 -- PASS.
- White/80 on `primary-700` ~ 5.0:1 -- PASS.
- Focus ring uses white on dark background.

### Animation

- `fadeUp` staggered at 100ms.
- `prefers-reduced-motion`: Immediate render.

---
---

## Cross-Page Analytics Schema

Both pages share the following Plausible event schema:

### Sample Binder Page Events

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `binder_page_view` | Page load | `{ source, medium, campaign }` |
| `binder_modal_open` | Download CTA click | `{ binder_slug, trigger_section }` |
| `binder_download_complete` | Form submit success | `{ binder_slug, org_type, email_domain }` |
| `binder_preview_open` | Preview link click | `{ binder_slug }` |
| `binder_section_view` | Section enters viewport | `{ section_name }` |

### ROI Calculator Page Events

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `roi_page_view` | Page load | `{ source, medium, campaign, has_params }` |
| `roi_calc_interaction` | First input change | `{ first_input_type }` |
| `roi_scenario_selected` | Scenario card click | `{ segment }` |
| `roi_results_view` | Results panel enters viewport | `{ net_savings, org_type }` |
| `roi_report_modal_open` | Download Report CTA click | `{ net_savings, org_type }` |
| `roi_report_download` | Report form submit success | `{ net_savings, org_type, email_domain }` |
| `roi_share_link_copied` | Share button click | `{ org_type, net_savings }` |

---

## Performance Notes

### Sample Binder Page
- **LCP element**: Hero headline text (not the DocumentPreview). Text renders on first paint via SSG.
- **Thumbnail images**: Served as optimized WebP via Next.js `<Image>`. `loading="lazy"` on all thumbnails (below fold). `sizes` attribute set per breakpoint for optimal image delivery.
- **DocumentPreview**: Hidden on mobile (< 768px) to reduce paint complexity on LCP-critical viewport.
- **Modal**: Code-split via `next/dynamic` with `ssr: false`. Only loaded when CTA is clicked.

### ROI Calculator Page
- **LCP element**: Hero headline text. Calculator shell renders via SSG. Interactive hydration happens after first paint.
- **Calculator**: All logic is client-side. No API calls. `useReducer` manages state to avoid unnecessary re-renders.
- **Slider component**: Uses native `<input type="range">` styled with CSS for maximum accessibility and performance. No canvas or SVG for the slider track.
- **Results counter animation**: Uses `requestAnimationFrame` for smooth 60fps counting. Debounced at 16ms to avoid excessive re-renders during slider drag.
- **Shareable URL**: `window.history.replaceState()` updates URL without triggering navigation or scroll. Debounced at 300ms during input changes.
- **ROIReportModal**: Code-split, loaded on CTA click.

---

## SEO Considerations

### Sample Binder Page
- **Target keywords**: "safety binder sample", "trip safety documentation example", "field trip safety binder", "mission trip safety plan template"
- **Internal links TO this page**: Homepage (binder showcase CTA), all segment pages (binder preview sections), pricing page, blog posts, how-it-works page.
- **Internal links FROM this page**: `/demo`, `/pricing`, `/resources/sample-binders/[slug]` (individual binder detail pages when built), segment pages.
- **Content freshness**: SSG, rebuild on binder content update.

### ROI Calculator Page
- **Target keywords**: "trip safety ROI calculator", "safety planning cost calculator", "field trip safety cost analysis"
- **Internal links TO this page**: Pricing page (ROI calculator link section), homepage, segment pages.
- **Internal links FROM this page**: `/demo`, `/pricing`, `/resources/sample-binders`, segment pages via scenario cards.
- **Shareable URLs**: Each shared URL is a unique entry point. Ensure OG tags dynamically reflect the calculator state when params are present (requires ISR or edge middleware for dynamic OG).
