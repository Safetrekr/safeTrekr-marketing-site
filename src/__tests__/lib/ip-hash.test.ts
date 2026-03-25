/**
 * ST-844: REQ-104 -- Unit Tests for hashIP and getClientIP
 *
 * Tests the IP hashing (Layer 7 of 8-Layer Security) and header extraction.
 * hashIP uses Web Crypto API (SHA-256) with a salt from env vars.
 * getClientIP extracts the client IP from x-forwarded-for / x-real-ip headers.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { hashIP, getClientIP } from "@/lib/security/ip-hash";

// ---------------------------------------------------------------------------
// hashIP
// ---------------------------------------------------------------------------

describe("hashIP()", () => {
  const TEST_SALT = "test-salt-for-hashing";

  beforeEach(() => {
    vi.stubEnv("IP_HASH_SALT", TEST_SALT);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("produces a 64-character lowercase hex string", async () => {
    const result = await hashIP("203.0.113.42");
    expect(result).toMatch(/^[0-9a-f]{64}$/);
  });

  it("produces consistent output for the same input", async () => {
    const hash1 = await hashIP("192.168.1.1");
    const hash2 = await hashIP("192.168.1.1");
    expect(hash1).toBe(hash2);
  });

  it("produces different hashes for different IPs", async () => {
    const hash1 = await hashIP("192.168.1.1");
    const hash2 = await hashIP("192.168.1.2");
    expect(hash1).not.toBe(hash2);
  });

  it("produces different hashes with different salts", async () => {
    const hash1 = await hashIP("192.168.1.1");

    vi.stubEnv("IP_HASH_SALT", "different-salt");
    const hash2 = await hashIP("192.168.1.1");

    expect(hash1).not.toBe(hash2);
  });

  it("throws an error if IP_HASH_SALT is not set", async () => {
    vi.stubEnv("IP_HASH_SALT", "");
    // Empty string is falsy, should throw
    await expect(hashIP("192.168.1.1")).rejects.toThrow(
      "Missing environment variable: IP_HASH_SALT",
    );
  });

  it("throws when IP_HASH_SALT is undefined", async () => {
    vi.unstubAllEnvs();
    // Ensure the variable is truly absent
    const original = process.env.IP_HASH_SALT;
    delete process.env.IP_HASH_SALT;
    try {
      await expect(hashIP("192.168.1.1")).rejects.toThrow(
        "Missing environment variable: IP_HASH_SALT",
      );
    } finally {
      // Restore if it was set outside test
      if (original !== undefined) {
        process.env.IP_HASH_SALT = original;
      }
    }
  });

  it("handles the 'unknown' IP string deterministically", async () => {
    const hash1 = await hashIP("unknown");
    const hash2 = await hashIP("unknown");
    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[0-9a-f]{64}$/);
  });

  it("handles IPv6 addresses", async () => {
    const result = await hashIP("::1");
    expect(result).toMatch(/^[0-9a-f]{64}$/);
  });

  it("handles IPv4-mapped IPv6 addresses", async () => {
    const result = await hashIP("::ffff:192.168.1.1");
    expect(result).toMatch(/^[0-9a-f]{64}$/);
  });
});

// ---------------------------------------------------------------------------
// getClientIP
// ---------------------------------------------------------------------------

describe("getClientIP()", () => {
  function makeHeaders(init: Record<string, string>): Headers {
    return new Headers(init);
  }

  it("extracts the first IP from x-forwarded-for", () => {
    const headers = makeHeaders({
      "x-forwarded-for": "203.0.113.42, 70.41.3.18, 150.172.238.178",
    });
    expect(getClientIP(headers)).toBe("203.0.113.42");
  });

  it("trims whitespace from x-forwarded-for entries", () => {
    const headers = makeHeaders({
      "x-forwarded-for": "  203.0.113.42  , 70.41.3.18",
    });
    expect(getClientIP(headers)).toBe("203.0.113.42");
  });

  it("falls back to x-real-ip when x-forwarded-for is absent", () => {
    const headers = makeHeaders({
      "x-real-ip": "10.0.0.1",
    });
    expect(getClientIP(headers)).toBe("10.0.0.1");
  });

  it("trims whitespace from x-real-ip", () => {
    const headers = makeHeaders({
      "x-real-ip": "  10.0.0.1  ",
    });
    expect(getClientIP(headers)).toBe("10.0.0.1");
  });

  it("prefers x-forwarded-for over x-real-ip", () => {
    const headers = makeHeaders({
      "x-forwarded-for": "203.0.113.42",
      "x-real-ip": "10.0.0.1",
    });
    expect(getClientIP(headers)).toBe("203.0.113.42");
  });

  it('returns "unknown" when no IP headers are present', () => {
    const headers = makeHeaders({});
    expect(getClientIP(headers)).toBe("unknown");
  });

  it('returns "unknown" for empty x-forwarded-for with no x-real-ip', () => {
    const headers = makeHeaders({
      "x-forwarded-for": "",
    });
    expect(getClientIP(headers)).toBe("unknown");
  });

  it("handles a single IP in x-forwarded-for (no comma)", () => {
    const headers = makeHeaders({
      "x-forwarded-for": "192.168.0.1",
    });
    expect(getClientIP(headers)).toBe("192.168.0.1");
  });

  it("handles IPv6 in x-forwarded-for", () => {
    const headers = makeHeaders({
      "x-forwarded-for": "2001:db8::1, 203.0.113.42",
    });
    expect(getClientIP(headers)).toBe("2001:db8::1");
  });
});
