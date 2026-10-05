import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { BrandProvider } from "@/components/brand-context";
import BrandNav from "@/components/BrandNav";
import BrandFooter from "@/components/BrandFooter";
import ChatWidget from "@/components/ChatWidget";
import SearchModal from "@/components/SearchModal";
import { BRANDS, HOUSE_NAME } from "@/lib/brands";
import { getContactSettings } from "@/lib/site-settings";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  adjustFontFallback: true,
  display: "swap",
});

const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap", adjustFontFallback: true });

export const metadata: Metadata = {
  title: { default: HOUSE_NAME, template: `%s · ${HOUSE_NAME}` },
  description: BRANDS.house.strapline,
};

export default async function HouseLayout({ children }: { children: React.ReactNode }) {
  const contact = await getContactSettings();
  return (
    <BrandProvider brand="house">
      <div data-brand="house" className={`${display.variable} ${body.variable} flex-1`}>
        <BrandNav />
        <main className="flex-1">{children}</main>
        <BrandFooter brand={BRANDS.house} contact={contact} />
        <ChatWidget />
        <SearchModal />
      </div>
    </BrandProvider>
  );
}
