/**
 * ST-851: REQ-107 -- Integration Tests for submitForm Server Action
 *
 * Tests the 8-layer security pipeline with mocked dependencies:
 *   - Supabase (createServerSupabaseClient)
 *   - Turnstile (verifyTurnstile)
 *   - SendGrid (@sendgrid/mail)
 *   - Rate limiting (checkRateLimit)
 *   - IP hashing (hashIP / getClientIP)
 *   - next/headers
 *
 * Test scenarios:
 *   1. Honeypot rejection (silent fake success)
 *   2. Rate limiting rejection
 *   3. Zod validation failure
 *   4. Turnstile verification failure
 *   5. Successful submission
 *   6. Missing form type
 *   7. Supabase insert failure
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mocks -- must be declared before imports
// ---------------------------------------------------------------------------

const mockInsert = vi.fn();
const mockFrom = vi.fn(() => ({ insert: mockInsert }));
const mockSupabaseClient = { from: mockFrom };

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(() => mockSupabaseClient),
}));

vi.mock("@/lib/security/turnstile", () => ({
  verifyTurnstile: vi.fn(),
}));

vi.mock("@/lib/security/rate-limit", () => ({
  checkRateLimit: vi.fn(),
}));

vi.mock("@/lib/security/ip-hash", () => ({
  hashIP: vi.fn(),
  getClientIP: vi.fn(),
}));

vi.mock("@/lib/email/sendgrid", () => ({
  sendFormNotification: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------

import { submitForm } from "@/actions/submit-form";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { hashIP, getClientIP } from "@/lib/security/ip-hash";
import { sendFormNotification } from "@/lib/email/sendgrid";
import { headers } from "next/headers";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildFormData(
  fields: Record<string, string | string[]>,
): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value)) {
      for (const v of value) {
        fd.append(key, v);
      }
    } else {
      fd.append(key, value);
    }
  }
  return fd;
}

const validDemoFields = {
  formType: "demo_request",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  organization: "Acme Schools",
  orgType: "k12",
  company_website: "", // honeypot -- empty = legit
  turnstileToken: "valid-token",
};

const validContactFields = {
  formType: "contact",
  email: "jane@example.com",
  firstName: "Jane",
  lastName: "Smith",
  company_website: "",
  turnstileToken: "valid-token",
  subject: "Partnership inquiry",
  message: "We would like to discuss a partnership opportunity.",
};

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();

  // Default: all external services succeed
  const mockHeaders = new Headers({
    "x-forwarded-for": "203.0.113.42",
    "user-agent": "Test Agent",
    referer: "https://safetrekr.com/demo",
  });

  vi.mocked(headers).mockResolvedValue(mockHeaders);
  vi.mocked(getClientIP).mockReturnValue("203.0.113.42");
  vi.mocked(hashIP).mockResolvedValue("abc123hash");
  vi.mocked(verifyTurnstile).mockResolvedValue({ success: true });
  vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 4 });
  vi.mocked(sendFormNotification).mockResolvedValue(undefined);
  mockInsert.mockResolvedValue({ error: null });
});

// ===========================================================================
// Tests
// ===========================================================================

describe("submitForm Server Action", () => {
  // ── Layer 1: Form type validation ─────────────────────────────────

  describe("Layer 1: form type validation", () => {
    it("rejects missing formType with error", async () => {
      const fd = buildFormData({ email: "test@example.com" });
      const result = await submitForm(fd);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid form type.");
    });

    it("rejects invalid formType", async () => {
      const fd = buildFormData({
        formType: "nonexistent_form",
        email: "test@example.com",
      });
      const result = await submitForm(fd);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid form type.");
    });
  });

  // ── Layer 2: Honeypot rejection ───────────────────────────────────

  describe("Layer 2: honeypot rejection", () => {
    it("returns fake success when honeypot field is filled", async () => {
      const fd = buildFormData({
        ...validDemoFields,
        company_website: "http://spam-bot.example.com",
      });

      const result = await submitForm(fd);

      expect(result.success).toBe(true);
      expect(result.message).toBeTruthy();
      // Verify nothing was actually persisted
      expect(mockInsert).not.toHaveBeenCalled();
    });

    it("does not call Turnstile verification on honeypot trigger", async () => {
      const fd = buildFormData({
        ...validDemoFields,
        company_website: "bot-fill",
      });

      await submitForm(fd);
      expect(verifyTurnstile).not.toHaveBeenCalled();
    });

    it("does not call rate limiter on honeypot trigger", async () => {
      const fd = buildFormData({
        ...validDemoFields,
        company_website: "bot-value",
      });

      await submitForm(fd);
      expect(checkRateLimit).not.toHaveBeenCalled();
    });
  });

  // ── Layer 3: Turnstile verification ───────────────────────────────

  describe("Layer 3: Turnstile verification", () => {
    it("rejects when turnstile token is empty", async () => {
      const fd = buildFormData({
        ...validDemoFields,
        turnstileToken: "",
      });

      const result = await submitForm(fd);
      expect(result.success).toBe(false);
      expect(result.error).toContain("Verification is required");
    });

    it("rejects when Turnstile verification fails", async () => {
      vi.mocked(verifyTurnstile).mockResolvedValue({
        success: false,
        error: "Token expired",
      });

      const fd = buildFormData(validDemoFields);
      const result = await submitForm(fd);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Verification failed. Please try again.");
    });
  });

  // ── Layer 4: Zod validation ───────────────────────────────────────

  describe("Layer 4: Zod validation failure", () => {
    it("rejects when required field is missing (no email)", async () => {
      const { email: _, ...noEmail } = validDemoFields;
      void _;
      const fd = buildFormData(noEmail);
      const result = await submitForm(fd);

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it("rejects invalid email format", async () => {
      const fd = buildFormData({
        ...validDemoFields,
        email: "not-an-email",
      });
      const result = await submitForm(fd);

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it("rejects invalid orgType enum value", async () => {
      const fd = buildFormData({
        ...validDemoFields,
        orgType: "invalid_type",
      });
      const result = await submitForm(fd);

      expect(result.success).toBe(false);
    });

    it("rejects contact form with message under 10 chars", async () => {
      const fd = buildFormData({
        ...validContactFields,
        message: "Short",
      });
      const result = await submitForm(fd);

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  // ── Layer 6: Rate limiting ────────────────────────────────────────

  describe("Layer 6: rate limiting", () => {
    it("rejects when rate limit is exceeded", async () => {
      vi.mocked(checkRateLimit).mockResolvedValue({
        allowed: false,
        remaining: 0,
      });

      const fd = buildFormData(validDemoFields);
      const result = await submitForm(fd);

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Too many requests. Please try again later.",
      );
    });

    it("calls checkRateLimit with the correct IP hash and form type", async () => {
      const fd = buildFormData(validDemoFields);
      await submitForm(fd);

      expect(checkRateLimit).toHaveBeenCalledWith(
        "abc123hash",
        "demo_request",
        5, // maxAttempts for demo_request
        60, // windowMinutes for demo_request
      );
    });
  });

  // ── Layer 7: IP hashing ───────────────────────────────────────────

  describe("Layer 7: IP hashing", () => {
    it("hashes the client IP before any storage", async () => {
      const fd = buildFormData(validDemoFields);
      await submitForm(fd);

      expect(getClientIP).toHaveBeenCalled();
      expect(hashIP).toHaveBeenCalledWith("203.0.113.42");
    });
  });

  // ── Layer 8: Successful submission ────────────────────────────────

  describe("Layer 8: successful submission", () => {
    it("returns success with appropriate message for demo_request", async () => {
      const fd = buildFormData(validDemoFields);
      const result = await submitForm(fd);

      expect(result.success).toBe(true);
      expect(result.message).toContain("Demo request received");
    });

    it("persists submission to Supabase", async () => {
      const fd = buildFormData(validDemoFields);
      await submitForm(fd);

      expect(mockFrom).toHaveBeenCalledWith("form_submissions");
      expect(mockInsert).toHaveBeenCalledTimes(1);

      const insertPayload = mockInsert.mock.calls[0]?.[0] as Record<
        string,
        unknown
      >;
      expect(insertPayload.form_type).toBe("demo_request");
      expect(insertPayload.email).toBeTruthy();
      expect(insertPayload.first_name).toBeTruthy();
      expect(insertPayload.last_name).toBeTruthy();
      expect(insertPayload.ip_hash).toBe("abc123hash");
      expect(insertPayload.honeypot_triggered).toBe(false);
    });

    it("sends email notification (fire-and-forget)", async () => {
      const fd = buildFormData(validDemoFields);
      await submitForm(fd);

      expect(sendFormNotification).toHaveBeenCalledWith(
        "demo_request",
        expect.any(Object),
      );
    });

    it("returns success for contact form type", async () => {
      const fd = buildFormData(validContactFields);
      const result = await submitForm(fd);

      expect(result.success).toBe(true);
      expect(result.message).toContain("Message received");
    });

    it("returns success for quote_request form type", async () => {
      const fd = buildFormData({
        formType: "quote_request",
        email: "user@example.com",
        firstName: "John",
        lastName: "Doe",
        organization: "Acme Corp",
        orgType: "corporate",
        company_website: "",
        turnstileToken: "valid-token",
      });
      const result = await submitForm(fd);

      expect(result.success).toBe(true);
      expect(result.message).toContain("Quote request received");
    });

    it("returns success for sample_binder_download form type", async () => {
      const fd = buildFormData({
        formType: "sample_binder_download",
        email: "user@example.com",
        firstName: "Alex",
        lastName: "Rivera",
        company_website: "",
        turnstileToken: "valid-token",
        binderType: "k12",
      });
      const result = await submitForm(fd);

      expect(result.success).toBe(true);
      expect(result.message).toContain("sample binder");
    });
  });

  // ── Error handling ────────────────────────────────────────────────

  describe("error handling", () => {
    it("returns generic error when Supabase insert fails", async () => {
      mockInsert.mockResolvedValue({
        error: { message: "Database unavailable" },
      });

      const fd = buildFormData(validDemoFields);
      const result = await submitForm(fd);

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "An unexpected error occurred. Please try again later.",
      );
    });

    it("returns generic error on unexpected exception", async () => {
      vi.mocked(hashIP).mockRejectedValue(new Error("Crypto failure"));

      const fd = buildFormData(validDemoFields);
      const result = await submitForm(fd);

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "An unexpected error occurred. Please try again later.",
      );
    });

    it("does not expose internal error details to the client", async () => {
      mockInsert.mockResolvedValue({
        error: { message: "relation 'form_submissions' does not exist" },
      });

      const fd = buildFormData(validDemoFields);
      const result = await submitForm(fd);

      expect(result.error).not.toContain("form_submissions");
      expect(result.error).not.toContain("relation");
    });
  });

  // ── Security pipeline ordering ────────────────────────────────────

  describe("security pipeline ordering", () => {
    it("does not call rate limiter when Turnstile fails", async () => {
      vi.mocked(verifyTurnstile).mockResolvedValue({
        success: false,
        error: "Bad token",
      });

      const fd = buildFormData(validDemoFields);
      await submitForm(fd);

      expect(checkRateLimit).not.toHaveBeenCalled();
    });

    it("does not persist when rate limit is exceeded", async () => {
      vi.mocked(checkRateLimit).mockResolvedValue({
        allowed: false,
        remaining: 0,
      });

      const fd = buildFormData(validDemoFields);
      await submitForm(fd);

      expect(mockInsert).not.toHaveBeenCalled();
    });

    it("does not send email when validation fails", async () => {
      const fd = buildFormData({
        ...validDemoFields,
        email: "invalid",
      });
      await submitForm(fd);

      expect(sendFormNotification).not.toHaveBeenCalled();
    });
  });
});
