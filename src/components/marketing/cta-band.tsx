import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ================================================================
   CTABand -- Full-Width Conversion Band
   Ticket: ST-846
   Usage: Between sections, above footer, post-feature breakpoints
   ================================================================ */

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

/**
 * Background and theme variants for the CTA band.
 *
 * - `default` -- Standard page background, no additional chrome
 * - `brand`   -- Soft primary tint (primary-50) for warm brand emphasis
 * - `dark`    -- Authority-blue (secondary) surface with inverted text;
 *               sets `data-theme="dark"` for nested token overrides
 */
const ctaBandVariants = cva(
  // Base: responsive vertical padding, centered text
  "py-16 md:py-20 lg:py-24",
  {
    variants: {
      variant: {
        default: "bg-background",
        brand: "bg-primary-50",
        dark: "bg-secondary text-secondary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Link descriptor for CTA buttons. */
interface CtaLink {
  /** Button label text. */
  text: string;
  /** Destination URL. */
  href: string;
}

export interface CTABandProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof ctaBandVariants> {
  /** Primary headline text rendered in `display-md` typography. */
  headline: string;
  /** Supporting body copy rendered below the headline. */
  body: string;
  /** Primary call-to-action link rendered as a prominent button. */
  primaryCta: CtaLink;
  /**
   * Optional secondary call-to-action link rendered as a lighter button.
   * Omit to display a single CTA.
   */
  secondaryCta?: CtaLink;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Full-width conversion band designed to sit between content sections or
 * above the footer. Renders a centered headline, body copy, and one or two
 * CTA buttons in a responsive layout.
 *
 * Three visual variants control the band's background, text colors, and
 * button treatments:
 *
 * - **default** -- Neutral `bg-background` with standard foreground text
 *   and `primary` / `secondary` button variants.
 * - **brand** -- Warm `bg-primary-50` with `primary-700` headline text
 *   and `primary` / `secondary` button variants.
 * - **dark** -- Deep `bg-secondary` (authority blue) with white headline,
 *   muted body text, and `primaryOnDark` / `ghostOnDark` button variants.
 *   Automatically sets `data-theme="dark"` for nested token overrides.
 *
 * Buttons stack vertically on mobile and sit side-by-side from `sm` upward.
 *
 * @example
 * ```tsx
 * // Default band between sections
 * <CTABand
 *   headline="Ready to secure your next trip?"
 *   body="Get started with SafeTrekr in minutes."
 *   primaryCta={{ text: "Get a Demo", href: "/demo" }}
 *   secondaryCta={{ text: "View Pricing", href: "/pricing" }}
 * />
 *
 * // Dark band above the footer
 * <CTABand
 *   variant="dark"
 *   headline="Join 500+ schools already using SafeTrekr"
 *   body="Start your free trial today. No credit card required."
 *   primaryCta={{ text: "Start Free Trial", href: "/trial" }}
 *   secondaryCta={{ text: "Talk to Sales", href: "/contact" }}
 * />
 *
 * // Brand band with single CTA
 * <CTABand
 *   variant="brand"
 *   headline="See SafeTrekr in action"
 *   body="Book a personalized walkthrough with our safety experts."
 *   primaryCta={{ text: "Book a Demo", href: "/demo" }}
 * />
 * ```
 */
function CTABand({
  variant,
  headline,
  body,
  primaryCta,
  secondaryCta,
  className,
  ...props
}: CTABandProps) {
  const resolvedVariant = variant ?? "default";

  // Determine text and button variants per band variant
  const headlineClass = {
    default: "text-foreground",
    brand: "text-primary-700",
    dark: "text-white",
  }[resolvedVariant];

  const bodyClass = {
    default: "text-muted-foreground",
    brand: "text-foreground",
    dark: "text-muted-foreground",
  }[resolvedVariant];

  const primaryButtonVariant = resolvedVariant === "dark" ? "primaryOnDark" : "primary";
  const secondaryButtonVariant = resolvedVariant === "dark" ? "ghostOnDark" : "secondary";

  return (
    <section
      className={cn(ctaBandVariants({ variant }), className)}
      {...(resolvedVariant === "dark" ? { "data-theme": "dark" } : {})}
      {...props}
    >
      <div className="mx-auto w-full max-w-[768px] px-6 text-center md:px-8 lg:px-12">
        {/* Headline */}
        <h2 className={cn("text-display-md", headlineClass)}>
          {headline}
        </h2>

        {/* Body */}
        <p className={cn("mt-4 text-body-lg", bodyClass)}>
          {body}
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <Button variant={primaryButtonVariant} size="lg" asChild>
            <Link href={primaryCta.href}>{primaryCta.text}</Link>
          </Button>
          {secondaryCta && (
            <Button variant={secondaryButtonVariant} size="lg" asChild>
              <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
CTABand.displayName = "CTABand";

export { CTABand, ctaBandVariants };
export type { CtaLink };
