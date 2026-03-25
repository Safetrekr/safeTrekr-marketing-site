# Discovery Summary: SafeTrekr

## Date: 2026-03-23
## Mode: Codebase Analysis
## Agents Used: 6 (Explore, UX Designer, UI Designer, Information Architect, Security Architect, Product Strategy)

---

## Unified Platform Overview

SafeTrekr is an enterprise trip safety management platform: **3 web portals** (Client, Analyst, HQ) + **1 mobile app** (React Native/Expo) + **2 APIs** (Core + TarvaRI Intelligence) backed by **Supabase PostgreSQL with RLS**.

| Metric | Value |
|--------|-------|
| Frontend source files | 1,051 TS/TSX |
| Core API routes | 35 files, 100+ endpoints |
| TarvaRI parsers | 20+ (NOAA, USGS, CDC, ReliefWeb, GDACS) |
| Database tables | 40+ with RLS |
| User roles | 10 (traveler → hq_ops) |
| Analyst review sections | 18 |
| Trip creation wizard steps | 10 |

---

## Cross-Agent Consensus (All 5+ agents agreed)

### 1. Self-Service Signup is the #1 Blocker
**Every agent** identified the absence of self-service org creation as the critical gap. The product cannot be purchased without HQ admin intervention. Estimated forgone ARR: ~$43K/month.

### 2. Security Remediation is Urgent
**Security + Product Strategy** identified 3 CRITICAL findings:
- CRIT-002: Test SECRET_KEY placeholder in .env
- CRIT-003: Plaintext Stripe credentials in `stripe_creds.md`
- CRIT-001: JWT audience verification disabled
These block FERPA/COPPA certification needed for K-12 market.

### 3. Form Validation Architecture is Weak
**UX + UI** both noted React Hook Form + Zod are imported but unused. All forms use raw useState. No schema validation, no dirty tracking, no accessible error announcements.

### 4. Mobile Responsiveness is Minimal
**UX + UI + IA** all found only ~15 responsive breakpoint rules across 673 components. The analyst reviewer panel disappears below lg breakpoint with no alternative.

### 5. Accessibility is Structurally Deficient
**UX + Security** flagged: zero skip-nav links, 3 aria-live regions across 673 files, no page-level error boundaries, password toggle has tabIndex={-1}. For a platform managing minors' data, this is a legal liability.

---

## Divergent Perspectives

| Topic | UX Designer | UI Designer | Product Strategy |
|-------|-------------|-------------|-----------------|
| **Biggest risk** | Data loss in wizard | Form architecture debt | No self-service signup |
| **Animation quality** | Not assessed | 7.5/10 - Anime.js system strong but low adoption | N/A |
| **Mock data** | "Analyst portal operates on mock data" (critical) | Not flagged | "TarvaRI pipeline dormant - 89% of sources" |
| **Pricing** | Not assessed | N/A | "Per-student framing needed - Chapperone has it" |

---

## Severity Summary Across All Agents

| Severity | Security | UX | UI | IA | Strategy | Total |
|----------|----------|----|----|-----|----------|-------|
| CRITICAL | 3 | 5 | 0 | 0 | 3 | **11** |
| HIGH | 8 | 5 | 0 | 4 | 3 | **20** |
| MEDIUM | 10 | 3 | 8 | 8 | 5 | **34** |
| LOW | 7 | 2 | 5 | 5 | 2 | **21** |

---

## Priority Matrix: Top 20 Actions

| # | Action | Source | Impact | Effort |
|---|--------|--------|--------|--------|
| 1 | Delete stripe_creds.md, rotate password | Security CRIT-003 | CRITICAL | 15min |
| 2 | Replace test SECRET_KEY in production | Security CRIT-002 | CRITICAL | 30min |
| 3 | Enable SendGrid webhook signature verification | Security HIGH-007 | HIGH | 1h |
| 4 | Build self-service org signup | Strategy EP-01 | CRITICAL (revenue) | 4-6wk |
| 5 | Remove fabricated marketing testimonials | Strategy EP-07 | CRITICAL (reputation) | 1 day |
| 6 | Enable JWT audience verification | Security CRIT-001 | HIGH | 2h |
| 7 | Add beforeunload guard to trip wizard | UX G-001 | CRITICAL (data loss) | 1 day |
| 8 | Implement skip-nav and ARIA live regions | UX G-003 | HIGH (accessibility) | 1 week |
| 9 | Standardize terminology ("Participants" everywhere) | IA H4 | HIGH (usability) | 2 days |
| 10 | Hide disabled HQ nav items (27 items, 17 disabled) | IA H1 | HIGH (cognitive load) | 1 day |
| 11 | Add global cmd+k search | IA H2 | HIGH (findability) | 2 weeks |
| 12 | Complete file authorization checks (stubbed) | Security HIGH-005 | HIGH | 3h |
| 13 | Scope trip listing to participant membership | Security HIGH-003 | HIGH | 3h |
| 14 | Migrate forms to React Hook Form + Zod | UX/UI | HIGH (quality) | 4 weeks |
| 15 | Submit mobile app to App Store | Strategy | HIGH (distribution) | 2-4wk |
| 16 | Build risk dashboard frontend | Strategy EP-02 | HIGH (demo/sales) | 3 weeks |
| 17 | Add mobile reviewer panel alternative | UI/UX | HIGH (mobile) | 1 week |
| 18 | Fix light mode --muted == --background | UI | MEDIUM (visual) | 1h |
| 19 | Group analyst 18-section sidebar | IA M7 | MEDIUM (scanability) | 2 days |
| 20 | Begin FERPA/COPPA certification process | Strategy/Security | HIGH (K-12 market) | 8-12wk |

---

## Agent-Specific Scores

| Dimension | UX | UI | IA | Security | Strategy |
|-----------|----|----|-----|----------|----------|
| Overall Score | — | 7.2/10 | 2.7/5.0 | — | — |
| Design System | — | 7/10 | — | — | — |
| Components | — | 8/10 | — | — | — |
| Typography | — | 6/10 | — | — | — |
| Color/Dark Mode | — | 7.5/10 | — | — | — |
| Responsive | — | 5.5/10 | — | — | — |
| Maps/DataViz | — | 6.5/10 | — | — | — |
| Forms | — | 4.5/10 | — | — | — |
| Loading/Error States | — | 7/10 | — | — | — |
| Animation | — | 7.5/10 | — | — | — |
| Navigation Predictability | — | — | 3/5 | — | — |
| URL Consistency | — | — | 3/5 | — | — |
| Terminology | — | — | 2/5 | — | — |
| Search/Findability | — | — | 1/5 | — | — |
| Wayfinding | — | — | 2/5 | — | — |
| Feature vs Competitors | — | — | — | — | 4.5/5 |
| Revenue Model | — | — | — | — | 3/5 |
| PMF Traction | — | — | — | — | 0/5 |

---

## Key Risks & Constraints

1. **Regulatory**: COPPA compliance mechanisms absent for platform handling K-12 student PII
2. **Security**: 3 CRITICAL + 8 HIGH security findings in production codebase
3. **Revenue**: Zero self-service path = zero organic revenue growth
4. **Competition**: Chapperone has App Store presence and self-service signup for K-12 segment
5. **Mobile**: App built but not submitted to App Store
6. **TarvaRI**: Primary differentiator (intelligence pipeline) is dormant — 89% of sources inactive
7. **Mock Data**: Analyst portal partially runs on 7,898 lines of mock data

---

## Artifacts Generated

| File | Agent | Size |
|------|-------|------|
| `codebase-analysis-2026-03-23.md` | Explore | 47K chars |
| `security-architect-discovery-2026-03-23.md` | Security Architect | 25K chars |
| `information-architect-discovery-2026-03-23.md` | Information Architect | 33K chars |
| `ui-designer-discovery-2026-03-23.md` | UI Designer | 20K chars |
| `ux-designer-discovery-2026-03-23.md` | UX Designer | 16K chars |
| `product-strategy-discovery-2026-03-23.md` | Product Strategy | 28K chars |

---

## Recommended Next Steps

1. **Immediate (this week)**: Security CRIT remediations + marketing cleanup
2. **Run `/factory-analyze`** to deepen feature analysis and generate enhancement scenarios
3. **Run `/factory-plan`** to create PRDs for self-service signup + risk dashboard
4. **Run `/factory-validation`** to test existing features against adversarial scenarios
5. Review agent-specific artifacts in `./discover-artifacts/`

---

*Generated by Tarva Dark Factory `/factory-discover` on 2026-03-23*
*Run ID: 31afdef0-4f5a-40c0-8af5-fe0bc67777ac*
