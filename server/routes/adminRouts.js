const express = require("express");
const router = express.Router();
const { loginAdmin, createBlog, createAdmin, getAllAdmins, deleteAdmin } = require("../controllers/adminControler");
const { upload } = require("../middleware/upload");
const adminAuth = require("../middleware/adminAuth");
const { logout } = require("../controllers/logoutController");

// Admin login route
router.post("/login", loginAdmin);
router.post("/logout", logout);

// Blog create route — only admin can access
router.post("/blog", adminAuth, upload.single("image"), createBlog);

// Admin user management routes — only existing admins can access
router.post("/create-admin", adminAuth, createAdmin);
router.get("/admins", adminAuth, getAllAdmins);
router.delete("/admin/:adminId", adminAuth, deleteAdmin);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Admin route error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = router;