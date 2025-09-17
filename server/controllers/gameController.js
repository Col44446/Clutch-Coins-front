const fs = require("fs");
const path = require("path");
const Game = require("../models/Game");
const Purchase = require("../models/Purchase");

// Get all games (for debugging)
exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.find({}, 'title pageName createdAt');
    res.status(200).json({
      success: true,
      count: games.length,
      data: games
    });
  } catch (error) {
    console.error("Get All Games Error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch games'
    });
  }
};

// Debug function to check and fix indexes
exports.fixIndexes = async (req, res) => {
  try {
    // Get current indexes
    const indexes = await Game.collection.getIndexes();
    console.log('Current indexes:', indexes);
    
    // Drop the problematic gameId index if it exists
    try {
      await Game.collection.dropIndex('gameId_1');
      console.log('Dropped gameId_1 index successfully');
    } catch (err) {
      console.log('gameId_1 index does not exist or already dropped');
    }
    
    res.status(200).json({
      success: true,
      message: 'Indexes checked and fixed',
      indexes: indexes
    });
  } catch (error) {
    console.error("Fix Indexes Error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to fix indexes'
    });
  }
};

// Add Game
exports.addGame = async (req, res) => {
  try {
    console.log('=== New Game Creation Request ===');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);

    const { title, publisher, description, offers, currencies } = req.body;

    // Validate required fields
    if (!title || !publisher || !description) {
      console.error('Validation failed: Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: "Title, publisher, and description are required" 
      });
    }

    // Generate pageName from title (URL-friendly)
    let pageName = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens

    // Check if pageName already exists and make it unique
    console.log('Generated pageName:', pageName);
    const existingGame = await Game.findOne({ pageName: pageName });
    if (existingGame) {
      console.log('PageName already exists, making it unique:', existingGame.title);
      const timestamp = Date.now();
      pageName = `${pageName}-${timestamp}`;
      console.log('New unique pageName:', pageName);
    } else {
      console.log('PageName is unique, proceeding...');
    }

    // Check if files were uploaded
    console.log('Files check:', req.files);
    
    if (!req.files) {
      console.error('Validation failed: No files object');
      return res.status(400).json({
        success: false,
        message: "No files were uploaded"
      });
    }

    // Verify files were processed by multer
    const portraitFile = req.files.portraitImage ? req.files.portraitImage[0] : null;
    const squareFile = req.files.squareImage ? req.files.squareImage[0] : null;

    console.log('Portrait file:', portraitFile);
    console.log('Square file:', squareFile);

    if (!portraitFile || !squareFile) {
      console.error('File processing error: Missing required images');
      console.error('Portrait file exists:', !!portraitFile);
      console.error('Square file exists:', !!squareFile);
      return res.status(400).json({
        success: false,
        message: 'Both portrait (9:16) and square (1:1) images are required'
      });
    }

    if ((!portraitFile.path && !portraitFile.buffer) || (!squareFile.path && !squareFile.buffer)) {
      console.error('File processing error: Files not properly processed by multer');
      console.error('Portrait file path/buffer:', portraitFile.path || portraitFile.buffer);
      console.error('Square file path/buffer:', squareFile.path || squareFile.buffer);
      return res.status(500).json({
        success: false,
        message: 'Error processing file uploads'
      });
    }

    // Parse offers
    let parsedOffers = [];
    if (offers) {
      try {
        console.log('Raw offers:', offers);
        parsedOffers = typeof offers === "string" ? JSON.parse(offers) : offers;
        if (!Array.isArray(parsedOffers)) {
          console.error('Offers is not an array:', parsedOffers);
          return res.status(400).json({ 
            success: false, 
            message: "Offers must be an array" 
          });
        }
        parsedOffers = parsedOffers.map(item => ({
          key: String(item.key || '').trim(),
          value: String(item.value || '').trim()
        }));
      } catch (err) {
        console.error('Error parsing offers:', err);
        return res.status(400).json({ 
          success: false, 
          message: "Invalid offers format" 
        });
      }
    }

    // Parse currencies
    let parsedCurrencies = [];
    if (currencies) {
      try {
        parsedCurrencies = typeof currencies === "string" ? JSON.parse(currencies) : currencies;
        if (!Array.isArray(parsedCurrencies)) {
          return res.status(400).json({ 
            success: false, 
            message: "Currencies must be an array" 
          });
        }
        parsedCurrencies = parsedCurrencies.map(c => ({
          name: String(c.name || '').trim(),
          amount: isNaN(Number(c.amount)) ? 0 : Number(c.amount)
        }));
      } catch (err) {
        console.error('Error parsing currencies:', err);
        return res.status(400).json({ 
          success: false, 
          message: "Invalid currencies format" 
        });
      }
    }

    // Get the Cloudinary URLs from the uploaded files
    const portraitImageUrl = portraitFile.path;
    const squareImageUrl = squareFile.path;

    // Create new game
    const game = new Game({
      image: portraitImageUrl, // Keep for backward compatibility
      portraitImage: portraitImageUrl, // 9:16 aspect ratio
      squareImage: squareImageUrl, // 1:1 aspect ratio
      title: String(title || '').trim(),
      publisher: String(publisher || '').trim(),
      description: String(description || '').trim(),
      pageName: pageName, // Add the generated pageName
      offers: parsedOffers,
      currencies: parsedCurrencies
    });

    await game.save();
    
    // Return the response with the game data
    res.status(201).json({
      success: true,
      data: {
        ...game.toObject(),
        image: portraitImageUrl, // Return the portrait image URL for backward compatibility
        portraitImage: portraitImageUrl,
        squareImage: squareImageUrl
      }
    });

  } catch (error) {
    console.error("Add Game Error:", error);
    console.error("Error details:", {
      name: error.name,
      code: error.code,
      keyPattern: error.keyPattern,
      keyValue: error.keyValue,
      message: error.message
    });
    
    // More specific error messages
    let errorMessage = 'Failed to add game';
    let statusCode = 500;
    
    if (error.name === 'ValidationError') {
      errorMessage = Object.values(error.errors).map(e => e.message).join('. ');
      statusCode = 400;
    } else if (error.code === 11000) {
      // Handle duplicate key errors more specifically
      console.log('Duplicate key error details:', error.keyPattern, error.keyValue);
      if (error.keyPattern && error.keyPattern.pageName) {
        errorMessage = `A game with pageName "${error.keyValue.pageName}" already exists. Please try a different title.`;
      } else if (error.keyPattern && error.keyPattern.title) {
        errorMessage = `A game with title "${error.keyValue.title}" already exists`;
      } else {
        errorMessage = 'A game with similar details already exists';
      }
      statusCode = 409;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(statusCode).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update Game
exports.updateGame = async (req, res) => {
  try {
    const { title, publisher, description, offers, currencies } = req.body;

    if (!title || !publisher || !description) {
      return res.status(400).json({ 
        success: false, 
        message: "Title, publisher, and description are required" 
      });
    }

    // Generate pageName from title (URL-friendly)
    const pageName = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens

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

    // Handle file uploads for update
    let updateData = {
      title,
      publisher,
      description,
      offers: parsedOffers,
      currencies: parsedCurrencies
    };

    // Update images if new files are provided
    if (req.files) {
      if (req.files.portraitImage && req.files.portraitImage[0]) {
        updateData.portraitImage = req.files.portraitImage[0].path;
        updateData.image = req.files.portraitImage[0].path; // Keep for backward compatibility
      }
      if (req.files.squareImage && req.files.squareImage[0]) {
        updateData.squareImage = req.files.squareImage[0].path;
      }
    } else if (req.file) {
      // Handle single file upload for backward compatibility
      updateData.image = req.file.path;
      updateData.portraitImage = req.file.path;
    }

    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id,
      updateData,
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

// Get Game by Page Name
exports.getGameByPageName = async (req, res) => {
  try {
    const { pageName } = req.params;
    const game = await Game.findOne({ pageName });

    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    res.json({ success: true, data: game });
  } catch (error) {
    console.error("Get Game By Page Name Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Purchase
exports.createPurchase = async (req, res) => {
  try {
    const { gameId, currencyName, amount, gameUserId } = req.body;
    const userId = req.user.id; // Assuming user is authenticated

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    const purchase = new Purchase({
      userId,
      gameId,
      gameName: game.title,
      gamePageName: game.pageName,
      currencyName,
      amount,
      gameUserId,
      status: 'completed'
    });

    await purchase.save();
    res.status(201).json({ success: true, data: purchase });
  } catch (error) {
    console.error("Create Purchase Error:", error);
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

// Search games by name, description, or category
exports.searchGames = async (req, res) => {
  try {
    const { query, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: "Search query is required" 
      });
    }

    // Build search filter
    const searchFilter = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    };

    // Add category filter if specified
    if (category && category !== 'all') {
      searchFilter.category = { $regex: category, $options: 'i' };
    }

    // Add price range filter if specified
    if (minPrice || maxPrice) {
      searchFilter.price = {};
      if (minPrice) searchFilter.price.$gte = parseFloat(minPrice);
      if (maxPrice) searchFilter.price.$lte = parseFloat(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const games = await Game.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalGames = await Game.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalGames / parseInt(limit));

    console.log(`Search performed: "${query}" - Found ${totalGames} games`);

    res.status(200).json({
      success: true,
      data: games,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalGames,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Search games error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to search games", 
      error: error.message 
    });
  }
};