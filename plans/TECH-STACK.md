# Tech Stack Decisions: SafeTrekr Marketing Site

| Category | Decision | Notes |
|----------|----------|-------|
| Architecture | Static-first (SSG/ISR) with Docker containers | Next.js standalone output in Docker |
| Backend | Next.js 15 API Routes (Server Actions + Route Handlers) | No separate backend service |
| Database | PostgreSQL via Supabase (separate project) | Isolated from product DB |
| Auth | N/A (marketing site) | Future self-service uses Supabase Auth |
| Frontend | Next.js 15 (App Router) + React 19 | App Router with Server Components |
| Design Framework | Tailwind CSS 4 + shadcn/ui | Custom design tokens via @theme |
| State Management | React Context (minimal) | Mostly static pages, minimal client state |
| Caching | Nginx reverse proxy + Next.js ISR | ISR for blog, SSG for marketing pages |
| Transactional Email | SendGrid | Existing in product stack |
| Containerization | Docker | Next.js standalone output mode |
| Container Orchestration | Kubernetes (DigitalOcean DOKS) | Production K8s on DigitalOcean |
| CI/CD | GitHub Actions | Build → Push → Deploy to DOKS |
| Hosting | DigitalOcean | DOKS + Spaces CDN |
| Maps | MapLibre GL JS | BSD license, zero per-load cost |
| Analytics | Plausible (primary) + GA4 (optional) | Privacy-first for K-12/church audience |
| Animation | Framer Motion | Tree-shaken ~15KB |
| Bot Protection | Cloudflare Turnstile | Free, privacy-preserving |
| CDN | DigitalOcean Spaces CDN or Cloudflare | Static assets + image optimization |

## Deployment Architecture

```
GitHub Push → GitHub Actions CI/CD
  → Docker Build (Next.js standalone)
  → Push to DigitalOcean Container Registry
  → Deploy to DOKS (DigitalOcean Kubernetes)
  → Nginx Ingress Controller (SSL termination, caching)
  → Cloudflare DNS (optional CDN layer)
```

## Key Differences from Vercel Deployment

| Concern | Vercel | DigitalOcean DOKS |
|---------|--------|-------------------|
| SSG/ISR | Native | Next.js standalone + custom ISR cache |
| Edge Functions | Vercel Edge | Not available; use Node.js middleware |
| Image Optimization | next/image (built-in) | next/image with sharp (self-hosted) |
| Preview Deploys | Automatic | Custom via GitHub Actions + staging namespace |
| SSL | Automatic | cert-manager + Let's Encrypt |
| Scaling | Automatic | HPA (Horizontal Pod Autoscaler) |
| Cost | Usage-based | Fixed + usage ($24/mo DOKS base) |

## These decisions are binding for all persona PRDs and implementation planning.
All agents MUST plan against this stack — do not suggest alternatives unless explicitly flagged as a risk.
