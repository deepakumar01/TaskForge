// models/Project.js
// Project model for managing team projects

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    // Name of the project
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [100, "Project name cannot exceed 100 characters"],
    },
    // Description of what the project is about
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    // The admin user who created this project
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // List of team members assigned to this project
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Current status of the project
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
    // Project deadline
    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
