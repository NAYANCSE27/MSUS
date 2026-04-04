/**
 * Donation Routes
 * Handles donation and payment endpoints
 */

const express = require('express');
const router = express.Router();
const { protect, isAdmin, optional } = require('../middleware/auth');

// Import controllers
const {
  createDonation,
  confirmStripePayment,
  getDonations,
  getDonation,
  getPublicDonors,
  getStats,
  updateDonation,
  deleteDonation,
  webhook
} = require('../controllers/donationController');

/**
 * @route   GET /api/donations/public
 * @desc    Get public donor list
 * @access  Public
 */
router.get('/public', getPublicDonors);

/**
 * @route   GET /api/donations/stats
 * @desc    Get donation statistics
 * @access  Public
 */
router.get('/stats', getStats);

/**
 * @route   POST /api/donations
 * @desc    Create new donation
 * @access  Public
 */
router.post('/', optional, createDonation);

/**
 * @route   POST /api/donations/confirm-stripe
 * @desc    Confirm Stripe payment
 * @access  Public
 */
router.post('/confirm-stripe', confirmStripePayment);

/**
 * @route   POST /api/donations/webhook
 * @desc    Stripe webhook
 * @access  Public (Stripe only)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

// Protected routes
router.use(protect);

/**
 * @route   GET /api/donations
 * @desc    Get all donations (admin)
 * @access  Private (Admin)
 */
router.get('/', isAdmin, getDonations);

/**
 * @route   GET /api/donations/:id
 * @desc    Get single donation
 * @access  Private
 */
router.get('/:id', getDonation);

/**
 * @route   PUT /api/donations/:id
 * @desc    Update donation
 * @access  Private (Admin)
 */
router.put('/:id', isAdmin, updateDonation);

/**
 * @route   DELETE /api/donations/:id
 * @desc    Delete donation
 * @access  Private (Admin)
 */
router.delete('/:id', isAdmin, deleteDonation);

module.exports = router;
