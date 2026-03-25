/**
 * ST-840: REQ-048 -- Map Static Fallback
 *
 * Pure CSS/SVG composition that visually approximates a desaturated map
 * with a route line, waypoint markers, and geofence boundary. This
 * component requires ZERO JavaScript to render and serves as the LCP
 * element for the hero section.
 *
 * Visual design:
 * - Muted background matching the #e7ecee palette
 * - Subtle grid lines evoking road networks
 * - Curved route path in primary-500
 * - 3-4 waypoint markers in primary-600 with primary-100 halos
 * - Dashed geofence boundary outline
 *
 * All colors reference the design system's CSS custom properties so
 * the fallback stays in sync with theme changes automatically.
 *
 * @see designs/DESIGN-SYSTEM.md section 13.3 (Hero Composition Layer 1)
 */

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface MapStaticFallbackProps {
  /** Additional CSS class names applied to the outer container. */
  className?: string;

  /** Whether to render the route line and waypoints. */
  showRoute?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Server-renderable SVG/CSS map composition.
 *
 * This renders a stylized map with terrain grid, route line, waypoint
 * markers, and geofence boundary -- all as inline SVG. No external
 * assets, no JavaScript, no layout shift.
 */
export function MapStaticFallback({
  className,
  showRoute = true,
}: MapStaticFallbackProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl",
        className,
      )}
      style={{ aspectRatio: "560 / 400" }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 560 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* ─── Background ─── */}
        <rect width="560" height="400" fill="var(--color-background)" />

        {/* ─── Terrain texture: subtle grid lines ─── */}
        <g stroke="var(--color-border)" strokeWidth="0.5" opacity="0.3">
          {/* Horizontal roads */}
          <line x1="0" y1="80" x2="560" y2="80" />
          <line x1="0" y1="160" x2="560" y2="165" />
          <line x1="0" y1="240" x2="560" y2="235" />
          <line x1="0" y1="320" x2="560" y2="320" />

          {/* Vertical roads */}
          <line x1="112" y1="0" x2="115" y2="400" />
          <line x1="224" y1="0" x2="220" y2="400" />
          <line x1="336" y1="0" x2="340" y2="400" />
          <line x1="448" y1="0" x2="445" y2="400" />
        </g>

        {/* ─── Secondary roads / paths ─── */}
        <g stroke="var(--color-border)" strokeWidth="0.3" opacity="0.2">
          <path d="M0 40 Q140 50 280 35 Q420 20 560 45" />
          <path d="M0 200 Q140 190 280 205 Q420 220 560 195" />
          <path d="M0 360 Q140 370 280 355 Q420 340 560 365" />
          <path d="M60 0 Q70 100 55 200 Q40 300 65 400" />
          <path d="M170 0 Q180 100 165 200 Q150 300 175 400" />
          <path d="M280 0 Q290 100 275 200 Q260 300 285 400" />
          <path d="M390 0 Q400 100 385 200 Q370 300 395 400" />
          <path d="M500 0 Q510 100 495 200 Q480 300 505 400" />
        </g>

        {/* ─── Water body suggestion ─── */}
        <ellipse
          cx="450"
          cy="120"
          rx="70"
          ry="40"
          fill="var(--color-primary-100)"
          opacity="0.3"
        />

        {/* ─── Park / green space ─── */}
        <rect
          x="80"
          y="260"
          width="100"
          height="80"
          rx="8"
          fill="var(--color-primary-50)"
          opacity="0.5"
        />

        {/* ─── Building blocks ─── */}
        <g fill="var(--color-border)" opacity="0.15">
          <rect x="250" y="60" width="40" height="30" rx="2" />
          <rect x="300" y="55" width="30" height="35" rx="2" />
          <rect x="340" y="62" width="25" height="28" rx="2" />
          <rect x="160" y="140" width="35" height="25" rx="2" />
          <rect x="200" y="135" width="40" height="30" rx="2" />
          <rect x="370" y="270" width="45" height="35" rx="2" />
          <rect x="420" y="265" width="30" height="40" rx="2" />
          <rect x="460" y="275" width="35" height="30" rx="2" />
        </g>

        {/* ─── Geofence boundary (dashed circle) ─── */}
        <circle
          cx="290"
          cy="210"
          r="140"
          stroke="var(--color-primary-400)"
          strokeWidth="1.5"
          strokeDasharray="8 6"
          fill="none"
          opacity="0.4"
        />

        {showRoute && (
          <>
            {/* ─── Route line: curved path from origin to destination ─── */}
            <path
              d="M100 340 C140 300 180 250 220 220 C260 190 300 160 340 150 C380 140 420 160 460 100"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* ─── Route direction arrows ─── */}
            <g
              fill="var(--color-primary-500)"
              opacity="0.6"
            >
              <polygon
                points="218,222 224,216 220,226"
                transform="rotate(-30 220 220)"
              />
              <polygon
                points="338,152 344,146 340,156"
                transform="rotate(-10 340 150)"
              />
            </g>

            {/* ─── Waypoint markers with halos ─── */}

            {/* Origin marker */}
            <circle
              cx="100"
              cy="340"
              r="10"
              fill="var(--color-primary-100)"
              opacity="0.6"
            />
            <circle
              cx="100"
              cy="340"
              r="6"
              fill="var(--color-primary-600)"
            />
            <circle
              cx="100"
              cy="340"
              r="2.5"
              fill="white"
            />

            {/* Waypoint 1 */}
            <circle
              cx="220"
              cy="220"
              r="10"
              fill="var(--color-primary-100)"
              opacity="0.6"
            />
            <circle
              cx="220"
              cy="220"
              r="6"
              fill="var(--color-primary-600)"
            />
            <circle
              cx="220"
              cy="220"
              r="2.5"
              fill="white"
            />

            {/* Waypoint 2 */}
            <circle
              cx="340"
              cy="150"
              r="10"
              fill="var(--color-primary-100)"
              opacity="0.6"
            />
            <circle
              cx="340"
              cy="150"
              r="6"
              fill="var(--color-primary-600)"
            />
            <circle
              cx="340"
              cy="150"
              r="2.5"
              fill="white"
            />

            {/* Destination marker */}
            <circle
              cx="460"
              cy="100"
              r="10"
              fill="var(--color-primary-100)"
              opacity="0.6"
            />
            <circle
              cx="460"
              cy="100"
              r="6"
              fill="var(--color-primary-600)"
            />
            <circle
              cx="460"
              cy="100"
              r="2.5"
              fill="white"
            />
          </>
        )}
      </svg>
    </div>
  );
}

export default MapStaticFallback;
