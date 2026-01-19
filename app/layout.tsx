export const metadata = {
  title: "Tabletop Finder",
  description: "Find tabletop players near you",
};

function Header() {
  return (
    <header style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: "1rem" }}>
      <a href="/en" style={{ fontWeight: 700, textDecoration: "none", color: "inherit" }}>Tabletop Finder</a>

      <nav style={{ display: "flex", gap: "1rem", marginLeft: "1rem" }}>
        <a href="/en/search" style={{ textDecoration: "none" }}>Search</a>
        <a href="/it/search" style={{ textDecoration: "none" }}>Cerca</a>
        <a href="/en/listings" style={{ textDecoration: "none" }}>Listings</a>
        <a href="/it/listings" style={{ textDecoration: "none" }}>Annunci</a>
      </nav>

      <div style={{ marginLeft: "auto", display: "flex", gap: "1rem" }}>
        <a href="/en" style={{ textDecoration: "none" }}>EN</a>
        <a href="/it" style={{ textDecoration: "none" }}>IT</a>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>
        <Header />
        <div style={{ padding: "2rem 1.5rem" }}>{children}</div>
      </body>
    </html>
  );
}
