const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  verifyPayment  // ← ADD THIS
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

// User routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/payment', protect, verifyPayment);  

// Admin routes
router.get('/', protect, isAdmin, getAllOrders);
router.put('/:id', protect, isAdmin, updateOrderStatus);
router.delete('/:id', protect, isAdmin, deleteOrder);

module.exports = router;