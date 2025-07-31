const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    res.json(wishlist || { products: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/add', authMiddleware, async (req, res) => {
  const { productId, name, price, image } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, products: [] });
    }

    if (!wishlist.products.some(p => p.productId === productId)) {
      wishlist.products.push({ productId, name, price, image });
      await wishlist.save();
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/remove/:productId', authMiddleware, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
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
