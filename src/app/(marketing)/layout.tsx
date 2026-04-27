import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

/* ================================================================
   Marketing Layout
   ================================================================
   Route-group layout for all public marketing pages. Wraps children
   with the shared SiteHeader and SiteFooter chrome.
   ================================================================ */

// framer-motion v12 + React 19 + Next.js 16 Turbopack's SSG prerender worker
// resolves framer-motion's module-scoped context to null at build time,
// crashing any marketing page that renders motion components (most inherit
// <SiteHeader> which uses framer-motion; many also use <ScrollReveal>).
// Runtime SSR has the context properly initialized -- force-dynamic across
// the route group skips build-time prerender and defers to request-time
// rendering where the bug doesn't manifest. Must be a static string literal
// (Next.js route-segment config can't statically analyze expressions); a
// hypothetical future STATIC_EXPORT=true build would need this overridden.
export const dynamic = "force-dynamic";

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
