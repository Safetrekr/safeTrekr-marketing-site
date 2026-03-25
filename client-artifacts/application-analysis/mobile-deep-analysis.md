# SafeTrekr Mobile App -- Deep Analysis Report

**Date**: 2026-03-17
**Branch**: wireUp5
**Stack**: Expo 54, React Native 0.81, React 19.1.4, NativeWind 4.x, Gluestack UI 1.x, Expo Router 6.x
**Analyst**: RNAD Agent

---

## Table of Contents

1. [Feature Documentation](#1-feature-documentation)
2. [Enhancement Proposals](#2-enhancement-proposals)
3. [Risk Assessment](#3-risk-assessment)
4. [Architecture Recommendations](#4-architecture-recommendations)
5. [Priority Recommendations](#5-priority-recommendations)

---

## 1. Feature Documentation

### 1.1 Provider Architecture (7 Providers, ~2,835 LOC)

The app uses a two-tier provider hierarchy:

**Root Layout** (`app/_layout.tsx`):
```
QueryClientProvider
  OfflineProvider (SQLite queue + NetInfo)
    GluestackUIProvider
      ThemeProvider (light/dark/system)
        ErrorBoundary
          AuthProvider (JWT + SecureStore)
            NotificationProvider (push token + channels)
              Stack Navigation
```

**Trip Layout** (`app/(app)/trip/[tripId]/_layout.tsx`):
```
TripProvider (trip data + role detection)
  OnboardingGate
    LocationProvider (foreground tracking + 10s backend sync)
      GeofenceProvider (native regions + JS polygon checks)
        TripContent (tabs + navigation)
```

**Key Observations**:
- AuthProvider manages JWT lifecycle exclusively through SecureStore -- no dual-store problem as exists in the web app. The auth architecture is sound.
- Trip context is stored atomically (single JSON blob in SecureStore) to prevent split-brain on app kill.
- The provider chain is 10 levels deep at the trip screen level. React renders are not gated by context selectors, so any change in any provider triggers a full subtree re-render.

### 1.2 Authentication Flow

Entry path: Deep link `safetrekr://invite?token=xxx` -> `/join` page -> `POST /v1/auth/consume-invite` -> JWT + refresh token stored in SecureStore -> redirect to `/trip/:tripId/`.

Token refresh: AuthProvider intercepts 401 from apiClient, calls `POST /v1/auth/refresh`, stores new tokens, retries the original request. Handles complete auth failure by clearing all storage and redirecting to `/`.

Trip switching: Server-first write (`POST /users/me/active-trip`) then local state update. Mutex prevents concurrent switches. Trip memberships fetched on auth and on app foregrounding.

### 1.3 Notification System

**Client-side (functional)**:
- 8 Android notification channels configured (emergency, geofence, schedule, trip_updates, check_in, muster, intel_alert, general)
- Emergency channel has `bypassDnd: true`
- Foreground handler: shows alert for all notifications, plays sound for emergency/muster/intel_alert
- Tap routing: maps notification category to appropriate screen
- Push token registration: `POST /users/me/push-token` with token + deviceType

**Server-side (non-functional)**:
- Token registration endpoint exists but reportedly returns `False` for push delivery
- Root cause: Backend likely lacks Expo Push Notifications SDK integration to actually send pushes via `https://exp.host/--/api/v2/push/send`

### 1.4 Alert System

- `useAlertsQuery`: Fetches `GET /trips/:tripId/alerts`, transforms raw API response
- **Polling**: `refetchInterval: 60_000` (60 seconds), `staleTime: 30_000` (30 seconds)
- **No Realtime subscription**: Supabase Realtime is set up for `participant_locations` only. No subscription exists for the alerts table despite the backend publishing to Realtime.
- `useAcknowledgeAlert`: Direct `POST` to `/trips/:tripId/alerts/:alertId/acknowledge` -- does NOT use the offline queue
- `useMarkAlertRead`: Direct `POST` to `/trips/:tripId/alerts/:alertId/read` -- does NOT use the offline queue
- Priority display: 5 levels (P1 Critical through P5 Info) with hardcoded hex colors in `PRIORITY_CONFIG`

### 1.5 Location Tracking

**Foreground** (LocationProvider):
- `expo-location` watchPositionAsync with High accuracy, 10m distance interval, 5s time interval
- Backend sync throttled to every 10 seconds via `LOCATION_UPDATE_INTERVAL`
- Offline buffer: FIFO queue of 5 most recent points, flushed on app foregrounding
- Guardian permission polling every 30 seconds for traveler role
- Auto-starts for travelers/chaperones during active trip date range

**Background** (GeofenceProvider):
- Native geofencing via `expo-location` + `expo-task-manager`
- iOS 20-region limit handled by priority-based selection using `selectRegionsForMonitoring`
- JS-based polygon checking supplements native circular regions
- Transition debounce: 60-second cooldown per geofence-direction pair
- Geofence refresh from backend every 5 minutes
- Participant status polling every 30 seconds for chaperones/guardians

### 1.6 Onboarding

Steps per role:
- **Traveler** (6): Welcome -> Confirm Info -> Create Password -> Profile Photo -> Legal Consent -> All Set
- **Chaperone** (7): Welcome -> Verify Contact -> Create Password -> Background Check -> Profile Photo -> Legal Consent -> All Set
- **Guardian** (6): Welcome -> Create Password -> Consent & Medical -> Notification Prefs -> Legal Consent -> All Set

Deferrable steps (marked `skippable: true`): Welcome, Background Check, Trip Safety Overview, Notification Prefs.
Required steps (marked `skippable: false`): Confirm Info, Create Password, Verify Contact, Consent Medical, Profile Photo, Legal Consent, All Set.

Progress persistence: Saved to SecureStore via `useOnboardingWizard` reducer. Supports resume after app kill. Fresh-start mode clears stale progress for pre-auth flows.

### 1.7 Offline Support

**Infrastructure** (OfflineProvider):
- SQLite database via `expo-sqlite` for request queue
- Auto-sync when network becomes available (2-second delay for stability)
- Queue summary tracking (pending, failed, synced counts)
- Network quality assessment (excellent, good, poor) via `@react-native-community/netinfo`

**Gaps**:
- Alert acknowledgment bypasses the offline queue
- Alert read-marking bypasses the offline queue
- Location buffer is separate from the main queue (in-memory only, 5 points)
- Geofence violation logging has no offline fallback

### 1.8 Styling Architecture

Three approaches are mixed throughout the codebase:

1. **NativeWind** (className prop): Sparse usage, mainly in Gluestack wrapper components
   - Example: `<VStack className="p-4 pt-8 gap-8">`
2. **Gluestack UI** (themed components): `Text`, `Heading`, `VStack`, `Button` from `@gluestack-ui/themed`
3. **Raw inline styles**: Dominant approach (~80% of styling)
   - Example: `style={{ fontSize: 28, fontWeight: '700', color: colors.text }}`

**Hardcoded hex values** (30+ unique values identified):
- `#16a34a` (green-600), `#ef4444` (red-500), `#0ea5e9` (sky-500), `#4ca46e` (brand green)
- `#ffffff`, `#000000`, `#f59e0b`, `#3b82f6`, `#9333ea`, `#22c55e`
- Duplicated weather utility functions in both TravelerTodayView and ChaperoneTodayView

Theme system: `useThemeColors()` hook provides `colors.text`, `colors.background`, `colors.card`, `colors.border`, `colors.textMuted`, `colors.primary`, `colors.isDark`. Used inconsistently -- some components use it, others hardcode hex.

### 1.9 Role-Specific Views

| Role | Tabs | Special Features |
|------|------|-----------------|
| Traveler | Today, Schedule, Packet, Settings | Rally point navigation, weather, schedule timeline, group location map |
| Chaperone | Today, Schedule, Map, Check-ins, Settings | Live participant map, geofence status, SMS broadcast, muster management |
| Guardian | Today, Schedule, Packet (limited), Settings | Linked traveler status, consent management, notification preferences |

### 1.10 EAS Build Configuration

Current workarounds in `eas.json`:
- `CI: "false"` on all profiles (prevents strict lockfile checks)
- `EXPO_USE_PNPM: "1"` on production profile
- `EAS_SKIP_AUTO_FINGERPRINT: "1"` on production profile
- 5 recent commits dedicated to EAS build fixes (custom install command, pnpm overrides, lockfile management)

The `.easignore` excludes `ios/` and `android/` directories (managed workflow, EAS runs prebuild). Also excludes screenshots, markdown files, and dev artifacts.

### 1.11 SMS Broadcast

The `SmsBroadcastSection` component creates in-app alerts via the Core API -- it does NOT send actual SMS messages despite the component name. The flow:
1. Chaperone selects recipient group (All, Travelers, Chaperones)
2. Composes message (500 char limit)
3. Calls `sendBroadcast()` which creates an alert in the system
4. History stored locally

### 1.12 Weather Integration

Direct fetch to `api.open-meteo.com` with no caching, no error state UI, and duplicated implementation across TravelerTodayView and ChaperoneTodayView. Weather is fetched using the first rally point's coordinates.

---

## 2. Enhancement Proposals

### EP-001: Fix Push Notification Delivery Pipeline

**Problem**: Push tokens are registered with the backend (`POST /users/me/push-token`) but the backend returns `False` for delivery. Users receive no push notifications for alerts, geofence violations, muster calls, or emergency communications. For a child-safety travel app, this is a critical safety gap.

**Solution**:
1. Backend: Implement Expo Push API integration in the Core API. Store push tokens in `user_push_tokens` table. Add `POST /v1/push/send` internal endpoint that calls `https://exp.host/--/api/v2/push/send` with proper headers and chunked batching (max 100 tokens per request per Expo docs).
2. Backend: Add push delivery to all event triggers: alert creation, geofence violation, muster initiation, emergency broadcast, schedule change.
3. Backend: Implement delivery receipt checking via `https://exp.host/--/api/v2/push/getReceipts` and retry logic for `DeviceNotRegistered` (remove token), `MessageTooBig` (truncate), `InvalidCredentials` (alert ops).
4. Client: Add delivery confirmation logging. When a push is received, call `POST /v1/push/received` with the notification ID to track delivery rate.
5. Client: Add fallback -- if push permission is denied, show a persistent banner encouraging the user to enable notifications from Settings.

**Impact**: CRITICAL for safety. Without working push notifications, travelers/chaperones/guardians cannot receive time-sensitive emergency alerts, geofence violations, or muster calls.

**Effort**: Medium (3-5 days). Client infrastructure already exists. Work is primarily backend.

**Dependencies**: Core API access, Expo Push API credentials (derived from EAS project ID `dea5d01e-3465-4ebc-92f6-c7cf1df43dae`).

---

### EP-002: SOS/Panic Button

**Problem**: No mechanism exists for a traveler or chaperone to trigger an immediate emergency alert. The app has rally point navigation and alert viewing but no active distress signal capability. In a child-safety context, this is a fundamental missing feature.

**Solution**:
1. Create `SOSButton` component: large, red, persistent floating action button visible on all trip screens. Requires long-press (1.5s) to activate to prevent accidental triggers. Displays countdown animation during hold.
2. On activation:
   a. Immediately send `POST /trips/:tripId/sos` with current GPS coordinates, timestamp, and device info
   b. Trigger local notification with alarm sound on all other trip participants' devices via push
   c. Start continuous location streaming at 5-second intervals (elevated from normal 10s)
   d. Optionally initiate phone call to trip emergency number
   e. Show "SOS Active" state with cancel option (requires confirmation)
3. Create `SOSActiveOverlay` component that displays on all chaperone/guardian devices when any participant triggers SOS, showing the sender's live location and a "Mark Resolved" action.
4. Queue SOS to offline store if no network -- sync immediately when connectivity returns.
5. Use the existing `emergency` notification channel (already configured with `bypassDnd: true` on Android).

**Impact**: CRITICAL for safety. This is the single most important missing feature for a travel safety app.

**Effort**: High (5-8 days). New component, new API endpoint, push integration (depends on EP-001), elevated location tracking mode.

**Dependencies**: EP-001 (push notifications must work), Core API endpoint for SOS, background location permissions.

---

### EP-003: Replace Alert Polling with Supabase Realtime

**Problem**: Alerts are polled every 60 seconds. A P1 Critical alert could take up to 60 seconds to appear on a user's device. For emergency situations, this latency is unacceptable. The Supabase Realtime infrastructure already exists for location updates but is not used for alerts.

**Solution**:
1. Create `createAlertChannel(tripId, onAlertUpdate)` in `lib/supabase/client.ts`, subscribing to `postgres_changes` on the `alerts` table filtered by `trip_id`.
2. Create `useRealtimeAlerts(tripId)` hook that:
   a. Subscribes to the Realtime channel on mount
   b. On INSERT: prepend to local React Query cache, show in-app toast, trigger local notification if app is backgrounded
   c. On UPDATE: update the specific alert in cache (for read/acknowledge status changes)
   d. On DELETE: remove from cache
3. Keep the 60-second polling as a fallback (in case Realtime disconnects), but increase `staleTime` to 5 minutes since Realtime handles freshness.
4. Add Realtime connection status indicator to the alert page header.

**Impact**: HIGH. Reduces alert delivery latency from 60 seconds to sub-second. Critical for safety alerts.

**Effort**: Low (1-2 days). Supabase Realtime infrastructure already exists. Pattern established with `createLocationChannel`.

**Dependencies**: Supabase Realtime configured for `alerts` table (may need RLS policy update to allow Realtime subscriptions on alerts).

---

### EP-004: Offline-First Alert Acknowledgment

**Problem**: `useAcknowledgeAlert` makes a direct API call. If the user is in a dead zone (common in international travel), acknowledging an alert silently fails. Chaperones cannot track who has acknowledged safety alerts.

**Solution**:
1. Wrap `useAcknowledgeAlert` mutation to use the offline queue:
   - Optimistically update the local React Query cache immediately
   - Queue the `POST /trips/:tripId/alerts/:alertId/acknowledge` request via `queueRequest()`
   - On sync failure, revert the optimistic update and show a retry banner
2. Same treatment for `useMarkAlertRead`.
3. Add a visual indicator on alert cards showing sync status (synced checkmark, pending clock, failed exclamation).
4. Extend the offline queue schema to support idempotency keys to prevent duplicate acknowledgments.

**Impact**: HIGH. Ensures safety-critical alert acknowledgments are never lost.

**Effort**: Low (1-2 days). Offline queue infrastructure exists. Just needs integration.

**Dependencies**: None -- all infrastructure exists.

---

### EP-005: Unified Auth Token Management

**Problem**: While the native app's auth is cleaner than the web app (single SecureStore, no Zustand persist), there is a subtle issue: the Supabase client receives the JWT via `setSupabaseAccessToken()` which calls `client.auth.setSession()` with an empty refresh token. If the Supabase client internally tries to refresh (which it shouldn't since `autoRefreshToken: false`), the empty refresh token causes a silent failure, dropping the Realtime connection. Additionally, the auth token used for REST API calls (via `apiClient`) and the token injected into the Supabase client can drift if a refresh happens but `setSupabaseAccessToken()` fails.

**Solution**:
1. Create a `TokenManager` singleton that is the single source of truth for the current access token:
   ```typescript
   class TokenManager {
     private token: string | null = null;
     private listeners: Set<(token: string | null) => void> = new Set();

     setToken(token: string | null) { ... }
     getToken(): string | null { ... }
     subscribe(listener): unsubscribe { ... }
   }
   ```
2. AuthProvider writes to TokenManager on login, refresh, and logout.
3. apiClient reads from TokenManager instead of a callback.
4. Supabase client subscribes to TokenManager changes and calls `setSupabaseAccessToken` reactively.
5. Add a health check that periodically verifies the Supabase Realtime connection is alive and the token matches.

**Impact**: MEDIUM. Prevents silent Realtime disconnection and ensures token consistency across all consumers.

**Effort**: Medium (2-3 days). Requires refactoring token flow through AuthProvider, apiClient, and Supabase client.

**Dependencies**: None.

---

### EP-006: Streamlined Onboarding (Defer Non-Critical Steps)

**Problem**: Travelers have 6 steps, chaperones have 7 steps before they can access the trip dashboard. While steps like Create Password and Legal Consent are truly blocking, steps like Profile Photo and Welcome can be deferred to reduce time-to-trip-access.

**Solution**:
1. Split onboarding into "critical path" and "complete later" groups:
   - **Critical path** (must complete before dashboard): Create Password, Legal Consent, Confirm Info/Verify Contact
   - **Complete later** (prompted after first dashboard view): Profile Photo, Background Check, Notification Prefs, Trip Safety Overview, Consent Medical (guardian)
2. After critical path, show the trip dashboard with a persistent "Complete your profile" card at the top of the Today view.
3. Track completion percentage and show progress ring on Settings tab badge.
4. Send a local notification 24 hours after first login if profile is incomplete.

**Impact**: MEDIUM. Reduces friction for users who need to access trip information quickly (e.g., at the airport).

**Effort**: Medium (3-4 days). Requires splitting the `STEP_IDS_BY_ROLE` config and adding the deferred step UI.

**Dependencies**: None.

---

### EP-007: Consolidate Styling to Single Approach

**Problem**: Three styling approaches are mixed: NativeWind `className`, Gluestack themed components, and raw inline `style={{}}` objects. This creates inconsistency, makes dark mode unreliable, and increases maintenance burden. 30+ hardcoded hex values bypass the theme system entirely.

**Solution**:
1. Choose a primary approach: **NativeWind + raw StyleSheet** (drop Gluestack themed components for styling).
   - Keep Gluestack UI for complex components (Modal, ActionSheet) where behavior matters
   - Use NativeWind `className` for all layout, spacing, and color
   - Use `StyleSheet.create()` for performance-critical lists
2. Create a design token file (`lib/theme/tokens.ts`) that exports all colors, spacing, and typography as constants:
   ```typescript
   export const colors = {
     brand: { green: '#4ca46e', greenDark: '#16a34a' },
     danger: { DEFAULT: '#ef4444', bg: '#fef2f2', text: '#991b1b' },
     // ...
   };
   ```
3. Add the token file to `tailwind.config.js` under `theme.extend.colors`.
4. Migrate PRIORITY_CONFIG and CATEGORY_CONFIG to use token references.
5. Extract duplicated weather utilities into `lib/weather/` shared module.
6. Add ESLint rule to flag hardcoded hex values in JSX `style` props.

**Impact**: MEDIUM. Improves maintainability, ensures dark mode works everywhere, reduces bundle size from duplicated color values.

**Effort**: High (5-8 days for full migration). Can be done incrementally screen by screen.

**Dependencies**: None.

---

### EP-008: Loading Skeleton Screens

**Problem**: All loading states use `ActivityIndicator` -- a generic spinner with no content hint. This creates perceived slowness and layout shift when data loads.

**Solution**:
1. Create a `Skeleton` component library in `components/ui/`:
   - `SkeletonText` (animated pulse bar, configurable width)
   - `SkeletonCard` (rounded rect with pulse)
   - `SkeletonAvatar` (circle with pulse)
   - `SkeletonMap` (rect with map icon placeholder)
2. Create screen-specific skeleton compositions:
   - `TodayViewSkeleton`: weather placeholder + schedule list skeletons
   - `AlertListSkeleton`: 3 alert card skeletons
   - `MapSkeleton`: grey rect with loading overlay
3. Use `react-native-reanimated` for smooth pulse animation (60fps).
4. Replace all `ActivityIndicator` usage with appropriate skeletons.

**Impact**: LOW-MEDIUM. Improves perceived performance and user experience.

**Effort**: Medium (3-4 days).

**Dependencies**: None.

---

### EP-009: EAS Build Stabilization

**Problem**: 5 consecutive commits were dedicated to fixing EAS builds. Current workarounds include `CI: "false"`, `EXPO_USE_PNPM=1`, `EAS_SKIP_AUTO_FINGERPRINT=1`, and a custom install command. The monorepo workspace dependency (`@safetrekr/core-logic: workspace:*`) is fragile in EAS.

**Solution**:
1. **Lock the dependency resolution**: Replace `workspace:*` with a pre-built tarball approach:
   - Add a `prebuild` script in the root `package.json` that builds `core-logic` into a tarball
   - Reference the tarball in the native app's `package.json`: `"@safetrekr/core-logic": "file:../packages/core-logic/safetrekr-core-logic-1.0.0.tgz"`
   - This eliminates the workspace resolution issue entirely
2. **Or**: Use EAS's `prebuildCommand` in `eas.json` to run the workspace install from the monorepo root:
   ```json
   "production": {
     "extends": "base",
     "prebuildCommand": "cd ../.. && pnpm install --frozen-lockfile && cd safetrekr-traveler-native"
   }
   ```
3. **Remove `CI: "false"`**: Fix the actual lockfile sync instead of bypassing the check. Run `pnpm install --frozen-lockfile` locally to verify.
4. **Remove `EAS_SKIP_AUTO_FINGERPRINT`**: Only needed if fingerprinting fails. Investigate and fix the root cause.
5. **Add build verification CI step**: GitHub Action that runs `eas build --platform all --non-interactive --no-wait` on PRs touching `package.json` or `app.config.js`.

**Impact**: HIGH. Build instability blocks releases and wastes developer time.

**Effort**: Medium (2-3 days). Requires testing across all EAS profiles.

**Dependencies**: Monorepo root access, EAS CLI.

---

### EP-010: Weather Caching and Deduplication

**Problem**: Weather is fetched from Open-Meteo on every component mount with no caching. The fetch logic is duplicated between TravelerTodayView and ChaperoneTodayView (identical ~30 lines of code).

**Solution**:
1. Create `lib/hooks/useWeather.ts`:
   ```typescript
   export function useWeatherQuery(latitude: number | undefined, longitude: number | undefined) {
     return useQuery({
       queryKey: ['weather', latitude, longitude],
       queryFn: () => fetchWeather(latitude!, longitude!),
       enabled: !!latitude && !!longitude,
       staleTime: 30 * 60 * 1000, // 30 minutes
       gcTime: 60 * 60 * 1000, // 1 hour cache
     });
   }
   ```
2. Extract `getWeatherInfo()` and `getWeatherBgColor()` into `lib/weather/utils.ts`.
3. Create a `WeatherBadge` component that both Today views can share.
4. Add error state UI: "Weather unavailable" with retry button.

**Impact**: LOW. Quality-of-life improvement, reduces API calls, eliminates code duplication.

**Effort**: Low (0.5-1 day).

**Dependencies**: None.

---

## 3. Risk Assessment

### RISK-001: No Push Notifications (CRITICAL)

**Severity**: CRITICAL
**Probability**: Certain (confirmed non-functional)
**Description**: The app cannot deliver time-sensitive safety alerts to users. In an emergency scenario (child missing, geofence violation, muster call), the only delivery mechanism is 60-second polling which requires the app to be in the foreground.
**Mitigation**: EP-001 (push fix) + EP-003 (Realtime alerts) + EP-002 (SOS button)
**Business Impact**: Potential liability issue. If a safety incident occurs and it's found that the notification system was non-functional, SafeTrekr could face serious legal consequences.

### RISK-002: No SOS Mechanism (CRITICAL)

**Severity**: CRITICAL
**Probability**: Certain (feature does not exist)
**Description**: A traveler or chaperone in distress has no way to signal an emergency through the app. They must navigate to specific screens and hope someone is monitoring.
**Mitigation**: EP-002 (SOS button)
**Business Impact**: Core value proposition of a travel safety app is compromised.

### RISK-003: Offline Alert Acknowledgment Failure (HIGH)

**Severity**: HIGH
**Probability**: Likely (international travel frequently involves dead zones)
**Description**: When a chaperone issues a critical alert requiring acknowledgment, travelers in areas with poor connectivity cannot acknowledge. The chaperone sees them as non-responsive, potentially triggering unnecessary escalation.
**Mitigation**: EP-004 (offline-first alert ack)

### RISK-004: EAS Build Fragility (HIGH)

**Severity**: HIGH
**Probability**: Likely (5 fix commits indicate recurring issues)
**Description**: The monorepo workspace dependency and pnpm configuration cause intermittent EAS build failures. Each failure blocks the release pipeline and requires manual intervention.
**Mitigation**: EP-009 (EAS stabilization)
**Business Impact**: Delays releases, burns developer time on build debugging.

### RISK-005: Token Drift Between API Client and Supabase (MEDIUM)

**Severity**: MEDIUM
**Probability**: Possible (race condition during token refresh)
**Description**: If `refreshAccessToken()` succeeds but `setSupabaseAccessToken()` fails (e.g., Supabase client is in a bad state), the API client has a fresh token while Supabase Realtime uses a stale one. Realtime subscriptions silently stop receiving updates.
**Mitigation**: EP-005 (unified token management)

### RISK-006: Provider Nesting Depth (MEDIUM)

**Severity**: MEDIUM
**Probability**: Certain (architectural pattern)
**Description**: 10 levels of provider nesting without context selectors means any state change in any provider triggers a full re-render of the entire subtree. This includes every location update (every 5 seconds), every network status change, and every theme change.
**Mitigation**: See Architecture Recommendation AR-003.

### RISK-007: Styling Inconsistency (LOW)

**Severity**: LOW
**Probability**: Certain (visible in codebase)
**Description**: Three styling approaches and 30+ hardcoded hex values mean dark mode is unreliable, theme changes don't propagate uniformly, and new developers must guess which approach to use.
**Mitigation**: EP-007 (consolidate styling)

### RISK-008: Memory Pressure from Polling (LOW)

**Severity**: LOW
**Probability**: Possible (depends on device)
**Description**: Multiple polling intervals running concurrently: alerts (60s), guardian permission (30s), participant status (30s), geofence refresh (5min), location map refresh (30-60s). On low-end devices, this may cause memory pressure.
**Mitigation**: Consolidate polling into a single heartbeat interval. Use Realtime subscriptions to replace most polling.

---

## 4. Architecture Recommendations

### AR-001: Implement a Centralized Event Bus

**Current State**: Each feature (alerts, location, geofences, notifications) manages its own data flow independently. Location updates go to the backend, geofence checks happen locally, alerts are polled, and notifications are received -- but there is no coordination between them.

**Recommendation**: Introduce a lightweight event bus (or use React Query's built-in mutation side-effects) to coordinate cross-feature reactions:

```
Location Update -> EventBus.emit('location:updated', coords)
  -> GeofenceProvider checks boundaries
  -> AlertsProvider checks proximity-based alerts
  -> MapComponent updates marker
```

This eliminates the need for GeofenceProvider to subscribe to LocationProvider via React context (which causes unnecessary re-renders) and allows features to react to events without tight coupling.

### AR-002: Extract Business Logic from Providers

**Current State**: Providers contain both React state management AND business logic (API calls, data transformation, permission checking). LocationProvider alone is 588 lines.

**Recommendation**: Extract business logic into pure service modules:

```
lib/services/
  location-service.ts    # startTracking(), sendUpdate(), checkPermissions()
  geofence-service.ts    # checkBoundaries(), logTransition()
  notification-service.ts # registerToken(), handlePayload()
  auth-service.ts        # login(), refresh(), validateToken()
```

Providers become thin React wrappers that call services and manage state. Benefits:
- Services are testable without React rendering
- Services can be shared between foreground and background contexts (expo-task-manager)
- Reduces provider file sizes from 400-600 lines to under 100

### AR-003: Add Context Selectors to Prevent Cascade Re-renders

**Current State**: Every `useLocation()` call returns the entire `LocationContextValue` object. A heading change (which updates every 5 seconds) triggers re-renders in components that only care about `status` or `permissionStatus`.

**Recommendation**: Use a selector pattern (or split contexts):

Option A -- Split contexts:
```typescript
const LocationDataContext = createContext<LocationData | null>(null);
const LocationControlContext = createContext<LocationControls | null>(null);
```

Option B -- Use `use-context-selector` library:
```typescript
const status = useLocationSelector(ctx => ctx.status);
```

This is especially important for LocationProvider (updates every 5s) and GeofenceProvider (updates on every location change).

### AR-004: Consolidate Supabase Realtime Subscriptions

**Current State**: Only `participant_locations` has a Realtime subscription. Alerts, schedule changes, trip updates, and muster events all rely on polling.

**Recommendation**: Create a `RealtimeManager` that manages all subscriptions for a trip:

```typescript
class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();

  subscribeTripEvents(tripId: string) {
    this.subscribeAlerts(tripId);
    this.subscribeLocations(tripId);
    this.subscribeSchedule(tripId);
    this.subscribeMusters(tripId);
  }

  unsubscribeAll() { ... }
}
```

Initialize in TripProvider when a trip is loaded. Tear down on trip switch or logout. This replaces most polling with sub-second delivery.

### AR-005: Formalize the Demo Mode Architecture

**Current State**: The `apiClient` has a massive `handleDemoGet` method (~150 lines) and `handleDemoPost` method (~170 lines) that use regex matching to intercept API calls and return mock data. This is embedded directly in the production API client.

**Recommendation**: Extract demo mode into a separate layer:

```typescript
// lib/api/demoClient.ts
class DemoApiClient implements IApiClient {
  async get<T>(endpoint: string): Promise<T> { ... }
  async post<T>(endpoint: string, body?: unknown): Promise<T> { ... }
}

// lib/api/index.ts
export const apiClient: IApiClient = isDemoMode()
  ? new DemoApiClient()
  : new ApiClient();
```

Benefits:
- Production API client is clean (no regex matching, no console.logs)
- Demo client can be tree-shaken from production builds
- Demo client is independently testable

---

## 5. Priority Recommendations

### Tier 1: Safety-Critical (Do Immediately)

| # | Enhancement | Effort | Why Now |
|---|-------------|--------|---------|
| 1 | EP-001: Fix Push Notification Pipeline | 3-5 days | Without push, the app cannot deliver safety alerts. This is the foundation all other safety features depend on. |
| 2 | EP-002: SOS/Panic Button | 5-8 days | Core safety feature. A travel safety app without an SOS button is like a fire alarm without a pull station. Depends on EP-001. |
| 3 | EP-003: Realtime Alerts (replace polling) | 1-2 days | Reduces alert delivery from 60s to sub-second. Low effort, high safety impact. |
| 4 | EP-004: Offline Alert Acknowledgment | 1-2 days | Ensures acknowledgments are never lost in dead zones. Low effort, high reliability impact. |

**Total Tier 1 effort**: 10-17 days

### Tier 2: Stability & Reliability (Next Sprint)

| # | Enhancement | Effort | Why Next |
|---|-------------|--------|----------|
| 5 | EP-009: EAS Build Stabilization | 2-3 days | Unblocks reliable release pipeline. Each failed build burns hours. |
| 6 | EP-005: Unified Token Management | 2-3 days | Prevents silent Realtime disconnection which would undermine EP-003. |
| 7 | AR-004: Consolidate Realtime Subscriptions | 2-3 days | Extends EP-003 pattern to schedules, musters, trip updates. |

**Total Tier 2 effort**: 6-9 days

### Tier 3: Quality & UX (Following Sprint)

| # | Enhancement | Effort | Why Then |
|---|-------------|--------|----------|
| 8 | EP-006: Streamlined Onboarding | 3-4 days | Reduces friction but not safety-critical. |
| 9 | EP-007: Consolidate Styling | 5-8 days | Important for maintainability but can be done incrementally. |
| 10 | EP-008: Loading Skeletons | 3-4 days | Polish item that improves perceived performance. |
| 11 | EP-010: Weather Caching | 0.5-1 day | Quick win, do whenever convenient. |

**Total Tier 3 effort**: 11.5-17 days

### Execution Sequence Diagram

```
Week 1-2: EP-001 (Push Fix) -----> EP-003 (Realtime Alerts) ---> EP-004 (Offline Ack)
                                          |
Week 2-3: EP-002 (SOS Button) -----------+
                                          |
Week 3:   EP-009 (EAS Fix) + EP-005 (Token Mgmt)
                                          |
Week 4:   AR-004 (Realtime Consolidation) + EP-006 (Onboarding)
                                          |
Week 5+:  EP-007 (Styling) + EP-008 (Skeletons) + EP-010 (Weather)
```

---

## Appendix A: File Reference

| File | Lines | Role |
|------|-------|------|
| `providers/AuthProvider.tsx` | 621 | JWT lifecycle, trip switching, SecureStore persistence |
| `providers/LocationProvider.tsx` | 588 | Foreground tracking, offline buffer, guardian permission |
| `providers/GeofenceProvider.tsx` | 636 | Native geofencing, JS polygon checks, violation logging |
| `providers/NotificationProvider.tsx` | 357 | Push token registration, channel setup, tap routing |
| `providers/TripProvider.tsx` | 249 | Trip data, role detection, multi-role support |
| `providers/OfflineProvider.tsx` | 261 | SQLite queue, auto-sync, network status |
| `providers/ThemeProvider.tsx` | 130 | Light/dark/system theme, SecureStore persistence |
| `lib/api/apiClient.ts` | 649 | REST client, demo mode interception, token refresh |
| `lib/hooks/useAlerts.ts` | 215 | Alert fetching, acknowledgment, priority config |
| `lib/supabase/client.ts` | 202 | Supabase Realtime for locations only |
| `lib/notifications/channels.ts` | 120 | 8 Android notification channels |
| `lib/onboarding/config.ts` | 146 | Role-specific step sequences |
| `components/onboarding/useOnboardingWizard.ts` | 286 | Wizard state machine with persistence |
| `components/pages/today/TravelerTodayView.tsx` | 467 | Traveler dashboard |
| `components/pages/today/ChaperoneTodayView.tsx` | 567 | Chaperone dashboard |
| `components/broadcast/SmsBroadcastSection.tsx` | 531 | In-app alert broadcast (not actual SMS) |
| `app/_layout.tsx` | 108 | Root provider hierarchy |
| `app/(app)/trip/[tripId]/_layout.tsx` | 166 | Trip-scoped providers + role-aware tabs |

## Appendix B: Hardcoded Color Inventory

Colors found in `style={{}}` props that bypass `useThemeColors()`:

| Hex | Tailwind Equivalent | Occurrences | Used For |
|-----|-------------------|-------------|----------|
| `#16a34a` | green-600 | 12+ | Schedule events, "View Full Schedule" link |
| `#ef4444` | red-500 | 10+ | Rally points, alert indicators, SOS |
| `#4ca46e` | custom brand-green | 8+ | Send button, contact links |
| `#0ea5e9` | sky-500 | 5+ | Loading spinners, primary actions |
| `#3b82f6` | blue-500 | 5+ | P4 alerts, weather |
| `#f59e0b` | amber-500 | 4+ | P3 alerts, stale FX warning |
| `#ffffff` | white | 15+ | Button text, icon fills |
| `#9333ea` | purple-600 | 2 | Thunderstorm weather |
| `#22c55e` | green-500 | 2 | Geofence "all inside" |
| `#f97316` | orange-500 | 1 | P2 alerts |
| `#dc2626` | red-600 | 1 | P1 alerts |

---

*End of Deep Analysis Report*
