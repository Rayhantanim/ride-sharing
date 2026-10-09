import React, { useEffect, useState } from "react";
import "./DiscomfortReport.css";
import { FaChevronLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/safety";

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id || user?._id || user?.userId || null;
  } catch {
    return null;
  }
};

const options = [
  {
    id: "behavior",
    title: "Driver behavior",
    subtitle: "Unprofessional or rude behavior",
  },
  {
    id: "unsafe",
    title: "Unsafe Driving",
    subtitle: "Speeding, overtaking or rash driving",
  },
  {
    id: "route",
    title: "Wrong Route",
    subtitle: "Driver took a wrong or long route",
  },
  {
    id: "other",
    title: "Other issue",
    subtitle: "Something else happened",
  },
];

const DiscomfortReport = () => {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [reports, setReports] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [submittedReport, setSubmittedReport] = useState(null);

  // ================= LOAD REPORT HISTORY =================

  const loadReports = async () => {
    const userId = getUserId();

    if (!userId) {
      setHistoryError("Log in to view your report history.");
      setHistoryLoading(false);
      return;
    }

    try {
      setHistoryLoading(true);
      setHistoryError("");

      const response = await fetch(`${API_URL}/${userId}/events`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load report history.");
      }

      if (!Array.isArray(data)) {
        throw new Error("Unexpected report history response.");
      }

      const discomfortReports = data.filter(
        (event) => event.type === "discomfort-report",
      );

      setReports(discomfortReports);
    } catch (error) {
      console.error("Report history error:", error);
      setHistoryError(error.message || "Could not load reports.");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // ================= SUBMIT REPORT =================

  const handleSubmit = async () => {
    if (!selectedOption) {
      setSubmitError("Please select an issue first.");
      return;
    }

    const userId = getUserId();

    if (!userId) {
      setSubmitError("Please log in before submitting a report.");
      return;
    }

    const selectedIssue = options.find(
      (option) => option.id === selectedOption,
    );

    if (!selectedIssue) {
      setSubmitError("Please select a valid issue.");
      return;
    }

    const message = [
      `Issue: ${selectedIssue.title}`,
      `Category: ${selectedIssue.id}`,
      details.trim() ? `Additional details: ${details.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      setSubmitting(true);
      setSubmitError("");

      const response = await fetch(`${API_URL}/${userId}/discomfort-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit your report.");
      }

      // Save confirmation details for the visible success screen.
      const savedEvents = data.safety?.events || [];

      const savedReport = [...savedEvents]
        .reverse()
        .find(
          (event) =>
            event.type === "discomfort-report" && event.message === message,
        );

      setSubmittedReport(
        savedReport || {
          message,
          createdAt: new Date().toISOString(),
        },
      );

      setSubmitted(true);

      // Refresh history separately. A history-loading error should
      // not undo a report the backend has already accepted.
      await loadReports();
    } catch (error) {
      console.error("Discomfort report error:", error);
      setSubmitError(
        error.message || "Could not submit your report. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date unavailable";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString();
  };

  const getReportTitle = (message = "") => {
    const match = message.match(/^Issue:\s*(.+)$/m);
    return match ? match[1] : "Discomfort Report";
  };

  return (
    <div className="discomfort-page-wrapper">
      <div className="discomfort-app-container">
        {/* HEADER */}
        <header className="discomfort-header">
          <button
            type="button"
            className="discomfort-back-button"
            onClick={() => navigate("/safety-preview")}
            aria-label="Go back"
          >
            <FaChevronLeft />
          </button>

          <h1>Discomfort Report</h1>
        </header>

        {!submitted ? (
          <>
            {/* INTRO */}
            <section className="discomfort-info-box">
              <h2>We take your report seriously.</h2>
              <p>
                Your report helps us improve safety
                <br />
                for everyone.
              </p>
            </section>

            {/* ISSUE SELECTION */}
            <section className="discomfort-form-section">
              <h2 className="discomfort-section-title">What happened?</h2>

              <div className="discomfort-options-wrapper">
                {options.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    className={`discomfort-radio-card ${
                      selectedOption === option.id ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedOption(option.id);
                      setSubmitError("");
                    }}
                    disabled={submitting}
                    aria-pressed={selectedOption === option.id}
                  >
                    <div className="discomfort-radio-circle">
                      <div className="discomfort-radio-inner"></div>
                    </div>

                    <div className="discomfort-radio-content">
                      <h3>{option.title}</h3>
                      <p>{option.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* ADDITIONAL DETAILS */}
            <section className="discomfort-textarea-section">
              <h2 className="discomfort-section-title">
                Additional details
                <span>Optional</span>
              </h2>

              <textarea
                className="discomfort-textarea"
                placeholder="Tell us what happened..."
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                maxLength={2000}
                disabled={submitting}
              />
            </section>

            {submitError && (
              <div
                role="alert"
                style={{
                  marginTop: "14px",
                  padding: "12px",
                  borderRadius: "10px",
                  color: "#b91c1c",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                }}
              >
                {submitError}
              </div>
            )}

            <button
              type="button"
              className={`discomfort-submit-button ${
                !selectedOption || submitting ? "disabled" : ""
              }`}
              onClick={handleSubmit}
              disabled={!selectedOption || submitting}
            >
              {submitting ? "Submitting Report..." : "Submit Report"}
            </button>
          </>
        ) : (
          /* VISIBLE SUCCESS CONFIRMATION */
          <section className="discomfort-success-section" aria-live="polite">
            <div className="discomfort-success-icon">
              <FaCheckCircle />
            </div>

            <h2>Report Submitted</h2>

            <p>
              Your report was saved successfully.
              <br />
              You can review its details below.
            </p>

            {submittedReport && (
              <div
                style={{
                  marginTop: "22px",
                  padding: "18px",
                  textAlign: "left",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "14px",
                }}
              >
                <p style={{ fontWeight: 700, marginBottom: "8px" }}>
                  {getReportTitle(submittedReport.message)}
                </p>

                <p style={{ fontSize: "13px", color: "#64748b" }}>
                  Saved: {formatDate(submittedReport.createdAt)}
                </p>

                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                    fontFamily: "inherit",
                    fontSize: "14px",
                    marginTop: "12px",
                  }}
                >
                  {submittedReport.message}
                </pre>
              </div>
            )}

            <button
              type="button"
              className="discomfort-back-safety-button"
              onClick={() => navigate("/safety-preview")}
              style={{ marginTop: "20px" }}
            >
              Back to Safety
            </button>

            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setSelectedOption("");
                setDetails("");
                setSubmitError("");
              }}
              style={{
                marginTop: "12px",
                padding: "10px 16px",
                background: "transparent",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Submit Another Report
            </button>
          </section>
        )}

        {/* VISIBLE REPORT HISTORY */}
        <section
          style={{
            marginTop: "30px",
            paddingTop: "22px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
                My Report History
              </h2>
              <p
                style={{ fontSize: "13px", color: "#64748b", marginTop: "5px" }}
              >
                Your previously submitted discomfort reports
              </p>
            </div>

            <button
              type="button"
              onClick={loadReports}
              disabled={historyLoading}
              style={{
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "9px",
                background: "#fff",
                cursor: historyLoading ? "wait" : "pointer",
              }}
            >
              Refresh
            </button>
          </div>

          {historyLoading ? (
            <p style={{ color: "#64748b", padding: "14px 0" }}>
              Loading your reports...
            </p>
          ) : historyError ? (
            <div
              role="alert"
              style={{
                padding: "14px",
                borderRadius: "10px",
                background: "#fef2f2",
                color: "#b91c1c",
              }}
            >
              {historyError}
            </div>
          ) : reports.length === 0 ? (
            <div
              style={{
                padding: "24px 16px",
                textAlign: "center",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
              }}
            >
              <p style={{ fontWeight: 600 }}>No reports yet</p>
              <p
                style={{ color: "#64748b", fontSize: "13px", marginTop: "6px" }}
              >
                Your submitted reports will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {reports.map((report) => (
                <article
                  key={report._id}
                  style={{
                    padding: "16px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    background: "#fff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <h3 style={{ fontWeight: 700 }}>
                      {getReportTitle(report.message)}
                    </h3>

                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#166534",
                        background: "#dcfce7",
                        padding: "5px 9px",
                        borderRadius: "20px",
                      }}
                    >
                      Saved
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "7px",
                    }}
                  >
                    {formatDate(report.createdAt)}
                  </p>

                  <p
                    style={{
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                      fontSize: "14px",
                      marginTop: "10px",
                      color: "#475569",
                    }}
                  >
                    {report.message}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DiscomfortReport;
