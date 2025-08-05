const mongoose = require('mongoose');

const motivationPostSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['shoutout', 'goal', 'achievement', 'inspiration'],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxLength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxLength: [500, 'Content cannot exceed 500 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  department: {
    type: String,
    required: true
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      maxLength: [200, 'Comment cannot exceed 200 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
motivationPostSchema.index({ department: 1, createdAt: -1 });
motivationPostSchema.index({ author: 1 });
motivationPostSchema.index({ type: 1, isPublic: 1 });

// Virtual for total likes
motivationPostSchema.virtual('totalLikes').get(function() {
  return this.likes.length;
});

// Method to check if user has liked
motivationPostSchema.methods.hasUserLiked = function(userId) {
  return this.likes.some(like => like.user.toString() === userId.toString());
};

module.exports = mongoose.model('MotivationPost', motivationPostSchema);