/**
 * ST-871: REQ-064 -- K-12 Schools Solutions Page (/solutions/k12)
 *
 * Vertical solutions page targeting K-12 school districts. Positions SafeTrekr
 * as the professional safety analysis layer every field trip deserves. Uses
 * K-12-specific vocabulary throughout: field trip, board policy, parent
 * communication, duty of care, liability.
 *
 * 9 scroll-ordered sections:
 *   1. Hero              -- "$15 Per Student" badge, DocumentPreview, dual CTAs
 *   2. TrustStrip        -- 5 metrics + intel source bar
 *   3. The Challenge     -- DARK: 3 pain cards + Board Liability Comparison
 *   4. How SafeTrekr     -- 4 FeatureCards with K-12 vocabulary
 *      Solves It
 *   5. Sample Binder     -- Fanned K-12 binder preview + download CTA
 *      Preview
 *   6. Pricing           -- Interactive per-student calculator (client component)
 *      Calculator
 *   7. Compliance &      -- 4 badges with honest FERPA language
 *      Trust
 *   8. Common Questions  -- 10 K-12-specific FAQs with FAQPage JSON-LD
 *   9. CTA Band          -- DARK conversion band
 *
 * Server Component at the page level. The pricing calculator is the only
 * client boundary (`PerStudentCalculator`).
 *
 * @see designs/html/mockup-k12-solutions.html
 */

import Link from "next/link";
import {
  CheckSquare,
  Activity,
  FileText,
  Smartphone,
  Clock,
  AlertTriangle,
  FileX,
  Shield,
  Lock,
  Link2,
  ChevronRight,
  Download,
  Check,
  ArrowRight,
  MapPin,
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
  FeatureCard,
  FAQSection,
  CTABand,
} from "@/components/marketing";
import { DocumentPreview } from "@/components/marketing/document-preview";
import { PerStudentCalculator } from "@/components/marketing/per-student-calculator";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { StaggerChildren } from "@/components/motion/stagger-children";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "K-12 Field Trip Planning",
  description:
    "Field trip planning that supports educational excellence. SafeTrekr provides professional safety review, consistent processes across your district, and documentation that demonstrates thorough preparation.",
  path: "/solutions/k12",
});

// ---------------------------------------------------------------------------
// Structured Data
// ---------------------------------------------------------------------------

const BREADCRUMBS = [
  { name: "Home", url: "https://safetrekr.com/" },
  { name: "Solutions", url: "https://safetrekr.com/solutions" },
  { name: "K-12 Schools & Districts", url: "https://safetrekr.com/solutions/k12" },
];

// ---------------------------------------------------------------------------
// FAQ Data
// ---------------------------------------------------------------------------

const K12_FAQS: FAQItem[] = [
  {
    question: "How does SafeTrekr handle student data?",
    answer:
      "SafeTrekr is designed with student privacy in mind. We use role-based access controls to limit data visibility, secure handling practices, and data minimization that collects only what's necessary for safety assessment. We do not sell or share student data. Schools can request documentation for district procurement requirements.",
  },
  {
    question: "What does the analyst review include?",
    answer:
      "Every trip receives a comprehensive evaluation covering all critical areas: destination overview, venue assessment, lodging evaluation, transportation, emergency medical facilities, evacuation routes, weather and environmental conditions, health advisories, communication infrastructure, local emergency contacts, activity-specific considerations, food safety, accessibility, documentation review, regulatory considerations, historical context, and analyst recommendations. Each review is completed by an experienced safety professional.",
  },
  {
    question: "How long does it take to receive documentation?",
    answer:
      "Delivery in as soon as 3 days from trip submission. Priority processing is available for Extended and International trips when faster turnaround is needed.",
  },
  {
    question: "Can multiple schools in our district use SafeTrekr?",
    answer:
      "Yes. SafeTrekr supports district-wide use with centralized administration. District administrators can view all trips across schools, establish consistent processes, and access documentation. Contact us for district pricing.",
  },
  {
    question: "What if our trip destination changes after we receive documentation?",
    answer:
      "If your destination changes significantly (new city, different venues), we recommend submitting updated trip details for review. Minor changes to the same destination can be accommodated -- contact your analyst for guidance.",
  },
  {
    question: "How do chaperones access trip information in the field?",
    answer:
      "Chaperones download the SafeTrekr mobile app and receive a trip code. The app provides offline access to emergency contacts, rally points, medical facility locations, and check-in tools. No training required.",
  },
];

// ---------------------------------------------------------------------------
// Feature Cards Data
// ---------------------------------------------------------------------------

const FEATURE_CARDS = [
  {
    icon: <CheckSquare className="size-6" />,
    title: "Experienced Analyst Review",
    description:
      "Every trip is reviewed by former Secret Service, Special Operations, and trained safety professionals. Venues, transportation, lodging, emergency contacts, medical facilities, weather, and more -- all evaluated and documented.",
    href: "/platform/analyst-review",
  },
  {
    icon: <Activity className="size-6" />,
    title: "Active Intelligence Monitoring",
    description:
      "Information from multiple trusted sources including government, humanitarian, and regional data. Current conditions for your destinations assessed by professionals.",
    href: "/platform/risk-intelligence",
  },
  {
    icon: <FileText className="size-6" />,
    title: "Board-Ready Documentation",
    description:
      "Every safety binder is structured for stakeholder review. When the board, parents, or administrators ask what the district did to prepare, you have professional documentation to share.",
    href: "/platform/safety-binder",
  },
  {
    icon: <Smartphone className="size-6" />,
    title: "Chaperone Mobile App",
    description:
      "Emergency contacts, rally points, and check-in tools accessible on every chaperone's phone. No training required. Works offline.",
    href: "/platform/mobile-app",
  },
] as const;

// ---------------------------------------------------------------------------
// Pain Cards Data
// ---------------------------------------------------------------------------

const PAIN_CARDS = [
  {
    icon: <Clock className="size-6" />,
    iconColor: "text-primary-400",
    value: "Hours",
    valueLabel: "Hours of staff time per field trip",
    subtitle: "of staff time per trip",
    description:
      "Every field trip requires hours of manual planning by teachers who have many other responsibilities.",
  },
  {
    icon: <AlertTriangle className="size-6" />,
    iconColor: "text-primary-400",
    value: "Variable",
    valueLabel: "Variable process quality",
    subtitle: "process quality across trips",
    description:
      "When different coordinators use different approaches, preparation quality varies from trip to trip.",
  },
  {
    icon: <FileX className="size-6" />,
    iconColor: "text-primary-400",
    value: "Scattered",
    valueLabel: "Scattered documentation",
    subtitle: "documentation practices",
    description:
      "Permission slips, checklists, and notes exist -- but they're scattered and inconsistent.",
  },
] as const;

// ---------------------------------------------------------------------------
// Compliance Badges Data
// ---------------------------------------------------------------------------

const COMPLIANCE_BADGES = [
  {
    icon: <Shield className="size-6" />,
    title: "Designed for Student Privacy",
    description:
      "Designed with student data protection in mind. Role-based access controls, data minimization practices, and secure handling built for K-12 environments.",
  },
  {
    icon: <Lock className="size-6" />,
    title: "Secure Data Handling",
    description:
      "All data encrypted at rest and in transit. We follow industry best practices for data security.",
  },
  {
    icon: <FileText className="size-6" />,
    title: "Clear Documentation",
    description:
      "Documentation designed for the questions stakeholders ask. Organized records that demonstrate thorough preparation.",
  },
  {
    icon: <Link2 className="size-6" />,
    title: "Verified Integrity",
    description:
      "Every finding and recommendation documented with verified integrity. Professional records you can share with confidence.",
  },
] as const;

// ---------------------------------------------------------------------------
// Binder Checklist Data
// ---------------------------------------------------------------------------

const BINDER_CHECKLIST = [
  "Comprehensive professional safety review",
  "Active intelligence from multiple trusted sources",
  "Emergency contacts and medical facilities",
  "Organized documentation for stakeholder review",
  "Delivery in as soon as 3 days",
] as const;

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function K12SolutionsPage() {
  return (
    <>
      {/* Structured Data */}
      <JsonLd data={generateBreadcrumbSchema(BREADCRUMBS)} />

      {/* ================================================================
         SECTION 1: HERO
         ================================================================ */}
      <SectionContainer variant="default">
        <Container>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-border">
                <ChevronRight className="size-4" />
              </li>
              <li>
                <Link href="/solutions" className="hover:text-foreground transition-colors">
                  Solutions
                </Link>
              </li>
              <li aria-hidden="true" className="text-border">
                <ChevronRight className="size-4" />
              </li>
              <li>
                <span aria-current="page" className="font-medium text-foreground">
                  K-12 Schools &amp; Districts
                </span>
              </li>
            </ol>
          </nav>

          {/* Hero Grid */}
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Visual Column -- first on mobile, second on desktop */}
            <ScrollReveal
              variant="fadeUp"
              delay={0.2}
              className="flex justify-center lg:order-2"
            >
              <DocumentPreview variant="full" showHash />
            </ScrollReveal>

            {/* Text Column */}
            <ScrollReveal variant="fadeUp" className="lg:order-1">
              {/* Pricing Badge */}
              <span
                className="mb-4 inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700"
                aria-label="Per-student pricing: $15 per student"
              >
                $15 Per Student
              </span>

              {/* Eyebrow */}
              <Eyebrow color="primary" className="mb-3 block">
                K-12 Trip Safety
              </Eyebrow>

              {/* Headline */}
              <h1 className="text-display-lg max-w-[20ch] text-foreground">
                Field trip planning that supports educational excellence.
              </h1>

              {/* Sub-headline */}
              <p className="mt-6 max-w-[65ch] text-body-lg text-muted-foreground">
                Your teachers already care about student safety. SafeTrekr gives them a professional framework that turns good intentions into documented preparation -- without adding hours to their planning process. Every trip professionally reviewed. Every destination assessed. Every finding documented.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/demo">
                    Schedule a Walkthrough
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/resources/sample-binders/k12-field-trip">View Sample Binder</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
         SECTION 3: THE CHALLENGE (DARK)
         ================================================================ */}
      <SectionContainer
        variant="dark"
        id="challenge"
        ariaLabelledBy="challenge-heading"
      >
        <Container>
          {/* Header */}
          <ScrollReveal variant="fadeUp">
            <Eyebrow color="dark" className="block">
              The Challenge
            </Eyebrow>
            <h2
              id="challenge-heading"
              className="mt-3 text-display-md text-dark-text-primary"
            >
              Trip planning works better with structure.
            </h2>
            <p className="mt-4 max-w-[65ch] text-body-lg text-dark-text-secondary">
              Field trip planning in most districts relies on individual teachers doing their best with whatever tools are available. The process varies from trip to trip, school to school. The challenge isn't effort or caring -- teachers care deeply. The challenge is that districts ask educators to perform safety planning functions without safety planning tools or training.
            </p>
          </ScrollReveal>

          {/* Pain Cards */}
          <StaggerChildren
            className="mt-12 grid gap-8 md:grid-cols-3"
            staggerDelay={0.1}
          >
            {PAIN_CARDS.map((card) => (
              <ScrollReveal key={card.value} variant="fadeUp">
                <div className="rounded-xl border border-dark-border bg-dark-surface p-6">
                  <span className={card.iconColor} aria-hidden="true">
                    {card.icon}
                  </span>
                  <div
                    className="mt-4 text-display-md font-bold text-dark-text-primary"
                    aria-label={card.valueLabel}
                  >
                    {card.value}
                  </div>
                  <p className="mt-1 text-eyebrow text-dark-text-secondary">
                    {card.subtitle}
                  </p>
                  <p className="mt-4 text-body-md text-dark-text-secondary">
                    {card.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </StaggerChildren>

          {/* Board Liability Comparison */}
          <ScrollReveal variant="fadeUp" delay={0.2}>
            <div
              className="mt-12 rounded-xl border border-dark-border bg-dark-surface p-8"
              role="group"
              aria-label="Board liability comparison: without versus with SafeTrekr"
            >
              <h3 className="text-heading-sm text-dark-text-primary">
                The Board Liability Question
              </h3>
              <div className="mt-6 grid gap-8 md:grid-cols-2">
                {/* Without SafeTrekr */}
                <div>
                  <p className="text-eyebrow tracking-wider text-destructive">
                    Without SafeTrekr
                  </p>
                  <p className="mt-3 text-body-lg italic text-dark-text-secondary">
                    &ldquo;What documentation did the district have before approving
                    this trip?&rdquo;
                  </p>
                  <p className="mt-4 text-body-md text-dark-text-secondary">
                    Answer: Permission slips. A teacher&rsquo;s spreadsheet. Verbal
                    assurances.
                  </p>
                </div>
                {/* With SafeTrekr */}
                <div>
                  <p className="text-eyebrow tracking-wider text-primary-400">
                    With SafeTrekr
                  </p>
                  <p className="mt-3 text-body-lg italic text-dark-text-secondary">
                    &ldquo;Here is the comprehensive safety review conducted by
                    experienced professionals, the safety assessment, and
                    the complete documentation binder.&rdquo;
                  </p>
                  <p className="mt-4 text-body-md text-dark-text-secondary">
                    Answer: A documented, professional record of the preparation
                    the district completed.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
         SECTION 4: HOW SAFETREKR SOLVES IT
         ================================================================ */}
      <SectionContainer
        variant="default"
        id="solutions"
        ariaLabelledBy="solutions-heading"
      >
        <Container>
          {/* Header */}
          <ScrollReveal variant="fadeUp">
            <div className="mx-auto max-w-[768px] text-center">
              <Eyebrow color="primary" className="block">
                Built for K-12 Districts
              </Eyebrow>
              <h2
                id="solutions-heading"
                className="mt-3 text-display-md text-foreground"
              >
                Professional Trip Safety for Every Field Trip
              </h2>
              <p className="mx-auto mt-4 max-w-[65ch] text-body-lg text-muted-foreground">
                From the science museum to the state capital, every destination your
                students visit gets the same level of professional safety analysis.
              </p>
            </div>
          </ScrollReveal>

          {/* Feature Cards Grid */}
          <StaggerChildren
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8"
            staggerDelay={0.1}
          >
            {FEATURE_CARDS.map((card) => (
              <ScrollReveal key={card.title} variant="fadeUp">
                <FeatureCard
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  href={card.href}
                />
              </ScrollReveal>
            ))}
          </StaggerChildren>
        </Container>
      </SectionContainer>

      {/* ================================================================
         SECTION 5: SAMPLE BINDER PREVIEW
         ================================================================ */}
      <SectionContainer
        variant="brand"
        id="binder-preview"
        ariaLabelledBy="binder-preview-heading"
      >
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Fanned Binder Visual */}
            <ScrollReveal variant="fadeUp" className="lg:order-1">
              <div className="flex justify-center gap-0 py-5 pb-10 sm:py-0 sm:pb-0">
                {/* Binder Thumbnails - Fanned layout */}
                <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-0">
                  {[
                    {
                      label: "Risk Score",
                      accent: "bg-primary-200",
                      content: (
                        <div className="mb-2 flex h-10 w-full items-center justify-center rounded bg-primary-50">
                          <span className="font-display text-lg font-bold text-primary-700">
                            Low
                          </span>
                        </div>
                      ),
                    },
                    {
                      label: "Full Review",
                      accent: "bg-primary-200",
                      content: (
                        <div className="flex flex-col gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <div className="size-2 shrink-0 rounded-full bg-primary-400" />
                              <div
                                className="h-[3px] rounded-full bg-border"
                                style={{ width: `${55 + ((i * 17) % 30)}%` }}
                              />
                            </div>
                          ))}
                        </div>
                      ),
                    },
                    {
                      label: "Emergency Plan",
                      accent: "bg-destructive/30",
                      content: (
                        <div className="mb-1.5 flex h-[50px] w-full items-center justify-center rounded bg-primary-50">
                          <MapPin className="size-5 text-primary-600" />
                        </div>
                      ),
                    },
                    {
                      label: "Evidence Chain",
                      accent: "bg-primary-200",
                      content: (
                        <>
                          <div className="mb-1.5 flex h-10 w-full items-center justify-center rounded border border-border bg-card">
                            <Link2 className="size-4 text-primary-600" />
                          </div>
                          <code className="break-all font-mono text-[8px] leading-tight text-muted-foreground">
                            sha256:a3f8c2d1...
                          </code>
                        </>
                      ),
                    },
                  ].map((thumb, i) => {
                    // Fan transforms: rotate and translate for desktop, flat for mobile
                    const fanTransforms = [
                      "sm:rotate-[-3deg] sm:translate-x-5",
                      "sm:rotate-[-1deg] sm:translate-x-2",
                      "sm:rotate-[1deg] sm:-translate-x-2",
                      "sm:rotate-[3deg] sm:-translate-x-5",
                    ];
                    const fanZ = [4, 3, 2, 1];
                    return (
                    <div
                      key={thumb.label}
                      className={`flex w-full flex-col rounded-md border border-border bg-white p-3 shadow-[var(--shadow-md)] transition-transform sm:w-[140px] sm:shrink-0 ${fanTransforms[i]}`}
                      style={{ zIndex: fanZ[i] }}
                      aria-hidden="true"
                    >
                      <div
                        className={`mb-2 h-2 w-full rounded-full ${thumb.accent}`}
                      />
                      <div
                        className="mb-2.5 h-1.5 rounded-full bg-border"
                        style={{ width: `${50 + i * 10}%` }}
                      />
                      {thumb.content}
                      <p className="mt-auto pt-2 text-center text-[10px] text-muted-foreground">
                        {thumb.label}
                      </p>
                    </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            {/* Text Column */}
            <ScrollReveal variant="fadeUp" delay={0.1} className="lg:order-2">
              <Eyebrow color="primary" className="block">
                See the Deliverable
              </Eyebrow>
              <h2
                id="binder-preview-heading"
                className="mt-3 text-display-md text-foreground"
              >
                See What Your Superintendent Will Review
              </h2>
              <p className="mt-4 max-w-[65ch] text-body-lg text-muted-foreground">
                Every field trip produces a comprehensive safety binder. This is what
                your school board will see when they ask about trip safety
                documentation.
              </p>

              {/* Checklist */}
              <ul role="list" className="mt-6 flex flex-col gap-3">
                {BINDER_CHECKLIST.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 size-5 shrink-0 text-primary-500"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span className="text-body-md text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-8">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/resources/sample-binders/k12-field-trip">
                    <Download className="size-4" aria-hidden="true" />
                    Download K-12 Sample Binder
                  </Link>
                </Button>
                <p className="mt-3 text-body-sm text-muted-foreground">
                  Free. No credit card. Email required.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
         SECTION 6: PER-STUDENT PRICING CALCULATOR
         ================================================================ */}
      <SectionContainer
        variant="default"
        id="pricing"
        ariaLabelledBy="pricing-heading"
      >
        <Container>
          {/* Header */}
          <ScrollReveal variant="fadeUp">
            <div className="mx-auto max-w-[768px] text-center">
              <Eyebrow color="primary" className="block">
                Pricing
              </Eyebrow>
              <h2
                id="pricing-heading"
                className="mt-3 text-display-md text-foreground"
              >
                Professional trip assessment. Straightforward pricing.
              </h2>
              <p className="mx-auto mt-4 max-w-[65ch] text-body-lg text-muted-foreground">
                Most districts find that structured trip planning saves administrator time, reduces coordination burden, and creates valuable documentation for future reference.
              </p>
            </div>
          </ScrollReveal>

          {/* Calculator */}
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <div className="mx-auto mt-12 max-w-[672px]">
              <PerStudentCalculator />
            </div>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
         SECTION 7: COMPLIANCE & TRUST
         ================================================================ */}
      <SectionContainer
        variant="card"
        id="compliance"
        ariaLabelledBy="compliance-heading"
      >
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Text Column */}
            <ScrollReveal variant="fadeUp">
              <Eyebrow color="primary" className="block">
                Compliance &amp; Trust
              </Eyebrow>
              <h2
                id="compliance-heading"
                className="mt-3 text-display-md text-foreground"
              >
                Designed with FERPA Requirements in Mind
              </h2>
              <p className="mt-4 text-body-lg text-muted-foreground">
                Student data is sensitive. We built SafeTrekr knowing that. Our data
                handling practices follow FERPA guidelines for student education
                records. Certification is in progress.
              </p>
              <p className="mt-4 text-body-lg font-medium text-foreground">
                We do not overclaim. We do not cut corners. We document everything.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/security"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-600"
                >
                  View our security practices
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/procurement"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-600"
                >
                  Procurement resources
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Badge Cards */}
            <div>
              <StaggerChildren
                className="grid gap-6 sm:grid-cols-2"
                staggerDelay={0.08}
              >
                {COMPLIANCE_BADGES.map((badge) => (
                  <ScrollReveal key={badge.title} variant="fadeUp">
                    <div className="rounded-xl border border-border bg-background p-6 shadow-[var(--shadow-sm)]">
                      <span className="text-primary-700" aria-hidden="true">
                        {badge.icon}
                      </span>
                      <h3 className="mt-3 text-heading-sm text-card-foreground">
                        {badge.title}
                      </h3>
                      <p className="mt-2 text-body-sm text-muted-foreground">
                        {badge.description}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </StaggerChildren>

              {/* COPPA Note */}
              <p className="mt-8 max-w-[65ch] text-body-sm text-muted-foreground">
                SafeTrekr does not collect data directly from students under 13. All
                student information is provided by authorized school administrators in
                accordance with COPPA guidelines.
              </p>
            </div>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
         SECTION 8: COMMON QUESTIONS (FAQ)
         ================================================================ */}
      <SectionContainer
        variant="default"
        id="faq"
        ariaLabelledBy="faq-heading"
      >
        <Container size="md">
          {/* Header */}
          <ScrollReveal variant="fadeUp">
            <div className="text-center">
              <Eyebrow color="primary" className="block">
                Common Questions
              </Eyebrow>
              <h2
                id="faq-heading"
                className="mt-3 text-display-md text-foreground"
              >
                Everything Your Board Will Ask
              </h2>
            </div>
          </ScrollReveal>

          {/* FAQ Accordion */}
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <FAQSection items={K12_FAQS} className="mt-12" />
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
         SECTION 9: CTA BAND (DARK)
         ================================================================ */}
      <CTABand
        variant="dark"
        headline="Ready to go with a plan?"
        body="See how SafeTrekr delivers professional trip planning for K-12 schools with documentation that demonstrates thorough preparation."
        primaryCta={{ text: "Schedule a Walkthrough", href: "/demo" }}
        secondaryCta={{
          text: "View Pricing",
          href: "/pricing",
        }}
      />
    </>
  );
}
