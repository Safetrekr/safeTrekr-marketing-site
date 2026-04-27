/**
 * ST-894: Glossary Index Page (/resources/glossary)
 *
 * Alphabetical listing of industry terms related to travel risk management,
 * compliance, and organizational safety. Serves as a hub page that links to
 * individual term definition pages.
 *
 * Layout:
 *   1. Hero -- Eyebrow + headline + sub-headline
 *   2. Letter anchors -- Horizontal row of letter links for quick navigation
 *   3. Term grid -- Grouped by first letter, each term as a card link
 *   4. CTA Band -- Dark variant, demo + pricing
 *   5. JSON-LD -- BreadcrumbList structured data
 *
 * Server Component. All content sourced from src/content/glossary.ts.
 */

import Link from "next/link";
import { BookOpen } from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import { JsonLd, generateBreadcrumbSchema } from "@/lib/structured-data";
import { Container } from "@/components/layout/container";
import { SectionContainer } from "@/components/layout/section-container";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { CTABand } from "@/components/marketing/cta-band";
import {
  getGlossaryLetters,
  getGlossaryTermsByLetter,
} from "@/content/glossary";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "Travel Safety Glossary",
  description:
    "Definitions of key travel planning terms. Understand duty of care, safety binders, risk assessment, and other concepts essential to organizational travel preparation.",
  path: "/resources/glossary",
});

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function GlossaryIndexPage() {
  const letters = getGlossaryLetters();
  const termsByLetter = getGlossaryTermsByLetter();

  return (
    <>
      {/* Structured Data */}
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Home", url: "https://safetrekr.com" },
          { name: "Resources", url: "https://safetrekr.com/resources" },
          {
            name: "Glossary",
            url: "https://safetrekr.com/resources/glossary",
          },
        ])}
      />

      {/* ---------------------------------------------------------------- */}
      {/* SECTION 1: Hero                                                  */}
      {/* ---------------------------------------------------------------- */}
      <SectionContainer
        as="section"
        className="pb-12 pt-24 md:pb-16"
        ariaLabelledBy="glossary-hero-heading"
      >
        <Container>
          <div className="mx-auto text-center">
            <Eyebrow
              icon={<BookOpen className="h-4 w-4" />}
              className="mb-5 justify-center"
            >
              Resources
            </Eyebrow>

            <h1
              id="glossary-hero-heading"
              className="text-display-md mx-auto text-[var(--color-foreground)]"
              style={{ maxWidth: "28ch" }}
            >
              Travel Safety Glossary
            </h1>

            <p
              className="text-body-lg mx-auto mt-4 text-[var(--color-muted-foreground)]"
              style={{ maxWidth: "65ch" }}
            >
              Essential definitions for travel planning professionals, school
              administrators, and organizational safety coordinators.
            </p>
          </div>
        </Container>
      </SectionContainer>

      {/* ---------------------------------------------------------------- */}
      {/* SECTION 2: Letter Anchor Navigation                              */}
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
        <nav aria-label="Glossary letter navigation">
          <Container>
            <div
              className="scrollbar-hide flex items-center gap-2 overflow-x-auto py-4 lg:justify-center lg:gap-3"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {letters.map((letter) => (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-sm font-semibold text-[var(--color-foreground)] transition-all duration-150 hover:border-[var(--color-primary-200)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-800)]"
                  style={{ textDecoration: "none" }}
                >
                  {letter}
                </a>
              ))}
            </div>
          </Container>
        </nav>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* SECTION 3: Term Grid by Letter                                   */}
      {/* ---------------------------------------------------------------- */}
      <SectionContainer
        as="section"
        className="pb-24 pt-16"
        ariaLabelledBy="glossary-terms-heading"
      >
        <Container>
          <h2 id="glossary-terms-heading" className="sr-only">
            All Glossary Terms
          </h2>

          <div className="space-y-16">
            {letters.map((letter) => {
              const terms = termsByLetter.get(letter) ?? [];
              return (
                <div key={letter} id={`letter-${letter}`} className="scroll-mt-36">
                  {/* Letter heading */}
                  <div className="mb-6 flex items-center gap-4">
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold"
                      style={{
                        background: "var(--color-primary-50)",
                        color: "var(--color-primary-700)",
                      }}
                      aria-hidden="true"
                    >
                      {letter}
                    </span>
                    <div
                      className="h-px flex-1"
                      style={{ background: "var(--color-border)" }}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Term cards */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {terms.map((term) => (
                      <Link
                        key={term.slug}
                        href={`/resources/glossary/${term.slug}`}
                        className="group block rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm transition-all duration-200 hover:border-[var(--color-primary-200)] hover:shadow-md"
                        style={{ textDecoration: "none" }}
                      >
                        <h3 className="text-heading-sm mb-2 text-[var(--color-foreground)] transition-colors duration-150 group-hover:text-[var(--color-primary-700)]">
                          {term.name}
                        </h3>
                        <p className="text-body-sm line-clamp-2 text-[var(--color-muted-foreground)]">
                          {term.summary}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </SectionContainer>

      {/* ---------------------------------------------------------------- */}
      {/* CTA Band                                                         */}
      {/* ---------------------------------------------------------------- */}
      <CTABand
        variant="dark"
        headline="Ready to go with a plan?"
        body="SafeTrekr provides professional travel safety planning with all the documentation your organization needs."
        primaryCta={{ text: "Schedule a Walkthrough", href: "/demo" }}
        secondaryCta={{ text: "View Pricing", href: "/pricing" }}
      />
    </>
  );
}
