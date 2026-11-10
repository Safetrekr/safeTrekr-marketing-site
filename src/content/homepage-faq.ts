/**
 * Homepage FAQ content.
 *
 * A curated, high-intent subset of the full FAQ (src/app/(marketing)/resources/
 * faq/page.tsx). Shown as a visible accordion on the homepage AND emitted as
 * schema.org FAQPage JSON-LD (via <FAQSection>) so answer engines (Google AI
 * Overviews, ChatGPT, Perplexity) can extract and cite direct answers.
 *
 * Answers are self-contained and lead with a direct response -- the format AI
 * answer engines favor. Keep these in sync with the canonical FAQ page; this is
 * intentionally a shorter buyer-facing cut, not a second source of truth.
 */

import type { FAQItem } from "@/lib/structured-data";

export const HOMEPAGE_FAQ: FAQItem[] = [
  {
    question: "What is SafeTrekr?",
    answer:
      "SafeTrekr is a professional travel preparation platform that assigns a trained safety analyst to review every trip your organization sends. Analysts evaluate destinations using government and international data covering weather, seismic activity, health advisories, real-time disaster alerts, and regional humanitarian conditions, then deliver an audit-ready safety binder with documented findings, assessments, and emergency plans. SafeTrekr serves K-12 schools, churches and mission organizations, higher education institutions, and corporate travel programs. Pricing starts at $400 per day trip for up to 10 travelers.",
  },
  {
    question: "How does SafeTrekr assess trip safety risks?",
    answer:
      "Your analyst reviews each destination across 17 categories including weather, seismic activity, health advisories, regional stability, medical facility proximity, and more. Rather than a pass/fail score, you receive contextualized findings: what the data says, what it means for your specific trip, and what actions to consider.",
  },
  {
    question: "What data sources does SafeTrekr use for trip safety?",
    answer:
      "We gather information from five government and international sources covering weather and environmental conditions, seismic and geological monitoring, health advisories and disease outbreaks, real-time disaster alerts, and regional humanitarian conditions. These are the same types of sources used by international aid organizations and professional security teams to make field decisions.",
  },
  {
    question: "What's included in a safety binder?",
    answer:
      "Every safety binder includes: executive summary, complete analyst findings, structured assessment, emergency contact directory, maps and evacuation routes, analyst recommendations, data source citations, and integrity verification.",
  },
  {
    question: "How long does it take to receive a safety binder?",
    answer:
      "Multi-Day Trip and International tiers receive priority analyst assignment. Expedited 48-hour delivery is available as an add-on.",
  },
  {
    question: "Is there a minimum commitment or contract?",
    answer:
      "No. You can submit a single trip with no ongoing commitment or annual contract required.",
  },
];
