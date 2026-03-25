Now let me compile the comprehensive analysis document:

# SafeTrekr Codebase Comprehensive Analysis

## Executive Summary

SafeTrekr is an enterprise trip safety management platform consisting of a **modern Next.js 15 frontend (v2)**, a **FastAPI Core API** backend, an **AI intelligence/risk assessment microservice (TarvaRI)**, and a **shared TypeScript package**. The system manages group travel for organizations (schools, churches, sports teams, businesses) with comprehensive safety compliance, background checks, intelligence-driven alerts, and multi-role analytics.

**Architecture Pattern**: Monorepo with 3 independent services + 1 shared package, all using Supabase (PostgreSQL + RLS) as the unified data layer with independent HTTP APIs for business logic.

---

## 1. Feature Inventory

### 1.1 Client Portal (Organization Admins & Team Members)

**Dashboard & Overview**
- Real-time KPI cards: active trips, pending reviews, team members, background check status
- Recent activity feed with filterable event types
- Quick actions: create trip, manage teams, view billing

**Trip Management (Core Feature)**
- Trip creation via 10-step wizard with real-time validation
- Trip types: T1 (day trips), T2 (domestic overnight), T3 (international)
- Trip statuses: draft → in_review → active → in_progress → completed
- Multi-day itinerary builder with drag-and-drop day/event management
- CSV import for bulk itinerary creation
- Destination validation with map preview (MapLibre GL)
- Itinerary events: activities, meals, meetings, transportation, free time, other
- Location search with geocoding (Overpass/OSM fallback)

**Trip Components**
- **Air Travel**: Outbound/return flights with real-time lookup (AviationStack API), IATA code validation, seat tracking
- **Ground Transportation**: Leg-by-leg (mode, date, time, cost, participants)
- **Lodging**: Multi-property stay details with location type validation (hotel, hostel, Airbnb, etc.)
- **Venues**: Event locations with address, capacity, contact info, accessibility notes
- **Participants**: Travelers, chaperones, guardians with emergency contacts, medical info, roles, certifications
- **Documents**: Passport scans, visas, travel permits with encrypted storage
- **Background Checks**: Checkr/Sterling integration with status tracking (pending, approved, failed)
- **Packets**: Trip information packages (PDF generation) distributed to participants
- **Transactions**: Trip cost tracking with payment status per participant

**Billing & Payments**
- Stripe integration for card payments (currently placeholder, ready for CardElement mount)
- Credit-based pricing model with per-trip/per-person rates
- Transaction history with filters (date range, status, payment method)
- Invoice generation and download
- Refund processing

**Team Management**
- Add team members with role assignment (org_admin, billing_admin, security_officer)
- Permission matrix: view, create, edit, delete, approve trips
- Activity tracking per team member
- Member removal with data cleanup

**Settings** (Organization & User)
- Organization profile (name, type, domain, contact info)
- Branding & appearance (theme selection)
- Notification preferences (email, in-app, SMS)
- Privacy & data retention policies
- Security & two-factor authentication setup
- Profile photo upload with image processing

**Help & Support**
- In-app help portal with articles
- Emergency contact numbers by country
- Support ticket creation
- FAQ and troubleshooting guides

### 1.2 Analyst Portal (Safety Reviewers)

**Dashboard & Queues**
- Trip review queue with filtering (status, priority, urgency, assignment)
- Personalized dashboard showing assigned trips, due dates
- Queue statistics (reviewed, pending, failed reviews, SLA metrics)
- Bulk assignment to analysts
- Tier-based queue stratification (T1/T2/T3 separate processing)

**Trip Review System** (17 comprehensive review sections)
1. **Itinerary** - Day-by-day timeline with event validation
2. **Participants** - Roster review with role verification, medical clearance
3. **Background Checks** - Status verification, conflict detection
4. **Air Travel** - Flight details, IATA validation, route analysis
5. **Ground Transportation** - Mode appropriateness, distance/duration analysis
6. **Lodging** - Accommodation validation, safety ratings, location assessment
7. **Venues** - Event location safety review
8. **Safety** - Rally points, safe houses, geofences, emergency procedures
9. **Briefings** - Country-specific travel briefings, risk assessment
10. **Emergency Preparedness** - First aid, emergency contacts, protocols
11. **Documents** - Passport validity, visa requirements, insurance
12. **Packets** - Distribution status, content completeness
13. **Intel Alerts** - Geo-specific intelligence alerts, threat matrix
14. **Checklists** - Pre-departure checklists per trip type
15. **Certifications** - Required certifications for chaperones
16. **Evidence** - Activity logs, change history, audit trail
17. **Insurance/Relocation** - Coverage verification, relocation point setup

**Evidence & Activity Panel**
- Unified activity log combining 5 sources: evidence_logs, audit_logs, analyst_activity, protection_events, comms_log
- Tamper-evident hashing for data integrity
- Before/after snapshots for all changes
- Full change diffs with actor and timestamp

**Safety Tools**
- Interactive map view (MapLibre GL) with:
  - Rally points (assembly locations)
  - Safe houses (refuge locations)
  - Geofences (auto-created for lodging)
  - Real-time location overlay
- Background check flagging and re-verification
- Lodging POI assessment with venue issue drawer
- Venue safety rating system
- Intel alert acknowledgment tracking

**Issue Management**
- Flag specific POIs (lodging, venue) with issue categories
- Severity and remediation tracking
- Communication templates for org notification

**Approval/Rejection Workflow**
- Section-by-section approval or rejection
- Detailed rejection comments with remediation guidance
- Batch approval across sections
- Decision versioning and audit trail

**Briefings & Intelligence**
- Auto-generated country briefings from State Department data
- Multi-language support (English, Spanish, French, Arabic, Mandarin)
- Risk level indicators (P5/P50/P95 percentiles from TarvaRI)
- Threat categories: weather, earthquake, disease, conflict, humanitarian, infrastructure

### 1.3 HQ Console (Internal Staff)

**Overview Dashboard**
- System health metrics (uptime, error rate, API latency)
- Organization statistics (active, at-risk, suspended)
- User metrics (growth, churn, by role)
- Trip pipeline (draft, in_review, active, completed)
- Revenue metrics (credits used, refunds)

**Organization Management**
- List all organizations with status, type, plan, credits
- Create new organizations (triggers Core API org creation + admin invite + activation email)
- Organization details: name, domain, type, settings, retention_days, stripe_customer_id, payment_status
- Org actions: suspend, reactivate, delete, update
- Bulk operations: suspend multiple, reactivate, assign analysts
- Stripe customer mapping for billing

**User Management**
- User directory filtered by role, organization, status
- Bulk user actions (invite, reactivate, disable)
- User details: name, email, role, org, account status
- Permission audit (view user's accessible resources)

**Checklist Management**
- Category-based checklist library (emergency, medical, documentation, etc.)
- Create/edit/delete checklist topics and items
- Item properties: title, description, category, trip_type applicability
- Checklist assignment to organizations
- Statistics: adoption rate, completion rate

**Policies & Configuration**
- System policies for trip types (T1, T2, T3)
- Policy rules: minimum chaperone count, required documents, background check requirements
- Feature flags and rollout configuration
- Rate limiting and quota management

**Trip Management (Admin View)**
- Trip list across all organizations
- Assign trips to analysts
- Override trip decisions
- Batch finalization for compliance
- Trip detail drawer with full data

**Financial/Billing**
- Invoice generation and tracking
- Payment method management
- Credit balance administration
- Transaction history
- Refund processing

**Analytics & Reporting**
- Custom report builder
- Trip completion rate by organization
- Average review time per tier
- Analyst throughput metrics
- Risk distribution heatmaps

**Settings & Integrations**
- SendGrid template configuration
- Stripe keys and webhook setup
- AviationStack API configuration
- System notifications
- Audit logging

### 1.4 Onboarding & Activation Flow

- Magic link email invitation (SendGrid)
- Email verification step
- Password creation with strength indicator
- Organization name validation (generates URL slug)
- Admin profile setup (name, phone, avatar)
- Security questions for account recovery
- Terms acceptance
- Welcome email and orientation

### 1.5 Traveler & Mobile Apps (SafeTrekr Native)

Note: Mobile app codebase at `safetrekr-traveler-native/` (deleted from main branch, separate repo). Architecture:
- **Framework**: React Native with Expo
- **State**: Zustand + TanStack Query
- **Maps**: MapLibre GL Native
- **Notifications**: Expo Push Notifications
- **Auth**: Supabase Auth with JWT persistence
- **Offline**: WatermelonDB for local-first sync

**Traveler Features**:
- Trip overview with itinerary timeline
- Real-time location tracking (background + foreground)
- Check-in system with role-based muster reporting
- Emergency alerts and acknowledgment
- Document access (passport, visas)
- Emergency contact information
- Location-based geofence entry/exit notifications
- Bi-directional SMS messaging with chaperones

**Chaperone Features**:
- Group management and roster
- Live location map with participant markers
- Check-in tracking per muster event
- Two-way SMS broadcast (safety directives, updates)
- Emergency procedures checklist
- Participant medical/emergency info access
- Real-time alert routing

---

## 2. API Endpoint Catalog

### 2.1 Core API v1 Routes (`safetrekr-core/src/api/v1/routes/`)

**35 route files with 100+ endpoints across:**

| Domain | Endpoints | Key Features |
|--------|-----------|--------------|
| **Trips** (`trips.py`) | POST/GET/PATCH/DELETE | Create, finalize, get detail, list, update status |
| **Organizations** (`orgs.py`) | POST/GET/PATCH | Create org, update settings, get hierarchy |
| **Users** (`users.py`) | POST/GET/PATCH | Create user, update profile, manage roles |
| **Auth** (`auth.py`) | POST | Login, refresh token, password reset |
| **Invites** (`invites.py`) | POST/PATCH/GET | Send invite, resend, revoke, track analytics |
| **Payments** (`payments.py`) | POST/GET | Process payment, create invoice, refund |
| **Background Checks** (internal) | POST/PATCH | Trigger Checkr/Sterling verification |
| **Alerts** (`alerts.py`) | GET/PATCH | List trip alerts, acknowledge |
| **Briefings** (`briefings.py`) | GET | Country briefings with risk data |
| **Checklists** (`checklists.py`) | GET/POST/PATCH | Get checklist by category, update progress |
| **Protection** (`protection.py`) | POST/GET/PATCH | Rally points, safe houses, geofences, musters |
| **Onboarding** (`onboarding.py`) | POST/PATCH | Activate user, set password |
| **Files** (`files.py`) | POST/DELETE | Upload passport/document, delete |
| **Guardians** (`guardians.py`) | POST/GET/PATCH | Consent tracking, parent info |
| **Emergency Info** (`emergency_info.py`) | GET/POST | Emergency contacts, procedures |
| **Comms** (`comms.py`) | POST/GET | SMS/email messaging, delivery tracking |
| **Support** (`support.py`) | POST/GET | Support tickets, help articles |
| **Review** (`review.py`) | GET/PATCH | Trip review progress, section status |
| **Evidence** (`evidence.py`) | GET | Audit logs, change history |
| **Search** (`search.py`) | POST | Full-text search trips, users, orgs |
| **Health** (`health.py`) | GET | Service health, DB connectivity |
| **Pricing** (`pricing.py`) | GET | Trip cost calculator, rate cards |
| **Advanced** (`advanced.py`) | GET | Analytics, statistics |
| **Webhooks** (`webhooks.py`) | POST | Stripe events, SendGrid bounces |
| **Invite Suppression** (`invite_suppression.py`) | POST/GET | Bounce/spam handling |
| **Invite Analytics** (`invite_analytics.py`) | GET | Invite metrics |
| **Guardian Overrides** (`guardian_overrides.py`) | POST/PATCH | Guardian consent override |
| **Countries** (`countries.py`) | GET | Country metadata |
| **Digests** (`digests.py`) | GET/POST | Trip update digests |
| **Issue Summary** (`issue_summary.py`) | GET | Flag summary for analyst |
| **Activity** (`activity.py`) | GET | User activity stream |
| **Users Settings** (`users_settings.py`) | PATCH | Privacy, notifications |
| **Emergency Prep Audit** (`emergency_prep_audit.py`) | GET | Audit compliance |

**Base URL**: `{NEXT_PUBLIC_CORE_API_URL}/v1/`

**Auth**: JWT via `Authorization: Bearer {token}` (from Supabase Auth)

**Key Patterns**:
- RBAC via `Depends(require_role(...))` or `Depends(get_current_user)`
- Pagination: `?limit=50&offset=0`
- Filtering: `?org_id=uuid&status=draft`
- Rate limiting: Role-based (60-300 req/min)
- Error responses: `{"error": {"code": "...", "message": "...", "details": {...}}}`

### 2.2 TarvaRI Intelligence API (`TarvaRI/app/`)

**Routers**:
- `/intel/sources` - Source configuration (8 endpoints)
- `/intel` - Intel records (search, detail, acknowledge)
- `/intel/bundles` - Deduplicated bundles with confidence
- `/triage` - Review queue, decisions, versioning
- `/trips` - Trip-alert matching, impact analysis
- `/api/scheduler` - Worker control (enable/disable)
- `/console` - Dashboard data, monitoring
- `/webhooks` - SendGrid/Stripe/delivery confirmations
- `/alert-publish` - Alert routing and delivery
- `/model-config` - Risk model versioning

**Key Features**:
- **Risk Scoring**: 12-feature model with P5/P50/P95 percentiles (Monte Carlo)
- **Source Ingestion**: 5 pilot sources (NOAA, USGS, CDC, ReliefWeb, GDACS)
- **Parser Registry**: CAP XML, GeoJSON, RSS, REST API parsing
- **Bundle Deduplication**: 50km radius, 24hr window clustering
- **Semantic Search**: pgVector embeddings (when TarvaCORE enabled)
- **Delivery Pipeline**: Email/SMS/push with acknowledgment tracking
- **DLQ Management**: Dead letter queue for failed deliveries

### 2.3 Supabase PostgREST API (Auto-generated)

**Direct table access** (for data not requiring business logic):
- `/rest/v1/organizations`
- `/rest/v1/users`
- `/rest/v1/trips`
- `/rest/v1/trip_participants`
- `/rest/v1/locations`
- `/rest/v1/flights`
- `/rest/v1/background_checks`
- `/rest/v1/trip_alerts`
- `/rest/v1/checklists`
- `/rest/v1/evidence_logs`
- `/rest/v1/audit_logs`
- `/rest/v1/protection_events`
- ... 40+ more tables with RLS policies

**Auth**: JWT or service key (bypasses RLS)

---

## 3. Database Schema Overview

### 3.1 Core Tables (Supabase PostgreSQL)

**Multi-Tenant Hierarchy**:
```
organizations (id, name, type, domain, settings, stripe_customer_id, payment_status, created_at)
  ├── users (id, email, name, role, org_id, auth_user_id, settings, created_at)
  ├── trips (id, title, destination, start_date, end_date, type, status, org_id, created_by, created_at)
  │   ├── trip_participants (id, trip_id, user_id, role, emergency_contact, medical_info, certifications)
  │   ├── locations (id, name, address, latitude, longitude, location_type, trip_id, capacity)
  │   ├── flights (id, trip_id, direction, date, time, airline, iata_code, aircraft)
  │   ├── trip_alerts (id, trip_id, category, severity, description, status, created_at)
  │   └── packet_versions (id, trip_id, version, pdf_url, status, created_at)
```

**Audit & Compliance**:
```
evidence_logs (id, trip_id, actor_id, event_type, entity_type, before_snapshot, after_snapshot, diff, event_hash, timestamp)
audit_logs (id, user_id, resource_type, action, before_value, after_value, timestamp)
analyst_activity (id, actor_id, action, trip_id, metadata, created_at)
protection_events (id, trip_id, actor_id, entity_type, payload, created_at)
comms_log (id, created_by, category, subject, trip_id, metadata, created_at)
```

**Unified Activity View**:
```
v_unified_activity — UNION of 5 sources into single timeline
```

**Support Tables**:
```
background_checks (id, participant_id, status, provider, report_url, created_at)
consents (id, trip_id, participant_id, type, signed_at, metadata)
pending_invites (id, email, org_id, role, token, status, created_at)
review_queue (id, trip_id, assigned_analyst_id, status, created_at)
review_issues (id, section, severity, description, status)
checklists (id, category, topic, trip_types, created_at)
checklist_progress (id, trip_id, checklist_id, progress_percent)
```

**Intelligence (TarvaRI)**:
```
intel_sources (id, name, parser_class, polling_interval, enabled, created_at)
intel_normalized (id, source_id, severity, category, geometry, description, embeddings, lineage_hash)
intel_bundles (id, confidence, geometry, sources, created_at)
triage_decisions (id, bundle_id, approved_by, status, version, created_at)
delivery_cards (id, trip_id, bundle_id, delivery_status, created_at)
acknowledgements (id, delivery_card_id, user_id, acked_at)
```

**New Tables (Recent Features)**:
```
participant_roles (id, trip_id, participant_id, role, created_at)
certifications (id, participant_id, type, issued_date, expires_date)
insurance_tracking (id, trip_id, policy_number, provider, expires_date)
guardian_bypass (id, trip_id, participant_id, reason, approved_by, created_at)
relocation_point (id, trip_id, location_id, is_primary)
traveler_registry (id, email, name, organization_id, verified_at)
digests (id, trip_id, created_at, content, distribution_status)
digest_recipients (id, digest_id, user_id, read_at)
```

### 3.2 Row Level Security (RLS) Policies

All tables protected with RLS:
- **Org boundary**: Users see only own org's data (except HQ staff)
- **HQ bypass**: Service role bypasses RLS for admin operations
- **Traveler visibility**: Travelers see only assigned trips
- **Analyst scope**: Analysts see assigned trips + org's trips
- **Create policies**: Enforce auth_user_id matching
- **Update/Delete**: Actor must own or have org_admin role

### 3.3 Key Indexes (Performance)

```sql
idx_trips_org_created (org_id, created_at DESC)
idx_trip_participants_trip (trip_id)
idx_trip_alerts_trip_created (trip_id, created_at DESC)
idx_evidence_logs_trip_ts (trip_id, timestamp DESC)
idx_analyst_activity_trip_ts (trip_id, created_at DESC)
idx_users_org (org_id)
idx_locations_trip (trip_id)
idx_background_checks_participant (participant_id)
```

---

## 4. Authentication & Authorization Architecture

### 4.1 Dual User ID System (Critical)

```
Supabase Auth Layer         Public Schema
   auth.users.id      ≠        users.id
   (UUID from Auth)            (UUID from DB)
        ↓                            ↓
 Sent in JWT sub          Used for DB queries
```

**Mapping**: `auth.users.id` → lookup `users.auth_user_id` → get `users.id` (public UUID)

**Problem Solved**: AuthProvider maps between them on every init via single() lookup.

### 4.2 Auth Flow

1. **Supabase Auth**: User signs in → generates JWT with `sub: auth.users.id`
2. **API Receives**: `Authorization: Bearer {jwt}`
3. **Validation**: Core API decodes JWT using `SUPABASE_JWT_SECRET`
4. **User Lookup**: Query `SELECT * FROM users WHERE auth_user_id = {decoded.sub}`
5. **Permission Check**: Verify role matches endpoint requirement
6. **Response**: Return data filtered by org_id if org-scoped

### 4.3 Role Hierarchy & RBAC

**10 Roles across 4 Categories**:

| Category | Roles | Permissions | Rate Limit |
|----------|-------|-------------|-----------|
| **Traveler** | traveler, chaperone, guardian | View own trip, check in, acknowledge alerts | 60/min |
| **Org Staff** | org_admin, billing_admin, security_officer | Create trips, manage team, approve checklists | 120/min |
| **Analyst** | analyst | Review trips, approve sections, flag issues | 180/min |
| **HQ** | hq_admin, hq_supervisor, hq_security, hq_ops | Manage orgs, users, system config | 300/min |

**Permission Matrix** (in code via `require_role(...)` decorator):
```python
@router.post("/trips")
async def create_trip(user: User = Depends(require_role("org_admin"))):
    # Only org_admin can create
```

### 4.4 Zustand Auth Store (Frontend)

```typescript
useAuthStore() → {
  user: { id, email, name, role, orgId } | null,
  isAuthenticated: boolean,
  accessToken: string | null,
  setAuth(user, token, refresh),
  clearAuth(),
  signOut()
}
```

**Storage**: Persisted in localStorage as `safetrekr-auth`

**Critical Pattern**: Never use `useAuthStore.getState()` in service classes (hydration race). Instead:
- Pass `analystId` explicitly to service methods
- React hooks read reactively: `useAuthStore((s) => s.user?.id)`

---

## 5. External Integrations

### 5.1 SendGrid (Email)

**Usage**: Invites, password resets, status updates

**Implementation** (Core API):
```
src/services/email/ → SendGridEmailService
  - Template ID mapping (SENDGRID_TEMPLATE_TRAVELER, etc.)
  - Async via anyio thread pool offload
  - Retry with exponential backoff (3 attempts)
  - Sandbox mode for testing
```

**Flow**:
1. Core API trip finalize → generates invite records
2. Invitation service builds email with magic link token
3. SendGrid async send (thread pool)
4. Webhook: SendGrid bounce/spam → invite_suppression table

### 5.2 Stripe (Payments)

**Status**: Integrated but frontend placeholder (ready for CardElement)

**Implementation** (roadmap):
- Card payment via Stripe Elements
- Credit charging per trip/participant
- Invoice generation
- Refund processing

**Current state**:
- Organization-level stripe_customer_id stored
- Trip cost calculated per pricing rules
- Payment modal exists but awaits Stripe.js mount

### 5.3 AviationStack (Flight Lookups)

**Usage**: Real-time flight status and details

**Endpoint**: `POST /api/flights/lookup` (Next.js API route)

**Flow**:
1. Frontend sends: `{ airline_iata, flight_iata, date }`
2. Route validates IATA format (e.g., "UA123")
3. Queries AviationStack API with real flight data
4. Returns: aircraft type, departure/arrival gates, status
5. Frontend updates flight form

**Error Handling**: Falls back to manual entry if API unavailable

### 5.4 Overpass/OpenStreetMap (Location Search)

**Usage**: Geocoding and place search during trip creation

**Implementation** (`src/lib/services/overpass-service.ts`):
- Reverse geocoding (lat/lng → address)
- Location search (name → coordinates)
- Fallback chain: Overpass → OSM → manual entry

**Rate Limiting**: Client-side debounce (500ms)

### 5.5 MapLibre GL (Maps)

**Usage**: Interactive maps in Analyst Portal

**Components**:
- Trip itinerary map (day-by-day locations)
- Safety map with rally points, safe houses, geofences
- Real-time location tracking (traveler app)
- Heat maps (risk zones)

**Custom Layers**:
- Rally points (blue markers)
- Safe houses (green markers)
- Geofences (red polygons)
- Lodging locations (yellow markers)

**Performance**:
- Vector tiles (Mapbox/OSM)
- Clustering for high-density markers
- WebGL rendering

### 5.6 Expo Push Notifications (Mobile)

**Usage**: Native alerts to chaperones/travelers

**Implementation** (`safetrekr-traveler-native`):
- Expo Notifications API
- Device token management
- Background service registration
- Notification channel configuration (Android)

**Flow**:
1. TarvaRI alert approved → delivery_cards created
2. TarvaRI delivery service calls Expo API
3. Expo routes to installed apps
4. Native handler: badge, sound, alert
5. User acknowledges → acknowledgements record

**Token Lifecycle**:
- Refresh on app launch
- Deactivate on uninstall
- Retry with exponential backoff

---

## 6. State Management Patterns

### 6.1 TanStack Query (Server State)

**Query Key Factory** (`src/shared/query/query-keys.ts`):
```typescript
queryKeys.client.trips.list(orgId)    // ['client', 'trips', 'list', orgId]
queryKeys.analyst.queue.list()         // ['analyst', 'queue', 'list']
queryKeys.hq.organizations.stats()    // ['hq', 'organizations', 'stats']
```

**Enables batch invalidation**:
```typescript
queryClient.invalidateQueries({ queryKey: ['client', 'trips'] })
// Invalidates all trip queries for client
```

**Mutation Pattern**:
```typescript
const mutation = useMutation({
  mutationFn: async (data) => await api.createTrip(data),
  onSuccess: () => queryClient.invalidateQueries({
    queryKey: queryKeys.client.trips.all()
  })
})
```

**Usage across app**:
- Dashboard summaries: `useQuery(queryKeys.client.dashboard.summary(orgId))`
- Trip detail: `useQuery(queryKeys.client.trips.detail(tripId))`
- Analyst queue: `useQuery(queryKeys.analyst.queue.list())`
- HQ stats: `useQuery(queryKeys.hq.organizations.stats())`

### 6.2 Zustand (UI State)

**Persistent Stores**:
```typescript
// Authentication
useAuthStore → { user, isAuthenticated, setAuth, clearAuth }

// UI state (module-specific)
useClientTripsStore (analyst) → { selectedTrip, filters, setSelectedTrip }
useAnalystQueueStore → { sortBy, filterStatus, expandedSections }
useHQUsersStore → { searchTerm, roleFilter, pageIndex }
```

**Anti-pattern avoided**: Never use `getState()` in API classes (Zustand persist hydration race)

**Solution**: Pass state as explicit parameters
```typescript
// DON'T
const analystId = useAnalystStore.getState().user.id  // Race condition
await api.fetchTrips()

// DO
const { analystId } = useAnalystStore((s) => ({ analystId: s.user?.id }))
useQuery(queryKeys.analyst.queue.list(analystId), { enabled: !!analystId })
```

### 6.3 Context API (Auth Provider)

**Single source of truth for auth state**:
```typescript
<AuthProvider>
  <QueryClientProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </QueryClientProvider>
</AuthProvider>
```

**Usage in components**:
```typescript
const { user, isAuthenticated, signOut } = useAuth()
```

---

## 7. Testing Coverage

### 7.1 E2E Tests (Playwright)

**4 test specs** (187+ assertions):

1. **smoke.spec.ts** - Basic navigation
   - Login → dashboard visibility
   - Logout → redirect to login
   - Port accessibility (3000 or 3003)

2. **create-organization.spec.ts** - Org creation
   - HQ admin org creation flow
   - Admin email generation
   - Org validation

3. **trip-wizard.spec.ts** - Trip creation
   - 10-step wizard completion
   - Form validation
   - CSV import
   - Trip finalization

4. **trip-lifecycle.spec.ts** - Full end-to-end (most comprehensive)
   - Phase 0: HQ admin creates org + activates admin (Supabase Auth Admin API)
   - Phase 1: Org admin creates trip via wizard → payment flow → submits
   - Phase 2: HQ admin assigns to analyst via queue
   - Phase 3: Analyst reviews all 17 sections → approves
   - Validates: form data persists, section status propagates, trip status transitions

**Test Utilities**:
- `loginAs(page, email, password)` - Auth helper
- `logout(page)` - Clear session
- `activateNewAdmin(email, password)` - Supabase Admin API wrapper
- `waitForNetworkIdle()` - Async wait helper

**Configuration**: `playwright-no-server.config.ts` (for running against already-started dev server)

**Test Data**:
- Static accounts: hqadmin@safetrekr.com, testanalyst@safetrekr.com
- Dynamic org/emails: `justin+e2e{timestamp}@tarva.network` (fresh per run)

### 7.2 Unit Tests (Vitest)

**Configuration**: `src/test/setup.ts` with jsdom

**Test Files** (pattern: `**/*.{test,spec}.{ts,tsx}`):
- Component tests: Form validation, event handling, rendering
- Hook tests: Custom hooks (useMaplibre, useDeepLink, etc.)
- Utility tests: Date formatting, permission checks, URL parsing

**Mocks**:
- Supabase mock in test setup
- Query client reset per test
- Auth store reset

### 7.3 API Tests (Core API / FastAPI)

**safetrekr-core/tests/`:
```
unit/routes/      → Endpoint-specific tests
  - test_invites.py
  - test_auth.py
  - test_trips.py
  - etc.
integration/      → End-to-end flows
  - test_trip_lifecycle.py
  - test_org_creation.py
```

**pytest setup**: Fixtures for authenticated client, test org/user seeding, database cleanup

**Coverage**: `pytest --cov=src --cov-report=html`

### 7.4 TarvaRI Tests

**92 tests total**:
```
tests/unit/test_parsers.py     → 20+ parsers (NWS, USGS, CDC, etc.)
tests/unit/test_models.py      → Pydantic model validation
tests/unit/test_risk_scoring.py → Risk model with Monte Carlo
tests/integration/             → E2E ingest→bundle→triage flows
```

**Parser tests**: Real-world payloads from each source

---

## 8. Build & Deploy Pipeline

### 8.1 Frontend (safetrekr-app-v2)

**Build Process**:
```bash
pnpm build  # Next.js 15 with Turbopack
# Output: .next/standalone (ready for Docker)
# Features: output: 'standalone' removes Node dependencies
```

**Docker**:
```dockerfile
FROM node:20-alpine
COPY .next/standalone /app
EXPOSE 3000
CMD ["node", "/app/server.js"]
```

**K8s Deployment** (`k8s/prod/`):
- StatefulSet (sticky sessions for auth)
- 3 replicas
- Env vars injected via Doppler (not baked in)
- Liveness/readiness probes on `/`

**Environment Variables** (injected at runtime):
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_CORE_API_URL
NEXT_PUBLIC_API_MODE (mock | supabase)
SENDGRID_API_KEY (server-side only)
NEXT_PUBLIC_AVIATIONSTACK_API_KEY
```

### 8.2 Core API (safetrekr-core)

**Docker Compose** (`docker-compose.yml`):
```yaml
services:
  api:
    image: python:3.11-slim
    command: uvicorn src.main:app --reload --port 8001
    volumes: [".:/app"]
    ports: ["8001:8001"]
  redis:
    image: redis:7-alpine
    ports: ["6380:6379"]
```

**Production Build**:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src /app/src
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8001"]
```

**K8s Deployment** (`k8s/prod/`):
- Deployment (stateless, horizontal scaling)
- Service (port 8001)
- Env from ConfigMap (Doppler injected)
- Redis StatefulSet for session store

### 8.3 TarvaRI (Intelligence API)

**Services**:
- API: `uvicorn app.main:app`
- Ingest Worker: `python -m app.workers.ingest_worker`
- Bundler Worker: `python -m app.workers.bundler_worker`
- Alert Router: `python -m app.workers.alert_router_worker`
- Delivery: `python -m app.workers.delivery_worker`
- Cleanup: `python -m app.workers.cleanup_worker`

**Docker Compose** (with worker profiles):
```bash
docker-compose up api redis                    # API + Redis only
docker-compose --profile workers up            # + all workers
docker-compose up -d --scale worker=3          # Scale ingest worker
```

### 8.4 CI/CD (GitHub Actions)

**Branch Model**:
- `develop` → dev environment
- `master` → production

**Workflow** (on push to main branches):
1. Lint & test (parallel)
2. Build Docker image
3. Push to GHCR: `ghcr.io/safetrekr/safetrekr-core:{env}-{sha8}`
4. Deploy via kubectl (if auth available)
5. Run post-deploy smoke tests

**Secret Management**: Doppler (injected as `DOPPLER_TOKEN` in k8s)

### 8.5 Local Development

**Full stack via parent `dev.sh`**:
```bash
./dev.sh start                # Core API + Redis only
./dev.sh start --intel        # + TarvaRI
./dev.sh start --all          # + all workers + frontend
./dev.sh stop
```

**Ports**:
- Frontend: 3000 (or 3003 with Turbopack flag)
- Core API: 8001
- TarvaRI: 8000
- Redis (Core): 6380
- Redis (TarvaRI): 6379
- Console (TarvaRI): 5174

---

## 9. Technical Debt & Code Quality Observations

### 9.1 Critical Issues (Fixed in Analysis Period)

**[FIXED 2026-02-06] Organizations Table Schema Mismatch**
- Problem: `organization-mutations.ts` inserting non-existent `slug`, `plan`, `status` columns
- Impact: 400 errors on org creation
- Solution: Use actual columns (settings JSONB, payment_status, credits)
- Slug now generated client-side via `generateSlug(name)`

**[FIXED 2026-02-13] Auth User ID Dual System**
- Problem: `useAuthStore.getState()` in API services → race condition with Zustand persist
- Impact: Production sign-outs never returned to login
- Solution: Pass `analystId` explicitly to all service methods, use reactive hooks

**[FIXED 2026-02-13] Email Invite Sending**
- Problem: Core API `trips.py` finalize used `current_user.first_name` (doesn't exist)
- Impact: Invite records created but emails never sent
- Solution: Changed to `current_user.name or current_user.email`

**[FIXED 2026-02-06] Itinerary Events Insert**
- Problem: Three failures in Core API `itinerary_events` insert:
  1. `start_time` NOT NULL, defaulted to None → now defaults to "00:00:00"
  2. `location_id` FK to non-existent location → now always None
  3. `category` CHECK constraint only allows 8 values → added CATEGORY_MAP dict
- Impact: Silent try/except failures, incomplete trip data
- Solution: Explicit validation + category mapping

### 9.2 Architectural Improvements

**Positive patterns**:
- ✅ Query key factory enables sophisticated cache invalidation
- ✅ Supabase API factory pattern (lazy singletons) with reset for testing
- ✅ RLS provides multi-tenant isolation at database level
- ✅ Structured logging in Core API (JSON with correlation IDs)
- ✅ Evidence logs with tamper-evident hashing (event_hash)
- ✅ Unified activity view (v_unified_activity) aggregates 5 audit sources
- ✅ Type-safe exceptions (NotFoundError, ForbiddenError, etc.)

**Areas for improvement**:
- ⚠️ API mode fallback (mock/supabase) could cause silent failures
- ⚠️ No circuit breaker for external services (AviationStack, SendGrid)
- ⚠️ Rate limiting is role-based but not per-user (could be gamed)
- ⚠️ TarvaRI workers poll every 5min → 288 polls/day (expensive on free tier Supabase)
- ⚠️ Evidence logs lack encryption for sensitive data (PII in snapshots)
- ⚠️ No automatic data retention for GDPR compliance (manual cleanup)

### 9.3 Code Quality Metrics

**Frontend** (safetrekr-app-v2):
- 1,051 TS/TSX files, ~188K lines
- No ESLint (only Prettier for formatting)
- Turbopack in dev (Fast refresh)
- Strong typing (strict mode on)
- Module structure clear and organized

**Backend** (safetrekr-core):
- 35 route files, well-organized
- Type-safe Pydantic models
- Comprehensive docstrings
- Middleware pipeline documented
- Some broad `except Exception` catches need refining

**TarvaRI**:
- 92 tests with good coverage
- Parser registry pattern is extensible
- Worker code has graceful shutdown
- Some hardcoded defaults (could use config)

### 9.4 Type Safety

**Frontend**:
- TypeScript strict mode enabled
- Zod schemas for form validation
- API response types auto-generated from Supabase schema (potential)

**Backend**:
- Pydantic v2 for all models
- mypy type checking
- Some use of `Any` in error responses

### 9.5 Performance Considerations

**Database**:
- Indexes on hot paths (org_id, created_at, trip_id)
- Pagination default 50, max 100
- Redis caching with 5min TTL default
- Partial indexes for analyst_activity (WHERE trip_id IS NOT NULL)

**Frontend**:
- Code splitting via Next.js automatic routes
- MapLibre GL clustering for 1000+ markers
- Image optimization via Sharp
- Next.js 15 with Turbopack (excellent dev DX)

**API**:
- Async/await throughout (uvicorn + FastAPI)
- Thread pool offload for sync tasks (SendGrid)
- Rate limiting per role
- GZIP compression middleware

---

## 10. Mobile App Architecture (safetrekr-traveler-native)

### Note: Currently Deleted from Repository
The mobile app exists in a separate React Native repository (not in this monorepo currently). Key architecture:

**Stack**:
- React Native with Expo (managed hosting)
- Zustand + TanStack Query (same as web)
- WatermelonDB (local-first offline sync)
- MapLibre GL Native (native maps)
- Expo Notifications (push alerts)

**Key Modules**:
- Authentication (Supabase Auth + JWT persistence)
- Trip Overview (itinerary timeline, participant list)
- Location Services (background tracking + foreground)
- Check-in System (role-based muster reporting)
- Messaging (SMS with chaperones)
- Documents (passport, visa access)
- Geofences (entry/exit notifications)

**Deployment**:
- EAS Build (Expo's CI for iOS/Android)
- Over-the-air updates (Expo Updates)
- Separate app stores (iOS App Store, Google Play)

---

## 11. Key Dependencies & Tech Stack

### Frontend Stack
- **Next.js 15** with App Router, Turbopack
- **React 19**, React DOM 19
- **TypeScript 5** (strict mode)
- **Tailwind CSS v4** with CSS variables
- **Radix UI** (shadcn/ui components)
- **TanStack Query 5** (server state)
- **Zustand 5** (UI state)
- **React Hook Form** + **Zod** (forms)
- **MapLibre GL 5** (maps)
- **AG-Grid Community 34** (data grids)
- **Playwright 1.57** (E2E testing)
- **Vitest 4** (unit testing)
- **Anime.js 4** (animations)
- **Sonner 2** (toasts)
- **date-fns 4** (date manipulation)

### Backend Stack
- **FastAPI 0.115+**
- **Uvicorn 0.32+** (ASGI server)
- **Pydantic 2.10+** (validation)
- **Supabase-py 2.11+** (PostgreSQL client)
- **Redis 5** (caching)
- **SendGrid 6+** (email)
- **Python-Jose 3.3** (JWT)
- **Passlib + bcrypt** (password hashing)
- **Pytest 8+** (testing)
- **Black + Ruff + mypy** (code quality)

### Infrastructure
- **Docker & Docker Compose**
- **Kubernetes** (EKS for production)
- **GitHub Actions** (CI/CD)
- **Doppler** (secrets management)
- **Supabase** (PostgreSQL + RLS + PostgREST)
- **GHCR** (container registry)

---

## 12. Deployment Checklist & Environment Setup

### Prerequisites
```bash
# Node.js 20+
node --version

# Python 3.11+
python --version

# pnpm (not npm)
pnpm install

# Docker & Docker Compose
docker --version
docker-compose --version
```

### Environment Variables

**Frontend (.env.local)**:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_CORE_API_URL=http://localhost:8001
NEXT_PUBLIC_API_MODE=supabase
NEXT_PUBLIC_AVIATIONSTACK_API_KEY=xxx
NEXT_PUBLIC_API_FALLBACK_TO_MOCK=false
```

**Backend (.env)**:
```
DATABASE_URL=postgresql://user:pass@host/safetrekr
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=xxx (service role key for RLS bypass)
JWT_SECRET=xxx (from Supabase, for token validation)
SENDGRID_API_KEY=SG.xxx
SENDGRID_SANDBOX_MODE=true (for testing)
SENDGRID_TEMPLATE_TRAVELER=d-xxx
SENDGRID_TEMPLATE_CHAPERONE=d-xxx
REDIS_URL=redis://localhost:6380
```

### First-Time Setup

```bash
# 1. Clone repository
git clone ...

# 2. Install dependencies
cd safetrekr-app-v2 && pnpm install
cd ../safetrekr-core && pip install -r requirements.txt
cd ../TarvaRI && pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit with real credentials

# 4. Run migrations (if needed)
cd safetrekr-app-v2/supabase
supabase migration up

# 5. Seed data
cd safetrekr-core
python scripts/seed_pilot_sources.py

# 6. Start services
./dev.sh start --all
```

---

## 13. Key Feature Flows

### Trip Creation Flow (Client Portal)
1. Click "Create Trip" → opens 10-step wizard
2. Step 1: Basic info (title, destination, dates, type)
3. Step 2: Itinerary (day builder with CSV import option)
4. Step 3: Flights (lookup via AviationStack or manual)
5. Step 4: Transportation (leg-by-leg details)
6. Step 5: Lodging (multi-property, location validated)
7. Step 6: Venues (event locations)
8. Step 7: Participants (travelers, chaperones, guardians)
9. Step 8: Documents (passport, visa requirements)
10. Step 9: Review (summary with validation warnings)
11. Step 10: Payment (Stripe placeholder + submit)
12. POST to Core API: `/v1/trips/finalize` with complete payload
13. Core API: Creates trip, injects defaults (dates, locations, categories)
14. Response: `{trip_id, status: "in_review", sections_status: {...}}`
15. Redirect to trip detail or queue (analyst view)

### Trip Review Flow (Analyst Portal)
1. Login as analyst → Dashboard with assigned trips
2. Click trip → opens review workspace
3. Left sidebar: 17 section tabs
4. Each section shows:
   - Section header with status indicator
   - Data grid or form fields (pre-populated)
   - Validation warnings (missing required fields)
   - Issue flags (lodging POIs, venues, background checks)
5. Analyst actions:
   - **Approve section**: Click "Approve" → status → "approved"
   - **Reject section**: Click "Reject" + comment → status → "rejected"
   - **Flag issue**: Click flag icon → Issue drawer (severity, description)
   - **Batch approval**: Select multiple → "Approve All"
6. After all 17 sections approved:
   - Trip status → "active"
   - Core API notifies org + sends confirmation email
   - Trip finalization triggers TarvaRI matching
7. Finalization:
   - Trip location coverage analyzed
   - Intelligence bundles matched (geospatial + temporal)
   - Risk score calculated (P5/P50/P95)
   - Delivery cards created for org admins & travelers

### Intelligence Alert Delivery (TarvaRI)
1. **Ingest**: Source connector polls NOAA, USGS, CDC, etc.
2. **Parse**: Parser converts to normalized intel (severity, category, geometry)
3. **Bundle**: Bundler clusters by location (50km) + time (24hr)
4. **Triage**: Admin approves bundle → creates delivery card
5. **Route**: Alert router matches trip locations → selects org
6. **Delivery**: Delivery service sends:
   - Email to org admin + analyst
   - Push to chaperone app
   - SMS to travelers (optional)
7. **Acknowledge**: Travelers acknowledge → tracked in `acknowledgements` table

---

## 14. Security Architecture

### 14.1 Data Protection
- ✅ JWT for API auth (Supabase Auth)
- ✅ RLS at database level (user isolation)
- ✅ Service role for admin ops (bypasses RLS)
- ✅ Evidence logs with tamper-evident hashing
- ✅ Encrypted document storage (Supabase bucket policies)
- ⚠️ Snapshots in evidence_logs contain raw PII (not encrypted)

### 14.2 Network Security
- ✅ CORS configured per environment
- ✅ GZIP compression
- ✅ Security headers middleware
- ⚠️ No HTTPS enforcement in dev (expected)
- ⚠️ Rate limiting not per-user (role-based only)

### 14.3 API Security
- ✅ RBAC via role decorators
- ✅ Input validation (Pydantic)
- ✅ Parameterized queries (ORM)
- ✅ Error messages don't leak internal details
- ⚠️ Broad `except Exception` catches need specific types

---

## 15. Recommended Next Steps & Improvements

### High Priority
1. **Complete Stripe Integration**: Mount CardElement in payment page
2. **Add Per-User Rate Limiting**: Prevent abuse at individual level
3. **Encrypt Evidence Snapshots**: Add AES-256 to before/after_value
4. **Circuit Breaker Pattern**: Graceful degradation for external services
5. **GDPR Retention**: Implement automatic cleanup for compliance

### Medium Priority
6. **TarvaRI Worker Optimization**: Implement exponential backoff for free-tier Supabase
7. **GraphQL Layer (Optional)**: If complex nested queries become common
8. **Mobile Offline Sync**: Finalize WatermelonDB integration
9. **Advanced Reporting**: Custom query builder for HQ analytics
10. **Webhook Signature Verification**: Secure SendGrid + Stripe webhooks

### Low Priority
11. **API Documentation**: Generate OpenAPI spec from code
12. **Performance Dashboard**: Built-in monitoring for slow queries
13. **Localization**: I18n for international deployments
14. **Accessibility Audit**: WCAG 2.1 AA compliance check

---

## Appendix: File Structure Summary

```
/Users/justintabb/projects/safetrekr/
├── safetrekr-app-v2/                    # Next.js 15 Frontend (1,051 files, 188K lines)
│   ├── src/
│   │   ├── app/                         # Next.js App Router (12 route groups)
│   │   ├── modules/                     # Portal-specific (client, analyst, hq, onboarding)
│   │   ├── shared/                      # Cross-portal (API, auth, components, hooks, query)
│   │   ├── components/                  # UI components (ui/, shared/)
│   │   ├── lib/                         # Utilities (supabase, env, motion, services)
│   │   ├── providers/                   # Context providers (Auth, Query, Theme)
│   │   └── types/                       # TypeScript types (trip, participant, etc.)
│   ├── supabase/                        # Migrations (20+ SQL files)
│   ├── e2e/                             # Playwright tests (4 specs)
│   ├── k8s/                             # Kubernetes configs (dev, prod)
│   └── package.json                     # pnpm deps (Radix, TanStack, etc.)
│
├── safetrekr-core/                      # FastAPI Core API (35 route files)
│   ├── src/
│   │   ├── api/v1/routes/               # Endpoints (35 files)
│   │   ├── core/                        # Config, auth, cache, exceptions, security
│   │   ├── db/                          # Supabase wrapper, Pydantic models
│   │   ├── middleware/                  # CORS, security, rate limit, compression
│   │   ├── services/                    # Email, notifications, checklist, geofence
│   │   └── utils/                       # Performance, query optimization, image
│   ├── tests/                           # Unit + integration tests
│   ├── migrations/                      # Database migrations
│   ├── k8s/                             # Kubernetes configs
│   └── requirements.txt                 # FastAPI, Supabase, SendGrid, etc.
│
├── TarvaRI/                             # Intelligence API (FastAPI)
│   ├── app/
│   │   ├── api/                         # Core routers (sources, intel, bundles, triage, risk)
│   │   ├── routers/                     # Additional routers (console, alert_publish, webhooks)
│   │   ├── parsers/                     # Source-specific parsers (20+)
│   │   ├── workers/                     # Background workers (5 types)
│   │   ├── services/                    # Risk scoring, delivery, trip matching
│   │   ├── connectors/                  # REST, RSS, WebSocket, WMS
│   │   └── core/                        # Config, auth, database, telemetry
│   ├── console/                         # React ops dashboard
│   ├── tests/                           # Unit + integration (92 tests)
│   ├── migrations/                      # Database migrations
│   └── requirements.txt                 # FastAPI, Supabase, Redis, etc.
│
├── packages/core-logic/                 # Shared TypeScript package
│   ├── src/
│   │   ├── api/                         # Shared API types
│   │   └── types/                       # Common domain types
│   └── package.json                     # Exports to both apps
│
└── README.md, CLAUDE.md                 # Documentation
```

---

**Analysis Complete**: Comprehensive SafeTrekr codebase documented with feature inventory, API endpoints, database schema, auth architecture, testing strategy, deployment pipeline, and technical observations from 15+ months of development.