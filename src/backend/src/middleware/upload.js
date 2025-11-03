// campusia-backend/src/middleware/upload.js
// File upload middleware using Cloudinary for persistent cloud storage

const multer = require('multer');
const { uploadBase64Image, deleteImage: deleteCloudinaryImage } = require('../config/cloudinary');
const path = require('path');

// ============================================
// CLOUDINARY CLOUD STORAGE (Recommended)
// ============================================

/**
 * Multer configuration for Cloudinary upload
 * Uses memory storage to keep files in buffer (not saved to disk)
 */
const storage = multer.memoryStorage();

// File filter - only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: fileFilter
});

/**
 * Upload multiple images middleware (for multipart/form-data)
 */
const uploadImages = upload.array('images', 10); // Max 10 images

/**
 * Process uploaded files and upload to Cloudinary
 * @param {Array} files - Array of multer file objects (with buffer)
 * @returns {Promise<Array>} - Array of Cloudinary URLs
 */
async function processFilesToCloudinary(files) {
  try {
    const uploadPromises = files.map(async (file) => {
      // Convert buffer to base64
      const base64String = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      
      // Upload to Cloudinary
      const result = await uploadBase64Image(base64String, {
        folder: 'campusia-events',
        resource_type: 'auto'
      });
      
      return result.url;
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Process files to Cloudinary error:', error);
    throw error;
  }
}

/**
 * Save base64 image directly to Cloudinary (no local storage)
 * @param {string} base64String - Base64 encoded image
 * @returns {Promise<string>} - Cloudinary URL
 */
const saveBase64Image = async (base64String) => {
  try {
    // Validate base64 format
    const matches = base64String.match(/^data:image\/(\w+);base64,(.+)$/);
    
    if (!matches) {
      throw new Error('Invalid base64 image format');
    }

    // Upload to Cloudinary
    const result = await uploadBase64Image(base64String, {
      folder: 'campusia-events',
      resource_type: 'auto'
    });

    console.log('✅ Image uploaded to Cloudinary:', result.url);
    return result.url; // Return full Cloudinary URL (not filename)

  } catch (error) {
    console.error('Save base64 image to Cloudinary error:', error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} imageUrl - Full Cloudinary URL or public ID
 * @returns {Promise<boolean>}
 */
const deleteImage = async (imageUrl) => {
  try {
    // If it's a full URL, extract public ID
    let publicId = imageUrl;
    
    if (imageUrl.includes('cloudinary.com')) {
      // Example: https://res.cloudinary.com/cloud/image/upload/v123/campusia-events/abc.jpg
      // Extract: campusia-events/abc
      const matches = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
      publicId = matches ? matches[1] : imageUrl;
    }

    const deleted = await deleteCloudinaryImage(publicId);
    
    if (deleted) {
      console.log('✅ Image deleted from Cloudinary:', publicId);
    } else {
      console.warn('⚠️ Failed to delete image from Cloudinary:', publicId);
    }
    
    return deleted;
  } catch (error) {
    console.error('Delete image from Cloudinary error:', error);
    return false;
  }
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
  uploadImages,              // Multer middleware for multipart/form-data
  processFilesToCloudinary,  // Convert multer files to Cloudinary URLs
  saveBase64Image,          // Upload base64 directly to Cloudinary
  deleteImage               // Delete from Cloudinary
};

// ============================================
// USAGE EXAMPLES
// ============================================

/*
Example 1: Multipart form upload (traditional file upload)
----------------------------------------------------------
router.post('/upload', uploadImages, async (req, res) => {
  const cloudinaryUrls = await processFilesToCloudinary(req.files);
  res.json({ urls: cloudinaryUrls });
});

Example 2: Base64 upload (current approach)
-------------------------------------------
router.post('/event', async (req, res) => {
  const { images } = req.body; // Array of base64 strings
  const cloudinaryUrls = await Promise.all(
    images.map(base64 => saveBase64Image(base64))
  );
  res.json({ images: cloudinaryUrls });
});

Example 3: Delete image
-----------------------
router.delete('/image', async (req, res) => {
  const { imageUrl } = req.body;
  const deleted = await deleteImage(imageUrl);
  res.json({ success: deleted });
});
*/
