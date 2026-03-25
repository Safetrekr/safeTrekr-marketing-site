"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/marketing/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/* ================================================================
   ST-817: REQ-034 -- SiteHeader / Navigation with Dropdown Menus
   ================================================================ */

// ---------------------------------------------------------------------------
// Navigation Data
// ---------------------------------------------------------------------------

interface DropdownLink {
  label: string;
  href: string;
  description?: string;
}

interface NavItem {
  label: string;
  href: string;
  dropdown?: DropdownLink[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Platform",
    href: "/platform",
    dropdown: [
      { label: "Platform Overview", href: "/platform", description: "See all capabilities" },
      { label: "Analyst Review", href: "/platform/analyst-review", description: "17-section professional review" },
      { label: "Risk Intelligence", href: "/platform/risk-intelligence", description: "Government data scoring" },
      { label: "Safety Binder", href: "/platform/safety-binder", description: "Audit-ready documentation" },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions",
    dropdown: [
      { label: "All Solutions", href: "/solutions", description: "Find your organization" },
      { label: "K-12 Schools", href: "/solutions/k12", description: "Field trip safety" },
      { label: "Higher Education", href: "/solutions/higher-education", description: "Study abroad & Clery Act" },
      { label: "Churches & Missions", href: "/solutions/churches", description: "Mission trip safety" },
      { label: "Corporate & Sports", href: "/solutions/corporate", description: "Duty of care compliance" },
      { label: "Youth Sports", href: "/solutions/sports", description: "Tournament travel safety" },
    ],
  },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  {
    label: "Resources",
    href: "/resources/faq",
    dropdown: [
      { label: "FAQ", href: "/resources/faq", description: "Common questions" },
      { label: "Sample Binders", href: "/resources/sample-binders", description: "Download examples" },
      { label: "ROI Calculator", href: "/resources/roi-calculator", description: "Calculate your savings" },
      { label: "Glossary", href: "/resources/glossary", description: "Industry terms" },
      { label: "Compliance Guides", href: "/compliance/ferpa", description: "FERPA, Clery Act & more" },
      { label: "About SafeTrekr", href: "/about", description: "Our story" },
      { label: "Security", href: "/security", description: "Security posture" },
      { label: "Contact", href: "/contact", description: "Get in touch" },
    ],
  },
];

const SIGN_IN_URL = "https://app.safetrekr.com";
const DEMO_HREF = "/demo";

// ---------------------------------------------------------------------------
// Scroll Hook
// ---------------------------------------------------------------------------

function useScrolled(threshold = 100): boolean {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > threshold);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}

// ---------------------------------------------------------------------------
// Desktop Nav Link with Dropdown
// ---------------------------------------------------------------------------

function DesktopNavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  function handleEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }

  function handleLeave() {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }

  if (!item.dropdown) {
    return (
      <Link
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex items-center gap-1 font-body text-base font-medium transition-colors duration-150",
          isActive ? "text-foreground" : "text-foreground/70 hover:text-foreground",
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Link
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "flex items-center gap-1 font-body text-base font-medium transition-colors duration-150",
          isActive ? "text-foreground" : "text-foreground/70 hover:text-foreground",
        )}
      >
        {item.label}
        <ChevronDown
          className={cn("h-4 w-4 opacity-50 transition-transform duration-150", open && "rotate-180")}
          aria-hidden="true"
        />
      </Link>

      {/* Dropdown Panel */}
      {open && (
        <div
          className="absolute left-1/2 top-full z-50 pt-2 -translate-x-1/2"
          role="menu"
          aria-label={`${item.label} submenu`}
        >
          <div
            className="min-w-[260px] rounded-lg border bg-card p-2 shadow-lg"
            style={{ borderColor: "var(--color-border)" }}
          >
            {item.dropdown.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                className="block rounded-md px-3 py-2.5 transition-colors hover:bg-[var(--color-primary-50)]"
                style={{ textDecoration: "none" }}
                onClick={() => setOpen(false)}
              >
                <span className="block text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
                  {link.label}
                </span>
                {link.description && (
                  <span className="block text-xs mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
                    {link.description}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile Nav Section
// ---------------------------------------------------------------------------

function MobileNavSection({ item, isActive }: { item: NavItem; isActive: boolean }) {
  if (!item.dropdown) {
    return (
      <SheetClose asChild>
        <Link
          href={item.href}
          aria-current={isActive ? "page" : undefined}
          className={cn(
            "block rounded-md px-4 py-3 font-body text-base font-medium transition-colors",
            isActive ? "bg-primary-50 text-foreground" : "text-foreground hover:bg-primary-50",
          )}
        >
          {item.label}
        </Link>
      </SheetClose>
    );
  }

  return (
    <div>
      <SheetClose asChild>
        <Link
          href={item.href}
          className={cn(
            "block rounded-md px-4 py-3 font-body text-base font-semibold transition-colors",
            isActive ? "bg-primary-50 text-foreground" : "text-foreground hover:bg-primary-50",
          )}
        >
          {item.label}
        </Link>
      </SheetClose>
      <div className="ml-4 flex flex-col gap-0.5">
        {item.dropdown.map((link) => (
          <SheetClose asChild key={link.href}>
            <Link
              href={link.href}
              className="block rounded-md px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary-50 hover:text-foreground"
            >
              {link.label}
            </Link>
          </SheetClose>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SiteHeader
// ---------------------------------------------------------------------------

export function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useScrolled(100);

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-30 transition-all duration-200",
        scrolled
          ? "h-16 border-b border-border/50 bg-background/80 shadow-sm backdrop-blur-xl"
          : "h-20",
      )}
    >
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* ── Logo ── */}
        <Link href="/" aria-label="SafeTrekr home" className="shrink-0">
          <Logo variant="dark" height={32} className="hidden lg:block" aria-hidden="true" />
          <Logo variant="dark" height={28} className="lg:hidden" aria-hidden="true" />
        </Link>

        {/* ── Desktop Navigation ── */}
        <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => (
            <DesktopNavLink key={item.href + item.label} item={item} isActive={isActive(item.href)} />
          ))}
        </nav>

        {/* ── Desktop CTAs ── */}
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={SIGN_IN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            Sign In
          </a>
          <Button variant="primary" size="sm" asChild>
            <Link href={DEMO_HREF}>Get a Demo</Link>
          </Button>
        </div>

        {/* ── Mobile Menu ── */}
        <Sheet>
          <SheetTrigger asChild>
            <button type="button" className="p-2 text-foreground lg:hidden" aria-label="Open navigation menu">
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[320px] max-w-[85vw] overflow-y-auto bg-card p-6" aria-label="Main navigation">
            <SheetHeader className="mb-8 flex-row items-center justify-between space-y-0">
              <SheetTitle className="font-display text-lg font-bold text-foreground">Menu</SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <MobileNavSection key={item.href + item.label} item={item} isActive={isActive(item.href)} />
              ))}

              <div className="mt-4 border-t border-border pt-4">
                <SheetClose asChild>
                  <Button variant="primary" size="md" className="w-full" asChild>
                    <Link href={DEMO_HREF}>Get a Demo</Link>
                  </Button>
                </SheetClose>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
SiteHeader.displayName = "SiteHeader";
