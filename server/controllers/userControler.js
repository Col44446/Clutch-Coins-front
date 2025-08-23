const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const SECRET_KEY = "supersecretkey"; // .env me store karna better hoga

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Signup request: validate, send OTP
exports.signupRequest = async (req, res) => {
  const { name, email, dob, password, confirmPassword } = req.body;

  if (!name || !email || !dob || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords don't match" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: "Email already exists" });
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  await OTP.findOneAndDelete({ email }); // Remove old OTP
  const newOTP = new OTP({ email, otp, expiresAt });
  await newOTP.save();

  // Send email
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Your OTP for Signup",
    text: `OTP: ${otp}. Expires in 5 minutes.`,
  });

  res.json({ success: true, message: "OTP sent to email" });
};

// Verify OTP and create user
exports.verifyOTP = async (req, res) => {
  const { email, otp, name, dob, password } = req.body;
  const otpRecord = await OTP.findOne({ email, otp });

  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }

  const newUser = new User({ name, email, dob, password });
  await newUser.save();
  await OTP.deleteOne({ _id: otpRecord._id });

  const token = jwt.sign({ role: "user", email }, SECRET_KEY, { expiresIn: "1h" });

  res.json({
    success: true,
    token,
    message: "User created and logged in",
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email
    }
  });
};

// Login with email/password
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign({ role: "user", email }, SECRET_KEY, { expiresIn: "1h" });

  res.json({
    success: true,
    token,
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email
    }
  });
};
