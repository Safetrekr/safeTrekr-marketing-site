import { resolve } from "path";
import { defineConfig } from "vitest/config";

/**
 * ST-837: Vitest Configuration (REQ-100)
 *
 * Unit/component test runner for the SafeTrekr marketing site.
 *
 * Key decisions:
 * - jsdom environment for DOM/React component testing
 * - v8 coverage provider for speed (native V8 instrumentation)
 * - 80% coverage thresholds enforced across all dimensions
 * - Path aliases mirror tsconfig.json so imports like @/lib/utils resolve
 * - Excludes node_modules, .next build output, and e2e (Playwright owns those)
 */
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["src/test/setup.tsx"],
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e"],
    globals: true,
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/test/**",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.d.ts",
        "src/app/layout.tsx",
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@/components": resolve(__dirname, "./src/components"),
      "@/lib": resolve(__dirname, "./src/lib"),
      "@/hooks": resolve(__dirname, "./src/hooks"),
      "@/content": resolve(__dirname, "./src/content"),
      "@/actions": resolve(__dirname, "./src/actions"),
      "@/styles": resolve(__dirname, "./src/styles"),
    },
  },
});
