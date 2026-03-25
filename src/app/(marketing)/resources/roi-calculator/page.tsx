/**
 * ST-873: REQ-xxx -- ROI Calculator Page (/resources/roi-calculator)
 *
 * Interactive ROI calculator comparing SafeTrekr cost against status-quo
 * manual safety planning labor and settlement risk. Users configure their
 * organization profile and see real-time cost savings, shareable via URL.
 *
 * Server Component at the page level. The interactive calculator is rendered
 * as a client component child (ROICalculator).
 *
 * Section order:
 *   1. Hero          -- "Calculate Your ROI" headline
 *   2. Calculator    -- Interactive inputs + results (client component)
 *   3. Context       -- Value anchors and trust signals
 *   4. CTA Band      -- Conversion band
 *   5. JSON-LD       -- BreadcrumbList + SoftwareApplication schemas
 *
 * @see src/components/tools/roi-calculator.tsx
 * @see src/content/pricing.ts
 */

import { Suspense } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  Shield,
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
  title: "ROI Calculator",
  description:
    "Calculate how much SafeTrekr saves your organization in staff time, liability reduction, and documentation costs compared to manual safety planning.",
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
    name: "SafeTrekr ROI Calculator",
    description:
      "Interactive calculator comparing SafeTrekr cost against manual safety planning labor and settlement risk for K-12 schools, higher education, churches, corporate, and sports organizations.",
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
              <Eyebrow className="mt-6 mb-4">ROI Calculator</Eyebrow>
            </ScrollReveal>

            <ScrollReveal>
              <h1 className="mx-auto max-w-4xl text-display-lg text-foreground">
                Calculate Your Organization&apos;s{" "}
                <span className="text-primary-700">Return on Investment</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal>
              <p className="mx-auto mt-6 max-w-prose text-body-lg text-muted-foreground">
                See how SafeTrekr compares to your current safety planning
                approach in cost, time, and risk reduction.
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
      <SectionContainer aria-label="Cost context and value comparison">
        <Container>
          <div className="text-center">
            <ScrollReveal>
              <Eyebrow className="mb-4">Why It Matters</Eyebrow>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="text-display-md text-foreground">
                The Real Cost of &ldquo;Good Enough&rdquo;
              </h2>
            </ScrollReveal>
            <ScrollReveal>
              <p className="mx-auto mt-4 max-w-prose text-body-lg text-muted-foreground">
                Manual safety planning costs more than most organizations realize --
                in staff hours, in liability exposure, and in peace of mind.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
              {/* Liability Card */}
              <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 md:flex-col md:items-start md:gap-0">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#fef3c7]">
                  <AlertTriangle
                    className="size-6 text-[#b45309]"
                    aria-hidden="true"
                  />
                </div>
                <div className="md:mt-4">
                  <p
                    className="text-display-md text-foreground"
                    aria-label="Average trip-related injury settlement: $500,000 to $2 million"
                  >
                    $500K &ndash; $2M
                  </p>
                  <p className="mt-2 text-body-md text-muted-foreground">
                    Average trip-related injury settlement when due diligence
                    cannot be demonstrated
                  </p>
                </div>
              </div>

              {/* Staff Time Card */}
              <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 md:flex-col md:items-start md:gap-0">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Clock
                    className="size-6 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <div className="md:mt-4">
                  <p
                    className="text-display-md text-foreground"
                    aria-label="Staff time for manual safety planning per trip: 8 to 12 hours"
                  >
                    8 &ndash; 12 hours
                  </p>
                  <p className="mt-2 text-body-md text-muted-foreground">
                    Staff time spent on manual safety research and documentation
                    per trip
                  </p>
                </div>
              </div>

              {/* SafeTrekr Card */}
              <div className="flex items-start gap-4 rounded-xl border-2 border-primary-200 bg-white p-6 md:flex-col md:items-start md:gap-0">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                  <Shield
                    className="size-6 text-primary-700"
                    aria-hidden="true"
                  />
                </div>
                <div className="md:mt-4">
                  <p
                    className="text-display-md text-primary-700"
                    aria-label="SafeTrekr: professional analyst review starting at $15 per participant"
                  >
                    From $15
                  </p>
                  <p className="mt-2 text-body-md text-muted-foreground">
                    Per participant for professional analyst review with
                    audit-ready documentation
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mt-10 text-center">
              <Button variant="secondary" size="md" asChild>
                <Link href="/pricing">View Full Pricing Details</Link>
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
        headline="Ready to Protect Your Next Trip?"
        body="Every trip deserves a safety analyst. See SafeTrekr in action with a personalized demo."
        primaryCta={{ text: "Get a Demo", href: "/demo" }}
        secondaryCta={{ text: "Contact Sales", href: "/contact" }}
      />

      {/* ================================================================
          JSON-LD STRUCTURED DATA
          ================================================================ */}
      <ROICalculatorJsonLd />
    </>
  );
}
