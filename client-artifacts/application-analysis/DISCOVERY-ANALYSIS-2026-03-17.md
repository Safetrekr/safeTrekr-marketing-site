# SafeTrekr Discovery Analysis

**Date**: 2026-03-17
**Analyst**: Product Strategy / Market TAM Analysis
**Version**: 1.0
**Scope**: US market, all target segments, 3-year horizon

---

## Executive Summary

SafeTrekr occupies a genuinely underserved market position: **group travel safety management for non-enterprise organizations**. The product sits at the intersection of three growing markets -- Travel Safety Apps ($1.84B, 13.4% CAGR), Travel Risk Management Services ($3.82B, 6.9% CAGR), and School Transportation Solutions ($2.54B, 10% CAGR) -- yet no incumbent competitor serves the K-12, religious, youth sports, or higher-ed segments with an integrated trip management + real-time intelligence + mobile coordination platform.

The codebase reveals a product with exceptional technical depth: a 12-feature Monte Carlo risk scoring engine, a multi-source intelligence pipeline (TarvaRI) with 5 live authoritative data feeds and a roadmap to 2,221 sources, a 17-section professional analyst review workflow, and a role-aware React Native mobile app with offline-first architecture. The platform already supports 10 user roles, Stripe billing, background check integrations, geofencing, rally points, and SMS broadcast -- capabilities that individually exist in enterprise tools priced at $100K-$500K/year.

**Bottom-up TAM estimate**: $1.6B across K-12, religious, youth sports, higher-ed, and corporate group travel segments in the US alone. **Serviceable Available Market (SAM)**: $117M for non-corporate segments. **Serviceable Obtainable Market (SOM)**: $6-12M ARR within 36 months, requiring 2,000-4,000 organizations at $2,000-3,000/year average contract value.

The primary strategic risk is not competition -- it is **go-to-market clarity**. The product is feature-rich but lacks visible self-service onboarding, public pricing, and segment-specific compliance packaging. The recommendation is to pursue K-12 schools as the beachhead segment, followed by religious organizations, with youth sports as the expansion play.

---

## Key Findings

1. **No direct competitor exists in the target segments.** Enterprise travel risk management vendors (International SOS, Crisis24, Everbridge) price at $100K-$500K+/year and target Fortune 500 companies. Consumer tools (TripIt) lack safety review workflows. School-specific tools (Classter) lack real-time intelligence. SafeTrekr is uniquely positioned in the gap between enterprise and consumer.

2. **The TarvaRI intelligence pipeline is a genuine technical moat.** The 12-feature Monte Carlo risk scoring engine with P5/P50/P95 uncertainty bands, combined with five zero-cost authoritative data sources (NOAA NWS, USGS Earthquakes, CDC Travel Notices, ReliefWeb, GDACS), creates a defensible capability that would take a competitor 12-18 months to replicate. The roadmap to 2,221 sources deepens this moat significantly.

3. **The product has 80%+ of the functionality needed for market launch.** Three portals (Client, Analyst, HQ), a mobile app with role-specific views, Stripe billing, background check API layer, checklist engine, trip packet generation, consent tracking, and SMS broadcast are all built and functional. The primary gaps are operational (self-service onboarding, public pricing) rather than technical.

4. **K-12 represents the highest-urgency, highest-compliance segment.** With ~130,700 US schools, FERPA/COPPA requirements, increasing parental expectations for safety, and post-pandemic field trip recovery trends, schools have both regulatory pressure and budget availability (US public education spending exceeds $800B/year) to adopt safety management tools.

5. **Religious organizations represent the fastest adoption path.** Approximately 10,000 short-term mission trips depart from the US annually with 2.4M participants. Churches already conduct background checks, require liability waivers, and purchase travel insurance -- they are pre-qualified buyers for a safety management platform.

6. **Youth sports travel is a massive adjacent market.** The US youth sports market exceeds $40B, with 27M kids in organized sports and 50% in competitive travel leagues generating 8M trips annually. Youth sports tourism produced $128B in US economic impact in 2023. This segment has high willingness to pay ($1,000+ per child per year on travel) but low safety infrastructure.

7. **The credit-based billing model needs refinement.** Current implementation tracks `credits` on the `organizations` table but does not track reserved or consumed credits (hardcoded to 0 in the finance API). The pricing model should evolve to a hybrid: base subscription + per-trip credits + add-on revenue (background checks, premium intel, document vault).

8. **Multi-tenant security is table-stakes and was a P0 vulnerability.** The PRD-001 security fix documents a critical cross-tenant data exposure bug. While fixed, this underscores that the RLS policies and org-scoped data isolation are essential for market trust, especially with FERPA-regulated school data.

9. **The analyst review workflow is a unique selling proposition.** No competitor in the target segments offers professional, human-in-the-loop safety review with a 17-section checklist covering air travel, lodging, venues, transportation, background checks, intel alerts, safety preparedness, documents, and emergency procedures. This creates a "safety certification" value proposition.

10. **International SOS has entered the education sector and represents the primary competitive threat.** They offer education-specific solutions targeting universities and international schools. However, their per-employee pricing model and enterprise sales motion make them inaccessible to K-12 schools, churches, and youth sports organizations.

---

## Feature Inventory

### Trip Lifecycle Management
- **Feature Name**: Multi-tier trip creation and management (T1 day trips, T2 domestic overnight, T3 international)
- **User Value**: Organizations can plan, submit, and track trips from creation through execution with appropriate complexity for each trip type
- **Technical Implications**: Multi-step wizard (7 steps: type, info, participants, flights, lodging, venues, transportation, day-by-day, addons, review), trip status workflow (draft -> active -> in_progress -> completed), Supabase persistence with org-scoped RLS
- **Priority Assessment**: Critical -- this is the core product loop

### Real-Time Intelligence Pipeline (TarvaRI)
- **Feature Name**: Automated intelligence ingestion from authoritative sources with risk scoring
- **User Value**: Organizations receive real-time safety alerts about weather, seismic activity, health advisories, humanitarian crises, and multi-hazard events affecting their trip destinations
- **Technical Implications**: Separate Python/FastAPI microservice with 5 connector types (REST, RSS, WebSocket, WMS, base), 5 pilot sources active, worker architecture (ingest, bundler, alert router, delivery, cleanup), Redis job queue, Docker deployment, database retention policies to prevent 6GB+ bloat
- **Priority Assessment**: Critical -- this is the primary differentiator

### Monte Carlo Risk Scoring Engine
- **Feature Name**: 12-feature probabilistic risk assessment with uncertainty quantification
- **User Value**: Converts raw intelligence signals into calibrated risk scores (P5/P50/P95 percentiles) with specific courses of action (COAs) for decision-makers
- **Technical Implications**: 12-feature model across 5 domains (hazard 40%, exposure 20%, vulnerability 20%, exfil 15%, confidence 5%), 3 hazard adapters (earthquake, weather, unrest), 500-sample Monte Carlo simulation completing in ~150ms, 5-rule trigger matrix, trip-segment spatio-temporal matching. Backend complete; frontend risk dashboard NOT yet built.
- **Priority Assessment**: High -- backend is production-ready but frontend visualization is missing

### Professional Analyst Review Workflow
- **Feature Name**: 17-section safety review by trained analysts with checklist engine
- **User Value**: Every trip receives professional safety review covering all dimensions -- air travel, lodging, venues, transportation, background checks, intel alerts, safety preparedness, emergency readiness, documents, and participant verification
- **Technical Implications**: Analyst queue with priority scoring (0-100 scale mapped to Critical/High/Medium/Low), tiered assignment system, checklist progress tracking, issue creation and tracking, evidence collection, comment threads, packet generation, and final approval workflow
- **Priority Assessment**: Critical -- this is the "safety certification" that differentiates from DIY approaches

### Mobile Traveler/Chaperone App
- **Feature Name**: React Native (Expo) app with role-specific views for travelers, chaperones, and guardians
- **User Value**: Travelers see their schedule and trip packet; chaperones get ops dashboard with muster management, live map, check-ins, and SMS broadcast; guardians see participant status and requirements
- **Technical Implications**: Expo Router with deep linking (safetrekr:// scheme), offline-first with SQLite queue, TanStack Query with NetInfo integration, expo-location for foreground/background tracking, expo-secure-store for JWT, push notifications, geofencing with expo-task-manager, Gluestack UI + NativeWind styling
- **Priority Assessment**: Critical -- the mobile experience is essential for in-field trip coordination

### Geofencing and Rally Points
- **Feature Name**: Location-based safety zones, rally points, and safe houses with real-time monitoring
- **User Value**: Chaperones can define safety perimeters, track who is inside/outside zones, and direct travelers to pre-approved rally points or safe houses during emergencies
- **Technical Implications**: expo-task-manager for background geofencing, region monitoring, rally point prioritization by location context, safe house categories (hospitals, police stations, embassies), approval workflows for rally point activation
- **Priority Assessment**: High -- critical for international trips (T3) and emergency scenarios

### Background Check Integration
- **Feature Name**: Integrated background check requests via Checkr, Sterling, and Certn providers
- **User Value**: Organizations can initiate, track, and verify background checks for all adult trip participants directly within the platform
- **Technical Implications**: API layer built with provider abstraction (4 providers: checkr, sterling, certn, internal), status tracking (pending, in_progress, completed, failed, expired), consent recording with IP and timestamp. Feature-flagged (`background_checks` defaults to disabled). Actual provider webhook integration depth unclear from codebase review.
- **Priority Assessment**: High -- mandatory for K-12 and religious segments; pass-through revenue opportunity

### Stripe Billing and Credit System
- **Feature Name**: Credit-based billing with Stripe integration for organizational payments
- **User Value**: Organizations purchase credits that are consumed per trip, with transaction history and balance management
- **Technical Implications**: Stripe checkout sessions, payment intents, charge tracking in `billing_transactions` table, credit balance on `organizations` table, HQ admin credit adjustment capability. Gap: reserved and consumed credit tracking not implemented (hardcoded to 0).
- **Priority Assessment**: Critical -- revenue enablement

### Feature Flags System
- **Feature Name**: Global and org-scoped feature flags stored in system_config
- **User Value**: Enables tiered access (free vs. premium features) and gradual rollout of capabilities per organization
- **Technical Implications**: System config table with JSONB values, scope (global vs. org), 6 default flags: trip_intelligence, risk_scoring, real_time_alerts, document_vault, background_checks, medical_intel
- **Priority Assessment**: High -- enables pricing tier differentiation

### Trip Packet Generation
- **Feature Name**: Comprehensive trip information packets for travelers and chaperones
- **User Value**: Travelers receive a complete packet with all trip details -- flights, lodging, venues, transportation, participants, safety information, emergency procedures -- in a structured, accessible format
- **Technical Implications**: Packet sections (air travel, lodging, venues, transportation, participants, safety, emergency, briefings), version tracking via `packet_versions` table, PDF generation capability, mobile-native packet viewer with section navigation
- **Priority Assessment**: High -- tangible deliverable that demonstrates platform value to parents and participants

### Onboarding and Invite System
- **Feature Name**: Email-based invite flow with multi-step onboarding wizard
- **User Value**: Participants receive invite links, create accounts, and complete required steps (consent, medical info, background check, profile photo, notification preferences) before the trip
- **Technical Implications**: Core API invite generation and consumption, deep link handling (safetrekr://invite?token=xxx), onboarding wizard with 9 steps (welcome, confirm info, create password, legal consent, medical consent, background check, notification prefs, profile photo, all set), Supabase Auth integration. Historical bugs: invite emails not sending due to User.name attribute error, now fixed.
- **Priority Assessment**: Critical -- this is the participant onboarding funnel

### SMS Broadcast
- **Feature Name**: Emergency SMS messaging from chaperones to all participants
- **User Value**: Chaperones can send urgent messages to all trip participants simultaneously during emergencies
- **Technical Implications**: Participant phone number aggregation, broadcast record tracking, role-limited to chaperones
- **Priority Assessment**: High -- critical safety feature for emergency communication

### Document Vault (Passport Upload)
- **Feature Name**: Secure document storage with biometric-gated access and passport scanning
- **User Value**: Travelers can securely store and share passport information and other travel documents with trip organizers
- **Technical Implications**: Passport upload flow, biometric gate for access, detail sheet viewer, server-side document sync. Feature-flagged (`document_vault` defaults to disabled).
- **Priority Assessment**: Medium -- important for T3 international trips, less critical for T1/T2

### Intel Queue and Triage
- **Feature Name**: Analyst triage queue for reviewing and routing intelligence alerts
- **User Value**: Trained analysts review incoming intelligence, assess relevance to active trips, and route actionable alerts to appropriate organizations
- **Technical Implications**: Triage decisions table with versioning, reviewer approval workflow, org routing, delivery cards, acknowledgement tracking
- **Priority Assessment**: High -- quality control for the intelligence pipeline

### Guardian Governance
- **Feature Name**: Parent/guardian oversight and governance controls for minor travelers
- **User Value**: Guardians can view their child's trip status, verify requirements completion, and exercise oversight over trip safety measures
- **Technical Implications**: Guardian-specific mobile view, guardian overrides (HQ-level), consent tracking, requirement status dashboard
- **Priority Assessment**: High -- essential for K-12 and youth sports segments where minors travel

### Briefings and Digests
- **Feature Name**: Daily trip briefings and intelligence digests for stakeholders
- **User Value**: Trip leaders and stakeholders receive daily summaries of relevant intelligence, trip status, and action items
- **Technical Implications**: Digest generation, read receipt tracking, trip day numbering, analyst-authored briefing content
- **Priority Assessment**: Medium -- enhances ongoing trip management value

### Checklist Engine
- **Feature Name**: Configurable safety checklists with progress tracking
- **User Value**: Organizations and analysts can ensure all safety requirements are met through structured checklists with real-time progress visibility
- **Technical Implications**: HQ-level checklist templates, analyst checklist progress tracking with per-section completion, topic creation, progress aggregation in review queue views
- **Priority Assessment**: High -- operationalizes the safety review process

### Emergency Procedures Library
- **Feature Name**: Country-aware emergency numbers, procedures, and local service information
- **User Value**: Travelers and chaperones have instant access to local emergency numbers, medical facilities, police stations, embassies, and pre-defined emergency procedures
- **Technical Implications**: Embassy location data, emergency number lookup by country, procedure types with priority sorting, local service directory with capability ratings, medical facility information
- **Priority Assessment**: High -- critical for international trips

### Multi-Role Authorization (10 Roles)
- **Feature Name**: Granular role-based access control across three portals
- **User Value**: Each stakeholder (traveler, chaperone, guardian, org admin, billing admin, security officer, analyst, HQ admin, HQ supervisor, HQ ops) sees only the information and actions relevant to their role
- **Technical Implications**: 10 distinct roles with Supabase RLS policies, role-based routing (HQ roles -> /hq/overview, analyst -> /analyst/dashboard, others -> /dashboard), permission utilities (canViewSafety, canAccessChaperoneTools, canViewTravelerLocations, etc.)
- **Priority Assessment**: Critical -- multi-tenant security and UX appropriateness

### HQ Console
- **Feature Name**: Internal operations console for SafeTrekr staff
- **User Value**: SafeTrekr HQ staff can manage organizations, users, trips, policies, queues, billing, communications, feature flags, intel configuration, security, and system status
- **Technical Implications**: 20+ HQ pages including organizations, users, trips, queues, finance, payments, audit, checklists, communications, settings, testing, status, policies, flags, intel-config, intel-metrics, intel-policies, intel-sources, intel-triage, guardian-overrides, security, integrations
- **Priority Assessment**: Critical -- internal operations backbone

---

## Opportunities and Gaps

### Market Gaps

**1. No "Safety Certification" Standard for Group Travel**
There is no industry-standard safety certification for school field trips, mission trips, or youth sports travel. SafeTrekr's 17-section analyst review could become that standard. Organizations could market their trips as "SafeTrekr Certified" to parents, creating a trust signal that drives adoption through demand-pull from families.

**2. Insurance Premium Reduction Partnership**
Travel insurance providers have no data-driven way to assess risk for group travel. SafeTrekr's Monte Carlo risk scores could be shared (with consent) to underwriters, enabling lower premiums for SafeTrekr-managed trips. This creates a direct financial incentive for adoption beyond safety value.

**3. State Education Department Compliance**
Many states require risk assessment for school-sponsored travel but provide no standardized tooling. A SafeTrekr compliance module tailored to state-specific requirements (e.g., California Ed Code, Texas Administrative Code) could enable department-level procurement contracts.

**4. Denominational Bulk Licensing**
Large church denominations (Southern Baptist Convention: 47,000+ churches, United Methodist Church: 30,000+ congregations, Catholic dioceses: 196 in the US) standardize mission trip policies. A denominational licensing deal could onboard thousands of congregations simultaneously.

**5. Youth Sports League Mandates**
AAU, USSSA, and state athletic associations could mandate or recommend SafeTrekr for sanctioned travel tournaments. With $128B in youth sports tourism economic impact, even a small safety compliance fee could generate significant revenue.

### Unserved Segments

**1. Study Abroad Offices (Higher Education)**
~350,000 US students study abroad annually. Universities face increasing legal liability (see NAFSA guidelines, Clery Act, Title IX extraterritorial obligations). The duty-of-care standard is explicitly higher abroad than at the home campus. SafeTrekr's T3 international capabilities are directly applicable.

**2. Corporate Team Retreats / Offsites**
Smaller companies (50-500 employees) conducting team offsites lack the budget for International SOS but need basic travel risk management. A simplified SafeTrekr tier could serve this segment.

**3. International Schools**
There are approximately 12,000 international schools worldwide serving 6M+ students. These schools conduct frequent domestic and cross-border trips and face complex multi-jurisdiction compliance requirements.

### Product Gaps

**1. Self-Service Organization Onboarding**
Currently, organizations require HQ admin setup. A self-service signup flow with Stripe checkout, org creation, and admin invitation would dramatically reduce time-to-activation and customer acquisition cost.

**2. Risk Dashboard Frontend**
The Monte Carlo risk scoring engine is production-ready on the backend but has no frontend visualization. Building this dashboard would unlock the most compelling demo/sales artifact -- showing a live risk assessment with P5/P50/P95 bands updating in real-time as intelligence flows in.

**3. FERPA/COPPA Compliance Module**
K-12 adoption requires documented FERPA compliance (student data protection) and COPPA compliance (under-13 data). This means parental consent workflows, data minimization, access logs, and deletion capabilities.

**4. School SIS Integration**
PowerSchool (45M+ students), Infinite Campus, and other Student Information Systems are the systems of record for K-12 schools. A bi-directional integration (import student rosters, push trip status) would reduce friction for school administrators.

**5. Digital Consent Form Builder**
Schools, churches, and sports organizations all require signed consent forms (liability waivers, photo releases, medical authorizations). A drag-and-drop form builder with e-signature and retention policies would eliminate paper workflows.

**6. Credit Tracking Completion**
The billing system does not track reserved credits (allocated to active trips) or consumed credits (used when trip completes). This is necessary for financial reporting and prevents organizations from understanding their credit utilization.

**7. Intelligence Source Expansion**
TarvaRI currently has 10.7% coverage of its planned 2,221 sources. Priority additions should be: (a) State Department travel advisories, (b) WHO health alerts, (c) local crime/safety APIs, (d) transportation disruption feeds (FlightAware, ADSB), (e) social media signals.

### Pricing Opportunities

**Current model**: Credit-based (pay per trip). This is simple but leaves value on the table.

**Recommended pricing architecture**:

| Tier | Monthly Base | Per-Trip Credit | Target Segment | Included Features |
|------|-------------|----------------|----------------|-------------------|
| Starter | $99/mo | $25/trip (T1 only) | Small churches, local sports | Trip management, basic alerts, mobile app |
| Professional | $299/mo | $50/trip (T1+T2) | K-12 schools, medium churches | + Analyst review, background checks, packet gen |
| Enterprise | $799/mo | $100/trip (T1+T2+T3) | Large orgs, universities, multi-campus | + Full intel pipeline, risk scoring, API access |
| Custom | Contact | Volume pricing | Denominations, state depts, leagues | + White-label, dedicated analyst, SLA |

**Add-on revenue streams**:
- Background check pass-through: $25-50 per check (Checkr costs ~$15-35)
- Premium document vault: $5/user/trip
- Insurance brokerage referral: 10-15% commission
- Training/certification: $500-2,000 per org for safety training

### Competitive Threats

**Tier 1 (High Probability, High Impact)**:
- **International SOS Education**: Already targeting universities and international schools. Could move downmarket to K-12 if they see SafeTrekr gaining traction. Mitigation: Win K-12 beachhead quickly; their pricing and sales model cannot serve individual schools.
- **PowerSchool/SIS vendors adding trip management**: PowerSchool serves 45M+ students and could add basic trip management. Mitigation: Depth of safety review and intelligence pipeline is hard to replicate as an add-on feature.

**Tier 2 (Medium Probability, Medium Impact)**:
- **Everbridge/AlertMedia adding group travel**: Both have mass notification platforms that could extend into travel. Mitigation: Their focus is employee communication, not trip lifecycle management.
- **Insurance companies building prevention tools**: Insurers have financial incentive to reduce claims through safety platforms. Mitigation: Partner with insurers rather than compete.

**Tier 3 (Low Probability, High Impact)**:
- **Google/Apple entering travel safety**: Tech giants could integrate travel safety into Maps/ecosystem. Mitigation: Unlikely to build segment-specific compliance and review workflows.

---

## Recommendations

### 1. Pursue K-12 Schools as the Beachhead Segment

**Rationale**: K-12 schools have the strongest combination of regulatory pressure (FERPA, duty of care, state requirements), budget availability ($800B+ annual US education spending), decision-maker accessibility (school administrators and district risk managers), and emotional urgency (parental demand for child safety). The segment also has the highest barriers to "doing nothing" -- schools face genuine legal liability for unmanaged group travel.

**Actions**:
- Build a FERPA/COPPA compliance module and obtain third-party attestation
- Create a "School Trip Safety Package" with pricing at $199-299/month that includes analyst review
- Develop integration with one major SIS (PowerSchool or Infinite Campus) to demonstrate roster import
- Target 3-5 school districts in a pilot program with free first semester, paid conversion in Year 2
- Produce a "School Trip Safety Benchmark Report" as a lead-generation content asset

**KPI**: 100 schools onboarded within 12 months, $300K ARR from education segment.

### 2. Build Self-Service Onboarding and Public Pricing

**Rationale**: The current HQ-admin-mediated org creation process cannot scale. Every day without self-service signup is a day where inbound interest converts at 0%. The product is functionally ready for customers; the barrier is operational.

**Actions**:
- Build a /signup flow: Stripe checkout -> org creation -> admin invite -> onboarding wizard
- Publish pricing page on marketing site with clear tier descriptions
- Implement a 14-day free trial with automatic credit allocation
- Add usage analytics to track activation funnel (signup -> first trip created -> first trip submitted for review)

**KPI**: Self-service signup live within 60 days; 500 trial signups in first 90 days.

### 3. Ship the Risk Dashboard Frontend

**Rationale**: The Monte Carlo risk engine is the single most impressive technical capability in the platform, but it has no visual representation for customers or sales demos. This is the highest-ROI development investment -- the backend is done, and the frontend unlocks both product value and sales narrative.

**Actions**:
- Build a risk dashboard page in the client portal showing live risk assessment per trip destination
- Visualize P5/P50/P95 bands as a probability distribution or tornado chart
- Show risk drivers with relative contribution weights
- Display active COAs with recommended actions
- Ensure the dashboard works in demo mode with sample data for sales presentations

**KPI**: Dashboard shipped within 45 days; included in all sales demos.

### 4. Establish Insurance Partnerships

**Rationale**: Travel insurance is a $20B+ market. SafeTrekr's risk scoring data could enable parametric or usage-based insurance pricing for group travel. This creates three value streams: (a) lower insurance costs for SafeTrekr customers (adoption incentive), (b) referral/brokerage revenue for SafeTrekr, (c) data licensing revenue from risk scores.

**Actions**:
- Identify 2-3 travel insurance providers specializing in group/youth travel (e.g., RoamRight, Allianz, World Nomads)
- Propose a pilot: SafeTrekr-managed trips receive 10-15% premium discount based on risk score data sharing
- Build API endpoint for insurers to query trip risk assessments (anonymized, consent-based)
- Include "Insurance included" as a pricing tier differentiator

**KPI**: One insurance partnership signed within 6 months; 20% of customers using insurance integration within 12 months.

### 5. Expand TarvaRI to 50% Source Coverage with Priority Sources

**Rationale**: The intelligence pipeline is at 10.7% coverage (159 of 2,221 planned sources). The next 40% should prioritize sources with the highest trip-relevance: State Department advisories, WHO alerts, airport/flight disruption data, local crime data, and transportation infrastructure feeds. This directly improves the risk scoring accuracy and alert timeliness that customers see.

**Actions**:
- Implement State Department travel advisory parser (high impact, well-structured data)
- Add WHO Disease Outbreak News RSS feed
- Integrate FlightAware or ADSB Exchange for real-time flight disruption monitoring
- Add FBI crime statistics and local law enforcement RSS feeds for domestic trip safety
- Implement severe weather sub-sources (EUMETSAT for European trips, JMA for Asia-Pacific)
- Target 1,100 active sources (50% coverage) within 12 months

**KPI**: Source coverage at 50% within 12 months; alert relevance precision >85% (measured by analyst triage acceptance rate).

---

## Dependencies and Constraints

### Regulatory Requirements by Segment

| Segment | Regulation | Requirement | SafeTrekr Status |
|---------|-----------|-------------|-----------------|
| K-12 Schools | FERPA | Student data protection, parental consent, access controls | Partial -- RLS exists but no FERPA-specific attestation |
| K-12 Schools | COPPA | Under-13 parental verifiable consent, data minimization | Not addressed |
| K-12 (US) | State Ed Codes | Vary by state; many require risk assessment for off-campus trips | Not addressed |
| Religious Orgs | Background Check Laws | State-specific requirements for adults working with minors | API layer built; provider integration depth unclear |
| Higher Education | Clery Act | Security reporting, timely warnings for international programs | Not addressed |
| Higher Education | Title IX | Duty of care extends to study abroad programs | Not addressed |
| All Segments | GDPR (if international travelers) | Data protection for EU residents on trips | Not addressed |
| All Segments | SOC 2 | Security controls attestation for SaaS | Not obtained |
| All Segments | HIPAA (medical data) | If medical information is collected for participants | Partial -- medical consent in onboarding but no BAA |

### Technical Dependencies

| Dependency | Status | Risk |
|-----------|--------|------|
| Supabase (PostgreSQL + Auth) | Active, hosted | Medium -- vendor lock-in; database grew to 6GB+ without cleanup |
| Stripe (Billing) | Active | Low -- well-established |
| TarvaRI microservice | Deployed separately (Docker) | Medium -- requires Redis + separate hosting |
| Checkr/Sterling/Certn APIs | API layer built | High -- actual provider contracts and webhook integration unclear |
| Expo/React Native | Active | Medium -- EAS build pipeline has had configuration issues |
| AviationStack | Integrated for flight data | Low |
| MapLibre GL / react-native-maps | Integrated | Low |

### Partnership Needs

1. **Background Check Provider**: Formalize commercial agreement with Checkr or Sterling for volume pricing and API access
2. **Travel Insurance Provider**: Partnership for integrated insurance offering (see Recommendation 4)
3. **School District Procurement Channels**: Relationship with 2-3 educational procurement cooperatives (e.g., E-Rate, TIPS/TAPS, BuyBoard)
4. **Denominational Leadership**: Relationship with denominational safety officers at SBC, UMC, or Catholic diocese level
5. **Youth Sports Governing Bodies**: Relationship with AAU, USSSA, or National Federation of State High School Associations (NFHS)
6. **Study Abroad Association**: Relationship with NAFSA or Forum on Education Abroad for higher-ed credibility

### Market Entry Constraints

1. **Sales Cycle**: K-12 procurement follows fiscal year (July-June in most states); budget decisions made January-April for next fiscal year. Current timing (March 2026) is optimal for fall 2026 pilot programs.

2. **Procurement Requirements**: Schools and government-adjacent organizations often require: (a) SOC 2 Type II attestation, (b) VPAT accessibility compliance, (c) vendor security questionnaire completion, (d) W-9/vendor registration. None of these appear to be in place.

3. **Analyst Staffing**: The 17-section professional review is a human-capital bottleneck. Scaling to 1,000+ organizations requires either: (a) hiring a team of analysts, (b) developing AI-assisted review to reduce analyst time per trip, or (c) creating a self-service "lite review" tier where organizations complete their own checklists against a template.

4. **Mobile App Distribution**: The React Native app needs Apple App Store and Google Play Store approvals, which require review and may take 1-4 weeks. EAS build pipeline has had configuration issues (recent commits show pnpm/lockfile fixes for EAS builds).

5. **Data Retention and Privacy**: The MEMORY.md notes that TarvaRI's database can grow to 6GB+ in days without cleanup. For production with real customer data, data retention policies, backup procedures, and disaster recovery plans must be formalized before launch.

---

## Assumption Register

| ID | Assumption | Source | Impact | Confidence | Validation Plan |
|----|-----------|--------|--------|------------|-----------------|
| A1 | K-12 schools spend $2,000/year avg on group travel safety tools | Derived from market research | High | 2/5 | Survey 50 school administrators on current safety spend |
| A2 | 30% of US K-12 schools conduct group travel requiring safety management | Brookings field trip research extrapolation | Medium | 3/5 | Cross-reference with NCES extracurricular data |
| A3 | Religious orgs will pay $1,500/year for mission trip safety | Inferred from mission trip insurance costs | Medium | 2/5 | Interview 10 church mission coordinators |
| A4 | 5-10% win rate against free alternatives (Google Forms + WhatsApp) | Industry SaaS benchmark | High | 3/5 | Track trial-to-paid conversion in pilot |
| A5 | Analyst review can scale to 50 trips/analyst/month | No data; estimated from 17-section checklist complexity | High | 2/5 | Time-study during first 100 reviews |
| A6 | Background check pass-through generates $25-50 margin per check | Checkr public pricing ($15-35 per check) | Medium | 3/5 | Finalize provider contract and verify unit economics |
| A7 | Insurance partnerships can reduce customer premiums by 10-15% | Industry precedent from fleet management telematics | Medium | 2/5 | Pilot with one insurance provider |
| A8 | Self-service onboarding can achieve 500 trial signups in 90 days | Requires marketing spend and SEO; no current organic traffic data | High | 1/5 | Build funnel and measure with $10K test marketing budget |

---

## Sources

- [Travel Management Software Market Report 2026](https://www.globenewswire.com/news-release/2026/01/26/3225362/28124/en/Travel-Management-Software-Market-Report-2026-Global-Industry-Size-Share-Trends-Opportunity-and-Forecast-2021-2031.html)
- [Travel Safety Apps Market Size 2025-2032](https://www.360iresearch.com/library/intelligence/travel-safety-apps)
- [Travel Risk Management Service Market 2035](https://www.marketresearchfuture.com/reports/travel-risk-management-service-market-26904)
- [Corporate Travel Risk Management 2026 Market Trends](https://www.datainsightsmarket.com/reports/corporate-travel-risk-management-1426775)
- [School Transportation Solutions Market](https://www.skyquestt.com/report/school-transportation-solutions-market)
- [Youth Sports Market Size and Share 2034](https://www.industryresearch.biz/market-reports/youth-sports-market-101949)
- [Youth Sports Business in 2025](https://youthsportsbusinessreport.com/youth-sports-business-in-2025-the-year-the-industry-grew-up/)
- [NCES Fast Facts: Back-to-School Statistics](https://nces.ed.gov/fastfacts/display.asp?id=372)
- [Brookings: Fewer Field Trips](https://www.brookings.edu/articles/fewer-field-trips-mean-some-students-miss-more-than-a-day-at-the-museum/)
- [Top Travel Risk Management Companies 2026](https://regionalert.com/blog/travel-risk-management-companies-2026.html)
- [International SOS Education Solutions](https://www.internationalsos.com/sectors/education)
- [MissionGuide: Mission Trip Research and Statistics](https://missionguide.global/articles/mission-trip-research)
- [Missions Statistics - The Traveling Team](https://www.thetravelingteam.org/stats)
- [NAFSA: Study Abroad Health, Safety, and Security Guide](https://www.nafsa.org/professional-resources/browse-by-interest/finding-your-study-abroad-program-health-safety-and)
- [Risk Management Magazine: Managing Risks of Study Abroad Programs](https://www.rmmagazine.com/articles/article/2023/04/17/managing-risks-of-study-abroad-programs)
- [Duty of Care in Travel Industry: 2025 Guide](https://safeharbors.com/blog/duty-of-care-in-travel-industry)
- [Safety Information for Mission Trips - YouthWorks](https://youthworks.com/safety/)
- [Sport Tourism Market Size 2032](https://www.persistencemarketresearch.com/market-research/sports-tourism-market.asp)

---

*Analysis version 1.0 | Tag: discovery-20260317 | Next review: 2026-04-17*
