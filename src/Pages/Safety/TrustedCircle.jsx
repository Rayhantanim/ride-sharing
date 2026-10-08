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

const TrustedCircle = () => {
  const navigate = useNavigate();

  const [autoShare, setAutoShare] = useState(true);
  const [contacts, setContacts] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const [shareStatus, setShareStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= GET LOGGED-IN USER ================= */

  const getUser = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("❌ Invalid user data:", error);
      return null;
    }
  };

  /* ================= LOAD SAFETY DATA ================= */

  const fetchSafetyData = async () => {
    try {
      setLoading(true);

      const user = getUser();

      if (!user?.id) {
        console.log("❌ No logged-in user.");
        setContacts([]);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/safety/${user.id}`,
      );

      const data = await response.json();

      console.log("📥 Safety data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load safety data.");
      }

      setContacts(data.trustedContacts || []);

      if (typeof data.autoShare === "boolean") {
        setAutoShare(data.autoShare);
      }
    } catch (error) {
      console.error("❌ Safety data error:", error);
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
      const user = getUser();

      if (!user?.id) {
        alert("Please login first.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/safety/${user.id}/trusted-circle/${contactId}/invite`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      console.log("📥 Invite response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to invite contact.");
      }

      setContacts(data.trustedContacts || []);

      alert("Invitation sent successfully.");
    } catch (error) {
      console.error("❌ Invite error:", error);

      alert(error.message || "Failed to invite contact.");
    }
  };

  /* ================= ADD CONTACT ================= */

  const handleAddContact = async (e) => {
    e.preventDefault();

    if (!newName.trim() || !newNumber.trim()) {
      alert("Please enter both name and phone number.");
      return;
    }

    try {
      setSaving(true);

      const user = getUser();

      if (!user?.id) {
        alert("Please login first.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/safety/${user.id}/trusted-circle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newName.trim(),
            phone: newNumber.trim(),
            relation: "Trusted Contact",
          }),
        },
      );

      const data = await response.json();

      console.log("📥 Add contact response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to add contact.");
      }

      setContacts(data.trustedContacts || []);

      setNewName("");
      setNewNumber("");
      setShowAddForm(false);

      alert("Trusted contact added successfully.");
    } catch (error) {
      console.error("❌ Add contact error:", error);

      alert(error.message || "Failed to add contact.");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE CONTACT ================= */

  const handleDeleteContact = async (contactId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this contact?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const user = getUser();

      if (!user?.id) {
        alert("Please login first.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/safety/${user.id}/trusted-circle/${contactId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      console.log("📥 Delete response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove contact.");
      }

      setContacts(data.trustedContacts || []);
    } catch (error) {
      console.error("❌ Delete contact error:", error);

      alert(error.message || "Failed to remove contact.");
    }
  };

  /* ================= AUTO SHARE ================= */

  const handleAutoShareToggle = async () => {
    const newValue = !autoShare;

    setAutoShare(newValue);

    try {
      const user = getUser();

      if (!user?.id) {
        alert("Please login first.");
        setAutoShare(!newValue);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/safety/${user.id}/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            autoShare: newValue,
          }),
        },
      );

      const data = await response.json();

      console.log("📥 Auto share response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to update auto share.");
      }

      setAutoShare(data.safety?.autoShare ?? newValue);
    } catch (error) {
      console.error("❌ Auto share error:", error);

      setAutoShare(!newValue);

      alert(error.message || "Failed to update auto share.");
    }
  };

  /* ================= SHARE LIVE TRIP ================= */

  const handleShareTrip = () => {
    setShareStatus(true);

    setTimeout(() => {
      setShareStatus(false);
    }, 3000);
  };

  return (
    <div className="trusted-page-wrapper">
      <div className="trusted-app-container">
        {/* ================= HEADER ================= */}

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

        {/* ================= INTRO ================= */}

        <section className="trusted-intro">
          <div className="trusted-main-icon">
            <FaUsers />
          </div>

          <h2>Share Your Live Trip</h2>

          <p>
            Keep your family and friends connected
            <br />
            with your live trip location.
          </p>
        </section>

        {/* ================= CONTACT SECTION ================= */}

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

        {/* ================= AUTO SHARE ================= */}

        <section className="trusted-auto-share">
          <div className="trusted-auto-left">
            <div className="trusted-auto-icon">
              <FaShareAlt />
            </div>

            <div>
              <h3>Auto Share Your Trip</h3>

              <p>Automatically share your trip with trusted contacts.</p>
            </div>
          </div>

          <button
            type="button"
            className={`trusted-toggle ${autoShare ? "active" : ""}`}
            onClick={handleAutoShareToggle}
            aria-label="Toggle auto share"
          >
            <span></span>
          </button>
        </section>

        {/* ================= SHARE STATUS ================= */}

        {shareStatus && (
          <div className="trusted-success-message">
            <FaCheckCircle />

            <span>Live trip has been shared with your trusted contacts.</span>
          </div>
        )}

        {/* ================= SHARE BUTTON ================= */}

        <button
          type="button"
          className="trusted-share-button"
          onClick={handleShareTrip}
        >
          <FaShareAlt />
          Share Live Trip
        </button>

        {/* ================= ADD CONTACT MODAL ================= */}

        {showAddForm && (
          <div className="trusted-modal-overlay">
            <div className="trusted-modal">
              <div className="trusted-modal-header">
                <h2>Add New Contact</h2>

                <button
                  type="button"
                  className="trusted-close-button"
                  onClick={() => setShowAddForm(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <form
                onSubmit={handleAddContact}
                className="trusted-contact-form"
              >
                <label>Contact Name</label>

                <input
                  type="text"
                  placeholder="Enter name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />

                <label>Phone Number</label>

                <input
                  type="tel"
                  placeholder="01xxxxxxxx"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
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
