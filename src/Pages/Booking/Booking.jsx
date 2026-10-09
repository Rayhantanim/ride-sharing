import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SAFETY_API = "http://localhost:5000/api/safety";
const BOOKING_API = "http://localhost:5000/api/bookings";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

// Supports times such as "22:00", "10:00 PM", and "10 PM".
const getRideHour = (timeValue) => {
  if (typeof timeValue !== "string" || !timeValue.trim()) {
    return null;
  }

  const time = timeValue
    .trim()
    .split(/\s*[-–—]\s*/)[0]
    .trim();

  const match = time.match(/^(\d{1,2})(?::(\d{2}))?(?::\d{2})?\s*(AM|PM)?$/i);

  if (!match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2] || 0);
  const period = match[3]?.toUpperCase();

  if (minute > 59) return null;

  if (period) {
    if (hour < 1 || hour > 12) return null;

    if (period === "AM") {
      if (hour === 12) hour = 0;
    } else if (hour !== 12) {
      hour += 12;
    }
  } else if (hour > 23) {
    return null;
  }

  return hour;
};

const isLateNightRide = (timeValue) => {
  const hour = getRideHour(timeValue);

  return hour !== null && (hour >= 22 || hour < 5);
};

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const ride = location.state?.ride;

  const [seats, setSeats] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const [automatedNightMode, setAutomatedNightMode] = useState(false);
  const [safetySettingsLoading, setSafetySettingsLoading] = useState(true);

  // Load Night Mode setting for the logged-in user.
  useEffect(() => {
    let cancelled = false;

    const loadNightMode = async () => {
      const user = getStoredUser();
      const userId = user?.id || user?._id;

      if (!userId) {
        setSafetySettingsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${SAFETY_API}/${userId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load safety settings.");
        }

        const safety = data.safety || data.data || data;

        if (!cancelled) {
          setAutomatedNightMode(safety?.automatedNightMode === true);
        }
      } catch (error) {
        console.error("Could not load Night Mode:", error);
      } finally {
        if (!cancelled) {
          setSafetySettingsLoading(false);
        }
      }
    };

    loadNightMode();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ride) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-md w-full">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#F1F6DC] flex items-center justify-center text-2xl">
            🚗
          </div>

          <h2 className="text-xl font-bold text-[#1D1D1D] mt-5">
            No ride selected
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Please choose a ride before continuing.
          </p>

          <button
            onClick={() => navigate("/available-rides")}
            className="mt-6 bg-[#8EB800] hover:bg-[#7aa300] text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Back to Available Rides
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = Number(ride.price) * seats;

  const nightRide = isLateNightRide(ride.time);

  const showNightModeReminder = automatedNightMode && nightRide;

  // ================= CONFIRM BOOKING =================
  const handleConfirmBooking = async () => {
    try {
      setBookingLoading(true);
      setBookingError("");

      if (safetySettingsLoading) {
        setBookingError("Please wait while your safety settings are loading.");
        return;
      }

      const user = getStoredUser();
      const userId = user?.id || user?._id;

      if (!user) {
        setBookingError("Please login before booking a ride.");
        return;
      }

      if (!userId) {
        setBookingError("User information is missing. Please login again.");
        return;
      }

      if (!ride?._id) {
        setBookingError("Ride ID is missing. Please select the ride again.");
        return;
      }

      if (!Number.isInteger(seats) || seats < 1) {
        setBookingError("Please select a valid number of seats.");
        return;
      }

      if (seats > Number(ride.seats)) {
        setBookingError("The selected number of seats is no longer available.");
        return;
      }

      const bookingData = {
        ride: ride._id,
        passenger: userId,
        seats,
      };

      const response = await fetch(BOOKING_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking.");
      }

      if (showNightModeReminder) {
        window.alert(
          "Ride booked successfully!\n\n" +
            "Automated Night Mode is enabled. " +
            "Please review your safety reminders and Trusted Circle.",
        );
      } else {
        window.alert("Ride booked successfully!");
      }

      navigate("/ride-management");
    } catch (error) {
      console.error("Booking error:", error);

      setBookingError(
        error.message || "Something went wrong. Please try again.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1D1D1D]">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="h-[92px] flex items-center justify-between relative">
            <button
              onClick={() => navigate("/available-rides")}
              aria-label="Go back"
              className="w-11 h-11 rounded-xl flex items-center justify-center text-[#1D1D1D] hover:bg-gray-100 transition"
            >
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
            </button>

            <div className="absolute left-1/2 -translate-x-1/2">
              <span className="text-[28px] font-extrabold tracking-tight text-[#8EB800]">
                zyGo
              </span>
            </div>

            <div className="w-11 h-11"></div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="mb-7">
          <h1 className="text-3xl font-bold tracking-tight">Book Your Ride</h1>

          <p className="text-gray-500 text-sm mt-2">
            Review your ride details and confirm your booking.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-5">
            {/* DRIVER */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold mb-5">Driver & Vehicle</h2>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                  {ride.driver?.gender?.toLowerCase() === "female"
                    ? "👩🏻"
                    : "👨🏻"}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {typeof ride.driver === "object"
                      ? ride.driver?.fullName ||
                        ride.driver?.name ||
                        ride.driver?.email ||
                        "Driver"
                      : ride.driver || "Driver"}
                  </h3>

                  {ride.driver?.gender?.toLowerCase() === "female" && (
                    <span className="inline-block mt-1 text-xs font-semibold text-[#648300] bg-[#F1F6DC] px-2 py-1 rounded-full">
                      Female Driver
                    </span>
                  )}

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium">
                      {ride.rating || "4.5"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 bg-[#F8F9FA] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Vehicle</p>
                    <p className="font-semibold mt-1">{ride.car || "Car"}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {ride.color || "White"} • {ride.plate || "N/A"}
                    </p>
                  </div>

                  <div className="text-3xl">🚙</div>
                </div>
              </div>
            </div>

            {/* TRIP */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold mb-6">Trip Details</h2>

              <div className="flex gap-4">
                <div className="flex flex-col items-center pt-1">
                  <div className="w-3 h-3 rounded-full border-[3px] border-[#8EB800]"></div>
                  <div className="w-[2px] h-14 bg-gray-200"></div>
                  <div className="w-3 h-3 rounded-full bg-[#8EB800]"></div>
                </div>

                <div className="flex-1">
                  <div>
                    <p className="text-xs text-gray-400">PICKUP</p>
                    <p className="font-semibold mt-1">{ride.from}</p>
                  </div>

                  <div className="mt-8">
                    <p className="text-xs text-gray-400">DESTINATION</p>
                    <p className="font-semibold mt-1">{ride.to}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 mt-6 pt-5 grid grid-cols-2 gap-5">
                <div>
                  <p className="text-xs text-gray-400">DATE</p>
                  <p className="font-semibold mt-1">{ride.date || "Today"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">TIME</p>
                  <p className="font-semibold mt-1">{ride.time}</p>
                </div>
              </div>
            </div>

            {/* NIGHT MODE REMINDER */}
            {showNightModeReminder && (
              <div className="bg-[#F7F2FF] border border-purple-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-white flex items-center justify-center text-xl">
                    🌙
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-purple-900">
                      Automated Night Mode is active
                    </h2>

                    <p className="text-sm text-purple-800 mt-2">
                      This ride is scheduled during late-night hours. Check your
                      trip details and review your safety plan before
                      travelling.
                    </p>

                    <div className="bg-white rounded-xl p-4 mt-4">
                      <p className="text-sm font-semibold text-gray-800">
                        Before your ride
                      </p>

                      <ul className="text-sm text-gray-600 mt-2 space-y-2 list-disc pl-5">
                        <li>Confirm your pickup and destination.</li>
                        <li>Keep your phone charged and accessible.</li>
                        <li>
                          Consider sharing your trip details with a trusted
                          contact.
                        </li>
                        <li>Keep the SOS option accessible in an emergency.</li>
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/trusted-circle")}
                      className="mt-4 bg-purple-700 hover:bg-purple-800 text-white font-semibold px-4 py-3 rounded-xl transition"
                    >
                      Review Trusted Circle
                    </button>

                    <p className="text-xs text-purple-700 mt-3">
                      This reminder does not automatically share your live
                      location or send alerts.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* NIGHT MODE OFF OR SETTINGS STILL LOADING */}
            {safetySettingsLoading && (
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-sm text-gray-500">
                Checking your safety settings...
              </div>
            )}

            {/* PASSENGERS */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Passengers</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Select number of seats.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSeats(Math.max(1, seats - 1))}
                    disabled={bookingLoading}
                    className="w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 font-semibold disabled:opacity-50"
                  >
                    −
                  </button>

                  <span className="w-5 text-center font-semibold">{seats}</span>

                  <button
                    onClick={() =>
                      setSeats(Math.min(Number(ride.seats), seats + 1))
                    }
                    disabled={bookingLoading || seats >= Number(ride.seats)}
                    className="w-9 h-9 rounded-lg bg-[#8EB800] hover:bg-[#7aa300] text-white font-semibold disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-4">
                {ride.seats} seats available
              </p>
            </div>
          </div>

          {/* RIGHT: BOOKING SUMMARY */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-6">
              <h2 className="text-lg font-bold">Booking Summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ride fare</span>
                  <span className="font-medium">
                    ${Number(ride.price).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Seats</span>
                  <span className="font-medium">{seats}</span>
                </div>

                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold">
                    ${Number(totalPrice).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* PAYMENT */}
              <div className="mt-6">
                <p className="text-xs text-gray-400 mb-2">PAYMENT METHOD</p>

                <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                      💳
                    </div>

                    <div>
                      <p className="text-sm font-semibold">Visa</p>
                      <p className="text-xs text-gray-400">•••• 4242</p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[#7A9900]">
                    Default
                  </span>
                </div>
              </div>

              {/* SAFETY */}
              <div className="mt-5 bg-[#F7F9EE] rounded-xl p-4">
                <div className="flex gap-3">
                  <span>🛡️</span>

                  <div>
                    <p className="text-sm font-semibold">Safe & secure</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Your ride is protected by zyGo safety features.
                    </p>
                  </div>
                </div>
              </div>

              {/* ERROR */}
              {bookingError && (
                <div className="mt-5 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
                  {bookingError}
                </div>
              )}

              {/* CONFIRM */}
              <button
                onClick={handleConfirmBooking}
                disabled={bookingLoading || safetySettingsLoading}
                className="w-full mt-6 bg-[#8EB800] hover:bg-[#7aa300] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-sm transition"
              >
                {safetySettingsLoading
                  ? "Checking Safety Settings..."
                  : bookingLoading
                    ? "Booking..."
                    : "Confirm & Book Ride"}
              </button>

              <p className="text-[11px] text-gray-400 text-center mt-3">
                You can cancel your booking according to the ride policy.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;
