const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 30000 })
  .then(() => {
    console.log('MongoDB connected');
    mongoose.connection.close();
  })
  .catch(err => console.error('Error:', err));
