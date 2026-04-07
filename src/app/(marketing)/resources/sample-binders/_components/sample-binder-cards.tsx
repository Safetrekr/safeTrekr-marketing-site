"use client";

/**
 * ST-892: Sample Binder Segment Cards (Client Component)
 *
 * Interactive card grid that opens the LeadCaptureModal with a pre-selected
 * binder type for each segment. Extracted as a client component so the parent
 * page.tsx remains a Server Component.
 *
 * Three segments at launch:
 *   - K-12 Schools (binderType: "k12")
 *   - Churches & Mission Organizations (binderType: "mission")
 *   - Corporate Travel (binderType: "corporate")
 *
 * Each card fires a Plausible analytics event when the download button is
 * clicked, before opening the modal.
 */

import { useState, useCallback } from "react";
import { GraduationCap, Church, Building2, Download, Check } from "lucide-react";

import { trackEvent } from "@/lib/analytics";
import type { BinderType } from "@/lib/validation/schemas";
import { LeadCaptureModal } from "@/components/forms/lead-capture-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

// ---------------------------------------------------------------------------
// Segment Data
// ---------------------------------------------------------------------------

interface SegmentData {
  binderType: BinderType;
  icon: React.ReactNode;
  title: string;
  description: string;
  highlights: readonly string[];
  badge: string;
  analyticsSegment: string;
}

const SEGMENTS: readonly SegmentData[] = [
  {
    binderType: "k12",
    icon: <GraduationCap className="size-7" />,
    title: "K-12 Schools",
    description:
      "See exactly what a professional field trip safety binder looks like -- destination risk scoring, venue safety verification, emergency protocols, and the audit-ready documentation your administration and parents expect.",
    highlights: [
      "Comprehensive analyst review template",
      "Government intelligence risk scoring",
      "Parent-ready safety documentation",
      "FERPA-compliant data handling",
    ],
    badge: "Most Popular",
    analyticsSegment: "k12",
  },
  {
    binderType: "mission",
    icon: <Church className="size-7" />,
    title: "Churches & Mission Organizations",
    description:
      "Download a sample safety binder built for mission trip preparation -- covering international risk assessment, evacuation planning, volunteer screening documentation, and the evidence your insurance carrier needs.",
    highlights: [
      "International destination risk assessment",
      "Evacuation route documentation",
      "Insurance-ready evidence binder",
      "Duty of care compliance proof",
    ],
    badge: "Mission Trips",
    analyticsSegment: "mission",
  },
  {
    binderType: "corporate",
    icon: <Building2 className="size-7" />,
    title: "Corporate Travel",
    description:
      "Review a sample corporate travel safety binder -- risk intelligence from government sources, traveler safety protocols, incident response procedures, and the documentation your compliance team requires.",
    highlights: [
      "Corporate duty of care documentation",
      "Multi-destination risk profiles",
      "Incident response procedures",
      "Compliance audit trail",
    ],
    badge: "Enterprise",
    analyticsSegment: "corporate",
  },
] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SampleBinderCards() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<BinderType | undefined>(
    undefined,
  );
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  const handleDownloadClick = useCallback(
    (segment: SegmentData) => {
      trackEvent("Sample Binder Download", {
        segment: segment.analyticsSegment,
      });
      setSelectedSegment(segment.binderType);
      setSelectedTitle(segment.title);
      setModalOpen(true);
    },
    [],
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {SEGMENTS.map((segment, index) => (
          <ScrollReveal
            key={segment.binderType}
            variant="fadeUp"
            delay={index * 0.1}
          >
            <article
              className="group relative flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] transition-all duration-200 ease-[var(--ease-default)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] sm:p-8"
            >
              {/* Badge */}
              <Badge
                variant="brand"
                className="absolute right-4 top-4 sm:right-6 sm:top-6"
              >
                {segment.badge}
              </Badge>

              {/* Icon */}
              <span
                className="mb-5 inline-flex size-12 items-center justify-center rounded-lg bg-primary-50 text-primary-600"
                aria-hidden="true"
              >
                {segment.icon}
              </span>

              {/* Title */}
              <h3 className="text-heading-md text-card-foreground">
                {segment.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-body-md text-muted-foreground">
                {segment.description}
              </p>

              {/* Highlights */}
              <ul className="mt-5 space-y-2.5" aria-label={`What's included in the ${segment.title} sample binder`}>
                {segment.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 text-body-sm text-foreground"
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-primary-600"
                      aria-hidden="true"
                    />
                    {highlight}
                  </li>
                ))}
              </ul>

              {/* Spacer pushes button to bottom */}
              <div className="mt-auto pt-6">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => handleDownloadClick(segment)}
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download Sample Binder
                </Button>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        binderType={selectedSegment}
        title={`Download ${selectedTitle} Sample Binder`}
        description="Enter your details below to access the sample binder. We will send you a download link."
      />
    </>
  );
}
