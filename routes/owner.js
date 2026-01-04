const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Owner login - compare against env vars OWNER_EMAIL and OWNER_PASSWORD
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!process.env.OWNER_EMAIL || !process.env.OWNER_PASSWORD) {
    return res.status(500).json({ message: 'Owner credentials not configured' });
  }

  if (email === process.env.OWNER_EMAIL && password === process.env.OWNER_PASSWORD) {
    return res.json({ success: true });
  }
  return res.status(401).json({ message: 'Invalid owner credentials' });
});

// Return all order statements
router.get('/statements', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
