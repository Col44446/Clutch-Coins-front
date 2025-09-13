const express = require("express");
const router = express.Router();
const { loginAdmin, createBlog, createAdmin, getAllAdmins, deleteAdmin } = require("../controllers/adminControler");
const upload = require("../middleware/upload");
const adminAuth = require("../middleware/adminAuth"); // 🔹 JWT middleware import
const { logout } = require("../controllers/logoutController"); // ⬅️ import

// Admin login route
router.post("/login", loginAdmin);
router.post("/logout", logout);

// Blog create route — only admin can access
router.post("/blog", adminAuth, upload.single("image"), createBlog);

// Admin user management routes — only existing admins can access
router.post("/create-admin", adminAuth, createAdmin);
router.get("/admins", adminAuth, getAllAdmins);
router.delete("/admin/:adminId", adminAuth, deleteAdmin);

module.exports = router;