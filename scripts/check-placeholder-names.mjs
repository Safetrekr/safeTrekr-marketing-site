/**
 * ST-885: CI check -- block placeholder testimonial / review names.
 *
 * Scans all .tsx files under src/ for common placeholder names that
 * should never appear in shipped testimonials or structured data.
 * Exits with code 1 (and prints file:line details) if any are found.
 *
 * Usage:
 *   node scripts/check-placeholder-names.mjs
 *
 * TODO: Add this script to the CI pipeline, e.g.:
 *   # .github/workflows/ci.yml
 *   - name: Check for placeholder names
 *     run: node scripts/check-placeholder-names.mjs
 */

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Root directory to scan (relative to project root). */
const SCAN_DIR = "src";

/** Case-insensitive patterns that must never appear in source files. */
const BLOCKED_PATTERNS = [
  "Sample University",
  "Jane Doe",
  "John Doe",
  "John Smith",
  "Jane Smith",
  "Acme",
  "Example Corp",
  "Test Church",
  "Demo School",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Recursively collects all .tsx file paths under `dir`.
 *
 * @param {string} dir - Absolute path to the directory to walk.
 * @returns {Promise<string[]>} Resolved array of absolute file paths.
 */
async function collectTsxFiles(dir) {
  /** @type {string[]} */
  const results = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectTsxFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
      results.push(fullPath);
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const projectRoot = process.cwd();
const scanRoot = join(projectRoot, SCAN_DIR);

const files = await collectTsxFiles(scanRoot);

/** @type {{ file: string; line: number; pattern: string; text: string }[]} */
const violations = [];

for (const filePath of files) {
  const content = await readFile(filePath, "utf-8");
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const lineText = lines[i];
    for (const pattern of BLOCKED_PATTERNS) {
      if (lineText.toLowerCase().includes(pattern.toLowerCase())) {
        violations.push({
          file: relative(projectRoot, filePath),
          line: i + 1,
          pattern,
          text: lineText.trim(),
        });
      }
    }
  }
}

if (violations.length > 0) {
  console.error(
    `\n  Placeholder name check FAILED -- ${violations.length} violation(s) found:\n`,
  );
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  blocked pattern "${v.pattern}"`);
    console.error(`    > ${v.text}\n`);
  }
  console.error(
    "  Remove or replace all placeholder names with real, verified names.\n",
  );
  process.exit(1);
}

console.log(
  `  Placeholder name check passed -- scanned ${files.length} .tsx file(s), no violations found.`,
);
process.exit(0);
