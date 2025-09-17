// models/TrendingGame.js
const mongoose = require("mongoose");

const trendingGameSchema = new mongoose.Schema({
  gameId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Game", 
    required: true,
    unique: true,
    index: true
  },
  displayImage: { 
    type: String, 
    required: true,
    trim: true
  },
  trendingScore: {
    type: Number,
    default: 0,
    min: [0, 'Trending score cannot be negative']
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  purchases: {
    type: Number,
    default: 0,
    min: [0, 'Purchases cannot be negative']
  },
  order: {
    type: Number,
    default: 0,
    min: [0, 'Order cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featuredUntil: {
    type: Date
  },
  category: {
    type: String,
    enum: ['hot', 'new', 'popular', 'rising'],
    default: 'popular'
  }
}, {
  timestamps: true
});

// Indexes for better performance
trendingGameSchema.index({ gameId: 1 });
trendingGameSchema.index({ isActive: 1, trendingScore: -1 });
trendingGameSchema.index({ category: 1, isActive: 1, order: 1 });
trendingGameSchema.index({ featuredUntil: 1 });

// Calculate trending score based on views and purchases
trendingGameSchema.methods.calculateTrendingScore = function() {
  const viewWeight = 1;
  const purchaseWeight = 10;
  const timeDecay = Math.max(0.1, 1 - (Date.now() - this.updatedAt) / (7 * 24 * 60 * 60 * 1000)); // 7 days decay
  
  this.trendingScore = (this.views * viewWeight + this.purchases * purchaseWeight) * timeDecay;
  return this.trendingScore;
};

module.exports = mongoose.model("TrendingGame", trendingGameSchema);