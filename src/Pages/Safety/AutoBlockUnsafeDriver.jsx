import React, { useEffect, useState } from "react";
import "./AutoBlockUnsafeDriver.css";
import {
  FaChevronLeft,
  FaShieldAlt,
  FaBan,
  FaCheckCircle,
  FaUserShield,
  FaHistory,
  FaClock,
  FaSyncAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/safety";

function getLoggedInUserId() {
  const directId =
    localStorage.getItem("userId") || localStorage.getItem("userID");

  if (directId) return directId;

  for (const key of ["user", "currentUser", "userData", "userInfo"]) {
    const stored = localStorage.getItem(key);
    if (!stored) continue;

    try {
      const user = JSON.parse(stored);
      const id = user?._id || user?.id || user?.userId;
      if (id) return String(id);
    } catch {
      // Try the next possible storage key.
    }
  }

  return null;
}

const AutoBlockUnsafeDriver = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [history, setHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [historyError, setHistoryError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Load saved history from MongoDB.
  const loadHistory = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(id)}/auto-block-history`,
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Could not load history.");
      }

      const savedHistory = Array.isArray(data.history) ? data.history : [];

      setHistory(savedHistory);
      setHistoryError("");
    } catch (error) {
      setHistoryError(
        error.message || "Could not connect to the history service.",
      );
    }
  };

  // Load existing preference and history when the page opens.
  useEffect(() => {
    let isMounted = true;

    const initialisePage = async () => {
      const id = getLoggedInUserId();

      if (!id) {
        setErrorMessage(
          "User ID not found. Please check how your login page stores the user ID.",
        );
        setIsLoading(false);
        return;
      }

      setUserId(id);

      try {
        const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`);

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Could not load safety settings.");
        }

        const profile =
          data?.safetyProfile ??
          data?.safety ??
          data?.profile ??
          data?.data ??
          data;

        const settings =
          profile?.settings ?? profile?.safetySettings ?? profile;

        if (isMounted && typeof settings?.autoBlockUnsafeDriver === "boolean") {
          setIsEnabled(settings.autoBlockUnsafeDriver);
        }

        if (isMounted) setErrorMessage("");
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error.message || "Could not load your saved safety setting.",
          );
        }
      }

      if (isMounted) {
        await loadHistory(id);
        setIsLoading(false);
      }
    };

    initialisePage();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save the preference, then record that change in the history collection.
  const handleToggle = async () => {
    if (!userId || isLoading || isSaving) return;

    const newValue = !isEnabled;

    setIsSaving(true);
    setErrorMessage("");
    setHistoryError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(userId)}/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            autoBlockUnsafeDriver: newValue,
          }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || "Could not save the Auto Block setting.",
        );
      }

      // The setting has been saved successfully.
      setIsEnabled(newValue);

      try {
        const historyResponse = await fetch(
          `${API_URL}/${encodeURIComponent(userId)}/auto-block-history`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              enabled: newValue,
            }),
          },
        );

        const historyData = await historyResponse.json().catch(() => ({}));

        if (
          !historyResponse.ok ||
          historyData.success === false ||
          !historyData.history
        ) {
          throw new Error(
            historyData.message || "Could not save the history entry.",
          );
        }

        // Display the saved database record, not a fabricated event.
        setHistory((previous) =>
          [historyData.history, ...previous].slice(0, 30),
        );

        setSuccessMessage(
          `Auto Block setting saved: ${newValue ? "ON" : "OFF"}.`,
        );
        setHistoryError("");
      } catch (historySaveError) {
        setHistoryError(
          `Your setting was saved, but its history entry failed: ${historySaveError.message}`,
        );
        setSuccessMessage("Your Auto Block setting was saved.");
        await loadHistory(userId);
      }
    } catch (error) {
      setErrorMessage(
        error.message || "Could not save your safety preference.",
      );
    } finally {
      setIsSaving(false);
    }
  };

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

        {/* Illustration — original layout preserved */}
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
            role="switch"
            aria-checked={isEnabled}
            className={`auto-block-toggle ${isEnabled ? "active" : ""}`}
            onClick={handleToggle}
            disabled={isLoading || isSaving || !userId}
            aria-label="Toggle auto block protection"
          >
            <span className="auto-block-toggle-knob"></span>
          </button>
        </section>

        {/* Status */}
        <div
          className={`auto-block-status ${isEnabled ? "enabled" : "disabled"}`}
          aria-live="polite"
        >
          {isEnabled ? <FaCheckCircle /> : <FaBan />}

          <span>
            {isLoading
              ? "Loading saved protection setting..."
              : isSaving
                ? "Saving protection setting..."
                : isEnabled
                  ? "Auto Block Protection is enabled"
                  : "Auto Block Protection is disabled"}
          </span>
        </div>

        {errorMessage && (
          <div
            className="auto-block-message auto-block-message-error"
            role="alert"
          >
            <FaExclamationTriangle />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            className="auto-block-message auto-block-message-success"
            role="status"
          >
            <FaCheckCircle />
            <span>{successMessage}</span>
          </div>
        )}

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

        {/* New History card — original design remains above */}
        <section className="auto-block-history-card">
          <div className="auto-block-history-heading">
            <div className="auto-block-history-title">
              <div className="auto-block-history-icon">
                <FaHistory />
              </div>

              <div>
                <h3>Recent Safety History</h3>
                <p>Your latest Auto Block setting changes</p>
              </div>
            </div>

            <button
              type="button"
              className="auto-block-history-refresh"
              onClick={() => loadHistory(userId)}
              disabled={!userId}
              aria-label="Refresh safety history"
              title="Refresh history"
            >
              <FaSyncAlt />
            </button>
          </div>

          {historyError && (
            <div className="auto-block-history-error" role="alert">
              <FaExclamationTriangle />
              <span>{historyError}</span>
            </div>
          )}

          {history.length === 0 ? (
            <div className="auto-block-history-empty">
              <FaClock />
              <p>
                {isLoading
                  ? "Loading your history..."
                  : "No saved Auto Block changes yet. Turn the setting ON or OFF to record your first entry."}
              </p>
            </div>
          ) : (
            <div className="auto-block-history-list">
              {history.map((item) => (
                <div
                  className="auto-block-history-item"
                  key={item._id || `${item.enabled}-${item.createdAt}`}
                >
                  <div
                    className={`auto-block-history-item-icon ${
                      item.enabled ? "history-enabled" : "history-disabled"
                    }`}
                  >
                    {item.enabled ? <FaCheckCircle /> : <FaBan />}
                  </div>

                  <div className="auto-block-history-item-info">
                    <h4>Protection {item.enabled ? "Enabled" : "Disabled"}</h4>

                    <p>
                      Auto Block preference was saved as{" "}
                      {item.enabled ? "ON" : "OFF"}.
                    </p>
                  </div>

                  <time className="auto-block-history-date">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "Date unavailable"}
                  </time>
                </div>
              ))}
            </div>
          )}

          <p className="auto-block-history-footnote">
            Showing up to 30 saved setting changes, newest first.
          </p>
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
