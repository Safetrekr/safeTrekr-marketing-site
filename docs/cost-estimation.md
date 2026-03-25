# SafeTrekr Marketing -- Cost Estimation and Monitoring

**Task**: ST-898 (REQ-134)
**Priority**: P1
**Status**: Defined
**Last Updated**: 2026-03-24
**Depends On**: ST-790 (REQ-007 -- DOKS Cluster), ST-791 (REQ-008 -- Container Registry)

---

## 1. Monthly Infrastructure Cost Breakdown

All costs are based on published DigitalOcean, Supabase, and third-party pricing
as of March 2026. Costs are in USD.

| # | Service | Tier / Plan | Monthly Cost | Notes |
|---|---------|-------------|-------------|-------|
| 1 | DigitalOcean DOKS (control plane) | Managed K8s | $0 | Free on DigitalOcean; HA control plane included at no extra cost |
| 2 | DOKS Node Pool (2x `s-2vcpu-4gb`) | General pool | ~$48 | $24/node/month; 2 vCPU, 4 GB RAM, 80 GB SSD per node |
| 3 | DigitalOcean Load Balancer | Standard (1 unit) | ~$12 | Auto-provisioned by ingress-nginx; TCP passthrough in `nyc1` |
| 4 | DigitalOcean Container Registry | Starter | ~$5 | 500 MB storage; sufficient for ~10-15 SHA-tagged images with weekly GC |
| 5 | Supabase | Pro | ~$25 | PostgreSQL, point-in-time recovery, Auth, 8 GB database, 250K Auth MAUs |
| 6 | Plausible Analytics | Growth | ~$9 | Privacy-friendly analytics; up to 10K monthly pageviews |
| 7 | SendGrid | Free | ~$0 | Up to 100 emails/day; contact form submissions and transactional email |
| 8 | Cloudflare | Free | $0 | DNS management, basic CDN (when proxy enabled), DDoS protection, HTTP/2+3 |
| 9 | Domain (`safetrekr.com`) | Annual registration | ~$1 | Already owned; amortized monthly from annual renewal |
| 10 | Sentry | Free | $0 | Error tracking; 5K events/month, 10K performance transactions |
| 11 | UptimeRobot | Free | $0 | External uptime monitoring; 5-minute check interval |
| | **Total (baseline)** | | **~$100/month** | |

### 1.1 What Is Included at No Cost

Several critical services are available at no charge:

| Service | Free Tier Limits | Upgrade Trigger |
|---------|-----------------|-----------------|
| DOKS control plane + HA | Unlimited | N/A (always free on DO) |
| Cloudflare DNS + CDN | 3 page rules, unlimited DNS queries | Traffic > 100K views/mo or need advanced WAF rules |
| Sentry error tracking | 5K errors/month, 10K perf transactions | Error volume exceeds 5K/month (fix bugs first) |
| UptimeRobot | 50 monitors, 5-min interval | Need < 1-min checks or multi-step monitors |
| SendGrid email | 100 emails/day | Contact form volume exceeds 100/day |
| DigitalOcean Monitoring | Built-in node metrics | Need custom application metrics (add Prometheus) |

### 1.2 Cost per Component Category

| Category | Monthly Cost | % of Total |
|----------|-------------|-----------|
| Compute (DOKS nodes) | $48 | 48% |
| Networking (Load Balancer) | $12 | 12% |
| Container Registry | $5 | 5% |
| Database (Supabase) | $25 | 25% |
| Analytics (Plausible) | $9 | 9% |
| Other (domain, email, CDN) | ~$1 | 1% |
| **Total** | **~$100** | **100%** |

---

## 2. Autoscaling Cost Impact

The DOKS cluster is configured with autoscaling on the `general` node pool
(see `infrastructure/doks/cluster-spec.md` Section 2-3). Node scaling directly
affects monthly cost.

### 2.1 Node Scaling Costs

| Nodes Active | Monthly Node Cost | Total Infrastructure Cost | Trigger Scenario |
|-------------|-------------------|--------------------------|-----------------|
| 2 (baseline) | $48 | ~$100 | Normal traffic; off-peak hours |
| 3 (moderate) | $72 | ~$124 | Blog post goes viral; HPA scales pods to 4-5 |
| 4 (maximum) | $96 | ~$148 | Sustained marketing campaign; elevated SSR + image processing |

Node cost formula: `$24/node x active_nodes + $52 (fixed services)`

### 2.2 Pod Scaling (No Direct Cost Impact)

Pod autoscaling via HPA occurs within existing node capacity and does not
directly increase cost. However, pod scaling pressure triggers node scaling:

| HPA Metric | Target | Effect |
|-----------|--------|--------|
| CPU utilization | 70% average | Scale pods from 2 to 4 |
| Memory utilization | 80% average | Scale pods from 2 to 4 |

When pods cannot be scheduled on existing nodes (pending pods), the DOKS
cluster autoscaler adds a node within 30 seconds.

### 2.3 Scale-Down Behavior

Nodes scale down when utilization drops below 35% CPU and memory for 10
minutes sustained. The cluster always maintains a minimum of 2 nodes. This
means overnight / low-traffic periods will not incur extra node costs.

---

## 3. Scaling Projections by Traffic Tier

Cost projections based on expected traffic growth. These assume the Next.js
site uses ISR/SSG for most pages (minimal SSR overhead per request).

### 3.1 Traffic Tier Summary

| Traffic Tier | Monthly Visits | Monthly Cost | Key Changes |
|-------------|---------------|-------------|-------------|
| Launch | 0 - 10K | ~$100 | Current plan; 2 DOKS nodes, Plausible Growth |
| Growth | 10K - 50K | ~$140 - $160 | Occasional 3rd node; upgrade Plausible to Business ($19/mo) |
| Scale | 50K - 100K | ~$225 - $275 | Sustained 3-4 nodes; Plausible Business ($19/mo); consider DO Spaces CDN ($5/mo) |
| Breakout | 100K+ | ~$300+ | Max nodes sustained; SendGrid Essentials ($15/mo); evaluate Cloudflare Pro ($20/mo) |

### 3.2 Detailed Tier Breakdown

**Launch Tier (0 - 10K visits/month) -- ~$100/month**

No changes from baseline. Two DOKS nodes handle all traffic. ISR pages are
served from cache on most requests. Sharp image optimization handles
occasional on-demand processing without memory pressure.

**Growth Tier (10K - 50K visits/month) -- ~$140 - $160/month**

| Change | Cost Delta | Reason |
|--------|-----------|--------|
| DOKS scales to 3 nodes intermittently | +$0 to +$24 | Autoscaler handles traffic spikes; drops back to 2 during off-peak |
| Plausible upgrade to Business | +$10 | Growth plan caps at 10K pageviews; Business supports 100K |
| SendGrid stays free or upgrades | +$0 to +$15 | Only upgrade if contact form volume exceeds 100 emails/day |

**Scale Tier (50K - 100K visits/month) -- ~$225 - $275/month**

| Change | Cost Delta | Reason |
|--------|-----------|--------|
| DOKS runs 3-4 nodes regularly | +$24 to +$48 | Sustained traffic keeps utilization above scale-down threshold |
| Supabase may need compute add-on | +$0 to +$25 | Monitor database CPU; add compute if query latency rises |
| DigitalOcean Spaces CDN (optional) | +$5 | Offload static asset bandwidth from cluster nodes |
| Cloudflare proxy enabled | +$0 | Enable orange cloud for edge caching (requires DNS-01 cert migration) |

**Breakout Tier (100K+ visits/month) -- $300+/month**

At this tier, evaluate:
- Increasing DOKS max nodes beyond 4 (update `cluster-spec.md` and `provision.sh`)
- Upgrading DOKS node size to `s-4vcpu-8gb` ($48/node) if memory is the bottleneck
- Cloudflare Pro plan ($20/month) for advanced caching rules and Web Analytics
- SendGrid Essentials ($15/month) for higher email volume
- Supabase Team plan ($599/month) if database becomes a bottleneck (unlikely for marketing site)

### 3.3 Cost Projection Chart

```
Monthly Cost ($)
  |
350|                                          ............
300|                                    ......
275|                              ......
250|                        ......
225|                  ......
200|
175|
160|            ......
140|      ......
100|......
  +---+---+---+---+---+---+---+---+---+---+----> Monthly Visits (K)
  0   10  20  30  40  50  60  70  80  90  100
```

---

## 4. DigitalOcean Billing Alerts

### 4.1 Recommended Alert Thresholds

Configure billing alerts in the DigitalOcean Dashboard to catch unexpected
spend before it compounds.

| Threshold | Severity | Meaning | Action |
|-----------|----------|---------|--------|
| **$100/month** | Informational | Normal operating range | No action; confirms baseline is healthy |
| **$150/month** | Warning | Above baseline; autoscaling likely active | Investigate: check node count (`kubectl get nodes`), HPA status, preview namespace sprawl |
| **$200/month** | Critical | Anomalous spend | Immediate investigation: check for stuck scaled-up nodes, zombie preview deployments, or runaway image builds |

### 4.2 Setup Instructions

1. Log in to the **DigitalOcean Dashboard** at [cloud.digitalocean.com](https://cloud.digitalocean.com).

2. Navigate to **Settings** (gear icon in the left sidebar) > **Billing**.

3. Click the **Settings** tab within Billing.

4. Under **Billing Alerts**, click **Edit** (or **Add Alert** if none exist).

5. Configure three alerts:

   **Alert 1 -- Normal Baseline:**
   - Threshold: `$100`
   - Email: DevOps distribution list

   **Alert 2 -- Elevated Spend:**
   - Threshold: `$150`
   - Email: DevOps distribution list + Engineering lead

   **Alert 3 -- Anomalous Spend:**
   - Threshold: `$200`
   - Email: DevOps distribution list + Engineering lead + Finance

6. Click **Save**.

### 4.3 Billing Alert Verification

After configuring alerts, verify they are active:

```bash
# Check current month-to-date spend via doctl
doctl balance get

# Expected output (example):
# Month-to-date Balance    $62.14
# Account Balance          $0.00
# Month-to-date Usage      $62.14
# Generated At             2026-03-24T15:00:00Z
```

### 4.4 Monthly Review Cadence

| Cadence | Action | Owner |
|---------|--------|-------|
| Weekly | Glance at DigitalOcean billing dashboard; confirm no anomalies | DevOps engineer |
| Monthly (1st of month) | Full cost review: compare actual vs. projected; document in this file | DevOps lead |
| Quarterly | Right-sizing review: evaluate node size, autoscaler bounds, and Supabase plan | DevOps lead + Finance |
| Annually | Vendor review: compare DigitalOcean pricing against alternatives; renegotiate if needed | Engineering lead |

### 4.5 What to Check When an Alert Fires

**$150 alert fired -- Elevated Spend Checklist:**

```bash
# 1. Check current node count (should be 2 during normal operations)
kubectl get nodes

# 2. Check if autoscaler is holding extra nodes
kubectl describe nodes | grep -A 5 "Allocatable"

# 3. Check HPA -- are pods scaled up?
kubectl get hpa -n production

# 4. Check for preview namespace sprawl (stale PR environments)
kubectl get pods -n preview

# 5. Check container registry storage (approaching Starter limit?)
doctl registry get
doctl registry repository list-tags safetrekr-web
```

**$200 alert fired -- Anomalous Spend Checklist:**

In addition to the steps above:

```bash
# 6. Check if nodes are stuck in a scaling loop
kubectl get events -A --sort-by='.lastTimestamp' | grep -i "scale"

# 7. Check for unexpected resources (accidental deployments, test services)
kubectl get all -A

# 8. Review DigitalOcean billing breakdown by resource
#    Dashboard > Billing > View detailed usage
```

---

## 5. Cost Optimization Tips

### 5.1 Leverage ISR and SSG to Minimize Server Load

The Next.js application is configured with `output: "standalone"` and should
serve the majority of pages via Incremental Static Regeneration (ISR) or full
Static Site Generation (SSG). This means:

- **Static pages** are generated at build time and served as plain HTML with
  no server-side computation per request.
- **ISR pages** are served from a stale-while-revalidate cache. The server
  only re-renders a page when the revalidation interval expires and a request
  arrives.
- **SSR pages** (if any) require server computation on every request and
  consume the most CPU and memory.

**Optimization actions:**

| Action | Impact | How |
|--------|--------|-----|
| Default all pages to SSG or ISR | Reduces pod CPU by 60-80% vs. SSR | Use `export const dynamic = 'force-static'` or `revalidate = 3600` |
| Set ISR revalidation to 1 hour minimum | Reduces re-render frequency | `export const revalidate = 3600` in page files |
| Pre-render all known routes at build time | Zero server cost for those pages | Use `generateStaticParams()` for dynamic routes |
| Avoid `dynamic = 'force-dynamic'` unless necessary | Prevents SSR fallback | Audit pages quarterly for unnecessary SSR |

### 5.2 Leverage Cloudflare Caching

Cloudflare (free tier) provides edge caching that can offload significant
bandwidth from the DOKS cluster. Even with the proxy initially disabled,
plan for enabling it:

| Action | Impact | Prerequisite |
|--------|--------|-------------|
| Enable Cloudflare proxy (orange cloud) | Edge-cached static assets; 20ms latency vs. 100-200ms from origin | Migrate cert-manager to DNS-01 challenges (see `dns-spec.md` Section 1.2) |
| Apply page rules for `/_next/static/*` | 1-month edge TTL; 1-year browser TTL | Proxy must be enabled |
| Apply page rules for `/_next/image*` | 1-day edge TTL; reduces Sharp CPU load | Proxy must be enabled |
| Enable Always Online | Serves stale pages during origin downtime | Already configured in Cloudflare settings |

See `infrastructure/dns/cloudflare-page-rules.md` for full rule definitions.

**Expected savings once proxy is enabled:**
- 50-70% reduction in Load Balancer bandwidth
- 30-50% reduction in pod CPU from cached image responses
- Potential to delay node scaling from 2 to 3 by months

### 5.3 Right-Size DOKS Nodes Quarterly

Node sizing should be reviewed quarterly using actual utilization data.

**Quarterly review process:**

```bash
# 1. Check average node utilization over the past 30 days
#    (use DigitalOcean Monitoring graphs or kubectl top)
kubectl top nodes

# 2. Check pod resource consumption patterns
kubectl top pods -n production

# 3. Review HPA scaling history
kubectl describe hpa safetrekr-web -n production
```

**Decision matrix:**

| Observation | Action |
|-------------|--------|
| Nodes consistently < 40% CPU and < 50% memory | Consider downgrading to `s-1vcpu-2gb` ($12/node) -- but verify Sharp memory spikes first |
| Nodes consistently > 70% CPU or > 80% memory | Verify autoscaler is adding nodes; if max nodes reached, increase max or upgrade node size |
| Autoscaler adds a 3rd node daily | Increase base node count to 3 in `provision.sh` to avoid scale-up latency |
| 3rd node rarely used (< 10% of the month) | Current config is optimal; autoscaler handles spikes efficiently |

### 5.4 Monitor Supabase Usage

Supabase Pro plan includes generous limits, but usage should be monitored to
avoid surprise overages:

| Supabase Metric | Pro Plan Limit | Alert Threshold | Action |
|----------------|---------------|-----------------|--------|
| Database size | 8 GB | 6 GB (75%) | Review data retention; archive old records |
| Auth MAUs | 100K | 75K | Evaluate if auth is needed for marketing site |
| Edge Function invocations | 2M/month | 1.5M | Optimize function code; add caching |
| Realtime concurrent connections | 500 | 400 | Check for connection leaks |
| Storage | 100 GB | 75 GB | Audit uploaded assets; compress images |

**Check current usage:**

1. Log in to [supabase.com/dashboard](https://supabase.com/dashboard).
2. Select the SafeTrekr project.
3. Navigate to **Settings > Billing > Usage**.
4. Review each metric against the thresholds above.

### 5.5 Container Registry Housekeeping

The DOCR Starter plan (500 MB) is sufficient with weekly garbage collection.
If storage approaches the limit:

```bash
# Check current storage usage
doctl registry get

# List all image tags (sorted by date)
doctl registry repository list-tags safetrekr-web

# Run garbage collection manually if needed
./infrastructure/registry/cleanup.sh
```

The weekly cleanup cron job (`infrastructure/registry/cleanup.sh`) retains the
10 most recent tags and removes anything older than 30 days. See
`infrastructure/registry/registry-spec.md` Section 6 for details.

### 5.6 Preview Environment Cleanup

Stale preview environments (from merged or closed PRs) consume pod resources
and can push the cluster toward unnecessary scaling.

```bash
# List all pods in the preview namespace
kubectl get pods -n preview

# Check for deployments that should have been cleaned up
kubectl get deployments -n preview

# If stale resources exist, delete them
kubectl delete deployment <stale-deployment> -n preview
```

A weekly cleanup cron job (Sunday 3 AM UTC) is scheduled to remove preview
resources. If stale resources persist, investigate the cleanup pipeline in
GitHub Actions.

---

## 6. Cost Comparison: Current Stack vs. Alternatives

For context, here is how the SafeTrekr infrastructure cost compares to
common alternatives:

| Approach | Monthly Cost | Trade-offs |
|----------|-------------|------------|
| **SafeTrekr (DOKS + Supabase)** | **~$100** | Full control; production-grade K8s; scales to 100K+ visits |
| Vercel Pro + Supabase Pro | ~$45 | Simpler; but less control over infra; Vercel bandwidth limits |
| AWS EKS + RDS | ~$200+ | Enterprise-grade; higher cost floor; operational complexity |
| Render + PlanetScale | ~$60 | Simple; limited scaling options; fewer regions |
| Railway + Supabase | ~$40 | Easy deploy; limited customization; less mature |
| Bare metal VPS + self-managed DB | ~$30 | Cheapest; no HA; manual scaling; no managed backups |

The current stack provides a strong balance of cost, control, and
production-readiness. The $100/month floor is competitive for a stack that
includes managed Kubernetes, automated TLS, autoscaling, and a managed
database with point-in-time recovery.

---

## 7. Annual Cost Projection

| Scenario | Monthly | Annual | Notes |
|----------|---------|--------|-------|
| Steady state (2 nodes) | $100 | $1,200 | No traffic growth |
| Moderate growth (occasional 3rd node) | $130 | $1,560 | 10-30K visits/month average |
| Active growth (3 nodes baseline) | $175 | $2,100 | 30-50K visits/month average |
| High growth (4 nodes, upgraded services) | $275 | $3,300 | 50-100K visits/month average |

---

## 8. Cost Governance Checklist

Use this checklist during the monthly cost review:

- [ ] **Billing alerts**: Confirm all three thresholds ($100, $150, $200) are active in DigitalOcean
- [ ] **Node count**: Verify cluster is running expected number of nodes (`kubectl get nodes`)
- [ ] **HPA status**: Check that HPA is not stuck at max replicas (`kubectl get hpa -n production`)
- [ ] **Preview cleanup**: Confirm no stale preview deployments exist (`kubectl get pods -n preview`)
- [ ] **Registry storage**: Verify DOCR storage is below 400 MB (`doctl registry get`)
- [ ] **Supabase usage**: Check database size, Auth MAUs, and Edge Function invocations in Supabase dashboard
- [ ] **Plausible pageviews**: Confirm traffic is within plan limits
- [ ] **SendGrid usage**: Verify daily email volume is within free tier limits
- [ ] **DigitalOcean balance**: Run `doctl balance get` and compare to projection
- [ ] **Cost trend**: Is month-over-month spend increasing? If so, correlate with traffic growth

---

## 9. When to Re-Evaluate This Document

Revisit and update this cost estimation when any of the following occur:

| Trigger | Likely Change |
|---------|--------------|
| Monthly visits consistently exceed 10K | Upgrade Plausible; update scaling projections |
| DOKS node pool max increased beyond 4 | Update Section 2 and Section 3 cost projections |
| Supabase plan upgraded | Update Section 1 table and annual projection |
| Cloudflare proxy enabled | Document bandwidth savings; update optimization tips |
| New service added to infrastructure | Add line item to Section 1; update total |
| DigitalOcean pricing changes | Re-validate all cost figures in Section 1 |
| SendGrid upgrades to paid plan | Add cost to Section 1; update total |

---

## 10. Related Requirements

| Requirement | Description | Relationship |
|-------------|-------------|-------------|
| REQ-007 | DOKS Cluster Provisioning (`infrastructure/doks/cluster-spec.md`) | Cluster and node costs sourced from Section 7 |
| REQ-008 | Container Registry (`infrastructure/registry/registry-spec.md`) | Registry cost sourced from Section 1 |
| REQ-009 | Kubernetes Manifests (`infrastructure/k8s/base/`) | Resource requests/limits affect pod density and scaling |
| REQ-022 | DNS and CDN Configuration (`infrastructure/dns/dns-spec.md`) | Cloudflare caching reduces compute cost |
| REQ-134 | This document -- Cost Estimation and Monitoring | -- |
| ST-806 | Monitoring and Alerting Specification (`infrastructure/monitoring/monitoring-spec.md`) | Monitoring costs included in Section 1 |
