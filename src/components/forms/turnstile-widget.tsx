"use client";

/**
 * ST-823: REQ-040 -- Cloudflare Turnstile Widget
 *
 * Invisible Turnstile widget that lazy-loads the Cloudflare challenge script
 * and renders an invisible CAPTCHA challenge. Designed to be embedded inside
 * any form component. The widget generates a verification token on success
 * which is passed to the parent via `onVerify` for inclusion in form data.
 *
 * Appearance mode: `interaction-only` -- the widget is invisible unless
 * Cloudflare determines user interaction is required (e.g., suspicious
 * traffic). This avoids visual disruption for legitimate users.
 *
 * The widget container is hidden from assistive technology via
 * `aria-hidden="true"` since the challenge is not user-facing content.
 *
 * Usage:
 * ```tsx
 * const turnstileRef = useRef<TurnstileWidgetHandle>(null);
 *
 * <TurnstileWidget
 *   ref={turnstileRef}
 *   siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
 *   onVerify={(token) => setValue("turnstileToken", token)}
 *   onError={(code) => console.error("Turnstile error:", code)}
 *   onExpire={() => turnstileRef.current?.reset()}
 * />
 * ```
 *
 * @see https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
 * @see src/lib/security/turnstile.ts for server-side verification
 */

import {
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
  type ForwardedRef,
} from "react";

// ---------------------------------------------------------------------------
// Turnstile API type declarations
// ---------------------------------------------------------------------------

/**
 * Subset of the Turnstile client-side API exposed on `window.turnstile`.
 * @see https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#explicitly-render-the-turnstile-widget
 */
interface TurnstileApi {
  render: (
    container: string | HTMLElement,
    options: TurnstileRenderOptions,
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
  "error-callback"?: (errorCode: string) => void;
  "expired-callback"?: () => void;
  appearance?: "always" | "execute" | "interaction-only";
  theme?: "light" | "dark" | "auto";
  language?: string;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TURNSTILE_SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js";

/**
 * Maximum time (ms) to wait for the Turnstile script to load before
 * considering the load a failure. K-12 school firewalls may block
 * challenges.cloudflare.com entirely, causing the script to hang.
 */
const SCRIPT_LOAD_TIMEOUT_MS = 10_000;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TurnstileWidgetProps {
  /**
   * Turnstile site key from the Cloudflare dashboard.
   * Use `NEXT_PUBLIC_TURNSTILE_SITE_KEY` environment variable.
   *
   * Test keys:
   * - Always pass: `1x00000000000000000000AA`
   * - Always fail: `2x00000000000000000000AB`
   */
  siteKey: string;

  /**
   * Called when the challenge completes successfully.
   * Receives the verification token to include in form submission.
   */
  onVerify: (token: string) => void;

  /**
   * Called when the challenge encounters an error.
   * Receives the Cloudflare error code string.
   */
  onError?: (errorCode: string) => void;

  /**
   * Called when a previously valid token expires.
   * Typically used to trigger a `reset()` via the imperative handle.
   */
  onExpire?: () => void;

  /**
   * Called when the Turnstile script fails to load (e.g., blocked by
   * a school firewall). Receives the error for logging/fallback logic.
   */
  onLoadError?: (error: Error) => void;
}

/**
 * Imperative handle exposed via `ref` for parent components to control
 * the Turnstile widget programmatically.
 */
export interface TurnstileWidgetHandle {
  /** Re-runs the challenge. Use after token expiration or form reset. */
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Script loader
// ---------------------------------------------------------------------------

/**
 * Tracks global script loading state to prevent duplicate `<script>` tags
 * when multiple TurnstileWidget instances mount simultaneously.
 */
let scriptLoadPromise: Promise<void> | null = null;

/**
 * Loads the Turnstile client script into the document head.
 *
 * Uses explicit rendering mode (`?render=explicit`) so we control when
 * and where the widget renders via `window.turnstile.render()`.
 *
 * The script is loaded once and cached across all widget instances.
 * A timeout guard handles environments where the domain is blocked.
 */
function loadTurnstileScript(): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise;

  // If the script was already loaded by a previous page navigation
  // (SPA route change), resolve immediately.
  if (typeof window !== "undefined" && window.turnstile) {
    scriptLoadPromise = Promise.resolve();
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${TURNSTILE_SCRIPT_URL}?render=explicit`;
    script.async = true;
    script.defer = true;

    const timeoutId = setTimeout(() => {
      reject(
        new Error(
          `Turnstile script failed to load within ${SCRIPT_LOAD_TIMEOUT_MS}ms. ` +
            "The domain challenges.cloudflare.com may be blocked by a network " +
            "firewall (common in K-12 school environments).",
        ),
      );
      // Reset so future attempts can retry after a navigation
      scriptLoadPromise = null;
    }, SCRIPT_LOAD_TIMEOUT_MS);

    script.onload = () => {
      clearTimeout(timeoutId);
      resolve();
    };

    script.onerror = () => {
      clearTimeout(timeoutId);
      scriptLoadPromise = null;
      reject(
        new Error(
          "Failed to load Turnstile script from challenges.cloudflare.com. " +
            "This may be caused by a content blocker, ad blocker, or " +
            "institutional firewall.",
        ),
      );
    };

    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Invisible Cloudflare Turnstile widget.
 *
 * Loads the Turnstile script on mount, renders the challenge into a
 * hidden container, and reports the verification token via `onVerify`.
 * Exposes a `reset()` method via ref for programmatic control.
 *
 * The widget is hidden from the accessibility tree since the challenge
 * is handled automatically by Cloudflare and does not require user
 * interaction in the common case.
 */
export const TurnstileWidget = forwardRef(function TurnstileWidget(
  { siteKey, onVerify, onError, onExpire, onLoadError }: TurnstileWidgetProps,
  ref: ForwardedRef<TurnstileWidgetHandle>,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Stable callback refs to avoid re-rendering the widget when parent
  // callback identity changes (common with inline arrow functions).
  const onVerifyRef = useRef(onVerify);
  const onErrorRef = useRef(onError);
  const onExpireRef = useRef(onExpire);
  const onLoadErrorRef = useRef(onLoadError);

  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);
  useEffect(() => {
    onLoadErrorRef.current = onLoadError;
  }, [onLoadError]);

  // -----------------------------------------------------------------------
  // Reset method exposed to parent via ref
  // -----------------------------------------------------------------------

  const reset = useCallback(() => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, []);

  useImperativeHandle(ref, () => ({ reset }), [reset]);

  // -----------------------------------------------------------------------
  // Script loading + widget rendering
  // -----------------------------------------------------------------------

  useEffect(() => {
    let disposed = false;

    async function init() {
      try {
        await loadTurnstileScript();
      } catch (error) {
        if (!disposed) {
          onLoadErrorRef.current?.(
            error instanceof Error
              ? error
              : new Error("Unknown Turnstile script load error"),
          );
        }
        return;
      }

      if (disposed || !containerRef.current || !window.turnstile) return;

      // Render the widget into the container div. Explicit rendering
      // gives us control over the lifecycle and avoids issues with
      // React's virtual DOM reconciliation.
      const id = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        appearance: "interaction-only",
        theme: "auto",
        callback: (token: string) => {
          onVerifyRef.current(token);
        },
        "error-callback": (errorCode: string) => {
          onErrorRef.current?.(errorCode);
        },
        "expired-callback": () => {
          onExpireRef.current?.();
        },
      });

      widgetIdRef.current = id;
    }

    void init();

    return () => {
      disposed = true;

      // Clean up the widget instance to prevent memory leaks and stale
      // DOM nodes when the component unmounts (e.g., form navigation).
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      // Turnstile injects an iframe into this container. The container
      // itself has no visual footprint in `interaction-only` mode unless
      // Cloudflare triggers an interactive challenge.
    />
  );
});

TurnstileWidget.displayName = "TurnstileWidget";

export default TurnstileWidget;
