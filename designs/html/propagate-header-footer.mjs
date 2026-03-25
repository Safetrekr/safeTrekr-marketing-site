import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const dir = '/Users/justintabb/projects/safetrekr-marketing/designs/html';

// Read the updated homepage as source of truth for header and footer
const homepage = readFileSync(join(dir, 'mockup-homepage.html'), 'utf-8');

// Extract header: from <!-- HEADER START --> or first <header to </header>
// We'll use regex to find the header block
const headerMatch = homepage.match(/<header[\s\S]*?<\/header>/);
const footerMatch = homepage.match(/<footer[\s\S]*?<\/footer>/);

// Also extract the Tailwind config and styles from the <head>
const headStyleMatch = homepage.match(/<script>\s*tailwind\.config[\s\S]*?<\/script>/);
const headerJsMatch = homepage.match(/\/\/ Header scroll[\s\S]*?(?=\/\/ (?:Mobile menu|Hero|Trust|Counter|Fade|Intersection|Smooth))/);
const mobileMenuMatch = homepage.match(/\/\/ Mobile menu[\s\S]*?(?=\/\/ (?:Hero|Trust|Counter|Fade|Intersection|Smooth|<\/script>))/);

if (!headerMatch) { console.error('Could not extract header'); process.exit(1); }
if (!footerMatch) { console.error('Could not extract footer'); process.exit(1); }

console.log(`Header: ${headerMatch[0].length} chars`);
console.log(`Footer: ${footerMatch[0].length} chars`);

// Get all mockup files except homepage and shared
const files = readdirSync(dir)
  .filter(f => f.startsWith('mockup-') && f.endsWith('.html') && f !== 'mockup-homepage.html');

console.log(`\nPropagating to ${files.length} files:\n`);

let updated = 0;
let skipped = 0;

for (const file of files) {
  const filepath = join(dir, file);
  let content = readFileSync(filepath, 'utf-8');

  const oldHeader = content.match(/<header[\s\S]*?<\/header>/);
  const oldFooter = content.match(/<footer[\s\S]*?<\/footer>/);

  if (oldHeader) {
    content = content.replace(/<header[\s\S]*?<\/header>/, headerMatch[0]);
  }
  if (oldFooter) {
    content = content.replace(/<footer[\s\S]*?<\/footer>/, footerMatch[0]);
  }

  if (oldHeader || oldFooter) {
    // Backup first
    writeFileSync(filepath + '.bak', readFileSync(filepath));
    writeFileSync(filepath, content);
    console.log(`✓ ${file} — header: ${oldHeader ? 'replaced' : 'not found'}, footer: ${oldFooter ? 'replaced' : 'not found'}`);
    updated++;
  } else {
    console.log(`⊘ ${file} — no header/footer found, skipped`);
    skipped++;
  }
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped`);
