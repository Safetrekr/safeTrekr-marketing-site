/**
 * ST-889: Platform Feature Page (/platform/[slug])
 *
 * Dynamic route for individual platform capability deep-dive pages. Each page
 * provides a detailed exploration of a single SafeTrekr platform feature:
 * hero section, key capabilities grid, how-it-works process, and conversion
 * CTA. All pages are statically generated at build time via generateStaticParams.
 *
 * Slugs:
 *   - analyst-review   , "Professional Analyst Review"
 *   - risk-intelligence, "Real-Time Risk Intelligence"
 *   - safety-binder    , "Digital Safety Binder"
 *
 * Server Component throughout. No client interactivity at the page level.
 *
 * Section order:
 *   1. Hero             , Breadcrumb nav, eyebrow, headline, description, dual CTAs
 *   2. Key Capabilities , FeatureGrid (3-4 cards per feature)
 *   3. How It Works     , 3-step ProcessTimeline specific to each feature
 *   4. CTA Band         , Dark variant conversion band
 *   5. JSON-LD          , BreadcrumbList structured data
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
      "Every SafeTrekr trip is reviewed by a trained safety analyst across comprehensive standardized sections. Venues, transportation, emergency planning, health considerations, and more, professionally evaluated and documented.",
    eyebrow: "ANALYST REVIEW",
    eyebrowIcon: <ClipboardCheck className="size-4" />,
    headline: "Every Trip Reviewed by a Professional Safety Analyst",
    heroDescription:
      "Every trip is reviewed by former Secret Service, Special Operations, and trained safety staff analyzing all aspects of the trip safety and intelligence. Assessments by professionals, not automation.",
    capabilitiesHeadline:
      "Comprehensive review. Professional standards.",
    capabilities: [
      {
        icon: <Eye className="size-6" />,
        title: "Comprehensive Review Framework",
        description:
          "Every trip is evaluated across standardized sections, from venue assessment and transportation to emergency medical facilities and communication infrastructure. Nothing is assumed. Everything is documented.",
      },
      {
        icon: <Users className="size-6" />,
        title: "Dedicated Analyst Assignment",
        description:
          "Each trip is assigned to a trained safety analyst who reviews every detail. Your analyst identifies what needs attention, documents what is ready, and writes recommendations for every finding.",
      },
      {
        icon: <Building2 className="size-6" />,
        title: "Venue and Lodging Verification",
        description:
          "Every venue, lodging facility, and activity location is evaluated for safety considerations, emergency egress, proximity to medical facilities, and relevant history.",
      },
      {
        icon: <AlertTriangle className="size-6" />,
        title: "Emergency Preparedness Documentation",
        description:
          "Evacuation routes, emergency medical facilities, communication infrastructure, and contingency considerations, all documented before your team departs. Preparation, not reaction.",
      },
    ],
    processHeadline: "How the analyst review works",
    processDescription:
      "From trip details to organized safety plan, quickly.",
    processSteps: [
      {
        number: 1,
        title: "Enter Trip Details",
        description:
          "Enter all of your trip details and activities through a self-guided form.",
      },
      {
        number: 2,
        title: "Expert Analyst Review",
        description:
          "Our highly trained and dedicated safety analyst reviews your trip using the most current information, providing the highest quality travel safety plan in the industry.",
      },
      {
        number: 3,
        title: "Safety Binder Delivered",
        description:
          "Your organization receives a digitized interactive or printed safety binder for organized and easy reference. Share with leadership, parents, or stakeholders.",
      },
    ],
    ctaHeadline: "See what a professional safety review looks like",
    ctaBody:
      "Schedule a walkthrough to see a sample analyst review for your organization type.",
  },

  "risk-intelligence": {
    title: "Current Safety Information",
    metaDescription:
      "SafeTrekr assesses every destination using structured methodology and authoritative government data sources. Probability-based assessment, not binary pass/fail.",
    eyebrow: "SAFETY INFORMATION",
    eyebrowIcon: <Activity className="size-4" />,
    headline: "Current Information for Every Destination",
    heroDescription:
      "Before your team departs, SafeTrekr gathers current safety information from multiple sources to include NOAA, USGS, CDC, ReliefWeb, and GDACS, the same sources professionals use to assess conditions. Structured assessment methodology so you understand context, not just yes/no flags.",
    capabilitiesHeadline:
      "Authoritative sources. Structured assessment.",
    capabilities: [
      {
        icon: <Database className="size-6" />,
        title: "Government & Authoritative Sources",
        description:
          "Weather forecasts, geological monitoring, health advisories, humanitarian alerts, and regional reports from official government and international sources. Professional information, not web searches.",
      },
      {
        icon: <BarChart3 className="size-6" />,
        title: "Structured Assessment",
        description:
          "Each destination is assessed using structured methodology, conditions evaluated in context rather than binary pass/fail. You see the full picture, not just flags.",
      },
      {
        icon: <Globe className="size-6" />,
        title: "Destination-Specific Analysis",
        description:
          "Assessment profiles are generated for your exact destination and travel dates. Weather patterns, geological considerations, health advisories, and regional conditions, all specific to where and when your team will be.",
      },
      {
        icon: <Zap className="size-6" />,
        title: "Current Data Gathering",
        description:
          "Information is gathered at the time of review and reflects current conditions. For active trips with monitoring, briefings keep your team informed as conditions evolve.",
      },
    ],
    processHeadline: "How safety information is gathered",
    processDescription:
      "From destination submission to assessed profile delivered to your team.",
    processSteps: [
      {
        number: 1,
        title: "Information Gathering",
        description:
          "Current data is gathered from multiple trusted sources for your specific destination and travel dates. Weather patterns, geological considerations, health advisories, safety alerts, and regional conditions.",
      },
      {
        number: 2,
        title: "Structured Assessment",
        description:
          "Information is evaluated using structured assessment methodology. Each consideration is assessed in context, not just flagged as present or absent.",
      },
      {
        number: 3,
        title: "Analyst Interpretation",
        description:
          "Your professional safety analyst reviews the gathered information, adds recommendations, and documents actionable findings.",
      },
    ],
    ctaHeadline: "See how safety information supports your planning",
    ctaBody:
      "Schedule a walkthrough to see an information report for any destination your organization is considering.",
  },

  "safety-binder": {
    title: "SafeTrekr Traveler App",
    metaDescription:
      "SafeTrekr delivers complete safety documentation through the Traveler app. Every finding, recommendation, and contact available on any device with offline access.",
    eyebrow: "TRAVELER APP",
    eyebrowIcon: <FileText className="size-4" />,
    headline: "Everything Your Travelers Need, On Any Device",
    heroDescription:
      "Every finding, every contact, every recommendation, delivered through the SafeTrekr Traveler app. Works on phones, tablets, and laptops. Available offline when connectivity is limited. Printable when your team prefers paper. Your preparation, always accessible.",
    capabilitiesHeadline:
      "Complete preparation. Always accessible.",
    capabilities: [
      {
        icon: <Globe className="size-6" />,
        title: "Works On Any Device",
        description:
          "Access your trip information from any smartphone, tablet, or laptop. No app store downloads required, works directly in the browser with full functionality across all platforms.",
      },
      {
        icon: <Download className="size-6" />,
        title: "Offline Access",
        description:
          "Download your trip information for offline access. When connectivity is limited or unavailable, your team still has everything they need, emergency contacts, maps, recommendations, and more.",
      },
      {
        icon: <FileText className="size-6" />,
        title: "Printable Documentation",
        description:
          "Prefer paper? Export and print your complete trip documentation. Perfect for chaperones, trip binders, and organizations that want physical backup copies.",
      },
      {
        icon: <CheckCircle2 className="size-6" />,
        title: "Stakeholder-Ready Reports",
        description:
          "Generate formatted reports for your board, insurance carrier, leadership, or stakeholders. When they ask what preparation was completed, you have organized documentation ready to share.",
      },
    ],
    processHeadline: "How your team accesses trip information",
    processDescription:
      "From analyst review to instant access for every traveler.",
    processSteps: [
      {
        number: 1,
        title: "Review Completed",
        description:
          "As the analyst completes each review section, findings, recommendations, and assessments are compiled and organized. Every data source is cited.",
      },
      {
        number: 2,
        title: "App Access Configured",
        description:
          "Your organization configures who receives access, trip leaders, chaperones, participants, or administrators. Each person gets secure access to the information they need.",
      },
      {
        number: 3,
        title: "Information Delivered",
        description:
          "Travelers receive a link to access their trip information. Works immediately on any device. Download for offline use or print for physical copies.",
      },
    ],
    ctaHeadline: "See the Traveler app in action",
    ctaBody:
      "Schedule a walkthrough to experience the Traveler app and see what your team receives for every trip.",
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
        className="bg-background pt-12 pb-10 sm:pt-16 sm:pb-12 lg:pt-20 lg:pb-16"
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
                    Schedule a Walkthrough
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
        primaryCta={{ text: "Schedule a Walkthrough", href: "/demo" }}
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
