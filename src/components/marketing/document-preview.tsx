import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, AlertTriangle, ShieldCheck, FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/* ================================================================
   DocumentPreview -- Stacked Safety Binder Composition
   Ticket: ST-852 / REQ-054
   Usage: Marketing hero, binder showcase section, feature cards
   Reference: designs/html/mockup-homepage.html (binder showcase)
   ================================================================ */

// ---------------------------------------------------------------------------
// Variant definitions
// ---------------------------------------------------------------------------

const documentPreviewVariants = cva(
  "relative select-none",
  {
    variants: {
      variant: {
        /** Smaller binder preview for hero overlays and feature cards. */
        compact: "w-[220px] h-[200px]",
        /** Full-size binder preview for the binder showcase section. */
        full: "w-[300px] h-[340px] sm:w-[340px] sm:h-[380px]",
      },
    },
    defaultVariants: {
      variant: "full",
    },
  },
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DocumentPreviewProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof documentPreviewVariants> {
  /**
   * Whether to display the SHA-256 evidence hash at the bottom of
   * the front card. Disabled by default in compact mode.
   * @default true
   */
  showHash?: boolean;
}

// ---------------------------------------------------------------------------
// Internal sub-components (not exported -- composition details)
// ---------------------------------------------------------------------------

/**
 * Back page: Evidence documentation with hash integrity display.
 * Rotated -4deg and offset to create the leftmost fanned page.
 */
function BackPage({
  variant,
  showHash,
}: {
  variant: "compact" | "full";
  showHash: boolean;
}) {
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "absolute inset-0 rounded-lg border border-border/30 bg-card/80 transition-transform duration-300 ease-[var(--ease-default)]",
        "shadow-[var(--shadow-sm)]",
        "group-hover:-translate-y-1",
        isCompact
          ? "origin-bottom-left -rotate-3 translate-x-1 translate-y-1"
          : "-rotate-[4deg] translate-x-1.5 translate-y-1.5",
      )}
      aria-hidden="true"
    >
      <div className={cn(isCompact ? "p-2" : "p-4")}>
        {/* Evidence header */}
        <div className="flex items-center gap-1.5">
          <FileText
            className={cn(
              "text-muted-foreground",
              isCompact ? "size-3" : "size-3.5",
            )}
            aria-hidden="true"
          />
          <span
            className={cn(
              "text-eyebrow text-muted-foreground",
              isCompact ? "text-[8px]" : "text-[10px]",
            )}
          >
            Evidence Documentation
          </span>
        </div>

        {/* Simulated document lines */}
        <div
          className={cn(
            "mt-3 space-y-2",
            isCompact ? "mt-2 space-y-1.5" : "mt-4 space-y-2.5",
          )}
        >
          <div className="h-1.5 w-4/5 rounded-full bg-border/40" />
          <div className="h-1.5 w-3/5 rounded-full bg-border/40" />
          <div className="h-1.5 w-2/3 rounded-full bg-border/40" />
          {!isCompact && (
            <>
              <div className="h-1.5 w-3/4 rounded-full bg-border/40" />
              <div className="h-1.5 w-1/2 rounded-full bg-border/40" />
            </>
          )}
        </div>

        {/* SHA-256 hash */}
        {showHash && !isCompact && (
          <div className="mt-4 border-t border-border/30 pt-2">
            <code className="text-mono-sm text-muted-foreground">
              sha256: e3b0c44298fc1c14...
            </code>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Middle page: Risk assessment bars and review findings checklist.
 * No rotation (0deg), slight offset for layering depth.
 */
function MiddlePage({ variant }: { variant: "compact" | "full" }) {
  const isCompact = variant === "compact";

  const riskItems = [
    { label: "Transportation", level: "low" as const, width: "w-[85%]" },
    { label: "Accommodation", level: "low" as const, width: "w-[90%]" },
    { label: "Health Advisory", level: "medium" as const, width: "w-[60%]" },
    { label: "Political Stability", level: "high" as const, width: "w-[35%]" },
  ] as const;

  const riskColorMap = {
    low: "bg-safety-green",
    medium: "bg-safety-yellow",
    high: "bg-safety-red",
  } as const;

  const riskBarBgMap = {
    low: "bg-safety-green/20",
    medium: "bg-safety-yellow/20",
    high: "bg-safety-red/20",
  } as const;

  const findings = [
    { text: "Venue Safety Verified", done: true },
    { text: "Transport Assessed", done: true },
    { text: "Emergency Plan Complete", done: true },
    { text: "Health Advisory Active", done: false },
  ] as const;

  return (
    <div
      className={cn(
        "absolute inset-0 rounded-lg border border-border/30 bg-card/90 transition-transform duration-300 ease-[var(--ease-default)]",
        "shadow-[var(--shadow-md)]",
        "group-hover:-translate-y-0.5",
        isCompact
          ? "translate-x-0.5 translate-y-0.5"
          : "translate-x-0.5 translate-y-0.5",
      )}
      aria-hidden="true"
    >
      <div className={cn(isCompact ? "p-2.5" : "p-4")}>
        {/* Section label */}
        <span
          className={cn(
            "text-eyebrow text-muted-foreground",
            isCompact ? "text-[8px]" : "text-[10px]",
          )}
        >
          Risk Assessment
        </span>

        {/* Risk assessment bars */}
        <div
          className={cn(
            "mt-2 space-y-1.5",
            isCompact ? "mt-1.5 space-y-1" : "mt-3 space-y-2",
          )}
        >
          {riskItems
            .slice(0, isCompact ? 3 : 4)
            .map((item) => (
              <div key={item.label} className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-card-foreground",
                      isCompact
                        ? "text-[7px] leading-tight"
                        : "text-[9px] leading-tight",
                    )}
                  >
                    {item.label}
                  </span>
                </div>
                <div
                  className={cn(
                    "w-full overflow-hidden rounded-full",
                    riskBarBgMap[item.level],
                    isCompact ? "h-1" : "h-1.5",
                  )}
                >
                  <div
                    className={cn(
                      "h-full rounded-full",
                      riskColorMap[item.level],
                      item.width,
                    )}
                  />
                </div>
              </div>
            ))}
        </div>

        {/* Review findings checklist */}
        {!isCompact && (
          <div className="mt-3 space-y-1.5 border-t border-border/30 pt-2.5">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              Review Findings
            </span>
            <div className="space-y-1">
              {findings.map((finding) => (
                <div
                  key={finding.text}
                  className="flex items-center gap-1.5"
                >
                  <div
                    className={cn(
                      "flex size-3 shrink-0 items-center justify-center rounded-full",
                      finding.done ? "bg-safety-green" : "bg-safety-yellow",
                    )}
                  >
                    {finding.done ? (
                      <Check className="size-2 text-white" strokeWidth={3} />
                    ) : (
                      <AlertTriangle
                        className="size-2 text-white"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                  <span className="text-[9px] leading-tight text-card-foreground">
                    {finding.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Front page (top card): SafeTrekr header, Safety Binder title,
 * org name, dates, and Verified badge.
 * Rotated +4deg to complete the fan effect.
 */
function FrontPage({
  variant,
  showHash,
}: {
  variant: "compact" | "full";
  showHash: boolean;
}) {
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "absolute inset-0 rounded-lg border border-border bg-card transition-transform duration-300 ease-[var(--ease-default)]",
        "shadow-[var(--shadow-lg)]",
        "group-hover:-translate-y-1.5",
        isCompact
          ? "origin-bottom-right rotate-2"
          : "rotate-[4deg]",
      )}
    >
      {/* Green header bar */}
      <div
        className={cn(
          "flex items-center gap-1.5 rounded-t-lg bg-primary-600",
          isCompact ? "px-2.5 py-1.5" : "px-4 py-2.5",
        )}
      >
        <ShieldCheck
          className={cn(
            "text-primary-foreground",
            isCompact ? "size-3" : "size-4",
          )}
          aria-hidden="true"
        />
        <span
          className={cn(
            "font-display font-bold text-primary-foreground",
            isCompact ? "text-[9px]" : "text-[11px]",
          )}
        >
          SafeTrekr
        </span>
      </div>

      {/* Card body */}
      <div className={cn(isCompact ? "p-2.5" : "p-4")}>
        {/* Title + Verified badge row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div
              className={cn(
                "font-display font-bold text-card-foreground",
                isCompact ? "text-[10px]" : "text-sm",
              )}
            >
              Safety Binder
            </div>
            <p
              className={cn(
                "mt-0.5 text-muted-foreground",
                isCompact ? "text-[7px]" : "text-[10px]",
              )}
            >
              Westfield Academy
            </p>
          </div>
          <Badge
            className={cn(
              "shrink-0 border-primary-200 bg-primary-50 text-primary-700",
              isCompact
                ? "px-1 py-0 text-[6px]"
                : "px-1.5 py-0 text-[9px]",
            )}
          >
            <ShieldCheck
              className={cn(isCompact ? "mr-0.5 size-2" : "mr-0.5 size-2.5")}
              aria-hidden="true"
            />
            Verified
          </Badge>
        </div>

        {/* Trip details */}
        <div
          className={cn(
            "mt-2 space-y-1 border-t border-border/50 pt-2",
            isCompact ? "mt-1.5 space-y-0.5 pt-1.5" : "mt-3 space-y-1.5 pt-2.5",
          )}
        >
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-muted-foreground",
                isCompact ? "text-[7px]" : "text-[9px]",
              )}
            >
              Trip
            </span>
            <span
              className={cn(
                "font-medium text-card-foreground",
                isCompact ? "text-[7px]" : "text-[9px]",
              )}
            >
              Barcelona Study Tour
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-muted-foreground",
                isCompact ? "text-[7px]" : "text-[9px]",
              )}
            >
              Dates
            </span>
            <span
              className={cn(
                "font-medium text-card-foreground",
                isCompact ? "text-[7px]" : "text-[9px]",
              )}
            >
              Mar 15 - 22, 2026
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-muted-foreground",
                isCompact ? "text-[7px]" : "text-[9px]",
              )}
            >
              Reviewed
            </span>
            <span
              className={cn(
                "font-medium text-card-foreground",
                isCompact ? "text-[7px]" : "text-[9px]",
              )}
            >
              Mar 12, 2026
            </span>
          </div>
        </div>

        {/* SHA-256 hash line */}
        {showHash && (
          <div
            className={cn(
              "mt-2 border-t border-border/50 pt-1.5",
              isCompact ? "mt-1.5 pt-1" : "mt-3 pt-2",
            )}
          >
            <code
              className={cn(
                "text-muted-foreground",
                isCompact ? "text-mono-sm text-[6px]" : "text-mono-sm",
              )}
            >
              a3f2d8...c891e4
            </code>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * Stacked paper composition that mimics a SafeTrekr safety binder.
 *
 * Three layered cards with slight rotation and offset create a "fanned pages"
 * effect. Each page represents a different section of the safety binder:
 *
 * - **Back page** (rotate -4deg): Evidence documentation with SHA-256 hash
 * - **Middle page** (0deg): Risk assessment bars and review findings checklist
 * - **Front page** (rotate +4deg): SafeTrekr header, binder title, org, dates
 *
 * The component is purely presentational and decorative. It uses `aria-hidden`
 * on internal layers since the visual serves a marketing illustration purpose.
 *
 * @example
 * ```tsx
 * // Full-size binder in showcase section
 * <DocumentPreview variant="full" showHash />
 *
 * // Compact preview in hero overlay
 * <DocumentPreview variant="compact" showHash={false} />
 *
 * // With custom positioning
 * <DocumentPreview variant="full" className="absolute right-0 bottom-0" />
 * ```
 *
 * @see designs/html/mockup-homepage.html -- binder showcase section
 */
function DocumentPreview({
  variant = "full",
  showHash = true,
  className,
  ...props
}: DocumentPreviewProps) {
  const resolvedVariant = variant ?? "full";

  return (
    <div
      className={cn(
        documentPreviewVariants({ variant: resolvedVariant }),
        "group",
        className,
      )}
      // The entire composition is decorative marketing illustration.
      // Screen readers should skip the visual detail and rely on
      // surrounding section copy to convey the binder concept.
      role="img"
      aria-label="Stacked safety binder document preview showing risk assessments, review findings, and tamper-evident hash verification"
      {...props}
    >
      {/* Layer 1 (back): Evidence documentation */}
      <BackPage variant={resolvedVariant} showHash={showHash} />

      {/* Layer 2 (middle): Risk assessment + findings */}
      <MiddlePage variant={resolvedVariant} />

      {/* Layer 3 (front): Binder cover with org details */}
      <FrontPage variant={resolvedVariant} showHash={showHash} />
    </div>
  );
}
DocumentPreview.displayName = "DocumentPreview";

export { DocumentPreview, documentPreviewVariants };
export type { DocumentPreviewProps as DocumentPreviewComponentProps };
