/* ================================================================
   Glossary Content -- Industry Term Definitions
   Ticket: ST-894
   Usage: /resources/glossary index + /resources/glossary/[term] pages
   ================================================================ */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A link to related pillar content (solutions page, blog post, etc.). */
export interface GlossaryRelatedLink {
  /** Display text for the link. */
  label: string;
  /** Destination URL path (relative to site root). */
  href: string;
}

/** A single glossary term entry. */
export interface GlossaryTerm {
  /** URL-friendly slug used in the route (e.g., "duty-of-care"). */
  slug: string;
  /** Display name of the term (title case). */
  name: string;
  /** Short one-sentence summary used in the index grid and meta description. */
  summary: string;
  /** Full definition body (200-400 words). Rendered on the individual term page. */
  definition: string;
  /** Links to related pillar content on the SafeTrekr site. */
  relatedLinks: GlossaryRelatedLink[];
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

/**
 * All glossary terms for the SafeTrekr Travel Safety Glossary.
 *
 * Ordered alphabetically by `name`. Each term provides a comprehensive
 * definition oriented toward travel risk management professionals,
 * school administrators, and organizational safety coordinators.
 */
export const GLOSSARY_TERMS: readonly GlossaryTerm[] = [
  {
    slug: "chaperone-ratio",
    name: "Chaperone Ratio",
    summary:
      "The required number of supervising adults per student on a school-sponsored trip.",
    definition:
      "Chaperone ratio refers to the mandated or recommended number of supervising adults relative to the number of students on a school-sponsored trip or activity. These ratios exist to ensure adequate supervision, mitigate risk, and fulfill an organization's duty of care obligations.\n\nRatios vary by jurisdiction, student age, activity type, and destination considerations. A common baseline for K-12 field trips is one chaperone per ten students for older children and one per five for elementary-age students. Higher-attention activities such as water sports, overnight travel, or international trips typically require tighter ratios.\n\nState education codes and district board policies often set minimum ratio requirements.",
    relatedLinks: [
      { label: "K-12 Solutions", href: "/solutions/k12" },
      { label: "Field Trip Compliance", href: "/resources/glossary/field-trip-compliance" },
      { label: "In Loco Parentis", href: "/resources/glossary/in-loco-parentis" },
    ],
  },
  {
    slug: "clery-act",
    name: "Clery Act",
    summary:
      "Federal law requiring colleges and universities to disclose campus safety information.",
    definition:
      "The Jeanne Clery Disclosure of Campus Security Policy and Campus Crime Statistics Act, commonly known as the Clery Act, is a federal statute that requires all colleges and universities participating in federal financial aid programs to disclose information about crime on and near their campuses. Signed into law in 1990, it is named after Jeanne Clery, a Lehigh University student who was assaulted and murdered in her dormitory in 1986.\n\nThe Act mandates that institutions publish an Annual Security Report (ASR) containing three years of campus crime statistics and security policies. It also requires timely warnings about crimes that pose a serious or continuing threat, emergency notifications for immediate threats, and a public crime log updated within two business days.\n\nFor higher education institutions that sponsor travel programs, study abroad, or off-campus activities, the Clery Act creates specific obligations. Crimes that occur at locations associated with the institution may need to be included in Clery reporting if the institution has a formal relationship with those locations.",
    relatedLinks: [
      { label: "Higher Education Solutions", href: "/solutions/higher-education" },
      { label: "FERPA", href: "/resources/glossary/ferpa" },
      { label: "Safety Audit", href: "/resources/glossary/safety-audit" },
    ],
  },
  {
    slug: "duty-of-care",
    name: "Duty of Care",
    summary:
      "The responsibility organizations have to take reasonable steps to prepare for the safety of people in their charge.",
    definition:
      "Duty of care is the legal and ethical obligation an organization owes to individuals entrusted to its supervision. In the context of travel planning, it refers to the responsibility schools, universities, churches, and corporations have to take reasonable steps to prepare for the safety of travelers during organized trips and activities.\n\nThe concept originates in tort law and varies by jurisdiction, but the core principle is consistent: when an organization assumes responsibility for a group of people -- whether students, employees, or volunteers -- it must exercise the level of care that a reasonable, prudent organization would in similar circumstances.\n\nDuty of care in travel encompasses pre-trip assessment, traveler preparation, active trip awareness, emergency response planning, and post-incident documentation. Courts evaluate whether an organization met its duty of care by examining whether it identified foreseeable considerations, took reasonable precautions, and had adequate response plans in place.",
    relatedLinks: [
      { label: "How SafeTrekr Works", href: "/how-it-works" },
      { label: "K-12 Solutions", href: "/solutions/k12" },
      { label: "In Loco Parentis", href: "/resources/glossary/in-loco-parentis" },
    ],
  },
  {
    slug: "emergency-action-plan",
    name: "Emergency Action Plan",
    summary:
      "A documented set of procedures for responding to emergencies during organized travel.",
    definition:
      "An emergency action plan (EAP) is a written document that outlines the specific procedures an organization and its personnel should follow in the event of an emergency during organized travel. It serves as both a preparedness tool and a documentation record, demonstrating that the organization anticipated potential incidents and established response protocols.\n\nA comprehensive travel EAP typically includes emergency contact hierarchies (on-site leader, organizational point of contact, local emergency services, embassy contacts for international travel), medical emergency procedures, evacuation protocols, communication templates for notifying families, natural disaster response, and procedures for incidents involving law enforcement.",
    relatedLinks: [
      { label: "How SafeTrekr Works", href: "/how-it-works" },
      { label: "Travel Risk Assessment", href: "/resources/glossary/travel-risk-assessment" },
      { label: "Trip Manifest", href: "/resources/glossary/trip-manifest" },
    ],
  },
  {
    slug: "ferpa",
    name: "FERPA",
    summary:
      "The federal law protecting the privacy of student education records.",
    definition:
      "The Family Educational Rights and Privacy Act (FERPA) is a federal law enacted in 1974 that protects the privacy of student education records. It applies to all educational institutions that receive funding from the U.S. Department of Education, which includes virtually every public school district, college, and university in the United States.\n\nFERPA gives parents certain rights regarding their children's education records. These rights transfer to the student when they turn 18 or attend a postsecondary institution. Under FERPA, schools must obtain written consent before disclosing personally identifiable information from a student's education record, with certain exceptions such as legitimate educational interest, health and safety emergencies, and directory information that the school has designated as public.",
    relatedLinks: [
      { label: "K-12 Solutions", href: "/solutions/k12" },
      { label: "Security", href: "/security" },
      { label: "Clery Act", href: "/resources/glossary/clery-act" },
    ],
  },
  {
    slug: "field-trip-compliance",
    name: "Field Trip Compliance",
    summary:
      "The body of regulatory requirements governing school-sponsored off-campus activities.",
    definition:
      "Field trip compliance encompasses the regulatory requirements, district policies, and standards that govern school-sponsored off-campus activities. It represents the intersection of education policy, planning practices, and administrative procedure that schools must navigate every time students leave campus for an organized activity.\n\nCompliance requirements vary significantly by state, district, and activity type, but typically include board-approved trip authorization forms, parent or guardian consent and medical authorization, transportation documentation, destination assessment, adequate chaperone ratios and background checks, and accommodation for students with disabilities or medical conditions.",
    relatedLinks: [
      { label: "K-12 Solutions", href: "/solutions/k12" },
      { label: "Chaperone Ratio", href: "/resources/glossary/chaperone-ratio" },
      { label: "Safety Binder", href: "/resources/glossary/safety-binder" },
    ],
  },
  {
    slug: "group-travel-insurance",
    name: "Group Travel Insurance",
    summary:
      "Insurance coverage purchased for an entire travel group to cover medical, cancellation, and related needs.",
    definition:
      "Group travel insurance is a policy purchased to provide coverage for all members of an organized travel group, typically covering medical emergencies, trip cancellation or interruption, emergency evacuation, baggage loss, and in some cases, general liability. It is a component of travel planning for schools, churches, corporations, and other organizations that sponsor group travel.\n\nUnlike individual travel insurance, group policies are designed to cover the unique needs of organized travel: blanket coverage for all participants under a single policy, simplified administration, and often lower per-person costs.",
    relatedLinks: [
      { label: "Travel Risk Assessment", href: "/resources/glossary/travel-risk-assessment" },
      { label: "Corporate Travel Solutions", href: "/solutions/corporate" },
      { label: "Emergency Action Plan", href: "/resources/glossary/emergency-action-plan" },
    ],
  },
  {
    slug: "in-loco-parentis",
    name: "In Loco Parentis",
    summary:
      "The legal doctrine that schools act \"in the place of the parent\" when supervising students.",
    definition:
      "In loco parentis is a Latin phrase meaning \"in the place of the parent.\" In education law, it refers to the legal doctrine that grants schools and their employees a degree of parental authority and responsibility over students during school hours and school-sponsored activities, including field trips and extracurricular travel.\n\nThis doctrine has deep roots in American education law, dating back to the 19th century. While its scope has been refined over time -- particularly regarding student rights -- the core obligation remains: when parents entrust their children to a school, the school assumes a duty to exercise the same degree of care that a reasonable, prudent parent would under comparable circumstances.",
    relatedLinks: [
      { label: "K-12 Solutions", href: "/solutions/k12" },
      { label: "Duty of Care", href: "/resources/glossary/duty-of-care" },
      { label: "Chaperone Ratio", href: "/resources/glossary/chaperone-ratio" },
    ],
  },
  {
    slug: "medical-authorization",
    name: "Medical Authorization",
    summary:
      "A signed form granting trip leaders permission to seek medical treatment for a participant.",
    definition:
      "Medical authorization is a signed document in which a parent, guardian, or individual grants permission for trip leaders or designated personnel to seek emergency medical treatment on behalf of a participant who is unable to provide consent themselves. It is a fundamental component of responsible group travel management and a practical necessity for organizations supervising minors.\n\nA comprehensive medical authorization form typically includes the participant's full legal name and date of birth, emergency contact information, health insurance details, known allergies, current medications, pre-existing medical conditions, and a signed consent statement authorizing emergency medical treatment.",
    relatedLinks: [
      { label: "K-12 Solutions", href: "/solutions/k12" },
      { label: "Trip Manifest", href: "/resources/glossary/trip-manifest" },
      { label: "FERPA", href: "/resources/glossary/ferpa" },
    ],
  },
  {
    slug: "safesport",
    name: "SafeSport",
    summary:
      "The U.S. Center for SafeSport and the federal framework for preventing abuse in amateur athletics.",
    definition:
      "SafeSport refers to both the U.S. Center for SafeSport -- an independent organization created by Congress in 2017 -- and the broader framework of policies, training, and reporting requirements designed to prevent emotional, physical, and sexual abuse in amateur athletics.\n\nThe Center administers mandatory training for coaches, staff, and volunteers who interact with athletes, maintains a centralized reporting mechanism for abuse allegations, investigates complaints independent of the National Governing Bodies (NGBs), and maintains a publicly searchable database of individuals who have been sanctioned.\n\nTravel creates particular considerations because athletes are removed from their home environments and normal oversight structures. SafeSport policies address specific travel protocols including lodging arrangements, transportation guidelines, and accountability measures.",
    relatedLinks: [
      { label: "Corporate & Sports Solutions", href: "/solutions/corporate" },
      { label: "Chaperone Ratio", href: "/resources/glossary/chaperone-ratio" },
      { label: "Duty of Care", href: "/resources/glossary/duty-of-care" },
    ],
  },
  {
    slug: "safety-audit",
    name: "Safety Audit",
    summary:
      "A systematic review of an organization's travel safety policies, procedures, and documentation.",
    definition:
      "A safety audit is a systematic, documented review of an organization's travel safety policies, procedures, documentation practices, and incident response capabilities. It evaluates whether the organization's stated safety commitments are reflected in actual practice and identifies areas for improvement.",
    relatedLinks: [
      { label: "How SafeTrekr Works", href: "/how-it-works" },
      { label: "Safety Binder", href: "/resources/glossary/safety-binder" },
      { label: "Field Trip Compliance", href: "/resources/glossary/field-trip-compliance" },
    ],
  },
  {
    slug: "safety-binder",
    name: "Safety Binder",
    summary:
      "A comprehensive document package containing all safety documentation for an organized trip.",
    definition:
      "A safety binder is a comprehensive document package that contains all safety-related documentation for an organized trip or activity. It serves as both an operational tool during the trip and a record that demonstrates the organization's preparation in travel planning.\n\nA properly assembled safety binder typically includes the destination assessment, emergency action plan with contact hierarchies, trip manifest with participant details, medical authorization forms, parent consent forms, insurance documentation, chaperone assignments, transportation details, local emergency services information, and nearest medical facilities.",
    relatedLinks: [
      { label: "How SafeTrekr Works", href: "/how-it-works" },
      { label: "Schedule a Walkthrough", href: "/demo" },
      { label: "Safety Audit", href: "/resources/glossary/safety-audit" },
    ],
  },
  {
    slug: "travel-risk-assessment",
    name: "Travel Risk Assessment",
    summary:
      "A structured evaluation of the considerations associated with a specific travel destination and itinerary.",
    definition:
      "A travel risk assessment is a structured evaluation of the potential considerations associated with a specific travel destination, itinerary, and group composition. It forms the foundation of responsible travel planning by identifying relevant factors before departure so that organizations can implement appropriate preparation measures.\n\nA thorough travel assessment evaluates multiple domains: security considerations, health factors, environmental conditions, infrastructure availability, and regional context.",
    relatedLinks: [
      { label: "How SafeTrekr Works", href: "/how-it-works" },
      { label: "Travel Safety Information", href: "/resources/glossary/travel-safety-information" },
      { label: "Duty of Care", href: "/resources/glossary/duty-of-care" },
    ],
  },
  {
    slug: "travel-safety-information",
    name: "Travel Safety Information",
    summary:
      "Analyzed, actionable information about destination-specific considerations derived from multiple data sources.",
    definition:
      "Travel safety information refers to analyzed, actionable information about destination-specific considerations that is derived from multiple data sources and processed through professional methodology. It goes beyond raw data or generic advisories by providing context, assessment, and practical implications for travelers.",
    relatedLinks: [
      { label: "How SafeTrekr Works", href: "/how-it-works" },
      { label: "Travel Risk Assessment", href: "/resources/glossary/travel-risk-assessment" },
      { label: "Safety Binder", href: "/resources/glossary/safety-binder" },
    ],
  },
  {
    slug: "trip-manifest",
    name: "Trip Manifest",
    summary:
      "A comprehensive roster of all participants, chaperones, and key logistics for an organized trip.",
    definition:
      "A trip manifest is a comprehensive roster that documents all participants, chaperones, drivers, and other personnel associated with an organized trip, along with key logistical information needed for accountability and emergency response.\n\nA complete trip manifest typically includes full legal names and dates of birth, emergency contact information, medical authorization form status, vehicle assignments, lodging assignments, group assignments, and chaperone-to-participant assignments.",
    relatedLinks: [
      { label: "K-12 Solutions", href: "/solutions/k12" },
      { label: "Medical Authorization", href: "/resources/glossary/medical-authorization" },
      { label: "Chaperone Ratio", href: "/resources/glossary/chaperone-ratio" },
    ],
  },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns all unique first letters from glossary term names, sorted. */
export function getGlossaryLetters(): string[] {
  const letters = new Set(GLOSSARY_TERMS.map((term) => term.name.charAt(0).toUpperCase()));
  return Array.from(letters).sort();
}

/** Returns all glossary term slugs for static param generation. */
export function getAllGlossarySlugs(): string[] {
  return GLOSSARY_TERMS.map((term) => term.slug);
}

/** Finds a single glossary term by slug. Returns `undefined` if not found. */
export function getGlossaryTermBySlug(slug: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find((term) => term.slug === slug);
}

/** Groups glossary terms by their first letter for the index page. */
export function getGlossaryTermsByLetter(): Map<string, GlossaryTerm[]> {
  const grouped = new Map<string, GlossaryTerm[]>();
  for (const term of GLOSSARY_TERMS) {
    const letter = term.name.charAt(0).toUpperCase();
    const existing = grouped.get(letter) ?? [];
    existing.push(term);
    grouped.set(letter, existing);
  }
  return grouped;
}
