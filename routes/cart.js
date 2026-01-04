const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const query = mongoose.Types.ObjectId.isValid(req.user.id) ? { userId: req.user.id } : { clientId: req.user.id };
    const cart = await Cart.findOne(query);
    res.json(cart || { products: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/add', authMiddleware, async (req, res) => {
  const { productId, name, price, image, quantity } = req.body;
  try {
    const query = mongoose.Types.ObjectId.isValid(req.user.id) ? { userId: req.user.id } : { clientId: req.user.id };
    let cart = await Cart.findOne(query);
    if (!cart) {
      cart = new Cart({
        userId: mongoose.Types.ObjectId.isValid(req.user.id) ? req.user.id : undefined,
        clientId: mongoose.Types.ObjectId.isValid(req.user.id) ? undefined : req.user.id,
        products: []
      });
    }

    const existing = cart.products.find(p => p.productId === productId);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + (quantity || 1);
    } else {
      cart.products.push({ productId, name, price, image, quantity: quantity || 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/remove/:productId', authMiddleware, async (req, res) => {
  try {
    const query = mongoose.Types.ObjectId.isValid(req.user.id) ? { userId: req.user.id } : { clientId: req.user.id };
    const cart = await Cart.findOne(query);
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
