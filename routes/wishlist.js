const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Wishlist = require('../models/Wishlist');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const query = mongoose.Types.ObjectId.isValid(req.user.id) ? { userId: req.user.id } : { clientId: req.user.id };
    const wishlist = await Wishlist.findOne(query);
    res.json(wishlist || { products: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/add', authMiddleware, async (req, res) => {
  const { productId, name, price, image, quantity } = req.body;
  try {
    const query = mongoose.Types.ObjectId.isValid(req.user.id) ? { userId: req.user.id } : { clientId: req.user.id };
    let wishlist = await Wishlist.findOne(query);
    if (!wishlist) {
      wishlist = new Wishlist({
        userId: mongoose.Types.ObjectId.isValid(req.user.id) ? req.user.id : undefined,
        clientId: mongoose.Types.ObjectId.isValid(req.user.id) ? undefined : req.user.id,
        products: []
      });
    }

    if (!wishlist.products.some(p => p.productId === productId)) {
      wishlist.products.push({ productId, name, price, image, quantity: quantity || 1 });
      await wishlist.save();
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/remove/:productId', authMiddleware, async (req, res) => {
  try {
    const query = mongoose.Types.ObjectId.isValid(req.user.id) ? { userId: req.user.id } : { clientId: req.user.id };
    const wishlist = await Wishlist.findOne(query);
    if (wishlist) {
      wishlist.products = wishlist.products.filter(p => p.productId !== req.params.productId);
      await wishlist.save();
    }
    res.json(wishlist || { products: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
