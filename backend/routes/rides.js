const express = require('express');
const Ride = require('../models/Ride');

const router = express.Router();

// Create a new ride
router.post('/', async (req, res) => {
  try {
    const { driver, from, to, date, time, seats, price } = req.body;

    const ride = new Ride({
      driver,
      from,
      to,
      date,
      time,
      seats,
      price,
    });

    await ride.save();

    res.status(201).json({
      message: 'Ride created successfully',
      ride,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create ride',
      error: error.message,
    });
  }
});

// Get all available rides
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'available' })
      .populate('driver', 'name email');

    res.json(rides);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get rides',
      error: error.message,
    });
  }
});

module.exports = router;