"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/marketing/logo";
import { Button } from "@/components/ui/button";

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
      { label: "Analyst Review", href: "/platform/analyst-review", description: "Comprehensive professional review" },
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
// Mobile Nav: Full-screen overlay (Apple-style)
// ---------------------------------------------------------------------------

const overlayVariants: Variants = {
  closed: { opacity: 0, scale: 0.98 },
  open: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1], staggerChildren: 0.04, delayChildren: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const itemVariants: Variants = {
  closed: { opacity: 0, y: 12 },
  open: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

function MobileNavItem({ item, isActive, onClose }: { item: NavItem; isActive: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = React.useState(false);

  if (!item.dropdown) {
    return (
      <motion.li variants={itemVariants}>
        <Link
          href={item.href}
          onClick={onClose}
          aria-current={isActive ? "page" : undefined}
          className="flex items-center px-6 font-display text-xl font-semibold transition-colors"
          style={{ height: 56, color: isActive ? "#6cbc8b" : "#f7f8f8" }}
        >
          {item.label}
        </Link>
      </motion.li>
    );
  }

  return (
    <motion.li variants={itemVariants}>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between px-6 font-display text-xl font-semibold transition-colors"
        style={{ height: 56, color: isActive ? "#6cbc8b" : "#f7f8f8" }}
      >
        {item.label}
        <ChevronDown
          className={cn("h-5 w-5 transition-transform duration-200", expanded && "rotate-180")}
          style={{ opacity: 0.5 }}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden flex flex-col px-6 pb-3"
          >
            {item.dropdown.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block py-2 font-display text-[17px] font-normal transition-colors"
                  style={{ color: "rgba(247, 248, 248, 0.6)" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function MobileNavOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on escape
  React.useEffect(() => {
    if (!isOpen) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="closed"
          animate="open"
          exit="exit"
          className="fixed inset-0 z-40 flex flex-col lg:hidden"
          style={{ background: "var(--color-secondary)" }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-6 sm:px-8" style={{ height: 64 }}>
            <Link href="/" onClick={onClose} aria-label="SafeTrekr home">
              <Logo variant="light" height={28} />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-white"
              aria-label="Close navigation menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="mx-6" style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />

          {/* Nav items */}
          <motion.ul className="flex-1 overflow-y-auto py-4" variants={overlayVariants}>
            {NAV_ITEMS.map((item) => (
              <MobileNavItem
                key={item.href + item.label}
                item={item}
                isActive={isActive(item.href)}
                onClose={onClose}
              />
            ))}
          </motion.ul>

          {/* Bottom CTA area */}
          <div className="px-6 pb-8 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <a
              href={SIGN_IN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center font-display text-[15px] font-medium mb-4"
              style={{ color: "rgba(247, 248, 248, 0.7)" }}
            >
              Sign In
            </a>
            <Link
              href={DEMO_HREF}
              onClick={onClose}
              className="flex items-center justify-center rounded-lg font-display text-base font-bold text-white transition-colors"
              style={{ background: "#33704b", height: 52 }}
            >
              Schedule a Walkthrough
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Mobile Menu Button (manages overlay state)
// ---------------------------------------------------------------------------

function MobileMenuButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  const close = React.useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button
        type="button"
        className="p-2 text-foreground lg:hidden"
        aria-label="Open navigation menu"
        onClick={() => setIsOpen(true)}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <MobileNavOverlay isOpen={isOpen} onClose={close} />
    </>
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
            <Link href={DEMO_HREF}>Schedule a Walkthrough</Link>
          </Button>
        </div>

        {/* ── Mobile Menu Trigger ── */}
        <MobileMenuButton />
      </div>
    </header>
  );
}
SiteHeader.displayName = "SiteHeader";
