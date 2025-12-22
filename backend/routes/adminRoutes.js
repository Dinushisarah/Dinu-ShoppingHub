const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// Dashboard stats
router.get('/stats', protect, admin, adminController.getDashboardStats);

// Orders management
router.get('/orders', protect, admin, adminController.getAllOrders);
router.put('/orders/:id', protect, admin, adminController.updateOrderStatus);
router.delete('/orders/:id', protect, admin, adminController.deleteOrder);
router.get('/products', protect, admin, adminController.getAllProducts);
//product management
router.post('/products', protect, admin, adminController.createProduct);
router.put('/products/:id', protect, admin, adminController.updateProduct);
router.delete('/products/:id', protect, admin, adminController.deleteProduct);
//user management
router.get('/users', protect, admin, adminController.getAllUsers);
router.put('/users/:id', protect, admin, adminController.updateUserRole);
router.delete('/users/:id', protect, admin, adminController.deleteUser);

module.exports = router;