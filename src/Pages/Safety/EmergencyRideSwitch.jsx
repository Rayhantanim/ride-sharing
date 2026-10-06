import React, { useState, useEffect } from "react";
import "./EmergencyRideSwitch.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MapPinIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#65A30D">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const EmergencyRideSwitch = () => {
  const navigate = useNavigate();

  const [seconds, setSeconds] = useState(30);
  const [requested, setRequested] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (seconds > 0 && !cancelled) {
      const timer = setTimeout(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [seconds, cancelled]);

  const handleRequestDriver = () => {
    setRequested(true);
    setCancelled(false);
    setSeconds(30);
  };

  const handleCancel = () => {
    setCancelled(true);
    setRequested(false);
  };

  const radius = 26;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = circumference - (seconds / 30) * circumference;

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Header */}
        <header className="header">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/safety-preview")}
            aria-label="Go back"
          >
            <FaArrowLeft className="back-icon" />
          </button>

          <h1 className="header-title">Emergency Ride Switch</h1>
        </header>

        {/* Illustration */}
        <div className="illustration-container">
          <MapPinIcon className="map-pin left" />

          <MapPinIcon className="map-pin right" />

          <div className="dashed-path-left"></div>

          <div className="dashed-path-right"></div>

          <div className="cloud-background"></div>

          {/* Car */}
          <div className="car-wrapper">
            <div className="car-body"></div>

            <div className="car-roof"></div>

            <div className="car-window"></div>

            <div className="car-headlight"></div>

            <div className="wheel-front"></div>

            <div className="wheel-back"></div>
          </div>
        </div>

        {/* Main Text */}
        <h2 className="main-text">
          {requested
            ? "Your request for a new driver has been sent."
            : "Get a new Driver if you feel unsafe or uncomfortable"}
        </h2>

        {/* Request Button */}
        {!requested ? (
          <button
            type="button"
            className="primary-button"
            onClick={handleRequestDriver}
          >
            Request New Driver
          </button>
        ) : (
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel Request
          </button>
        )}

        {/* Timer */}
        <div className="timer-container">
          <p className="timer-text">
            {requested && !cancelled
              ? "You Can Cancel The"
              : "You Can Cancel The"}
            <br />
            Request Within 30s
          </p>

          <div className="timer-circle-wrapper">
            <svg className="timer-svg" viewBox="0 0 60 60">
              <circle className="timer-circle-bg" cx="30" cy="30" r={radius} />

              <circle
                className="timer-circle-progress"
                cx="30"
                cy="30"
                r={radius}
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
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

export default EmergencyRideSwitch;
