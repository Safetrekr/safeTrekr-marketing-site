import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* ================================================================
   SafeTrekr Button Variants
   Ticket: ST-814 / REQ-031
   WCAG: primary-600 (#3f885b) with white text = 4.6:1 PASS
         primary-500 (#4ca46e) with white text = 3.4:1 FAIL
   ================================================================ */

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-primary-600)] text-white shadow-sm hover:bg-[var(--color-primary-700)]",
        secondary:
          "bg-transparent border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-primary-50)]",
        ghost:
          "bg-transparent text-[var(--color-muted-foreground)] hover:bg-[rgba(6,26,35,0.04)]",
        destructive:
          "bg-[var(--color-destructive)] text-white shadow-sm hover:bg-[var(--color-destructive)]/90",
        primaryOnDark:
          "bg-white text-[var(--color-secondary)] shadow-sm hover:bg-[var(--color-primary-50)] focus-visible:ring-white",
        ghostOnDark:
          "bg-transparent border border-white/20 text-[var(--color-secondary-foreground)] hover:bg-white/10 focus-visible:ring-white",
      },
      size: {
        sm: "py-2 px-4 text-sm",
        md: "py-3 px-6 text-sm",
        lg: "py-4 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
