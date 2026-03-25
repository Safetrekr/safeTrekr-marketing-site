/**
 * ST-915: Dynamic OG Image Generation
 *
 * Generates branded Open Graph images for SafeTrekr pages using
 * next/og (ImageResponse). Returns a 1200x630 PNG image.
 *
 * Query parameters:
 * - title (required): Headline text for the image
 * - description (optional): Supporting text below the headline
 * - type (optional): "page" | "blog" | "solution" -- controls layout accent
 *
 * Design:
 * - SafeTrekr secondary (#123646) background
 * - Primary green (#4ca46e) accent bar
 * - White headline text (Plus Jakarta Sans)
 * - Light description text
 * - SafeTrekr wordmark in bottom-right
 * - 1200x630px dimensions (standard OG image size)
 *
 * Runtime: Node.js (NOT Edge -- deployed on DigitalOcean DOKS)
 *
 * @see next.config.ts -- No edge runtime; all routes use Node.js
 */

import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Runtime Configuration
// ---------------------------------------------------------------------------

/**
 * Force Node.js runtime. The SafeTrekr marketing site deploys on
 * DigitalOcean DOKS via standalone output -- Edge is not used.
 */
export const runtime = "nodejs";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** SafeTrekr brand colors from the design token system. */
const COLORS = {
  /** Authority Blue -- secondary */
  background: "#123646",
  /** Background lighter shade for contrast */
  backgroundLight: "#1a4a5e",
  /** Primary green */
  accent: "#4ca46e",
  /** Primary green light */
  accentLight: "#6cbc8b",
  /** White text */
  textPrimary: "#ffffff",
  /** Muted text on dark */
  textSecondary: "#b8c3c7",
} as const;

/** Type accent colors per content type. */
const TYPE_ACCENTS: Record<string, string> = {
  page: COLORS.accent,
  blog: COLORS.accentLight,
  solution: COLORS.accent,
};

/** Type labels displayed as a badge on the image. */
const TYPE_LABELS: Record<string, string> = {
  page: "SafeTrekr",
  blog: "SafeTrekr Blog",
  solution: "SafeTrekr Solutions",
};

// ---------------------------------------------------------------------------
// Route Handler
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const title = searchParams.get("title") ?? "SafeTrekr";
  const description = searchParams.get("description") ?? "";
  const type = searchParams.get("type") ?? "page";

  const accentColor = TYPE_ACCENTS[type] ?? COLORS.accent;
  const typeLabel = TYPE_LABELS[type] ?? "SafeTrekr";

  // Truncate long titles and descriptions for visual fit
  const truncatedTitle =
    title.length > 80 ? `${title.slice(0, 77)}...` : title;
  const truncatedDescription =
    description.length > 150
      ? `${description.slice(0, 147)}...`
      : description;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "0",
          background: COLORS.background,
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern: subtle dot grid */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(76, 164, 110, 0.06) 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top accent bar */}
        <div
          style={{
            width: "1200px",
            height: "6px",
            background: `linear-gradient(90deg, ${accentColor}, ${COLORS.accentLight})`,
            flexShrink: 0,
          }}
        />

        {/* Content area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "60px 80px",
            gap: "24px",
          }}
        >
          {/* Type badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: accentColor,
              }}
            />
            <span
              style={{
                fontSize: "16px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: accentColor,
              }}
            >
              {typeLabel}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: truncatedTitle.length > 50 ? "42px" : "52px",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: COLORS.textPrimary,
              margin: 0,
              maxWidth: "900px",
            }}
          >
            {truncatedTitle}
          </h1>

          {/* Description */}
          {truncatedDescription && (
            <p
              style={{
                fontSize: "22px",
                lineHeight: 1.5,
                color: COLORS.textSecondary,
                margin: 0,
                maxWidth: "750px",
              }}
            >
              {truncatedDescription}
            </p>
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 80px",
            borderTop: `1px solid rgba(255, 255, 255, 0.08)`,
          }}
        >
          {/* Domain */}
          <span
            style={{
              fontSize: "18px",
              fontWeight: 500,
              color: COLORS.textSecondary,
            }}
          >
            safetrekr.com
          </span>

          {/* SafeTrekr wordmark (text-based for reliability) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* Shield icon approximation */}
            <div
              style={{
                width: "32px",
                height: "36px",
                borderRadius: "4px 4px 12px 12px",
                background: `linear-gradient(180deg, ${accentColor}, ${COLORS.accentLight})`,
                opacity: 0.9,
              }}
            />
            <span
              style={{
                fontSize: "24px",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: COLORS.textPrimary,
              }}
            >
              SafeTrekr
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
