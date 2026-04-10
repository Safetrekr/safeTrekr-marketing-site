"use client";

import { useEffect } from "react";

/**
 * Client component that prevents copying, cutting, and right-clicking
 * on legal pages. Attaches event listeners to the .legal-protected
 * container on mount.
 */
export function LegalCopyGuard() {
  useEffect(() => {
    const el = document.querySelector(".legal-protected");
    if (!el) return;

    const prevent = (e: Event) => e.preventDefault();

    el.addEventListener("contextmenu", prevent);
    el.addEventListener("copy", prevent);
    el.addEventListener("cut", prevent);

    return () => {
      el.removeEventListener("contextmenu", prevent);
      el.removeEventListener("copy", prevent);
      el.removeEventListener("cut", prevent);
    };
  }, []);

  return null;
}
