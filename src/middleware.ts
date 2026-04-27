/**
 * ST-824: REQ-093 -- Content Security Policy
 * ST-826: REQ-095 -- CORS Policy for API Routes
 *
 * Next.js middleware that runs on every request. Responsibilities:
 *
 * 1. Attach a Content-Security-Policy header on every response
 * 2. Apply CORS headers to /api/* routes
 *
 * CSP design decisions:
 * - script-src allows 'self' + 'unsafe-inline' (required by Next.js 16's
 *   framework scripts; nonce-based allowlisting was explored but collides
 *   with Next.js 16 Turbopack's SSG prerender worker -- ANY static page
 *   fails to prerender when the root layout reads headers() to thread the
 *   nonce, with a digest-only TypeError). XSS surface is low: React escapes
 *   form-input echoes, MDX blog content is authored in-repo, URL params do
 *   not land in inline scripts.
 * - style-src allows 'unsafe-inline' because Tailwind injects runtime styles
 * - Cloudflare Turnstile is explicitly allowlisted for script-src/frame-src
 * - Cloudflare Web Analytics beacon (static.cloudflareinsights.com) is
 *   auto-injected at the edge by Cloudflare proxy when Web Analytics is
 *   enabled for the zone, so it's allowlisted for script-src + connect-src
 * - connect-src includes Supabase, Cloudflare, and OSM tile servers
 *
 * @see src/lib/security/cors.ts -- CORS origin validation logic
 */

import { NextResponse, type NextRequest } from "next/server";

import { getCorsHeaders, isAllowedOrigin } from "@/lib/security/cors";

// ---------------------------------------------------------------------------
// CSP Builder
// ---------------------------------------------------------------------------

function buildCSP(): string {
  const isDev = process.env.NODE_ENV === "development";
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com https://static.cloudflareinsights.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://api.maptiler.com https://*.tile.openstreetmap.org",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co https://challenges.cloudflare.com https://static.cloudflareinsights.com https://*.tile.openstreetmap.org",
    "frame-src https://challenges.cloudflare.com",
  ];

  return directives.join("; ");
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export function middleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();

  response.headers.set("Content-Security-Policy", buildCSP());

  // -------------------------------------------------------------------------
  // CORS headers for API routes
  // -------------------------------------------------------------------------

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");

    if (request.method === "OPTIONS") {
      const preflightResponse = new NextResponse(null, { status: 204 });
      preflightResponse.headers.set("Content-Security-Policy", buildCSP());

      if (origin && isAllowedOrigin(origin)) {
        const corsHeaders = getCorsHeaders(origin);
        for (const [key, value] of Object.entries(corsHeaders)) {
          preflightResponse.headers.set(key, value);
        }
        preflightResponse.headers.set("Access-Control-Max-Age", "3600");
      }

      return preflightResponse;
    }

    if (origin && isAllowedOrigin(origin)) {
      const corsHeaders = getCorsHeaders(origin);
      for (const [key, value] of Object.entries(corsHeaders)) {
        response.headers.set(key, value);
      }
    }
  }

  return response;
}

// ---------------------------------------------------------------------------
// Matcher
// ---------------------------------------------------------------------------

/**
 * Run middleware on all routes except static assets and Next.js internals.
 *
 * The CSP header must be present on all HTML responses. API routes also
 * need CORS headers. Static files (_next/static, favicon.ico, images)
 * are excluded because they do not execute scripts and do not need
 * per-request nonce generation.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (browser favicon)
     * - public folder assets (images, robots.txt, sitemap.xml, etc.)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml)$).*)",
  ],
};
