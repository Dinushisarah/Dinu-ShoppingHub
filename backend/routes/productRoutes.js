const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');  

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes (require login + admin)
router.post('/', protect, isAdmin, createProduct);        // ← ADD isAdmin
router.put('/:id', protect, isAdmin, updateProduct);      // ← ADD isAdmin
router.delete('/:id', protect, isAdmin, deleteProduct);   // ← ADD isAdmin

module.exports = router;