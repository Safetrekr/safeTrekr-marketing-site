/**
 * EULA Page (/legal/eula)
 *
 * Full End User License Agreement with 22 sections of real content, sticky TOC
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
  title: "End User License Agreement",
  description:
    "SafeTrekr's End User License Agreement. Effective March 7, 2026. Read the EULA governing your use of the SafeTrekr software and services.",
  path: "/legal/eula",
});

// ---------------------------------------------------------------------------
// TOC Data
// ---------------------------------------------------------------------------

const TOC_ITEMS: TocItem[] = [
  { id: "section-1", label: "1. License Grant" },
  { id: "section-2", label: "2. License Restrictions" },
  { id: "section-3", label: "3. Reservation of Rights" },
  { id: "section-4", label: "4. Collection and Use of Your Information" },
  { id: "section-5", label: "5. Third-Party Materials" },
  { id: "section-6", label: "6. User Content" },
  { id: "section-7", label: "7. Intellectual Property" },
  { id: "section-8", label: "8. Payment" },
  { id: "section-9", label: "9. Registration Data and Account Security" },
  { id: "section-10", label: "10. Mobile Device Service" },
  { id: "section-11", label: "11. Updates" },
  { id: "section-12", label: "12. Term and Termination" },
  { id: "section-13", label: "13. Disclaimer of Warranties" },
  { id: "section-14", label: "14. Limitation of Liability" },
  { id: "section-15", label: "15. Indemnification" },
  { id: "section-16", label: "16. Claims of Infringement" },
  { id: "section-17", label: "17. Severability" },
  { id: "section-18", label: "18. Governing Law" },
  { id: "section-19", label: "19. Limitation of Time to File Claims" },
  { id: "section-20", label: "20. Entire Agreement" },
  { id: "section-21", label: "21. Waiver" },
  { id: "section-22", label: "22. Changes to Agreement" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function EulaPage() {
  return (
    <>
      {/* BreadcrumbList JSON-LD for EULA */}
      <BreadcrumbJsonLd
        path="/legal/eula"
        currentPageTitle="End User License Agreement"
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
                End User License Agreement
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
            End User License Agreement
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
        aria-label="End User License Agreement document"
      >
        <Container>
          {/* Mobile TOC -- renders above article on small screens */}
          <LegalTocMobile items={TOC_ITEMS} />

          <div className="grid lg:grid-cols-[1fr_260px] gap-12 lg:gap-16">
            {/* ── Article Column ── */}
            <article className="legal-prose max-w-[720px]">
              {/* Preamble */}
              <p>
                This End User License Agreement (the &ldquo;Agreement&rdquo;) is
                a binding agreement between you (&ldquo;End User,&rdquo;
                &ldquo;Licensee,&rdquo; &ldquo;you,&rdquo; or
                &ldquo;your&rdquo;) and Overwatch Consulting LLC DBA Safetrekr
                (&ldquo;Safetrekr,&rdquo; &ldquo;Licensor,&rdquo;
                &ldquo;we,&rdquo; &ldquo;us,&rdquo; and &ldquo;our&rdquo;).
                This Agreement governs your use of the Safetrekr Portal through
                the Safetrekr.com website and the Safetrekr software (the
                &ldquo;Software&rdquo;). The Software is licensed, not sold, to
                you.
              </p>
              <p>
                LICENSOR PROVIDES ACCESS TO THE SOFTWARE SOLELY ON THE TERMS AND
                CONDITIONS SET FORTH IN THIS AGREEMENT AND ON THE CONDITION THAT
                LICENSEE ACCEPTS AND COMPLIES WITH THEM. BY USING THE SOFTWARE
                AND CLICKING THE &ldquo;ACCEPT&rdquo; BUTTON, YOU (A)
                ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTAND THIS AGREEMENT;
                (B) (1) REPRESENT THAT YOU ARE AT LEAST 18 YEARS OF AGE OR
                OLDER, OR (2) IF LICENSEE IS A CORPORATION, GOVERNMENTAL
                ORGANIZATION, OR OTHER LEGAL ENTITY, YOU HAVE THE RIGHT, POWER,
                AND AUTHORITY TO ENTER INTO THIS AGREEMENT ON BEHALF OF LICENSEE
                AND BIND LICENSEE TO ITS TERMS; AND (C) ACCEPT THIS AGREEMENT
                AND AGREE THAT YOU ARE LEGALLY BOUND BY ITS TERMS. LICENSOR WILL
                NOT AND DOES NOT LICENSE THE SOFTWARE TO LICENSEE AND YOU MUST
                NOT ACCESS OR USE THE SOFTWARE OR DOCUMENTATION.
              </p>
              <p>
                NOTWITHSTANDING ANYTHING TO THE CONTRARY IN THIS AGREEMENT OR
                YOUR ACCEPTANCE OF THE TERMS AND CONDITIONS OF THIS AGREEMENT,
                NO LICENSE IS GRANTED (WHETHER EXPRESSLY, BY IMPLICATION, OR
                OTHERWISE) UNDER THIS AGREEMENT, AND THIS AGREEMENT EXPRESSLY
                EXCLUDES ANY RIGHT, CONCERNING ANY SOFTWARE THAT LICENSEE DID
                NOT ACQUIRE LAWFULLY OR THAT IS NOT A LEGITIMATE, AUTHORIZED
                COPY OF LICENSOR&apos;S SOFTWARE.
              </p>

              <hr />

              {/* 1. License Grant */}
              <h2 id="section-1" className="scroll-mt-24">
                1. License Grant
              </h2>
              <p>
                Subject to your strict compliance with all terms and conditions
                set forth in this Agreement, Safetrekr grants you a limited,
                non-exclusive, non-sublicensable, and non-transferable license
                during the term of this Agreement to:
              </p>
              <ul>
                <li>
                  Install, access, and use the Software only for the specific
                  purposes identified herein; and
                </li>
                <li>
                  Install, access, and use the User Content made available in or
                  otherwise accessible through the Software, strictly in
                  accordance with this Agreement, and any additional terms
                  applicable to such User Content as set forth in Section 6.
                </li>
              </ul>

              <hr />

              {/* 2. License Restrictions */}
              <h2 id="section-2" className="scroll-mt-24">
                2. License Restrictions
              </h2>
              <p>You shall not:</p>
              <ul>
                <li>
                  Download, copy, or re-transmit any or all of the Software or
                  the User Content without, or in violation of, a written license
                  or agreement with Safetrekr
                </li>
                <li>
                  Modify, translate, adapt, or otherwise create derivative works
                  or improvements, whether or not patentable or copyrightable, of
                  the Software or User Content
                </li>
                <li>
                  Use any data mining, robots or similar data gathering or
                  extraction methods
                </li>
                <li>
                  Reverse engineer, disassemble, decompile, decode, or otherwise
                  attempt to derive or gain access to the source code of the
                  Software or any part thereof
                </li>
                <li>
                  Manipulate or otherwise display the Software by using framing
                  or similar navigational technology
                </li>
                <li>
                  Register, subscribe, unsubscribe, or attempt to register,
                  subscribe, or unsubscribe any party for any Safetrekr service
                  if you are not expressly authorized by such party to do so
                </li>
                <li>
                  Use the Software or the User Content other than for its
                  intended purpose, as determined solely in Safetrekr&apos;s
                  discretion, including but not limited to, to defame, abuse,
                  harass, stalk, threaten or otherwise violate the legal rights
                  (such as rights of privacy) of others, and/or to publish,
                  post, distribute or disseminate any defamatory, infringing,
                  obscene, pornographic, sexual, indecent or unlawful material or
                  information
                </li>
                <li>
                  Remove, delete, alter, or obscure any trademarks or any
                  copyright, trademark, patent, or other intellectual property or
                  proprietary rights notices from the Software or User Content,
                  including any copy thereof
                </li>
                <li>
                  Rent, lease, lend, sell, sublicense, assign, distribute,
                  publish, transfer, or otherwise make available the Software,
                  any features or functionality of the Software, or User Content
                  to any third party for any reason except as expressly
                  authorized herein, including by making the Software or User
                  Content available on a network where it is capable of being
                  accessed by more than one device at any time
                </li>
                <li>
                  Remove, disable, circumvent, or otherwise create or implement
                  any workaround to any copy protection, rights management, or
                  security features in or protecting the Software or the User
                  Content
                </li>
                <li>
                  Interfere with the security of, or otherwise abuse the Software
                  or any system resources, services or networks connected to or
                  accessible through the Software
                </li>
              </ul>

              <hr />

              {/* 3. Reservation of Rights */}
              <h2 id="section-3" className="scroll-mt-24">
                3. Reservation of Rights
              </h2>
              <p>
                You acknowledge and agree that the Software is provided under
                license, and not sold, to you. You do not acquire any ownership
                interest in the Software under this Agreement, or any other
                rights thereto other than to use the Software in accordance with
                the license granted, and subject to all terms, conditions, and
                restrictions, under this Agreement and the Terms of Service.
                Safetrekr reserves and shall retain its entire right, title, and
                interest in and to the Software, including all copyrights,
                trademarks, and other intellectual property rights therein or
                relating thereto, except as expressly granted to you in this
                Agreement.
              </p>

              <hr />

              {/* 4. Collection and Use of Your Information */}
              <h2 id="section-4" className="scroll-mt-24">
                4. Collection and Use of Your Information
              </h2>
              <p>
                You acknowledge that when you download, install, or use the
                Software, Safetrekr may use automatic means (including, for
                example, cookies and web beacons) to collect information about
                your device accessing the Software and about your use of the
                Software. You also may be required to provide certain information
                about yourself as a condition to downloading, installing, or
                using the Software or certain of its features or functionality,
                and the Software may provide you with opportunities to share
                information about yourself with other users of the Software. All
                information we collect through or in connection with the Software
                is subject to our{" "}
                <Link href="/legal/privacy">Privacy Policy</Link>. By
                downloading, installing, using, and providing information to or
                through the Software, you consent to all actions taken by us with
                respect to your information in compliance with the Privacy
                Policy.
              </p>

              <hr />

              {/* 5. Third-Party Materials */}
              <h2 id="section-5" className="scroll-mt-24">
                5. Third-Party Materials, Sites
              </h2>
              <p>
                The Software may include software, content, data, or other
                materials, including related documentation, that are owned by
                parties other than Safetrekr and that are provided to you on
                licensee terms that are in addition to and/or different from
                those contained in this Agreement (&ldquo;Third-Party
                Licenses&rdquo;). A list of all materials, if any, included in
                the Software and provided under Third-Party Licenses can be
                provided upon request and the applicable Third-Party Licenses are
                accessible via links therefrom. You are bound by and shall comply
                with all applicable Third-Party Licenses. Any breach by End User
                of any Third-Party License is also a breach of this Agreement.
              </p>
              <p>
                The Software may provide, or third parties may provide, links to
                other sites and resources on the Internet. Safetrekr has no
                control over such sites and resources, and Safetrekr is not
                responsible for and does not endorse such sites and resources.
                You further acknowledge and agree that Safetrekr shall not be
                responsible or liable, directly or indirectly, for any damage or
                loss caused or alleged to be caused by or in connection with use
                of or reliance on any content, events, goods or services
                available on or through any such hyperlinked site or resource. If
                you use the Software to access third party sites, you do so at
                your own risk and your use of such sites may be subject to such
                third party&apos;s terms.
              </p>

              <hr />

              {/* 6. User Content */}
              <h2 id="section-6" className="scroll-mt-24">
                6. User Content
              </h2>
              <p>
                The Software includes areas or services in which you or third
                parties create, post or store content on the Software. You are
                solely responsible for your use of such areas and use them at
                your own risk. By using the Software, you agree not to post,
                upload, transmit, distribute, store, create or otherwise publish
                through the Software any of the following:
              </p>
              <ul>
                <li>
                  Any photos, graphics, audio/visual content, messages, comment,
                  data, information, text, music, sound, code or other material
                  (&ldquo;User Content&rdquo;) that is unlawful, libelous,
                  defamatory, obscene, pornographic, harmful to minors, indecent,
                  lewd, suggestive, harassing, threatening, invasive of privacy
                  or publicity rights, abusive, inflammatory, fraudulent or
                  otherwise objectionable
                </li>
                <li>
                  User Content that would constitute, encourage or provide
                  instructions for a criminal offense, violate the rights of any
                  party, or that would otherwise create liability or violate any
                  local, state, national or international law
                </li>
                <li>
                  User Content that may infringe any patent, trademark, trade
                  secret, copyright or other intellectual property or contract
                  right of any party. By posting any User Content, you represent
                  and warrant that you have the lawful right to transmit,
                  distribute and reproduce such User Content
                </li>
                <li>
                  User Content that includes any information or data that is
                  deemed personal information, personal data, or private
                  information of any third party under or subject to any
                  applicable data protection law or regulation without the prior
                  express written consent of Safetrekr
                </li>
                <li>
                  User Content that impersonates any person or entity or
                  otherwise misrepresents your affiliation with a person or
                  entity
                </li>
                <li>
                  Unsolicited promotions, political campaigning, advertising,
                  junk mail, spam, chain letters, pyramid schemes or
                  solicitations
                </li>
                <li>
                  Viruses, corrupted data or other harmful, disruptive or
                  destructive files
                </li>
                <li>
                  User Content that, in the sole judgment of Safetrekr, is
                  objectionable or which restricts or inhibits any other person
                  from using or enjoying the Software, or which adversely affects
                  the availability of its resources to other users, or which may
                  expose Safetrekr or its users to any harm or liability of any
                  type
                </li>
              </ul>
              <p>
                Further, you agree not to delete or revise any User Content
                posted by any other user. Safetrekr takes no responsibility and
                assumes no liability for any User Content posted, stored or
                uploaded by you or any other user, or for any loss or damage
                thereto, nor is Safetrekr liable for any mistakes, defamation,
                slander, libel, omissions, falsehoods, obscenity, pornography or
                profanity you may encounter. Your use of User Content posted by
                another user is at your own risk.
              </p>
              <p>
                You acknowledge and agree that Safetrekr is not responsible for
                any User Content, licensed by you or otherwise, including its
                accuracy, completeness, timeliness, validity, copyright
                compliance, legality, decency, quality, or any other aspect
                thereof. Safetrekr does not assume and will not have any
                liability or responsibility to you or any other person or entity
                for any User Content. Although Safetrekr has no obligation to
                screen, edit or monitor any of the User Content posted, Safetrekr
                reserves the right, and has absolute discretion, to remove,
                screen or edit any User Content posted or stored on the Software
                at any time and for any reason without notice. You are solely
                responsible for creating backup copies of and replacing any User
                Content you post or store on the Software at your sole cost and
                expense. Any use of the Software in violation of the foregoing
                violates this Agreement and may result in, among other things,
                termination or suspension of your rights to use the Software.
              </p>
              <p>
                You acknowledge and agree that Safetrekr may access, use,
                disclose, or delete any information about you or your use of this
                Software, including without limitation any User Content to comply
                with the law or any legal process; protect and defend the rights
                or property of Safetrekr; or to protect the safety of our
                company, employees, customers or the public.
              </p>
              <p>
                If you post User Content to the Software, unless we indicate
                otherwise, you grant Safetrekr and its affiliates a
                nonexclusive, royalty-free, perpetual, irrevocable and fully
                sublicensable right to use, reproduce, modify, adapt, publish,
                translate, create derivative works from, distribute, perform and
                display such User Content throughout the world in any media. You
                grant Safetrekr and its affiliates and sublicensees the right to
                use the name that you submit in connection with such content, if
                they choose. You represent and warrant that (i) you own and
                control all of the rights to the User Content that you post or
                you otherwise have the right to post such User Content to the
                Software; (ii) the User Content you post is accurate and not
                misleading; and (iii) use and posting of the User Content you
                supply does not violate this Agreement, will not violate any
                applicable laws, including without limitation laws governing
                intellectual property rights, and will not violate rights of or
                cause injury to any person or entity.
              </p>

              <hr />

              {/* 7. Intellectual Property */}
              <h2 id="section-7" className="scroll-mt-24">
                7. Intellectual Property
              </h2>
              <p>
                The Software is owned by Safetrekr. Unless otherwise indicated,
                all of the content featured or displayed on the Software,
                including, but not limited to, photographic images,
                illustrations, graphics, data, text, moving images, sound,
                software, and the selection and arrangement thereof
                (&ldquo;Safetrekr Content&rdquo;), is owned by Safetrekr, its
                licensors, or its users. All elements of the Software, including
                the Safetrekr Content, are protected by copyright, trade dress,
                moral rights, trademark and other laws relating to the protection
                of intellectual property.
              </p>
              <p>
                We also appreciate any feedback or other suggestions about our
                services that you may submit to us, but you understand that we
                may use such feedback or suggestions without any obligation to
                compensate you for them.
              </p>
              <p>
                You may not use a Safetrekr logo or other proprietary graphic of
                Safetrekr to link to the Software without the express written
                permission of Safetrekr. Further, you may not frame any Safetrekr
                trademark, logo or other proprietary information, including the
                Safetrekr Content, without Safetrekr&apos;s express written
                consent.
              </p>

              <hr />

              {/* 8. Payment */}
              <h2 id="section-8" className="scroll-mt-24">
                8. Payment
              </h2>
              <p>
                The Software may include functionality for you to pay your
                subscriptions. Payment processing services provided in the
                Software may be provided by a Third-Party payment processor and
                are subject to the applicable subscription agreement. As a
                condition of Safetrekr enabling payment processing services
                through the Software, you agree to provide Safetrekr accurate and
                complete information about you and your business, and you
                authorize Safetrekr to share it and transaction information
                related to your use of any Third-Party payment processing
                services. If you believe that any payment transaction initiated
                by us is erroneous, or if you need more information about any
                such transaction, you should contact us as soon as possible.
              </p>

              <hr />

              {/* 9. Registration Data and Account Security */}
              <h2 id="section-9" className="scroll-mt-24">
                9. Registration Data and Account Security
              </h2>
              <p>
                In consideration of your use of the Software, you agree to:
              </p>
              <ul>
                <li>
                  Provide accurate, current and complete information about you as
                  may be prompted by any registration forms in the Software
                  (&ldquo;Registration Data&rdquo;)
                </li>
                <li>
                  Maintain and promptly update the Registration Data, and any
                  other information you provide to Safetrekr, to keep it
                  accurate, current and complete
                </li>
                <li>
                  Maintain the security of your password and identification
                </li>
                <li>
                  Notify Safetrekr immediately of any unauthorized use of your
                  account or other breach of security
                </li>
                <li>
                  Accept all responsibility for any and all activities that occur
                  under your account
                </li>
                <li>
                  Accept all risks of unauthorized access to the Registration
                  Data and any other information you provide to Safetrekr
                </li>
              </ul>

              <hr />

              {/* 10. Mobile Device Service */}
              <h2 id="section-10" className="scroll-mt-24">
                10. Mobile Device Service
              </h2>
              <p>
                The Software is available via a mobile device. To the extent you
                access the Software through a mobile device, your wireless
                service carrier&apos;s standard charges, data rates and other
                fees may apply. You should check with your carrier to find out
                what plans are available and how much they cost.
              </p>
              <p>
                By using the Software, you agree that we may communicate with you
                regarding the Software by SMS, MMS, text message or other
                electronic means to your mobile device and that certain
                information about your usage of the Software may be communicated
                to us. In the event you change or deactivate your mobile
                telephone number, you agree to promptly update your Safetrekr
                account information to ensure that your messages are not sent to
                the person that acquires your old number.
              </p>

              <hr />

              {/* 11. Updates */}
              <h2 id="section-11" className="scroll-mt-24">
                11. Updates
              </h2>
              <p>
                Safetrekr may from time to time in its sole discretion develop
                and provide Software updates, which may include upgrades, bug
                fixes, patches, other error corrections, and/or new features
                (collectively, including related documentation,
                &ldquo;Updates&rdquo;). Updates may also modify or delete in
                their entirety certain features and functionality. You agree that
                Safetrekr has no obligation to provide any Updates or to continue
                to provide or enable any particular features or functionality.
                Based on your mobile device settings, when your mobile device is
                connected to the internet either:
              </p>
              <ul>
                <li>
                  The Software will automatically download and install all
                  available Updates; or
                </li>
                <li>
                  You may receive notice of or be prompted to download and
                  install available Updates.
                </li>
              </ul>
              <p>
                You shall promptly download and install all Updates and
                acknowledge and agree that the Software or portions thereof may
                not properly operate should you fail to do so. You further agree
                that all Updates will be deemed part of the Software and be
                subject to all terms and conditions of this Agreement.
              </p>

              <hr />

              {/* 12. Term and Termination */}
              <h2 id="section-12" className="scroll-mt-24">
                12. Term and Termination
              </h2>
              <p>
                The term of this Agreement commences when you download or
                otherwise access the Software and will continue in effect until
                terminated by you or Safetrekr as set forth in this section.
              </p>
              <ul>
                <li>
                  You may terminate this Agreement by deleting the Software and
                  all copies thereof from your device, deactivating your account,
                  and refraining from further use of the Software.
                </li>
                <li>
                  Safetrekr may terminate this Agreement at any time without
                  notice if it ceases to support the Software, which Safetrekr
                  may do in its sole discretion. In addition, this Agreement will
                  terminate immediately and automatically without any notice if
                  you violate any of the terms and conditions of this Agreement.
                </li>
                <li>
                  Upon termination: (i) all rights granted to you under this
                  Agreement will also terminate; and (ii) you must cease all use
                  of the Software and delete all copies of the Software from your
                  device and deactivate your account.
                </li>
                <li>
                  Termination will not limit any of Safetrekr&apos;s rights or
                  remedies at law or in equity.
                </li>
              </ul>

              <hr />

              {/* 13. Disclaimer of Warranties */}
              <h2 id="section-13" className="scroll-mt-24">
                13. Disclaimer of Warranties
              </h2>
              <p>
                THE SOFTWARE AND USER CONTENT IS PROVIDED TO END USER &ldquo;AS
                IS&rdquo; AND WITH ALL FAULTS AND DEFECTS WITHOUT WARRANTY OF ANY
                KIND. TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW,
                SAFETREKR, ON ITS OWN BEHALF AND ON BEHALF OF ITS AFFILIATES AND
                ITS AND THEIR RESPECTIVE LICENSORS AND SERVICE PROVIDERS,
                EXPRESSLY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED,
                STATUTORY, OR OTHERWISE, WITH RESPECT TO THE SOFTWARE AND USER
                CONTENT, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT,
                AND WARRANTIES THAT MAY ARISE OUT OF COURSE OF DEALING, COURSE
                OF PERFORMANCE, USAGE, OR TRADE PRACTICE.
              </p>
              <p>
                WITHOUT LIMITATION TO THE FOREGOING, SAFETREKR PROVIDES NO
                WARRANTY OR UNDERTAKING, AND MAKES NO REPRESENTATION OF ANY KIND
                THAT THE SOFTWARE OR USER CONTENT WILL MEET YOUR REQUIREMENTS,
                ACHIEVE ANY INTENDED RESULTS, BE COMPATIBLE, OR WORK WITH ANY
                OTHER SOFTWARE, APPLICATIONS, SYSTEMS, OR SERVICES, OPERATE
                WITHOUT INTERRUPTION, MEET ANY PERFORMANCE OR RELIABILITY
                STANDARDS, OR BE ERROR-FREE, OR THAT ANY ERRORS OR DEFECTS CAN
                OR WILL BE CORRECTED.
              </p>
              <p>
                SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF OR LIMITATIONS
                ON IMPLIED WARRANTIES OR THE LIMITATIONS ON THE APPLICABLE
                STATUTORY RIGHTS OF A CONSUMER, SO SOME OR ALL OF THE ABOVE
                EXCLUSIONS AND LIMITATIONS MAY NOT APPLY TO YOU.
              </p>

              <hr />

              {/* 14. Limitation of Liability */}
              <h2 id="section-14" className="scroll-mt-24">
                14. Limitation of Liability
              </h2>
              <p>
                IN NO EVENT SHALL SAFETREKR, ITS DIRECTORS, MEMBERS, EMPLOYEES,
                OR AGENTS BE LIABLE FOR ANY DIRECT, SPECIAL, INDIRECT OR
                CONSEQUENTIAL DAMAGES, OR ANY OTHER DAMAGES OF ANY KIND,
                INCLUDING BUT NOT LIMITED TO LOSS OF USE, LOSS OF PROFITS OR LOSS
                OF DATA, WHETHER IN AN ACTION IN CONTRACT, TORT (INCLUDING BUT
                NOT LIMITED TO NEGLIGENCE) OR OTHERWISE, ARISING OUT OF OR IN ANY
                WAY CONNECTED WITH THE USE OF THE SOFTWARE, USER CONTENT, THE
                SAFETREKR CONTENT OR THE MATERIALS CONTAINED IN OR ACCESSED
                THROUGH THE SOFTWARE, INCLUDING WITHOUT LIMITATION ANY DAMAGES
                CAUSED BY OR RESULTING FROM RELIANCE BY END USER ON ANY
                INFORMATION OBTAINED FROM SAFETREKR, OR THAT RESULT FROM
                MISTAKES, OMISSIONS, INTERRUPTIONS, DELETION OF FILES OR EMAIL,
                ERRORS, DEFECTS, VIRUSES, DELAYS IN OPERATION OR TRANSMISSION OR
                ANY FAILURE OF PERFORMANCE, WHETHER OR NOT RESULTING FROM ACTS OF
                GOD, COMMUNICATIONS FAILURE, THEFT, DESTRUCTION OR UNAUTHORIZED
                ACCESS TO SAFETREKR&apos;S RECORDS, PROGRAMS OR SERVICES.
              </p>
              <p>
                IN NO EVENT SHALL THE AGGREGATE LIABILITY OF SAFETREKR, WHETHER
                IN CONTRACT, WARRANTY, TORT (INCLUDING NEGLIGENCE, WHETHER
                ACTIVE, PASSIVE OR IMPUTED), PRODUCT LIABILITY, STRICT LIABILITY
                OR OTHER THEORY, ARISING OUT OF OR RELATING TO THE USE OF THE
                SOFTWARE OR USER CONTENT EXCEED ANY COMPENSATION YOU PAY, IF ANY,
                TO SAFETREKR FOR ACCESS TO OR USE OF THE SOFTWARE.
              </p>

              <hr />

              {/* 15. Indemnification */}
              <h2 id="section-15" className="scroll-mt-24">
                15. Indemnification
              </h2>
              <p>
                You agree to indemnify, defend, and hold harmless Safetrekr and
                its officers, directors, employees, agents, affiliates,
                successors, and assigns from and against any and all losses,
                damages, liabilities, deficiencies, claims, actions, judgments,
                settlements, interest, awards, penalties, fines, costs, or
                expenses of whatever kind, including reasonable attorneys&apos;
                fees, arising from or relating to your use or misuse of the
                Software or User Content, your use or inability to use the
                Software or User Content, or your breach of this Agreement,
                including but not limited to the User Content you submit or make
                available through the Software, or of any representation or
                warranty contained herein, your unauthorized use of any User
                Content, or your violation of any rights of another.
              </p>

              <hr />

              {/* 16. Claims of Infringement */}
              <h2 id="section-16" className="scroll-mt-24">
                16. Notice and Procedure for Making Claims of Infringement
              </h2>
              <p>
                Safetrekr respects the copyright of others, and we ask our users
                to do the same. If you believe that your work has been copied in
                a way that constitutes copyright infringement, or your
                intellectual property rights have been otherwise violated, please
                provide a written communication addressed to our designated agent
                as follows:
              </p>
              <p>
                <strong>Ha H. Kummerfeld, PLLC</strong>
                <br />
                Attention: Copyright Agent
              </p>
              <p>
                If you file a notice with our designated agent, it must comply
                with the requirements set forth at 17 U.S.C. &sect; 512(c)(3),
                which includes the following information:
              </p>
              <ul>
                <li>
                  An electronic or physical signature of the person authorized to
                  act on behalf of the owner of the copyright or other
                  intellectual property interest
                </li>
                <li>
                  Description of the copyrighted work or other intellectual
                  property that you claim has been infringed
                </li>
                <li>
                  A description of where the material that you claim is
                  infringing is located on the Software
                </li>
                <li>
                  Your address, telephone number, and email address
                </li>
                <li>
                  A statement by you that you have a good faith belief that the
                  disputed use is not authorized by the copyright owner, its
                  agent, or the law
                </li>
                <li>
                  A statement by you, made under penalty of perjury, that the
                  above information in your notice is accurate and that you are
                  the copyright or intellectual property owner or authorized to
                  act on the copyright or intellectual property owner&apos;s
                  behalf
                </li>
              </ul>
              <p>
                If you believe that your User Content that was removed (or to
                which access was disabled) is not infringing, or that you have
                the authorization from the copyright owner, the copyright
                owner&apos;s agent, or pursuant to the law, to post and use the
                content in your User Content, you may send a written
                counter-notice containing the following information to the
                Copyright Agent:
              </p>
              <ul>
                <li>Your physical or electronic signature</li>
                <li>
                  Identification of the content that has been removed or to which
                  access has been disabled and the location at which the content
                  appeared before it was removed or disabled
                </li>
                <li>
                  A statement that you have a good faith belief that the content
                  was removed or disabled as a result of mistake or a
                  misidentification of the content
                </li>
                <li>
                  Your name, address, telephone number, and e-mail address, a
                  statement that you consent to the jurisdiction of the federal
                  court located within Smith County, Texas and a statement that
                  you will accept service of process from the person who provided
                  notification of the alleged infringement
                </li>
              </ul>
              <p>
                If a counter-notice is received by the Copyright Agent, Safetrekr
                will send a copy of the counter-notice to the original
                complaining party informing that person that it may replace the
                removed content or cease disabling it in 10 business days. Unless
                the copyright owner files an action seeking a court order against
                the content provider, member or user, the removed content may be
                replaced, or access to it restored, in 10 to 14 business days or
                more after receipt of the counter-notice, at Safetrekr&apos;s
                sole discretion.
              </p>
              <p>
                In accordance with the DMCA and other applicable law, Safetrekr
                has adopted a policy of terminating, in appropriate circumstances
                and at Safetrekr&apos;s sole discretion, members who are deemed
                to be repeat infringers. Safetrekr may also at its sole
                discretion limit access to the Software and/or terminate the
                accounts of any users who infringe any intellectual property
                rights of others, whether or not there is any repeat
                infringement.
              </p>

              <hr />

              {/* 17. Severability */}
              <h2 id="section-17" className="scroll-mt-24">
                17. Severability
              </h2>
              <p>
                If any provision of this Agreement is illegal or unenforceable
                under applicable law, the remainder of the provision will be
                amended to achieve as closely as possible the effect of the
                original terms and all other provisions of this Agreement will
                continue in full force and effect.
              </p>

              <hr />

              {/* 18. Governing Law */}
              <h2 id="section-18" className="scroll-mt-24">
                18. Governing Law
              </h2>
              <p>
                This Agreement is governed by and construed in accordance with
                the internal laws of the State of Texas without giving effect to
                any choice or conflict of law provision or rule. Any legal suit,
                action, or proceeding arising out of or related to this Agreement
                or the Software shall be instituted exclusively in the federal
                courts of the United States or the courts of the State of Texas
                in each case located in Smith County. You waive any and all
                objections to the exercise of jurisdiction over you by such
                courts and to venue in such courts.
              </p>

              <hr />

              {/* 19. Limitation of Time to File Claims */}
              <h2 id="section-19" className="scroll-mt-24">
                19. Limitation of Time to File Claims
              </h2>
              <p>
                ANY CAUSE OF ACTION OR CLAIM YOU MAY HAVE ARISING OUT OF OR
                RELATING TO THIS AGREEMENT OR THE SOFTWARE MUST BE COMMENCED
                WITHIN ONE (1) YEAR AFTER THE CAUSE OF ACTION ACCRUES OTHERWISE
                SUCH CAUSE OF ACTION OR CLAIM IS PERMANENTLY BARRED.
              </p>

              <hr />

              {/* 20. Entire Agreement */}
              <h2 id="section-20" className="scroll-mt-24">
                20. Entire Agreement
              </h2>
              <p>
                This Agreement and our{" "}
                <Link href="/legal/privacy">Privacy Policy</Link> constitute the
                entire agreement between you and Safetrekr with respect to the
                Software and supersede all prior or contemporaneous
                understandings and agreements, whether written or oral, with
                respect to the Software.
              </p>

              <hr />

              {/* 21. Waiver */}
              <h2 id="section-21" className="scroll-mt-24">
                21. Waiver
              </h2>
              <p>
                No failure to exercise, and no delay in exercising, on the part
                of either party, any right or any power hereunder shall operate
                as a waiver thereof, nor shall any single or partial exercise of
                any right or power hereunder preclude further exercise of that or
                any other right hereunder. In the event of a conflict between
                this Agreement and any applicable purchase or other terms, the
                terms of this Agreement shall govern.
              </p>

              <hr />

              {/* 22. Changes to Agreement */}
              <h2 id="section-22" className="scroll-mt-24">
                22. Changes to Agreement
              </h2>
              <p>
                Safetrekr reserves the right to change any of the terms and
                conditions contained in this Agreement or any policy or guideline
                of the Software, at any time and in its sole discretion. When we
                make changes, we will revise the &ldquo;last updated&rdquo; date
                at the top of the Agreement. Any changes will be effective
                immediately upon posting on the Software. Your continued use of
                the Software following the posting of changes will constitute
                your acceptance of such changes. We encourage you to review the
                Agreement whenever you use the Software.
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
            Questions about this agreement?
          </h2>
          <p className="text-body-md mb-2 text-[var(--color-muted-foreground)]">
            Contact our legal team at{" "}
            <a
              href="mailto:legal@safetrekr.com"
              className="text-[var(--color-primary-700)] underline underline-offset-2"
            >
              legal@safetrekr.com
            </a>{" "}
            or write to us at Overwatch Consulting LLC DBA Safetrekr.
          </p>
        </div>
      </SectionContainer>
    </>
  );
}
