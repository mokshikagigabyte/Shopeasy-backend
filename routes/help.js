const express = require('express');
const router = express.Router();

// POST /api/help - Handle feedback submission
router.post('/', async (req, res) => {
  const { name, email, message, rating } = req.body;
  try {
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide name, email, and message' });
    }
    // Add MongoDB storage logic here if needed
    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
