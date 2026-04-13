/**
 * ST-883: About Page (/about)
 *
 * Editorial narrative page that establishes SafeTrekr's origin story,
 * principles, team, and mission. Builds trust through transparency --
 * verifiable numbers, real credentials, and a clear founding narrative.
 *
 * Section order:
 *   1. Hero            , Editorial text-only hero
 *   2. Our Story       , Founding narrative explaining why SafeTrekr exists
 *   3. Route Divider   , Decorative SVG divider
 *   4. What We Believe , 4 principle cards (Assessment, Documentation, Accessibility, Clarity)
 *   5. Built by Pros   , Team credentials on dark bg
 *   6. Our Mission     , Mission + vision statements
 *   7. Trusted By      , 4 org type cards
 *   8. CTABand         , Dark variant
 *   9. JSON-LD         , Organization structured data
 *
 * @see designs/html/mockup-about.html
 */

import {
  BookOpen,
  ClipboardCheck,
  Shield,
  FileText,
  GraduationCap,
  Heart,
  Building2,
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
    "SafeTrekr is a trip safety platform founded by former senior U.S. Secret Service agents. Trained analysts review every trip using government and international data sources and deliver audit-ready safety binders. Serving 104 organizations across K-12, higher ed, churches, and corporate travel.",
  path: "/about",
});

// ---------------------------------------------------------------------------
// Data: Approach Pillar Cards
// ---------------------------------------------------------------------------

const BELIEF_PRINCIPLES = [
  {
    icon: <ClipboardCheck className="size-6" />,
    title: "Professional Assessment, Not Automation",
    description:
      "Every trip is reviewed by a trained safety analyst. Algorithms can gather data, but professionals make judgments. When your organization sends people into the world, a real person should review the preparation.",
  },
  {
    icon: <FileText className="size-6" />,
    title: "Documentation, Not Promises",
    description:
      "Good intentions are important. Documentation makes them visible. Every finding, every recommendation, every contact is recorded. When someone asks what you did to prepare, you share the binder.",
  },
  {
    icon: <Shield className="size-6" />,
    title: "Accessible to Everyone",
    description:
      "Professional trip planning shouldn't require enterprise budgets. We built SafeTrekr so that a church sending a mission team, a school planning a field trip, and a company sending employees to a conference can all access the same structured approach.",
  },
  {
    icon: <BookOpen className="size-6" />,
    title: "Clarity Over Complexity",
    description:
      "Safety documentation should be understood by everyone who needs it, trip leaders, administrators, parents, board members, and stakeholders. We write for clarity, not to impress.",
  },
] as const;

// ---------------------------------------------------------------------------
// Data: Team Credentials
// ---------------------------------------------------------------------------

const TEAM_CREDENTIALS = [
  "Former U.S. Secret Service agents from the Presidential Protection Division",
  "USSS Counter Assault Team professionals responsible for immediate threat response",
  "Protective intelligence experts focused on risk identification and prevention",
  "Nationally recognized school security director with decades of student travel and safety experience",
  "Advance team lead agents experienced in complex travel planning and logistics",
  "Homeland Security agents with cross-border intelligence experience",
  "Specialists in anti-human trafficking and international risk environments",
  "Cybersecurity and digital threat experts focused on protecting travelers",
] as const;

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
        className="pt-6 pb-10 sm:pt-8 sm:pb-12 lg:pt-12 lg:pb-16"
      >
        <Container>
          {/* Eyebrow */}
          <ScrollReveal variant="fadeUp">
            <Eyebrow color="primary" icon={<BookOpen className="size-3.5" />}>
              ABOUT SAFETREKR
            </Eyebrow>
          </ScrollReveal>

          {/* Headline */}
          <ScrollReveal variant="fadeUp" delay={0.08}>
            <h1
              id="about-hero-heading"
              className="text-display-lg mt-4 text-foreground"
              style={{ maxWidth: "20ch" }}
            >
              Professional trip planning for every organization.
            </h1>
          </ScrollReveal>

          {/* Sub-headline */}
          <ScrollReveal variant="fadeUp" delay={0.16}>
            <p className="text-body-lg mt-6 max-w-prose text-muted-foreground lg:mt-8">
              SafeTrekr was founded on a simple premise: every organization that
              sends people into the world&mdash;students, employees, volunteers,
              athletes&mdash;deserves professional trip planning support.
              Structured assessment. Clear documentation. Accessible to everyone.
            </p>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 2: OUR STORY
          ================================================================ */}
      <SectionContainer
        variant="card"
        ariaLabelledBy="founding-narrative-heading"
        className="py-16 sm:py-20 md:py-24 lg:py-32"
      >
        <Container size="sm" className="max-w-3xl">
          {/* Eyebrow */}
          <ScrollReveal variant="fadeUp">
            <Eyebrow color="primary">OUR STORY</Eyebrow>
          </ScrollReveal>

          {/* Headline */}
          <ScrollReveal variant="fadeUp" delay={0.08}>
            <h2
              id="founding-narrative-heading"
              className="text-heading-lg mt-4 text-foreground"
            >
              Why we built SafeTrekr.
            </h2>
          </ScrollReveal>

          {/* Body content */}
          <div className="mt-8 space-y-6 lg:mt-10">
            <ScrollReveal variant="fadeUp" delay={0.16} as="p">
              <span className="text-body-lg max-w-prose text-muted-foreground">
                Our founding team includes multiple former senior United States
                Secret Service agents who spent years planning protective
                operations for some of the highest-stakes travel in the world.
                When they began working with schools, churches, and businesses,
                they saw a gap: these organizations cared deeply about safety
                but lacked the structured tools that professional security
                teams rely on.
              </span>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.24} as="p">
              <span className="text-body-lg max-w-prose text-muted-foreground">
                Teachers were doing their best with spreadsheets. Volunteer
                coordinators were researching destinations between other
                responsibilities. HR managers were approving travel without a
                structured assessment process.
              </span>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.32} as="p">
              <span className="text-body-lg max-w-prose text-muted-foreground">
                They weren&rsquo;t failing. They were doing their best with tools
                that weren&rsquo;t built for this purpose.
              </span>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.4} as="p">
              <span className="text-body-lg max-w-prose font-medium text-foreground">
                SafeTrekr exists to fill that gap.
              </span>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.48} as="p">
              <span className="text-body-lg max-w-prose text-muted-foreground">
                We built a platform that provides professional trip planning
                support to organizations that send people into the world.
                Structured review. Government information sources. Complete
                documentation. The same systematic approach that large
                organizations use&mdash;accessible to schools, churches, sports
                teams, and mid-market businesses.
              </span>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.56} as="p">
              <span className="text-body-lg max-w-prose font-semibold text-foreground">
                Every trip deserves a plan.
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
          SECTION 3: WHAT WE BELIEVE
          ================================================================ */}
      <SectionContainer ariaLabelledBy="beliefs-heading">
        <Container>
          {/* Section Header */}
          <ScrollReveal variant="fadeUp">
            <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
              <Eyebrow color="primary">WHAT WE BELIEVE</Eyebrow>
              <h2
                id="beliefs-heading"
                className="text-display-md mx-auto mt-4 text-foreground"
                style={{ maxWidth: "28ch" }}
              >
                Our principles.
              </h2>
            </div>
          </ScrollReveal>

          {/* 4 Principle Cards */}
          <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {BELIEF_PRINCIPLES.map((principle, index) => (
              <ScrollReveal
                key={principle.title}
                variant="fadeUp"
                delay={index * 0.08}
              >
                <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <div
                    className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary-50"
                    aria-hidden="true"
                  >
                    <span className="text-primary-700 [&_svg]:size-6">
                      {principle.icon}
                    </span>
                  </div>
                  <h3 className="text-heading-sm text-foreground">
                    {principle.title}
                  </h3>
                  <p className="text-body-md mt-3 text-muted-foreground">
                    {principle.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </StaggerChildren>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 4: BUILT BY PROFESSIONALS
          ================================================================ */}
      <SectionContainer
        variant="dark"
        ariaLabelledBy="team-heading"
        className="py-20 sm:py-24 lg:py-32"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Left Column: Narrative */}
            <div className="lg:col-span-2">
              <ScrollReveal variant="fadeUp">
                <Eyebrow color="dark">OUR TEAM</Eyebrow>
              </ScrollReveal>

              <ScrollReveal variant="fadeUp" delay={0.08}>
                <h2
                  id="team-heading"
                  className="text-display-md mt-4 text-white"
                >
                  Built by Professionals Responsible for Safety
                </h2>
              </ScrollReveal>

              <ScrollReveal variant="fadeUp" delay={0.16}>
                <p className="text-body-lg mt-6 text-[var(--color-secondary-muted)] lg:mt-8">
                  Safetrekr is developed and guided by a team of professionals
                  who spent their careers responsible for planning, protecting,
                  and managing complex travel environments. Their experience
                  shapes every feature and workflow within the platform.
                </p>
              </ScrollReveal>

              {/* Shield emblem — visible on lg+ only */}
              <ScrollReveal variant="fadeUp" delay={0.24}>
                <div
                  className="mt-10 hidden lg:flex size-20 items-center justify-center rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  aria-hidden="true"
                >
                  <Shield className="size-10 text-primary-400" />
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Credential List */}
            <div className="lg:col-span-3">
              <ScrollReveal variant="fadeUp" delay={0.2}>
                <h3 className="text-heading-sm mb-8 text-white">
                  Our Team Includes:
                </h3>
              </ScrollReveal>

              <ul className="space-y-0" role="list">
                {TEAM_CREDENTIALS.map((credential, index) => (
                  <ScrollReveal
                    key={index}
                    variant="fadeUp"
                    delay={0.24 + index * 0.06}
                    as="li"
                  >
                    <div
                      className="flex items-start gap-5 py-5"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <span
                        className="shrink-0 pt-0.5 font-mono text-sm tabular-nums text-primary-400"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-body-md text-[var(--color-dark-text-secondary)]">
                        {credential}
                      </span>
                    </div>
                  </ScrollReveal>
                ))}
              </ul>

              {/* Closing statement */}
              <ScrollReveal variant="fadeUp" delay={0.76}>
                <p
                  className="mt-10 text-body-lg font-medium text-white"
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.12)",
                    paddingTop: "1.5rem",
                  }}
                >
                  Together, this team built Safetrekr to bring structured
                  planning, real-world experience, and practical safety guidance
                  to every organization that travels.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 5: OUR MISSION
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
              verified data sources, and documented evidence.
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
        headline="Ready to go with a plan?"
        body="See how SafeTrekr delivers professional trip planning for your organization."
        primaryCta={{ text: "Schedule a Walkthrough", href: "/demo" }}
        secondaryCta={{ text: "Contact Us", href: "/contact" }}
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
