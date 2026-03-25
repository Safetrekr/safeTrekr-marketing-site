#!/bin/bash
cd /Users/justintabb/projects/safetrekr-marketing/plans

cat PRD.md > COMBINED_PRD.md

printf '\n\n---\n\n# Persona-Specific Product Requirements Documents\n\nThe following sections contain detailed requirements from each specialist perspective.\nReference these for deeper implementation guidance.\n\n---\n\n' >> COMBINED_PRD.md

cat database-architect.md >> COMBINED_PRD.md
printf '\n\n---\n\n' >> COMBINED_PRD.md

cat devops-platform-engineer.md >> COMBINED_PRD.md
printf '\n\n---\n\n' >> COMBINED_PRD.md

cat react-developer.md >> COMBINED_PRD.md
printf '\n\n---\n\n' >> COMBINED_PRD.md

cat world-class-appsec-security-architect.md >> COMBINED_PRD.md
printf '\n\n---\n\n' >> COMBINED_PRD.md

cat world-class-digital-marketing-lead.md >> COMBINED_PRD.md
printf '\n\n---\n\n' >> COMBINED_PRD.md

cat world-class-fuzzing-qa-agent.md >> COMBINED_PRD.md
printf '\n\n---\n\n' >> COMBINED_PRD.md

cat world-class-ui-designer.md >> COMBINED_PRD.md

echo "=== COMBINED_PRD.md created ==="
wc -l COMBINED_PRD.md
wc -c COMBINED_PRD.md
