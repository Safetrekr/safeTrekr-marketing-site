'use client';

/**
 * ST-803: REQ-020 -- StaggerChildren Container Component
 *
 * A viewport-aware motion container that orchestrates staggered entry
 * animations for its children. This component is the CONTAINER only --
 * children must provide their own animation variants (e.g., wrapped in
 * `ScrollReveal` or using `motion.div` with `cardReveal` / `fadeUp`).
 *
 * When `prefers-reduced-motion` is active, the container renders as a
 * plain HTML element so children appear instantly without orchestration.
 *
 * @example
 * ```tsx
 * <StaggerChildren as="ul" staggerDelay={0.1} className="grid gap-4">
 *   {items.map((item) => (
 *     <motion.li key={item.id} variants={variants.cardReveal}>
 *       <Card>{item.name}</Card>
 *     </motion.li>
 *   ))}
 * </StaggerChildren>
 * ```
 *
 * @see src/lib/motion.ts for variant presets (cardReveal, fadeUp, etc.)
 */

import {
  type ReactNode,
  useRef,
  useMemo,
  createElement,
} from 'react';
import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Allowed container elements
// ---------------------------------------------------------------------------

/**
 * HTML elements that make semantic sense as stagger containers.
 * Kept narrow to produce tight TypeScript inference and prevent
 * misuse with interactive or inline elements.
 */
type AllowedElement =
  | 'div'
  | 'section'
  | 'article'
  | 'aside'
  | 'main'
  | 'nav'
  | 'ul'
  | 'ol'
  | 'dl'
  | 'fieldset'
  | 'figure'
  | 'footer'
  | 'header';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface StaggerChildrenProps {
  /** Content to render inside the stagger container. */
  children: ReactNode;

  /**
   * Delay in seconds between each child animation start.
   * @default 0.08
   */
  staggerDelay?: number;

  /** Additional CSS class names merged via `cn()`. */
  className?: string;

  /**
   * The HTML element to render as the container.
   * Constrained to block-level / sectioning elements.
   * @default 'div'
   */
  as?: AllowedElement;

  /**
   * When `true`, the entrance animation fires only once.
   * When `false`, it re-triggers every time the element re-enters the viewport.
   * @default true
   */
  once?: boolean;

  /**
   * Fraction of the element that must be visible before the animation
   * triggers. `0` = any pixel visible, `1` = fully visible.
   * @default 0.2
   */
  amount?: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Viewport-aware stagger container.
 *
 * Renders a Framer Motion element that uses `staggerChildren` and
 * `delayChildren` transitions to orchestrate the sequential reveal
 * of child motion elements when the container scrolls into view.
 *
 * Respects `prefers-reduced-motion` by falling back to a plain
 * HTML element with no animation wrapper.
 */
export function StaggerChildren({
  children,
  staggerDelay = 0.08,
  className,
  as = 'div',
  once = true,
  amount = 0.2,
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });
  const prefersReducedMotion = useReducedMotion();

  // Build container variants dynamically so `staggerDelay` is reactive.
  const containerVariants = useMemo<Variants>(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: 0.1,
        },
      },
    }),
    [staggerDelay],
  );

  // -----------------------------------------------------------------------
  // Reduced-motion path -- plain HTML element, no orchestration
  // -----------------------------------------------------------------------
  if (prefersReducedMotion) {
    return createElement(as, { ref, className: cn(className) }, children);
  }

  // -----------------------------------------------------------------------
  // Animated path -- motion element with stagger orchestration
  // -----------------------------------------------------------------------

  // Framer Motion's `motion` proxy supports dynamic element access:
  // motion['div'], motion['section'], motion['ul'], etc.
  const MotionComponent = motion[as] as typeof motion.div;

  return (
    <MotionComponent
      ref={ref}
      className={cn(className)}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {children}
    </MotionComponent>
  );
}

export default StaggerChildren;
