import React, { useState } from "react";
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

  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "MOM",
      number: "01xxxxxxxx",
      invited: false,
    },
    {
      id: 2,
      name: "Dad",
      number: "01xxxxxxxx",
      invited: false,
    },
    {
      id: 3,
      name: "Mumu",
      number: "01xxxxxxxx",
      invited: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const [shareStatus, setShareStatus] = useState(false);

  // Invite contact
  const handleInvite = (id) => {
    setContacts((previousContacts) =>
      previousContacts.map((contact) =>
        contact.id === id ? { ...contact, invited: true } : contact,
      ),
    );
  };

  // Add new contact
  const handleAddContact = (e) => {
    e.preventDefault();

    if (!newName.trim() || !newNumber.trim()) {
      return;
    }

    const newContact = {
      id: Date.now(),
      name: newName.trim(),
      number: newNumber.trim(),
      invited: false,
    };

    setContacts((previousContacts) => [...previousContacts, newContact]);

    setNewName("");
    setNewNumber("");
    setShowAddForm(false);
  };

  // Share live trip
  const handleShareTrip = () => {
    setShareStatus(true);

    setTimeout(() => {
      setShareStatus(false);
    }, 3000);
  };

  return (
    <div className="trusted-page-wrapper">
      <div className="trusted-app-container">
        {/* =========================
            HEADER
        ========================= */}

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

        {/* =========================
            INTRO
        ========================= */}

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

        {/* =========================
            CONTACT SECTION
        ========================= */}

        <section className="trusted-section">
          <div className="trusted-section-heading">
            <div>
              <h2>Your Trusted Contacts</h2>

              <p>People you can share your trip with</p>
            </div>

            <span className="contact-count">{contacts.length} Contacts</span>
          </div>

          {/* Contact List */}

          <div className="trusted-contact-list">
            {contacts.map((contact) => (
              <div className="trusted-contact-card" key={contact.id}>
                <div className="trusted-contact-left">
                  <div className="trusted-contact-avatar">
                    <FaUser />
                  </div>

                  <div className="trusted-contact-info">
                    <h3>{contact.name}</h3>

                    <p>{contact.number}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className={`trusted-invite-button ${
                    contact.invited ? "invited" : ""
                  }`}
                  onClick={() => handleInvite(contact.id)}
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
              </div>
            ))}
          </div>

          {/* Add Contact */}

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

        {/* =========================
            AUTO SHARE
        ========================= */}

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
            onClick={() => setAutoShare(!autoShare)}
            aria-label="Toggle auto share"
          >
            <span></span>
          </button>
        </section>

        {/* =========================
            SHARE STATUS
        ========================= */}

        {shareStatus && (
          <div className="trusted-success-message">
            <FaCheckCircle />

            <span>Live trip has been shared with your trusted contacts.</span>
          </div>
        )}

        {/* =========================
            SHARE BUTTON
        ========================= */}

        <button
          type="button"
          className="trusted-share-button"
          onClick={handleShareTrip}
        >
          <FaShareAlt />
          Share Live Trip
        </button>

        {/* =========================
            ADD CONTACT MODAL
        ========================= */}

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

                <button type="submit" className="trusted-add-button">
                  Add Contact
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
