import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: 24 }}>
      <h2>Page not found</h2>
      <p>
        Sorry, we couldn't find that page. Go back <Link href="/">home</Link>.
      </p>
    </main>
  );
}
