/**
 * Gallery Model
 * Manages images and videos for the organization
 */

const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  // Media Type
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },

  // Media Source
  url: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String // For videos
  },
  cloudinaryId: {
    type: String // For Cloudinary integration
  },

  // Metadata
  title: {
    en: { type: String },
    bn: { type: String, required: true }
  },
  description: {
    en: { type: String },
    bn: { type: String }
  },

  // Categorization
  category: {
    type: String,
    enum: [
      'general',
      'education',
      'healthcare',
      'social_awareness',
      'library',
      'sports',
      'cultural',
      'antidrug',
      'infrastructure',
      'humanitarian',
      'events',
      'team',
      'volunteers',
      'achievements',
      'infrastructure_development'
    ],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  // Related To
  relatedTo: {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
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
    },
    project: String // Project ID within a module
  },

  // Media Details
  fileSize: {
    type: Number // in bytes
  },
  dimensions: {
    width: Number,
    height: Number
  },
  format: {
    type: String // jpg, png, mp4, etc.
  },
  duration: {
    type: Number // For videos, in seconds
  },

  // For Videos
  videoDetails: {
    platform: {
      type: String,
      enum: ['youtube', 'vimeo', 'facebook', 'local']
    },
    videoId: String,
    embedUrl: String
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
  featured: {
    type: Boolean,
    default: false
  },
  featuredOrder: {
    type: Number,
    default: 0
  },

  // Attribution
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  photographer: {
    name: String,
    credit: String
  },

  // Capture Details
  captureDate: {
    type: Date
  },
  location: {
    type: String
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: {
    type: Date
  },

  // Alt Text (for accessibility)
  altText: {
    en: String,
    bn: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
gallerySchema.index({ type: 1, category: 1 });
gallerySchema.index({ category: 1, status: 1 });
gallerySchema.index({ featured: 1, featuredOrder: 1 });
gallerySchema.index({ tags: 1 });
gallerySchema.index({ 'title.bn': 'text', 'description.bn': 'text', tags: 'text' });
gallerySchema.index({ createdAt: -1 });

// Virtual for like count
gallerySchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for aspect ratio
gallerySchema.virtual('aspectRatio').get(function() {
  if (this.dimensions && this.dimensions.width && this.dimensions.height) {
    return (this.dimensions.height / this.dimensions.width).toFixed(2);
  }
  return null;
});

// Static method to get featured media
gallerySchema.statics.getFeatured = async function(type = 'image', limit = 10) {
  return await this.find({
    type,
    featured: true,
    status: 'approved'
  })
  .sort({ featuredOrder: 1, createdAt: -1 })
  .limit(limit)
  .populate('uploadedBy', 'name avatar')
  .lean();
};

// Static method to get by category
gallerySchema.statics.getByCategory = async function(category, type = null, limit = 20) {
  const query = { category, status: 'approved' };
  if (type) query.type = type;

  return await this.find(query)
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('uploadedBy', 'name avatar')
  .lean();
};

// Static method to get gallery statistics
gallerySchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $match: { status: 'approved' }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        imageCount: {
          $sum: { $cond: [{ $eq: ['$type', 'image'] }, 1, 0] }
        },
        videoCount: {
          $sum: { $cond: [{ $eq: ['$type', 'video'] }, 1, 0] }
        }
      }
    }
  ]);

  const totalStats = await this.aggregate([
    {
      $match: { status: 'approved' }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        images: {
          $sum: { $cond: [{ $eq: ['$type', 'image'] }, 1, 0] }
        },
        videos: {
          $sum: { $cond: [{ $eq: ['$type', 'video'] }, 1, 0] }
        }
      }
    }
  ]);

  return {
    byCategory: stats,
    total: totalStats[0] || { total: 0, images: 0, videos: 0 }
  };
};

// Method to increment views
gallerySchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save({ validateBeforeSave: false });
};

// Method to toggle like
gallerySchema.methods.toggleLike = async function(userId) {
  const likeIndex = this.likes.findIndex(
    like => like.user.toString() === userId.toString()
  );

  if (likeIndex > -1) {
    // Unlike
    this.likes.splice(likeIndex, 1);
  } else {
    // Like
    this.likes.push({ user: userId });
  }

  return this.save();
};

module.exports = mongoose.model('Gallery', gallerySchema);
