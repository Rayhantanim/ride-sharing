import React, { useState } from "react";
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

const SafetyCard = ({ icon, title, subtitle, iconBg, iconColor, onClick }) => (
  <div
    className="card"
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={(e) => {
      if (onClick && (e.key === "Enter" || e.key === " ")) {
        onClick();
      }
    }}
    style={{
      cursor: onClick ? "pointer" : "default",
    }}
  >
    <div
      className="card-icon-wrapper"
      style={{
        backgroundColor: iconBg,
        color: iconColor,
      }}
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
  const [nightMode, setNightMode] = useState(true);

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
        {/* =========================
            SOS BANNER
        ========================= */}

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

        {/* =========================
            QUICK ACTIONS
        ========================= */}

        <div className="quick-actions">
          {/* Silent SOS */}
          <div
            className="action-card green-tint"
            onClick={() => navigate("/silent-sos")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
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

          {/* Safety Checklist */}
          <div
            className="action-card blue-tint"
            onClick={() => navigate("/safety-checklist")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
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

        {/* =========================
            SECTION TITLE
        ========================= */}

        <h2 className="section-title">Stay Protected</h2>

        {/* =========================
            SAFETY CARDS
        ========================= */}

        <div className="grid-container">
          {/* Trusted Circle */}
          <SafetyCard
            icon={<FaUsers />}
            title="Trusted Circle"
            subtitle="Share your live trip with family & friends."
            iconBg="#E9E3FF"
            iconColor="#6B4EFF"
            onClick={() => navigate("/trusted-circle")}
          />

          {/* Discomfort Report */}
          <SafetyCard
            icon={<FaExclamationCircle />}
            title="Discomfort Report"
            subtitle="Report us in an emergency situation."
            iconBg="#FFE5E5"
            iconColor="#FF4D4D"
            onClick={() => navigate("/discomfort-report")}
          />

          {/* Emergency Ride Switch */}
          <SafetyCard
            icon={<FaSyncAlt />}
            title="Emergency Ride Switch"
            subtitle="Get a new driver if you feel unsafe."
            iconBg="#DFF7E9"
            iconColor="#00B368"
            onClick={() => navigate("/emergency-ride-switch")}
          />

          {/* Auto Block Unsafe Driver */}
          <SafetyCard
            icon={<FaShieldAlt />}
            title="Auto Block Unsafe Driver"
            subtitle="We block drivers with poor safety records."
            iconBg="#FFF4E5"
            iconColor="#FFA500"
            onClick={() => navigate("/auto-block-unsafe-driver")}
          />

          {/* Female Driver Preference */}
          <SafetyCard
            icon={<FaUser />}
            title="Female Driver Preference"
            subtitle="Choose a female driver when available."
            iconBg="#E0E7FF"
            iconColor="#3B82F6"
            onClick={() => navigate("/female-driver-preferences")}
          />

          {/* Comfort Filter */}
          <SafetyCard
            icon={<FaSlidersH />}
            title="Comfort Filter"
            subtitle="Choose your comfortable ride."
            iconBg="#EBE0FF"
            iconColor="#8B5CF6"
            onClick={() => navigate("/comfort-filter")}
          />
        </div>

        {/* =========================
            NIGHT MODE
        ========================= */}

        <div
          className="full-width-card"
          onClick={() => navigate("/automated-night-mode")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
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

          {/* Toggle */}
          <div
            className={`toggle-switch ${nightMode ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setNightMode(!nightMode);
            }}
          >
            <div className="toggle-circle"></div>
          </div>
        </div>

        {/* =========================
            FOOTER
        ========================= */}

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
