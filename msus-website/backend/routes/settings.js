/**
 * Settings Routes
 * Handles system-wide configuration
 */

const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');

// Import controllers
const {
  getSettings,
  updateSettings,
  updateOrganization,
  updateContact,
  updateSocialMedia,
  updateAppearance,
  updateDonationSettings,
  updateNotifications,
  updateSeo,
  toggleFeature,
  uploadLogo,
  getSiteStats
} = require('../controllers/settingsController');

// Import upload config
const upload = require('../config/upload');

// Public route - returns limited settings
/**
 * @route   GET /api/settings
 * @desc    Get settings
 * @access  Public
 */
router.get('/', getSettings);

// Protected routes
router.use(protect);
router.use(isAdmin);

/**
 * @route   PUT /api/settings
 * @desc    Update all settings
 * @access  Private (Admin)
 */
router.put('/', updateSettings);

/**
 * @route   PUT /api/settings/organization
 * @desc    Update organization info
 * @access  Private (Admin)
 */
router.put('/organization', updateOrganization);

/**
 * @route   PUT /api/settings/contact
 * @desc    Update contact info
 * @access  Private (Admin)
 */
router.put('/contact', updateContact);

/**
 * @route   PUT /api/settings/social
 * @desc    Update social media links
 * @access  Private (Admin)
 */
router.put('/social', updateSocialMedia);

/**
 * @route   PUT /api/settings/appearance
 * @desc    Update appearance settings
 * @access  Private (Admin)
 */
router.put('/appearance', updateAppearance);

/**
 * @route   PUT /api/settings/donation
 * @desc    Update donation settings
 * @access  Private (Admin)
 */
router.put('/donation', updateDonationSettings);

/**
 * @route   PUT /api/settings/notifications
 * @desc    Update notification settings
 * @access  Private (Admin)
 */
router.put('/notifications', updateNotifications);

/**
 * @route   PUT /api/settings/seo
 * @desc    Update SEO settings
 * @access  Private (Admin)
 */
router.put('/seo', updateSeo);

/**
 * @route   PUT /api/settings/features/:feature
 * @desc    Toggle feature
 * @access  Private (Admin)
 */
router.put('/features/:feature', toggleFeature);

/**
 * @route   POST /api/settings/logo
 * @desc    Upload logo
 * @access  Private (Admin)
 */
router.post('/logo', upload.single('logo'), uploadLogo);

/**
 * @route   GET /api/settings/admin/stats
 * @desc    Get site statistics
 * @access  Private (Admin)
 */
router.get('/admin/stats', getSiteStats);

module.exports = router;
