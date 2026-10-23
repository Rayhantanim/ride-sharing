import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* ───────── Icons ───────── */
const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D1D1D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18L9 12L15 6" />
  </svg>
);
const CarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0zM3 17V9l2-5h14l2 5v8M5 9h14" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B">
    <path d="M12 2l3 6.5 7 1-5 4.9 1.2 7L12 18l-6.2 3.4L7 14.4 2 9.5l7-1L12 2z" />
  </svg>
);
const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/* ───────── Tab ───────── */
const Tab = ({ id, active, onClick, label, badge }) => (
  <button
    onClick={() => onClick(id)}
    className={`relative flex items-center gap-2 px-5 py-3 rounded-xl text-[14px] font-semibold transition whitespace-nowrap ${
      active
        ? 'bg-[#8EB800] text-white shadow-sm'
        : 'bg-white text-[#1D1D1D] border border-[#E5E7EB] hover:border-[#8EB800]'
    }`}
  >
    {label}
    {badge > 0 && (
      <span className="ml-1 min-w-[20px] h-5 px-1.5 rounded-full bg-[#EF4444] text-white text-[11px] font-bold flex items-center justify-center">
        {badge}
      </span>
    )}
  </button>
);

/* ───────── Booking Card ───────── */
const BookingCard = ({ booking, onAccept, onReject, loading }) => {
  const ride = booking.ride || {};
  const passenger = booking.passenger || {};

  const statusColors = {
    pending: 'bg-[#FEF3C7] text-[#92400E]',
    accepted: 'bg-[#D1FAE5] text-[#065F46]',
    rejected: 'bg-[#FEE2E2] text-[#991B1B]',
    cancelled: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[16px] font-bold text-[#1D1D1D]">
            {passenger.fullName || 'Passenger'}
          </p>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            {passenger.phone || 'No phone'}
          </p>
        </div>
        <span
          className={`text-[11px] font-bold px-3 py-1 rounded-full ${
            statusColors[booking.status]
          }`}
        >
          {booking.status.toUpperCase()}
        </span>
      </div>

      <div className="bg-[#FAFAFA] rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 text-[14px] text-[#1D1D1D]">
          <span className="font-medium">{ride.from}</span>
          <span className="text-[#9CA3AF]">→</span>
          <span className="font-medium">{ride.to}</span>
        </div>
        <p className="text-[13px] text-[#6B7280] mt-2">
          {ride.date} · {ride.time} · {booking.seats} seat
          {booking.seats > 1 ? 's' : ''} · ${ride.price}/seat
        </p>
      </div>

      {booking.status === 'pending' && (
        <div className="flex gap-3">
          <button
            onClick={() => onAccept(booking._id)}
            disabled={loading}
            className="flex-1 bg-[#8EB800] hover:bg-[#7aa300] text-white font-semibold py-3 rounded-xl text-[14px] transition disabled:opacity-60"
          >
            Accept
          </button>
          <button
            onClick={() => onReject(booking._id)}
            disabled={loading}
            className="flex-1 bg-white border border-[#EF4444] text-[#EF4444] font-semibold py-3 rounded-xl text-[14px] hover:bg-red-50 transition disabled:opacity-60"
          >
            Reject
          </button>
        </div>
      )}

      {booking.status === 'accepted' && passenger.phone && (
        <a
          href={`tel:${passenger.phone}`}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#8EB800] text-[#8EB800] font-semibold text-[14px] hover:bg-[#F4FBE8] transition"
        >
          <PhoneIcon /> Call Passenger
        </a>
      )}
    </div>
  );
};

/* ───────── Ride Card ───────── */
const RideCard = ({ ride, onComplete, onCancel, loading }) => {
  const colors = {
    available: 'bg-[#DBEAFE] text-[#1E40AF]',
    booked: 'bg-[#FEF3C7] text-[#92400E]',
    completed: 'bg-[#D1FAE5] text-[#065F46]',
    cancelled: 'bg-[#FEE2E2] text-[#991B1B]',
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[15px] text-[#1D1D1D]">
              {ride.from}
            </span>
            <span className="text-[#9CA3AF]">→</span>
            <span className="font-semibold text-[15px] text-[#1D1D1D]">
              {ride.to}
            </span>
          </div>
          <p className="text-[13px] text-[#6B7280] mt-1">
            {ride.date} · {ride.time}
          </p>
        </div>
        <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${colors[ride.status]}`}>
          {ride.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#FAFAFA] rounded-lg py-2 px-3">
          <p className="text-[11px] text-[#6B7280]">Seats</p>
          <p className="text-[15px] font-bold text-[#1D1D1D]">{ride.seats}</p>
        </div>
        <div className="bg-[#FAFAFA] rounded-lg py-2 px-3">
          <p className="text-[11px] text-[#6B7280]">Price/seat</p>
          <p className="text-[15px] font-bold text-[#8EB800]">${ride.price}</p>
        </div>
      </div>

      {(ride.status === 'available' || ride.status === 'booked') && (
        <div className="flex gap-3">
          <button
            onClick={() => onComplete(ride._id)}
            disabled={loading}
            className="flex-1 bg-[#8EB800] hover:bg-[#7aa300] text-white font-semibold py-3 rounded-xl text-[14px] transition disabled:opacity-60"
          >
            Complete
          </button>
          <button
            onClick={() => onCancel(ride._id)}
            disabled={loading}
            className="px-5 py-3 rounded-xl border border-[#EF4444] text-[#EF4444] font-semibold text-[14px] hover:bg-red-50 transition disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

/* ───────── Create Ride Modal ───────── */
const CreateRideModal = ({ onClose, onCreate, loading }) => {
  const [form, setForm] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    seats: 1,
    price: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    onCreate(form);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-[520px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[22px] font-bold text-[#1D1D1D] mb-6">
          Create a Ride
        </h3>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1D1D1D]">From</label>
              <input
                name="from"
                value={form.from}
                onChange={handleChange}
                required
                placeholder="Pickup"
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-[14px] outline-none focus:border-[#8EB800]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1D1D1D]">To</label>
              <input
                name="to"
                value={form.to}
                onChange={handleChange}
                required
                placeholder="Destination"
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-[14px] outline-none focus:border-[#8EB800]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1D1D1D]">Date</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-[14px] outline-none focus:border-[#8EB800]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1D1D1D]">Time</label>
              <input
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-[14px] outline-none focus:border-[#8EB800]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1D1D1D]">Seats</label>
              <input
                name="seats"
                type="number"
                min="1"
                value={form.seats}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-[14px] outline-none focus:border-[#8EB800]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1D1D1D]">Price / seat</label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.5"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-[14px] outline-none focus:border-[#8EB800]"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-[#1D1D1D] font-semibold text-[14px] hover:bg-[#FAFAFA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-[#8EB800] text-white font-semibold text-[14px] hover:bg-[#7aa300] disabled:opacity-60"
            >
              {loading ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ───────── Main Dashboard ───────── */
const DriverDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('bookings');
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [rides, setRides] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const flash = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 4000);
  };

  /* Load profile */
  const loadProfile = async () => {
    try {
      const { data } = await axios.get(`${API}/api/driver/profile`, authHeader);
      setProfile(data.driver);
      setStats(data.stats);
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to load profile');
    }
  };

  /* Load tab data */
  const loadTab = async (which) => {
    setLoading(true);
    try {
      if (which === 'bookings') {
        const { data } = await axios.get(`${API}/api/driver/bookings`, authHeader);
        setBookings(data.bookings);
      } else if (which === 'rides') {
        const { data } = await axios.get(`${API}/api/driver/rides`, authHeader);
        setRides(data.rides);
      } else if (which === 'earnings') {
        const { data } = await axios.get(`${API}/api/driver/earnings`, authHeader);
        setEarnings(data.earnings);
      }
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // 🆕 Gate: Redirect if not approved
  useEffect(() => {
    if (profile && profile.verificationStatus !== 'approved') {
      navigate('/driver/verification');
    }
  }, [profile, navigate]);

  useEffect(() => {
    loadTab(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  /* Booking actions */
  const acceptBooking = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${API}/api/driver/bookings/${id}/accept`, {}, authHeader);
      await loadTab('bookings');
      await loadProfile();
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to accept');
    } finally {
      setLoading(false);
    }
  };

  const rejectBooking = async (id) => {
    if (!confirm('Reject this booking?')) return;
    setLoading(true);
    try {
      await axios.post(`${API}/api/driver/bookings/${id}/reject`, {}, authHeader);
      await loadTab('bookings');
      await loadProfile();
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to reject');
    } finally {
      setLoading(false);
    }
  };

  /* Ride actions */
  const createRide = async (payload) => {
    setLoading(true);
    try {
      await axios.post(`${API}/api/driver/rides`, payload, authHeader);
      setShowCreate(false);
      await loadTab('rides');
      await loadProfile();
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to create ride');
    } finally {
      setLoading(false);
    }
  };

  const completeRide = async (id) => {
    if (!confirm('Mark this ride as completed?')) return;
    setLoading(true);
    try {
      await axios.post(`${API}/api/driver/rides/${id}/complete`, {}, authHeader);
      await loadTab('rides');
      await loadProfile();
    } catch (err) {
      flash(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const cancelRide = async (id) => {
    if (!confirm('Cancel this ride? Pending bookings will be rejected.')) return;
    setLoading(true);
    try {
      await axios.post(`${API}/api/driver/rides/${id}/cancel`, {}, authHeader);
      await loadTab('rides');
      await loadProfile();
    } catch (err) {
      flash(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  // Don't render the dashboard until profile is loaded and verified
  if (!profile || profile.verificationStatus !== 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <p className="text-[#6B7280]">Checking verification status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[1400px] mx-auto px-8 py-5 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition"
          >
            <BackIcon />
          </button>
          <h1 className="text-[24px] font-extrabold text-[#1D1D1D]">
            Driver Dashboard
          </h1>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#8EB800] hover:bg-[#7aa300] text-white font-semibold text-[14px] rounded-full transition"
          >
            <PlusIcon /> New Ride
          </button>
        </div>
      </header>

      {/* Profile summary */}
      {profile && (
        <div className="w-full max-w-[1400px] mx-auto px-8 pt-8">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#E6F1D9] flex items-center justify-center text-[#8EB800]">
                <CarIcon />
              </div>
              <div>
                <p className="text-[18px] font-bold text-[#1D1D1D]">
                  {profile.fullName}
                </p>
                <p className="text-[13px] text-[#6B7280]">{profile.email}</p>
                <p className="text-[13px] text-[#6B7280] mt-0.5 flex items-center gap-2">
                  <StarIcon /> {profile.rating?.toFixed(1) || '5.0'} ·{' '}
                  {profile.totalRides} completed rides
                </p>
              </div>
            </div>

            {stats && (
              <div className="flex gap-8">
                <div>
                  <p className="text-[12px] text-[#6B7280]">Available</p>
                  <p className="text-[22px] font-extrabold text-[#1D1D1D]">
                    {stats.activeRides}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-[#6B7280]">Pending</p>
                  <p className="text-[22px] font-extrabold text-[#F59E0B]">
                    {stats.pendingBookings}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-[#6B7280]">Accepted</p>
                  <p className="text-[22px] font-extrabold text-[#8EB800]">
                    {stats.acceptedBookings}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="w-full max-w-[1400px] mx-auto px-8 pt-6 flex gap-3 overflow-x-auto">
        <Tab
          id="bookings"
          active={tab === 'bookings'}
          onClick={setTab}
          label="Passenger Bookings"
          badge={pendingCount}
        />
        <Tab id="rides" active={tab === 'rides'} onClick={setTab} label="My Rides" />
        <Tab
          id="earnings"
          active={tab === 'earnings'}
          onClick={setTab}
          label="Earnings"
        />
      </div>

      {/* Error banner */}
      {error && (
        <div className="w-full max-w-[1400px] mx-auto px-8 pt-4">
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-[14px]">
            {error}
          </div>
        </div>
      )}

      {/* Content */}
      <main className="w-full max-w-[1400px] mx-auto px-8 py-8 flex-1">
        {/* Bookings tab */}
        {tab === 'bookings' && (
          <div>
            <h2 className="text-[20px] font-bold text-[#1D1D1D] mb-6">
              Passenger Bookings
            </h2>
            {loading && bookings.length === 0 ? (
              <p className="text-[#6B7280]">Loading…</p>
            ) : bookings.length === 0 ? (
              <div className="bg-white border border-dashed border-[#E5E7EB] rounded-2xl p-12 text-center">
                <p className="text-[15px] text-[#6B7280]">
                  No bookings yet. Create a ride to get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {bookings.map((b) => (
                  <BookingCard
                    key={b._id}
                    booking={b}
                    onAccept={acceptBooking}
                    onReject={rejectBooking}
                    loading={loading}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rides tab */}
        {tab === 'rides' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-bold text-[#1D1D1D]">My Rides</h2>
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#8EB800] hover:bg-[#7aa300] text-white font-semibold text-[13px] rounded-full transition"
              >
                <PlusIcon /> New Ride
              </button>
            </div>
            {loading && rides.length === 0 ? (
              <p className="text-[#6B7280]">Loading…</p>
            ) : rides.length === 0 ? (
              <div className="bg-white border border-dashed border-[#E5E7EB] rounded-2xl p-12 text-center">
                <p className="text-[15px] text-[#6B7280]">
                  You haven't created any rides yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {rides.map((r) => (
                  <RideCard
                    key={r._id}
                    ride={r}
                    onComplete={completeRide}
                    onCancel={cancelRide}
                    loading={loading}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Earnings tab */}
        {tab === 'earnings' && (
          <div>
            <h2 className="text-[20px] font-bold text-[#1D1D1D] mb-6">Earnings</h2>
            {!earnings ? (
              <p className="text-[#6B7280]">Loading…</p>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                  {[
                    ['Today', earnings.today],
                    ['This Week', earnings.week],
                    ['This Month', earnings.month],
                    ['All Time', earnings.allTime],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="bg-white border border-[#E5E7EB] rounded-2xl p-6"
                    >
                      <p className="text-[13px] text-[#6B7280]">{label}</p>
                      <p className="text-[28px] font-extrabold text-[#8EB800] mt-1">
                        ${value.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                  <p className="text-[15px] text-[#4B5563]">
                    Based on{' '}
                    <span className="font-bold text-[#1D1D1D]">
                      {earnings.totalBookings || 0}
                    </span>{' '}
                    accepted bookings across all your rides.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Create Ride Modal */}
      {showCreate && (
        <CreateRideModal
          onClose={() => setShowCreate(false)}
          onCreate={createRide}
          loading={loading}
        />
      )}
    </div>
  );
};

export default DriverDashboard;