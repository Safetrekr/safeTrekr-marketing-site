---

# SafeTrekr Product Strategy Discovery Analysis

**Date**: 2026-03-23
**Analyst**: Product Strategy / Market TAM / Competitive Positioning
**Base**: Updated from `PRODUCT-STRATEGY-DEEP-ANALYSIS-2026-03-17.md` (6 days prior)
**Codebase Evidence**: 5 services, 250+ API endpoints, 18-section analyst review, 46 protection endpoints, 4 payment methods, 10 user roles
**Method**: Codebase-first analysis cross-referenced with competitive landscape research

---

## 1. Market Positioning Assessment

### Current Position

SafeTrekr occupies a genuine white-space position: **professional trip safety management for non-enterprise organizations** at 1/100th the price of enterprise alternatives. The codebase validates this positioning through three tangible technical artifacts:

- **17-section analyst review workflow** (`/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/analyst/constants/review-sections.ts`): Overview, Participants, Air Travel, Lodging, Venues, Itinerary, Transportation, Safety, Emergency Prep, Documents, Background Checks, Intel Alerts, Issues, Evidence, Checklists, Packet Builder, Comms Log, Approval. No competitor at this price point offers this depth of human review.

- **12-feature Monte Carlo risk scoring** with P5/P50/P95 uncertainty bands, sourced from 5 government data pipelines (NOAA NWS, USGS, CDC, ReliefWeb, GDACS) via TarvaRI. This is enterprise-grade intelligence at SMB pricing.

- **SHA-256 hash-chain evidence binder** that creates a tamper-evident audit trail, producing a legally defensible safety record for boards, insurers, and courts.

### Positioning Vulnerability

The positioning is strong in theory but invisible in practice. The product cannot be experienced without HQ admin intervention. The March 17 analysis correctly identified this as the critical blocker, and **nothing has changed in the 6 days since**. Recent commits show EAS build pipeline fixes (TestFlight version push, pnpm lockfile configurations), which is progress toward mobile deployment but not toward the self-service gap.

### Competitive Landscape Update (New Intelligence)

**Chapperone** (`gochapperone.com`) has emerged as a direct competitor in the K-12 field trip management space. Key findings from research conducted today:

| Dimension | Chapperone | SafeTrekr |
|-----------|-----------|-----------|
| Target | K-12 schools specifically | K-12, churches, sports, higher ed |
| Pricing Model | Per-student, per-trip | Per-trip flat fee ($450-$1,250) |
| App Store Presence | Live (App Store + Google Play) | Not submitted |
| Time to Create Trip | "Under 5 minutes" | 9-step wizard (estimated 20-30 min) |
| Analyst Review | None | 17-section professional review |
| Risk Intelligence | None | Monte Carlo + 5 government sources |
| Evidence Binder | None | Hash-chain tamper-evident audit |
| Offline Support | Yes (claimed) | Yes (mobile app) |
| Self-Service Signup | Yes | No (HQ admin required) |

Chapperone is a lightweight trip logistics tool (permission slips, forms, messaging). It has **zero safety analysis capability**. But it has what SafeTrekr lacks: self-service signup, App Store presence, and per-student pricing framing. The risk is not that Chapperone competes on features -- it is that Chapperone captures the K-12 market's awareness before SafeTrekr can reach them, creating an adoption barrier through installed base.

**Terra Dotta** remains focused on higher education (700+ universities) with their AlertTraveler mobile app. They do not serve K-12.

**Anvil Group** has been acquired by **Everbridge** (NASDAQ: EVBG), confirming the enterprise consolidation trend. This move upmarket creates more white space below for SafeTrekr.

---

## 2. Feature Completeness vs. Competitors

### Feature Depth Inventory (from codebase)

The codebase reveals feature depth that far exceeds what the marketing site communicates.

**Trip Creation Wizard** (57 components in `/modules/client/components/trip-create/`):
- 3 trip types (T1 Day, T2 Domestic Multi-Day, T3 International)
- 7 trip purposes (Educational, Mission, Sports, Cultural Exchange, Religious, Business, Other)
- 4 participant roles with guardian assignment for minors
- CSV import for participants, lodging, venues
- Location autocomplete with OpenStreetMap integration
- Day-by-day itinerary builder with event templates
- Multi-modal transportation builder
- Add-ons: insurance, dietary requirements, accessibility needs
- Real-time sync status indicator
- Flight form with airline lookup

**Analyst Review System** (24 component directories in `/modules/analyst/components/`):
- Dashboard with calibration charts and KPIs
- Queue management with filters
- 18 review sections with individual completion tracking
- Background check integration (Checkr/Sterling)
- Intel alert triage with 4 severity levels, 8 categories, audience targeting, delivery buckets
- Issue tracking with severity and section linkage
- Evidence activity logging
- Packet builder with section previews and role-aware content
- Approval workflow with prerequisites checklist
- Digest system for AM/PM alert delivery

**Protection System** (46 endpoints in Core API `protection.py`):
- Rally points with approval workflow
- Safe houses with type classification
- Muster (roll call) creation and management
- Check-in system with role-based access
- PostGIS geometry for geofencing
- AI-powered suggestions via TarvaRI integration
- Protection event audit trail

**Payment System** (4 methods in `payments.py`):
- Credit card via Stripe PaymentIntent
- ACH bank transfer via Stripe (us_bank_account)
- Check (manual confirmation by HQ)
- Wire transfer (manual confirmation by HQ)
- Webhook handler with idempotency and event deduplication
- Pricing engine with database-driven rules and specificity matching

**HQ Console** (20+ pages across 11 component directories):
- Organization management with create/suspend/reactivate/delete
- Finance module with wallets, ledger, invoices, orders
- User management
- Trip oversight
- Queue management
- Policy management
- Evidence activity monitoring
- Guardian governance with override resolution

### Competitive Feature Matrix

| Feature | SafeTrekr | International SOS | Terra Dotta | Chapperone | DIY (Sheets+WhatsApp) |
|---------|-----------|-------------------|-------------|-----------|----------------------|
| Trip Creation Wizard | **4/5** (57 components) | 3/5 (web portal) | 3/5 (study abroad) | 3/5 (simple) | 0/5 |
| Human Safety Review | **5/5** (17 sections) | 5/5 (24/7 ops) | 1/5 (none) | 0/5 | 0/5 |
| AI Risk Intelligence | **4/5** (Monte Carlo, 5 sources) | 5/5 (proprietary network) | 2/5 (alerts only) | 0/5 | 0/5 |
| Mobile App | **3/5** (built, not deployed) | 4/5 (deployed) | 3/5 (AlertTraveler) | **4/5** (deployed) | 0/5 |
| Background Checks | 2/5 (prototype) | 3/5 (included) | 1/5 (none) | 0/5 | 0/5 |
| Evidence/Audit Trail | **5/5** (hash-chain) | 3/5 (reports) | 2/5 (basic) | 1/5 (none) | 0/5 |
| Self-Service Signup | 0/5 (blocked) | 2/5 (enterprise sales) | 2/5 (university RFP) | **4/5** (live) | 5/5 (free) |
| Compliance Certs | 0/5 (none obtained) | 5/5 (SOC 2, ISO) | 3/5 (FERPA) | 1/5 (privacy policy) | 0/5 |
| Price | **$450-$1,250/trip** | $100K-$500K/yr | $50K-$150K/yr | $X/student/trip | Free |

**Assessment**: SafeTrekr has the deepest feature set for its target market. The gaps are not feature gaps -- they are **go-to-market gaps** (no self-service, no compliance certs, no App Store presence).

---

## 3. Revenue Model Analysis

### Current Pricing Architecture

From `billing.ts` and `pricing.py`:

**Per-Trip Pricing** (hardcoded in `TRIP_BASE_PRICES`):
- T1 (Day Trip): $450
- T2 (Domestic Overnight): $750
- T3 (International): $1,250

**Credit Packages** (from `credit-packages-grid.tsx`):
- Starter: 100 credits / $99 (~10 background checks)
- Professional: 500 credits / $449 (~50 background checks) -- marked "Most Popular"
- Enterprise: 1,000 credits / $799 (~100 background checks)
- Custom: $1.00/credit, minimum 50 credits

**Add-On Revenue** (from `billing.ts`):
- Background checks: $35/check
- Insurance: $25/participant

**Payment Methods** (from `payments.py`):
- Stripe PaymentIntent (card)
- Stripe ACH (bank transfer)
- Check (manual HQ confirmation)
- Wire (manual HQ confirmation)
- Idempotency key support for all methods
- Stripe webhook handler with event deduplication

### Revenue Model Strengths

1. **Database-driven pricing engine** (`pricing_rules` table with `compute_pricing()`) supports segment-specific and volume-based pricing without code changes. This is architecturally sound for future tiered pricing.

2. **Multiple payment methods** reduce friction for institutional buyers. K-12 schools commonly use check or PO-based payment, so the manual payment flow is essential.

3. **Credit system** enables pre-purchase and background check pass-through revenue.

### Revenue Model Gaps

1. **No subscription billing**: The Stripe integration is exclusively per-trip checkout. There is no recurring subscription capability. This blocks the recommended "Professional $249/mo" and "Enterprise $799/mo" tiers.

2. **No reserved/consumed credit tracking**: The finance API hardcodes reserved and consumed credits to 0. This means organizations cannot see how their credits are allocated across active trips.

3. **No self-service checkout**: Payment initiation requires an authenticated user with org_admin, billing_admin, or HQ role. There is no public-facing Stripe Checkout for trial/signup flows.

4. **Pricing framing is dollar-per-trip, not dollar-per-participant**: At $450/trip for 30 students, the per-student cost is $15 -- but the interface presents $450. This creates sticker shock for K-12 budget holders. Chapperone has already adopted per-student framing.

5. **No annual discount automation**: The pricing page mentions 10-30% annual discounts, but the pricing engine has no concept of annual vs. monthly billing cycles.

### Revenue Projection (Revalidated)

The March 17 analysis projected:
- Year 1 (with self-service): $515K ARR from 173 orgs
- Year 3 (base): $4.4M ARR from 1,265 orgs
- Year 3 (optimistic): $11.3M ARR from 2,980 orgs

These projections remain valid. The per-trip unit economics work:
- Average revenue per trip: ~$600 (blended across T1/T2/T3)
- Average trips per org per year: ~5
- Average ACV: ~$3,000
- Analyst cost per trip (pre-AI): $35-$50 (2-3 hours at analyst salary)
- Gross margin per trip: ~92% (pre-analyst COGS) or ~55-65% (post-analyst COGS)

The key sensitivity lever is **self-service adoption velocity**. Each month without self-service is approximately $43K in forgone ARR (173 orgs x $3,000 ACV / 12 months).

---

## 4. User Acquisition Funnel Analysis

### Current Funnel (from codebase)

```
[Marketing Site] -> "Request a Quote" -> [HQ Admin creates org manually]
                                              |
                                              v
                                    [Admin invite email sent]
                                              |
                                              v
                                    [Activate token page]
                                              |
                                              v
                                    [Welcome step] -> [Account step] -> [Legal step] -> [Complete]
                                                        (name, email,     (terms,         (redirect
                                                         password,        privacy,         to client
                                                         phone, tz)       signature)       portal)
                                              |
                                              v
                                    [Client Portal Dashboard]
                                              |
                                              v
                                    [Create Trip (9-step wizard)]
                                              |
                                              v
                                    [Payment Page (card/check/wire/ACH)]
                                              |
                                              v
                                    [Trip in Review Queue]
```

### Funnel Assessment

**Step 1 (Marketing -> Quote Request)**: BROKEN. The only conversion path is "Request a Quote," which requires manual follow-up. Conversion rate on inbound traffic: effectively 0% for self-service users.

**Step 2 (HQ Admin -> Org Creation)**: BOTTLENECK. The `POST /v1/orgs` endpoint requires HQ role. The organization creation flow (in `create-organization-drawer.tsx`) is an internal HQ tool, not a customer-facing flow.

**Step 3 (Invite -> Onboarding)**: FUNCTIONAL. The onboarding store (`onboarding-store.ts`) implements a clean 4-step flow with session persistence, hydration guards, and token validation. This is well-built.

**Step 4 (Dashboard -> Trip Creation)**: STRONG. The 9-step wizard with 57 components is comprehensive. CSV import for bulk participant entry is a strong time-saver. Sync status indicator shows the system handles drafts gracefully. The trip type selector (T1/T2/T3) with feature descriptions is clear.

**Step 5 (Payment)**: FUNCTIONAL. The payment page supports 4 methods and handles the full Stripe PaymentIntent flow. The deprecated `first-trip-payment-modal.tsx` has been replaced with the Stripe Elements integration point. Idempotency keys prevent duplicate charges.

**Step 6 (Review Queue)**: STRONG. Payment success triggers automatic review_queue entry creation. The analyst queue system with filters and assignment is production-ready.

### Funnel Recommendations

The funnel is strong from Step 3 onward. Steps 1-2 are the critical failure point. The March 17 analysis recommended self-service onboarding within 60 days. I revalidate this as the single highest-priority item. The technical components exist:
- Org creation API exists (needs public-facing endpoint)
- Stripe integration exists (needs Checkout session mode)
- Onboarding wizard exists (needs to chain from signup)
- Feature flags exist (can gate Starter tier features)

Estimated effort to close the funnel gap: 4-6 weeks for a single developer.

---

## 5. Retention Mechanisms

### Existing Retention Drivers (from codebase)

1. **Data lock-in (Evidence Binder)**: The hash-chain evidence system creates a tamper-evident audit trail per trip. Once an organization has 5+ trips with full evidence binders, migrating that compliance history to another platform is impractical. Switching cost: HIGH.

2. **Workflow dependency (17-section review)**: Organizations that integrate the analyst review into their trip approval process create institutional muscle memory. The checklist engine with time-based triggers (`evaluate_time_triggers()` in `checklist_service.py`) automatically activates checklists 60 days before trip start dates, creating recurring engagement loops.

3. **Guardian governance**: The guardian consent and override system creates multi-party dependencies. Parents/guardians who are familiar with the SafeTrekr consent flow create resistance to switching.

4. **Trip history and templates**: The trip creation wizard supports templates and day-by-day itinerary reuse. Organizations that build a library of trip templates are more likely to stay.

5. **Background check history**: Check records associated with participants persist across trips. An organization that has 50+ chaperones with completed background checks would lose this verified history by switching.

### Missing Retention Mechanisms

1. **No automated renewal workflow**: There is no subscription billing, so there is no renewal trigger. Each trip is a standalone transaction. This means every trip is a new purchase decision.

2. **No usage-based engagement**: No email digests showing "your org has completed X trips this quarter." No "safety score" that improves with usage. No gamification or progress tracking at the organizational level.

3. **No expansion triggers**: No automated upsell from Starter to Professional tier based on usage thresholds. No "you've used 80% of your credits" notification.

4. **No community/network effects**: No org-to-org benchmarking ("your safety rating compared to similar schools"). No shared best practices or resource library.

### Retention Risk Assessment

The per-trip pricing model creates **transactional churn risk**. An organization that does 5 trips one year might do 0 the next if they have a budget cut. The subscription model recommended in the March 17 analysis (Professional $249/mo) would convert transactional revenue to predictable recurring revenue and create a sunk-cost retention effect.

---

## 6. Growth Opportunities

### Immediate Opportunities (0-6 months)

**A. Self-Service Signup (EP-01)**: Still the single highest-ROI investment. Every month without self-service is ~$43K in forgone ARR. The technical building blocks exist. Ship this.

**B. Risk Dashboard Frontend (EP-02)**: The Monte Carlo risk scoring engine is the most impressive technical capability and it has zero frontend visualization. This is the demo artifact that closes deals. Building this with static sample data first (before TarvaRI is live) would be a pragmatic approach.

**C. App Store Deployment**: Recent commits (EAS build fixes, TestFlight version) suggest this is actively being pursued. The React Native app with role-based experiences for 10 user types, geofencing, rally points, muster check-ins, SMS broadcast, and offline-first architecture is a genuine differentiator -- if it reaches users.

### Medium-Term Opportunities (6-18 months)

**D. Denominational Licensing**: The SBC (47,000+ churches) and UMC (30,000+ churches) represent massive distribution channels accessible through a single partnership. A "Church Mission Safety" certification program where SafeTrekr becomes the recommended platform could unlock thousands of organizations with near-zero CAC.

**E. Insurance Partnership**: The evidence binder with hash-chain integrity has direct actuarial value. An insurance carrier that can verify an organization conducted professional safety review with documented evidence can offer lower premiums. SafeTrekr's 10-15% referral commission on travel insurance policies would be a pure-margin revenue stream.

**F. FERPA/COPPA Certification**: This is both a growth opportunity and a competitive moat. The iKeepSafe certification process takes 6-8 weeks and costs $5K-$10K. Once obtained, it becomes a 12-18 month barrier for competitors. Chapperone does not appear to have FERPA certification -- this is SafeTrekr's opportunity to leapfrog them in K-12 credibility.

### Long-Term Opportunities (18+ months)

**G. AI-Assisted Analyst Review (EP-06)**: Reduces analyst time from 2-3 hours to 45-60 minutes per trip by pre-populating checklists with TarvaRI intelligence. This is the scaling solution that brings COGS per trip from $35-$50 down to $12-$18 and enables the Starter tier (automated report, no human review).

**H. State Education Department Mandates**: If even one state education department recommends SafeTrekr for field trip safety compliance, it creates a mandate-driven adoption wave.

**I. Youth Sports League Partnerships**: AAU, USSSA, and other leagues could mandate safety review for tournament travel. SafeSport compliance integration would be the hook.

---

## 7. Product-Market Fit Signals

### Positive Signals

1. **Technical maturity exceeds market presence**: 292K LOC across 5 services, 138 tables, 250+ endpoints. This level of investment validates that the founders have deep domain conviction.

2. **Feature depth exceeds competitor awareness**: The 17-section analyst review, Monte Carlo risk scoring, hash-chain evidence binder, and 46-endpoint protection system are genuine technical innovations. No competitor at this price point offers this combination.

3. **Multi-portal architecture validates multi-stakeholder need**: The existence of Client Portal, Analyst Portal, HQ Console, and Traveler App confirms that the product addresses a multi-party coordination problem -- a strong indicator of real market need.

4. **Pricing engine sophistication**: The database-driven pricing with specificity matching suggests real engagement with buyer diversity. The 4 payment methods (card, ACH, check, wire) address institutional procurement realities.

5. **Role system granularity**: 10 distinct roles (traveler, chaperone, guardian, org_admin, billing_admin, security_officer, analyst, hq_admin, hq_supervisor, hq_ops) reflect genuine understanding of organizational hierarchy in the target segments.

### Negative Signals

1. **104 orgs, 106 trips, 246 participants in database**: This is commercially dormant. The ratio of 1 trip per org and 2.3 participants per trip suggests test data, not real usage.

2. **No self-service path**: The absence of any self-service signup after years of development suggests the product has been built inside-out (engineering-led) rather than market-in (customer-led).

3. **TarvaRI pipeline dormant**: The primary differentiator (real-time government intelligence) is configured but not running. The "89% of sources dormant" finding from the March 17 analysis appears unchanged.

4. **Marketing site issues unresolved**: Fabricated testimonial ("Dr. Rachel Martinez, Sample University") and unverified compliance claims (SOC 2, HIPAA) remain live. This was identified as an immediate removal item 6 days ago.

### PMF Verdict

SafeTrekr has **strong problem-market fit** (the problem is real, the market is large) and **strong product-capability fit** (the features address the problem deeply). But it has **zero product-market traction** because the go-to-market mechanism does not exist. The product cannot reach the market until self-service onboarding is live.

---

## 8. Feature Prioritization Recommendations

### Updated Impact-Effort Matrix

The prioritization below updates the March 17 analysis with the competitive intelligence findings (particularly Chapperone's emergence) and the recent codebase state (EAS build progress).

| Priority | Feature | Impact on SOM | Effort | Urgency |
|----------|---------|---------------|--------|---------|
| **P0** | Self-Service Org Signup (EP-01) | Blocks 100% of organic revenue | 4-6 weeks | IMMEDIATE -- every day is lost ARR |
| **P0** | Remove Fabricated Marketing Claims (EP-07) | Conversion-killing defect | 1 day | IMMEDIATE -- reputational risk |
| **P0** | Security CRIT-001 to CRIT-004 Remediation | Blocks all compliance certs | 2 weeks | IMMEDIATE -- blocks FERPA |
| **P1** | App Store Submission | Unlocks mobile value proposition | 2-4 weeks (review process) | HIGH -- EAS builds are progressing |
| **P1** | Risk Dashboard Frontend (EP-02) | Primary demo/sales artifact | 3 weeks | HIGH -- demo blocker |
| **P1** | Per-Student Pricing Framing | Reduces K-12 sticker shock | 1 week (frontend + pricing rules) | HIGH -- Chapperone has this |
| **P2** | Evidence Binder Frontend (EP-04) | Selling point visibility | 2-3 weeks | MEDIUM-HIGH |
| **P2** | FERPA/COPPA Certification (EP-03) | Unlocks $39.5M K-12 SAM | 8-12 weeks | MEDIUM -- start process now |
| **P2** | Subscription Billing (Stripe) | Enables tier model, improves retention | 3-4 weeks | MEDIUM |
| **P2** | Church Mission Landing Page | Beachhead conversion | 1 week | MEDIUM |
| **P3** | Guardian Viral Loop (EP-05) | Organic growth mechanism | 3-4 weeks | LOWER -- requires App Store first |
| **P3** | AI-Assisted Analyst Review (EP-06) | COGS reduction, scaling enabler | 8-12 weeks | LOWER -- requires TarvaRI activation |
| **P3** | TarvaRI Pipeline Activation | Differentiator story | 2 weeks (ops work) | MEDIUM -- builds demo story |
| **P3** | Reserved/Consumed Credit Tracking | Financial reporting | 2 weeks | LOWER -- needed before enterprise |

### Critical Path

The critical path to first revenue is:

```
Week 0-1:  Remove fabricated marketing claims. Begin security remediation.
Week 1-4:  Build self-service signup (public endpoint + Stripe Checkout + auto org provisioning)
Week 2-4:  Submit mobile app to App Store (parallel)
Week 3-6:  Build risk dashboard frontend with demo mode (parallel)
Week 4-6:  Ship per-student pricing framing for K-12
Week 5-8:  Church mission landing page + beachhead outreach
Week 6-8:  First self-service signups. Begin FERPA certification process.
Week 8-12: Evidence binder frontend. Subscription billing.
```

**Target**: First paying self-service customer within 60 days. 40 paying organizations within 180 days.

---

## Key Files Referenced

- **Trip type definitions**: `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/types/trip-draft.ts`
- **Credit packages**: `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/client/components/billing/credit-packages-grid.tsx`
- **Pricing engine**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/services/pricing.py`
- **Payment API**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/payments.py`
- **Review sections**: `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/analyst/constants/review-sections.ts`
- **Intel alert types**: `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/analyst/types/intel-alert.ts`
- **Onboarding store**: `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/modules/onboarding/stores/onboarding-store.ts`
- **Protection system**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/api/v1/routes/protection.py`
- **Billing API**: `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/shared/api/supabase/billing.ts`
- **Prior strategy analysis**: `/Users/justintabb/projects/safetrekr/analysis/PRODUCT-STRATEGY-DEEP-ANALYSIS-2026-03-17.md`
- **Billing types**: `/Users/justintabb/projects/safetrekr/safetrekr-app-v2/src/types/billing.ts`
- **Checklist engine**: `/Users/justintabb/projects/safetrekr/safetrekr-core/src/services/checklist_service.py`

---

## Assumption Register (New/Updated Since March 17)

| ID | Assumption | Source | Date | Impact | Validation Plan |
|----|-----------|--------|------|--------|-----------------|
| A-NEW-1 | Chapperone is a direct K-12 competitor with App Store presence | Web research 2026-03-23 | 2026-03-23 | HIGH -- accelerates urgency of K-12 play | Monitor Chapperone pricing page; interview 3 K-12 admins about awareness |
| A-NEW-2 | Anvil acquisition by Everbridge confirms enterprise consolidation | Web research 2026-03-23 | 2026-03-23 | MEDIUM -- validates downmarket white space | Track Everbridge education segment announcements |
| A-NEW-3 | EAS build pipeline is nearing stability (5 consecutive build-fix commits) | Git log 2026-03-23 | 2026-03-23 | HIGH -- mobile deployment is close | Attempt TestFlight build this week |
| A-NEW-4 | Per-student pricing framing is now table stakes for K-12 (Chapperone does it) | Web research 2026-03-23 | 2026-03-23 | MEDIUM -- pricing page redesign needed | A/B test "$450/trip" vs "$15/student" on landing page |
| A-NEW-5 | Security remediation items (CRIT-001 to CRIT-004) remain unresolved | Codebase review 2026-03-23 | 2026-03-23 | CRITICAL -- blocks FERPA, blocks K-12 SAM | Check `stripe_creds.md` for plaintext exposure; audit RLS coverage |

---

## Bottom Line

SafeTrekr has built a technically remarkable product -- deeper than any competitor in the non-enterprise segment -- and it cannot be purchased by anyone. The codebase analysis confirms that the product capability is real, the architecture is sound, and the feature depth is genuine. But every day without self-service signup is revenue left on the table.

The single most important action is shipping self-service org creation. Everything else -- risk dashboard, evidence viewer, FERPA cert, App Store, subscription billing -- is downstream of that one capability. The March 17 analysis said "60 days." It is now day 6. The clock is ticking, and Chapperone is in the App Store.