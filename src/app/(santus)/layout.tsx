import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { BrandProvider } from "@/components/brand-context";
import BrandNav from "@/components/BrandNav";
import BrandFooter from "@/components/BrandFooter";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import { BRANDS } from "@/lib/brands";
import { getContactSettings } from "@/lib/site-settings";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: { default: BRANDS.santus.name, template: `%s · ${BRANDS.santus.name}` },
  description: BRANDS.santus.strapline,
};

export default async function SantusLayout({ children }: { children: React.ReactNode }) {
  const contact = await getContactSettings();
  return (
    <BrandProvider brand="santus">
      <div data-brand="santus" className={`${display.variable} ${body.variable} flex-1`}>
        <BrandNav />
        <main className="flex-1">{children}</main>
        <BrandFooter brand={BRANDS.santus} contact={contact} />
        <CartDrawer />
        <SearchModal />
      </div>
    </BrandProvider>
  );
}
