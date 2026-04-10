import type { NextConfig } from "next";

/**
 * Next.js Configuration for SafeTrekr Marketing Site
 *
 * Static export (GitHub Pages preview) is enabled when STATIC_EXPORT=true.
 * Local dev and production run without it, so middleware, API routes,
 * and redirects all work normally.
 */

const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isStaticExport && { output: "export" }),
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
  },
};

export default nextConfig;
