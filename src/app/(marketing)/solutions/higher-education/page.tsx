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
  title: "Study Abroad Safety for Higher Education",
  description:
    "SafeTrekr assigns a professional safety analyst to review every study abroad program your institution sends -- across 17 dimensions of risk. Government intelligence. Clery Act documentation. Starting at $1,250 per international program.",
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
    title: "Intelligence Gathering",
    description:
      "Before your students arrive in-country, we pull real-time safety data from NOAA, USGS, CDC, ReliefWeb, and GDACS -- the same sources humanitarian agencies use to assess field conditions. Weather patterns at every program location. Seismic risk. Disease advisories. Political stability indicators. Every data point scored, not just collected.",
  },
  {
    number: 2,
    title: "Analyst Safety Review",
    description:
      "A trained safety analyst reviews every detail of your study abroad program across 17 sections -- host institution vetting, housing safety, in-country transportation, emergency medical facilities, evacuation routes, communication infrastructure, mental health resources, and more. Independent of the program provider. Independent of marketing materials.",
  },
  {
    number: 3,
    title: "Documented Evidence Binder",
    description:
      "Your institution receives a complete safety binder -- every review finding, every government data source, every decision documented with tamper-evident audit trails. When a parent asks what safety review was conducted, when the provost needs documentation for a Clery Act filing, when risk management requires evidence of due diligence for an insurance claim -- you hand them the binder.",
  },
];

const CHALLENGE_CARDS = [
  {
    icon: <FileText className="size-6" />,
    title: "Third-Party Provider Safety Assessments You Cannot Verify",
    description:
      "Program providers conduct their own safety reviews of their own programs. Your international education office receives summaries, not source data. When a parent asks what independent verification your institution performed, the honest answer is usually: we relied on the provider's word.",
  },
  {
    icon: <Shield className="size-6" />,
    title: "Risk Matrices Built from Travel Advisories and Google Searches",
    description:
      "Study abroad offices compile safety information from State Department advisories, news articles, and colleague networks. No standardized methodology. No government intelligence beyond what is publicly searchable. No audit trail documenting the assessment process.",
  },
  {
    icon: <Users className="size-6" />,
    title: "Clery Act Reporting Gaps for Off-Campus International Programs",
    description:
      "The Clery Act requires timely reporting of crimes and safety incidents at institution-controlled locations -- including study abroad sites. Many institutions lack the documentation infrastructure to demonstrate they monitored conditions at international program locations before incidents occurred.",
  },
  {
    icon: <AlertCircle className="size-6" />,
    title: "Title IX Obligations That Do Not Stop at the Border",
    description:
      "Title IX protections follow students abroad. If an incident occurs during a faculty-led program in Florence, your institution's response is evaluated by the same standards as an on-campus incident. Without documented safety planning and emergency protocols, the institutional exposure is significant.",
  },
];

const FEATURE_CARDS = [
  {
    icon: <ClipboardCheck className="size-6" />,
    title: "Every Program Location Reviewed by an Independent Analyst",
    description:
      "Your study abroad office focuses on student success. Our analyst focuses on safety. 17 sections covering host institutions, housing, transportation, emergency contacts, evacuation routes, local hospitals, mental health resources, and more -- independent of what the program provider tells you.",
    href: "/platform/analyst-review",
    linkText: "Learn about analyst review",
  },
  {
    icon: <MapPin className="size-6" />,
    title: "Government Data on Every Destination Your Students Visit",
    description:
      "Real-time intelligence from 5 government sources -- not a travel advisory summary. NOAA weather data, CDC health advisories, USGS seismic activity, and two international humanitarian agencies. Risk scored with Monte Carlo simulation so you understand probability, not just State Department color codes.",
    href: "/platform/risk-intelligence",
    linkText: "Learn about risk intelligence",
  },
  {
    icon: <FileText className="size-6" />,
    title: "Clery Act-Ready Documentation for Your Institution",
    description:
      "Every finding documented. Every data source cited. Every decision recorded with SHA-256 tamper-evident audit trails. The documentation your risk management office needs for Clery Act compliance, the evidence your general counsel needs for liability defense, and the proof parents need to trust your institution with their student.",
    href: "/platform/safety-binder",
    linkText: "Learn about the safety binder",
  },
  {
    icon: <Activity className="size-6" />,
    title:
      "Emergency Protocols and Check-Ins for Every Faculty Leader and Resident Director",
    description:
      "During your program, every faculty leader and resident director gets the SafeTrekr mobile app -- live geofencing, muster check-ins, rally point navigation, SMS broadcast, and morning/evening safety briefings. When a student does not check in, your international education office knows immediately -- not 12 hours later.",
    href: "/platform/mobile-app",
    linkText: "Learn about mobile operations",
  },
];

const BINDER_CONTENTS = [
  "Destination risk assessment with government intelligence data",
  "Host institution and housing safety verification",
  "Emergency medical facility locations including mental health resources",
  "Evacuation routes and contingency plans per program location",
  "In-country transportation safety evaluation",
  "Communication infrastructure and emergency contact protocols",
  "Tamper-evident audit trail with SHA-256 hash chain",
];

const PROOF_STATS = [
  {
    value: "17",
    label: "Analyst Review Sections",
    description:
      "Every program reviewed across host institutions, housing, transportation, emergency contacts, evacuation routes, health advisories, mental health resources, and more",
  },
  {
    value: "5",
    label: "Government Intelligence Sources",
    description:
      "NOAA, USGS, CDC, ReliefWeb, GDACS -- the same sources humanitarian agencies rely on to assess field conditions",
  },
  {
    value: "3-5 Days",
    label: "Submission to Binder Delivery",
    description:
      "Professional review and documentation delivered before your students depart for their program",
  },
];

const COMPARISON_ROWS = [
  {
    without:
      "Study abroad office compiles risk assessments from provider marketing materials and State Department advisories. No independent verification. No standardized methodology.",
    with: "Independent analyst completes 17-section review using 5 government intelligence sources. Methodology documented and auditable.",
  },
  {
    without:
      "Clery Act documentation assembled retroactively after an incident. No pre-departure evidence of safety monitoring at program sites.",
    with: "Clery Act-ready documentation delivered before students depart. Every program site independently assessed and documented.",
  },
  {
    without:
      'If something goes wrong: "We relied on the program provider\'s assessment" is your institutional defense.',
    with: "If something goes wrong: a complete evidence binder with every decision documented, every data source cited, and tamper-proof integrity.",
  },
  {
    without:
      "Average cost of a single student medical evacuation from Europe: $50,000-$100,000. Average litigation settlement for study abroad incidents: $500K-$2M.",
    with: "$1,250 per program for documented proof your institution conducted independent, professional safety verification.",
  },
];

const PRICING_FEATURES = [
  "17-section independent analyst review",
  "Government intelligence risk scoring",
  "Complete safety binder with audit trail",
  "Mobile app access for faculty leaders",
  "AM/PM safety briefings during program",
];

const PRICING_FEATURES_SEMESTER = [
  "17-section independent analyst review",
  "Government intelligence risk scoring",
  "Complete safety binder with audit trail",
  "Mobile app access for faculty leaders",
  "AM/PM safety briefings during program",
  "Mid-semester intelligence refresh",
];

const COMPLIANCE_BADGES = [
  {
    icon: <Shield className="size-8" />,
    title: "AES-256 Encryption",
    description:
      "All data encrypted at rest and in transit. Student information is protected with the same standard used by financial institutions. FERPA-aligned data handling.",
  },
  {
    icon: <FileText className="size-8" />,
    title: "SHA-256 Evidence Chain",
    description:
      "Every review finding, every analyst decision, every data source documented with cryptographic integrity. Tamper-evident by design. Audit-ready by default.",
  },
  {
    icon: <Activity className="size-8" />,
    title: "SOC 2 Type II",
    description:
      "Audit in progress. We are pursuing SOC 2 Type II certification to validate our security controls. (Status: In Progress)",
  },
  {
    icon: <ClipboardCheck className="size-8" />,
    title: "Clery Act Documentation Support",
    description:
      "Every binder is structured to provide the safety documentation your institution needs for Clery Act reporting and Title IX compliance when incidents occur at international program locations.",
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    question:
      "Does SafeTrekr replace our existing study abroad management system?",
    answer:
      "No. SafeTrekr is designed to complement systems like Terra Dotta, Via TRM, StudioAbroad, and custom institutional platforms. Your existing system manages program logistics -- applications, enrollment, housing assignments, academic credit. SafeTrekr adds the independent safety verification layer: professional analyst review, government intelligence scoring, and tamper-evident documentation. The safety binder integrates into your existing workflow as an additional document attached to each program's file.",
  },
  {
    question:
      "How does SafeTrekr handle semester-long programs where conditions may change?",
    answer:
      "Our analyst reviews specifically account for program duration. For semester-long programs, the initial safety binder covers pre-departure conditions. During the program, your faculty leaders and resident directors receive morning and evening safety briefings covering weather changes, political developments, health advisories, and local events. If conditions change significantly -- a political crisis, natural disaster, or public health emergency -- we issue an updated intelligence brief with current data and revised risk scoring.",
  },
  {
    question: "Can we use SafeTrekr for faculty-led short-term programs?",
    answer:
      "Yes. Faculty-led programs of any duration benefit from independent safety review. A two-week faculty-led program in Peru carries the same institutional liability as a semester program in London. Our review covers every program location -- primary sites, field trip destinations, and excursion stops. Many institutions start with SafeTrekr for faculty-led programs because faculty members rarely have formal risk assessment training.",
  },
  {
    question: "How does this help with Clery Act compliance?",
    answer:
      "The Clery Act requires institutions to report crimes and safety incidents at locations controlled by the institution -- including study abroad program sites. SafeTrekr's safety binder documents that your institution conducted a formal safety assessment of program locations before students arrived. If an incident occurs, the binder provides evidence that your institution proactively monitored conditions and identified risks. This is the documentation most institutions are missing from their Clery Act compliance infrastructure for international programs.",
  },
  {
    question: "What about Title IX obligations for programs abroad?",
    answer:
      "Title IX protections follow students to study abroad program locations. If an incident occurs during a program in Florence or Buenos Aires, your institution's response obligations are the same as for an on-campus incident. SafeTrekr's safety binder includes emergency protocol documentation, local law enforcement contacts, medical facility locations, and communication infrastructure assessment -- all the information your Title IX coordinator needs to mount an effective response from thousands of miles away.",
  },
  {
    question: "How quickly do we get the safety binder back?",
    answer:
      "3-5 business days from program submission to binder delivery. For programs planned months in advance, this timeline integrates naturally into your pre-departure preparation. For faculty-led programs with shorter planning windows, we prioritize submissions to meet departure schedules. If program conditions change after the initial review, our analyst can update the binder with current intelligence data.",
  },
  {
    question: "Can multiple offices access the safety binder?",
    answer:
      "Yes. You control access to each program's safety binder. It can be shared with your international education office, risk management, general counsel, the provost's office, program faculty, and any other stakeholder who needs to review safety preparation. The binder includes a verification hash that confirms the document has not been altered since the analyst completed the review -- providing every stakeholder with confidence in the document's integrity.",
  },
  {
    question: "How does pricing work for institutions with many programs?",
    answer:
      "Each program is priced at $1,250 for international programs. Institutions running 15 or more international programs per year qualify for volume pricing. A university sending 15 study abroad programs annually would pay approximately $18,750 before any volume discount -- less than the cost of a single student medical evacuation. Contact us for a custom quote that reflects your annual program calendar.",
  },
  {
    question: "Does SafeTrekr cover domestic programs and field trips?",
    answer:
      "Yes. While most higher education institutions start with international programs, SafeTrekr reviews domestic programs at $450 per program (day trips) and $750 per program (overnight/multi-day). Geology field courses in remote areas, marine biology programs at coastal stations, and education practicums in urban settings all benefit from professional safety review. The same 17-section analysis applies regardless of destination.",
  },
  {
    question: "What government data sources does SafeTrekr use?",
    answer:
      "Our Risk Intelligence Engine pulls data from five government and international agency sources: NOAA (weather and climate patterns), USGS (seismic and geological hazards), CDC (health advisories and disease outbreaks), GDACS (Global Disaster Alert and Coordination System), and ReliefWeb (UN humanitarian situation reports). Each data source is scored using Monte Carlo simulation to produce probability-weighted risk assessments -- not just binary safe/unsafe classifications.",
  },
  {
    question: "How does SafeTrekr handle programs with multiple sites?",
    answer:
      "Many study abroad programs involve multiple cities, field trip locations, and excursion destinations. Our analyst reviews each site independently -- the safety conditions in Barcelona's city center are different from those at a rural archaeological dig. Each location gets its own risk intelligence assessment. The final binder consolidates all sites into a single, comprehensive document with per-location findings and a unified emergency response plan.",
  },
  {
    question: "Can SafeTrekr handle programs in high-risk regions?",
    answer:
      "Yes. Some of the most academically valuable study abroad destinations are in regions with elevated risk profiles -- Sub-Saharan Africa, Southeast Asia, Central America, the Middle East. Our analyst reviews specifically account for infrastructure gaps, political instability, health system limitations, and communication challenges. The intelligence data from ReliefWeb and GDACS is designed for exactly these regions. The safety binder does not tell you whether to send students -- it documents the risks, mitigations, and emergency protocols so your institution can make an informed decision with defensible documentation.",
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
                STUDY ABROAD SAFETY
              </Eyebrow>

              <h1 className="text-display-xl max-w-[20ch] text-foreground">
                Your Study Abroad Programs Deserve a Safety Analyst
              </h1>

              <p className="mt-6 max-w-[50ch] text-body-lg text-muted-foreground">
                SafeTrekr brings professional safety review to every study abroad
                program, faculty-led trip, and international research expedition
                your institution sends. Government intelligence. 17-section
                analyst review. Clery Act-ready documentation that complements
                your existing study abroad systems -- not replaces them.
              </p>

              <div className="mt-8 flex flex-col flex-wrap gap-4 sm:flex-row">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/resources/sample-binders/study-abroad">
                    <Download className="size-[18px]" aria-hidden="true" />
                    Download Study Abroad Sample Binder
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
                  Study Abroad Safety Cannot Live in a Spreadsheet
                </h2>

                <p className="mt-6 max-w-prose text-body-lg text-muted-foreground">
                  Every year, universities send thousands of students to
                  unfamiliar countries through study abroad programs, faculty-led
                  trips, and international research placements. Most institutions
                  rely on third-party program providers to handle safety -- but
                  when the State Department issues a travel advisory, when a
                  natural disaster strikes, when a student is hospitalized
                  overseas, the institution&apos;s name is on the Clery Act
                  report. Not the provider&apos;s.
                </p>

                <p className="mt-4 max-w-prose text-body-lg font-medium text-foreground">
                  Your institution&apos;s reputation is not something a
                  third-party provider can protect for you.
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
                Professional Safety Review for Every International Program
              </h2>
              <p className="mx-auto mt-4 max-w-prose text-body-lg text-muted-foreground">
                SafeTrekr complements your existing study abroad management
                systems. We handle the independent safety verification your
                institution cannot get from a program provider.
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
                  See Exactly What Your Provost and Risk Management Office Will
                  Receive
                </h2>

                <p className="mt-6 max-w-prose text-body-lg text-muted-foreground">
                  Every SafeTrekr review produces a comprehensive safety binder
                  customized to your study abroad program. This is not a generic
                  country profile or a program provider&apos;s marketing summary.
                  It is the documented output of an independent analyst reviewing
                  your specific program -- your destinations, your dates, your
                  housing, your host institutions.
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
              The difference between an institution that documented its safety
              diligence and one that assumed a program provider handled it is not
              measured in intention. It is measured in the filing cabinet.
              SafeTrekr produces the independent, third-party documentation that
              transforms your institution&apos;s commitment to student safety
              from an unverifiable assertion into defensible evidence.
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
                Professional Safety Review at a Fraction of Your Program Cost
              </h2>
              <p className="mt-4 max-w-prose text-body-lg text-muted-foreground">
                A professional safety review for a semester-long study abroad
                program costs less than one percent of a typical
                participant&apos;s program fee. That is the cost of independent,
                documented safety verification for every student your institution
                sends abroad.
              </p>
            </div>
          </ScrollReveal>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* International Program */}
            <ScrollReveal variant="fadeUp">
              <div className="rounded-2xl border border-primary-400 bg-card p-8 shadow-md">
                <Badge variant="brand" className="mb-4 text-xs">
                  Most Common
                </Badge>
                <div
                  className="font-display text-5xl font-bold text-foreground"
                  aria-label="$1,250 per international study abroad program"
                >
                  $1,250
                </div>
                <div className="mt-1 text-body-md text-muted-foreground">
                  per international program
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    $50 per student for a group of 25
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Less than 1% of a $12,000 program fee
                  </p>
                </div>
                <div className="mt-6 border-t border-border pt-6">
                  <ul className="space-y-3">
                    {PRICING_FEATURES.map((feature) => (
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

            {/* Semester Program */}
            <ScrollReveal variant="fadeUp" delay={0.1}>
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <div className="mt-6 font-display text-5xl font-bold text-foreground"
                  aria-label="$1,250 per semester study abroad program"
                >
                  $1,250
                </div>
                <div className="mt-1 text-body-md text-muted-foreground">
                  per semester program
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    $42 per student for a group of 30
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Less than 0.3% of a $15,000 semester program fee
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Includes mid-semester condition updates
                  </p>
                </div>
                <div className="mt-6 border-t border-border pt-6">
                  <ul className="space-y-3">
                    {PRICING_FEATURES_SEMESTER.map((feature) => (
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

            {/* Multi-Program Institution */}
            <ScrollReveal variant="fadeUp" delay={0.2}>
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <div className="mt-6 font-display text-5xl font-bold text-foreground">
                  Custom
                </div>
                <div className="mt-1 text-body-md text-muted-foreground">
                  volume pricing for 15+ programs per year
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    A university sending 15 international programs per year:
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    $18,750/year for complete safety coverage
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Volume discounts available for 15+ programs annually
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
                The Cost of Not Having an Independent Safety Review
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
                Built to Satisfy Your Risk Management Office and General Counsel
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

          {/* Institutional Narrative Block */}
          <ScrollReveal variant="fadeUp">
            <div className="mt-12 text-center">
              <h3 className="text-heading-md text-foreground">
                Your Risk Management Office Will Thank You
              </h3>
              <p className="mx-auto mt-4 max-w-prose text-body-lg text-muted-foreground">
                Most universities accept program provider assurances as their
                primary safety verification for international programs. The
                problem is that a provider&apos;s self-assessment is not
                independent evidence. When a parent&apos;s attorney asks what
                independent safety review your institution conducted before
                sending their student abroad, a provider&apos;s marketing
                materials are not a defensible answer. SafeTrekr produces the
                independent documentation: a professional 17-section safety
                review backed by government intelligence data, documented with
                tamper-evident audit trails. That is the evidence your general
                counsel and risk management office need.
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
                Everything Your International Education Office Will Ask
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
        headline="Protect Your Next Study Abroad Program"
        body="See exactly what an independently reviewed study abroad program looks like. Download a sample binder or schedule a 30-minute demo with our team."
        primaryCta={{ text: "Get a Demo", href: "/demo" }}
        secondaryCta={{
          text: "Download Sample Binder",
          href: "/resources/sample-binders/study-abroad",
        }}
      />
    </main>
  );
}
