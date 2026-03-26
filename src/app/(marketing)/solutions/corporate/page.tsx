/**
 * ST-876: Corporate & Sports Teams Solutions Page (/solutions/corporate)
 *
 * Vertical landing page for mid-market corporate teams, sports organizations,
 * HR/risk managers, and travel coordinators. Covers duty of care, SafeSport
 * compliance, tournament travel, and business travel.
 *
 * Positioning: "Enterprise safety at per-trip pricing" for mid-market.
 * Pricing anchors: $450 domestic, $1,250 international.
 * Sample binder: Singapore -- Kuala Lumpur -- Bangkok.
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
 * @see designs/html/mockup-corporate-solutions.html
 */

import Link from "next/link";
import {
  Building2,
  AlertTriangle,
  Shield,
  ClipboardCheck,
  MapPin,
  FileText,
  Activity,
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
  TrustStrip,
  ProcessTimeline,
  FeatureCard,
  FAQSection,
  CTABand,
} from "@/components/marketing";
import { DocumentPreview } from "@/components/marketing/document-preview";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "Corporate Travel Planning",
  description:
    "Business travel planning with clear accountability. SafeTrekr provides professional safety review and duty of care documentation for mid-market companies without dedicated risk management staff.",
  path: "/solutions/corporate",
  ogImage: "/og/solutions-corporate.png",
});

// ---------------------------------------------------------------------------
// Data constants
// ---------------------------------------------------------------------------

const BREADCRUMBS = [
  { name: "Home", url: "https://safetrekr.com/" },
  { name: "Solutions", url: "https://safetrekr.com/solutions" },
  {
    name: "Corporate & Sports Teams",
    url: "https://safetrekr.com/solutions/corporate",
  },
];

const PROCESS_STEPS = [
  {
    number: 1,
    title: "Trip Registered",
    description:
      "An employee or travel coordinator registers the trip through a guided form -- destination, dates, purpose, and logistics. Takes 15 minutes. No training required.",
  },
  {
    number: 2,
    title: "Analyst Reviews Everything",
    description:
      "A professional safety analyst evaluates 17 standardized sections using current information from government data sources. Venues verified. Transportation assessed. Emergency contacts documented.",
  },
  {
    number: 3,
    title: "Documentation Delivered",
    description:
      "Your company receives a complete safety binder with every finding, recommendation, and contact. Evidence of preparation for HR, leadership, and organizational records.",
  },
];

const CHALLENGE_CARDS = [
  {
    icon: <FileText className="size-6" />,
    title: "Travel Insurance Covers Incidents, Not Preparation",
    description:
      "Most mid-market companies send employees to conferences, client sites, and international destinations every month. Travel gets approved based on budget and business purpose. Safety assessment? That's often assumed to be covered by travel insurance. But travel insurance covers incidents after they happen. Duty of care is about preparation before the trip.",
  },
  {
    icon: <Shield className="size-6" />,
    title: "Duty of Care Requires Documented Assessment",
    description:
      "When stakeholders ask what preparation was completed before a business trip, organizations need documented evidence. A travel booking confirmation and a hotel receipt demonstrate logistics, not preparation.",
  },
];

const FEATURE_CARDS = [
  {
    icon: <ClipboardCheck className="size-6" />,
    title: "Duty of Care Documentation",
    description:
      "Every business trip receives professional assessment by a trained analyst. When stakeholders ask what preparation was completed, you have documented evidence.",
    href: "/platform/analyst-review",
    linkText: "Learn about analyst review",
  },
  {
    icon: <MapPin className="size-6" />,
    title: "Conference and Event Travel",
    description:
      "Safety review for team travel to conferences, trade shows, and industry events. Venue assessment, transportation evaluation, and emergency contacts -- all documented.",
    href: "/platform/risk-intelligence",
    linkText: "Learn about risk intelligence",
  },
  {
    icon: <FileText className="size-6" />,
    title: "International Business Travel",
    description:
      "Comprehensive assessment for employees traveling internationally. Embassy contacts, medical facility locations, regional conditions, and emergency planning.",
    href: "/platform/safety-binder",
    linkText: "Learn about the safety binder",
  },
  {
    icon: <Activity className="size-6" />,
    title: "Straightforward Process",
    description:
      "Professional travel preparation without dedicated risk management staff, complex implementations, or enterprise pricing. Pay per trip, not per seat.",
    href: "/platform/mobile-app",
    linkText: "Learn about mobile operations",
  },
];

const BINDER_CONTENTS = [
  "17-section analyst review",
  "5 government data sources",
  "Complete safety binder",
  "Mobile field support",
  "3-5 day delivery",
];

const PROOF_STATS = [
  {
    value: "17",
    label: "Analyst Review Sections",
    description:
      "Every trip reviewed across venues, lodging, transportation, emergency contacts, evacuation routes, and more",
  },
  {
    value: "5",
    label: "Government Data Sources",
    description:
      "Current information from established government data sources",
  },
  {
    value: "3-5 Days",
    label: "Submission to Binder Delivery",
    description:
      "Professional review and documentation delivered before departure",
  },
];

const COMPARISON_ROWS = [
  {
    without: "No professional assessment",
    with: "Professional assessment",
  },
  {
    without: "No analyst review",
    with: "Analyst review",
  },
  {
    without: "No government data sources",
    with: "Government data sources",
  },
  {
    without: "No documented preparation",
    with: "Documented preparation",
  },
  {
    without: "No mobile field access",
    with: "Mobile field access",
  },
  {
    without: "No accountability records",
    with: "Accountability records",
  },
];

const PRICING_FEATURES_DOMESTIC = [
  "17-section analyst review",
  "5 government data sources",
  "Complete safety binder",
  "Mobile field support",
  "3-5 day delivery",
];

const PRICING_FEATURES_INTERNATIONAL = [
  "Everything in Domestic",
  "Multi-week trip support",
  "Extended monitoring period",
  "Embassy contact verification",
  "Priority analyst assignment",
];

const COMPLIANCE_BADGES = [
  {
    icon: <Shield className="size-8" />,
    title: "Professional Assessment",
    description:
      "Every trip reviewed by a trained safety analyst using established methodology.",
  },
  {
    icon: <FileText className="size-8" />,
    title: "Documented Preparation",
    description:
      "Complete records of assessment findings, recommendations, and emergency contacts.",
  },
  {
    icon: <Activity className="size-8" />,
    title: "Government Data Sources",
    description:
      "Current information from 5 established government data sources.",
  },
  {
    icon: <ClipboardCheck className="size-8" />,
    title: "Duty of Care Documentation",
    description:
      "Every binder is structured to demonstrate responsible preparation.",
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What is \"duty of care\" and why should our company think about it?",
    answer:
      "Duty of care is the responsibility employers have to take reasonable steps to protect employees during work activities -- including business travel. When employees travel for work, organizations are expected to assess and address foreseeable considerations. SafeTrekr provides the documented assessment that demonstrates your company prepared responsibly.",
  },
  {
    question: "We don't have a travel risk management team. Can we still use SafeTrekr?",
    answer:
      "Yes -- that's exactly who SafeTrekr is built for. Larger corporations have dedicated travel risk teams. SafeTrekr brings professional-grade travel safety assessment to mid-market companies without dedicated risk staff. We handle the assessment and documentation; you submit the trip details.",
  },
  {
    question: "How does SafeTrekr compare to corporate travel platforms?",
    answer:
      "Travel platforms handle booking, expense, and itinerary logistics. SafeTrekr handles safety assessment and accountability documentation. They serve different purposes and work together. Your travel platform books the travel. SafeTrekr evaluates preparation. The two complement each other.",
  },
  {
    question: "Can we use SafeTrekr for just some trips, or do we need to use it for everything?",
    answer:
      "You can use SafeTrekr for any trip -- there's no minimum commitment. Many companies start with international travel or unfamiliar destinations, then expand coverage as they see value. The choice is yours.",
  },
  {
    question: "What if we have employees traveling to the same destination frequently?",
    answer:
      "Repeat destinations benefit from current assessment, since conditions change over time. We offer volume pricing for companies with high travel frequency. Contact us to discuss pricing for your travel patterns.",
  },
  {
    question: "How do employees access safety information while traveling?",
    answer:
      "Travelers download the SafeTrekr mobile app and receive a trip code. The app provides offline access to emergency contacts, medical facilities, and safety guidance. If conditions change during travel, updates can be communicated through the app.",
  },
  {
    question: "Is SafeTrekr appropriate for executive travel?",
    answer:
      "Yes. Many companies use SafeTrekr specifically for executive and board travel, where accountability considerations are heightened.",
  },
  {
    question: "What industries use SafeTrekr for corporate travel?",
    answer:
      "SafeTrekr serves mid-market companies across professional services, manufacturing, technology, healthcare, non-profit, and financial services. Any company that sends employees to conferences, client sites, or international destinations can benefit.",
  },
  {
    question: "Do you integrate with existing travel booking systems?",
    answer:
      "SafeTrekr can complement existing travel workflows. Contact us for information about integration options.",
  },
  {
    question: "How quickly can we get started?",
    answer:
      "You can submit your first trip today. There's no implementation project or training required. Standard delivery is 3-5 business days from trip submission.",
  },
  {
    question: "Do you offer annual agreements or volume pricing?",
    answer:
      "Yes. Companies with regular business travel can benefit from annual agreements that reduce per-trip costs. Contact us to discuss options.",
  },
];

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function CorporateSolutionsPage() {
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
                Corporate &amp; Sports Teams
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Text Column */}
            <div>
              <Eyebrow
                color="primary"
                icon={<Building2 className="size-4" />}
                className="mb-5"
              >
                CORPORATE TRAVEL PLANNING
              </Eyebrow>

              <h1 className="text-display-xl max-w-[20ch] text-foreground">
                Business travel planning with clear accountability.
              </h1>

              <p className="mt-6 max-w-[50ch] text-body-lg text-muted-foreground">
                Your company sends employees to conferences, client sites, and
                international destinations. SafeTrekr provides the professional
                safety assessment and documentation that demonstrates responsible
                preparation -- without dedicated risk management staff or complex
                implementations.
              </p>

              <div className="mt-8 flex flex-col flex-wrap gap-4 sm:flex-row">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/demo">
                    Schedule a Walkthrough
                    <ArrowRight className="size-[18px]" aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link
                    href="/resources/sample-binders/corporate-travel"
                    aria-label="View Sample Binder, opens email-gated form"
                  >
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
          SECTION 2: TRUST STRIP
          ================================================================ */}
      <ScrollReveal variant="fadeUp">
        <TrustStrip showSources />
      </ScrollReveal>

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
                  Travel preparation works better with structure.
                </h2>

                <p className="mt-6 max-w-prose text-body-lg text-muted-foreground">
                  Most mid-market companies send employees to conferences, client
                  sites, and international destinations every month. Travel gets
                  approved based on budget and business purpose. Safety assessment?
                  That's often assumed to be covered by travel insurance.
                </p>

                <p className="mt-4 max-w-prose text-body-lg text-muted-foreground">
                  Here's the gap: travel insurance covers incidents after they
                  happen. Duty of care is about preparation before the trip.
                  They're complementary, not the same thing.
                </p>

                <p className="mt-4 max-w-prose text-body-lg font-medium text-foreground">
                  Active visibility, not passive hope.
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
                BUILT FOR MID-MARKET COMPANIES
              </Eyebrow>
              <h2
                id="solution-heading"
                className="mx-auto max-w-[28ch] text-display-md text-foreground"
              >
                Professional travel preparation without dedicated risk staff.
              </h2>
              <p className="mx-auto mt-4 max-w-prose text-body-lg text-muted-foreground">
                From travel request to complete documentation in 3-5 days.
              </p>
            </div>
          </ScrollReveal>

          {/* Process Timeline */}
          <ScrollReveal variant="fadeUp" className="mb-16">
            <ProcessTimeline steps={PROCESS_STEPS} />
          </ScrollReveal>

          {/* Feature Cards (2x2) */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
            {/* Visual Column (shows first on mobile, second on desktop) */}
            <div
              className="flex justify-center lg:order-2 lg:col-span-7"
              aria-hidden="true"
            >
              <ScrollReveal variant="fadeUp">
                <DocumentPreview variant="full" showHash />
              </ScrollReveal>
            </div>

            {/* Text Column */}
            <div className="lg:order-1 lg:col-span-5">
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
                  See What Documentation Looks Like
                </h2>

                <p className="mt-6 max-w-prose text-body-lg text-muted-foreground">
                  Every SafeTrekr review produces a complete safety binder
                  customized to your specific trip. Professional analyst findings,
                  recommendations, and emergency contacts -- all documented.
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
                    href="/resources/sample-binders/corporate-travel"
                    aria-label="View Sample Binder, opens email-gated form"
                  >
                    <Download className="size-[18px]" aria-hidden="true" />
                    View Sample Binder
                  </Link>
                </Button>
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
                HOW IT WORKS
              </Eyebrow>
              <h2
                id="proof-heading"
                className="mx-auto max-w-[28ch] text-display-md text-dark-text-primary"
              >
                From travel request to complete documentation in 3-5 days.
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
              SafeTrekr brings professional travel safety assessment to
              mid-market companies. One system for all business travel.
              Documentation that demonstrates responsible preparation.
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
                Professional preparation. Straightforward pricing.
              </h2>
              <p className="mt-4 max-w-prose text-body-lg text-muted-foreground">
                Professional travel safety assessment starting at $450 per trip.
                No annual contracts required.
              </p>
            </div>
          </ScrollReveal>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Domestic Business Trip */}
            <ScrollReveal variant="fadeUp">
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <div
                  className="mt-6 font-display text-5xl font-bold text-foreground"
                  aria-label="$450 per domestic business trip"
                >
                  $450
                </div>
                <div className="mt-1 text-body-md text-muted-foreground">
                  per domestic trip
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Conferences, client visits, team events
                  </p>
                </div>
                <div className="mt-6 border-t border-border pt-6">
                  <ul className="space-y-3">
                    {PRICING_FEATURES_DOMESTIC.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5"
                      >
                        <Check
                          className="mt-0.5 size-[18px] shrink-0 text-primary-500"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>

            {/* International Business Trip */}
            <ScrollReveal variant="fadeUp" delay={0.1}>
              <div className="rounded-2xl border border-primary-400 bg-card p-8 shadow-md">
                <Badge variant="brand" className="mb-4 text-xs">
                  Most Popular
                </Badge>
                <div
                  className="font-display text-5xl font-bold text-foreground"
                  aria-label="$750 per international trip"
                >
                  $750
                </div>
                <div className="mt-1 text-body-md text-muted-foreground">
                  per international trip
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    International client work and conferences
                  </p>
                </div>
                <div className="mt-6 border-t border-border pt-6">
                  <ul className="space-y-3">
                    {PRICING_FEATURES_INTERNATIONAL.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5"
                      >
                        <Check
                          className="mt-0.5 size-[18px] shrink-0 text-primary-500"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>

            {/* Challenging Region */}
            <ScrollReveal variant="fadeUp" delay={0.2}>
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <div className="mt-6 font-display text-5xl font-bold text-foreground">
                  $1,250
                </div>
                <div className="mt-1 text-body-md text-muted-foreground">
                  per challenging region trip
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Travel to challenging business environments
                  </p>
                </div>
                <div className="mt-6 border-t border-border pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5">
                      <Check
                        className="mt-0.5 size-[18px] shrink-0 text-primary-500"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        Everything in International
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check
                        className="mt-0.5 size-[18px] shrink-0 text-primary-500"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        Enhanced regional assessment
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check
                        className="mt-0.5 size-[18px] shrink-0 text-primary-500"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        Evacuation planning documentation
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check
                        className="mt-0.5 size-[18px] shrink-0 text-primary-500"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        Medical infrastructure review
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check
                        className="mt-0.5 size-[18px] shrink-0 text-primary-500"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        Regional condition briefing
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Comparison Block */}
          <ScrollReveal variant="fadeUp">
            <div className="mt-12 rounded-xl border border-border bg-card p-8">
              <h3 className="mb-6 text-heading-md text-foreground">
                Structured Planning vs. Ad Hoc Approach
              </h3>

              <table className="w-full" role="table">
                <caption className="sr-only">
                  Comparison of business travel safety approaches
                </caption>
                <thead className="hidden sm:table-header-group">
                  <tr>
                    <th
                      className="w-1/2 pb-4 text-left text-body-sm font-semibold text-muted-foreground"
                    >
                      Ad Hoc Approach
                    </th>
                    <th
                      className="w-1/2 pb-4 text-left text-body-sm font-semibold text-primary-700"
                    >
                      SafeTrekr
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, index) => (
                    <tr
                      key={index}
                      className="border-t border-border"
                    >
                      <td className="py-4 pr-6 align-top">
                        <div className="flex items-start gap-2.5">
                          <AlertTriangle
                            className="mt-1 hidden size-4 shrink-0 text-muted-foreground sm:block"
                            aria-hidden="true"
                          />
                          <span className="text-body-sm text-muted-foreground">
                            {row.without}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 align-top">
                        <div className="flex items-start gap-2.5">
                          <Check
                            className="mt-1 hidden size-4 shrink-0 text-primary-500 sm:block"
                            aria-hidden="true"
                          />
                          <span className="text-body-sm text-muted-foreground">
                            {row.with}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6">
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
                COMPARISON
              </Eyebrow>
              <h2
                id="compliance-heading"
                className="mx-auto max-w-[28ch] text-display-md text-foreground"
              >
                Structured Planning vs. Ad Hoc Approach
              </h2>
            </div>
          </ScrollReveal>

          {/* Trust Badge Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
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

          {/* Mid-Market Positioning Statement */}
          <ScrollReveal variant="fadeUp">
            <div className="mx-auto mt-8 max-w-prose rounded-xl border border-primary-200 bg-primary-50 p-6 text-center">
              <p className="text-body-md text-foreground">
                SafeTrekr brings professional travel safety assessment to
                mid-market companies. One system for all business travel.
                Documentation that demonstrates responsible preparation.
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
                FAQ
              </Eyebrow>
              <h2
                id="faq-heading"
                className="mx-auto max-w-[28ch] text-display-md text-foreground"
              >
                Common Questions
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
        body="See how SafeTrekr delivers professional travel planning for mid-market companies with clear accountability."
        primaryCta={{ text: "Schedule a Walkthrough", href: "/demo" }}
        secondaryCta={{
          text: "View Pricing",
          href: "/pricing",
        }}
      />
    </main>
  );
}
