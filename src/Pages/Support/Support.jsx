import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?._id || user?.id || null;
  } catch {
    return null;
  }
};

/* Icons */

const BackIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1D1D1D"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9CA3AF"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const ContactSupportIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1D1D1D"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6l-4 4v-4H6a2 2 0 0 1-2-2z" />
    <path d="M9 9h.01M12 9h.01M15 9h.01" strokeWidth="2.5" />
  </svg>
);

const ReportDriverIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1D1D1D"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 21V4" />
    <path d="M4 4h13l-2 4 2 4H4" />
  </svg>
);

const LostFoundIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1D1D1D"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 8V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2" />
    <rect x="3" y="8" width="18" height="13" rx="2" />
    <path d="M3 13h18" />
  </svg>
);

const RefundIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1D1D1D"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="6" width="18" height="13" rx="2" />
    <path d="M3 10h18" />
    <path d="M7 15h4" />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1D1D1D"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 6l6 6-6 6" />
  </svg>
);

/* Quick Action */

const QuickAction = ({ icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-3 bg-white border border-[#E5E7EB] rounded-2xl py-6 px-4 hover:border-[#8EB800] hover:shadow-md transition min-h-[140px]"
  >
    {icon}
    <span className="text-[14px] font-medium text-[#1D1D1D] text-center leading-tight">
      {label}
    </span>
  </button>
);

/* Complaint Row */

const ComplaintRow = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center justify-between py-5 px-2 hover:bg-[#F9FAFB] rounded-lg transition text-left"
  >
    <span className="text-[15px] text-[#1D1D1D]">{label}</span>
    <ChevronRight />
  </button>
);

/* Request Card */

const RequestCard = ({ request, onClick }) => {
  const statusColors = {
    Received: "text-[#8EB800]",
    "In Process": "text-[#F59E0B]",
    Resolved: "text-[#16A34A]",
  };

  const date = request.createdAt
    ? new Date(request.createdAt).toLocaleString()
    : "Date unavailable";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 py-5 text-left hover:bg-[#F9FAFB] rounded-lg transition px-2"
    >
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[15px] font-semibold text-[#1D1D1D] break-words">
          {request.subject || request.type}
        </span>
        <span className="text-[13px] text-[#9CA3AF]">
          #{String(request._id || "").slice(-6)} · {date}
        </span>
      </div>

      <span
        className={`text-[13px] font-semibold shrink-0 ${statusColors[request.status] || "text-[#6B7280]"}`}
      >
        {request.status || "Received"}
      </span>
    </button>
  );
};

/* Main Component */

const Support = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [activeFormType, setActiveFormType] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [rideId, setRideId] = useState("");

  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");

  const [showAllActions, setShowAllActions] = useState(false);
  const [showAllComplaints, setShowAllComplaints] = useState(false);
  const [showAllRequests, setShowAllRequests] = useState(false);

  const quickActions = [
    { icon: <ContactSupportIcon />, label: "Contact Support" },
    { icon: <ReportDriverIcon />, label: "Report Driver" },
    { icon: <LostFoundIcon />, label: "Lost & Found" },
    { icon: <RefundIcon />, label: "Refund Request" },
  ];

  const complaints = [
    "Wrong fare charged",
    "Driver didn’t arrive on time",
    "Safety concern",
    "Lost items",
    "Poor vehicle condition",
  ];

  /* Load requests */

  const loadRequests = async () => {
    const userId = getUserId();

    if (!userId) {
      setRequests([]);
      setLoadingRequests(false);
      return;
    }

    try {
      setLoadingRequests(true);

      const response = await fetch(
        `${API_BASE}/api/support?userId=${encodeURIComponent(userId)}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load requests.");
      }

      setRequests(Array.isArray(data.requests) ? data.requests : []);
    } catch (error) {
      console.error("Loading support requests failed:", error);
      setNotice("Could not load requests. Check your backend connection.");
      setNoticeType("error");
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  /* Search filtering */

  const filteredActions = useMemo(
    () =>
      quickActions.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase().trim()),
      ),
    [searchQuery],
  );

  const filteredComplaints = useMemo(
    () =>
      complaints.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase().trim()),
      ),
    [searchQuery],
  );

  const filteredRequests = useMemo(
    () =>
      requests.filter((item) =>
        `${item.subject || ""} ${item.type || ""} ${item.status || ""}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim()),
      ),
    [requests, searchQuery],
  );

  /* Open form */

  const openForm = (type) => {
    setActiveFormType(type);
    setSubject(type);
    setDescription("");
    setRideId("");
    setNotice("");
  };

  const closeForm = () => {
    if (submitting) return;
    setActiveFormType(null);
  };

  /* Submit request */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userId = getUserId();

    if (!userId) {
      setNotice("Please log in first to submit a support request.");
      setNoticeType("error");
      return;
    }

    if (!subject.trim() || !description.trim()) {
      setNotice("Please fill in the subject and description.");
      setNoticeType("error");
      return;
    }

    try {
      setSubmitting(true);
      setNotice("");

      const response = await fetch(`${API_BASE}/api/support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          type: activeFormType,
          subject: subject.trim(),
          description: description.trim(),
          rideId: rideId.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not submit your request.");
      }

      setActiveFormType(null);
      setSubject("");
      setDescription("");
      setRideId("");

      setNotice(
        data.message || "Your support request was submitted successfully.",
      );
      setNoticeType("success");

      await loadRequests();
    } catch (error) {
      console.error("Support submission failed:", error);
      setNotice(error.message || "Something went wrong. Please try again.");
      setNoticeType("error");
    } finally {
      setSubmitting(false);
    }
  };

  /* Delete request */

  const handleDeleteRequest = async () => {
    if (!selectedRequest?._id || deleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this support request?",
    );

    if (!confirmed) return;

    const userId = getUserId();

    if (!userId) {
      setNotice("Please log in first.");
      setNoticeType("error");
      return;
    }

    try {
      setDeleting(true);
      setNotice("");

      const response = await fetch(
        `${API_BASE}/api/support/${selectedRequest._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete this request.");
      }

      setRequests((previous) =>
        previous.filter((request) => request._id !== selectedRequest._id),
      );

      setSelectedRequest(null);
      setNotice("Support request deleted successfully.");
      setNoticeType("success");
    } catch (error) {
      console.error("Delete support request failed:", error);
      setNotice(error.message || "Could not delete this request.");
      setNoticeType("error");
    } finally {
      setDeleting(false);
    }
  };

  /* Open support chatbot */

  const openSupportChat = () => {
    window.dispatchEvent(new Event("zygo:open-ai-chat"));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}

      <header className="w-full border-b border-[#F0F1F3]">
        <div className="max-w-[1400px] mx-auto px-8 py-6 flex items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Go back"
          >
            <BackIcon />
          </button>

          <h1 className="flex-1 text-center text-[26px] md:text-[28px] font-extrabold text-[#1D1D1D] tracking-tight">
            Help &amp; Support
          </h1>

          <div className="w-10" />
        </div>
      </header>

      {/* Search */}

      <div className="w-full max-w-[1400px] mx-auto px-8 pt-8">
        <div className="relative max-w-[640px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search for help"
            className="w-full pl-6 pr-14 py-4 bg-white border border-[#E5E7EB] rounded-2xl text-[15px] text-[#1D1D1D] placeholder:text-[#9CA3AF] outline-none focus:border-[#8EB800] focus:ring-2 focus:ring-[#E8F5C8] transition"
          />

          <span className="absolute right-5 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </span>
        </div>
      </div>

      {/* Notices */}

      {notice && (
        <div
          role="status"
          className={`mx-8 mt-5 px-4 py-3 rounded-xl text-sm ${
            noticeType === "error"
              ? "bg-red-50 text-red-700"
              : "bg-[#F3F9E7] text-[#4D6B00]"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              className="font-bold"
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main content */}

      <main className="w-full max-w-[1400px] mx-auto px-8 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column */}

          <section className="lg:col-span-7 flex flex-col gap-10">
            {/* Quick actions */}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px] font-extrabold text-[#1D1D1D] tracking-tight">
                  Quick Actions
                </h2>

                <button
                  type="button"
                  onClick={() => setShowAllActions(!showAllActions)}
                  className="text-[14px] font-medium text-[#6B7280] hover:text-[#8EB800] transition"
                >
                  {showAllActions ? "View Less" : "View All"}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(showAllActions
                  ? filteredActions
                  : filteredActions.slice(0, 4)
                ).map((action) => (
                  <QuickAction
                    key={action.label}
                    icon={action.icon}
                    label={action.label}
                    onClick={() => openForm(action.label)}
                  />
                ))}
              </div>

              {filteredActions.length === 0 && (
                <p className="text-sm text-gray-500 py-4">
                  No matching support options found.
                </p>
              )}
            </div>

            {/* Popular complaints */}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[22px] font-extrabold text-[#1D1D1D] tracking-tight">
                  Popular Complaints
                </h2>

                <button
                  type="button"
                  onClick={() => setShowAllComplaints(!showAllComplaints)}
                  className="text-[14px] font-medium text-[#6B7280] hover:text-[#8EB800] transition"
                >
                  {showAllComplaints ? "View Less" : "View All"}
                </button>
              </div>

              <div className="flex flex-col divide-y divide-[#F0F1F3]">
                {(showAllComplaints
                  ? filteredComplaints
                  : filteredComplaints.slice(0, 3)
                ).map((complaint) => (
                  <ComplaintRow
                    key={complaint}
                    label={complaint}
                    onClick={() => openForm(complaint)}
                  />
                ))}
              </div>

              {filteredComplaints.length === 0 && (
                <p className="text-sm text-gray-500 py-4">
                  No matching complaints found.
                </p>
              )}
            </div>
          </section>

          {/* Right column */}

          <section className="lg:col-span-5 flex flex-col gap-6">
            {/* Requests */}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[22px] font-extrabold text-[#1D1D1D] tracking-tight">
                  Requests
                </h2>

                <button
                  type="button"
                  onClick={() => setShowAllRequests(!showAllRequests)}
                  className="text-[14px] font-medium text-[#6B7280] hover:text-[#8EB800] transition"
                >
                  {showAllRequests ? "View Less" : "View All"}
                </button>
              </div>

              <div className="flex flex-col divide-y divide-[#F0F1F3]">
                {loadingRequests ? (
                  <p className="text-sm text-gray-500 py-5 px-2">
                    Loading your requests...
                  </p>
                ) : filteredRequests.length > 0 ? (
                  (showAllRequests
                    ? filteredRequests
                    : filteredRequests.slice(0, 2)
                  ).map((request) => (
                    <RequestCard
                      key={request._id}
                      request={request}
                      onClick={() => setSelectedRequest(request)}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-500 py-5 px-2">
                    {getUserId()
                      ? "No support requests yet. Submit a request to see it here."
                      : "Log in to view your support requests."}
                  </p>
                )}
              </div>
            </div>

            {/* Chat button */}

            <button
              type="button"
              onClick={openSupportChat}
              className="w-full bg-[#8EB800] hover:bg-[#7aa300] text-white font-semibold text-[16px] py-5 rounded-full shadow-md transition mt-4"
            >
              Chat With Support
            </button>
          </section>
        </div>
      </main>

      {/* Support form modal */}

      {activeFormType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="support-form-title"
            className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl p-6 md:p-8"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2
                  id="support-form-title"
                  className="text-xl font-extrabold text-[#1D1D1D]"
                >
                  {activeFormType}
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  Tell us what happened. Our support team can review your
                  request.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={submitting}
                className="text-2xl leading-none text-gray-500 hover:text-black disabled:opacity-50"
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="support-subject"
                  className="block text-sm font-semibold text-[#1D1D1D] mb-2"
                >
                  Subject *
                </label>

                <input
                  id="support-subject"
                  type="text"
                  maxLength={150}
                  required
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Enter the subject"
                  className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 outline-none focus:border-[#8EB800]"
                />
              </div>

              <div>
                <label
                  htmlFor="support-ride-id"
                  className="block text-sm font-semibold text-[#1D1D1D] mb-2"
                >
                  Ride ID (optional)
                </label>

                <input
                  id="support-ride-id"
                  type="text"
                  value={rideId}
                  onChange={(event) => setRideId(event.target.value)}
                  placeholder="Enter your ride ID if applicable"
                  className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 outline-none focus:border-[#8EB800]"
                />
              </div>

              <div>
                <label
                  htmlFor="support-description"
                  className="block text-sm font-semibold text-[#1D1D1D] mb-2"
                >
                  Description *
                </label>

                <textarea
                  id="support-description"
                  required
                  minLength={3}
                  maxLength={3000}
                  rows={5}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe your issue..."
                  className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 outline-none resize-y focus:border-[#8EB800]"
                />
              </div>

              {notice && (
                <p
                  className={`text-sm ${noticeType === "error" ? "text-red-600" : "text-[#4D6B00]"}`}
                >
                  {notice}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={submitting}
                  className="flex-1 border border-[#E5E7EB] rounded-full py-3 font-semibold text-[#1D1D1D] hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#8EB800] hover:bg-[#7aa300] text-white rounded-full py-3 font-semibold disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request details modal */}

      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting) {
              setSelectedRequest(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl p-6 md:p-8"
          >
            <div className="flex justify-between items-start gap-4">
              <h2 className="text-xl font-extrabold text-[#1D1D1D]">
                Request Details
              </h2>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                disabled={deleting}
                className="text-2xl leading-none text-gray-500 hover:text-black disabled:opacity-50"
                aria-label="Close details"
              >
                ×
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs text-gray-500">Request type</p>
                <p className="font-semibold text-[#1D1D1D]">
                  {selectedRequest.type}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Subject</p>
                <p className="font-semibold text-[#1D1D1D]">
                  {selectedRequest.subject}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-[#374151] whitespace-pre-wrap break-words">
                  {selectedRequest.description}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-semibold text-[#8EB800]">
                  {selectedRequest.status}
                </p>
              </div>

              {selectedRequest.rideId && (
                <div>
                  <p className="text-xs text-gray-500">Ride ID</p>
                  <p className="text-sm text-[#1D1D1D]">
                    {selectedRequest.rideId}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500">Submitted</p>
                <p className="text-sm text-[#1D1D1D]">
                  {selectedRequest.createdAt
                    ? new Date(selectedRequest.createdAt).toLocaleString()
                    : "Date unavailable"}
                </p>
              </div>
            </div>

            {/* Delete icon and Close button */}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleDeleteRequest}
                disabled={deleting}
                aria-label="Delete request"
                title="Delete request"
                className="flex items-center justify-center p-3 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 transition disabled:opacity-50"
              >
                {deleting ? (
                  <span className="text-sm">...</span>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="m19 6-1 14H6L5 6" />
                    <path d="M10 11v5M14 11v5" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                disabled={deleting}
                className="flex-1 bg-[#8EB800] hover:bg-[#7aa300] text-white rounded-full py-3 font-semibold disabled:opacity-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
