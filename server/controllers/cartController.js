const Cart = require('../models/Cart');
const Game = require('../models/Game');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let cart = await Cart.findOne({ userId }).populate('items.gameId', 'title image');
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch cart' });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gameId, gameName, gamePageName, gameImage, currencyName, amount, gameUserId, quantity = 1 } = req.body;

    // Validate required fields
    if (!gameId) {
      return res.status(400).json({ success: false, message: "Game ID is required" });
    }
    if (!currencyName) {
      return res.status(400).json({ success: false, message: "Currency name is required" });
    }
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount is required" });
    }
    if (!gameUserId || gameUserId.trim() === '') {
      return res.status(400).json({ success: false, message: "Game User ID is required" });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.gameId.toString() === gameId && 
               item.currencyName === currencyName && 
               item.gameUserId === gameUserId.trim()
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item with all required fields
      cart.items.push({
        gameId,
        gameName: gameName || game.title,
        gamePageName: gamePageName || game.pageName || game.title,
        gameImage: gameImage || game.image || '/api/placeholder/400/600',
        currencyName,
        amount: parseFloat(amount),
        quantity: parseInt(quantity),
        gameUserId: gameUserId.trim()
      });
    }

    await cart.save();
    res.json({ success: true, data: cart, message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Cart add error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add item to cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove item from cart' });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(item => item._id.toString() === itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update cart item' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
};
