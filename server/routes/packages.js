const express = require('express');
const router = express.Router();
const {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
} = require('../controllers/packageController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Public routes
router.get('/', getPackages);
router.get('/:id', getPackageById);

// Admin only routes
router.post('/', auth, adminAuth, createPackage);
router.put('/:id', auth, adminAuth, updatePackage);
router.delete('/:id', auth, adminAuth, deletePackage);

module.exports = router;
