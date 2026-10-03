// server/config/db.js
// Handles MongoDB Atlas connection with Mongoose
const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri.trim() === '' || mongoUri.includes('<username>')) {
    const errorMsg = '[MongoDB Error] MONGO_URI is missing or not configured in server/.env.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });
    isConnected = true;
    console.log(`[MongoDB Connected] Host: ${conn.connection.host} | Database: ${conn.connection.name}`);
    return conn;
  } catch (err) {
    isConnected = false;
    console.error(`[MongoDB Connection Error] Failed to connect to MongoDB Atlas: ${err.message}`);
    throw err;
  }
};

const getDbStatus = () => {
  const readyStates = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const stateIndex = mongoose.connection.readyState;
  const stateName = readyStates[stateIndex] || 'Disconnected';
  return {
    isConnected: stateIndex === 1,
    status: stateName,
    host: mongoose.connection.host || null,
    database: mongoose.connection.name || null,
    type: 'MongoDB Atlas'
  };
};

module.exports = {
  connectDB,
  getDbStatus
};
