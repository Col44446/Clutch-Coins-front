const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  user: { id: String, name: String },
  text: String,
  file: {
    url: String,
    originalName: String,
    mimeType: String,
    size: Number,
  },
  readBy: [{ userId: String, ts: Date }],
  ts: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);