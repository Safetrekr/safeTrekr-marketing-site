/**
 * ST-877: Solutions Overview Page (/solutions)
 *
 * Top-of-funnel routing page that directs visitors to segment-specific
 * landing pages (K-12, Higher Ed, Churches, Corporate). Establishes
 * SafeTrekr as a platform that serves multiple organization types with
 * the same professional safety review standard.
 *
 * Section order:
 *   1. Hero            -- "One platform. Every type of trip." + scroll anchor CTA
 *   2. Segment Cards   -- 4 large segment cards (2x2 grid) with regulatory badges
 *   3. Universal Value -- 3 FeatureCards (Analyst Review, Risk Intelligence, Safety Binder)
 *   4. TrustStrip      -- 5 metrics + intel source bar
 *   5. CTABand         -- Dark variant, demo + how-it-works
 *   6. JSON-LD         -- WebPage + ItemList structured data
 *
 * @see designs/html/mockup-solutions-overview.html
 */

import Link from "next/link";
import {
  GraduationCap,
  Building2,
  Heart,
  Building,
  ClipboardCheck,
  Route,
  FileText,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import { JsonLd, type JsonLdData } from "@/lib/structured-data";
import { SectionContainer } from "@/components/layout/section-container";
import { Container } from "@/components/layout/container";
import {
  Eyebrow,
  FeatureCard,
  TrustStrip,
  CTABand,
} from "@/components/marketing";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { StaggerChildren } from "@/components/motion/stagger-children";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "Solutions by Organization Type",
  description:
    "SafeTrekr serves K-12 schools, higher education, churches, corporations, and sports organizations. Find professional trip planning for your organization's needs.",
  path: "/solutions",
  ogImage: "/images/og-solutions.png",
});

// ---------------------------------------------------------------------------
// Structured Data
// ---------------------------------------------------------------------------

function generateSolutionsPageSchema(): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Solutions - SafeTrekr",
        description:
          "SafeTrekr provides professional trip safety review and evidence documentation for K-12 schools, higher education, churches, and corporate organizations.",
        url: "https://safetrekr.com/solutions",
        isPartOf: {
          "@type": "WebSite",
          name: "SafeTrekr",
          url: "https://safetrekr.com",
        },
      },
      {
        "@type": "ItemList",
        name: "SafeTrekr Solutions by Organization Type",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "K-12 Schools and Districts",
            url: "https://safetrekr.com/solutions/k12",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Higher Education",
            url: "https://safetrekr.com/solutions/higher-education",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Churches and Mission Organizations",
            url: "https://safetrekr.com/solutions/churches",
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Corporate and Sports Teams",
            url: "https://safetrekr.com/solutions/corporate",
          },
        ],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Data: Segment Cards
// ---------------------------------------------------------------------------

interface SolutionSegment {
  icon: React.ReactNode;
  title: string;
  badges: string[];
  description: string;
  href: string;
}

const SEGMENTS: SolutionSegment[] = [
  {
    icon: <GraduationCap className="size-7" />,
    title: "K-12 Schools and Districts",
    badges: ["FERPA", "COPPA"],
    description:
      "Field trip planning that supports educational excellence. Professional analyst evaluation of every destination with documentation that demonstrates thorough preparation. From $15 per student.",
    href: "/solutions/k12",
  },
  {
    icon: <Building2 className="size-7" />,
    title: "Higher Education",
    badges: ["CLERY ACT", "FERPA"],
    description:
      "Study abroad and faculty travel with institutional-grade documentation. Professional assessment that supports accountability for general counsel and risk management.",
    href: "/solutions/higher-education",
  },
  {
    icon: <Heart className="size-7" />,
    title: "Churches and Mission Organizations",
    badges: ["DUTY OF CARE"],
    description:
      "Mission trip preparation that honors your calling. Simple guidance for volunteer leaders with documentation that demonstrates good stewardship.",
    href: "/solutions/churches",
  },
  {
    icon: <Building className="size-7" />,
    title: "Corporate",
    badges: ["DUTY OF CARE", "OSHA"],
    description:
      "Business travel planning with clear accountability. Professional preparation for mid-market companies without dedicated risk management staff.",
    href: "/solutions/corporate",
  },
];

// ---------------------------------------------------------------------------
// Data: Universal Value Cards
// ---------------------------------------------------------------------------

const UNIVERSAL_VALUE_CARDS = [
  {
    icon: <ClipboardCheck className="size-6" />,
    title: "17-Section Professional Review",
    description:
      "A trained safety professional reviews every trip your organization takes -- across 17 dimensions, from venue safety to emergency evacuation planning. No algorithms. No automation. A real professional who flags what needs attention and documents what is ready.",
    href: "/platform/analyst-review",
    linkText: "Explore the review process",
  },
  {
    icon: <Route className="size-6" />,
    title: "Current Safety Information",
    description:
      "Active intelligence monitoring from multiple trusted sources including government, humanitarian, and regional data. Professionally evaluated by experienced analysts, not automation.",
    href: "/platform/risk-intelligence",
    linkText: "See how assessment works",
  },
  {
    icon: <FileText className="size-6" />,
    title: "Trip Safety Binder",
    description:
      "Board-ready documentation with professional standards. Every finding, every recommendation, every emergency contact -- compiled into a comprehensive binder that demonstrates preparation to your board, insurance carrier, and stakeholders.",
    href: "/platform/safety-binder",
    linkText: "See a sample binder",
  },
] as const;

// ---------------------------------------------------------------------------
// Sub-Components
// ---------------------------------------------------------------------------

/**
 * Large segment card with regulatory badges for the solutions overview grid.
 * Renders as a full-card link with hover effects matching the mockup.
 */
function SolutionSegmentCard({ segment }: { segment: SolutionSegment }) {
  return (
    <Link
      href={segment.href}
      aria-label={`Learn more about SafeTrekr solutions for ${segment.title.toLowerCase()}`}
      className="group flex flex-col rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-sm)] transition-all duration-200 ease-[var(--ease-default)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-xl)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:p-10"
      style={{ minHeight: 320 }}
    >
      {/* Icon */}
      <div
        className="flex size-14 items-center justify-center rounded-xl bg-primary-50 text-primary-700"
        aria-hidden="true"
      >
        <span className="[&_svg]:size-7">{segment.icon}</span>
      </div>

      {/* Title */}
      <h3 className="text-heading-lg mt-5 text-card-foreground transition-colors duration-200 ease-[var(--ease-default)] group-hover:text-primary-700">
        {segment.title}
      </h3>

      {/* Regulatory Badges */}
      <div className="mt-3 flex flex-wrap gap-2">
        {segment.badges.map((badge) => (
          <span
            key={badge}
            className="inline-flex items-center rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-foreground"
          >
            {badge}
          </span>
        ))}
      </div>

      {/* Description */}
      <p
        className="text-body-md mt-4 text-muted-foreground"
        style={{ maxWidth: "45ch" }}
      >
        {segment.description}
      </p>

      {/* CTA indicator */}
      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-body-md font-semibold text-primary-700">
        Learn More
        <ArrowRight
          className="size-4 transition-transform duration-200 ease-[var(--ease-default)] group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function SolutionsOverviewPage() {
  return (
    <>
      {/* ================================================================
          SECTION 1: HERO
          ================================================================ */}
      <SectionContainer
        ariaLabelledBy="hero-heading"
        className="relative overflow-hidden pt-28 pb-12 md:pt-36 md:pb-16 lg:pt-40 lg:pb-20"
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
                icon={<Building2 className="size-4" />}
              >
                SOLUTIONS BY ORGANIZATION TYPE
              </Eyebrow>
            </ScrollReveal>

            {/* Headline */}
            <ScrollReveal variant="fadeUp" delay={0.1}>
              <h1
                id="hero-heading"
                className="text-display-lg mx-auto mt-4 text-foreground"
                style={{ maxWidth: "28ch" }}
              >
                Professional trip planning for every organization.
              </h1>
            </ScrollReveal>

            {/* Subtext */}
            <ScrollReveal variant="fadeUp" delay={0.2}>
              <p
                className="text-body-lg mx-auto mt-6 text-muted-foreground"
                style={{ maxWidth: "55ch" }}
              >
                SafeTrekr delivers comprehensive professional reviews to
                every organization -- but the context matters. Schools need
                student privacy considerations. Churches need stewardship
                framing. Corporations need accountability documentation. Find
                your solution below.
              </p>
            </ScrollReveal>

            {/* Scroll Anchor CTA */}
            <ScrollReveal variant="fadeUp" delay={0.3}>
              <div className="mt-8">
                <Link
                  href="#segment-cards"
                  className="inline-flex items-center gap-2 font-display text-base font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  Find Your Solution
                  <ChevronDown className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 2: SEGMENT CARDS
          ================================================================ */}
      <SectionContainer
        id="segment-cards"
        variant="card"
        ariaLabelledBy="segment-cards-heading"
      >
        <h2 id="segment-cards-heading" className="sr-only">
          Solutions by organization type
        </h2>

        <Container>
          <StaggerChildren className="grid gap-4 md:grid-cols-2 md:gap-6 lg:gap-8">
            {SEGMENTS.map((segment, index) => (
              <ScrollReveal
                key={segment.title}
                variant="cardReveal"
                delay={index * 0.1}
              >
                <SolutionSegmentCard segment={segment} />
              </ScrollReveal>
            ))}
          </StaggerChildren>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 3: UNIVERSAL VALUE PROPOSITION
          ================================================================ */}
      <SectionContainer
        variant="brand"
        ariaLabelledBy="universal-value-heading"
      >
        <Container>
          {/* Section Header */}
          <ScrollReveal variant="fadeUp">
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow
                color="primary"
                icon={<ShieldCheck className="size-4" />}
              >
                INCLUDED WITH EVERY TRIP
              </Eyebrow>
              <h2
                id="universal-value-heading"
                className="text-display-md mx-auto mt-4 text-foreground"
                style={{ maxWidth: "28ch" }}
              >
                Regardless of your organization type, every trip receives the
                same standard of professional safety review.
              </h2>
            </div>
          </ScrollReveal>

          {/* Value Cards Grid */}
          <StaggerChildren className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {UNIVERSAL_VALUE_CARDS.map((card, index) => (
              <ScrollReveal
                key={card.title}
                variant="cardReveal"
                delay={index * 0.08}
                className={
                  index === 2
                    ? "sm:col-span-2 sm:mx-auto sm:max-w-md lg:col-span-1 lg:max-w-none"
                    : ""
                }
              >
                <FeatureCard
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  href={card.href}
                  linkText={card.linkText}
                />
              </ScrollReveal>
            ))}
          </StaggerChildren>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 4: TRUST STRIP
          ================================================================ */}
      <ScrollReveal variant="fadeUp">
        <TrustStrip />
      </ScrollReveal>

      {/* ================================================================
          SECTION 5: CTA BAND (DARK)
          ================================================================ */}
      <CTABand
        variant="dark"
        headline="Not sure which solution is right for you?"
        body="Schedule a walkthrough and we'll show you SafeTrekr tailored to your organization type."
        primaryCta={{ text: "Schedule a Walkthrough", href: "/demo" }}
        secondaryCta={{ text: "Contact Us", href: "/contact" }}
      />

      {/* ================================================================
          SECTION 6: JSON-LD STRUCTURED DATA
          ================================================================ */}
      <JsonLd data={generateSolutionsPageSchema()} />
    </>
  );
}
