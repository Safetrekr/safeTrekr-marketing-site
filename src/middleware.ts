/**
 * ST-824: REQ-093 -- Nonce-Based Content Security Policy
 * ST-826: REQ-095 -- CORS Policy for API Routes
 *
 * Next.js middleware that runs on every request. Responsibilities:
 *
 * 1. Generate a per-request cryptographic nonce (crypto.randomUUID)
 * 2. Build and attach a strict Content-Security-Policy header
 * 3. Pass the nonce to Server Components via the `x-nonce` request header
 * 4. Apply CORS headers to /api/* routes
 *
 * CSP design decisions:
 * - script-src uses nonce-based allowlisting -- NO 'unsafe-inline', NO 'unsafe-eval'
 * - style-src allows 'unsafe-inline' because Tailwind CSS injects styles at runtime
 * - Cloudflare Turnstile and Plausible analytics domains are explicitly allowlisted
 * - connect-src includes Supabase and Cloudflare for API/verification calls
 * - frame-src is restricted to Cloudflare Turnstile challenge iframes
 *
 * The nonce is read by the root layout via `headers().get('x-nonce')` and
 * threaded into any <Script> components that require it.
 *
 * @see src/app/layout.tsx -- reads the nonce from request headers
 * @see src/lib/security/cors.ts -- CORS origin validation logic
 */

import { NextResponse, type NextRequest } from "next/server";

import { getCorsHeaders, isAllowedOrigin } from "@/lib/security/cors";

// ---------------------------------------------------------------------------
// CSP Builder
// ---------------------------------------------------------------------------

/**
 * Constructs the Content-Security-Policy header value for a given nonce.
 *
 * Each directive is on its own line for readability in this source, then
 * joined with "; " separators for the header value.
 */
function buildCSP(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com https://plausible.io`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://api.maptiler.com https://*.tile.openstreetmap.org",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co https://challenges.cloudflare.com https://*.tile.openstreetmap.org",
    "frame-src https://challenges.cloudflare.com",
  ];

  return directives.join("; ");
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export function middleware(request: NextRequest): NextResponse {
  // Generate a per-request nonce for CSP script allowlisting.
  // crypto.randomUUID() produces a v4 UUID which provides sufficient
  // entropy (122 random bits) for a single-use nonce.
  const nonce = crypto.randomUUID();

  // -------------------------------------------------------------------------
  // Build the response with the nonce passed to downstream Server Components
  // -------------------------------------------------------------------------

  // Clone the request headers and inject the nonce so that Server Components
  // can read it via `(await headers()).get('x-nonce')`.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // -------------------------------------------------------------------------
  // Content-Security-Policy header
  // -------------------------------------------------------------------------

  response.headers.set("Content-Security-Policy", buildCSP(nonce));

  // -------------------------------------------------------------------------
  // CORS headers for API routes
  // -------------------------------------------------------------------------

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");

    // Handle preflight OPTIONS requests
    if (request.method === "OPTIONS") {
      const preflightResponse = new NextResponse(null, { status: 204 });

      // Copy the CSP header to the preflight response
      preflightResponse.headers.set(
        "Content-Security-Policy",
        buildCSP(nonce),
      );

      if (origin && isAllowedOrigin(origin)) {
        const corsHeaders = getCorsHeaders(origin);
        for (const [key, value] of Object.entries(corsHeaders)) {
          preflightResponse.headers.set(key, value);
        }
        // Preflight cache duration: 1 hour
        preflightResponse.headers.set("Access-Control-Max-Age", "3600");
      }

      return preflightResponse;
    }

    // Non-preflight API requests: attach CORS headers if origin is allowed
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
