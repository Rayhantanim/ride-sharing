import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import rideImage from "../../assets/image 128.png";

/* ───────────────────────── Icons ───────────────────────── */

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
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const SupportIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1D1D1D"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v3M21 12h-3M12 21v-3M3 12h3" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8EB800"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 0 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const ChatIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8EB800"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ShareIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1D1D1D"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M16 6l-4-4-4 4M12 2v15" />
  </svg>
);

const EditIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1D1D1D"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const PinIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1D1D1D"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CancelIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#EF4444"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M15 9l-6 6M9 9l6 6" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8EB800"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const DistanceIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8EB800"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12h4M17 12h4M12 3v4M12 17v4" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const FareIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8EB800"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

const CardIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8EB800"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#8EB800">
    <path d="M12 2l3 6.5 7 1-5 4.9 1.2 7L12 18l-6.2 3.4L7 14.4 2 9.5l7-1L12 2z" />
  </svg>
);

/* ───────────────────────── Tabs ───────────────────────── */

const Tabs = ({ active, onChange }) => {
  const tabs = ["Current Ride", "Upcoming", "Past Ride"];

  return (
    <div className="flex gap-3 p-2 bg-[#F4FBE8] rounded-2xl">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-6 py-3 rounded-xl text-[14px] font-semibold transition whitespace-nowrap ${
            active === tab
              ? "bg-white text-[#8EB800] shadow-sm"
              : "bg-white/60 text-[#1D1D1D] hover:bg-white"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

/* ───────────────────────── Action Tile ───────────────────────── */

const ActionTile = ({ icon, label, danger, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-3 bg-white border border-[#E5E7EB] rounded-xl py-6 px-4 hover:border-[#8EB800] hover:shadow-sm transition min-h-[120px] ${
      danger ? "hover:border-red-300" : ""
    }`}
  >
    {icon}

    <span
      className={`text-[13px] font-medium ${
        danger ? "text-red-500" : "text-[#1D1D1D]"
      }`}
    >
      {label}
    </span>
  </button>
);

/* ───────────────────────── Detail Row ───────────────────────── */

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-4 border-b border-[#F0F1F3] last:border-b-0">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-[14px] text-[#4B5563]">{label}</span>
    </div>

    <span className="text-[14px] font-medium text-[#1D1D1D]">{value}</span>
  </div>
);

/* ───────────────────────── Upcoming Ride ───────────────────────── */

const UpcomingRide = ({ booking, onCancel, cancelling }) => {
  if (!booking) {
    return (
      <section className="lg:col-span-12 bg-white rounded-2xl border border-[#E5E7EB] p-10 shadow-sm text-center">
        <div className="text-[18px] font-bold text-[#1D1D1D]">
          No upcoming rides
        </div>

        <p className="text-[14px] text-[#6B7280] mt-2">
          Book a ride from Available Rides to see it here.
        </p>

        <Link
          to="/available-rides"
          className="inline-block mt-5 bg-[#8EB800] hover:bg-[#7AA300] text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          Find a Ride
        </Link>
      </section>
    );
  }

  const rideData = booking.ride || {};

  const bookedSeats = Number(booking.seats || 1);

  const pricePerSeat = Number(rideData.price || 0);

  const totalFare = pricePerSeat * bookedSeats;

  const driverName =
    rideData.driver?.fullName ||
    rideData.driver?.name ||
    rideData.driver?.email ||
    "Available Driver";

  const driverPhone = rideData.driver?.phone || "";

  return (
    <section className="lg:col-span-12 bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2">
          <span className="inline-flex px-3 py-1 rounded-full bg-[#F4FBE8] text-[#8EB800] text-[12px] font-bold">
            {booking.status?.toUpperCase() || "PENDING"}
          </span>

          <h3 className="text-[26px] font-extrabold text-[#1D1D1D] mt-3">
            {rideData.from || "Unknown"} → {rideData.to || "Unknown"}
          </h3>

          <p className="text-[14px] text-[#6B7280] mt-2">
            {rideData.date || "Date unavailable"} •{" "}
            {rideData.time || "Time unavailable"}
          </p>

          {/* ROUTE */}
          <div className="relative flex flex-col gap-6 mt-7">
            <div className="absolute left-[9px] top-[25px] bottom-[25px] border-l border-dashed border-[#C7CAD1]" />

            <div className="relative flex items-start gap-4">
              <span className="w-5 h-5 rounded-full bg-[#8EB800] ring-4 ring-[#E8F5C8] shrink-0 mt-1" />

              <div>
                <p className="text-[12px] text-[#9CA3AF]">PICKUP</p>

                <p className="text-[15px] font-semibold text-[#1D1D1D] mt-1">
                  {rideData.from || "Unknown"}
                </p>
              </div>
            </div>

            <div className="relative flex items-start gap-4">
              <span className="w-5 h-5 rounded-full border-2 border-[#8EB800] bg-white shrink-0 mt-1" />

              <div>
                <p className="text-[12px] text-[#9CA3AF]">DESTINATION</p>

                <p className="text-[15px] font-semibold text-[#1D1D1D] mt-1">
                  {rideData.to || "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* DRIVER */}
          <div className="mt-8 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#DFF0BE] flex items-center justify-center text-[#8EB800] shrink-0">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
              </svg>
            </div>

            <div>
              <p className="text-[15px] font-bold text-[#1D1D1D]">
                {driverName}
              </p>

              {driverPhone && (
                <p className="text-[12px] text-[#9CA3AF] mt-1">{driverPhone}</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:border-l lg:border-[#E5E7EB] lg:pl-8">
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="bg-[#F8F9FA] rounded-xl p-4">
              <p className="text-[12px] text-[#9CA3AF]">SEATS</p>

              <p className="text-[20px] font-bold text-[#1D1D1D] mt-1">
                {bookedSeats}
              </p>
            </div>

            <div className="bg-[#F8F9FA] rounded-xl p-4">
              <p className="text-[12px] text-[#9CA3AF]">PRICE / SEAT</p>

              <p className="text-[20px] font-bold text-[#1D1D1D] mt-1">
                ৳{pricePerSeat.toFixed(2)}
              </p>
            </div>

            <div className="bg-[#F4FBE8] rounded-xl p-4 col-span-2 lg:col-span-1">
              <p className="text-[12px] text-[#7A9900]">TOTAL FARE</p>

              <p className="text-[28px] font-extrabold text-[#8EB800] mt-1">
                ৳{totalFare.toFixed(2)}
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            disabled={cancelling}
            className="w-full mt-5 py-3 rounded-xl border border-red-200 text-red-500 font-semibold hover:bg-red-50 disabled:opacity-50 transition"
          >
            {cancelling ? "Cancelling..." : "Cancel Booking"}
          </button>
        </div>
      </div>
    </section>
  );
};

/* ───────────────────────── Current Ride ───────────────────────── */

const CurrentRide = ({ booking, onCancel, cancelling }) => {
  if (!booking) {
    return (
      <section className="lg:col-span-12 bg-white rounded-2xl border border-[#E5E7EB] p-10 shadow-sm text-center">
        <h3 className="text-[18px] font-bold text-[#1D1D1D]">
          No current ride
        </h3>

        <p className="text-[14px] text-[#6B7280] mt-2">
          Your active ride will appear here.
        </p>

        <Link
          to="/available-rides"
          className="inline-block mt-5 bg-[#8EB800] hover:bg-[#7AA300] text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          Find a Ride
        </Link>
      </section>
    );
  }

  const rideData = booking.ride || {};

  const bookedSeats = Number(booking.seats || 1);

  const totalFare = Number(rideData.price || 0) * bookedSeats;

  const driverName =
    rideData.driver?.fullName ||
    rideData.driver?.name ||
    rideData.driver?.email ||
    "Available Driver";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT */}
      <section className="lg:col-span-5 bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
        <span className="inline-flex px-3 py-1 rounded-full bg-[#F4FBE8] text-[#8EB800] text-[12px] font-bold">
          {booking.status?.toUpperCase() || "PENDING"}
        </span>

        <h3 className="text-[24px] font-extrabold text-[#8EB800] mt-4">
          {rideData.from || "Unknown"} → {rideData.to || "Unknown"}
        </h3>

        <p className="text-[14px] text-[#6B7280] mt-2">
          {rideData.date || "Date unavailable"} •{" "}
          {rideData.time || "Time unavailable"}
        </p>

        <div className="relative my-6 h-[280px] lg:h-[320px] rounded-xl bg-gradient-to-br from-[#EAF7D4] to-[#F4FBE8] overflow-hidden">
          <img
            src={rideImage}
            alt="Ride illustration"
            className="absolute inset-0 w-full h-full object-contain object-center p-4"
          />
        </div>

        {/* ROUTE */}
        <div className="relative flex flex-col gap-6 mt-4">
          <div className="absolute left-[9px] top-[26px] bottom-[26px] border-l border-dashed border-[#C7CAD1]" />

          <div className="relative flex items-start gap-4">
            <span className="w-5 h-5 rounded-full bg-[#8EB800] ring-4 ring-[#E8F5C8] shrink-0 mt-1" />

            <div>
              <p className="text-[14px] font-semibold text-[#1D1D1D]">
                Pick up
              </p>

              <p className="text-[13px] text-[#6B7280]">
                {rideData.from || "Unknown"}
              </p>
            </div>
          </div>

          <div className="relative flex items-start gap-4">
            <span className="w-5 h-5 rounded-full border-2 border-[#8EB800] bg-white shrink-0 mt-1" />

            <div>
              <p className="text-[14px] font-semibold text-[#1D1D1D]">
                Destination
              </p>

              <p className="text-[13px] text-[#6B7280]">
                {rideData.to || "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MIDDLE */}
      <section className="lg:col-span-3 flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#DFF0BE] flex items-center justify-center text-[#8EB800] shrink-0">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
              </svg>
            </div>

            <div className="min-w-0">
              <p className="text-[15px] font-bold text-[#1D1D1D] truncate">
                {driverName}
              </p>

              <p className="text-[12px] text-[#9CA3AF] mt-0.5 truncate">
                {rideData.car || "Vehicle information unavailable"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-5">
            <button
              onClick={() => alert("Calling driver...")}
              className="w-11 h-11 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F4FBE8] hover:border-[#8EB800] transition"
            >
              <PhoneIcon />
            </button>

            <button
              onClick={() => alert("Chat feature coming soon.")}
              className="w-11 h-11 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F4FBE8] hover:border-[#8EB800] transition"
            >
              <ChatIcon />
            </button>
          </div>
        </div>

        {/* ACTIONS */}
        <div>
          <h3 className="text-[18px] font-bold text-[#1D1D1D] mb-3">
            Ride Actions
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <ActionTile
              icon={<ShareIcon />}
              label="Share Ride"
              onClick={() => alert("Ride link copied!")}
            />

            <ActionTile
              icon={<EditIcon />}
              label="Edit Ride"
              onClick={() => alert("Edit ride feature coming soon.")}
            />

            <ActionTile
              icon={<PinIcon />}
              label="Add Stop"
              onClick={() => alert("Add stop feature coming soon.")}
            />

            <ActionTile
              icon={<CancelIcon />}
              label="Cancel"
              danger
              onClick={onCancel}
            />
          </div>
        </div>
      </section>

      {/* RIGHT */}
      <section className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
          <h3 className="text-[18px] font-bold text-[#1D1D1D] mb-4">
            Ride Details
          </h3>

          <div className="flex flex-col">
            <DetailRow
              icon={<ClockIcon />}
              label="Ride Time"
              value={`${rideData.date || "N/A"}, ${rideData.time || "N/A"}`}
            />

            <DetailRow
              icon={<DistanceIcon />}
              label="Seats"
              value={bookedSeats}
            />

            <DetailRow
              icon={<FareIcon />}
              label="Fare"
              value={`৳${totalFare.toFixed(2)}`}
            />

            <DetailRow
              icon={<CardIcon />}
              label="Payment Method"
              value="VISA •••• 4242"
            />
          </div>

          <button
            onClick={() =>
              alert(
                `Fare: ৳${Number(rideData.price || 0).toFixed(
                  2,
                )} × ${bookedSeats} seat(s) = ৳${totalFare.toFixed(2)}`,
              )
            }
            className="mt-6 w-full flex items-center justify-center gap-2 text-[#8EB800] font-semibold text-[15px] hover:gap-3 transition-all"
          >
            View Fare Breakdown
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
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
};

/* ───────────────────────── Main Component ───────────────────────── */

const RideManagement = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");

  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(true);

  const [cancelling, setCancelling] = useState(false);

  /* ================= FETCH BOOKINGS ================= */

  const fetchBooking = async () => {
    try {
      setLoading(true);

      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        console.log("❌ No logged-in user found.");
        setBooking(null);
        return;
      }

      const user = JSON.parse(storedUser);

      console.log("👤 Current user:", user);

      if (!user?.id) {
        console.log("❌ User ID missing.");
        setBooking(null);
        return;
      }

      const response = await fetch("http://localhost:5000/api/bookings");

      const data = await response.json();

      console.log("📥 Bookings from backend:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load bookings.");
      }

      /*
        Find bookings belonging to current user.
        passenger is populated by backend.
      */

      const userBookings = data.filter(
        (item) =>
          item.passenger?._id === user.id || item.passenger?.id === user.id,
      );

      /*
        Pick the latest non-cancelled booking.
      */

      const activeBooking =
        userBookings.find((item) => item.status !== "cancelled") || null;

      console.log("🎯 Current user's booking:", activeBooking);

      setBooking(activeBooking);
    } catch (error) {
      console.error("❌ Failed to fetch booking:", error);

      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, []);

  /* ================= CANCEL BOOKING ================= */

  const handleCancelBooking = async () => {
    if (!booking?._id) {
      alert("Booking information not found.");
      return;
    }

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmCancel) {
      return;
    }

    try {
      setCancelling(true);

      const response = await fetch(
        `http://localhost:5000/api/bookings/${booking._id}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      console.log("📥 Cancel response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking.");
      }

      alert("Ride cancelled successfully.");

      setBooking(null);

      /*
        Refresh booking list after cancellation.
      */
      await fetchBooking();
    } catch (error) {
      console.error("❌ Cancel booking failed:", error);

      alert(error.message || "Failed to cancel booking.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* ================= HEADER ================= */}

      <header className="w-full bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[1400px] mx-auto px-8 py-5 flex items-center justify-between">
          <Link
            to="/home"
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Go to Home"
          >
            <BackIcon />
          </Link>

          <h1 className="text-[36px] font-bold tracking-tight select-none">
            <span className="text-[#1D1D1D]">zy</span>
            <span className="text-[#8EB800]">Go</span>
          </h1>

          <button
            className="p-2 -mr-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Support"
          >
            <SupportIcon />
          </button>
        </div>
      </header>

      {/* ================= PAGE TITLE ================= */}

      <div className="w-full max-w-[1400px] mx-auto px-8 pt-8">
        <h2 className="text-[28px] font-extrabold text-[#1D1D1D] tracking-tight">
          Ride Management
        </h2>

        <p className="text-[15px] text-[#6B7280] mt-1">
          Track, manage and take control your rides.
        </p>
      </div>

      {/* ================= TABS ================= */}

      <div className="w-full max-w-[1400px] mx-auto px-8 pt-6">
        <Tabs active={activeTab} onChange={setActiveTab} />
      </div>

      {/* ================= MAIN ================= */}

      <main className="w-full max-w-[1400px] mx-auto px-8 py-8 flex-1">
        {/* ================= LOADING ================= */}

        {loading && (
          <section className="bg-white rounded-2xl border border-[#E5E7EB] p-10 shadow-sm text-center">
            <p className="text-[15px] text-[#6B7280]">Loading your rides...</p>
          </section>
        )}

        {/* ================= UPCOMING ================= */}

        {!loading && activeTab === "Upcoming" && (
          <div className="grid grid-cols-1 gap-6">
            <UpcomingRide
              booking={booking}
              onCancel={handleCancelBooking}
              cancelling={cancelling}
            />
          </div>
        )}

        {/* ================= PAST ================= */}

        {!loading && activeTab === "Past Ride" && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 shadow-sm text-center">
            <h3 className="text-[18px] font-bold text-[#1D1D1D]">
              No past rides
            </h3>

            <p className="text-[14px] text-[#6B7280] mt-2">
              Your completed rides will appear here.
            </p>
          </div>
        )}

        {/* ================= CURRENT RIDE ================= */}

        {!loading && activeTab === "Current Ride" && (
          <CurrentRide
            booking={booking}
            onCancel={handleCancelBooking}
            cancelling={cancelling}
          />
        )}
      </main>
    </div>
  );
};

export default RideManagement;
