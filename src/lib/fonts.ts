/* ================================================================
   SafeTrekr Marketing Site -- Font Configuration
   Ticket: ST-797 / REQ-014
   Source: designs/DESIGN-SYSTEM.md Section 4.1
   ================================================================ */

import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = {
  "--font-display": plusJakartaSans.style.fontFamily,
  "--font-body": inter.style.fontFamily,
  "--font-mono": jetbrainsMono.style.fontFamily,
};

export const fontVariableClasses = [
  plusJakartaSans.variable,
  inter.variable,
  jetbrainsMono.variable,
].join(" ");
