// campusia-backend/src/config/cloudinary.js
// Cloudinary configuration for persistent image storage

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
// Cloudinary SDK automatically reads CLOUDINARY_URL from environment variables
// CLOUDINARY_URL format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
// You can also manually configure with individual env vars if needed:
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

if (process.env.CLOUDINARY_URL) {
  // Cloudinary library will automatically use CLOUDINARY_URL
  console.log('✅ Cloudinary configured via CLOUDINARY_URL');
  console.log('   Cloud Name:', cloudinary.config().cloud_name);
} else {
  console.warn('⚠️ CLOUDINARY_URL not set - image uploads will not work on production!');
  console.warn('Get your CLOUDINARY_URL from: https://console.cloudinary.com/');
  console.warn('Add it to Render Environment Variables: CLOUDINARY_URL=cloudinary://...');
}

/**
 * Upload base64 image to Cloudinary
 * @param {string} base64String - Base64 encoded image
 * @param {object} options - Upload options
 * @returns {Promise<object>} - Cloudinary response with secure_url
 */
async function uploadBase64Image(base64String, options = {}) {
  try {
    if (!process.env.CLOUDINARY_URL) {
      throw new Error('CLOUDINARY_URL environment variable is not configured');
    }

    const result = await cloudinary.uploader.upload(base64String, {
      folder: options.folder || 'campusia-events',
      resource_type: 'auto',
      ...options
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary: ' + error.message);
  }
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<boolean>}
 */
async function deleteImage(publicId) {
  try {
    if (!process.env.CLOUDINARY_URL) {
      console.warn('CLOUDINARY_URL not set, skipping delete');
      return false;
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

/**
 * Extract Cloudinary public ID from URL
 * @param {string} imageUrl - Cloudinary image URL
 * @returns {string|null} - Public ID or null
 */
function extractPublicId(imageUrl) {
  try {
    // Example URL: https://res.cloudinary.com/CLOUD_NAME/image/upload/v1234567890/campusia-events/abc123.jpg
    const matches = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return matches ? matches[1] : null;
  } catch (error) {
    console.error('Extract public ID error:', error);
    return null;
  }
}

module.exports = {
  uploadBase64Image,
  deleteImage,
  extractPublicId,
  cloudinary
};
