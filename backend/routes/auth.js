const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Helper to sign a JWT
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  const emailToUse = (email && email.trim()) || `${phone}@zygo.com`;

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

    // 2. Compute email (fallback if empty — matches your frontend logic)
    const emailToUse = (email && email.trim()) || `${phone}@zygo.com`;

    // 3. Check duplicate phone or email
    const existing = await User.findOne({
      $or: [{ email: emailToUse.toLowerCase() }, { phone }],
    });
    if (existing) {
      const field = existing.email === emailToUse.toLowerCase() ? 'email' : 'phone';
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

module.exports = router;