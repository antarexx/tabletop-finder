export const metadata = {
  title: "Tabletop Finder",
  description: "Find tabletop players near you",
};

function Nav({ lang }: { lang: "en" | "it" }) {
  const t = {
    en: { search: "Search", listings: "Listings", profile: "Profile", switchTo: "Italiano" },
    it: { search: "Cerca", listings: "Annunci", profile: "Profilo", switchTo: "English" },
  }[lang];

  const otherLang = lang === "en" ? "it" : "en";

  return (
    <header style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: "1rem" }}>
      <div style={{ fontWeight: 700 }}>Tabletop Finder</div>

      <nav style={{ display: "flex", gap: "1rem", marginLeft: "1rem" }}>
        <a href={`/${lang}/search`} style={{ textDecoration: "none" }}>{t.search}</a>
        <a href={`/${lang}/listings`} style={{ textDecoration: "none" }}>{t.listings}</a>
        <a href={`/${lang}/profile`} style={{ textDecoration: "none" }}>{t.profile}</a>
      </nav>

      <div style={{ marginLeft: "auto" }}>
        <a href={`/${otherLang}`} style={{ textDecoration: "none" }}>{t.switchTo}</a>
      </div>
    </header>
  );
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: "en" | "it" };
}) {
  const lang = params.lang ?? "en";

  return (
    <html lang={lang}>
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>
        <Nav lang={lang} />
        <div style={{ padding: "2rem 1.5rem" }}>{children}</div>
      </body>
    </html>
  );
}
