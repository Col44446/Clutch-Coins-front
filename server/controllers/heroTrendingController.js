const HeroGame = require("../models/HeroGame");
const TrendingGame = require("../models/TrendingGame");
const Game = require("../models/Game");

// ======================= HERO GAMES =======================

exports.addHeroGame = async (req, res) => {
  try {
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({ success: false, message: "Game ID is required" });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Display image is required" });
    }

    const heroGame = new HeroGame({
      gameId,
      displayImage: req.file.path,
    });

    await heroGame.save();
    const populatedGame = await HeroGame.findById(heroGame._id).populate("gameId");
    res.status(201).json({ success: true, data: populatedGame });
  } catch (error) {
    console.error("Add Hero Game Error:", error);
    res.status(500).json({ success: false, message: "Failed to add hero game", error: error.message });
  }
};

exports.getHeroGames = async (req, res) => {
  try {
    const heroGames = await HeroGame.find().populate({
      path: "gameId",
      select: "title",
    });
    res.json({ success: true, data: heroGames });
  } catch (error) {
    console.error("Get Hero Games Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch hero games", error: error.message });
  }
};

exports.deleteHeroGame = async (req, res) => {
  try {
    const { id } = req.params;
    const heroGame = await HeroGame.findByIdAndDelete(id);

    if (!heroGame) {
      return res.status(404).json({ success: false, message: "Hero game not found" });
    }

    res.json({ success: true, message: "Hero game deleted successfully" });
  } catch (error) {
    console.error("Delete Hero Game Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete hero game", error: error.message });
  }
};

// ======================= TRENDING GAMES =======================

exports.addTrendingGame = async (req, res) => {
  try {
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({ success: false, message: "Game ID is required" });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Display image is required" });
    }

    const trendingGame = new TrendingGame({
      gameId,
      displayImage: req.file.path,
    });

    await trendingGame.save();
    const populatedGame = await TrendingGame.findById(trendingGame._id).populate("gameId");
    res.status(201).json({ success: true, data: populatedGame });
  } catch (error) {
    console.error("Add Trending Game Error:", error);
    res.status(500).json({ success: false, message: "Failed to add trending game", error: error.message });
  }
};

exports.getTrendingGames = async (req, res) => {
  try {
    const trendingGames = await TrendingGame.find().populate({
      path: "gameId",
      select: "title",
    });
    res.json({ success: true, data: trendingGames });
  } catch (error) {
    console.error("Get Trending Games Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch trending games", error: error.message });
  }
};

exports.deleteTrendingGame = async (req, res) => {
  try {
    const { id } = req.params;
    const trendingGame = await TrendingGame.findByIdAndDelete(id);

    if (!trendingGame) {
      return res.status(404).json({ success: false, message: "Trending game not found" });
    }

    res.json({ success: true, message: "Trending game deleted successfully" });
  } catch (error) {
    console.error("Delete Trending Game Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete trending game", error: error.message });
  }
};