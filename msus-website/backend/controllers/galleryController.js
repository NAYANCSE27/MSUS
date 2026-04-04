/**
 * Gallery Controller
 * Handles image and video gallery operations
 */

const Gallery = require('../models/Gallery');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Get all gallery items
 * @route   GET /api/gallery
 * @access  Public
 */
exports.getGallery = asyncHandler(async (req, res, next) => {
  const query = { status: 'approved' };

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Filter by type (image/video)
  if (req.query.type) {
    query.type = req.query.type;
  }

  // Filter by module
  if (req.query.module) {
    query['relatedTo.module'] = req.query.module;
  }

  // Filter by tag
  if (req.query.tag) {
    query.tags = req.query.tag;
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const items = await Gallery.find(query)
    .populate('uploadedBy', 'name avatar')
    .sort(req.query.sort || '-createdAt')
    .skip(startIndex)
    .limit(limit);

  const total = await Gallery.countDocuments(query);

  res.status(200).json({
    success: true,
    count: items.length,
    total,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: startIndex + items.length < total
    },
    data: items
  });
});

/**
 * @desc    Get single gallery item
 * @route   GET /api/gallery/:id
 * @access  Public
 */
exports.getGalleryItem = asyncHandler(async (req, res, next) => {
  const item = await Gallery.findById(req.params.id)
    .populate('uploadedBy', 'name avatar')
    .populate('relatedTo.event', 'title startDate');

  if (!item) {
    return next(new ErrorResponse(`Gallery item not found with id of ${req.params.id}`, 404));
  }

  // Increment views
  await item.incrementViews();

  res.status(200).json({
    success: true,
    data: item
  });
});

/**
 * @desc    Upload new gallery item
 * @route   POST /api/gallery
 * @access  Private (Admin)
 */
exports.uploadGalleryItem = asyncHandler(async (req, res, next) => {
  req.body.uploadedBy = req.user.id;

  // Set default status
  req.body.status = req.user.role === 'admin' || req.user.role === 'superadmin'
    ? 'approved'
    : 'pending';

  const item = await Gallery.create(req.body);

  res.status(201).json({
    success: true,
    data: item
  });
});

/**
 * @desc    Update gallery item
 * @route   PUT /api/gallery/:id
 * @access  Private (Admin)
 */
exports.updateGalleryItem = asyncHandler(async (req, res, next) => {
  const item = await Gallery.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!item) {
    return next(new ErrorResponse(`Gallery item not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: item
  });
});

/**
 * @desc    Delete gallery item
 * @route   DELETE /api/gallery/:id
 * @access  Private (Admin)
 */
exports.deleteGalleryItem = asyncHandler(async (req, res, next) => {
  const item = await Gallery.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse(`Gallery item not found with id of ${req.params.id}`, 404));
  }

  // Delete from Cloudinary if applicable
  if (item.cloudinaryId) {
    const cloudinary = require('cloudinary').v2;
    await cloudinary.uploader.destroy(item.cloudinaryId);
  }

  await item.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Get featured gallery items
 * @route   GET /api/gallery/featured
 * @access  Public
 */
exports.getFeatured = asyncHandler(async (req, res, next) => {
  const items = await Gallery.getFeatured(
    req.query.type || 'image',
    parseInt(req.query.limit) || 10
  );

  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
});

/**
 * @desc    Get gallery by category
 * @route   GET /api/gallery/category/:category
 * @access  Public
 */
exports.getByCategory = asyncHandler(async (req, res, next) => {
  const items = await Gallery.getByCategory(
    req.params.category,
    req.query.type,
    parseInt(req.query.limit) || 20
  );

  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
});

/**
 * @desc    Toggle like on gallery item
 * @route   POST /api/gallery/:id/like
 * @access  Private
 */
exports.toggleLike = asyncHandler(async (req, res, next) => {
  const item = await Gallery.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse(`Gallery item not found with id of ${req.params.id}`, 404));
  }

  await item.toggleLike(req.user.id);

  res.status(200).json({
    success: true,
    likeCount: item.likeCount,
    data: item
  });
});

/**
 * @desc    Set featured status
 * @route   PUT /api/gallery/:id/featured
 * @access  Private (Admin)
 */
exports.setFeatured = asyncHandler(async (req, res, next) => {
  const { featured, featuredOrder } = req.body;

  const item = await Gallery.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse(`Gallery item not found with id of ${req.params.id}`, 404));
  }

  item.featured = featured;
  if (featuredOrder !== undefined) {
    item.featuredOrder = featuredOrder;
  }

  await item.save();

  res.status(200).json({
    success: true,
    data: item
  });
});

/**
 * @desc    Approve gallery item
 * @route   PUT /api/gallery/:id/approve
 * @access  Private (Admin)
 */
exports.approveItem = asyncHandler(async (req, res, next) => {
  const item = await Gallery.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse(`Gallery item not found with id of ${req.params.id}`, 404));
  }

  item.status = 'approved';
  item.moderatedBy = req.user.id;
  item.moderatedAt = new Date();

  await item.save();

  res.status(200).json({
    success: true,
    data: item
  });
});

/**
 * @desc    Get gallery statistics
 * @route   GET /api/gallery/stats
 * @access  Public
 */
exports.getStats = asyncHandler(async (req, res, next) => {
  const stats = await Gallery.getStatistics();

  res.status(200).json({
    success: true,
    data: stats
  });
});
