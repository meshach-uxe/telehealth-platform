const express = require('express');
const router = express.Router();
const HealthContent = require('../models/HealthContent');
const auth = require('../middleware/auth');

// @route   POST api/health-content
// @desc    Create health content
// @access  Private (Admin/Doctor)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is authorized to create content
    if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const {
      title,
      description,
      content,
      category,
      tags,
      mediaType,
      mediaUrl,
      audioTranscript,
      language,
      targetAudience,
      difficulty,
      isPublished,
      accessibility,
    } = req.body;

    const newHealthContent = new HealthContent({
      title,
      description,
      content,
      category,
      tags,
      mediaType,
      mediaUrl,
      audioTranscript,
      language,
      targetAudience,
      difficulty,
      author: req.user.id,
      isPublished: isPublished || false,
      accessibility,
    });

    const healthContent = await newHealthContent.save();
    res.json(healthContent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/health-content
// @desc    Get all health content
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      language,
      targetAudience,
      difficulty,
      mediaType,
      search,
      limit = 10,
      page = 1,
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (language) filter.language = language;
    if (targetAudience) filter.targetAudience = targetAudience;
    if (difficulty) filter.difficulty = difficulty;
    if (mediaType) filter.mediaType = mediaType;

    // Only show published content to public
    filter.isPublished = true;

    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (page - 1) * limit;

    const healthContent = await HealthContent.find(filter)
      .populate('author', 'name role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await HealthContent.countDocuments(filter);

    res.json({
      healthContent,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/health-content/:id
// @desc    Get health content by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const healthContent = await HealthContent.findById(req.params.id).populate(
      'author',
      'name role'
    );

    if (!healthContent) {
      return res.status(404).json({ msg: 'Health content not found' });
    }

    // Increment view count
    healthContent.views += 1;
    await healthContent.save();

    res.json(healthContent);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Health content not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/health-content/:id
// @desc    Update health content
// @access  Private (Admin/Author)
router.put('/:id', auth, async (req, res) => {
  try {
    const healthContent = await HealthContent.findById(req.params.id);

    if (!healthContent) {
      return res.status(404).json({ msg: 'Health content not found' });
    }

    // Check if user is authorized to update
    if (
      healthContent.author.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const {
      title,
      description,
      content,
      category,
      tags,
      mediaType,
      mediaUrl,
      audioTranscript,
      language,
      targetAudience,
      difficulty,
      isPublished,
      accessibility,
    } = req.body;

    // Update fields
    if (title) healthContent.title = title;
    if (description) healthContent.description = description;
    if (content) healthContent.content = content;
    if (category) healthContent.category = category;
    if (tags) healthContent.tags = tags;
    if (mediaType) healthContent.mediaType = mediaType;
    if (mediaUrl) healthContent.mediaUrl = mediaUrl;
    if (audioTranscript) healthContent.audioTranscript = audioTranscript;
    if (language) healthContent.language = language;
    if (targetAudience) healthContent.targetAudience = targetAudience;
    if (difficulty) healthContent.difficulty = difficulty;
    if (isPublished !== undefined) healthContent.isPublished = isPublished;
    if (accessibility) healthContent.accessibility = accessibility;

    await healthContent.save();
    res.json(healthContent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/health-content/:id
// @desc    Delete health content
// @access  Private (Admin/Author)
router.delete('/:id', auth, async (req, res) => {
  try {
    const healthContent = await HealthContent.findById(req.params.id);

    if (!healthContent) {
      return res.status(404).json({ msg: 'Health content not found' });
    }

    // Check if user is authorized to delete
    if (
      healthContent.author.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    await healthContent.remove();
    res.json({ msg: 'Health content removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/health-content/:id/like
// @desc    Like health content
// @access  Private
router.put('/:id/like', auth, async (req, res) => {
  try {
    const healthContent = await HealthContent.findById(req.params.id);

    if (!healthContent) {
      return res.status(404).json({ msg: 'Health content not found' });
    }

    healthContent.likes += 1;
    await healthContent.save();

    res.json({ likes: healthContent.likes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;