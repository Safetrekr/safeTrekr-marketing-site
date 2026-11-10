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
      // Tailwind's Preflight sets `list-style: none` on ul/ol, which makes
      // Safari + VoiceOver drop the implicit list role. Keeping an explicit
      // role="list" is the recommended accessibility fix (Scott O'Hara), so the
      // "redundant" list roles throughout the site are intentional, not noise.
      'jsx-a11y/no-redundant-roles': 'off',
      // React Compiler advisory rules (new in the React 19 / eslint-plugin-
      // react-hooks era). They flag several legitimate patterns here -- SSR
      // "mounted" guards, reading an external preference (localStorage / media
      // query) in an effect, and the latest-callback ref idiom -- so keep them
      // visible as warnings rather than blocking CI, and triage case by case.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
    },
  },

  // ── 7b. Type-aware rule tuning (TS files only, after disableTypeChecked) ─
  // Numbers stringify safely and predictably, so allow them inside template
  // literals (CSS lengths, durations, ARIA counts, HTTP status, etc.). This is
  // typescript-eslint's own default -- strictTypeChecked is what turns it off.
  // Other loose types (objects, unions with undefined) still error. Scoped to
  // TS files so it is not applied to type-info-less JS config files.
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    rules: {
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true },
      ],
    },
  },

  // ── 8. Test, e2e, and tooling scripts: relax type-aware strictness ─────
  // Test, Playwright, and build-tooling code legitimately uses non-null
  // assertions, loose template interpolation, and `any`-typed doubles/fixtures.
  // Holding it to the full strictTypeChecked production bar adds noise without
  // protecting shipped code, so the type-aware rules that only fire there are
  // relaxed for these globs only (production `src/**` keeps the strict bar).
  {
    files: [
      'e2e/**/*.{ts,tsx}',
      'scripts/**/*.{ts,tsx}',
      'src/**/__tests__/**/*.{ts,tsx}',
      'src/**/*.test.{ts,tsx}',
      'src/test/**/*.{ts,tsx}',
    ],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
    },
  }
);
