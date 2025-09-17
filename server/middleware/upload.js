const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Local file storage configuration
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Check if Cloudinary is configured
let storage;
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  try {
    const { CloudinaryStorage } = require("multer-storage-cloudinary");
    const cloudinary = require("cloudinary").v2;

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    storage = new CloudinaryStorage({
      cloudinary,
      params: (req, file) => {
        // Dynamic transformation based on field name and route
        let transformation;
        
        if (file.fieldname === 'portraitImage') {
          // Portrait images use 9:16 aspect ratio
          transformation = [
            { width: 900, height: 1600, crop: 'fit', quality: 'auto' },
            { fetch_format: 'auto' }
          ];
        } else if (file.fieldname === 'squareImage') {
          // Square images use 1:1 aspect ratio
          transformation = [
            { width: 800, height: 800, crop: 'fit', quality: 'auto' },
            { fetch_format: 'auto' }
          ];
        } else if (req.route && req.route.path.includes('/hero')) {
          // Hero games use 16:9 aspect ratio
          transformation = [
            { width: 1600, height: 900, crop: 'fit', quality: 'auto' },
            { fetch_format: 'auto' }
          ];
        } else {
          // Default fallback
          transformation = [
            { width: 900, height: 1600, crop: 'fit', quality: 'auto' },
            { fetch_format: 'auto' }
          ];
        }
        
        return {
          folder: "game_uploads",
          allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
          resource_type: "auto",
          transformation: transformation
        };
      },
    });
  } catch (error) {
    console.warn("Cloudinary not properly configured. Falling back to local storage.", error);
    storage = localStorage;
  }
} else {
  console.warn("Cloudinary environment variables not found. Using local file storage.");
  storage = localStorage;
}

// File filter function
const fileFilter = (req, file, cb) => {
  try {
    // Check file types
    const filetypes = /jpe?g|png|webp|avif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    // Handle MIME types for different image formats including AVIF
    const mimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    const mimetype = mimeTypes.includes(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      const error = new Error('Only image files (JPEG, JPG, PNG, WEBP, AVIF) are allowed!');
      error.code = 'LIMIT_FILE_TYPES';
      return cb(error, false);
    }
  } catch (err) {
    console.error('File filter error:', err);
    const error = new Error('Error processing file upload');
    error.code = 'FILE_PROCESSING_ERROR';
    return cb(error, false);
  }
};

// Configure multer with Cloudinary storage
// Create the multer instance
const multerInstance = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Allow multiple files for dual image upload
  },
  onError: function(err, next) {
    console.error('Multer error:', err);
    next(err);
  }
});

// Create a wrapper function for single file uploads
const upload = {
  single: (fieldName) => (req, res, next) => {
    console.log('=== Starting file upload ===');
    console.log('Field name:', fieldName);
    
    // Log request headers for debugging
    console.log('Content-Type header:', req.headers['content-type']);
    console.log('Content-Length:', req.headers['content-length']);
    
    // Add error handler for uncaught errors
    const errorHandler = (err) => {
      console.error('File upload error:', {
        error: err.message,
        stack: err.stack,
        code: err.code,
        field: err.field,
        storageErrors: err.storageErrors
      });
      
      if (!res.headersSent) {
        return handleUploadErrors(err, req, res, next);
      }
    };
    
    try {
      multerInstance.single(fieldName)(req, res, function(err) {
        if (err) {
          return errorHandler(err);
        }
        
        // Log successful file processing
        if (req.file) {
          console.log('File processed successfully:', {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            destination: req.file.destination
          });
          
          // Verify file was saved correctly if using local storage
          if (req.file.path && !req.file.buffer) {
            fs.access(req.file.path, fs.constants.F_OK, (err) => {
              if (err) {
                console.error('File was not saved to disk:', err);
              } else {
                console.log('File was saved successfully to disk');
              }
            });
          }
        } else {
          console.warn('No file was processed in the request');
        }
        
        next();
      });
    } catch (err) {
      errorHandler(err);
    }
  },
  
  // Add fields method for multiple file uploads
  fields: (fields) => (req, res, next) => {
    console.log('=== Starting multiple file upload ===');
    console.log('Fields:', fields);
    
    // Add error handler for uncaught errors
    const errorHandler = (err) => {
      console.error('Multiple file upload error:', {
        error: err.message,
        stack: err.stack,
        code: err.code,
        field: err.field,
        storageErrors: err.storageErrors
      });
      
      if (!res.headersSent) {
        return handleUploadErrors(err, req, res, next);
      }
    };
    
    try {
      multerInstance.fields(fields)(req, res, function(err) {
        if (err) {
          return errorHandler(err);
        }
        
        // Log successful file processing
        if (req.files) {
          console.log('Files processed successfully:', Object.keys(req.files));
          Object.keys(req.files).forEach(fieldName => {
            req.files[fieldName].forEach(file => {
              console.log(`${fieldName}:`, {
                fieldname: file.fieldname,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                path: file.path
              });
            });
          });
        } else {
          console.warn('No files were processed in the request');
        }
        
        next();
      });
    } catch (err) {
      errorHandler(err);
    }
  }
};

// Error handling middleware
const handleUploadErrors = (err, req, res, next) => {
  if (!res.headersSent) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    
    if (err.code === 'LIMIT_FILE_TYPES') {
      return res.status(400).json({
        success: false,
        message: err.message || 'Invalid file type. Only images are allowed.'
      });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded. Maximum is 1.'
      });
    }

    // For any other errors
    console.error('Upload error:', err);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  } else {
    next(err);
  }
};

module.exports = {
  upload,
  handleUploadErrors
};