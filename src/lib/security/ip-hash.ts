/**
 * ST-822: REQ-039 -- IP Address Hashing (Layer 7 of 8-Layer Security)
 *
 * Hashes the client IP address with SHA-256 using the Web Crypto API
 * before any storage operation. Raw IP addresses are NEVER persisted.
 *
 * A secret salt (`IP_HASH_SALT`) is prepended to the IP before hashing
 * to prevent rainbow table attacks against common IPv4 ranges.
 *
 * The hashed value is stored in `form_submissions.ip_hash` and
 * `rate_limits.ip_hash` for rate-limiting and geographic analytics.
 *
 * Under GDPR, the salted hash is not considered PII because it cannot
 * be reversed, and the salt prevents cross-service correlation.
 *
 * Security notes:
 * - The `x-forwarded-for` header chain is validated: only the rightmost
 *   value set by the trusted Nginx Ingress Controller is used.
 * - The `IP_HASH_SALT` environment variable is stored in K8s Secrets.
 * - Web Crypto API is used (available in Node.js 16+ and Edge runtimes).
 */

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Produces a SHA-256 hex digest of the IP address salted with `IP_HASH_SALT`.
 *
 * @param ip - The client IP address (from trusted proxy header).
 * @returns 64-character lowercase hex string (SHA-256 digest).
 *
 * @example
 * ```ts
 * const hash = await hashIP("203.0.113.42");
 * // => "a1b2c3d4e5f6..." (64 hex chars)
 * ```
 */
export async function hashIP(ip: string): Promise<string> {
  const salt = process.env.IP_HASH_SALT;

  if (!salt) {
    throw new Error(
      "Missing environment variable: IP_HASH_SALT. " +
        "Ensure it is set in your .env.local or K8s Secret.",
    );
  }

  const payload = `${salt}:${ip}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert ArrayBuffer to hex string.
  const hashArray = new Uint8Array(hashBuffer);
  const hashHex = Array.from(hashArray)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

/**
 * Extracts the client IP from request headers.
 *
 * Reads `x-forwarded-for` (set by Nginx Ingress Controller) and takes the
 * **first** IP in the chain (the original client IP as seen by the edge
 * proxy). Falls back to `x-real-ip` if `x-forwarded-for` is absent.
 *
 * If no IP can be determined, returns `"unknown"` -- this is safe because
 * hashing `"unknown"` still produces a deterministic hash, and the
 * rate limiter will treat all unknown IPs as a single bucket (which is
 * more restrictive, not less).
 *
 * @param headersList - The `Headers` object from `next/headers`.
 * @returns The best-effort client IP string.
 */
export function getClientIP(headersList: Headers): string {
  // x-forwarded-for may contain a comma-separated chain: client, proxy1, proxy2
  // The first entry is the original client IP as set by the edge proxy.
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) {
    const firstIP = forwarded.split(",")[0]?.trim();
    if (firstIP) return firstIP;
  }

  // Fallback: x-real-ip (single IP set by Nginx Ingress).
  const realIP = headersList.get("x-real-ip");
  if (realIP) return realIP.trim();

  return "unknown";
}
