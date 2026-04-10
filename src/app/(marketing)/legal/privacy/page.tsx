/**
 * ST-863: Privacy Policy Page (/legal/privacy)
 *
 * Full legal privacy policy with 12 sections of real content, sticky TOC
 * sidebar on desktop, and collapsible TOC on mobile. Content mirrors the
 * HTML mockup at designs/html/mockup-legal.html.
 *
 * Layout: 720px article + 260px sticky sidebar on a 1280px container.
 *
 * @see designs/html/mockup-legal.html
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
  title: "Privacy Policy",
  description:
    "Read SafeTrekr's Privacy Policy. Learn how we collect, use, and protect your information. Last updated March 15, 2026.",
  path: "/legal/privacy",
});

// ---------------------------------------------------------------------------
// TOC Data
// ---------------------------------------------------------------------------

const TOC_ITEMS: TocItem[] = [
  { id: "section-1", label: "1. Introduction" },
  { id: "section-2", label: "2. Information We Collect" },
  { id: "section-2-1", label: "2.1 Information You Provide", isChild: true },
  { id: "section-2-2", label: "2.2 Collected Automatically", isChild: true },
  { id: "section-2-3", label: "2.3 From Third Parties", isChild: true },
  { id: "section-3", label: "3. How We Use Information" },
  { id: "section-4", label: "4. Legal Basis (GDPR)" },
  { id: "section-5", label: "5. Sharing and Disclosure" },
  { id: "section-6", label: "6. Data Retention" },
  { id: "section-7", label: "7. Your Rights and Choices" },
  { id: "section-7-1", label: "7.1 Access and Portability", isChild: true },
  { id: "section-7-2", label: "7.2 Correction and Deletion", isChild: true },
  { id: "section-7-3", label: "7.3 Opt-Out", isChild: true },
  { id: "section-8", label: "8. Children's Privacy" },
  { id: "section-9", label: "9. International Transfers" },
  { id: "section-10", label: "10. Security Measures" },
  { id: "section-11", label: "11. Changes to This Policy" },
  { id: "section-12", label: "12. Contact Us" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* ST-904/ST-905: BreadcrumbList JSON-LD for privacy policy */}
      <BreadcrumbJsonLd path="/legal/privacy" currentPageTitle="Privacy Policy" />

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
                Privacy Policy
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
            Privacy Policy
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
            <span
              className="hidden text-[var(--color-border)] sm:inline"
              aria-hidden="true"
            >
              &middot;
            </span>
            <a
              href="/documents/pdf/SafeTrekr-Privacy-Policy-v2.1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[var(--color-primary-700)] transition-colors hover:text-[var(--color-primary-800)]"
            >
              Download PDF
            </a>
          </div>
        </Container>
      </SectionContainer>

      {/* ── Document Body + TOC Sidebar ── */}
      <SectionContainer
        as="section"
        className="pb-16 pt-0 lg:pb-24"
        aria-label="Privacy Policy document"
      >
        <Container>
          {/* Mobile TOC -- renders above article on small screens */}
          <LegalTocMobile items={TOC_ITEMS} />

          <div className="grid lg:grid-cols-[1fr_260px] gap-12 lg:gap-16">
            {/* ── Article Column ── */}
            <article className="legal-prose max-w-[720px]">
              {/* 1. Introduction */}
              <h2 id="section-1" className="scroll-mt-24">
                1. Introduction
              </h2>
              <p>
                This Privacy Policy describes how SafeTrekr, Inc.
                (&ldquo;SafeTrekr,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo;
                or &ldquo;our&rdquo;) collects, uses, stores, and shares
                information when you use our website, mobile applications, and
                related services (collectively, the &ldquo;Services&rdquo;).
              </p>
              <p>
                SafeTrekr provides trip safety management tools, including
                analyst-reviewed safety binders, route risk assessments, and
                compliance documentation for schools, churches, universities,
                and businesses. This policy applies to all users of the
                Services, including trip coordinators, administrators, and
                organizational account holders.
              </p>
              <p>
                By accessing or using our Services, you acknowledge that you
                have read and understood this Privacy Policy. If you do not agree
                with our practices, please do not use the Services.
              </p>

              <hr />

              {/* 2. Information We Collect */}
              <h2 id="section-2" className="scroll-mt-24">
                2. Information We Collect
              </h2>
              <p>
                We collect information in several ways depending on how you
                interact with our Services. The categories below outline the
                types of data we may collect.
              </p>

              <h3 id="section-2-1" className="scroll-mt-24">
                2.1 Information You Provide
              </h3>
              <p>
                When you create an account, request a demo, or use our Services,
                you may voluntarily provide the following information:
              </p>
              <ul>
                <li>
                  <strong>Account information</strong> -- name, email address,
                  phone number, job title, and organization name
                </li>
                <li>
                  <strong>Trip details</strong> -- destination addresses, travel
                  dates, group size, participant age ranges, and special
                  requirements
                </li>
                <li>
                  <strong>Organizational data</strong> -- school district name,
                  church denomination, or company details relevant to compliance
                  requirements
                </li>
                <li>
                  <strong>Payment information</strong> -- billing address and
                  payment method details (processed by our third-party payment
                  processor; we do not store full card numbers)
                </li>
                <li>
                  <strong>Communications</strong> -- messages you send to our
                  support team, feedback, and survey responses
                </li>
              </ul>

              <h3 id="section-2-2" className="scroll-mt-24">
                2.2 Information Collected Automatically
              </h3>
              <p>
                When you use our Services, we automatically collect certain
                technical and usage information:
              </p>
              <ul>
                <li>
                  <strong>Device information</strong> -- browser type, operating
                  system, device identifiers, and screen resolution
                </li>
                <li>
                  <strong>Log data</strong> -- IP address, access times, pages
                  viewed, referring URL, and actions taken within the Services
                </li>
                <li>
                  <strong>Location data</strong> -- approximate location derived
                  from IP address (we do not collect precise GPS location from
                  your device)
                </li>
                <li>
                  <strong>Cookies and similar technologies</strong> -- as
                  described in our Cookie Policy
                </li>
              </ul>

              <h3 id="section-2-3" className="scroll-mt-24">
                2.3 Information from Third Parties
              </h3>
              <p>
                We may receive information from third-party sources, including:
              </p>
              <ul>
                <li>
                  <strong>Government safety databases</strong> -- publicly
                  available travel advisories, safety alerts, and risk
                  assessments used to generate safety binders
                </li>
                <li>
                  <strong>Authentication providers</strong> -- if you sign in
                  using a third-party service (e.g., Google Workspace, Microsoft
                  Entra ID), we receive basic profile information as authorized
                  by you
                </li>
                <li>
                  <strong>Analytics providers</strong> -- aggregated and
                  anonymized usage data to help us improve the Services
                </li>
              </ul>

              <hr />

              {/* 3. How We Use Your Information */}
              <h2 id="section-3" className="scroll-mt-24">
                3. How We Use Your Information
              </h2>
              <p>
                We use the information we collect for the following purposes:
              </p>
              <ul>
                <li>
                  <strong>Providing the Services</strong> -- generating safety
                  binders, route risk assessments, and compliance documentation
                  for your trips
                </li>
                <li>
                  <strong>Account management</strong> -- creating and maintaining
                  your account, authenticating your identity, and managing
                  organizational permissions
                </li>
                <li>
                  <strong>Communication</strong> -- sending service-related
                  notifications, responding to support requests, and providing
                  updates about your account or trips
                </li>
                <li>
                  <strong>Safety analysis</strong> -- aggregating and anonymizing
                  trip data to improve our risk assessment models and safety
                  recommendations
                </li>
                <li>
                  <strong>Compliance</strong> -- meeting legal obligations,
                  including responding to lawful requests from government
                  authorities
                </li>
                <li>
                  <strong>Service improvement</strong> -- analyzing usage
                  patterns to enhance functionality, fix bugs, and develop new
                  features
                </li>
                <li>
                  <strong>Security</strong> -- detecting and preventing fraud,
                  unauthorized access, and other harmful activities
                </li>
              </ul>
              <p>
                We do not sell your personal information. We do not use your data
                for behavioral advertising or profiling unrelated to the
                Services.
              </p>

              <hr />

              {/* 4. Legal Basis for Processing */}
              <h2 id="section-4" className="scroll-mt-24">
                4. Legal Basis for Processing
              </h2>
              <p>
                For users in the European Economic Area (EEA), United Kingdom,
                and other jurisdictions that require a legal basis for processing
                personal data, we rely on the following grounds:
              </p>
              <ul>
                <li>
                  <strong>Contract performance</strong> -- processing necessary
                  to provide the Services you have requested under our{" "}
                  <Link href="/legal/terms">Terms of Service</Link>
                </li>
                <li>
                  <strong>Legitimate interests</strong> -- processing for
                  purposes such as improving our Services, ensuring security, and
                  communicating with you, where these interests are not
                  overridden by your rights
                </li>
                <li>
                  <strong>Legal obligation</strong> -- processing required to
                  comply with applicable laws and regulations
                </li>
                <li>
                  <strong>Consent</strong> -- where required by law, we will
                  obtain your explicit consent before processing certain data
                  (e.g., optional marketing communications)
                </li>
              </ul>
              <p>
                You may withdraw consent at any time by contacting us at{" "}
                <a href="mailto:legal@safetrekr.com">legal@safetrekr.com</a>.
                Withdrawal does not affect the lawfulness of processing
                conducted prior to withdrawal.
              </p>

              <hr />

              {/* 5. Information Sharing and Disclosure */}
              <h2 id="section-5" className="scroll-mt-24">
                5. Information Sharing and Disclosure
              </h2>
              <p>
                We share your information only in the following circumstances:
              </p>
              <ul>
                <li>
                  <strong>With your organization</strong> -- if you use SafeTrekr
                  through an organizational account (e.g., school district or
                  church), your administrator may have access to account activity
                  and trip data in accordance with our{" "}
                  <Link href="/legal/dpa">Data Processing Agreement</Link>
                </li>
                <li>
                  <strong>Service providers</strong> -- we share data with
                  trusted third-party vendors who assist in operating our
                  Services, including cloud hosting (Amazon Web Services),
                  payment processing (Stripe), email delivery (SendGrid), and
                  analytics. These providers are contractually obligated to
                  protect your data and use it only for the purposes we specify
                </li>
                <li>
                  <strong>Legal requirements</strong> -- we may disclose
                  information if required by law, regulation, legal process, or
                  governmental request
                </li>
                <li>
                  <strong>Safety and security</strong> -- we may share
                  information to protect the rights, safety, or property of
                  SafeTrekr, our users, or the public
                </li>
                <li>
                  <strong>Business transfers</strong> -- in the event of a
                  merger, acquisition, or sale of assets, your information may be
                  transferred as part of that transaction. We will notify you of
                  any such change
                </li>
              </ul>
              <p>
                We do not share personal information with third parties for their
                own marketing purposes.
              </p>

              <hr />

              {/* 6. Data Retention */}
              <h2 id="section-6" className="scroll-mt-24">
                6. Data Retention
              </h2>
              <p>
                We retain your personal information for as long as necessary to
                provide the Services and fulfill the purposes described in this
                Privacy Policy, unless a longer retention period is required or
                permitted by law.
              </p>
              <ul>
                <li>
                  <strong>Active accounts</strong> -- account data is retained
                  for the duration of your subscription and for 90 days after
                  account closure to allow for reactivation
                </li>
                <li>
                  <strong>Trip data</strong> -- safety binders, route
                  assessments, and trip records are retained for 3 years after
                  the trip date to support compliance documentation needs
                </li>
                <li>
                  <strong>Communications</strong> -- support correspondence is
                  retained for 2 years
                </li>
                <li>
                  <strong>Anonymized data</strong> -- aggregated, de-identified
                  data may be retained indefinitely for research and service
                  improvement purposes
                </li>
              </ul>
              <p>
                You may request deletion of your data at any time by contacting
                us. See Section 7 for details about your rights.
              </p>

              <hr />

              {/* 7. Your Rights and Choices */}
              <h2 id="section-7" className="scroll-mt-24">
                7. Your Rights and Choices
              </h2>
              <p>
                Depending on your jurisdiction, you may have certain rights
                regarding your personal information.
              </p>

              <h3 id="section-7-1" className="scroll-mt-24">
                7.1 Access and Portability
              </h3>
              <p>
                You have the right to request a copy of the personal information
                we hold about you. We will provide this information in a
                structured, commonly used, machine-readable format (e.g., CSV or
                JSON) within 30 days of a verified request.
              </p>

              <h3 id="section-7-2" className="scroll-mt-24">
                7.2 Correction and Deletion
              </h3>
              <p>
                You may request that we correct inaccurate information or delete
                your personal data. We will comply with deletion requests unless
                we are required to retain the data for legal or compliance
                purposes. You can update most account information directly
                through your account settings.
              </p>

              <h3 id="section-7-3" className="scroll-mt-24">
                7.3 Opt-Out
              </h3>
              <p>
                You may opt out of receiving non-essential communications (e.g.,
                product announcements, newsletters) at any time by clicking the
                &ldquo;unsubscribe&rdquo; link in any email or by updating your
                notification preferences in your account settings.
                Service-related communications (e.g., security alerts, billing
                notices) cannot be opted out of while your account is active.
              </p>
              <p>
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:legal@safetrekr.com">legal@safetrekr.com</a>.
                We will verify your identity before processing your request.
              </p>

              <hr />

              {/* 8. Children's Privacy */}
              <h2 id="section-8" className="scroll-mt-24">
                8. Children&apos;s Privacy
              </h2>
              <p>
                SafeTrekr&apos;s Services are designed for use by organizations
                and adult trip coordinators. We do not knowingly collect personal
                information directly from children under the age of 13 (or the
                applicable age of consent in your jurisdiction).
              </p>
              <p>
                When organizations use SafeTrekr to manage trips involving
                minors, the organization -- not SafeTrekr -- acts as the data
                controller for any student or minor data. SafeTrekr processes
                this data solely on behalf of the organization in accordance
                with our <Link href="/legal/dpa">Data Processing Agreement</Link>{" "}
                and applicable regulations including FERPA and COPPA.
              </p>
              <blockquote>
                SafeTrekr minimizes the collection of student data. Safety
                binders and route assessments do not require individual student
                names or personal identifiers. Organizations should only provide
                the minimum data necessary for trip management.
              </blockquote>
              <p>
                If we learn that we have inadvertently collected personal
                information from a child without appropriate authorization, we
                will take steps to delete that information promptly. If you
                believe a child&apos;s information has been provided to us
                inappropriately, please contact{" "}
                <a href="mailto:legal@safetrekr.com">legal@safetrekr.com</a>.
              </p>

              <hr />

              {/* 9. International Data Transfers */}
              <h2 id="section-9" className="scroll-mt-24">
                9. International Data Transfers
              </h2>
              <p>
                SafeTrekr is based in the United States, and your information is
                processed and stored on servers located in the United States and
                other countries where our service providers operate.
              </p>
              <p>
                If you are located outside of the United States, please be aware
                that your information will be transferred to, stored, and
                processed in the United States, where data protection laws may
                differ from those in your country.
              </p>
              <p>
                For transfers of personal data from the EEA, UK, or Switzerland,
                we rely on:
              </p>
              <ul>
                <li>
                  <strong>Standard Contractual Clauses (SCCs)</strong> --
                  approved by the European Commission, incorporated into our{" "}
                  <Link href="/legal/dpa">Data Processing Agreement</Link>
                </li>
                <li>
                  <strong>Adequacy decisions</strong> -- where the European
                  Commission has determined that the receiving country provides
                  adequate data protection
                </li>
                <li>
                  <strong>Supplementary measures</strong> -- additional technical
                  and organizational safeguards, including encryption in transit
                  and at rest
                </li>
              </ul>

              <hr />

              {/* 10. Security Measures */}
              <h2 id="section-10" className="scroll-mt-24">
                10. Security Measures
              </h2>
              <p>
                We take the security of your information seriously and implement
                appropriate technical and organizational measures to protect it,
                including:
              </p>
              <ul>
                <li>
                  Encryption of data in transit using TLS 1.2+ and at rest using{" "}
                  <code>AES-256</code>
                </li>
                <li>
                  Access controls with role-based permissions and multi-factor
                  authentication for internal systems
                </li>
                <li>
                  Regular security assessments, penetration testing, and
                  vulnerability scanning
                </li>
                <li>
                  Employee security training and confidentiality agreements
                </li>
                <li>
                  Incident response procedures with notification protocols as
                  required by law
                </li>
                <li>Data backup and disaster recovery procedures</li>
              </ul>
              <p>
                While we strive to protect your personal information, no method
                of transmission over the internet or electronic storage is
                completely secure. We cannot guarantee absolute security, but we
                commit to promptly addressing any security incidents.
              </p>
              <p>
                For more information about our security practices, visit our{" "}
                <Link href="/security">Security page</Link>.
              </p>

              <hr />

              {/* 11. Changes to This Policy */}
              <h2 id="section-11" className="scroll-mt-24">
                11. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices, technology, legal requirements, or
                other factors. When we make changes:
              </p>
              <ul>
                <li>
                  We will update the &ldquo;Last updated&rdquo; date at the top
                  of this page
                </li>
                <li>
                  For material changes, we will provide prominent notice through
                  the Services or by email to the address associated with your
                  account
                </li>
                <li>
                  We will increment the version number to help you track changes
                </li>
              </ul>
              <p>
                We encourage you to review this Privacy Policy periodically.
                Your continued use of the Services after any changes constitutes
                acceptance of the updated policy.
              </p>

              <hr />

              {/* 12. Contact Us */}
              <h2 id="section-12" className="scroll-mt-24">
                12. Contact Us
              </h2>
              <p>
                If you have questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us:
              </p>
              <ul>
                <li>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:legal@safetrekr.com">legal@safetrekr.com</a>
                </li>
                <li>
                  <strong>Mail:</strong> SafeTrekr, Inc., Attn: Privacy Team, 123
                  Main Street, Suite 400, Austin, TX 78701
                </li>
              </ul>
              <p>
                For data protection inquiries in the European Union, you may also
                contact our Data Protection Officer at{" "}
                <a href="mailto:dpo@safetrekr.com">dpo@safetrekr.com</a>.
              </p>
              <p>
                We will respond to all privacy-related inquiries within 30 days.
                If you are not satisfied with our response, you have the right to
                lodge a complaint with your local data protection authority.
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
            Questions about this policy?
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
          <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
            For data protection inquiries in the EU, contact our Data
            Protection Officer at{" "}
            <a
              href="mailto:dpo@safetrekr.com"
              className="text-[var(--color-primary-700)] underline underline-offset-2"
            >
              dpo@safetrekr.com
            </a>
            .
          </p>
        </div>
      </SectionContainer>
    </>
  );
}
