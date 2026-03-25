import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
