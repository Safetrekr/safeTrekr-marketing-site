# ST-805: REQ-022 -- DNS and CDN Configuration

**Task**: ST-805 (REQ-022)
**Priority**: P1
**Status**: Defined
**Last Updated**: 2026-03-24

---

## Overview

This document specifies all DNS records, CDN configuration, and Cloudflare
settings required to serve the SafeTrekr Marketing site. It is the
authoritative reference for how traffic routes from the public internet to the
DigitalOcean Kubernetes cluster provisioned in REQ-007.

**Architecture context:**

```
Browser
  |
  v
[ Cloudflare DNS ] ---- A record (DNS-only) ----> DO Load Balancer IP
  |                                                     |
  |  (SSL/TLS: Full Strict, once certs are issued)      |
  v                                                     v
[ Cloudflare Edge ]                          [ DO Load Balancer ]
  |  - Page rules for /_next/static/*               (TCP passthrough)
  |  - Brotli compression                              |
  |  - HTTP/2, HTTP/3                                   v
  |                                          [ ingress-nginx ]
  v                                            TLS termination
[ DigitalOcean Spaces CDN ]                    gzip + brotli
  (optional: static assets)                        |
                                                   v
                                          [ Next.js pods ]
```

**Related documents:**

| Document | Path |
|----------|------|
| Cluster specification | `infrastructure/doks/cluster-spec.md` |
| Ingress + cert-manager | `infrastructure/k8s/ingress/README.md` |
| Nginx Ingress values | `infrastructure/k8s/ingress/nginx-ingress-values.yaml` |
| ClusterIssuers | `infrastructure/k8s/ingress/cluster-issuers.yaml` |
| Cloudflare page rules | `infrastructure/dns/cloudflare-page-rules.md` |

---

## 1. Cloudflare DNS Records

All DNS records are managed in Cloudflare. The zone is `safetrekr.com`.

### 1.1 Core Records

| Type  | Name                      | Value                              | Proxy Status | TTL  | Purpose |
|-------|---------------------------|------------------------------------|-------------|------|---------|
| A     | `safetrekr.com`           | `<DO_LB_IP>`                       | DNS only (grey cloud) | Auto | Root domain to DO Load Balancer |
| CNAME | `www.safetrekr.com`       | `safetrekr.com`                    | DNS only (grey cloud) | Auto | www redirect to apex |
| CNAME | `staging.safetrekr.com`   | `<DO_LB_HOSTNAME>`                 | DNS only (grey cloud) | Auto | Staging environment |
| CNAME | `*.preview.safetrekr.com` | `<DO_LB_HOSTNAME>`                 | DNS only (grey cloud) | Auto | PR preview deployments |

**Placeholder values:**

- `<DO_LB_IP>` -- The external IP assigned to the `ingress-nginx-controller`
  Service. Retrieve with:
  ```bash
  kubectl get svc -n ingress-nginx ingress-nginx-controller \
    -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
  ```
- `<DO_LB_HOSTNAME>` -- The Load Balancer hostname configured via the
  annotation `service.beta.kubernetes.io/do-loadbalancer-hostname` in
  `nginx-ingress-values.yaml`. Currently set to `safetrekr.com`.

### 1.2 Why Proxy Must Be OFF (DNS-Only)

cert-manager uses **HTTP-01 challenges** to prove domain ownership to Let's
Encrypt (see `cluster-issuers.yaml`). The ACME server makes an HTTP request to
`http://<domain>/.well-known/acme-challenge/<token>` and expects to reach the
ingress controller directly.

If Cloudflare proxy is enabled:

1. Cloudflare intercepts the request and may cache, redirect, or modify it.
2. Cloudflare's own TLS certificate is presented instead of the challenge token.
3. Let's Encrypt cannot validate domain ownership and certificate issuance fails.

**After certificates are issued and renewed reliably**, the proxy can be enabled
on the A record for `safetrekr.com` to gain Cloudflare edge caching and DDoS
protection. However, this requires switching cert-manager to **DNS-01 challenges**
(using the Cloudflare API token solver) to avoid breaking renewal. That migration
is out of scope for this ticket.

### 1.3 Staging and Preview Routing

The Nginx Ingress Controller uses **host-based routing** to direct traffic to
the correct namespace:

| Host | Ingress Namespace | Service |
|------|-------------------|---------|
| `safetrekr.com` | `production` | `safetrekr-web` |
| `www.safetrekr.com` | `production` | `safetrekr-web` (redirect to apex) |
| `staging.safetrekr.com` | `staging` | `safetrekr-web` |
| `<pr-number>.preview.safetrekr.com` | `preview` | `safetrekr-web-pr-<number>` |

---

## 2. Email Deliverability Records (SendGrid)

These records ensure emails sent via SendGrid (contact form submissions,
transactional notifications) are not flagged as spam.

### 2.1 SPF Record

| Type | Name            | Value                                | TTL  |
|------|-----------------|--------------------------------------|------|
| TXT  | `safetrekr.com` | `v=spf1 include:sendgrid.net ~all`   | Auto |

**What this does:** Authorizes SendGrid's mail servers to send email on behalf
of `safetrekr.com`. The `~all` soft-fail means mail from unauthorized servers
is accepted but marked as suspicious (allows gradual rollout before switching
to `-all` hard-fail).

### 2.2 DKIM Record

| Type | Name                                  | Value                          | TTL  |
|------|---------------------------------------|--------------------------------|------|
| CNAME | `s1._domainkey.safetrekr.com`       | `s1.domainkey.u<SENDGRID_ID>.wl.sendgrid.net` | Auto |
| CNAME | `s2._domainkey.safetrekr.com`       | `s2.domainkey.u<SENDGRID_ID>.wl.sendgrid.net` | Auto |

**Setup steps:**

1. Log in to SendGrid Dashboard > Settings > Sender Authentication.
2. Click "Authenticate Your Domain".
3. Select Cloudflare as the DNS host.
4. Enter `safetrekr.com` as the domain.
5. SendGrid generates the exact CNAME names and values -- replace the
   `<SENDGRID_ID>` placeholders above with the actual values from the UI.
6. Add both CNAME records in Cloudflare (proxy OFF).
7. Return to SendGrid and click "Verify" to confirm propagation.

### 2.3 DMARC Record

| Type | Name                  | Value                                                              | TTL  |
|------|-----------------------|--------------------------------------------------------------------|------|
| TXT  | `_dmarc.safetrekr.com`| `v=DMARC1; p=quarantine; rua=mailto:dmarc@safetrekr.com; pct=100` | Auto |

**Policy breakdown:**

| Tag | Value | Meaning |
|-----|-------|---------|
| `v` | `DMARC1` | DMARC version 1 |
| `p` | `quarantine` | Messages failing DMARC should be quarantined (moved to spam) |
| `rua` | `mailto:dmarc@safetrekr.com` | Aggregate reports sent to this address for monitoring |
| `pct` | `100` | Apply policy to 100% of messages |

**Progression plan:**

1. **Week 1-2**: Deploy with `p=none` to monitor without enforcement. Review
   aggregate reports at `dmarc@safetrekr.com`.
2. **Week 3-4**: Switch to `p=quarantine` (as specified above) once
   legitimate senders are confirmed.
3. **Month 2+**: Consider upgrading to `p=reject` once confidence is high
   that no legitimate mail is being flagged.

---

## 3. CDN Strategy

### 3.1 Next.js Built-In Asset Handling

Next.js with `output: "standalone"` serves static assets from `/_next/static/`
with content-hash filenames (immutable by design). The Nginx Ingress Controller
already applies gzip and brotli compression (see `nginx-ingress-values.yaml`).

For a marketing site with moderate traffic, this setup is sufficient without an
external CDN. The sections below document optional enhancements for when
traffic justifies the added complexity.

### 3.2 Cloudflare Page Rules (Primary CDN Layer)

Cloudflare page rules cache static assets at the edge without requiring the
Cloudflare proxy to be enabled on the DNS record. However, **page rules only
take effect when the orange cloud (proxy) is enabled**.

Once the DNS proxy can be safely enabled (see Section 1.2 for the DNS-01
migration prerequisite), apply these page rules. Full details are in
`infrastructure/dns/cloudflare-page-rules.md`.

**Summary of rules:**

| Priority | URL Pattern | Setting | Value |
|----------|-------------|---------|-------|
| 1 | `safetrekr.com/.well-known/acme-challenge/*` | Cache Level | Bypass |
| 2 | `safetrekr.com/_next/static/*` | Cache Level, Edge Cache TTL, Browser Cache TTL | Cache Everything, 1 month, 1 year |
| 3 | `safetrekr.com/_next/image*` | Cache Level, Edge Cache TTL, Browser Cache TTL | Cache Everything, 1 day, 1 day |
| 4 | `safetrekr.com/fonts/*` | Cache Level, Edge Cache TTL, Browser Cache TTL | Cache Everything, 1 month, 1 year |

### 3.3 DigitalOcean Spaces CDN (Optional -- Static Asset Offloading)

For high-traffic scenarios, large static assets (hero images, videos, font
files) can be served from DigitalOcean Spaces with its built-in CDN, offloading
bandwidth from the cluster.

**When to use this:**

- Site regularly exceeds 100k page views/month.
- Image-heavy pages cause noticeable latency spikes on the cluster.
- Bandwidth costs on the DO Load Balancer become material.

**Setup (when needed):**

1. Create a Space in the `nyc3` region (closest CDN PoP to `nyc1` cluster):
   ```bash
   doctl spaces create safetrekr-assets --region nyc3
   ```

2. Enable the CDN endpoint:
   ```bash
   doctl compute cdn create \
     --origin safetrekr-assets.nyc3.digitaloceanspaces.com \
     --ttl 2592000 \
     --domain cdn.safetrekr.com \
     --certificate-id <cert-id>
   ```

3. Add a CNAME record in Cloudflare:

   | Type  | Name                  | Value                                              | Proxy |
   |-------|-----------------------|----------------------------------------------------|-------|
   | CNAME | `cdn.safetrekr.com`   | `safetrekr-assets.nyc3.cdn.digitaloceanspaces.com` | Off   |

4. Upload assets via the DO API or `s3cmd`:
   ```bash
   s3cmd sync ./public/images/ s3://safetrekr-assets/images/ \
     --acl-public \
     --add-header="Cache-Control:public, max-age=31536000, immutable"
   ```

5. Update `next.config.ts` to use the CDN for images:
   ```typescript
   images: {
     loader: 'custom',
     loaderFile: './lib/cdn-image-loader.ts',
     remotePatterns: [
       {
         protocol: 'https',
         hostname: 'cdn.safetrekr.com',
       },
     ],
   },
   ```

**Cost:** DO Spaces is $5/month for 250 GB storage + 1 TB bandwidth. CDN
bandwidth is included.

**Decision:** Not implemented at launch. Revisit when monthly page views
exceed 100k or cluster bandwidth becomes a cost concern.

---

## 4. Cloudflare Settings

These settings apply to the `safetrekr.com` zone in Cloudflare. Configure them
in the Cloudflare Dashboard or via the API.

### 4.1 SSL/TLS

| Setting | Value | Rationale |
|---------|-------|-----------|
| SSL/TLS encryption mode | **Full (Strict)** | Encrypts traffic between Cloudflare and the origin (ingress-nginx). Requires a valid certificate on the origin, which cert-manager provides via Let's Encrypt. |
| Minimum TLS Version | **1.2** | TLS 1.0 and 1.1 are deprecated per RFC 8996. Matches the `ssl-protocols` setting in `nginx-ingress-values.yaml`. |
| TLS 1.3 | **On** | Provides improved performance (1-RTT handshake) and stronger security (removes legacy cipher suites). |
| Opportunistic Encryption | **On** | Upgrades HTTP connections to HTTPS when possible. |

**Important:** Set SSL mode to Full (Strict) only **after** cert-manager has
successfully issued certificates. During initial setup, use "Full" (non-strict)
to avoid 526 errors if the origin certificate is not yet valid. Switch to
"Full (Strict)" once `kubectl get certificate` shows `Ready: True` for all
domains.

### 4.2 Performance

| Setting | Value | Rationale |
|---------|-------|-----------|
| HTTP/2 | **On** | Multiplexed connections reduce latency for pages with many assets. |
| HTTP/3 (QUIC) | **On** | Further latency reduction on lossy networks (mobile users). Cloudflare supports this natively. |
| Brotli | **On** | Smaller compressed payloads than gzip (~15-20% improvement). Note: the ingress controller also compresses, but Cloudflare edge compression benefits proxied traffic. |
| 0-RTT Connection Resumption | **On** | Reduces TLS handshake latency for returning visitors. |
| Early Hints | **On** | Sends `103 Early Hints` responses to preload critical assets during server think time. |

### 4.3 Security

| Setting | Value | Rationale |
|---------|-------|-----------|
| Always Use HTTPS | **On** | Redirects all HTTP requests to HTTPS (301). |
| Automatic HTTPS Rewrites | **On** | Rewrites HTTP links in HTML to HTTPS to prevent mixed-content warnings. |
| HSTS | Managed by ingress-nginx | HSTS headers are set in `nginx-ingress-values.yaml` (`max-age=31536000; includeSubDomains; preload`). Do not also set HSTS in Cloudflare to avoid double headers. |
| Browser Integrity Check | **On** | Blocks requests with suspicious HTTP headers (common bot signatures). |
| Hotlink Protection | **Off** | Not needed; marketing site images are meant to be shared. |

### 4.4 Caching

| Setting | Value | Rationale |
|---------|-------|-----------|
| Caching Level | **Standard** | Delivers different resources based on query string. |
| Browser Cache TTL | **Respect Existing Headers** | Let the origin (Next.js + ingress-nginx) control cache durations. |
| Always Online | **On** | Serves stale cached pages if the origin is down (disaster recovery layer). |

### 4.5 Network

| Setting | Value | Rationale |
|---------|-------|-----------|
| IPv6 Compatibility | **On** | Serve traffic over IPv6 (Cloudflare handles the translation to IPv4 origin). |
| WebSockets | **Off** | Not needed for a static marketing site. |
| Pseudo IPv4 | **Off** | Not applicable. |

---

## 5. Verification Records

### 5.1 Domain Ownership Verification

Some services require TXT records to verify domain ownership.

| Type | Name             | Value                                    | Purpose |
|------|------------------|------------------------------------------|---------|
| TXT  | `safetrekr.com`  | `<google-site-verification-token>`       | Google Search Console (if needed) |
| TXT  | `safetrekr.com`  | `<plausible-verification-token>`         | Plausible Analytics domain verification |

Add these as needed during service onboarding. Multiple TXT records on the
same name are valid per RFC 7208.

---

## 6. Complete DNS Record Inventory

All records in one table for quick reference during setup.

| # | Type  | Name                          | Value                                                | Proxy | Notes |
|---|-------|-------------------------------|------------------------------------------------------|-------|-------|
| 1 | A     | `safetrekr.com`               | `<DO_LB_IP>`                                         | Off   | Primary |
| 2 | CNAME | `www`                         | `safetrekr.com`                                      | Off   | www redirect |
| 3 | CNAME | `staging`                     | `<DO_LB_HOSTNAME>`                                   | Off   | Staging env |
| 4 | CNAME | `*.preview`                   | `<DO_LB_HOSTNAME>`                                   | Off   | PR previews |
| 5 | TXT   | `safetrekr.com`               | `v=spf1 include:sendgrid.net ~all`                   | --    | SPF |
| 6 | CNAME | `s1._domainkey`               | `s1.domainkey.u<ID>.wl.sendgrid.net`                 | Off   | DKIM key 1 |
| 7 | CNAME | `s2._domainkey`               | `s2.domainkey.u<ID>.wl.sendgrid.net`                 | Off   | DKIM key 2 |
| 8 | TXT   | `_dmarc`                      | `v=DMARC1; p=quarantine; rua=mailto:dmarc@safetrekr.com; pct=100` | -- | DMARC |
| 9 | CNAME | `cdn` (optional)              | `safetrekr-assets.nyc3.cdn.digitaloceanspaces.com`   | Off   | DO Spaces CDN |

---

## 7. Setup Checklist

Complete these steps in order. Each step depends on the one before it.

### Phase 1: Cluster and Load Balancer

- [ ] **1.1** Provision the DOKS cluster per `infrastructure/doks/cluster-spec.md`
- [ ] **1.2** Install cert-manager via Helm (see `infrastructure/k8s/ingress/README.md`)
- [ ] **1.3** Install ingress-nginx via Helm (see `infrastructure/k8s/ingress/README.md`)
- [ ] **1.4** Wait for the DO Load Balancer to receive an external IP:
  ```bash
  kubectl get svc -n ingress-nginx ingress-nginx-controller -w
  ```
- [ ] **1.5** Record the Load Balancer IP: `____________`

### Phase 2: Cloudflare DNS (Core Records)

- [ ] **2.1** Log in to Cloudflare and select the `safetrekr.com` zone
- [ ] **2.2** Create A record: `safetrekr.com` -> `<LB_IP>` (proxy OFF)
- [ ] **2.3** Create CNAME record: `www` -> `safetrekr.com` (proxy OFF)
- [ ] **2.4** Create CNAME record: `staging` -> `<LB_HOSTNAME>` (proxy OFF)
- [ ] **2.5** Create CNAME record: `*.preview` -> `<LB_HOSTNAME>` (proxy OFF)
- [ ] **2.6** Verify DNS propagation:
  ```bash
  dig +short safetrekr.com
  dig +short www.safetrekr.com
  dig +short staging.safetrekr.com
  ```

### Phase 3: TLS Certificate Issuance

- [ ] **3.1** Apply Let's Encrypt ClusterIssuers:
  ```bash
  kubectl apply -f infrastructure/k8s/ingress/cluster-issuers.yaml
  ```
- [ ] **3.2** Deploy the application with the **staging** issuer first:
  ```yaml
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-staging"
  ```
- [ ] **3.3** Verify the staging certificate is issued:
  ```bash
  kubectl get certificate -n production -w
  ```
- [ ] **3.4** Switch to the **production** issuer:
  ```yaml
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-production"
  ```
- [ ] **3.5** Verify the production certificate is issued and `Ready: True`

### Phase 4: Cloudflare Settings

- [ ] **4.1** Set SSL/TLS mode to **Full** (not Strict yet)
- [ ] **4.2** Set Minimum TLS Version to **1.2**
- [ ] **4.3** Enable **Always Use HTTPS**
- [ ] **4.4** Enable **HTTP/2**
- [ ] **4.5** Enable **HTTP/3 (QUIC)**
- [ ] **4.6** Enable **Brotli**
- [ ] **4.7** Enable **0-RTT Connection Resumption**
- [ ] **4.8** Enable **Early Hints**
- [ ] **4.9** Enable **Automatic HTTPS Rewrites**
- [ ] **4.10** Enable **Browser Integrity Check**
- [ ] **4.11** Set Browser Cache TTL to **Respect Existing Headers**
- [ ] **4.12** Enable **Always Online**
- [ ] **4.13** Verify site loads over HTTPS at `https://safetrekr.com`

### Phase 5: Upgrade to Full (Strict) SSL

- [ ] **5.1** Confirm cert-manager certificate is `Ready: True` for all hosts
- [ ] **5.2** Switch Cloudflare SSL/TLS mode to **Full (Strict)**
- [ ] **5.3** Test all domains:
  ```bash
  curl -I https://safetrekr.com
  curl -I https://www.safetrekr.com
  curl -I https://staging.safetrekr.com
  ```
- [ ] **5.4** Verify no 526 (Invalid SSL Certificate) errors

### Phase 6: Email Deliverability

- [ ] **6.1** Add SPF TXT record to Cloudflare
- [ ] **6.2** Complete SendGrid domain authentication and add DKIM CNAME records
- [ ] **6.3** Verify DKIM in SendGrid Dashboard (click "Verify")
- [ ] **6.4** Add DMARC TXT record with `p=none` (monitoring mode)
- [ ] **6.5** Send test email and verify delivery + headers:
  ```bash
  # Check headers in received email for:
  # Authentication-Results: spf=pass, dkim=pass, dmarc=pass
  ```
- [ ] **6.6** After 2 weeks of clean reports, upgrade DMARC to `p=quarantine`

### Phase 7: Validation

- [ ] **7.1** Run SSL Labs test: `https://www.ssllabs.com/ssltest/analyze.html?d=safetrekr.com`
      Target: **A+** rating
- [ ] **7.2** Run SecurityHeaders.com test: `https://securityheaders.com/?q=safetrekr.com`
      Target: **A** rating or higher
- [ ] **7.3** Verify email deliverability with `https://www.mail-tester.com/`
      Target: **9/10** or higher
- [ ] **7.4** Test from multiple networks (cellular, different ISPs) to confirm
      DNS propagation is complete

---

## 8. Maintenance and Renewal

### 8.1 TLS Certificate Renewal

cert-manager handles renewal automatically. Certificates are renewed 30 days
before expiry (configured in `cert-manager-values.yaml` via
`--renew-before-expiry-duration=720h0m0s`).

**Monitoring:** An alert fires when any certificate has fewer than 14 days
remaining (see `cluster-spec.md` Section 10). If this alert fires, cert-manager
renewal has failed and requires manual investigation.

### 8.2 DNS Record Changes

All DNS changes should be documented in this file before being applied in
Cloudflare. Treat DNS as infrastructure-as-code: update the spec first, then
apply.

### 8.3 SendGrid Key Rotation

SendGrid DKIM keys should be rotated annually. When rotating:

1. Generate new keys in SendGrid Dashboard.
2. Add the new CNAME records in Cloudflare.
3. Verify in SendGrid.
4. Remove the old CNAME records after 48 hours (allow DNS cache expiry).

---

## 9. Future Improvements

| Improvement | Trigger | Effort |
|-------------|---------|--------|
| Enable Cloudflare proxy (orange cloud) on A record | Migrate cert-manager to DNS-01 challenges | Medium |
| Add Cloudflare page rules for edge caching | After proxy is enabled | Low |
| DigitalOcean Spaces CDN for static assets | Monthly page views > 100k | Medium |
| Upgrade DMARC to `p=reject` | 2+ months of clean aggregate reports | Low |
| Upgrade SPF to `-all` (hard fail) | Confidence that all senders are accounted for | Low |
| Add CAA record restricting CAs to Let's Encrypt | After stable cert issuance confirmed | Low |
