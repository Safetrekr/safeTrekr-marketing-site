"use client";

/**
 * ST-863: Legal Table of Contents -- Mobile and Desktop
 *
 * Two exports:
 * - `LegalTocMobile` -- collapsible TOC panel for screens below `lg`
 * - `LegalTocDesktop` -- sticky sidebar for `lg+` screens
 *
 * Both components share the same active-section tracking via
 * IntersectionObserver. They must be given the same `items` array.
 *
 * @see designs/html/mockup-legal.html -- TOC sidebar pattern
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TocItem {
  /** The `id` attribute of the target heading element. */
  id: string;
  /** Display label in the sidebar. */
  label: string;
  /** Whether this is a sub-item (indented). */
  isChild?: boolean;
}

// ---------------------------------------------------------------------------
// Shared hook: active section tracking
// ---------------------------------------------------------------------------

function useActiveTocSection(items: TocItem[]) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (headingElements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          const first = intersecting[0];
          if (first) {
            setActiveId(first.target.id);
          }
        }
      },
      {
        rootMargin: "-96px 0px -60% 0px",
        threshold: 0,
      },
    );

    headingElements.forEach((el) => observerRef.current?.observe(el));
  }, [items]);

  useEffect(() => {
    setupObserver();
    return () => observerRef.current?.disconnect();
  }, [setupObserver]);

  return activeId;
}

// ---------------------------------------------------------------------------
// Shared click handler
// ---------------------------------------------------------------------------

function handleTocClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  id: string,
  onNavigate?: () => void,
) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  onNavigate?.();
}

// ---------------------------------------------------------------------------
// LegalTocMobile
// ---------------------------------------------------------------------------

interface LegalTocMobileProps {
  items: TocItem[];
}

export function LegalTocMobile({ items }: LegalTocMobileProps) {
  const [open, setOpen] = useState(false);
  const activeId = useActiveTocSection(items);
  const sectionCount = items.filter((i) => !i.isChild).length;

  return (
    <div className="mb-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 lg:hidden">
      <button
        className="flex w-full items-center justify-between text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-toc-list"
      >
        <div className="flex items-center gap-2">
          <span className="text-eyebrow text-[var(--color-primary-700)]">
            Table of Contents
          </span>
          <span className="text-xs text-[var(--color-muted-foreground)]">
            {sectionCount} sections
          </span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[var(--color-muted-foreground)] transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      <div
        id="mobile-toc-list"
        role="region"
        aria-label="Table of contents"
        className={cn(
          "overflow-hidden transition-all duration-300",
          open ? "max-h-[600px]" : "max-h-0",
        )}
      >
        <nav
          className="mt-3 border-t border-[var(--color-border)] pt-3"
          aria-label="Document table of contents"
        >
          <ol className="space-y-0.5" style={{ listStyle: "none", padding: 0 }}>
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) =>
                    handleTocClick(e, item.id, () => setOpen(false))
                  }
                  className={cn(
                    "block py-1.5 text-sm transition-colors duration-150 hover:text-[var(--color-foreground)]",
                    item.isChild && "pl-4",
                    activeId === item.id
                      ? "font-medium text-[var(--color-primary-700)]"
                      : "text-[var(--color-muted-foreground)]",
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LegalTocDesktop
// ---------------------------------------------------------------------------

interface LegalTocDesktopProps {
  items: TocItem[];
  contactEmail?: string;
}

export function LegalTocDesktop({
  items,
  contactEmail = "legal@safetrekr.com",
}: LegalTocDesktopProps) {
  const activeId = useActiveTocSection(items);

  return (
    <aside className="hidden lg:block">
      <div
        className="sticky top-28"
        style={{ maxHeight: "calc(100vh - 8rem)", overflowY: "auto" }}
      >
        {/* TOC Card */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <nav aria-label="Document table of contents">
            <p className="text-eyebrow mb-4 text-[var(--color-primary-700)]">
              Table of Contents
            </p>
            <ol
              className="space-y-0.5"
              style={{ listStyle: "none", padding: 0 }}
            >
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleTocClick(e, item.id)}
                    className={cn(
                      "block border-l-2 py-1.5 text-sm transition-colors duration-150 hover:text-[var(--color-foreground)]",
                      item.isChild ? "pl-7 text-[13px]" : "pl-3",
                      activeId === item.id
                        ? "border-[var(--color-primary-500)] font-medium text-[var(--color-primary-700)]"
                        : "border-transparent text-[var(--color-muted-foreground)]",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Questions Card */}
        <div className="mt-6 rounded-xl bg-[var(--color-primary-50)] p-5">
          <p className="text-eyebrow mb-2 text-[var(--color-primary-700)]">
            Questions?
          </p>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Contact our legal team:
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="mt-1 block text-sm text-[var(--color-primary-700)] underline underline-offset-2"
          >
            {contactEmail}
          </a>
        </div>
      </div>
    </aside>
  );
}
