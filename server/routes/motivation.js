const express = require('express');
const { body, validationResult } = require('express-validator');
const MotivationPost = require('../models/MotivationPost');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all motivation posts
// @route   GET /api/motivation
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const posts = await MotivationPost.find({
      $or: [
        { isPublic: true },
        { department: req.user.department }
      ]
    })
    .populate('author', 'name department avatar')
    .sort({ createdAt: -1 });

    res.json({ success: true, data: posts });
  } catch (error) {
    console.error('Get motivation posts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Create a new motivation post
// @route   POST /api/motivation
// @access  Private
router.post('/', protect, [
  body('type').isIn(['shoutout', 'goal', 'achievement', 'inspiration']).withMessage('Invalid post type'),
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be 1-100 characters'),
  body('content').trim().isLength({ min: 1, max: 500 }).withMessage('Content is required and must be 1-500 characters'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { type, title, content, isPublic } = req.body;
    const newPost = await MotivationPost.create({
      type,
      title,
      content,
      author: req.user.id,
      department: req.user.department,
      isPublic: isPublic || true,
    });

    const populatedPost = await MotivationPost.findById(newPost._id)
        .populate('author', 'name department avatar');

    res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    console.error('Create motivation post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;