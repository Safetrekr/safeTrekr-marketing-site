/**
 * ST-863: Shared Legal Pages Layout
 *
 * Provides the common structure for all legal pages: 720px max-width
 * content area with a 260px sticky TOC sidebar on desktop. Clean,
 * neutral typography optimized for reading long-form legal documents.
 *
 * Each legal page (privacy, terms) is responsible for its own content
 * and TOC data. This layout provides the structural container and
 * consistent styling via the `legal-prose` class from globals.css.
 *
 * @see designs/html/mockup-legal.html
 */

import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {children}
    </div>
  );
}
