import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

/* ========================= ICONS ========================= */

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

/* ========================= RIDE CARD ========================= */

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

  const driverGender = ride.driver?.gender?.toLowerCase();

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#8EB800] transition">
      {/* Driver */}

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-full bg-[#EAF4D4] flex items-center justify-center text-[#8EB800] shrink-0">
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

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
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

            {driverGender === "female" && (
              <span className="inline-block mt-2 px-2.5 py-1 rounded-full bg-[#F4FBE8] text-[#729600] text-[11px] font-semibold">
                Female driver
              </span>
            )}
          </div>
        </div>

        <div className="text-right shrink-0">
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
                {ride.from || "Unknown"}
              </p>
            </div>

            <div>
              <p className="text-[12px] text-[#9CA3AF]">Destination</p>

              <p className="text-[14px] font-semibold text-[#1D1D1D]">
                {ride.to || "Unknown"}
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
              {ride.date || "Date unavailable"}
              {ride.time ? `, ${ride.time}` : ""}
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
        type="button"
        onClick={handleBook}
        className="w-full mt-5 bg-[#8EB800] hover:bg-[#7AA300] text-white font-semibold text-[14px] py-3.5 rounded-xl transition"
      >
        Book This Ride
      </button>
    </div>
  );
};

/* ========================= MAIN COMPONENT ========================= */

const AvailableRides = () => {
  const location = useLocation();

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preferenceNotice, setPreferenceNotice] = useState("");

  /* ================= SELECTED LOCATIONS ================= */

  const searchParams = new URLSearchParams(location.search);

  const selectedFrom = searchParams.get("from") || "";
  const selectedTo = searchParams.get("to") || "";

  /* ================= FETCH AND FILTER RIDES ================= */

  useEffect(() => {
    let cancelled = false;

    const fetchRides = async () => {
      try {
        setLoading(true);
        setError("");
        setPreferenceNotice("");

        /* ---------- Load rides ---------- */

        const response = await fetch("http://localhost:5000/api/rides");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch rides.");
        }

        if (!Array.isArray(data)) {
          throw new Error("Invalid rides response from backend.");
        }

        console.log("📥 All rides:", data);

        /* ---------- Filter route and availability ---------- */

        let routeRides = data.filter(
          (ride) => ride.status === "available" && Number(ride.seats) > 0,
        );

        if (selectedFrom && selectedTo) {
          routeRides = routeRides.filter(
            (ride) =>
              ride.from?.trim().toLowerCase() ===
                selectedFrom.trim().toLowerCase() &&
              ride.to?.trim().toLowerCase() === selectedTo.trim().toLowerCase(),
          );
        }

        /* ---------- Load logged-in user's preference ---------- */

        let preference = "off";

        try {
          const storedUser = localStorage.getItem("user");
          const user = storedUser ? JSON.parse(storedUser) : null;
          const userId = user?.id || user?._id;

          if (userId) {
            const preferenceResponse = await fetch(
              `http://localhost:5000/api/safety/${userId}`,
            );

            if (preferenceResponse.ok) {
              const safetyData = await preferenceResponse.json();

              const savedPreference = safetyData.femaleDriverPreference;

              if (["always", "available", "off"].includes(savedPreference)) {
                preference = savedPreference;
              } else if (typeof savedPreference === "boolean") {
                preference = savedPreference ? "always" : "off";
              }
            }
          }
        } catch (preferenceError) {
          console.error("Failed to load driver preference:", preferenceError);
        }

        /* ---------- Apply female driver preference ---------- */

        const femaleRides = routeRides.filter(
          (ride) => ride.driver?.gender?.toLowerCase() === "female",
        );

        let filteredRides = routeRides;
        let notice = "";

        if (preference === "always") {
          // Only female-driver rides are shown.
          filteredRides = femaleRides;

          if (routeRides.length > 0 && femaleRides.length === 0) {
            notice =
              "No rides with female drivers are available on this route. Try another route or change your preference.";
          }
        } else if (preference === "available") {
          // Female rides first, then other matching rides.
          if (femaleRides.length > 0) {
            const femaleRideIds = new Set(
              femaleRides.map((ride) => String(ride._id)),
            );

            const otherRides = routeRides.filter(
              (ride) => !femaleRideIds.has(String(ride._id)),
            );

            filteredRides = [...femaleRides, ...otherRides];

            notice = "Female-driver rides are shown first.";
          } else if (routeRides.length > 0) {
            notice =
              "No female-driver rides are available on this route. Showing other available rides.";
          }
        }

        if (!cancelled) {
          console.log("🎯 Driver preference:", preference);
          console.log("🎯 Filtered rides:", filteredRides);

          setPreferenceNotice(notice);
          setRides(filteredRides);
        }
      } catch (err) {
        console.error("❌ Fetch rides error:", err);

        if (!cancelled) {
          setError(err.message || "Unable to load available rides.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchRides();

    return () => {
      cancelled = true;
    };
  }, [selectedFrom, selectedTo]);

  /* ================= PAGE ================= */

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Header */}

      <header className="w-full bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
          <Link
            to="/home"
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Back to Home"
          >
            <BackIcon />
          </Link>

          <h1 className="text-[28px] md:text-[36px] font-bold tracking-tight">
            <span className="text-[#1D1D1D]">Available </span>
            <span className="text-[#8EB800]">Rides</span>
          </h1>

          <div className="w-10" />
        </div>
      </header>

      {/* Main */}

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-8 py-8">
        {/* Page title */}

        <div className="mb-7">
          <h2 className="text-[24px] md:text-[28px] font-extrabold text-[#1D1D1D]">
            Find your ride
          </h2>

          <p className="text-[14px] text-[#6B7280] mt-2">
            Choose a ride that matches your route and preferences.
          </p>
        </div>

        {/* Selected Route */}

        {(selectedFrom || selectedTo) && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-[12px] text-[#9CA3AF] mb-2">
                  SELECTED ROUTE
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-2 rounded-lg bg-[#F4FBE8] text-[#729600] text-[14px] font-semibold">
                    {selectedFrom || "Any pickup"}
                  </span>

                  <span className="text-[#8EB800] font-bold">→</span>

                  <span className="px-3 py-2 rounded-lg bg-[#F4FBE8] text-[#729600] text-[14px] font-semibold">
                    {selectedTo || "Any destination"}
                  </span>
                </div>
              </div>

              <Link
                to="/home"
                className="text-[13px] font-semibold text-[#729600] hover:underline"
              >
                Change route
              </Link>
            </div>
          </div>
        )}

        {/* Preference Notice */}

        {preferenceNotice && (
          <div className="mb-6 rounded-xl border border-[#DCE9BB] bg-[#F4FBE8] p-4 text-[14px] text-[#536B13]">
            {preferenceNotice}
          </div>
        )}

        {/* Loading */}

        {loading && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center">
            <div className="w-9 h-9 border-4 border-[#DCE9BB] border-t-[#8EB800] rounded-full animate-spin mx-auto mb-4" />

            <p className="text-[15px] font-medium text-[#4B5563]">
              Loading available rides...
            </p>
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="bg-white border border-red-200 rounded-2xl p-8 text-center">
            <h3 className="text-[18px] font-bold text-red-600">
              Unable to load rides
            </h3>

            <p className="text-[14px] text-[#6B7280] mt-2">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 px-5 py-3 rounded-xl bg-[#8EB800] hover:bg-[#7AA300] text-white font-semibold text-[14px]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Ride List */}

        {!loading && !error && rides.length > 0 && (
          <>
            <div className="flex items-center justify-between gap-3 mb-5">
              <h3 className="text-[18px] font-bold text-[#1D1D1D]">
                {rides.length} {rides.length === 1 ? "Ride" : "Rides"} Found
              </h3>

              <span className="text-[12px] text-[#6B7280]">
                Available seats only
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rides.map((ride) => (
                <RideCard key={ride._id} ride={ride} />
              ))}
            </div>
          </>
        )}

        {/* Empty State */}

        {!loading && !error && rides.length === 0 && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-[#F4FBE8] rounded-2xl flex items-center justify-center mx-auto mb-5">
              <MapPinIcon />
            </div>

            <h3 className="text-[20px] font-bold text-[#1D1D1D]">
              No matching rides found
            </h3>

            <p className="text-[14px] leading-6 text-[#6B7280] mt-3 max-w-md mx-auto">
              {selectedFrom && selectedTo
                ? `No rides are currently available from ${selectedFrom} to ${selectedTo} that match your driver preference.`
                : "There are no available rides matching your current preference."}
            </p>

            <Link
              to="/home"
              className="inline-flex items-center justify-center mt-6 px-6 py-3 rounded-xl bg-[#8EB800] hover:bg-[#7AA300] text-white font-semibold text-[14px] transition"
            >
              Change Route
            </Link>
          </div>
        )}
      </main>

      {/* Bottom spacing */}

      <footer className="w-full border-t border-[#E5E7EB] bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-4 text-center text-[12px] text-[#9CA3AF]">
          zyGo · Safe and comfortable rides
        </div>
      </footer>
    </div>
  );
};

export default AvailableRides;
