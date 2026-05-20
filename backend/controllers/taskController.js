// controllers/taskController.js
// Handles CRUD operations for tasks

const Task = require("../models/Task");
const Project = require("../models/Project");
const Activity = require("../models/Activity");
const { validationResult } = require("express-validator");

// Create a new task (admin only)
// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { title, description, project, assignedTo, priority, dueDate } =
      req.body;

    // Verify the project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Create the task
    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      createdBy: req.user._id,
      priority: priority || "medium",
      dueDate,
    });

    // Log the activity
    await Activity.create({
      user: req.user._id,
      action: "created_task",
      description: req.user.name + " created task " + title,
      project,
      task: task._id,
    });

    // Populate references before sending response
    await task.populate("assignedTo", "name email");
    await task.populate("project", "name");
    await task.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// Get all tasks with filtering and pagination
// GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const {
      project,
      status,
      priority,
      assignedTo,
      search,
      page = 1,
      limit = 10,
      overdue,
    } = req.query;

    // Build filter query
    let filter = {};

    // If user is a member, only show their assigned tasks
    if (req.user.role === "member") {
      filter.assignedTo = req.user._id;
    }

    // Filter by project
    if (project) {
      filter.project = project;
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by priority
    if (priority) {
      filter.priority = priority;
    }

    // Filter by assigned user (admin can filter by any user)
    if (assignedTo && req.user.role === "admin") {
      filter.assignedTo = assignedTo;
    }

    // Search by task title
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // Filter overdue tasks
    if (overdue === "true") {
      filter.dueDate = { $lt: new Date() };
      filter.status = { $ne: "completed" };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(filter);

    // Fetch tasks with pagination
    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email avatar")
      .populate("project", "name")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: tasks,
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

// Get a single task by ID
// GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email avatar")
      .populate("project", "name")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Members can only view their own tasks
    if (
      req.user.role === "member" &&
      task.assignedTo &&
      task.assignedTo._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only view tasks assigned to you",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// Update a task
// PUT /api/tasks/:id
// Admins can update everything, members can only update status
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Members can only update status of their own tasks
    if (req.user.role === "member") {
      if (
        !task.assignedTo ||
        task.assignedTo.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only update tasks assigned to you",
        });
      }

      // Members can only change the status field
      const { status } = req.body;
      if (status) {
        task.status = status;
        // Record completion time
        if (status === "completed") {
          task.completedAt = new Date();
        } else {
          task.completedAt = null;
        }
      }
    } else {
      // Admin can update all fields
      const { title, description, assignedTo, priority, status, dueDate } =
        req.body;
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (assignedTo !== undefined) task.assignedTo = assignedTo;
      if (priority) task.priority = priority;
      if (status) {
        task.status = status;
        if (status === "completed") {
          task.completedAt = new Date();
        } else {
          task.completedAt = null;
        }
      }
      if (dueDate) task.dueDate = dueDate;
    }

    await task.save();

    // Determine the action type for activity log
    let actionType = "updated_task";
    if (req.body.status === "completed") {
      actionType = "completed_task";
    } else if (req.body.status) {
      actionType = "status_change";
    }

    // Log the activity
    await Activity.create({
      user: req.user._id,
      action: actionType,
      description: req.user.name + " updated task " + task.title,
      project: task.project,
      task: task._id,
    });

    // Populate and return updated task
    await task.populate("assignedTo", "name email avatar");
    await task.populate("project", "name");
    await task.populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a task (admin only)
// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Log activity before deleting
    await Activity.create({
      user: req.user._id,
      action: "deleted_task",
      description: req.user.name + " deleted task " + task.title,
      project: task.project,
    });

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get tasks by project ID
// GET /api/tasks/project/:projectId
const getTasksByProject = async (req, res, next) => {
  try {
    let filter = { project: req.params.projectId };

    // Members only see their own tasks
    if (req.user.role === "member") {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getTasksByProject,
};
