 const mongoose = require('mongoose');

const connectDB = async () => {
    console.log('Trying to connect to MongoDB...');
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit if connection fails
  }
};

module.exports = connectDB;

