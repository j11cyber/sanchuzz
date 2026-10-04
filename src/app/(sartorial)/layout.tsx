import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Courier_Prime } from "next/font/google";
import { BrandProvider } from "@/components/brand-context";
import BrandNav from "@/components/BrandNav";
import BrandFooter from "@/components/BrandFooter";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import { BRANDS } from "@/lib/brands";

const display = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Montserrat({ subsets: ["latin"], variable: "--font-body", display: "swap" });

// Typewriter face, used only for case file numbers and prescription stamps.
const mono = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${BRANDS.sartorial.name} · The Fashion Clinic`, template: `%s · ${BRANDS.sartorial.name}` },
  description:
    "The Fashion Clinic. We diagnose what is wrong with how you dress, prescribe the exact fix, and transform you into the Sartorial Executive. Abuja, FCT.",
};

export default function SartorialLayout({ children }: { children: React.ReactNode }) {
  return (
    <BrandProvider brand="sartorial">
      <div data-brand="sartorial" className={`${display.variable} ${body.variable} ${mono.variable} flex-1`}>
        <BrandNav />
        <main className="flex-1">{children}</main>
        <BrandFooter brand={BRANDS.sartorial} />
        <CartDrawer />
        <SearchModal />
      </div>
    </BrandProvider>
  );
}
