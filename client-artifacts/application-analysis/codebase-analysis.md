# SafeTrekr Comprehensive Codebase Analysis

## 1. Complete Tech Stack

### Frontend
- **Next.js 15** (safetrekr-app-v2): React 19, TypeScript 5, Tailwind CSS v4, Turbopack, shadcn/ui (Radix), AG-Grid, MapLibre GL, TanStack Query, Zustand, React Hook Form + Zod, Anime.js, Sonner
- **React Native / Expo 54** (safetrekr-traveler-native): React 19.1.4, NativeWind, Gluestack UI, Expo Router, react-native-maps, expo-location, expo-notifications, expo-sqlite

### Backend
- **FastAPI** (Python 3.11+): safetrekr-core (port 8001) + TarvaRI (port 8000)
- **Supabase** (hosted PostgreSQL): RLS, PostGIS, pgVector
- **Redis 7+**: Caching, rate limiting, job queues

### External Services
- SendGrid (email), Expo Push API, Stripe (payments), Checkr/Sterling (background checks), Doppler (secrets), TarvaCORE (AI reasoning)

### Testing
- Vitest + RTL (unit), Playwright (E2E web), Detox (E2E mobile), pytest (Python)

### Deployment
- Docker + Kubernetes, GitHub Actions CI/CD, EAS Build (mobile), Doppler runtime secrets

## 2. Architecture: Multi-Service Monorepo

```
safetrekr/
├── safetrekr-app-v2/          # Next.js 15 web app (3 portals)
├── safetrekr-core/            # FastAPI core API (250+ endpoints, port 8001)
├── safetrekr-traveler-native/ # Expo React Native app
├── TarvaRI/                   # Intel/alert microservice (port 8000)
├── packages/core-logic/       # Shared TypeScript library
└── marketing-site/            # Public marketing website
```

## 3. Three Web Portals

### Client Portal (Org Admins)
- Trip creation/management (T1 day, T2 domestic, T3 international)
- Participant management with emergency contacts, medical info
- Background checks via Checkr/Sterling
- Trip itinerary (flights, lodging, venues, ground transport)
- Safety features (rally points, safe houses, musters, geofencing)
- Trip documents and packet generation (PDF)
- Billing & payments (Stripe)
- Team management and settings

### Analyst Portal (Safety Analysts)
- Review queue management
- 17-section trip review workspace (overview, participants, air travel, ground transport, lodging, venues, itinerary, emergency preparedness, safety alignment, intel & alerts, background checks, checklists, briefings, communications, documents, governance & guardians, financial & compliance)
- Issue tracking and approval workflows
- Checklist engine with acknowledgement tracking
- Destination guidance documents

### HQ Console (Internal Staff)
- Organization CRUD with suspend/reactivate
- User management across all orgs (10 roles)
- Global trip view and management
- Policy and feature flag configuration
- TarvaRI source monitoring
- Billing overview and pricing tiers
- System health, audit trails, monitoring

## 4. Mobile App (Travelers/Chaperones/Guardians)

- Deep link authentication (safetrekr://invite?token=xxx)
- Offline-first with expo-sqlite queue
- Push notifications (local + remote)
- Biometric login (Face ID, fingerprint)
- Role-specific tabs:
  - Traveler: Today, Schedule, Packet, Settings
  - Chaperone: Today, Schedule, Map (live tracking), Settings
  - Guardian: Today, Schedule, Settings
- Background location tracking + geofencing
- Photo upload (profile, passport)

## 5. Database Schema (Key Tables)

- **organizations**: id, name, type, domain, settings (JSONB), stripe_customer_id, payment_status, credits
- **users**: id, org_id, auth_user_id, role (10 roles), email, name
- **trips**: id, org_id, trip_type (T1/T2/T3), status workflow (draft→active→completed), trip_data (JSONB)
- **trip_participants**: id, trip_id, user_id, role, emergency_contacts (JSONB), medical_info (JSONB)
- **locations**: id, trip_id, type (venue/lodging/transport_hub/emergency), geometry (PostGIS)
- **flights**: id, trip_id, direction, carrier, flight_number, passengers
- **guardians**: id, traveler_id, guardian_id, consent_status
- **background_checks**: id, user_id, status, result_data (JSONB)
- **trip_alerts**: id, trip_id, severity, category, risk_percentiles (P5/P50/P95)
- **rally_points, safe_houses, musters, checkins**: Protection system
- **pending_invites**: HMAC token invitations with event tracking
- **checklist_templates, trip_checklists, checklist_acknowledgements**: Checklist engine
- **review_queue, review_issues**: Analyst workflow

## 6. Authentication & Authorization

- **Dual User ID**: auth.users.id ≠ public.users.id (mapped via auth_user_id column)
- **10 Roles**: traveler, chaperone, org_admin, billing_admin, security_officer, analyst, hq_admin, hq_supervisor, hq_security, hq_ops
- **RLS**: HQ sees all, org staff sees own org, travelers see assigned trips
- **Rate Limiting**: Token bucket, Redis-backed, 60-300 req/min by role
- **JWT Flow**: Supabase Auth → JWT → Core API validates → RBAC

## 7. Intel/Alert Pipeline (TarvaRI)

```
Sources (NOAA, USGS, CDC, ReliefWeb, GDACS)
  → Ingest Worker (5-min polls)
  → Parser Layer (CAP, GeoJSON, RSS → normalized)
  → intel_normalized table
  → Bundler Worker (50km radius, 24hr window)
  → intel_bundles table
  → Triage Queue (analyst review)
  → Alert Router Worker (AI trip matching + risk scoring)
  → delivery_cards table
  → Delivery Worker (email, SMS, push)
  → acknowledgements table
```

**Risk Scoring**: 12-feature Monte Carlo model with P5/P50/P95 uncertainty bands across Hazard (40%), Exposure (20%), Vulnerability (20%), Exfil (15%), Confidence (5%) domains.

## 8. Key Architectural Patterns

- Supabase API Factory (lazy singletons with reset for testing)
- Query Key Factory (hierarchical keys for batch invalidation)
- Core API middleware pipeline: CORS → SecurityHeaders → RequestID → Timing → RateLimit → Compression
- Typed exceptions (NotFoundError, ForbiddenError, BadRequestError)
- Redis caching (900s user/org/trip, 300s lists)
- Dual auth store problem (Supabase session vs Zustand persist)
- Offline queue + sync pattern (mobile)
- Background geofencing (expo-task-manager)
- Connector framework for pluggable intel sources
