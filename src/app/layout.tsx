import { fontVariableClasses } from "@/lib/fonts";
import { generatePageMetadata } from "@/lib/metadata";
import {
  JsonLd,
  generateOrganizationSchema,
} from "@/lib/structured-data";
import "./globals.css";

/* ================================================================
   Root Layout
   ================================================================
   Provides the document shell shared by ALL routes (marketing pages,
   future app routes). Marketing-specific chrome (header, footer)
   lives in the (marketing) route-group layout.

   CSP nonce: src/middleware.ts generates a per-request nonce and
   forwards it via the `x-nonce` request header. Reading that header
   below opts the layout into dynamic rendering, which is what lets
   Next.js apply the nonce to the framework <script> tags it emits.
   Without this, strict CSP blocks hydration on the standalone build
   and client interactivity dies.

   Skipped when STATIC_EXPORT=true because next/headers is not
   available in the "export" output mode.
   ================================================================ */

const isStaticExport = process.env.STATIC_EXPORT === "true";

export const metadata = generatePageMetadata({
  title: "Professional Trip Safety Planning",
  description:
    "Every trip professionally reviewed. SafeTrekr delivers trip safety documentation for organizations that take duty of care seriously.",
  path: "/",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!isStaticExport) {
    const { headers } = await import("next/headers");
    await headers();
  }

  return (
    <html
      lang="en"
      className={`${fontVariableClasses} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <JsonLd data={generateOrganizationSchema()} />
        {children}
      </body>
    </html>
  );
}
