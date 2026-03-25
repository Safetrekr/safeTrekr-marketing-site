import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const dir = '/Users/justintabb/projects/safetrekr-marketing/plans';

const prd = readFileSync(join(dir, 'PRD.md'), 'utf8');

const personaFiles = [
  'database-architect.md',
  'devops-platform-engineer.md',
  'react-developer.md',
  'world-class-appsec-security-architect.md',
  'world-class-digital-marketing-lead.md',
  'world-class-fuzzing-qa-agent.md',
  'world-class-ui-designer.md',
];

const separator = '\n\n---\n\n';
const header = `# Persona-Specific Product Requirements Documents

The following sections contain detailed requirements from each specialist perspective.
Reference these for deeper implementation guidance.

---

`;

let combined = prd + separator + header;

for (let i = 0; i < personaFiles.length; i++) {
  const content = readFileSync(join(dir, personaFiles[i]), 'utf8');
  combined += content;
  if (i < personaFiles.length - 1) {
    combined += separator;
  }
}

writeFileSync(join(dir, 'COMBINED_PRD.md'), combined, 'utf8');

const lines = combined.split('\n').length;
const bytes = Buffer.byteLength(combined, 'utf8');
console.log(`COMBINED_PRD.md created: ${lines} lines, ${bytes} bytes`);
