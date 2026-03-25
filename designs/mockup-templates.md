# Mockup Specification: Template Pages

**Version**: 1.0
**Date**: 2026-03-24
**Status**: READY FOR IMPLEMENTATION
**Design System Reference**: `DESIGN-SYSTEM.md` v1.0
**IA Reference**: `INFORMATION-ARCHITECTURE.md` v1.0.0

This document specifies four template pages:

1. [Blog Post Template (`/blog/[slug]`)](#template-1-blog-post-blogslug)
2. [FAQ Hub (`/resources/faq`)](#template-2-faq-hub-resourcesfaq)
3. [404 Error Page (`/404`)](#template-3-404-error-page-404)
4. [Legal Page Template (`/legal/[slug]`)](#template-4-legal-page-template-legalslug)

---
---

# Template 1: Blog Post (`/blog/[slug]`)

**Page Type**: Blog Post (ISR, 1-hour revalidation)
**Hierarchy Level**: L2
**Canonical URL**: `https://www.safetrekr.com/blog/[slug]`
**JSON-LD**: `Article`, `BreadcrumbList`
**Breadcrumb**: `Home > Blog > [Post Title]`
**Content Format**: MDX (compiled at build time via next-mdx-remote or similar)
**Title Tag**: `[Post Title] -- SafeTrekr Blog`
**Meta Description**: First 155 characters of post excerpt, or custom meta description field from CMS.

**Sample Article**: "Do Liability Waivers Actually Protect Schools on Field Trips?"

---

## Page Metadata

### SEO

| Property | Value |
|----------|-------|
| `<title>` | `Do Liability Waivers Actually Protect Schools on Field Trips? -- SafeTrekr Blog` |
| `meta description` | `Most school districts rely on liability waivers as their primary legal protection for field trips. But do they actually hold up? A look at what courts have ruled -- and what actually protects your district.` |
| `og:title` | `Do Liability Waivers Actually Protect Schools on Field Trips?` |
| `og:description` | Same as meta description |
| `og:type` | `article` |
| `og:image` | `/og/blog/[slug].png` (1200x630, auto-generated from title + category) |
| `article:published_time` | ISO 8601 datetime |
| `article:modified_time` | ISO 8601 datetime |
| `article:author` | Author name |
| `article:section` | Category name |
| `article:tag` | Array of tag strings |
| `canonical` | `https://www.safetrekr.com/blog/do-liability-waivers-protect-schools-field-trips` |

### JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Do Liability Waivers Actually Protect Schools on Field Trips?",
  "description": "Most school districts rely on liability waivers as their primary legal protection for field trips. But do they actually hold up?",
  "image": "https://www.safetrekr.com/og/blog/do-liability-waivers-protect-schools-field-trips.png",
  "datePublished": "2026-03-20T08:00:00Z",
  "dateModified": "2026-03-20T08:00:00Z",
  "author": {
    "@type": "Person",
    "name": "Sarah Chen",
    "jobTitle": "Safety Analyst",
    "url": "https://www.safetrekr.com/about/analysts"
  },
  "publisher": {
    "@type": "Organization",
    "name": "SafeTrekr",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.safetrekr.com/logo.svg"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.safetrekr.com/blog/do-liability-waivers-protect-schools-field-trips"
  },
  "wordCount": 2400,
  "articleSection": "K-12 Compliance"
}
```

---

## Dark Section Budget

This page uses **1 dark section** (of the maximum 2 allowed excluding footer):

1. **Newsletter Signup CTA** -- `CTABand variant="dark"`. Rationale: terminal conversion prompt for content readers.

---

## Page-Level Design Register

| Register | Weight | Application on This Page |
|----------|--------|--------------------------|
| Polished Operational (70%) | Supporting | Breadcrumb, metadata strip, related posts grid, author card, structured sidebar |
| Editorial Intelligence (20%) | **Dominant** | Article body typography, generous line-height, pull quotes, heading hierarchy. This is the most editorially-driven page on the site. |
| Watchtower Light (10%) | Restrained | Route divider SVG between article body and related posts |

The blog post is the most text-heavy page template. It must feel like a premium editorial publication -- clean, spacious, and readable. The typography system carries the entire experience.

---

## Page-Level Layout

### Section Rhythm

```
 1. Hero (Article Header)    bg-background, hero section padding
 2. Article Body + Sidebar   bg-background, standard section padding
 3. Author Bio Card          bg-card, compressed section padding
 4. Related Posts             bg-background, standard section padding
 5. Newsletter Signup CTA    bg-secondary (dark section), standard section padding
 6. Footer                   bg-secondary (global component)
```

### Container

All sections use the standard container pattern:
```
max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12
```

### ASCII Page Map (Desktop, >= 1024px)

```
+============================================================================+
| [SiteHeader -- sticky, global]                                             |
+============================================================================+
|                                                                            |
|  Home > Blog > Do Liability Waivers Actually Protect Schools...            |
|  [breadcrumb, body-sm, muted-foreground]                                   |
|                                                                            |
+----------------------------------------------------------------------------+
|                                                                            |
|  [K-12 Compliance]                                                         |
|  [badge, primary-50 bg, primary-800 text]                                  |
|                                                                            |
|  Do Liability Waivers Actually                                             |
|  Protect Schools on Field Trips?                                           |
|  [display-md, foreground]                                                  |
|                                                                            |
|  [40px avatar]  Sarah Chen, Safety Analyst                                 |
|                 March 20, 2026  *  12 min read                             |
|  [body-sm, muted-foreground]                                               |
|                                                                            |
|  [Share: LinkedIn] [Share: X] [Share: Copy Link]                           |
|  [icon buttons, ghost variant, 36px]                                       |
|                                                                            |
+----------------------------------------------------------------------------+
|                                                                            |
|  +--- 720px article column ---+  +--- 280px sidebar (sticky) -----------+ |
|  |                             |  |                                      | |
|  |  [Featured image, 16:9]    |  |  TABLE OF CONTENTS                   | |
|  |  [rounded-lg, full-width]  |  |  [eyebrow, primary-700]              | |
|  |                             |  |                                      | |
|  |  ## The Waiver Myth         |  |  * The Waiver Myth                   | |
|  |                             |  |  * What Courts Have Said             | |
|  |  Body paragraph text in     |  |  * The Negligence Standard           | |
|  |  Inter 16px, 1.6 line-      |  |  * What Actually Protects Schools    | |
|  |  height, muted-foreground   |  |  * Building Real Protection          | |
|  |  max-w-[65ch]...            |  |  * The Bottom Line                   | |
|  |                             |  |  [body-sm, muted-foreground,         | |
|  |  ## What Courts Have Said   |  |   active = primary-700 font-medium]  | |
|  |                             |  |                                      | |
|  |  Body text continues...     |  |  +----------------------------------+| |
|  |                             |  |  | [Sample Binder CTA]              || |
|  |  > "A waiver is not a       |  |  | See what a professional          || |
|  |  > substitute for proper    |  |  | safety review looks like.        || |
|  |  > safety planning."        |  |  | [Download Sample ->]             || |
|  |  [blockquote, primary-700,  |  |  +----------------------------------+| |
|  |   left border primary-500]  |  |                                      | |
|  |                             |  +--------------------------------------+ |
|  |  ## The Negligence Standard |  |                                        |
|  |                             |  | (sidebar becomes static below article  |
|  |  ...continues...            |  |  at lg+, hidden < lg)                  |
|  |                             |                                           |
|  |  ## What Actually Protects  |                                           |
|  |     Schools                 |                                           |
|  |                             |                                           |
|  |  ...continues...            |                                           |
|  |                             |                                           |
|  |  ## Building Real           |                                           |
|  |     Protection              |                                           |
|  |                             |                                           |
|  |  ...continues...            |                                           |
|  |                             |                                           |
|  |  ## The Bottom Line         |                                           |
|  |                             |                                           |
|  |  ...concluding section...   |                                           |
|  |                             |                                           |
|  +-----------------------------+                                           |
|                                                                            |
+----------------------------------------------------------------------------+
|  bg-card                                                                   |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  |  [64px avatar]                                                       |  |
|  |                                                                      |  |
|  |  Sarah Chen                                                          |  |
|  |  Safety Analyst at SafeTrekr                                         |  |
|  |                                                                      |  |
|  |  Sarah reviews trip safety plans for K-12 schools and districts.     |  |
|  |  She specializes in FERPA compliance and has reviewed over 200       |  |
|  |  field trip binders.                                                 |  |
|  |                                                                      |  |
|  |  [View all posts by Sarah ->]                                        |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+----------------------------------------------------------------------------+
|                                                                            |
|  RELATED ARTICLES                                                          |
|  [eyebrow, primary-700]                                                    |
|                                                                            |
|  You might also like                                                       |
|  [heading-lg, foreground]                                                  |
|                                                                            |
|  +--------------------+  +--------------------+  +--------------------+    |
|  | [IMAGE 16:9]       |  | [IMAGE 16:9]       |  | [IMAGE 16:9]       |   |
|  |                    |  |                    |  |                    |    |
|  | [Category Badge]   |  | [Category Badge]   |  | [Category Badge]   |   |
|  | Related Post Title |  | Related Post Title |  | Related Post Title |   |
|  | Excerpt text...    |  | Excerpt text...    |  | Excerpt text...    |   |
|  |                    |  |                    |  |                    |    |
|  | [Av] Author * Date |  | [Av] Author * Date |  | [Av] Author * Date |   |
|  +--------------------+  +--------------------+  +--------------------+    |
|                                                                            |
+============================================================================+
|  bg-secondary [data-theme="dark"]                                          |
|                                                                            |
|  STAY INFORMED                                                             |
|  [eyebrow, dark-accent]                                                    |
|                                                                            |
|  Get trip safety insights in your inbox.                                   |
|  [heading-lg, dark-text-primary]                                           |
|                                                                            |
|  We send 1-2 emails per month. No spam. Unsubscribe anytime.              |
|  [body-sm, dark-text-secondary]                                            |
|                                                                            |
|  [ Email address          ] [ Subscribe ]                                  |
|  [input, dark surface]      [button, primary-on-dark]                      |
|                                                                            |
+============================================================================+
| [SiteFooter -- global]                                                     |
+============================================================================+
```

### ASCII Page Map (Mobile, < 1024px)

```
+============================================+
| [SiteHeader -- mobile]                     |
+============================================+
|                                            |
|  < Back to Blog                            |
|  [breadcrumb collapsed, body-sm]           |
|                                            |
+--------------------------------------------+
|                                            |
|  [K-12 Compliance]                         |
|                                            |
|  Do Liability Waivers                      |
|  Actually Protect Schools                  |
|  on Field Trips?                           |
|  [display-md, fluid]                       |
|                                            |
|  [40px avatar]  Sarah Chen                 |
|  Mar 20, 2026  *  12 min read              |
|                                            |
|  [Share: LinkedIn] [X] [Copy]              |
|                                            |
+--------------------------------------------+
|                                            |
|  [Featured image, 16:9]                    |
|                                            |
|  TABLE OF CONTENTS                         |
|  [collapsible accordion, collapsed         |
|   by default on mobile]                    |
|  v  6 sections                             |
|                                            |
+--------------------------------------------+
|                                            |
|  ## The Waiver Myth                        |
|                                            |
|  Body text, full width,                    |
|  max-w-[65ch]...                           |
|                                            |
|  ...article continues...                   |
|                                            |
+--------------------------------------------+
|  [Author Bio Card]                         |
+--------------------------------------------+
|  [Related Posts -- stacked]                 |
+--------------------------------------------+
|  [Newsletter CTA]                          |
+============================================+
| [SiteFooter]                               |
+============================================+
```

---

## Section-by-Section Specification

---

### Section 1: Article Hero

**Component**: Custom `BlogPostHero` (template component)
**Background**: `background` (#e7ecee)
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

Centered header content. All content is left-aligned. No visual column. The hero is text-only to prioritize headline legibility and metadata scanning.

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | `pt-8 sm:pt-12 md:pt-16 lg:pt-20 pb-6 sm:pb-8 lg:pb-10` | Tighter than standard hero -- article should start soon |
| Breadcrumb | `<Breadcrumb>` component | `Home > Blog > [Post Title]` |
| Breadcrumb | `.text-body-sm text-muted-foreground mb-6 lg:mb-8` | Links in `primary-700` on hover |
| Breadcrumb mobile | `< Back to Blog` (single back-link) | Visible < 640px |
| Category badge | `<Badge variant="default">` | `bg-primary-50 text-primary-800` |
| Badge margin | `mb-4 lg:mb-6` | Below breadcrumb |
| Headline | `.text-display-md text-foreground` | 44px desktop / 28px mobile |
| Headline max-width | `max-w-[20ch]` | Controls line breaks for readability |
| Headline margin | `mb-6 lg:mb-8` | |
| Author row | `flex items-center gap-3` | |
| Author avatar | `h-10 w-10 rounded-full object-cover` | 40px circle |
| Author name | `.text-body-sm font-medium text-foreground` | "Sarah Chen, Safety Analyst" |
| Author meta | `.text-body-sm text-muted-foreground` | "March 20, 2026" + separator dot + "12 min read" |
| Author meta icon | `Clock` (Lucide), `icon-xs`, inline before reading time | |
| Author row margin | `mb-6` | |
| Share buttons row | `flex items-center gap-2` | |
| Share button | `<Button variant="ghost" size="icon">`, 36px | LinkedIn, X (Twitter), Copy Link icons |
| Share button icons | `h-4 w-4 text-muted-foreground` | `Linkedin`, `Twitter`, `Link2` (Lucide) |
| Share: copy feedback | Toast: "Link copied to clipboard" (2s auto-dismiss) | |

#### Copy (Sample Article)

**Category**: `K-12 Compliance`

**Headline**: `Do Liability Waivers Actually Protect Schools on Field Trips?`

**Author**: Sarah Chen, Safety Analyst
**Date**: March 20, 2026
**Reading Time**: 12 min read

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Breadcrumb | `fadeUp` | Page load | 0ms |
| Badge | `fadeUp` | Page load | 60ms stagger |
| Headline | `fadeUp` | Page load | 120ms stagger |
| Author row | `fadeUp` | Page load | 180ms stagger |
| Share buttons | `fadeIn` | Page load | 240ms |

#### Accessibility

- `<section aria-labelledby="blog-post-heading">`
- Headline is `<h1 id="blog-post-heading">` -- the only `<h1>` on the page
- Breadcrumb: `<nav aria-label="Breadcrumb">` wrapping `<ol>` with `aria-current="page"` on last item
- Share buttons: each has `aria-label` ("Share on LinkedIn", "Share on X", "Copy link to clipboard")
- Reading time: `<time>` element not required (not a date), but screen reader should read "12 minute read"

---

### Section 2: Article Body + Table of Contents Sidebar

**Component**: Custom `BlogPostLayout` (template component) wrapping MDX content
**Background**: `background` (#e7ecee)
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

Two-column layout on desktop (>= lg). Single column on mobile/tablet.

```
Desktop (>= lg):
+------------------------------------------------------------------+
|                                                                   |
|  +--- article column (flex-1, max-w-[720px]) ---+  +-- sidebar --+
|  |                                               |  | (w-[280px]) |
|  |  [Featured image]                             |  | sticky      |
|  |  [MDX body content]                           |  | top-28      |
|  |                                               |  |             |
|  +-----------------------------------------------+  +-------------+
|                                                                   |
+------------------------------------------------------------------+

Grid: grid lg:grid-cols-[1fr_280px] gap-12 lg:gap-16
```

#### Article Column Specifications

**Content max-width**: `max-w-[720px]` (45rem). This is the readable article column.

**Featured Image**:

| Property | Value |
|----------|-------|
| Container | `rounded-lg overflow-hidden mb-8 lg:mb-10` |
| Aspect ratio | `aspect-video` (16:9) |
| Image | `object-cover w-full h-full` |
| Loading | `loading="eager"`, Next.js `<Image>` with `priority` |
| Alt text | Descriptive alt from CMS, or post title as fallback |
| Caption (optional) | `.text-body-xs text-muted-foreground mt-2 italic` |

**MDX Typography Styles**:

All MDX-rendered content sits within a `.prose` wrapper that applies the following styles. These override Tailwind Typography defaults to match the SafeTrekr design system.

| Element | Token / Class | Specification |
|---------|---------------|---------------|
| `<h2>` | `.text-heading-lg text-foreground` | 36px desktop / 24px mobile. `mt-12 mb-4`. `font-display`. Rendered with `id` for anchor linking. `scroll-mt-24` for sticky header offset. |
| `<h3>` | `.text-heading-md text-foreground` | 28px desktop / 20px mobile. `mt-8 mb-3`. `font-display`. |
| `<h4>` | `.text-heading-sm text-foreground` | 22px desktop / 18px mobile. `mt-6 mb-2`. `font-display`. |
| `<p>` | `.text-body-md text-muted-foreground` | 16px, Inter, line-height 1.6. `mb-4`. `max-w-[65ch]`. |
| `<strong>` | `font-semibold text-foreground` | Elevated to foreground color for emphasis contrast. |
| `<em>` | `italic` | Standard italic treatment. |
| `<a>` | `text-primary-700 underline underline-offset-2 hover:text-primary-800 transition-colors duration-fast` | Inline links. External links append `ExternalLink` icon (`icon-xs`, inline). |
| `<blockquote>` | `border-l-4 border-primary-500 pl-6 py-1 my-8` | Left accent border. |
| `<blockquote> p` | `.text-heading-sm text-primary-700 italic font-medium` | Pull quote text. Not muted -- elevated to primary-700 for visual distinction. |
| `<ul>` | `list-none space-y-2 my-4 pl-0` | Custom bullet treatment. |
| `<ul> li` | `.text-body-md text-muted-foreground` | Each `<li>` prefixed with a `Check` icon (`icon-sm`, `text-primary-500`) via CSS `::before` or MDX component. `pl-7` for icon space. |
| `<ol>` | `list-decimal list-inside space-y-2 my-4` | Standard numbered list. |
| `<ol> li` | `.text-body-md text-muted-foreground` | Marker in `primary-700`. |
| `<code>` (inline) | `bg-primary-50 text-primary-800 px-1.5 py-0.5 rounded-sm text-mono-sm font-mono` | Inline code spans. |
| `<pre>` | `bg-secondary text-secondary-foreground rounded-lg p-4 sm:p-6 my-6 overflow-x-auto` | Code blocks on dark surface. |
| `<pre> code` | `.text-mono-sm font-mono text-dark-text-primary` | Code within blocks. |
| `<img>` (in content) | `rounded-lg my-8 w-full` | Content images. `aspect-auto`. |
| `<figure>` | `my-8` | Image with caption wrapper. |
| `<figcaption>` | `.text-body-xs text-muted-foreground mt-2 text-center italic` | Image captions. |
| `<hr>` | `border-t border-border my-10` | Standard divider. |
| `<table>` | `w-full my-6 border border-border rounded-lg overflow-hidden` | Data tables. |
| `<thead>` | `bg-card` | Header row surface. |
| `<th>` | `.text-body-sm font-semibold text-foreground p-3 text-left border-b border-border` | Table header cells. |
| `<td>` | `.text-body-sm text-muted-foreground p-3 border-b border-border` | Table data cells. |

**Callout / Admonition Component** (custom MDX component):

```
+----------------------------------------------------------------------+
|  [Info icon]  Callout Title                                           |
|                                                                       |
|  Callout body text providing additional context or a warning.         |
+----------------------------------------------------------------------+
```

| Variant | Icon | Border-left | Background |
|---------|------|-------------|------------|
| `info` | `Info` (Lucide) | `primary-500` | `primary-50` |
| `warning` | `AlertTriangle` | `warning-500` | `warning-50` |
| `tip` | `Lightbulb` | `primary-500` | `accent` |

Container: `rounded-lg border-l-4 p-4 sm:p-5 my-6`. Title: `.text-body-md font-semibold text-foreground`. Body: `.text-body-sm text-muted-foreground mt-1`.

#### Table of Contents Sidebar Specifications

**Component**: `BlogTableOfContents`

| Property | Value |
|----------|-------|
| Container | `w-[280px] lg:block hidden` (hidden < lg) |
| Position | `sticky top-28` (accounts for 64px header + 48px offset) |
| Max height | `max-h-[calc(100vh-8rem)] overflow-y-auto` |
| Background | `bg-card rounded-xl border border-border p-5` |
| Title | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em] mb-4` -- "TABLE OF CONTENTS" |
| List | `<nav aria-label="Table of contents">` wrapping `<ol>` |
| Item (H2) | `.text-body-sm text-muted-foreground py-1.5 block hover:text-foreground transition-colors duration-fast` |
| Item (H3) | Same as H2 but `pl-4` indent, `.text-body-xs` |
| Active item | `text-primary-700 font-medium border-l-2 border-primary-500 pl-3` (H2) or `pl-7` (H3) |
| Active tracking | Intersection Observer on each H2/H3 `id`. Highlights the currently visible section. |
| Scroll behavior | `scroll-behavior: smooth` on click. Offset: `scroll-mt-24` on headings. |
| Transition | Active indicator transitions between items: `duration-fast ease-default` |

**Mobile TOC** (< lg):

| Property | Value |
|----------|-------|
| Position | Below featured image, above article body |
| Component | shadcn/ui `Collapsible` or `Accordion` |
| Default state | Collapsed |
| Trigger | `flex items-center justify-between w-full py-3 border-b border-border` |
| Trigger text | `.text-body-sm font-medium text-foreground` -- "Table of Contents" |
| Trigger meta | `.text-body-xs text-muted-foreground` -- "6 sections" |
| Trigger icon | `ChevronDown`, rotates 180deg on expand, `duration-normal` |
| Content | Same list as desktop, full width, `pt-2 pb-4` |

**Sidebar CTA** (below TOC on desktop):

```
+--------------------------------------+
|  bg-primary-50, rounded-xl, p-5      |
|                                       |
|  [FileText icon, primary-700]         |
|                                       |
|  See what a professional              |
|  safety review looks like.            |
|  [body-sm, foreground]                |
|                                       |
|  Download a Sample Binder ->          |
|  [body-sm, primary-700, font-medium]  |
+--------------------------------------+
```

| Property | Value |
|----------|-------|
| Container | `bg-primary-50 rounded-xl p-5 mt-6` |
| Icon | `FileText`, `h-6 w-6 text-primary-700 mb-3` |
| Text | `.text-body-sm text-foreground` |
| CTA link | `.text-body-sm font-medium text-primary-700` with `ArrowRight` icon, `translateX(4px)` on hover |
| Link href | `/resources/sample-binders` |

#### Sample Article Content (for mockup reference)

**H2 sections** (each generates a TOC entry):

1. **The Waiver Myth** -- Introduction to the common misconception that a signed waiver is sufficient legal protection.
2. **What Courts Have Said** -- Case law examples where waivers were found insufficient. Blockquote: "A waiver cannot excuse negligence in the supervision of minors." -- *Appellate ruling summary*
3. **The Negligence Standard** -- Explanation of duty of care, breach, causation, and damages as they apply to field trip supervision.
4. **What Actually Protects Schools** -- Professional safety analysis, documented risk assessment, evidence of due diligence. Callout (info variant): SafeTrekr's 17-section review process.
5. **Building Real Protection** -- Practical steps: risk assessment, emergency planning, insurance documentation, professional review. Ordered list of 6 steps.
6. **The Bottom Line** -- Concluding argument: waivers are one layer, but documented professional safety review is what survives scrutiny.

---

### Section 3: Author Bio Card

**Component**: `AuthorBioCard`
**Background**: `card` (#f7f8f8) -- full-width band
**Dark section**: No
**Container**: `max-w-[720px] mx-auto px-6 sm:px-8` (same width as article column)

#### Layout

```
Desktop (>= lg):
+----------------------------------------------------------------------+
|  bg-card, full-width band                                             |
|                                                                       |
|  +--- max-w-[720px] mx-auto ----------------------------------------+|
|  |                                                                    ||
|  |  +------+                                                          ||
|  |  | 64px |  ABOUT THE AUTHOR                                       ||
|  |  | ava- |  [eyebrow, primary-700]                                  ||
|  |  | tar  |                                                          ||
|  |  +------+  Sarah Chen                                              ||
|  |            Safety Analyst at SafeTrekr                              ||
|  |            [heading-sm, foreground]                                 ||
|  |            [body-sm, muted-foreground]                              ||
|  |                                                                    ||
|  |  Sarah reviews trip safety plans for K-12 schools and districts.   ||
|  |  She specializes in FERPA compliance and has reviewed over 200     ||
|  |  field trip safety binders.                                        ||
|  |  [body-md, muted-foreground, max-w-prose]                          ||
|  |                                                                    ||
|  |  View all posts by Sarah ->                                        ||
|  |  [body-sm, primary-700, font-medium]                               ||
|  |                                                                    ||
|  +--------------------------------------------------------------------+|
|                                                                       |
+----------------------------------------------------------------------+
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section background | `bg-card` | Full-width band |
| Section padding | `py-10 sm:py-12 lg:py-16` | Compressed scale |
| Content wrapper | `max-w-[720px] mx-auto` | Matches article column |
| Layout | `flex items-start gap-4 sm:gap-6` | Avatar left, text right |
| Avatar | `h-16 w-16 rounded-full object-cover flex-shrink-0` | 64px circle |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em] mb-1` | "ABOUT THE AUTHOR" |
| Author name | `.text-heading-sm text-foreground` | Renders as `<h2>` with `id` |
| Author title | `.text-body-sm text-muted-foreground mt-0.5` | Job title + "at SafeTrekr" |
| Bio text | `.text-body-md text-muted-foreground mt-3 max-w-prose` | 2-3 sentences |
| All posts link | `.text-body-sm font-medium text-primary-700 mt-3 inline-flex items-center gap-1` | `ArrowRight` icon, hover `translateX(4px)` |
| Link href | `/blog?author=[author-slug]` or equivalent filter |

#### Accessibility

- `<section aria-labelledby="author-bio-heading">`
- Author name is `<h2 id="author-bio-heading">`
- Avatar has `alt="Photo of [Author Name]"`

---

### Section 4: Related Posts

**Component**: Reuses `PostCard` from blog index (3 cards in a grid)
**Background**: `background` (#e7ecee)
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

```
Desktop (>= lg):
+------------------------------------------------------------------+
|                                                                   |
|  RELATED ARTICLES                                                 |
|  [eyebrow, primary-700]                                           |
|                                                                   |
|  You might also like                                              |
|  [heading-lg, foreground]                                         |
|                                                                   |
|  +------------------+  +------------------+  +------------------+ |
|  | [PostCard]       |  | [PostCard]       |  | [PostCard]       | |
|  | Same spec as     |  | Same spec as     |  | Same spec as     | |
|  | blog index grid  |  | blog index grid  |  | blog index grid  | |
|  +------------------+  +------------------+  +------------------+ |
|                                                                   |
+------------------------------------------------------------------+
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | Standard: `py-16 sm:py-20 md:py-24 lg:py-32` | |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em]` | "RELATED ARTICLES" |
| Headline | `.text-heading-lg text-foreground mt-3 mb-10 lg:mb-12` | "You might also like" |
| Card grid | `grid sm:grid-cols-2 lg:grid-cols-3 gap-6` | |
| Cards | `PostCard` component (same spec as blog index) | Reuse -- no custom variant |
| Selection logic | Same category first, then most recent. Exclude current post. Fallback to most recent if < 3 in category. |

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Section header | `fadeUp` (staggered: eyebrow 0ms, headline 80ms) | 20% viewport | |
| Card grid | `staggerContainer` + `cardReveal` | 20% viewport | Cards stagger at 80ms |

#### Accessibility

- `<section aria-labelledby="related-posts-heading">`
- Headline is `<h2 id="related-posts-heading">`
- Each card is a full-card link with `group` pattern

---

### Section 5: Newsletter Signup CTA

**Component**: `CTABand variant="dark"` (reuse global component)
**Background**: `secondary` (#123646) with `[data-theme="dark"]`
**Dark section**: Yes (1 of 1 on this page)

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | Standard: `py-16 sm:py-20 md:py-24 lg:py-32` | |
| Eyebrow | `.text-eyebrow` in `dark-accent` (#6cbc8b) | "STAY INFORMED" |
| Headline | `.text-heading-lg text-[var(--color-dark-text-primary)]` | "Get trip safety insights in your inbox." |
| Sub-text | `.text-body-sm text-[var(--color-dark-text-secondary)]` | "We send 1-2 emails per month. No spam. Unsubscribe anytime." |
| Form layout | `flex flex-col sm:flex-row gap-3 mt-6 max-w-md mx-auto` | |
| Email input | `bg-[var(--color-dark-surface)] border-[var(--color-dark-border)] text-[var(--color-dark-text-primary)] placeholder:text-[var(--color-dark-text-secondary)] rounded-md h-11 px-4 flex-1` | Placeholder: "you@school.edu" |
| Submit button | `<Button variant="primary-on-dark" size="default">` | "Subscribe" |
| Success state | Replace form with: `Check` icon + "You're subscribed. Watch your inbox." in `dark-text-primary` | |

#### Accessibility

- `<section aria-labelledby="newsletter-heading">`
- Email input: `<label>` (visually hidden) + `aria-describedby` for helper text
- Form: `role="form"` with `aria-label="Newsletter signup"`
- Success: `aria-live="polite"` region

---

## Blog Post Component Specifications

### Share Buttons Component

**File**: `components/blog/share-buttons.tsx`

**Props**:
```typescript
interface ShareButtonsProps {
  title: string;
  url: string;
  className?: string;
}
```

| Button | Action | Icon |
|--------|--------|------|
| LinkedIn | Opens `https://www.linkedin.com/sharing/share-offsite/?url={url}` in new window | `Linkedin` |
| X (Twitter) | Opens `https://twitter.com/intent/tweet?text={title}&url={url}` in new window | `Twitter` |
| Copy Link | Copies `url` to clipboard, shows toast | `Link2` |

All buttons: `<Button variant="ghost" size="icon">` with `h-9 w-9`. Icons `h-4 w-4 text-muted-foreground`. Hover: `text-foreground`. `aria-label` on each.

### Reading Time Utility

**File**: `lib/reading-time.ts`

Calculation: `Math.ceil(wordCount / 200)` minutes. Returns string: `"12 min read"`.

---

## Responsive Behavior Summary

| Breakpoint | Layout Changes |
|------------|----------------|
| base (0-639px) | Single column. TOC collapsed in accordion above article. Share buttons horizontal. Featured image full-width. Related posts stacked. Breadcrumb collapses to "< Back to Blog". |
| sm (640px) | Minor padding adjustments. Related posts 2-column. |
| md (768px) | Related posts 2-column. |
| lg (1024px) | Two-column layout: article (720px) + sidebar (280px). TOC visible and sticky. Related posts 3-column. Full breadcrumb visible. |
| xl (1280px) | Max content width reached. Generous side margins. |

---

## Developer Notes

- **MDX Components**: Provide a custom MDX component map that overrides default HTML elements with the styled versions specified above. File: `components/blog/mdx-components.tsx`.
- **Table of Contents**: Auto-generate from MDX headings at build time. Parse H2 and H3 elements. Generate `id` slugs from heading text.
- **Related Posts**: Query at build time by category match, then recency. ISR revalidation refreshes related posts.
- **Images**: All blog images served via Next.js `<Image>` with automatic WebP/AVIF optimization. Provide `width` and `height` from CMS to prevent CLS.
- **Code Highlighting**: Use `rehype-pretty-code` with a custom dark theme matching `secondary` background.
- **Scroll Spy**: Use Intersection Observer to track which H2/H3 is in viewport. Debounce at 100ms. Update active TOC item.
- **URL structure**: `/blog/[slug]` where slug is kebab-case, 3-8 words, keyword-front, no dates.

---
---

# Template 2: FAQ Hub (`/resources/faq`)

**Page Type**: FAQ Hub (SSG)
**Hierarchy Level**: L2
**Canonical URL**: `https://www.safetrekr.com/resources/faq`
**Redirects**: `/faq` (301)
**JSON-LD**: `FAQPage`, `BreadcrumbList`
**Breadcrumb**: `Home > Resources > FAQ`
**Title Tag**: `Frequently Asked Questions -- SafeTrekr`
**Meta Description**: `Find answers to common questions about SafeTrekr's professional trip safety service. Learn about pricing, process, security, compliance, and how SafeTrekr protects your organization's travel.`

---

## Page Metadata

### SEO

| Property | Value |
|----------|-------|
| `<title>` | `Frequently Asked Questions -- SafeTrekr` |
| `meta description` | `Find answers to common questions about SafeTrekr's professional trip safety service. Learn about pricing, process, security, compliance, and how SafeTrekr protects your organization's travel.` |
| `og:title` | `FAQ -- SafeTrekr` |
| `og:description` | Same as meta description |
| `og:type` | `website` |
| `og:image` | `/og/faq.png` (1200x630, brand composition) |
| `canonical` | `https://www.safetrekr.com/resources/faq` |

### JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is SafeTrekr?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SafeTrekr is a professional trip safety service..."
      }
    }
  ]
}
```

The `mainEntity` array includes ALL FAQ items across all categories. This enables rich snippet display in search results.

---

## Dark Section Budget

This page uses **1 dark section** (of the maximum 2 allowed excluding footer):

1. **Section 4: Still Have Questions CTA** -- `CTABand variant="dark"`. Rationale: terminal conversion prompt.

---

## Page-Level Design Register

| Register | Weight | Application on This Page |
|----------|--------|--------------------------|
| Polished Operational (70%) | **Dominant** | Category filters, structured accordion layout, search bar, clean card surfaces |
| Editorial Intelligence (20%) | Supporting | Hero headline, generous section spacing |
| Watchtower Light (10%) | Minimal | No map or route elements. This is a utility page. |

The FAQ hub is a functional reference page. It prioritizes findability over visual storytelling. The design should feel like an organized knowledge base, not a marketing page.

---

## Page-Level Layout

### Section Rhythm

```
 1. FAQ Hero            bg-background, hero section padding
 2. Search Bar          bg-background, inline with hero or compressed top
 3. Category Tabs +     bg-background, standard section padding
    Accordion Content
 4. Still Have Questions bg-secondary (dark section), standard section padding
 5. Footer              bg-secondary (global component)
```

### Container

```
max-w-[var(--container-sm)] mx-auto px-6 sm:px-8 lg:px-12
```

FAQ content uses the **narrow container** (`--container-sm`: 640px) for optimal reading width. The category filter tabs use the standard container width.

### ASCII Page Map (Desktop, >= 1024px)

```
+============================================================================+
| [SiteHeader -- sticky, global]                                             |
+============================================================================+
|                                                                            |
|  Home > Resources > FAQ                                                    |
|  [breadcrumb]                                                              |
|                                                                            |
|  HELP CENTER                                                               |
|  [eyebrow, primary-700]                                                    |
|                                                                            |
|  Frequently Asked Questions                                                |
|  [display-md, foreground, centered]                                        |
|                                                                            |
|  Everything you need to know about SafeTrekr's                             |
|  professional trip safety service.                                         |
|  [body-lg, muted-foreground, centered]                                     |
|                                                                            |
|  +------------------------------------------------------------------+      |
|  | [Search icon]  Search questions...                                |      |
|  +------------------------------------------------------------------+      |
|  [input, max-w-md, centered, bg-card, border]                              |
|                                                                            |
+----------------------------------------------------------------------------+
|                                                                            |
|  [General] [Pricing] [Process] [Security] [Compliance] [Technical]         |
|  [category tabs, horizontal pill bar, centered]                            |
|  [active tab: bg-primary-50 text-primary-800 font-medium]                  |
|  [inactive: bg-transparent text-muted-foreground hover:text-foreground]    |
|                                                                            |
+----------------------------------------------------------------------------+
|  max-w-[640px] mx-auto                                                     |
|                                                                            |
|  GENERAL                                                                   |
|  [eyebrow, primary-700, left-aligned]                                      |
|                                                                            |
|  +------------------------------------------------------------------+      |
|  | v  What is SafeTrekr?                                             |      |
|  +------------------------------------------------------------------+      |
|  | v  Who uses SafeTrekr?                                            |      |
|  +------------------------------------------------------------------+      |
|  | v  How is SafeTrekr different from travel insurance?               |      |
|  +------------------------------------------------------------------+      |
|  | v  Do I need SafeTrekr for domestic trips too?                    |      |
|  +------------------------------------------------------------------+      |
|                                                                            |
|  PRICING                                                                   |
|  [eyebrow, primary-700]                                                    |
|                                                                            |
|  +------------------------------------------------------------------+      |
|  | v  How much does SafeTrekr cost?                                  |      |
|  +------------------------------------------------------------------+      |
|  | v  Is there a per-participant price?                               |      |
|  +------------------------------------------------------------------+      |
|  | v  Do you offer volume discounts?                                 |      |
|  +------------------------------------------------------------------+      |
|  | v  Can we start with just one trip?                               |      |
|  +------------------------------------------------------------------+      |
|                                                                            |
|  PROCESS                                                                   |
|  [eyebrow]                                                                 |
|                                                                            |
|  +------------------------------------------------------------------+      |
|  | v  How long does a safety review take?                            |      |
|  +------------------------------------------------------------------+      |
|  | v  What is included in the safety binder?                         |      |
|  +------------------------------------------------------------------+      |
|  | ...more items...                                                  |      |
|  +------------------------------------------------------------------+      |
|                                                                            |
|  SECURITY                                                                  |
|  +------------------------------------------------------------------+      |
|  | ...items...                                                       |      |
|  +------------------------------------------------------------------+      |
|                                                                            |
|  COMPLIANCE                                                                |
|  +------------------------------------------------------------------+      |
|  | ...items...                                                       |      |
|  +------------------------------------------------------------------+      |
|                                                                            |
|  TECHNICAL                                                                 |
|  +------------------------------------------------------------------+      |
|  | ...items...                                                       |      |
|  +------------------------------------------------------------------+      |
|                                                                            |
+============================================================================+
|  bg-secondary [data-theme="dark"]                                          |
|                                                                            |
|  Still have questions?                                                     |
|  [heading-lg, dark-text-primary, centered]                                 |
|                                                                            |
|  Our team is here to help. Get answers about SafeTrekr                     |
|  for your organization.                                                    |
|  [body-md, dark-text-secondary, centered]                                  |
|                                                                            |
|  [ Contact Us ]  [ Get a Demo ]                                            |
|  [secondary btn]  [primary-on-dark btn]                                    |
|                                                                            |
+============================================================================+
| [SiteFooter -- global]                                                     |
+============================================================================+
```

---

## Section-by-Section Specification

---

### Section 1: FAQ Hero + Search

**Component**: Custom `FAQHero`
**Background**: `background` (#e7ecee)
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | `pt-8 sm:pt-12 md:pt-16 lg:pt-20 pb-8 sm:pb-10 lg:pb-12` | Compressed bottom -- search bar is visually part of hero |
| Breadcrumb | `<Breadcrumb>` component, `.text-body-sm text-muted-foreground mb-6 lg:mb-8` | `Home > Resources > FAQ` |
| Breadcrumb mobile | `< Back to Resources` | Visible < 640px |
| Eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em]` | "HELP CENTER" |
| Eyebrow margin | `mb-4` | |
| Headline | `.text-display-md text-foreground text-center` | "Frequently Asked Questions" |
| Headline max-width | `max-w-[28ch] mx-auto` | |
| Headline margin | `mb-4` | |
| Sub-headline | `.text-body-lg text-muted-foreground text-center max-w-prose mx-auto` | "Everything you need to know about SafeTrekr's professional trip safety service." |
| Sub-headline margin | `mb-8 lg:mb-10` | |
| Search input container | `max-w-md mx-auto relative` | 448px max centered |
| Search input | `bg-card border border-border rounded-md h-11 px-4 pl-10 w-full text-body-md focus:ring-2 focus:ring-ring focus:border-ring` | |
| Search icon | `Search` (Lucide), `h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2` | |
| Search placeholder | `text-muted-foreground` | "Search questions..." |
| Search behavior | Client-side filter. Debounce 200ms. Filters accordion items by question text and answer text. Empty results: "No matching questions found. Try a different search term." |

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Eyebrow | `fadeUp` | Page load | 0ms |
| Headline | `fadeUp` | Page load | 80ms |
| Sub-headline | `fadeUp` | Page load | 160ms |
| Search bar | `fadeUp` | Page load | 240ms |

#### Accessibility

- `<section aria-labelledby="faq-hero-heading">`
- Headline is `<h1 id="faq-hero-heading">`
- Search input: `<label>` (visually hidden: "Search frequently asked questions"), `role="searchbox"`, `aria-label="Search questions"`
- Search results filtering: `aria-live="polite"` region announces result count ("Showing 4 matching questions" or "No matching questions found")

---

### Section 2: Category Filter Tabs

**Component**: Custom `FAQCategoryTabs`
**Background**: `background` (#e7ecee)
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12` (tabs stretch wider than FAQ content)

#### Layout

Horizontal pill bar, centered. Scrollable on mobile if tabs overflow.

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Container | `flex flex-wrap justify-center gap-2 mb-10 lg:mb-12` | |
| Tab (inactive) | `px-4 py-2 rounded-full text-body-sm text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-fast cursor-pointer border border-transparent` | |
| Tab (active) | `px-4 py-2 rounded-full text-body-sm font-medium text-primary-800 bg-primary-50 border border-primary-200` | |
| Tab transition | `duration-fast ease-default` | Color and background |
| Mobile overflow | `overflow-x-auto scrollbar-hide` on container, `flex-nowrap` | Horizontal scroll, no scrollbar |
| Scroll indicator | Subtle gradient fade on left/right edges when scrollable | `bg-gradient-to-r from-background` |

**Tab Labels** (6 categories):

| Tab | Internal ID | FAQ Count (sample) |
|-----|-------------|---------------------|
| General | `general` | 4-6 items |
| Pricing | `pricing` | 4-6 items |
| Process | `process` | 5-7 items |
| Security | `security` | 4-5 items |
| Compliance | `compliance` | 4-6 items |
| Technical | `technical` | 3-5 items |

**Behavior**:
- **Default**: "All" view -- all categories displayed with category headers. No "All" tab needed; the default state shows everything.
- **Active tab**: Clicking a category scrolls to that category section and visually highlights the tab. Other categories remain visible but the selected one scrolls into view.
- **URL hash**: Clicking a tab sets `#[category]` in the URL for deep linking. On page load, if a hash is present, auto-scroll to that category.

#### Accessibility

- `role="tablist"` on container
- Each tab: `role="tab"`, `aria-selected="true|false"`, `aria-controls="faq-category-[id]"`
- Keyboard: Left/Right arrow keys navigate between tabs. Enter/Space activates.

---

### Section 3: FAQ Accordion Groups

**Component**: Reuses `FAQSection` organism (from design system) with category grouping wrapper
**Background**: `background` (#e7ecee)
**Container**: `max-w-[var(--container-sm)] mx-auto px-6 sm:px-8` (narrow container: 640px)

#### Layout

Each category is a group with an eyebrow label and an accordion set. Groups are stacked vertically with generous spacing.

```
+--- max-w-[640px] ---+
|                      |
|  GENERAL             |
|  [eyebrow]           |
|                      |
|  +--accordion-1----+ |
|  | v Question text  | |
|  +------------------+ |
|  +--accordion-2----+ |
|  | v Question text  | |
|  +------------------+ |
|  ...                   |
|                      |
|  PRICING             |
|  [eyebrow]           |
|                      |
|  +--accordion-1----+ |
|  ...                   |
|                      |
+----------------------+
```

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | `py-4` (content flows from tabs above) | Minimal -- tabs and first group should feel connected |
| Category group spacing | `mb-12 lg:mb-16` between groups | Generous separation |
| Category ID | `id="faq-category-[slug]"` on each group | For deep linking and tab controls |
| Category eyebrow | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em] mb-4` | Category name |
| Accordion component | shadcn/ui `Accordion type="single" collapsible` | Single-expand per category group |
| Accordion item | `border-b border-border` | Divider between items |
| Accordion trigger | `flex items-center justify-between w-full py-4 text-left` | |
| Trigger text | `.text-heading-sm text-foreground` | Question text, left-aligned |
| Trigger icon | `ChevronDown`, `h-4 w-4 text-muted-foreground`, rotates 180deg on open | `duration-normal ease-default` |
| Accordion content | `pb-4` | |
| Answer text | `.text-body-md text-muted-foreground max-w-[65ch]` | Supports basic markdown (bold, links, lists) |
| Answer links | `text-primary-700 underline underline-offset-2` | Inline links to relevant pages |
| Answer list items | Same treatment as blog MDX lists | Check icons for unordered, numbered for ordered |

#### FAQ Content (Sample)

**General**:

| Question | Answer Summary |
|----------|----------------|
| What is SafeTrekr? | Professional trip safety service. Every trip reviewed by a trained safety analyst across 17 dimensions. Government intelligence data. Tamper-evident documentation. |
| Who uses SafeTrekr? | K-12 schools, higher education institutions, churches and mission organizations, corporate and sports teams. Any organization that sends groups on trips. |
| How is SafeTrekr different from travel insurance? | SafeTrekr is professional safety analysis and documentation, not insurance. We review destinations, score risks, and produce audit-ready evidence. Insurance pays claims after incidents. SafeTrekr helps prevent incidents and documents due diligence. Link: /blog/safetrekr-vs-travel-insurance |
| Do I need SafeTrekr for domestic trips too? | Yes. Domestic trips carry real liability risk. Courts evaluate whether reasonable precautions were taken regardless of destination. A field trip to a state park deserves the same documented safety review as an international trip. |

**Pricing**:

| Question | Answer Summary |
|----------|----------------|
| How much does SafeTrekr cost? | Starting at $15 per participant. Three tiers: Field Trip ($450/trip), Extended Trip ($750/trip), International ($1,250/trip). Link: /pricing |
| Is there a per-participant price? | Yes. The per-trip price translates to per-participant cost based on group size. A 30-student field trip at $450 is $15/student. |
| Do you offer volume discounts? | Yes. 5-9 trips: 5% off. 10-24: 10%. 25-49: 15%. 50+: 20%. Contact us for annual plans. Link: /pricing |
| Can we start with just one trip? | Absolutely. No minimum commitment. Purchase one trip review and see the quality before committing to more. |

**Process**:

| Question | Answer Summary |
|----------|----------------|
| How long does a safety review take? | 3-5 business days from trip submission to completed safety binder delivery. |
| What is included in the safety binder? | 17-section analyst review, risk intelligence scores from 5 government sources, emergency contact compilation, transportation safety analysis, accommodation review, health and medical considerations, compliance documentation, and SHA-256 hash-chain integrity verification. Link: /how-it-works |
| What information do I need to submit? | Destination, travel dates, number of participants, planned activities, transportation method, and accommodations. Takes about 15 minutes. No training required. |
| Can I update trip details after submission? | Yes. Notify your assigned analyst of changes and they will update the review. Material destination changes may require additional review time. |
| What happens if my destination changes? | Contact your analyst. A new destination requires a new review. We offer expedited processing for changes within 48 hours of travel. |

**Security**:

| Question | Answer Summary |
|----------|----------------|
| How does SafeTrekr protect our data? | AES-256 encryption at rest and in transit. SOC 2 compliance (in progress). All data stored in US-based infrastructure. Role-based access controls. Link: /security |
| What is the SHA-256 evidence chain? | Every page of your safety binder is cryptographically hashed. Any modification is detectable. This creates a tamper-evident audit trail that proves the binder has not been altered after delivery. |
| Who can access our safety binders? | Only authorized users within your organization. You control access permissions. SafeTrekr analysts access trip data only during the active review period. |
| Where is our data stored? | US-based cloud infrastructure with AES-256 encryption. Data retention follows your organization's preferences and applicable regulations. |

**Compliance**:

| Question | Answer Summary |
|----------|----------------|
| Is SafeTrekr FERPA compliant? | SafeTrekr is designed with FERPA requirements in mind. We minimize student data collection and provide data processing agreements. FERPA certification is in progress. Link: /legal/dpa |
| Does SafeTrekr comply with GDPR? | Yes. We offer a Data Processing Agreement (DPA) for organizations subject to GDPR. We support data subject rights requests and maintain lawful processing bases. Link: /legal/dpa |
| Can SafeTrekr satisfy our insurance documentation requirements? | Yes. The safety binder is designed to satisfy insurance carrier documentation requirements for trip safety. Many carriers accept SafeTrekr binders as evidence of professional safety review. |
| Does SafeTrekr help with Clery Act compliance? | Yes. For higher education institutions, SafeTrekr documentation supports Clery Act reporting for off-campus programs including study abroad. Link: /solutions/higher-education |

**Technical**:

| Question | Answer Summary |
|----------|----------------|
| What government data sources does SafeTrekr use? | Five primary sources: NOAA (weather/climate), USGS (seismic/geological), CDC (health advisories), GDACS (disaster alerts), and ReliefWeb (humanitarian situations). Link: /how-it-works |
| Is there an API? | Not currently. SafeTrekr is a service-based platform. API access for enterprise integrations is on our roadmap. |
| What browsers are supported? | All modern browsers: Chrome, Firefox, Safari, Edge (latest two versions). Mobile: iOS Safari, Chrome for Android. |
| Can SafeTrekr integrate with our existing systems? | Contact us to discuss integration needs. We support SSO for enterprise accounts and can provide data exports in standard formats. Link: /contact |

#### Search Filtering Behavior

When the search input has text:
- Filter all FAQ items across all categories by matching question text OR answer text (case-insensitive substring match)
- Category groupings remain -- but hide any category group with zero matching items
- Matching text highlighted with `<mark class="bg-primary-100 text-foreground rounded-sm px-0.5">` (subtle yellow-green highlight)
- Result count displayed: `.text-body-sm text-muted-foreground mb-6` -- "Showing [n] results for '[query]'"
- Clear button appears in search input: `X` icon to clear search and restore all items

When search is empty: all categories and items visible (default state).

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Category groups | `staggerContainer` | 20% viewport | Groups stagger at 120ms |
| Accordion items | `fadeUp` within group | Group in view | Items stagger at 60ms |
| Accordion expand | `duration-moderate ease-default` | Click trigger | Height animation, content fades in |

#### Accessibility

- Each category group: `<section id="faq-category-[slug]" aria-labelledby="faq-[slug]-heading">`
- Category heading: `<h2 id="faq-[slug]-heading">` (visually rendered as eyebrow, but semantically `<h2>`)
- Accordion: shadcn/ui handles `aria-expanded`, `aria-controls`, keyboard navigation
- Search filter: `aria-live="polite"` announces result count on filter change
- Deep link support: `#pricing` scrolls to pricing category with `scroll-mt-24`

---

### Section 4: Still Have Questions CTA

**Component**: `CTABand variant="dark"` (customized copy)
**Background**: `secondary` (#123646) with `[data-theme="dark"]`
**Dark section**: Yes (1 of 1 on this page)

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | Standard: `py-16 sm:py-20 md:py-24 lg:py-32` | |
| Headline | `.text-heading-lg text-[var(--color-dark-text-primary)] text-center` | "Still have questions?" |
| Body | `.text-body-md text-[var(--color-dark-text-secondary)] text-center max-w-prose mx-auto mt-4` | "Our team is here to help. Get answers about SafeTrekr for your organization." |
| CTA row | `flex flex-col sm:flex-row gap-3 justify-center mt-8` | |
| Primary CTA | `<Button variant="primary-on-dark" size="lg">` | "Get a Demo" -> `/demo` |
| Secondary CTA | `<Button variant="ghost" size="lg">` (dark-adapted: `text-dark-text-primary border-dark-border hover:bg-dark-surface`) | "Contact Us" -> `/contact` |

#### Accessibility

- `<section aria-labelledby="faq-cta-heading">`
- Headline is `<h2 id="faq-cta-heading">`

---

## Responsive Behavior Summary

| Breakpoint | Layout Changes |
|------------|----------------|
| base (0-639px) | Single column. Category tabs scroll horizontally. FAQ content full-width with padding. Breadcrumb collapses to back link. Search input full-width within padding. |
| sm (640px) | Tabs may still scroll. Content width constrained. |
| md (768px) | Tabs wrap to two rows if needed. Content centered. |
| lg (1024px) | Tabs single row. FAQ content within 640px narrow container. Full breadcrumb. |
| xl (1280px) | Max container width. Generous side margins. |

---

## Developer Notes

- **Data Source**: FAQ items stored in a structured JSON or MDX collection. Each item has: `id`, `category`, `question`, `answer` (supports markdown), `order`, `searchKeywords` (optional array for enhanced search).
- **Search**: Client-side filtering with `useMemo` and debounced input. No server round-trips.
- **Deep Linking**: Parse `window.location.hash` on mount. Scroll to matching category. Update hash on tab click.
- **JSON-LD**: Generate the FAQPage schema from the same data source at build time. Include all items.
- **Accordion State**: `type="single" collapsible` -- only one item open per category at a time. Clicking an open item closes it.
- **URL**: Canonical at `/resources/faq`. 301 redirect from `/faq`.

---
---

# Template 3: 404 Error Page (`/404`)

**Page Type**: System Error Page (SSG)
**Hierarchy Level**: System
**Canonical URL**: None (error pages should not be indexed)
**JSON-LD**: None
**Breadcrumb**: None
**Title Tag**: `Page Not Found -- SafeTrekr`
**Meta Robots**: `noindex, nofollow`
**Meta Description**: None (not indexed)

---

## Dark Section Budget

This page uses **0 dark sections**. The 404 page is a single light-theme composition. The footer remains as the only dark element.

---

## Page-Level Design Register

| Register | Weight | Application on This Page |
|----------|--------|--------------------------|
| Polished Operational (70%) | **Dominant** | Clean centered layout, structured link list, search functionality |
| Editorial Intelligence (20%) | Supporting | Friendly headline, subtle brand voice in tagline |
| Watchtower Light (10%) | Accent | SafeTrekr mark as the central visual anchor |

The 404 page is a functional recovery page. It should feel calm, helpful, and brand-consistent. Not whimsical or overly playful. The SafeTrekr brand voice is "calm authority" -- even when something has gone wrong, the tone communicates preparedness.

---

## Page-Level Layout

### Section Rhythm

```
 1. 404 Content     bg-background, vertically centered
 2. Footer          bg-secondary (global component)
```

### Container

```
max-w-[var(--container-sm)] mx-auto px-6 sm:px-8
```

Narrow container (640px). All content centered.

### ASCII Page Map (Desktop, >= 1024px)

```
+============================================================================+
| [SiteHeader -- sticky, global]                                             |
+============================================================================+
|                                                                            |
|                                                                            |
|                                                                            |
|                                                                            |
|                          [SafeTrekr Mark]                                   |
|                          [64px, secondary color,                           |
|                           30% opacity]                                     |
|                                                                            |
|                          404                                               |
|                          [display-lg, foreground,                          |
|                           font-mono, opacity-20]                           |
|                                                                            |
|                          Page not found                                    |
|                          [heading-lg, foreground]                          |
|                                                                            |
|                          The page you're looking for doesn't exist         |
|                          or has been moved.                                |
|                          [body-md, muted-foreground]                       |
|                                                                            |
|                          +--------------------------------------+          |
|                          | [Search icon]  Search SafeTrekr...   |          |
|                          +--------------------------------------+          |
|                          [input, max-w-sm, centered]                       |
|                                                                            |
|                          --------------------------------                  |
|                          [divider, border, 50% width]                      |
|                                                                            |
|                          Popular pages:                                    |
|                          [body-sm, muted-foreground]                       |
|                                                                            |
|                          Homepage                                          |
|                          Solutions                                         |
|                          Pricing                                           |
|                          Contact Us                                        |
|                          [body-md, primary-700, links]                     |
|                                                                            |
|                          --------------------------------                  |
|                                                                            |
|                          Even our 404 page is documented.                  |
|                          [body-xs, muted-foreground,                       |
|                           italic, opacity-60]                              |
|                                                                            |
|                                                                            |
|                                                                            |
+============================================================================+
| [SiteFooter -- global]                                                     |
+============================================================================+
```

### ASCII Page Map (Mobile, < 640px)

```
+============================================+
| [SiteHeader -- mobile]                     |
+============================================+
|                                            |
|              [SafeTrekr Mark]              |
|              [48px, 30% opacity]           |
|                                            |
|              404                           |
|              [display-md, mono]            |
|                                            |
|              Page not found                |
|              [heading-md]                  |
|                                            |
|              The page you're looking       |
|              for doesn't exist or          |
|              has been moved.               |
|                                            |
|  +--------------------------------------+  |
|  | Search SafeTrekr...                  |  |
|  +--------------------------------------+  |
|                                            |
|  ----------------------------------------  |
|                                            |
|              Popular pages:                |
|              Homepage                      |
|              Solutions                     |
|              Pricing                       |
|              Contact Us                    |
|                                            |
|  ----------------------------------------  |
|                                            |
|  Even our 404 page is documented.          |
|                                            |
+============================================+
| [SiteFooter]                               |
+============================================+
```

---

## Section Specification: 404 Content

**Component**: Custom `NotFoundPage` (system page)
**Background**: `background` (#e7ecee)
**Dark section**: No
**Container**: `max-w-[var(--container-sm)] mx-auto px-6 sm:px-8`

### Layout

All content vertically and horizontally centered. The page uses `min-h-[calc(100vh-64px-var(--footer-height))]` to fill the viewport between header and footer. Content is centered with `flex flex-col items-center justify-center`.

### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Outer container | `min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center` | Fills viewport minus header |
| Content wrapper | `max-w-[var(--container-sm)] mx-auto px-6 sm:px-8 py-16 sm:py-20 lg:py-24` | |
| SafeTrekr mark | `<Logo variant="mark-dark" height={64} />` on desktop, `height={48}` on mobile | |
| Mark opacity | `opacity-30` | Subtle, not dominant |
| Mark margin | `mb-6` | |
| 404 number | `.text-display-lg font-mono text-foreground opacity-20` | Large "404" as watermark-like element |
| 404 margin | `mb-4` | |
| Headline | `.text-heading-lg text-foreground` | "Page not found" |
| Headline margin | `mb-3` | |
| Body | `.text-body-md text-muted-foreground max-w-[35ch]` | "The page you're looking for doesn't exist or has been moved." |
| Body margin | `mb-8` | |
| Search input container | `relative max-w-sm w-full` | 384px max, full width of container |
| Search input | `bg-card border border-border rounded-md h-11 px-4 pl-10 w-full text-body-md focus:ring-2 focus:ring-ring focus:border-ring` | |
| Search icon | `Search` (Lucide), `h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2` | |
| Search placeholder | "Search SafeTrekr..." | |
| Search behavior | On Enter or after 500ms debounce, redirect to `/blog?q=[query]` or site-wide search if implemented. If no search exists, redirect to Google: `site:safetrekr.com [query]` | |
| Divider | `w-16 h-px bg-border mx-auto my-8` | Thin, short, centered |
| Links label | `.text-body-sm text-muted-foreground mb-4` | "Popular pages:" |
| Link list | `flex flex-col items-center gap-2` | Centered, vertical |
| Link item | `.text-body-md font-medium text-primary-700 hover:text-primary-800 transition-colors duration-fast` | Standard link treatment |
| Link arrow | `ArrowRight` icon, `icon-xs`, `ml-1`, `translateX(2px)` on hover | Subtle directional cue |
| Second divider | Same as first: `w-16 h-px bg-border mx-auto my-8` | |
| Tagline | `.text-body-xs text-muted-foreground italic opacity-60` | "Even our 404 page is documented." |

### Link List

| Label | Href |
|-------|------|
| Homepage | `/` |
| Solutions | `/solutions` |
| Pricing | `/pricing` |
| Contact Us | `/contact` |

### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| SafeTrekr mark | `scaleIn` | Page load | 0ms, scale from 0.9 to 1, opacity 0 to 0.3 |
| 404 number | `fadeIn` | Page load | 100ms delay |
| Headline | `fadeUp` | Page load | 200ms delay |
| Body | `fadeUp` | Page load | 280ms delay |
| Search bar | `fadeUp` | Page load | 360ms delay |
| Links | `staggerContainer` | Page load | Items stagger at 60ms, starting 440ms |
| Tagline | `fadeIn` | Page load | 700ms delay, 600ms duration (slow fade) |

### Accessibility

- `<main id="main-content">` wraps the entire 404 content
- Headline is `<h1>` -- "Page not found"
- Search input: `<label>` (visually hidden: "Search SafeTrekr"), `role="searchbox"`
- Link list: `<nav aria-label="Popular pages">` wrapping `<ul>`
- HTTP status: Ensure Next.js returns a true `404` HTTP status code (not a soft 404)
- Screen reader: The page should communicate clearly that the requested page was not found and offer alternatives

### Head Tags

```html
<meta name="robots" content="noindex, nofollow">
```

No canonical tag. No JSON-LD. No OG tags (not shareable).

---

## Developer Notes

- **File**: `app/not-found.tsx` (Next.js App Router convention)
- **Status Code**: Next.js automatically returns HTTP 404 for `not-found.tsx`
- **Header/Footer**: Include standard SiteHeader and SiteFooter. The 404 page should feel like part of the site, not a dead end.
- **Search**: If site-wide search is not implemented at launch, the search input can redirect to a Google site-scoped search: `https://www.google.com/search?q=site:safetrekr.com+[query]`
- **Analytics**: Fire Plausible event `404_page_view` with the attempted URL path as a property for tracking broken links.
- **Logging**: Log the referrer and attempted path server-side for broken link remediation.

---
---

# Template 4: Legal Page Template (`/legal/[slug]`)

**Page Type**: Legal Document (SSG)
**Hierarchy Level**: L2
**Canonical URL**: `https://www.safetrekr.com/legal/[slug]`
**JSON-LD**: `WebPage`, `BreadcrumbList`
**Breadcrumb**: `Home > Legal > [Policy Name]`
**Title Tag**: `[Policy Name] -- SafeTrekr`
**Meta Description**: `Read SafeTrekr's [policy name]. Last updated [date]. Version [version].`

**Applicable pages**: Privacy Policy (`/legal/privacy`), Terms of Service (`/legal/terms`), Data Processing Agreement (`/legal/dpa`), Acceptable Use Policy (`/legal/acceptable-use`), Cookie Policy (`/legal/cookies`).

---

## Page Metadata

### SEO (Template -- values are per-page)

| Property | Value Template |
|----------|----------------|
| `<title>` | `Privacy Policy -- SafeTrekr` (example) |
| `meta description` | `Read SafeTrekr's Privacy Policy. Last updated March 15, 2026. Version 1.2. Contact legal@safetrekr.com with questions.` |
| `og:title` | `Privacy Policy -- SafeTrekr` |
| `og:description` | Same as meta description |
| `og:type` | `website` |
| `og:image` | `/og/legal.png` (1200x630, generic legal page OG -- shared across all legal pages) |
| `canonical` | `https://www.safetrekr.com/legal/privacy` |

### JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Privacy Policy",
  "description": "SafeTrekr's Privacy Policy. Last updated March 15, 2026.",
  "url": "https://www.safetrekr.com/legal/privacy",
  "dateModified": "2026-03-15",
  "publisher": {
    "@type": "Organization",
    "name": "SafeTrekr"
  }
}
```

---

## Dark Section Budget

This page uses **0 dark sections**. Legal pages are entirely light theme. The footer is the only dark element. No CTABand. No promotional content. This is a utility document, not a marketing page.

---

## Page-Level Design Register

| Register | Weight | Application on This Page |
|----------|--------|--------------------------|
| Polished Operational (70%) | **Dominant** | Clean document layout, structured headings, metadata strip, TOC sidebar |
| Editorial Intelligence (20%) | Supporting | Generous line-height, readable column width, clear heading hierarchy |
| Watchtower Light (10%) | None | No brand motifs. Legal pages are deliberately neutral. |

The legal page template prioritizes readability and navigability above all else. It should feel like a well-organized legal document from a credible company -- not a marketing page with legal content bolted on.

---

## Page-Level Layout

### Section Rhythm

```
 1. Legal Page Header     bg-background, compressed hero padding
 2. Document Body +       bg-background, standard section padding
    Table of Contents
 3. Legal Contact Info    bg-card, compressed section padding
 4. Footer                bg-secondary (global component)
```

### Container

Document body uses a custom grid:
```
max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12
grid lg:grid-cols-[1fr_260px] gap-12 lg:gap-16
```

Article column: `max-w-[720px]`. Sidebar: `w-[260px]`.

### ASCII Page Map (Desktop, >= 1024px)

```
+============================================================================+
| [SiteHeader -- sticky, global]                                             |
+============================================================================+
|                                                                            |
|  Home > Legal > Privacy Policy                                             |
|  [breadcrumb, body-sm, muted-foreground]                                   |
|                                                                            |
+----------------------------------------------------------------------------+
|                                                                            |
|  Privacy Policy                                                            |
|  [display-md, foreground]                                                  |
|                                                                            |
|  +-------------------------------------------+                             |
|  | Last updated: March 15, 2026              |                             |
|  | Version: 1.2                              |                             |
|  | Effective: March 15, 2026                 |                             |
|  +-------------------------------------------+                             |
|  [metadata card, bg-card, rounded-lg, border,                              |
|   body-sm, muted-foreground, p-4]                                          |
|                                                                            |
+----------------------------------------------------------------------------+
|                                                                            |
|  +--- 720px article column ---+  +--- 260px sidebar (sticky) ----------+  |
|  |                             |  |                                     |  |
|  |  ## 1. Introduction         |  |  TABLE OF CONTENTS                  |  |
|  |                             |  |  [eyebrow, primary-700]             |  |
|  |  This Privacy Policy        |  |                                     |  |
|  |  describes how SafeTrekr    |  |  1. Introduction                    |  |
|  |  ("we", "us", "our")        |  |  2. Information We Collect          |  |
|  |  collects, uses, and        |  |  3. How We Use Information          |  |
|  |  shares information...      |  |  4. Information Sharing             |  |
|  |                             |  |  5. Data Retention                  |  |
|  |  ## 2. Information We       |  |  6. Your Rights                     |  |
|  |        Collect              |  |  7. Children's Privacy              |  |
|  |                             |  |  8. International Transfers         |  |
|  |  ### 2.1 Information You    |  |  9. Security                        |  |
|  |         Provide             |  |  10. Changes to This Policy         |  |
|  |                             |  |  11. Contact Us                     |  |
|  |  When you create an         |  |  [body-sm, muted-foreground,        |  |
|  |  account or request a       |  |   active = primary-700]             |  |
|  |  demo, you provide...       |  |                                     |  |
|  |                             |  |  +----------------------------------+  |
|  |  ### 2.2 Information We     |  |  | QUESTIONS?                       |  |
|  |         Collect             |  |  | [eyebrow]                        |  |
|  |         Automatically       |  |  |                                  |  |
|  |                             |  |  | Contact our legal team:          |  |
|  |  ...continues through       |  |  | legal@safetrekr.com              |  |
|  |  all sections...            |  |  | [primary-700, underline]         |  |
|  |                             |  |  +----------------------------------+  |
|  |  ## 11. Contact Us          |  |                                     |  |
|  |                             |  +-------------------------------------+  |
|  |  If you have questions      |                                          |
|  |  about this Privacy         |                                          |
|  |  Policy, contact us at:     |                                          |
|  |  legal@safetrekr.com        |                                          |
|  |                             |                                          |
|  +-----------------------------+                                           |
|                                                                            |
+----------------------------------------------------------------------------+
|  bg-card                                                                   |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  |  [Scale icon]                                                        |  |
|  |                                                                      |  |
|  |  Questions about this policy?                                        |  |
|  |  [heading-sm, foreground]                                            |  |
|  |                                                                      |  |
|  |  Contact our legal team at legal@safetrekr.com                       |  |
|  |  or write to us at [mailing address].                                |  |
|  |  [body-md, muted-foreground]                                         |  |
|  |                                                                      |  |
|  |  For data protection inquiries in the EU, contact our                |  |
|  |  Data Protection Officer at dpo@safetrekr.com.                       |  |
|  |  [body-sm, muted-foreground]                                         |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
| [SiteFooter -- global]                                                     |
+============================================================================+
```

### ASCII Page Map (Mobile, < 1024px)

```
+============================================+
| [SiteHeader -- mobile]                     |
+============================================+
|                                            |
|  < Back to Legal                           |
|  [breadcrumb collapsed]                    |
|                                            |
|  Privacy Policy                            |
|  [display-md, fluid]                       |
|                                            |
|  +--------------------------------------+  |
|  | Last updated: March 15, 2026         |  |
|  | Version: 1.2                         |  |
|  +--------------------------------------+  |
|                                            |
|  TABLE OF CONTENTS                         |
|  [collapsible accordion]                   |
|  v  11 sections                            |
|                                            |
+--------------------------------------------+
|                                            |
|  ## 1. Introduction                        |
|                                            |
|  Body text, full width,                    |
|  max-w-[65ch]...                           |
|                                            |
|  ...document continues...                  |
|                                            |
+--------------------------------------------+
|  [Legal Contact Card]                      |
+============================================+
| [SiteFooter]                               |
+============================================+
```

---

## Section-by-Section Specification

---

### Section 1: Legal Page Header

**Component**: Custom `LegalPageHeader` (template component)
**Background**: `background` (#e7ecee)
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section padding | `pt-8 sm:pt-12 md:pt-16 lg:pt-20 pb-6 sm:pb-8 lg:pb-10` | Compressed -- document should begin quickly |
| Breadcrumb | `<Breadcrumb>` component, `.text-body-sm text-muted-foreground mb-6 lg:mb-8` | `Home > Legal > [Policy Name]` |
| Breadcrumb mobile | `< Back to Legal` (back-link style) | Visible < 640px. Links to footer legal section since there is no `/legal` index page. |
| Headline | `.text-display-md text-foreground` | Policy name (e.g., "Privacy Policy") |
| Headline | Renders as `<h1>` | The only `<h1>` on the page |
| Headline margin | `mb-6` | |
| Metadata card | `bg-card rounded-lg border border-border p-4` | |
| Metadata layout | `flex flex-col gap-1 sm:flex-row sm:gap-6 sm:items-center flex-wrap` | Stacked mobile, inline desktop |
| Last updated | `.text-body-sm text-muted-foreground` | `<time datetime="2026-03-15">` -- "Last updated: March 15, 2026" |
| Version | `.text-body-sm text-muted-foreground` | "Version: 1.2" |
| Effective date | `.text-body-sm text-muted-foreground` | "Effective: March 15, 2026" |
| Separator (desktop) | `text-border` | Dot separator between inline items |

#### Animation

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Breadcrumb | `fadeUp` | Page load | 0ms |
| Headline | `fadeUp` | Page load | 80ms |
| Metadata card | `fadeUp` | Page load | 160ms |

#### Accessibility

- `<section aria-labelledby="legal-page-heading">`
- Headline is `<h1 id="legal-page-heading">`
- Metadata uses `<time>` element for dates
- Version number: plain text (no special semantic treatment needed)

---

### Section 2: Document Body + Table of Contents Sidebar

**Component**: Custom `LegalDocumentLayout` wrapping MDX content
**Background**: `background` (#e7ecee)
**Dark section**: No
**Container**: `max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12`

#### Layout

Two-column on desktop (>= lg). Single column with collapsible TOC on mobile/tablet.

```
Grid: grid lg:grid-cols-[1fr_260px] gap-12 lg:gap-16
```

#### Document Column Specifications

**Content max-width**: `max-w-[720px]` (45rem).

**Legal Document Typography**:

Legal pages use a subset of the blog MDX typography with adjustments for legal readability:

| Element | Token / Class | Specification |
|---------|---------------|---------------|
| `<h2>` | `.text-heading-lg text-foreground` | Section headings (numbered: "1. Introduction", "2. Information We Collect"). `mt-12 mb-4`. `scroll-mt-24`. `id` for anchor linking. |
| `<h3>` | `.text-heading-md text-foreground` | Subsection headings (numbered: "2.1 Information You Provide"). `mt-8 mb-3`. |
| `<h4>` | `.text-heading-sm text-foreground` | Sub-subsection. `mt-6 mb-2`. |
| `<p>` | `.text-body-md text-muted-foreground` | 16px, Inter, line-height 1.6. `mb-4`. `max-w-[65ch]`. |
| `<strong>` | `font-semibold text-foreground` | Key terms elevated to foreground. |
| `<a>` | `text-primary-700 underline underline-offset-2 hover:text-primary-800 transition-colors duration-fast` | Inline links. |
| `<ul>` | `list-disc list-outside pl-6 space-y-1.5 my-4` | Standard disc bullets for legal lists. NOT check icons (those are marketing). |
| `<ol>` | `list-decimal list-outside pl-6 space-y-1.5 my-4` | Numbered lists for procedural items. |
| `<li>` | `.text-body-md text-muted-foreground` | Standard body text weight. |
| `<table>` | `w-full my-6 border border-border rounded-lg overflow-hidden` | Data tables (e.g., cookie types, data categories). |
| `<thead>` | `bg-card` | |
| `<th>` | `.text-body-sm font-semibold text-foreground p-3 text-left border-b border-border` | |
| `<td>` | `.text-body-sm text-muted-foreground p-3 border-b border-border` | |
| `<blockquote>` | `border-l-4 border-border pl-6 py-1 my-6 text-body-md text-muted-foreground italic` | Legal callouts. Note: uses `border-border` (neutral), NOT `border-primary-500` -- legal quotes should not have brand accent. |
| `<hr>` | `border-t border-border my-8` | Section breaks within the document. |
| `<code>` (inline) | `bg-card text-foreground px-1.5 py-0.5 rounded-sm text-mono-sm font-mono` | Technical terms (e.g., "AES-256", "SHA-256"). |
| Email addresses | `text-primary-700 underline` | Auto-linked: `<a href="mailto:legal@safetrekr.com">` |

**Key difference from blog typography**: Legal pages use standard disc bullets (`list-disc`), not check-icon bullets. Legal pages use neutral `border-border` for blockquotes, not `border-primary-500`. The tone is deliberately formal and neutral.

#### Table of Contents Sidebar Specifications

**Component**: `LegalTableOfContents` (shares pattern with blog TOC but different styling nuances)

| Property | Value |
|----------|-------|
| Container | `w-[260px] lg:block hidden` (hidden < lg) |
| Position | `sticky top-28` (accounts for 64px header + 48px offset) |
| Max height | `max-h-[calc(100vh-8rem)] overflow-y-auto` |
| Background | `bg-card rounded-xl border border-border p-5` |
| Title | `.text-eyebrow text-primary-700 uppercase tracking-[0.08em] mb-4` -- "TABLE OF CONTENTS" |
| List | `<nav aria-label="Document table of contents">` wrapping `<ol>` (ordered, because legal sections are numbered) |
| Item (H2) | `.text-body-sm text-muted-foreground py-1.5 block hover:text-foreground transition-colors duration-fast` | Displays section number + title |
| Item (H3) | Same as H2 but `pl-4` indent, `.text-body-xs` |
| Active item | `text-primary-700 font-medium border-l-2 border-primary-500 pl-3` (H2) or `pl-7` (H3) |
| Active tracking | Intersection Observer on each H2/H3 `id` |
| Scroll behavior | `scroll-behavior: smooth`. Offset: `scroll-mt-24` on headings |
| Numbering | List items show section numbers: "1. Introduction", "2. Information We Collect", etc. |

**Sidebar Legal Contact Card** (below TOC):

```
+-------------------------------------+
|  QUESTIONS?                          |
|  [eyebrow, primary-700]             |
|                                      |
|  Contact our legal team:             |
|  [body-sm, muted-foreground]         |
|                                      |
|  legal@safetrekr.com                 |
|  [body-sm, primary-700, underline]   |
+-------------------------------------+
```

| Property | Value |
|----------|-------|
| Container | `bg-primary-50 rounded-xl p-5 mt-6` |
| Eyebrow | `.text-eyebrow text-primary-700 mb-2` | "QUESTIONS?" |
| Text | `.text-body-sm text-muted-foreground` |
| Email link | `.text-body-sm text-primary-700 underline underline-offset-2 mt-1 block` |

**Mobile TOC** (< lg):

Same collapsible accordion pattern as blog post TOC:

| Property | Value |
|----------|-------|
| Position | Below metadata card, above document body |
| Component | shadcn/ui `Collapsible` |
| Default state | Collapsed |
| Trigger text | "Table of Contents" |
| Trigger meta | "[n] sections" |
| Content | Ordered list of section links |

---

### Section 3: Legal Contact Info

**Component**: Custom `LegalContactCard`
**Background**: `card` (#f7f8f8) -- full-width band
**Dark section**: No
**Container**: `max-w-[720px] mx-auto px-6 sm:px-8` (matches document column width)

#### Specifications

| Element | Token / Class | Value |
|---------|---------------|-------|
| Section background | `bg-card` | Full-width band |
| Section padding | `py-10 sm:py-12 lg:py-16` | Compressed |
| Content wrapper | `max-w-[720px] mx-auto` | |
| Icon | `Scale` (Lucide), `h-8 w-8 text-primary-700 mb-4` | Legal/balance icon |
| Headline | `.text-heading-sm text-foreground mb-3` | "Questions about this policy?" |
| Body | `.text-body-md text-muted-foreground mb-2` | "Contact our legal team at legal@safetrekr.com or write to us at [mailing address]." |
| DPO line | `.text-body-sm text-muted-foreground mt-3` | "For data protection inquiries in the EU, contact our Data Protection Officer at dpo@safetrekr.com." |
| Email links | `text-primary-700 underline underline-offset-2` | `mailto:` links |

#### Accessibility

- `<section aria-labelledby="legal-contact-heading">`
- Headline is `<h2 id="legal-contact-heading">`
- Email addresses are proper `<a href="mailto:...">` links

---

## Legal Page Content Structure (Per-Page Reference)

Each legal page follows the same template with different content. The structure below defines the expected heading hierarchy for each page type.

### Privacy Policy (`/legal/privacy`)

1. Introduction
2. Information We Collect
   - 2.1 Information You Provide
   - 2.2 Information Collected Automatically
   - 2.3 Information from Third Parties
3. How We Use Your Information
4. Legal Basis for Processing (GDPR)
5. Information Sharing and Disclosure
6. Data Retention
7. Your Rights and Choices
   - 7.1 Access and Portability
   - 7.2 Correction and Deletion
   - 7.3 Opt-Out
8. Children's Privacy
9. International Data Transfers
10. Security Measures
11. Changes to This Policy
12. Contact Us

### Terms of Service (`/legal/terms`)

1. Acceptance of Terms
2. Description of Service
3. Account Registration
4. Acceptable Use
5. Intellectual Property
6. User Content
7. Payment Terms
8. Termination
9. Disclaimers
10. Limitation of Liability
11. Indemnification
12. Governing Law
13. Dispute Resolution
14. Changes to Terms
15. Contact

### Data Processing Agreement (`/legal/dpa`)

1. Definitions
2. Scope and Purpose
3. Data Processing Details
4. Obligations of the Data Controller
5. Obligations of the Data Processor
6. Sub-Processors
7. Data Subject Rights
8. Data Breach Notification
9. Data Transfers
10. Audit Rights
11. Term and Termination
12. Annexes
    - Annex A: Processing Details
    - Annex B: Technical and Organizational Measures

### Acceptable Use Policy (`/legal/acceptable-use`)

1. Purpose
2. Prohibited Uses
3. Content Standards
4. System Integrity
5. Reporting Violations
6. Enforcement
7. Contact

### Cookie Policy (`/legal/cookies`)

1. What Are Cookies
2. How We Use Cookies
3. Types of Cookies We Use (table: Name, Purpose, Duration, Type)
4. Third-Party Cookies
5. Managing Your Cookie Preferences
6. Changes to This Policy
7. Contact

---

## Responsive Behavior Summary

| Breakpoint | Layout Changes |
|------------|----------------|
| base (0-639px) | Single column. TOC collapsed in accordion. Metadata card stacked. Document body full-width with padding. Breadcrumb collapses. |
| sm (640px) | Metadata card items may flow inline. |
| md (768px) | Metadata card fully inline. |
| lg (1024px) | Two-column: document (720px) + sidebar (260px). TOC visible and sticky. Full breadcrumb. |
| xl (1280px) | Max content width. Generous side margins. |

---

## Animation

Legal pages use minimal animation. The content is functional and should be immediately accessible.

| Element | Preset | Trigger | Details |
|---------|--------|---------|---------|
| Header elements | `fadeUp` | Page load | Staggered: breadcrumb 0ms, headline 80ms, metadata 160ms |
| Document body | `fadeIn` | Page load | 200ms delay. Single fade, no stagger on body content. |
| Sidebar | `fadeIn` | Page load | 300ms delay |
| Contact card | `fadeUp` | 20% viewport | Single element, no stagger |

---

## Developer Notes

- **Content Source**: Legal documents stored as MDX files in `content/legal/`. Each file has frontmatter: `title`, `slug`, `lastUpdated`, `version`, `effectiveDate`, `description`.
- **MDX Components**: Use a legal-specific component map (`components/legal/mdx-components.tsx`) that overrides blog MDX styles -- specifically using `list-disc` instead of check-icon bullets and `border-border` instead of `border-primary-500` for blockquotes.
- **TOC Generation**: Auto-generate from MDX headings at build time. Include H2 and H3. Preserve section numbering.
- **Version History**: Consider adding a "Version History" expandable section at the bottom of each document for transparency. Not required at launch but recommended for Phase 2.
- **Print Styles**: Legal pages should include `@media print` styles that hide the sidebar, header, and footer, and render the document at full width with standard serif font for legal readability.
- **PDF Download**: Consider a "Download PDF" link in the sidebar for users who need to share legal documents with their legal team. Use `react-pdf` or server-side generation.
- **URL structure**: `/legal/[slug]` where slug matches the document identifier (privacy, terms, dpa, acceptable-use, cookies).
- **Cross-linking**: Legal pages should cross-reference each other where appropriate (e.g., Privacy Policy references DPA, Terms reference Acceptable Use). Use standard inline links.
- **No promotional CTAs**: Legal pages must not contain "Get a Demo", "Download Sample Binder", or any marketing CTAs. The only CTA is "Contact our legal team." This is a trust and transparency page, not a conversion page.

---
---

## Cross-Template Component Registry

The following new components are introduced by these four templates. All reuse existing design system atoms and molecules.

| Component | File | Used By | New? |
|-----------|------|---------|------|
| `BlogPostHero` | `components/blog/blog-post-hero.tsx` | Blog Post | Yes |
| `BlogPostLayout` | `components/blog/blog-post-layout.tsx` | Blog Post | Yes |
| `BlogTableOfContents` | `components/blog/blog-table-of-contents.tsx` | Blog Post | Yes |
| `AuthorBioCard` | `components/blog/author-bio-card.tsx` | Blog Post | Yes |
| `ShareButtons` | `components/blog/share-buttons.tsx` | Blog Post | Yes |
| `BlogMDXComponents` | `components/blog/mdx-components.tsx` | Blog Post | Yes |
| `Callout` | `components/blog/callout.tsx` | Blog Post | Yes |
| `FAQHero` | `components/faq/faq-hero.tsx` | FAQ Hub | Yes |
| `FAQCategoryTabs` | `components/faq/faq-category-tabs.tsx` | FAQ Hub | Yes |
| `FAQAccordionGroup` | `components/faq/faq-accordion-group.tsx` | FAQ Hub | Yes |
| `NotFoundPage` | `app/not-found.tsx` | 404 | Yes |
| `LegalPageHeader` | `components/legal/legal-page-header.tsx` | Legal | Yes |
| `LegalDocumentLayout` | `components/legal/legal-document-layout.tsx` | Legal | Yes |
| `LegalTableOfContents` | `components/legal/legal-table-of-contents.tsx` | Legal | Yes |
| `LegalContactCard` | `components/legal/legal-contact-card.tsx` | Legal | Yes |
| `LegalMDXComponents` | `components/legal/mdx-components.tsx` | Legal | Yes |
| `PostCard` | `components/blog/post-card.tsx` | Blog Post (related), Blog Index | Existing |
| `CTABand` | `components/marketing/cta-band.tsx` | Blog Post, FAQ Hub | Existing |
| `FAQSection` / `Accordion` | `components/marketing/faq-section.tsx` | FAQ Hub | Existing (extended) |
| `Badge` | `components/ui/badge.tsx` | Blog Post, FAQ Hub | Existing |
| `Breadcrumb` | `components/ui/breadcrumb.tsx` | Blog Post, FAQ Hub, Legal | Existing |
| `Logo` | `components/ui/logo.tsx` | 404 | Existing |
| `Divider` | `components/ui/divider.tsx` | Blog Post | Existing |

---

## Accessibility Compliance Summary (All Four Templates)

| Requirement | Blog Post | FAQ Hub | 404 | Legal |
|-------------|-----------|---------|-----|-------|
| Single `<h1>` | Post title | "Frequently Asked Questions" | "Page not found" | Policy name |
| Heading hierarchy | H1 > H2 (article) > H3 (subsections) | H1 > H2 (categories) | H1 only | H1 > H2 (sections) > H3 (subsections) |
| Skip navigation | Global (SiteHeader) | Global | Global | Global |
| ARIA landmarks | `<main>`, `<nav>` (TOC, breadcrumb), `<section>` with labels | `<main>`, `<nav>` (tabs), `<section>` per category | `<main>`, `<nav>` (links) | `<main>`, `<nav>` (TOC, breadcrumb), `<section>` |
| Focus indicators | 2px ring on all interactive elements | 2px ring, accordion triggers, tabs | 2px ring on search, links | 2px ring on TOC links, email links |
| Keyboard navigation | Tab through TOC, share buttons, links | Tab/arrow through tabs, accordion items | Tab through search, link list | Tab through TOC, document links |
| Color contrast | All text meets 4.5:1 minimum | All text meets 4.5:1 minimum | All text meets 4.5:1 minimum | All text meets 4.5:1 minimum |
| Touch targets | All interactive >= 44x44px | Tabs, accordion triggers >= 44px | Search input, links >= 44px | TOC items, links >= 44px |
| Reduced motion | All animations disabled | All animations disabled | All animations disabled | All animations disabled |
| Screen reader | TOC announces sections, share buttons labeled | Tab state announced, accordion state announced, search results announced | "Page not found" clearly communicated | TOC announces sections, dates use `<time>` |

---

## Performance Budget (All Four Templates)

| Metric | Target | Enforcement |
|--------|--------|-------------|
| LCP | < 2.5s | Lighthouse CI gate |
| CLS | < 0.1 | Lighthouse CI gate |
| FID | < 100ms | Lighthouse CI gate |
| Total page weight | < 300KB (excluding images) | Bundle analyzer |
| Blog post images | WebP/AVIF via Next.js `<Image>`, lazy-loaded below fold | Automated |
| Font loading | `display: swap`, < 100KB total web font weight | Enforced by design system |
| JavaScript | Blog TOC scroll spy and FAQ search are the only client-side JS requirements | Minimize hydration |
