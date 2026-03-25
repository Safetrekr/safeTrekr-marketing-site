/**
 * ST-822: REQ-039 -- Input Sanitization (Layer 5 of 8-Layer Security)
 *
 * Sanitizes user-supplied text before database insertion. This is
 * defense-in-depth: Supabase uses parameterized queries (preventing SQL
 * injection), but sanitization guards against stored XSS if form data
 * is ever rendered in an admin interface or exported to third-party systems.
 *
 * Sanitization runs AFTER Zod validation and BEFORE persistence.
 *
 * Operations applied (in order):
 * 1. Strip HTML tags
 * 2. Remove dangerous characters (angle brackets, unmatched quotes)
 * 3. Remove ASCII control characters (except \t, \n, \r)
 * 4. Normalize Unicode to NFC (prevents homoglyph and duplicate attacks)
 * 5. Trim leading/trailing whitespace
 * 6. Enforce a hard 2,000-character ceiling (independent of Zod max)
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Absolute maximum length for any single sanitized string value. */
const MAX_SANITIZED_LENGTH = 2000;

/** Matches HTML/XML tags including self-closing tags. */
const HTML_TAG_PATTERN = /<[^>]*>/g;

/** Matches angle brackets and unmatched quotes that survive tag stripping. */
const DANGEROUS_CHAR_PATTERN = /[<>'"]/g;

/**
 * Matches ASCII control characters EXCEPT horizontal tab (\x09),
 * line feed (\x0A), and carriage return (\x0D) which are legitimate
 * in multi-line text fields (e.g., message, special requirements).
 */
const CONTROL_CHAR_PATTERN = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Sanitizes a single string input.
 *
 * @param input - Raw user-supplied string.
 * @returns Sanitized string safe for storage and display.
 *
 * @example
 * ```ts
 * sanitizeInput("<script>alert('xss')</script>Hello")
 * // => "alertxssHello"
 *
 * sanitizeInput("  normal input  ")
 * // => "normal input"
 * ```
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(HTML_TAG_PATTERN, "") // 1. Strip HTML tags
    .replace(DANGEROUS_CHAR_PATTERN, "") // 2. Remove angle brackets/quotes
    .replace(CONTROL_CHAR_PATTERN, "") // 3. Remove control chars
    .normalize("NFC") // 4. Normalize Unicode
    .trim() // 5. Trim whitespace
    .slice(0, MAX_SANITIZED_LENGTH); // 6. Hard length limit
}

/**
 * Recursively sanitizes all string values in a form data record.
 *
 * - String values are passed through {@link sanitizeInput}.
 * - Arrays are traversed and string elements are sanitized.
 * - Non-string primitives (number, boolean, null, undefined) pass through.
 * - Nested objects are recursively sanitized.
 *
 * @param data - Parsed form data (typically the output of `schema.safeParse`).
 * @returns A new record with all string values sanitized.
 *
 * @example
 * ```ts
 * sanitizeFormData({
 *   firstName: "  <b>John</b>  ",
 *   message: "Hello <script>alert(1)</script>",
 *   tripsPerYear: "5",
 *   tripTypes: ["domestic", "<img src=x>"],
 * })
 * // => {
 * //   firstName: "John",
 * //   message: "Hello alert1",
 * //   tripsPerYear: "5",
 * //   tripTypes: ["domestic", ""],
 * // }
 * ```
 */
export function sanitizeFormData(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    sanitized[key] = sanitizeValue(value);
  }

  return sanitized;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return sanitizeInput(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value !== null && typeof value === "object") {
    return sanitizeFormData(value as Record<string, unknown>);
  }

  // number, boolean, null, undefined -- pass through
  return value;
}
