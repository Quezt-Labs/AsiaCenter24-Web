import ProductsClient from "@/components/products/ProductsClient";

export default function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  // Server component: delegate interactive UI and client hooks to a client component.
  return <ProductsClient initialSearchParams={searchParams} />;
}
