/**
 * Testimonial Model
 * Stores success stories and testimonials from beneficiaries and members
 */

const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  // Author Information
  author: {
    name: {
      en: { type: String, required: true },
      bn: { type: String, required: true }
    },
    designation: {
      en: { type: String },
      bn: { type: String }
    },
    photo: {
      type: String
    },
    location: {
      en: { type: String },
      bn: { type: String }
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Testimonial Content
  content: {
    en: { type: String, required: true },
    bn: { type: String, required: true }
  },
  quote: {
    en: { type: String },
    bn: { type: String }
  },

  // Type and Category
  type: {
    type: String,
    enum: ['beneficiary', 'volunteer', 'donor', 'partner', 'member', 'general'],
    default: 'general'
  },
  category: {
    type: String,
    enum: [
      'education',
      'healthcare',
      'social_awareness',
      'library',
      'sports_cultural',
      'antidrug',
      'infrastructure',
      'humanitarian',
      'general'
    ],
    default: 'general'
  },

  // Related To
  relatedTo: {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    project: {
      type: String // Reference to ActivityModule project
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

  // Media
  images: [{
    type: String
  }],
  videoUrl: {
    type: String
  },

  // Rating/Feedback
  rating: {
    type: Number,
    min: 1,
    max: 5
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'featured'],
    default: 'pending'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  featuredOrder: {
    type: Number,
    default: 0
  },

  // Moderation
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: {
    type: Date
  },
  moderationNotes: {
    type: String
  },

  // Engagement
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Language
  language: {
    type: String,
    enum: ['bn', 'en'],
    default: 'bn'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
testimonialSchema.index({ status: 1, isFeatured: 1 });
testimonialSchema.index({ category: 1, status: 1 });
testimonialSchema.index({ type: 1, status: 1 });
testimonialSchema.index({ 'author.name.bn': 'text', 'content.bn': 'text' });

// Virtual for like count
testimonialSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Static method to get featured testimonials
testimonialSchema.statics.getFeatured = async function(limit = 5) {
  return await this.find({
    status: 'approved',
    isFeatured: true
  })
  .sort({ featuredOrder: 1, createdAt: -1 })
  .limit(limit)
  .lean();
};

// Static method to get by category
testimonialSchema.statics.getByCategory = async function(category, limit = 10) {
  return await this.find({
    category,
    status: 'approved'
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .lean();
};

module.exports = mongoose.model('Testimonial', testimonialSchema);
