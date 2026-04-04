/**
 * Settings Model
 * Stores system-wide settings and configurations
 */

const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Organization Details
  organization: {
    name: {
      en: { type: String, default: 'Mohammadpur Samaj Unnayan Sangathan' },
      bn: { type: String, default: 'মোহাম্মদপুর সমাজ উন্নয়ন সংগঠন' }
    },
    shortName: {
      en: { type: String, default: 'MSUS' },
      bn: { type: String, default: 'মোসাস' }
    },
    tagline: {
      en: { type: String, default: 'Working for a Better Tomorrow' },
      bn: { type: String, default: 'সমাজের উন্নয়নে আমরা একসাথে' }
    },
    description: {
      en: { type: String },
      bn: { type: String }
    },
    foundedYear: {
      type: Number,
      default: 2020
    },
    registrationNumber: {
      type: String
    }
  },

  // Contact Information
  contact: {
    email: {
      type: String,
      default: 'info@msus.org.bd'
    },
    phone: {
      type: String,
      default: '+880 1234-567890'
    },
    mobile: {
      type: String
    },
    whatsapp: {
      type: String
    },
    address: {
      en: {
        line1: { type: String, default: 'Mohammadpur, Ulchapara' },
        line2: { type: String, default: 'Brahmanbaria Sadar' },
        district: { type: String, default: 'Brahmanbaria' },
        division: { type: String, default: 'Chattogram' },
        postcode: { type: String, default: '3400' },
        country: { type: String, default: 'Bangladesh' }
      },
      bn: {
        line1: { type: String, default: 'মোহাম্মদপুর, উলচাপাড়া' },
        line2: { type: String, default: 'ব্রাহ্মণবাড়িয়া সদর' },
        district: { type: String, default: 'ব্রাহ্মণবাড়িয়া' },
        division: { type: String, default: 'চট্টগ্রাম' },
        postcode: { type: String, default: '৩৪০০' },
        country: { type: String, default: 'বাংলাদেশ' }
      }
    },
    mapCoordinates: {
      lat: { type: Number, default: 23.9608 },
      lng: { type: Number, default: 91.1116 }
    },
    mapEmbedUrl: {
      type: String
    }
  },

  // Social Media Links
  socialMedia: {
    facebook: {
      url: { type: String },
      pageId: { type: String }
    },
    twitter: {
      url: { type: String },
      handle: { type: String }
    },
    instagram: {
      url: { type: String }
    },
    linkedin: {
      url: { type: String }
    },
    youtube: {
      url: { type: String },
      channelId: { type: String }
    },
    whatsapp: {
      groupLink: { type: String }
    }
  },

  // Website Configuration
  website: {
    maintenanceMode: {
      type: Boolean,
      default: false
    },
    maintenanceMessage: {
      en: { type: String, default: 'We are under maintenance. Please check back later.' },
      bn: { type: String, default: 'আমরা মেইনটেনেন্সে আছি। পরে আবার চেষ্টা করুন।' }
    },
    defaultLanguage: {
      type: String,
      enum: ['en', 'bn'],
      default: 'bn'
    },
    supportedLanguages: [{
      type: String,
      enum: ['en', 'bn']
    }],
    itemsPerPage: {
      type: Number,
      default: 12
    },
    enableRegistration: {
      type: Boolean,
      default: true
    },
    enableDonations: {
      type: Boolean,
      default: true
    },
    requireApprovalForRegistration: {
      type: Boolean,
      default: true
    }
  },

  // SEO Defaults
  seo: {
    metaTitle: {
      en: { type: String },
      bn: { type: String }
    },
    metaDescription: {
      en: { type: String },
      bn: { type: String }
    },
    metaKeywords: {
      en: [{ type: String }],
      bn: [{ type: String }]
    },
    ogImage: {
      type: String
    },
    favicon: {
      type: String
    },
    googleAnalyticsId: {
      type: String
    },
    googleTagManagerId: {
      type: String
    }
  },

  // Email Templates
  emailTemplates: {
    welcome: {
      subject: { type: String, default: 'Welcome to MSUS!' },
      body: { type: String }
    },
    membershipApproved: {
      subject: { type: String, default: 'Your Membership has been Approved!' },
      body: { type: String }
    },
    donationReceipt: {
      subject: { type: String, default: 'Thank you for your Donation!' },
      body: { type: String }
    },
    eventRegistration: {
      subject: { type: String, default: 'Event Registration Confirmation' },
      body: { type: String }
    },
    contactAcknowledgement: {
      subject: { type: String, default: 'We have received your message' },
      body: { type: String }
    }
  },

  // Donation Settings
  donation: {
    minimumAmount: {
      type: Number,
      default: 100
    },
    suggestedAmounts: [{
      type: Number,
      default: [500, 1000, 2000, 5000, 10000]
    }],
    enableRecurring: {
      type: Boolean,
      default: true
    },
    enableAnonymous: {
      type: Boolean,
      default: true
    },
    showDonorList: {
      type: Boolean,
      default: true
    },
    categories: [{
      key: String,
      name: {
        en: String,
        bn: String
      },
      description: {
        en: String,
        bn: String
      },
      isActive: { type: Boolean, default: true }
    }]
  },

  // Notification Settings
  notifications: {
    adminEmails: [{
      type: String
    }],
    notifyOnNewMember: {
      type: Boolean,
      default: true
    },
    notifyOnNewDonation: {
      type: Boolean,
      default: true
    },
    notifyOnNewContact: {
      type: Boolean,
      default: true
    },
    notifyOnEventRegistration: {
      type: Boolean,
      default: true
    }
  },

  // Appearance
  appearance: {
    primaryColor: {
      type: String,
      default: '#16a34a'
    },
    secondaryColor: {
      type: String,
      default: '#15803d'
    },
    accentColor: {
      type: String,
      default: '#fbbf24'
    },
    logo: {
      type: String
    },
    logoWhite: {
      type: String
    },
    favicon: {
      type: String
    }
  },

  // Features
  features: {
    blog: { type: Boolean, default: true },
    events: { type: Boolean, default: true },
    gallery: { type: Boolean, default: true },
    contact: { type: Boolean, default: true },
    donation: { type: Boolean, default: true },
    membership: { type: Boolean, default: true },
    comments: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Static method to get settings (singleton pattern)
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

// Static method to update settings
settingsSchema.statics.updateSettings = async function(updateData) {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create(updateData);
  } else {
    Object.assign(settings, updateData);
    await settings.save();
  }
  return settings;
};

// Ensure only one document exists
settingsSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Settings').countDocuments();
    if (count > 0) {
      const error = new Error('Only one settings document is allowed');
      error.statusCode = 400;
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Settings', settingsSchema);
