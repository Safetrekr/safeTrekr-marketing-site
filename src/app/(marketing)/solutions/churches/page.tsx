/**
 * ST-870: REQ-063, Church/Missions Solutions Page (/solutions/churches)
 *
 * Beachhead segment page for churches and mission organizations. This is the
 * deepest, most conversion-optimized segment page in the SafeTrekr marketing
 * site. It builds a full-funnel narrative from problem awareness through
 * pricing context to conversion.
 *
 * Server Component composing pre-built components from Waves 0-3.
 *
 * Section order:
 *   1. Hero            , Breadcrumb, headline, dual CTAs, hero visual
 *   2. TrustStrip      , 5 trust metrics + intel source bar
 *   3. The Challenge   , "Good Intentions Are Not a Safety Plan" + 4 cards
 *   4. How It Works    , 3-act ProcessTimeline + 4 FeatureCards
 *   5. Sample Binder   , Fanned binder visual + checklist + gated CTA
 *   6. Proof Points    , DARK section with stat cards + proof narrative
 *   7. Pricing Context , 3 scenario cards + cost comparison table
 *   8. Compliance      , 4 trust badges + insurance narrative
 *   9. FAQ             , 12 church-specific questions with JSON-LD
 *  10. CTA Band        , DARK "Protect Your Next Mission Trip"
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
  title: "Church & Mission Trip Planning",
  description:
    "Mission trip preparation that honors your calling. SafeTrekr provides professional safety review, simple guidance for volunteer leaders, and documentation that demonstrates good stewardship.",
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
    title: "Trip Leader Submits Details",
    description:
      "The trip leader enters destination, dates, team size, activities, and ministry partners through a guided form. Takes 15 minutes. No training required.",
  },
  {
    number: 2,
    title: "Analyst Reviews Everything",
    description:
      "A professional safety analyst completes a comprehensive review using current information from government data sources. Medical facilities located. Emergency contacts documented. Conditions assessed.",
  },
  {
    number: 3,
    title: "Documentation Delivered",
    description:
      "Your church receives a complete safety binder with every finding, recommendation, and contact. Share with elders, families, and insurance carriers.",
  },
] as const;

const FEATURE_CARDS = [
  {
    icon: <ClipboardCheck className="size-6" />,
    title: "Mission Trip Assessment",
    description:
      "Comprehensive safety review for international missions. Embassy contacts, medical facility locations, regional conditions, and emergency planning, all evaluated by a trained analyst before your team departs.",
    href: "/platform/analyst-review",
    linkText: "Learn about analyst review",
  },
  {
    icon: <MapPin className="size-6" />,
    title: "Youth Care Documentation",
    description:
      "Safety binders structured to demonstrate responsibility for minors. When parents entrust their children to your ministry, documentation shows you took their safety seriously.",
    href: "/platform/risk-intelligence",
    linkText: "Learn about risk intelligence",
  },
  {
    icon: <FileText className="size-6" />,
    title: "Insurance-Ready Documentation",
    description:
      "Organized records that demonstrate professional preparation was completed. The documentation your church insurance carrier wants to see.",
    href: "/platform/safety-binder",
    linkText: "Learn about the safety binder",
  },
  {
    icon: <Activity className="size-6" />,
    title: "Volunteer-Friendly Process",
    description:
      "Simple 15-minute trip submission designed for volunteer leaders with day jobs and families. No training required. No complicated setup. Clear guidance delivered back.",
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
      'When carriers ask "Have you conducted a formal risk assessment?", the honest answer is usually no. Checking "yes" without documentation creates liability, not coverage.',
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
  "Destination risk assessment with government data sources",
  "Venue and lodging safety verification",
  "Emergency medical facility locations and contact information",
  "Evacuation routes and contingency plans",
  "Transportation safety evaluation",
  "Communication infrastructure assessment",
  "Complete audit trail for insurance documentation",
] as const;

const PRICING_FEATURES_DOMESTIC = [
  "Experienced analyst review",
  "Active intelligence monitoring",
  "Complete safety binder",
  "Mobile field support",
  "Delivery in as soon as 3 days",
] as const;

const PRICING_FEATURES_INTERNATIONAL = [
  "Everything in Domestic",
  "Multi-week trip support",
  "Extended monitoring period",
  "Ministry partner context",
  "Priority analyst assignment",
] as const;

const PRICING_FEATURES_CHALLENGING = [
  "Everything in International",
  "Enhanced regional assessment",
  "Embassy and consulate contacts",
  "Evacuation planning documentation",
  "Regional condition briefing",
] as const;


const TRUST_BADGES = [
  {
    icon: <Shield className="size-8" />,
    title: "Data Protection",
    description:
      "All data encrypted at rest and in transit. Your team's information is protected with industry-standard security practices.",
  },
  {
    icon: <FileText className="size-8" />,
    title: "Complete Documentation",
    description:
      "Every review finding, every analyst decision, every data source documented. Clear records that demonstrate professional preparation.",
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
    question: "Does SafeTrekr work with church insurance requirements?",
    answer:
      "Yes. Many church insurance carriers appreciate documented safety planning for sponsored travel, especially international missions and youth trips. SafeTrekr safety binders provide the organized documentation that carriers want to see. The structured format demonstrates that preparation was completed before travel, not created afterward.",
  },
  {
    question: "How do you handle mission trips to challenging regions?",
    answer:
      "Our International and Challenging Region tiers include enhanced regional assessment, evacuation planning documentation, and embassy contact verification. For regions with travel advisories, we provide context and documented considerations. We help you make informed decisions about ministry travel, we do not make those decisions for you.",
  },
  {
    question: "Can we share the safety binder with parents?",
    answer:
      "Absolutely. Safety binders are designed to be shared with parents, elders, denominational leadership, and insurance carriers. When parents ask \"How did you prepare for this trip?\" you can share professional documentation, not just \"We've done this before.\"",
  },
  {
    question: "Our volunteer leaders are not technical. Is SafeTrekr complicated to use?",
    answer:
      "SafeTrekr was designed for volunteer leaders with day jobs and families. Submitting a trip takes about 15 minutes through a guided form, just enter your destination, dates, team size, and planned activities. No training required. Your volunteers receive a completed safety binder with clear checklists and guidance.",
  },
  {
    question: "What if our ministry partner changes or our itinerary shifts?",
    answer:
      "If your destination or primary ministry partner changes significantly, we recommend submitting updated trip details for review. Minor itinerary adjustments to the same destination can be accommodated, contact your analyst for guidance.",
  },
  {
    question: "Do you offer pricing for churches that do multiple trips per year?",
    answer:
      "Yes. Contact us to discuss arrangements that fit your ministry's travel patterns.",
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
                    Church &amp; Mission Planning
                  </Eyebrow>
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" delay={0.1}>
                  <h1 className="mt-5 max-w-[20ch] text-display-xl text-foreground">
                    Mission trip preparation that honors your calling.
                  </h1>
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" delay={0.2}>
                  <p className="mt-6 max-w-[50ch] text-body-lg text-muted-foreground">
                    When parents entrust their children to your ministry, they
                    are trusting you with precious lives. SafeTrekr provides
                    professional safety review for mission trips and youth
                    retreats, demonstrating the stewardship families expect.
                    Simple for volunteers. Shareable with parents. Ready for
                    your insurance carrier.
                  </p>
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" delay={0.3}>
                  <div className="mt-8 flex flex-col flex-wrap gap-4 sm:flex-row">
                    <Button variant="primary" size="lg" asChild>
                      <Link href="/demo">
                        Schedule a Walkthrough
                        <ArrowRight className="size-[18px]" />
                      </Link>
                    </Button>
                    <Button variant="secondary" size="lg" asChild>
                      <Link href="/resources/sample-binders/mission-trip">
                        <Download className="size-[18px]" />
                        View Sample Binder
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
                        Comprehensive Review
                      </Badge>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check
                          className="size-3.5 text-primary-500"
                          strokeWidth={2}
                        />
                        Venue Safety Assessment, Completed
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check
                          className="size-3.5 text-primary-500"
                          strokeWidth={2}
                        />
                        Emergency Evacuation Routes, Verified
                      </div>
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
                    The Challenge
                  </Eyebrow>
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" delay={0.1}>
                  <h2
                    id="challenge-heading"
                    className="mt-5 max-w-[28ch] text-display-md text-foreground"
                  >
                    Mission trip preparation can be more structured, without being more complicated.
                  </h2>
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" delay={0.2}>
                  <p className="mt-6 max-w-[65ch] text-body-lg text-muted-foreground">
                    Church mission trips and youth travel are acts of service
                    and faith. The leaders who plan them are volunteers giving
                    their time, energy, and hearts to ministry. They are not
                    professional risk managers, they are accountants, teachers,
                    nurses, and retirees who love their church and want to serve.
                  </p>
                  <p className="mt-4 max-w-[65ch] text-body-lg text-muted-foreground">
                    Your team is focused on ministry, as they should be.
                    SafeTrekr adds professional safety planning to what you are
                    already doing: consistent review, clear documentation, and
                    the structure that demonstrates good stewardship to families
                    and insurance carriers.
                  </p>
                  <p className="mt-4 max-w-[65ch] text-body-lg font-medium text-foreground">
                    Prayer and preparation. Together.
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
                  Built for Churches
                </Eyebrow>
              </ScrollReveal>

              <ScrollReveal variant="fadeUp" delay={0.1}>
                <h2
                  id="solution-heading"
                  className="mx-auto mt-5 max-w-[28ch] text-display-md text-foreground"
                >
                  Professional preparation for mission trips and youth travel.
                </h2>
                <p className="mx-auto mt-4 max-w-[60ch] text-body-lg text-muted-foreground">
                  From trip planning to complete documentation in as soon as 3 days.
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
                        Guatemala City, Antigua, Lake Atitlan
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        June 15-22, 2026
                      </div>
                      <div className="mt-3">
                        <Badge variant="brand" className="text-xs">
                          Comprehensive Review
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
                      See a real safety binder output. Gated with email, we
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
                  aria-label="Comprehensive analyst review per trip"
                >
                  <div className="font-display text-2xl font-bold text-dark-text-primary lg:text-3xl">
                    Comprehensive
                  </div>
                  <div className="mt-3 text-eyebrow text-dark-text-secondary">
                    Analyst Review
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
                  aria-label="Multiple trusted intelligence sources"
                >
                  <div className="font-display text-2xl font-bold text-dark-text-primary lg:text-3xl">
                    Multiple
                  </div>
                  <div className="mt-3 text-eyebrow text-dark-text-secondary">
                    Trusted Intelligence Sources
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-dark-text-secondary">
                    Government and humanitarian sources, the same sources
                    professional agencies rely on
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fadeUp" delay={0.2}>
                <div
                  className="rounded-xl border border-dark-border bg-dark-surface p-8 text-center"
                  aria-label="3 days fast turnaround"
                >
                  <div className="font-display font-mono text-3xl font-bold text-dark-text-primary lg:text-4xl">
                    3 Days
                  </div>
                  <div className="mt-3 text-eyebrow text-dark-text-secondary">
                    Fast Turnaround
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
                  Professional preparation. Accessible pricing.
                </h2>
                <p className="mt-4 max-w-[60ch] text-body-lg text-muted-foreground">
                  Good stewardship does not require large budgets. Professional
                  safety review is accessible for churches of any size.
                </p>
              </div>
            </ScrollReveal>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Domestic Trip */}
              <ScrollReveal variant="fadeUp">
                <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                  <div className="font-display text-5xl font-bold text-foreground">
                    $450
                  </div>
                  <div className="mt-1 text-body-md text-muted-foreground">
                    per domestic trip
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      ~$15/person for a 30-person team
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

              {/* International Mission */}
              <ScrollReveal variant="fadeUp" delay={0.1}>
                <div className="rounded-2xl border border-primary-400 bg-card p-8 shadow-md">
                  <Badge variant="brand" className="mb-4 text-xs">
                    Most Popular
                  </Badge>
                  <div className="font-display text-5xl font-bold text-foreground">
                    $750
                  </div>
                  <div className="mt-1 text-body-md text-muted-foreground">
                    per international mission
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      ~$25/person for a 30-person team
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
                  <div className="font-display text-5xl font-bold text-foreground">
                    $1,250
                  </div>
                  <div className="mt-1 text-body-md text-muted-foreground">
                    per challenging region trip
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      ~$42/person for a 30-person team
                    </p>
                  </div>
                  <div className="mt-6 border-t border-border pt-6">
                    <ul className="space-y-3">
                      {PRICING_FEATURES_CHALLENGING.map((feature) => (
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
            </div>

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
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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
                  Documentation Your Carrier Appreciates
                </h3>
                <p className="mt-4 text-body-lg leading-relaxed text-muted-foreground">
                  Many church insurance policies ask about safety preparation
                  for off-site activities. SafeTrekr provides the organized
                  documentation that demonstrates your church completed
                  professional preparation, a comprehensive safety review with
                  clear records your carrier can review.
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
          headline="Ready to go with a plan?"
          body="See how SafeTrekr delivers professional trip planning for churches with documentation that demonstrates good stewardship."
          primaryCta={{ text: "Schedule a Walkthrough", href: "/demo" }}
          secondaryCta={{
            text: "View Pricing",
            href: "/pricing",
          }}
        />
      </main>
    </>
  );
}
