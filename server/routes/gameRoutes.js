const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const {
  addGame,
  updateGame,
  getAllGames,
  getGameById,
  getGameByPageName,
  createPurchase,
  deleteGame,
  fixIndexes,
  searchGames
} = require("../controllers/gameController");

// Routes
router.post("/", upload.fields([
  { name: 'portraitImage', maxCount: 1 },
  { name: 'squareImage', maxCount: 1 }
]), addGame);
router.put("/:id", upload.fields([
  { name: 'portraitImage', maxCount: 1 },
  { name: 'squareImage', maxCount: 1 }
]), updateGame);
router.get("/search", searchGames); // Search route - must be before /:id
router.get("/", getAllGames);
router.get("/fix-indexes", fixIndexes); // Debug route to fix indexes
router.get("/page/:pageName", getGameByPageName);
router.get("/:id", getGameById);
router.post("/purchase", createPurchase);
router.delete("/:id", deleteGame);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Route error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = router;
