"use client";
import Link from "next/link";

export default function CartPage() {
  return (
    <main style={{ padding: 24 }}>
      <h2>Cart</h2>
      <p>This is the cart page (client).</p>
      <p>
        <Link href="/checkout">Proceed to Checkout</Link>
      </p>
    </main>
  );
}
