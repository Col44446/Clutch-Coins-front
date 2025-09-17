const mongoose = require('mongoose');
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
    const { gameId, gameName, gamePageName, gameImage, currencyName, amount, quantity = 1, gameUserId } = req.body;

    console.log('=== CART ADD REQUEST START ===');
    console.log('User ID from token:', userId);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));

    // Validate required fields
    if (!gameId) {
      console.log('Validation failed: Game ID missing');
      return res.status(400).json({ success: false, message: "Game ID is required" });
    }
    if (!currencyName) {
      console.log('Validation failed: Currency name missing');
      return res.status(400).json({ success: false, message: "Currency name is required" });
    }
    if (!amount || amount <= 0) {
      console.log('Validation failed: Invalid amount:', amount);
      return res.status(400).json({ success: false, message: "Valid amount is required" });
    }
    if (!gameUserId || gameUserId.trim() === '') {
      console.log('Validation failed: Game User ID missing');
      return res.status(400).json({ success: false, message: "Game User ID is required" });
    }

    console.log('Searching for game with ID:', gameId);
    
    // Validate gameId format
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      console.log('Invalid gameId format:', gameId);
      return res.status(400).json({ success: false, message: "Invalid game ID format" });
    }
    
    const game = await Game.findById(gameId);
    if (!game) {
      console.log('Game not found with ID:', gameId);
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    console.log('Game found:', game.title || game.name);
    
    // Handle userId - support both ObjectId and string userIds
    let cart;
    try {
      // Try to find cart by userId (works for both ObjectId and string)
      cart = await Cart.findOne({ userId });
      
      // If not found and userId is a string, also try to find by originalUserId
      if (!cart && !mongoose.Types.ObjectId.isValid(userId)) {
        cart = await Cart.findOne({ originalUserId: userId });
      }
    } catch (error) {
      console.log('Error finding cart, will create new one:', error.message);
    }
    
    if (!cart) {
      console.log('Creating new cart for user:', userId);
      // Create cart with the userId directly (Mixed type supports both ObjectId and string)
      cart = new Cart({ userId, items: [] });
      
      // If userId is a string, also store it in originalUserId for reference
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        cart.originalUserId = userId;
      }
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.gameId.toString() === gameId && 
               item.currencyName === currencyName && 
               item.gameUserId === gameUserId.trim()
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      console.log('Updating existing cart item quantity');
      cart.items[existingItemIndex].quantity += parseInt(quantity);
    } else {
      // Add new item with all required fields
      console.log('Adding new item to cart');
      const newItem = {
        gameId,
        gameName: gameName || game.title || game.name || 'Unknown Game',
        gamePageName: gamePageName || game.pageName || game.title || game.name || 'unknown',
        gameImage: gameImage || game.portraitImage || game.image || '/api/placeholder/400/600',
        currencyName,
        amount: parseFloat(amount),
        quantity: parseInt(quantity),
        gameUserId: gameUserId.trim()
      };
      console.log('New cart item:', newItem);
      cart.items.push(newItem);
    }

    console.log('Saving cart...');
    console.log('Cart before save:', JSON.stringify(cart, null, 2));
    
    try {
      await cart.save();
      console.log('Cart saved successfully');
      res.json({ success: true, data: cart, message: 'Item added to cart successfully' });
    } catch (saveError) {
      console.error('Cart save error:', saveError);
      throw saveError; // Re-throw to be caught by outer catch block
    }
  } catch (error) {
    console.error('Cart add error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add item to cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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
