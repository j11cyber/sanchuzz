import type { Metadata } from "next";
import { whatsappLink } from "@/lib/contact";
import { getContactSettings } from "@/lib/site-settings";
import { SANTUS } from "@/lib/photos";
import ScrollImage from "@/components/motion/ScrollImage";
import Words from "@/components/motion/Words";
import Rise, { RiseGroup, RiseItem } from "@/components/motion/Rise";
import Process from "@/components/house/Process";

export const metadata: Metadata = {
  title: "Commission a piece",
  description: "Made-to-measure clothing, shoes and bags from Santus Sabaoth, built the same way he builds his own line.",
};

const CATEGORIES = [
  { title: "Clothing", body: "Suits, kaftans, agbada and shirting cut to your exact measurements.", image: SANTUS.commissionClothing },
  { title: "Shoes", body: "Hand-lasted footwear built on a last made for your foot.", image: SANTUS.commissionShoes },
  { title: "Bags", body: "Structured or soft construction, in your choice of leather and hardware.", image: SANTUS.commissionBags },
];

export default async function CommissionPage() {
  const contact = await getContactSettings();
  const wa = whatsappLink(contact.whatsappNumber, "Hello Santus Sabaoth, I would like to commission a piece.");

  return (
    <div>
      <section className="relative overflow-hidden">
        <ScrollImage src={SANTUS.commissionHero} sizes="100vw" priority className="h-[80svh] min-h-[30rem]" parallax={10} zoom={1.1} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/95 via-deep/35 to-deep/15" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 sm:px-8 sm:pb-16 lg:px-12">
          <Rise as="p" className="text-sm text-fg-muted/70">
            Made to measure
          </Rise>
          <Words as="h1" text="Commission a piece" onLoad delay={0.2} className="mt-3 font-display text-[clamp(2.8rem,8vw,7.5rem)] leading-[0.95] text-fg" />
          <Rise as="p" delay={0.6} className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted/85 sm:text-lg">
            Clothing, shoes and bags made to your measure, the same way the line is made.
          </Rise>
        </div>
      </section>

      <section className="mx-auto max-w-[110rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <RiseGroup as="ul" stagger={0.12} className="grid gap-8 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <RiseItem key={c.title} as="li" className="group relative">
              <ScrollImage src={c.image} sizes="(min-width: 640px) 33vw, 100vw" className="aspect-[4/5] bg-surface" parallax={6} zoom={1.06} />
              <div className="relative mt-5 pt-4">
                <span className="card-line" aria-hidden />
                <h2 className="font-display text-3xl text-fg">{c.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted/80">{c.body}</p>
              </div>
            </RiseItem>
          ))}
        </RiseGroup>
      </section>

      <section className="relative border-t border-line">
        <Process
          title="How it works"
          intro={`Four steps, three to eight weeks. ${contact.location}. ${contact.locationNote}`}
          steps={[
            { number: "01", title: "Measure", body: "A measurement session at the atelier or at your home. Virtual is possible for repeat clients." },
            { number: "02", title: "Choose", body: "Cloth, leather, lining, hardware and details, decided together with samples in hand." },
            { number: "03", title: "Fit", body: "A fitting before final construction. Two for a suit or a first pair of shoes." },
            { number: "04", title: "Deliver", body: "Three to eight weeks depending on the piece. Care instructions come with it." },
          ]}
        />
      </section>

      <section className="relative overflow-hidden border-t border-line">
        <ScrollImage src={SANTUS.commissionClosing} sizes="100vw" className="h-[70svh] min-h-[26rem]" parallax={12} zoom={1.1} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/35 to-deep/20" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 sm:px-8 sm:pb-16 lg:px-12">
          <Words as="h2" text="Start a commission" className="font-display text-4xl leading-[1.02] text-fg sm:text-6xl" />
          <Rise as="p" delay={0.3} className="mt-4 max-w-md text-base leading-relaxed text-fg-muted/85">
            Tell us what you would like made and we will arrange a measurement.
          </Rise>
          <Rise delay={0.45} className="mt-8">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-sheen relative inline-flex items-center overflow-hidden bg-fg px-7 py-3.5 text-sm text-bg">
              Message the atelier on WhatsApp
            </a>
          </Rise>
        </div>
      </section>
    </div>
  );
}
