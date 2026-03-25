/**
 * ST-889: Platform Overview Page (/platform)
 *
 * Top-level page listing all SafeTrekr platform capabilities. Routes visitors
 * to deep-dive feature pages for Analyst Review, Risk Intelligence, and
 * Safety Binder. Establishes the platform narrative: professional analyst
 * review backed by government intelligence, delivered as audit-ready
 * documentation.
 *
 * Server Component composing pre-built components from the marketing library.
 *
 * Section order:
 *   1. Hero            -- Centered headline with dual CTAs
 *   2. Feature Cards   -- 3 linked cards (Analyst Review, Risk Intelligence, Safety Binder)
 *   3. How It Works    -- 3-step ProcessTimeline
 *   4. CTA Band        -- Dark variant, demo + pricing
 *   5. JSON-LD         -- BreadcrumbList structured data
 */

import Link from "next/link";
import {
  ClipboardCheck,
  Activity,
  FileText,
  Shield,
  ArrowRight,
  Eye,
  MapPin,
} from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { SectionContainer } from "@/components/layout/section-container";
import { Container } from "@/components/layout/container";
import {
  Eyebrow,
  FeatureGrid,
  ProcessTimeline,
  CTABand,
} from "@/components/marketing";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "Platform Capabilities",
  description:
    "SafeTrekr combines professional analyst review, government-sourced risk intelligence, and tamper-evident safety documentation into a single platform. Explore each capability in depth.",
  path: "/platform",
});

// ---------------------------------------------------------------------------
// Data Constants
// ---------------------------------------------------------------------------

const FEATURE_CARDS = [
  {
    icon: <ClipboardCheck className="size-6" />,
    title: "Professional Analyst Review",
    description:
      "Every trip is reviewed by a trained safety analyst across 17 dimensions -- venues, transportation, emergency planning, health advisories, and more. No algorithms. No automation. A real analyst who flags what needs attention and documents what is ready.",
    href: "/platform/analyst-review",
    linkText: "Explore the review process",
  },
  {
    icon: <Activity className="size-6" />,
    title: "Real-Time Risk Intelligence",
    description:
      "Monte Carlo risk scoring sourced from 5 government databases: NOAA weather data, USGS seismic monitoring, CDC health advisories, GDACS disaster alerts, and ReliefWeb humanitarian reports. Probability-weighted, not opinion-based.",
    href: "/platform/risk-intelligence",
    linkText: "See how scoring works",
  },
  {
    icon: <FileText className="size-6" />,
    title: "Digital Safety Binder",
    description:
      "Audit-ready documentation with SHA-256 hash-chain integrity. Every finding, every recommendation, every emergency contact, every risk score -- compiled into a tamper-evident binder that satisfies your board, your insurance carrier, and your legal team.",
    href: "/platform/safety-binder",
    linkText: "See a sample binder",
  },
] as const;

const PROCESS_STEPS = [
  {
    number: 1,
    title: "Submit Your Trip",
    description:
      "Enter destination, dates, participants, activities, and logistics through a guided form. Takes approximately 15 minutes.",
  },
  {
    number: 2,
    title: "Analyst Reviews Everything",
    description:
      "A trained safety analyst conducts a 17-section review using real-time government intelligence from 5 data sources. Delivered in 3-5 business days.",
  },
  {
    number: 3,
    title: "Receive Your Safety Binder",
    description:
      "Audit-ready documentation with every finding, recommendation, and risk score. Tamper-evident integrity via SHA-256 hash chain.",
  },
] as const;

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function PlatformOverviewPage() {
  return (
    <>
      {/* ================================================================
          SECTION 1: HERO
          ================================================================ */}
      <SectionContainer
        ariaLabelledBy="platform-hero-heading"
        className="relative overflow-hidden pb-12 pt-28 md:pb-16 md:pt-36 lg:pb-20 lg:pt-40"
      >
        {/* Dot grid background pattern */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-primary-300) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            opacity: 0.04,
          }}
          aria-hidden="true"
        />

        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            {/* Eyebrow */}
            <ScrollReveal variant="fadeIn">
              <Eyebrow
                color="primary"
                icon={<Shield className="size-4" />}
              >
                PLATFORM CAPABILITIES
              </Eyebrow>
            </ScrollReveal>

            {/* Headline */}
            <ScrollReveal variant="fadeUp" delay={0.1}>
              <h1
                id="platform-hero-heading"
                className="mx-auto mt-4 text-display-lg text-foreground"
                style={{ maxWidth: "28ch" }}
              >
                Professional safety review. Government intelligence. Audit-ready
                documentation.
              </h1>
            </ScrollReveal>

            {/* Subtext */}
            <ScrollReveal variant="fadeUp" delay={0.2}>
              <p
                className="mx-auto mt-6 text-body-lg text-muted-foreground"
                style={{ maxWidth: "55ch" }}
              >
                SafeTrekr combines a trained safety analyst, real-time
                government data, and tamper-evident documentation into a single
                platform -- so every trip your organization sends is reviewed,
                scored, and documented to an evidence-grade standard.
              </p>
            </ScrollReveal>

            {/* Dual CTAs */}
            <ScrollReveal variant="fadeUp" delay={0.3}>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/demo">
                    Get a Demo
                    <ArrowRight className="size-[18px]" />
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/how-it-works">See How It Works</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 2: FEATURE CARDS
          ================================================================ */}
      <SectionContainer
        variant="card"
        ariaLabelledBy="platform-features-heading"
      >
        <Container>
          {/* Section Header */}
          <ScrollReveal variant="fadeUp">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <Eyebrow
                color="primary"
                icon={<Eye className="size-4" />}
              >
                EXPLORE EACH CAPABILITY
              </Eyebrow>
              <h2
                id="platform-features-heading"
                className="mx-auto mt-4 text-display-md text-foreground"
                style={{ maxWidth: "30ch" }}
              >
                Three capabilities that work together to protect every trip your
                organization sends.
              </h2>
            </div>
          </ScrollReveal>

          {/* Feature Grid */}
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <FeatureGrid features={[...FEATURE_CARDS]} columns={3} />
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 3: HOW IT WORKS
          ================================================================ */}
      <SectionContainer ariaLabelledBy="platform-process-heading">
        <Container>
          {/* Section Header */}
          <ScrollReveal variant="fadeUp">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <Eyebrow
                color="primary"
                icon={<MapPin className="size-4" />}
              >
                THE SAFETREKR PROCESS
              </Eyebrow>
              <h2
                id="platform-process-heading"
                className="mx-auto mt-4 text-display-md text-foreground"
                style={{ maxWidth: "28ch" }}
              >
                From trip submission to safety binder in 3-5 business days.
              </h2>
              <p className="mx-auto mt-4 text-body-lg text-muted-foreground" style={{ maxWidth: "50ch" }}>
                Every trip follows the same rigorous process -- regardless of
                organization type, destination, or group size.
              </p>
            </div>
          </ScrollReveal>

          {/* Process Timeline */}
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <ProcessTimeline steps={[...PROCESS_STEPS]} />
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 4: CTA BAND (DARK)
          ================================================================ */}
      <CTABand
        variant="dark"
        headline="Ready to protect your next trip?"
        body="See how SafeTrekr delivers professional safety review, government intelligence, and audit-ready documentation for your organization."
        primaryCta={{ text: "Get a Demo", href: "/demo" }}
        secondaryCta={{ text: "View Pricing", href: "/pricing" }}
      />

      {/* ================================================================
          SECTION 5: STRUCTURED DATA
          ================================================================ */}
      <BreadcrumbJsonLd
        path="/platform"
        currentPageTitle="Platform Capabilities"
      />
    </>
  );
}
