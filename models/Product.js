const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  page: { type: String, required: true },
});

module.exports = mongoose.model('Product', productSchema);
