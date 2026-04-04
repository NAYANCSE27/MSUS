/**
 * Contact Controller
 * Handles contact form submissions and message management
 */

const Contact = require('../models/Contact');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const sendEmail = require('../utils/sendEmail');

/**
 * @desc    Submit contact form
 * @route   POST /api/contact
 * @access  Public
 */
exports.submitContact = asyncHandler(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    organization,
    subject,
    category,
    message
  } = req.body;

  // Create contact record
  const contactData = {
    name,
    email,
    phone,
    organization,
    subject,
    category: category || 'general',
    message,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    source: 'website'
  };

  // Add user if authenticated
  if (req.user) {
    contactData.user = req.user.id;
  }

  const contact = await Contact.create(contactData);

  // Send acknowledgment email to user
  try {
    await sendEmail({
      email: email,
      subject: 'We have received your message - MSUS',
      message: `Dear ${name},\n\nThank you for contacting Mohammadpur Samaj Unnayan Sangathan. We have received your message regarding "${subject}".\n\nOur team will review your inquiry and get back to you within 2-3 business days.\n\nMessage ID: ${contact._id}\n\nBest regards,\nMSUS Team`
    });
    contact.acknowledgementSent = true;
    await contact.save();
  } catch (err) {
    console.error('Acknowledgment email error:', err);
  }

  // Notify admin
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@msus.org.bd';
    await sendEmail({
      email: adminEmail,
      subject: `New Contact Form Submission: ${subject}`,
      message: `A new contact form has been submitted.\n\nFrom: ${name} (${email})\nSubject: ${subject}\nCategory: ${category}\n\nMessage:\n${message}\n\nView in admin panel: ${process.env.CLIENT_URL}/admin/contacts/${contact._id}`
    });
  } catch (err) {
    console.error('Admin notification email error:', err);
  }

  res.status(201).json({
    success: true,
    message: 'Thank you for your message. We will get back to you soon.',
    data: contact
  });
});

/**
 * @desc    Get all contact messages (Admin)
 * @route   GET /api/contact
 * @access  Private (Admin)
 */
exports.getContacts = asyncHandler(async (req, res, next) => {
  const query = {};

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Filter by priority
  if (req.query.priority) {
    query.priority = req.query.priority;
  }

  // Filter assigned to me
  if (req.query.assignedToMe === 'true') {
    query.assignedTo = req.user.id;
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const contacts = await Contact.find(query)
    .populate('assignedTo', 'name avatar')
    .populate('user', 'name email membershipId')
    .sort(req.query.sort || '-createdAt')
    .skip(startIndex)
    .limit(limit);

  const total = await Contact.countDocuments(query);

  res.status(200).json({
    success: true,
    count: contacts.length,
    total,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: startIndex + contacts.length < total
    },
    data: contacts
  });
});

/**
 * @desc    Get single contact message
 * @route   GET /api/contact/:id
 * @access  Private (Admin)
 */
exports.getContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id)
    .populate('assignedTo', 'name avatar')
    .populate('user', 'name email membershipId')
    .populate('responses.respondedBy', 'name avatar');

  if (!contact) {
    return next(new ErrorResponse(`Contact not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: contact
  });
});

/**
 * @desc    Add response to contact
 * @route   POST /api/contact/:id/responses
 * @access  Private (Admin)
 */
exports.addResponse = asyncHandler(async (req, res, next) => {
  const { content, isInternal } = req.body;

  if (!content) {
    return next(new ErrorResponse('Please provide response content', 400));
  }

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact not found with id of ${req.params.id}`, 404));
  }

  await contact.addResponse(content, req.user.id, isInternal);

  // Send email if not internal
  if (!isInternal) {
    try {
      await sendEmail({
        email: contact.email,
        subject: `Re: ${contact.subject} - MSUS Response`,
        message: `Dear ${contact.name},\n\nThank you for contacting us. Here is our response:\n\n${content}\n\n---\nOriginal Message:\n${contact.message}\n\nBest regards,\nMSUS Team`
      });
    } catch (err) {
      console.error('Response email error:', err);
    }
  }

  res.status(200).json({
    success: true,
    data: contact
  });
});

/**
 * @desc    Assign contact to user
 * @route   PUT /api/contact/:id/assign
 * @access  Private (Admin)
 */
exports.assignContact = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact not found with id of ${req.params.id}`, 404));
  }

  await contact.assign(userId || req.user.id);

  res.status(200).json({
    success: true,
    data: contact
  });
});

/**
 * @desc    Resolve contact
 * @route   PUT /api/contact/:id/resolve
 * @access  Private (Admin)
 */
exports.resolveContact = asyncHandler(async (req, res, next) => {
  const { resolution } = req.body;

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact not found with id of ${req.params.id}`, 404));
  }

  await contact.resolve(req.user.id, resolution);

  res.status(200).json({
    success: true,
    data: contact
  });
});

/**
 * @desc    Update contact status
 * @route   PUT /api/contact/:id/status
 * @access  Private (Admin)
 */
exports.updateStatus = asyncHandler(async (req, res, next) => {
  const { status, priority } = req.body;

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact not found with id of ${req.params.id}`, 404));
  }

  if (status) contact.status = status;
  if (priority) contact.priority = priority;

  await contact.save();

  res.status(200).json({
    success: true,
    data: contact
  });
});

/**
 * @desc    Get contact statistics
 * @route   GET /api/contact/stats
 * @access  Private (Admin)
 */
exports.getStats = asyncHandler(async (req, res, next) => {
  const stats = await Contact.getStatistics();

  res.status(200).json({
    success: true,
    data: stats
  });
});

/**
 * @desc    Get pending messages
 * @route   GET /api/contact/pending
 * @access  Private (Admin)
 */
exports.getPending = asyncHandler(async (req, res, next) => {
  const contacts = await Contact.getPending(req.query.limit || 20);

  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts
  });
});

/**
 * @desc    Delete contact
 * @route   DELETE /api/contact/:id
 * @access  Private (Admin)
 */
exports.deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact not found with id of ${req.params.id}`, 404));
  }

  await contact.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
