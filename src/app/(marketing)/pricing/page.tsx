/**
 * ST-880: REQ-080, Pricing Page (/pricing)
 *
 * Straightforward pricing page for SafeTrekr. Presents three trip tiers
 * (Day Trip, Multi-Day Trip, International), included features, optional add-ons,
 * procurement resources, and FAQ.
 *
 * Server Component at the page level. Client components (Accordion via FAQSection,
 * ScrollReveal, StaggerChildren) are rendered as children within this tree.
 *
 * Section order:
 *   1. Hero             , "Professional trip assessment. Straightforward pricing."
 *   2. Pricing Tiers    , 3 PricingTierCards (Day Trip, Multi-Day, International)
 *   3. What's Included  , 8 FeatureCards on primary-50 wash
 *   4. Add-ons          , ROI Calculator link
 *   4b. Procurement     , Dark section with checklist + /procurement link
 *   5. FAQ              , 7 pricing questions with FAQPage JSON-LD
 *   6. CTA Band         , Conversion band
 *   7. JSON-LD          , Product + Offer schemas
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
} from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import {
  ADDITIONAL_TRAVELER_PRICE,
  DAY_TRIP,
  INTERNATIONAL_TRIP,
  MULTI_DAY_TRIP,
  TRIP_TIERS,
  calculateTripPrice,
  formatPrice,
} from "@/content/pricing";
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
    "SafeTrekr pricing starts at $400 per trip for up to 10 travelers, plus $40 per additional traveler. Experienced analyst review, active intelligence monitoring, and complete documentation. No annual contracts required.",
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
  "Fast delivery turnaround",
  "Verified documentation",
  "PDF & print export",
  "30-day post-trip access",
] as const;

const MULTI_DAY_TRIP_FEATURES = [
  "Everything in Day Trip",
  "Multi-day trip support (up to 7 days)",
  "Active intelligence monitoring",
  "Sports and athletic travel coverage",
  "Multiple venue assessment",
  "Priority analyst assignment",
  "60-day post-trip access",
] as const;

const INTERNATIONAL_FEATURES = [
  "Everything in Multi-Day Trip",
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
      "Every aspect of your trip evaluated, venues, transportation, lodging, activities, and emergency planning.",
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
    title: "Fast Delivery Turnaround",
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
    question: "How is the price of a trip calculated?",
    answer: `Each trip type has a base price that covers a set number of travelers: Day Trip is ${formatPrice(DAY_TRIP.price)} for the first ${String(DAY_TRIP.includedTravelers)}, Multi-Day Trip is ${formatPrice(MULTI_DAY_TRIP.price)} for the first ${String(MULTI_DAY_TRIP.includedTravelers)}, and International is ${formatPrice(INTERNATIONAL_TRIP.price)} for the first ${String(INTERNATIONAL_TRIP.includedTravelers)}. Each additional traveler is ${formatPrice(ADDITIONAL_TRAVELER_PRICE)}. For example, a Day Trip with 30 travelers is ${formatPrice(calculateTripPrice(DAY_TRIP, 30))}.`,
  },
  {
    question: "Who counts as a traveler? Are parents and guardians free?",
    answer:
      "A traveler is anyone going on the trip, including students, teachers, chaperones, and staff. On every trip, one parent or guardian per traveler comes along free and does not count toward your traveler total.",
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
    offers: TRIP_TIERS.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      price: String(tier.price),
      priceCurrency: "USD",
      description: `Includes the first ${String(tier.includedTravelers)} travelers, plus ${formatPrice(ADDITIONAL_TRAVELER_PRICE)} per additional traveler. One parent/guardian per traveler free.`,
      url: `https://www.safetrekr.com/pricing#${tier.id}`,
    })),
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
                One base price per trip, {formatPrice(ADDITIONAL_TRAVELER_PRICE)} per
                additional traveler. Every feature included.
              </p>
            </ScrollReveal>
          </div>

          <StaggerChildren className="mt-12 grid grid-cols-1 items-start gap-6 md:grid-cols-3 lg:mt-16 lg:gap-8">
            <PricingTierCard
              id={DAY_TRIP.id}
              tier={DAY_TRIP}
              features={DAY_TRIP_FEATURES}
              ctaText="Schedule a Walkthrough"
              ctaHref="/demo"
            />

            <PricingTierCard
              id={MULTI_DAY_TRIP.id}
              tier={MULTI_DAY_TRIP}
              features={MULTI_DAY_TRIP_FEATURES}
              ctaText="Schedule a Walkthrough"
              ctaHref="/demo"
            />

            <PricingTierCard
              id={INTERNATIONAL_TRIP.id}
              tier={INTERNATIONAL_TRIP}
              features={INTERNATIONAL_FEATURES}
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
