/**
 * SafeTrekr Homepage (/)
 *
 * Primary marketing homepage. 10 sections showcasing the platform
 * with real app screenshots, feature-specific content, and client
 * emphasis on chaperone tools, traveler safety, and team credentials.
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
  JsonLd,
  generateSoftwareApplicationSchema,
} from "@/lib/structured-data";
import {
  PricingTierCard,
  InternationalPricingCard,
} from "@/components/marketing";

export const metadata = generatePageMetadata({
  title: "Go With a Plan",
  description:
    "SafeTrekr: group travel safety with GPS participant tracking, rally point headcounts, emergency alerts with location, active weather and threat intelligence, and pre-trip safety checklists.",
  path: "/",
});

// ---------------------------------------------------------------------------
// Pricing features (reused from main homepage)
// ---------------------------------------------------------------------------

const DAY_TRIP_FEATURES = [
  "Experienced analyst review",
  "Comprehensive safety assessment",
  "Interactive digital safety binder",
  "Mobile field support access",
  "Fast delivery turnaround",
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


/** Base path prefix for static assets (needed for GitHub Pages subdirectory deployment) */
const assetPrefix = process.env.STATIC_EXPORT === "true" ? "/safeTrekr-marketing-site" : "";

/** Phone frame with a real screenshot image -- parallax on scroll via CSS */
function PhoneWithImage({ src, alt, className = "", width }: { src: string; alt: string; className?: string; width?: number }) {
  return (
    <div className={`relative phone-parallax sm:shadow-[0_25px_50px_rgba(0,0,0,0.2)] ${className}`} style={width ? { width } : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${assetPrefix}${src}`}
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
      <section aria-labelledby="hero-heading" className="relative overflow-x-hidden" style={{ background: 'var(--color-background)', paddingTop: 56, paddingBottom: 72 }}>
        <div className="hero-dot-grid" />
        <div className="hero-radial-glow" />

        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid md:grid-cols-12 gap-8 md:gap-10 lg:gap-16 items-center">
            {/* Text Column */}
            <div className="md:col-span-7 flex flex-col">
              <span className="text-eyebrow flex items-center gap-2" style={{ color: 'var(--color-primary-700)' }}>
                <Shield className="w-4 h-4" />
                TRIP SAFETY PLANNING PLATFORM
              </span>

              <h1 id="hero-heading" className="text-display-xl mt-4" style={{ color: 'var(--color-foreground)' }}>
                Every trip requires<br />
                <span className="text-primary-700">a plan.</span>
              </h1>

              <p className="text-body-lg mt-6" style={{ color: 'var(--color-muted-foreground)', maxWidth: '52ch' }}>
                SafeTrekr provides structured safety planning for group travel, professional review, clear documentation, and the accountability your organization needs. Maintain exceptional experiences while ensuring appropriate preparation is completed professionally.
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
            <div className="md:col-span-5 relative hidden md:flex items-start justify-center" style={{ minHeight: 380, paddingTop: 20 }}>
              {/* Primary phone: Chaperone Today view */}
              <div className="relative z-10">
                <PhoneWithImage
                  src="/images/for-index-2/01-today-2.png"
                  alt="SafeTrekr chaperone app showing today view with rally point alerts, weather advisory, upcoming musters, and live participant locations"
                  className="w-[180px] md:w-[180px] lg:w-[280px]"
                />
              </div>
              {/* Secondary phone: Safety & Emergency Map */}
              <div className="absolute right-0 md:right-0 lg:-right-2 top-16 md:top-12 lg:top-28 z-0" style={{ transform: 'rotate(6deg)' }}>
                <PhoneWithImage
                  src="/images/for-index-2/03-safety-2.png"
                  alt="SafeTrekr safety map showing rally points, emergency resources, hospitals, and group communication on a live map of Paris"
                  className="w-[160px] md:w-[160px] lg:w-[250px]"
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
          SECTION 3: THE CHALLENGE + MECHANISM CARDS
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
            SafeTrekr adds structure to trip planning.
          </p>

          {/* 3 Mechanism Cards */}
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Link href="/platform/analyst-review" className="card card-interactive group block" style={{ padding: 32, textDecoration: 'none' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'var(--color-primary-50)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--color-primary-700)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Professional Analyst Review</h3>
              <p className="text-body-md mt-2" style={{ color: 'var(--color-muted-foreground)', maxWidth: '45ch' }}>
                Every trip is reviewed by a trained safety analyst, from venue details to emergency contacts. Assessment by professionals, not automated scoring.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-body-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>
                Learn about the review process
                <SmallArrowIcon className="w-4 h-4 card-link-arrow" />
              </span>
            </Link>

            <Link href="/platform/risk-intelligence" className="card card-interactive group block" style={{ padding: 32, textDecoration: 'none' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'var(--color-primary-50)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--color-primary-700)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              </div>
              <h3 className="text-heading-sm" style={{ color: 'var(--color-foreground)' }}>Current Safety Information</h3>
              <p className="text-body-md mt-2" style={{ color: 'var(--color-muted-foreground)', maxWidth: '45ch' }}>
                Your review includes current information from multiple trusted sources, weather, health advisories, and regional conditions. Your analyst evaluates it, so you don&apos;t have to.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-body-sm font-medium" style={{ color: 'var(--color-primary-700)' }}>
                See how information is gathered
                <SmallArrowIcon className="w-4 h-4 card-link-arrow" />
              </span>
            </Link>

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
          SECTION 4: CHAPERONE EXPERIENCE (Dark, visual-heavy)
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
                  src="/images/for-index-2/12-direct-group.png"
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
                src="/images/for-index-2/12-direct-group.png"
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
              From trip details to field-ready safety plan, fast.
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
                Enter your destination, dates, participants, and planned activities through a guided form.
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

      {/* JSON-LD Structured Data */}
      <JsonLd data={generateSoftwareApplicationSchema()} />
    </>
  );
}
