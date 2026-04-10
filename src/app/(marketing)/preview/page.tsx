/**
 * PREVIEW: Redesigned Homepage
 * Accessible at /preview for client review.
 * 10 sections per validated plan. All iPhone mockups are gray placeholders
 * with image suggestions for what to produce.
 */

import Link from "next/link";
import {
  Shield,
  MapPin,
  Activity,
  CheckSquare,
  ClipboardCheck,
  Radio,
  Heart,
  Building2,
  GraduationCap,
  BookOpen,
} from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import {
  PricingTierCard,
  InternationalPricingCard,
} from "@/components/marketing";

export const metadata = generatePageMetadata({
  title: "Homepage Preview",
  description:
    "SafeTrekr: group travel safety with GPS participant tracking, rally point headcounts, emergency alerts with location, active weather and threat intelligence, and pre-trip safety checklists.",
  path: "/preview",
  noIndex: true,
});

// ---------------------------------------------------------------------------
// Pricing features (reused from main homepage)
// ---------------------------------------------------------------------------

const DAY_TRIP_FEATURES = [
  "Experienced analyst review",
  "Comprehensive safety assessment",
  "Interactive digital safety binder",
  "Mobile field support access",
  "Delivery in as soon as 3 days",
  "Verified documentation",
  "PDF & print export",
  "30-day post-trip access",
];

const EXTENDED_TRIP_FEATURES = [
  "Everything in Day Trip",
  "Multi-day trip support (up to 7 days)",
  "Active intelligence monitoring",
  "Tournament and conference travel",
  "Multiple venue assessment",
  "Priority analyst assignment",
  "60-day post-trip access",
];

const INTERNATIONAL_FEATURES = [
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
// Reusable components
// ---------------------------------------------------------------------------

function ArrowRightIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
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

function CheckIcon({ className = "w-5 h-5", strokeWidth = 2, style }: { className?: string; strokeWidth?: number; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}


/** Phone frame with a real screenshot image -- parallax on scroll via CSS */
function PhoneWithImage({ src, alt, className = "", width = 260 }: { src: string; alt: string; className?: string; width?: number }) {
  return (
    <div className={`relative phone-parallax sm:shadow-[0_25px_50px_rgba(0,0,0,0.2)] ${className}`} style={{ width }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-auto block"
        loading="eager"
      />
    </div>
  );
}


// ===========================================================================
// PAGE
// ===========================================================================

export default function PreviewHomePage() {
  return (
    <>
      {/* ================================================================
          SECTION 1: HERO
          ================================================================ */}
      <section aria-labelledby="hero-heading" className="relative" style={{ background: 'var(--color-background)', paddingTop: 120, paddingBottom: 96 }}>
        <div className="hero-dot-grid" />
        <div className="hero-radial-glow" />

        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Text Column */}
            <div className="lg:col-span-5 flex flex-col">
              <span className="text-eyebrow flex items-center gap-2" style={{ color: 'var(--color-primary-700)' }}>
                <Shield className="w-4 h-4" />
                BUILT BY FORMER SECRET SERVICE ADVANCE AGENTS
              </span>

              <h1 id="hero-heading" className="text-display-xl mt-4" style={{ color: 'var(--color-foreground)', maxWidth: '18ch' }}>
                You are now going with a plan.
              </h1>

              <p className="text-body-lg mt-6" style={{ color: 'var(--color-muted-foreground)', maxWidth: '52ch' }}>
                Track every participant&apos;s location, coordinate headcounts at rally points, and get instant alerts for weather, medical, or security incidents. Professional review, clear documentation, and the accountability your organization needs.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8">
                <Link href="/demo" className="inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-150 text-white text-center sm:text-left" style={{ fontFamily: 'var(--font-heading)', background: 'var(--color-primary-600)', padding: '16px 32px', fontSize: 18, borderRadius: 'var(--radius-md)', textDecoration: 'none' }}>
                  Schedule a Walkthrough
                  <ArrowRightIcon />
                </Link>
                <a href="#chaperone-experience" className="inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-150 text-center sm:text-left" style={{ fontFamily: 'var(--font-heading)', background: 'transparent', border: '1.5px solid var(--color-border)', color: 'var(--color-foreground)', padding: '16px 32px', fontSize: 18, borderRadius: 'var(--radius-md)', textDecoration: 'none' }}>
                  See the App in Action
                  <ArrowRightIcon />
                </a>
              </div>
            </div>

            {/* Visual Column: iPhone Mockups with real screenshots */}
            <div className="lg:col-span-7 relative hidden md:flex items-center justify-center" style={{ minHeight: 560 }}>
              {/* Primary phone: Chaperone Today view */}
              <div className="relative z-10">
                <PhoneWithImage
                  src="/images/for-index-2/01-today-2.png"
                  alt="SafeTrekr chaperone app showing today view with rally point alerts, weather advisory, upcoming musters, and live participant locations"
                  width={280}
                />
              </div>
              {/* Secondary phone: Safety & Emergency Map */}
              <div className="absolute -right-2 top-12 z-0" style={{ transform: 'rotate(6deg)' }}>
                <PhoneWithImage
                  src="/images/for-index-2/03-safety-2.png"
                  alt="SafeTrekr safety map showing rally points, emergency resources, hospitals, and group communication on a live map of Paris"
                  width={250}
                />
              </div>
            </div>

            {/* Mobile hero: scrollable carousel of both phones */}
            <div className="flex md:hidden phone-carousel px-2">
              <PhoneWithImage
                src="/images/for-index-2/01-today-2.png"
                alt="SafeTrekr chaperone app showing today view with alerts and live participant locations"
                width={240}
              />
              <PhoneWithImage
                src="/images/for-index-2/03-safety-2.png"
                alt="SafeTrekr safety map showing rally points, emergency resources, hospitals, and group communication"
                width={240}
              />
            </div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 767px) {
            section[aria-labelledby="hero-heading"] { padding-top: 64px !important; padding-bottom: 48px !important; }
          }
        ` }} />
      </section>

      {/* ================================================================
          SECTION 2: CREDIBILITY STRIP
          ================================================================ */}
      <section aria-label="Platform credentials" className="border-y" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)', padding: '48px 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="flex items-center gap-3 justify-center">
              <Shield className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-primary-700)' }} />
              <span className="text-body-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>Former Senior Secret Service Advance Agents</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-primary-700)' }} />
              <span className="text-body-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>Real-Time Safety Coordination</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Activity className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-primary-700)' }} />
              <span className="text-body-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>Active Intelligence Monitoring</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <CheckSquare className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-primary-700)' }} />
              <span className="text-body-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>Pre-Travel + On-Trip Checklists</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 3: CHAPERONE EXPERIENCE (Dark, visual-heavy)
          ================================================================ */}
      <section id="chaperone-experience" aria-labelledby="chaperone-heading" data-theme="dark" style={{ background: 'var(--color-secondary)', padding: '96px 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <div className="lg:col-span-5">
              <span className="text-eyebrow" style={{ color: '#6cbc8b' }}>THE CHAPERONE EXPERIENCE</span>
              <h2 id="chaperone-heading" className="text-display-md mt-4" style={{ color: '#f7f8f8', maxWidth: '24ch' }}>
                See your entire group. Coordinate with confidence.
              </h2>
              <p className="text-body-lg mt-6" style={{ color: '#b8c3c7', maxWidth: '55ch', lineHeight: 1.7 }}>
                With participant consent, chaperones see their entire group&apos;s location in real time. Verify headcounts at rally points, communicate instantly, and keep your schedule on track. Works offline in the field.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "GPS location of every participant on one map",
                  "Assembly rally point notifications with headcount",
                  "Instant group communication",
                  "Easy-to-use daily trip schedules",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckIcon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#6cbc8b' }} />
                    <span className="text-body-md" style={{ color: '#e0e5e7' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual: 3 fanned phones (desktop) */}
            <div className="lg:col-span-7 relative hidden sm:flex items-center justify-center" style={{ minHeight: 540 }}>
              <div className="absolute z-[1]" style={{ transform: 'rotate(-10deg) translateX(-160px)' }}>
                <PhoneWithImage
                  src="/images/for-index-2/07-checkins-2.png"
                  alt="SafeTrekr check-ins screen showing morning roll call in progress, 5 of 8 checked in, with pre-departure, lunch, and curfew checks scheduled"
                  width={230}
                />
              </div>
              <div className="relative z-[2]">
                <PhoneWithImage
                  src="/images/for-index-2/10-direct-group.png"
                  alt="SafeTrekr Direct Group screen showing safety map with rally points, safe houses, hospitals, and nearby points of interest across Florida"
                  width={250}
                />
              </div>
              <div className="absolute z-[1]" style={{ transform: 'rotate(10deg) translateX(160px)' }}>
                <PhoneWithImage
                  src="/images/for-index-2/02-schedule-2.png"
                  alt="SafeTrekr trip schedule showing Paris Exploration day with Breakfast, Eiffel Tower Visit, Seine River Cruise, and Free Evening"
                  width={230}
                />
              </div>
            </div>

            {/* Mobile: scrollable carousel of all 3 phones */}
            <div className="flex sm:hidden lg:col-span-7 phone-carousel px-2 mt-8">
              <PhoneWithImage
                src="/images/for-index-2/07-checkins-2.png"
                alt="SafeTrekr check-ins screen"
                width={220}
              />
              <PhoneWithImage
                src="/images/for-index-2/10-direct-group.png"
                alt="SafeTrekr Direct Group safety map"
                width={220}
              />
              <PhoneWithImage
                src="/images/for-index-2/02-schedule-2.png"
                alt="SafeTrekr trip schedule"
                width={220}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 3b: TRUST METRICS + PRODUCT UI SHOWCASE
          ================================================================ */}
      <section aria-label="Platform credentials and product preview" style={{ background: 'var(--color-background)', padding: '80px 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          {/* Product UI Cards Row */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Trip Review Progress Panel */}
            <div className="rounded-xl bg-white shadow-lg border p-5" style={{ borderColor: 'var(--color-border)' }}>
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
              <div className="w-full h-2 rounded-full" style={{ background: 'var(--color-primary-100)' }}>
                <div className="h-full rounded-full" style={{ background: 'var(--color-primary-500)', width: '85%' }} />
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-body-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>85% complete</span>
                <span className="badge badge-brand" style={{ fontSize: 10, padding: '1px 8px' }}>Trip Ready</span>
              </div>
            </div>

            {/* Evidence Binder Preview */}
            <div className="rounded-xl bg-white shadow-lg border p-5" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-eyebrow block" style={{ color: 'var(--color-muted-foreground)', fontSize: 10 }}>EVIDENCE BINDER</span>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="badge badge-brand" style={{ fontSize: 10, padding: '1px 6px' }}>Verified</span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-safety-green)' }} />
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--color-primary-500)' }} />
                  <span className="text-body-sm" style={{ color: 'var(--color-foreground)' }}>Risk assessment completed</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--color-primary-500)' }} />
                  <span className="text-body-sm" style={{ color: 'var(--color-foreground)' }}>Documentation finalized</span>
                </div>
              </div>
              <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-muted-foreground)', letterSpacing: '0.03em' }}>a3f2...c891</code>
              </div>
            </div>

            {/* Readiness Gauge */}
            <div className="rounded-xl bg-white shadow-lg border p-5 flex flex-col items-center justify-center" style={{ borderColor: 'var(--color-border)' }}>
              <svg viewBox="0 0 72 72" width={72} height={72} aria-hidden="true">
                <circle cx={36} cy={36} r={32} fill="none" stroke="#e0f1e6" strokeWidth={4} transform="rotate(-90 36 36)" />
                <circle cx={36} cy={36} r={32} fill="none" stroke="#4ca46e" strokeWidth={4} strokeLinecap="round" transform="rotate(-90 36 36)" className="gauge-arc" />
                <text x={36} y={34} textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight={600} fontSize={16} fill="#061a23">85%</text>
                <text x={36} y={48} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={8} fill="#4d5153">Trip Ready</text>
              </svg>
              <div className="flex items-center justify-center gap-1 mt-2">
                <span className="w-2 h-2 rounded-full status-pulse" style={{ background: 'var(--color-safety-green)' }} aria-hidden="true" />
                <span style={{ fontSize: 11, color: 'var(--color-muted-foreground)' }}>Active</span>
              </div>
            </div>
          </div>

          {/* Trust Metrics */}
          <div className="grid grid-cols-3 gap-6 lg:gap-8 mt-12 pt-10" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="text-center">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.75rem, 1.04rem + 1.98vw, 2.75rem)', fontWeight: 700, color: 'var(--color-foreground)', lineHeight: 1 }}>Multiple</div>
              <div className="text-eyebrow mt-2" style={{ color: 'var(--color-muted-foreground)', fontSize: 12 }}>Trusted Intel Sources</div>
            </div>
            <div className="text-center">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.75rem, 1.04rem + 1.98vw, 2.75rem)', fontWeight: 700, color: 'var(--color-foreground)', lineHeight: 1 }}>Full</div>
              <div className="text-eyebrow mt-2" style={{ color: 'var(--color-muted-foreground)', fontSize: 12 }}>Comprehensive Review</div>
            </div>
            <div className="text-center">
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 1.04rem + 1.98vw, 2.75rem)', fontWeight: 700, color: 'var(--color-foreground)', lineHeight: 1 }}>3 Day</div>
              <div className="text-eyebrow mt-2" style={{ color: 'var(--color-muted-foreground)', fontSize: 12 }}>Fast Turnaround</div>
            </div>
          </div>

          {/* Intel Source Bar */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 mt-8 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
            {['Government', 'Humanitarian', 'Regional', 'Emergency', 'Health'].map((source, i) => (
              <span key={source} className="flex items-center gap-8">
                <span style={{ fontSize: 12, color: 'var(--color-muted-foreground)', letterSpacing: '0.05em', textTransform: 'uppercase' as const, fontWeight: 500 }}>{source}</span>
                {i < 4 && <span style={{ height: 12, width: 1, background: 'var(--color-border)' }} aria-hidden="true" />}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 4: TRAVELER SAFETY
          ================================================================ */}
      <section aria-labelledby="traveler-heading" style={{ background: 'var(--color-background)', padding: '96px 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Visual: 2 phones side by side (desktop) */}
            <div className="lg:col-span-7 hidden sm:flex items-center justify-center gap-6 lg:gap-10" style={{ minHeight: 540 }}>
              <PhoneWithImage
                src="/images/for-index-2/08-help-2.png"
                alt="SafeTrekr Help and Support screen with emergency Call 911 button, emergency contacts for trip leaders and embassy, safety information, and trip packet access"
                width={250}
              />
              <PhoneWithImage
                src="/images/for-index-2/06-alerts-2.png"
                alt="SafeTrekr alerts screen showing rally point activation, weather advisory with acknowledge buttons, schedule changes, and curfew reminders"
                width={250}
              />
            </div>

            {/* Mobile: scrollable carousel of both phones */}
            <div className="flex sm:hidden lg:col-span-7 phone-carousel px-2">
              <PhoneWithImage
                src="/images/for-index-2/08-help-2.png"
                alt="SafeTrekr Help and Support screen"
                width={220}
              />
              <PhoneWithImage
                src="/images/for-index-2/06-alerts-2.png"
                alt="SafeTrekr alerts screen"
                width={220}
              />
            </div>

            {/* Text */}
            <div className="lg:col-span-5">
              <span className="text-eyebrow" style={{ color: 'var(--color-primary-700)' }}>THE TRAVELER EXPERIENCE</span>
              <h2 id="traveler-heading" className="text-display-md mt-4" style={{ color: 'var(--color-foreground)', maxWidth: '22ch' }}>
                When plans change, your chaperones know immediately.
              </h2>
              <p className="text-body-lg mt-6" style={{ color: 'var(--color-muted-foreground)', maxWidth: '55ch', lineHeight: 1.7 }}>
                Travelers can send emergency alerts to trip leaders, report medical situations, and see the nearest hospital or embassy, with their location shared automatically.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "One-tap emergency alert to trip leader with location",
                  "Medical emergency notification to chaperones",
                  "Nearest hospital, embassy, and emergency services",
                  "Incident reporting with automatic location sharing",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckIcon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-primary-500)' }} />
                    <span className="text-body-md" style={{ color: 'var(--color-foreground)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 5: EXPERT PLANNING (3 cards)
          ================================================================ */}
      <section aria-labelledby="expert-heading" style={{ background: 'var(--color-primary-50)', padding: '96px 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-eyebrow" style={{ color: 'var(--color-primary-700)' }}>EXPERT SAFETY PLANNING</span>
            <h2 id="expert-heading" className="text-display-md mt-4 mx-auto" style={{ color: 'var(--color-foreground)', maxWidth: '28ch' }}>
              Professional preparation by people who&apos;ve done it at the highest level.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {/* Card 1 */}
            <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'var(--color-primary-100)' }}>
                <ClipboardCheck className="w-6 h-6" style={{ color: 'var(--color-primary-700)' }} />
              </div>
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Expert Emergency Planning</h3>
              <p className="text-body-md mt-3" style={{ color: 'var(--color-muted-foreground)' }}>
                Every trip receives a comprehensive review by analysts with Secret Service and Special Operations backgrounds. Professional assessment, not automated scoring.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'var(--color-primary-100)' }}>
                <Radio className="w-6 h-6" style={{ color: 'var(--color-primary-700)' }} />
              </div>
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Active Intelligence Updates</h3>
              <p className="text-body-md mt-3" style={{ color: 'var(--color-muted-foreground)' }}>
                Weather disruptions, criminal activity, geopolitical events, monitored and pushed to chaperones throughout your trip. Current conditions, not last week&apos;s report.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'var(--color-primary-100)' }}>
                <CheckSquare className="w-6 h-6" style={{ color: 'var(--color-primary-700)' }} />
              </div>
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Pre-Travel and On-Trip Checklists</h3>
              <p className="text-body-md mt-3" style={{ color: 'var(--color-muted-foreground)' }}>
                Structured checklists that walk your team through every preparation step before departure and every safety protocol on the ground. Nothing gets missed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 6: HOW IT WORKS (3-step timeline)
          ================================================================ */}
      <section aria-labelledby="how-it-works-heading" style={{ background: 'var(--color-background)', padding: '96px 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-eyebrow" style={{ color: 'var(--color-primary-700)' }}>HOW IT WORKS</span>
            <h2 id="how-it-works-heading" className="text-display-md mt-4 mx-auto" style={{ color: 'var(--color-foreground)', maxWidth: '28ch' }}>
              From trip details to field-ready safety plan in 3 days.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mt-16">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold" style={{ background: 'var(--color-primary-100)', color: 'var(--color-primary-700)', fontFamily: 'var(--font-heading)', fontSize: 18 }}>1</div>
                <div className="hidden lg:block flex-1 h-0.5" style={{ background: 'var(--color-primary-200)' }} />
              </div>
              <h3 className="text-heading-md" style={{ color: 'var(--color-foreground)' }}>Share Your Trip Details</h3>
              <p className="text-body-md mt-2" style={{ color: 'var(--color-muted-foreground)' }}>
                Enter your destination, dates, participants, and planned activities through a guided form. Takes about 15 minutes.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold" style={{ background: 'var(--color-primary-100)', color: 'var(--color-primary-700)', fontFamily: 'var(--font-heading)', fontSize: 18 }}>2</div>
                <div className="hidden lg:block flex-1 h-0.5" style={{ background: 'var(--color-primary-200)' }} />
              </div>
              <h3 className="text-heading-md" style={{ color: 'var(--color-foreground)' }}>Professional Assessment</h3>
              <p className="text-body-md mt-2" style={{ color: 'var(--color-muted-foreground)' }}>
                A trained safety analyst conducts a comprehensive review of your trip using current intelligence from government and international data sources.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold" style={{ background: 'var(--color-primary-100)', color: 'var(--color-primary-700)', fontFamily: 'var(--font-heading)', fontSize: 18 }}>3</div>
                <div className="hidden lg:block flex-1 h-0.5" style={{ background: 'var(--color-primary-200)' }} />
              </div>
              <h3 className="text-heading-md" style={{ color: 'var(--color-foreground)' }}>Go With Your Plan</h3>
              <p className="text-body-md mt-2" style={{ color: 'var(--color-muted-foreground)' }}>
                Receive your complete safety binder, activate chaperone and traveler apps, and travel with real-time monitoring and emergency tools.
              </p>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <PhoneWithImage
                src="/images/for-index-2/11-checklist.png"
                alt="SafeTrekr safety checklists screen showing password security checklist with 4 of 12 items completed, including two-factor auth and strong passwords"
                width={220}
              />
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/how-it-works" className="inline-flex items-center gap-1.5 text-body-md font-medium" style={{ color: 'var(--color-primary-700)', textDecoration: 'none' }}>
              See the full process
              <SmallArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 7: SEGMENT ROUTING
          ================================================================ */}
      <section aria-labelledby="segment-heading" style={{ background: 'var(--color-card)', padding: '96px 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-eyebrow" style={{ color: 'var(--color-primary-700)' }}>BUILT FOR YOUR ORGANIZATION</span>
            <h2 id="segment-heading" className="text-display-md mt-4 mx-auto" style={{ color: 'var(--color-foreground)', maxWidth: '28ch' }}>
              Built for the organizations that need it most.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <Link href="/solutions/k12" className="card card-interactive group block" style={{ padding: 24, textDecoration: 'none' }}>
              <GraduationCap className="w-8 h-8 mb-4" style={{ color: 'var(--color-primary-700)' }} />
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>K-12 Schools and Districts</h3>
              <p className="text-body-sm mt-2" style={{ color: 'var(--color-muted-foreground)' }}>
                Real-time student location for every chaperone. Rally point headcounts. Share trip status with parents. Documentation that demonstrates due diligence.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-body-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>Learn more <SmallArrowIcon className="w-4 h-4 card-link-arrow" /></span>
            </Link>

            <Link href="/solutions/higher-education" className="card card-interactive group block" style={{ padding: 24, textDecoration: 'none' }}>
              <BookOpen className="w-8 h-8 mb-4" style={{ color: 'var(--color-primary-700)' }} />
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Higher Education</h3>
              <p className="text-body-sm mt-2" style={{ color: 'var(--color-muted-foreground)' }}>
                Study abroad and faculty travel with active intelligence monitoring. Professional preparation for your global educational mission.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-body-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>Learn more <SmallArrowIcon className="w-4 h-4 card-link-arrow" /></span>
            </Link>

            <Link href="/solutions/churches" className="card card-interactive group block" style={{ padding: 24, textDecoration: 'none' }}>
              <Heart className="w-8 h-8 mb-4" style={{ color: 'var(--color-primary-700)' }} />
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Churches and Mission Organizations</h3>
              <p className="text-body-sm mt-2" style={{ color: 'var(--color-muted-foreground)' }}>
                Rally point coordination for mission teams. Emergency planning that honors your calling. Simple tools for volunteer leaders.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-body-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>Learn more <SmallArrowIcon className="w-4 h-4 card-link-arrow" /></span>
            </Link>

            <Link href="/solutions/corporate" className="card card-interactive group block" style={{ padding: 24, textDecoration: 'none' }}>
              <Building2 className="w-8 h-8 mb-4" style={{ color: 'var(--color-primary-700)' }} />
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Corporate and Professional Travel</h3>
              <p className="text-body-sm mt-2" style={{ color: 'var(--color-muted-foreground)' }}>
                Active intelligence for business travel. Duty of care documentation. Incident alerts that reach the right people instantly.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-body-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>Learn more <SmallArrowIcon className="w-4 h-4 card-link-arrow" /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 8: PRICING PREVIEW
          ================================================================ */}
      <section aria-labelledby="pricing-heading" style={{ background: 'var(--color-background)', padding: '96px 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-eyebrow" style={{ color: 'var(--color-primary-700)' }}>PRICING</span>
            <h2 id="pricing-heading" className="text-display-md mt-4 mx-auto" style={{ color: 'var(--color-foreground)', maxWidth: '28ch' }}>
              Professional trip assessment. Starting at $15 per participant.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-12 items-start">
            <PricingTierCard id="prev-day" tierName="Day Trip" price="$450" perParticipant="~$15/person for a 30-person group" features={DAY_TRIP_FEATURES} ctaText="Schedule a Walkthrough" ctaHref="/demo" />
            <PricingTierCard id="prev-ext" tierName="Extended Trip" price="$750" perParticipant="~$19/person for a 40-person group" features={EXTENDED_TRIP_FEATURES} ctaText="Schedule a Walkthrough" ctaHref="/demo" featured badge="Most Popular" />
            <InternationalPricingCard id="prev-intl" features={INTERNATIONAL_FEATURES} ctaText="Schedule a Walkthrough" ctaHref="/demo" />
          </div>

          <div className="text-center mt-10">
            <Link href="/pricing" className="inline-flex items-center gap-1.5 text-body-md font-medium" style={{ color: 'var(--color-primary-700)', textDecoration: 'none' }}>
              View full pricing details <SmallArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 9: COMPARISON TABLE
          ================================================================ */}
      <section aria-labelledby="compare-heading" style={{ background: 'var(--color-card)', padding: '96px 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-eyebrow" style={{ color: 'var(--color-primary-700)' }}>WHY SAFETREKR</span>
            <h2 id="compare-heading" className="text-display-md mt-4 mx-auto" style={{ color: 'var(--color-foreground)', maxWidth: '32ch' }}>
              This is not travel insurance. This is professional protection.
            </h2>
          </div>

          {/* Desktop comparison */}
          <div className="hidden md:block mt-12 rounded-xl border overflow-hidden" style={{ background: 'white', borderColor: 'var(--color-border)' }}>
            {/* Header */}
            <div className="grid grid-cols-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="py-4 px-6" />
              <div className="py-4 px-6 text-center" style={{ background: 'var(--color-primary-50)' }}><span className="text-body-sm font-semibold" style={{ color: 'var(--color-primary-700)' }}>SafeTrekr</span></div>
              <div className="py-4 px-6 text-center"><span className="text-body-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>DIY Spreadsheets</span></div>
              <div className="py-4 px-6 text-center"><span className="text-body-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>Travel Apps</span></div>
              <div className="py-4 px-6 text-center"><span className="text-body-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>Travel Insurance</span></div>
            </div>
            {/* Rows */}
            {([
              { feature: "Chaperone geolocation of participants", diy: "-", apps: "Partial", ins: "-" },
              { feature: "Rally point notifications with headcount", diy: "-", apps: "-", ins: "-" },
              { feature: "Emergency alerts with location to trip leader", diy: "-", apps: "-", ins: "-" },
              { feature: "Active intelligence (weather, criminal, geopolitical)", diy: "-", apps: "-", ins: "-" },
              { feature: "Pre-travel and on-trip safety checklists", diy: "-", apps: "Partial", ins: "-" },
              { feature: "Professional analyst safety review", diy: "-", apps: "-", ins: "-" },
              { feature: "Medical emergency + nearest services locator", diy: "-", apps: "Partial", ins: "-" },
              { feature: "Post-trip documentation and compliance records", diy: "-", apps: "-", ins: "Partial" },
            ] as Array<{ feature: string; diy: string; apps: string; ins: string }>).map((row, i) => (
              <div key={row.feature} className="grid grid-cols-5 border-b" style={{ borderColor: 'var(--color-border)', background: i % 2 === 1 ? 'rgba(231,236,238,0.35)' : 'transparent' }}>
                <div className="py-4 px-6"><span className="text-body-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{row.feature}</span></div>
                <div className="py-4 px-6 flex items-center justify-center" style={{ background: 'var(--color-primary-50)' }}>
                  <CheckIcon className="w-5 h-5" strokeWidth={2.5} style={{ color: 'var(--color-primary-500)' }} />
                </div>
                <div className="py-4 px-6 flex items-center justify-center">
                  {row.diy === "Partial" ? <span className="text-body-xs text-muted-foreground">Partial</span> : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" /></svg>}
                </div>
                <div className="py-4 px-6 flex items-center justify-center">
                  {row.apps === "Partial" ? <span className="text-body-xs text-muted-foreground">Partial</span> : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" /></svg>}
                </div>
                <div className="py-4 px-6 flex items-center justify-center">
                  {row.ins === "Partial" ? <span className="text-body-xs text-muted-foreground">Partial</span> : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" /></svg>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 10: FINAL CTA
          ================================================================ */}
      <section aria-labelledby="final-cta-heading" data-theme="dark" style={{ background: 'var(--color-secondary)', padding: '112px 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 id="final-cta-heading" className="text-display-md mx-auto" style={{ color: '#f7f8f8', maxWidth: '28ch' }}>
            You are now going with a plan.
          </h2>
          <p className="text-body-lg mt-4 mx-auto" style={{ color: '#b8c3c7', maxWidth: '65ch' }}>
            See how SafeTrekr gives your chaperones real-time visibility and your travelers instant access to help.
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
      </section>
    </>
  );
}
