import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EmergencyRideSwitch.css";

const API_URL = "http://localhost:5000/api/safety";
const TIMER_DURATION = 30;
const CIRCUMFERENCE = 2 * Math.PI * 25;

// Find the logged-in user's ID from common localStorage formats.
function getLoggedInUserId() {
  const directId =
    localStorage.getItem("userId") || localStorage.getItem("userID");

  if (directId) return directId;

  const possibleKeys = ["user", "currentUser", "userData", "userInfo"];

  for (const key of possibleKeys) {
    const rawValue = localStorage.getItem(key);

    if (!rawValue) continue;

    try {
      const user = JSON.parse(rawValue);
      const id = user?._id || user?.id || user?.userId;

      if (id) return String(id);
    } catch {
      // This storage item was not JSON, so check the next one.
    }
  }

  return null;
}

export default function EmergencyRideSwitch() {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const requestIdRef = useRef("");

  const [requested, setRequested] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [seconds, setSeconds] = useState(TIMER_DURATION);
  const [requestId, setRequestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Clean up the countdown if the user leaves the page.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startCountdown = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setSeconds(TIMER_DURATION);

    timerRef.current = setInterval(() => {
      setSeconds((previousSeconds) => {
        if (previousSeconds <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }

        return previousSeconds - 1;
      });
    }, 1000);
  };

  // Send a new request to the backend.
  const handleRequestDriver = async () => {
    const userId = getLoggedInUserId();

    if (!userId) {
      setErrorMessage(
        "User ID was not found. Please check how your login page saves the user ID.",
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(userId)}/emergency-ride-switch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "request",
          }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Could not submit the new-driver request.",
        );
      }

      if (!data.requestId) {
        throw new Error(
          "The server did not return a request ID. Please check your backend route.",
        );
      }

      requestIdRef.current = String(data.requestId);
      setRequestId(String(data.requestId));
      setRequested(true);
      setCancelled(false);
      setStatusMessage(data.message || "Your request has been recorded.");

      startCountdown();
    } catch (error) {
      setErrorMessage(error.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  // Cancel the request while the 30-second window is open.
  const handleCancel = async () => {
    const userId = getLoggedInUserId();
    const currentRequestId = requestIdRef.current;

    if (!userId || !currentRequestId) {
      setErrorMessage(
        "Request information is missing. Please submit a new request.",
      );
      return;
    }

    if (seconds <= 0) {
      setErrorMessage("The 30-second cancellation window has ended.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(userId)}/emergency-ride-switch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "cancel",
            requestId: currentRequestId,
          }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not cancel the request.");
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setCancelled(true);
      setRequested(false);
      setSeconds(0);
      setStatusMessage(data.message || "Your cancellation has been recorded.");

      requestIdRef.current = "";
      setRequestId("");
    } catch (error) {
      setErrorMessage(error.message || "Could not cancel the request.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setRequested(false);
    setCancelled(false);
    setSeconds(TIMER_DURATION);
    setRequestId("");
    requestIdRef.current = "";
    setStatusMessage("");
    setErrorMessage("");
  };

  const progressOffset = CIRCUMFERENCE * (1 - seconds / TIMER_DURATION);

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
            <span className="back-icon">←</span>
          </button>

          <h1 className="header-title">Emergency Ride Switch</h1>
        </header>

        {/* Car and route illustration */}
        <div className="illustration-container" aria-hidden="true">
          <div className="map-pin left">
            <span style={{ fontSize: 38 }}>📍</span>
          </div>

          <div className="map-pin right">
            <span style={{ fontSize: 38 }}>📍</span>
          </div>

          <div className="dashed-path-left"></div>
          <div className="dashed-path-right"></div>
          <div className="cloud-background"></div>

          <div className="car-wrapper">
            <div className="car-roof"></div>
            <div className="car-window"></div>

            <div className="car-body">
              <div className="car-headlight"></div>
            </div>

            <div className="wheel-front"></div>
            <div className="wheel-back"></div>
          </div>
        </div>

        {/* Main text */}
        <h2 className="main-text">
          Get a new Driver if you feel unsafe or uncomfortable
        </h2>

        {/* Request button */}
        {!requested && !cancelled && (
          <button
            type="button"
            className="primary-button"
            onClick={handleRequestDriver}
            disabled={loading}
          >
            {loading ? "Please wait..." : "Request New Driver"}
          </button>
        )}

        {/* Cancel button */}
        {requested && (
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
            disabled={loading || seconds <= 0}
          >
            {loading
              ? "Please wait..."
              : seconds > 0
                ? `Cancel Request (${seconds}s)`
                : "Cancellation Window Closed"}
          </button>
        )}

        {/* Circular countdown timer */}
        {requested && (
          <div className="timer-container">
            <p className="timer-text">
              {seconds > 0
                ? "Your request has been recorded. You can cancel within 30 seconds."
                : "The cancellation window has ended."}
            </p>

            <div className="timer-circle-wrapper">
              <svg className="timer-svg" viewBox="0 0 60 60" aria-hidden="true">
                <circle className="timer-circle-bg" cx="30" cy="30" r="25" />

                <circle
                  className="timer-circle-progress"
                  cx="30"
                  cy="30"
                  r="25"
                  style={{
                    strokeDasharray: CIRCUMFERENCE,
                    strokeDashoffset: progressOffset,
                  }}
                />
              </svg>

              <span className="timer-seconds">{seconds}</span>
            </div>
          </div>
        )}

        {/* Request status */}
        {requested && (
          <div
            className={`request-status ${seconds > 0 ? "pending" : "expired"}`}
            role="status"
          >
            <h3>
              {seconds > 0 ? "✓ Request Pending" : "Cancellation Window Closed"}
            </h3>

            <p>
              {seconds > 0
                ? statusMessage
                : "Your request was recorded, but a replacement driver has not been confirmed."}
            </p>

            {requestId && <p className="request-id">Request ID: {requestId}</p>}
          </div>
        )}

        {/* Cancellation confirmation */}
        {cancelled && (
          <div className="request-status cancelled" role="status">
            <h3>✓ Request Cancelled</h3>
            <p>{statusMessage}</p>

            <button
              type="button"
              className="secondary-button"
              onClick={handleReset}
            >
              Make Another Request
            </button>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="request-error" role="alert">
            {errorMessage}
          </div>
        )}

        <p className="footer-note">
          This feature records your request. It does not automatically assign or
          confirm a replacement driver.
        </p>
      </div>
    </div>
  );
}
