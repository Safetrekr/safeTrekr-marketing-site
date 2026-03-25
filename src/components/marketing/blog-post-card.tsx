/**
 * ST-912: Blog Post Card -- Blog Index Grid Item
 *
 * Renders a single blog post as a clickable card in the blog index grid.
 * Matches the post card pattern from the blog index mockup:
 * - 16:9 image placeholder with branded gradient
 * - Category badge
 * - Title (clamped to 2 lines) with hover color transition
 * - Description excerpt (clamped to 2 lines)
 * - Author avatar (initials), name, date, and reading time in footer
 *
 * The entire card is wrapped in a Link for full-surface clickability.
 *
 * @see designs/html/mockup-blog-index.html -- Post Card pattern
 */

import Link from "next/link";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { getAuthorInitials } from "@/lib/blog";
import { getCategoryByName } from "@/content/blog/categories";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BlogPostCardProps {
  /** URL slug for the post. */
  slug: string;
  /** Post title. */
  title: string;
  /** Short description / excerpt. */
  description: string;
  /** ISO 8601 date string. */
  date: string;
  /** Author display name. */
  author: string;
  /** Reading time display string (e.g., "12 min read"). */
  readingTime: string;
  /** Category display name. */
  category: string;
  /** Additional CSS classes for the outer wrapper. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Formats an ISO date string to a human-readable date. */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function BlogPostCard({
  slug,
  title,
  description,
  date,
  author,
  readingTime,
  category,
  className,
}: BlogPostCardProps) {
  const initials = getAuthorInitials(author);
  const categoryData = getCategoryByName(category);

  return (
    <article className={cn("group", className)}>
      <Link
        href={`/blog/${slug}`}
        className="block h-full no-underline"
        style={{ textDecoration: "none" }}
      >
        <div
          className={cn(
            "flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-border)]",
            "bg-[var(--color-card)] shadow-sm transition-all duration-200",
            "hover:-translate-y-0.5 hover:shadow-md",
          )}
        >
          {/* Image placeholder */}
          <div
            className="flex aspect-video items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100))",
            }}
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 32 32"
              fill="none"
              className="opacity-[0.08]"
              aria-hidden="true"
            >
              <path
                d="M16 2L4 8v8c0 7.73 5.12 14.96 12 16.73C22.88 30.96 28 23.73 28 16V8L16 2z"
                fill="#123646"
              />
              <path
                d="M16 6C12 10 10 14 12 18c2 4 6 6 8 4s2-6-2-10c-2-2-3-4-2-6z"
                fill="#3f885b"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
            {/* Category badge */}
            {categoryData && (
              <span
                className={cn(
                  "inline-flex self-start items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  categoryData.color.bg,
                  categoryData.color.text,
                )}
              >
                {categoryData.name}
              </span>
            )}

            {/* Title */}
            <h3
              className={cn(
                "text-heading-sm line-clamp-2 transition-colors duration-150",
                "text-[var(--color-foreground)] group-hover:text-[var(--color-primary-700)]",
              )}
            >
              {title}
            </h3>

            {/* Excerpt */}
            <p
              className="text-body-sm line-clamp-2 text-[var(--color-muted-foreground)]"
              style={{ maxWidth: "45ch" }}
            >
              {description}
            </p>

            {/* Footer */}
            <div
              className="mt-auto flex flex-wrap items-center gap-2 border-t pt-4"
              style={{ borderColor: "rgba(184, 195, 199, 0.3)" }}
            >
              {/* Author avatar */}
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold"
                style={{
                  background: "var(--color-primary-100)",
                  color: "var(--color-primary-800)",
                  borderColor: "rgba(184, 195, 199, 0.5)",
                }}
              >
                {initials}
              </div>

              {/* Author name */}
              <span className="text-[13px] font-medium text-[var(--color-foreground)]">
                {author}
              </span>

              {/* Dot separator */}
              <span
                className="h-1 w-1 shrink-0 rounded-full"
                style={{ background: "var(--color-border)" }}
                aria-hidden="true"
              />

              {/* Date */}
              <time
                dateTime={date}
                className="text-[13px] text-[var(--color-muted-foreground)]"
              >
                {formatDate(date)}
              </time>

              {/* Reading time */}
              <span className="ml-auto inline-flex items-center gap-1 text-[13px] text-[var(--color-muted-foreground)]">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {readingTime}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
BlogPostCard.displayName = "BlogPostCard";

export { BlogPostCard };
