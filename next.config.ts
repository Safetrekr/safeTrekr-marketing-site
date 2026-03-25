import type { NextConfig } from "next";

/**
 * ST-786: REQ-003 - Next.js Configuration for SafeTrekr Marketing Site
 *
 * Key decisions:
 * - output: 'standalone' for Docker deployment on DigitalOcean DOKS
 * - sharp is listed in dependencies and resolves automatically in standalone output
 * - Security headers applied globally via headers()
 * - No runtime: 'edge' anywhere -- all routes use Node.js runtime
 * - optimizePackageImports for lucide-react and framer-motion to reduce bundle size
 *
 * ST-825: REQ-094 -- Full HTTP Security Headers
 * - All security headers are defined here and applied to every route.
 * - Content-Security-Policy is handled by middleware (ST-824) because it
 *   requires a per-request nonce that cannot be generated in next.config.ts.
 *
 * ST-900: Redirect Management
 * - Permanent (301) redirects for legacy solution slugs that were renamed
 *   during the IA restructure. Preserves link equity from any external
 *   references or bookmarks pointing to the old paths.
 */

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // ST-825: Enable DNS prefetching for external resources (Supabase,
    // Cloudflare, Plausible, MapTiler). This improves perceived performance
    // by resolving DNS for third-party domains before they are needed.
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.maptiler.com",
        pathname: "/**",
      },
    ],
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  /**
   * ST-900: Redirect Management
   *
   * Permanent 301 redirects for legacy solution URLs that were renamed
   * during the information-architecture restructure. Each redirect
   * preserves link equity and ensures bookmarked/shared URLs still resolve.
   */
  async redirects() {
    return [
      {
        source: "/solutions/schools",
        destination: "/solutions/k12",
        permanent: true,
      },
      {
        source: "/solutions/church",
        destination: "/solutions/churches",
        permanent: true,
      },
      {
        source: "/solutions/university",
        destination: "/solutions/higher-education",
        permanent: true,
      },
      {
        source: "/solutions/business",
        destination: "/solutions/corporate",
        permanent: true,
      },
      {
        source: "/features",
        destination: "/how-it-works",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
