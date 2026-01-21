"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type MapItem = {
  id: string;
  title: string;
  lat: number;
  lng: number;
};

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function ResultsMap({
  items,
  center,
}: {
  items: MapItem[];
  center: [number, number];
}) {
  return (
    <MapContainer
      center={center}
      zoom={11}
      style={{ height: 400, width: "100%", borderRadius: 12 }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {items.map((i) => (
        <Marker key={i.id} position={[i.lat, i.lng]}>
          <Popup>{i.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
