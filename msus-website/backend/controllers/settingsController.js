/**
 * Settings Controller
 * Handles system-wide settings and configurations
 */

const Settings = require('../models/Settings');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Get all settings
 * @route   GET /api/settings
 * @access  Public (limited) / Private (Admin)
 */
exports.getSettings = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  // If public request, return only necessary fields
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
    const publicSettings = {
      organization: settings.organization,
      contact: settings.contact,
      socialMedia: settings.socialMedia,
      website: settings.website,
      appearance: settings.appearance,
      donation: {
        minimumAmount: settings.donation.minimumAmount,
        suggestedAmounts: settings.donation.suggestedAmounts,
        categories: settings.donation.categories.filter(c => c.isActive)
      },
      features: settings.features
    };

    return res.status(200).json({
      success: true,
      data: publicSettings
    });
  }

  res.status(200).json({
    success: true,
    data: settings
  });
});

/**
 * @desc    Update settings
 * @route   PUT /api/settings
 * @access  Private (Admin)
 */
exports.updateSettings = asyncHandler(async (req, res, next) => {
  const settings = await Settings.updateSettings(req.body);

  res.status(200).json({
    success: true,
    data: settings
  });
});

/**
 * @desc    Update organization info
 * @route   PUT /api/settings/organization
 * @access  Private (Admin)
 */
exports.updateOrganization = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  if (req.body.name) {
    settings.organization.name = { ...settings.organization.name, ...req.body.name };
  }
  if (req.body.tagline) {
    settings.organization.tagline = { ...settings.organization.tagline, ...req.body.tagline };
  }
  if (req.body.description) {
    settings.organization.description = { ...settings.organization.description, ...req.body.description };
  }
  if (req.body.foundedYear) settings.organization.foundedYear = req.body.foundedYear;
  if (req.body.registrationNumber) settings.organization.registrationNumber = req.body.registrationNumber;

  await settings.save();

  res.status(200).json({
    success: true,
    data: settings
  });
});

/**
 * @desc    Update contact info
 * @route   PUT /api/settings/contact
 * @access  Private (Admin)
 */
exports.updateContact = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  if (req.body.email) settings.contact.email = req.body.email;
  if (req.body.phone) settings.contact.phone = req.body.phone;
  if (req.body.mobile) settings.contact.mobile = req.body.mobile;
  if (req.body.whatsapp) settings.contact.whatsapp = req.body.whatsapp;
  if (req.body.address) {
    settings.contact.address = { ...settings.contact.address, ...req.body.address };
  }
  if (req.body.mapCoordinates) {
    settings.contact.mapCoordinates = req.body.mapCoordinates;
  }

  await settings.save();

  res.status(200).json({
    success: true,
    data: settings
  });
});

/**
 * @desc    Update social media links
 * @route   PUT /api/settings/social
 * @access  Private (Admin)
 */
exports.updateSocialMedia = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  settings.socialMedia = { ...settings.socialMedia, ...req.body };

  await settings.save();

  res.status(200).json({
    success: true,
    data: settings
  });
});

/**
 * @desc    Update appearance
 * @route   PUT /api/settings/appearance
 * @access  Private (Admin)
 */
exports.updateAppearance = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  settings.appearance = { ...settings.appearance, ...req.body };

  await settings.save();

  res.status(200).json({
    success: true,
    data: settings
  });
});

/**
 * @desc    Update donation settings
 * @route   PUT /api/settings/donation
 * @access  Private (Admin)
 */
exports.updateDonationSettings = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  settings.donation = { ...settings.donation, ...req.body };

  await settings.save();

  res.status(200).json({
    success: true,
    data: settings
  });
});

/**
 * @desc    Update notification settings
 * @route   PUT /api/settings/notifications
 * @access  Private (Admin)
 */
exports.updateNotifications = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  settings.notifications = { ...settings.notifications, ...req.body };

  await settings.save();

  res.status(200).json({
    success: true,
    data: settings
  });
});

/**
 * @desc    Update SEO settings
 * @route   PUT /api/settings/seo
 * @access  Private (Admin)
 */
exports.updateSeo = asyncHandler(async (req, res, next) => {
  const settings = await Settings.getSettings();

  settings.seo = { ...settings.seo, ...req.body };

  await settings.save();

  res.status(200).json({
    success: true,
    data: settings
  });
});

/**
 * @desc    Toggle feature
 * @route   PUT /api/settings/features/:feature
 * @access  Private (Admin)
 */
exports.toggleFeature = asyncHandler(async (req, res, next) => {
  const { feature } = req.params;
  const { enabled } = req.body;

  const settings = await Settings.getSettings();

  if (settings.features.hasOwnProperty(feature)) {
    settings.features[feature] = enabled;
    await settings.save();
  } else {
    return next(new ErrorResponse('Feature not found', 404));
  }

  res.status(200).json({
    success: true,
    data: settings.features
  });
});

/**
 * @desc    Upload logo
 * @route   PUT /api/settings/logo
 * @access  Private (Admin)
 */
exports.uploadLogo = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const settings = await Settings.getSettings();
  settings.appearance.logo = req.file.path;
  await settings.save();

  res.status(200).json({
    success: true,
    data: settings.appearance
  });
});

/**
 * @desc    Get site statistics
 * @route   GET /api/settings/stats
 * @access  Private (Admin)
 */
exports.getSiteStats = asyncHandler(async (req, res, next) => {
  const User = require('../models/User');
  const Donation = require('../models/Donation');
  const Event = require('../models/Event');
  const Post = require('../models/Post');
  const Gallery = require('../models/Gallery');
  const Contact = require('../models/Contact');

  // Get counts
  const [
    totalMembers,
    activeMembers,
    pendingMembers,
    totalDonations,
    completedDonations,
    totalEvents,
    upcomingEvents,
    totalPosts,
    totalGallery,
    pendingContacts
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: 'active' }),
    User.countDocuments({ status: 'pending' }),
    Donation.countDocuments(),
    Donation.countDocuments({ paymentStatus: 'completed' }),
    Event.countDocuments(),
    Event.countDocuments({ startDate: { $gte: new Date() }, status: 'published' }),
    Post.countDocuments({ status: 'published' }),
    Gallery.countDocuments({ status: 'approved' }),
    Contact.countDocuments({ status: { $in: ['new', 'in_progress'] } })
  ]);

  // Get donation total
  const donationStats = await Donation.getStatistics();

  res.status(200).json({
    success: true,
    data: {
      members: {
        total: totalMembers,
        active: activeMembers,
        pending: pendingMembers
      },
      donations: {
        total: totalDonations,
        completed: completedDonations,
        totalAmount: donationStats.overall.totalAmount || 0
      },
      events: {
        total: totalEvents,
        upcoming: upcomingEvents
      },
      posts: totalPosts,
      gallery: totalGallery,
      pendingContacts
    }
  });
});
