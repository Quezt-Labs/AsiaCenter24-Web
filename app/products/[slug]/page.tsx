import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import { products } from "@/data/products";
import { getProductBySlug, getProductById } from "@/api/products";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const slugStr = String(slug);

  let product = await getProductBySlug(slugStr).catch(() => null);
  if (!product) {
    const id = slugStr.split("-")[0];
    product = await getProductById(id).catch(() => null);
  }
  if (!product) {
    const id = slugStr.split("-")[0];
    const fallback = products.find((p) => p.id === id);
    if (fallback) product = fallback;
  }
  if (!product) return notFound();

  return <ProductDetailClient product={product} />;
}
