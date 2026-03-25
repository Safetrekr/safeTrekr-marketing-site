# SafeTrekr Marketing -- DOKS Cluster Specification

**Task**: ST-790 (REQ-007)
**Priority**: P0
**Status**: Defined
**Last Updated**: 2026-03-24

---

## 1. Cluster Identity

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Cluster name | `safetrekr-marketing` | Matches project naming convention |
| Provider | DigitalOcean Kubernetes (DOKS) | Per TECH-STACK.md binding decision |
| Region | `nyc1` (New York 1) | Co-located with Supabase US East for low-latency DB calls |
| Kubernetes version | `1.31.x` (latest stable patch) | LTS support from DigitalOcean; verified compatible with ingress-nginx and cert-manager |
| VPC | Default VPC in `nyc1` | Network isolation; all cluster traffic stays within the VPC |
| HA Control Plane | **Enabled** | $0 additional cost on DOKS; provides redundant API servers and etcd for production reliability |
| Tags | `safetrekr`, `marketing`, `production` | Resource identification and billing grouping |

---

## 2. Node Pool Configuration

### 2.1 General Pool

| Parameter | Value |
|-----------|-------|
| Pool name | `general` |
| Purpose | All application workloads (Next.js pods, ingress controller, cert-manager, monitoring) |
| Droplet size | `s-2vcpu-4gb` |
| vCPUs per node | 2 |
| RAM per node | 4 GB |
| Disk per node | 80 GB SSD |
| Initial node count | 2 |
| Autoscale | Enabled |
| Minimum nodes | 2 |
| Maximum nodes | 4 |
| Cost per node | $24/month |
| Base cost (2 nodes) | $48/month |
| Max cost (4 nodes) | $96/month |

### 2.2 Node Sizing Rationale

**Why 2 nodes minimum:**
- Zero-downtime rolling updates require at least 2 nodes. During deployment, pods running the previous version continue serving traffic on one node while new pods start on the other.
- A single-node cluster would experience downtime during every rollout because `maxUnavailable: 0` in the deployment strategy requires replacement pods to be scheduled before old pods are terminated.
- `topologySpreadConstraints` in the Deployment spec distributes pods across nodes; this requires a minimum of 2 nodes to function.

**Why `s-2vcpu-4gb`:**
- Next.js standalone server with `sharp` image optimization is memory-intensive during on-demand image processing. Each pod requests 256Mi and is limited to 512Mi.
- 4 GB RAM per node provides capacity for 2-3 application pods plus system workloads (ingress-nginx controller, cert-manager, metrics-server, kube-system pods).
- 2 vCPUs are sufficient for a marketing site that serves predominantly static/ISR pages with occasional server-side rendering.

**Why not `s-1vcpu-2gb`:**
- 2 GB RAM leaves insufficient headroom after kube-system pods consume ~400-600 MB. Sharp image processing spikes would push pods into OOMKilled state.

---

## 3. Autoscaling Policy

### 3.1 Scale-Up Triggers

| Condition | Threshold | Observation Window |
|-----------|-----------|-------------------|
| Unschedulable pods | Pending pods exist | 30 seconds |
| Pool CPU utilization | > 70% | 5 minutes sustained |
| Pool memory utilization | > 80% | 5 minutes sustained |

Scale-up adds one node at a time, up to the maximum of 4 nodes.

### 3.2 Scale-Down Triggers

| Condition | Threshold | Observation Window |
|-----------|-----------|-------------------|
| Node utilization | < 35% CPU and memory | 10 minutes sustained |
| Pod constraints | No pods with local storage or PodDisruptionBudget violations | Checked at scale-down time |
| Minimum floor | 2 nodes always maintained | Hard constraint |

Scale-down removes one node at a time. The cluster autoscaler will gracefully drain the node (respecting PDBs) before removal.

### 3.3 Expected Scaling Scenarios

| Scenario | Expected Nodes | Trigger |
|----------|---------------|---------|
| Normal traffic | 2 | Baseline |
| Blog post goes viral | 3 | HPA scales pods to 4-5; pod scheduling pressure triggers node scale-up |
| Sustained marketing campaign | 3-4 | Elevated CPU from SSR and image processing |
| Off-peak / overnight | 2 | Utilization drops below 35% threshold |

---

## 4. Namespace Strategy

| Namespace | Purpose | Created By |
|-----------|---------|------------|
| `production` | Live site serving `safetrekr.com` | `provision.sh` |
| `staging` | Pre-production validation at `staging.safetrekr.com` | `provision.sh` |
| `preview` | Ephemeral per-PR preview deployments; cleaned up weekly | `provision.sh` |
| `monitoring` | Prometheus, Grafana, alerting stack (isolated) | `provision.sh` |
| `ingress-nginx` | Nginx Ingress Controller (created by Helm install) | Helm chart |
| `cert-manager` | Certificate management (created by Helm install) | Helm chart |

### 4.1 Namespace Labels and Annotations

All application namespaces (`production`, `staging`, `preview`) receive the following labels:

```yaml
labels:
  app.kubernetes.io/part-of: safetrekr-marketing
  pod-security.kubernetes.io/enforce: restricted
  pod-security.kubernetes.io/enforce-version: latest
  pod-security.kubernetes.io/warn: restricted
  pod-security.kubernetes.io/audit: restricted
```

The `restricted` Pod Security Standard enforces:
- Containers must run as non-root
- Containers must drop ALL capabilities
- Seccomp profile must be RuntimeDefault or Localhost
- HostPath volumes are prohibited
- Privilege escalation is blocked

### 4.2 Resource Quotas

Resource quotas are applied per namespace to prevent runaway consumption:

**Production namespace:**
```yaml
requests.cpu: "4"
requests.memory: 4Gi
limits.cpu: "8"
limits.memory: 8Gi
pods: "20"
services: "5"
```

**Staging namespace:**
```yaml
requests.cpu: "2"
requests.memory: 2Gi
limits.cpu: "4"
limits.memory: 4Gi
pods: "10"
services: "3"
```

**Preview namespace:**
```yaml
requests.cpu: "2"
requests.memory: 2Gi
limits.cpu: "4"
limits.memory: 4Gi
pods: "15"
services: "10"
```

---

## 5. Cluster Add-ons

Installed after cluster creation, before any application deployment.

| Add-on | Purpose | Installation Method | Namespace |
|--------|---------|---------------------|-----------|
| Nginx Ingress Controller | HTTP routing, SSL termination, gzip/brotli compression, rate limiting | Helm (`ingress-nginx/ingress-nginx`) | `ingress-nginx` |
| cert-manager | Automated TLS certificate provisioning via Let's Encrypt | Helm (`jetstack/cert-manager`) | `cert-manager` |
| metrics-server | Resource metrics for HPA (CPU/memory) | DigitalOcean 1-Click or Helm | `kube-system` |

### 5.1 Add-on Versions (Pin in Helm)

| Chart | Minimum Version | Notes |
|-------|----------------|-------|
| `ingress-nginx/ingress-nginx` | 4.9.x | Supports Kubernetes 1.31 |
| `jetstack/cert-manager` | 1.14.x | CRD install included |
| `metrics-server` | 0.7.x | Usually pre-installed on DOKS |

---

## 6. Networking

### 6.1 Load Balancer

DOKS provisions a DigitalOcean Load Balancer automatically when the Nginx Ingress Controller Service of type `LoadBalancer` is created.

| Parameter | Value |
|-----------|-------|
| Type | DigitalOcean Load Balancer |
| Cost | ~$12/month |
| Protocol | TCP passthrough (TLS terminated at Ingress) |
| Health check | TCP port 80 |
| Region | `nyc1` (same as cluster) |

### 6.2 DNS Integration

The Load Balancer's external IP is pointed to by Cloudflare DNS:
- `safetrekr.com` -> A record -> LB IP
- `www.safetrekr.com` -> CNAME -> `safetrekr.com`
- `staging.safetrekr.com` -> A record -> LB IP (routed by Ingress host rules)

### 6.3 Network Policies

Default deny-all ingress and egress in application namespaces. Explicit allow rules for:
- **Ingress**: From `ingress-nginx` namespace only (pods with label `app.kubernetes.io/name: ingress-nginx`)
- **Egress**: DNS (port 53), Supabase, SendGrid, Cloudflare, Plausible, MapTiler
- **Inter-namespace**: Application pods cannot communicate with pods in other namespaces

See `infra/k8s/base/network-policy.yaml` for full manifests (REQ-096).

---

## 7. Cost Estimation

### 7.1 DOKS Cluster Costs

| Component | Monthly Cost | Notes |
|-----------|-------------|-------|
| DOKS control plane | $0 | Free on DigitalOcean (HA included) |
| 2x `s-2vcpu-4gb` nodes (base) | $48 | $24/node/month |
| Load Balancer | $12 | Auto-provisioned by ingress-nginx |
| **DOKS subtotal (base)** | **$60** | |

### 7.2 Autoscale Cost Impact

| Nodes Active | Monthly Cost (nodes only) | Total with LB |
|-------------|--------------------------|---------------|
| 2 (baseline) | $48 | $60 |
| 3 (moderate traffic) | $72 | $84 |
| 4 (peak traffic) | $96 | $108 |

### 7.3 Full Infrastructure Cost (from PRD REQ-134)

| Service | Monthly Cost |
|---------|-------------|
| DOKS (2 nodes) | $48 |
| Load Balancer | $12 |
| Container Registry (Starter) | $5 |
| Supabase (Pro) | $25 |
| Plausible Analytics | $9 |
| **Total (baseline)** | **~$99/month** |
| **Total (with autoscale headroom)** | **~$100-120/month** |

### 7.4 Billing Alerts

Configure DigitalOcean billing alerts at the following thresholds:
- **$100/month** -- Normal operating range; informational
- **$150/month** -- Above baseline; investigate autoscaling frequency
- **$200/month** -- Anomalous; check for stuck scaled-up nodes or preview namespace sprawl

---

## 8. Security Configuration

### 8.1 Cluster-Level Security

| Control | Configuration |
|---------|--------------|
| RBAC | Enabled (default on DOKS) |
| Pod Security Standards | `restricted` enforced on all application namespaces |
| Network Policies | Default deny; explicit allow rules per namespace |
| Service Account Tokens | `automountServiceAccountToken: false` on application ServiceAccounts |
| Secrets | Encrypted at rest (DOKS default); application secrets via Sealed Secrets |
| Image Pull | Registry access via `doctl registry kubernetes-manifest` (no image pull secrets needed) |

### 8.2 Access Control

| Role | Access Level | Method |
|------|-------------|--------|
| CI/CD (GitHub Actions) | Deploy to namespaces | DOKS API token with scoped permissions |
| DevOps engineer | Full cluster admin | `doctl kubernetes cluster kubeconfig save` |
| Developers | Read-only production; full staging/preview | RBAC ClusterRoleBindings |

---

## 9. Maintenance Windows

| Task | Frequency | Window |
|------|-----------|--------|
| Kubernetes version upgrade | Quarterly | Sunday 2-4 AM EST |
| Node OS patches | Monthly (auto-applied by DO) | Rolling; no downtime |
| cert-manager / ingress upgrades | As needed | Staging first, then production |
| Preview namespace cleanup | Weekly (automated) | Sunday 3 AM UTC via GitHub Actions cron |

---

## 10. Monitoring and Observability

| Metric | Source | Alert Threshold |
|--------|--------|----------------|
| Node CPU | metrics-server | > 80% for 10 min |
| Node memory | metrics-server | > 85% for 10 min |
| Pod restarts | kube-state-metrics | > 3 restarts in 5 min |
| Node not ready | kubelet | Any node NotReady for > 2 min |
| Certificate expiry | cert-manager | < 14 days remaining |
| Disk usage | node-exporter | > 85% |
| Pod pending | kube-scheduler | Pending > 60 seconds |

DigitalOcean Monitoring is enabled at the cluster level for baseline metrics. For advanced observability, Prometheus and Grafana are deployed in the `monitoring` namespace (REQ-134).

---

## 11. Disaster Recovery

| Concern | Strategy |
|---------|----------|
| Node failure | Autoscaler replaces failed nodes; PDB ensures minimum 1 pod available during disruption |
| Full cluster loss | Re-provision via `provision.sh`; redeploy from Git (all manifests are version-controlled) |
| Data loss | No persistent data in the cluster; all state lives in Supabase (external) |
| Certificate loss | cert-manager automatically re-issues from Let's Encrypt |
| Registry failure | Images are rebuilt from source via GitHub Actions; no single point of failure |

Recovery Time Objective (RTO): < 30 minutes (full cluster re-provision + deploy)
Recovery Point Objective (RPO): 0 (no data stored in cluster; source of truth is Git + Supabase)

---

## 12. Related Requirements

| Requirement | Description | Dependency Direction |
|-------------|-------------|---------------------|
| REQ-007 | This document (DOKS Cluster Provisioning) | -- |
| REQ-008 | DigitalOcean Container Registry | Depends on REQ-007 |
| REQ-009 | Kubernetes Manifests | Depends on REQ-007 |
| REQ-010 | Nginx Ingress Controller and SSL | Depends on REQ-007 |
| REQ-096 | Kubernetes Network Policies | Depends on REQ-009 |
| REQ-097 | Secret Management | Depends on REQ-009 |
| REQ-134 | Cost Estimation and Monitoring | Depends on REQ-007 |
