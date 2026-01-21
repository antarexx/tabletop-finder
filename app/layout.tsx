import "leaflet/dist/leaflet.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>
        <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
          <strong>Tabletop Finder</strong>
          <span style={{ marginLeft: "1rem" }}>
            <a href="/en">EN</a> | <a href="/it">IT</a>
          </span>
        </header>

        <main style={{ padding: "2rem" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
