# Mockup Specification: Pricing Page (`/pricing`)

**Version**: 1.0
**Date**: 2026-03-24
**Status**: HIGH-FIDELITY MOCKUP SPEC -- Ready for Implementation
**Design System Reference**: `designs/DESIGN-SYSTEM.md` v1.0
**IA Reference**: `designs/INFORMATION-ARCHITECTURE.md` Section 3.4
**Route**: `/pricing`

---

## Page Metadata

| Property | Value |
|----------|-------|
| **Title** | `Pricing | SafeTrekr -- Professional Trip Safety` |
| **Meta description** | `Professional trip safety starting at $15 per participant. Every trip reviewed by a safety analyst. Field trips, mission trips, study abroad, and corporate travel.` |
| **Page type** | Core Page (SSG via `generateStaticParams`) |
| **Hierarchy** | L1 |
| **Breadcrumb** | None (L1 page) |
| **JSON-LD** | `Product` + `Offer` (per tier), `FAQPage` |
| **Canonical** | `https://www.safetrekr.com/pricing` |
| **OG image** | Custom pricing-focused OG with "$15/participant" prominent |
| **Redirects** | `/plans` -> `/pricing` (301), `/pricing-plans` -> `/pricing` (301) |
| **Performance budget** | LCP < 2.5s, CLS < 0.1, FID < 100ms |

### JSON-LD Schema

```json
[
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "SafeTrekr Professional Trip Safety",
    "description": "Professional safety analyst review, risk intelligence scoring, and audit-ready documentation for every trip.",
    "brand": { "@type": "Brand", "name": "SafeTrekr" },
    "offers": [
      {
        "@type": "Offer",
        "name": "Field Trip",
        "price": "450",
        "priceCurrency": "USD",
        "description": "Domestic day and overnight field trips. ~$15 per student for a 30-person group.",
        "url": "https://www.safetrekr.com/pricing#field-trip"
      },
      {
        "@type": "Offer",
        "name": "Extended Trip",
        "price": "750",
        "priceCurrency": "USD",
        "description": "Multi-day domestic trips, sports travel, retreats. ~$30 per participant for a 25-person group.",
        "url": "https://www.safetrekr.com/pricing#extended-trip"
      },
      {
        "@type": "Offer",
        "name": "International",
        "price": "1250",
        "priceCurrency": "USD",
        "description": "International travel, study abroad, mission trips. ~$62.50 per participant for a 20-person group.",
        "url": "https://www.safetrekr.com/pricing#international"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": ["...8-12 FAQ items as Question/Answer pairs..."]
  }
]
```

---

## Page Layout Overview

```
+=========================================================================+
|  [SiteHeader -- sticky, shared component]                               |
+=========================================================================+
|                                                                         |
|  SECTION 1: Hero / Headline                                 bg-background|
|  SECTION 2: Value Anchor                                    bg-card     |
|  SECTION 3: Pricing Tier Cards                              bg-background|
|  SECTION 4: Volume Discounts                                bg-background|
|  SECTION 5: What's Included in Every Trip                   bg-primary-50|
|  SECTION 6: ROI Calculator Link                             bg-card     |
|  SECTION 7: Segment-Specific Pricing Scenarios              bg-background|
|  SECTION 8: Procurement Path                                bg-secondary |
|  SECTION 9: Common Questions (FAQ)                          bg-background|
|  SECTION 10: Conversion CTA Banner                          bg-primary-700|
|                                                                         |
+=========================================================================+
|  [SiteFooter -- shared component]                                       |
+=========================================================================+
```

**Dark section count**: 1 (Section 8: Procurement Path on `secondary`). CTA Banner uses `brand` variant (`primary-700`). Footer does not count per design system rules. Total dark sections = 1, within the 2-per-page limit.

---

## Section 1: Hero / Headline

### Purpose
Immediately communicate the per-participant value proposition. Anchor the visitor's frame of reference at "$15 per participant" before they see tier pricing. Establish credibility with analyst review language.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-background                                  |
|  max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12                         |
|  pt-24 pb-16 lg:pt-32 lg:pb-20  text-center                           |
|                                                                         |
|                    [Eyebrow]                                            |
|              TRANSPARENT PRICING                                        |
|                                                                         |
|           Professional Trip Safety                                      |
|         Starting at $15 Per Participant                                 |
|                                                                         |
|         Every trip reviewed by a safety analyst.                        |
|         Every document audit-ready.                                     |
|                                                                         |
|            [ Get a Demo ]   [ Contact Sales ]                           |
|                                                                         |
+=========================================================================+
```

### Component Mapping

| Element | Component / Class | Token Reference |
|---------|-------------------|-----------------|
| Container | `<section>`, `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12` | `--container-max: 1280px` |
| Background | `bg-background` | `--color-background: #e7ecee` |
| Padding | `pt-16 pb-12 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20 xl:pt-28 xl:pb-24` | Hero top/bottom scale |
| Eyebrow | `<Eyebrow>` component | `.text-eyebrow text-primary-700`, uppercase, `tracking-[0.08em]` |
| Headline | `<h1>`, `.text-display-lg text-foreground` | 56px desktop, 34px mobile, `font-weight: 700`, `line-height: 1.1`, `tracking: -0.02em` |
| "$15" emphasis | `<span className="text-primary-700">` within h1 | `--color-primary-700: #33704b`, 6.1:1 on background -- PASS |
| Sub-headline | `<p>`, `.text-body-lg text-muted-foreground max-w-prose mx-auto` | 20px desktop, `--color-muted-foreground: #4d5153` |
| Primary CTA | `<Button variant="primary" size="lg">` | `bg-primary-600 text-white`, 52px height |
| Secondary CTA | `<Button variant="secondary" size="lg">` | Transparent, `border-border`, 52px height |
| CTA row | `flex flex-col sm:flex-row items-center justify-center gap-4 mt-8` | Stacked < 640px, horizontal >= 640px |

### Content (Exact Copy)

- **Eyebrow**: `TRANSPARENT PRICING`
- **Headline**: `Professional Trip Safety Starting at $15 Per Participant`
  - "$15 Per Participant" rendered in `text-primary-700` for emphasis
- **Sub-headline**: `Every trip reviewed by a safety analyst. Every document audit-ready.`
- **Primary CTA**: `Get a Demo` -> `/demo`
- **Secondary CTA**: `Contact Sales` -> `/contact`

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 640px) | `.text-display-lg` scales to 34px. CTAs stack vertically, full-width. `pt-16 pb-12`. |
| sm (640px) | CTAs go horizontal. Minor padding increase. |
| md (768px) | No major changes. |
| lg (1024px) | Full desktop layout. `pt-24 pb-20`. Headline at 56px. |
| xl (1280px) | `pt-28 pb-24`. Max container centered. |

### Accessibility

- `<h1>` is the page heading. One per page.
- "$15" emphasis uses `text-primary-700` (6.1:1 contrast on `background`) -- PASS.
- CTAs meet 44x44px touch target at `size="lg"` (52px height).
- Focus-visible ring on both buttons: `ring` token, 2px width, 2px offset.
- No animation on initial load -- this is LCP-critical content. Text renders immediately.

### Animation

- **Eyebrow + headline + sub-headline**: `fadeUp` staggered at 80ms (via `staggerContainer`). Viewport entry trigger at 20% intersection.
- **CTA buttons**: Part of stagger sequence, appear last.
- `prefers-reduced-motion`: All elements render immediately, no transforms.

---

## Section 2: Value Anchor

### Purpose
Anchor the price against dramatically higher costs -- liability settlements and manual staff time -- before the visitor sees tier pricing. This is the critical psychological framing that makes $15/student feel like a rounding error.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-card                                        |
|  border-y border-border                                                 |
|  max-w-[1280px] mx-auto  py-12 lg:py-16                                |
|                                                                         |
|  +----------------------------+  +----------------------------+  +----------------------------+
|  |  [AlertTriangle icon]      |  |  [Clock icon]              |  |  [Shield icon]              |
|  |                            |  |                            |  |                             |
|  |  $500K -- $2M              |  |  $700 -- $1,400            |  |  $15                        |
|  |  Average trip-related      |  |  Staff time for manual     |  |  Per student with           |
|  |  injury settlement         |  |  safety planning per trip  |  |  SafeTrekr analyst review   |
|  +----------------------------+  +----------------------------+  +----------------------------+
|                                                                         |
+=========================================================================+
```

### Component Mapping

| Element | Component / Class | Token Reference |
|---------|-------------------|-----------------|
| Section | `<section aria-label="Value comparison">` | |
| Background | `bg-card border-y border-border` | `--color-card: #f7f8f8`, `--color-border: #b8c3c7` |
| Container | `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12` | |
| Padding | `py-10 sm:py-12 lg:py-16` | Compressed section scale |
| Grid | `grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8` | 3-column at md+, stacked below |
| Card | Custom value-anchor card -- NOT `StatCard` (requires different layout) | |
| Icon container | `h-12 w-12 rounded-lg flex items-center justify-center` | Per-card color below |
| Value (liability) | `.text-display-md text-foreground font-display` | 44px desktop, `font-weight: 700` |
| Value (SafeTrekr) | `.text-display-md text-primary-700 font-display` | Green emphasis on the winning number |
| Label | `.text-body-md text-muted-foreground mt-2` | |

### Card Specifications

| Card | Icon | Icon BG | Value | Label |
|------|------|---------|-------|-------|
| **Liability** | `AlertTriangle` (24px, `warning-700`) | `bg-warning-100` | `$500K -- $2M` | `Average trip-related injury settlement` |
| **Staff Time** | `Clock` (24px, `muted-foreground`) | `bg-muted` | `$700 -- $1,400` | `Staff time for manual safety planning per trip` |
| **SafeTrekr** | `Shield` (24px, `primary-700`) | `bg-primary-50` | `$15` | `Per student with SafeTrekr analyst review` |

**Design note**: The third card (SafeTrekr) uses `text-primary-700` for the value and a subtle `border-2 border-primary-200 bg-white` treatment to distinguish it as the favorable option. The first two cards use `bg-card` with standard `border border-border`. This is not decoration -- it is a functional contrast that guides the eye to the resolution of the comparison.

### Content (Exact Copy)

No headline for this section. The three cards speak for themselves. The juxtaposition IS the message.

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 768px) | Single column stack. Cards gain horizontal layout: icon left, value + label right. This prevents three tall vertical cards from dominating the viewport. |
| md (768px) | 3-column grid. Cards are vertically stacked internally (icon top, value, label). |
| lg (1024px) | Same grid, wider gaps (`gap-8`). |

### Mobile Card Layout (< 768px)

```
+--------------------------------------------------------------+
|  [icon]   $500K -- $2M                                       |
|           Average trip-related injury settlement              |
+--------------------------------------------------------------+
|  [icon]   $700 -- $1,400                                     |
|           Staff time for manual safety planning per trip      |
+--------------------------------------------------------------+
|  [icon]   $15                                      [border-2]|
|           Per student with SafeTrekr analyst review [primary] |
+--------------------------------------------------------------+
```

### Accessibility

- Section has `aria-label="Value comparison"` for landmark navigation.
- Icon colors are NOT the sole information carrier. Labels provide full context.
- `AlertTriangle` icon: `aria-hidden="true"` (label provides context).
- All values use `aria-label` with full context, e.g., `aria-label="Average trip-related injury settlement: $500,000 to $2 million"`.
- Color of the SafeTrekr value (`primary-700` on `card`) = 6.9:1 -- PASS.

### Animation

- `fadeIn` on section enter (20% intersection).
- Cards use `staggerContainer` with `cardReveal` at 100ms intervals.
- Counter animation on the "$15" value (counts from 0 over 1.5s). Other values show as static text (ranges cannot meaningfully animate).
- `prefers-reduced-motion`: All values shown immediately, no transforms.

---

## Section 3: Pricing Tier Cards

### Purpose
Present the three trip types with per-student pricing prominently displayed alongside per-trip pricing. Each card is a self-contained decision unit with features and CTA.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-background                                  |
|  max-w-[1280px] mx-auto  py-20 lg:py-24                                |
|                                                                         |
|            [Eyebrow]  CHOOSE YOUR TRIP TYPE                             |
|           One price per trip. Every feature included.                    |
|                                                                         |
|  +---------------------------+ +-------------------------------+ +---------------------------+
|  |                           | |  [Badge: MOST COMMON]         | |                           |
|  |  FIELD TRIP               | |                               | |  INTERNATIONAL            |
|  |                           | |  EXTENDED TRIP                | |                           |
|  |  $450                     | |                               | |  $1,250                   |
|  |  per trip                 | |  $750                         | |  per trip                 |
|  |                           | |  per trip                     | |                           |
|  |  $15 / student            | |                               | |  $62.50 / participant     |
|  |  based on 30 participants | |  $30 / participant            | |  based on 20 participants |
|  |                           | |  based on 25 participants     | |                           |
|  |  Domestic day and         | |                               | |  International travel,    |
|  |  overnight trips          | |  Multi-day domestic,          | |  study abroad,            |
|  |                           | |  sports travel, retreats      | |  mission trips             |
|  |  ---- Includes: --------  | |                               | |                           |
|  |  [check] 17-section       | |  ---- Includes: ------------ | |  ---- Includes: --------  |
|  |         analyst review    | |  [check] 17-section          | |  [check] 17-section       |
|  |  [check] Risk intel from  | |         analyst review       | |         analyst review    |
|  |         5 govt sources    | |  [check] Risk intel from     | |  [check] Risk intel from  |
|  |  [check] Complete safety  | |         5 govt sources       | |         5 govt sources    |
|  |         binder            | |  [check] Complete safety     | |  [check] Complete safety  |
|  |  [check] Mobile field ops | |         binder               | |         binder            |
|  |  [check] Monitoring &     | |  [check] Mobile field ops   | |  [check] Mobile field ops |
|  |         geofencing        | |  [check] Monitoring &        | |  [check] Monitoring &     |
|  |  [check] Compliance docs  | |         geofencing           | |         geofencing        |
|  |  [check] Dedicated        | |  [check] Compliance docs    | |  [check] Compliance docs  |
|  |         analyst           | |  [check] Dedicated           | |  [check] Dedicated        |
|  |                           | |         analyst              | |         analyst           |
|  |  [ Get a Demo ]           | |                               | |                           |
|  |                           | |  [ Get a Demo ]              | |  [ Get a Demo ]           |
|  +---------------------------+ +-------------------------------+ +---------------------------+
|                                  ^
|                            border-primary-500
|                            scale(1.05) on desktop
|                            shadow-xl
|
+=========================================================================+
```

### Component: `PricingTierCard`

**File**: `components/marketing/pricing-tier.tsx` (as defined in Design System Section 6.2)

#### Props Interface

```typescript
interface PricingTierProps {
  id: string;              // Anchor ID, e.g., "field-trip"
  name: string;            // "Field Trip"
  price: number;           // 450
  unit: string;            // "per trip"
  perParticipantPrice: string;  // "$15"
  perParticipantLabel: string;  // "per student"
  groupSizeBasis: string;       // "based on 30 participants"
  description: string;     // "Domestic day and overnight trips"
  features: string[];      // Feature checklist
  featured?: boolean;      // Triggers "Most Common" badge, border-primary-500, scale
  ctaLabel: string;        // "Get a Demo"
  ctaHref: string;         // "/demo"
}
```

#### Card Specifications

| Property | Standard Card | Featured Card |
|----------|--------------|---------------|
| Background | `bg-card` | `bg-card` |
| Border | `border-2 border-border` | `border-2 border-primary-500` |
| Border radius | `rounded-2xl` (`--radius-2xl: 20px`) | `rounded-2xl` |
| Padding | `p-8` (32px) | `p-8` |
| Shadow | `shadow-lg` | `shadow-xl` |
| Scale (desktop) | `scale-100` | `scale-105` (CSS transform, static -- not hover) |
| Badge | none | `<Badge variant="default">Most Common</Badge>` positioned at top |
| Z-index | `z-base` | `z-raised` (ensures overlap with scale) |

**Rule**: No animation on pricing cards. No hover transforms. Stability communicates trustworthiness.

#### Tier Data

| Attribute | Field Trip | Extended Trip | International |
|-----------|-----------|---------------|---------------|
| `id` | `field-trip` | `extended-trip` | `international` |
| `name` | Field Trip | Extended Trip | International |
| `price` | 450 | 750 | 1,250 |
| `unit` | per trip | per trip | per trip |
| `perParticipantPrice` | $15 | $30 | $62.50 |
| `perParticipantLabel` | per student | per participant | per participant |
| `groupSizeBasis` | based on 30 participants | based on 25 participants | based on 20 participants |
| `description` | Domestic day and overnight trips | Multi-day domestic, sports travel, retreats | International travel, study abroad, mission trips |
| `featured` | false | true | false |
| `ctaLabel` | Get a Demo | Get a Demo | Get a Demo |
| `ctaHref` | /demo | /demo | /demo |

#### Feature Checklist (Same for all tiers -- every feature at every tier)

1. 17-section analyst safety review
2. Risk intelligence from 5 government sources
3. Complete trip safety binder
4. Mobile field operations access
5. Real-time monitoring and geofencing
6. Compliance documentation
7. Dedicated analyst assignment

#### Internal Card Layout

```
+-------------------------------+
|  [Badge: MOST COMMON]  (opt)  |   <- Badge: mb-4, only on featured
|                               |
|  EXTENDED TRIP                |   <- .text-heading-md, font-weight: 600
|                               |
|  $750                         |   <- .text-display-md, font-weight: 700
|  per trip                     |   <- .text-body-sm text-muted-foreground
|                               |
|  --------------------------   |   <- Divider: h-px bg-border my-4
|                               |
|  $30 / participant            |   <- .text-heading-sm text-primary-700, font-weight: 700
|  based on 25 participants     |   <- .text-body-xs text-muted-foreground
|                               |
|  Multi-day domestic, sports   |   <- .text-body-sm text-muted-foreground mt-4
|  travel, retreats             |
|                               |
|  --------------------------   |   <- Divider: h-px bg-border my-6
|                               |
|  Includes:                    |   <- .text-eyebrow text-muted-foreground mb-4
|                               |
|  [check] 17-section analyst   |   <- flex gap-3, Check icon primary-500
|          safety review        |      .text-body-sm text-foreground
|  [check] Risk intelligence    |
|          from 5 govt sources  |
|  [check] Complete trip        |
|          safety binder        |
|  [check] Mobile field         |
|          operations access    |
|  [check] Real-time monitoring |
|          and geofencing       |
|  [check] Compliance           |
|          documentation        |
|  [check] Dedicated analyst    |
|          assignment           |
|                               |
|  [=== Get a Demo ===]         |   <- Button primary, size lg, w-full, mt-8
+-------------------------------+
```

#### Per-Participant Price Treatment

The per-participant price is the most important number on the card. It is visually distinguished:

```
|  $30 / participant            |
```

- `$30` uses `.text-heading-sm text-primary-700` with `font-weight: 700`
- `/ participant` uses `.text-body-sm text-muted-foreground` inline
- `based on 25 participants` uses `.text-body-xs text-muted-foreground` on a new line
- The row sits between two `h-px bg-border` dividers, creating a visually isolated "per-participant zone"
- `aria-label` on the containing element: `"$30 per participant based on a 25-person group"`

### Section-Level Specifications

| Element | Specification |
|---------|---------------|
| Section eyebrow | `CHOOSE YOUR TRIP TYPE` -- `<Eyebrow>` component, `text-primary-700` |
| Section sub-text | `One price per trip. Every feature included.` -- `.text-body-lg text-muted-foreground text-center max-w-prose mx-auto` |
| Grid | `grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start mt-12 lg:mt-16` |
| Section padding | Standard section: `py-16 sm:py-20 lg:py-24 xl:py-32` |
| Section bg | `bg-background` |

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 768px) | Single column stack. Featured card loses `scale(1.05)` (all cards same size). Featured card retains green border and badge. Cards are full-width. Per-participant price still prominent. |
| md (768px) | 3-column grid begins. Featured card gets `scale(1.05)`. |
| lg (1024px) | Wider gaps. Full expression of the layout. |
| xl (1280px) | Max container width. Cards do not stretch beyond comfortable reading width. |

### Accessibility

- Each card has `id` attribute for anchor linking from JSON-LD (`#field-trip`, `#extended-trip`, `#international`).
- Price uses `aria-label` with full context: `"Field Trip: $450 per trip, approximately $15 per student based on a 30-person group"`.
- Feature list: `<ul role="list">` with `<li>` for each item. Check icon is `aria-hidden="true"`.
- "Most Common" badge: `aria-label="Most common plan"` -- not just visual decoration.
- CTA button: full descriptive text "Get a Demo" is sufficient (no additional aria needed given clear card context).
- Cards are NOT interactive as a whole -- only the CTA button is the interactive element. No whole-card click target.

### Animation

- **No animation on pricing cards.** Per design system rule: "Stability and readability are paramount."
- Section heading (eyebrow + sub-text) uses `fadeUp` stagger at 80ms.
- Cards appear via `staggerContainer` with `fadeIn` (opacity only, no transforms) at 120ms intervals. This is a deliberate exception to `cardReveal` -- pricing cards should not move to avoid suggesting instability.
- `prefers-reduced-motion`: Immediate render.

---

## Section 4: Volume Discounts

### Purpose
Show volume pricing clearly for organizations with multiple trips per year. Drive larger commitments and contact-sales behavior for high-volume accounts.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-background                                  |
|  max-w-[var(--container-lg)] mx-auto  py-12 lg:py-16                   |
|                                                                         |
|            [Eyebrow]  VOLUME PRICING                                    |
|              More trips. Better rates.                                  |
|                                                                         |
|  +-------------------------------------------------------------------+ |
|  |  bg-card  rounded-xl  border border-border  shadow-card           | |
|  |                                                                   | |
|  |  Trips Per Year          Discount         Example (Field Trip)    | |
|  |  ---------------------------------------------------------------- | |
|  |  1 -- 4 trips             Standard         $450 / trip            | |
|  |  5 -- 9 trips             5% off           $427.50 / trip         | |
|  |  10 -- 24 trips           10% off          $405 / trip            | |
|  |  25 -- 49 trips           15% off          $382.50 / trip         | |
|  |  50+ trips                20% off          $360 / trip            | |
|  |                                                                   | |
|  +-------------------------------------------------------------------+ |
|                                                                         |
|       Need an annual plan or custom volume pricing?                     |
|       [ Contact Sales ]                                                 |
|                                                                         |
+=========================================================================+
```

### Component Mapping

| Element | Component / Class | Token Reference |
|---------|-------------------|-----------------|
| Section | `<section aria-label="Volume discounts">` | |
| Background | `bg-background` (continues from tier cards -- no visual break needed) | |
| Container | `max-w-[var(--container-lg)] mx-auto px-6 sm:px-8 lg:px-12` | `--container-lg: 1024px` (narrower for table readability) |
| Padding | `py-10 sm:py-12 lg:py-16` | Compressed section |
| Eyebrow | `<Eyebrow>` | `text-primary-700`, uppercase |
| Sub-text | `.text-body-lg text-muted-foreground text-center` | |
| Table container | `bg-card rounded-xl border border-border shadow-card overflow-hidden mt-8` | |
| Table | `<table>` with full semantic markup | See below |
| CTA text | `.text-body-md text-muted-foreground text-center mt-8` | |
| CTA button | `<Button variant="secondary" size="default">` | |

### Table Specification

```html
<table class="w-full">
  <thead>
    <tr class="border-b border-border bg-muted/50">
      <th class="text-left text-eyebrow text-muted-foreground py-4 px-6">Trips Per Year</th>
      <th class="text-left text-eyebrow text-muted-foreground py-4 px-6">Discount</th>
      <th class="text-right text-eyebrow text-muted-foreground py-4 px-6">Example (Field Trip)</th>
    </tr>
  </thead>
  <tbody>
    <!-- rows -->
  </tbody>
</table>
```

### Table Data

| Trips Per Year | Discount | Example (Field Trip) | Row Treatment |
|----------------|----------|---------------------|---------------|
| 1 -- 4 trips | Standard rate | $450 / trip | `.text-body-md text-foreground` |
| 5 -- 9 trips | 5% off | $427.50 / trip | `.text-body-md text-foreground` |
| 10 -- 24 trips | 10% off | $405 / trip | `.text-body-md text-foreground` |
| 25 -- 49 trips | 15% off | $382.50 / trip | `.text-body-md text-foreground font-medium` |
| 50+ trips | 20% off | $360 / trip | `.text-body-md text-primary-700 font-semibold`, row bg `primary-50/50` |

The 50+ row has subtle green treatment (`bg-primary-50/50`, `text-primary-700` on discount and price) to signal the best value without being garish.

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 640px) | Table becomes a stacked card list. Each row renders as a self-contained card: `Trip volume` as `.text-heading-sm`, `Discount` and `Example price` as two data points below. |
| sm (640px+) | Full table layout. |

### Mobile Stacked Layout (< 640px)

```
+--------------------------------------------------------------+
|  1 -- 4 trips                                                |
|  Standard rate              $450 / trip                      |
+--------------------------------------------------------------+
|  5 -- 9 trips                                                |
|  5% off                     $427.50 / trip                   |
+--------------------------------------------------------------+
|  10 -- 24 trips                                              |
|  10% off                    $405 / trip                      |
+--------------------------------------------------------------+
|  25 -- 49 trips                                              |
|  15% off                    $382.50 / trip                   |
+--------------------------------------------------------------+
|  50+ trips                                         [primary] |
|  20% off                    $360 / trip                      |
+--------------------------------------------------------------+
```

Implementation: Use a responsive component that renders `<table>` at `sm:` and above, and a `<div>` card stack at base. Or use `@container` queries within a container element.

### Accessibility

- Table uses full semantic markup: `<table>`, `<thead>`, `<th scope="col">`, `<tbody>`, `<td>`.
- Mobile stacked view uses `<dl>` (definition list) with `<dt>` for trip volume and `<dd>` for discount/price.
- `aria-label="Volume discount pricing table"` on the table.
- Example prices include `aria-label` with full context: `"$427.50 per trip after 5% volume discount"`.

### Animation

- `fadeUp` on section heading.
- Table/card container: `fadeIn` (opacity only).
- `prefers-reduced-motion`: Immediate render.

---

## Section 5: What's Included in Every Trip

### Purpose
Eliminate ambiguity. Visitors should know that EVERY tier includes EVERY feature. There are no feature gates between tiers -- only trip complexity differs.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-primary-50                                  |
|  max-w-[1280px] mx-auto  py-20 lg:py-24                                |
|                                                                         |
|            [Eyebrow]  INCLUDED IN EVERY TRIP                            |
|           No tiers. No feature gates. No surprises.                     |
|                                                                         |
|  +------------------------------+  +------------------------------+     |
|  |  [ClipboardCheck]            |  |  [Activity]                  |     |
|  |  17-Section Analyst          |  |  Risk Intelligence           |     |
|  |  Safety Review               |  |  Engine                      |     |
|  |                              |  |                              |     |
|  |  A trained safety analyst    |  |  Monte Carlo scoring from    |     |
|  |  reviews every trip across   |  |  NOAA, USGS, CDC, GDACS,    |     |
|  |  17 safety dimensions.       |  |  and ReliefWeb data.         |     |
|  +------------------------------+  +------------------------------+     |
|                                                                         |
|  +------------------------------+  +------------------------------+     |
|  |  [FileText]                  |  |  [Smartphone]                |     |
|  |  Complete Trip               |  |  Mobile Field                |     |
|  |  Safety Binder               |  |  Operations                  |     |
|  |                              |  |                              |     |
|  |  Audit-ready documentation   |  |  Live map, geofencing,       |     |
|  |  with SHA-256 hash-chain     |  |  rally points, muster        |     |
|  |  tamper-evident integrity.   |  |  check-ins, SMS broadcast.   |     |
|  +------------------------------+  +------------------------------+     |
|                                                                         |
|  +------------------------------+  +------------------------------+     |
|  |  [Radio]                     |  |  [Scale]                     |     |
|  |  Real-Time                   |  |  Compliance                  |     |
|  |  Monitoring                  |  |  Documentation               |     |
|  |                              |  |                              |     |
|  |  Geofence alerts, location   |  |  FERPA, SOC 2, GDPR-ready   |     |
|  |  visibility, emergency       |  |  documentation. Tamper-      |     |
|  |  coordination tools.         |  |  evident audit trail.        |     |
|  +------------------------------+  +------------------------------+     |
|                                                                         |
|  +-------------------------------------------------------------------+ |
|  |  [User]                                                           | |
|  |  Dedicated Analyst Assignment                                     | |
|  |                                                                   | |
|  |  Every trip is assigned to a named analyst who serves as          | |
|  |  your point of contact throughout the review process.             | |
|  +-------------------------------------------------------------------+ |
|                                                                         |
+=========================================================================+
```

### Component Mapping

| Element | Component / Class |
|---------|-------------------|
| Section | `<section aria-labelledby="included-heading">` |
| Background | `bg-primary-50` (`--color-primary-50: #f1f9f4`) |
| Container | `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12` |
| Padding | Standard section: `py-16 sm:py-20 lg:py-24 xl:py-32` |
| Eyebrow | `<Eyebrow icon={CheckCircle}>` -- `text-primary-700` |
| Heading | `.text-display-md text-foreground text-center`, `id="included-heading"` |
| Sub-text | `.text-body-lg text-muted-foreground text-center max-w-prose mx-auto` |
| Feature cards | `<FeatureCard>` components (Design System Section 6.2) |
| Grid | `grid sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-12` |
| Last card (Analyst) | `<FeatureCard featured>` spanning full width (`sm:col-span-2`) |

### Feature Card Data

| Icon | Title | Description |
|------|-------|-------------|
| `ClipboardCheck` | 17-Section Analyst Safety Review | A trained safety analyst reviews every trip across 17 safety dimensions. No automated scoring alone -- human expertise on every review. |
| `Activity` | Risk Intelligence Engine | Monte Carlo probability scoring from five government data sources: NOAA, USGS, CDC, GDACS, and ReliefWeb. |
| `FileText` | Complete Trip Safety Binder | Audit-ready documentation delivered in 3-5 days. SHA-256 hash-chain ensures tamper-evident integrity on every page. |
| `Smartphone` | Mobile Field Operations | Live trip map, geofencing, rally points, muster check-ins, and SMS broadcast in every chaperone's pocket. |
| `Radio` | Real-Time Monitoring | Geofence alerts, participant location visibility, and emergency coordination tools available throughout the trip. |
| `Scale` | Compliance Documentation | FERPA, SOC 2, and GDPR-ready documentation. Complete tamper-evident audit trail with purge proof capabilities. |
| `User` | Dedicated Analyst Assignment | Every trip is assigned to a named safety analyst who serves as your point of contact throughout the review process. *(featured, full-width)* |

### Content (Exact Copy)

- **Eyebrow**: `INCLUDED IN EVERY TRIP`
- **Heading**: `No Tiers. No Feature Gates. No Surprises.`
- **Sub-text**: `Every trip type includes the full SafeTrekr platform. The only difference is destination complexity.`

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 640px) | Single column. All cards stacked. Featured card is also full-width (no span change needed). |
| sm (640px) | 2-column grid. Featured card spans 2 columns. |
| lg (1024px) | Same 2-column grid with wider gaps. |

### Accessibility

- Section landmark: `aria-labelledby="included-heading"`.
- Each FeatureCard uses `<h3>` for the title.
- Icons are `aria-hidden="true"` (titles provide context).
- Green background (`primary-50`) has sufficient contrast for all text: `foreground` on `primary-50` = 13.5:1 (PASS), `muted-foreground` on `primary-50` = 5.4:1 (PASS).

### Animation

- Heading: `fadeUp` stagger.
- Feature cards: `staggerContainer` + `cardReveal` at 80ms intervals.
- `prefers-reduced-motion`: Immediate render.

---

## Section 6: ROI Calculator Link

### Purpose
Bridge from pricing to the ROI calculator tool. Provide a preview of the value calculation to entice click-through. This is NOT the calculator itself -- it is a teaser.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-card                                        |
|  border-y border-border                                                 |
|  max-w-[1280px] mx-auto  py-16 lg:py-20                                |
|                                                                         |
|  +---------------------------------------------------+                  |
|  |                                                   |                  |
|  |   [Calculator icon, 48px, primary-500]            |                  |
|  |                                                   |                  |
|  |   Calculate Your Organization's ROI               |  text-display-md |
|  |                                                   |                  |
|  |   See how much SafeTrekr saves in staff time,     |  text-body-lg    |
|  |   liability reduction, and documentation costs    |                  |
|  |   compared to manual safety planning.             |                  |
|  |                                                   |                  |
|  |   [ Use the ROI Calculator -> ]                   |  Button primary  |
|  |                                                   |                  |
|  +---------------------------------------------------+                  |
|                                                                         |
+=========================================================================+
```

### Component Mapping

| Element | Component / Class |
|---------|-------------------|
| Section | `<section aria-label="ROI calculator">` |
| Background | `bg-card border-y border-border` |
| Container | `max-w-[var(--container-lg)] mx-auto px-6 sm:px-8 lg:px-12` |
| Padding | `py-12 sm:py-16 lg:py-20` |
| Layout | `text-center` |
| Icon | `Calculator` from Lucide, `h-12 w-12 text-primary-500 mx-auto` |
| Heading | `.text-display-md text-foreground mt-6` -- renders as `<h2>` |
| Body | `.text-body-lg text-muted-foreground max-w-prose mx-auto mt-4` |
| CTA | `<Button variant="primary" size="lg" iconRight={ArrowRight}>` with `mt-8` |

### Content (Exact Copy)

- **Heading**: `Calculate Your Organization's ROI`
- **Body**: `See how much SafeTrekr saves in staff time, liability reduction, and documentation costs compared to manual safety planning.`
- **CTA**: `Use the ROI Calculator` -> `/resources/roi-calculator`

### Responsive Behavior

Centered layout at all breakpoints. Icon scales slightly smaller on mobile (`h-10 w-10`). No structural changes needed.

### Animation

- `fadeUp` on section enter.
- `prefers-reduced-motion`: Immediate render.

---

## Section 7: Segment-Specific Pricing Scenarios

### Purpose
Ground abstract pricing in real-world budgets. Each scenario maps to a buyer segment and shows annual cost in context. Removes the mental math barrier.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-background                                  |
|  max-w-[1280px] mx-auto  py-20 lg:py-24                                |
|                                                                         |
|            [Eyebrow]  WHAT IT COSTS IN PRACTICE                         |
|           Real scenarios for real organizations.                         |
|                                                                         |
|  +---------------------------+  +---------------------------+           |
|  |  [School icon]            |  |  [Church icon]            |           |
|  |                           |  |                           |           |
|  |  K-12 School District     |  |  Church or Mission Org    |           |
|  |                           |  |                           |           |
|  |  20 field trips / year    |  |  3 mission trips / year   |           |
|  |  30 students per trip     |  |  Mixed domestic &         |           |
|  |                           |  |  international            |           |
|  |  $9,000 / year            |  |                           |           |
|  |  ($15 per student)        |  |  $2,700 / year            |           |
|  |                           |  |  (< 1% of annual          |           |
|  |  -> Learn more            |  |   missions budget)        |           |
|  +---------------------------+  |                           |           |
|                                 |  -> Learn more            |           |
|  +---------------------------+  +---------------------------+           |
|  |  [GraduationCap icon]    |                                           |
|  |                           |  +---------------------------+           |
|  |  Higher Education         |  |  [Building2 icon]         |           |
|  |                           |  |                           |           |
|  |  8 study abroad programs  |  |  Corporate / Sports       |           |
|  |  / year                   |  |                           |           |
|  |  20-25 participants each  |  |  15 team trips / year     |           |
|  |                           |  |  25 participants each     |           |
|  |  $10,000 / year           |  |                           |           |
|  |  (< $50 per student for   |  |  $11,250 / year           |           |
|  |   global safety coverage) |  |  ($30 per participant)    |           |
|  |                           |  |                           |           |
|  |  -> Learn more            |  |  -> Learn more            |           |
|  +---------------------------+  +---------------------------+           |
|                                                                         |
+=========================================================================+
```

### Component: `ScenarioCard`

**File**: `components/marketing/scenario-card.tsx` (new component, follows FeatureCard pattern)

```typescript
interface ScenarioCardProps {
  icon: LucideIcon;
  segment: string;           // "K-12 School District"
  details: string;           // "20 field trips / year\n30 students per trip"
  annualCost: string;        // "$9,000 / year"
  perParticipantNote: string; // "($15 per student)"
  href: string;              // "/solutions/k12"
}
```

#### Card Style

- `bg-card rounded-xl border border-border p-6 sm:p-8 shadow-card`
- Hover: `shadow-card-hover`, `translateY(-2px)`, transition `duration-normal`
- Icon container: `h-12 w-12 rounded-lg bg-primary-50`, icon `h-6 w-6 text-primary-700`
- Segment name: `.text-heading-sm text-foreground`
- Details: `.text-body-sm text-muted-foreground mt-2`, preserves line breaks
- Annual cost: `.text-heading-md text-foreground mt-4` -- the headline number
- Per-participant note: `.text-body-sm text-primary-700 font-medium` -- green contextualization
- Link: `.text-body-sm font-medium text-primary-700 mt-4 inline-flex items-center gap-1` with `ArrowRight` icon

### Scenario Data

| Segment | Icon | Details | Annual Cost | Note | Link |
|---------|------|---------|-------------|------|------|
| K-12 School District | `School` | 20 field trips / year, 30 students per trip | $9,000 / year | $15 per student | `/solutions/k12` |
| Church or Mission Org | `Church` | 3 mission trips / year, mixed domestic and international | $2,700 / year | Less than 1% of annual missions budget | `/solutions/churches` |
| Higher Education | `GraduationCap` | 8 study abroad programs / year, 20-25 participants each | $10,000 / year | Less than $50 per student for global safety coverage | `/solutions/higher-education` |
| Corporate / Sports | `Building2` | 15 team trips / year, 25 participants each | $11,250 / year | $30 per participant | `/solutions/corporate` |

### Section-Level Specs

| Element | Specification |
|---------|---------------|
| Eyebrow | `WHAT IT COSTS IN PRACTICE` |
| Heading | `Real Scenarios for Real Organizations` -- `.text-display-md text-foreground text-center` |
| Grid | `grid sm:grid-cols-2 gap-6 lg:gap-8 mt-12` |
| Section padding | Standard: `py-16 sm:py-20 lg:py-24 xl:py-32` |

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 640px) | Single column stack. |
| sm (640px) | 2x2 grid. |
| lg (1024px) | Same 2x2 grid with larger gaps. |

### Accessibility

- Each card is a `<a>` link wrapper with `group` class (entire card clickable).
- Icon is `aria-hidden="true"`.
- Annual cost uses `aria-label` with full context: `"Annual cost for a K-12 school district with 20 field trips per year: $9,000"`.

### Animation

- Cards: `staggerContainer` + `cardReveal` at 80ms intervals.

---

## Section 8: Procurement Path

### Purpose
Provide a direct route for procurement officers. These visitors have already decided to buy and need logistics, not persuasion.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-secondary  [data-theme="dark"]              |
|  max-w-[1280px] mx-auto  py-16 lg:py-20                                |
|                                                                         |
|     [left column]                       [right column]                  |
|                                                                         |
|     Ready to Purchase?                  Procurement documents:          |
|                                                                         |
|     We have everything your             [check] W-9 form               |
|     procurement team needs.             [check] Security questionnaire  |
|     Skip the sales cycle               [check] Contract templates      |
|     with ready-made                     [check] Data Processing        |
|     documentation.                             Agreement (DPA)         |
|                                         [check] Insurance certificate  |
|     [ For Procurement -> ]              [check] Compliance overview    |
|                                                                         |
+=========================================================================+
```

### Component Mapping

This uses `<DarkAuthoritySection>` wrapper. This is the 1st of max 2 dark sections (excluding footer).

| Element | Component / Class |
|---------|-------------------|
| Section wrapper | `<DarkAuthoritySection>` |
| Background | `bg-secondary` (`--color-secondary: #123646`), `[data-theme="dark"]` |
| Container | `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12` |
| Padding | `py-12 sm:py-16 lg:py-20` |
| Layout | `grid lg:grid-cols-2 gap-8 lg:gap-16 items-center` |
| Heading | `.text-display-md` in `dark-text-primary` (`#f7f8f8`) -- 11.6:1 on secondary |
| Body | `.text-body-lg` in `dark-text-secondary` (`#b8c3c7`) -- 7.0:1 on secondary |
| CTA | `<Button variant="primary-on-dark" size="lg">` -- white bg, `secondary` text |
| Checklist | `<ul>` with check icons in `dark-accent` (`#6cbc8b`, primary-400) -- 4.8:1 on secondary |
| Checklist text | `.text-body-md` in `dark-text-secondary` |

### Content (Exact Copy)

**Left column:**
- **Heading**: `Ready to Purchase?`
- **Body**: `We have everything your procurement team needs. Skip the sales cycle with ready-made documentation.`
- **CTA**: `For Procurement` -> `/procurement`

**Right column (checklist):**
1. W-9 form
2. Security questionnaire
3. Contract templates
4. Data Processing Agreement (DPA)
5. Insurance certificate
6. Compliance overview

### Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| base (< 1024px) | Single column. Heading + body + CTA stacked, then checklist below. |
| lg (1024px) | 2-column grid. Text left, checklist right. |

### Accessibility

- All text on `secondary` background passes WCAG AA (see Contrast Validation Matrix in Design System).
- Check icons use `dark-accent` (`#6cbc8b`) at 4.8:1 on `secondary` -- PASS AA normal text.
- Focus ring for CTA button is visible on dark background (uses `ring` token `#365462` with white offset).
- `aria-label="Procurement resources"` on the section.

### Animation

- `fadeIn` on entire section (20% intersection).
- Checklist items: `checklistReveal` staggered at 80ms.
- `prefers-reduced-motion`: Immediate render.

---

## Section 9: Common Questions (FAQ)

### Purpose
Address the 10 most common pricing objections and questions. Reduce support inquiries. Generate FAQ rich results in search.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-background                                  |
|  max-w-3xl mx-auto  py-20 lg:py-24                                     |
|                                                                         |
|            [Eyebrow]  COMMON QUESTIONS                                  |
|           Everything you need to know about pricing.                    |
|                                                                         |
|  +-------------------------------------------------------------------+ |
|  |  What counts as a "trip"?                               [v]       | |
|  +-------------------------------------------------------------------+ |
|  |  Can we start with just one trip?                       [v]       | |
|  +-------------------------------------------------------------------+ |
|  |  How does volume pricing work?                          [v]       | |
|  +-------------------------------------------------------------------+ |
|  |  Is there an annual plan?                               [v]       | |
|  +-------------------------------------------------------------------+ |
|  |  What payment methods do you accept?                    [v]       | |
|  +-------------------------------------------------------------------+ |
|  |  What happens after we purchase?                        [v]       | |
|  +-------------------------------------------------------------------+ |
|  |  Can we upgrade trip type after submission?             [v]       | |
|  +-------------------------------------------------------------------+ |
|  |  Do you offer nonprofit or church discounts?            [v]       | |
|  +-------------------------------------------------------------------+ |
|  |  How does per-student pricing work for large groups?    [v]       | |
|  +-------------------------------------------------------------------+ |
|  |  What if we need to cancel a trip review?               [v]       | |
|  +-------------------------------------------------------------------+ |
|                                                                         |
|       Have a question we didn't answer?                                 |
|       [ Contact Us ]                                                    |
|                                                                         |
+=========================================================================+
```

### Component

Uses `<FAQSection>` component (Design System Section 6.3) wrapping shadcn/ui `<Accordion>`.

| Element | Specification |
|---------|---------------|
| Component | `<FAQSection>` |
| Container | `max-w-3xl mx-auto` (768px) |
| Accordion | `type="single" collapsible` |
| Trigger | `.text-heading-sm text-foreground` (22px desktop, 18px mobile) |
| Content | `.text-body-md text-muted-foreground` |
| Chevron | `ChevronDown`, rotates 180deg on open, 200ms `ease-default` |
| Dividers | Each item separated by `border-b border-border` |
| Section padding | Standard: `py-16 sm:py-20 lg:py-24 xl:py-32` |

### FAQ Content (10 Questions)

**Q1: What counts as a "trip"?**
A trip is any organized travel event with a defined destination, dates, and participant group. A one-day field trip to a local museum counts as one trip. A week-long mission trip to Guatemala counts as one trip. Multi-stop itineraries within the same travel event are one trip. Each trip receives its own analyst review and safety binder.

**Q2: Can we start with just one trip?**
Yes. There is no minimum commitment. Many organizations start with a single trip to experience the full SafeTrekr process -- analyst review, risk intelligence scoring, and safety binder delivery -- before committing to additional trips. Volume discounts apply automatically as you add more trips within a 12-month period.

**Q3: How does volume pricing work?**
Volume discounts are calculated based on the total number of trips your organization submits within a rolling 12-month window. Discounts range from 5% (5-9 trips) to 20% (50+ trips) and are applied automatically. If you cross into a new tier mid-year, the new discount rate applies to all subsequent trips.

**Q4: Is there an annual plan?**
We offer annual agreements for organizations with predictable trip volumes. Annual plans lock in volume discount rates and include priority analyst assignment. Contact our sales team to discuss annual plan options tailored to your organization's schedule.

**Q5: What payment methods do you accept?**
We accept credit cards (Visa, Mastercard, American Express), ACH bank transfers, and purchase orders for organizations with established procurement processes. School districts and government entities can use standard PO workflows. Invoicing is available for annual plans.

**Q6: What happens after we purchase?**
After purchase, you submit your trip details through the SafeTrekr platform -- destination, dates, participants, activities, and logistics. Submission takes approximately 15 minutes. Your trip is assigned to a dedicated safety analyst who conducts the 17-section review. You receive your complete safety binder within 3-5 business days.

**Q7: Can we upgrade trip type after submission?**
If your trip scope changes -- for example, a domestic trip adds an international leg -- contact your assigned analyst. We will adjust the review scope and billing accordingly. Upgrades are pro-rated based on the difference between trip types.

**Q8: Do you offer nonprofit or church discounts?**
Our volume pricing structure is designed to accommodate organizations of all sizes. Churches and nonprofits with multiple annual trips typically qualify for volume discounts of 10-20%. Contact our sales team to discuss pricing for your specific situation. We also offer annual plans that can further reduce per-trip costs.

**Q9: How does per-student pricing work for large groups?**
Per-student cost decreases as group size increases because SafeTrekr pricing is per-trip, not per-participant. A field trip with 30 students costs $450 ($15/student). The same $450 field trip with 60 students drops to $7.50/student. The analyst review covers the entire trip regardless of group size.

**Q10: What if we need to cancel a trip review?**
If you cancel before the analyst review begins, you receive a full refund. If the review is already in progress, we will complete the review and deliver the safety binder -- the work has value even if the trip is postponed. Completed reviews can be applied to rescheduled trips to the same destination within 90 days.

### CTA Below FAQ

- **Text**: `Have a question we didn't answer?` -- `.text-body-md text-muted-foreground text-center mt-8`
- **Button**: `<Button variant="secondary" size="default">Contact Us</Button>` -> `/contact`

### Accessibility

- Accordion uses `aria-expanded` on triggers.
- Content regions announced on expansion.
- Single-expand mode prevents cognitive overload.
- All text meets contrast requirements (foreground/muted-foreground on background).
- Keyboard: Enter/Space toggles, ArrowDown/ArrowUp navigates between triggers.

### Animation

- FAQ items: `staggerContainer` with items fading up at 60ms intervals.
- Chevron rotation: 200ms, `ease-default`.
- `prefers-reduced-motion`: Items visible immediately, chevron change is instant.

---

## Section 10: Conversion CTA Banner

### Purpose
Final conversion touchpoint. Dual CTA pattern: primary for demo-ready visitors, secondary for sales conversations.

### Wireframe (Desktop, >= 1024px)

```
+=========================================================================+
|                          bg-primary-700                                 |
|  py-20 lg:py-28  text-center                                           |
|                                                                         |
|           Protect Your Next Trip                                        |
|                                                                         |
|           Every trip deserves a safety analyst.                          |
|           Start with a personalized demo.                               |
|                                                                         |
|           [ Get a Demo ]       [ Contact Sales ]                        |
|                                                                         |
+=========================================================================+
```

### Component

Uses `<CTABand variant="brand">` (Design System Section 6.3).

| Property | Value |
|----------|-------|
| Component | `<CTABand>` |
| Variant | `brand` |
| Background | `bg-primary-700` (`--color-primary-700: #33704b`) |
| Headline | `Protect Your Next Trip` -- `.text-display-md text-white` |
| Body | `Every trip deserves a safety analyst. Start with a personalized demo.` -- `.text-body-lg text-white/80 max-w-prose mx-auto` |
| Primary CTA | `<Button variant="primary-on-dark" size="lg">Get a Demo</Button>` -> `/demo` |
| Secondary CTA | `<Button variant="ghost" size="lg" className="text-white border-white/30 hover:bg-white/10">Contact Sales</Button>` -> `/contact` |
| Padding | `py-16 sm:py-20 lg:py-28` |

### Content (Exact Copy)

- **Headline**: `Protect Your Next Trip`
- **Body**: `Every trip deserves a safety analyst. Start with a personalized demo.`
- **Primary CTA**: `Get a Demo` -> `/demo`
- **Secondary CTA**: `Contact Sales` -> `/contact`

### Contrast Verification

| Text | Background | Ratio | WCAG AA |
|------|-----------|-------|---------|
| White (#ffffff) | primary-700 (#33704b) | 6.1:1 | PASS |
| White/80 (rgba(255,255,255,0.8)) | primary-700 (#33704b) | ~5.0:1 | PASS |

### Animation

- `fadeUp` on section enter. Headline + body + CTAs staggered at 100ms.
- `prefers-reduced-motion`: Immediate render.

---

## Full Page Scroll Summary

| # | Section | Background | Height Est. (Desktop) | Dark? |
|---|---------|-----------|----------------------|-------|
| -- | SiteHeader | transparent/blur | 64-80px | No |
| 1 | Hero | `background` | ~400px | No |
| 2 | Value Anchor | `card` + borders | ~200px | No |
| 3 | Pricing Tier Cards | `background` | ~700px | No |
| 4 | Volume Discounts | `background` | ~350px | No |
| 5 | What's Included | `primary-50` | ~600px | No |
| 6 | ROI Calculator | `card` + borders | ~280px | No |
| 7 | Segment Scenarios | `background` | ~500px | No |
| 8 | Procurement Path | `secondary` | ~300px | YES (1/2) |
| 9 | FAQ | `background` | ~600px | No |
| 10 | CTA Banner | `primary-700` | ~250px | Brand (not counted) |
| -- | SiteFooter | `secondary` | ~400px | Footer (exempt) |

**Total estimated page height**: ~4,680px (desktop). Approximately 4-5 viewport scrolls at 1080p.

**Background rhythm**: light -> surface -> light -> light -> green wash -> surface -> light -> dark -> light -> brand green. This creates a breathing visual rhythm without monotony.

---

## Component Dependency Tree

```
PricingPage
  |-- SiteHeader (shared)
  |-- Section 1: Hero
  |     |-- Eyebrow
  |     |-- Button (primary, lg)
  |     |-- Button (secondary, lg)
  |
  |-- Section 2: Value Anchor
  |     |-- ValueAnchorCard (x3) [new component]
  |
  |-- Section 3: Pricing Tiers
  |     |-- Eyebrow
  |     |-- PricingTierCard (x3) [from design system, extended props]
  |     |     |-- Badge (conditional)
  |     |     |-- Button (primary, lg)
  |
  |-- Section 4: Volume Discounts
  |     |-- Eyebrow
  |     |-- VolumeDiscountTable [new component]
  |     |-- Button (secondary)
  |
  |-- Section 5: What's Included
  |     |-- Eyebrow
  |     |-- FeatureCard (x7)
  |
  |-- Section 6: ROI Calculator Link
  |     |-- Button (primary, lg)
  |
  |-- Section 7: Segment Scenarios
  |     |-- Eyebrow
  |     |-- ScenarioCard (x4) [new component]
  |
  |-- Section 8: Procurement Path
  |     |-- DarkAuthoritySection
  |     |-- Button (primary-on-dark, lg)
  |
  |-- Section 9: FAQ
  |     |-- FAQSection
  |     |     |-- Accordion (shadcn/ui)
  |     |-- Button (secondary)
  |
  |-- Section 10: CTA Banner
  |     |-- CTABand (variant="brand")
  |
  |-- SiteFooter (shared)
```

### New Components Required

| Component | File | Complexity | Notes |
|-----------|------|-----------|-------|
| `ValueAnchorCard` | `components/marketing/value-anchor-card.tsx` | Low | Simple icon + value + label card with emphasis variant |
| `VolumeDiscountTable` | `components/marketing/volume-discount-table.tsx` | Medium | Responsive table/card-list hybrid with mobile breakpoint |
| `ScenarioCard` | `components/marketing/scenario-card.tsx` | Low | Extends FeatureCard pattern with cost data |
| `PricingTierCard` (extended) | `components/marketing/pricing-tier.tsx` | Medium | Extends existing PricingTier with `perParticipantPrice`, `groupSizeBasis` props |

### Existing Components Used

| Component | Source |
|-----------|--------|
| `Eyebrow` | `components/ui/eyebrow.tsx` |
| `Button` | `components/ui/button.tsx` |
| `Badge` | `components/ui/badge.tsx` |
| `FeatureCard` | `components/marketing/feature-card.tsx` |
| `FAQSection` | `components/marketing/faq-section.tsx` |
| `CTABand` | `components/marketing/cta-band.tsx` |
| `DarkAuthoritySection` | `components/marketing/dark-authority-section.tsx` |
| `SiteHeader` | `components/layout/site-header.tsx` |
| `SiteFooter` | `components/layout/site-footer.tsx` |

---

## Mobile-Specific Considerations (< 640px)

### Critical Content Priority (Above the Fold)

On mobile, the first viewport (~680px on iPhone 14) should show:
1. Header (56px)
2. Eyebrow + Headline + Sub-headline (~200px)
3. CTA buttons (~100px)
4. Beginning of Value Anchor section

The per-participant price ("$15 Per Participant") MUST be visible without scrolling on all devices >= 360px width.

### Touch Targets

All interactive elements meet WCAG 2.5.5 minimum 44x44px:
- CTA buttons: `size="lg"` = 52px height
- Accordion triggers: full-width, min 48px height with padding
- Table rows (mobile stacked): full-width cards, min 44px touch zone
- Scenario cards: full card is link target, min 44px height per card

### Font Size Minimums

No text below 12px (`.text-body-xs`). All body text is 14px+ on mobile. Headings scale via `clamp()` functions defined in the type scale.

### Sticky Behavior

- Header remains sticky on scroll (`sticky top-0`).
- No sticky pricing comparison bar or floating CTA -- these add complexity without clear conversion benefit for this page type.

### Performance on Mobile

- No heavy images or illustrations on this page. Text-dominant layout is inherently fast.
- JSON-LD and FAQ schema are SSG'd -- no client-side data fetching.
- Accordion is client component (`"use client"`) but is below the fold. No impact on LCP.
- Estimated page weight (before shared assets): < 20KB HTML, < 5KB component JS (accordion interactivity).

---

## SEO Considerations

### Target Keywords

| Priority | Keyword | Placement |
|----------|---------|-----------|
| P0 | `trip safety pricing` | H1, meta title, meta description |
| P0 | `field trip safety cost` | Tier card content, FAQ |
| P0 | `per student trip safety` | H1 ("$15 Per Participant"), FAQ Q9 |
| P1 | `mission trip safety pricing` | Scenario card (Church), FAQ |
| P1 | `study abroad safety cost` | Scenario card (Higher Ed) |
| P1 | `school field trip liability` | Value anchor section |
| P2 | `trip risk assessment pricing` | Body copy |
| P2 | `safety binder cost` | Feature list, FAQ |

### Structured Data

- `Product` + `Offer` schema enables Google price display in search results.
- `FAQPage` schema enables FAQ rich snippets (expandable Q&A in SERP).
- Both schemas are embedded as `<script type="application/ld+json">` in the page `<head>` via Next.js metadata API.

### Internal Linking

| From (this page) | To | Anchor Text | Context |
|-------------------|----|-------------|---------|
| Hero CTA | `/demo` | Get a Demo | Primary conversion |
| Hero CTA | `/contact` | Contact Sales | Secondary conversion |
| ROI section | `/resources/roi-calculator` | Use the ROI Calculator | Mid-page bridge |
| Scenario cards | `/solutions/k12` | Learn more | Segment routing |
| Scenario cards | `/solutions/churches` | Learn more | Segment routing |
| Scenario cards | `/solutions/higher-education` | Learn more | Segment routing |
| Scenario cards | `/solutions/corporate` | Learn more | Segment routing |
| Procurement section | `/procurement` | For Procurement | Procurement path |
| FAQ contact | `/contact` | Contact Us | Support fallback |
| Volume discounts | `/contact` | Contact Sales | High-volume inquiry |
| CTA banner | `/demo` | Get a Demo | Final conversion |
| CTA banner | `/contact` | Contact Sales | Final conversion |

### Pages Linking TO This Page

| From | Anchor Text | Context |
|------|-------------|---------|
| Homepage (Section 8) | View Pricing | Pricing preview |
| `/solutions/k12` (Section 6) | View full pricing | Per-student calculator |
| `/solutions/churches` (Section 7) | View full pricing | Pricing context |
| `/solutions/higher-education` | View pricing | Pricing context |
| `/solutions/corporate` | View pricing | Pricing context |
| `/how-it-works` | View Pricing | Contextual link |
| `/demo` (alt paths) | View pricing instead | Alternative path |
| Primary nav | Pricing | Navigation link |

---

## Accessibility Audit Checklist

| # | Requirement | Implementation | Status |
|---|-------------|----------------|--------|
| 1 | Page has exactly one `<h1>` | Hero headline is the sole `<h1>` | SPECIFIED |
| 2 | Heading hierarchy is sequential | h1 (Hero) -> h2 (each section heading) -> h3 (card titles) | SPECIFIED |
| 3 | All text meets WCAG AA contrast | All color pairs verified against Design System 3.8 matrix | VERIFIED |
| 4 | All interactive elements >= 44x44px | Buttons `size="lg"` (52px), accordion triggers full-width 48px+ | SPECIFIED |
| 5 | Focus-visible on all interactive elements | `ring` token, 2px width, 2px offset | SPECIFIED |
| 6 | Skip-nav link present | Provided by `SiteHeader` shared component | INHERITED |
| 7 | ARIA landmarks on all sections | Each section has `aria-label` or `aria-labelledby` | SPECIFIED |
| 8 | Price values have aria-labels | Full context labels on all price displays | SPECIFIED |
| 9 | Table has semantic markup | `<table>`, `<thead>`, `<th scope="col">`, `<tbody>` | SPECIFIED |
| 10 | Mobile table alternative | Stacked card view with `<dl>` semantics below 640px | SPECIFIED |
| 11 | Accordion keyboard navigation | Enter/Space toggles, arrows navigate triggers | SPECIFIED |
| 12 | FAQ `aria-expanded` states | Provided by shadcn/ui Accordion primitive | INHERITED |
| 13 | Icons are decorative | All icons use `aria-hidden="true"` with adjacent text labels | SPECIFIED |
| 14 | `prefers-reduced-motion` respected | All animations disabled, final state shown immediately | SPECIFIED |
| 15 | No auto-playing media | Page is text-dominant, no media | N/A |
| 16 | Color is not sole information carrier | All color distinctions paired with text, icons, or position | SPECIFIED |
| 17 | Dark section contrast verified | All dark-on-`secondary` pairs verified (11.6:1, 7.0:1, 4.8:1) | VERIFIED |
| 18 | JSON-LD FAQPage schema present | Enables rich snippets for screen readers and search | SPECIFIED |
| 19 | Page language set | `<html lang="en">` (site-wide) | INHERITED |
| 20 | Resize to 200% without loss | Fluid typography via `clamp()`, flexible grid, no fixed widths | SPECIFIED |

---

## Analytics Event Schema

| Event Name | Trigger | Payload |
|------------|---------|---------|
| `pricing_page_view` | Page load | `{ page: '/pricing', referrer, utm_source, utm_medium, utm_campaign }` |
| `pricing_tier_view` | Tier cards scroll into viewport (20%) | `{ tiers_visible: ['field-trip', 'extended-trip', 'international'] }` |
| `pricing_cta_click` | Any CTA button click | `{ cta_label, cta_href, section, tier_id (if applicable) }` |
| `pricing_faq_expand` | FAQ accordion item opened | `{ question_text, question_index }` |
| `pricing_volume_table_view` | Volume table scrolls into viewport | `{ section: 'volume-discounts' }` |
| `pricing_scenario_click` | Scenario card clicked | `{ segment, annual_cost, href }` |
| `pricing_procurement_click` | Procurement CTA clicked | `{ section: 'procurement' }` |
| `pricing_roi_calculator_click` | ROI calculator CTA clicked | `{ section: 'roi-calculator' }` |
| `pricing_scroll_depth` | 25%, 50%, 75%, 100% scroll | `{ depth_percent }` |

---

## Implementation Notes

### File Structure

```
app/
  pricing/
    page.tsx                          # Server component, SSG
    _components/
      pricing-hero.tsx                # Section 1
      value-anchor.tsx                # Section 2
      pricing-tiers.tsx               # Section 3
      volume-discounts.tsx            # Section 4 ("use client" for responsive table)
      included-features.tsx           # Section 5
      roi-calculator-link.tsx         # Section 6
      segment-scenarios.tsx           # Section 7
      procurement-path.tsx            # Section 8
      pricing-faq.tsx                 # Section 9 ("use client" for accordion)
```

### Client vs Server Components

| Component | Rendering | Reason |
|-----------|-----------|--------|
| `page.tsx` | Server (SSG) | Static content, SEO-critical |
| `pricing-hero.tsx` | Server | Static text + buttons |
| `value-anchor.tsx` | Server | Static content |
| `pricing-tiers.tsx` | Server | Static content |
| `volume-discounts.tsx` | Client | Responsive table/card toggle |
| `included-features.tsx` | Server | Static content |
| `roi-calculator-link.tsx` | Server | Static content |
| `segment-scenarios.tsx` | Server | Static content |
| `procurement-path.tsx` | Server | Static content |
| `pricing-faq.tsx` | Client | Accordion interactivity |
| Animation wrappers | Client | Framer Motion `useInView` |

### Data Architecture

All pricing data (tiers, volume discounts, features, FAQ) should be defined in a single data file:

```
lib/
  data/
    pricing.ts                        # All pricing constants
```

This enables:
- Single source of truth for prices across the site (homepage pricing preview, segment pages, pricing page).
- Easy updates when pricing changes.
- Type safety via TypeScript interfaces.

### Performance Expectations

| Metric | Target | Rationale |
|--------|--------|-----------|
| LCP | < 1.5s | Text-dominant page, no heavy media. Hero text is LCP element. |
| CLS | < 0.05 | No dynamic content shifts. All content SSG'd. Font `display: swap` with metric-compatible fallbacks. |
| FID | < 50ms | Minimal client-side JS. Only accordion and animation wrappers. |
| Total page weight | < 80KB (before shared assets) | No images in page-specific content. |
| Time to Interactive | < 2s | Accordion and animation JS are non-blocking. |

---

## Design Rationale Ledger

| Decision | User Need | KPI Targeted | Evidence | Confidence |
|----------|-----------|-------------|----------|------------|
| Lead with $15/participant, not $450/trip | Budget holders think in per-student cost, not per-trip | Reduce pricing page bounce rate | User context requirement; per-student framing standard in EdTech pricing | HIGH |
| Value anchor before tier cards | Visitors need cost context before evaluating price | Increase scroll depth past tier cards | Loss aversion framing (Kahneman). Anchor against $500K-$2M settlements. | HIGH |
| All features at every tier | Eliminate "which tier do I need?" friction | Increase demo request conversion from pricing page | No feature differentiation in the product -- tiers are complexity-based | HIGH |
| "Most Common" badge on Extended Trip | Guide undecided visitors to the middle tier | Increase Extended Trip tier selection in demo requests | Decoy effect (Ariely). Middle option with social proof label. | MEDIUM |
| Segment scenarios with annual cost | Organizations budget annually, not per-trip | Reduce "too expensive" objection rate | K-12 and church segments budget in annual cycles | HIGH |
| Procurement section on pricing page | Procurement officers arrive at pricing and need a next step | Increase procurement page visits from pricing | Common B2B/GovTech pattern. Procurement is a distinct persona. | HIGH |
| 10 FAQ items covering cancellation, upgrades, large groups | Reduce sales team question volume | Decrease support tickets from pricing-stage leads | IA Section 3.4 identifies 8-10 FAQ items needed | HIGH |
| No animation on pricing cards | Price stability builds trust | Reduce cognitive load on pricing evaluation | Design System rule: "Stability and readability are paramount" | HIGH |
| Dark section for procurement (not pricing details) | Visual hierarchy separates pricing from logistics | Improve scan-ability of page sections | Design System rule: dark sections never for pricing details | HIGH |

---

## QA Checklist (Pre-Launch)

- [ ] All 3 tier prices render correctly ($450, $750, $1,250)
- [ ] All per-participant calculations render correctly ($15, $30, $62.50)
- [ ] Volume discount table shows all 5 tiers with correct percentages
- [ ] All 10 FAQ items expand/collapse correctly
- [ ] JSON-LD Product + Offer schema validates (Google Rich Results Test)
- [ ] JSON-LD FAQPage schema validates
- [ ] Lighthouse Accessibility score >= 95 (target 100)
- [ ] axe-core: 0 violations
- [ ] All CTA links route correctly (`/demo`, `/contact`, `/procurement`, `/resources/roi-calculator`, `/solutions/*`)
- [ ] Mobile layout: tier cards stack, table converts to cards, all touch targets >= 44px
- [ ] `prefers-reduced-motion`: all animations disabled, content visible immediately
- [ ] OG image renders correctly on social share preview
- [ ] Canonical URL is `https://www.safetrekr.com/pricing`
- [ ] Redirects work: `/plans` -> `/pricing`, `/pricing-plans` -> `/pricing`
- [ ] Page loads under 2.5s LCP on mobile (3G throttled)
- [ ] All inter-page links from IA cross-references tested (homepage pricing preview, segment pages)
- [ ] Dark section count: exactly 1 (procurement) + footer (exempt)
- [ ] "Most Common" badge visible on Extended Trip card
- [ ] Featured card scale(1.05) visible on desktop, removed on mobile
- [ ] Value anchor "$15" counter animation plays on scroll (and shows final value with reduced motion)
