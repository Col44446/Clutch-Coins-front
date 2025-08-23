const path = require("path");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat_Uploads",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4", "pdf", "mp3", "webm"],
    resource_type: "auto",
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|mp4|pdf|mp3|webm/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    console.log("File check:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      extname: extname,
    }); // Add this
    if (extname && mimetype) {
      console.log("File accepted:", file.originalname);
      return cb(null, true);
    }
    console.log("File rejected:", file.originalname);
    cb(new Error("Invalid file type! Only images, videos, PDFs, MP3, or WEBM allowed."));
  },
});

module.exports = upload;