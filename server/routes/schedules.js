const express = require('express');
const { body, validationResult } = require('express-validator');
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user's schedules
// @route   GET /api/schedules
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { week, year } = req.query;
    let query = { user: req.user.id };

    if (week) query.week = week;
    if (year) query.year = parseInt(year);

    const schedules = await Schedule.find(query)
      .populate('user', 'name email department')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: schedules
    });
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create or update schedule
// @route   POST /api/schedules
// @access  Private
router.post('/', protect, [
  body('week').matches(/^\d{4}-\d{2}$/).withMessage('Week must be in format YYYY-WW'),
  body('schedule').isObject().withMessage('Schedule must be an object'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
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

    const { week, schedule, notes } = req.body;

    // Extract year and week number
    const [year, weekNumber] = week.split('-').map(Number);

    // Check if schedule already exists
    let existingSchedule = await Schedule.findOne({
      user: req.user.id,
      week
    });

    if (existingSchedule) {
      // Check if schedule is locked
      if (existingSchedule.isLocked) {
        return res.status(400).json({
          success: false,
          message: 'Schedule is locked and cannot be modified'
        });
      }

      // Update existing schedule
      existingSchedule.schedule = schedule;
      existingSchedule.notes = notes;
      existingSchedule.year = year;
      existingSchedule.weekNumber = weekNumber;
      
      await existingSchedule.save();

      return res.json({
        success: true,
        message: 'Schedule updated successfully',
        data: existingSchedule
      });
    }

    // Create new schedule
    const newSchedule = await Schedule.create({
      user: req.user.id,
      week,
      year,
      weekNumber,
      schedule,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: newSchedule
    });
  } catch (error) {
    console.error('Create/Update schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get team schedules (for managers)
// @route   GET /api/schedules/team
// @access  Private (Manager/Admin only)
router.get('/team', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const { week, department } = req.query;
    let query = {};

    if (week) query.week = week;

    // If user is not admin, filter by department
    if (req.user.role !== 'admin') {
      query.department = req.user.department;
    } else if (department) {
      query.department = department;
    }

    // Get users first, then get their schedules
    const users = await User.find(
      req.user.role === 'admin' ? {} : { department: req.user.department }
    );

    const userIds = users.map(user => user._id);
    query.user = { $in: userIds };

    const schedules = await Schedule.find(query)
      .populate('user', 'name email department role')
      .populate('approvedBy', 'name email')
      .sort({ 'user.name': 1, createdAt: -1 });

    res.json({
      success: true,
      data: schedules
    });
  } catch (error) {
    console.error('Get team schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Submit schedule for approval
// @route   PUT /api/schedules/:id/submit
// @access  Private
router.put('/:id/submit', protect, async (req, res) => {
  try {
    const schedule = await Schedule.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    if (schedule.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Only draft schedules can be submitted'
      });
    }

    schedule.status = 'submitted';
    schedule.submittedAt = new Date();
    await schedule.save();

    res.json({
      success: true,
      message: 'Schedule submitted for approval',
      data: schedule
    });
  } catch (error) {
    console.error('Submit schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Approve/Reject schedule
// @route   PUT /api/schedules/:id/approve
// @access  Private (Manager/Admin only)
router.put('/:id/approve', protect, authorize('manager', 'admin'), [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('feedback').optional().isLength({ max: 500 }).withMessage('Feedback cannot exceed 500 characters')
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

    const { status, feedback } = req.body;

    const schedule = await Schedule.findById(req.params.id)
      .populate('user', 'department');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    // Check if user can approve this schedule
    if (req.user.role !== 'admin' && schedule.user.department !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: 'You can only approve schedules from your department'
      });
    }

    schedule.status = status;
    schedule.approvedBy = req.user.id;
    schedule.approvedAt = new Date();
    if (feedback) schedule.feedback = feedback;

    await schedule.save();

    res.json({
      success: true,
      message: `Schedule ${status} successfully`,
      data: schedule
    });
  } catch (error) {
    console.error('Approve schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;