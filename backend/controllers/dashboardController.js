// controllers/dashboardController.js
// Handles dashboard analytics and statistics

const Task = require("../models/Task");
const Project = require("../models/Project");
const Activity = require("../models/Activity");

// Get dashboard statistics
// GET /api/dashboard/stats
const getDashboardStats = async (req, res, next) => {
  try {
    let projectFilter = {};
    let taskFilter = {};

    // Members only see stats for their projects and tasks
    if (req.user.role === "member") {
      projectFilter.members = req.user._id;
      taskFilter.assignedTo = req.user._id;
    }

    // Count total projects
    const totalProjects = await Project.countDocuments(projectFilter);

    // Count projects by status
    const activeProjects = await Project.countDocuments({
      ...projectFilter,
      status: "active",
    });
    const completedProjects = await Project.countDocuments({
      ...projectFilter,
      status: "completed",
    });

    // Count total tasks
    const totalTasks = await Task.countDocuments(taskFilter);

    // Count tasks by status
    const pendingTasks = await Task.countDocuments({
      ...taskFilter,
      status: "pending",
    });
    const inProgressTasks = await Task.countDocuments({
      ...taskFilter,
      status: "in-progress",
    });
    const completedTasks = await Task.countDocuments({
      ...taskFilter,
      status: "completed",
    });

    // Count overdue tasks (past due date and not completed)
    const overdueTasks = await Task.countDocuments({
      ...taskFilter,
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" },
    });

    // Count tasks by priority
    const highPriorityTasks = await Task.countDocuments({
      ...taskFilter,
      priority: "high",
      status: { $ne: "completed" },
    });
    const mediumPriorityTasks = await Task.countDocuments({
      ...taskFilter,
      priority: "medium",
      status: { $ne: "completed" },
    });
    const lowPriorityTasks = await Task.countDocuments({
      ...taskFilter,
      priority: "low",
      status: { $ne: "completed" },
    });

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        activeProjects,
        completedProjects,
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
        highPriorityTasks,
        mediumPriorityTasks,
        lowPriorityTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get recent activity logs
// GET /api/dashboard/activities
const getActivities = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

    const activities = await Activity.find()
      .populate("user", "name email avatar")
      .populate("project", "name")
      .populate("task", "title")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getActivities,
};
