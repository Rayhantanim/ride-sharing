import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const DEFAULT_POSITION = [22.3569, 91.7832]; // Chattogram

function MapClick({ position, setPosition, setAddress }) {
  useMapEvents({
    async click(event) {
      const { lat, lng } = event.latlng;
      setPosition([lat, lng]);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        );

        if (response.ok) {
          const data = await response.json();
          if (data.display_name) setAddress(data.display_name);
        }
      } catch (error) {
        console.error("Address lookup failed:", error);
      }
    },
  });

  return <Marker position={position} />;
}

function LocateMap({ position }) {
  const map = useMap();

  React.useEffect(() => {
    map.setView(position, 15);
  }, [map, position]);

  return null;
}

export default function LocationPicker({
  label,
  value,
  onChange,
  onCoordinatesChange,
}) {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState(value || "");
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [locating, setLocating] = useState(false);

  React.useEffect(() => {
    setAddress(value || "");
  }, [value]);

  const chooseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support location access.");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const nextPosition = [coords.latitude, coords.longitude];
        setPosition(nextPosition);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`,
          );
          const data = await response.json();

          if (data.display_name) setAddress(data.display_name);
        } catch (error) {
          console.error("Address lookup failed:", error);
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        alert("Location access denied. You can select a place on the map.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const confirmLocation = () => {
    if (!address.trim()) {
      alert("Please enter an address or select a place on the map.");
      return;
    }

    onChange(address.trim());
    onCoordinatesChange?.({
      lat: position[0],
      lng: position[1],
    });
    setOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={label}
          className="min-w-0 flex-1 pl-4 pr-3 py-4 bg-white border border-[#D6D9DE] rounded-xl text-[14px] text-[#1D1D1D] outline-none focus:border-[#8EB800] focus:ring-2 focus:ring-[#E8F5C8]"
        />

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 px-3 py-2 rounded-xl border border-[#8EB800] text-[#6B8E00] font-semibold text-sm hover:bg-[#F3F7E8]"
        >
          Map
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[2000] bg-black/50 flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-4 sm:p-5 shadow-xl">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-lg font-bold text-[#1D1D1D]">
                Choose {label}
              </h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-2xl text-gray-500 px-2"
                aria-label="Close map"
              >
                ×
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-3">
              Tap the map to place a pin, or type an address below.
            </p>

            <div className="h-[320px] sm:h-[400px] overflow-hidden rounded-xl border">
              <MapContainer
                center={position}
                zoom={12}
                scrollWheelZoom
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapClick
                  position={position}
                  setPosition={setPosition}
                  setAddress={setAddress}
                />

                <LocateMap position={position} />
              </MapContainer>
            </div>

            <button
              type="button"
              onClick={chooseCurrentLocation}
              disabled={locating}
              className="mt-3 text-sm font-semibold text-[#6B8E00] disabled:opacity-50"
            >
              {locating ? "Finding location..." : "Use my current location"}
            </button>

            <label className="block mt-3 mb-1 text-sm font-semibold text-gray-700">
              Address (you can edit it manually)
            </label>

            <input
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Enter pickup or destination address"
              className="w-full px-4 py-3 border border-[#D6D9DE] rounded-xl outline-none focus:border-[#8EB800]"
            />

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmLocation}
                className="flex-1 py-3 rounded-xl bg-[#8EB800] hover:bg-[#7AA300] text-white font-semibold"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
