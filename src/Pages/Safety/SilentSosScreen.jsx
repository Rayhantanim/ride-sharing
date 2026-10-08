import React, { useState } from "react";
import "./SilentSosScreen.css";
import {
  FaChevronLeft,
  FaBellSlash,
  FaUsers,
  FaChevronRight,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SilentSosScreen = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);

  const handleActivate = () => {
    setActive(true);
  };

  return (
    <div className="silent-page-wrapper">
      <div className="silent-app-container">
        {/* Header */}
        <header className="silent-header">
          <button
            type="button"
            className="silent-back-button"
            onClick={() => navigate("/safety-preview")}
            aria-label="Go back"
          >
            <FaChevronLeft />
          </button>

          <h1>Silent SOS</h1>
        </header>

        {/* Main Content */}
        <main className="silent-content">
          {/* Icon */}
          <div className={`silent-icon-circle ${active ? "active" : ""}`}>
            {active ? <FaCheckCircle /> : <FaBellSlash />}
          </div>

          {/* Status */}
          <h2 className="silent-status-title">
            {active ? "Silent SOS is active" : "Silent SOS is ready"}
          </h2>

          <p className="silent-status-subtitle">
            {active ? (
              <>
                Your emergency alert system is active.
                <br />
                Your trusted contacts and our team will be
                <br />
                silently notified.
              </>
            ) : (
              <>
                Activate Silent SOS to alert your trusted
                <br />
                contacts and our team without making a call.
              </>
            )}
          </p>

          {/* Trusted Circle */}
          <div
            className="silent-trusted-card"
            onClick={() => navigate("/trusted-circle")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate("/trusted-circle");
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <div className="silent-trusted-icon">
              <FaUsers />
            </div>

            <div className="silent-trusted-content">
              <h3>Trusted Circle</h3>

              <p>
                Share emergency alerts with your
                <br />
                trusted contacts.
              </p>
            </div>

            <FaChevronRight className="silent-chevron" />
          </div>

          {/* Information */}
          <div className="silent-info-card">
            <div className="silent-info-dot"></div>

            <div>
              <h3>How Silent SOS works</h3>

              <p>
                When activated, an emergency alert can be sent discreetly
                without making a phone call.
              </p>
            </div>
          </div>
        </main>

        {/* Bottom Section */}
        <section className="silent-bottom-section">
          <button
            type="button"
            className={`silent-primary-button ${active ? "activated" : ""}`}
            onClick={handleActivate}
            disabled={active}
          >
            {active ? (
              <>
                <FaCheckCircle />
                Silent SOS Activated
              </>
            ) : (
              "Activate Silent SOS"
            )}
          </button>

          <div className="silent-warning-box">
            <p>
              SOS will be sent silently
              <br />
              within 30 seconds.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SilentSosScreen;
