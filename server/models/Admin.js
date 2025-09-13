const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
    email: { type: String, default: null },
    createdBy: { type: String, required: true }, // Track who created this admin
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: null },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Admin", adminSchema);
