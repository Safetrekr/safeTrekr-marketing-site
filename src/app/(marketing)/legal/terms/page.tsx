/**
 * ST-863: Terms of Service Page (/legal/terms)
 *
 * Full Terms of Service with 14 sections of real content, sticky TOC
 * sidebar on desktop, and collapsible TOC on mobile.
 *
 * Layout: 720px article + 260px sticky sidebar on a 1280px container.
 *
 * @see designs/html/mockup-legal.html (pattern reference)
 * @see src/components/marketing/legal-toc-sidebar.tsx
 */

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { Container } from "@/components/layout/container";
import { SectionContainer } from "@/components/layout/section-container";
import {
  LegalTocMobile,
  LegalTocDesktop,
  type TocItem,
} from "@/components/marketing/legal-toc-sidebar";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "Terms of Service",
  description:
    "SafeTrekr's Terms of Service. Last updated March 15, 2026. Read the terms governing your use of the SafeTrekr platform and services.",
  path: "/legal/terms",
});

// ---------------------------------------------------------------------------
// TOC Data
// ---------------------------------------------------------------------------

const TOC_ITEMS: TocItem[] = [
  { id: "section-1", label: "1. Acceptance of Terms" },
  { id: "section-2", label: "2. Description of Services" },
  { id: "section-3", label: "3. Account Registration" },
  { id: "section-4", label: "4. Organizational Accounts" },
  { id: "section-5", label: "5. Acceptable Use" },
  { id: "section-6", label: "6. Intellectual Property" },
  { id: "section-7", label: "7. Payment Terms" },
  { id: "section-8", label: "8. Data and Privacy" },
  { id: "section-9", label: "9. Service Availability" },
  { id: "section-10", label: "10. Limitation of Liability" },
  { id: "section-11", label: "11. Indemnification" },
  { id: "section-12", label: "12. Termination" },
  { id: "section-13", label: "13. Governing Law" },
  { id: "section-14", label: "14. Contact Information" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TermsOfServicePage() {
  return (
    <>
      {/* ST-904/ST-905: BreadcrumbList JSON-LD for terms of service */}
      <BreadcrumbJsonLd path="/legal/terms" currentPageTitle="Terms of Service" />

      {/* ── Page Header ── */}
      <SectionContainer
        as="section"
        className="pb-6 pt-8 sm:pb-8 sm:pt-12 lg:pb-10 lg:pt-16"
        ariaLabelledBy="legal-page-heading"
      >
        <Container>
          {/* Breadcrumb: Desktop */}
          <nav aria-label="Breadcrumb" className="mb-6 hidden sm:block lg:mb-8">
            <ol className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)]">
              <li>
                <Link
                  href="/"
                  className="transition-colors duration-150 hover:text-[var(--color-foreground)]"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="mx-1 h-3.5 w-3.5" />
              </li>
              <li>
                <span className="transition-colors duration-150">
                  Legal
                </span>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="mx-1 h-3.5 w-3.5" />
              </li>
              <li
                aria-current="page"
                className="font-medium text-[var(--color-foreground)]"
              >
                Terms of Service
              </li>
            </ol>
          </nav>

          {/* Breadcrumb: Mobile */}
          <nav aria-label="Breadcrumb" className="mb-6 sm:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted-foreground)] transition-colors duration-150"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back
            </Link>
          </nav>

          {/* Headline */}
          <h1
            id="legal-page-heading"
            className="text-display-md mb-6 text-[var(--color-foreground)]"
          >
            Terms of Service
          </h1>

          {/* Metadata Card */}
          <div className="flex flex-col gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <span className="text-sm text-[var(--color-muted-foreground)]">
              Last updated:{" "}
              <time dateTime="2026-03-15">March 15, 2026</time>
            </span>
            <span
              className="hidden text-[var(--color-border)] sm:inline"
              aria-hidden="true"
            >
              &middot;
            </span>
            <span className="text-sm text-[var(--color-muted-foreground)]">
              Version: 1.2
            </span>
            <span
              className="hidden text-[var(--color-border)] sm:inline"
              aria-hidden="true"
            >
              &middot;
            </span>
            <span className="text-sm text-[var(--color-muted-foreground)]">
              Effective:{" "}
              <time dateTime="2026-03-15">March 15, 2026</time>
            </span>
          </div>
        </Container>
      </SectionContainer>

      {/* ── Document Body + TOC Sidebar ── */}
      <SectionContainer
        as="section"
        className="pb-16 pt-0 lg:pb-24"
        aria-label="Terms of Service document"
      >
        <Container>
          {/* Mobile TOC -- renders above article on small screens */}
          <LegalTocMobile items={TOC_ITEMS} />

          <div className="grid lg:grid-cols-[1fr_260px] gap-12 lg:gap-16">
            {/* ── Article Column ── */}
            <article className="legal-prose max-w-[720px]">
              {/* 1. Acceptance of Terms */}
              <h2 id="section-1" className="scroll-mt-24">
                1. Acceptance of Terms
              </h2>
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) constitute a
                legally binding agreement between you (&ldquo;you&rdquo; or
                &ldquo;your&rdquo;) and SafeTrekr, Inc. (&ldquo;SafeTrekr,&rdquo;
                &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
                governing your access to and use of the SafeTrekr website, mobile
                applications, and all related services (collectively, the
                &ldquo;Services&rdquo;).
              </p>
              <p>
                By creating an account, accessing, or using any part of the
                Services, you acknowledge that you have read, understood, and
                agree to be bound by these Terms. If you are using the Services
                on behalf of an organization, you represent and warrant that you
                have the authority to bind that organization to these Terms.
              </p>
              <p>
                If you do not agree to these Terms, you must not use the
                Services.
              </p>

              <hr />

              {/* 2. Description of Services */}
              <h2 id="section-2" className="scroll-mt-24">
                2. Description of Services
              </h2>
              <p>
                SafeTrekr provides a trip safety management platform that
                includes, but is not limited to, the following capabilities:
              </p>
              <ul>
                <li>
                  <strong>Safety Binders</strong> -- analyst-reviewed,
                  destination-specific safety documentation covering route risk
                  assessments, emergency contacts, medical facility locations,
                  and regulatory compliance information
                </li>
                <li>
                  <strong>Safety Information</strong> -- current and
                  historical data aggregated from government sources
                  including NOAA, USGS, CDC, GDACS, and ReliefWeb
                </li>
                <li>
                  <strong>Compliance Documentation</strong> -- records and
                  evidence chains to support organizational duty-of-care
                  obligations for domestic and international travel
                </li>
                <li>
                  <strong>Trip Awareness</strong> -- alerts and
                  status updates during active trips
                </li>
                <li>
                  <strong>Mobile Application</strong> -- on-device access to
                  safety binders, emergency contacts, and trip information
                </li>
              </ul>
              <p>
                SafeTrekr provides safety information and risk assessments as a
                decision-support tool. Our Services do not replace professional
                security consultation, government travel advisories, or your
                organization&apos;s independent duty-of-care obligations.
              </p>

              <hr />

              {/* 3. Account Registration */}
              <h2 id="section-3" className="scroll-mt-24">
                3. Account Registration
              </h2>
              <p>
                To access certain features of the Services, you must create an
                account. When registering, you agree to:
              </p>
              <ul>
                <li>
                  Provide accurate, current, and complete information during
                  the registration process
                </li>
                <li>
                  Maintain and promptly update your account information to keep
                  it accurate and complete
                </li>
                <li>
                  Maintain the security and confidentiality of your login
                  credentials
                </li>
                <li>
                  Accept responsibility for all activities that occur under
                  your account
                </li>
                <li>
                  Notify us immediately of any unauthorized access to or use
                  of your account
                </li>
              </ul>
              <p>
                You must be at least 18 years of age (or the age of majority in
                your jurisdiction) to create an account. SafeTrekr reserves the
                right to suspend or terminate accounts that violate these
                requirements.
              </p>

              <hr />

              {/* 4. Organizational Accounts */}
              <h2 id="section-4" className="scroll-mt-24">
                4. Organizational Accounts
              </h2>
              <p>
                Organizations (schools, churches, universities, businesses) may
                create organizational accounts that allow multiple users to
                access the Services under a single subscription. The
                organization&apos;s designated administrator is responsible for:
              </p>
              <ul>
                <li>
                  Managing user access and permissions within the organization
                </li>
                <li>
                  Ensuring all users within the organization comply with these
                  Terms
                </li>
                <li>
                  Maintaining appropriate data governance practices for
                  organizational data
                </li>
                <li>
                  Complying with applicable privacy and data protection laws,
                  including FERPA for educational institutions and other
                  sector-specific regulations
                </li>
              </ul>
              <p>
                The organization retains ownership of all organizational data
                uploaded to the Services. SafeTrekr processes this data in
                accordance with the applicable{" "}
                <Link href="/legal/dpa">Data Processing Agreement</Link> and our{" "}
                <Link href="/legal/privacy">Privacy Policy</Link>.
              </p>

              <hr />

              {/* 5. Acceptable Use */}
              <h2 id="section-5" className="scroll-mt-24">
                5. Acceptable Use
              </h2>
              <p>You agree not to use the Services to:</p>
              <ul>
                <li>
                  Violate any applicable local, state, national, or
                  international law or regulation
                </li>
                <li>
                  Transmit any material that is unlawful, threatening, abusive,
                  defamatory, or otherwise objectionable
                </li>
                <li>
                  Attempt to gain unauthorized access to any part of the
                  Services, other accounts, or computer systems
                </li>
                <li>
                  Interfere with or disrupt the integrity or performance of the
                  Services or related systems
                </li>
                <li>
                  Use automated means (bots, scrapers, crawlers) to access the
                  Services without our express written permission
                </li>
                <li>
                  Reverse engineer, decompile, or disassemble any portion of the
                  Services
                </li>
                <li>
                  Resell, redistribute, or sublicense the Services without our
                  express written consent
                </li>
                <li>
                  Use safety binder data or risk assessments for purposes other
                  than your organization&apos;s legitimate trip management needs
                </li>
              </ul>
              <p>
                SafeTrekr reserves the right to investigate and take appropriate
                action against anyone who, in our sole discretion, violates this
                section, including removing content, suspending access, and
                reporting violations to law enforcement.
              </p>

              <hr />

              {/* 6. Intellectual Property */}
              <h2 id="section-6" className="scroll-mt-24">
                6. Intellectual Property
              </h2>
              <p>
                The Services, including all content, features, functionality,
                software, text, graphics, logos, icons, images, and the
                compilation thereof, are the exclusive property of SafeTrekr or
                its licensors and are protected by United States and
                international copyright, trademark, patent, trade secret, and
                other intellectual property laws.
              </p>
              <p>
                Subject to your compliance with these Terms, SafeTrekr grants
                you a limited, non-exclusive, non-transferable, revocable
                license to access and use the Services for your organization&apos;s
                internal trip management purposes. This license does not include
                the right to:
              </p>
              <ul>
                <li>
                  Modify, adapt, or create derivative works based on the
                  Services
                </li>
                <li>
                  Use the Services or any content for commercial purposes
                  outside of your subscription
                </li>
                <li>
                  Remove, alter, or obscure any copyright, trademark, or other
                  proprietary notices
                </li>
              </ul>
              <p>
                Safety binder content generated by the Services is licensed for
                use by the subscribing organization for the specific trips
                requested. You may share safety binder content with trip
                participants, chaperones, and relevant stakeholders within the
                scope of your trip management activities.
              </p>

              <hr />

              {/* 7. Payment Terms */}
              <h2 id="section-7" className="scroll-mt-24">
                7. Payment Terms
              </h2>
              <p>
                Access to certain features of the Services requires a paid
                subscription. By subscribing, you agree to the following payment
                terms:
              </p>
              <ul>
                <li>
                  <strong>Pricing</strong> -- current pricing is available on our{" "}
                  <Link href="/pricing">Pricing page</Link>. We reserve the
                  right to modify pricing with 30 days&apos; advance notice
                </li>
                <li>
                  <strong>Billing</strong> -- subscriptions are billed in advance
                  on an annual or per-binder basis, depending on your plan.
                  Payment is due upon invoice for institutional purchasers with
                  approved terms
                </li>
                <li>
                  <strong>Payment methods</strong> -- we accept credit cards,
                  ACH transfers, and purchase orders from qualifying
                  organizations. Payment processing is handled by Stripe, Inc.
                </li>
                <li>
                  <strong>Taxes</strong> -- prices are exclusive of applicable
                  taxes. You are responsible for all taxes associated with your
                  subscription
                </li>
                <li>
                  <strong>Refunds</strong> -- safety binder fees are
                  non-refundable once analyst review has begun. Annual
                  subscription fees may be refunded on a pro-rata basis within
                  the first 30 days if no binders have been generated
                </li>
              </ul>

              <hr />

              {/* 8. Data and Privacy */}
              <h2 id="section-8" className="scroll-mt-24">
                8. Data and Privacy
              </h2>
              <p>
                Your use of the Services is subject to our{" "}
                <Link href="/legal/privacy">Privacy Policy</Link>, which
                describes how we collect, use, and protect your information.
                Organizations that process personal data through SafeTrekr may
                enter into a{" "}
                <Link href="/legal/dpa">Data Processing Agreement</Link> as
                required by applicable data protection laws.
              </p>
              <p>
                You retain ownership of all data you submit to the Services.
                SafeTrekr will not access, use, or disclose your data except as
                necessary to provide the Services, comply with legal obligations,
                or as otherwise described in our Privacy Policy.
              </p>
              <p>
                SafeTrekr implements industry-standard security measures to
                protect your data, including encryption in transit and at rest,
                access controls, and regular security audits. For more
                information, visit our{" "}
                <Link href="/security">Security page</Link>.
              </p>

              <hr />

              {/* 9. Service Availability */}
              <h2 id="section-9" className="scroll-mt-24">
                9. Service Availability
              </h2>
              <p>
                SafeTrekr strives to maintain high availability of the Services.
                However, we do not guarantee uninterrupted or error-free
                operation. The Services may be temporarily unavailable due to:
              </p>
              <ul>
                <li>Scheduled maintenance (with advance notice when possible)</li>
                <li>System upgrades and improvements</li>
                <li>Force majeure events beyond our reasonable control</li>
                <li>
                  Third-party service disruptions (e.g., cloud hosting, data
                  providers)
                </li>
              </ul>
              <p>
                For enterprise customers with Service Level Agreement (SLA)
                requirements, please contact our sales team to discuss dedicated
                availability commitments.
              </p>

              <hr />

              {/* 10. Limitation of Liability */}
              <h2 id="section-10" className="scroll-mt-24">
                10. Limitation of Liability
              </h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SAFETREKR AND ITS
                OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT
                BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION LOSS OF
                PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES,
                RESULTING FROM:
              </p>
              <ol>
                <li>Your access to or use of (or inability to use) the Services</li>
                <li>
                  Any conduct or content of any third party on the Services
                </li>
                <li>
                  Unauthorized access, use, or alteration of your data or
                  transmissions
                </li>
                <li>
                  Any reliance on information or content provided through the
                  Services
                </li>
              </ol>
              <p>
                SafeTrekr provides safety information as a decision-support tool
                and does not guarantee the accuracy, completeness, or timeliness
                of risk assessments or safety recommendations. Organizations
                retain sole responsibility for their travel safety decisions and
                duty-of-care obligations.
              </p>
              <p>
                IN NO EVENT SHALL SAFETREKR&apos;S TOTAL LIABILITY TO YOU FOR ALL
                CLAIMS EXCEED THE AMOUNT PAID BY YOU TO SAFETREKR DURING THE
                TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY.
              </p>

              <hr />

              {/* 11. Indemnification */}
              <h2 id="section-11" className="scroll-mt-24">
                11. Indemnification
              </h2>
              <p>
                You agree to indemnify, defend, and hold harmless SafeTrekr and
                its officers, directors, employees, agents, and affiliates from
                and against any claims, liabilities, damages, losses, costs, and
                expenses (including reasonable attorneys&apos; fees) arising out
                of or relating to:
              </p>
              <ul>
                <li>Your use of the Services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>
                  Your organization&apos;s failure to comply with applicable data
                  protection or privacy laws
                </li>
              </ul>

              <hr />

              {/* 12. Termination */}
              <h2 id="section-12" className="scroll-mt-24">
                12. Termination
              </h2>
              <p>
                Either party may terminate these Terms at any time by providing
                written notice to the other party. Upon termination:
              </p>
              <ul>
                <li>
                  Your right to access and use the Services will immediately
                  cease
                </li>
                <li>
                  SafeTrekr will retain your data for 90 days to allow for data
                  export, after which it will be securely deleted unless a longer
                  retention period is required by law
                </li>
                <li>
                  Any fees owed prior to termination remain payable
                </li>
                <li>
                  Provisions that by their nature should survive termination
                  (including intellectual property, limitation of liability, and
                  indemnification) will continue in full force
                </li>
              </ul>
              <p>
                SafeTrekr reserves the right to suspend or terminate your access
                immediately if you violate these Terms, engage in fraudulent
                activity, or if required by law.
              </p>

              <hr />

              {/* 13. Governing Law */}
              <h2 id="section-13" className="scroll-mt-24">
                13. Governing Law and Dispute Resolution
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with
                the laws of the State of Texas, United States, without regard to
                its conflict of law provisions.
              </p>
              <p>
                Any dispute arising out of or relating to these Terms or the
                Services shall first be addressed through good-faith
                negotiation. If the dispute cannot be resolved within 30 days,
                either party may pursue binding arbitration administered by the
                American Arbitration Association (AAA) under its Commercial
                Arbitration Rules, with arbitration to be conducted in Austin,
                Texas.
              </p>
              <p>
                Nothing in this section prevents either party from seeking
                injunctive or other equitable relief in a court of competent
                jurisdiction to prevent irreparable harm.
              </p>

              <hr />

              {/* 14. Contact Information */}
              <h2 id="section-14" className="scroll-mt-24">
                14. Contact Information
              </h2>
              <p>
                If you have questions about these Terms of Service, please
                contact us:
              </p>
              <ul>
                <li>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:legal@safetrekr.com">legal@safetrekr.com</a>
                </li>
                <li>
                  <strong>Mail:</strong> SafeTrekr, Inc., Attn: Legal Department,
                  123 Main Street, Suite 400, Austin, TX 78701
                </li>
              </ul>
              <p>
                For procurement and institutional purchasing questions, please
                visit our <Link href="/procurement">Procurement page</Link> or
                contact{" "}
                <a href="mailto:procurement@safetrekr.com">
                  procurement@safetrekr.com
                </a>
                .
              </p>
            </article>

            {/* ── Desktop TOC Sidebar ── */}
            <LegalTocDesktop items={TOC_ITEMS} />
          </div>
        </Container>
      </SectionContainer>

      {/* ── Legal Contact Section ── */}
      <SectionContainer
        as="section"
        variant="card"
        className="py-10 sm:py-12 lg:py-16"
        ariaLabelledBy="legal-contact-heading"
      >
        <div className="mx-auto max-w-[720px] px-6 sm:px-8">
          <h2
            id="legal-contact-heading"
            className="text-heading-sm mb-3 text-[var(--color-foreground)]"
          >
            Questions about these terms?
          </h2>
          <p className="text-body-md mb-2 text-[var(--color-muted-foreground)]">
            Contact our legal team at{" "}
            <a
              href="mailto:legal@safetrekr.com"
              className="text-[var(--color-primary-700)] underline underline-offset-2"
            >
              legal@safetrekr.com
            </a>{" "}
            or write to us at SafeTrekr, Inc., 123 Main Street, Suite 400,
            Austin, TX 78701.
          </p>
        </div>
      </SectionContainer>
    </>
  );
}
