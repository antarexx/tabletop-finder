"use client";

import { useMemo, useState } from "react";
import ResultsMap, { type Result } from "@/app/components/ResultsMap";

type GameKey = "RPG" | "BOARD" | "CARDS" | "MINI";
type LookingFor = "players" | "groups" | "either";

export default function SearchPageIT() {
  const [locationText, setLocationText] = useState("Milano");
  const [radiusKm, setRadiusKm] = useState(50);
  const [lookingFor, setLookingFor] = useState<LookingFor>("either");
  const [games, setGames] = useState<GameKey[]>(["RPG"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<Result[]>([]);

  const gameOptions: { key: GameKey; label: string }[] = useMemo(
    () => [
      { key: "RPG", label: "GDR" },
      { key: "BOARD", label: "Giochi da tavolo" },
      { key: "CARDS", label: "Carte" },
      { key: "MINI", label: "Miniature" },
    ],
    []
  );

  function toggleGame(g: GameKey) {
    setGames((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  }

  async function onSearch() {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locationText, radiusKm, games, lookingFor }),
      });

      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Ricerca fallita");

      setResults(json.results as Result[]);
    } catch (e: any) {
      setError(e?.message ?? "Errore");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Cerca</h1>
      <p>Trova giocatori vicino a te.</p>

      <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12 }}>
        <div style={{ marginBottom: 12 }}>
          <strong>Tipo di gioco</strong>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            {gameOptions.map((opt) => (
              <label key={opt.key} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={games.includes(opt.key)}
                  onChange={() => toggleGame(opt.key)}
                />
                {opt.label}
              </label>
            ))}
          </div>
          {games.length === 0 && <div style={{ color: "crimson" }}>Seleziona almeno uno.</div>}
        </div>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 160px" }}>
          <div>
            <strong>Posizione</strong>
            <input
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder="Città, CAP o zona"
              style={{ width: "100%", padding: 10, marginTop: 8 }}
            />
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
              MVP: prova Milano / Roma / Bologna / Genova / Torino / Napoli / Firenze
            </div>
          </div>

          <div>
            <strong>Raggio</strong>
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              style={{ width: "100%", padding: 10, marginTop: 8 }}
            >
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Cerchi</strong>
          <select
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value as LookingFor)}
            style={{ width: 220, padding: 10, marginTop: 8 }}
          >
            <option value="either">Entrambi</option>
            <option value="players">Giocatori</option>
            <option value="groups">Gruppi</option>
          </select>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={onSearch} disabled={loading || games.length === 0}>
            {loading ? "Cerco..." : "Cerca"}
          </button>
          {error && <span style={{ color: "crimson" }}>{error}</span>}
        </div>
      </div>

      {/* MAP */}
      <ResultsMap results={results} centerQuery={locationText} lang="it" />

      <section style={{ marginTop: 24 }}>
        <h2>Risultati</h2>
        {results.length === 0 && !loading && <p>Nessun risultato ancora.</p>}

        <ul style={{ padding: 0, listStyle: "none", display: "grid", gap: 12 }}>
          {results.map((r) => (
            <li key={r.id} style={{ border: "1px solid #eee", padding: 14, borderRadius: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <strong>{r.title}</strong>
                <span>{Math.round(r.distance_km)} km</span>
              </div>
              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
                {r.game_type} • {r.kind} • {r.city ?? "—"}
                {r.is_public_place ? " • Luogo pubblico" : " • Zona approssimata"}
              </div>
              {r.description && <p style={{ marginTop: 8 }}>{r.description}</p>}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
