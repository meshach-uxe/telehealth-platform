const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    consultationType: {
      type: String,
      enum: ['video', 'voice', 'chat', 'in-person'],
      default: 'video',
    },
    reason: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    prescription: {
      type: String,
    },
    followUp: {
      recommended: { type: Boolean, default: false },
      date: { type: Date },
    },
    payment: {
      amount: { type: Number },
      status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
      method: { type: String },
      transactionId: { type: String },
    },
    reminders: [
      {
        type: { type: String, enum: ['sms', 'email', 'push'] },
        sentAt: { type: Date },
        status: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', AppointmentSchema);