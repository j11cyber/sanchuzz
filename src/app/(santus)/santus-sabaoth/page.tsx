import Link from "next/link";
import { getProductsBySection } from "@/lib/products";
import { BRANDS, brandHref } from "@/lib/brands";
import { getContactSettings } from "@/lib/site-settings";
import { SANTUS } from "@/lib/photos";
import HeroCampaign from "@/components/house/HeroCampaign";
import Lookbook from "@/components/santus/Lookbook";
import ScrollImage from "@/components/motion/ScrollImage";
import Words from "@/components/motion/Words";
import Rise, { RiseGroup, RiseItem } from "@/components/motion/Rise";
import Ambient from "@/components/motion/Ambient";

const B = BRANDS.santus;

/**
 * Santus Sabaoth landing: the maker's atelier. A campaign hero in the
 * atelier's warmer palette, the lookbook scrolling sideways, a word from the
 * maker, and the commission invitation.
 */
export default async function SantusLanding() {
  const [products, contact] = await Promise.all([getProductsBySection("SANTUS_SABAOTH"), getContactSettings()]);
  const featured = products.filter((p) => p.featured);
  const lookbook = [...featured, ...products.filter((p) => !p.featured)].slice(0, 7);

  return (
    <div>
      <HeroCampaign
        image={SANTUS.hero}
        eyebrow={`Atelier · ${contact.location.split(",")[0]}`}
        headline="Santus Sabaoth"
        line="Every piece drawn, cut and finished by one hand. Ready to wear, or made to your measure."
        links={[
          { href: brandHref(B, "/shop"), label: "Shop the collection" },
          { href: brandHref(B, "/commission"), label: "Commission a piece" },
        ]}
        card={featured[0] ? { href: brandHref(B, `/${featured[0].slug}`), label: "New from the bench", title: featured[0].name, image: featured[0].images[0] } : undefined}
      />

      <Lookbook products={lookbook} basePath={B.prefix} />

      {/* A word from the maker */}
      <section className="relative overflow-hidden border-t border-line">
        <Ambient motes={false} />
        <div className="relative mx-auto grid max-w-[110rem] gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:gap-8 lg:px-12">
          <div className="lg:col-span-5">
            <ScrollImage src={SANTUS.maker} sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/5] bg-surface" parallax={8} zoom={1.08} />
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
            <Rise as="p" className="text-sm text-fg-muted/60">
              The maker
            </Rise>
            <Words as="h2" text="One hand, first sketch to last stitch." delay={0.1} className="mt-3 font-display text-4xl leading-[1.02] text-fg sm:text-6xl" />
            <Rise as="p" delay={0.3} className="mt-6 max-w-lg text-base leading-relaxed text-fg-muted/85">
              There is no design team and no outside label. The work sits between the soft shoulder of the Italian ateliers and the
              proportions and cloth of Nigerian ceremonial dress, so it holds its line in a boardroom and moves properly at a wedding.
            </Rise>
            <Rise delay={0.42} className="mt-7">
              <Link href={brandHref(B, "/about")} className="group inline-flex items-center gap-3 text-sm text-fg">
                <span className="h-px w-4 bg-fg-muted/40 transition-[width,background-color] duration-300 group-hover:w-8 group-hover:bg-accent" />
                About the maker
              </Link>
            </Rise>
          </div>
        </div>
      </section>

      {/* Commission */}
      <section className="relative overflow-hidden border-t border-line">
        <ScrollImage src={SANTUS.commissionInvite} sizes="100vw" className="h-[80svh] min-h-[30rem]" parallax={12} zoom={1.1} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/35 to-deep/15" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 sm:px-8 sm:pb-16 lg:px-12">
          <RiseGroup stagger={0.1} className="max-w-3xl">
            <RiseItem as="p" className="text-sm text-fg-muted/70">
              Made to measure
            </RiseItem>
            <RiseItem as="h2" className="mt-3 font-display text-4xl leading-[1.02] text-fg sm:text-6xl lg:text-7xl">
              Anything in the collection, cut to you.
            </RiseItem>
            <RiseItem as="p" className="mt-5 max-w-lg text-base leading-relaxed text-fg-muted/85">
              A measurement, a conversation about cloth and hardware, a fitting, then the piece. Three to eight weeks.
            </RiseItem>
            <RiseItem className="mt-8 flex flex-wrap gap-4">
              <Link href={brandHref(B, "/commission")} className="btn-sheen relative inline-flex items-center overflow-hidden bg-fg px-6 py-3 text-sm text-bg">
                Commission a piece
              </Link>
              <Link href={brandHref(B, "/shop")} className="btn-sheen relative inline-flex items-center overflow-hidden border border-fg/40 px-6 py-3 text-sm text-fg">
                Shop ready to wear
              </Link>
            </RiseItem>
          </RiseGroup>
        </div>
      </section>
    </div>
  );
}
