// middleware/errorHandler.js
// Global error handling middleware

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error("Error:", err.message);

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    // Collect all validation error messages
    const messages = Object.values(err.errors).map((val) => val.message);
    message = messages.join(", ");
  }

  // Handle Mongoose duplicate key error (e.g., duplicate email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = "A record with this " + field + " already exists";
  }

  // Handle Mongoose bad ObjectId error
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Resource not found - invalid ID format";
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
  }

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

module.exports = errorHandler;
