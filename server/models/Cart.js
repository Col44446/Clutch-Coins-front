const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: [true, 'Game ID is required']
  },
  gameName: { 
    type: String, 
    required: [true, 'Game name is required'],
    trim: true,
    maxlength: [255, 'Game name cannot exceed 255 characters']
  },
  gamePageName: { 
    type: String, 
    required: [true, 'Game page name is required'],
    trim: true,
    maxlength: [255, 'Game page name cannot exceed 255 characters']
  },
  gameImage: { 
    type: String, 
    required: [true, 'Game image is required'],
    trim: true,
    maxlength: [255, 'Game image cannot exceed 255 characters']
  },
  currencyName: {
    type: String,
    required: [true, 'Currency name is required'],
    trim: true,
    maxlength: [50, 'Currency name cannot exceed 50 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0'],
    max: [999999.99, 'Amount cannot exceed 999999.99']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    max: [100, 'Quantity cannot exceed 100'],
    default: 1
  },
  gameUserId: { 
    type: String, 
    required: [true, 'Game user ID is required'],
    trim: true,
    maxlength: [255, 'Game user ID cannot exceed 255 characters']
  },
  addedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and String
    required: [true, 'User ID is required'],
    index: true
  },
  originalUserId: { // Store original string userId for reference
    type: String,
    required: false
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0,
    min: [0, 'Total amount cannot be negative']
  },
  totalItems: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalAmount = this.items.reduce((total, item) => total + (item.amount * item.quantity), 0);
  next();
});

// Index for better query performance
cartSchema.index({ userId: 1 });

module.exports = mongoose.model("Cart", cartSchema);
