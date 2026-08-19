import { notFound } from "next/navigation";
import Link from "next/link";
import { sectionFromSlug } from "@/lib/products";
import { createProductAction } from "@/lib/actions/admin-products";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: sectionSlug } = await params;
  const section = sectionFromSlug(sectionSlug);
  if (!section) notFound();

  const action = createProductAction.bind(null, section);
  const label = section === "SANTUS_SABAOTH" ? "Santus Sabaoth" : "Sartorial Executive";

  return (
    <div>
      <Link href={`/admin/products/${sectionSlug}`} className="text-sm text-cream-dim/60 hover:text-gold">
        ← Back to {label} inventory
      </Link>
      <h1 className="mt-3 font-display text-3xl text-cream">Add Product</h1>
      <ProductForm action={action} section={section} submitLabel="Create product" />
    </div>
  );
}
