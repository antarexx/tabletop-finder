"use client";

import { useEffect, useState } from "react";

type GameKey = "RPG" | "BOARD" | "CARDS" | "MINI";
type LookingFor = "players" | "groups" | "either";

type Result = {
  id: string;
  kind: string;
  title: string;
  description: string;
  game_type: GameKey;
  looking_for: LookingFor;
  city: string | null;
  is_public_place: boolean;
  distance_km: number;
};

function formatDistanceKm(d: number | null | undefined) {
  if (d === null || d === undefined || Number.isNaN(d)) return "—";
  if (d < 1) return "< 1 km";
  return `${Math.round(d * 10) / 10} km`;
}

export default function ListingsPageIT() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<Result[]>([]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locationText: "Milano",
          radiusKm: 100,
          games: ["RPG", "BOARD", "CARDS", "MINI"],
          lookingFor: "either",
        }),
      });

      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Caricamento fallito");

      setResults((json.results ?? []) as Result[]);
    } catch (e: any) {
      setError(e?.message ?? "Errore");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h1 style={{ marginBottom: 6 }}>Annunci</h1>
          <p style={{ marginTop: 0, opacity: 0.8 }}>
            Lista MVP (temporanea): mostra annunci intorno a Milano (100km).
          </p>
        </div>

        <a
          href="/it/listings/new"
          style={{
            display: "inline-block",
            padding: "10px 14px",
            border: "1px solid #ddd",
            borderRadius: 10,
            textDecoration: "none",
          }}
        >
          Pubblica un annuncio
        </a>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={load} disabled={loading}>
          {loading ? "Aggiorno..." : "Aggiorna"}
        </button>
        <a href="/it/search" style={{ textDecoration: "underline" }}>
          Vai alla Ricerca
        </a>
        {error && <span style={{ color: "crimson" }}>{error}</span>}
      </div>

      <section style={{ marginTop: 20 }}>
        {loading && <p>Caricamento…</p>}
        {!loading && results.length === 0 && <p>Nessun annuncio ancora.</p>}

        <ul style={{ padding: 0, listStyle: "none", display: "grid", gap: 12 }}>
          {results.map((r) => (
            <li key={r.id} style={{ border: "1px solid #eee", padding: 14, borderRadius: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <strong>{r.title}</strong>
                <span>{formatDistanceKm(r.distance_km)}</span>
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
