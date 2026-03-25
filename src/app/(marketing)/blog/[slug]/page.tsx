/**
 * ST-912: Blog Post Page (/blog/[slug])
 *
 * Renders a single MDX blog post with:
 * - Breadcrumb navigation (desktop + mobile)
 * - Category badge
 * - Article headline
 * - Author row (avatar, name, date, reading time)
 * - Article body rendered via next-mdx-remote
 * - TOC sidebar on desktop (reuses legal TOC pattern)
 * - Author bio card
 * - Newsletter signup CTA
 * - Article JSON-LD structured data (ST-913)
 *
 * Uses `generateStaticParams` to pre-render all posts at build time.
 *
 * @see designs/html/mockup-blog-post.html
 * @see src/lib/blog.ts -- getPostBySlug, getAllPostSlugs
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Clock, Mail } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";

import { generatePageMetadata, type PageMetadataOptions } from "@/lib/metadata";
import {
  JsonLd,
  generateArticleSchema,
  generateBreadcrumbSchema,
} from "@/lib/structured-data";
import {
  getAllPostSlugs,
  getPostBySlug,
  getAllPosts,
  getAuthorInitials,
} from "@/lib/blog";
import { getCategoryByName } from "@/content/blog/categories";
import { Container } from "@/components/layout/container";
import { SectionContainer } from "@/components/layout/section-container";
import { BlogPostCard } from "@/components/marketing/blog-post-card";
import { CTABand } from "@/components/marketing/cta-band";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Static Params
// ---------------------------------------------------------------------------

export function generateStaticParams(): { slug: string }[] {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// Dynamic Metadata
// ---------------------------------------------------------------------------

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const options: PageMetadataOptions = {
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    ogImage: `/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description)}&type=blog`,
  };

  return generatePageMetadata(options);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Estimate word count from MDX content (strip markdown syntax). */
function estimateWordCount(content: string): number {
  const text = content
    .replace(/```[\s\S]*?```/g, "") // code blocks
    .replace(/`[^`]*`/g, "") // inline code
    .replace(/[#*_~\[\]()>|-]/g, "") // markdown chars
    .replace(/\n+/g, " ")
    .trim();
  return text.split(/\s+/).filter(Boolean).length;
}

// ---------------------------------------------------------------------------
// MDX Components
// ---------------------------------------------------------------------------

/**
 * Custom components for MDX rendering. Uses the blog prose styling
 * (similar to legal-prose but with blog-specific enhancements).
 */
const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      className="scroll-mt-24 text-heading-lg mb-4 mt-12 text-[var(--color-foreground)] first:mt-0"
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      className="scroll-mt-24 text-heading-md mb-3 mt-8 text-[var(--color-foreground)]"
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      {...props}
      className="text-body-md mb-4 text-[var(--color-muted-foreground)]"
      style={{ maxWidth: "65ch" }}
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      className="text-[var(--color-primary-700)] underline underline-offset-2 transition-colors duration-150 hover:text-[var(--color-primary-800)]"
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong {...props} className="font-semibold text-[var(--color-foreground)]" />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...props}
      className="my-8 border-l-4 border-[var(--color-primary-500)] pl-6 py-1"
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className="mb-4 mt-4 flex flex-col gap-2" style={{ listStyle: "none", padding: 0 }} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li
      {...props}
      className="relative pl-7 text-body-md text-[var(--color-muted-foreground)]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234ca46e' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 6px",
        backgroundSize: "16px 16px",
      }}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className="mb-4 mt-4 flex flex-col gap-2" style={{ listStyleType: "decimal", listStylePosition: "inside" }} />
  ),
  hr: () => (
    <hr className="my-10 border-t border-[var(--color-border)]" />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em {...props} className="italic" />
  ),
};

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const categoryData = getCategoryByName(post.category);
  const initials = getAuthorInitials(post.author);
  const wordCount = estimateWordCount(post.content);

  // Related posts: same category, excluding current, max 3
  const relatedPosts = getAllPosts()
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      {/* Structured Data */}
      <JsonLd
        data={generateArticleSchema({
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          authorName: post.author,
          authorTitle: post.authorTitle,
          path: `/blog/${slug}`,
          section: post.category,
          wordCount,
        })}
      />
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Home", url: "https://safetrekr.com" },
          { name: "Blog", url: "https://safetrekr.com/blog" },
          { name: post.title, url: `https://safetrekr.com/blog/${slug}` },
        ])}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Article Hero                                                     */}
      {/* ---------------------------------------------------------------- */}
      <SectionContainer
        as="section"
        className="pb-6 pt-8 sm:pb-8 sm:pt-12 lg:pb-6 lg:pt-8"
        ariaLabelledBy="blog-post-heading"
      >
        <Container>
          {/* Breadcrumb: Desktop */}
          <nav aria-label="Breadcrumb" className="mb-6 hidden sm:block lg:mb-8">
            <ol className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)]">
              <li>
                <Link
                  href="/"
                  className="transition-colors duration-150 hover:text-[var(--color-foreground)]"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="mx-1 h-3.5 w-3.5" />
              </li>
              <li>
                <Link
                  href="/blog"
                  className="transition-colors duration-150 hover:text-[var(--color-foreground)]"
                >
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="mx-1 h-3.5 w-3.5" />
              </li>
              <li
                aria-current="page"
                className="line-clamp-1 font-medium text-[var(--color-foreground)]"
              >
                {post.title}
              </li>
            </ol>
          </nav>

          {/* Breadcrumb: Mobile */}
          <nav aria-label="Breadcrumb" className="mb-6 sm:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted-foreground)] transition-colors duration-150"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to Blog
            </Link>
          </nav>

          {/* Category badge */}
          {categoryData && (
            <div className="mb-4 lg:mb-6">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-[13px] font-medium",
                  categoryData.color.bg,
                  categoryData.color.text,
                )}
              >
                {categoryData.name}
              </span>
            </div>
          )}

          {/* Headline */}
          <h1
            id="blog-post-heading"
            className="text-display-md mb-6 text-[var(--color-foreground)]"
            style={{ maxWidth: "20ch" }}
          >
            {post.title}
          </h1>

          {/* Author row */}
          <div className="mb-6 flex items-center gap-3">
            {/* Avatar */}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{
                background: "var(--color-primary-100)",
                color: "var(--color-primary-700)",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {initials}
            </div>
            <div>
              <p className="text-body-sm m-0 font-medium leading-snug text-[var(--color-foreground)]">
                {post.author}
                {post.authorTitle && `, ${post.authorTitle}`}
              </p>
              <div className="flex items-center gap-2 text-body-sm text-[var(--color-muted-foreground)]">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span className="text-[var(--color-border)]">&middot;</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {post.readingTime}
                </span>
              </div>
            </div>
          </div>
        </Container>
      </SectionContainer>

      {/* ---------------------------------------------------------------- */}
      {/* Article Body + TOC Sidebar                                       */}
      {/* ---------------------------------------------------------------- */}
      <SectionContainer
        as="section"
        className="pb-16 pt-0 lg:pb-24"
        aria-label="Article content"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_260px] lg:gap-16">
            {/* Article column */}
            <article className="blog-prose max-w-[720px]">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
              />
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div
                className="sticky top-28"
                style={{ maxHeight: "calc(100vh - 8rem)", overflowY: "auto" }}
              >
                {/* Author Bio Card */}
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
                  <p className="text-eyebrow mb-4 text-[var(--color-primary-700)]">
                    About the Author
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                      style={{
                        background: "var(--color-primary-100)",
                        color: "var(--color-primary-800)",
                      }}
                    >
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-foreground)]">
                        {post.author}
                      </p>
                      {post.authorTitle && (
                        <p className="text-xs text-[var(--color-muted-foreground)]">
                          {post.authorTitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
                    Expert safety analyst at SafeTrekr, focused on helping
                    organizations manage travel risk and maintain compliance.
                  </p>
                </div>

                {/* Newsletter Signup Card */}
                <div className="mt-6 rounded-xl bg-[var(--color-primary-50)] p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Mail
                      className="h-4 w-4 text-[var(--color-primary-700)]"
                      aria-hidden="true"
                    />
                    <p className="text-eyebrow text-[var(--color-primary-700)]">
                      Stay Updated
                    </p>
                  </div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Get the latest safety research and compliance guides
                    delivered to your inbox.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-3 w-full"
                    asChild
                  >
                    <Link href="/contact">Subscribe to Newsletter</Link>
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </SectionContainer>

      {/* ---------------------------------------------------------------- */}
      {/* Related Posts                                                     */}
      {/* ---------------------------------------------------------------- */}
      {relatedPosts.length > 0 && (
        <SectionContainer
          as="section"
          variant="card"
          className="py-16 lg:py-24"
          ariaLabelledBy="related-posts-heading"
        >
          <Container>
            <h2
              id="related-posts-heading"
              className="text-heading-md mb-8 text-[var(--color-foreground)]"
            >
              Related Articles
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {relatedPosts.map((p) => (
                <BlogPostCard
                  key={p.slug}
                  slug={p.slug}
                  title={p.title}
                  description={p.description}
                  date={p.date}
                  author={p.author}
                  readingTime={p.readingTime}
                  category={p.category}
                />
              ))}
            </div>
          </Container>
        </SectionContainer>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* CTA Band                                                         */}
      {/* ---------------------------------------------------------------- */}
      <CTABand
        variant="dark"
        headline="Ready to protect every trip?"
        body="See how SafeTrekr delivers analyst-reviewed safety binders for your organization."
        primaryCta={{ text: "Get a Demo", href: "/demo" }}
        secondaryCta={{ text: "View Pricing", href: "/pricing" }}
      />
    </>
  );
}
