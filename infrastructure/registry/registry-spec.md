# SafeTrekr Marketing -- DigitalOcean Container Registry Specification

**Task**: ST-791 (REQ-008)
**Priority**: P0
**Status**: Defined
**Last Updated**: 2026-03-24
**Depends On**: ST-790 (REQ-007 -- DOKS Cluster)

---

## 1. Registry Identity

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Registry name | `safetrekr-marketing` | Matches DOKS cluster naming convention |
| Provider | DigitalOcean Container Registry (DOCR) | Per TECH-STACK.md binding decision; native integration with DOKS |
| Subscription tier | **Starter** | 500 MB storage is sufficient for a single Next.js standalone image (~150-200 MB compressed) with tag history |
| Monthly cost | $5/month | Included in REQ-134 cost estimation |
| Region | Automatic (DigitalOcean-managed) | DOCR uses a global endpoint; images are served from the nearest edge to the pulling node |

---

## 2. Image Naming Convention

All container images follow this naming pattern:

```
registry.digitalocean.com/safetrekr-marketing/safetrekr-web:sha-{short_hash}
```

### 2.1 Naming Breakdown

| Segment | Value | Description |
|---------|-------|-------------|
| Registry host | `registry.digitalocean.com` | DigitalOcean DOCR endpoint |
| Registry name | `safetrekr-marketing` | Matches the DOCR registry name |
| Repository | `safetrekr-web` | The Next.js marketing site application |
| Tag format | `sha-{short_hash}` | First 7 characters of the Git commit SHA |

### 2.2 Tag Examples

| Scenario | Tag | Full Image Reference |
|----------|-----|---------------------|
| Commit `a1b2c3d` on `main` | `sha-a1b2c3d` | `registry.digitalocean.com/safetrekr-marketing/safetrekr-web:sha-a1b2c3d` |
| Commit `f4e5d6c` on PR branch | `sha-f4e5d6c` | `registry.digitalocean.com/safetrekr-marketing/safetrekr-web:sha-f4e5d6c` |

### 2.3 Why Immutable SHA-Based Tags

- **No `latest` tag**: The `latest` tag is explicitly prohibited. It creates ambiguity about which version is running and makes rollbacks unreliable.
- **Deterministic deployments**: Every Kubernetes manifest references a specific SHA tag. The image running in production is always traceable to an exact Git commit.
- **Safe rollbacks**: Rolling back to a previous deployment means referencing the previous SHA tag, which is guaranteed to still exist and contain the exact same image layers.
- **Auditability**: `kubectl describe pod` immediately reveals which commit is running via the image tag.

---

## 3. Storage Budget

### 3.1 Starter Plan Limits

| Limit | Value |
|-------|-------|
| Storage | 500 MB |
| Repositories | Unlimited |
| Bandwidth | Unlimited (within DO network) |

### 3.2 Estimated Usage

| Metric | Estimate | Notes |
|--------|----------|-------|
| Compressed image size | ~150-200 MB | Next.js standalone build with `sharp`, distroless base |
| Shared layers between tags | ~80-90% | Base image and `node_modules` layers rarely change |
| Unique layer delta per deploy | ~10-30 MB | Only the application bundle changes between deployments |
| Effective images retained | 10-15 tags | Before garbage collection reclaims unreferenced layers |

### 3.3 Upgrade Path

If storage exceeds 500 MB (unlikely with weekly garbage collection), upgrade to the **Basic** tier ($10/month, 5 GB). This would only be necessary if deploy frequency exceeds 10+ deploys per day without garbage collection.

---

## 4. Registry Setup

### 4.1 Create the Registry

```bash
doctl registry create safetrekr-marketing --subscription-tier starter
```

This command:
- Creates a DOCR registry named `safetrekr-marketing`
- Subscribes to the Starter plan ($5/month)
- Outputs the registry endpoint: `registry.digitalocean.com/safetrekr-marketing`

### 4.2 Integrate with DOKS Cluster

Grant the DOKS cluster pull access to the registry without requiring image pull secrets:

```bash
doctl registry kubernetes-manifest | kubectl apply -f -
```

This creates a `registry-creds` Secret in the `kube-system` namespace and patches the default ServiceAccount in each namespace. DOKS handles credential rotation automatically.

Alternatively, use the cluster-level integration:

```bash
doctl kubernetes cluster registry add safetrekr-marketing
```

This configures the entire cluster to pull from the registry natively.

### 4.3 Verify Registry Access

```bash
# Confirm registry exists
doctl registry get

# Confirm cluster integration
doctl registry kubernetes-manifest --output yaml

# List repositories (empty initially)
doctl registry repository list-v2
```

---

## 5. GitHub Actions Integration

### 5.1 Authentication

GitHub Actions authenticates to DOCR using a DigitalOcean API token stored as a repository secret.

| Secret Name | Value | Scope |
|-------------|-------|-------|
| `DIGITALOCEAN_ACCESS_TOKEN` | DigitalOcean personal access token with `registry` scope | Repository secret |

### 5.2 Docker Login Step

```yaml
- name: Install doctl
  uses: digitalocean/action-doctl@v2
  with:
    token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

- name: Log in to DOCR
  run: doctl registry login --expiry-seconds 600
```

This logs Docker into `registry.digitalocean.com` using a short-lived (10-minute) token derived from the API token. The short expiry minimizes exposure if the CI runner is compromised.

### 5.3 Build and Push Step

```yaml
- name: Build and push image
  env:
    IMAGE_TAG: sha-${{ github.sha.substring(0, 7) }}
    IMAGE_NAME: registry.digitalocean.com/safetrekr-marketing/safetrekr-web
  run: |
    docker build \
      --tag "${IMAGE_NAME}:${IMAGE_TAG}" \
      --build-arg NEXT_PUBLIC_SUPABASE_URL=${{ secrets.NEXT_PUBLIC_SUPABASE_URL }} \
      --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }} \
      --file Dockerfile \
      .
    docker push "${IMAGE_NAME}:${IMAGE_TAG}"
```

### 5.4 Full CI/CD Pipeline Context

The registry integrates into the deployment pipeline as follows:

```
PR opened/updated
  -> Build image with tag sha-{hash}
  -> Push to DOCR
  -> Deploy to preview namespace (sha-{hash})

Merge to main
  -> Build image with tag sha-{hash}
  -> Push to DOCR
  -> Deploy to staging namespace (sha-{hash})
  -> (Manual gate or automated smoke test)
  -> Deploy to production namespace (sha-{hash})
```

---

## 6. Garbage Collection

### 6.1 Strategy

DOCR uses a two-phase garbage collection model:
1. **Tag deletion**: Remove old tags from repositories (via API or `doctl`)
2. **Garbage collection**: Reclaim storage from unreferenced layers (triggered via API)

### 6.2 Retention Policy

| Rule | Value | Rationale |
|------|-------|-----------|
| Keep most recent N tags | 10 | Supports rollback to any of the last 10 deployments |
| Tags older than | 30 days | Stale images beyond rollback window are safe to remove |
| Protected patterns | None | All tags follow `sha-{hash}` format; no special protection needed |

### 6.3 Weekly Automated Cleanup

Garbage collection runs on a weekly schedule via GitHub Actions cron job:

```yaml
name: Registry Cleanup
on:
  schedule:
    - cron: '0 4 * * 0'  # Every Sunday at 4:00 AM UTC
  workflow_dispatch: {}    # Allow manual trigger

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install doctl
        uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

      - name: Run garbage collection
        run: |
          chmod +x infrastructure/registry/cleanup.sh
          ./infrastructure/registry/cleanup.sh
```

### 6.4 Manual Garbage Collection

For immediate cleanup (e.g., after deleting many preview images), run:

```bash
./infrastructure/registry/cleanup.sh
```

See `cleanup.sh` in this directory for the full implementation.

---

## 7. Security

### 7.1 Access Control

| Principal | Access Level | Method |
|-----------|-------------|--------|
| DOKS cluster | Pull only | `doctl registry kubernetes-manifest` integration |
| GitHub Actions | Push and pull | `DIGITALOCEAN_ACCESS_TOKEN` with registry scope |
| DevOps engineer | Full (push/pull/delete) | `doctl registry login` via personal API token |
| Developers | No direct access | Images are built and pushed exclusively via CI/CD |

### 7.2 Security Controls

| Control | Implementation |
|---------|---------------|
| No `latest` tag | Enforced by CI pipeline; only `sha-{hash}` tags are pushed |
| Short-lived CI credentials | `doctl registry login --expiry-seconds 600` limits token lifetime |
| No image pull secrets in manifests | DOKS-native registry integration handles authentication transparently |
| Image provenance | Every tag maps 1:1 to a Git commit SHA, providing full traceability |
| Vulnerability scanning | DigitalOcean provides built-in image scanning on DOCR (enabled by default on Starter+) |

---

## 8. Monitoring

### 8.1 Storage Monitoring

| Check | Method | Alert Threshold |
|-------|--------|----------------|
| Storage usage | `doctl registry get` | > 400 MB (80% of 500 MB Starter limit) |
| Repository count | `doctl registry repository list-v2` | Informational only |
| Tag count per repo | `doctl registry repository list-tags safetrekr-web` | > 20 tags (cleanup may be stalled) |

### 8.2 CI/CD Monitoring

| Metric | Source | Alert Condition |
|--------|--------|----------------|
| Push failures | GitHub Actions workflow logs | Any push step failure |
| Pull failures | Kubernetes pod events | `ImagePullBackOff` or `ErrImagePull` events |
| Cleanup failures | GitHub Actions cron job | Cleanup workflow failure |

---

## 9. Disaster Recovery

| Concern | Strategy |
|---------|----------|
| Registry unavailable | Rebuild image from source via GitHub Actions; Dockerfile and source are version-controlled |
| Accidental tag deletion | Retain 10 most recent tags; any deleted tag can be rebuilt from its Git SHA |
| Storage quota exceeded | Run manual garbage collection (`cleanup.sh`); upgrade to Basic tier if needed |
| API token compromised | Revoke token in DigitalOcean dashboard; generate new token; update GitHub Actions secret |

Recovery Time Objective (RTO): < 10 minutes (rebuild and push from GitHub Actions)
Recovery Point Objective (RPO): 0 (all images are reproducible from Git source)

---

## 10. Setup Checklist

Run these steps in order after DOKS cluster provisioning (ST-790) is complete:

- [ ] Create registry: `doctl registry create safetrekr-marketing --subscription-tier starter`
- [ ] Integrate with cluster: `doctl kubernetes cluster registry add safetrekr-marketing`
- [ ] Verify integration: `doctl registry kubernetes-manifest --output yaml`
- [ ] Add `DIGITALOCEAN_ACCESS_TOKEN` to GitHub repository secrets
- [ ] Push a test image from GitHub Actions to verify end-to-end flow
- [ ] Verify image pull from DOKS: deploy a test pod referencing the pushed image
- [ ] Set up weekly cleanup cron job in GitHub Actions
- [ ] Configure billing alerts (registry is included in the $100/month threshold from REQ-134)

---

## 11. Related Requirements

| Requirement | Description | Dependency Direction |
|-------------|-------------|---------------------|
| REQ-007 | DOKS Cluster Provisioning | REQ-008 depends on REQ-007 |
| REQ-008 | This document (Container Registry) | -- |
| REQ-009 | Kubernetes Manifests | Depends on REQ-008 (image references) |
| REQ-134 | Cost Estimation and Monitoring | Registry cost included |

---

## 12. doctl Quick Reference

```bash
# Registry management
doctl registry create safetrekr-marketing --subscription-tier starter
doctl registry get
doctl registry delete safetrekr-marketing

# Authentication
doctl registry login
doctl registry login --expiry-seconds 600

# DOKS integration
doctl kubernetes cluster registry add safetrekr-marketing
doctl kubernetes cluster registry remove safetrekr-marketing
doctl registry kubernetes-manifest | kubectl apply -f -

# Repository and tag inspection
doctl registry repository list-v2
doctl registry repository list-tags safetrekr-web
doctl registry repository delete-tag safetrekr-web sha-a1b2c3d

# Garbage collection
doctl registry garbage-collection start safetrekr-marketing
doctl registry garbage-collection get-active safetrekr-marketing
```
