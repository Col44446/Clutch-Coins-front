const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken"); // Added jsonwebtoken
const router = express.Router();
const { signupRequest, verifyOTP, login } = require("../controllers/userControler");
const { logout } = require("../controllers/logoutController");
const { getUserPurchases, getUserProfile, updateUserProfile } = require("../controllers/userController");
const auth = require("../middleware/auth");

// Signup routes
router.post("/signup/request", signupRequest);
router.post("/signup/verify", verifyOTP);

// Login route
router.post("/login", login);

router.post("/logout", logout);

// User profile and purchase routes
router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile);
router.get("/purchases", auth, getUserPurchases);

// Google auth
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    try {
      const token = jwt.sign(
        { 
          userId: req.user._id,
          role: req.user.role || "user", 
          email: req.user.email 
        }, 
        process.env.JWT_SECRET || "supersecretkey", 
        { expiresIn: "7d" }
      );
      
      // Redirect to frontend with token
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${frontendURL}/auth/callback?token=${token}`);
    } catch (error) {
      console.error("Google auth callback error:", error);
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}?error=auth_failed`);
    }
  }
);

module.exports = router;