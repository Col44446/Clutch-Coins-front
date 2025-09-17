const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    password: { 
        type: String, 
        required: true,
        minlength: [8, 'Password must be at least 8 characters long']
    }, 
    email: { 
        type: String, 
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    role: {
        type: String,
        enum: ['super-admin', 'content-manager', 'support'],
        default: 'content-manager'
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin',
        default: null
    },
    lastLogin: { type: Date, default: null },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

// Indexes for better performance
adminSchema.index({ email: 1 });
adminSchema.index({ username: 1 });
adminSchema.index({ isActive: 1 });

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Account lockout functionality
adminSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

module.exports = mongoose.model("Admin", adminSchema);
