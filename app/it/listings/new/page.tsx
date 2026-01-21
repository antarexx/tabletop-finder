"use client";

import { useState } from "react";

type Kind = "private_user" | "group" | "public_place";
type GameKey = "RPG" | "BOARD" | "CARDS" | "MINI";
type LookingFor = "players" | "groups" | "either";

export default function NewListingIT() {
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
      if (!json.ok) throw new Error(json.error || "Creazione fallita");

      setOkMsg("Salvato! Reindirizzo…");
      setTimeout(() => {
        window.location.href = "/it/listings";
      }, 400);
    } catch (e: any) {
      setError(e?.message ?? "Errore");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Pubblica un annuncio</h1>
      <p style={{ marginTop: 6, opacity: 0.8 }}>
        MVP: per ora la posizione è basata sulla città (più privacy). I luoghi pubblici potranno
        essere precisi più avanti.
      </p>

      <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12, marginTop: 16 }}>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <strong>Tipo</strong>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as Kind)}
              style={{ width: "100%", padding: 10, marginTop: 8 }}
            >
              <option value="group">Gruppo</option>
              <option value="private_user">Utente</option>
              <option value="public_place">Luogo pubblico (circolo / negozio)</option>
            </select>
          </div>

          <div>
            <strong>Gioco</strong>
            <select
              value={gameType}
              onChange={(e) => setGameType(e.target.value as GameKey)}
              style={{ width: "100%", padding: 10, marginTop: 8 }}
            >
              <option value="RPG">GDR</option>
              <option value="BOARD">Giochi da tavolo</option>
              <option value="CARDS">Carte</option>
              <option value="MINI">Miniature</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Cerco</strong>
          <select
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value as LookingFor)}
            style={{ width: 260, padding: 10, marginTop: 8 }}
          >
            <option value="players">Giocatori</option>
            <option value="groups">Gruppi</option>
            <option value="either">Entrambi</option>
          </select>
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Titolo</strong>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="es. Campagna D&D 5e settimanale"
            style={{ width: "100%", padding: 10, marginTop: 8 }}
            maxLength={120}
          />
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>{title.length}/120</div>
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Descrizione (opzionale)</strong>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Qualche dettaglio… orari, stile, esperienza richiesta…"
            style={{ width: "100%", padding: 10, marginTop: 8, minHeight: 120 }}
            maxLength={1000}
          />
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
            {description.length}/1000
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Città / zona</strong>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Milano"
            style={{ width: "100%", padding: 10, marginTop: 8 }}
          />
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
            MVP: prova Milano / Roma / Bologna / Genova / Torino / Napoli / Firenze
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
              <strong>Luogo pubblico</strong> (circolo / negozio / locale — ok indicare la posizione
              precisa più avanti)
            </span>
          </label>
          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
            Se non spuntato, viene trattato come “zona approssimata” per privacy.
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={onSubmit} disabled={loading || !title.trim() || !city.trim()}>
            {loading ? "Salvo…" : "Salva annuncio"}
          </button>
          <a href="/it/listings" style={{ textDecoration: "underline" }}>
            Torna agli annunci
          </a>
          {error && <span style={{ color: "crimson" }}>{error}</span>}
          {okMsg && <span style={{ color: "green" }}>{okMsg}</span>}
        </div>
      </div>
    </main>
  );
}
