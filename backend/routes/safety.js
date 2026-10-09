const express = require("express");
const mongoose = require("mongoose");
const Safety = require("../models/Safety");
const AutoBlockHistory = require("../models/AutoBlockHistory");
const router = express.Router();

/* =====================================================
   HELPER
===================================================== */

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/* =====================================================
   GET SAFETY PROFILE
   GET /api/safety/:userId
===================================================== */

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID.",
      });
    }

    let safety = await Safety.findOne({
      user: userId,
    }).populate("user", "fullName phone email");

    if (!safety) {
      safety = await Safety.create({
        user: userId,
      });

      safety = await Safety.findById(safety._id).populate(
        "user",
        "fullName phone email",
      );
    }

    res.status(200).json(safety);
  } catch (error) {
    console.error("GET SAFETY ERROR:", error);

    res.status(500).json({
      message: "Failed to load safety settings.",
      error: error.message,
    });
  }
});

/* =====================================================
   UPDATE SAFETY SETTINGS
   PUT /api/safety/:userId/settings
===================================================== */

router.put("/:userId/settings", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID.",
      });
    }

    const {
      femaleDriverPreference,
      automatedNightMode,
      autoBlockUnsafeDriver,
      comfortFilter,
      comfortPreferences,
      silentSos,
      safetyChecklistCompleted,
      safetyChecklistItems,
      autoShare,
    } = req.body;

    const updateData = {};

    /* ================= GENERAL SETTINGS ================= */

    if (["always", "available", "off"].includes(femaleDriverPreference)) {
      updateData.femaleDriverPreference = femaleDriverPreference;
    }

    if (typeof automatedNightMode === "boolean") {
      updateData.automatedNightMode = automatedNightMode;
    }

    if (typeof autoBlockUnsafeDriver === "boolean") {
      updateData.autoBlockUnsafeDriver = autoBlockUnsafeDriver;
    }

    if (typeof comfortFilter === "boolean") {
      updateData.comfortFilter = comfortFilter;
    }

    if (typeof silentSos === "boolean") {
      updateData.silentSos = silentSos;
    }

    if (typeof autoShare === "boolean") {
      updateData.autoShare = autoShare;
    }

    /* ================= SAFETY CHECKLIST ================= */

    if (Array.isArray(safetyChecklistItems)) {
      const validItems = [
        ...new Set(
          safetyChecklistItems
            .map(Number)
            .filter((id) => Number.isInteger(id) && id >= 1 && id <= 6),
        ),
      ];

      updateData.safetyChecklistItems = validItems;
      updateData.safetyChecklistCompleted = validItems.length === 6;
    } else if (typeof safetyChecklistCompleted === "boolean") {
      updateData.safetyChecklistCompleted = safetyChecklistCompleted;
    }

    /* ================= COMFORT PREFERENCES ================= */

    if (
      comfortPreferences &&
      typeof comfortPreferences === "object" &&
      !Array.isArray(comfortPreferences)
    ) {
      const validTemperature = ["Cool", "Normal", "Warm"];
      const validConversation = ["Low", "Normal", "Friendly"];

      updateData.comfortPreferences = {
        quietRide:
          typeof comfortPreferences.quietRide === "boolean"
            ? comfortPreferences.quietRide
            : false,

        temperature: validTemperature.includes(comfortPreferences.temperature)
          ? comfortPreferences.temperature
          : "Normal",

        music:
          typeof comfortPreferences.music === "boolean"
            ? comfortPreferences.music
            : false,

        conversation: validConversation.includes(
          comfortPreferences.conversation,
        )
          ? comfortPreferences.conversation
          : "Low",

        smokeFree:
          typeof comfortPreferences.smokeFree === "boolean"
            ? comfortPreferences.smokeFree
            : true,

        extraComfort:
          typeof comfortPreferences.extraComfort === "boolean"
            ? comfortPreferences.extraComfort
            : false,
      };

      updateData.comfortFilter = true;
    }

    /* ================= SAVE SETTINGS ================= */

    const safety = await Safety.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $set: updateData,
        $setOnInsert: {
          user: userId,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Safety settings updated successfully.",
      safety,
    });
  } catch (error) {
    console.error("UPDATE SAFETY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update safety settings.",
      error: error.message,
    });
  }
});

/* =====================================================
   ADD TRUSTED CONTACT
   POST /api/safety/:userId/trusted-circle
===================================================== */

router.post("/:userId/trusted-circle", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, relation } = req.body;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID.",
      });
    }

    if (!name || !phone) {
      return res.status(400).json({
        message: "Name and phone are required.",
      });
    }

    const safety = await Safety.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $setOnInsert: {
          user: userId,
        },
        $push: {
          trustedContacts: {
            name,
            phone,
            relation: relation || "Trusted Contact",
            invited: false,
          },
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    res.status(201).json({
      message: "Trusted contact added successfully.",
      trustedContacts: safety.trustedContacts,
    });
  } catch (error) {
    console.error("ADD TRUSTED CONTACT ERROR:", error);

    res.status(500).json({
      message: "Failed to add trusted contact.",
      error: error.message,
    });
  }
});

/* =====================================================
   INVITE TRUSTED CONTACT
   PATCH /api/safety/:userId/trusted-circle/:contactId/invite
===================================================== */

router.patch("/:userId/trusted-circle/:contactId/invite", async (req, res) => {
  try {
    const { userId, contactId } = req.params;

    if (!isValidObjectId(userId) || !isValidObjectId(contactId)) {
      return res.status(400).json({
        message: "Invalid ID.",
      });
    }

    const safety = await Safety.findOneAndUpdate(
      {
        user: userId,
        "trustedContacts._id": contactId,
      },
      {
        $set: {
          "trustedContacts.$.invited": true,
        },
      },
      {
        new: true,
      },
    );

    if (!safety) {
      return res.status(404).json({
        message: "Trusted contact not found.",
      });
    }

    res.status(200).json({
      message: "Invitation status updated successfully.",
      trustedContacts: safety.trustedContacts,
    });
  } catch (error) {
    console.error("INVITE CONTACT ERROR:", error);

    res.status(500).json({
      message: "Failed to update invitation status.",
      error: error.message,
    });
  }
});

/* =====================================================
   DELETE TRUSTED CONTACT
   DELETE /api/safety/:userId/trusted-circle/:contactId
===================================================== */

router.delete("/:userId/trusted-circle/:contactId", async (req, res) => {
  try {
    const { userId, contactId } = req.params;

    if (!isValidObjectId(userId) || !isValidObjectId(contactId)) {
      return res.status(400).json({
        message: "Invalid ID.",
      });
    }

    const safety = await Safety.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $pull: {
          trustedContacts: {
            _id: contactId,
          },
        },
      },
      {
        new: true,
      },
    );

    if (!safety) {
      return res.status(404).json({
        message: "Safety profile not found.",
      });
    }

    res.status(200).json({
      message: "Trusted contact removed successfully.",
      trustedContacts: safety.trustedContacts,
    });
  } catch (error) {
    console.error("DELETE TRUSTED CONTACT ERROR:", error);

    res.status(500).json({
      message: "Failed to remove trusted contact.",
      error: error.message,
    });
  }
});

/* =====================================================
   CREATE SOS EVENT
   POST /api/safety/:userId/sos
===================================================== */

router.post("/:userId/sos", async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      type = "sos",
      message = "",
      address = "",
      lat = null,
      lng = null,
      rideId = null,
      driverId = null,
    } = req.body;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID.",
      });
    }

    const allowedTypes = ["sos", "silent-sos"];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message: "Invalid SOS type.",
      });
    }

    const event = {
      type,
      message,
      location: {
        address,
        lat,
        lng,
      },
      rideId: rideId || null,
      driverId: driverId || null,
    };

    const safety = await Safety.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $setOnInsert: {
          user: userId,
        },
        $push: {
          events: event,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    const savedEvent = safety.events[safety.events.length - 1];

    console.log("SOS EVENT CREATED");
    console.log("USER:", userId);
    console.log("EVENT:", savedEvent._id);
    console.log("LOCATION:", savedEvent.location);

    res.status(201).json({
      message:
        type === "silent-sos"
          ? "Silent SOS activated successfully."
          : "SOS activated successfully.",
      event: savedEvent,
    });
  } catch (error) {
    console.error("SOS ERROR:", error);

    res.status(500).json({
      message: "Failed to create SOS event.",
      error: error.message,
    });
  }
});

/* =====================================================
   DISCOMFORT REPORT
   POST /api/safety/:userId/discomfort-report
===================================================== */

router.post("/:userId/discomfort-report", async (req, res) => {
  try {
    const { userId } = req.params;
    const { message = "", rideId = null, driverId = null } = req.body;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID.",
      });
    }

    const safety = await Safety.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $setOnInsert: {
          user: userId,
        },
        $push: {
          events: {
            type: "discomfort-report",
            message,
            rideId: rideId || null,
            driverId: driverId || null,
          },
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    res.status(201).json({
      message: "Discomfort report submitted successfully.",
      safety,
    });
  } catch (error) {
    console.error("DISCOMFORT REPORT ERROR:", error);

    res.status(500).json({
      message: "Failed to submit discomfort report.",
      error: error.message,
    });
  }
});

/* =====================================================
   EMERGENCY RIDE SWITCH
   POST /api/safety/:userId/emergency-ride-switch

   action: "request" -> create request event
   action: "cancel"  -> record cancellation within 30s
===================================================== */

router.post("/:userId/emergency-ride-switch", async (req, res) => {
  try {
    const { userId } = req.params;
    const { action, requestId } = req.body;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID.",
      });
    }

    if (!["request", "cancel"].includes(action)) {
      return res.status(400).json({
        message: "Action must be request or cancel.",
      });
    }

    /* ================= CREATE REQUEST ================= */

    if (action === "request") {
      const newRequestId = new mongoose.Types.ObjectId().toString();

      const message = `Emergency ride-switch requested. Request ID: ${newRequestId}`;

      await Safety.findOneAndUpdate(
        {
          user: userId,
        },
        {
          $setOnInsert: {
            user: userId,
          },
          $push: {
            events: {
              type: "emergency-ride-switch-request",
              message,
              rideId: null,
              driverId: null,
            },
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          runValidators: true,
        },
      );

      return res.status(201).json({
        success: true,
        requestId: newRequestId,
        message: "Emergency ride-switch request saved.",
      });
    }

    /* ================= VALIDATE CANCELLATION ================= */

    if (!requestId || !isValidObjectId(requestId)) {
      return res.status(400).json({
        message: "A valid request ID is required for cancellation.",
      });
    }

    const safety = await Safety.findOne({
      user: userId,
    }).select("events");

    if (!safety) {
      return res.status(404).json({
        message: "Safety profile or request not found.",
      });
    }

    const requestMarker = `Request ID: ${requestId}`;

    const originalRequest = safety.events.find(
      (event) =>
        event.type === "emergency-ride-switch-request" &&
        typeof event.message === "string" &&
        event.message.includes(requestMarker),
    );

    if (!originalRequest) {
      return res.status(404).json({
        message: "Emergency ride-switch request not found.",
      });
    }

    const alreadyCancelled = safety.events.some(
      (event) =>
        event.type === "emergency-ride-switch-cancelled" &&
        typeof event.message === "string" &&
        event.message.includes(requestMarker),
    );

    if (alreadyCancelled) {
      return res.status(409).json({
        message: "This request has already been cancelled.",
      });
    }

    /* ================= ENFORCE 30-SECOND WINDOW ================= */

    const requestedAt = originalRequest.createdAt
      ? new Date(originalRequest.createdAt).getTime()
      : NaN;

    if (!Number.isFinite(requestedAt)) {
      return res.status(409).json({
        message:
          "The request timestamp is unavailable; cancellation cannot be verified.",
      });
    }

    const elapsedMilliseconds = Date.now() - requestedAt;

    if (elapsedMilliseconds < 0 || elapsedMilliseconds > 30000) {
      return res.status(409).json({
        message: "The 30-second cancellation window has expired.",
      });
    }

    /* ================= SAVE CANCELLATION ================= */

    const cancellationMessage = `Emergency ride-switch cancelled. Request ID: ${requestId}`;

    await Safety.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $push: {
          events: {
            type: "emergency-ride-switch-cancelled",
            message: cancellationMessage,
            rideId: null,
            driverId: null,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      requestId,
      message: "Emergency ride-switch cancellation recorded.",
    });
  } catch (error) {
    console.error("EMERGENCY RIDE SWITCH ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to process emergency ride-switch request.",
      error: error.message,
    });
  }
});

/* =====================================================
   SAFETY EVENT HISTORY
   GET /api/safety/:userId/events
===================================================== */

router.get("/:userId/events", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID.",
      });
    }

    const safety = await Safety.findOne({
      user: userId,
    }).select("events");

    if (!safety) {
      return res.status(200).json([]);
    }

    const events = [...safety.events].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    res.status(200).json(events);
  } catch (error) {
    console.error("GET SAFETY EVENTS ERROR:", error);

    res.status(500).json({
      message: "Failed to load safety events.",
      error: error.message,
    });
  }
});
// Get saved Auto Block history
router.get("/:userId/auto-block-history", async (req, res) => {
  try {
    const history = await AutoBlockHistory.find({
      userId: req.params.userId,
    })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    res.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Load Auto Block history error:", error);

    res.status(500).json({
      success: false,
      message: "Could not load safety history.",
    });
  }
});

// Save a change to the Auto Block setting
router.post("/:userId/auto-block-history", async (req, res) => {
  try {
    const { enabled } = req.body;

    if (typeof enabled !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "enabled must be true or false.",
      });
    }

    const historyItem = await AutoBlockHistory.create({
      userId: req.params.userId,
      enabled,
    });

    res.status(201).json({
      success: true,
      history: historyItem,
    });
  } catch (error) {
    console.error("Save Auto Block history error:", error);

    res.status(500).json({
      success: false,
      message: "Could not save safety history.",
    });
  }
});
module.exports = router;
