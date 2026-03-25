"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ================================================================
   IntelSourceBar -- Government Intelligence Source Display
   Ticket: ST-853
   Usage: Hero sections, trust bars, footer credibility strips
   ================================================================ */

/**
 * Intelligence source descriptor used internally.
 * Each entry maps an abbreviation to its full agency name for tooltips.
 */
interface IntelSource {
  /** Short abbreviation displayed inline. */
  abbr: string;
  /** Full agency / organization name shown on hover. */
  fullName: string;
  /** Accessible description for screen readers. */
  ariaLabel: string;
}

const INTEL_SOURCES: IntelSource[] = [
  {
    abbr: "NOAA",
    fullName: "National Oceanic and Atmospheric Administration",
    ariaLabel: "NOAA: National Oceanic and Atmospheric Administration",
  },
  {
    abbr: "USGS",
    fullName: "United States Geological Survey",
    ariaLabel: "USGS: United States Geological Survey",
  },
  {
    abbr: "CDC",
    fullName: "Centers for Disease Control and Prevention",
    ariaLabel: "CDC: Centers for Disease Control and Prevention",
  },
  {
    abbr: "GDACS",
    fullName: "Global Disaster Alerting Coordination System",
    ariaLabel: "GDACS: Global Disaster Alerting Coordination System",
  },
  {
    abbr: "ReliefWeb",
    fullName: "United Nations ReliefWeb",
    ariaLabel: "ReliefWeb: United Nations ReliefWeb",
  },
];

export interface IntelSourceBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to show the "Powered by data from" prefix label.
   * @default true
   */
  showPrefix?: boolean;
}

/**
 * Horizontal bar displaying the 5 government intelligence sources that
 * power SafeTrekr's safety data. Each source abbreviation reveals the
 * full agency name on hover via a tooltip.
 *
 * Renders as a flex container that wraps naturally on narrow viewports.
 * Uses `text-sm` and `muted-foreground` for a subdued, trust-building
 * appearance that complements hero and footer sections.
 *
 * @example
 * <IntelSourceBar />
 * <IntelSourceBar showPrefix={false} className="justify-center" />
 */
function IntelSourceBar({
  showPrefix = true,
  className,
  ...props
}: IntelSourceBarProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground",
          className,
        )}
        role="list"
        aria-label="Intelligence data sources"
        {...props}
      >
        {showPrefix && (
          <span className="mr-1 font-medium">Powered by data from</span>
        )}

        {INTEL_SOURCES.map((source, index) => (
          <React.Fragment key={source.abbr}>
            {index > 0 && (
              <span className="select-none text-border" aria-hidden="true">
                &middot;
              </span>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  role="listitem"
                  className="cursor-default font-semibold transition-colors duration-fast hover:text-foreground"
                  aria-label={source.ariaLabel}
                >
                  {source.abbr}
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-60 text-center">
                <p>{source.fullName}</p>
              </TooltipContent>
            </Tooltip>
          </React.Fragment>
        ))}
      </div>
    </TooltipProvider>
  );
}
IntelSourceBar.displayName = "IntelSourceBar";

export { IntelSourceBar };
