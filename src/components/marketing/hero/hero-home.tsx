"use client";

/**
 * ST-836: REQ-046 -- HeroHome Component
 * ST-857: REQ-057 -- Hero Animation Orchestrator Integration
 *
 * Primary hero section for the SafeTrekr marketing homepage. Features a
 * 12-column grid layout (5-col text / 7-col visual on desktop, stacked
 * on mobile) with a choreographed 12-stage entrance animation.
 *
 * Visual composition layers (desktop):
 *   1. HeroMap -- progressive-enhancement map background (14:10 aspect)
 *   2. Trip Review Progress Panel -- review checklist with progress bar
 *   3. Evidence Binder Card -- stacked paper with verified badge + hash
 *   4. Readiness Gauge -- circular SVG progress indicator
 *
 * Mobile: simplified to map fragment only (no overlay cards).
 *
 * Animation (ST-857): The 12-stage choreographed sequence is defined
 * in `hero-animation.tsx` and consumed here via `useHeroAnimation`.
 * Each overlay card now has its own individually-timed entrance rather
 * than appearing as a group. See HERO_TIMELINE for the full spec.
 *
 * @see designs/html/mockup-homepage.html (lines 363-532)
 * @see designs/DESIGN-SYSTEM.md section 13 (Hero Composition Spec)
 * @see ./hero-animation.tsx (animation timeline source of truth)
 */

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroMap } from "@/components/maps/hero-map";
import { MapStaticFallback } from "@/components/maps/map-static-fallback";

import {
  useHeroAnimation,
  createHeroProgressBarTransition,
  createHeroGaugeTransition,
  type HeroAnimationVariants,
} from "./hero-animation";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Trip review checklist items displayed on the overlay card. */
const REVIEW_ITEMS = [
  "Venue Safety",
  "Transportation",
  "Emergency Plan",
  "Health Advisory",
] as const;

// ---------------------------------------------------------------------------
// Sub-components (internal -- not exported)
// ---------------------------------------------------------------------------

/**
 * Shield icon for the eyebrow pre-heading.
 * Matches the mockup: 24x24 viewBox, shield with check path.
 */
function ShieldIcon() {
  return (
    <svg
      className="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        d="M12 2L4 7v6c0 5.5 3.4 10.7 8 12 4.6-1.3 8-6.5 8-12V7l-8-5z"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Animated overlay cards
// ---------------------------------------------------------------------------

interface AnimatedOverlayProps {
  /** Framer Motion animate target: "visible" or "hidden" */
  animate: "visible" | "hidden";
  /** Whether the user prefers reduced motion */
  prefersReducedMotion: boolean | null;
  /** Pre-built variant objects from useHeroAnimation */
  variants: HeroAnimationVariants;
}

/**
 * Layer 2: Trip Safety Review progress panel.
 * Positioned absolute top-right of the visual column.
 *
 * ST-857: Now animated individually at stage 5 (500ms) via reviewPanel
 * slideInRight variant. Progress bar animates at stage 9 (1000ms).
 * "Trip Ready" badge animates at stage 12 (1400ms).
 */
function TripReviewCard({
  animate,
  prefersReducedMotion,
  variants,
}: AnimatedOverlayProps) {
  const progressTransition = createHeroProgressBarTransition(prefersReducedMotion);

  return (
    <motion.div
      className="absolute hidden lg:block rounded-xl bg-card border border-border p-5"
      style={{
        width: 260,
        top: -20,
        right: -10,
        zIndex: 10,
        boxShadow: "var(--shadow-xl)",
      }}
      variants={variants.reviewPanel}
      initial="hidden"
      animate={animate}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-heading-sm text-foreground" style={{ fontSize: 18 }}>
          Trip Safety Review
        </span>
        <Badge variant="brand" className="text-[11px] px-2 py-0.5">
          Reviewed
        </Badge>
      </div>

      {/* Checklist */}
      <div className="flex flex-col gap-3 mb-4">
        {REVIEW_ITEMS.map((item) => (
          <div key={item} className="flex items-center gap-2">
            <Check
              className="size-4 shrink-0 text-primary-500"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span className="text-body-sm text-foreground">{item}</span>
          </div>
        ))}
      </div>

      {/* Progress bar -- Stage 9: 1000ms */}
      <div className="w-full h-2 rounded-full bg-primary-100">
        <motion.div
          className="h-full rounded-full bg-primary-500"
          initial={{ width: 0 }}
          animate={{ width: "85%" }}
          transition={progressTransition}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-body-sm font-semibold text-foreground">
          85% complete
        </span>
        {/* "Trip Ready" badge -- Stage 12: 1400ms */}
        <motion.div
          variants={variants.tripReadyBadge}
          initial="hidden"
          animate={animate}
        >
          <Badge
            variant="brand"
            className="text-[10px] px-2 py-0"
          >
            Trip Ready
          </Badge>
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Layer 3: Evidence Binder document preview.
 * Stacked paper effect with offset back sheets.
 * Positioned absolute right side, below the trip review card.
 *
 * ST-857: Now animated individually at stage 6 (600ms) via
 * documentPreview fadeIn variant.
 */
function EvidenceBinderCard({
  animate,
  variants,
}: AnimatedOverlayProps) {
  return (
    <motion.div
      className="absolute hidden lg:block"
      style={{ right: -10, top: 290, zIndex: 20 }}
      variants={variants.documentPreview}
      initial="hidden"
      animate={animate}
    >
      {/* Stacked paper offset layers (back sheets) */}
      <div
        className="absolute rounded-lg bg-card/80 border border-border/30"
        style={{
          width: 220,
          height: 160,
          top: 4,
          left: 4,
          boxShadow: "var(--shadow-sm)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute rounded-lg bg-card/90 border border-border/30"
        style={{
          width: 220,
          height: 160,
          top: 2,
          left: 2,
          boxShadow: "var(--shadow-sm)",
        }}
        aria-hidden="true"
      />

      {/* Front sheet */}
      <div
        className="relative rounded-lg bg-card border border-border p-4"
        style={{
          width: 220,
          height: 160,
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <span
          className="text-eyebrow block text-muted-foreground"
          style={{ fontSize: 10 }}
        >
          EVIDENCE BINDER
        </span>

        <div className="flex items-center gap-1.5 mt-1.5">
          <Badge variant="brand" className="text-[10px] px-1.5 py-0">
            Verified
          </Badge>
          <span
            className="size-1.5 rounded-full bg-safety-green"
            aria-hidden="true"
          />
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-start gap-2">
            <div className="size-1.5 rounded-full mt-1.5 shrink-0 bg-primary-500" />
            <span className="text-[11px] text-foreground leading-tight">
              Risk assessment completed
            </span>
          </div>
          <div className="flex items-start gap-2">
            <div className="size-1.5 rounded-full mt-1.5 shrink-0 bg-primary-500" />
            <span className="text-[11px] text-foreground leading-tight">
              Documentation finalized
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-border">
          <code className="font-mono text-[10px] text-muted-foreground tracking-wide">
            a3f2...c891
          </code>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Layer 4: Readiness Gauge -- circular SVG progress indicator.
 * Positioned absolute bottom-left of the visual column.
 *
 * ST-857: Gauge arc animates at stage 10 (1100ms), status dot pulses
 * at stage 11 (1200ms). Both now use the orchestrated timeline delays.
 *
 * Circumference of r=32 circle = 2 * PI * 32 ~= 201.06
 * 85% fill => strokeDashoffset = 201.06 * (1 - 0.85) = ~30.16
 */
function ReadinessGauge({
  animate,
  prefersReducedMotion,
  variants,
}: AnimatedOverlayProps) {
  const circumference = 2 * Math.PI * 32; // ~201.06
  const fillPercent = 0.85;
  const gaugeTransition = createHeroGaugeTransition(prefersReducedMotion);

  return (
    <div
      className="absolute hidden lg:block rounded-xl bg-card border border-border p-4 text-center"
      style={{
        bottom: -16,
        left: 24,
        zIndex: 15,
        width: 120,
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <svg
        viewBox="0 0 72 72"
        width={72}
        height={72}
        className="mx-auto"
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx={36}
          cy={36}
          r={32}
          fill="none"
          stroke="var(--color-primary-100)"
          strokeWidth={4}
          transform="rotate(-90 36 36)"
        />
        {/* Animated fill arc -- Stage 10: 1100ms */}
        <motion.circle
          cx={36}
          cy={36}
          r={32}
          fill="none"
          stroke="var(--color-primary-500)"
          strokeWidth={4}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference * (1 - fillPercent),
          }}
          transition={gaugeTransition}
        />
        {/* Center text */}
        <text
          x={36}
          y={34}
          textAnchor="middle"
          className="font-display font-semibold text-[16px] fill-foreground"
        >
          85%
        </text>
        <text
          x={36}
          y={48}
          textAnchor="middle"
          className="font-body text-[8px] fill-muted-foreground"
        >
          Trip Ready
        </text>
      </svg>

      {/* Active status indicator -- Stage 11: 1200ms */}
      <div className="flex items-center justify-center gap-1 mt-1">
        <motion.span
          className="size-2 rounded-full bg-safety-green"
          aria-hidden="true"
          variants={variants.statusDot}
          initial="hidden"
          animate={animate}
        />
        <span className="text-[10px] text-muted-foreground">Active</span>
      </div>
    </div>
  );
}

/**
 * Mobile-only simplified map composition.
 * Renders a lightweight SVG route visualization without overlay cards.
 */
function MobileMapFragment() {
  return (
    <div
      className="md:hidden relative rounded-xl overflow-hidden border border-border"
      style={{
        aspectRatio: "16/10",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <MapStaticFallback showRoute className="h-full w-full" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export interface HeroHomeProps {
  /** Additional CSS class names applied to the outer section. */
  className?: string;
}

/**
 * Homepage hero section with animated text + product composition.
 *
 * Renders a 12-column grid with a 12-stage choreographed entrance:
 * - Left (5 cols): eyebrow, headline, subheadline, dual CTAs
 * - Right (7 cols): 4-layer product composition with map, review
 *   card, evidence binder, and readiness gauge -- each individually
 *   timed per the HERO_TIMELINE in hero-animation.tsx
 *
 * On mobile, the layout stacks vertically and the visual column
 * is simplified to just the map fragment (no overlay cards).
 *
 * @example
 * ```tsx
 * <HeroHome />
 * ```
 */
export function HeroHome({ className }: HeroHomeProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // ST-857: All animation state comes from the centralized orchestrator
  const {
    shouldAnimate,
    prefersReducedMotion,
    variants,
  } = useHeroAnimation({ sectionRef });

  const animateTarget = shouldAnimate ? "visible" as const : "hidden" as const;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className={cn(
        "relative overflow-hidden bg-background",
        // Responsive vertical padding matching mockup spec
        "pt-28 pb-20 md:pt-[140px] md:pb-24 lg:pt-[160px] lg:pb-32",
        className,
      )}
    >
      {/* -- Background: dot grid pattern -- */}
      <div
        className="absolute inset-0 pointer-events-none bg-dot-grid"
        aria-hidden="true"
      />

      {/* -- Background: radial glow -- */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px circle at 70% 50%, rgba(241,249,244,0.2), transparent)",
        }}
        aria-hidden="true"
      />

      {/* -- Content -- */}
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 items-center">
          {/* ────────────────────────────────────
              Text Column (5 cols on desktop)
              ──────────────────────────────────── */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Eyebrow -- Stage 1: 0ms */}
            <motion.div
              variants={variants.headline}
              initial="hidden"
              animate={animateTarget}
            >
              <Eyebrow
                color="primary"
                icon={<ShieldIcon />}
              >
                TRIP SAFETY MANAGEMENT PLATFORM
              </Eyebrow>
            </motion.div>

            {/* Headline -- Stage 1: 0ms */}
            <motion.h1
              id="hero-heading"
              className="text-display-xl mt-4 text-foreground"
              style={{ maxWidth: "20ch" }}
              variants={variants.headline}
              initial="hidden"
              animate={animateTarget}
            >
              Every trip professionally reviewed.
            </motion.h1>

            {/* Subheadline -- Stage 2: 150ms */}
            <motion.p
              className="text-body-lg mt-6 text-muted-foreground"
              style={{ maxWidth: "50ch" }}
              variants={variants.subtext}
              initial="hidden"
              animate={animateTarget}
            >
              SafeTrekr combines current information from trusted sources,
              comprehensive professional review, and board-ready documentation to
              support your travelers and your organization.
            </motion.p>

            {/* CTAs -- Stage 3: 300ms */}
            <motion.div
              className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8"
              variants={variants.ctas}
              initial="hidden"
              animate={animateTarget}
            >
              <Button variant="primary" size="lg" asChild>
                <a href="/resources/sample-binders">
                  See Sample Binder
                  <ArrowRight className="size-5" aria-hidden="true" />
                </a>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <a href="/demo">
                  Schedule a Demo
                  <ArrowRight className="size-5" aria-hidden="true" />
                </a>
              </Button>
            </motion.div>
          </div>

          {/* ────────────────────────────────────
              Visual Column (7 cols on desktop)
              ──────────────────────────────────── */}

          {/* Desktop: full 4-layer product composition */}
          <motion.div
            className="lg:col-span-7 relative hidden md:block"
            style={{ minHeight: 440 }}
            variants={variants.mapPanel}
            initial="hidden"
            animate={animateTarget}
          >
            {/* Layer 1: Map base -- Stage 4: 400ms (container fadeIn) */}
            <HeroMap
              className="w-full max-w-[560px] rounded-xl"
              showRoute
              interactive={false}
            />

            {/* Layer 2: Trip Review Progress Panel -- Stage 5: 500ms */}
            <TripReviewCard
              animate={animateTarget}
              prefersReducedMotion={prefersReducedMotion}
              variants={variants}
            />

            {/* Layer 3: Evidence Binder Document Preview -- Stage 6: 600ms */}
            <EvidenceBinderCard
              animate={animateTarget}
              prefersReducedMotion={prefersReducedMotion}
              variants={variants}
            />

            {/* Layer 4: Readiness Gauge -- Stage 10: 1100ms */}
            <ReadinessGauge
              animate={animateTarget}
              prefersReducedMotion={prefersReducedMotion}
              variants={variants}
            />
          </motion.div>

          {/* Mobile: simplified map fragment (no overlay cards) */}
          <motion.div
            className="md:hidden"
            variants={variants.mapPanel}
            initial="hidden"
            animate={animateTarget}
          >
            <MobileMapFragment />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

HeroHome.displayName = "HeroHome";
export default HeroHome;
