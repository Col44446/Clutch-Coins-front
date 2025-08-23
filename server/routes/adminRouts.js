const express = require("express");
const router = express.Router();
const { loginAdmin, createBlog } = require("../controllers/adminControler");
const upload = require("../middleware/upload");
const adminAuth = require("../middleware/adminAuth"); // 🔹 JWT middleware import
const { logout } = require("../controllers/logoutController"); // ⬅️ import

// Admin login route
router.post("/login", loginAdmin);
router.post("/logout", logout);
// Blog create route — only admin can access
router.post("/blog", adminAuth, upload.single("image"), createBlog);

module.exports = router;