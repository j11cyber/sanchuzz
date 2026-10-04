import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { BrandProvider } from "@/components/brand-context";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

/** Admin uses the house tokens and no public chrome. */
export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <BrandProvider brand="house">
      <div data-brand="house" className={`${display.variable} ${body.variable} flex-1`}>
        {children}
      </div>
    </BrandProvider>
  );
}
