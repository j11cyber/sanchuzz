import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getProductsBySection } from "@/lib/products";
import { BRANDS } from "@/lib/brands";
import ProductDetail from "@/components/ProductDetail";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.section !== "SANTUS_SABAOTH") return {};
  return { title: product.name, description: product.description };
}

export default async function SantusProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.section !== "SANTUS_SABAOTH") notFound();

  const all = await getProductsBySection("SANTUS_SABAOTH");
  const related = all.filter((p) => p.id !== product.id).slice(0, 4);

  return <ProductDetail product={product} brand={BRANDS.santus} relatedProducts={related} />;
}
