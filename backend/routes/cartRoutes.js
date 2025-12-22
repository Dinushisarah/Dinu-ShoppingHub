const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// All cart routes require authentication
router.post('/', protect, addToCart);           // Add to cart
router.get('/', protect, getCart);              // Get user's cart
router.put('/:itemId', protect, updateCartItem); // Update item quantity
router.delete('/:itemId', protect, removeFromCart); // Remove item
router.delete('/', protect, clearCart);         // Clear entire cart

module.exports = router;