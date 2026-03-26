/**
 * ST-894: Glossary Term Page (/resources/glossary/[term])
 *
 * Renders a single glossary term definition with:
 * - Breadcrumb navigation (desktop + mobile)
 * - Term name as headline
 * - Full definition (200-400 words)
 * - Related links sidebar (pillar content, other glossary terms)
 * - DefinedTerm JSON-LD structured data
 * - BreadcrumbList JSON-LD structured data
 *
 * Uses `generateStaticParams` to pre-render all term pages at build time.
 *
 * @see src/content/glossary.ts -- term data
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, BookOpen, ArrowRight, ArrowLeft } from "lucide-react";

import { generatePageMetadata, type PageMetadataOptions } from "@/lib/metadata";
import {
  JsonLd,
  generateBreadcrumbSchema,
  type JsonLdData,
} from "@/lib/structured-data";
import { Container } from "@/components/layout/container";
import { SectionContainer } from "@/components/layout/section-container";
import { CTABand } from "@/components/marketing/cta-band";
import { Button } from "@/components/ui/button";
import {
  getAllGlossarySlugs,
  getGlossaryTermBySlug,
  GLOSSARY_TERMS,
} from "@/content/glossary";

// ---------------------------------------------------------------------------
// Static Params
// ---------------------------------------------------------------------------

export function generateStaticParams(): { term: string }[] {
  return getAllGlossarySlugs().map((slug) => ({ term: slug }));
}

// ---------------------------------------------------------------------------
// Dynamic Metadata
// ---------------------------------------------------------------------------

interface GlossaryTermPageProps {
  params: Promise<{ term: string }>;
}

export async function generateMetadata({ params }: GlossaryTermPageProps) {
  const { term } = await params;
  const glossaryTerm = getGlossaryTermBySlug(term);
  if (!glossaryTerm) return {};

  const options: PageMetadataOptions = {
    title: `${glossaryTerm.name} -- Travel Safety Glossary`,
    description: glossaryTerm.summary,
    path: `/resources/glossary/${term}`,
  };

  return generatePageMetadata(options);
}

// ---------------------------------------------------------------------------
// DefinedTerm JSON-LD Generator
// ---------------------------------------------------------------------------

/**
 * Generates a schema.org `DefinedTerm` JSON-LD object for a glossary entry.
 *
 * @see https://schema.org/DefinedTerm
 * @see https://schema.org/DefinedTermSet
 */
function generateDefinedTermSchema(input: {
  name: string;
  description: string;
  slug: string;
}): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: input.name,
    description: input.description,
    url: `https://safetrekr.com/resources/glossary/${input.slug}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "SafeTrekr Travel Safety Glossary",
      url: "https://safetrekr.com/resources/glossary",
    },
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Gets the previous and next terms for navigation, based on alphabetical
 * order in the GLOSSARY_TERMS array.
 */
function getAdjacentTerms(slug: string) {
  const index = GLOSSARY_TERMS.findIndex((t) => t.slug === slug);
  return {
    prev: index > 0 ? GLOSSARY_TERMS[index - 1] : null,
    next: index < GLOSSARY_TERMS.length - 1 ? GLOSSARY_TERMS[index + 1] : null,
  };
}

/**
 * Splits the definition text into paragraphs on double newlines.
 */
function renderDefinitionParagraphs(definition: string) {
  return definition.split("\n\n").map((paragraph, index) => (
    <p
      key={index}
      className="text-body-md mb-4 text-[var(--color-muted-foreground)] last:mb-0"
      style={{ maxWidth: "65ch" }}
    >
      {paragraph}
    </p>
  ));
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function GlossaryTermPage({
  params,
}: GlossaryTermPageProps) {
  const { term } = await params;
  const glossaryTerm = getGlossaryTermBySlug(term);

  if (!glossaryTerm) {
    notFound();
  }

  const { prev, next } = getAdjacentTerms(term);

  return (
    <>
      {/* Structured Data */}
      <JsonLd
        data={generateDefinedTermSchema({
          name: glossaryTerm.name,
          description: glossaryTerm.summary,
          slug: glossaryTerm.slug,
        })}
      />
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Home", url: "https://safetrekr.com" },
          { name: "Resources", url: "https://safetrekr.com/resources" },
          {
            name: "Glossary",
            url: "https://safetrekr.com/resources/glossary",
          },
          {
            name: glossaryTerm.name,
            url: `https://safetrekr.com/resources/glossary/${glossaryTerm.slug}`,
          },
        ])}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Term Header                                                      */}
      {/* ---------------------------------------------------------------- */}
      <SectionContainer
        as="section"
        className="pb-6 pt-8 sm:pb-8 sm:pt-12 lg:pb-6 lg:pt-8"
        ariaLabelledBy="glossary-term-heading"
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
                  href="/resources/glossary"
                  className="transition-colors duration-150 hover:text-[var(--color-foreground)]"
                >
                  Glossary
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="mx-1 h-3.5 w-3.5" />
              </li>
              <li
                aria-current="page"
                className="line-clamp-1 font-medium text-[var(--color-foreground)]"
              >
                {glossaryTerm.name}
              </li>
            </ol>
          </nav>

          {/* Breadcrumb: Mobile */}
          <nav aria-label="Breadcrumb" className="mb-6 sm:hidden">
            <Link
              href="/resources/glossary"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted-foreground)] transition-colors duration-150"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to Glossary
            </Link>
          </nav>

          {/* Term badge */}
          <div className="mb-4 lg:mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-50)] px-3 py-1 text-[13px] font-medium text-[var(--color-primary-700)]">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              Glossary Term
            </span>
          </div>

          {/* Headline */}
          <h1
            id="glossary-term-heading"
            className="text-display-md mb-4 text-[var(--color-foreground)]"
            style={{ maxWidth: "20ch" }}
          >
            {glossaryTerm.name}
          </h1>

          {/* Summary */}
          <p
            className="text-body-lg text-[var(--color-muted-foreground)]"
            style={{ maxWidth: "65ch" }}
          >
            {glossaryTerm.summary}
          </p>
        </Container>
      </SectionContainer>

      {/* ---------------------------------------------------------------- */}
      {/* Definition Body + Sidebar                                        */}
      {/* ---------------------------------------------------------------- */}
      <SectionContainer
        as="section"
        className="pb-16 pt-0 lg:pb-24"
        aria-label="Term definition"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_280px] lg:gap-16">
            {/* Definition column */}
            <article className="max-w-[720px]">
              {renderDefinitionParagraphs(glossaryTerm.definition)}
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div
                className="sticky top-28"
                style={{
                  maxHeight: "calc(100vh - 8rem)",
                  overflowY: "auto",
                }}
              >
                {/* Related Links Card */}
                {glossaryTerm.relatedLinks.length > 0 && (
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
                    <p className="text-eyebrow mb-4 text-[var(--color-primary-700)]">
                      Related Resources
                    </p>
                    <ul className="space-y-3">
                      {glossaryTerm.relatedLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="group flex items-center gap-2 text-sm text-[var(--color-foreground)] transition-colors duration-150 hover:text-[var(--color-primary-700)]"
                          >
                            <ArrowRight
                              className="h-3.5 w-3.5 shrink-0 text-[var(--color-muted-foreground)] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[var(--color-primary-700)]"
                              aria-hidden="true"
                            />
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Browse Glossary Card */}
                <div className="mt-6 rounded-xl bg-[var(--color-primary-50)] p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <BookOpen
                      className="h-4 w-4 text-[var(--color-primary-700)]"
                      aria-hidden="true"
                    />
                    <p className="text-eyebrow text-[var(--color-primary-700)]">
                      Explore More Terms
                    </p>
                  </div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Browse the full glossary of travel safety and compliance
                    terminology.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-3 w-full"
                    asChild
                  >
                    <Link href="/resources/glossary">View All Terms</Link>
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </SectionContainer>

      {/* ---------------------------------------------------------------- */}
      {/* Previous / Next Navigation                                       */}
      {/* ---------------------------------------------------------------- */}
      <SectionContainer
        as="div"
        variant="card"
        className="py-8 lg:py-12"
      >
        <Container>
          <nav aria-label="Previous and next glossary terms">
            <div className="flex items-stretch justify-between gap-4">
              {/* Previous term */}
              {prev ? (
                <Link
                  href={`/resources/glossary/${prev.slug}`}
                  className="group flex items-center gap-3 rounded-lg px-4 py-3 transition-colors duration-150 hover:bg-[var(--color-primary-50)]"
                  style={{ textDecoration: "none" }}
                >
                  <ArrowLeft
                    className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)] transition-transform duration-150 group-hover:-translate-x-0.5 group-hover:text-[var(--color-primary-700)]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs font-medium text-[var(--color-muted-foreground)]">
                      Previous
                    </p>
                    <p className="text-sm font-medium text-[var(--color-foreground)] transition-colors duration-150 group-hover:text-[var(--color-primary-700)]">
                      {prev.name}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {/* Next term */}
              {next ? (
                <Link
                  href={`/resources/glossary/${next.slug}`}
                  className="group flex items-center gap-3 rounded-lg px-4 py-3 text-right transition-colors duration-150 hover:bg-[var(--color-primary-50)]"
                  style={{ textDecoration: "none" }}
                >
                  <div>
                    <p className="text-xs font-medium text-[var(--color-muted-foreground)]">
                      Next
                    </p>
                    <p className="text-sm font-medium text-[var(--color-foreground)] transition-colors duration-150 group-hover:text-[var(--color-primary-700)]">
                      {next.name}
                    </p>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[var(--color-primary-700)]"
                    aria-hidden="true"
                  />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </nav>
        </Container>
      </SectionContainer>

      {/* ---------------------------------------------------------------- */}
      {/* CTA Band                                                         */}
      {/* ---------------------------------------------------------------- */}
      <CTABand
        variant="dark"
        headline="Ready to go with a plan?"
        body="See how SafeTrekr delivers professional safety binders for your organization."
        primaryCta={{ text: "Schedule a Walkthrough", href: "/demo" }}
        secondaryCta={{ text: "View Pricing", href: "/pricing" }}
      />
    </>
  );
}
