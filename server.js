const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/payment', require('./routes/payment'));

// Search endpoint
app.get('/api/search', async (req, res) => {
  const query = req.query.q?.toLowerCase();
  if (!query) return res.json([]);

  try {
    const products = await require('./models/Product').find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { price: { $regex: query, $options: 'i' } },
      ],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Search error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
