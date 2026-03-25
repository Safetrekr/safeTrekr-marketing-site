"use client";

/**
 * ST-840: REQ-048 -- MapLibre Hero Map (Progressive Enhancement)
 *
 * Three-stage progressive enhancement strategy for the hero map:
 *
 *   Stage 1 -- Static fallback (immediate):
 *     A pure SVG/CSS composition renders instantly as the LCP element.
 *     No JavaScript required. No layout shift.
 *
 *   Stage 2 -- Lazy load (on intersection):
 *     When the component scrolls into the viewport, an IntersectionObserver
 *     triggers a `next/dynamic` import of MapLibre GL JS (~180KB gzipped).
 *     The static fallback remains visible during loading.
 *
 *   Stage 3 -- Animated crossfade:
 *     Once MapLibre has loaded and the map style is ready, a smooth
 *     crossfade transitions from the static fallback to the interactive
 *     map. The fallback is removed from the DOM after the transition
 *     completes.
 *
 * Performance:
 * - Static fallback is the LCP element (renders immediately, no JS)
 * - MapLibre only initializes after the hero is visible
 * - Total lazy-loaded map bundle: <200KB gzipped
 * - Zero layout shift (static and interactive share identical dimensions)
 * - Respects `prefers-reduced-motion` (instant swap, no crossfade)
 *
 * @see designs/DESIGN-SYSTEM.md section 13 (Hero Composition Spec)
 * @see plans/react-developer.md FR-050
 */

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";
import { MapStaticFallback } from "./map-static-fallback";
import type { MapLibreInstanceProps } from "./maplibre-instance";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface HeroMapProps {
  /** Additional CSS class names applied to the outer container. */
  className?: string;

  /**
   * Whether to display the route line, waypoints, and geofence.
   * @default true
   */
  showRoute?: boolean;

  /**
   * Whether the MapLibre map should be interactive (pan, zoom, rotate).
   * When `false`, the map renders as a static visual with no user
   * interaction -- appropriate for a hero background element.
   * @default false
   */
  interactive?: boolean;
}

// ---------------------------------------------------------------------------
// Dynamic Import
// ---------------------------------------------------------------------------

/**
 * Lazily-loaded MapLibre instance. `ssr: false` ensures the ~180KB
 * MapLibre GL JS bundle is never included in the server-rendered HTML
 * or the initial client bundle.
 *
 * The `loading` callback returns `null` because the static fallback
 * handles the visual during the loading period.
 */
const LazyMapLibreInstance = dynamic<MapLibreInstanceProps>(
  () => import("./maplibre-instance"),
  {
    ssr: false,
    loading: () => null,
  },
);

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Duration of the crossfade transition in milliseconds. */
const CROSSFADE_DURATION_MS = 600;

/** CSS transition string for the crossfade. */
const CROSSFADE_TRANSITION = `opacity ${CROSSFADE_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Hero map with three-stage progressive enhancement.
 *
 * Renders a static SVG fallback immediately, lazy-loads MapLibre GL JS
 * when the component enters the viewport, then crossfades from the
 * static to the interactive map.
 */
export function HeroMap({
  className,
  showRoute = true,
  interactive = false,
}: HeroMapProps) {
  // ── State ──
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [fallbackRemoved, setFallbackRemoved] = useState(false);

  // ── Refs ──
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useRef(false);

  // Check reduced motion preference once on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      prefersReducedMotion.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
    }
  }, []);

  // ── Intersection Observer: trigger map load when visible ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // If IntersectionObserver is unavailable (very old browsers),
    // fall back to loading the map immediately.
    if (typeof IntersectionObserver === "undefined") {
      setShouldLoadMap(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      {
        // Start loading slightly before the element is fully visible
        // to reduce perceived latency.
        rootMargin: "200px 0px",
        threshold: 0,
      },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  // ── Timeout ref for cleanup ──
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up fallback removal timer on unmount
  useEffect(() => {
    return () => {
      if (fallbackTimerRef.current !== null) {
        clearTimeout(fallbackTimerRef.current);
      }
    };
  }, []);

  // ── Map ready handler: trigger crossfade ──
  const handleMapReady = useCallback(() => {
    setMapReady(true);

    // After the crossfade completes, remove the static fallback from
    // the DOM to avoid unnecessary paint costs.
    const duration = prefersReducedMotion.current ? 0 : CROSSFADE_DURATION_MS;
    fallbackTimerRef.current = setTimeout(() => {
      setFallbackRemoved(true);
      fallbackTimerRef.current = null;
    }, duration + 50); // Small buffer to ensure transition completes
  }, []);

  // ── Derived state ──
  const showFallback = !fallbackRemoved;
  const showMapLayer = shouldLoadMap;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl",
        "shadow-[var(--shadow-xl)]",
        className,
      )}
      style={{ aspectRatio: "560 / 400" }}
    >
      {/* ─── Stage 1: Static Fallback (LCP element) ─── */}
      {showFallback && (
        <div
          className="absolute inset-0 z-[1]"
          style={{
            opacity: mapReady ? 0 : 1,
            transition: prefersReducedMotion.current
              ? "none"
              : CROSSFADE_TRANSITION,
          }}
        >
          <MapStaticFallback showRoute={showRoute} className="h-full w-full" />
        </div>
      )}

      {/* ─── Stage 2 & 3: Lazy MapLibre (loads on intersection, fades in) ─── */}
      {showMapLayer && (
        <div
          className="absolute inset-0 z-[2]"
          style={{
            opacity: mapReady ? 1 : 0,
            transition: prefersReducedMotion.current
              ? "none"
              : CROSSFADE_TRANSITION,
          }}
        >
          <LazyMapLibreInstance
            showRoute={showRoute}
            interactive={interactive}
            onReady={handleMapReady}
            className="h-full w-full"
          />
        </div>
      )}

      {/* ─── Accessible description for the composition ─── */}
      <span className="sr-only">
        Interactive map showing a travel route with waypoints and a geofence
        boundary, representing SafeTrekr&apos;s route intelligence capability.
      </span>
    </div>
  );
}

export default HeroMap;
