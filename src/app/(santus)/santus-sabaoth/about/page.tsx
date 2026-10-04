import Link from "next/link";
import type { Metadata } from "next";
import { BRANDS, brandHref } from "@/lib/brands";
import { getContactSettings } from "@/lib/site-settings";
import { PHOTOS } from "@/lib/photos";
import ScrollImage from "@/components/motion/ScrollImage";
import Words from "@/components/motion/Words";
import Rise, { RiseGroup, RiseItem } from "@/components/motion/Rise";
import Ambient from "@/components/motion/Ambient";

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
    <div>
      <section className="relative overflow-hidden">
        <ScrollImage src={PHOTOS.beretPortrait} sizes="100vw" priority className="h-[88svh] min-h-[32rem]" parallax={10} zoom={1.1} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/95 via-deep/30 to-deep/10" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 sm:px-8 sm:pb-16 lg:px-12">
          <Rise as="p" className="text-sm text-fg-muted/70">
            The maker
          </Rise>
          <Words as="h1" text="One hand, first sketch to last stitch." onLoad delay={0.2} className="mt-3 max-w-4xl font-display text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.98] text-fg" />
        </div>
      </section>

      <section className="relative overflow-hidden">
        <Ambient motes={false} />
        <div className="relative mx-auto grid max-w-[110rem] gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:px-12">
          <Rise as="p" className="font-display text-2xl leading-snug text-fg sm:text-3xl lg:col-span-5">
            Santus Sabaoth is a single-designer line. There is no design team and no outside label.
          </Rise>
          <RiseGroup stagger={0.12} className="space-y-6 text-base leading-relaxed text-fg-muted/85 lg:col-span-6 lg:col-start-7">
            <RiseItem as="p">
              Every blazer, kaftan, agbada, shirt, shoe and bag is drawn, cut and finished by Santus himself in the {contact.location} atelier.
            </RiseItem>
            <RiseItem as="p">
              The work sits between two traditions: the soft-shouldered tailoring of the Italian ateliers and the proportions and cloth of
              Nigerian ceremonial dress. The result is clothing that holds its line in a boardroom and moves properly at a wedding.
            </RiseItem>
            <RiseItem as="p">
              Pieces are made in small numbers. When something sells out it may come back in a different cloth, or it may not come back at
              all. Anything in the collection can also be cut to your measurements.
            </RiseItem>
            <RiseItem as="p" className="text-xs text-fg-muted/50">
              Placeholder biography. The maker&rsquo;s own words will replace this.
            </RiseItem>
          </RiseGroup>
        </div>
      </section>

      <section className="grid gap-px bg-line sm:grid-cols-3">
        {[PHOTOS.atelierCheckSuit, PHOTOS.windowpaneBowTie, PHOTOS.tanOxfords].map((src, i) => (
          <div key={i} className="bg-bg">
            <ScrollImage src={src} sizes="(min-width: 640px) 33vw, 100vw" className="aspect-[4/5]" parallax={6} zoom={1.06} />
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-[110rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <Words as="h2" text="How a piece is made" className="font-display text-4xl text-fg sm:text-6xl lg:col-span-5" />
          <RiseGroup as="dl" stagger={0.1} className="divide-y divide-line border-y border-line lg:col-span-6 lg:col-start-7">
            {[
              ["Draw", "A sketch, then a pattern cut for the cloth in hand, not from a block."],
              ["Cut", "Cloth is laid, matched and cut by the maker. Nothing is outsourced."],
              ["Sew", "Canvassing, lapels and buttonholes by hand where it matters for the drape."],
              ["Finish", "Pressed, checked against the sketch, and only then put on the rail."],
            ].map(([t, d]) => (
              <RiseItem key={t} className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr]">
                <dt className="font-display text-2xl text-fg">{t}</dt>
                <dd className="text-sm leading-relaxed text-fg-muted/85">{d}</dd>
              </RiseItem>
            ))}
          </RiseGroup>
        </div>

        <Rise delay={0.2} className="mt-16 flex flex-wrap gap-4">
          <Link href={brandHref(B, "/shop")} className="btn-sheen relative inline-flex items-center overflow-hidden bg-fg px-6 py-3 text-sm text-bg">
            Shop the collection
          </Link>
          <Link href={brandHref(B, "/commission")} className="btn-sheen relative inline-flex items-center overflow-hidden border border-fg/40 px-6 py-3 text-sm text-fg">
            Commission a piece
          </Link>
        </Rise>
        <p className="mt-10 text-sm text-fg-muted/70">
          Santus also leads the styling work at{" "}
          <Link href={BRANDS.sartorial.prefix} className="link-line text-fg">
            Sartorial Executive
          </Link>
          , the house&rsquo;s executive image practice.
        </p>
      </section>
    </div>
  );
}
