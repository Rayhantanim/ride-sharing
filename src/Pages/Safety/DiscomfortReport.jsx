import React, { useState } from "react";
import "./DiscomfortReport.css";
import { FaChevronLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DiscomfortReport = () => {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = () => {
    if (!selectedOption) {
      alert("Please select an issue first.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="discomfort-page-wrapper">
      <div className="discomfort-app-container">
        {/* Header */}
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
            {/* Top Info Box */}
            <section className="discomfort-info-box">
              <h2>We take your report seriously.</h2>

              <p>
                Your report helps us improve safety
                <br />
                for everyone.
              </p>
            </section>

            {/* Question */}
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
                    onClick={() => setSelectedOption(option.id)}
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

            {/* Additional Details */}
            <section className="discomfort-textarea-section">
              <h2 className="discomfort-section-title">
                Additional details
                <span>Optional</span>
              </h2>

              <textarea
                className="discomfort-textarea"
                placeholder="Tell us what happened..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </section>

            {/* Submit */}
            <button
              type="button"
              className={`discomfort-submit-button ${
                !selectedOption ? "disabled" : ""
              }`}
              onClick={handleSubmit}
            >
              Submit Report
            </button>
          </>
        ) : (
          /* Success State */
          <section className="discomfort-success-section">
            <div className="discomfort-success-icon">
              <FaCheckCircle />
            </div>

            <h2>Report Submitted</h2>

            <p>
              Thank you for letting us know.
              <br />
              Your report has been received and our team
              <br />
              will review it carefully.
            </p>

            <button
              type="button"
              className="discomfort-back-safety-button"
              onClick={() => navigate("/safety-preview")}
            >
              Back to Safety
            </button>
          </section>
        )}
      </div>
    </div>
  );
};

export default DiscomfortReport;
