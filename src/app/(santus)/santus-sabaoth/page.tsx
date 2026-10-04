import Image from "next/image";
import Link from "next/link";
import { getFeaturedProduct, getProductsBySection } from "@/lib/products";
import { formatNaira } from "@/lib/money";
import { BRANDS, brandHref } from "@/lib/brands";
import ParallaxImage from "@/components/ParallaxImage";
import ProductCard from "@/components/ProductCard";

const B = BRANDS.santus;

/**
 * Santus Sabaoth landing. Structural version; the horizontal lookbook and
 * photography-led facelift arrive in Phase 6.
 */
export default async function SantusLanding() {
  const [featured, products] = await Promise.all([getFeaturedProduct("SANTUS_SABAOTH"), getProductsBySection("SANTUS_SABAOTH")]);
  const recent = products.filter((p) => p.id !== featured?.id).slice(0, 4);

  return (
    <div className="space-y-20 sm:space-y-28">
      <section className="relative flex min-h-[80vh] items-end overflow-hidden">
        <ParallaxImage src="https://picsum.photos/seed/santus-hero/1800/1200" alt="Santus Sabaoth atelier" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/10" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
          <h1 className="font-display text-5xl text-fg sm:text-7xl">Santus Sabaoth</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted/85 sm:text-lg">
            Every piece here is designed and made by one man. Tailoring, kaftans, agbada, shoes and bags, cut by the same hand from the
            first sketch to the last stitch.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={brandHref(B, "/shop")} className="rounded-full bg-accent px-8 py-4 text-sm font-semibold text-bg transition hover:bg-accent-soft">
              Shop the collection
            </Link>
            <Link href={brandHref(B, "/commission")} className="rounded-full border border-fg-muted/30 px-8 py-4 text-sm text-fg transition hover:border-accent hover:text-accent">
              Commission a piece
            </Link>
          </div>
        </div>
      </section>

      {featured && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <Link href={brandHref(B, `/${featured.slug}`)} className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-surface sm:aspect-[5/4]">
              {featured.images[0] && (
                <Image src={featured.images[0]} alt={featured.name} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover transition duration-700 hover:scale-[1.03]" />
              )}
            </Link>
            <div>
              <p className="text-sm text-accent">{featured.category}</p>
              <h2 className="mt-3 font-display text-4xl text-fg sm:text-5xl">{featured.name}</h2>
              <p className="mt-5 text-sm leading-relaxed text-fg-muted/80">{featured.description}</p>
              <div className="mt-6 font-display text-2xl text-accent">{formatNaira(featured.price)}</div>
              <Link href={brandHref(B, `/${featured.slug}`)} className="mt-6 inline-block rounded-full border border-line px-6 py-3 text-sm text-fg transition hover:border-accent hover:text-accent">
                See the piece
              </Link>
            </div>
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl text-fg sm:text-4xl">New from the atelier</h2>
            <Link href={brandHref(B, "/shop")} className="text-sm text-accent hover:text-accent-soft">
              Everything
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 sm:gap-6">
            {recent.map((p) => (
              <ProductCard key={p.id} product={p} basePath={B.prefix} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 pb-8 sm:px-8">
        <div className="grid gap-8 rounded-3xl border border-line bg-surface p-8 sm:p-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-3xl text-fg">Made by hand, to your measure</h2>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted/80">
              Anything in the collection can be cut to you. Clothing, shoes and bags are commissioned the same way the line is made:
              a measurement, a conversation about cloth and hardware, a fitting, then the piece.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <Link href={brandHref(B, "/commission")} className="rounded-full bg-accent px-8 py-3.5 text-center text-sm font-semibold text-bg transition hover:bg-accent-soft">
              Commission a piece
            </Link>
            <Link href={brandHref(B, "/about")} className="rounded-full border border-line px-6 py-3.5 text-center text-sm text-fg transition hover:border-accent hover:text-accent">
              About the maker
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
