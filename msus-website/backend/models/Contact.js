/**
 * Contact Model
 * Manages contact form submissions and messages
 */

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  // Sender Information
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true,
    lowercase: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    trim: true
  },
  organization: {
    type: String,
    trim: true
  },

  // Message Details
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    trim: true
  },
  category: {
    type: String,
    enum: [
      'general',
      'membership',
      'donation',
      'volunteer',
      'event',
      'media',
      'complaint',
      'suggestion',
      'partnership'
    ],
    default: 'general'
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
    maxlength: [2000, 'Message cannot be more than 2000 characters']
  },

  // Related To
  relatedTo: {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    module: {
      type: String,
      enum: [
        'education',
        'healthcare',
        'social_awareness',
        'library',
        'sports_cultural',
        'antidrug',
        'infrastructure',
        'humanitarian'
      ]
    }
  },

  // Status
  status: {
    type: String,
    enum: ['new', 'in_progress', 'replied', 'resolved', 'closed', 'spam'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  // Response
  responses: [{
    content: {
      type: String,
      required: true
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    respondedAt: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: false
    }
  }],

  // Assigned To
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: {
    type: Date
  },

  // Resolution
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolution: {
    type: String
  },

  // Metadata
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  source: {
    type: String,
    enum: ['website', 'facebook', 'email', 'phone', 'in_person', 'other'],
    default: 'website'
  },

  // Follow Up
  followUpDate: {
    type: Date
  },
  followUpNotes: {
    type: String
  },

  // User (if logged in)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Notification
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: {
    type: Date
  },
  acknowledgementSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
contactSchema.index({ status: 1, priority: 1 });
contactSchema.index({ category: 1 });
contactSchema.index({ assignedTo: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ name: 'text', subject: 'text', message: 'text' });

// Virtual for response count
contactSchema.virtual('responseCount').get(function() {
  return this.responses ? this.responses.length : 0;
});

// Virtual for isOverdue
contactSchema.virtual('isOverdue').get(function() {
  if (this.status === 'resolved' || this.status === 'closed') return false;

  const created = new Date(this.createdAt);
  const now = new Date();
  const daysDiff = Math.floor((now - created) / (1000 * 60 * 60 * 24));

  // High priority: 2 days, Medium: 5 days, Low: 10 days
  const maxDays = {
    urgent: 1,
    high: 2,
    medium: 5,
    low: 10
  };

  return daysDiff > maxDays[this.priority];
});

// Static method to get message statistics
contactSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const categoryStats = await this.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  const priorityStats = await this.aggregate([
    {
      $match: { status: { $nin: ['resolved', 'closed'] } }
    },
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    }
  ]);

  // Recent messages (last 7 days)
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const recentCount = await this.countDocuments({
    createdAt: { $gte: lastWeek }
  });

  return {
    byStatus: stats,
    byCategory: categoryStats,
    byPriority: priorityStats,
    recent: recentCount
  };
};

// Static method to get messages requiring attention
contactSchema.statics.getPending = async function(limit = 20) {
  return await this.find({
    status: { $in: ['new', 'in_progress'] }
  })
  .sort({ priority: -1, createdAt: 1 })
  .limit(limit)
  .populate('assignedTo', 'name avatar')
  .lean();
};

// Method to add response
contactSchema.methods.addResponse = async function(content, userId, isInternal = false) {
  this.responses.push({
    content,
    respondedBy: userId,
    isInternal
  });

  if (!isInternal) {
    this.status = 'replied';
  }

  return this.save();
};

// Method to assign message
contactSchema.methods.assign = async function(userId) {
  this.assignedTo = userId;
  this.assignedAt = new Date();
  this.status = 'in_progress';
  return this.save();
};

// Method to resolve message
contactSchema.methods.resolve = async function(userId, resolution) {
  this.status = 'resolved';
  this.resolvedBy = userId;
  this.resolvedAt = new Date();
  this.resolution = resolution;
  return this.save();
};

module.exports = mongoose.model('Contact', contactSchema);
