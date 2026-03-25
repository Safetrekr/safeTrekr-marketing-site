/// <reference types="vitest/globals" />

/**
 * ST-837: Vitest Global Test Setup (REQ-100)
 *
 * Runs before every test file. Responsibilities:
 * 1. Extend expect() with DOM matchers (toBeInTheDocument, toHaveTextContent, etc.)
 * 2. Mock Next.js modules that rely on server/router context unavailable in jsdom
 */

import "@testing-library/jest-dom/vitest";

// ---------------------------------------------------------------------------
// Mock: next/navigation
// ---------------------------------------------------------------------------
// Provides safe stubs for hooks that throw outside a Next.js router context.
// Individual tests can override via vi.mocked() when they need specific values.
// ---------------------------------------------------------------------------
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useParams: vi.fn(() => ({})),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Mock: next/image
// ---------------------------------------------------------------------------
// Replaces the Next.js <Image> component with a plain <img> so unit tests
// can assert on src, alt, and other HTML attributes without the Next.js
// image optimization pipeline.
// ---------------------------------------------------------------------------
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));
