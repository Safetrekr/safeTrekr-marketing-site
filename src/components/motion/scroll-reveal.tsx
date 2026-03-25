"use client";

/**
 * ST-802: REQ-019 -- ScrollReveal Component
 *
 * Intersection-observer-driven reveal animation wrapper. Wraps any content
 * and animates it into view using presets from `@/lib/motion`. Respects
 * `prefers-reduced-motion` by rendering children without animation.
 *
 * Usage:
 * ```tsx
 * <ScrollReveal variant="fadeUp" delay={0.1}>
 *   <Card>...</Card>
 * </ScrollReveal>
 *
 * <ScrollReveal variant="slideInLeft" as="section" className="my-8">
 *   <HeroContent />
 * </ScrollReveal>
 * ```
 *
 * @see src/lib/motion.ts for available variant presets
 */

import { useRef, useMemo, type ReactNode, type ElementType } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";

import { variants, type VariantName } from "@/lib/motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * HTML element tags that are valid as scroll-reveal containers.
 * Intentionally constrained to block/sectioning elements -- inline or void
 * elements (img, input, br) are excluded because they cannot wrap children.
 */
type ScrollRevealElement =
  | "div"
  | "section"
  | "article"
  | "aside"
  | "main"
  | "header"
  | "footer"
  | "nav"
  | "figure"
  | "figcaption"
  | "blockquote"
  | "ul"
  | "ol"
  | "li"
  | "span"
  | "p";

interface ScrollRevealProps {
  /** Content to reveal on scroll. */
  children: ReactNode;

  /**
   * Animation variant preset name from the motion library.
   * @default "fadeUp"
   */
  variant?: VariantName;

  /**
   * Additional delay in seconds before the animation starts.
   * Added on top of any delay already defined in the variant.
   * @default 0
   */
  delay?: number;

  /** Additional CSS class names applied to the wrapper element. */
  className?: string;

  /**
   * HTML element to render as the wrapper.
   * @default "div"
   */
  as?: ScrollRevealElement;

  /**
   * Whether the animation should only trigger once.
   * When `true`, the element stays visible after the first reveal.
   * @default true
   */
  once?: boolean;

  /**
   * Fraction of the element that must be visible before triggering.
   * Accepts `0` (any pixel) to `1` (fully visible), or `"some"` / `"all"`.
   * @default 0.2
   */
  amount?: "some" | "all" | number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Produces a variant object with the specified delay merged into the
 * `visible` state's transition. Returns the original variant unchanged
 * when delay is 0 to avoid unnecessary object allocation.
 */
function withDelay(baseVariant: Variants, delay: number): Variants {
  if (delay === 0) return baseVariant;

  const visibleState = baseVariant.visible;

  // The visible state can be a target object or a function. Our presets
  // always use plain objects, so we handle that case and pass functions
  // through unchanged (they manage their own transitions).
  if (typeof visibleState === "function" || visibleState === undefined) {
    return baseVariant;
  }

  const existingTransition =
    typeof visibleState === "object" && "transition" in visibleState
      ? (visibleState.transition as Record<string, unknown>)
      : {};

  return {
    ...baseVariant,
    visible: {
      ...visibleState,
      transition: {
        ...existingTransition,
        delay: ((existingTransition.delay as number) ?? 0) + delay,
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Scroll-triggered reveal animation wrapper.
 *
 * Renders a `motion[as]` element that transitions from `hidden` to `visible`
 * when the element scrolls into the viewport. Automatically disables all
 * animation when the user has `prefers-reduced-motion` enabled.
 */
export function ScrollReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  className,
  as = "div",
  once = true,
  amount = 0.2,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });
  const shouldReduceMotion = useReducedMotion();

  // Memoize the delay-merged variant to keep referential stability
  // across renders. Only recomputes when the variant name or delay changes.
  const resolvedVariants = useMemo(
    () => withDelay(variants[variant], delay),
    [variant, delay],
  );

  // -----------------------------------------------------------------------
  // Reduced motion: render a static wrapper with no animation.
  // Using a plain HTML element avoids loading framer-motion's animation
  // runtime for users who have opted out of motion.
  // -----------------------------------------------------------------------
  if (shouldReduceMotion) {
    const StaticTag = as as ElementType;
    return (
      <StaticTag ref={ref} className={className}>
        {children}
      </StaticTag>
    );
  }

  // -----------------------------------------------------------------------
  // Animated path: motion[as] renders the chosen HTML element with
  // Framer Motion capabilities.
  // -----------------------------------------------------------------------
  const MotionComponent = motion[as] as typeof motion.div;

  return (
    <MotionComponent
      ref={ref}
      className={className}
      variants={resolvedVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </MotionComponent>
  );
}

export default ScrollReveal;
