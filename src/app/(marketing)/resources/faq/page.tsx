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
 *   2. Getting Started     -- 5 questions
 *   3. Safety Binder       -- 5 questions
 *   4. Risk Intelligence   -- 5 questions
 *   5. For Schools (K-12)  -- 5 questions
 *   6. For Churches        -- 5 questions
 *   7. For Corporate       -- 5 questions
 *   8. Security & Privacy  -- 5 questions
 *   9. Billing & Support   -- 5 questions
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
    "Answers to common questions about SafeTrekr -- how it works, what the safety binder includes, risk intelligence sources, segment-specific compliance, security, and pricing. Everything you need to evaluate SafeTrekr for your organization.",
  path: "/resources/faq",
});

// ---------------------------------------------------------------------------
// FAQ Data -- 8 Categories
// ---------------------------------------------------------------------------

const GETTING_STARTED: FAQItem[] = [
  {
    question: "What is SafeTrekr?",
    answer:
      "SafeTrekr is a professional travel risk management platform that assigns a trained safety analyst to review every trip your organization sends. The analyst evaluates your destination across 17 dimensions of risk using real-time government intelligence from NOAA, USGS, CDC, ReliefWeb, and GDACS. The result is an audit-ready safety binder with documented findings, risk scores, emergency plans, and a tamper-evident audit trail -- the same standard of care that Fortune 500 companies use for business travel, now available to schools, churches, and organizations of any size.",
  },
  {
    question: "How do I sign up and submit my first trip?",
    answer:
      "Start by requesting a demo at safetrekr.com/demo or contacting our team. Once your organization account is created, your trip leader submits trip details through a guided 10-step wizard that takes 15-20 minutes. You enter destinations, dates, venues, team members, and transportation details. Our analyst handles the rest -- pulling intelligence data, reviewing every dimension, and delivering your safety binder within 3-5 business days.",
  },
  {
    question: "How much does SafeTrekr cost?",
    answer:
      "Pricing starts at $450 per domestic day trip and scales based on trip complexity: $750 for domestic overnight trips and $1,250 for international trips. That works out to roughly $15 per participant for a typical group. Organizations booking 5 or more trips per year qualify for volume discounts. Every trip includes a professional analyst review, government intelligence risk scoring, a complete safety binder, mobile app access for team leaders, and AM/PM safety briefings during the trip.",
  },
  {
    question: "Who is SafeTrekr designed for?",
    answer:
      "SafeTrekr serves any organization with a duty of care obligation for group travel. Our primary segments are K-12 schools and districts managing field trips, churches and mission organizations sending mission teams, higher education institutions coordinating study abroad programs, and corporate organizations managing business travel and team retreats. If your organization sends people somewhere and is responsible for their safety, SafeTrekr was built for you.",
  },
  {
    question: "How is SafeTrekr different from travel insurance?",
    answer:
      "Travel insurance pays claims after something goes wrong. SafeTrekr helps prevent incidents by identifying risks before your team departs and documenting the precautions you took. The safety binder SafeTrekr produces is the evidence your insurance carrier needs to process claims efficiently -- and the documentation that demonstrates your organization exercised reasonable care. Many organizations use SafeTrekr alongside travel insurance as complementary layers of protection.",
  },
];

const SAFETY_BINDER: FAQItem[] = [
  {
    question: "What is included in the safety binder?",
    answer:
      "The safety binder is a comprehensive 17-section document produced by your assigned safety analyst. It includes destination risk assessments with government intelligence data, venue and lodging safety verification, emergency medical facility locations and contact information, evacuation routes and contingency plans, transportation safety evaluations, communication infrastructure assessments, weather and environmental risk analysis, and a tamper-evident audit trail secured with SHA-256 hash chains. Every finding is cited with its data source and timestamp.",
  },
  {
    question: "How is the safety binder generated?",
    answer:
      "After your trip leader submits trip details through the guided wizard, a trained safety analyst begins the review. The analyst pulls real-time data from five government intelligence sources -- NOAA for weather, USGS for seismic activity, CDC for health advisories, ReliefWeb for humanitarian conditions, and GDACS for disaster alerts. They evaluate your specific itinerary across 17 risk dimensions, document findings, assign risk scores using Monte Carlo simulation, and compile everything into the final binder. Delivery takes 3-5 business days from submission.",
  },
  {
    question: "Can I customize the safety binder for our organization?",
    answer:
      "Yes. The 17-section framework is standardized to ensure comprehensive coverage, but your analyst can incorporate organization-specific requirements. If your school district has particular field trip policies, your denomination has safety guidelines, or your insurance carrier requires specific documentation, the analyst factors those into the review. Contact our team during onboarding to discuss any customization needs for your organization.",
  },
  {
    question: "Can board members and stakeholders access the binder?",
    answer:
      "Yes. You control access to the safety binder. It can be shared as a PDF with your school board, church board, insurance committee, denominational leadership, corporate risk management team, or anyone else who needs to review your safety preparation. The binder includes a verification hash that confirms the document has not been altered since the analyst completed the review.",
  },
  {
    question: "What happens if conditions change after we receive the binder?",
    answer:
      "Your safety analyst monitors conditions for active trips. During your trip, your team receives morning and evening safety briefings covering weather changes, transit advisories, local events, and overnight developments. If conditions change significantly before departure, the analyst can update your binder with current intelligence. The binder is a living document until your team returns home.",
  },
];

const RISK_INTELLIGENCE: FAQItem[] = [
  {
    question: "How does risk scoring work?",
    answer:
      "SafeTrekr uses Monte Carlo simulation to calculate risk scores across 17 dimensions. Rather than a single subjective rating, the system runs thousands of probabilistic scenarios using real data from government intelligence sources. The result is a probability distribution that shows not just whether a risk exists, but how likely specific scenarios are and how severe the impact could be. Risk scores are presented on a clear scale with color-coded severity levels so non-technical stakeholders can understand them immediately.",
  },
  {
    question: "What data sources does SafeTrekr use?",
    answer:
      "SafeTrekr pulls real-time data from five government and international intelligence sources: NOAA (National Oceanic and Atmospheric Administration) for weather patterns and severe weather forecasts, USGS (United States Geological Survey) for seismic activity and geological hazards, CDC (Centers for Disease Control and Prevention) for health advisories and disease outbreaks, ReliefWeb for humanitarian situation reports and field conditions, and GDACS (Global Disaster Alert and Coordination System) for natural disaster monitoring. These are the same sources humanitarian agencies and Fortune 500 companies use to assess field conditions.",
  },
  {
    question: "How frequently is risk data updated?",
    answer:
      "Intelligence data is pulled at the time of analyst review and refreshed for active trips. During a trip, your team receives morning and evening safety briefings with the latest conditions. If a significant change occurs -- a weather event, a security advisory, a health alert -- your analyst can issue an ad-hoc update. The data sources themselves update continuously: NOAA issues forecasts multiple times daily, GDACS monitors disasters in near-real-time, and CDC advisories are updated as conditions warrant.",
  },
  {
    question: "Does SafeTrekr cover domestic destinations?",
    answer:
      "Yes. Domestic destinations carry real risks that are often underestimated -- severe weather, seismic activity, flash flooding, wildfire proximity, and distance from emergency medical facilities. A domestic field trip to a national park or a mission trip to rural Appalachia deserves the same evidence-based risk assessment as an international trip. Our domestic trip review costs $450 and covers the same 17-section framework with location-appropriate intelligence data.",
  },
  {
    question:
      "How does SafeTrekr handle destinations with limited infrastructure?",
    answer:
      "Our analyst reviews specifically account for infrastructure gaps. When a destination has limited emergency medical facilities, unreliable communication networks, or poor road conditions, those factors are documented in the binder along with contingency plans. Intelligence data from ReliefWeb and GDACS is specifically designed for regions where standard travel advisories fall short. Many of the destinations our customers visit -- rural mission fields, remote research sites, developing regions -- are exactly the places that need the most thorough safety review.",
  },
];

const FOR_SCHOOLS: FAQItem[] = [
  {
    question: "Is SafeTrekr FERPA compliant?",
    answer:
      "Yes. SafeTrekr is designed to handle student information in compliance with FERPA (Family Educational Rights and Privacy Act). Student data collected during trip submission is encrypted at rest with AES-256 and in transit with TLS 1.3. Access controls ensure that only authorized school personnel and the assigned safety analyst can view student-related information. We do not share, sell, or use student data for any purpose other than trip safety review. Our data handling practices are documented and available for district review during procurement.",
  },
  {
    question: "What field trip documentation does SafeTrekr provide?",
    answer:
      "SafeTrekr produces a complete field trip safety binder covering all 17 review dimensions specific to your destination and itinerary. For K-12 schools, this includes venue safety assessments appropriate for the student age group, emergency medical facility locations with pediatric capabilities noted, transportation safety evaluations, chaperone ratio documentation, parent communication templates, and a tamper-evident audit trail. The binder satisfies documentation requirements that most school districts and insurance carriers expect for off-campus activities.",
  },
  {
    question:
      "How does SafeTrekr help with parent communication about field trips?",
    answer:
      "The safety binder provides documented evidence of professional risk assessment that school administrators can reference when communicating with parents. When a parent asks how the school evaluated the safety of a destination, you have a cited, analyst-reviewed document rather than anecdotal assurance. Some districts share a summary page from the binder with parents; others reference it in permission slip documentation. Your district controls how much detail to share.",
  },
  {
    question: "Can SafeTrekr handle district-wide field trip programs?",
    answer:
      "Yes. SafeTrekr supports multi-school, district-wide deployments with centralized administration and per-school trip submission. District safety coordinators get visibility across all trips, while individual school administrators manage their own submissions. Volume pricing is available for districts submitting 5 or more trips per year. Contact our team for a district-level quote that reflects your annual field trip calendar.",
  },
  {
    question:
      "What about recurring field trips to the same destination each year?",
    answer:
      "Each trip receives a fresh analyst review with current intelligence data -- conditions change year to year, and a review from last spring does not reflect this spring's weather patterns, construction, road closures, or facility changes. However, recurring trips benefit from analyst continuity: your analyst notes from prior reviews inform the current assessment, and the review process is faster when destination familiarity is established. This ensures your documentation is always current while leveraging institutional knowledge.",
  },
];

const FOR_CHURCHES: FAQItem[] = [
  {
    question: "How does SafeTrekr address duty of care for mission trips?",
    answer:
      "Duty of care requires your church to take reasonable steps to ensure the safety of people in your charge -- especially minors on youth mission trips. SafeTrekr provides documented evidence that your church conducted a professional risk assessment: government intelligence data on your destination, an analyst review of venues and transportation, emergency preparedness plans, and a tamper-evident audit trail. When your insurance carrier asks whether a formal risk assessment was conducted, the answer is documented, not anecdotal.",
  },
  {
    question: "Does SafeTrekr offer volunteer screening?",
    answer:
      "Yes. SafeTrekr offers background checks as an add-on service at $35 per person. These integrate into your trip preparation workflow so that volunteer screening and trip safety review happen through a single platform. Background check results are stored with the same AES-256 encryption and access controls as all SafeTrekr data. This is particularly valuable for churches that send volunteers across state lines, where screening requirements may differ from your home state.",
  },
  {
    question:
      "How does SafeTrekr handle international mission trip destinations?",
    answer:
      "International mission trips receive our most comprehensive review at $1,250 per trip. The analyst evaluates each destination independently -- safety conditions in Guatemala City differ from those in Antigua or a rural village. The review covers in-country transportation, host organization vetting, lodging safety, emergency medical facilities, evacuation routes, communication infrastructure, water and food safety, and more. The final binder consolidates all stops into a single comprehensive document with per-destination findings.",
  },
  {
    question: "Can SafeTrekr work alongside our denomination's safety guidelines?",
    answer:
      "Yes. SafeTrekr complements and strengthens denominational safety requirements. Most denominational guidelines provide a framework -- SafeTrekr provides the documented execution. Your safety binder demonstrates compliance with denominational policies through professional verification, not self-reported checklists. Several denominations are evaluating SafeTrekr as a recommended resource for their member churches.",
  },
  {
    question: "Is SafeTrekr appropriate for youth group trips?",
    answer:
      "Absolutely. Youth group trips carry heightened duty of care obligations because you are transporting minors. SafeTrekr's review includes factors specifically relevant to youth safety -- venue appropriateness, emergency medical proximity for pediatric care, communication reliability for parent updates, and documented supervision planning. The binder provides evidence that youth protection was professionally reviewed, not just assumed.",
  },
];

const FOR_CORPORATE: FAQItem[] = [
  {
    question: "What is travel risk management and why does it matter?",
    answer:
      "Travel risk management is the systematic process of identifying, assessing, and mitigating risks associated with business travel. For organizations, it is both a legal obligation (duty of care) and a practical necessity. Courts have held employers liable for foreseeable travel risks they failed to address. SafeTrekr provides the documented evidence that your organization identified risks, assessed their severity, and took reasonable precautions -- the standard of care courts evaluate when determining liability.",
  },
  {
    question: "What are duty of care obligations for corporate travel?",
    answer:
      "Duty of care requires organizations to take reasonable steps to protect employees during work-related travel. This includes assessing destination risks, providing relevant safety information, maintaining communication channels, and having emergency response plans. The standard is not perfection -- it is reasonableness. SafeTrekr documents that your organization performed a professional risk assessment, provided travelers with relevant safety information, and established emergency protocols. This documentation is your evidence of reasonable care.",
  },
  {
    question: "Does SafeTrekr provide reporting for corporate travel programs?",
    answer:
      "Yes. Organizations with multiple trips receive consolidated reporting that shows trip volume, destination risk distribution, common risk factors, and safety binder completion rates. This data helps corporate risk managers demonstrate program-level due diligence to leadership, insurance carriers, and auditors. Each individual trip also retains its own complete safety binder for trip-specific reference.",
  },
  {
    question: "Can SafeTrekr integrate with our existing travel booking tools?",
    answer:
      "SafeTrekr currently operates as a standalone platform with a guided trip submission wizard. Integration with major travel management companies (TMCs) and corporate booking tools is on our product roadmap. Today, many corporate clients submit trips to SafeTrekr as part of their pre-travel approval workflow -- trip details are entered once, and the safety binder is delivered within 3-5 business days alongside your existing booking confirmation.",
  },
  {
    question: "How does SafeTrekr handle multi-city business trips?",
    answer:
      "Multi-city trips are reviewed as a single engagement with per-destination analysis. Your analyst assesses each city independently because risk profiles vary significantly -- even within the same country. The final safety binder consolidates all destinations into one document with city-specific findings, risk scores, emergency contacts, and contingency plans. This is particularly valuable for conference travel, multi-office visits, and client-facing road trips.",
  },
];

const SECURITY_PRIVACY: FAQItem[] = [
  {
    question: "How does SafeTrekr handle my organization's data?",
    answer:
      "All data is encrypted at rest using AES-256 and in transit using TLS 1.3. Access is controlled through role-based permissions so that only authorized personnel within your organization and your assigned safety analyst can view trip-related information. We do not share, sell, or use your data for any purpose other than delivering your safety review. Data retention policies are configurable based on your organization's requirements.",
  },
  {
    question: "What encryption standards does SafeTrekr use?",
    answer:
      "SafeTrekr uses AES-256 encryption for data at rest -- the same standard used by financial institutions and government agencies. Data in transit is protected with TLS 1.3. Safety binder integrity is secured with SHA-256 hash chains that create a tamper-evident audit trail. If any document is modified after the analyst completes the review, the hash chain breaks, providing cryptographic proof of whether the document is the unmodified original.",
  },
  {
    question: "What compliance certifications does SafeTrekr hold?",
    answer:
      "SafeTrekr is pursuing SOC 2 Type II certification to validate our security controls (status: in progress). Our platform is designed to support FERPA compliance for K-12 student data, and our data handling practices align with GDPR principles for organizations operating internationally. We provide data processing agreements (DPAs) for organizations that require them. Contact our team for the latest certification status and compliance documentation.",
  },
  {
    question: "Can SafeTrekr sign a data processing agreement (DPA)?",
    answer:
      "Yes. We provide data processing agreements for organizations that require them -- particularly school districts, international organizations, and enterprises subject to GDPR or similar regulations. Our standard DPA covers data handling, retention, breach notification, and sub-processor management. Custom DPA terms can be discussed during procurement for organizations with specific legal requirements.",
  },
  {
    question: "How is personally identifiable information (PII) protected?",
    answer:
      "PII -- including team member names, contact information, and any health-related travel data -- is encrypted at rest and in transit with the standards described above. Access is restricted to authorized users within your organization and your assigned safety analyst. PII is never included in aggregate reporting or analytics. Our platform logs access events for audit purposes, and data retention periods are configurable so you can enforce your organization's data lifecycle policies.",
  },
];

const BILLING_SUPPORT: FAQItem[] = [
  {
    question: "What payment methods does SafeTrekr accept?",
    answer:
      "SafeTrekr accepts all major credit cards (Visa, Mastercard, American Express), ACH bank transfers, and purchase orders for organizations that require them. School districts and government entities can use standard procurement processes including PO-based billing with net-30 terms. Contact our team if your organization has specific payment requirements.",
  },
  {
    question: "Can I cancel a trip after submission?",
    answer:
      "Yes. If you cancel before the analyst begins the review (typically within 24 hours of submission), you receive a full refund. Once the analyst review has started, cancellation terms depend on how far the review has progressed. Contact our support team as soon as you know a trip is cancelled, and we will work with you on the fairest resolution. If a trip is postponed rather than cancelled, we can hold the review and update it with current intelligence when your new dates are confirmed.",
  },
  {
    question: "Does SafeTrekr offer volume pricing?",
    answer:
      "Yes. Organizations booking 5 or more trips per year qualify for volume discounts. The discount scales with volume -- larger programs receive larger discounts. This applies across trip types, so a school district with a mix of domestic day trips and overnight trips benefits from combined volume. Contact our team for a custom quote that reflects your annual trip schedule.",
  },
  {
    question: "What are SafeTrekr's support hours?",
    answer:
      "Our support team is available Monday through Friday, 8:00 AM to 6:00 PM Eastern Time. During active trips, emergency support is available 24/7 through the SafeTrekr mobile app. For pre-trip questions about safety binders, trip submission, or account management, you can reach us by email at support@safetrekr.com or through the in-app help center. Response time for standard inquiries is within one business day.",
  },
  {
    question: "How do I get started with a demo?",
    answer:
      "Visit safetrekr.com/demo to schedule a 30-minute demo with our team. During the demo, we will walk through the trip submission process, show you a sample safety binder, explain how risk scoring works, and answer any questions specific to your organization. There is no obligation and no credit card required. You can also download a sample binder at safetrekr.com/resources/sample-binders to see exactly what you will receive before scheduling a call.",
  },
];

// ---------------------------------------------------------------------------
// Collected FAQ items for page-level JSON-LD
// ---------------------------------------------------------------------------

const ALL_FAQ_ITEMS: FAQItem[] = [
  ...GETTING_STARTED,
  ...SAFETY_BINDER,
  ...RISK_INTELLIGENCE,
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
    id: "risk-intelligence",
    headingId: "risk-intelligence-heading",
    eyebrowLabel: "Risk Intelligence",
    eyebrowIcon: <Activity className="size-4" />,
    heading: "Risk Intelligence & Data Sources",
    items: RISK_INTELLIGENCE,
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
                  Answers to the most common questions about our platform,
                  safety binder, risk intelligence, segment-specific
                  compliance, security, and pricing.
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
                  SafeTrekr is a professional travel risk management platform
                  that assigns a trained safety analyst to review every trip
                  your organization sends. Using real-time government
                  intelligence from NOAA, USGS, CDC, ReliefWeb, and GDACS,
                  the analyst evaluates destinations across 17 dimensions of
                  risk and delivers an audit-ready safety binder with
                  documented findings, risk scores calculated via Monte Carlo
                  simulation, emergency plans, and a tamper-evident SHA-256
                  audit trail. SafeTrekr serves K-12 schools, churches and
                  mission organizations, higher education institutions, and
                  corporate travel programs. Pricing starts at $450 per
                  domestic day trip, $750 for domestic overnight, and $1,250
                  for international trips -- approximately $15 per participant.
                  The platform is FERPA-aware for student data, uses AES-256
                  encryption at rest and TLS 1.3 in transit, and is pursuing
                  SOC 2 Type II certification.
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
          headline="Ready to See SafeTrekr in Action?"
          body="Download a sample safety binder to see exactly what your organization receives, or schedule a 30-minute demo with our team."
          primaryCta={{ text: "Get a Demo", href: "/demo" }}
          secondaryCta={{
            text: "Download Sample Binder",
            href: "/resources/sample-binders/mission-trip",
          }}
        />
      </main>
    </>
  );
}
