const express = require("express");
const passport = require("passport");
const router = express.Router();
const { signupRequest, verifyOTP, login } = require("../controllers/userControler");
const { logout } = require("../controllers/logoutController"); // ⬅️ import

// Signup routes
router.post("/signup/request", signupRequest);
router.post("/signup/verify", verifyOTP);

// Login route
router.post("/login", login);

router.post("/logout", logout);

// Google auth
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign({ role: "user", email: req.user.email }, "supersecretkey", { expiresIn: "1h" });
    res.redirect(`http://localhost:5173?token=${token}`); // frontend pe redirect, adjust url
  }
);

module.exports = router;