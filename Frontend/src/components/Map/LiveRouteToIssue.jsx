"use client";

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { getRoute } from "./utils";

const ORS_API_KEY = `${import.meta.env.VITE_ORS_API_KEY}`;

function LocationSetter({ setUserLocation, issueLat, issueLng, setRoute }) {
  useMapEvents({
    click: async (e) => {
      const latlng = [e.latlng.lat, e.latlng.lng];
      setUserLocation(latlng);
      const path = await getRoute(
        [latlng[1], latlng[0]],
        [issueLng, issueLat],
        ORS_API_KEY
      );
      setRoute(path);
    },
  });
  return null;
}

function FlyToUser({ userLocation }) {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.flyTo(userLocation, 14);
    }
  }, [userLocation]);

  return null;
}

export default function LiveRouteToIssue({ issueLat, issueLng }) {
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState([]);

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const coords = [latitude, longitude];
      setUserLocation(coords);

      const path = await getRoute(
        [longitude, latitude],
        [issueLng, issueLat],
        ORS_API_KEY
      );
      setRoute(path);
    });
  };

  useEffect(() => {
    getCurrentLocation();
  }, [issueLat, issueLng]);

  if (!userLocation)
    return <p className="text-center">Getting your location...</p>;

  return (
    <div className="relative">
      <MapContainer
        center={userLocation}
        zoom={14}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={userLocation}>
          <Popup>Starting Point</Popup>
        </Marker>
        <Marker position={[issueLat, issueLng]}>
          <Popup>Issue Location</Popup>
        </Marker>

        <Polyline positions={route} color="blue" />

        <LocationSetter
          setUserLocation={setUserLocation}
          setRoute={setRoute}
          issueLat={issueLat}
          issueLng={issueLng}
        />

        <FlyToUser userLocation={userLocation} />
      </MapContainer>

      <button
        onClick={getCurrentLocation}
        className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md z-[999]"
      >
        Use My Location
      </button>
    </div>
  );
}
