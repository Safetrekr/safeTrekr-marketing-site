/**
 * ST-787: REQ-004 - ESLint Configuration for SafeTrekr Marketing Site
 *
 * Flat config (ESLint v9) with:
 * - @eslint/js recommended as base
 * - typescript-eslint strictTypeChecked for project-based type-aware linting
 * - eslint-config-next for Next.js-specific rules (react, react-hooks, @next/next, import)
 * - eslint-plugin-jsx-a11y strict mode (all a11y rules at error level)
 * - @typescript-eslint/no-explicit-any: error
 */

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextConfig from 'eslint-config-next';
import jsxA11y from 'eslint-plugin-jsx-a11y';

/**
 * jsx-a11y strict rules extracted from eslint-plugin-jsx-a11y's strict preset.
 * Applied as rule overrides because eslint-config-next already registers the
 * jsx-a11y plugin -- re-registering it via flatConfigs.strict would cause a
 * "Cannot redefine plugin" error in ESLint v9.
 */
const jsxA11yStrictRules = Object.fromEntries(
  Object.entries(jsxA11y.flatConfigs.strict.rules).filter(([key]) =>
    key.startsWith('jsx-a11y/')
  )
);

export default tseslint.config(
  // ── Global ignores ────────────────────────────────────────────────────
  {
    ignores: ['designs/**', 'plans/**'],
  },

  // ── 1. Base JS rules ──────────────────────────────────────────────────
  eslint.configs.recommended,

  // ── 2. TypeScript strict + type-checked rules ─────────────────────────
  ...tseslint.configs.strictTypeChecked,

  // ── 3. Next.js rules (react, react-hooks, @next/next, import, jsx-a11y) ──
  ...nextConfig,

  // ── 4. TypeScript project-based linting configuration ─────────────────
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // ── 5. Disable type-checked rules for non-TS files (config files, etc.) ─
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...tseslint.configs.disableTypeChecked,
  },

  // ── 6. jsx-a11y STRICT mode (overrides Next.js warn-level a11y rules) ─
  {
    rules: {
      ...jsxA11yStrictRules,
    },
  },

  // ── 7. Custom rule overrides ──────────────────────────────────────────
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  }
);
