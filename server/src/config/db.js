const mongoose = require('mongoose');
const { mongoUri } = require('./env');

const connectDB = async () => {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set in environment');
  }
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected successfully');
};

module.exports = connectDB;
