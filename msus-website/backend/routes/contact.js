/**
 * Contact Routes
 * Handles contact form and message management
 */

const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');

// Import controllers
const {
  submitContact,
  getContacts,
  getContact,
  addResponse,
  assignContact,
  resolveContact,
  updateStatus,
  getStats,
  getPending,
  deleteContact
} = require('../controllers/contactController');

// Public routes
/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 * @access  Public
 */
router.post('/', submitContact);

// Protected routes
router.use(protect);

/**
 * @route   GET /api/contact/stats
 * @desc    Get contact statistics
 * @access  Private (Admin)
 */
router.get('/stats', isAdmin, getStats);

/**
 * @route   GET /api/contact/pending
 * @desc    Get pending messages
 * @access  Private (Admin)
 */
router.get('/pending', isAdmin, getPending);

/**
 * @route   GET /api/contact
 * @desc    Get all contact messages
 * @access  Private (Admin)
 */
router.get('/', isAdmin, getContacts);

/**
 * @route   GET /api/contact/:id
 * @desc    Get single contact message
 * @access  Private (Admin)
 */
router.get('/:id', isAdmin, getContact);

/**
 * @route   POST /api/contact/:id/responses
 * @desc    Add response to contact
 * @access  Private (Admin)
 */
router.post('/:id/responses', isAdmin, addResponse);

/**
 * @route   PUT /api/contact/:id/assign
 * @desc    Assign contact
 * @access  Private (Admin)
 */
router.put('/:id/assign', isAdmin, assignContact);

/**
 * @route   PUT /api/contact/:id/resolve
 * @desc    Resolve contact
 * @access  Private (Admin)
 */
router.put('/:id/resolve', isAdmin, resolveContact);

/**
 * @route   PUT /api/contact/:id/status
 * @desc    Update contact status
 * @access  Private (Admin)
 */
router.put('/:id/status', isAdmin, updateStatus);

/**
 * @route   DELETE /api/contact/:id
 * @desc    Delete contact
 * @access  Private (Admin)
 */
router.delete('/:id', isAdmin, deleteContact);

module.exports = router;
