// routes/authRoutes.js
// Routes for user authentication and profile management

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { protect, authorize } = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  getAllUsers,
} = require("../controllers/authController");

// Public routes - no authentication needed

// Register a new user
// Validates name, email, and password before processing
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  registerUser
);

// Login an existing user
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginUser
);

// Protected routes - authentication required

// Get current user profile
router.get("/me", protect, getMe);

// Update user profile
router.put("/profile", protect, updateProfile);

// Get all users (admin only - used for adding members to projects)
router.get("/users", protect, getAllUsers);

module.exports = router;
