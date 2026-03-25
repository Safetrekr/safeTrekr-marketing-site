/**
 * ST-889: Platform Feature Page (/platform/[slug])
 *
 * Dynamic route for individual platform capability deep-dive pages. Each page
 * provides a detailed exploration of a single SafeTrekr platform feature:
 * hero section, key capabilities grid, how-it-works process, and conversion
 * CTA. All pages are statically generated at build time via generateStaticParams.
 *
 * Slugs:
 *   - analyst-review    -- "Professional Analyst Review"
 *   - risk-intelligence -- "Real-Time Risk Intelligence"
 *   - safety-binder     -- "Digital Safety Binder"
 *
 * Server Component throughout. No client interactivity at the page level.
 *
 * Section order:
 *   1. Hero              -- Breadcrumb nav, eyebrow, headline, description, dual CTAs
 *   2. Key Capabilities  -- FeatureGrid (3-4 cards per feature)
 *   3. How It Works      -- 3-step ProcessTimeline specific to each feature
 *   4. CTA Band          -- Dark variant conversion band
 *   5. JSON-LD           -- BreadcrumbList structured data
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  ClipboardCheck,
  MapPin,
  Activity,
  FileText,
  Eye,
  Users,
  Building2,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Globe,
  Lock,
  Download,
  CheckCircle2,
  Zap,
  Database,
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
import type { FeatureGridItem } from "@/components/marketing";
import type { ProcessStep } from "@/components/marketing";

// ---------------------------------------------------------------------------
// Feature Data
// ---------------------------------------------------------------------------

interface FeaturePageData {
  /** Page title for metadata and heading. */
  title: string;
  /** Meta description for SERPs. */
  metaDescription: string;
  /** Eyebrow label above the hero headline. */
  eyebrow: string;
  /** Eyebrow icon. */
  eyebrowIcon: React.ReactNode;
  /** Hero headline (h1). */
  headline: string;
  /** Hero supporting paragraph. */
  heroDescription: string;
  /** Section header for the capabilities grid. */
  capabilitiesHeadline: string;
  /** Capabilities grid items. */
  capabilities: FeatureGridItem[];
  /** Section header for the process section. */
  processHeadline: string;
  /** Process section supporting text. */
  processDescription: string;
  /** Process timeline steps. */
  processSteps: ProcessStep[];
  /** CTA band headline. */
  ctaHeadline: string;
  /** CTA band body text. */
  ctaBody: string;
}

const FEATURES: Record<string, FeaturePageData> = {
  "analyst-review": {
    title: "Professional Analyst Review",
    metaDescription:
      "Every SafeTrekr trip is reviewed by a trained safety analyst across 17 dimensions. Venues, transportation, emergency planning, health advisories, and more -- professionally evaluated and documented.",
    eyebrow: "ANALYST REVIEW",
    eyebrowIcon: <ClipboardCheck className="size-4" />,
    headline: "Every Trip Reviewed by a Professional Safety Analyst",
    heroDescription:
      "Your trip leader focuses on the mission. Our analyst focuses on safety. Every trip goes through a rigorous 17-section review covering venues, lodging, transportation, emergency contacts, evacuation routes, local hospitals, weather windows, and more -- conducted by a trained professional, not an algorithm.",
    capabilitiesHeadline:
      "17 dimensions of safety. One professional review.",
    capabilities: [
      {
        icon: <Eye className="size-6" />,
        title: "17-Section Review Framework",
        description:
          "Every trip is evaluated across 17 standardized sections -- from venue safety and transportation to emergency medical facilities and communication infrastructure. Nothing is assumed. Everything is documented.",
      },
      {
        icon: <Users className="size-6" />,
        title: "Dedicated Analyst Assignment",
        description:
          "Each trip is assigned to a trained safety analyst who reviews every detail. Your analyst flags what needs attention, documents what is ready, and writes recommendations for every finding.",
      },
      {
        icon: <Building2 className="size-6" />,
        title: "Venue and Lodging Verification",
        description:
          "Every venue, lodging facility, and activity location is evaluated for structural safety, emergency egress, proximity to medical facilities, and historical incident records.",
      },
      {
        icon: <AlertTriangle className="size-6" />,
        title: "Emergency Preparedness Planning",
        description:
          "Evacuation routes, emergency medical facilities, communication infrastructure, and contingency plans -- all documented before your team departs. Preparation, not reaction.",
      },
    ],
    processHeadline: "How the analyst review works",
    processDescription:
      "From trip submission to completed review in 3-5 business days.",
    processSteps: [
      {
        number: 1,
        title: "Trip Details Submitted",
        description:
          "Your organization submits trip details through a guided form -- destination, dates, participants, activities, venues, and transportation. Takes approximately 15 minutes.",
      },
      {
        number: 2,
        title: "Analyst Conducts 17-Section Review",
        description:
          "A trained safety analyst reviews every dimension of your trip using government intelligence data. Venues verified. Routes assessed. Emergency plans documented. Recommendations written.",
      },
      {
        number: 3,
        title: "Findings Delivered in Safety Binder",
        description:
          "Every finding, recommendation, and risk score is compiled into your safety binder with tamper-evident audit trails. Board-ready. Insurance-ready. Evidence-grade.",
      },
    ],
    ctaHeadline: "See what a professional safety review looks like",
    ctaBody:
      "Request a demo to walk through a sample analyst review and safety binder for your organization type.",
  },

  "risk-intelligence": {
    title: "Real-Time Risk Intelligence",
    metaDescription:
      "SafeTrekr scores every destination using Monte Carlo simulation and 5 government intelligence sources: NOAA, USGS, CDC, GDACS, and ReliefWeb. Probability-weighted risk bands, not binary pass/fail.",
    eyebrow: "RISK INTELLIGENCE",
    eyebrowIcon: <Activity className="size-4" />,
    headline: "Government-Sourced Intelligence for Every Destination",
    heroDescription:
      "Before your team boards a plane, SafeTrekr pulls real-time safety data from NOAA, USGS, CDC, ReliefWeb, and GDACS -- the same sources humanitarian agencies use to assess field conditions. Every data point scored with Monte Carlo simulation so you understand probability, not just possibility.",
    capabilitiesHeadline:
      "Five government sources. One probability-weighted score.",
    capabilities: [
      {
        icon: <Database className="size-6" />,
        title: "5 Government Data Sources",
        description:
          "NOAA weather forecasts, USGS seismic monitoring, CDC health advisories, GDACS disaster alerts, and ReliefWeb humanitarian reports. Real intelligence, not a Google search.",
      },
      {
        icon: <BarChart3 className="size-6" />,
        title: "Monte Carlo Risk Scoring",
        description:
          "Each destination is scored using Monte Carlo simulation -- thousands of scenarios run to calculate probability-weighted risk bands. You see likelihood, not just possibility.",
      },
      {
        icon: <Globe className="size-6" />,
        title: "Destination-Specific Analysis",
        description:
          "Risk profiles are generated for your exact destination and travel dates. Weather patterns, seismic activity, disease advisories, and security conditions -- all specific to where and when your team will be.",
      },
      {
        icon: <Zap className="size-6" />,
        title: "Real-Time Data Refresh",
        description:
          "Intelligence data is pulled at the time of review and refreshed for active trips. Conditions change -- your risk intelligence keeps pace with morning and evening safety briefings during travel.",
      },
    ],
    processHeadline: "How risk intelligence is generated",
    processDescription:
      "From destination submission to scored risk profile in your safety binder.",
    processSteps: [
      {
        number: 1,
        title: "Intelligence Gathering",
        description:
          "Real-time data is pulled from 5 government sources for your specific destination and travel dates. Weather patterns, seismic risk, disease advisories, disaster alerts, and humanitarian conditions.",
      },
      {
        number: 2,
        title: "Monte Carlo Scoring",
        description:
          "Thousands of simulation scenarios calculate probability-weighted risk bands for each hazard category. Every risk is scored on likelihood and severity -- not just flagged as present or absent.",
      },
      {
        number: 3,
        title: "Analyst Interpretation",
        description:
          "Your safety analyst reviews the scored intelligence, adds contextual recommendations, and documents actionable findings. Data informs the review. The analyst makes the judgment.",
      },
    ],
    ctaHeadline: "See how risk intelligence protects your travelers",
    ctaBody:
      "Request a demo to see a live risk intelligence report for any destination your organization is considering.",
  },

  "safety-binder": {
    title: "Digital Safety Binder",
    metaDescription:
      "SafeTrekr delivers audit-ready safety documentation with SHA-256 hash-chain integrity. Every finding, recommendation, and risk score compiled into a tamper-evident binder for your board, insurance carrier, and legal team.",
    eyebrow: "SAFETY BINDER",
    eyebrowIcon: <FileText className="size-4" />,
    headline: "Audit-Ready Documentation for Every Trip",
    heroDescription:
      "When your board asks what you did to prepare, when your insurance carrier asks for a formal risk assessment, when a concerned parent asks how you evaluated the destination -- you hand them the binder. Every finding documented. Every data source cited. Every decision recorded with tamper-evident audit trails.",
    capabilitiesHeadline:
      "Every finding documented. Every decision recorded.",
    capabilities: [
      {
        icon: <Lock className="size-6" />,
        title: "SHA-256 Tamper-Evident Integrity",
        description:
          "Every review finding and analyst decision is recorded with cryptographic hash-chain integrity. The binder cannot be altered after completion without detection -- your documentation is evidence-grade.",
      },
      {
        icon: <FileText className="size-6" />,
        title: "Complete 17-Section Documentation",
        description:
          "All 17 review sections are compiled into a single, structured document. Findings, recommendations, risk scores, emergency contacts, maps, and evacuation routes -- everything in one place.",
      },
      {
        icon: <Download className="size-6" />,
        title: "Digital Delivery and PDF Export",
        description:
          "Your safety binder is delivered digitally through the SafeTrekr platform and can be exported as a PDF for your board, insurance carrier, legal team, or denominational leadership.",
      },
      {
        icon: <CheckCircle2 className="size-6" />,
        title: "Insurance and Compliance Ready",
        description:
          "Structured to satisfy the safety documentation requirements your insurance carrier needs. When carriers ask whether a formal risk assessment was conducted, the binder is your documented answer.",
      },
    ],
    processHeadline: "How your safety binder is built",
    processDescription:
      "From analyst review to documented, tamper-evident delivery.",
    processSteps: [
      {
        number: 1,
        title: "Findings Compiled",
        description:
          "As the analyst completes each of the 17 review sections, findings, recommendations, and risk scores are compiled into the binder structure. Every data source is cited.",
      },
      {
        number: 2,
        title: "Evidence Chain Sealed",
        description:
          "Every finding is recorded with a SHA-256 hash-chain audit trail. The completed binder is cryptographically sealed -- tamper-evident by design, not by policy.",
      },
      {
        number: 3,
        title: "Binder Delivered",
        description:
          "Your organization receives the complete safety binder digitally. Share it with your board, insurance carrier, legal team, or anyone who needs to review your safety preparation.",
      },
    ],
    ctaHeadline: "See what a safety binder looks like",
    ctaBody:
      "Request a demo to walk through a complete safety binder and understand what your organization receives for every trip.",
  },
};

// ---------------------------------------------------------------------------
// Static Params
// ---------------------------------------------------------------------------

const VALID_SLUGS = [
  "analyst-review",
  "risk-intelligence",
  "safety-binder",
] as const;

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const feature = FEATURES[slug];
  if (!feature) return {};

  return generatePageMetadata({
    title: feature.title,
    description: feature.metaDescription,
    path: `/platform/${slug}`,
  });
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function PlatformFeaturePage({ params }: PageProps) {
  const { slug } = await params;
  const feature = FEATURES[slug];

  if (!feature) {
    notFound();
  }

  return (
    <>
      {/* ================================================================
          SECTION 1: HERO
          ================================================================ */}
      <section
        id="hero"
        aria-label="Hero"
        className="bg-background pb-12 pt-8 sm:pb-16 sm:pt-12 md:pb-20 md:pt-16 lg:pb-28 lg:pt-20 xl:pb-36 xl:pt-28"
      >
        <Container>
          {/* Breadcrumb Navigation */}
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
                  href="/platform"
                  className="text-primary-700 hover:underline"
                >
                  Platform
                </Link>
              </li>
              <li aria-hidden="true" className="select-none">
                /
              </li>
              <li
                aria-current="page"
                className="font-medium text-foreground"
              >
                {feature.title}
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            {/* Eyebrow */}
            <ScrollReveal variant="fadeUp">
              <Eyebrow color="primary" icon={feature.eyebrowIcon}>
                {feature.eyebrow}
              </Eyebrow>
            </ScrollReveal>

            {/* Headline */}
            <ScrollReveal variant="fadeUp" delay={0.1}>
              <h1 className="mt-5 max-w-[24ch] text-display-xl text-foreground">
                {feature.headline}
              </h1>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal variant="fadeUp" delay={0.2}>
              <p className="mt-6 max-w-[55ch] text-body-lg text-muted-foreground">
                {feature.heroDescription}
              </p>
            </ScrollReveal>

            {/* Dual CTAs */}
            <ScrollReveal variant="fadeUp" delay={0.3}>
              <div className="mt-8 flex flex-col flex-wrap gap-4 sm:flex-row">
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
      </section>

      {/* ================================================================
          SECTION 2: KEY CAPABILITIES
          ================================================================ */}
      <SectionContainer
        variant="card"
        ariaLabelledBy={`${slug}-capabilities-heading`}
      >
        <Container>
          {/* Section Header */}
          <ScrollReveal variant="fadeUp">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <Eyebrow
                color="primary"
                icon={<Shield className="size-4" />}
              >
                KEY CAPABILITIES
              </Eyebrow>
              <h2
                id={`${slug}-capabilities-heading`}
                className="mx-auto mt-4 text-display-md text-foreground"
                style={{ maxWidth: "30ch" }}
              >
                {feature.capabilitiesHeadline}
              </h2>
            </div>
          </ScrollReveal>

          {/* Capabilities Grid */}
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <FeatureGrid
              features={feature.capabilities}
              columns={2}
            />
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 3: HOW IT WORKS
          ================================================================ */}
      <SectionContainer ariaLabelledBy={`${slug}-process-heading`}>
        <Container>
          {/* Section Header */}
          <ScrollReveal variant="fadeUp">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <Eyebrow
                color="primary"
                icon={<MapPin className="size-4" />}
              >
                HOW IT WORKS
              </Eyebrow>
              <h2
                id={`${slug}-process-heading`}
                className="mx-auto mt-4 text-display-md text-foreground"
                style={{ maxWidth: "28ch" }}
              >
                {feature.processHeadline}
              </h2>
              <p
                className="mx-auto mt-4 text-body-lg text-muted-foreground"
                style={{ maxWidth: "50ch" }}
              >
                {feature.processDescription}
              </p>
            </div>
          </ScrollReveal>

          {/* Process Timeline */}
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <ProcessTimeline steps={feature.processSteps} />
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 4: CTA BAND (DARK)
          ================================================================ */}
      <CTABand
        variant="dark"
        headline={feature.ctaHeadline}
        body={feature.ctaBody}
        primaryCta={{ text: "Get a Demo", href: "/demo" }}
        secondaryCta={{ text: "View Pricing", href: "/pricing" }}
      />

      {/* ================================================================
          SECTION 5: STRUCTURED DATA
          ================================================================ */}
      <BreadcrumbJsonLd
        path={`/platform/${slug}`}
        currentPageTitle={feature.title}
      />
    </>
  );
}
