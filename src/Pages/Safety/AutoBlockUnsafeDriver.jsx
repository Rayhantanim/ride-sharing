import React, { useState } from "react";
import "./AutoBlockUnsafeDriver.css";
import {
  FaChevronLeft,
  FaShieldAlt,
  FaBan,
  FaCheckCircle,
  FaUserShield,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AutoBlockUnsafeDriver = () => {
  const navigate = useNavigate();

  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <div className="auto-block-page-wrapper">
      <div className="auto-block-app-container">
        {/* Header */}
        <header className="auto-block-header">
          <button
            type="button"
            className="auto-block-back-button"
            onClick={() => navigate("/safety-preview")}
            aria-label="Go back"
          >
            <FaChevronLeft />
          </button>

          <h1>Auto Block Unsafe Driver</h1>
        </header>

        {/* Illustration */}
        <section className="auto-block-illustration">
          <div className="auto-block-icon-circle">
            <FaShieldAlt />
          </div>

          <h2>
            Stay Protected From
            <br />
            Unsafe Drivers
          </h2>

          <p>
            Drivers with poor safety records may be
            <br />
            automatically blocked from your rides.
          </p>
        </section>

        {/* Toggle */}
        <section className="auto-block-toggle-card">
          <div className="auto-block-toggle-info">
            <h3>Auto Block Protection</h3>

            <p>Automatically avoid drivers with poor safety records.</p>
          </div>

          <button
            type="button"
            className={`auto-block-toggle ${isEnabled ? "active" : ""}`}
            onClick={() => setIsEnabled(!isEnabled)}
            aria-label="Toggle auto block protection"
          >
            <span className="auto-block-toggle-knob"></span>
          </button>
        </section>

        {/* Status */}
        <div
          className={`auto-block-status ${isEnabled ? "enabled" : "disabled"}`}
        >
          <FaCheckCircle />

          <span>
            {isEnabled
              ? "Auto Block Protection is enabled"
              : "Auto Block Protection is disabled"}
          </span>
        </div>

        {/* Protection Features */}
        <section className="auto-block-features-card">
          <h3>Protection Includes</h3>

          <div className="auto-block-feature-list">
            <div className="auto-block-feature-item">
              <div className="auto-block-feature-icon">
                <FaBan />
              </div>

              <div>
                <h4>Unsafe Driver Detection</h4>
                <p>Drivers with repeated safety issues can be identified.</p>
              </div>
            </div>

            <div className="auto-block-feature-item">
              <div className="auto-block-feature-icon">
                <FaUserShield />
              </div>

              <div>
                <h4>Safer Driver Matching</h4>
                <p>
                  We try to match you with drivers who have better safety
                  records.
                </p>
              </div>
            </div>

            <div className="auto-block-feature-item">
              <div className="auto-block-feature-icon">
                <FaShieldAlt />
              </div>

              <div>
                <h4>Extra Protection</h4>
                <p>
                  Your safety preferences are considered during driver
                  selection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Info */}
        <section className="auto-block-info-box">
          <div className="auto-block-info-icon">
            <FaShieldAlt />
          </div>

          <div>
            <h3>Your Safety Comes First</h3>

            <p>
              When enabled, we will automatically try to prevent unsafe drivers
              from being assigned to your ride.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AutoBlockUnsafeDriver;
