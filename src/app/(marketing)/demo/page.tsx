/**
 * ST-859: Demo Request Page (/demo)
 *
 * Two-column layout: 7-col form card (left) + 5-col trust sidebar (right,
 * sticky on desktop). Hero section above with eyebrow, headline, and
 * subheadline. Alternative path cards below for users not ready to commit.
 *
 * The DemoRequestForm component handles the progressive 2-step form with
 * Turnstile + honeypot security. This page provides the surrounding context
 * and trust signals.
 *
 * @see src/components/forms/demo-request-form.tsx
 * @see designs/html/mockup-demo-request.html
 */

import Link from "next/link";
import {
  Play,
  Shield,
  ClipboardCheck,
  Clock,
  Lock,
  FileText,
  DollarSign,
  MessageSquare,
} from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { Container } from "@/components/layout/container";
import { SectionContainer } from "@/components/layout/section-container";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { DemoRequestForm } from "@/components/forms/demo-request-form";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "Request a Demo",
  description:
    "Schedule a personalized demo of SafeTrekr. See exactly what a trip safety binder looks like for your organization. No obligation.",
  path: "/demo",
});

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

/** Numbered "What to Expect" items in the trust sidebar. */
const EXPECT_ITEMS = [
  {
    text: (
      <>
        We&apos;ll confirm your demo within{" "}
        <strong className="font-medium text-[var(--color-foreground)]">
          1 business day
        </strong>
        .
      </>
    ),
  },
  {
    text: (
      <>
        Your demo will be{" "}
        <strong className="font-medium text-[var(--color-foreground)]">
          personalized
        </strong>{" "}
        for your organization type.
      </>
    ),
  },
  {
    text: (
      <>
        We&apos;ll walk through a{" "}
        <strong className="font-medium text-[var(--color-foreground)]">
          real safety binder
        </strong>{" "}
        for your kind of trip.
      </>
    ),
  },
  {
    text: (
      <>
        No pressure. No obligation.{" "}
        <strong className="font-medium text-[var(--color-foreground)]">
          Just clarity
        </strong>
        .
      </>
    ),
  },
] as const;

/** Trust proof points with icon, stat, and label. */
const TRUST_POINTS = [
  {
    icon: Shield,
    stat: "5",
    label: "Government Intel Sources",
  },
  {
    icon: ClipboardCheck,
    stat: "17",
    label: "Safety Review Sections",
  },
  {
    icon: Clock,
    stat: "3-5 Day",
    label: "Turnaround",
  },
  {
    icon: Lock,
    stat: "AES-256",
    label: "Encryption Standard",
  },
  {
    icon: FileText,
    stat: "SHA-256",
    label: "Evidence Chain",
  },
] as const;

/** Alternative path cards for users not ready for a demo. */
const ALT_PATHS = [
  {
    href: "/resources/sample-binders",
    icon: FileText,
    title: "Download a Sample Binder",
    description: "See what a real safety binder looks like for your trip type.",
  },
  {
    href: "/pricing",
    icon: DollarSign,
    title: "View Pricing",
    description: "Transparent per-student pricing. No hidden fees.",
  },
  {
    href: "/contact",
    icon: MessageSquare,
    title: "Contact Us",
    description: "Have a question before booking? We're here.",
  },
] as const;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DemoRequestPage() {
  return (
    <>
      {/* ST-904/ST-905: BreadcrumbList JSON-LD for demo page */}
      <BreadcrumbJsonLd path="/demo" currentPageTitle="Request a Demo" />

      {/* ── Hero ── */}
      <SectionContainer as="section" className="pb-8 pt-12 sm:pt-16 md:pt-20 lg:pt-24 text-center">
        <Container>
          <ScrollReveal variant="fadeIn">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Eyebrow
                color="primary"
                icon={<Play className="h-3.5 w-3.5" />}
              >
                Personalized Demo
              </Eyebrow>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.1}>
            <h1 className="text-display-md mx-auto text-[var(--color-foreground)]" style={{ maxWidth: "28ch" }}>
              See Your Safety Binder Before You Buy.
            </h1>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.25}>
            <p className="text-body-lg mx-auto mt-4 text-[var(--color-muted-foreground)]" style={{ maxWidth: "55ch" }}>
              Schedule a personalized walkthrough of the SafeTrekr platform. We&apos;ll
              show you exactly what a safety binder looks like for your organization.
            </p>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ── Form + Trust Sidebar ── */}
      <SectionContainer as="section" className="pb-0 pt-0">
        <Container>
          <ScrollReveal variant="fadeUp" delay={0.4}>
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Form Card (7 cols) */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-lg sm:p-10">
                  <DemoRequestForm />
                </div>
              </div>

              {/* Trust Sidebar (5 cols) */}
              <aside className="lg:col-span-5 lg:sticky lg:top-24" aria-label="What to expect from your demo">
                {/* What to Expect */}
                <div className="space-y-6">
                  <h2 className="text-heading-sm text-[var(--color-foreground)]">
                    What to Expect
                  </h2>
                  <ol className="space-y-5" role="list">
                    {EXPECT_ITEMS.map((item, index) => (
                      <li key={index} className="flex gap-4 items-start">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-body-sm font-semibold text-[var(--color-primary-700)]"
                          aria-hidden="true"
                        >
                          {index + 1}
                        </span>
                        <p className="pt-1 text-body-md text-[var(--color-muted-foreground)]">
                          {item.text}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Divider */}
                <div
                  className="my-8 h-px bg-[var(--color-border)]"
                  role="separator"
                />

                {/* Trusted Platform */}
                <div className="space-y-4">
                  <Eyebrow color="primary">Trusted Platform</Eyebrow>
                  <ul className="space-y-4" role="list">
                    {TRUST_POINTS.map((point) => (
                      <li key={point.label} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-50)]">
                          <point.icon
                            className="h-5 w-5 text-[var(--color-primary-700)]"
                            aria-hidden="true"
                          />
                        </div>
                        <div>
                          <p className="text-body-sm font-semibold text-[var(--color-foreground)]">
                            {point.stat}
                          </p>
                          <p className="text-body-xs text-[var(--color-muted-foreground)]">
                            {point.label}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Divider */}
                <div
                  className="my-8 h-px bg-[var(--color-border)]"
                  role="separator"
                />

                {/* Security Callout */}
                <div className="flex items-start gap-3 rounded-lg border border-[var(--color-primary-100)] bg-[var(--color-primary-50)] p-4">
                  <Lock
                    className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary-700)]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-body-sm font-medium text-[var(--color-foreground)]">
                      Your data is secure
                    </p>
                    <p className="mt-1 text-body-xs text-[var(--color-muted-foreground)]">
                      SOC 2 compliant infrastructure. FERPA and GDPR ready.
                      Your information is encrypted in transit and at rest.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ── Alternative Paths ── */}
      <SectionContainer
        as="section"
        className="mt-16 pb-24 lg:mt-20 lg:pb-32"
        ariaLabelledBy="alt-paths-heading"
      >
        <Container className="text-center">
          <h2
            id="alt-paths-heading"
            className="text-heading-sm mb-8 text-[var(--color-foreground)]"
          >
            Not ready for a demo?
          </h2>
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
            {ALT_PATHS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group block rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary-50)]">
                  <card.icon
                    className="h-5 w-5 text-[var(--color-primary-700)]"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-heading-sm text-[var(--color-foreground)] transition-colors group-hover:text-[var(--color-primary-700)]">
                  {card.title}
                </h3>
                <p className="mt-2 text-body-sm text-[var(--color-muted-foreground)]">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </SectionContainer>
    </>
  );
}
