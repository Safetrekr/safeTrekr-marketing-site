/**
 * ST-834: REQ-045, Homepage (/)
 *
 * Primary marketing homepage for SafeTrekr. Renders 10 scroll-ordered sections
 * with HTML structure matching designs/html/mockup-homepage.html exactly.
 *
 * Server Component, no "use client" needed. All markup is static HTML/JSX
 * with inline styles and CSS classes from design-tokens.css and Tailwind.
 *
 * Section order:
 *   1. Hero           , Product composition with map + overlay cards
 *   2. Trust Strip    , 5 metrics + intel source bar
 *   3. Problem/Mechanism, Problem statement + 3 mechanism cards
 *   4. How It Works   , 3-step timeline + CTA
 *   5. Feature Grid   , 6 feature cards
 *   6. Binder Showcase, Dark section with fanned mobile screenshots
 *   7. Segment Routing, 4 segment cards
 *   8. Pricing Preview, 3-tier pricing grid
 *   9. Category Contrast, Comparison table
 *  10. Final CTA      , Dark CTA band
 *
 * @see designs/html/mockup-homepage.html
 */

import Link from "next/link";

import { generatePageMetadata } from "@/lib/metadata";
import {
  JsonLd,
  generateSoftwareApplicationSchema,
} from "@/lib/structured-data";
import {
  PricingTierCard,
  InternationalPricingCard,
} from "@/components/marketing";

const HOME_DAY_TRIP_FEATURES = [
  "Experienced analyst review",
  "Comprehensive safety assessment",
  "Interactive digital safety binder",
  "Mobile field support access",
  "Delivery in as soon as 3 days",
  "Verified documentation",
  "PDF & print export",
  "30-day post-trip access",
];

const HOME_EXTENDED_TRIP_FEATURES = [
  "Everything in Day Trip",
  "Multi-day trip support (up to 7 days)",
  "Active intelligence monitoring",
  "Tournament and conference travel",
  "Multiple venue assessment",
  "Priority analyst assignment",
  "60-day post-trip access",
];

const HOME_INTERNATIONAL_FEATURES = [
  "Everything in Extended Trip",
  "International intelligence coverage",
  "Embassy and consulate contacts",
  "Regional condition assessment",
  "Evacuation planning documentation",
  "Pre-departure briefing",
  "Extended monitoring (trip duration + 7 days)",
  "90-day post-trip access",
];

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = generatePageMetadata({
  title: "Go With a Plan | SafeTrekr",
  description:
    "SafeTrekr provides structured trip safety planning for schools, churches, and organizations. Professional review, clear documentation, and the accountability your organization needs.",
  path: "/",
});

// ---------------------------------------------------------------------------
// Reusable inline SVG components (arrow, check, dash)
// ---------------------------------------------------------------------------

function ArrowRightIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function CheckIcon({ className = "w-5 h-5", strokeWidth = 2, style }: { className?: string; strokeWidth?: number; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function DashIcon({ className = "w-4 h-4", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" d="M5 12h14" />
    </svg>
  );
}

function SmallArrowIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      {/* ================================================================
          SECTION 1: HERO
          ================================================================ */}
      <section aria-labelledby="hero-heading" className="relative overflow-hidden" style={{ background: 'var(--color-background)', paddingTop: 160, paddingBottom: 128 }}>
        {/* Dot grid */}
        <div className="hero-dot-grid" />
        {/* Radial glow */}
        <div className="hero-radial-glow" />

        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 items-center">
            {/* Text Column */}
            <div className="lg:col-span-5 flex flex-col">
              {/* Eyebrow */}
              <span className="text-eyebrow flex items-center gap-2" style={{ color: 'var(--color-primary-700)' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--color-primary-700)' }} aria-hidden="true">
                  <path d="M12 2L4 7v6c0 5.5 3.4 10.7 8 12 4.6-1.3 8-6.5 8-12V7l-8-5z" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                TRIP SAFETY PLANNING PLATFORM
              </span>

              {/* Headline */}
              <h1 id="hero-heading" className="text-display-xl mt-4" style={{ color: 'var(--color-foreground)', maxWidth: '20ch' }}>
                Every trip deserves a plan.
              </h1>

              {/* Subtext */}
              <p className="text-body-lg mt-6" style={{ color: 'var(--color-muted-foreground)', maxWidth: '50ch' }}>
                SafeTrekr provides structured safety planning for group travel, professional review, clear documentation, and the accountability your organization needs. Maintain exceptional experiences while ensuring appropriate preparation is completed professionally.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8">
                <Link href="/demo" className="inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-150 text-white text-center sm:text-left" style={{ fontFamily: 'var(--font-heading)', background: 'var(--color-primary-600)', padding: '16px 32px', fontSize: 18, borderRadius: 'var(--radius-md)', textDecoration: 'none' }}>
                  Schedule a Walkthrough
                  <ArrowRightIcon />
                </Link>
                <Link href="/resources/sample-binders" className="inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-150 text-center sm:text-left" style={{ fontFamily: 'var(--font-heading)', background: 'transparent', border: '1.5px solid var(--color-border)', color: 'var(--color-foreground)', padding: '16px 32px', fontSize: 18, borderRadius: 'var(--radius-md)', textDecoration: 'none' }}>
                  View Sample Binder
                  <ArrowRightIcon />
                </Link>
              </div>
            </div>

            {/* Visual Column: Product Composition */}
            <div className="lg:col-span-7 relative hidden md:block" style={{ minHeight: 440 }}>
              {/* Layer 1: Map Base */}
              <div className="relative rounded-xl overflow-hidden border" style={{ width: '100%', maxWidth: 560, aspectRatio: '14/10', boxShadow: 'var(--shadow-lg)', borderColor: 'var(--color-border)', background: '#dce3e6' }}>
                {/* Desaturated map placeholder */}
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #d4dce0 0%, #c8d2d6 25%, #d0d9dd 50%, #c5cfd4 75%, #d3dbdf 100%)', position: 'relative', filter: 'saturate(0.15) contrast(0.85)' }}>
                  <div style={{ position: 'absolute', top: '15%', left: '10%', width: '35%', height: '25%', background: 'linear-gradient(180deg, rgba(160,175,165,0.4), transparent)', borderRadius: '60% 40% 50% 50%' }} />
                  <div style={{ position: 'absolute', top: '35%', left: '50%', width: '25%', height: '20%', background: 'linear-gradient(180deg, rgba(170,185,175,0.3), transparent)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '30%', height: '30%', background: 'rgba(155,175,195,0.25)', borderRadius: '40% 60% 50% 40%' }} />
                </div>
                {/* Route SVG overlay */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 560 400" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <path d="M 100 320 C 150 280, 200 200, 280 180 S 400 160, 460 100" stroke="#4ca46e" strokeWidth={3} strokeLinecap="round" fill="none" strokeDasharray="8 4" opacity={0.8} />
                  <circle cx={100} cy={320} r={16} fill="#e0f1e6" opacity={0.5} />
                  <circle cx={280} cy={180} r={16} fill="#e0f1e6" opacity={0.5} />
                  <circle cx={460} cy={100} r={16} fill="#e0f1e6" opacity={0.5} />
                  <circle cx={100} cy={320} r={6} fill="#3f885b" />
                  <circle cx={280} cy={180} r={6} fill="#3f885b" />
                  <circle cx={460} cy={100} r={6} fill="#3f885b" />
                  <polygon points="190,228 198,224 194,234" fill="#4ca46e" opacity={0.7} />
                  <polygon points="370,148 378,144 374,154" fill="#4ca46e" opacity={0.7} />
                </svg>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Map showing a trip route with safety waypoints" className="absolute inset-0 w-full h-full" style={{ opacity: 0 }} />
              </div>

              {/* Layer 2: Trip Review Progress Panel */}
              <div className="absolute rounded-xl bg-white shadow-xl border p-5 hidden lg:block" style={{ width: 260, top: -20, right: -10, zIndex: 10, borderColor: 'var(--color-border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-heading-sm" style={{ color: 'var(--color-foreground)', fontSize: 18 }}>Trip Safety Review</span>
                  <span className="badge badge-brand" style={{ fontSize: 11 }}>Reviewed</span>
                </div>
                <div className="flex flex-col gap-3 mb-4">
                  {(['Venue Safety', 'Transportation', 'Emergency Plan', 'Health Advisory'] as const).map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#4ca46e" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <span className="text-body-sm" style={{ color: 'var(--color-foreground)' }}>{item}</span>
                    </div>
                  ))}
                </div>
                {/* Progress bar: 85% complete */}
                <div className="w-full h-2 rounded-full" style={{ background: 'var(--color-primary-100)' }}>
                  <div className="h-full rounded-full progress-fill" style={{ background: 'var(--color-primary-500)', maxWidth: '85%' }} />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-body-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>85% complete</span>
                  <span className="badge badge-brand" style={{ fontSize: 10, padding: '1px 8px' }}>Trip Ready</span>
                </div>
              </div>

              {/* Layer 3: Evidence Binder Document Preview */}
              <div className="absolute hidden lg:block" style={{ right: -10, top: 290, zIndex: 20 }}>
                {/* Stacked paper offset layers */}
                <div className="absolute rounded-lg bg-white/80 border" style={{ width: 220, height: 160, top: 4, left: 4, borderColor: 'rgba(184,195,199,0.3)', boxShadow: 'var(--shadow-sm)' }} />
                <div className="absolute rounded-lg bg-white/90 border" style={{ width: 220, height: 160, top: 2, left: 2, borderColor: 'rgba(184,195,199,0.3)', boxShadow: 'var(--shadow-sm)' }} />
                {/* Front sheet */}
                <div className="relative rounded-lg bg-white border p-4" style={{ width: 220, height: 160, borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-lg)' }}>
                  <span className="text-eyebrow block" style={{ color: 'var(--color-muted-foreground)', fontSize: 10 }}>EVIDENCE BINDER</span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="badge badge-brand" style={{ fontSize: 10, padding: '1px 6px' }}>Verified</span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-safety-green)' }} />
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--color-primary-500)' }} />
                      <span style={{ fontSize: 11, color: 'var(--color-foreground)', lineHeight: 1.3 }}>Risk assessment completed</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--color-primary-500)' }} />
                      <span style={{ fontSize: 11, color: 'var(--color-foreground)', lineHeight: 1.3 }}>Documentation finalized</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-muted-foreground)', letterSpacing: '0.03em' }}>a3f2...c891</code>
                  </div>
                </div>
              </div>

              {/* Layer 4: Readiness Gauge */}
              <div className="absolute hidden lg:block rounded-xl bg-white border p-4 text-center" style={{ bottom: -16, left: 24, zIndex: 15, width: 120, borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-lg)' }}>
                <svg viewBox="0 0 72 72" width={72} height={72} className="mx-auto" aria-hidden="true">
                  <circle cx={36} cy={36} r={32} fill="none" stroke="#e0f1e6" strokeWidth={4} transform="rotate(-90 36 36)" />
                  <circle cx={36} cy={36} r={32} fill="none" stroke="#4ca46e" strokeWidth={4} strokeLinecap="round" transform="rotate(-90 36 36)" className="gauge-arc" />
                  <text x={36} y={34} textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight={600} fontSize={16} fill="#061a23">85%</text>
                  <text x={36} y={48} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={8} fill="#4d5153">Trip Ready</text>
                </svg>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full status-pulse" style={{ background: 'var(--color-safety-green)' }} aria-hidden="true" />
                  <span style={{ fontSize: 10, color: 'var(--color-muted-foreground)' }}>Active</span>
                </div>
              </div>
            </div>

            {/* Mobile simplified composition */}
            <div className="md:hidden relative rounded-xl overflow-hidden border" style={{ aspectRatio: '16/10', background: 'linear-gradient(135deg, #d4dce0 0%, #c8d2d6 25%, #d0d9dd 50%, #c5cfd4 75%, #d3dbdf 100%)', borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-lg)' }}>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 560 350" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <path d="M 80 280 C 150 220, 250 180, 350 150 S 450 120, 500 80" stroke="#4ca46e" strokeWidth={3} strokeLinecap="round" fill="none" strokeDasharray="8 4" opacity={0.8} />
                <circle cx={80} cy={280} r={14} fill="#e0f1e6" opacity={0.5} />
                <circle cx={350} cy={150} r={14} fill="#e0f1e6" opacity={0.5} />
                <circle cx={80} cy={280} r={6} fill="#3f885b" />
                <circle cx={350} cy={150} r={6} fill="#3f885b" />
              </svg>
            </div>
          </div>
        </div>

        {/* Responsive padding overrides */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 767px) {
            section[aria-labelledby="hero-heading"] { padding-top: 112px !important; padding-bottom: 80px !important; }
          }
          @media (min-width: 768px) and (max-width: 1023px) {
            section[aria-labelledby="hero-heading"] { padding-top: 140px !important; padding-bottom: 96px !important; }
          }
        ` }} />
      </section>

      {/* ================================================================
          SECTION 2: TRUST METRICS STRIP
          ================================================================ */}
      <section aria-label="Platform credentials" className="border-y" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)', padding: '48px 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-3 gap-6 lg:gap-8">
            <div className="text-center" aria-label="Multiple trusted intel sources">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.75rem, 1.04rem + 1.98vw, 2.75rem)', fontWeight: 700, color: 'var(--color-foreground)', lineHeight: 1 }}>Multiple</div>
              <div className="text-eyebrow mt-2" style={{ color: 'var(--color-muted-foreground)', fontSize: 12 }}>Trusted Intel Sources</div>
            </div>
            <div className="text-center" aria-label="Full comprehensive review">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.75rem, 1.04rem + 1.98vw, 2.75rem)', fontWeight: 700, color: 'var(--color-foreground)', lineHeight: 1 }}>Full</div>
              <div className="text-eyebrow mt-2" style={{ color: 'var(--color-muted-foreground)', fontSize: 12 }}>Comprehensive Review</div>
            </div>
            <div className="text-center" aria-label="3 day fast turnaround">
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 1.04rem + 1.98vw, 2.75rem)', fontWeight: 700, color: 'var(--color-foreground)', lineHeight: 1 }}>3 Day</div>
              <div className="text-eyebrow mt-2" style={{ color: 'var(--color-muted-foreground)', fontSize: 12 }}>Fast Turnaround</div>
            </div>
                      </div>

          {/* Intel source bar */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 mt-8 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 12, color: 'var(--color-muted-foreground)', letterSpacing: '0.05em', textTransform: 'uppercase' as const, fontWeight: 500 }}>Government</span>
            <span style={{ height: 12, width: 1, background: 'var(--color-border)' }} aria-hidden="true" />
            <span style={{ fontSize: 12, color: 'var(--color-muted-foreground)', letterSpacing: '0.05em', textTransform: 'uppercase' as const, fontWeight: 500 }}>Humanitarian</span>
            <span style={{ height: 12, width: 1, background: 'var(--color-border)' }} aria-hidden="true" />
            <span style={{ fontSize: 12, color: 'var(--color-muted-foreground)', letterSpacing: '0.05em', textTransform: 'uppercase' as const, fontWeight: 500 }}>Regional</span>
            <span style={{ height: 12, width: 1, background: 'var(--color-border)' }} aria-hidden="true" />
            <span style={{ fontSize: 12, color: 'var(--color-muted-foreground)', letterSpacing: '0.05em', textTransform: 'uppercase' as const, fontWeight: 500 }}>Emergency</span>
            <span style={{ height: 12, width: 1, background: 'var(--color-border)' }} aria-hidden="true" />
            <span style={{ fontSize: 12, color: 'var(--color-muted-foreground)', letterSpacing: '0.05em', textTransform: 'uppercase' as const, fontWeight: 500 }}>Health</span>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 3: PROBLEM / MECHANISM
          ================================================================ */}
      <section aria-labelledby="problem-mechanism-heading" style={{ background: 'var(--color-background)', padding: '96px 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-eyebrow" style={{ color: 'var(--color-primary-700)' }}>THE CHALLENGE</span>
            <h2 id="problem-mechanism-heading" className="text-display-md mt-4 mx-auto" style={{ color: 'var(--color-foreground)', maxWidth: '28ch' }}>
              Most organizations want to plan thoroughly. They just need the right tools.
            </h2>
            <p className="text-body-lg mt-4 mx-auto" style={{ color: 'var(--color-muted-foreground)', maxWidth: '65ch' }}>
              Planning a trip involves dozens of considerations, venues, transportation, health factors, emergency contacts, weather, and more. Most organizations rely on dedicated staff doing their best with spreadsheets, checklists, and good intentions. SafeTrekr provides the systematic approach that helps your team address each consideration, with documentation that demonstrates your thoroughness.
            </p>
          </div>

          <p className="text-heading-lg text-center font-semibold mt-12" style={{ color: 'var(--color-foreground)' }}>
            SafeTrekr adds structure to what you're already doing.
          </p>

          {/* 3 Mechanism Cards */}
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Card 1: Professional Analyst Review */}
            <Link href="/platform/analyst-review" className="card card-interactive group block" style={{ padding: 32, textDecoration: 'none' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'var(--color-primary-50)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--color-primary-700)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Professional Analyst Review</h3>
              <p className="text-body-md mt-2" style={{ color: 'var(--color-muted-foreground)', maxWidth: '45ch' }}>
                Every trip is reviewed by a trained safety analyst across 17 standardized sections, from venue details to emergency contacts. Assessment by professionals, not automated scoring.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-body-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>
                Learn about the review process
                <SmallArrowIcon className="w-4 h-4 card-link-arrow" />
              </span>
            </Link>

            {/* Card 2: Government Intelligence Scoring */}
            <Link href="/platform/risk-intelligence" className="card card-interactive group block" style={{ padding: 32, textDecoration: 'none' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'var(--color-primary-50)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--color-primary-700)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              </div>
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Current Safety Information</h3>
              <p className="text-body-md mt-2" style={{ color: 'var(--color-muted-foreground)', maxWidth: '45ch' }}>
                Your review includes current information from multiple trusted sources, weather, health advisories, and regional conditions. Your analyst evaluates it, so you don't have to.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-body-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>
                See how information is gathered
                <SmallArrowIcon className="w-4 h-4 card-link-arrow" />
              </span>
            </Link>

            {/* Card 3: Tamper-Evident Documentation */}
            <Link href="/platform/safety-binder" className="card card-interactive group block" style={{ padding: 32, textDecoration: 'none' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'var(--color-primary-50)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--color-primary-700)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Documented Preparation</h3>
              <p className="text-body-md mt-2" style={{ color: 'var(--color-muted-foreground)', maxWidth: '45ch' }}>
                Every finding, every recommendation, every emergency contact documented in a complete safety binder. When someone asks what you did to prepare, you have professional documentation to share.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-body-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>
                Explore the safety binder
                <SmallArrowIcon className="w-4 h-4 card-link-arrow" />
              </span>
            </Link>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 767px) {
            section[aria-labelledby="problem-mechanism-heading"] { padding: 48px 0 !important; }
          }
        ` }} />
      </section>

      {/* ================================================================
          SECTION 4: HOW IT WORKS PREVIEW
          ================================================================ */}
      <section aria-labelledby="how-it-works-heading" style={{ background: 'var(--color-primary-50)', padding: '96px 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-eyebrow" style={{ color: 'var(--color-primary-700)' }}>HOW IT WORKS</span>
            <h2 id="how-it-works-heading" className="text-display-md mt-4 mx-auto" style={{ color: 'var(--color-foreground)', maxWidth: '28ch' }}>
              From your trip details to complete documentation in as soon as 3 days.
            </h2>
          </div>

          {/* 3-Step Timeline */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mt-16">
            {/* Step 1: Submit */}
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold" style={{ background: 'var(--color-primary-100)', color: 'var(--color-primary-700)', fontFamily: 'var(--font-heading)', fontSize: 18 }}>1</div>
                <div className="hidden md:block flex-1 h-0.5" style={{ background: 'var(--color-primary-200)' }} aria-hidden="true" />
              </div>
              <h3 className="text-heading-md" style={{ color: 'var(--color-foreground)' }}>Share Your Trip Details</h3>
              <p className="text-body-md mt-2" style={{ color: 'var(--color-muted-foreground)', maxWidth: '45ch' }}>
                Enter your destination, dates, participants, and planned activities through a guided form. Takes about 15 minutes. No special training required.
              </p>
            </div>

            {/* Step 2: Reviews */}
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold" style={{ background: 'var(--color-primary-100)', color: 'var(--color-primary-700)', fontFamily: 'var(--font-heading)', fontSize: 18 }}>2</div>
                <div className="hidden md:block flex-1 h-0.5" style={{ background: 'var(--color-primary-200)' }} aria-hidden="true" />
              </div>
              <h3 className="text-heading-md" style={{ color: 'var(--color-foreground)' }}>Professional Assessment</h3>
              <p className="text-body-md mt-2" style={{ color: 'var(--color-muted-foreground)', maxWidth: '45ch' }}>
                A trained safety analyst reviews your trip across 17 standardized sections using current information from government data sources. Findings documented. Recommendations provided.
              </p>
            </div>

            {/* Step 3: Receive */}
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold" style={{ background: 'var(--color-primary-100)', color: 'var(--color-primary-700)', fontFamily: 'var(--font-heading)', fontSize: 18 }}>3</div>
              </div>
              <h3 className="text-heading-md" style={{ color: 'var(--color-foreground)' }}>Receive Your Documentation</h3>
              <p className="text-body-md mt-2" style={{ color: 'var(--color-muted-foreground)', maxWidth: '45ch' }}>
                Your organization receives a complete safety binder with every finding, recommendation, and contact organized for easy reference. Share with leadership, parents, or stakeholders.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/how-it-works" className="inline-flex items-center gap-1.5 text-body-md font-medium" style={{ color: 'var(--color-primary-700)', textDecoration: 'none' }}>
              See the full process
              <SmallArrowIcon />
            </Link>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 767px) {
            section[aria-labelledby="how-it-works-heading"] { padding: 48px 0 !important; }
          }
        ` }} />
      </section>

      {/* ================================================================
          SECTION 5: FEATURE GRID
          ================================================================ */}
      <section aria-labelledby="feature-grid-heading" style={{ background: 'var(--color-background)', padding: '96px 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <span className="text-eyebrow" style={{ color: 'var(--color-primary-700)' }}>PLATFORM CAPABILITIES</span>
            <h2 id="feature-grid-heading" className="text-display-md mt-4" style={{ color: 'var(--color-foreground)', maxWidth: '28ch' }}>
              Everything you need to plan every trip.
            </h2>
          </div>

          {/* 6 Feature Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {/* Card 1: Analyst Safety Review */}
            <Link href="/platform/analyst-review" className="card card-interactive group block" style={{ padding: 32, textDecoration: 'none' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'var(--color-primary-50)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--color-primary-700)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Analyst Safety Review</h3>
              <p className="text-body-md mt-2" style={{ color: 'var(--color-muted-foreground)', maxWidth: '45ch' }}>
                Comprehensive professional review of every trip by experienced analysts including former Secret Service, Special Operations, and trained safety professionals.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-body-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>
                Learn more
                <SmallArrowIcon className="w-4 h-4 card-link-arrow" />
              </span>
            </Link>

            {/* Card 2: Risk Intelligence Engine */}
            <Link href="/platform/risk-intelligence" className="card card-interactive group block" style={{ padding: 32, textDecoration: 'none' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'var(--color-primary-50)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--color-primary-700)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              </div>
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Safety Information Engine</h3>
              <p className="text-body-md mt-2" style={{ color: 'var(--color-muted-foreground)', maxWidth: '45ch' }}>
                Current information from multiple trusted sources. Conditions for your destination professionally assessed and evaluated.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-body-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>
                Learn more
                <SmallArrowIcon className="w-4 h-4 card-link-arrow" />
              </span>
            </Link>

            {/* Card 3: Trip Safety Binder */}
            <Link href="/platform/safety-binder" className="card card-interactive group block" style={{ padding: 32, textDecoration: 'none' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'var(--color-primary-50)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--color-primary-700)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Trip Safety Binder</h3>
              <p className="text-body-md mt-2" style={{ color: 'var(--color-muted-foreground)', maxWidth: '45ch' }}>
                Complete documentation delivered in as soon as 3 days. Every finding, recommendation, and contact preserved with verified integrity.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-body-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>
                Learn more
                <SmallArrowIcon className="w-4 h-4 card-link-arrow" />
              </span>
            </Link>

            {/* Card 4: Mobile Field Operations */}
            <Link href="/platform/mobile-app" className="card card-interactive group block" style={{ padding: 32, textDecoration: 'none' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'var(--color-primary-50)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--color-primary-700)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><rect x={5} y={2} width={14} height={20} rx={2} ry={2} /><path d="M12 18h.01" /></svg>
              </div>
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Mobile Field Support</h3>
              <p className="text-body-md mt-2" style={{ color: 'var(--color-muted-foreground)', maxWidth: '45ch' }}>
                Active trip awareness, rally point coordination, and check-in tools. Everything your coordinators need accessible on their phones.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-body-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>
                Learn more
                <SmallArrowIcon className="w-4 h-4 card-link-arrow" />
              </span>
            </Link>

            {/* Card 5: Real-Time Monitoring */}
            <Link href="/platform/monitoring" className="card card-interactive group block" style={{ padding: 32, textDecoration: 'none' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'var(--color-primary-50)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--color-primary-700)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
              </div>
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Active Trip Awareness</h3>
              <p className="text-body-md mt-2" style={{ color: 'var(--color-muted-foreground)', maxWidth: '45ch' }}>
                Briefings and alerts during travel. Know what's happening. Coordinate communication when conditions change.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-body-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>
                Learn more
                <SmallArrowIcon className="w-4 h-4 card-link-arrow" />
              </span>
            </Link>

            {/* Card 6: Compliance and Evidence */}
            <Link href="/platform/compliance" className="card card-interactive group block" style={{ padding: 32, textDecoration: 'none' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'var(--color-primary-50)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--color-primary-700)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Clear Accountability</h3>
              <p className="text-body-md mt-2" style={{ color: 'var(--color-muted-foreground)', maxWidth: '45ch' }}>
                Documentation designed for the questions stakeholders ask. Organized records that demonstrate thorough preparation.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-body-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>
                Learn more
                <SmallArrowIcon className="w-4 h-4 card-link-arrow" />
              </span>
            </Link>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 767px) {
            section[aria-labelledby="feature-grid-heading"] { padding: 48px 0 !important; }
          }
        ` }} />
      </section>

      {/* ================================================================
          SECTION 6: BINDER SHOWCASE (DARK SECTION)
          ================================================================ */}
      <section aria-labelledby="binder-showcase-heading" data-theme="dark" style={{ background: 'var(--color-secondary)', padding: '96px 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Text Column */}
            <div className="lg:col-span-5">
              <span className="text-eyebrow" style={{ color: '#6cbc8b' }}>THE SAFETY BINDER</span>
              <h2 id="binder-showcase-heading" className="text-display-md mt-4" style={{ color: '#f7f8f8', maxWidth: '28ch' }}>
                See what comprehensive trip planning looks like.
              </h2>
              <p className="text-body-lg mt-6" style={{ color: '#b8c3c7', maxWidth: '65ch', lineHeight: 1.6 }}>
                Every trip planned through SafeTrekr produces a complete safety binder. The binder documents every analyst finding, every assessment, every emergency contact, organized and verified. If a board member, parent, or stakeholder asks what you did to prepare, you share the binder.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8">
                <Link href="/resources/sample-binders" className="inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-150 text-center" style={{ fontFamily: 'var(--font-heading)', background: '#ffffff', color: 'var(--color-secondary)', padding: '16px 32px', fontSize: 18, borderRadius: 'var(--radius-md)', textDecoration: 'none' }}>
                  View Sample Binder
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </Link>
                <Link href="/how-it-works#safety-binder" className="inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-150 text-center" style={{ fontFamily: 'var(--font-heading)', background: 'transparent', border: '1.5px solid rgba(255,255,255,0.2)', color: '#f7f8f8', padding: '16px 32px', fontSize: 18, borderRadius: 'var(--radius-md)', textDecoration: 'none' }}>
                  See What&apos;s Inside
                  <ArrowRightIcon />
                </Link>
              </div>
            </div>

            {/* Visual Column: Fanned Product Screenshots */}
            <div className="lg:col-span-7 relative" style={{ minHeight: 400 }} aria-hidden="true">
              <div className="relative mx-auto flex items-center justify-center" style={{ maxWidth: 580, height: 420 }}>
                {/* Screen 1 (leftmost, most rotated) - Safety Packet */}
                <div className="hidden sm:block absolute rounded-2xl overflow-hidden" style={{ zIndex: 1, transform: 'rotate(-15deg) translateX(-120px)', width: 180, height: 360, background: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ background: 'var(--color-primary-600)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                    <span style={{ fontSize: 10, color: 'white', fontWeight: 600 }}>Safety Packet</span>
                  </div>
                  <div style={{ padding: 12 }}>
                    <div style={{ fontSize: 9, color: 'var(--color-muted-foreground)', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 8 }}>Trip Documentation</div>
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 14, height: 14, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}><path d="M20 6L9 17l-5-5" /></svg></div><span style={{ fontSize: 9, color: 'var(--color-foreground)' }}>Venue Safety Verified</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 14, height: 14, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}><path d="M20 6L9 17l-5-5" /></svg></div><span style={{ fontSize: 9, color: 'var(--color-foreground)' }}>Transport Assessed</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 14, height: 14, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}><path d="M20 6L9 17l-5-5" /></svg></div><span style={{ fontSize: 9, color: 'var(--color-foreground)' }}>Emergency Plan Complete</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 14, height: 14, borderRadius: '50%', background: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}><path d="M12 2v10m0 4v.01" /></svg></div><span style={{ fontSize: 9, color: 'var(--color-foreground)' }}>Health Advisory Active</span></div>
                    </div>
                  </div>
                </div>

                {/* Screen 2 - Today View / Trip Overview */}
                <div className="hidden sm:block absolute rounded-2xl overflow-hidden" style={{ zIndex: 2, transform: 'rotate(-8deg) translateX(-50px)', width: 190, height: 370, background: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%)', padding: 12, color: 'white' }}>
                    <div style={{ fontSize: 10, opacity: 0.7 }}>Active Trip</div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>Today</div>
                    <div style={{ fontSize: 9, opacity: 0.6, marginTop: 2 }}>Barcelona, Spain</div>
                  </div>
                  <div style={{ padding: 10 }}>
                    <div style={{ background: 'var(--color-primary-50)', borderRadius: 8, padding: 8, marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                        <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--color-primary-700)' }}>All Clear</span>
                      </div>
                      <div style={{ fontSize: 8, color: 'var(--color-muted-foreground)' }}>No active advisories</div>
                    </div>
                    <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--color-muted-foreground)', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 6 }}>Schedule</div>
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
                      <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6, padding: 6, fontSize: 8 }}><span style={{ color: 'var(--color-primary-600)', fontWeight: 600 }}>9:00 AM</span> — Museum Visit</div>
                      <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6, padding: 6, fontSize: 8 }}><span style={{ color: 'var(--color-primary-600)', fontWeight: 600 }}>12:30 PM</span> — Group Lunch</div>
                      <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6, padding: 6, fontSize: 8 }}><span style={{ color: 'var(--color-primary-600)', fontWeight: 600 }}>2:00 PM</span> — Walking Tour</div>
                    </div>
                  </div>
                </div>

                {/* Screen 3 (center, front) - Emergency Contacts */}
                <div className="absolute rounded-2xl overflow-hidden" style={{ zIndex: 3, transform: 'rotate(0deg)', width: 200, height: 380, background: '#fff', boxShadow: '0 25px 50px rgba(0,0,0,0.35)', border: '2px solid rgba(255,255,255,0.15)' }}>
                  <div style={{ background: '#dc2626', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91" /></svg>
                    <span style={{ fontSize: 11, color: 'white', fontWeight: 700 }}>Emergency Contacts</span>
                  </div>
                  <div style={{ padding: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                      <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 8 }}>
                        <div style={{ fontSize: 9, color: 'var(--color-muted-foreground)', textTransform: 'uppercase' as const }}>Local Emergency</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-foreground)', marginTop: 2 }}>112</div>
                      </div>
                      <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 8 }}>
                        <div style={{ fontSize: 9, color: 'var(--color-muted-foreground)', textTransform: 'uppercase' as const }}>US Embassy</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-foreground)', marginTop: 2 }}>+34 93 280 2227</div>
                      </div>
                      <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 8 }}>
                        <div style={{ fontSize: 9, color: 'var(--color-muted-foreground)', textTransform: 'uppercase' as const }}>Nearest Hospital</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-foreground)', marginTop: 2 }}>Hospital Cl{'\u00ed'}nic</div>
                        <div style={{ fontSize: 9, color: 'var(--color-muted-foreground)' }}>0.8 mi away</div>
                      </div>
                      <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 8 }}>
                        <div style={{ fontSize: 9, color: 'var(--color-muted-foreground)', textTransform: 'uppercase' as const }}>Trip Leader</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-foreground)', marginTop: 2 }}>Sarah Johnson</div>
                        <div style={{ fontSize: 9, color: 'var(--color-muted-foreground)' }}>+1 (555) 234-5678</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 9, color: 'var(--color-muted-foreground)', textTransform: 'uppercase' as const }}>Rally Point</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-foreground)', marginTop: 2 }}>Hotel Lobby</div>
                        <div style={{ fontSize: 9, color: 'var(--color-primary-600)', fontWeight: 500 }}>Navigate {'\u2192'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Screen 4 - Trip Information */}
                <div className="hidden sm:block absolute rounded-2xl overflow-hidden" style={{ zIndex: 2, transform: 'rotate(8deg) translateX(50px)', width: 190, height: 370, background: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ background: 'var(--color-primary-600)', padding: 12, color: 'white' }}>
                    <div style={{ fontSize: 10, opacity: 0.7 }}>Trip Information</div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>Barcelona Study Tour</div>
                  </div>
                  <div style={{ padding: 10 }}>
                    <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--color-muted-foreground)', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 6 }}>Details</div>
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6, fontSize: 9 }}>
                      <div><span style={{ color: 'var(--color-muted-foreground)' }}>Dates:</span> <span style={{ color: 'var(--color-foreground)', fontWeight: 500 }}>Mar 15-22, 2026</span></div>
                      <div><span style={{ color: 'var(--color-muted-foreground)' }}>Group:</span> <span style={{ color: 'var(--color-foreground)', fontWeight: 500 }}>28 participants</span></div>
                      <div><span style={{ color: 'var(--color-muted-foreground)' }}>Type:</span> <span style={{ color: 'var(--color-foreground)', fontWeight: 500 }}>International (T3)</span></div>
                      <div><span style={{ color: 'var(--color-muted-foreground)' }}>Status:</span> <span style={{ color: '#22c55e', fontWeight: 600 }}>Active</span></div>
                    </div>
                    <div style={{ height: 1, background: 'var(--color-border)', margin: '10px 0' }} />
                    <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--color-muted-foreground)', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 6 }}>Lodging</div>
                    <div style={{ fontSize: 9, color: 'var(--color-foreground)', fontWeight: 500 }}>Hotel Arts Barcelona</div>
                    <div style={{ fontSize: 8, color: 'var(--color-muted-foreground)' }}>Marina 19-21, Barcelona</div>
                  </div>
                </div>

                {/* Screen 5 (rightmost) - Live Map */}
                <div className="hidden sm:block absolute rounded-2xl overflow-hidden" style={{ zIndex: 1, transform: 'rotate(15deg) translateX(120px)', width: 180, height: 360, background: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ background: 'linear-gradient(180deg, #e8eef0 0%, #d4dde0 100%)', height: 200, position: 'relative' as const, overflow: 'hidden' }}>
                    <div style={{ position: 'absolute' as const, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 12, height: 12, borderRadius: '50%', background: 'var(--color-primary-600)', border: '2px solid white', boxShadow: '0 0 0 4px rgba(63,136,91,0.3)' }} />
                    <div style={{ position: 'absolute' as const, top: '30%', left: '30%', width: 8, height: 8, borderRadius: '50%', background: '#22c55e', border: '1.5px solid white' }} />
                    <div style={{ position: 'absolute' as const, top: '65%', left: '70%', width: 8, height: 8, borderRadius: '50%', background: '#22c55e', border: '1.5px solid white' }} />
                    <svg style={{ position: 'absolute' as const, top: 0, left: 0, width: '100%', height: '100%', opacity: 0.15 }} viewBox="0 0 180 200"><path d="M30 60 Q90 30 150 80 Q120 140 60 170" fill="none" stroke="var(--color-secondary)" strokeWidth={1.5} /></svg>
                  </div>
                  <div style={{ padding: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                      <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--color-foreground)' }}>28/28 Located</span>
                    </div>
                    <div style={{ fontSize: 8, color: 'var(--color-muted-foreground)' }}>All participants within geofence</div>
                    <div style={{ marginTop: 8, background: 'var(--color-primary-50)', borderRadius: 6, padding: 6, textAlign: 'center' as const }}>
                      <span style={{ fontSize: 8, color: 'var(--color-primary-700)', fontWeight: 600 }}>Rally Point: 0.2 mi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 7: SEGMENT ROUTING
          ================================================================ */}
      <section aria-labelledby="segment-routing-heading" style={{ background: 'var(--color-background)', padding: '96px 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-eyebrow" style={{ color: 'var(--color-primary-700)' }}>BUILT FOR YOUR ORGANIZATION</span>
            <h2 id="segment-routing-heading" className="text-display-md mt-4 mx-auto" style={{ color: 'var(--color-foreground)', maxWidth: '28ch' }}>
              Built for organizations that value thorough preparation.
            </h2>
          </div>

          {/* 4 Segment Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {/* K-12 */}
            <Link href="/solutions/k12" className="card card-interactive group block" style={{ padding: 24, textDecoration: 'none' }} aria-label="Learn more about K-12 Schools and Districts solutions">
              <svg className="w-8 h-8 mb-4" style={{ color: 'var(--color-primary-700)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>K-12 Schools and Districts</h3>
              <p className="text-body-sm mt-2" style={{ color: 'var(--color-muted-foreground)' }}>
                Field trip planning that supports educational excellence. Consistent process across every school, every trip. Documentation that demonstrates due diligence to boards and parents.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-body-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>
                Learn more
                <SmallArrowIcon className="w-4 h-4 card-link-arrow" />
              </span>
            </Link>

            {/* Higher Education */}
            <Link href="/solutions/higher-education" className="card card-interactive group block" style={{ padding: 24, textDecoration: 'none' }} aria-label="Learn more about Higher Education solutions">
              <svg className="w-8 h-8 mb-4" style={{ color: 'var(--color-primary-700)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><path d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Higher Education</h3>
              <p className="text-body-sm mt-2" style={{ color: 'var(--color-muted-foreground)' }}>
                Study abroad and faculty travel with institutional-grade documentation. Support your global educational mission with professional preparation.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-body-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>
                Learn more
                <SmallArrowIcon className="w-4 h-4 card-link-arrow" />
              </span>
            </Link>

            {/* Churches */}
            <Link href="/solutions/churches" className="card card-interactive group block" style={{ padding: 24, textDecoration: 'none' }} aria-label="Learn more about Churches and Mission Organizations solutions">
              <svg className="w-8 h-8 mb-4" style={{ color: 'var(--color-primary-700)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Churches and Mission Organizations</h3>
              <p className="text-body-sm mt-2" style={{ color: 'var(--color-muted-foreground)' }}>
                Mission trip preparation that honors your calling. Simple guidance for volunteer leaders. Documentation that demonstrates good stewardship.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-body-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>
                Learn more
                <SmallArrowIcon className="w-4 h-4 card-link-arrow" />
              </span>
            </Link>

            {/* Corporate */}
            <Link href="/solutions/corporate" className="card card-interactive group block" style={{ padding: 24, textDecoration: 'none' }} aria-label="Learn more about Corporate and Sports Teams solutions">
              <svg className="w-8 h-8 mb-4" style={{ color: 'var(--color-primary-700)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Corporate and Professional Travel</h3>
              <p className="text-body-sm mt-2" style={{ color: 'var(--color-muted-foreground)' }}>
                Business travel planning with clear accountability. Duty of care documentation without dedicated risk management staff.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-body-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>
                Learn more
                <SmallArrowIcon className="w-4 h-4 card-link-arrow" />
              </span>
            </Link>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 767px) {
            section[aria-labelledby="segment-routing-heading"] { padding: 48px 0 !important; }
          }
        ` }} />
      </section>

      {/* ================================================================
          SECTION 8: PRICING PREVIEW
          ================================================================ */}
      <section aria-labelledby="pricing-preview-heading" className="border-y" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)', padding: '96px 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-eyebrow" style={{ color: 'var(--color-primary-700)' }}>PRICING</span>
            <h2 id="pricing-preview-heading" className="text-display-md mt-4 mx-auto" style={{ color: 'var(--color-foreground)', maxWidth: '28ch' }}>
              Professional trip assessment. Straightforward pricing.
            </h2>
            <p className="text-body-lg mt-4 mx-auto" style={{ color: 'var(--color-muted-foreground)', maxWidth: '65ch' }}>
              Most organizations find that structured trip planning saves time, reduces administrative burden, and creates valuable documentation for future reference.
            </p>
          </div>

          {/* 3 Pricing Tiers */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-12 items-start">
            <PricingTierCard
              id="home-day-trip"
              tierName="Day Trip"
              price="$450"
              perParticipant="~$15/person for a 30-person group"
              features={HOME_DAY_TRIP_FEATURES}
              ctaText="Schedule a Walkthrough"
              ctaHref="/demo"
            />
            <PricingTierCard
              id="home-extended-trip"
              tierName="Extended Trip"
              price="$750"
              perParticipant="~$19/person for a 40-person group"
              features={HOME_EXTENDED_TRIP_FEATURES}
              ctaText="Schedule a Walkthrough"
              ctaHref="/demo"
              featured
              badge="Most Popular"
            />
            <InternationalPricingCard
              id="home-international"
              features={HOME_INTERNATIONAL_FEATURES}
              ctaText="Schedule a Walkthrough"
              ctaHref="/demo"
            />
          </div>

          <div className="text-center mt-10">
            <Link href="/pricing" className="inline-flex items-center gap-1.5 text-body-md font-medium" style={{ color: 'var(--color-primary-700)', textDecoration: 'none' }}>
              View full pricing details
              <SmallArrowIcon />
            </Link>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 767px) {
            section[aria-labelledby="pricing-preview-heading"] { padding: 48px 0 !important; }
            .pricing-featured { order: -1; }
          }
        ` }} />
      </section>

      {/* ================================================================
          SECTION 9: CATEGORY CONTRAST
          ================================================================ */}
      <section aria-labelledby="category-contrast-heading" style={{ background: 'var(--color-background)', padding: '96px 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-eyebrow" style={{ color: 'var(--color-primary-700)' }}>TRIP SAFETY PLANNING</span>
            <h2 id="category-contrast-heading" className="text-display-md mt-4 mx-auto" style={{ color: 'var(--color-foreground)', maxWidth: '32ch' }}>
              This is not travel insurance.<br className="hidden sm:block" />
              This is not trip logistics.<br className="hidden sm:block" />
              This is professional preparation.
            </h2>
            <p className="text-body-lg mt-4 mx-auto" style={{ color: 'var(--color-muted-foreground)', maxWidth: '65ch' }}>
              SafeTrekr provides something most organizations don't have: systematic safety assessment with documented preparation. Here's how professional trip planning compares to what organizations typically use.
            </p>
          </div>

          {/* Comparison Table (Desktop) */}
          <div className="hidden md:block mt-12 rounded-xl border overflow-hidden" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            {/* Header Row */}
            <div className="grid grid-cols-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="py-4 px-6" />
              <div className="py-4 px-6 text-center"><span className="text-body-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>DIY Spreadsheets</span></div>
              <div className="py-4 px-6 text-center"><span className="text-body-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>Travel Apps</span></div>
              <div className="py-4 px-6 text-center"><span className="text-body-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>Travel Insurance</span></div>
              <div className="py-4 px-6 text-center safetrekr-col"><span className="text-body-sm font-semibold" style={{ color: 'var(--color-primary-700)' }}>SafeTrekr</span></div>
            </div>
            {/* Row 1 */}
            <div className="grid grid-cols-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="py-4 px-6"><span className="text-body-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Professional safety analyst review</span></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center safetrekr-col"><CheckIcon className="w-5 h-5" strokeWidth={2.5} style={{ color: 'var(--color-primary-500)' }} /></div>
            </div>
            {/* Row 2 */}
            <div className="grid grid-cols-5 border-b" style={{ borderColor: 'var(--color-border)', background: 'rgba(231,236,238,0.35)' }}>
              <div className="py-4 px-6"><span className="text-body-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Government information sources</span></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center safetrekr-col"><CheckIcon className="w-5 h-5" strokeWidth={2.5} style={{ color: 'var(--color-primary-500)' }} /></div>
            </div>
            {/* Row 3 */}
            <div className="grid grid-cols-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="py-4 px-6"><span className="text-body-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Structured assessment methodology</span></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center safetrekr-col"><CheckIcon className="w-5 h-5" strokeWidth={2.5} style={{ color: 'var(--color-primary-500)' }} /></div>
            </div>
            {/* Row 4 */}
            <div className="grid grid-cols-5 border-b" style={{ borderColor: 'var(--color-border)', background: 'rgba(231,236,238,0.35)' }}>
              <div className="py-4 px-6"><span className="text-body-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Documented preparation</span></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center safetrekr-col"><CheckIcon className="w-5 h-5" strokeWidth={2.5} style={{ color: 'var(--color-primary-500)' }} /></div>
            </div>
            {/* Row 5 */}
            <div className="grid grid-cols-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="py-4 px-6"><span className="text-body-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Accountability records</span></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center safetrekr-col"><CheckIcon className="w-5 h-5" strokeWidth={2.5} style={{ color: 'var(--color-primary-500)' }} /></div>
            </div>
            {/* Row 6 */}
            <div className="grid grid-cols-5 border-b" style={{ borderColor: 'var(--color-border)', background: 'rgba(231,236,238,0.35)' }}>
              <div className="py-4 px-6"><span className="text-body-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Active trip awareness</span></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center"><CheckIcon className="w-5 h-5" style={{ color: 'rgba(6,26,35,0.4)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center safetrekr-col"><CheckIcon className="w-5 h-5" strokeWidth={2.5} style={{ color: 'var(--color-primary-500)' }} /></div>
            </div>
            {/* Row 7 */}
            <div className="grid grid-cols-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="py-4 px-6"><span className="text-body-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Stakeholder-ready documentation</span></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center"><span className="text-body-xs" style={{ color: 'var(--color-muted-foreground)' }}>Partial</span></div>
              <div className="py-4 px-6 flex items-center justify-center safetrekr-col"><CheckIcon className="w-5 h-5" strokeWidth={2.5} style={{ color: 'var(--color-primary-500)' }} /></div>
            </div>
            {/* Row 8 */}
            <div className="grid grid-cols-5" style={{ background: 'rgba(231,236,238,0.35)' }}>
              <div className="py-4 px-6"><span className="text-body-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Mobile field support</span></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center"><span className="text-body-xs" style={{ color: 'var(--color-muted-foreground)' }}>Partial</span></div>
              <div className="py-4 px-6 flex items-center justify-center"><DashIcon style={{ color: 'var(--color-border)' }} /></div>
              <div className="py-4 px-6 flex items-center justify-center safetrekr-col"><CheckIcon className="w-5 h-5" strokeWidth={2.5} style={{ color: 'var(--color-primary-500)' }} /></div>
            </div>
          </div>

          {/* Mobile Comparison Cards */}
          <div className="md:hidden mt-12 space-y-4">
            <div className="rounded-lg border p-4" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
              <span className="text-body-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Professional safety analyst review</span>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs" style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>-- DIY</span>
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs" style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>-- Apps</span>
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs" style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>-- Insurance</span>
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-700)' }}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  SafeTrekr
                </span>
              </div>
            </div>
            <div className="rounded-lg border p-4" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
              <span className="text-body-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Government information sources</span>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs" style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>-- DIY</span>
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs" style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>-- Apps</span>
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs" style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>-- Insurance</span>
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-700)' }}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  SafeTrekr
                </span>
              </div>
            </div>
            <div className="rounded-lg border p-4" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
              <span className="text-body-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Active trip awareness</span>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs" style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>-- DIY</span>
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: 'var(--color-card)', color: 'var(--color-foreground)', border: '1px solid var(--color-border)' }}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Apps
                </span>
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs" style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>-- Insurance</span>
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-700)' }}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  SafeTrekr
                </span>
              </div>
            </div>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 767px) {
            section[aria-labelledby="category-contrast-heading"] { padding: 48px 0 !important; }
          }
        ` }} />
      </section>

      {/* ================================================================
          SECTION 10: FINAL CTA BANNER (DARK)
          ================================================================ */}
      <section aria-labelledby="final-cta-heading" data-theme="dark" style={{ background: 'var(--color-secondary)', padding: '112px 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 id="final-cta-heading" className="text-display-md mx-auto" style={{ color: '#f7f8f8', maxWidth: '28ch' }}>
            Ready to go with a plan?
          </h2>
          <p className="text-body-lg mt-4 mx-auto" style={{ color: '#b8c3c7', maxWidth: '65ch' }}>
            See how structured trip planning works for organizations like yours.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mt-8">
            <Link href="/demo" className="inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-150" style={{ fontFamily: 'var(--font-heading)', background: '#ffffff', color: 'var(--color-secondary)', padding: '16px 32px', fontSize: 18, borderRadius: 'var(--radius-md)', textDecoration: 'none' }}>
              Schedule a Walkthrough
            </Link>
            <Link href="/resources/sample-binders" className="inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-150" style={{ fontFamily: 'var(--font-heading)', background: 'transparent', border: '1.5px solid rgba(255,255,255,0.2)', color: '#f7f8f8', padding: '16px 32px', fontSize: 18, borderRadius: 'var(--radius-md)', textDecoration: 'none' }}>
              View Sample Binder
            </Link>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 767px) {
            section[aria-labelledby="final-cta-heading"] { padding: 64px 0 !important; }
          }
        ` }} />
      </section>

      {/* ================================================================
          JSON-LD STRUCTURED DATA
          Organization schema is rendered in the root layout (layout.tsx).
          Homepage adds the SoftwareApplication + AggregateOffer schema.
          ================================================================ */}
      <JsonLd data={generateSoftwareApplicationSchema()} />
    </>
  );
}
