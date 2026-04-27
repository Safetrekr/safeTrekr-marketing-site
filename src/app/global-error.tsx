"use client";

import { useEffect } from "react";

// Override Next.js's default global-error page so we can opt it out of
// build-time SSG. The default is auto-generated and trips Next.js 16
// Turbopack's prerender worker with a useContext null error (same bug
// class as the marketing routes; see src/app/(marketing)/layout.tsx).
export const dynamic = "force-dynamic";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
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
