const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  gameId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Game', 
    required: true,
    index: true
  },
  gameName: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [100, 'Game name cannot exceed 100 characters']
  },
  gamePageName: { 
    type: String, 
    required: true,
    trim: true
  },
  currencyName: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [50, 'Currency name cannot exceed 50 characters']
  },
  amount: { 
    type: Number, 
    required: true,
    min: [0.01, 'Amount must be greater than 0'],
    max: [999999.99, 'Amount cannot exceed 999999.99']
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0.01, 'Total amount must be greater than 0']
  },
  gameUserId: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [100, 'Game user ID cannot exceed 100 characters']
  },
  transactionId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  serialNumber: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'], 
    default: 'pending',
    index: true
  },
  paymentMethod: { 
    type: String, 
    enum: ['credit-card', 'debit-card', 'upi', 'net-banking', 'wallet', 'paypal', 'google-pay'],
    required: true
  },
  paymentGateway: {
    type: String,
    enum: ['razorpay', 'stripe', 'paypal', 'paytm', 'phonepe'],
    required: true
  },
  gatewayTransactionId: {
    type: String,
    trim: true
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'delivered', 'failed'],
    default: 'pending'
  },
  deliveredAt: { type: Date },
  failureReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Failure reason cannot exceed 500 characters']
  },
  refundAmount: {
    type: Number,
    min: [0, 'Refund amount cannot be negative']
  },
  refundedAt: { type: Date },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, { timestamps: true });

// Indexes for better performance
purchaseSchema.index({ userId: 1, status: 1 });
purchaseSchema.index({ gameId: 1, status: 1 });
purchaseSchema.index({ transactionId: 1 });
purchaseSchema.index({ serialNumber: 1 });
purchaseSchema.index({ status: 1, createdAt: -1 });
purchaseSchema.index({ paymentMethod: 1, status: 1 });

// Generate transaction ID and serial number before saving
purchaseSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  if (!this.serialNumber) {
    this.serialNumber = 'SN' + Date.now() + Math.random().toString(36).substr(2, 8).toUpperCase();
  }
  
  // Calculate total amount if not provided
  if (!this.totalAmount) {
    this.totalAmount = this.amount * this.quantity;
  }
  
  next();
});

// Update delivery status when status changes to completed
purchaseSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.deliveredAt) {
    this.deliveredAt = new Date();
    this.deliveryStatus = 'delivered';
  }
  next();
});

module.exports = mongoose.model("Purchase", purchaseSchema);
