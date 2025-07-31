const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.post('/qr', authMiddleware, async (req, res) => {
  try {
    res.json({ message: 'QR payment confirmed', status: 'success' });
  } catch (error) {
    res.status(500).json({ message: 'Payment error' });
  }
});

router.post('/cod', authMiddleware, async (req, res) => {
  try {
    res.json({ message: 'Cash on Delivery order confirmed', status: 'success' });
  } catch (error) {
    res.status(500).json({ message: 'COD error' });
  }
});

module.exports = router;
