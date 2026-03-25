# ST-831: REQ-097 -- Secret Management Policy

> SafeTrekr Marketing Site -- Secret inventory, rotation schedule, and handling rules.

## 1. Secret Inventory

| Secret Name | Purpose | Storage (Production) | Storage (Development) | Rotation Schedule |
|---|---|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase admin access (bypasses RLS) | K8s Secret (`safetrekr-web-secrets`) | `.env.local` | Every 90 days |
| `SENDGRID_API_KEY` | Transactional email delivery (form confirmations, newsletter) | K8s Secret (`safetrekr-web-secrets`) | `.env.local` | Every 90 days |
| `TURNSTILE_SECRET_KEY` | Server-side Cloudflare Turnstile token verification | K8s Secret (`safetrekr-web-secrets`) | `.env.local` | Annually |
| `IP_HASH_SALT` | One-way hash salt for anonymizing IP addresses in analytics | K8s Secret (`safetrekr-web-secrets`) | `.env.local` | Never (unless compromised) |

### Non-Secret Configuration (stored in ConfigMap / `.env.local`)

These values are **not secrets** but are listed for completeness:

| Variable | Purpose | Storage |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client-side Supabase endpoint | ConfigMap (`safetrekr-web-config`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client-side Supabase anonymous key (RLS-protected) | ConfigMap (`safetrekr-web-config`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Client-side Turnstile widget key | ConfigMap (`safetrekr-web-config`) |
| `NEXT_PUBLIC_MAPTILER_KEY` | Client-side MapTiler API key | ConfigMap (`safetrekr-web-config`) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible analytics domain | ConfigMap (`safetrekr-web-config`) |

## 2. Rotation Schedule

| Secret | Rotation Period | Next Rotation | Owner |
|---|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | 90 days | TBD (set after first production deploy) | Platform Lead |
| `SENDGRID_API_KEY` | 90 days | TBD (set after first production deploy) | Platform Lead |
| `TURNSTILE_SECRET_KEY` | 365 days | TBD (set after first production deploy) | Platform Lead |
| `IP_HASH_SALT` | Never | N/A (rotate only if compromised) | Security Lead |

### Rotation Procedure

1. Generate the new secret value in the respective provider dashboard (Supabase, SendGrid, Cloudflare).
2. Update the K8s Secret in the production cluster:
   ```bash
   kubectl create secret generic safetrekr-web-secrets \
     --from-literal=SUPABASE_SERVICE_ROLE_KEY="<new-value>" \
     --from-literal=SENDGRID_API_KEY="<new-value>" \
     --from-literal=TURNSTILE_SECRET_KEY="<new-value>" \
     --from-literal=IP_HASH_SALT="<existing-value>" \
     --dry-run=client -o yaml | kubectl apply -f -
   ```
3. Trigger a rolling restart to pick up the new values:
   ```bash
   kubectl rollout restart deployment/safetrekr-web -n safetrekr-production
   ```
4. Verify the application health endpoint returns 200:
   ```bash
   kubectl exec -it deploy/safetrekr-web -- wget -qO- http://localhost:3000/api/health
   ```
5. Revoke the old secret value in the provider dashboard.
6. Update the "Next Rotation" date in this document.

## 3. Handling Rules

### Rule 1: No secrets in Docker images

The multi-stage Dockerfile (`Dockerfile`) does **not** copy `.env*` files into any build stage. Secrets are injected at runtime via K8s Secrets (`envFrom` in `deployment.yaml`). This is verified by:

- `.dockerignore` excludes `.env*` (add if not present).
- CI pipeline builds the image without any `--build-arg` containing secrets.

### Rule 2: No secrets in Git

The `.gitignore` file contains:

```
.env*
!.env.example
```

This ensures all environment files except the template are excluded from version control. The `secret.yaml` in `infrastructure/k8s/base/` contains only placeholder values (`REPLACE_ME` base64-encoded).

### Rule 3: Development secrets stay local

Developers use `.env.local` for local development. This file is:
- Listed in `.gitignore` (matched by `.env*` pattern).
- Never committed to any branch.
- Contains development/test API keys with limited scope.

### Rule 4: CI/CD secrets

GitHub Actions secrets are configured in the repository settings:
- `DIGITALOCEAN_ACCESS_TOKEN` -- container registry and K8s cluster access.
- `SUPABASE_SERVICE_ROLE_KEY` -- used only in deploy workflows, never logged.

CI jobs use `permissions: contents: read` to enforce least-privilege access.

## 4. Future Enhancements

### Sealed Secrets (planned)

To enable GitOps-style secret management where encrypted secrets can be safely committed to Git:

1. Install the Sealed Secrets controller in the cluster:
   ```bash
   helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets
   helm install sealed-secrets sealed-secrets/sealed-secrets -n kube-system
   ```
2. Encrypt secrets using `kubeseal`:
   ```bash
   kubeseal --format yaml < secret.yaml > sealed-secret.yaml
   ```
3. Replace `secret.yaml` in the Kustomize base with `sealed-secret.yaml`.
4. The controller decrypts at runtime; only the cluster's private key can unseal.

### External Secrets Operator (alternative)

For organizations using AWS Secrets Manager, HashiCorp Vault, or similar:
- Install the External Secrets Operator.
- Define `ExternalSecret` resources that sync from the external store.
- Rotation is handled by the external provider; K8s secrets update automatically.
