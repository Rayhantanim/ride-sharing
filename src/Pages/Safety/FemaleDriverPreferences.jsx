import React, { useState } from "react";
import "./FemaleDriverPreferences.css";
import { FaChevronLeft, FaFemale, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FemaleDriverPreferences = () => {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState("always");

  const [saved, setSaved] = useState(false);

  const options = [
    {
      id: "always",
      title: "Always",
      subtitle: "Always try to pick a female driver",
    },
    {
      id: "available",
      title: "When available",
      subtitle: "Assign a female driver if available",
    },
    {
      id: "off",
      title: "Off",
      subtitle: "Don't prefer female drivers",
    },
  ];

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="female-page-wrapper">
      <div className="female-app-container">
        {/* Header */}
        <header className="female-header">
          <button
            type="button"
            className="female-back-button"
            onClick={() => navigate("/safety-preview")}
            aria-label="Go back"
          >
            <FaChevronLeft />
          </button>

          <h1>Female Driver Preferences</h1>
        </header>

        {/* Illustration */}
        <section className="female-illustration-section">
          <div className="female-icon-circle">
            <FaFemale />
          </div>

          <h2>
            Prefer Female
            <br />
            Drivers For Your Ride
          </h2>

          <p>
            Choose how you want us to prioritize
            <br />
            female drivers for your rides.
          </p>
        </section>

        {/* Options */}
        <section className="female-options-section">
          <h2 className="female-section-title">Choose your preference</h2>

          <div className="female-options-wrapper">
            {options.map((option) => (
              <button
                type="button"
                key={option.id}
                className={`female-radio-card ${
                  selectedOption === option.id ? "selected" : ""
                }`}
                onClick={() => setSelectedOption(option.id)}
              >
                <div className="female-radio-circle">
                  <div className="female-radio-inner"></div>
                </div>

                <div className="female-radio-content">
                  <h3>{option.title}</h3>
                  <p>{option.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Success message */}
        {saved && (
          <div className="female-success-message">
            <FaCheckCircle />
            <span>Your preference has been saved.</span>
          </div>
        )}

        {/* Bottom */}
        <section className="female-bottom-section">
          <button
            type="button"
            className="female-save-button"
            onClick={handleSave}
          >
            Save Preferences
          </button>

          <p className="female-footer-text">
            We will try our best to
            <br />
            match your preferences.
          </p>
        </section>
      </div>
    </div>
  );
};

export default FemaleDriverPreferences;
