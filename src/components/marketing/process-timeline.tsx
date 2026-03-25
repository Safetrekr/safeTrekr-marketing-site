import * as React from "react";

import { cn } from "@/lib/utils";

/* ================================================================
   ProcessTimeline -- "How It Works" 3-Step Horizontal Timeline
   Ticket: ST-841
   Usage: Homepage preview section, landing page onboarding overview
   ================================================================ */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single step in the process timeline. */
export interface ProcessStep {
  /** Step number displayed inside the numbered circle. */
  number: number;
  /** Step heading text. */
  title: string;
  /** Brief explanation of this step. */
  description: string;
  /** Optional icon rendered inside the numbered circle instead of the number. */
  icon?: React.ReactNode;
}

export interface ProcessTimelineProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Ordered array of process steps to display. */
  steps: ProcessStep[];
  /** Additional CSS class names applied to the outer container. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Internal sub-components
// ---------------------------------------------------------------------------

/**
 * Numbered circle indicator for a single step.
 * 40px diameter, bg-primary-600, white text/icon.
 * When an icon is provided it replaces the number visually,
 * but the number is still available via aria-label on the parent.
 */
function StepCircle({
  step,
}: {
  step: ProcessStep;
}) {
  return (
    <div
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-primary-foreground"
      aria-hidden="true"
    >
      {step.icon ? (
        <span className="inline-flex [&_svg]:size-5">{step.icon}</span>
      ) : (
        step.number
      )}
    </div>
  );
}

/**
 * Dashed connector line between steps.
 * Desktop: horizontal line (flex-1 height) between circles.
 * Mobile: vertical line alongside the step content.
 */
function HorizontalConnector() {
  return (
    <div
      className="hidden h-px flex-1 border-t-2 border-dashed border-border lg:block"
      aria-hidden="true"
    />
  );
}

function VerticalConnector() {
  return (
    <div
      className="ml-5 h-8 border-l-2 border-dashed border-border lg:hidden"
      aria-hidden="true"
    />
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Horizontal (desktop) / vertical (mobile) process timeline showing
 * numbered steps for the "How It Works" section.
 *
 * Each step renders a numbered circle (40px, bg-primary-600) with a
 * title and description. On desktop (lg+), steps are laid out horizontally
 * with dashed connector lines between the circles. On mobile, the layout
 * collapses to a vertical stack with a dashed vertical connector.
 *
 * This is a server component. For scroll-triggered entrance animation,
 * wrap the entire timeline in a `<ScrollReveal>` at the page level.
 *
 * @example
 * ```tsx
 * <ProcessTimeline
 *   steps={[
 *     { number: 1, title: "Plan Your Trip", description: "Enter destination, dates, and group size." },
 *     { number: 2, title: "Get Your Binder", description: "SafeTrekr builds a compliance-ready safety binder." },
 *     { number: 3, title: "Travel with Confidence", description: "Real-time alerts keep your group safe." },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With icons instead of numbers
 * import { MapPin, FileText, Shield } from "lucide-react";
 *
 * <ProcessTimeline
 *   steps={[
 *     { number: 1, title: "Plan", description: "...", icon: <MapPin /> },
 *     { number: 2, title: "Build", description: "...", icon: <FileText /> },
 *     { number: 3, title: "Travel", description: "...", icon: <Shield /> },
 *   ]}
 * />
 * ```
 */
function ProcessTimeline({ steps, className, ...props }: ProcessTimelineProps) {
  return (
    <div
      className={cn("w-full", className)}
      role="list"
      aria-label="Process steps"
      {...props}
    >
      {/* ----------------------------------------------------------------
          Desktop layout (lg+): horizontal row
          Circle -- dashed line -- Circle -- dashed line -- Circle
          Titles and descriptions below each circle
          ---------------------------------------------------------------- */}
      <div className="hidden lg:block">
        {/* Row 1: circles and connectors */}
        <div className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <StepCircle step={step} />
              </div>
              {index < steps.length - 1 && <HorizontalConnector />}
            </React.Fragment>
          ))}
        </div>

        {/* Row 2: titles and descriptions aligned under circles */}
        <div className="mt-4 flex">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={cn(
                "flex-1",
                // First step: left-aligned text
                index === 0 && "pr-4 text-left",
                // Middle steps: centered text
                index > 0 && index < steps.length - 1 && "px-4 text-center",
                // Last step: right-aligned text
                index === steps.length - 1 && "pl-4 text-right",
              )}
              role="listitem"
              aria-label={`Step ${step.number}: ${step.title}`}
            >
              <h3 className="text-heading-sm text-foreground">{step.title}</h3>
              <p className="mt-1 text-body-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------
          Mobile layout (<lg): vertical stack
          Each step: circle + text side by side, connector line between steps
          ---------------------------------------------------------------- */}
      <div className="lg:hidden">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div
              className="flex items-start gap-4"
              role="listitem"
              aria-label={`Step ${step.number}: ${step.title}`}
            >
              <StepCircle step={step} />
              <div className="min-w-0 pt-1.5">
                <h3 className="text-heading-sm text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-body-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && <VerticalConnector />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
ProcessTimeline.displayName = "ProcessTimeline";

export { ProcessTimeline };
