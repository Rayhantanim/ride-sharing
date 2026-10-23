import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ───────────────────── Icons ───────────────────── */

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </svg>
);

const ActivityIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <circle cx="12" cy="15" r="2.5" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.8 1.8-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.55V22h-2.55v-.11a1.7 1.7 0 0 0-1.03-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-1.8-1.8.06-.06A1.7 1.7 0 0 0 8.1 15a1.7 1.7 0 0 0-1.55-1.03H6.4v-2.55h.15A1.7 1.7 0 0 0 8.1 10.4a1.7 1.7 0 0 0-.34-1.88L7.7 8.46l1.8-1.8.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.55V5h2.55v.51a1.7 1.7 0 0 0 1.03 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.8 1.8-.06.06A1.7 1.7 0 0 0 19.4 10c.2.62.78 1.03 1.43 1.03H21v2.55h-.17A1.7 1.7 0 0 0 19.4 15z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

const SupportIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v3M21 12h-3M12 21v-3M3 12h3" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H3" />
    <path d="M21 3v18" />
  </svg>
);

/* ───────────────────── Nav Item ───────────────────── */

const NavItem = ({ to, icon, label, onClose }) => (
  <Link
    to={to}
    onClick={onClose}
    className="group flex items-center gap-4 px-4 py-3 rounded-xl text-[#374151] hover:bg-[#F3F7E8] hover:text-[#6B8E00] hover:shadow-sm transition-all duration-150"
  >
    <span className="flex-shrink-0 text-[#6B7280] group-hover:text-[#6B8E00] transition-colors duration-150">
      {icon}
    </span>
    <span className="text-[15px] font-medium leading-tight">{label}</span>
  </Link>
);

/* ───────────────────── Section ───────────────────── */

const SectionLabel = ({ children }) => (
  <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">
    {children}
  </p>
);

/* ───────────────────── Helpers ───────────────────── */

/**
 * Wipes every known client-side artifact that could hold login data.
 * Safe to call even if some of these APIs are unavailable.
 */
const clearAllLoginData = () => {
  // 1. localStorage — remove only known keys, or wipe entirely.
  //    We use a key list first, then a targeted prefix sweep.
  const localStorageKeys = [
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
  localStorageKeys.forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch (_) {}
  });

  // Sweep any namespaced keys (e.g. "zygo:token", "app_user")
  try {
    Object.keys(localStorage).forEach((key) => {
      if (/auth|token|user|session|jwt|login|profile/i.test(key)) {
        localStorage.removeItem(key);
      }
    });
  } catch (_) {}

  // 2. sessionStorage — same treatment
  const sessionStorageKeys = [...localStorageKeys];
  sessionStorageKeys.forEach((k) => {
    try {
      sessionStorage.removeItem(k);
    } catch (_) {}
  });
  try {
    Object.keys(sessionStorage).forEach((key) => {
      if (/auth|token|user|session|jwt|login|profile/i.test(key)) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (_) {}

  // 3. Cookies — expire any auth-related cookie on the current domain
  try {
    const cookieNames = document.cookie
      .split(";")
      .map((c) => c.split("=")[0].trim())
      .filter(Boolean);
    cookieNames.forEach((name) => {
      if (/auth|token|user|session|jwt|login|profile/i.test(name)) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
      }
    });
  } catch (_) {}

  // 4. IndexedDB — delete any database whose name looks auth-related
  try {
    if (window.indexedDB?.databases) {
      window.indexedDB.databases().then((dbs) => {
        dbs.forEach((db) => {
          if (db.name && /auth|token|user|session|login/i.test(db.name)) {
            window.indexedDB.deleteDatabase(db.name);
          }
        });
      });
    }
  } catch (_) {}

  // 5. Cache Storage — drop API/auth caches
  try {
    if (window.caches?.keys) {
      window.caches.keys().then((keys) => {
        keys.forEach((key) => {
          if (/auth|token|user|session|api/i.test(key)) {
            window.caches.delete(key);
          }
        });
      });
    }
  } catch (_) {}
};

/* ───────────────────── Sidebar ───────────────────── */

const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const sidebarRef = useRef(null);
  const closeButtonRef = useRef(null);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const focusable = sidebarRef.current?.querySelectorAll(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      // 1. Optional backend call — invalidate the session server-side
      // await fetch("/api/auth/logout", {
      //   method: "POST",
      //   credentials: "include",
      // });

      // 2. Wipe every known client-side auth artifact
      clearAllLoginData();

      // 3. Let parent component react (reset context/state, etc.)
      onLogout?.();

      // 4. Close the sidebar
      onClose();

      // 5. Redirect to login (or home). `replace: true` prevents the
      //    user from navigating "Back" into a protected page.
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[3px]"
      onClick={onClose}
      role="presentation"
    >
      <aside
        ref={sidebarRef}
        className="fixed left-0 top-0 h-full w-[340px] bg-white flex flex-col
                   shadow-[0_0_50px_rgba(0,0,0,0.25)]
                   border-r border-[#E5E7EB]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
      >
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between px-6 h-[76px] border-b border-[#E5E7EB] flex-shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h1 className="text-[28px] font-bold tracking-tight leading-none">
            <span className="text-[#1D1D1D]">zy</span>
            <span className="text-[#8EB800]">Go</span>
          </h1>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 rounded-lg text-[#6B7280] hover:bg-gray-100 hover:text-[#1D1D1D] hover:shadow-sm transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8EB800]"
            aria-label="Close navigation menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* ─── Profile ─── */}
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex-shrink-0">
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-4 p-3 rounded-xl group hover:bg-[#F3F7E8] hover:shadow-sm transition-all duration-150"
          >
            <div className="w-12 h-12 rounded-full bg-[#E8F5C8] flex items-center justify-center text-[#6B8E00] group-hover:bg-[#d9eeb0] transition-colors duration-150 flex-shrink-0 shadow-sm">
              <ProfileIcon />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-semibold text-[#1D1D1D] group-hover:text-[#6B8E00] transition-colors duration-150 truncate">
                My Account
              </h3>
              <p className="text-[13px] text-[#6B7280] truncate">View your profile</p>
            </div>
          </Link>
        </div>

        {/* ─── Navigation ─── */}
        <nav className="flex-1 px-4 py-5 overflow-y-auto">
          {/* Menu */}
          <SectionLabel>Menu</SectionLabel>
          <div className="space-y-1">
            <NavItem to="/" icon={<HomeIcon />} label="Home" onClose={onClose} />
            <NavItem to="/activity" icon={<ActivityIcon />} label="My Rides" onClose={onClose} />
            <NavItem to="/schedule" icon={<CalendarIcon />} label="Scheduled Rides" onClose={onClose} />
            <NavItem to="/saved-places" icon={<MapPinIcon />} label="Saved Places" onClose={onClose} />
          </div>

          {/* Account */}
          <div className="mt-7">
            <SectionLabel>Account</SectionLabel>
            <div className="space-y-1">
              <NavItem to="/profile" icon={<ProfileIcon />} label="Profile" onClose={onClose} />
              <NavItem to="/settings" icon={<SettingsIcon />} label="Settings" onClose={onClose} />
            </div>
          </div>

          {/* Safety & Support */}
          <div className="mt-7">
            <SectionLabel>Safety &amp; Support</SectionLabel>
            <div className="space-y-1">
              <NavItem to="/safety-preview" icon={<ShieldIcon />} label="Safety Center" onClose={onClose} />
              <NavItem to="/support" icon={<SupportIcon />} label="Help &amp; Support" onClose={onClose} />
            </div>
          </div>
        </nav>

        {/* ─── Logout ─── */}
        <div className="px-4 py-4 border-t border-[#E5E7EB] flex-shrink-0 shadow-[0_-1px_3px_rgba(0,0,0,0.04)]">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[#DC2626] hover:bg-red-50 hover:shadow-sm transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Log out of your account"
          >
            <LogoutIcon />
            <span className="text-[15px] font-medium">
              {isLoggingOut ? "Logging out…" : "Logout"}
            </span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;