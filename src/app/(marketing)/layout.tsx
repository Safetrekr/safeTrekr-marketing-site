import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

/* ================================================================
   Marketing Layout
   ================================================================
   Route-group layout for all public marketing pages. Wraps children
   with the shared SiteHeader and SiteFooter chrome.
   ================================================================ */

// NOTE (perf): This route group is intentionally STATIC. An earlier
// `export const dynamic = "force-dynamic"` was added to work around a
// framer-motion v12 + React 19 + Next.js 16 SSG prerender crash (module-scoped
// motion context resolving to null at build time). That workaround forced a
// full server render on EVERY request, which was the primary cause of the
// ~3.4s TTFB / LCP regression seen on PageSpeed.
//
// The crash no longer reproduces on the current toolchain (`next build
// --webpack` with experimental.cpus:1). A clean build now prerenders every
// marketing route as static HTML (verified: `/` builds as `○ Static`).
// Keeping these pages static lets the standalone server (and the Cloudflare
// edge in front of it) serve cached HTML instead of re-rendering per request,
// which is what fixes the TTFB. Do NOT reintroduce force-dynamic without a
// performance plan.

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>
      <SiteHeader />
      <div id="main-content" className="pt-20">
        {children}
      </div>
      <SiteFooter />
    </>
  );
}
