import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductsBySection } from "@/lib/products";
import { BRANDS, brandHref } from "@/lib/brands";
import ShopGrid from "@/components/santus/ShopGrid";
import Words from "@/components/motion/Words";
import Rise from "@/components/motion/Rise";

const B = BRANDS.santus;

export const metadata: Metadata = {
  title: "Shop",
  description: "Santus Sabaoth's own line: tailoring, kaftans, agbada, shirts, shoes and bags, all made by the designer.",
};

export default async function SantusShopPage() {
  const products = await getProductsBySection("SANTUS_SABAOTH");

  return (
    <div className="mx-auto max-w-[110rem] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
      <div className="grid gap-8 lg:grid-cols-12">
        <Words as="h1" text="The collection" onLoad className="font-display text-5xl leading-[0.95] text-fg sm:text-7xl lg:col-span-7" />
        <Rise as="p" delay={0.3} className="text-base leading-relaxed text-fg-muted/80 lg:col-span-4 lg:col-start-9 lg:pt-4">
          Everything here is made by Santus Sabaoth. No outside labels. If your size is not here, any piece can be cut to you.
        </Rise>
      </div>

      <div className="mt-12">
        <Suspense fallback={<div className="min-h-[50vh]" aria-busy="true" />}>
          <ShopGrid products={products} basePath={B.prefix} />
        </Suspense>
      </div>

      <section className="relative mt-24 overflow-hidden border-t border-line pt-16">
        <Rise className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl text-fg sm:text-5xl">Not your size, or not quite your cut?</h2>
            <p className="mt-3 max-w-md text-sm text-fg-muted/75">Any piece can be made to your measurements.</p>
          </div>
          <Link href={brandHref(B, "/commission")} className="btn-sheen relative inline-flex items-center overflow-hidden bg-fg px-6 py-3 text-sm text-bg">
            Commission a piece
          </Link>
        </Rise>
      </section>
    </div>
  );
}
