const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return mongoose.connection;

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.warn('⚠️ MONGODB_URI not found in environment variables. Database features will operate in fallback mode.');
    return null;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    const sanitizedURI = mongoURI.replace(/\/\/.*@/, '//***:***@');
    console.log(`✅ MongoDB Atlas connected successfully: ${sanitizedURI}`);
    return conn;
  } catch (err) {
    isConnected = false;
    console.error(`❌ MongoDB Atlas connection error: ${err.message}`);
    return null;
  }
};

const getDBStatus = () => ({
  connected: mongoose.connection.readyState === 1,
  readyState: mongoose.connection.readyState,
  host: mongoose.connection.host || 'none',
  name: mongoose.connection.name || 'none'
});

module.exports = { connectDB, getDBStatus };
