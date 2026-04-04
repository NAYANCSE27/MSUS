/**
 * Donation Controller
 * Handles donation operations and payment processing
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Donation = require('../models/Donation');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Create new donation
 * @route   POST /api/donations
 * @access  Public
 */
exports.createDonation = asyncHandler(async (req, res, next) => {
  const {
    amount,
    currency = 'BDT',
    category,
    purpose,
    paymentMethod,
    isAnonymous,
    showInPublicList,
    donorName,
    donorEmail,
    donorPhone,
    isRecurring,
    recurringType
  } = req.body;

  // Validate amount
  if (!amount || amount < 100) {
    return next(new ErrorResponse('Minimum donation amount is 100 BDT', 400));
  }

  // Create donation record
  const donationData = {
    amount,
    currency,
    category: category || 'general',
    purpose,
    paymentMethod,
    isAnonymous: isAnonymous || false,
    showInPublicList: showInPublicList !== false,
    donorName: donorName || 'Anonymous',
    donorEmail,
    donorPhone,
    isRecurring: isRecurring || false,
    paymentStatus: 'pending'
  };

  // Add user if authenticated
  if (req.user) {
    donationData.donor = req.user.id;
  }

  if (isRecurring) {
    donationData.recurringType = recurringType;
  }

  const donation = await Donation.create(donationData);

  // Handle Stripe payment
  if (paymentMethod === 'stripe') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to smallest currency unit
        currency: currency.toLowerCase(),
        automatic_payment_methods: { enabled: true },
        metadata: {
          donationId: donation._id.toString(),
          category: category || 'general',
          donorEmail: donorEmail || ''
        }
      });

      donation.stripePaymentIntentId = paymentIntent.id;
      await donation.save();

      return res.status(200).json({
        success: true,
        data: {
          donation,
          clientSecret: paymentIntent.client_secret
        }
      });
    } catch (err) {
      console.error('Stripe error:', err);
      return next(new ErrorResponse('Payment initialization failed', 500));
    }
  }

  // Handle bKash (placeholder for SSLCommerz/bKash integration)
  if (paymentMethod === 'bkash') {
    // bKash integration would go here
    return res.status(200).json({
      success: true,
      data: {
        donation,
        bkashURL: `${process.env.BKASH_BASE_URL}/checkout/payment/create`
      }
    });
  }

  // For bank transfer/cash, just save the donation
  res.status(201).json({
    success: true,
    data: donation,
    message: 'Donation recorded. Please complete the bank transfer using the provided receipt number.'
  });
});

/**
 * @desc    Confirm Stripe payment
 * @route   POST /api/donations/confirm-stripe
 * @access  Public
 */
exports.confirmStripePayment = asyncHandler(async (req, res, next) => {
  const { paymentIntentId } = req.body;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    return next(new ErrorResponse('Payment not completed', 400));
  }

  const donation = await Donation.findOne({ stripePaymentIntentId: paymentIntentId });

  if (!donation) {
    return next(new ErrorResponse('Donation not found', 404));
  }

  donation.paymentStatus = 'completed';
  donation.paymentGatewayResponse = paymentIntent;
  await donation.save();

  // Send receipt email
  try {
    const sendEmail = require('../utils/sendEmail');
    await sendEmail({
      email: donation.donorEmail,
      subject: 'Thank you for your Donation to MSUS!',
      message: `Dear ${donation.donorName},\n\nThank you for your generous donation of ${donation.formattedAmount} to Mohammadpur Samaj Unnayan Sangathan.\n\nReceipt Number: ${donation.receiptNumber}\n\nYour contribution will help us continue our work in community development.\n\nBest regards,\nMSUS Team`
    });
  } catch (err) {
    console.error('Receipt email error:', err);
  }

  res.status(200).json({
    success: true,
    data: donation
  });
});

/**
 * @desc    Get all donations (Admin)
 * @route   GET /api/donations
 * @access  Private (Admin)
 */
exports.getDonations = asyncHandler(async (req, res, next) => {
  const query = {};

  // Filter by status
  if (req.query.status) {
    query.paymentStatus = req.query.status;
  }

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Filter by date range
  if (req.query.startDate && req.query.endDate) {
    query.createdAt = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const donations = await Donation.find(query)
    .populate('donor', 'name email avatar')
    .populate('verifiedBy', 'name')
    .sort('-createdAt')
    .skip(startIndex)
    .limit(limit);

  const total = await Donation.countDocuments(query);

  // Calculate total amount
  const totalAmount = await Donation.aggregate([
    { $match: { ...query, paymentStatus: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  res.status(200).json({
    success: true,
    count: donations.length,
    total,
    totalAmount: totalAmount[0]?.total || 0,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: startIndex + donations.length < total
    },
    data: donations
  });
});

/**
 * @desc    Get donation by ID
 * @route   GET /api/donations/:id
 * @access  Private
 */
exports.getDonation = asyncHandler(async (req, res, next) => {
  const donation = await Donation.findById(req.params.id)
    .populate('donor', 'name email avatar')
    .populate('verifiedBy', 'name');

  if (!donation) {
    return next(new ErrorResponse(`Donation not found with id of ${req.params.id}`, 404));
  }

  // Check if user owns the donation or is admin
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin' &&
donation.donor?.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to access this donation', 403));
  }

  res.status(200).json({
    success: true,
    data: donation
  });
});

/**
 * @desc    Get public donor list
 * @route   GET /api/donations/public
 * @access  Public
 */
exports.getPublicDonors = asyncHandler(async (req, res, next) => {
  const donors = await Donation.aggregate([
    {
      $match: {
        paymentStatus: 'completed',
        isAnonymous: false,
        showInPublicList: true
      }
    },
    {
      $group: {
        _id: '$donorEmail',
        name: { $first: '$donorName' },
        totalAmount: { $sum: '$amount' },
        donationCount: { $sum: 1 },
        lastDonation: { $max: '$createdAt' }
      }
    },
    { $sort: { totalAmount: -1 } },
    { $limit: 50 }
  ]);

  res.status(200).json({
    success: true,
    count: donors.length,
    data: donors
  });
});

/**
 * @desc    Get donation statistics
 * @route   GET /api/donations/stats
 * @access  Public
 */
exports.getStats = asyncHandler(async (req, res, next) => {
  const stats = await Donation.getStatistics();

  res.status(200).json({
    success: true,
    data: stats
  });
});

/**
 * @desc    Update donation (verify bank transfer)
 * @route   PUT /api/donations/:id
 * @access  Private (Admin)
 */
exports.updateDonation = asyncHandler(async (req, res, next) => {
  const { paymentStatus, transactionId, adminNotes } = req.body;

  const donation = await Donation.findById(req.params.id);

  if (!donation) {
    return next(new ErrorResponse(`Donation not found with id of ${req.params.id}`, 404));
  }

  if (paymentStatus) {
    donation.paymentStatus = paymentStatus;
  }

  if (transactionId) {
    donation.transactionId = transactionId;
  }

  if (adminNotes) {
    donation.adminNotes = adminNotes;
  }

  // If verifying payment
  if (paymentStatus === 'completed' && donation.paymentStatus !== 'completed') {
    donation.verifiedBy = req.user.id;
    donation.verifiedAt = new Date();
  }

  await donation.save();

  res.status(200).json({
    success: true,
    data: donation
  });
});

/**
 * @desc    Delete donation
 * @route   DELETE /api/donations/:id
 * @access  Private (Admin)
 */
exports.deleteDonation = asyncHandler(async (req, res, next) => {
  const donation = await Donation.findById(req.params.id);

  if (!donation) {
    return next(new ErrorResponse(`Donation not found with id of ${req.params.id}`, 404));
  }

  await donation.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Stripe webhook handler
 * @route   POST /api/donations/webhook
 * @access  Public (Stripe)
 */
exports.webhook = asyncHandler(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    const donation = await Donation.findOne({
      stripePaymentIntentId: paymentIntent.id
    });

    if (donation) {
      donation.paymentStatus = 'completed';
      await donation.save();
    }
  }

  res.json({ received: true });
});
