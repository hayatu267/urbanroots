const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.post('/', createOrder);                                          // public
router.get('/', protect, adminOnly, getOrders);                        // admin
router.get('/:id', protect, adminOnly, getOrder);                      // admin
router.put('/:id/status', protect, adminOnly, updateOrderStatus);      // admin
router.delete('/:id', protect, adminOnly, deleteOrder);                // admin

module.exports = router;
