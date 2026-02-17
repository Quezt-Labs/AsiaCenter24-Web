"use client";
import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main style={{ padding: 24 }}>
      <h2>Checkout</h2>
      <p>This is the checkout page (client).</p>
      <p>
        <Link href="/thank-you">Complete order</Link>
      </p>
    </main>
  );
}
