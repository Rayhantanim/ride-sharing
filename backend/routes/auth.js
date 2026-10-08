const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');

const router = express.Router();
const otpStore = new Map();

// Helper to sign a JWT
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/* ─────────────── SIGNUP ─────────────── */
router.post('/signup', async (req, res) => {
  try {
    const { fullName, phone, email, password } = req.body;

    // 1. Validate
    if (!fullName || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, phone and password are required',
      });
    }

    // 2. Compute email (fallback if empty)
    const emailToUse = (email && email.trim()) || `${phone}@zygo.com`;

    // 3. Check duplicate phone or email
    const existing = await User.findOne({
      $or: [{ email: emailToUse.toLowerCase() }, { phone }],
    });
    if (existing) {
      const field =
        existing.email === emailToUse.toLowerCase() ? 'email' : 'phone';
      return res.status(409).json({
        success: false,
        message: `A user with this ${field} already exists`,
      });
    }

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Save
    const user = await User.create({
      fullName,
      phone,
      email: emailToUse,
      password: hashedPassword,
    });

    // 6. Issue JWT
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(err.errors).map((e) => e.message).join(', '),
      });
    }
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email or phone already in use',
      });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ─────────────── LOGIN ─────────────── */
router.post('/login', async (req, res) => {
  console.log('\n────────── LOGIN REQUEST ──────────');
  console.log('📥 Raw body:', req.body);

  try {
    const identifier =
      req.body?.identifier || req.body?.email || req.body?.phone;
    const { password } = req.body || {};

    console.log('🔑 identifier:', identifier);
    console.log('🔒 password present:', !!password);

    if (!identifier || !password) {
      console.log('❌ Missing identifier or password → 400');
      return res.status(400).json({
        success: false,
        message: 'Email/phone and password are required',
      });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { phone: identifier },
      ],
    }).select('+password');

    console.log('👤 User found:', user ? user.email : 'NO USER');

    if (!user) {
      console.log('❌ No user → 401');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔐 Password match:', isMatch);

    if (!isMatch) {
      console.log('❌ Wrong password → 401');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }



    const token = signToken(user._id);
    console.log('✅ Login success → 200, token issued');

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('💥 Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
/* ───────────── SEND OTP ───────────── */
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      console.log(`⚠️  OTP requested for unknown phone: ${phone}`);
      return res.json({
        success: true,
        message: 'If this phone is registered, an OTP has been sent',
      });
    }

    const code = String(Math.floor(1000 + Math.random() * 9000));
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(phone, { code, expiresAt, attempts: 0 });

    console.log('\n════════════════════════════════════════');
    console.log(`📱 OTP for ${phone}:  ${code}`);
    console.log('════════════════════════════════════════\n');

    res.json({
      success: true,
      message: 'OTP sent successfully',
      devCode: process.env.NODE_ENV !== 'production' ? code : undefined,
    });
  } catch (err) {
    console.error('send-otp error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ───────────── VERIFY OTP ───────────── */
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({
        success: false,
        message: 'Phone and code are required',
      });
    }

    const entry = otpStore.get(phone);

    if (!entry) {
      return res.status(400).json({
        success: false,
        message: 'No OTP requested for this number',
      });
    }

    if (Date.now() > entry.expiresAt) {
      otpStore.delete(phone);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    entry.attempts += 1;
    if (entry.attempts > 5) {
      otpStore.delete(phone);
      return res.status(429).json({
        success: false,
        message: 'Too many attempts. Please request a new OTP.',
      });
    }

    if (entry.code !== String(code)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    otpStore.delete(phone);

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User no longer exists',
      });
    }

    const resetToken = jwt.sign(
      { id: user._id, purpose: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    console.log(`✅ OTP verified for ${phone}, reset token issued`);

    res.json({
      success: true,
      message: 'OTP verified',
      resetToken,
    });
  } catch (err) {
    console.error('verify-otp error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ───────────── RESET PASSWORD ───────────── */
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required',
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
          'Password must be at least 8 characters and include one uppercase letter and one number',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Reset token expired or invalid',
      });
    }

    if (decoded.purpose !== 'password_reset') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token purpose',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    console.log(`🔐 Password reset for user ${decoded.id}`);

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (err) {
    console.error('reset-password error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;