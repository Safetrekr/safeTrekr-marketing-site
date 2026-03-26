/**
 * ST-912: Blog Index Page (/blog)
 *
 * Displays all blog posts with:
 * - Hero section with eyebrow, headline, and sub-headline
 * - Featured post card (first/newest post) in a horizontal layout
 * - Sticky category filter pills
 * - Post card grid (1 col mobile, 2 col tablet, 3 col desktop)
 *
 * Layout matches designs/html/mockup-blog-index.html.
 *
 * @see designs/html/mockup-blog-index.html
 * @see src/lib/blog.ts -- getAllPosts()
 * @see src/content/blog/categories.ts -- BLOG_CATEGORIES
 */

import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import { getAllPosts, getAuthorInitials } from "@/lib/blog";
import { BLOG_CATEGORIES, getCategoryByName } from "@/content/blog/categories";
import { Container } from "@/components/layout/container";
import { SectionContainer } from "@/components/layout/section-container";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogPostCard } from "@/components/marketing/blog-post-card";
import { CTABand } from "@/components/marketing/cta-band";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "SafeTrekr Blog",
  description:
    "Insights on travel planning, preparation best practices, and organizational duty of care. Expert perspectives for schools, churches, corporations, and sports organizations.",
  path: "/blog",
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* SECTION 1: Blog Hero                                             */}
      {/* ---------------------------------------------------------------- */}
      <SectionContainer
        as="section"
        className="pb-16 pt-24"
        ariaLabelledBy="blog-hero-heading"
      >
        <Container>
          <div className="mx-auto text-center">
            {/* Eyebrow */}
            <Eyebrow
              icon={<BookOpen className="h-4 w-4" />}
              className="mb-5 justify-center"
            >
              BLOG
            </Eyebrow>

            {/* Headline */}
            <h1
              id="blog-hero-heading"
              className="text-display-md mx-auto text-[var(--color-foreground)]"
              style={{ maxWidth: "28ch" }}
            >
              Insights on Trip Planning
            </h1>

            {/* Sub-headline */}
            <p
              className="text-body-lg mx-auto mt-4 text-[var(--color-muted-foreground)]"
              style={{ maxWidth: "65ch" }}
            >
              Expert perspectives on travel preparation, duty of care, and
              organizational planning. Practical guidance for schools, churches,
              corporations, and sports organizations.
            </p>
          </div>
        </Container>
      </SectionContainer>

      {/* ---------------------------------------------------------------- */}
      {/* SECTION 2: Featured Post                                         */}
      {/* ---------------------------------------------------------------- */}
      {featuredPost && (
        <SectionContainer
          as="section"
          className="pb-16 pt-0"
          ariaLabelledBy="featured-post-heading"
        >
          <Container>
            <article>
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group block"
                style={{ textDecoration: "none" }}
              >
                <div
                  className={cn(
                    "flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)]",
                    "bg-[var(--color-card)] shadow-sm transition-all duration-200 lg:flex-row",
                  )}
                >
                  {/* Image region */}
                  <div className="flex-shrink-0 lg:w-[55%]">
                    <div
                      className="flex h-full min-h-0 items-center justify-center overflow-hidden rounded-t-xl lg:min-h-[360px] lg:rounded-l-xl lg:rounded-tr-none"
                      style={{
                        aspectRatio: "16/9",
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
                  </div>

                  {/* Content region */}
                  <div className="flex flex-col justify-center p-6 sm:p-8 lg:w-[45%] lg:p-10">
                    {/* Meta row */}
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      {(() => {
                        const cat = getCategoryByName(featuredPost.category);
                        return cat ? (
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                              cat.color.bg,
                              cat.color.text,
                            )}
                          >
                            {cat.name}
                          </span>
                        ) : null;
                      })()}
                      <span className="inline-flex items-center gap-1 text-sm text-[var(--color-muted-foreground)]">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        {featuredPost.readingTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h2
                      id="featured-post-heading"
                      className={cn(
                        "text-heading-lg line-clamp-2 transition-colors duration-150",
                        "text-[var(--color-foreground)] group-hover:text-[var(--color-primary-700)]",
                      )}
                    >
                      {featuredPost.title}
                    </h2>

                    {/* Excerpt */}
                    <p
                      className="text-body-md mt-3 line-clamp-3 text-[var(--color-muted-foreground)]"
                      style={{ maxWidth: "45ch" }}
                    >
                      {featuredPost.description}
                    </p>

                    {/* Author row */}
                    <div className="mt-6 flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold"
                        style={{
                          background: "var(--color-primary-100)",
                          color: "var(--color-primary-800)",
                          borderColor: "rgba(184, 195, 199, 0.5)",
                        }}
                      >
                        {getAuthorInitials(featuredPost.author)}
                      </div>
                      <div>
                        <span className="text-body-sm font-medium text-[var(--color-foreground)]">
                          {featuredPost.author}
                        </span>
                        <span className="mx-1.5 text-[var(--color-border)]">
                          &middot;
                        </span>
                        <time
                          dateTime={featuredPost.date}
                          className="text-body-sm text-[var(--color-muted-foreground)]"
                        >
                          {formatDate(featuredPost.date)}
                        </time>
                      </div>
                    </div>

                    {/* Read link */}
                    <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary-700)]">
                      Read Article
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          </Container>
        </SectionContainer>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* SECTION 3: Category Filter Bar (Sticky)                          */}
      {/* ---------------------------------------------------------------- */}
      <div
        className="sticky top-[80px] z-[29] border-b backdrop-blur-[12px]"
        style={{
          background: "rgba(231, 236, 238, 0.95)",
          borderColor: "rgba(184, 195, 199, 0.5)",
          boxShadow:
            "0 1px 3px 0 rgba(6,26,35,0.06), 0 1px 2px -1px rgba(6,26,35,0.04)",
        }}
      >
        <nav aria-label="Blog categories">
          <Container>
            <div
              className="scrollbar-hide flex items-center gap-2 overflow-x-auto py-4 lg:justify-center lg:gap-3"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {/* "All" pill -- active by default on the index page */}
              <span
                className={cn(
                  "inline-flex items-center whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold",
                  "border-[var(--color-primary-200)] bg-[var(--color-primary-50)] text-[var(--color-primary-800)]",
                )}
                style={{ minHeight: "44px" }}
                aria-current="page"
              >
                All
              </span>

              {/* Category pills */}
              {BLOG_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/blog?category=${cat.slug}`}
                  className={cn(
                    "inline-flex items-center whitespace-nowrap rounded-full border border-[var(--color-border)] px-4 py-2",
                    "text-sm font-medium text-[var(--color-foreground)]/70 transition-all duration-150",
                    "hover:border-[var(--color-primary-200)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-800)]",
                  )}
                  style={{ minHeight: "44px", textDecoration: "none" }}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </Container>
        </nav>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* SECTION 4: Post Card Grid                                        */}
      {/* ---------------------------------------------------------------- */}
      <SectionContainer
        as="section"
        className="pb-24 pt-16"
        ariaLabelledBy="posts-heading"
      >
        <Container>
          <h2 id="posts-heading" className="sr-only">
            Blog Posts
          </h2>

          {gridPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {gridPosts.map((post) => (
                <BlogPostCard
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  description={post.description}
                  date={post.date}
                  author={post.author}
                  readingTime={post.readingTime}
                  category={post.category}
                />
              ))}
            </div>
          ) : (
            /* Empty state: only the featured post exists */
            <div className="mx-auto max-w-md py-16 text-center">
              <BookOpen
                className="mx-auto mb-4 h-12 w-12 text-[var(--color-muted-foreground)]"
                aria-hidden="true"
              />
              <h3 className="text-heading-sm mb-2 text-[var(--color-foreground)]">
                More articles coming soon
              </h3>
              <p className="text-body-md text-[var(--color-muted-foreground)]">
                Our safety analysts are working on new research and guides.
                Check back soon for fresh insights.
              </p>
            </div>
          )}
        </Container>
      </SectionContainer>

      {/* ---------------------------------------------------------------- */}
      {/* CTA Band                                                         */}
      {/* ---------------------------------------------------------------- */}
      <CTABand
        variant="dark"
        headline="Ready to go with a plan?"
        body="See how SafeTrekr delivers professional trip planning for your organization."
        primaryCta={{ text: "Schedule a Walkthrough", href: "/demo" }}
        secondaryCta={{ text: "View Pricing", href: "/pricing" }}
      />
    </>
  );
}
