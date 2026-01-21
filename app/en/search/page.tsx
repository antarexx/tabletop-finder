"use client";

import { useMemo, useState } from "react";

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

function formatKm(km: number) {
  if (!Number.isFinite(km)) return "—";
  if (km < 1) return "< 1 km";
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export default function SearchPageEN() {
  const [locationText, setLocationText] = useState("Milano");
  const [radiusKm, setRadiusKm] = useState(50);
  const [lookingFor, setLookingFor] = useState<LookingFor>("either");
  const [games, setGames] = useState<GameKey[]>(["RPG"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<Result[]>([]);

  const gameOptions: { key: GameKey; label: string }[] = useMemo(
    () => [
      { key: "RPG", label: "RPG" },
      { key: "BOARD", label: "Board games" },
      { key: "CARDS", label: "Card games" },
      { key: "MINI", label: "Miniatures" },
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
      if (!json.ok) throw new Error(json.error || "Search failed");

      setResults(json.results as Result[]);
    } catch (e: any) {
      setError(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Search</h1>
      <p>Find players near you.</p>

      <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12 }}>
        <div style={{ marginBottom: 12 }}>
          <strong>Game type</strong>
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
          {games.length === 0 && <div style={{ color: "crimson" }}>Select at least one.</div>}
        </div>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 160px" }}>
          <div>
            <strong>Location</strong>
            <input
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder="City, ZIP code, or area"
              style={{ width: "100%", padding: 10, marginTop: 8 }}
            />
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
              MVP: try Milano / Roma / Bologna / Genova / Torino / Napoli / Firenze
            </div>
          </div>

          <div>
            <strong>Radius</strong>
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
          <strong>Looking for</strong>
          <select
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value as LookingFor)}
            style={{ width: 220, padding: 10, marginTop: 8 }}
          >
            <option value="either">Either</option>
            <option value="players">Players</option>
            <option value="groups">Groups</option>
          </select>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={onSearch} disabled={loading || games.length === 0}>
            {loading ? "Searching..." : "Search"}
          </button>
          {error && <span style={{ color: "crimson" }}>{error}</span>}
        </div>
      </div>

      <section style={{ marginTop: 24 }}>
        <h2>Results</h2>
        {results.length === 0 && !loading && <p>No results yet.</p>}
        <ul style={{ padding: 0, listStyle: "none", display: "grid", gap: 12 }}>
          {results.map((r) => (
            <li key={r.id} style={{ border: "1px solid #eee", padding: 14, borderRadius: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <strong>{r.title}</strong>
                <span>{formatKm(r.distance_km)}</span>
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
