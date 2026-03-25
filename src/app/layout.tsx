import { headers } from "next/headers";

import { fontVariableClasses } from "@/lib/fonts";
import { generatePageMetadata } from "@/lib/metadata";
import {
  JsonLd,
  generateOrganizationSchema,
} from "@/lib/structured-data";
import "./globals.css";

/* ================================================================
   Root Layout -- ST-833, ST-824
   ================================================================
   Provides the document shell shared by ALL routes (marketing pages,
   API routes, future app routes). Marketing-specific chrome (header,
   footer) lives in the (marketing) route-group layout.

   Responsibilities:
   - <html> + <body> with font variable classes
   - Default page metadata via generatePageMetadata
   - Organization JSON-LD for search-engine Knowledge Panel
   - ST-824: Read CSP nonce from middleware and apply to <html>

   The nonce is generated per-request in middleware.ts and passed
   via the `x-nonce` request header. It is set as a `data-nonce`
   attribute on <html> so that client components can read it for
   dynamically injected scripts.

   ST-903 VERIFIED: Organization schema rendered via <JsonLd>.
   ST-907 VERIFIED: Root layout exports metadata via generatePageMetadata.
   ================================================================ */

export const metadata = generatePageMetadata({
  title: "Professional Travel Risk Management",
  description:
    "Every trip professionally reviewed. SafeTrekr delivers real-time travel risk intelligence for organizations that take duty of care seriously.",
  path: "/",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ST-824: Read the CSP nonce from the middleware-injected request header.
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") ?? "";

  return (
    <html
      lang="en"
      className={`${fontVariableClasses} h-full antialiased`}
      data-nonce={nonce}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <JsonLd data={generateOrganizationSchema()} />
        {children}
      </body>
    </html>
  );
}
