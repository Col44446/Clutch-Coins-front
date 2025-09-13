const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  gameName: { type: String, required: true },
  gamePageName: { type: String, required: true },
  currencyName: { type: String, required: true },
  amount: { type: Number, required: true },
  gameUserId: { type: String, required: true }, // User's in-game ID
  transactionId: { type: String, required: true, unique: true },
  serialNumber: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  paymentMethod: { type: String, default: 'Credit Card' },
  purchaseDate: { type: Date, default: Date.now }
}, { timestamps: true });

// Generate transaction ID and serial number before saving
purchaseSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  if (!this.serialNumber) {
    this.serialNumber = 'SN' + Date.now() + Math.random().toString(36).substr(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Purchase", purchaseSchema);
