import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type GameKey = "RPG" | "BOARD" | "CARDS" | "MINI";
type LookingFor = "players" | "groups" | "either";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

// MVP geocoding: mappa città -> coordinate (poi mettiamo geocoding vero)
function cityToCoords(q: string): { lat: number; lng: number } | null {
  const s = q.trim().toLowerCase();

  const map: Record<string, { lat: number; lng: number }> = {
    "milano": { lat: 45.4642, lng: 9.19 },
    "milan": { lat: 45.4642, lng: 9.19 },
    "roma": { lat: 41.9028, lng: 12.4964 },
    "rome": { lat: 41.9028, lng: 12.4964 },
    "bologna": { lat: 44.4949, lng: 11.3426 },
    "genova": { lat: 44.4056, lng: 8.9463 },
    "genua": { lat: 44.4056, lng: 8.9463 },
    "torino": { lat: 45.0703, lng: 7.6869 },
    "turin": { lat: 45.0703, lng: 7.6869 },
    "napoli": { lat: 40.8518, lng: 14.2681 },
    "naples": { lat: 40.8518, lng: 14.2681 },
    "firenze": { lat: 43.7696, lng: 11.2558 },
    "florence": { lat: 43.7696, lng: 11.2558 },
  };

  // match semplice: se contiene il nome città
  for (const k of Object.keys(map)) {
    if (s.includes(k)) return map[k];
  }
  return null;
}

export async function POST(req: Request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return jsonError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY", 500);
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const body = await req.json().catch(() => null);
  if (!body) return jsonError("Invalid JSON body");

  const locationText = String(body.locationText ?? "");
  const radiusKm = Number(body.radiusKm ?? 25);
  const games = (body.games ?? []) as GameKey[];
  const lookingFor = (body.lookingFor ?? "either") as LookingFor;

  if (!locationText.trim()) return jsonError("locationText required");
  if (!Array.isArray(games) || games.length === 0) return jsonError("games required");
  if (!Number.isFinite(radiusKm) || radiusKm <= 0) return jsonError("radiusKm invalid");

  const coords = cityToCoords(locationText);
  if (!coords) {
    return jsonError(
      "Location not recognized yet. Try: Milano, Roma, Bologna, Genova, Torino, Napoli, Firenze."
    );
  }

  const { data, error } = await supabase.rpc("search_listings", {
    in_lat: coords.lat,
    in_lng: coords.lng,
    in_radius_km: radiusKm,
    in_games: games,
    in_looking_for: lookingFor,
  });

  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ ok: true, results: data ?? [] });
}

