/**
 * Post Controller
 * Handles blog posts, news, and announcements
 */

const Post = require('../models/Post');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Get all posts
 * @route   GET /api/posts
 * @access  Public
 */
exports.getPosts = asyncHandler(async (req, res, next) => {
  const query = { status: 'published' };

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Filter by subcategory
  if (req.query.subcategory) {
    query.subcategory = req.query.subcategory;
  }

  // Filter by language
  if (req.query.language) {
    query.language = req.query.language;
  }

  // Filter by tag
  if (req.query.tag) {
    query.tags = req.query.tag;
  }

  // Search
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;

  let posts = Post.find(query)
    .populate('author', 'name avatar')
    .sort(req.query.sort || '-publishedAt')
    .skip(startIndex)
    .limit(limit);

  // If text search, add score
  if (req.query.search) {
    posts = posts.select('-__v');
  }

  posts = await posts;

  const total = await Post.countDocuments(query);

  res.status(200).json({
    success: true,
    count: posts.length,
    total,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: startIndex + posts.length < total
    },
    data: posts
  });
});

/**
 * @desc    Get single post
 * @route   GET /api/posts/:id
 * @access  Public
 */
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'name avatar bio')
    .populate('coAuthors', 'name avatar');

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  // Increment views
  await post.incrementViews();

  res.status(200).json({
    success: true,
    data: post
  });
});

/**
 * @desc    Get post by slug
 * @route   GET /api/posts/slug/:slug
 * @access  Public
 */
exports.getPostBySlug = asyncHandler(async (req, res, next) => {
  const post = await Post.findOne({
    slug: req.params.slug,
    status: 'published'
  })
    .populate('author', 'name avatar bio')
    .populate('coAuthors', 'name avatar');

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  // Increment views
  await post.incrementViews();

  // Get related posts
  const relatedPosts = await Post.find({
    _id: { $ne: post._id },
    category: post.category,
    status: 'published'
  })
    .select('title slug featuredImage publishedAt')
    .limit(4)
    .lean();

  res.status(200).json({
    success: true,
    data: {
      post,
      relatedPosts
    }
  });
});

/**
 * @desc    Create new post
 * @route   POST /api/posts
 * @access  Private (Admin)
 */
exports.createPost = asyncHandler(async (req, res, next) => {
  req.body.author = req.user.id;

  const post = await Post.create(req.body);

  res.status(201).json({
    success: true,
    data: post
  });
});

/**
 * @desc    Update post
 * @route   PUT /api/posts/:id
 * @access  Private (Admin)
 */
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  // Store version history
  if (req.body.content && post.content !== req.body.content) {
    post.versions.push({
      title: post.title,
      content: post.content,
      updatedBy: req.user.id
    });
  }

  post = await Post.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: post
  });
});

/**
 * @desc    Delete post
 * @route   DELETE /api/posts/:id
 * @access  Private (Admin)
 */
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  await post.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Get featured posts
 * @route   GET /api/posts/featured
 * @access  Public
 */
exports.getFeaturedPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.getFeatured(req.query.limit || 5);

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts
  });
});

/**
 * @desc    Get posts by category
 * @route   GET /api/posts/category/:category
 * @access  Public
 */
exports.getPostsByCategory = asyncHandler(async (req, res, next) => {
  const posts = await Post.getRecent(req.query.limit || 10, req.params.category);

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts
  });
});

/**
 * @desc    Get posts by tag
 * @route   GET /api/posts/tag/:tag
 * @access  Public
 */
exports.getPostsByTag = asyncHandler(async (req, res, next) => {
  const posts = await Post.getByTag(req.params.tag, req.query.limit || 10);

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts
  });
});

/**
 * @desc    Add comment to post
 * @route   POST /api/posts/:id/comments
 * @access  Private
 */
exports.addComment = asyncHandler(async (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return next(new ErrorResponse('Please provide comment content', 400));
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  post.comments.push({
    user: req.user.id,
    content
  });

  await post.save();

  res.status(201).json({
    success: true,
    data: post
  });
});

/**
 * @desc    Like/unlike post
 * @route   POST /api/posts/:id/like
 * @access  Private
 */
exports.toggleLike = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  const likeIndex = post.likes.findIndex(
    like => like.user.toString() === req.user.id
  );

  if (likeIndex > -1) {
    // Unlike
    post.likes.splice(likeIndex, 1);
  } else {
    // Like
    post.likes.push({ user: req.user.id });
  }

  await post.save();

  res.status(200).json({
    success: true,
    likeCount: post.likeCount,
    liked: likeIndex === -1 // If was not liked before, now it is
  });
});

/**
 * @desc    Approve comment
 * @route   PUT /api/posts/:id/comments/:commentId/approve
 * @access  Private (Admin)
 */
exports.approveComment = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  const comment = post.comments.id(req.params.commentId);

  if (!comment) {
    return next(new ErrorResponse('Comment not found', 404));
  }

  comment.status = 'approved';
  await post.save();

  res.status(200).json({
    success: true,
    data: post
  });
});
