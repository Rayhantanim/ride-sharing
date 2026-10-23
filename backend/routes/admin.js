const express = require('express');
const Verification = require('../models/Verification');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

/* Admin-only middleware */
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

/* ───── GET /api/admin/verifications ─────
   List all pending + reviewed verifications */
router.get('/verifications', protect, requireAdmin, async (req, res) => {
  try {
    const status = req.query.status; // optional filter
    const filter = status ? { status } : {};

    const verifications = await Verification.find(filter)
      .populate('driver', 'fullName email phone vehicle')
      .sort('-submittedAt');

    res.json({ success: true, verifications });
  } catch (err) {
    console.error('admin/verifications error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ───── POST /api/admin/verifications/:id/approve ───── */
router.post('/verifications/:id/approve', protect, requireAdmin, async (req, res) => {
  try {
    const verification = await Verification.findById(req.params.id);
    if (!verification) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    verification.status = 'approved';
    verification.reviewedBy = req.user._id;
    verification.reviewedAt = new Date();
    verification.rejectionReason = undefined;
    await verification.save();

    await User.findByIdAndUpdate(verification.driver, {
      verificationStatus: 'approved',
    });

    console.log(`✅ Verification approved for driver ${verification.driver}`);
    res.json({ success: true, verification });
  } catch (err) {
    console.error('approve error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ───── POST /api/admin/verifications/:id/reject ───── */
router.post('/verifications/:id/reject', protect, requireAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Rejection reason required' });
    }

    const verification = await Verification.findById(req.params.id);
    if (!verification) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    verification.status = 'rejected';
    verification.reviewedBy = req.user._id;
    verification.reviewedAt = new Date();
    verification.rejectionReason = reason;
    await verification.save();

    await User.findByIdAndUpdate(verification.driver, {
      verificationStatus: 'rejected',
    });

    console.log(`❌ Verification rejected for driver ${verification.driver}`);
    res.json({ success: true, verification });
  } catch (err) {
    console.error('reject error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;