const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'admin'],
      default: 'patient',
    },
    location: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
    },
    specialization: {
      // For doctors only
      type: String,
      trim: true,
    },
    bio: {
      // For doctors only
      type: String,
    },
    consultationFee: {
      // For doctors only
      type: Number,
    },
    availableSlots: [
      {
        day: String,
        startTime: String,
        endTime: String,
      },
    ],
    preferredLanguage: {
      type: String,
      default: 'English',
    },
    accessibilityNeeds: {
      voiceNavigation: { type: Boolean, default: false },
      textToSpeech: { type: Boolean, default: false },
      highContrast: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);