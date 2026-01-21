"use client";

import { useState } from "react";

type Kind = "private_user" | "group" | "public_place";
type GameKey = "RPG" | "BOARD" | "CARDS" | "MINI";
type LookingFor = "players" | "groups" | "either";

export default function NewListingEN() {
  const [kind, setKind] = useState<Kind>("group");
  const [gameType, setGameType] = useState<GameKey>("RPG");
  const [lookingFor, setLookingFor] = useState<LookingFor>("players");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("Milano");
  const [isPublicPlace, setIsPublicPlace] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [okMsg, setOkMsg] = useState<string>("");

  async function onSubmit() {
    setLoading(true);
    setError("");
    setOkMsg("");

    try {
      const res = await fetch("/api/listings/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind,
          game_type: gameType,
          looking_for: lookingFor,
          title,
          description,
          city,
          is_public_place: isPublicPlace,
        }),
      });

      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Create failed");

      setOkMsg("Saved! Redirecting…");
      setTimeout(() => {
        window.location.href = "/en/listings";
      }, 400);
    } catch (e: any) {
      setError(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Create a listing</h1>
      <p style={{ marginTop: 6, opacity: 0.8 }}>
        MVP: location is city-based for now (privacy-friendly). Public places can be precise later.
      </p>

      <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12, marginTop: 16 }}>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <strong>Type</strong>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as Kind)}
              style={{ width: "100%", padding: 10, marginTop: 8 }}
            >
              <option value="group">Group</option>
              <option value="private_user">Private user</option>
              <option value="public_place">Public place (club / shop)</option>
            </select>
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

        <div style={{ marginTop: 12 }}>
          <strong>Title</strong>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. D&D 5e weekly campaign"
            style={{ width: "100%", padding: 10, marginTop: 8 }}
            maxLength={120}
          />
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>{title.length}/120</div>
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Description (optional)</strong>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A few details… schedule, vibe, experience level…"
            style={{ width: "100%", padding: 10, marginTop: 8, minHeight: 120 }}
            maxLength={1000}
          />
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
            {description.length}/1000
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>City / area</strong>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Milano"
            style={{ width: "100%", padding: 10, marginTop: 8 }}
          />
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
            MVP: try Milano / Roma / Bologna / Genova / Torino / Napoli / Firenze
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={isPublicPlace}
              onChange={(e) => setIsPublicPlace(e.target.checked)}
            />
            <span>
              <strong>Public place</strong> (club / shop / venue — ok to show precise location later)
            </span>
          </label>
          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
            If unchecked, we treat it as approximate area for privacy.
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={onSubmit} disabled={loading || !title.trim() || !city.trim()}>
            {loading ? "Saving…" : "Save listing"}
          </button>
          <a href="/en/listings" style={{ textDecoration: "underline" }}>
            Back to listings
          </a>
          {error && <span style={{ color: "crimson" }}>{error}</span>}
          {okMsg && <span style={{ color: "green" }}>{okMsg}</span>}
        </div>
      </div>
    </main>
  );
}
