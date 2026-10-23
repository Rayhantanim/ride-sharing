const express = require('express');
const Ride = require('../models/Ride');
const Booking = require('../models/Booking');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

/* ───────── Driver profile + stats ───────── */
router.get('/profile', protect, async (req, res) => {
  try {
    const driver = await User.findById(req.user._id);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const rides = await Ride.find({ driver: driver._id });
    const rideIds = rides.map((r) => r._id);
    const bookings = await Booking.find({ ride: { $in: rideIds } });

    res.json({
      success: true,
      driver: {
        id: driver._id,
        fullName: driver.fullName,
        phone: driver.phone,
        email: driver.email,
        rating: driver.rating ?? 5.0,
        totalRides: rides.filter((r) => r.status === 'completed').length,
        verificationStatus: driver.verificationStatus || 'unverified', 
      },
      stats: {
        activeRides: rides.filter((r) => r.status === 'available').length,
        bookedRides: rides.filter((r) => r.status === 'booked').length,
        completedRides: rides.filter((r) => r.status === 'completed').length,
        pendingBookings: bookings.filter((b) => b.status === 'pending').length,
        acceptedBookings: bookings.filter((b) => b.status === 'accepted').length,
      },
    });
  } catch (err) {
    console.error('driver/profile error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ───────── All rides created by this driver ───────── */
router.get('/rides', protect, async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id }).sort('-createdAt');
    res.json({ success: true, rides });
  } catch (err) {
    console.error('driver/rides error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ───────── Create a new ride ───────── */
router.post('/rides', protect, async (req, res) => {
  try {
    const { from, to, date, time, seats, price } = req.body;

    if (!from || !to || !date || !time || !seats || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'from, to, date, time, seats and price are required',
      });
    }

    const ride = await Ride.create({
      driver: req.user._id,
      from,
      to,
      date,
      time,
      seats: Number(seats),
      price: Number(price),
      status: 'available',
    });

    res.status(201).json({ success: true, ride });
  } catch (err) {
    console.error('create ride error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(err.errors).map((e) => e.message).join(', '),
      });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ───────── All bookings on driver's rides ───────── */
router.get('/bookings', protect, async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id }).select('_id');
    const rideIds = rides.map((r) => r._id);

    const filter = { ride: { $in: rideIds } };
    if (req.query.status) filter.status = req.query.status;

    const bookings = await Booking.find(filter)
      .populate('ride', 'from to date time price seats status')
      .populate('passenger', 'fullName phone email')
      .sort('-createdAt');

    res.json({ success: true, bookings });
  } catch (err) {
    console.error('driver/bookings error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ───────── Accept a booking ───────── */
router.post('/bookings/:id/accept', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('ride');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (String(booking.ride.driver) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not your ride' });
    }
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot accept a ${booking.status} booking`,
      });
    }

    // Check seat availability
    const confirmedSeats = await Booking.aggregate([
      { $match: { ride: booking.ride._id, status: 'accepted' } },
      { $group: { _id: null, total: { $sum: '$seats' } } },
    ]);
    const usedSeats = confirmedSeats[0]?.total || 0;

    if (usedSeats + booking.seats > booking.ride.seats) {
      return res.status(400).json({
        success: false,
        message: `Only ${booking.ride.seats - usedSeats} seat(s) remaining`,
      });
    }

    booking.status = 'accepted';
    await booking.save();

    // Mark ride as booked if all seats are now taken
    if (usedSeats + booking.seats >= booking.ride.seats) {
      booking.ride.status = 'booked';
      await booking.ride.save();
    }

    res.json({ success: true, booking });
  } catch (err) {
    console.error('accept booking error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ───────── Reject a booking ───────── */
router.post('/bookings/:id/reject', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('ride');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (String(booking.ride.driver) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not your ride' });
    }

    booking.status = 'rejected';
    await booking.save();

    res.json({ success: true, booking });
  } catch (err) {
    console.error('reject booking error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ───────── Mark ride completed ───────── */
router.post('/rides/:id/complete', protect, async (req, res) => {
  try {
    const ride = await Ride.findOne({
      _id: req.params.id,
      driver: req.user._id,
    });
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    ride.status = 'completed';
    await ride.save();

    res.json({ success: true, ride });
  } catch (err) {
    console.error('complete ride error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ───────── Cancel ride ───────── */
router.post('/rides/:id/cancel', protect, async (req, res) => {
  try {
    const ride = await Ride.findOne({
      _id: req.params.id,
      driver: req.user._id,
    });
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    ride.status = 'cancelled';
    await ride.save();

    // Reject pending bookings on this ride
    await Booking.updateMany(
      { ride: ride._id, status: 'pending' },
      { status: 'rejected' }
    );

    res.json({ success: true, ride });
  } catch (err) {
    console.error('cancel ride error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ───────── Earnings summary ───────── */
router.get('/earnings', protect, async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id }).select('_id price');
    const rideIds = rides.map((r) => r._id);
    const rideMap = new Map(rides.map((r) => [String(r._id), r]));

    const bookings = await Booking.find({
      ride: { $in: rideIds },
      status: 'accepted',
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const week = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const month = new Date();
    month.setDate(1);
    month.setHours(0, 0, 0, 0);

    const total = (list) =>
      list.reduce((sum, b) => {
        const r = rideMap.get(String(b.ride));
        return sum + (r?.price || 0) * (b.seats || 0);
      }, 0);

    res.json({
      success: true,
      earnings: {
        today: total(bookings.filter((b) => b.createdAt >= today)),
        week: total(bookings.filter((b) => b.createdAt >= week)),
        month: total(bookings.filter((b) => b.createdAt >= month)),
        allTime: total(bookings),
      },
      totalBookings: bookings.length,
    });
  } catch (err) {
    console.error('earnings error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;