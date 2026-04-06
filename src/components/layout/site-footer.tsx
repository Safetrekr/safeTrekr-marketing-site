import Link from "next/link";

import { Logo } from "@/components/marketing/logo";
import { Container } from "@/components/layout/container";

/* ================================================================
   ST-818 / REQ-035 -- SiteFooter
   Figma source: designs/html/shared-header-footer.html

   4-column link grid on dark (secondary) surface with bottom bar
   containing brand description, copyright, and legal links.

   Responsive: 4-col (lg) -> 2-col (sm) -> 1-col (mobile)
   ================================================================ */

// ---------------------------------------------------------------------------
// Navigation data
// ---------------------------------------------------------------------------

interface FooterLink {
  label: string;
  href: string;
}

interface FooterLinkGroup {
  heading: string;
  ariaLabel: string;
  links: FooterLink[];
}

/**
 * Column 2 has a secondary subgroup ("How It Works") beneath "Solutions",
 * so we model it as a column with multiple groups.
 */
interface FooterColumn {
  groups: FooterLinkGroup[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  // Column 1: Platform
  {
    groups: [
      {
        heading: "Platform",
        ariaLabel: "Platform links",
        links: [
          { label: "Platform Overview", href: "/platform" },
          { label: "Analyst Review", href: "/platform/analyst-review" },
          { label: "Risk Intelligence", href: "/platform/risk-intelligence" },
          { label: "Safety Binder", href: "/platform/safety-binder" },
          { label: "Mobile App", href: "/platform/mobile-app" },
          { label: "Monitoring", href: "/platform/monitoring" },
          { label: "Compliance", href: "/platform/compliance" },
        ],
      },
    ],
  },
  // Column 2: Solutions + How It Works
  {
    groups: [
      {
        heading: "Solutions",
        ariaLabel: "Solutions and process links",
        links: [
          { label: "K-12 Schools", href: "/solutions/k12" },
          { label: "Higher Education", href: "/solutions/higher-education" },
          {
            label: "Churches and Mission Orgs",
            href: "/solutions/churches",
          },
          { label: "Corporate and Sports", href: "/solutions/corporate" },
        ],
      },
      {
        heading: "How It Works",
        ariaLabel: "How it works links",
        links: [
          { label: "How It Works", href: "/how-it-works" },
          { label: "Pricing", href: "/pricing" },
        ],
      },
    ],
  },
  // Column 3: Resources
  {
    groups: [
      {
        heading: "Resources",
        ariaLabel: "Resources links",
        links: [
          { label: "Case Studies", href: "/resources/case-studies" },
          { label: "Guides", href: "/resources/guides" },
          { label: "Sample Binders", href: "/resources/sample-binders" },
          { label: "FAQ", href: "/resources/faq" },
        ],
      },
    ],
  },
  // Column 4: Company
  {
    groups: [
      {
        heading: "Company",
        ariaLabel: "Company links",
        links: [
          { label: "About SafeTrekr", href: "/about" },
          { label: "Our Analysts", href: "/about/analysts" },
          { label: "Security and Trust", href: "/security" },
          { label: "Contact", href: "/contact" },
        ],
      },
    ],
  },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "DPA", href: "/legal/dpa" },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FooterLinkGroupSection({ group }: { group: FooterLinkGroup }) {
  return (
    <div>
      <h3 className="text-body-sm font-semibold uppercase tracking-wide mb-4 text-[var(--color-dark-text-primary)]">
        {group.heading}
      </h3>
      <ul className="space-y-1 list-none">
        {group.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block py-1 text-body-sm text-[var(--color-dark-text-secondary)] transition-colors duration-150 hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterColumnNav({ column }: { column: FooterColumn }) {
  // Use the first group's ariaLabel for the nav landmark.
  // If there are multiple groups, they share one nav element.
  const primaryAriaLabel = column.groups[0]?.ariaLabel ?? column.groups[0]?.heading ?? "Navigation";

  return (
    <nav aria-label={primaryAriaLabel}>
      {column.groups.map((group, index) => (
        <div key={group.heading} className={index > 0 ? "mt-6" : undefined}>
          <FooterLinkGroupSection group={group} />
        </div>
      ))}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * SiteFooter -- Global site footer for the SafeTrekr marketing site.
 *
 * Renders on a dark (secondary / authority-blue) background with:
 * - Logo (light variant)
 * - 4-column link grid (responsive: 4 -> 2 -> 1)
 * - Bottom bar: brand description, copyright, legal links, data attribution
 *
 * Uses `data-theme="dark"` so nested components inherit dark CSS variable
 * overrides from globals.css.
 */
function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-secondary pt-16 pb-8"
      data-theme="dark"
    >
      <Container>
        {/* Logo */}
        <div className="mb-10">
          <Link href="/" aria-label="SafeTrekr home">
            <Logo variant="light" height={28} />
          </Link>
        </div>

        {/* Footer link columns: 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {FOOTER_COLUMNS.map((column, index) => (
            <FooterColumnNav key={index} column={column} />
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--color-dark-border)]">
          {/* Brand description */}
          <p className="text-body-sm text-[var(--color-dark-text-secondary)] max-w-[65ch] leading-relaxed">
            Professional trip safety review and evidence documentation for
            organizations that protect travelers.
          </p>

          {/* Copyright + Legal links */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs text-[var(--color-dark-text-secondary)]">
            <span>&copy; {currentYear} SafeTrekr, Inc. All rights reserved.</span>
            {LEGAL_LINKS.map((link) => (
              <span key={link.href} className="flex items-center gap-x-4">
                <span className="text-white/20" aria-hidden="true">|</span>
                <Link
                  href={link.href}
                  className="text-xs text-[var(--color-dark-text-secondary)] transition-colors duration-150 hover:text-white"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>

        </div>
      </Container>
    </footer>
  );
}
SiteFooter.displayName = "SiteFooter";

export { SiteFooter };
