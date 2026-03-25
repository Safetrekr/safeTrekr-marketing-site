# SafeTrekr Platform Deep Analysis
**Date**: 2026-03-17
**Branch**: wireUp5
**Analyst**: DevOps Platform Engineer (Claude Opus 4.6)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Feature Documentation](#2-feature-documentation)
3. [Risk Assessment](#3-risk-assessment)
4. [Enhancement Proposals](#4-enhancement-proposals)
5. [Architecture Recommendations](#5-architecture-recommendations)
6. [Priority Recommendations](#6-priority-recommendations)

---

## 1. Executive Summary

SafeTrekr is a multi-service monorepo managing group travel safety across four primary services: a Next.js 15 web portal, an Expo React Native mobile app, a FastAPI Core API, and a TarvaRI FastAPI intelligence service. The platform uses Supabase PostgreSQL, Redis 7+, Doppler for secrets injection, GHCR for container images, and DigitalOcean Kubernetes (DOKS) for orchestration. EAS Build handles the mobile pipeline.

**Overall Posture**: The application architecture is sound--non-root containers, dropped capabilities, role-based rate limiting, structured logging, and multi-tenant RLS are all in place. However, the platform has **critical security gaps** (plaintext credentials in tracked files, zero secret scanning, no SAST/DAST), **operational readiness gaps** (no K8s probes, no PDBs, no WAF, missing SIGTERM handlers in 2 workers), and **build fragility** (5 consecutive EAS fix commits indicating systemic pnpm workspace linking problems).

**Severity Breakdown**:
- CRITICAL (must fix immediately): 3 findings
- HIGH (fix within 2 weeks): 7 findings
- MEDIUM (fix within 1 month): 8 findings
- LOW (schedule for next quarter): 5 findings

---

## 2. Feature Documentation

### 2.1 Service Inventory

| Service | Stack | Port | K8s Deployed | Health Endpoint |
|---------|-------|------|-------------|-----------------|
| safetrekr-app-v2 | Next.js 15 + Tailwind + shadcn | 3000 | Yes (prod, 2 replicas) | None configured in K8s |
| safetrekr-core | FastAPI 0.115 + Python 3.11 | 8001 | Yes (prod, 2 replicas) | `/v1/health` (Docker only) |
| TarvaRI API | FastAPI + Python 3.11 | 8000 | Not deployed to K8s | `/health`, `/ready` |
| TarvaRI Workers (5) | Python background processes | N/A | Not deployed to K8s | Heartbeat via Redis |
| safetrekr-traveler-native | Expo RN (Expo 54) | N/A | N/A (EAS Build) | N/A |
| Redis | Redis 7 Alpine | 6379/6380 | Shared instance | `redis-cli ping` |

### 2.2 CI/CD Pipeline

- **Container Build**: GitHub Actions builds Docker images, pushes to `ghcr.io/safetrekr/*`
- **Image Tags**: `{env}-{sha8}` convention
- **Deployment**: `kubectl` direct apply against DOKS cluster
- **Secrets**: Doppler CLI wraps the entrypoint in both safetrekr-core and safetrekr-app-v2 containers
- **Mobile**: EAS Build with pnpm 10.25.0 and Node 22.12.0
- **No CI security scanning**: No gitleaks, no Trivy, no SAST, no DAST, no dependency audit

### 2.3 Kubernetes Configuration

- **Cluster**: DigitalOcean DOKS with `prod` node pool
- **Deployments**: RollingUpdate (maxSurge: 25%, maxUnavailable: 25%)
- **Container Security**: runAsNonRoot, dropped ALL capabilities, no privilege escalation
- **Missing**: Liveness/readiness probes, PodDisruptionBudgets, NetworkPolicies, HPA
- **Ingress**: NGINX ingress controller with basic rate limiting (100 rps), SSL redirect disabled, TLS commented out
- **TarvaRI**: Not yet deployed to K8s (Docker Compose only)

### 2.4 Observability

- **TarvaRI**: Has an observability stack defined (Prometheus + Grafana + Jaeger + OTEL Collector) but it is local-only via Docker Compose, not integrated with production
- **safetrekr-core**: Structured JSON logging, no metrics export, no tracing
- **safetrekr-app-v2**: No server-side observability beyond Next.js defaults
- **Alerting**: None configured
- **Dashboards**: One Grafana dashboard exists (`alert-delivery-overview.json`), local development only

### 2.5 Secret Management

- **Production**: Doppler injects secrets at container startup via `doppler run --`
- **Local Development**: `.env` files (gitignored at root and per-service)
- **Stripe credentials**: Plaintext in `stripe_creds.md` tracked in git (CRITICAL)
- **K8s**: `DOPPLER_TOKEN` is a placeholder `<DOPPLER_TOKEN>` in deployment YAML (injected at deploy time)

### 2.6 TarvaRI Worker Architecture

| Worker | Signal Handling | Stop Grace Period |
|--------|----------------|-------------------|
| ingest_worker | SIGTERM + SIGINT | 30s |
| bundler_worker | SIGTERM + SIGINT | 30s |
| alert_router_worker | SIGTERM + SIGINT | 30s |
| cleanup_worker | SIGTERM + SIGINT | N/A (runs in Docker) |
| delivery_worker | **NONE** | N/A |
| escalation_worker | **NONE** | N/A |

---

## 3. Risk Assessment

### CRITICAL RISKS

#### R-001: Plaintext Stripe Credentials in Git History
- **File**: `/stripe_creds.md` (tracked, unignored)
- **Content**: Stripe dashboard URL, admin email, and password in cleartext
- **Impact**: Full Stripe account compromise. Anyone with repo access (past or present contributors, compromised CI, backup leaks) can access the payment processor. This is a PCI-DSS violation.
- **Likelihood**: HIGH -- the file is visible in `git status` as untracked, meaning it may not yet be committed, but the content exists on disk and could be committed at any time. If it has ever been committed on any branch, the credentials are permanently in git history.
- **Mitigation**: Immediate credential rotation on Stripe dashboard. Delete the file. If ever committed, use `git filter-repo` or BFG to purge from history. Enable 2FA on Stripe. Store credentials in Doppler.

#### R-002: Zero Secret Scanning in Pipeline or Pre-Commit
- **Finding**: No `gitleaks`, `trufflehog`, `git-secrets`, or any pre-commit hook framework exists anywhere in the monorepo. No `.pre-commit-config.yaml` file. No `husky` configuration. The `package.json` has no `prepare` or `precommit` scripts.
- **Impact**: Secrets (API keys, passwords, tokens) can be committed without any guardrail. R-001 is a direct consequence.
- **Likelihood**: HIGH -- active development with multiple `.env` files across 5+ services means accidental secret commits are a matter of when, not if.

#### R-003: EAS Build Fragility
- **Finding**: The last 5 commits on `wireUp5` are all EAS build fixes:
  ```
  a0fa002 Use custom install command for EAS builds
  de8ba55 Add pnpm overrides to native package.json for EAS build
  a042ef8 Add valid pnpm-lock.yaml to native dir for EAS detection
  d71cf1b Remove stale local pnpm-lock.yaml from native app
  447713a Add .npmrc to fix EAS frozen-lockfile builds
  ```
- **Root Cause**: The monorepo uses pnpm workspaces with `packages/core-logic` as a shared package, but EAS Build does not natively support pnpm workspace resolution. The current workaround chain (`.npmrc`, local `pnpm-lock.yaml`, custom install commands, package.json overrides) is brittle.
- **Impact**: Mobile builds can break with any dependency change. Each fix attempt creates more workaround complexity. A developer adding a dependency to `core-logic` may unknowingly break EAS.
- **Likelihood**: HIGH -- this is actively happening right now.

### HIGH RISKS

#### R-004: No SAST/DAST in Pipeline
- **Finding**: No `bandit` (Python SAST), no ESLint security plugin, no `Trivy` container scanning, no OWASP ZAP or similar DAST tool. The Python services have `ruff` and `black` for code quality but these do not catch security issues.
- **Impact**: SQL injection, XSS, insecure deserialization, and known CVEs in dependencies can reach production undetected.
- **Effort to fix**: LOW -- `bandit` and `pip-audit` can be added to existing CI in under 1 hour.

#### R-005: No Dependency Vulnerability Scanning
- **Finding**: No Dependabot, Renovate, `pip-audit`, `pnpm audit`, or `npm audit` configured. The `requirements.txt` files pin versions but are never automatically checked for CVEs.
- **Impact**: Known vulnerabilities in FastAPI, Pydantic, httpx, Supabase client, or any transitive dependency will not be detected until manually discovered.

#### R-006: Rate Limiting Fails Open
- **Finding**: In `safetrekr-core/src/middleware/rate_limit.py`, lines 85-91:
  ```python
  except Exception as e:
      # If Redis fails, log error but allow request through
      logger.error("Rate limiting check failed", ...)
  ```
- **Impact**: If Redis goes down (crash, OOM, network partition), ALL rate limiting is disabled. An attacker who can trigger Redis failure (or during any Redis maintenance) gets unlimited access. This is a single Redis instance with no sentinel or cluster.
- **Compounding Factor**: Redis is a shared single instance for both cache and rate limiting. A cache stampede or memory pressure from one function can disable rate limiting for all.

#### R-007: No Kubernetes Liveness/Readiness Probes
- **Finding**: Neither the safetrekr-core nor safetrekr-app-v2 K8s deployments include `livenessProbe` or `readinessProbe` configurations, despite both services having health endpoints.
- **Impact**: K8s cannot detect hung or crashed containers. Traffic will be routed to unhealthy pods. Rolling updates will proceed without verifying the new version is ready, potentially causing full outages.

#### R-008: TLS Not Configured in Production Ingress
- **Finding**: The safetrekr-app-v2 production ingress has `ssl-redirect: "false"` and TLS is commented out:
  ```yaml
  nginx.ingress.kubernetes.io/ssl-redirect: "false"
  # tls:
  #   - hosts:
  #       - app.safetrekr.com
  #     secretName: safetrekr-tls-prod
  ```
  The safetrekr-core ingress also has `ssl-redirect: "false"`.
- **Impact**: Production traffic between users and the application may be transmitted in cleartext, exposing JWTs, session tokens, and PII. This is a compliance violation for any framework (GDPR, HIPAA, SOC2).

#### R-009: Missing SIGTERM Handlers in Delivery and Escalation Workers
- **Finding**: `delivery_worker.py` and `escalation_worker.py` have no signal handling code. The other 4 workers (ingest, bundler, router, cleanup) all properly handle SIGTERM/SIGINT.
- **Impact**: During K8s rolling updates or scale-down, these workers will be hard-killed after the grace period. In-flight alert deliveries will be silently dropped. Escalation decisions mid-processing will be lost. Given that delivery_worker handles actual SMS/email/push sends, this could mean safety alerts never reach travelers.

#### R-010: Doppler as Single Point of Failure
- **Finding**: Both production containers use `doppler run -- <CMD>` as their entrypoint. If Doppler's API is unreachable during container startup (network issue, Doppler outage, DNS failure), the container will fail to start entirely.
- **Impact**: A Doppler outage prevents all deployments and all pod restarts. If a pod crashes during a Doppler outage, it cannot recover.

### MEDIUM RISKS

#### R-011: Single Redis Instance for Everything
- **Finding**: One Redis 7 Alpine instance handles: cache for safetrekr-core, cache for TarvaRI, job queues for TarvaRI workers, and rate limiting for safetrekr-core. No persistence configuration beyond `appendonly yes`. No memory limits. No eviction policy.
- **Impact**: Memory exhaustion in one function (e.g., large cache entries from TarvaRI intel processing) can crash Redis, taking down rate limiting, all caches, and all job queues simultaneously.

#### R-012: 40+ PNG Screenshots at Repository Root
- **Finding**: 40+ PNG files (SC-003, SC-010, SC-014, SC-024 through SC-068, etc.) are at the repo root as untracked files. These appear to be UI screenshots for documentation or testing.
- **Impact**: If committed, these add ~15MB of binary data to git history permanently. Git is not designed for large binaries. Over time this bloats clone times and CI checkout duration.

#### R-013: No Web Application Firewall (WAF)
- **Finding**: The NGINX ingress has basic rate limiting (`limit-rps: 100`) but no WAF rules. No ModSecurity, no Cloudflare, no AWS WAF equivalent.
- **Impact**: Common web attacks (SQL injection via URL params, XSS in headers, path traversal) are not filtered at the edge.

#### R-014: `force-dynamic` in Root Layout
- **Finding**: `safetrekr-app-v2/src/app/layout.tsx` exports `force-dynamic`, which disables all static generation and caching for the entire Next.js application.
- **Impact**: Every page request hits the server. No ISR, no static pages, no edge caching. This increases latency, server load, and cost. For a travel safety platform where pages like help docs, onboarding, and public pages could be static, this is wasteful.

#### R-015: Multiple `.env` Files with Inconsistent Gitignore Coverage
- **Finding**: 12 `.env` files exist across the monorepo. The root `.gitignore` covers `.env`, `.env.local`, and `.env.*.local`. But the Next.js standalone build output contains a `.env` file at `.next/standalone/safetrekr-app-v2/.env` which may be included in Docker images.
- **Impact**: Secrets could leak via Docker image layers if the build output `.env` is not excluded from the image.

#### R-016: No PodDisruptionBudgets
- **Finding**: Both production deployments run 2 replicas with no PDB defined.
- **Impact**: During node maintenance, both pods could be evicted simultaneously, causing full service downtime.

#### R-017: No HorizontalPodAutoscaler
- **Finding**: Both deployments are fixed at 2 replicas with no autoscaling.
- **Impact**: Traffic spikes (e.g., during an active safety incident when all travelers check alerts simultaneously) will overwhelm the fixed 2-replica deployment. The Core API has tight resource limits (300m CPU, 384Mi memory) that will cause throttling under load.

#### R-018: Migration Hygiene
- **Finding**: The project has accumulated 211 migrations over approximately 5 months, with many containing "fix" in their names, indicating corrective migrations rather than planned schema evolution.
- **Impact**: Migration history becomes difficult to audit. Rolling back to a specific state requires running through potentially broken intermediate states. New developer onboarding requires running 211 migrations sequentially.

### LOW RISKS

#### R-019: TarvaRI Observability Stack Not Connected to Production
- **Finding**: The Prometheus + Grafana + Jaeger stack exists as a local Docker Compose setup only. The Grafana admin password is hardcoded as `admin`. None of this is deployed to or connected with the production K8s cluster.
- **Impact**: Zero visibility into TarvaRI performance, error rates, or alert delivery latency in production. When TarvaRI is deployed to K8s, there will be no monitoring.

#### R-020: No Circuit Breakers for External Service Calls
- **Finding**: Circuit breaker pattern is only documented in `CONNECTOR_FRAMEWORK_README.md` but not implemented in production code. TarvaRI workers make HTTP calls to NOAA, USGS, CDC, ReliefWeb, and GDACS without circuit breakers.
- **Impact**: If an external source becomes slow or unresponsive, the ingest worker blocks on that source, potentially delaying processing of all other sources.

#### R-021: Grafana Default Admin Credentials
- **Finding**: The observability Docker Compose sets `GF_SECURITY_ADMIN_PASSWORD=admin`. While this is currently local-only, if this stack is promoted to production without changing credentials, it becomes a vulnerability.

#### R-022: Docker Compose Version Key Deprecated
- **Finding**: Both `TarvaRI/docker-compose.yml` and `safetrekr-core/docker-compose.yml` use `version: '3.8'` which is deprecated in modern Docker Compose.
- **Impact**: Will generate warnings and may eventually break with future Docker releases.

#### R-023: Container Image Base Not Pinned to Digest
- **Finding**: Dockerfiles use tag-based pulls (`python:3.11-slim`, `node:22-alpine`, `redis:7-alpine`) without SHA256 digest pinning.
- **Impact**: A compromised or updated upstream image could change behavior between builds without any code change.

---

## 4. Enhancement Proposals

### EP-001: Immediate Secret Remediation and Scanning Pipeline

**Problem**: Plaintext Stripe credentials exist in the repository. No automated scanning prevents future incidents. This is the highest-severity finding. (Addresses R-001, R-002)

**Solution**:
1. **Immediate (Day 0)**:
   - Rotate the Stripe password immediately via the Stripe dashboard
   - Enable 2FA on the Stripe account
   - Delete `stripe_creds.md` from disk
   - If ever committed: run `git filter-repo --path stripe_creds.md --invert-paths` to purge from all branches
   - Add `stripe_creds.md` and `*_creds*` to root `.gitignore`

2. **Within 48 hours**:
   - Install `gitleaks` as a pre-commit hook across the monorepo:
     ```yaml
     # .pre-commit-config.yaml (create at repo root)
     repos:
       - repo: https://github.com/gitleaks/gitleaks
         rev: v8.21.2
         hooks:
           - id: gitleaks
     ```
   - Add to root `package.json`:
     ```json
     "scripts": {
       "prepare": "pre-commit install || true"
     }
     ```
   - Run a full historical scan: `gitleaks detect --source . --verbose`

3. **Within 1 week**:
   - Add `gitleaks` as a CI job that runs on every PR
   - Add `.gitleaksignore` for any known false positives
   - Document the secret management policy in a `SECURITY.md` file

**Impact**: Eliminates the most severe vulnerability and prevents all future secret leakage. PCI-DSS compliance requirement.

**Effort**: 2 hours for immediate remediation, 4 hours for pipeline integration.

**Dependencies**: GitHub Actions access, repository admin permissions for history rewrite.

---

### EP-002: CI/CD Security Scanning Pipeline

**Problem**: No SAST, DAST, dependency scanning, or container scanning exists in the pipeline. Vulnerabilities in code or dependencies reach production undetected. (Addresses R-004, R-005, R-023)

**Solution**: Add a `security-scan` job to GitHub Actions that runs on every PR:

```yaml
# .github/workflows/security-scan.yml
name: Security Scan
on: [pull_request]

jobs:
  python-security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install tools
        run: pip install bandit pip-audit safety
      - name: Bandit SAST (Core API)
        run: bandit -r safetrekr-core/src/ -f json -o bandit-core.json || true
      - name: Bandit SAST (TarvaRI)
        run: bandit -r TarvaRI/app/ -f json -o bandit-tarvari.json || true
      - name: Pip Audit (Core API)
        run: cd safetrekr-core && pip-audit -r requirements.txt
      - name: Pip Audit (TarvaRI)
        run: cd TarvaRI && pip-audit -r requirements.txt

  container-security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trivy scan (Core API Dockerfile)
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'config'
          scan-ref: 'safetrekr-core/Dockerfile'
      - name: Trivy scan (TarvaRI Dockerfile)
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'config'
          scan-ref: 'TarvaRI/Dockerfile'

  js-security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm audit --audit-level=high
        working-directory: safetrekr-app-v2
```

Additionally, enable Dependabot or Renovate for automated dependency PRs:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "pip"
    directory: "/safetrekr-core"
    schedule:
      interval: "weekly"
  - package-ecosystem: "pip"
    directory: "/TarvaRI"
    schedule:
      interval: "weekly"
  - package-ecosystem: "npm"
    directory: "/safetrekr-app-v2"
    schedule:
      interval: "weekly"
```

**Impact**: Catches known CVEs before merge. Automated dependency updates reduce the window of vulnerability exposure.

**Effort**: 4 hours for initial setup, 1 hour/week for triaging alerts.

**Dependencies**: GitHub Actions, repository write permissions.

---

### EP-003: Kubernetes Health Probes and Resilience

**Problem**: No liveness or readiness probes in production K8s deployments. No PDBs. Rolling updates cannot verify health. (Addresses R-007, R-016)

**Solution**: Add probes to both deployment manifests.

For `safetrekr-core/k8s/prod/deployment.yaml`:
```yaml
# Add under containers[0]:
livenessProbe:
  httpGet:
    path: /v1/health
    port: 8001
  initialDelaySeconds: 15
  periodSeconds: 30
  timeoutSeconds: 5
  failureThreshold: 3
readinessProbe:
  httpGet:
    path: /v1/health
    port: 8001
  initialDelaySeconds: 5
  periodSeconds: 10
  timeoutSeconds: 3
  failureThreshold: 2
```

For `safetrekr-app-v2/k8s/prod/deployment.yaml`, add a simple TCP probe on port 3000 (or add a `/api/health` route to Next.js):
```yaml
livenessProbe:
  tcpSocket:
    port: 3000
  initialDelaySeconds: 20
  periodSeconds: 30
readinessProbe:
  tcpSocket:
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 10
```

Add PodDisruptionBudgets for both services:
```yaml
# safetrekr-core/k8s/prod/pdb.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: safetrekr-core-pdb
  namespace: prod
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: safetrekr-core
```

**Impact**: K8s can detect and replace unhealthy pods automatically. Rolling updates only proceed when new pods are ready. Node maintenance preserves at least 1 healthy pod.

**Effort**: 2 hours.

**Dependencies**: K8s cluster access, health endpoint verification.

---

### EP-004: TLS Enforcement in Production

**Problem**: SSL redirect is disabled and TLS is commented out in production ingress. (Addresses R-008)

**Solution**:
1. Provision TLS certificates (cert-manager with Let's Encrypt or DigitalOcean-managed):
   ```yaml
   # Install cert-manager if not already present
   # Then add ClusterIssuer for Let's Encrypt
   ```

2. Update both ingress manifests:
   ```yaml
   annotations:
     nginx.ingress.kubernetes.io/ssl-redirect: "true"
     nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
   spec:
     tls:
       - hosts:
           - app.safetrekr.com
         secretName: safetrekr-tls-prod
   ```

3. Add HSTS header:
   ```yaml
   nginx.ingress.kubernetes.io/configuration-snippet: |
     add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
   ```

**Impact**: All production traffic encrypted in transit. Compliance with GDPR, SOC2, and PCI-DSS.

**Effort**: 3 hours (including cert-manager setup).

**Dependencies**: DNS control for domain validation, cert-manager or alternative.

---

### EP-005: EAS Build Stabilization

**Problem**: pnpm workspace + EAS Build incompatibility causes recurring build failures. 5 consecutive commits were EAS fixes. (Addresses R-003)

**Solution**: Isolate the native app's dependency resolution from the monorepo workspace during EAS builds:

1. **Add an EAS build hook** that bundles `core-logic` before the build:
   ```json
   // eas.json
   {
     "build": {
       "production": {
         "extends": "base",
         "prebuildCommand": "cd ../packages/core-logic && pnpm build && cd ../safetrekr-traveler-native && pnpm install --no-frozen-lockfile"
       }
     }
   }
   ```

2. **Alternatively, pre-bundle core-logic** into the native app's `node_modules` using a build script:
   ```bash
   #!/bin/bash
   # scripts/eas-prebuild.sh
   set -euo pipefail
   cd "$(dirname "$0")/.."
   # Build core-logic as a standalone package
   cd packages/core-logic
   pnpm run build
   # Pack it as a tarball
   pnpm pack --pack-destination ../../safetrekr-traveler-native/
   cd ../../safetrekr-traveler-native
   # Install the local tarball
   pnpm add ./safetrekr-core-logic-*.tgz
   ```

3. **Long-term**: Consider using Expo's monorepo support with `expo-yarn-workspaces` or migrating core-logic to a published npm package (private registry).

**Impact**: EAS builds become deterministic. Dependency changes in core-logic do not require manual EAS workarounds.

**Effort**: 4-8 hours for initial implementation + testing.

**Dependencies**: EAS CLI, npm registry (for long-term solution).

---

### EP-006: Rate Limiting Resilience

**Problem**: Rate limiting fails open when Redis is down. Single Redis for cache + rate limiting. (Addresses R-006, R-011)

**Solution**:

1. **In-memory fallback for rate limiting** (immediate fix):
   ```python
   # Add to rate_limit.py
   from collections import defaultdict
   import threading

   class InMemoryRateLimiter:
       """Fallback rate limiter when Redis is unavailable."""
       def __init__(self):
           self._buckets = defaultdict(lambda: {"tokens": 0, "last_update": 0})
           self._lock = threading.Lock()

       def check(self, key: str, limit: int, window: int = 60) -> bool:
           with self._lock:
               now = time.time()
               bucket = self._buckets[key]
               if bucket["last_update"] == 0:
                   bucket["tokens"] = limit - 1
                   bucket["last_update"] = now
                   return True
               elapsed = now - bucket["last_update"]
               bucket["tokens"] = min(limit, bucket["tokens"] + (elapsed / window) * limit)
               bucket["last_update"] = now
               if bucket["tokens"] >= 1:
                   bucket["tokens"] -= 1
                   return True
               return False

   _fallback = InMemoryRateLimiter()
   ```

   Then in the `except` block:
   ```python
   except Exception as e:
       logger.error("Redis rate limit failed, using in-memory fallback", ...)
       if not _fallback.check(rate_limit_key, limit):
           return JSONResponse(status_code=429, ...)
   ```

2. **Redis separation** (medium-term): Use separate Redis instances or at minimum separate Redis databases (`REDIS_DB=0` for cache, `REDIS_DB=1` for rate limiting, `REDIS_DB=2` for job queues).

3. **Redis memory policy** (immediate): Add `maxmemory 256mb` and `maxmemory-policy allkeys-lru` to the Redis command in Docker Compose.

**Impact**: Rate limiting remains functional during Redis outages. Cache eviction is predictable.

**Effort**: 3 hours for in-memory fallback, 2 hours for Redis separation.

**Dependencies**: None for fallback; Redis configuration access for separation.

---

### EP-007: SIGTERM Handler for Delivery and Escalation Workers

**Problem**: Two critical workers (delivery_worker, escalation_worker) lack graceful shutdown handling. In-flight safety alert deliveries can be dropped. (Addresses R-009)

**Solution**: Add signal handlers following the same pattern used by the other 4 workers:

```python
# Add to delivery_worker.py and escalation_worker.py
import signal

class DeliveryWorker:
    def __init__(self):
        self.running = True
        # ... existing init

    async def run(self):
        loop = asyncio.get_event_loop()

        def handle_signal(sig):
            logger.info("delivery_worker_signal_received", signal=sig.name)
            self.running = False

        for sig in (signal.SIGTERM, signal.SIGINT):
            loop.add_signal_handler(sig, lambda s=sig: handle_signal(s))

        while self.running:
            # ... existing poll loop
            await asyncio.sleep(POLL_INTERVAL_SEC)

        logger.info("delivery_worker_shutdown_complete")
```

Also add `stop_grace_period: 30s` to the Docker Compose service definitions for both workers when they are added.

**Impact**: Safety-critical alert deliveries complete before the worker shuts down. Zero dropped alerts during deployments.

**Effort**: 1 hour.

**Dependencies**: None.

---

### EP-008: Doppler Resilience with Secret Caching

**Problem**: Doppler is a hard dependency at container startup. Doppler outage prevents all pod starts and restarts. (Addresses R-010)

**Solution**:

1. **Use Doppler's fallback file feature**:
   ```dockerfile
   # In Dockerfile, add fallback generation during build (dev/staging only):
   # For production, use K8s init container to pre-fetch:
   CMD ["doppler", "run", "--fallback", "/app/.doppler/fallback.env", "--", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8001"]
   ```
   The `--fallback` flag writes a local encrypted copy of secrets. On next start, if Doppler is unreachable, it uses the fallback.

2. **Alternative (K8s-native)**: Use Doppler's Kubernetes Operator to sync secrets to K8s Secrets objects, then mount as environment variables. This decouples container startup from Doppler API availability:
   ```yaml
   apiVersion: secrets.doppler.com/v1alpha1
   kind: DopplerSecret
   metadata:
     name: safetrekr-core-secrets
     namespace: prod
   spec:
     tokenSecret:
       name: doppler-token
     managedSecret:
       name: safetrekr-core-env
       type: Opaque
   ```

**Impact**: Pod restarts succeed even during Doppler outages. Eliminates single point of failure.

**Effort**: 4 hours for fallback approach, 8 hours for K8s operator approach.

**Dependencies**: Doppler CLI version >= 3.x for fallback feature, or Doppler K8s operator.

---

### EP-009: Production Observability for TarvaRI

**Problem**: TarvaRI has local observability infrastructure (Prometheus, Grafana, Jaeger) that is not connected to production. When TarvaRI is deployed to K8s, there will be zero monitoring. (Addresses R-019, R-021)

**Solution**:

1. **Deploy Prometheus + Grafana to K8s** (or use DigitalOcean's managed monitoring):
   - Install `kube-prometheus-stack` via Helm
   - Migrate the existing Grafana dashboard (`alert-delivery-overview.json`) to the K8s Grafana instance
   - Change Grafana admin password to a Doppler-managed secret

2. **Add Prometheus metrics to safetrekr-core**:
   ```python
   # src/middleware/metrics.py
   from prometheus_client import Counter, Histogram, generate_latest
   from starlette.responses import Response

   REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'path', 'status'])
   REQUEST_LATENCY = Histogram('http_request_duration_seconds', 'Request latency', ['method', 'path'])

   # Add /metrics endpoint
   @router.get("/metrics")
   async def metrics():
       return Response(generate_latest(), media_type="text/plain")
   ```

3. **Add alerting rules** for critical paths:
   - Alert delivery latency > 30s
   - Worker heartbeat missing > 2x poll interval
   - Redis connection failures
   - HTTP 5xx rate > 1% over 5 minutes
   - Pod restart count > 3 in 10 minutes

**Impact**: Full production visibility into service health, latency, error rates, and worker status.

**Effort**: 8-16 hours depending on managed vs. self-hosted monitoring.

**Dependencies**: K8s cluster access, Helm.

---

### EP-010: Repository Hygiene

**Problem**: 40+ PNG screenshots at repo root, deprecated Docker Compose version strings, unpinned base images. (Addresses R-012, R-022, R-023)

**Solution**:

1. **Screenshots**: Add `*.png` to root `.gitignore` (or better, move to a shared drive/wiki). Add a `.gitattributes` file with Git LFS tracking if screenshots must be versioned:
   ```
   # .gitattributes
   *.png filter=lfs diff=lfs merge=lfs -text
   ```

2. **Docker Compose**: Remove `version: '3.8'` from `TarvaRI/docker-compose.yml` and `safetrekr-core/docker-compose.yml`.

3. **Image pinning**: Pin Dockerfile base images to digest:
   ```dockerfile
   # Instead of:
   FROM python:3.11-slim
   # Use:
   FROM python:3.11-slim@sha256:<digest>
   ```
   Run `docker pull python:3.11-slim && docker inspect --format='{{index .RepoDigests 0}}' python:3.11-slim` to get the current digest.

**Impact**: Smaller repo, reproducible builds, no deprecation warnings.

**Effort**: 2 hours.

**Dependencies**: Git LFS if using LFS approach for images.

---

## 5. Architecture Recommendations

### 5.1 Redis Topology

**Current**: Single Redis 7 Alpine instance shared by safetrekr-core (cache + rate limiting) and TarvaRI (cache + job queues).

**Recommended**:
```
Redis Instance 1 (safetrekr-redis):
  DB 0: safetrekr-core cache (TTL-based, LRU eviction)
  DB 1: safetrekr-core rate limiting (no eviction)

Redis Instance 2 (tarvari-redis):
  DB 0: TarvaRI cache
  DB 1: TarvaRI job queues (RQ)
```

Both should have `maxmemory` set and appropriate eviction policies. For production K8s, consider DigitalOcean Managed Redis or Redis Sentinel for HA.

### 5.2 TarvaRI K8s Deployment Plan

TarvaRI is currently Docker Compose only. When deploying to K8s:

1. Create `TarvaRI/k8s/{dev,prod}/` directory structure mirroring safetrekr-core
2. Deploy the API as a Deployment with 2 replicas
3. Deploy each worker as a separate Deployment with 1 replica (they are single-consumer by design)
4. Add SIGTERM handlers to delivery_worker and escalation_worker first (EP-007)
5. Use separate Redis in the same namespace
6. Add liveness probes on `/health` for the API, and a sidecar healthcheck for workers (write heartbeat to Redis, check via exec probe)
7. Set `stop_grace_period` to 30s for all workers

### 5.3 Next.js Caching Strategy

**Current**: `export const dynamic = "force-dynamic"` in root layout disables all caching.

**Recommended**: Remove the global `force-dynamic` and apply it selectively:
- Keep `force-dynamic` on authenticated API routes and pages that require real-time data (trip detail, alerts, dashboard)
- Allow static generation for: help pages, onboarding flows, public marketing pages, component playground
- Add ISR (Incremental Static Regeneration) for semi-static pages like organization settings
- This alone could reduce server load by 30-50% for non-authenticated traffic

### 5.4 Security Headers

Add to NGINX ingress as a configuration snippet:

```yaml
nginx.ingress.kubernetes.io/configuration-snippet: |
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=(self)" always;
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co;" always;
```

### 5.5 Ingress Network Policy

Add a NetworkPolicy that restricts pod-to-pod communication:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: safetrekr-core-netpol
  namespace: prod
spec:
  podSelector:
    matchLabels:
      app: safetrekr-core
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: ingress-nginx
      ports:
        - port: 8001
  egress:
    - to: []  # Allow all egress (Supabase, Doppler, SendGrid, etc.)
```

---

## 6. Priority Recommendations

### Tier 1: Do This Week (CRITICAL + Quick HIGH wins)

| # | Action | Risk Addressed | Effort | Owner |
|---|--------|---------------|--------|-------|
| 1 | Rotate Stripe credentials, delete `stripe_creds.md`, scrub git history | R-001 | 1 hour | Lead Dev |
| 2 | Install gitleaks pre-commit hook | R-002 | 1 hour | Lead Dev |
| 3 | Enable TLS on production ingress | R-008 | 3 hours | DevOps |
| 4 | Add SIGTERM handlers to delivery_worker + escalation_worker | R-009 | 1 hour | Backend Dev |
| 5 | Add liveness/readiness probes to K8s deployments | R-007 | 2 hours | DevOps |

**Total Tier 1 effort**: ~8 hours

### Tier 2: Do Within 2 Weeks (HIGH risks)

| # | Action | Risk Addressed | Effort |
|---|--------|---------------|--------|
| 6 | Add security scanning CI job (bandit, pip-audit, Trivy, pnpm audit) | R-004, R-005 | 4 hours |
| 7 | Enable Dependabot for all package ecosystems | R-005 | 1 hour |
| 8 | Add in-memory rate limiting fallback | R-006 | 3 hours |
| 9 | Add PodDisruptionBudgets | R-016 | 1 hour |
| 10 | Configure Redis maxmemory and eviction policy | R-011 | 1 hour |
| 11 | Add security headers to NGINX ingress | Section 5.4 | 1 hour |
| 12 | Add Doppler fallback file to CMD | R-010 | 2 hours |

**Total Tier 2 effort**: ~13 hours

### Tier 3: Do Within 1 Month (MEDIUM risks)

| # | Action | Risk Addressed | Effort |
|---|--------|---------------|--------|
| 13 | Stabilize EAS build with prebuild hook | R-003 | 8 hours |
| 14 | Remove `force-dynamic` from root layout, apply selectively | R-014 | 4 hours |
| 15 | Separate Redis instances (or at minimum databases) | R-011 | 4 hours |
| 16 | Add HPA for safetrekr-core and safetrekr-app-v2 | R-017 | 3 hours |
| 17 | Clean up PNG screenshots, add .gitattributes or .gitignore rules | R-012 | 1 hour |
| 18 | Audit and consolidate .env files, verify Docker image exclusion | R-015 | 2 hours |
| 19 | Add NetworkPolicies to K8s namespace | Section 5.5 | 3 hours |
| 20 | Squash/consolidate migration history | R-018 | 4 hours |

**Total Tier 3 effort**: ~29 hours

### Tier 4: Next Quarter (LOW risks + scaling)

| # | Action | Risk Addressed | Effort |
|---|--------|---------------|--------|
| 21 | Deploy TarvaRI to K8s with full observability | R-019, Section 5.2 | 16 hours |
| 22 | Implement circuit breakers for TarvaRI external calls | R-020 | 8 hours |
| 23 | Pin Docker base images to SHA256 digests | R-023 | 2 hours |
| 24 | Evaluate WAF (ModSecurity or cloud-native) | R-013 | 8 hours |
| 25 | Add Prometheus metrics to safetrekr-core | EP-009 | 8 hours |

**Total Tier 4 effort**: ~42 hours

---

## Appendix A: Files Referenced

| File | Relevance |
|------|-----------|
| `/stripe_creds.md` | CRITICAL: Plaintext Stripe credentials |
| `/.gitignore` | Root gitignore -- missing `*_creds*` pattern |
| `/docker-compose.yml` | Master compose with shared Redis |
| `/TarvaRI/docker-compose.yml` | TarvaRI-specific compose with deprecated version key |
| `/safetrekr-core/docker-compose.yml` | Core API compose with deprecated version key |
| `/TarvaRI/Dockerfile` | Non-root user, no digest pinning |
| `/safetrekr-core/Dockerfile` | Doppler entrypoint, non-root user |
| `/safetrekr-app-v2/Dockerfile` | Multi-stage build, Doppler entrypoint |
| `/safetrekr-core/k8s/prod/deployment.yaml` | No probes, no PDB |
| `/safetrekr-app-v2/k8s/prod/deployment.yaml` | No probes, no PDB |
| `/safetrekr-core/k8s/prod/ingress.yaml` | ssl-redirect false |
| `/safetrekr-app-v2/k8s/prod/ingress.yaml` | TLS commented out |
| `/safetrekr-core/src/middleware/rate_limit.py` | Fails open on Redis failure |
| `/TarvaRI/app/workers/delivery_worker.py` | No SIGTERM handler |
| `/TarvaRI/app/workers/escalation_worker.py` | No SIGTERM handler |
| `/safetrekr-traveler-native/eas.json` | EAS build config |
| `/TarvaRI/observability/docker-compose.yml` | Local-only observability stack |
| `/package.json` | Root monorepo config, no pre-commit hooks |

---

*Analysis produced 2026-03-17. Findings are based on static code review and configuration analysis. Runtime behavior may differ.*
