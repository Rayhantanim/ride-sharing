const express = require('express');
const Verification = require('../models/Verification');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

/* ───── POST /api/verification/submit ─────
   Driver submits NID + licence documents */
router.post(
  '/submit',
  protect,
  upload.fields([
    { name: 'nidFront', maxCount: 1 },
    { name: 'nidBack', maxCount: 1 },
    { name: 'licenceFront', maxCount: 1 },
    { name: 'licenceBack', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Must be a driver
      if (req.user.role !== 'driver') {
        return res.status(403).json({
          success: false,
          message: 'Only drivers can submit verification',
        });
      }

      // Must have all four files
      const files = req.files || {};
      const required = ['nidFront', 'nidBack', 'licenceFront', 'licenceBack'];
      for (const f of required) {
        if (!files[f]?.[0]) {
          return res.status(400).json({
            success: false,
            message: `Missing required file: ${f}`,
          });
        }
      }

      // Check for existing verification
      let existing = await Verification.findOne({ driver: req.user._id });

      if (existing && existing.status === 'approved') {
        return res.status(400).json({
          success: false,
          message: 'Your verification is already approved',
        });
      }
      if (existing && existing.status === 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Your verification is already under review',
        });
      }

      const payload = {
        driver: req.user._id,
        nidFront: `/uploads/verifications/${files.nidFront[0].filename}`,
        nidBack: `/uploads/verifications/${files.nidBack[0].filename}`,
        licenceFront: `/uploads/verifications/${files.licenceFront[0].filename}`,
        licenceBack: `/uploads/verifications/${files.licenceBack[0].filename}`,
        nidNumber: req.body.nidNumber || '',
        licenceNumber: req.body.licenceNumber || '',
        licenceExpiry: req.body.licenceExpiry || undefined,
        status: 'pending',
        submittedAt: new Date(),
        rejectionReason: undefined,
      };

      if (existing) {
        // Resubmission
        Object.assign(existing, payload);
        existing.resubmissionCount = (existing.resubmissionCount || 0) + 1;
        await existing.save();
      } else {
        existing = await Verification.create(payload);
      }

      // Update user status
      await User.findByIdAndUpdate(req.user._id, {
        verificationStatus: 'pending',
      });

      console.log(`📋 Verification submitted by ${req.user.email}`);

      res.status(201).json({
        success: true,
        message: 'Verification submitted. Awaiting admin review.',
        verification: {
          id: existing._id,
          status: existing.status,
          submittedAt: existing.submittedAt,
        },
      });
    } catch (err) {
      console.error('verification/submit error:', err);
      res.status(500).json({
        success: false,
        message: 'Server error',
        devError: process.env.NODE_ENV !== 'production' ? err.message : undefined,
      });
    }
  }
);

/* ───── GET /api/verification/me ─────
   Driver checks their own status */
router.get('/me', protect, async (req, res) => {
  try {
    const verification = await Verification.findOne({
      driver: req.user._id,
    }).select('-reviewedBy');

    res.json({
      success: true,
      verificationStatus: req.user.verificationStatus,
      verification: verification || null,
    });
  } catch (err) {
    console.error('verification/me error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;