/**
 * Authentication Middleware
 * Protects routes and checks user roles
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Protect routes - verify token
 */
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Check if user is active
    if (user.status !== 'active') {
      return next(new ErrorResponse('Account is not active', 401));
    }

    // Check if password was changed after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(new ErrorResponse('Password recently changed. Please log in again', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

/**
 * Optional authentication - doesn't require token but adds user if present
 */
exports.optional = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.status === 'active') {
        req.user = user;
      }
    } catch (err) {
      // Continue without user
    }
  }

  next();
};

/**
 * Grant access to specific roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(
        `User role ${req.user.role} is not authorized to access this route`,
        403
      ));
    }

    next();
  };
};

/**
 * Check if user is admin
 */
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return next(new ErrorResponse('Admin access required', 403));
  }

  next();
};

/**
 * Check if user is super admin
 */
exports.isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  if (req.user.role !== 'superadmin') {
    return next(new ErrorResponse('Super Admin access required', 403));
  }

  next();
};
