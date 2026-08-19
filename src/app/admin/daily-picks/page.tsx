import { prisma } from "@/lib/prisma";
import { createDailyPickAction, deleteDailyPickAction } from "@/lib/actions/admin-daily-picks";

export default async function AdminDailyPicksPage() {
  const [picks, products] = await Promise.all([
    prisma.dailyPick.findMany({ orderBy: { date: "desc" }, take: 20, include: { product: true } }),
    prisma.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, section: true } }),
  ]);

  const currentClothId = picks.find((p) => p.type === "CLOTH")?.id;
  const currentColorId = picks.find((p) => p.type === "COLOR")?.id;

  return (
    <div>
      <h1 className="font-display text-3xl text-cream">Daily Picks</h1>
      <p className="mt-2 max-w-xl text-sm text-cream-dim/60">
        The most recently added Cloth pick and Color pick are the ones shown live on the
        storefront&rsquo;s Cloth of the Day / Color of the Day pages.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 shadow-soft">
          <h2 className="font-display text-lg text-cream">New Cloth of the Day</h2>
          <form action={createDailyPickAction} className="mt-4 space-y-4">
            <input type="hidden" name="type" value="CLOTH" />
            <div>
              <label className="text-xs uppercase tracking-widest text-cream-dim/50">Title</label>
              <input
                name="title"
                required
                className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-950 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-cream-dim/50">Styling note</label>
              <textarea
                name="description"
                required
                rows={3}
                className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-950 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-cream-dim/50">Image URL</label>
              <input
                name="imageUrl"
                className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-950 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-cream-dim/50">
                Link to product (optional)
              </label>
              <select
                name="productId"
                className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-950 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
              >
                <option value="">None</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
            >
              Set as today&rsquo;s cloth
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 shadow-soft">
          <h2 className="font-display text-lg text-cream">New Color of the Day</h2>
          <form action={createDailyPickAction} className="mt-4 space-y-4">
            <input type="hidden" name="type" value="COLOR" />
            <div>
              <label className="text-xs uppercase tracking-widest text-cream-dim/50">Color name</label>
              <input
                name="title"
                required
                placeholder="Burnt Umber"
                className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-950 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-cream-dim/50">Styling note</label>
              <textarea
                name="description"
                required
                rows={3}
                className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-950 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-cream-dim/50">
                Hex color
              </label>
              <input
                name="colorHex"
                required
                placeholder="#7A4B2A"
                className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-950 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
            >
              Set as today&rsquo;s color
            </button>
          </form>
        </div>
      </div>

      <h2 className="mt-12 font-display text-xl text-cream">History</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-charcoal-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-charcoal-900 text-xs uppercase tracking-widest text-cream-dim/50">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {picks.map((p) => {
              const isCurrent = p.id === currentClothId || p.id === currentColorId;
              const deleteAction = deleteDailyPickAction.bind(null, p.id);
              return (
                <tr key={p.id} className="border-t border-charcoal-800">
                  <td className="px-4 py-3 text-cream-dim/70">{p.type}</td>
                  <td className="px-4 py-3 text-cream">
                    {p.title}
                    {isCurrent && <span className="ml-2 text-xs text-gold">● live</span>}
                  </td>
                  <td className="px-4 py-3 text-cream-dim/70">
                    {p.date.toISOString().slice(0, 10)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteAction}>
                      <button type="submit" className="text-red-300 hover:text-red-200">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
