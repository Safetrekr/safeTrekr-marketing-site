import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  JsonLd,
  generateFAQSchema,
  type FAQItem,
} from "@/lib/structured-data";
import { cn } from "@/lib/utils";

/* ================================================================
   FAQSection -- Expandable Question & Answer List
   Ticket: ST-845 / REQ-050
   Usage: Pricing page, product pages, support/resources FAQ page
   ================================================================ */

export interface FAQSectionProps {
  /** Array of question/answer pairs to display. */
  items: FAQItem[];
  /** Additional CSS classes applied to the outer container. */
  className?: string;
  /**
   * When true, renders a `<script type="application/ld+json">` tag with
   * schema.org FAQPage structured data for search-engine rich results.
   *
   * @default true
   */
  generateSchema?: boolean;
}

/**
 * Marketing FAQ section built on the shadcn/ui Accordion (Radix).
 *
 * Renders a single-select, collapsible accordion with one item per
 * question/answer pair. Keyboard navigation, focus management, and
 * `aria-expanded` are handled by Radix out of the box.
 *
 * When `generateSchema` is true (the default), a companion `<JsonLd>`
 * tag is rendered so Google can surface the FAQ as a rich result.
 *
 * This is a Server Component -- the Accordion itself carries the
 * `"use client"` boundary, so no directive is needed here.
 *
 * @example
 * ```tsx
 * import { FAQSection } from "@/components/marketing";
 *
 * const faqs = [
 *   { question: "What is SafeTrekr?", answer: "A travel risk management platform..." },
 *   { question: "How does pricing work?", answer: "We offer three tiers..." },
 * ];
 *
 * export default function PricingPage() {
 *   return <FAQSection items={faqs} />;
 * }
 * ```
 */
function FAQSection({
  items,
  className,
  generateSchema = true,
}: FAQSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className={cn("mx-auto max-w-3xl", className)}
      aria-label="Frequently asked questions"
    >
      {generateSchema && <JsonLd data={generateFAQSchema(items)} />}

      <Accordion type="single" collapsible className="w-full">
        {items.map((item, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger className="text-base font-semibold">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
FAQSection.displayName = "FAQSection";

export { FAQSection };
