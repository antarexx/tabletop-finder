"use client";

import { useMemo, useState } from "react";

type GameKey = "RPG" | "BOARD" | "CARDS" | "MINI";
type LookingFor = "players" | "groups" | "either";
type KindKey = "private_user" | "group" | "public_place";

export default function NewListingEN() {
  const [kind, setKind] = useState<KindKey>("group");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gameType, setGameType] = useState<GameKey>("RPG");
  const [lookingFor, setLookingFor] = useState<LookingFor>("players");
  const [city, setCity] = useState("Milano");
  const [country, setCountry] = useState("IT");
  const [isPublicPlace, setIsPublicPlace] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState<string>("");

  const cityHelp = useMemo(
    () => "MVP cities: Milano / Roma / Bologna / Genova / Torino / Napoli / Firenze",
    []
  );

  async function onSubmit() {
    setLoading(true);
    setError("");
    setSuccessId("");

    try {
      const res = await fetch("/api/listings/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind,
          title,
          description,
          gameType,
          lookingFor,
          city,
          country,
          isPublicPlace,
        }),
      });

      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Create failed");

      setSuccessId(String(json.id));
      setTitle("");
      setDescription("");
    } catch (e: any) {
      setError(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Create a listing</h1>
      <p>Add yourself, your group, or a public place.</p>

      <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12 }}>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <strong>Type</strong>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as KindKey)}
              style={{ width: "100%", padding: 10, marginTop: 8 }}
              disabled={isPublicPlace}
              title={isPublicPlace ? "Public place forces type = public_place" : ""}
            >
              <option value="private_user">Private user</option>
              <option value="group">Group</option>
              <option value="public_place">Public place</option>
            </select>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
              If you check “Public place”, the type becomes “Public place”.
            </div>
          </div>

          <div>
            <strong>Game</strong>
            <select
              value={gameType}
              onChange={(e) => setGameType(e.target.value as GameKey)}
              style={{ width: "100%", padding: 10, marginTop: 8 }}
            >
              <option value="RPG">RPG</option>
              <option value="BOARD">Board games</option>
              <option value="CARDS">Card games</option>
              <option value="MINI">Miniatures</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Title</strong>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. D&D 5e weekly campaign"
            style={{ width: "100%", padding: 10, marginTop: 8 }}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Description</strong>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description (optional)"
            rows={4}
            style={{ width: "100%", padding: 10, marginTop: 8, resize: "vertical" }}
          />
        </div>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 220px", marginTop: 12 }}>
          <div>
            <strong>City</strong>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Milano"
              style={{ width: "100%", padding: 10, marginTop: 8 }}
            />
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>{cityHelp}</div>
          </div>

          <div>
            <strong>Country</strong>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="IT"
              style={{ width: "100%", padding: 10, marginTop: 8 }}
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Looking for</strong>
          <select
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value as LookingFor)}
            style={{ width: 260, padding: 10, marginTop: 8 }}
          >
            <option value="players">Players</option>
            <option value="groups">Groups</option>
            <option value="either">Either</option>
          </select>
        </div>

        <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
          <input
            type="checkbox"
            checked={isPublicPlace}
            onChange={(e) => setIsPublicPlace(e.target.checked)}
          />
          Public place (shop / club / venue) — exact location allowed
        </label>

        <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={onSubmit} disabled={loading || !title.trim() || !city.trim()}>
            {loading ? "Saving..." : "Save listing"}
          </button>

          <a href="/en/search" style={{ textDecoration: "underline" }}>
            Go to Search
          </a>

          {error && <span style={{ color: "crimson" }}>{error}</span>}
          {successId && (
            <span style={{ color: "green" }}>
              Saved! ID: <code>{successId}</code>
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
