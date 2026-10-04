import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { productHref, type StoreSection } from "@/lib/brands";

export const metadata: Metadata = {
  title: "Today",
  description: "Cloth of the day and colour of the day, chosen by the house.",
};

export default async function DailyPage() {
  const [cloth, color] = await Promise.all([
    prisma.dailyPick.findFirst({ where: { type: "CLOTH" }, orderBy: { date: "desc" }, include: { product: true } }),
    prisma.dailyPick.findFirst({ where: { type: "COLOR" }, orderBy: { date: "desc" } }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="font-display text-4xl text-fg sm:text-6xl">Today</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-muted/80 sm:text-base">
        One piece and one colour, chosen each day, to build an outfit around.
      </p>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section className="overflow-hidden rounded-3xl border border-line bg-surface">
          <div className="p-6 pb-0 text-xs text-accent">Cloth of the day</div>
          {cloth ? (
            <div className="grid gap-6 p-6 sm:grid-cols-[1fr_1.2fr]">
              {cloth.imageUrl && (
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                  <Image src={cloth.imageUrl} alt={cloth.title} fill sizes="(min-width: 640px) 25vw, 100vw" className="object-cover" />
                </div>
              )}
              <div className="flex flex-col justify-center">
                <h2 className="font-display text-3xl text-fg">{cloth.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-fg-muted/75">{cloth.description}</p>
                {cloth.product && (
                  <Link href={productHref(cloth.product.section as StoreSection, cloth.product.slug)} className="mt-6 inline-block w-fit rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg transition hover:bg-accent-soft">
                    See the piece
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <p className="p-6 text-sm text-fg-muted/60">No cloth has been chosen yet.</p>
          )}
        </section>

        <section className="overflow-hidden rounded-3xl border border-line bg-surface">
          <div className="p-6 pb-0 text-xs text-accent">Colour of the day</div>
          {color ? (
            <div className="flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center">
              <div className="h-32 w-32 shrink-0 rounded-full border-4 border-surface-2" style={{ backgroundColor: color.colorHex ?? "#D4AF5A" }} aria-hidden />
              <div>
                <div className="font-mono text-xs text-fg-muted/60">{color.colorHex}</div>
                <h2 className="mt-1 font-display text-3xl text-fg">{color.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted/75">{color.description}</p>
              </div>
            </div>
          ) : (
            <p className="p-6 text-sm text-fg-muted/60">No colour has been chosen yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
