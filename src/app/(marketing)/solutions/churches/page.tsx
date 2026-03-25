/**
 * ST-870: REQ-063 -- Church/Missions Solutions Page (/solutions/churches)
 *
 * Beachhead segment page for churches and mission organizations. This is the
 * deepest, most conversion-optimized segment page in the SafeTrekr marketing
 * site. It builds a full-funnel narrative from problem awareness through
 * pricing context to conversion.
 *
 * Server Component composing pre-built components from Waves 0-3.
 *
 * Section order:
 *   1. Hero             -- Breadcrumb, headline, dual CTAs, hero visual
 *   2. TrustStrip       -- 5 trust metrics + intel source bar
 *   3. The Challenge    -- "Good Intentions Are Not a Safety Plan" + 4 cards
 *   4. How It Works     -- 3-act ProcessTimeline + 4 FeatureCards
 *   5. Sample Binder    -- Fanned binder visual + checklist + gated CTA
 *   6. Proof Points     -- DARK section with stat cards + proof narrative
 *   7. Pricing Context  -- 3 scenario cards + cost comparison table
 *   8. Compliance       -- 4 trust badges + insurance narrative
 *   9. FAQ              -- 12 church-specific questions with JSON-LD
 *  10. CTA Band         -- DARK "Protect Your Next Mission Trip"
 *
 * Church vocabulary: duty of care, volunteer screening, mission field safety,
 * stewardship, youth protection.
 *
 * @see designs/html/mockup-church-solutions.html
 */

import Link from "next/link";
import {
  Shield,
  AlertTriangle,
  FileText,
  Users,
  AlertCircle,
  ClipboardCheck,
  MapPin,
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "Mission Trip Safety for Churches & Mission Organizations",
  description:
    "SafeTrekr assigns a professional safety analyst to review every mission trip your church sends -- across 17 dimensions of risk. Government intelligence. Audit-ready documentation. Starting at $450 per trip.",
  path: "/solutions/churches",
});

// ---------------------------------------------------------------------------
// Structured Data
// ---------------------------------------------------------------------------

const BREADCRUMB_ITEMS = [
  { name: "Home", url: "https://safetrekr.com/" },
  { name: "Solutions", url: "https://safetrekr.com/solutions" },
  {
    name: "Churches & Mission Organizations",
    url: "https://safetrekr.com/solutions/churches",
  },
];

// ---------------------------------------------------------------------------
// Data Constants
// ---------------------------------------------------------------------------

const PROCESS_STEPS = [
  {
    number: 1,
    title: "Intelligence Gathering",
    description:
      "Before your team boards a plane, we pull real-time safety data from NOAA, USGS, CDC, ReliefWeb, and GDACS -- the same sources humanitarian agencies use to assess field conditions. Weather patterns at your destination. Seismic risk. Disease advisories. Local security conditions. Every data point scored, not just collected.",
  },
  {
    number: 2,
    title: "Analyst Safety Review",
    description:
      "A trained safety analyst reviews every detail of your mission trip across 17 sections -- host organization vetting, lodging safety, in-country transportation, emergency medical facilities, evacuation routes, communication infrastructure, water and food safety, and more. They flag what needs attention and document what is ready.",
  },
  {
    number: 3,
    title: "Documented Evidence Binder",
    description:
      "Your church receives a complete safety binder -- every review finding, every government data source, every decision documented with tamper-evident audit trails. When your insurance carrier asks what you did to prepare, when your church board wants to see the safety plan, when a concerned parent asks how you assessed the risk -- you hand them the binder.",
  },
] as const;

const FEATURE_CARDS = [
  {
    icon: <ClipboardCheck className="size-6" />,
    title: "Every Mission Field Reviewed by a Professional Analyst",
    description:
      "Your trip leader focuses on ministry. Our analyst focuses on safety. 17 sections covering venues, lodging, transportation, emergency contacts, evacuation routes, local hospitals, weather windows, and more.",
    href: "/platform/analyst-review",
    linkText: "Learn about analyst review",
  },
  {
    icon: <MapPin className="size-6" />,
    title: "Government Data on Every Destination Your Team Visits",
    description:
      "Real-time intelligence from 5 government sources -- not a Google search. NOAA weather data, CDC health advisories, USGS seismic activity, and two international humanitarian agencies. Risk scored with Monte Carlo simulation so you understand probability, not just possibility.",
    href: "/platform/risk-intelligence",
    linkText: "Learn about risk intelligence",
  },
  {
    icon: <FileText className="size-6" />,
    title: "Audit-Ready Documentation for Your Insurance Carrier and Board",
    description:
      "Every finding documented. Every data source cited. Every decision recorded with SHA-256 tamper-evident audit trails. The binder your insurance carrier wishes every church had -- and the one your board will thank you for.",
    href: "/platform/safety-binder",
    linkText: "Learn about the safety binder",
  },
  {
    icon: <Activity className="size-6" />,
    title:
      "Rally Points, Check-Ins, and Emergency Contacts in Every Chaperone's Pocket",
    description:
      "During your mission trip, every team leader gets the SafeTrekr mobile app -- live geofencing, muster check-ins, rally point navigation, SMS broadcast, and morning/evening safety briefings. No cell tower? Offline mode keeps critical information accessible.",
    href: "/platform/mobile-app",
    linkText: "Learn about mobile operations",
  },
] as const;

const CHALLENGE_CARDS = [
  {
    icon: <FileText className="size-6" />,
    title: "Volunteer-Assembled Trip Binders",
    description:
      "Trip leaders compile safety information from Google searches, past experience, and other churches' templates. No standardized review process. No professional verification.",
  },
  {
    icon: <Shield className="size-6" />,
    title: "Insurance Questionnaires Answered with Guesswork",
    description:
      'When carriers ask "Have you conducted a formal risk assessment?" -- the honest answer is usually no. Checking "yes" without documentation creates liability, not coverage.',
  },
  {
    icon: <Users className="size-6" />,
    title: "Volunteer Screening Without Verification",
    description:
      "Background check policies vary by denomination. Even churches with screening protocols rarely extend them to mission trip contexts or verify them across state lines.",
  },
  {
    icon: <AlertCircle className="size-6" />,
    title: "No Audit Trail When It Matters",
    description:
      "If a team member is injured in Honduras, what documentation proves your church took reasonable precautions? A prayer list and a group text thread are not evidence of due diligence.",
  },
] as const;

const BINDER_CHECKLIST = [
  "Destination risk assessment with government intelligence data",
  "Venue and lodging safety verification",
  "Emergency medical facility locations and contact information",
  "Evacuation routes and contingency plans",
  "Transportation safety evaluation",
  "Communication infrastructure assessment",
  "Tamper-evident audit trail with SHA-256 hash chain",
] as const;

const PRICING_FEATURES = [
  "17-section professional analyst review",
  "Government intelligence risk scoring",
  "Complete safety binder with audit trail",
  "Mobile app access for team leaders",
  "AM/PM safety briefings during trip",
] as const;

const COST_COMPARISON_ROWS = [
  {
    without:
      "40-60 hours of volunteer time per international trip assembling safety information from scattered sources",
    withSafeTrekr:
      "Professional analyst completes 17-section review in 3-5 days. Your volunteer team focuses on ministry preparation.",
  },
  {
    without:
      "Insurance questionnaires answered with best guesses. No formal risk assessment documentation.",
    withSafeTrekr:
      "Every insurance question answered with cited evidence. Formal risk assessment your carrier can audit.",
  },
  {
    without:
      'If something goes wrong: "We did our best" is your only defense.',
    withSafeTrekr:
      "If something goes wrong: a complete evidence binder with every decision documented and tamper-proof.",
  },
  {
    without:
      "Average cost of a single medical evacuation from Central America: $25,000-$50,000.",
    withSafeTrekr:
      "$1,250 for documented proof you took every reasonable precaution.",
  },
] as const;

const TRUST_BADGES = [
  {
    icon: <Shield className="size-8" />,
    title: "AES-256 Encryption",
    description:
      "All data encrypted at rest and in transit. Your team's information is protected with the same standard used by financial institutions.",
  },
  {
    icon: <FileText className="size-8" />,
    title: "SHA-256 Evidence Chain",
    description:
      "Every review finding, every analyst decision, every data source documented with cryptographic integrity. Tamper-evident by design.",
  },
  {
    icon: <Activity className="size-8" />,
    title: "SOC 2 Type II",
    description:
      "Audit in progress. We are pursuing SOC 2 Type II certification to validate our security controls. (Status: In Progress)",
  },
  {
    icon: <ClipboardCheck className="size-8" />,
    title: "Insurance-Ready Documentation",
    description:
      "Every binder is structured to satisfy the safety documentation requirements your insurance carrier needs to process claims and assess coverage.",
  },
] as const;

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Do we need SafeTrekr for domestic mission trips too?",
    answer:
      "Yes. A domestic mission trip still involves transporting volunteers -- often including minors -- to unfamiliar locations. Your duty of care obligation does not depend on whether you cross a border. A domestic trip to rural Appalachia carries weather risk, transportation risk, venue safety considerations, and emergency access challenges that deserve the same professional review as an international trip. Our domestic mission trip review costs $450.",
  },
  {
    question:
      "How does SafeTrekr handle international destinations with limited infrastructure?",
    answer:
      "Our analyst reviews specifically account for infrastructure gaps. When a destination has limited emergency medical facilities, unreliable communication networks, or poor road conditions, those factors are documented in the binder -- along with contingency plans. Our intelligence data from ReliefWeb and GDACS is specifically designed for regions where standard travel advisories fall short. Many of the destinations churches send mission teams are exactly the places that need the most thorough safety review.",
  },
  {
    question: "Can our volunteer trip leader use this without training?",
    answer:
      "Yes. Trip submission is a guided 10-step wizard that takes 15-20 minutes. Your trip leader enters destinations, dates, venues, team members, and transportation details. Our analyst handles the rest. The mobile app for field operations is designed for non-technical users -- rally points, check-ins, and emergency contacts are accessible with one tap. No training certification required.",
  },
  {
    question: "What does our insurance carrier receive?",
    answer:
      "Your insurance carrier receives the same safety binder your church board reviews -- a complete 17-section analyst report with government intelligence data, venue safety assessments, emergency preparedness documentation, and a tamper-evident audit trail. Many carriers specifically ask whether a formal risk assessment was conducted. With SafeTrekr, the answer is documented, not anecdotal.",
  },
  {
    question: "How quickly do we get the safety binder back?",
    answer:
      "3-5 business days from trip submission to binder delivery. For churches planning mission trips months in advance, this timeline fits naturally into your preparation schedule. If your destination conditions change after the initial review, our analyst can update the binder with current intelligence data.",
  },
  {
    question: "Can SafeTrekr handle multi-stop mission trips?",
    answer:
      "Yes. Many mission trips involve multiple cities, venues, and lodging locations. Our analyst reviews each stop independently -- the safety conditions in Guatemala City are different from those in Antigua or a rural village. Each destination gets its own risk intelligence assessment. The final binder consolidates all stops into a single, comprehensive document with per-destination findings.",
  },
  {
    question: "Is SafeTrekr appropriate for youth group trips?",
    answer:
      "Absolutely. Youth group trips carry heightened duty of care obligations because you are transporting minors. SafeTrekr's review includes factors specifically relevant to youth safety -- venue appropriateness, emergency medical proximity for pediatric care, communication reliability for parent updates, and documented supervision planning. The binder provides your church with evidence that youth protection was professionally reviewed, not just assumed.",
  },
  {
    question: "How does pricing work for multiple trips per year?",
    answer:
      "Each trip is priced independently -- $450 for domestic, $750 for domestic overnight, $1,250 for international. Churches booking 5 or more trips per year qualify for volume pricing. A church sending 3 domestic mission trips and 2 international trips would pay approximately $3,850 before any volume discount. Contact us for a custom quote that reflects your annual mission schedule.",
  },
  {
    question:
      "What if our denomination already has safety guidelines?",
    answer:
      "SafeTrekr complements and strengthens your denominational safety requirements. Most denominational guidelines provide a framework -- SafeTrekr provides the documented execution. Your safety binder demonstrates compliance with denominational policies through professional verification, not self-reported checklists. Several denominations are evaluating SafeTrekr as a recommended resource for their member churches.",
  },
  {
    question:
      "Do you offer background check services for mission trip volunteers?",
    answer:
      "Yes. SafeTrekr offers background checks as an add-on service at $35 per person. These can be integrated into your trip preparation workflow so that volunteer screening and trip safety review happen through a single platform. Background check results are stored with the same encryption and access controls as all SafeTrekr data.",
  },
  {
    question:
      "What happens if conditions change after we receive the binder?",
    answer:
      "Your safety analyst monitors conditions for active trips. During your mission trip, your team receives morning and evening safety briefings covering weather changes, transit advisories, local events, and overnight developments. If conditions change significantly before departure, we can update your binder with current intelligence. The binder is a living document until your team returns home.",
  },
  {
    question:
      "Can church board members access the safety binder directly?",
    answer:
      "Yes. You control access to the safety binder. It can be shared as a PDF with your church board, insurance committee, denominational leadership, or anyone else who needs to review your safety preparation. The binder includes a verification hash that confirms the document has not been altered since the analyst completed the review -- providing your board with confidence that what they are reading is the unmodified professional assessment.",
  },
];

// ===========================================================================
// Page Component
// ===========================================================================

export default function ChurchSolutionsPage() {
  return (
    <>
      {/* Structured Data */}
      <JsonLd data={generateBreadcrumbSchema(BREADCRUMB_ITEMS)} />

      <main>
        {/* ================================================================
            SECTION 1: HERO
            ================================================================ */}
        <section
          id="hero"
          aria-label="Hero"
          className="bg-background pb-12 pt-8 sm:pb-16 sm:pt-12 md:pb-20 md:pt-16 lg:pb-28 lg:pt-20 xl:pb-36 xl:pt-28"
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
                <li
                  aria-current="page"
                  className="font-medium text-foreground"
                >
                  Churches &amp; Mission Organizations
                </li>
              </ol>
            </nav>

            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Text Column */}
              <div>
                <ScrollReveal variant="fadeUp">
                  <Eyebrow
                    color="primary"
                    icon={<Shield className="size-4" />}
                  >
                    Mission Trip Safety
                  </Eyebrow>
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" delay={0.1}>
                  <h1 className="mt-5 max-w-[20ch] text-display-xl text-foreground">
                    Your Mission Team Deserves a Safety Analyst
                  </h1>
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" delay={0.2}>
                  <p className="mt-6 max-w-[50ch] text-body-lg text-muted-foreground">
                    SafeTrekr brings the same professional safety review that
                    Fortune 500 companies use for business travel to every
                    mission trip your church sends. Government intelligence.
                    17-section analyst review. Audit-ready documentation your
                    insurance carrier and church board can trust.
                  </p>
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" delay={0.3}>
                  <div className="mt-8 flex flex-col flex-wrap gap-4 sm:flex-row">
                    <Button variant="primary" size="lg" asChild>
                      <Link href="/resources/sample-binders/mission-trip">
                        <Download className="size-[18px]" />
                        Download Mission Trip Sample Binder
                      </Link>
                    </Button>
                    <Button variant="secondary" size="lg" asChild>
                      <Link href="/demo">
                        Get a Demo
                        <ArrowRight className="size-[18px]" />
                      </Link>
                    </Button>
                  </div>
                </ScrollReveal>
              </div>

              {/* Visual Column */}
              <ScrollReveal
                variant="fadeUp"
                delay={0.2}
                className="flex justify-center lg:justify-end"
              >
                <div className="relative w-full max-w-[520px]" aria-hidden="true">
                  {/* Map Fragment */}
                  <div
                    className="w-full overflow-hidden rounded-xl border border-border shadow-lg"
                    style={{ aspectRatio: "4/3", background: "linear-gradient(135deg, #d4dce0 0%, #c8d3d8 40%, #bcc8ce 100%)" }}
                  >
                    <svg
                      viewBox="0 0 480 360"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-full w-full"
                    >
                      <rect width="480" height="360" fill="#d4dce0" />
                      <path
                        d="M0 180 Q120 160 200 200 Q280 240 360 180 Q420 140 480 160 V360 H0 Z"
                        fill="#c0cdd3"
                        opacity="0.5"
                      />
                      <path
                        d="M40 80 Q80 60 140 90 Q180 110 200 80 Q240 50 300 70 Q340 85 360 120 Q320 150 280 140 Q240 130 200 150 Q160 170 120 140 Q80 110 40 80Z"
                        fill="#bcc8ce"
                      />
                      <path
                        d="M300 160 Q340 140 380 170 Q420 200 440 180 Q460 160 480 190 V280 Q460 260 420 250 Q380 240 340 260 Q300 280 280 240 Q260 200 300 160Z"
                        fill="#b0bec5"
                      />
                      <path
                        d="M140 120 Q200 140 260 130 Q320 120 380 180"
                        stroke="var(--color-primary-500)"
                        strokeWidth="3"
                        strokeDasharray="8 4"
                        fill="none"
                        opacity="0.8"
                      />
                      <circle
                        cx="140"
                        cy="120"
                        r="8"
                        fill="white"
                        stroke="var(--color-primary-500)"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="140"
                        cy="120"
                        r="3"
                        fill="var(--color-primary-500)"
                      />
                      <circle
                        cx="380"
                        cy="180"
                        r="8"
                        fill="white"
                        stroke="var(--color-primary-500)"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="380"
                        cy="180"
                        r="3"
                        fill="var(--color-primary-500)"
                      />
                      <text
                        x="115"
                        y="108"
                        fontFamily="Inter, sans-serif"
                        fontSize="10"
                        fill="var(--color-muted-foreground)"
                      >
                        Houston, TX
                      </text>
                      <text
                        x="360"
                        y="205"
                        fontFamily="Inter, sans-serif"
                        fontSize="10"
                        fill="var(--color-muted-foreground)"
                      >
                        Guatemala City
                      </text>
                    </svg>
                  </div>

                  {/* Binder Preview Card */}
                  <div className="absolute -right-4 -top-4 hidden w-[260px] rounded-xl border border-border bg-white p-5 shadow-xl sm:block">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-primary-700">
                        International Mission Trip
                      </span>
                    </div>
                    <div className="font-display text-lg font-bold text-foreground">
                      Safety Binder
                    </div>
                    <div className="mt-2">
                      <Badge variant="brand" className="text-xs">
                        17 Sections Reviewed
                      </Badge>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check
                          className="size-3.5 text-primary-500"
                          strokeWidth={2}
                        />
                        Venue Safety Assessment -- Completed
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check
                          className="size-3.5 text-primary-500"
                          strokeWidth={2}
                        />
                        Emergency Evacuation Routes -- Verified
                      </div>
                    </div>
                    <div className="mt-3 font-mono text-[10px] tracking-tight text-border">
                      sha256:a3f8b2...e7d1c4
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute bottom-6 left-4 hidden items-center gap-2 rounded-full border border-primary-200 bg-white px-3 py-1.5 shadow-md sm:flex">
                    <span className="size-2 rounded-full bg-safety-green" />
                    <span className="text-xs font-semibold text-primary-700">
                      Trip Ready
                    </span>
                  </div>
                </div>
                <p className="sr-only">
                  Composed interface showing a mission trip safety binder with
                  map intelligence, analyst review status, and evidence
                  documentation.
                </p>
              </ScrollReveal>
            </div>
          </Container>
        </section>

        {/* ================================================================
            SECTION 2: TRUST STRIP
            ================================================================ */}
        <ScrollReveal variant="fadeUp">
          <TrustStrip showSources={false} />
        </ScrollReveal>

        {/* ================================================================
            SECTION 3: THE CHALLENGE
            ================================================================ */}
        <SectionContainer id="challenge" ariaLabelledBy="challenge-heading">
          <Container>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Text Column */}
              <div className="lg:col-span-5">
                <ScrollReveal variant="fadeUp">
                  <Eyebrow
                    color="primary"
                    icon={<AlertTriangle className="size-4" />}
                  >
                    The Reality Today
                  </Eyebrow>
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" delay={0.1}>
                  <h2
                    id="challenge-heading"
                    className="mt-5 max-w-[28ch] text-display-md text-foreground"
                  >
                    Good Intentions Are Not a Safety Plan
                  </h2>
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" delay={0.2}>
                  <p className="mt-6 max-w-[65ch] text-body-lg text-muted-foreground">
                    Every year, thousands of churches send mission teams to
                    unfamiliar destinations with a planning process that amounts
                    to a spreadsheet, a prayer chain, and a hope that nothing
                    goes wrong. Most trips go fine. But when one does not, the
                    first question from your insurance carrier is always the
                    same: &ldquo;What did you do to prepare?&rdquo;
                  </p>
                  <p className="mt-4 max-w-[65ch] text-body-lg font-medium text-foreground">
                    Faith and preparation are not opposites. They are partners.
                  </p>
                </ScrollReveal>
              </div>

              {/* Status Quo Cards */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {CHALLENGE_CARDS.map((card, index) => (
                    <ScrollReveal
                      key={card.title}
                      variant="fadeUp"
                      delay={0.1 * index}
                    >
                      <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
                        <div
                          className="mb-3 text-muted-foreground [&_svg]:size-6"
                          aria-hidden="true"
                        >
                          {card.icon}
                        </div>
                        <h3 className="mb-2 font-display text-base font-semibold text-foreground">
                          {card.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
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
        <SectionContainer
          id="how-it-works"
          ariaLabelledBy="solution-heading"
        >
          <Container>
            {/* Section Header */}
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <ScrollReveal variant="fadeUp">
                <Eyebrow
                  color="primary"
                  icon={<Shield className="size-4" />}
                  className="justify-center"
                >
                  How SafeTrekr Works
                </Eyebrow>
              </ScrollReveal>

              <ScrollReveal variant="fadeUp" delay={0.1}>
                <h2
                  id="solution-heading"
                  className="mx-auto mt-5 max-w-[28ch] text-display-md text-foreground"
                >
                  Professional Safety Review for Every Mission Trip
                </h2>
                <p className="mx-auto mt-4 max-w-[60ch] text-body-lg text-muted-foreground">
                  From trip submission to safety binder delivery in 3-5 days.
                  Here is exactly what happens.
                </p>
              </ScrollReveal>
            </div>

            {/* Process Timeline */}
            <ScrollReveal variant="fadeUp" className="mb-16">
              <ProcessTimeline steps={[...PROCESS_STEPS]} />
            </ScrollReveal>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {FEATURE_CARDS.map((card, index) => (
                <ScrollReveal
                  key={card.title}
                  variant="fadeUp"
                  delay={0.1 * index}
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
              {/* Visual Column (first on mobile, last on desktop) */}
              <div
                className="order-first flex justify-center lg:order-last lg:col-span-7"
                aria-hidden="true"
              >
                <ScrollReveal variant="fadeUp" delay={0.1}>
                  <div className="relative w-full max-w-[360px] p-5" style={{ height: "420px" }}>
                    {/* Back page */}
                    <div
                      className="absolute w-[calc(100%-40px)] rounded-lg border border-border bg-white p-6 opacity-70 shadow-md"
                      style={{ transform: "rotate(-2deg) translate(-12px, -16px)" }}
                    >
                      <div className="h-4 w-24 rounded bg-border/50" />
                      <div className="mt-3 h-3 w-40 rounded bg-border/30" />
                      <div className="mt-2 h-3 w-32 rounded bg-border/30" />
                    </div>
                    {/* Middle page */}
                    <div
                      className="absolute w-[calc(100%-40px)] rounded-lg border border-border bg-white p-6 opacity-90 shadow-lg"
                      style={{ transform: "rotate(-1deg) translate(-6px, -8px)" }}
                    >
                      <div className="h-4 w-28 rounded bg-border/50" />
                      <div className="mt-3 h-3 w-44 rounded bg-border/30" />
                      <div className="mt-2 h-3 w-36 rounded bg-border/30" />
                    </div>
                    {/* Front page */}
                    <div className="relative w-[calc(100%-40px)] rounded-lg border border-border bg-white p-6 shadow-xl">
                      {/* SafeTrekr mark */}
                      <div className="mb-1 flex items-center gap-2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 32 32"
                          fill="none"
                          aria-hidden="true"
                        >
                          <rect width="32" height="32" rx="6" fill="#3f885b" />
                          <path
                            d="M16 6l8 4v6c0 5.33-3.33 10.33-8 12-4.67-1.67-8-6.67-8-12v-6l8-4z"
                            fill="white"
                            fillOpacity="0.9"
                          />
                        </svg>
                        <span className="text-xs font-medium uppercase tracking-wider text-primary-700">
                          International Mission Trip
                        </span>
                      </div>
                      <div className="mt-2 font-display text-xl font-bold text-foreground">
                        Safety Binder
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Guatemala City -- Antigua -- Lake Atitlan
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        June 15-22, 2026
                      </div>
                      <div className="mt-3">
                        <Badge variant="brand" className="text-xs">
                          17 Sections Reviewed
                        </Badge>
                      </div>
                      {/* Map thumbnail */}
                      <div
                        className="mt-4 overflow-hidden rounded-md opacity-80"
                        style={{
                          height: "52px",
                          background: "linear-gradient(135deg, #d4dce0, #c0cdd3)",
                        }}
                      >
                        <svg
                          viewBox="0 0 300 52"
                          fill="none"
                          className="h-full w-full"
                        >
                          <path
                            d="M0 30 Q60 15 120 25 Q180 35 240 20 Q270 14 300 18"
                            stroke="var(--color-primary-500)"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray="4 3"
                          />
                        </svg>
                      </div>
                      {/* Section preview lines */}
                      <div className="mt-4 space-y-2">
                        <div className="text-xs text-muted-foreground">
                          1. Destination Overview &amp; Risk Profile
                        </div>
                        <div className="text-xs text-muted-foreground">
                          2. Venue Safety Assessments
                        </div>
                        <div className="text-xs text-muted-foreground">
                          3. Emergency Contacts &amp; Medical Facilities
                        </div>
                        <div className="text-xs text-border">
                          4. Evacuation Routes &amp; Contingencies...
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="sr-only">
                    Preview of an International Mission Trip safety binder
                    showing cover page with destinations, review sections, and
                    analyst verification status.
                  </p>
                </ScrollReveal>
              </div>

              {/* Text Column */}
              <div className="lg:col-span-5">
                <ScrollReveal variant="fadeUp">
                  <Eyebrow
                    color="primary"
                    icon={<FileText className="size-4" />}
                  >
                    Sample Binder
                  </Eyebrow>
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" delay={0.1}>
                  <h2
                    id="binder-preview-heading"
                    className="mt-5 max-w-[28ch] text-display-md text-foreground"
                  >
                    See Exactly What Your Insurance Carrier and Church Board
                    Will Receive
                  </h2>
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" delay={0.2}>
                  <p className="mt-6 max-w-[60ch] text-body-lg text-muted-foreground">
                    Every SafeTrekr review produces a comprehensive safety
                    binder customized to your mission trip. This is not a
                    template or a generic checklist. It is the documented output
                    of a professional analyst reviewing your specific trip --
                    your destinations, your dates, your venues, your team.
                  </p>
                </ScrollReveal>

                {/* Binder Contents Checklist */}
                <ScrollReveal variant="fadeUp" delay={0.3}>
                  <ul className="mt-6 space-y-3">
                    {BINDER_CHECKLIST.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Check
                          className="mt-0.5 size-5 shrink-0 text-primary-500"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                        <span className="text-body-md text-muted-foreground">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>

                {/* CTA */}
                <ScrollReveal variant="fadeUp" delay={0.4}>
                  <div className="mt-8">
                    <Button variant="primary" size="lg" asChild>
                      <Link href="/resources/sample-binders/mission-trip">
                        <Download className="size-[18px]" />
                        Download the Mission Trip Sample Binder
                      </Link>
                    </Button>
                    <p className="mt-2 text-sm text-muted-foreground">
                      See a real safety binder output. Gated with email -- we
                      will not spam you.
                    </p>
                  </div>
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
              <div className="mb-12 text-center lg:mb-16">
                <Eyebrow color="dark">By the Numbers</Eyebrow>
                <h2
                  id="proof-heading"
                  className="mt-4 text-display-md text-dark-text-primary"
                >
                  Documented Accountability, Not Just Good Intentions
                </h2>
              </div>
            </ScrollReveal>

            {/* Stat Cards */}
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:mb-16">
              <ScrollReveal variant="fadeUp">
                <div
                  className="rounded-xl border border-dark-border bg-dark-surface p-8 text-center"
                  aria-label="17 analyst review sections per trip"
                >
                  <div className="font-display font-mono text-4xl font-bold text-dark-text-primary lg:text-5xl">
                    17
                  </div>
                  <div className="mt-3 text-eyebrow text-dark-text-secondary">
                    Analyst Review Sections
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-dark-text-secondary">
                    Every trip reviewed across venues, lodging, transportation,
                    emergency contacts, evacuation routes, weather, health
                    advisories, and more
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fadeUp" delay={0.1}>
                <div
                  className="rounded-xl border border-dark-border bg-dark-surface p-8 text-center"
                  aria-label="5 government intelligence sources"
                >
                  <div className="font-display font-mono text-4xl font-bold text-dark-text-primary lg:text-5xl">
                    5
                  </div>
                  <div className="mt-3 text-eyebrow text-dark-text-secondary">
                    Government Intelligence Sources
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-dark-text-secondary">
                    NOAA, USGS, CDC, ReliefWeb, GDACS -- the same sources
                    humanitarian agencies rely on
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fadeUp" delay={0.2}>
                <div
                  className="rounded-xl border border-dark-border bg-dark-surface p-8 text-center"
                  aria-label="3 to 5 days from submission to binder delivery"
                >
                  <div className="font-display font-mono text-3xl font-bold text-dark-text-primary lg:text-4xl">
                    3-5 Days
                  </div>
                  <div className="mt-3 text-eyebrow text-dark-text-secondary">
                    Submission to Binder Delivery
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-dark-text-secondary">
                    Professional review and documentation delivered before your
                    team departs
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Proof Narrative */}
            <ScrollReveal variant="fadeUp">
              <div className="mx-auto max-w-[65ch] text-center">
                <p className="text-body-lg leading-relaxed text-dark-text-secondary">
                  The difference between a prepared church and a lucky church is
                  not what happens on the trip. It is what exists in the filing
                  cabinet before the trip begins. SafeTrekr produces the
                  documentation that turns your church&apos;s commitment to
                  safety from a verbal assurance into defensible evidence.
                </p>
              </div>
            </ScrollReveal>
          </Container>
        </SectionContainer>

        {/* ================================================================
            SECTION 7: PRICING CONTEXT
            ================================================================ */}
        <SectionContainer
          id="pricing"
          ariaLabelledBy="pricing-heading"
        >
          <Container>
            {/* Header */}
            <ScrollReveal variant="fadeUp">
              <div className="mb-12">
                <Eyebrow color="primary">Pricing</Eyebrow>
                <h2
                  id="pricing-heading"
                  className="mt-4 max-w-[28ch] text-display-md text-foreground"
                >
                  Less Than You Think. Worth More Than You Know.
                </h2>
                <p className="mt-4 max-w-[60ch] text-body-lg text-muted-foreground">
                  A professional safety review for your mission trip costs less
                  than one percent of a typical mission trip budget. That is the
                  cost of documented accountability for every person you send.
                </p>
              </div>
            </ScrollReveal>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Domestic */}
              <ScrollReveal variant="fadeUp">
                <div className="rounded-2xl border border-primary-400 bg-card p-8 shadow-md">
                  <Badge variant="brand" className="mb-4 text-xs">
                    Most Common
                  </Badge>
                  <div className="font-display text-5xl font-bold text-foreground">
                    $450
                  </div>
                  <div className="mt-1 text-body-md text-muted-foreground">
                    per domestic trip
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      $30 per team member for a group of 15
                    </p>
                    <p className="text-sm text-muted-foreground">
                      3% of a $15,000 mission budget
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

              {/* International */}
              <ScrollReveal variant="fadeUp" delay={0.1}>
                <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                  <div className="mt-6 font-display text-5xl font-bold text-foreground">
                    $1,250
                  </div>
                  <div className="mt-1 text-body-md text-muted-foreground">
                    per international trip
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      $50 per team member for a group of 25
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Less than 1% of a $7,000-per-person mission budget
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Less than one emergency evacuation consultation
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

              {/* Multi-Trip / Custom */}
              <ScrollReveal variant="fadeUp" delay={0.2}>
                <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                  <div className="mt-6 font-display text-5xl font-bold text-foreground">
                    Custom
                  </div>
                  <div className="mt-1 text-body-md text-muted-foreground">
                    volume pricing for 5+ trips per year
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      A church sending 3 domestic + 2 international trips:
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      $3,850/year for complete safety coverage
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Volume discounts available for 5+ trips annually
                    </p>
                  </div>
                  <div className="mt-6">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full"
                      asChild
                    >
                      <Link href="/pricing#quote">Get a Custom Quote</Link>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Cost Comparison Block */}
            <ScrollReveal variant="fadeUp" className="mt-12">
              <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
                <h3 className="mb-8 text-heading-md text-foreground">
                  The Cost of Not Having a Safety Review
                </h3>

                <table className="w-full" role="table">
                  <caption className="sr-only">
                    Comparison of mission trip safety approaches
                  </caption>
                  <thead className="hidden md:table-header-group">
                    <tr>
                      <th
                        className="pb-4 pr-6 text-left text-sm font-semibold text-muted-foreground"
                        style={{ width: "50%" }}
                      >
                        Without SafeTrekr
                      </th>
                      <th
                        className="pb-4 text-left text-sm font-semibold text-primary-700"
                        style={{ width: "50%" }}
                      >
                        With SafeTrekr
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COST_COMPARISON_ROWS.map((row, index) => (
                      <tr
                        key={index}
                        className={`block border-border md:table-row ${
                          index < COST_COMPARISON_ROWS.length - 1
                            ? "border-b"
                            : ""
                        }`}
                      >
                        <td className="block py-4 pr-6 md:table-cell">
                          <div className="flex items-start gap-2.5">
                            <AlertTriangle
                              className="mt-0.5 size-[18px] shrink-0 text-muted-foreground"
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                            <span className="text-sm leading-relaxed text-muted-foreground">
                              {row.without}
                            </span>
                          </div>
                        </td>
                        <td className="block py-4 pl-0 md:table-cell md:pl-6">
                          <div className="flex items-start gap-2.5">
                            <Check
                              className="mt-0.5 size-[18px] shrink-0 text-primary-500"
                              strokeWidth={2.5}
                              aria-hidden="true"
                            />
                            <span className="text-sm leading-relaxed text-muted-foreground">
                              {row.withSafeTrekr}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-6 border-t border-border pt-6">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700"
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
            {/* Header */}
            <ScrollReveal variant="fadeUp">
              <div className="mb-12 text-center">
                <Eyebrow
                  color="primary"
                  icon={<Shield className="size-4" />}
                  className="justify-center"
                >
                  Security &amp; Compliance
                </Eyebrow>
                <h2
                  id="compliance-heading"
                  className="mx-auto mt-5 max-w-[28ch] text-display-md text-foreground"
                >
                  Built to Satisfy Your Insurance Carrier and Denomination
                </h2>
              </div>
            </ScrollReveal>

            {/* Trust Badge Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
              {TRUST_BADGES.map((badge, index) => (
                <ScrollReveal
                  key={badge.title}
                  variant="fadeUp"
                  delay={0.1 * index}
                >
                  <div className="rounded-xl border border-border bg-background p-6 text-center">
                    <div
                      className="mx-auto mb-3 text-primary-700 [&_svg]:size-8"
                      aria-hidden="true"
                    >
                      {badge.icon}
                    </div>
                    <h3 className="mb-2 font-display text-base font-semibold text-foreground">
                      {badge.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {badge.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Insurance Narrative */}
            <ScrollReveal variant="fadeUp">
              <div className="mx-auto mt-12 max-w-[65ch] text-center lg:mt-16">
                <h3 className="text-heading-md text-foreground">
                  Your Insurance Carrier Will Thank You
                </h3>
                <p className="mt-4 text-body-lg leading-relaxed text-muted-foreground">
                  Most church insurance policies require &ldquo;reasonable
                  precautions&rdquo; for off-site activities. The problem is
                  that &ldquo;reasonable&rdquo; is undefined until something
                  goes wrong. SafeTrekr defines it: a professional 17-section
                  safety review backed by government intelligence data,
                  documented with tamper-evident audit trails. That is not
                  reasonable -- it is exceptional. And it is the documentation
                  your carrier needs to honor your coverage.
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
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary-700"
                >
                  Visit our procurement page
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </ScrollReveal>
          </Container>
        </SectionContainer>

        {/* ================================================================
            SECTION 9: COMMON QUESTIONS
            ================================================================ */}
        <SectionContainer id="faq" ariaLabelledBy="faq-heading">
          <Container size="md">
            {/* Header */}
            <ScrollReveal variant="fadeUp">
              <div className="mb-12 text-center">
                <Eyebrow color="primary" className="justify-center">
                  Common Questions
                </Eyebrow>
                <h2
                  id="faq-heading"
                  className="mx-auto mt-4 max-w-[28ch] text-display-md text-foreground"
                >
                  Everything Your Missions Committee Will Ask
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.1}>
              <FAQSection items={FAQ_ITEMS} />
            </ScrollReveal>
          </Container>
        </SectionContainer>

        {/* ================================================================
            SECTION 10: CTA BAND (DARK)
            ================================================================ */}
        <CTABand
          variant="dark"
          headline="Protect Your Next Mission Trip"
          body="See exactly what a professionally reviewed mission trip looks like. Download a sample binder or schedule a 30-minute demo with our team."
          primaryCta={{ text: "Get a Demo", href: "/demo" }}
          secondaryCta={{
            text: "Download Sample Binder",
            href: "/resources/sample-binders/mission-trip",
          }}
        />
      </main>
    </>
  );
}
