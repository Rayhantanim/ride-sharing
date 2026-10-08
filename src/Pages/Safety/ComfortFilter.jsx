import React, { useState } from "react";
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

  const togglePreference = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const selectPreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="comfort-container">
      <header className="comfort-header">
        <FaChevronLeft
          className="comfort-back"
          onClick={() => navigate("/safety-preview")}
        />
        <h1>Comfort Filter</h1>
      </header>

      <main className="comfort-content">
        <div className="comfort-intro">
          <div className="comfort-intro-icon">
            <FaChair />
          </div>

          <div>
            <h2>Your comfort matters</h2>
            <p>Choose your ride preferences for a more comfortable journey.</p>
          </div>
        </div>

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
            className={`comfort-toggle ${preferences.music ? "active" : ""}`}
            onClick={() => togglePreference("music")}
          >
            <span></span>
          </button>
        </div>

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

        <div className="comfort-info">
          <FaCheck />

          <p>
            Your preferences will be considered when matching you with available
            rides.
          </p>
        </div>

        <button
          type="button"
          className="save-comfort-button"
          onClick={() => navigate("/safety-preview")}
        >
          Save Preferences
        </button>
      </main>
    </div>
  );
};

export default ComfortFilter;
