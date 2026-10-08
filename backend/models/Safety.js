const mongoose = require("mongoose");

/* =====================================================
   TRUSTED CONTACT
===================================================== */

const trustedContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    relation: {
      type: String,
      trim: true,
      default: "Trusted Contact",
    },

    invited: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  },
);

/* =====================================================
   SAFETY EVENT
===================================================== */

const safetyEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["sos", "silent-sos", "discomfort-report", "safety-checklist"],
      required: true,
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      address: {
        type: String,
        trim: true,
        default: "",
      },

      lat: {
        type: Number,
        default: null,
      },

      lng: {
        type: Number,
        default: null,
      },
    },

    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      default: null,
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/* =====================================================
   SAFETY PROFILE
===================================================== */

const safetySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    /* ================= TRUSTED CIRCLE ================= */

    trustedContacts: {
      type: [trustedContactSchema],
      default: [],
    },

    autoShare: {
      type: Boolean,
      default: true,
    },

    /* ================= SAFETY SETTINGS ================= */

    femaleDriverPreference: {
      type: Boolean,
      default: false,
    },

    automatedNightMode: {
      type: Boolean,
      default: false,
    },

    autoBlockUnsafeDriver: {
      type: Boolean,
      default: false,
    },

    comfortFilter: {
      type: Boolean,
      default: false,
    },

    silentSos: {
      type: Boolean,
      default: false,
    },

    safetyChecklistCompleted: {
      type: Boolean,
      default: false,
    },

    /* ================= COMFORT PREFERENCES ================= */

    comfortPreferences: {
      quietRide: {
        type: Boolean,
        default: false,
      },

      temperature: {
        type: String,
        enum: ["Cool", "Normal", "Warm"],
        default: "Normal",
      },

      music: {
        type: Boolean,
        default: false,
      },

      conversation: {
        type: String,
        enum: ["Low", "Normal", "Friendly"],
        default: "Low",
      },

      smokeFree: {
        type: Boolean,
        default: true,
      },

      extraComfort: {
        type: Boolean,
        default: false,
      },
    },

    /* ================= SAFETY EVENTS ================= */

    events: {
      type: [safetyEventSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Safety", safetySchema);
