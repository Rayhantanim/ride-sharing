const express = require("express");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET logged-in user's profile
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "fullName phone email gender role verificationStatus vehicle rating totalRides isOnline isDriver createdAt",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Load profile error:", error);
    res.status(500).json({
      success: false,
      message: "Could not load profile",
    });
  }
});

// Update logged-in user's profile
router.patch("/me", protect, async (req, res) => {
  try {
    const { fullName, phone, gender } = req.body;
    const updates = {};

    if (fullName !== undefined) {
      if (typeof fullName !== "string" || !fullName.trim()) {
        return res.status(400).json({
          success: false,
          message: "Full name is required",
        });
      }
      updates.fullName = fullName.trim();
    }

    if (phone !== undefined) {
      if (typeof phone !== "string" || !phone.trim()) {
        return res.status(400).json({
          success: false,
          message: "Phone number is required",
        });
      }
      updates.phone = phone.trim();
    }

    if (gender !== undefined) {
      const allowed = ["male", "female", "other", "prefer_not_to_say"];

      if (!allowed.includes(gender)) {
        return res.status(400).json({
          success: false,
          message: "Invalid gender",
        });
      }
      updates.gender = gender;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No profile changes provided",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select(
      "fullName phone email gender role verificationStatus vehicle rating totalRides isOnline isDriver createdAt",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This phone number is already registered",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((item) => item.message)
          .join(", "),
      });
    }

    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Could not update profile",
    });
  }
});

module.exports = router;
