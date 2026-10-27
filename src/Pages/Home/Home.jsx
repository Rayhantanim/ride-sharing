import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import car from "../../assets/image 125.png";
import Sidebar from "../../Components/Sidebar.jsx";
import { gsap } from "gsap";
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

/* -------------------- Icons -------------------- */

const MenuIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1D1D1D"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

const BellIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1D1D1D"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1D1D1D"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
  </svg>
);

const CarIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4B5563"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 1-4 0" />
    <path d="M3 17V9l2-5h14l2 5v8M5 9h14" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4B5563"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <circle cx="12" cy="15" r="2.5" />
  </svg>
);

const HistoryIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4B5563"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 7v5l3 2" />
  </svg>
);

const StarIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4B5563"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2l3 6.5 7 1-5 4.9 1.2 7L12 18l-6.2 3.4L7 14.4 2 9.5l7-1L12 2z" />
  </svg>
);

const ChatIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8EB800"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const EmergencyIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8EB800"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

const ShareIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8EB800"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="8" r="3" />
    <path d="M3 21v-1a6 6 0 0 1 12 0v1" />
    <circle cx="17" cy="9" r="3" />
    <path d="M15 21v-1a6 6 0 0 1 6-6" />
  </svg>
);

const SosIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8EB800"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const HomeIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5" />
  </svg>
);

const ActivityIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const SupportIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v3M21 12h-3M12 21v-3M3 12h3" />
  </svg>
);

const ProfileIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.8 1.8-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.55V22h-2.55v-.11a1.7 1.7 0 0 0-1.03-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-1.8-1.8.06-.06A1.7 1.7 0 0 0 8.1 15a1.7 1.7 0 0 0-1.55-1.03H6.4v-2.55h.15A1.7 1.7 0 0 0 8.1 10.4a1.7 1.7 0 0 0-.34-1.88L7.7 8.46l1.8-1.8.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.55V5h2.55v.51a1.7 1.7 0 0 0 1.03 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.8 1.8-.06.06A1.7 1.7 0 0 0 19.4 10c.2.62.78 1.03 1.43 1.03H21v2.55h-.17A1.7 1.7 0 0 0 19.4 15z" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 17l5-5-5-5M15 12H3M21 3v18" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

/* -------------------- Map Picker -------------------- */

const DefaultMapIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultMapIcon;

const DEFAULT_MAP_POSITION = [22.3569, 91.7832]; // Chattogram

function MapClickHandler({
  position,
  setPosition,
  setAddress,
  setHasSelectedPosition,
}) {
  useMapEvents({
    async click(event) {
      const { lat, lng } = event.latlng;

      setPosition([lat, lng]);
      setHasSelectedPosition(true);

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

function KeepMapCentered({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 15);
  }, [map, position]);

  return null;
}

const LocationPicker = ({ label, value, onChange, onCoordinatesChange }) => {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState(value || "");
  const [position, setPosition] = useState(DEFAULT_MAP_POSITION);
  const [hasSelectedPosition, setHasSelectedPosition] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    setAddress(value || "");
  }, [value]);

  const openMap = () => {
    setAddress(value || "");
    setHasSelectedPosition(false);
    setOpen(true);
  };

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
        setHasSelectedPosition(true);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`,
          );

          if (response.ok) {
            const data = await response.json();
            if (data.display_name) setAddress(data.display_name);
          }
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

    onCoordinatesChange(
      hasSelectedPosition ? { lat: position[0], lng: position[1] } : null,
    );

    setOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            onCoordinatesChange(null);
          }}
          placeholder={label}
          aria-label={label}
          className="min-w-0 flex-1 pl-12 pr-3 py-4 bg-white border border-[#D6D9DE] rounded-xl text-[15px] text-[#1D1D1D] outline-none focus:border-[#8EB800] focus:ring-2 focus:ring-[#E8F5C8] transition"
        />

        <button
          type="button"
          onClick={openMap}
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

                <MapClickHandler
                  position={position}
                  setPosition={setPosition}
                  setAddress={setAddress}
                  setHasSelectedPosition={setHasSelectedPosition}
                />

                <KeepMapCentered position={position} />
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
              onChange={(event) => {
                setAddress(event.target.value);
                setHasSelectedPosition(false);
              }}
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
};

/* -------------------- Helpers -------------------- */

const clearAllLoginData = () => {
  const knownKeys = [
    "token",
    "accessToken",
    "refreshToken",
    "idToken",
    "authToken",
    "user",
    "userData",
    "currentUser",
    "auth",
    "authUser",
    "session",
    "jwt",
    "profile",
    "rememberMe",
  ];

  knownKeys.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (_) {}

    try {
      sessionStorage.removeItem(key);
    } catch (_) {}
  });

  try {
    Object.keys(localStorage).forEach((key) => {
      if (/auth|token|user|session|jwt|login|profile/i.test(key)) {
        localStorage.removeItem(key);
      }
    });
  } catch (_) {}

  try {
    Object.keys(sessionStorage).forEach((key) => {
      if (/auth|token|user|session|jwt|login|profile/i.test(key)) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (_) {}

  try {
    document.cookie
      .split(";")
      .map((cookie) => cookie.split("=")[0].trim())
      .filter(Boolean)
      .forEach((name) => {
        if (/auth|token|user|session|jwt|login|profile/i.test(name)) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
        }
      });
  } catch (_) {}
};

/* -------------------- Profile Mini Window -------------------- */

const ProfileMiniWindow = ({ user, onClose, onLogout, isLoggingOut }) => {
  const menuItems = [
    { to: "/profile", label: "View Profile", icon: <ProfileIcon /> },
    { to: "/edit-profile", label: "Edit Profile", icon: <UserIcon /> },
    { to: "/settings", label: "Settings", icon: <SettingsIcon /> },
  ];

  return (
    <div
      className="absolute right-0 top-[calc(100%+10px)] w-[300px] bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden z-50 origin-top-right animate-[fadeIn_0.15s_ease-out]"
      role="menu"
      aria-label="Profile menu"
    >
      <div className="flex items-center gap-3 px-5 py-4 bg-[#F9FBF3] border-b border-[#E5E7EB]">
        <div className="w-11 h-11 rounded-full bg-[#E8F5C8] flex items-center justify-center text-[#6B8E00] shrink-0">
          <UserIcon />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-[#1D1D1D] truncate">
            {user?.fullName || "Your name"}
          </p>
          <p className="text-[12px] text-[#6B7280] truncate">
            {user?.email || "youremail@gmail.com"}
          </p>
        </div>
      </div>

      <div className="py-2">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClose}
            role="menuitem"
            className="flex items-center gap-3 px-5 py-3 text-[#374151] hover:bg-[#F3F7E8] hover:text-[#6B8E00] transition-colors group"
          >
            <span className="text-[#6B7280] group-hover:text-[#6B8E00]">
              {item.icon}
            </span>
            <span className="flex-1 text-[14px] font-medium">{item.label}</span>
            <span className="text-[#9CA3AF] group-hover:text-[#6B8E00]">
              <ChevronRightIcon />
            </span>
          </Link>
        ))}
      </div>

      <div className="border-t border-[#E5E7EB] p-2">
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          role="menuitem"
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[#DC2626] hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <LogoutIcon />
          <span className="text-[14px] font-medium">
            {isLoggingOut ? "Logging out…" : "Logout"}
          </span>
        </button>
      </div>
    </div>
  );
};

/* -------------------- Quick Action -------------------- */

const QuickAction = ({ icon, label, to, onClick }) => {
  const className =
    "flex flex-col items-center justify-center gap-2 w-full h-full bg-white border border-[#E5E7EB] rounded-xl py-5 px-3 hover:border-[#8EB800] hover:shadow-sm transition";

  const content = (
    <>
      {icon}
      <span className="text-[13px] font-medium text-[#1D1D1D] text-center leading-tight">
        {label}
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
};

/* -------------------- Safety Tile -------------------- */

const SafetyTile = ({ icon, label }) => (
  <div className="safety-tile flex flex-col items-center justify-center gap-2 bg-white border border-[#E5E7EB] rounded-xl py-5 px-3 hover:border-[#8EB800] hover:shadow-sm transition">
    {icon}
    <span className="text-[13px] font-medium text-[#1D1D1D]">{label}</span>
  </div>
);

/* -------------------- Main Component -------------------- */

const Home = () => {
  const navigate = useNavigate();

  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [fromCoordinates, setFromCoordinates] = useState(null);
  const [toCoordinates, setToCoordinates] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const [scheduleForm, setScheduleForm] = useState({
    pickup: "",
    destination: "",
    scheduledAt: "",
    seats: 1,
    notes: "",
  });

  const [showSavePlace, setShowSavePlace] = useState(false);

  const [savedPlaces, setSavedPlaces] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("zygoSavedPlaces") || "[]");
    } catch {
      return [];
    }
  });

  const [savePlaceForm, setSavePlaceForm] = useState({
    name: "",
    address: "",
    coordinates: null,
  });

  const profileRef = useRef(null);
  const profileButtonRef = useRef(null);
  const homeRef = useRef(null);
  const headerRef = useRef(null);
  const searchCardRef = useRef(null);
  const quickActionsRef = useRef(null);
  const safetyRef = useRef(null);
  const promoRef = useRef(null);
  const carRef = useRef(null);
  /* Load user from localStorage */
  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      // 🚗 Car movement
      if (carRef.current) {
        const car = carRef.current;

        const drive = gsap.timeline({
          repeat: -1,
          yoyo: true,
        });

        drive
          .to(car, {
            x: 32,
            y: -5,
            rotation: -1,
            duration: 1.2,
            ease: "power2.out",
          })
          .to(car, {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 1.6,
            ease: "power2.inOut",
          });

        gsap.to(car, {
          scale: 1.025,
          duration: 0.9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Header, search card and banner entrance
      const entrance = (element, delay = 0) => {
        if (!element) return;

        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            delay,
            ease: "power3.out",
          },
        );
      };

      entrance(headerRef.current);
      entrance(searchCardRef.current, 0.12);
      entrance(promoRef.current, 0.2);

      // Quick Actions
      if (quickActionsRef.current) {
        gsap.fromTo(
          quickActionsRef.current.children,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.1,
            delay: 0.25,
            ease: "power2.out",
          },
        );
      }

      // Safety tiles
      if (safetyRef.current) {
        gsap.fromTo(
          safetyRef.current.querySelectorAll(".safety-tile"),
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            delay: 0.35,
            ease: "power2.out",
          },
        );
      }
    }, homeRef);

    return () => ctx.revert();
  }, []);

  /* Close profile menu on outside click / Escape */
  useEffect(() => {
    if (!profileOpen) return;

    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        !profileButtonRef.current?.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        profileButtonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  const handleFindRides = () => {
    const pickup = fromLocation.trim();
    const destination = toLocation.trim();

    if (!pickup || !destination) {
      alert("Please enter both pickup and destination.");
      return;
    }

    if (pickup.toLowerCase() === destination.toLowerCase()) {
      alert("Pickup and destination cannot be the same.");
      return;
    }

    const params = new URLSearchParams({
      from: pickup,
      to: destination,
    });

    if (fromCoordinates) {
      params.set("fromLat", fromCoordinates.lat);
      params.set("fromLng", fromCoordinates.lng);
    }

    if (toCoordinates) {
      params.set("toLat", toCoordinates.lat);
      params.set("toLng", toCoordinates.lng);
    }

    navigate(`/available-rides?${params.toString()}`);
  };
  const handleScheduleRide = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    if (
      !scheduleForm.pickup.trim() ||
      !scheduleForm.destination.trim() ||
      !scheduleForm.scheduledAt
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (
      scheduleForm.pickup.trim().toLowerCase() ===
      scheduleForm.destination.trim().toLowerCase()
    ) {
      alert("Pickup and destination cannot be the same.");
      return;
    }

    if (new Date(scheduleForm.scheduledAt) <= new Date()) {
      alert("Please select a future date and time.");
      return;
    }

    try {
      setScheduleLoading(true);

      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${API}/api/scheduled-rides`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...scheduleForm,
          pickup: scheduleForm.pickup.trim(),
          destination: scheduleForm.destination.trim(),
          seats: Number(scheduleForm.seats),
          scheduledAt: new Date(scheduleForm.scheduledAt).toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not schedule ride.");
      }

      alert("Ride scheduled successfully!");

      setShowSchedule(false);
      setScheduleForm({
        pickup: "",
        destination: "",
        scheduledAt: "",
        seats: 1,
        notes: "",
      });
    } catch (error) {
      alert(error.message || "Something went wrong.");
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleSavePlace = (event) => {
    event.preventDefault();

    const name = savePlaceForm.name.trim();
    const address = savePlaceForm.address.trim();

    if (!name || !address) {
      alert("Please enter a place name and select a location.");
      return;
    }

    const newPlace = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      address,
      coordinates: savePlaceForm.coordinates,
    };

    const updatedPlaces = [...savedPlaces, newPlace];

    try {
      localStorage.setItem("zygoSavedPlaces", JSON.stringify(updatedPlaces));

      setSavedPlaces(updatedPlaces);
      setSavePlaceForm({
        name: "",
        address: "",
        coordinates: null,
      });
      setShowSavePlace(false);

      alert("Place saved successfully!");
    } catch (error) {
      console.error("Could not save place:", error);
      alert("Could not save this place. Please try again.");
    }
  };

  const handleRemoveSavedPlace = (id) => {
    const updatedPlaces = savedPlaces.filter((place) => place.id !== id);

    try {
      localStorage.setItem("zygoSavedPlaces", JSON.stringify(updatedPlaces));
      setSavedPlaces(updatedPlaces);
    } catch (error) {
      console.error("Could not remove saved place:", error);
      alert("Could not remove this place. Please try again.");
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      clearAllLoginData();
      setProfileOpen(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div ref={homeRef} className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={() => navigate("/login", { replace: true })}
      />

      {/* Header */}
      <header
        ref={headerRef}
        className="w-full bg-white border-b border-[#E5E7EB]"
      >
        <div className="max-w-[1400px] mx-auto px-8 py-5 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>

          <h1 className="text-[40px] font-bold tracking-tight select-none">
            <span className="text-[#1D1D1D]">zy</span>
            <span className="text-[#8EB800]">Go</span>
          </h1>

          <div className="flex items-center gap-2 -mr-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Notifications"
            >
              <BellIcon />
            </button>

            <div className="relative" ref={profileRef}>
              <button
                ref={profileButtonRef}
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                aria-label="Open profile menu"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                className="p-1 rounded-full hover:bg-[#F3F7E8] transition group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8EB800]"
              >
                <div className="w-10 h-10 rounded-full bg-[#E8F5C8] flex items-center justify-center text-[#6B8E00] group-hover:bg-[#d9eeb0] transition-colors">
                  <UserIcon />
                </div>
              </button>

              {profileOpen && (
                <ProfileMiniWindow
                  user={user}
                  onClose={() => setProfileOpen(false)}
                  onLogout={handleLogout}
                  isLoggingOut={isLoggingOut}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8">
          {/* LEFT */}
          <section className="flex flex-col gap-8">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
              <h2 className="text-[22px] font-bold text-[#1D1D1D] mb-6">
                Where are you going?
              </h2>

              <div className="relative flex flex-col gap-3">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#8EB800] ring-4 ring-[#E8F5C8] z-10 pointer-events-none" />

                  <LocationPicker
                    label="Pickup location"
                    value={fromLocation}
                    onChange={setFromLocation}
                    onCoordinatesChange={setFromCoordinates}
                  />
                </div>

                <div className="absolute left-[21px] top-[46px] bottom-[46px] w-px border-l border-dashed border-[#C7CAD1] pointer-events-none" />

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-sm bg-[#8EB800] z-10 pointer-events-none" />

                  <LocationPicker
                    label="Where to go?"
                    value={toLocation}
                    onChange={setToLocation}
                    onCoordinatesChange={setToCoordinates}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleFindRides}
                  className="w-full mt-2 bg-[#8EB800] hover:bg-[#7AA300] text-white font-semibold py-4 rounded-xl transition"
                >
                  Find Available Rides
                </button>
              </div>
            </div>

            {/* Quick Actions */}

            <div
              ref={quickActionsRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <QuickAction
                icon={<CarIcon />}
                label="Ride Now"
                to="/available-rides"
              />
              <QuickAction
                icon={<CalendarIcon />}
                label="Schedule"
                onClick={() => setShowSchedule(true)}
              />
              <QuickAction
                icon={<HistoryIcon />}
                label="Ride history"
                to="/ride-management"
              />

              <QuickAction
                icon={<StarIcon />}
                label="Save Place"
                onClick={() => setShowSavePlace(true)}
              />
            </div>

            {/* Safety */}
            <div ref={safetyRef}>
              <h3 className="text-[18px] font-semibold text-[#1D1D1D] mb-4">
                Safety First
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  onClick={() =>
                    window.dispatchEvent(new Event("zygo:open-ai-chat"))
                  }
                  className="cursor-pointer"
                >
                  <SafetyTile icon={<ChatIcon />} label="In-App Chat" />
                </div>

                <Link to="/safety-preview" className="block">
                  <SafetyTile icon={<EmergencyIcon />} label="Emergency" />
                </Link>

                <div
                  onClick={() => navigate("/trusted-circle")}
                  className="cursor-pointer"
                >
                  <SafetyTile icon={<ShareIcon />} label="Share Trip" />
                </div>

                <Link to="/sos-emergency" className="block">
                  <SafetyTile icon={<SosIcon />} label="Sos" />
                </Link>
              </div>
            </div>
          </section>

          {/* RIGHT */}
          <section className="flex flex-col gap-8">
            <div className="relative bg-[#EAF4FF] bg-opacity-60 rounded-2xl overflow-hidden p-8 min-h-[320px] flex flex-col justify-between">
              <div className="relative z-10 max-w-[280px]">
                <h3 className="text-[26px] font-extrabold text-[#1D1D1D] leading-tight">
                  Affordable Rides,
                  <br />
                  <span className="text-[#8EB800]">Everytime</span>
                </h3>

                <p className="text-[13px] text-[#4B5563] mt-3">
                  Safe, Reliable, Always with you.
                </p>

                <Link
                  to="/available-rides"
                  className="inline-block mt-6 bg-[#8EB800] hover:bg-[#7aa300] text-white font-semibold text-[14px] px-6 py-3 rounded-xl shadow-sm transition"
                >
                  Book Ride
                </Link>
              </div>

              <img
                ref={carRef}
                src={car}
                alt="zyGo car"
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </div>
          </section>
        </div>
      </main>
      {/* Schedule Ride Modal */}
      {showSchedule && (
        <div className="fixed inset-0 z-[3000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#1D1D1D]">
                Schedule a Ride
              </h2>

              <button
                type="button"
                onClick={() => setShowSchedule(false)}
                className="text-2xl text-gray-500"
                aria-label="Close schedule form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleScheduleRide} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Pickup Location *
                </label>
                <LocationPicker
                  label="Pickup Location"
                  value={scheduleForm.pickup}
                  onChange={(address) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      pickup: address,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Destination *
                </label>
                <LocationPicker
                  label="Destination"
                  value={scheduleForm.destination}
                  onChange={(address) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      destination: address,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Destination *
                </label>
                <input
                  required
                  value={scheduleForm.destination}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      destination: e.target.value,
                    })
                  }
                  placeholder="Enter destination"
                  className="w-full border border-[#D6D9DE] rounded-xl px-4 py-3 outline-none focus:border-[#8EB800]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Date & Time *
                </label>
                <input
                  required
                  type="datetime-local"
                  min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                  value={scheduleForm.scheduledAt}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      scheduledAt: e.target.value,
                    })
                  }
                  className="w-full border border-[#D6D9DE] rounded-xl px-4 py-3 outline-none focus:border-[#8EB800]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Seats</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={scheduleForm.seats}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      seats: e.target.value,
                    })
                  }
                  className="w-full border border-[#D6D9DE] rounded-xl px-4 py-3 outline-none focus:border-[#8EB800]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={scheduleForm.notes}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Any extra details?"
                  rows={3}
                  className="w-full border border-[#D6D9DE] rounded-xl px-4 py-3 outline-none focus:border-[#8EB800]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSchedule(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={scheduleLoading}
                  className="flex-1 py-3 rounded-xl bg-[#8EB800] hover:bg-[#7AA300] text-white font-semibold disabled:opacity-60"
                >
                  {scheduleLoading ? "Saving..." : "Schedule Ride"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Save Place Modal */}
      {showSavePlace && (
        <div className="fixed inset-0 z-[3000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#1D1D1D]">Save a Place</h2>

              <button
                type="button"
                onClick={() => setShowSavePlace(false)}
                className="text-2xl text-gray-500"
                aria-label="Close save place form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSavePlace} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Place Name *
                </label>

                <input
                  required
                  value={savePlaceForm.name}
                  onChange={(e) =>
                    setSavePlaceForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g. Home, University, Office"
                  className="w-full border border-[#D6D9DE] rounded-xl px-4 py-3 outline-none focus:border-[#8EB800]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Location *
                </label>

                <LocationPicker
                  label="Saved Location"
                  value={savePlaceForm.address}
                  onChange={(address) =>
                    setSavePlaceForm((prev) => ({
                      ...prev,
                      address,
                    }))
                  }
                  onCoordinatesChange={(coordinates) =>
                    setSavePlaceForm((prev) => ({
                      ...prev,
                      coordinates,
                    }))
                  }
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSavePlace(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#8EB800] hover:bg-[#7AA300] text-white font-semibold"
                >
                  Save Place
                </button>
              </div>
            </form>

            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold text-[#1D1D1D] mb-3">
                Your Saved Places ({savedPlaces.length})
              </h3>

              {savedPlaces.length === 0 ? (
                <p className="text-sm text-gray-500">No saved places yet.</p>
              ) : (
                <div className="space-y-3">
                  {savedPlaces.map((place) => (
                    <div
                      key={place.id}
                      className="rounded-xl border border-gray-200 p-3"
                    >
                      <p className="font-semibold text-[#1D1D1D]">
                        {place.name}
                      </p>

                      <p className="text-sm text-gray-500 mt-1 break-words">
                        {place.address}
                      </p>

                      {place.coordinates && (
                        <p className="text-xs text-gray-400 mt-1">
                          Coordinates: {place.coordinates.lat},{" "}
                          {place.coordinates.lng}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveSavedPlace(place.id)}
                        className="text-sm text-red-600 mt-2 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 w-full bg-white border-t border-[#E5E7EB]">
        <div className="max-w-[1400px] mx-auto px-8 py-3 flex items-center justify-around">
          <Link
            to="/home"
            className="flex flex-col items-center gap-1 text-[#8EB800]"
          >
            <HomeIcon />
            <span className="text-[12px] font-medium">Home</span>
          </Link>

          <Link
            to="/ride-management"
            className="flex flex-col items-center gap-1 text-[#6B7280] hover:text-[#8EB800] transition"
          >
            <ActivityIcon />
            <span className="text-[12px] font-medium">Activity</span>
          </Link>

          <Link
            to="/support"
            className="flex flex-col items-center gap-1 text-[#6B7280] hover:text-[#8EB800] transition"
          >
            <SupportIcon />
            <span className="text-[12px] font-medium">Support</span>
          </Link>

          <Link
            to="/profile"
            className="flex flex-col items-center gap-1 text-[#6B7280] hover:text-[#8EB800] transition"
          >
            <ProfileIcon />
            <span className="text-[12px] font-medium">Profile</span>
          </Link>
        </div>
      </nav>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
