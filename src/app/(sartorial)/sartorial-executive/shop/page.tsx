import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductsBySection } from "@/lib/products";
import { BRANDS, brandHref } from "@/lib/brands";
import ShopGrid from "@/components/santus/ShopGrid";
import Words from "@/components/motion/Words";
import Rise from "@/components/motion/Rise";

const S = BRANDS.sartorial;

export const metadata: Metadata = {
  title: "Pieces",
  description: "The Sartorial Executive edit: tailoring, whole-cut footwear, overcoats and accessories from the atelier and other luxury houses.",
};

export default async function SartorialShopPage() {
  const products = await getProductsBySection("SARTORIAL_EXECUTIVE");

  return (
    <div className="mx-auto max-w-[110rem] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
      <div className="grid gap-8 lg:grid-cols-12">
        <Words as="h1" text="Pieces" onLoad className="font-display text-5xl leading-[0.95] text-fg sm:text-7xl lg:col-span-7" />
        <Rise as="p" delay={0.3} className="text-base leading-relaxed text-fg-muted/80 lg:col-span-4 lg:col-start-9 lg:pt-4">
          Tailoring, whole-cut footwear, overcoats and accessories, from the atelier and the houses we trust. Each piece earns its place by
          solving a problem a diagnosis has named.
        </Rise>
      </div>

      <div className="mt-12">
        <Suspense fallback={<div className="min-h-[50vh]" aria-busy="true" />}>
          <ShopGrid products={products} basePath={S.prefix} showBrands />
        </Suspense>
      </div>

      <section className="relative mt-24 overflow-hidden border-t border-line pt-16">
        <Rise className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl text-fg sm:text-5xl">Unsure of your cut?</h2>
            <p className="mt-3 max-w-md text-sm text-fg-muted/75">Take the checkup first. It names the silhouettes and proportions that work for you before you buy a thing.</p>
          </div>
          <Link href={brandHref(S, "/checkup")} className="btn-sheen relative inline-flex items-center overflow-hidden bg-fg px-6 py-3 text-sm font-medium text-bg">
            Start your checkup
          </Link>
        </Rise>
      </section>
    </div>
  );
}
