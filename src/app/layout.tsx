import type { Metadata, Viewport } from "next";
import "./globals.css";
import { HOUSE_NAME } from "@/lib/brands";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Intro from "@/components/motion/Intro";
import MotionProvider from "@/components/motion/MotionProvider";
import Cursor from "@/components/motion/Cursor";
import { TabVisibilityPause } from "@/components/motion/Ambient";

export const metadata: Metadata = {
  title: {
    default: HOUSE_NAME,
    template: `%s · ${HOUSE_NAME}`,
  },
  description:
    "SanShuzz & Ma-Shirts is the house behind Santus Sabaoth, the maker's own line, and Sartorial Executive, The Fashion Clinic for executive menswear.",
};

export const viewport: Viewport = {
  themeColor: "#161513",
  width: "device-width",
  initialScale: 1,
};

/**
 * Bare shell. Each brand's route-group layout provides its own fonts, tokens,
 * navigation and footer so the three brands read as separate sites. Smooth
 * scrolling, the motion provider, the custom cursor and the first-load intro
 * are shared.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <MotionProvider>
          <SmoothScroll />
          <TabVisibilityPause />
          <Intro />
          <Cursor />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
