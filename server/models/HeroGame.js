const mongoose = require("mongoose");

const heroGameSchema = new mongoose.Schema({
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
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [200, 'Subtitle cannot exceed 200 characters']
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
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better performance
heroGameSchema.index({ gameId: 1 });
heroGameSchema.index({ isActive: 1, order: 1 });
heroGameSchema.index({ startDate: 1, endDate: 1 });

// Validation for date range
heroGameSchema.pre('validate', function(next) {
  if (this.endDate && this.startDate && this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  } else {
    next();
  }
});

module.exports = mongoose.model("HeroGame", heroGameSchema);

