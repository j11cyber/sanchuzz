import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { sectionFromSlug, serializeProduct } from "@/lib/products";
import { updateProductAction, deleteProductAction } from "@/lib/actions/admin-products";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ section: string; id: string }>;
}) {
  const { section: sectionSlug, id } = await params;
  const section = sectionFromSlug(sectionSlug);
  if (!section) notFound();

  const dbProduct = await prisma.product.findUnique({ where: { id } });
  if (!dbProduct || dbProduct.section !== section) notFound();
  const product = serializeProduct(dbProduct);

  const updateAction = updateProductAction.bind(null, id);
  const deleteAction = deleteProductAction.bind(null, id);
  const label = section === "SANTUS_SABAOTH" ? "Santus Sabaoth" : "Sartorial Executive";

  return (
    <div>
      <Link href={`/admin/products/${sectionSlug}`} className="text-sm text-cream-dim/60 hover:text-gold">
        ← Back to {label} inventory
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-display text-3xl text-cream">Edit Product</h1>
        <form action={deleteAction}>
          <button type="submit" className="text-sm text-red-300 hover:text-red-200">
            Delete product
          </button>
        </form>
      </div>
      <ProductForm action={updateAction} section={section} product={product} submitLabel="Save changes" />
    </div>
  );
}
