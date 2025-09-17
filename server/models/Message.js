const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  roomId: { 
    type: String, 
    required: true,
    trim: true,
    index: true
  },
  user: { 
    id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    name: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: [50, 'Username cannot exceed 50 characters']
    },
    avatar: {
      type: String,
      trim: true
    }
  },
  text: {
    type: String,
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  messageType: {
    type: String,
    enum: ['text', 'file', 'image', 'system'],
    default: 'text'
  },
  file: {
    url: {
      type: String,
      trim: true
    },
    originalName: {
      type: String,
      trim: true,
      maxlength: [255, 'Filename cannot exceed 255 characters']
    },
    mimeType: {
      type: String,
      trim: true
    },
    size: {
      type: Number,
      min: [0, 'File size cannot be negative'],
      max: [50 * 1024 * 1024, 'File size cannot exceed 50MB'] // 50MB limit
    }
  },
  readBy: [{
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    readAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  isEdited: { type: Boolean, default: false },
  editedAt: { type: Date },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }
}, {
  timestamps: true
});

// Indexes for better performance
messageSchema.index({ roomId: 1, createdAt: -1 });
messageSchema.index({ 'user.id': 1, createdAt: -1 });
messageSchema.index({ roomId: 1, isDeleted: 1, createdAt: -1 });

// Validation: Either text or file must be present
messageSchema.pre('validate', function(next) {
  if (!this.text && !this.file?.url) {
    next(new Error('Message must contain either text or file'));
  } else {
    next();
  }
});

module.exports = mongoose.model("Message", messageSchema);