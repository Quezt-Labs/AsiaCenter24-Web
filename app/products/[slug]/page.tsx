import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import { products } from "@/data/products";

interface PageProps {
  params: { slug: string };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const id = String(slug).split("-")[0];
  const product = products.find((p) => p.id === id);
  if (!product) return notFound();

  return <ProductDetailClient product={product} />;
}

