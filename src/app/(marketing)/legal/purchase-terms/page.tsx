/**
 * Purchase Terms Page (/legal/purchase-terms)
 *
 * Full Purchase Terms with two sections of real content, sticky TOC
 * sidebar on desktop, and collapsible TOC on mobile.
 *
 * Layout: 720px article + 260px sticky sidebar on a 1280px container.
 *
 * The legal body text is transcribed verbatim from the source document
 * (docs/Purchase Terms v2.4.docx), preserving the source spelling
 * "Safetrekr" within the agreement text.
 *
 * @see designs/html/mockup-legal.html (pattern reference)
 * @see src/components/marketing/legal-toc-sidebar.tsx
 */

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
import Link from "next/link";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "Purchase Terms",
  description:
    "SafeTrekr's Purchase Terms. Effective March 7, 2026. Read the purchase terms you agree to when submitting payment for the SafeTrekr platform and services.",
  path: "/legal/purchase-terms",
});

// ---------------------------------------------------------------------------
// TOC Data
// ---------------------------------------------------------------------------

const TOC_ITEMS: TocItem[] = [
  { id: "section-1", label: "Itinerary Disclaimer" },
  { id: "section-2", label: "Assumption of Risk" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PurchaseTermsPage() {
  return (
    <>
      {/* BreadcrumbList JSON-LD for Purchase Terms */}
      <BreadcrumbJsonLd
        path="/legal/purchase-terms"
        currentPageTitle="Purchase Terms"
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
                Purchase Terms
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
            Purchase Terms
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
              Version: 2.4
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
        aria-label="Purchase Terms document"
      >
        <Container>
          {/* Mobile TOC -- renders above article on small screens */}
          <LegalTocMobile items={TOC_ITEMS} />

          <div className="grid lg:grid-cols-[1fr_260px] gap-12 lg:gap-16">
            {/* ── Article Column ── */}
            <article className="legal-prose max-w-[720px]">
              {/* Preamble */}
              <p>
                By submitting your payment, you acknowledge and agree to the
                following purchase terms:
              </p>

              <hr />

              {/* 1. Itinerary Disclaimer */}
              <h2 id="section-1" className="scroll-mt-24">
                Itinerary Disclaimer
              </h2>
              <p>
                All plans, safety binders, recommendations, itineraries, travel
                guidance, and related outputs generated through Safetrekr
                platform, including any use of the mobile application or
                associated services, are based solely on the information,
                schedules, destinations, traveler details, and itinerary
                information provided by you prior to the commencement of travel.
              </p>
              <p>
                You acknowledge and agree that travel conditions are dynamic and
                changes may occur before or during travel. Unless expressly
                agreed to in writing, Safetrekr does not monitor, validate,
                revise, or update itinerary changes or travel conditions in real
                time. Any deviation from the originally submitted or confirmed
                itinerary falls outside the scope of the services, plans, and
                documentation provided.
              </p>
              <p>
                You acknowledge and agree that you are solely responsible for:
              </p>
              <ul>
                <li>
                  Managing and assessing any changes made before or during the
                  trip;
                </li>
                <li>
                  Updating plans, contingencies, and safety measures as
                  conditions evolve; and
                </li>
                <li>
                  Making real-time decisions based on actual conditions
                  encountered during the trip.
                </li>
              </ul>
              <p>Safetrekr assumes no responsibility or liability for:</p>
              <ul>
                <li>Outcomes resulting from changes to the original plan;</li>
                <li>
                  Reliance on documentation, recommendations, or safety
                  materials that no longer reflects current conditions; or
                </li>
                <li>
                  Any actions or omissions taken after deviations from the
                  original submitted itinerary.
                </li>
              </ul>
              <p>
                The materials provided are intended to support pre-travel
                planning and are not a substitute for real-time judgment during
                travel.
              </p>

              <hr />

              {/* 2. Assumption of Risk */}
              <h2 id="section-2" className="scroll-mt-24">
                Assumption of Risk
              </h2>
              <p>
                You acknowledge that travel and participation in travel-related
                activities involve inherent and unpredictable risks that may
                result in illness, injury, property damage, financial loss,
                inconvenience, disruption, emotional distress, or death. You
                understand and acknowledge that travel conditions may change
                rapidly and without notice, and that Safetrekr cannot eliminate
                or control all risks associated with travel. By purchasing,
                participating in, or using the services, platform, mobile
                application, itineraries, recommendations, safety binders, or
                travel-related materials provided by Safetrekr, you acknowledge
                and agree that:
              </p>
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
                responses in all circumstances, including emergencies. You
                understand and agree that the Services are provided to you only
                for their intended use in accordance with your agreement with
                Safetrekr.
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
            or write to us at Overwatch Consulting LLC DBA SafeTrekr, 5380 Old
            Bullard Rd., Ste. 600-247, Tyler, TX 75703.
          </p>
        </div>
      </SectionContainer>
    </>
  );
}
