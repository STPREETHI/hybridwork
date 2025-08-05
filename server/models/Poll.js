const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Poll title is required'],
    trim: true,
    maxLength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Poll description is required'],
    trim: true,
    maxLength: [1000, 'Description cannot exceed 1000 characters']
  },
  options: [{
    text: {
      type: String,
      required: true,
      trim: true,
      maxLength: [100, 'Option text cannot exceed 100 characters']
    },
    votes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      votedAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  allowMultipleVotes: {
    type: Boolean,
    default: false
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['general', 'work', 'team-building', 'feedback', 'scheduling'],
    default: 'general'
  }
}, {
  timestamps: true
});

// Index for efficient queries
pollSchema.index({ isActive: 1, expiresAt: 1 });
pollSchema.index({ createdBy: 1 });

// Virtual for total votes
pollSchema.virtual('totalVotes').get(function() {
  return this.options.reduce((total, option) => total + option.votes.length, 0);
});

// Method to check if user has voted
pollSchema.methods.hasUserVoted = function(userId) {
  return this.options.some(option => 
    option.votes.some(vote => vote.user.toString() === userId.toString())
  );
};

module.exports = mongoose.model('Poll', pollSchema);