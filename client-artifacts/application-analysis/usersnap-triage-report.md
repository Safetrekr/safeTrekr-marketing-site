# UserSnap Bug Triage Report: SafeTrekr

## Import Summary
- **Export file**: UserSnap site export (1770b05a-9c49-46e3-9512-4f2f257cbd01)
- **Total feedbacks in file**: 151
- **Processed (open)**: 116
- **Jira tickets created**: 116
- **Remediation Epic**: ST-359
- **Jira range**: ST-360 through ST-476
- **Date**: 2026-03-18

## Severity Distribution

| Severity | Count | % |
|----------|-------|---|
| Critical | 19 | 16.4% |
| High | 56 | 48.3% |
| Medium | 31 | 26.7% |
| Low | 10 | 8.6% |

## Agent Distribution

| Agent | Tickets | Focus Area |
|-------|---------|------------|
| react-developer | 57 | Web frontend (Next.js 15) |
| world-class-backend-api-engineer | 24 | Data/API, finalize pipeline, OSM |
| react-native-application-developer | 18 | Mobile app (Expo/React Native) |
| software-product-owner | 14 | Feature requests, enhancements |
| world-class-appsec-security-architect | 3 | Cross-tenant security |

## Screenshots
- With screenshots: 98
- Without screenshots: 18
- Screenshots downloaded to: `./usersnap-screenshots/`

## Systemic Root Causes Identified

### 1. Itinerary Events Silent Insert Failure (CRITICAL)
**Tickets**: #9, #16, #103, #113, #132
**Impact**: ALL finalized trips may have empty itineraries
**Root Cause**: `/v1/trips/finalize` wraps itinerary_events insert in `try/except Exception` that silently swallows: start_time NOT NULL violations, location_id FK violations, category CHECK failures
**Fix**: Deploy 2026-02-06 fixes + backfill script + structured error logging

### 2. Dual-Auth-ID / Zustand Hydration Race (CRITICAL)
**Tickets**: #108, #134, #105, #14, #12
**Impact**: Analyst comments, checklists, dashboard queries fail on cold start
**Root Cause**: Service classes call `useAuthStore.getState()` which returns null before Zustand persist hydration completes
**Fix**: Accept analystId as explicit parameter, read reactively, gate with `enabled: !!analystId`

### 3. Transportation Feature Fundamentally Broken (HIGH)
**Tickets**: #10, #17, #26, #93, #98
**Impact**: Transportation section non-functional across all views
**Root Cause**: `useGroundTravel` hook crashes with undefined trip_id during creation; ground_travel table/CRUD may not be fully implemented
**Fix**: Complete transportation CRUD with local-state during creation, persist on finalize

### 4. Cross-Tenant Data Leakage (CRITICAL SECURITY)
**Tickets**: #32, #51
**Impact**: Organizations can see other orgs' teams and travelers (PII of minors)
**Root Cause**: `public.users` table lacks RLS policies; org_id filter is client-side only
**Fix**: Enable RLS, create org-scoped policies, add integration tests

### 5. Overpass API / OSM Query Failures (HIGH)
**Tickets**: #104, #106, #111, #112
**Impact**: Emergency services, medical facilities, POIs not appearing on maps
**Root Cause**: Incorrect OSM tags, insufficient search radius, missing error handling
**Fix**: Fix Overpass tags, increase radius to 15km, add retry logic

### 6. Finalize Pipeline Fragility (CRITICAL)
**Tickets**: #96
**Impact**: Paid trips fail to save — Stripe payment captured but trip data not persisted
**Root Cause**: `none_if_empty()` helper doesn't cover all date fields; no payment reconciliation
**Fix**: Apply none_if_empty to ALL fields, add orphaned payment tracking, idempotent retry

## Already Implemented (Verification Only)
- **#83**: Venue construction/events checklist (PRD-020)
- **#53**: Washington DC location search (PRD-017)
- **#54**: Timezone offset display (TimezoneOffset component)
- **#36**: Chaperone Admin permission model (participant-permissions.ts) — V2 group assignment is new

## Process Requests (Non-Engineering)
- **#28, #29**: Schedule stakeholder review session for safety/guidance sections

## Ticket Index

| UserSnap # | Jira Key | Severity | Summary |
|------------|----------|----------|---------|
| 153 | ST-360 | Critical | Chaperone phone number transposed in traveler app |
| 152 | ST-361 | High | Safety page missing rally point details/checklist |
| 151 | ST-362 | High | Bottom sheet drawers cannot expand or scroll |
| 150 | ST-363 | Medium | Addresses lack geocoding validation and map |
| 149 | ST-364 | High | Participants list shows blank phantom users |
| 148 | ST-365 | Medium | Duplicate transportation events in trip packet |
| 147 | ST-366 | Critical | Alert acknowledge button non-functional |
| 146 | ST-367 | Low | Rally point list needs card layout redesign |
| 145 | ST-368 | High | Keyboard covers broadcast message input |
| 144 | ST-369 | Critical | Emergency number shows 112 instead of 911 |
| 143 | ST-370 | High | Alerts lack push notifications and filtering |
| 142 | ST-371 | Medium | Trip briefings page empty |
| 141 | ST-372 | High | Check-ins page blank, naming unclear |
| 140 | ST-373 | High | Map shows stale locations, not real-time |
| 139 | ST-374 | High | Main page shows wrong-day rally point |
| 138 | ST-375 | Medium | Safety map missing itinerary/POI markers |
| 137 | ST-376 | High | Muster section shows no upcoming events |
| 136 | ST-377 | Critical | Background location tracking not active |
| 135 | ST-378 | High | Transportation page duplicates/wrong data |
| 134 | ST-379 | High | Analyst comments not saving on venues |
| 133 | ST-380 | Critical | Transportation modes not persisting |
| 132 | ST-381 | Critical | Itinerary not populating on overview |
| 131 | ST-382 | Critical | Trip review data lost on navigation |
| 130 | ST-383 | Medium | No option to decline background check |
| 129 | ST-384 | High | Itinerary shows departure instead of arrival |
| 128 | ST-385 | High | Manual flight entry shifts date back |
| 127 | ST-386 | High | Overnight flight date auto-correction wrong |
| 126 | ST-387 | High | Flight lookup returns no results |
| 125 | ST-388 | Critical | Venue/POI search 404 double-slash URL |
| 122 | ST-389 | High | Guidance page shows mock data |
| 121 | ST-390 | Medium | Briefings button navigates to deprecated page |
| 120 | ST-391 | Medium | Back button goes to wrong route |
| 119 | ST-392 | Medium | Participant drawer fields empty |
| 118 | ST-393 | High | Checklist initialize from templates broken |
| 117 | ST-394 | High | Background checks section empty |
| 116 | ST-395 | Low | Documents section may be deprecated |
| 115 | ST-396 | Medium | Safety map ER badge count inaccurate |
| 114 | ST-397 | High | Embassy markers not rendering on safety map |
| 113 | ST-398 | High | Analyst itinerary review empty |
| 112 | ST-399 | High | OSM emergency services not populating venues |
| 111 | ST-400 | High | OSM ERs not populating near lodging |
| 110 | ST-401 | High | Participant roster shows phantom users |
| 109 | ST-402 | High | Background checks not populating |
| 108 | ST-403 | High | Analyst comments not accepting input |
| 107 | ST-404 | Medium | Currency in Euros, emergency number EU |
| 106 | ST-405 | High | POI search returns no results |
| 105 | ST-406 | High | Analyst checklists not populating |
| 104 | ST-407 | High | Medical facility search fails |
| 103 | ST-408 | Critical | Itinerary not populating analyst review |
| 101 | ST-409 | Critical | Phantom participants in trip list |
| 100 | ST-410 | Medium | Guidance should appear above Safety Review |
| 99 | ST-411 | Medium | Show trip days with no events |
| 98 | ST-412 | High | Venue transportation not on Transportation page |
| 97 | ST-413 | High | Org creation fails to send invite email |
| 96 | ST-414 | Critical | Trip fails to save after payment |
| 95 | ST-415 | High | Unauthorized error on 'I'll pay later' |
| 94 | ST-416 | High | No per-chaperone background check toggle |
| 93 | ST-417 | High | Transportation not populating in creation |
| 92 | ST-418 | High | Lodging check-in time not in itinerary |
| 91 | ST-419 | High | Flights incorrect and cannot delete |
| 90 | ST-420 | High | Next-day flights not supported, duplicates |
| 89 | ST-421 | Medium | Nonpotable water contingency checklist |
| 88 | ST-422 | Medium | Potable water accessibility check |
| 87 | ST-423 | High | Remote location medevac planning checklist |
| 86 | ST-424 | Medium | Watercraft safety checklist flotation detail |
| 85 | ST-425 | Medium | Transport company OSINT check checklist |
| 84 | ST-426 | Medium | Distinguish US Embassy marker on maps |
| 83 | ST-427 | Low | Venue construction checklist (VERIFIED) |
| 82 | ST-428 | Medium | Truncated column header in participants |
| 81 | ST-429 | Medium | Unclear if issues forwarded to client |
| 79 | ST-430 | High | Emergency prep not prepopulating |
| 69 | ST-431 | Medium | Police/ambulance response time fields |
| 67 | ST-432 | High | Map marker misplaced on venues |
| 64 | ST-433 | Medium | Intel report on analyst overview |
| 63 | ST-434 | High | Domestic trip missing initial departure |
| 57 | ST-435 | High | No auto-save for partial trip creation |
| 54 | ST-436 | Low | Timezone offset display (VERIFIED) |
| 53 | ST-437 | Low | Washington DC search (VERIFIED) |
| 51 | ST-438 | Critical | Cross-org data leakage on Teams (SECURITY) |
| 50 | ST-439 | High | Trip packet not rendering |
| 47 | ST-440 | Medium | Safety review fields misplaced |
| 42 | ST-441 | High | Staff roles/supervisor contact incomplete |
| 40 | ST-442 | High | Participant readiness not auto-populated |
| 38 | ST-443 | Medium | Safety review section placement UX |
| 36 | ST-444 | High | Chaperone Admin role + group assignment |
| 35 | ST-445 | High | AI-generated destination safety intel |
| 33 | ST-446 | Medium | City autocomplete missing state, dupes |
| 32 | ST-447 | Critical | Cross-org data exposure confirmation (SECURITY) |
| 31 | ST-448 | Medium | Integrate documents into safety/guidance |
| 30 | ST-449 | Medium | Post-completion destination intel snapshot |
| 29 | ST-450 | Low | Schedule safety/guidance review session |
| 28 | ST-451 | Low | Safety review session (dup of #29) |
| 27 | ST-452 | High | Guardian assignment bypass with attestation |
| 26 | ST-453 | High | Transportation section non-functional |
| 25 | ST-454 | Low | Add duplicate trip button |
| 24 | ST-455 | Medium | Trip editing not available from list |
| 23 | ST-456 | High | HQ admin checklists not loading |
| 22 | ST-457 | Low | Trips page issue during demo |
| 21 | ST-458 | Critical | Admin invite email fails after org setup |
| 20 | ST-459 | Medium | Support dual-role participants |
| 19 | ST-460 | Critical | Participant edits do not save |
| 18 | ST-462 | Critical | Guardian assignment reverts |
| 17 | ST-463 | High | Transportation broken on existing trip |
| 16 | ST-464 | Critical | Itinerary not rendering on trip review |
| 15 | ST-465 | Medium | Trip wizard stepper not clickable |
| 14 | ST-466 | High | Dashboard not showing created trips |
| 12 | ST-467 | High | Teams page not showing travelers |
| 11 | ST-468 | Medium | Validation alert links not navigable |
| 10 | ST-469 | High | Transportation not functional in creation |
| 9 | ST-470 | Critical | Itinerary empty, no edit possible |
| 8 | ST-471 | Medium | Phone number field lacks formatting |
| 6 | ST-472 | High | Post-onboarding redirects to /activate |
| 5 | ST-473 | High | Password field hides submit button |
| 3 | ST-474 | Critical | Activation code email not received |
| 2 | ST-475 | High | Onboarding button not visible |
| 1 | ST-476 | Low | Sample feedback (test entry) |

---
*Generated by Tarva Dark Factory /factory-usersnap on 2026-03-18*
