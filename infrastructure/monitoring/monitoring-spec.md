# SafeTrekr Marketing -- Monitoring and Alerting Specification

**Task**: ST-806 (REQ-134)
**Priority**: P1
**Status**: Defined
**Last Updated**: 2026-03-24
**Depends On**: ST-790 (REQ-007 -- DOKS Cluster), ST-804 (REQ-021 -- Health Check API)

---

## 1. Monitoring Strategy Overview

SafeTrekr Marketing uses a layered monitoring approach that combines free and low-cost services to cover node-level infrastructure, external availability, application errors, and web analytics. Every layer is selected to stay within the project's cost constraints (target: ~$100/month total infrastructure spend).

| Layer | Tool | Cost | What It Covers |
|-------|------|------|----------------|
| Infrastructure metrics | DigitalOcean Monitoring | Free (built-in) | Node CPU, memory, disk, bandwidth |
| External uptime | UptimeRobot | Free tier | HTTP availability of `/api/health` from external locations |
| Error tracking | Sentry | Free tier (5K errors/month) | Unhandled exceptions, server/client errors, performance |
| Web analytics | Plausible Analytics | $9/month (app-level) | Page views, referrers, conversions; configured in application code |

---

## 2. DigitalOcean Monitoring (Infrastructure Metrics)

### 2.1 What It Provides

DigitalOcean Monitoring is automatically enabled for all DOKS clusters and Droplets. It collects node-level metrics without requiring any agent installation or additional configuration.

| Metric | Collection Interval | Retention |
|--------|-------------------|-----------|
| CPU utilization (per node) | 1 minute | 30 days |
| Memory utilization (per node) | 1 minute | 30 days |
| Disk I/O (read/write bytes) | 1 minute | 30 days |
| Disk usage (%) | 1 minute | 30 days |
| Network bandwidth (in/out) | 1 minute | 30 days |

### 2.2 Alert Policies

Configure the following alert policies in the DigitalOcean dashboard under **Monitoring > Create Alert Policy**.

| Alert Name | Resource | Metric | Threshold | Duration | Notification |
|------------|----------|--------|-----------|----------|-------------|
| High CPU | DOKS nodes (tag: `safetrekr`) | CPU % | > 80% | 5 minutes sustained | Email + Slack |
| High Memory | DOKS nodes (tag: `safetrekr`) | Memory % | > 85% | 5 minutes sustained | Email + Slack |
| High Disk | DOKS nodes (tag: `safetrekr`) | Disk % | > 85% | 5 minutes sustained | Email |
| High Bandwidth | DOKS nodes (tag: `safetrekr`) | Outbound bandwidth | > 100 Mbps | 10 minutes sustained | Email |

### 2.3 Setup Steps

1. Navigate to **DigitalOcean Dashboard > Monitoring > Alerts**.
2. Click **Create Alert Policy**.
3. Select resource type: **Droplets** with tag `safetrekr`.
4. Configure each alert from the table above.
5. Set notification channel: email (primary) and Slack webhook (secondary).

### 2.4 Relationship to Cluster Autoscaling

The alert thresholds are intentionally aligned with the DOKS cluster autoscaling policy defined in `cluster-spec.md` Section 3:

| Metric | Alert Threshold | Autoscale Trigger |
|--------|----------------|-------------------|
| CPU | > 80% for 5 min | > 70% for 5 min (scale-up fires first) |
| Memory | > 85% for 5 min | > 80% for 5 min (scale-up fires first) |

This means the autoscaler should add a node before the alert fires. If the alert fires, it indicates either the autoscaler is at max capacity (4 nodes) or the scale-up failed, both of which require human attention.

---

## 3. UptimeRobot (External HTTP Monitoring)

### 3.1 Purpose

UptimeRobot monitors the `/api/health` endpoint from external locations worldwide to detect outages that internal monitoring would miss (e.g., DNS failures, load balancer issues, ISP routing problems).

### 3.2 Free Tier Limits

| Feature | Free Tier Value |
|---------|----------------|
| Monitors | 50 |
| Check interval | 5 minutes |
| Alert contacts | Unlimited |
| Status pages | 1 |
| Log retention | 2 months |

### 3.3 Monitor Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Monitor type | HTTP(S) | Full HTTP request validation |
| URL | `https://safetrekr.com/api/health` | Health check endpoint (ST-804) |
| Check interval | 5 minutes | Free tier maximum frequency |
| HTTP method | GET | Standard health check verb |
| Expected status code | 200 | Returns 200 for `healthy` and `degraded`; 503 triggers alert |
| Keyword monitoring | `"status":"healthy"` | Validates response body, not just HTTP status |
| Timeout | 30 seconds | Generous timeout for cold-start scenarios |

### 3.4 Alert Configuration

| Contact | Method | Alert on |
|---------|--------|----------|
| DevOps email | Email | Down, Up (recovery) |
| Slack `#safetrekr-alerts` | Webhook | Down only |

### 3.5 Additional Monitors (Optional)

| Monitor | URL | Purpose |
|---------|-----|---------|
| Homepage | `https://safetrekr.com` | Verify the marketing homepage loads |
| Staging health | `https://staging.safetrekr.com/api/health` | Pre-production monitoring |
| SSL expiry | `https://safetrekr.com` (SSL check) | Alert 14 days before certificate expiry |

### 3.6 Status Page

UptimeRobot provides a free public status page. Consider creating one at `status.safetrekr.com` (CNAME to UptimeRobot) to provide transparency during incidents.

### 3.7 Setup Steps

1. Create an account at [uptimerobot.com](https://uptimerobot.com).
2. Click **Add New Monitor**.
3. Configure the primary health check monitor from the table in Section 3.3.
4. Add alert contacts (email, Slack webhook).
5. Optionally create additional monitors from Section 3.5.
6. Optionally create a status page and configure CNAME in Cloudflare DNS.

---

## 4. Sentry (Error Tracking)

### 4.1 Purpose

Sentry captures unhandled exceptions, runtime errors, and performance data from both the Next.js server and client. It provides stack traces, breadcrumbs, and user context that are impossible to extract from plain log output.

### 4.2 Free Tier Limits

| Feature | Free Tier Value |
|---------|----------------|
| Errors | 5,000 per month |
| Performance transactions | 10,000 per month |
| Team members | 1 |
| Data retention | 30 days |
| Release tracking | Included |
| Source maps | Included |

For a marketing site, 5K errors/month is more than sufficient. If the site generates more than 5K errors per month, the priority is fixing the errors, not upgrading the plan.

### 4.3 Next.js Sentry Integration

#### 4.3.1 Install the SDK

```bash
npx @sentry/wizard@latest -i nextjs
```

The Sentry wizard automatically:
- Installs `@sentry/nextjs` as a dependency
- Creates `sentry.client.config.ts` and `sentry.server.config.ts`
- Creates `sentry.edge.config.ts` for edge runtime (not used in this project)
- Wraps `next.config.ts` with `withSentryConfig()`
- Creates a `.env.sentry-build-plugin` file for build-time source map upload

#### 4.3.2 Configuration Files

After the wizard runs, verify and adjust the following files:

**`sentry.client.config.ts`** (browser-side error capture):
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_APP_VERSION,

  // Capture 100% of errors; sample 10% of performance transactions
  tracesSampleRate: 0.1,

  // Only enable replay in production to stay within free tier limits
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: process.env.NODE_ENV === "production" ? 1.0 : 0,
});
```

**`sentry.server.config.ts`** (Node.js server-side error capture):
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_APP_VERSION,

  tracesSampleRate: 0.1,
});
```

**`next.config.ts`** (wrapped with Sentry build plugin):
```typescript
import { withSentryConfig } from "@sentry/nextjs";

// ... existing nextConfig ...

export default withSentryConfig(nextConfig, {
  // Upload source maps during build for readable stack traces
  silent: true,
  org: "safetrekr",
  project: "marketing",

  // Hide source maps from the client bundle
  hideSourceMaps: true,

  // Automatically instrument API routes
  autoInstrumentServerFunctions: true,
});
```

#### 4.3.3 Global Error Handler

Create `src/app/global-error.tsx` to capture React rendering errors:

```typescript
"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <h2>Something went wrong</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

#### 4.3.4 Environment Variables

| Variable | Location | Value |
|----------|----------|-------|
| `NEXT_PUBLIC_SENTRY_DSN` | ConfigMap (public, safe to expose) | `https://<key>@o<org-id>.ingest.sentry.io/<project-id>` |
| `SENTRY_DSN` | ConfigMap (same value, server-side access) | Same as above |
| `SENTRY_AUTH_TOKEN` | GitHub Actions secret only | Used during build for source map upload |
| `SENTRY_ORG` | GitHub Actions env | `safetrekr` |
| `SENTRY_PROJECT` | GitHub Actions env | `marketing` |
| `NEXT_PUBLIC_APP_VERSION` | Set in CI to `sha-<hash>` | Ties errors to specific deployments |

#### 4.3.5 CI/CD Integration

Add source map upload to the GitHub Actions build step:

```yaml
- name: Build Next.js
  env:
    SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
    SENTRY_ORG: safetrekr
    SENTRY_PROJECT: marketing
    NEXT_PUBLIC_APP_VERSION: sha-${{ github.sha }}
  run: npm run build
```

Source maps are uploaded to Sentry during `npm run build` via the `@sentry/nextjs` build plugin. They are not included in the Docker image (the plugin uploads them directly to Sentry's servers).

#### 4.3.6 Sentry Alert Rules

Configure the following alert rules in the Sentry dashboard:

| Alert | Condition | Action |
|-------|-----------|--------|
| High error volume | > 50 events in 1 hour | Email + Slack |
| New issue | First occurrence of an error | Email |
| Regression | Previously resolved error reappears | Email + Slack |
| Performance degradation | p95 transaction duration > 3 seconds | Email |

### 4.4 Sentry Setup Checklist

- [ ] Create a Sentry account at [sentry.io](https://sentry.io)
- [ ] Create organization `safetrekr` and project `marketing` (platform: Next.js)
- [ ] Run `npx @sentry/wizard@latest -i nextjs` in the project root
- [ ] Adjust `sentry.client.config.ts` and `sentry.server.config.ts` per Section 4.3.2
- [ ] Create `src/app/global-error.tsx` per Section 4.3.3
- [ ] Add `NEXT_PUBLIC_SENTRY_DSN` to Kubernetes ConfigMap
- [ ] Add `SENTRY_AUTH_TOKEN` to GitHub Actions repository secrets
- [ ] Verify error capture by triggering a test error in staging
- [ ] Configure alert rules per Section 4.3.6
- [ ] Verify source maps render readable stack traces in the Sentry dashboard

---

## 5. Plausible Analytics (Web Analytics)

### 5.1 Purpose

Plausible provides privacy-friendly web analytics without cookies or personal data collection. It is configured in the application code (not infrastructure) and is included here for completeness of the monitoring picture.

### 5.2 Cost

| Plan | Price | Features |
|------|-------|----------|
| Growth | $9/month | 10K monthly pageviews, unlimited sites, API access |

Included in the total infrastructure cost estimate from `cluster-spec.md` Section 7.3.

### 5.3 Integration Method

Plausible is integrated via a `<script>` tag in the Next.js root layout, not via infrastructure configuration. The script is self-hosted or loaded from Plausible's CDN.

**`src/app/layout.tsx`** (relevant snippet):
```tsx
<Script
  defer
  data-domain="safetrekr.com"
  src="https://plausible.io/js/script.js"
/>
```

### 5.4 Key Metrics Tracked

| Metric | Description |
|--------|-------------|
| Unique visitors | Daily/weekly/monthly visitor counts |
| Pageviews | Total page loads |
| Bounce rate | Single-page visits |
| Visit duration | Average time on site |
| Referral sources | Where traffic comes from |
| Top pages | Most visited pages |
| Geographic distribution | Visitor locations (country-level, no IP storage) |
| Device/browser breakdown | Desktop vs mobile, browser distribution |

### 5.5 Custom Events (Future)

Plausible supports custom event tracking for conversion goals:

| Event | Trigger | Purpose |
|-------|---------|---------|
| `Contact Form Submit` | Form submission on `/contact` | Track lead generation |
| `Newsletter Signup` | Email signup | Track newsletter growth |
| `CTA Click` | Any call-to-action button | Track engagement |

These are configured in application code via `plausible('event-name')` and registered in the Plausible dashboard.

### 5.6 Plausible Setup Checklist

- [ ] Create a Plausible account at [plausible.io](https://plausible.io)
- [ ] Add site `safetrekr.com`
- [ ] Add the tracking script to `src/app/layout.tsx`
- [ ] Verify pageviews appear in the Plausible dashboard after deployment
- [ ] Configure custom events for conversion tracking (post-launch)

---

## 6. Alert Routing Summary

All alerts from all monitoring layers funnel into two channels:

| Channel | Services Sending Alerts | Purpose |
|---------|------------------------|---------|
| Email (DevOps) | DO Monitoring, UptimeRobot, Sentry | Primary notification; always-on |
| Slack `#safetrekr-alerts` | DO Monitoring, UptimeRobot, Sentry | Team visibility; fast response |

### 6.1 Alert Severity Matrix

| Severity | Example | Response Time | Notification |
|----------|---------|---------------|-------------|
| Critical | Health check down (UptimeRobot), unhealthy status (503) | < 15 minutes | Email + Slack |
| Warning | CPU > 80%, Memory > 85%, error volume spike | < 1 hour | Email + Slack |
| Info | New Sentry issue, disk > 85%, certificate < 14 days | Next business day | Email |

---

## 7. Kubernetes-Level Monitoring

In addition to the external tools above, the DOKS cluster provides built-in Kubernetes monitoring through `metrics-server` (installed as a cluster add-on per `cluster-spec.md` Section 5).

### 7.1 Pod-Level Health Checks

The deployment manifest (`infrastructure/k8s/base/deployment.yaml`) defines three probes against `/api/health`:

| Probe | Path | Interval | Failure Threshold | Purpose |
|-------|------|----------|-------------------|---------|
| Startup | `/api/health` | 5s | 30 (150s total) | Wait for cold start |
| Liveness | `/api/health` | 30s | 3 (90s to restart) | Restart stuck pods |
| Readiness | `/api/health` | 10s | 3 (30s to remove) | Remove unhealthy pods from Service |

### 7.2 HPA Metrics

The HPA (`infrastructure/k8s/base/hpa.yaml`) scales pods based on:
- CPU utilization target: 60%
- Memory utilization target: 70%

These thresholds are lower than the node-level alert thresholds to ensure pod scaling happens before node-level alerts fire.

### 7.3 Diagnostic Commands

```bash
# Check node resource usage
kubectl top nodes

# Check pod resource usage
kubectl top pods -n production

# Check pod health and restarts
kubectl get pods -n production -o wide

# View recent pod events (scheduling failures, OOM kills, probe failures)
kubectl get events -n production --sort-by='.lastTimestamp' | tail -20

# Check HPA status and current scaling decisions
kubectl get hpa -n production

# View detailed pod status including probe results
kubectl describe pod <pod-name> -n production
```

---

## 8. Monitoring Architecture Diagram

```
                    External Users
                         |
                    [Cloudflare DNS]
                         |
               [DO Load Balancer]
                         |
                  [Ingress Nginx]
                    /         \
            [Pod 1]           [Pod 2]       <-- K8s probes: /api/health
                \               /
                 [Supabase DB]

Monitoring Layers:
  1. UptimeRobot -----> GET https://safetrekr.com/api/health (external, every 5 min)
  2. DO Monitoring ---> Node CPU / Memory / Disk (internal, every 1 min)
  3. Sentry ----------> JS errors + server exceptions (real-time)
  4. K8s Probes ------> /api/health per pod (liveness 30s, readiness 10s)
  5. Plausible -------> Pageviews / analytics (client-side script)
```

---

## 9. Future Enhancements

When the project grows beyond the marketing site (e.g., app launch, increased traffic), consider these upgrades:

| Enhancement | Trigger | Tool |
|-------------|---------|------|
| Prometheus + Grafana in `monitoring` namespace | Need custom metrics (request latency histograms, queue depths) | Prometheus Helm chart |
| PagerDuty or Opsgenie | Team grows beyond 1 on-call engineer | PagerDuty free tier or Opsgenie |
| Synthetic monitoring | Need multi-step user journey validation | UptimeRobot paid or Checkly |
| Real User Monitoring (RUM) | Need client-side performance percentiles | Sentry Performance or Web Vitals dashboard |
| Uptime SLA reporting | Customer-facing SLA commitments | UptimeRobot Pro or Statuspage.io |

---

## 10. Cost Summary

| Service | Monthly Cost | Category |
|---------|-------------|----------|
| DigitalOcean Monitoring | $0 | Infrastructure metrics |
| UptimeRobot | $0 | External uptime monitoring |
| Sentry | $0 | Error tracking |
| Plausible Analytics | $9 | Web analytics |
| **Total monitoring cost** | **$9** | |

All monitoring tools except Plausible are free tier. The $9/month for Plausible is already accounted for in the total infrastructure budget in `cluster-spec.md` Section 7.3.

---

## 11. Related Requirements

| Requirement | Description | Dependency Direction |
|-------------|-------------|---------------------|
| REQ-007 | DOKS Cluster Provisioning | Monitoring depends on cluster being provisioned |
| REQ-021 | Health Check API (`/api/health`) | UptimeRobot and K8s probes depend on this endpoint |
| REQ-134 | Cost Estimation and Monitoring | This document is part of REQ-134 |
| ST-807 | Centralized Logging Specification | Companion document; logging complements monitoring |
