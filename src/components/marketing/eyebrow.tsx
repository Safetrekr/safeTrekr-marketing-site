import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* ================================================================
   Eyebrow -- Small Uppercase Label
   Ticket: ST-815 / REQ-032
   Usage: Section labels, feature categories, pre-headings
   ================================================================ */

const eyebrowVariants = cva(
  "text-eyebrow inline-flex items-center gap-1.5",
  {
    variants: {
      color: {
        primary: "text-primary-600",
        muted: "text-muted-foreground",
        dark: "text-primary-400",
      },
    },
    defaultVariants: {
      color: "primary",
    },
  },
);

export interface EyebrowProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof eyebrowVariants> {
  /** Optional icon rendered before the label text. */
  icon?: React.ReactNode;
}

/**
 * Small uppercase label used as a pre-heading or section marker.
 *
 * Typography: font-display, ~13px, weight 600, letter-spacing 0.08em, uppercase.
 * These styles come from the `.text-eyebrow` utility class defined in globals.css.
 *
 * @example
 * <Eyebrow color="primary">Safety Features</Eyebrow>
 * <Eyebrow color="dark" icon={<ShieldIcon />}>Enterprise Grade</Eyebrow>
 */
function Eyebrow({
  className,
  color,
  icon,
  children,
  ...props
}: EyebrowProps) {
  return (
    <span className={cn(eyebrowVariants({ color }), className)} {...props}>
      {icon && (
        <span className="inline-flex shrink-0 [&_svg]:size-3.5" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
Eyebrow.displayName = "Eyebrow";

export { Eyebrow, eyebrowVariants };
