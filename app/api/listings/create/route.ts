import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type GameKey = "RPG" | "BOARD" | "CARDS" | "MINI";
type LookingFor = "players" | "groups" | "either";
type KindKey = "private_user" | "group" | "public_place";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

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

function isOneOf<T extends string>(v: any, allowed: readonly T[]): v is T {
  return typeof v === "string" && (allowed as readonly string[]).includes(v);
}

export async function POST(req: Request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY", 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const body = await req.json().catch(() => null);
  if (!body) return jsonError("Invalid JSON body");

  const kind = body.kind as KindKey;
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const gameType = body.gameType as GameKey;
  const lookingFor = body.lookingFor as LookingFor;
  const city = String(body.city ?? "").trim();
  const country = String(body.country ?? "IT").trim();
  const isPublicPlace = Boolean(body.isPublicPlace ?? false);

  const allowedKinds = ["private_user", "group", "public_place"] as const;
  const allowedGames = ["RPG", "BOARD", "CARDS", "MINI"] as const;
  const allowedLooking = ["players", "groups", "either"] as const;

  if (!isOneOf(kind, allowedKinds)) return jsonError("Invalid kind");
  if (!title) return jsonError("Title required");
  if (!isOneOf(gameType, allowedGames)) return jsonError("Invalid gameType");
  if (!isOneOf(lookingFor, allowedLooking)) return jsonError("Invalid lookingFor");
  if (!city) return jsonError("City required");

  const coords = cityToCoords(city);
  if (!coords) {
    return jsonError(
      "City not recognized yet. Try: Milano, Roma, Bologna, Genova, Torino, Napoli, Firenze."
    );
  }

  // Coerenza: se è luogo pubblico, kind deve essere public_place
  const finalKind: KindKey = isPublicPlace ? "public_place" : kind;

  const { data, error } = await supabase.rpc("create_listing", {
    in_kind: finalKind,
    in_title: title,
    in_description: description,
    in_game_type: gameType,
    in_looking_for: lookingFor,
    in_city: city,
    in_country: country || "IT",
    in_is_public_place: isPublicPlace,
    in_lat: coords.lat,
    in_lng: coords.lng,
  });

  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ ok: true, id: data });
}
