const express = require('express');
const { body, validationResult } = require('express-validator');
// NOTE: You would need to create a Feedback model similar to your other models.
// For now, we'll proceed as if it exists.
// const Feedback = require('../models/Feedback'); 
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Submit anonymous feedback
// @route   POST /api/feedback
// @access  Private
router.post('/', protect, [
    body('message').trim().isLength({ min: 10 }).withMessage('Feedback must be at least 10 characters'),
    body('category').isIn(['suggestion', 'concern', 'praise']).withMessage('Invalid category'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { message, category } = req.body;

        // Here you would save the feedback to the database
        // For example:
        // await Feedback.create({ message, category, department: req.user.department });

        console.log(`Anonymous Feedback Received: [${category}] - "${message}" from department ${req.user.department}`);

        res.status(201).json({ success: true, message: 'Feedback submitted successfully. Thank you!' });

    } catch (error) {
        console.error('Submit feedback error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Get all feedback (for admins/managers)
// @route   GET /api/feedback
// @access  Private (Manager/Admin)
router.get('/', protect, authorize('manager', 'admin'), async (req, res) => {
    try {
        // Here you would fetch feedback from the database
        // For example:
        // const feedbackItems = await Feedback.find({ department: req.user.department }).sort({ createdAt: -1 });
        
        // Returning mock data for now
        const mockFeedback = [
            { id: 1, message: "More collaborative spaces would be great.", category: 'suggestion', status: 'new' },
            { id: 2, message: "The new coffee machine is fantastic!", category: 'praise', status: 'reviewed' },
        ];

        res.json({ success: true, data: mockFeedback });
    } catch (error) {
        console.error('Get feedback error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


module.exports = router;