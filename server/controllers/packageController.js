const Package = require('../models/Package');

// Get all packages (active only for public, all for admin)
const getPackages = async (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === 'admin';
    const filter = isAdmin ? {} : { isActive: true };
    
    const packages = await Package.find(filter).sort({ order: 1, createdAt: 1 });
    
    res.json({
      success: true,
      data: packages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch packages',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get single package by ID
const getPackageById = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    
    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    res.json({
      success: true,
      data: package
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch package',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Create new package (admin only)
const createPackage = async (req, res) => {
  try {
    const { name, description, price, link, buttonText, isActive, order } = req.body;
    
    // Validation
    if (!name || !description || !price || !link || !buttonText) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, description, price, link, buttonText'
      });
    }
    
    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }
    
    const package = new Package({
      name,
      description,
      price,
      link,
      buttonText,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0
    });
    
    await package.save();
    
    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: package
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create package',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update package (admin only)
const updatePackage = async (req, res) => {
  try {
    const { name, description, price, link, buttonText, isActive, order } = req.body;
    
    // Validation
    if (price !== undefined && price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }
    
    const package = await Package.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(link && { link }),
        ...(buttonText && { buttonText }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order })
      },
      { new: true, runValidators: true }
    );
    
    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Package updated successfully',
      data: package
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update package',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Delete package (admin only)
const deletePackage = async (req, res) => {
  try {
    const package = await Package.findByIdAndDelete(req.params.id);
    
    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete package',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
};
