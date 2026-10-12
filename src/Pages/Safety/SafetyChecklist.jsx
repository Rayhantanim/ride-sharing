import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaChevronLeft,
  FaCheck,
  FaUserShield,
  FaCar,
  FaShareAlt,
  FaEye,
  FaLock,
  FaExclamationTriangle,
} from "react-icons/fa";

import "./SafetyChecklist.css";

const SAFETY_API = "http://localhost:5000/api/safety";

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id || user?._id || user?.userId || null;
  } catch {
    return null;
  }
};

const SafetyChecklist = () => {
  const navigate = useNavigate();

  const [checkedItems, setCheckedItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loadStatus, setLoadStatus] = useState("loading");
  const [saveStatus, setSaveStatus] = useState("idle");

  const checklistItems = [
    {
      id: 1,
      icon: <FaUserShield />,
      title: "Verify the driver",
      description:
        "Check the driver's name, photo, rating, and other details before starting your ride.",
    },
    {
      id: 2,
      icon: <FaCar />,
      title: "Check the vehicle",
      description:
        "Make sure the vehicle number and model match the ride information shown in the app.",
    },
    {
      id: 3,
      icon: <FaShareAlt />,
      title: "Share your trip",
      description:
        "Share your live trip details with a trusted family member or friend.",
    },
    {
      id: 4,
      icon: <FaEye />,
      title: "Stay aware",
      description:
        "Keep your phone accessible and stay aware of your surroundings throughout the ride.",
    },
    {
      id: 5,
      icon: <FaLock />,
      title: "Use the seat belt",
      description:
        "Always wear your seat belt and make sure it is properly secured before the ride begins.",
    },
    {
      id: 6,
      icon: <FaExclamationTriangle />,
      title: "Know the SOS option",
      description:
        "Know where the SOS button is and how to use it if you ever feel unsafe.",
    },
  ];

  // Load saved checklist from the backend
  useEffect(() => {
    let cancelled = false;

    const loadChecklist = async () => {
      const id = getUserId();

      if (!id) {
        setLoadStatus("no-user");
        return;
      }

      setUserId(id);

      try {
        const response = await fetch(`${SAFETY_API}/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Could not load your safety checklist.",
          );
        }

        const safety = data.safety || data.data || data;

        const savedItems = Array.isArray(safety.safetyChecklistItems)
          ? [
              ...new Set(
                safety.safetyChecklistItems
                  .map(Number)
                  .filter(
                    (itemId) =>
                      Number.isInteger(itemId) && itemId >= 1 && itemId <= 6,
                  ),
              ),
            ]
          : [];

        if (!cancelled) {
          setCheckedItems(savedItems);
          setLoadStatus("ready");
          setSaveStatus("saved");
        }
      } catch (error) {
        console.error("Load checklist error:", error);

        if (!cancelled) {
          setLoadStatus("error");
          setSaveStatus("error");
        }
      }
    };

    loadChecklist();

    return () => {
      cancelled = true;
    };
  }, []);

  // Save changed checklist progress to the backend
  useEffect(() => {
    if (loadStatus !== "ready" || !userId) {
      return;
    }

    const controller = new AbortController();

    // Wait briefly so rapid checkbox clicks are saved together
    const timeout = setTimeout(async () => {
      setSaveStatus("saving");

      try {
        const response = await fetch(`${SAFETY_API}/${userId}/settings`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            safetyChecklistItems: checkedItems,
            safetyChecklistCompleted: checkedItems.length === 6,
          }),
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not save checklist progress.");
        }

        if (!controller.signal.aborted) {
          setSaveStatus("saved");
        }
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Save checklist error:", error);

        if (!controller.signal.aborted) {
          setSaveStatus("error");
        }
      }
    }, 400);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [checkedItems, loadStatus, userId]);

  const handleCheck = (id) => {
    if (loadStatus === "loading" || loadStatus === "error") {
      return;
    }

    setCheckedItems((previous) => {
      if (previous.includes(id)) {
        return previous.filter((item) => item !== id);
      }

      return [...previous, id];
    });
  };

  const completedCount = checkedItems.length;
  const totalCount = checklistItems.length;

  const progress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const saveMessage =
    {
      loading: "Loading saved checklist...",
      "no-user": "Log in to save your checklist progress.",
      error: "Could not load or save progress. Please check your connection.",
      saving: "Saving your progress...",
      saved: "Progress saved",
      idle: "",
    }[loadStatus === "loading" ? "loading" : saveStatus] ||
    (loadStatus === "no-user" ? "Log in to save your checklist progress." : "");

  return (
    <div className="checklist-container">
      {/* HEADER */}
      <header className="checklist-header">
        <FaChevronLeft
          className="checklist-back-icon"
          onClick={() => navigate("/safety-preview")}
        />

        <h1>Safety Checklist</h1>
      </header>

      {/* INTRO BANNER */}
      <section className="checklist-banner">
        <div className="banner-icon">
          <FaUserShield />
        </div>

        <div className="banner-content">
          <span>RIDE SAFETY</span>

          <h2>Stay safe on every ride</h2>

          <p>
            Take a moment to complete these safety checks before or during your
            ride.
          </p>
        </div>
      </section>

      {/* PROGRESS */}
      <section className="progress-card">
        <div className="progress-top">
          <div>
            <h3>Safety progress</h3>

            <p>
              {completedCount} of {totalCount} safety checks completed
            </p>
          </div>

          <div className="progress-percentage">{progress}%</div>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <p
          role="status"
          aria-live="polite"
          style={{
            fontSize: "12px",
            marginTop: "10px",
            color: saveStatus === "error" ? "#dc2626" : "#777",
          }}
        >
          {loadStatus === "loading"
            ? "Loading saved checklist..."
            : loadStatus === "no-user"
              ? "Log in to save your checklist progress."
              : saveStatus === "saving"
                ? "Saving your progress..."
                : saveStatus === "saved"
                  ? "Progress saved"
                  : saveStatus === "error"
                    ? "Could not save progress. Please check your connection."
                    : ""}
        </p>
      </section>

      {/* CHECKLIST TITLE */}
      <div className="checklist-title-row">
        <div>
          <h2>Before & During Your Ride</h2>

          <p>Complete each step to make your ride safer.</p>
        </div>

        <div className="completed-badge">
          {completedCount}/{totalCount}
        </div>
      </div>

      {/* CHECKLIST ITEMS */}
      <section className="checklist-list">
        {checklistItems.map((item) => {
          const isChecked = checkedItems.includes(item.id);

          return (
            <div
              key={item.id}
              className={`checklist-item ${isChecked ? "completed" : ""}`}
              onClick={() => handleCheck(item.id)}
              role="checkbox"
              aria-checked={isChecked}
              tabIndex={loadStatus === "loading" ? -1 : 0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleCheck(item.id);
                }
              }}
              style={{
                cursor:
                  loadStatus === "loading" || loadStatus === "error"
                    ? "wait"
                    : "pointer",
              }}
            >
              <div className={`check-icon ${isChecked ? "checked" : ""}`}>
                {isChecked ? <FaCheck /> : item.icon}
              </div>

              <div className="checklist-item-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>

              <div
                className={`checkbox ${isChecked ? "checkbox-checked" : ""}`}
              >
                {isChecked && <FaCheck />}
              </div>
            </div>
          );
        })}
      </section>

      {/* COMPLETE STATE */}
      {completedCount === totalCount && (
        <section className="complete-card">
          <div className="complete-icon">
            <FaCheck />
          </div>

          <div>
            <h3>You're all set!</h3>

            <p>You have completed all the safety checks for your ride.</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default SafetyChecklist;
