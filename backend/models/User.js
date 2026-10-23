const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      unique: true,
    },
    gender: {
  type: String,
  enum: ["male", "female", "other", "prefer_not_to_say"],
  required: [true, "Gender is required"],
},
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    // ── Role ──────────────────────────────
    role: {
      type: String,
      enum: ["passenger", "driver", "admin"],
      default: "passenger",
      required: true,
    },

    // ── 🆕 Verification Status ────────────
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "approved", "rejected"],
      default: "unverified",
    },

    // ── Driver-only vehicle info ──────────
    vehicle: {
      make: { type: String, trim: true },
      model: { type: String, trim: true },
      color: { type: String, trim: true },
      plateNumber: { type: String, trim: true },
      year: { type: Number },
    },

    // ── Stats ─────────────────────────────
    rating: { type: Number, default: 5.0 },
    totalRides: { type: Number, default: 0 },
    isOnline: { type: Boolean, default: false },
    isDriver: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Modern Mongoose — no `next` callback
userSchema.pre("save", function () {
  this.isDriver = this.role === "driver";
});

module.exports = mongoose.model("User", userSchema);