export default function HomeIt() {
  return (
    <div style={{ maxWidth: 920, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center" }}>
        <div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: 44, letterSpacing: -0.5 }}>Tabletop Finder</h1>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, opacity: 0.85 }}>
            Trova giocatori e gruppi vicino a te.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <a href="/en" style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10, textDecoration: "none" }}>
            EN
          </a>
          <a href="/it" style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10, textDecoration: "none" }}>
            IT
          </a>
        </div>
      </div>

      <div style={{ marginTop: 28, padding: 18, border: "1px solid #eee", borderRadius: 16 }}>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8, fontSize: 16 }}>
          <li>Scegli cosa giochi: GDR, carte, giochi da tavolo, miniature</li>
          <li>Imposta un raggio in km dalla tua zona</li>
          <li>Contatta giocatori e gruppi nella tua area</li>
        </ul>
      </div>

      <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a
          href="/it/search"
          style={{
            display: "inline-block",
            padding: "12px 16px",
            borderRadius: 12,
            textDecoration: "none",
            border: "1px solid #111",
          }}
        >
          Inizia a cercare
        </a>

        <a
          href="/it/listings"
          style={{
            display: "inline-block",
            padding: "12px 16px",
            borderRadius: 12,
            textDecoration: "none",
            border: "1px solid #ddd",
          }}
        >
          Pubblica un annuncio
        </a>
      </div>

      <p style={{ marginTop: 18, fontSize: 13, opacity: 0.75 }}>
        In arrivo: login, profili e annunci reali.
      </p>
    </div>
  );
}
