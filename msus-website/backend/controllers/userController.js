/**
 * User Controller
 * Handles member management operations
 */

const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Get all users/members
 * @route   GET /api/users
 * @access  Private (Admin)
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  // Build query
  const query = {};

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by role
  if (req.query.role) {
    query.role = req.query.role;
  }

  // Filter by membership type
  if (req.query.membershipType) {
    query.membershipType = req.query.membershipType;
  }

  // Search by name or email
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const users = await User.find(query)
    .select('-password')
    .populate('approvedBy', 'name')
    .sort(req.query.sort || '-createdAt')
    .skip(startIndex)
    .limit(limit);

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: startIndex + users.length < total
    },
    data: users
  });
});

/**
 * @desc    Get single user
 * @route   GET /api/users/:id
 * @access  Private
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate('participatedEvents', 'title startDate featuredImage')
    .populate('donations', 'amount status createdAt');

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Update user (Admin only)
 * @route   PUT /api/users/:id
 * @access  Private (Admin)
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private (Admin)
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  // Prevent deleting superadmin
  if (user.role === 'superadmin' && req.user.role !== 'superadmin') {
    return next(new ErrorResponse('Cannot delete superadmin account', 403));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Approve member
 * @route   PUT /api/users/:id/approve
 * @access  Private (Admin)
 */
exports.approveMember = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  if (user.status === 'active') {
    return next(new ErrorResponse('User is already approved', 400));
  }

  // Generate membership ID
  const year = new Date().getFullYear();
  const count = await User.countDocuments({ membershipId: { $exists: true } });
  const membershipId = `MSUS${year}${String(count + 1).padStart(4, '0')}`;

  user.status = 'active';
  user.membershipId = membershipId;
  user.approvedBy = req.user.id;
  user.approvedAt = new Date();

  await user.save();

  // Send approval email
  try {
    const sendEmail = require('../utils/sendEmail');
    await sendEmail({
      email: user.email,
      subject: 'Your MSUS Membership has been Approved!',
      message: `Dear ${user.name},\n\nCongratulations! Your membership application has been approved. Your Membership ID is: ${membershipId}\n\nYou can now log in and access all member features.\n\nBest regards,\nMSUS Team`
    });
  } catch (err) {
    console.error('Approval email could not be sent', err);
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Reject/Suspend member
 * @route   PUT /api/users/:id/reject
 * @access  Private (Admin)
 */
exports.rejectMember = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  if (user.role === 'superadmin') {
    return next(new ErrorResponse('Cannot reject superadmin', 403));
  }

  user.status = 'suspended';
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Update user role
 * @route   PUT /api/users/:id/role
 * @access  Private (Admin)
 */
exports.updateRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  if (!role || !['member', 'volunteer', 'admin', 'superadmin'].includes(role)) {
    return next(new ErrorResponse('Please provide a valid role', 400));
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  // Only superadmin can assign superadmin role
  if (role === 'superadmin' && req.user.role !== 'superadmin') {
    return next(new ErrorResponse('Not authorized to assign superadmin role', 403));
  }

  // Cannot change own role
  if (user._id.toString() === req.user.id) {
    return next(new ErrorResponse('Cannot change your own role', 400));
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Get membership statistics
 * @route   GET /api/users/stats
 * @access  Private (Admin)
 */
exports.getStats = asyncHandler(async (req, res, next) => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const roleStats = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);

  const membershipTypeStats = await User.aggregate([
    {
      $group: {
        _id: '$membershipType',
        count: { $sum: 1 }
      }
    }
  ]);

  // New members this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const newThisMonth = await User.countDocuments({
    createdAt: { $gte: startOfMonth },
    status: 'active'
  });

  res.status(200).json({
    success: true,
    data: {
      byStatus: stats,
      byRole: roleStats,
      byMembershipType: membershipTypeStats,
      newThisMonth
    }
  });
});

/**
 * @desc    Get volunteer opportunities
 * @route   GET /api/users/volunteers
 * @access  Public
 */
exports.getVolunteers = asyncHandler(async (req, res, next) => {
  const volunteers = await User.find({
    role: { $in: ['volunteer', 'admin', 'superadmin'] },
    status: 'active'
  })
  .select('name avatar volunteerAreas volunteerHours')
  .sort('-volunteerHours');

  res.status(200).json({
    success: true,
    count: volunteers.length,
    data: volunteers
  });
});

/**
 * @desc    Add volunteer hours
 * @route   PUT /api/users/:id/volunteer-hours
 * @access  Private (Admin)
 */
exports.addVolunteerHours = asyncHandler(async (req, res, next) => {
  const { hours } = req.body;

  if (!hours || hours <= 0) {
    return next(new ErrorResponse('Please provide valid hours', 400));
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  user.volunteerHours += hours;
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});
