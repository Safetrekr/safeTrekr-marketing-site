import type { NextConfig } from "next";

/**
 * Next.js Configuration for SafeTrekr Marketing Site
 *
 * Currently configured for static export (GitHub Pages preview).
 * For production deployment with full features (API routes, middleware,
 * redirects), change output to "standalone".
 */

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,

  // GitHub Pages subdirectory path
  basePath: "/safeTrekr-marketing-site",
  assetPrefix: "/safeTrekr-marketing-site/",

  // Required for static export - disables image optimization
  images: {
    unoptimized: true,
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Note: headers() and redirects() are not supported with static export.
  // For production deployment, switch back to output: "standalone".
};

export default nextConfig;
