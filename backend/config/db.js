// config/db.js
// This file handles connecting to MongoDB using Mongoose

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected: " + conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection error: " + error.message);
    // Exit the process if we cannot connect to the database
    process.exit(1);
  }
};

module.exports = connectDB;
