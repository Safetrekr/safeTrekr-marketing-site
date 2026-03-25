/**
 * ST-844: REQ-104 -- Unit Tests for structured data (JSON-LD) generators
 *
 * Tests all schema generators output valid JSON-LD with @context and @type.
 * Covers: Organization, FAQ, HowTo, Breadcrumb, Article, SoftwareApplication, VideoObject.
 */

import { describe, it, expect } from "vitest";
import {
  generateOrganizationSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateSoftwareApplicationSchema,
  generateVideoObjectSchema,
} from "@/lib/structured-data";

// ---------------------------------------------------------------------------
// Shared assertions
// ---------------------------------------------------------------------------

function expectValidJsonLd(data: Record<string, unknown>, expectedType: string) {
  expect(data["@context"]).toBe("https://schema.org");
  expect(data["@type"]).toBe(expectedType);
  // Should be serializable to JSON without errors
  expect(() => JSON.stringify(data)).not.toThrow();
}

// ---------------------------------------------------------------------------
// Organization
// ---------------------------------------------------------------------------

describe("generateOrganizationSchema()", () => {
  it("returns valid JSON-LD with @context and @type Organization", () => {
    const result = generateOrganizationSchema();
    expectValidJsonLd(result, "Organization");
  });

  it("includes name as 'SafeTrekr'", () => {
    const result = generateOrganizationSchema();
    expect(result.name).toBe("SafeTrekr");
  });

  it("includes the site URL", () => {
    const result = generateOrganizationSchema();
    expect(result.url).toBe("https://safetrekr.com");
  });

  it("includes a logo URL", () => {
    const result = generateOrganizationSchema();
    expect(result.logo).toBe("https://safetrekr.com/images/safetrekr-logo.png");
  });

  it("includes a description", () => {
    const result = generateOrganizationSchema();
    expect(result.description).toBeTruthy();
    expect(typeof result.description).toBe("string");
  });

  it("includes a contactPoint with correct type", () => {
    const result = generateOrganizationSchema();
    const cp = result.contactPoint as Record<string, unknown>;
    expect(cp["@type"]).toBe("ContactPoint");
    expect(cp.contactType).toBe("customer service");
    expect(cp.url).toBe("https://safetrekr.com/contact");
  });
});

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

describe("generateFAQSchema()", () => {
  const items = [
    { question: "What is SafeTrekr?", answer: "A travel risk platform." },
    { question: "How much does it cost?", answer: "Starting at $450/mo." },
  ];

  it("returns valid JSON-LD with @type FAQPage", () => {
    const result = generateFAQSchema(items);
    expectValidJsonLd(result, "FAQPage");
  });

  it("creates a mainEntity entry for each FAQ item", () => {
    const result = generateFAQSchema(items);
    const entities = result.mainEntity as Array<Record<string, unknown>>;
    expect(entities).toHaveLength(2);
  });

  it("sets each entity to @type Question", () => {
    const result = generateFAQSchema(items);
    const entities = result.mainEntity as Array<Record<string, unknown>>;
    for (const entity of entities) {
      expect(entity["@type"]).toBe("Question");
    }
  });

  it("includes the question text as 'name'", () => {
    const result = generateFAQSchema(items);
    const entities = result.mainEntity as Array<Record<string, unknown>>;
    expect(entities[0]?.name).toBe("What is SafeTrekr?");
    expect(entities[1]?.name).toBe("How much does it cost?");
  });

  it("includes acceptedAnswer with @type Answer", () => {
    const result = generateFAQSchema(items);
    const entities = result.mainEntity as Array<Record<string, unknown>>;
    const answer = entities[0]?.acceptedAnswer as Record<string, unknown>;
    expect(answer["@type"]).toBe("Answer");
    expect(answer.text).toBe("A travel risk platform.");
  });

  it("handles an empty items array", () => {
    const result = generateFAQSchema([]);
    expectValidJsonLd(result, "FAQPage");
    const entities = result.mainEntity as Array<Record<string, unknown>>;
    expect(entities).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// HowTo
// ---------------------------------------------------------------------------

describe("generateHowToSchema()", () => {
  const steps = [
    { name: "Sign Up", text: "Create your account." },
    { name: "Configure", text: "Set up your organization." },
    { name: "Deploy", text: "Invite your team." },
  ];

  it("returns valid JSON-LD with @type HowTo", () => {
    const result = generateHowToSchema(steps);
    expectValidJsonLd(result, "HowTo");
  });

  it("includes the name 'How to use SafeTrekr'", () => {
    const result = generateHowToSchema(steps);
    expect(result.name).toBe("How to use SafeTrekr");
  });

  it("creates a step entry for each input step", () => {
    const result = generateHowToSchema(steps);
    const stepEntries = result.step as Array<Record<string, unknown>>;
    expect(stepEntries).toHaveLength(3);
  });

  it("assigns @type HowToStep to each step", () => {
    const result = generateHowToSchema(steps);
    const stepEntries = result.step as Array<Record<string, unknown>>;
    for (const step of stepEntries) {
      expect(step["@type"]).toBe("HowToStep");
    }
  });

  it("assigns 1-based position to each step", () => {
    const result = generateHowToSchema(steps);
    const stepEntries = result.step as Array<Record<string, unknown>>;
    expect(stepEntries[0]?.position).toBe(1);
    expect(stepEntries[1]?.position).toBe(2);
    expect(stepEntries[2]?.position).toBe(3);
  });

  it("includes step name and text", () => {
    const result = generateHowToSchema(steps);
    const stepEntries = result.step as Array<Record<string, unknown>>;
    expect(stepEntries[0]?.name).toBe("Sign Up");
    expect(stepEntries[0]?.text).toBe("Create your account.");
  });
});

// ---------------------------------------------------------------------------
// Breadcrumb
// ---------------------------------------------------------------------------

describe("generateBreadcrumbSchema()", () => {
  const items = [
    { name: "Home", url: "https://safetrekr.com" },
    { name: "Pricing", url: "https://safetrekr.com/pricing" },
  ];

  it("returns valid JSON-LD with @type BreadcrumbList", () => {
    const result = generateBreadcrumbSchema(items);
    expectValidJsonLd(result, "BreadcrumbList");
  });

  it("creates ListItem entries for each breadcrumb", () => {
    const result = generateBreadcrumbSchema(items);
    const elements = result.itemListElement as Array<Record<string, unknown>>;
    expect(elements).toHaveLength(2);
  });

  it("assigns @type ListItem to each element", () => {
    const result = generateBreadcrumbSchema(items);
    const elements = result.itemListElement as Array<Record<string, unknown>>;
    for (const el of elements) {
      expect(el["@type"]).toBe("ListItem");
    }
  });

  it("assigns 1-based positions", () => {
    const result = generateBreadcrumbSchema(items);
    const elements = result.itemListElement as Array<Record<string, unknown>>;
    expect(elements[0]?.position).toBe(1);
    expect(elements[1]?.position).toBe(2);
  });

  it("includes name and item (URL) for each breadcrumb", () => {
    const result = generateBreadcrumbSchema(items);
    const elements = result.itemListElement as Array<Record<string, unknown>>;
    expect(elements[0]?.name).toBe("Home");
    expect(elements[0]?.item).toBe("https://safetrekr.com");
  });
});

// ---------------------------------------------------------------------------
// Article
// ---------------------------------------------------------------------------

describe("generateArticleSchema()", () => {
  const input = {
    headline: "Do Liability Waivers Actually Protect Schools?",
    description: "A look at what courts have ruled.",
    datePublished: "2026-03-20",
    authorName: "Sarah Chen",
    authorTitle: "Safety Analyst",
    path: "/blog/school-field-trip-liability-waivers",
    section: "K-12 Compliance",
    wordCount: 2400,
  };

  it("returns valid JSON-LD with @type Article", () => {
    const result = generateArticleSchema(input);
    expectValidJsonLd(result, "Article");
  });

  it("includes the headline", () => {
    const result = generateArticleSchema(input);
    expect(result.headline).toBe(
      "Do Liability Waivers Actually Protect Schools?",
    );
  });

  it("includes the description", () => {
    const result = generateArticleSchema(input);
    expect(result.description).toBe("A look at what courts have ruled.");
  });

  it("includes datePublished and dateModified", () => {
    const result = generateArticleSchema(input);
    expect(result.datePublished).toBe("2026-03-20");
    expect(result.dateModified).toBe("2026-03-20");
  });

  it("uses explicit dateModified when provided", () => {
    const result = generateArticleSchema({
      ...input,
      dateModified: "2026-03-22",
    });
    expect(result.dateModified).toBe("2026-03-22");
  });

  it("includes author with @type Person", () => {
    const result = generateArticleSchema(input);
    const author = result.author as Record<string, unknown>;
    expect(author["@type"]).toBe("Person");
    expect(author.name).toBe("Sarah Chen");
    expect(author.jobTitle).toBe("Safety Analyst");
  });

  it("omits jobTitle when authorTitle is not provided", () => {
    const result = generateArticleSchema({
      ...input,
      authorTitle: undefined,
    });
    const author = result.author as Record<string, unknown>;
    expect(author.jobTitle).toBeUndefined();
  });

  it("includes publisher with @type Organization", () => {
    const result = generateArticleSchema(input);
    const publisher = result.publisher as Record<string, unknown>;
    expect(publisher["@type"]).toBe("Organization");
    expect(publisher.name).toBe("SafeTrekr");
  });

  it("includes mainEntityOfPage with the correct URL", () => {
    const result = generateArticleSchema(input);
    const main = result.mainEntityOfPage as Record<string, unknown>;
    expect(main["@type"]).toBe("WebPage");
    expect(main["@id"]).toBe(
      "https://safetrekr.com/blog/school-field-trip-liability-waivers",
    );
  });

  it("includes wordCount when provided", () => {
    const result = generateArticleSchema(input);
    expect(result.wordCount).toBe(2400);
  });

  it("omits wordCount when not provided", () => {
    const result = generateArticleSchema({
      ...input,
      wordCount: undefined,
    });
    expect(result.wordCount).toBeUndefined();
  });

  it("includes articleSection when provided", () => {
    const result = generateArticleSchema(input);
    expect(result.articleSection).toBe("K-12 Compliance");
  });

  it("omits articleSection when not provided", () => {
    const result = generateArticleSchema({
      ...input,
      section: undefined,
    });
    expect(result.articleSection).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// SoftwareApplication
// ---------------------------------------------------------------------------

describe("generateSoftwareApplicationSchema()", () => {
  it("returns valid JSON-LD with @type SoftwareApplication", () => {
    const result = generateSoftwareApplicationSchema();
    expectValidJsonLd(result, "SoftwareApplication");
  });

  it("includes name as 'SafeTrekr'", () => {
    const result = generateSoftwareApplicationSchema();
    expect(result.name).toBe("SafeTrekr");
  });

  it("sets applicationCategory to 'BusinessApplication'", () => {
    const result = generateSoftwareApplicationSchema();
    expect(result.applicationCategory).toBe("BusinessApplication");
  });

  it("sets operatingSystem to 'Web'", () => {
    const result = generateSoftwareApplicationSchema();
    expect(result.operatingSystem).toBe("Web");
  });

  it("includes an AggregateOffer with pricing info", () => {
    const result = generateSoftwareApplicationSchema();
    const offers = result.offers as Record<string, unknown>;
    expect(offers["@type"]).toBe("AggregateOffer");
    expect(offers.priceCurrency).toBe("USD");
    expect(offers.lowPrice).toBe("450");
    expect(offers.highPrice).toBe("1250");
    expect(offers.offerCount).toBe("3");
  });
});

// ---------------------------------------------------------------------------
// VideoObject
// ---------------------------------------------------------------------------

describe("generateVideoObjectSchema()", () => {
  const options = {
    name: "SafeTrekr Platform Overview",
    description: "See how SafeTrekr delivers real-time travel risk intelligence.",
    thumbnailUrl: "https://safetrekr.com/images/video-thumb-overview.jpg",
    uploadDate: "2026-03-15",
    duration: "PT2M45S",
    contentUrl: "https://safetrekr.com/videos/platform-overview.mp4",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  };

  it("returns valid JSON-LD with @type VideoObject", () => {
    const result = generateVideoObjectSchema(options);
    expectValidJsonLd(result, "VideoObject");
  });

  it("includes the video name", () => {
    const result = generateVideoObjectSchema(options);
    expect(result.name).toBe("SafeTrekr Platform Overview");
  });

  it("includes the description", () => {
    const result = generateVideoObjectSchema(options);
    expect(result.description).toBe(
      "See how SafeTrekr delivers real-time travel risk intelligence.",
    );
  });

  it("includes the thumbnailUrl", () => {
    const result = generateVideoObjectSchema(options);
    expect(result.thumbnailUrl).toBe(
      "https://safetrekr.com/images/video-thumb-overview.jpg",
    );
  });

  it("includes the uploadDate", () => {
    const result = generateVideoObjectSchema(options);
    expect(result.uploadDate).toBe("2026-03-15");
  });

  it("includes the duration in ISO 8601 format", () => {
    const result = generateVideoObjectSchema(options);
    expect(result.duration).toBe("PT2M45S");
  });

  it("includes the contentUrl", () => {
    const result = generateVideoObjectSchema(options);
    expect(result.contentUrl).toBe(
      "https://safetrekr.com/videos/platform-overview.mp4",
    );
  });

  it("includes embedUrl when provided", () => {
    const result = generateVideoObjectSchema(options);
    expect(result.embedUrl).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
    );
  });

  it("omits embedUrl when not provided", () => {
    const result = generateVideoObjectSchema({
      ...options,
      embedUrl: undefined,
    });
    expect(result.embedUrl).toBeUndefined();
  });

  it("includes publisher with @type Organization", () => {
    const result = generateVideoObjectSchema(options);
    const publisher = result.publisher as Record<string, unknown>;
    expect(publisher["@type"]).toBe("Organization");
    expect(publisher.name).toBe("SafeTrekr");
    expect(publisher.url).toBe("https://safetrekr.com");
  });

  it("includes publisher logo with @type ImageObject", () => {
    const result = generateVideoObjectSchema(options);
    const publisher = result.publisher as Record<string, unknown>;
    const logo = publisher.logo as Record<string, unknown>;
    expect(logo["@type"]).toBe("ImageObject");
    expect(logo.url).toBe("https://safetrekr.com/images/safetrekr-logo.png");
  });
});
