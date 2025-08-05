const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  week: {
    type: String,
    required: true, // Format: YYYY-WW (e.g., "2023-45")
  },
  year: {
    type: Number,
    required: true
  },
  weekNumber: {
    type: Number,
    required: true
  },
  schedule: {
    monday: {
      type: String,
      enum: ['wfo', 'wfh', 'off', 'holiday'],
      default: 'wfh'
    },
    tuesday: {
      type: String,
      enum: ['wfo', 'wfh', 'off', 'holiday'],
      default: 'wfh'
    },
    wednesday: {
      type: String,
      enum: ['wfo', 'wfh', 'off', 'holiday'],
      default: 'wfh'
    },
    thursday: {
      type: String,
      enum: ['wfo', 'wfh', 'off', 'holiday'],
      default: 'wfh'
    },
    friday: {
      type: String,
      enum: ['wfo', 'wfh', 'off', 'holiday'],
      default: 'wfh'
    },
    saturday: {
      type: String,
      enum: ['wfo', 'wfh', 'off', 'holiday'],
      default: 'off'
    },
    sunday: {
      type: String,
      enum: ['wfo', 'wfh', 'off', 'holiday'],
      default: 'off'
    }
  },
  notes: {
    type: String,
    maxLength: [500, 'Notes cannot exceed 500 characters']
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  submittedAt: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
scheduleSchema.index({ user: 1, week: 1 }, { unique: true });
scheduleSchema.index({ year: 1, weekNumber: 1 });

// Static method to get current week string
scheduleSchema.statics.getCurrentWeek = function() {
  const now = new Date();
  const year = now.getFullYear();
  const onejan = new Date(year, 0, 1);
  const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return `${year}-${week.toString().padStart(2, '0')}`;
};

module.exports = mongoose.model('Schedule', scheduleSchema);