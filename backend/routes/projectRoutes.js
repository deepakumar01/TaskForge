// routes/projectRoutes.js
// Routes for project management

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { protect, authorize } = require("../middleware/auth");
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require("../controllers/projectController");

// All project routes require authentication
router.use(protect);

// Get all projects (filtered by role)
router.get("/", getProjects);

// Get a single project by ID
router.get("/:id", getProject);

// Create a new project (admin only)
router.post(
  "/",
  authorize("admin"),
  [body("name").notEmpty().withMessage("Project name is required")],
  createProject
);

// Update a project (admin only)
router.put("/:id", authorize("admin"), updateProject);

// Delete a project (admin only)
router.delete("/:id", authorize("admin"), deleteProject);

// Add a member to a project (admin only)
router.put(
  "/:id/members",
  authorize("admin"),
  [body("userId").notEmpty().withMessage("User ID is required")],
  addMember
);

// Remove a member from a project (admin only)
router.delete("/:id/members/:userId", authorize("admin"), removeMember);

module.exports = router;
