"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

type Result = {
  id: string;
  title: string;
  city: string | null;
  distance_km: number;
  lat: number;
  lng: number;
};

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function ResultsMap({ results }: { results: Result[] }) {
  if (!results.length) return null;

  const center: [number, number] = [results[0].lat, results[0].lng];

  return (
    <MapContainer center={center} zoom={11} style={{ height: 400, width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {results.map((r) => (
        <Marker key={r.id} position={[r.lat, r.lng]} icon={icon}>
          <Popup>
            <strong>{r.title}</strong>
            <br />
            {r.city ?? "Approx. area"} – {r.distance_km} km
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
