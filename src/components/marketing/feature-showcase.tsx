import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/layout/section-container";
import { Container } from "@/components/layout/container";

/* ================================================================
   FeatureShowcase -- Split Text + Visual Section
   Ticket: ST-850 / REQ-053
   Usage: Alternating feature sections with product visuals
   Reference: designs/DESIGN-SYSTEM.md (FeatureShowcase spec)
   ================================================================ */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FeatureShowcaseProps {
  /**
   * Small uppercase label rendered above the title via the Eyebrow component.
   * Conveys the section category (e.g. "Route Intelligence", "Safety Binder").
   */
  eyebrow: string;

  /**
   * Primary heading for the text column.
   * Rendered as an `<h2>` with the `text-heading-lg` typographic scale.
   */
  title: string;

  /**
   * Supporting body copy that expands on the title.
   * Rendered as a `<p>` with `text-body-lg` typographic scale and
   * `max-w-prose` for optimal reading line length.
   */
  description: string;

  /**
   * Visual content rendered in the opposite column from the text.
   * Accepts any ReactNode -- typically a product composition such as
   * `<DocumentPreview>`, `<HeroMap>`, a phone mockup, etc.
   */
  visual: React.ReactNode;

  /**
   * Label for the optional call-to-action button.
   * When omitted (or empty), no CTA button is rendered.
   */
  ctaText?: string;

  /**
   * Destination URL for the CTA button.
   * Renders as a Next.js `<Link>` for client-side navigation.
   * Required when `ctaText` is provided.
   */
  ctaHref?: string;

  /**
   * When `true`, the visual column appears on the left and text on the right
   * at the `lg` breakpoint and above. On mobile the DOM order is preserved
   * so text always appears first.
   *
   * Use alternating `reversed` values across consecutive FeatureShowcase
   * sections to create visual rhythm on the page.
   *
   * @default false
   */
  reversed?: boolean;

  /** Additional CSS classes merged onto the root `<SectionContainer>`. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * ST-850: REQ-053 -- FeatureShowcase
 *
 * Full-width marketing section with a 50/50 split layout: text content on
 * one side and a visual composition on the other. Designed for alternating
 * feature sections that create visual rhythm when stacked vertically.
 *
 * **Layout behavior:**
 * - Desktop (`>= lg`): 2-column grid with `gap-12`, vertically centered.
 *   The `reversed` prop swaps column order via CSS `order` utilities.
 * - Mobile (`< lg`): Single-column stack. Text always appears first
 *   regardless of the `reversed` prop, since DOM order is preserved.
 *
 * This is a **Server Component** -- no client-side JavaScript required.
 * The `visual` prop accepts any ReactNode, allowing the caller to pass
 * either a server or client component as the visual composition.
 *
 * @example
 * ```tsx
 * // Standard layout: text left, visual right
 * <FeatureShowcase
 *   eyebrow="Route Intelligence"
 *   title="Know before you go"
 *   description="Real-time safety data aggregated from..."
 *   visual={<HeroMap />}
 *   ctaText="Learn more"
 *   ctaHref="/features/route"
 * />
 *
 * // Reversed layout: visual left, text right
 * <FeatureShowcase
 *   eyebrow="Evidence Record"
 *   title="Tamper-evident documentation"
 *   description="Every safety decision is logged with..."
 *   visual={<DocumentPreview variant="full" />}
 *   ctaText="See how it works"
 *   ctaHref="/features/record"
 *   reversed
 * />
 * ```
 */
function FeatureShowcase({
  eyebrow,
  title,
  description,
  visual,
  ctaText,
  ctaHref,
  reversed = false,
  className,
}: FeatureShowcaseProps) {
  // Generate a stable id for aria-labelledby from the title.
  // Strips non-alphanumeric chars and lowercases for a valid HTML id.
  const headingId = `showcase-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

  const hasCta = Boolean(ctaText && ctaHref);

  return (
    <SectionContainer className={className} ariaLabelledBy={headingId}>
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* ── Text Column ── */}
          <div
            className={cn(
              "flex flex-col gap-6",
              reversed ? "lg:order-2" : "lg:order-1",
            )}
          >
            <Eyebrow>{eyebrow}</Eyebrow>

            <h2 id={headingId} className="text-heading-lg text-foreground">
              {title}
            </h2>

            <p className="text-body-lg max-w-prose text-muted-foreground">
              {description}
            </p>

            {hasCta && (
              <div>
                <Button variant="primary" size="md" asChild>
                  <Link href={ctaHref!}>{ctaText}</Link>
                </Button>
              </div>
            )}
          </div>

          {/* ── Visual Column ── */}
          <div
            className={cn(
              "flex items-center justify-center",
              reversed ? "lg:order-1" : "lg:order-2",
            )}
          >
            {visual}
          </div>
        </div>
      </Container>
    </SectionContainer>
  );
}
FeatureShowcase.displayName = "FeatureShowcase";

export { FeatureShowcase };
