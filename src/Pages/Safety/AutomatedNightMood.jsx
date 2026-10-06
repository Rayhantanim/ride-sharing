import React, { useState } from "react";
import "./AutomatedNightMood.css";
import {
  FaChevronLeft,
  FaMoon,
  FaBellSlash,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AutomatedNightMood = () => {
  const navigate = useNavigate();

  const [isNightMode, setIsNightMode] = useState(true);

  return (
    <div className="night-page-wrapper">
      <div className="night-app-container">
        {/* Header */}
        <header className="night-header">
          <button
            type="button"
            className="night-back-button"
            onClick={() => navigate("/safety-preview")}
            aria-label="Go back"
          >
            <FaChevronLeft />
          </button>

          <h1>Automated Night Mode</h1>
        </header>

        {/* Illustration */}
        <section className="night-illustration-section">
          <div className="night-icon-circle">
            <FaMoon />
          </div>

          <h2>
            Automatically Activate
            <br />
            During Late-Night Rides
          </h2>

          <p>
            Extra safety features will activate
            <br />
            automatically during late-night rides.
          </p>
        </section>

        {/* Toggle */}
        <section className="night-toggle-card">
          <div className="night-toggle-info">
            <h3>Night Mode</h3>

            <p>10:00 PM to 6:00 AM</p>
          </div>

          <button
            type="button"
            className={`night-toggle-switch ${isNightMode ? "active" : ""}`}
            onClick={() => setIsNightMode(!isNightMode)}
            aria-label="Toggle night mode"
          >
            <span className="night-toggle-knob"></span>
          </button>
        </section>

        {/* Status */}
        <div className={`night-status ${isNightMode ? "enabled" : "disabled"}`}>
          <FaCheckCircle />

          <span>
            {isNightMode
              ? "Night Mode is enabled"
              : "Night Mode is currently disabled"}
          </span>
        </div>

        {/* Features */}
        <section className="night-features-card">
          <h3>Features Included</h3>

          <ul>
            <li>Live Location Sharing</li>
            <li>Ride Monitoring</li>
            <li>SOS Quick Access</li>
          </ul>
        </section>

        {/* Bottom Notification */}
        <section className="night-notification-box">
          <div className="night-notification-icon">
            <FaBellSlash />
          </div>

          <div>
            <h3>Automatic Safety Protection</h3>

            <p>
              You will be notified when Night Mode
              <br />
              is automatically activated.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AutomatedNightMood;
