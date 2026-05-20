// routes/taskRoutes.js
// Routes for task management

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { protect, authorize } = require("../middleware/auth");
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getTasksByProject,
} = require("../controllers/taskController");

// All task routes require authentication
router.use(protect);

// Get all tasks (filtered by role and query params)
router.get("/", getTasks);

// Get tasks by project ID
router.get("/project/:projectId", getTasksByProject);

// Get a single task by ID
router.get("/:id", getTask);

// Create a new task (admin only)
router.post(
  "/",
  authorize("admin"),
  [
    body("title").notEmpty().withMessage("Task title is required"),
    body("project").notEmpty().withMessage("Project ID is required"),
  ],
  createTask
);

// Update a task (admin can update all, member can update status)
router.put("/:id", updateTask);

// Delete a task (admin only)
router.delete("/:id", authorize("admin"), deleteTask);

module.exports = router;
