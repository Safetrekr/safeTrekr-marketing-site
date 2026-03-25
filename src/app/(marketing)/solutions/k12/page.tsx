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
  TrustStrip,
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
  title: "Trip Safety for K-12 Schools & Districts",
  description:
    "Every field trip reviewed by a safety analyst. Per-student pricing starting at $15. Board-ready documentation that proves your district took every reasonable precaution.",
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
    question: "Is SafeTrekr FERPA compliant?",
    answer:
      "SafeTrekr is designed with FERPA requirements in mind. Our data handling practices follow FERPA guidelines for student education records, including access controls, data minimization, and secure storage. We are currently pursuing formal FERPA certification. We believe in transparency -- we will never claim a certification we have not earned.",
  },
  {
    question: "What happens to student data after the trip?",
    answer:
      "Student data is retained only for the documentation period required by your district's records retention policy. After that period, data is purged with a verifiable deletion record. You control the retention timeline. We provide cryptographic proof of deletion upon request.",
  },
  {
    question: "Can our school district use SafeTrekr for all field trips?",
    answer:
      "Yes. SafeTrekr handles field trips of every type -- from a single-day museum visit to a multi-day out-of-state educational trip. Every trip gets the same 17-section professional safety review, regardless of distance or duration. Volume pricing is available for districts with 25 or more trips per year.",
  },
  {
    question: "How does SafeTrekr handle parent consent?",
    answer:
      "SafeTrekr includes a Parent/Guardian Portal where parents can view trip safety details you choose to share. This is separate from your district's existing permission slip process. SafeTrekr provides the professional safety documentation; your district maintains its consent workflow. Parents see safety information -- not raw risk data.",
  },
  {
    question: "What if a field trip destination changes at the last minute?",
    answer:
      "Submit the new destination and our team will expedite a review. For minor changes (same city, different venue), we can often turn around an updated review within 24-48 hours. The original binder is versioned, not replaced -- you maintain a complete audit trail of all destination changes.",
  },
  {
    question: "How does per-student pricing work for large groups?",
    answer:
      "Pricing is $15 per student per trip. A field trip with 30 students costs $450. A field trip with 100 students costs $1,500. Volume discounts apply for districts committing to 25 or more trips per year. Contact us for district-wide pricing that covers all schools in your system.",
  },
  {
    question: "Can board members access the safety binder directly?",
    answer:
      "Yes. You can generate a read-only link for board members to review any safety binder. The binder includes the full 17-section review, risk intelligence summary, emergency response plan, and SHA-256 evidence chain verification. Board members see exactly what you see.",
  },
  {
    question: "Does SafeTrekr replace our existing field trip approval process?",
    answer:
      "No. SafeTrekr supplements your existing process with professional safety analysis and documentation. Your district keeps its approval workflow, permission slip procedures, and chain of command. SafeTrekr adds the evidence layer that proves your district took every reasonable precaution.",
  },
  {
    question: "How quickly do we receive the safety binder?",
    answer:
      "Standard turnaround is 3-5 business days from trip submission. For field trips within the continental United States to well-documented destinations, turnaround is often faster. Rush processing is available for time-sensitive trips.",
  },
  {
    question: "What government data sources does SafeTrekr use?",
    answer:
      "Our Risk Intelligence Engine aggregates data from 5 government sources: NOAA (weather and natural hazards), USGS (seismic and geological data), CDC (health advisories and disease surveillance), GDACS (global disaster alerts), and ReliefWeb (humanitarian situation reports). This data is scored using Monte Carlo simulation to produce a quantified risk profile for every destination.",
  },
];

// ---------------------------------------------------------------------------
// Feature Cards Data
// ---------------------------------------------------------------------------

const FEATURE_CARDS = [
  {
    icon: <CheckSquare className="size-6" />,
    title: "Analyst Safety Review",
    description:
      "Every field trip destination reviewed across 17 safety dimensions by a professional analyst. Not a checklist. Not software. A human review.",
    href: "/platform/analyst-review",
  },
  {
    icon: <Activity className="size-6" />,
    title: "Risk Intelligence Engine",
    description:
      "Weather, health, crime, and natural hazard data from 5 government sources scored for every destination your students visit. Monte Carlo simulation, not guesswork.",
    href: "/platform/risk-intelligence",
  },
  {
    icon: <FileText className="size-6" />,
    title: "Trip Safety Binder",
    description:
      "Board-ready documentation that proves your district took every reasonable precaution. Tamper-evident with SHA-256 hash chain. Audit-ready on day one.",
    href: "/platform/safety-binder",
  },
  {
    icon: <Smartphone className="size-6" />,
    title: "Parent/Guardian Portal",
    description:
      "Parents see trip safety details on their phone. Rally points, emergency contacts, and real-time check-in status. You control exactly what they see.",
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
    value: "$700 - $1,400",
    valueLabel: "$700 to $1,400 in staff hours per field trip",
    subtitle: "in staff hours per trip",
    description:
      "Every field trip requires 15-30 hours of manual safety planning by teachers who are not risk professionals.",
  },
  {
    icon: <AlertTriangle className="size-6" />,
    iconColor: "text-red-500",
    value: "$500K - $2M",
    valueLabel: "$500,000 to $2 million average settlement for trip-related incidents",
    subtitle: "average settlement for trip-related incidents",
    description:
      'When a student is injured on a trip, "What precautions did the district take?" is the first question asked.',
  },
  {
    icon: <FileX className="size-6" />,
    iconColor: "text-primary-400",
    value: "Zero",
    valueLabel: "Zero formal risk documentation",
    subtitle: "formal risk documentation",
    description:
      "Permission slips are not safety plans. A signed waiver is not evidence of due diligence.",
  },
] as const;

// ---------------------------------------------------------------------------
// Compliance Badges Data
// ---------------------------------------------------------------------------

const COMPLIANCE_BADGES = [
  {
    icon: <Shield className="size-6" />,
    title: "FERPA",
    description:
      "Designed with FERPA requirements in mind. Student data handling follows FERPA guidelines. Certification in progress.",
  },
  {
    icon: <Lock className="size-6" />,
    title: "AES-256 Encryption",
    description:
      "All student data encrypted at rest and in transit using AES-256 standard.",
  },
  {
    icon: <FileText className="size-6" />,
    title: "SOC 2 Type II",
    description:
      "Type II audit in progress. Security controls documented and verified by independent auditors.",
  },
  {
    icon: <Link2 className="size-6" />,
    title: "SHA-256 Evidence Chain",
    description:
      "Tamper-evident evidence chain. Every document in every safety binder is hash-verified and immutable.",
  },
] as const;

// ---------------------------------------------------------------------------
// Binder Checklist Data
// ---------------------------------------------------------------------------

const BINDER_CHECKLIST = [
  "Risk score summary for every destination",
  "17-section professional safety review",
  "Emergency response protocols and contacts",
  "SHA-256 tamper-evident verification",
  "Government intelligence data cited",
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
                Every Field Trip Deserves a Safety Analyst.
              </h1>

              {/* Sub-headline */}
              <p className="mt-6 max-w-[65ch] text-body-lg text-muted-foreground">
                Professional safety analysis for every field trip your district runs.
                Board-ready documentation. Designed with FERPA requirements in mind.
                Starting at $15 per student.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/resources/sample-binders/k12-field-trip">
                    <Download className="size-4" aria-hidden="true" />
                    Download K-12 Sample Binder
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/demo">Get a Demo</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </SectionContainer>

      {/* ================================================================
         SECTION 2: TRUST STRIP
         ================================================================ */}
      <ScrollReveal variant="fadeUp">
        <TrustStrip />
      </ScrollReveal>

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
              The Status Quo
            </Eyebrow>
            <h2
              id="challenge-heading"
              className="mt-3 text-display-md text-dark-text-primary"
            >
              What Schools Currently Rely On
            </h2>
            <p className="mt-4 max-w-[65ch] text-body-lg text-dark-text-secondary">
              Teachers assemble spreadsheets. Permission slips serve as the only
              documentation. Risk assessment means checking the weather forecast
              the morning of departure.
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
                    &ldquo;Here is the 17-section safety review conducted by a
                    professional analyst, the government intelligence risk score, and
                    the complete evidence binder with SHA-256 verification.&rdquo;
                  </p>
                  <p className="mt-4 text-body-md text-dark-text-secondary">
                    Answer: A documented, tamper-evident record of every precaution
                    the district took.
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
                      label: "17-Section Review",
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
                $15 Per Student. Do the Math.
              </h2>
              <p className="mx-auto mt-4 max-w-[65ch] text-body-lg text-muted-foreground">
                Professional safety analysis costs less than a permission slip printing
                budget. Compare to what your district risks without it.
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
        headline="Ready to Protect Your Next Field Trip?"
        body="Join districts that document every precaution. Download a sample binder to see the deliverable, or schedule a demo to discuss your district's needs."
        primaryCta={{ text: "Get a Demo", href: "/demo" }}
        secondaryCta={{
          text: "Download Sample Binder",
          href: "/resources/sample-binders/k12-field-trip",
        }}
      />
    </>
  );
}
