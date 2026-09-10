const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.warn('⚠️ [MongoDB]: MONGODB_URI is not defined in environment variables.');
      return;
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ [MongoDB]: Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ [MongoDB]: Connection failed - ${error.message}`);
  }
};

module.exports = connectDB;
