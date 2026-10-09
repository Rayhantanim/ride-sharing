import React, { useEffect, useState } from "react";
import "./TrustedCircle.css";

import {
  FaChevronLeft,
  FaUser,
  FaUsers,
  FaPlus,
  FaShareAlt,
  FaChevronRight,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const SAFETY_API = "http://localhost:5000/api/safety";

const TrustedCircle = () => {
  const navigate = useNavigate();

  const [autoShare, setAutoShare] = useState(true);
  const [contacts, setContacts] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const [shareStatus, setShareStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingAutoShare, setSavingAutoShare] = useState(false);
  const [sharingTrip, setSharingTrip] = useState(false);

  /* ================= GET LOGGED-IN USER ================= */

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (error) {
      console.error("Invalid user data:", error);
      return null;
    }
  };

  const getUserId = () => {
    const user = getUser();
    return user?.id || user?._id || user?.userId || null;
  };

  /* ================= LOAD SAFETY DATA ================= */

  const fetchSafetyData = async () => {
    try {
      setLoading(true);

      const userId = getUserId();

      if (!userId) {
        setContacts([]);
        setShareStatus("Please log in to use Trusted Circle.");
        return;
      }

      const response = await fetch(`${SAFETY_API}/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load safety data.");
      }

      const safety = data.safety || data.data || data;

      setContacts(safety.trustedContacts || []);

      if (typeof safety.autoShare === "boolean") {
        setAutoShare(safety.autoShare);
      }
    } catch (error) {
      console.error("Safety data error:", error);
      setShareStatus(error.message || "Failed to load trusted contacts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSafetyData();
  }, []);

  /* ================= INVITE CONTACT ================= */

  const handleInvite = async (contactId) => {
    try {
      const userId = getUserId();

      if (!userId) {
        window.alert("Please log in first.");
        return;
      }

      const response = await fetch(
        `${SAFETY_API}/${userId}/trusted-circle/${contactId}/invite`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update invitation status.");
      }

      setContacts(data.trustedContacts || []);

      window.alert(
        "Contact marked as invited. No SMS or invitation message was sent automatically.",
      );
    } catch (error) {
      console.error("Invite error:", error);
      window.alert(error.message || "Failed to update invitation status.");
    }
  };

  /* ================= ADD CONTACT ================= */

  const handleAddContact = async (e) => {
    e.preventDefault();

    if (!newName.trim() || !newNumber.trim()) {
      window.alert("Please enter both name and phone number.");
      return;
    }

    const userId = getUserId();

    if (!userId) {
      window.alert("Please log in first.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${SAFETY_API}/${userId}/trusted-circle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName.trim(),
          phone: newNumber.trim(),
          relation: "Trusted Contact",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add contact.");
      }

      setContacts(data.trustedContacts || []);
      setNewName("");
      setNewNumber("");
      setShowAddForm(false);

      window.alert("Trusted contact added successfully.");
    } catch (error) {
      console.error("Add contact error:", error);
      window.alert(error.message || "Failed to add contact.");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE CONTACT ================= */

  const handleDeleteContact = async (contactId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this contact?",
    );

    if (!confirmDelete) return;

    const userId = getUserId();

    if (!userId) {
      window.alert("Please log in first.");
      return;
    }

    try {
      const response = await fetch(
        `${SAFETY_API}/${userId}/trusted-circle/${contactId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove contact.");
      }

      setContacts(data.trustedContacts || []);
    } catch (error) {
      console.error("Delete contact error:", error);
      window.alert(error.message || "Failed to remove contact.");
    }
  };

  /* ================= AUTO SHARE SETTING ================= */

  const handleAutoShareToggle = async () => {
    if (savingAutoShare) return;

    const userId = getUserId();

    if (!userId) {
      window.alert("Please log in first.");
      return;
    }

    const previousValue = autoShare;
    const nextValue = !previousValue;

    setSavingAutoShare(true);
    setShareStatus("");

    try {
      const response = await fetch(`${SAFETY_API}/${userId}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          autoShare: nextValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update Auto Share.");
      }

      const savedSafety = data.safety || data.data?.safety;

      setAutoShare(
        typeof savedSafety?.autoShare === "boolean"
          ? savedSafety.autoShare
          : nextValue,
      );
    } catch (error) {
      console.error("Auto Share error:", error);
      setAutoShare(previousValue);
      window.alert(error.message || "Failed to update Auto Share.");
    } finally {
      setSavingAutoShare(false);
    }
  };

  /* ================= GET CURRENT LOCATION ================= */

  const getCurrentLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Location is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      });
    });

  /* ================= SHARE CURRENT LOCATION ================= */

  const handleShareTrip = async () => {
    setShareStatus("");

    if (!getUserId()) {
      setShareStatus("Please log in to share your location.");
      return;
    }

    if (contacts.length === 0) {
      setShareStatus(
        "Please add at least one trusted contact before sharing your location.",
      );
      return;
    }

    if (!navigator.geolocation) {
      setShareStatus("Your browser does not support location sharing.");
      return;
    }

    setSharingTrip(true);

    try {
      setShareStatus("Requesting your current location...");

      const position = await getCurrentLocation();

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      const sharedAt = new Date().toLocaleString();

      const message =
        `I'm sharing my current location for safety.\n` +
        `Map: ${mapUrl}\n` +
        `Shared at: ${sharedAt}`;

      if (typeof navigator.share === "function") {
        try {
          await navigator.share({
            title: "My current location - ZyGo",
            text: `I'm sharing my current location for safety. Shared at: ${sharedAt}`,
            url: mapUrl,
          });

          setShareStatus(
            "Share dialog completed. Please verify in your selected app that the location was sent to your trusted contact.",
          );

          return;
        } catch (shareError) {
          if (shareError.name === "AbortError") {
            setShareStatus("Location sharing was cancelled.");
            return;
          }

          console.warn(
            "Device sharing unavailable; trying copy fallback.",
            shareError,
          );
        }
      }

      // Fallback for browsers without the native share dialog.
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(message);

        setShareStatus(
          "Location link copied. Open your messaging app and send it to your trusted contacts.",
        );
      } else {
        window.prompt(
          "Copy this location message and send it to your trusted contacts:",
          message,
        );

        setShareStatus(
          "Use the location message above to share your current location.",
        );
      }
    } catch (error) {
      console.error("Share location error:", error);

      let message = "Could not get your location. Please try again.";

      if (error.code === 1) {
        message =
          "Location permission was denied. Allow location access in your browser settings and try again.";
      } else if (error.code === 2) {
        message =
          "Your current location could not be determined. Please try again.";
      } else if (error.code === 3) {
        message = "Location request timed out. Please try again.";
      } else if (error.message) {
        message = error.message;
      }

      setShareStatus(message);
    } finally {
      setSharingTrip(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="trusted-page-wrapper">
      <div className="trusted-app-container">
        {/* HEADER */}

        <header className="trusted-header">
          <button
            type="button"
            className="trusted-back-button"
            onClick={() => navigate("/safety-preview")}
            aria-label="Go back"
          >
            <FaChevronLeft />
          </button>

          <h1>Trusted Circle</h1>
        </header>

        {/* INTRO */}

        <section className="trusted-intro">
          <div className="trusted-main-icon">
            <FaUsers />
          </div>

          <h2>Share Your Live Trip</h2>

          <p>
            Keep your family and friends connected
            <br />
            with your trip location.
          </p>
        </section>

        {/* CONTACT SECTION */}

        <section className="trusted-section">
          <div className="trusted-section-heading">
            <div>
              <h2>Your Trusted Contacts</h2>
              <p>People you can share your trip with</p>
            </div>

            <span className="contact-count">{contacts.length} Contacts</span>
          </div>

          {/* CONTACT LIST */}

          {loading ? (
            <div className="trusted-empty-state">
              Loading trusted contacts...
            </div>
          ) : contacts.length === 0 ? (
            <div className="trusted-empty-state">
              No trusted contacts added yet.
            </div>
          ) : (
            <div className="trusted-contact-list">
              {contacts.map((contact) => (
                <div className="trusted-contact-card" key={contact._id}>
                  <div className="trusted-contact-left">
                    <div className="trusted-contact-avatar">
                      <FaUser />
                    </div>

                    <div className="trusted-contact-info">
                      <h3>{contact.name}</h3>
                      <p>{contact.phone || contact.number}</p>
                    </div>
                  </div>

                  <div className="trusted-contact-actions">
                    <button
                      type="button"
                      className={`trusted-invite-button ${
                        contact.invited ? "invited" : ""
                      }`}
                      onClick={() => handleInvite(contact._id)}
                      disabled={contact.invited}
                    >
                      {contact.invited ? (
                        <>
                          <FaCheckCircle />
                          Invited
                        </>
                      ) : (
                        "Invite"
                      )}
                    </button>

                    <button
                      type="button"
                      className="trusted-remove-button"
                      onClick={() => handleDeleteContact(contact._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ADD CONTACT */}

          <button
            type="button"
            className="trusted-add-contact"
            onClick={() => setShowAddForm(true)}
          >
            <div className="trusted-add-left">
              <div className="trusted-add-icon">
                <FaPlus />
              </div>

              <div>
                <h3>ADD NEW CONTACT</h3>
                <p>Invite more people</p>
              </div>
            </div>

            <FaChevronRight />
          </button>
        </section>

        {/* AUTO SHARE */}

        <section className="trusted-auto-share">
          <div className="trusted-auto-left">
            <div className="trusted-auto-icon">
              <FaShareAlt />
            </div>

            <div>
              <h3>Auto Share Your Trip</h3>
              <p>Save your preference for trip sharing.</p>
            </div>
          </div>

          <button
            type="button"
            className={`trusted-toggle ${autoShare ? "active" : ""}`}
            onClick={handleAutoShareToggle}
            disabled={savingAutoShare}
            aria-label="Toggle auto share"
            aria-checked={autoShare}
            role="switch"
            style={{
              opacity: savingAutoShare ? 0.6 : 1,
              cursor: savingAutoShare ? "wait" : "pointer",
            }}
          >
            <span></span>
          </button>
        </section>

        {/* SHARE STATUS */}

        {shareStatus && (
          <div
            className="trusted-success-message"
            role="status"
            aria-live="polite"
          >
            <FaCheckCircle />
            <span>{shareStatus}</span>
          </div>
        )}

        {/* SHARE CURRENT LOCATION */}

        <button
          type="button"
          className="trusted-share-button"
          onClick={handleShareTrip}
          disabled={loading || sharingTrip}
          style={{
            opacity: loading || sharingTrip ? 0.65 : 1,
            cursor: loading || sharingTrip ? "wait" : "pointer",
          }}
        >
          <FaShareAlt />
          {sharingTrip ? "Getting Location..." : "Share Live Trip"}
        </button>

        {/* ADD CONTACT MODAL */}

        {showAddForm && (
          <div
            className="trusted-modal-overlay"
            onClick={(event) => {
              if (event.target === event.currentTarget && !saving) {
                setShowAddForm(false);
              }
            }}
          >
            <div className="trusted-modal">
              <div className="trusted-modal-header">
                <h2>Add New Contact</h2>

                <button
                  type="button"
                  className="trusted-close-button"
                  onClick={() => setShowAddForm(false)}
                  disabled={saving}
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>

              <form
                onSubmit={handleAddContact}
                className="trusted-contact-form"
              >
                <label htmlFor="trusted-contact-name">Contact Name</label>

                <input
                  id="trusted-contact-name"
                  type="text"
                  placeholder="Enter name"
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  required
                />

                <label htmlFor="trusted-contact-phone">Phone Number</label>

                <input
                  id="trusted-contact-phone"
                  type="tel"
                  placeholder="01xxxxxxxx"
                  value={newNumber}
                  onChange={(event) => setNewNumber(event.target.value)}
                  required
                />

                <button
                  type="submit"
                  className="trusted-add-button"
                  disabled={saving}
                >
                  {saving ? "Adding..." : "Add Contact"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrustedCircle;
