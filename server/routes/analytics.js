const express = require('express');
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get office presence leaderboard
// @route   GET /api/analytics/leaderboard
// @access  Private
router.get('/leaderboard', protect, async (req, res) => {
  try {
    // This is a simplified example. A real implementation would be more complex.
    // It would calculate attendance over a specific period (e.g., last 30 days).
    const users = await User.find({ department: req.user.department }).select('name department');

    const leaderboardData = users.map(user => ({
      id: user._id,
      name: user.name,
      department: user.department,
      // Mock data for demonstration
      officeAttendance: Math.floor(Math.random() * (95 - 70 + 1)) + 70, 
      streak: Math.floor(Math.random() * 10),
      avatar: user.name.substring(0, 2).toUpperCase(),
    })).sort((a, b) => b.officeAttendance - a.officeAttendance)
       .map((user, index) => ({ ...user, rank: index + 1 }));

    res.json({ success: true, data: leaderboardData });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;