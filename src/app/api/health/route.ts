/**
 * ST-804: REQ-021 -- Health Check API Route
 *
 * GET /api/health
 *
 * Reports the operational status of the SafeTrekr marketing site and its
 * backing services. Designed for use by uptime monitors (e.g., UptimeRobot,
 * Kubernetes liveness/readiness probes, DigitalOcean health checks).
 *
 * Status logic:
 * - "healthy"   -- All services operational
 * - "degraded"  -- At least one non-critical service is down (SendGrid, Turnstile)
 * - "unhealthy" -- Critical dependency is down (Supabase)
 *
 * HTTP status codes:
 * - 200 -- healthy or degraded
 * - 503 -- unhealthy
 *
 * Each service check runs independently inside its own try/catch so that
 * a failure in one check never prevents the others from reporting.
 */

import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ServiceStatus = "up" | "down";
type ConfigStatus = "configured" | "missing";
type OverallStatus = "healthy" | "degraded" | "unhealthy";

interface SupabaseHealth {
  status: ServiceStatus;
  latency_ms: number;
}

interface ConfigHealth {
  status: ConfigStatus;
}

interface HealthResponse {
  status: OverallStatus;
  timestamp: string;
  version: string;
  services: {
    supabase: SupabaseHealth;
    sendgrid: ConfigHealth;
    turnstile: ConfigHealth;
  };
}

// ---------------------------------------------------------------------------
// Service Checks
// ---------------------------------------------------------------------------

/**
 * Verify Supabase connectivity by executing a lightweight query.
 *
 * Strategy: query an intentionally nonexistent table (`_health_check`).
 * PostgREST will return a structured error (PGRST204 / 42P01) proving
 * the server is reachable. A true network failure would throw before
 * any PostgREST error object is returned.
 *
 * This avoids needing a real database function or table and works on
 * every Supabase project out of the box.
 */
async function checkSupabase(): Promise<SupabaseHealth> {
  try {
    const supabase = createServerSupabaseClient();
    const start = performance.now();

    const { error } = await supabase
      .from("_health_check")
      .select("*", { count: "exact", head: true });

    const latency = Math.round(performance.now() - start);

    // If PostgREST returned a structured error, the server is reachable.
    // Only treat the check as "down" when the error does NOT indicate
    // a reachable PostgREST instance (e.g., FetchError, DNS failure).
    if (error && !isPostgrestReachableError(error)) {
      return { status: "down", latency_ms: latency };
    }

    return { status: "up", latency_ms: latency };
  } catch {
    // Network-level failures (DNS, TLS, timeout) land here.
    return { status: "down", latency_ms: -1 };
  }
}

/**
 * PostgREST returns specific error codes when the server is reachable
 * but the request is semantically invalid (e.g., unknown relation).
 * Receiving any of these errors proves connectivity.
 *
 * @see https://postgrest.org/en/stable/references/errors.html
 */
function isPostgrestReachableError(error: { code: string }): boolean {
  const reachableCodes = new Set([
    // Relation not found -- PostgREST responded, so it's reachable
    "PGRST204",
    "42P01", // PostgreSQL: undefined_table
    // Permission errors also prove the server is reachable
    "PGRST301",
    "42501", // PostgreSQL: insufficient_privilege
    // Any other PostgREST-prefixed code means the server responded
    "PGRST200",
    "PGRST202",
  ]);

  return reachableCodes.has(error.code);
}

/**
 * Verify that the SendGrid API key is configured.
 * This is an environment variable check only -- no outbound API call.
 */
function checkSendGrid(): ConfigHealth {
  const apiKey = process.env.SENDGRID_API_KEY;
  return {
    status: apiKey && apiKey.trim().length > 0 ? "configured" : "missing",
  };
}

/**
 * Verify that the Cloudflare Turnstile site key is configured.
 * This is an environment variable check only -- no outbound API call.
 */
function checkTurnstile(): ConfigHealth {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  return {
    status: siteKey && siteKey.trim().length > 0 ? "configured" : "missing",
  };
}

// ---------------------------------------------------------------------------
// Aggregate Status
// ---------------------------------------------------------------------------

/**
 * Derive the overall status from individual service checks.
 *
 * - Supabase down => "unhealthy" (critical dependency)
 * - SendGrid or Turnstile missing => "degraded" (non-critical)
 * - All checks pass => "healthy"
 */
function deriveOverallStatus(
  supabase: SupabaseHealth,
  sendgrid: ConfigHealth,
  turnstile: ConfigHealth,
): OverallStatus {
  if (supabase.status === "down") {
    return "unhealthy";
  }

  if (sendgrid.status === "missing" || turnstile.status === "missing") {
    return "degraded";
  }

  return "healthy";
}

// ---------------------------------------------------------------------------
// Route Handler
// ---------------------------------------------------------------------------

export async function GET(): Promise<NextResponse<HealthResponse>> {
  // Run all checks concurrently. The config checks are synchronous but
  // wrapping them in the same flow keeps the structure uniform.
  const [supabase, sendgrid, turnstile] = await Promise.all([
    checkSupabase(),
    Promise.resolve(checkSendGrid()),
    Promise.resolve(checkTurnstile()),
  ]);

  const status = deriveOverallStatus(supabase, sendgrid, turnstile);

  const body: HealthResponse = {
    status,
    timestamp: new Date().toISOString(),
    version: "0.1.0",
    services: {
      supabase,
      sendgrid,
      turnstile,
    },
  };

  const httpStatus = status === "unhealthy" ? 503 : 200;

  return NextResponse.json(body, {
    status: httpStatus,
    headers: {
      // Prevent caching of health check responses so monitors always
      // get fresh data.
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
