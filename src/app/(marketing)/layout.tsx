import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

/* ================================================================
   Marketing Layout
   ================================================================
   Route-group layout for all public marketing pages. Wraps children
   with the shared SiteHeader and SiteFooter chrome.

   Note: Analytics scripts and CSP nonce removed for static export.
   For production with full features, use output: "standalone".
   ================================================================ */

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
