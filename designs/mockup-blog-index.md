# Mockup Specification: Blog Index Page (`/blog`)

**Version**: 1.0
**Date**: 2026-03-24
**Status**: READY FOR IMPLEMENTATION
**Parent Specs**: `DESIGN-SYSTEM.md` (canonical), `INFORMATION-ARCHITECTURE.md` (Section 3.8)
**Page Type**: Blog Index (ISR, 1-hour revalidation)
**Hierarchy Level**: L1
**JSON-LD**: `CollectionPage`
**Breadcrumb**: None (L1 page)
**Title Tag**: `Trip Safety Insights -- SafeTrekr Blog`
**Meta Description**: `Research, guides, and analysis for organizations that take travel safety seriously. Expert perspectives on K-12 compliance, higher ed risk, mission trip planning, and group travel safety.`

---

## Table of Contents

1. [Page-Level Layout](#1-page-level-layout)
2. [Section 1: Blog Hero](#2-section-1-blog-hero)
3. [Section 2: Featured Post](#3-section-2-featured-post)
4. [Section 3: Category Filter Bar](#4-section-3-category-filter-bar)
5. [Section 4: Post Card Grid](#5-section-4-post-card-grid)
6. [Section 5: Pagination](#6-section-5-pagination)
7. [Section 6: Newsletter Signup](#7-section-6-newsletter-signup)
8. [Section 7: Sample Binder CTA](#8-section-7-sample-binder-cta)
9. [Component Specifications](#9-component-specifications)
10. [Responsive Behavior](#10-responsive-behavior)
11. [Animation & Motion](#11-animation--motion)
12. [Loading & Empty States](#12-loading--empty-states)
13. [Accessibility](#13-accessibility)
14. [SEO & Structured Data](#14-seo--structured-data)
15. [Developer Notes](#15-developer-notes)

---

## 1. Page-Level Layout

### 1.1 Section Rhythm

The blog index follows a single-register light theme. No dark sections. The page is content-forward and editorially clean. The visual rhythm prioritizes scanability over spectacle.

```
 1. Blog Hero          (bg-background, standard section padding)
 2. Featured Post      (bg-background, compressed section padding)
 3. Category Filters   (bg-background -> becomes bg-card/95 when sticky)
 4. Post Card Grid     (bg-background, standard section padding)
 5. Pagination         (bg-background, compressed padding, within grid section)
 6. Newsletter Signup  (bg-primary-50, standard section padding)
 7. Sample Binder CTA  (bg-card, compressed section padding)
 8. Footer             (bg-secondary, standard -- global component)
```

### 1.2 Container

All sections use the standard container pattern:

```
max-w-[var(--container-max)] mx-auto px-6 sm:px-8 lg:px-12
```

Content width: 1280px max. Side padding: 24px (mobile) / 32px (sm) / 48px (lg).

### 1.3 ASCII Page Map (Desktop, >= 1024px)

```
+============================================================================+
| [SiteHeader -- sticky, global]                                             |
+============================================================================+
|                                                                            |
|  TRIP SAFETY INSIGHTS                                                      |
|  [eyebrow]                                                                 |
|                                                                            |
|  Trip Safety Insights.                                                     |
|  [display-md headline, centered]                                           |
|                                                                            |
|  Research, guides, and analysis for organizations                          |
|  that take travel safety seriously.                                        |
|  [body-lg, centered, muted-foreground]                                     |
|                                                                            |
+----------------------------------------------------------------------------+
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  |  [FEATURED IMAGE -- 16:9 aspect, rounded-xl]                         |  |
|  |                                                                      |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|  |                                                                      |  |
|  |  [K-12 Compliance]        March 18, 2026  *  8 min read              |  |
|  |                                                                      |  |
|  |  FERPA Compliance Checklist for School Field Trips                    |  |
|  |  [heading-lg, foreground]                                            |  |
|  |                                                                      |  |
|  |  Everything your district needs to know about student data           |  |
|  |  protection during off-campus travel...                              |  |
|  |  [body-md, muted-foreground, 3 lines max]                            |  |
|  |                                                                      |  |
|  |  [Author Avatar] Sarah Chen, Safety Analyst   ->  Read Article       |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+----------------------------------------------------------------------------+
|  [All] [K-12 Compliance] [Higher Ed Safety] [Church & Mission]             |
|  [Corporate Travel] [Product Updates] [Safety Research]                    |
|  (category pill bar -- becomes sticky on scroll)                           |
+----------------------------------------------------------------------------+
|                                                                            |
|  +--------------------+  +--------------------+  +--------------------+    |
|  | [IMAGE 16:9]       |  | [IMAGE 16:9]       |  | [IMAGE 16:9]       |   |
|  |                    |  |                    |  |                    |    |
|  | [Category Badge]   |  | [Category Badge]   |  | [Category Badge]   |   |
|  | Post Title Here    |  | Post Title Here    |  | Post Title Here    |   |
|  | Excerpt text that  |  | Excerpt text that  |  | Excerpt text that  |   |
|  | spans two lines... |  | spans two lines... |  | spans two lines... |   |
|  |                    |  |                    |  |                    |    |
|  | [Av] Author * Date |  | [Av] Author * Date |  | [Av] Author * Date |   |
|  |         8 min read |  |         5 min read |  |         12 min ... |   |
|  +--------------------+  +--------------------+  +--------------------+    |
|                                                                            |
|  +--------------------+  +--------------------+  +--------------------+    |
|  | [IMAGE 16:9]       |  | [IMAGE 16:9]       |  | [IMAGE 16:9]       |   |
|  | ...                |  | ...                |  | ...                |    |
|  +--------------------+  +--------------------+  +--------------------+    |
|                                                                            |
|  +--------------------+  +--------------------+  +--------------------+    |
|  | ...                |  | ...                |  | ...                |    |
|  +--------------------+  +--------------------+  +--------------------+    |
|                                                                            |
|  +--------------------+  +--------------------+  +--------------------+    |
|  | ...                |  | ...                |  | ...                |    |
|  +--------------------+  +--------------------+  +--------------------+    |
|                                                                            |
+----------------------------------------------------------------------------+
|                                                                            |
|    <  1  [2]  3  4  ...  8  >                                              |
|    (pagination, centered)                                                  |
|                                                                            |
+============================================================================+
|  bg-primary-50                                                             |
|                                                                            |
|  STAY INFORMED                                                             |
|  [eyebrow, primary-700]                                                    |
|                                                                            |
|  Get trip safety insights in your inbox.                                   |
|  [heading-lg, centered]                                                    |
|                                                                            |
|  We send 1-2 emails per month. Unsubscribe anytime.                        |
|  [body-sm, muted-foreground]                                               |
|                                                                            |
|  [ Email address          ] [ Subscribe ]                                  |
|  [input]                    [button primary]                               |
|                                                                            |
+============================================================================+
|  bg-card                                                                   |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | [Document icon]  See what a professional safety review looks like.   |  |
|  |                  Download a sample Safety Binder to see the 17-      |  |
|  |                  section review process.                             |  |
|  |                                           [ Download Sample Binder ] |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
| [SiteFooter -- global]                                                     |
+============================================================================+
```

---

## 2. Section 1: Blog Hero

### 2.1 Purpose

Establish page identity and context. Clean editorial header. No CTA in this section -- content drives engagement.

### 2.2 Layout

Centered text block within the standard container.

### 2.3 Content

| Element | Content | Class / Token |
|---------|---------|---------------|
| Eyebrow | `SAFETREKR BLOG` | `.text-eyebrow text-primary-700`, leading `BookOpen` icon (Lucide, `icon-xs`) |
| Headline | `Trip Safety Insights.` | `.text-display-md text-foreground`, centered, `max-w-[28ch] mx-auto` |
| Sub-headline | `Research, guides, and analysis for organizations that take travel safety seriously.` | `.text-body-lg text-muted-foreground`, centered, `max-w-prose mx-auto mt-4` |

### 2.4 Spacing

| Breakpoint | Top Padding | Bottom Padding |
|------------|-------------|----------------|
| base | `pt-12` (48px) | `pb-8` (32px) |
| sm | `pt-16` (64px) | `pb-10` (40px) |
| md | `pt-20` (80px) | `pb-12` (48px) |
| lg | `pt-24` (96px) | `pb-16` (64px) |

### 2.5 Background

`bg-background` (#e7ecee). No additional treatment. Clean editorial register.

### 2.6 Semantic HTML

```html
<section aria-labelledby="blog-hero-heading">
  <div class="container">
    <span class="text-eyebrow text-primary-700"><!-- icon --> SAFETREKR BLOG</span>
    <h1 id="blog-hero-heading" class="text-display-md text-foreground">
      Trip Safety Insights.
    </h1>
    <p class="text-body-lg text-muted-foreground">
      Research, guides, and analysis...
    </p>
  </div>
</section>
```

---

## 3. Section 2: Featured Post

### 3.1 Purpose

Surface the latest or editorially-pinned post with maximum visual weight. This is the primary content hook above the grid.

### 3.2 Layout

Full-width card within the standard container. Two layout variants by breakpoint:

**Desktop (>= lg)**: Horizontal layout. Featured image on the left (55% width), text content on the right (45% width). The image and text sit side-by-side inside a single card surface.

**Tablet and Mobile (< lg)**: Vertical stack. Image on top, text content below. Full-width card.

### 3.3 ASCII Wireframe (Desktop)

```
+============================================================================+
|                                                                            |
|  +-----------------------------------+------------------------------------+|
|  |                                   |                                    ||
|  |                                   |  [K-12 Compliance]  * 8 min read  ||
|  |                                   |                                    ||
|  |       FEATURED IMAGE              |  FERPA Compliance Checklist        ||
|  |       16:9 aspect ratio           |  for School Field Trips            ||
|  |       object-fit: cover           |  [heading-lg]                      ||
|  |       rounded-l-xl                |                                    ||
|  |                                   |  Everything your district needs    ||
|  |                                   |  to know about student data        ||
|  |                                   |  protection during off-campus      ||
|  |                                   |  travel activities...              ||
|  |                                   |  [body-md, muted-foreground]       ||
|  |                                   |                                    ||
|  |                                   |  [32px avatar] Sarah Chen          ||
|  |                                   |  Safety Analyst * Mar 18, 2026     ||
|  |                                   |                                    ||
|  |                                   |  Read Article ->                   ||
|  |                                   |  [link, primary-700]               ||
|  +-----------------------------------+------------------------------------+|
|                                                                            |
+============================================================================+
```

### 3.4 Featured Post Card Specification

**File**: `components/blog/featured-post-card.tsx`

**Outer container**:
- `bg-card rounded-xl border border-border shadow-card overflow-hidden`
- Hover: `shadow-card-hover`, entire card is a link (`group` pattern)
- Transition: `duration-normal ease-default`

**Image region** (desktop left / mobile top):
- `aspect-video` (16:9) with `object-fit: cover`
- Desktop: `rounded-l-xl`, 55% width via `lg:w-[55%]`
- Mobile: `rounded-t-xl`, full width, max-height `240px` (sm: `280px`, md: `320px`)
- `<img>` with `loading="eager"` (above fold), `alt` from post title, `sizes` attribute for responsive images
- Next.js `<Image>` component with `priority` prop

**Content region** (desktop right / mobile bottom):
- `p-6 sm:p-8 lg:p-10`
- Desktop: 45% width, `flex flex-col justify-center`

**Content slots** (top to bottom):

| # | Element | Spec |
|---|---------|------|
| 1 | **Meta row** | `flex items-center gap-3 mb-4`. Category badge (see Badge spec) + reading time (`text-body-sm text-muted-foreground`, `Clock` icon `icon-xs`). |
| 2 | **Title** | `.text-heading-lg text-foreground`. Renders as `<h2>`. Max 2 lines (`line-clamp-2`). Group hover: `text-primary-700`, transition `duration-fast`. |
| 3 | **Excerpt** | `.text-body-md text-muted-foreground mt-3`. Max 3 lines (`line-clamp-3`). `max-w-[45ch]`. |
| 4 | **Author row** | `flex items-center gap-3 mt-6`. Avatar (32px circle, `rounded-full`, `object-fit: cover`), author name (`.text-body-sm font-medium text-foreground`), separator dot (`text-border`), date (`.text-body-sm text-muted-foreground`, formatted as `MMM DD, YYYY`). |
| 5 | **Read link** | `mt-4`. `.text-body-sm font-medium text-primary-700`. `ArrowRight` icon (`icon-sm`) appended, `translateX(4px)` on group hover. Text: "Read Article". |

**Props**:
```typescript
interface FeaturedPostCardProps {
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: {
    src: string;
    alt: string;
    width: number;
    height: number;
    blurDataURL?: string;
  };
  category: BlogCategory;
  author: {
    name: string;
    avatar: string;
  };
  publishDate: string;    // ISO 8601
  readingTime: number;    // minutes
  className?: string;
}
```

### 3.5 Section Spacing

| Breakpoint | Top | Bottom |
|------------|-----|--------|
| base | `pt-0` | `pb-8` (32px) |
| sm | `pt-0` | `pb-10` (40px) |
| md | `pt-0` | `pb-12` (48px) |
| lg | `pt-0` | `pb-16` (64px) |

Top padding is 0 because it flows directly from the hero. The gap between hero bottom padding and featured post creates sufficient breathing room.

---

## 4. Section 3: Category Filter Bar

### 4.1 Purpose

Enable content filtering by topic. Acts as both navigation (links to `/blog/category/[slug]`) and visual indicator of available content clusters. Each pill is a real link for SEO crawlability.

### 4.2 Layout

Horizontal scrollable row of pill-shaped filter buttons. Centered within container at rest. Becomes sticky below the site header on scroll.

### 4.3 Categories

| Label | Slug | URL |
|-------|------|-----|
| All | (none -- `/blog`) | `/blog` |
| K-12 Compliance | `k12-compliance` | `/blog/category/k12-compliance` |
| Higher Ed Safety | `higher-ed-safety` | `/blog/category/higher-ed-safety` |
| Church & Mission | `church-missions` | `/blog/category/church-missions` |
| Corporate Travel | `corporate-travel` | `/blog/category/corporate-travel` |
| Product Updates | `product-updates` | `/blog/category/product-updates` |
| Safety Research | `safety-research` | `/blog/category/safety-research` |

### 4.4 Category Pill Specification

**File**: `components/blog/category-filter-bar.tsx`

**Bar container**:
- At rest: `py-4 border-b border-border bg-background`
- Sticky state: `sticky top-[64px] z-[var(--z-sticky)] bg-background/95 backdrop-blur-sm shadow-sm border-b border-border/50`
  - `top-[64px]` corresponds to the scrolled header height (64px)
  - Mobile: `top-[56px]` (mobile header height is 56px)
- Transition between rest and sticky: `duration-moderate ease-default`
- Inner: `flex items-center gap-2 overflow-x-auto scrollbar-hide`
  - `scrollbar-hide`: WebKit `::-webkit-scrollbar { display: none }` and `scrollbar-width: none`
  - On mobile, horizontal scroll with momentum scrolling (`-webkit-overflow-scrolling: touch`)
  - Fade indicators on scroll edges (CSS gradient masks on left/right, 24px wide, `bg-background` to transparent)

**Individual pill** (each is an `<a>` tag):

| State | Background | Text | Border | Other |
|-------|-----------|------|--------|-------|
| Default | `transparent` | `foreground/70` | `border` (1px) | `rounded-full px-4 py-2 text-body-sm font-medium whitespace-nowrap` |
| Hover | `card` | `foreground` | `border` | Transition `duration-fast` |
| Active (current category) | `primary-50` | `primary-800` | `primary-200` | `font-semibold` |
| Focus-visible | Per default | Per default | `ring` (2px) | Focus ring token |

**Accessibility**:
- Container: `<nav aria-label="Blog categories">`
- Active pill: `aria-current="page"`
- All pills meet 44px minimum touch target via padding

### 4.5 Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| base (< 640px) | Horizontal scroll. Left-aligned. Fade edges visible when scrollable. Padding `px-6` matches container. |
| sm-md | Horizontal scroll if needed. Centered when all pills fit. |
| lg+ | All pills visible in single row, centered with `justify-center`. No scroll needed. `gap-3`. |

### 4.6 Sticky Behavior Details

The filter bar becomes sticky when it reaches the bottom edge of the site header. Detection is handled via Intersection Observer on a sentinel `<div>` placed immediately above the filter bar. When the sentinel leaves the viewport, the bar receives the sticky class.

The sticky bar must sit directly below the site header without any visual gap. The combined `z-index` must be below the site header (`z-sticky`) to prevent overlap conflicts -- use `z-[29]` (one below `--z-sticky: 30`).

Wait -- correction: the filter bar should also use `z-sticky` (30) but the site header uses the same value. To layer correctly:

- Site header: `z-[var(--z-sticky)]` (30)
- Category bar: `z-[calc(var(--z-sticky) - 1)]` (29)

This ensures the header's dropdown menus render above the sticky filter bar.

---

## 5. Section 4: Post Card Grid

### 5.1 Purpose

Primary content browsing interface. Cards are the main interaction surface for the page.

### 5.2 Grid Layout

```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8
```

| Breakpoint | Columns | Gap |
|------------|---------|-----|
| base | 1 | 24px (`gap-6`) |
| md | 2 | 24px (`gap-6`) |
| lg | 3 | 32px (`gap-8`) |

### 5.3 Posts Per Page

12 posts per page. At 3 columns, this produces 4 clean rows on desktop. At 2 columns, 6 rows on tablet. At 1 column, 12 rows on mobile.

The featured post (Section 2) is NOT counted within the 12-post grid. It is editorially separate.

### 5.4 Sort Order

Default: newest first (by `publishDate` descending). When a category is active, posts are filtered then sorted by date.

### 5.5 Section Spacing

| Breakpoint | Top | Bottom |
|------------|-----|--------|
| base | `pt-8` (32px) | `pb-12` (48px) |
| sm | `pt-10` (40px) | `pb-16` (64px) |
| md | `pt-12` (48px) | `pb-20` (80px) |
| lg | `pt-16` (64px) | `pb-24` (96px) |

### 5.6 BlogPostCard Component (Full Spec)

**File**: `components/blog/blog-post-card.tsx`

This is the primary repeating unit of the blog index. Each card is a complete clickable link to the post.

#### ASCII Wireframe (Single Card)

```
+----------------------------------+
|                                  |
|       FEATURED IMAGE             |
|       16:9 aspect ratio          |
|       object-fit: cover          |
|       rounded-t-xl               |
|                                  |
+----------------------------------+
|  p-5 sm:p-6                      |
|                                  |
|  [K-12 Compliance]               |
|  (category badge)                |
|                                  |
|  Post Title That May Span        |
|  Across Two Lines Maximum        |
|  [heading-sm, foreground]        |
|                                  |
|  Excerpt text that summarizes    |
|  the post content in two lines   |
|  with ellipsis truncation...     |
|  [body-sm, muted-foreground]     |
|                                  |
|  ----- (divider, border/30) ---- |
|                                  |
|  [24px avatar] Author Name       |
|  Mar 18, 2026  *  8 min read     |
|  [body-xs, muted-foreground]     |
|                                  |
+----------------------------------+
```

#### Card Structure

**Outer wrapper**: `<article>` containing a single `<a>` with `group` class.

```
bg-card rounded-xl border border-border shadow-card overflow-hidden
transition-all duration-normal ease-default
hover:shadow-card-hover hover:-translate-y-0.5
```

Note: card hover lift is `translateY(-2px)` per design system (`hover:-translate-y-0.5` in Tailwind).

#### Image Region

| Property | Value |
|----------|-------|
| Aspect ratio | `aspect-video` (16:9) |
| Object fit | `object-cover` |
| Border radius | Image inherits parent `overflow-hidden`, so `rounded-t-xl` effectively |
| Loading | `loading="lazy"` (below fold) |
| Sizes | `(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw` |
| Placeholder | Blur placeholder via Next.js `blurDataURL` or `bg-muted animate-pulse` |

When no featured image exists: render a fallback gradient card using the category color mapping:

| Category | Gradient |
|----------|----------|
| K-12 Compliance | `from-primary-50 to-primary-100` with `ShieldPath` icon at 8% opacity |
| Higher Ed Safety | `from-primary-50 to-accent` with `ShieldPath` icon at 8% opacity |
| Church & Mission | `from-primary-50 to-primary-100` with `ShieldPath` icon at 8% opacity |
| Corporate Travel | `from-card to-primary-50` with `ShieldPath` icon at 8% opacity |
| Product Updates | `from-accent to-primary-100` with `ShieldPath` icon at 8% opacity |
| Safety Research | `from-card to-accent` with `ShieldPath` icon at 8% opacity |

Fallback images use the SafeTrekr shield mark at 8% opacity, centered, 64px height. This maintains brand consistency without requiring photography for every post.

#### Content Region

Padding: `p-5 sm:p-6`. Flex column layout with `flex flex-col gap-3`.

| # | Slot | Spec |
|---|------|------|
| 1 | **Category badge** | `<Badge variant="default" size="sm">`. Background `primary-50`, text `primary-800`. `rounded-full`. |
| 2 | **Title** | `<h3>` with `.text-heading-sm text-foreground`. Max 2 lines: `line-clamp-2`. Group hover: `text-primary-700`, transition `duration-fast`. |
| 3 | **Excerpt** | `.text-body-sm text-muted-foreground`. Max 2 lines: `line-clamp-2`. `max-w-[45ch]`. |
| 4 | **Divider** | `border-t border-border/30 mt-auto pt-4`. Pushes footer to bottom via `mt-auto`. |
| 5 | **Footer row** | `flex items-center gap-3`. |
| 5a | -- Avatar | `w-6 h-6 rounded-full object-cover`. 24px circle. |
| 5b | -- Author name | `.text-body-xs font-medium text-foreground`. |
| 5c | -- Separator | `w-1 h-1 rounded-full bg-border` (dot separator). |
| 5d | -- Date | `.text-body-xs text-muted-foreground`. Format: `MMM DD, YYYY`. |
| 5e | -- Reading time | `.text-body-xs text-muted-foreground`. Right-aligned via `ml-auto`. Format: `N min read`. `Clock` icon (`icon-xs`, `mr-1`). |

#### Card Dimensions

| Breakpoint | Min Height | Image Height | Content Height |
|------------|-----------|-------------|---------------|
| base | Auto (natural flow) | ~180px (from 16:9 on full width) | ~200px |
| md | Auto | ~160px | ~200px |
| lg | Auto | ~150px | ~200px |

Cards in the grid should have equal heights per row. Achieve via `grid` auto-rows or by ensuring the content region uses `flex flex-col` with the divider having `mt-auto`.

#### Props

```typescript
interface BlogPostCardProps {
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    blurDataURL?: string;
  };
  category: BlogCategory;
  author: {
    name: string;
    avatar: string;
  };
  publishDate: string;    // ISO 8601
  readingTime: number;    // minutes
  className?: string;
}

interface BlogCategory {
  name: string;
  slug: string;
}
```

---

## 6. Section 5: Pagination

### 6.1 Purpose

Navigate between pages of blog posts. SEO-friendly with `rel="prev"` and `rel="next"` link elements in `<head>`.

### 6.2 Layout

Centered row below the post grid, within the same container.

### 6.3 ASCII Wireframe

```
                    <  1  2  [3]  4  5  ...  12  >
```

When on page 1:
```
                       [1]  2  3  4  5  ...  12  >
```

When on page 12:
```
                    <  1  ...  8  9  10  11  [12]
```

### 6.4 Component Specification

**File**: `components/blog/blog-pagination.tsx`

**Container**: `flex items-center justify-center gap-1 mt-12 lg:mt-16`

**Elements**:

| Element | Spec |
|---------|------|
| **Previous arrow** | `<a>` to previous page. `w-10 h-10 rounded-md flex items-center justify-center`. `ChevronLeft` icon (`icon-sm`). Disabled (page 1): `text-muted-foreground/40 pointer-events-none`. Active: `text-foreground hover:bg-card`. |
| **Page number** | `<a>` to `/blog?page=[n]`. `w-10 h-10 rounded-md flex items-center justify-center text-body-sm`. Default: `text-foreground hover:bg-card`. Current: `bg-primary-600 text-white font-semibold`. |
| **Ellipsis** | `<span>` with `...`. `w-10 h-10 flex items-center justify-center text-muted-foreground`. Not interactive. |
| **Next arrow** | Same as previous, with `ChevronRight`. Disabled on last page. |

**Pagination logic** (page number display):
- Always show first page and last page.
- Show 2 pages on either side of current page.
- Use ellipsis (`...`) for gaps.
- Example for page 5 of 12: `< 1 ... 3 4 [5] 6 7 ... 12 >`

**URL pattern**: `/blog?page=[n]` for page > 1. Page 1 is canonical `/blog` (no query param).

**Accessibility**:
- Wrap in `<nav aria-label="Blog pagination">`
- Current page: `aria-current="page"`
- Previous: `aria-label="Previous page"`
- Next: `aria-label="Next page"`
- Each page number: `aria-label="Page [n]"`

### 6.5 Props

```typescript
interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;       // "/blog" or "/blog/category/[slug]"
  className?: string;
}
```

### 6.6 Spacing

Pagination sits at the bottom of the post grid section. Separated by `mt-12 lg:mt-16` from the last row of cards. The section's bottom padding applies below.

---

## 7. Section 6: Newsletter Signup

### 7.1 Purpose

Capture email subscribers. Secondary conversion action after post engagement. Must feel low-commitment and trustworthy.

### 7.2 Layout

Centered text block with inline form. Full-width section with distinct background to break the visual rhythm.

### 7.3 Background

`bg-primary-50` (#f1f9f4). This is the lightest brand wash, creating a gentle contrast from the `bg-background` grid section above without being heavy.

### 7.4 ASCII Wireframe

```
+============================================================================+
|  bg-primary-50                                                             |
|                                                                            |
|                        STAY INFORMED                                       |
|                        [eyebrow, primary-700]                              |
|                                                                            |
|             Get trip safety insights in your inbox.                         |
|             [heading-lg, foreground, centered]                              |
|                                                                            |
|        We send 1-2 emails per month. Unsubscribe anytime.                  |
|        [body-sm, muted-foreground, centered]                               |
|                                                                            |
|          +--------------------------------------+-----------+              |
|          | Enter your work email                | Subscribe |              |
|          +--------------------------------------+-----------+              |
|                                                                            |
|        By subscribing, you agree to our Privacy Policy.                    |
|        [body-xs, muted-foreground, link to /legal/privacy]                 |
|                                                                            |
+============================================================================+
```

### 7.5 Content

| Element | Content | Spec |
|---------|---------|------|
| Eyebrow | `STAY INFORMED` | `.text-eyebrow text-primary-700`, `Mail` icon (Lucide, `icon-xs`) |
| Headline | `Get trip safety insights in your inbox.` | `.text-heading-lg text-foreground`, centered, `max-w-[28ch] mx-auto` |
| Description | `We send 1-2 emails per month. Unsubscribe anytime.` | `.text-body-sm text-muted-foreground`, centered, `mt-3` |
| Privacy link | `By subscribing, you agree to our Privacy Policy.` | `.text-body-xs text-muted-foreground`, centered. "Privacy Policy" is `text-primary-700 hover:underline`, links to `/legal/privacy`. |

### 7.6 Form Specification

**Outer form**: `flex flex-col sm:flex-row items-center gap-3 mt-8 max-w-md mx-auto`

| Field | Type | Spec |
|-------|------|------|
| Email input | `<input type="email">` | `flex-1 w-full h-11 px-4 bg-card border border-border rounded-md text-body-md text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-fast`. Placeholder: `Enter your work email`. |
| Submit button | `<button type="submit">` | `Button variant="primary" size="default"`. Text: `Subscribe`. Mobile: full width (`w-full sm:w-auto`). |
| Honeypot | `<input type="text" name="website" tabindex="-1" aria-hidden="true" class="sr-only">` | Hidden spam trap. Must be empty on submit. |

**Success state**: Replace form with confirmation:
- `Check` icon in `primary-500`, 32px, within a `primary-100` circle (48px)
- Heading: `You're subscribed.` (`.text-heading-sm text-foreground`)
- Body: `Check your inbox for a confirmation email.` (`.text-body-sm text-muted-foreground`)
- Transition: `fadeUp` animation (300ms)

**Error state**: Inline error below input:
- `.text-body-xs text-destructive mt-1`
- Input border: `border-destructive`
- Example: `Please enter a valid email address.`

**Loading state**: Button shows spinner icon, `aria-busy="true"`, disabled.

### 7.7 Section Spacing

| Breakpoint | Top | Bottom |
|------------|-----|--------|
| base | `py-12` (48px) | (symmetric) |
| sm | `py-16` (64px) | |
| md | `py-20` (80px) | |
| lg | `py-24` (96px) | |

### 7.8 Accessibility

- `<form aria-label="Newsletter signup">`
- Input: `<label>` visually hidden (`sr-only`) with text "Email address"
- `aria-describedby` linking to the description paragraph and error message
- `aria-live="polite"` on the success/error announcement region
- Double opt-in is handled server-side (not visible in UI spec)

---

## 8. Section 7: Sample Binder CTA

### 8.1 Purpose

Discovery-stage CTA per the content funnel. Surfaces the sample binder download as a secondary conversion for blog visitors who are not yet ready for a demo.

### 8.2 Layout

Compact horizontal card within the standard container. This is the "discovery" variant of the CTABanner.

### 8.3 Background

Section: `bg-card` (#f7f8f8). Inner card: `bg-white rounded-xl border border-border shadow-card`.

Wait -- correction: the outer section should be `bg-background` and the inner card is `bg-card`. Let me reconsider the design system: `card` is `#f7f8f8` and `background` is `#e7ecee`. The section above (newsletter) is `bg-primary-50`, so transitioning to `bg-background` here provides visual separation.

### 8.4 Revised Layout

Section: `bg-background`. Inner: a contained card with `bg-card rounded-xl border border-border shadow-card p-6 sm:p-8`.

### 8.5 ASCII Wireframe (Desktop)

```
+============================================================================+
|  bg-background                                                             |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  |  bg-card, rounded-xl, border, shadow-card                            |  |
|  |                                                                      |  |
|  |  [EvidenceBinder       See what a professional                       |  |
|  |   icon, 48px,          safety review looks like.         [ Download  |  |
|  |   primary-700]         Download a sample Safety Binder    Sample     |  |
|  |                        to see the 17-section review       Binder ]   |  |
|  |                        process in action.                            |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### 8.6 Content

| Element | Content | Spec |
|---------|---------|------|
| Icon | `EvidenceBinder` (custom) or `FileText` (Lucide) | 48px, `text-primary-700`. Displayed in a `h-16 w-16 rounded-xl bg-primary-50 flex items-center justify-center` container. |
| Headline | `See what a professional safety review looks like.` | `.text-heading-sm text-foreground` |
| Description | `Download a sample Safety Binder to see the 17-section review process in action.` | `.text-body-sm text-muted-foreground mt-2 max-w-[45ch]` |
| CTA button | `Download Sample Binder` | `Button variant="secondary" size="default"`. `Download` icon (Lucide, `icon-sm`). Links to `/resources/sample-binders`. |

**Desktop layout**: `flex items-center gap-8`. Icon left, text center (flex-1), button right.
**Mobile layout**: `flex flex-col items-start gap-4`. Stacked. Button full-width.

### 8.7 Personalization

When segment context exists in `localStorage` (set by prior segment page visit), personalize the CTA:

| Segment | CTA Text | Link |
|---------|----------|------|
| Generic | `Download Sample Binder` | `/resources/sample-binders` |
| K-12 | `Download K-12 Field Trip Binder` | `/resources/sample-binders/k12-field-trip` |
| Church | `Download Mission Trip Binder` | `/resources/sample-binders/mission-trip` |
| Higher Ed | `Download Study Abroad Binder` | `/resources/sample-binders/study-abroad` |
| Corporate | `Download Corporate Travel Binder` | `/resources/sample-binders/corporate-travel` |

### 8.8 Section Spacing

| Breakpoint | Top | Bottom |
|------------|-----|--------|
| base | `py-8` (32px) | |
| sm | `py-10` (40px) | |
| md | `py-12` (48px) | |
| lg | `py-16` (64px) | |

---

## 9. Component Specifications

### 9.1 BlogCategory Badge

Reuses the design system `Badge` component with `variant="default"`.

| Property | Value |
|----------|-------|
| Background | `primary-50` (#f1f9f4) |
| Text | `primary-800` (#2a5b3d) |
| Border | None |
| Radius | `radius-full` (9999px) |
| Size | `sm` (h-5, px-2, text-xs) on post cards; `default` (h-6, px-2.5, text-xs) on featured card |
| Font weight | 500 |

### 9.2 Author Avatar

Consistent across featured card and post cards.

| Context | Size | Spec |
|---------|------|------|
| Featured card | 32px | `w-8 h-8 rounded-full object-cover border border-border/50` |
| Post card | 24px | `w-6 h-6 rounded-full object-cover` |

Fallback when no avatar image: show initials in a `bg-primary-100 text-primary-800` circle using the same dimensions.

### 9.3 Reading Time Display

Consistent pattern across all blog components.

Format: `[Clock icon] N min read`

- Icon: `Clock` from Lucide, `icon-xs` (14px), `text-muted-foreground`
- Text: `.text-body-xs text-muted-foreground` (post card) or `.text-body-sm text-muted-foreground` (featured card)
- The icon and text are wrapped in `inline-flex items-center gap-1`

### 9.4 Date Formatting

All dates use `Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })`.

Output format: `Mar 18, 2026`.

Relative dates are NOT used. Absolute dates build trust and SEO clarity.

---

## 10. Responsive Behavior

### 10.1 Breakpoint Summary

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| base | 0-639px | Single column. Featured post stacked vertically. Filter pills scroll horizontally. Post cards full-width. Newsletter form stacked. CTA stacked. |
| sm | 640px | Minor padding increases. Newsletter form goes inline (side-by-side). |
| md | 768px | Post grid becomes 2 columns. Featured post image gets more height. |
| lg | 1024px | Post grid becomes 3 columns. Featured post becomes horizontal (side-by-side). Filter bar shows all pills without scroll. Full desktop spacing. |
| xl | 1280px | Content max-width reached (1280px). Growing side margins. |
| 2xl | 1536px | Generous white space (128px+ side margins). |

### 10.2 Featured Post Responsive Detail

| Breakpoint | Layout | Image |
|------------|--------|-------|
| base | Vertical stack | Full-width, `max-h-[240px]`, `rounded-t-xl` |
| sm | Vertical stack | Full-width, `max-h-[280px]`, `rounded-t-xl` |
| md | Vertical stack | Full-width, `max-h-[320px]`, `rounded-t-xl` |
| lg | Horizontal 55/45 | Left side, `h-full min-h-[360px]`, `rounded-l-xl` |

### 10.3 Category Filter Bar Responsive Detail

| Breakpoint | Behavior |
|------------|----------|
| base | Scrollable. Left-aligned. Edge fade masks. `px-6` gutter. |
| sm | Scrollable if needed. |
| md | May still scroll for 7 items. |
| lg | All items visible. `justify-center`. No scroll. `gap-3`. |

### 10.4 Post Grid Responsive Detail

| Breakpoint | Columns | Gap | Card Image Height |
|------------|---------|-----|-------------------|
| base | 1 | 24px | ~180px (natural 16:9) |
| md | 2 | 24px | ~160px |
| lg | 3 | 32px | ~150px |

### 10.5 Newsletter Form Responsive Detail

| Breakpoint | Layout |
|------------|--------|
| base | Stacked. Input full-width. Button full-width below. `flex-col gap-3`. |
| sm | Inline. Input flex-1. Button auto-width right. `flex-row gap-3`. |

### 10.6 Sample Binder CTA Responsive Detail

| Breakpoint | Layout |
|------------|--------|
| base | Stacked. Icon top-left. Text below. Button full-width at bottom. |
| sm | Stacked but button auto-width. |
| lg | Horizontal. Icon left, text center, button right. `flex-row items-center gap-8`. |

---

## 11. Animation & Motion

### 11.1 Page-Level Animation Sequence

All animations use Framer Motion presets from `lib/motion.ts`. They trigger at 20% viewport intersection via `whileInView`.

| Section | Animation | Preset | Stagger |
|---------|-----------|--------|---------|
| Blog hero | Eyebrow, headline, sub-headline stagger in | `fadeUp` | 80ms between elements |
| Featured post | Card fades up as single unit | `fadeUpLarge` | -- |
| Category bar | `fadeIn` (subtle, entire bar) | `fadeIn` | -- |
| Post grid | Cards stagger in per row | `staggerContainer` + `cardReveal` | 80ms between cards |
| Pagination | `fadeIn` | `fadeIn` | -- |
| Newsletter | Text staggers, then form fades in | `fadeUp` | 80ms text, 200ms delay to form |
| Sample binder CTA | Card `fadeUp` | `fadeUp` | -- |

### 11.2 Micro-Interactions

| Element | Trigger | Effect | Duration | Easing |
|---------|---------|--------|----------|--------|
| Post card | hover | `shadow-card` to `shadow-card-hover`, `translateY(-2px)` | 200ms | `ease-default` |
| Featured post card | hover | `shadow-card` to `shadow-card-hover` | 200ms | `ease-default` |
| Post card title | hover (parent) | `text-foreground` to `text-primary-700` | 150ms | `ease-default` |
| Featured "Read Article" arrow | hover (parent) | `translateX(4px)` | 150ms | `ease-spring` |
| Category pill | hover | Background fills `card` | 150ms | `ease-default` |
| Category pill (active) | -- | Static `bg-primary-50` | -- | -- |
| Newsletter subscribe button | hover | `primary-600` to `primary-700`, `scale(1.02)` | 150ms | `ease-default` |
| Sample binder CTA button | hover | Background fills `primary-50` | 150ms | `ease-default` |

### 11.3 Reduced Motion

Under `prefers-reduced-motion: reduce`:
- All `fadeUp`, `cardReveal`, `scaleIn` animations render at final state immediately
- Hover states retain color changes but remove `translateY`, `translateX`, `scale` transforms
- Card hover shows shadow change only (no lift)
- Newsletter success state appears without animation

---

## 12. Loading & Empty States

### 12.1 Post Card Skeleton

When the page is loading (ISR revalidation in progress or client-side navigation), display skeleton cards matching the BlogPostCard dimensions.

```
+----------------------------------+
|  bg-muted animate-pulse          |
|  aspect-video rounded-t-xl       |
|                                  |
+----------------------------------+
|  p-5                             |
|                                  |
|  [=====] (badge skeleton, w-20) |
|                                  |
|  [================]             |
|  [===========]   (title, 2 lines)|
|                                  |
|  [==================]           |
|  [==============]  (excerpt)     |
|                                  |
|  --- divider ---                 |
|                                  |
|  [O] [========] * [======]       |
|  (avatar, author, date)          |
|                                  |
+----------------------------------+
```

Skeleton element: `bg-muted animate-pulse rounded-md`. Heights match text line heights. Widths vary (60-90%) for visual naturalness.

Display 6 skeleton cards (2 rows of 3 on desktop) as the initial loading state.

### 12.2 Featured Post Skeleton

Same card shape as FeaturedPostCard. Image region: `bg-muted animate-pulse`. Text region: skeleton lines matching content slots.

### 12.3 Empty State (No Posts in Category)

When a category filter returns zero results:

```
+------------------------------------------+
|                                          |
|           [BookOpen icon, 48px,          |
|            muted-foreground/30]          |
|                                          |
|     No posts in this category yet.       |
|     [heading-sm, foreground]             |
|                                          |
|     We're working on new content for     |
|     this topic. Check back soon or       |
|     browse all posts.                    |
|     [body-sm, muted-foreground]          |
|                                          |
|         [ View All Posts ]               |
|         [Button, secondary]              |
|                                          |
+------------------------------------------+
```

Centered within the grid area. The button links to `/blog` (removes category filter).

### 12.4 Error State

If the blog data fetch fails:

```
+------------------------------------------+
|                                          |
|       [AlertCircle icon, 48px,           |
|        destructive/30]                   |
|                                          |
|     Unable to load blog posts.           |
|     [heading-sm, foreground]             |
|                                          |
|     Please try refreshing the page.      |
|     [body-sm, muted-foreground]          |
|                                          |
|         [ Refresh Page ]                 |
|         [Button, secondary]              |
|                                          |
+------------------------------------------+
```

---

## 13. Accessibility

### 13.1 Page-Level Requirements

| Requirement | Implementation |
|-------------|----------------|
| Page title | `Trip Safety Insights -- SafeTrekr Blog` via `<title>` and `metadata.title` |
| `<main>` landmark | Wraps all content below SiteHeader |
| Skip navigation | Global skip-nav targets `#main-content` on the `<main>` element |
| Heading hierarchy | `<h1>`: hero headline. `<h2>`: featured post title. `<h3>`: each post card title. No heading skips. |
| Landmark sections | Each major section uses `<section aria-labelledby="[id]">` or `<nav aria-label="[name]">` |

### 13.2 Component-Level Accessibility

| Component | Requirements |
|-----------|-------------|
| **Category filter bar** | `<nav aria-label="Blog categories">`. Active: `aria-current="page"`. All pills: 44px min touch target. |
| **Featured post card** | `<article>` wrapper. `<h2>` for title. Image: `alt` from post title or custom alt text. |
| **Blog post card** | `<article>` wrapper. `<h3>` for title. Image: `alt` from post title. Card link covers entire card. |
| **Pagination** | `<nav aria-label="Blog pagination">`. Current: `aria-current="page"`. Prev/Next: `aria-label`. Disabled: `aria-disabled="true"`. |
| **Newsletter form** | `<form aria-label="Newsletter signup">`. Input: `<label class="sr-only">`. Error: `aria-describedby`. Success: `aria-live="polite"`. Submit: `aria-busy` when loading. |
| **Reading time** | Rendered as `<span>` with `aria-label="8 minute read"` (full text, not abbreviated). |

### 13.3 Keyboard Navigation

Tab order follows visual reading order:

1. Skip-nav link (global)
2. SiteHeader navigation items
3. Blog hero (no interactive elements)
4. Featured post card (single tab stop -- entire card is one link)
5. Category filter pills (tab through each, left-to-right)
6. Post cards (tab through each, row by row, left-to-right)
7. Pagination controls
8. Newsletter email input
9. Newsletter subscribe button
10. Sample binder CTA button
11. SiteFooter links

All interactive elements show `focus-visible` ring: `ring-2 ring-ring ring-offset-2`.

### 13.4 Color Independence

- Category identity is conveyed by text label, not by color alone
- Reading time uses the `Clock` icon as a secondary indicator alongside the text
- Post card hover states use shadow change AND title color change (dual signal)
- Pagination current page uses background fill AND bold weight (dual signal)

### 13.5 Screen Reader Announcements

| Event | Announcement |
|-------|-------------|
| Category filter selected | Page navigates to new URL; screen reader reads new page title |
| Newsletter submitted | `aria-live="polite"` region announces "You're subscribed. Check your inbox for a confirmation email." |
| Newsletter error | `aria-live="polite"` region announces error message |
| Page load | Screen reader reads `<h1>` "Trip Safety Insights." |

---

## 14. SEO & Structured Data

### 14.1 Metadata

```typescript
export const metadata: Metadata = {
  title: 'Trip Safety Insights -- SafeTrekr Blog',
  description: 'Research, guides, and analysis for organizations that take travel safety seriously. Expert perspectives on K-12 compliance, higher ed risk, mission trip planning, and group travel safety.',
  alternates: {
    canonical: 'https://safetrekr.com/blog',
  },
  openGraph: {
    title: 'Trip Safety Insights -- SafeTrekr Blog',
    description: 'Research, guides, and analysis for organizations that take travel safety seriously.',
    url: 'https://safetrekr.com/blog',
    type: 'website',
    images: [
      {
        url: 'https://safetrekr.com/og/blog.png',
        width: 1200,
        height: 630,
        alt: 'SafeTrekr Blog -- Trip Safety Insights',
      },
    ],
  },
};
```

### 14.2 JSON-LD (CollectionPage)

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Trip Safety Insights",
  "description": "Research, guides, and analysis for organizations that take travel safety seriously.",
  "url": "https://safetrekr.com/blog",
  "publisher": {
    "@type": "Organization",
    "name": "SafeTrekr",
    "url": "https://safetrekr.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://safetrekr.com/logo.svg"
    }
  },
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "url": "https://safetrekr.com/blog/[slug]"
      }
    ]
  }
}
```

Each blog post in the grid renders its own `ListItem` with correct `position` and `url`.

### 14.3 Pagination SEO

- Page 1: canonical URL is `/blog` (no `?page=1`)
- Page 2+: canonical includes `?page=[n]`
- `<link rel="prev">` and `<link rel="next">` in document `<head>`
- Each category page: canonical is `/blog/category/[slug]`

### 14.4 Image Optimization

- Featured post image: `priority` loading (above fold), `sizes="(min-width: 1024px) 55vw, 100vw"`
- Post card images: `loading="lazy"`, `sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"`
- All images use Next.js `<Image>` with automatic WebP/AVIF generation
- Blur placeholders via `blurDataURL` for instant perceived loading

---

## 15. Developer Notes

### 15.1 File Structure

```
app/
  blog/
    page.tsx                           # Blog index (ISR)
    [slug]/page.tsx                    # Blog post detail
    category/[category]/page.tsx       # Category filtered index
    tag/[tag]/page.tsx                 # Tag filtered index

components/
  blog/
    featured-post-card.tsx             # Section 2 component
    blog-post-card.tsx                 # Grid card component
    category-filter-bar.tsx            # Sticky filter bar
    blog-pagination.tsx                # Pagination component
    blog-newsletter-signup.tsx         # Newsletter section
    blog-sample-binder-cta.tsx         # Sample binder CTA
    blog-post-card-skeleton.tsx        # Loading skeleton
    blog-empty-state.tsx               # Empty/error states
```

### 15.2 Data Fetching

- **ISR with 1-hour revalidation**: `export const revalidate = 3600`
- Blog posts fetched from MDX content directory or headless CMS
- Category and tag filtering happens server-side (not client-side filter)
- Featured post selection: first check for a post with `featured: true` in frontmatter, then fall back to most recent post
- Pagination is server-rendered (each page is a separate URL for SEO)

### 15.3 MDX Frontmatter Schema

```yaml
---
title: "FERPA Compliance Checklist for School Field Trips"
slug: "ferpa-compliance-school-field-trips"
excerpt: "Everything your district needs to know about student data protection during off-campus travel activities."
publishDate: "2026-03-18"
categories:
  - k12-compliance
tags:
  - ferpa
  - field-trips
  - compliance
author: sarah-chen
featuredImage: "/images/blog/ferpa-checklist.jpg"
featured: false
readingTime: 8
---
```

### 15.4 Performance Budget

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP | < 2.5s | Featured post image or hero headline |
| CLS | < 0.1 | Image aspect ratios prevent layout shift |
| FID | < 100ms | No heavy JS on initial load |
| Total page weight | < 500KB | ISR pre-renders HTML; images lazy-loaded |

### 15.5 Key Implementation Decisions

1. **Category filtering is server-side navigation** (not client-side), producing distinct URLs (`/blog/category/[slug]`) for SEO. Each category page reuses the same layout component with filtered data.

2. **The featured post is excluded from the paginated grid**. Grid pagination counts start after the featured post.

3. **Sticky filter bar** uses `position: sticky` with a `top` value equal to the site header height. No JavaScript scroll listeners needed for the sticky behavior itself. The background transition (transparent to blur) uses Intersection Observer on a sentinel element.

4. **Post cards use the `group` hover pattern**. The entire card is wrapped in `<a>`, with hover effects cascading via Tailwind's `group-hover:` modifier on child elements.

5. **Image fallbacks are brand-consistent**. When no featured image is provided, a gradient background with the SafeTrekr shield mark at low opacity maintains visual consistency without requiring stock photography.

6. **Newsletter signup uses a server action** for form submission, with Cloudflare Turnstile for bot protection (invisible challenge). Double opt-in is handled via the email service provider.

7. **The sample binder CTA reads segment context from `localStorage`** (set by prior segment page visits) to personalize the CTA copy and link. This is a client-side enhancement -- the default (generic) CTA renders on the server.

### 15.6 Component Dependencies

| Component | Uses |
|-----------|------|
| `FeaturedPostCard` | `Badge`, `Button` (link variant), Next.js `Image` |
| `BlogPostCard` | `Badge`, Next.js `Image` |
| `CategoryFilterBar` | `NavLink` (adapted for pills) |
| `BlogPagination` | `ChevronLeft`, `ChevronRight` (Lucide) |
| `BlogNewsletterSignup` | `Button`, `Eyebrow`, `Mail` icon, `Check` icon |
| `BlogSampleBinderCta` | `Button`, `EvidenceBinder` or `FileText` icon |

### 15.7 Dark Section Count

This page uses **zero dark sections** (excluding the global footer). The blog index maintains a fully light editorial register. The `bg-primary-50` newsletter section provides the only background variation beyond `bg-background`.

---

## Appendix A: Design Token Quick Reference (Blog Page)

Tokens actively used on this page, pulled from `DESIGN-SYSTEM.md`:

| Token | Value | Usage on This Page |
|-------|-------|--------------------|
| `--color-background` | `#e7ecee` | Page canvas, grid section, hero |
| `--color-foreground` | `#061a23` | Headlines, post titles, author names |
| `--color-card` | `#f7f8f8` | Post cards, featured card, CTA card |
| `--color-card-foreground` | `#061a23` | Text within cards |
| `--color-border` | `#b8c3c7` | Card borders, dividers, pill borders |
| `--color-muted-foreground` | `#4d5153` | Excerpts, dates, reading time, sub-headlines |
| `--color-primary-50` | `#f1f9f4` | Newsletter section bg, category badge bg, image fallback |
| `--color-primary-100` | `#e0f1e6` | Avatar fallback bg |
| `--color-primary-600` | `#3f885b` | Subscribe button bg, pagination active bg |
| `--color-primary-700` | `#33704b` | Eyebrows, link text, hover title text |
| `--color-primary-800` | `#2a5b3d` | Category badge text |
| `--shadow-card` | (see tokens) | Card resting state |
| `--shadow-card-hover` | (see tokens) | Card hover state |
| `--radius-xl` | `16px` | Cards, featured card |
| `--radius-full` | `9999px` | Badges, avatars, pills |
| `--radius-md` | `8px` | Buttons, inputs, pagination numbers |

---

## Appendix B: Category Filter Bar -- Scroll Fade Mask CSS

For mobile horizontal scrolling with edge fade indicators:

```css
.category-scroll-container {
  mask-image: linear-gradient(
    to right,
    transparent,
    black 24px,
    black calc(100% - 24px),
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    black 24px,
    black calc(100% - 24px),
    transparent
  );
}

/* Remove mask when at scroll start (no left fade needed) */
.category-scroll-container[data-scroll-start="true"] {
  mask-image: linear-gradient(
    to right,
    black,
    black calc(100% - 24px),
    transparent
  );
}

/* Remove mask when at scroll end (no right fade needed) */
.category-scroll-container[data-scroll-end="true"] {
  mask-image: linear-gradient(
    to right,
    transparent,
    black 24px,
    black
  );
}
```

The `data-scroll-start` and `data-scroll-end` attributes are toggled via a lightweight scroll listener on the container. This provides visual affordance that more pills exist in each direction.

---

## Appendix C: Post Card Grid -- Equal Height Strategy

To ensure all cards in a row have equal height:

```css
/* Grid auto-rows ensures equal row heights */
.blog-post-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .blog-post-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .blog-post-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

Each card uses `flex flex-col` internally. The divider before the author footer uses `mt-auto` to push it to the bottom, ensuring consistent card height regardless of title or excerpt length.

In Tailwind:
```html
<article class="bg-card rounded-xl border border-border shadow-card overflow-hidden flex flex-col">
  <div class="aspect-video"><!-- image --></div>
  <div class="p-5 sm:p-6 flex flex-col flex-1">
    <!-- badge -->
    <!-- title -->
    <!-- excerpt -->
    <div class="border-t border-border/30 mt-auto pt-4">
      <!-- author footer -->
    </div>
  </div>
</article>
```
