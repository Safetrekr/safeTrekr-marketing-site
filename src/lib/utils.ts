import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Custom typography utilities defined in src/app/globals.css. Each sets
 * font-family / font-size / line-height / letter-spacing — i.e. a font-size
 * group class, NOT a text-color class. tailwind-merge would otherwise
 * classify them generically and drop them when combined with text-<color>
 * utilities (e.g. `text-eyebrow text-primary-600` collapses to the color
 * alone). Registering them in the font-size group lets conflict resolution
 * work correctly: typography and color coexist; two typography classes still
 * resolve to the last one declared.
 */
const CUSTOM_FONT_SIZE_UTILITIES = [
  "text-display-xl",
  "text-display-lg",
  "text-display-md",
  "text-heading-lg",
  "text-heading-md",
  "text-heading-sm",
  "text-body-lg",
  "text-body-md",
  "text-body-sm",
  "text-body-xs",
  "text-eyebrow",
  "text-mono-md",
  "text-mono-sm",
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [...CUSTOM_FONT_SIZE_UTILITIES],
    },
  },
});

/**
 * Merges Tailwind CSS classes with intelligent conflict resolution.
 *
 * Combines clsx (conditional class composition) with tailwind-merge
 * (conflict-aware deduplication). Use this everywhere class names are
 * composed -- component internals, prop forwarding, variant merging.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-primary-500", className)
 * // => "px-4 py-2 bg-primary-500" (when isActive is true)
 *
 * cn("px-4", "px-8")
 * // => "px-8" (tailwind-merge resolves the conflict)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
