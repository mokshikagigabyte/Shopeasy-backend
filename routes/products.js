const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { id, name, price, image, page } = req.body;
  try {
    const product = new Product({ id, name, price, image, page });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
