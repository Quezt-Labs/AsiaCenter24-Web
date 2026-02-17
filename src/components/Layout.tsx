export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
      {children}
    </div>
  );
}
