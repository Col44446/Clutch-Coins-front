const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [100, 'Currency name cannot exceed 100 characters']
  },
  amount: { 
    type: Number, 
    required: true,
    min: [0.01, 'Amount must be greater than 0'],
    max: [999999.99, 'Amount cannot exceed 999999.99']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  isActive: { type: Boolean, default: true }
});

const offerSchema = new mongoose.Schema({
  key: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [50, 'Offer key cannot exceed 50 characters']
  },
  value: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [200, 'Offer value cannot exceed 200 characters']
  },
  isActive: { type: Boolean, default: true }
});

const gameSchema = new mongoose.Schema({
  image: { 
    type: String, 
    required: true,
    trim: true
  },
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  publisher: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [100, 'Publisher name cannot exceed 100 characters']
  },
  description: { 
    type: String, 
    required: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  pageName: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  category: {
    type: String,
    enum: ['action', 'adventure', 'strategy', 'rpg', 'sports', 'racing', 'simulation', 'puzzle', 'moba', 'fps', 'battle-royale'],
    required: true
  },
  platform: [{
    type: String,
    enum: ['pc', 'mobile', 'console', 'web']
  }],
  rating: {
    type: Number,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  totalRatings: { type: Number, default: 0 },
  popularity: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  offers: [offerSchema],
  currencies: [currencySchema],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  minAge: {
    type: Number,
    min: [0, 'Minimum age cannot be negative'],
    max: [18, 'Maximum age rating is 18']
  }
}, { timestamps: true });

// Indexes for better performance
gameSchema.index({ pageName: 1 });
gameSchema.index({ slug: 1 });
gameSchema.index({ title: 'text', description: 'text' });
gameSchema.index({ category: 1, isActive: 1 });
gameSchema.index({ isFeatured: 1, popularity: -1 });
gameSchema.index({ platform: 1, isActive: 1 });
gameSchema.index({ tags: 1 });

// Auto-generate slug from title
gameSchema.pre('save', function(next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

// Virtual for average rating
gameSchema.virtual('averageRating').get(function() {
    return this.totalRatings > 0 ? this.rating / this.totalRatings : 0;
});

module.exports = mongoose.model("Game", gameSchema);