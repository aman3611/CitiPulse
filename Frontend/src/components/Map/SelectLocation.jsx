"use client";

import { useState, useEffect } from "react";
import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function SelectLocation({ onSelect }) {
  const [position, setPosition] = useState(null);
  const map = useMap();

  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const latlng = { lat: latitude, lng: longitude };
          setPosition(latlng);
          map.setView(latlng, 15);
          if (typeof onSelect === "function") {
            onSelect(latlng);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          alert("Location permission denied or not available.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    locateUser();
  }, []);

  useMapEvents({
    click(e) {
      const latlng = e.latlng;
      setPosition(latlng);
      if (typeof onSelect === "function") {
        onSelect(latlng);
      }
    },
  });

  return (
    <>
      <div className="absolute top-4 right-4 z-[1000]">
        <button
          onClick={locateUser}
          className="bg-white text-black px-3 py-1 rounded shadow border hover:bg-gray-100 transition"
        >
          📍 Locate Me
        </button>
      </div>

      {position && (
        <Marker position={position}>
          <Popup>
            📍 Selected Location
            <br />
            {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
          </Popup>
        </Marker>
      )}
    </>
  );
}
