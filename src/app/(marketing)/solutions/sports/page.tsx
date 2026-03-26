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
  title: "Sports Team Travel Planning",
  description:
    "Tournament travel planning that keeps the focus on the game. SafeTrekr provides professional safety review, simple processes for volunteer coaches, and documentation that demonstrates responsible preparation.",
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
    title: "Coach Submits Trip Details",
    description:
      "The coach or team manager enters destination, dates, roster size, tournament details, and travel arrangements through a guided form. Takes 15 minutes.",
  },
  {
    number: 2,
    title: "Analyst Reviews Everything",
    description:
      "A professional safety analyst evaluates 17 standardized sections using current information from government data sources. Venues verified. Hotels assessed. Emergency contacts documented.",
  },
  {
    number: 3,
    title: "Documentation Delivered",
    description:
      "Your organization receives a complete safety binder with every finding, recommendation, and contact. Share with parents, board, and organizational files.",
  },
] as const;

const FEATURE_CARDS = [
  {
    icon: <ClipboardCheck className="size-6" />,
    title: "Tournament Travel Assessment",
    description:
      "Comprehensive review for tournament travel. Venue safety, hotel evaluation, transportation assessment, and emergency contacts -- all documented by a trained analyst.",
    href: "/platform/analyst-review",
    linkText: "Learn about analyst review",
  },
  {
    icon: <Users className="size-6" />,
    title: "Youth Care Documentation",
    description:
      "Safety binders structured to demonstrate responsibility for minor athletes. Documented supervision considerations, lodging arrangements, and travel policies.",
    href: "/platform/safety-binder",
    linkText: "Learn about the safety binder",
  },
  {
    icon: <FileText className="size-6" />,
    title: "Parent-Ready Documentation",
    description:
      "Safety binders designed to be shared with parents. When families ask about trip preparation, you have professional documentation that builds confidence.",
    href: "/platform/safety-binder",
    linkText: "Learn about the safety binder",
  },
  {
    icon: <Activity className="size-6" />,
    title: "Volunteer Coach Friendly",
    description:
      "Simple 15-minute trip submission designed for volunteer coaches. Guided form walks through the information needed. No specialized knowledge required.",
    href: "/platform/mobile-app",
    linkText: "Learn about mobile operations",
  },
] as const;

const CHALLENGE_CARDS = [
  {
    icon: <FileText className="size-6" />,
    title: "Volunteer Coaches Wear Many Hats",
    description:
      "Volunteer coaches are focused on developing athletes -- not on becoming safety planning experts. Hotel bookings and game schedules get handled. Structured safety assessment often doesn't.",
  },
  {
    icon: <Shield className="size-6" />,
    title: "No Formal Safety Planning Training",
    description:
      "Youth sports organizations send teams across the country with passionate coaches who have no formal safety planning background. Good intentions deserve professional support.",
  },
  {
    icon: <Users className="size-6" />,
    title: "Parents Want to Know the Plan",
    description:
      "When families ask about trip preparation, organizations benefit from having professional documentation that demonstrates responsible planning.",
  },
  {
    icon: <AlertCircle className="size-6" />,
    title: "Organizations Need Records",
    description:
      "Boards, administrators, and organizational files benefit from structured documentation that shows safety planning was professionally reviewed.",
  },
] as const;

const BINDER_CHECKLIST = [
  "17-section analyst review",
  "5 government data sources",
  "Complete safety binder",
  "Mobile field support",
  "3-5 day delivery",
] as const;

const PRICING_FEATURES = [
  "17-section analyst review",
  "5 government data sources",
  "Complete safety binder",
  "Mobile field support",
  "3-5 day delivery",
] as const;

const COST_COMPARISON_ROWS = [
  {
    without:
      "Volunteer coaches spend hours assembling safety information between practices and games",
    withSafeTrekr:
      "Professional analyst completes 17-section review in 3-5 days. Coaches focus on the athletes.",
  },
  {
    without:
      "Safety planning handled informally without structured documentation",
    withSafeTrekr:
      "Professional documentation your organization can share with parents, board, and files.",
  },
  {
    without:
      "No clear record of what safety planning was completed for each trip",
    withSafeTrekr:
      "Complete safety binder with every finding, recommendation, and contact documented.",
  },
  {
    without:
      "Parents may have questions about trip preparation that are difficult to answer comprehensively",
    withSafeTrekr:
      "Professional documentation that builds parent confidence in your organization's preparation.",
  },
] as const;

const TRUST_BADGES = [
  {
    icon: <Shield className="size-8" />,
    title: "Club and League Support",
    description:
      "Pricing and workflows designed for club organizations managing multiple teams. Central visibility with team-level access for coaches and managers.",
  },
  {
    icon: <FileText className="size-8" />,
    title: "Organization Accountability",
    description:
      "Documentation that demonstrates your organization takes player safety seriously. Structured records for your board, parents, and organizational files.",
  },
  {
    icon: <Activity className="size-8" />,
    title: "Professional Standards",
    description:
      "Every trip reviewed by a trained safety analyst using standardized methodology and current government data sources.",
  },
  {
    icon: <Trophy className="size-8" />,
    title: "Parent Confidence",
    description:
      "Safety binders designed to be shared with families, demonstrating that professional preparation was completed for team travel.",
  },
] as const;

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How does SafeTrekr help with youth sports accountability?",
    answer:
      "Sports organizations are expected to have responsible practices for travel with minor athletes. SafeTrekr safety binders provide structured documentation of travel safety planning, including lodging arrangements, supervision considerations, and transportation assessment. This demonstrates your organization takes athlete safety seriously.",
  },
  {
    question: "Can we use SafeTrekr for multiple teams in our club?",
    answer:
      "Yes. SafeTrekr supports club-wide use with central administration. Club administrators can view all team trips, establish consistent processes, and access documentation. Individual coaches submit trips for their teams. Contact us for club pricing.",
  },
  {
    question: "How do volunteer coaches use the system?",
    answer:
      "The trip submission process is designed for volunteer coaches without specialized training. A guided form walks coaches through entering destination, dates, roster size, tournament details, and travel arrangements. Takes about 15 minutes. No special knowledge required.",
  },
  {
    question: "Can we share the safety binder with parents?",
    answer:
      "Yes. Safety binders are designed to be shared with parents, demonstrating that professional preparation was completed for team travel. Many organizations share binders proactively to build parent confidence.",
  },
  {
    question: "What if we're traveling to a large tournament complex with multiple venues?",
    answer:
      "Multi-venue tournaments are assessed comprehensively. Each primary venue receives evaluation, and the safety binder documents the overall tournament environment including common areas, parking, and emergency facilities.",
  },
  {
    question: "Do you assess the hotels we're booking?",
    answer:
      "Yes. Our analyst review includes hotel assessment covering location, emergency egress, proximity to medical facilities, and youth-appropriate accommodations. We verify the hotel is suitable for team travel with minors.",
  },
  {
    question: "How does SafeTrekr handle transportation?",
    answer:
      "Transportation assessment is included in every review. Whether your team is traveling by charter bus, rental vehicles, or air travel, we evaluate the transportation component and document relevant considerations.",
  },
  {
    question: "What sports organizations use SafeTrekr?",
    answer:
      "SafeTrekr serves youth sports organizations across soccer, baseball, basketball, hockey, volleyball, lacrosse, swimming, and other competitive sports. Club teams, travel leagues, and competitive programs all benefit from professional trip planning.",
  },
  {
    question: "Do you offer season arrangements or annual agreements?",
    answer:
      "Yes. Organizations with multiple teams or frequent travel can benefit from annual agreements. Contact us to discuss volume pricing for your organization.",
  },
  {
    question: "How quickly can we get documentation for an upcoming tournament?",
    answer:
      "Standard delivery is 3-5 business days. Priority processing is available for Multi-Day and National/International trips. Contact us for expedited options.",
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
                  Sports Team Planning
                </Eyebrow>

                <h1
                  id="sports-hero-heading"
                  className="mt-4 text-heading-xl text-secondary"
                >
                  Tournament travel planning that keeps the{" "}
                  <span className="text-primary-700">focus on the game</span>
                </h1>

                <p className="mt-6 text-body-lg text-muted-foreground">
                  Your coaches focus on developing athletes. SafeTrekr handles
                  the safety documentation. Every tournament trip, away game,
                  and training camp professionally reviewed. Simple for
                  volunteer coaches. Shareable with parents. Ready for your
                  organization.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Button asChild size="lg">
                    <Link href="/demo?segment=sports">
                      Schedule a Walkthrough
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/resources/sample-binders">
                      <Download className="size-4" aria-hidden="true" />
                      View Sample Binder
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
                The Challenge
              </Eyebrow>
              <h2
                id="sports-challenge-heading"
                className="mt-4 text-heading-lg text-secondary"
              >
                Travel planning works better with professional support
              </h2>
              <p className="mt-4 text-body-lg text-muted-foreground">
                Youth sports organizations send teams across the country -- and
                sometimes internationally -- with volunteer coaches who are
                passionate about their sport but have no formal safety planning
                training. SafeTrekr gives volunteer coaches professional support
                for the safety planning component.
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
                From trip registration to complete documentation in 3-5 days
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
              <Eyebrow>What Your Organization Receives</Eyebrow>
              <h2
                id="sports-binder-heading"
                className="mt-4 text-heading-lg text-secondary"
              >
                Professional preparation for every team trip
              </h2>
              <p className="mt-4 text-body-lg text-muted-foreground">
                A professionally reviewed safety binder that documents venue
                safety, hotel evaluation, transportation assessment, and
                emergency contacts. 17 sections. 5 government data sources.
                Ready to share with parents and organizational files.
              </p>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/resources/sample-binders">
                    <Download className="size-4" aria-hidden="true" />
                    View Sample Binder
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
                  "Every tournament trip reviewed across 17 standardized sections -- venue, lodging, transportation, weather, medical access, and more.",
              },
              {
                stat: "5",
                label: "Government Data Sources",
                description:
                  "Current information from government data sources including weather, emergency management, and regional conditions.",
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
              <Eyebrow>Pricing</Eyebrow>
              <h2
                id="sports-pricing-heading"
                className="mt-4 text-heading-lg text-secondary"
              >
                Professional preparation. Straightforward pricing.
              </h2>
              <p className="mt-4 text-body-lg text-muted-foreground">
                Professional travel planning is accessible for youth sports
                organizations of any size.
              </p>
            </div>
          </ScrollReveal>

          {/* Scenario cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Regional Tournament",
                price: "$450",
                subtitle: "~$23/player for a 20-player roster",
                features: PRICING_FEATURES,
              },
              {
                title: "Multi-Day Tournament",
                price: "$750",
                subtitle: "~$38/player for a 20-player roster",
                features: [
                  ...PRICING_FEATURES,
                  "Extended trip support",
                  "Multi-venue assessment",
                  "Hotel evaluation",
                  "Priority analyst assignment",
                ],
                featured: true,
              },
              {
                title: "National / International",
                price: "$1,250",
                subtitle: "~$63/player for a 20-player roster",
                features: [
                  ...PRICING_FEATURES,
                  "Air travel assessment",
                  "International information coverage",
                  "Extended monitoring period",
                  "Evacuation planning documentation",
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
                      Most Popular
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
              <Eyebrow>Built for Sports Organizations</Eyebrow>
              <h2
                id="sports-compliance-heading"
                className="mt-4 text-heading-lg text-secondary"
              >
                Professional preparation for every team trip
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
        headline="Ready to go with a plan?"
        body="See how SafeTrekr delivers professional trip planning for sports organizations with documentation that demonstrates responsible preparation."
        primaryCta={{ text: "Schedule a Walkthrough", href: "/demo?segment=sports" }}
        secondaryCta={{
          text: "View Pricing",
          href: "/pricing",
        }}
      />
    </>
  );
}
