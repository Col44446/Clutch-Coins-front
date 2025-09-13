const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  addGame,
  updateGame,
  getAllGames,
  getGameById,
  getGameByPageName,
  createPurchase,
  deleteGame
} = require("../controllers/gameController");

router.post("/", upload.single("image"), addGame);
router.put("/:id", upload.single("image"), updateGame);
router.get("/", getAllGames);
router.get("/page/:pageName", getGameByPageName);
router.get("/:id", getGameById);
router.post("/purchase", createPurchase);

router.delete("/:id", deleteGame);


module.exports = router;
