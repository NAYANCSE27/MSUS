/**
 * Post Routes
 * Handles blog posts, news, and announcements
 */

const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');

// Import controllers
const {
  getPosts,
  getPost,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getFeaturedPosts,
  getPostsByCategory,
  getPostsByTag,
  addComment,
  toggleLike,
  approveComment
} = require('../controllers/postController');

// Public routes
/**
 * @route   GET /api/posts
 * @desc    Get all posts
 * @access  Public
 */
router.get('/', getPosts);

/**
 * @route   GET /api/posts/featured
 * @desc    Get featured posts
 * @access  Public
 */
router.get('/featured', getFeaturedPosts);

/**
 * @route   GET /api/posts/category/:category
 * @desc    Get posts by category
 * @access  Public
 */
router.get('/category/:category', getPostsByCategory);

/**
 * @route   GET /api/posts/tag/:tag
 * @desc    Get posts by tag
 * @access  Public
 */
router.get('/tag/:tag', getPostsByTag);

/**
 * @route   GET /api/posts/slug/:slug
 * @desc    Get post by slug
 * @access  Public
 */
router.get('/slug/:slug', getPostBySlug);

/**
 * @route   GET /api/posts/:id
 * @desc    Get single post
 * @access  Public
 */
router.get('/:id', getPost);

// Protected routes
router.use(protect);

/**
 * @route   POST /api/posts/:id/comments
 * @desc    Add comment
 * @access  Private
 */
router.post('/:id/comments', addComment);

/**
 * @route   POST /api/posts/:id/like
 * @desc    Like/unlike post
 * @access  Private
 */
router.post('/:id/like', toggleLike);

// Admin routes
/**
 * @route   POST /api/posts
 * @desc    Create post
 * @access  Private (Admin)
 */
router.post('/', isAdmin, createPost);

/**
 * @route   PUT /api/posts/:id
 * @desc    Update post
 * @access  Private (Admin)
 */
router.put('/:id', isAdmin, updatePost);

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete post
 * @access  Private (Admin)
 */
router.delete('/:id', isAdmin, deletePost);

/**
 * @route   PUT /api/posts/:id/comments/:commentId/approve
 * @desc    Approve comment
 * @access  Private (Admin)
 */
router.put('/:id/comments/:commentId/approve', isAdmin, approveComment);

module.exports = router;
