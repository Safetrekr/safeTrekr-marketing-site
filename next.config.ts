import type { NextConfig } from "next";

/**
 * Next.js Configuration for SafeTrekr Marketing Site
 *
 * Static export (GitHub Pages preview) is enabled when STATIC_EXPORT=true.
 * Local dev and production run without it, so middleware, API routes,
 * redirects, and the headers() config below all work normally.
 */

const isStaticExport = process.env.STATIC_EXPORT === "true";

/**
 * Baseline security headers applied to every response.
 *
 * CSP is intentionally NOT set here — it lives in src/middleware.ts because
 * it requires a per-request nonce. The headers here are the ones that are
 * identical on every response and benefit from Next.js's declarative caching.
 */
const SECURITY_HEADERS = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : "standalone",
  reactStrictMode: true,

  // GitHub Pages subdirectory path (only needed for static export)
  ...(isStaticExport && {
    basePath: "/safeTrekr-marketing-site",
    assetPrefix: "/safeTrekr-marketing-site/",
  }),

  images: {
    // Image optimization requires a server; disable for static export
    unoptimized: isStaticExport,
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],

    // Force serial SSG. With multiple workers, Next.js 16's webpack
    // build hits a race where the React module namespace is null in
    // one worker's bundled OuterLayoutRouter chunk during prerender
    // of /_global-error -- TypeError: Cannot read properties of null
    // (reading 'useContext'). Builds with a single worker are
    // deterministic and don't trigger the race. Trade-off: SSG is
    // serial instead of parallel; for a 29-route marketing site this
    // adds maybe 5-10s to the build. Acceptable.
    cpus: 1,
  },

  // headers() is ignored by Next.js when output: "export", so gate it
  // explicitly for clarity. Production (standalone) server applies these
  // to every route.
  ...(!isStaticExport && {
    async headers() {
      return [
        {
          source: "/:path*",
          headers: SECURITY_HEADERS,
        },
      ];
    },
  }),
};

export default nextConfig;
