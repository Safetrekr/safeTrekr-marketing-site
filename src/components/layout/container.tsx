import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

/**
 * Content-width container sizes aligned to the SafeTrekr layout tokens
 * defined in globals.css (`--container-sm` through `--container-2xl`).
 *
 * - `sm`      -- 640px  (narrow prose / focused content)
 * - `md`      -- 768px  (forms, medium content)
 * - `default` -- 1280px (standard page content)
 * - `lg`      -- 1440px (wide layouts, dashboards)
 * - `bleed`   -- 100%   (edge-to-edge within the section)
 *
 * Horizontal padding is responsive:
 *   mobile  px-6   (24px)
 *   tablet  px-8   (32px)
 *   desktop px-12  (48px)
 *
 * All sizes are centered with `mx-auto`.
 */
const containerVariants = cva(
  // Base: centered with responsive horizontal padding
  "mx-auto w-full px-6 md:px-8 lg:px-12",
  {
    variants: {
      size: {
        sm: "max-w-[640px]",
        md: "max-w-[768px]",
        default: "max-w-[1280px]",
        lg: "max-w-[1440px]",
        bleed: "max-w-none",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** HTML element tags valid as content containers. */
type ContainerElement = "div" | "section" | "main";

interface ContainerProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof containerVariants> {
  /**
   * HTML element to render.
   * @default "div"
   */
  as?: ContainerElement;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * ST-816: REQ-033 -- Container
 *
 * Content-width wrapper that constrains children to a maximum width and
 * centers them with responsive horizontal padding. Intended for use inside
 * `<SectionContainer>` but usable anywhere a width constraint is needed.
 *
 * ```tsx
 * <SectionContainer variant="brand">
 *   <Container size="md">
 *     <SignUpForm />
 *   </Container>
 * </SectionContainer>
 *
 * <Container size="lg" as="main">
 *   <DashboardGrid />
 * </Container>
 * ```
 */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, as: Tag = "div", ...props }, ref) => {
    return (
      <Tag
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn(containerVariants({ size, className }))}
        {...props}
      />
    );
  },
);
Container.displayName = "Container";

export { Container, containerVariants };
export type { ContainerProps };
