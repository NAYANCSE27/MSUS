/**
 * User Model
 * Handles member registration, authentication, and profile management
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  // Personal Information
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    trim: true
  },

  // Authentication
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },

  // Profile Information
  avatar: {
    type: String,
    default: ''
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },

  // Address Information
  address: {
    village: { type: String, trim: true },
    postOffice: { type: String, trim: true },
    union: { type: String, trim: true },
    upazila: { type: String, trim: true, default: 'Brahmanbaria' },
    district: { type: String, trim: true, default: 'Brahmanbaria' },
    division: { type: String, trim: true, default: 'Chattogram' }
  },

  // Role and Status
  role: {
    type: String,
    enum: ['member', 'volunteer', 'admin', 'superadmin'],
    default: 'member'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'inactive'],
    default: 'pending'
  },

  // Membership Details
  membershipType: {
    type: String,
    enum: ['general', 'lifetime', 'honorary'],
    default: 'general'
  },
  membershipId: {
    type: String,
    unique: true,
    sparse: true
  },
  joinedDate: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },

  // Professional Information
  occupation: {
    type: String,
    trim: true
  },
  education: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],

  // Emergency Contact
  emergencyContact: {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    relation: { type: String, trim: true }
  },

  // Activity Participation
  participatedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  donations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  }],

  // Volunteering
  volunteerAreas: [{
    type: String,
    enum: ['education', 'healthcare', 'social', 'library', 'sports', 'antidrug', 'infrastructure', 'humanitarian']
  }],
  volunteerHours: {
    type: Number,
    default: 0
  },

  // Notifications
  notifications: [{
    title: String,
    message: String,
    type: { type: String, enum: ['info', 'warning', 'success'] },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],

  // Security
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpire: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  lastLogin: Date,

  // Social Links
  socialLinks: {
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    linkedin: { type: String, trim: true }
  },

  // Bio
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ membershipId: 1 });
userSchema.index({ status: 1, role: 1 });
userSchema.index({ name: 'text', email: 'text' });

// Virtual for age
userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const diff = Date.now() - this.dateOfBirth.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
});

// Virtual for membership duration
userSchema.virtual('membershipDuration').get(function() {
  const diff = Date.now() - this.joinedDate.getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
  return { years, months };
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  // Only run if password is modified
  if (!this.isModified('password')) return next();

  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Update passwordChangedAt
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }

  next();
});

// Generate membership ID before saving
userSchema.pre('save', async function(next) {
  if (this.isNew && !this.membershipId && this.status === 'active') {
    const year = new Date().getFullYear();
    const count = await mongoose.model('User').countDocuments();
    this.membershipId = `MSUS${year}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = require('crypto').randomBytes(20).toString('hex');

  this.passwordResetToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
userSchema.methods.incrementLoginAttempts = async function() {
  // Reset if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 failed attempts
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // Lock for 2 hours
  }

  return this.updateOne(updates);
};

module.exports = mongoose.model('User', userSchema);
