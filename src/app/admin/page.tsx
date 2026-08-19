import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/money";

export const metadata = { title: "Admin Dashboard · The Fashion Clinic" };

export default async function AdminDashboardPage() {
  const [santusCount, sartorialCount, serviceCount, caseFileCount, articleCount, recentOrders] = await Promise.all([
    prisma.product.count({ where: { section: "SANTUS_SABAOTH" } }),
    prisma.product.count({ where: { section: "SARTORIAL_EXECUTIVE" } }),
    prisma.serviceItem.count(),
    prisma.caseFile.count(),
    prisma.guideArticle.count(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  const stats = [
    { label: "Santus Sabaoth Craft", value: santusCount, href: "/admin/products/santus-sabaoth", tag: "Atelier" },
    { label: "Sartorial Executive Edit", value: sartorialCount, href: "/admin/products/sartorial-executive", tag: "Luxury" },
    { label: "Clinical Services", value: serviceCount, href: "/admin/services", tag: "Interventions" },
    { label: "Case Files Dossiers", value: caseFileCount, href: "/admin/case-files", tag: "Clinical" },
    { label: "Care & Longevity Notes", value: articleCount, href: "/admin/guide", tag: "Education" },
    { label: "Total Orders Processed", value: recentOrders.length, href: "/admin", tag: "E-Commerce" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gold">COMMAND &amp; CONTROL</span>
        <h1 className="mt-1 font-display text-3xl text-cream">The Fashion Clinic Operations</h1>
        <p className="mt-1 text-xs text-cream-dim/70">
          Real-time metrics across bespoke inventory, clinical styling services, transformation case files, and e-commerce orders.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-2xl border border-charcoal-800 bg-charcoal-900 p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-gold/50"
          >
            <div className="flex items-center justify-between">
              <span className="rounded bg-charcoal-800 px-2 py-0.5 text-[9px] uppercase tracking-widest text-gold font-semibold">
                {s.tag}
              </span>
              <span className="text-xs text-cream-dim/40 group-hover:text-gold transition">&rarr;</span>
            </div>
            <div className="mt-3 text-3xl font-display text-gold">{s.value}</div>
            <div className="mt-1 text-xs text-cream-dim/80">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Launchpad */}
      <div className="rounded-2xl border border-gold/30 bg-navy-950/80 p-6">
        <h2 className="font-display text-lg text-cream">Quick Management Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/sections"
            className="rounded-full border border-charcoal-700 bg-charcoal-900 px-4 py-2 text-xs text-cream-dim transition hover:border-gold hover:text-gold"
          >
            Homepage Section Toggles &rarr;
          </Link>
          <Link
            href="/admin/services/new"
            className="rounded-full border border-charcoal-700 bg-charcoal-900 px-4 py-2 text-xs text-cream-dim transition hover:border-gold hover:text-gold"
          >
            + Add New Service &rarr;
          </Link>
          <Link
            href="/admin/case-files/new"
            className="rounded-full border border-charcoal-700 bg-charcoal-900 px-4 py-2 text-xs text-cream-dim transition hover:border-gold hover:text-gold"
          >
            + Add Case File &rarr;
          </Link>
          <Link
            href="/admin/sartorial-executive"
            className="rounded-full border border-charcoal-700 bg-charcoal-900 px-4 py-2 text-xs text-cream-dim transition hover:border-gold hover:text-gold"
          >
            Edit Sartorial Executive Content &rarr;
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div>
        <h2 className="font-display text-xl text-cream">Recent Storefront Orders</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-charcoal-800 bg-charcoal-900">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-charcoal-800 bg-charcoal-950/60 text-[10px] uppercase tracking-wider text-gold">
              <tr>
                <th className="p-4">Reference</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-800/60 text-cream-dim">
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-cream-dim/50">
                    No orders recorded yet. Live orders via Paystack will be registered here automatically.
                  </td>
                </tr>
              )}
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-charcoal-800/40 transition">
                  <td className="p-4 font-mono text-gold">{o.reference}</td>
                  <td className="p-4 font-medium text-cream">{o.customerName}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        o.status === "PAID"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : o.status === "PENDING"
                            ? "bg-gold/20 text-gold"
                            : "bg-red-400/10 text-red-300"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4 text-cream-dim/60 font-mono">
                    {new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-cream">{formatNaira(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
