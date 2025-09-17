const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Verify Cloudinary environment variables
const requiredEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
let storage;

if (missingVars.length > 0) {
  console.warn(`⚠️  Warning: Missing Cloudinary environment variables: ${missingVars.join(', ')}`);
  console.warn('⚠️  Falling back to local file storage');
  
  // Local file storage configuration as fallback
  const uploadDir = path.join(__dirname, '../uploads');
  
  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  console.log('✅ Using local file storage');
} else {
  // Cloudinary Config
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Always use HTTPS
    api_proxy: process.env.HTTP_PROXY // Add proxy if needed
  });
  
  console.log('✅ Cloudinary configured with:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'not set',
    api_secret: process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'not set'
  });
  
  // Test Cloudinary connection
  if (process.env.NODE_ENV !== 'test') {
    cloudinary.api.ping()
      .then(() => console.log('✅ Connected to Cloudinary'))
      .catch(err => {
        console.error('❌ Cloudinary connection error:', err.message);
        console.error('❌ Error details:', err);
      });
  }
  
  // Configure Cloudinary storage
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => ({
      folder: 'game_uploads',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 630, crop: 'fill', quality: 'auto' },
        { fetch_format: 'auto' }
      ],
      public_id: `game-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
      overwrite: false
    })
  });
}

module.exports = { cloudinary, storage };
