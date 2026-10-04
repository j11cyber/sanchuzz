import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_COOKIE } from "@/lib/auth";
import { BRANDS, brandHref, parseBrandHosts, PREFIXED_BRANDS } from "@/lib/brands";

/**
 * Three jobs, in order:
 *
 * 1. Host-based brand routing. When BRAND_HOSTS maps the request host to a
 *    brand, serve that brand's route group at the root of the host
 *    (`santussabaoth.com/shop` -> `/santus-sabaoth/shop` internally) and keep
 *    URLs clean (`/santus-sabaoth/shop` on that host redirects to `/shop`).
 *    With no BRAND_HOSTS set, every brand lives under its path prefix on one
 *    host and this step does nothing.
 *
 * 2. Redirects from pre-restructure URLs to their new homes.
 *
 * 3. Admin session guard for /admin/*.
 */

const BRAND_HOSTS = parseBrandHosts(process.env.BRAND_HOSTS);

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

/** Old URL -> new URL. Exact matches only; prefixes handled below. */
const LEGACY_REDIRECTS: Record<string, string> = {
  "/shop": brandHref(BRANDS.santus, "/shop"),
  "/executive-checkup": brandHref(BRANDS.sartorial, "/checkup"),
  "/prescription-pad": brandHref(BRANDS.sartorial, "/checkup"),
  "/case-files": brandHref(BRANDS.sartorial, "/case-files"),
  "/services": brandHref(BRANDS.sartorial, "/services"),
  "/services/wardrobe-building": brandHref(BRANDS.sartorial, "/services/the-wardrobe-detox"),
  "/services/wedding-attire": brandHref(BRANDS.sartorial, "/book?occasion=wedding"),
  "/services/body-type-styling": brandHref(BRANDS.sartorial, "/checkup"),
  "/services/custom-pieces": brandHref(BRANDS.santus, "/commission"),
  "/services/cloth-of-the-day": "/daily",
  "/services/color-of-the-day": "/daily",
  "/aftercare": "/guide",
  "/cart": brandHref(BRANDS.santus, "/cart"),
  "/checkout": brandHref(BRANDS.santus, "/checkout"),
};

function hostWithoutPort(request: NextRequest): string {
  const raw = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  return raw.split(":")[0].toLowerCase();
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Host-based brand routing
  const hostBrand = BRAND_HOSTS.get(hostWithoutPort(request));
  if (hostBrand) {
    if (pathname.startsWith("/admin")) {
      // Admin lives on the house domain only.
      const houseUrl = process.env.NEXT_PUBLIC_SITE_URL;
      if (houseUrl) return NextResponse.redirect(new URL(pathname + search, houseUrl));
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
    // Clean URLs: a prefixed path on a brand host redirects to the unprefixed one.
    if (pathname === hostBrand.prefix || pathname.startsWith(`${hostBrand.prefix}/`)) {
      const clean = pathname.slice(hostBrand.prefix.length) || "/";
      return NextResponse.redirect(new URL(clean + search, request.url), 308);
    }
    // Another brand's prefix on this host: send to the house-relative path so
    // the visitor still lands somewhere sensible.
    for (const other of PREFIXED_BRANDS) {
      if (other !== hostBrand && (pathname === other.prefix || pathname.startsWith(`${other.prefix}/`))) {
        const houseUrl = process.env.NEXT_PUBLIC_SITE_URL;
        if (houseUrl) return NextResponse.redirect(new URL(pathname + search, houseUrl));
      }
    }
    // Serve this brand's route group at the root of the host.
    const url = request.nextUrl.clone();
    url.pathname = `${hostBrand.prefix}${pathname === "/" ? "" : pathname}` || hostBrand.prefix;
    return NextResponse.rewrite(url);
  }

  // 2. Legacy redirects (single-host mode only; on brand hosts these paths are brand-relative)
  const legacy = LEGACY_REDIRECTS[pathname];
  if (legacy) {
    const target = new URL(legacy, request.url);
    if (!legacy.includes("?")) target.search = search;
    return NextResponse.redirect(target, 308);
  }
  if (pathname.startsWith("/guide/") || pathname === "/guide") {
    // Guide stays on the house; nothing to do.
  }

  // 3. Admin guard
  if (pathname.startsWith("/admin")) {
    if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
      return NextResponse.next();
    }
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const secret = process.env.ADMIN_SESSION_SECRET || "default-secure-admin-session-secret-salt-2026";
    if (token) {
      try {
        await jwtVerify(token, new TextEncoder().encode(secret));
        return NextResponse.next();
      } catch {
        // fall through to redirect
      }
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Everything except Next internals, API routes and files with an extension.
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
