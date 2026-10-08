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
  const [loading, setLoading] = useState(false);

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

  const handleActivate = async () => {
    try {
      setLoading(true);

      const user = getUser();

      if (!user?.id) {
        alert("Please login first.");
        return;
      }

      let locationData = {
        address: "",
        lat: null,
        lng: null,
      };

      // Try to get current browser location
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            });
          });

          locationData = {
            address: "Current location",
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        } catch (locationError) {
          console.log("⚠️ Location unavailable:", locationError.message);
        }
      }

      const response = await fetch(
        `http://localhost:5000/api/safety/${user.id}/sos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "silent-sos",
            message: "Silent SOS activated by the user.",
            address: locationData.address,
            lat: locationData.lat,
            lng: locationData.lng,
          }),
        },
      );

      const data = await response.json();

      console.log("📥 Silent SOS response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to activate Silent SOS.");
      }

      setActive(true);

      alert("Silent SOS activated successfully.");
    } catch (error) {
      console.error("❌ Silent SOS error:", error);

      alert(error.message || "Failed to activate Silent SOS.");
    } finally {
      setLoading(false);
    }
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
            disabled={active || loading}
          >
            {loading ? (
              "Activating..."
            ) : active ? (
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
