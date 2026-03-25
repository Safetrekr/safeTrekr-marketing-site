# Backup and Disaster Recovery Plan -- SafeTrekr Marketing Site

**Task**: ST-896
**Version**: 1.0
**Last Updated**: 2026-03-24
**Classification**: Internal -- Engineering and Platform Teams
**Owner**: Platform Engineering
**Review Cadence**: Quarterly

---

## 1. Overview

This document defines the backup strategy, recovery procedures, and disaster recovery (DR) targets for the SafeTrekr marketing site (`safetrekr.com`). It covers every stateful component in the stack and provides step-by-step runbooks for restoring service after partial or total infrastructure loss.

**Scope**: Production environment only. Staging and preview environments are ephemeral and can be fully rebuilt from Git without backup.

**Guiding principle**: The SafeTrekr marketing site is designed to be **stateless at the cluster level**. All persistent state lives in Supabase (external managed service) or Git (source of truth for code and infrastructure). The Kubernetes cluster can be destroyed and recreated from scratch with zero data loss.

**Related documents**:

| Document | Path |
|----------|------|
| Cluster specification | `infrastructure/doks/cluster-spec.md` |
| Cluster provisioning script | `infrastructure/doks/provision.sh` |
| Container registry specification | `infrastructure/registry/registry-spec.md` |
| DNS and CDN configuration | `infrastructure/dns/dns-spec.md` |
| Secret management policy | `infrastructure/security/secret-management.md` |
| Incident response plan | `infrastructure/security/incident-response.md` |
| K8s base manifests | `infrastructure/k8s/base/` |
| Production overlay | `infrastructure/k8s/overlays/production/kustomization.yaml` |

---

## 2. Architecture Summary

```
                    Internet
                       |
               [ Cloudflare DNS ]
                       |
              [ DO Load Balancer ]    ($12/month, TCP passthrough)
                       |
              [ ingress-nginx ]       (TLS termination, gzip/brotli)
                       |
              [ Next.js pods ]        (2-4 replicas, stateless)
                    /      \
     [ Supabase PostgreSQL ]  [ SendGrid ]
       (managed, external)    (transactional email)
```

| Component | Provider | Type | Stateful? |
|-----------|----------|------|-----------|
| Application (Next.js) | DigitalOcean DOKS (`nyc1`) | Kubernetes Deployment (2-4 pods) | No -- all state in Supabase |
| Database | Supabase (PostgreSQL, Pro plan) | Managed, external | Yes -- form submissions, waitlist entries |
| Container Registry | DigitalOcean Container Registry (Starter, $5/mo) | Managed | No -- images are reproducible from Git |
| DNS | Cloudflare | Managed | No -- records documented in `dns-spec.md` |
| TLS Certificates | Let's Encrypt via cert-manager | Auto-provisioned | No -- re-issued automatically |
| Load Balancer | DigitalOcean | Auto-provisioned by ingress-nginx | No -- recreated with Helm install |
| Secrets | K8s Secrets (injected by CI/CD) | Cluster-resident | Yes -- must be re-created from provider dashboards |

---

## 3. Backup Strategy

### 3.1 Supabase Database

Supabase is the **only stateful component** that holds data not reproducible from Git.

| Backup Type | Mechanism | Frequency | Retention | Notes |
|-------------|-----------|-----------|-----------|-------|
| Point-in-Time Recovery (PITR) | Supabase Pro plan built-in (WAL archiving) | Continuous | 7 days | Restore to any second within the retention window |
| Automatic daily backups | Supabase Pro plan built-in | Daily | 7 days | Full logical backup, downloadable from dashboard |

**What is backed up**:
- All tables (form submissions, waitlist entries, contact requests)
- Row Level Security (RLS) policies
- Database functions, triggers, and extensions
- Storage objects (if any)

**What is NOT backed up by Supabase**:
- Edge Functions (stored in Git)
- Auth configuration (manually configured in dashboard; documented in project setup)
- Dashboard settings

**Verification**: Monthly, download a daily backup from the Supabase dashboard and restore it to a local PostgreSQL instance to confirm integrity. Log the result in the DR test log.

### 3.2 Kubernetes Manifests

All Kubernetes manifests are version-controlled in Git and can recreate the full cluster state.

| Resource | Git Path | Notes |
|----------|----------|-------|
| Kustomize base (Deployment, Service, Ingress, HPA, PDB, NetworkPolicy, ConfigMap, Secret template, ServiceAccount) | `infrastructure/k8s/base/` | 10 manifest files |
| Production overlay | `infrastructure/k8s/overlays/production/kustomization.yaml` | Namespace, image tag, resource limits, ingress host |
| Staging overlay | `infrastructure/k8s/overlays/staging/kustomization.yaml` | |
| Preview overlay | `infrastructure/k8s/overlays/preview/kustomization.yaml` | |
| Ingress controller values | `infrastructure/k8s/ingress/nginx-ingress-values.yaml` | Helm values for ingress-nginx |
| cert-manager values | `infrastructure/k8s/ingress/cert-manager-values.yaml` | Helm values for cert-manager |
| ClusterIssuers | `infrastructure/k8s/ingress/cluster-issuers.yaml` | Let's Encrypt production + staging issuers |
| Namespace definitions + quotas | `infrastructure/doks/namespaces.yaml` | production, staging, preview, monitoring |
| Cluster provisioning script | `infrastructure/doks/provision.sh` | Full idempotent cluster setup |
| Network policies | `infrastructure/k8s/base/network-policy.yaml` | Default deny + explicit allow rules |

**Backup method**: Git is the backup. The `main` branch always reflects the deployed production state. No additional backup is needed for manifests.

### 3.3 Container Images

| Parameter | Value |
|-----------|-------|
| Registry | `registry.digitalocean.com/safetrekr-marketing` |
| Repository | `safetrekr-web` |
| Tag format | `sha-{7-char-git-SHA}` (immutable, no `latest` in production) |
| Retention | 10 most recent tags kept; older tags pruned weekly by `infrastructure/registry/cleanup.sh` |
| Effective retention window | ~30 days of deployable images (depends on deploy frequency) |

**Key point**: Container images are **reproducible artifacts**. If the registry is lost, any image can be rebuilt from its corresponding Git commit:

```bash
git checkout <commit-sha>
docker build -t registry.digitalocean.com/safetrekr-marketing/safetrekr-web:sha-<short-sha> .
docker push registry.digitalocean.com/safetrekr-marketing/safetrekr-web:sha-<short-sha>
```

### 3.4 Application Content

All site content (pages, components, styles, images in `public/`) lives in the Git repository. Git is the single source of truth.

| Content Type | Location | Backup Method |
|--------------|----------|---------------|
| Next.js pages and components | `src/` | Git |
| Static assets (images, fonts) | `public/` | Git |
| Configuration files | `next.config.ts`, `tailwind.config.ts`, etc. | Git |
| Infrastructure manifests | `infrastructure/` | Git |
| Documentation | `docs/` | Git |

**Git hosting**: GitHub. GitHub maintains its own redundancy and backup systems. For additional protection, the repository can be mirrored to a secondary Git host if needed.

### 3.5 Environment Variables and Secrets

| Category | Storage (Production) | Recovery Method |
|----------|---------------------|-----------------|
| Non-secret config (`NEXT_PUBLIC_*`) | K8s ConfigMap (generated by Kustomize overlay) | Re-apply from `infrastructure/k8s/overlays/production/kustomization.yaml` |
| Secrets (`SUPABASE_SERVICE_ROLE_KEY`, `SENDGRID_API_KEY`, `TURNSTILE_SECRET_KEY`, `IP_HASH_SALT`) | K8s Secret (`safetrekr-web-secrets`) | Re-create from provider dashboards (Supabase, SendGrid, Cloudflare) |
| CI/CD secrets (`DIGITALOCEAN_ACCESS_TOKEN`) | GitHub repository secrets | Re-create from DigitalOcean dashboard |

**Important**: Secret values are NOT stored in Git (by design). Recovery requires access to the provider dashboards. The `.env.example` file documents every required variable with descriptions. The `infrastructure/security/secret-management.md` file maintains the full secret inventory with rotation schedule.

### 3.6 DNS Records

All DNS records are documented in `infrastructure/dns/dns-spec.md` Section 6 (Complete DNS Record Inventory). This serves as the recovery reference if records need to be recreated in Cloudflare.

| Record | Type | Purpose |
|--------|------|---------|
| `safetrekr.com` | A | Root domain to DO Load Balancer IP |
| `www.safetrekr.com` | CNAME | www redirect to apex |
| `staging.safetrekr.com` | CNAME | Staging environment |
| `*.preview.safetrekr.com` | CNAME | PR preview deployments |
| SPF, DKIM, DMARC | TXT/CNAME | Email deliverability (SendGrid) |

---

## 4. RPO/RTO Targets

### 4.1 Recovery Point Objective (RPO)

| Component | RPO | Rationale |
|-----------|-----|-----------|
| Supabase database | **1 hour** | PITR provides continuous WAL archiving; worst case is up to the last archived WAL segment. In practice, RPO is closer to seconds. |
| Application code | **0** | Git is the source of truth; no data is generated at the cluster level. |
| Container images | **0** | Reproducible from Git source at any commit. |
| K8s manifests | **0** | Version-controlled in Git. |
| DNS records | **0** | Documented in `dns-spec.md`; can be recreated from documentation. |
| Secrets | **0** | Values are retrievable from provider dashboards (Supabase, SendGrid, Cloudflare, DigitalOcean). |

**Overall RPO: 1 hour** (bounded by Supabase PITR).

### 4.2 Recovery Time Objective (RTO)

| Scenario | RTO | Breakdown |
|----------|-----|-----------|
| Single pod failure | **< 1 minute** | Kubernetes restarts the pod automatically. PDB ensures at least 1 pod remains available. |
| Single node failure | **< 5 minutes** | DOKS autoscaler replaces the node; pods reschedule to healthy nodes. |
| Full application redeployment | **< 10 minutes** | `kubectl apply -k` from Git + image pull from DOCR. |
| Full cluster loss (DOKS destroyed) | **< 30 minutes** | Run `provision.sh` (~10 min) + install add-ons (~5 min) + deploy application (~5 min) + DNS propagation (~10 min). |
| Supabase database restore | **< 30 minutes** | PITR restore via Supabase dashboard. |
| Registry loss + image rebuild | **< 10 minutes** | GitHub Actions builds and pushes a new image from `main`. |

**Overall RTO: 30 minutes** (worst case: full cluster re-provision + deploy).

---

## 5. Recovery Procedures

### 5.1 Database Recovery (Supabase PITR)

**When to use**: Data corruption, accidental deletion of rows, or need to restore to a specific point in time.

**Prerequisites**: Supabase Pro plan with PITR enabled. Access to the Supabase dashboard.

**Steps**:

1. Log in to the Supabase dashboard at `https://supabase.com/dashboard`.
2. Select the SafeTrekr production project.
3. Navigate to **Database > Backups > Point in Time**.
4. Select the target recovery timestamp (up to 7 days in the past).
5. Click **Restore**. Supabase will create a new database instance at the specified point in time.
6. Verify the restored data by querying key tables:
   ```sql
   SELECT COUNT(*) FROM waitlist_entries;
   SELECT COUNT(*) FROM contact_submissions;
   ```
7. If restoring to the same project: the restore replaces the current database. The application will reconnect automatically (connection string does not change).
8. If restoring to a new project: update `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the K8s ConfigMap/Secret and redeploy.
9. Verify the application health endpoint returns 200:
   ```bash
   curl -s https://safetrekr.com/api/health
   ```

**Alternative -- Restore from daily backup**:

1. In the Supabase dashboard, go to **Database > Backups > Scheduled**.
2. Download the desired daily backup.
3. Restore using `pg_restore` to a local or new Supabase instance for validation.

### 5.2 Application Recovery (Redeploy from Git)

**When to use**: Application pods are unhealthy, bad deployment, or need to roll back.

**Quick rollback to previous version**:

```bash
# Roll back to the previous deployment revision
kubectl rollout undo deployment/safetrekr-web -n production

# Verify the rollback
kubectl rollout status deployment/safetrekr-web -n production
kubectl get pods -n production -l app.kubernetes.io/name=safetrekr-web
```

**Redeploy a specific Git commit**:

```bash
# Identify the target commit SHA
git log --oneline -10

# Set the image tag in the production overlay
cd infrastructure/k8s/overlays/production
kustomize edit set image \
  registry.digitalocean.com/safetrekr-marketing/safetrekr-web=\
  registry.digitalocean.com/safetrekr-marketing/safetrekr-web:sha-<target-sha>

# Apply the overlay
kubectl apply -k .

# Monitor the rollout
kubectl rollout status deployment/safetrekr-web -n production
```

**Full application stack redeploy** (all manifests from Git):

```bash
# Apply the complete base + production overlay
kubectl apply -k infrastructure/k8s/overlays/production/

# Verify all resources
kubectl get all -n production
kubectl get ingress -n production
kubectl get hpa -n production
```

### 5.3 Full Site Recovery (From Scratch)

**When to use**: Total cluster loss, catastrophic infrastructure failure, or provisioning a replacement cluster.

**Prerequisites**:
- `doctl` CLI installed and authenticated
- `kubectl` installed (v1.31+)
- `helm` installed (v3.14+)
- Access to DigitalOcean account, Supabase dashboard, Cloudflare dashboard
- Git repository cloned locally

**Step-by-step procedure**:

#### Step 1: Provision the DOKS cluster (~10 minutes)

```bash
cd infrastructure/doks
chmod +x provision.sh
./provision.sh
```

This idempotent script performs all of the following:
- Creates the `safetrekr-marketing` cluster in `nyc1` with HA control plane
- Configures the `general` node pool (2x `s-2vcpu-4gb`, autoscale 2-4)
- Saves kubeconfig
- Creates namespaces (production, staging, preview, monitoring) with resource quotas and limit ranges
- Installs ingress-nginx (2 replicas, creates DO Load Balancer)
- Installs cert-manager with CRDs
- Creates Let's Encrypt ClusterIssuers (production + staging)
- Verifies metrics-server

#### Step 2: Integrate the container registry

```bash
# If the registry still exists:
doctl kubernetes cluster registry add safetrekr-marketing

# If the registry was also destroyed:
doctl registry create safetrekr-marketing --subscription-tier starter
doctl kubernetes cluster registry add safetrekr-marketing
```

#### Step 3: Build and push the application image

```bash
# If the image exists in the registry, skip this step.
# If the registry was recreated, build from the latest main branch:

IMAGE_TAG="sha-$(git rev-parse --short=7 HEAD)"
IMAGE_NAME="registry.digitalocean.com/safetrekr-marketing/safetrekr-web"

doctl registry login --expiry-seconds 600

docker build \
  --tag "${IMAGE_NAME}:${IMAGE_TAG}" \
  --file Dockerfile \
  .

docker push "${IMAGE_NAME}:${IMAGE_TAG}"
```

Alternatively, trigger a GitHub Actions workflow on `main` to build and push automatically.

#### Step 4: Create Kubernetes secrets

Re-create secrets from provider dashboards. Refer to `infrastructure/security/secret-management.md` for the full inventory.

```bash
kubectl create secret generic safetrekr-web-secrets \
  --namespace production \
  --from-literal=SUPABASE_SERVICE_ROLE_KEY="<from-supabase-dashboard>" \
  --from-literal=SENDGRID_API_KEY="<from-sendgrid-dashboard>" \
  --from-literal=TURNSTILE_SECRET_KEY="<from-cloudflare-dashboard>" \
  --from-literal=IP_HASH_SALT="<from-secure-storage>" \
  --dry-run=client -o yaml | kubectl apply -f -
```

#### Step 5: Deploy the application

```bash
cd infrastructure/k8s/overlays/production

# Set the image tag to match the image pushed in Step 3
kustomize edit set image \
  registry.digitalocean.com/safetrekr-marketing/safetrekr-web=\
  registry.digitalocean.com/safetrekr-marketing/safetrekr-web:sha-<commit-sha>

# Apply all manifests
kubectl apply -k .
```

#### Step 6: Update DNS records

1. Get the new Load Balancer IP:
   ```bash
   kubectl get svc -n ingress-nginx ingress-nginx-controller \
     -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
   ```
2. Log in to Cloudflare and update the A record for `safetrekr.com` to point to the new LB IP.
3. Update CNAME records for `staging` and `*.preview` if the LB hostname changed.
4. Verify DNS propagation:
   ```bash
   dig +short safetrekr.com
   dig +short www.safetrekr.com
   ```

Full DNS record inventory is in `infrastructure/dns/dns-spec.md` Section 6.

#### Step 7: Verify TLS certificates

cert-manager will automatically request certificates from Let's Encrypt once DNS resolves to the new LB IP.

```bash
# Watch certificate issuance (may take 1-5 minutes)
kubectl get certificate -n production -w

# Verify the certificate is ready
kubectl describe certificate safetrekr-web-tls -n production
```

#### Step 8: Validate the recovery

```bash
# Health endpoint
curl -s https://safetrekr.com/api/health

# Verify pods are running
kubectl get pods -n production -l app.kubernetes.io/name=safetrekr-web

# Verify HPA is active
kubectl get hpa -n production

# Verify PDB is in place
kubectl get pdb -n production

# Test form submission (manual)
# Navigate to https://safetrekr.com and submit a test contact form

# Check pod logs for errors
kubectl logs -l app.kubernetes.io/name=safetrekr-web -n production --tail=50
```

### 5.4 DNS Failover

**When to use**: The DigitalOcean Load Balancer or cluster is unreachable, and traffic needs to be redirected.

**Option A -- Redirect to a maintenance page (Cloudflare Workers)**:

1. In Cloudflare, create a Worker that returns a static maintenance page.
2. Add a Worker Route for `safetrekr.com/*`.
3. The Worker intercepts all traffic and serves the maintenance page until the cluster recovers.
4. Remove the Worker Route after recovery.

**Option B -- Redirect to a secondary cluster or static export**:

1. If a secondary environment exists, update the Cloudflare A record to point to its IP.
2. If using a static export (`next build && next export`), upload the static files to Cloudflare Pages or DigitalOcean Spaces and point DNS there.

**Option C -- Enable Cloudflare "Always Online"**:

Cloudflare's "Always Online" feature (enabled in `dns-spec.md` Section 4.4) automatically serves stale cached versions of pages if the origin is unreachable. This provides a passive failover layer with no manual action required, though form submissions will not work during this period.

### 5.5 Secret Recovery

If Kubernetes secrets are lost (cluster destroyed, accidental deletion), re-create them from the provider dashboards:

| Secret | Recovery Source |
|--------|----------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard > Settings > API > `service_role` key |
| `SENDGRID_API_KEY` | SendGrid Dashboard > Settings > API Keys (generate new if lost) |
| `TURNSTILE_SECRET_KEY` | Cloudflare Dashboard > Turnstile > Site Settings |
| `IP_HASH_SALT` | Generate a new random value with `openssl rand -hex 32` (note: changing this invalidates previously hashed IPs) |
| `DIGITALOCEAN_ACCESS_TOKEN` | DigitalOcean Dashboard > API > Personal Access Tokens |

After recreation, follow the rotation procedure in `infrastructure/security/secret-management.md` Section 2.

---

## 6. Component-Level Recovery Matrix

| Component | Failure Mode | Detection | Auto-Recovery? | Manual Steps | RTO |
|-----------|-------------|-----------|---------------|--------------|-----|
| Single pod | CrashLoopBackOff, OOMKilled | K8s liveness probe, pod restart count alert | Yes (K8s restarts pod) | None | < 1 min |
| Single node | NotReady, hardware failure | Node not ready alert (> 2 min) | Yes (DOKS autoscaler replaces node) | None | < 5 min |
| All pods unhealthy | Bad image, config error | All health checks fail, 502 errors | No | Roll back: `kubectl rollout undo deployment/safetrekr-web -n production` | < 2 min |
| Ingress controller down | 502/504 errors on all routes | Uptime monitoring alert | Partial (K8s restarts pods) | `helm upgrade --install ingress-nginx ...` | < 5 min |
| cert-manager failure | Certificate expiry < 14 days | cert-manager expiry alert | No | Investigate cert-manager logs; re-install via Helm if needed | < 15 min |
| TLS certificate expired | Browser security warnings | Certificate expiry alert | No | Delete the certificate secret; cert-manager re-issues: `kubectl delete secret safetrekr-web-tls -n production` | < 10 min |
| Load Balancer lost | Site unreachable | Uptime monitoring alert | Yes (recreated by ingress-nginx Service) | Update DNS A record with new LB IP | < 10 min |
| Container registry down | ImagePullBackOff on new deploys | K8s pod events | No | Rebuild image from Git; push to recreated registry | < 10 min |
| Supabase outage | Form submissions fail, 500 errors | Application error logs, Supabase status page | No (external service) | Wait for Supabase recovery; monitor status.supabase.com | Depends on Supabase |
| Full cluster loss | Site completely unreachable | Uptime monitoring alert | No | Full recovery procedure (Section 5.3) | < 30 min |
| DNS misconfiguration | Site unreachable or wrong destination | Uptime monitoring, `dig` verification | No | Correct records in Cloudflare per `dns-spec.md` | < 10 min |
| Cloudflare outage | Possible DNS resolution failure | Uptime monitoring from external probes | No | If prolonged, consider temporary switch to DigitalOcean DNS | Depends on Cloudflare |

---

## 7. Testing Schedule

### 7.1 Quarterly DR Test Procedure

Conduct a full disaster recovery test every quarter. The test validates that the recovery procedures in this document are accurate and achievable within the stated RTO.

**Test scope** (rotate through these each quarter):

| Quarter | Test Scenario | Description |
|---------|--------------|-------------|
| Q1 | Database restore | Restore Supabase from PITR to a test project; verify data integrity |
| Q2 | Full cluster rebuild | Destroy and recreate the DOKS cluster from `provision.sh`; deploy application |
| Q3 | Application rollback | Deploy a deliberately broken image; practice rollback procedure |
| Q4 | Secret rotation + recovery | Rotate all secrets per the secret management policy; verify zero-downtime |

**Test procedure (generic)**:

1. **Prepare**: Notify the team that a DR test is scheduled. Ensure a recent Git checkout is available.
2. **Execute**: Follow the relevant recovery procedure from Section 5 of this document.
3. **Time it**: Record the wall-clock time from start to full recovery.
4. **Validate**: Run the full verification checklist from Section 5.3 Step 8.
5. **Document**: Log results in the DR test log (see Section 7.2).
6. **Remediate**: If any step failed or the RTO was exceeded, update the procedure and schedule a retest.

### 7.2 DR Test Log

Maintain a running log of all DR tests. Store this in the project wiki or as a file in the repository.

| Date | Test Scenario | Actual RTO | Pass/Fail | Issues Found | Remediation |
|------|--------------|------------|-----------|--------------|-------------|
| _YYYY-MM-DD_ | _e.g., Full cluster rebuild_ | _e.g., 27 min_ | _Pass/Fail_ | _e.g., DNS propagation delayed_ | _e.g., Reduced TTL to 60s_ |

### 7.3 Monthly Checks

In addition to the quarterly full test, perform these lightweight checks monthly:

- [ ] Verify Supabase PITR is still enabled: Dashboard > Database > Backups
- [ ] Download a Supabase daily backup and confirm it is non-empty
- [ ] Verify container registry has recent images: `doctl registry repository list-tags safetrekr-web`
- [ ] Confirm `provision.sh` matches the current cluster configuration (diff against live cluster)
- [ ] Verify all secrets listed in `secret-management.md` exist in the production namespace:
  ```bash
  kubectl get secret safetrekr-web-secrets -n production -o jsonpath='{.data}' | jq 'keys'
  ```
- [ ] Confirm cert-manager certificates are not nearing expiry:
  ```bash
  kubectl get certificate -n production
  ```

---

## 8. Responsibilities

| Role | Responsibility |
|------|---------------|
| Platform Lead | Owns this document; schedules and conducts quarterly DR tests |
| On-Call Engineer | Executes recovery procedures during incidents per the incident response plan |
| Security Lead | Manages secret recovery and rotation during DR events |
| Engineering Manager | Approves DR test schedule; reviews test results |

---

## 9. Dependencies and Assumptions

| Assumption | Impact if Wrong |
|------------|-----------------|
| Supabase Pro plan is active with PITR enabled | RPO degrades from 1 hour to 24 hours (daily backups only) |
| Git repository (GitHub) is accessible | Cannot rebuild cluster or images; mitigate with a secondary Git mirror |
| DigitalOcean account is accessible | Cannot provision cluster or registry; escalate via DO support |
| Cloudflare account is accessible | Cannot update DNS records; use DigitalOcean DNS as fallback |
| Provider dashboards are accessible for secret recovery | Cannot recreate secrets; generate new keys (may require downstream updates) |
| `provision.sh` is kept in sync with actual cluster config | Script may provision a cluster that does not match production; verify monthly |

---

## 10. Quick Reference Card

**Print this section and keep it accessible for on-call engineers.**

```
ROLLBACK (bad deploy):
  kubectl rollout undo deployment/safetrekr-web -n production

POD STATUS:
  kubectl get pods -n production -l app.kubernetes.io/name=safetrekr-web

POD LOGS:
  kubectl logs -l app.kubernetes.io/name=safetrekr-web -n production --tail=100

FORCE RESTART (all pods):
  kubectl rollout restart deployment/safetrekr-web -n production

REDEPLOY FROM GIT:
  cd infrastructure/k8s/overlays/production
  kubectl apply -k .

FULL CLUSTER REBUILD:
  cd infrastructure/doks && ./provision.sh

SUPABASE STATUS:
  https://status.supabase.com

LOAD BALANCER IP:
  kubectl get svc -n ingress-nginx ingress-nginx-controller \
    -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

CERTIFICATE STATUS:
  kubectl get certificate -n production

SECRET CHECK:
  kubectl get secret safetrekr-web-secrets -n production
```

---

## 11. Document History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-03-24 | 1.0 | Platform Engineering | Initial backup and disaster recovery plan |
