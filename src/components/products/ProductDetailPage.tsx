"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { useProductBySlug } from "@/hooks/useProduct";
import ProductDetailSkeleton from "./ProductDetailSkeleton";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug ? String(params.slug) : null;
  const { data: product, isLoading, isError } = useProductBySlug(slug);

  if (!slug) return notFound();
  if (isError || (!isLoading && !product)) return notFound();
  if (isLoading || !product) return <ProductDetailSkeleton />;

  return <ProductDetailClient product={product} />;
}
