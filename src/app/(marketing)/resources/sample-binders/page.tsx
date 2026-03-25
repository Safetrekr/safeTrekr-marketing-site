/**
 * ST-892: Sample Binder Download Pages (/resources/sample-binders)
 *
 * Segment-specific sample binder download page -- the #1 lead magnet for
 * the SafeTrekr marketing site. Visitors select a segment (K-12, Churches,
 * Corporate), enter their email via the LeadCaptureModal, and receive a
 * download link to a sample safety binder.
 *
 * Three segments at launch:
 *   1. K-12 Schools
 *   2. Churches & Mission Organizations
 *   3. Corporate Travel
 *
 * Server Component composing layout primitives and the client-side
 * SampleBinderCards component for modal interaction.
 *
 * Section order:
 *   1. Hero       -- Breadcrumb, eyebrow, headline, body copy
 *   2. Cards      -- 3 segment cards with gated download
 *   3. Trust      -- Social proof / trust signals
 *   4. CTA Band   -- Bottom conversion band
 */

import Link from "next/link";
import {
  Shield,
  FileText,
  Lock,
  CheckCircle2,
} from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import { JsonLd, generateBreadcrumbSchema } from "@/lib/structured-data";
import { SectionContainer } from "@/components/layout/section-container";
import { Container } from "@/components/layout/container";
import { Eyebrow, CTABand } from "@/components/marketing";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

import { SampleBinderCards } from "./_components/sample-binder-cards";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "Download Sample Safety Binders",
  description:
    "See what a professional safety binder looks like before you commit. Download segment-specific sample binders for K-12 schools, churches, and corporate travel -- free, no obligation.",
  path: "/resources/sample-binders",
});

// ---------------------------------------------------------------------------
// Structured Data
// ---------------------------------------------------------------------------

const BREADCRUMB_ITEMS = [
  { name: "Home", url: "https://safetrekr.com/" },
  { name: "Resources", url: "https://safetrekr.com/resources" },
  {
    name: "Sample Binders",
    url: "https://safetrekr.com/resources/sample-binders",
  },
];

// ---------------------------------------------------------------------------
// Trust Signals
// ---------------------------------------------------------------------------

const TRUST_SIGNALS = [
  {
    icon: <FileText className="size-6" />,
    title: "Real Binder Format",
    description:
      "Every sample binder follows the exact 17-section format our analysts use for production safety reviews.",
  },
  {
    icon: <Shield className="size-6" />,
    title: "Government Intelligence Data",
    description:
      "Sample risk scores come from the same NOAA, USGS, CDC, ReliefWeb, and GDACS sources we use for live assessments.",
  },
  {
    icon: <Lock className="size-6" />,
    title: "No Obligation",
    description:
      "Download the sample, review it with your team, and decide if SafeTrekr is right for your organization. No sales call required.",
  },
] as const;

// ===========================================================================
// Page Component
// ===========================================================================

export default function SampleBindersPage() {
  return (
    <>
      {/* Structured Data */}
      <JsonLd data={generateBreadcrumbSchema(BREADCRUMB_ITEMS)} />

      <main>
        {/* ================================================================
            SECTION 1: HERO
            ================================================================ */}
        <SectionContainer id="hero" aria-label="Sample binders hero">
          <Container>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 lg:mb-8">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/"
                    className="text-primary-700 hover:underline"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="select-none">
                  /
                </li>
                <li>
                  <Link
                    href="/resources"
                    className="text-primary-700 hover:underline"
                  >
                    Resources
                  </Link>
                </li>
                <li aria-hidden="true" className="select-none">
                  /
                </li>
                <li
                  aria-current="page"
                  className="font-medium text-foreground"
                >
                  Sample Binders
                </li>
              </ol>
            </nav>

            {/* Hero content */}
            <div className="mx-auto max-w-3xl text-center">
              <ScrollReveal variant="fadeUp">
                <Eyebrow
                  color="primary"
                  icon={<FileText className="size-4" />}
                >
                  Free Download
                </Eyebrow>
              </ScrollReveal>

              <ScrollReveal variant="fadeUp" delay={0.1}>
                <h1
                  className="mt-5 text-display-lg text-foreground"
                  id="sample-binders-heading"
                >
                  See What a Professional Safety Binder Looks Like
                </h1>
              </ScrollReveal>

              <ScrollReveal variant="fadeUp" delay={0.2}>
                <p className="mt-6 text-body-lg text-muted-foreground">
                  Before you commit to anything, download a sample safety binder
                  for your segment. Review the 17-section analyst format, the
                  government intelligence data, and the audit-ready documentation
                  your organization needs. Free, no obligation, no sales call.
                </p>
              </ScrollReveal>
            </div>
          </Container>
        </SectionContainer>

        {/* ================================================================
            SECTION 2: SEGMENT CARDS
            ================================================================ */}
        <SectionContainer
          id="segments"
          variant="card"
          ariaLabelledBy="segments-heading"
        >
          <Container>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <ScrollReveal variant="fadeUp">
                <h2
                  id="segments-heading"
                  className="text-display-sm text-foreground"
                >
                  Choose Your Segment
                </h2>
              </ScrollReveal>
              <ScrollReveal variant="fadeUp" delay={0.1}>
                <p className="mt-4 text-body-lg text-muted-foreground">
                  Each sample binder is tailored to the specific safety concerns,
                  compliance requirements, and risk factors relevant to your
                  organization type.
                </p>
              </ScrollReveal>
            </div>

            <SampleBinderCards />
          </Container>
        </SectionContainer>

        {/* ================================================================
            SECTION 3: TRUST SIGNALS
            ================================================================ */}
        <SectionContainer
          id="trust"
          ariaLabelledBy="trust-heading"
        >
          <Container>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <ScrollReveal variant="fadeUp">
                <h2
                  id="trust-heading"
                  className="text-display-sm text-foreground"
                >
                  What You Will Find Inside
                </h2>
              </ScrollReveal>
              <ScrollReveal variant="fadeUp" delay={0.1}>
                <p className="mt-4 text-body-lg text-muted-foreground">
                  These are not marketing brochures. Every sample binder is built
                  from the same template our safety analysts use for real client
                  engagements.
                </p>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {TRUST_SIGNALS.map((signal, index) => (
                <ScrollReveal
                  key={signal.title}
                  variant="fadeUp"
                  delay={index * 0.1}
                >
                  <div className="flex flex-col items-center text-center">
                    <span
                      className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-primary-50 text-primary-600"
                      aria-hidden="true"
                    >
                      {signal.icon}
                    </span>
                    <h3 className="text-heading-sm text-foreground">
                      {signal.title}
                    </h3>
                    <p className="mt-2 text-body-md text-muted-foreground">
                      {signal.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Social proof callout */}
            <ScrollReveal variant="fadeUp" delay={0.3}>
              <div className="mx-auto mt-16 flex max-w-xl flex-col items-center gap-3 rounded-xl border border-border bg-primary-50/50 p-6 text-center sm:p-8">
                <CheckCircle2
                  className="size-8 text-primary-600"
                  aria-hidden="true"
                />
                <p className="text-body-lg font-medium text-foreground">
                  Over 500 organizations have downloaded our sample binders to
                  evaluate SafeTrekr before their first engagement.
                </p>
                <p className="text-body-sm text-muted-foreground">
                  Join schools, churches, and enterprises that made an informed
                  decision about their safety documentation.
                </p>
              </div>
            </ScrollReveal>
          </Container>
        </SectionContainer>

        {/* ================================================================
            SECTION 4: CTA BAND
            ================================================================ */}
        <CTABand
          variant="dark"
          headline="Ready for a Safety Binder Built for Your Next Trip?"
          body="Download the sample to see the format. When you are ready, our analysts will build a custom binder for your specific destinations, team, and timeline."
          primaryCta={{
            text: "Get a Demo",
            href: "/demo",
          }}
          secondaryCta={{
            text: "View Pricing",
            href: "/pricing",
          }}
        />
      </main>
    </>
  );
}
