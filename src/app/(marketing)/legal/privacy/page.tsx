/**
 * Privacy Notice Page (/legal/privacy)
 *
 * Full legal privacy notice with 14 sections of real content, sticky TOC
 * sidebar on desktop, and collapsible TOC on mobile. Content mirrors the
 * official Safetrekr Privacy Notice v2.1 (Effective March 7, 2026).
 *
 * Layout: 720px article + 260px sticky sidebar on a 1280px container.
 *
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
  title: "Privacy Notice",
  description:
    "Read Safetrekr's Privacy Notice. Learn how we collect, use, and protect your personal information. Effective March 7, 2026, Version 2.1.",
  path: "/legal/privacy",
});

// ---------------------------------------------------------------------------
// TOC Data
// ---------------------------------------------------------------------------

const TOC_ITEMS: TocItem[] = [
  { id: "section-1", label: "1. Personal Information We Collect" },
  { id: "section-2", label: "2. How We Use Personal Information" },
  { id: "section-3", label: "3. Lawful Basis for Processing" },
  { id: "section-4", label: "4. Cookies and Tracking Technologies" },
  { id: "section-5", label: "5. How and When We Disclose Personal Information" },
  { id: "section-6", label: "6. Security & Transfer" },
  { id: "section-7", label: "7. Retention" },
  { id: "section-8", label: "8. Your Choices & Rights" },
  { id: "section-9", label: "9. Children's Privacy" },
  { id: "section-10", label: "10. California Privacy Notice" },
  { id: "section-10-1", label: "10.1 Personal Information We Collect", isChild: true },
  { id: "section-10-2", label: "10.2 Sales and Sharing", isChild: true },
  { id: "section-10-3", label: "10.3 Your California Privacy Rights", isChild: true },
  { id: "section-11", label: "11. Changes to this Privacy Notice" },
  { id: "section-12", label: "12. Contact Us" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PrivacyNoticePage() {
  return (
    <>
      {/* BreadcrumbList JSON-LD for privacy notice */}
      <BreadcrumbJsonLd
        path="/legal/privacy"
        currentPageTitle="Privacy Notice"
      />

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
                <span className="transition-colors duration-150">Legal</span>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="mx-1 h-3.5 w-3.5" />
              </li>
              <li
                aria-current="page"
                className="font-medium text-[var(--color-foreground)]"
              >
                Privacy Notice
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
            Privacy Notice
          </h1>

          {/* Metadata Card */}
          <div className="flex flex-col gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <span className="text-sm text-[var(--color-muted-foreground)]">
              Last updated:{" "}
              <time dateTime="2026-03-07">March 7, 2026</time>
            </span>
            <span
              className="hidden text-[var(--color-border)] sm:inline"
              aria-hidden="true"
            >
              &middot;
            </span>
            <span className="text-sm text-[var(--color-muted-foreground)]">
              Version: 2.1
            </span>
            <span
              className="hidden text-[var(--color-border)] sm:inline"
              aria-hidden="true"
            >
              &middot;
            </span>
            <span className="text-sm text-[var(--color-muted-foreground)]">
              Effective:{" "}
              <time dateTime="2026-03-07">March 7, 2026</time>
            </span>
          </div>
        </Container>
      </SectionContainer>

      {/* ── Document Body + TOC Sidebar ── */}
      <SectionContainer
        as="section"
        className="pb-16 pt-0 lg:pb-24"
        aria-label="Privacy Notice document"
      >
        <Container>
          {/* Mobile TOC -- renders above article on small screens */}
          <LegalTocMobile items={TOC_ITEMS} />

          <div className="grid lg:grid-cols-[1fr_260px] gap-12 lg:gap-16">
            {/* ── Article Column ── */}
            <article className="legal-prose max-w-[720px]">
              {/* Preamble */}
              <p>
                Overwatch Consulting LLC DBA Safetrekr
                (&ldquo;Safetrekr,&rdquo; &ldquo;we,&rdquo;
                &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to
                protecting your personal information. This Privacy Notice
                describes the personal information that we collect about you,
                how we use and disclose personal information, and the steps we
                take to protect personal information. For purposes of this
                Privacy Notice, &ldquo;personal information&rdquo; means any
                information that relates to you as an individual and could
                reasonably be used to identify you. This Privacy Notice applies
                to our collection and use of personal information through this
                website and any related websites, our mobile application,
                products, services, tools, or platforms (the
                &ldquo;Services&rdquo;), as well as through any other means
                where a link or reference to this Privacy Notice is provided at
                the time of collection.
              </p>
              <p>
                This Privacy Notice covers the collection, use, and disclosure
                of personal information related to our customers. If you are a
                California customer, please see our California Privacy Notice
                for more information about our privacy practices and your
                rights under the California Consumer Privacy Act
                (&ldquo;CCPA&rdquo;).
              </p>

              <hr />

              {/* 1. Personal Information We Collect */}
              <h2 id="section-1" className="scroll-mt-24">
                1. Personal Information We Collect
              </h2>
              <p>
                When you access or use the Services, or otherwise interact with
                us, we may collect certain personal information about you from
                a variety of sources.
              </p>
              <p>
                Categories of personal information that we may collect directly
                include:
              </p>
              <ul>
                <li>
                  <strong>Basic personal information.</strong> We collect the
                  names of individuals who use our Services.
                </li>
                <li>
                  <strong>Contact information.</strong> We collect phone numbers
                  and email addresses from individuals who use our Services.
                </li>
                <li>
                  <strong>Account information.</strong> We collect email
                  addresses and passwords from users who sign up for an
                  account.
                </li>
                <li>
                  <strong>Communications.</strong> We collect the contents of
                  communications that you share with us in connection with
                  customer support requests, questions submitted through our
                  Services, and requests for information.
                </li>
              </ul>
              <p>
                Categories of personal information that we may collect
                automatically from users of our Services include:
              </p>
              <ul>
                <li>
                  <strong>Technical information</strong> (for example, browser
                  and device type, IP address, and operating system version)
                </li>
                <li>
                  <strong>Usage information</strong> (for example, pages
                  visited, search terms entered, and frequency of visits)
                </li>
              </ul>
              <p>
                Finally, we may collect personal information pursuant to a
                legal or contractual requirement.
              </p>

              <hr />

              {/* 2. How We Use Personal Information */}
              <h2 id="section-2" className="scroll-mt-24">
                2. How We Use Personal Information
              </h2>
              <p>
                We may use the personal information we collect for the
                following purposes:
              </p>
              <ul>
                <li>
                  <strong>Provide the Services.</strong> We use your personal
                  information to enable you to interact with the Services.
                </li>
                <li>
                  <strong>Communication.</strong> We may use your personal
                  information to communicate with you about the Services and
                  respond to your questions.
                </li>
                <li>
                  <strong>
                    Comply with the law and exercise our rights.
                  </strong>{" "}
                  We may use your personal information as reasonably necessary
                  to assess and ensure compliance with applicable laws, legal
                  requirements, and company policies; to protect our assets or
                  to investigate or defend against any claims of illegality or
                  wrongdoing (including to obtain legal advice or to establish,
                  exercise or defend legal rights); and in response to a court
                  order or judicial or other government subpoena or warrant.
                </li>
                <li>
                  <strong>Corporate transaction.</strong> We may use your
                  personal information in the event we undertake or are
                  involved in or contemplating any merger, acquisition,
                  reorganization, sale of assets, bankruptcy, or insolvency
                  event.
                </li>
                <li>
                  <strong>Manage our Services.</strong> We may use personal
                  information to analyze how people use our Services and to
                  improve our Service offerings.
                </li>
              </ul>
              <p>
                We may also aggregate, anonymize, or otherwise de-identify
                your personal information and use it for any purpose permitted
                by applicable law. When we collect, use, or disclose
                aggregated or deidentified information, we commit not to
                reidentify the information.
              </p>

              <hr />

              {/* 3. Lawful Basis for Processing */}
              <h2 id="section-3" className="scroll-mt-24">
                3. Lawful Basis for Processing
              </h2>
              <p>
                Some jurisdictions require that we determine a &ldquo;lawful
                basis&rdquo; for processing personal information. Where such
                requirements exist, we rely on the following lawful bases for
                our processing activities: that you have consented to the
                processing; that the processing is necessary for the
                performance of our contract with you; that we have a legal
                obligation; or that we have a legitimate interest in providing
                and improving the Services and managing our business
                operations. To the extent we process personal information on
                behalf a customer, we rely on the lawful basis as determined
                by that customer.
              </p>

              <hr />

              {/* 4. Cookies and Other Tracking Technologies */}
              <h2 id="section-4" className="scroll-mt-24">
                4. Cookies and Other Tracking Technologies
              </h2>
              <p>
                We and our vendors may use a variety of tracking technologies,
                including cookies, beacons, pixels, SDKs, and APIs that
                collect certain information when you interact with the
                Services. Depending on your device and browser settings, these
                tracking technologies may collect your IP address, device
                identifiers, user preferences, approximate geolocation, the
                pages you click on, and the website you visited immediately
                beforehand. Additionally, these technologies may collect
                details about how you interact with the Services.
              </p>
              <p>
                We may use these technologies for various purposes, including
                to provide functionality to the Services, help us route
                traffic between servers, understand how the Services are
                performing and used, improve features and content on the
                Services, and for advertising purposes. We may combine certain
                information collected through tracking technologies with other
                information we obtain about you, which may include information
                we obtain from our vendors. We or other parties may collect
                personal information about your online activities over time
                when you use the Services.
              </p>

              <hr />

              {/* 5. How and When We Disclose Personal Information */}
              <h2 id="section-5" className="scroll-mt-24">
                5. How and When We Disclose Personal Information
              </h2>
              <p>
                We may disclose your personal information to the following
                categories of recipients for our operational and business
                purposes:
              </p>
              <ul>
                <li>
                  <strong>Group companies and affiliates.</strong> We may
                  disclose, share, or transfer your personal information to
                  any business entity that is part of our corporate family.
                </li>
                <li>
                  <strong>
                    Service providers and professional advisors.
                  </strong>{" "}
                  We may disclose your personal information to our vendors,
                  service providers, and contractors who provide services in
                  support of our business operations. We may also disclose
                  your personal information to our professional advisors such
                  as our attorneys, accountants, and insurance providers. We
                  instruct our service providers to comply with all applicable
                  privacy laws.
                </li>
                <li>
                  <strong>
                    Parties involved in a corporate transaction.
                  </strong>{" "}
                  We may disclose your personal information to relevant third
                  parties in the event of a divestiture, merger,
                  consolidation, or asset sale, or in the unlikely event of a
                  bankruptcy.
                </li>
                <li>
                  <strong>
                    Law enforcement or other governmental entities.
                  </strong>{" "}
                  We may disclose your personal information if required to do
                  so by law or if we believe in good faith that such action is
                  necessary to comply with the law, prevent unlawful activity,
                  defend our rights, or maintain security.
                </li>
                <li>
                  <strong>Other parties with your consent.</strong> We may
                  disclose your information to any other party where you have
                  provided consent to such disclosure.
                </li>
              </ul>

              <hr />

              {/* 6. Security & Transfer of Personal Information */}
              <h2 id="section-6" className="scroll-mt-24">
                6. Security &amp; Transfer of Personal Information
              </h2>
              <p>
                We have implemented and maintain commercially reasonable and
                appropriate technical and organizational measures designed to
                protect the confidentiality, integrity, and security of your
                personal information. Please note, however, that no security
                measures are perfect or impenetrable. We therefore cannot
                guarantee and do not warrant the absolute security of your
                personal information. You may contact us using the contact
                information provided below to learn more about the appropriate
                safeguards that apply to your personal information.
              </p>

              <hr />

              {/* 7. Retention */}
              <h2 id="section-7" className="scroll-mt-24">
                7. Retention
              </h2>
              <p>
                We retain your personal information for as long as reasonably
                necessary to fulfill the purposes for which we collected it or
                to comply with the law, prevent fraud, facilitate an
                investigation, defend against legal claims, exercise our legal
                rights and for other legitimate and lawful business purposes.
                Because these needs can vary for different categories of
                personal information, actual retention periods can vary
                significantly based on criteria such as whether your personal
                information is reasonably necessary to manage our operations,
                to manage your relationship with us, or to satisfy another
                purpose for which we collected the information; whether your
                personal information is reasonably necessary to carry out a
                disclosed purpose that is reasonably compatible with the
                context in which we collected the information; whether the
                personal information is reasonably required to protect or
                defend our rights or property; or whether we are otherwise
                required or permitted to keep your personal information by
                applicable laws or regulations. Where personal information is
                used for more than one purpose, we may retain it until the
                purpose with the latest period expires.
              </p>

              <hr />

              {/* 8. Your Choices & Rights */}
              <h2 id="section-8" className="scroll-mt-24">
                8. Your Choices &amp; Rights
              </h2>
              <p>
                You may decline to share certain information with us, in which
                case we may not be able to provide you with some of the
                features and functionality of the Services. Once you have
                registered for an account with us, you may update or correct
                your profile information and preferences at any time by
                accessing your account preferences page through the Services.
                We may retain certain information you submit for a variety of
                purposes, including backups and archiving, prevention of fraud
                and abuse, and analytics.
              </p>
              <p>
                Depending on your location and subject to local law, you may
                have certain rights with respect to your personal information.
                These may include: the right to access, correct, and delete
                your personal information; the right to restrict or object to
                our use of your personal information; and the right to receive
                a portable copy of your personal information in a usable
                format. Where legally required, if you provide us with consent
                to use your personal information you may withdraw that consent
                at any time, however, such withdrawal will not impact the
                lawfulness of our use of your personal information based on
                your consent up to that point.
              </p>
              <p>
                To make a request related to your personal information or
                otherwise exercise your rights, you may contact us. In order
                to fulfill your request, we may require additional information
                from you. We will respond to requests within the relevant time
                periods established by applicable law. We are committed to
                finding a fair and reasonable resolution to any request,
                concern, or complaint you bring to our attention. However, if
                you are unsatisfied with our response to your request, you may
                have the right to lodge a complaint with applicable
                governmental authorities, subject to local law.
              </p>

              <hr />

              {/* 9. Children's Privacy */}
              <h2 id="section-9" className="scroll-mt-24">
                9. Children&apos;s Privacy
              </h2>
              <p>
                We do not knowingly collect or maintain information from
                persons under 13 years of age (&ldquo;children&rdquo;), and
                no part of the Services is directed to children. If we learn
                that information has been collected through the Services from
                children we will take the appropriate steps to delete this
                information. If you are a parent or guardian and discover that
                your child has provided us with personal information without
                your consent, please contact us using the contact information
                below to request that we delete the information from our
                systems.
              </p>

              <hr />

              {/* 10. California Privacy Notice */}
              <h2 id="section-10" className="scroll-mt-24">
                10. California Privacy Notice
              </h2>
              <p>
                This section supplements the other parts of our Privacy Notice
                and provides additional information for California business
                contacts pursuant to the California Consumer Privacy Act
                (&ldquo;CCPA&rdquo;).
              </p>

              {/* 10.1 Personal Information We Collect */}
              <h3 id="section-10-1" className="scroll-mt-24">
                10.1 Personal Information We Collect
              </h3>
              <p>
                We may collect the personal information listed below for the
                identified business purposes. Note that the specific personal
                information we collect about you may vary depending on the
                nature of your relationship with us.
              </p>

              {/* Category 1: Identifiers / Customer Records */}
              <div className="my-6 overflow-x-auto rounded-lg border border-[var(--color-border)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-card)]">
                      <th className="px-4 py-3 text-left font-semibold text-[var(--color-foreground)]">
                        Category of Personal Information
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-[var(--color-foreground)]">
                        Purposes for Collection, Use, and Disclosure
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border)]">
                      <td className="px-4 py-3 align-top text-[var(--color-foreground)]">
                        <strong>Identifiers</strong> such as a name, email
                        address, telephone number, mailing address, IP
                        address, account name, and password.
                        <br />
                        <br />
                        <strong>Customer Records</strong>, including any
                        personal information described in subdivision (e) of
                        Section 1798.80 of the California Civil Code such as
                        your name, signature, address, telephone number,
                        employment-related information, and financial
                        information.
                      </td>
                      <td className="px-4 py-3 align-top text-[var(--color-foreground)]">
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            To communicate with you, including to respond to
                            your questions, market to you, and provide
                            customer service
                          </li>
                          <li>To provide you with the Services</li>
                          <li>To operate our business</li>
                          <li>
                            To conduct marketing, personalization, and
                            advertising
                          </li>
                          <li>For research purposes</li>
                          <li>
                            To design, develop, and improve our Services
                          </li>
                          <li>
                            To conduct business analytics and to analyze
                            trends
                          </li>
                          <li>
                            To track the effectiveness of our advertising
                          </li>
                          <li>For safety and security purposes</li>
                          <li>
                            To improve how we do business, products and
                            services, and customer experience
                          </li>
                          <li>For other internal business purposes</li>
                          <li>To fulfill our legal obligations</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border)]">
                      <td className="px-4 py-3 align-top text-[var(--color-foreground)]">
                        <strong>
                          Internet or other electronic network activity
                          information
                        </strong>
                        , such as browsing history, search history, and
                        information regarding your interactions with our
                        Services or advertisements.
                      </td>
                      <td className="px-4 py-3 align-top text-[var(--color-foreground)]">
                        <ul className="ml-4 list-disc space-y-1">
                          <li>To provide you with the Services</li>
                          <li>To operate our business</li>
                          <li>
                            To conduct marketing, personalization, and
                            advertising
                          </li>
                          <li>
                            To design, develop, and improve our Services
                          </li>
                          <li>
                            To conduct business analytics and to analyze
                            trends
                          </li>
                          <li>
                            To track the effectiveness of our advertising
                          </li>
                          <li>For safety and security purposes</li>
                          <li>
                            To improve how we do business, products and
                            services, and customer experience
                          </li>
                          <li>For other internal business purposes</li>
                          <li>To fulfill our legal obligations</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border)]">
                      <td className="px-4 py-3 align-top text-[var(--color-foreground)]">
                        <strong>Geolocation data</strong>, including your
                        approximate location derived from your IP address or
                        mobile device.
                      </td>
                      <td className="px-4 py-3 align-top text-[var(--color-foreground)]">
                        <ul className="ml-4 list-disc space-y-1">
                          <li>To provide you with the Services</li>
                          <li>To operate our business</li>
                          <li>
                            To conduct marketing, personalization, and
                            advertising
                          </li>
                          <li>
                            To design, develop, and improve our Services
                          </li>
                          <li>
                            To conduct business analytics and to analyze
                            trends
                          </li>
                          <li>
                            To track the effectiveness of our advertising
                          </li>
                          <li>For safety and security purposes</li>
                          <li>
                            To improve how we do business, products and
                            services, and customer experience
                          </li>
                          <li>For other internal business purposes</li>
                          <li>To fulfill our legal obligations</li>
                          <li>To verify your identity</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 align-top text-[var(--color-foreground)]">
                        <strong>
                          Professional or employment-related information
                        </strong>
                        , including, when you interact with us on behalf of
                        another company, your profession, job title, employer
                        name, professional or licensure status, or other
                        information related to your employment.
                      </td>
                      <td className="px-4 py-3 align-top text-[var(--color-foreground)]">
                        <ul className="ml-4 list-disc space-y-1">
                          <li>To operate our business</li>
                          <li>To communicate with you</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 10.2 Sales and Sharing of Personal Information */}
              <h3 id="section-10-2" className="scroll-mt-24">
                10.2 Sales and Sharing of Personal Information
              </h3>
              <p>
                From time to time, we may use or disclose your personal
                information in a manner that is considered a &ldquo;sale&rdquo;
                or &ldquo;share&rdquo; under California law to provide the
                most relevant advertising and deliver marketing messages and
                personalized offers. The categories of third parties to which
                we disclose your personal information include analytics,
                advertising, and technology companies.
              </p>
              <p>
                The categories of personal information that we may sell or
                share include identifiers, commercial information, internet or
                other electronic network activity information, and geolocation
                data. We do not knowingly sell or share the personal
                information of consumers under the age of 16.
              </p>
              <p>
                You may opt out of sales and sharing of your personal
                information as provided below.
              </p>

              {/* 10.3 Your California Privacy Rights */}
              <h3 id="section-10-3" className="scroll-mt-24">
                10.3 Your California Privacy Rights
              </h3>
              <p>
                If you are a resident of California, you have the right to
                submit certain requests relating to your personal information
                as described below. If you interact with us as a business
                customer, we will process your request directly. If you are a
                tenant or visitor, you may need to submit your request
                directly to your property owner or property manager. To
                exercise any of these rights you may contact us by email. In
                order to fulfill your request, we may require additional
                information from you. We will respond to requests within the
                relevant time periods established by applicable law.
              </p>
              <p>
                You may designate an authorized agent to make a request on
                your behalf; however, you may still need to verify your
                identity directly with us before your request can be
                processed. An authorized agent may submit a request on your
                behalf by email.
              </p>
              <p>
                You will not be discriminated against for exercising these
                rights. We will not deny you any services, nor charge you
                different prices, in retaliation for exercising your privacy
                rights.
              </p>
              <p>
                <strong>Right to Know.</strong> You have the right to know
                what personal information we have collected about you, which
                includes:
              </p>
              <ul>
                <li>
                  The categories of personal information we have collected
                  about you, including
                </li>
                <li>
                  The categories of sources from which the personal
                  information was collected
                </li>
                <li>
                  Our business or commercial purposes for collecting selling,
                  sharing, or disclosing personal information
                </li>
                <li>
                  The categories of recipients to which we disclose personal
                  information
                </li>
                <li>
                  The categories of personal information that we sold, and for
                  each category identified, the categories of third parties to
                  which we sold that particular category of personal
                  information
                </li>
                <li>
                  The categories of personal information that we disclosed for
                  a business purpose, and for each category identified, the
                  categories of recipients to which we disclosed that
                  particular category of personal information
                </li>
                <li>
                  The specific pieces of personal information we have
                  collected about you
                </li>
              </ul>
              <p>
                <strong>Right to Delete.</strong> You have the right to
                request that we delete the personal information we collected
                from you, subject to certain exceptions.
              </p>
              <p>
                <strong>Right to Correct.</strong> If you believe that the
                personal information we maintain about you is inaccurate, you
                have the right to request that we correct that information.
              </p>
              <p>
                <strong>
                  Right to Opt Out of Sales and Sharing for
                  Cross-Context-Behavioral Advertising.
                </strong>{" "}
                You have the right to opt out of the sale of your personal
                information and the sharing of your personal information for
                cross-context behavioral advertising. You may also opt out of
                cookie-based sales and sharing.
              </p>
              <p>
                <strong>
                  Right to Limit the Use and Disclosure of Sensitive Personal
                  Information.
                </strong>{" "}
                We do not use or disclose sensitive personal information for
                purposes to which the right to limit the use and disclosure of
                sensitive personal information applies. As such, we do not
                offer this right.
              </p>

              <hr />

              {/* 11. Changes to this Privacy Notice */}
              <h2 id="section-11" className="scroll-mt-24">
                11. Changes to this Privacy Notice
              </h2>
              <p>
                We reserve the right to make changes to this Privacy Notice at
                any time, without notice. We will notify you about changes
                that significantly impact our use of your personal information
                by placing a prominent notice on this website. Please revisit
                this page periodically to stay aware of any changes to this
                Privacy Notice. For the avoidance of doubt, disputes arising
                hereunder will be resolved in accordance with the Privacy
                Notice in effect at the time the dispute arose.
              </p>

              <hr />

              {/* 12. Contact Us */}
              <h2 id="section-12" className="scroll-mt-24">
                12. Contact Us
              </h2>
              <p>
                Please contact us with any questions, comments, or concerns
                about this Privacy Notice or our use of your personal
                information by e-mail at{" "}
                <a href="mailto:admin@safetrekr.com">admin@safetrekr.com</a>{" "}
                or by mail at:
              </p>
              <p>
                Attn: Privacy Safetrekr
                <br />
                5380 Old Bullard Rd., Ste. 600-247
                <br />
                Tyler, TX 75703
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
            Questions about this notice?
          </h2>
          <p className="text-body-md mb-2 text-[var(--color-muted-foreground)]">
            Contact us at{" "}
            <a
              href="mailto:admin@safetrekr.com"
              className="text-[var(--color-primary-700)] underline underline-offset-2"
            >
              admin@safetrekr.com
            </a>{" "}
            or write to us at Attn: Privacy Safetrekr, 5380 Old Bullard Rd.,
            Ste. 600-247, Tyler, TX 75703.
          </p>
        </div>
      </SectionContainer>
    </>
  );
}
