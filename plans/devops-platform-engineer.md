# DevOps & Platform Engineer PRD: SafeTrekr Marketing Site

**Date**: 2026-03-24
**Author**: DevOps Platform Engineer (Persona PRD)
**Project**: SafeTrekr Marketing Website -- Infrastructure & Deployment
**Stack**: Docker (Next.js standalone) / DigitalOcean DOKS / GitHub Actions / Cloudflare DNS / Nginx Ingress / cert-manager / Supabase (external)
**Mode**: Greenfield -- Pre-Implementation Infrastructure Specification
**Binding Constraint**: All decisions align with `plans/TECH-STACK.md`. No Vercel. No serverless. Containers on Kubernetes.

---

## Table of Contents

1. [Infrastructure Overview](#1-infrastructure-overview)
2. [FR-INFRA-001: Dockerfile](#2-fr-infra-001-dockerfile)
3. [FR-INFRA-002: Docker Compose Local Development](#3-fr-infra-002-docker-compose-local-development)
4. [FR-INFRA-003: DigitalOcean DOKS Cluster](#4-fr-infra-003-digitalocean-doks-cluster)
5. [FR-INFRA-004: DigitalOcean Container Registry](#5-fr-infra-004-digitalocean-container-registry)
6. [FR-INFRA-005: Kubernetes Manifests](#6-fr-infra-005-kubernetes-manifests)
7. [FR-INFRA-006: Nginx Ingress Controller & SSL](#7-fr-infra-006-nginx-ingress-controller--ssl)
8. [FR-INFRA-007: GitHub Actions CI/CD Pipeline](#8-fr-infra-007-github-actions-cicd-pipeline)
9. [FR-INFRA-008: Environment Management](#9-fr-infra-008-environment-management)
10. [FR-INFRA-009: Preview Deployments](#10-fr-infra-009-preview-deployments)
11. [FR-INFRA-010: DNS & CDN Configuration](#11-fr-infra-010-dns--cdn-configuration)
12. [FR-INFRA-011: Monitoring & Alerting](#12-fr-infra-011-monitoring--alerting)
13. [FR-INFRA-012: Centralized Logging](#13-fr-infra-012-centralized-logging)
14. [FR-INFRA-013: Security Hardening](#14-fr-infra-013-security-hardening)
15. [FR-INFRA-014: Backup & Disaster Recovery](#15-fr-infra-014-backup--disaster-recovery)
16. [FR-INFRA-015: Cost Estimation](#16-fr-infra-015-cost-estimation)
17. [Infrastructure Directory Structure](#17-infrastructure-directory-structure)
18. [Rollback Strategy](#18-rollback-strategy)
19. [Operational Runbooks](#19-operational-runbooks)
20. [Risk Register](#20-risk-register)

---

## 1. Infrastructure Overview

### 1.1 Architecture Context

The CTA (Chief Technology Architect) analysis was written assuming Vercel deployment. This PRD replaces the entire infrastructure layer with a container-based Kubernetes deployment on DigitalOcean. The application layer (Next.js 15, React 19, Tailwind CSS 4, all components) remains identical. Only the deployment target, build pipeline, SSL termination, CDN strategy, scaling mechanism, and observability stack change.

### 1.2 High-Level Deployment Architecture

```
Developer Push --> GitHub Actions CI/CD
  --> Lint + Type Check + Test + Accessibility Check
  --> Docker Build (multi-stage, Next.js standalone output)
  --> Push to DigitalOcean Container Registry (DOCR)
  --> kubectl apply to DOKS cluster
  --> Nginx Ingress Controller (SSL via cert-manager + Let's Encrypt)
  --> Cloudflare DNS (proxy mode for DDoS + CDN)
  --> End Users
```

### 1.3 Key Differences from Vercel Deployment

| Concern | Vercel (CTA Analysis) | DigitalOcean DOKS (This PRD) |
|---------|----------------------|------------------------------|
| SSG/ISR | Native Vercel ISR | Next.js standalone server with file-system ISR cache |
| Edge Functions | Vercel Edge Runtime | Not available; all middleware runs in Node.js |
| Image Optimization | Vercel built-in loader | `sharp` package in Docker image (self-hosted next/image) |
| Preview Deploys | Automatic per-PR | Custom: namespace-per-PR via GitHub Actions |
| SSL Certificates | Automatic (Vercel) | cert-manager + Let's Encrypt ClusterIssuer |
| Scaling | Automatic (Vercel) | HPA based on CPU/memory + custom metrics |
| CDN | Vercel Edge Network (200+ PoPs) | Cloudflare proxy (300+ PoPs) + DO Spaces for static assets |
| Rollback | Instant (Vercel dashboard) | `kubectl rollout undo` or redeploy previous image tag |
| Cost Model | Usage-based | Fixed monthly (nodes + registry + bandwidth) |
| OG Image Generation | Vercel `@vercel/og` (Edge) | `@vercel/og` with Node.js adapter or Satori + sharp |
| Monitoring | Vercel Analytics | Prometheus + Grafana or DigitalOcean Monitoring |
| Logs | Vercel Log Drains | Loki + Fluent Bit or DO log forwarding |

### 1.4 Non-Negotiable Constraints

1. The Docker image MUST use Next.js `output: 'standalone'` for minimal container size.
2. The `sharp` package MUST be installed for self-hosted image optimization.
3. All secrets MUST be stored in Kubernetes Secrets (not ConfigMaps, not hardcoded).
4. SSL MUST be automated via cert-manager -- no manual certificate management.
5. The CI pipeline MUST block merge on lint, type-check, test, accessibility, and bundle size failures.
6. Production deployments MUST be zero-downtime (rolling update strategy).
7. Every environment (dev, staging, production) MUST use the same Docker image with environment-specific configuration injected at runtime.
8. The Supabase database is externally managed -- this PRD does not provision or manage the database, only configures network access to it.

---

## 2. FR-INFRA-001: Dockerfile

**Priority**: P0
**Effort**: 1 day
**Description**: Multi-stage Docker build optimized for Next.js standalone output with sharp for image optimization.

### 2.1 Dockerfile Specification

```dockerfile
# ============================================================
# Stage 1: Install dependencies
# ============================================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package manager files
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# ============================================================
# Stage 2: Build the application
# ============================================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects anonymous telemetry -- disable in CI
ENV NEXT_TELEMETRY_DISABLED=1

# Build arguments for build-time environment variables
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_PLAUSIBLE_DOMAIN
ARG NEXT_PUBLIC_SITE_URL

ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_PLAUSIBLE_DOMAIN=$NEXT_PUBLIC_PLAUSIBLE_DOMAIN
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN corepack enable pnpm && pnpm build

# ============================================================
# Stage 3: Production runner
# ============================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### 2.2 next.config.ts Required Settings

```typescript
const nextConfig: NextConfig = {
  output: 'standalone', // CRITICAL: enables standalone server output for Docker

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // sharp is required in the Docker image for self-hosted optimization
    // Next.js auto-detects sharp when installed
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.maptiler.com',
      },
    ],
  },

  // ... rest of config from CTA analysis
}
```

### 2.3 .dockerignore

```
node_modules
.next
.git
.github
*.md
docker-compose*.yml
.env*
.vscode
coverage
.turbo
```

### 2.4 Image Size Budget

| Metric | Target | Enforcement |
|--------|--------|-------------|
| Final image size | < 200 MB | CI check via `docker inspect` |
| Number of layers | < 15 | Dockerfile lint (`hadolint`) |
| Base image | `node:20-alpine` | Pinned in Dockerfile |
| Non-root user | Required | `USER nextjs` directive |

### 2.5 Acceptance Criteria

- [ ] `docker build` succeeds with zero warnings.
- [ ] Final image runs `node server.js` as non-root user (UID 1001).
- [ ] `next/image` optimization works (serve an optimized image via `/_next/image`).
- [ ] ISR pages regenerate correctly from the standalone server.
- [ ] Health check endpoint (`/api/health`) returns 200.
- [ ] Image size is under 200 MB.
- [ ] `hadolint` passes with zero errors.

---

## 3. FR-INFRA-002: Docker Compose Local Development

**Priority**: P0
**Effort**: 0.5 days
**Description**: Local development environment that mirrors production topology without requiring a Kubernetes cluster.

### 3.1 docker-compose.yml

```yaml
version: "3.9"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: runner
      args:
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: ${NEXT_PUBLIC_TURNSTILE_SITE_KEY:-1x00000000000000000000AA}
        NEXT_PUBLIC_PLAUSIBLE_DOMAIN: ""
        NEXT_PUBLIC_SITE_URL: http://localhost:3000
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SENDGRID_API_KEY=${SENDGRID_API_KEY:-SG.test}
      - TURNSTILE_SECRET_KEY=${TURNSTILE_SECRET_KEY:-1x0000000000000000000000000000000AA}
      - NEXT_PUBLIC_TURNSTILE_SITE_KEY=${NEXT_PUBLIC_TURNSTILE_SITE_KEY:-1x00000000000000000000AA}
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
    restart: unless-stopped

  # Optional: Nginx reverse proxy to test production-like routing
  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./infra/nginx/local.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      app:
        condition: service_healthy
    profiles:
      - with-nginx
```

### 3.2 docker-compose.dev.yml (Development Override)

```yaml
version: "3.9"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    command: pnpm dev
```

### 3.3 Dockerfile.dev (Hot Reload)

```dockerfile
FROM node:20-alpine
WORKDIR /app
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]
```

### 3.4 Acceptance Criteria

- [ ] `docker compose up` starts the production image and responds on port 3000.
- [ ] `docker compose -f docker-compose.yml -f docker-compose.dev.yml up` starts dev mode with hot reload.
- [ ] `docker compose --profile with-nginx up` starts Nginx reverse proxy on port 8080.
- [ ] Health check passes within 15 seconds of container start.
- [ ] Environment variables are injected correctly (verified via `/api/health`).

---

## 4. FR-INFRA-003: DigitalOcean DOKS Cluster

**Priority**: P0
**Effort**: 0.5 days
**Description**: Provision a managed Kubernetes cluster on DigitalOcean optimized for a marketing site workload (low CPU, moderate memory, high network throughput for static asset serving).

### 4.1 Cluster Specification

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Cluster name | `safetrekr-marketing` | Clear naming convention |
| Region | `nyc1` (New York) | Co-locate with Supabase US East |
| Kubernetes version | 1.31.x (latest stable) | LTS support from DO |
| VPC | Default VPC in nyc1 | Network isolation |
| HA Control Plane | Enabled ($0 additional) | Production reliability |

### 4.2 Node Pool Configuration

| Pool | Purpose | Node Size | Count | Autoscale | Min | Max |
|------|---------|-----------|-------|-----------|-----|-----|
| `general` | Application workloads | `s-2vcpu-4gb` ($24/mo each) | 2 | Yes | 2 | 4 |

**Why 2 nodes minimum**: Zero-downtime rolling updates require at least 2 nodes. During a deployment, pods on the old version continue serving while new pods start on the second node. A single-node cluster would experience downtime during rollout.

**Why `s-2vcpu-4gb`**: Next.js standalone server with sharp image optimization is memory-intensive during image processing. 4 GB RAM per node provides headroom for 2-3 pods per node plus system workloads (Ingress controller, cert-manager, monitoring agents).

### 4.3 Autoscaling Policy

```yaml
# Node pool autoscaling triggers
Scale Up:
  - Pending pods that cannot be scheduled for > 30 seconds
  - Node CPU utilization > 70% for 5 minutes across the pool
  - Node memory utilization > 80% for 5 minutes across the pool

Scale Down:
  - Node utilization < 35% for 10 minutes
  - No pods with local storage or PodDisruptionBudget violations
  - Minimum 2 nodes maintained at all times
```

### 4.4 Cluster Add-ons (Installed at Provisioning)

| Add-on | Purpose | Method |
|--------|---------|--------|
| Nginx Ingress Controller | HTTP routing + SSL termination | DO 1-Click or Helm |
| cert-manager | Automated Let's Encrypt certificates | Helm |
| metrics-server | HPA resource metrics | DO 1-Click |

### 4.5 Provisioning Commands

```bash
# Create the cluster
doctl kubernetes cluster create safetrekr-marketing \
  --region nyc1 \
  --version 1.31.1-do.0 \
  --node-pool "name=general;size=s-2vcpu-4gb;count=2;auto-scale=true;min-nodes=2;max-nodes=4" \
  --ha \
  --tag safetrekr,marketing,production

# Save kubeconfig
doctl kubernetes cluster kubeconfig save safetrekr-marketing

# Verify cluster
kubectl get nodes
```

### 4.6 Namespace Strategy

| Namespace | Purpose |
|-----------|---------|
| `production` | Live site serving `safetrekr.com` |
| `staging` | Pre-production validation at `staging.safetrekr.com` |
| `preview` | Ephemeral PR preview deployments |
| `ingress-nginx` | Nginx Ingress Controller (isolated) |
| `cert-manager` | Certificate management (isolated) |
| `monitoring` | Prometheus + Grafana (isolated) |

```bash
kubectl create namespace production
kubectl create namespace staging
kubectl create namespace preview
```

### 4.7 Acceptance Criteria

- [ ] `kubectl get nodes` returns 2 ready nodes.
- [ ] `kubectl cluster-info` shows a healthy control plane.
- [ ] All namespaces created and verified.
- [ ] Autoscaling triggers correctly (test with a resource-heavy pod).
- [ ] Cluster is tagged with `safetrekr`, `marketing`, `production`.
- [ ] `doctl kubernetes cluster kubeconfig save` works from CI runner.

---

## 5. FR-INFRA-004: DigitalOcean Container Registry

**Priority**: P0
**Effort**: 0.5 days
**Description**: Private container registry for storing Docker images used by the DOKS cluster.

### 5.1 Registry Configuration

| Parameter | Value |
|-----------|-------|
| Registry name | `safetrekr` |
| Plan | Starter ($5/mo, 5 GB storage) |
| Region | Auto (closest to cluster) |
| Image repository | `safetrekr/marketing` |

### 5.2 Image Tagging Strategy

| Tag Pattern | Purpose | Example |
|-------------|---------|---------|
| `sha-<short_sha>` | Immutable per-commit tag | `sha-a1b2c3d` |
| `latest` | Most recent production build | Rolling |
| `staging` | Current staging build | Rolling |
| `pr-<number>` | Preview deployment image | `pr-42` |

Every production deployment uses the immutable `sha-<short_sha>` tag, never `latest`. The `latest` tag exists only as a convenience for local testing.

### 5.3 Registry Cleanup Policy

```bash
# Retain last 30 images; delete older ones
# Run weekly via GitHub Actions scheduled workflow
doctl registry garbage-collection start safetrekr --force
```

Automated cleanup via GitHub Actions cron job (weekly, Sunday 3 AM UTC):
- Keep: All images tagged with `sha-*` from the last 30 days.
- Keep: `latest` and `staging` tags.
- Delete: `pr-*` tags older than 7 days.
- Delete: Untagged manifests.

### 5.4 DOKS Integration

```bash
# Grant the DOKS cluster access to the registry
doctl registry kubernetes-manifest | kubectl apply -f -

# Verify image pull works
kubectl run test --image=registry.digitalocean.com/safetrekr/marketing:latest --rm -it --restart=Never -- echo "pull works"
```

### 5.5 Acceptance Criteria

- [ ] `docker push registry.digitalocean.com/safetrekr/marketing:test` succeeds.
- [ ] DOKS cluster can pull images without explicit `imagePullSecrets`.
- [ ] Garbage collection runs without errors.
- [ ] Image tags follow the defined strategy.

---

## 6. FR-INFRA-005: Kubernetes Manifests

**Priority**: P0
**Effort**: 2 days
**Description**: Complete set of Kubernetes resource definitions for deploying the marketing site.

### 6.1 Deployment

```yaml
# infra/k8s/base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: safetrekr-marketing
  labels:
    app: safetrekr-marketing
    team: marketing
    tier: frontend
spec:
  replicas: 2
  revisionHistoryLimit: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: safetrekr-marketing
  template:
    metadata:
      labels:
        app: safetrekr-marketing
        team: marketing
        tier: frontend
    spec:
      serviceAccountName: safetrekr-marketing
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        runAsGroup: 1001
        fsGroup: 1001
        seccompProfile:
          type: RuntimeDefault
      containers:
        - name: nextjs
          image: registry.digitalocean.com/safetrekr/marketing:IMAGE_TAG
          ports:
            - containerPort: 3000
              protocol: TCP
              name: http
          envFrom:
            - configMapRef:
                name: safetrekr-marketing-config
            - secretRef:
                name: safetrekr-marketing-secrets
          resources:
            requests:
              cpu: 100m
              memory: 256Mi
            limits:
              cpu: 500m
              memory: 512Mi
          livenessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 15
            periodSeconds: 30
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
            timeoutSeconds: 3
            failureThreshold: 3
          startupProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
            failureThreshold: 12
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: false  # Next.js needs to write ISR cache
            capabilities:
              drop:
                - ALL
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              app: safetrekr-marketing
```

### 6.2 Service

```yaml
# infra/k8s/base/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: safetrekr-marketing
  labels:
    app: safetrekr-marketing
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: 3000
      protocol: TCP
      name: http
  selector:
    app: safetrekr-marketing
```

### 6.3 Ingress

```yaml
# infra/k8s/overlays/production/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: safetrekr-marketing
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-production
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
    nginx.ingress.kubernetes.io/configuration-snippet: |
      more_set_headers "X-Frame-Options: DENY";
      more_set_headers "X-Content-Type-Options: nosniff";
      more_set_headers "Referrer-Policy: strict-origin-when-cross-origin";
      more_set_headers "Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()";
    # Enable gzip compression at Ingress level
    nginx.ingress.kubernetes.io/enable-gzip: "true"
    nginx.ingress.kubernetes.io/gzip-types: "text/html text/css application/javascript application/json image/svg+xml"
    # Proxy timeouts
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "10"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "30"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "30"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - safetrekr.com
        - www.safetrekr.com
      secretName: safetrekr-marketing-tls
  rules:
    - host: safetrekr.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: safetrekr-marketing
                port:
                  number: 80
    - host: www.safetrekr.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: safetrekr-marketing
                port:
                  number: 80
```

### 6.4 Horizontal Pod Autoscaler

```yaml
# infra/k8s/base/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: safetrekr-marketing
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: safetrekr-marketing
  minReplicas: 2
  maxReplicas: 6
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Pods
          value: 2
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 25
          periodSeconds: 120
```

### 6.5 ConfigMap

```yaml
# infra/k8s/overlays/production/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: safetrekr-marketing-config
data:
  NODE_ENV: "production"
  NEXT_PUBLIC_SITE_URL: "https://safetrekr.com"
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: "safetrekr.com"
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "<production-site-key>"
  PORT: "3000"
  HOSTNAME: "0.0.0.0"
```

### 6.6 Secret (Template -- Values Injected by CI)

```yaml
# infra/k8s/base/secret.yaml (template -- never commit actual values)
apiVersion: v1
kind: Secret
metadata:
  name: safetrekr-marketing-secrets
type: Opaque
stringData:
  SUPABASE_URL: "<injected-by-ci>"
  SUPABASE_ANON_KEY: "<injected-by-ci>"
  SUPABASE_SERVICE_ROLE_KEY: "<injected-by-ci>"
  SENDGRID_API_KEY: "<injected-by-ci>"
  TURNSTILE_SECRET_KEY: "<injected-by-ci>"
  SENTRY_DSN: "<injected-by-ci>"
```

### 6.7 PodDisruptionBudget

```yaml
# infra/k8s/base/pdb.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: safetrekr-marketing
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: safetrekr-marketing
```

### 6.8 ServiceAccount

```yaml
# infra/k8s/base/serviceaccount.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: safetrekr-marketing
  labels:
    app: safetrekr-marketing
automountServiceAccountToken: false
```

### 6.9 Acceptance Criteria

- [ ] `kubectl apply -k infra/k8s/overlays/production` succeeds.
- [ ] Deployment creates 2 pods that pass readiness checks within 30 seconds.
- [ ] Rolling update replaces all pods with zero downtime (tested with `wrk` during rollout).
- [ ] HPA scales to 3 pods under load (tested with `k6` or `hey`).
- [ ] PodDisruptionBudget prevents voluntary eviction of all pods simultaneously.
- [ ] Pods spread across both nodes (topologySpreadConstraints).
- [ ] All containers run as non-root (verified with `kubectl exec -- id`).

---

## 7. FR-INFRA-006: Nginx Ingress Controller & SSL

**Priority**: P0
**Effort**: 1 day
**Description**: HTTP routing, SSL termination, and TLS certificate automation.

### 7.1 Nginx Ingress Installation

```bash
# Install via Helm (preferred over DO 1-Click for version control)
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.replicaCount=2 \
  --set controller.resources.requests.cpu=100m \
  --set controller.resources.requests.memory=128Mi \
  --set controller.resources.limits.cpu=200m \
  --set controller.resources.limits.memory=256Mi \
  --set controller.service.type=LoadBalancer \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/do-loadbalancer-name"="safetrekr-marketing-lb" \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/do-loadbalancer-size-slug"="lb-small" \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/do-loadbalancer-protocol"="http" \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/do-loadbalancer-tls-ports"="" \
  --set controller.config.use-forwarded-headers="true" \
  --set controller.config.compute-full-forwarded-for="true" \
  --set controller.config.use-proxy-protocol="false" \
  --set controller.config.enable-gzip="true" \
  --set controller.config.gzip-level="5" \
  --set controller.config.gzip-types="application/javascript application/json text/css text/html text/plain image/svg+xml"
```

**Why SSL termination at Ingress, not at Cloudflare**: Cloudflare is configured in "Full (Strict)" mode, meaning Cloudflare terminates the visitor's TLS connection and re-encrypts to the origin. The Ingress controller holds a valid Let's Encrypt certificate so Cloudflare can verify the origin. This is the recommended setup for maximum security.

### 7.2 cert-manager Installation

```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update

helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set crds.enabled=true \
  --set resources.requests.cpu=50m \
  --set resources.requests.memory=64Mi
```

### 7.3 ClusterIssuer (Let's Encrypt)

```yaml
# infra/k8s/cluster/clusterissuer-production.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-production
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: devops@safetrekr.com
    privateKeySecretRef:
      name: letsencrypt-production-key
    solvers:
      - http01:
          ingress:
            class: nginx

---
# Staging issuer for testing (higher rate limits)
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: devops@safetrekr.com
    privateKeySecretRef:
      name: letsencrypt-staging-key
    solvers:
      - http01:
          ingress:
            class: nginx
```

### 7.4 Load Balancer Configuration

The Nginx Ingress controller creates a DigitalOcean Load Balancer automatically. Configuration:

| Parameter | Value |
|-----------|-------|
| Type | `lb-small` ($12/mo) |
| Algorithm | Round Robin |
| Health check path | `/healthz` (Ingress controller) |
| Health check interval | 10 seconds |
| Sticky sessions | Disabled (stateless app) |
| Proxy protocol | Disabled (Cloudflare handles it) |

### 7.5 Nginx Custom Configuration

```yaml
# Additional Nginx ConfigMap settings
apiVersion: v1
kind: ConfigMap
metadata:
  name: ingress-nginx-controller
  namespace: ingress-nginx
data:
  # Performance
  worker-processes: "auto"
  max-worker-connections: "65536"
  keep-alive: "75"
  keep-alive-requests: "1000"

  # Security
  ssl-protocols: "TLSv1.2 TLSv1.3"
  ssl-ciphers: "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384"
  ssl-prefer-server-ciphers: "true"
  hsts: "true"
  hsts-max-age: "31536000"
  hsts-include-subdomains: "true"
  hsts-preload: "true"

  # Compression
  enable-brotli: "true"
  brotli-level: "6"
  brotli-types: "text/html text/css application/javascript application/json image/svg+xml"

  # Proxy
  proxy-buffer-size: "16k"
  proxy-buffers-number: "4"
  client-max-body-size: "10m"

  # Rate limiting (global default)
  limit-req-status-code: "429"

  # Logging
  log-format-upstream: '$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" $request_length $request_time [$proxy_upstream_name] [$proxy_alternative_upstream_name] $upstream_addr $upstream_response_length $upstream_response_time $upstream_status $req_id'
```

### 7.6 Acceptance Criteria

- [ ] `kubectl get svc -n ingress-nginx` shows an EXTERNAL-IP assigned by DO Load Balancer.
- [ ] HTTPS request to `safetrekr.com` returns a valid Let's Encrypt certificate.
- [ ] HTTP to HTTPS redirect works (301 status code).
- [ ] `www.safetrekr.com` redirects to `safetrekr.com` (301).
- [ ] Brotli/gzip compression is active (verified via `curl -H "Accept-Encoding: br"`).
- [ ] Rate limiting returns 429 when exceeded.
- [ ] cert-manager auto-renews certificates before expiry (test with staging issuer).

---

## 8. FR-INFRA-007: GitHub Actions CI/CD Pipeline

**Priority**: P0
**Effort**: 2 days
**Description**: Complete CI/CD pipeline from code push to production deployment.

### 8.1 Pipeline Overview

```
PR opened/updated:
  --> ci.yml: Lint, Type Check, Test, Accessibility, Bundle Size, Lighthouse
  --> preview.yml: Build Docker image, deploy to preview namespace

Merge to staging:
  --> deploy-staging.yml: Build, push, deploy to staging namespace

Merge to main:
  --> deploy-production.yml: Build, push, deploy to production namespace
  --> post-deploy.yml: Smoke tests, Sentry release, health verification

Scheduled:
  --> cleanup.yml: Weekly registry garbage collection + preview namespace cleanup
```

### 8.2 CI Workflow (ci.yml)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main, staging]
  push:
    branches: [main, staging]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint-and-typecheck:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run lint
      - run: pnpm run typecheck

  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run test -- --coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  accessibility:
    name: Accessibility Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run test:a11y

  bundle-analysis:
    name: Bundle Size Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA"
          NEXT_PUBLIC_PLAUSIBLE_DOMAIN: ""
          NEXT_PUBLIC_SITE_URL: "https://safetrekr.com"
      - uses: siddharthkp/bundlewatch-gh-action@v1
        with:
          bundlewatch-github-token: ${{ secrets.GITHUB_TOKEN }}

  docker-build-test:
    name: Docker Build Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: false
          load: true
          tags: safetrekr-marketing:test
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
            NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
            NEXT_PUBLIC_SITE_URL=https://safetrekr.com
      - name: Verify image size
        run: |
          SIZE=$(docker inspect safetrekr-marketing:test --format='{{.Size}}')
          MAX_SIZE=209715200  # 200 MB
          if [ "$SIZE" -gt "$MAX_SIZE" ]; then
            echo "Image size ${SIZE} exceeds maximum ${MAX_SIZE}"
            exit 1
          fi
      - name: Test container starts
        run: |
          docker run -d --name test-container -p 3000:3000 safetrekr-marketing:test
          sleep 10
          curl -f http://localhost:3000/api/health || exit 1
          docker stop test-container
```

### 8.3 Deploy Production Workflow (deploy-production.yml)

```yaml
# .github/workflows/deploy-production.yml
name: Deploy Production

on:
  push:
    branches: [main]

concurrency:
  group: deploy-production
  cancel-in-progress: false  # Never cancel a production deployment mid-flight

env:
  REGISTRY: registry.digitalocean.com/safetrekr
  IMAGE: marketing
  CLUSTER: safetrekr-marketing

jobs:
  build-and-push:
    name: Build & Push Image
    runs-on: ubuntu-latest
    outputs:
      image_tag: ${{ steps.meta.outputs.tags }}
      short_sha: ${{ steps.sha.outputs.short_sha }}
    steps:
      - uses: actions/checkout@v4

      - name: Get short SHA
        id: sha
        run: echo "short_sha=$(git rev-parse --short HEAD)" >> $GITHUB_OUTPUT

      - uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

      - name: Log in to DOCR
        run: doctl registry login --expiry-seconds 600

      - uses: docker/setup-buildx-action@v3

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE }}:sha-${{ steps.sha.outputs.short_sha }}
            ${{ env.REGISTRY }}/${{ env.IMAGE }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            NEXT_PUBLIC_TURNSTILE_SITE_KEY=${{ secrets.PROD_TURNSTILE_SITE_KEY }}
            NEXT_PUBLIC_PLAUSIBLE_DOMAIN=safetrekr.com
            NEXT_PUBLIC_SITE_URL=https://safetrekr.com

  deploy:
    name: Deploy to Production
    needs: build-and-push
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://safetrekr.com
    steps:
      - uses: actions/checkout@v4

      - uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

      - name: Save kubeconfig
        run: doctl kubernetes cluster kubeconfig save ${{ env.CLUSTER }}

      - name: Update secrets
        run: |
          kubectl create secret generic safetrekr-marketing-secrets \
            --namespace production \
            --from-literal=SUPABASE_URL=${{ secrets.PROD_SUPABASE_URL }} \
            --from-literal=SUPABASE_ANON_KEY=${{ secrets.PROD_SUPABASE_ANON_KEY }} \
            --from-literal=SUPABASE_SERVICE_ROLE_KEY=${{ secrets.PROD_SUPABASE_SERVICE_ROLE_KEY }} \
            --from-literal=SENDGRID_API_KEY=${{ secrets.PROD_SENDGRID_API_KEY }} \
            --from-literal=TURNSTILE_SECRET_KEY=${{ secrets.PROD_TURNSTILE_SECRET_KEY }} \
            --from-literal=SENTRY_DSN=${{ secrets.PROD_SENTRY_DSN }} \
            --dry-run=client -o yaml | kubectl apply -f -

      - name: Deploy to production
        run: |
          cd infra/k8s
          # Set the image tag
          kustomize edit set image \
            registry.digitalocean.com/safetrekr/marketing=registry.digitalocean.com/safetrekr/marketing:sha-${{ needs.build-and-push.outputs.short_sha }}
          kustomize build overlays/production | kubectl apply -f -

      - name: Wait for rollout
        run: |
          kubectl rollout status deployment/safetrekr-marketing \
            --namespace production \
            --timeout=300s

      - name: Verify health
        run: |
          # Wait for pods to be ready
          kubectl wait --for=condition=ready pod \
            -l app=safetrekr-marketing \
            --namespace production \
            --timeout=120s
          # Port-forward and test health endpoint
          kubectl port-forward svc/safetrekr-marketing 8080:80 -n production &
          sleep 5
          HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/health)
          if [ "$HTTP_CODE" != "200" ]; then
            echo "Health check failed with status $HTTP_CODE"
            kubectl rollout undo deployment/safetrekr-marketing -n production
            exit 1
          fi

      - name: Create Sentry release
        if: success()
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
        run: |
          npx @sentry/cli releases new sha-${{ needs.build-and-push.outputs.short_sha }}
          npx @sentry/cli releases set-commits sha-${{ needs.build-and-push.outputs.short_sha }} --auto
          npx @sentry/cli releases finalize sha-${{ needs.build-and-push.outputs.short_sha }}
          npx @sentry/cli releases deploys sha-${{ needs.build-and-push.outputs.short_sha }} new -e production

  notify:
    name: Notify
    needs: [build-and-push, deploy]
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Notify on failure
        if: needs.deploy.result == 'failure'
        run: |
          echo "Production deployment failed. Manual intervention required."
          # Add Slack/PagerDuty webhook notification here
```

### 8.4 Deploy Staging Workflow (deploy-staging.yml)

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy Staging

on:
  push:
    branches: [staging]

env:
  REGISTRY: registry.digitalocean.com/safetrekr
  IMAGE: marketing
  CLUSTER: safetrekr-marketing

jobs:
  build-and-deploy:
    name: Build & Deploy to Staging
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.safetrekr.com
    steps:
      - uses: actions/checkout@v4

      - name: Get short SHA
        id: sha
        run: echo "short_sha=$(git rev-parse --short HEAD)" >> $GITHUB_OUTPUT

      - uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

      - name: Log in to DOCR
        run: doctl registry login --expiry-seconds 600

      - uses: docker/setup-buildx-action@v3

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE }}:sha-${{ steps.sha.outputs.short_sha }}
            ${{ env.REGISTRY }}/${{ env.IMAGE }}:staging
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            NEXT_PUBLIC_TURNSTILE_SITE_KEY=${{ secrets.STAGING_TURNSTILE_SITE_KEY }}
            NEXT_PUBLIC_PLAUSIBLE_DOMAIN=staging.safetrekr.com
            NEXT_PUBLIC_SITE_URL=https://staging.safetrekr.com

      - name: Save kubeconfig
        run: doctl kubernetes cluster kubeconfig save ${{ env.CLUSTER }}

      - name: Update secrets
        run: |
          kubectl create secret generic safetrekr-marketing-secrets \
            --namespace staging \
            --from-literal=SUPABASE_URL=${{ secrets.STAGING_SUPABASE_URL }} \
            --from-literal=SUPABASE_ANON_KEY=${{ secrets.STAGING_SUPABASE_ANON_KEY }} \
            --from-literal=SUPABASE_SERVICE_ROLE_KEY=${{ secrets.STAGING_SUPABASE_SERVICE_ROLE_KEY }} \
            --from-literal=SENDGRID_API_KEY=${{ secrets.STAGING_SENDGRID_API_KEY }} \
            --from-literal=TURNSTILE_SECRET_KEY=${{ secrets.STAGING_TURNSTILE_SECRET_KEY }} \
            --from-literal=SENTRY_DSN=${{ secrets.STAGING_SENTRY_DSN }} \
            --dry-run=client -o yaml | kubectl apply -f -

      - name: Deploy to staging
        run: |
          cd infra/k8s
          kustomize edit set image \
            registry.digitalocean.com/safetrekr/marketing=registry.digitalocean.com/safetrekr/marketing:sha-${{ steps.sha.outputs.short_sha }}
          kustomize build overlays/staging | kubectl apply -f -

      - name: Wait for rollout
        run: |
          kubectl rollout status deployment/safetrekr-marketing \
            --namespace staging \
            --timeout=300s
```

### 8.5 Required GitHub Secrets

| Secret | Environment | Description |
|--------|-------------|-------------|
| `DIGITALOCEAN_ACCESS_TOKEN` | All | DO API token for doctl + DOCR |
| `PROD_SUPABASE_URL` | production | Production Supabase URL |
| `PROD_SUPABASE_ANON_KEY` | production | Production Supabase anon key |
| `PROD_SUPABASE_SERVICE_ROLE_KEY` | production | Production Supabase service role key |
| `PROD_SENDGRID_API_KEY` | production | Production SendGrid API key |
| `PROD_TURNSTILE_SITE_KEY` | production | Production Cloudflare Turnstile site key |
| `PROD_TURNSTILE_SECRET_KEY` | production | Production Cloudflare Turnstile secret key |
| `PROD_SENTRY_DSN` | production | Production Sentry DSN |
| `STAGING_SUPABASE_URL` | staging | Staging Supabase URL |
| `STAGING_SUPABASE_ANON_KEY` | staging | Staging Supabase anon key |
| `STAGING_SUPABASE_SERVICE_ROLE_KEY` | staging | Staging Supabase service role key |
| `STAGING_SENDGRID_API_KEY` | staging | Staging/sandbox SendGrid key |
| `STAGING_TURNSTILE_SITE_KEY` | staging | Staging Turnstile test key |
| `STAGING_TURNSTILE_SECRET_KEY` | staging | Staging Turnstile test secret |
| `STAGING_SENTRY_DSN` | staging | Staging Sentry DSN |
| `SENTRY_AUTH_TOKEN` | All | Sentry release API token |

### 8.6 Acceptance Criteria

- [ ] PR triggers CI checks; all must pass before merge is allowed.
- [ ] Push to `staging` branch triggers staging deployment within 5 minutes.
- [ ] Push to `main` branch triggers production deployment within 5 minutes.
- [ ] Failed health check during production deploy triggers automatic rollback.
- [ ] Sentry release is created on successful production deploy.
- [ ] Docker layer caching reduces build time to under 3 minutes on subsequent builds.
- [ ] Concurrent production deployments are prevented (concurrency group).

---

## 9. FR-INFRA-008: Environment Management

**Priority**: P0
**Effort**: 1 day
**Description**: Three-environment strategy with identical Docker images and environment-specific configuration.

### 9.1 Environment Matrix

| Environment | Namespace | Branch | URL | Replicas | Supabase Project |
|-------------|-----------|--------|-----|----------|------------------|
| Production | `production` | `main` | `safetrekr.com` | 2-6 (HPA) | Production |
| Staging | `staging` | `staging` | `staging.safetrekr.com` | 1 | Staging |
| Preview | `preview` | PR branches | `pr-<num>.preview.safetrekr.com` | 1 | Staging |
| Local | N/A | N/A | `localhost:3000` | 1 | Local or Staging |

### 9.2 Environment Variable Matrix

| Variable | Production | Staging | Preview | Local |
|----------|-----------|---------|---------|-------|
| `NODE_ENV` | `production` | `production` | `production` | `development` |
| `NEXT_PUBLIC_SITE_URL` | `https://safetrekr.com` | `https://staging.safetrekr.com` | `https://pr-<num>.preview.safetrekr.com` | `http://localhost:3000` |
| `SUPABASE_URL` | Prod URL | Staging URL | Staging URL | Staging URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Prod key | Staging key | Staging key | Staging key |
| `SENDGRID_API_KEY` | Prod key | Sandbox key | Sandbox key | Sandbox key |
| `TURNSTILE_SECRET_KEY` | Prod key | Test key `1x...AA` | Test key | Test key |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Prod key | Test key `1x...AA` | Test key | Test key |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `safetrekr.com` | `staging.safetrekr.com` | (empty) | (empty) |
| `SENTRY_DSN` | Prod DSN | Staging DSN | Staging DSN | (empty) |

### 9.3 Kustomize Overlay Strategy

```
infra/k8s/
  base/
    kustomization.yaml       # Shared resources
    deployment.yaml
    service.yaml
    hpa.yaml
    pdb.yaml
    serviceaccount.yaml
  overlays/
    production/
      kustomization.yaml     # Production-specific patches
      configmap.yaml
      ingress.yaml
      hpa-patch.yaml         # minReplicas: 2, maxReplicas: 6
    staging/
      kustomization.yaml
      configmap.yaml
      ingress.yaml
      hpa-patch.yaml         # minReplicas: 1, maxReplicas: 2
    preview/
      kustomization.yaml
      configmap.yaml
      ingress-template.yaml  # Templated hostname
```

### 9.4 Acceptance Criteria

- [ ] Production and staging use separate Supabase projects (verified via health endpoint).
- [ ] Environment variables are correctly injected in each environment.
- [ ] Staging is accessible only at `staging.safetrekr.com`.
- [ ] Preview environments are accessible at `pr-<num>.preview.safetrekr.com`.
- [ ] `NEXT_PUBLIC_*` variables are baked into the Docker image at build time.
- [ ] Runtime secrets are injected via Kubernetes Secrets, never in the image.

---

## 10. FR-INFRA-009: Preview Deployments

**Priority**: P1
**Effort**: 1.5 days
**Description**: Ephemeral per-PR preview environments deployed to the `preview` namespace with automatic cleanup.

### 10.1 Preview Deployment Workflow

```yaml
# .github/workflows/preview.yml
name: Preview Deploy

on:
  pull_request:
    types: [opened, synchronize, reopened]

concurrency:
  group: preview-${{ github.event.pull_request.number }}
  cancel-in-progress: true

env:
  REGISTRY: registry.digitalocean.com/safetrekr
  IMAGE: marketing
  CLUSTER: safetrekr-marketing
  PR_NUMBER: ${{ github.event.pull_request.number }}

jobs:
  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    environment:
      name: preview-${{ github.event.pull_request.number }}
      url: https://pr-${{ github.event.pull_request.number }}.preview.safetrekr.com
    steps:
      - uses: actions/checkout@v4

      - name: Get short SHA
        id: sha
        run: echo "short_sha=$(git rev-parse --short HEAD)" >> $GITHUB_OUTPUT

      - uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

      - name: Log in to DOCR
        run: doctl registry login --expiry-seconds 600

      - uses: docker/setup-buildx-action@v3

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE }}:pr-${{ env.PR_NUMBER }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
            NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
            NEXT_PUBLIC_SITE_URL=https://pr-${{ env.PR_NUMBER }}.preview.safetrekr.com

      - name: Save kubeconfig
        run: doctl kubernetes cluster kubeconfig save ${{ env.CLUSTER }}

      - name: Deploy preview
        run: |
          export PR_NUM=${{ env.PR_NUMBER }}
          export IMAGE_TAG=pr-${{ env.PR_NUMBER }}

          # Apply preview resources with envsubst
          envsubst < infra/k8s/preview/deployment-template.yaml | kubectl apply -n preview -f -
          envsubst < infra/k8s/preview/service-template.yaml | kubectl apply -n preview -f -
          envsubst < infra/k8s/preview/ingress-template.yaml | kubectl apply -n preview -f -

      - name: Wait for rollout
        run: |
          kubectl rollout status deployment/safetrekr-marketing-pr-${{ env.PR_NUMBER }} \
            --namespace preview \
            --timeout=180s

      - name: Comment on PR
        uses: actions/github-script@v7
        with:
          script: |
            const url = `https://pr-${{ env.PR_NUMBER }}.preview.safetrekr.com`;
            const body = `## Preview Deployment\n\nDeployed to: ${url}\n\nCommit: \`${{ steps.sha.outputs.short_sha }}\`\n\nThis preview will be automatically cleaned up when the PR is closed.`;
            // Find existing comment
            const comments = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: ${{ env.PR_NUMBER }},
            });
            const existing = comments.data.find(c => c.body.includes('Preview Deployment'));
            if (existing) {
              await github.rest.issues.updateComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: existing.id,
                body,
              });
            } else {
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: ${{ env.PR_NUMBER }},
                body,
              });
            }
```

### 10.2 Preview Cleanup Workflow

```yaml
# .github/workflows/preview-cleanup.yml
name: Preview Cleanup

on:
  pull_request:
    types: [closed]

env:
  CLUSTER: safetrekr-marketing

jobs:
  cleanup:
    name: Delete Preview Environment
    runs-on: ubuntu-latest
    steps:
      - uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

      - name: Save kubeconfig
        run: doctl kubernetes cluster kubeconfig save ${{ env.CLUSTER }}

      - name: Delete preview resources
        run: |
          PR_NUM=${{ github.event.pull_request.number }}
          kubectl delete deployment safetrekr-marketing-pr-${PR_NUM} -n preview --ignore-not-found
          kubectl delete service safetrekr-marketing-pr-${PR_NUM} -n preview --ignore-not-found
          kubectl delete ingress safetrekr-marketing-pr-${PR_NUM} -n preview --ignore-not-found
```

### 10.3 Preview Resource Templates

Preview deployments use a single replica, staging Supabase, and shared preview secrets.

```yaml
# infra/k8s/preview/deployment-template.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: safetrekr-marketing-pr-${PR_NUM}
  labels:
    app: safetrekr-marketing
    preview: "pr-${PR_NUM}"
spec:
  replicas: 1
  selector:
    matchLabels:
      app: safetrekr-marketing
      preview: "pr-${PR_NUM}"
  template:
    metadata:
      labels:
        app: safetrekr-marketing
        preview: "pr-${PR_NUM}"
    spec:
      containers:
        - name: nextjs
          image: registry.digitalocean.com/safetrekr/marketing:${IMAGE_TAG}
          ports:
            - containerPort: 3000
          envFrom:
            - secretRef:
                name: preview-shared-secrets
          env:
            - name: NODE_ENV
              value: "production"
          resources:
            requests:
              cpu: 50m
              memory: 128Mi
            limits:
              cpu: 250m
              memory: 256Mi
          readinessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
```

### 10.4 Acceptance Criteria

- [ ] Opening a PR triggers preview deployment within 5 minutes.
- [ ] Preview URL is commented on the PR automatically.
- [ ] Updating a PR triggers redeployment to the same URL.
- [ ] Closing/merging a PR deletes all preview resources.
- [ ] Preview environments use staging Supabase (not production).
- [ ] Maximum 5 concurrent preview deployments (enforced by resource quotas).

---

## 11. FR-INFRA-010: DNS & CDN Configuration

**Priority**: P0
**Effort**: 0.5 days
**Description**: Cloudflare DNS pointing to DOKS Ingress Load Balancer with CDN proxying.

### 11.1 DNS Records

| Record Type | Name | Value | Proxy | TTL |
|-------------|------|-------|-------|-----|
| A | `@` | `<DO LB IP>` | Proxied (orange cloud) | Auto |
| CNAME | `www` | `safetrekr.com` | Proxied | Auto |
| A | `staging` | `<DO LB IP>` | Proxied | Auto |
| CNAME | `*.preview` | `safetrekr.com` | Proxied | Auto |
| CNAME | `app` | `<product-hosting>` | Proxied | Auto |
| CNAME | `api` | `<api-hosting>` | Proxied | Auto |
| MX | `@` | SendGrid MX records | DNS only | 3600 |
| TXT | `@` | `v=spf1 include:sendgrid.net ~all` | DNS only | 3600 |
| CNAME | `s1._domainkey` | SendGrid DKIM record | DNS only | 3600 |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@safetrekr.com` | DNS only | 3600 |

**Note**: The A record value is the external IP of the DigitalOcean Load Balancer created by the Nginx Ingress controller. Retrieve it with:

```bash
kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

### 11.2 Cloudflare Settings

| Setting | Value | Rationale |
|---------|-------|-----------|
| SSL/TLS mode | Full (Strict) | Origin has valid Let's Encrypt cert |
| Minimum TLS version | 1.2 | Industry standard |
| Always Use HTTPS | On | Force HTTPS |
| HSTS | Enabled (max-age=31536000, includeSubDomains, preload) | Security best practice |
| Brotli | On | Compression |
| HTTP/2 | On | Performance |
| HTTP/3 (QUIC) | On | Performance |
| 0-RTT | On | Performance |
| Auto Minify | Off | Next.js handles this |
| Rocket Loader | Off | Conflicts with Next.js hydration |
| Email Address Obfuscation | On | Anti-scraping |
| Browser Integrity Check | On | Bot protection layer |
| Hotlink Protection | On | Prevent image hotlinking |

### 11.3 Cloudflare Page Rules

| Rule | URL Pattern | Setting |
|------|-------------|---------|
| 1 | `safetrekr.com/_next/static/*` | Cache Level: Cache Everything, Edge TTL: 1 year, Browser TTL: 1 year |
| 2 | `safetrekr.com/images/*` | Cache Level: Cache Everything, Edge TTL: 1 month, Browser TTL: 1 week |
| 3 | `safetrekr.com/api/*` | Cache Level: Bypass |
| 4 | `www.safetrekr.com/*` | Forwarding URL (301) to `https://safetrekr.com/$1` |

### 11.4 DigitalOcean Spaces CDN (Static Assets)

For heavy static assets (sample binder PDFs, high-resolution images), use DigitalOcean Spaces with CDN enabled:

| Parameter | Value |
|-----------|-------|
| Space name | `safetrekr-assets` |
| Region | `nyc3` |
| CDN enabled | Yes |
| CDN endpoint | `safetrekr-assets.nyc3.cdn.digitaloceanspaces.com` |
| Custom domain (optional) | `assets.safetrekr.com` |
| File access | Public read for assets, private for backups |
| CORS | Allow `safetrekr.com`, `staging.safetrekr.com` |

### 11.5 Acceptance Criteria

- [ ] `safetrekr.com` resolves and loads the marketing site via Cloudflare.
- [ ] `www.safetrekr.com` redirects (301) to `safetrekr.com`.
- [ ] `staging.safetrekr.com` loads the staging environment.
- [ ] `pr-*.preview.safetrekr.com` resolves for active previews.
- [ ] SSL certificate is valid end-to-end (Cloudflare -> Origin).
- [ ] Cloudflare is caching `_next/static/*` assets (verified via `cf-cache-status` header).
- [ ] API routes bypass the Cloudflare cache.
- [ ] Email deliverability passes SPF, DKIM, and DMARC checks.

---

## 12. FR-INFRA-011: Monitoring & Alerting

**Priority**: P1
**Effort**: 1.5 days
**Description**: Observability stack for cluster health, application performance, and uptime.

### 12.1 Monitoring Strategy

Use a tiered approach that avoids over-engineering for a marketing site:

| Tier | Tool | Purpose | Cost |
|------|------|---------|------|
| Tier 1 (Essential) | DigitalOcean Monitoring | Node CPU/Memory/Disk alerts | Free with DOKS |
| Tier 1 (Essential) | UptimeRobot or BetterStack | External uptime monitoring | Free tier (50 monitors) |
| Tier 1 (Essential) | Sentry | Application error tracking | Free tier (5K events/mo) |
| Tier 2 (Recommended) | Prometheus + Grafana | In-cluster metrics + dashboards | Self-hosted, free |
| Tier 3 (Future) | DigitalOcean App Insights | Full APM | $10-25/mo |

### 12.2 DigitalOcean Monitoring Alerts

| Alert | Condition | Notification |
|-------|-----------|--------------|
| High CPU | Node CPU > 85% for 5 minutes | Email + Slack |
| High Memory | Node memory > 90% for 5 minutes | Email + Slack |
| High Disk | Disk usage > 80% | Email |
| Droplet down | Node unreachable for 2 minutes | Email + Slack |
| Load Balancer unhealthy | All backends unhealthy | Email + Slack |

### 12.3 Prometheus + Grafana (Recommended)

```bash
# Install kube-prometheus-stack via Helm
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set prometheus.prometheusSpec.retention=15d \
  --set prometheus.prometheusSpec.resources.requests.cpu=100m \
  --set prometheus.prometheusSpec.resources.requests.memory=256Mi \
  --set prometheus.prometheusSpec.resources.limits.memory=512Mi \
  --set grafana.adminPassword="${GRAFANA_ADMIN_PASSWORD}" \
  --set grafana.ingress.enabled=true \
  --set grafana.ingress.ingressClassName=nginx \
  --set grafana.ingress.hosts[0]=grafana.internal.safetrekr.com \
  --set alertmanager.enabled=true
```

### 12.4 Application Health Endpoint

The `/api/health` endpoint (defined in CTA analysis) checks:

1. Supabase connectivity (`SELECT 1`).
2. SendGrid API key validity.
3. Turnstile secret key configured.
4. Build metadata (version, commit SHA).

Response format:

```json
{
  "status": "healthy",
  "version": "sha-a1b2c3d",
  "timestamp": "2026-03-24T12:00:00Z",
  "checks": {
    "supabase": "ok",
    "sendgrid": "ok",
    "turnstile": "ok"
  }
}
```

### 12.5 External Uptime Monitoring

| Monitor | URL | Check Interval | Alert After |
|---------|-----|----------------|-------------|
| Homepage | `https://safetrekr.com` | 60 seconds | 2 failures |
| Health endpoint | `https://safetrekr.com/api/health` | 60 seconds | 1 failure |
| Staging | `https://staging.safetrekr.com` | 300 seconds | 3 failures |
| Demo form | `https://safetrekr.com/demo` | 300 seconds | 3 failures |

### 12.6 Sentry Error Tracking Configuration

```typescript
// Adapted for DOKS (no Vercel environment variables)
const sentryConfig = {
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0.5,
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_COMMIT_SHA, // Injected at build time
}
```

### 12.7 Acceptance Criteria

- [ ] DigitalOcean monitoring alerts fire when node CPU exceeds 85%.
- [ ] UptimeRobot/BetterStack detects downtime within 2 minutes.
- [ ] Sentry captures unhandled exceptions with source maps.
- [ ] Grafana dashboards show pod CPU/memory, request rate, and error rate.
- [ ] Health endpoint returns 503 when Supabase is unreachable.

---

## 13. FR-INFRA-012: Centralized Logging

**Priority**: P1
**Effort**: 1 day
**Description**: Aggregate container logs from all pods for debugging and audit.

### 13.1 Logging Strategy

| Approach | Complexity | Cost | Recommendation |
|----------|------------|------|----------------|
| `kubectl logs` (manual) | Minimal | Free | Not sufficient for production |
| DigitalOcean log forwarding | Low | Free with DOKS | Recommended for launch |
| Loki + Fluent Bit | Medium | Self-hosted, free | Recommended for 60+ days |
| Datadog / New Relic | Low (SaaS) | $15-25/mo | Future consideration |

### 13.2 Phase 1: DigitalOcean Log Forwarding (Launch)

DigitalOcean DOKS supports forwarding logs to external endpoints. Configure via the DO control panel:

| Parameter | Value |
|-----------|-------|
| Destination | Papertrail, Datadog, or custom syslog |
| Format | JSON (structured) |
| Filter | All namespaces |

### 13.3 Phase 2: Loki + Fluent Bit (Post-Launch)

```bash
# Install Loki stack
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

helm install loki grafana/loki-stack \
  --namespace monitoring \
  --set fluent-bit.enabled=true \
  --set promtail.enabled=false \
  --set loki.persistence.enabled=true \
  --set loki.persistence.size=10Gi \
  --set loki.config.table_manager.retention_deletes_enabled=true \
  --set loki.config.table_manager.retention_period=336h  # 14 days
```

### 13.4 Application Logging Standards

All application logs MUST be structured JSON:

```typescript
// Example structured log output
console.log(JSON.stringify({
  level: 'info',
  message: 'Form submission received',
  service: 'safetrekr-marketing',
  form_type: 'demo_request',
  segment: 'k12',
  timestamp: new Date().toISOString(),
  request_id: crypto.randomUUID(),
}))
```

### 13.5 Acceptance Criteria

- [ ] `kubectl logs -l app=safetrekr-marketing -n production` returns structured JSON logs.
- [ ] Logs are queryable by form type, error level, and timestamp.
- [ ] Log retention is 14 days minimum.
- [ ] No PII (raw IP addresses, email addresses) appears in application logs.

---

## 14. FR-INFRA-013: Security Hardening

**Priority**: P0
**Effort**: 1 day
**Description**: Kubernetes-level security controls, network policies, and secret management.

### 14.1 Network Policies

```yaml
# infra/k8s/base/networkpolicy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: safetrekr-marketing
spec:
  podSelector:
    matchLabels:
      app: safetrekr-marketing
  policyTypes:
    - Ingress
    - Egress
  ingress:
    # Allow traffic from Nginx Ingress controller only
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: ingress-nginx
      ports:
        - protocol: TCP
          port: 3000
  egress:
    # Allow DNS resolution
    - to:
        - namespaceSelector: {}
      ports:
        - protocol: UDP
          port: 53
        - protocol: TCP
          port: 53
    # Allow HTTPS to external services (Supabase, SendGrid, Turnstile, Plausible, Sentry, MapTiler)
    - to:
        - ipBlock:
            cidr: 0.0.0.0/0
            except:
              - 10.0.0.0/8
              - 172.16.0.0/12
              - 192.168.0.0/16
      ports:
        - protocol: TCP
          port: 443
```

### 14.2 Pod Security Standards

The Deployment spec (FR-INFRA-005) enforces:

| Control | Value |
|---------|-------|
| `runAsNonRoot` | `true` |
| `runAsUser` | `1001` |
| `runAsGroup` | `1001` |
| `seccompProfile.type` | `RuntimeDefault` |
| `allowPrivilegeEscalation` | `false` |
| `capabilities.drop` | `ALL` |
| `readOnlyRootFilesystem` | `false` (Next.js ISR cache needs write) |
| `automountServiceAccountToken` | `false` |

### 14.3 Secret Management

| Practice | Implementation |
|----------|---------------|
| Secrets stored encrypted at rest | DOKS encrypts etcd by default |
| Secrets injected by CI | `kubectl create secret --dry-run=client -o yaml \| kubectl apply` |
| No secrets in Docker images | All `NEXT_PUBLIC_*` are non-sensitive; secrets are runtime-only |
| No secrets in Git | `.env*` in `.gitignore`; secret templates use `<injected-by-ci>` placeholders |
| Secret rotation | Supabase keys rotatable; SendGrid key scoped to `mail.send`; rotate quarterly |
| GitHub Secrets | Encrypted at rest; scoped to environments (production, staging) |

### 14.4 Resource Quotas (Preview Namespace)

```yaml
# infra/k8s/preview/resourcequota.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: preview-quota
  namespace: preview
spec:
  hard:
    requests.cpu: "2"
    requests.memory: 2Gi
    limits.cpu: "4"
    limits.memory: 4Gi
    pods: "10"
    services: "10"
    persistentvolumeclaims: "0"
```

### 14.5 RBAC (Future: Multi-Developer Access)

```yaml
# infra/k8s/cluster/rbac-developer.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: developer
  namespace: staging
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/log", "services"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list", "watch"]
  # Developers cannot modify production resources
```

### 14.6 Security Headers

Security headers are applied at two layers:

1. **Nginx Ingress annotations** (FR-INFRA-006): HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
2. **Next.js middleware** (CTA analysis Section 5.1): Full CSP header, Cross-Origin policies.

Both layers are necessary. Nginx provides the safety net; Next.js middleware provides granular per-route control.

### 14.7 Acceptance Criteria

- [ ] NetworkPolicy blocks direct pod-to-pod access from non-ingress namespaces.
- [ ] Pods cannot reach internal cluster IPs except DNS and their own service.
- [ ] All pods run as non-root (verified with `kubectl exec -- id`).
- [ ] No secrets are visible in `docker inspect` of the built image.
- [ ] Preview namespace cannot exceed resource quota.
- [ ] Security headers are present on all responses (verified with `curl -I`).

---

## 15. FR-INFRA-014: Backup & Disaster Recovery

**Priority**: P1
**Effort**: 1 day
**Description**: Backup strategy for data and infrastructure, plus disaster recovery procedures.

### 15.1 Backup Matrix

| Asset | Backup Method | Frequency | Retention | RTO | RPO |
|-------|--------------|-----------|-----------|-----|-----|
| Supabase database | Supabase Pro daily backups + PITR | Continuous (PITR) | 7 days (Pro) | < 15 min | < 5 min |
| Kubernetes manifests | Git repository | Every commit | Permanent | < 5 min (redeploy) | 0 (Git) |
| Docker images | DOCR (30-day retention) | Every build | 30 days | < 5 min (redeploy previous tag) | 0 |
| Cloudflare DNS config | Terraform state or manual export | On change | Permanent | < 10 min | 0 |
| Static assets (Spaces) | DO Spaces versioning | On upload | 30 days | < 5 min | 0 |
| GitHub Secrets | Manual documentation (encrypted) | On change | N/A | < 30 min (manual re-entry) | 0 |

### 15.2 Supabase Backup Strategy

Supabase Pro ($25/month) provides:

- **Daily automated backups**: Full database snapshot, retained for 7 days.
- **Point-in-time recovery (PITR)**: Continuous WAL archiving, restore to any second in the last 7 days.
- **Manual backup**: On-demand via Supabase dashboard before any destructive migration.

Additional safeguard:

```bash
# Weekly pg_dump to DO Spaces (via GitHub Actions scheduled workflow)
# .github/workflows/db-backup.yml
name: Database Backup
on:
  schedule:
    - cron: '0 4 * * 0'  # Sunday 4 AM UTC

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Dump database
        run: |
          pg_dump "${{ secrets.PROD_SUPABASE_DB_URL }}" \
            --format=custom \
            --no-owner \
            --no-privileges \
            -f backup-$(date +%Y%m%d).dump

      - name: Upload to DO Spaces
        uses: BetaHuhn/do-spaces-action@v2
        with:
          access_key: ${{ secrets.SPACES_ACCESS_KEY }}
          secret_key: ${{ secrets.SPACES_SECRET_KEY }}
          space_name: safetrekr-backups
          space_region: nyc3
          source: backup-*.dump
          out_dir: db-backups/
```

### 15.3 Disaster Recovery Procedures

#### Scenario 1: Application Pod Failure

```
Detection: Kubernetes restarts pod automatically (restartPolicy: Always)
Action: Automatic -- no manual intervention
RTO: < 30 seconds
```

#### Scenario 2: Node Failure

```
Detection: DOKS control plane detects node down
Action: Pods rescheduled to surviving nodes within 5 minutes
         Autoscaler adds replacement node within 5-10 minutes
RTO: < 5 minutes (pods rescheduled)
```

#### Scenario 3: Bad Deployment

```
Detection: Health check failure during rollout, or Sentry error spike
Action: kubectl rollout undo deployment/safetrekr-marketing -n production
        OR: redeploy previous image tag via GitHub Actions manual trigger
RTO: < 2 minutes
```

#### Scenario 4: Database Corruption

```
Detection: Health endpoint returns 503 for Supabase check
Action: Supabase PITR restore to last known good state
RTO: < 15 minutes
RPO: < 5 minutes
```

#### Scenario 5: Complete Cluster Loss

```
Detection: All monitoring alerts fire simultaneously
Action:
  1. Create new DOKS cluster (doctl command, ~5 minutes)
  2. Install ingress + cert-manager (Helm, ~3 minutes)
  3. Apply K8s manifests from Git (kubectl apply, ~2 minutes)
  4. Update Cloudflare DNS to new Load Balancer IP (~1 minute)
  5. Wait for cert-manager to issue new certificate (~2 minutes)
  6. Wait for DNS propagation (Cloudflare proxied, near-instant)
RTO: < 20 minutes
RPO: 0 (all state is external: Git, DOCR, Supabase, Cloudflare)
```

### 15.4 Acceptance Criteria

- [ ] Supabase PITR restore tested successfully at least once before launch.
- [ ] Weekly `pg_dump` to DO Spaces runs without errors for 4 consecutive weeks.
- [ ] `kubectl rollout undo` restores a working deployment within 2 minutes.
- [ ] Complete cluster recreation from scratch takes under 20 minutes (dry run documented).
- [ ] All infrastructure is reproducible from Git (no snowflake configuration).

---

## 16. FR-INFRA-015: Cost Estimation

**Priority**: P0 (planning)
**Effort**: N/A (reference document)
**Description**: Monthly cost projection for DigitalOcean infrastructure.

### 16.1 Monthly Cost Breakdown

| Resource | Specification | Monthly Cost |
|----------|---------------|-------------|
| DOKS Cluster (control plane) | HA enabled | $0 (free with DOKS) |
| Worker nodes (2x) | `s-2vcpu-4gb` | $48 ($24 x 2) |
| Worker nodes (autoscale, average) | +1 during peaks | ~$12 (estimated 50% utilization) |
| Load Balancer | `lb-small` | $12 |
| Container Registry | Starter (5 GB) | $5 |
| DO Spaces (assets) | 250 GB storage + CDN | $5 + bandwidth |
| DO Spaces (backups) | ~1 GB | $0.02 |
| **DigitalOcean Subtotal** | | **~$82/month** |

### 16.2 External Service Costs

| Service | Plan | Monthly Cost |
|---------|------|-------------|
| Cloudflare | Free plan | $0 |
| Supabase | Pro | $25 |
| SendGrid | Free (100 emails/day) | $0 |
| Plausible Analytics | Growth (10K pageviews) | $9 |
| Sentry | Free (5K events/month) | $0 |
| UptimeRobot | Free (50 monitors) | $0 |
| **External Subtotal** | | **$34/month** |

### 16.3 Total Monthly Cost

| Tier | Cost | When |
|------|------|------|
| **Launch (baseline)** | **~$116/month** | Day 1 |
| Growth (3-4 nodes, Sentry Pro) | ~$180/month | After 3 months |
| Scale (4+ nodes, full monitoring) | ~$250/month | After 6 months |

### 16.4 Cost Comparison: Vercel vs. DOKS

| Scenario | Vercel Pro | DOKS |
|----------|-----------|------|
| Low traffic (<50K pageviews) | $20/month | $116/month |
| Medium traffic (50K-500K pageviews) | $20-50/month | $116/month |
| High traffic (500K+ pageviews) | $50-200+/month (bandwidth overage) | $116-180/month |
| ISR + Image Optimization heavy | $20+ (execution usage) | Included in node cost |
| Preview deployments (10 PRs/week) | Included | Included (small resource overhead) |

**Decision Rationale**: DOKS costs more at low traffic but provides predictable costs at scale, full infrastructure control, no vendor lock-in, and the ability to run additional services (analytics, monitoring) on the same cluster.

---

## 17. Infrastructure Directory Structure

```
safetrekr-marketing/
├── infra/
│   ├── docker/
│   │   ├── Dockerfile              # Production multi-stage build
│   │   ├── Dockerfile.dev          # Development with hot reload
│   │   └── .dockerignore
│   │
│   ├── k8s/
│   │   ├── base/
│   │   │   ├── kustomization.yaml
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   ├── hpa.yaml
│   │   │   ├── pdb.yaml
│   │   │   ├── serviceaccount.yaml
│   │   │   ├── networkpolicy.yaml
│   │   │   └── secret.yaml          # Template only
│   │   │
│   │   ├── overlays/
│   │   │   ├── production/
│   │   │   │   ├── kustomization.yaml
│   │   │   │   ├── configmap.yaml
│   │   │   │   ├── ingress.yaml
│   │   │   │   └── hpa-patch.yaml
│   │   │   └── staging/
│   │   │       ├── kustomization.yaml
│   │   │       ├── configmap.yaml
│   │   │       ├── ingress.yaml
│   │   │       └── hpa-patch.yaml
│   │   │
│   │   ├── preview/
│   │   │   ├── deployment-template.yaml
│   │   │   ├── service-template.yaml
│   │   │   ├── ingress-template.yaml
│   │   │   └── resourcequota.yaml
│   │   │
│   │   └── cluster/
│   │       ├── clusterissuer-production.yaml
│   │       ├── clusterissuer-staging.yaml
│   │       └── rbac-developer.yaml
│   │
│   ├── nginx/
│   │   └── local.conf               # Local Nginx reverse proxy config
│   │
│   └── scripts/
│       ├── setup-cluster.sh          # One-time cluster provisioning
│       ├── install-addons.sh         # Helm installs for ingress, cert-manager, monitoring
│       ├── create-namespaces.sh      # Namespace creation
│       └── rotate-secrets.sh         # Secret rotation helper
│
├── .github/
│   └── workflows/
│       ├── ci.yml                    # PR checks: lint, test, build
│       ├── deploy-production.yml     # Main branch -> production
│       ├── deploy-staging.yml        # Staging branch -> staging
│       ├── preview.yml               # PR -> preview namespace
│       ├── preview-cleanup.yml       # PR close -> delete preview
│       ├── cleanup.yml               # Weekly: registry + preview cleanup
│       └── db-backup.yml             # Weekly: Supabase pg_dump to Spaces
│
├── docker-compose.yml                # Local production-like testing
├── docker-compose.dev.yml            # Local development with hot reload
├── Dockerfile                        # Symlink or copy of infra/docker/Dockerfile
└── .dockerignore                     # Symlink or copy of infra/docker/.dockerignore
```

---

## 18. Rollback Strategy

| Scenario | Action | Command | Recovery Time |
|----------|--------|---------|---------------|
| Bad deployment (health check fails) | Automatic rollback in CI | Pipeline handles it | < 2 min |
| Bad deployment (discovered post-deploy) | Manual rollback | `kubectl rollout undo deployment/safetrekr-marketing -n production` | < 1 min |
| Redeploy specific version | Re-run deploy workflow | Trigger GitHub Action with specific SHA | < 5 min |
| Database migration failure | Supabase PITR | Supabase dashboard | < 15 min |
| DNS misconfiguration | Cloudflare revert | Cloudflare dashboard | < 2 min |
| Complete cluster loss | Full rebuild from Git | `setup-cluster.sh` + `install-addons.sh` + deploy | < 20 min |

**Revision History**: Kubernetes retains the last 5 deployment revisions (`revisionHistoryLimit: 5`), enabling instant rollback to any of the 5 most recent versions.

---

## 19. Operational Runbooks

### 19.1 Deploy to Production (Manual)

```bash
# 1. Build and push image
docker build -t registry.digitalocean.com/safetrekr/marketing:sha-$(git rev-parse --short HEAD) .
docker push registry.digitalocean.com/safetrekr/marketing:sha-$(git rev-parse --short HEAD)

# 2. Update deployment
kubectl set image deployment/safetrekr-marketing \
  nextjs=registry.digitalocean.com/safetrekr/marketing:sha-$(git rev-parse --short HEAD) \
  -n production

# 3. Monitor rollout
kubectl rollout status deployment/safetrekr-marketing -n production

# 4. Verify health
curl -s https://safetrekr.com/api/health | jq .
```

### 19.2 Scale Up (Manual)

```bash
# Increase minimum replicas temporarily
kubectl scale deployment/safetrekr-marketing --replicas=4 -n production

# Or patch HPA
kubectl patch hpa safetrekr-marketing -n production \
  -p '{"spec":{"minReplicas":4}}'
```

### 19.3 Debug Failing Pod

```bash
# Check pod status
kubectl get pods -l app=safetrekr-marketing -n production

# View pod events
kubectl describe pod <pod-name> -n production

# View container logs
kubectl logs <pod-name> -n production --tail=100

# Exec into container (emergency debugging only)
kubectl exec -it <pod-name> -n production -- /bin/sh
```

### 19.4 Certificate Renewal Check

```bash
# Check certificate status
kubectl get certificate -n production

# Check cert-manager logs
kubectl logs -l app=cert-manager -n cert-manager --tail=50

# Force renewal
kubectl delete secret safetrekr-marketing-tls -n production
# cert-manager will automatically re-issue
```

### 19.5 Emergency: Redirect Traffic Away from DOKS

If the entire DOKS cluster is unrecoverable, redirect traffic to a static maintenance page:

1. Log into Cloudflare.
2. Add a Page Rule for `safetrekr.com/*` with "Forwarding URL (302)" to a maintenance page hosted on Cloudflare Pages or a static Spaces URL.
3. Investigate and rebuild the cluster.
4. Remove the Page Rule once restored.

---

## 20. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| DOKS node pool runs out of capacity | Low | High | Autoscaler configured (max 4 nodes); alerts at 70% CPU |
| Let's Encrypt rate limit hit | Low | Medium | Use staging issuer for testing; production issuer has generous limits |
| DigitalOcean region outage | Very Low | Critical | DNS failover to static page on Cloudflare; all state external to DO |
| Docker image vulnerability | Medium | Medium | Trivy scan in CI; Alpine base with minimal packages |
| ISR cache inconsistency | Medium | Low | ISR cache stored in-pod (ephemeral); redeployment resets cache |
| Cloudflare misconfiguration | Low | High | Terraform or version-controlled Cloudflare config; test in staging |
| GitHub Actions secrets leak | Very Low | Critical | Secrets scoped to environments; no secret printing in logs |
| Supabase outage | Low | Medium | Health endpoint degrades gracefully; static pages still serve |
| Registry storage exhausted | Low | Low | Weekly garbage collection; 5 GB generous for ~30 images |
| Cost overrun from autoscaling | Low | Low | Max 4 nodes ($96/mo); alerts on scaling events |
| Preview namespace resource exhaustion | Medium | Low | ResourceQuota limits; max 10 pods in preview namespace |
| Next.js standalone ISR cold start | Medium | Low | Startup probe with 60s grace period; at least 2 replicas always warm |

---

## Appendix A: ISR on DOKS vs. Vercel

Next.js standalone mode supports ISR natively using a file-system cache stored within the running container. Key differences from Vercel:

| Aspect | Vercel ISR | Standalone ISR (DOKS) |
|--------|-----------|----------------------|
| Cache storage | Vercel Edge Network (distributed) | Pod-local file system |
| Cache sharing | Shared across all edge nodes | NOT shared between pods |
| Revalidation | Background revalidation at edge | Background revalidation per pod |
| Stale-while-revalidate | Native | Native (built into Next.js server) |
| Cache persistence | Persisted across deploys | Lost on pod restart/redeploy |

**Implication**: Each pod independently caches and revalidates ISR pages. For a marketing site with mostly SSG pages and ISR only on blog content, this is acceptable. The first request after a deployment will be slightly slower (cache cold start) but subsequent requests are cached.

**If cache sharing becomes critical**: Use a shared volume (PersistentVolumeClaim) mounted at `.next/cache` across all pods, or implement Redis-based caching with `@neshca/cache-handler`.

---

## Appendix B: OG Image Generation Without Vercel

The CTA analysis specifies `@vercel/og` for OG image generation. On DOKS, two options exist:

| Option | Description | Recommendation |
|--------|-------------|----------------|
| `@vercel/og` with Node.js | Works outside Vercel since v0.6+ (uses Satori under the hood) | Recommended if `@vercel/og` supports Node runtime |
| `satori` + `sharp` directly | Generate SVG with Satori, convert to PNG with sharp | Fallback if `@vercel/og` requires Edge runtime |

Test `@vercel/og` in the Docker container during development. If it requires the Vercel Edge runtime, switch to the Satori + sharp approach in the `/api/og` route handler.

---

## Appendix C: Pre-Launch Checklist

- [ ] DOKS cluster provisioned and healthy (2 nodes).
- [ ] Nginx Ingress controller deployed with Load Balancer IP assigned.
- [ ] cert-manager installed; ClusterIssuer verified with staging Let's Encrypt.
- [ ] Container Registry created; DOKS cluster has pull access.
- [ ] Namespaces created: `production`, `staging`, `preview`, `monitoring`.
- [ ] Kubernetes manifests applied to staging; staging site accessible.
- [ ] Cloudflare DNS configured; `staging.safetrekr.com` resolves.
- [ ] GitHub Actions CI workflow passes on a test PR.
- [ ] GitHub Actions deploy workflow deploys to staging successfully.
- [ ] Production secrets populated in GitHub Environments.
- [ ] Production deployment completes successfully.
- [ ] Production `safetrekr.com` resolves with valid SSL.
- [ ] Health endpoint returns 200 with all checks passing.
- [ ] `www.safetrekr.com` redirects to `safetrekr.com`.
- [ ] `_next/static/*` assets are cached by Cloudflare (verify `cf-cache-status` header).
- [ ] Monitoring alerts configured and tested (fire a test alert).
- [ ] Uptime monitor active for `safetrekr.com` and `/api/health`.
- [ ] Sentry error tracking verified (throw a test error).
- [ ] Supabase backup tested (pg_dump + restore dry run).
- [ ] Rollback tested (`kubectl rollout undo` restores previous version).
- [ ] Preview deployment tested (open test PR, verify preview URL).
- [ ] Load test completed (100 concurrent users, all responses < 500ms).
- [ ] Security headers verified on all responses.
- [ ] Docker image scanned with Trivy (zero critical/high CVEs).
