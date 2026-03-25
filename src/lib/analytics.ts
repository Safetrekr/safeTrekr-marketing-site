/**
 * ST-910: Plausible Analytics -- Event Tracking Utility
 *
 * Provides a type-safe `trackEvent` function that fires custom events
 * via the Plausible Analytics API. Plausible exposes a global
 * `window.plausible` function when its script is loaded.
 *
 * This module is safe to import from both server and client code.
 * On the server (or when Plausible is not loaded), calls are no-ops.
 *
 * @example
 * ```tsx
 * import { trackEvent } from "@/lib/analytics";
 *
 * trackEvent("cta_click", { location: "hero", variant: "primary" });
 * ```
 *
 * @see https://plausible.io/docs/custom-event-goals
 */

// ---------------------------------------------------------------------------
// Global type augmentation for Plausible
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: { props?: Record<string, string> },
    ) => void;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Sends a custom event to Plausible Analytics.
 *
 * If the Plausible script has not loaded (e.g., blocked by an ad blocker,
 * env var not set, or running server-side), this function is a silent no-op.
 *
 * @param name  - The event name (e.g., "signup", "cta_click", "demo_request").
 * @param props - Optional key-value properties attached to the event.
 *                Plausible supports string values only.
 */
export function trackEvent(
  name: string,
  props?: Record<string, string>,
): void {
  if (typeof window === "undefined" || typeof window.plausible !== "function") {
    return;
  }

  window.plausible(name, props ? { props } : undefined);
}
