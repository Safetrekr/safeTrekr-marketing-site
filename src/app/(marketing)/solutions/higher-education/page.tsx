/**
 * ST-874: Higher Education Solutions Page (/solutions/higher-education)
 *
 * Vertical landing page for university study abroad offices, risk management,
 * and provost offices. Covers Clery Act, Title IX, faculty-led programs,
 * and semester-long study abroad.
 *
 * Positioning: "Complement not replacement" vs Terra Dotta, Via TRM, etc.
 * Pricing anchor: $1,250 per international program.
 * Sample binder: Barcelona -- Madrid -- Seville.
 *
 * 10-section structure matching the segment page template:
 *   1. Hero
 *   2. Trust Strip
 *   3. The Challenge
 *   4. How SafeTrekr Solves It (process + feature cards)
 *   5. Sample Binder Preview
 *   6. Proof Points (dark)
 *   7. Pricing Context
 *   8. Compliance & Trust
 *   9. FAQ (12 questions)
 *  10. CTA Band (dark)
 *
 * @see designs/html/mockup-higher-ed-solutions.html
 */

import Link from "next/link";
import {
  GraduationCap,
  AlertTriangle,
  Shield,
  ClipboardCheck,
  FileText,
  Activity,
  Users,
  AlertCircle,
  Check,
  ArrowRight,
  Download,
} from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import {
  JsonLd,
  generateBreadcrumbSchema,
  type FAQItem,
} from "@/lib/structured-data";
import { SectionContainer } from "@/components/layout/section-container";
import { Container } from "@/components/layout/container";
import {
  Eyebrow,
  ProcessTimeline,
  FeatureCard,
  FAQSection,
  CTABand,
  PricingTierCard,
  InternationalPricingCard,
} from "@/components/marketing";
import { DocumentPreview } from "@/components/marketing/document-preview";
import { RevenueCalculator } from "@/components/marketing/calculator";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "Higher Education Travel Planning",
  description:
    "Study abroad programs built on solid preparation. SafeTrekr provides professional safety review for universities with institutional-grade documentation for general counsel and risk management.",
  path: "/solutions/higher-education",
  ogImage: "/og/solutions-higher-education.png",
});

// ---------------------------------------------------------------------------
// Data constants
// ---------------------------------------------------------------------------

const BREADCRUMBS = [
  { name: "Home", url: "https://safetrekr.com/" },
  { name: "Solutions", url: "https://safetrekr.com/solutions" },
  {
    name: "Higher Education",
    url: "https://safetrekr.com/solutions/higher-education",
  },
];

const PROCESS_STEPS = [
  {
    number: 1,
    title: "Enter Trip Details",
    description:
      "Enter all of your trip details and activities through a self guided form. Takes about 15 minutes.",
  },
  {
    number: 2,
    title: "Analyst Review",
    description:
      "Our highly trained and dedicated safety analyst reviews your trip using the most current information, providing the highest quality travel safety plan in the industry.",
  },
  {
    number: 3,
    title: "Receive Your Safety Binder",
    description:
      "Your organization receives a digitized interactive or printed safety binder for organized and easy reference. Share with leadership, parents, or stakeholders.",
  },
];

const CHALLENGE_CARDS = [
  {
    icon: <FileText className="size-6" />,
    title: "Inconsistent Processes Across Departments",
    description:
      "One department uses a formal assessment process. Another relies on faculty judgment. A third has no standard process at all. When questions arise, the answer is often: 'It depends on who organized the trip.'",
  },
  {
    icon: <Shield className="size-6" />,
    title: "Documentation Gaps",
    description:
      "Without standardized methodology, institutions lack the documentation infrastructure to demonstrate that professional assessment was completed before travel occurred.",
  },
  {
    icon: <Users className="size-6" />,
    title: "Varying Standards by Trip Type",
    description:
      "Study abroad, athletics, student organizations, and faculty travel often follow different processes. Stakeholders expect the same level of preparation regardless of sponsoring department.",
  },
  {
    icon: <AlertCircle className="size-6" />,
    title: "Accountability Requirements",
    description:
      "When stakeholders ask about preparation, institutions need organized records that demonstrate thoroughness. Professional documentation supports accountability requirements.",
  },
];

const FEATURE_CARDS = [
  {
    icon: <ClipboardCheck className="size-6" />,
    title: "Study Abroad Assessment",
    description:
      "Comprehensive safety planning and assessment for international study programs to include emergency contact information, active regional conditions and 360 degree emergency planning in an easy to understand format. All evaluated and developed by a highly trained analyst.",
    href: "/platform/analyst-review",
    linkText: "Learn about analyst review",
  },
  {
    icon: <FileText className="size-6" />,
    title: "Institutional Documentation",
    description:
      "Documentation and digital safety binders provided in an interactive stand alone iPhone/Android phone application.",
    href: "/platform/safety-binder",
    linkText: "Learn about the safety binder",
  },
  {
    icon: <Shield className="size-6" />,
    title: "Institutional Consistency",
    description:
      "All trips and stakeholders receive the same level of expert emergency planning, keeping everyone to the same documented standard.",
    href: "/platform/risk-intelligence",
    linkText: "Learn about our methodology",
  },
];

const BINDER_CONTENTS = [
  "Destination assessment from government and private data sources",
  "Full itinerary and travel emergency assessment and planning resource",
  "Local information and intelligence summaries for the most up to date information",
  "Complete audit trail with verified integrity",
];

const PROOF_STATS = [
  {
    value: "Full",
    label: "Comprehensive Review",
    description:
      "Every program reviewed across host institutions, housing, transportation, emergency contacts, evacuation routes, health advisories, mental health resources, and more",
  },
  {
    value: "Multiple",
    label: "Trusted Intel Sources",
    description:
      "Current information from established government and international agency sources -- professionally evaluated by experienced analysts",
  },
  {
    value: "3 Days",
    label: "Fast Turnaround",
    description:
      "Professional review and documentation delivered before your students depart for their program",
  },
];

const COMPARISON_ROWS = [
  {
    without:
      "Different departments follow different processes. No standardized methodology across the institution.",
    with: "Independent analyst completes comprehensive review using multiple trusted sources. Same methodology for every trip.",
  },
  {
    without:
      "Documentation assembled inconsistently. No standard evidence of safety assessment before departure.",
    with: "Documentation delivered before students depart. Every program site professionally assessed and documented.",
  },
  {
    without:
      "When questions arise: 'It depends on who organized the trip' is your institutional answer.",
    with: "When questions arise: a complete safety binder with every finding documented and every data source cited.",
  },
  {
    without:
      "Inconsistent preparation across study abroad, athletics, student organizations, and faculty travel.",
    with: "Professional preparation at institutional pricing. Same standard regardless of sponsoring department.",
  },
];

const DAY_TRIP_FEATURES = [
  "Experienced analyst review",
  "Comprehensive safety assessment",
  "Interactive digital safety binder",
  "Mobile field support access",
  "Delivery in as soon as 3 days",
  "Verified documentation",
  "PDF & print export",
  "30-day post-trip access",
];

const EXTENDED_TRIP_FEATURES = [
  "Everything in Day Trip",
  "Multi-day trip support (up to 7 days)",
  "Active intelligence monitoring",
  "Faculty and athletic travel coverage",
  "Multiple venue assessment",
  "Priority analyst assignment",
  "60-day post-trip access",
];

const INTERNATIONAL_FEATURES = [
  "Everything in Extended Trip",
  "International intelligence coverage",
  "Embassy and consulate contacts",
  "Regional condition assessment",
  "Evacuation planning documentation",
  "Pre-departure briefing",
  "Extended monitoring (trip duration + 7 days)",
  "90-day post-trip access",
];

const COMPLIANCE_BADGES = [
  {
    icon: <Shield className="size-8" />,
    title: "Data Security",
    description:
      "All data encrypted at rest and in transit. Student information handled with institutional-grade security standards.",
  },
  {
    icon: <FileText className="size-8" />,
    title: "Document Integrity",
    description:
      "Every review finding, every analyst decision, every data source documented with verified integrity. Audit-ready by default.",
  },
  {
    icon: <Activity className="size-8" />,
    title: "Security Controls",
    description:
      "Enterprise security controls designed to meet institutional requirements for student data protection.",
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How does SafeTrekr support institutional accountability?",
    answer:
      "SafeTrekr safety binders document that professional assessment was conducted for institution-sponsored travel. When questions arise about preparation, the binder provides organized evidence of thoroughness. We don't replace institutional processes, but we create documentation that supports accountability requirements.",
  },
  {
    question:
      "Can SafeTrekr work with our existing travel registration system?",
    answer:
      "Yes. SafeTrekr can complement existing travel registration workflows. Contact us for information about integration options.",
  },
  {
    question: "How do you handle trips with multiple destinations?",
    answer:
      "Multi-destination trips are assessed comprehensively. Each destination receives evaluation, and the safety binder documents the full itinerary with location-specific findings and recommendations.",
  },
  {
    question:
      "What if we have faculty traveling to challenging regions for research?",
    answer:
      "Our Study Abroad and Challenging Region tiers include enhanced assessment, evacuation planning documentation, and medical infrastructure review. For regions with elevated advisories, we provide additional context for institutional consideration.",
  },
  {
    question: "Can different departments access only their own trips?",
    answer:
      "Yes. SafeTrekr supports role-based access with department-level visibility. Department administrators see their own trips; central administration can view institution-wide data. Access controls match your organizational structure.",
  },
  {
    question: "How quickly can we get documentation for urgent travel?",
    answer:
      "Standard delivery is as soon as 3 days. Priority processing is available for Study Abroad and Challenging Region trips. Contact us for expedited options.",
  },
];

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function HigherEducationSolutionsPage() {
  return (
    <main id="main-content">
      {/* JSON-LD: Breadcrumbs */}
      <JsonLd data={generateBreadcrumbSchema(BREADCRUMBS)} />

      {/* ================================================================
          SECTION 1: HERO
          ================================================================ */}
      <SectionContainer
        id="hero"
        aria-label="Hero"
        className="pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-28 xl:pt-28 xl:pb-36"
      >
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
                  href="/solutions"
                  className="text-primary-700 hover:underline"
                >
                  Solutions
                </Link>
              </li>
              <li aria-hidden="true" className="select-none">
                /
              </li>
              <li aria-current="page" className="font-medium text-foreground">
                Higher Education
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Text Column */}
            <div>
              <Eyebrow
                color="primary"
                icon={<GraduationCap className="size-4" />}
                className="mb-5"
              >
                HIGHER EDUCATION PLANNING
              </Eyebrow>

              <h1 className="text-display-xl max-w-[20ch] text-foreground">
                Study abroad programs built on solid preparation.
              </h1>

              <p className="mt-6 max-w-[50ch] text-body-lg text-muted-foreground">
                A trained safety analyst reviews every trip your institution
                sponsors, study abroad programs, faculty travel, athletic
                events, and student organization trips. Professional safety
                assessments and documentation designed for every stakeholder
                to have a plan for emergencies before departure.
              </p>

              <div className="mt-8 flex flex-col flex-wrap gap-4 sm:flex-row">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/demo">
                    Schedule a Walkthrough
                    <ArrowRight className="size-[18px]" aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/resources/sample-binders/study-abroad">
                    <Download className="size-[18px]" aria-hidden="true" />
                    View Sample Binder
                  </Link>
                </Button>
              </div>
            </div>

            {/* Visual Column */}
            <div
              className="flex justify-center lg:justify-end"
              aria-hidden="true"
            >
              <DocumentPreview variant="full" showHash />
            </div>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 3: THE CHALLENGE
          ================================================================ */}
      <SectionContainer id="challenge" ariaLabelledBy="challenge-heading">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column: Header + Narrative */}
            <div className="lg:col-span-5">
              <ScrollReveal variant="fadeUp">
                <Eyebrow
                  color="primary"
                  icon={<AlertTriangle className="size-4" />}
                  className="mb-5"
                >
                  THE CHALLENGE
                </Eyebrow>

                <h2
                  id="challenge-heading"
                  className="text-display-md max-w-[28ch] text-foreground"
                >
                  University travel preparation works better with consistency.
                </h2>

                <p className="mt-6 max-w-prose text-body-lg text-muted-foreground">
                  One department uses a formal assessment process. Another relies
                  on faculty judgment. A third has no standard process at all.
                  When questions arise, the answer is often: &quot;It depends on
                  who organized the trip.&quot;
                </p>

                <p className="mt-4 max-w-prose text-body-lg font-medium text-foreground">
                  SafeTrekr creates institutional consistency. Every trip,
                  regardless of sponsoring department, receives the same
                  professional safety plan and review. Same methodology.
                  Same documentation. Same standard.
                </p>
              </ScrollReveal>
            </div>

            {/* Right Column: Status Quo Cards */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {CHALLENGE_CARDS.map((card, index) => (
                  <ScrollReveal
                    key={card.title}
                    variant="fadeUp"
                    delay={index * 0.1}
                  >
                    <div className="rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
                      <div
                        className="mb-4 text-muted-foreground"
                        aria-hidden="true"
                      >
                        {card.icon}
                      </div>
                      <h3 className="text-heading-sm mb-2 text-foreground">
                        {card.title}
                      </h3>
                      <p className="text-body-sm text-muted-foreground">
                        {card.description}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 4: HOW SAFETREKR SOLVES IT
          ================================================================ */}
      <SectionContainer id="how-it-works" ariaLabelledBy="solution-heading">
        <Container>
          {/* Section Header */}
          <ScrollReveal variant="fadeUp">
            <div className="mb-12 text-center lg:mb-16">
              <Eyebrow
                color="primary"
                icon={<Shield className="size-4" />}
                className="mb-5"
              >
                HOW IT WORKS
              </Eyebrow>
              <h2
                id="solution-heading"
                className="mx-auto max-w-[28ch] text-display-md text-foreground"
              >
                From trip details to organized safety plan in as little as 3 days.
              </h2>
              <p className="mx-auto mt-4 max-w-prose text-body-lg text-muted-foreground">
                Professional preparation for every university-sponsored trip.
              </p>
            </div>
          </ScrollReveal>

          {/* Process Timeline */}
          <ScrollReveal variant="fadeUp" className="mb-16">
            <ProcessTimeline steps={PROCESS_STEPS} />
          </ScrollReveal>

          {/* Feature Cards (3-col) */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURE_CARDS.map((card, index) => (
              <ScrollReveal
                key={card.title}
                variant="fadeUp"
                delay={index * 0.1}
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
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 5: SAMPLE BINDER PREVIEW
          ================================================================ */}
      <SectionContainer
        id="sample-binder"
        variant="brand"
        ariaLabelledBy="binder-preview-heading"
      >
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Visual Column (shows first on mobile via order) */}
            <div
              className="order-first flex justify-center lg:order-last lg:col-span-7"
              aria-hidden="true"
            >
              <ScrollReveal variant="fadeUp">
                <DocumentPreview variant="full" showHash />
              </ScrollReveal>
            </div>

            {/* Text Column */}
            <div className="lg:col-span-5">
              <ScrollReveal variant="fadeUp">
                <Eyebrow
                  color="primary"
                  icon={<FileText className="size-4" />}
                  className="mb-5"
                >
                  SAMPLE BINDER
                </Eyebrow>

                <h2
                  id="binder-preview-heading"
                  className="max-w-[28ch] text-display-md text-foreground"
                >
                  Your Risk Management Team Will Receive
                </h2>

                <p className="mt-6 max-w-prose text-body-lg text-muted-foreground">
                  Every SafeTrekr review produces a comprehensive and safety
                  planning binder customized to your study abroad program. This
                  is not a generic country profile or a program provider&apos;s
                  marketing summary. It is the documented output of an
                  independent analyst reviewing your specific program, your
                  destinations, your dates, your housing, your host
                  institutions. It also provides active area information so
                  you can make safer and informed decisions.
                </p>

                {/* Binder contents list */}
                <ul className="mt-6 space-y-3">
                  {BINDER_CONTENTS.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check
                        className="mt-0.5 size-5 shrink-0 text-primary-500"
                        aria-hidden="true"
                      />
                      <span className="text-body-md text-muted-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button variant="primary" size="lg" className="mt-8" asChild>
                  <Link
                    href="/resources/sample-binders/study-abroad"
                    aria-label="Download the Study Abroad Sample Binder, opens email-gated form"
                  >
                    <Download className="size-[18px]" aria-hidden="true" />
                    Download the Study Abroad Sample Binder
                  </Link>
                </Button>
                <p className="mt-2 text-body-sm text-muted-foreground">
                  See a real safety binder output. Gated with email -- we will
                  not spam you.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 6: PROOF POINTS (DARK)
          ================================================================ */}
      <SectionContainer
        id="proof-points"
        variant="dark"
        ariaLabelledBy="proof-heading"
      >
        <Container>
          {/* Header */}
          <ScrollReveal variant="fadeUp">
            <div className="mb-12 text-center">
              <Eyebrow color="dark" className="mb-4">
                BY THE NUMBERS
              </Eyebrow>
              <h2
                id="proof-heading"
                className="mx-auto max-w-[28ch] text-display-md text-dark-text-primary"
              >
                Independent Verification, Not Provider Self-Assessment
              </h2>
            </div>
          </ScrollReveal>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PROOF_STATS.map((stat, index) => (
              <ScrollReveal
                key={stat.label}
                variant="fadeUp"
                delay={index * 0.1}
              >
                <div
                  className="rounded-xl border border-dark-border bg-dark-surface p-8 text-center"
                  aria-label={`${stat.value} ${stat.label}`}
                >
                  <div className="font-mono text-display-md text-dark-text-primary">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-eyebrow text-dark-text-secondary">
                    {stat.label}
                  </div>
                  <p className="mt-3 text-body-sm text-dark-text-secondary">
                    {stat.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Proof Narrative */}
          <ScrollReveal variant="fadeUp">
            <p className="mx-auto mt-12 max-w-prose text-center text-body-lg text-dark-text-secondary">
              Consistency across departments. Clarity for stakeholders.
              SafeTrekr produces professional documentation that demonstrates
              thorough preparation for every university-sponsored trip.
            </p>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 7: PRICING CONTEXT
          ================================================================ */}
      <SectionContainer id="pricing" ariaLabelledBy="pricing-heading">
        <Container>
          {/* Section Header */}
          <ScrollReveal variant="fadeUp">
            <div className="mb-12">
              <Eyebrow color="primary" className="mb-4">
                PRICING
              </Eyebrow>
              <h2
                id="pricing-heading"
                className="max-w-[28ch] text-display-md text-foreground"
              >
                Professional preparation. Institutional pricing.
              </h2>
              <p className="mt-4 max-w-prose text-body-lg text-muted-foreground">
                Straightforward per-trip pricing for institutions of all sizes.
                Most institutions fold the cost into program fees, an
                additional travel safety fee of roughly $15 to $50 per
                participant covers professional safety planning for the
                entire program. Contact us for institutional agreements.
              </p>
            </div>
          </ScrollReveal>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3 lg:gap-8">
            <PricingTierCard
              id="day-trip"
              tierName="Day Trip"
              price="$450"
              perParticipant="~$15/person for a 30-person group"
              features={DAY_TRIP_FEATURES}
              ctaText="Schedule a Walkthrough"
              ctaHref="/demo"
            />

            <PricingTierCard
              id="extended-trip"
              tierName="Extended Trip"
              price="$750"
              perParticipant="~$19/person for a 40-person group"
              features={EXTENDED_TRIP_FEATURES}
              ctaText="Schedule a Walkthrough"
              ctaHref="/demo"
              featured
              badge="Most Popular"
            />

            <InternationalPricingCard
              id="international"
              features={INTERNATIONAL_FEATURES}
              ctaText="Schedule a Walkthrough"
              ctaHref="/demo"
            />
          </div>

          {/* Revenue / Surplus Calculator */}
          <ScrollReveal variant="fadeUp">
            <div className="mx-auto mt-16 max-w-[672px]">
              <RevenueCalculator />
            </div>
          </ScrollReveal>

          {/* Cost-of-Inaction Comparison Block */}
          <ScrollReveal variant="fadeUp">
            <div className="mt-12 rounded-xl border border-border bg-card p-8">
              <h3 className="mb-6 text-heading-md text-foreground">
                The Value of Institutional Consistency
              </h3>

              <table className="w-full" role="table">
                <caption className="sr-only">
                  Comparison of study abroad safety approaches
                </caption>
                <thead className="hidden sm:table-header-group">
                  <tr>
                    <th
                      className="w-1/2 pb-4 text-left text-body-sm font-semibold text-foreground"
                    >
                      Without SafeTrekr
                    </th>
                    <th
                      className="w-1/2 pb-4 text-left text-body-sm font-semibold text-foreground"
                    >
                      With SafeTrekr
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, index) => (
                    <tr
                      key={index}
                      className="border-t border-border"
                    >
                      <td className="py-4 pr-4 align-top">
                        <div className="flex items-start gap-2">
                          <AlertTriangle
                            className="mt-0.5 hidden size-[18px] shrink-0 text-muted-foreground sm:block"
                            aria-hidden="true"
                          />
                          <span className="text-body-sm text-muted-foreground">
                            <span className="mb-1 block font-semibold text-foreground sm:hidden">
                              Without SafeTrekr:
                            </span>
                            {row.without}
                          </span>
                        </div>
                      </td>
                      <td className="border-l border-border py-4 pl-4 align-top sm:border-l-0">
                        <div className="flex items-start gap-2">
                          <Check
                            className="mt-0.5 hidden size-[18px] shrink-0 text-primary-500 sm:block"
                            aria-hidden="true"
                          />
                          <span className="text-body-sm text-muted-foreground">
                            <span className="mb-1 block font-semibold text-foreground sm:hidden">
                              With SafeTrekr:
                            </span>
                            {row.with}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 border-t border-border pt-4">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1 text-body-sm font-medium text-primary-700"
                >
                  View full pricing details
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 8: COMPLIANCE & TRUST
          ================================================================ */}
      <SectionContainer
        id="compliance"
        variant="card"
        ariaLabelledBy="compliance-heading"
      >
        <Container>
          {/* Section Header */}
          <ScrollReveal variant="fadeUp">
            <div className="mb-12 text-center">
              <Eyebrow
                color="primary"
                icon={<Shield className="size-4" />}
                className="mb-5"
              >
                SECURITY &amp; COMPLIANCE
              </Eyebrow>
              <h2
                id="compliance-heading"
                className="mx-auto max-w-[28ch] text-display-md text-foreground"
              >
                Built to Satisfy Your School&rsquo;s Risk Management Standards
              </h2>
            </div>
          </ScrollReveal>

          {/* Trust Badge Grid */}
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {COMPLIANCE_BADGES.map((badge, index) => (
              <ScrollReveal
                key={badge.title}
                variant="fadeUp"
                delay={index * 0.08}
              >
                <div className="rounded-xl border border-border bg-background p-6 text-center">
                  <div
                    className="mx-auto mb-3 text-primary-700"
                    aria-hidden="true"
                  >
                    {badge.icon}
                  </div>
                  <h3 className="mb-2 font-display text-base font-semibold text-foreground">
                    {badge.title}
                  </h3>
                  <p className="text-body-sm text-muted-foreground">
                    {badge.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Institutional Narrative Block */}
          <ScrollReveal variant="fadeUp">
            <div className="mt-12 text-center">
              <h3 className="text-heading-md text-foreground">
                Documentation That Supports Accountability
              </h3>
              <p className="mx-auto mt-4 max-w-prose text-body-lg text-muted-foreground">
                SafeTrekr produces professional documentation: a comprehensive
                safety review using multiple trusted sources, with verified
                document integrity. When stakeholders ask for evidence of
                preparation, you have organized records that demonstrate
                thoroughness.
              </p>
            </div>
          </ScrollReveal>

          {/* Complement-Not-Replace Statement */}
          <ScrollReveal variant="fadeUp">
            <div className="mx-auto mt-8 max-w-prose rounded-xl border border-primary-200 bg-primary-50 p-6 text-center">
              <p className="text-body-md text-foreground">
                SafeTrekr integrates alongside your existing study abroad
                management systems -- Terra Dotta, Via TRM, StudioAbroad, or
                your institution&apos;s custom solution. We do not replace your
                program management workflow. We add the independent safety
                verification layer that no program management system provides.
              </p>
            </div>
          </ScrollReveal>

        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 9: FAQ
          ================================================================ */}
      <SectionContainer id="faq" ariaLabelledBy="faq-heading">
        <Container size="md">
          <ScrollReveal variant="fadeUp">
            <div className="mb-12 text-center">
              <Eyebrow color="primary" className="mb-4">
                COMMON QUESTIONS
              </Eyebrow>
              <h2
                id="faq-heading"
                className="mx-auto max-w-[28ch] text-display-md text-foreground"
              >
                Frequently Asked Questions
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp">
            <FAQSection items={FAQ_ITEMS} />
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 10: CTA BAND (DARK)
          ================================================================ */}
      <CTABand
        variant="dark"
        headline="Ready to go with a plan?"
        body="See how SafeTrekr delivers professional trip planning for higher education with institutional-grade documentation."
        primaryCta={{ text: "Schedule a Walkthrough", href: "/demo" }}
        secondaryCta={{
          text: "View Pricing",
          href: "/pricing",
        }}
      />
    </main>
  );
}
