const express = require('express');
const User = require('../models/User');

const router = express.Router();

/**
 * POST /api/users
 * Body: { uid, fullName, phone, email, provider?, photoURL? }
 *
 * Called by your React app after Firebase Auth signup.
 * Uses upsert so it works for BOTH signup and later updates.
 */
router.post('/', async (req, res) => {
  try {
    const { uid, fullName, phone, email, provider, photoURL } = req.body;

    if (!uid || !email) {
      return res.status(400).json({
        success: false,
        message: 'uid and email are required',
      });
    }

    // Upsert: update if exists, create if not
    const user = await User.findOneAndUpdate(
      { uid },
      {
        $set: {
          fullName: fullName || '',
          phone:    phone    || '',
          email:    email.toLowerCase(),
          ...(provider  && { provider }),
          ...(photoURL  && { photoURL }),
        },
        $setOnInsert: { uid },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(201).json({
      success: true,
      message: 'User saved successfully',
      user: {
        id: user._id,
        uid: user.uid,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        provider: user.provider,
      },
    });
  } catch (err) {
    console.error('❌ POST /api/users error:', err);

    // Duplicate email (different uid) — happens if user already signed up another way
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(err.errors).map((e) => e.message).join(', '),
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

/**
 * GET /api/users/:uid
 * Fetch a single user profile by Firebase UID
 */
router.get('/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;