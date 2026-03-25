/**
 * ST-826: REQ-095 -- CORS Policy for API Routes
 *
 * Validates request origins against an explicit allowlist and generates
 * the appropriate CORS response headers. Applied to all /api/* routes
 * via the middleware (src/middleware.ts).
 *
 * Allowlisted origins:
 * - https://safetrekr.com          (production)
 * - https://www.safetrekr.com      (production with www)
 * - https://staging.safetrekr.com  (staging environment)
 * - http://localhost:3000           (local development)
 *
 * Design decisions:
 * - Origins are validated with exact string matching (no regex, no wildcards)
 *   to prevent bypass via subdomain spoofing.
 * - The `Access-Control-Allow-Origin` header reflects the specific requesting
 *   origin (not `*`) to allow credentials if needed in the future.
 * - Allowed methods are restricted to the HTTP verbs actually used by
 *   SafeTrekr API routes.
 * - Allowed headers include Content-Type and the x-nonce header used by
 *   the CSP middleware.
 *
 * @see src/middleware.ts -- applies CORS headers to API routes
 */

// ---------------------------------------------------------------------------
// Origin Allowlist
// ---------------------------------------------------------------------------

/**
 * Set of origins permitted to make cross-origin requests to /api/* routes.
 *
 * Using a Set for O(1) lookup. All origins include the protocol and port
 * (where applicable) for exact matching per the CORS specification.
 */
const ALLOWED_ORIGINS: ReadonlySet<string> = new Set([
  "https://safetrekr.com",
  "https://www.safetrekr.com",
  "https://staging.safetrekr.com",
  "http://localhost:3000",
]);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Checks whether the given origin is in the CORS allowlist.
 *
 * @param origin - The value of the `Origin` request header.
 * @returns `true` if the origin is explicitly allowed.
 *
 * @example
 * ```ts
 * isAllowedOrigin("https://safetrekr.com");    // true
 * isAllowedOrigin("https://evil.com");          // false
 * isAllowedOrigin("https://safetrekr.com.evil.com"); // false
 * ```
 */
export function isAllowedOrigin(origin: string): boolean {
  return ALLOWED_ORIGINS.has(origin);
}

/**
 * Generates CORS response headers for an allowed origin.
 *
 * Returns a plain object of header key-value pairs suitable for setting
 * on a `NextResponse`. Only call this after verifying the origin with
 * {@link isAllowedOrigin}.
 *
 * @param origin - The validated origin to reflect in `Access-Control-Allow-Origin`.
 * @returns An object containing the CORS response headers.
 *
 * @example
 * ```ts
 * if (isAllowedOrigin(origin)) {
 *   const corsHeaders = getCorsHeaders(origin);
 *   for (const [key, value] of Object.entries(corsHeaders)) {
 *     response.headers.set(key, value);
 *   }
 * }
 * ```
 */
export function getCorsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-nonce",
    "Access-Control-Allow-Credentials": "true",
  };
}
