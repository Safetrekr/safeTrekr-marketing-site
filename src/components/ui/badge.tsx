import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* ================================================================
   Badge -- Extended with SafeTrekr Marketing Variants
   Ticket: ST-815 / REQ-032
   Base: shadcn/ui badge (ST-798)
   ================================================================ */

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        /* ── shadcn/ui defaults ─────────────────── */
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",

        /* ── SafeTrekr marketing variants ──────── */
        brand:
          "border-transparent bg-primary-50 text-primary-700",
        neutral:
          "bg-muted border border-border text-muted-foreground",
        success:
          "border-transparent bg-safety-green/15 text-safety-green [&]:dark:text-safety-green",
        warning:
          "border-transparent bg-safety-yellow/15 text-safety-yellow [&]:dark:text-safety-yellow",
        error:
          "border-transparent bg-safety-red/15 text-safety-red [&]:dark:text-safety-red",
        dark:
          "border-dark-border bg-dark-surface text-dark-text-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
