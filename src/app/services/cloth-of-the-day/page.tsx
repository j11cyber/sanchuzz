import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { serializeProduct, sectionToSlug } from "@/lib/products";
import ServiceHero from "@/components/ServiceHero";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Cloth of the Day",
  description: "Today's featured outfit pick.",
};

export default async function ClothOfTheDayPage() {
  const pick = await prisma.dailyPick.findFirst({
    where: { type: "CLOTH" },
    orderBy: { date: "desc" },
    include: { product: true },
  });

  return (
    <div>
      <ServiceHero
        eyebrow="Daily Pick"
        title="Cloth of the Day"
        description="A single outfit, chosen and styled for today."
        image={pick?.imageUrl || "https://picsum.photos/seed/service-cloth/1800/1000"}
      />

      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        {pick ? (
          <ScrollReveal>
            <div className="grid gap-8 rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 shadow-soft sm:grid-cols-2 sm:p-8">
              {pick.imageUrl && (
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                  <Image src={pick.imageUrl} alt={pick.title} fill className="object-cover" />
                </div>
              )}
              <div className="flex flex-col justify-center">
                <h2 className="font-display text-2xl text-cream">{pick.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-cream-dim/75">
                  {pick.description}
                </p>
                {pick.product && (
                  <Link
                    href={`/${sectionToSlug(pick.product.section as "SANTUS_SABAOTH" | "SARTORIAL_EXECUTIVE")}/${serializeProduct(pick.product).slug}`}
                    className="mt-7 inline-block w-fit rounded-full bg-gold px-6 py-3 text-sm font-medium text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
                  >
                    Shop this piece
                  </Link>
                )}
              </div>
            </div>
          </ScrollReveal>
        ) : (
          <p className="text-center text-cream-dim/60">
            No pick has been set yet — check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
