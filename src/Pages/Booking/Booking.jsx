import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const ride = location.state?.ride;

  const [seats, setSeats] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

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

  const totalPrice = ride.price * seats;

  // ================= CONFIRM BOOKING =================
  const handleConfirmBooking = async () => {
    try {
      setBookingLoading(true);
      setBookingError("");

      console.log("🚀 Confirm Booking clicked");
      console.log("🚗 Ride:", ride);

      // ================= GET LOGGED-IN USER =================
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setBookingError("Please login before booking a ride.");
        setBookingLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);

      console.log("👤 Logged-in user:", user);

      if (!user?.id) {
        setBookingError("User information is missing. Please login again.");
        setBookingLoading(false);
        return;
      }

      // ================= CHECK RIDE ID =================
      if (!ride?._id) {
        console.error("❌ Ride ID missing:", ride);

        setBookingError(
          "Ride ID is missing. Please go back and select the ride again.",
        );

        setBookingLoading(false);
        return;
      }

      // ================= SEND BOOKING TO BACKEND =================
      const bookingData = {
        ride: ride._id,
        passenger: user.id,
        seats: seats,
      };

      console.log("📤 Sending booking to backend:", bookingData);

      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      console.log("📡 Backend response status:", response.status);

      const data = await response.json();

      console.log("📥 Backend response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking.");
      }

      // ================= SUCCESS =================
      console.log("✅ BOOKING SUCCESSFUL");
      console.log("📝 Booking:", data.booking);

      alert("Ride booked successfully!");

      navigate("/ride-management");
    } catch (error) {
      console.error("❌ BOOKING ERROR:", error);

      setBookingError(
        error.message || "Something went wrong. Please try again.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1D1D1D]">
      {/* ================= HEADER ================= */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="h-[92px] flex items-center justify-between relative">
            {/* BACK BUTTON */}
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

            {/* CENTER BRAND */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <span className="text-[28px] font-extrabold tracking-tight text-[#8EB800]">
                zyGo
              </span>
            </div>

            {/* EMPTY SPACE */}
            <div className="w-11 h-11"></div>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        {/* TITLE */}
        <div className="mb-7">
          <h1 className="text-3xl font-bold tracking-tight">Book Your Ride</h1>

          <p className="text-gray-500 text-sm mt-2">
            Review your ride details and confirm your booking.
          </p>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ================= LEFT ================= */}
          <div className="lg:col-span-2 space-y-5">
            {/* DRIVER */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold mb-5">Driver & Vehicle</h2>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                  👨🏻
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
                    onClick={() => setSeats(Math.min(ride.seats, seats + 1))}
                    disabled={bookingLoading}
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

          {/* ================= RIGHT - SUMMARY ================= */}
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
                disabled={bookingLoading}
                className="w-full mt-6 bg-[#8EB800] hover:bg-[#7aa300] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-sm transition"
              >
                {bookingLoading ? "Booking..." : "Confirm & Book Ride"}
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
