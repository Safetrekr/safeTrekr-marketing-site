import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

/**
 * Section background variants mapped to the SafeTrekr design token system.
 *
 * - `default`  -- bare `bg-background`, no additional chrome
 * - `card`     -- elevated card surface with top/bottom borders
 * - `dark`     -- authority-blue surface; sets `data-theme="dark"` so nested
 *                 components inherit dark CSS variable overrides from globals.css
 * - `brand`    -- soft primary tint (primary-50)
 * - `accent`   -- slightly stronger primary tint (primary-100)
 *
 * Vertical padding is responsive:
 *   mobile  py-12  (48px)
 *   tablet  py-16  (64px)
 *   desktop py-24  (96px)
 */
const sectionContainerVariants = cva(
  // Base: responsive vertical padding applied to every variant
  "py-12 md:py-16 lg:py-24",
  {
    variants: {
      variant: {
        default: "bg-background",
        card: "bg-card border-y border-border",
        dark: "bg-secondary text-secondary-foreground",
        brand: "bg-primary-50",
        accent: "bg-primary-100",
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

/** HTML element tags valid as section containers. */
type SectionContainerElement = "section" | "div" | "article";

interface SectionContainerProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionContainerVariants> {
  /**
   * HTML element to render.
   * @default "section"
   */
  as?: SectionContainerElement;

  /**
   * ID of the element whose text labels this section for assistive technology.
   * Maps to the `aria-labelledby` attribute.
   */
  ariaLabelledBy?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * ST-816: REQ-033 -- SectionContainer
 *
 * Full-width page section wrapper that provides consistent vertical padding
 * and a background variant from the SafeTrekr design system.
 *
 * Compose with `<Container>` for content width control:
 *
 * ```tsx
 * <SectionContainer variant="dark" id="features">
 *   <Container>
 *     <h2>Features</h2>
 *     <p>...</p>
 *   </Container>
 * </SectionContainer>
 * ```
 */
const SectionContainer = React.forwardRef<HTMLDivElement, SectionContainerProps>(
  (
    { className, variant, as: Tag = "section", ariaLabelledBy, ...props },
    ref,
  ) => {
    return (
      <Tag
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn(sectionContainerVariants({ variant, className }))}
        aria-labelledby={ariaLabelledBy}
        {...(variant === "dark" ? { "data-theme": "dark" } : {})}
        {...props}
      />
    );
  },
);
SectionContainer.displayName = "SectionContainer";

export { SectionContainer, sectionContainerVariants };
export type { SectionContainerProps };
