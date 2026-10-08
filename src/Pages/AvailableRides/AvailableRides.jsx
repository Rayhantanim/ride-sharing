import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

/* ───────────────────── Icons ───────────────────── */

const BackIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

const MapPinIcon = () => (
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
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
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
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const SeatIcon = () => (
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
    <circle cx="9" cy="7" r="3" />
    <path d="M3 21v-1a6 6 0 0 1 12 0v1" />
    <path d="M16 4a3 3 0 0 1 0 6" />
    <path d="M17 14a6 6 0 0 1 4 6v1" />
  </svg>
);

const StarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="#8EB800"
    stroke="#8EB800"
    strokeWidth="1"
  >
    <path d="M12 2l3 6.5 7 1-5 4.9 1.2 7L12 18l-6.2 3.4L7 14.4 2 9.5l7-1L12 2z" />
  </svg>
);

const CarIcon = () => (
  <svg
    width="25"
    height="25"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8EB800"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 17h14" />
    <path d="M3 17V9l2-5h14l2 5v8" />
    <path d="M5 9h14" />
    <circle cx="5" cy="17" r="2" />
    <circle cx="19" cy="17" r="2" />
  </svg>
);

/* ───────────────────── Ride Card ───────────────────── */

const RideCard = ({ ride }) => {
  const navigate = useNavigate();

  const handleBook = () => {
    navigate("/booking", {
      state: {
        ride,
      },
    });
  };

  const driverName =
    ride.driver?.fullName ||
    ride.driver?.name ||
    ride.driver?.email ||
    "Available Driver";

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#8EB800] transition">
      {/* Driver */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#EAF4D4] flex items-center justify-center text-[#8EB800]">
            <svg
              width="28"
              height="28"
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
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-bold text-[#1D1D1D]">
                {driverName}
              </h3>

              <span className="flex items-center gap-1 text-[13px] font-semibold">
                <StarIcon />
                {ride.rating || "New"}
              </span>
            </div>

            <p className="text-[13px] text-[#9CA3AF] mt-1">
              {ride.car || "Car details unavailable"}
              {ride.color ? ` • ${ride.color}` : ""}
              {ride.plate ? ` • ${ride.plate}` : ""}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[20px] font-extrabold text-[#1D1D1D]">
            ৳{Number(ride.price || 0).toFixed(2)}
          </p>

          <p className="text-[12px] text-[#9CA3AF]">per seat</p>
        </div>
      </div>

      {/* Route */}

      <div className="mt-6 bg-[#F9FAFB] rounded-xl p-4">
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className="w-3 h-3 rounded-full bg-[#8EB800] ring-4 ring-[#E8F5C8]" />

            <div className="h-10 border-l border-dashed border-[#C7CAD1]" />

            <span className="w-3 h-3 rounded-sm bg-[#8EB800]" />
          </div>

          <div className="flex flex-col gap-6 flex-1">
            <div>
              <p className="text-[12px] text-[#9CA3AF]">Pick up</p>

              <p className="text-[14px] font-semibold text-[#1D1D1D]">
                {ride.from}
              </p>
            </div>

            <div>
              <p className="text-[12px] text-[#9CA3AF]">Destination</p>

              <p className="text-[14px] font-semibold text-[#1D1D1D]">
                {ride.to}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="flex items-center gap-2">
          <ClockIcon />

          <div>
            <p className="text-[11px] text-[#9CA3AF]">Departure</p>

            <p className="text-[13px] font-semibold text-[#1D1D1D]">
              {ride.time}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SeatIcon />

          <div>
            <p className="text-[11px] text-[#9CA3AF]">Available</p>

            <p className="text-[13px] font-semibold text-[#1D1D1D]">
              {ride.seats} seats
            </p>
          </div>
        </div>
      </div>

      {/* Book Button */}

      <button
        onClick={handleBook}
        className="w-full mt-5 bg-[#8EB800] hover:bg-[#7AA300] text-white font-semibold text-[14px] py-3.5 rounded-xl transition"
      >
        Book This Ride
      </button>
    </div>
  );
};

/* ───────────────────── Main Component ───────────────────── */

const AvailableRides = () => {
  const location = useLocation();

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= GET SELECTED LOCATIONS ================= */

  const searchParams = new URLSearchParams(location.search);

  const selectedFrom = searchParams.get("from") || "";

  const selectedTo = searchParams.get("to") || "";

  /* ================= FETCH RIDES ================= */

  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/api/rides");

        if (!response.ok) {
          throw new Error("Failed to fetch rides.");
        }

        const data = await response.json();

        console.log("📥 All rides:", data);

        /* ================= FILTER ================= */

        let filteredRides = data;

        if (selectedFrom && selectedTo) {
          filteredRides = data.filter(
            (ride) =>
              ride.from?.trim().toLowerCase() ===
                selectedFrom.trim().toLowerCase() &&
              ride.to?.trim().toLowerCase() ===
                selectedTo.trim().toLowerCase() &&
              ride.status === "available" &&
              Number(ride.seats) > 0,
          );
        } else {
          filteredRides = data.filter(
            (ride) => ride.status === "available" && Number(ride.seats) > 0,
          );
        }

        console.log("🎯 Filtered rides:", filteredRides);

        setRides(filteredRides);
      } catch (err) {
        console.error("❌ Fetch rides error:", err);

        setError("Unable to load available rides.");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [selectedFrom, selectedTo]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Header */}

      <header className="w-full bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[1000px] mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            to="/home"
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition text-[#1D1D1D]"
          >
            <BackIcon />
          </Link>

          <div className="flex items-center gap-2">
            <CarIcon />

            <h1 className="text-[30px] font-bold tracking-tight">
              <span className="text-[#1D1D1D]">zy</span>

              <span className="text-[#8EB800]">Go</span>
            </h1>
          </div>

          <div className="w-10" />
        </div>
      </header>

      {/* Content */}

      <main className="w-full max-w-[1000px] mx-auto px-6 py-8">
        <div className="mb-7">
          <h2 className="text-[28px] font-extrabold text-[#1D1D1D]">
            Available Rides
          </h2>

          <p className="text-[14px] text-[#6B7280] mt-1">
            Choose a ride that works best for you.
          </p>
        </div>

        {/* Search Summary */}

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* FROM */}

            <div className="flex items-center gap-3">
              <MapPinIcon />

              <div>
                <p className="text-[11px] text-[#9CA3AF]">From</p>

                <p className="text-[14px] font-semibold text-[#1D1D1D]">
                  {selectedFrom || "All locations"}
                </p>
              </div>
            </div>

            {/* TO */}

            <div className="flex items-center gap-3">
              <MapPinIcon />

              <div>
                <p className="text-[11px] text-[#9CA3AF]">To</p>

                <p className="text-[14px] font-semibold text-[#1D1D1D]">
                  {selectedTo || "All destinations"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}

        {loading && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center">
            <p className="text-[14px] text-[#6B7280]">
              Loading available rides...
            </p>
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="bg-white border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-[14px] text-red-500">{error}</p>
          </div>
        )}

        {/* No rides */}

        {!loading && !error && rides.length === 0 && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center">
            <p className="text-[14px] text-[#6B7280]">
              {selectedFrom && selectedTo
                ? `No rides found from ${selectedFrom} to ${selectedTo}.`
                : "No available rides found."}
            </p>

            <Link
              to="/home"
              className="inline-block mt-5 bg-[#8EB800] hover:bg-[#7AA300] text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              Change Location
            </Link>
          </div>
        )}

        {/* Ride List */}

        {!loading && !error && rides.length > 0 && (
          <div className="flex flex-col gap-5">
            {rides.map((ride) => (
              <RideCard key={ride._id} ride={ride} />
            ))}
          </div>
        )}

        {/* Footer */}

        {!loading && !error && rides.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-[12px] text-[#9CA3AF]">
              Showing {rides.length} available{" "}
              {rides.length === 1 ? "ride" : "rides"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AvailableRides;
