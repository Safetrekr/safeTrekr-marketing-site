/**
 * ST-883: About Page (/about)
 *
 * Editorial narrative page that establishes SafeTrekr's origin story,
 * methodology, team, and mission. Builds trust through transparency --
 * verifiable numbers, real credentials, and a clear founding narrative.
 *
 * Section order:
 *   1. Hero             -- Editorial text-only hero
 *   2. The Problem      -- "A Spreadsheet and a Prayer" narrative + blockquote
 *   3. Route Divider    -- Decorative SVG divider
 *   4. Our Approach     -- 3 pillar cards (Analyst, Intelligence, Documentation)
 *   5. The Team         -- Founder card + analyst team card
 *   6. By the Numbers   -- Dark section with 5 stat cards + 2 secondary metrics
 *   7. Our Mission      -- Mission + vision statements
 *   8. Trusted By       -- 4 org type cards
 *   9. CTABand          -- Dark variant
 *  10. JSON-LD          -- Organization structured data
 *
 * @see designs/html/mockup-about.html
 */

import Link from "next/link";
import {
  BookOpen,
  ClipboardCheck,
  Shield,
  FileText,
  GraduationCap,
  Heart,
  Building2,
  ArrowRight,
} from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import {
  JsonLd,
  generateOrganizationSchema,
} from "@/lib/structured-data";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { SectionContainer } from "@/components/layout/section-container";
import { Container } from "@/components/layout/container";
import { Eyebrow, CTABand } from "@/components/marketing";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { StaggerChildren } from "@/components/motion/stagger-children";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "About SafeTrekr",
  description:
    "SafeTrekr was built to close the gap between aviation-grade safety and what schools, churches, and businesses do for group travel. Professional analyst review. Government intelligence. Documented evidence.",
  path: "/about",
  ogImage: "/images/og-about.png",
});

// ---------------------------------------------------------------------------
// Data: Approach Pillar Cards
// ---------------------------------------------------------------------------

const APPROACH_PILLARS = [
  {
    icon: <ClipboardCheck className="size-6" />,
    title: "Professional Analyst Review",
    description:
      "Every trip is reviewed by a trained safety analyst across 17 standardized sections. Not AI. Not a checklist. A human expert with real accountability.",
  },
  {
    icon: <Shield className="size-6" />,
    title: "Government Intelligence Data",
    description:
      "We monitor 5 government intelligence sources and 250+ API endpoints to build real-time risk profiles for every destination your team visits.",
  },
  {
    icon: <FileText className="size-6" />,
    title: "Tamper-Evident Documentation",
    description:
      "Every binder is sealed with SHA-256 hash chain integrity -- tamper-proof evidence that proves due diligence was performed, timestamped and court-admissible.",
  },
] as const;

// ---------------------------------------------------------------------------
// Data: Stats
// ---------------------------------------------------------------------------

interface StatCard {
  value: string;
  label: string;
  ariaLabel: string;
}

const PRIMARY_STATS: StatCard[] = [
  {
    value: "104",
    label: "Organizations Served",
    ariaLabel: "104 organizations served",
  },
  {
    value: "5",
    label: "Government Intel Sources",
    ariaLabel: "5 government intelligence sources",
  },
  {
    value: "17",
    label: "Review Sections Per Trip",
    ariaLabel: "17 review sections per trip",
  },
  {
    value: "250+",
    label: "API Endpoints Monitored",
    ariaLabel: "More than 250 API endpoints monitored",
  },
  {
    value: "3-5",
    label: "Day Turnaround",
    ariaLabel: "3 to 5 day turnaround",
  },
];

const SECONDARY_METRICS = [
  { value: "AES-256", label: "Encryption Standard" },
  { value: "SHA-256", label: "Evidence Chain" },
];

// ---------------------------------------------------------------------------
// Data: Trusted By
// ---------------------------------------------------------------------------

interface OrgType {
  icon: React.ReactNode;
  name: string;
  subtitle: string;
}

const ORG_TYPES: OrgType[] = [
  {
    icon: <GraduationCap className="size-6" />,
    name: "K-12 Schools",
    subtitle: "Districts & independent schools",
  },
  {
    icon: <BookOpen className="size-6" />,
    name: "Higher Education",
    subtitle: "Universities & colleges",
  },
  {
    icon: <Heart className="size-6" />,
    name: "Churches & Missions",
    subtitle: "Congregations & mission organizations",
  },
  {
    icon: <Building2 className="size-6" />,
    name: "Corporate & Sports",
    subtitle: "Businesses, leagues, & sports teams",
  },
];

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function AboutPage() {
  return (
    <>
      {/* ST-904/ST-905: BreadcrumbList JSON-LD for about page */}
      <BreadcrumbJsonLd path="/about" currentPageTitle="About SafeTrekr" />

      {/* ================================================================
          SECTION 1: HERO (Editorial, text-only)
          ================================================================ */}
      <SectionContainer
        ariaLabelledBy="about-hero-heading"
        className="pt-24 pb-20 lg:pt-32 lg:pb-28 xl:pt-36 xl:pb-32"
      >
        <Container>
          {/* Eyebrow */}
          <ScrollReveal variant="fadeUp">
            <Eyebrow color="primary" icon={<BookOpen className="size-3.5" />}>
              OUR STORY
            </Eyebrow>
          </ScrollReveal>

          {/* Headline */}
          <ScrollReveal variant="fadeUp" delay={0.08}>
            <h1
              id="about-hero-heading"
              className="text-display-lg mt-4 text-foreground"
              style={{ maxWidth: "20ch" }}
            >
              We Believe Every Trip Deserves the Same Safety Rigor as a Flight.
            </h1>
          </ScrollReveal>

          {/* Sub-headline */}
          <ScrollReveal variant="fadeUp" delay={0.16}>
            <p className="text-body-lg mt-6 max-w-prose text-muted-foreground lg:mt-8">
              Schools send students on field trips with a permission slip and a
              prayer. Churches send mission teams to foreign countries with a
              spreadsheet. Every day, airlines subject flight plans to rigorous
              safety review&mdash;but group travel gets nothing. We started
              SafeTrekr to change that.
            </p>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 2: THE PROBLEM WE SAW
          ================================================================ */}
      <SectionContainer
        variant="card"
        ariaLabelledBy="founding-narrative-heading"
        className="py-16 sm:py-20 md:py-24 lg:py-32"
      >
        <Container size="sm" className="max-w-3xl">
          {/* Eyebrow */}
          <ScrollReveal variant="fadeUp">
            <Eyebrow color="primary">THE PROBLEM WE SAW</Eyebrow>
          </ScrollReveal>

          {/* Headline */}
          <ScrollReveal variant="fadeUp" delay={0.08}>
            <h2
              id="founding-narrative-heading"
              className="text-heading-lg mt-4 text-foreground"
            >
              A Spreadsheet and a Prayer
            </h2>
          </ScrollReveal>

          {/* Body content */}
          <div className="mt-8 space-y-6 lg:mt-10">
            <ScrollReveal variant="fadeUp" delay={0.16} as="p">
              <span className="text-body-lg max-w-prose text-muted-foreground">
                Every year, millions of people travel in organized
                groups&mdash;school field trips, church mission teams, university
                study abroad cohorts, corporate retreats. These trips carry real
                risk: unfamiliar destinations, group logistics, medical
                emergencies, political instability, natural disasters.
              </span>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.24} as="p">
              <span className="text-body-lg max-w-prose text-muted-foreground">
                Yet the safety planning for most of these trips amounts to a
                spreadsheet, a Google search, and the hope that nothing goes
                wrong. No professional risk assessment. No government
                intelligence. No documented evidence of due diligence. Nothing
                that would survive a courtroom.
              </span>
            </ScrollReveal>

            {/* Pull Quote */}
            <ScrollReveal
              variant="fadeUp"
              delay={0.2}
              as="blockquote"
            >
              <div
                className="my-10 border-l-4 border-primary-500 pl-6 lg:my-12 lg:pl-8"
                style={{ maxWidth: "45ch" }}
              >
                <p className="text-heading-md italic text-primary-700">
                  &ldquo;Airlines wouldn&rsquo;t dream of flying a route without
                  professional safety review. Why do we accept less for our
                  students, congregations, and employees?&rdquo;
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.32} as="p">
              <span className="text-body-lg max-w-prose font-medium text-foreground">
                We built SafeTrekr to close that gap&mdash;to bring
                professional-grade safety analysis to every organization that
                sends people on trips.
              </span>
            </ScrollReveal>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          ROUTE DIVIDER (decorative)
          ================================================================ */}
      <div
        className="flex justify-center bg-background"
        aria-hidden="true"
      >
        <svg
          className="h-10 w-full max-w-[600px]"
          viewBox="0 0 600 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M0 20 C150 0, 200 40, 300 20 S450 0, 600 20"
            stroke="var(--color-primary-200)"
            strokeWidth="2"
            strokeOpacity="0.3"
            fill="none"
          />
        </svg>
      </div>

      {/* ================================================================
          SECTION 3: OUR APPROACH
          ================================================================ */}
      <SectionContainer ariaLabelledBy="approach-heading">
        <Container>
          {/* Section Header */}
          <ScrollReveal variant="fadeUp">
            <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
              <Eyebrow color="primary">OUR APPROACH</Eyebrow>
              <h2
                id="approach-heading"
                className="text-display-md mx-auto mt-4 text-foreground"
                style={{ maxWidth: "28ch" }}
              >
                Three Pillars. Zero Guesswork.
              </h2>
              <p className="text-body-lg mx-auto mt-4 max-w-prose text-muted-foreground">
                Every SafeTrekr binder is built on the same three non-negotiable
                foundations.
              </p>
            </div>
          </ScrollReveal>

          {/* 3 Pillar Cards */}
          <StaggerChildren className="grid gap-6 sm:grid-cols-3 lg:gap-8">
            {APPROACH_PILLARS.map((pillar, index) => (
              <ScrollReveal
                key={pillar.title}
                variant="fadeUp"
                delay={index * 0.08}
              >
                <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <div
                    className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary-50"
                    aria-hidden="true"
                  >
                    <span className="text-primary-700 [&_svg]:size-6">
                      {pillar.icon}
                    </span>
                  </div>
                  <h3 className="text-heading-sm text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="text-body-md mt-3 text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </StaggerChildren>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 4: THE TEAM
          ================================================================ */}
      <SectionContainer
        variant="card"
        ariaLabelledBy="team-heading"
        className="py-16 sm:py-20 md:py-24 lg:py-32"
      >
        <Container>
          {/* Section Header */}
          <div className="mb-10 lg:mb-12">
            <ScrollReveal variant="fadeUp">
              <Eyebrow color="primary">THE TEAM</Eyebrow>
            </ScrollReveal>
            <ScrollReveal variant="fadeUp" delay={0.08}>
              <h2
                id="team-heading"
                className="text-heading-lg mt-4 text-foreground"
              >
                Real People. Real Credentials.
              </h2>
            </ScrollReveal>
          </div>

          {/* Team Cards Grid */}
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Founder Card */}
            <ScrollReveal variant="fadeUp" delay={0.16}>
              <div className="rounded-xl border border-border bg-white p-8 shadow-[var(--shadow-sm)]">
                {/* Avatar Placeholder */}
                <div
                  className="mb-6 flex size-20 items-center justify-center rounded-full bg-primary-50"
                  aria-hidden="true"
                >
                  <span className="text-heading-md font-bold text-primary-700">
                    MD
                  </span>
                </div>
                <h3 className="text-heading-sm text-foreground">
                  Mike Dawson
                </h3>
                <p className="text-body-sm mb-4 text-muted-foreground">
                  Founder &amp; CEO
                </p>
                <p
                  className="text-body-md text-muted-foreground"
                  style={{ maxWidth: "45ch" }}
                >
                  Mike Dawson founded SafeTrekr after a career in the United
                  States Secret Service, where he spent years planning and
                  executing protective operations for some of the most
                  high-stakes travel in the world. He built SafeTrekr to bring
                  that same level of professional safety analysis to every
                  organization that takes people off-site.
                </p>
              </div>
            </ScrollReveal>

            {/* Analyst Team Card */}
            <ScrollReveal variant="fadeUp" delay={0.24}>
              <div className="rounded-xl border border-border bg-white p-8 shadow-[var(--shadow-sm)]">
                {/* Shield Icon Composition */}
                <div
                  className="mb-6 flex size-16 items-center justify-center rounded-xl bg-primary-50"
                  aria-hidden="true"
                >
                  <Shield className="size-8 text-primary-700" />
                </div>
                <h3 className="text-heading-sm mb-3 text-foreground">
                  Our Safety Analysts
                </h3>
                <p
                  className="text-body-md mb-4 text-muted-foreground"
                  style={{ maxWidth: "45ch" }}
                >
                  Every trip binder is reviewed by a credentialed safety analyst
                  with expertise in travel risk assessment, regulatory
                  compliance, and emergency planning.
                </p>
                <p className="text-body-md mb-6 font-medium italic text-foreground">
                  &ldquo;Our analysts have reviewed trips across 47 countries for
                  12 organization types.&rdquo;
                </p>
                <Link
                  href="/about/analysts"
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700"
                  aria-label="Meet our safety analysts -- view full team profiles"
                >
                  Meet Our Analysts
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 5: BY THE NUMBERS (DARK)
          ================================================================ */}
      <SectionContainer
        variant="dark"
        ariaLabelledBy="metrics-heading"
        className="py-20 sm:py-24 lg:py-32"
      >
        <Container>
          {/* Section Header */}
          <ScrollReveal variant="fadeUp">
            <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
              <Eyebrow color="dark">BY THE NUMBERS</Eyebrow>
              <h2
                id="metrics-heading"
                className="text-display-md mx-auto mt-4 text-white"
                style={{ maxWidth: "28ch" }}
              >
                Verifiable. Not Vanity.
              </h2>
              <p className="text-body-lg mx-auto mt-4 max-w-prose text-[var(--color-secondary-muted)]">
                Every number on this page comes from our production database. We
                don&rsquo;t do inflated marketing metrics.
              </p>
            </div>
          </ScrollReveal>

          {/* Primary Stat Cards Grid (5 columns) */}
          <StaggerChildren className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {PRIMARY_STATS.map((stat, index) => (
              <ScrollReveal
                key={stat.label}
                variant="fadeUp"
                delay={index * 0.08}
              >
                <div
                  className="rounded-xl p-6 text-center"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <span
                    className="text-display-md block font-mono text-white tabular-nums"
                    aria-label={stat.ariaLabel}
                  >
                    {stat.value}
                  </span>
                  <span className="text-eyebrow mt-2 block text-[var(--color-secondary-muted)]">
                    {stat.label}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </StaggerChildren>

          {/* Secondary Metrics Row */}
          <ScrollReveal variant="fadeUp" delay={0.4}>
            <div className="mt-8 flex flex-wrap justify-center gap-8 lg:mt-10 lg:gap-12">
              {SECONDARY_METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-baseline gap-2"
                >
                  <span className="text-heading-md font-mono text-primary-400">
                    {metric.value}
                  </span>
                  <span className="text-body-sm text-[var(--color-secondary-muted)]">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 6: OUR MISSION
          ================================================================ */}
      <SectionContainer
        ariaLabelledBy="mission-heading"
        className="py-16 sm:py-20 md:py-24 lg:py-32"
      >
        <Container size="sm" className="max-w-3xl text-center">
          {/* Eyebrow */}
          <ScrollReveal variant="fadeUp">
            <Eyebrow color="primary">OUR MISSION</Eyebrow>
          </ScrollReveal>

          {/* Mission Statement */}
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <h2
              id="mission-heading"
              className="text-display-md mx-auto mt-6 text-foreground lg:mt-8"
              style={{ maxWidth: "28ch" }}
            >
              Protect every traveler through professional safety analysis,
              government intelligence, and documented evidence.
            </h2>
          </ScrollReveal>

          {/* Divider */}
          <ScrollReveal variant="fadeUp" delay={0.25}>
            <div
              className="my-10 flex justify-center lg:my-12"
              aria-hidden="true"
            >
              <div className="h-px w-[120px] bg-primary-300" />
            </div>
          </ScrollReveal>

          {/* Vision */}
          <ScrollReveal variant="fadeUp" delay={0.35}>
            <Eyebrow color="primary">OUR VISION</Eyebrow>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.43}>
            <p className="text-body-lg mx-auto mt-4 max-w-prose text-muted-foreground">
              A world where every group trip has the safety rigor it
              deserves&mdash;where preparation is the standard, not the
              exception.
            </p>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 7: TRUSTED BY
          ================================================================ */}
      <SectionContainer
        variant="card"
        ariaLabelledBy="trusted-by-heading"
        className="py-12 sm:py-16 md:py-20 lg:py-24"
      >
        <Container>
          {/* Header */}
          <ScrollReveal variant="fadeUp">
            <div className="text-center">
              <h2
                id="trusted-by-heading"
                className="text-heading-lg mx-auto text-foreground"
                style={{ maxWidth: "28ch" }}
              >
                Trusted by Schools, Universities, Churches, and Businesses
              </h2>
              <p className="text-body-lg mx-auto mt-4 max-w-prose text-muted-foreground">
                SafeTrekr serves 104 organizations across education,
                faith-based, and corporate sectors.
              </p>
            </div>
          </ScrollReveal>

          {/* Org Type Grid */}
          <StaggerChildren className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-6 lg:mt-12 lg:grid-cols-4">
            {ORG_TYPES.map((org, index) => (
              <ScrollReveal
                key={org.name}
                variant="fadeUp"
                delay={index * 0.08}
              >
                <div className="rounded-xl border border-border bg-white p-6 text-center shadow-[var(--shadow-xs)]">
                  <div
                    className="mx-auto mb-3 flex size-12 items-center justify-center rounded-lg bg-primary-50"
                    aria-hidden="true"
                  >
                    <span className="text-primary-700 [&_svg]:size-6">
                      {org.icon}
                    </span>
                  </div>
                  <div className="text-heading-sm text-foreground">
                    {org.name}
                  </div>
                  <div className="text-body-sm mt-1 text-muted-foreground">
                    {org.subtitle}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </StaggerChildren>

          {/* Disclaimer */}
          <ScrollReveal variant="fadeUp" delay={0.3}>
            <p className="text-body-sm mt-8 text-center text-muted-foreground">
              Specific client logos and organization names available upon
              request.
            </p>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 8: CTA BAND (DARK)
          ================================================================ */}
      <CTABand
        variant="dark"
        headline="Ready to See SafeTrekr in Action?"
        body="See how professional trip safety management works for your organization. Our team will walk you through a real safety binder."
        primaryCta={{ text: "Get a Demo", href: "/demo" }}
        secondaryCta={{ text: "See How It Works", href: "/how-it-works" }}
      />

      {/* ================================================================
          SECTION 9: JSON-LD STRUCTURED DATA
          Organization schema enriched for the About page.
          ================================================================ */}
      <JsonLd
        data={{
          ...generateOrganizationSchema(),
          foundingDate: "2024",
          address: {
            "@type": "PostalAddress",
            addressCountry: "US",
          },
        }}
      />
    </>
  );
}
