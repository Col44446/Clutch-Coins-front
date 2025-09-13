const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart
} = require("../controllers/cartController");

// All cart routes require authentication
router.get("/", auth, getCart);
router.post("/add", auth, addToCart);
router.delete("/item/:itemId", auth, removeFromCart);
router.put("/item/:itemId", auth, updateCartItem);
router.delete("/clear", auth, clearCart);

module.exports = router;
