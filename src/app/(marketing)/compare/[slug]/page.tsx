/**
 * ST-875: Comparison Pages (/compare/[slug])
 *
 * Category comparison pages contrasting SafeTrekr against three broad
 * approach categories that organizations commonly use for travel risk
 * management. Each page is SSG via generateStaticParams and targets
 * bottom-of-funnel searchers evaluating alternatives.
 *
 * Slugs:
 *   - spreadsheet-checklists  , SafeTrekr vs. Spreadsheets & Checklists
 *   - logistics-apps          , SafeTrekr vs. Travel Logistics Apps
 *   - enterprise-risk-platforms, SafeTrekr vs. Enterprise Risk Platforms
 *
 * Each page includes:
 *   1. Breadcrumb + Article JSON-LD + FAQPage JSON-LD
 *   2. Hero section with eyebrow, headline, and intro paragraph
 *   3. Comparison matrix table (semantic HTML)
 *   4. Detailed analysis sections
 *   5. FAQ accordion (auto-generates FAQPage schema)
 *   6. CTA band
 *
 * Server Component, no "use client" directive needed.
 *
 * @see src/app/(marketing)/solutions/churches/page.tsx for pattern reference
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, X, Minus, ArrowRight, Shield } from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import {
  JsonLd,
  generateBreadcrumbSchema,
  generateArticleSchema,
  type FAQItem,
} from "@/lib/structured-data";
import { SectionContainer } from "@/components/layout/section-container";
import { Container } from "@/components/layout/container";
import { Eyebrow, FAQSection, CTABand } from "@/components/marketing";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single row in the category-specific comparison matrix. */
interface ComparisonMatrixRow {
  /** Capability or feature being compared. */
  feature: string;
  /** How the category approach handles this capability. */
  category: "yes" | "no" | "partial" | string;
  /** How SafeTrekr handles this capability. */
  safetrekr: "yes" | "no" | "partial" | string;
}

/** A prose analysis section with heading and body paragraphs. */
interface AnalysisSection {
  heading: string;
  paragraphs: string[];
}

/** Complete content definition for one comparison page. */
interface ComparisonPageData {
  /** URL slug used in /compare/[slug]. */
  slug: string;
  /** SEO page title (appended with " | SafeTrekr" via generatePageMetadata). */
  metaTitle: string;
  /** SEO meta description for SERPs. */
  metaDescription: string;
  /** Eyebrow text above the headline. */
  eyebrow: string;
  /** Main h1 headline. */
  headline: string;
  /** Introductory paragraph(s) below the headline. */
  intro: string[];
  /** Label for the category column header in the comparison table. */
  categoryLabel: string;
  /** Comparison matrix rows. */
  comparisonRows: readonly ComparisonMatrixRow[];
  /** Detailed analysis sections rendered below the table. */
  analysisSections: readonly AnalysisSection[];
  /** FAQ items rendered in the accordion. */
  faqItems: FAQItem[];
  /** Article schema metadata. */
  articleHeadline: string;
  articleDescription: string;
  articleDatePublished: string;
  articleWordCount: number;
}

// ---------------------------------------------------------------------------
// Comparison Data: Spreadsheets & Checklists
// ---------------------------------------------------------------------------

const SPREADSHEET_CHECKLISTS: ComparisonPageData = {
  slug: "spreadsheet-checklists",
  metaTitle:
    "SafeTrekr vs. Spreadsheets & Checklists for Travel Risk Management",
  metaDescription:
    "Compare SafeTrekr's professional analyst-driven travel risk platform against DIY spreadsheets and checklists. See why organizations upgrade from manual processes to documented, auditable risk intelligence.",
  eyebrow: "Comparison",
  headline: "SafeTrekr vs. Spreadsheets & Checklists",
  intro: [
    "Spreadsheets and checklists are where most organizations start with travel risk management. A trip leader creates a Google Sheet, adds columns for destinations, emergency contacts, and hotel addresses, and emails it to the team. It works, until it does not.",
    "The fundamental limitation of spreadsheet-based safety planning is not the tool itself. It is that the person filling out the spreadsheet is rarely a trained safety professional, the data comes from Google searches rather than government intelligence agencies, and the resulting document has no audit trail, no verification, and no professional review. When an insurance carrier asks whether your organization conducted a formal risk assessment, a volunteer-assembled spreadsheet is not the answer they are looking for.",
  ],
  categoryLabel: "Spreadsheets & Checklists",
  comparisonRows: [
    {
      feature: "Professional analyst review of every trip",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Government intelligence data (NOAA, CDC, USGS, GDACS, ReliefWeb)",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Structured safety assessment methodology",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Board-ready professional documentation",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Audit-ready evidence binder for insurance and legal review",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Active trip awareness during travel",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Mobile field operations (geofencing, check-ins, rally points)",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Standardized review across comprehensive safety dimensions",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Customizable to organization-specific needs",
      category: "yes",
      safetrekr: "yes",
    },
    {
      feature: "Low upfront cost",
      category: "yes",
      safetrekr: "Starting at $450",
    },
    {
      feature: "No specialized training to create",
      category: "yes",
      safetrekr: "yes",
    },
    {
      feature: "Institutional knowledge retention across trip leaders",
      category: "no",
      safetrekr: "yes",
    },
  ],
  analysisSections: [
    {
      heading: "The Hidden Cost of DIY Safety Planning",
      paragraphs: [
        "Organizations that rely on spreadsheets and checklists often underestimate the true cost of the approach. A typical trip leader spends 40 to 60 hours assembling safety information for an international trip, pulling weather data from one site, checking CDC advisories on another, Googling hospital locations near the destination, and hoping the embassy travel advisory page is current. That is volunteer labor with a real opportunity cost.",
        "More critically, the information collected through manual research lacks the breadth and depth of professional intelligence sources. A Google search for 'safety conditions in Guatemala City' returns tourist blog posts and outdated travel forums. SafeTrekr pulls from NOAA weather modeling, USGS seismic activity data, CDC epidemiological advisories, and humanitarian agency feeds from GDACS and ReliefWeb, the same sources used by international aid organizations to make field decisions.",
      ],
    },
    {
      heading: "Documentation That Holds Up to Scrutiny",
      paragraphs: [
        "The most significant gap between spreadsheet-based planning and professional risk management is documentation integrity. A spreadsheet can be edited by anyone with access, has no version control meaningful to an auditor, and provides no evidence of when assessments were made or by whom. If an incident occurs and litigation follows, a plaintiff's attorney will ask when the risk assessment was conducted, who conducted it, what data sources were used, and whether the document was altered after the fact.",
        "SafeTrekr produces a complete safety binder with every finding cited to its source and every decision recorded with timestamps. The binder is not a self-reported checklist, it is a professionally reviewed record that demonstrates your organization completed specific, documented preparation.",
      ],
    },
    {
      heading: "When Spreadsheets Make Sense, and When They Do Not",
      paragraphs: [
        "Spreadsheets remain useful for internal trip logistics, packing lists, itinerary coordination, budget tracking, and team communication. SafeTrekr is not a replacement for those organizational tools. Where spreadsheets fall short is in the safety assessment itself: evaluating destination risk, documenting due diligence, and producing evidence that satisfies insurance carriers, legal counsel, and institutional oversight boards.",
        "Organizations that have experienced an incident, or that operate in regulated environments where duty of care is enforceable, typically discover that spreadsheet-based safety planning creates liability rather than reducing it. The transition from DIY to professional risk assessment is not about abandoning familiar tools. It is about recognizing which parts of trip preparation require professional rigor and which do not.",
      ],
    },
  ],
  faqItems: [
    {
      question:
        "Can we keep using our existing spreadsheets alongside SafeTrekr?",
      answer:
        "Absolutely. Many organizations continue using spreadsheets for logistics coordination, packing lists, budget tracking, itinerary management, and team communication. SafeTrekr handles the safety assessment and documentation layer that spreadsheets cannot provide: professional review, government data, safety assessment, and board-ready documentation. The two tools serve different purposes and work well together.",
    },
    {
      question:
        "How much time does SafeTrekr save compared to manual research?",
      answer:
        "Trip leaders typically spend 40 to 60 hours assembling safety information for an international trip using manual methods. With SafeTrekr, you submit your trip details through a guided form, and a professional analyst delivers a complete safety binder quickly. Your trip leader's time shifts from amateur research to ministry and program preparation.",
    },
    {
      question:
        "Our spreadsheet template has worked fine for years. Why change?",
      answer:
        "If your organization has never had an incident, it is easy to conclude that your current process is adequate. The gap becomes visible only when something goes wrong. An insurance carrier's post-incident review does not evaluate whether your trips went well, it evaluates whether you documented reasonable precautions before the trip that went badly. A volunteer-assembled spreadsheet and a professionally reviewed evidence binder produce very different answers to that question.",
    },
    {
      question:
        "Does SafeTrekr replace the need for a trip leader to do any planning?",
      answer:
        "No. SafeTrekr replaces the safety assessment and documentation portion of trip planning, the part that requires professional expertise, government data sources, and auditable evidence. Your trip leader still plans the program, coordinates logistics, manages the team, and leads the experience. SafeTrekr ensures the safety foundation underneath all of that work is professionally reviewed and documented.",
    },
    {
      question: "What if we only do domestic trips?",
      answer:
        "Domestic trips still carry meaningful risk, weather events, venue safety, transportation incidents, medical emergencies in remote areas, and duty of care obligations for minors. A domestic mission trip or school field trip to rural Appalachia or a Gulf Coast service project involves real hazards that deserve professional review. SafeTrekr's domestic trip assessment starts at $450 and covers the same comprehensive safety dimensions as international reviews.",
    },
  ],
  articleHeadline:
    "SafeTrekr vs. Spreadsheets & Checklists: A Travel Risk Management Comparison",
  articleDescription:
    "A detailed comparison of SafeTrekr's professional travel risk platform against DIY spreadsheets and checklists, covering documentation integrity, intelligence sources, and audit readiness.",
  articleDatePublished: "2026-03-24",
  articleWordCount: 1350,
};

// ---------------------------------------------------------------------------
// Comparison Data: Travel Logistics Apps
// ---------------------------------------------------------------------------

const LOGISTICS_APPS: ComparisonPageData = {
  slug: "logistics-apps",
  metaTitle:
    "SafeTrekr vs. Travel Logistics Apps for Travel Risk Management",
  metaDescription:
    "Compare SafeTrekr's analyst-driven risk intelligence platform against travel logistics apps. Understand the difference between trip organization tools and professional safety documentation.",
  eyebrow: "Comparison",
  headline: "SafeTrekr vs. Travel Logistics Apps",
  intro: [
    "Travel logistics apps excel at what they were designed to do: organizing itineraries, booking flights and hotels, sharing trip plans with travel companions, and providing point-of-interest recommendations. They make the operational side of travel smoother and more efficient. Many organizations use them alongside SafeTrekr for exactly those purposes.",
    "Where logistics apps fall short is in the domain they were never built to serve: professional risk assessment, government-grade intelligence analysis, and auditable safety documentation. A logistics app can tell you where your hotel is. It cannot tell you whether the neighborhood has experienced civil unrest in the past 90 days, whether the nearest Level 1 trauma center is within evacuation distance, or whether seismic activity in the region has increased beyond historical norms. These are fundamentally different questions that require fundamentally different tools.",
  ],
  categoryLabel: "Travel Logistics Apps",
  comparisonRows: [
    {
      feature: "Professional analyst review of every trip",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Government intelligence data (NOAA, CDC, USGS, GDACS, ReliefWeb)",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Structured safety assessment methodology",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Board-ready professional documentation",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Audit-ready evidence binder for insurance and legal review",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Itinerary management and trip organization",
      category: "yes",
      safetrekr: "partial",
    },
    {
      feature: "Flight and hotel booking integration",
      category: "yes",
      safetrekr: "no",
    },
    {
      feature: "Real-time safety monitoring during active trips",
      category: "partial",
      safetrekr: "yes",
    },
    {
      feature: "Mobile field operations (geofencing, check-ins, rally points)",
      category: "partial",
      safetrekr: "yes",
    },
    {
      feature: "Standardized review across comprehensive safety dimensions",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Duty of care documentation for organizational liability",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Emergency evacuation planning and contingencies",
      category: "no",
      safetrekr: "yes",
    },
  ],
  analysisSections: [
    {
      heading: "Organization vs. Protection: Different Problems, Different Tools",
      paragraphs: [
        "The core distinction between travel logistics apps and SafeTrekr is the problem each tool solves. Logistics apps answer operational questions: Where are we staying? What time does the bus leave? Where is the nearest restaurant? These are valuable answers that make trips run smoothly.",
        "SafeTrekr answers safety questions: What are the documented risks at this destination? Has a professional analyst reviewed our venues, transportation, lodging, and emergency preparedness? Do we have evidence that our organization exercised reasonable care? If an incident occurs, can we produce documentation that demonstrates due diligence? These questions have legal, insurance, and institutional consequences that logistics apps were never designed to address.",
      ],
    },
    {
      heading: "The Intelligence Gap",
      paragraphs: [
        "Some travel logistics apps include basic safety features, travel advisories from the State Department, city safety ratings, or crowd-sourced crime reports. These are consumer-grade signals that provide general awareness. They are not the foundation for a professional risk assessment.",
        "SafeTrekr's intelligence layer draws from five government and humanitarian data sources: NOAA for weather and environmental modeling, USGS for seismic and geological activity, CDC for epidemiological advisories, and GDACS and ReliefWeb for humanitarian situation monitoring. This data is analyzed by a trained safety analyst who evaluates the specific conditions your team will encounter at your specific destinations on your specific dates, not a generic country-level travel advisory.",
      ],
    },
    {
      heading: "When to Use Both",
      paragraphs: [
        "The most effective approach for organizations with duty of care obligations is to use logistics apps for what they do well, itinerary coordination, booking management, and trip communication, while using SafeTrekr for what logistics apps cannot provide: professional safety assessment, government intelligence analysis, and auditable documentation.",
        "A school district sending students abroad, a church organizing a mission trip, or a corporation deploying employees to emerging markets needs both organized logistics and documented safety preparation. The logistics app makes the trip run smoothly. SafeTrekr ensures the organization can demonstrate it took professionally reviewed precautions before the trip departed.",
      ],
    },
  ],
  faqItems: [
    {
      question:
        "Can we use our existing travel app alongside SafeTrekr?",
      answer:
        "Yes. SafeTrekr is designed to complement logistics tools, not replace them. Your team can continue using any travel app for itinerary management, booking coordination, and trip communication. SafeTrekr handles the safety assessment, risk intelligence, and documentation layer that logistics apps do not provide. Many organizations use both tools for different aspects of trip preparation.",
    },
    {
      question:
        "Do travel logistics apps provide any safety features?",
      answer:
        "Some logistics apps include basic safety features such as State Department travel advisories, city safety ratings, or crowd-sourced crime reports. These are consumer-grade awareness signals that provide general guidance. They are not professional risk assessments, they are not reviewed by a trained analyst, and they do not produce the auditable documentation that insurance carriers and institutional oversight boards require.",
    },
    {
      question:
        "Why can't we just use the safety features in our existing travel app?",
      answer:
        "The safety features in logistics apps serve a fundamentally different purpose than professional safety assessment. A travel advisory telling you 'exercise increased caution in Country X' is awareness information. A comprehensive professional review documenting specific considerations at your specific destinations with trusted data and audit-ready documentation is evidence of thorough preparation. The distinction matters when your organization needs to demonstrate what preparation it completed.",
    },
    {
      question:
        "Does SafeTrekr handle trip booking or itinerary management?",
      answer:
        "No. SafeTrekr focuses exclusively on travel risk assessment, safety documentation, and field operations. We do not manage bookings, flights, hotels, or itineraries. This is intentional, organizations already have tools they prefer for logistics. SafeTrekr provides the safety intelligence and audit-ready documentation that those tools were never designed to deliver.",
    },
    {
      question:
        "What about travel apps that claim to offer 'risk management' features?",
      answer:
        "Examine what the feature actually provides. If it is a country-level risk rating, a State Department advisory feed, or a crowd-sourced safety map, that is consumer awareness, not professional safety planning. Professional safety planning means a trained professional reviews your specific trip against government data across comprehensive safety dimensions and produces an audit-ready documentation binder. If the tool does not provide professional review, government data sources, and stakeholder-ready documentation, it is not a safety planning platform.",
    },
  ],
  articleHeadline:
    "SafeTrekr vs. Travel Logistics Apps: Understanding the Difference",
  articleDescription:
    "A detailed comparison of SafeTrekr's professional risk intelligence platform against travel logistics apps, covering safety assessment depth, intelligence sources, and documentation standards.",
  articleDatePublished: "2026-03-24",
  articleWordCount: 1250,
};

// ---------------------------------------------------------------------------
// Comparison Data: Enterprise Risk Platforms
// ---------------------------------------------------------------------------

const ENTERPRISE_RISK_PLATFORMS: ComparisonPageData = {
  slug: "enterprise-risk-platforms",
  metaTitle:
    "SafeTrekr vs. Enterprise Risk Platforms for Travel Risk Management",
  metaDescription:
    "Compare SafeTrekr's analyst-driven travel risk platform against enterprise risk management systems. See how purpose-built trip safety differs from broad organizational risk frameworks.",
  eyebrow: "Comparison",
  headline: "SafeTrekr vs. Enterprise Risk Platforms",
  intro: [
    "Enterprise risk management platforms are powerful systems designed to identify, assess, and monitor risks across an entire organization, financial risk, operational risk, compliance risk, cybersecurity risk, and yes, sometimes travel risk. They serve large organizations that need a unified view of their total risk landscape. For that purpose, they are indispensable.",
    "The challenge arises when organizations try to use a broad enterprise risk platform to solve the specific problem of trip-level safety assessment and documentation. Enterprise platforms are built for portfolio-level risk visibility. SafeTrekr is built for trip-level safety execution. The difference is not one of quality, it is one of purpose, granularity, and the specific evidence your insurance carrier needs when they ask about a specific trip to a specific destination.",
  ],
  categoryLabel: "Enterprise Risk Platforms",
  comparisonRows: [
    {
      feature: "Trip-specific professional analyst review",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Government intelligence data per destination per trip",
      category: "partial",
      safetrekr: "yes",
    },
    {
      feature: "Professional safety assessment at the trip level",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Board-ready professional documentation",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Audit-ready evidence binder per trip",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Organization-wide risk portfolio view",
      category: "yes",
      safetrekr: "no",
    },
    {
      feature: "Compliance and regulatory risk tracking",
      category: "yes",
      safetrekr: "partial",
    },
    {
      feature: "Financial and operational risk modeling",
      category: "yes",
      safetrekr: "no",
    },
    {
      feature: "Mobile field operations (geofencing, check-ins, rally points)",
      category: "no",
      safetrekr: "yes",
    },
    {
      feature: "Setup and deployment time",
      category: "Weeks to months",
      safetrekr: "Same day",
    },
    {
      feature: "Requires dedicated risk management staff",
      category: "yes",
      safetrekr: "no",
    },
    {
      feature: "Per-trip cost",
      category: "$5,000+",
      safetrekr: "Starting at $450",
    },
  ],
  analysisSections: [
    {
      heading: "Portfolio Risk vs. Trip-Level Safety: Different Granularity",
      paragraphs: [
        "Enterprise risk platforms operate at the organizational level. They help risk managers identify which categories of risk the organization faces, assign probability and impact scores to those categories, track mitigation efforts across departments, and report risk posture to the board. This is essential work, and SafeTrekr does not attempt to replace it.",
        "What enterprise platforms typically lack is the granularity to assess an individual trip. When your school district sends 30 students to Costa Rica next month, you need to know the specific weather conditions during those dates, the specific safety profile of the venues they will visit, the specific distance to the nearest emergency medical facility from each location, and the specific evacuation routes available. Enterprise risk platforms categorize 'travel risk' as one line item in a risk register. SafeTrekr produces a comprehensive analyst review of that specific trip.",
      ],
    },
    {
      heading: "Implementation Complexity and Organizational Fit",
      paragraphs: [
        "Enterprise risk platforms are designed for organizations with dedicated risk management departments, six-figure budgets, and multi-month implementation timelines. They require configuration, training, ongoing administration, and typically an annual license that assumes the organization has staff who will use the platform daily across multiple risk domains.",
        "Many organizations with meaningful travel risk exposure, schools, churches, nonprofits, mid-market companies, do not have dedicated risk management departments. They need professional safety assessment for their trips without building an entire risk management infrastructure. SafeTrekr delivers professional analyst review, government intelligence data, and audit-ready documentation on a per-trip basis, with no implementation timeline, no dedicated staff requirement, and no enterprise license commitment.",
      ],
    },
    {
      heading: "Complementary Approaches for Large Organizations",
      paragraphs: [
        "For organizations that already operate an enterprise risk platform, SafeTrekr serves as the execution layer for trip-level safety. The enterprise platform identifies travel risk as a category requiring mitigation. SafeTrekr provides the specific preparation evidence: professionally reviewed safety binders for each trip, with government data and board-ready documentation.",
        "This complementary approach means the risk management team can report to the board that travel risk is being actively mitigated, and point to specific, auditable documentation for every trip the organization sends. The enterprise platform provides the strategic view. SafeTrekr provides the tactical evidence.",
      ],
    },
  ],
  faqItems: [
    {
      question:
        "We already have an enterprise risk platform. Do we still need SafeTrekr?",
      answer:
        "If your enterprise platform produces trip-specific professional reviews with government data and audit-ready documentation for every trip your organization sends, you may not. Most enterprise risk platforms operate at the portfolio level, they track travel risk as a category but do not produce the per-trip documentation that insurance carriers and stakeholders appreciate. SafeTrekr provides that trip-level execution layer.",
    },
    {
      question:
        "Can SafeTrekr integrate with our existing enterprise risk management system?",
      answer:
        "SafeTrekr's output, the safety binder, is a documented package that can be attached to any risk management system as a preparation artifact. Each binder includes all findings, government data sources, and safety assessments. Your risk management team can reference these binders as evidence of trip-level preparation within your enterprise platform's risk register.",
    },
    {
      question:
        "How does SafeTrekr's pricing compare to enterprise risk platforms?",
      answer:
        "Enterprise risk platforms typically involve annual licenses ranging from $25,000 to $250,000 or more, plus implementation costs, training, and ongoing administration. SafeTrekr operates on a per-trip model: $450 for domestic trips, $750 for domestic overnight, and $1,250 for international trips. Organizations that send 10 international trips per year would pay approximately $12,500, a fraction of an enterprise platform license, with no implementation timeline or dedicated staff requirement.",
    },
    {
      question:
        "Is SafeTrekr appropriate for large organizations with hundreds of trips?",
      answer:
        "Yes. SafeTrekr scales to any trip volume. For large organizations, SafeTrekr functions as the trip-level safety assessment layer beneath the enterprise risk platform, ensuring every trip gets professional analyst review without requiring the risk management team to conduct individual trip assessments. Contact us to discuss arrangements for high-volume organizations.",
    },
    {
      question:
        "What if our enterprise platform already includes travel risk features?",
      answer:
        "Evaluate what those features actually deliver at the individual trip level. If the platform provides country-level risk ratings and a policy compliance checklist, that is portfolio-level awareness. If it assigns a trained professional to review each trip across comprehensive safety dimensions using government data and produces a board-ready documentation binder, that is trip-level safety assessment. Most enterprise platforms provide the former. SafeTrekr provides the latter.",
    },
  ],
  articleHeadline:
    "SafeTrekr vs. Enterprise Risk Platforms: Portfolio Risk vs. Trip-Level Safety",
  articleDescription:
    "A detailed comparison of SafeTrekr's trip-level safety platform against enterprise risk management systems, covering granularity, implementation complexity, and per-trip documentation.",
  articleDatePublished: "2026-03-24",
  articleWordCount: 1400,
};

// ---------------------------------------------------------------------------
// Data lookup
// ---------------------------------------------------------------------------

const COMPARISON_PAGES: Record<string, ComparisonPageData> = {
  "spreadsheet-checklists": SPREADSHEET_CHECKLISTS,
  "logistics-apps": LOGISTICS_APPS,
  "enterprise-risk-platforms": ENTERPRISE_RISK_PLATFORMS,
} as const;

const VALID_SLUGS = Object.keys(COMPARISON_PAGES);

// ---------------------------------------------------------------------------
// Static Params
// ---------------------------------------------------------------------------

export function generateStaticParams(): { slug: string }[] {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// Dynamic Metadata
// ---------------------------------------------------------------------------

interface ComparePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ComparePageProps) {
  const { slug } = await params;
  const data = COMPARISON_PAGES[slug];
  if (!data) return {};

  return generatePageMetadata({
    title: data.metaTitle,
    description: data.metaDescription,
    path: `/compare/${slug}`,
  });
}

// ---------------------------------------------------------------------------
// Cell value renderer
// ---------------------------------------------------------------------------

function CellValue({ value }: { value: string }) {
  if (value === "yes") {
    return (
      <span className="inline-flex items-center gap-1.5 text-primary-600">
        <Check className="size-5" strokeWidth={2.5} aria-hidden="true" />
        <span className="sr-only">Yes</span>
      </span>
    );
  }

  if (value === "no") {
    return (
      <span className="inline-flex items-center gap-1.5 text-muted-foreground/50">
        <X className="size-4" strokeWidth={2} aria-hidden="true" />
        <span className="sr-only">No</span>
      </span>
    );
  }

  if (value === "partial") {
    return (
      <span className="inline-flex items-center gap-1.5 text-warning-500">
        <Minus className="size-4" strokeWidth={2} aria-hidden="true" />
        <span className="text-body-xs text-muted-foreground">Partial</span>
      </span>
    );
  }

  // Custom text (e.g., "Starting at $450", "$5,000+", "Weeks to months")
  return (
    <span className="text-body-xs font-medium text-muted-foreground">
      {value}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function ComparePage({ params }: ComparePageProps) {
  const { slug } = await params;
  const data = COMPARISON_PAGES[slug];

  if (!data) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", url: "https://safetrekr.com/" },
    { name: "Compare", url: "https://safetrekr.com/compare" },
    {
      name: data.headline.replace("SafeTrekr vs. ", ""),
      url: `https://safetrekr.com/compare/${slug}`,
    },
  ];

  return (
    <>
      {/* ----------------------------------------------------------------
          Structured Data
          ---------------------------------------------------------------- */}
      <JsonLd data={generateBreadcrumbSchema(breadcrumbItems)} />
      <JsonLd
        data={generateArticleSchema({
          headline: data.articleHeadline,
          description: data.articleDescription,
          datePublished: data.articleDatePublished,
          authorName: "SafeTrekr Team",
          authorTitle: "Travel Risk Intelligence",
          path: `/compare/${slug}`,
          section: "Comparison",
          wordCount: data.articleWordCount,
        })}
      />

      <main>
        {/* ================================================================
            SECTION 1: HERO
            ================================================================ */}
        <SectionContainer id="hero" aria-label="Introduction">
          <Container>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 lg:mb-8">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/"
                    className="text-primary-700 hover:underline"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="select-none">
                  /
                </li>
                <li>
                  <span className="text-primary-700">Compare</span>
                </li>
                <li aria-hidden="true" className="select-none">
                  /
                </li>
                <li aria-current="page" className="font-medium text-foreground">
                  {data.headline.replace("SafeTrekr vs. ", "")}
                </li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <Eyebrow
                color="primary"
                icon={<Shield className="size-4" />}
              >
                {data.eyebrow}
              </Eyebrow>

              <h1 className="mt-5 text-display-xl text-foreground">
                {data.headline}
              </h1>

              <div className="mt-6 space-y-4">
                {data.intro.map((paragraph, index) => (
                  <p
                    key={index}
                    className="max-w-[65ch] text-body-lg text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </Container>
        </SectionContainer>

        {/* ================================================================
            SECTION 2: COMPARISON MATRIX TABLE
            ================================================================ */}
        <SectionContainer
          id="comparison"
          variant="card"
          ariaLabelledBy="comparison-heading"
        >
          <Container>
            <div className="mb-8 text-center">
              <h2
                id="comparison-heading"
                className="text-display-md text-foreground"
              >
                Feature-by-Feature Comparison
              </h2>
              <p className="mt-3 text-body-lg text-muted-foreground">
                How {data.categoryLabel.toLowerCase()} compare against
                SafeTrekr&apos;s professional risk intelligence platform.
              </p>
            </div>

            {/* Desktop: semantic HTML table */}
            <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th
                      scope="col"
                      className="px-6 py-4 text-body-sm font-semibold text-foreground"
                    >
                      Capability
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-body-sm font-semibold text-foreground"
                    >
                      {data.categoryLabel}
                    </th>
                    <th
                      scope="col"
                      className="bg-primary-50 px-6 py-4 text-center text-body-sm font-semibold text-primary-700"
                    >
                      SafeTrekr
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.comparisonRows.map((row, index) => (
                    <tr
                      key={row.feature}
                      className={
                        index < data.comparisonRows.length - 1
                          ? "border-b border-border"
                          : ""
                      }
                    >
                      <td className="px-6 py-4 text-body-sm font-medium text-foreground">
                        {row.feature}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center">
                          <CellValue value={row.category} />
                        </span>
                      </td>
                      <td className="bg-primary-50 px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center">
                          <CellValue value={row.safetrekr} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: card layout */}
            <div className="space-y-3 md:hidden" role="list">
              {data.comparisonRows.map((row) => (
                <div
                  key={row.feature}
                  className="rounded-lg border border-border bg-card p-4"
                  role="listitem"
                >
                  <span className="text-body-sm font-medium text-foreground">
                    {row.feature}
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-foreground">
                      <CellValue value={row.category} />
                      <span className="text-muted-foreground">
                        {data.categoryLabel}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                      <CellValue value={row.safetrekr} />
                      SafeTrekr
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </SectionContainer>

        {/* ================================================================
            SECTION 3: DETAILED ANALYSIS
            ================================================================ */}
        <SectionContainer
          id="analysis"
          ariaLabelledBy="analysis-heading"
        >
          <Container size="md">
            <h2 id="analysis-heading" className="sr-only">
              Detailed Analysis
            </h2>

            <div className="space-y-12">
              {data.analysisSections.map((section) => (
                <article key={section.heading}>
                  <h3 className="text-display-sm text-foreground">
                    {section.heading}
                  </h3>
                  <div className="mt-4 space-y-4">
                    {section.paragraphs.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-body-md leading-relaxed text-muted-foreground"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Button variant="primary" size="lg" asChild>
                <Link href="/demo">
                  Schedule a Walkthrough
                  <ArrowRight className="size-[18px]" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </Container>
        </SectionContainer>

        {/* ================================================================
            SECTION 4: FAQ
            ================================================================ */}
        <SectionContainer
          id="faq"
          variant="card"
          ariaLabelledBy="faq-heading"
        >
          <Container>
            <div className="mb-10 text-center">
              <Eyebrow color="primary">FAQ</Eyebrow>
              <h2
                id="faq-heading"
                className="mt-4 text-display-md text-foreground"
              >
                Frequently Asked Questions
              </h2>
            </div>

            <FAQSection items={data.faqItems} />
          </Container>
        </SectionContainer>

        {/* ================================================================
            SECTION 5: CTA BAND
            ================================================================ */}
        <CTABand
          variant="dark"
          headline="Ready to go with a plan?"
          body="Schedule a walkthrough with our team to see how SafeTrekr delivers professional trip planning for your organization."
          primaryCta={{ text: "Schedule a Walkthrough", href: "/demo" }}
          secondaryCta={{ text: "View Pricing", href: "/pricing" }}
        />
      </main>
    </>
  );
}
