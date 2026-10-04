import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { BRANDS, brandHref } from "@/lib/brands";
import { getContactSettings } from "@/lib/site-settings";

const B = BRANDS.santus;

export const metadata: Metadata = {
  title: "The maker",
  description: "Santus Sabaoth designs and makes every piece in his line himself, from the Abuja atelier.",
};

/**
 * About the maker.
 * TODO(owner): replace the placeholder biography and photographs with the
 * real story, training and workshop photos.
 */
export default async function AboutTheMakerPage() {
  const contact = await getContactSettings();
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
          <Image src="https://picsum.photos/seed/santus-maker/1000/1250" alt="Santus Sabaoth at work" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        </div>

        <div>
          <h1 className="font-display text-4xl text-fg sm:text-6xl">One hand, first sketch to last stitch</h1>
          <div className="mt-8 space-y-5 text-sm leading-relaxed text-fg-muted/85 sm:text-base">
            <p>
              Santus Sabaoth is a single-designer line. There is no design team and no outside label. Every blazer, kaftan, agbada,
              shirt, shoe and bag is drawn, cut and finished by Santus himself in the {contact.location} atelier.
            </p>
            <p>
              The work sits between two traditions: the soft-shouldered tailoring of the Italian ateliers and the proportions and cloth
              of Nigerian ceremonial dress. The result is clothing that holds its line in a boardroom and moves properly at a wedding.
            </p>
            <p>
              Pieces are made in small numbers. When something sells out it may come back in a different cloth, or it may not come
              back at all. Anything in the collection can also be cut to your measurements.
            </p>
            <p className="text-xs text-fg-muted/50">Placeholder biography. The maker&rsquo;s own words will replace this.</p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={brandHref(B, "/shop")} className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-bg transition hover:bg-accent-soft">
              Shop the collection
            </Link>
            <Link href={brandHref(B, "/commission")} className="rounded-full border border-line px-7 py-3.5 text-sm text-fg transition hover:border-accent hover:text-accent">
              Commission a piece
            </Link>
          </div>

          <p className="mt-10 text-sm text-fg-muted/70">
            Santus also leads the styling work at{" "}
            <Link href={BRANDS.sartorial.prefix} className="text-accent underline underline-offset-4">
              Sartorial Executive
            </Link>
            , the house&rsquo;s executive image practice.
          </p>
        </div>
      </div>
    </div>
  );
}
