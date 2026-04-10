/**
 * Terms of Service Page (/legal/terms)
 *
 * Full Terms of Service with 22 sections of real content, sticky TOC
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
    "SafeTrekr's Terms of Service. Effective March 7, 2026. Read the terms governing your use of the SafeTrekr platform and services.",
  path: "/legal/terms",
});

// ---------------------------------------------------------------------------
// TOC Data
// ---------------------------------------------------------------------------

const TOC_ITEMS: TocItem[] = [
  { id: "section-1", label: "1. Access and Use of the Services" },
  { id: "section-2", label: "2. Creating and Safeguarding Your Account" },
  { id: "section-3", label: "3. Third-Party Websites" },
  { id: "section-4", label: "4. License Granted" },
  { id: "section-5", label: "5. Restrictions on Your Use" },
  { id: "section-6", label: "6. Information You Submit" },
  { id: "section-7", label: "7. Mobile Software" },
  { id: "section-8", label: "8. Ownership of Trademarks and Services" },
  { id: "section-9", label: "9. Ownership of Feedback" },
  { id: "section-10", label: "10. Responsibility for Use" },
  { id: "section-11", label: "11. Disclaimers" },
  { id: "section-12", label: "12. Limitation of Liability" },
  { id: "section-13", label: "13. Indemnification" },
  { id: "section-14", label: "14. Termination" },
  { id: "section-15", label: "15. Injunctive Relief" },
  { id: "section-16", label: "16. California Residents" },
  { id: "section-17", label: "17. Governing Law" },
  { id: "section-18", label: "18. Dispute Resolution" },
  { id: "section-19", label: "19. Updates to These Terms" },
  { id: "section-20", label: "20. Notifications" },
  { id: "section-21", label: "21. Miscellaneous" },
  { id: "section-22", label: "22. How to Contact Us" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TermsOfServicePage() {
  return (
    <>
      {/* BreadcrumbList JSON-LD for Terms of Service */}
      <BreadcrumbJsonLd
        path="/legal/terms"
        currentPageTitle="Terms of Service"
      />

      {/* ── Page Header ── */}
      <SectionContainer
        as="section"
        className="pb-2 pt-8 sm:pb-3 sm:pt-12 lg:pb-4 lg:pt-16"
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
        aria-label="Terms of Service document"
      >
        <Container>
          {/* Mobile TOC -- renders above article on small screens */}
          <LegalTocMobile items={TOC_ITEMS} />

          <div className="grid lg:grid-cols-[1fr_260px] gap-12 lg:gap-16">
            {/* ── Article Column ── */}
            <article className="legal-prose max-w-[720px]">
              {/* Preamble */}
              <p>
                Welcome to the Terms of Service (these &ldquo;Terms&rdquo;) for
                the website Safetrekr.com, including any functionality, products,
                services, software as a service platform, hardware, and mobile
                application(s) offered on or through the website (collectively,
                the &ldquo;Services&rdquo;) operated by Overwatch Consulting LLC
                DBA Safetrekr, a Texas corporation, with its principal place of
                business in Tyler, Texas (&ldquo;Safetrekr,&rdquo;
                &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;).
                These Terms govern your access to and use of the Services.
              </p>
              <p>
                PLEASE REVIEW THESE TERMS CAREFULLY BEFORE ACCESSING AND/OR
                USING THE SERVICES. BY USING THE SERVICES OR BY CLICKING TO
                ACCEPT OR AGREE TO THESE TERMS WHEN THIS OPTION IS MADE
                AVAILABLE TO YOU, YOU ACCEPT AND AGREE TO BE BOUND AND ABIDE BY
                THESE TERMS AND ACKNOWLEDGE OUR PRIVACY POLICY, INCORPORATED
                HEREIN BY REFERENCE. IF YOU DO NOT AGREE TO THESE TERMS OR OUR
                PRACTICES AS DESCRIBED IN OUR PRIVACY POLICY, YOU MUST NOT
                ACCESS OR USE THE SERVICES. IF YOU DO NOT UNDERSTAND OR AGREE TO
                THESE TERMS, PLEASE DO NOT USE THE SERVICES.
              </p>
              <p>
                PLEASE NOTE THAT THESE TERMS CONTAIN A WAIVER OF YOUR RIGHT TO
                PARTICIPATE IN A CLASS ACTION OR REPRESENTATIVE LAWSUIT. FOR
                MORE INFORMATION, PLEASE SEE SECTION 18.
              </p>
              <p>
                THE SERVICES ARE CONTROLLED AND/OR OPERATED FROM THE UNITED
                STATES. THE SERVICES ARE NOT INTENDED TO SUBJECT SAFETREKR TO
                NON-U.S. JURISDICTION OR LAWS. If you access or use the Services
                from outside of the United States, you do so at your own risk,
                and you are responsible for complying with all local laws, rules,
                and regulations in your jurisdiction.
              </p>
              <p>
                For purposes of these Terms, &ldquo;you&rdquo; and
                &ldquo;your&rdquo; means you as the user of the Services. If you
                use the Services on behalf of a company or other entity then
                &ldquo;you&rdquo; includes you and that entity, and you represent
                and warrant that (a) you are an authorized representative of the
                entity with the authority to bind the entity to these Terms, and
                (b) you agree to these Terms on the entity&apos;s behalf.
              </p>

              <hr />

              {/* 1. Access and Use of the Services */}
              <h2 id="section-1" className="scroll-mt-24">
                1. Access and Use of the Services
              </h2>
              <p>
                You may use the Services to access information and materials
                solely as permitted in these Terms. The information and materials
                on the Services are not offered as legal, accounting, or other
                professional advice and are not tailored to your specific
                circumstances. The information and materials on the Services may
                occasionally be inaccurate, incomplete, or out of date, and we
                make no representation as to the completeness, accuracy, or
                currentness of any such information or materials. References to
                any of our affiliated companies&apos; products or services are
                not intended to constitute offers to sell or solicitations in
                connection with any of our own products or services. ANY RELIANCE
                YOU PLACE ON THE INFORMATION OR MATERIALS PROVIDED ON THE
                SERVICES IS STRICTLY AT YOUR OWN RISK. SAFETREKR DISCLAIMS ALL
                LIABILITY AND RESPONSIBILITY ARISING FROM ANY RELIANCE PLACED ON
                THE SERVICES BY YOU OR ANY OTHER VISITOR TO THE SERVICES OR BY
                ANYONE WHO MAY BE INFORMED OF ANY OF THE SERVICES&apos;
                CONTENTS.
              </p>

              <hr />

              {/* 2. Creating and Safeguarding Your Account */}
              <h2 id="section-2" className="scroll-mt-24">
                2. Creating and Safeguarding Your Account
              </h2>
              <p>
                To use certain features of the Services, you may need to create
                an account (&ldquo;Account&rdquo;). Unauthorized use of or
                access to Accounts or the Services is strictly prohibited. By
                creating an Account, you agree that:
              </p>
              <ul>
                <li>
                  You will provide us with accurate, complete, and updated
                  information for your Account.
                </li>
                <li>
                  You are solely responsible for any activity on your Account and
                  for maintaining the confidentiality and security of your
                  username and password.
                </li>
                <li>
                  You must immediately notify us if you know or have any reason
                  to suspect of any unauthorized use of your Account, or that
                  your Account username or password have been stolen,
                  misappropriated, or otherwise compromised.
                </li>
                <li>
                  We may reject any changes to your Account information or
                  require that you change the Account information that you
                  provide to us at or after registration.
                </li>
                <li>
                  We are entitled to act on instructions provided to us under
                  your username and password.
                </li>
                <li>We are not liable for any unauthorized access to your Account.</li>
                <li>
                  You will keep your Account username and password confidential.
                </li>
                <li>
                  We may block access to the Services without prior notice if we
                  believe your username and password are being used by someone
                  other than you or for other reasons in our discretion.
                </li>
              </ul>

              <hr />

              {/* 3. Third-Party Websites */}
              <h2 id="section-3" className="scroll-mt-24">
                3. Third-Party Websites
              </h2>
              <p>
                The Services may provide links to third party websites and
                resources that are not maintained by us (&ldquo;Third-Party
                Websites&rdquo;). We are not responsible for such Third-Party
                Websites, and we make no warranties or representations about the
                content therein. We recommend that you read the privacy notices
                and user agreements of the Third-Party Websites you visit. We are
                not and will not be responsible for (i) the terms and conditions
                of any transaction between you and any such Third-Party Websites;
                (ii) any insufficiency of or problems with any such Third-Party
                Websites&apos; background, insurance, credit, or licensing; (iii)
                the quality of products or the services offered or advertised by
                Third-Party Websites; or (iv) any other legal liability arising
                out of or related to your transactions in connection with
                Third-Party Websites. YOUR USE OF THIRD-PARTY WEBSITES IS AT
                YOUR OWN RISK. IN THE EVENT YOU HAVE A DISPUTE WITH ANY
                THIRD-PARTY WEBSITES, YOU AGREE TO RELEASE US AND OUR
                AFFILIATES, AGENTS, AND EMPLOYEES FROM ANY AND ALL CLAIMS
                ARISING OUT OF OR IN ANY WAY CONNECTED WITH SUCH DISPUTES.
              </p>

              <hr />

              {/* 4. License Granted */}
              <h2 id="section-4" className="scroll-mt-24">
                4. License Granted
              </h2>
              <p>
                Subject to your compliance with these Terms, we hereby grant to
                you a revocable, royalty-free, non-assignable, non-sublicensable,
                non-transferable, and non-exclusive license to access, use,
                download, install, and operate the Services as an individual or
                on behalf of a company as permitted in these Terms. The foregoing
                license is granted to you for the sole purpose of enabling you to
                use and enjoy the Services in accordance with these Terms. Your
                access and use of the Services may be interrupted from time to
                time for any of several reasons, including, without limitation,
                the malfunction of equipment, periodic updating, maintenance or
                repair of the Services or other actions that Safetrekr, in its
                sole discretion, may elect to take.
              </p>

              <hr />

              {/* 5. Restrictions on Your Use of the Services */}
              <h2 id="section-5" className="scroll-mt-24">
                5. Restrictions on Your Use of the Services
              </h2>
              <p>
                Failure to comply with this Section 5 may result in termination
                of your access or use of the Services pursuant to Section 14
                below. While using the Services, you agree that you will not do
                the following:
              </p>
              <ul>
                <li>
                  Exploit the Services for any commercial purpose;
                </li>
                <li>
                  Download, modify, adapt, copy, distribute, transmit, display,
                  perform, reproduce, duplicate, publish, license, create
                  derivative works from, or offer for sale any information
                  contained on, or obtained from or through, the Services;
                </li>
                <li>
                  Decompile, reverse engineer, disassemble, disable, or decode
                  the Services (including any underlying idea or algorithm), or
                  attempt to do any of the same;
                </li>
                <li>
                  Use automation software (bots), hacks, modifications (mods), or
                  any other unauthorized third-party software designed to modify
                  the Services;
                </li>
                <li>
                  Use, reproduce or remove any copyright, trademark, service
                  mark, trade name, slogan, logo, image, or other proprietary
                  notation displayed on or through the Services;
                </li>
                <li>
                  Access or use the Services in any manner that could disable,
                  overburden, damage, disrupt, or impair the Services, or
                  interfere with any other party&apos;s access to or use of the
                  Services or use any device, software or routine that causes the
                  same;
                </li>
                <li>
                  Attempt to gain unauthorized access to, interfere with, or
                  damage or disrupt the Services, accounts registered to other
                  users, or the computer systems or networks connected to the
                  Services, or circumvent, remove, alter, deactivate, degrade, or
                  thwart any technological measure or content protections of the
                  Services;
                </li>
                <li>
                  Interfere with or disrupt the operation of the Services or the
                  servers or networks used to make the Services available, or
                  violate any requirements, procedures, policies, or regulations
                  of such networks;
                </li>
                <li>
                  Use any robot, spider, crawlers or other automatic device,
                  process, software or queries that intercepts, &ldquo;mines,&rdquo;
                  scrapes, or otherwise accesses the Services to monitor, extract,
                  copy, or collect information or data from or through the
                  Services, or engage in any manual process to do the same;
                </li>
                <li>
                  Introduce any viruses, trojan horses, worms, logic bombs, or
                  other materials that are malicious or technologically harmful
                  into our systems;
                </li>
                <li>
                  Use the Services for illegal, harassing, unethical or
                  disruptive purposes, or violate any applicable law or
                  regulation in connection with your access to or use of the
                  Services, including without limitation any applicable data
                  privacy laws;
                </li>
                <li>
                  Share, upload, transfer, or otherwise disclose to Safetrekr any
                  sensitive information, including driver&apos;s license
                  information;
                </li>
                <li>
                  Restrict or inhibit any other person from using the Services
                  (including, without limitation, by hacking or defacing any
                  portion of the Services); or
                </li>
                <li>
                  Access or use the Services in any way not expressly permitted
                  by these Terms.
                </li>
              </ul>

              <hr />

              {/* 6. Information You Submit */}
              <h2 id="section-6" className="scroll-mt-24">
                6. Information You Submit
              </h2>
              <p>
                You agree that all information and materials you provide to us
                (collectively, &ldquo;User Content&rdquo;), is true, accurate,
                and complete, and you will maintain and update such information
                regularly. If you provide to us or choose to make any User
                Content publicly available on the Services, if and where
                available, you do so at your own risk. You agree and acknowledge
                that Safetrekr may disclose User Content if Safetrekr determines
                that: (i) disclosure is necessary to enforce these Terms, respond
                to claims that any User Content violates the rights of third
                parties, or protect the rights, property, or personal safety of
                Safetrekr, its users, and the public; or (ii) appropriate legal
                process requires disclosure. Without limiting the generality of
                the foregoing, you authorize Safetrekr to include User Content in
                a searchable format that may be accessed by users of the Services
                and Third-Party Websites (as defined in Section 3), provided,
                however, that Safetrekr shall have no liability for User Content
                that can be public and visible on the Services, Third-Party
                Websites, or search engines, including after deletion of such
                User Content by you or Safetrekr. YOU UNDERSTAND AND AGREE THAT
                SAFETREKR WILL HAVE NO LIABILITY OR RESPONSIBILITY TO YOU OR ANY
                THIRD PARTY IN CONNECTION WITH ANY USER CONTENT.
              </p>

              <hr />

              {/* 7. Mobile Software */}
              <h2 id="section-7" className="scroll-mt-24">
                7. Mobile Software
              </h2>

              <h3>Mobile App Users</h3>
              <p>
                Our mobile application (&ldquo;App&rdquo;) is designed to work
                on compatible iOS and Android mobile devices and is generally
                available through third-party mobile stores (i.e., Apple&apos;s
                App Store or the Google Play Store (each an &ldquo;App
                Store&rdquo;)). If you are accessing the Services through an App,
                you agree that you will read each App Store&apos;s terms and
                conditions that apply to your use of the App. You agree that only
                your mobile service carrier or Internet service provider is
                responsible for its products and services. Accordingly, you agree
                to resolve any problems with your mobile device directly with
                your carrier or provider without involving us.
              </p>

              <h3>Terms Specific to Apple Mobile Devices</h3>
              <p>
                If you are accessing or using the App on any Apple mobile device,
                the following additional terms and conditions are applicable to
                you and are incorporated into these Terms by reference:
              </p>
              <ul>
                <li>
                  To the extent that you are accessing the App through an Apple
                  mobile device, you acknowledge that these Terms are entered
                  into between you and Safetrekr, and that Apple, Inc.
                  (&ldquo;Apple&rdquo;) is not a party to these Terms other than
                  as a third-party beneficiary as contemplated below.
                </li>
                <li>
                  Safetrekr in its sole discretion will determine when the App
                  will be available on any Apple mobile device, and reference to
                  any device in these Terms shall not guarantee that Safetrekr
                  will launch the App on any or all of the Apple mobile devices.
                </li>
                <li>
                  When accessing and/or using the Services via the App, the
                  rights granted to you in Section 4 of these Terms is subject to
                  the permitted &ldquo;Usage Rules&rdquo; set forth in the App
                  Store Terms of Service located at{" "}
                  <a
                    href="http://www.apple.com/legal/itunes/us/terms.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    http://www.apple.com/legal/itunes/us/terms.html
                  </a>{" "}
                  and any third party terms of agreement applicable to the App.
                  You are also subject to the Apple App Store Terms of Services,
                  which you also acknowledge that you have had the opportunity to
                  review.
                </li>
                <li>
                  You acknowledge that Safetrekr, and not Apple, is responsible
                  for providing the App and content thereof.
                </li>
                <li>
                  As between Safetrekr and Apple, Safetrekr is solely responsible
                  for providing any maintenance and support services with respect
                  to the App that Safetrekr may offer (which, if provided, is
                  provided at Safetrekr&apos;s sole discretion). You acknowledge
                  that Apple has no obligation whatsoever to furnish maintenance
                  or support services with respect to the App.
                </li>
                <li>
                  You and Safetrekr acknowledge that Safetrekr, not Apple, is
                  responsible for addressing any of your claims or any
                  third-party claims relating to the App or your possession
                  and/or use of the App, including, but not limited to, (i)
                  product liability claims; (ii) any claim that the App fails to
                  conform to any applicable legal or regulatory requirement; and
                  (iii) claims arising under consumer protection or similar
                  legislation.
                </li>
                <li>
                  Further, you agree that if the App or your possession and use
                  of the App infringes a third party&apos;s intellectual property
                  rights, Safetrekr, not Apple, will be solely responsible for
                  the investigation, defense, settlement, and discharge of any
                  such intellectual property infringement claim, but only to the
                  extent it relates to your use of the App.
                </li>
                <li>
                  With respect to this Section 7 only, you acknowledge and agree
                  that Apple, and Apple&apos;s subsidiaries, are third-party
                  beneficiaries of these Terms, and that, upon your acceptance of
                  the terms and conditions of these Terms, Apple will have the
                  right (and will be deemed to have accepted the right) to
                  enforce these Terms against you as a third-party beneficiary
                  thereof.
                </li>
                <li>
                  When using the App, you agree to comply with any and all
                  third-party terms that are applicable to any platform, website,
                  technology, or service that interacts with the App. You may not
                  use the App on a device that has firmware or software
                  configuration that has not been authorized by Apple
                  (&ldquo;jailbroken&rdquo; device).
                </li>
              </ul>
              <p>
                TO THE EXTENT ANY WARRANTY REGARDING THE APP ARISES BY LAW OR
                HAS NOT BEEN DISCLAIMED UNDER THESE TERMS, SAFETREKR, AND NOT
                APPLE, IS SOLELY RESPONSIBLE FOR SUCH WARRANTY. IF YOU ARE A
                CUSTOMER OF THE SERVICES AND IF THE APP FAILS TO CONFORM TO SUCH
                WARRANTY, YOU MAY NOTIFY APPLE, AND APPLE WILL REFUND THE
                PURCHASE PRICE (IF ANY) PAID FOR THE LICENSE TO THE APP. TO THE
                MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, APPLE WILL HAVE NO
                OTHER WARRANTY OBLIGATION WHATSOEVER WITH RESPECT TO THE APP, AND
                ANY OTHER CLAIMS, LOSS, LIABILITIES, DAMAGES, COSTS, OR EXPENSES
                ATTRIBUTABLE TO ANY FAILURE TO CONFORM TO THE WARRANTY IS
                SAFETREKR&apos;S SOLE RESPONSIBILITY.
              </p>

              <h3>Terms Specific to Android Mobile Devices</h3>
              <p>
                If the App is provided to you through Google, Inc. (Google, Inc.
                together with all of its affiliates, &ldquo;Google&rdquo;)
                Google Play Store, the following terms and conditions are
                applicable to you and are incorporated into these Terms by
                reference:
              </p>
              <ul>
                <li>
                  You acknowledge that Google is not responsible for providing
                  support services for the App.
                </li>
              </ul>
              <p>
                If any of the terms and conditions in these Terms are
                inconsistent with the Google Play Developer Distribution
                Agreement (the current version as of the date of these Terms is
                located at:{" "}
                <a
                  href="https://play.google.com/about/developer-distribution-agreement.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://play.google.com/about/developer-distribution-agreement.html
                </a>
                ), the terms and conditions of Google&apos;s Google Play
                Developer Distribution Agreement will apply to the extent of
                such inconsistency or conflict.
              </p>

              <hr />

              {/* 8. Ownership of Trademarks and Services */}
              <h2 id="section-8" className="scroll-mt-24">
                8. Ownership of Trademarks and Services
              </h2>
              <p>
                The Safetrekr name, trademarks and logo and all related names,
                logos, product and service names, designs, and slogans are
                trademarks of Safetrekr or its affiliates or licensors. The
                Services, including their &ldquo;look and feel&rdquo; (e.g.,
                text, graphics, images, logos), proprietary content, information,
                and other materials, are protected under copyright, trademark and
                other intellectual property laws. You agree that Safetrekr and/or
                its licensors own all right, title and interest in and to the
                Services (including all intellectual property rights therein) and
                you agree not to take any action(s) inconsistent with such
                ownership interests. We and our licensors reserve all rights in
                connection with the Services and their content, including,
                without limitation, the exclusive right to create derivative
                works. Safetrekr reserves the right to make such modifications to
                the Services from time to time as it deems advisable in order to
                enhance the functionalities or appearance of the Services or for
                any other reason. Nothing contained in the Services should be
                construed as granting any license or right to use any trademarks
                or service marks without the express prior written consent of the
                owner. Except as expressly authorized in advance by us, you agree
                not to reproduce, modify, rent, lease, loan, sell, distribute or
                create derivative works based on all or any part of the Services
                or any information or materials made available through the
                Services. UNAUTHORIZED USE OF ANY PART OF THE SERVICES,
                INCLUDING, WITHOUT LIMITATION, ANY SOFTWARE USED BY THE
                SERVICES, MAY SUBJECT YOU TO CIVIL AND CRIMINAL PENALTIES
                (INCLUDING, WITHOUT LIMITATION, POSSIBLE MONETARY DAMAGES),
                INCLUDING, WITHOUT LIMITATION, FOR COPYRIGHT INFRINGEMENT.
              </p>

              <hr />

              {/* 9. Ownership of Feedback */}
              <h2 id="section-9" className="scroll-mt-24">
                9. Ownership of Feedback
              </h2>
              <p>
                You acknowledge and expressly agree that any feedback, comments
                and suggestions for improvements to the Services you provide to
                us (&ldquo;Feedback&rdquo;) becomes the sole and exclusive
                property of Safetrekr, and Safetrekr may use and disclose
                Feedback in any manner and for any purpose whatsoever without
                further notice or compensation to you and without retention by
                you of any proprietary or other right or claim. You hereby assign
                to Safetrekr any and all right, title and interest (including,
                but not limited to, any patent, copyright, trade secret,
                trademark, show-how, know-how, moral rights and any and all other
                intellectual property right) that you may have in and to any and
                all Feedback.
              </p>

              <hr />

              {/* 10. Responsibility for Use */}
              <h2 id="section-10" className="scroll-mt-24">
                10. Responsibility for Use
              </h2>
              <p>
                Safetrekr does not provide security services, emergency services,
                medical services, law enforcement services, monitoring services,
                dispatch services, or real-time response services. The Services
                provided by Safetrekr are for general planning, informational,
                and decision-support purposes only.
              </p>
              <p>You acknowledge and agree that:</p>
              <ul>
                <li>
                  Safetrekr does not assume and expressly disclaims any duty of
                  care, special relationship, fiduciary duty, or professional
                  obligation to you or any third party.
                </li>
                <li>
                  Safetrekr does not control, supervise, manage, or direct your
                  personnel, students, travelers, contractors, or third parties.
                </li>
                <li>
                  Safetrekr does not guarantee safety, security, prevention of
                  harm, compliance with law, or successful outcomes.
                </li>
                <li>
                  All decisions, actions, and omissions remain solely your
                  responsibility.
                </li>
              </ul>
              <p>
                The Services are not intended to replace independent judgment,
                professional expertise, or situational awareness. You are solely
                responsible for evaluating risks, implementing safeguards,
                complying with applicable laws, and determining appropriate
                responses in all circumstances, including emergencies.
              </p>

              <hr />

              {/* 11. Disclaimers */}
              <h2 id="section-11" className="scroll-mt-24">
                11. Disclaimers
              </h2>
              <p>
                You understand and agree that the Services are provided to you on
                an &ldquo;AS IS,&rdquo; &ldquo;WITH ALL FAULTS,&rdquo; AND
                &ldquo;AS AVAILABLE&rdquo; basis. Without limiting the
                foregoing, to the maximum extent permitted under applicable law,
                Safetrekr, its parents, affiliates, related companies, officers,
                directors, employees, contractors, officers, agents,
                representatives, partners and licensors (collectively, the
                &ldquo;THE SAFETREKR ENTITIES&rdquo;) DISCLAIM ALL STATUTORY OR
                IMPLIED REPRESENTATIONS, WARRANTIES, TERMS, AND CONDITIONS WITH
                RESPECT TO THE SERVICES, AND MAKE NO WARRANTIES OF ANY KIND
                (WHETHER EXPRESS, STATUTORY, IMPLIED OR OTHERWISE ARISING IN LAW
                OR FROM A COURSE OF DEALING OR USAGE OF TRADE), INCLUDING
                WITHOUT LIMITATION (I) THE CONDITIONS AND/OR WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                NON-INFRINGEMENT OR LOSS OF DATA; (II) THE COMPLETENESS,
                ACCURACY, AVAILABILITY, TIMELINESS, SECURITY, OR RELIABILITY OF
                THE SERVICES; (III) ANY HARM TO YOUR COMPUTER SYSTEM, OR OTHER
                HARM THAT RESULTS FROM YOUR ACCESS TO OR USE OF THE SERVICES;
                (IV) THE SERVICES&apos; OPERATION OR COMPATIBILITY WITH ANY
                OTHER APPLICATION OR ANY PARTICULAR SYSTEM OR DEVICE; AND (V)
                WHETHER THE SERVICES WILL MEET YOUR REQUIREMENTS OR BE AVAILABLE
                ON AN UNINTERRUPTED, SECURE, OR ERROR-FREE BASIS. YOU HEREBY
                ACKNOWLEDGE AND AGREE THAT IT IS YOUR SOLE RESPONSIBILITY TO (I)
                OBTAIN AND PAY FOR ANY SOFTWARE, HARDWARE, AND SERVICES
                (INCLUDING INTERNET CONNECTIVITY) NEEDED TO ACCESS AND USE THE
                SERVICES AND (II) ENSURE THAT ANY SOFTWARE AND HARDWARE THAT YOU
                USE WILL FUNCTION CORRECTLY WITH THE SERVICES. YOU AGREE THAT
                YOU MUST EVALUATE, AND THAT YOU BEAR ALL RISKS ASSOCIATED WITH
                YOUR ACCESS AND USE OF THE SERVICES, INCLUDING ANY RELIANCE ON
                THE ACCURACY, COMPLETENESS, OR USEFULNESS OF ANY INFORMATION OR
                MATERIALS MADE AVAILABLE ON OR THROUGH THE SERVICES, INCLUDING
                VIA THIRD-PARTY WEBSITES. NO ADVICE OR INFORMATION, WHETHER ORAL
                OR WRITTEN, OBTAINED FROM THE SAFETREKR ENTITIES OR THROUGH THE
                SERVICES, WILL CREATE ANY WARRANTY OR REPRESENTATION NOT
                EXPRESSLY MADE HEREIN.
              </p>

              <hr />

              {/* 12. Limitation of Liability */}
              <h2 id="section-12" className="scroll-mt-24">
                12. Limitation of Liability
              </h2>
              <p>
                TO THE EXTENT NOT PROHIBITED BY APPLICABLE LAW, YOU AGREE THAT
                IN NO EVENT WILL THE SAFETREKR ENTITIES BE LIABLE FOR DAMAGES OF
                ANY KIND, INCLUDING, WITHOUT LIMITATION, DIRECT, INDIRECT,
                SPECIAL, EXEMPLARY, INCIDENTAL, CONSEQUENTIAL OR PUNITIVE
                DAMAGES, HOWEVER CAUSED AND UNDER ANY THEORY OF LIABILITY,
                WHETHER ARISING FROM CONTRACT, STRICT LIABILITY, TORT (INCLUDING
                NEGLIGENCE OR OTHERWISE) OR ANY OTHER CAUSE OF ACTION, EVEN IF
                THE SAFETREKR ENTITIES HAVE BEEN ADVISED OF THE POSSIBILITY OF
                SUCH DAMAGE, INCLUDING, BUT NOT LIMITED TO: (I) LOSS OF USE,
                DATA, PROFITS, OR BUSINESS INTERRUPTION; (II) ANY ACTS OR
                OMISSIONS OF ANY INDIVIDUAL OR LOSS OF ANY PERSONAL PROPERTY;
                (III) PERSONAL INJURY OR LOSS OF LIFE ARISING FROM YOUR USE OF
                THE SERVICES; OR (IV) ANY OTHER CLAIM, DEMAND OR DAMAGES
                WHATSOEVER RESULTING FROM OR ARISING OUT OF OR IN CONNECTION WITH
                THESE TERMS OR THE DELIVERY, USE OR PERFORMANCE OF THE SERVICES.
                SOME JURISDICTIONS (SUCH AS THE STATE OF NEW JERSEY) DO NOT
                ALLOW THE EXCLUSION OR LIMITATION OF INCIDENTAL OR CONSEQUENTIAL
                DAMAGES, SO SOME OF THE ABOVE EXCLUSIONS OR LIMITATIONS MAY NOT
                APPLY TO YOU. NOTWITHSTANDING THE FOREGOING, IF A COURT OF
                COMPETENT JURISDICTION FINDS SAFETREKR LIABLE TO YOU, THEN THE
                SAFETREKR ENTITIES&apos; TOTAL LIABILITY TO YOU FOR ANY DAMAGES
                FINALLY AWARDED IN ANY MATTER ARISING FROM, RELATED TO, OR
                CONNECTED WITH THE SERVICES OR THESE TERMS SHALL NOT EXCEED THE
                AMOUNT OF ONE HUNDRED U.S. DOLLARS ($100.00). THE FOREGOING
                LIMITATIONS WILL APPLY EVEN IF THE ABOVE STATED REMEDY FAILS OF
                ITS ESSENTIAL PURPOSE.
              </p>

              <hr />

              {/* 13. Indemnification */}
              <h2 id="section-13" className="scroll-mt-24">
                13. Indemnification
              </h2>
              <p>
                You agree to defend, indemnify, and hold harmless the Safetrekr
                Entities from all claims, costs, damages, losses, liabilities,
                and expenses (including attorneys&apos; fees and costs) incurred
                by the Safetrekr Entities arising out of or in connection with:
                (i) your access of or use of the Services; (ii) the acts or
                omissions of any individual; (iii) your violation or breach of
                any provision of these Terms, any applicable law or regulation,
                or the rights of any third party; and/or (iv) your negligence or
                willful misconduct. Safetrekr reserves the right, at its own
                expense, to assume the exclusive defense and control of any
                matter for which you are obligated to indemnify Safetrekr. If
                Safetrekr chooses to assume the defense of any matter that is
                subject to indemnification by you, you will cooperate with
                Safetrekr, at its expense, in any respect reasonably requested by
                Safetrekr. You also acknowledge and agree not to settle any
                matter without the prior express written consent of Safetrekr.
              </p>

              <hr />

              {/* 14. Termination of License and Your Account */}
              <h2 id="section-14" className="scroll-mt-24">
                14. Termination of License and Your Account
              </h2>
              <p>
                You may terminate these Terms by closing your Account and
                stopping all access to or use of the Services. If you breach any
                of the provisions of these Terms, all licenses granted to you by
                Safetrekr will terminate automatically. We may take steps that we
                believe are appropriate to enforce or verify compliance with any
                part of these Terms (including our right to cooperate with any
                legal process relating to your access or use of the Services or
                any third-party claim that your use of the Services is unlawful
                or infringes such third party&apos;s rights). Additionally, we
                may suspend, disable, or delete your Account and/or access to
                the Services (or any part of the foregoing) with or without
                notice, for any or no reason. If we delete your Account for any
                suspected breach of these Terms by you, you are prohibited from
                re-registering for the Services under a different name. All
                sections which by their nature should survive the termination of
                these Terms shall continue in full force and effect, subsequent
                to and notwithstanding any termination of the license or your
                Account by Safetrekr or you. Termination will not limit any of
                our other rights or remedies at law or in equity.
              </p>
              <p>
                You acknowledge and agree that Safetrekr will not be liable to
                you or any third party for any termination of your access or use
                of the Services or your Account. If we terminate your access or
                use of the Services, you will not have the right to bring claims
                against us or our affiliates with respect to such termination.
                We and our affiliates and subsidiaries shall not be liable for
                any termination of your access or use of the Services or to any
                such information or files (except as may be required under
                mandatory applicable law), and shall not be required to make such
                information or files available to you after any such termination.
              </p>

              <hr />

              {/* 15. Injunctive Relief */}
              <h2 id="section-15" className="scroll-mt-24">
                15. Injunctive Relief
              </h2>
              <p>
                You agree that a breach of these Terms may cause irreparable
                injury to Safetrekr for which monetary damages would not be an
                adequate remedy and Safetrekr shall be entitled to equitable
                relief in addition to any remedies it may have hereunder or at
                law without a bond, other security or proof of damages.
              </p>

              <hr />

              {/* 16. California Residents */}
              <h2 id="section-16" className="scroll-mt-24">
                16. California Residents
              </h2>
              <p>
                If you are a California resident, in accordance with Cal. Civ.
                Code &sect; 1789.3, you may report complaints to the Complaint
                Assistance Unit of the Division of Consumer Services of the
                California Department of Consumer Affairs by contacting them in
                writing at 1625 North Market Blvd., Suite N 112 Sacramento, CA
                95834, or by telephone at (800) 952-5210.
              </p>

              <hr />

              {/* 17. Governing Law */}
              <h2 id="section-17" className="scroll-mt-24">
                17. Governing Law
              </h2>
              <p>
                You hereby agree that these Terms (and any claim or dispute
                arising in connection with these Terms or your use of the
                Services) is governed by and shall be construed in accordance
                with the laws of the State of Texas, United States, without
                regard to its principles of conflicts of law, and you consent to
                the exclusive jurisdiction of the federal and state courts
                located in Smith County, Texas, United States, and waive any
                jurisdictional, venue, or inconvenient forum objections thereto.
              </p>

              <hr />

              {/* 18. Dispute Resolution; Class Action Waiver; Jury Trial Waiver */}
              <h2 id="section-18" className="scroll-mt-24">
                18. Dispute Resolution; Class Action Waiver; Jury Trial Waiver
              </h2>

              <h3>Applicability</h3>
              <p>
                YOU UNDERSTAND AND AGREE THAT THESE DISPUTE RESOLUTION TERMS
                APPLY TO ALL CLAIMS, DISAGREEMENTS, DISPUTES OR CONTROVERSIES
                BETWEEN YOU AND SAFETREKR (AND ANY OTHER RELEASED PARTY), AND
                ITS OFFICERS, DIRECTORS, EMPLOYEES, REPRESENTATIVES, AGENTS,
                PARENTS, AFFILIATES, SUBSIDIARIES AND/OR RELATED COMPANIES
                ARISING OUT OF OR RELATING TO YOUR USE OF OR ACCESS TO THE
                SERVICES.
              </p>

              <h3>Dispute Notice and Informal Dispute Resolution</h3>
              <p>
                If a dispute should arise between you and Safetrekr, we want to
                provide you with a resolution that is efficient and cost
                effective. Before initiating an action, you and Safetrekr each
                agree to first provide the other a written notice (&ldquo;Notice
                of Dispute&rdquo;), which shall contain: (a) a written
                description of the problem and relevant documents and supporting
                information; and (b) a statement of the specific relief sought. A
                Notice of Dispute can be (1) mailed to Overwatch Consulting LLC
                DBA Safetrekr, Attention: Legal, or (2) emailed to{" "}
                <a href="mailto:admin@safetrekr.com">admin@safetrekr.com</a>.
                You and Safetrekr agree to make attempts to resolve the dispute
                prior to commencing any legal action, including the filing of a
                lawsuit, until a 45-day post-notice resolution period expires. If
                an agreement cannot be reached within forty-five (45) days of
                receipt of the Notice of Dispute, you or Safetrekr may commence a
                lawsuit.
              </p>

              <h3>No Class Actions</h3>
              <p>
                TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, YOU AND WE
                AGREE THAT ANY AND ALL DISPUTES (WHETHER BASED IN CONTRACT,
                STATUTE, TORT OR ANY OTHER THEORY) WILL BE RESOLVED
                INDIVIDUALLY, WITHOUT RESORT TO ANY FORM OF CLASS ACTION,
                COLLECTIVE ACTION, OR REPRESENTATIVE ACTION. ALL CLAIMS MUST BE
                BROUGHT SOLELY IN A PARTY&apos;S INDIVIDUAL CAPACITY, AND NOT AS
                A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS ACTION,
                COLLECTIVE ACTION, CONSOLIDATED ACTION, REPRESENTATIVE ACTION OR
                PROCEEDING.
              </p>
              <p>
                ANY ACTION MUST BE COMMENCED WITHIN ONE (1) YEAR OF THE DATE
                THAT THE CAUSE OF ACTION OR CLAIM ARISES.
              </p>

              <h3>Waiver of Jury Trial</h3>
              <p>
                EACH PARTY HEREBY KNOWINGLY, VOLUNTARILY, AND INTENTIONALLY
                WAIVES, TO THE FULLEST EXTENT PERMITTED BY LAW, ANY AND ALL
                RIGHTS THEY MAY HAVE (INCLUDING BUT NOT LIMITED TO, THEIR
                CONSTITUTIONAL OR STATUTORY RIGHT) TO A TRIAL BY JURY IN ANY
                LEGAL PROCEEDING FOR ANY DISPUTE, INCLUDING BUT NOT LIMITED TO
                DISPUTES ARISING OUT OF OR RELATING TO THESE TERMS OR THE
                RELATIONSHIP OF THE PARTIES.
              </p>

              <hr />

              {/* 19. Updates to These Terms */}
              <h2 id="section-19" className="scroll-mt-24">
                19. Updates to These Terms
              </h2>
              <p>
                Safetrekr may from time to time in the future change or modify
                these Terms, in which case we will update the &ldquo;Effective
                Date&rdquo; at the top of these Terms, provided that these
                changes will be prospective only and not retroactive. If
                Safetrekr makes material changes, we will use reasonable efforts
                to attempt to notify you, such as by e-mail to the e-mail
                address in your Account and/or by placing a prominent notice on
                the first page of these Terms. The updated Terms will be
                effective as of the time of posting, or such later date as may
                be specified in the updated Terms. If you continue to use the
                Services after any changes or modifications of these Terms are
                posted, you will be considered to have accepted such changes
                and/or modifications. ACCORDINGLY, EACH TIME YOU SIGN IN TO OR
                OTHERWISE ACCESS OR USE THE SERVICES, YOU ARE ENTERING INTO A
                NEW AGREEMENT WITH US ON THE THEN APPLICABLE TERMS AND YOU AGREE
                THAT YOUR ACCESS AND USE OF THE SERVICES AFTER SUCH NEW TERMS
                HAVE BEEN POSTED CONSTITUTES YOUR AGREEMENT TO THE NEW TERMS FOR
                YOUR NEW ACCESS AND USE OF THE SERVICES. If you do not agree to
                the changes, you should not access or use the Services after the
                effective date of the changes. Please revisit these Terms
                regularly to ensure that you stay informed of any changes.
              </p>

              <hr />

              {/* 20. Notifications */}
              <h2 id="section-20" className="scroll-mt-24">
                20. Notifications
              </h2>
              <p>
                As part of the Services, you may receive push notifications, text
                messages, alerts, emails or other types of messages directly sent
                to you in connection with the Services (&ldquo;Push
                Messages&rdquo;). You acknowledge that, when you use the
                Services, your wireless service provider may charge you fees for
                data, text messaging and/or other wireless access, including in
                connection with Push Messages. You may have certain control over
                the Push Messages settings, and can manage certain settings
                through the Services or through your mobile device&apos;s
                operating system (with the possible exception of infrequent,
                important service announcements and administrative messages).
                Please check with your wireless service provider to determine
                what fees apply to your access to and use of the Services,
                including your receipt of Push Messages from Safetrekr. You are
                solely responsible for any fee, cost or expense that you incur to
                download, install and/or use the Services on your mobile device,
                including for your receipt of push messages from Safetrekr. You
                acknowledge that you are responsible for all fees charged for
                your use of the above in connection with your use of the
                Services.
              </p>

              <hr />

              {/* 21. Miscellaneous */}
              <h2 id="section-21" className="scroll-mt-24">
                21. Miscellaneous
              </h2>
              <p>
                These Terms hereby incorporate by reference any additional terms
                that we post on the Services (including, without limitation, our{" "}
                <Link href="/legal/privacy">Privacy Policy</Link>) and, except
                for Additional Agreements and as otherwise expressly stated
                herein, these Terms are the entire agreement between you and us
                relating to the subject matter herein and supersedes any and all
                prior or contemporaneous written or oral agreements or
                understandings between you and us relating to such subject
                matter. If any provision contained in these Terms is held by a
                court to be invalid or unenforceable, that provision will be
                enforced to the maximum extent permissible so as to reflect, as
                nearly as possible, the original intentions of the parties, and
                the remaining provisions of these Terms will not be affected
                thereby. These Terms and the licenses granted hereunder may be
                freely assigned by Safetrekr but may not be assigned by you
                without the prior express written consent of Safetrekr. No waiver
                by either party of any breach or default hereunder shall be
                deemed to be a waiver of any preceding or subsequent breach or
                default. The section headings used herein are for reference only
                and shall not be read to have any legal effect.
              </p>

              <hr />

              {/* 22. How to Contact Us */}
              <h2 id="section-22" className="scroll-mt-24">
                22. How to Contact Us
              </h2>
              <p>
                You may contact us regarding the Services or these Terms by email
                at{" "}
                <a href="mailto:admin@safetrekr.com">admin@safetrekr.com</a>, or
                via mail at Safetrekr, 5380 Old Bullard Rd., Ste. 600-247,
                Tyler, TX 75703. Since email communications cannot always be
                secure, do not include sensitive information in any such email.
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
            Contact us at{" "}
            <a
              href="mailto:admin@safetrekr.com"
              className="text-[var(--color-primary-700)] underline underline-offset-2"
            >
              admin@safetrekr.com
            </a>{" "}
            or write to us at Overwatch Consulting LLC DBA Safetrekr, 5380 Old
            Bullard Rd., Ste. 600-247, Tyler, TX 75703.
          </p>
        </div>
      </SectionContainer>
    </>
  );
}
