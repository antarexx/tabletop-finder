import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type GameKey = "RPG" | "BOARD" | "CARDS" | "MINI";
type LookingFor = "players" | "groups" | "either";
type Kind = "private_user" | "group" | "public_place";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

// MVP coords: città -> coordinate
function cityToCoords(q: string): { lat: number; lng: number } | null {
  const s = q.trim().toLowerCase();

  const map: Record<string, { lat: number; lng: number }> = {
    milano: { lat: 45.4642, lng: 9.19 },
    milan: { lat: 45.4642, lng: 9.19 },
    roma: { lat: 41.9028, lng: 12.4964 },
    rome: { lat: 41.9028, lng: 12.4964 },
    bologna: { lat: 44.4949, lng: 11.3426 },
    genova: { lat: 44.4056, lng: 8.9463 },
    genua: { lat: 44.4056, lng: 8.9463 },
    torino: { lat: 45.0703, lng: 7.6869 },
    turin: { lat: 45.0703, lng: 7.6869 },
    napoli: { lat: 40.8518, lng: 14.2681 },
    naples: { lat: 40.8518, lng: 14.2681 },
    firenze: { lat: 43.7696, lng: 11.2558 },
    florence: { lat: 43.7696, lng: 11.2558 },
  };

  for (const k of Object.keys(map)) {
    if (s.includes(k)) return map[k];
  }
  return null;
}

export async function POST(req: Request) {
  // Server-side: usa service role per inserire (MVP)
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return jsonError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY", 500);
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const body = await req.json().catch(() => null);
  if (!body) return jsonError("Invalid JSON body");

  const kind = String(body.kind ?? "") as Kind;
  const game_type = String(body.game_type ?? "") as GameKey;
  const looking_for = String(body.looking_for ?? "") as LookingFor;

  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const city = String(body.city ?? "").trim();
  const is_public_place = Boolean(body.is_public_place ?? false);

  if (!["private_user", "group", "public_place"].includes(kind)) {
    return jsonError("Invalid kind");
  }
  if (!["RPG", "BOARD", "CARDS", "MINI"].includes(game_type)) {
    return jsonError("Invalid game_type");
  }
  if (!["players", "groups", "either"].includes(looking_for)) {
    return jsonError("Invalid looking_for");
  }
  if (!title) return jsonError("Title is required");
  if (title.length > 120) return jsonError("Title too long (max 120)");
  if (description.length > 1000) return jsonError("Description too long (max 1000)");
  if (!city) return jsonError("City is required");

  const coords = cityToCoords(city);
  if (!coords) {
    return jsonError(
      "City not recognized yet. Try: Milano, Roma, Bologna, Genova, Torino, Napoli, Firenze."
    );
  }

  // Inserimento: geog = geography(point,4326)
  const { error } = await supabase.from("listings").insert({
    kind,
    title,
    description: description || null,
    game_type,
    looking_for,
    city,
    country: "IT",
    is_public_place,
    geog: `POINT(${coords.lng} ${coords.lat})`,
  });

  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ ok: true });
}
