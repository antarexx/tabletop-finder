function Nav() {
  return (
    <header style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: "1rem" }}>
      <a href="/en" style={{ fontWeight: 700, textDecoration: "none", color: "inherit" }}>Tabletop Finder</a>

      <nav style={{ display: "flex", gap: "1rem", marginLeft: "1rem" }}>
        <a href="/en/search" style={{ textDecoration: "none" }}>Search</a>
        <a href="/en/listings" style={{ textDecoration: "none" }}>Listings</a>
        <a href="/en/profile" style={{ textDecoration: "none" }}>Profile</a>
      </nav>

      <div style={{ marginLeft: "auto" }}>
        <a href="/it" style={{ textDecoration: "none" }}>Italiano</a>
      </div>
    </header>
  );
}

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>
        <Nav />
        <div style={{ padding: "2rem 1.5rem" }}>{children}</div>
      </body>
    </html>
  );
}
