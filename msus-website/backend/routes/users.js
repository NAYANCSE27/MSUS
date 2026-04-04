/**
 * User Routes
 * Handles member management endpoints
 */

const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');

// Import controllers
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  approveMember,
  rejectMember,
  updateRole,
  getStats,
  getVolunteers,
  addVolunteerHours
} = require('../controllers/userController');

// All routes are protected and admin only (except volunteers)
router.use(protect);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Admin)
 */
router.get('/', isAdmin, getUsers);

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private (Admin)
 */
router.get('/stats', isAdmin, getStats);

/**
 * @route   GET /api/users/volunteers
 * @desc    Get all volunteers
 * @access  Public (but protected)
 */
router.get('/volunteers', getVolunteers);

/**
 * @route   GET /api/users/:id
 * @desc    Get single user
 * @access  Private
 */
router.get('/:id', getUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private (Admin)
 */
router.put('/:id', isAdmin, updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private (Admin)
 */
router.delete('/:id', isAdmin, deleteUser);

/**
 * @route   PUT /api/users/:id/approve
 * @desc    Approve member
 * @access  Private (Admin)
 */
router.put('/:id/approve', isAdmin, approveMember);

/**
 * @route   PUT /api/users/:id/reject
 * @desc    Reject/Suspend member
 * @access  Private (Admin)
 */
router.put('/:id/reject', isAdmin, rejectMember);

/**
 * @route   PUT /api/users/:id/role
 * @desc    Update user role
 * @access  Private (Admin)
 */
router.put('/:id/role', isAdmin, updateRole);

/**
 * @route   PUT /api/users/:id/volunteer-hours
 * @desc    Add volunteer hours
 * @access  Private (Admin)
 */
router.put('/:id/volunteer-hours', isAdmin, addVolunteerHours);

module.exports = router;
