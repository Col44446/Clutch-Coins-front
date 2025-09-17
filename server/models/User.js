const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  dob: { 
    type: Date, 
    required: false,
    validate: {
      validator: function(value) {
        return !value || value < new Date();
      },
      message: 'Date of birth cannot be in the future'
    }
  },
  password: { 
    type: String,
    minlength: [8, 'Password must be at least 8 characters long']
  },
  googleId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'premium', 'vip'],
    default: "user" 
  },
  avatar: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[+]?[\d\s\-\(\)]{10,15}$/, 'Please enter a valid phone number']
  },
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  preferences: {
    newsletter: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true },
    language: { type: String, default: 'en' }
  },
  totalSpent: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ totalSpent: -1 });

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Account lockout functionality
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Calculate user tier based on spending
userSchema.virtual('tier').get(function() {
  if (this.totalSpent >= 10000) return 'vip';
  if (this.totalSpent >= 5000) return 'premium';
  return 'user';
});

module.exports = mongoose.model("User", userSchema);