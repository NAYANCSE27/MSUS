/**
 * Event Controller
 * Handles event management and registration
 */

const Event = require('../models/Event');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Get all events
 * @route   GET /api/events
 * @access  Public
 */
exports.getEvents = asyncHandler(async (req, res, next) => {
  const query = { status: { $in: ['published', 'completed'] } };

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Filter by event type
  if (req.query.eventType) {
    query.eventType = req.query.eventType;
  }

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Upcoming events only
  if (req.query.upcoming === 'true') {
    query.startDate = { $gte: new Date() };
  }

  // Past events only
  if (req.query.past === 'true') {
    query.endDate = { $lt: new Date() };
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;

  const events = await Event.find(query)
    .populate('organizers.user', 'name avatar')
    .populate('createdBy', 'name avatar')
    .sort(req.query.sort || '-startDate')
    .skip(startIndex)
    .limit(limit);

  const total = await Event.countDocuments(query);

  res.status(200).json({
    success: true,
    count: events.length,
    total,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: startIndex + events.length < total
    },
    data: events
  });
});

/**
 * @desc    Get single event
 * @route   GET /api/events/:id
 * @access  Public
 */
exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate('organizers.user', 'name avatar phone email')
    .populate('participants.user', 'name avatar')
    .populate('createdBy', 'name avatar')
    .populate('speakers');

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: event
  });
});

/**
 * @desc    Get event by slug
 * @route   GET /api/events/slug/:slug
 * @access  Public
 */
exports.getEventBySlug = asyncHandler(async (req, res, next) => {
  const event = await Event.findOne({
    slug: req.params.slug,
    status: { $in: ['published', 'completed'] }
  })
    .populate('organizers.user', 'name avatar')
    .populate('participants.user', 'name avatar')
    .populate('createdBy', 'name avatar');

  if (!event) {
    return next(new ErrorResponse(`Event not found`, 404));
  }

  res.status(200).json({
    success: true,
    data: event
  });
});

/**
 * @desc    Create new event
 * @route   POST /api/events
 * @access  Private (Admin)
 */
exports.createEvent = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;

  // Parse dates
  if (req.body.startDate) {
    req.body.startDate = new Date(req.body.startDate);
  }
  if (req.body.endDate) {
    req.body.endDate = new Date(req.body.endDate);
  }
  if (req.body.registrationDeadline) {
    req.body.registrationDeadline = new Date(req.body.registrationDeadline);
  }

  const event = await Event.create(req.body);

  res.status(201).json({
    success: true,
    data: event
  });
});

/**
 * @desc    Update event
 * @route   PUT /api/events/:id
 * @access  Private (Admin)
 */
exports.updateEvent = asyncHandler(async (req, res, next) => {
  req.body.updatedBy = req.user.id;

  // Parse dates
  if (req.body.startDate) {
    req.body.startDate = new Date(req.body.startDate);
  }
  if (req.body.endDate) {
    req.body.endDate = new Date(req.body.endDate);
  }

  const event = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: event
  });
});

/**
 * @desc    Delete event
 * @route   DELETE /api/events/:id
 * @access  Private (Admin)
 */
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
  }

  await event.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Register for event
 * @route   POST /api/events/:id/register
 * @access  Private
 */
exports.registerForEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
  }

  // Check if registration is required
  if (!event.requiresRegistration) {
    return next(new ErrorResponse('Registration is not required for this event', 400));
  }

  try {
    await event.registerParticipant(req.user.id);
  } catch (err) {
    return next(new ErrorResponse(err.message, 400));
  }

  // Send confirmation email
  try {
    const sendEmail = require('../utils/sendEmail');
    await sendEmail({
      email: req.user.email,
      subject: `Registration Confirmed: ${event.title}`,
      message: `Dear ${req.user.name},\n\nYou have successfully registered for "${event.title}".\n\nDate: ${event.startDate.toLocaleDateString('bn-BD')}\nLocation: ${event.location.venue}, ${event.location.address}\n\nWe look forward to seeing you there!\n\nBest regards,\nMSUS Team`
    });
  } catch (err) {
    console.error('Registration email error:', err);
  }

  res.status(200).json({
    success: true,
    message: 'Successfully registered for event',
    data: event
  });
});

/**
 * @desc    Unregister from event
 * @route   DELETE /api/events/:id/register
 * @access  Private
 */
exports.unregisterFromEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
  }

  // Remove participant
  event.participants = event.participants.filter(
    p => p.user.toString() !== req.user.id
  );

  await event.save();

  res.status(200).json({
    success: true,
    message: 'Successfully unregistered from event',
    data: event
  });
});

/**
 * @desc    Check user registration status
 * @route   GET /api/events/:id/registration-status
 * @access  Private
 */
exports.checkRegistration = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
  }

  const isRegistered = event.participants.some(
    p => p.user.toString() === req.user.id
  );

  res.status(200).json({
    success: true,
    data: { isRegistered }
  });
});

/**
 * @desc    Get upcoming events
 * @route   GET /api/events/upcoming
 * @access  Public
 */
exports.getUpcomingEvents = asyncHandler(async (req, res, next) => {
  const events = await Event.getUpcoming(req.query.limit);

  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
});

/**
 * @desc    Mark attendance
 * @route   PUT /api/events/:id/attendance
 * @access  Private (Admin)
 */
exports.markAttendance = asyncHandler(async (req, res, next) => {
  const { userId, attended } = req.body;

  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
  }

  const participant = event.participants.find(
    p => p.user.toString() === userId
  );

  if (!participant) {
    return next(new ErrorResponse('User is not registered for this event', 400));
  }

  participant.attended = attended;
  await event.save();

  res.status(200).json({
    success: true,
    data: event
  });
});

/**
 * @desc    Add event outcome/result
 * @route   PUT /api/events/:id/outcome
 * @access  Private (Admin)
 */
exports.addOutcome = asyncHandler(async (req, res, next) => {
  const { outcome, impactMetrics } = req.body;

  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
  }

  if (outcome) event.outcome = outcome;
  if (impactMetrics) event.impactMetrics = impactMetrics;
  event.status = 'completed';

  await event.save();

  res.status(200).json({
    success: true,
    data: event
  });
});
