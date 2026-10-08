import React, { useEffect, useState } from "react";
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
  const [sosSent, setSosSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [locationText, setLocationText] = useState("Location unavailable");

  const [locationData, setLocationData] = useState({
    address: "",
    lat: null,
    lng: null,
  });

  const [trustedCount, setTrustedCount] = useState(0);

  /* ================= GET USER ================= */

  const getUser = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("❌ Invalid user data:", error);
      return null;
    }
  };

  /* ================= GET LOCATION ================= */

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      return {
        address: "Location unavailable",
        lat: null,
        lng: null,
      };
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 7000,
          maximumAge: 0,
        });
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      return {
        address: "Current location",
        lat,
        lng,
      };
    } catch (error) {
      console.log("⚠️ Location unavailable:", error.message);

      return {
        address: "Location unavailable",
        lat: null,
        lng: null,
      };
    }
  };

  /* ================= LOAD SAFETY INFO ================= */

  useEffect(() => {
    const loadSafetyInfo = async () => {
      try {
        const user = getUser();

        if (!user?.id) {
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/safety/${user.id}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load safety data.");
        }

        setTrustedCount(data.trustedContacts?.length || 0);

        const currentLocation = await getCurrentLocation();

        setLocationData(currentLocation);

        setLocationText(
          currentLocation.lat !== null
            ? `${currentLocation.lat.toFixed(
                5,
              )}, ${currentLocation.lng.toFixed(5)}`
            : "Location unavailable",
        );
      } catch (error) {
        console.error("❌ Safety information error:", error);
      }
    };

    loadSafetyInfo();
  }, []);

  /* ================= SOS TIMER ================= */

  useEffect(() => {
    if (!sosSent || seconds <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [sosSent, seconds]);

  /* ================= SEND SOS ================= */

  const handleSendSos = async () => {
    try {
      setLoading(true);

      const user = getUser();

      if (!user?.id) {
        alert("Please login first.");
        return;
      }

      const currentLocation = await getCurrentLocation();

      setLocationData(currentLocation);

      setLocationText(
        currentLocation.lat !== null
          ? `${currentLocation.lat.toFixed(
              5,
            )}, ${currentLocation.lng.toFixed(5)}`
          : "Location unavailable",
      );

      const response = await fetch(
        `http://localhost:5000/api/safety/${user.id}/sos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "sos",
            message: "Emergency SOS activated by the user.",
            address: currentLocation.address,
            lat: currentLocation.lat,
            lng: currentLocation.lng,
          }),
        },
      );

      const data = await response.json();

      console.log("📥 Emergency SOS response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to send SOS alert.");
      }

      setSosSent(true);
      setSeconds(30);

      alert("Emergency SOS alert recorded successfully.");
    } catch (error) {
      console.error("❌ Emergency SOS error:", error);

      alert(error.message || "Failed to send SOS alert.");
    } finally {
      setLoading(false);
    }
  };

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

          <div
            className="list-item"
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

              <p className="item-subtitle">{locationText}</p>
            </div>

            <FaChevronRight className="chevron-right" />
          </div>

          {/* Trusted Contacts */}

          <div
            className="list-item"
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
            <div className="icon-wrapper">
              <FaUsers />
            </div>

            <div className="item-content">
              <h3 className="item-title">Share With</h3>

              <p className="item-subtitle">
                {trustedCount} Trusted Contact
                {trustedCount !== 1 ? "s" : ""}
              </p>
            </div>

            <FaChevronRight className="chevron-right" />
          </div>
        </div>

        {/* SOS Button */}

        <button
          type="button"
          className="primary-button"
          onClick={handleSendSos}
          disabled={loading || sosSent}
        >
          {loading
            ? "Sending..."
            : sosSent
              ? "SOS Alert Sent"
              : "Send SOS Alert"}
        </button>

        {/* Timer */}

        <div className="timer-container">
          <p className="timer-text">
            {sosSent ? "SOS Alert Active" : "You Can Cancel The"}
            <br />
            {sosSent ? "Emergency response window" : "Alert Within 30s"}
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
