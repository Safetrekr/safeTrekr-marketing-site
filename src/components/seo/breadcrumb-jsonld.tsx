/**
 * ST-904: BreadcrumbList JSON-LD Component
 *
 * Auto-generates BreadcrumbList structured data from a URL path string.
 * Designed to be dropped into any interior page with minimal configuration.
 *
 * The component converts a path like "/solutions/k12" into a breadcrumb
 * trail: Home > Solutions > K-12, with proper schema.org ListItem markup.
 *
 * For pages that need custom breadcrumb labels (e.g., "K-12 Schools & Districts"
 * instead of "K12"), pass an explicit `items` array. Otherwise, the component
 * derives human-readable labels from the path segments.
 *
 * @example
 * ```tsx
 * // Auto-generated from path
 * <BreadcrumbJsonLd path="/solutions/k12" currentPageTitle="K-12 Schools & Districts" />
 *
 * // Explicit items (when auto-labels are insufficient)
 * <BreadcrumbJsonLd
 *   items={[
 *     { name: "Home", url: "https://safetrekr.com/" },
 *     { name: "Solutions", url: "https://safetrekr.com/solutions" },
 *     { name: "K-12 Schools & Districts", url: "https://safetrekr.com/solutions/k12" },
 *   ]}
 * />
 * ```
 */

import {
  JsonLd,
  generateBreadcrumbSchema,
  type BreadcrumbItem,
} from "@/lib/structured-data";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SITE_URL = "https://safetrekr.com" as const;

/**
 * Mapping of URL path segments to human-readable labels.
 * Extend this map when adding new routes that need friendlier names.
 */
const SEGMENT_LABELS: Record<string, string> = {
  solutions: "Solutions",
  k12: "K-12 Schools & Districts",
  "higher-education": "Higher Education",
  churches: "Churches & Mission Organizations",
  corporate: "Corporate & Sports Teams",
  platform: "Platform",
  "analyst-review": "Professional Analyst Review",
  "risk-intelligence": "Real-Time Risk Intelligence",
  "safety-binder": "Digital Safety Binder",
  pricing: "Pricing",
  "how-it-works": "How It Works",
  about: "About",
  contact: "Contact",
  demo: "Request a Demo",
  legal: "Legal",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  security: "Security",
  compliance: "Compliance Guides",
  ferpa: "FERPA Compliance for Student Travel",
  "clery-act": "Clery Act & Campus Travel Safety",
  "duty-of-care": "Duty of Care",
  resources: "Resources",
  faq: "Frequently Asked Questions",
  "roi-calculator": "ROI Calculator",
  sports: "Youth Sports & League Travel",
  glossary: "Glossary",
  "sample-binders": "Sample Binders",
  compare: "Compare",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Converts a kebab-case path segment into a title-case label.
 * Falls back to the SEGMENT_LABELS map first, then auto-formats.
 */
function segmentToLabel(segment: string): string {
  const mapped = SEGMENT_LABELS[segment];
  if (mapped) {
    return mapped;
  }

  // Auto-format: "some-page" -> "Some Page"
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Builds a BreadcrumbItem array from a URL path.
 * Always starts with "Home" and ends with the current page.
 *
 * @param path - URL path starting with "/" (e.g., "/solutions/k12")
 * @param currentPageTitle - Optional explicit label for the last breadcrumb
 */
function buildBreadcrumbsFromPath(
  path: string,
  currentPageTitle?: string
): BreadcrumbItem[] {
  const segments = path.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [{ name: "Home", url: `${SITE_URL}/` }];

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;
    const url = `${SITE_URL}/${segments.slice(0, index + 1).join("/")}`;
    const name = isLast && currentPageTitle
      ? currentPageTitle
      : segmentToLabel(segment);

    items.push({ name, url });
  });

  return items;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface BreadcrumbJsonLdProps {
  /**
   * URL path to auto-generate breadcrumbs from.
   * Must start with "/". Mutually exclusive with `items`.
   *
   * @example "/solutions/k12"
   */
  path?: string;

  /**
   * Optional explicit label for the current (last) page in the breadcrumb.
   * Only used when `path` is provided. Overrides the auto-generated label
   * for the final segment.
   */
  currentPageTitle?: string;

  /**
   * Explicit breadcrumb items array. When provided, `path` and
   * `currentPageTitle` are ignored.
   */
  items?: BreadcrumbItem[];
}

/**
 * Renders a BreadcrumbList JSON-LD script tag for SEO.
 *
 * Can be used in two modes:
 * 1. **Auto mode** -- pass `path` (and optionally `currentPageTitle`) to
 *    auto-generate breadcrumbs from the URL path segments.
 * 2. **Explicit mode** -- pass `items` for full control over each breadcrumb.
 *
 * This is a Server Component-compatible function component.
 */
export function BreadcrumbJsonLd({
  path,
  currentPageTitle,
  items,
}: BreadcrumbJsonLdProps) {
  const breadcrumbItems = items ?? buildBreadcrumbsFromPath(path ?? "/", currentPageTitle);

  return <JsonLd data={generateBreadcrumbSchema(breadcrumbItems)} />;
}
