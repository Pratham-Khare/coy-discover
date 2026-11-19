const mongoose = require('mongoose');

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/coy-discover';

async function connectDB(uri = process.env.MONGO_URI || DEFAULT_URI) {
  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}

module.exports = { connectDB };
