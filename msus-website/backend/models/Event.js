/**
 * Event Model
 * Manages organizational events and activities
 */

const mongoose = require('mongoose');
const slugify = require('slugify');

const eventSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please provide event description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  summary: {
    type: String,
    maxlength: [200, 'Summary cannot be more than 200 characters']
  },

  // Category and Type
  category: {
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
      'general'
    ],
    required: true
  },
  eventType: {
    type: String,
    enum: ['workshop', 'seminar', 'campaign', 'competition', 'meeting', 'distribution', 'fundraising', 'other'],
    required: true
  },

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

  // Date and Time
  startDate: {
    type: Date,
    required: [true, 'Please provide start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide end date']
  },
  timezone: {
    type: String,
    default: 'Asia/Dhaka'
  },
  isAllDay: {
    type: Boolean,
    default: false
  },

  // Location
  location: {
    venue: {
      type: String,
      required: [true, 'Please provide venue']
    },
    address: {
      type: String,
      required: [true, 'Please provide address']
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    },
    mapUrl: {
      type: String
    }
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  onlineLink: {
    type: String
  },

  // Registration
  requiresRegistration: {
    type: Boolean,
    default: true
  },
  maxParticipants: {
    type: Number,
    default: null // null means unlimited
  },
  registrationFee: {
    type: Number,
    default: 0
  },
  registrationDeadline: {
    type: Date
  },
  registrationInstructions: {
    type: String
  },

  // Participants
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    attended: {
      type: Boolean,
      default: false
    },
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String }
    }
  }],

  // Organizers and Speakers
  organizers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['lead', 'coordinator', 'volunteer'],
      default: 'volunteer'
    }
  }],
  speakers: [{
    name: { type: String, required: true },
    designation: { type: String },
    organization: { type: String },
    photo: { type: String },
    bio: { type: String }
  }],

  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'members', 'invite_only'],
    default: 'public'
  },

  // Impact and Results
  impactMetrics: {
    beneficiaries: { type: Number, default: 0 },
    volunteers: { type: Number, default: 0 },
    itemsDistributed: { type: Number, default: 0 },
    fundsRaised: { type: Number, default: 0 }
  },
  outcome: {
    type: String,
    maxlength: [2000, 'Outcome cannot be more than 2000 characters']
  },

  // Social Sharing
  socialSharing: {
    facebook: { type: String },
    twitter: { type: String },
    linkedin: { type: String }
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
  tags: [{
    type: String,
    trim: true
  }],

  // Created by
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
eventSchema.index({ slug: 1 });
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ title: 'text', description: 'text' });

// Generate slug before saving
eventSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  next();
});

// Virtual for participant count
eventSchema.virtual('participantCount').get(function() {
  return this.participants ? this.participants.length : 0;
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  if (!this.maxParticipants) return null; // Unlimited
  const registered = this.participants ? this.participants.length : 0;
  return Math.max(0, this.maxParticipants - registered);
});

// Virtual for isFull
eventSchema.virtual('isFull').get(function() {
  if (!this.maxParticipants) return false;
  const registered = this.participants ? this.participants.length : 0;
  return registered >= this.maxParticipants;
});

// Virtual for isUpcoming
eventSchema.virtual('isUpcoming').get(function() {
  return this.startDate > new Date();
});

// Virtual for isOngoing
eventSchema.virtual('isOngoing').get(function() {
  const now = new Date();
  return this.startDate <= now && this.endDate >= now;
});

// Virtual for duration
eventSchema.virtual('duration').get(function() {
  const diff = this.endDate - this.startDate;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  return { hours, days };
});

// Static method to get upcoming events
eventSchema.statics.getUpcoming = async function(limit = 10) {
  return await this.find({
    startDate: { $gt: new Date() },
    status: 'published'
  })
  .sort({ startDate: 1 })
  .limit(limit)
  .populate('organizers.user', 'name avatar')
  .populate('createdBy', 'name avatar');
};

// Static method to get events by category
eventSchema.statics.getByCategory = async function(category, limit = 10) {
  return await this.find({
    category,
    status: 'published'
  })
  .sort({ startDate: -1 })
  .limit(limit)
  .populate('organizers.user', 'name avatar');
};

// Method to register participant
eventSchema.methods.registerParticipant = async function(userId) {
  // Check if already registered
  const alreadyRegistered = this.participants.some(
    p => p.user && p.user.toString() === userId.toString()
  );

  if (alreadyRegistered) {
    throw new Error('User is already registered for this event');
  }

  // Check if event is full
  if (this.isFull) {
    throw new Error('Event is full');
  }

  // Check registration deadline
  if (this.registrationDeadline && new Date() > this.registrationDeadline) {
    throw new Error('Registration deadline has passed');
  }

  this.participants.push({ user: userId });
  return this.save();
};

module.exports = mongoose.model('Event', eventSchema);
