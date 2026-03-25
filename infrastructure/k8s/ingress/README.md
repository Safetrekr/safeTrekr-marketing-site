# ST-793: REQ-010 -- Nginx Ingress Controller and SSL Configuration

Helm values and Kubernetes manifests for the SafeTrekr Marketing ingress
stack. This directory configures two cluster add-ons that work together to
route external HTTPS traffic to the Next.js application pods:

- **ingress-nginx** -- Nginx-based Ingress Controller that terminates TLS,
  compresses responses (gzip + brotli), and proxies traffic to the
  `safetrekr-web` Service.
- **cert-manager** -- Automated TLS certificate provisioning and renewal
  via Let's Encrypt ACME protocol.

See `infrastructure/doks/cluster-spec.md` for cluster topology, namespace
strategy, and cost details.

---

## Prerequisites

- A running DOKS cluster (`infrastructure/doks/provision.sh`)
- `kubectl` configured for the cluster (`doctl kubernetes cluster kubeconfig save safetrekr-marketing`)
- `helm` v3.14+ installed

---

## Installation

The commands below install both add-ons and create the Let's Encrypt
certificate issuers. Run them in order -- cert-manager CRDs must exist
before ClusterIssuers can be applied.

### 1. Add Helm Repositories

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add jetstack https://charts.jetstack.io
helm repo update
```

### 2. Install cert-manager

```bash
helm upgrade --install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version 1.14.7 \
  -f infrastructure/k8s/ingress/cert-manager-values.yaml \
  --wait
```

Wait for the webhook to become ready before proceeding:

```bash
kubectl wait --for=condition=Available deployment/cert-manager-webhook \
  -n cert-manager --timeout=120s
```

### 3. Install Nginx Ingress Controller

```bash
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --version 4.9.1 \
  -f infrastructure/k8s/ingress/nginx-ingress-values.yaml \
  --wait
```

Wait for the DigitalOcean Load Balancer to receive an external IP (1-2
minutes):

```bash
kubectl get svc -n ingress-nginx ingress-nginx-controller -w
```

### 4. Create Let's Encrypt ClusterIssuers

```bash
kubectl apply -f infrastructure/k8s/ingress/cluster-issuers.yaml
```

### 5. Verify Installation

```bash
# Confirm cert-manager pods are running
kubectl get pods -n cert-manager

# Confirm ingress controller pods are running (expect 2 replicas)
kubectl get pods -n ingress-nginx

# Confirm ClusterIssuers are registered and ready
kubectl get clusterissuer
kubectl describe clusterissuer letsencrypt-production

# Confirm the Load Balancer has an external IP
kubectl get svc -n ingress-nginx ingress-nginx-controller
```

---

## Testing with Staging Issuer

Before using production Let's Encrypt certificates, validate the full
flow with the staging issuer to avoid hitting rate limits.

1. Edit the application Ingress to use the staging issuer:

   ```yaml
   annotations:
     cert-manager.io/cluster-issuer: "letsencrypt-staging"
   ```

2. Apply the Ingress and verify a Certificate is created:

   ```bash
   kubectl apply -k infrastructure/k8s/base/
   kubectl get certificate -n production
   kubectl describe certificate safetrekr-web-tls -n production
   ```

3. Wait for the certificate to be issued (check the `Ready` condition):

   ```bash
   kubectl get certificate -n production -w
   ```

4. Once confirmed, switch the annotation back to `letsencrypt-production`
   and reapply. cert-manager will automatically request a trusted
   certificate.

---

## DNS Configuration

After the Load Balancer external IP is assigned, configure Cloudflare DNS:

| Record | Type  | Name                | Value       | Proxy |
|--------|-------|---------------------|-------------|-------|
| A      | A     | `safetrekr.com`     | LB IP       | Off   |
| CNAME  | CNAME | `www.safetrekr.com` | `safetrekr.com` | Off |
| A      | A     | `staging.safetrekr.com` | LB IP   | Off   |

Cloudflare proxy must be **disabled** (DNS-only / grey cloud) so that
the Let's Encrypt HTTP-01 challenge can reach the ingress controller
directly. Enabling the Cloudflare proxy would intercept the ACME
challenge and cause certificate issuance to fail.

---

## File Inventory

| File | Purpose |
|------|---------|
| `cert-manager-values.yaml` | Helm values for cert-manager (CRDs, resources, webhook) |
| `cluster-issuers.yaml` | Let's Encrypt staging + production ClusterIssuers |
| `nginx-ingress-values.yaml` | Helm values for ingress-nginx (replicas, LB, TLS, compression, metrics) |
| `README.md` | This file |

---

## Architecture

```
Internet
    |
    v
[ Cloudflare DNS ] -- A record --> LB IP
    |
    v
[ DO Load Balancer ] (TCP passthrough, PROXY protocol)
    |
    v
[ ingress-nginx controller ] (2 replicas)
    |  - TLS termination (cert from cert-manager / Let's Encrypt)
    |  - Gzip + Brotli compression
    |  - Rate limiting (20 rps / burst x5)
    |  - HSTS, security headers
    |  - JSON structured access logs
    v
[ safetrekr-web Service ] (ClusterIP :80)
    |
    v
[ Next.js pods ] (2+ replicas, port 3000)
```

---

## Upgrading

To upgrade either add-on, bump the `--version` flag and rerun the
`helm upgrade --install` command. Helm performs a rolling update
automatically.

```bash
# Example: upgrade ingress-nginx to 4.10.0
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --version 4.10.0 \
  -f infrastructure/k8s/ingress/nginx-ingress-values.yaml \
  --wait
```

Always upgrade in the staging namespace first and validate before
applying to production (see cluster-spec.md Section 9).

---

## Troubleshooting

**Certificate stuck in "Pending" state:**

```bash
kubectl describe certificate safetrekr-web-tls -n production
kubectl describe order -n production
kubectl describe challenge -n production
```

Common causes:
- DNS not pointing to the LB IP yet
- Cloudflare proxy enabled (must be DNS-only for HTTP-01)
- cert-manager webhook not ready when ClusterIssuer was applied

**502 Bad Gateway from ingress:**

```bash
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller --tail=50
kubectl get endpoints safetrekr-web -n production
```

Common causes:
- No ready endpoints (application pods not passing readiness probe)
- Service port mismatch (must target port `http` / 3000)

**Load Balancer has no external IP:**

```bash
kubectl describe svc -n ingress-nginx ingress-nginx-controller
```

Common causes:
- DigitalOcean API rate limit or provisioning delay (wait 2-3 minutes)
- Invalid LB annotations (check DO LB in the console)
