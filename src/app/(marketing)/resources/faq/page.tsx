/**
 * ST-891: FAQ Hub Page (/resources/faq)
 *
 * Comprehensive FAQ hub combining cross-segment questions into a single,
 * categorized reference page. Eight accordion sections cover the full breadth
 * of SafeTrekr -- from getting started through billing -- so prospects,
 * customers, and AI crawlers can find answers without navigating segment pages.
 *
 * Server Component composing FAQSection (which carries its own "use client"
 * boundary via the Radix Accordion) and layout primitives from Waves 0-3.
 *
 * Section order:
 *   1. Hero / AI Summary  -- Breadcrumb, headline, AI-optimized summary
 *   2. Getting Started     -- 6 questions
 *   3. Safety Binder       -- 5 questions
 *   4. Safety Information  -- 5 questions
 *   5. For Schools (K-12)  -- 4 questions
 *   6. For Churches        -- 3 questions
 *   7. For Corporate       -- 4 questions
 *   8. Security & Privacy  -- 5 questions
 *   9. Billing & Support   -- 4 questions
 *  10. CTA Band            -- Conversion band
 *
 * A single FAQPage JSON-LD schema at the page level collects every question
 * across all categories for maximum rich-result coverage. Individual
 * FAQSection instances render with generateSchema={false} to avoid duplicate
 * structured data.
 *
 * @see src/components/marketing/faq-section.tsx
 */

import Link from "next/link";
import {
  HelpCircle,
  BookOpen,
  FileText,
  Activity,
  GraduationCap,
  Heart,
  Building2,
  Shield,
  CreditCard,
} from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import {
  JsonLd,
  generateFAQSchema,
  type FAQItem,
} from "@/lib/structured-data";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { SectionContainer } from "@/components/layout/section-container";
import { Container } from "@/components/layout/container";
import { Eyebrow, FAQSection, CTABand } from "@/components/marketing";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "Frequently Asked Questions",
  description:
    "SafeTrekr FAQ: how trip safety binders work, pricing from $450, analyst review process, school and church trip planning, data security, and cancellation policy.",
  path: "/resources/faq",
});

// ---------------------------------------------------------------------------
// FAQ Data -- 8 Categories
// ---------------------------------------------------------------------------

const GETTING_STARTED: FAQItem[] = [
  {
    question: "What is SafeTrekr?",
    answer:
      "SafeTrekr is a professional travel preparation platform that assigns a trained safety analyst to review every trip your organization sends. Analysts evaluate destinations using government and international data covering weather, seismic activity, health advisories, real-time disaster alerts, and regional humanitarian conditions, then deliver an audit-ready safety binder with documented findings, assessments, and emergency plans. SafeTrekr serves K-12 schools, churches and mission organizations, higher education institutions, and corporate travel programs. Pricing starts at $450 per domestic day trip.",
  },
  {
    question: "How do I get started with SafeTrekr?",
    answer:
      "After creating your account, you'll access a guided submission form that collects destination, dates, participants, activities, and logistics. No training or special knowledge required, just the details of your planned trip.",
  },
  {
    question: "How long does it take to receive a safety binder?",
    answer:
      "Extended Trip and International tiers receive priority analyst assignment. Expedited 48-hour delivery is available as an add-on.",
  },
  {
    question: "Is there a minimum commitment or contract?",
    answer:
      "No. You can submit a single trip with no ongoing commitment or annual contract required.",
  },
  {
    question: "What if I need to change my trip details after submitting?",
    answer:
      "Minor changes to dates or logistics can be accommodated. Just contact your analyst. Significant changes like a new destination or different venues may require a new submission.",
  },
  {
    question: "Can I see a sample safety binder before purchasing?",
    answer:
      "Yes. Schedule a walkthrough and we'll show you a complete safety binder for your organization type. You can also view sample binders from our resources page.",
  },
];

const SAFETY_BINDER: FAQItem[] = [
  {
    question: "What's included in a safety binder?",
    answer:
      "Every safety binder includes: executive summary, complete analyst findings, structured assessment, emergency contact directory, maps and evacuation routes, analyst recommendations, data source citations, and integrity verification.",
  },
  {
    question: "How do I share the safety binder with stakeholders?",
    answer:
      "Safety binders can be exported as PDF for offline sharing. You can also generate shareable links with configurable access permissions. Share with board members, insurance carriers, parents, or anyone who needs to review your preparation.",
  },
  {
    question: "What does 'verified documentation' mean?",
    answer:
      "Every finding in your safety binder is recorded with integrity verification. This demonstrates that the document has not been altered after completion. Professional documentation that stakeholders can trust.",
  },
  {
    question: "Can I use the safety binder for insurance purposes?",
    answer:
      "Yes. The safety binder documents that professional assessment was conducted, which is exactly what insurance carriers appreciate seeing. Many organizations share binders with their insurance carrier as evidence of preparation.",
  },
  {
    question: "How long do I have access to my safety binder?",
    answer:
      "Access duration depends on your tier: Day Trip (30 days post-trip), Extended Trip (60 days), International (90 days). Binders can be downloaded as PDF for permanent records.",
  },
];

const SAFETY_INFORMATION: FAQItem[] = [
  {
    question: "What data sources does SafeTrekr use for trip safety?",
    answer:
      "We gather information from five government and international sources covering weather and environmental conditions, seismic and geological monitoring, health advisories and disease outbreaks, real-time disaster alerts, and regional humanitarian conditions. These are the same types of sources used by international aid organizations and professional security teams to make field decisions.",
  },
  {
    question: "How does SafeTrekr assess trip safety risks?",
    answer:
      "Your analyst reviews each destination across 17 categories including weather, seismic activity, health advisories, regional stability, medical facility proximity, and more. Rather than a pass/fail score, you receive contextualized findings: what the data says, what it means for your specific trip, and what actions to consider.",
  },
  {
    question: "How current is the safety information?",
    answer:
      "Information is gathered at the time of analyst review and reflects current conditions. For active trips with monitoring, briefings are provided as conditions evolve.",
  },
  {
    question: "Can I request an assessment for a destination before booking travel?",
    answer:
      "The safety binder is designed for planned trips with specific dates and logistics. For pre-planning destination research, contact us to discuss options.",
  },
  {
    question: "What happens if an emergency occurs during my trip?",
    answer:
      "For Extended Trip and International tiers with active monitoring, your analyst provides updated briefings as conditions change. Every safety binder includes emergency contact directories, medical facility locations, and evacuation routes. The SafeTrekr mobile app gives chaperones and trip leaders offline access to this critical information in the field.",
  },
];

const FOR_SCHOOLS: FAQItem[] = [
  {
    question: "Does SafeTrekr protect student data and support FERPA compliance?",
    answer:
      "Yes. SafeTrekr is built with student data protection in mind and supports FERPA compliance requirements. We use role-based access controls, AES-256 encryption at rest, TLS encryption in transit, data minimization practices, and do not sell or share student data. Schools can request a security overview document for district procurement.",
  },
  {
    question: "Can multiple schools in our district use SafeTrekr?",
    answer:
      "Yes. SafeTrekr supports district-wide use with centralized administration. District administrators can view all trips across schools, establish consistent processes, and access documentation.",
  },
  {
    question: "How do chaperones access trip information during travel?",
    answer:
      "Chaperones download the SafeTrekr mobile app and receive a trip code. The app provides offline access to emergency contacts, rally points, medical facilities, and check-in tools.",
  },
  {
    question: "What if a parent asks to see the safety binder?",
    answer:
      "Safety binders are designed to be shared. Many schools proactively share binders with parents to demonstrate preparation and build confidence.",
  },
];

const FOR_CHURCHES: FAQItem[] = [
  {
    question: "How does SafeTrekr help with mission trip preparation?",
    answer:
      "SafeTrekr provides professional assessment for international missions, including embassy contacts, medical facility locations, regional conditions, and emergency planning. Safety binders document that professional preparation was completed, which is valuable for insurance carriers and denominational requirements.",
  },
  {
    question: "Do you work with mission organizations and partners abroad?",
    answer:
      "We assess the overall destination and can incorporate information about established mission partners you're working with. Partner context is included in International tier reviews.",
  },
  {
    question: "Is SafeTrekr affordable for small churches?",
    answer:
      "Yes. At $450 for a day trip, $750 for an extended domestic trip, and $1,250 for international missions, SafeTrekr is accessible for churches of any size. For a 30-person mission team, that works out to roughly $15-42 per person.",
  },
];

const FOR_CORPORATE: FAQItem[] = [
  {
    question: "What is 'duty of care' for employee travel?",
    answer:
      "Duty of care is the responsibility employers have to take reasonable steps to prepare for employee safety during work activities, including business travel. SafeTrekr provides documented evidence that your company conducted professional assessment, demonstrating responsible preparation.",
  },
  {
    question: "We're a mid-market company without a travel risk team. Is SafeTrekr right for us?",
    answer:
      "Absolutely, that's exactly who SafeTrekr is built for. Larger corporations have dedicated travel risk teams. SafeTrekr brings the same professional approach to mid-market companies without dedicated risk staff.",
  },
  {
    question: "Can SafeTrekr work with our travel booking system?",
    answer:
      "SafeTrekr operates alongside your existing travel workflow. Trip details can be submitted manually or via CSV upload. We are building direct integrations with major travel management companies. Contact us to discuss your specific tools.",
  },
  {
    question: "Do you offer volume or annual pricing for organizations?",
    answer:
      "Yes. Organizations that submit multiple trips per year can discuss volume arrangements. Contact sales@safetrekr.com to learn about options for your travel program.",
  },
];

const SECURITY_PRIVACY: FAQItem[] = [
  {
    question: "How is my data protected?",
    answer:
      "All data is encrypted at rest and in transit. Role-based access controls limit data visibility. We maintain access logs and conduct regular security assessments.",
  },
  {
    question: "Do you sell or share my data?",
    answer:
      "No. We do not sell, share, or use your data for advertising. Data is used only for providing trip planning services.",
  },
  {
    question: "What security practices does SafeTrekr follow?",
    answer:
      "SafeTrekr uses AES-256 encryption at rest, TLS 1.2+ in transit, role-based access controls, and maintains audit logs for all data access. We can provide a security overview document during procurement conversations.",
  },
  {
    question: "Who are the SafeTrekr safety analysts and what are their qualifications?",
    answer:
      "Every safety binder is reviewed by a credentialed analyst with expertise in travel risk assessment, regulatory compliance, and emergency planning. Our leadership team includes multiple former senior U.S. Secret Service agents who spent years planning and executing protective operations. The analyst team has reviewed trips across 47 countries for 12 organization types.",
  },
  {
    question: "How long do you retain my data?",
    answer:
      "Active trip data is retained for the trip duration plus your post-trip access period. Completed safety binders are retained per your organization's requirements. Organizations can discuss custom retention periods.",
  },
];

const BILLING_SUPPORT: FAQItem[] = [
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept credit cards for individual trips. Organizations can also pay by invoice upon request.",
  },
  {
    question: "What if I need to cancel a trip?",
    answer:
      "If you cancel before analyst review begins, you receive a full refund. If review has started, we'll provide a credit for a future trip.",
  },
  {
    question: "How do I get help with my account or active trips?",
    answer:
      "Email support@safetrekr.com for assistance with your account or active trips. For sales questions, contact sales@safetrekr.com.",
  },
  {
    question: "Is there a phone number for support?",
    answer:
      "Primary support is via email for documentation and tracking purposes. Phone support is available for organizations with support agreements.",
  },
];

// ---------------------------------------------------------------------------
// Collected FAQ items for page-level JSON-LD
// ---------------------------------------------------------------------------

const ALL_FAQ_ITEMS: FAQItem[] = [
  ...GETTING_STARTED,
  ...SAFETY_BINDER,
  ...SAFETY_INFORMATION,
  ...FOR_SCHOOLS,
  ...FOR_CHURCHES,
  ...FOR_CORPORATE,
  ...SECURITY_PRIVACY,
  ...BILLING_SUPPORT,
];

// ---------------------------------------------------------------------------
// Category configuration for rendering
// ---------------------------------------------------------------------------

interface FAQCategory {
  id: string;
  headingId: string;
  eyebrowLabel: string;
  eyebrowIcon: React.ReactNode;
  heading: string;
  items: FAQItem[];
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: "getting-started",
    headingId: "getting-started-heading",
    eyebrowLabel: "Getting Started",
    eyebrowIcon: <BookOpen className="size-4" />,
    heading: "Getting Started with SafeTrekr",
    items: GETTING_STARTED,
  },
  {
    id: "safety-binder",
    headingId: "safety-binder-heading",
    eyebrowLabel: "Safety Binder",
    eyebrowIcon: <FileText className="size-4" />,
    heading: "The Safety Binder",
    items: SAFETY_BINDER,
  },
  {
    id: "safety-information",
    headingId: "safety-information-heading",
    eyebrowLabel: "Safety Information",
    eyebrowIcon: <Activity className="size-4" />,
    heading: "Safety Information",
    items: SAFETY_INFORMATION,
  },
  {
    id: "schools",
    headingId: "schools-heading",
    eyebrowLabel: "For Schools (K-12)",
    eyebrowIcon: <GraduationCap className="size-4" />,
    heading: "For Schools & Districts",
    items: FOR_SCHOOLS,
  },
  {
    id: "churches",
    headingId: "churches-heading",
    eyebrowLabel: "For Churches & Missions",
    eyebrowIcon: <Heart className="size-4" />,
    heading: "For Churches & Mission Organizations",
    items: FOR_CHURCHES,
  },
  {
    id: "corporate",
    headingId: "corporate-heading",
    eyebrowLabel: "For Corporate Travel",
    eyebrowIcon: <Building2 className="size-4" />,
    heading: "For Corporate & Business Travel",
    items: FOR_CORPORATE,
  },
  {
    id: "security",
    headingId: "security-heading",
    eyebrowLabel: "Security & Privacy",
    eyebrowIcon: <Shield className="size-4" />,
    heading: "Security, Privacy & Compliance",
    items: SECURITY_PRIVACY,
  },
  {
    id: "billing",
    headingId: "billing-heading",
    eyebrowLabel: "Billing & Support",
    eyebrowIcon: <CreditCard className="size-4" />,
    heading: "Billing, Payments & Support",
    items: BILLING_SUPPORT,
  },
];

// ===========================================================================
// Page Component
// ===========================================================================

export default function FAQHubPage() {
  return (
    <>
      {/* Structured Data */}
      <BreadcrumbJsonLd
        path="/resources/faq"
        currentPageTitle="Frequently Asked Questions"
      />
      <JsonLd data={generateFAQSchema(ALL_FAQ_ITEMS)} />

      <main>
        {/* ================================================================
            SECTION 1: HERO + AI SUMMARY
            ================================================================ */}
        <SectionContainer id="hero" ariaLabelledBy="faq-page-heading">
          <Container size="md">
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
                  <span className="text-muted-foreground">
                    Resources
                  </span>
                </li>
                <li aria-hidden="true" className="select-none">
                  /
                </li>
                <li
                  aria-current="page"
                  className="font-medium text-foreground"
                >
                  FAQ
                </li>
              </ol>
            </nav>

            <ScrollReveal variant="fadeUp">
              <div className="text-center">
                <Eyebrow
                  color="primary"
                  icon={<HelpCircle className="size-4" />}
                  className="justify-center"
                >
                  Frequently Asked Questions
                </Eyebrow>

                <h1
                  id="faq-page-heading"
                  className="mx-auto mt-5 max-w-[28ch] text-display-xl text-foreground"
                >
                  Everything You Need to Know About SafeTrekr
                </h1>

                <p className="mx-auto mt-6 max-w-[60ch] text-body-lg text-muted-foreground">
                  Find answers to common questions about SafeTrekr, our trip
                  planning process, and how we help organizations prepare for
                  travel.
                </p>
              </div>
            </ScrollReveal>

            {/* AI Summary Block */}
            <ScrollReveal variant="fadeUp" delay={0.1}>
              <div className="mx-auto mt-12 max-w-3xl rounded-xl border border-border bg-card p-6 sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  About SafeTrekr
                </p>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  SafeTrekr is a professional travel preparation platform
                  founded by former senior U.S. Secret Service agents. A
                  trained safety analyst reviews every trip your organization
                  sends using government and international data covering
                  weather, seismic activity, health advisories, real-time
                  disaster alerts, and regional humanitarian conditions. The
                  analyst evaluates destinations across 17 categories and
                  delivers an audit-ready safety binder with documented
                  findings, assessments, and emergency plans. SafeTrekr
                  serves K-12 schools, churches and mission organizations,
                  higher education institutions, and corporate travel
                  programs. Pricing starts at $450 per domestic day trip,
                  $750 for extended domestic trips, and $1,250 for
                  international trips. The platform supports FERPA compliance
                  requirements and uses AES-256 encryption and role-based
                  access controls.
                </p>
              </div>
            </ScrollReveal>

            {/* Jump Links */}
            <ScrollReveal variant="fadeUp" delay={0.15}>
              <nav
                aria-label="FAQ categories"
                className="mx-auto mt-10 max-w-3xl"
              >
                <p className="mb-4 text-center text-sm font-semibold text-muted-foreground">
                  Jump to a category
                </p>
                <ul className="flex flex-wrap justify-center gap-2">
                  {FAQ_CATEGORIES.map((category) => (
                    <li key={category.id}>
                      <a
                        href={`#${category.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary-300 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                      >
                        {category.eyebrowLabel}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </ScrollReveal>
          </Container>
        </SectionContainer>

        {/* ================================================================
            SECTIONS 2-9: FAQ CATEGORIES
            ================================================================ */}
        {FAQ_CATEGORIES.map((category, index) => (
          <SectionContainer
            key={category.id}
            id={category.id}
            variant={index % 2 === 1 ? "card" : "default"}
            ariaLabelledBy={category.headingId}
          >
            <Container size="md">
              <ScrollReveal variant="fadeUp">
                <div className="mb-10 text-center">
                  <Eyebrow
                    color="primary"
                    icon={category.eyebrowIcon}
                    className="justify-center"
                  >
                    {category.eyebrowLabel}
                  </Eyebrow>
                  <h2
                    id={category.headingId}
                    className="mx-auto mt-4 max-w-[28ch] text-display-sm text-foreground"
                  >
                    {category.heading}
                  </h2>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fadeUp" delay={0.1}>
                <FAQSection
                  items={category.items}
                  generateSchema={false}
                />
              </ScrollReveal>
            </Container>
          </SectionContainer>
        ))}

        {/* ================================================================
            SECTION 10: CTA BAND
            ================================================================ */}
        <CTABand
          variant="dark"
          headline="Still have questions?"
          body="Contact our team or schedule a walkthrough to learn more about how SafeTrekr works for your organization."
          primaryCta={{ text: "Contact Us", href: "/contact" }}
          secondaryCta={{
            text: "Schedule a Walkthrough",
            href: "/demo",
          }}
        />
      </main>
    </>
  );
}
