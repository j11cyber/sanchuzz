/**
 * The three brands of the SanShuzz & Ma-Shirts house.
 *
 * One codebase, one database, one admin, one Paystack account. Each brand is
 * a route group with its own layout, tokens, navigation and (where it sells)
 * its own cart. Everything that needs to know "which brand am I in" reads
 * from here rather than hard-coding paths or names.
 */

export type BrandKey = "house" | "santus" | "sartorial";

export type StoreSection = "SANTUS_SABAOTH" | "SARTORIAL_EXECUTIVE";

export type NavLink = { href: string; label: string };

export type Brand = {
  key: BrandKey;
  /** Full display name. */
  name: string;
  /** Short name for tight spaces (mobile nav, badges). */
  shortName: string;
  /** One-line description used on the house threshold and sibling links. */
  strapline: string;
  /** URL prefix while brands live on one domain. Empty for the house. */
  prefix: "" | "/santus-sabaoth" | "/sartorial-executive";
  /** Product section this brand sells, if it sells products. */
  section: StoreSection | null;
  /** Browser-storage key for this brand's cart. Null if the brand has no cart. */
  cartKey: string | null;
  /** Primary navigation, paths relative to the brand prefix. */
  nav: NavLink[];
  /** The other selling brand, linked once from this brand's footer. */
  sibling: BrandKey | null;
};

export const HOUSE_NAME = "SanShuzz & Ma-Shirts";

export const BRANDS: Record<BrandKey, Brand> = {
  house: {
    key: "house",
    name: HOUSE_NAME,
    shortName: "SanShuzz",
    strapline: "The house behind Santus Sabaoth and Sartorial Executive.",
    prefix: "",
    section: null,
    cartKey: null,
    nav: [
      { href: "/santus-sabaoth", label: "Santus Sabaoth" },
      { href: "/sartorial-executive", label: "Sartorial Executive" },
      { href: "/guide", label: "Guide" },
      { href: "/daily", label: "Today" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
    sibling: null,
  },
  santus: {
    key: "santus",
    name: "Santus Sabaoth",
    shortName: "Santus Sabaoth",
    strapline: "The maker's own line. Tailoring, kaftans, shoes and bags, cut by one hand.",
    prefix: "/santus-sabaoth",
    section: "SANTUS_SABAOTH",
    cartKey: "santus-cart",
    nav: [
      { href: "/shop", label: "Shop" },
      { href: "/commission", label: "Commission a piece" },
      { href: "/about", label: "The maker" },
    ],
    sibling: "sartorial",
  },
  sartorial: {
    key: "sartorial",
    name: "Sartorial Executive",
    shortName: "Sartorial Executive",
    strapline: "The Fashion Clinic. Diagnose. Prescribe. Transform.",
    prefix: "/sartorial-executive",
    section: "SARTORIAL_EXECUTIVE",
    cartKey: "sartorial-cart",
    nav: [
      { href: "/services", label: "Treatments" },
      { href: "/checkup", label: "Checkup" },
      { href: "/case-files", label: "Case files" },
      { href: "/shop", label: "Pieces" },
      { href: "/book", label: "Book" },
    ],
    sibling: "santus",
  },
};

/** Brands that have a URL prefix (everything except the house). */
export const PREFIXED_BRANDS: Brand[] = [BRANDS.santus, BRANDS.sartorial];

/** Build an absolute path inside a brand. `brandHref(BRANDS.santus, "/shop")` is `/santus-sabaoth/shop`. */
export function brandHref(brand: Brand, path: string = "/"): string {
  if (path === "/" || path === "") return brand.prefix || "/";
  return `${brand.prefix}${path.startsWith("/") ? path : `/${path}`}`;
}

/** The selling brand for a product section. */
export function brandForSection(section: StoreSection): Brand {
  return section === "SANTUS_SABAOTH" ? BRANDS.santus : BRANDS.sartorial;
}

/** Path to a product detail page. */
export function productHref(section: StoreSection, slug: string): string {
  return brandHref(brandForSection(section), `/${slug}`);
}

/** Find the brand whose prefix the given pathname starts with, if any. */
export function brandFromPathname(pathname: string): Brand {
  for (const b of PREFIXED_BRANDS) {
    if (pathname === b.prefix || pathname.startsWith(`${b.prefix}/`)) return b;
  }
  return BRANDS.house;
}

/**
 * Parse the BRAND_HOSTS env var into a host -> prefix map.
 *
 * Format: comma-separated `host=prefix` pairs, for example
 *   BRAND_HOSTS="santussabaoth.com=santus-sabaoth,www.santussabaoth.com=santus-sabaoth,sartorialexecutive.com=sartorial-executive"
 *
 * Hosts are matched case-insensitively and without a port. Prefix may be given
 * with or without a leading slash.
 */
export function parseBrandHosts(raw: string | undefined): Map<string, Brand> {
  const map = new Map<string, Brand>();
  if (!raw) return map;
  for (const pair of raw.split(",")) {
    const [host, prefix] = pair.split("=").map((s) => s?.trim().toLowerCase());
    if (!host || !prefix) continue;
    const normalized = prefix.startsWith("/") ? prefix : `/${prefix}`;
    const brand = PREFIXED_BRANDS.find((b) => b.prefix === normalized);
    if (brand) map.set(host, brand);
  }
  return map;
}
