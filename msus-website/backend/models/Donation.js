/**
 * Donation Model
 * Handles donation records, tracking, and donor management
 */

const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  // Donor Information
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous donations
  },
  donorName: {
    type: String,
    required: [true, 'Please provide donor name'],
    trim: true
  },
  donorEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  donorPhone: {
    type: String,
    trim: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  showInPublicList: {
    type: Boolean,
    default: true
  },

  // Donation Details
  amount: {
    type: Number,
    required: [true, 'Please provide donation amount'],
    min: [1, 'Amount must be at least 1']
  },
  currency: {
    type: String,
    enum: ['BDT', 'USD', 'EUR', 'GBP'],
    default: 'BDT'
  },

  // Category/Program
  category: {
    type: String,
    enum: [
      'general',
      'education',
      'healthcare',
      'social_awareness',
      'library',
      'sports',
      'antidrug',
      'infrastructure',
      'humanitarian',
      'zakat',
      'sadaqah',
      'emergency'
    ],
    default: 'general'
  },
  purpose: {
    type: String,
    trim: true
  },

  // Payment Information
  paymentMethod: {
    type: String,
    enum: ['stripe', 'bkash', 'nagad', 'rocket', 'bank_transfer', 'cash', 'cheque'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    trim: true
  },
  paymentGatewayResponse: {
    type: mongoose.Schema.Types.Mixed
  },

  // Stripe/bKash specific fields
  stripePaymentIntentId: {
    type: String
  },
  bkashPaymentId: {
    type: String
  },

  // Recurring Donation
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringType: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    required: function() {
      return this.isRecurring;
    }
  },

  // Receipt
  receiptNumber: {
    type: String,
    unique: true
  },
  receiptSent: {
    type: Boolean,
    default: false
  },
  receiptSentAt: {
    type: Date
  },

  // Notes
  notes: {
    type: String,
    trim: true
  },
  adminNotes: {
    type: String,
    trim: true
  },

  // Verification
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },

  // Receipt URL (for digital receipts)
  receiptUrl: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ paymentStatus: 1 });
donationSchema.index({ category: 1 });
donationSchema.index({ receiptNumber: 1 });
donationSchema.index({ createdAt: -1 });

// Generate receipt number before saving
donationSchema.pre('save', async function(next) {
  if (this.isNew && !this.receiptNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Donation').countDocuments({
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    });
    this.receiptNumber = `MSUS-DON-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Virtual for formatted amount
donationSchema.virtual('formattedAmount').get(function() {
  const symbols = {
    BDT: '৳',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };
  return `${symbols[this.currency] || this.currency}${this.amount.toLocaleString()}`;
});

// Static method to get donation statistics
donationSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $match: { paymentStatus: 'completed' }
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        totalDonations: { $sum: 1 },
        avgDonation: { $avg: '$amount' },
        maxDonation: { $max: '$amount' },
        minDonation: { $min: '$amount' }
      }
    }
  ]);

  const categoryStats = await this.aggregate([
    {
      $match: { paymentStatus: 'completed' }
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  const monthlyStats = await this.aggregate([
    {
      $match: { paymentStatus: 'completed' }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 }
  ]);

  return {
    overall: stats[0] || { totalAmount: 0, totalDonations: 0, avgDonation: 0 },
    byCategory: categoryStats,
    monthly: monthlyStats
  };
};

// Static method to get top donors
donationSchema.statics.getTopDonors = async function(limit = 10) {
  return await this.aggregate([
    {
      $match: {
        paymentStatus: 'completed',
        isAnonymous: false,
        showInPublicList: true
      }
    },
    {
      $group: {
        _id: '$donorEmail',
        name: { $first: '$donorName' },
        totalAmount: { $sum: '$amount' },
        donationCount: { $sum: 1 },
        lastDonation: { $max: '$createdAt' }
      }
    },
    {
      $sort: { totalAmount: -1 }
    },
    {
      $limit: limit
    }
  ]);
};

module.exports = mongoose.model('Donation', donationSchema);
