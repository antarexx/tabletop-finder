"use client";

import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

// Import Leaflet only on client
import L from "leaflet";

// Fix marker icons in Next/Webpack/Vite setups
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

type GameKey = "RPG" | "BOARD" | "CARDS" | "MINI";
type LookingFor = "players" | "groups" | "either";

export type Result = {
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

type Coords = { lat: number; lng: number };

// Dynamic import of react-leaflet components (no SSR)
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });

function cityToCoords(q: string): Coords | null {
  const s = q.trim().toLowerCase();

  const map: Record<string, Coords> = {
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

function resultToCoords(r: Result): Coords | null {
  if (!r.city) return null;
  return cityToCoords(r.city);
}

export default function ResultsMap({
  results,
  centerQuery,
  lang,
}: {
  results: Result[];
  centerQuery: string; // e.g. locationText
  lang: "en" | "it";
}) {
  useEffect(() => {
    // Set default icon URLs once on client
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: (markerIcon2x as any).src ?? markerIcon2x,
      iconUrl: (markerIcon as any).src ?? markerIcon,
      shadowUrl: (markerShadow as any).src ?? markerShadow,
    });
  }, []);

  const center = useMemo<Coords>(() => {
    return cityToCoords(centerQuery) ?? { lat: 41.9028, lng: 12.4964 }; // fallback Roma
  }, [centerQuery]);

  const points = useMemo(() => {
    return results
      .map((r) => {
        const c = resultToCoords(r);
        if (!c) return null;
        return { r, c };
      })
      .filter(Boolean) as { r: Result; c: Coords }[];
  }, [results]);

  const emptyText = lang === "it" ? "Nessun punto da mostrare." : "No pins to show yet.";

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>
        {lang === "it" ? "Mappa" : "Map"}
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ height: 320, width: "100%" }}>
          {/* Render map only client-side */}
          <MapContainer center={[center.lat, center.lng]} zoom={6} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {points.map(({ r, c }) => (
              <Marker key={r.id} position={[c.lat, c.lng]}>
                <Popup>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{r.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.85 }}>
                    {r.game_type} • {r.kind} • {r.city ?? "—"} • {Math.round(r.distance_km)} km
                  </div>
                  <div style={{ fontSize: 12, marginTop: 6, opacity: 0.85 }}>
                    {r.is_public_place
                      ? lang === "it"
                        ? "Luogo pubblico"
                        : "Public place"
                      : lang === "it"
                      ? "Zona approssimata"
                      : "Approx. area"}
                  </div>
                  {r.description ? <div style={{ marginTop: 8 }}>{r.description}</div> : null}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {points.length === 0 ? (
          <div style={{ padding: 12, fontSize: 13, opacity: 0.8 }}>{emptyText}</div>
        ) : null}
      </div>

      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
        {lang === "it"
          ? "MVP: i pin sono centrati sulla città (privacy). Per i luoghi pubblici aggiungeremo coordinate precise più avanti."
          : "MVP: pins are centered on the city (privacy). For public places we’ll add precise coordinates later."}
      </div>
    </div>
  );
}
