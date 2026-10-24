const express = require('express');
const User = require('../models/User');
const Ride = require('../models/Ride');
const Booking = require('../models/Booking');
const Verification = require('../models/Verification');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

/* GET /api/admin/stats */
router.get('/stats', protect, requireAdmin, async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments({ role: { $ne: 'admin' } }),
      totalDrivers: await User.countDocuments({ role: 'driver' }),
      totalPassengers: await User.countDocuments({ role: 'passenger' }),
      pendingVerifications: await Verification.countDocuments({ status: 'pending' }),
      totalRides: await Ride.countDocuments(),
      totalBookings: await Booking.countDocuments(),
    };
    res.json({ success: true, stats });
  } catch (err) {
    console.error('admin/stats error:', err);
    res.status(500).json({ success: false, message: 'Server error', devError: err.message });
  }
});

/* GET /api/admin/users */
router.get('/users', protect, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).sort('-createdAt');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* DELETE /api/admin/users/:id */
router.delete('/users/:id', protect, requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* GET /api/admin/verifications */
router.get('/verifications', protect, requireAdmin, async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const verifications = await Verification.find(filter)
      .populate('driver', 'fullName email phone vehicle gender')
      .sort('-submittedAt');
    res.json({ success: true, verifications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* POST /api/admin/verifications/:id/approve */
router.post('/verifications/:id/approve', protect, requireAdmin, async (req, res) => {
  try {
    const v = await Verification.findById(req.params.id);
    if (!v) return res.status(404).json({ success: false, message: 'Not found' });
    v.status = 'approved';
    v.reviewedBy = req.user._id;
    v.reviewedAt = new Date();
    v.rejectionReason = undefined;
    await v.save();
    await User.findByIdAndUpdate(v.driver, { verificationStatus: 'approved' });
    res.json({ success: true, verification: v });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* POST /api/admin/verifications/:id/reject */
router.post('/verifications/:id/reject', protect, requireAdmin, async (req, res) => {
  try {
    if (!req.body.reason) {
      return res.status(400).json({ success: false, message: 'Reason required' });
    }
    const v = await Verification.findById(req.params.id);
    if (!v) return res.status(404).json({ success: false, message: 'Not found' });
    v.status = 'rejected';
    v.reviewedBy = req.user._id;
    v.reviewedAt = new Date();
    v.rejectionReason = req.body.reason;
    await v.save();
    await User.findByIdAndUpdate(v.driver, { verificationStatus: 'rejected' });
    res.json({ success: true, verification: v });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* GET /api/admin/rides */
router.get('/rides', protect, requireAdmin, async (req, res) => {
  try {
    const rides = await Ride.find()
      .populate('driver', 'fullName email phone')
      .sort('-createdAt');
    res.json({ success: true, rides });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;