import Link from "next/link";
import { BRANDS, brandHref, HOUSE_NAME, type Brand } from "@/lib/brands";
import type { ContactSettings } from "@/lib/contact";
import { HouseWordmark, SantusWordmark, SartorialWordmark } from "@/components/brand/Logo";

/**
 * Footer for every brand. The house footer lists both brands. A brand footer
 * lists its own pages, links to the house once, and links to its sibling
 * brand once, quietly. Contact details come from admin settings.
 */
export default function BrandFooter({ brand, contact }: { brand: Brand; contact: ContactSettings }) {
  const isHouse = brand.key === "house";
  const sibling = brand.sibling ? BRANDS[brand.sibling] : null;

  const brandLinks = brand.nav.map((l) => ({ href: isHouse ? l.href : brandHref(brand, l.href), label: l.label }));

  const socials = [
    { href: contact.instagram, label: "Instagram" },
    { href: contact.tiktok, label: "TikTok" },
    { href: contact.x, label: "X" },
  ].filter((s) => s.href);

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="text-fg">
              {brand.key === "santus" ? (
                <SantusWordmark className="h-10 w-auto" />
              ) : brand.key === "sartorial" ? (
                <SartorialWordmark className="h-10 w-auto" />
              ) : (
                <HouseWordmark className="h-10 w-auto" />
              )}
            </div>
            {brand.key === "santus" && <div className="mt-2 text-xs text-accent-dim">Made by hand in {contact.location.split(",")[0]}</div>}
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-fg-muted/80">{brand.strapline}</p>
            {!isHouse && (
              <Link href="/" className="mt-5 inline-block text-xs text-fg-muted/60 transition hover:text-accent">
                A {HOUSE_NAME} house
              </Link>
            )}
            {socials.length > 0 && (
              <ul className="mt-5 flex gap-4">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-xs text-fg-muted/70 transition hover:text-accent">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
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
                  <li>
                    <Link href="/guide" className="text-sm text-fg-muted/80 transition hover:text-accent">
                      Garment care guide
                    </Link>
                  </li>
                  <li>
                    <Link href="/daily" className="text-sm text-fg-muted/80 transition hover:text-accent">
                      Today&rsquo;s pick
                    </Link>
                  </li>
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

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-fg-muted/60 sm:flex-row sm:items-center sm:justify-between">
          <span>
            &copy; {new Date().getFullYear()} {HOUSE_NAME}
          </span>
          <span>{contact.location}</span>
        </div>
      </div>
    </footer>
  );
}
