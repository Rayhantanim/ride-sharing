const express = require("express");
const ScheduledRide = require("../models/ScheduledRide");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a scheduled ride
router.post("/", protect, async (req, res) => {
  try {
    const {
      pickup,
      destination,
      scheduledAt,
      seats = 1,
      notes = "",
    } = req.body;

    if (!pickup?.trim() || !destination?.trim() || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "Pickup, destination and scheduled date/time are required",
      });
    }

    const date = new Date(scheduledAt);

    if (Number.isNaN(date.getTime()) || date <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Scheduled date/time must be in the future",
      });
    }

    if (!Number.isInteger(Number(seats)) || Number(seats) < 1) {
      return res.status(400).json({
        success: false,
        message: "Seats must be a positive whole number",
      });
    }

    const ride = await ScheduledRide.create({
      user: req.user._id,
      pickup: pickup.trim(),
      destination: destination.trim(),
      scheduledAt: date,
      seats: Number(seats),
      notes: typeof notes === "string" ? notes.trim() : "",
    });

    res.status(201).json({ success: true, ride });
  } catch (error) {
    console.error("Create scheduled ride error:", error);
    res
      .status(500)
      .json({ success: false, message: "Could not schedule ride" });
  }
});

// Get only the logged-in user's scheduled rides
router.get("/", protect, async (req, res) => {
  try {
    const rides = await ScheduledRide.find({ user: req.user._id }).sort({
      scheduledAt: 1,
    });

    res.json({ success: true, rides });
  } catch (error) {
    console.error("Get scheduled rides error:", error);
    res
      .status(500)
      .json({ success: false, message: "Could not load scheduled rides" });
  }
});

// Cancel a scheduled ride owned by the logged-in user
router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const ride = await ScheduledRide.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
        status: "scheduled",
      },
      { status: "cancelled" },
      { new: true, runValidators: true },
    );

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Scheduled ride not found or cannot be cancelled",
      });
    }

    res.json({ success: true, ride });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ride ID" });
    }

    console.error("Cancel scheduled ride error:", error);
    res
      .status(500)
      .json({ success: false, message: "Could not cancel scheduled ride" });
  }
});

module.exports = router;
