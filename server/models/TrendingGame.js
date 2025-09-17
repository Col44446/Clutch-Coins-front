// models/TrendingGame.js
const mongoose = require("mongoose");
const trendingGameSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
  displayImage: { type: String, required: true }, // Changed from trendingImage
});
module.exports = mongoose.model("TrendingGame", trendingGameSchema);