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

   Note: CSP nonce handling removed for static export compatibility.
   For production with full security headers, use output: "standalone".
   ================================================================ */

export const metadata = generatePageMetadata({
  title: "Professional Trip Safety Planning",
  description:
    "Every trip professionally reviewed. SafeTrekr delivers trip safety documentation for organizations that take duty of care seriously.",
  path: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
