const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clientId: { type: String },
  products: [
    {
      productId: { type: String, ref: 'Product', required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      quantity: { type: Number, default: 1 }
    },
  ],
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
