/**
 * ST-890: REQ-127 -- Sports Segment Page (/solutions/sports)
 *
 * Youth sports and league travel solutions page. Mirrors the churches page
 * structure (10 sections, full-funnel narrative) with sports-specific
 * vocabulary: SafeSport compliance, tournament travel, league liability,
 * travel party, chaperone protocols.
 *
 * Server Component composing pre-built components from earlier waves.
 *
 * Section order:
 *   1. Hero             -- Breadcrumb, headline, dual CTAs
 *   2. TrustStrip       -- 5 trust metrics + intel source bar
 *   3. The Challenge    -- "Tournament Travel Shouldn't Be a Liability"
 *   4. How It Works     -- 3-step ProcessTimeline + 4 FeatureCards
 *   5. Sample Binder    -- Tournament binder visual + checklist + gated CTA
 *   6. Proof Points     -- DARK section with stat cards
 *   7. Pricing Context  -- Scenario cards + cost comparison
 *   8. Compliance       -- SafeSport, liability, volunteer screening
 *   9. FAQ              -- 10 sports-specific questions with JSON-LD
 *  10. CTA Band         -- DARK "Protect Your Next Tournament Trip"
 *
 * Sports vocabulary: SafeSport compliance, tournament travel, league liability,
 * travel party, chaperone ratio, athletic trainer access.
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
  Trophy,
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
  title: "Youth Sports & Tournament Travel Safety",
  description:
    "SafeTrekr assigns a professional safety analyst to review every tournament trip your league sends -- across 17 dimensions of risk. Government intelligence. Audit-ready documentation. Starting at $450 per trip.",
  path: "/solutions/sports",
});

// ---------------------------------------------------------------------------
// Structured Data
// ---------------------------------------------------------------------------

const BREADCRUMB_ITEMS = [
  { name: "Home", url: "https://safetrekr.com/" },
  { name: "Solutions", url: "https://safetrekr.com/solutions" },
  {
    name: "Youth Sports & League Travel",
    url: "https://safetrekr.com/solutions/sports",
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
      "Before your team boards the bus, we pull real-time safety data from NOAA, USGS, CDC, and regional emergency management agencies -- the same sources professional event coordinators use. Weather patterns at your tournament venue. Road conditions on your route. Facility safety records. Every data point scored, not just collected.",
  },
  {
    number: 2,
    title: "Analyst Safety Review",
    description:
      "A trained safety analyst reviews every detail of your tournament trip across 17 sections -- venue safety, lodging conditions, transportation routes, emergency medical access, weather exposure, athletic trainer proximity, and more. They flag what needs attention and document what is ready.",
  },
  {
    number: 3,
    title: "Documented Evidence Binder",
    description:
      "Your league receives a complete safety binder -- every review finding, every government data source, every decision documented with tamper-evident audit trails. When your league board asks what precautions were taken, when a parent asks how you assessed the risk, when your insurance carrier needs documentation -- you hand them the binder.",
  },
] as const;

const FEATURE_CARDS = [
  {
    icon: <ClipboardCheck className="size-6" />,
    title: "Every Tournament Venue Reviewed by a Professional Analyst",
    description:
      "Your coaches focus on the game. Our analyst focuses on safety. 17 sections covering venues, lodging, transportation, emergency contacts, evacuation routes, local hospitals, weather exposure, and more.",
    href: "/platform/analyst-review",
    linkText: "Learn about analyst review",
  },
  {
    icon: <MapPin className="size-6" />,
    title: "Government Data on Every Destination Your Team Visits",
    description:
      "Real-time intelligence from 5 government sources -- not a Google search. NOAA severe weather alerts, road condition reports, venue inspection records where available, and regional emergency management data. Risk scored so you understand probability, not just possibility.",
    href: "/platform/risk-intelligence",
    linkText: "Learn about risk intelligence",
  },
  {
    icon: <FileText className="size-6" />,
    title: "Audit-Ready Documentation for Your League and Insurance Carrier",
    description:
      "Every finding documented. Every data source cited. Every decision recorded with SHA-256 tamper-evident audit trails. The binder your insurance carrier wishes every league had -- and the one parents will thank you for.",
    href: "/platform/safety-binder",
    linkText: "Learn about the safety binder",
  },
  {
    icon: <Activity className="size-6" />,
    title:
      "Rally Points, Check-Ins, and Emergency Contacts in Every Coach's Pocket",
    description:
      "During your tournament, every team manager gets the SafeTrekr mobile app -- live geofencing, muster check-ins, rally point navigation, SMS broadcast, and morning/evening safety briefings. Offline mode keeps critical information accessible even without cell service.",
    href: "/platform/mobile-app",
    linkText: "Learn about mobile operations",
  },
] as const;

const CHALLENGE_CARDS = [
  {
    icon: <FileText className="size-6" />,
    title: "Coach-Assembled Travel Plans",
    description:
      "Head coaches compile safety information between practice schedules and game prep. Hotel addresses in a group text. Emergency contacts on a clipboard. No standardized review. No professional verification.",
  },
  {
    icon: <Shield className="size-6" />,
    title: "SafeSport Compliance Gaps",
    description:
      "SafeSport requirements are complex and evolving. Many leagues handle compliance through self-reported checklists without documented verification -- creating liability exposure they may not recognize until an incident occurs.",
  },
  {
    icon: <Users className="size-6" />,
    title: "Chaperone Screening Without Consistency",
    description:
      "Background check requirements vary by sport, league, and state. Even organizations with screening policies rarely verify compliance for away-tournament travel or when parent volunteers step in last-minute.",
  },
  {
    icon: <AlertCircle className="size-6" />,
    title: "No Audit Trail When It Matters",
    description:
      "If an athlete is injured at an away tournament, what documentation proves your league took reasonable precautions? A group chat and a handwritten emergency contact list are not evidence of due diligence.",
  },
] as const;

const BINDER_CHECKLIST = [
  "Tournament venue risk assessment with government data",
  "Lodging and hotel safety verification",
  "Emergency medical facility locations near venue and hotel",
  "Transportation route safety evaluation",
  "Severe weather contingency plans",
  "Athletic trainer and medical access assessment",
  "Tamper-evident audit trail with SHA-256 hash chain",
] as const;

const PRICING_FEATURES = [
  "17-section professional analyst review",
  "Government intelligence risk scoring",
  "Complete safety binder with audit trail",
  "Mobile app access for coaches and managers",
  "AM/PM safety briefings during tournament",
] as const;

const COST_COMPARISON_ROWS = [
  {
    without:
      "20-40 hours of coach and volunteer time per tournament assembling safety information between practices",
    withSafeTrekr:
      "Professional analyst completes 17-section review in 3-5 days. Your coaching staff focuses on the athletes.",
  },
  {
    without:
      "SafeSport compliance questionnaires answered with best guesses. No formal travel risk documentation.",
    withSafeTrekr:
      "Every compliance question answered with cited evidence. Formal risk assessment your league board can audit.",
  },
  {
    without:
      'If something goes wrong at an away tournament: "We did what we always do" is your only defense.',
    withSafeTrekr:
      "If something goes wrong: a complete evidence binder with every decision documented and tamper-proof.",
  },
  {
    without:
      "Average youth sports liability settlement: $500,000-$2,000,000 when negligence is established.",
    withSafeTrekr:
      "$450 for documented proof your league took every reasonable precaution.",
  },
] as const;

const TRUST_BADGES = [
  {
    icon: <Shield className="size-8" />,
    title: "AES-256 Encryption",
    description:
      "All athlete and family data encrypted at rest and in transit. Protected with the same standard used by financial institutions.",
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
    icon: <Trophy className="size-8" />,
    title: "SafeSport-Aligned Documentation",
    description:
      "Our binder structure aligns with SafeSport travel safety documentation requirements, helping your league demonstrate compliance.",
  },
] as const;

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Do we need SafeTrekr for local tournaments too?",
    answer:
      "Yes. Even a tournament 90 minutes away involves transporting minors to unfamiliar venues. Your duty of care obligation does not depend on distance. A local away tournament carries venue safety risks, weather exposure, transportation hazards, and emergency access challenges that deserve professional review. Our domestic tournament review costs $450.",
  },
  {
    question:
      "How does SafeTrekr help with SafeSport compliance?",
    answer:
      "SafeTrekr's safety binder documents the travel safety measures your league has in place -- venue assessments, emergency plans, supervision protocols, and transportation safety. While SafeSport compliance covers multiple dimensions beyond travel, our documentation provides the travel safety evidence that supports your broader compliance effort. The binder gives your league auditable proof of due diligence for every away trip.",
  },
  {
    question: "Can our volunteer team manager use this without training?",
    answer:
      "Yes. Trip submission is a guided 10-step wizard that takes 15-20 minutes. Your team manager enters tournament venue, dates, hotel, team roster, and transportation details. Our analyst handles the rest. The mobile app for game-day operations is designed for busy coaches -- rally points, check-ins, and emergency contacts are accessible with one tap.",
  },
  {
    question: "What about multi-team tournaments where we send several age groups?",
    answer:
      "Each team traveling to a different venue or staying at a different hotel gets its own safety review, because the conditions are different. Multiple teams traveling to the same tournament at the same venue can share a single binder, reducing cost. Contact us for multi-team pricing that reflects your league's tournament schedule.",
  },
  {
    question: "How quickly do we get the safety binder back?",
    answer:
      "3-5 business days from trip submission to binder delivery. For leagues planning tournament seasons months in advance, this timeline fits naturally into your preparation schedule. If venue conditions change after the initial review, our analyst can update the binder with current intelligence data.",
  },
  {
    question: "Does SafeTrekr cover out-of-state tournaments?",
    answer:
      "Yes. Out-of-state tournaments are one of the most common use cases. Our analyst reviews destination-specific conditions including state emergency management resources, regional weather patterns, local hospital proximity to the tournament venue, and transportation route safety. The binder documents everything a parent or league board would want to know about sending their athletes across state lines.",
  },
  {
    question: "How does pricing work for a full tournament season?",
    answer:
      "Each tournament trip is priced independently -- $450 for domestic day tournaments, $750 for overnight tournaments. Leagues booking 5 or more trips per season qualify for volume pricing. A travel baseball league sending teams to 8 weekend tournaments would pay approximately $3,600-$6,000 depending on overnight stays, before volume discounts. Contact us for a season quote.",
  },
  {
    question: "Is SafeTrekr appropriate for youth leagues with athletes under 13?",
    answer:
      "Absolutely. Youth leagues with younger athletes carry heightened duty of care obligations. SafeTrekr's review includes factors specifically relevant to younger athletes -- venue appropriateness, emergency medical proximity for pediatric care, supervision ratio assessment, and communication reliability for parent updates. The binder provides your league with evidence that youth protection was professionally reviewed.",
  },
  {
    question: "What if our national governing body already has travel policies?",
    answer:
      "SafeTrekr complements and strengthens your NGB's travel safety requirements. Most governing bodies provide a policy framework -- SafeTrekr provides the documented execution. Your safety binder demonstrates compliance with NGB policies through professional verification, not self-reported checklists.",
  },
  {
    question: "Do you handle international tournament travel?",
    answer:
      "Yes. International tournaments are reviewed at our extended trip rate ($1,250) with additional intelligence sources including State Department advisories, WHO health alerts, and international emergency management data. Our analyst reviews customs, visa requirements, medical insurance coverage internationally, and communication infrastructure at the destination.",
  },
];

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function SportsPage() {
  return (
    <>
      {/* Structured Data */}
      <JsonLd data={generateBreadcrumbSchema(BREADCRUMB_ITEMS)} />

      {/* ----------------------------------------------------------------
          Section 1: Hero
          ---------------------------------------------------------------- */}
      <SectionContainer as="section" aria-labelledby="sports-hero-heading">
        <Container>
          <ScrollReveal>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-body-sm text-muted-foreground">
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-foreground"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/solutions"
                    className="transition-colors hover:text-foreground"
                  >
                    Solutions
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-foreground font-medium">
                  Youth Sports & League Travel
                </li>
              </ol>
            </nav>

            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Left column: copy */}
              <div>
                <Eyebrow icon={<Trophy className="size-4" />}>
                  Tournament Travel Safety
                </Eyebrow>

                <h1
                  id="sports-hero-heading"
                  className="mt-4 text-heading-xl text-secondary"
                >
                  Your Travel Party Deserves a{" "}
                  <span className="text-primary-700">Safety Analyst</span>
                </h1>

                <p className="mt-6 text-body-lg text-muted-foreground">
                  Every away tournament your league sends athletes to gets a
                  professional safety review -- government intelligence on the
                  destination, analyst assessment of the venue, and a
                  documented evidence binder your board and insurance carrier
                  can audit. Starting at{" "}
                  <strong className="text-foreground">$450 per trip</strong>.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Button asChild size="lg">
                    <Link href="/resources/sample-binders">
                      <Download className="size-4" aria-hidden="true" />
                      Download Tournament Sample Binder
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/demo?segment=sports">
                      Get a Demo
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right column: visual placeholder */}
              <div
                className="relative hidden lg:block"
                aria-hidden="true"
              >
                <div className="aspect-[4/3] rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-md)]">
                  <div className="flex items-center gap-3 border-b border-border pb-4">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary-50">
                      <Trophy className="size-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-heading-sm text-foreground">
                        Tournament Safety Binder
                      </p>
                      <p className="text-body-xs text-muted-foreground">
                        Dallas, TX → Orlando, FL • 14 Athletes
                      </p>
                    </div>
                    <Badge variant="brand" className="ml-auto">
                      Analyst Reviewed
                    </Badge>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      "Venue Safety Assessment",
                      "Hotel & Lodging Review",
                      "Transportation Route Analysis",
                      "Weather & Severe Storm Risk",
                      "Emergency Medical Access",
                      "Chaperone Protocol Documentation",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-50">
                          <Check className="size-3.5 text-primary-600" />
                        </div>
                        <span className="text-body-sm text-muted-foreground">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ----------------------------------------------------------------
          Section 2: Trust Strip
          ---------------------------------------------------------------- */}
      <TrustStrip />

      {/* ----------------------------------------------------------------
          Section 3: The Challenge
          ---------------------------------------------------------------- */}
      <SectionContainer
        variant="card"
        as="section"
        aria-labelledby="sports-challenge-heading"
      >
        <Container>
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow icon={<AlertTriangle className="size-4" />} color="muted">
                The Problem
              </Eyebrow>
              <h2
                id="sports-challenge-heading"
                className="mt-4 text-heading-lg text-secondary"
              >
                Tournament Travel Shouldn&apos;t Be a Liability
              </h2>
              <p className="mt-4 text-body-lg text-muted-foreground">
                Every weekend, thousands of youth sports teams travel to
                tournaments with safety plans assembled by volunteer coaches
                between practices. Good intentions are not a safety plan.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {CHALLENGE_CARDS.map((card, index) => (
              <ScrollReveal key={card.title} delay={index * 0.1}>
                <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
                  <span
                    className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-warning-50 text-warning-600 [&_svg]:size-5"
                    aria-hidden="true"
                  >
                    {card.icon}
                  </span>
                  <h3 className="text-heading-sm text-foreground">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-body-sm text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </SectionContainer>

      {/* ----------------------------------------------------------------
          Section 4: How It Works
          ---------------------------------------------------------------- */}
      <SectionContainer as="section" aria-labelledby="sports-how-heading">
        <Container>
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow>How It Works</Eyebrow>
              <h2
                id="sports-how-heading"
                className="mt-4 text-heading-lg text-secondary"
              >
                Three Steps to a Safer Tournament Season
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="mt-12">
              <ProcessTimeline steps={[...PROCESS_STEPS]} />
            </div>
          </ScrollReveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {FEATURE_CARDS.map((card, index) => (
              <ScrollReveal key={card.title} delay={index * 0.1}>
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

      {/* ----------------------------------------------------------------
          Section 5: Sample Binder Preview
          ---------------------------------------------------------------- */}
      <SectionContainer
        variant="card"
        as="section"
        aria-labelledby="sports-binder-heading"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left: visual */}
            <ScrollReveal>
              <div
                className="aspect-[4/3] rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-md)]"
                aria-hidden="true"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary-50">
                    <FileText className="size-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-heading-sm text-foreground">
                      SafeTrekr Safety Binder
                    </p>
                    <p className="text-body-xs text-muted-foreground">
                      Regional Tournament • Orlando, FL
                    </p>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  {BINDER_CHECKLIST.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary-600" />
                      <span className="text-body-sm text-muted-foreground">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Right: copy */}
            <ScrollReveal delay={0.15}>
              <Eyebrow>What Your League Receives</Eyebrow>
              <h2
                id="sports-binder-heading"
                className="mt-4 text-heading-lg text-secondary"
              >
                A Complete Evidence Binder for Every Tournament
              </h2>
              <p className="mt-4 text-body-lg text-muted-foreground">
                Not a checklist. Not a template. A professionally reviewed,
                government-data-backed safety binder that documents every
                decision your league made to protect its athletes. 17 sections.
                5 government intelligence sources. Tamper-evident audit trail.
              </p>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/resources/sample-binders">
                    <Download className="size-4" aria-hidden="true" />
                    Download a Sample Tournament Binder
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </SectionContainer>

      {/* ----------------------------------------------------------------
          Section 6: Proof Points (DARK)
          ---------------------------------------------------------------- */}
      <SectionContainer
        variant="dark"
        as="section"
        aria-labelledby="sports-proof-heading"
      >
        <Container>
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow color="dark">By The Numbers</Eyebrow>
              <h2
                id="sports-proof-heading"
                className="mt-4 text-heading-lg text-white"
              >
                What Professional Safety Review Looks Like
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                stat: "17",
                label: "Sections of Safety Review",
                description:
                  "Every tournament trip reviewed across 17 dimensions -- venue, lodging, transportation, weather, medical access, and more.",
              },
              {
                stat: "5",
                label: "Government Intelligence Sources",
                description:
                  "NOAA, USGS, CDC, and regional emergency management data. Real government intelligence, not Google results.",
              },
              {
                stat: "3-5",
                label: "Business Days to Delivery",
                description:
                  "Submit your tournament details. Receive your complete safety binder in 3-5 business days.",
              },
            ].map((item, index) => (
              <ScrollReveal key={item.label} delay={index * 0.1}>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-display text-primary-400">{item.stat}</p>
                  <p className="mt-2 text-heading-sm text-white">
                    {item.label}
                  </p>
                  <p className="mt-2 text-body-sm text-white/70">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </SectionContainer>

      {/* ----------------------------------------------------------------
          Section 7: Pricing Context
          ---------------------------------------------------------------- */}
      <SectionContainer as="section" aria-labelledby="sports-pricing-heading">
        <Container>
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow>Pricing Context</Eyebrow>
              <h2
                id="sports-pricing-heading"
                className="mt-4 text-heading-lg text-secondary"
              >
                What Does a Season of Safety Cost?
              </h2>
              <p className="mt-4 text-body-lg text-muted-foreground">
                Less than one hour of legal consultation. Less than one
                ambulance ride. Less than one percent of a negligence settlement.
              </p>
            </div>
          </ScrollReveal>

          {/* Scenario cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Local Tournament",
                price: "$450",
                subtitle: "Day trip, same state",
                features: PRICING_FEATURES,
              },
              {
                title: "Overnight Tournament",
                price: "$750",
                subtitle: "Multi-day, hotel stay",
                features: [
                  ...PRICING_FEATURES,
                  "Hotel and lodging safety review",
                ],
                featured: true,
              },
              {
                title: "National / International",
                price: "$1,250",
                subtitle: "Cross-country or abroad",
                features: [
                  ...PRICING_FEATURES,
                  "Extended travel route analysis",
                  "International intelligence sources",
                ],
              },
            ].map((scenario, index) => (
              <ScrollReveal key={scenario.title} delay={index * 0.1}>
                <div
                  className={`rounded-xl border p-6 ${
                    scenario.featured
                      ? "border-primary-200 bg-primary-50/30 shadow-[var(--shadow-md)]"
                      : "border-border bg-card shadow-[var(--shadow-sm)]"
                  }`}
                >
                  {scenario.featured && (
                    <Badge variant="brand" className="mb-4">
                      Most Common
                    </Badge>
                  )}
                  <h3 className="text-heading-sm text-foreground">
                    {scenario.title}
                  </h3>
                  <p className="mt-1 text-body-xs text-muted-foreground">
                    {scenario.subtitle}
                  </p>
                  <p className="mt-4 text-display text-primary-700">
                    {scenario.price}
                  </p>
                  <p className="text-body-xs text-muted-foreground">per trip</p>
                  <ul className="mt-6 space-y-2">
                    {scenario.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-body-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-primary-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Cost comparison table */}
          <ScrollReveal delay={0.3}>
            <div className="mx-auto mt-16 max-w-4xl">
              <h3 className="text-center text-heading-md text-secondary">
                The Real Cost Comparison
              </h3>
              <div className="mt-8 overflow-hidden rounded-xl border border-border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-card">
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-body-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        Without SafeTrekr
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-body-xs font-semibold uppercase tracking-wider text-primary-700"
                      >
                        With SafeTrekr
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COST_COMPARISON_ROWS.map((row, index) => (
                      <tr
                        key={index}
                        className={
                          index < COST_COMPARISON_ROWS.length - 1
                            ? "border-b border-border"
                            : ""
                        }
                      >
                        <td className="px-6 py-4 text-body-sm text-muted-foreground">
                          {row.without}
                        </td>
                        <td className="px-6 py-4 text-body-sm text-foreground">
                          {row.withSafeTrekr}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ----------------------------------------------------------------
          Section 8: Compliance & Trust
          ---------------------------------------------------------------- */}
      <SectionContainer
        variant="card"
        as="section"
        aria-labelledby="sports-compliance-heading"
      >
        <Container>
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow>Security & Compliance</Eyebrow>
              <h2
                id="sports-compliance-heading"
                className="mt-4 text-heading-lg text-secondary"
              >
                Built for Organizations That Take Athlete Safety Seriously
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_BADGES.map((badge, index) => (
              <ScrollReveal key={badge.title} delay={index * 0.1}>
                <div className="rounded-xl border border-border bg-card p-6 text-center shadow-[var(--shadow-sm)]">
                  <span
                    className="mx-auto mb-4 inline-flex size-14 items-center justify-center rounded-full bg-primary-50 text-primary-600"
                    aria-hidden="true"
                  >
                    {badge.icon}
                  </span>
                  <h3 className="text-heading-sm text-foreground">
                    {badge.title}
                  </h3>
                  <p className="mt-2 text-body-sm text-muted-foreground">
                    {badge.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </SectionContainer>

      {/* ----------------------------------------------------------------
          Section 9: FAQ
          ---------------------------------------------------------------- */}
      <SectionContainer as="section" aria-labelledby="sports-faq-heading">
        <Container>
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow>Common Questions</Eyebrow>
              <h2
                id="sports-faq-heading"
                className="mt-4 text-heading-lg text-secondary"
              >
                Youth Sports Travel Safety FAQ
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="mt-12">
              <FAQSection items={FAQ_ITEMS} generateSchema />
            </div>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ----------------------------------------------------------------
          Section 10: CTA Band
          ---------------------------------------------------------------- */}
      <CTABand
        variant="dark"
        headline="Protect Your Next Tournament Trip"
        body="Your athletes train hard. Your coaches prepare game plans. Let a professional safety analyst prepare the safety plan. Starting at $450 per tournament."
        primaryCta={{ text: "Get a Demo", href: "/demo?segment=sports" }}
        secondaryCta={{
          text: "Download Sample Binder",
          href: "/resources/sample-binders",
        }}
      />
    </>
  );
}
