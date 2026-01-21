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
  distance_km: number; // la nostra RPC la può dare; qui è ok anche se 0
};

export default function ListingsPageEN() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<Result[]>([]);

  // MVP: riuso la search con parametri fissi (Milano, 100km, tutti i game)
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
      if (!json.ok) throw new Error(json.error || "Load failed");

      setResults((json.results ?? []) as Result[]);
    } catch (e: any) {
      setError(e?.message ?? "Error");
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
          <h1 style={{ marginBottom: 6 }}>Listings</h1>
          <p style={{ marginTop: 0, opacity: 0.8 }}>
            MVP list (temporary): shows listings around Milano (100km).
          </p>
        </div>

        <a
          href="/en/listings/new"
          style={{
            display: "inline-block",
            padding: "10px 14px",
            border: "1px solid #ddd",
            borderRadius: 10,
            textDecoration: "none",
          }}
        >
          Create a listing
        </a>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={load} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
        <a href="/en/search" style={{ textDecoration: "underline" }}>
          Go to Search
        </a>
        {error && <span style={{ color: "crimson" }}>{error}</span>}
      </div>

      <section style={{ marginTop: 20 }}>
        {loading && <p>Loading…</p>}
        {!loading && results.length === 0 && <p>No listings yet.</p>}

        <ul style={{ padding: 0, listStyle: "none", display: "grid", gap: 12 }}>
          {results.map((r) => (
            <li key={r.id} style={{ border: "1px solid #eee", padding: 14, borderRadius: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <strong>{r.title}</strong>
                <span>{Math.round((r.distance_km ?? 0) * 10) / 10} km</span>
              </div>

              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
                {r.game_type} • {r.kind} • {r.city ?? "—"}
                {r.is_public_place ? " • Public place" : " • Approx. area"}
              </div>

              {r.description && <p style={{ marginTop: 8 }}>{r.description}</p>}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
