import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sectionFromSlug } from "@/lib/products";
import { formatNaira } from "@/lib/money";

export default async function AdminProductsListPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: sectionSlug } = await params;
  const section = sectionFromSlug(sectionSlug);
  if (!section) notFound();

  const products = await prisma.product.findMany({
    where: { section },
    orderBy: { createdAt: "desc" },
  });

  const label = section === "SANTUS_SABAOTH" ? "Santus Sabaoth" : "Sartorial Executive";

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-cream">{label} Inventory</h1>
        <Link
          href={`/admin/products/${sectionSlug}/new`}
          className="rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
        >
          + Add product
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-charcoal-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-charcoal-900 text-xs uppercase tracking-widest text-cream-dim/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              {section === "SARTORIAL_EXECUTIVE" && <th className="px-4 py-3">Brand</th>}
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-cream-dim/50">
                  No products yet.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-t border-charcoal-800">
                <td className="px-4 py-3 text-cream">
                  {p.name}
                  {p.featured && <span className="ml-2 text-xs text-gold">★ featured</span>}
                </td>
                {section === "SARTORIAL_EXECUTIVE" && (
                  <td className="px-4 py-3 text-cream-dim/70">{p.brand}</td>
                )}
                <td className="px-4 py-3 text-cream-dim/70">{p.category}</td>
                <td className="px-4 py-3 text-cream-dim/70">{formatNaira(p.price)}</td>
                <td className="px-4 py-3 text-cream-dim/70">{p.stock}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${sectionSlug}/${p.id}/edit`}
                    className="text-gold hover:text-gold-soft"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
