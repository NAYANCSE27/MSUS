/**
 * Activity Module Model
 * Manages all 8 organizational activity areas
 */

const mongoose = require('mongoose');

const activityModuleSchema = new mongoose.Schema({
  // Module Type (one of 8 activity areas)
  type: {
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
    ],
    required: true,
    unique: true
  },

  // Basic Information
  name: {
    en: { type: String, required: true },
    bn: { type: String, required: true }
  },
  shortDescription: {
    en: { type: String, maxlength: 200 },
    bn: { type: String, maxlength: 200 }
  },
  description: {
    en: { type: String, required: true },
    bn: { type: String, required: true }
  },

  // Media
  icon: {
    type: String,
    default: ''
  },
  bannerImage: {
    type: String,
    required: true
  },
  gallery: [{
    type: String
  }],

  // Statistics
  stats: {
    beneficiaries: { type: Number, default: 0 },
    completedProjects: { type: Number, default: 0 },
    ongoingProjects: { type: Number, default: 0 },
    volunteers: { type: Number, default: 0 },
    fundsRaised: { type: Number, default: 0 }
  },

  // Goals and Objectives
  mission: {
    en: String,
    bn: String
  },
  vision: {
    en: String,
    bn: String
  },
  objectives: [{
    en: { type: String },
    bn: { type: String },
    icon: String
  }],

  // Projects
  projects: [{
    title: {
      en: { type: String, required: true },
      bn: { type: String, required: true }
    },
    description: {
      en: { type: String },
      bn: { type: String }
    },
    status: {
      type: String,
      enum: ['planned', 'ongoing', 'completed', 'suspended'],
      default: 'planned'
    },
    startDate: Date,
    endDate: Date,
    budget: Number,
    raised: { type: Number, default: 0 },
    location: String,
    beneficiaries: { type: Number, default: 0 },
    images: [String],
    documents: [{
      name: String,
      url: String
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Programs/Activities
  programs: [{
    name: {
      en: { type: String, required: true },
      bn: { type: String, required: true }
    },
    description: {
      en: String,
      bn: String
    },
    icon: String,
    schedule: String,
    location: String,
    isActive: { type: Boolean, default: true }
  }],

  // Success Stories
  successStories: [{
    title: {
      en: { type: String, required: true },
      bn: { type: String, required: true }
    },
    content: {
      en: { type: String, required: true },
      bn: { type: String, required: true }
    },
    beneficiary: {
      name: String,
      photo: String,
      location: String
    },
    images: [String],
    videoUrl: String,
    impact: {
      en: String,
      bn: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Team/Coordinators
  coordinators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      en: String,
      bn: String
    },
    isLead: { type: Boolean, default: false }
  }],

  // Resources
  resources: [{
    title: {
      en: { type: String, required: true },
      bn: { type: String, required: true }
    },
    type: {
      type: String,
      enum: ['document', 'video', 'link', 'image']
    },
    url: String,
    description: {
      en: String,
      bn: String
    }
  }],

  // Impact Timeline
  impactTimeline: [{
    year: { type: Number, required: true },
    title: {
      en: { type: String, required: true },
      bn: { type: String, required: true }
    },
    description: {
      en: String,
      bn: String
    },
    metrics: {
      beneficiaries: Number,
      projectsCompleted: Number,
      fundsUtilized: Number
    },
    images: [String]
  }],

  // Get Involved
  volunteerOpportunities: [{
    title: {
      en: { type: String, required: true },
      bn: { type: String, required: true }
    },
    description: {
      en: String,
      bn: String
    },
    requirements: {
      en: [String],
      bn: [String]
    },
    timeCommitment: String,
    location: String,
    isActive: { type: Boolean, default: true }
  }],

  // Contact Information
  contactInfo: {
    email: String,
    phone: String,
    location: String
  },

  // SEO
  metaTitle: {
    en: { type: String },
    bn: { type: String }
  },
  metaDescription: {
    en: { type: String },
    bn: { type: String }
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
activityModuleSchema.index({ type: 1 });
activityModuleSchema.index({ isActive: 1, displayOrder: 1 });
activityModuleSchema.index({ 'name.en': 'text', 'description.en': 'text' });

// Virtual for total projects
activityModuleSchema.virtual('totalProjects').get(function() {
  return this.projects ? this.projects.length : 0;
});

// Virtual for active projects
activityModuleSchema.virtual('activeProjects').get(function() {
  if (!this.projects) return 0;
  return this.projects.filter(p => p.status === 'ongoing').length;
});

// Virtual for impact percentage (for fundraising)
activityModuleSchema.virtual('fundraisingProgress').get(function() {
  const activeProjects = this.projects.filter(p => p.status === 'ongoing');
  if (activeProjects.length === 0) return 0;

  const totalBudget = activeProjects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalRaised = activeProjects.reduce((sum, p) => sum + (p.raised || 0), 0);

  return totalBudget > 0 ? Math.round((totalRaised / totalBudget) * 100) : 0;
});

// Static method to get module by type
activityModuleSchema.statics.getByType = async function(type, language = 'bn') {
  const module = await this.findOne({ type, isActive: true });
  if (!module) return null;

  // Transform based on language
  if (language === 'en') {
    return {
      ...module.toObject(),
      name: module.name.en,
      description: module.description.en,
      shortDescription: module.shortDescription?.en,
      mission: module.mission?.en,
      vision: module.vision?.en
    };
  }

  return module;
};

// Static method to get all active modules
activityModuleSchema.statics.getAllActive = async function() {
  return await this.find({ isActive: true })
  .sort({ displayOrder: 1 })
  .lean();
};

// Method to add project
activityModuleSchema.methods.addProject = async function(projectData) {
  this.projects.push(projectData);
  this.stats.ongoingProjects = this.projects.filter(p => p.status === 'ongoing').length;
  return this.save();
};

// Method to add success story
activityModuleSchema.methods.addSuccessStory = async function(storyData) {
  this.successStories.push(storyData);
  return this.save();
};

module.exports = mongoose.model('ActivityModule', activityModuleSchema);
