// utils/generateToken.js
// Utility function to generate JWT tokens

const jwt = require("jsonwebtoken");

// Generate a JWT token with user ID as payload
// Token expires in 30 days
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
