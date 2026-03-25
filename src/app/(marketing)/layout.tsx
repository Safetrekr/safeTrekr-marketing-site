import { headers } from "next/headers";
import Script from "next/script";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { GA4Script } from "@/components/analytics/ga4-script";

/* ================================================================
   Marketing Layout -- ST-833, ST-910, ST-911, ST-824
   ================================================================
   Route-group layout for all public marketing pages. Wraps children
   with the shared SiteHeader and SiteFooter chrome.

   Analytics scripts:
   - Plausible (ST-910): Privacy-friendly analytics, loaded when
     NEXT_PUBLIC_PLAUSIBLE_DOMAIN env var is set.
   - GA4 (ST-911): Consent-gated Google Analytics, only loaded after
     explicit user consent via localStorage check.

   ST-824: CSP nonce is read from the middleware-injected `x-nonce`
   request header and passed to all Script components so they are
   allowed by the nonce-based Content-Security-Policy.

   API routes and any future authenticated app routes sit outside
   this group and do NOT receive header/footer.
   ================================================================ */

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "";

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ST-824: Read the CSP nonce from the middleware-injected request header.
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") ?? "";

  return (
    <>
      {/* ── Analytics Scripts ── */}
      {PLAUSIBLE_DOMAIN && (
        <Script
          src="https://plausible.io/js/script.js"
          data-domain={PLAUSIBLE_DOMAIN}
          strategy="afterInteractive"
          nonce={nonce}
        />
      )}
      <GA4Script nonce={nonce} />

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
