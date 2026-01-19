function Nav() {
  return (
    <header style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: "1rem" }}>
      <a href="/it" style={{ fontWeight: 700, textDecoration: "none", color: "inherit" }}>Tabletop Finder</a>

      <nav style={{ display: "flex", gap: "1rem", marginLeft: "1rem" }}>
        <a href="/it/search" style={{ textDecoration: "none" }}>Cerca</a>
        <a href="/it/listings" style={{ textDecoration: "none" }}>Annunci</a>
        <a href="/it/profile" style={{ textDecoration: "none" }}>Profilo</a>
      </nav>

      <div style={{ marginLeft: "auto" }}>
        <a href="/en" style={{ textDecoration: "none" }}>English</a>
      </div>
    </header>
  );
}

export default function ItLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>
        <Nav />
        <div style={{ padding: "2rem 1.5rem" }}>{children}</div>
      </body>
    </html>
  );
}
