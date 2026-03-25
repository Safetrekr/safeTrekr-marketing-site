/**
 * ST-880: REQ-080 -- Pricing Page (/pricing)
 *
 * Transparent pricing page for SafeTrekr. Establishes the "$15 per participant"
 * anchor, compares against liability and staff costs, then walks through three
 * trip tiers, volume discounts, included features, segment scenarios, procurement
 * resources, and a 10-question FAQ.
 *
 * Server Component at the page level. Client components (Accordion via FAQSection,
 * ScrollReveal, StaggerChildren) are rendered as children within this tree.
 *
 * Section order:
 *   1. Hero              -- "$15 Per Participant" framing
 *   2. Value Anchor      -- 3 comparison cards (liability, staff, SafeTrekr)
 *   3. Pricing Tiers     -- 3 PricingTierCards (Field, Extended, International)
 *   4. Volume Discounts  -- 5-tier table with mobile cards
 *   5. What's Included   -- 7 FeatureCards on primary-50 wash
 *   6. ROI Calculator    -- Link to /resources/roi-calculator
 *   7. Segment Scenarios -- 4 pricing scenario cards
 *   8. Procurement       -- Dark section with checklist + /procurement link
 *   9. FAQ               -- 10 pricing questions with FAQPage JSON-LD
 *  10. CTA Band          -- Conversion band
 *  11. JSON-LD           -- Product + Offer schemas
 *
 * @see designs/html/mockup-pricing.html
 */

import type { ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  Shield,
  ClipboardCheck,
  Activity,
  FileText,
  Smartphone,
  Radio,
  Scale,
  User,
  Calculator,
  ArrowRight,
  Check,
  GraduationCap,
  Building2,
  School,
} from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import { JsonLd, type FAQItem } from "@/lib/structured-data";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { SectionContainer } from "@/components/layout/section-container";
import { Container } from "@/components/layout/container";
import {
  Eyebrow,
  PricingTierCard,
  FAQSection,
  CTABand,
  FeatureCard,
} from "@/components/marketing";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { StaggerChildren } from "@/components/motion/stagger-children";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "Pricing",
  description:
    "Professional trip safety starting at $15 per participant. Every trip reviewed by a safety analyst. Field trips, mission trips, study abroad, and corporate travel.",
  path: "/pricing",
});

// ---------------------------------------------------------------------------
// Data constants
// ---------------------------------------------------------------------------

const PRICING_FEATURES = [
  "17-section analyst safety review",
  "Risk intelligence from 5 government sources",
  "Complete trip safety binder",
  "Mobile field operations access",
  "Real-time monitoring and geofencing",
  "Compliance documentation",
  "Dedicated analyst assignment",
] as const;

const VOLUME_TIERS = [
  { trips: "1\u20134 trips", discount: "Standard rate", example: "$450 / trip", highlighted: false },
  { trips: "5\u20139 trips", discount: "5% off", example: "$427.50 / trip", highlighted: false },
  { trips: "10\u201324 trips", discount: "10% off", example: "$405 / trip", highlighted: false },
  { trips: "25\u201349 trips", discount: "15% off", example: "$382.50 / trip", highlighted: false },
  { trips: "50+ trips", discount: "20% off", example: "$360 / trip", highlighted: true },
] as const;

const INCLUDED_FEATURES: Array<{
  icon: ReactNode;
  title: string;
  description: string;
  featured?: boolean;
}> = [
  {
    icon: <ClipboardCheck className="size-6" />,
    title: "17-Section Analyst Safety Review",
    description:
      "A trained safety analyst reviews every trip across 17 safety dimensions. No automated scoring alone -- human expertise on every review.",
  },
  {
    icon: <Activity className="size-6" />,
    title: "Risk Intelligence Engine",
    description:
      "Monte Carlo probability scoring from five government data sources: NOAA, USGS, CDC, GDACS, and ReliefWeb.",
  },
  {
    icon: <FileText className="size-6" />,
    title: "Complete Trip Safety Binder",
    description:
      "Audit-ready documentation delivered in 3-5 days. SHA-256 hash-chain ensures tamper-evident integrity on every page.",
  },
  {
    icon: <Smartphone className="size-6" />,
    title: "Mobile Field Operations",
    description:
      "Live trip map, geofencing, rally points, muster check-ins, and SMS broadcast in every chaperone's pocket.",
  },
  {
    icon: <Radio className="size-6" />,
    title: "Real-Time Monitoring",
    description:
      "Geofence alerts, participant location visibility, and emergency coordination tools available throughout the trip.",
  },
  {
    icon: <Scale className="size-6" />,
    title: "Compliance Documentation",
    description:
      "FERPA, SOC 2, and GDPR-ready documentation. Complete tamper-evident audit trail with purge proof capabilities.",
  },
  {
    icon: <User className="size-6" />,
    title: "Dedicated Analyst Assignment",
    description:
      "Every trip is assigned to a named safety analyst who serves as your point of contact throughout the review process.",
    featured: true,
  },
];

const PRICING_FAQS: FAQItem[] = [
  {
    question: 'What counts as a "trip"?',
    answer:
      "A trip is any organized travel event with a defined destination, dates, and participant group. A one-day field trip to a local museum counts as one trip. A week-long mission trip to Guatemala counts as one trip. Multi-stop itineraries within the same travel event are one trip. Each trip receives its own analyst review and safety binder.",
  },
  {
    question: "Can we start with just one trip?",
    answer:
      "Yes. There is no minimum commitment. Many organizations start with a single trip to experience the full SafeTrekr process -- analyst review, risk intelligence scoring, and safety binder delivery -- before committing to additional trips. Volume discounts apply automatically as you add more trips within a 12-month period.",
  },
  {
    question: "How does volume pricing work?",
    answer:
      "Volume discounts are calculated based on the total number of trips your organization submits within a rolling 12-month window. Discounts range from 5% (5-9 trips) to 20% (50+ trips) and are applied automatically. If you cross into a new tier mid-year, the new discount rate applies to all subsequent trips.",
  },
  {
    question: "Is there an annual plan?",
    answer:
      "We offer annual agreements for organizations with predictable trip volumes. Annual plans lock in volume discount rates and include priority analyst assignment. Contact our sales team to discuss annual plan options tailored to your organization's schedule.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept credit cards (Visa, Mastercard, American Express), ACH bank transfers, and purchase orders for organizations with established procurement processes. School districts and government entities can use standard PO workflows. Invoicing is available for annual plans.",
  },
  {
    question: "What happens after we purchase?",
    answer:
      "After purchase, you submit your trip details through the SafeTrekr platform -- destination, dates, participants, activities, and logistics. Submission takes approximately 15 minutes. Your trip is assigned to a dedicated safety analyst who conducts the 17-section review. You receive your complete safety binder within 3-5 business days.",
  },
  {
    question: "Can we upgrade trip type after submission?",
    answer:
      "If your trip scope changes -- for example, a domestic trip adds an international leg -- contact your assigned analyst. We will adjust the review scope and billing accordingly. Upgrades are pro-rated based on the difference between trip types.",
  },
  {
    question: "Do you offer nonprofit or church discounts?",
    answer:
      "Our volume pricing structure is designed to accommodate organizations of all sizes. Churches and nonprofits with multiple annual trips typically qualify for volume discounts of 10-20%. Contact our sales team to discuss pricing for your specific situation. We also offer annual plans that can further reduce per-trip costs.",
  },
  {
    question: "How does per-student pricing work for large groups?",
    answer:
      "Per-student cost decreases as group size increases because SafeTrekr pricing is per-trip, not per-participant. A field trip with 30 students costs $450 ($15/student). The same $450 field trip with 60 students drops to $7.50/student. The analyst review covers the entire trip regardless of group size.",
  },
  {
    question: "What if we need to cancel a trip review?",
    answer:
      "If you cancel before the analyst review begins, you receive a full refund. If the review is already in progress, we will complete the review and deliver the safety binder -- the work has value even if the trip is postponed. Completed reviews can be applied to rescheduled trips to the same destination within 90 days.",
  },
];

// ---------------------------------------------------------------------------
// JSON-LD structured data
// ---------------------------------------------------------------------------

function PricingJsonLd() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "SafeTrekr Professional Trip Safety",
    description:
      "Professional safety analyst review, risk intelligence scoring, and audit-ready documentation for every trip.",
    brand: { "@type": "Brand", name: "SafeTrekr" },
    offers: [
      {
        "@type": "Offer",
        name: "Field Trip",
        price: "450",
        priceCurrency: "USD",
        description:
          "Domestic day and overnight field trips. ~$15 per student for a 30-person group.",
        url: "https://www.safetrekr.com/pricing#field-trip",
      },
      {
        "@type": "Offer",
        name: "Extended Trip",
        price: "750",
        priceCurrency: "USD",
        description:
          "Multi-day domestic trips, sports travel, retreats. ~$30 per participant for a 25-person group.",
        url: "https://www.safetrekr.com/pricing#extended-trip",
      },
      {
        "@type": "Offer",
        name: "International",
        price: "1250",
        priceCurrency: "USD",
        description:
          "International travel, study abroad, mission trips. ~$62.50 per participant for a 20-person group.",
        url: "https://www.safetrekr.com/pricing#international",
      },
    ],
  };

  return <JsonLd data={productSchema} />;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PricingPage() {
  return (
    <>
      {/* ST-904/ST-905: BreadcrumbList JSON-LD for pricing page */}
      <BreadcrumbJsonLd path="/pricing" currentPageTitle="Pricing" />

      {/* ================================================================
          SECTION 1: HERO
          ================================================================ */}
      <SectionContainer aria-label="Pricing hero">
        <Container>
          <div className="pt-4 pb-4 text-center sm:pt-8 sm:pb-8 lg:pt-12 lg:pb-12">
            <ScrollReveal>
              <Eyebrow className="mb-4">Transparent Pricing</Eyebrow>
            </ScrollReveal>

            <ScrollReveal>
              <h1 className="mx-auto max-w-4xl text-display-lg text-foreground">
                Professional Trip Safety Starting at{" "}
                <span className="text-primary-700">$15 Per Participant</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal>
              <p className="mx-auto mt-6 max-w-prose text-body-lg text-muted-foreground">
                Every trip reviewed by a safety analyst. Every document audit-ready.
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/demo">Get a Demo</Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 2: VALUE ANCHOR
          ================================================================ */}
      <SectionContainer variant="card" aria-label="Value comparison">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {/* Liability Card */}
            <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 md:flex-col md:items-start md:gap-0">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#fef3c7]">
                <AlertTriangle className="size-6 text-[#b45309]" aria-hidden="true" />
              </div>
              <div className="md:mt-4">
                <p
                  className="text-display-md text-foreground"
                  aria-label="Average trip-related injury settlement: $500,000 to $2 million"
                >
                  $500K &ndash; $2M
                </p>
                <p className="mt-2 text-body-md text-muted-foreground">
                  Average trip-related injury settlement
                </p>
              </div>
            </div>

            {/* Staff Time Card */}
            <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 md:flex-col md:items-start md:gap-0">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Clock className="size-6 text-muted-foreground" aria-hidden="true" />
              </div>
              <div className="md:mt-4">
                <p
                  className="text-display-md text-foreground"
                  aria-label="Staff time for manual safety planning per trip: $700 to $1,400"
                >
                  $700 &ndash; $1,400
                </p>
                <p className="mt-2 text-body-md text-muted-foreground">
                  Staff time for manual safety planning per trip
                </p>
              </div>
            </div>

            {/* SafeTrekr Card (emphasized) */}
            <div className="flex items-start gap-4 rounded-xl border-2 border-primary-200 bg-white p-6 md:flex-col md:items-start md:gap-0">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                <Shield className="size-6 text-primary-700" aria-hidden="true" />
              </div>
              <div className="md:mt-4">
                <p
                  className="text-display-md text-primary-700"
                  aria-label="Per student with SafeTrekr analyst review: $15"
                >
                  $15
                </p>
                <p className="mt-2 text-body-md text-muted-foreground">
                  Per student with SafeTrekr analyst review
                </p>
              </div>
            </div>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 3: PRICING TIER CARDS
          ================================================================ */}
      <SectionContainer aria-label="Pricing tiers">
        <Container>
          <div className="text-center">
            <ScrollReveal>
              <Eyebrow className="mb-4">Choose Your Trip Type</Eyebrow>
            </ScrollReveal>
            <ScrollReveal>
              <p className="mx-auto max-w-prose text-body-lg text-muted-foreground">
                One price per trip. Every feature included.
              </p>
            </ScrollReveal>
          </div>

          <StaggerChildren className="mt-12 grid grid-cols-1 items-start gap-6 md:grid-cols-3 lg:mt-16 lg:gap-8">
            <PricingTierCard
              id="field-trip"
              tierName="Field Trip"
              price="$450"
              perParticipant="~$15 / student (based on 30 participants)"
              features={[...PRICING_FEATURES]}
              ctaText="Get a Demo"
              ctaHref="/demo"
            />

            <PricingTierCard
              id="extended-trip"
              tierName="Extended Trip"
              price="$750"
              perParticipant="~$30 / participant (based on 25 participants)"
              features={[...PRICING_FEATURES]}
              ctaText="Get a Demo"
              ctaHref="/demo"
              featured
              badge="Most Common"
            />

            <PricingTierCard
              id="international"
              tierName="International"
              price="$1,250"
              perParticipant="~$62.50 / participant (based on 20 participants)"
              features={[...PRICING_FEATURES]}
              ctaText="Get a Demo"
              ctaHref="/demo"
            />
          </StaggerChildren>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 4: VOLUME DISCOUNTS
          ================================================================ */}
      <SectionContainer aria-label="Volume discounts">
        <Container size="md">
          <div className="text-center">
            <ScrollReveal>
              <Eyebrow className="mb-4">Volume Pricing</Eyebrow>
            </ScrollReveal>
            <ScrollReveal>
              <p className="text-body-lg text-muted-foreground">
                More trips. Better rates.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal>
            <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-sm)]">
              {/* Desktop Table */}
              <table
                className="hidden w-full sm:table"
                aria-label="Volume discount pricing table"
              >
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th scope="col" className="px-6 py-4 text-left text-eyebrow text-muted-foreground">
                      Trips Per Year
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-eyebrow text-muted-foreground">
                      Discount
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-eyebrow text-muted-foreground">
                      Example (Field Trip)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {VOLUME_TIERS.map((tier) => (
                    <tr
                      key={tier.trips}
                      className={
                        tier.highlighted
                          ? "bg-primary-50/50"
                          : "border-b border-border"
                      }
                    >
                      <td
                        className={`px-6 py-4 text-body-md ${
                          tier.highlighted
                            ? "font-semibold text-primary-700"
                            : "text-foreground"
                        }`}
                      >
                        {tier.trips}
                      </td>
                      <td
                        className={`px-6 py-4 text-body-md ${
                          tier.highlighted
                            ? "font-semibold text-primary-700"
                            : "text-foreground"
                        }`}
                      >
                        {tier.discount}
                      </td>
                      <td
                        className={`px-6 py-4 text-right text-body-md ${
                          tier.highlighted
                            ? "font-semibold text-primary-700"
                            : "text-foreground"
                        }`}
                      >
                        {tier.example}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="flex flex-col divide-y divide-border sm:hidden">
                {VOLUME_TIERS.map((tier) => (
                  <div
                    key={tier.trips}
                    className={`p-4 ${tier.highlighted ? "bg-primary-50/50" : ""}`}
                  >
                    <dt
                      className={`text-heading-sm ${
                        tier.highlighted ? "text-primary-700" : "text-foreground"
                      }`}
                    >
                      {tier.trips}
                    </dt>
                    <dd className="mt-2 flex justify-between">
                      <span
                        className={`text-body-sm ${
                          tier.highlighted
                            ? "font-semibold text-primary-700"
                            : "text-muted-foreground"
                        }`}
                      >
                        {tier.discount}
                      </span>
                      <span
                        className={`text-body-sm font-medium ${
                          tier.highlighted
                            ? "font-semibold text-primary-700"
                            : "text-foreground"
                        }`}
                      >
                        {tier.example}
                      </span>
                    </dd>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <div className="mt-8 text-center">
            <p className="text-body-md text-muted-foreground">
              Need an annual plan or custom volume pricing?
            </p>
            <Button variant="secondary" size="md" className="mt-4" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 5: WHAT'S INCLUDED IN EVERY TRIP
          ================================================================ */}
      <SectionContainer variant="brand" aria-labelledby="included-heading">
        <Container>
          <div className="text-center">
            <ScrollReveal>
              <Eyebrow className="mb-4">Included in Every Trip</Eyebrow>
            </ScrollReveal>
            <ScrollReveal>
              <h2 id="included-heading" className="text-display-md text-foreground">
                No Tiers. No Feature Gates. No Surprises.
              </h2>
            </ScrollReveal>
            <ScrollReveal>
              <p className="mx-auto mt-4 max-w-prose text-body-lg text-muted-foreground">
                Every trip type includes the full SafeTrekr platform. The only
                difference is destination complexity.
              </p>
            </ScrollReveal>
          </div>

          <StaggerChildren className="mt-12 grid gap-6 sm:grid-cols-2">
            {INCLUDED_FEATURES.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                className={
                  feature.featured
                    ? "sm:col-span-2 border-2 border-primary-200 bg-white"
                    : "bg-white"
                }
              />
            ))}
          </StaggerChildren>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 6: ROI CALCULATOR LINK
          ================================================================ */}
      <SectionContainer variant="card" aria-label="ROI calculator">
        <Container size="md">
          <div className="text-center">
            <ScrollReveal>
              <div className="mx-auto flex size-12 items-center justify-center">
                <Calculator className="size-10 text-primary-500 sm:size-12" aria-hidden="true" />
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <h2 className="mt-6 text-display-md text-foreground">
                Calculate Your Organization&apos;s ROI
              </h2>
            </ScrollReveal>

            <ScrollReveal>
              <p className="mx-auto mt-4 max-w-prose text-body-lg text-muted-foreground">
                See how much SafeTrekr saves in staff time, liability reduction,
                and documentation costs compared to manual safety planning.
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <Button variant="primary" size="lg" className="mt-8" asChild>
                <Link href="/resources/roi-calculator" className="inline-flex items-center gap-2">
                  Use the ROI Calculator
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Link>
              </Button>
            </ScrollReveal>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 7: SEGMENT-SPECIFIC PRICING SCENARIOS
          ================================================================ */}
      <SectionContainer aria-label="Pricing scenarios">
        <Container>
          <div className="text-center">
            <ScrollReveal>
              <Eyebrow className="mb-4">What It Costs in Practice</Eyebrow>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="text-display-md text-foreground">
                Real Scenarios for Real Organizations
              </h2>
            </ScrollReveal>
          </div>

          <StaggerChildren className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8">
            {/* K-12 School District */}
            <Link
              href="/solutions/k12"
              className="group block rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] sm:p-8"
              aria-label="Annual cost for a K-12 school district with 20 field trips per year: $9,000"
            >
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary-50">
                <School className="size-6 text-primary-700" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-heading-sm text-foreground">K-12 School District</h3>
              <p className="mt-2 text-body-sm text-muted-foreground">
                20 field trips / year<br />
                30 students per trip
              </p>
              <p className="mt-4 text-heading-md text-foreground">$9,000 / year</p>
              <p className="mt-1 text-body-sm font-medium text-primary-700">$15 per student</p>
              <span className="mt-4 inline-flex items-center gap-1 text-body-sm font-medium text-primary-700">
                Learn more
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </Link>

            {/* Church or Mission Org */}
            <Link
              href="/solutions/churches"
              className="group block rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] sm:p-8"
              aria-label="Annual cost for a church or mission organization with 3 mission trips per year: $2,700"
            >
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary-50">
                {/* Church icon (inline SVG since lucide doesn't have Church) */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6 text-primary-700"
                  aria-hidden="true"
                >
                  <path d="M18 22H6" />
                  <path d="M6 22V10l6-6 6 6v12" />
                  <path d="M12 4V2" />
                  <path d="M9 4h6" />
                  <path d="M10 22v-4h4v4" />
                </svg>
              </div>
              <h3 className="mt-4 text-heading-sm text-foreground">Church or Mission Org</h3>
              <p className="mt-2 text-body-sm text-muted-foreground">
                3 mission trips / year<br />
                Mixed domestic and international
              </p>
              <p className="mt-4 text-heading-md text-foreground">$2,700 / year</p>
              <p className="mt-1 text-body-sm font-medium text-primary-700">
                Less than 1% of annual missions budget
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-body-sm font-medium text-primary-700">
                Learn more
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </Link>

            {/* Higher Education */}
            <Link
              href="/solutions/higher-education"
              className="group block rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] sm:p-8"
              aria-label="Annual cost for higher education with 8 study abroad programs per year: $10,000"
            >
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary-50">
                <GraduationCap className="size-6 text-primary-700" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-heading-sm text-foreground">Higher Education</h3>
              <p className="mt-2 text-body-sm text-muted-foreground">
                8 study abroad programs / year<br />
                20-25 participants each
              </p>
              <p className="mt-4 text-heading-md text-foreground">$10,000 / year</p>
              <p className="mt-1 text-body-sm font-medium text-primary-700">
                Less than $50 per student for global safety coverage
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-body-sm font-medium text-primary-700">
                Learn more
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </Link>

            {/* Corporate / Sports */}
            <Link
              href="/solutions/corporate"
              className="group block rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] sm:p-8"
              aria-label="Annual cost for corporate or sports organizations with 15 team trips per year: $11,250"
            >
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary-50">
                <Building2 className="size-6 text-primary-700" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-heading-sm text-foreground">Corporate / Sports</h3>
              <p className="mt-2 text-body-sm text-muted-foreground">
                15 team trips / year<br />
                25 participants each
              </p>
              <p className="mt-4 text-heading-md text-foreground">$11,250 / year</p>
              <p className="mt-1 text-body-sm font-medium text-primary-700">$30 per participant</p>
              <span className="mt-4 inline-flex items-center gap-1 text-body-sm font-medium text-primary-700">
                Learn more
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </Link>
          </StaggerChildren>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 8: PROCUREMENT PATH (Dark Section)
          ================================================================ */}
      <SectionContainer variant="dark" aria-label="Procurement resources">
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Left Column: CTA */}
            <div>
              <ScrollReveal>
                <h2 className="text-display-md text-white">Ready to Purchase?</h2>
              </ScrollReveal>
              <ScrollReveal>
                <p className="mt-4 text-body-lg text-muted-foreground">
                  We have everything your procurement team needs. Skip the sales
                  cycle with ready-made documentation.
                </p>
              </ScrollReveal>
              <ScrollReveal>
                <Button variant="primaryOnDark" size="lg" className="mt-8" asChild>
                  <Link href="/procurement" className="inline-flex items-center gap-2">
                    For Procurement
                    <ArrowRight className="size-5" aria-hidden="true" />
                  </Link>
                </Button>
              </ScrollReveal>
            </div>

            {/* Right Column: Checklist */}
            <div>
              <ScrollReveal>
                <p className="mb-6 text-eyebrow text-primary-400">Procurement documents:</p>
              </ScrollReveal>
              <ul className="flex flex-col gap-4">
                {[
                  "W-9 form",
                  "Security questionnaire",
                  "Contract templates",
                  "Data Processing Agreement (DPA)",
                  "Insurance certificate",
                  "Compliance overview",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check
                      className="size-5 shrink-0 text-[#6cbc8b]"
                      aria-hidden="true"
                    />
                    <span className="text-body-md text-[#b8c3c7]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 9: COMMON QUESTIONS (FAQ)
          ================================================================ */}
      <SectionContainer aria-label="Frequently asked questions">
        <Container size="md">
          <div className="text-center">
            <ScrollReveal>
              <Eyebrow className="mb-4">Common Questions</Eyebrow>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="text-display-md text-foreground">
                Everything you need to know about pricing.
              </h2>
            </ScrollReveal>
          </div>

          <div className="mt-12">
            <FAQSection items={PRICING_FAQS} generateSchema />
          </div>

          <div className="mt-8 text-center">
            <p className="text-body-md text-muted-foreground">
              Have a question we didn&apos;t answer?
            </p>
            <Button variant="secondary" size="md" className="mt-4" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 10: CONVERSION CTA BAND
          ================================================================ */}
      <CTABand
        variant="dark"
        headline="Protect Your Next Trip"
        body="Every trip deserves a safety analyst. Start with a personalized demo."
        primaryCta={{ text: "Get a Demo", href: "/demo" }}
        secondaryCta={{ text: "Contact Sales", href: "/contact" }}
      />

      {/* ================================================================
          JSON-LD STRUCTURED DATA
          ================================================================ */}
      <PricingJsonLd />
    </>
  );
}
