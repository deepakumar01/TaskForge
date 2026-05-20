// models/Task.js
// Task model for managing individual tasks within projects

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    // Title of the task
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    // Detailed description of the task
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },
    // The project this task belongs to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    // The user this task is assigned to
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // The user who created this task
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Task priority level
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    // Current status of the task
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    // Due date for the task
    dueDate: {
      type: Date,
    },
    // When the task was marked as completed
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field to check if task is overdue
taskSchema.virtual("isOverdue").get(function () {
  if (this.status === "completed") return false;
  if (!this.dueDate) return false;
  return new Date() > this.dueDate;
});

// Make sure virtuals are included when converting to JSON
taskSchema.set("toJSON", { virtuals: true });
taskSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Task", taskSchema);
