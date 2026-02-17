import { notFound } from "next/navigation";
import { products } from "@/data/products";

type Props = { params: { id: string } };

export default function ProductPage({ params }: Props) {
  const product = products.find((p) => p.id === params.id);
  if (!product) return notFound();

  return (
    <main style={{ padding: 24 }}>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
    </main>
  );
}
