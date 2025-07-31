const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    res.json(cart || { products: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/add', authMiddleware, async (req, res) => {
  const { productId, name, price, image } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, products: [] });
    }

    if (!cart.products.some(p => p.productId === productId)) {
      cart.products.push({ productId, name, price, image });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/remove/:productId', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.products = cart.products.filter(p => p.productId !== req.params.productId);
      await cart.save();
    }
    res.json(cart || { products: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
