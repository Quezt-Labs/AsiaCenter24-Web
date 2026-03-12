import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import { products } from "@/data/products";
import { getProductBySlug, getProductById } from "@/api/products";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const slugStr = String(slug);

  // 1. Try product-by-slug API first (e.g. "dal", "herbal-pain-relief-oil")
  let product = await getProductBySlug(slugStr).catch(() => null);

  // 2. Fallback: try by ID if slug looks like UUID
  if (!product && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugStr)) {
    product = await getProductById(slugStr).catch(() => null);
  }

  // 3. Fallback: static products (match by slug or slugify(name))
  if (!product) {
    const fallback = products.find(
      (p) =>
        p.slug === slugStr ||
        slugify(p.name) === slugStr ||
        p.id === slugStr,
    );
    if (fallback) product = fallback;
  }

  if (!product) return notFound();

  return <ProductDetailClient product={product} />;
}
