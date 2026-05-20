// middleware/auth.js
// Authentication middleware to protect routes using JWT

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify JWT token and attach user to request
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if the Authorization header contains a Bearer token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token is found, deny access
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - no token provided",
      });
    }

    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user from the token payload and attach to request
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - user not found",
      });
    }

    // Attach user info to request object for use in route handlers
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized - invalid token",
    });
  }
};

// Middleware to restrict access based on user role
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if the user role is in the allowed roles list
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
