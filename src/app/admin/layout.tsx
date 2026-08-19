import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/admin-auth";

const links = [
  { href: "/admin", label: "Overview & Stats" },
  { href: "/admin/sections", label: "Homepage Section Toggles" },
  { href: "/admin/services", label: "Services Catalogue" },
  { href: "/admin/case-files", label: "Case Files Manager" },
  { href: "/admin/sartorial-executive", label: "Sartorial Executive Content" },
  { href: "/admin/prescription-pad", label: "Prescription Pad Settings" },
  { href: "/admin/products/santus-sabaoth", label: "Santus Sabaoth Inventory" },
  { href: "/admin/products/sartorial-executive", label: "Sartorial Executive Inventory" },
  { href: "/admin/guide", label: "Guide Articles" },
  { href: "/admin/daily-picks", label: "Daily Picks" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  if (!session) {
    return <div className="mx-auto max-w-7xl px-5 sm:px-8">{children}</div>;
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row">
      <aside className="shrink-0 md:w-64 border-r border-charcoal-800/80 pr-6">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gold">The Fashion Clinic</div>
        <div className="font-display text-lg text-cream">Admin Command Center</div>
        <div className="mt-1 text-xs text-emerald-400 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {session.username} (Authenticated)
        </div>

        <nav className="mt-6 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block rounded-lg px-3 py-2 text-xs text-cream-dim transition hover:bg-charcoal-900 hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 border-t border-charcoal-800 pt-4">
          <Link
            href="/"
            target="_blank"
            className="block text-xs text-gold hover:underline"
          >
            ↗ View Public Website
          </Link>
          <form action={logoutAction} className="mt-3">
            <button className="text-xs text-cream-dim/50 hover:text-red-300">Sign out of admin</button>
          </form>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
