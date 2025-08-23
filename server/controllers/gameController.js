const fs = require("fs");
const path = require("path");
const Game = require("../models/Game");

// Add Game
exports.addGame = async (req, res) => {
  try {
    const { title, publisher, description, offers, currencies } = req.body;

    // Validate required fields
    if (!title || !publisher || !description) {
      return res.status(400).json({ success: false, message: "Title, publisher, and description are required" });
    }

    // Parse offers JSON if string
    let parsedOffers = [];
    if (offers) {
      try {
        parsedOffers = typeof offers === "string" ? JSON.parse(offers) : offers;
        // Ensure offers is an array of { key, value }
        if (!Array.isArray(parsedOffers)) {
          return res.status(400).json({ success: false, message: "Offers must be an array" });
        }
        parsedOffers = parsedOffers.map(item => ({
          key: item.key,
          value: item.value
        }));
      } catch (err) {
        return res.status(400).json({ success: false, message: "Invalid offers format" });
      }
    }

    // Parse currencies JSON if string
    let parsedCurrencies = [];
    if (currencies) {
      try {
        parsedCurrencies = typeof currencies === "string" ? JSON.parse(currencies) : currencies;
        parsedCurrencies = parsedCurrencies.map(c => ({
          name: c.name,
          amount: Number(c.amount)
        }));
      } catch (err) {
        return res.status(400).json({ success: false, message: "Invalid currencies format" });
      }
    }

    const game = new Game({
      image: req.file ? req.file.path : null,
      title,
      publisher,
      description,
      offers: parsedOffers,
      currencies: parsedCurrencies
    });

    await game.save();
    res.status(201).json({ success: true, data: game });

  } catch (error) {
    console.error("Add Game Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Game
exports.updateGame = async (req, res) => {
  try {
    const { title, publisher, description, offers, currencies } = req.body;

    // Validate required fields
    if (!title || !publisher || !description) {
      return res.status(400).json({ success: false, message: "Title, publisher, and description are required" });
    }

    let parsedOffers = [];
    if (offers) {
      try {
        parsedOffers = typeof offers === "string" ? JSON.parse(offers) : offers;
        if (!Array.isArray(parsedOffers)) {
          return res.status(400).json({ success: false, message: "Offers must be an array" });
        }
        parsedOffers = parsedOffers.map(item => ({
          key: item.key,
          value: item.value
        }));
      } catch (err) {
        return res.status(400).json({ success: false, message: "Invalid offers format" });
      }
    }

    let parsedCurrencies = [];
    if (currencies) {
      try {
        parsedCurrencies = typeof currencies === "string" ? JSON.parse(currencies) : currencies;
        parsedCurrencies = parsedCurrencies.map(c => ({
          name: c.name,
          amount: Number(c.amount)
        }));
      } catch (err) {
        return res.status(400).json({ success: false, message: "Invalid currencies format" });
      }
    }

    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id,
      {
        image: req.file ? req.file.path : undefined,
        title,
        publisher,
        description,
        offers: parsedOffers,
        currencies: parsedCurrencies
      },
      { new: true, runValidators: true }
    );

    if (!updatedGame) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    res.json({ success: true, data: updatedGame });

  } catch (error) {
    console.error("Update Game Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Games
exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json({ success: true, data: games });
  } catch (error) {
    console.error("Get Games Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Game
exports.getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);

    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    res.json({ success: true, data: game });
  } catch (error) {
    console.error("Get Game By ID Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Game
exports.deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findByIdAndDelete(id);

    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    if (game.image) {
      const imagePath = path.join(__dirname, "..", game.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.warn("Image deletion failed:", err.message);
      });
    }

    res.json({ success: true, message: "Game deleted successfully" });
  } catch (error) {
    console.error("Delete Game Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};