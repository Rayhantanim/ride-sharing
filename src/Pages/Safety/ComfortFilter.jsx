import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ComfortFilter.css";

import {
  FaChevronLeft,
  FaVolumeMute,
  FaSnowflake,
  FaMusic,
  FaComments,
  FaSmokingBan,
  FaChair,
  FaCheck,
} from "react-icons/fa";

const ComfortFilter = () => {
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState({
    quietRide: false,
    temperature: "Normal",
    music: false,
    conversation: "Low",
    smokeFree: true,
    extraComfort: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* =====================================================
     GET USER
  ===================================================== */

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

  /* =====================================================
     LOAD PREFERENCES
  ===================================================== */

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setLoading(true);

        const user = getUser();

        if (!user?.id) {
          console.log("❌ User not logged in.");

          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/safety/${user.id}`,
        );

        const data = await response.json();

        console.log("📥 Safety data:", data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to load preferences.");
        }

        if (data.comfortPreferences) {
          setPreferences({
            quietRide: data.comfortPreferences.quietRide ?? false,

            temperature: data.comfortPreferences.temperature || "Normal",

            music: data.comfortPreferences.music ?? false,

            conversation: data.comfortPreferences.conversation || "Low",

            smokeFree: data.comfortPreferences.smokeFree ?? true,

            extraComfort: data.comfortPreferences.extraComfort ?? false,
          });
        }
      } catch (error) {
        console.error("❌ LOAD COMFORT ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  /* =====================================================
     TOGGLE
  ===================================================== */

  const togglePreference = (key) => {
    setPreferences((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  /* =====================================================
     SELECT
  ===================================================== */

  const selectPreference = (key, value) => {
    setPreferences((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSavePreferences = async () => {
    try {
      setSaving(true);

      const user = getUser();

      if (!user?.id) {
        alert("Please login first.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/safety/${user.id}/settings`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            comfortFilter: true,

            comfortPreferences: preferences,
          }),
        },
      );

      const data = await response.json();

      console.log("📥 SAVE COMFORT RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to save comfort preferences.");
      }

      alert("Comfort preferences saved successfully.");

      navigate("/safety-preview");
    } catch (error) {
      console.error("❌ SAVE COMFORT ERROR:", error);

      alert(error.message || "Failed to save comfort preferences.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="comfort-container">
      {/* ================= HEADER ================= */}

      <header className="comfort-header">
        <FaChevronLeft
          className="comfort-back"
          onClick={() => navigate("/safety-preview")}
        />

        <h1>Comfort Filter</h1>
      </header>

      {/* ================= CONTENT ================= */}

      <main className="comfort-content">
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#6B7280",
            }}
          >
            Loading your preferences...
          </div>
        ) : (
          <>
            {/* ================= INTRO ================= */}

            <div className="comfort-intro">
              <div className="comfort-intro-icon">
                <FaChair />
              </div>

              <div>
                <h2>Your comfort matters</h2>

                <p>
                  Choose your ride preferences for a more comfortable journey.
                </p>
              </div>
            </div>

            {/* ================= QUIET RIDE ================= */}

            <div className="comfort-card">
              <div className="comfort-card-left">
                <div className="comfort-icon purple">
                  <FaVolumeMute />
                </div>

                <div>
                  <h3>Quiet Ride</h3>

                  <p>Prefer a calm and quiet ride.</p>
                </div>
              </div>

              <button
                type="button"
                className={`comfort-toggle ${
                  preferences.quietRide ? "active" : ""
                }`}
                onClick={() => togglePreference("quietRide")}
              >
                <span></span>
              </button>
            </div>

            {/* ================= TEMPERATURE ================= */}

            <div className="comfort-section">
              <div className="section-heading">
                <div className="comfort-icon blue">
                  <FaSnowflake />
                </div>

                <div>
                  <h3>Temperature</h3>

                  <p>Choose your preferred temperature.</p>
                </div>
              </div>

              <div className="option-row">
                {["Cool", "Normal", "Warm"].map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={`option-button ${
                      preferences.temperature === item ? "selected" : ""
                    }`}
                    onClick={() => selectPreference("temperature", item)}
                  >
                    {preferences.temperature === item && <FaCheck />}

                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* ================= MUSIC ================= */}

            <div className="comfort-card">
              <div className="comfort-card-left">
                <div className="comfort-icon pink">
                  <FaMusic />
                </div>

                <div>
                  <h3>Music Preference</h3>

                  <p>Allow music during your ride.</p>
                </div>
              </div>

              <button
                type="button"
                className={`comfort-toggle ${
                  preferences.music ? "active" : ""
                }`}
                onClick={() => togglePreference("music")}
              >
                <span></span>
              </button>
            </div>

            {/* ================= CONVERSATION ================= */}

            <div className="comfort-section">
              <div className="section-heading">
                <div className="comfort-icon green">
                  <FaComments />
                </div>

                <div>
                  <h3>Conversation</h3>

                  <p>Choose your preferred conversation level.</p>
                </div>
              </div>

              <div className="option-row conversation-options">
                {["Low", "Normal", "Friendly"].map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={`option-button ${
                      preferences.conversation === item ? "selected" : ""
                    }`}
                    onClick={() => selectPreference("conversation", item)}
                  >
                    {preferences.conversation === item && <FaCheck />}

                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* ================= SMOKE FREE ================= */}

            <div className="comfort-card">
              <div className="comfort-card-left">
                <div className="comfort-icon red">
                  <FaSmokingBan />
                </div>

                <div>
                  <h3>Smoke-Free Ride</h3>

                  <p>Prefer a smoke-free environment.</p>
                </div>
              </div>

              <button
                type="button"
                className={`comfort-toggle ${
                  preferences.smokeFree ? "active" : ""
                }`}
                onClick={() => togglePreference("smokeFree")}
              >
                <span></span>
              </button>
            </div>

            {/* ================= EXTRA COMFORT ================= */}

            <div className="comfort-card">
              <div className="comfort-card-left">
                <div className="comfort-icon orange">
                  <FaChair />
                </div>

                <div>
                  <h3>Extra Comfort</h3>

                  <p>Prioritize vehicles with more comfortable seating.</p>
                </div>
              </div>

              <button
                type="button"
                className={`comfort-toggle ${
                  preferences.extraComfort ? "active" : ""
                }`}
                onClick={() => togglePreference("extraComfort")}
              >
                <span></span>
              </button>
            </div>

            {/* ================= INFO ================= */}

            <div className="comfort-info">
              <FaCheck />

              <p>
                Your preferences will be considered when matching you with
                available rides.
              </p>
            </div>

            {/* ================= SAVE ================= */}

            <button
              type="button"
              className="save-comfort-button"
              onClick={handleSavePreferences}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </>
        )}
      </main>
    </div>
  );
};

export default ComfortFilter;
