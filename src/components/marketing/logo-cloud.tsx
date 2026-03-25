import * as React from "react";
import {
  GraduationCap,
  School,
  Church,
  Trophy,
  Building2,
} from "lucide-react";

import { cn } from "@/lib/utils";

/* ================================================================
   LogoCloud -- Trust Organization Logo Cloud
   Ticket: ST-886
   Usage: Social proof section displaying organization categories
          SafeTrekr serves. Uses placeholder SVG icons (NOT real
          org logos) with grayscale-to-color hover effect.
   ================================================================ */

// ---------------------------------------------------------------------------
// Logo item data
// ---------------------------------------------------------------------------

interface LogoItemData {
  /** Lucide icon component for this category. */
  icon: React.ReactNode;
  /** Display label for the organization category. */
  label: string;
  /** Tailwind text color class applied when hover removes grayscale. */
  hoverColorClass: string;
}

const LOGO_ITEMS: LogoItemData[] = [
  {
    icon: <GraduationCap className="size-8 sm:size-10" />,
    label: "School Districts",
    hoverColorClass: "text-primary-600",
  },
  {
    icon: <School className="size-8 sm:size-10" />,
    label: "Universities",
    hoverColorClass: "text-secondary",
  },
  {
    icon: <Church className="size-8 sm:size-10" />,
    label: "Churches",
    hoverColorClass: "text-primary-700",
  },
  {
    icon: <Trophy className="size-8 sm:size-10" />,
    label: "Youth Sports",
    hoverColorClass: "text-warning-600",
  },
  {
    icon: <Building2 className="size-8 sm:size-10" />,
    label: "Corporate Travel",
    hoverColorClass: "text-secondary-light",
  },
];

// ---------------------------------------------------------------------------
// LogoCloud
// ---------------------------------------------------------------------------

export interface LogoCloudProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Optional heading displayed above the logo row.
   * @default "Trusted by organizations nationwide"
   */
  heading?: string;
}

/**
 * Trust-building logo cloud displaying organization categories that
 * SafeTrekr serves. Each category is represented by a placeholder
 * Lucide icon (not a real organization logo) with a grayscale-to-color
 * hover effect.
 *
 * Default state: icons render in grayscale at 50% opacity.
 * Hover state: full color with smooth 300ms transition.
 *
 * On mobile viewports, the logo row scrolls horizontally.
 * On desktop, logos are centered in a single row.
 *
 * Designed as a server component -- no client-side JavaScript required.
 * The hover effect is pure CSS via Tailwind utility classes.
 *
 * @example
 * ```tsx
 * // Default usage
 * <LogoCloud />
 *
 * // Custom heading
 * <LogoCloud heading="Organizations we serve" />
 *
 * // Without heading
 * <LogoCloud heading="" />
 *
 * // With scroll reveal animation (wrap with client component)
 * <ScrollReveal variant="fadeUp">
 *   <LogoCloud />
 * </ScrollReveal>
 * ```
 */
function LogoCloud({
  heading = "Trusted by organizations nationwide",
  className,
  ...props
}: LogoCloudProps) {
  return (
    <section
      className={cn("py-10 sm:py-12", className)}
      aria-label="Organizations served by SafeTrekr"
      {...props}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Heading */}
        {heading && (
          <p className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground sm:mb-8">
            {heading}
          </p>
        )}

        {/* Logo row -- scrollable on mobile, centered on desktop */}
        <div
          className={cn(
            "flex items-center gap-8 sm:gap-10 lg:gap-12",
            // Mobile: horizontal scroll
            "overflow-x-auto pb-2 scrollbar-none",
            // Desktop: center and wrap if needed
            "md:justify-center md:overflow-x-visible md:pb-0",
          )}
          role="list"
        >
          {LOGO_ITEMS.map((item) => (
            <div
              key={item.label}
              className={cn(
                // Layout
                "flex shrink-0 flex-col items-center gap-2",
                // Default: grayscale + muted
                "grayscale opacity-50",
                // Hover: full color + full opacity
                "hover:grayscale-0 hover:opacity-100",
                // Transition
                "transition-all duration-300 ease-[var(--ease-default)]",
                // Color class (visible once grayscale lifts)
                item.hoverColorClass,
              )}
              role="listitem"
            >
              <span aria-hidden="true">{item.icon}</span>
              <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
LogoCloud.displayName = "LogoCloud";

export { LogoCloud };
