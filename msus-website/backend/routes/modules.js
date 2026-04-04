/**
 * Activity Module Routes
 * Handles the 8 organizational activity areas
 */

const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');

// Import controllers
const {
  getModules,
  getModule,
  createModule,
  updateModule,
  addProject,
  updateProject,
  deleteProject,
  addSuccessStory,
  updateStats,
  getStats
} = require('../controllers/activityModuleController');

// Public routes
/**
 * @route   GET /api/modules
 * @desc    Get all modules
 * @access  Public
 */
router.get('/', getModules);

/**
 * @route   GET /api/modules/stats/overview
 * @desc    Get module statistics overview
 * @access  Public
 */
router.get('/stats/overview', getStats);

/**
 * @route   GET /api/modules/:type
 * @desc    Get single module
 * @access  Public
 */
router.get('/:type', getModule);

// Admin routes
router.use(protect);
router.use(isAdmin);

/**
 * @route   POST /api/modules
 * @desc    Create module
 * @access  Private (Admin)
 */
router.post('/', createModule);

/**
 * @route   PUT /api/modules/:type
 * @desc    Update module
 * @access  Private (Admin)
 */
router.put('/:type', updateModule);

/**
 * @route   POST /api/modules/:type/projects
 * @desc    Add project to module
 * @access  Private (Admin)
 */
router.post('/:type/projects', addProject);

/**
 * @route   PUT /api/modules/:type/projects/:projectId
 * @desc    Update project
 * @access  Private (Admin)
 */
router.put('/:type/projects/:projectId', updateProject);

/**
 * @route   DELETE /api/modules/:type/projects/:projectId
 * @desc    Delete project
 * @access  Private (Admin)
 */
router.delete('/:type/projects/:projectId', deleteProject);

/**
 * @route   POST /api/modules/:type/success-stories
 * @desc    Add success story
 * @access  Private (Admin)
 */
router.post('/:type/success-stories', addSuccessStory);

/**
 * @route   PUT /api/modules/:type/stats
 * @desc    Update module statistics
 * @access  Private (Admin)
 */
router.put('/:type/stats', updateStats);

module.exports = router;
