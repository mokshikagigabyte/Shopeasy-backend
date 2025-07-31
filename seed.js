const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const products = [
  { id: 'home-1', name: 'T-Shirt', price: 499, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', page: 'index.html' },
  { id: 'home-2', name: 'Shirt', price: 899, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf', page: 'index.html' },
  { id: 'home-3', name: 'Jewellery', price: 1299, image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638', page: 'index.html' },
  { id: 'home-4', name: 'Sunglasses', price: 769, image: 'https://images.unsplash.com/photo-1608231387043-66d1773070a5', page: 'index.html' },
  { id: 'home-5', name: 'Sneakers', price: 1599, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', page: 'index.html' },
  { id: 'home-6', name: 'Watch', price: 1599, image: 'https://images.unsplash.com/photo-1528795259021-1e7957db3f6e', page: 'index.html' },
  { id: 'home-7', name: 'Shorts', price: 699, image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', page: 'index.html' },
  { id: 'home-8', name: 'Women Kurti', price: 599, image: 'https://images.pexels.com/photos/11226039/pexels-photo-11226039.jpeg?auto=compress&cs=tinysrgb&w=500', page: 'index.html' },
];

const seedDB = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Database seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDB();
