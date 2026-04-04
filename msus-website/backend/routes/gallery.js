/**
 * Gallery Routes
 * Handles image and video gallery endpoints
 */

const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');

// Import controllers
const {
  getGallery,
  getGalleryItem,
  uploadGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getFeatured,
  getByCategory,
  toggleLike,
  setFeatured,
  approveItem,
  getStats
} = require('../controllers/galleryController');

// Public routes
/**
 * @route   GET /api/gallery
 * @desc    Get all gallery items
 * @access  Public
 */
router.get('/', getGallery);

/**
 * @route   GET /api/gallery/featured
 * @desc    Get featured gallery items
 * @access  Public
 */
router.get('/featured', getFeatured);

/**
 * @route   GET /api/gallery/category/:category
 * @desc    Get gallery by category
 * @access  Public
 */
router.get('/category/:category', getByCategory);

/**
 * @route   GET /api/gallery/stats
 * @desc    Get gallery statistics
 * @access  Public
 */
router.get('/stats', getStats);

/**
 * @route   GET /api/gallery/:id
 * @desc    Get single gallery item
 * @access  Public
 */
router.get('/:id', getGalleryItem);

// Protected routes
router.use(protect);

/**
 * @route   POST /api/gallery/:id/like
 * @desc    Like/unlike gallery item
 * @access  Private
 */
router.post('/:id/like', toggleLike);

// Admin routes
/**
 * @route   POST /api/gallery
 * @desc    Upload gallery item
 * @access  Private (Admin)
 */
router.post('/', isAdmin, uploadGalleryItem);

/**
 * @route   PUT /api/gallery/:id
 * @desc    Update gallery item
 * @access  Private (Admin)
 */
router.put('/:id', isAdmin, updateGalleryItem);

/**
 * @route   DELETE /api/gallery/:id
 * @desc    Delete gallery item
 * @access  Private (Admin)
 */
router.delete('/:id', isAdmin, deleteGalleryItem);

/**
 * @route   PUT /api/gallery/:id/featured
 * @desc    Set featured status
 * @access  Private (Admin)
 */
router.put('/:id/featured', isAdmin, setFeatured);

/**
 * @route   PUT /api/gallery/:id/approve
 * @desc    Approve gallery item
 * @access  Private (Admin)
 */
router.put('/:id/approve', isAdmin, approveItem);

module.exports = router;
