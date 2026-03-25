"use client";

/**
 * ST-911: GA4 Consent-Gated Loading
 * ST-824: CSP nonce support
 *
 * Loads the Google Analytics 4 measurement script ONLY after explicit
 * user consent. This is critical for K-12 organizations where student
 * privacy regulations (FERPA, COPPA) require affirmative consent before
 * any tracking scripts are loaded.
 *
 * Consent model:
 * - Checks `localStorage` for key `analytics-consent` with value `"granted"`
 * - If consent is NOT granted, no GA4 script is loaded at all (privacy-first)
 * - The script is never loaded speculatively or deferred -- consent must exist
 *
 * The GA4 Measurement ID is read from the `NEXT_PUBLIC_GA4_ID` env var.
 * If the env var is not set, the component renders nothing.
 *
 * ST-824: The `nonce` prop is passed from the marketing layout (Server
 * Component) which reads it from the middleware-injected `x-nonce` header.
 * Both the external gtag.js script and the inline init script receive
 * the nonce so they are permitted by the nonce-based CSP.
 *
 * @example
 * ```tsx
 * // In a layout or page:
 * import { GA4Script } from "@/components/analytics/ga4-script";
 *
 * <GA4Script nonce={nonce} />
 * ```
 */

import { useEffect, useState } from "react";
import Script from "next/script";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CONSENT_KEY = "analytics-consent";
const CONSENT_VALUE = "granted";
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? "";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GA4ScriptProps {
  /** CSP nonce from the middleware, passed by the server layout. */
  nonce?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Consent-gated Google Analytics 4 script loader.
 *
 * Renders GA4 `gtag.js` and initialization scripts only when:
 * 1. `NEXT_PUBLIC_GA4_ID` env var is set
 * 2. User has explicitly granted consent via localStorage
 *
 * This component is safe to include in layouts unconditionally -- it will
 * silently render nothing when either condition is not met.
 */
export function GA4Script({ nonce }: GA4ScriptProps) {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      setConsentGranted(consent === CONSENT_VALUE);
    } catch {
      // localStorage may be unavailable (e.g., private browsing in some
      // browsers, storage quota exceeded). Default to no consent.
      setConsentGranted(false);
    }
  }, []);

  // Do not render anything if GA4 ID is missing or consent is not granted.
  if (!GA4_ID || !consentGranted) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        strategy="afterInteractive"
        nonce={nonce}
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true
            });
          `,
        }}
      />
    </>
  );
}
