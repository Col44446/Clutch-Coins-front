const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    index: true
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[+]?[\d\s\-\(\)]{10,15}$/, 'Please enter a valid phone number']
  },
  otp: { 
    type: String, 
    required: true,
    minlength: [4, 'OTP must be at least 4 digits'],
    maxlength: [8, 'OTP cannot exceed 8 digits']
  },
  type: {
    type: String,
    enum: ['email-verification', 'phone-verification', 'password-reset', 'login'],
    required: true
  },
  attempts: {
    type: Number,
    default: 0,
    max: [5, 'Maximum 5 attempts allowed']
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  usedAt: {
    type: Date
  },
  expiresAt: { 
    type: Date, 
    required: true,
    index: { expireAfterSeconds: 0 } // TTL index for automatic deletion
  }
}, {
  timestamps: true
});

// Indexes for better performance
otpSchema.index({ email: 1, type: 1, isUsed: 1 });
otpSchema.index({ phone: 1, type: 1, isUsed: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Validation: Either email or phone must be present
otpSchema.pre('validate', function(next) {
  if (!this.email && !this.phone) {
    next(new Error('Either email or phone number is required'));
  } else {
    next();
  }
});

// Method to check if OTP is valid
otpSchema.methods.isValid = function() {
  return !this.isUsed && this.expiresAt > new Date() && this.attempts < 5;
};

// Method to mark OTP as used
otpSchema.methods.markAsUsed = function() {
  this.isUsed = true;
  this.usedAt = new Date();
  return this.save();
};

module.exports = mongoose.model("OTP", otpSchema);