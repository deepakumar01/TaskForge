// routes/dashboardRoutes.js
// Routes for dashboard analytics

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getDashboardStats,
  getActivities,
} = require("../controllers/dashboardController");

// All dashboard routes require authentication
router.use(protect);

// Get dashboard statistics
router.get("/stats", getDashboardStats);

// Get recent activity logs
router.get("/activities", getActivities);

module.exports = router;
