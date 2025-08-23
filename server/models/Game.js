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
  image: { type: String, required: false },
  title: { type: String, required: true },
  publisher: { type: String, required: true },
  description: { type: String, required: true },
  offers: [offerSchema], // Array of { key, value }
  currencies: [currencySchema]
}, { timestamps: true });

module.exports = mongoose.model("Game", gameSchema);