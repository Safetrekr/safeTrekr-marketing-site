/**
 * ST-893: Compliance Guide Pages (/compliance/[slug])
 *
 * Regulation-specific compliance guide pages with long-form educational
 * content (1500--2500 words each). Three guides at launch:
 *   - /compliance/ferpa
 *   - /compliance/clery-act
 *   - /compliance/duty-of-care
 *
 * Each guide follows a consistent content structure:
 *   1. What is [regulation] -- plain-language explanation
 *   2. Who does it apply to -- affected organizations
 *   3. Key requirements -- numbered compliance requirements
 *   4. How SafeTrekr helps -- features mapped to requirements
 *   5. FAQ section -- 4--6 regulation-specific questions
 *   6. Links to relevant segment page
 *   7. CTA to demo with segment pre-selected
 *
 * JSON-LD: Article + FAQPage + BreadcrumbList structured data.
 * Content is stored as inline const data for simplicity (no MDX files).
 *
 * @see src/app/(marketing)/legal/privacy/page.tsx -- long-form content layout
 * @see src/lib/structured-data.tsx -- JSON-LD generators
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Shield } from "lucide-react";

import { generatePageMetadata, type PageMetadataOptions } from "@/lib/metadata";
import {
  JsonLd,
  generateArticleSchema,
  type FAQItem,
} from "@/lib/structured-data";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { SectionContainer } from "@/components/layout/section-container";
import { Container } from "@/components/layout/container";
import { Eyebrow, FAQSection, CTABand } from "@/components/marketing";

// ---------------------------------------------------------------------------
// Guide Data Types
// ---------------------------------------------------------------------------

interface ComplianceGuide {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  datePublished: string;
  dateModified: string;
  readingTime: string;
  segmentLink: { label: string; href: string };
  demoHref: string;
  ctaHeadline: string;
  ctaBody: string;
  faqs: FAQItem[];
  wordCount: number;
}

// ---------------------------------------------------------------------------
// Guide Metadata
// ---------------------------------------------------------------------------

const GUIDES: Record<string, ComplianceGuide> = {
  ferpa: {
    slug: "ferpa",
    title: "FERPA Compliance for Student Travel",
    description:
      "Understand FERPA requirements for student travel programs. Learn how to protect student education records during field trips and off-campus activities while staying fully compliant.",
    eyebrow: "Compliance Guide",
    datePublished: "2026-03-10",
    dateModified: "2026-03-10",
    readingTime: "10 min read",
    segmentLink: { label: "K-12 Schools & Districts", href: "/solutions/k12" },
    demoHref: "/demo?segment=k12",
    ctaHeadline: "Stay FERPA-compliant on every field trip",
    ctaBody:
      "See how SafeTrekr helps K-12 districts protect student records while streamlining trip safety documentation.",
    wordCount: 2200,
    faqs: [
      {
        question:
          "Does FERPA apply to field trips and off-campus student travel?",
        answer:
          "Yes. FERPA protects student education records regardless of where they are accessed or used. When schools organize field trips, any student data collected, stored, or shared as part of trip planning -- including emergency contacts, medical information, IEP accommodations, and attendance records -- falls under FERPA protection. Schools must ensure that all vendors and third parties who handle this data comply with FERPA requirements.",
      },
      {
        question:
          "Can schools share student information with a travel safety vendor like SafeTrekr?",
        answer:
          "Schools can share student information with vendors who qualify under FERPA's 'school official' exception, provided the vendor has a legitimate educational interest and the school maintains direct control over how the data is used. SafeTrekr operates under this exception and signs a Data Processing Agreement (DPA) with every district. Importantly, SafeTrekr's safety binder system is designed to minimize student data collection -- safety analyses focus on destinations and routes, not individual student records.",
      },
      {
        question:
          "What happens if a school district violates FERPA during a field trip?",
        answer:
          "FERPA violations can result in the loss of federal funding, which represents a significant financial risk for districts. The U.S. Department of Education's Family Policy Compliance Office investigates complaints and can require corrective action. Beyond federal penalties, FERPA violations erode parent trust and can lead to costly litigation. Districts should document their data handling procedures for every trip to demonstrate compliance.",
      },
      {
        question:
          "Does SafeTrekr store individual student names or personal identifiers?",
        answer:
          "No. SafeTrekr's safety binder system is designed around destination and route risk analysis, not individual student tracking. Safety binders evaluate locations, transportation routes, nearby hospitals, weather risks, and local safety conditions. The platform does not require or store individual student names, grades, medical records, or other personally identifiable information covered by FERPA.",
      },
      {
        question:
          "How should schools handle emergency contact information during travel?",
        answer:
          "Emergency contact information used during travel is protected under FERPA. Schools should limit access to this data to authorized personnel on a need-to-know basis, store it securely (encrypted digital formats are preferred over paper lists), and destroy or return it after the trip concludes. SafeTrekr recommends that schools maintain emergency contacts in their own student information system rather than sharing them with third-party platforms.",
      },
    ],
  },

  "clery-act": {
    slug: "clery-act",
    title: "Clery Act & Campus Travel Safety",
    description:
      "Learn how the Clery Act applies to university-sponsored travel and study abroad programs. Understand reporting obligations, campus security authority roles, and compliance strategies.",
    eyebrow: "Compliance Guide",
    datePublished: "2026-03-12",
    dateModified: "2026-03-12",
    readingTime: "11 min read",
    segmentLink: {
      label: "Higher Education",
      href: "/solutions/higher-education",
    },
    demoHref: "/demo?segment=higher-education",
    ctaHeadline: "Clery-compliant travel starts with better data",
    ctaBody:
      "See how SafeTrekr helps universities manage travel risk documentation and meet Clery Act reporting requirements for off-campus programs.",
    wordCount: 2400,
    faqs: [
      {
        question:
          "Does the Clery Act apply to university-sponsored travel and study abroad?",
        answer:
          "Yes. The Clery Act requires institutions to report crimes that occur on campus, on public property adjacent to campus, and at non-campus properties that the institution owns, controls, or repeatedly uses for educational purposes. Study abroad program locations, field research sites, and recurring off-campus trip destinations can qualify as non-campus property, triggering Clery reporting obligations for incidents that occur at those locations.",
      },
      {
        question: "What is a Campus Security Authority (CSA) under the Clery Act?",
        answer:
          "A Campus Security Authority is any official who has significant responsibility for student and campus activities. This includes deans, athletic directors, resident advisors, faculty advisors, and -- critically for travel -- trip coordinators and study abroad program directors. CSAs are required to report certain crimes to the institution's Clery compliance office. Staff who lead or organize university-sponsored travel should receive CSA training so they understand their reporting obligations.",
      },
      {
        question:
          "What crimes must be reported under the Clery Act during university travel?",
        answer:
          "The Clery Act requires reporting of specific crime categories including murder, sexual assault, robbery, aggravated assault, burglary, motor vehicle theft, arson, domestic violence, dating violence, stalking, and hate crimes. If any of these crimes occur at a location that qualifies as non-campus property -- including recurring travel destinations -- the institution must include them in its Annual Security Report and may need to issue timely warnings.",
      },
      {
        question:
          "How does SafeTrekr help universities with Clery Act compliance?",
        answer:
          "SafeTrekr helps universities by providing documented risk assessments for every travel destination, which demonstrates institutional due diligence. Safety binders include crime data analysis for destination areas, emergency protocol documentation, and local emergency service information. This documentation creates an auditable trail showing that the institution assessed and communicated risks before travel occurred -- a key element of Clery compliance and institutional duty of care.",
      },
      {
        question:
          "What are the penalties for Clery Act non-compliance?",
        answer:
          "The U.S. Department of Education can fine institutions up to $69,733 per violation (adjusted annually for inflation). In severe cases, institutions can be suspended or terminated from federal financial aid programs. Beyond federal penalties, Clery violations often result in negative media coverage, enrollment declines, and civil litigation from affected students and families. Several universities have faced multi-million dollar fines for systemic reporting failures.",
      },
      {
        question:
          "Does the Clery Act require pre-travel risk assessment?",
        answer:
          "While the Clery Act itself focuses on crime reporting rather than pre-travel risk assessment, the Department of Education has made clear that institutions must have policies and procedures to protect campus safety -- which courts have interpreted to include reasonable precautions for university-sponsored travel. Pre-travel risk assessment is considered best practice and is effectively required by institutional duty of care obligations that complement Clery requirements.",
      },
    ],
  },

  "duty-of-care": {
    slug: "duty-of-care",
    title: "Duty of Care: What Organizations Need to Know",
    description:
      "Understand your organization's duty of care obligations for group travel. Learn the legal framework, key requirements, and practical steps to protect travelers and reduce liability.",
    eyebrow: "Compliance Guide",
    datePublished: "2026-03-15",
    dateModified: "2026-03-15",
    readingTime: "12 min read",
    segmentLink: {
      label: "All Solutions",
      href: "/solutions",
    },
    demoHref: "/demo",
    ctaHeadline: "Demonstrate duty of care on every trip",
    ctaBody:
      "See how SafeTrekr provides the documentation and risk intelligence organizations need to fulfill their duty of care obligations.",
    wordCount: 2500,
    faqs: [
      {
        question: "What is duty of care in the context of group travel?",
        answer:
          "Duty of care is the legal obligation an organization has to take reasonable steps to protect the health, safety, and well-being of people in its care. For group travel, this means the organization must assess risks at the destination, communicate those risks to travelers, implement safety measures, have emergency response plans, and maintain documentation proving these steps were taken. The standard is 'reasonableness' -- not perfection, but demonstrable diligence.",
      },
      {
        question:
          "Which organizations have a duty of care for group travel?",
        answer:
          "Any organization that sponsors, organizes, or facilitates group travel has a duty of care to the travelers. This includes K-12 school districts (field trips), universities (study abroad, athletic travel, research trips), churches and faith-based organizations (mission trips, retreats), corporations (business travel, team offsites), youth organizations (camps, competitions), and nonprofits (service trips, conferences). The duty applies regardless of whether travelers are employees, students, volunteers, or members.",
      },
      {
        question:
          "How is duty of care different from legal compliance like FERPA or the Clery Act?",
        answer:
          "FERPA, the Clery Act, and similar regulations are specific statutory requirements with defined rules and penalties. Duty of care is a broader common-law legal principle that applies to all organizations regardless of specific regulations. Think of it this way: FERPA tells you exactly what to do with student records, while duty of care asks whether you took reasonable steps to keep people safe. An organization can be fully compliant with FERPA and the Clery Act but still fail its duty of care if it did not assess destination risks or prepare emergency plans.",
      },
      {
        question:
          "What documentation do I need to demonstrate duty of care?",
        answer:
          "Organizations should maintain pre-trip risk assessments for each destination, documentation of safety measures implemented, communication records showing risks were disclosed to travelers and guardians, emergency response plans and local emergency contacts, insurance coverage verification, staff training records, and post-trip incident reports if applicable. The key principle is that if it is not documented, it did not happen -- in a legal proceeding, organizations must be able to demonstrate the precautions they took.",
      },
      {
        question:
          "What happens if an organization fails its duty of care?",
        answer:
          "Failure to meet duty of care obligations exposes organizations to negligence lawsuits, where plaintiffs must show the organization had a duty, breached that duty, and the breach caused harm. Damages can include medical expenses, pain and suffering, lost wages, and punitive damages in cases of gross negligence. For schools and churches, jury awards often exceed insurance coverage. Beyond financial liability, duty of care failures damage organizational reputation and erode trust with families, congregations, and communities.",
      },
      {
        question:
          "Does SafeTrekr replace the need for travel insurance?",
        answer:
          "No. SafeTrekr and travel insurance serve complementary but different purposes. SafeTrekr provides pre-trip risk intelligence, safety documentation, and compliance evidence -- it helps organizations prevent incidents and prove they took reasonable precautions. Travel insurance provides financial protection after an incident occurs, covering medical expenses, evacuation, and trip cancellation. Organizations should have both: SafeTrekr for proactive risk management and documentation, and appropriate insurance for financial protection.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Static Params
// ---------------------------------------------------------------------------

export function generateStaticParams(): { slug: string }[] {
  return Object.keys(GUIDES).map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// Dynamic Metadata
// ---------------------------------------------------------------------------

interface ComplianceGuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ComplianceGuidePageProps) {
  const { slug } = await params;
  const guide = GUIDES[slug];
  if (!guide) return {};

  const options: PageMetadataOptions = {
    title: guide.title,
    description: guide.description,
    path: `/compliance/${slug}`,
  };

  return generatePageMetadata(options);
}

// ---------------------------------------------------------------------------
// Article Content Components
// ---------------------------------------------------------------------------

function FerpaContent() {
  return (
    <>
      {/* 1. What is FERPA */}
      <h2 id="what-is-ferpa" className="scroll-mt-24">
        What Is FERPA?
      </h2>
      <p>
        The Family Educational Rights and Privacy Act (FERPA) is a federal law
        enacted in 1974 that protects the privacy of student education records.
        Sometimes called the Buckley Amendment, FERPA gives parents and eligible
        students (those 18 and older or enrolled in postsecondary education)
        specific rights over their education records and limits how schools can
        share that information.
      </p>
      <p>
        At its core, FERPA establishes two fundamental principles. First,
        parents and eligible students have the right to inspect and review
        education records maintained by the school. Second, schools must obtain
        written consent before disclosing personally identifiable information
        (PII) from education records, with certain narrowly defined exceptions.
      </p>
      <p>
        FERPA applies to all educational institutions that receive federal
        funding -- which includes virtually every public school district and
        most colleges and universities in the United States. Private schools
        that do not receive federal funds are generally exempt, though many
        voluntarily follow FERPA principles as a best practice.
      </p>
      <p>
        For organizations that manage student travel, FERPA is particularly
        relevant because trip planning often involves collecting and sharing
        student data such as emergency contacts, medical information, behavioral
        accommodations, and attendance records -- all of which qualify as
        protected education records.
      </p>

      <hr />

      {/* 2. Who does FERPA apply to */}
      <h2 id="who-does-ferpa-apply-to" className="scroll-mt-24">
        Who Does FERPA Apply To?
      </h2>
      <p>
        FERPA applies to any educational institution that receives funding from
        the U.S. Department of Education. In practice, this means:
      </p>
      <ul>
        <li>
          <strong>Public K-12 school districts</strong> -- every public
          elementary, middle, and high school in the United States
        </li>
        <li>
          <strong>Charter schools</strong> -- publicly funded charter schools
          that receive federal education dollars
        </li>
        <li>
          <strong>Public universities and colleges</strong> -- state and
          community colleges, public research universities
        </li>
        <li>
          <strong>Private postsecondary institutions</strong> -- most private
          colleges and universities that participate in federal student aid
          programs (Title IV)
        </li>
        <li>
          <strong>State education agencies</strong> -- departments of education
          and related agencies that administer federal education programs
        </li>
      </ul>
      <p>
        FERPA also indirectly affects third-party service providers who handle
        student data on behalf of schools. Vendors, consultants, and contractors
        who access student records must comply with FERPA requirements, typically
        through written agreements that define the scope and purpose of data
        access.
      </p>
      <blockquote>
        If your organization manages field trips for a public school district or
        a federally funded institution, FERPA governs how you handle student
        data throughout the trip planning and execution process.
      </blockquote>

      <hr />

      {/* 3. Key requirements */}
      <h2 id="key-requirements" className="scroll-mt-24">
        Key FERPA Requirements for Student Travel
      </h2>
      <p>
        When schools organize off-campus travel, several FERPA requirements
        become directly relevant. Understanding these requirements is essential
        for trip coordinators, administrators, and any third-party vendors
        involved in the process.
      </p>
      <ol>
        <li>
          <strong>Consent before disclosure.</strong> Schools must obtain
          written parental consent (or consent from eligible students) before
          sharing personally identifiable information from education records
          with third parties. This includes sharing student lists, emergency
          contacts, or medical information with transportation companies, venue
          coordinators, or travel safety platforms.
        </li>
        <li>
          <strong>Legitimate educational interest exception.</strong> Schools
          can share student records without consent with &ldquo;school
          officials&rdquo; who have a legitimate educational interest. Vendors
          who provide services that the school would otherwise perform can
          qualify under this exception, but only if there is a written
          agreement in place that specifies the data to be shared, the purpose
          of access, and confidentiality requirements.
        </li>
        <li>
          <strong>Data minimization.</strong> Although FERPA does not use the
          term &ldquo;data minimization&rdquo; explicitly, the principle is
          embedded in the law. Schools should share only the minimum student
          data necessary for the intended purpose. For field trips, this means
          sharing emergency contacts with chaperones but not sharing academic
          records, behavioral reports, or other unrelated information.
        </li>
        <li>
          <strong>Record of disclosures.</strong> Schools must maintain a
          record of each request for access to and each disclosure of
          personally identifiable information from education records. This
          audit trail must be available to parents and eligible students upon
          request. The record of disclosure is often overlooked in trip
          planning but is a critical compliance requirement.
        </li>
        <li>
          <strong>Secure storage and transmission.</strong> While FERPA does
          not prescribe specific technical security measures, the Department of
          Education expects schools to use reasonable methods to protect student
          data from unauthorized access. For travel purposes, this means
          encrypted digital files are preferable to paper rosters, and shared
          documents should be access-controlled rather than distributed via
          open email.
        </li>
        <li>
          <strong>Directory information exceptions.</strong> Schools may
          designate certain information as &ldquo;directory information&rdquo;
          (such as name, grade level, and participation in activities) that can
          be shared without consent, provided parents have been notified and
          given the opportunity to opt out. However, best practice for travel
          is to treat all student information as protected, even if it
          technically qualifies as directory information.
        </li>
        <li>
          <strong>Data retention and destruction.</strong> Schools and their
          vendors must establish clear policies for how long student data is
          retained after a trip concludes and how it is destroyed. Student
          data collected solely for trip management should not be retained
          indefinitely by third-party vendors.
        </li>
      </ol>

      <hr />

      {/* 4. How SafeTrekr helps */}
      <h2 id="how-safetrekr-helps" className="scroll-mt-24">
        How SafeTrekr Helps Schools Stay FERPA-Compliant
      </h2>
      <p>
        SafeTrekr was designed with student privacy as a foundational principle.
        Our approach to travel safety deliberately minimizes the need for
        student data, so schools can get comprehensive risk intelligence without
        creating FERPA compliance risks.
      </p>
      <ul>
        <li>
          <strong>Destination-focused analysis, not student tracking.</strong>{" "}
          SafeTrekr&apos;s safety binders analyze destinations, routes, and
          environmental conditions -- not individual students. Schools receive
          detailed risk assessments without ever uploading student rosters,
          medical records, or personally identifiable information to the
          platform.
        </li>
        <li>
          <strong>Data Processing Agreement (DPA) with every district.</strong>{" "}
          SafeTrekr executes a formal DPA with each school district that
          specifies exactly what data (if any) is shared, how it is protected,
          and when it is deleted. The DPA satisfies FERPA&apos;s requirement for
          a written agreement with school officials who access student records.
        </li>
        <li>
          <strong>No student PII required.</strong> SafeTrekr does not require
          student names, grades, emergency contacts, medical information, or
          any other personally identifiable information to generate safety
          binders. Trip coordinators enter a destination, travel dates, and
          group size -- nothing more.
        </li>
        <li>
          <strong>Audit-ready documentation.</strong> Every safety binder
          includes a timestamped record of when it was created, what data
          sources were consulted, and which analyst reviewed the assessment.
          This documentation supports the district&apos;s broader compliance
          record by showing that safety due diligence was performed.
        </li>
        <li>
          <strong>Encryption and access controls.</strong> All data in the
          SafeTrekr platform is encrypted in transit (TLS 1.2+) and at rest
          (AES-256). Access is controlled through role-based permissions, so
          only authorized district personnel can view safety binders and trip
          information.
        </li>
        <li>
          <strong>Clear data retention policies.</strong> SafeTrekr retains
          safety binder data for 3 years after the trip date to support
          compliance documentation needs, then permanently deletes it.
          Districts can request earlier deletion at any time.
        </li>
      </ul>
      <p>
        By keeping student data out of the platform entirely, SafeTrekr
        eliminates the most common FERPA compliance risks associated with
        third-party travel vendors. Schools get the safety intelligence they
        need, and student privacy remains protected.
      </p>
      <p>
        Learn more about how SafeTrekr serves{" "}
        <Link href="/solutions/k12">K-12 schools and districts</Link>, or{" "}
        <Link href="/demo?segment=k12">request a demo</Link> to see our
        FERPA-friendly approach in action.
      </p>
    </>
  );
}

function CleryActContent() {
  return (
    <>
      {/* 1. What is the Clery Act */}
      <h2 id="what-is-clery-act" className="scroll-mt-24">
        What Is the Clery Act?
      </h2>
      <p>
        The Jeanne Clery Disclosure of Campus Security Policy and Campus Crime
        Statistics Act -- commonly known as the Clery Act -- is a federal law
        that requires colleges and universities participating in federal
        financial aid programs to disclose information about crime on and around
        their campuses. Originally enacted in 1990 and significantly expanded
        by the Violence Against Women Reauthorization Act (VAWA) in 2013, the
        Clery Act is named after Jeanne Clery, a Lehigh University student who
        was assaulted and murdered in her campus residence hall in 1986.
      </p>
      <p>
        The law&apos;s central requirement is transparency: institutions must
        publish an Annual Security Report (ASR) containing three years of
        campus crime statistics, security policies, and crime prevention
        program descriptions. They must also issue timely warnings when crimes
        that pose an ongoing threat to students and employees occur.
      </p>
      <p>
        While the Clery Act is most commonly associated with on-campus safety,
        its geographic scope extends beyond the physical campus. Institutions
        must report crimes occurring on campus, on public property immediately
        adjacent to campus, and at &ldquo;non-campus&rdquo; properties that the
        institution owns, controls, or uses repeatedly for educational
        purposes. This last category is where university-sponsored travel and
        study abroad programs become directly relevant.
      </p>

      <hr />

      {/* 2. Who does it apply to */}
      <h2 id="who-does-clery-apply-to" className="scroll-mt-24">
        Who Does the Clery Act Apply To?
      </h2>
      <p>
        The Clery Act applies to all postsecondary institutions that
        participate in federal student financial aid programs under Title IV of
        the Higher Education Act. This includes:
      </p>
      <ul>
        <li>
          <strong>Public and private universities</strong> -- four-year
          research universities, liberal arts colleges, and comprehensive
          universities
        </li>
        <li>
          <strong>Community colleges</strong> -- two-year public institutions
          with federal financial aid eligibility
        </li>
        <li>
          <strong>Professional and graduate schools</strong> -- medical
          schools, law schools, and graduate programs
        </li>
        <li>
          <strong>Vocational and trade schools</strong> -- career and
          technical institutions participating in Title IV
        </li>
        <li>
          <strong>Study abroad program partners</strong> -- foreign
          institutions or facilities where the U.S. institution maintains
          direct organizational or supervisory control
        </li>
      </ul>
      <p>
        Within these institutions, the Clery Act creates specific obligations
        for Campus Security Authorities (CSAs) -- officials who have
        significant responsibility for student and campus activities. Faculty
        advisors, athletic directors, study abroad coordinators, and trip
        leaders all typically qualify as CSAs and must report certain crimes
        to the institution&apos;s Clery compliance office.
      </p>
      <blockquote>
        If your university organizes study abroad programs, athletic travel,
        research field trips, or recurring off-campus educational activities,
        the Clery Act likely requires crime reporting for those locations and
        CSA training for the staff who manage them.
      </blockquote>

      <hr />

      {/* 3. Key requirements */}
      <h2 id="key-requirements" className="scroll-mt-24">
        Key Clery Act Requirements for University Travel
      </h2>
      <p>
        University-sponsored travel introduces specific Clery Act compliance
        obligations that many institutions underestimate. The following
        requirements are particularly relevant to travel risk management.
      </p>
      <ol>
        <li>
          <strong>Non-campus property identification.</strong> Institutions must
          identify all locations that qualify as &ldquo;non-campus
          property&rdquo; under the Clery Act definition. For travel, this
          includes any property the institution owns, rents, or uses
          &ldquo;in direct support of, or in relation to, the institution&apos;s
          educational purposes&rdquo; and that is &ldquo;frequently used by
          students.&rdquo; Recurring study abroad sites, athletic facilities,
          and research stations can all qualify.
        </li>
        <li>
          <strong>Crime statistics collection and reporting.</strong> For each
          identified non-campus property, the institution must make a good-faith
          effort to collect crime statistics from local law enforcement and
          include them in the Annual Security Report. This applies to Clery
          geography that may span multiple countries and jurisdictions.
        </li>
        <li>
          <strong>Campus Security Authority (CSA) designation and training.</strong>{" "}
          Staff who organize or lead university travel often qualify as CSAs
          by virtue of their role. These individuals must understand their
          obligation to report specific crimes (murder, sexual assault,
          robbery, aggravated assault, burglary, motor vehicle theft, arson,
          domestic violence, dating violence, and stalking) to the
          institution&apos;s Clery compliance office.
        </li>
        <li>
          <strong>Timely warning obligations.</strong> If a Clery-reportable
          crime occurs at a non-campus location and poses an ongoing threat to
          the campus community, the institution must issue a timely warning.
          For travel programs, this may require communication protocols that
          enable rapid notification across time zones and international
          boundaries.
        </li>
        <li>
          <strong>Security policies for travel programs.</strong> The
          institution&apos;s Annual Security Report must describe its security
          policies, including those applicable to off-campus programs. This
          includes travel safety assessment procedures, emergency protocols,
          and the process for reporting crimes at off-campus locations.
        </li>
        <li>
          <strong>Emergency response and notification.</strong> Institutions
          must have procedures for responding to significant emergencies or
          dangerous situations, including those affecting students traveling
          off campus. These procedures must be tested at least annually, and
          the results must be documented and made publicly available.
        </li>
        <li>
          <strong>Daily crime log.</strong> Institutions with campus police or
          security departments must maintain a public crime log that includes
          crimes reported at non-campus locations. Entries must be made
          within two business days of the report.
        </li>
      </ol>

      <hr />

      {/* 4. How SafeTrekr helps */}
      <h2 id="how-safetrekr-helps" className="scroll-mt-24">
        How SafeTrekr Helps Universities Meet Clery Act Requirements
      </h2>
      <p>
        SafeTrekr provides the destination intelligence and documentation
        infrastructure that universities need to meet their Clery Act
        obligations for off-campus programs.
      </p>
      <ul>
        <li>
          <strong>Destination crime data analysis.</strong> Every SafeTrekr
          safety binder includes analysis of crime statistics at and around
          the destination, drawn from law enforcement databases, government
          sources, and risk intelligence feeds. This supports the
          institution&apos;s obligation to collect crime data for non-campus
          properties.
        </li>
        <li>
          <strong>Non-campus property documentation.</strong> SafeTrekr helps
          institutions maintain organized records of recurring travel
          destinations, making it easier to identify which locations qualify
          as non-campus property for Clery reporting purposes. Trip history
          and frequency data support the &ldquo;frequently used by
          students&rdquo; determination.
        </li>
        <li>
          <strong>Emergency protocol documentation.</strong> Safety binders
          include local emergency service contacts, hospital locations, embassy
          information (for international travel), and emergency communication
          protocols. This documentation supports the institution&apos;s
          emergency response planning obligations under the Clery Act.
        </li>
        <li>
          <strong>Analyst-reviewed risk assessments.</strong> Every safety
          binder is reviewed by a professional safety analyst who evaluates
          destination-specific risks. This creates an auditable record
          demonstrating that the institution performed due diligence before
          approving travel -- a key factor in both Clery compliance and
          institutional liability protection.
        </li>
        <li>
          <strong>Institutional documentation trail.</strong> SafeTrekr
          maintains timestamped records of every safety binder generated,
          every risk assessment completed, and every update to destination
          conditions. This documentation supports the institution&apos;s
          Annual Security Report disclosures and provides evidence of
          systematic safety practices.
        </li>
        <li>
          <strong>Pre-departure risk communication.</strong> SafeTrekr&apos;s
          safety binders can be shared with trip leaders, participants, and
          institutional stakeholders before travel begins. This supports the
          institution&apos;s obligation to inform the campus community about
          safety conditions and contributes to transparent communication
          required by the Clery Act.
        </li>
      </ul>
      <p>
        Learn more about how SafeTrekr serves{" "}
        <Link href="/solutions/higher-education">
          colleges and universities
        </Link>
        , or{" "}
        <Link href="/demo?segment=higher-education">request a demo</Link> to
        see how our platform supports Clery Act compliance.
      </p>
    </>
  );
}

function DutyOfCareContent() {
  return (
    <>
      {/* 1. What is duty of care */}
      <h2 id="what-is-duty-of-care" className="scroll-mt-24">
        What Is Duty of Care?
      </h2>
      <p>
        Duty of care is a legal principle that requires organizations to take
        reasonable steps to protect the health, safety, and well-being of
        people entrusted to their care. Unlike specific regulations such as
        FERPA or the Clery Act, duty of care is a broad common-law obligation
        rooted in negligence law that applies to virtually every organization
        that sponsors group travel.
      </p>
      <p>
        The concept is straightforward: if your organization sends people
        somewhere, you have a legal responsibility to ensure that destination
        is reasonably safe, that travelers are informed of relevant risks, and
        that plans are in place to respond to emergencies. The standard is not
        perfection -- courts evaluate whether the organization took
        &ldquo;reasonable&rdquo; precautions given the circumstances, the
        destination, and the population traveling.
      </p>
      <p>
        Duty of care has become increasingly prominent in travel risk
        management over the past decade. High-profile incidents -- from
        natural disasters affecting tour groups to safety failures at field
        trip destinations -- have led courts to hold organizations accountable
        for foreseeable risks they failed to address. The rise of accessible
        risk intelligence data has also raised the bar: courts now consider
        what information was reasonably available to the organization at the
        time of travel, which means &ldquo;we didn&apos;t know&rdquo; is an
        increasingly difficult defense.
      </p>

      <hr />

      {/* 2. Who does it apply to */}
      <h2 id="who-does-it-apply-to" className="scroll-mt-24">
        Who Has a Duty of Care for Group Travel?
      </h2>
      <p>
        Duty of care applies to any organization that sponsors, organizes, or
        facilitates travel on behalf of others. The specific scope of the duty
        varies by the relationship between the organization and the travelers,
        but the principle is universal.
      </p>
      <ul>
        <li>
          <strong>K-12 school districts.</strong> Schools have one of the
          highest duties of care because they are responsible for minor
          children. Courts consistently hold schools to a heightened standard
          during field trips and off-campus activities, recognizing that
          students have limited ability to assess and mitigate risks
          independently.
        </li>
        <li>
          <strong>Colleges and universities.</strong> While adult students bear
          more personal responsibility than minors, institutions still owe a
          duty of care -- particularly for university-organized programs like
          study abroad, athletic travel, and institutional field research.
          The doctrine of <em>in loco parentis</em> has evolved, but courts
          increasingly hold universities responsible for foreseeable travel
          risks.
        </li>
        <li>
          <strong>Churches and faith-based organizations.</strong> Mission
          trips, youth retreats, and congregation travel create significant
          duty of care obligations. These organizations often travel to
          higher-risk destinations and serve vulnerable populations
          (including minors and elderly travelers), which elevates the
          standard of care.
        </li>
        <li>
          <strong>Corporations and businesses.</strong> Employers have a
          well-established duty of care to employees during business travel.
          This extends to team offsites, conferences, client visits, and any
          travel required or encouraged by the organization. ISO 31030:2021
          provides an international standard for travel risk management that
          many corporations use to benchmark their programs.
        </li>
        <li>
          <strong>Nonprofits and youth organizations.</strong> Scout troops,
          sports leagues, volunteer organizations, and similar groups owe a
          duty of care to participants during organized travel and activities.
          The duty is heightened when minors are involved.
        </li>
        <li>
          <strong>Event organizers.</strong> Organizations hosting conferences,
          competitions, or gatherings that require attendee travel may owe a
          duty of care related to venue safety and accurate communication of
          destination conditions.
        </li>
      </ul>
      <blockquote>
        The question is not whether your organization has a duty of care for
        group travel -- it does. The question is whether you can demonstrate
        that you fulfilled that duty through documented, reasonable precautions.
      </blockquote>

      <hr />

      {/* 3. Key requirements */}
      <h2 id="key-requirements" className="scroll-mt-24">
        Key Duty of Care Requirements for Group Travel
      </h2>
      <p>
        While duty of care does not come with a prescriptive compliance
        checklist like FERPA or the Clery Act, courts and legal experts have
        established clear expectations for what constitutes &ldquo;reasonable
        care&rdquo; in the context of group travel.
      </p>
      <ol>
        <li>
          <strong>Pre-travel risk assessment.</strong> Organizations must assess
          the risks associated with each destination before travel occurs. This
          includes evaluating crime conditions, health risks, natural disaster
          exposure, political stability, transportation safety, and any factors
          specific to the traveling population (age, medical conditions,
          mobility).
        </li>
        <li>
          <strong>Risk communication and informed consent.</strong> Travelers
          (and parents/guardians for minors) must be informed of known risks
          at the destination. This communication should be documented and
          occur early enough that travelers can make informed decisions about
          participation. Glossing over risks or burying them in fine print
          does not satisfy the duty.
        </li>
        <li>
          <strong>Emergency response planning.</strong> Organizations must have
          documented plans for responding to emergencies during travel,
          including medical emergencies, natural disasters, security incidents,
          and evacuation scenarios. Plans should include local emergency
          contacts, hospital locations, insurance provider hotlines, and
          communication chains for notifying the home organization and
          families.
        </li>
        <li>
          <strong>Appropriate supervision and staffing.</strong> Travel
          programs must include adequate supervision for the population
          traveling. For minors, this typically means defined adult-to-student
          ratios, background-checked chaperones, and clear supervision
          protocols. For all populations, at least one leader should have first
          aid and emergency training.
        </li>
        <li>
          <strong>Insurance coverage.</strong> Organizations should maintain
          appropriate insurance coverage for group travel, including general
          liability, medical evacuation, and trip cancellation coverage. The
          specific coverage needed depends on the destination, the activities
          planned, and the population traveling.
        </li>
        <li>
          <strong>Ongoing monitoring.</strong> Duty of care does not end when
          the trip is approved. Organizations should monitor destination
          conditions between the planning phase and departure and be prepared
          to modify or cancel trips if conditions change materially. This
          includes tracking weather events, political developments, health
          advisories, and security alerts.
        </li>
        <li>
          <strong>Documentation and record-keeping.</strong> Every element of
          the duty of care process should be documented: the risk assessment,
          the communication to travelers, the emergency plans, the supervision
          arrangements, the insurance coverage, and any changes made in
          response to evolving conditions. In a negligence proceeding, the
          organization&apos;s documented actions are the primary evidence of
          reasonable care.
        </li>
        <li>
          <strong>Post-incident response and learning.</strong> When incidents
          occur, organizations must respond appropriately, document the
          response, and incorporate lessons learned into future travel planning.
          A pattern of similar incidents without corrective action is strong
          evidence of negligence.
        </li>
      </ol>

      <hr />

      {/* 4. How SafeTrekr helps */}
      <h2 id="how-safetrekr-helps" className="scroll-mt-24">
        How SafeTrekr Helps Organizations Fulfill Duty of Care
      </h2>
      <p>
        SafeTrekr provides the risk intelligence, documentation, and
        operational infrastructure that organizations need to demonstrate duty
        of care for every trip they sponsor.
      </p>
      <ul>
        <li>
          <strong>Professional risk assessment for every destination.</strong>{" "}
          Every SafeTrekr safety binder is reviewed by a professional safety
          analyst who evaluates destination-specific risks including crime,
          health, weather, transportation, and environmental factors. This
          analyst-reviewed assessment provides the documented pre-travel risk
          evaluation that duty of care requires.
        </li>
        <li>
          <strong>Comprehensive safety binder documentation.</strong> Each
          safety binder includes route risk analysis, local emergency service
          information, hospital locations, weather forecasts, destination
          safety ratings, and actionable safety recommendations. This
          single document serves as the organization&apos;s primary evidence
          of pre-travel due diligence.
        </li>
        <li>
          <strong>Real-time risk intelligence.</strong> SafeTrekr monitors
          destination conditions continuously, drawing from government
          advisories, weather services, health organizations, and security
          intelligence feeds. Organizations receive alerts if conditions
          change materially after a trip is planned, supporting the ongoing
          monitoring requirement.
        </li>
        <li>
          <strong>Shareable risk communication.</strong> Safety binders are
          designed to be shared with travelers, parents, guardians, and
          organizational stakeholders. The plain-language format helps
          organizations fulfill their obligation to communicate destination
          risks in an understandable way.
        </li>
        <li>
          <strong>Emergency protocol templates.</strong> SafeTrekr includes
          emergency response protocol documentation tailored to each
          destination, including local emergency numbers, hospital addresses
          with GPS coordinates, and step-by-step response procedures for
          common emergency scenarios.
        </li>
        <li>
          <strong>Audit-ready compliance trail.</strong> Every action in the
          SafeTrekr platform is timestamped and recorded: when a safety binder
          was requested, when it was reviewed by an analyst, when it was
          shared with trip leaders, and when conditions were last updated.
          This audit trail provides the documentation evidence that courts
          evaluate in negligence proceedings.
        </li>
      </ul>
      <p>
        SafeTrekr serves organizations across every segment. Explore our
        solutions for{" "}
        <Link href="/solutions/k12">K-12 schools</Link>,{" "}
        <Link href="/solutions/higher-education">higher education</Link>,{" "}
        <Link href="/solutions/churches">churches and mission organizations</Link>,
        and{" "}
        <Link href="/solutions/corporate">corporate and sports teams</Link>.
        Or{" "}
        <Link href="/demo">request a demo</Link> to see how SafeTrekr provides
        the documentation your organization needs.
      </p>
    </>
  );
}

/** Maps slug to article body content component. */
function GuideContent({ slug }: { slug: string }) {
  switch (slug) {
    case "ferpa":
      return <FerpaContent />;
    case "clery-act":
      return <CleryActContent />;
    case "duty-of-care":
      return <DutyOfCareContent />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function ComplianceGuidePage({
  params,
}: ComplianceGuidePageProps) {
  const { slug } = await params;
  const guide = GUIDES[slug];

  if (!guide) {
    notFound();
  }

  return (
    <>
      {/* ── JSON-LD Structured Data ── */}
      <BreadcrumbJsonLd
        path={`/compliance/${guide.slug}`}
        currentPageTitle={guide.title}
      />
      <JsonLd
        data={generateArticleSchema({
          headline: guide.title,
          description: guide.description,
          datePublished: guide.datePublished,
          dateModified: guide.dateModified,
          authorName: "SafeTrekr Compliance Team",
          authorTitle: "Compliance & Risk Analysis",
          path: `/compliance/${guide.slug}`,
          section: "Compliance",
          wordCount: guide.wordCount,
        })}
      />

      {/* ── Page Header ── */}
      <SectionContainer
        as="section"
        className="pb-6 pt-8 sm:pb-8 sm:pt-12 lg:pb-10 lg:pt-16"
        ariaLabelledBy="compliance-guide-heading"
      >
        <Container>
          {/* Breadcrumb: Desktop */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 hidden sm:block lg:mb-8"
          >
            <ol className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)]">
              <li>
                <Link
                  href="/"
                  className="transition-colors duration-150 hover:text-[var(--color-foreground)]"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="mx-1 h-3.5 w-3.5" />
              </li>
              <li>
                <Link
                  href="/compliance"
                  className="transition-colors duration-150 hover:text-[var(--color-foreground)]"
                >
                  Compliance Guides
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="mx-1 h-3.5 w-3.5" />
              </li>
              <li
                aria-current="page"
                className="font-medium text-[var(--color-foreground)]"
              >
                {guide.title}
              </li>
            </ol>
          </nav>

          {/* Breadcrumb: Mobile */}
          <nav aria-label="Breadcrumb" className="mb-6 sm:hidden">
            <Link
              href="/compliance"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted-foreground)] transition-colors duration-150"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Compliance Guides
            </Link>
          </nav>

          {/* Eyebrow + Title */}
          <div className="mb-4">
            <Eyebrow color="primary" icon={<Shield />}>
              {guide.eyebrow}
            </Eyebrow>
          </div>
          <h1
            id="compliance-guide-heading"
            className="text-display-md mb-4 text-[var(--color-foreground)]"
          >
            {guide.title}
          </h1>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-muted-foreground)]">
            <span>{guide.readingTime}</span>
            <span className="hidden sm:inline" aria-hidden="true">
              &middot;
            </span>
            <time dateTime={guide.datePublished}>
              {new Date(guide.datePublished).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span className="hidden sm:inline" aria-hidden="true">
              &middot;
            </span>
            <Link
              href={guide.segmentLink.href}
              className="text-[var(--color-primary-700)] underline underline-offset-2 transition-colors duration-150 hover:text-[var(--color-primary-800)]"
            >
              {guide.segmentLink.label}
            </Link>
          </div>
        </Container>
      </SectionContainer>

      {/* ── Article Body ── */}
      <SectionContainer
        as="section"
        className="pb-16 pt-0 lg:pb-24"
        aria-label={`${guide.title} guide content`}
      >
        <Container>
          <article className="legal-prose mx-auto max-w-[720px]">
            <GuideContent slug={guide.slug} />
          </article>
        </Container>
      </SectionContainer>

      {/* ── FAQ Section ── */}
      <SectionContainer
        as="section"
        variant="card"
        ariaLabelledBy="compliance-faq-heading"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow color="primary" className="mb-3">
              Frequently Asked Questions
            </Eyebrow>
            <h2
              id="compliance-faq-heading"
              className="text-heading-lg mb-8 text-[var(--color-foreground)]"
            >
              Common Questions About {guide.title.split(":")[0]}
            </h2>
          </div>
          <FAQSection items={guide.faqs} />
        </Container>
      </SectionContainer>

      {/* ── CTA Band ── */}
      <CTABand
        variant="dark"
        headline={guide.ctaHeadline}
        body={guide.ctaBody}
        primaryCta={{ text: "Request a Demo", href: guide.demoHref }}
        secondaryCta={{
          text: `Explore ${guide.segmentLink.label}`,
          href: guide.segmentLink.href,
        }}
      />
    </>
  );
}
