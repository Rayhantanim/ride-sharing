import React, { useState, useEffect } from "react";
import "./SosEmergency.css";
import {
  FaArrowLeft,
  FaBell,
  FaMapMarkerAlt,
  FaUsers,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SosEmergencyScreen = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [seconds]);

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Header */}
        <header className="header">
          <button
            className="back-button"
            onClick={() => navigate("/safety-preview")}
            aria-label="Go back"
          >
            <FaArrowLeft className="back-icon" />
          </button>

          <h1 className="header-title">SOS EMERGENCY</h1>
        </header>

        {/* SOS Section */}
        <div className="sos-section">
          <div className="sos-circle">
            <span className="sos-text">SOS</span>
          </div>

          <p className="description-text">
            We will send alert to your trusted
            <br />
            circle and notify our team
            <br />
            immediately
          </p>
        </div>

        {/* Options */}
        <div className="list-container">
          {/* Silent SOS */}
          <div className="list-item">
            <div className="icon-wrapper">
              <FaBell />
            </div>

            <div className="item-content">
              <h3 className="item-title">Silent SOS</h3>
              <p className="item-subtitle">Discreetly Alert Without Call</p>
            </div>

            <FaChevronRight className="chevron-right" />
          </div>

          {/* Location */}
          <div className="list-item">
            <div className="icon-wrapper">
              <FaMapMarkerAlt />
            </div>

            <div className="item-content">
              <h3 className="item-title">Your Location</h3>
              <p className="item-subtitle">GEC Circle, Chottogram</p>
            </div>

            <FaChevronRight className="chevron-right" />
          </div>

          {/* Trusted Contacts */}
          <div className="list-item">
            <div className="icon-wrapper">
              <FaUsers />
            </div>

            <div className="item-content">
              <h3 className="item-title">Share With</h3>
              <p className="item-subtitle">3 Trusted Contacts</p>
            </div>

            <FaChevronRight className="chevron-right" />
          </div>
        </div>

        {/* SOS Button */}
        <button className="primary-button">Send SOS Alert</button>

        {/* Timer */}
        <div className="timer-container">
          <p className="timer-text">
            You Can Cancel The
            <br />
            Alert Within 30s
          </p>

          <div className="timer-circle-wrapper">
            <svg className="timer-svg" viewBox="0 0 50 50">
              <circle className="timer-circle-bg" cx="25" cy="25" r="20" />

              <circle
                className="timer-circle-progress"
                cx="25"
                cy="25"
                r="20"
                style={{
                  strokeDasharray: 126,
                  strokeDashoffset: 126 - (126 * seconds) / 30,
                }}
              />
            </svg>

            <span className="timer-seconds">{seconds}s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SosEmergencyScreen;
