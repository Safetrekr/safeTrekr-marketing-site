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
  title: "Business & Sports Travel Safety for Corporate Teams",
  description:
    "SafeTrekr assigns a professional safety analyst to review every business trip, team retreat, and tournament your organization sends -- across 17 dimensions of risk. Government intelligence. Duty of care documentation. Enterprise safety at per-trip pricing.",
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
    title: "Intelligence Gathering",
    description:
      "Before your team departs, we pull real-time safety data from NOAA, USGS, CDC, ReliefWeb, and GDACS -- the same sources Fortune 500 corporate security teams use to assess destination conditions. Weather patterns, seismic risk, disease advisories, political stability, and local security conditions. Every data point scored with Monte Carlo simulation, not just flagged.",
  },
  {
    number: 2,
    title: "Analyst Safety Review",
    description:
      "A trained safety analyst reviews every detail of your trip across 17 sections -- venue safety, lodging assessment, ground transportation, emergency medical facilities, evacuation routes, communication infrastructure, local law enforcement contacts, and more. For sports organizations, the review includes tournament venue assessment and SafeSport protocol documentation.",
  },
  {
    number: 3,
    title: "Documented Evidence Binder",
    description:
      "Your organization receives a complete safety binder -- every review finding, every government data source, every decision documented with tamper-evident audit trails. When HR needs duty of care evidence for a workers' comp claim, when legal counsel needs to demonstrate reasonable precautions, when a parent asks what safety review was conducted before their child traveled to a tournament -- you hand them the binder.",
  },
];

const CHALLENGE_CARDS = [
  {
    icon: <FileText className="size-6" />,
    title: "Travel Policies That Exist on Paper but Not in Practice",
    description:
      'Most mid-market organizations have a travel policy. Few have a process that verifies safety conditions at every destination before employees or athletes depart. The policy says "assess risks." The reality is a Google search and an assumption that the hotel is fine.',
  },
  {
    icon: <Users className="size-6" />,
    title: "Minor Athletes Traveling Without Formal Safety Documentation",
    description:
      "Youth sports organizations transport minors to tournaments across state lines -- sometimes internationally. SafeSport requires documented safety protocols. Most organizations rely on a volunteer coach's judgment and a parent permission slip as their entire safety infrastructure.",
  },
  {
    icon: <Shield className="size-6" />,
    title: "Duty of Care Obligations Without Duty of Care Evidence",
    description:
      'When an employee is injured during business travel or an athlete is harmed during a tournament, the first question from legal counsel is: "What did you do to assess the risk?" A travel booking confirmation and a hotel receipt are not evidence of due diligence. They are evidence of logistics.',
  },
  {
    icon: <AlertCircle className="size-6" />,
    title:
      "Workers' Comp and Liability Claims Without Supporting Documentation",
    description:
      'Workers\' compensation claims for travel injuries require evidence that the employer assessed and mitigated foreseeable risks. Sports liability claims require evidence of reasonable safety precautions. Without documented risk assessment, your organization\'s defense is: "We did not think it would happen."',
  },
];

const FEATURE_CARDS = [
  {
    icon: <ClipboardCheck className="size-6" />,
    title: "Every Destination Reviewed by a Professional Analyst",
    description:
      "Your travel coordinator books the trip. Our analyst reviews the safety. 17 sections covering venues, lodging, ground transportation, emergency contacts, evacuation routes, local hospitals, weather windows, and more. For sports organizations: tournament venue assessment and SafeSport compliance documentation included.",
    href: "/platform/analyst-review",
    linkText: "Learn about analyst review",
  },
  {
    icon: <MapPin className="size-6" />,
    title: "Government Data on Every Destination Your Team Visits",
    description:
      "Real-time intelligence from 5 government sources -- not a travel advisory website. NOAA weather data, CDC health advisories, USGS seismic activity, and two international humanitarian agencies. Risk scored with Monte Carlo simulation so your risk manager understands probability, not just possibility.",
    href: "/platform/risk-intelligence",
    linkText: "Learn about risk intelligence",
  },
  {
    icon: <FileText className="size-6" />,
    title: "Duty of Care Documentation Your Legal Team Can Defend",
    description:
      "Every finding documented. Every data source cited. Every decision recorded with SHA-256 tamper-evident audit trails. The documentation your HR department needs for workers' comp claims, the evidence your legal counsel needs for liability defense, and the proof your organization met its duty of care obligation.",
    href: "/platform/safety-binder",
    linkText: "Learn about the safety binder",
  },
  {
    icon: <Activity className="size-6" />,
    title:
      "Emergency Contacts, Rally Points, and Check-Ins for Every Trip Leader",
    description:
      "During your trip, every team leader gets the SafeTrekr mobile app -- live geofencing, muster check-ins, rally point navigation, SMS broadcast, and morning/evening safety briefings. For tournament travel: coach and chaperone check-in protocols that document SafeSport compliance in real time.",
    href: "/platform/mobile-app",
    linkText: "Learn about mobile operations",
  },
];

const BINDER_CONTENTS = [
  "Destination risk assessment with government intelligence data",
  "Venue and lodging safety verification",
  "Emergency medical facility locations and contact information",
  "Evacuation routes and contingency plans",
  "Ground transportation safety evaluation",
  "Communication infrastructure and emergency contact protocols",
  "Tamper-evident audit trail with SHA-256 hash chain",
];

const PROOF_STATS = [
  {
    value: "17",
    label: "Analyst Review Sections",
    description:
      "Every trip reviewed across venues, lodging, transportation, emergency contacts, evacuation routes, weather, health advisories, and more",
  },
  {
    value: "5",
    label: "Government Intelligence Sources",
    description:
      "NOAA, USGS, CDC, ReliefWeb, GDACS -- the same sources Fortune 500 corporate security teams use",
  },
  {
    value: "3-5 Days",
    label: "Submission to Binder Delivery",
    description:
      "Professional review and documentation delivered before your team departs -- no multi-month enterprise onboarding",
  },
];

const COMPARISON_ROWS = [
  {
    without:
      "Travel coordinator books flights and hotels. No formal safety assessment of destination conditions. HR checks a box on the travel policy.",
    with: "Professional analyst completes 17-section review of every destination. Government intelligence data scored and documented.",
  },
  {
    without:
      'Workers\' comp claim for a travel injury: "Did the employer assess foreseeable risks at the destination?" No documentation to support the answer.',
    with: "Workers' comp claim supported by a complete evidence binder documenting every risk assessment, every data source, every mitigation decision.",
  },
  {
    without:
      "Youth tournament travel: coach drives the team, books the hotel, and trusts the tournament venue. SafeSport compliance is verbal, not documented.",
    with: "Tournament safety binder documents venue assessment, emergency protocols, SafeSport compliance, and supervision plans -- before the team departs.",
  },
  {
    without:
      "Average cost of a single business travel liability claim: $250K-$1M. Average workers' comp cost for international travel injury: $50K-$200K.",
    with: "$450-$1,250 per trip for documented proof your organization met its duty of care obligation.",
  },
];

const PRICING_FEATURES_DOMESTIC = [
  "17-section professional analyst review",
  "Government intelligence risk scoring",
  "Complete safety binder with audit trail",
  "Mobile app access for trip leaders",
  "AM/PM safety briefings during trip",
];

const PRICING_FEATURES_INTERNATIONAL = [
  "17-section professional analyst review",
  "Government intelligence risk scoring",
  "Complete safety binder with audit trail",
  "Mobile app access for trip leaders",
  "AM/PM safety briefings during trip",
  "SafeSport protocol documentation (sports organizations)",
];

const COMPLIANCE_BADGES = [
  {
    icon: <Shield className="size-8" />,
    title: "AES-256 Encryption",
    description:
      "All data encrypted at rest and in transit. Employee and athlete information is protected with the same standard used by financial institutions.",
  },
  {
    icon: <FileText className="size-8" />,
    title: "SHA-256 Evidence Chain",
    description:
      "Every review finding, every analyst decision, every data source documented with cryptographic integrity. Tamper-evident by design. Litigation-ready by default.",
  },
  {
    icon: <Activity className="size-8" />,
    title: "SOC 2 Type II",
    description:
      "Audit in progress. We are pursuing SOC 2 Type II certification to validate our security controls. (Status: In Progress)",
  },
  {
    icon: <ClipboardCheck className="size-8" />,
    title: "Duty of Care & SafeSport Documentation",
    description:
      "Every binder is structured to provide the duty of care evidence your legal team needs and the SafeSport compliance documentation your sports organization requires.",
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Is SafeTrekr just for international trips?",
    answer:
      "No. Any trip that takes your employees or athletes away from their normal work or training environment benefits from professional safety review. Domestic business travel to unfamiliar cities, regional conferences, client site visits, and domestic tournaments all carry risks that your organization has a duty to assess. Our domestic trip review costs $450. International review costs $1,250. The same 17-section analysis applies regardless of destination.",
  },
  {
    question: "How does SafeTrekr help with duty of care compliance?",
    answer:
      'Duty of care requires organizations to take reasonable steps to protect the health and safety of employees during work-related activities -- including travel. SafeTrekr produces the documented evidence that your organization conducted a professional safety assessment before each trip. The safety binder includes government intelligence data, venue assessments, emergency protocols, and evacuation plans -- all documented with tamper-evident audit trails. This is the evidence your legal team needs to demonstrate that "reasonable steps" were taken.',
  },
  {
    question:
      "Can sports organizations use SafeTrekr for tournament travel?",
    answer:
      "Yes. SafeTrekr is specifically designed to handle tournament travel for youth and adult sports organizations. Our analyst reviews tournament venues, hotel safety, ground transportation, emergency medical facilities, and local conditions. For organizations transporting minor athletes, the safety binder includes SafeSport compliance documentation, supervision protocols, and emergency contact procedures. Every tournament gets the same 17-section review as a corporate business trip.",
  },
  {
    question: "What about SafeSport compliance for youth sports?",
    answer:
      "The SafeSport Act requires youth-serving sports organizations to implement safety policies and report abuse. SafeTrekr's safety binder documents the safety protocols your organization established for each tournament or travel event -- venue assessments, supervision plans, emergency procedures, and communication protocols. This documentation supports your SafeSport compliance obligations and provides evidence of proactive safety planning when reporting is required.",
  },
  {
    question: "How quickly do we get the safety binder back?",
    answer:
      "3-5 business days from trip submission to binder delivery. For organizations that plan travel well in advance, this timeline fits naturally into your booking process. For last-minute travel, we prioritize submissions to meet departure schedules. If destination conditions change after the initial review, our analyst can update the binder with current intelligence data.",
  },
  {
    question: "Do we need to sign an annual contract?",
    answer:
      "No. SafeTrekr operates on a per-trip basis. No annual contract. No minimum trip count. No multi-month enterprise onboarding. Submit a trip, receive a safety binder, pay per trip. Organizations sending 15 or more trips per year qualify for volume pricing, but there is no obligation to commit to a volume upfront. Start with one trip. Scale from there.",
  },
  {
    question:
      "Can our travel coordinator submit trips on behalf of team leaders?",
    answer:
      "Yes. Trip submission is a guided 10-step wizard that takes 15-20 minutes. Your travel coordinator, HR team, or any designated administrator can submit trips on behalf of team leaders. The mobile app for field operations is then shared with the actual trip leaders -- team managers, coaches, or department heads -- who need the safety information during the trip.",
  },
  {
    question: "How does pricing work for organizations with many trips?",
    answer:
      "Each trip is priced independently -- $450 for domestic, $750 for extended domestic (multi-day), $1,250 for international. Organizations booking 15 or more trips per year qualify for volume pricing. A company sending 15 domestic trips and 5 international trips per year would pay approximately $13,000 before any volume discount. Contact us for a custom quote that reflects your annual travel schedule.",
  },
  {
    question: "What does the mobile app provide during the trip?",
    answer:
      "Every trip leader gets the SafeTrekr mobile app with live geofencing, muster check-ins, rally point navigation, SMS broadcast capability, and morning/evening safety briefings. For sports organizations, the app includes coach check-in protocols and participant welfare documentation. The app works in offline mode when cell service is unavailable -- critical information like emergency contacts, rally points, and evacuation routes are accessible without connectivity.",
  },
  {
    question:
      "Can SafeTrekr handle international business travel to high-risk regions?",
    answer:
      "Yes. Many business trips involve destinations with elevated risk profiles -- emerging markets, regions with political instability, or locations with limited medical infrastructure. Our analyst reviews specifically account for these conditions, and our intelligence data from ReliefWeb and GDACS is designed for exactly these regions. The safety binder documents the risks, mitigations, and emergency protocols so your organization can make informed travel decisions with defensible documentation.",
  },
  {
    question:
      "How does SafeTrekr compare to travel risk management platforms?",
    answer:
      "Enterprise travel risk management (TRM) platforms like International SOS, WorldAware, or Crisis24 serve large corporations with dedicated security teams and six-figure annual budgets. SafeTrekr provides the core safety documentation these platforms generate -- professional risk assessment, government intelligence, and audit-ready evidence -- at a per-trip price point accessible to mid-market organizations. No annual contract, no minimum commitment, no implementation project. If your organization outgrows per-trip pricing, we offer volume plans that scale with your travel program.",
  },
  {
    question:
      "Can legal counsel and risk management access the safety binder directly?",
    answer:
      "Yes. You control access to each trip's safety binder. It can be shared with legal counsel, risk management, HR, insurance carriers, or any other stakeholder who needs to review safety preparation. The binder includes a verification hash that confirms the document has not been altered since the analyst completed the review -- providing every stakeholder with confidence in the document's integrity. For litigation purposes, the tamper-evident audit trail provides cryptographic proof of when each review was conducted and what data was available at the time of assessment.",
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
                BUSINESS &amp; SPORTS TRAVEL SAFETY
              </Eyebrow>

              <h1 className="text-display-xl max-w-[20ch] text-foreground">
                Enterprise Safety at Per-Trip Pricing
              </h1>

              <p className="mt-6 max-w-[50ch] text-body-lg text-muted-foreground">
                SafeTrekr brings the same professional safety review that
                Fortune 500 companies use for executive travel to every business
                trip, team retreat, and tournament your organization sends.
                Government intelligence. 17-section analyst review. Duty of care
                documentation that protects your people and your organization.
              </p>

              <div className="mt-8 flex flex-col flex-wrap gap-4 sm:flex-row">
                <Button variant="primary" size="lg" asChild>
                  <Link
                    href="/resources/sample-binders/corporate-travel"
                    aria-label="Download Corporate Travel Sample Binder, opens email-gated form"
                  >
                    <Download className="size-[18px]" aria-hidden="true" />
                    Download Corporate Travel Sample Binder
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/demo">
                    Get a Demo
                    <ArrowRight className="size-[18px]" aria-hidden="true" />
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
                  THE REALITY TODAY
                </Eyebrow>

                <h2
                  id="challenge-heading"
                  className="text-display-md max-w-[28ch] text-foreground"
                >
                  Duty of Care Is Not Optional. Documentation Is.
                </h2>

                <p className="mt-6 max-w-prose text-body-lg text-muted-foreground">
                  Every organization that sends employees, contractors, or
                  athletes on trips has a legal duty of care. For corporate
                  teams, that means business travel to client sites, conferences,
                  and international offices. For sports organizations, that means
                  tournament travel, training camps, and away games -- often
                  transporting minor athletes across state lines. Most mid-market
                  organizations know the obligation exists. Few can document how
                  they met it.
                </p>

                <p className="mt-4 max-w-prose text-body-lg font-medium text-foreground">
                  Enterprise safety programs should not require enterprise
                  budgets to document.
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
                HOW SAFETREKR WORKS
              </Eyebrow>
              <h2
                id="solution-heading"
                className="mx-auto max-w-[28ch] text-display-md text-foreground"
              >
                Professional Safety Review for Every Business Trip and
                Tournament
              </h2>
              <p className="mx-auto mt-4 max-w-prose text-body-lg text-muted-foreground">
                From trip submission to safety binder delivery in 3-5 days. No
                enterprise contract required. No minimum commitment. Here is
                exactly what happens.
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
                  See Exactly What Your Risk Manager and Legal Counsel Will
                  Receive
                </h2>

                <p className="mt-6 max-w-prose text-body-lg text-muted-foreground">
                  Every SafeTrekr review produces a comprehensive safety binder
                  customized to your specific trip. This is not a generic travel
                  advisory or a destination fact sheet. It is the documented
                  output of a professional analyst reviewing your specific trip
                  -- your destinations, your dates, your venues, your team size,
                  your activities.
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
                    aria-label="Download the Corporate Travel Sample Binder, opens email-gated form"
                  >
                    <Download className="size-[18px]" aria-hidden="true" />
                    Download the Corporate Travel Sample Binder
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
                Fortune 500 Documentation Without the Fortune 500 Contract
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
              Large enterprises have dedicated corporate security teams, travel
              risk management platforms, and six-figure annual budgets for
              employee safety programs. Mid-market organizations have the same
              duty of care obligations -- but not the same resources. SafeTrekr
              gives every organization the documented safety evidence that
              Fortune 500 companies take for granted, at a price point that
              works trip by trip.
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
                Per-Trip Pricing. No Enterprise Contract Required.
              </h2>
              <p className="mt-4 max-w-prose text-body-lg text-muted-foreground">
                Every trip your organization sends -- from a regional sales
                meeting to an international tournament -- gets the same
                professional safety review. No annual minimums. No enterprise
                onboarding. Pay per trip, scale as you grow.
              </p>
            </div>
          </ScrollReveal>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Domestic Business Trip */}
            <ScrollReveal variant="fadeUp">
              <div className="rounded-2xl border border-primary-400 bg-card p-8 shadow-md">
                <Badge variant="brand" className="mb-4 text-xs">
                  Most Common
                </Badge>
                <div
                  className="font-display text-5xl font-bold text-foreground"
                  aria-label="$450 per domestic business trip"
                >
                  $450
                </div>
                <div className="mt-1 text-body-md text-muted-foreground">
                  per domestic trip
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    $45 per person for a team of 10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Less than the cost of one night&apos;s hotel
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

            {/* International Business / Tournament Trip */}
            <ScrollReveal variant="fadeUp" delay={0.1}>
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <div
                  className="mt-6 font-display text-5xl font-bold text-foreground"
                  aria-label="$1,250 per international trip"
                >
                  $1,250
                </div>
                <div className="mt-1 text-body-md text-muted-foreground">
                  per international trip
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    $50 per person for a team of 25
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Less than 2% of a typical international team travel budget
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Includes SafeSport compliance documentation for youth sports
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

            {/* Multi-Trip Organization */}
            <ScrollReveal variant="fadeUp" delay={0.2}>
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <div className="mt-6 font-display text-5xl font-bold text-foreground">
                  Custom
                </div>
                <div className="mt-1 text-body-md text-muted-foreground">
                  volume pricing for 15+ trips per year
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    A company sending 15 domestic + 5 international trips per
                    year:
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    $13,000/year for complete duty of care coverage
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Volume discounts available for 15+ trips annually
                  </p>
                </div>
                <div className="mt-6">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    asChild
                  >
                    <Link href="/demo">Get a Custom Quote</Link>
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Cost-of-Inaction Comparison Block */}
          <ScrollReveal variant="fadeUp">
            <div className="mt-12 rounded-xl border border-border bg-card p-8">
              <h3 className="mb-6 text-heading-md text-foreground">
                The Cost of Not Having Duty of Care Documentation
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
                      Without SafeTrekr
                    </th>
                    <th
                      className="w-1/2 pb-4 text-left text-body-sm font-semibold text-primary-700"
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
                SECURITY &amp; COMPLIANCE
              </Eyebrow>
              <h2
                id="compliance-heading"
                className="mx-auto max-w-[28ch] text-display-md text-foreground"
              >
                Built to Satisfy Your Legal, HR, and Insurance Requirements
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

          {/* Corporate Narrative Block */}
          <ScrollReveal variant="fadeUp">
            <div className="mt-12 text-center">
              <h3 className="text-heading-md text-foreground">
                Your Legal Team and Insurance Carrier Will Thank You
              </h3>
              <p className="mx-auto mt-4 max-w-prose text-body-lg text-muted-foreground">
                Duty of care is a legal obligation, not a best practice. When an
                employee is injured during business travel or an athlete is
                harmed during a tournament, the question is not whether your
                organization had a duty of care -- it always did. The question is
                whether your organization can document that it met that
                obligation. SafeTrekr produces the documentation: a professional
                17-section safety review backed by government intelligence data,
                documented with tamper-evident audit trails. That is the
                difference between defensible evidence and organizational
                exposure.
              </p>
            </div>
          </ScrollReveal>

          {/* Mid-Market Positioning Statement */}
          <ScrollReveal variant="fadeUp">
            <div className="mx-auto mt-8 max-w-prose rounded-xl border border-primary-200 bg-primary-50 p-6 text-center">
              <p className="text-body-md text-foreground">
                SafeTrekr is built for mid-market organizations that need
                enterprise-grade safety documentation without enterprise-grade
                budgets, procurement cycles, or implementation timelines. No
                annual contract. No minimum trip count. No multi-month
                onboarding. Start with one trip. Scale from there.
              </p>
            </div>
          </ScrollReveal>

          {/* Procurement Link */}
          <ScrollReveal variant="fadeUp">
            <div className="mt-8 text-center">
              <p className="text-body-md text-muted-foreground">
                Institutional buyer? Download our W-9, security questionnaire
                responses, and insurance documentation.
              </p>
              <Link
                href="/procurement"
                className="mt-2 inline-flex items-center gap-1 text-body-md font-medium text-primary-700"
              >
                Visit our procurement page
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
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
                Everything Your Risk Manager and HR Director Will Ask
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
        headline="Protect Your Next Business Trip or Tournament"
        body="See exactly what a professionally reviewed business trip looks like. Download a sample binder or schedule a 30-minute demo with our team."
        primaryCta={{ text: "Get a Demo", href: "/demo" }}
        secondaryCta={{
          text: "Download Sample Binder",
          href: "/resources/sample-binders/corporate-travel",
        }}
      />
    </main>
  );
}
