import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
} from 'recharts';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const COLORS = ['#8EB800', '#1E40AF', '#F59E0B', '#9333EA', '#EF4444'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifFilter, setVerifFilter] = useState('pending');

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      navigate('/admin/login');
      return;
    }
    try {
      const u = JSON.parse(userStr);
      if (u.role !== 'admin') navigate('/admin/login');
    } catch {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (tab === 'overview') {
        const { data } = await axios.get(`${API}/api/admin/stats`, authHeader);
        setStats(data.stats);
      } else if (tab === 'users') {
        const { data } = await axios.get(`${API}/api/admin/users`, authHeader);
        setUsers(data.users);
      } else if (tab === 'verifications') {
        const { data } = await axios.get(
          `${API}/api/admin/verifications?status=${verifFilter}`,
          authHeader
        );
        setVerifications(data.verifications);
      } else if (tab === 'rides') {
        const { data } = await axios.get(`${API}/api/admin/rides`, authHeader);
        setRides(data.rides);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [tab, verifFilter]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const approveVerif = async (id) => {
    if (!window.confirm('Approve this driver?')) return;
    await axios.post(`${API}/api/admin/verifications/${id}/approve`, {}, authHeader);
    loadData();
  };

  const rejectVerif = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    await axios.post(
      `${API}/api/admin/verifications/${id}/reject`,
      { reason },
      authHeader
    );
    loadData();
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}" permanently?`)) return;
    await axios.delete(`${API}/api/admin/users/${id}`, authHeader);
    loadData();
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Header */}
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

      {/* Tabs */}
      <div className="w-full bg-white border-b border-[#E5E7EB] sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-8 flex gap-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users' },
            { id: 'verifications', label: 'Verifications' },
            { id: 'rides', label: 'Rides' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`py-4 text-[14px] font-semibold border-b-2 whitespace-nowrap transition ${
                tab === t.id
                  ? 'border-[#8EB800] text-[#8EB800]'
                  : 'border-transparent text-[#6B7280] hover:text-[#1D1D1D]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-[14px]">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8EB800]"></div>
          </div>
        ) : (
          <>
            {/* ═══ OVERVIEW ═══ */}
            {tab === 'overview' && stats && (
              <div className="space-y-8">
                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
                  {[
                    ['Total Passengers', stats.totalPassengers, 'bg-[#E6F1D9] text-[#6B8A00]', '👥'],
                    ['Total Drivers', stats.totalDrivers, 'bg-[#DBEAFE] text-[#1E40AF]', '🚗'],
                    ['Pending Verifications', stats.pendingVerifications, 'bg-[#FEF3C7] text-[#92400E]', '⏳'],
                    ['Total Rides', stats.totalRides, 'bg-[#D1FAE5] text-[#065F46]', '🛣️'],
                    ['Total Bookings', stats.totalBookings, 'bg-[#F3E8FF] text-[#6B21A8]', '📋'],
                  ].map(([label, value, colorClass, icon]) => (
                    <div
                      key={label}
                      className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[13px] text-[#6B7280] font-medium">{label}</p>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[16px] ${colorClass}`}>
                          {icon}
                        </div>
                      </div>
                      <p className="text-[32px] font-extrabold text-[#1D1D1D]">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Bar chart: Users breakdown */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                    <h3 className="text-[16px] font-bold text-[#1D1D1D] mb-4">
                      Platform Overview
                    </h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart
                        data={[
                          { name: 'Passengers', value: stats.totalPassengers },
                          { name: 'Drivers', value: stats.totalDrivers },
                          { name: 'Rides', value: stats.totalRides },
                          { name: 'Bookings', value: stats.totalBookings },
                        ]}
                      >
                        <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            background: '#fff',
                            border: '1px solid #E5E7EB',
                            borderRadius: 12,
                          }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {[
                            '#8EB800',
                            '#1E40AF',
                            '#065F46',
                            '#9333EA',
                          ].map((c, i) => (
                            <Cell key={i} fill={c} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pie chart: verification statuses */}
                  <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                    <h3 className="text-[16px] font-bold text-[#1D1D1D] mb-4">
                      Pending Work
                    </h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: 'Pending',
                              value: stats.pendingVerifications || 0,
                            },
                            {
                              name: 'Reviewed',
                              value:
                                (stats.totalDrivers || 0) -
                                (stats.pendingVerifications || 0),
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

                {/* System Health */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                  <h3 className="text-[16px] font-bold text-[#1D1D1D] mb-4">
                    System Health
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0]">
                      <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <div>
                        <p className="text-[13px] font-semibold text-green-800">MongoDB</p>
                        <p className="text-[12px] text-green-600">Connected</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0]">
                      <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <div>
                        <p className="text-[13px] font-semibold text-green-800">API</p>
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
                          {stats.pendingVerifications} awaiting review
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ USERS ═══ */}
            {tab === 'users' && (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
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
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F1F3]">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-[#F9FAFB]">
                        <td className="px-6 py-4 font-medium text-[#1D1D1D]">
                          {u.fullName}
                        </td>
                        <td className="px-6 py-4 text-[#6B7280]">{u.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                              u.role === 'driver'
                                ? 'bg-[#DBEAFE] text-[#1E40AF]'
                                : 'bg-[#D1FAE5] text-[#065F46]'
                            }`}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {u.role === 'driver' && (
                            <span
                              className={`text-[12px] font-semibold ${
                                u.verificationStatus === 'approved'
                                  ? 'text-green-600'
                                  : u.verificationStatus === 'pending'
                                  ? 'text-yellow-600'
                                  : u.verificationStatus === 'rejected'
                                  ? 'text-red-500'
                                  : 'text-gray-400'
                              }`}
                            >
                              {u.verificationStatus || 'unverified'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-[#6B7280]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteUser(u._id, u.fullName)}
                            className="text-red-500 hover:underline font-semibold text-[13px]"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-[#6B7280]">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ═══ VERIFICATIONS ═══ */}
            {tab === 'verifications' && (
              <div>
                <div className="flex gap-2 mb-6">
                  {['pending', 'approved', 'rejected'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setVerifFilter(s)}
                      className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition ${
                        verifFilter === s
                          ? 'bg-[#8EB800] text-white'
                          : 'bg-white text-[#1D1D1D] border border-[#E5E7EB]'
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
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
                    {verifications.map((v) => (
                      <div
                        key={v._id}
                        className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-[16px] font-bold text-[#1D1D1D]">
                              {v.driver?.fullName || 'Driver'}
                            </p>
                            <p className="text-[13px] text-[#6B7280]">
                              {v.driver?.email}
                            </p>
                            {v.driver?.vehicle && (
                              <p className="text-[12px] text-[#6B7280] mt-1">
                                {v.driver.vehicle.make}{' '}
                                {v.driver.vehicle.model} ·{' '}
                                {v.driver.vehicle.plateNumber}
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                              v.status === 'pending'
                                ? 'bg-[#FEF3C7] text-[#92400E]'
                                : v.status === 'approved'
                                ? 'bg-[#D1FAE5] text-[#065F46]'
                                : 'bg-[#FEE2E2] text-[#991B1B]'
                            }`}
                          >
                            {v.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {['nidFront', 'nidBack', 'licenceFront', 'licenceBack'].map(
                            (key) => (
                              <a
                                key={key}
                                href={`${API}${v[key]}`}
                                target="_blank"
                                rel="noreferrer"
                                className="block"
                              >
                                <img
                                  src={`${API}${v[key]}`}
                                  alt={key}
                                  className="w-full h-24 object-cover rounded-lg border border-[#E5E7EB] hover:opacity-80 transition"
                                />
                              </a>
                            )
                          )}
                        </div>

                        {v.status === 'pending' && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => approveVerif(v._id)}
                              className="flex-1 bg-[#8EB800] hover:bg-[#7aa300] text-white font-semibold py-2.5 rounded-xl text-[14px]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectVerif(v._id)}
                              className="flex-1 bg-white border border-red-400 text-red-500 hover:bg-red-50 font-semibold py-2.5 rounded-xl text-[14px]"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {v.status === 'rejected' && v.rejectionReason && (
                          <p className="text-[13px] text-red-500 mt-2">
                            Reason: {v.rejectionReason}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══ RIDES ═══ */}
            {tab === 'rides' && (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
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
                    {rides.map((r) => (
                      <tr key={r._id} className="hover:bg-[#F9FAFB]">
                        <td className="px-6 py-4 font-medium text-[#1D1D1D]">
                          {r.driver?.fullName || '—'}
                        </td>
                        <td className="px-6 py-4 text-[#6B7280]">
                          {r.from} → {r.to}
                        </td>
                        <td className="px-6 py-4 text-[#6B7280]">
                          {r.date} · {r.time}
                        </td>
                        <td className="px-6 py-4">{r.seats}</td>
                        <td className="px-6 py-4 font-semibold text-[#8EB800]">
                          ${r.price}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                              r.status === 'available'
                                ? 'bg-[#DBEAFE] text-[#1E40AF]'
                                : r.status === 'booked'
                                ? 'bg-[#FEF3C7] text-[#92400E]'
                                : r.status === 'completed'
                                ? 'bg-[#D1FAE5] text-[#065F46]'
                                : 'bg-[#FEE2E2] text-[#991B1B]'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {rides.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-[#6B7280]">
                          No rides yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;