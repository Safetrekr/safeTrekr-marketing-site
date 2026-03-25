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
 *   3. Intelligence      -- Dark: 5 agency cards + Monte Carlo explanation
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
  Users,
  Calendar,
  Truck,
  Plane,
  Building2,
  MapPin,
  AlertTriangle,
  UserCheck,
  Flag,
  AlarmClock,
  FolderOpen,
  Lock,
  CheckSquare,
  Package,
  CheckCircle2,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { StaggerChildren } from "@/components/motion/stagger-children";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "How It Works",
  description:
    "From trip submission to safety binder in 3-5 days. Every trip goes through the same rigorous 17-section analyst review with government intelligence scoring.",
  path: "/how-it-works",
});

// ---------------------------------------------------------------------------
// Data constants
// ---------------------------------------------------------------------------

const PROCESS_STEPS = [
  {
    number: 1,
    act: "ACT 1: INTELLIGENCE",
    title: "Submit Your Trip",
    description:
      "Your organization submits trip details through a guided form. Destination, dates, participants, activities, and logistics.",
    details: [
      "Destination and travel dates",
      "Participant count and demographics",
      "Planned activities and venues",
      "Transportation and lodging details",
      "Special requirements or concerns",
    ],
    badge: "Takes ~15 minutes",
  },
  {
    number: 2,
    act: "ACT 2: REVIEW",
    title: "Analyst Reviews Everything",
    description:
      "A trained safety analyst conducts a comprehensive 17-section review. The Risk Intelligence Engine scores every destination using 5 government data sources.",
    details: [
      "17-section professional safety review",
      "Monte Carlo risk scoring simulation",
      "5 government intelligence sources analyzed",
      "Every venue, route, and provider evaluated",
      "Recommendations written for each finding",
    ],
    badge: "3-5 business days",
  },
  {
    number: 3,
    act: "ACT 3: DOCUMENTATION",
    title: "Receive Your Safety Binder",
    description:
      "Audit-ready documentation delivered with SHA-256 hash-chain integrity. Every finding, every recommendation, every emergency contact, every risk score.",
    details: [
      "Complete findings and recommendations",
      "Emergency contacts and procedures",
      "Risk scores with probability analysis",
      "Maps, routes, and venue details",
      "Tamper-evident cryptographic verification",
    ],
    badge: "Delivered digitally",
  },
] as const;

const INTELLIGENCE_SOURCES = [
  {
    abbr: "NOAA",
    name: "National Oceanic and Atmospheric Administration",
    description:
      "Weather forecasts, severe storm alerts, historical climate patterns for travel dates and destination",
  },
  {
    abbr: "USGS",
    name: "United States Geological Survey",
    description:
      "Seismic activity, earthquake risk, volcanic alerts, geological hazards for destination region",
  },
  {
    abbr: "CDC",
    name: "Centers for Disease Control and Prevention",
    description:
      "Health advisories, disease outbreaks, vaccination requirements, travel health notices",
  },
  {
    abbr: "GDACS",
    name: "Global Disaster Alerting Coordination System",
    description:
      "Real-time disaster alerts, earthquake/flood/cyclone monitoring, humanitarian impact assessments",
  },
  {
    abbr: "ReliefWeb",
    name: "UN Office for Coordination of Humanitarian Affairs",
    description:
      "Humanitarian situation reports, conflict updates, country-level safety assessments",
  },
] as const;

const REVIEW_CATEGORIES = [
  {
    category: "Trip Planning",
    sections: [
      {
        num: 1,
        title: "Overview",
        icon: <FileText className="size-5 text-primary-600" />,
        description: "Trip purpose, objectives, organizational context, and overall scope of the travel plan",
      },
      {
        num: 2,
        title: "Participants",
        icon: <Users className="size-5 text-primary-600" />,
        description: "Participant count, demographics, age ranges, special needs, medical considerations, and chaperone-to-participant ratios",
      },
      {
        num: 3,
        title: "Itinerary",
        icon: <Calendar className="size-5 text-primary-600" />,
        description: "Day-by-day schedule, activity timing, transit windows, rest periods, and contingency buffers",
      },
      {
        num: 4,
        title: "Transportation",
        icon: <Truck className="size-5 text-primary-600" />,
        description: "Ground transportation providers, vehicle safety records, driver credentials, and route risk assessment",
      },
    ],
  },
  {
    category: "Destinations & Venues",
    sections: [
      {
        num: 5,
        title: "Air Travel",
        icon: <Plane className="size-5 text-primary-600" />,
        description: "Airlines, airports, layover risks, baggage policies, and flight timing relative to destination conditions",
      },
      {
        num: 6,
        title: "Lodging",
        icon: <Building2 className="size-5 text-primary-600" />,
        description: "Accommodation safety ratings, fire egress, proximity to medical facilities, neighborhood risk profile",
      },
      {
        num: 7,
        title: "Venues",
        icon: <MapPin className="size-5 text-primary-600" />,
        description: "Activity venues, crowd capacity, structural safety, historical incident records, and accessibility",
      },
    ],
  },
  {
    category: "Safety & Intelligence",
    sections: [
      {
        num: 8,
        title: "Safety",
        icon: <Shield className="size-5 text-primary-600" />,
        description: "Destination-level safety assessment: crime rates, political stability, natural hazard exposure, health risks",
      },
      {
        num: 9,
        title: "Background Checks",
        icon: <UserCheck className="size-5 text-primary-600" />,
        description: "Verification requirements for chaperones, volunteers, and third-party providers in contact with participants",
      },
      {
        num: 10,
        title: "Intel Alerts",
        icon: <AlertTriangle className="size-5 text-primary-600" />,
        description: "Active intelligence alerts from government sources: weather, seismic, health, conflict, and humanitarian data",
      },
    ],
  },
  {
    category: "Emergency Preparedness",
    sections: [
      {
        num: 11,
        title: "Emergency Prep",
        icon: <AlarmClock className="size-5 text-primary-600" />,
        description: "Emergency action plans, evacuation routes, rally points, communication chains, and nearest medical facilities",
      },
      {
        num: 12,
        title: "Issues",
        icon: <Flag className="size-5 text-primary-600" />,
        description: "Known risks, flagged concerns, unresolved issues, and analyst-recommended mitigations requiring action",
      },
    ],
  },
  {
    category: "Documentation & Compliance",
    sections: [
      {
        num: 13,
        title: "Documents",
        icon: <FolderOpen className="size-5 text-primary-600" />,
        description: "Required forms, waivers, permissions, insurance certificates, and regulatory compliance documentation",
      },
      {
        num: 14,
        title: "Evidence",
        icon: <Lock className="size-5 text-primary-600" />,
        description: "Tamper-evident evidence chain, SHA-256 hash verification, audit trail integrity, and record preservation",
      },
      {
        num: 15,
        title: "Checklists",
        icon: <CheckSquare className="size-5 text-primary-600" />,
        description: "Pre-departure checklists, day-of checklists, post-trip checklists, and completion verification",
      },
      {
        num: 16,
        title: "Packet Builder",
        icon: <Package className="size-5 text-primary-600" />,
        description: "Assembled trip packet: printed materials, digital distribution, chaperone copies, and administrative copies",
      },
      {
        num: 17,
        title: "Approval",
        icon: <CheckCircle2 className="size-5 text-primary-600" />,
        description: "Final review sign-off, organizational approval workflow, stakeholder acknowledgment, and release authorization",
      },
    ],
  },
] as const;

const HOWTO_STEPS: HowToStep[] = [
  {
    name: "Submit Your Trip",
    text: "Submit trip details through the SafeTrekr platform including destination, dates, participants, activities, and logistics. Takes approximately 15 minutes.",
  },
  {
    name: "Analyst Reviews Everything",
    text: "A trained safety analyst conducts a comprehensive 17-section review using 5 government intelligence sources and Monte Carlo risk scoring.",
  },
  {
    name: "Receive Your Safety Binder",
    text: "Receive your complete, audit-ready safety binder with SHA-256 hash-chain integrity within 3-5 business days.",
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
                From Trip Submission to Safety Binder in 3&#8209;5&nbsp;Days.
              </h1>
            </ScrollReveal>

            <ScrollReveal>
              <p className="mx-auto mt-6 max-w-[65ch] text-body-lg text-muted-foreground">
                SafeTrekr&apos;s three-step process starts when your organization
                submits trip details, continues with a 17-section professional
                safety analyst review powered by five government intelligence
                sources and Monte Carlo risk scoring, and concludes with
                delivery of a tamper-evident safety binder with SHA-256
                hash-chain integrity -- all within 3-5 business days.
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/demo">Get a Demo</Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/resources/sample-binders" className="inline-flex items-center gap-2">
                    <Download className="size-4" aria-hidden="true" />
                    Download a Sample Binder
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
              {/* Connecting lines (decorative) */}
              <svg
                className="pointer-events-none absolute top-6 left-0 z-0 h-12 w-full"
                aria-hidden="true"
              >
                <line x1="18.5%" y1="24" x2="48.5%" y2="24" stroke="var(--color-primary-200)" strokeWidth="2" />
                <line x1="51.5%" y1="24" x2="81.5%" y2="24" stroke="var(--color-primary-200)" strokeWidth="2" />
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
              <Eyebrow color="dark" className="mb-4">Intelligence Engine</Eyebrow>
            </ScrollReveal>
            <ScrollReveal>
              <h2
                id="intelligence-heading"
                className="mx-auto max-w-[28ch] text-display-md text-white"
              >
                We Analyze Data You Can&apos;t Get from a Google Search.
              </h2>
            </ScrollReveal>
            <ScrollReveal>
              <p className="mx-auto mt-6 max-w-[65ch] text-body-lg text-[#b8c3c7]">
                SafeTrekr&apos;s Risk Intelligence Engine pulls from 5 authoritative
                government data sources and runs Monte Carlo simulations to produce
                probability-weighted risk scores.
              </p>
            </ScrollReveal>
          </div>

          {/* Intelligence Source Cards */}
          <StaggerChildren className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {INTELLIGENCE_SOURCES.map((source) => (
              <article
                key={source.abbr}
                className="rounded-xl border border-white/10 bg-white/[0.06] p-6 text-center lg:text-left"
              >
                <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-lg bg-white/[0.08] lg:mx-0">
                  <Activity className="size-6 text-[#6cbc8b] opacity-80" aria-hidden="true" />
                </div>
                <h3 className="text-heading-sm font-semibold text-white">{source.abbr}</h3>
                <p className="mb-3 text-xs text-[#b8c3c7]">{source.name}</p>
                <p className="text-body-sm text-[#b8c3c7]">{source.description}</p>
              </article>
            ))}
          </StaggerChildren>

          {/* Monte Carlo Explanation Card */}
          <ScrollReveal>
            <div className="grid items-center gap-8 rounded-xl border border-white/10 bg-white/[0.06] p-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12 lg:p-12">
              {/* Left: Text */}
              <div>
                <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#6cbc8b]/15 px-2.5 py-0.5 text-xs font-semibold text-[#6cbc8b]">
                  <BarChart3 className="size-3.5" aria-hidden="true" />
                  RISK SCORING
                </span>
                <h3 className="mb-4 text-heading-lg text-white">
                  Probability-Weighted Risk Scores
                </h3>
                <p className="mb-6 max-w-[65ch] text-body-md text-[#b8c3c7]">
                  Our Risk Intelligence Engine runs Monte Carlo simulations across all
                  data sources to produce probability-weighted risk scores -- not simple
                  averages, but statistically modeled projections of what could affect
                  your trip.
                </p>
                <ul className="space-y-3">
                  {[
                    "Thousands of simulations per trip",
                    "Weather, seismic, health, conflict data cross-referenced",
                    "Scores update until departure date",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check className="mt-0.5 size-4 shrink-0 text-[#6cbc8b]" aria-hidden="true" />
                      <span className="text-body-sm text-[#b8c3c7]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Bell Curve Visualization (decorative) */}
              <div className="mx-auto w-full max-w-[400px]" aria-hidden="true">
                <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                  {/* Axes */}
                  <line x1="40" y1="200" x2="380" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="40" y1="200" x2="40" y2="20" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  {/* Shaded area */}
                  <path d="M60 200 Q100 195 140 170 Q180 100 210 50 Q240 100 280 170 Q320 195 360 200 Z" fill="#6cbc8b" fillOpacity="0.1" />
                  {/* Bell curve */}
                  <path d="M60 200 Q100 195 140 170 Q180 100 210 50 Q240 100 280 170 Q320 195 360 200" stroke="#6cbc8b" strokeWidth="2" fill="none" />
                  {/* Data points */}
                  <circle cx="120" cy="185" r="5" fill="#96cfac" />
                  <circle cx="165" cy="145" r="5" fill="#6cbc8b" />
                  <circle cx="210" cy="50" r="6" fill="#4ca46e" />
                  <circle cx="255" cy="145" r="5" fill="#6cbc8b" />
                  <circle cx="310" cy="188" r="5" fill="#96cfac" />
                  {/* X-axis labels */}
                  <text x="80" y="225" fill="#b8c3c7" fontFamily="JetBrains Mono, monospace" fontSize="11">Low</text>
                  <text x="190" y="225" fill="#b8c3c7" fontFamily="JetBrains Mono, monospace" fontSize="11">Medium</text>
                  <text x="330" y="225" fill="#b8c3c7" fontFamily="JetBrains Mono, monospace" fontSize="11">High</text>
                  {/* Y-axis label */}
                  <text x="10" y="110" fill="#b8c3c7" fontFamily="JetBrains Mono, monospace" fontSize="10" transform="rotate(-90, 15, 110)">Probability</text>
                </svg>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 4: 17-SECTION REVIEW GRID
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
                17 Sections. Nothing Missed.
              </h2>
            </ScrollReveal>
            <ScrollReveal>
              <p className="mx-auto mt-4 max-w-[65ch] text-body-lg text-muted-foreground">
                Every trip receives the same comprehensive analyst review. Here is
                every section your safety analyst evaluates.
              </p>
            </ScrollReveal>
          </div>

          {/* Category Groups with Accordion */}
          <div className="space-y-12">
            {REVIEW_CATEGORIES.map((cat) => (
              <div key={cat.category}>
                <ScrollReveal>
                  <h3 className="mb-6 text-eyebrow uppercase text-muted-foreground">
                    {cat.category}
                  </h3>
                </ScrollReveal>

                <Accordion type="multiple" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {cat.sections.map((section) => (
                    <AccordionItem
                      key={section.num}
                      value={`section-${section.num}`}
                      className="rounded-xl border border-border bg-card shadow-[var(--shadow-sm)]"
                    >
                      <AccordionTrigger className="px-5 py-4 text-left hover:no-underline [&[data-state=open]>div>.section-desc]:hidden">
                        <div className="w-full">
                          <div className="mb-3 flex items-center gap-3">
                            <div className="flex size-7 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-700">
                              {section.num}
                            </div>
                            <span className="[&_svg]:size-5" aria-hidden="true">
                              {section.icon}
                            </span>
                          </div>
                          <h4 className="text-heading-sm font-semibold text-foreground">
                            {section.title}
                          </h4>
                          <p className="section-desc mt-2 line-clamp-2 text-body-sm text-muted-foreground">
                            {section.description}
                          </p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-5">
                        <p className="text-body-sm leading-relaxed text-muted-foreground">
                          {section.description}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 5: THE SAFETY BINDER
          ================================================================ */}
      <div id="binder">
        <FeatureShowcase
          eyebrow="The Deliverable"
          title="What You Receive."
          description="Your Trip Safety Binder is a complete, audit-ready documentation package. Every finding. Every recommendation. Every emergency contact. Every risk score."
          visual={<DocumentPreview variant="full" showHash />}
          ctaText="Download a Sample Binder"
          ctaHref="/resources/sample-binders"
          className="border-y border-border bg-card"
        />
      </div>

      {/* SHA-256 Explanation Strip */}
      <SectionContainer className="bg-card" as="div">
        <Container>
          <ScrollReveal>
            <div className="flex flex-col items-start gap-6 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] lg:flex-row lg:p-8">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                <Lock className="size-5 text-primary-700" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-heading-sm font-semibold text-foreground">
                  Tamper-Evident Integrity
                </h3>
                <p className="mt-2 max-w-[65ch] text-body-md text-muted-foreground">
                  Every page of your Safety Binder is cryptographically signed using
                  SHA-256 hash chains. Any modification -- even a single character --
                  is detectable. Your documentation is as trustworthy the day it was
                  created as it will be years later.
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
                  real-time tools for participant safety and communication.
                </p>
              </ScrollReveal>

              <ul className="mb-8 space-y-3">
                {[
                  "Live map with participant locations",
                  "Geofence boundary alerts",
                  "Rally point muster check-ins",
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
          SECTION 7: AFTER THE TRIP
          ================================================================ */}
      <SectionContainer
        id="after-trip"
        variant="card"
        aria-labelledby="after-trip-heading"
      >
        <Container>
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <ScrollReveal>
              <Eyebrow
                className="mb-4"
                icon={<Shield className="size-3.5" aria-hidden="true" />}
              >
                After the Trip
              </Eyebrow>
            </ScrollReveal>
            <ScrollReveal>
              <h2
                id="after-trip-heading"
                className="mx-auto max-w-[28ch] text-display-md text-foreground"
              >
                Every Decision Documented. Every Precaution Verifiable.
              </h2>
            </ScrollReveal>
            <ScrollReveal>
              <p className="mx-auto mt-6 max-w-[65ch] text-body-lg text-muted-foreground">
                Years after the trip, your SafeTrekr documentation remains intact
                and verifiable. The evidence chain cannot be altered, providing
                permanent proof of the safety measures your organization took.
              </p>
            </ScrollReveal>
          </div>

          {/* 3-Column Proof Grid */}
          <StaggerChildren className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: <Shield className="size-7 text-primary-700" />,
                title: "Audit Trail",
                description:
                  "Complete record of every decision and action taken throughout the review process.",
              },
              {
                icon: <FileText className="size-7 text-primary-700" />,
                title: "Compliance Documentation",
                description:
                  "FERPA, SOC 2, GDPR-ready documentation for regulatory review.",
              },
              {
                icon: <FileText className="size-7 text-primary-700" />,
                title: "Insurance Records",
                description:
                  "Documented proof of safety measures for liability and claims support.",
              },
            ].map((card) => (
              <article
                key={card.title}
                className="rounded-xl border border-border bg-card p-6 text-center shadow-[var(--shadow-sm)]"
              >
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-primary-50">
                  {card.icon}
                </div>
                <h3 className="text-heading-sm font-semibold text-foreground">{card.title}</h3>
                <p className="mt-2 text-body-sm text-muted-foreground">{card.description}</p>
              </article>
            ))}
          </StaggerChildren>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 8: SEGMENT EXAMPLES
          ================================================================ */}
      <SectionContainer id="segments" className="bg-muted" aria-labelledby="segments-heading">
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
              regulatoryHook="FERPA-ready"
              href="/solutions/k12"
            />
            <SegmentCard
              icon={<GraduationCap />}
              title="Higher Education"
              description="Study abroad, research travel, athletic programs"
              regulatoryHook="SOC 2 compliant"
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
              regulatoryHook="Enterprise-ready"
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
        headline="Ready to See It in Action?"
        body="Schedule a personalized walkthrough. We'll show you exactly what a safety binder looks like for your organization."
        primaryCta={{ text: "Get a Demo", href: "/demo" }}
        secondaryCta={{ text: "Download a Sample Binder", href: "/resources/sample-binders" }}
      />

      {/* ================================================================
          JSON-LD STRUCTURED DATA
          ================================================================ */}
      <JsonLd data={generateHowToSchema(HOWTO_STEPS)} />
    </>
  );
}
