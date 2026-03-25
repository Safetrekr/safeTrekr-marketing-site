/**
 * ST-844: REQ-104 -- Unit Tests for trackEvent (Plausible Analytics)
 *
 * Tests that trackEvent calls window.plausible when available,
 * and is a silent no-op when the Plausible script is not loaded
 * or when running server-side.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { trackEvent } from "@/lib/analytics";

describe("trackEvent()", () => {
  let plausibleSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    plausibleSpy = vi.fn();
    // Simulate Plausible being loaded
    Object.defineProperty(window, "plausible", {
      value: plausibleSpy,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // Clean up the global
    delete (window as Record<string, unknown>).plausible;
    vi.restoreAllMocks();
  });

  it("calls window.plausible with the event name", () => {
    trackEvent("cta_click");
    expect(plausibleSpy).toHaveBeenCalledTimes(1);
    expect(plausibleSpy).toHaveBeenCalledWith("cta_click", undefined);
  });

  it("passes props wrapped in { props } when provided", () => {
    trackEvent("cta_click", { location: "hero", variant: "primary" });
    expect(plausibleSpy).toHaveBeenCalledWith("cta_click", {
      props: { location: "hero", variant: "primary" },
    });
  });

  it("calls with undefined options when props are not provided", () => {
    trackEvent("page_view");
    expect(plausibleSpy).toHaveBeenCalledWith("page_view", undefined);
  });

  it("is a no-op when window.plausible is undefined", () => {
    delete (window as Record<string, unknown>).plausible;
    // Should not throw
    expect(() => trackEvent("cta_click")).not.toThrow();
  });

  it("is a no-op when window.plausible is not a function", () => {
    Object.defineProperty(window, "plausible", {
      value: "not-a-function",
      writable: true,
      configurable: true,
    });
    expect(() => trackEvent("cta_click")).not.toThrow();
  });

  it("handles empty props object", () => {
    trackEvent("demo_request", {});
    expect(plausibleSpy).toHaveBeenCalledWith("demo_request", { props: {} });
  });

  it("handles multiple calls in sequence", () => {
    trackEvent("event_a");
    trackEvent("event_b", { key: "value" });
    expect(plausibleSpy).toHaveBeenCalledTimes(2);
  });
});
