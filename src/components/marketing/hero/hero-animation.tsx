"use client";

/**
 * ST-857: REQ-057 -- Hero Animation Orchestrator
 *
 * Single source of truth for the homepage hero's 12-stage choreographed
 * entrance sequence. This module exports:
 *
 *   1. `HERO_TIMELINE` -- the authoritative stage map (element -> delay ms)
 *   2. `useHeroAnimation` -- a hook that provides animation state + variants
 *   3. Stage-specific Framer Motion variant factories
 *
 * The 1800ms choreographed sequence (design spec):
 * -----------------------------------------------
 *   Stage  1 |   0ms | Headline fadeUp
 *   Stage  2 | 150ms | Subtext fadeUp
 *   Stage  3 | 300ms | CTA buttons fadeUp
 *   Stage  4 | 400ms | Map panel fadeIn
 *   Stage  5 | 500ms | Review panel slideIn from right
 *   Stage  6 | 600ms | Document preview fadeIn
 *   Stage  7 | 700ms | Route line draws across map
 *   Stage  8 | 900ms | Waypoint dots appear with stagger
 *   Stage  9 |1000ms | Progress bar fills to 85%
 *   Stage 10 |1100ms | Readiness gauge arc animates
 *   Stage 11 |1200ms | Status dot pulse
 *   Stage 12 |1400ms | "Trip Ready" badge appears
 *
 * Total choreography window: ~1800ms (last stage at 1400ms + ~400ms duration).
 *
 * Reduced motion: When `prefers-reduced-motion: reduce` is active, all delays
 * collapse to 0 and physical motion (translate, scale) is suppressed. Elements
 * appear instantly with opacity-only transitions.
 *
 * Relationship to HeroHome (ST-836):
 * HeroHome originally defined a 4-stage STAGGER constant for the text column
 * and used inline delays for overlay card sub-animations. This module
 * supersedes those inline values as the authoritative timeline, and HeroHome
 * now consumes `useHeroAnimation` instead.
 *
 * @see designs/DESIGN-SYSTEM.md section 13 (Hero Composition Spec)
 * @see src/components/marketing/hero/hero-home.tsx
 * @see src/lib/motion.ts (shared easing/duration tokens)
 */

import { useState, useEffect, useRef, useMemo } from "react";
import type { Variants, Transition } from "framer-motion";
import { useInView } from "framer-motion";

import { durations, easings, useReducedMotion } from "@/lib/motion";

// ---------------------------------------------------------------------------
// Timeline Constants
// ---------------------------------------------------------------------------

/**
 * All 12 animation stages keyed by element name.
 * Values are delay offsets in milliseconds from the sequence start.
 *
 * These are the authoritative values -- do not duplicate them elsewhere.
 */
export const HERO_TIMELINE = {
  /** Stage 1: Primary headline text */
  headline: 0,
  /** Stage 2: Supporting description paragraph */
  subtext: 150,
  /** Stage 3: Call-to-action button group */
  ctas: 300,
  /** Stage 4: Map panel container fadeIn */
  mapPanel: 400,
  /** Stage 5: Trip review progress card slideIn from right */
  reviewPanel: 500,
  /** Stage 6: Evidence binder document preview fadeIn */
  documentPreview: 600,
  /** Stage 7: SVG route line draws across the map */
  routeLine: 700,
  /** Stage 8: Waypoint marker dots appear with internal stagger */
  waypointDots: 900,
  /** Stage 9: Progress bar fills to 85% */
  progressBar: 1000,
  /** Stage 10: Circular readiness gauge arc animates */
  readinessGauge: 1100,
  /** Stage 11: Active status indicator dot pulse */
  statusDot: 1200,
  /** Stage 12: "Trip Ready" badge fades in */
  tripReadyBadge: 1400,
} as const;

/** Union type of all stage names in the hero timeline. */
export type HeroStage = keyof typeof HERO_TIMELINE;

/** Delay values in the timeline (milliseconds). */
export type HeroStageDelayMs = (typeof HERO_TIMELINE)[HeroStage];

/**
 * The same timeline with values converted to seconds for direct use
 * in Framer Motion `transition.delay` properties.
 */
export const HERO_STAGE_DELAYS_S = Object.fromEntries(
  Object.entries(HERO_TIMELINE).map(([key, ms]) => [key, ms / 1000]),
) as Readonly<Record<HeroStage, number>>;

/**
 * Total duration of the choreography window in milliseconds.
 * Calculated as the last stage delay + an estimated completion buffer.
 * The last stage (tripReadyBadge) starts at 1400ms and takes ~400ms,
 * so the full sequence completes around 1800ms.
 */
export const HERO_SEQUENCE_DURATION_MS = 1800;

/** Total duration in seconds. */
export const HERO_SEQUENCE_DURATION_S = HERO_SEQUENCE_DURATION_MS / 1000;

// ---------------------------------------------------------------------------
// Animation Durations (stage-specific)
// ---------------------------------------------------------------------------

/**
 * Per-stage animation durations in seconds.
 * Most stages use the shared motion tokens from `@/lib/motion`, but some
 * (route line draw, gauge arc) have longer custom durations.
 */
export const HERO_STAGE_DURATIONS_S: Readonly<Record<HeroStage, number>> = {
  headline: durations.medium,       // 0.3s
  subtext: durations.medium,        // 0.3s
  ctas: durations.medium,           // 0.3s
  mapPanel: durations.slow,         // 0.5s
  reviewPanel: durations.slow,      // 0.5s
  documentPreview: durations.slow,  // 0.5s
  routeLine: 1.2,                   // SVG path draw
  waypointDots: durations.medium,   // 0.3s per dot (staggered)
  progressBar: 1.0,                 // Bar fill
  readinessGauge: 1.2,             // Arc fill
  statusDot: 0.6,                   // Pulse
  tripReadyBadge: durations.medium, // 0.3s
};

// ---------------------------------------------------------------------------
// Variant Factories
// ---------------------------------------------------------------------------

/**
 * Creates a Framer Motion variant for a fade-up entrance at the specified
 * timeline stage. When reduced motion is preferred, physical motion is
 * suppressed and delay is zeroed.
 */
export function createHeroFadeUp(
  stage: HeroStage,
  reduceMotion: boolean | null,
): Variants {
  const delay = reduceMotion ? 0 : HERO_STAGE_DELAYS_S[stage];
  const duration = reduceMotion ? 0 : HERO_STAGE_DURATIONS_S[stage];

  return {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: easings.enter as [number, number, number, number],
        delay,
      },
    },
  };
}

/**
 * Creates a fade-in variant (no vertical motion) for the specified stage.
 * Used for map panel and document preview elements.
 */
export function createHeroFadeIn(
  stage: HeroStage,
  reduceMotion: boolean | null,
): Variants {
  const delay = reduceMotion ? 0 : HERO_STAGE_DELAYS_S[stage];
  const duration = reduceMotion ? 0 : HERO_STAGE_DURATIONS_S[stage];

  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration,
        ease: easings.default as [number, number, number, number],
        delay,
      },
    },
  };
}

/**
 * Creates a slide-in-from-right variant for the specified stage.
 * Used for the review panel overlay card.
 */
export function createHeroSlideInRight(
  stage: HeroStage,
  reduceMotion: boolean | null,
): Variants {
  const delay = reduceMotion ? 0 : HERO_STAGE_DELAYS_S[stage];
  const duration = reduceMotion ? 0 : HERO_STAGE_DURATIONS_S[stage];

  return {
    hidden: { opacity: 0, x: reduceMotion ? 0 : 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration,
        ease: easings.enter as [number, number, number, number],
        delay,
      },
    },
  };
}

/**
 * Creates the route-line-draw variant. Animates SVG `pathLength` from 0 to 1.
 */
export function createHeroRouteDraw(
  reduceMotion: boolean | null,
): Variants {
  const delay = reduceMotion ? 0 : HERO_STAGE_DELAYS_S.routeLine;
  const duration = reduceMotion ? 0 : HERO_STAGE_DURATIONS_S.routeLine;

  return {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration,
        ease: easings.default as [number, number, number, number],
        delay,
      },
    },
  };
}

/**
 * Creates the waypoint-dot-pop variant with internal stagger.
 * Each dot pops in with a spring ease; the `staggerChildren` value
 * spaces them 80ms apart starting at the waypointDots stage delay.
 */
export function createHeroWaypointContainer(
  reduceMotion: boolean | null,
): Variants {
  const delay = reduceMotion ? 0 : HERO_STAGE_DELAYS_S.waypointDots;

  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: delay,
      },
    },
  };
}

/**
 * Individual waypoint dot variant (child of the waypoint container).
 */
export function createHeroWaypointDot(
  reduceMotion: boolean | null,
): Variants {
  return {
    hidden: { scale: reduceMotion ? 1 : 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0 : HERO_STAGE_DURATIONS_S.waypointDots,
        ease: easings.spring as [number, number, number, number],
      },
    },
  };
}

/**
 * Creates the progress bar fill transition (not a variant -- returns
 * a Transition object for use with `animate` prop directly).
 */
export function createHeroProgressBarTransition(
  reduceMotion: boolean | null,
): Transition {
  return {
    duration: reduceMotion ? 0 : HERO_STAGE_DURATIONS_S.progressBar,
    delay: reduceMotion ? 0 : HERO_STAGE_DELAYS_S.progressBar,
    ease: easings.default as [number, number, number, number],
  };
}

/**
 * Creates the readiness gauge arc fill transition.
 */
export function createHeroGaugeTransition(
  reduceMotion: boolean | null,
): Transition {
  return {
    duration: reduceMotion ? 0 : HERO_STAGE_DURATIONS_S.readinessGauge,
    delay: reduceMotion ? 0 : HERO_STAGE_DELAYS_S.readinessGauge,
    ease: easings.default as [number, number, number, number],
  };
}

/**
 * Creates the status dot pulse variant.
 */
export function createHeroStatusPulse(
  reduceMotion: boolean | null,
): Variants {
  const delay = reduceMotion ? 0 : HERO_STAGE_DELAYS_S.statusDot;

  return {
    hidden: { scale: reduceMotion ? 1 : 0, opacity: 0 },
    visible: {
      scale: reduceMotion ? 1 : [0, 1.4, 1],
      opacity: reduceMotion ? 1 : [0, 1, 1],
      transition: {
        duration: reduceMotion ? 0 : HERO_STAGE_DURATIONS_S.statusDot,
        delay,
        ease: easings.spring as [number, number, number, number],
      },
    },
  };
}

/**
 * Creates the "Trip Ready" badge fade-in variant (final stage).
 */
export function createHeroTripReadyBadge(
  reduceMotion: boolean | null,
): Variants {
  const delay = reduceMotion ? 0 : HERO_STAGE_DELAYS_S.tripReadyBadge;
  const duration = reduceMotion ? 0 : HERO_STAGE_DURATIONS_S.tripReadyBadge;

  return {
    hidden: {
      opacity: 0,
      scale: reduceMotion ? 1 : 0.9,
      y: reduceMotion ? 0 : 4,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration,
        ease: easings.spring as [number, number, number, number],
        delay,
      },
    },
  };
}

// ---------------------------------------------------------------------------
// useHeroAnimation Hook
// ---------------------------------------------------------------------------

export interface HeroAnimationState {
  /**
   * Whether the full 12-stage sequence has completed.
   * Becomes `true` approximately 1800ms after the animation starts.
   * Always `true` immediately when reduced motion is preferred.
   */
  isAnimationComplete: boolean;

  /**
   * Stage delay map in seconds, ready for Framer Motion `transition.delay`.
   * When reduced motion is active, all values are 0.
   */
  stageDelays: Readonly<Record<HeroStage, number>>;

  /**
   * Whether animations should play. `false` when:
   * - The hero section is not yet in the viewport
   * - (Reduced motion users still get `shouldAnimate: true` once in view,
   *   but all delays/durations are 0 so elements appear instantly.)
   */
  shouldAnimate: boolean;

  /**
   * Whether the user prefers reduced motion.
   * Consumers can use this to skip non-essential decorative animations.
   */
  prefersReducedMotion: boolean | null;

  /**
   * Pre-built variant objects for each animation stage.
   * Memoized per render based on reduced motion preference.
   */
  variants: HeroAnimationVariants;
}

export interface HeroAnimationVariants {
  headline: Variants;
  subtext: Variants;
  ctas: Variants;
  mapPanel: Variants;
  reviewPanel: Variants;
  documentPreview: Variants;
  routeDraw: Variants;
  waypointContainer: Variants;
  waypointDot: Variants;
  statusDot: Variants;
  tripReadyBadge: Variants;
}

export interface UseHeroAnimationOptions {
  /**
   * Ref to the hero section element for viewport detection.
   * The animation sequence starts when this element enters the viewport.
   */
  sectionRef: React.RefObject<HTMLElement | null>;

  /**
   * Fraction of the element that must be visible to trigger.
   * @default 0.1
   */
  viewportAmount?: number;
}

/**
 * Orchestrates the 12-stage hero entrance animation sequence.
 *
 * Provides:
 * - Viewport-aware animation trigger via `useInView`
 * - Reduced motion support (instant appearance, no physical motion)
 * - Pre-built Framer Motion variants for every stage
 * - Completion tracking for downstream effects
 *
 * @example
 * ```tsx
 * function HeroHome() {
 *   const sectionRef = useRef<HTMLElement>(null);
 *   const {
 *     shouldAnimate,
 *     variants,
 *     isAnimationComplete,
 *   } = useHeroAnimation({ sectionRef });
 *
 *   return (
 *     <section ref={sectionRef}>
 *       <motion.h1
 *         variants={variants.headline}
 *         initial="hidden"
 *         animate={shouldAnimate ? "visible" : "hidden"}
 *       >
 *         Every trip professionally reviewed.
 *       </motion.h1>
 *     </section>
 *   );
 * }
 * ```
 */
export function useHeroAnimation({
  sectionRef,
  viewportAmount = 0.1,
}: UseHeroAnimationOptions): HeroAnimationState {
  const isInView = useInView(sectionRef, { once: true, amount: viewportAmount });
  const prefersReducedMotion = useReducedMotion();

  // Track sequence completion
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Determine if animation should play
  // Reduced motion users: animate immediately (delays will be 0)
  const shouldAnimate = prefersReducedMotion ? true : isInView;

  // Start completion timer when animation begins
  useEffect(() => {
    if (!shouldAnimate || isAnimationComplete) return;

    if (prefersReducedMotion) {
      // Reduced motion: complete immediately
      setIsAnimationComplete(true);
      return;
    }

    // Wait for the full choreography window to elapse
    timerRef.current = setTimeout(() => {
      setIsAnimationComplete(true);
      timerRef.current = null;
    }, HERO_SEQUENCE_DURATION_MS);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [shouldAnimate, prefersReducedMotion, isAnimationComplete]);

  // Build stage delays (0 when reduced motion)
  const stageDelays = useMemo<Readonly<Record<HeroStage, number>>>(() => {
    if (prefersReducedMotion) {
      return Object.fromEntries(
        Object.keys(HERO_TIMELINE).map((key) => [key, 0]),
      ) as Record<HeroStage, number>;
    }
    return HERO_STAGE_DELAYS_S;
  }, [prefersReducedMotion]);

  // Pre-build all variant objects, memoized on reduced motion preference
  const variants = useMemo<HeroAnimationVariants>(
    () => ({
      headline: createHeroFadeUp("headline", prefersReducedMotion),
      subtext: createHeroFadeUp("subtext", prefersReducedMotion),
      ctas: createHeroFadeUp("ctas", prefersReducedMotion),
      mapPanel: createHeroFadeIn("mapPanel", prefersReducedMotion),
      reviewPanel: createHeroSlideInRight("reviewPanel", prefersReducedMotion),
      documentPreview: createHeroFadeIn("documentPreview", prefersReducedMotion),
      routeDraw: createHeroRouteDraw(prefersReducedMotion),
      waypointContainer: createHeroWaypointContainer(prefersReducedMotion),
      waypointDot: createHeroWaypointDot(prefersReducedMotion),
      statusDot: createHeroStatusPulse(prefersReducedMotion),
      tripReadyBadge: createHeroTripReadyBadge(prefersReducedMotion),
    }),
    [prefersReducedMotion],
  );

  return {
    isAnimationComplete,
    stageDelays,
    shouldAnimate,
    prefersReducedMotion,
    variants,
  };
}

// ---------------------------------------------------------------------------
// Convenience: Animation callback hook
// ---------------------------------------------------------------------------

/**
 * Calls a callback when the hero animation sequence completes.
 * Useful for triggering downstream effects (analytics events,
 * lazy-loading below-fold content, etc.).
 *
 * @example
 * ```tsx
 * useHeroAnimationComplete(isAnimationComplete, () => {
 *   trackEvent("hero_animation_complete");
 * });
 * ```
 */
export function useHeroAnimationComplete(
  isComplete: boolean,
  callback: () => void,
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const hasFired = useRef(false);

  useEffect(() => {
    if (isComplete && !hasFired.current) {
      hasFired.current = true;
      callbackRef.current();
    }
  }, [isComplete]);
}
