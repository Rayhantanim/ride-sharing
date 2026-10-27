import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const COLORS = ["#8EB800", "#1E40AF", "#F59E0B", "#9333EA", "#EF4444"];

/* ================= SUPPORT REQUEST ROW ================= */

const SupportRequestRow = ({
  request,
  onUpdated,
  authHeader,
  API,
  onError,
}) => {
  const [newStatus, setNewStatus] = useState(request.status || "Received");
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setNewStatus(request.status || "Received");
  }, [request.status]);

  const statusColors = {
    Received: "bg-[#F3F9E7] text-[#648600]",
    "In Process": "bg-[#FEF3C7] text-[#92400E]",
    Resolved: "bg-[#D1FAE5] text-[#065F46]",
  };

  const updateStatus = async () => {
    try {
      setSaving(true);
      onError("");

      await axios.patch(
        `${API}/api/admin/support/${request._id}/status`,
        { status: newStatus },
        authHeader,
      );

      await onUpdated();
    } catch (err) {
      onError(
        err.response?.data?.message ||
          "Failed to update support request status.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-6 py-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h4 className="font-bold text-[#1D1D1D]">
              {request.subject || request.type}
            </h4>

            <span
              className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                statusColors[request.status] || "bg-gray-100 text-gray-600"
              }`}
            >
              {request.status}
            </span>
          </div>

          <p className="text-[13px] text-[#6B7280]">Type: {request.type}</p>

          <p className="text-[13px] text-[#6B7280] mt-1 break-all">
            Request ID: {request._id}
          </p>

          <p className="text-[13px] text-[#6B7280] mt-1">
            Submitted:{" "}
            {request.createdAt
              ? new Date(request.createdAt).toLocaleString()
              : "Unavailable"}
          </p>

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-[13px] font-semibold text-[#6B8A00] hover:underline"
          >
            {expanded ? "Hide Details" : "View Details"}
          </button>

          {expanded && (
            <div className="mt-3 p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <p className="text-[13px] font-semibold text-[#1D1D1D]">
                Description
              </p>

              <p className="text-[14px] text-[#4B5563] mt-1 whitespace-pre-wrap break-words">
                {request.description}
              </p>

              {request.rideId && (
                <p className="text-[13px] text-[#4B5563] mt-3 break-all">
                  Ride ID: {request.rideId}
                </p>
              )}

              <p className="text-[12px] text-[#9CA3AF] mt-3 break-all">
                User ID: {request.userId}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#8EB800]"
          >
            <option value="Received">Received</option>
            <option value="In Process">In Process</option>
            <option value="Resolved">Resolved</option>
          </select>

          <button
            type="button"
            onClick={updateStatus}
            disabled={saving || newStatus === request.status}
            className="px-4 py-2 rounded-lg bg-[#8EB800] hover:bg-[#7aa300] text-white text-[13px] font-semibold disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= ADMIN DASHBOARD ================= */

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [rides, setRides] = useState([]);
  const [supportRequests, setSupportRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verifFilter, setVerifFilter] = useState("pending");
  const [supportFilter, setSupportFilter] = useState("All");

  const token = localStorage.getItem("token");
  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  /* ADMIN AUTH CHECK */

  useEffect(() => {
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      navigate("/admin/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);

      if (user.role !== "admin") {
        navigate("/admin/login");
      }
    } catch {
      navigate("/admin/login");
    }
  }, [token, navigate]);

  /* LOAD DATA */

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      if (tab === "overview") {
        const { data } = await axios.get(`${API}/api/admin/stats`, authHeader);

        setStats(data.stats);
      } else if (tab === "users") {
        const { data } = await axios.get(`${API}/api/admin/users`, authHeader);

        setUsers(data.users || []);
      } else if (tab === "verifications") {
        const { data } = await axios.get(
          `${API}/api/admin/verifications?status=${verifFilter}`,
          authHeader,
        );

        setVerifications(data.verifications || []);
      } else if (tab === "rides") {
        const { data } = await axios.get(`${API}/api/admin/rides`, authHeader);

        setRides(data.rides || []);
      } else if (tab === "support") {
        const query =
          supportFilter === "All"
            ? ""
            : `?status=${encodeURIComponent(supportFilter)}`;

        const { data } = await axios.get(
          `${API}/api/admin/support${query}`,
          authHeader,
        );

        setSupportRequests(data.requests || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [tab, verifFilter, supportFilter]);

  /* LOGOUT */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  /* APPROVE DRIVER */

  const approveVerif = async (id) => {
    if (!window.confirm("Approve this driver?")) return;

    try {
      await axios.post(
        `${API}/api/admin/verifications/${id}/approve`,
        {},
        authHeader,
      );

      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve driver");
    }
  };

  /* REJECT DRIVER */

  const rejectVerif = async (id) => {
    const reason = window.prompt("Enter rejection reason:");

    if (!reason || !reason.trim()) return;

    try {
      await axios.post(
        `${API}/api/admin/verifications/${id}/reject`,
        { reason: reason.trim() },
        authHeader,
      );

      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject driver");
    }
  };

  /* DELETE USER */

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}" permanently?`)) {
      return;
    }

    try {
      await axios.delete(`${API}/api/admin/users/${id}`, authHeader);

      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  /* TABS */

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "verifications", label: "Verifications" },
    { id: "rides", label: "Rides" },
    { id: "support", label: "Support Requests" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* HEADER */}

      <header className="w-full bg-[#0F172A] text-white shadow-lg">
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#8EB800] flex items-center justify-center font-extrabold text-[#0F172A]">
              z
            </div>

            <h1 className="text-[22px] font-extrabold tracking-tight">
              zyGo <span className="text-[#8EB800]">Admin</span>
            </h1>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-[13px] font-semibold transition"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* NAVIGATION TABS */}

      <div className="w-full bg-white border-b border-[#E5E7EB] sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-8 flex gap-6 overflow-x-auto">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`py-4 text-[14px] font-semibold border-b-2 whitespace-nowrap transition ${
                tab === item.id
                  ? "border-[#8EB800] text-[#8EB800]"
                  : "border-transparent text-[#6B7280] hover:text-[#1D1D1D]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-[14px]">
            {error}
            <button
              type="button"
              onClick={() => setError("")}
              className="float-right font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8EB800]" />
          </div>
        ) : (
          <>
            {/* ================= OVERVIEW ================= */}

            {tab === "overview" && stats && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
                  {[
                    [
                      "Total Passengers",
                      stats.totalPassengers,
                      "bg-[#E6F1D9] text-[#6B8A00]",
                      "👥",
                    ],
                    [
                      "Total Drivers",
                      stats.totalDrivers,
                      "bg-[#DBEAFE] text-[#1E40AF]",
                      "🚗",
                    ],
                    [
                      "Pending Verifications",
                      stats.pendingVerifications,
                      "bg-[#FEF3C7] text-[#92400E]",
                      "⏳",
                    ],
                    [
                      "Total Rides",
                      stats.totalRides,
                      "bg-[#D1FAE5] text-[#065F46]",
                      "🛣️",
                    ],
                    [
                      "Total Bookings",
                      stats.totalBookings,
                      "bg-[#F3E8FF] text-[#6B21A8]",
                      "📋",
                    ],
                  ].map(([label, value, colorClass, icon]) => (
                    <div
                      key={label}
                      className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[13px] text-[#6B7280] font-medium">
                          {label}
                        </p>

                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-[16px] ${colorClass}`}
                        >
                          {icon}
                        </div>
                      </div>

                      <p className="text-[32px] font-extrabold text-[#1D1D1D]">
                        {value ?? 0}
                      </p>
                    </div>
                  ))}
                </div>

                {/* PLATFORM CHARTS */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                    <h3 className="text-[16px] font-bold text-[#1D1D1D] mb-4">
                      Platform Overview
                    </h3>

                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart
                        data={[
                          {
                            name: "Passengers",
                            value: stats.totalPassengers || 0,
                          },
                          {
                            name: "Drivers",
                            value: stats.totalDrivers || 0,
                          },
                          {
                            name: "Rides",
                            value: stats.totalRides || 0,
                          },
                          {
                            name: "Bookings",
                            value: stats.totalBookings || 0,
                          },
                        ]}
                      >
                        <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            background: "#fff",
                            border: "1px solid #E5E7EB",
                            borderRadius: 12,
                          }}
                        />

                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {["#8EB800", "#1E40AF", "#065F46", "#9333EA"].map(
                            (color, index) => (
                              <Cell key={index} fill={color} />
                            ),
                          )}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                    <h3 className="text-[16px] font-bold text-[#1D1D1D] mb-4">
                      Pending Work
                    </h3>

                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "Pending",
                              value: stats.pendingVerifications || 0,
                            },
                            {
                              name: "Reviewed",
                              value: Math.max(
                                0,
                                (stats.totalDrivers || 0) -
                                  (stats.pendingVerifications || 0),
                              ),
                            },
                          ]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={45}
                          paddingAngle={3}
                        >
                          <Cell fill="#F59E0B" />
                          <Cell fill="#8EB800" />
                        </Pie>

                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* SYSTEM HEALTH */}

                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                  <h3 className="text-[16px] font-bold text-[#1D1D1D] mb-4">
                    System Health
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0]">
                      <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <div>
                        <p className="text-[13px] font-semibold text-green-800">
                          MongoDB
                        </p>
                        <p className="text-[12px] text-green-600">Connected</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0]">
                      <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <div>
                        <p className="text-[13px] font-semibold text-green-800">
                          API
                        </p>
                        <p className="text-[12px] text-green-600">Responding</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-[#FEF3C7] rounded-xl border border-[#FDE68A]">
                      <span className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
                      <div>
                        <p className="text-[13px] font-semibold text-yellow-800">
                          Pending Actions
                        </p>
                        <p className="text-[12px] text-yellow-600">
                          {stats.pendingVerifications || 0} awaiting review
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= USERS ================= */}

            {tab === "users" && (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-x-auto shadow-sm">
                <div className="px-6 py-4 border-b border-[#E5E7EB]">
                  <h3 className="text-[16px] font-bold text-[#1D1D1D]">
                    All Users ({users.length})
                  </h3>
                </div>

                <table className="w-full text-left text-[14px]">
                  <thead className="bg-[#FAFAFA] border-b border-[#E5E7EB] text-[#6B7280]">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Email</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold">Verified</th>
                      <th className="px-6 py-4 font-semibold">Joined</th>
                      <th className="px-6 py-4 font-semibold text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#F0F1F3]">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-[#F9FAFB]">
                        <td className="px-6 py-4 font-medium text-[#1D1D1D]">
                          {user.fullName}
                        </td>

                        <td className="px-6 py-4 text-[#6B7280]">
                          {user.email}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                              user.role === "driver"
                                ? "bg-[#DBEAFE] text-[#1E40AF]"
                                : "bg-[#D1FAE5] text-[#065F46]"
                            }`}
                          >
                            {(user.role || "user").toUpperCase()}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {user.role === "driver" && (
                            <span
                              className={`text-[12px] font-semibold ${
                                user.verificationStatus === "approved"
                                  ? "text-green-600"
                                  : user.verificationStatus === "pending"
                                    ? "text-yellow-600"
                                    : user.verificationStatus === "rejected"
                                      ? "text-red-500"
                                      : "text-gray-400"
                              }`}
                            >
                              {user.verificationStatus || "unverified"}
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-[#6B7280]">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteUser(user._id, user.fullName)}
                            className="text-red-500 hover:underline font-semibold text-[13px]"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}

                    {users.length === 0 && (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-8 text-center text-[#6B7280]"
                        >
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ================= VERIFICATIONS ================= */}

            {tab === "verifications" && (
              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {["pending", "approved", "rejected"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setVerifFilter(status)}
                      className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition ${
                        verifFilter === status
                          ? "bg-[#8EB800] text-white"
                          : "bg-white text-[#1D1D1D] border border-[#E5E7EB]"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>

                {verifications.length === 0 ? (
                  <div className="bg-white border border-dashed border-[#E5E7EB] rounded-2xl p-12 text-center">
                    <p className="text-[15px] text-[#6B7280]">
                      No {verifFilter} verifications.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {verifications.map((verification) => (
                      <div
                        key={verification._id}
                        className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-4 gap-3">
                          <div>
                            <p className="text-[16px] font-bold text-[#1D1D1D]">
                              {verification.driver?.fullName || "Driver"}
                            </p>

                            <p className="text-[13px] text-[#6B7280]">
                              {verification.driver?.email}
                            </p>

                            {verification.driver?.vehicle && (
                              <p className="text-[12px] text-[#6B7280] mt-1">
                                {verification.driver.vehicle.make}{" "}
                                {verification.driver.vehicle.model} ·{" "}
                                {verification.driver.vehicle.plateNumber}
                              </p>
                            )}
                          </div>

                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                              verification.status === "pending"
                                ? "bg-[#FEF3C7] text-[#92400E]"
                                : verification.status === "approved"
                                  ? "bg-[#D1FAE5] text-[#065F46]"
                                  : "bg-[#FEE2E2] text-[#991B1B]"
                            }`}
                          >
                            {verification.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {[
                            "nidFront",
                            "nidBack",
                            "licenceFront",
                            "licenceBack",
                          ].map((key) => (
                            <a
                              key={key}
                              href={
                                verification[key]
                                  ? `${API}${verification[key]}`
                                  : "#"
                              }
                              target="_blank"
                              rel="noreferrer"
                              onClick={(event) => {
                                if (!verification[key]) event.preventDefault();
                              }}
                              className="block"
                            >
                              {verification[key] ? (
                                <img
                                  src={`${API}${verification[key]}`}
                                  alt={key}
                                  className="w-full h-24 object-cover rounded-lg border border-[#E5E7EB] hover:opacity-80 transition"
                                />
                              ) : (
                                <div className="w-full h-24 flex items-center justify-center rounded-lg border border-dashed border-[#E5E7EB] text-xs text-gray-400">
                                  {key} unavailable
                                </div>
                              )}
                            </a>
                          ))}
                        </div>

                        {verification.status === "pending" && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => approveVerif(verification._id)}
                              className="flex-1 bg-[#8EB800] hover:bg-[#7aa300] text-white font-semibold py-2.5 rounded-xl text-[14px]"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() => rejectVerif(verification._id)}
                              className="flex-1 bg-white border border-red-400 text-red-500 hover:bg-red-50 font-semibold py-2.5 rounded-xl text-[14px]"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {verification.status === "rejected" &&
                          verification.rejectionReason && (
                            <p className="text-[13px] text-red-500 mt-2">
                              Reason: {verification.rejectionReason}
                            </p>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= RIDES ================= */}

            {tab === "rides" && (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-x-auto shadow-sm">
                <div className="px-6 py-4 border-b border-[#E5E7EB]">
                  <h3 className="text-[16px] font-bold text-[#1D1D1D]">
                    All Rides ({rides.length})
                  </h3>
                </div>

                <table className="w-full text-left text-[14px]">
                  <thead className="bg-[#FAFAFA] border-b border-[#E5E7EB] text-[#6B7280]">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Driver</th>
                      <th className="px-6 py-4 font-semibold">From → To</th>
                      <th className="px-6 py-4 font-semibold">Date/Time</th>
                      <th className="px-6 py-4 font-semibold">Seats</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#F0F1F3]">
                    {rides.map((ride) => (
                      <tr key={ride._id} className="hover:bg-[#F9FAFB]">
                        <td className="px-6 py-4 font-medium text-[#1D1D1D]">
                          {ride.driver?.fullName || "—"}
                        </td>

                        <td className="px-6 py-4 text-[#6B7280]">
                          {ride.from} → {ride.to}
                        </td>

                        <td className="px-6 py-4 text-[#6B7280]">
                          {ride.date} · {ride.time}
                        </td>

                        <td className="px-6 py-4">{ride.seats}</td>

                        <td className="px-6 py-4 font-semibold text-[#8EB800]">
                          ${ride.price}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                              ride.status === "available"
                                ? "bg-[#DBEAFE] text-[#1E40AF]"
                                : ride.status === "booked"
                                  ? "bg-[#FEF3C7] text-[#92400E]"
                                  : ride.status === "completed"
                                    ? "bg-[#D1FAE5] text-[#065F46]"
                                    : "bg-[#FEE2E2] text-[#991B1B]"
                            }`}
                          >
                            {ride.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {rides.length === 0 && (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-8 text-center text-[#6B7280]"
                        >
                          No rides yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ================= SUPPORT REQUESTS ================= */}

            {tab === "support" && (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-[18px] font-bold text-[#1D1D1D]">
                      Support Requests ({supportRequests.length})
                    </h3>

                    <p className="text-[13px] text-[#6B7280] mt-1">
                      Review and manage user complaints.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <select
                      value={supportFilter}
                      onChange={(event) => setSupportFilter(event.target.value)}
                      className="border border-[#E5E7EB] rounded-lg px-4 py-2 text-[13px] outline-none focus:border-[#8EB800]"
                    >
                      <option value="All">All Requests</option>
                      <option value="Received">Received</option>
                      <option value="In Process">In Process</option>
                      <option value="Resolved">Resolved</option>
                    </select>

                    <button
                      type="button"
                      onClick={loadData}
                      className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-[13px] font-semibold hover:bg-gray-50"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                {supportRequests.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="text-4xl mb-3">📩</div>

                    <p className="text-[15px] font-semibold text-[#1D1D1D]">
                      No support requests found
                    </p>

                    <p className="text-[13px] text-[#6B7280] mt-2">
                      New user complaints will appear here when submitted.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#F0F1F3]">
                    {supportRequests.map((request) => (
                      <SupportRequestRow
                        key={request._id}
                        request={request}
                        onUpdated={loadData}
                        authHeader={authHeader}
                        API={API}
                        onError={setError}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
