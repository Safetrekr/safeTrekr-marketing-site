/**
 * ST-873: REQ-xxx -- Value Calculator Page (/resources/roi-calculator)
 *
 * Interactive value calculator helping organizations understand what structured
 * trip safety planning delivers in terms of time savings, consistency, and
 * stakeholder confidence. Users configure their organization profile and see
 * real-time value estimates.
 *
 * Server Component at the page level. The interactive calculator is rendered
 * as a client component child (ROICalculator).
 *
 * Section order:
 *   1. Hero          -- "Calculate Your Planning Investment" headline
 *   2. Calculator    -- Interactive inputs + results (client component)
 *   3. Context       -- Value explanation (time, consistency, confidence)
 *   4. CTA Band      -- Conversion band
 *   5. JSON-LD       -- BreadcrumbList + SoftwareApplication schemas
 *
 * @see src/components/tools/roi-calculator.tsx
 * @see src/content/pricing.ts
 */

import { Suspense } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle,
  Users,
  FileCheck,
  Calculator,
} from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import { JsonLd, generateBreadcrumbSchema } from "@/lib/structured-data";
import { SectionContainer } from "@/components/layout/section-container";
import { Container } from "@/components/layout/container";
import { Eyebrow, CTABand } from "@/components/marketing";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { ROICalculator } from "@/components/tools/roi-calculator";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "Trip Planning Value Calculator",
  description:
    "Calculate the value of professional trip safety planning for your organization. Understand what structured preparation delivers in terms of time savings, consistency, and stakeholder confidence.",
  path: "/resources/roi-calculator",
});

// ---------------------------------------------------------------------------
// JSON-LD structured data
// ---------------------------------------------------------------------------

function ROICalculatorJsonLd() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://safetrekr.com/" },
    { name: "Resources", url: "https://safetrekr.com/resources" },
    { name: "ROI Calculator", url: "https://safetrekr.com/resources/roi-calculator" },
  ]);

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SafeTrekr Trip Planning Value Calculator",
    description:
      "Interactive calculator helping organizations understand the value of professional trip safety planning in terms of time savings, consistency, and stakeholder confidence.",
    url: "https://safetrekr.com/resources/roi-calculator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "SafeTrekr",
      url: "https://safetrekr.com",
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={toolSchema} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ROICalculatorPage() {
  return (
    <>
      {/* ================================================================
          SECTION 1: HERO
          ================================================================ */}
      <SectionContainer aria-label="ROI calculator hero">
        <Container>
          <div className="pt-4 pb-4 text-center sm:pt-8 sm:pb-8 lg:pt-12 lg:pb-12">
            <ScrollReveal>
              <div className="mx-auto flex size-12 items-center justify-center">
                <Calculator
                  className="size-10 text-primary-500 sm:size-12"
                  aria-hidden="true"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <Eyebrow className="mt-6 mb-4">Resources</Eyebrow>
            </ScrollReveal>

            <ScrollReveal>
              <h1 className="mx-auto max-w-4xl text-display-lg text-foreground">
                Calculate Your{" "}
                <span className="text-primary-700">Planning Investment</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal>
              <p className="mx-auto mt-6 max-w-prose text-body-lg text-muted-foreground">
                Professional trip planning is an investment in structure, consistency, and confidence. Use this calculator to understand what SafeTrekr delivers for your organization.
              </p>
            </ScrollReveal>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 2: INTERACTIVE CALCULATOR
          ================================================================ */}
      <SectionContainer variant="card" aria-label="ROI calculator inputs and results">
        <Container>
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-body-md text-muted-foreground">
                  Loading calculator...
                </p>
              </div>
            }
          >
            <ROICalculator />
          </Suspense>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 3: VALUE CONTEXT
          ================================================================ */}
      <SectionContainer aria-label="Understanding the value">
        <Container>
          <div className="text-center">
            <ScrollReveal>
              <Eyebrow className="mb-4">Understanding the Value</Eyebrow>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="text-display-md text-foreground">
                The value of structured planning
              </h2>
            </ScrollReveal>
            <ScrollReveal>
              <p className="mx-auto mt-4 max-w-prose text-body-lg text-muted-foreground">
                Most organizations spend significant staff time coordinating trip safety without having tools designed for that purpose. SafeTrekr provides professional structure that saves time, creates consistency, and builds stakeholder confidence.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
              {/* Time Savings Card */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                  <Clock
                    className="size-6 text-primary-700"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-4 text-title-lg text-foreground">
                  Time Savings
                </h3>
                <p className="mt-2 text-body-md text-muted-foreground">
                  Organizations report that coordinating trip safety information takes 3-8 hours per trip when done manually. Staff research destinations, compile emergency contacts, create checklists, and assemble documentation from scratch each time. SafeTrekr delivers a complete, professionally reviewed safety binder in 3-5 days, freeing your staff to focus on the educational or organizational aspects of the trip.
                </p>
              </div>

              {/* Consistency Card */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                  <CheckCircle
                    className="size-6 text-primary-700"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-4 text-title-lg text-foreground">
                  Consistency Across Trips
                </h3>
                <p className="mt-2 text-body-md text-muted-foreground">
                  When trip planning relies on individual coordinators, quality varies. One coordinator may be thorough; another may miss important considerations. SafeTrekr ensures every trip -- regardless of who coordinates it -- receives the same 17-section professional review. Consistency builds organizational confidence.
                </p>
              </div>

              {/* Stakeholder Confidence Card */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                  <Users
                    className="size-6 text-primary-700"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-4 text-title-lg text-foreground">
                  Stakeholder Confidence
                </h3>
                <p className="mt-2 text-body-md text-muted-foreground">
                  When board members, parents, or leadership ask about trip preparation, you can share professional documentation. The safety binder demonstrates that structured planning was completed -- building confidence without requiring lengthy explanations.
                </p>
              </div>

              {/* Insurance Considerations Card */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                  <FileCheck
                    className="size-6 text-primary-700"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-4 text-title-lg text-foreground">
                  Insurance Considerations
                </h3>
                <p className="mt-2 text-body-md text-muted-foreground">
                  Many insurance carriers appreciate documented safety planning processes. Organizations with professional trip assessment may find it easier to demonstrate responsible preparation when discussing coverage.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mt-10 text-center">
              <Button variant="secondary" size="md" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 4: CONVERSION CTA BAND
          ================================================================ */}
      <CTABand
        variant="dark"
        headline="Ready to go with a plan?"
        body="Schedule a walkthrough to see how SafeTrekr delivers professional trip planning for your organization."
        primaryCta={{ text: "Schedule a Walkthrough", href: "/demo" }}
        secondaryCta={{ text: "View Pricing", href: "/pricing" }}
      />

      {/* ================================================================
          JSON-LD STRUCTURED DATA
          ================================================================ */}
      <ROICalculatorJsonLd />
    </>
  );
}
