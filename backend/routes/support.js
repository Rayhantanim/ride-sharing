const express = require("express");
const router = express.Router();
const SupportRequest = require("../models/SupportRequest");
// Submit a support request
router.post("/", async (req, res) => {
  try {
    const { userId, type, subject, description, rideId } = req.body;

    if (!userId || !type || !subject?.trim() || !description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const request = await SupportRequest.create({
      userId,
      type,
      subject: subject.trim(),
      description: description.trim(),
      rideId: rideId || "",
    });

    res.status(201).json({
      success: true,
      message: "Your support request was submitted successfully.",
      request,
    });
  } catch (error) {
    console.error("Support submission error:", error);

    res.status(500).json({
      success: false,
      message: "Could not submit your request. Please try again.",
    });
  }
});

// Get a user's support requests
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required.",
      });
    }

    const requests = await SupportRequest.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Support history error:", error);

    res.status(500).json({
      success: false,
      message: "Could not load support requests.",
    });
  }
});

/* DELETE a user's own support request */
router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required.",
      });
    }

    const request = await SupportRequest.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Support request not found.",
      });
    }

    res.json({
      success: true,
      message: "Support request deleted successfully.",
    });
  } catch (error) {
    console.error("Support delete error:", error);

    res.status(500).json({
      success: false,
      message: "Could not delete support request.",
    });
  }
});

module.exports = router;
