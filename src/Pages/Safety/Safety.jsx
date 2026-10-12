import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Safety.css";

import {
  FaChevronLeft,
  FaBell,
  FaListUl,
  FaUsers,
  FaExclamationCircle,
  FaSyncAlt,
  FaShieldAlt,
  FaUser,
  FaSlidersH,
  FaMoon,
  FaLock,
  FaChevronRight,
} from "react-icons/fa";

const SAFETY_API = "http://localhost:5000/api/safety";

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id || user?._id || null;
  } catch {
    return null;
  }
};

const SafetyCard = ({ icon, title, subtitle, iconBg, iconColor, onClick }) => (
  <div
    className="card"
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={(e) => {
      if (onClick && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onClick();
      }
    }}
    style={{ cursor: onClick ? "pointer" : "default" }}
  >
    <div
      className="card-icon-wrapper"
      style={{ backgroundColor: iconBg, color: iconColor }}
    >
      {icon}
    </div>

    <div className="card-content">
      <h4>{title}</h4>
      <p>{subtitle}</p>
    </div>

    <FaChevronRight className="chevron" />
  </div>
);

const SafetyScreen = () => {
  const navigate = useNavigate();

  const [nightMode, setNightMode] = useState(false);
  const [loadingNightMode, setLoadingNightMode] = useState(true);
  const [savingNightMode, setSavingNightMode] = useState(false);

  // Load the saved Night Mode value
  useEffect(() => {
    let cancelled = false;

    const loadSafetySettings = async () => {
      const userId = getUserId();

      if (!userId) {
        setLoadingNightMode(false);
        return;
      }

      try {
        const response = await fetch(`${SAFETY_API}/${userId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load safety settings.");
        }

        const safety = data.safety || data.data || data;

        if (!cancelled) {
          setNightMode(
            typeof safety?.automatedNightMode === "boolean"
              ? safety.automatedNightMode
              : false,
          );
        }
      } catch (error) {
        console.error("Load Night Mode error:", error);
      } finally {
        if (!cancelled) {
          setLoadingNightMode(false);
        }
      }
    };

    loadSafetySettings();

    return () => {
      cancelled = true;
    };
  }, []);

  // Save Night Mode ON/OFF
  const handleNightModeToggle = async (e) => {
    e.stopPropagation();

    // Prevent clicks before loading finishes or while saving
    if (loadingNightMode || savingNightMode) {
      return;
    }

    const userId = getUserId();

    if (!userId) {
      window.alert("Please log in first to save your safety settings.");
      return;
    }

    const nextValue = !nightMode;

    setSavingNightMode(true);

    try {
      const response = await fetch(`${SAFETY_API}/${userId}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          automatedNightMode: nextValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save Night Mode.");
      }

      // Backend returns { message, safety }
      const savedSafety = data.safety || data.data?.safety;

      if (typeof savedSafety?.automatedNightMode === "boolean") {
        setNightMode(savedSafety.automatedNightMode);
      } else {
        // Fall back to the requested value if the response
        // does not contain the saved safety document.
        setNightMode(nextValue);
      }
    } catch (error) {
      console.error("Save Night Mode error:", error);

      window.alert(
        error.message ||
          "Could not save the setting. Please check the backend server.",
      );
    } finally {
      setSavingNightMode(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <FaChevronLeft
          className="back-icon"
          onClick={() => navigate("/home")}
        />
        <h1>Safety</h1>
      </header>

      <main className="content-scroll">
        {/* SOS BANNER */}
        <div className="sos-banner">
          <button
            type="button"
            className="sos-circle"
            onClick={() => navigate("/sos-emergency")}
          >
            SOS
          </button>

          <div
            className="sos-text"
            onClick={() => navigate("/sos-emergency")}
            style={{ cursor: "pointer" }}
          >
            <span className="sos-label">EMERGENCY??</span>
            <h2>NEED HELP RIGHT NOW?</h2>
            <p>Tap the button to alert your trusted contact and us.</p>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="quick-actions">
          <div
            className="action-card green-tint"
            onClick={() => navigate("/silent-sos")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/silent-sos");
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <div className="action-icon">
              <FaBell />
            </div>

            <div className="action-text">
              <h3>Silent SOS</h3>
              <p>Alert us in an emergency situation.</p>
            </div>

            <FaChevronRight className="chevron" />
          </div>

          <div
            className="action-card blue-tint"
            onClick={() => navigate("/safety-checklist")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/safety-checklist");
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <div className="action-icon">
              <FaListUl />
            </div>

            <div className="action-text">
              <h3>Safety Checklist</h3>
              <p>Check the important safety items.</p>
            </div>

            <FaChevronRight className="chevron" />
          </div>
        </div>

        {/* STAY PROTECTED */}
        <h2 className="section-title">Stay Protected</h2>

        <div className="grid-container">
          <SafetyCard
            icon={<FaUsers />}
            title="Trusted Circle"
            subtitle="Share your live trip with family & friends."
            iconBg="#E9E3FF"
            iconColor="#6B4EFF"
            onClick={() => navigate("/trusted-circle")}
          />

          <SafetyCard
            icon={<FaExclamationCircle />}
            title="Discomfort Report"
            subtitle="Report us in an emergency situation."
            iconBg="#FFE5E5"
            iconColor="#FF4D4D"
            onClick={() => navigate("/discomfort-report")}
          />

          <SafetyCard
            icon={<FaSyncAlt />}
            title="Emergency Ride Switch"
            subtitle="Get a new driver if you feel unsafe."
            iconBg="#DFF7E9"
            iconColor="#00B368"
            onClick={() => navigate("/emergency-ride-switch")}
          />

          <SafetyCard
            icon={<FaShieldAlt />}
            title="Auto Block Unsafe Driver"
            subtitle="We block drivers with poor safety records."
            iconBg="#FFF4E5"
            iconColor="#FFA500"
            onClick={() => navigate("/auto-block-unsafe-driver")}
          />

          <SafetyCard
            icon={<FaUser />}
            title="Female Driver Preference"
            subtitle="Choose a female driver when available."
            iconBg="#E0E7FF"
            iconColor="#3B82F6"
            onClick={() => navigate("/female-driver-preferences")}
          />

          <SafetyCard
            icon={<FaSlidersH />}
            title="Comfort Filter"
            subtitle="Choose your comfortable ride."
            iconBg="#EBE0FF"
            iconColor="#8B5CF6"
            onClick={() => navigate("/comfort-filter")}
          />
        </div>

        {/* AUTOMATED NIGHT MODE */}
        <div
          className="full-width-card"
          onClick={() => navigate("/automated-night-mode")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate("/automated-night-mode");
            }
          }}
          style={{ cursor: "pointer" }}
        >
          <div
            className="card-icon-wrapper"
            style={{
              backgroundColor: "#F3E8FF",
              color: "#7E22CE",
            }}
          >
            <FaMoon />
          </div>

          <div className="card-content">
            <h4>Automated Night Mode</h4>
            <p>
              Extra safety features automatically activate during late-night
              rides.
            </p>
          </div>

          <div
            className={`toggle-switch ${nightMode ? "active" : ""}`}
            role="switch"
            aria-checked={nightMode}
            aria-label="Automated Night Mode"
            aria-disabled={loadingNightMode || savingNightMode}
            onClick={handleNightModeToggle}
            style={{
              cursor: loadingNightMode || savingNightMode ? "wait" : "pointer",
              opacity: loadingNightMode || savingNightMode ? 0.6 : 1,
            }}
          >
            <div className="toggle-circle"></div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="full-width-card footer-card">
          <div
            className="card-icon-wrapper"
            style={{
              backgroundColor: "#E0E7FF",
              color: "#3B82F6",
            }}
          >
            <FaLock />
          </div>

          <div className="card-content">
            <h4>Your safety is our top priority</h4>
            <p>We are here to keep you safe every step of the way.</p>
          </div>

          <FaShieldAlt className="footer-shield" />
          <FaChevronRight className="chevron" />
        </div>
      </main>
    </div>
  );
};

export default SafetyScreen;
