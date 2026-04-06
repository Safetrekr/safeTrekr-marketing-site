/**
 * ST-880: REQ-080 -- Pricing Page (/pricing)
 *
 * Straightforward pricing page for SafeTrekr. Presents three trip tiers
 * (Day Trip, Extended Trip, International), included features, optional add-ons,
 * segment scenarios, procurement resources, and FAQ.
 *
 * Server Component at the page level. Client components (Accordion via FAQSection,
 * ScrollReveal, StaggerChildren) are rendered as children within this tree.
 *
 * Section order:
 *   1. Hero              -- "Professional trip assessment. Straightforward pricing."
 *   2. Pricing Tiers     -- 3 PricingTierCards (Day Trip, Extended, International)
 *   3. What's Included   -- 8 FeatureCards on primary-50 wash
 *   4. Add-ons/Scenarios -- ROI Calculator + 4 pricing scenario cards
 *   4b. Procurement      -- Dark section with checklist + /procurement link
 *   5. FAQ               -- 6 pricing questions with FAQPage JSON-LD
 *   6. CTA Band          -- Conversion band
 *   7. JSON-LD           -- Product + Offer schemas
 *
 * @see designs/html/mockup-pricing.html
 */

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Clock,
  Shield,
  ClipboardCheck,
  Activity,
  FileText,
  Smartphone,
  Scale,
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
  InternationalPricingCard,
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
    "SafeTrekr pricing starts at $450 per trip. Experienced analyst review, active intelligence monitoring, and complete documentation -- from $15 per participant. No annual contracts required.",
  path: "/pricing",
});

// ---------------------------------------------------------------------------
// Data constants
// ---------------------------------------------------------------------------

const DAY_TRIP_FEATURES = [
  "Experienced analyst review",
  "Comprehensive safety assessment",
  "Interactive digital safety binder",
  "Mobile field support access",
  "Delivery in as soon as 3 days",
  "Verified documentation",
  "PDF & print export",
  "30-day post-trip access",
] as const;

const EXTENDED_TRIP_FEATURES = [
  "Everything in Day Trip",
  "Multi-day trip support (up to 7 days)",
  "Active intelligence monitoring",
  "Sports and athletic travel coverage",
  "Multiple venue assessment",
  "Priority analyst assignment",
  "60-day post-trip access",
] as const;

const INTERNATIONAL_FEATURES = [
  "Everything in Extended Trip",
  "International intelligence coverage",
  "Embassy and consulate contacts",
  "Regional condition assessment",
  "Evacuation planning documentation",
  "Pre-departure briefing",
  "Extended monitoring (trip duration + 7 days)",
  "90-day post-trip access",
] as const;

const INCLUDED_FEATURES: Array<{
  icon: ReactNode;
  title: string;
  description: string;
  featured?: boolean;
}> = [
  {
    icon: <ClipboardCheck className="size-6" />,
    title: "Experienced Analyst Review",
    description:
      "Comprehensive evaluation by former Secret Service, Special Operations, and trained safety professionals.",
  },
  {
    icon: <Activity className="size-6" />,
    title: "Active Intelligence Monitoring",
    description:
      "Current information from multiple trusted sources including government, humanitarian, and regional data.",
  },
  {
    icon: <Scale className="size-6" />,
    title: "Comprehensive Assessment",
    description:
      "Every aspect of your trip evaluated -- venues, transportation, lodging, activities, and emergency planning.",
  },
  {
    icon: <FileText className="size-6" />,
    title: "Interactive Digital Safety Binder",
    description:
      "All findings, recommendations, and contacts in one place. Works on any device.",
  },
  {
    icon: <Shield className="size-6" />,
    title: "Verified Documentation",
    description:
      "Professional records you can share with leadership, parents, and stakeholders.",
  },
  {
    icon: <Smartphone className="size-6" />,
    title: "Mobile Field Support",
    description:
      "Emergency contacts, rally points, and check-in tools accessible in the field.",
  },
  {
    icon: <FileText className="size-6" />,
    title: "PDF & Print Export",
    description:
      "Download, print, and share with anyone who needs it.",
  },
  {
    icon: <Clock className="size-6" />,
    title: "Delivery in as Soon as 3 Days",
    description:
      "Fast turnaround so you can focus on the experience, not the paperwork.",
  },
];

const PRICING_FAQS: FAQItem[] = [
  {
    question: "Is there a minimum commitment or annual contract?",
    answer:
      "No. You can submit a single trip with no ongoing commitment or annual contract required.",
  },
  {
    question: "How do you calculate per-participant cost?",
    answer:
      "Per-participant cost depends on group size. A $450 Day Trip for 30 participants is $15/person. The same trip for 15 participants is $30/person. Pricing is per trip, not per participant.",
  },
  {
    question: "Can we see SafeTrekr before submitting a trip?",
    answer:
      "Yes. Schedule a walkthrough to see a complete safety binder for your organization type. We'll show you exactly what you receive before you submit your first trip.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept credit cards for individual trips. Organizations can also pay by invoice upon request.",
  },
  {
    question: "Do you offer nonprofit or educational pricing?",
    answer:
      "Contact us to discuss pricing for nonprofit organizations and educational institutions. We work with organizations of all sizes to find arrangements that work.",
  },
  {
    question: "What happens if we need to cancel a trip after submitting?",
    answer:
      "If you cancel before the analyst review begins, you receive a full refund. If the review has started, we'll provide a credit for a future trip.",
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
      "Professional safety analyst review, government data sources, and complete documentation for every trip.",
    brand: { "@type": "Brand", name: "SafeTrekr" },
    offers: [
      {
        "@type": "Offer",
        name: "Day Trip",
        price: "450",
        priceCurrency: "USD",
        description:
          "Day trips, local field trips, single-venue events. ~$15 per person for a 30-person group.",
        url: "https://www.safetrekr.com/pricing#day-trip",
      },
      {
        "@type": "Offer",
        name: "Extended Trip",
        price: "750",
        priceCurrency: "USD",
        description:
          "Multi-day trips, overnight travel, tournaments. ~$19 per participant for a 40-person group.",
        url: "https://www.safetrekr.com/pricing#extended-trip",
      },
      {
        "@type": "Offer",
        name: "International",
        price: "1250",
        priceCurrency: "USD",
        description:
          "International travel, study abroad, mission trips. ~$42 per participant for a 30-person group.",
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
              <Eyebrow className="mb-4">PRICING</Eyebrow>
            </ScrollReveal>

            <ScrollReveal>
              <h1 className="mx-auto max-w-4xl text-display-lg text-foreground">
                Professional trip Safety Planning.{" "}
                <span className="text-primary-700">Straightforward pricing.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal>
              <p className="mx-auto mt-6 max-w-prose text-body-lg text-muted-foreground">
                Every trip receives a full analyst review with access to complete documentation through an interactive digital safety binder. Most organizations find that structured trip planning saves time, reduces coordination burden, and creates valuable records.
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/demo">Schedule a Walkthrough</Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/resources/sample-binder">View Sample Binder</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 2: PRICING TIER CARDS
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
              id="day-trip"
              tierName="Day Trip"
              price="$450"
              perParticipant="~$15/person for a 30-person group"
              features={[...DAY_TRIP_FEATURES]}
              ctaText="Schedule a Walkthrough"
              ctaHref="/demo"
            />

            <PricingTierCard
              id="extended-trip"
              tierName="Extended Trip"
              price="$750"
              perParticipant="~$19/person for a 40-person group"
              features={[...EXTENDED_TRIP_FEATURES]}
              ctaText="Schedule a Walkthrough"
              ctaHref="/demo"
              featured
              badge="Most Popular"
            />

            <InternationalPricingCard
              id="international"
              features={[...INTERNATIONAL_FEATURES]}
              ctaText="Schedule a Walkthrough"
              ctaHref="/demo"
            />
          </StaggerChildren>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 3: WHAT'S INCLUDED IN EVERY TRIP
          ================================================================ */}
      <SectionContainer variant="brand" aria-labelledby="included-heading">
        <Container>
          <div className="text-center">
            <ScrollReveal>
              <h2 id="included-heading" className="text-display-md text-foreground">
                Every trip includes:
              </h2>
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
          SECTION 4: ADD-ONS (Optional - kept from original)
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
          SECTION 4a: SEGMENT-SPECIFIC PRICING SCENARIOS
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
          SECTION 4b: PROCUREMENT PATH (Dark Section)
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
          SECTION 5: FAQ
          ================================================================ */}
      <SectionContainer aria-label="Frequently asked questions">
        <Container size="md">
          <div className="text-center">
            <ScrollReveal>
              <h2 className="text-display-md text-foreground">
                Frequently Asked Questions
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
          SECTION 6: CONVERSION CTA BAND
          ================================================================ */}
      <CTABand
        variant="dark"
        headline="Ready to go with a plan?"
        body="Schedule a walkthrough to see how SafeTrekr works for your organization type."
        primaryCta={{ text: "Schedule a Walkthrough", href: "/demo" }}
        secondaryCta={{ text: "Discuss Your Needs", href: "/contact" }}
      />

      {/* ================================================================
          JSON-LD STRUCTURED DATA
          ================================================================ */}
      <PricingJsonLd />
    </>
  );
}
