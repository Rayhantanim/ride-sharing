const express = require("express");
const mongoose = require("mongoose");
const SavedPlace = require("../models/SavedPlace");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

// Save a place
router.post("/", protect, async (req, res) => {
  try {
    const { name, address, latitude = null, longitude = null } = req.body;

    if (!name?.trim() || !address?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Place name and address are required",
      });
    }

    const validCoordinate = (value) =>
      value === null ||
      value === "" ||
      (typeof value === "number" && Number.isFinite(value));

    if (
      !validCoordinate(latitude) ||
      !validCoordinate(longitude) ||
      (latitude !== null &&
        latitude !== "" &&
        (latitude < -90 || latitude > 90)) ||
      (longitude !== null &&
        longitude !== "" &&
        (longitude < -180 || longitude > 180))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid map coordinates",
      });
    }

    const place = await SavedPlace.create({
      user: req.user._id,
      name: name.trim(),
      address: address.trim(),
      latitude: latitude === "" ? null : latitude,
      longitude: longitude === "" ? null : longitude,
    });

    res.status(201).json({ success: true, place });
  } catch (error) {
    console.error("Save place error:", error);
    res.status(500).json({ success: false, message: "Could not save place" });
  }
});

// Get only the logged-in user's saved places
router.get("/", protect, async (req, res) => {
  try {
    const places = await SavedPlace.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, places });
  } catch (error) {
    console.error("Get saved places error:", error);
    res
      .status(500)
      .json({ success: false, message: "Could not load saved places" });
  }
});

// Delete a saved place owned by the logged-in user
router.delete("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid place ID" });
    }

    const place = await SavedPlace.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Saved place not found",
      });
    }

    res.json({ success: true, message: "Place deleted successfully" });
  } catch (error) {
    console.error("Delete saved place error:", error);
    res
      .status(500)
      .json({ success: false, message: "Could not delete saved place" });
  }
});

module.exports = router;
