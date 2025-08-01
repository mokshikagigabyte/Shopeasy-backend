// ~/storage/shared/shopeasy-backend/server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const paymentRoutes = require('./routes/payment');

const app = express();
connectDB(); // Connect to MongoDB using MONGO_URI from environment variables

app.use(cors()); // Enable CORS for frontend (e.g., Netlify)
app.use(express.json()); // Parse JSON requests

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 10000; // Use Render's assigned port or 10000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));