/**
 * ST-861: Contact Page (/contact)
 *
 * Two-column layout: ContactForm (left) + contact info card (right).
 * Centered hero headline with subheadline above the form.
 *
 * Contact info card includes email, response time commitments, and
 * a procurement link for institutional buyers.
 *
 * @see src/components/forms/contact-form.tsx
 */

import Link from "next/link";
import { Mail, Clock, ArrowRight, Building2 } from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { Container } from "@/components/layout/container";
import { SectionContainer } from "@/components/layout/section-container";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { ContactForm } from "@/components/forms/contact-form";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "Contact Us",
  description:
    "Get in touch with the SafeTrekr team. General inquiries answered within 1 business day. Procurement questions answered within 4 hours.",
  path: "/contact",
});

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ContactPage() {
  return (
    <>
      {/* ST-904/ST-905: BreadcrumbList JSON-LD for contact page */}
      <BreadcrumbJsonLd path="/contact" currentPageTitle="Contact Us" />

      {/* ── Hero ── */}
      <SectionContainer
        as="section"
        className="pb-8 pt-12 sm:pt-16 md:pt-20 lg:pt-24 text-center"
      >
        <Container>
          <ScrollReveal variant="fadeIn">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Eyebrow
                color="primary"
                icon={<Mail className="h-3.5 w-3.5" />}
              >
                Contact
              </Eyebrow>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.1}>
            <h1 className="text-display-md mx-auto text-[var(--color-foreground)]" style={{ maxWidth: "24ch" }}>
              Get in Touch
            </h1>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.2}>
            <p className="text-body-lg mx-auto mt-4 text-[var(--color-muted-foreground)]" style={{ maxWidth: "50ch" }}>
              Have a question about SafeTrekr? We&apos;re here to help. Fill out
              the form below and our team will get back to you promptly.
            </p>
          </ScrollReveal>
        </Container>
      </SectionContainer>

      {/* ── Form + Contact Info ── */}
      <SectionContainer as="section" className="pb-24 pt-0 lg:pb-32">
        <Container>
          <ScrollReveal variant="fadeUp" delay={0.3}>
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-start">
              {/* Contact Form (7 cols) */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-lg sm:p-10">
                  <ContactForm />
                </div>
              </div>

              {/* Contact Info Sidebar (5 cols) */}
              <aside className="lg:col-span-5 space-y-6" aria-label="Contact information">
                {/* Email */}
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-50)]">
                      <Mail
                        className="h-5 w-5 text-[var(--color-primary-700)]"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="text-body-sm font-semibold text-[var(--color-foreground)]">
                        Email Us
                      </p>
                      <a
                        href="mailto:hello@safetrekr.com"
                        className="text-body-sm text-[var(--color-primary-700)] underline underline-offset-2 hover:text-[var(--color-primary-800)]"
                      >
                        hello@safetrekr.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Response Times */}
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-50)]">
                      <Clock
                        className="h-5 w-5 text-[var(--color-primary-700)]"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-body-sm font-semibold text-[var(--color-foreground)]">
                      Response Times
                    </p>
                  </div>
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start gap-3">
                      <span
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary-500)]"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-body-sm font-medium text-[var(--color-foreground)]">
                          General Inquiries
                        </p>
                        <p className="text-body-xs text-[var(--color-muted-foreground)]">
                          Within 1 business day
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary-500)]"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-body-sm font-medium text-[var(--color-foreground)]">
                          Procurement Questions
                        </p>
                        <p className="text-body-xs text-[var(--color-muted-foreground)]">
                          Within 4 hours during business hours
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Procurement Link */}
                <div className="rounded-xl border border-[var(--color-primary-100)] bg-[var(--color-primary-50)] p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                      <Building2
                        className="h-5 w-5 text-[var(--color-primary-700)]"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-body-sm font-semibold text-[var(--color-foreground)]">
                      Institutional Buyer?
                    </p>
                  </div>
                  <p className="text-body-sm text-[var(--color-muted-foreground)] mb-4">
                    Looking for pricing documentation, W-9 forms, or sole-source
                    letters? Visit our procurement page.
                  </p>
                  <Link
                    href="/procurement"
                    className="inline-flex items-center gap-1.5 text-body-sm font-medium text-[var(--color-primary-700)] transition-colors hover:text-[var(--color-primary-800)]"
                  >
                    Visit Procurement
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </aside>
            </div>
          </ScrollReveal>
        </Container>
      </SectionContainer>
    </>
  );
}
