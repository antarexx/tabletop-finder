"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ResultsMap, { type Result } from "@/app/components/ResultsMap";

type GameKey = "RPG" | "BOARD" | "CARDS" | "MINI";
type LookingFor = "players" | "groups" | "either";

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
          games: ["RPG", "BOARD", "CARDS", "MINI"] as GameKey[],
          lookingFor: "either" as LookingFor,
        }),
      });

      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Errore caricamento annunci");

      setResults(json.results as Result[]);
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
          <div style={{ opacity: 0.8 }}>
            Lista MVP (temporanea): mostra annunci intorno a Milano (100km).
          </div>
        </div>

        <Link
          href="/it/listings/new"
          style={{
            padding: "10px 14px",
            border: "1px solid #ddd",
            borderRadius: 10,
            textDecoration: "none",
          }}
        >
          Crea un annuncio
        </Link>
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 12, alignItems: "center" }}>
        <button onClick={load} disabled={loading}>
          {loading ? "Aggiorno..." : "Aggiorna"}
        </button>
        <Link href="/it/search">Vai alla ricerca</Link>
        {error ? <span style={{ color: "crimson" }}>{error}</span> : null}
      </div>

      {/* MAP */}
      <ResultsMap results={results} centerQuery="Milano" lang="it" />

      <section style={{ marginTop: 18 }}>
        <h2 style={{ marginBottom: 10 }}>Risultati</h2>

        {results.length === 0 && !loading ? <p>Nessun annuncio ancora.</p> : null}

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
              {r.description ? <p style={{ marginTop: 8 }}>{r.description}</p> : null}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
