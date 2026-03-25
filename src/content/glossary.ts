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
      "Chaperone ratio refers to the mandated or recommended number of supervising adults relative to the number of students on a school-sponsored trip or activity. These ratios exist to ensure adequate supervision, mitigate risk, and fulfill an organization's duty of care obligations.\n\nRatios vary by jurisdiction, student age, activity type, and destination risk level. A common baseline for K-12 field trips is one chaperone per ten students for older children and one per five for elementary-age students. High-risk activities such as water sports, overnight travel, or international trips typically require tighter ratios.\n\nState education codes and district board policies often set minimum ratio requirements. Failing to meet these ratios can expose an organization to negligence claims if an incident occurs. Courts have considered inadequate supervision a key factor in determining whether a school breached its duty of care.\n\nBest practices include documenting the planned ratio in the trip manifest, verifying chaperone qualifications (background checks, first aid certification), and having a contingency plan if a chaperone becomes unavailable. SafeTrekr safety binders automatically flag trips where the planned ratio falls below recommended thresholds, giving trip coordinators time to recruit additional volunteers before departure.\n\nOrganizations should also consider the specific needs of students with disabilities or medical conditions, which may require additional one-on-one supervision beyond the standard ratio. The goal is not merely regulatory compliance but genuine safety coverage that accounts for real-world variables like group separation, restroom breaks, and emergency scenarios.",
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
      "The Jeanne Clery Disclosure of Campus Security Policy and Campus Crime Statistics Act, commonly known as the Clery Act, is a federal statute that requires all colleges and universities participating in federal financial aid programs to disclose information about crime on and near their campuses. Signed into law in 1990, it is named after Jeanne Clery, a Lehigh University student who was assaulted and murdered in her dormitory in 1986.\n\nThe Act mandates that institutions publish an Annual Security Report (ASR) containing three years of campus crime statistics and security policies. It also requires timely warnings about crimes that pose a serious or continuing threat, emergency notifications for immediate threats, and a public crime log updated within two business days.\n\nFor higher education institutions that sponsor travel programs, study abroad, or off-campus activities, the Clery Act creates specific obligations. Crimes that occur at locations associated with the institution -- including field trip destinations and study abroad sites -- may need to be included in Clery reporting if the institution has a formal relationship with those locations.\n\nNon-compliance can result in significant financial penalties from the Department of Education, loss of federal financial aid eligibility, and reputational damage. Institutions have been fined millions of dollars for Clery violations.\n\nSafeTrekr helps higher education institutions maintain Clery-relevant documentation by providing risk assessments and incident documentation for off-campus programs. Our safety binders create a clear evidentiary trail that supports institutional compliance obligations and demonstrates proactive risk management.",
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
      "The legal obligation organizations have to protect the safety and well-being of people in their charge.",
    definition:
      "Duty of care is the legal and ethical obligation an organization owes to individuals entrusted to its supervision. In the context of travel risk management, it refers to the responsibility schools, universities, churches, and corporations have to take reasonable steps to protect travelers from foreseeable harm during organized trips and activities.\n\nThe concept originates in tort law and varies by jurisdiction, but the core principle is consistent: when an organization assumes responsibility for a group of people -- whether students, employees, or volunteers -- it must exercise the level of care that a reasonable, prudent organization would in similar circumstances.\n\nDuty of care in travel encompasses pre-trip risk assessment, traveler preparation, real-time monitoring, emergency response planning, and post-incident documentation. Courts evaluate whether an organization met its duty of care by examining whether it identified foreseeable risks, took reasonable precautions, and had adequate response plans in place.\n\nFailure to fulfill duty of care obligations can result in negligence lawsuits, regulatory penalties, reputational damage, and most importantly, preventable harm to travelers. For schools operating under in loco parentis, the standard is particularly high because students cannot consent to risk on their own behalf.\n\nSafeTrekr was built specifically to help organizations demonstrate and document their duty of care. Every safety binder provides analyst-reviewed risk intelligence, emergency action plans, and tamper-evident documentation that creates a defensible evidentiary record. Rather than relying on ad hoc research or generic travel advisories, organizations receive professional-grade safety analysis calibrated to their specific itinerary, group composition, and risk profile.",
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
      "An emergency action plan (EAP) is a written document that outlines the specific procedures an organization and its personnel should follow in the event of an emergency during organized travel. It serves as both a preparedness tool and a legal safeguard, demonstrating that the organization anticipated potential incidents and established response protocols.\n\nA comprehensive travel EAP typically includes emergency contact hierarchies (on-site leader, organizational point of contact, local emergency services, embassy contacts for international travel), medical emergency procedures, evacuation protocols, communication templates for notifying families, natural disaster response, and procedures for incidents involving law enforcement.\n\nThe plan should be tailored to the specific destination and activity. A domestic field trip to a museum requires a different EAP than a mission trip to a developing country. Risk factors such as political instability, natural disaster exposure, medical infrastructure availability, and communication limitations should all inform the plan's scope.\n\nEvery adult supervisor on the trip should receive a copy of the EAP and be briefed on their specific responsibilities before departure. The plan should include printed emergency contact information, since electronic devices may be lost, damaged, or without signal during an actual emergency.\n\nSafeTrekr generates destination-specific emergency action plans as part of every safety binder. Each EAP is informed by our analyst review process and calibrated to the actual conditions at the destination, including local emergency services numbers, nearest medical facilities, embassy locations, and communication fallback options. Organizations receive an actionable plan, not a generic template.",
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
      "The Family Educational Rights and Privacy Act (FERPA) is a federal law enacted in 1974 that protects the privacy of student education records. It applies to all educational institutions that receive funding from the U.S. Department of Education, which includes virtually every public school district, college, and university in the United States.\n\nFERPA gives parents certain rights regarding their children's education records. These rights transfer to the student when they turn 18 or attend a postsecondary institution. Under FERPA, schools must obtain written consent before disclosing personally identifiable information from a student's education record, with certain exceptions such as legitimate educational interest, health and safety emergencies, and directory information that the school has designated as public.\n\nFor organizations that manage student travel, FERPA creates specific obligations around the handling of information collected during trip planning and execution. Medical authorization forms, emergency contacts, allergy information, behavioral notes, and accommodation records all constitute education records subject to FERPA protection.\n\nDigital platforms that process student data on behalf of schools must ensure their data handling practices comply with FERPA. This means appropriate access controls, data minimization, secure storage, and clear data retention policies. Schools remain responsible for vetting any third-party tools that access student information.\n\nSafeTrekr is designed with FERPA compliance in mind. Our platform uses role-based access controls to limit data visibility, encrypts student information at rest and in transit, and follows data minimization principles -- collecting only the information necessary for safety assessment and emergency preparedness. We do not sell or share student data with third parties.",
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
      "Field trip compliance encompasses the regulatory requirements, district policies, and legal standards that govern school-sponsored off-campus activities. It represents the intersection of education law, risk management, and administrative procedure that schools must navigate every time students leave campus for an organized activity.\n\nCompliance requirements vary significantly by state, district, and activity type, but typically include board-approved trip authorization forms, parent or guardian consent and medical authorization, transportation safety documentation (vehicle inspection, driver qualifications, insurance), destination risk assessment, adequate chaperone ratios and background checks, and accommodation for students with disabilities or medical conditions.\n\nMany districts require a documented approval workflow that escalates based on trip risk level. Local day trips may need only principal approval, while overnight or out-of-state trips require superintendent or school board authorization. International trips often trigger additional requirements including passport and visa coordination, enhanced insurance coverage, and embassy registration.\n\nThe compliance burden falls heavily on trip organizers -- typically teachers or activity sponsors -- who may lack training in risk management or regulatory requirements. This creates a gap between what the law requires and what actually gets done, especially in districts without dedicated risk management staff.\n\nSafeTrekr bridges this gap by providing a structured safety review process that addresses compliance requirements systematically. Each safety binder includes the documentation, risk assessment, and emergency planning that districts need to demonstrate compliance. Rather than relying on individual coordinators to research requirements, organizations get professional-grade compliance support built into every trip.",
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
      "Insurance coverage purchased for an entire travel group to cover medical, cancellation, and liability risks.",
    definition:
      "Group travel insurance is a policy purchased to provide coverage for all members of an organized travel group, typically covering medical emergencies, trip cancellation or interruption, emergency evacuation, baggage loss, and in some cases, general liability. It is a critical component of travel risk management for schools, churches, corporations, and other organizations that sponsor group travel.\n\nUnlike individual travel insurance, group policies are designed to cover the unique needs of organized travel: blanket coverage for all participants under a single policy, simplified administration, and often lower per-person costs. Coverage can be customized based on destination, activity type, traveler demographics, and trip duration.\n\nFor domestic school trips, standard district insurance may provide some coverage, but gaps often exist -- particularly for medical expenses incurred away from the school's geographic area, emergency evacuation costs, or liability arising from activities not covered under the district's general policy. International trips almost always require supplemental coverage.\n\nOrganizations should carefully review policy exclusions, which commonly include pre-existing medical conditions, high-risk activities (adventure sports, scuba diving), acts of war or terrorism in certain regions, and pandemic-related disruptions. The definition of \"covered activities\" should explicitly include all planned itinerary items.\n\nSafeTrekr safety binders include insurance gap analysis as part of the risk assessment process, identifying areas where an organization's existing coverage may be insufficient for the planned trip. This allows trip coordinators to address coverage gaps before departure rather than discovering them during an emergency.",
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
      "The legal doctrine that schools act 'in the place of the parent' when supervising students.",
    definition:
      "In loco parentis is a Latin phrase meaning \"in the place of the parent.\" In education law, it refers to the legal doctrine that grants schools and their employees a degree of parental authority and responsibility over students during school hours and school-sponsored activities, including field trips and extracurricular travel.\n\nThis doctrine has deep roots in American education law, dating back to the 19th century. While its scope has been refined over time -- particularly regarding student rights -- the core obligation remains: when parents entrust their children to a school, the school assumes a duty to exercise the same degree of care that a reasonable, prudent parent would under comparable circumstances.\n\nDuring organized travel, in loco parentis creates heightened obligations because students are removed from their familiar environment and their parents' direct oversight. Schools must provide supervision appropriate to the students' ages, the activity's risk level, and the destination's conditions. This includes foreseeable risks that a prudent parent would anticipate and mitigate.\n\nCourts have applied the in loco parentis standard in negligence cases involving school trips, examining whether the school's supervision, planning, and emergency response met the standard a reasonable parent would have maintained. Inadequate risk assessment, insufficient chaperone coverage, and failure to plan for foreseeable emergencies have all been cited as failures under this doctrine.\n\nSafeTrekr helps schools fulfill their in loco parentis obligations by providing the same caliber of safety analysis that an informed, diligent parent would want for their child. Our safety binders demonstrate that the school conducted professional-grade due diligence before exposing students to travel risk, creating both genuine safety and a defensible record of care.",
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
      "Medical authorization is a signed document in which a parent, guardian, or individual grants permission for trip leaders or designated personnel to seek emergency medical treatment on behalf of a participant who is unable to provide consent themselves. It is a fundamental component of responsible group travel management and a legal necessity for organizations supervising minors.\n\nA comprehensive medical authorization form typically includes the participant's full legal name and date of birth, emergency contact information (multiple contacts with priority order), health insurance details, known allergies (medications, foods, insect stings), current medications and dosages, pre-existing medical conditions, physician contact information, and a signed consent statement authorizing emergency medical treatment.\n\nFor organizations traveling with minors, medical authorization forms serve a dual purpose: they provide trip leaders with critical health information needed to respond effectively to a medical emergency, and they provide legal protection by documenting that the parent or guardian consented to emergency medical intervention in their absence.\n\nForms should be collected well in advance of departure, reviewed by the trip leader, and carried in both printed and digital formats during the trip. Medical information must be handled with appropriate privacy protections -- accessible to those who need it in an emergency but not casually available to other participants or unauthorized personnel.\n\nSafeTrekr integrates medical authorization management into the trip planning workflow. Trip coordinators can ensure all participants have completed required medical documentation before departure. During the trip, authorized personnel can access critical medical information through the SafeTrekr platform, ensuring emergency responders receive accurate health data when seconds count.",
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
      "SafeSport refers to both the U.S. Center for SafeSport -- an independent organization created by Congress in 2017 -- and the broader framework of policies, training, and reporting requirements designed to prevent emotional, physical, and sexual abuse in amateur athletics. The Protecting Young Victims from Sexual Abuse and Safe Sport Authorization Act established the Center as the exclusive authority for investigating abuse allegations within the U.S. Olympic and Paralympic movement.\n\nThe Center administers mandatory training for coaches, staff, and volunteers who interact with athletes, maintains a centralized reporting mechanism for abuse allegations, investigates complaints independent of the National Governing Bodies (NGBs), and maintains a publicly searchable database of individuals who have been sanctioned.\n\nFor sports organizations, youth athletic programs, and schools with competitive athletics, SafeSport compliance means ensuring all personnel who interact with minor athletes have completed SafeSport training, implementing policies on one-on-one interactions, locker room conduct, travel arrangements, and electronic communications, and maintaining reporting protocols that route allegations to both the Center and local authorities.\n\nTravel creates particular vulnerability because athletes are removed from their home environments and normal oversight structures. SafeSport policies mandate specific travel protocols including lodging arrangements (no adults sharing rooms with unrelated minors), transportation rules, and accountability measures.\n\nSafeTrekr supports sports organizations by incorporating SafeSport compliance considerations into trip safety planning. Our safety binders for athletic travel include supervision protocols, lodging arrangement documentation, and travel policy checklists aligned with SafeSport requirements, helping organizations demonstrate compliance with both SafeSport mandates and their broader duty of care obligations.",
    relatedLinks: [
      { label: "Sports Organization Solutions", href: "/solutions/sports" },
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
      "A safety audit is a systematic, documented review of an organization's travel safety policies, procedures, documentation practices, and incident response capabilities. It evaluates whether the organization's stated safety commitments are reflected in actual practice and identifies gaps that could expose the organization to risk or liability.\n\nA comprehensive travel safety audit typically examines policy documentation (are travel safety policies current, board-approved, and accessible?), trip approval workflows (is there a consistent review process based on risk level?), risk assessment practices (are destination-specific risk assessments conducted?), documentation completeness (are consent forms, medical authorizations, and emergency plans collected for every trip?), chaperone vetting (are background checks current? is training adequate?), insurance coverage (does coverage match actual trip activities and destinations?), incident reporting (is there a clear process for documenting and escalating incidents?), and post-trip review (are near-misses and incidents analyzed for pattern identification?).\n\nSafety audits can be conducted internally by the organization's risk management team, or externally by independent consultants or legal counsel. External audits carry more weight in demonstrating due diligence because they provide an objective assessment free from institutional bias.\n\nThe frequency of safety audits depends on the organization's travel volume and risk profile, but annual reviews are considered a minimum standard. High-travel organizations or those recovering from incidents should consider more frequent assessments.\n\nSafeTrekr provides organizations with audit-ready documentation for every trip. The tamper-evident safety binders, analyst review records, and systematic risk assessments create a comprehensive paper trail that simplifies the audit process and demonstrates consistent, professional-grade safety practices across all organizational travel.",
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
      "A safety binder is a comprehensive document package that contains all safety-related documentation for an organized trip or activity. It serves as both an operational tool during the trip and an evidentiary record that demonstrates the organization's due diligence in travel risk management.\n\nA properly assembled safety binder typically includes the destination risk assessment (security, health, environmental, infrastructure risks), emergency action plan with contact hierarchies, trip manifest with participant details and emergency contacts, medical authorization forms, parent or guardian consent forms, insurance documentation, chaperone assignments and contact information, transportation details and backup plans, local emergency services information, nearest medical facilities with directions, embassy or consulate information for international travel, and communication protocols.\n\nTraditionally, safety binders have been assembled manually by trip coordinators using a combination of internet research, district templates, and personal experience. This approach is inconsistent, time-consuming, and produces documentation of widely varying quality. A teacher planning a field trip to a national park receives the same level of safety analysis as one planning a trip to a high-risk urban area -- which is to say, whatever that individual teacher happens to know or find online.\n\nSafeTrekr's core product is a professionally produced, analyst-reviewed safety binder generated for each specific trip. Our safety analysts review government intelligence data, apply Monte Carlo risk scoring methodology, and produce destination-specific documentation that meets the standard of care a court would expect from a responsible organization. Each binder is tamper-evident, time-stamped, and tied to the specific itinerary and group composition.\n\nThe SafeTrekr safety binder transforms trip documentation from an administrative burden into a genuine safety asset.",
    relatedLinks: [
      { label: "How SafeTrekr Works", href: "/how-it-works" },
      { label: "Get a Demo", href: "/demo" },
      { label: "Safety Audit", href: "/resources/glossary/safety-audit" },
    ],
  },
  {
    slug: "travel-risk-assessment",
    name: "Travel Risk Assessment",
    summary:
      "A structured evaluation of the risks associated with a specific travel destination and itinerary.",
    definition:
      "A travel risk assessment is a structured evaluation of the potential risks associated with a specific travel destination, itinerary, and group composition. It forms the foundation of responsible travel risk management by identifying threats before departure so that organizations can implement appropriate mitigation measures.\n\nA thorough travel risk assessment evaluates multiple risk domains: security risks (crime rates, civil unrest, terrorism threat levels), health risks (disease prevalence, vaccination requirements, medical infrastructure quality, food and water safety), environmental risks (natural disaster exposure, extreme weather, altitude, wildlife), infrastructure risks (transportation safety, road conditions, communication reliability), and political risks (government stability, visa requirements, legal considerations for travelers).\n\nThe assessment should be destination-specific, time-sensitive (risks change with seasons, elections, and events), and calibrated to the specific group traveling. A group of college students studying abroad faces different risk factors than a corporate team attending a conference in the same city.\n\nTraditional approaches to travel risk assessment range from checking State Department travel advisories (broad country-level guidance that may not reflect local conditions) to hiring expensive security consultants (appropriate for high-risk destinations but impractical for routine travel). Most organizations fall somewhere in between, relying on trip coordinators to do their own research -- a process that produces inconsistent results.\n\nSafeTrekr delivers professional-grade travel risk assessments for every trip, regardless of destination. Our analysts synthesize government intelligence data, apply quantitative risk scoring methodology, and produce destination-specific assessments that identify the actual risks travelers will face -- not just country-level generalizations but localized, itinerary-specific analysis.",
    relatedLinks: [
      { label: "How SafeTrekr Works", href: "/how-it-works" },
      { label: "Travel Risk Intelligence", href: "/resources/glossary/travel-risk-intelligence" },
      { label: "Duty of Care", href: "/resources/glossary/duty-of-care" },
    ],
  },
  {
    slug: "travel-risk-intelligence",
    name: "Travel Risk Intelligence",
    summary:
      "Analyzed, actionable information about destination-specific risks derived from multiple data sources.",
    definition:
      "Travel risk intelligence refers to analyzed, actionable information about destination-specific risks that is derived from multiple data sources and processed through professional analytical methodology. It goes beyond raw data or generic advisories by providing context, severity assessment, and practical implications for travelers and the organizations responsible for their safety.\n\nThe intelligence cycle for travel risk follows a structured process: collection (gathering data from government sources, open-source intelligence, local contacts, and historical incident databases), analysis (evaluating the relevance, reliability, and severity of identified risks), production (creating actionable assessments tailored to specific trip parameters), and dissemination (delivering intelligence in a format that trip leaders and decision-makers can act on).\n\nTravel risk intelligence differs from travel advisories in several important ways. Government travel advisories (such as those issued by the U.S. State Department) provide country-level guidance that may not reflect conditions in the specific city or region being visited. They are updated infrequently and designed for individual travelers rather than organizations with duty of care obligations. Professional travel risk intelligence is localized to the actual destination, updated in near-real-time, and calibrated to the organization's specific risk tolerance and group composition.\n\nKey intelligence inputs include government security assessments, health authority bulletins, natural disaster monitoring, civil unrest tracking, transportation safety data, and historical incident analysis. The value lies not in any single source but in the professional synthesis of multiple sources into a coherent risk picture.\n\nSafeTrekr's travel risk intelligence is produced by trained analysts who apply Monte Carlo risk scoring to quantify uncertainty and produce calibrated risk assessments. This methodology transforms subjective threat information into defensible, quantitative risk scores that organizations can use to make informed travel decisions.",
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
      "A trip manifest is a comprehensive roster that documents all participants, chaperones, drivers, and other personnel associated with an organized trip, along with key logistical information needed for accountability and emergency response. It is one of the most fundamental safety documents in group travel management.\n\nA complete trip manifest typically includes full legal names and dates of birth for all travelers, emergency contact information for each participant (at least two contacts), medical authorization form status, vehicle assignments (which participants are in which vehicle), lodging assignments (room numbers, building locations), group or team assignments for activities, chaperone-to-participant assignments, and special needs or accommodations.\n\nThe manifest serves multiple critical functions during travel. For accountability, it enables trip leaders to quickly verify that all participants are present at assembly points. For emergency response, it provides first responders and administrators with accurate information about who is at what location. For communication, it ensures the organization can notify all relevant families in the event of an incident.\n\nTrip manifests should be maintained in both digital and printed formats. Digital copies enable quick sharing with administrators and emergency contacts, while printed copies remain accessible when electronic devices fail. The manifest should be updated to reflect any last-minute changes in participation or assignments.\n\nSafeTrekr incorporates trip manifest management into the trip planning workflow. Trip coordinators can build and maintain accurate manifests that are linked to medical authorizations, emergency contacts, and chaperone assignments. During the trip, the manifest is accessible through the SafeTrekr platform, ensuring trip leaders always have current participant information at their fingertips.",
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
