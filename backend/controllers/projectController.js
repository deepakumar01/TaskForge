// controllers/projectController.js
// Handles CRUD operations for projects

const Project = require("../models/Project");
const Task = require("../models/Task");
const Activity = require("../models/Activity");
const { validationResult } = require("express-validator");

// Create a new project (admin only)
// POST /api/projects
const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { name, description, members, deadline } = req.body;

    // Create project with the current user as owner
    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: members || [],
      deadline,
    });

    // Log this activity
    await Activity.create({
      user: req.user._id,
      action: "created_project",
      description: req.user.name + " created project " + name,
      project: project._id,
    });

    // Populate owner and members info before sending response
    await project.populate("owner", "name email");
    await project.populate("members", "name email role");

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// Get all projects
// GET /api/projects
// Admin sees all projects, members see only their assigned projects
const getProjects = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    // Build filter query
    let filter = {};

    // If user is a member, only show projects they are part of
    if (req.user.role === "member") {
      filter.members = req.user._id;
    }

    // Search by project name
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Calculate pagination values
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count for pagination info
    const total = await Project.countDocuments(filter);

    // Fetch projects with pagination and populate references
    const projects = await Project.find(filter)
      .populate("owner", "name email")
      .populate("members", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: projects,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single project by ID
// GET /api/projects/:id
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email role avatar");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Members can only view projects they belong to
    if (
      req.user.role === "member" &&
      !project.members.some(
        (member) => member._id.toString() === req.user._id.toString()
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this project",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// Update a project (admin only)
// PUT /api/projects/:id
const updateProject = async (req, res, next) => {
  try {
    const { name, description, status, members, deadline } = req.body;

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Update project fields
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (status) project.status = status;
    if (members) project.members = members;
    if (deadline) project.deadline = deadline;

    await project.save();

    // Log the activity
    await Activity.create({
      user: req.user._id,
      action: "updated_project",
      description: req.user.name + " updated project " + project.name,
      project: project._id,
    });

    // Populate references before sending response
    await project.populate("owner", "name email");
    await project.populate("members", "name email role");

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a project and all its tasks (admin only)
// DELETE /api/projects/:id
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Delete all tasks belonging to this project
    await Task.deleteMany({ project: project._id });

    // Log the activity
    await Activity.create({
      user: req.user._id,
      action: "deleted_project",
      description: req.user.name + " deleted project " + project.name,
    });

    // Delete the project itself
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project and all its tasks deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Add a member to a project (admin only)
// PUT /api/projects/:id/members
const addMember = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user is already a member
    if (project.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "User is already a member of this project",
      });
    }

    // Add user to members array
    project.members.push(userId);
    await project.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: "added_member",
      description: req.user.name + " added a member to " + project.name,
      project: project._id,
    });

    await project.populate("members", "name email role");

    res.status(200).json({
      success: true,
      message: "Member added successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// Remove a member from a project (admin only)
// DELETE /api/projects/:id/members/:userId
const removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Remove user from members array
    project.members = project.members.filter(
      (member) => member.toString() !== req.params.userId
    );
    await project.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: "removed_member",
      description: req.user.name + " removed a member from " + project.name,
      project: project._id,
    });

    await project.populate("members", "name email role");

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
