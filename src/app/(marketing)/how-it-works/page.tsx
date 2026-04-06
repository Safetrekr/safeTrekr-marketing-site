/**
 * ST-882: REQ-082 -- How It Works Page (/how-it-works)
 *
 * Educational page walking prospects through the SafeTrekr process from trip
 * submission to safety binder delivery. Establishes credibility through the
 * 3-act process, intelligence sources, 17-section review grid, binder
 * deliverable, mobile field ops, and post-trip documentation proof.
 *
 * Server Component at the page level. Client components (Accordion,
 * ScrollReveal, StaggerChildren) are rendered as children within this tree.
 *
 * Section order:
 *   1. Hero              -- Centered with dual CTAs
 *   2. Process Timeline  -- 3-act (Submit, Review, Binder) with details
 *   3. Intelligence      -- Dark: 5 agency cards + professional analysis
 *   4. 17-Section Review -- All 17 sections in 5 categories with accordion
 *   5. Safety Binder     -- FeatureShowcase with DocumentPreview
 *   6. During Trip       -- Mobile app features with phone mockup placeholder
 *   7. After Trip        -- 3 proof cards
 *   8. Segment Routing   -- 4 SegmentCards
 *   9. CTA Band          -- Dark conversion band
 *  10. JSON-LD           -- HowTo schema
 *
 * @see designs/html/mockup-how-it-works.html
 */

import Link from "next/link";
import {
  Check,
  Shield,
  ShieldCheck,
  FileText,
  ClipboardCheck,
  Activity,
  Calendar,
  Building2,
  MapPin,
  AlertTriangle,
  Lock,
  ArrowRight,
  Download,
  GraduationCap,
  Heart,
  BarChart3,
} from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import {
  JsonLd,
  generateHowToSchema,
  type HowToStep,
} from "@/lib/structured-data";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { SectionContainer } from "@/components/layout/section-container";
import { Container } from "@/components/layout/container";
import {
  Eyebrow,
  SegmentCard,
  CTABand,
  FeatureShowcase,
} from "@/components/marketing";
import { DocumentPreview } from "@/components/marketing/document-preview";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { StaggerChildren } from "@/components/motion/stagger-children";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "How SafeTrekr Works",
  description:
    "From trip submission to complete documentation in 3-5 days. Learn how SafeTrekr's professional process combines current information, analyst evaluation, and complete documentation.",
  path: "/how-it-works",
});

// ---------------------------------------------------------------------------
// Data constants
// ---------------------------------------------------------------------------

const PROCESS_STEPS = [
  {
    number: 1,
    act: "STEP 1: SUBMIT",
    title: "Share Your Trip Details",
    description:
      "Enter your destination, dates, participants, activities, and logistics through a guided submission form.",
    details: [
      "Destination and travel dates",
      "Number and composition of travelers",
      "Planned activities and venues",
      "Transportation arrangements",
      "Lodging details",
      "Any known concerns or special requirements",
    ],
    badge: "Day 1 (15 minutes)",
  },
  {
    number: 2,
    act: "STEP 2: REVIEW",
    title: "Analyst Reviews Everything",
    description:
      "Highly trained and experienced safety analyst conducts a comprehensive safety review of your trip. Every venue, transportation leg, and activity is evaluated and planned.",
    details: [
      "Full professional safety review",
      "Multi-private and government sourced intelligence",
      "Every venue, route, and provider evaluated",
      "Professional judgment applied to your trip",
      "Recommendations written for each finding",
    ],
    badge: "Days 2-4",
  },
  {
    number: 3,
    act: "STEP 3: DELIVER",
    title: "Digital Safety Binder",
    description:
      "Full assessment is compiled into your interactive and customized safety binder. Structured for all stakeholders and actively monitored to provide up to date information.",
    details: [
      "Executive summary",
      "Emergency planning and contacts",
      "Maps and evacuation routes",
      "Safety and Medical Recommendations",
      "Full Trip Review before departure",
      "Active Intelligence Monitoring so you don't have to",
    ],
    badge: "Days 4-5",
  },
] as const;

const INTELLIGENCE_CATEGORIES = [
  {
    title: "Weather & Environmental",
    description:
      "Current and forecasted conditions for your travel dates and destination",
  },
  {
    title: "Health & Medical",
    description:
      "Health advisories, medical considerations, and healthcare access",
  },
  {
    title: "Regional Security",
    description:
      "Safety conditions, travel advisories, and situational awareness",
  },
  {
    title: "Natural Hazards",
    description:
      "Geological, seismic, and environmental risk factors",
  },
  {
    title: "Local Conditions",
    description:
      "On-the-ground intelligence and regional situation reports",
  },
] as const;

const REVIEW_CATEGORIES = [
  {
    category: "Trip Planning & Logistics",
    icon: <Calendar className="size-6 text-primary-600" />,
    description: "Complete evaluation of your trip structure, participant needs, scheduling, and all transportation arrangements.",
  },
  {
    category: "Destinations & Venues",
    icon: <MapPin className="size-6 text-primary-600" />,
    description: "Thorough assessment of every location on your itinerary including lodging, activity sites, and transit points.",
  },
  {
    category: "Safety & Intelligence",
    icon: <Shield className="size-6 text-primary-600" />,
    description: "Multi-source intelligence analysis covering security conditions, health considerations, and environmental factors.",
  },
  {
    category: "Emergency Preparedness",
    icon: <AlertTriangle className="size-6 text-primary-600" />,
    description: "Comprehensive emergency planning including response protocols, evacuation procedures, and communication plans.",
  },
  {
    category: "Documentation & Compliance",
    icon: <FileText className="size-6 text-primary-600" />,
    description: "Complete documentation package with verification, audit trails, and organizational approval workflows.",
  },
] as const;

const HOWTO_STEPS: HowToStep[] = [
  {
    name: "Share Your Trip Details",
    text: "Enter your destination, dates, participants, activities, and logistics through a guided submission form. Takes approximately 15 minutes.",
  },
  {
    name: "Analyst Reviews Everything",
    text: "A trained safety analyst conducts a comprehensive 17-section review using current information from 5 government data sources.",
  },
  {
    name: "Receive Your Safety Binder",
    text: "Receive your complete safety binder with verified documentation within 3-5 business days.",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HowItWorksPage() {
  return (
    <>
      {/* ST-904/ST-905: BreadcrumbList JSON-LD for how-it-works page */}
      <BreadcrumbJsonLd path="/how-it-works" currentPageTitle="How It Works" />

      {/* ================================================================
          SECTION 1: HERO
          ================================================================ */}
      <SectionContainer className="bg-muted" aria-labelledby="hero-heading">
        <Container>
          <div className="mx-auto max-w-3xl pt-4 text-center sm:pt-8 lg:pt-12">
            <ScrollReveal>
              <Eyebrow
                className="mb-4"
                icon={
                  <ShieldCheck className="size-3.5 text-primary-600" aria-hidden="true" />
                }
              >
                How It Works
              </Eyebrow>
            </ScrollReveal>

            <ScrollReveal>
              <h1
                id="hero-heading"
                className="mx-auto max-w-[20ch] text-display-lg text-foreground"
              >
                From trip details to complete documentation in 3&#8209;5&nbsp;days.
              </h1>
            </ScrollReveal>

            <ScrollReveal>
              <p className="mx-auto mt-6 max-w-[65ch] text-body-lg text-muted-foreground">
                Every trip follows the same structured process: you share trip details,
                a trained safety analyst reviews using all current information from
                private and government sources, and you receive complete emergency
                planning documentation. Professional preparation without complexity.
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/demo">Schedule a Walkthrough</Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/resources/sample-binders" className="inline-flex items-center gap-2">
                    <Download className="size-4" aria-hidden="true" />
                    View Sample Binder
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 2: PROCESS TIMELINE (Three-Act Structure)
          ================================================================ */}
      <SectionContainer id="process" className="bg-muted" aria-labelledby="process-heading">
        <Container>
          <div className="mb-16 text-center lg:mb-20">
            <ScrollReveal>
              <Eyebrow className="mb-4">The Process</Eyebrow>
            </ScrollReveal>
            <ScrollReveal>
              <h2
                id="process-heading"
                className="mx-auto max-w-[28ch] text-display-md text-foreground"
              >
                Three Steps. One Standard.
              </h2>
            </ScrollReveal>
          </div>

          {/* Desktop Timeline (lg+) */}
          <div className="hidden lg:block" role="list">
            <div className="relative grid grid-cols-3 gap-8">
              {/* Connecting lines (decorative) - lines connect between the circles */}
              <svg
                className="pointer-events-none absolute top-0 left-0 z-0 h-12 w-full"
                aria-hidden="true"
              >
                <line x1="4.5%" y1="24" x2="34.3%" y2="24" stroke="var(--color-primary-200)" strokeWidth="2" />
                <line x1="38.7%" y1="24" x2="68.6%" y2="24" stroke="var(--color-primary-200)" strokeWidth="2" />
              </svg>

              {PROCESS_STEPS.map((step) => (
                <article key={step.number} className="relative z-10" role="listitem">
                  <ScrollReveal>
                    {/* Step circle */}
                    <div className="mb-6 flex size-12 items-center justify-center rounded-full border-2 border-primary-300 bg-primary-50">
                      <span className="text-heading-sm font-bold text-primary-700">{step.number}</span>
                    </div>

                    {/* Act badge */}
                    <span className="mb-3 inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                      {step.act}
                    </span>

                    <h3 className="mb-3 text-heading-md font-semibold text-foreground">{step.title}</h3>
                    <p className="mb-6 max-w-[45ch] text-body-md text-muted-foreground">{step.description}</p>

                    <ul className="mb-6 space-y-2">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2">
                          <Check className="mt-0.5 size-4 shrink-0 text-primary-600" aria-hidden="true" />
                          <span className="text-body-sm text-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>

                    <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                      {step.badge}
                    </span>
                  </ScrollReveal>
                </article>
              ))}
            </div>
          </div>

          {/* Mobile Timeline (<lg) */}
          <div className="lg:hidden">
            <div className="relative">
              {PROCESS_STEPS.map((step, index) => (
                <div key={step.number} className={`flex gap-6 ${index < PROCESS_STEPS.length - 1 ? "pb-12" : ""}`}>
                  <div className="flex flex-col items-center">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-primary-300 bg-primary-50">
                      <span className="text-sm font-bold text-primary-700">{step.number}</span>
                    </div>
                    {index < PROCESS_STEPS.length - 1 && (
                      <div className="mt-3 flex-1 border-l-2 border-dashed border-primary-200" aria-hidden="true" />
                    )}
                  </div>
                  <div className="pb-2">
                    <span className="mb-3 inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                      {step.act}
                    </span>
                    <h3 className="mb-2 text-heading-md font-semibold text-foreground">{step.title}</h3>
                    <p className="mb-4 text-body-md text-muted-foreground">{step.description}</p>
                    <ul className="mb-4 space-y-2">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2">
                          <Check className="mt-0.5 size-4 shrink-0 text-primary-600" aria-hidden="true" />
                          <span className="text-body-sm text-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                    <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                      {step.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 3: INTELLIGENCE SOURCES (DARK)
          ================================================================ */}
      <SectionContainer
        id="intelligence"
        variant="dark"
        aria-labelledby="intelligence-heading"
      >
        <Container>
          {/* Section Header */}
          <div className="mb-16 text-center">
            <ScrollReveal>
              <Eyebrow color="dark" className="mb-4">Intelligence Network</Eyebrow>
            </ScrollReveal>
            <ScrollReveal>
              <h2
                id="intelligence-heading"
                className="mx-auto max-w-[28ch] text-display-md text-white"
              >
                Comprehensive Multi-Source Intelligence.
              </h2>
            </ScrollReveal>
            <ScrollReveal>
              <p className="mx-auto mt-6 max-w-[65ch] text-body-lg text-[#b8c3c7]">
                SafeTrekr aggregates current safety information from an extensive network
                of private and government sources for your specific destination and travel dates.
              </p>
            </ScrollReveal>
          </div>

          {/* Intelligence Category Cards */}
          <StaggerChildren className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {INTELLIGENCE_CATEGORIES.map((category) => (
              <article
                key={category.title}
                className="rounded-xl border border-white/10 bg-white/[0.06] p-6 text-center lg:text-left"
              >
                <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-lg bg-white/[0.08] lg:mx-0">
                  <Activity className="size-6 text-[#6cbc8b] opacity-80" aria-hidden="true" />
                </div>
                <h3 className="text-heading-sm font-semibold text-white">{category.title}</h3>
                <p className="mt-2 text-body-sm text-[#b8c3c7]">{category.description}</p>
              </article>
            ))}
          </StaggerChildren>

          {/* Professional Analysis Card */}
          <ScrollReveal>
            <div className="grid items-center gap-8 rounded-xl border border-white/10 bg-white/[0.06] p-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12 lg:p-12">
              {/* Left: Text */}
              <div>
                <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#6cbc8b]/15 px-2.5 py-0.5 text-xs font-semibold text-[#6cbc8b]">
                  <BarChart3 className="size-3.5" aria-hidden="true" />
                  STRUCTURED METHODOLOGY
                </span>
                <h3 className="mb-4 text-heading-lg text-white">
                  Professional Analyst Review
                </h3>
                <p className="mb-6 max-w-[65ch] text-body-md text-[#b8c3c7]">
                  Every trip is reviewed by a trained safety analyst -- not processed
                  by an algorithm. Professional judgment applied to your specific trip,
                  with accountability for every finding.
                </p>
                <ul className="space-y-3">
                  {[
                    "Extensive private and government sources aggregated",
                    "Current information specific to your travel dates",
                    "Structured assessment methodology",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check className="mt-0.5 size-4 shrink-0 text-[#6cbc8b]" aria-hidden="true" />
                      <span className="text-body-sm text-[#b8c3c7]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Simple Assessment Visualization (decorative) */}
              <div className="mx-auto w-full max-w-[400px]" aria-hidden="true">
                <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                  {/* Simple grid lines */}
                  <line x1="40" y1="200" x2="380" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="40" y1="200" x2="40" y2="20" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  {/* Assessment bars */}
                  <rect x="70" y="60" width="50" height="140" rx="4" fill="#6cbc8b" fillOpacity="0.3" />
                  <rect x="140" y="90" width="50" height="110" rx="4" fill="#6cbc8b" fillOpacity="0.5" />
                  <rect x="210" y="120" width="50" height="80" rx="4" fill="#6cbc8b" fillOpacity="0.7" />
                  <rect x="280" y="150" width="50" height="50" rx="4" fill="#6cbc8b" fillOpacity="0.9" />
                  {/* Labels */}
                  <text x="95" y="225" fill="#b8c3c7" fontFamily="system-ui" fontSize="10" textAnchor="middle">Weather</text>
                  <text x="165" y="225" fill="#b8c3c7" fontFamily="system-ui" fontSize="10" textAnchor="middle">Health</text>
                  <text x="235" y="225" fill="#b8c3c7" fontFamily="system-ui" fontSize="10" textAnchor="middle">Regional</text>
                  <text x="305" y="225" fill="#b8c3c7" fontFamily="system-ui" fontSize="10" textAnchor="middle">Venue</text>
                </svg>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 4: COMPREHENSIVE REVIEW
          ================================================================ */}
      <SectionContainer id="review" className="bg-muted" aria-labelledby="review-heading">
        <Container>
          <div className="mb-16 text-center">
            <ScrollReveal>
              <Eyebrow
                className="mb-4"
                icon={<ClipboardCheck className="size-3.5" aria-hidden="true" />}
              >
                The Review
              </Eyebrow>
            </ScrollReveal>
            <ScrollReveal>
              <h2
                id="review-heading"
                className="mx-auto max-w-[28ch] text-display-md text-foreground"
              >
                Comprehensive. Structured. Complete.
              </h2>
            </ScrollReveal>
            <ScrollReveal>
              <p className="mx-auto mt-4 max-w-[65ch] text-body-lg text-muted-foreground">
                Every trip receives the same thorough analyst review across all critical areas.
              </p>
            </ScrollReveal>
          </div>

          {/* Review Category Cards */}
          <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {REVIEW_CATEGORIES.map((cat) => (
              <article
                key={cat.category}
                className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary-50">
                  {cat.icon}
                </div>
                <h3 className="mb-2 text-heading-sm font-semibold text-foreground">
                  {cat.category}
                </h3>
                <p className="text-body-sm text-muted-foreground">
                  {cat.description}
                </p>
              </article>
            ))}
          </StaggerChildren>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 5: THE SAFETY BINDER
          ================================================================ */}
      <div id="binder">
        <FeatureShowcase
          eyebrow="The Deliverable"
          title="The SafeTrekr Traveler App."
          description="Your complete safety package delivered through our powerful Traveler app. Interactive maps, emergency contacts, real-time alerts, and your full safety assessment—all in your pocket. Works offline when you need it most."
          visual={<DocumentPreview variant="full" showHash />}
          ctaText="See the App in Action"
          ctaHref="/demo"
          className="border-y border-border bg-card"
        />
      </div>

      {/* Printable Option Strip */}
      <SectionContainer className="bg-card" as="div">
        <Container>
          <ScrollReveal>
            <div className="flex flex-col items-start gap-6 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] lg:flex-row lg:p-8">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                <FileText className="size-5 text-primary-700" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-heading-sm font-semibold text-foreground">
                  Printable for Offline Use
                </h3>
                <p className="mt-2 max-w-[65ch] text-body-md text-muted-foreground">
                  Prefer paper? Your complete safety documentation is also available as a
                  professionally formatted printable package. Perfect for chaperone binders,
                  administrative records, or anywhere you need reliable offline access.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 6: DURING THE TRIP
          ================================================================ */}
      <SectionContainer id="field-ops" className="bg-muted" aria-labelledby="during-trip-heading">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Text Column */}
            <div className="order-2 lg:order-1">
              <ScrollReveal>
                <Eyebrow
                  className="mb-4"
                  icon={<Activity className="size-3.5" aria-hidden="true" />}
                >
                  Field Operations
                </Eyebrow>
              </ScrollReveal>

              <ScrollReveal>
                <h2
                  id="during-trip-heading"
                  className="mb-6 text-display-md text-foreground"
                >
                  Everything Your Chaperones Need in Their Pocket.
                </h2>
              </ScrollReveal>

              <ScrollReveal>
                <p className="mb-8 max-w-[65ch] text-body-lg text-muted-foreground">
                  During the trip, SafeTrekr&apos;s mobile app gives chaperones
                  current tools for participant safety and communication.
                </p>
              </ScrollReveal>

              <ul className="mb-8 space-y-3">
                {[
                  "Active map with participant locations",
                  "Boundary alerts when participants leave designated areas",
                  "Rally point check-ins",
                  "SMS broadcast to all participants",
                  "Emergency contacts one tap away",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="mt-1 size-4 shrink-0 text-primary-600" aria-hidden="true" />
                    <span className="text-body-md text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <ScrollReveal>
                <Button variant="secondary" size="md" asChild>
                  <Link href="/platform/mobile-app" className="inline-flex items-center gap-2">
                    Explore Mobile App
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </ScrollReveal>
            </div>

            {/* Visual Column: Phone Mockup */}
            <div className="order-1 flex justify-center lg:order-2" aria-hidden="true">
              <ScrollReveal>
                <div className="w-[240px] overflow-hidden rounded-[2rem] border-[6px] border-foreground/20 bg-card shadow-xl lg:w-[280px]">
                  {/* Status bar */}
                  <div className="flex h-8 items-center justify-between bg-white px-5">
                    <span className="text-[10px] font-semibold text-foreground">9:41</span>
                    <div className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-foreground"><rect x="1" y="14" width="4" height="8" rx="1" /><rect x="7" y="10" width="4" height="12" rx="1" /><rect x="13" y="6" width="4" height="16" rx="1" /><rect x="19" y="2" width="4" height="20" rx="1" /></svg>
                    </div>
                  </div>

                  {/* Map area */}
                  <div className="relative h-40 overflow-hidden bg-primary-50">
                    <svg className="absolute inset-0 size-full" viewBox="0 0 280 160" fill="none">
                      <line x1="20" y1="80" x2="260" y2="80" stroke="var(--color-primary-200)" strokeWidth="3" />
                      <line x1="140" y1="10" x2="140" y2="150" stroke="var(--color-primary-200)" strokeWidth="3" />
                      <line x1="60" y1="30" x2="220" y2="130" stroke="var(--color-primary-200)" strokeWidth="2" />
                      <path d="M40 120 Q100 60 140 80 Q180 100 230 50" stroke="var(--color-primary-700)" strokeWidth="3" strokeDasharray="8 4" fill="none" />
                      <circle cx="140" cy="80" r="6" fill="var(--color-primary-700)" stroke="white" strokeWidth="2" />
                      <circle cx="100" cy="65" r="4" fill="var(--color-primary-600)" stroke="white" strokeWidth="1.5" />
                      <circle cx="180" cy="90" r="4" fill="var(--color-primary-600)" stroke="white" strokeWidth="1.5" />
                      <circle cx="160" cy="60" r="4" fill="var(--color-primary-600)" stroke="white" strokeWidth="1.5" />
                    </svg>
                  </div>

                  {/* Bottom sheet */}
                  <div className="border-t border-border bg-white p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">Rally Point A</p>
                      <span className="size-2 rounded-full bg-[#22c55e]" />
                    </div>
                    <p className="mb-1 text-xs text-muted-foreground">12 of 15 checked in</p>
                    <div className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-[#22c55e]" />
                      <span className="text-xs font-medium text-[#16a34a]">All participants safe</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 7: SEGMENT EXAMPLES
          ================================================================ */}
      <SectionContainer id="segments" className="bg-white" aria-labelledby="segments-heading">
        <Container>
          <div className="mb-16 text-center">
            <ScrollReveal>
              <Eyebrow className="mb-4">Your Organization</Eyebrow>
            </ScrollReveal>
            <ScrollReveal>
              <h2
                id="segments-heading"
                className="mx-auto max-w-[28ch] text-display-md text-foreground"
              >
                See How It Works for Your Organization.
              </h2>
            </ScrollReveal>
          </div>

          <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <SegmentCard
              icon={<GraduationCap />}
              title="K-12 Schools & Districts"
              description="Field trips, athletic travel, band competitions"
              regulatoryHook="Built for educators"
              href="/solutions/k12"
            />
            <SegmentCard
              icon={<GraduationCap />}
              title="Higher Education"
              description="Study abroad, research travel, athletic programs"
              regulatoryHook="Global coverage"
              href="/solutions/higher-education"
            />
            <SegmentCard
              icon={<Heart />}
              title="Churches & Mission Orgs"
              description="Mission trips, youth retreats, volunteer travel"
              regulatoryHook="Nonprofit-friendly"
              href="/solutions/churches"
            />
            <SegmentCard
              icon={<Building2 />}
              title="Corporate & Sports Teams"
              description="Team retreats, conferences, league travel"
              regulatoryHook="Scales with you"
              href="/solutions/corporate"
            />
          </StaggerChildren>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 9: CONVERSION CTA BAND (DARK)
          ================================================================ */}
      <CTABand
        variant="dark"
        headline="Ready to see the process in action?"
        body="Schedule a walkthrough to see a complete safety binder and understand exactly what your organization receives."
        primaryCta={{ text: "Schedule a Walkthrough", href: "/demo" }}
        secondaryCta={{ text: "View Pricing", href: "/pricing" }}
      />

      {/* ================================================================
          JSON-LD STRUCTURED DATA
          ================================================================ */}
      <JsonLd data={generateHowToSchema(HOWTO_STEPS)} />
    </>
  );
}
