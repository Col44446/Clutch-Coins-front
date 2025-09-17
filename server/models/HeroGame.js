// models/HeroGame.js
const mongoose = require("mongoose");
const heroGameSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
  displayImage: { type: String, required: true }, // Changed from heroImage
});
module.exports = mongoose.model("HeroGame", heroGameSchema);

