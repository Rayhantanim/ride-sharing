const express = require("express");
const Ride = require("../models/Ride");

const router = express.Router();

/* ================= CREATE A NEW RIDE ================= */

router.post("/", async (req, res) => {
  try {
    const { driver, from, to, date, time, seats, price } = req.body;

    const ride = new Ride({
      driver,
      from,
      to,
      date,
      time,
      seats,
      price,
    });

    await ride.save();

    const populatedRide = await Ride.findById(ride._id).populate(
      "driver",
      "fullName phone email gender",
    );

    res.status(201).json({
      message: "Ride created successfully",
      ride: populatedRide,
    });
  } catch (error) {
    console.error("❌ CREATE RIDE ERROR:", error);

    res.status(500).json({
      message: "Failed to create ride",
      error: error.message,
    });
  }
});

/* ================= GET AVAILABLE RIDES ================= */

router.get("/", async (req, res) => {
  try {
    const rides = await Ride.find({
      status: "available",
      seats: { $gt: 0 },
    })
      .populate("driver", "fullName phone email gender")
      .sort({ createdAt: -1 });

    res.status(200).json(rides);
  } catch (error) {
    console.error("❌ GET RIDES ERROR:", error);

    res.status(500).json({
      message: "Failed to get rides",
      error: error.message,
    });
  }
});

module.exports = router;
