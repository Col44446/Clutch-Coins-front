const User = require('../models/User');
const Purchase = require('../models/Purchase');

// Get User Purchase History
exports.getUserPurchases = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated
    
    const purchases = await Purchase.find({ userId })
      .populate('gameId', 'title image')
      .sort({ purchaseDate: -1 });

    res.json({ success: true, data: purchases });
  } catch (error) {
    console.error("Get User Purchases Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: user }); // Fix: return user object directly
  } catch (error) {
    console.error("Get User Profile Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Update User Profile Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
