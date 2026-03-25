/**
 * ST-906: Schema Validation CI Script
 *
 * Builds the Next.js site, crawls the built HTML output, extracts all
 * <script type="application/ld+json"> blocks, and validates each against
 * basic schema.org structural requirements.
 *
 * Validation checks per block:
 *   1. Valid JSON parse
 *   2. Has @context === "https://schema.org"
 *   3. Has @type (top-level or within @graph items)
 *   4. Required fields present per schema.org type
 *
 * Exit codes:
 *   0 = all schemas valid
 *   1 = one or more validation failures
 *
 * Usage:
 *   npx tsx scripts/validate-schema.ts
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ValidationResult {
  file: string;
  schemaIndex: number;
  type: string;
  passed: boolean;
  errors: string[];
  warnings: string[];
}

// ---------------------------------------------------------------------------
// Required fields per schema.org @type
//
// These are basic structural checks, not a full schema.org validator.
// Each type maps to an array of required top-level property names.
// ---------------------------------------------------------------------------

const REQUIRED_FIELDS: Record<string, string[]> = {
  Organization: ["name", "url"],
  SoftwareApplication: ["name", "applicationCategory"],
  Product: ["name", "offers"],
  Offer: ["price", "priceCurrency"],
  AggregateOffer: ["lowPrice", "highPrice", "priceCurrency"],
  FAQPage: ["mainEntity"],
  Question: ["name", "acceptedAnswer"],
  Answer: ["text"],
  HowTo: ["name", "step"],
  HowToStep: ["name", "text"],
  BreadcrumbList: ["itemListElement"],
  ListItem: ["position", "name"],
  WebPage: ["name", "url"],
  ItemList: ["itemListElement"],
  WebSite: ["name", "url"],
  Brand: ["name"],
  ContactPoint: ["contactType"],
  PostalAddress: [],
};

// ---------------------------------------------------------------------------
// HTML file discovery
// ---------------------------------------------------------------------------

function findHtmlFiles(dir: string): string[] {
  const results: string[] = [];

  if (!existsSync(dir)) {
    return results;
  }

  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...findHtmlFiles(fullPath));
    } else if (entry.endsWith(".html")) {
      results.push(fullPath);
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// JSON-LD extraction from HTML
// ---------------------------------------------------------------------------

function extractJsonLdBlocks(html: string): string[] {
  const blocks: string[] = [];
  const regex =
    /<script\s+type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const content = match[1];
    if (content && content.trim()) {
      blocks.push(content.trim());
    }
  }

  return blocks;
}

// ---------------------------------------------------------------------------
// Schema validation
// ---------------------------------------------------------------------------

function validateSchemaObject(
  obj: Record<string, unknown>,
  parentPath: string,
  errors: string[],
  warnings: string[]
): void {
  const type = obj["@type"] as string | undefined;

  if (!type) {
    // If there is no @type but there IS a @graph, validate graph items
    if (Array.isArray(obj["@graph"])) {
      const graphItems = obj["@graph"] as Record<string, unknown>[];
      for (let i = 0; i < graphItems.length; i++) {
        const item = graphItems[i];
        if (item && typeof item === "object") {
          validateSchemaObject(
            item as Record<string, unknown>,
            `${parentPath}.@graph[${i}]`,
            errors,
            warnings
          );
        }
      }
      return;
    }

    errors.push(`${parentPath}: Missing @type property`);
    return;
  }

  // Check required fields for known types
  const requiredFields = REQUIRED_FIELDS[type];

  if (requiredFields === undefined) {
    warnings.push(`${parentPath}: Unknown schema type "${type}" -- skipping field validation`);
    return;
  }

  for (const field of requiredFields) {
    if (obj[field] === undefined && obj[field] !== null) {
      errors.push(`${parentPath} (${type}): Missing required field "${field}"`);
    }
  }

  // Recursively validate nested schema objects
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("@")) continue;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      const nested = value as Record<string, unknown>;
      if (nested["@type"]) {
        validateSchemaObject(nested, `${parentPath}.${key}`, errors, warnings);
      }
    }

    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        if (item && typeof item === "object" && (item as Record<string, unknown>)["@type"]) {
          validateSchemaObject(
            item as Record<string, unknown>,
            `${parentPath}.${key}[${i}]`,
            errors,
            warnings
          );
        }
      }
    }
  }
}

function validateJsonLdBlock(
  raw: string,
  file: string,
  index: number
): ValidationResult {
  const result: ValidationResult = {
    file,
    schemaIndex: index,
    type: "unknown",
    passed: true,
    errors: [],
    warnings: [],
  };

  // 1. Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    result.passed = false;
    result.errors.push(
      `Invalid JSON: ${e instanceof Error ? e.message : String(e)}`
    );
    return result;
  }

  if (typeof parsed !== "object" || parsed === null) {
    result.passed = false;
    result.errors.push("JSON-LD block is not an object");
    return result;
  }

  const obj = parsed as Record<string, unknown>;

  // 2. Check @context
  const context = obj["@context"];
  if (context !== "https://schema.org") {
    result.errors.push(
      `Expected @context "https://schema.org", got "${String(context)}"`
    );
    result.passed = false;
  }

  // 3. Determine type for reporting
  const topType = obj["@type"] as string | undefined;
  if (topType) {
    result.type = topType;
  } else if (Array.isArray(obj["@graph"])) {
    const graphTypes = (obj["@graph"] as Record<string, unknown>[])
      .map((item) => item["@type"] as string)
      .filter(Boolean);
    result.type = `@graph[${graphTypes.join(", ")}]`;
  }

  // 4. Validate structure
  validateSchemaObject(obj, "root", result.errors, result.warnings);

  if (result.errors.length > 0) {
    result.passed = false;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const projectRoot = join(import.meta.dirname ?? process.cwd(), "..");
  const buildDir = join(projectRoot, ".next", "server", "app");

  console.log("\n========================================");
  console.log("  Schema.org JSON-LD Validation");
  console.log("========================================\n");

  // Check that build output exists
  if (!existsSync(buildDir)) {
    console.error(
      `Build directory not found: ${buildDir}\n` +
        "Run 'npm run build' before validating schemas.\n"
    );
    process.exit(1);
  }

  // Find all HTML files
  const htmlFiles = findHtmlFiles(buildDir);

  if (htmlFiles.length === 0) {
    console.warn("No HTML files found in build output.\n");
    process.exit(0);
  }

  console.log(`Found ${htmlFiles.length} HTML file(s) in build output.\n`);

  // Process each file
  const allResults: ValidationResult[] = [];
  let totalSchemas = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let filesWithSchemas = 0;

  for (const filePath of htmlFiles) {
    const relPath = relative(projectRoot, filePath);
    const html = readFileSync(filePath, "utf-8");
    const blocks = extractJsonLdBlocks(html);

    if (blocks.length === 0) {
      continue;
    }

    filesWithSchemas++;
    console.log(`--- ${relPath} (${blocks.length} schema(s)) ---`);

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]!;
      const result = validateJsonLdBlock(block, relPath, i);
      allResults.push(result);
      totalSchemas++;

      if (result.passed) {
        totalPassed++;
        console.log(`  [PASS] Schema #${i + 1}: ${result.type}`);
      } else {
        totalFailed++;
        console.log(`  [FAIL] Schema #${i + 1}: ${result.type}`);
        for (const err of result.errors) {
          console.log(`         - ${err}`);
        }
      }

      for (const warn of result.warnings) {
        console.log(`  [WARN] ${warn}`);
      }
    }

    console.log();
  }

  // Summary
  console.log("========================================");
  console.log("  Summary");
  console.log("========================================");
  console.log(`  Files scanned:       ${htmlFiles.length}`);
  console.log(`  Files with schemas:  ${filesWithSchemas}`);
  console.log(`  Total schemas:       ${totalSchemas}`);
  console.log(`  Passed:              ${totalPassed}`);
  console.log(`  Failed:              ${totalFailed}`);
  console.log("========================================\n");

  if (totalFailed > 0) {
    const failedPages = allResults
      .filter((r) => !r.passed)
      .map((r) => `  - ${r.file} (${r.type})`)
      .join("\n");
    console.error(`${totalFailed} schema(s) failed validation:\n${failedPages}\n`);
    process.exit(1);
  }

  if (totalSchemas === 0) {
    console.warn("No JSON-LD schemas found in any page. This may be unexpected.\n");
    process.exit(0);
  }

  console.log("All schemas passed validation.\n");
  process.exit(0);
}

main();
