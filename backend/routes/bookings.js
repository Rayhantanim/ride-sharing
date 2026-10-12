const express = require("express");
const Booking = require("../models/Booking");
const Ride = require("../models/Ride");

const router = express.Router();

// ================= CREATE BOOKING =================
router.post("/", async (req, res) => {
  try {
    const { ride: rideId, passenger, seats } = req.body;

    console.log("📥 BOOKING REQUEST:", {
      rideId,
      passenger,
      seats,
    });

    if (!rideId || !passenger || !seats) {
      return res.status(400).json({
        message: "Ride, passenger and seats are required.",
      });
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found.",
      });
    }

    if (ride.status !== "available") {
      return res.status(400).json({
        message: "This ride is not available.",
      });
    }

    if (ride.seats < seats) {
      return res.status(400).json({
        message: "Not enough seats available.",
      });
    }

    const booking = new Booking({
      ride: rideId,
      passenger,
      seats,
    });

    const savedBooking = await booking.save();

    // ================= DEBUG =================
    console.log("=================================");
    console.log("✅ BOOKING SAVED SUCCESSFULLY");
    console.log("📦 DATABASE:", Booking.db.name);
    console.log("📁 COLLECTION:", Booking.collection.name);
    console.log("🆔 BOOKING ID:", savedBooking._id);
    console.log("👤 PASSENGER:", savedBooking.passenger);
    console.log("🚗 RIDE:", savedBooking.ride);
    console.log("💺 SEATS:", savedBooking.seats);
    console.log("=================================");

    // Reduce available seats
    ride.seats -= seats;

    if (ride.seats === 0) {
      ride.status = "booked";
    }

    await ride.save();

    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate("ride")
      .populate("passenger", "fullName phone email");

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("❌ CREATE BOOKING ERROR:", error);

    res.status(500).json({
      message: "Failed to create booking",
      error: error.message,
    });
  }
});

// ================= GET ALL BOOKINGS =================
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("ride")
      .populate("passenger", "fullName phone email")
      .sort({ createdAt: -1 });

    console.log("📋 GET BOOKINGS");
    console.log("📦 DATABASE:", Booking.db.name);
    console.log("📁 COLLECTION:", Booking.collection.name);
    console.log("🔢 COUNT:", bookings.length);

    res.status(200).json(bookings);
  } catch (error) {
    console.error("❌ GET BOOKINGS ERROR:", error);

    res.status(500).json({
      message: "Failed to get bookings",
      error: error.message,
    });
  }
});

// ================= DEBUG TEST =================
router.get("/test", async (req, res) => {
  try {
    const bookings = await Booking.find();

    res.status(200).json({
      database: Booking.db.name,
      collection: Booking.collection.name,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("❌ TEST ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// ================= GET SINGLE BOOKING =================
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("ride")
      .populate("passenger", "fullName phone email");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("❌ GET SINGLE BOOKING ERROR:", error);

    res.status(500).json({
      message: "Failed to get booking",
      error: error.message,
    });
  }
});

// ================= CANCEL BOOKING =================
router.patch("/:id/cancel", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Booking is already cancelled.",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    const ride = await Ride.findById(booking.ride);

    if (ride) {
      ride.seats += booking.seats;
      ride.status = "available";

      await ride.save();
    }

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("❌ CANCEL BOOKING ERROR:", error);

    res.status(500).json({
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
});

module.exports = router;
