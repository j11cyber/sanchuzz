import Link from "next/link";
import { BRANDS, brandHref, HOUSE_NAME, type Brand } from "@/lib/brands";
import { ATELIER_LOCATION } from "@/lib/contact";

/**
 * Footer for every brand. The house footer lists both brands. A brand footer
 * lists its own pages, links to the house once, and links to its sibling
 * brand once, quietly.
 */
export default function BrandFooter({ brand }: { brand: Brand }) {
  const isHouse = brand.key === "house";
  const sibling = brand.sibling ? BRANDS[brand.sibling] : null;

  const brandLinks = brand.nav.map((l) => ({
    href: isHouse ? l.href : brandHref(brand, l.href),
    label: l.label,
  }));

  const houseLinks = [
    { href: "/guide", label: "Garment care guide" },
    { href: "/daily", label: "Today's pick" },
    { href: "/about", label: "About the house" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="font-display text-2xl text-fg">{brand.name}</div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-fg-muted/80">{brand.strapline}</p>
            {!isHouse && (
              <Link href="/" className="mt-5 inline-block text-xs text-fg-muted/60 transition hover:text-accent">
                A {HOUSE_NAME} house
              </Link>
            )}
          </div>

          <div>
            <div className="text-xs font-medium text-accent">{isHouse ? "The house" : brand.shortName}</div>
            <ul className="mt-4 space-y-2.5">
              {brandLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-fg-muted/80 transition hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-medium text-accent">{isHouse ? "Visit" : "Elsewhere"}</div>
            <ul className="mt-4 space-y-2.5">
              {isHouse ? (
                <>
                  <li>
                    <Link href={BRANDS.santus.prefix} className="text-sm text-fg-muted/80 transition hover:text-accent">
                      Santus Sabaoth
                    </Link>
                  </li>
                  <li>
                    <Link href={BRANDS.sartorial.prefix} className="text-sm text-fg-muted/80 transition hover:text-accent">
                      Sartorial Executive
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {houseLinks.slice(0, 2).map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-fg-muted/80 transition hover:text-accent">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                  {sibling && (
                    <li>
                      <Link href={sibling.prefix} className="text-sm text-fg-muted/80 transition hover:text-accent">
                        {sibling.name}
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link href="/contact" className="text-sm text-fg-muted/80 transition hover:text-accent">
                      Contact
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-fg-muted/50 sm:flex-row sm:items-center sm:justify-between">
          <span>
            &copy; {new Date().getFullYear()} {HOUSE_NAME}
          </span>
          <span>{ATELIER_LOCATION}</span>
        </div>
      </div>
    </footer>
  );
}
