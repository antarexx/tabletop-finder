"use client";

import React, { useMemo, useState } from "react";

type Lang = "en" | "it";
type ViewMode = "list" | "map";
type LookingFor = "players" | "groups" | "either";

type Strings = {
  title: string;
  subtitle: string;
  gameTypeLabel: string;
  gameTypeHint: string;
  locationLabel: string;
  locationPlaceholder: string;
  radiusLabel: string;
  lookingForLabel: string;
  viewLabel: string;
  listView: string;
  mapView: string;
  searchBtn: string;
  resetBtn: string;
  validationGame: string;
  validationLocation: string;
  resultsTitle: string;
  emptyTitle: string;
  emptyBody: string;
  createListing: string;
  privacyNote: string;
};

const GAME_TYPES = [
  { key: "RPG", en: "RPG", it: "GDR" },
  { key: "BOARD", en: "Board games", it: "Giochi da tavolo" },
  { key: "CARDS", en: "Card games", it: "Giochi di carte" },
  { key: "MINI", en: "Miniatures", it: "Miniature" },
] as const;

const RADIUS_OPTIONS = [5, 10, 25, 50] as const;

function Pill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "10px 12px",
        borderRadius: 999,
        border: active ? "1px solid #111" : "1px solid #ddd",
        background: active ? "#111" : "#fff",
        color: active ? "#fff" : "#111",
        cursor: "pointer",
        fontSize: 14,
      }}
    >
      {label}
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 16,
        padding: 18,
        background: "#fff",
      }}
    >
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
      {children}
    </div>
  );
}

// Mock risultati (solo per UI). Poi li sostituiamo con Supabase.
type MockResult = {
  id: string;
  kind: "private_user" | "group" | "public_place";
  title: string;
  game: string;
  distanceKm: number;
  city: string;
  note: string;
};

function getMockResults(lang: Lang): MockResult[] {
  if (lang === "it") {
    return [
      {
        id: "1",
        kind: "private_user",
        title: "Giocatore disponibile (GDR)",
        game: "GDR",
        distanceKm: 3,
        city: "Genova",
        note: "Posizione approssimata (privacy). Serate feriali.",
      },
      {
        id: "2",
        kind: "group",
        title: "Gruppo cerca 1–2 giocatori",
        game: "Giochi da tavolo",
        distanceKm: 8,
        city: "Genova",
        note: "Campagna/one-shot a rotazione. Posizione approssimata.",
      },
      {
        id: "3",
        kind: "public_place",
        title: "Negozio pubblico: The Dice Corner",
        game: "Carte + Boardgame",
        distanceKm: 5,
        city: "Genova",
        note: "Luogo pubblico: pin preciso + indirizzo (più avanti).",
      },
    ];
  }

  return [
    {
      id: "1",
      kind: "private_user",
      title: "Player available (RPG)",
      game: "RPG",
      distanceKm: 3,
      city: "Genoa",
      note: "Approximate location (privacy). Weeknights.",
    },
    {
      id: "2",
      kind: "group",
      title: "Group looking for 1–2 players",
      game: "Board games",
      distanceKm: 8,
      city: "Genoa",
      note: "Campaign/one-shots. Approximate location.",
    },
    {
      id: "3",
      kind: "public_place",
      title: "Public place: The Dice Corner",
      game: "Cards + Board games",
      distanceKm: 5,
      city: "Genoa",
      note: "Public venue: precise pin + address (later).",
    },
  ];
}

function KindBadge({ kind, lang }: { kind: MockResult["kind"]; lang: Lang }) {
  const label = useMemo(() => {
    if (lang === "it") {
      if (kind === "private_user") return "Utente";
      if (kind === "group") return "Gruppo";
      return "Luogo pubblico";
    }
    if (kind === "private_user") return "User";
    if (kind === "group") return "Group";
    return "Public place";
  }, [kind, lang]);

  const border =
    kind === "public_place" ? "1px solid #0b5" : "1px solid #ddd";

  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 12,
        padding: "4px 10px",
        borderRadius: 999,
        border,
        opacity: 0.9,
      }}
    >
      {label}
    </span>
  );
}

export default function SearchPage({
  lang,
  strings,
}: {
  lang: Lang;
  strings: Strings;
}) {
  const [view, setView] = useState<ViewMode>("list");

  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [locationText, setLocationText] = useState("");
  const [radiusKm, setRadiusKm] = useState<number>(25);
  const [lookingFor, setLookingFor] = useState<LookingFor>("either");

  const [submitted, setSubmitted] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const errors = useMemo(() => {
    if (!submitted) return { game: "", location: "" };
    return {
      game: selectedGames.length === 0 ? strings.validationGame : "",
      location: locationText.trim().length === 0 ? strings.validationLocation : "",
    };
  }, [submitted, selectedGames.length, locationText, strings.validationGame, strings.validationLocation]);

  const results = useMemo(() => {
    // mock: se non è stata fatta ricerca, niente risultati
    if (!hasSearched) return [];

    // mock: se location è “nowhere”, ritorna empty
    const loc = locationText.trim().toLowerCase();
    if (loc === "nowhere" || loc === "nessunluogo") return [];

    // mock: ritorna sempre gli stessi risultati
    return getMockResults(lang);
  }, [hasSearched, lang, locationText]);

  function toggleGame(key: string) {
    setSelectedGames((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  }

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);

    const ok = selectedGames.length > 0 && locationText.trim().length > 0;
    if (!ok) return;

    setHasSearched(true);
    // in futuro: chiamata Supabase qui
  }

  function onReset() {
    setSubmitted(false);
    setHasSearched(false);
    setSelectedGames([]);
    setLocationText("");
    setRadiusKm(25);
    setLookingFor("either");
    setView("list");
  }

  return (
    <div style={{ maxWidth: 920, margin: "0 auto" }}>
      <h2 style={{ margin: "0 0 8px 0", fontSize: 30 }}>{strings.title}</h2>
      <p style={{ margin: "0 0 18px 0", opacity: 0.85 }}>{strings.subtitle}</p>

      <Card>
        <form onSubmit={onSearch}>
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <FieldLabel>{strings.gameTypeLabel}</FieldLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {GAME_TYPES.map((g) => (
                  <Pill
                    key={g.key}
                    active={selectedGames.includes(g.key)}
                    label={lang === "it" ? g.it : g.en}
                    onClick={() => toggleGame(g.key)}
                  />
                ))}
              </div>

              <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>
                {selectedGames.length === 0 ? strings.gameTypeHint : " "}
              </div>
              {errors.game ? (
                <div style={{ marginTop: 6, fontSize: 13, color: "#b00" }}>
                  {errors.game}
                </div>
              ) : null}
            </div>

            <div>
              <FieldLabel>{strings.locationLabel}</FieldLabel>
              <input
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder={strings.locationPlaceholder}
                style={{
                  width: "100%",
                  padding: "12px 12px",
                  borderRadius: 12,
                  border: "1px solid #ddd",
                  fontSize: 15,
                }}
              />
              {errors.location ? (
                <div style={{ marginTop: 6, fontSize: 13, color: "#b00" }}>
                  {errors.location}
                </div>
              ) : null}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <FieldLabel>{strings.radiusLabel}</FieldLabel>
                <select
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "12px 12px",
                    borderRadius: 12,
                    border: "1px solid #ddd",
                    fontSize: 15,
                    background: "#fff",
                  }}
                >
                  {RADIUS_OPTIONS.map((km) => (
                    <option key={km} value={km}>
                      {km} km
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel>{strings.lookingForLabel}</FieldLabel>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="lookingFor"
                      checked={lookingFor === "players"}
                      onChange={() => setLookingFor("players")}
                    />
                    {lang === "it" ? "Giocatori" : "Players"}
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="lookingFor"
                      checked={lookingFor === "groups"}
                      onChange={() => setLookingFor("groups")}
                    />
                    {lang === "it" ? "Gruppi" : "Groups"}
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="lookingFor"
                      checked={lookingFor === "either"}
                      onChange={() => setLookingFor("either")}
                    />
                    {lang === "it" ? "Entrambi" : "Either"}
                  </label>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{strings.viewLabel}</span>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: view === "list" ? "1px solid #111" : "1px solid #ddd",
                    background: view === "list" ? "#111" : "#fff",
                    color: view === "list" ? "#fff" : "#111",
                    cursor: "pointer",
                  }}
                >
                  {strings.listView}
                </button>
                <button
                  type="button"
                  onClick={() => setView("map")}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: view === "map" ? "1px solid #111" : "1px solid #ddd",
                    background: view === "map" ? "#111" : "#fff",
                    color: view === "map" ? "#fff" : "#111",
                    cursor: "pointer",
                  }}
                >
                  {strings.mapView}
                </button>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="submit"
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "1px solid #111",
                    background: "#111",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 15,
                  }}
                >
                  {strings.searchBtn}
                </button>
                <button
                  type="button"
                  onClick={onReset}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "1px solid #ddd",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: 15,
                  }}
                >
                  {strings.resetBtn}
                </button>
              </div>
            </div>

            <div style={{ fontSize: 12, opacity: 0.75 }}>
              {strings.privacyNote}
            </div>
          </div>
        </form>
      </Card>

      <div style={{ marginTop: 18 }}>
        {hasSearched ? (
          <>
            <h3 style={{ margin: "18px 0 10px 0" }}>{strings.resultsTitle}</h3>

            {results.length === 0 ? (
              <Card>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>{strings.emptyTitle}</div>
                <div style={{ opacity: 0.85, lineHeight: 1.5 }}>{strings.emptyBody}</div>
                <div style={{ marginTop: 12 }}>
                  <a
                    href={`/${lang}/listings`}
                    style={{ textDecoration: "none", border: "1px solid #111", padding: "10px 12px", borderRadius: 12, display: "inline-block" }}
                  >
                    {strings.createListing}
                  </a>
                </div>
              </Card>
            ) : view === "list" ? (
              <div style={{ display: "grid", gap: 12 }}>
                {results.map((r) => (
                  <Card key={r.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                      <div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                          <div style={{ fontWeight: 800 }}>{r.title}</div>
                          <KindBadge kind={r.kind} lang={lang} />
                        </div>
                        <div style={{ marginTop: 6, fontSize: 14, opacity: 0.85 }}>
                          {r.game} · {r.city} · {r.distanceKm} km
                        </div>
                        <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>{r.note}</div>
                      </div>

                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        style={{
                          textDecoration: "none",
                          border: "1px solid #ddd",
                          padding: "10px 12px",
                          borderRadius: 12,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {lang === "it" ? "Apri" : "Open"}
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>
                  {lang === "it" ? "Mappa (in arrivo)" : "Map (coming soon)"}
                </div>
                <div style={{ opacity: 0.85, lineHeight: 1.5 }}>
                  {lang === "it"
                    ? "Qui mostreremo i segnalini. Per utenti/gruppi la posizione sarà approssimata; per luoghi pubblici sarà precisa."
                    : "Here we will show pins. For users/groups the location will be approximate; for public places it will be precise."}
                </div>
                <div
                  style={{
                    marginTop: 12,
                    height: 260,
                    borderRadius: 14,
                    border: "1px dashed #ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.8,
                  }}
                >
                  {lang === "it" ? "Map widget placeholder" : "Map widget placeholder"}
                </div>
              </Card>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
