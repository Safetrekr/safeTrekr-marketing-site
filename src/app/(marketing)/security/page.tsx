/**
 * ST-879: Security Page (/security)
 *
 * Public security posture page for enterprise buyer evaluation. Communicates
 * SafeTrekr's encryption standards, access controls, data handling practices,
 * infrastructure security, compliance trajectory, and responsible disclosure
 * policy in a scannable, trust-building format.
 *
 * Section order:
 *   1. Hero               -- "Security at SafeTrekr" with Shield icon, breadcrumb
 *   2. Capabilities Grid  -- 4 FeatureCards (Encryption, Auth, Data, Infrastructure)
 *   3. Compliance          -- SOC 2 Type II (planned), FERPA-ready, COPPA
 *   4. Responsible Disclosure -- security@safetrekr.com, PGP key reference
 *   5. CTA Band           -- "Have a security questionnaire?" dark variant
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
  title: "Security at SafeTrekr",
  description:
    "SafeTrekr protects your data with AES-256 encryption, TLS 1.2+ in transit, role-based access controls, and infrastructure hardened on Kubernetes. SOC 2 Type II planned. FERPA-ready. Responsible disclosure welcome.",
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
      "All data is encrypted at rest using AES-256 and in transit using TLS 1.2 or higher. Database-level encryption ensures that stored trip assessments, traveler information, and organizational data remain protected even at the storage layer.",
  },
  {
    icon: <Key className="size-6" />,
    title: "Authentication & Access Controls",
    description:
      "Role-based access control (RBAC) ensures users only see the data relevant to their role. Session management follows OWASP best practices with secure, HTTP-only cookies and automatic expiration. SSO integration is on our near-term roadmap.",
  },
  {
    icon: <Eye className="size-6" />,
    title: "Data Handling & Privacy",
    description:
      "We follow data minimization principles -- we collect only what is necessary to perform safety analysis. Retention policies are configurable per organization. Our practices are GDPR-ready, with data subject access and deletion capabilities built in.",
  },
  {
    icon: <Server className="size-6" />,
    title: "Infrastructure Security",
    description:
      "SafeTrekr runs on DigitalOcean DOKS (managed Kubernetes) with network policies enforcing pod-level isolation. All services communicate over private networking. Container images are scanned for vulnerabilities before deployment.",
  },
];

// ---------------------------------------------------------------------------
// Data: Compliance Items
// ---------------------------------------------------------------------------

interface ComplianceItem {
  label: string;
  status: string;
  statusColor: "green" | "amber";
  description: string;
}

const COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    label: "SOC 2 Type II",
    status: "Planned",
    statusColor: "amber",
    description:
      "We are actively preparing for SOC 2 Type II certification. Our controls are designed to meet Trust Services Criteria for security, availability, and confidentiality.",
  },
  {
    label: "FERPA",
    status: "Ready",
    statusColor: "green",
    description:
      "SafeTrekr is designed to support FERPA compliance for educational institutions. We do not use student data for marketing or third-party purposes.",
  },
  {
    label: "COPPA",
    status: "Considered",
    statusColor: "amber",
    description:
      "SafeTrekr does not knowingly collect personal information from children under 13. Our platform is designed for organizational administrators and trip coordinators, not minors directly.",
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
        className="pt-24 pb-20 lg:pt-32 lg:pb-28 xl:pt-36 xl:pb-32"
      >
        <Container>
          {/* Eyebrow */}
          <ScrollReveal variant="fadeUp">
            <Eyebrow color="primary" icon={<Shield className="size-3.5" />}>
              SECURITY
            </Eyebrow>
          </ScrollReveal>

          {/* Headline */}
          <ScrollReveal variant="fadeUp" delay={0.08}>
            <h1
              id="security-hero-heading"
              className="text-display-lg mt-4 text-foreground"
              style={{ maxWidth: "24ch" }}
            >
              Security at SafeTrekr
            </h1>
          </ScrollReveal>

          {/* Sub-headline */}
          <ScrollReveal variant="fadeUp" delay={0.16}>
            <p className="text-body-lg mt-6 max-w-prose text-muted-foreground lg:mt-8">
              You trust us with sensitive travel data, traveler information, and
              organizational risk assessments. We take that responsibility
              seriously. This page outlines how SafeTrekr protects your data at
              every layer&mdash;from encryption and access controls to
              infrastructure hardening and compliance preparation.
            </p>
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
              <Eyebrow color="primary">HOW WE PROTECT YOUR DATA</Eyebrow>
              <h2
                id="security-capabilities-heading"
                className="text-display-md mx-auto mt-4 text-foreground"
                style={{ maxWidth: "28ch" }}
              >
                Security Built Into Every Layer
              </h2>
              <p className="text-body-lg mx-auto mt-4 max-w-prose text-muted-foreground">
                From the database to the browser, every component of SafeTrekr
                is designed with defense in depth.
              </p>
            </div>
          </ScrollReveal>

          {/* Feature Grid */}
          <ScrollReveal variant="fadeUp" delay={0.16}>
            <FeatureGrid
              features={SECURITY_CAPABILITIES}
              columns={2}
            />
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 3: COMPLIANCE
          ================================================================ */}
      <SectionContainer ariaLabelledBy="compliance-heading">
        <Container>
          {/* Section Header */}
          <ScrollReveal variant="fadeUp">
            <div className="mb-12 max-w-3xl lg:mb-16">
              <Eyebrow
                color="primary"
                icon={<CheckCircle className="size-3.5" />}
              >
                COMPLIANCE
              </Eyebrow>
              <h2
                id="compliance-heading"
                className="text-heading-lg mt-4 text-foreground"
              >
                Compliance Posture
              </h2>
              <p className="text-body-lg mt-4 max-w-prose text-muted-foreground">
                SafeTrekr is building toward industry-standard certifications.
                Here is where we stand today and where we are headed.
              </p>
            </div>
          </ScrollReveal>

          {/* Compliance Cards */}
          <StaggerChildren className="grid gap-6 md:grid-cols-3">
            {COMPLIANCE_ITEMS.map((item, index) => (
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
          SECTION 4: RESPONSIBLE DISCLOSURE
          ================================================================ */}
      <SectionContainer
        variant="card"
        ariaLabelledBy="disclosure-heading"
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

              <Eyebrow color="primary">RESPONSIBLE DISCLOSURE</Eyebrow>

              <h2
                id="disclosure-heading"
                className="text-heading-lg mt-4 text-foreground"
              >
                Found a Vulnerability?
              </h2>

              <p className="text-body-lg mx-auto mt-4 max-w-prose text-muted-foreground">
                We welcome responsible disclosure from security researchers. If
                you discover a potential security issue, please contact us
                directly. We commit to acknowledging reports within 48 hours and
                working toward resolution collaboratively.
              </p>
            </div>
          </ScrollReveal>

          {/* Contact Details */}
          <ScrollReveal variant="fadeUp" delay={0.16}>
            <div className="mx-auto mt-10 max-w-lg rounded-xl border border-border bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
              <dl className="space-y-4">
                {/* Email */}
                <div>
                  <dt className="text-eyebrow text-muted-foreground">
                    Security Contact
                  </dt>
                  <dd className="mt-1">
                    <a
                      href="mailto:security@safetrekr.com"
                      className="text-body-md font-semibold text-primary-700 underline decoration-primary-300 underline-offset-4 hover:text-primary-600 hover:decoration-primary-400"
                    >
                      security@safetrekr.com
                    </a>
                  </dd>
                </div>

                {/* PGP Key */}
                <div>
                  <dt className="text-eyebrow text-muted-foreground">
                    PGP Key
                  </dt>
                  <dd className="text-body-sm mt-1 text-muted-foreground">
                    PGP public key available upon request. Reference key ID in
                    your initial email and we will provide the fingerprint for
                    verification.
                  </dd>
                </div>

                {/* Response SLA */}
                <div>
                  <dt className="text-eyebrow text-muted-foreground">
                    Response Time
                  </dt>
                  <dd className="text-body-sm mt-1 text-muted-foreground">
                    We acknowledge all security reports within{" "}
                    <strong className="font-semibold text-foreground">
                      48 hours
                    </strong>{" "}
                    and provide status updates as remediation progresses.
                  </dd>
                </div>
              </dl>
            </div>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ================================================================
          SECTION 5: CTA BAND
          ================================================================ */}
      <CTABand
        variant="dark"
        headline="Have a Security Questionnaire?"
        body="We will complete your security questionnaire within 48 hours. Our team is ready to support your procurement and compliance review process."
        primaryCta={{ text: "Contact Security Team", href: "/contact" }}
        secondaryCta={{ text: "Request a Demo", href: "/demo" }}
      />

      {/* ================================================================
          SECTION 6: JSON-LD STRUCTURED DATA
          Organization schema for the Security page.
          ================================================================ */}
      <JsonLd
        data={{
          ...generateOrganizationSchema(),
          description:
            "SafeTrekr security posture: AES-256 encryption, TLS 1.2+, role-based access controls, Kubernetes infrastructure, SOC 2 Type II preparation, FERPA-ready.",
        }}
      />
    </>
  );
}
