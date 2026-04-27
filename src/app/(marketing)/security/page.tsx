/**
 * ST-879: Security Page (/security)
 *
 * Public security practices page for organizations evaluating SafeTrekr.
 * Communicates how we protect sensitive trip planning information through
 * encryption, access controls, data minimization, and secure infrastructure.
 *
 * Section order:
 *   1. Hero               -- "How we protect your information" with Shield icon
 *   2. Security Practices -- 6 FeatureCards (Encryption, RBAC, Verification, etc.)
 *   3. Privacy            -- Student, Employee, and International considerations
 *   4. Security Info      -- Available security documentation
 *   5. CTA Band           -- "Questions about security?" dark variant
 *   6. JSON-LD            -- BreadcrumbList structured data
 *
 * Server Component -- no client-side interactivity required.
 */

import {
  Shield,
  Lock,
  Key,
  Server,
  Eye,
  CheckCircle,
  Mail,
} from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import { JsonLd, generateOrganizationSchema } from "@/lib/structured-data";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { SectionContainer } from "@/components/layout/section-container";
import { Container } from "@/components/layout/container";
import { Eyebrow, FeatureGrid, CTABand } from "@/components/marketing";
import type { FeatureGridItem } from "@/components/marketing";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { StaggerChildren } from "@/components/motion/stagger-children";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "How We Protect Your Information",
  description:
    "SafeTrekr is built with thoughtful security practices for organizations that handle sensitive trip planning information. Role-based access, encryption, and data minimization.",
  path: "/security",
});

// ---------------------------------------------------------------------------
// Data: Security Capability Cards
// ---------------------------------------------------------------------------

const SECURITY_CAPABILITIES: FeatureGridItem[] = [
  {
    icon: <Lock className="size-6" />,
    title: "Encryption",
    description:
      "All data is encrypted at rest using industry-standard encryption. Data in transit is protected by TLS 1.3. Your information is secured both when stored and when transmitted.",
  },
  {
    icon: <Key className="size-6" />,
    title: "Role-Based Access Controls",
    description:
      "Access to traveler data is controlled by role. Trip coordinators see their trips. Administrators see organizational data. Analysts see only what they need for review. No one has access they don't need.",
  },
  {
    icon: <CheckCircle className="size-6" />,
    title: "Verified Documentation",
    description:
      "Every finding in your safety binder is recorded with integrity verification. Documentation demonstrates that content has not been modified after completion. Professional records you can rely on.",
  },
  {
    icon: <Eye className="size-6" />,
    title: "Data Minimization",
    description:
      "We collect only the information necessary for safety assessment. No unnecessary data collection. No secondary use. No selling or sharing of traveler information.",
  },
  {
    icon: <Server className="size-6" />,
    title: "Secure Infrastructure",
    description:
      "SafeTrekr runs on cloud infrastructure with strong security practices. Redundant systems, regular backups, and monitoring help protect availability.",
  },
  {
    icon: <Shield className="size-6" />,
    title: "Regular Assessment",
    description:
      "We conduct regular security assessments to validate our practices and identify areas for improvement.",
  },
];

// ---------------------------------------------------------------------------
// Data: Privacy Items
// ---------------------------------------------------------------------------

interface PrivacyItem {
  label: string;
  status: string;
  statusColor: "green" | "amber";
  description: string;
}

const PRIVACY_ITEMS: PrivacyItem[] = [
  {
    label: "Student Privacy",
    status: "Designed For",
    statusColor: "amber",
    description:
      "SafeTrekr is designed with student data protection in mind. Role-based access controls, encryption, and data minimization practices support organizations handling student information.",
  },
  {
    label: "Employee Privacy",
    status: "Designed For",
    statusColor: "amber",
    description:
      "For organizations sending employees, SafeTrekr collects only trip-relevant information. We don't track employees beyond trip coordination needs.",
  },
  {
    label: "International Considerations",
    status: "Supported",
    statusColor: "amber",
    description:
      "For organizations with international operations or travelers, SafeTrekr supports data protection practices including data subject rights and appropriate handling measures.",
  },
];

// ---------------------------------------------------------------------------
// Status color helper
// ---------------------------------------------------------------------------

function statusClasses(color: "green" | "amber"): string {
  if (color === "green") {
    return "bg-primary-50 text-primary-700 border-primary-200";
  }
  return "bg-amber-50 text-amber-700 border-amber-200";
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function SecurityPage() {
  return (
    <>
      {/* BreadcrumbList JSON-LD for security page */}
      <BreadcrumbJsonLd path="/security" currentPageTitle="Security" />

      {/* ================================================================
          SECTION 1: HERO
          ================================================================ */}
      <SectionContainer
        ariaLabelledBy="security-hero-heading"
        className="pt-12 pb-10 sm:pt-16 sm:pb-12 lg:pt-20 lg:pb-16"
      >
        <Container>
          {/* Eyebrow */}
          <ScrollReveal variant="fadeUp">
            <Eyebrow color="primary" icon={<Shield className="size-3.5" />}>
              SECURITY PRACTICES
            </Eyebrow>
          </ScrollReveal>

          {/* Headline */}
          <ScrollReveal variant="fadeUp" delay={0.08}>
            <h1
              id="security-hero-heading"
              className="text-display-lg mt-4 text-foreground"
              style={{ maxWidth: "24ch" }}
            >
              How we protect your information.
            </h1>
          </ScrollReveal>

          {/* Sub-headline */}
          <ScrollReveal variant="fadeUp" delay={0.16}>
            <p className="text-body-lg mt-6 max-w-prose text-muted-foreground lg:mt-8">
              SafeTrekr is built for organizations that handle sensitive
              information&mdash;student details, employee data, traveler records.
              We use industry-standard encryption, role-based access controls,
              and structured documentation practices to keep your data secure.
            </p>
          </ScrollReveal>

          {/* Hero CTAs */}
          <ScrollReveal variant="fadeUp" delay={0.24}>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
              <a
                href="/contact?subject=security"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Request Security Information
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Ask a Question
              </a>
            </div>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 2: SECURITY CAPABILITIES (FeatureGrid)
          Covers: Encryption, Auth & Access, Data Handling, Infrastructure
          ================================================================ */}
      <SectionContainer
        variant="card"
        ariaLabelledBy="security-capabilities-heading"
        className="py-16 sm:py-20 md:py-24 lg:py-32"
      >
        <Container>
          {/* Section Header */}
          <ScrollReveal variant="fadeUp">
            <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
              <Eyebrow color="primary">SECURITY PRACTICES</Eyebrow>
              <h2
                id="security-capabilities-heading"
                className="text-display-md mx-auto mt-4 text-foreground"
                style={{ maxWidth: "28ch" }}
              >
                How we handle your data.
              </h2>
            </div>
          </ScrollReveal>

          {/* Feature Grid */}
          <ScrollReveal variant="fadeUp" delay={0.16}>
            <FeatureGrid
              features={SECURITY_CAPABILITIES}
              columns={3}
            />
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 3: PRIVACY CONSIDERATIONS
          ================================================================ */}
      <SectionContainer ariaLabelledBy="privacy-heading">
        <Container>
          {/* Section Header */}
          <ScrollReveal variant="fadeUp">
            <div className="mb-12 max-w-3xl lg:mb-16">
              <Eyebrow
                color="primary"
                icon={<Eye className="size-3.5" />}
              >
                PRIVACY
              </Eyebrow>
              <h2
                id="privacy-heading"
                className="text-heading-lg mt-4 text-foreground"
              >
                Designed with privacy in mind.
              </h2>
            </div>
          </ScrollReveal>

          {/* Privacy Cards */}
          <StaggerChildren className="grid gap-6 md:grid-cols-3">
            {PRIVACY_ITEMS.map((item, index) => (
              <ScrollReveal
                key={item.label}
                variant="fadeUp"
                delay={index * 0.08}
              >
                <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  {/* Status Badge */}
                  <span
                    className={`mb-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(item.statusColor)}`}
                  >
                    {item.status}
                  </span>

                  {/* Label */}
                  <h3 className="text-heading-sm text-foreground">
                    {item.label}
                  </h3>

                  {/* Description */}
                  <p className="text-body-sm mt-3 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </StaggerChildren>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 4: SECURITY INFORMATION
          ================================================================ */}
      <SectionContainer
        variant="card"
        ariaLabelledBy="security-info-heading"
        className="py-16 sm:py-20 md:py-24 lg:py-32"
      >
        <Container size="sm" className="max-w-3xl">
          <ScrollReveal variant="fadeUp">
            <div className="text-center">
              {/* Icon */}
              <div
                className="mx-auto mb-6 flex size-16 items-center justify-center rounded-xl bg-primary-50"
                aria-hidden="true"
              >
                <Mail className="size-8 text-primary-700" />
              </div>

              <Eyebrow color="primary">SECURITY INFORMATION</Eyebrow>

              <h2
                id="security-info-heading"
                className="text-heading-lg mt-4 text-foreground"
              >
                Available Security Information
              </h2>
            </div>
          </ScrollReveal>

          {/* Security Info Items */}
          <ScrollReveal variant="fadeUp" delay={0.16}>
            <div className="mx-auto mt-10 max-w-lg rounded-xl border border-border bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
              <dl className="space-y-4">
                {/* Security Overview */}
                <div>
                  <dt className="text-eyebrow text-muted-foreground">
                    Security Overview
                  </dt>
                  <dd className="text-body-sm mt-1 text-muted-foreground">
                    Description of our security practices and approach
                  </dd>
                </div>

                {/* Data Handling */}
                <div>
                  <dt className="text-eyebrow text-muted-foreground">
                    Data Handling Documentation
                  </dt>
                  <dd className="text-body-sm mt-1 text-muted-foreground">
                    For procurement review processes
                  </dd>
                </div>

                {/* Integration Info */}
                <div>
                  <dt className="text-eyebrow text-muted-foreground">
                    Integration Information
                  </dt>
                  <dd className="text-body-sm mt-1 text-muted-foreground">
                    For technical discussions
                  </dd>
                </div>
              </dl>

              {/* CTA Button */}
              <div className="mt-8 text-center">
                <a
                  href="/contact?subject=security"
                  className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Request Security Information
                </a>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 5: CTA BAND
          ================================================================ */}
      <CTABand
        variant="dark"
        headline="Questions about security?"
        body="Our team is available to discuss your organization's specific requirements and provide additional information."
        primaryCta={{ text: "Ask a Question", href: "/contact" }}
        secondaryCta={{ text: "Request Information", href: "/contact?subject=security" }}
      />

      {/* ================================================================
          SECTION 6: JSON-LD STRUCTURED DATA
          Organization schema for the Security page.
          ================================================================ */}
      <JsonLd
        data={{
          ...generateOrganizationSchema(),
          description:
            "SafeTrekr security practices: industry-standard encryption, role-based access controls, data minimization, and secure infrastructure for organizations handling sensitive trip planning information.",
        }}
      />
    </>
  );
}
