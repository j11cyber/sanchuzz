import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { productHref, type StoreSection } from "@/lib/brands";

export const metadata: Metadata = {
  title: "Today",
  description: "Cloth of the day and colour of the day, chosen by the house.",
};

/** Pick black or ivory text for a given background hex. */
function inkFor(hex: string | null | undefined): string {
  if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) return "#f2ead6";
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return lum > 0.35 ? "#161513" : "#f2ead6";
}

export default async function DailyPage() {
  const [cloth, color] = await Promise.all([
    prisma.dailyPick.findFirst({ where: { type: "CLOTH" }, orderBy: { date: "desc" }, include: { product: true } }),
    prisma.dailyPick.findFirst({ where: { type: "COLOR" }, orderBy: { date: "desc" } }),
  ]);

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const ink = inkFor(color?.colorHex);

  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 sm:pt-24">
        <p className="text-sm text-fg-muted/60">{today}</p>
        <h1 className="mt-3 font-display text-5xl leading-[1.02] text-fg sm:text-7xl">Today</h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted/80">One piece and one colour, chosen each day, to build an outfit around.</p>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-5 sm:px-8">
        {cloth ? (
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="relative aspect-[4/5] overflow-hidden lg:col-span-5">
              {cloth.imageUrl && <Image src={cloth.imageUrl} alt={cloth.title} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />}
            </div>
            <div className="lg:col-span-6 lg:col-start-7 lg:self-end lg:pb-6">
              <span className="text-sm text-fg-muted/60">Cloth of the day</span>
              <h2 className="mt-3 font-display text-4xl leading-[1.05] text-fg sm:text-6xl">{cloth.title}</h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-fg-muted/85">{cloth.description}</p>
              {cloth.product && (
                <Link
                  href={productHref(cloth.product.section as StoreSection, cloth.product.slug)}
                  className="mt-8 inline-block border-b border-accent pb-0.5 text-sm text-fg transition hover:text-accent"
                >
                  See the piece
                </Link>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-fg-muted/60">No cloth has been chosen yet.</p>
        )}
      </section>

      <section className="mt-24">
        {color ? (
          <div className="flex min-h-[70svh] flex-col justify-between px-5 py-12 sm:px-8 sm:py-16" style={{ backgroundColor: color.colorHex ?? "#7A4B2A", color: ink }}>
            <div className="mx-auto w-full max-w-7xl">
              <span className="text-sm opacity-70">Colour of the day</span>
            </div>
            <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-12">
              <h2 className="font-display text-6xl leading-none sm:text-8xl lg:col-span-7">{color.title}</h2>
              <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
                <p className="text-base leading-relaxed opacity-85">{color.description}</p>
                <p className="mt-6 font-mono text-xs opacity-60">{color.colorHex}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="mx-auto max-w-7xl px-5 text-sm text-fg-muted/60 sm:px-8">No colour has been chosen yet.</p>
        )}
      </section>
    </div>
  );
}
