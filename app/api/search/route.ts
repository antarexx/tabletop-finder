import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type GameKey = "RPG" | "BOARD" | "CARDS" | "MINI";

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function POST(req: Request) {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const anonKey = process.env.SUPABASE_ANON_KEY!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !anonKey || !serviceKey) {
    return NextResponse.json(
      { ok: false, error: "Missing Supabase env vars" },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const {
    lang,
    games,
    locationText,
    radiusKm,
    lookingFor,
  }: {
    lang: "en" | "it";
    games: GameKey[];
    locationText: string;
    radiusKm: number;
    lookingFor: "players" | "groups" | "either";
  } = body;

  if (!games || !Array.isArray(games) || games.length === 0) {
    return badRequest("games required");
  }
  if (!locationText || typeof locationText !== "string") {
    return badRequest("locationText required");
  }

  // TODO (prossimo step): geocoding della locationText -> lat/lng
  // Per ora: usiamo una posizione fissa di test (Genova) così testiamo la pipeline.
  const testLat = 44.4056;
  const testLng = 8.9463;

  // Qui useremo la tua funzione SQL PostGIS per "entro X km".
  // Assumo una vista/tabella "listings" con colonne:
  // id, kind, title, game_type, city, lat, lng, is_public_place
  //
  // Se la tua tabella si chiama diversamente, la adattiamo dopo.
  const { data, error } = await supabase.rpc("search_listings", {
    in_lat: testLat,
    in_lng: testLng,
    in_radius_km: radiusKm ?? 25,
    in_games: games,
    in_looking_for: lookingFor ?? "either",
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, results: data ?? [] });
}
