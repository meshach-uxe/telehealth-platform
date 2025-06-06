const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      name,
      phone,
      location,
      profilePicture,
      specialization,
      bio,
      consultationFee,
      availableSlots,
      preferredLanguage,
      accessibilityNeeds,
    } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (location) updateFields.location = location;
    if (profilePicture) updateFields.profilePicture = profilePicture;
    if (preferredLanguage) updateFields.preferredLanguage = preferredLanguage;
    if (accessibilityNeeds) updateFields.accessibilityNeeds = accessibilityNeeds;

    // Doctor-specific fields
    if (req.user.role === 'doctor') {
      if (specialization) updateFields.specialization = specialization;
      if (bio) updateFields.bio = bio;
      if (consultationFee) updateFields.consultationFee = consultationFee;
      if (availableSlots) updateFields.availableSlots = availableSlots;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/doctors
// @desc    Get all doctors
// @access  Public
router.get('/doctors', async (req, res) => {
  try {
    const { specialization, location } = req.query;
    const filter = { role: 'doctor' };

    if (specialization) {
      filter.specialization = { $regex: specialization, $options: 'i' };
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    const doctors = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(doctors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/doctors/:id
// @desc    Get doctor by ID
// @access  Public
router.get('/doctors/:id', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select('-password');
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;