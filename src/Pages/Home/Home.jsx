import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import car from "../../assets/image 125.png";
import Sidebar from "../../Components/Sidebar.jsx";
import ChatBot from "../../Components/ChatBot.jsx";

/* ─────────────────────── Icon Set ─────────────────────── */

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D1D1D" strokeWidth="2" strokeLinecap="round">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D1D1D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D1D1D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
  </svg>
);

const CarIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 1-4 0" />
    <path d="M3 17V9l2-5h14l2 5v8" />
    <path d="M5 9h14" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <circle cx="12" cy="15" r="2.5" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const StarIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3 6.5 7 1-5 4.9 1.2 7L12 18l-6.2 3.4L7 14.4 2 9.5l7-1L12 2z" />
  </svg>
);

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8EB800" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const EmergencyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8EB800" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

const ShareIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8EB800" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3" />
    <path d="M3 21v-1a6 6 0 0 1 12 0v1" />
    <circle cx="17" cy="9" r="3" />
    <path d="M15 21v-1a6 6 0 0 1 6-6" />
  </svg>
);

const SosIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8EB800" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </svg>
);

const ActivityIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const SupportIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v3M21 12h-3M12 21v-3M3 12h3" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.8 1.8-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.55V22h-2.55v-.11a1.7 1.7 0 0 0-1.03-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-1.8-1.8.06-.06A1.7 1.7 0 0 0 8.1 15a1.7 1.7 0 0 0-1.55-1.03H6.4v-2.55h.15A1.7 1.7 0 0 0 8.1 10.4a1.7 1.7 0 0 0-.34-1.88L7.7 8.46l1.8-1.8.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.55V5h2.55v.51a1.7 1.7 0 0 0 1.03 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.8 1.8-.06.06A1.7 1.7 0 0 0 19.4 10c.2.62.78 1.03 1.43 1.03H21v2.55h-.17A1.7 1.7 0 0 0 19.4 15z" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H3" />
    <path d="M21 3v18" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

/* ─────────────────────── Helpers ─────────────────────── */

const clearAllLoginData = () => {
  const knownKeys = [
    "token", "accessToken", "refreshToken", "idToken", "authToken",
    "user", "userData", "currentUser", "auth", "authUser",
    "session", "jwt", "profile", "rememberMe",
  ];

  knownKeys.forEach((k) => {
    try { localStorage.removeItem(k); } catch (_) {}
    try { sessionStorage.removeItem(k); } catch (_) {}
  });

  try {
    Object.keys(localStorage).forEach((key) => {
      if (/auth|token|user|session|jwt|login|profile/i.test(key)) localStorage.removeItem(key);
    });
  } catch (_) {}

  try {
    Object.keys(sessionStorage).forEach((key) => {
      if (/auth|token|user|session|jwt|login|profile/i.test(key)) sessionStorage.removeItem(key);
    });
  } catch (_) {}

  try {
    document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter(Boolean).forEach((name) => {
      if (/auth|token|user|session|jwt|login|profile/i.test(name)) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
      }
    });
  } catch (_) {}
};

/* ─────────────────────── Profile Mini Window ─────────────────────── */

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
      {/* User header */}
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

      {/* Menu items */}
      <div className="py-2">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClose}
            role="menuitem"
            className="flex items-center gap-3 px-5 py-3 text-[#374151] hover:bg-[#F3F7E8] hover:text-[#6B8E00] transition-colors group"
          >
            <span className="text-[#6B7280] group-hover:text-[#6B8E00] transition-colors">
              {item.icon}
            </span>
            <span className="flex-1 text-[14px] font-medium">{item.label}</span>
            <span className="text-[#9CA3AF] group-hover:text-[#6B8E00] transition-colors">
              <ChevronRightIcon />
            </span>
          </Link>
        ))}
      </div>

      {/* Logout */}
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

/* ─────────────────────── Quick Action ─────────────────────── */

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
    return <Link to={to} className={className}>{content}</Link>;
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
};

/* ─────────────────────── Safety Tile ─────────────────────── */

const SafetyTile = ({ icon, label }) => (
  <div className="flex flex-col items-center justify-center gap-2 bg-white border border-[#E5E7EB] rounded-xl py-5 px-3 hover:border-[#8EB800] hover:shadow-sm transition">
    {icon}
    <span className="text-[13px] font-medium text-[#1D1D1D]">{label}</span>
  </div>
);

/* ─────────────────────── Main Component ─────────────────────── */

const Home = () => {
  const navigate = useNavigate();
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState(null);

  const profileRef = useRef(null);
  const profileButtonRef = useRef(null);

  /* Load user from localStorage */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  /* Close mini window on outside click / Escape */
  useEffect(() => {
    if (!profileOpen) return;

    const handleClickOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target) &&
        !profileButtonRef.current?.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
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
    if (!fromLocation || !toLocation) {
      alert("Please select both pickup and destination.");
      return;
    }
    if (fromLocation === toLocation) {
      alert("Pickup and destination cannot be the same.");
      return;
    }
    window.location.href = `/available-rides?from=${encodeURIComponent(fromLocation)}&to=${encodeURIComponent(toLocation)}`;
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      // Optional backend call
      // await axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true });

      clearAllLoginData();
      setProfileOpen(false);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={() => navigate("/login", { replace: true })}
      />

      {/* Header */}
      <header className="w-full bg-white border-b border-[#E5E7EB]">
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

          {/* Right side: Bell + Profile with mini window */}
          <div className="flex items-center gap-2 -mr-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Notifications"
            >
              <BellIcon />
            </button>

            {/* Profile trigger + dropdown */}
            <div className="relative">
              <button
                ref={profileButtonRef}
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
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
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#8EB800] ring-4 ring-[#E8F5C8]" />
                  <select
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-[#D6D9DE] rounded-xl text-[15px] text-[#1D1D1D] outline-none focus:border-[#8EB800] focus:ring-2 focus:ring-[#E8F5C8] transition appearance-none"
                  >
                    <option value="">Current location</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Cox's Bazar">Cox's Bazar</option>
                    <option value="Comilla">Comilla</option>
                    <option value="Feni">Feni</option>
                  </select>
                </div>

                <div className="absolute left-[21px] top-[46px] bottom-[46px] w-px border-l border-dashed border-[#C7CAD1]" />

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-sm bg-[#8EB800]" />
                  <select
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-[#D6D9DE] rounded-xl text-[15px] text-[#1D1D1D] outline-none focus:border-[#8EB800] focus:ring-2 focus:ring-[#E8F5C8] transition appearance-none"
                  >
                    <option value="">Where to go?</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Cox's Bazar">Cox's Bazar</option>
                    <option value="Comilla">Comilla</option>
                    <option value="Feni">Feni</option>
                  </select>
                </div>

                <button
                  onClick={handleFindRides}
                  className="w-full mt-2 bg-[#8EB800] hover:bg-[#7AA300] text-white font-semibold py-4 rounded-xl transition"
                >
                  Find Available Rides
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickAction icon={<CarIcon />} label="Ride Now" to="/available-rides" />
              <QuickAction icon={<CalendarIcon />} label="Schedule" />
              <QuickAction icon={<HistoryIcon />} label="Ride history" to="/ride-management" />
              <QuickAction icon={<StarIcon />} label="Save Place" />
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-[#1D1D1D] mb-4">
                Safety First
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SafetyTile icon={<ChatIcon />} label="In-App Chat" />
                <Link to="/safety-preview" className="block">
                  <SafetyTile icon={<EmergencyIcon />} label="Emergency" />
                </Link>
                <SafetyTile icon={<ShareIcon />} label="Share Trip" />
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
                src={car}
                alt="zyGo car"
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 w-full bg-white border-t border-[#E5E7EB]">
        <div className="max-w-[1400px] mx-auto px-8 py-3 flex items-center justify-around">
          <Link to="/home" className="flex flex-col items-center gap-1 text-[#8EB800]">
            <HomeIcon />
            <span className="text-[12px] font-medium">Home</span>
          </Link>
          <Link to="/ride-management" className="flex flex-col items-center gap-1 text-[#6B7280] hover:text-[#8EB800] transition">
            <ActivityIcon />
            <span className="text-[12px] font-medium">Activity</span>
          </Link>
          <Link to="/support" className="flex flex-col items-center gap-1 text-[#6B7280] hover:text-[#8EB800] transition">
            <SupportIcon />
            <span className="text-[12px] font-medium">Support</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-1 text-[#6B7280] hover:text-[#8EB800] transition">
            <ProfileIcon />
            <span className="text-[12px] font-medium">Profile</span>
          </Link>
        </div>
      </nav>

      <ChatBot />

      {/* Fade-in keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Home;