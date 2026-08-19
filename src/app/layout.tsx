import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import SearchModal from "@/components/SearchModal";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: {
    default: "The Fashion Clinic · Diagnose. Prescribe. Transform.",
    template: "%s · The Fashion Clinic",
  },
  description:
    "The Fashion Clinic — We diagnose fashion flaws, prescribe precise wardrobe treatments, and transform men into the Sartorial Executive. Premium menswear styling, wardrobe consulting, and curated luxury e-commerce.",
  keywords: [
    "The Fashion Clinic",
    "Sartorial Executive",
    "Menswear Styling",
    "Executive Image Consulting",
    "Wardrobe Detox",
    "Lagos Tailoring",
    "Luxury Menswear Nigeria",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-charcoal-950 text-cream-dim">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
        <SearchModal />
        <CartDrawer />
      </body>
    </html>
  );
}
