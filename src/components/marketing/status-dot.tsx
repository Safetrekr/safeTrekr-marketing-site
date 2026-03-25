import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* ================================================================
   StatusDot -- Small Colored Status Indicator
   Ticket: ST-815 / REQ-032
   Usage: Connection status, service health, feature availability
   ================================================================ */

const statusDotVariants = cva(
  "inline-block size-2 shrink-0 rounded-full",
  {
    variants: {
      variant: {
        success: "bg-safety-green",
        warning: "bg-safety-yellow",
        danger: "bg-safety-red",
        active: "bg-primary-500",
      },
    },
    defaultVariants: {
      variant: "active",
    },
  },
);

export interface StatusDotProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusDotVariants> {
  /**
   * Enables a pulsing ring animation around the dot.
   * Respects `prefers-reduced-motion: reduce` via globals.css.
   */
  pulse?: boolean;
  /** Accessible label describing the status (required for screen readers). */
  label?: string;
}

/**
 * Small 8px colored circle indicating operational status.
 *
 * @example
 * <StatusDot variant="success" label="Service operational" />
 * <StatusDot variant="danger" pulse label="Outage detected" />
 */
function StatusDot({
  className,
  variant,
  pulse = false,
  label,
  ...props
}: StatusDotProps) {
  return (
    <span
      className="relative inline-flex items-center justify-center"
      role={label ? "status" : undefined}
      aria-label={label}
    >
      {pulse && (
        <span
          className={cn(
            "absolute inline-flex size-2 animate-ping rounded-full opacity-75",
            statusDotVariants({ variant }),
          )}
          aria-hidden="true"
        />
      )}
      <span
        className={cn(statusDotVariants({ variant }), className)}
        {...props}
      />
    </span>
  );
}
StatusDot.displayName = "StatusDot";

export { StatusDot, statusDotVariants };
