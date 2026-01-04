require('dotenv').config();
// ~/storage/shared/shopeasy-backend/server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const paymentRoutes = require('./routes/payment');
const helpRoutes = require('./routes/help');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
connectDB(); // Connect to MongoDB using MONGO_URI from environment variables
// Security and parsing middleware
app.use(helmet());
app.use(morgan('tiny'));

// Allow CORS from any origin and support credentials by reflecting request origin.
// This removes the need to configure a FRONTEND_URL environment variable.
app.use(cors({ origin: true, credentials: true }));
app.use(express.json()); // Parse JSON requests
app.use(cookieParser());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/help', helpRoutes);

// Also expose routes without the /api prefix for compatibility with frontend
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/payment', paymentRoutes);
app.use('/order', paymentRoutes);
app.use('/help', helpRoutes);
const ownerRoutes = require('./routes/owner');
app.use('/owner', ownerRoutes);

// Basic health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 10000; // Use Render's assigned port or 10000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));