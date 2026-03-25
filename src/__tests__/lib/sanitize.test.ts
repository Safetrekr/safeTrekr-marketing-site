/**
 * ST-844: REQ-104 -- Unit Tests for sanitizeInput / sanitizeFormData
 *
 * Tests the input sanitization layer (Layer 5 of 8-Layer Security).
 * Covers XSS payloads, HTML tags, control characters, Unicode normalization,
 * whitespace trimming, and the 2,000-character hard ceiling.
 */

import { describe, it, expect } from "vitest";
import { sanitizeInput, sanitizeFormData } from "@/lib/security/sanitize";

// ---------------------------------------------------------------------------
// sanitizeInput
// ---------------------------------------------------------------------------

describe("sanitizeInput()", () => {
  // ── XSS payloads ──────────────────────────────────────────────────────

  describe("XSS payload stripping", () => {
    it("strips <script> tags and their contents appear without tags", () => {
      const result = sanitizeInput("<script>alert('xss')</script>Hello");
      expect(result).not.toContain("<script>");
      expect(result).not.toContain("</script>");
      expect(result).toContain("Hello");
    });

    it("strips script tags with encoded quotes", () => {
      const result = sanitizeInput('<script>alert("xss")</script>');
      expect(result).not.toContain("<");
      expect(result).not.toContain(">");
    });

    it("strips <img> onerror XSS payload", () => {
      const result = sanitizeInput('<img src=x onerror=alert(1)>');
      expect(result).not.toContain("<img");
      expect(result).not.toContain("onerror");
    });

    it("strips SVG-based XSS payload", () => {
      const result = sanitizeInput(
        '<svg onload="alert(document.cookie)"></svg>',
      );
      expect(result).not.toContain("<svg");
      expect(result).not.toContain("onload");
    });

    it("strips nested script injection", () => {
      const result = sanitizeInput(
        '<<script>script>alert(1)<</script>/script>',
      );
      expect(result).not.toContain("<script>");
    });

    it("strips event handler attributes in tags", () => {
      const result = sanitizeInput('<div onmouseover="alert(1)">hover</div>');
      expect(result).not.toContain("<div");
      expect(result).not.toContain("onmouseover");
      expect(result).toContain("hover");
    });

    it("strips javascript: protocol in href", () => {
      const result = sanitizeInput(
        '<a href="javascript:alert(1)">click</a>',
      );
      expect(result).not.toContain("<a");
      expect(result).not.toContain("javascript:");
    });

    it("removes standalone angle brackets", () => {
      const result = sanitizeInput("1 < 2 and 3 > 1");
      expect(result).not.toContain("<");
      expect(result).not.toContain(">");
    });

    it("removes unmatched single and double quotes", () => {
      const result = sanitizeInput("It's a \"test\"");
      expect(result).not.toContain("'");
      expect(result).not.toContain('"');
    });
  });

  // ── HTML tag stripping ────────────────────────────────────────────────

  describe("HTML tag stripping", () => {
    it("strips basic HTML tags", () => {
      expect(sanitizeInput("<b>bold</b>")).toBe("bold");
    });

    it("strips self-closing tags", () => {
      expect(sanitizeInput("before<br/>after")).toBe("beforeafter");
    });

    it("strips tags with attributes", () => {
      const result = sanitizeInput('<p class="test">paragraph</p>');
      expect(result).toBe("paragraph");
    });

    it("strips multiple nested tags", () => {
      const result = sanitizeInput("<div><p><span>text</span></p></div>");
      expect(result).toBe("text");
    });
  });

  // ── Control character removal ─────────────────────────────────────────

  describe("control character removal", () => {
    it("removes null byte", () => {
      expect(sanitizeInput("hello\x00world")).toBe("helloworld");
    });

    it("removes bell character", () => {
      expect(sanitizeInput("hello\x07world")).toBe("helloworld");
    });

    it("removes escape character", () => {
      expect(sanitizeInput("hello\x1Bworld")).toBe("helloworld");
    });

    it("removes DEL character", () => {
      expect(sanitizeInput("hello\x7Fworld")).toBe("helloworld");
    });

    it("preserves horizontal tab (\\t)", () => {
      expect(sanitizeInput("hello\tworld")).toBe("hello\tworld");
    });

    it("preserves line feed (\\n)", () => {
      expect(sanitizeInput("hello\nworld")).toBe("hello\nworld");
    });

    it("preserves carriage return (\\r)", () => {
      expect(sanitizeInput("hello\rworld")).toBe("hello\rworld");
    });

    it("removes form feed", () => {
      expect(sanitizeInput("hello\x0Cworld")).toBe("helloworld");
    });

    it("removes vertical tab", () => {
      expect(sanitizeInput("hello\x0Bworld")).toBe("helloworld");
    });
  });

  // ── Unicode normalization ─────────────────────────────────────────────

  describe("Unicode normalization", () => {
    it("normalizes to NFC form", () => {
      // e + combining acute accent (NFD) -> e-acute (NFC)
      const nfd = "e\u0301"; // NFD: e + combining acute accent
      const nfc = "\u00E9"; // NFC: e-acute
      expect(sanitizeInput(nfd)).toBe(nfc);
    });
  });

  // ── Whitespace trimming ───────────────────────────────────────────────

  describe("whitespace handling", () => {
    it("trims leading whitespace", () => {
      expect(sanitizeInput("   hello")).toBe("hello");
    });

    it("trims trailing whitespace", () => {
      expect(sanitizeInput("hello   ")).toBe("hello");
    });

    it("trims both leading and trailing whitespace", () => {
      expect(sanitizeInput("  hello  ")).toBe("hello");
    });

    it("preserves internal whitespace", () => {
      expect(sanitizeInput("hello world")).toBe("hello world");
    });
  });

  // ── Length enforcement ────────────────────────────────────────────────

  describe("hard length limit (2000 chars)", () => {
    it("returns strings under 2000 chars as-is", () => {
      const input = "a".repeat(1999);
      expect(sanitizeInput(input)).toHaveLength(1999);
    });

    it("returns strings of exactly 2000 chars as-is", () => {
      const input = "a".repeat(2000);
      expect(sanitizeInput(input)).toHaveLength(2000);
    });

    it("truncates strings over 2000 chars", () => {
      const input = "a".repeat(3000);
      expect(sanitizeInput(input)).toHaveLength(2000);
    });
  });

  // ── Normal input pass-through ─────────────────────────────────────────

  describe("normal input pass-through", () => {
    it("passes clean alphanumeric text unchanged", () => {
      expect(sanitizeInput("Hello World 123")).toBe("Hello World 123");
    });

    it("passes email-like text (without quotes/angles)", () => {
      // Note: angle brackets and quotes are stripped
      expect(sanitizeInput("user@example.com")).toBe("user@example.com");
    });

    it("handles empty string", () => {
      expect(sanitizeInput("")).toBe("");
    });
  });
});

// ---------------------------------------------------------------------------
// sanitizeFormData
// ---------------------------------------------------------------------------

describe("sanitizeFormData()", () => {
  it("sanitizes all string values in a flat record", () => {
    const result = sanitizeFormData({
      firstName: "  <b>John</b>  ",
      lastName: "Doe",
    });
    expect(result.firstName).toBe("John");
    expect(result.lastName).toBe("Doe");
  });

  it("passes non-string primitives through unchanged", () => {
    const result = sanitizeFormData({
      count: 5,
      active: true,
      missing: null,
      absent: undefined,
    });
    expect(result.count).toBe(5);
    expect(result.active).toBe(true);
    expect(result.missing).toBeNull();
    expect(result.absent).toBeUndefined();
  });

  it("sanitizes string elements in arrays", () => {
    const result = sanitizeFormData({
      tripTypes: ["domestic", "<img src=x>", "international"],
    });
    const types = result.tripTypes as string[];
    expect(types[0]).toBe("domestic");
    expect(types[1]).toBe("");
    expect(types[2]).toBe("international");
  });

  it("recursively sanitizes nested objects", () => {
    const result = sanitizeFormData({
      contact: {
        name: "<script>xss</script>Alice",
        phone: "555-1234",
      },
    });
    const contact = result.contact as Record<string, unknown>;
    expect(contact.name).toBe("xssAlice");
    expect(contact.phone).toBe("555-1234");
  });

  it("handles mixed-type records", () => {
    const result = sanitizeFormData({
      message: "Hello <script>alert(1)</script>",
      tripsPerYear: "5",
      tripTypes: ["domestic", "<img src=x>"],
    });
    expect(result.message).toBe("Hello alert(1)");
    expect(result.tripsPerYear).toBe("5");
  });
});
