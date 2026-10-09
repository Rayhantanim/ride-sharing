import React, { useEffect, useState } from "react";
import "./FemaleDriverPreferences.css";
import { FaChevronLeft, FaFemale, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FemaleDriverPreferences = () => {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState("always");

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  /* ================= GET USER ================= */

  const getUser = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Invalid stored user:", error);
      return null;
    }
  };

  /* ================= LOAD PREFERENCE ================= */

  useEffect(() => {
    const loadPreference = async () => {
      try {
        const user = getUser();
        const userId = user?.id || user?._id;

        if (!userId) {
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/safety/${userId}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load driver preference.");
        }

        const preference = data.femaleDriverPreference;

        if (["always", "available", "off"].includes(preference)) {
          setSelectedOption(preference);
        } else if (typeof preference === "boolean") {
          // Support older Boolean values in MongoDB
          setSelectedOption(preference ? "always" : "off");
        }
      } catch (error) {
        console.error("Failed to load female driver preference:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPreference();
  }, []);

  /* ================= SAVE PREFERENCE ================= */

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);

      const user = getUser();
      const userId = user?.id || user?._id;

      if (!userId) {
        alert("Please login first.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/safety/${userId}/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            femaleDriverPreference: selectedOption,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save driver preference.");
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save female driver preference:", error);

      alert(error.message || "Failed to save preferences.");
    } finally {
      setSaving(false);
    }
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

          {loading ? (
            <p>Loading your preferences...</p>
          ) : (
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
          )}
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
            disabled={loading || saving}
          >
            {saving ? "Saving..." : "Save Preferences"}
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
