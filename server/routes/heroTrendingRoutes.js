const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authenticate = require("../middleware/auth");
const {
  addHeroGame,
  getHeroGames,
  deleteHeroGame,
  addTrendingGame,
  getTrendingGames,
  deleteTrendingGame,
} = require("../controllers/heroTrendingController");

// Hero Games
router.post("/hero", authenticate, upload.single("displayImage"), addHeroGame);
router.get("/hero", getHeroGames);
router.delete("/hero/:id", authenticate, deleteHeroGame);

// Trending Games
router.post("/trending", authenticate, upload.single("displayImage"), addTrendingGame);
router.get("/trending", getTrendingGames);
router.delete("/trending/:id", authenticate, deleteTrendingGame);

module.exports = router;