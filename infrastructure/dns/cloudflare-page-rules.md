# ST-805: REQ-022 -- Cloudflare Page Rules

**Task**: ST-805 (REQ-022)
**Status**: Defined (not yet active -- requires Cloudflare proxy to be enabled)
**Last Updated**: 2026-03-24

---

## Prerequisites

Cloudflare page rules only take effect when the **Cloudflare proxy is enabled**
(orange cloud) on the DNS record. As documented in `dns-spec.md` Section 1.2,
the proxy is initially disabled to allow cert-manager HTTP-01 challenges to
function.

**Before enabling these rules:**

1. Migrate cert-manager from HTTP-01 to DNS-01 challenge solver (requires a
   Cloudflare API token with Zone:DNS:Edit permissions).
2. Update `cluster-issuers.yaml` to use the `dns01` solver with the
   Cloudflare provider.
3. Verify certificate renewal works with the DNS-01 solver.
4. Enable the Cloudflare proxy (orange cloud) on the `safetrekr.com` A record.

Once the proxy is active, create the page rules below in the Cloudflare
Dashboard under **Rules > Page Rules** (or via the Cloudflare API).

---

## Page Rules

Cloudflare evaluates page rules in priority order (lowest number = highest
priority). The free plan allows 3 page rules. The rules below are designed to
fit within that limit, with one additional rule documented for Pro plan users.

### Rule 1: ACME Challenge Bypass (Priority 1)

**Purpose:** Ensure Let's Encrypt HTTP-01 challenges are never cached or
modified by Cloudflare, even if the proxy is enabled. This is a safety net
in case the migration to DNS-01 is reverted.

| Setting | Value |
|---------|-------|
| **URL Pattern** | `*safetrekr.com/.well-known/acme-challenge/*` |
| Cache Level | Bypass |
| SSL | Off |

**Cloudflare API equivalent:**

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/pagerules" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -H "Content-Type: application/json" \
  --data '{
    "targets": [
      {
        "target": "url",
        "constraint": {
          "operator": "matches",
          "value": "*safetrekr.com/.well-known/acme-challenge/*"
        }
      }
    ],
    "actions": [
      { "id": "cache_level", "value": "bypass" },
      { "id": "ssl", "value": "off" }
    ],
    "priority": 1,
    "status": "active"
  }'
```

---

### Rule 2: Immutable Static Assets (Priority 2)

**Purpose:** Cache Next.js build output at the Cloudflare edge with aggressive
TTLs. Files in `/_next/static/` include a content hash in the filename
(e.g., `/_next/static/chunks/app-layout-abc123.js`), making them safe to cache
indefinitely -- a new build produces new filenames.

| Setting | Value |
|---------|-------|
| **URL Pattern** | `*safetrekr.com/_next/static/*` |
| Cache Level | Cache Everything |
| Edge Cache TTL | 1 month (2,592,000 seconds) |
| Browser Cache TTL | 1 year (31,536,000 seconds) |

**Why different TTLs:**

- **Browser Cache TTL (1 year):** The content-hashed filenames guarantee that
  stale assets are never served. Once a file is cached by the browser, it stays
  cached until the browser evicts it. A new deployment generates new filenames,
  so the browser fetches those instead.
- **Edge Cache TTL (1 month):** Shorter than browser TTL to allow Cloudflare
  to eventually evict unused assets from edge nodes, keeping the cache
  efficient without manual purging.

**Expected impact:**

- JS bundles, CSS files, and static media served from Cloudflare edge (~20ms)
  instead of origin (~100-200ms).
- Significant bandwidth savings on the DO Load Balancer.
- No cache invalidation needed on deployment -- new builds produce new hashes.

**Cloudflare API equivalent:**

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/pagerules" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -H "Content-Type: application/json" \
  --data '{
    "targets": [
      {
        "target": "url",
        "constraint": {
          "operator": "matches",
          "value": "*safetrekr.com/_next/static/*"
        }
      }
    ],
    "actions": [
      { "id": "cache_level", "value": "cache_everything" },
      { "id": "edge_cache_ttl", "value": 2592000 },
      { "id": "browser_cache_ttl", "value": 31536000 }
    ],
    "priority": 2,
    "status": "active"
  }'
```

---

### Rule 3: Optimized Image Caching (Priority 3)

**Purpose:** Cache Next.js optimized images served by the `/_next/image`
endpoint. Unlike static assets, these are generated on-demand by Sharp and
include query parameters (`url`, `w`, `q`) that make the cache key unique per
variant.

| Setting | Value |
|---------|-------|
| **URL Pattern** | `*safetrekr.com/_next/image*` |
| Cache Level | Cache Everything |
| Edge Cache TTL | 1 day (86,400 seconds) |
| Browser Cache TTL | 1 day (86,400 seconds) |

**Why shorter TTLs than static assets:**

- Optimized images do not have content-hashed filenames. The same URL
  (`/_next/image?url=/hero.jpg&w=1200&q=75`) always points to the same source
  image, but the source image could change between deployments.
- A 1-day TTL balances caching benefit (reduces Sharp CPU load on pods) with
  freshness (updated images propagate within 24 hours).
- For immediate updates, manually purge the Cloudflare cache for the specific
  URL via the Dashboard or API.

**Cloudflare API equivalent:**

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/pagerules" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -H "Content-Type: application/json" \
  --data '{
    "targets": [
      {
        "target": "url",
        "constraint": {
          "operator": "matches",
          "value": "*safetrekr.com/_next/image*"
        }
      }
    ],
    "actions": [
      { "id": "cache_level", "value": "cache_everything" },
      { "id": "edge_cache_ttl", "value": 86400 },
      { "id": "browser_cache_ttl", "value": 86400 }
    ],
    "priority": 3,
    "status": "active"
  }'
```

---

### Rule 4: Font Caching (Priority 4 -- Requires Pro Plan)

**Purpose:** Cache self-hosted font files with aggressive TTLs. Font files
are immutable between deployments and are large relative to other assets.

This rule requires Cloudflare **Pro plan** (which allows more than 3 page
rules). On the free plan, fonts served from `/_next/static/` are already
covered by Rule 2. This rule only adds value if fonts are served from a
separate `/fonts/` path.

| Setting | Value |
|---------|-------|
| **URL Pattern** | `*safetrekr.com/fonts/*` |
| Cache Level | Cache Everything |
| Edge Cache TTL | 1 month (2,592,000 seconds) |
| Browser Cache TTL | 1 year (31,536,000 seconds) |

**Cloudflare API equivalent:**

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/pagerules" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -H "Content-Type: application/json" \
  --data '{
    "targets": [
      {
        "target": "url",
        "constraint": {
          "operator": "matches",
          "value": "*safetrekr.com/fonts/*"
        }
      }
    ],
    "actions": [
      { "id": "cache_level", "value": "cache_everything" },
      { "id": "edge_cache_ttl", "value": 2592000 },
      { "id": "browser_cache_ttl", "value": 31536000 }
    ],
    "priority": 4,
    "status": "active"
  }'
```

---

## Free Plan Strategy (3 Rules Max)

On the Cloudflare free plan, prioritize rules 1-3. Font caching is handled
by Rule 2 since Next.js serves fonts from `/_next/static/media/` by default
when using `next/font`.

| Priority | Rule | Covers |
|----------|------|--------|
| 1 | ACME Challenge Bypass | Certificate renewal safety net |
| 2 | Immutable Static Assets | JS, CSS, fonts (via `_next/static`) |
| 3 | Optimized Image Caching | Sharp-processed images |

---

## Cache Purge Procedures

### Full Cache Purge (After Major Deployment)

Normally not needed because content-hashed filenames handle cache busting
automatically. Use only if a non-hashed asset (e.g., `favicon.ico`,
`robots.txt`) is updated.

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/purge_cache" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything": true}'
```

### Targeted Purge (Single URL)

Use when a specific optimized image needs to be refreshed immediately.

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/purge_cache" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -H "Content-Type: application/json" \
  --data '{
    "files": [
      "https://safetrekr.com/_next/image?url=%2Fhero.jpg&w=1200&q=75"
    ]
  }'
```

### Prefix Purge (All Images)

Requires Cloudflare **Enterprise plan**. On free/pro plans, use a full purge
instead.

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/purge_cache" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -H "Content-Type: application/json" \
  --data '{
    "prefixes": ["https://safetrekr.com/_next/image"]
  }'
```

---

## Alternative: Cache Rules (Recommended for New Setups)

Cloudflare is migrating from Page Rules to **Cache Rules** (under Rules >
Cache Rules in the Dashboard). Cache Rules are more flexible and the free
plan includes 10 rules (vs. 3 page rules).

If setting up from scratch, prefer Cache Rules over Page Rules:

### Cache Rule 1: Static Assets

| Field | Value |
|-------|-------|
| **Name** | `Cache Next.js static assets` |
| **When** | URI Path starts with `/_next/static/` |
| **Then** | Eligible for cache: Yes |
| | Edge TTL: Override -- 1 month |
| | Browser TTL: Override -- 1 year |
| | Cache Key: Include full URI |

### Cache Rule 2: Optimized Images

| Field | Value |
|-------|-------|
| **Name** | `Cache Next.js optimized images` |
| **When** | URI Path starts with `/_next/image` |
| **Then** | Eligible for cache: Yes |
| | Edge TTL: Override -- 1 day |
| | Browser TTL: Override -- 1 day |
| | Cache Key: Include query string |

### Cache Rule 3: ACME Challenge Bypass

| Field | Value |
|-------|-------|
| **Name** | `Bypass cache for ACME challenges` |
| **When** | URI Path starts with `/.well-known/acme-challenge/` |
| **Then** | Eligible for cache: Bypass cache |

---

## Monitoring Cache Effectiveness

After enabling page rules (or cache rules), monitor cache hit rates in
Cloudflare Analytics (Caching tab):

| Metric | Target | Action if below target |
|--------|--------|----------------------|
| Cache hit rate for `_next/static` | > 95% | Verify page rule is active; check if assets are served with `no-cache` headers |
| Cache hit rate for `_next/image` | > 70% | Expected lower rate due to query-string variants; increase Edge TTL if stable |
| Overall bandwidth saved | > 50% | Review which paths are not being cached; add rules as needed |

Check individual responses with:

```bash
curl -sI https://safetrekr.com/_next/static/chunks/main.js | grep -i cf-cache-status
# Expected: cf-cache-status: HIT (after first request warms the cache)
```

`cf-cache-status` values:

| Value | Meaning |
|-------|---------|
| `HIT` | Served from Cloudflare edge cache |
| `MISS` | Fetched from origin; now cached at edge |
| `EXPIRED` | Edge cache expired; re-fetched from origin |
| `BYPASS` | Page rule set to bypass cache (e.g., ACME challenges) |
| `DYNAMIC` | No page rule matched; Cloudflare did not cache |
