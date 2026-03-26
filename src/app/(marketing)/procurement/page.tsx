/**
 * ST-878: Procurement Hub Page (/procurement)
 *
 * Self-serve procurement resources page for enterprise buyers. Provides
 * downloadable documents (security questionnaire, budget template, board
 * presentation), compliance posture summary, response time commitment,
 * and a CTA band to contact/demo.
 *
 * Section order:
 *   1. Hero              -- Breadcrumb + "Procurement Made Simple"
 *   2. Resource Cards    -- 3 downloadable document cards
 *   3. Compliance        -- FERPA, SOC 2 Type II, AES-256, TLS 1.2+
 *   4. Response Time     -- 24-hour commitment
 *   5. CTA Band          -- Dark variant to contact/demo
 *   6. JSON-LD           -- BreadcrumbList structured data
 */

import Link from "next/link";
import {
  Download,
  FileText,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { SectionContainer } from "@/components/layout/section-container";
import { Container } from "@/components/layout/container";
import { Eyebrow, CTABand } from "@/components/marketing";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { StaggerChildren } from "@/components/motion/stagger-children";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "Procurement Resources",
  description:
    "Procurement resources for SafeTrekr. Documentation and support for institutional buyers navigating vendor approval processes.",
  path: "/procurement",
});

// ---------------------------------------------------------------------------
// Data: Downloadable Resources
// ---------------------------------------------------------------------------

interface ResourceDocument {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  fileName: string;
}

const RESOURCES: ResourceDocument[] = [
  {
    icon: <Shield className="size-5" />,
    title: "Security Questionnaire",
    description:
      "Pre-filled security questionnaire covering encryption standards, data handling policies, access controls, incident response, and compliance certifications.",
    href: "/downloads/security-questionnaire.pdf",
    fileName: "SafeTrekr-Security-Questionnaire.pdf",
  },
  {
    icon: <FileText className="size-5" />,
    title: "Budget Justification Template",
    description:
      "Board-ready budget justification with ROI calculations, cost comparisons, risk reduction metrics, and financial summaries for procurement approval.",
    href: "/downloads/budget-justification-template.pdf",
    fileName: "SafeTrekr-Budget-Justification-Template.pdf",
  },
  {
    icon: <FileText className="size-5" />,
    title: "Board Presentation Template",
    description:
      "Customizable slide deck with executive summary, safety ROI data, compliance overview, and implementation timeline for board-level approval.",
    href: "/downloads/board-presentation-template.pdf",
    fileName: "SafeTrekr-Board-Presentation-Template.pdf",
  },
];

// ---------------------------------------------------------------------------
// Data: Compliance Posture
// ---------------------------------------------------------------------------

interface ComplianceItem {
  icon: React.ReactNode;
  label: string;
  detail: string;
}

const COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    icon: <CheckCircle className="size-5" />,
    label: "FERPA-Ready",
    detail:
      "Built to meet Family Educational Rights and Privacy Act requirements for handling student data.",
  },
  {
    icon: <Shield className="size-5" />,
    label: "SOC 2 Type II",
    detail:
      "SOC 2 Type II audit planned. Security controls are designed to meet Trust Service Criteria.",
  },
  {
    icon: <Shield className="size-5" />,
    label: "AES-256 Encryption",
    detail:
      "All data encrypted at rest using AES-256, the same standard used by financial institutions and government agencies.",
  },
  {
    icon: <Shield className="size-5" />,
    label: "TLS 1.2+ In Transit",
    detail:
      "All data in transit protected with TLS 1.2 or higher. No exceptions, no fallbacks.",
  },
];

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function ProcurementPage() {
  return (
    <>
      {/* BreadcrumbList JSON-LD for procurement page */}
      <BreadcrumbJsonLd path="/procurement" currentPageTitle="Procurement Resources" />

      {/* ================================================================
          SECTION 1: HERO
          ================================================================ */}
      <SectionContainer
        ariaLabelledBy="procurement-hero-heading"
        className="pt-24 pb-20 lg:pt-32 lg:pb-28 xl:pt-36 xl:pb-32"
      >
        <Container>
          {/* Breadcrumb navigation */}
          <ScrollReveal variant="fadeUp">
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
                  <span className="text-foreground" aria-current="page">
                    Procurement Resources
                  </span>
                </li>
              </ol>
            </nav>
          </ScrollReveal>

          {/* Eyebrow */}
          <ScrollReveal variant="fadeUp" delay={0.04}>
            <Eyebrow color="primary" icon={<FileText className="size-3.5" />}>
              PROCUREMENT
            </Eyebrow>
          </ScrollReveal>

          {/* Headline */}
          <ScrollReveal variant="fadeUp" delay={0.08}>
            <h1
              id="procurement-hero-heading"
              className="text-display-lg mt-4 text-foreground"
              style={{ maxWidth: "22ch" }}
            >
              Resources for institutional buyers.
            </h1>
          </ScrollReveal>

          {/* Sub-headline */}
          <ScrollReveal variant="fadeUp" delay={0.16}>
            <p className="text-body-lg mt-6 max-w-prose text-muted-foreground lg:mt-8">
              Whether you&apos;re conducting vendor due diligence, navigating district
              procurement, or preparing vendor approval paperwork, we have the
              documentation you need.
            </p>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 2: RESOURCE CARDS (Downloadable Documents)
          ================================================================ */}
      <SectionContainer
        variant="card"
        ariaLabelledBy="resources-heading"
        className="py-16 sm:py-20 md:py-24 lg:py-32"
      >
        <Container>
          {/* Section Header */}
          <ScrollReveal variant="fadeUp">
            <div className="mb-12 lg:mb-16">
              <Eyebrow
                color="primary"
                icon={<Download className="size-3.5" />}
              >
                DOWNLOADABLE RESOURCES
              </Eyebrow>
              <h2
                id="resources-heading"
                className="text-heading-lg mt-4 text-foreground"
              >
                Ready-Made Documents for Your Procurement Process
              </h2>
              <p className="text-body-lg mt-4 max-w-prose text-muted-foreground">
                Skip the back-and-forth. These documents are designed to answer
                the questions your procurement team, IT security team, and board
                will ask.
              </p>
            </div>
          </ScrollReveal>

          {/* Resource Cards Grid */}
          <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {RESOURCES.map((resource, index) => (
              <ScrollReveal
                key={resource.title}
                variant="fadeUp"
                delay={index * 0.08}
              >
                <div className="flex h-full flex-col rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
                  {/* Icon */}
                  <div
                    className="mb-4 inline-flex items-center justify-center rounded-md border border-primary-200 bg-primary-50 p-2.5 text-primary-700"
                    aria-hidden="true"
                  >
                    <span className="[&_svg]:size-5">{resource.icon}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-heading-sm text-card-foreground">
                    {resource.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 flex-1 text-body-sm text-muted-foreground">
                    {resource.description}
                  </p>

                  {/* Download Link */}
                  <div className="mt-6">
                    <Button variant="primary" size="sm" asChild>
                      <a
                        href={resource.href}
                        download={resource.fileName}
                        aria-label={`Download ${resource.title} (PDF)`}
                      >
                        <Download className="size-4" aria-hidden="true" />
                        Download PDF
                      </a>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </StaggerChildren>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 3: COMPLIANCE POSTURE
          ================================================================ */}
      <SectionContainer ariaLabelledBy="compliance-heading">
        <Container>
          {/* Section Header */}
          <ScrollReveal variant="fadeUp">
            <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
              <Eyebrow color="primary" icon={<Shield className="size-3.5" />}>
                COMPLIANCE POSTURE
              </Eyebrow>
              <h2
                id="compliance-heading"
                className="text-display-md mx-auto mt-4 text-foreground"
                style={{ maxWidth: "28ch" }}
              >
                Built for Enterprise Security Requirements
              </h2>
              <p className="text-body-lg mx-auto mt-4 max-w-prose text-muted-foreground">
                SafeTrekr is designed from the ground up to meet the security and
                privacy standards enterprise organizations require.
              </p>
            </div>
          </ScrollReveal>

          {/* Compliance Cards Grid */}
          <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {COMPLIANCE_ITEMS.map((item, index) => (
              <ScrollReveal
                key={item.label}
                variant="fadeUp"
                delay={index * 0.08}
              >
                <div className="flex gap-4 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  {/* Icon */}
                  <div
                    className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-50"
                    aria-hidden="true"
                  >
                    <span className="text-primary-700 [&_svg]:size-5">
                      {item.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-heading-sm text-foreground">
                      {item.label}
                    </h3>
                    <p className="mt-2 text-body-sm text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </StaggerChildren>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 4: RESPONSE TIME COMMITMENT
          ================================================================ */}
      <SectionContainer
        variant="dark"
        ariaLabelledBy="response-time-heading"
        className="py-16 sm:py-20 lg:py-28"
      >
        <Container size="md">
          <ScrollReveal variant="fadeUp">
            <div className="text-center">
              {/* Icon */}
              <div
                className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
                aria-hidden="true"
              >
                <Clock className="size-8 text-primary-400" />
              </div>

              {/* Heading */}
              <h2
                id="response-time-heading"
                className="text-display-md text-white"
              >
                We Respond to Procurement Inquiries Within 24 Hours
              </h2>

              {/* Body */}
              <p className="text-body-lg mx-auto mt-6 max-w-prose text-[var(--color-secondary-muted)]">
                We know procurement timelines are tight. Our team is committed to
                responding to every procurement inquiry&mdash;security reviews,
                vendor questionnaires, pricing questions, contract
                terms&mdash;within one business day.
              </p>

              {/* CTA */}
              <div className="mt-8">
                <Button variant="primaryOnDark" size="lg" asChild>
                  <Link href="/contact">Contact Procurement Team</Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 5: CTA BAND
          ================================================================ */}
      <CTABand
        variant="brand"
        headline="Ready to move forward?"
        body="Request the documentation you need or schedule a call with our team."
        primaryCta={{ text: "Request Documentation", href: "/contact" }}
        secondaryCta={{ text: "Schedule a Call", href: "/contact" }}
      />
    </>
  );
}
