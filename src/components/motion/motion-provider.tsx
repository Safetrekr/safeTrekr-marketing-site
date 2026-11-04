"use client";

/**
 * MotionProvider -- LazyMotion feature loader (performance).
 *
 * Wraps the app in Framer Motion's `LazyMotion` so that animation features
 * are loaded as a single small (~15 KB) bundle via `domAnimation` instead of
 * the full `motion` runtime (~120 KB) being pulled into the shared client
 * chunk on every page. All animated components in this codebase use the
 * lightweight `m` component (not `motion`), so `strict` is enabled to fail
 * fast if a heavyweight `motion.*` import is ever reintroduced.
 *
 * `domAnimation` covers everything this site uses: enter/exit animations
 * (AnimatePresence), variants, and tap/hover/focus gestures. It intentionally
 * excludes layout animations and drag (the `domMax` bundle) -- neither is used
 * anywhere in this codebase.
 *
 * LazyMotion renders no wrapping DOM element, so this changes zero markup,
 * styling, or behavior -- only how the animation runtime is loaded.
 *
 * @see src/components/motion/scroll-reveal.tsx
 * @see src/components/motion/stagger-children.tsx
 * @see src/components/layout/site-header.tsx
 */

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

export default MotionProvider;
