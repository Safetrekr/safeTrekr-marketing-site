/**
 * ST-801: REQ-018 -- Motion Preset Library
 *
 * Centralized Framer Motion animation presets for the SafeTrekr marketing site.
 * All animation values live here -- no inline animation props anywhere in the
 * codebase. This module exports plain data objects, so it carries zero runtime
 * cost for Server Components.
 *
 * Motion mood: "Operational motion" -- composed, intentional, intelligent,
 * reassuring, slightly technical, and controlled.
 *
 * @see designs/DESIGN-SYSTEM.md section 7.4-7.8
 * @see plans/react-developer.md FR-050
 */

import type { Variants, Transition } from "framer-motion";

// Re-export useReducedMotion so consumers don't need a direct framer-motion
// import just for the hook. Kept as a named re-export to preserve tree-shaking.
export { useReducedMotion } from "framer-motion";

// ---------------------------------------------------------------------------
// Easing Curves
// ---------------------------------------------------------------------------

/**
 * Cubic bezier easing curves as tuples compatible with Framer Motion's
 * `transition.ease` property.
 *
 * Token names mirror the CSS custom properties in globals.css
 * (--ease-default, --ease-enter, etc.) so designers and engineers
 * share the same vocabulary.
 */
export const easings = {
  /** General-purpose transitions */
  default: [0.4, 0, 0.2, 1] as const,
  /** Elements entering the viewport */
  enter: [0, 0, 0.2, 1] as const,
  /** Elements leaving the viewport */
  exit: [0.4, 0, 1, 1] as const,
  /** Organic spring-like reveals */
  spring: [0.22, 1, 0.36, 1] as const,
  /** Gentle symmetric ease for subtle transitions */
  smooth: [0.4, 0, 0.6, 1] as const,
  /** Playful overshoot -- use sparingly (status dots, marker pops) */
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
} as const;

/** Tuple type for any easing value in the library. */
export type EasingTuple = (typeof easings)[keyof typeof easings];

// ---------------------------------------------------------------------------
// Duration Tokens
// ---------------------------------------------------------------------------

/**
 * Duration constants in seconds. Framer Motion uses seconds natively,
 * so these are ready to drop into any `transition.duration` property.
 *
 * The CSS custom properties in globals.css use milliseconds
 * (--duration-fast: 150ms). These are the JS equivalents in seconds.
 */
export const durations = {
  /** Immediate feedback -- focus rings, toggle states */
  instant: 0.1,
  /** Hover states, micro-interactions */
  fast: 0.15,
  /** Standard transitions -- buttons, links, navigation items */
  normal: 0.2,
  /** Component transitions -- accordions, sheets, dropdowns */
  medium: 0.3,
  /** Section reveals, card animations */
  slow: 0.5,
  /** Large composition reveals, hero sequences */
  slower: 0.8,
} as const;

/** Union of all duration token names. */
export type DurationToken = keyof typeof durations;

// ---------------------------------------------------------------------------
// Transition Presets
// ---------------------------------------------------------------------------

/**
 * Reusable transition objects that combine easing + duration.
 * Use these in variant definitions or pass directly to `transition` props.
 */
export const transitions = {
  /** General-purpose transition for most UI elements */
  default: {
    duration: durations.normal,
    ease: easings.default,
  },
  /** Standard element entrance */
  enter: {
    duration: durations.medium,
    ease: easings.enter,
  },
  /** Standard element exit */
  exit: {
    duration: durations.normal,
    ease: easings.exit,
  },
  /** Spring-like transition for organic reveals */
  spring: {
    duration: durations.slower,
    ease: easings.spring,
  },
  /** Slow section reveal with enter easing */
  reveal: {
    duration: durations.slow,
    ease: easings.enter,
  },
  /** SVG path drawing -- route lines, gauge arcs */
  draw: {
    duration: 1.2,
    ease: easings.default,
  },
} as const satisfies Record<string, Transition>;

// ---------------------------------------------------------------------------
// Animation Variants
// ---------------------------------------------------------------------------

/**
 * Framer Motion variant objects. Each has `hidden` and `visible` states
 * for use with `initial="hidden"` and `animate="visible"` (or `whileInView`).
 *
 * Usage:
 * ```tsx
 * <motion.div
 *   variants={variants.fadeUp}
 *   initial="hidden"
 *   whileInView="visible"
 *   viewport={{ once: true, amount: 0.2 }}
 * />
 * ```
 */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.medium,
      ease: easings.enter,
    },
  },
} satisfies Variants;

const fadeIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: durations.normal,
      ease: easings.default,
    },
  },
} satisfies Variants;

const fadeDown = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.medium,
      ease: easings.enter,
    },
  },
} satisfies Variants;

const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.slower,
      ease: easings.spring,
    },
  },
} satisfies Variants;

const slideInLeft = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.slow,
      ease: easings.enter,
    },
  },
} satisfies Variants;

const slideInRight = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.slow,
      ease: easings.enter,
    },
  },
} satisfies Variants;

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
} satisfies Variants;

const cardReveal = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: durations.slow,
      ease: easings.spring,
    },
  },
} satisfies Variants;

const routeDraw = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: easings.default,
    },
  },
} satisfies Variants;

const markerPop = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: durations.medium,
      ease: easings.spring,
    },
  },
} satisfies Variants;

const statusPulse = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: [0, 1.4, 1],
    opacity: [0, 1, 1],
    transition: {
      duration: 0.6,
      ease: easings.spring,
    },
  },
} satisfies Variants;

const checklistReveal = {
  hidden: {
    opacity: 0,
    x: -12,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.medium,
      ease: easings.enter,
    },
  },
} satisfies Variants;

const documentStack = {
  hidden: {
    opacity: 0,
    y: 16,
    rotateX: -5,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: durations.slow,
      ease: easings.spring,
    },
  },
} satisfies Variants;

const gaugeFill = {
  hidden: {
    pathLength: 0,
  },
  visible: {
    pathLength: 0.85,
    transition: {
      duration: 1.2,
      delay: 0.4,
      ease: easings.default,
    },
  },
} satisfies Variants;

// ---------------------------------------------------------------------------
// Variants Export
// ---------------------------------------------------------------------------

/**
 * All animation variants keyed by name for lookup and type inference.
 *
 * Use `variants.fadeUp` directly, or index dynamically:
 * ```ts
 * const v = variants[variantName]; // fully typed
 * ```
 */
export const variants = {
  fadeUp,
  fadeIn,
  fadeDown,
  scaleIn,
  slideInLeft,
  slideInRight,
  staggerContainer,
  cardReveal,
  routeDraw,
  markerPop,
  statusPulse,
  checklistReveal,
  documentStack,
  gaugeFill,
} as const satisfies Record<string, Variants>;

/** Union of all variant preset names. */
export type VariantName = keyof typeof variants;
