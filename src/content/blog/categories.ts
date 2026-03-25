/**
 * ST-914: Content Pillar Architecture -- Blog Category Definitions
 *
 * Defines the 6 blog content categories (pillars) for SafeTrekr.
 * Each category maps to a URL slug, display name, description, and
 * badge color for use in category filter pills and post cards.
 *
 * @see designs/html/mockup-blog-index.html -- Category filter bar
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single blog content category (pillar). */
export interface BlogCategory {
  /** URL-safe identifier (e.g., "k12-compliance"). */
  slug: string;
  /** Human-readable display name. */
  name: string;
  /** Short description for category landing pages and meta tags. */
  description: string;
  /**
   * Tailwind color classes for the category badge.
   * Uses the SafeTrekr design token system.
   */
  color: {
    /** Badge background class. */
    bg: string;
    /** Badge text class. */
    text: string;
    /** Optional border class for filter pills. */
    border: string;
  };
}

// ---------------------------------------------------------------------------
// Category Data
// ---------------------------------------------------------------------------

/**
 * The 6 SafeTrekr blog content pillars.
 *
 * Order matches the filter bar in the blog index mockup (left-to-right):
 * K-12 Compliance, Higher Ed Safety, Church & Mission, Corporate Travel,
 * Product Updates, Safety Research.
 */
export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: "k12-compliance",
    name: "K-12 Compliance",
    description:
      "FERPA, liability, and compliance guidance for school districts managing field trips and off-campus travel.",
    color: {
      bg: "bg-[var(--color-primary-50)]",
      text: "text-[var(--color-primary-800)]",
      border: "border-[var(--color-primary-200)]",
    },
  },
  {
    slug: "higher-ed-safety",
    name: "Higher Ed Safety",
    description:
      "Risk management frameworks for study abroad programs, athletic travel, and university-sponsored trips.",
    color: {
      bg: "bg-[var(--color-primary-50)]",
      text: "text-[var(--color-primary-800)]",
      border: "border-[var(--color-primary-200)]",
    },
  },
  {
    slug: "church-missions",
    name: "Church & Mission",
    description:
      "Safety planning for mission trips, youth retreats, and church-organized group travel.",
    color: {
      bg: "bg-[var(--color-primary-50)]",
      text: "text-[var(--color-primary-800)]",
      border: "border-[var(--color-primary-200)]",
    },
  },
  {
    slug: "corporate-travel",
    name: "Corporate Travel",
    description:
      "Duty of care best practices, travel risk policies, and corporate travel safety management.",
    color: {
      bg: "bg-[var(--color-primary-50)]",
      text: "text-[var(--color-primary-800)]",
      border: "border-[var(--color-primary-200)]",
    },
  },
  {
    slug: "product-updates",
    name: "Product Updates",
    description:
      "New features, platform improvements, and product announcements from the SafeTrekr team.",
    color: {
      bg: "bg-[var(--color-primary-50)]",
      text: "text-[var(--color-primary-800)]",
      border: "border-[var(--color-primary-200)]",
    },
  },
  {
    slug: "safety-research",
    name: "Safety Research",
    description:
      "Data-driven insights, industry trends, and original research on travel safety and risk management.",
    color: {
      bg: "bg-[var(--color-primary-50)]",
      text: "text-[var(--color-primary-800)]",
      border: "border-[var(--color-primary-200)]",
    },
  },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Look up a category by its slug.
 *
 * @param slug - The URL-safe category identifier.
 * @returns The matching category, or `undefined` if not found.
 */
export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}

/**
 * Look up a category by its display name (case-insensitive).
 *
 * Useful when matching frontmatter `category` fields that use
 * the human-readable name (e.g., "K-12 Compliance").
 *
 * @param name - The display name to match.
 * @returns The matching category, or `undefined` if not found.
 */
export function getCategoryByName(name: string): BlogCategory | undefined {
  const lower = name.toLowerCase();
  return BLOG_CATEGORIES.find((c) => c.name.toLowerCase() === lower);
}
