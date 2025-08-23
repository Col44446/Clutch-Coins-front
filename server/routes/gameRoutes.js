const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  addGame,
  updateGame,
  getAllGames,
  getGameById,
  deleteGame
} = require("../controllers/gameController");

router.post("/", upload.single("image"), addGame);
router.put("/:id", upload.single("image"), updateGame);
router.get("/", getAllGames);
router.get("/:id", getGameById);

router.delete("/:id", deleteGame);


module.exports = router;
