# SafeTrekr Marketing -- Centralized Logging Specification

**Task**: ST-807 (REQ-134)
**Priority**: P1
**Status**: Defined
**Last Updated**: 2026-03-24
**Depends On**: ST-790 (REQ-007 -- DOKS Cluster), ST-788 (REQ-005 -- Dockerfile)

---

## 1. Logging Strategy Overview

SafeTrekr Marketing uses a lightweight logging approach appropriate for a small-team marketing site. Logs are structured as JSON in production for machine parseability, forwarded via DigitalOcean's built-in DOKS log integration, and retained for 7 days. No additional logging infrastructure is deployed at launch.

| Layer | Tool | Cost |
|-------|------|------|
| Log format | Structured JSON via `console.log` / `console.error` | $0 (application code) |
| Log collection | DOKS built-in container log capture (stdout/stderr) | $0 (included with DOKS) |
| Log forwarding | DigitalOcean log forwarding (optional) | $0 (built-in) |
| Log retention | 7 days on DigitalOcean | $0 |
| Log analysis | `kubectl logs` + DigitalOcean Logs UI | $0 |

---

## 2. Structured JSON Log Format

### 2.1 Why Structured Logging

Next.js in standalone mode writes to stdout/stderr, which Kubernetes captures as container logs. By default, `console.log` outputs unstructured strings that are difficult to filter, search, or alert on.

Structured JSON logging provides:
- **Machine parseability**: Log aggregation tools can index fields without regex parsing
- **Consistent schema**: Every log entry has the same fields, making queries reliable
- **Correlation**: `request_id` links all log entries for a single HTTP request
- **Severity filtering**: The `level` field enables filtering by severity (info, warn, error)

### 2.2 Log Schema

Every log entry emitted by the application in production MUST conform to this schema:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `timestamp` | ISO 8601 string | Yes | When the event occurred (`2026-03-24T14:30:00.000Z`) |
| `level` | Enum string | Yes | Severity: `debug`, `info`, `warn`, `error` |
| `message` | String | Yes | Human-readable description of the event |
| `request_id` | UUID string | Conditional | Present on all HTTP request-scoped logs; absent for startup/shutdown logs |
| `path` | String | Conditional | HTTP request path (e.g., `/api/health`, `/blog/trail-safety`) |
| `method` | String | Conditional | HTTP method (`GET`, `POST`) |
| `status_code` | Number | Conditional | HTTP response status code |
| `duration_ms` | Number | Conditional | Request processing time in milliseconds |
| `service` | String | Yes | Always `safetrekr-web` |
| `environment` | String | Yes | `production`, `staging`, or `preview` |
| `error` | Object | Conditional | Present only on `error` level; contains `name`, `message`, `stack` |

### 2.3 Example Log Entries

**Successful request:**
```json
{
  "timestamp": "2026-03-24T14:30:00.123Z",
  "level": "info",
  "message": "Request completed",
  "request_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "path": "/api/health",
  "method": "GET",
  "status_code": 200,
  "duration_ms": 45,
  "service": "safetrekr-web",
  "environment": "production"
}
```

**Error:**
```json
{
  "timestamp": "2026-03-24T14:30:01.456Z",
  "level": "error",
  "message": "Supabase query failed",
  "request_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "path": "/api/contact",
  "method": "POST",
  "status_code": 500,
  "duration_ms": 3200,
  "service": "safetrekr-web",
  "environment": "production",
  "error": {
    "name": "PostgrestError",
    "message": "connection refused",
    "stack": "PostgrestError: connection refused\n    at ..."
  }
}
```

**Application startup:**
```json
{
  "timestamp": "2026-03-24T14:29:55.000Z",
  "level": "info",
  "message": "Server started on port 3000",
  "service": "safetrekr-web",
  "environment": "production"
}
```

### 2.4 Log Levels

| Level | When to Use | Examples |
|-------|-------------|---------|
| `debug` | Verbose diagnostic info; disabled in production by default | Cache hit/miss, template rendering details |
| `info` | Normal operational events | Request completed, server started, health check passed |
| `warn` | Recoverable issues that may indicate a problem | Slow Supabase query (> 1s), rate limit approaching, deprecated API usage |
| `error` | Failures that require attention | Unhandled exception, Supabase unreachable, SendGrid API failure |

### 2.5 What NOT to Log

| Excluded Data | Reason |
|---------------|--------|
| Email addresses | PII; GDPR compliance |
| IP addresses | PII; Plausible handles analytics without IPs |
| Request/response bodies | May contain PII (contact form submissions) |
| Authentication tokens | Security risk |
| Supabase connection strings | Credential exposure |
| Full stack traces at `info` level | Noise; reserve for `error` level |

---

## 3. Logger Implementation

### 3.1 Application Logger Module

Create a lightweight logger utility that wraps `console.log` with structured JSON output in production and human-readable output in development.

**`src/lib/logger.ts`:**

```typescript
type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service: string;
  environment: string;
  [key: string]: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LEVEL: LogLevel =
  process.env.NODE_ENV === "production" ? "info" : "debug";

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL];
}

function log(
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>,
): void {
  if (!shouldLog(level)) return;

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    service: "safetrekr-web",
    environment: process.env.NODE_ENV ?? "development",
    ...meta,
  };

  if (process.env.NODE_ENV === "production") {
    // Structured JSON for machine parsing
    const output = JSON.stringify(entry);
    if (level === "error") {
      console.error(output);
    } else if (level === "warn") {
      console.warn(output);
    } else {
      console.log(output);
    }
  } else {
    // Human-readable format for local development
    const prefix = `[${level.toUpperCase()}]`;
    console.log(prefix, message, meta ?? "");
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) =>
    log("debug", message, meta),
  info: (message: string, meta?: Record<string, unknown>) =>
    log("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) =>
    log("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) =>
    log("error", message, meta),
};
```

### 3.2 Request Logging Middleware

Create a Next.js middleware or instrumentation hook that logs every request with a unique `request_id`:

**`src/middleware.ts`** (relevant logging addition):

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const start = Date.now();

  const response = NextResponse.next();

  // Attach request_id to response headers for correlation
  response.headers.set("x-request-id", requestId);

  // Log after response is prepared
  // Note: Full structured logging is done in API route handlers
  // and server components where the logger module is available.

  return response;
}
```

### 3.3 Usage in API Routes

```typescript
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const requestId = crypto.randomUUID();
  const start = Date.now();

  try {
    // ... business logic ...

    logger.info("Request completed", {
      request_id: requestId,
      path: "/api/health",
      method: "GET",
      status_code: 200,
      duration_ms: Date.now() - start,
    });

    return Response.json(data, { status: 200 });
  } catch (error) {
    logger.error("Request failed", {
      request_id: requestId,
      path: "/api/health",
      method: "GET",
      status_code: 500,
      duration_ms: Date.now() - start,
      error: {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
    });

    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
```

---

## 4. Log Collection (DOKS Built-in)

### 4.1 How Container Logs Work in DOKS

Kubernetes captures everything written to stdout and stderr by a container and stores it on the node's filesystem. DOKS nodes retain container logs until the container is restarted or the log file is rotated (typically at 10 MB or 100 MB depending on the container runtime configuration).

```
[Next.js server] --stdout/stderr--> [container runtime] --log file--> [node disk]
                                                                          |
                                                              [kubectl logs] reads from here
```

### 4.2 Accessing Logs

**Via kubectl (primary method):**

```bash
# Stream live logs from all pods
kubectl logs -f -l app.kubernetes.io/name=safetrekr-web -n production

# View last 100 lines from a specific pod
kubectl logs <pod-name> -n production --tail=100

# View logs from the previous container instance (after a crash)
kubectl logs <pod-name> -n production --previous

# View logs from the last 30 minutes
kubectl logs -l app.kubernetes.io/name=safetrekr-web -n production --since=30m

# Filter JSON logs for errors using jq
kubectl logs -l app.kubernetes.io/name=safetrekr-web -n production --since=1h \
  | grep '"level":"error"' \
  | jq .
```

**Via DigitalOcean Dashboard:**

1. Navigate to **Kubernetes > safetrekr-marketing > Logs**.
2. Select the namespace (`production`, `staging`).
3. Filter by pod name or search log content.
4. Logs are available for the last 7 days.

### 4.3 Log Retention

| Storage Location | Retention | Access Method |
|-----------------|-----------|---------------|
| Node disk (container logs) | Until pod restart or log rotation | `kubectl logs` |
| DigitalOcean Logs UI | 7 days | DigitalOcean Dashboard |
| Sentry (errors only) | 30 days | Sentry Dashboard |

---

## 5. DigitalOcean Log Forwarding

### 5.1 Overview

DigitalOcean provides built-in log forwarding from DOKS clusters to external destinations. This is configured at the cluster level and requires no in-cluster agents.

### 5.2 Supported Destinations

| Destination | Use Case |
|-------------|----------|
| Papertrail | Simple log search and alerting |
| Datadog | Full observability platform |
| Logtail (Better Stack) | Modern log management with free tier |
| Elasticsearch | Self-hosted log analysis |
| Custom HTTPS endpoint | Any log aggregation service |

### 5.3 Configuration Steps (When Needed)

Log forwarding is **not configured at launch**. The built-in 7-day retention via `kubectl logs` and the DigitalOcean dashboard is sufficient for initial operations. Enable forwarding when:
- Log volume exceeds what is practical to search via `kubectl logs`
- Log retention beyond 7 days is required for compliance
- Multiple team members need concurrent log access without `kubectl` permissions

To enable forwarding:

1. Navigate to **DigitalOcean Dashboard > Kubernetes > safetrekr-marketing > Settings**.
2. Under **Log Forwarding**, click **Configure**.
3. Select a destination (recommend Logtail/Better Stack for their free tier).
4. Provide the destination endpoint and authentication credentials.
5. Choose which namespaces to forward (start with `production` only).

---

## 6. Log-Based Alerting

### 6.1 Current Approach (Launch)

At launch, log-based alerting is handled indirectly:
- **Sentry** captures application errors in real-time and sends alerts (see `monitoring-spec.md` Section 4)
- **UptimeRobot** detects health check failures from outside (see `monitoring-spec.md` Section 3)
- **Kubernetes probes** restart unhealthy pods automatically (see `monitoring-spec.md` Section 7)

There is no direct log-based alerting configured at launch. Engineers review logs reactively when Sentry or UptimeRobot alerts fire.

### 6.2 Future Log-Based Alerts

When log forwarding is enabled, configure alerts for these patterns:

| Pattern | Condition | Severity |
|---------|-----------|----------|
| Error rate spike | > 10 `"level":"error"` entries in 5 minutes | Warning |
| Supabase connectivity | `"message":"Supabase query failed"` | Critical |
| Slow requests | `"duration_ms"` > 5000 | Warning |
| Pod crash | `"message":"Server started"` more than 3 times in 10 minutes (restart loop) | Critical |

---

## 7. Future: Loki + Fluent Bit Stack

When log volume increases or the team needs advanced log querying (regex, aggregation, dashboards), deploy Loki and Fluent Bit in the `monitoring` namespace.

### 7.1 When to Migrate

Migrate from `kubectl logs` to Loki + Fluent Bit when any of these conditions are met:
- Log volume exceeds 1 GB/day
- Team needs log queries spanning more than 7 days
- Multiple engineers need concurrent log access
- Log-based alerting rules are required (beyond Sentry error tracking)
- Correlation across multiple services is needed (e.g., marketing site + future API)

### 7.2 Architecture

```
[Pod stdout/stderr]
       |
[Fluent Bit DaemonSet]  -- Runs on every node, reads container logs
       |
[Loki]                  -- Log aggregation and storage in monitoring namespace
       |
[Grafana]               -- Query and dashboard UI (already planned in monitoring namespace)
```

### 7.3 Fluent Bit Configuration (Reference)

```yaml
# Helm values for fluent-bit (reference for future deployment)
# helm install fluent-bit fluent/fluent-bit -n monitoring -f fluent-bit-values.yaml

config:
  inputs: |
    [INPUT]
        Name              tail
        Tag               kube.*
        Path              /var/log/containers/*.log
        Parser            cri
        Refresh_Interval  5
        Mem_Buf_Limit     5MB
        Skip_Long_Lines   On

  filters: |
    [FILTER]
        Name                kubernetes
        Match               kube.*
        Kube_URL            https://kubernetes.default.svc:443
        Kube_Tag_Prefix     kube.var.log.containers.
        Merge_Log           On
        Merge_Log_Key       log_parsed
        Keep_Log            Off
        K8s-Logging.Parser  On
        K8s-Logging.Exclude On

  outputs: |
    [OUTPUT]
        Name                loki
        Match               kube.*
        Host                loki.monitoring.svc.cluster.local
        Port                3100
        Labels              job=fluent-bit, namespace=$kubernetes['namespace_name'], pod=$kubernetes['pod_name']
        Auto_Kubernetes_Labels Off

resources:
  requests:
    cpu: 50m
    memory: 64Mi
  limits:
    cpu: 100m
    memory: 128Mi

tolerations:
  - operator: Exists
```

### 7.4 Loki Configuration (Reference)

```yaml
# Helm values for loki (reference for future deployment)
# helm install loki grafana/loki -n monitoring -f loki-values.yaml

loki:
  auth_enabled: false

  storage:
    type: filesystem

  limits_config:
    retention_period: 168h  # 7 days
    max_query_series: 500
    max_entries_limit_per_query: 5000

  schema_config:
    configs:
      - from: "2026-01-01"
        store: tsdb
        object_store: filesystem
        schema: v13
        index:
          prefix: index_
          period: 24h

singleBinary:
  replicas: 1
  resources:
    requests:
      cpu: 100m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 512Mi

  persistence:
    enabled: true
    size: 10Gi
```

### 7.5 Estimated Cost of Loki + Fluent Bit

| Component | Resource Impact | Estimated Cost |
|-----------|----------------|---------------|
| Fluent Bit DaemonSet | 50m CPU + 64Mi per node (2 nodes = 100m + 128Mi) | $0 (runs on existing nodes) |
| Loki StatefulSet | 100m CPU + 256Mi + 10Gi PVC | ~$2/month (PVC storage on DO) |
| Grafana (shared) | Already planned in monitoring namespace | $0 |
| **Total additional cost** | | **~$2/month** |

---

## 8. Debugging Runbook

### 8.1 Common Log Investigation Workflows

**"The site is down" (UptimeRobot alert):**
```bash
# 1. Check if pods are running
kubectl get pods -n production

# 2. Check recent events for scheduling or probe failures
kubectl get events -n production --sort-by='.lastTimestamp' | tail -20

# 3. Check application logs for errors
kubectl logs -l app.kubernetes.io/name=safetrekr-web -n production --since=10m \
  | grep '"level":"error"' | jq .

# 4. Check if health endpoint responds from inside the cluster
kubectl exec -it <pod-name> -n production -- wget -qO- http://localhost:3000/api/health
```

**"Users report slow pages" (performance issue):**
```bash
# 1. Check for slow requests
kubectl logs -l app.kubernetes.io/name=safetrekr-web -n production --since=1h \
  | grep '"duration_ms"' | jq 'select(.duration_ms > 2000)'

# 2. Check node resource pressure
kubectl top nodes
kubectl top pods -n production

# 3. Check HPA status
kubectl get hpa -n production
```

**"Sentry reports new error" (application bug):**
```bash
# 1. Find the request_id from Sentry breadcrumbs

# 2. Search logs for that request_id
kubectl logs -l app.kubernetes.io/name=safetrekr-web -n production --since=1h \
  | grep '<request_id>' | jq .

# 3. Check surrounding context (logs from same pod around the same time)
kubectl logs <pod-name> -n production --since=1h | jq 'select(.timestamp > "2026-03-24T14:29:" and .timestamp < "2026-03-24T14:31:")'
```

**"Pod keeps restarting" (crash loop):**
```bash
# 1. Check pod status and restart count
kubectl get pods -n production

# 2. View logs from the crashed container
kubectl logs <pod-name> -n production --previous

# 3. Check events for OOMKilled or probe failure
kubectl describe pod <pod-name> -n production | grep -A5 "Last State"
```

---

## 9. Log Hygiene Standards

### 9.1 Do

- Use the `logger` module from `src/lib/logger.ts` for all server-side logging
- Include `request_id` in every request-scoped log entry
- Log at the appropriate level (`info` for normal flow, `warn` for anomalies, `error` for failures)
- Include `duration_ms` for any operation that involves I/O (database, external API)
- Log the start and completion of background jobs (e.g., ISR revalidation)

### 9.2 Do Not

- Use `console.log` directly in production code (use the `logger` module instead)
- Log PII (email addresses, IP addresses, names)
- Log request or response bodies (may contain form data with PII)
- Log at `debug` level in production (it is filtered out by default)
- Log inside hot paths that execute per-render in React components (causes log flood)
- Include secrets, API keys, or connection strings in log output

---

## 10. Related Requirements

| Requirement | Description | Dependency Direction |
|-------------|-------------|---------------------|
| REQ-005 | Dockerfile (standalone output writes to stdout) | Logging depends on stdout capture |
| REQ-007 | DOKS Cluster (container log infrastructure) | Logging depends on cluster |
| REQ-021 | Health Check API (primary monitored endpoint) | Logs include health check requests |
| REQ-134 | Cost Estimation and Monitoring | This document is part of REQ-134 |
| ST-806 | Monitoring and Alerting Specification | Companion document; monitoring consumes log data |
