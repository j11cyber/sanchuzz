import type { Metadata } from "next";
import "./globals.css";
import { HOUSE_NAME } from "@/lib/brands";

export const metadata: Metadata = {
  title: {
    default: HOUSE_NAME,
    template: `%s · ${HOUSE_NAME}`,
  },
  description:
    "SanShuzz & Ma-Shirts is the house behind Santus Sabaoth, the maker's own line, and Sartorial Executive, The Fashion Clinic for executive menswear.",
};

/**
 * Bare shell. Each brand's route-group layout provides its own fonts, tokens,
 * navigation and footer so the three brands read as separate sites.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
