/**
 * ST-822: REQ-039 -- SendGrid Email Notifications
 *
 * Sends internal team notification emails when forms are submitted.
 * Each form type has a dedicated email template that includes the
 * submitted data in a structured, readable format.
 *
 * Emails are sent to `team@safetrekr.com` from `noreply@safetrekr.com`.
 * The "from" address must be verified in the SendGrid dashboard.
 *
 * This module is called non-blocking (fire-and-forget with `.catch()`)
 * from the Server Action -- email delivery failures do NOT block the
 * user-facing success response. Failures are logged for monitoring.
 *
 * Environment variables:
 * - `SENDGRID_API_KEY` -- SendGrid API key (K8s Secret).
 */

import sgMail from "@sendgrid/mail";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TEAM_EMAIL = "team@safetrekr.com";
const FROM_EMAIL = "noreply@safetrekr.com";
const FROM_NAME = "SafeTrekr Website";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Form type identifiers matching `form_submissions.form_type`. */
type NotificationFormType =
  | "demo_request"
  | "contact"
  | "quote_request"
  | "sample_binder_download";

// ---------------------------------------------------------------------------
// Template builders
// ---------------------------------------------------------------------------

/**
 * Human-readable form type labels for email subjects.
 */
const FORM_TYPE_LABELS: Record<NotificationFormType, string> = {
  demo_request: "Demo Request",
  contact: "Contact Form",
  quote_request: "Quote Request",
  sample_binder_download: "Sample Binder Download",
};

/**
 * Builds a plain-text summary of form data for the email body.
 * Each field is rendered as "Label: value" on its own line.
 *
 * Arrays are joined with commas. Undefined/null values are skipped.
 */
function buildPlainTextBody(
  formType: string,
  data: Record<string, unknown>,
): string {
  const label =
    FORM_TYPE_LABELS[formType as NotificationFormType] ?? formType;
  const lines = [`New ${label} Submission`, "=".repeat(40), ""];

  for (const [key, value] of Object.entries(data)) {
    // Skip internal fields not relevant to the team notification.
    if (
      key === "turnstileToken" ||
      key === "company_website" ||
      value === undefined ||
      value === null ||
      value === ""
    ) {
      continue;
    }

    const displayKey = formatFieldName(key);
    const displayValue = Array.isArray(value)
      ? value.join(", ")
      : String(value);

    lines.push(`${displayKey}: ${displayValue}`);
  }

  lines.push("", "---", `Submitted at: ${new Date().toISOString()}`);
  return lines.join("\n");
}

/**
 * Builds an HTML email body with a clean table layout.
 */
function buildHtmlBody(
  formType: string,
  data: Record<string, unknown>,
): string {
  const label =
    FORM_TYPE_LABELS[formType as NotificationFormType] ?? formType;

  const rows: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (
      key === "turnstileToken" ||
      key === "company_website" ||
      value === undefined ||
      value === null ||
      value === ""
    ) {
      continue;
    }

    const displayKey = escapeHtml(formatFieldName(key));
    const displayValue = Array.isArray(value)
      ? escapeHtml(value.join(", "))
      : escapeHtml(String(value));

    rows.push(`
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151;white-space:nowrap;vertical-align:top;">
          ${displayKey}
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;">
          ${displayValue}
        </td>
      </tr>
    `);
  }

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#1e40af;color:#ffffff;padding:16px 24px;border-radius:8px 8px 0 0;">
        <h2 style="margin:0;font-size:18px;">New ${escapeHtml(label)} Submission</h2>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#ffffff;border:1px solid #e5e7eb;border-top:0;">
        ${rows.join("")}
      </table>
      <div style="padding:12px 24px;background:#f9fafb;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 8px 8px;color:#6b7280;font-size:13px;">
        Submitted at ${new Date().toISOString()}
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Sends an internal notification email to the SafeTrekr team when a
 * marketing form is submitted.
 *
 * @param formType - The form type identifier (e.g., `"demo_request"`).
 * @param data     - The sanitized form data (post-validation, post-sanitization).
 *
 * @throws Logs errors but does not throw -- callers use `.catch(console.error)`.
 *
 * @example
 * ```ts
 * // Fire-and-forget from Server Action
 * sendFormNotification("demo_request", sanitizedData).catch(console.error);
 * ```
 */
export async function sendFormNotification(
  formType: string,
  data: Record<string, unknown>,
): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey) {
    console.error(
      "[sendgrid] SENDGRID_API_KEY environment variable is not set. " +
        "Email notification skipped.",
    );
    return;
  }

  sgMail.setApiKey(apiKey);

  const label =
    FORM_TYPE_LABELS[formType as NotificationFormType] ?? formType;
  const contactName = [data["firstName"], data["lastName"]]
    .filter(Boolean)
    .join(" ");
  const contactEmail = data["email"] as string | undefined;

  const subject = contactName
    ? `[SafeTrekr] ${label} from ${contactName}`
    : `[SafeTrekr] New ${label}`;

  try {
    await sgMail.send({
      to: TEAM_EMAIL,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      replyTo: contactEmail
        ? { email: contactEmail, name: contactName || undefined }
        : undefined,
      subject,
      text: buildPlainTextBody(formType, data),
      html: buildHtmlBody(formType, data),
    });
  } catch (error) {
    console.error(
      `[sendgrid] Failed to send ${formType} notification:`,
      error,
    );
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Converts a camelCase field key to a human-readable label.
 * e.g., "firstName" -> "First Name", "orgType" -> "Org Type"
 */
function formatFieldName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

/**
 * Escapes HTML special characters to prevent XSS in the email body.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
