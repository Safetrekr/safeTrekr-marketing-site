/**
 * ST-912: MDX Blog Infrastructure -- Blog Data Access Layer
 *
 * Reads MDX files from `src/content/blog/`, parses frontmatter with
 * gray-matter, and returns typed BlogPost objects. All functions are
 * designed for use in Server Components and `generateStaticParams`.
 *
 * File convention:
 *   src/content/blog/<slug>.mdx
 *
 * Frontmatter schema:
 *   title, description, date, author, authorTitle, readingTime,
 *   category, tags
 *
 * @example
 * ```ts
 * import { getAllPosts, getPostBySlug } from "@/lib/blog";
 *
 * // Blog index
 * const posts = getAllPosts(); // sorted by date, newest first
 *
 * // Single post
 * const post = getPostBySlug("school-field-trip-liability-waivers");
 * ```
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Frontmatter fields parsed from each MDX blog post. */
export interface BlogPostFrontmatter {
  /** Post title (used in `<h1>` and meta tags). */
  title: string;
  /** Short description for cards and meta description. */
  description: string;
  /** ISO 8601 date string (e.g., "2026-03-20"). */
  date: string;
  /** Author display name. */
  author: string;
  /** Author job title / role. */
  authorTitle?: string;
  /** Estimated reading time (e.g., "12 min read"). */
  readingTime: string;
  /** Category display name -- must match a BLOG_CATEGORIES entry. */
  category: string;
  /** Keyword tags for filtering and SEO. */
  tags: string[];
}

/** A fully resolved blog post with slug and raw MDX content. */
export interface BlogPost extends BlogPostFrontmatter {
  /** URL-safe slug derived from the filename (without `.mdx`). */
  slug: string;
  /** Raw MDX content body (after frontmatter is stripped). */
  content: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Absolute path to the blog content directory. */
const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Reads and parses a single MDX file into a BlogPost.
 * Returns `null` if the file cannot be read or parsed.
 */
function parsePostFile(filename: string): BlogPost | null {
  const slug = filename.replace(/\.mdx$/, "");
  const filePath = path.join(BLOG_DIR, filename);

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    const frontmatter = data as BlogPostFrontmatter;

    // Validate required fields
    if (!frontmatter.title || !frontmatter.date || !frontmatter.category) {
      console.warn(
        `[blog] Skipping "${filename}": missing required frontmatter (title, date, or category).`,
      );
      return null;
    }

    return {
      slug,
      title: frontmatter.title,
      description: frontmatter.description ?? "",
      date: frontmatter.date,
      author: frontmatter.author ?? "SafeTrekr Team",
      authorTitle: frontmatter.authorTitle,
      readingTime: frontmatter.readingTime ?? "5 min read",
      category: frontmatter.category,
      tags: frontmatter.tags ?? [],
      content,
    };
  } catch (error) {
    console.error(`[blog] Failed to parse "${filename}":`, error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns all blog posts sorted by date (newest first).
 *
 * Reads every `.mdx` file in `src/content/blog/`, parses frontmatter,
 * and filters out any files that fail validation.
 *
 * This function is designed for use at build time (Server Components,
 * `generateStaticParams`). It performs synchronous file I/O and should
 * not be called from client components.
 */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) {
    console.warn(`[blog] Blog directory not found: ${BLOG_DIR}`);
    return [];
  }

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map(parsePostFile)
    .filter((post): post is BlogPost => post !== null);

  // Sort newest first
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

/**
 * Returns a single blog post by its slug, or `null` if not found.
 *
 * @param slug - The URL slug (filename without `.mdx` extension).
 */
export function getPostBySlug(slug: string): BlogPost | null {
  const filename = `${slug}.mdx`;
  const filePath = path.join(BLOG_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return parsePostFile(filename);
}

/**
 * Returns all unique category names found across published posts.
 * Useful for building category filter UIs.
 */
export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set(posts.map((p) => p.category));
  return Array.from(categories).sort();
}

/**
 * Returns all post slugs. Used by `generateStaticParams` to pre-render
 * all blog post pages at build time.
 */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

/**
 * Returns the author's initials from a full name.
 * Used for avatar placeholders in blog cards and post pages.
 *
 * @example
 * getAuthorInitials("Sarah Chen") // "SC"
 * getAuthorInitials("Dr. Angela Liu") // "AL"
 */
export function getAuthorInitials(name: string): string {
  const parts = name
    .replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|Prof\.)\s*/i, "")
    .trim()
    .split(/\s+/);

  if (parts.length === 0) return "??";
  if (parts.length === 1) return (parts[0]?.[0] ?? "?").toUpperCase();

  return (
    (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")
  ).toUpperCase();
}
