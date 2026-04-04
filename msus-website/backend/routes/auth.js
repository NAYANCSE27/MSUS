/**
 * Auth Routes
 * Handles authentication endpoints
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import controllers
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  uploadAvatar
} = require('../controllers/authController');

// Import upload middleware
const upload = require('../config/upload');

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', protect, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   PUT /api/auth/update
 * @desc    Update user details
 * @access  Private
 */
router.put('/update', protect, updateDetails);

/**
 * @route   PUT /api/auth/password
 * @desc    Update password
 * @access  Private
 */
router.put('/password', protect, updatePassword);

/**
 * @route   POST /api/auth/avatar
 * @desc    Upload avatar
 * @access  Private
 */
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

/**
 * @route   POST /api/auth/forgotpassword
 * @desc    Forgot password
 * @access  Public
 */
router.post('/forgotpassword', forgotPassword);

/**
 * @route   PUT /api/auth/resetpassword/:resettoken
 * @desc    Reset password
 * @access  Public
 */
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
