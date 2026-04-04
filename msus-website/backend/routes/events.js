/**
 * Event Routes
 * Handles event management endpoints
 */

const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');

// Import controllers
const {
  getEvents,
  getEvent,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  checkRegistration,
  getUpcomingEvents,
  markAttendance,
  addOutcome
} = require('../controllers/eventController');

// Public routes
/**
 * @route   GET /api/events
 * @desc    Get all events
 * @access  Public
 */
router.get('/', getEvents);

/**
 * @route   GET /api/events/upcoming
 * @desc    Get upcoming events
 * @access  Public
 */
router.get('/upcoming', getUpcomingEvents);

/**
 * @route   GET /api/events/slug/:slug
 * @desc    Get event by slug
 * @access  Public
 */
router.get('/slug/:slug', getEventBySlug);

/**
 * @route   GET /api/events/:id
 * @desc    Get single event
 * @access  Public
 */
router.get('/:id', getEvent);

// Protected routes
router.use(protect);

/**
 * @route   POST /api/events/:id/register
 * @desc    Register for event
 * @access  Private
 */
router.post('/:id/register', registerForEvent);

/**
 * @route   DELETE /api/events/:id/register
 * @desc    Unregister from event
 * @access  Private
 */
router.delete('/:id/register', unregisterFromEvent);

/**
 * @route   GET /api/events/:id/registration-status
 * @desc    Check registration status
 * @access  Private
 */
router.get('/:id/registration-status', checkRegistration);

// Admin routes
/**
 * @route   POST /api/events
 * @desc    Create event
 * @access  Private (Admin)
 */
router.post('/', isAdmin, createEvent);

/**
 * @route   PUT /api/events/:id
 * @desc    Update event
 * @access  Private (Admin)
 */
router.put('/:id', isAdmin, updateEvent);

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete event
 * @access  Private (Admin)
 */
router.delete('/:id', isAdmin, deleteEvent);

/**
 * @route   PUT /api/events/:id/attendance
 * @desc    Mark attendance
 * @access  Private (Admin)
 */
router.put('/:id/attendance', isAdmin, markAttendance);

/**
 * @route   PUT /api/events/:id/outcome
 * @desc    Add event outcome
 * @access  Private (Admin)
 */
router.put('/:id/outcome', isAdmin, addOutcome);

module.exports = router;
