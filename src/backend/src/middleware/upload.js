// campusia-backend/src/middleware/upload.js
// File upload middleware using multer

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const uploadsDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

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
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: fileFilter
});

/**
 * Upload multiple images middleware
 */
const uploadImages = upload.array('images', 10); // Max 10 images

/**
 * Save base64 image to disk
 */
const saveBase64Image = async (base64String) => {
  try {
    // Extract base64 data and file extension
    const matches = base64String.match(/^data:image\/(\w+);base64,(.+)$/);
    
    if (!matches) {
      throw new Error('Invalid base64 image format');
    }

    const ext = matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    // Generate unique filename
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
    const filepath = path.join(uploadsDir, filename);

    // Write file
    await fs.promises.writeFile(filepath, buffer);

    return filename;

  } catch (error) {
    console.error('Save base64 image error:', error);
    throw error;
  }
};

/**
 * Delete image file
 */
const deleteImage = async (filename) => {
  try {
    const filepath = path.join(uploadsDir, filename);
    
    if (fs.existsSync(filepath)) {
      await fs.promises.unlink(filepath);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Delete image error:', error);
    return false;
  }
};

module.exports = {
  uploadImages,
  saveBase64Image,
  deleteImage
};
