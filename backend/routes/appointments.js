const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const auth = require('../middleware/auth');
const twilio = require('twilio');

// Initialize Twilio client conditionally
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } catch (error) {
    console.warn('Twilio initialization failed:', error.message);
  }
}

// @route   POST api/appointments
// @desc    Create a new appointment
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { doctorId, date, startTime, endTime, reason, consultationType } = req.body;

    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      $or: [
        {
          $and: [
            { startTime: { $lte: startTime } },
            { endTime: { $gt: startTime } }
          ]
        },
        {
          $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gte: endTime } }
          ]
        }
      ],
      status: { $ne: 'cancelled' }
    });

    if (conflictingAppointment) {
      return res.status(400).json({ msg: 'Time slot is not available' });
    }

    // Create new appointment
    const appointment = new Appointment({
      patient: req.user.id,
      doctor: doctorId,
      date: new Date(date),
      startTime,
      endTime,
      reason,
      consultationType: consultationType || 'video',
      payment: {
        amount: doctor.consultationFee || 0,
        status: 'pending'
      }
    });

    await appointment.save();

    // Populate patient and doctor info
    await appointment.populate('patient', 'name email phone');
    await appointment.populate('doctor', 'name email phone specialization');

    // Send SMS confirmation (if phone numbers are available and Twilio is configured)
    if (twilioClient && appointment.patient.phone) {
      try {
        await twilioClient.messages.create({
          body: `Appointment confirmed with Dr. ${appointment.doctor.name} on ${new Date(date).toDateString()} at ${startTime}. Telehealth Platform`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: appointment.patient.phone
        });
      } catch (smsError) {
        console.error('SMS sending failed:', smsError);
      }
    }

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/appointments
// @desc    Get user's appointments
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, upcoming } = req.query;
    const filter = {};

    if (req.user.role === 'patient') {
      filter.patient = req.user.id;
    } else if (req.user.role === 'doctor') {
      filter.doctor = req.user.id;
    }

    // Filter by status if provided
    if (status) {
      filter.status = status;
    }

    // Filter for upcoming appointments
    if (upcoming === 'true') {
      filter.date = { $gte: new Date() };
    }

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone specialization')
      .sort({ date: 1, startTime: 1 });

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone specialization');

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Check if user is authorized to view this appointment
    if (
      appointment.patient._id.toString() !== req.user.id &&
      appointment.doctor._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Appointment not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, notes, prescription, followUp } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Check authorization
    if (
      appointment.patient.toString() !== req.user.id &&
      appointment.doctor.toString() !== req.user.id
    ) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    // Update fields
    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;
    if (prescription && req.user.role === 'doctor') appointment.prescription = prescription;
    if (followUp && req.user.role === 'doctor') appointment.followUp = followUp;

    await appointment.save();

    await appointment.populate('patient', 'name email phone');
    await appointment.populate('doctor', 'name email phone specialization');

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Check authorization
    if (
      appointment.patient.toString() !== req.user.id &&
      appointment.doctor.toString() !== req.user.id
    ) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ msg: 'Appointment cancelled' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;