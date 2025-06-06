const mongoose = require('mongoose');

const HealthContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'maternal-health',
        'reproductive-health',
        'nutrition',
        'mental-health',
        'preventive-care',
        'emergency-care',
        'child-health',
        'general-wellness',
      ],
    },
    tags: [String],
    mediaType: {
      type: String,
      enum: ['text', 'audio', 'video', 'image'],
      default: 'text',
    },
    mediaUrl: {
      type: String,
    },
    audioTranscript: {
      type: String,
    },
    language: {
      type: String,
      default: 'English',
    },
    targetAudience: {
      type: String,
      enum: ['general', 'pregnant-women', 'new-mothers', 'adolescents', 'elderly'],
      default: 'general',
    },
    difficulty: {
      type: String,
      enum: ['basic', 'intermediate', 'advanced'],
      default: 'basic',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    accessibility: {
      hasAudio: { type: Boolean, default: false },
      hasTranscript: { type: Boolean, default: false },
      isScreenReaderFriendly: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HealthContent', HealthContentSchema);