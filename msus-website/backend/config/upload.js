/**
 * File Upload Configuration
 * Configures multer for file uploads
 */

const multer = require('multer');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ErrorResponse('Only image files are allowed (jpg, jpeg, png, gif, webp)', 400), false);
  }
};

// Upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Cloudinary upload helper (for production)
const cloudinaryUpload = async (file) => {
  const cloudinary = require('cloudinary').v2;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'msus',
      use_filename: true,
      unique_filename: true
    });

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    throw new ErrorResponse('Image upload failed', 500);
  }
};

module.exports = upload;
module.exports.cloudinaryUpload = cloudinaryUpload;
