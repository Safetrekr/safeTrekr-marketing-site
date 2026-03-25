/**
 * ST-822: REQ-039 -- Shared Zod Validation Schemas
 *
 * Defines Zod v4 schemas for all marketing form types. These schemas are
 * shared between client-side (React Hook Form resolver) and server-side
 * (Server Action) validation to guarantee identical rules on both sides.
 *
 * Each schema includes:
 * - Common contact fields (email, firstName, lastName, organization)
 * - Form-specific fields
 * - Honeypot field (`company_website`) -- must be empty; bots auto-fill it
 * - Turnstile token (`turnstileToken`) for CAPTCHA verification
 *
 * The `details` JSONB column in `form_submissions` stores form-specific
 * fields. Common fields map to top-level columns.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared enums
// ---------------------------------------------------------------------------

/** Organization type -- matches the `organization_segment` DB enum. */
export const orgTypeValues = [
  "k12",
  "higher_education",
  "churches_missions",
  "corporate",
  "sports",
  "other",
] as const;

export type OrgType = (typeof orgTypeValues)[number];

/** Demo format preference. */
export const demoFormatValues = [
  "live-video",
  "in-person",
  "self-guided",
  "group",
] as const;

export type DemoFormat = (typeof demoFormatValues)[number];

/** Trip type categories for quote requests. */
export const tripTypeValues = [
  "domestic",
  "international",
  "mission",
  "athletic",
  "academic",
  "corporate-retreat",
] as const;

export type TripType = (typeof tripTypeValues)[number];

/** Sample binder variant. */
export const binderTypeValues = [
  "k12",
  "mission",
  "corporate",
  "study-abroad",
] as const;

export type BinderType = (typeof binderTypeValues)[number];

// ---------------------------------------------------------------------------
// Common field fragments
// ---------------------------------------------------------------------------

/**
 * Honeypot field. Hidden via CSS and `aria-hidden`; bots auto-fill it.
 * If the value is non-empty the Server Action silently rejects with a
 * fake success response to avoid tipping off the bot.
 *
 * Using `z.string().max(0)` so an empty string passes but any content fails.
 * `.optional()` allows the field to be absent entirely (legitimate users
 * never see or interact with this field).
 */
const honeypotField = z.string().max(0).optional();

/**
 * Turnstile CAPTCHA token. Populated by the Cloudflare Turnstile widget
 * before the form submits. Required for server-side verification.
 */
const turnstileTokenField = z.string().min(1, "Verification is required.");

/**
 * Common contact fields shared by all form schemas.
 */
const commonFields = {
  email: z
    .email("Please enter a valid email address.")
    .min(1, "Email is required.")
    .max(254, "Email must be 254 characters or fewer."),

  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(100, "First name must be 100 characters or fewer."),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(100, "Last name must be 100 characters or fewer."),

  organization: z
    .string()
    .trim()
    .min(1, "Organization is required.")
    .max(200, "Organization must be 200 characters or fewer."),

  /** Honeypot -- must stay empty. */
  company_website: honeypotField,

  /** Cloudflare Turnstile token. */
  turnstileToken: turnstileTokenField,
};

/**
 * Optional organization field variant -- used by forms where the
 * organization field is not required (contact, sample binder).
 */
const optionalOrganization = z
  .string()
  .trim()
  .max(200, "Organization must be 200 characters or fewer.")
  .optional();

// ---------------------------------------------------------------------------
// Form schemas
// ---------------------------------------------------------------------------

/**
 * Demo Request Form schema.
 *
 * Required: email, firstName, lastName, organization, orgType, turnstileToken
 * Optional: tripsPerYear, groupSize, demoFormat, message
 *
 * Maps to `form_type = 'demo_request'` in `form_submissions`.
 * Form-specific fields are stored in the `details` JSONB column.
 */
export const demoRequestSchema = z.object({
  ...commonFields,

  orgType: z.enum(orgTypeValues, {
    error: "Please select an organization type.",
  }),

  tripsPerYear: z
    .string()
    .trim()
    .max(50, "Trips per year must be 50 characters or fewer.")
    .optional(),

  groupSize: z
    .string()
    .trim()
    .max(50, "Group size must be 50 characters or fewer.")
    .optional(),

  demoFormat: z.enum(demoFormatValues).optional(),

  message: z
    .string()
    .trim()
    .max(2000, "Message must be 2,000 characters or fewer.")
    .optional(),
});

export type DemoRequestFormData = z.infer<typeof demoRequestSchema>;

/**
 * Contact Form schema.
 *
 * Required: email, firstName, lastName, subject, message, turnstileToken
 * Optional: organization
 *
 * Maps to `form_type = 'contact'` in `form_submissions`.
 */
export const contactSchema = z.object({
  email: commonFields.email,
  firstName: commonFields.firstName,
  lastName: commonFields.lastName,
  organization: optionalOrganization,
  company_website: commonFields.company_website,
  turnstileToken: commonFields.turnstileToken,

  subject: z
    .string()
    .trim()
    .min(1, "Subject is required.")
    .max(200, "Subject must be 200 characters or fewer."),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message must be 5,000 characters or fewer."),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Quote Request Form schema.
 *
 * Required: email, firstName, lastName, organization, orgType, turnstileToken
 * Optional: tripsPerYear, tripTypes, budget
 *
 * Maps to `form_type = 'quote_request'` in `form_submissions`.
 */
export const quoteSchema = z.object({
  ...commonFields,

  orgType: z.enum(orgTypeValues, {
    error: "Please select an organization type.",
  }),

  tripsPerYear: z
    .string()
    .trim()
    .max(50, "Trips per year must be 50 characters or fewer.")
    .optional(),

  tripTypes: z.array(z.enum(tripTypeValues)).optional(),

  budget: z
    .string()
    .trim()
    .max(100, "Budget must be 100 characters or fewer.")
    .optional(),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;

/**
 * Sample Binder Download Form schema.
 *
 * Required: email, firstName, lastName, binderType, turnstileToken
 * Optional: organization
 *
 * Maps to `form_type = 'sample_binder_download'` in `form_submissions`.
 */
export const sampleBinderSchema = z.object({
  email: commonFields.email,
  firstName: commonFields.firstName,
  lastName: commonFields.lastName,
  organization: optionalOrganization,
  company_website: commonFields.company_website,
  turnstileToken: commonFields.turnstileToken,

  binderType: z.enum(binderTypeValues, {
    error: "Please select a binder type.",
  }),
});

export type SampleBinderFormData = z.infer<typeof sampleBinderSchema>;

// ---------------------------------------------------------------------------
// Schema registry -- maps form_type DB enum to its Zod schema
// ---------------------------------------------------------------------------

export const formSchemas = {
  demo_request: demoRequestSchema,
  contact: contactSchema,
  quote_request: quoteSchema,
  sample_binder_download: sampleBinderSchema,
} as const;

export type FormType = keyof typeof formSchemas;
