// models/Activity.js
// Activity log model for tracking user actions

const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    // The user who performed the action
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Type of action performed
    action: {
      type: String,
      required: true,
      enum: [
        "created_project",
        "updated_project",
        "deleted_project",
        "added_member",
        "removed_member",
        "created_task",
        "updated_task",
        "deleted_task",
        "completed_task",
        "status_change",
      ],
    },
    // Description of what happened
    description: {
      type: String,
      required: true,
    },
    // Related project (optional)
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    // Related task (optional)
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Activity", activitySchema);
