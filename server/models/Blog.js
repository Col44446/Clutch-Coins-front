const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    content: { 
        type: String, 
        required: true,
        minlength: [50, 'Content must be at least 50 characters long']
    },
    excerpt: {
        type: String,
        maxlength: [300, 'Excerpt cannot exceed 300 characters']
    },
    image: { 
        type: String,
        trim: true
    }, 
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    category: {
        type: String,
        enum: ['gaming', 'tutorials', 'news', 'updates', 'guides'],
        default: 'gaming'
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    publishedAt: { type: Date },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    featured: { type: Boolean, default: false }
}, { 
    timestamps: true 
});

// Indexes for better performance
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ featured: 1, publishedAt: -1 });

// Auto-generate slug from title
blogSchema.pre('save', function(next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    
    // Set publishedAt when status changes to published
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    
    next();
});

module.exports = mongoose.model("Blog", blogSchema);
