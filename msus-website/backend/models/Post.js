/**
 * Post Model (Blog/News)
 * Manages news articles, blog posts, and announcements
 */

const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
  // Content
  title: {
    type: String,
    required: [true, 'Please provide post title'],
    trim: true,
    maxlength: [150, 'Title cannot be more than 150 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot be more than 300 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide post content']
  },

  // Categorization
  category: {
    type: String,
    enum: [
      'news',
      'blog',
      'announcement',
      'success_story',
      'event_report',
      'press_release',
      'general'
    ],
    default: 'news'
  },
  subcategory: {
    type: String,
    enum: [
      'education',
      'healthcare',
      'social_awareness',
      'library',
      'sports',
      'cultural',
      'antidrug',
      'infrastructure',
      'humanitarian',
      'organizational'
    ]
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  // Media
  featuredImage: {
    type: String,
    required: [true, 'Please provide featured image']
  },
  gallery: [{
    type: String
  }],
  videoUrl: {
    type: String
  },
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number
  }],

  // Status
  status: {
    type: String,
    enum: ['draft', 'review', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },

  // Authoring
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coAuthors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

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
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [1000, 'Comment cannot be more than 1000 characters']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    replies: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: true,
        maxlength: [500, 'Reply cannot be more than 500 characters']
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  shares: {
    facebook: { type: Number, default: 0 },
    twitter: { type: Number, default: 0 },
    linkedin: { type: Number, default: 0 },
    whatsapp: { type: Number, default: 0 }
  },

  // SEO
  metaTitle: {
    type: String,
    maxlength: [70, 'Meta title cannot be more than 70 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot be more than 160 characters']
  },
  keywords: [{
    type: String
  }],
  canonicalUrl: {
    type: String
  },

  // Multi-language
  language: {
    type: String,
    enum: ['bn', 'en'],
    default: 'bn'
  },
  translations: [{
    language: { type: String, enum: ['bn', 'en'] },
    title: String,
    content: String,
    excerpt: String
  }],

  // Scheduling
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  pinnedAt: {
    type: Date
  },
  featuredAt: {
    type: Date
  },

  // Versioning
  versions: [{
    title: String,
    content: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Stats
  readingTime: {
    type: Number // in minutes
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
postSchema.index({ slug: 1 });
postSchema.index({ category: 1, status: 1 });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ isFeatured: 1, featuredAt: -1 });
postSchema.index({ isPinned: 1, pinnedAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ language: 1 });
postSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

// Generate slug before saving
postSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true, locale: 'bn' }) + '-' + Date.now();
  }

  // Auto-generate excerpt if not provided
  if (this.isModified('content') && !this.excerpt) {
    const text = this.content.replace(/\u003c[^\u003e]*\u003e/g, ''); // Remove HTML tags
    this.excerpt = text.substring(0, 297) + '...';
  }

  // Calculate reading time (average 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }

  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Virtuals
postSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

postSchema.virtual('commentCount').get(function() {
  if (!this.comments) return 0;
  return this.comments.filter(c => c.status === 'approved').length;
});

postSchema.virtual('totalShareCount').get(function() {
  if (!this.shares) return 0;
  return this.shares.facebook + this.shares.twitter +
         this.shares.linkedin + this.shares.whatsapp;
});

// Static method to get featured posts
postSchema.statics.getFeatured = async function(limit = 5) {
  return await this.find({
    isFeatured: true,
    status: 'published'
  })
  .sort({ featuredAt: -1 })
  .limit(limit)
  .populate('author', 'name avatar')
  .lean();
};

// Static method to get recent posts
postSchema.statics.getRecent = async function(limit = 10, category = null) {
  const query = { status: 'published' };
  if (category) query.category = category;

  return await this.find(query)
  .sort({ publishedAt: -1 })
  .limit(limit)
  .populate('author', 'name avatar')
  .lean();
};

// Static method to get posts by tag
postSchema.statics.getByTag = async function(tag, limit = 10) {
  return await this.find({
    tags: tag,
    status: 'published'
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .populate('author', 'name avatar')
  .lean();
};

// Method to increment view count
postSchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('Post', postSchema);
