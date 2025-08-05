const express = require('express');
const { body, validationResult } = require('express-validator');
const Poll = require('../models/Poll');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all polls
// @route   GET /api/polls
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { category, active } = req.query;
    let query = {};

    if (category) query.category = category;
    if (active !== undefined) {
      query.isActive = active === 'true';
      if (query.isActive) {
        query.expiresAt = { $gt: new Date() };
      }
    }

    const polls = await Poll.find(query)
      .populate('createdBy', 'name email department')
      .populate('options.votes.user', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: polls
    });
  } catch (error) {
    console.error('Get polls error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new poll
// @route   POST /api/polls
// @access  Private (Manager/Admin only)
router.post('/', protect, authorize('manager', 'admin'), [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('options').isArray({ min: 2, max: 10 }).withMessage('Must have 2-10 options'),
  body('options.*').trim().isLength({ min: 1, max: 100 }).withMessage('Each option must be 1-100 characters'),
  body('expiresAt').isISO8601().withMessage('Invalid expiration date'),
  body('category').optional().isIn(['general', 'work', 'team-building', 'feedback', 'scheduling']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { title, description, options, expiresAt, allowMultipleVotes, isAnonymous, category } = req.body;

    // Check expiration date is in the future
    if (new Date(expiresAt) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Expiration date must be in the future'
      });
    }

    // Format options
    const formattedOptions = options.map(text => ({
      text: text.trim(),
      votes: []
    }));

    const poll = await Poll.create({
      title,
      description,
      options: formattedOptions,
      createdBy: req.user.id,
      expiresAt,
      allowMultipleVotes: allowMultipleVotes || false,
      isAnonymous: isAnonymous || false,
      category: category || 'general'
    });

    const populatedPoll = await Poll.findById(poll._id)
      .populate('createdBy', 'name email department');

    // Emit socket event for real-time updates
    if (req.app.locals.io) {
      req.app.locals.io.emit('new-poll', populatedPoll);
    }

    res.status(201).json({
      success: true,
      message: 'Poll created successfully',
      data: populatedPoll
    });
  } catch (error) {
    console.error('Create poll error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Vote on poll
// @route   POST /api/polls/:id/vote
// @access  Private
router.post('/:id/vote', protect, [
  body('optionIndex').isInt({ min: 0 }).withMessage('Invalid option index')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { optionIndex } = req.body;

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    // Check if poll is active
    if (!poll.isActive || poll.expiresAt <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Poll is no longer active'
      });
    }

    // Check if option index is valid
    if (optionIndex >= poll.options.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid option'
      });
    }

    // Check if user has already voted
    const hasVoted = poll.hasUserVoted(req.user.id);

    if (hasVoted && !poll.allowMultipleVotes) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted on this poll'
      });
    }

    // If multiple votes not allowed and user has voted, remove previous vote
    if (hasVoted && poll.allowMultipleVotes) {
      poll.options.forEach(option => {
        option.votes = option.votes.filter(vote => vote.user.toString() !== req.user.id.toString());
      });
    }

    // Add vote
    poll.options[optionIndex].votes.push({
      user: req.user.id,
      votedAt: new Date()
    });

    await poll.save();

    const updatedPoll = await Poll.findById(poll._id)
      .populate('createdBy', 'name email department')
      .populate('options.votes.user', 'name');

    // Emit socket event for real-time updates
    if (req.app.locals.io) {
      req.app.locals.io.emit('poll-updated', updatedPoll);
    }

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      data: updatedPoll
    });
  } catch (error) {
    console.error('Vote poll error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete poll
// @route   DELETE /api/polls/:id
// @access  Private (Admin or poll creator)
router.delete('/:id', protect, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    // Check if user can delete this poll
    if (poll.createdBy.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own polls'
      });
    }

    await Poll.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Poll deleted successfully'
    });
  } catch (error) {
    console.error('Delete poll error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;