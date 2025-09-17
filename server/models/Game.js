const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true }
});

const offerSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
});

const gameSchema = new mongoose.Schema({
  image: { type: String, required: false }, // Keep for backward compatibility
  portraitImage: { type: String, required: false }, // 9:16 aspect ratio image
  squareImage: { type: String, required: false }, // 1:1 aspect ratio image
  title: { type: String, required: true },
  publisher: { type: String, required: true },
  description: { type: String, required: true },
  pageName: { type: String, required: true, unique: true }, // For URL routing
  offers: [offerSchema], // Array of { key, value }
  currencies: [currencySchema]
}, { timestamps: true });

module.exports = mongoose.model("Game", gameSchema);