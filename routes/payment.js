const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

// Pay with QR
router.post('/qr', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // calculate total
    const totalPrice = cart.products.reduce((acc, item) => {
      return acc + (item.price * (item.quantity || 1));
    }, 0);

    // create order
    const order = new Order({
      userId: req.user.id,
      items: cart.products,
      total: totalPrice,
      paymentMethod: 'QR',
      status: 'Paid'
    });

    await order.save();

    // clear cart
    cart.products = [];
    await cart.save();

    return res.json({
      success: true,
      message: "QR Payment Successful",
      total: totalPrice,
      orderId: order._id
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "QR Payment error" });
  }
});

// Cash on Delivery
router.post('/cod', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // calculate total
    const totalPrice = cart.products.reduce((acc, item) => {
      return acc + (item.price * (item.quantity || 1));
    }, 0);

    // create order
    const order = new Order({
      userId: req.user.id,
      items: cart.products,
      total: totalPrice,
      paymentMethod: 'COD',
      status: 'Pending'  // Payment not yet completed
    });

    await order.save();

    // clear cart
    cart.products = [];
    await cart.save();

    return res.json({
      success: true,
      message: "Cash on Delivery order received",
      total: totalPrice,
      orderId: order._id
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "COD Payment error" });
  }
});

module.exports = router;
