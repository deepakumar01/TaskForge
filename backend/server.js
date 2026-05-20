// server.js
// Main entry point for the TaskForge backend

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS so the frontend can communicate with the backend
app.use(
  cors({
    origin: "http://localhost:5173", // Vite default dev server port
    credentials: true,
  })
);

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskForge API is running",
  });
});

// Global error handler middleware (must be after routes)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("TaskForge server running on port " + PORT);
});
