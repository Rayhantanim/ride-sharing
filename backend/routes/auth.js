const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

/* Helper to sign a JWT */
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

/* In-memory OTP store */
const otpStore = new Map();

/* ═══════════════════════════════════════════
   SIGNUP
   ═══════════════════════════════════════════ */
router.post("/signup", async (req, res) => {
  try {
    console.log("\n════════════════════════════════════════");
    console.log("📥 SIGNUP REQUEST BODY:", req.body);
    console.log("════════════════════════════════════════");

 const {
  fullName,
  gender, // 🆕 Add this
  phone,
  email,
  password,
  role = "passenger",
  vehicle,
} = req.body;

    // 1. Basic validation
    if (!fullName || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, phone and password are required",
      });
    }

    // 2. Role validation
    if (!["passenger", "driver", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be "passenger", "driver", or "admin"',
      });
    }

    // 3. Driver-specific validation
    if (role === "driver") {
      const { make, model, plateNumber } = vehicle || {};
      if (!make || !model || !plateNumber) {
        return res.status(400).json({
          success: false,
          message:
            "Vehicle make, model and plate number are required for drivers",
        });
      }
    }

    // 4. Compute email (fallback if empty)
    const emailToUse =
      (email && email.trim()) || `${phone.trim()}@zygo.com`;

    // 5. Check duplicates
    const existing = await User.findOne({
      $or: [
        { email: emailToUse.toLowerCase() },
        { phone: phone.trim() },
      ],
    });
    if (existing) {
      const field =
        existing.email === emailToUse.toLowerCase() ? "email" : "phone";
      return res.status(409).json({
        success: false,
        message: `A user with this ${field} already exists`,
      });
    }

    // 6. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   const userData = {
  fullName: fullName.trim(),
  gender, // 🆕 Add this
  phone: phone.trim(),
  email: emailToUse,
  password: hashedPassword,
  role,
};
    if (role === "driver" && vehicle) {
      userData.vehicle = {
        make: vehicle.make.trim(),
        model: vehicle.model.trim(),
        color: (vehicle.color || "").trim(),
        plateNumber: vehicle.plateNumber.trim(),
      };

      const yearNum = parseInt(vehicle.year, 10);
      if (Number.isFinite(yearNum) && yearNum > 0) {
        userData.vehicle.year = yearNum;
      }
    }

    // 8. Save the user
    const user = await User.create(userData);

    // 9. Issue JWT
    const token = signToken(user._id);

    console.log(`✅ ${role.toUpperCase()} created: ${user.email}`);

    res.status(201).json({
      success: true,
      message: `${
        role === "driver" ? "Driver" : "Passenger"
      } account created successfully`,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        vehicle: user.vehicle,
      },
    });
  } catch (err) {
    console.error("\n❌❌❌ SIGNUP FAILED ❌❌❌");
    console.error("Name:", err.name);
    console.error("Message:", err.message);
    if (err.errors) {
      console.error(
        "Field errors:",
        Object.entries(err.errors).map(([f, e]) => `${f}: ${e.message}`)
      );
    }
    if (err.code === 11000) {
      console.error("Duplicate key:", err.keyValue);
    }
    console.error("Full stack:", err.stack);
    console.error("════════════════════════════════════════\n");

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(err.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email or phone already in use",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      devError:
        process.env.NODE_ENV !== "production" ? err.message : undefined,
    });
  }
});

/* ═══════════════════════════════════════════
   LOGIN
   ═══════════════════════════════════════════ */
router.post("/login", async (req, res) => {
  try {
    const identifier =
      req.body?.identifier || req.body?.email || req.body?.phone;
    const { password } = req.body || {};

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/phone and password are required",
      });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { phone: identifier },
      ],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        vehicle: user.vehicle,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   SEND OTP
   ═══════════════════════════════════════════ */
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number is required" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      console.log(`⚠️  OTP requested for unknown phone: ${phone}`);
      return res.json({
        success: true,
        message: "If this phone is registered, an OTP has been sent",
      });
    }

    const code = String(Math.floor(1000 + Math.random() * 9000));
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(phone, { code, expiresAt, attempts: 0 });

    console.log("\n════════════════════════════════════════");
    console.log(`📱 OTP for ${phone}:  ${code}`);
    console.log("════════════════════════════════════════\n");

    res.json({
      success: true,
      message: "OTP sent successfully",
      devCode: process.env.NODE_ENV !== "production" ? code : undefined,
    });
  } catch (err) {
    console.error("send-otp error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   VERIFY OTP
   ═══════════════════════════════════════════ */
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res
        .status(400)
        .json({ success: false, message: "Phone and code are required" });
    }

    const entry = otpStore.get(phone);

    if (!entry) {
      return res
        .status(400)
        .json({ success: false, message: "No OTP requested for this number" });
    }

    if (Date.now() > entry.expiresAt) {
      otpStore.delete(phone);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    entry.attempts += 1;
    if (entry.attempts > 5) {
      otpStore.delete(phone);
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Please request a new OTP.",
      });
    }

    if (entry.code !== String(code)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }

    otpStore.delete(phone);

    const user = await User.findOne({ phone });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User no longer exists" });
    }

    const resetToken = jwt.sign(
      { id: user._id, purpose: "password_reset" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    console.log(`✅ OTP verified for ${phone}`);

    res.json({ success: true, message: "OTP verified", resetToken });
  } catch (err) {
    console.error("verify-otp error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   RESET PASSWORD
   ═══════════════════════════════════════════ */
router.post("/reset-password", async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required",
      });
    }

    if (
      newPassword.length < 8 ||
      !/[A-Z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include one uppercase letter and one number",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, message: "Reset token expired or invalid" });
    }

    if (decoded.purpose !== "password_reset") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token purpose" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(decoded.id, {
      password: hashedPassword,
    });

    console.log(`🔐 Password reset for user ${decoded.id}`);

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("reset-password error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;