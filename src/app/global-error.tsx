"use client";

// Minimal global-error: no React hooks, no Context consumers. Next.js 16 +
// React 19's prerender for /_global-error wraps the page in framework
// internals that hit a `useContext` null error during build (same class of
// SSG bug that affected marketing routes; see (marketing)/layout.tsx).
// Keeping this surface as small as possible reduces the chance of triggering
// any context lookup in the prerender pass.

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafafa",
          color: "#111",
          padding: "2rem",
        }}
      >
        <main style={{ textAlign: "center", maxWidth: "32rem" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#555", marginBottom: "1.5rem" }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: "#111",
              color: "#fff",
              border: 0,
              padding: "0.625rem 1.25rem",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontSize: "0.9375rem",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
