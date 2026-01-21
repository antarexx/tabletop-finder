"use client";

import { useMemo, useState } from "react";

type GameKey = "RPG" | "BOARD" | "CARDS" | "MINI";
type LookingFor = "players" | "groups" | "either";
type KindKey = "private_user" | "group" | "public_place";

export default function NewListingIT() {
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
    () => "Città MVP: Milano / Roma / Bologna / Genova / Torino / Napoli / Firenze",
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
      if (!json.ok) throw new Error(json.error || "Salvataggio fallito");

      setSuccessId(String(json.id));
      setTitle("");
      setDescription("");
    } catch (e: any) {
      setError(e?.message ?? "Errore");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Crea un annuncio</h1>
      <p>Aggiungi te stesso, un gruppo o un luogo pubblico.</p>

      <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12 }}>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <strong>Tipo</strong>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as KindKey)}
              style={{ width: "100%", padding: 10, marginTop: 8 }}
              disabled={isPublicPlace}
              title={isPublicPlace ? "Se selezioni Luogo pubblico, il tipo diventa Luogo pubblico" : ""}
            >
              <option value="private_user">Utente (privato)</option>
              <option value="group">Gruppo</option>
              <option value="public_place">Luogo pubblico</option>
            </select>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
              Se spunti “Luogo pubblico”, il tipo diventa “Luogo pubblico”.
            </div>
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
              <option value="CARDS">Giochi di carte</option>
              <option value="MINI">Miniature</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Titolo</strong>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="es. Campagna D&D 5e settimanale"
            style={{ width: "100%", padding: 10, marginTop: 8 }}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Descrizione</strong>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrizione breve (opzionale)"
            rows={4}
            style={{ width: "100%", padding: 10, marginTop: 8, resize: "vertical" }}
          />
        </div>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 220px", marginTop: 12 }}>
          <div>
            <strong>Città</strong>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Milano"
              style={{ width: "100%", padding: 10, marginTop: 8 }}
            />
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>{cityHelp}</div>
          </div>

          <div>
            <strong>Paese</strong>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="IT"
              style={{ width: "100%", padding: 10, marginTop: 8 }}
            />
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

        <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
          <input
            type="checkbox"
            checked={isPublicPlace}
            onChange={(e) => setIsPublicPlace(e.target.checked)}
          />
          Luogo pubblico (negozio / circolo / locale) — posizione esatta ok
        </label>

        <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={onSubmit} disabled={loading || !title.trim() || !city.trim()}>
            {loading ? "Salvo..." : "Salva annuncio"}
          </button>

          <a href="/it/search" style={{ textDecoration: "underline" }}>
            Vai alla Ricerca
          </a>

          {error && <span style={{ color: "crimson" }}>{error}</span>}
          {successId && (
            <span style={{ color: "green" }}>
              Salvato! ID: <code>{successId}</code>
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
